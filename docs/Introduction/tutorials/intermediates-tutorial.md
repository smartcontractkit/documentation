---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Random Numbers: Using Chainlink VRF"
permalink: "docs/intermediates-tutorial/"
excerpt: "Using Chainlink VRF"
whatsnext: {"Get a Random Number":"/docs/get-a-random-number/", "Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  title: "Random Numbers: Using Chainlink VRF"
  description: "Learn how to use randomness in your smart contracts using Chainlink VRF."
  image:
    0: "/files/2a242f1-link.png"
---

> 👍 Requirements
>
> This guide assumes that you have basic knowledge about writing and deploying smart contracts. If you are new to smart contract development, read the [Consuming Data Feeds](/docs/consuming-data-feeds/) guide before you begin.

> 🚧 This guide uses VRF v1
>
> This guide uses VRF v1 for demonstration purposes. The steps to implement VRF v2 are different. If you need to use VRF v2, see the current [Chainlink VRF](/docs/chainlink-vrf/) guide. The [VRF v1](/docs/chainlink-vrf/v1/) guide is also still available.

<p>
  https://www.youtube.com/watch?v=JqZWariqh5s
</p>

> 🚧 Note
>
> The video uses a seed phrase to request randomness. This feature is deprecated. Refer to the code in this tutorial for the most up to date procedures.

# Overview

In this guide, you will learn about generating randomness on blockchains. This includes learning how to implement a Request and Receive cycle with Chainlink oracles and how to consume random numbers with Chainlink VRF in smart contracts.

**Table of Contents**

+ [Overview](#overview)
+ [1. How is randomness generated on blockchains? What is Chainlink VRF?](#1-how-is-randomness-generated-on-blockchains-what-is-chainlink-vrf)
+ [2. What is the Request and Receive cycle?](#2-what-is-the-request-and-receive-cycle)
+ [3. What is the payment process for generating a random number?](#3-what-is-the-payment-process-for-generating-a-random-number)
+ [4. How can I use Chainlink VRF?](#4-how-can-i-use-chainlink-vrf)
+ [5. How do I deploy to testnet?](#5-how-do-i-deploy-to-testnet)
+ [6. How do I obtain testnet LINK?](#6-how-do-i-obtain-testnet-link)
+ [7. How do I test `rollDice`?](#7-how-do-i-test-rolldice)
+ [8. Further Reading](#8-further-reading)

# 1. How is randomness generated on blockchains? What is Chainlink VRF?

Randomness is very difficult to generate on blockchains. This is because every node on the blockchain must come to the same conclusion and form a consensus. Even though random numbers are versatile and useful in a variety of blockchain applications, they cannot be generated natively in smart contracts. The solution to this issue is [**Chainlink VRF**](../chainlink-vrf/), also known as Chainlink Verifiable Random Function.

# 2. What is the Request and Receive cycle?

The [previous guide](/docs/consuming-data-feeds/) explained how to consume Chainlink Data Feeds, which consist of reference data posted on-chain by oracles. This data is stored in a contract and can be referenced by consumers until the oracle updates the data again.

Randomness, on the other hand, cannot be reference data. If the result of randomness is stored on-chain, any actor could retrieve the value and predict the outcome. Instead, randomness must be requested from an oracle, which generates a number and a cryptographic proof. Then, the oracle returns that result to the contract that requested it. This sequence is known as the **[Request and Receive cycle](../architecture-request-model/)**.

# 3. What is the payment process for generating a random number?

In return for providing the service of generating a random number, oracles are paid in [**LINK**](../link-token-contracts/). The contract that requests the randomness must pay for the service during the request.

LINK conforms to the [ERC-677](https://github.com/ethereum/EIPs/issues/677) token standard, which is an extension of ERC-20. This standard is what enables data to be encoded in token transfers. This is integral to the Request and Receive cycle.

Smart contracts have all the capabilities that wallets have in that they are able to own and interact with tokens. The contract that requests randomness from Chainlink VRF must have a LINK balance greater than or equal to the cost to make the request in order to pay and fulfill the service.

For example, if the current price of Chainlink VRF is 0.1 LINK, the requesting contract must hold at least 0.1 LINK to pay for the request. Once the request transaction is complete, the oracle generates the random number and sends the result back.

# 4. How can I use Chainlink VRF?

To see a basic implementation of Chainlink VRF, see [Get a Random Number](../get-a-random-number/). In this section, you will create an application that uses Chainlink VRF to generate randomness. The contract used in this application will have a [*Game of Thrones*](https://en.wikipedia.org/wiki/Game_of_Thrones) theme.

The contract will request randomness from Chainlink VRF. The result of the randomness will transform into a number between 1 and 20, mimicking the rolling of a 20 sided die. Each number represents a *Game of Thrones* house. If the dice land on the value 1, the user is assigned house Targaryan, 2 for Lannister, and so on. A full list of houses can be found [here](https://gameofthrones.fandom.com/wiki/Great_House).

When rolling the die, it will accept an `address` variable to track which address is assigned to each house.

The contract will have the following functions:
- `rollDice`: This submits a randomness request to Chainlink VRF
- `fulfillRandomness`: The function that the Oracle uses to send the result back
- `house`: To see the assigned house of an address

**Note**: to jump straight to the entire implementation, you can [open the VRFD20.sol contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol) in remix.

## Importing `VRFConsumerBase`

Chainlink maintains a [library of contracts](https://github.com/smartcontractkit/chainlink/tree/master/contracts) that make consuming data from oracles easier. For Chainlink VRF, you will use a contract named [`VRFConsumerBase`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/VRFConsumerBase.sol) that must be imported and extended from the contract that you create.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase {

}
```

## Contract variables

The contract will contain multiple objects. Each oracle job has a unique key hash that identifies the tasks that it should perform. The contract will store the Key Hash that identifies Chainlink VRF and the fee amount to use in the request.

```solidity
bytes32 private s_keyHash;
uint256 private s_fee;
```



To keep track of addresses that roll the dice, the contract uses mappings. [Mappings](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e) are unique key-value pair data structures similar to hash tables in Java.

```solidity
mapping(bytes32 => address) private s_rollers;
mapping(address => uint256) private s_results;
```

- `s_rollers` stores a mapping between the `requestID` (returned when a request is made), and the address of the roller. This is so the contract can keep track of who to assign the result to when it comes back.
- `s_results` stores the roller and the result of the dice roll.

## Initializing the contract

The fee and the key hash must be initialized in the constructor of the contract. To use `VRFConsumerBase` properly, you must also pass certain values into its constructor. Below are the values for Kovan testnet network. They will be updated in the `constructor`.

- Key Hash:   0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
- Fee:        0.1 LINK (100000000000000000)

The address that creates the smart contract is the owner of the contract. Only the owner is allowed to do some tasks. Import a contract named [`ConfirmedOwner`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/ConfirmedOwner.sol) and use it to extend the contract that you create.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // variables
    bytes32 private s_keyHash;
    uint256 private s_fee;
    mapping(bytes32 => address) private s_rollers;
    mapping(address => uint256) private s_results;

    // constructor
    constructor(address vrfCoordinator, address link, bytes32 keyHash, uint256 fee)
        VRFConsumerBase(vrfCoordinator, link)
    {
        s_keyHash = keyHash;
        s_fee = fee;
    }
}
```

As you can see, the `VRFConsumerBase` constructor requires both the VRF Coordinator address and the LINK token address. For the Kovan test network, use the following values:

- VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
- LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088

You can find the addresses for other networks in the [VRF v1 docs](../vrf-contracts/v1/) page.

## `rollDice` function

The `rollDice` function will complete the following tasks:

1. It needs to check if the contract has enough LINK to pay the oracle.
2. Check if the roller has already rolled since each roller can only ever be assigned to a single house.
3. Request randomness
4. Store the `requestId` and roller address.
5. Emit an event to signal that the die is rolling.

You must add a `ROLL_IN_PROGRESS` constant to signify that the die has been rolled but the result is not yet returned. Also add a `DiceRolled` event to the contract.

Only the owner of the contract can execute the `rollDice` function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // variables
    uint256 private constant ROLL_IN_PROGRESS = 42;
    // ...
    // { variables that are already written }
    // ...

    // events
    event DiceRolled(bytes32 indexed requestId, address indexed roller);

    // ...
    // { constructor }
    // ...

    // rollDice function
    function rollDice(address roller) public onlyOwner returns (bytes32 requestId) {
        // checking LINK balance
        require(LINK.balanceOf(address(this)) >= s_fee, "Not enough LINK to pay fee");

        // checking if roller has already rolled die
        require(s_results[roller] == 0, "Already rolled");

        // requesting randomness
        requestId = requestRandomness(s_keyHash, s_fee);

        // storing requestId and roller address
        s_rollers[requestId] = roller;

        // emitting event to signal rolling of die
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }
}
```

## `fulfillRandomness` function

`fulfillRandomness` is a special function defined within the `VRFConsumerBase` contract that our contract extends from. The coordinator sends the result of our generated randomness back to `fulfillRandomness`. You will implement some functionality here to deal with the result:

1. Transform the result to a number between 1 and 20 inclusively.
2. Assign the transformed value to the address in the `s_results` mapping variable.
3. Emit a `DiceLanded` event.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // ...
    // { variables }
    // ...

    // events
    // ...
    // { events that are already written }
    // ...
    event DiceLanded(bytes32 indexed requestId, uint256 indexed result);

    // ...
    // { constructor }
    // ...

    // ...
    // { rollDice function }
    // ...

    // fulfillRandomness function
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {

        // transform the result to a number between 1 and 20 inclusively
        uint256 d20Value = (randomness % 20) + 1;

        // assign the transformed value to the address in the s_results mapping variable
        s_results[s_rollers[requestId]] = d20Value;

        // emitting event to signal that dice landed
        emit DiceLanded(requestId, d20Value);
    }
}
```

## `house` function

Finally, the `house` function returns the house of an address.

To have a list of the house's names, create the `getHouseName` function that is called in the `house` function.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
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
    // { fulfillRandomness function }
    // ...

    // house function
    function house(address player) public view returns (string memory) {
        // dice has not yet been rolled to this address
        require(s_results[player] != 0, "Dice not rolled");

        // not waiting for the result of a thrown die
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

You have now completed all necessary functions to generate randomness and assign the user a *Game of Thrones* house. We've added a few helper functions in there to make using the contract easier and more flexible. You can deploy and interact with the complete contract in Remix.

# 5. How do I deploy to testnet?

You will now deploy your completed contract. This deployment is slightly different than the example in the [Deploy Your First Contract](/docs/deploy-your-first-contract/) guide. In our case, you will have to pass in parameters to the constructor upon deployment.

Once compiled, you'll see a dropdown menu that looks like this in the deploy pane:

![Remix contract selected](/files/intermediates-tutorial-01.png)

Select the `VRFD20` contract or the name that you gave to your contract. You will deploy this contract on the Kovan test network.

Click the caret arrow on the right hand side of **Deploy** to expand the parameter fields, and paste the following values in:

- vrfCoordinator:   `0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9`
- LINK address:     `0xa36085f69e2889c224210f603d836748e7dc0088`
- keyHash:          `0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4`
- fee:              `100000000000000000`

![Remix contract parameters to deploy](/files/intermediates-tutorial-03.png)

Then click the `transact` button.

These are the coordinator address, LINK address, key hash, and fee. For a full reference of the addresses, key hashes, and fees for each network, see [VRF v1 Contracts](../vrf-contracts/v1/). Click deploy and use your Metamask account to confirm the transaction.

**Note**: You should [have some Kovan ETH](/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet) in your Metamask account to pay for the GAS.

> 📘 Address, Key Hashes and more
>
> For a full reference of the addresses, key hashes and fees for each network, see [VRF Contracts](../vrf-contracts/v1/).

At this point, your contract should be successfully deployed. However, it can't request anything yet since it doesn't own LINK. If you click `rollDice` with no LINK, the transaction will revert.

# 6. How do I obtain testnet LINK?

Because the contract is on testnet, as with Kovan ETH, you don't need to purchase *real* LINK. You can request and obtain Testnet LINK from a [faucet](../link-token-contracts/).

**Note**: You should add the corresponding LINK token to your MetaMask account first:
![Metamask Add Tokens Screens](/images/contract-devs/metamask-1.png)

If you encounter any issues, make sure to check you copied the address of the correct network:
![Metamask Verify Contracts Screen](/images/contract-devs/metamask-2.png)

Use your Metamask address on the Kovan network to request LINK and send 1 LINK to the contract address. Find this address in Remix under **Deployed Contracts** on the bottom left.

![Remix contract address](/files/intermediates-tutorial-04.png)

# 7. How do I test `rollDice`?

After you open the deployed contract tab in the bottom left, the function buttons are available. Find `rollDice` and click the caret to expand the parameter fields. Enter your Metamask address, and click 'roll'.

You will have to wait a few minutes for your transaction to confirm and the response to be sent back. You can get your house by clicking the `house` function button with your address. Once the response has been sent back, you'll be assigned a *Game of Thrones* house!

You might notice that there are more functions listed than you originally built in the smart contract. These were inherited from the `VRFConsumerBase` and `ConfirmedOwner` smart contracts, which are used in the contract definition.

# 8. Further Reading

To read more about generating random numbers in Solidity, read our blog posts:

- [35+ Blockchain RNG Use Cases Enabled by Chainlink VRF](https://blog.chain.link/blockchain-rng-use-cases-enabled-by-chainlink-vrf/)
- [How to Build Dynamic NFTs on Polygon](https://blog.chain.link/how-to-build-dynamic-nfts-on-polygon/)
- [Chainlink VRF Now Live on Ethereum Mainnet](https://blog.chain.link/chainlink-vrf-now-live-on-ethereum-mainnet/)

To explore more applications of Chainlink VRF, check out our [other tutorials](/docs/other-tutorials/#randomness-vrf).
