// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ReceiverTemplate} from "./ReceiverTemplate.sol";

/**
 * @title CalculatorConsumer (Testing Version)
 * @notice This contract receives reports from a CRE workflow and stores the results of a calculation onchain.
 * @dev Inherits from ReceiverTemplate which provides security checks. The forwarder address must be
 * configured at deployment. Additional security checks (workflowId, author) can be enabled via setter functions.
 */
contract CalculatorConsumer is ReceiverTemplate {
  // Struct to hold the data sent in a report from the workflow
  struct CalculatorResult {
    uint256 offchainValue;
    int256 onchainValue;
    uint256 finalResult;
  }

  // --- State Variables ---
  CalculatorResult public latestResult;
  uint256 public resultCount;
  mapping(uint256 => CalculatorResult) public results;

  // --- Events ---
  event ResultUpdated(uint256 indexed resultId, uint256 finalResult);

  /**
   * @notice Constructor requires the forwarder address for security
   * @param _forwarderAddress The address of the Chainlink Forwarder contract (for testing: MockForwarder)
   * @dev The forwarder address enables the first layer of security - only the forwarder can call onReport.
   * Additional security checks can be configured after deployment using setter functions.
   */
  constructor(
    address _forwarderAddress
  ) ReceiverTemplate(_forwarderAddress) {}

  /**
   * @notice Implements the core business logic for processing reports.
   * @dev This is called automatically by ReceiverTemplate's onReport function after security checks.
   */
  function _processReport(
    bytes calldata report
  ) internal override {
    // Decode the report bytes into our CalculatorResult struct
    CalculatorResult memory calculatorResult = abi.decode(report, (CalculatorResult));

    // --- Core Logic ---
    // Update contract state with the new result
    resultCount++;
    results[resultCount] = calculatorResult;
    latestResult = calculatorResult;

    emit ResultUpdated(resultCount, calculatorResult.finalResult);
  }

  // This function is a "dry-run" utility. It allows an offchain system to check
  // if a prospective result is an outlier before submitting it for a real onchain update.
  // It is also used to guide the binding generator to create a method that accepts the CalculatorResult struct.
  function isResultAnomalous(
    CalculatorResult memory _prospectiveResult
  ) public view returns (bool) {
    // A result is not considered anomalous if it's the first one.
    if (resultCount == 0) {
      return false;
    }

    // Business logic: Define an anomaly as a new result that is more than double the previous result.
    // This is just one example of a validation rule you could implement.
    return _prospectiveResult.finalResult > (latestResult.finalResult * 2);
  }
}
