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
 *
 * To format the raw answer as a human-readable price, pass it together with
 * the feed's decimals to cast:
 *   cast format-units <answer> <decimals>
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
    console2.log("Latest answer (raw):", answer);

    // 3. Read the feed's decimals so you can scale the answer offchain
    uint8 decimals = AggregatorV3Interface(SEPOLIA_BTC_USD).decimals();
    console2.log("Decimals:", decimals);
  }
}
