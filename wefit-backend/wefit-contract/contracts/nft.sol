// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract WefitNFT is Initializable, ERC1155Upgradeable, OwnableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
    }

    function initialize(address initialOwner) initializer public {
        __ERC1155_init("wefit.com");
        __Ownable_init(initialOwner);
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._update(from, to, ids, values);
    }

    // Helper function to generate a sample bytes array
    function getSampleBytes() public pure returns (bytes memory) {
        return abi.encode("Sample Data");  // Encode some string data
    }
}