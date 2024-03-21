// scripts/deployMyToken.js
const hre = require("hardhat");

async function main() {
    // The name and symbol for your token. Adjust these values as necessary.
    const tokenName = "MyToken";
    const tokenSymbol = "MTK";

    // The wallet address that will receive half of the token supply.
    // Replace '0xYOUR_WALLET_ADDRESS_HERE' with an actual Ethereum address.
    const walletAddress = "0xDaDb20c3E958671aB05130a8979Ab61b09F1045B";

    // Deploying the MyToken contract
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(walletAddress);

    await myToken.deployed();

    console.log("MyToken deployed to:", myToken.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
