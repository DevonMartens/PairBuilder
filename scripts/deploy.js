const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Addresses for token A, token B, and Aerodrome Factory
    const tokenAAddress = "0x5eB72e475aAf2af3F486aB87DA63EAc6142E65B6";
    const tokenBAddress = "0x10625428CA0D471492A449f2Ee0E743420ae2186";
    const aerodromeFactoryAddress = "0xYourAerodromeFactoryAddress"; // Replace with the actual factory address

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
