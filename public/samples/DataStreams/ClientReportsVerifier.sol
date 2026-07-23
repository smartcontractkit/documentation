// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE FOR DEMONSTRATION PURPOSES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 *
 *  This contract verifies Chainlink Data Streams reports onchain. It exposes
 *  two verification functions:
 *
 *  - `verifyReport()`      – verifies a single report payload.
 *  - `verifyBulkReports()` – verifies multiple payloads (across any feed IDs)
 *                             in a single transaction using `verifyBulk()`.
 *
 *  Data Streams uses subscription-based billing. Verification calls do not
 *  require this contract to hold LINK or approve a FeeManager.
 */

// ────────────────────────────────────────────────────────────────────────────
//  Interface
// ────────────────────────────────────────────────────────────────────────────

interface IVerifierProxy {
  /**
   * @notice Route a report to the correct verifier.
   * @param payload           Full report payload (header + signed report).
   * @param parameterPayload  Empty bytes for Data Streams subscription billing.
   */
  function verify(
    bytes calldata payload,
    bytes calldata parameterPayload
  ) external payable returns (bytes memory verifierResponse);

  /**
   * @notice Route multiple reports to the correct verifier in a single call.
   * @param payloads          Array of full report payloads. Each entry may reference
   *                          a different feed ID. Order is preserved in the output.
   * @param parameterPayload  Empty bytes for Data Streams subscription billing.
   * @return verifiedReports  Verified report bytes in the same order as the input.
   */
  function verifyBulk(
    bytes[] calldata payloads,
    bytes calldata parameterPayload
  ) external payable returns (bytes[] memory verifiedReports);
}

// ────────────────────────────────────────────────────────────────────────────
//  Contract
// ────────────────────────────────────────────────────────────────────────────

/**
 * @dev This contract implements functionality to verify Data Streams reports from
 * the Data Streams API.
 */
contract ClientReportsVerifier {
  // ----------------- Errors -----------------
  error NothingToWithdraw();
  error NotOwner(address caller);
  error InvalidReportVersion(uint16 version);
  error EmptyReportsArray();

  // ----------------- Report schemas -----------------
  // More info: https://docs.chain.link/data-streams/reference/report-schema-v3
  /**
   * @dev Data Streams report schema v3 (crypto streams).
   *      Prices, bids and asks use 8 or 18 decimals depending on the stream.
   */
  struct ReportV3 {
    bytes32 feedId;
    uint32 validFromTimestamp;
    uint32 observationsTimestamp;
    uint192 nativeFee;
    uint192 linkFee;
    uint32 expiresAt;
    int192 price;
    int192 bid;
    int192 ask;
  }

  /**
   * @dev Data Streams report schema v8 (RWA streams).
   */
  struct ReportV8 {
    bytes32 feedId;
    uint32 validFromTimestamp;
    uint32 observationsTimestamp;
    uint192 nativeFee;
    uint192 linkFee;
    uint32 expiresAt;
    uint64 lastUpdateTimestamp;
    int192 midPrice;
    uint32 marketStatus;
  }

  // ----------------- Storage -----------------
  IVerifierProxy public immutable i_verifierProxy;
  address private immutable i_owner;

  int192 public lastDecodedPrice;
  int192[] public lastDecodedPrices;

  // ----------------- Events -----------------
  event DecodedPrice(int192 price);

  // ----------------- Constructor / modifier -----------------
  /**
   * @param _verifierProxy Address of the VerifierProxy on the target network.
   *        Addresses: https://docs.chain.link/data-streams/crypto-streams
   */
  constructor(
    address _verifierProxy
  ) {
    i_owner = msg.sender;
    i_verifierProxy = IVerifierProxy(_verifierProxy);
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert NotOwner(msg.sender);
    _;
  }

  // ----------------- Public API -----------------

  /**
   * @notice Verify a Data Streams report (schema v3 or v8).
   *
   * @dev Steps:
   *  1. Decode the unverified report to get `reportData`.
   *  2. Read the first two bytes → schema version (`0x0003` or `0x0008`).
   *     - Revert if the version is unsupported.
   *  3. Call `VerifierProxy.verify()` with an empty parameter payload.
   *  4. Decode the verified report into the correct struct and emit the price.
   *
   *  @param unverifiedReport Full payload returned by Streams Direct.
   *  @custom:reverts InvalidReportVersion when schema ≠ v3/v8.
   */
  function verifyReport(
    bytes memory unverifiedReport
  ) external {
    // ─── 1. & 2. Extract reportData and schema version ──
    (, bytes memory reportData) = abi.decode(unverifiedReport, (bytes32[3], bytes));

    uint16 reportVersion = (uint16(uint8(reportData[0])) << 8) | uint16(uint8(reportData[1]));
    if (reportVersion != 3 && reportVersion != 8) {
      revert InvalidReportVersion(reportVersion);
    }

    // ─── 3. Verify through the proxy ──
    bytes memory verified = i_verifierProxy.verify(unverifiedReport, bytes(""));

    // ─── 4. Decode & store price ──
    if (reportVersion == 3) {
      int192 price = abi.decode(verified, (ReportV3)).price;
      lastDecodedPrice = price;
      emit DecodedPrice(price);
    } else {
      int192 price = abi.decode(verified, (ReportV8)).midPrice;
      lastDecodedPrice = price;
      emit DecodedPrice(price);
    }
  }

  /**
   * @notice Verify multiple Data Streams reports (schema v3 or v8) in one transaction.
   *
   * @dev Steps:
   *  1. Decode each payload to extract `reportData` and the schema version.
   *     - Revert if any version is unsupported.
   *  2. Call `VerifierProxy.verifyBulk()` once with all payloads and an empty
   *     parameter payload.
   *  3. Decode each verified report, store prices in `lastDecodedPrices`,
   *     and emit a `DecodedPrice` event per report.
   *
   *  @param unverifiedReports Array of full payloads from Streams Direct.
   *         Each payload may reference a different feed ID.
   *  @custom:reverts EmptyReportsArray    when called with an empty array.
   *  @custom:reverts InvalidReportVersion when any schema version ≠ v3/v8.
   */
  function verifyBulkReports(
    bytes[] memory unverifiedReports
  ) external {
    if (unverifiedReports.length == 0) revert EmptyReportsArray();

    // ─── 1. Decode all payloads upfront ──
    bytes[] memory reportDataArray = new bytes[](unverifiedReports.length);
    uint16[] memory reportVersions = new uint16[](unverifiedReports.length);

    for (uint256 i = 0; i < unverifiedReports.length; i++) {
      (, bytes memory reportData) = abi.decode(unverifiedReports[i], (bytes32[3], bytes));

      uint16 reportVersion = (uint16(uint8(reportData[0])) << 8) | uint16(uint8(reportData[1]));
      if (reportVersion != 3 && reportVersion != 8) {
        revert InvalidReportVersion(reportVersion);
      }

      reportDataArray[i] = reportData;
      reportVersions[i] = reportVersion;
    }

    // ─── 2. Verify all reports in one proxy call ──
    bytes[] memory verifiedReports = i_verifierProxy.verifyBulk(unverifiedReports, bytes(""));

    // ─── 3. Decode verified reports, store prices, emit events ──
    int192[] memory prices = new int192[](verifiedReports.length);

    for (uint256 i = 0; i < verifiedReports.length; i++) {
      int192 price;
      if (reportVersions[i] == 3) {
        price = abi.decode(verifiedReports[i], (ReportV3)).price;
      } else {
        price = abi.decode(verifiedReports[i], (ReportV8)).midPrice;
      }
      prices[i] = price;
      emit DecodedPrice(price);
    }

    lastDecodedPrices = prices;
  }

  /**
   * @notice Withdraw all balance of an ERC-20 token held by this contract.
   * @param _beneficiary Address that receives the tokens.
   * @param _token       ERC-20 token address.
   */
  function withdrawToken(
    address _beneficiary,
    address _token
  ) external onlyOwner {
    uint256 amount = IERC20(_token).balanceOf(address(this));
    if (amount == 0) revert NothingToWithdraw();
    IERC20(_token).safeTransfer(_beneficiary, amount);
  }
}
