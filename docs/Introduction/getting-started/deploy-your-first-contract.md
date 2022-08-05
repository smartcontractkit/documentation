---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Deploy Your First Smart Contract"
permalink: "docs/deploy-your-first-contract/"
whatsnext: {"Consuming Data Feeds":"/docs/consuming-data-feeds/"}
metadata:
  title: "Deploy Your First Smart Contract"
  description: "Deploy and run your first smart contract in an interactive web development environment."
  image:
    0: "/files/1a63254-link.png"
---

You can write your first smart contract and run it in your browser without any knowledge about Ethereum or blockchains. This guide shows you how easy it is to develop smart contracts using the [Solidity language](https://soliditylang.org/), a [MetaMask wallet](https://metamask.io) and the [Remix Development Environment](https://remix.ethereum.org/). You can use all of these tools in your browser for free with no signup required.

> 📘 Already know Solidity and have MetaMask configured?
>
> If you are already familiar with how to deploy Smart Contracts and use MetaMask, you can skip to the [Consuming Data Feeds](/docs/consuming-data-feeds/) guide to learn how to connect your smart contracts to Chainlink data feeds.

**Topics**
+ [Overview](#overview)
+ [Install and fund MetaMask](#install-and-fund-your-metamask-wallet)
+ [Write, compile, and deploy your first smart contract](#write-compile-and-deploy-your-first-smart-contract)
+ [Run functions in your contract](#run-functions-in-your-contract)

## Overview

In general, you create and deploy your smart contracts operate using the following process:

1. **Write:** Write a contract to define how the contract functions, what data it can store, what other contracts it interacts with, and what external APIs it might call.

1. **Compile:** Pass your smart contract code through a compiler to translate the contract into byte code that the blockchain can understand. For example, [Solidity](https://soliditylang.org) code must be compiled before it can run in the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

1. **Deploy:** Send the compiled smart contract to the blockchain. From that point forward, the contract cannot be altered. However, you can still interact with the contract in several ways.

1. **Run functions:** When you run the functions that you defined for the contract, the network processes those functions and modifies the state of your contract. For some functions, the network charges a small fee to complete the work. Your contract can also have functions that transfer funds to other contracts or wallets.

This guide walks you through each step, but you must install and fund your MetaMask wallet first.

## Install and fund your MetaMask wallet

Deploying smart contracts on-chain requires a wallet and ETH. The ETH pays for the work required by the Ethereum network to add the contract to the blockchain and store the variables. The wallet holds the ETH that you need to pay for the transaction. Install MetaMask, configure it to use the [Rinkeby test network](https://www.rinkeby.io), and fund your wallet with free testnet ETH.

1. [Install and configure the MetaMask extension](https://metamask.io/download) in your browser.

1. After you install the extension, open your browser extension list and click MetaMask to open MetaMask.
    ![Screenshot showing the browser extension list with MetaMask installed.](/images/getting-started/openMetaMask.png)

1. Follow the instructions in MetaMask to create a new MetaMask wallet. The new wallet includes a 12-word mnemonic phrase. This phrase is the key to your wallet. Copy that phrase down in a very secure location that only you can access. You can use this phrase to retrieve your wallet later or add it to another browser.

1. Set MetaMask to use the Rinkeby test network.
    ![Screenshot showing the network selection menu in MetaMask. The Rinkeby Test Network is selected.](/images/getting-started/selectRinkeby.png)

1. Go to the [Rinkeby Chainlink Faucet](https://faucets.chain.link/Rinkeby/) and follow the steps to send 0.1 test ETH to your MetaMask wallet address. You can copy your wallet address by clicking your account name in MetaMask. After the faucet completes the transaction, you should have 0.1 ETH in your MetaMask wallet on the Rinkeby testnet.
    ![Screenshot showing a wallet with a balance of 0.1 ETH.](/images/getting-started/fundedWallet.png)

Now that you configured your wallet and funded it with testnet ETH, you can write, compile, and deploy your contract.

## Write, compile, and deploy your first smart contract

Your first contract is a simple `HelloWorld.sol` example. This example shows you how to set and retrieve variables in a smart contract on-chain.

```solidity
{% include 'samples/Tutorials/HelloWorld.sol' %}
```

1. [Open the example contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/HelloWorld.sol) in the Remix IDE. Remix opens and shows the contents of the smart contract. You can modify the code in this editor when you write your own contract.

    <div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/Tutorials/HelloWorld.sol" target="_blank">Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
    </div>

1. Because the code is already written, you can start the compile step. On the left side of Remix, click the **Solidity Compiler** tab to view the compiler settings.
    ![Screenshot showing the Compiler tab and its settings.](/images/getting-started/selectSolidityCompiler.png)

1. For this contract, use the default compiler settings. Click the **Compile HelloWorld.sol** button to compile the contract. This converts the contract from Solidity into bytecode that the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/) can understand. Remix automatically detects the correct compiler version depending on the `pragma` that you specify in the contract.
    ![Screenshot of the Compile button.](/images/getting-started/compileHelloWorld.png)

1. After Remix compiles the contract, deploy it. On the left side of Remix, click the **Deploy and Run** tab to view the deployment settings.
    ![Screenshot of the Deploy tab and its settings.](/images/getting-started/selectSolidityDeploy.png)

1. In the deployment settings, select the **Injected Provider** environment. This tells Remix that you want to deploy your contract to the blockchain that you configured in MetaMask. You could optionally use one of the Javascript VM options, but they run in a virtual environment with no connection to an actual blockchain or Chainlink oracles.
    ![Screenshot showing the Injected Provider environment selected.](/images/getting-started/selectWeb3.png)

1. Next to the **Deploy** button, enter a message that you want to send with the smart contract when you deploy it. This contract has a constructor that sets an initial message when you deploy the contract.
    ![Screenshot of the Deploy button with "Hello world!" as the defined message.](/images/getting-started/deployHelloWorld.png)

1. Click the **Deploy** button to deploy the contract and its initial message to the blockchain network. MetaMask opens and asks you to confirm payment to deploy the contract. Make sure MetaMask is set to the Rinkeby network before you accept the transaction. Because these transactions are on the blockchain, they are not reversible.

1. In the MetaMask prompt, click **Confirm** to approve the transaction and spend your testnet ETH required to deploy the contract.
    ![Screenshot showing Metamask asking you to confirm the transaction.](/images/getting-started/confirmTransaction.png)

1. After a few seconds, the transaction completes and your contract appears under the **Deployed Contracts** list in Remix. Click the contract dropdown to view its variables and functions.
    ![Screenshot showing the deployed Hello World contract.](/images/getting-started/deployedContract.png)

1. Click the `message` variable. Remix retrieves and prints the initial message that you set.
    ![Screenshot showing the message function and the returned "Hello World" message.](/images/getting-started/runHelloWorld.png)

The contract has an address just like your wallet address. If you save this address, you can return to your deployed contract at any time to retrieve variables or execute functions. To see details about your deployed contract, copy the contract address from the list in Remix and search for it in the [Etherscan Rinkeby Testnet Explorer](https://rinkeby.etherscan.io/).

## Run functions in your contract

Because you deployed the contract to an actual blockchain, several nodes on the test network confirmed your payment for the smart contract. The contract, its variables, and its functions remain in the blockchain permanently. To change the `message` variable that is stored with your contract, run the `updateMessage` function.

1. In your deployed contract, enter a new message next to the `updateMessage` function.
    ![Screenshot showing the updateMessage function with a new value.](/images/getting-started/runUpdateMessage.png)

1. Click the `updateMessage` button to set the new message in the contract data. MetaMask opens and asks you to confirm payment to update the state of your contract.

1. In the new MetaMask prompt, click **Confirm** to approve the transaction.
    ![Screenshot showing Metamask asking you to confirm the transaction.](/images/getting-started/confirmTransaction.png)

1. Click the `message` variable again to see the updated value. It might take a few seconds before the transaction updates the variable.
    ![Screenshot showing the updated value for the `message` value.](/images/getting-started/runHelloWorldAgain.png)

Now you know how to deploy example contracts to a test network and run the functions in those contracts. You can write your own contracts and test them using this same process.

Next, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) guide to learn how to connect your smart contracts to Chainlink Data Feeds and retrieve on-chain data that your smart contracts can act on.
