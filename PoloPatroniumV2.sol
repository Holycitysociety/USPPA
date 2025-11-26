// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/token/ERC20/ERC20Upgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/access/OwnableUpgradeable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/Initializable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/v4.9.3/contracts/proxy/utils/UUPSUpgradeable.sol";

contract PoloPatroniumV2 is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    OwnableUpgradeable, 
    UUPSUpgradeable 
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_) public initializer {
        __ERC20_init("Polo Patronium", "PATRON");
        __ERC20Burnable_init();
        __ERC20Permit_init("Polo Patronium");
        __Ownable_init();
        __UUPSUpgradeable_init();

        _transferOwnership(owner_);
    }

    // ─────────────────────────────────────────────
    // Minting for treasury/owner
    // ─────────────────────────────────────────────

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function mintToMany(address[] calldata recipients, uint256 amountEach)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amountEach);
        }
    }

    // ─────────────────────────────────────────────
    // Version tracking
    // ─────────────────────────────────────────────

    function version() external pure returns (string memory) {
        return "PoloPatroniumV2";
    }

    // ─────────────────────────────────────────────
    // UUPS upgrade authorization
    // ─────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}