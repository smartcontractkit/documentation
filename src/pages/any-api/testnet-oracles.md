---
layout: ../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Testnet Oracles"
permalink: "docs/any-api/testnet-oracles/"
metadata:
  title: "Testnet Oracles"
  description: "Example Chainlink testnet oracles that you can use for development"
  image:
    0: "/files/72d4bd9-link.png"
---

The Chainlink Developer Relations team maintains several testnet oracles that you can use to test your implementation quickly.

:::tip[Link token address and Faucet details]

To retrieve the LINK token address or get faucet details for your testnet of choice, see the [LINK Token Contracts](/resources/link-token-contracts/) page.

:::

## Operator Contracts

Testnet [Operator contracts](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) are deployed and maintained on the following networks:

| Testnet          | Oracle Address                                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum Sepolia | [`0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD`](https://sepolia.etherscan.io/address/0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD)    |
| Ethereum Goerli  | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://goerli.etherscan.io/address/0xcc79157eb46f5624204f47ab42b3906caa40eab7)     |
| Avalanche Fuji   | [`0x022EEA14A6010167ca026B32576D6686dD7e85d2`](https://testnet.snowtrace.io/address/0x022eea14a6010167ca026b32576d6686dd7e85d2)    |
| Polygon Mumbai   | [`0x40193c8518BB267228Fc409a613bDbD8eC5a97b3`](https://mumbai.polygonscan.com/address/0x40193c8518BB267228Fc409a613bDbD8eC5a97b3)  |
| Binance Testnet  | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://testnet.bscscan.com/address/0xCC79157eb46F5624204f47AB42b3906cAA40eaB7)     |
| Fantom Testnet   | [`0xCC79157eb46F5624204f47AB42b3906cAA40eaB7`](https://testnet.ftmscan.com/address/0xcc79157eb46f5624204f47ab42b3906caa40eab7)     |
| Klaytn Testnet   | [`0xfC3BdAbD8a6A73B40010350E2a61716a21c87610`](https://baobab.scope.klaytn.com/account/0xfC3BdAbD8a6A73B40010350E2a61716a21c87610) |

## Jobs

### Job IDs

To make testing simple, jobs are configured with the following properties:

- Each request on testnets costs 0.1 LINK.
- Each oracle will wait for 1 confirmation before processing a request.
- Jobs have the same IDs accross testnets.
- Parameters are required. See [examples](#examples) for code snippets.

<br>

| Purpose                                                                                                                                                                                                                                                                           | Tasks                                                                                                                                                                                                                                                                                 | Job ID                             | Required&nbspParameters                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **_GET>bytes_**: <br>HTTP&nbspGET&nbspto&nbspany&nbsppublic&nbspAPI <br>parse the response <br>return arbitrary-length raw byte data **_bytes_**. <br>The job specs can be found [here](/chainlink-nodes/job-specs/direct-request-get-bytes/)                                     | [Http](/chainlink-nodes/oracle-jobs/task-types/task_http)<br>[JsonParse](/chainlink-nodes/oracle-jobs/task-types/task_jsonparse)<br>[Ethabiencode](/chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode/)                                                                      | `7da2702f37fd48e5b1b9a5715e3509b6` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      |
| **_GET>uint256_**: <br>HTTP&nbspGET&nbspto&nbspany&nbsppublic&nbspAPI <br>parse the reponse <br>multiply the result by a multiplier <br>return an unsigned integer **_uint256_** . <br> The job specs can be found [here](/chainlink-nodes/job-specs/direct-request-get-uint256/) | [Http](/chainlink-nodes/oracle-jobs/task-types/task_http)<br>[JsonParse](/chainlink-nodes/oracle-jobs/task-types/task_jsonparse)<br>[Multiply](/chainlink-nodes/oracle-jobs/task-types/task_multiply)<br>[Ethabiencode](/chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode/) | `ca98366cc7314957b8c012c72f05aeeb` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li><li>`times`: int</li></ul> |
| **_GET>int256_**: <br>HTTP&nbspGET&nbspto&nbspany&nbsppublic&nbspAPI <br>parse the response <br>multiply the result by a multiplier <br>return a signed integer **_int256_**. <br> The job specs can be found [here](/chainlink-nodes/job-specs/direct-request-get-int256/)       | [Http](/chainlink-nodes/oracle-jobs/task-types/task_http)<br>[JsonParse](/chainlink-nodes/oracle-jobs/task-types/task_jsonparse)<br>[Multiply](/chainlink-nodes/oracle-jobs/task-types/task_multiply)<br>[Ethabiencode](/chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode/) | `fcf4140d696d44b687012232948bdd5d` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li><li>`times`: int</li></ul> |
| **_GET>bool_**: <br>HTTP&nbspGET&nbspto&nbspany&nbsppublic&nbspAPI <br>parse the response <br>return a boolean **_bool_**. <br> The job specs can be found [here](/chainlink-nodes/job-specs/direct-request-get-bool/)                                                            | [Http](/chainlink-nodes/oracle-jobs/task-types/task_http)<br>[JsonParse](/chainlink-nodes/oracle-jobs/task-types/task_jsonparse)<br>[Ethabiencode](/chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode/)                                                                      | `c1c5e92880894eb6b27d3cae19670aa3` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      |
| **_GET>string_**: <br>HTTP&nbspGET&nbspto&nbspany&nbsppublic&nbspAPI <br>parse the response <br>return a sequence of characters **_string_**. <br> The job specs can be found [here](/chainlink-nodes/job-specs/direct-request-get-string/)                                       | [Http](/chainlink-nodes/oracle-jobs/task-types/task_http)<br>[JsonParse](/chainlink-nodes/oracle-jobs/task-types/task_jsonparse)<br>[Ethabiencode](/chainlink-nodes/oracle-jobs/task-types/task_eth_abi_encode/)                                                                      | `7d80a6386ef543a3abb52817f6707e3b` | <ul><li>`get`: string</li><li>`path`:&nbsp[JSONPath&nbspexpression](https://jsonpath.com/) with comma(,) delimited string</li></ul>                      |

### Examples

#### Get > bytes

A full example can be found [here](/any-api/get-request/examples/large-responses/).

##### Request method

<!-- prettier-ignore -->
```solidity
function request() public {
  Chainlink.Request memory req = buildChainlinkRequest('7da2702f37fd48e5b1b9a5715e3509b6', address(this), this.fulfill.selector);
  req.add(
      'get',
      'https://ipfs.io/ipfs/QmZgsvrA1o1C8BGCrx6mHTqR1Ui1XqbCrtbMVrRLHtuPVD?filename=big-api-response.json'
  );
  req.add('path', 'image');
  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
}
```

##### Callback method

<!-- prettier-ignore -->
```solidity
bytes public data;
string public imageUrl;
function fulfill(bytes32 requestId, bytes memory bytesData) public recordChainlinkFulfillment(requestId) {
    data = bytesData;
    imageUrl = string(data);
}
```

#### Get > uint256

A full example can be found [here](/any-api/get-request/examples/single-word-response/).

##### Request method

<!-- prettier-ignore -->
```solidity
function request() public {
  Chainlink.Request memory req = buildChainlinkRequest('ca98366cc7314957b8c012c72f05aeeb', address(this), this.fulfill.selector);
  req.add(
      'get',
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD'
  );
  req.add('path', 'RAW,ETH,USD,VOLUME24HOUR');
  req.addInt('times', 10**18); // Multiply by times value to remove decimals. Parameter required so pass '1' if the number returned doesn't have decimals
  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
}
```

##### Callback method

<!-- prettier-ignore -->
```solidity
uint256 public volume;
function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
  volume = _volume;
}
```

#### Get > int256

##### Request method

<!-- prettier-ignore -->
```solidity
function request() public {
  Chainlink.Request memory req = buildChainlinkRequest('fcf4140d696d44b687012232948bdd5d', address(this), this.fulfill.selector);
  req.add(
      'get',
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD'
  );
  req.add('path', 'RAW,ETH,USD,VOLUME24HOUR');
  req.addInt('times', 10**18); // Multiply by times value to remove decimals. Parameter required so pass '1' if the number returned doesn't have decimals
  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
}
```

##### Callback method

<!-- prettier-ignore -->
```solidity
int256 public volume;
function fulfill(bytes32 _requestId, int256 _volume) public recordChainlinkFulfillment(_requestId) {
  volume = _volume;
}
```

#### Get > bool

##### Request method

<!-- prettier-ignore -->
```solidity
function request() public {
  Chainlink.Request memory req = buildChainlinkRequest('c1c5e92880894eb6b27d3cae19670aa3', address(this), this.fulfill.selector);
  req.add(
      'get',
      'https://app.proofi.com/api/verify/eip155/0xCB5085214B6318aF3dd0FBbb5E74fbF6bf332151?contract=0x2f7f7E44ca1e2Ca1A54db4222cF97ab47EE026F1'
  );
  req.add('path', 'approved');
  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
}
```

##### Callback method

<!-- prettier-ignore -->
```solidity
bool public approved;
function fulfill(bytes32 _requestId, bool _approved) public recordChainlinkFulfillment(_requestId) {
  approved = _approved;
}
```

#### Get > string

A full example can be found [here](/any-api/get-request/examples/array-response/).

##### Request method

<!-- prettier-ignore -->
```solidity
function request() public {
  Chainlink.Request memory req = buildChainlinkRequest('7d80a6386ef543a3abb52817f6707e3b', address(this), this.fulfill.selector);
  req.add(
      'get',
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10'
  );
  req.add('path', '0,id');
  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
}
```

##### Callback method

<!-- prettier-ignore -->
```solidity
string public id;
function fulfill(bytes32 _requestId, string memory _id) public recordChainlinkFulfillment(_requestId) {
  id = _id;
}
```
