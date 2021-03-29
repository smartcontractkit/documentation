---
layout: nodes.liquid
title: "Intermediates - Random Numbers"
slug: "intermediates-tutorial"
excerpt: "Using Chainlink VRF"
hidden: true
metadata: 
  title: "Intermediates Tutorial"
  description: "Learn how to use randomness in your smart contracts using Chainlink VRF."
date: Last Modified
---
# Introduction

> 👍 Assumed knowledge
>
> This tutorial assumes some basic knowledge around Ethereum, and writing smart contracts. If you're brand new to smart contract development, we recommend working through our [Beginners Tutorial](doc:beginners-tutorial) before this one.

Randomness is very difficult to generate on blockchains. The reason for this is because every node must come to the same conclusion, AKA a consensus. There's no way to generate random numbers natively in smart contracts, which is unfortunate because they can be very useful for a wide range of applications. Fortunately, Chainlink provides [Chainlink VRF](doc:chainlink-vrf), AKA Chainlink Verifiable Random Function.

If you've walked through the [Beginners Tutorial](doc:beginners-tutorial), you'll know how to write smart contracts, use Chainlink Price Feeds, and how to deploy a contract to a testnet.

In this tutorial, we go through:
- The Chainlink request & receive cycle
- Using the LINK token
- How to use request & receive with Chainlink Oracles
- Consuming random numbers in smart contracts

# 1. Request & Receive

- Describe Price Feeds, how they're reference data
- Randomness can't be reference data, because then it wouldn't be random
- Needs to be requested from an oracle
- The oracle then sends the result back to a specific function in the contract that requested it

# 2. Using LINK

- In return for providing this service of generating randomness, Oracles need to be paid
- Payment is in gas
- Paid by the contract requesting randomness. eg, the contract we're going to write and deploy.

# 3. Interacting with Chainlink Oracles

- As mentioned in the previous tutorial, smart contracts have all the same capabilities as a wallet address, meaning they can hold tokens
- the contract that requests randomness from Chainlink VRF must have a LINK balance equivalent to, or greater than the cost of making a request
- For example, if the current price is 0.1 LINK, our contract must hold at least that much to pay for the request.
- Once that transaction has completed, the oracle begins the process of generating the random number and sending the result back.

# 4. Using Chainlink VRF

A basic implementation of Chainlink VRF can be found on the [Get a Random Number](doc:get-a-random-number) page, in the Using Randomness section.

In this example, we'll create a contract that uses randomness to generate a number between 1 and 20, mimicking the rolling of a 20 sided dice. The contract will have the following functions:
- `rollDice`: This submits a randomness request to Chainlink VRF
- `fulfillRandomness`: The function that is used by the Oracle to send the result back to
- `getResult`: To see the number the dice landed on
- `pickupDice`: Reset the contract to roll again

Can open the entire contract in Remix by clicking the button below.

LINKHERE

## 4a. Importing `VRFConsumerBase`

- Chainlink provides some useful base classes to make consuming randomness in smart contracts easy.
- import and extend VRFConsumerBase LINKHERE
CODEHERE

## 4b. Contract variables

- The contract is going to store the requestId, and result of the dice roll. 
- It also needs to store the keyHash for the job, this tells the Oracle what the contract is requesting. This hash can be found in our docs LINKHERE.
- And it needs to store the fee that the oracle changes for the job we want.
- It's also going to emit events when a dice is rolled, landed, and picked up. 

CODEHERE

## 4c. Initializing the contract

Initialize the contract by also initializing `VRFConsumerBase`

CODEHERE

## 4d. `rollDice` function

## 4e. `fulfillRandomness` function

## 4f. `getResult` function

## 4g `pickupDice` function

# 5. Deployment

-  Follow steps from the previous tutorial
- But we can't request anything just yet! Our contract doesn't have any LINK, so the request will be reverted.

# 6. Obtaining testnet LINK

- Go to faucet LINKHERE
- Send to contract IMAGE?
- Request now

## 6b. Bonus? Follow transaction progress and LINK explorer? Maybe

# 7. Getting the result back!