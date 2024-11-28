const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Define token addresses and factory address
    const tokenAAddress = "0x1894488752dF7Ea0e765144C4d281414065eb67e";
    const tokenBAddress = "0xe59256359319A0959ebC096ef671656bd871910c";
    const aerodromeFactoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";

    // ABI for Aerodrome Factory with the `createPool` function
    const aerodromeFactoryABI = [
        "function createPool(address tokenA, address tokenB, bool stable) external returns (address pool)",
        "function getPool(address tokenA, address tokenB, bool stable) external view returns (address)",
        "function isPaused() external view returns (bool)",
        "event PoolCreated(address indexed token0, address indexed token1, bool indexed stable, address pool, uint256)"
    ];

    // Connect to the Aerodrome Factory Contract
    const aerodromeFactory = new ethers.Contract(aerodromeFactoryAddress, aerodromeFactoryABI, deployer);

    // Check if the factory is paused
    const isPaused = await aerodromeFactory.isPaused();
    if (isPaused) {
        console.error("Factory is paused. Cannot create pools.");
        return;
    }

    // Verify if a pool already exists
    const stable = true; // Specify whether this is a stable pool
    const existingPool = await aerodromeFactory.getPool(tokenAAddress, tokenBAddress, stable);
    if (existingPool !== ethers.constants.AddressZero) {
        console.log("Pool already exists at:", existingPool);
        return;
    }

    console.log("Creating a new pool...");
    try {
        // Create the pool
        const tx = await aerodromeFactory.createPool(tokenAAddress, tokenBAddress, stable);
        const receipt = await tx.wait();

        // Find the PoolCreated event in the receipt
        const poolCreatedEvent = receipt.events?.find((e) => e.event === "PoolCreated");
        if (poolCreatedEvent) {
            console.log("Pool created successfully at:", poolCreatedEvent.args.pool);
        } else {
            console.error("Pool creation succeeded, but no PoolCreated event was emitted.");
        }
    } catch (error) {
        console.error("Error creating pool:", error.reason || error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
