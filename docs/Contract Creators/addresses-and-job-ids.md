---
layout: nodes.liquid
date: Last Modified
title: "Addresses & Job IDs"
permalink: "docs/addresses-and-job-ids/"
hidden: true
---
[block:image]
{
  "images": [
    {
      "image": [
        "/files/5a589db-7b88b8d-sub-hero-chainlink-diagram.png",
        "7b88b8d-sub-hero-chainlink-diagram.png",
        1500,
        361,
        "#d9dbe3"
      ]
    }
  ]
}
[/block]
In order for a contract to make use of the Chainlink network, you'll need to have the address of the LINK token contract and our oracle contract. This section is meant to be a resource for developers when looking to input this data.

**Ropsten** (<a href="https://ropsten.chain.link/" target="_blank" rel="noreferrer, noopener">faucet</a>)

LINK token address: <a href="https://ropsten.etherscan.io/address/0x20fE562d797A42Dcb3399062AE9546cd06f63280" target="_blank" rel="noreferrer, noopener">"0x20fE562d797A42Dcb3399062AE9546cd06f63280"</a>
Oracle address: <a href="https://ropsten.etherscan.io/address/0xc99B3D447826532722E41bc36e644ba3479E4365" target="_blank" rel="noreferrer, noopener">"0xc99B3D447826532722E41bc36e644ba3479E4365"</a>

**Rinkeby** (<a href="https://rinkeby.chain.link/" target="_blank" rel="noreferrer, noopener">faucet</a>)

LINK token address: <a href="https://rinkeby.etherscan.io/address/0x01BE23585060835E02B77ef475b0Cc51aA1e0709" target="_blank" rel="noreferrer, noopener">"0x01BE23585060835E02B77ef475b0Cc51aA1e0709"</a>
Oracle address: <a href="https://rinkeby.etherscan.io/address/0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e" target="_blank" rel="noreferrer, noopener">"0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e"</a>

**Kovan** (<a href="https://kovan.chain.link/" target="_blank" rel="noreferrer, noopener">faucet</a>)

LINK token address: <a href="https://kovan.etherscan.io/address/0xa36085F69e2889c224210F603D836748e7dC0088" target="_blank" rel="noreferrer, noopener">"0xa36085F69e2889c224210F603D836748e7dC0088"</a>
Oracle address: <a href="https://kovan.etherscan.io/address/0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e" target="_blank" rel="noreferrer, noopener">"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e"</a>
[block:code]
{
  "codes": [
    {
      "code": "constructor() public {\n  setLinkToken(0x20fE562d797A42Dcb3399062AE9546cd06f63280);\n  setOracle(0xc99B3D447826532722E41bc36e644ba3479E4365);\n}",
      "language": "javascript",
      "name": "Ropsten"
    },
    {
      "code": "constructor() public {\n  setLinkToken(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);\n  setOracle(0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e);\n}",
      "language": "javascript",
      "name": "Rinkeby"
    },
    {
      "code": "constructor() public {\n  setLinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);\n  setOracle(0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e);\n}",
      "language": "javascript",
      "name": "Kovan"
    }
  ]
}
[/block]
You will need the `JobID` as bytes when requesting data from Chainlink. We have pre-made jobs available for you. Types with a Multiplier indicate that the value received from the given endpoint will be multiplied by the specified "times" value before being written to the blockchain. *If you use a JobId with a [Multiply](../adapters/#multiply) adapter without specifying a "times" parameter, the result will be multiplied by 0.* The string value of the JobIDs will need to be given to the Request as bytes.
[block:parameters]
{
  "data": {
    "0-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters/#jsonparse)\n[EthBytes32](../adapters/#ethbytes32)",
    "0-1": "Ropsten: 5b280bfed77646d297fdb6e718c7127a\nRinkeby: b0bde308282843d49a3a8d2dd2464af1\nKovan: 50fc4215f89443d185b061e5d7af9490",
    "0-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "1-0": "[HttpPost](../adapters/#httppost)\n[JsonParse](../adapters/#jsonparse)\n[EthBytes32](../adapters/#ethbytes32)",
    "1-1": "Ropsten: 469e74c5bca740c0addba9ea67eecc51\nRinkeby: c28c092ad6f045c79bdbd54ebb42ce4d\nKovan: b9fd06bb42dd444db1b944849cbffb11",
    "1-2": "`post`(string)\n`path`(dot-delimited string or array of strings)",
    "2-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters/#jsonparse)\n[EthInt256](../adapters/#ethint256)",
    "2-1": "Ropsten: 93032b68d4704fa6be2c3ccf7a23c107\nRinkeby: 648f1b4629324c7ab41b7980b3091138\nKovan: f9d13102fb90482f992fc06e15ed373b",
    "2-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "3-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters#jsonparse)\n[Multiply](../adapters/#secion-multiply)\n[EthInt256](../adapters/#ethint256)",
    "3-1": "Ropsten: e055293deb37425ba83a2d5870c57649\nRinkeby: c8084988f0b54520ba17945c4a2ab7bc\nKovan: ad752d90098243f8a5c91059d3e5616c",
    "3-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int)",
    "4-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters/#jsonparse)\n[EthUint256](../adapters/#ethuint256)",
    "4-1": "Ropsten: fb5fb7b18921487fb26503cb075abf41\nRinkeby: 367c3cb39ab34bccad27deea5e37f365\nKovan: 2c6578f488c843588954be403aba2deb",
    "4-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "5-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters#jsonparse)\n[Multiply](../adapters/#secion-multiply)\n[EthUint256](../adapters/#ethuint256)",
    "5-1": "Ropsten: 493610cff14346f786f88ed791ab7704\nRinkeby: 6d1bfe27e7034b1d87b5270556b17277\nKovan: 29fa9aa13bf1468788b7cc4a500a45b8",
    "5-2": "`get`(string)\n`path`(dot-delimited string or array of strings)\n`times`(int)",
    "h-0": "Tasks",
    "h-1": "JobID",
    "h-2": "Required Parameters",
    "6-1": "Ropsten: 7ac0b3beac2c448cb2f6b2840d61d31f\nRinkeby: 4ce9b71a1ac94abcad1ff9198e760b8c\nKovan 6d914edc36e14d6c880c9c55bda5bc04",
    "6-2": "`get`(string)\n`path`(dot-delimited string or array of strings)",
    "6-0": "[HttpGet](../adapters/#httpget)\n[JsonParse](../adapters/#jsonparse)\n[EthBool](../adapters/#ethbool)"
  },
  "cols": 3,
  "rows": 7
}
[/block]
**Pricing Information**

All Chainlink jobs on all test networks require 1 LINK as payment. You may set up a payment as a constant available in the contract or as an input variable, like the example below.
[block:code]
{
  "codes": [
    {
      "code": "function requestEthereumPrice(bytes32 _jobId, uint256 _payment) \n  public\n{\n  Chainlink.Request memory req = newRequest(_jobId, this, this.fulfill.selector);\n  // request parameters go here\n  chainlinkRequest(req, _payment);\n}",
      "language": "javascript",
      "name": "Request with payment"
    }
  ]
}
[/block]