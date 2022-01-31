---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Basic Request Model"
permalink: "docs/architecture-request-model/"
whatsnext: {"Make a GET Request":"/docs/make-a-http-get-request/", "Decentralized Data Model":"/docs/architecture-decentralized-model/"}
metadata:
  title: "Chainlink Basic Request Model"
  image:
    0: "/files/OpenGraph_V3.png"
---
# Contracts Overview

All source code is open source and available in our <a href="https://github.com/smartcontractkit/chainlink" target="_blank">Github repository</a>.

![Request Model Diagram](/files/881ade6-Simple_Architecture_Diagram_1_V1.png)

## ChainlinkClient

<a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/ChainlinkClient.sol" target="_blank">`ChainlinkClient`</a> is a parent contract that enables smart contracts to consume data from oracles. It's available in the Chainlink smart contract library which can be [installed using the latest package managers](../create-a-chainlinked-project/).

The client constructs and makes a request to a known Chainlink oracle through the `transferAndCall` function, implemented by the LINK token. This request contains encoded information that is required for the cycle to succeed. In the `ChainlinkClient` contract, this call is initiated with a call to `sendChainlinkRequestTo`.

To build your own client contract using `ChainlinkClient`, see [Introduction to Using Any API](../request-and-receive-data/), or view the [ChainlinkClient API Reference](../chainlink-framework/) for the `ChainlinkClient` contract.

## LINK Token

LINK is an <a href="https://github.com/ethereum/EIPs/issues/677" target="_blank">ERC-677</a> compliant token which implements `transferAndCall`, a function that allows tokens to be transferred whilst also triggering logic in the receiving contract within a single transaction.

Learn more about [ERC-677 and the LINK token](../link-token-contracts/).

## Oracle Contract

<a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/Oracle.sol" target="_blank">`Oracle`</a> contracts are owned by oracle node operators, which run alongside off-chain oracle nodes.

### Request

The client contract that initiates this cycle must create a request with:

* the oracle address
* the job ID, so the oracle know what tasks to perform
* the callback function, which the oracle will send the response to.

To learn about how to find oracles to suit your needs, see [Find Existing Jobs](../listing-services/).

Oracle contracts are responsible for handling on-chain requests made through the LINK token, by implementing `onTokenTransfer` as a <a href="https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.6/LinkTokenReceiver.sol" target="_blank">`LinkTokenReceiver`</a>. Upon execution of this function, the oracle contract **emits an `OracleRequest` event** containing information about the request. This event is crucial, as it is monitored by the off-chain oracle node which acts upon it.

### Fulfillment

For fulfillment, the oracle contract has a `fulfillOracleRequest` function which is used by the node to fulfill a request once it has the result of the job. This function returns the result to the `ChainlinkClient` using the callback function defined in the original request.

## Off-Chain Oracle Node

The off-chain oracle node is responsible for listening for events emitted by its corresponding on-chain smart contract. Once it detects an `OracleRequest` event, it uses the data emitted to perform a job.

The most common job type for a Node is to make a GET request to an API, retrieve some data from it, parse the response, convert the result into blockchain compatible data, then submit it in a transaction back to the oracle contract, using the `fulfillOracleRequest` function.

For more information on how to become a node operator, learn how to [run a Chainlink node](/docs/running-a-chainlink-node/).

# Consumer UML

Below is a UML diagram describing the contract structure of `ATestnetConsumer`, a deployed example contract implementing `ChainlinkClient`.

![Consumer UMK Diagram](/files/8ac3fc1-69a048b-Consumer_UML.svg)
