const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    // Addresses for tokens and router
    const tokenAAddress = "0x5eB72e475aAf2af3F486aB87DA63EAc6142E65B6";
    const tokenBAddress = "0x10625428CA0D471492A449f2Ee0E743420ae2186";
    const routerAddress = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43"; 
    const factoryAddress = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da";

    // Router ABI for `swapExactTokensForTokens`
    const routerABI = [
        "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, Route[] calldata routes, address to, uint deadline) external returns (uint[] memory amounts)",
        "function getAmountsOut(uint amountIn, Route[] calldata routes) external view returns (uint[] memory amounts)"
    ];

    const router = new ethers.Contract(routerAddress, routerABI, deployer);

    // Swap parameters
    const amountIn = ethers.parseUnits("1.0", 18); // Replace with the desired amount of token A to swap
    const amountOutMin = ethers.parseUnits("0.5", 18); // Replace with the minimum acceptable amount of token B
    const route = [
        {
            from: tokenAAddress,
            to: tokenBAddress,
            stable: false, // Adjust this based on whether the pair is stable
            factory: factoryAddress,
        },
    ];
    const to = deployer.address; // Recipient of Token B
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    // Approve the router to spend token A
    const tokenA = await ethers.getContractAt("IERC20", tokenAAddress, deployer);
    const allowance = await tokenA.allowance(deployer.address, routerAddress);
    if (allowance.lt(amountIn)) {
        console.log("Approving tokens...");
        const approveTx = await tokenA.approve(routerAddress, amountIn);
        await approveTx.wait();
    }

    // Get estimated amounts out
    const amountsOut = await router.getAmountsOut(amountIn, route);
    console.log(`Estimated output: ${ethers.formatUnits(amountsOut[1], 18)} Token B`);

    // Perform the swap
    console.log("Swapping tokens
