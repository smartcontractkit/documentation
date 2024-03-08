// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {StreamsLookupCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/StreamsLookupCompatibleInterface.sol";
import {ILogAutomation, Log} from "@chainlink/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";
import {IRewardManager} from "@chainlink/contracts/src/v0.8/llo-feeds/interfaces/IRewardManager.sol";
import {IVerifierFeeManager} from "@chainlink/contracts/src/v0.8/llo-feeds/interfaces/IVerifierFeeManager.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/interfaces/IERC20.sol";
import {Common} from "@chainlink/contracts/src/v0.8/libraries/Common.sol";

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
        int192 price; // DON consensus median price, carried to 18 decimal places
    }

    struct PremiumReport {
        bytes32 feedId; // The feed ID the report has data for
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (WETH/ETH)
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK
        uint32 expiresAt; // Latest timestamp where the report can be verified on-chain
        int192 price; // DON consensus median price, carried to 18 decimal places
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
        "0x00027bbaff688c906a3e20a34fe951715d1018d262a5b66e38eda027a674cd1b" // Ex. Basic ETH/USD price report
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
        bool success = true; // Indicates successful data retrieval
        return (true, abi.encode(success, abi.encode(values, extraData)));
    }

    /**
     * @notice Determines the need for upkeep in response to an error from Data Streams.
     * @param errorCode The error code returned by the Data Streams lookup.
     * @param extraData Additional context or data related to the error condition.
     * @return upkeepNeeded Boolean indicating whether upkeep is needed based on the error.
     * @return performData Data to be used if upkeep is performed, encoded with success state and error context.
     */
    function checkErrorHandler(
        uint errorCode,
        bytes calldata extraData
    ) external returns (bool upkeepNeeded, bytes memory performData) {
        // Add custom logic to handle errors offchain here
        bool _upkeepNeeded = true;
        bool success = false;
        if (errorCode == 800400) {
            // Handle bad request errors code offchain.
            // In this example, no upkeep needed for bad request errors.
            _upkeepNeeded = false;
        } else {
            // Handle other errors as needed.
        }
        return (
            _upkeepNeeded,
            abi.encode(success, abi.encode(errorCode, extraData))
        );
    }

    // function will be performed on-chain
    function performUpkeep(bytes calldata performData) external {
        // Decode incoming performData
        (bool success, bytes memory payload) = abi.decode(
            performData,
            (bool, bytes)
        );

        if (success) {
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

            // Decode verified report data into BasicReport struct
            BasicReport memory verifiedReport = abi.decode(
                verifiedReportData,
                (BasicReport)
            );

            // Log price from report
            emit PriceUpdate(verifiedReport.price);
        } else {
            // Handle error condition
            (uint errorCode, bytes memory extraData) = abi.decode(
                payload,
                (uint, bytes)
            );
            // Custom logic to handle error codes
        }
    }

    fallback() external payable {}
}
