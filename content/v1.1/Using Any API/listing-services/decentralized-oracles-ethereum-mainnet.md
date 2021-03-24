---
title: "Oracles (Mainnet)"
slug: "decentralized-oracles-ethereum-mainnet"
hidden: false
createdAt: "2019-05-29T17:03:53.524Z"
updatedAt: "2020-10-16T11:57:14.373Z"
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
  "body": "Each oracle will wait for 3 confirmations before processing a request.",
  "title": "Important Information"
}
[/block]

[block:parameters]
{
  "data": {
    "h-0": "Chainlink Node Operator",
    "h-1": "Oracle Address",
    "2-0": "<a href=\"https://chain.link\" target=\"_blank\">Chainlink</a>",
    "2-1": "<a href=\"https://etherscan.io/address/0x89f70fA9F439dbd0A1BC22a09BEFc56adA04d9b4\" target=\"_blank\">`0x89f70fA9F439dbd0A1BC22a09BEFc56adA04d9b4`</a>",
    "3-0": "<a href=\"https://fiews.io/chainlink\" target=\"_blank\">Fiews</a>",
    "3-1": "<a href=\"https://etherscan.io/address/0x049Bd8C3adC3fE7d3Fc2a44541d955A537c2A484\" target=\"_blank\">`0x049Bd8C3adC3fE7d3Fc2a44541d955A537c2A484`</a>",
    "6-0": "<a href=\"https://www.linkpool.io/\" target=\"_blank\">LinkPool</a>",
    "6-1": "<a href=\"https://etherscan.io/address/0x240bae5a27233fd3ac5440b5a598467725f7d1cd\" target=\"_blank\">`0x240bae5a27233fd3ac5440b5a598467725f7d1cd`</a>",
    "h-2": "Price",
    "2-2": "0.1 LINK",
    "3-2": "0.1 LINK",
    "6-2": "0.1 LINK",
    "1-0": "<a href=\"https://www.chainlayer.io/\" target=\"_blank\">Chainlayer</a>",
    "1-1": "<a href=\"https://etherscan.io/address/0xf5a3d443fccd7ee567000e43b23b0e98d96445ce\" target=\"_blank\">`0xF5a3d443FccD7eE567000E43B23b0e98d96445CE`</a>",
    "1-2": "0.1 LINK",
    "4-0": "<a href=\"https://honeycomb.market/\" target=\"_blank\">honeycomb.market</a>",
    "4-1": "<a href=\"https://etherscan.io/address/0x78E76126719715Eddf107cD70f3A31dddF31f85A\" target=\"_blank\">`0x78E76126719715Eddf107cD70f3A31dddF31f85A`</a>",
    "4-2": "0.1 LINK",
    "h-3": "ETH Host",
    "1-3": "Self",
    "2-3": "Self",
    "3-3": "Self",
    "4-3": "<a href=\"https://fiews.io/contract-creators\" target=\"_blank\">Fiews</a>",
    "6-3": "Self",
    "8-0": "<a href=\"https://www.securedatalinks.com/\" target=\"_blank\">Secure Data Links</a>",
    "8-1": "<a href=\"https://etherscan.io/address/0x2Ed7E9fCd3c0568dC6167F0b8aEe06A02CD9ebd8\" target=\"_blank\">`0x2Ed7E9fCd3c0568dC6167F0b8aEe06A02CD9ebd8`</a>",
    "8-2": "0.1 LINK",
    "8-3": "<a href=\"https://fiews.io/contract-creators\" target=\"_blank\">Fiews</a>",
    "7-0": "<a href=\"https://omniscience.uk\" target=\"_blank\">Omniscience</a>",
    "7-1": "<a href=\"https://etherscan.io/address/0x83dA1beEb89Ffaf56d0B7C50aFB0A66Fb4DF8cB1\" target=\"_blank\">`0x83dA1beEb89Ffaf56d0B7C50aFB0A66Fb4DF8cB1`</a>",
    "7-3": "<a href=\"https://fiews.io/contract-creators\" target=\"_blank\">Fiews</a>",
    "7-2": "0.1 LINK",
    "5-0": "<a href=\"https://www.linkforest.io/\" target=\"_blank\">LinkForest.io</a>",
    "5-1": "<a href=\"https://etherscan.io/address/0x7a9d706b2a3b54f7cf3b5f2fcf94c5e2b3d7b24b\" target=\"_blank\">`0x7A9d706B2A3b54f7Cf3b5F2FcF94c5e2B3d7b24B`</a>",
    "5-2": "0.1 LINK",
    "5-3": "<a href=\"https://fiews.io/contract-creators\" target=\"_blank\">Fiews</a> & <a href=\"https://infura.io/\" target=\"_blank\">Infura</a>",
    "0-0": "<a href=\"https://certus.one/\" target=\"_blank\">Certus One</a>",
    "0-1": "<a href=\"https://etherscan.io/address/0x4565300c576431e5228e8aa32642d5739cf9247d\" target=\"_blank\">`0x4565300C576431e5228e8aA32642D5739CF9247d`</a>",
    "0-2": "0.1 LINK",
    "0-3": "<a href=\"https://alchemyapi.io/infrastructure\" target=\"_blank\">Alchemy</a> & <a href=\"https://infura.io/\" target=\"_blank\">Infura</a>",
    "9-0": "<a href=\"https://stake.fish/en/\" target=\"_blank\">stake.fish</a>",
    "9-1": "<a href=\"https://etherscan.io/address/0xB92ec7D213a28e21b426D79EDe3c9BBcf6917c09\" target=\"_blank\">`0xB92ec7D213a28e21b426D79EDe3c9BBcf6917c09`</a>",
    "9-2": "0.1 LINK",
    "9-3": "Self"
  },
  "cols": 4,
  "rows": 10
}
[/block]
Please contact Chainlink and our node operators to obtain Job IDs before use in mainnet. Use [Job IDs in testnet](https://dash.readme.com/project/chainlink/v1.1/docs/testnet-oracles) for integration and onboarding purposes. 
[block:parameters]
{
  "data": {
    "0-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "0-1": "[Contact Chainlink / Node Operators](https://docs.chain.link/docs/comms)",
    "0-2": "[`get`](doc:adapters#section-httpget)\n[`path`](doc:adapters#section-jsonparse)",
    "1-0": "[HttpPost](doc:adapters#section-httppost)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBytes32](doc:adapters#section-ethbytes32)",
    "1-1": "[Contact Chainlink / Node Operators](https://docs.chain.link/docs/comms)",
    "1-2": "[`post`](doc:adapters#section-httppost)\n[`path`](doc:adapters#section-jsonparse)",
    "2-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthInt256](doc:adapters#section-ethint256)",
    "2-1": "[Contact Chainlink / Node Operators](https://docs.chain.link/docs/comms)",
    "2-2": "[`get`](doc:adapters#section-httpget)\n[`path`](doc:adapters#section-jsonparse)\n[`times`](doc:adapters#section-multiply)",
    "3-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[Multiply](doc:adapters#secion-multiply)\n[EthUint256](doc:adapters#section-ethuint256)",
    "3-1": "[Contact Chainlink / Node Operators](https://docs.chain.link/docs/comms)",
    "3-2": "[`get`](doc:adapters#section-httpget)\n[`path`](doc:adapters#section-jsonparse)\n[`times`](doc:adapters#section-multiply)",
    "4-0": "[HttpGet](doc:adapters#section-httpget)\n[JsonParse](doc:adapters#section-jsonparse)\n[EthBool](doc:adapters#section-ethbool)",
    "4-1": "[Contact Chainlink / Node Operators](https://docs.chain.link/docs/comms)",
    "4-2": "[`get`](doc:adapters#section-httpget)\n[`path`](doc:adapters#section-jsonparse)\n[`times`](doc:adapters#section-multiply)",
    "h-0": "Adapters",
    "h-1": "Job IDs",
    "h-2": "Params"
  },
  "cols": 3,
  "rows": 5
}
[/block]