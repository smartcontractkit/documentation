---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Get a Random Number"
permalink: "docs/get-a-random-number/"
whatsnext: {"Contract Addresses":"/docs/vrf-contracts/"}
metadata:
  description: "How to generate a random number inside a smart contract using Chainlink VRF."
  image:
    0: "/files/OpenGraph_V3.png"
---

> ℹ️ You are viewing the VRF v2 guide.
>
> If you are using v1, see the [VRF v1 guide](./v1).

This guide explains how to get random values using a simple contract to request and receive random values from Chainlink VRF v2. To see more advanced examples with programmatic subscription configuration, see the [Example Contracts](/docs/chainlink-vrf/example-contracts/) page.

**Table of contents**

+ [Requirements](#requirements)
+ [Create and fund a subscription](#create-and-fund-a-subscription)
+ [Create and deploy a VRF v2 compatible contract](#create-and-deploy-a-vrf-v2-compatible-contract)
+ [Request random values](#request-random-values)
+ [Analyzing the contract](#analyzing-the-contract)
+ [Clean up](#clean-up)

## Requirements

This guide assumes that you know how to create and deploy smart contracts on Ethereum testnets using the following tools:

- [The Remix IDE](https://remix.ethereum.org/)
- [MetaMask](https://metamask.io/)
- [Rinkeby testnet ETH](/docs/link-token-contracts/#rinkeby)

If you are new to developing smart contracts on Ethereum, see the [Getting Started](/docs/conceptual-overview/) guide to learn the basics.

## Create and fund a subscription

For this example, create a new subscription on the Rinkeby testnet.

1. Open MetaMask and set it to use the Rinkeby testnet. The Subscription Manager detects your network based on the active network in MetaMask.

1. Check MetaMask to make sure you have testnet ETH and LINK on Rinkeby. If you need testnet funds, you can get them from [faucets.chain.link](https://faucets.chain.link/rinkeby).

1. Open the [Subscription Manager](https://vrf.chain.link) page.

1. Click **Create Subscription** and follow the instructions to create a new subscription account. MetaMask opens and asks you to confirm payment to create the account on-chain. After you approve the transaction, the network confirms the creation of your subscription account on-chain.

1. After the subscription is created, click **Add funds** and follow the instructions to fund your subscription. For this example, a balance of 2 LINK is sufficient. MetaMask opens to confirm the LINK transfer to your subscription. After you approve the transaction, the network confirms the transfer of your LINK token to your subscription account.

1. After you add funds, click **Add consumer**. A page opens with your account details and subscription ID.

1. Record your subscription ID, which you need for your consumer contract. You will add the consumer to your subscription later.

You can always find your subscription IDs, balances, and consumers on the [Subscription Manager](https://vrf.chain.link/) page.

Now that you have a funded subscription account and your subscription ID, [create and deploy a VRF v2 compatible contract](#create-and-deploy-a-vrf-v2-compatible-contract).

## Create and deploy a VRF v2 compatible contract

For this example, use the [VRFv2Consumer.sol](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2Consumer.sol) sample contract. This contract imports the following dependencies:

- [VRFConsumerBaseV2.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol)
- [VRFCoordinatorV2Interface.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol)
- [LinkTokenInterface.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/LinkTokenInterface.sol)

The contract also includes pre-configured values for the necessary request parameters such as `vrfCoordinator` address, `link` token contract address, and gas lane `keyHash`. You can change these parameters if you want to experiment on different testnets, but for this example you only need to specify `subId` with your subscription ID.

Build and deploy the contract on Rinkeby.

1. Open the [VRFv2Consumer.sol](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2Consumer.sol) contract in Remix.

    <div class="remix-callout">
          <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2Consumer.sol" target="_blank" >Open in Remix</a>
          <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
    </div>

1. Specify your subscription ID in the `subId` value in the contract. You can find your subscription ID in the [Subscription Manager](https://vrf.chain.link/).

    ```
    // Your subscription ID.
    uint64 subId = 0;
    ```

1. Compile and deploy the `VRFv2Consumer.sol` contract. MetaMask opens and asks you to confirm the transaction. After you approve the transaction, the contract is deployed on-chain with the subscription ID that you configured.

1. After you deploy your contract, get your deployed contract address from Remix. Before you can request randomness from VRF v2, you must add this address as an approved consumer on your subscription account.

1. In the [Subscription Manager](https://vrf.chain.link/), click the ID of your new subscription under the **My Subscriptions** list. The subscription details page opens.

1. In the **Consumers** section, click **Add consumer**.

1. Enter the address for your consumer contract that you just deployed and click **Add consumer**. MetaMask opens and asks you to confirm the transaction.

Your example contract is deployed and approved to use your subscription balance to pay for VRF v2 requests. Next, [request random values](#request-random-values) from Chainlink VRF.

## Request random values

The deployed contract requests random values from Chainlink VRF, receives those values, and then stores them in the `s_randomWords` array. Run the `requestRandomWords()` function on your contract to start the request.

1. Return to Remix and view your deployed contract functions in the **Deployed Contracts** list.

1. Click the `requestRandomWords()` function to send the request for random values to Chainlink VRF. MetaMask opens and asks you to confirm the transaction. After you approve the transaction, Chainlink VRF processes your request. Chainlink VRF fulfills the request and returns the random values to your contract in a callback to the `fulfillRandomWords()` function.

    Depending on current testnet conditions, it might take several minutes for the callback to return the requested random values to your contract. You can see a list of pending requests for your subscription ID in the [Subscription Manager](https://vrf.chain.link/).

1. After the oracle returns the random values to your contract, the `s_randomWords` variable stores an array with all of the requested random values. Specify the index of the array that you want to display and click `s_randomWords` to print the value. Because this example requests two random values, check the value at index `0` and then check the value at index `1`.

You deployed a simple contract that can request and receive random values from Chainlink VRF. To see more advanced examples where the contract can complete the entire process including subscription setup and management, see the [Example Contracts](/docs/chainlink-vrf/example-contracts/) page.

## Analyzing the contract

In this example, your MetaMask wallet is the subscription owner and you created a consumer contract to use that subscription. The consumer contract uses static configuration parameters.

```solidity
{% include samples/VRF/VRFv2Consumer.sol %}
```

The parameters define how your requests will be processed. You can find the values for your network in the [VRF Contract Addresses](/docs/vrf-contracts) page.

- `uint64 subId`: The subscription ID that this contract uses for funding requests.

- `address vrfCoordinator`: The address of the Chainlink VRF Coordinator contract.

- `address link`: The LINK token address for your selected network.

- `bytes32 keyHash`: The gas lane key hash value, which is the maximum gas price you are willing to pay for a request in wei. It functions as an ID of the off-chain VRF job to be run in response to requests.

- `uint32 callbackGasLimit`: The limit for how much gas to use for the the callback request to your contract's `fulfillRandomWords()` function. It must be less than the `maxGasLimit` limit on the coordinator contract.

- `uint16 requestConfirmations`: How many confirmations the Chainlink node should wait before responding. The longer the node waits, the more secure the random value is. It must be greater than the `minimumRequestBlockConfirmations` limit on the coordinator contract.

- `uint16 numWords`: How many random words to request. If you are able to make use of several random values in a single callback, you can reduce the amount of gas that you spend per random value.

The contract includes the following functions:

- `requestRandomWords()`: Takes your specified parameters and submits the request to the VRF coordinator contract.

- `fulfillRandomWords()`: Receives random values and stores them with your contract.

- `withdraw()`: A function you can use to withdraw LINK from your contract and send it to the specified address.

> 🚧 Security Considerations
>
> Be sure to review your contracts to make sure they follow the best practices on the [security considerations](/docs/vrf-security-considerations/) page.

## Clean up

After you are done with this contract and the subscription, you can retrieve the remaining testnet LINK to use with other examples.

1. In the [Subscription Manager](https://vrf.chain.link/), click the ID of your new subscription under the **My Subscriptions** list. The subscription details page opens.

1. Under your subscription details, click **Cancel subscription**. A field opens asking which wallet address you want to send remaining funds to.

1. Enter your wallet address and click **Cancel subscription**. MetaMask opens and asks you to confirm the transaction. After you approve the transaction, Chainlink VRF closes your subscription account and sends the remaining LINK to your wallet.
