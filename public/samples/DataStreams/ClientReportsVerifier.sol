// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {Common} from "@chainlink/contracts/src/v0.8/llo-feeds/libraries/Common.sol";
import {IRewardManager} from "@chainlink/contracts/src/v0.8/llo-feeds/v0.3.0/interfaces/IRewardManager.sol";
import {IVerifierFeeManager} from "@chainlink/contracts/src/v0.8/llo-feeds/v0.3.0/interfaces/IVerifierFeeManager.sol";
import {IERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE FOR DEMONSTRATION PURPOSES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

// Custom interfaces for IVerifierProxy and IFeeManager
interface IVerifierProxy {
    /**
     * @notice Verifies that the data encoded has been signed correctly by routing to the correct verifier, and bills the user if applicable.
     * @param payload The encoded data to be verified, including the signed report.
     * @param parameterPayload Fee metadata for billing. In the current implementation, this consists of the abi-encoded address of the ERC-20 token used for fees.
     * @return verifierResponse The encoded report from the verifier.
     */
    function verify(
        bytes calldata payload,
        bytes calldata parameterPayload
    ) external payable returns (bytes memory verifierResponse);

    /**
     * @notice Verifies multiple reports in bulk, ensuring that each is signed correctly, routes them to the appropriate verifier, and handles billing for the verification process.
     * @param payloads An array of encoded data to be verified, where each entry includes the signed report.
     * @param parameterPayload Fee metadata for billing. In the current implementation, this consists of the abi-encoded address of the ERC-20 token used for fees.
     * @return verifiedReports An array of encoded reports returned from the verifier.
     */
    function verifyBulk(
        bytes[] calldata payloads,
        bytes calldata parameterPayload
    ) external payable returns (bytes[] memory verifiedReports);

    function s_feeManager() external view returns (IVerifierFeeManager);
}

interface IFeeManager {
    /**
     * @notice Calculates the fee and reward associated with verifying a report, including discounts for subscribers.
     * This function assesses the fee and reward for report verification, applying a discount for recognized subscriber addresses.
     * @param subscriber The address attempting to verify the report. A discount is applied if this address is recognized as a subscriber.
     * @param unverifiedReport The report data awaiting verification. The content of this report is used to determine the base fee and reward, before considering subscriber discounts.
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

/**
 * @dev This contract implements functionality to verify Data Streams reports from
 * the Streams Direct API or WebSocket connection, with payment in LINK tokens.
 */
contract ClientReportsVerifier {
    error NothingToWithdraw(); // Thrown when a withdrawal attempt is made but the contract holds no tokens of the specified type.
    error NotOwner(address caller); // Thrown when a caller tries to execute a function that is restricted to the contract's owner.
    error InvalidReportVersion(uint16 version); // Thrown when an unsupported report version is provided to verifyReport.

    /**
     * @dev Represents a data report from a Data Streams stream for v3 schema (crypto streams).
     * The `price`, `bid`, and `ask` values are carried to either 8 or 18 decimal places, depending on the stream.
     * For more information, see https://docs.chain.link/data-streams/crypto-streams and https://docs.chain.link/data-streams/reference/report-schema
     */
    struct ReportV3 {
        bytes32 feedId; // The stream ID the report has data for.
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
     * @dev Represents a data report from a Data Streams stream for v4 schema (RWA stream).
     * The `price` value is carried to either 8 or 18 decimal places, depending on the stream.
     * The `marketStatus` indicates whether the market is currently open. Possible values: `0` (`Unknown`), `1` (`Closed`), `2` (`Open`).
     * For more information, see https://docs.chain.link/data-streams/rwa-streams and https://docs.chain.link/data-streams/reference/report-schema-v4
     */
    struct ReportV4 {
        bytes32 feedId; // The stream ID the report has data for.
        uint32 validFromTimestamp; // Earliest timestamp for which price is applicable.
        uint32 observationsTimestamp; // Latest timestamp for which price is applicable.
        uint192 nativeFee; // Base cost to validate a transaction using the report, denominated in the chain’s native token (e.g., WETH/ETH).
        uint192 linkFee; // Base cost to validate a transaction using the report, denominated in LINK.
        uint32 expiresAt; // Latest timestamp where the report can be verified onchain.
        int192 price; // DON consensus median benchmark price (8 or 18 decimals).
        uint32 marketStatus; // The DON's consensus on whether the market is currently open.
    }

    IVerifierProxy public s_verifierProxy; // The VerifierProxy contract used for report verification.

    address private s_owner; // The owner of the contract.
    int192 public lastDecodedPrice; // Stores the last decoded price from a verified report.

    event DecodedPrice(int192 price); // Event emitted when a report is successfully verified and decoded.

    /**
     * @param _verifierProxy The address of the VerifierProxy contract.
     * You can find these addresses on https://docs.chain.link/data-streams/crypto-streams.
     */
    constructor(address _verifierProxy) {
        s_owner = msg.sender;
        s_verifierProxy = IVerifierProxy(_verifierProxy);
    }

    /// @notice Checks if the caller is the owner of the contract.
    modifier onlyOwner() {
        if (msg.sender != s_owner) revert NotOwner(msg.sender);
        _;
    }

    /**
     * @notice Verifies an unverified data report and processes its contents, supporting both v3 and v4 report schemas.
     * @dev Performs the following steps:
     * - Decodes the unverified report to extract the report data.
     * - Extracts the report version by reading the first two bytes of the report data.
     *   - The first two bytes correspond to the schema version encoded in the stream ID.
     *   - Schema version `0x0003` corresponds to report version 3 (for Crypto assets).
     *   - Schema version `0x0004` corresponds to report version 4 (for Real World Assets).
     * - Validates that the report version is either 3 or 4; reverts with `InvalidReportVersion` otherwise.
     * - Retrieves the fee manager and reward manager contracts.
     * - Calculates the fee required for report verification using the fee manager.
     * - Approves the reward manager to spend the calculated fee amount.
     * - Verifies the report via the VerifierProxy contract.
     * - Decodes the verified report data into the appropriate report struct (`ReportV3` or `ReportV4`) based on the report version.
     * - Emits a `DecodedPrice` event with the price extracted from the verified report.
     * - Updates the `lastDecodedPrice` state variable with the price from the verified report.
     * @param unverifiedReport The encoded report data to be verified, including the signed report and metadata.
     * @custom:reverts InvalidReportVersion(uint8 version) Thrown when an unsupported report version is provided.
     */
    function verifyReport(bytes memory unverifiedReport) external {
        // Retrieve fee manager and reward manager
        IFeeManager feeManager = IFeeManager(
            address(s_verifierProxy.s_feeManager())
        );

        IRewardManager rewardManager = IRewardManager(
            address(feeManager.i_rewardManager())
        );

        // Decode unverified report to extract report data
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

        // Set the fee token address (LINK in this case)
        address feeTokenAddress = feeManager.i_linkAddress();

        // Calculate the fee required for report verification
        (Common.Asset memory fee, , ) = feeManager.getFeeAndReward(
            address(this),
            reportData,
            feeTokenAddress
        );

        // Approve rewardManager to spend this contract's balance in fees
        IERC20(feeTokenAddress).approve(address(rewardManager), fee.amount);

        // Verify the report through the VerifierProxy
        bytes memory verifiedReportData = s_verifierProxy.verify(
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

            // Log price from the verified report
            emit DecodedPrice(verifiedReport.price);

            // Store the price from the report
            lastDecodedPrice = verifiedReport.price;
        } else if (reportVersion == 4) {
            // v4 report schema
            ReportV4 memory verifiedReport = abi.decode(
                verifiedReportData,
                (ReportV4)
            );

            // Log price from the verified report
            emit DecodedPrice(verifiedReport.price);

            // Store the price from the report
            lastDecodedPrice = verifiedReport.price;
        }
    }

    /**
     * @notice Withdraws all tokens of a specific ERC20 token type to a beneficiary address.
     * @dev Utilizes SafeERC20's safeTransfer for secure token transfer. Reverts if the contract's balance of the specified token is zero.
     * @param _beneficiary Address to which the tokens will be sent. Must not be the zero address.
     * @param _token Address of the ERC20 token to be withdrawn. Must be a valid ERC20 token contract.
     */
    function withdrawToken(
        address _beneficiary,
        address _token
    ) public onlyOwner {
        // Retrieve the balance of this contract for the specified token
        uint256 amount = IERC20(_token).balanceOf(address(this));

        // Revert if there is nothing to withdraw
        if (amount == 0) revert NothingToWithdraw();

        // Transfer the tokens to the beneficiary
        IERC20(_token).safeTransfer(_beneficiary, amount);
    }
}
