---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Contract Addresses'
permalink: 'docs/decentralized-oracles-ethereum-mainnet/'
---

## Overview

This page details example addresses and jobs that are supported by oracles on various networks, so you can test your implementation quickly and easily.

For a comprehensive list of data providers, oracles, jobs, adapters, and more, visit [Chainlink Market](https://market.link/).

![Chainlink Market Logo](/files/afe3efe-marketlink.jpg)

## Mainnet

> 🚧 Important
>
> We strongly recommend that you deploy to a [testnet](#testnets) first, then move to mainnet.

LINK address:  [`0x514910771af9ca656af840dff83e8264ecf986ca`](https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca)

Head to [Chainlink Market](https://market.link/) for the latest Node and Job details.

## Testnets

Each request on the test networks cost 0.1 LINK. Each oracle will wait for 1 confirmation before processing a request.

These are examples which enable you to deploy and test quickly. Many more testnet oracle nodes and jobs can be found on [Chainlink Market](https://market.link/).

### Kovan

Kovan LINK address: [`0xa36085F69e2889c224210F603D836748e7dC0088`](https://kovan.etherscan.io/address/0xa36085F69e2889c224210F603D836748e7dC0088)

For Faucet details, please refer to [LINK Token Contracts](../link-token-contracts/).

| Chainlink Node Operator                | Oracle Address                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [Chainlink Devrel](https://chain.link) | [`0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656`](https://kovan.etherscan.io/address/0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656) |

<br>

| Purpose                                                                                                                                                                                                     | Tasks                                                                                                                                                                                        | Job ID                             | Parameters                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| HTTP GET to any public API, parse the response and return arbitrary-length raw byte data **_bytes_**. <br> The job specs can be found [here](/docs/direct-request-get-bytes/)                               | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7da2702f37fd48e5b1b9a5715e3509b6` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
| HTTP GET to any public API, parse the response, multiply the result by a multiplier and return a signed integer **_int256_**. <br> The job specs can be found [here](/docs/direct-request-get-int256/)      | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `fcf4140d696d44b687012232948bdd5d` | `get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional) |
| HTTP GET to any public API, parse the reponse, multiply the result by a multiplier and return an unsigned integer **_uint256_** . <br> The job specs can be found [here](/docs/direct-request-get-uint256/) | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `ca98366cc7314957b8c012c72f05aeeb` | `get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional) |
| HTTP GET to any public API, parse the response and return a boolean **_bool_**. <br> The job specs can be found [here](/docs/direct-request-get-bool/)                                                      | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `c1c5e92880894eb6b27d3cae19670aa3` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
| HTTP GET to any public API, parse the response and return a sequence of characters **_string_**. <br> The job specs can be found [here](/docs/direct-request-get-string/)                                   | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7d80a6386ef543a3abb52817f6707e3b` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
