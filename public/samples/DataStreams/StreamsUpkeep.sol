// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ILogAutomation, Log} from "@chainlink/contracts/src/v0.8/automation/interfaces/ILogAutomation.sol";
import {
  StreamsLookupCompatibleInterface
} from "@chainlink/contracts/src/v0.8/automation/interfaces/StreamsLookupCompatibleInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE FOR DEMONSTRATION PURPOSES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

// Custom interface for IVerifierProxy
interface IVerifierProxy {
  /**
   * @notice Verifies that the data encoded has been signed.
   * correctly by routing to the correct verifier.
   * @param payload The encoded data to be verified, including the signed
   * report.
   * @param parameterPayload Empty bytes for Data Streams subscription billing.
   * @return verifierResponse The encoded report from the verifier.
   */
  function verify(
    bytes calldata payload,
    bytes calldata parameterPayload
  ) external payable returns (bytes memory verifierResponse);
}

contract StreamsUpkeep is ILogAutomation, StreamsLookupCompatibleInterface {
  error InvalidReportVersion(uint16 version); // Thrown when an unsupported report version is provided to verifyReport.

  /**
   * @dev Represents a data report from a Data Streams stream for v3 schema (used for crypto and DEX State Price
   * streams).
   * The `price`, `bid`, and `ask` values are carried to either 8 or 18 decimal places, depending on the stream.
   * `bid`, and `ask` values are not available for DEX State Price streams.
   * For more information, see https://docs.chain.link/data-streams/crypto-streams and
   * https://docs.chain.link/data-streams/reference/report-schema
   */
  struct ReportV3 {
    bytes32 feedId; // The stream ID the report has data for.
    uint32 validFromTimestamp; // Earliest timestamp for which price is applicable.
    uint32 observationsTimestamp; // Latest timestamp for which price is applicable.
    uint192 nativeFee; // Legacy onchain verification fee field.
    uint192 linkFee; // Legacy onchain verification fee field. Not used for subscription billing.
    uint32 expiresAt; // Latest timestamp where the report can be verified onchain.
    int192 price; // DON consensus median price (8 or 18 decimals).
    int192 bid; // Simulated price impact of a buy order up to the X% depth of liquidity utilisation (8 or 18 decimals).
    // Note: not available for DEX State Price streams.
    int192 ask; // Simulated price impact of a sell order up to the X% depth of liquidity utilisation (8 or 18
    // decimals). Note: not available for DEX State Price streams.
  }

  /**
   * @dev Represents a data report from a Data Streams stream for v4 schema (RWA streams).
   * The `price` value is carried to either 8 or 18 decimal places, depending on the stream.
   * The `marketStatus` indicates whether the market is currently open. Possible values: `0` (`Unknown`), `1`
   * (`Closed`), `2` (`Open`).
   * For more information, see https://docs.chain.link/data-streams/rwa-streams and
   * https://docs.chain.link/data-streams/reference/report-schema-v4
   */
  struct ReportV4 {
    bytes32 feedId; // The stream ID the report has data for.
    uint32 validFromTimestamp; // Earliest timestamp for which price is applicable.
    uint32 observationsTimestamp; // Latest timestamp for which price is applicable.
    uint192 nativeFee; // Legacy onchain verification fee field.
    uint192 linkFee; // Legacy onchain verification fee field. Not used for subscription billing.
    uint32 expiresAt; // Latest timestamp where the report can be verified onchain.
    int192 price; // DON consensus median benchmark price (8 or 18 decimals).
    uint32 marketStatus; // The DON's consensus on whether the market is currently open.
  }

  struct Quote {
    address quoteAddress;
  }

  IVerifierProxy public verifier;

  string public constant DATASTREAMS_FEEDLABEL = "feedIDs";
  string public constant DATASTREAMS_QUERYLABEL = "timestamp";
  int192 public lastDecodedPrice;

  // This example reads the ID for the ETH/USD report.
  // Find a complete list of IDs at https://docs.chain.link/data-streams/crypto-streams.
  string[] public feedIds = ["0x000359843a543ee2fe414dc14c7e7920ef10f4372990b79d6361cdc0dd1ba782"];

  constructor(
    address _verifier
  ) {
    verifier = IVerifierProxy(_verifier);
  }

  // This function uses revert to convey call information.
  // See https://eips.ethereum.org/EIPS/eip-3668#rationale for details.
  function checkLog(
    Log calldata log,
    bytes memory
  ) external returns (bool upkeepNeeded, bytes memory performData) {
    revert StreamsLookup(DATASTREAMS_FEEDLABEL, feedIds, DATASTREAMS_QUERYLABEL, log.timestamp, "");
  }

  /**
   * @notice this is a new, optional function in streams lookup. It is meant to surface streams lookup errors.
   * @return upkeepNeeded boolean to indicate whether the keeper should call performUpkeep or not.
   * @return performData bytes that the keeper should call performUpkeep with, if
   * upkeep is needed. If you would like to encode data to decode later, try `abi.encode`.
   */
  function checkErrorHandler(
    uint256, /*errCode*/
    bytes memory /*extraData*/
  ) external pure returns (bool upkeepNeeded, bytes memory performData) {
    return (true, "0");
    // Hardcoded to always perform upkeep.
    // Read the StreamsLookup error handler guide for more information.
    // https://docs.chain.link/chainlink-automation/guides/streams-lookup-error-handler
  }

  // The Data Streams report bytes is passed here.
  // extraData is context data from stream lookup process.
  // Your contract may include logic to further process this data.
  // This method is intended only to be simulated offchain by Automation.
  // The data returned will then be passed by Automation into performUpkeep
  function checkCallback(
    bytes[] calldata values,
    bytes calldata extraData
  ) external pure returns (bool, bytes memory) {
    return (true, abi.encode(values, extraData));
  }

  // function will be performed onchain
  function performUpkeep(
    bytes calldata performData
  ) external {
    // Decode the performData bytes passed in by CL Automation.
    // This contains the data returned by your implementation in checkCallback().
    (bytes[] memory signedReports, bytes memory extraData) = abi.decode(performData, (bytes[], bytes));

    bytes memory unverifiedReport = signedReports[0];

    (, /* bytes32[3] reportContextData */ bytes memory reportData) = abi.decode(unverifiedReport, (bytes32[3], bytes));

    // Extract report version from reportData
    uint16 reportVersion = (uint16(uint8(reportData[0])) << 8) | uint16(uint8(reportData[1]));

    // Validate report version
    if (reportVersion != 3 && reportVersion != 4) {
      revert InvalidReportVersion(uint8(reportVersion));
    }

    // Verify the report. Data Streams uses subscription billing, so no fee metadata is required.
    bytes memory verifiedReportData = verifier.verify(unverifiedReport, bytes(""));

    // Decode verified report data into the appropriate Report struct based on reportVersion
    if (reportVersion == 3) {
      // v3 report schema
      ReportV3 memory verifiedReport = abi.decode(verifiedReportData, (ReportV3));

      // Store the price from the report
      lastDecodedPrice = verifiedReport.price;
    } else if (reportVersion == 4) {
      // v4 report schema
      ReportV4 memory verifiedReport = abi.decode(verifiedReportData, (ReportV4));

      // Store the price from the report
      lastDecodedPrice = verifiedReport.price;
    }
  }
}
