// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC777TokensRecipient standard as defined in the EIP.
 *
 * Accounts can be notified of {IERC777} tokens being sent to them by having a
 * contract implement this interface (contract holders can be their own
 * implementer) and registering it on the
 * https://eips.ethereum.org/EIPS/eip-1820[ERC1820 global registry].
 *
 * See {IERC1820Registry} and {ERC1820Implementer}.
 */
contract ERC777Recipient {
    uint256 public n = 0;
    constructor() {

    }

    function tokensReceived(
        address from,
        address to,
        uint256 amount,
        bytes calldata userData
    ) external returns(address, address, uint256) {
        n += userData.length;
        return (from, to, amount);
    }
}