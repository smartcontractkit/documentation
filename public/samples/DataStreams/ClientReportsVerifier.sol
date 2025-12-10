// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Common} from "@chainlink/contracts/src/v0.8/llo-feeds/libraries/Common.sol";
import {IVerifierFeeManager} from "@chainlink/contracts/src/v0.8/llo-feeds/v0.3.0/interfaces/IVerifierFeeManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE FOR DEMONSTRATION PURPOSES.
 * DO NOT USE THIS CODE IN PRODUCTION.
 *
 *  This contract can verify Chainlink Data Streams reports onchain and pay
 *  the verification fee in LINK (when required).
 *
 * - If `VerifierProxy.s_feeManager()` returns a non-zero address, the network
 *   expects you to interact with that FeeManager for every verification call:
 *   quote fees, approve the RewardManager, then call `verify()`.
 *
 * - If `s_feeManager()` returns the zero address, no FeeManager contract has
 *   been deployed on that chain. In that case there is nothing to quote or pay
 *   onchain, so the contract skips the fee logic entirely.
 *
 *  The `if (address(feeManager) != address(0))` check below chooses the
 *  correct path automatically, making the same bytecode usable on any chain.
 */

// ────────────────────────────────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────────────────────────────────

interface IVerifierProxy {
  /**
   * @notice Route a report to the correct verifier and (optionally) bill fees.
   * @param payload           Full report payload (header + signed report).
   * @param parameterPayload  ABI-encoded fee metadata.
   */
  function verify(
    bytes calldata payload,
    bytes calldata parameterPayload
  ) external payable returns (bytes memory verifierResponse);

  function verifyBulk(
    bytes[] calldata payloads,
    bytes calldata parameterPayload
  ) external payable returns (bytes[] memory verifiedReports);

  function s_feeManager() external view returns (IVerifierFeeManager);
}

interface IFeeManager {
  /**
   * @return fee, reward, totalDiscount
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

// ────────────────────────────────────────────────────────────────────────────
// Contract
// ────────────────────────────────────────────────────────────────────────────

/**
 * @dev This contract implements functionality to verify Data Streams reports from
 * the Data Streams API, with payment in LINK tokens.
 */
contract ClientReportsVerifier {
  // ----------------- Errors -----------------
  error NothingToWithdraw();
  error NotOwner(address caller);
  error InvalidReportVersion(uint16 version);

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
   *  3. Fee handling:
   *     - Query `s_feeManager()` on the proxy.
   *       – Non-zero → quote the fee, approve the RewardManager,
   *         ABI-encode the fee token address for `verify()`.
   *       – Zero     → no FeeManager; skip quoting/approval and pass `""`.
   *  4. Call `VerifierProxy.verify()`.
   *  5. Decode the verified report into the correct struct and emit the price.
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

    // ─── 3. Fee handling ──
    IFeeManager feeManager = IFeeManager(address(i_verifierProxy.s_feeManager()));

    bytes memory parameterPayload;
    if (address(feeManager) != address(0)) {
      // FeeManager exists — always quote & approve
      address feeToken = feeManager.i_linkAddress();

      (Common.Asset memory fee,,) = feeManager.getFeeAndReward(address(this), reportData, feeToken);

      IERC20(feeToken).approve(feeManager.i_rewardManager(), fee.amount);
      parameterPayload = abi.encode(feeToken);
    } else {
      // No FeeManager deployed on this chain
      parameterPayload = bytes("");
    }

    // ─── 4. Verify through the proxy ──
    bytes memory verified = i_verifierProxy.verify(unverifiedReport, parameterPayload);

    // ─── 5. Decode & store price ──
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
