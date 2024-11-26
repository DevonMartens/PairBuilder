const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Addresses for token A, token B, and Aerodrome Factory
    const tokenAAddress = "0x";
    const tokenBAddress = "0x";
    const aerodromeFactoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"; 

    // Aerodrome Factory ABI (compatible with Uniswap's Factory)
    const aerodromeFactoryABI = [
        "function createPair(address tokenA, address tokenB) external returns (address pair)",
        "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
    ];

    // Connect to the Aerodrome Factory Contract
    const aerodromeFactory = new ethers.Contract(aerodromeFactoryAddress, aerodromeFactoryABI, deployer);

    console.log("Creating pair on Aerodrome...");
    const tx = await aerodromeFactory.createPair(tokenAAddress, tokenBAddress);
    const receipt = await tx.wait();

    // Retrieve the created pair address from the PairCreated event
    const pairCreatedEvent = receipt.events?.find((e) => e.event === "PairCreated");
    if (pairCreatedEvent) {
        console.log("Pair created successfully:", pairCreatedEvent.args.pair);
    } else {
        console.error("Pair creation failed or event not emitted.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
