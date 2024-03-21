// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(address wallet) 
    ERC20("token2", "2")  {
        uint halfSupply = 500000000 * 1e18;
        // 1/2 million
        _mint(wallet, halfSupply);
        _mint(msg.sender, halfSupply);
    }
}