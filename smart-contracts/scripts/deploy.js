const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const Factory = await hre.ethers.getContractFactory("AXISRWAOwnershipTokenFactory");
  const factory = await Factory.deploy();
  await factory.deployed();

  console.log("AXISRWAOwnershipTokenFactory deployed at:", factory.address);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});