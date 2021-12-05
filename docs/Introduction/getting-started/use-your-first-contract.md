---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Use your first contract!"
permalink: "docs/use-your-first-contract/"
whatsnext: {"Introduction to Data Feeds":"/docs/using-chainlink-reference-contracts/", "Introduction to Chainlink VRF":"/docs/chainlink-vrf/", "Introduction to Using Any API":"/docs/request-and-receive-data/"}
---
# Executing Functions

* Navigate back to Remix.
* On the left side panel you will see a list of functions of your contract.

![Remix Functions List](/files/ad5784b-remix.png)

* In our example contract there are 3 functions that you can use to request external data from Chainlink. `requestEthereumChange`, `requestEthereumLastMarket` and `requestEthereumPrice`
* For this example we will use `requestEthereumPrice`.
* In the input field to the right of `requestEthereumPrice`, copy the text below to request the price of ETH in United States Dollars. The first parameter is the oracle contract address, and the second parameter is the Job ID. You will need to include the quotes.

```text requestEthereumPrice
"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e", "29fa9aa13bf1468788b7cc4a500a45b8
```
```text requestEthereumChange
"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e","ad752d90098243f8a5c91059d3e5616c"
```
```text requestEthereumLastMarket
"0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e","50fc4215f89443d185b061e5d7af9490"
```

* Click on the `requestEthereumPrice` button.

![Remix Click requestEthereumPrice](/files/332bb9c-Screen_Shot_2020-09-08_at_9.21.52_AM.png)

* MetaMask will pop-up to confirm the transaction, click Confirm. (If you get a gas estimation failed message here, make sure the contract is [funded with LINK](../fund-your-contract/)./)

![Metamask Transaction Confirmation Message](/files/e00834f-metamask.png)

* The transaction confirmation will take some time. When the response is confirmed, you can view the result in your contract.

![Remix Click currentPrice](/files/d28ea86-Screen_Shot_2020-09-08_at_9.22.21_AM.png)

* To verify that your request was fulfilled, click on the blue `currentPrice` button. If the value after `uint256` displays `0` then the request has not be fulfilled yet. Wait a little longer since the Chainlink node will wait for 3 block confirmations before fulfilling your request. Otherwise, it will show you the current price of ETH multiplied by 100. This weird looking output is by design, as the ETH protocol cannot display decimal values. In our example, the `currentPrice` returned `33495` which represents $334.95 USD.

![Remix Price Result Message](/files/d24f0f2-remix.png)

If you see a value for the `currentPrice` variable, then Chainlink has successfully responded to your contract with the current price of ETH. Now you're ready to write more complex smart contracts that execute based on real-world data.
