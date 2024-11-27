require("dotenv").config();
const { ethers } = require("hardhat");
const routerABI = require('./route_abi.json');
async function main() {
    console.log("Script started.");

    // Load private key from .env
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) {
        console.error("Private key not found in .env file.");
        process.exit(1);
    }

    // Create deployer signer using the private key
    const provider = ethers.provider; // Use the default Hardhat provider
    const deployerSigner = new ethers.Wallet(privateKey, provider);
    console.log("Deployer address:", deployerSigner.address);

    // Addresses for tokens and router
    const tokenAAddress = "0x1894488752dF7Ea0e765144C4d281414065eb67e";
    const tokenBAddress = "0xe59256359319A0959ebC096ef671656bd871910c";
    const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";
    const factoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";

    // Router ABI for adding liquidity
    // const routerABI = [
    //     "function addLiquidity(address tokenA, address tokenB, bool stable, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
    //     "function getReserves(address tokenA, address tokenB, bool stable, address factory) external view returns (uint reserveA, uint reserveB)"
    // ];
    const router = new ethers.Contract(routerAddress, routerABI, deployerSigner);

    // Token approval
    console.log("Approving tokens for router...");
    const tokenA = await ethers.getContractAt("IERC20", tokenAAddress, deployerSigner);
    const tokenB = await ethers.getContractAt("IERC20", tokenBAddress, deployerSigner);

    // Approve Token A
    let tx = await tokenA.approve(routerAddress, ethers.constants.MaxUint256);
    await tx.wait();
    console.log("Token A approved for router.");

    // Approve Token B
    tx = await tokenB.approve(routerAddress, ethers.constants.MaxUint256);
    await tx.wait();
    console.log("Token B approved for router.");

    // Liquidity parameters
    const amountADesired = ethers.utils.parseUnits("100", 18); // 100 Token A
    const amountBDesired = ethers.utils.parseUnits("500000000000", 18);  // 50 Token B
    const amountAMin = ethers.utils.parseUnits("90", 18);      // Minimum 90 Token A
    const amountBMin = ethers.utils.parseUnits("45", 18);      // Minimum 45 Token B
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;  // 10 minutes from now

    console.log("Adding liquidity...");

    try {
        tx = await router.addLiquidity(
            tokenAAddress,
            tokenBAddress,
            false, // Set to `true` for stable pairs
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            deployerSigner.address, // Liquidity recipient
            deadline
        );
        const receipt = await tx.wait();
        console.log("Liquidity added successfully. Transaction hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error adding liquidity:", error.message);
        return;
    }

    console.log("Fetching pool reserves...");
    try {
        const [reserveA, reserveB] = await router.getReserves(
            tokenAAddress,
            tokenBAddress,
            false, // Set to `true` for stable pairs
            factoryAddress
        );
        console.log("Pool Reserves:");
        console.log("Token A:", ethers.utils.formatUnits(reserveA, 18));
        console.log("Token B:", ethers.utils.formatUnits(reserveB, 18));
    } catch (error) {
        console.error("Error fetching reserves:", error.message);
    }

    console.log("Script completed.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during script execution:", error.message);
        process.exit(1);
    });
