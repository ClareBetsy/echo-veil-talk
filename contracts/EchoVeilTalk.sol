// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title EchoVeilTalk - A FHE-based encrypted chat analytics contract
/// @author echo-veil-talk
/// @notice A contract demonstrating fully homomorphic encryption operations for encrypted chat analytics and counter functionality
contract EchoVeilTalk is SepoliaConfig {
    uint256 public totalOperations;
    euint32 private _count;
    
    event IncrementPerformed(address indexed user, uint256 timestamp);
    event DecrementPerformed(address indexed user, uint256 timestamp);

    /// @notice Returns the current count
    /// @return The current encrypted count as bytes32
    function getCount() external view returns (bytes32) {
        return FHE.serialize(_count);
    }

    /// @notice Increments the counter by a specified encrypted value.
    /// @param encryptedDelta the encrypted delta value as bytes
    /// @dev This example omits overflow/underflow checks for simplicity and readability.
    /// In a production contract, proper range checks should be implemented.
    /// Emits IncrementPerformed event on successful operation.
    function increment(bytes calldata encryptedDelta) external {
        require(encryptedDelta.length > 0, "EchoVeilTalk: empty input");
        
        euint32 encryptedValue = FHE.asEuint32(encryptedDelta);

        _count = FHE.add(_count, encryptedValue);
        totalOperations++;

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
        
        emit IncrementPerformed(msg.sender, block.timestamp);
    }

    /// @notice Decrements the counter by a specified encrypted value.
    /// @param encryptedDelta the encrypted delta value as bytes
    /// @dev This example omits overflow/underflow checks for simplicity and readability.
    /// In a production contract, proper range checks should be implemented.
    /// Emits DecrementPerformed event on successful operation.
    function decrement(bytes calldata encryptedDelta) external {
        require(encryptedDelta.length > 0, "EchoVeilTalk: empty input");
        
        euint32 encryptedValue = FHE.asEuint32(encryptedDelta);

        _count = FHE.sub(_count, encryptedValue);
        totalOperations++;

        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
        
        emit DecrementPerformed(msg.sender, block.timestamp);
    }
}
