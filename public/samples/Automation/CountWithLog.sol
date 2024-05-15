// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

struct Log {
    uint256 index; // Index of the log in the block
    uint256 timestamp; // Timestamp of the block containing the log
    bytes32 txHash; // Hash of the transaction containing the log
    uint256 blockNumber; // Number of the block containing the log
    bytes32 blockHash; // Hash of the block containing the log
    address source; // Address of the contract that emitted the log
    bytes32[] topics; // Indexed topics of the log
    bytes data; // Data of the log
}

interface ILogAutomation {
    function checkLog(
        Log calldata log,
        bytes memory checkData
    ) external returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

contract CountWithLog is ILogAutomation {
    event CountedBy(address indexed msgSender);

    uint256 public counted = 0;

    constructor() {}

    function checkLog(
        Log calldata log,
        bytes memory
    ) external pure returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = true;
        address logSender = bytes32ToAddress(log.topics[1]);
        performData = abi.encode(logSender);
    }

    function performUpkeep(bytes calldata performData) external override {
        counted += 1;
        address logSender = abi.decode(performData, (address));
        emit CountedBy(logSender);
    }

    function bytes32ToAddress(bytes32 _address) public pure returns (address) {
        return address(uint160(uint256(_address)));
    }
}
