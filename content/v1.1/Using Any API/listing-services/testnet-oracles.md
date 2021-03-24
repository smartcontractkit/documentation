---
title: "Oracles (Testnet)"
slug: "testnet-oracles"
hidden: false
createdAt: "2019-05-07T17:58:40.247Z"
updatedAt: "2020-10-16T11:57:26.056Z"
---
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/3ac7088-highly-reliable-decentralized-oracle-network.png",
        "highly-reliable-decentralized-oracle-network.png",
        976,
        480,
        "#dbdee9"
      ]
    }
  ]
}
[/block]
**Using Multiple Oracles to Provide Greater Reliability**

In addition to sending requests to individual oracles, you are also able to use multiple oracles that verify the accuracy of the same result. Using multiple oracles helps guarantee that the results provided to your smart contract are accurate, creating a high degree of assurance that your smart contract is being triggered correctly. 

Each oracle supports the same type of request, as indicated by the **Adapters** column, so you can send the same parameters to multiple oracles to ensure that your contract is not reliant on a single node to execute. See the [Receiving Data from Multiple Oracles](doc:request-and-receive-data#section-receiving-data-from-multiple-oracles) section for an example.


On this page, we list the available oracles running on each test network and their available Job IDs. You will need a Job ID in order to request data from Chainlink. Be sure to familiarize yourself with [creating Chainlinked projects](doc:create-a-chainlinked-project) , and our [Solidity Reference](doc:chainlink-framework).

We first show the oracle contracts on each network. It is important to note that you must use the Job ID associated with the correct oracle contract. Meaning, Job IDs associated with the Chainlink Team will only work when sent to the Chainlink Team's oracle address.

The tables on this page will help you understand what the Job ID represents. In the first column, we list the adapters associated with the job. For further reading on what makes up a job in a Chainlink node, take a look at the [Job Specifications](doc:job-specifications) page. In the middle column, we give the Job ID for each available oracle, listed alphabetically. In the third column, we display the parameters that are required to be given per-request. For further reading on request parameters, see the [Request & Receive Data](doc:request-and-receive-data) page.
[block:callout]
{
  "type": "info",
  "body": "Each request on the test networks cost **0.1 LINK**. Each oracle will wait for 3 confirmations before processing a request.",
  "title": "Important Information"
}
[/block]
**Rinkeby**

Rinkeby LINK address:  <a href="https://rinkeby.etherscan.io/address/0x01be23585060835e02b77ef475b0cc51aa1e0709" target="_blank">`0x01be23585060835e02b77ef475b0cc51aa1e0709`</a>

<a href="https://rinkeby.chain.link/" target="_blank" rel="noreferrer, noopener">Rinkeby LINK Faucet</a>
[block:parameters]
{
  "data": {
    "h-0": "Chainlink Node Operator",
    "h-1": "Oracle Address",
    "0-0": "<a href=\"https://chain.link\" target=\"_blank\">Chainlink</a>",
    "0-1": "<a href=\"https://rinkeby.etherscan.io/address/0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e\" target=\"_blank\">`0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e`</a>"
  },
  "cols": 2,
  "rows": 1
}
[/block]

[block:parameters]
{
  "data": {
    "0-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "0-1": "`b0bde308282843d49a3a8d2dd2464af1`",
    "0-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "1-0": "[HttpPost](doc:adapters#section-httppost)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "1-1": "`c28c092ad6f045c79bdbd54ebb42ce4d`",
    "1-2": "`post`(string)\n`path`(dot-delimited string or array of strings)",
    "2-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthInt256](doc:adapters#section-ethint256)",
    "2-1": "`c8084988f0b54520ba17945c4a2ab7bc`",
    "2-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int) (optional)",
    "3-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthUint256](doc:adapters#section-ethuint256)",
    "3-1": "`6d1bfe27e7034b1d87b5270556b17277`",
    "3-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int) (optional)",
    "4-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBool](doc:adapters#section-ethbool)",
    "4-1": "`4ce9b71a1ac94abcad1ff9198e760b8c`",
    "4-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "h-0": "Adapters",
    "h-1": "Job ID",
    "h-2": "Params"
  },
  "cols": 3,
  "rows": 5
}
[/block]
**Kovan**

Kovan LINK address:  <a href="https://kovan.etherscan.io/address/0xa36085F69e2889c224210F603D836748e7dC0088" target="_blank">`0xa36085F69e2889c224210F603D836748e7dC0088`</a>

<a href="https://kovan.chain.link/" target="_blank" rel="noreferrer, noopener">Kovan LINK Faucet</a>
[block:parameters]
{
  "data": {
    "h-0": "Chainlink Node Operator",
    "h-1": "Oracle Address",
    "0-0": "<a href=\"https://chain.link\" target=\"_blank\">Chainlink</a>",
    "0-1": "<a href=\"https://kovan.etherscan.io/address/0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e\" target=\"_blank\">`0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e`</a>"
  },
  "cols": 2,
  "rows": 1
}
[/block]

[block:parameters]
{
  "data": {
    "0-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "0-1": "`50fc4215f89443d185b061e5d7af9490`",
    "0-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "1-0": "[HttpPost](doc:adapters#section-httppost)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "1-1": "`b9fd06bb42dd444db1b944849cbffb11`",
    "1-2": "`post`(string)\n`path`(dot-delimited string or array of strings)",
    "2-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthInt256](doc:adapters#section-ethint256)",
    "2-1": "`ad752d90098243f8a5c91059d3e5616c`",
    "2-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int) (optional)",
    "3-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthUint256](doc:adapters#section-ethuint256)",
    "3-1": "`29fa9aa13bf1468788b7cc4a500a45b8`",
    "3-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int) (optional)",
    "4-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBool](doc:adapters#section-ethbool)",
    "4-1": "`6d914edc36e14d6c880c9c55bda5bc04`",
    "4-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "h-0": "Adapters",
    "h-1": "Job ID",
    "h-2": "Params"
  },
  "cols": 3,
  "rows": 5
}
[/block]