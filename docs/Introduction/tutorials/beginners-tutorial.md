---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "The Basics Tutorial"
permalink: "docs/beginners-tutorial/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Get the Latest Price":"/docs/get-the-latest-price/", "Deploy your first contract":"/docs/deploy-your-first-contract/", "Random Numbers Tutorial":"/docs/intermediates-tutorial/"}
metadata:
  title: "The Basics Tutorial"
  description: "Learn what smart contracts are, how to write them, and how to use Chainlink data feeds to deploy your very own Chainlink smart contract."
  image:
    0: "/files/1a63254-link.png"
---

<p>
  https://www.youtube.com/watch?v=rFXSEEQG9YE
</p>

# Introduction

> 👍 New to smart contracts?
>
> If you're new to smart contract development this is a great place to start. We walk you through developing your first smart contract that interacts with Chainlink.

Chainlink's most popular feature is our [Data Feeds](../using-chainlink-reference-contracts/). They are the quickest way to connect smart contracts to the real-world market prices of assets. They are also extremely easy to implement.

In this tutorial we go through:
- What smart contracts are
- How to write them
- Why Oracles are important
- How Chainlink data feeds can be used in smart contracts

By the end, you will have written and deployed your very own Chainlink smart contract to an Ethereum testnet!

# 1. What is a smart contract?

When deployed to a blockchain, a smart contract is a set of instructions that can be executed without intervention from third parties. The code of a smart contract determines how it responds to input, just like the code of any other computer program.

A valuable feature of smart contracts is that they can store and manage on-chain assets (like ETH or ERC20 tokens), just like you or I can with an Ethereum wallet. Because they have an on-chain address, like a wallet, they can do everything any other address can. This opens the door for programming automated actions when receiving and transferring assets.

# 2. What language is a smart contract written in?

The most popular language for writing smart contracts on Ethereum is <a href="https://docs.soliditylang.org/en/v0.8.7/" target="_blank">Solidity</a>. It was created by the Ethereum Foundation specifically for smart contract development and is constantly being updated.

If you've ever written Javascript or similar languages, Solidity should be easy to understand.

# 3. What does a smart contract look like?

The structure of a smart contract is similar to that of a _class_ in Javascript, with a few differences. Let's take a look at this `HelloWorld` example.

```solidity
pragma solidity 0.8.7;

contract HelloWorld {
    string public message;

    constructor(string memory initialMessage) {
        message = initialMessage;
    }

    function updateMessage(string memory newMessage) public {
        message = newMessage;
    }
}
```

## 3a. Define the version `pragma solidity ...`

The first thing that every solidity file must have is the Solidity version definition. The version HelloWorld.sol is using is 0.8.7, defined by `pragma solidity 0.8.7;`

You can see the latest versions of the Solidity compiler <a href="https://github.com/ethereum/solc-bin/blob/gh-pages/bin/list.txt" target="_blank">here</a>.

## 3b. Start your contract `contract ... {`

Next, the `HelloWorld` contract is defined by using the keyword `contract`. Think of this as being similar to declaring a `class` in Javascript. The implementation of `HelloWorld` is inside this definition, denoted with curly braces.

## 3c. State variables `string public ...`

Again, like Javascript, contracts can have state variables and local variables. To find out more about all the types of variables you can use within Solidity, check out the <a href="https://docs.soliditylang.org/en/v0.8.7/" target="_blank">Solidity documentation</a>.

There are also different _modifiers_ you can use depending on what should have access to those variables.

## 3d. The `constructor`

Another familiar concept to programmers is the constructor. It is called upon deploying the contract, so as to set the state of the contract once created.

In `HelloWorld`, the constructor takes in a `string` as a parameter and sets the `message` state variable to that string.

## 3e. Using functions `function name(type paramName) ...`

Functions are used to access and modify the state of the contract, and call functions on external contracts. `HelloWorld` has a function called `updateMessage`, which updates the current message stored in the state.

# 4. What does "deploying" mean?

Deploying a contract to a blockchain is the process of pushing the code to the blockchain, at which point it resides with an on-chain address. Once it's deployed, the code cannot be changed, that's what makes it immutable.

So long as the address is known, its functions can be called through an interface, on <a href="https://etherscan.io/" target="_blank">Etherscan</a>, or through a library like <a href="https://web3js.readthedocs.io/en/v1.3.0/" target="_blank">web3js</a>, <a href="https://web3py.readthedocs.io/" target="_blank">web3py</a>, <a href="https://docs.ethers.io/v5/" target="_blank">ethers</a>, and more. Contracts can also be written to interact with other contracts on the blockchain.

# 5. Why are oracles important?

Oracles play an extremely important role in facilitating the full potential of smart contract utility. Without a reliable connection to real-world conditions, smart contracts are unable to effectively serve the real-world.

Oracles provide a bridge between the real-world and on-chain smart contracts, by being a source of data that smart contracts can rely on, and act upon.

# 6. How do smart contracts use oracles?

The most popular use for oracles is that of [Data Feeds](../using-chainlink-reference-contracts/) . DeFi platforms like <a href="https://aave.com/" target="_blank">AAVE</a> and <a href="https://www.synthetix.io/" target="_blank">Synthetix</a> use Chainlink data feed oracles to obtain accurate real-time asset prices in their smart contracts.

Chainlink data feeds are sources of data [aggregated from many independent Chainlink node operators](../architecture-decentralized-model/). Each data feed has an on-chain address and functions that enable contracts to read from that address. For example, the <a href="https://feeds.chain.link/eth-usd" target="_blank">ETH / USD feed</a>.

![Chainlink Feeds List](/images/contract-devs/price-aggr.png)

## 6a. Using Chainlink data feeds

The following code is from the [Get the Latest Price](../get-the-latest-price/) page. It describes a contract which obtains the latest ETH / USD price using the Kovan testnet.

```solidity
{% include samples/PriceFeeds/PriceConsumerV3.sol %}
```

On the 3rd line, the code imports an interface called `AggregatorV3Interface`. An interface is another concept that will be familiar to programmers of other languages. Interfaces define functions without their implementation, leaving inheriting contracts to define the actual implementation themselves.

Interfaces make it easier for calling contracts to know what functions to call. For example, in this case, `AggregatorV3Interface` defines that all V3 Aggregators will have the function `latestRoundData`. We can see all of the functions that a V3 Aggregator exposes in the <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol" target="_blank">`AggregatorV3Interface` file on Github.</a>

Our contract is initialized with the hard-coded address of the Kovan data feed for ETH / USD prices. Then in `getLatestPrice` it uses `latestRoundData` to obtain the most recent round of price data. We're interested in the price, so the function returns that.

# 7. How do I deploy to testnet?

There are a few things that are needed to deploy a contract to a testnet:

- [x] Smart contract code
- [ ] A Solidity compiler
- [ ] An address to deploy from
- [ ] Some ETH (in our case, testnet ETH, which is free)

We have the code. What we need next is a compiler.

## 7a. The Remix IDE

- [ ] A Solidity compiler

<a href="https://remix.ethereum.org/" target="_blank">Remix</a> is an online IDE which enables anyone to write, compile and deploy smart contracts from the browser.

Fortunately for us, Remix also has support for gist. This means that Remix can load code from Github, and in this case, `PriceConsumerV3.sol` Click the button below to open a new tab, then once Remix has loaded, find the `gists` folder in the File Explorer on the left-hand side, and click on the file to open the code in the editor.

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PriceConsumerV3.sol" target="_blank" class="cl-button--ghost">Deploy this contract using Remix ↗</a>
  <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

![Remix Select PriceConsumerV3.sol](/files/11d7052-Screenshot_2020-11-27_at_10.16.47.png)

Have a play around with the contract. This is what we'll use for the compiler.

- [x] A Solidity compiler

## 7b. Metamask wallet

- [ ] An address to deploy from

Contracts are deployed by addresses on the network, so to deploy our own we need an address. Not only that, but we need one which we can easily use with Remix. Fortunately, Metamask is just what is needed. Metamask allows anyone to create an address, store funds and interact with Ethereum compatible blockchains from a browser extension.

Head to the <a href="https://metamask.io/" target="_blank">Metamask website</a> to download, install and create an account.

Once that's done, hop over to the Kovan testnet inside Metamask extension, as seen in the image below.

![Metamask Select Kovan Screen](/files/de9b81c-kovan.gif)

We now have an address to deploy to the Kovan testnet from.

- [x] An address to deploy from

## 7c. Obtaining testnet ETH

- [ ] Some ETH

Making transactions on Ethereum blockchains are not free, they cost ETH. Deploying a contract is no exception to this rule. Fortunately, testnet ETH doesn't actually cost anything, since the purpose of testnets is to test smart contracts publically before they are deployed to the mainnet.

Connect your Metamask wallet and request ETH from one of the available faucets on [LINK Token Contracts page](../link-token-contracts/).

- [x] Some ETH

## 7d. Compiling

We have all the pieces needed to deploy our price consumer to Kovan. To start the process we need to compile it first. Head back to the Remix tab.

Under the logo in the top left-hand corner, there's a vertical menu, made up of images. Hovering over each button shows a tooltip explaining what item is. The first is "File explorer", which shows us all the files loaded into Remix. The second is "Solidity compiler". Clicking this item takes us to a side menu where we can compile our contract.

Remix should automatically detect the correct compiler version depending on the version specified in the contract, and you should see a button that looks like this:

![Remix Click Complile PriceConsumerV3.sol](/files/99af570-Screenshot_2020-11-27_at_10.45.44.png)

Click it, and you will see some details below it by scrolling down. There might be a few yellow warnings, but don't worry about that for now as long as they're not red.

## 7e. Deploying

Looking at the image menu on the far-left again, the next item down is "Deploy & run transactions". Click on that.

This screen might be a little more intimidating, but do not fret. This is where we hook up Metamask to Remix so that it knows which account to deploy from.

In the first dropdown, named "ENVIRONMENT", the value should currently be "Javascript VM". We need this to be "Injected Web3". Make this change. You'll get a Metamask notification asking for permission to connect. Accept it, and your address should be automatically loaded into the "ACCOUNT" dropdown below "ENVIRONMENT".

Once that's done, check that the "CONTRACT" dropdown shows the name of our contract, then click "Deploy". Another Metamask notification will pop up asking for permission, and detailing how much GAS it will cost in testnet ETH. Confirm the transaction and await confirmation! This may take a few seconds depending on the network, so be patient.

## 7f. Get the price

Once deployed, an item will appear in the "Deployed Contracts" section underneath the "Deploy" button. This is the deployed contract with all its address.

![Remix Deployed Contracts Section](/files/ca77c39-Screenshot_2020-11-27_at_10.56.56.png)

Click on the caret to see a list of all the functions available to call.

Click "getLatestPrice", and voilà! The latest price appears just underneath the button. We have successfully deployed a smart contract, which uses Chainlink data feeds, to the Kovan Ethereum testnet!
