// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20SnapshotUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract PoloPatroniumV2 is 
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    ERC20SnapshotUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address owner_) public initializer {
        __ERC20_init("Polo Patronium", "PATRON");
        __ERC20Burnable_init();
        __ERC20Permit_init("Polo Patronium");
        __ERC20Snapshot_init();
        __Pausable_init();
        __Ownable_init(owner_);
        __AccessControl_init();
        __UUPSUpgradeable_init();

        // Owner gets DEFAULT_ADMIN_ROLE
        _grantRole(DEFAULT_ADMIN_ROLE, owner_);

        // Owner also gets OPERATOR_ROLE initially
        _grantRole(OPERATOR_ROLE, owner_);
    }

    // -----------------------------
    //         SNAPSHOTS
    // -----------------------------
    function snapshot() external onlyOwner returns (uint256) {
        return _snapshot();
    }

    // -----------------------------
    //         MINTING
    // -----------------------------
    function mint(address to, uint256 amount) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || msg.sender == owner(),
            "Not operator or owner"
        );
        _mint(to, amount);
    }

    function mintToMany(address[] calldata recipients, uint256 amountEach) external {
        require(
            hasRole(OPERATOR_ROLE, msg.sender) || msg.sender == owner(),
            "Not operator or owner"
        );
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amountEach);
        }
    }

    // -----------------------------
    //         OPERATORS
    // -----------------------------
    function addOperator(address account) external onlyOwner {
        _grantRole(OPERATOR_ROLE, account);
    }

    function removeOperator(address account) external onlyOwner {
        _revokeRole(OPERATOR_ROLE, account);
    }

    function listOperators() external view returns (address[] memory) {
        uint256 count = getRoleMemberCount(OPERATOR_ROLE);
        address[] memory list = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            list[i] = getRoleMember(OPERATOR_ROLE, i);
        }

        return list;
    }

    // -----------------------------
    //          PAUSE / UNPAUSE
    // -----------------------------
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // -----------------------------
    //        HOOK OVERRIDES
    // -----------------------------
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20SnapshotUpgradeable) whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    // -----------------------------
    //        UUPS AUTHORIZATION
    // -----------------------------
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
