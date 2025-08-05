// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {StreamsLookupCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/StreamsLookupCompatibleInterface.sol";
import {ILogAutomation, Log} from "@chainlink/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";
import {IRewardManager} from "@chainlink/contracts/src/v0.8/llo-feeds/v0.3.0/interfaces/IRewardManager.sol";
import {IVerifierFeeManager} from "@chainlink/contracts/src/v0.8/llo-feeds/v0.3.0/interfaces/IVerifierFeeManager.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/interfaces/IERC20.sol";
import {Common} from "@chainlink/contracts/src/v0.8/llo-feeds/libraries/Common.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

// =====================
// INTERFACES
// =====================

interface IFeeManager {
    /**
     * @notice Calculates the fee and reward associated with verifying a report, including discounts for subscribers.
     * This function assesses the fee and reward for report verification, applying a discount for recognized subscriber addresses.
     * @param subscriber The address attempting to verify the report. A discount is applied if this address
     * is recognized as a subscriber.
     * @param unverifiedReport The report data awaiting verification. The content of this report is used to
     * determine the base fee and reward, before considering subscriber discounts.
     * @param quoteAddress The payment token address used for quoting fees and rewards.
     * @return fee The fee assessed for verifying the report, with subscriber discounts applied where applicable.
     * @return reward The reward allocated to the caller for successfully verifying the report.
     * @return totalDiscount The total discount amount deducted from the fee for subscribers.
     */
    function getFeeAndReward(
        address subscriber,
        bytes memory unverifiedReport,
        address quoteAddress
    ) external returns (Common.Asset memory, Common.Asset memory, uint256);

    function i_linkAddress() external view returns (address);

    function i_nativeAddress() external view returns (address);

    function i_rewardManager() external view returns (address);
}

interface IVerifierProxy {
    /**
     * @notice Verifies that the data encoded has been signed.
     * correctly by routing to the correct verifier, and bills the user if applicable.
     * @param payload The encoded data to be verified, including the signed
     * report.
     * @param parameterPayload Fee metadata for billing. In the current implementation,
     * this consists of the abi-encoded address of the ERC-20 token used for fees.
     * @return verifierResponse The encoded report from the verifier.
     */
    function verify(
        bytes calldata payload,
        bytes calldata parameterPayload
    ) external payable returns (bytes memory verifierResponse);

    function s_feeManager() external view returns (IVerifierFeeManager);
}

// ==========================
// CONTRACT IMPLEMENTATION
// ==========================

contract StreamsUpkeepWithErrorHandler is
    ILogAutomation,
    StreamsLookupCompatibleInterface
{
    error InvalidReportVersion(uint16 version); // Thrown when an unsupported report version is provided to verifyReport.

    /**
     * @dev Represents a data report from a Data Streams feed for v3 schema (crypto streams).
     * The `price`, `bid`, and `ask` values are carried to either 8 or 18 decimal places, depending on the feed.
     * For more information, see https://docs.chain.link/data-streams/crypto-streams and https://docs.chain.link/data-streams/reference/report-schema
     */
    struct ReportV3 {
        bytes32 feedId; // The feed ID the report has data for.
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable.
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable.
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (e.g., WETH/ETH).
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK.
        uint32 expiresAt; // Latest timestamp where the report can be verified onchain.
        int192 price; // DON consensus median price (8 or 18 decimals).
        int192 bid; // Simulated price impact of a buy order up to the X% depth of liquidity utilisation (8 or 18 decimals).
        int192 ask; // Simulated price impact of a sell order up to the X% depth of liquidity utilisation (8 or 18 decimals).
    }

    /**
     * @dev Represents a data report from a Data Streams feed for v4 schema (RWA feeds).
     * The `price` value is carried to either 8 or 18 decimal places, depending on the feed.
     * The `marketStatus` indicates whether the market is currently open. Possible values: `0` (`Unknown`), `1` (`Closed`), `2` (`Open`).
     * For more information, see https://docs.chain.link/data-streams/rwa-streams and https://docs.chain.link/data-streams/reference/report-schema-v4
     */
    struct ReportV4 {
        bytes32 feedId; // The feed ID the report has data for.
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable.
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable.
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (e.g., WETH/ETH).
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK.
        uint32 expiresAt; // Latest timestamp where the report can be verified onchain.
        int192 price; // DON consensus median benchmark price (8 or 18 decimals).
        uint32 marketStatus; // The DON's consensus on whether the market is currently open.
    }

    struct Quote {
        address quoteAddress;
    }

    event PriceUpdate(int192 indexed price);
    event ErrorTestLog(uint indexed errorCode);

    IVerifierProxy public verifier;

    address public FEE_ADDRESS;
    string public constant STRING_DATASTREAMS_FEEDLABEL = "feedIDs";
    string public constant STRING_DATASTREAMS_QUERYLABEL = "timestamp";
    uint256 public s_error;
    bool public s_isError;
    string[] public feedIds = [
        "0x000359843a543ee2fe414dc14c7e7920ef10f4372990b79d6361cdc0dd1ba782" // Ex. ETH/USD Feed ID
    ];

    constructor(address _verifier) {
        verifier = IVerifierProxy(_verifier); //Arbitrum Sepolia: 0x2ff010debc1297f19579b4246cad07bd24f2488a
    }

    // This function uses revert to convey call information.
    // See https://eips.ethereum.org/EIPS/eip-3668#rationale for details.
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

    /**
     * @dev This function is intended for off-chain simulation by Chainlink Automation to pass in the data reports fetched from Data Streams.
     * @param values The bytes array of data reports fetched from Data Streams.
     * @param extraData Contextual or additional data related to the feed lookup process.
     * @return upkeepNeeded Indicates that upkeep is needed to pass the data to the on-chain performUpkeep function.
     * @return performData Encoded data indicating success and including the original `values` and `extraData`, to be used in `performUpkeep`.
     */
    function checkCallback(
        bytes[] calldata values,
        bytes calldata extraData
    ) external pure returns (bool upkeepNeeded, bytes memory) {
        bool reportSuccess = true; // Indicates successful data retrieval
        return (true, abi.encode(reportSuccess, abi.encode(values, extraData)));
    }

    /**
     * @notice Determines the need for upkeep in response to an error from Data Streams.
     * @dev This function serves as an example of how errors can be handled offchain.
     * @dev Developers can parameterize this logic as needed.
     * @dev All error codes are documented at: https://docs.chain.link/chainlink-automation/guides/streams-lookup-error-handler#error-codes
     * @param errorCode The error code returned by the Data Streams lookup.
     * @param extraData Additional context or data related to the error condition.
     * @return upkeepNeeded Boolean indicating whether upkeep is needed based on the error.
     * @return performData Data to be used if upkeep is performed, encoded with success state and error context.
     */
    function checkErrorHandler(
        uint errorCode,
        bytes calldata extraData
    ) external view returns (bool upkeepNeeded, bytes memory performData) {
        bool _upkeepNeeded = false;
        bool reportSuccess = false;
        if (errorCode == 0) {
            // If there is no error, proceed with the performUpkeep and
            // the report decoding/verification
            _upkeepNeeded = true;
            reportSuccess = true;
        } else if (errorCode == 808400 || errorCode == 808401) {
            // Mark upkeep as needed for bad requests (808400) and incorrect feed ID (808401)
            // to handle these specific errors onchain.
            _upkeepNeeded = true;
            // Note that reportSuccess remains false.
        } else {
            // For other error codes, decide not to perform upkeep.
            // This is the default behavior, explicitly noted for clarity in this example.
            _upkeepNeeded = false;
            reportSuccess = false;
        }
        return (
            _upkeepNeeded,
            abi.encode(reportSuccess, abi.encode(errorCode, extraData))
        );
    }

    function performUpkeep(bytes calldata performData) external {
        // Decode incoming performData
        (bool reportSuccess, bytes memory payload) = abi.decode(
            performData,
            (bool, bytes)
        );

        if (reportSuccess) {
            // Decode the performData bytes passed in by CL Automation.
            // This contains the data returned by your implementation in checkCallback().
            (bytes[] memory signedReports, bytes memory extraData) = abi.decode(
                payload,
                (bytes[], bytes)
            );
            // Logic to verify and decode report
            bytes memory unverifiedReport = signedReports[0];

            (, bytes memory reportData) = abi.decode(
                unverifiedReport,
                (bytes32[3], bytes)
            );

            // Extract report version from reportData
            uint16 reportVersion = (uint16(uint8(reportData[0])) << 8) |
                uint16(uint8(reportData[1]));

            // Validate report version
            if (reportVersion != 3 && reportVersion != 4) {
                revert InvalidReportVersion(uint8(reportVersion));
            }

            // Report verification fees
            IFeeManager feeManager = IFeeManager(
                address(verifier.s_feeManager())
            );
            IRewardManager rewardManager = IRewardManager(
                address(feeManager.i_rewardManager())
            );

            address feeTokenAddress = feeManager.i_linkAddress();
            (Common.Asset memory fee, , ) = feeManager.getFeeAndReward(
                address(this),
                reportData,
                feeTokenAddress
            );

            // Approve rewardManager to spend this contract's balance in fees
            IERC20(feeTokenAddress).approve(address(rewardManager), fee.amount);

            // Verify the report
            bytes memory verifiedReportData = verifier.verify(
                unverifiedReport,
                abi.encode(feeTokenAddress)
            );

            // Decode verified report data into the appropriate Report struct based on reportVersion
            if (reportVersion == 3) {
                // v3 report schema
                ReportV3 memory verifiedReport = abi.decode(
                    verifiedReportData,
                    (ReportV3)
                );

                // Log price from report
                emit PriceUpdate(verifiedReport.price);
            } else if (reportVersion == 4) {
                // v4 report schema
                ReportV4 memory verifiedReport = abi.decode(
                    verifiedReportData,
                    (ReportV4)
                );

                // Log price from report
                emit PriceUpdate(verifiedReport.price);
            }
        } else {
            // Handle error condition
            (uint errorCode, bytes memory extraData) = abi.decode(
                payload,
                (uint, bytes)
            );
            // Custom logic to handle error codes
            s_error = errorCode;
            s_isError = true;
        }
    }

    fallback() external payable {}

    receive() external payable {}
}
