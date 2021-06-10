---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Use your first contract!"
permalink: "docs/use-your-first-contract/"
whatsnext: {"Introduction to Price Feeds":"/docs/using-chainlink-reference-contracts/", "Introduction to Chainlink VRF":"/docs/chainlink-vrf/", "Introduction to Using Any API":"/docs/request-and-receive-data/"}
---
# Executing Functions

* Navigate back to Remix.
* On the left side panel you will see a list of functions of your contract.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/ad5784b-remix.png",
        "remix.png",
        283,
        650,
        "#3f3c48"
      ]
    }
  ]
}
[/block]
* In our example contract there are 3 functions that you can use to request external data from Chainlink. `requestEthereumChange`, `requestEthereumLastMarket` and `requestEthereumPrice`
* For this example we will use `requestEthereumPrice`.
* In the input field to the right of `requestEthereumPrice`, copy the text below to request the price of ETH in United States Dollars. The first parameter is the oracle contract address, and the second parameter is the Job ID. You will need to include the quotes.
[block:code]
{
  "codes": [
    {
      "code": "\"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e\", \"29fa9aa13bf1468788b7cc4a500a45b8\"",
      "language": "text",
      "name": "requestEthereumPrice"
    },
    {
      "code": "\"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e\",\"ad752d90098243f8a5c91059d3e5616c\"",
      "language": "text",
      "name": "requestEthereumChange"
    },
    {
      "code": "\"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e\",\"50fc4215f89443d185b061e5d7af9490\"",
      "language": "text",
      "name": "requestEthereumLastMarket"
    }
  ]
}
[/block]
* Click on the `requestEthereumPrice` button.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/332bb9c-Screen_Shot_2020-09-08_at_9.21.52_AM.png",
        "Screen Shot 2020-09-08 at 9.21.52 AM.png",
        1568,
        108,
        "#53474b"
      ],
      "sizing": "80"
    }
  ]
}
[/block]
* MetaMask will pop-up to confirm the transaction, click Confirm. (If you get a gas estimation failed message here, make sure the contract is [funded with LINK](../fund-your-contract/)./)
[block:image]
{
  "images": [
    {
      "image": [
        "/files/e00834f-metamask.png",
        "metamask.png",
        340,
        589,
        "#e9ebef"
      ]
    }
  ]
}
[/block]
* Once the transaction confirms, you can visit the <a href="https://kovan.explorer.chain.link/" target="_blank" rel="noreferrer, noopener">Kovan Chainlink Explorer</a> in order to view the status of your request. Search for either the address of your contract or your requesting transaction ID and you should see an update from the Chainlink node. You can refresh the page to keep up-to-date with the status, and when the response is confirmed, you can view the result in your contract.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/d28ea86-Screen_Shot_2020-09-08_at_9.22.21_AM.png",
        "Screen Shot 2020-09-08 at 9.22.21 AM.png",
        1570,
        964,
        "#393c48"
      ],
      "sizing": "80"
    }
  ]
}
[/block]
* To verify that your request was fulfilled, click on the blue `currentPrice` button. If the value after `uint256` displays `0` then the request has not be fulfilled yet. Wait a little longer since the Chainlink node will wait for 3 block confirmations before fulfilling your request. Otherwise, it will show you the current price of ETH multiplied by 100. This weird looking output is by design, as the ETH protocol cannot display decimal values. In our example, the `currentPrice` returned `33495` which represents $334.95 USD.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/d24f0f2-remix.png",
        "remix.png",
        454,
        116,
        "#37445a"
      ],
      "sizing": "smart"
    }
  ]
}
[/block]
If you see a value for the `currentPrice` variable, then Chainlink has successfully responded to your contract with the current price of ETH. Now you're ready to write more complex smart contracts that execute based on real-world data.