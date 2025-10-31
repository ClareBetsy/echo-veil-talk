// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title A simple FHE counter contract
/// @author fhevm-hardhat-template
/// @notice A very basic example contract showing how to work with encrypted data using FHEVM.
contract FHECounter is SepoliaConfig {
    uint256 public totalOperations;
    euint32 private _count;

    /// @notice Returns the current count
    /// @return The current encrypted count as bytes32
    function getCount() external view returns (bytes32) {
        return FHE.serialize(_count);
    }

    /// @notice Increments the counter by a specified encrypted value.
    /// @param encryptedDelta the encrypted delta value as bytes
    /// @dev This example omits overflow/underflow checks for simplicity and readability.
    /// In a production contract, proper range checks should be implemented.
    function increment(bytes calldata encryptedDelta) external {
        require(encryptedDelta.length > 0, "FHECounter: empty input");
        
        // Convert bytes to euint32
        euint32 encryptedValue = FHE.asEuint32(encryptedDelta);

        _count = FHE.add(_count, encryptedValue);
        totalOperations++;

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }

    /// @notice Decrements the counter by a specified encrypted value.
    /// @param encryptedDelta the encrypted delta value as bytes
    /// @dev This example omits overflow/underflow checks for simplicity and readability.
    /// In a production contract, proper range checks should be implemented.
    function decrement(bytes calldata encryptedDelta) external {
        require(encryptedDelta.length > 0, "FHECounter: empty input");
        
        // Convert bytes to euint32
        euint32 encryptedValue = FHE.asEuint32(encryptedDelta);

        _count = FHE.sub(_count, encryptedValue);
        totalOperations++;

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }
}
