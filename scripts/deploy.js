const { ethers } = require("hardhat");



async function main() {
    const [deployer] = await ethers.getSigners();

    const tokenAAddress = "0x5eB72e475aAf2af3F486aB87DA63EAc6142E65B6";
    const tokenBAddress = "0x10625428CA0D471492A449f2Ee0E743420ae2186";
    const uniswapFactoryAddress = "0xB7f907f7A9eBC822a80BD25E224be42Ce0A698A0";

    const uniswapFactoryABI = [
        "function createPair(address tokenA, address tokenB) external returns (address pair)",
    ];

    // The correction is here: Use `getContractAt` with signer
    const uniswapFactory = new ethers.Contract(uniswapFactoryAddress, uniswapFactoryABI, deployer);

    console.log("Creating pair...");
    const tx = await uniswapFactory.createPair(tokenAAddress, tokenBAddress);
    const receipt = await tx.wait();

    console.log("Pair created:", receipt.events?.find((e) => e.event === "PairCreated")?.args?.pair);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
