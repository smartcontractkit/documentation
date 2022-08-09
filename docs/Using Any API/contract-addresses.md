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

| Testnet          | Oracle Address                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum Goerli  | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://goerli.etherscan.io/address/0xcc79157eb46f5624204f47ab42b3906caa40eab7)    |
| Ethereum Rinkeby | [`0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f`](https://rinkeby.etherscan.io/address/0xf3FBB7f3391F62C8fe53f89B41dFC8159EE9653f)   |
| Ethereum Kovan   | [`0xf702d6de1945993D5e7d15df870eE9f2523fbcC5`](https://kovan.etherscan.io/address/0xf702d6de1945993D5e7d15df870eE9f2523fbcC5)     |
| Avalanche Fuji   | [`0x022EEA14A6010167ca026B32576D6686dD7e85d2`](https://testnet.snowtrace.io/address/0x022eea14a6010167ca026b32576d6686dd7e85d2)   |
| Polygon Mumbai   | [`0x40193c8518BB267228Fc409a613bDbD8eC5a97b3`](https://mumbai.polygonscan.com/address/0x40193c8518BB267228Fc409a613bDbD8eC5a97b3) |
| Binance Testnet  | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://testnet.bscscan.com/address/0xCC79157eb46F5624204f47AB42b3906cAA40eaB7)    |
| Fantom Testnet   | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://testnet.ftmscan.com/address/0xcc79157eb46f5624204f47ab42b3906caa40eab7)    |

## Jobs

To make testing simple, jobs are configured with the following properties:

- Each request on testnets costs 0.1 LINK.
- Each oracle will wait for 1 confirmation before processing a request.
- Jobs have the same IDs accross testnets.

<br>

| Purpose                                                                                                                                                                                                                            | Tasks                                                                                                                                                                                        | Job ID                             | Required&nbspParameters                                                                                                                                  | Examples                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **_GET>bytes_**: <br>HTTP GET to any public API, parse the response and return arbitrary-length raw byte data **_bytes_**. <br> The job specs can be found [here](/docs/direct-request-get-bytes/)                                 | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7da2702f37fd48e5b1b9a5715e3509b6` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      | <ul><li>`req.add('get', 'https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json')`</li><li>`req.add('path', 'image')`</li></ul>                                         |
| **_GET>int256_**: <br>HTTP GET to any public API, parse the response, multiply the result by a multiplier and return a signed integer **_int256_**. <br> The job specs can be found [here](/docs/direct-request-get-int256/)       | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `fcf4140d696d44b687012232948bdd5d` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li><li>`times`: int</li></ul> | <ul><li>`req.add('get', 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD')`</li><li>`req.add('path', 'RAW,ETH,USD,VOLUME24HOUR')`</li><li>`req.addInt('times', 10**18)`</li></ul>         |
| **_GET>uint256_**: <br>HTTP GET to any public API, parse the reponse, multiply the result by a multiplier and return an unsigned integer **_uint256_** . <br> The job specs can be found [here](/docs/direct-request-get-uint256/) | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Multiply](/docs/jobs/task-types/multiply/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/) | `ca98366cc7314957b8c012c72f05aeeb` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li><li>`times`: int</li></ul> | <ul><li>`req.add('get', 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD')`</li><li>`req.add('path', 'RAW,ETH,USD,VOLUME24HOUR')`</li><li>`req.addInt('times', 10**18)`</li></ul>         |
| **_GET>bool_**: <br>HTTP GET to any public API, parse the response and return a boolean **_bool_**. <br> The job specs can be found [here](/docs/direct-request-get-bool/)                                                         | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `c1c5e92880894eb6b27d3cae19670aa3` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      | <ul><li>`req.add('get', 'https://app.proofi.com/api/verify/eip155/0xCB5085214B6318aF3dd0FBbb5E74fbF6bf332151?contract=0x2f7f7E44ca1e2Ca1A54db4222cF97ab47EE026F1')`</li><li>`req.add('path', 'approved')`</li></ul> |
| **_GET>string_**: <br>HTTP GET to any public API, parse the response and return a sequence of characters **_string_**. <br> The job specs can be found [here](/docs/direct-request-get-string/)                                    | [Http](/docs/jobs/task-types/http/)<br>[JsonParse](/docs/jobs/task-types/jsonparse/)<br>[Ethabiencode](/docs/jobs/task-types/eth-abi-encode/)                                                | `7d80a6386ef543a3abb52817f6707e3b` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      | <ul><li>`req.add('get', 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10')`</li><li>`req.add('path', '0,id')`</li></ul>                                                                  |
