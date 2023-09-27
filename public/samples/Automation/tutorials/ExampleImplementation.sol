// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * THIS IS AN EXAMPLE OF A CONTRACT FOR CIRCUIT BREAKER. IT HAS 2 PRIMARY FUNCTIONS: (A) TO CHECK FOR A CERTAIN CONDITION AND (B) TO EXECUTE AN ACTION
 * THIS IS A FLEXIBLE CONTRACT THAT CAN BE USED TO BUILD ANY CONDITION SET AND ANY EXECUTION. IN THIS CASE THE CONDITION BEING CHECKED IS THE PRICE OF AN ASSET
 * AND THE ACTION BEING EXECUTED IS INCREMENTING A COUNTER. THIS CONTRACT BECOMES AN INPUT INTO AN UPKEEP CONTRACT FOR MANY DIFFERENT CIRCUIT BREAKING
 * CONDITIONS. SO THIS WAY, THE UPKEEP CONTRACT REMAINS THE SAME, BUT USING CHECK DATA YOU CAN PASS IN A CONTRACT LIKE THIS AS A CUSTOMIZABLE CIRCUIT BREAKER
 *
 */

contract ExampleDataConsumerV3 is Ownable {
    AggregatorV3Interface internal dataFeed;

    uint256 public counter;
    int public maxbalance;
    bool emergencyPossible;
    address feedAddress;
    event emergencyActionPerformed(uint256 counter, address feedAddress);
    bool circuitbrokenflag;
    int currentAnswer;

    /**
     * Network: Sepolia
     */
    constructor(
        int _maxbalance,
        address _feedAddress,
        bool _emergencyPossible
    ) {
        dataFeed = AggregatorV3Interface(_feedAddress);
        maxbalance = _maxbalance;
        counter = 0;
        emergencyPossible = _emergencyPossible;
        feedAddress = _feedAddress;
    }

    /**
     * Returns true if the price is greater than a certain value.
     */
    function isFeedParamMet() public view returns (bool) {
        // prettier-ignore
        return ((getLatestData() > maxbalance) && !circuitbrokenflag);
    }

    /**
     * executes emergency action
     */
    function executeEmergencyAction() external {
        counter += 1;
        circuitbrokenflag = true;
        emit emergencyActionPerformed(counter, feedAddress);
    }

    // Function to view the number of times emergency was invoked
    function getCount() external view returns (uint256) {
        return counter;
    }

    function isEmergencyActionPossible() external view returns (bool) {
        return emergencyPossible;
    }

    function resetcircuitbreaking(bool circuitbreakingflag) external onlyOwner {
        circuitbrokenflag = circuitbreakingflag;
    }

    function resetmaxBalance(int max) external onlyOwner {
        maxbalance = max;
    }

    function currentfeedAnswer() external view returns (int) {
        return currentAnswer;
    }

    //function to get latest answer
    function getLatestData() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
