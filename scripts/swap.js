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
    const tokenAAddress = "0x1894488752dF7Ea0e765144C4d281414065eb67e"; // Token A address
    const tokenBAddress = "0xe59256359319A0959ebC096ef671656bd871910c"; // Token B address
    const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"; // Router address
    const factoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"; // Factory address

    // Router ABI for `swapExactTokensForTokens` and `getAmountsOut`
    // const routerABI = [
    //     "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, (address,address,bool,address)[] calldata routes, address to, uint deadline) external returns (uint[] memory amounts)",
    //     "function getAmountsOut(uint amountIn, (address,address,bool,address)[] calldata routes) external view returns (uint[] memory amounts)"
    // ];

    const router = new ethers.Contract(routerAddress, routerABI, deployerSigner);

    // Swap parameters
    const amountIn = ethers.utils.parseUnits("10", 18); // Amount of Token A to swap (10 tokens)
    const amountOutMin = ethers.utils.parseUnits("1", 18); // Minimum acceptable amount of Token B
    const route = [
        {
            from: tokenAAddress,
            to: tokenBAddress,
            stable: false, // Adjust based on whether the pair is stable
            factory: factoryAddress,
        },
    ];
    const to = deployerSigner.address; // Recipient of Token B
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    console.log("Preparing to approve Token A...");
    const tokenA = await ethers.getContractAt("IERC20", tokenAAddress, deployerSigner);

    // Approve Token A
    const allowance = await tokenA.allowance(deployerSigner.address, routerAddress);
    if (allowance.lt(amountIn)) {
        const tx = await tokenA.approve(routerAddress, ethers.constants.MaxUint256);
        await tx.wait();
        console.log("Token A approved for router.");
    } else {
        console.log("Token A already approved.");
    }

    console.log("Estimating output amounts...");
    let amountsOut;
    try {
        amountsOut = await router.getAmountsOut(amountIn, route);
        console.log(
            `Estimated output: ${ethers.utils.formatUnits(amountsOut[1], 18)} Token B`
        );
    } catch (error) {
        console.error("Error in getAmountsOut:", error.message);
        return;
    }

    console.log("Performing the token swap...");
    try {
        const tx = await router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            route,
            to,
            deadline
        );
        const receipt = await tx.wait();
        console.log("Swap transaction completed. Tx hash:", receipt.transactionHash);
    } catch (error) {
        console.error("Error performing the swap:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during script execution:", error.message);
        process.exit(1);
    });
