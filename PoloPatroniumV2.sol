// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@thirdweb-dev/contracts/extension/ContractMetadata.sol";
import "@thirdweb-dev/contracts/extension/PrimarySale.sol";

// List of basic functions for a developer (including inherited ones):
// 1. initialize(address[] memory defaultOperators_, address owner_) - Initializer for proxy deployment.
// 2. name() - Returns the token name.
// 3. symbol() - Returns the token symbol.
// 4. decimals() - Returns the token decimals.
// 5. totalSupply() - Returns the total token supply.
// 6. balanceOf(address tokenHolder) - Returns the balance of a holder.
// 7. transfer(address to, uint256 amount) - Transfers tokens (ERC20-compatible).
// 8. approve(address spender, uint256 amount) - Approves spender (ERC20).
// 9. transferFrom(address from, address to, uint256 amount) - Transfers from approved (ERC20).
// 10. permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) - Gasless approval (EIP-2612).
// 11. send(address to, uint256 amount, bytes memory data) - ERC777 send with data.
// 12. operatorSend(address from, address to, uint256 amount, bytes memory data, bytes memory operatorData) - Operator send (ERC777).
// 13. burn(uint256 amount, bytes memory data) - Burn tokens (ERC777).
// 14. authorizeOperator(address operator) - Authorize operator (ERC777).
// 15. revokeOperator(address operator) - Revoke operator (ERC777).
// 16. isOperatorFor(address operator, address tokenHolder) - Check operator (ERC777).
// 17. mint(address to, uint256 amount) - Mint new tokens (ownable).
// 18. _setURI(string memory newuri) - Set contract metadata URI (Thirdweb).
// 19. primarySaleRecipient() - Get primary sale recipient (Thirdweb).
// 20. setPrimarySaleRecipient(address recipient) - Set primary sale recipient (Thirdweb).
// 21. owner() - Get owner.
// 22. transferOwnership(address newOwner) - Transfer ownership.

contract PoloPatroniumV2 is Initializable, ERC777Upgradeable, OwnableUpgradeable, ERC20PermitUpgradeable, ContractMetadata, PrimarySale {
    function initialize(address[] memory defaultOperators_, address owner_) public initializer {
        __ERC777Upgradeable_init("Polo Patronium", "PATRON", defaultOperators_);
        __OwnableUpgradeable_init();
        transferOwnership(owner_);
        __ERC20PermitUpgradeable_init("Polo Patronium");
        _setPrimarySaleRecipient(owner_);
    }

    // Override ERC777 and ERC20 conflicting functions
    function _transfer(address from, address to, uint256 amount) internal override(ERC777Upgradeable, ERC20PermitUpgradeable) {
        super._transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount, bytes memory userData, bytes memory operatorData) internal override(ERC777Upgradeable) {
        super._mint(to, amount, userData, operatorData);
    }

    function _burn(address from, uint256 amount, bytes memory data, bytes memory operatorData) internal override(ERC777Upgradeable) {
        super._burn(from, amount, data, operatorData);
    }

    // Mint function for owner
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount, "", "");
    }

    // Thirdweb ContractMetadata override
    function _canSetContractURI() internal view override returns (bool) {
        return msg.sender == owner();
    }

    // Thirdweb PrimarySale override
    function _canSetPrimarySaleRecipient() internal view override returns (bool) {
        return msg.sender == owner();
    }
}