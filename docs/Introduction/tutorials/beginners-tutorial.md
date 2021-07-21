---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Connect Contracts to Oracles"
permalink: "docs/connect-to-oracles/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Obtain Random Numbers for a Contract":"/docs/intermediates-tutorial/", "Call Public APIs from a Contract":"/docs/advanced-tutorial/", "Learn about Chainlink Keepers":"/docs/chainlink-keepers/introduction/"}
metadata:
  title: "Connect Contracts to Oracles"
  description: "Learn how to add Chainlink oracles to your smart contracts."
  image:
    0: "/files/1a63254-link.png"
---

<p>
  https://www.youtube.com/watch?v=rFXSEEQG9YE
</p>

## Before you begin

This tutorial assumes that you know how to create and deploy basic smart contracts. If you are new to smart contract development, learn how to [Deploy Your First Smart Contract](../first-contract/) before you start this exercise.

## How do smart contracts use oracles?

Oracles play an extremely important role in facilitating the full potential of smart contract utility. Without a reliable connection to real-world data, smart contracts are unable to serve the real world. Oracles provide a bridge between the real world and on-chain smart contracts, by being a source of data that smart contracts can rely on and act upon.

Oracles are often used to create [Price Feeds](../using-chainlink-reference-contracts/). Decentralized Finance platforms (DeFi) like [AAVE](https://aave.com/) and [Synthetix](https://www.synthetix.io/) use Chainlink price feed oracles to obtain accurate real-time asset prices for their smart contracts.

Chainlink price feeds are sources of data aggregated from many independent Chainlink node operators. Each price feed has an on-chain address and functions that enable contracts to read pricing data from that address. You can learn more about data aggregation on the [Decentralized Data Model](../architecture-decentralized-model/) page.

The [ETH / USD feed](https://feeds.chain.link/eth-usd) is one example of decentralized data aggregation.

![A screenshot of the ETH / USD feed interface showing the price of ETH and all of the oracles contributing to consensus on that price.](/images/contract-devs/price-aggr.png)

## Connect a smart contract to a Chainlink oracle for price feeds

Many oracles and aggregator contracts are already deployed, so your smart contracts can consume their data right away even if you have no knowledge about how oracle networks function. For example, the following code describes a contract that obtains the latest ETH / USD price using the Kovan testnet.

```solidity
pragma solidity ^0.8.0;

import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;

    constructor() {
        priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }

    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
}
```

The contract has the following components:

+ The `import` line imports a file from GitHub that defines an interface named `AggregatorV3Interface`. Interfaces define functions without their implementation, which leaves inheriting contracts to define the actual implementation themselves. This interface prepares the contract to call functions in another contract that is already deployed. You can [see the complete code](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol) of `AggregatorV3Interface` on GitHub.

+ The `constructor() {}` initializes an interface object named `priceFeed` that uses `AggregatorV3Interface` and connects specifically to an aggregator contract that is already deployed at the `0x9326BFA02ADD2366b30bacB125260Af641031331` address. The interface allows your contract to run functions on that deployed aggregator contract. You can [see the complete code](https://kovan.etherscan.io/address/0x9326BFA02ADD2366b30bacB125260Af641031331#code) for the deployed aggregator contract on Etherscan.

+ The `getLatestPrice()` function calls your `priceFeed` object and runs the `latestRoundData()` function. Because your contract already initialized the `priceFeed` object to point to the aggregator at `0x9326BFA02ADD2366b30bacB125260Af641031331`, your contract connects to that address and executes the function. The aggregator connects with several oracle nodes and aggregates the pricing data from those nodes. The response from the aggregator includes several variables, but `getLatestPrice()` returns only the `price` variable.

You can see a great example of the blockchain's immutable characteristics in the `priceFeed` variable. The `constructor() {}` initializes this variable with a specific interface and a specific address when you deploy the contract. You did not define a function that is able to change the address or the interface logic, so it is hard coded in the blockchain forever. That characteristic does not exist in a traditional server environment where variables and code are vulnerable to manipulation from anybody who gains access to the system.

## Deploy the contract and get the price data

You can deploy this code on the Kovan testnet and experiment with the functions. If you are new to smart contract development, learn how to [Deploy Your First Smart Contract](../first-contract/) before you start this exercise.

1. [Open the example contract](https://remix.ethereum.org/#gist=f2b0dc524940b456b7c6a20113c74d29) in the Remix IDE.

1. Compile the contract using the default settings. You might get some warnings about unused variables, but you can ignore them.

1. On the **Deploy** tab, select the **Injected Web3** environment. This contract specifically requires Web3 because it connects with another contract on the blockchain. Running in a JavaScript VM will not work.

1. Click **Deploy** to deploy the contract to the Kovan testnet. MetaMask opens and asks you to confirm payment for deploying the contract. Ensure that MetaMask is set to the Kovan network before you accept the transaction. After the contract deploys, your contract appears under the **Deployed Contracts** section in Remix.
    ![A screenshot showing the deployed contract.](/files/ca77c39-Screenshot_2020-11-27_at_10.56.56.png)

1. Click the name of your deployed contract to view the available functions.

1. Click **getLatestPrice** to show the latest price from the aggregator contract. The latest price appears just below the button. The returned price is an integer, so it is missing its decimal point.
    ![A screenshot showing the deployed contract.](/files/getLatestPrice.png)

In summary, your contract executed `latestRoundData()` on the `AggregatorV3Interface` at the `0x9326BFA02ADD2366b30bacB125260Af641031331` contract. That aggregator connects to several oracles to retrieve the pricing data, aggregate that data, and provide that data to your smart contract.

You can run your own oracle networks that provide data to smart contracts similar to the `AggregatorV3Interface`, but first you should learn how configure your contracts to pay oracles using LINK tokens. Follow the [Generate Random Numbers](../intermediates-tutorial/) to learn how.
