const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("AXISRWAOwnershipToken");

  // Customize these:
  const name = "Axis Hotel Token";
  const symbol = "AXHT";
  const initialSupply = 1000000; // 1 million tokens

  const token = await Token.deploy(name, symbol, initialSupply);
  await token.deployed();

  console.log(`Deployed ${symbol} at: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});