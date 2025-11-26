// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract PoloPatroniumV2 is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, OwnableUpgradeable {
    function initialize(address[] memory defaultOperators_, address owner_) public initializer {
        // Ignore defaultOperators_ for ERC20 (no operators in ERC20)
        __ERC20_init("Polo Patronium", "PATRON");
        __ERC20Permit_init("Polo Patronium");
        __Ownable_init();
        transferOwnership(owner_);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}