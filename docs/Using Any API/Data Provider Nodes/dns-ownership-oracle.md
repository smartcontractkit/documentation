---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "DNS Ownership Oracle"
permalink: "docs/dns-ownership-oracle/"
---

## Overview

This oracle checks Google’s DNS service to determine if a given domain is owned by a given blockchain address. Each address is stored in a _TXT record_.
This guide explains how to call the _DNS ownership oracle_ and verify that a given address owns a specific domain. For instance, we will confirm that the address _0xf75519f611776c22275474151a04183665b7feDe_ owns _www5.infernos.io_.  **Note** that the source of data is [google dns](https://dns.google/resolve?name=www5.infernos.io&type=TXT).

**Topics**

- [Overview](#overview)
- [Requirements](#requirements)
- [DNS Ownership Contract](#dns-ownership-contract)
- [Network Details](#network-details)
- [Job](#job)


## Requirements

This guide assumes that you know how to create and deploy smart contracts on the Kovan Testnet using the following tools:

- [The Remix IDE](https://remix.ethereum.org/)
- [MetaMask](https://metamask.io/)
- [Kovan Link tokens](/docs/link-token-contracts/#kovan-deprecated)

You should be familiar with the [Chainlink Basic Request Model](/docs/architecture-request-model/). If you are new to developing smart contracts on Ethereum, see the [Getting Started](/docs/conceptual-overview/) guide to learn the basics.

## DNS Ownership Contract

This example operates using the following steps:

1. When you deploy the contract, the `constructor()` initializes the address of `oracle`, the `jobId`, and the fees `oraclePayment`. The code example is configured for the _Kovan testnet_. Check the [Network Details section](#network-details) for other networks.
1. Fund the contract with LINK tokens. Each request requires 0.1 LINK.
1. Run the `requestProof()` function to check that an address owns a domain name. For this example, you can use `www5.infernos.io` for the `_name` and `0xf75519f611776c22275474151a04183665b7feDe` for the `_record`. Notice how these parameters are used to build the Chainlink request. The selector of the `fulfill()` function is also passed so that the oracle knows which function to call back with the `proof`.
1. After few seconds, check the value of `proof`. It should return `true`.

```solidity
{% include 'samples/DataProviders/DnsOwnership.sol' %}
```

<div class="remix-callout">
  <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/DataProviders/DnsOwnership.sol" target="_blank" >Open in Remix</a>
  <a href="/docs/conceptual-overview/#what-is-remix" >What is Remix?</a>
</div>

## Network Details

The [DNS Ownership Contract example](#dns-ownership-contract) works on the _Kovan Testnet_. Below are the configuration for other chains.

#### Ethereum Mainnet

Payment Amount: 2 LINK  
LINK Token Address: `{{variables.MAINNET_LINK_TOKEN}}`
Oracle Address: `0x240BaE5A27233Fd3aC5440B5a598467725F7D1cd`  
JobID: `6ca2e68622bd421d98c648f056ee7c76`

#### Ethereum Kovan Testnet

Payment Amount: 0.1  LINK  
LINK Token Address: `{{variables.KOVAN_LINK_TOKEN}}`
Oracle Address: `0xff07c97631ff3bab5e5e5660cdf47aded8d4d4fd`  
JobID: `791bd73c8a1349859f09b1cb87304f71`

#### BNB Chain Mainnet

Payment Amount: 0.1 LINK  
LINK Token address:`{{variables.BINANCE_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x63B72AF260E8b40A7b89E238FeB53448A97b03D2`  
JobID: `fb06afd5a9df4e6cb156f6b797b63a24`  

#### Polygon (Matic) Mainnet

Payment Amount: 0.1 LINK  
LINK Token Address: `{{variables.MATIC_MAINNET_LINK_TOKEN}}`
Oracle Address: `0x63B72AF260E8b40A7b89E238FeB53448A97b03D2`  
JobID: `f3daed2990114e98906aaf21c4172da3`  

## Job

The _DNS Ownership_ node uses a [Chainlink v2 direct-request job](/docs/jobs/types/direct-request/). It is composed by the following taks:

- [ETH ABI Decode Log](/docs/jobs/task-types/eth-abi-decode-log/)
- [CBOR Parse](/docs/jobs/task-types/cborparse/)
- [DNS Proof external adapter](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/sources/dns-query#dns-proof-endpoint)
- [JSON Parse](/docs/jobs/task-types/jsonparse/)
- [ETH ABI Encode](/docs/jobs/task-types/eth-abi-encode/)
- [EthTx](/docs/jobs/task-types/eth-tx/)

```jpv2
type = "directrequest"
schemaVersion = 1
contractAddress = "0x0000000000000000000000000000000000000000"
maxTaskDuration = "0s"
observationSource = """
    decode_log          [type=ethabidecodelog
                         abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                         data="$(jobRun.logData)"
                         topics="$(jobRun.logTopics)"]

    decode_cbor         [type=cborparse data="$(decode_log.data)"]

    dnsproof            [type=bridge
                         name="dnsproof"
                         requestData="{\\"data\\": {\\"endpoint\\": \\"dnsProof\\", \\"name\\": $(decode_cbor.name), \\"record\\": $(decode_cbor.record)}}"]


    result_parse        [type=jsonparse data="$(dnsproof)" path="result"]

    encode_data         [type=ethabiencode
                         abi="(bool _result)"
                         data="{\\"_requestId\\": $(decode_log.requestId),\\"_result\\": $(result_parse)}"]

    encode_tx           [type=ethabiencode
                         abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                         data="{\\"requestId\\": $(decode_log.requestId),\\"payment\\": $(decode_log.payment),\\"callbackAddress\\": $(decode_log.callbackAddr),\\"callbackFunctionId\\": $(decode_log.callbackFunctionId),\\"expiration\\": $(decode_log.cancelExpiration),\\"data\\": $(encode_data)}"]

    submit_tx           [type=ethtx to="0x0000000000000000000000000000000000000000" data="$(encode_tx)" minConfirmations="2"]

    decode_log -> decode_cbor -> dnsproof -> result_parse -> encode_data -> encode_tx -> submit_tx
"""
```
