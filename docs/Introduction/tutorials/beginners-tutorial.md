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

# 3. What does a smart contract look like?

The structure of a smart contract is similar to that of a _class_ in Javascript, with a few differences. Let's take a look at this `HelloWorld` example.

```solidity
pragma solidity 0.6.7;

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

The first thing that every solidity file must have is the Solidity version definition. The version HelloWorld.sol is using is 0.6.6, defined by `pragma solidity 0.6.6;`

You can see the latest versions of the Solidity compiler <a href="https://github.com/ethereum/solc-bin/blob/gh-pages/bin/list.txt" target="_blank">here</a>.

## 3b. Start your contract `contract ... {`

Next, the `HelloWorld` contract is defined by using the keyword `contract`. Think of this as being similar to declaring a `class` in Javascript. The implementation of `HelloWorld` is inside this definition, denoted with curly braces.

## 3c. State variables `string public ...`

Again, like Javascript, contracts can have state variables and local variables. To find out more about all the types of variables you can use within Solidity, check out the <a href="https://docs.soliditylang.org/en/v0.6.7/" target="_blank">Solidity documentation</a>.

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

The most popular use for oracles is that of [Price Feeds](../using-chainlink-reference-contracts/) . DeFi platforms like <a href="https://aave.com/" target="_blank">AAVE</a> and <a href="https://www.synthetix.io/" target="_blank">Synthetix</a> use Chainlink price feed oracles to obtain accurate real-time asset prices in their smart contracts.

Chainlink price feeds are sources of data [aggregated from many independent Chainlink node operators](../architecture-decentralized-model/). Each price feed has an on-chain address and functions that enable contracts to read from that address. For example, the <a href="https://feeds.chain.link/eth-usd" target="_blank">ETH / USD feed</a>.

![Chainlink Feeds List](/images/contract-devs/price-aggr.png)

## 6a. Using Chainlink price feeds

The following code is from the [Get the Latest Price](../get-the-latest-price/) page. It describes a contract which obtains the latest ETH / USD price using the Kovan testnet.

```javascript

pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";


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


Fortunately for us, Remix also has support for gist. This means that Remix can load code from Github, and in this case, `PriceConsumerV3.sol` Click the button below to open a new tab, then once Remix has loaded, find the `gists` folder in the File Explorer on the left-hand side, and click on the file to open the code in the editor.

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#version=soljson-v0.6.7+commit.b8d736ae.js&optimize=false&evmVersion=null&gist=a90779ce7087be3379a2b5cee0ea2858" target="_blank" class="cl-button--ghost">Deploy this contract using Remix ↗</a>
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


1. On the **Deploy** tab, select the **Injected Web3** environment. This contract specifically requires Web3 because it connects with another contract on the blockchain. Running in a JavaScript VM will not work.

1. Click **Deploy** to deploy the contract to the Kovan testnet. MetaMask opens and asks you to confirm payment for deploying the contract. Ensure that MetaMask is set to the Kovan network before you accept the transaction. After the contract deploys, your contract appears under the **Deployed Contracts** section in Remix.
    ![A screenshot showing the deployed contract.](/files/ca77c39-Screenshot_2020-11-27_at_10.56.56.png)

1. Click the name of your deployed contract to view the available functions.

1. Click **getLatestPrice** to show the latest price from the aggregator contract. The latest price appears just below the button. The returned price is an integer, so it is missing its decimal point.
    ![A screenshot showing the deployed contract.](/files/getLatestPrice.png)


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


You can run your own oracle networks that provide data to smart contracts similar to the `AggregatorV3Interface`, but first you should learn how configure your contracts to pay oracles using LINK tokens. Follow the [Generate Random Numbers](../intermediates-tutorial/) to learn how.
