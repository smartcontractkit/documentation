---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Testnet Oracles'
permalink: 'docs/any-api-testnet-oracles/'
metadata:
  title: 'Testnet Oracles'
  description: 'Chainlink Developer Relations testnet oracles'
  image:
    0: '/files/72d4bd9-link.png'
---

The Chainlink Development Relations team maintains several testnet oracles that you can use to test your implementation quickly.

> 🚰 Link token address and Faucet details
>
> To retrieve the link token address or get faucet details for your testnet of choice, see the [LINK Token Contracts](/docs/link-token-contracts/) page.

**Topics**

- [Operator contracts](#operator-contracts)
- [Jobs](#jobs)

## Operator Contracts

Testnet [Operator contracts](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) are deployed and maintained on the following networks:

| Testnet          | Oracle Address                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum Rinkeby | [`0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f`](https://rinkeby.etherscan.io/address/0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f) |
| Ethereum Kovan   | [`0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656`](https://kovan.etherscan.io/address/0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656)   |

## Jobs

To make testing simple, jobs are configured with the following properties:

- Each request on testnets costs 0.1 LINK.
- Each oracle will wait for 1 confirmation before processing a request.
- Jobs have the same IDs accross testnets.

<br>

| Purpose                                                                                                                                                                                                     | Tasks                                                                                                                                                                                        | Job ID                             | Parameters                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| HTTP GET to any public API, parse the response and return arbitrary-length raw byte data **_bytes_**. <br> The job specs can be found [here](/docs/direct-request-get-bytes/)                               | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7da2702f37fd48e5b1b9a5715e3509b6` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
| HTTP GET to any public API, parse the response, multiply the result by a multiplier and return a signed integer **_int256_**. <br> The job specs can be found [here](/docs/direct-request-get-int256/)      | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `fcf4140d696d44b687012232948bdd5d` | `get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional) |
| HTTP GET to any public API, parse the reponse, multiply the result by a multiplier and return an unsigned integer **_uint256_** . <br> The job specs can be found [here](/docs/direct-request-get-uint256/) | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `ca98366cc7314957b8c012c72f05aeeb` | `get` (string)<br>`path` (dot-delimited string or array of strings)<br>`times` (int) (optional) |
| HTTP GET to any public API, parse the response and return a boolean **_bool_**. <br> The job specs can be found [here](/docs/direct-request-get-bool/)                                                      | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `c1c5e92880894eb6b27d3cae19670aa3` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
| HTTP GET to any public API, parse the response and return a sequence of characters **_string_**. <br> The job specs can be found [here](/docs/direct-request-get-string/)                                   | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7d80a6386ef543a3abb52817f6707e3b` | `get` (string)<br>`path` (dot-delimited string or array of strings)                             |
