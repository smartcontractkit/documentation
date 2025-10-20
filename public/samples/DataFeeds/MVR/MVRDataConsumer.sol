// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IBundleAggregatorProxy} from "@chainlink/contracts/src/v0.8/data-feeds/interfaces/IBundleAggregatorProxy.sol";

/**
 * @notice This struct defines the exact data structure of the MVR feed
 * @dev The order and types must match exactly what's defined in the feed
 */
struct Data {
  uint256 netAssetValue;
  uint256 assetsUnderManagement;
  uint256 outstandingShares;
  uint256 netIncomeExpenses;
  bool openToNewInvestors;
}

contract MVRDataConsumer {
  // Reference to the MVR feed proxy
  IBundleAggregatorProxy public s_proxy;

  // Maximum allowed staleness duration for the data
  // IMPORTANT: This should be configured based on the specific feed's heartbeat interval
  // Check the feed's documentation for the appropriate value instead of using this example value
  uint256 public immutable STALENESS_THRESHOLD;

  // Storage for scaled values (after dividing by decimals)
  uint256 public netAssetValue;
  uint256 public assetsUnderManagement;
  uint256 public outstandingShares;
  uint256 public netIncomeExpenses;
  bool public openToNewInvestors;

  // Storage for original onchain values (no decimal adjustments)
  uint256 public rawNetAssetValue;
  uint256 public rawAssetsUnderManagement;
  uint256 public rawOutstandingShares;
  uint256 public rawNetIncomeExpenses;

  // Keep track of decimals for each field in the struct.
  // Non-numeric fields (e.g., bool) typically return 0.
  uint8[] public decimals;

  // Error for stale data
  error StaleData(uint256 lastUpdateTimestamp, uint256 blockTimestamp, uint256 threshold);

  // Error for insufficient decimals array
  error InsufficientDecimals(uint256 expected, uint256 actual);

  /**
   * @notice Constructor that sets the staleness threshold for the feed
   * @param _proxy The address of the MVR feed's proxy contract
   * @param _stalenessThreshold Maximum time (in seconds) since last update before data is considered stale
   * @dev The threshold should be based on the feed's heartbeat interval from documentation
   * For example, if a feed updates every 24 hours (86400s), you might set this to 86400s + some buffer
   */
  constructor(IBundleAggregatorProxy _proxy, uint256 _stalenessThreshold) {
    s_proxy = _proxy;
    STALENESS_THRESHOLD = _stalenessThreshold;
  }

  /**
   * @notice Stores the decimals array in your contract for repeated usage.
   * @dev Index mapping for this example:
   *      0 -> netAssetValue,
   *      1 -> assetsUnderManagement,
   *      2 -> outstandingShares,
   *      3 -> netIncomeExpenses,
   *      4 -> openToNewInvestors (likely returns 0).
   */
  function storeDecimals() external {
    decimals = s_proxy.bundleDecimals();
  }

  /**
   * @notice Returns the timestamp of the most recent MVR feed update.
   */
  function getLatestBundleTimestamp() external view returns (uint256) {
    return s_proxy.latestBundleTimestamp();
  }

  /**
   * @notice Simple boolean check for data freshness (block explorer friendly)
   * @return true if data is fresh, false if stale
   */
  function isDataFresh() public view returns (bool) {
    uint256 lastUpdateTime = s_proxy.latestBundleTimestamp();
    return (block.timestamp - lastUpdateTime) <= STALENESS_THRESHOLD;
  }

  /**
   * @notice Fetches and decodes the latest MVR feed data, then stores both the raw and scaled values.
   * @dev This process demonstrates the complete flow of consuming MVR feed data:
   * 1. Check data freshness
   * 2. Fetch the raw bytes
   * 3. Decode into the struct matching the feed's data structure
   * 4. Store raw values (preserving original precision)
   * 5. Apply decimal conversions to get the true numerical values
   */
  function consumeData() external {
    // Check data freshness before proceeding
    if (!isDataFresh()) {
      uint256 lastUpdateTime = s_proxy.latestBundleTimestamp();
      revert StaleData(lastUpdateTime, block.timestamp, STALENESS_THRESHOLD);
    }

    // Ensure we have the decimals array - if not, fetch it
    if (decimals.length == 0) {
      decimals = s_proxy.bundleDecimals();
    }

    // Verify we have enough decimal values for our struct fields
    if (decimals.length < 4) {
      revert InsufficientDecimals(4, decimals.length);
    }

    // 1. Retrieve the raw bytes from the MVR feed
    // This is the encoded form of all data fields packed together
    bytes memory b = s_proxy.latestBundle();

    // 2. Decode the raw bytes into our known struct
    // The struct Data must match exactly what the feed encodes
    Data memory d = abi.decode(b, (Data));

    // 3. Store the raw (original onchain) values
    // These preserve the full precision as reported by the feed
    rawNetAssetValue = d.netAssetValue;
    rawAssetsUnderManagement = d.assetsUnderManagement;
    rawOutstandingShares = d.outstandingShares;
    rawNetIncomeExpenses = d.netIncomeExpenses;
    openToNewInvestors = d.openToNewInvestors; // Boolean, no need for decimal adjustment

    // 4. Convert values by dividing by 10^decimals[i]
    // This removes the decimal scaling factor to get the human-readable representation
    // Note: This uses integer division which truncates decimal places
    // For example, if decimals[0] = 8 and rawNetAssetValue = 1850000000,
    // then netAssetValue = 18 (integer division, decimals are truncated)
    netAssetValue = d.netAssetValue / (10 ** decimals[0]);
    assetsUnderManagement = d.assetsUnderManagement / (10 ** decimals[1]);
    outstandingShares = d.outstandingShares / (10 ** decimals[2]);
    netIncomeExpenses = d.netIncomeExpenses / (10 ** decimals[3]);
    // Note: We don't need to apply decimals to boolean fields
    // The openToNewInvestors field typically has 0 decimals in the array
  }
}
