require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28", // for Lock.sol or others using ^0.8.28
      },
      {
        version: "0.8.20", // for AXISRWAOwnershipToken.sol or others using ^0.8.20
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
