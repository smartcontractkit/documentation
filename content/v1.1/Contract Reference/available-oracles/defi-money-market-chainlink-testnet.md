---
layout: nodes.liquid
title: "DEFI Money Market Chainlink (Testnet)"
slug: "defi-money-market-chainlink-testnet"
hidden: false
date: Last Modified
---
This Chainlink has a dedicated connection to DEFI Money Market. DeFi Money Market (DMM) Ecosystem acts as a bridge between Ethereum digital assets and real-world assets allowing holders to earn interest completely on-chain.
[block:api-header]
{
  "title": "Steps for using this oracle"
}
[/block]
- Write and deploy your [Chainlinked](doc:create-a-chainlinked-project) contract using the network details below
- Fund it with LINK (0.1 LINK is required per-request)
  - <a href="https://rinkeby.chain.link/" target="_blank">Rinkeby faucet</a>
- Call your [request method](#section-chainlink-example) 
[block:api-header]
{
  "title": "Chainlink Network Details"
}
[/block]
You will need to use the following LINK token address, oracle address, and Job ID in order to create the Chainlink request.

#### Rinkeby
LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
Oracle address: 0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
JobID: d4b380b30cb64722b8843ead232985c3
[block:api-header]
{
  "title": "Create your Chainlinked contract"
}
[/block]
Import `ChainlinkClient.sol` into your contract so you can inherit the `Chainlinked` behavior.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/ChainlinkClient.sol\";\n\ncontract MoneyMarketChainlink is ChainlinkClient {\n\n  uint256 oraclePayment;\n\n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/ChainlinkClient.sol\";\n\ncontract MoneyMarketChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/ChainlinkClient.sol\";\n\ncontract MoneyMarketChainlink is ChainlinkClient {\n  \n  uint256 oraclePayment;\n  \n  constructor(uint256 _oraclePayment) public {\n    setPublicChainlinkToken();\n    oraclePayment = _oraclePayment;\n  }\n  // Additional functions here:\n  \n}",
      "language": "javascript",
      "name": "Solidity 6"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Tasks"
}
[/block]
## Sum of Active Loans
- [DEFI-Money-Market](doc:external-adapters)
- [Multiply](doc:adapters#section-multiply)
- [EthUint256](doc:adapters#section-ethuint256)
- [EthTx](doc:adapters#section-ethtx)
[block:api-header]
{
  "title": "Chainlink Example"
}
[/block]
This example will get the block hash for a transaction.
[block:code]
{
  "codes": [
    {
      "code": "function getSumActiveLoans\n(\n  address _oracle,\n  bytes32 _jobId\n)\n  public\n  onlyOwner\n{\n  Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillActiveLoans.selector);\n  sendChainlinkRequestTo(_oracle, req, oraclePayment);\n}",
      "language": "javascript",
      "name": "Request"
    }
  ]
}
[/block]
Here is an example of the fulfill method:
[block:code]
{
  "codes": [
    {
      "code": "uint256 public sumActiveLoans;\n\nfunction fulfillActiveLoans(bytes32 _requestId, uint256 _sumActiveLoans)\n  public\n  recordChainlinkFulfillment(_requestId)\n{\n  sumActiveLoans = _sumActiveLoans;\n}",
      "language": "javascript",
      "name": "Fulfill"
    }
  ]
}
[/block]