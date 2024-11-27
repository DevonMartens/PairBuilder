const { ethers } = require("hardhat");

async function main() {
    const [deployerSigner] = await ethers.getSigners(); // Get the deployer's signer object

    const deployerAddress = "0x8cfdF539DDf72A1DDD011f141b29ceC85f511b88";

    // Addresses for tokens and router
    const tokenAAddress = "0x1894488752dF7Ea0e765144C4d281414065eb67e";
    const tokenBAddress = "0xe59256359319A0959ebC096ef671656bd871910c";
    const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"; 
    const factoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";

    // Router ABI for `swapExactTokensForTokens` and `getAmountsOut`
    const routerABI = [
        "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, (address,address,bool,address)[] calldata routes, address to, uint256 deadline) external returns (uint256[] memory amounts)",
        "function getAmountsOut(uint256 amountIn, (address,address,bool,address)[] calldata routes) external view returns (uint256[] memory amounts)"
    ];

    const router = new ethers.Contract(routerAddress, routerABI, deployerSigner); // Correct signer usage

    // Swap parameters
    const amountIn = ethers.utils.parseUnits("1.0", 18); // Amount of Token A to swap (1 token with 18 decimals)
    const amountOutMin = ethers.utils.parseUnits("0.5", 18); // Minimum acceptable amount of Token B (0.5 token)
    const route = [
        {
            from: tokenAAddress,
            to: tokenBAddress,
            stable: false, // Adjust this based on whether the pair is stable
            factory: factoryAddress,
        },
    ];
    const to = deployerAddress; // Recipient of Token B
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    // Approve the router to spend Token A
    const tokenA = await ethers.getContractAt("IERC20", tokenAAddress, deployerSigner);
    const allowance = await tokenA.allowance(deployerAddress, routerAddress); // Fix allowance check

    if (allowance.lt(amountIn)) {
        console.log("Approving tokens...");
        const approveTx = await tokenA.approve(routerAddress, ethers.constants.MaxUint256); // Approve max amount
        await approveTx.wait();
        console.log("Approval transaction completed.");
    }

    // Get estimated amounts out
    try {
        const amountsOut = await router.getAmountsOut(amountIn, route);
        console.log(`Estimated output: ${ethers.utils.formatUnits(amountsOut[1], 18)} Token B`);
    } catch (error) {
        console.error("Error estimating output amounts:", error.message);
        return;
    }

    // Perform the swap
    try {
        console.log("Performing the token swap...");
        const tx = await router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            route,
            to,
            deadline
        );
        const receipt = await tx.wait();
        console.log("Swap transaction completed:", receipt.transactionHash);
    } catch (error) {
        console.error("Error performing the swap:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });