/**
 *Submitted for verification at Arbiscan.io on 2023-09-21
 */

pragma solidity ^0.8.6;

interface StreamsLookupCompatibleInterface {
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

// File src/v0.8/automation/interfaces/ILogAutomation.sol

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

contract StreamsLookupv03Example is
    ILogAutomation,
    StreamsLookupCompatibleInterface
{
    string public constant STRING_DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant STRING_DATASTREAMS_QUERYLABEL = "timestamp";

    address public FORWARDER_ADDRESS;

    string[] public feedIds;
    int256 public timeLag;

    event PerformingUpkeep(bytes blob);

    function checkLog(
        Log calldata log,
        bytes memory
    ) external override returns (bool upkeepNeeded, bytes memory performData) {
        revert StreamsLookup(
            STRING_DATASTREAMS_FEEDLABEL,
            feedIds,
            STRING_DATASTREAMS_QUERYLABEL,
            uint256(int256(log.timestamp) + timeLag),
            ""
        );
    }

    function setFeedIds(string[] calldata f) public {
        feedIds = new string[](f.length);
        for (uint256 i = 0; i < f.length; i++) {
            feedIds[i] = f[i];
        }
    }

    function viewFeedIds() public view returns (string[] memory) {
        return feedIds;
    }

    function setTimeLagSeconds(int256 l) public {
        timeLag = l;
    }

    function checkCallback(
        bytes[] calldata values,
        bytes calldata extraData
    ) external pure override returns (bool, bytes memory) {
        return (true, abi.encode(values, extraData));
    }

    function performUpkeep(bytes calldata performData) external override {
        //require(msg.sender == FORWARDER_ADDRESS, "Not permissioned");
        (bytes[] memory values, bytes memory extraData) = abi.decode(
            performData,
            (bytes[], bytes)
        );
        for (uint256 i = 0; i < values.length; i++) {
            emit PerformingUpkeep(values[i]);
        }
    }

    function setForwarderAddress(address forwarderAddress) public {
        FORWARDER_ADDRESS = forwarderAddress;
    }
}
