---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "The Basics: Using Hybrid Smart Contracts"
permalink: "docs/beginners-tutorial/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Get the Latest Price":"/docs/get-the-latest-price/", "Random Numbers Guide":"/docs/get-a-random-number/"}
metadata:
  title: "The Basics Tutorial"
  description: "Learn what smart contracts are, how to write them, and how to use Chainlink data feeds to deploy your very own Chainlink smart contract."
  image:
    0: "/files/1a63254-link.png"
---

> 👍 New to smart contracts?
>
> If you're new to smart contract development this is a great place to start. We'll walk you through developing your first smart contract that interacts with Chainlink. If you're familiar with creating smart contracts and want to learn more about the applications of *hybrid* smart contracts start using Data Feeds start [here](#5-what-are-oracles-why-are-they-important).

<p>
  https://www.youtube.com/watch?v=rFXSEEQG9YE
</p>


# Overview

In this tutorial, you will learn about hybrid smart contracts. You will then create a hybrid smart contract using Chainlink's Data Feeds and deploy this contract to an Ethereum testnet.

**Table of Contents**

+ [Overview](#overview)
+ [1. What is a smart contract? What is a hybrid smart contract?](#1-what-is-a-smart-contract-what-is-a-hybrid-smart-contract)
+ [2. What language is a smart contract written in?](#2-what-language-is-a-smart-contract-written-in)
+ [3. What does a smart contract look like?](#3-what-does-a-smart-contract-look-like)
+ [4. What does "deploying" mean?](#4-what-does-deploying-mean)
+ [5. What are oracles? Why are they important?](#5-what-are-oracles-why-are-they-important)
+ [6. How do smart contracts use oracles?](#6-how-do-smart-contracts-use-oracles)
+ [7. How do I deploy to testnet?](#7-how-do-i-deploy-to-testnet)
+ [8. Further Reading](#8-further-reading)

# 1. What is a smart contract? What is a hybrid smart contract?

When deployed to a blockchain, a **smart contract** is a set of instructions that can be executed without intervention from third parties. The code of a smart contract determines how it responds to input, just like the code of any other computer program.

A valuable feature of smart contracts is that they can store and manage on-chain assets (like [ETH or ERC20 tokens](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)), just like you can with an Ethereum wallet. Because they have an on-chain address like a wallet, they can do everything any other address can. This opens the door for programming automated actions when receiving and transferring assets.

Smart contracts can connect to real-world market prices of assets to produce powerful applications. Being able to securely connect smart contracts with off-chain data and services is what makes them *hybrid* smart contracts. This is done with oracles, which we will discuss [later](#5-what-are-oracles-why-are-they-important) in this tutorial.

# 2. What language is a smart contract written in?

The most popular language for writing smart contracts on Ethereum is [Solidity](https://docs.soliditylang.org/en/v0.8.7/). It was created by the Ethereum Foundation specifically for smart contract development and is constantly being updated.

If you've ever written Javascript, Java, or other object-oriented scripting languages, Solidity should be easy to understand. Similar to object-oriented languages, Solidity is considered to be a *contract*-oriented language.

# 3. What does a smart contract look like?

The structure of a smart contract is similar to that of a class in Javascript, with a few differences. Let's take a look at this `HelloWorld` example.

```solidity
{% include samples/Tutorials/HelloWorld.sol %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/HelloWorld.sol" target="_blank" >Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

## Define the Version of Solidity

The first thing that every Solidity file must have is the Solidity version definition. The version HelloWorld.sol is using is 0.8.7, defined by `pragma solidity 0.8.7;`

You can see the latest versions of the Solidity compiler [here](https://github.com/ethereum/solc-bin/blob/gh-pages/bin/list.txt/?target=_blank). You might also notice Solidity files containing definitions with multiple versions of Solidity:

```solidity
pragma solidity >=0.7.0 <0.9.0;
```
This means that the code is written for Solidity version 0.7.0, or a newer version of the language up to, but not including version 0.9.0. In short, `pragma` is used to instruct the compiler as how to treat the code.

## Start your Contract

Next, the `HelloWorld` contract is defined by using the keyword `contract`. Think of this as being similar to declaring `class` in Javascript. The implementation of `HelloWorld` is inside this definition, denoted with curly braces.

```solidity
contract HelloWorld {

}
```

## Variables

Again, like Javascript, contracts can have state variables and local variables. **State variables** are variables with values that are permanently stored in contract storage. The values of **local variables**, however, are present only until the function is executing. There are also different types of variables you can use within Solidity, such as `string`, `uint256`, etc. Check out the [Solidity documentation](https://docs.soliditylang.org/en/v0.8.7/) to learn more about the different kinds of variables and types.

*Modifiers* are used to change the level of access to these variables. Here are some examples of state variables with different modifiers:

```solidity
string public message;
uint256 internal internalVar;
uint8 private privateVar;
bool external isTrue;
```

## The Constructor

Another familiar concept to programmers is the **constructor**. It is called upon deploying the contract, so as to set the state of the contract once created.

In `HelloWorld`, the constructor takes in a `string` as a parameter and sets the `message` state variable to that string.

```solidity
constructor(string memory initialMessage) {
  message = initialMessage;
}
```

## Using Functions

**Functions** are used to access and modify the state of the contract, and call functions on external contracts. `HelloWorld` has a function called `updateMessage`, which updates the current message stored in the state.

```solidity
constructor(string memory initialMessage) {
  message = initialMessage;
}

function updateMessage(string memory newMessage) public {
  message = newMessage;
}
```

# 4. What does "deploying" mean?

**Deploying** a smart contract is the process of pushing the code to the blockchain, at which point it resides with an on-chain address. Once it's deployed, the code cannot be changed and is said to be *immutable*.

As long as the address is known, its functions can be called through an interface, on [Etherscan](https://etherscan.io/), or through a library like [web3js](https://web3js.readthedocs.io/), [web3py](https://web3py.readthedocs.io/), [ethers](https://docs.ethers.io), and more. Contracts can also be written to interact with other contracts on the blockchain.

# 5. What are oracles? Why are they important?

**Oracles** provide a bridge between the real-world and on-chain smart contracts, by being a source of data that smart contracts can rely on, and act upon.

Oracles play an extremely important role in facilitating the full potential of smart contract utility. Without a reliable connection to real-world conditions, smart contracts are unable to effectively serve the real-world.

# 6. How do smart contracts use oracles?

Oracles are most popularly used with [*Data Feeds*](../using-chainlink-reference-contracts/). DeFi platforms like [AAVE](https://aave.com/) and [Synthetix](https://www.synthetix.io/) use Chainlink data feed oracles to obtain accurate real-time asset prices in their smart contracts.

Chainlink data feeds are sources of data [aggregated from many independent Chainlink node operators](../architecture-decentralized-model/). Each data feed has an on-chain address and functions that enable contracts to read from that address. For example, the [ETH / USD feed](https://feeds.chain.link/eth-usd/).

![Chainlink Feeds List](/images/contract-devs/price-aggr.png)

## Information about Interfaces
Before using data feeds, it's important to understand how interfaces work in Solidity. An **interface** is another concept that will be familiar to programmers of other languages.

Interfaces define functions without their implementation, leaving inheriting contracts to define the actual implementation themselves. This makes it easier to know what functions to call in a contract. Here's an example of an interface:

```solidity
{% include samples/Tutorials/Test.sol %}
```
<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/Test.sol" target="_blank">Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

For this example, `override` is necessary in the `Test` contract function because it overrides the base function contained in the `numberComparison` interface. The contract uses `pure` instead of `view` because the `isSameNum` function in the `Test` contract does not return a storage variable.

## Using Chainlink Data Feeds

The following code is from the [Get the Latest Price](../get-the-latest-price/) page. It describes a contract which obtains the latest ETH / USD price using the Kovan testnet.

```solidity
{% include samples/PriceFeeds/PriceConsumerV3.sol %}
```

Notice how the code imports an interface called `AggregatorV3Interface`. In this case, `AggregatorV3Interface` defines that all V3 Aggregators will have the function `latestRoundData`. You can see all of the functions that a V3 Aggregator exposes in the[`AggregatorV3Interface` file on Github](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol/).

Our contract is initialized with the hard-coded address of the Kovan data feed for ETH / USD prices. Then, `getLatestPrice` uses `latestRoundData` to obtain the most recent round of price data. We're interested in the price, so the function returns that.

# 7. How do I deploy to testnet?

There are a few things that are needed to deploy a contract to a testnet:

- [x] Smart contract code
- [ ] A Solidity compiler
- [ ] An address to deploy from
- [ ] Some ETH (in our case, testnet ETH, which is free)

You should have the code. What you need next is a compiler.

## The Remix IDE

[Remix](https://remix.ethereum.org/) is an online IDE which enables anyone to write, compile and deploy smart contracts from the browser.

Fortunately for us, Remix also has support for samples. This means that Remix can load code from Github, and in this case, `PriceConsumerV3.sol` Click the button below to open a new tab, then once Remix has loaded, find the **docs.chain.link** > **samples** > **PriceFeeds** folder in the File Explorer on the left-hand side, and click on the file to open the code in the editor.

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol" target="_blank">Deploy using Remix</a>
  <a href="../deploy-your-first-contract/" >What is Remix?</a>
</div>

![Remix Select PriceConsumerV3.sol](/files/beginner-tutorial-remix-snapshot.png)

Get familiar with the layout of Remix and play around with the contract. This is what you'll use for the compiler.

- [x] Smart contract code
- [x] A Solidity compiler
- [ ] An address to deploy from
- [ ] Some ETH

Now you need an address to deploy from.

## Metamask Wallet

Contracts are deployed by addresses on the network, so to deploy your own you need an address. Not only that, but you need an address which you can easily use with Remix. Fortunately, Metamask is just what is needed. **Metamask** allows anyone to create an address, store funds and interact with Ethereum compatible blockchains from a browser extension.

Head to the [Metamask website](https://metamask.io/) to download, install and create an account.

Once that's done, navigate to the Kovan testnet inside Metamask extension, as seen in the image below.

![Metamask Select Kovan Screen](/files/de9b81c-kovan.gif)

You now have an address to deploy to the Kovan testnet from.

- [x] Smart contract code
- [x] A Solidity compiler
- [x] An address to deploy from
- [ ] Some ETH

You'll finally need to obtain ETH to deploy our smart contract to a testnet.

## Obtaining testnet ETH

Making transactions on Ethereum blockchains are not free, they cost ETH. Deploying a contract is no exception to this rule. Fortunately, testnet ETH doesn't actually cost anything, since the purpose of testnets is to test smart contracts publically before they are deployed to the mainnet.

Connect your Metamask wallet and request ETH from one of the available faucets on [LINK Token Contracts page](../link-token-contracts/).

- [x] Smart contract code
- [x] A Solidity compiler
- [x] An address to deploy from
- [X] Some ETH

Great, you now have all the necessary components to compile and deploy your smart contract!

## Compiling your Smart Contract

You should have all the pieces needed to deploy our price consumer to Kovan. To start the process you will need to compile it first. Head back to the **Remix** tab.

Under the logo in the top left-hand corner, there's a vertical menu consisting of icons. Hovering over each button shows a tooltip explaining what each item is. The first is **File explorer**, which shows us all the files loaded into Remix. The second is **Solidity compiler**. Click on this icon to open up a side menu where you can compile your contract.

Remix should automatically detect the correct compiler version depending on the version specified in the contract and you should see a button that looks like this:

![Remix Click Complile PriceConsumerV3.sol](/files/99af570-Screenshot_2020-11-27_at_10.45.44.png)

Click it, and you will see some details below it by scrolling down. There might be a few yellow warnings, but don't worry about those for now. If the warnings are red, revisit your code and troubleshoot any bugs or errors which might be present.

## Deploying

Looking at the icon menu on the far-left again. Below the compiler icon should be **Deploy & run transactions**. Click on that.

This screen might seem a little more intimidating, but do not fret. This is where you will hook up Metamask to Remix so that it knows which account to deploy from.

Click **ENVIRONMENT**. the selected value should currently be **Javascript VM**. Instead, select **Injected Web3**. This should trigger a Metamask notification asking for permission to connect. Accept it, and your address should be automatically loaded into the **ACCOUNT** menu below **ENVIRONMENT**.

Once that's done, check that the **CONTRACT** menu displays the name of your contract. In many cases, Remix defaults to deploying the first contract which appears alphabetically in the menu; to prevent errors, select the correct contract, then click **Deploy**. Another Metamask notification will pop up asking for permission, and detailing how much GAS it will cost in testnet ETH. Confirm the transaction and await confirmation! This might take a few seconds depending on the network, so be patient.

## Get the Price

Once your smart contract is deployed, an item will appear in the **Deployed Contracts** section underneath the **Deploy** button. This is the deployed contract with all its address.

![Remix Deployed Contracts Section](/files/ca77c39-Screenshot_2020-11-27_at_10.56.56.png)

Click on the caret to see a list of all the functions available to call.

Click **getLatestPrice**, and voilà! The latest price appears just underneath the button. You have successfully deployed a smart contract, which uses Chainlink data feeds, to the Kovan Ethereum testnet!

# 8. Further Reading

To read more about data feeds, read our blog posts:

- [Build a dApp on xDai Chain With Secure Data Feeds](https://blog.chain.link/build-a-dapp-on-xdai-chain-with-secure-data-feeds/)
- [Build a dApp on Binance Smart Chain With Secure Data Feeds](https://blog.chain.link/build-a-dapp-on-binance-smart-chain-with-secure-data-feeds/)
- [The 3 Levels of Data Aggregation in Chainlink Price Feeds](https://blog.chain.link/levels-of-data-aggregation-in-chainlink-price-feeds/)

To explore more applications of data feeds, check out our [other tutorials](../other-tutorials/#data-feeds).
