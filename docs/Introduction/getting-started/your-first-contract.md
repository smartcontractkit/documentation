---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Deploy Your First Contract"
permalink: "docs/your-first-contract/"
excerpt: "Smart Contracts and Chainlink"
whatsnext: {"Connect Contracts to Oracles":"/docs/connect-to-oracles/", "Obtain Random Numbers for a Contract":"/docs/get-a-random-number/", "Call Public APIs from a Contract":"/docs/using-any-api/"}
metadata:
  title: "Deploy Your First Contract"
  description: "Learn how to create and deploy smart contracts to the Ethereum blockchain."
---

This guide teaches you each step required to create, deploy, and use smart contracts written in the [Solidity](https://soliditylang.org) language. You can follow these examples without any knowledge about Ethereum or blockchains.

Writing a smart contract is very similar to writing application code, but the code runs on the Ethereum blockchain network rather than running on a server or VM. In general, you operate smart contracts using the following process:

1. **Write:** Write a contract to define how the contract functions, what data it can store, what other contracts it interacts with, and what external APIs it might call.

1. **Compile:** Pass your smart contract code through a compiler to translate the contract into byte that the blockchain can understand. For example, [Solidity](https://soliditylang.org) code must be compiled before it can run in the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

1. **Deploy:** Send the compiled smart contract to the blockchain. From that point forward, the contract cannot be altered. However, you can still interact with the contract in several ways.

1. **Fund:** Send tokens or cryptocurrency to your contract address. Some contracts require cryptocurrency funds if they interact with other contracts or oracles. These funds pay for the work that the blockchain network does to facilitate those interactions. For example, contracts that use Chainlink oracle networks often need LINK tokens to pay for the work done by the oracle nodes.

1. **Run functions:** When you run the functions that you defined for the contract, the network processes those functions and modifies the state of your contract. For some functions, the network charges a small fee to complete the work. Your contract can also have functions that transfer funds to other contracts or wallets.

To help you learn how smart contracts work, you can create, deploy, and run smart contracts on a test network. All of the tools that you need are free and require no signup or registration. You can complete all of the necessary steps using your web browser.

## Install and fund MetaMask

Deploying smart contracts requires a wallet and test ETH. Install MetaMask, configure it to use the Kovan test network, and fund your wallet with test ETH.

1. [Install and configure the MetaMask extension](https://metamask.io/download) in your browser.

1. After the extension is installed, open your browser extension list and click MetaMask to open the MetaMask menu.
    ![Screenshot showing the browser extension list with MetaMask installed.](/files/openMetaMask.png)

1. Follow the instructions in MetaMask to create a new MetaMask wallet.

1. Set MetaMask to use the Kovan Test Network.
    ![Screenshot showing the network selection menu in MetaMask. The Kovan Test Network is selected.](/files/selectKovan.png)

1. Go to the [Chainlink Faucet](https://linkfaucet.protofire.io/kovan) and send 0.1 test ETH to your MetaMask wallet address. You can copy your address by clicking the account name in MetaMask.

Now you should have some ETH in your MetaMask wallet on the Kovan testnet.

## Create and deploy your contract

Deploy and run a smart contract on the Kovan testnet using the following process:

1. [Open this example contract](https://remix.ethereum.org/#gist=762a9bc18c31109f61790c4e6c2da6e9) in the Remix IDE. This `helloWorld.sol` sample contract prepares Remix with code that you can deploy and run. We will walk through the code later.

1. On the left panel, expand the sample folder and click `HelloWorld.sol` to open the contents of the contract. You can modify the code in this editor when you write your own contract.
    ![Screenshot showing the HelloWorld.sol file highlighted.](/files/selectHelloWorld.png)

1. Because we already wrote the code for you, you can start the compile step. On the left side of Remix, click the **Solidity Compiler** tab to view the compiler settings.
    ![Screenshot showing the Compiler tab and its settings.](/files/selectSolidityCompiler.png)

1. For this contract, you can use the default compiler settings. Click the **Compile HelloWorld.sol** button to compile the contract. This converts the contract from Solidity into bytecode that the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/) can understand. Remix automatically detects the correct compiler version depending on the `pragma` specified in the contract.
    ![Screenshot of the Compile button.](/files/compileHelloWorld.png)

1. After Remix compiles the contract, you can deploy it to the Ethereum blockchain. On the left side of Remix, click the **Deploy and Run** tab to view the deployment settings.
    ![Screenshot of the Deploy tab and its settings.](/files/selectSolidityCompiler.png)

1. In the deployment settings, select **Injected Web3** environment. This activates MetaMask and asks you to connect the wallet to Remix, which allows Remix to receive ETH from your MetaMask wallet. Accept the connection.

1. Next to the **Deploy** button, enter a message that you want to send with the smart contract when you deploy it. This contract is written with a constructor that sets an initial message when you deploy the contract.
    ![Screenshot of the Deploy button with "Hello world!" as the defined message.](/files/deployHelloWorld.png)

1. Click the **Deploy** button to deploy the contract and its initial message to the blockchain network. MetaMask opens and asks you to confirm payment for deploying the contract. Ensure that MetaMask is set to the Kovan network before you accept the transaction.

If your contract deployed correctly, you will see your contract listed under the **Deployed Contracts** section in Remix. The contract has an address just like a wallet address. You can return to the address any time to execute functions or retrieve variables. To see details about your deployed contract, you can copy the contract address from the list in Remix and search for it in the [Etherscan Kovan Testnet Explorer](https://kovan.etherscan.io/).

## Run your contract functions

After you deploy a smart contract you cannot alter the code or change the initial variables. However, you can run the functions that you defined and retrieve the values of state variables in the contract.

1. Click the name of your deployed contract to view the details. This view shows all of the functions and variables that you can interact with.
    ![Screenshot showing the list of deployed contracts with the functions and variables of your deployed contract.](/files/deployedContracts.png)

1. Click `message` to view the current value of the message variable. This retrieves the message that you defined when you first deployed the contract.

1. Enter a new message value next to the `updateMessage` function.

1. Click `updateMessage` to run that function and send the new message to your contract. Because this function makes a change to the variable, it makes a change to the block chain and requires some ETH to pay for the work. MetaMask opens and asks you to confirm payment for this action.

1. After the update is complete, click `message` again to retrieve the new message. It might take a few seconds to update, but eventually the response shows the value that you entered for the `updateMessage` function.

Now you know how to run example contracts in Remix and execute functions in those contracts. You can write your own contracts and test them using this same process.

## Learn how the contract works

The smart contract that you deployed is simple, but it demonstrates the basic building blocks that you can use to create your own decentralized applications.

```solidity
pragma solidity >=0.7.0 <0.9.0;
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
The `helloWorld.sol` contract has the following components:

+ `pragma solidity >=0.7.0 <0.9.0;` defines the versions of the [Solidity compiler](https://docs.soliditylang.org/en/latest/installing-solidity.html) that this contract can use. For this example, any version of `0.7.x` or `0.8.x` is acceptable, but not version `0.9.0` or above.

+ `contract HelloWorld {}` defines the contract. Think of this as being similar to declaring a class in JavaScript. The contract implementation is inside this definition.

+ `string public message;` creates a state variable named `message`. To find out more about all the types of variables you can use within Solidity, see the [Solidity documentation](https://docs.soliditylang.org/en/latest/).

+ `constructor(string memory initialMessage) {}` sets the state of the contract when you first deploy it. In `HelloWorld`, the constructor takes in a `string` parameter and sets it as the `message` state variable.

+ `function updateMessage(string memory newMessage) public {}` is a function that modifies the contract state. The `updateMessage` function changes the current `message` variable to the value that you define when you call this function.

If you want to learn more about what components are available for smart contracts, read the Solidity [Structure of a Contract](https://docs.soliditylang.org/en/latest/structure-of-a-contract.html) guide. When you are ready, you can [learn how to connect your contract to an oracle](../connect-to-oracles/).
