---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Getting Started"
permalink: "docs/getting-started/"
excerpt: "Smart Contracts, Solidity, and Chainlink"
whatsnext: {"Deploy your first smart contract":"/docs/first-contract/", "Connect Contracts to Oracles":"/docs/connect-to-oracles/", "Generate Random Numbers for a Contract":"/docs/intermediates-tutorial/"}
metadata:
  title: "Getting Started"
  description: "Learn the basics about smart contracts, Solidity, and Chainlink."
---

To get started developing your applications with smart contracts and Chainlink's decentralized oracle network, learn how the main components in the Chainlink stack fit together. This guide provides an overview for the following concepts:

+ [What is a smart contract?](#what-is-a-smart-contract)
+ [How does a smart contract operate?](#how-does-a-smart-contract-operate)
+ [What is Solidity?](#what-is-solidity)
+ [How do Chainlink oracles work with smart contracts?](#how-do-chainlink-oracles-work-with-smart-contracts)

> 🏁 🏁 Deploy your first smart contract
> If you want to skip the overview, you can get your hands on the tools right away and [deploy your first smart contract](../first-contract/).

## What is a smart contract?

A smart contract is computer code that runs on the Ethereum blockchain. Just like most programming languages, smart contracts have several functions and variables that define the logic of your program. However, smart contracts are different from traditional applications in the following ways:

+ **Immutable code:** After you deploy a smart contract, the code of the smart contract cannot change. This allows you and other contract members to trust that the code always executes according to the logic that you defined in the contract. In contrast, traditional code can execute on any compatible system and can be modified or stopped by whoever controls that system.
+ **Decentralized:** Because smart contract code runs on a decentralized network, you don't have to rely on third-party services to execute your code for you. Access to the network is very difficult to restrict, so you and your smart contract code cannot be excluded from participating.
+ **Data integrity:** Data stored by a smart contract on the Ethereum blockchain is nearly impossible to destroy, corrupt, or hold for ransom. The data itself is part of the blockchain just like your contract code.
+ **Wallet functions:** Smart contracts can store and manage tokens or cryptocurrency just like an Ethereum wallet, but with the added benefit of programability.

Smart contracts on the Ethereum blockchain run in the Ethereum Virtual Machine (EVM). This is not a virtual machine like you would rent from a cloud computing service, but a distributed network of computers running the Ethereum client. This network provides the infrastructure to maintain the Ethereum blockchain and execute your smart contract code. To learn more about the EVM, read the [Ethereum Virtual Machine Overview](https://ethereum.org/en/developers/docs/evm/) from [ethereum.org](https://ethereum.org).

## How does a smart contract operate?

In general, smart contracts operate using the following process:

1. **Write:** Write a contract to define how the contract functions, what data it can store, what other contracts it interacts with, and what external APIs it might call.

1. **Compile:** Pass your smart contract code through a compiler to translate the contract into byte that the blockchain can understand. For example, [Solidity](https://soliditylang.org) code must be compiled before it can run in the [Ethereum Virtual Machine](https://ethereum.org/en/developers/docs/evm/).

1. **Deploy:** Send the compiled smart contract to the blockchain. From that point forward, the contract cannot be altered. However, you can still interact with the contract in several ways.

1. **Fund:** Send tokens or cryptocurrency to your contract address. Some contracts require cryptocurrency funds if they interact with other contracts or oracles. These funds pay for the work that the blockchain network does to facilitate those interactions. For example, contracts that use Chainlink oracle networks often need LINK tokens to pay for the work done by the oracle nodes.

1. **Run functions:** When you run the functions that you defined for the contract, the network processes those functions and modifies the state of your contract. For some functions, the network charges a small fee to complete the work. Your contract can also have functions that transfer funds to other contracts or wallets.

Deploying a smart contract to the blockchain is similar to deploying applications to a server, but there are a few extra steps required.

<!---
TODO: Create a more polished version of this diagram before publishing.
--->
![A diagram showing the process of compiling a smart contract into bytecode and deploying it to the block chain.](/files/smartContractDeployment.png)
This diagram shows the process for deploying a contract. At deploy time, some ETH is required to pay for the network to add your contract to the blockchain. The deployed contract has its own address and wallet balances.

After you deploy the contract, it is impossible to modify the code or any hard-coded variables. Most functions and variables that you defined are accessible by anybody on the network, but you can restrict functions so that they can be called only by specific addresses.

## What is Solidity?

There are several great languages available for writing smart contracts, but Chainlink's example code is primarily written in [Solidity](https://soliditylang.org). Solidity is the most widely adopted language for writing smart contracts on the Ethereum blockchain. If you have written JavaScript or similar languages, you will be familiar with some aspects of writing Solidity code. Solidity is a great smart contract language to start learning with because the community provides many code examples and tools to help you get started.

To learn more specifically about the Solidity language, see [docs.soliditylang.org](https://docs.soliditylang.org/en/latest/index.html).

 If you want to learn about other languages that are available for writing smart contracts, see the [Smart Contract Languages Overview](https://ethereum.org/en/developers/docs/smart-contracts/languages/) from [ethereum.org](https://ethereum.org).

## How do Chainlink oracles work with smart contracts?

Smart contracts are useful on their own, but they can't interact with real-world data because their functions are strictly limited to the blockchain. This is by design because the blockchain must remain independent of real-world events to function and remain trustworthy. To help your contracts function based on real-world data, you must connect your contract to an oracle. Chainlink oracle networks provide a trustworthy way to connect real-world data to the functions in your smart contracts.

Many oracle contracts already exist on the blockchain, so you can include them in your smart contracts right away without having to build the oracle network or oracle contracts yourself. For example, the Chainlink [ETH / USD Price Feed](https://feeds.chain.link/eth-usd) aggregates ETH price data from many independent Chainlink node operators. Because the price of a cryptocurrency is determined by traders in an off-chain exchange, that price cannot be accessed by smart contracts alone. The Chainlink price feed aggregates current pricing information from many sources to create a trustworthy consensus about the current value of ETH.

You can write and deploy a contract that interfaces with the price feed aggregator. The [contract code](https://etherscan.io/address/0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419#code) is completely visible to you on, so you can see exactly how it works and audit the code yourself.

Oracle networks have many different uses beyond Price Feeds. See the [Chainlink Solutions](https://chain.link/solutions/) page to see more examples of what you can do with oracle networks.

> ▶️ ▶️ Deploy your first smart contract
> If you are ready to begin working with smart contracts, get your hands on the tools right away and [deploy your first smart contract](../first-contract/).
