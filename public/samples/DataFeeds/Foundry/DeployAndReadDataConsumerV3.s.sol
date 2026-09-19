// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* solhint-disable no-console */

import {DataConsumerV3} from "../../src/DataFeeds/DataConsumerV3.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";

/**
 * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 *
 * Deploy DataConsumerV3 and read the latest BTC/USD price on Sepolia.
 *
 * Usage:
 *   forge script script/DataFeeds/DeployAndReadDataConsumerV3.s.sol \
 *     --rpc-url $SEPOLIA_RPC_URL \
 *     --broadcast \
 *     --private-key $PRIVATE_KEY
 */
contract DeployAndReadDataConsumerV3 is Script {
  // Sepolia BTC / USD price feed proxy address
  address public constant SEPOLIA_BTC_USD = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43;

  function run() public {
    vm.startBroadcast();

    // 1. Deploy the consumer contract
    DataConsumerV3 consumer = new DataConsumerV3();
    console2.log("DataConsumerV3 deployed at:", address(consumer));

    vm.stopBroadcast();

    // 2. Read the latest price through the consumer
    int256 answer = consumer.getChainlinkDataFeedLatestAnswer();
    console2.log("Latest answer (raw):", uint256(answer));

    // 3. Read decimals directly from the feed to scale the answer
    uint8 decimals = AggregatorV3Interface(SEPOLIA_BTC_USD).decimals();
    console2.log("Decimals:", decimals);
    console2.log("Latest price (scaled): %s", _scale(answer, decimals));
  }

  function _scale(
    int256 answer,
    uint8 decimals
  ) internal pure returns (string memory) {
    // Convert the integer answer to a human-readable price string.
    // For 8 decimals, 3030914000000 -> "30309.14000000"
    uint256 magnitude = uint256(answer);
    uint256 base = 10 ** decimals;
    uint256 whole = magnitude / base;
    uint256 fraction = magnitude % base;
    return string.concat(vm.toString(whole), ".", vm.toString(fraction));
  }
}
