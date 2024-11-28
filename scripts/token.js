// scripts/deployMyToken.js
const hre = require("hardhat");

async function main() {
    // The name and symbol for your token. Adjust these values as necessary.
    const tokenName = "MyToken2";
    const tokenSymbol = "MTK2";

    // The wallet address that will receive half of the token supply.
    // Replace with an actual BASE address.
    const walletAddress = "0x8cfdF539DDf72A1DDD011f141b29ceC85f511b88";

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
