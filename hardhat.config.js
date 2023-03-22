const { network } = require("hardhat");

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  network: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: process.env.PRIVATE_KEY,
    },
  },
};
