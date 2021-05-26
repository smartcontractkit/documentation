---
layout: nodes.liquid
date: Last Modified
title: "Using Chainlink Price Reference Contracts"
permalink: "docs/using-chainlink-price-reference-contracts/"
hidden: true
---
[block:api-header]
{
  "title": "A Decentralized Shared Resource for the DeFi Ecosystem"
}
[/block]
The Chainlink reference contracts are designed to become the end to end decentralized solution to access secure oracle price data on the Ethereum ecosystem. In the network's drive towards decentralization and sustainability, the price oracle contracts will allow for a self funding model where their future users will need to fund a certain amount of funds into the contract before being able to consume its data. 

The money the user sends will go to a funding pool responsible for the payment of the node operators  providing the data for the reference contract. The Chainlink network subsidy is currently responsible for most of the reference contract funding.

Our long term goal is to make these price oracle contracts fully decentralized, by having an economic model relying solely on users to govern and fund these contracts, by creating a community of stakeholders whose best interest is to have these critical contracts secure and well-funded. 

In this tutorial, we will teach you how to easily use these on-chain data points and start participating in their administration. 
[block:image]
{
  "images": [
    {
      "image": [
        "/files/fc21723-Screenshot_2020-04-07_at_16.16.07.png",
        "Screenshot 2020-04-07 at 16.16.07.png",
        1628,
        650,
        "#faf9f9"
      ]
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Import Chainlink into Your Project"
}
[/block]
In order to make it easy to use the reference data contracts, you can import <a href="https://www.npmjs.com/package/@chainlink/contracts" target="_blank" rel="noreferrer, noopener">@Chainlink Contracts NPM package</a> into your Solidity project.
[block:code]
{
  "codes": [
    {
      "code": "npm install @chainlink/contracts --save",
      "language": "shell",
      "name": "NPM"
    },
    {
      "code": "yarn add chainlink",
      "language": "shell",
      "name": "Yarn"
    }
  ]
}
[/block]
Also see [Create a Chainlinked Project](../create-a-chainlinked-project/) for additional ways to use Chainlink contracts in your project.
[block:api-header]
{
  "title": "Inherit the AggregatorInterface in Your Contract"
}
[/block]
Import the <a href="https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.4/interfaces/AggregatorInterface.sol" target="_blank" rel="noreferrer, noopener">AggregatorInterface.sol</a> contract into the source of the contract you want to consume reference data.
[block:code]
{
  "codes": [
    {
      "code": "import \"@chainlink/contracts/src/v0.4/interfaces/AggregatorInterface.sol\";",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "import \"@chainlink/contracts/src/v0.5/dev/AggregatorInterface.sol\";",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "import \"@chainlink/contracts/src/v0.6/dev/AggregatorInterface.sol\";",
      "language": "javascript",
      "name": "Solidity 6"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Specify  the Address of the Reference Contract"
}
[/block]
Set the address of the reference contract that contains the reference data you wish to consume.
[block:code]
{
  "codes": [
    {
      "code": "AggregatorInterface internal ref;\n\nfunction setReferenceContract(address _aggregator)\n  public\n  onlyOwner()\n{\n  ref = AggregatorInterface(_aggregator);\n}",
      "language": "javascript",
      "name": "Setter"
    },
    {
      "code": "AggregatorInterface internal ref;\n\nconstructor(address _aggregator) public {\n  ref = AggregatorInterface(_aggregator);\n}",
      "language": "javascript",
      "name": "Constructor"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Use the Reference Data"
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "These docs have been updated to the latest AggregatorInterface. `currentAnswer` has been renamed to `latestAnswer`, `updatedHeight` has been renamed to `latestTimestamp` and returns the block timestamp instead of the block number."
}
[/block]
Now that your contract is pointing towards a reference contract, you're ready to consume the data.
[block:code]
{
  "codes": [
    {
      "code": "function getLatestPrice() public view returns (int256) {\n  return ref.latestAnswer();\n}",
      "language": "javascript",
      "name": "latestAnswer"
    }
  ]
}
[/block]
You can also check the block timestamp at which the reference data was last updated.
[block:code]
{
  "codes": [
    {
      "code": "function getLatestTimestamp() public view returns (uint256) {\n  return ref.latestTimestamp();\n}",
      "language": "javascript",
      "name": "latestTimestamp"
    }
  ]
}
[/block]
To get historical data, call `latestRound` then you can provide `getAnswer` and `getTimestamp` with that `roundId` to obtain the value at that round, or a decremented value.
[block:code]
{
  "codes": [
    {
      "code": "function getPreviousAnswer(uint256 _back) public view returns (int256) {\n  uint256 latest = ref.latestRound();\n  require(_back <= latest, \"Not enough history\");\n  return ref.getAnswer(latest - _back);\n}\n\nfunction getPreviousTimestamp(uint256 _back) public view returns (uint256) {\n  uint256 latest = ref.latestRound();\n  require(_back <= latest, \"Not enough history\");\n  return ref.getTimestamp(latest - _back);\n}",
      "language": "javascript",
      "name": "latestRound"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Complete Example"
}
[/block]
Below is a brief but complete example of a consuming contract of Chainlink reference data.
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity ^0.4.24;\n\nimport \"@chainlink/contracts/src/v0.4/interfaces/AggregatorInterface.sol\";\n\ncontract ReferenceConsumer {\n  AggregatorInterface internal ref;\n\n  constructor(address _aggregator) public {\n    ref = AggregatorInterface(_aggregator);\n  }\n\n  function getLatestAnswer() public view returns (int256) {\n    return ref.latestAnswer();\n  }\n\n  function getLatestTimestamp() public view returns (uint256) {\n    return ref.latestTimestamp();\n  }\n\n  function getPreviousAnswer(uint256 _back) public view returns (int256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getAnswer(latest - _back);\n  }\n\n  function getPreviousTimestamp(uint256 _back) public view returns (uint256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getTimestamp(latest - _back);\n  }\n}\n",
      "language": "javascript",
      "name": "Solidity 4"
    },
    {
      "code": "pragma solidity ^0.5.0;\n\nimport \"@chainlink/contracts/src/v0.5/dev/AggregatorInterface.sol\";\n\ncontract ReferenceConsumer {\n  AggregatorInterface internal ref;\n\n  constructor(address _aggregator) public {\n    ref = AggregatorInterface(_aggregator);\n  }\n\n  function getLatestAnswer() public view returns (int256) {\n    return ref.latestAnswer();\n  }\n\n  function getLatestTimestamp() public view returns (uint256) {\n    return ref.latestTimestamp();\n  }\n\n  function getPreviousAnswer(uint256 _back) public view returns (int256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getAnswer(latest - _back);\n  }\n\n  function getPreviousTimestamp(uint256 _back) public view returns (uint256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getTimestamp(latest - _back);\n  }\n}\n",
      "language": "javascript",
      "name": "Solidity 5"
    },
    {
      "code": "pragma solidity ^0.6.0;\n\nimport \"@chainlink/contracts/src/v0.6/dev/AggregatorInterface.sol\";\n\ncontract ReferenceConsumer {\n  AggregatorInterface internal ref;\n\n  constructor(address _aggregator) public {\n    ref = AggregatorInterface(_aggregator);\n  }\n\n  function getLatestAnswer() public view returns (int256) {\n    return ref.latestAnswer();\n  }\n\n  function getLatestTimestamp() public view returns (uint256) {\n    return ref.latestTimestamp();\n  }\n\n  function getPreviousAnswer(uint256 _back) public view returns (int256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getAnswer(latest - _back);\n  }\n\n  function getPreviousTimestamp(uint256 _back) public view returns (uint256) {\n    uint256 latest = ref.latestRound();\n    require(_back <= latest, \"Not enough history\");\n    return ref.getTimestamp(latest - _back);\n  }\n}\n",
      "language": "javascript",
      "name": "Solidity 6"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "body": "The `latestAnswer` value for all USD reference data contracts is multiplied by `100000000` before being written on-chain and by `1000000000000000000` for all ETH pairs."
}
[/block]

[block:api-header]
{
  "title": "Test Reference Data Contracts (Ropsten)"
}
[/block]
Below are the available reference data contracts on the Ropsten test network.
[block:parameters]
{
  "data": {
    "h-0": "Pair",
    "h-1": "Address",
    "3-0": "ETH/USD",
    "3-1": "<a href=\"https://ropsten.etherscan.io/address/0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507\" target=\"_blank\">`0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507`</a>",
    "1-0": "BTC/USD",
    "1-1": "<a href=\"https://ropsten.etherscan.io/address/0x882906a758207FeA9F21e0bb7d2f24E561bd0981\" target=\"_blank\">`0x882906a758207FeA9F21e0bb7d2f24E561bd0981`</a>",
    "4-0": "LINK/USD",
    "4-1": "<a href=\"https://ropsten.etherscan.io/address/0x060b38B197fE60cA5F36EA94452DA7F1bc3c7823\" target=\"_blank\">`0x060b38B197fE60cA5F36EA94452DA7F1bc3c7823`</a>",
    "0-0": "BAT/USD",
    "0-1": "<a href=\"https://ropsten.etherscan.io/address/0x0237f6c4ba705d0352a1a404e7608adddf479570\" target=\"_blank\">`0x0237f6c4ba705d0352a1a404e7608adddf479570`</a>",
    "2-1": "<a href=\"https://ropsten.etherscan.io/address/0x017d3880ee52e23dbc5bd8a855d51beae41f5cbb\" target=\"_blank\">`0x017d3880ee52e23dbc5bd8a855d51beae41f5cbb`</a>",
    "2-0": "DAI/USD",
    "5-0": "REP/USD",
    "5-1": "<a href=\"https://ropsten.etherscan.io/address/0xaaf825b7a1e833f2b79975108a030c76756fdc1a\" target=\"_blank\">`0xaaf825b7a1e833f2b79975108a030c76756fdc1a`</a>",
    "6-0": "USDC/USD",
    "6-1": "<a href=\"https://ropsten.etherscan.io/address/0x2384742359a5b178bd32a858213680355888c88b\" target=\"_blank\">`0x2384742359a5b178bd32a858213680355888c88b`</a>",
    "7-0": "ZRX/USD",
    "7-1": "<a href=\"https://ropsten.etherscan.io/address/0x4236076ba45fffa00678f0008ab76ac79222d7fe\" target=\"_blank\">`0x4236076ba45fffa00678f0008ab76ac79222d7fe`</a>",
    "8-0": "BNB/USD",
    "8-1": "<a href=\"https://ropsten.etherscan.io/address/0x5959afee59d3d28bbe5995b506ee17b305096e48\" target=\"_blank\">`0x5959AFEE59d3D28bbE5995B506ee17B305096E48`</a>",
    "9-0": "SNX/USD",
    "9-1": "<a href=\"https://ropsten.etherscan.io/address/0xa3c93dc958511dcd2c85a6cc8b007e507fb3bb79\" target=\"_blank\">`0xa3c93DC958511dcD2C85a6CC8B007E507Fb3Bb79`</a>",
    "10-0": "XTZ/USD",
    "10-1": "<a href=\"https://ropsten.etherscan.io/address/0x0256fb6c5d26bb867571964a43a300e1770cf038\" target=\"_blank\">`0x0256Fb6c5D26bb867571964A43a300E1770CF038`</a>",
    "11-0": "MKR/USD",
    "11-1": "<a href=\"https://ropsten.etherscan.io/address/0x4955fec0bcd97d9d83eef48052e8ff49aed521a4\" target=\"_blank\">`0x4955fec0BCD97d9d83Eef48052E8ff49aeD521a4`</a>",
    "12-0": "TRX/USD",
    "12-1": "<a href=\"https://ropsten.etherscan.io/address/0xeab37eeebe57c9e0d734703daeb8e43373dd079e\" target=\"_blank\">`0xeAb37EeEbE57C9E0d734703DAEb8E43373DD079E`</a>",
    "13-0": "XRP/USD",
    "13-1": "<a href=\"https://ropsten.etherscan.io/address/0x9d3425ce0f3766a949e622e535ce16edf5098448\" target=\"_blank\">`0x9d3425CE0F3766a949e622E535Ce16EDF5098448`</a>",
    "14-0": "LTC/USD",
    "14-1": "<a href=\"https://ropsten.etherscan.io/address/0xdec6ba5a1025117b07596a88cbb2f45ddfeda250\" target=\"_blank\">`0xDEC6bA5a1025117B07596A88CBb2F45dDfEdA250`</a>",
    "15-0": "sCEX/USD (Exchange index)",
    "15-1": "<a href=\"https://ropsten.etherscan.io/address/0x16745151a140035208a5b2ca0441b375ece29899\" target=\"_blank\">`0x16745151a140035208a5B2Ca0441b375Ece29899`</a>",
    "16-0": "sDEFI/USD (Exchange index)",
    "16-1": "<a href=\"https://ropsten.etherscan.io/address/0x71199172af06b51c7594afb0ea9c2d2d3ef13eb8\" target=\"_blank\">`0x71199172Af06b51c7594Afb0ea9C2D2D3ef13eb8`</a>",
    "17-1": "<a href=\"https://ropsten.etherscan.io/address/0x1c621aab85f7879690b5407404a097068770b59a\" target=\"_blank\">`0x1c621Aab85F7879690B5407404A097068770b59a`</a>",
    "17-0": "AUD/USD",
    "18-0": "XAG/USD",
    "18-1": "<a href=\"https://ropsten.etherscan.io/address/0x42de9e69b3a5a45600a11d3f37768dffa2846a8a\" target=\"_blank\">`0x42dE9E69B3a5a45600a11D3f37768dffA2846A8A`</a>",
    "19-0": "CHF/USD",
    "19-1": "<a href=\"https://ropsten.etherscan.io/address/0xd49c81796bccabb5cd804f9d186b5e00e9ac21ff\" target=\"_blank\">`0xD49c81796BccAbb5cd804f9d186B5E00E9Ac21fF`</a>",
    "20-1": "<a href=\"https://ropsten.etherscan.io/address/0xa2dbd50fd09b9572a8a37ed4c2aee4093a4b3ef7\" target=\"_blank\">`0xa2Dbd50FD09B9572a8A37ED4C2aEE4093A4b3Ef7`</a>",
    "20-0": "GBP/USD",
    "21-1": "<a href=\"https://ropsten.etherscan.io/address/0x2419a5aa4a82a6a18ca9b20ea2934d7467e6a2cf\" target=\"_blank\">`0x2419A5aA4A82a6A18cA9b20Ea2934d7467E6a2cf`</a>",
    "21-0": "XAU/USD",
    "22-1": "<a href=\"https://ropsten.etherscan.io/address/0xe95fede497d0c02a2dbc8e20c5e8bffe9339f03a\" target=\"_blank\">`0xe95feDE497d0c02a2DBc8e20C5E8bFFE9339F03a`</a>",
    "22-0": "EUR/USD",
    "23-1": "<a href=\"https://ropsten.etherscan.io/address/0x8eaebaf0ea3bc2a160b461703af409d074cdec6e\" target=\"_blank\">`0x8eAeBAF0eA3BC2a160b461703AF409d074CDEC6e`</a>",
    "23-0": "JPY/USD",
    "24-0": "LEND/ETH",
    "24-1": "<a href=\"https://ropsten.etherscan.io/address/0xf7b4834fe443d1E04D757b4b089b35F5A90F2847\" target=\"_blank\">`0xf7b4834fe443d1E04D757b4b089b35F5A90F2847`</a>",
    "25-1": "<a href=\"https://ropsten.etherscan.io/address/0x9a38cdefd74d72601a6b997024c491ef7314e11d\" target=\"_blank\">`0x9a38CdeFd74d72601a6B997024C491Ef7314E11D`</a>",
    "25-0": "AMPL/ETH",
    "26-1": "<a href=\"https://ropsten.etherscan.io/address/0x5b8B87A0abA4be247e660B0e0143bB30Cdf566AF\" target=\"_blank\">`0x5b8B87A0abA4be247e660B0e0143bB30Cdf566AF`</a>",
    "26-0": "BTC/ETH",
    "27-1": "<a href=\"https://ropsten.etherscan.io/address/0x811B1f727F8F4aE899774B568d2e72916D91F392\" target=\"_blank\">`0x811B1f727F8F4aE899774B568d2e72916D91F392`</a>",
    "27-0": "MKR/ETH",
    "28-0": "MANA/ETH",
    "28-1": "<a href=\"https://ropsten.etherscan.io/address/0xDab909dedB72573c626481fC98CEE1152b81DEC2\" target=\"_blank\">`0xDab909dedB72573c626481fC98CEE1152b81DEC2`</a>",
    "29-1": "<a href=\"https://ropsten.etherscan.io/address/0x19d97ceb36624a31d827032d8216dd2eb15e9845\" target=\"_blank\">`0x19D97CEb36624a31d827032D8216DD2eB15e9845`</a>",
    "29-0": "KNC/ETH",
    "30-1": "<a href=\"https://ropsten.etherscan.io/address/0xb8c99b98913bE2ca4899CdcaF33a3e519C20EeEc\" target=\"_blank\">`0xb8c99b98913bE2ca4899CdcaF33a3e519C20EeEc`</a>",
    "30-0": "LINK/ETH",
    "31-0": "USDC/ETH",
    "31-1": "<a href=\"https://ropsten.etherscan.io/address/0xe1480303dde539e2c241bdc527649f37c9cbef7d\" target=\"_blank\">`0xE1480303DDe539E2c241bdC527649F37c9cBef7d`</a>",
    "32-0": "REP/ETH",
    "32-1": "<a href=\"https://ropsten.etherscan.io/address/0xa949ee9ba80c0f381481f2eab538bc5547a5ac67\" target=\"_blank\">`0xa949eE9bA80c0F381481f2eaB538bC5547a5aC67`</a>",
    "33-1": "<a href=\"https://ropsten.etherscan.io/address/0x1d0052e4ae5b4ae4563cbac50edc3627ca0460d7\" target=\"_blank\">`0x1d0052E4ae5b4AE4563cBAc50Edc3627Ca0460d7`</a>",
    "33-0": "ZRX/ETH",
    "34-0": "BAT/ETH",
    "34-1": "<a href=\"https://ropsten.etherscan.io/address/0xafd8186c962daf599f171b8600f3e19af7b52c92\" target=\"_blank\">`0xAfd8186C962daf599f171B8600f3e19Af7B52c92`</a>",
    "35-1": "<a href=\"https://ropsten.etherscan.io/address/0x64b8e49baded7bfb2fd5a9235b2440c0ee02971b\" target=\"_blank\">`0x64b8e49baDeD7BFb2FD5A9235B2440C0eE02971B`</a>",
    "35-0": "DAI/ETH",
    "36-0": "TUSD/ETH",
    "36-1": "<a href=\"https://ropsten.etherscan.io/address/0x523ac85618df56e940534443125ef16daf785620\" target=\"_blank\">`0x523AC85618DF56E940534443125eF16DAf785620`</a>",
    "37-0": "USDT/ETH",
    "37-1": "<a href=\"https://ropsten.etherscan.io/address/0xc08fe0c4d97ccda6b40649c6da621761b628c288\" target=\"_blank\">`0xC08fe0C4D97ccda6B40649c6dA621761b628c288`</a>",
    "38-0": "SUSD/ETH",
    "38-1": "<a href=\"https://ropsten.etherscan.io/address/0xe054b4aee7ac7645642dd52f1c892ff0128c98f0\" target=\"_blank\">`0xe054B4AeE7AC7645642DD52f1C892Ff0128c98f0`</a>",
    "39-0": "SNX/ETH",
    "39-1": "<a href=\"https://ropsten.etherscan.io/address/0xA95674a8Ed9aa9D2E445eb0024a9aa05ab44f6bf\" target=\"_blank\">`0xA95674a8Ed9aa9D2E445eb0024a9aa05ab44f6bf`</a>",
    "40-1": "<a href=\"https://ropsten.etherscan.io/address/0x0A32D96Ff131cd5c3E0E5AAB645BF009Eda61564\" target=\"_blank\">`0x0A32D96Ff131cd5c3E0E5AAB645BF009Eda61564`</a>",
    "40-0": "BUSD/ETH",
    "41-0": "LRC/ETH",
    "41-1": "<a href=\"https://ropsten.etherscan.io/address/0xc85aA7D7A7EDfaD1D7d3dC41926B732e5C9C2CBA\" target=\"_blank\">`0xc85aA7D7A7EDfaD1D7d3dC41926B732e5C9C2CBA`</a>",
    "42-0": "SXP/USD",
    "42-1": "<a href=\"https://ropsten.etherscan.io/address/0x41799e0b9270a461c995e60462740a200ac6c77b\" target=\"_blank\">`0x41799e0b9270a461c995e60462740a200ac6c77b`</a>",
    "43-0": "BNT/USD",
    "43-1": "<a href=\"https://ropsten.etherscan.io/address/0xed325b49944fB2042204F80B205245D083e4bf01\" target=\"_blank\">`0xed325b49944fB2042204F80B205245D083e4bf01`</a>",
    "44-0": "LINK/USDT",
    "44-1": "<a href=\"https://ropsten.etherscan.io/address/0xc21c178fE75aAd2017DA25071c54462e26d8face\" target=\"_blank\">`0xc21c178fE75aAd2017DA25071c54462e26d8face`</a>",
    "45-0": "XHV/USD",
    "45-1": "<a href=\"https://ropsten.etherscan.io/address/0xf8756803b0c1D2dE9ea3d1ED507e4a15e22bd09d\" target=\"_blank\">`0xf8756803b0c1D2dE9ea3d1ED507e4a15e22bd09d`</a>"
  },
  "cols": 2,
  "rows": 46
}
[/block]

[block:api-header]
{
  "title": "Test Reference Data Contracts (Rinkeby)"
}
[/block]
Below are the available reference data contracts on the Rinkeby test network.
[block:parameters]
{
  "data": {
    "0-0": "BAT/USD",
    "1-0": "BTC/USD",
    "2-0": "DAI/USD",
    "3-0": "ETH/USD",
    "4-0": "LINK/USD",
    "5-0": "REP/USD",
    "6-0": "USDC/USD",
    "7-0": "ZRX/USD",
    "0-1": "<a href=\"https://rinkeby.etherscan.io/address/0x326C977E6efc84E512bB9C30f76E30c160eD06FB\" target=\"_blank\">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`</a>",
    "1-1": "<a href=\"https://rinkeby.etherscan.io/address/0x5498BB86BC934c8D34FDA08E81D444153d0D06aD\" target=\"_blank\">`0x5498BB86BC934c8D34FDA08E81D444153d0D06aD`</a>",
    "2-1": "<a href=\"https://rinkeby.etherscan.io/address/0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0\" target=\"_blank\">`0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0`</a>",
    "3-1": "<a href=\"https://rinkeby.etherscan.io/address/0x0bF4e7bf3e1f6D6Dc29AA516A33134985cC3A5aA\" target=\"_blank\">`0x0bF4e7bf3e1f6D6Dc29AA516A33134985cC3A5aA`</a>",
    "4-1": "<a href=\"https://rinkeby.etherscan.io/address/0x0853E36EeAd0eAA08D61E94237168696383869DD\" target=\"_blank\">`0x0853E36EeAd0eAA08D61E94237168696383869DD`</a>",
    "5-1": "<a href=\"https://rinkeby.etherscan.io/address/0xD8fB78dA76c7c9c8c1889EeA6b53967D87BF0A79\" target=\"_blank\">`0xD8fB78dA76c7c9c8c1889EeA6b53967D87BF0A79`</a>",
    "6-1": "<a href=\"https://rinkeby.etherscan.io/address/0x50390D95efcad051B78498A3D7BB3ff8Cd3dbbd7\" target=\"_blank\">`0x50390D95efcad051B78498A3D7BB3ff8Cd3dbbd7`</a>",
    "7-1": "<a href=\"https://rinkeby.etherscan.io/address/0x4b387f15D803eB6635C37A2B51e0E487c11C3b79\" target=\"_blank\">`0x4b387f15D803eB6635C37A2B51e0E487c11C3b79`</a>",
    "8-0": "BNB/USD",
    "8-1": "<a href=\"https://rinkeby.etherscan.io/address/0xbac6b2702abf4e402cf6f309eab9b372a5d86e16\" target=\"_blank\">`0xbAC6B2702AbF4e402cF6f309eAB9B372A5d86e16`</a>",
    "9-0": "SNX/USD",
    "9-1": "<a href=\"https://rinkeby.etherscan.io/address/0x04c50558b5d0ed6cf3210bc14fea43537e8685ad\" target=\"_blank\">`0x04C50558B5D0ED6cF3210bC14FEa43537E8685ad`</a>",
    "10-0": "XTZ/USD",
    "10-1": "<a href=\"https://rinkeby.etherscan.io/address/0xbdea0ec6c994298c61be377bbd7e4f2a31547158\" target=\"_blank\">`0xBDea0eC6C994298c61Be377Bbd7E4F2a31547158`</a>",
    "11-0": "TRX/USD",
    "11-1": "<a href=\"https://rinkeby.etherscan.io/address/0x613265f5a86228c940ca055aef03403b2de03f0b\" target=\"_blank\">`0x613265f5A86228c940ca055aEF03403b2DE03f0b`</a>",
    "12-0": "XRP/USD",
    "12-1": "<a href=\"https://rinkeby.etherscan.io/address/0x200f1f9c34a6e643c14a5826301b83db7ff93d0f\" target=\"_blank\">`0x200F1f9C34a6e643c14a5826301b83dB7fF93D0F`</a>",
    "13-0": "LTC/USD",
    "13-1": "<a href=\"https://rinkeby.etherscan.io/address/0x2b481dc923aa050e009113dca8dcb0dab4b68cdf\" target=\"_blank\">`0x2b481Dc923Aa050E009113Dca8dcb0daB4B68cDF`</a>",
    "14-0": "sCEX/USD (Exchange index)",
    "14-1": "<a href=\"https://rinkeby.etherscan.io/address/0xf1723d41573928d49e18525cc6f4b4b1a55840dc\" target=\"_blank\">`0xf1723d41573928d49E18525Cc6f4b4b1A55840DC`</a>",
    "15-0": "sDEFI/USD (Exchange index)",
    "15-1": "<a href=\"https://rinkeby.etherscan.io/address/0x886c163df214847f90135630babc3891f581939b\" target=\"_blank\">`0x886C163df214847f90135630BabC3891F581939b`</a>",
    "16-1": "<a href=\"https://rinkeby.etherscan.io/address/0xab1311577e6b96943ea2eb20b7f6c43844436d81\" target=\"_blank\">`0xaB1311577E6B96943eA2eB20B7f6C43844436D81`</a>",
    "16-0": "AUD/USD",
    "17-0": "XAG/USD",
    "17-1": "<a href=\"https://rinkeby.etherscan.io/address/0x43953507c1c393efcd9502ab275d6aea6ae75afd\" target=\"_blank\">`0x43953507c1c393efCd9502AB275D6aEa6aE75aFd`</a>",
    "18-0": "CHF/USD",
    "18-1": "<a href=\"https://rinkeby.etherscan.io/address/0xffa1969b84670051779aa3acd2dc350b810d361e\" target=\"_blank\">`0xfFa1969B84670051779aa3aCD2dc350b810D361e`</a>",
    "19-1": "<a href=\"https://rinkeby.etherscan.io/address/0x8653242adcbfd3a2580d81143f2a07c91525f96f\" target=\"_blank\">`0x8653242ADcBfD3A2580d81143F2a07c91525F96f`</a>",
    "19-0": "GBP/USD",
    "20-1": "<a href=\"https://rinkeby.etherscan.io/address/0xe16f5b1f03d1db374091ecb915dfce0b5e1c432c\" target=\"_blank\">`0xE16f5B1F03D1db374091ecB915Dfce0b5E1C432c`</a>",
    "20-0": "XAU/USD",
    "21-1": "<a href=\"https://rinkeby.etherscan.io/address/0x476d86dfad0aea4e33cc728cd5af0093f059368c\" target=\"_blank\">`0x476d86Dfad0AEa4e33Cc728cd5aF0093f059368C`</a>",
    "21-0": "EUR/USD",
    "22-1": "<a href=\"https://rinkeby.etherscan.io/address/0x5a7a8f877114bc15c3905d33f3733efe11b8ecb5\" target=\"_blank\">`0x5a7a8F877114bc15C3905D33f3733efe11b8eCb5`</a>",
    "22-0": "JPY/USD"
  },
  "cols": 2,
  "rows": 23
}
[/block]

[block:api-header]
{
  "title": "Test Reference Data Contracts (Kovan)"
}
[/block]
Below are the available reference data contracts on the Kovan test network.
[block:parameters]
{
  "data": {
    "0-0": "BAT/USD",
    "1-0": "BTC/USD",
    "2-0": "DAI/USD",
    "3-0": "ETH/USD",
    "4-0": "LINK/USD",
    "0-1": "<a href=\"https://kovan.etherscan.io/address/0x0853e36eead0eaa08d61e94237168696383869dd\" target=\"_blank\">`0x0853E36EeAd0eAA08D61E94237168696383869DD`</a>",
    "1-1": "<a href=\"https://kovan.etherscan.io/address/0x2445f2466898565374167859ae5e3a231e48bb41\" target=\"_blank\">`0x2445F2466898565374167859Ae5e3a231e48BB41`</a>",
    "2-1": "<a href=\"https://kovan.etherscan.io/address/0x7418A1a6E7dA5228c8DcC0eFfd0B68bE27695E9f\" target=\"_blank\">`0x7418A1a6E7dA5228c8DcC0eFfd0B68bE27695E9f`</a>",
    "3-1": "<a href=\"https://kovan.etherscan.io/address/0xd21912d8762078598283b14cba40cb4bfcb87581\" target=\"_blank\">`0xD21912D8762078598283B14cbA40Cb4bFCb87581`</a>",
    "4-1": "<a href=\"https://kovan.etherscan.io/address/0x326c977e6efc84e512bb9c30f76e30c160ed06fb\" target=\"_blank\">`0x326C977E6efc84E512bB9C30f76E30c160eD06FB`</a>",
    "5-0": "BNB/USD",
    "5-1": "<a href=\"https://kovan.etherscan.io/address/0xc3006264638bbb3b8de19e1296e7933eac04f65b\" target=\"_blank\">`0xc3006264638bBB3b8DE19E1296e7933EAC04f65b`</a>",
    "6-0": "SNX/USD",
    "6-1": "<a href=\"https://kovan.etherscan.io/address/0xf2c6d3b7d2435d28a2dc973f320ecf581c92a41f\" target=\"_blank\">`0xF2C6D3B7d2435D28a2DC973f320ECF581C92a41F`</a>",
    "7-0": "XTZ/USD",
    "7-1": "<a href=\"https://kovan.etherscan.io/address/0xdbdb32b0623eefb75d8d269a99e54512a4683279\" target=\"_blank\">`0xDbdB32b0623EEFB75D8D269A99e54512A4683279`</a>",
    "8-0": "TRX/USD",
    "8-1": "<a href=\"https://kovan.etherscan.io/address/0xc9fbec53445c3c893ad032b878405e4064f69403\" target=\"_blank\">`0xc9FBeC53445C3C893aD032B878405E4064f69403`</a>",
    "9-0": "XRP/USD",
    "9-1": "<a href=\"https://kovan.etherscan.io/address/0xaf5f268198929283927a9a427c62772d0d9dfc00\" target=\"_blank\">`0xaF5F268198929283927a9a427C62772D0d9dFc00`</a>",
    "10-0": "LTC/USD",
    "10-1": "<a href=\"https://kovan.etherscan.io/address/0xd0d5e3db44de05e9f294bb0a3beeaf030de24ada\" target=\"_blank\">`0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada`</a>",
    "11-0": "sCEX/USD (Exchange index)",
    "11-1": "<a href=\"https://kovan.etherscan.io/address/0xa602bc9609d82da593ab072974bb132be869b7a7\" target=\"_blank\">`0xA602bC9609D82Da593aB072974BB132BE869B7a7`</a>",
    "12-0": "sDEFI/USD (Exchange index)",
    "12-1": "<a href=\"https://kovan.etherscan.io/address/0x426ed6e87fafa5a4201e5ca00435efaba99ffdb1\" target=\"_blank\">`0x426eD6e87FAFa5A4201E5ca00435EFaBA99fFdB1`</a>",
    "13-1": "<a href=\"https://kovan.etherscan.io/address/0xfd4767f2136f277ddd36b563504797c46a2eff3b\" target=\"_blank\">`0xFD4767F2136F277ddd36b563504797C46a2eFF3B`</a>",
    "13-0": "AUD/USD",
    "14-0": "XAG/USD",
    "14-1": "<a href=\"https://kovan.etherscan.io/address/0x2447890e8b99f180e7bfa3386342cea8eedc64a3\" target=\"_blank\">`0x2447890E8b99f180e7BfA3386342CeA8EeDC64A3`</a>",
    "15-0": "CHF/USD",
    "15-1": "<a href=\"https://kovan.etherscan.io/address/0x3a982ed122bf8e2bee035fcc6caec894823e0129\" target=\"_blank\">`0x3a982Ed122bF8e2bee035fCc6CAec894823E0129`</a>",
    "16-1": "<a href=\"https://kovan.etherscan.io/address/0xbcf04560239e5a0d8e497e8215288ff8d25c026e\" target=\"_blank\">`0xbcf04560239e5A0D8e497E8215288fF8D25C026e`</a>",
    "16-0": "GBP/USD",
    "17-1": "<a href=\"https://kovan.etherscan.io/address/0xf1302340da93edef6da03c66bc52f75a956e482c\" target=\"_blank\">`0xF1302340da93EdEF6DA03C66bc52F75A956e482C`</a>",
    "17-0": "XAU/USD",
    "18-1": "<a href=\"https://kovan.etherscan.io/address/0xf23ccda8333f658c43e7fc19aa00f6f5722eb225\" target=\"_blank\">`0xf23CCdA8333f658c43E7fC19aa00f6F5722eB225`</a>",
    "18-0": "EUR/USD",
    "19-1": "<a href=\"https://kovan.etherscan.io/address/0xcd93a652e731bb38ea9efc5febcf977eda2a01f7\" target=\"_blank\">`0xcd93a652e731Bb38eA9Efc5fEbCf977EDa2a01f7`</a>",
    "19-0": "JPY/USD",
    "20-0": "LEND/ETH",
    "20-1": "<a href=\"https://kovan.etherscan.io/address/0xdce38940264dfbc01ad1486c21764948e511947e\" target=\"_blank\">`0xdCE38940264DfbC01aD1486c21764948e511947e`</a>",
    "21-1": "<a href=\"https://kovan.etherscan.io/address/0x4b387f15D803eB6635C37A2B51e0E487c11C3b79\" target=\"_blank\">`0x4b387f15D803eB6635C37A2B51e0E487c11C3b79`</a>",
    "21-0": "AMPL/ETH",
    "22-1": "<a href=\"https://kovan.etherscan.io/address/0x33E5085E92f5b53E9A193E28ad2f76bF210550BB\" target=\"_blank\">`0x33E5085E92f5b53E9A193E28ad2f76bF210550BB`</a>",
    "22-0": "BTC/ETH",
    "23-1": "<a href=\"https://kovan.etherscan.io/address/0x14D7714eC44F44ECD0098B39e642b246fB2c38D0\" target=\"_blank\">`0x14D7714eC44F44ECD0098B39e642b246fB2c38D0`</a>",
    "23-0": "MKR/ETH",
    "24-1": "<a href=\"https://kovan.etherscan.io/address/0x3c30c5c415B2410326297F0f65f5Cbb32f3aefCc\" target=\"_blank\">`0x3c30c5c415B2410326297F0f65f5Cbb32f3aefCc`</a>",
    "24-0": "MANA/ETH",
    "25-1": "<a href=\"https://kovan.etherscan.io/address/0x0893AaF58f62279909F9F6FF2E5642f53342e77F\" target=\"_blank\">`0x0893AaF58f62279909F9F6FF2E5642f53342e77F`</a>",
    "25-0": "KNC/ETH",
    "26-1": "<a href=\"https://kovan.etherscan.io/address/0xf1e71Afd1459C05A2F898502C4025be755aa844A\" target=\"_blank\">`0xf1e71Afd1459C05A2F898502C4025be755aa844A`</a>",
    "26-0": "LINK/ETH",
    "27-1": "<a href=\"https://kovan.etherscan.io/address/0x672c1C0d1130912D83664011E7960a42E8cA05D5\" target=\"_blank\">`0x672c1C0d1130912D83664011E7960a42E8cA05D5`</a>",
    "27-0": "USDC/ETH",
    "28-1": "<a href=\"https://kovan.etherscan.io/address/0x09F4A94F44c29d4967C761bBdB89f5bD3E2c09E6\" target=\"_blank\">`0x09F4A94F44c29d4967C761bBdB89f5bD3E2c09E6`</a>",
    "28-0": "REP/ETH",
    "29-1": "<a href=\"https://kovan.etherscan.io/address/0x2636cfdDB457a6C7A7D60A439F1E5a5a0C3d9c65\" target=\"_blank\">`0x2636cfdDB457a6C7A7D60A439F1E5a5a0C3d9c65`</a>",
    "29-0": "ZRX/ETH",
    "30-0": "BAT/ETH",
    "30-1": "<a href=\"https://kovan.etherscan.io/address/0x2c8d01771CCDca47c103194C5860dbEA2fE61626\" target=\"_blank\">`0x2c8d01771CCDca47c103194C5860dbEA2fE61626`</a>",
    "31-1": "<a href=\"https://kovan.etherscan.io/address/0x6F47077D3B6645Cb6fb7A29D280277EC1e5fFD90\" target=\"_blank\">`0x6F47077D3B6645Cb6fb7A29D280277EC1e5fFD90`</a>",
    "31-0": "DAI/ETH",
    "32-1": "<a href=\"https://kovan.etherscan.io/address/0x02424c54D78D48179Fd12ebFfB11c16f9CA984Ad\" target=\"_blank\">`0x02424c54D78D48179Fd12ebFfB11c16f9CA984Ad`</a>",
    "32-0": "TUSD/ETH",
    "33-1": "<a href=\"https://kovan.etherscan.io/address/0xCC833A6522721B3252e7578c5BCAF65738B75Fc3\" target=\"_blank\">`0xCC833A6522721B3252e7578c5BCAF65738B75Fc3`</a>",
    "33-0": "USDT/ETH",
    "34-1": "<a href=\"https://kovan.etherscan.io/address/0xa353F8b083F7575cfec443b5ad585D42f652E9F7\" target=\"_blank\">`0xa353F8b083F7575cfec443b5ad585D42f652E9F7`</a>",
    "34-0": "SUSD/ETH",
    "35-1": "<a href=\"https://kovan.etherscan.io/address/0x775E76cca1B5bc903c9a8C6f77416A35E5744664\" target=\"_blank\">`0x775E76cca1B5bc903c9a8C6f77416A35E5744664`</a>",
    "35-0": "SNX/ETH",
    "36-1": "<a href=\"https://kovan.etherscan.io/address/0x63294A05C9a81b1A40CAD3f2ff30617111630393\" target=\"_blank\">`0x63294A05C9a81b1A40CAD3f2ff30617111630393`</a>",
    "36-0": "BUSD/ETH"
  },
  "cols": 2,
  "rows": 37
}
[/block]

[block:api-header]
{
  "title": "Participate"
}
[/block]
Once you’re done experimenting with the Chainlink reference contracts on testnet, you can go to production environment. 

Please make sure you are in contact with the maintained of the reference contracts by signing up to this email list. These are the benefits you'll get from it as a mainnet user. 

1. You will received the latest news and provide feedback on the development of the self service vending machine model that the Chainlink team is working on. 
2. You will be able to provide your input on the frequency of updates for the networks you're using as well as provide feedback on their security. 
3. You will get technical feedback from the Chainlink team, as well as monitoring solutions and oracle best practices advice from industry experts. 
4. You will be able to work to bootstrap the Chainlink network by supporting these price contracts with a minimal fee, which will be highly discounted given your early adopter status.
5. Being part of our community, you will have many benefits, such as <a href="https://www.coindesk.com/the-founders-of-synthetix-and-chainlink-on-defi-derivatives-and-25-new-decentralized-price-feeds"_blank">sharing your experience on the network and your vision for the future</a>, <a href="https://events.chain.link"_blank">  being part of a worldwide meetup community </a>.

You will join a group of dedicated teams who are committed to support the growth of a secure, decentralized oracle ecosystem DeFi, leading projects such as <a href="https://www.synthetix.io/" target="_blank">Synthetix</a>, <a href="https://aave.com/" target="_blank">Aave</a> ,<a href="https://bzx.network/" target="_blank">bZx</a>, <a href="https://www.tokensets.com/" target="_blank">Set Protocol</a> and many others...


[block:callout]
{
  "type": "info",
  "body": "Signing up to the email list is key to making sure you're kept up to date on all the recent news and are leveraging all the tools at your disposal as a Chainlink developer"
}
[/block]

[block:api-header]
{
  "title": "Live Reference Data Contracts (Ethereum Mainnet)"
}
[/block]
To view the addresses of data feeds deployed to the Ethereum main network, visit our <a href="https://feeds.chain.link/" target="_blank">Feeds page</a>.
[block:api-header]
{
  "title": "Self Service Vending Machine System"
}
[/block]
The next step of the reference contract subscription is for the user of the contract to start contributing to the reference contract without having to interact with any party or governance body. A user will send tokens to a contract which will automatically whitelist the user's address to allow for the consumption of on-chain data. 

 This will enable the creation of a fully incentivized self service, whitelisting model, completely automated which doesn't require the intervention of any central parties. Users will be able to pick the reference contracts they want to consume, depending on the number of contracts, their volatility as well as the subscription period, they'll send an amount of tokens which will be automatically swapped through the use of Uniswap or Kyber for LINK which is used to pay node operators. 

This model will be the first ever self serving, fully sustainable and automated smart contract framework, we will be working hard in near future to make sure we're able to deliver this exciting feature for the Chainlink network. If you want to provide feedback as a user and be kept up to date on it, please make sure to sign up to the email list.  

[block:image]
{
  "images": [
    {
      "image": [
        "/files/4b62f1c-Screenshot_2020-04-07_at_16.19.07.png",
        "Screenshot 2020-04-07 at 16.19.07.png",
        1740,
        656,
        "#f7f7f6"
      ]
    }
  ]
}
[/block]