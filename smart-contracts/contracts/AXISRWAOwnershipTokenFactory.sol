// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AXISRWAOwnershipToken.sol";

contract AXISRWAOwnershipTokenFactory {
    event TokenDeployed(address tokenAddress, string name, string symbol);

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) external returns (address) {
        AXISRWAOwnershipToken token = new AXISRWAOwnershipToken(
            name,
            symbol,
            initialSupply,
            owner
        );

        emit TokenDeployed(address(token), name, symbol);
        return address(token);
    }
}