// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/Initializable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/token/ERC20/ERC20Upgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/access/OwnableUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/UUPSUpgradeable.sol";

contract PoloPatroniumV1 is
    Initializable,
    ERC20Upgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @notice initializer for the implementation (used by the proxy)
    function initialize(address owner_) public initializer {
        // Set token name & symbol
        __ERC20_init("Polo Patronium", "PATRON");

        // Set owner
        __Ownable_init();
        _transferOwnership(owner_);

        // UUPS init
        __UUPSUpgradeable_init();
    }

    /// @notice mint new tokens (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice burn your own tokens
    function burn(uint256 amount) external {
        _burn(_msgSender(), amount);
    }

    /// @notice burn tokens from an address using allowance
    function burnFrom(address from, uint256 amount) external {
        uint256 currentAllowance = allowance(from, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");

        unchecked {
            _approve(from, _msgSender(), currentAllowance - amount);
        }

        _burn(from, amount);
    }

    /// @notice simple version tag
    function version() external pure returns (string memory) {
        return "PoloPatroniumV1-ERC20";
    }

    /// @dev UUPS upgrade auth
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}