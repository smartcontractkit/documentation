pragma solidity ^0.8.19;

interface FeedLookupCompatibleInterface {
    error StreamsLookup(
        string feedParamKey,
        string[] feeds,
        string timeParamKey,
        uint256 time,
        bytes extraData
    );

    /**
     * @notice any contract which wants to utilize FeedLookup feature needs to
     * implement this interface as well as the automation compatible interface.
     * @param values an array of bytes returned from Mercury endpoint.
     * @param extraData context data from feed lookup process.
     * @return upkeepNeeded boolean to indicate whether the keeper should call performUpkeep or not.
     * @return performData bytes that the keeper should call performUpkeep with, if
     * upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.
     */
    function checkCallback(
        bytes[] memory values,
        bytes memory extraData
    ) external view returns (bool upkeepNeeded, bytes memory performData);
}

// File src/v0.8/automation/2_1/interfaces/ILogAutomation.sol

pragma solidity ^0.8.0;

struct Log {
    uint256 index;
    uint256 timestamp;
    bytes32 txHash;
    uint256 blockNumber;
    bytes32 blockHash;
    address source;
    bytes32[] topics;
    bytes data;
}

interface ILogAutomation {
    /**
     * @notice method that is simulated by the keepers to see if any work actually
     * needs to be performed. This method does does not actually need to be
     * executable, and since it is only ever simulated it can consume lots of gas.
     * @dev To ensure that it is never called, you may want to add the
     * cannotExecute modifier from KeeperBase to your implementation of this
     * method.
     * @param log the raw log data matching the filter that this contract has
     * registered as a trigger
     * @param checkData user-specified extra data to provide context to this upkeep
     * @return upkeepNeeded boolean to indicate whether the keeper should call
     * performUpkeep or not.
     * @return performData bytes that the keeper should call performUpkeep with, if
     * upkeep is needed. If you would like to encode data to decode later, try
     * `abi.encode`.
     */
    function checkLog(
        Log calldata log,
        bytes memory checkData
    ) external returns (bool upkeepNeeded, bytes memory performData);

    /**
     * @notice method that is actually executed by the keepers, via the registry.
     * The data returned by the checkUpkeep simulation will be passed into
     * this method to actually be executed.
     * @dev The input to this method should not be trusted, and the caller of the
     * method should not even be restricted to any single registry. Anyone should
     * be able call it, and the input should be validated, there is no guarantee
     * that the data passed in is the performData returned from checkUpkeep. This
     * could happen due to malicious keepers, racing keepers, or simply a state
     * change while the performUpkeep transaction is waiting for confirmation.
     * Always validate the data passed in.
     * @param performData is the data which was passed back from the checkData
     * simulation. If it is encoded, it can easily be decoded into other types by
     * calling `abi.decode`. This data should not be trusted, and should be
     * validated against the contract's current state.
     */
    function performUpkeep(bytes calldata performData) external;
}

pragma solidity >=0.4.21 <0.9.0;

// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IVerifierProxy {
    /**
     * @notice Verifies that the data encoded has been signed
     * correctly by routing to the correct verifier.
     * @param signedReport The encoded data to be verified.
     * @return verifierResponse The encoded response from the verifier.
     */
    function verify(
        bytes memory signedReport
    ) external returns (bytes memory verifierResponse);
}

contract BlobTask is ILogAutomation, FeedLookupCompatibleInterface {
    event Update(bytes indexed clBlob);

    event PriceData(int192 indexed price);

    //Todo: always ensure you use the latest report struct (schema) which can be found here {placeholder}
    struct Report {
        // The feed ID the report has data for
        bytes32 feedId;
        // The time the median value was observed on
        uint32 observationsTimestamp;
        // The median value agreed in an OCR round
        int192 median;
        // The best bid value agreed in an OCR round
        int192 bid;
        // The best ask value agreed in an OCR round
        int192 ask;
        // The upper bound of the block range the median value was observed within
        uint64 blocknumberUpperBound;
        // The blockhash for the upper bound of block range (ensures correct blockchain)
        bytes32 upperBlockhash;
        // The lower bound of the block range the median value was observed within
        uint64 blocknumberLowerBound;
        // The timestamp of the current (upperbound) block number
        uint64 currentBlockTimestamp;
    }

    string public constant STRING_DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant STRING_DATASTREAMS_QUERYLABEL = "timestamp";

    uint256 public counter;

    function checkLog(
        Log calldata log,
        bytes memory
    ) external override returns (bool upkeepNeeded, bytes memory performData) {
        string[] memory feedIds = new string[](1);
        feedIds[0] = "0x......";
        revert StreamsLookup(
            STRING_DATASTREAMS_FEEDLABEL,
            feedIds,
            STRING_DATASTREAMS_QUERYLABEL,
            log.blockNumber,
            ""
        );
    }

    function performUpkeep(bytes calldata performData) external override {
        (bytes[] memory values, bytes memory extraData) = abi.decode(
            performData,
            (bytes[], bytes)
        );
        bytes memory report = values[0];
        emit Update(report);
        Report memory reportData = getReport(report);
        emit PriceData(reportData.median);
    }

    function checkCallback(
        bytes[] calldata values,
        bytes calldata extraData
    ) external pure returns (bool, bytes memory) {
        return (true, abi.encode(values, extraData));
    }

    function bytes32ToAddress(bytes32 _address) public pure returns (address) {
        return address(uint160(uint256(_address)));
    }

    function bytes32ToUint(bytes32 _uint) public pure returns (uint256) {
        return uint256(_uint);
    }

    function getReport(
        bytes memory signedReport
    ) internal returns (Report memory) {
        (
            bytes32[3] memory reportContext,
            bytes memory reportData,
            bytes32[] memory rs,
            bytes32[] memory ss,
            bytes32 rawVs
        ) = abi.decode(
                signedReport,
                (bytes32[3], bytes, bytes32[], bytes32[], bytes32)
            );

        Report memory report = abi.decode(reportData, (Report));
        return report;
    }
}
