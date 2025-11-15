// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/token/ERC777/ERC777Upgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/access/OwnableUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/Initializable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/UUPSUpgradeable.sol";

contract PoloPatroniumV1 is Initializable, ERC777Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    function initialize(address[] memory operators, address owner_) public initializer {
        __Ownable_init();
        _transferOwnership(owner_);

        __ERC777_init("Polo Patronium", "PATRON", operators);
        __UUPSUpgradeable_init();
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount, "", "");
    }

    function burn(uint256 amount) external {
        _burn(_msgSender(), amount, "", "");
    }

    function mintToMany(address[] calldata recipients, uint256 amountEach) external onlyOwner {
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amountEach, "", "");
        }
    }

    function version() external pure returns (string memory) {
        return "PoloPatroniumV1";
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
