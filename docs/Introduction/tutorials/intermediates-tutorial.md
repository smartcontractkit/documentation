---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: 'Random Numbers: Using Chainlink VRF'
permalink: 'docs/intermediates-tutorial/'
excerpt: 'Using Chainlink VRF'
whatsnext:
  {
    'Get a Random Number': '/docs/get-a-random-number/',
    'Example Contracts': '/docs/chainlink-vrf/example-contracts/',
    'Security Considerations': '/docs/vrf-security-considerations/',
    'Best Practices': '/docs/chainlink-vrf-best-practices/',
    'Contract Addresses': '/docs/vrf-contracts/',
  }
metadata:
  title: 'Random Numbers: Using Chainlink VRF'
  description: 'Learn how to use randomness in your smart contracts using Chainlink VRF.'
  image:
    0: '/files/2a242f1-link.png'
---

> 📘 Requirements
>
> This guide assumes that you have basic knowledge about writing and deploying smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) guide before you begin.

<p>
  https://www.youtube.com/watch?v=rdJ5d8j1RCg&ab
</p>

<p style="text-align:center">VRF v2 - Developer Walkthrough</p>

## Overview

In this guide, you will learn about generating randomness on blockchains. This includes learning how to implement a Request and Receive cycle with Chainlink oracles and how to consume random numbers with Chainlink VRF in smart contracts.

**Topics**

- [Overview](#overview)
- [1. How is randomness generated on blockchains? What is Chainlink VRF?](#1-how-is-randomness-generated-on-blockchains-what-is-chainlink-vrf)
- [2. What is the Request and Receive cycle?](#2-what-is-the-request-and-receive-cycle)
- [3. What is the payment process for generating a random number?](#3-what-is-the-payment-process-for-generating-a-random-number)
- [4. How can I use Chainlink VRF?](#4-how-can-i-use-chainlink-vrf)
- [5. How do I deploy to testnet?](#5-how-do-i-deploy-to-testnet)
- [6. How do I add my contract to my subscription account ?](#6-how-do-i-add-my-contract-to-my-subscription-account)
- [7. How do I test `rollDice`?](#7-how-do-i-test-rolldice)
- [8. Further Reading](#8-further-reading)

## 1. How is randomness generated on blockchains? What is Chainlink VRF?

Randomness is very difficult to generate on blockchains. This is because every node on the blockchain must come to the same conclusion and form a consensus. Even though random numbers are versatile and useful in a variety of blockchain applications, they cannot be generated natively in smart contracts. The solution to this issue is [**Chainlink VRF**](../chainlink-vrf/), also known as Chainlink Verifiable Random Function.

## 2. What is the Request and Receive cycle?

The [previous guide](/docs/consuming-data-feeds/) explained how to consume Chainlink Data Feeds, which consist of reference data posted on-chain by oracles. This data is stored in a contract and can be referenced by consumers until the oracle updates the data again.

Randomness, on the other hand, cannot be reference data. If the result of randomness is stored on-chain, any actor could retrieve the value and predict the outcome. Instead, randomness must be requested from an oracle, which generates a number and a cryptographic proof. Then, the oracle returns that result to the contract that requested it. This sequence is known as the **[Request and Receive cycle](../architecture-request-model/)**.

## 3. What is the payment process for generating a random number?

VRF requests receive funding from subscription accounts. The [Subscription Manager](https://vrf.chain.link) lets you create an account and pre-pay for VRF requests, so that funding of all your application requests are managed in a single location.
To learn more about VRF requests funding, see [Subscriptions](/docs/chainlink-vrf/#subscriptions), [Subscription billing](/docs/chainlink-vrf/#subscription-billing).

## 4. How can I use Chainlink VRF?

To see a basic implementation of Chainlink VRF, see [Get a Random Number](../get-a-random-number/). In this section, you will create an application that uses Chainlink VRF to generate randomness. The contract used in this application will have a [_Game of Thrones_](https://en.wikipedia.org/wiki/Game_of_Thrones) theme.

The contract will request randomness from Chainlink VRF. The result of the randomness will transform into a number between 1 and 20, mimicking the rolling of a 20 sided die. Each number represents a _Game of Thrones_ house. If the dice land on the value 1, the user is assigned house Targaryan, 2 for Lannister, and so on. A full list of houses can be found [here](https://gameofthrones.fandom.com/wiki/Great_House).

When rolling the dice, it will accept an `address` variable to track which address is assigned to each house.

The contract will have the following functions:

- `rollDice`: This submits a randomness request to Chainlink VRF
- `fulfillRandomWords`: The function that the Oracle uses to send the result back
- `house`: To see the assigned house of an address

**Note**: to jump straight to the entire implementation, you can [open the VRFD20.sol contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol) in remix.

### Create and fund a subscription

Chainlink VRF requests receive funding from subscription accounts. The [Subscription Manager](https://vrf.chain.link) lets you create an account and pre-pay your use of Chainlink VRF requests.
For this example, create a new subscription on the Rinkeby testnet as explained [here](/docs/get-a-random-number/#create-and-fund-a-subscription).

### Importing `VRFConsumerBaseV2` and `VRFCoordinatorV2Interface`

Chainlink maintains a [library of contracts](https://github.com/smartcontractkit/chainlink/tree/master/contracts) that make consuming data from oracles easier. For Chainlink VRF, you will use:

- [`VRFConsumerBaseV2`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/VRFConsumerBaseV2.sol) that must be imported and extended from the contract that you create.
- [`VRFCoordinatorV2Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol) that must be imported to communicate with the VRF coordinator.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {

}
```

### Contract variables

This example is adapted for [Rinkeby testnet](/docs/vrf-contracts/#rinkeby-testnet) but you can change the configuration and make it run for any [supported network](/docs/vrf-contracts/#configurations).

```solidity
uint64 s_subscriptionId;
address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
bytes32 s_keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
uint32 callbackGasLimit = 40000;
uint16 requestConfirmations = 3;
uint32 numWords =  1;
```

- `uint64 s_subscriptionId`: The subscription ID that this contract uses for funding requests. Initialized in the `constructor`.
- `address vrfCoordinator`: The address of the Chainlink VRF Coordinator contract.
- `bytes32 s_keyHash`: The gas lane key hash value, which is the maximum gas price you are willing to pay for a request in wei. It functions as an ID of the off-chain VRF job that runs in response to requests.
- `uint32 callbackGasLimit`: The limit for how much gas to use for the callback request to your contract's `fulfillRandomWords` function. It must be less than the `maxGasLimit` on the coordinator contract. Adjust this value for larger requests depending on how your `fulfillRandomWords` function processes and stores the received random values. If your `callbackGasLimit` is not sufficient, the callback will fail and your subscription is still charged for the work done to generate your requested random values.
- `uint16 requestConfirmations`: How many confirmations the Chainlink node should wait before responding. The longer the node waits, the more secure the random value is. It must be greater than the `minimumRequestBlockConfirmations` limit on the coordinator contract.
- `uint32 numWords`: How many random values to request. If you can use several random values in a single callback, you can reduce the amount of gas that you spend per random value. In this example, each transaction requests one random value.

To keep track of addresses that roll the dice, the contract uses mappings. [Mappings](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e) are unique key-value pair data structures similar to hash tables in Java.

```solidity
mapping(uint256 => address) private s_rollers;
mapping(address => uint256) private s_results;
```

- `s_rollers` stores a mapping between the `requestID` (returned when a request is made), and the address of the roller. This is so the contract can keep track of who to assign the result to when it comes back.
- `s_results` stores the roller and the result of the dice roll.

### Initializing the contract

The coordinator and subscription id must be initialized in the `constructor` of the contract. To use `VRFConsumerBaseV2` properly, you must also pass the VRF coordinator address into its constructor.
The address that creates the smart contract is the owner of the contract. the modifier `onlyOwner()` checks that only the owner is allowed to do some tasks.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    // variables
    // ...

    // constructor
    constructor(uint64 subscriptionId) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
    }

    //...
    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
```

### `rollDice` function

The `rollDice` function will complete the following tasks:

1. Check if the roller has already rolled since each roller can only ever be assigned to a single house.
1. Request randomness by calling the VRF coordinator.
1. Store the `requestId` and roller address.
1. Emit an event to signal that the dice is rolling.

You must add a `ROLL_IN_PROGRESS` constant to signify that the dice has been rolled but the result is not yet returned. Also add a `DiceRolled` event to the contract.

Only the owner of the contract can execute the `rollDice` function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    // variables
    uint256 private constant ROLL_IN_PROGRESS = 42;
    // ...

    // events
    event DiceRolled(uint256 indexed requestId, address indexed roller);
    // ...

    // ...
    // { constructor }
    // ...

    // rollDice function
    function rollDice(address roller) public onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, "Already rolled");
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
        s_keyHash,
        s_subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        numWords
       );

        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }
}
```

### `fulfillRandomWords` function

`fulfillRandomWords` is a special function defined within the `VRFConsumerBaseV2` contract that our contract extends from. The coordinator sends the result of our generated `randomWords` back to `fulfillRandomWords`. You will implement some functionality here to deal with the result:

1. Change the result to a number between 1 and 20 inclusively. Note that `randomWords` is an array that could contain several random values. In this example, request 1 random value.
1. Assign the transformed value to the address in the `s_results` mapping variable.
1. Emit a `DiceLanded` event.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    // ...
    // { variables }
    // ...

    // events
    // ...
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);

    // ...
    // { constructor }
    // ...

    // ...
    // { rollDice function }
    // ...

    // fulfillRandomWords function
    function fulfillRandomWords(uint256 requestId , uint256[] memory randomWords) internal override {

        // transform the result to a number between 1 and 20 inclusively
        uint256 d20Value = (randomWords[0] % 20) + 1;

        // assign the transformed value to the address in the s_results mapping variable
        s_results[s_rollers[requestId]] = d20Value;

        // emitting event to signal that dice landed
        emit DiceLanded(requestId, d20Value);
    }
}
```

### `house` function

Finally, the `house` function returns the house of an address.

To have a list of the house's names, create the `getHouseName` function that is called in the `house` function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract VRFD20 is VRFConsumerBaseV2 {
    // ...
    // { variables }
    // ...

    // ...
    // { events }
    // ...

    // ...
    // { constructor }
    // ...

    // ...
    // { rollDice function }
    // ...

    // ...
    // { fulfillRandomWords function }
    // ...

    // house function
    function house(address player) public view returns (string memory) {
        // dice has not yet been rolled to this address
        require(s_results[player] != 0, "Dice not rolled");

        // not waiting for the result of a thrown dice
        require(s_results[player] != ROLL_IN_PROGRESS, "Roll in progress");

        // returns the house name from the name list function
        return getHouseName(s_results[player]);
    }

    // getHouseName function
    function getHouseName(uint256 id) private pure returns (string memory) {
        // array storing the list of house's names
        string[20] memory houseNames = [
            "Targaryen",
            "Lannister",
            "Stark",
            "Tyrell",
            "Baratheon",
            "Martell",
            "Tully",
            "Bolton",
            "Greyjoy",
            "Arryn",
            "Frey",
            "Mormont",
            "Tarley",
            "Dayne",
            "Umber",
            "Valeryon",
            "Manderly",
            "Clegane",
            "Glover",
            "Karstark"
        ];

        // returns the house name given an index
        return houseNames[id.sub(1)];
    }
}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol" target="_blank" >Open in Remix</a>
  <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

You have now completed all necessary functions to generate randomness and assign the user a _Game of Thrones_ house. We've added a few helper functions in there to make using the contract easier and more flexible. You can deploy and interact with the complete contract in Remix.

## 5. How do I deploy to testnet?

You will now deploy your completed contract. This deployment is slightly different than the example in the [Deploy Your First Contract](/docs/deploy-your-first-contract/) guide. In our case, you will have to pass in parameters to the constructor upon deployment.

Once compiled, you'll see a dropdown menu that looks like this in the deploy pane:

![Remix contract selected](/files/intermediates-tutorial-01.png)

Select the `VRFD20` contract or the name that you gave to your contract. You will deploy this contract on the Rinkeby test network.

Click the caret arrow on the right hand side of **Deploy** to expand the parameter fields, and paste your subscription id.

![Remix contract parameters to deploy](/files/intermediates-tutorial-02.png)

Then click the `Deploy` button and use your Metamask account to confirm the transaction.

**Note**: You should [have some Rinkeby ETH](/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet) in your Metamask account to pay for the GAS.

> 📘 Address, Key Hashes and more
>
> For a full reference of the addresses, key hashes and fees for each network, see [VRF Contract Addresses](/docs/vrf-contracts/#configurations).

At this point, your contract should be successfully deployed. However, it can't request anything because it is not yet approved to use the LINK balance in your subscription. If you click `rollDice`, the transaction will revert.

## 6. How do I add my contract to my subscription account?

After you deploy your contract, you must add it as an approved consumer contract so it can use the subscription balance when requesting for randomness. Go to the [Subscription Manager](https://vrf.chain.link) and add your deployed contract address to the list of consumers. Find your contract address in Remix under **Deployed Contracts** on the bottom left.

![Remix contract address](/files/intermediates-tutorial-03.png)

## 7. How do I test `rollDice`?

After you open the deployed contract tab in the bottom left, the function buttons are available. Find `rollDice` and click the caret to expand the parameter fields. Enter an Ethereum address to specify a "dice roller", and click 'rollDice'.

You will have to wait a few minutes for your transaction to confirm and the response to be sent back. You can get your house by clicking the `house` function button with the address passed in `rollDice`. After the response is sent back, you'll be assigned a _Game of Thrones_ house!

## 8. Further Reading

To read more about generating random numbers in Solidity, read our blog posts:

- [35+ Blockchain RNG Use Cases Enabled by Chainlink VRF](https://blog.chain.link/blockchain-rng-use-cases-enabled-by-chainlink-vrf/)
- [How to Build Dynamic NFTs on Polygon](https://blog.chain.link/how-to-build-dynamic-nfts-on-polygon/)
- [Chainlink VRF v2 Now Live on Ethereum Mainnet](https://blog.chain.link/vrf-v2-mainnet-launch/)
