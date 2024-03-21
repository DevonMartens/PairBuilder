require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-solhint");
require("hardhat-contract-sizer");
require("solidity-docgen");
require("dotenv").config();

const { DEPLOYER_PRIVATE_KEY, TESTNET_RPC_URL, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  docgen: {},
  networks: {
    hardhat: {
      mining: {
        blockGasLimit: 100000000,
      },
    },
    testnet: { // Correct placement as a sibling to the 'hardhat' network configuration
      url: 'https://sepolia.infura.io/v3/APIKEY',
      accounts: [`0x${'YOUR PRIVATE KEY'}`],
    },
  },
  etherscan: {
    apiKey: 'APIKEY',
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    noColors: process.env.GAS_REPORT_NO_COLOR === 'true',
    token: "ETH",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};