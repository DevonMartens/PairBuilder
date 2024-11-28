# Aerodrome Token Deployment and Liquidity Pool Setup

This guide outlines the steps to deploy two ERC-20 tokens, create a liquidity pool for them on Aerodrome, and perform a token swap. 

---

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. **Hardhat**: Install [Hardhat](https://hardhat.org/).
3. **Dependencies**: Run the following command in your project root to install required dependencies:
   ```bash
   npm install
    ```

---

## Steps

1. Deploy Two ERC-20 Tokens
You will deploy two custom ERC-20 tokens (TokenA and TokenB) with the following steps:

Prepare the deployment script for each token. Ensure that each token (you will need two tokens for a pool):

Has a unique name and symbol:

    ```javascript
    const tokenName = "MyToken2";
    const tokenSymbol = "MTK2";
    ```

Allocates an initial supply to a wallet address (e.g., the deployer's address):

    ```javascript
    // The wallet address that will receive half of the token supply.
    // Replace with an actual BASE address.
    const walletAddress = "0x8cfdF539DDf72A1DDD011f141b29ceC85f511b88";
    ```

Run the deployment scripts:

    ```javascript
    npx hardhat run scripts/token.js --network baseMainnet
    ```

## 2. Create a Liquidity Pool

Configure the Pool Creation Script:

Update the tokenAAddress and tokenBAddress in the script with the addresses of the deployed tokens.

Specify whether the pool should be a stable pool (true) or not (false).

Run the pool creation script:

    ```javascript
    npx hardhat run scripts/pool.js --network baseMainnet
    ```

## 3. Swap Tokens

Update the `tokenAAddress`, `tokenBAddress`, and `routerAddress` with the appropriate values. The router should be consistent.


The script will:

Approve Tokens: Ensure the deployer address approves the router contract to spend both TokenA and TokenB. The swap script handles this automatically if not already approved.

Configure the Swap Script:


Specify the amount of TokenA to swap and the minimum acceptable amount of TokenB to receive.
Run the swap script:

    ```javascript
    npx hardhat run scripts/swap.js --network baseMainnet
    ```

Verify the output for a successful swap transaction. Example:

Swap transaction completed. Tx hash: 0xTransactionHash

You can search it in `https://basescan.org/`