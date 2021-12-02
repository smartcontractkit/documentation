---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Random Numbers: Using Chainlink VRF"
permalink: "docs/intermediates-tutorial/"
excerpt: "Using Chainlink VRF"
whatsnext: {"Get a Random Number":"/docs/get-a-random-number/", "API Calls tutorial":"/docs/advanced-tutorial/"}
metadata:
  title: "Random Numbers: Using Chainlink VRF"
  description: "Learn how to use randomness in your smart contracts using Chainlink VRF."
  image:
    0: "/files/2a242f1-link.png"
---

> 👍 Requirements
>
> This tutorial assumes that you have basic knowledge about Ethereum and writing and deploying smart contracts. If you are new to smart contract development, start with [The Basics: Data Feeds](../beginners-tutorial/) tutorial before starting this tutorial.

<p>
  https://www.youtube.com/watch?v=JqZWariqh5s
</p>

> 🚧 Note
>
> The video uses a seed phrase to request randomness. This feature is deprecated. Refer to the code in this tutorial for the most up to date procedures.

# Overview

In this tutorial, you will learn about generating randomness on blockchains. This includes learning how to implement a Request and Receive cycle with Chainlink oracles and how to consume random numbers with Chainlink VRF in smart contracts.

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

The [previous tutorial](../beginners-tutorial/) explained how to consume Chainlink Data Feeds, which consist of reference data posted on-chain by oracles. This data is stored in a contract and can be referenced by consumers until the oracle updates the data again.

Randomness, on the other hand, cannot be reference data. If the result of randomness is stored on-chain, any actor could retrieve the value and predict the outcome. Instead, randomness must be requested from an oracle, which generates a number and a cryptographic proof. Then, the oracle returns that result to the contract that requested it. This sequence is known as the **[Request and Receive cycle](../architecture-request-model/)**.

# 3. What is the payment process for generating a random number?

In return for providing the service of generating a random number, oracles are paid in [**LINK**](../link-token-contracts/). The contract that requests the randomness must pay for the service during the request.

LINK conforms to the ERC-677 token standard, which is an extension of ERC-20. This standard is what enables data to be encoded in token transfers. This is integral to the Request and Receive cycle. [Click here](https://github.com/ethereum/EIPs/issues/677) to learn more about ERC-677.

Smart contracts have all the capabilities that wallets have in that they are able to own and interact with tokens. The contract that requests randomness from Chainlink VRF must have a LINK balance greater than or equal to the cost to make the request in order to pay and fulfill the service.

For example, if the current price of Chainlink VRF is 0.1 LINK, the requesting contract must hold at least 0.1 LINK to pay for the request. Once the request transaction is complete, the oracle generates the random number and sends the result back.

# 4. How can I use Chainlink VRF?

To see a basic implementation of Chainlink VRF, see [Get a Random Number](../get-a-random-number/). In this section, you will create an application that uses Chainlink VRF to generate randomness. The contract used in this application will have a [*Game of Thrones*](https://en.wikipedia.org/wiki/Game_of_Thrones) theme.

The contract will request randomness from Chainlink VRF. The result of the randomness will transform into a number between 1 and 20, mimicking the rolling of a 20 sided die. Each number represents a *Game of Thrones* house. If the dies land on the value 1, the user is assigned house Targaryan, 2 for Lannister, and so on. A full list of houses can be found [here](https://gameofthrones.fandom.com/wiki/Great_House).

When rolling the die, it will accept an `address` variable to track which address is assigned to each house.

The contract will have the following functions:
- `rollDice`: This submits a randomness request to Chainlink VRF
- `fulfillRandomness`: The function that the Oracle uses to send the result back
- `house`: To see the assigned house of an address

**Note**:To jump straight to the entire implementation, you can [open the VRFD20.sol contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol) in remix.

## Importing `VRFConsumerBase`

Chainlink maintains a [library of contracts](https://github.com/smartcontractkit/chainlink/tree/master/contracts) that make consuming data from oracles easier. For Chainlink VRF, you will use a contract named [`VRFConsumerBase`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/VRFConsumerBase.sol) that must be imported and extended from the contract that you create.

```solidity
pragma solidity 0.6.7;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase {

}
```

## Contract variables

The contract will contain multiple objects. Each oracle job has a unique key hash that identifies the tasks that it should perform. The contract will store the Key Hash that identifies Chainlink VRF and the fee amount to use in the request.

```solidity
bytes32 private s_keyHash;
uint256 private s_fee;
```

For the contract to keep track of addresses that roll the dice, the contract will need to use mappings. [Mappings](https://medium.com/upstate-interactive/mappings-in-solidity-explained-in-under-two-minutes-ecba88aff96e) are unique `key => value` pair data structures similar to hash tables in Java.

```solidity
mapping(bytes32 => address) private s_rollers;
mapping(address => uint256) private s_results;
```

- `s_rollers` stores a mapping between the `requestID` (returned when a request is made), and the address of the roller. This is so the contract can keep track of who to assign the result to when it comes back.
- `s_results` stores the roller and the result of the dice roll.

## Initializing the contract

The fee and the key hash must be initialized in the constructor of the contract. To use `VRFConsumerBase` properly, you must also pass certain values into its constructor.

```solidity
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // variables
    bytes32 private s_keyHash;
    uint256 private s_fee;
    mapping(bytes32 => address) private s_rollers;
    mapping(address => uint256) private s_results;

    // constructor
    constructor(address vrfCoordinator, address link, bytes32 keyHash, uint256 fee)
        public
        VRFConsumerBase(vrfCoordinator, link)
    {
        s_keyHash = keyHash;
        s_fee = fee;
    }
}
```

As you can see, `VRFConsumerBase` needs to know the address of the vrfCoordinator, and the address of the LINK token. You can find these addresses [here](../vrf-contracts/).

## `rollDice` function

The `rollDice` function will complete the following tasks:

1. It needs to check if the contract has enough LINK to pay the oracle.
2. Check if the roller has already rolled since each roller can only ever be assigned to a single house.
3. Request randomness
4. Store the `requestId` and roller address.
5. Emit an event to signal that the die is rolling.

You must add a `ROLL_IN_PROGRESS` variable to signify that the die has been rolled but the result is not yet returned. Also add a `DiceRolled` event to the contract.

```solidity
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // variables
    uint256 private constant ROLL_IN_PROGRESS = 42;
    // ...
    // { variables that are already written }
    // ...

    // DiceRolled event
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
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // ...
    // { variables }
    // ...

    // events
    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event DiceLanded(bytes32 indexed requestId, uint256 indexed result);

    // ...
    // { constructor }
    // ...

    // ...
    // { rollDice function }
    // ...

    // fulfillRandomness function
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 d20Value = randomness.mod(20).add(1);
    s_results[s_rollers[requestId]] = d20Value;
    emit DiceLanded(requestId, d20Value);
    }
}
```

## `house` function

Finally, the `house` function returns the house of an address.

```solidity
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFD20 is VRFConsumerBase, ConfirmedOwner(msg.sender) {
    // ...
    // { variables }
    // ...

    // events
    event DiceRolled(bytes32 indexed requestId, address indexed roller);
    event DiceLanded(bytes32 indexed requestId, uint256 indexed result);

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
    require(s_results[player] != 0, "Dice not rolled");
    require(s_results[player] != ROLL_IN_PROGRESS, "Roll in progress");
    return getHouseName(s_results[player]);
    }

    // getHouseName function
    function getHouseName(uint256 id) private pure returns (string memory) {
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
        return houseNames[id.sub(1)];
    }
}
```

You have now completed all necessary functions to generate randomness and assign the user a *Game of Thrones* house. We've added a few helper functions in there to make using the contract easier and more flexible. You can deploy and interact with the complete contract in Remix:

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFD20.sol" target="_blank" class="cl-button--ghost solidity-tracked">Deploy this contract using Remix ↗</a>
    <a href="../deploy-your-first-contract/" title="">What is Remix?</a>
</div>

# 5. How do I deploy to testnet?

You will now deploy your completed contract. This deployment is slightly different than the example in the [The Basics: Using Data Feeds](/docs/beginners-tutorial/#7-how-do-i-deploy-to-testnet) tutorial. In our case, you will have to pass in parameters to the constructor upon deployment.

Once compiled, you'll see a menu that looks like this in the deploy pane:

![Remix Deployed Contract](/files/f6c0c2b-Screenshot_2020-12-18_at_16.23.19.png)

Click the caret arrow on the right hand side of **Deploy** to expand the parameter fields, and paste the following values in:

- `0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9`
- `0xa36085f69e2889c224210f603d836748e7dc0088 `
- `0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4`
- `100000000000000000`

These are the coordinator address, LINK address, key hash, and fee. For a full reference of the addresses, key hashes, and fees for each network, see [VRF Contracts](../vrf-contracts/). Click deploy and use your Metamask account to confirm the transaction.

**Note**: You should [have some Kovan ETH](/docs/beginners-tutorial/#obtaining-testnet-eth) in your Metamask account to pay for the GAS.

At this point, your contract should be successfully deployed. However, it can't request anything yet since it doesn't own LINK. If you click `rollDice` with no LINK, the transaction will revert.

# 6. How do I obtain testnet LINK?

Because the contract is on testnet, as with Kovan ETH, you don't need to purchase *real* LINK. You can request and obtain Testnet LINK from a [faucet](../link-token-contracts/).

Use your Metamask address on the Kovan network to request LINK and send 1 LINK to the contract address. This address can be found in Remix under **Deployed Contracts** on the bottom left.

**Note**: You should add the corresponding LINK token to your MetaMask account first:
![Metamask Add Tokens Screens](/images/contract-devs/metamask-1.png)

If you encounter any issues, make sure to check you copied the address of the correct network:
![Metamask Verify Contracts Screen](/images/contract-devs/metamask-2.png)

# 7. How do I test `rollDice`?

After you open the deployed contract tab in the bottom left, the function buttons are available. Find `rollDice` and click the caret to expand the parameter fields. Enter your Metamask address, and click 'roll'.

You will have to wait a few minutes for your transaction to confirm and the response to be sent back. You can get your house by clicking the `house` function button with your address. Once the response has been sent back, you'll be assigned a *Game of Thrones* house!

# 8. Further Reading

To read more about generating random numbers in Solidity, read our blog posts:

- [35+ Blockchain RNG Use Cases Enabled by Chainlink VRF](https://blog.chain.link/blockchain-rng-use-cases-enabled-by-chainlink-vrf/)
- [How to Build Dynamic NFTs on Polygon](https://blog.chain.link/how-to-build-dynamic-nfts-on-polygon/)
- [Chainlink VRF Now Live on Ethereum Mainnet](https://blog.chain.link/chainlink-vrf-now-live-on-ethereum-mainnet/)

To explore more applications of Chainlink VRF, check out our [other tutorials](/docs/other-tutorials/#vrf).
