---
layout: ../../../../../layouts/MainLayout.astro
section: vrf
date: Last Modified
title: "Get a Random Number"
permalink: "docs/vrf/v2/direct-funding/examples/get-a-random-number/"
whatsnext:
  {
    "Security Considerations": "/vrf/v2/security/",
    "Best Practices": "/vrf/v2/best-practices/",
    "Migrating from VRF v1": "/vrf/v2/direct-funding/migration-from-v1/",
    "Supported Networks": "/vrf/v2/direct-funding/supported-networks/",
  }
metadata:
  description: "How to generate a random number inside a smart contract using Chainlink VRF v2 - Direct funding method."
setup: |
  import VrfCommon from "@features/vrf/v2/common/VrfCommon.astro"
  import CodeSample from "@components/CodeSample/CodeSample.astro"
---

<VrfCommon callout="directFunding"/>

This guide explains how to get random values using a simple contract to request and receive random values from Chainlink VRF v2 without managing a subscription. To explore more applications of VRF, refer to our [blog](https://blog.chain.link/).

## Requirements

This guide assumes that you know how to create and deploy smart contracts on Ethereum testnets using the following tools:

- [The Remix IDE](https://remix.ethereum.org/)
- [MetaMask](https://metamask.io/)
- [Sepolia testnet ETH](/resources/link-token-contracts/#sepolia-testnet)

If you are new to developing smart contracts on Ethereum, see the [Getting Started](/getting-started/conceptual-overview/) guide to learn the basics.

## Create and deploy a VRF v2 compatible contract

For this example, use the [VRFv2DirectFundingConsumer.sol](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2DirectFundingConsumer.sol) sample contract. This contract imports the following dependencies:

- `VRFV2WrapperConsumerBase.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol)
- `ConfirmedOwner.sol`[(link)](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/ConfirmedOwner.sol)

The contract also includes pre-configured values for the necessary request parameters such as `callbackGasLimit`, `requestConfirmations`, the number of random words `numWords`, the VRF v2 Wrapper address `wrapperAddress`, and the LINK token address `linkAddress`. You can change these parameters if you want to experiment on different testnets.

Build and deploy the contract on Sepolia.

1. Open the [`VRFv2DirectFundingConsumer.sol` contract](https://remix.ethereum.org/#url=https://docs.chain.link/samples/VRF/VRFv2DirectFundingConsumer.sol) in Remix.

   <!-- prettier-ignore -->
   <CodeSample src="samples/VRF/VRFv2DirectFundingConsumer.sol" showButtonOnly/>

1. On the **Compile** tab in Remix, compile the `VRFv2DirectFundingConsumer` contract.

1. Configure your deployment. On the **Deploy** tab in Remix, select the **Injected Web3 Environment** and select the `VRFv2DirectFundingConsumer` contract from the contract list.

1. Click the **Deploy** button to deploy your contract on-chain. MetaMask opens and asks you to confirm the transaction.

1. After you deploy your contract, copy the address from the **Deployed Contracts** list in Remix. Before you can request randomness from VRF v2, you must fund your consuming contract with enough LINK tokens in order to request for randomness. Next, [fund your contract](#fund-your-contract).

## Fund Your Contract

Requests for randomness will fail unless your consuming contract has enough LINK. Learn how to [Acquire testnet LINK](/resources/acquire-link/) and [Fund your contract](/resources/fund-your-contract/). For this example, funding with 2 LINK should be sufficient.

## Request random values

The deployed contract requests random values from Chainlink VRF, receives those values, builds a struct `RequestStatus` containing them, and stores the struct in a mapping `s_requests`. Run the `requestRandomWords()` function on your contract to start the request.

1. Return to Remix and view your deployed contract functions in the **Deployed Contracts** list.

1. Click the `requestRandomWords()` function to send the request for random values to Chainlink VRF. MetaMask opens and asks you to confirm the transaction.
   :::note[Remix IDE: gas limit setup]
   Remix IDE doesn't set the right gas limit. For this example to work, set a
   gas limit of _400,000_ as explained [here](https://metamask.zendesk.com/hc/en-us/articles/360022895972).
   :::
   After you approve the transaction, Chainlink VRF processes your request. Chainlink VRF fulfills the request and returns the random values to your contract in a callback to the `fulfillRandomWords()` function. At this point, a new key `requestId` is added to the mapping `s_requests`. Depending on current testnet conditions, it might take a few minutes for the callback to return the requested random values to your contract.

1. To fetch the request ID of your request, call `lastRequestId()`.

1. After the oracle returns the random values to your contract, the mapping `s_requests` is updated. The received random values are stored in `s_requests[_requestId].randomWords`.

1. Call `getRequestStatus()` and specify the `requestId` to display the random words.

:::note[Note on Requesting Randomness]
Do not re-request randomness. For more information, see the [VRF Security Considerations](/vrf/v2/security/) page.
:::

## Analyzing the contract

In this example, the consuming contract uses static configuration parameters.

::solidity-remix[samples/VRF/VRFv2DirectFundingConsumer.sol]

The parameters define how your requests will be processed. You can find the values for your network in the [Supported networks](/vrf/v2/direct-funding/supported-networks/) page.

- `uint32 callbackGasLimit`: The limit for how much gas to use for the callback request to your contract's `fulfillRandomWords()` function. It must be less than the `maxGasLimit` limit on the coordinator contract minus the `wrapperGasOverhead`. See the [VRF v2 Direct funding limits](/vrf/v2/direct-funding/#limits) for more details. Adjust this value for larger requests depending on how your `fulfillRandomWords()` function processes and stores the received random values. If your `callbackGasLimit` is not sufficient, the callback will fail and your consuming contract is still charged for the work done to generate your requested random values.

- `uint16 requestConfirmations`: How many confirmations the Chainlink node should wait before responding. The longer the node waits, the more secure the random value is. It must be greater than the `minimumRequestBlockConfirmations` limit on the coordinator contract.

- `uint32 numWords`: How many random values to request. If you can use several random values in a single callback, you can reduce the amount of gas that you spend per random value. The total cost of the callback request depends on how your `fulfillRandomWords()` function processes and stores the received random values, so adjust your `callbackGasLimit` accordingly.

The contract includes the following functions:

- `requestRandomWords()`: Takes your specified parameters and submits the request to the VRF v2 Wrapper contract.

- `fulfillRandomWords()`: Receives random values and stores them with your contract.

- `getRequestStatus()`: Retrive request details for a given `_requestId`.

- `withdrawLink()`: At any time, the owner of the contract can withdraw outstanding LINK balance from it.

:::note[Security Considerations]
Be sure to review your contracts to make sure they follow the best practices on the [security considerations](/vrf/v2/security/) page.
:::

## Clean up

After you are done with this contract, you can retrieve the remaining testnet LINK to use with other examples.

1. Call `withdrawLink()` function. MetaMask opens and asks you to confirm the transaction. After you approve the transaction, the remaining LINK will be transfered from your consuming contract to your wallet address.
