---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Acquire testnet LINK"
permalink: "docs/acquire-link/"
whatsnext: {"Deploy your first contract":"/docs/deploy-your-first-contract/"}
---
This page will show you how to obtain and add testnet LINK to MetaMask. If you already have testnet LINK, skip to [Deploy your first contract](../deploy-your-first-contract/).

# Testnet LINK Faucet

* Go to the Chainlink Kovan Faucet site: https://faucets.chain.link/kovan

> 👍 Note
>
> You can also get testnet LINK on other test networks, such as Rinkeby, from https://faucets.chain.link/rinkeby.

![Link Kovan Faucet](/files/faucet.png)

* Open up MetaMask, click the Wallet account name at the top to copy the address to your clipboard.
* Paste that address into the Chainlink Kovan Faucet address input field, solve the captcha, and click the `Send request` button.
* You should see a modal show up with the text 'Transaction in progress'.
* Once the transaction is confirmed on-chain, the modal will show 'Request complete', along with the transaction hash of your request.


![Successful Faucet Request Message](/files/faucet-success.png)

* In order to see your LINK token balance in MetaMask, you will need to add the token.
* In MetaMask click the hamburger button, and click on `Add Token` and then `Custom Token`.
* On Kovan our LINK token address is: `0xa36085F69e2889c224210F603D836748e7dC0088`. Copy that address. If you need the address for a different testnet, see the [LINK Token Contracts](/docs/link-token-contracts/) page.
* Paste the token contract address into MetaMask in the Token Address input. The token symbol and decimals of precision will auto-populate. Click Next.

![Metamask Custom Tokens Screen](/files/7d69188-metamask.png)

* A new window will appear, showing the LINK token details. Click Add Tokens.

![Metamask Adding a Link Token Screen](/files/d30579b-metamask.png)

* MetaMask should now display the new LINK balance.
