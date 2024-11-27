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

const { DEPLOYER_PRIVATE_KEY, ETH_TESTNET_RPC_URL, ETHERSCAN_API_KEY, BASE_TESTNET_RPC_URL, BASE_RPC_URL } = process.env;

module.exports = {
  docgen: {},
  networks: {
    hardhat: {
      mining: {
        blockGasLimit: 100000000,
      },
    },
    testnet: { // Corrected
      url: ETH_TESTNET_RPC_URL, // Use the variable directly
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
    baseSepolia: { // Corrected
      url: BASE_TESTNET_RPC_URL, // Use the variable directly
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
      chainId: 84531, // Base Sepolia Chain ID
    },
    baseMainnet: { // Corrected
      url: BASE_RPC_URL, // Use the variable directly
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
      chainId: 8453, // Base Mainnet Chain ID
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY, // Use the variable directly
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
