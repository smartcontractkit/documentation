---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Consuming Data Feeds"
permalink: "docs/consuming-data-feeds/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Random Numbers: Using Chainlink VRF":"/docs/intermediates-tutorial/", "Connect contracts to Any API":"/docs/advanced-tutorial/", "Chaink Keepers":"/docs/chainlink-keepers/introduction/"}
metadata:
  title: "Consuming Data Feeds"
  description: "Learn how to consume Chainlink Data Feeds in your smart contracts."
  image:
    0: "/files/1a63254-link.png"
---

> 📘 New to smart contracts?
>
> This tutorial assumes that you know how to create and deploy basic smart contracts. If you are new to smart contract development, learn how to [Deploy Your First Smart Contract](/docs/deploy-your-first-contract/) before you start this guide.

## Overview

When you connect a smart contract to real-world services or off-chain data, you create a *hybrid smart contract*. For example, you can use Chainlink Data Feeds to connect your smart contracts to asset pricing data like the [ETH / USD feed](https://feeds.chain.link/eth-usd). These data feeds use the data aggregated from many independent Chainlink node operators. Each price feed has an on-chain address and functions that enable contracts to read pricing data from that address.

This guide shows you how to write, deploy, and run a smart contract that consumes data from a price data feed.

**Topics**

+ [Overview](#overview)
+ [Examine the sample contract](#examine-the-sample-contract)
+ [Compile, deploy, and run the contract](#compile-deploy-and-run-the-contract)

## Examine the sample contract

The following code describes a contract that obtains the latest ETH / USD price using the Rinkeby testnet.

```solidity
{% include 'samples/PriceFeeds/PriceConsumerV3.sol' %}
```

The contract has the following components:

+ The `import` line imports an interface named `AggregatorV3Interface`. Interfaces define functions without their implementation, which leaves inheriting contracts to define the actual implementation themselves. In this case, `AggregatorV3Interface` defines that all v3 Aggregators have the function `latestRoundData`. You can [see the complete code](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol) for the `AggregatorV3Interface` on GitHub.

+ The `constructor() {}` initializes an interface object named `priceFeed` that uses `AggregatorV3Interface` and connects specifically to a proxy aggregator contract that is already deployed at `0x9326BFA02ADD2366b30bacB125260Af641031331`. The interface allows your contract to run functions on that deployed aggregator contract.

+ The `getLatestPrice()` function calls your `priceFeed` object and runs the `latestRoundData()` function. When you deploy the contract, it initializes the `priceFeed` object to point to the aggregator at `0x9326BFA02ADD2366b30bacB125260Af641031331`, which is the proxy address for the Rinkeby ETH / USD data feed. Your contract connects to that address and executes the function. The aggregator connects with several oracle nodes and aggregates the pricing data from those nodes. The response from the aggregator includes several variables, but `getLatestPrice()` returns only the `price` variable.

## Compile, deploy, and run the contract

> 🚧 If you have not already configured your MetaMask wallet and funded it with testnet ETH, follow the instructions in the Deploy Your First Smart Contract to set that up. You can get testnet ETH at https://faucets.chain.link/rinkeby/.

Deploy the `PriceConsumerV3` smart contract on the Rinkeby testnet.

1. [Open the example contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol) in Remix. Remix opens and shows the contents of the smart contract.

    <div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol" target="_blank">Open the contract in Remix</a>
    </div>

1. Because the code is already written, you can start the compile step. On the left side of Remix, click the **Solidity Compiler** tab to view the compiler settings.
    ![Screenshot showing the Compiler tab and its settings.](/images/getting-started/selectSolidityCompiler.png)

1. Use the default compiler settings. Click the **Compile PriceConsumerV3.sol** button to compile the contract. Remix automatically detects the correct compiler version depending on the `pragma` that you specify in the contract. You can ignore warnings about unused local variables in this example.
    ![Screenshot of the Compile button.](/images/getting-started/compilePriceConsumerV3.png)

1. On the **Deploy** tab, select the **Injected Provider** environment. This contract specifically requires Web3 because it connects with another contract on the blockchain. Running in a JavaScript VM will not work.
    ![Screenshot showing the Injected Provider environment selected.](/images/getting-started/selectWeb3.png)

1. Because the example contract has several imports, Remix might select another contract to deploy by default. In the **Contract** section, select the `PriceConsumerV3` contract to make sure that Remix deploys the correct contract.
    ![Screenshot showing PriceConsumerV3 as the contract to deploy.](/images/getting-started/selectPriceConsumerV3.png)

1. Click **Deploy** to deploy the contract to the Rinkeby testnet. MetaMask opens and asks you to confirm payment for deploying the contract. Make sure MetaMask is set to the Rinkeby network before you accept the transaction. Because these transactions are on the blockchain, they are not reversible.
    ![Screenshot of the Deploy button for PriceConsumerV3.](/images/getting-started/deployPriceConsumerV3.png)

1. In the MetaMask prompt, click **Confirm** to approve the transaction and spend your testnet ETH required to deploy the contract.
    ![Screenshot showing Metamask asking you to confirm the transaction.](/images/getting-started/confirmTransaction.png)

1. After a few seconds, the transaction completes and your contract appears under the **Deployed Contracts** list in Remix. Click the contract dropdown to view its variables and functions.
    ![Remix Deployed Contracts Section](/images/getting-started/deployedContractPriceConsumerV3.png)

1. Click **getLatestPrice** to show the latest price from the aggregator contract. The latest price appears just below the button. The returned price is an integer, so it is missing its decimal point.
    ![A screenshot showing the deployed contract.](/images/getting-started/getLatestPrice.png)

You can run your own oracle networks that provide data to smart contracts similar to the `AggregatorV3Interface`, but first, you should learn how to configure your contracts to pay oracles using LINK tokens. Follow the [Generate Random Numbers](../intermediates-tutorial/) to learn how.
