// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

//////////////////////////////////
////////////////////////INTERFACES
//////////////////////////////////

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

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
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

interface IFeeManager {
    function getFeeAndReward(
        address subscriber,
        bytes memory report,
        address quoteAddress
    )
        external
        returns (
            ChainlinkCommon.Asset memory,
            ChainlinkCommon.Asset memory,
            uint256
        );

    function i_linkAddress() external view returns (address);

    function i_nativeAddress() external view returns (address);

    function i_rewardManager() external view returns (address);
}

library ChainlinkCommon {
    // @notice The asset struct to hold the address of an asset and amount
    struct Asset {
        address assetAddress;
        uint256 amount;
    }

    // @notice Struct to hold the address and its associated weight
    struct AddressAndWeight {
        address addr;
        uint64 weight;
    }
}

interface IVerifierProxy {
    function verify(
        bytes calldata payload,
        bytes calldata parameterPayload
    ) external payable returns (bytes memory verifierResponse);

    function s_feeManager() external view returns (IVerifierFeeManager);
}

interface IReportHandler {
    function handleReport(bytes calldata report) external;
}

interface IVerifierFeeManager {}

interface IRewardManager {}

//////////////////////////////////
///////////////////END INTERFACES
//////////////////////////////////

contract StreamsLookupChainlinkAutomation is
    ILogAutomation,
    StreamsLookupCompatibleInterface
{
    struct BasicReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified on-chain
        int192 price; // DON consensus median price, carried to 8 decimal places
    }

    struct PremiumReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified on-chain
        int192 price; // DON consensus median price, carried to 8 decimal places
        int192 bid; // Simulated price impact of a buy order up to the X% depth of liquidity utilisation
        int192 ask; // Simulated price impact of a sell order up to the X% depth of liquidity utilisation
    }

    struct Quote {
        address quoteAddress;
    }

    event PriceUpdate(int192 indexed price);

    IVerifierProxy public verifier;

    address public FEE_ADDRESS;
    string public constant STRING_DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant STRING_DATASTREAMS_QUERYLABEL = "timestamp";
    string[] public feedIds = [
        "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b View in Tenderly " // Ex. Basic ETH/USD price report
    ];

    constructor(address _verifier) {
        verifier = IVerifierProxy(_verifier); //Arbitrum Sepolia: 0x2ff010debc1297f19579b4246cad07bd24f2488a
    }

    function checkLog(
        Log calldata log,
        bytes memory
    ) external returns (bool upkeepNeeded, bytes memory performData) {
        revert StreamsLookup(
            STRING_DATASTREAMS_FEEDLABEL,
            feedIds,
            STRING_DATASTREAMS_QUERYLABEL,
            log.timestamp,
            ""
        );
    }

    function checkCallback(
        bytes[] calldata values,
        bytes calldata extraData
    ) external pure returns (bool, bytes memory) {
        bool success = true;
        return (true, abi.encode(values, extraData, success));
    }

    function checkErrorHandler(
        bytes calldata errorCode,
        bytes calldata extraData
    ) public view returns (bool upkeepNeeded, bytes memory performData) {
        bool success = false;
        return (true, abi.encode(errorCode, extraData, success));
    }

    // function will be performed on-chain
    function performUpkeep(bytes calldata performData) external {
        // Decode incoming performData
        (
            bytes[] memory signedReports,
            bytes memory extraData,
            bool reportSuccess
        ) = abi.decode(performData, (bytes[], bytes, bool));

        if (reportSuccess) {
            bytes memory report = signedReports[0];

            (, bytes memory reportData) = abi.decode(
                report,
                (bytes32[3], bytes)
            );

            // Billing

            IFeeManager feeManager = IFeeManager(
                address(verifier.s_feeManager())
            );
            IRewardManager rewardManager = IRewardManager(
                address(feeManager.i_rewardManager())
            );

            address feeTokenAddress = feeManager.i_linkAddress();
            (ChainlinkCommon.Asset memory fee, , ) = feeManager.getFeeAndReward(
                address(this),
                reportData,
                feeTokenAddress
            );

            IERC20(feeTokenAddress).approve(address(rewardManager), fee.amount);

            // Verify the report
            bytes memory verifiedReportData = verifier.verify(
                report,
                abi.encode(feeTokenAddress)
            );

            /*
        Deprecated Interface:
        bytes memory verifiedReportData = verifier.verify(bundledReport);
        */

            // Decode verified report data into BasicReport struct
            BasicReport memory verifiedReport = abi.decode(
                verifiedReportData,
                (BasicReport)
            );

            // Log price from report
            emit PriceUpdate(verifiedReport.price);
        } else {
            // ERROR LOGIC
        }
    }

    fallback() external payable {}
}
