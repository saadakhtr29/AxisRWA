const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { ethers } = require("ethers");
const { JsonRpcProvider } = ethers;

// Global provider and wallet (used for all transactions)
const provider = new JsonRpcProvider(process.env.RPC_URL); // Use the RPC_URL (can be Alchemy, Infura, etc.)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load ABI & Bytecode for per-asset token (ERC20)
const TOKEN_ARTIFACT = require("../abis/AXISRWAOwnershipToken.json");
const TOKEN_ABI = TOKEN_ARTIFACT.abi;
const TOKEN_BYTECODE = TOKEN_ARTIFACT.bytecode;

// Load Factory ABI & Bytecode
const FactoryArtifact = require("../abis/FactoryContract.json");

/**
 * Create ownership record in DB
 */
const createOwnershipRecord = async (userId, assetId, quantity, txHash) => {
  return prisma.ownershipToken.create({
    data: { userId, assetId, quantity, txHash },
  });
};

/**
 * Get ownerships by user
 */
const getOwnershipByUser = async (userId) => {
  return prisma.ownershipToken.findMany({
    where: { userId },
    include: { asset: true },
  });
};

/**
 * Get ownerships by asset
 */
const getOwnershipByAsset = async (assetId) => {
  return prisma.ownershipToken.findMany({
    where: { assetId },
    include: { user: true },
  });
};

/**
 * Get ownership by transaction hash
 */
const getByTxHash = async (txHash) => {
  return prisma.ownershipToken.findUnique({
    where: { txHash },
  });
};

/**
 * Get ownership by ID
 */
const getOwnershipById = async (id) => {
  return prisma.ownershipToken.findUnique({
    where: { id },
    include: { user: true, asset: true },
  });
};

/**
 * Delete ownership
 */
const deleteOwnership = async (id) => {
  try {
    return await prisma.ownershipToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};

/**
 * Deploy a new ERC20 token contract for an asset
 * @param {string} assetTitle
 * @param {string} symbol
 * @param {string} initialSupply
 * @returns {Promise<string>} - deployed token contract address
 */
/**
 * Deploy a new ERC20 token contract for an asset using factory
 */
const deployOwnershipTokenForAsset = async (assetTitle, symbol, initialSupply) => {
  try {
    if (!assetTitle || !symbol || !initialSupply) {
      throw new Error("Missing required parameters for token deployment.");
    }

    const factory = new ethers.ContractFactory(
      FactoryArtifact.abi,
      FactoryArtifact.bytecode,
      wallet // signer
    );

    // 1. Deploy the factory contract
    const factoryContract = await factory.deploy();
    console.log("Factory contract deployed at:", factoryContract.address);

    // 2. Wait for it to be mined
    await factoryContract.waitForDeployment?.(); // ethers v6+
    // OR, if using ethers v5:
    // await factoryContract.deployTransaction.wait();

    const parsedSupply = ethers.BigNumber.from(initialSupply.toString());

    // 3. Call the createToken function
    const tx = await factoryContract.createToken(
      assetTitle,
      symbol,
      parsedSupply,
      wallet.address // owner of the token
    );

    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "TokenDeployed");

    if (!event || !event.args || !event.args.tokenAddress) {
      throw new Error("TokenDeployed event not found");
    }

    return event.args.tokenAddress;
  } catch (err) {
    console.error("Token deployment failed:", err);
    throw err;
  }
};


/**
 * Mint tokens for a specific asset
 * @param {string} assetId
 * @param {string} toWalletAddress
 * @param {number} amount
 * @returns {Promise<string>} tx hash
 */
const mintOwnershipTokens = async (assetId, toWalletAddress, amount) => {
  if (!assetId || !toWalletAddress || !amount || amount <= 0) {
    throw new Error("Invalid mint params");
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
  });

  if (!asset || !asset.tokenAddress) {
    throw new Error("Asset token contract not found");
  }

  const contract = new ethers.Contract(asset.tokenAddress, TOKEN_ABI, wallet);

  const tx = await contract.mint(
    toWalletAddress,
    ethers.parseUnits(amount.toString(), 18)
  );

  await tx.wait();
  return tx.hash;
};

module.exports = {
  createOwnershipRecord,
  getOwnershipByUser,
  getOwnershipByAsset,
  getByTxHash,
  getOwnershipById,
  deleteOwnership,
  deployOwnershipTokenForAsset,
  mintOwnershipTokens,
};
