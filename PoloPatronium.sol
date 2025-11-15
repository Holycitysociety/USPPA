// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract PoloPatronium is ERC1967Proxy {
    constructor(
        address implementation,
        address[] memory operators,
        address owner_
    )
        ERC1967Proxy(
            implementation,
            abi.encodeWithSignature(
                "initialize(address[],address)",
                operators,
                owner_
            )
        )
    {}
}
