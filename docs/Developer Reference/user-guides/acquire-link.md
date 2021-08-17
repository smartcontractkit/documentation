---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Acquire testnet LINK"
permalink: "docs/acquire-link/"
whatsnext: {"Deploy your first contract":"/docs/deploy-your-first-contract/"}
---
This page will show you how to obtain and add testnet LINK to MetaMask. If you already have testnet LINK, skip to [Deploy your first contract](../deploy-your-first-contract/).

# Testnet LINK Faucet

* Navigate to the Chainlink Kovan Faucet site: <a href="https://kovan.chain.link/" target="_blank" rel="noreferrer, noopener">https://kovan.chain.link</a>

> 👍 Note
> 
> You can also get testnet LINK from: [Rinkeby](https://rinkeby.chain.link/)

![Link Kovan Faucet](/files/42e03a2-faucet.png)

* Open up MetaMask, click the Wallet account name at the top to copy the address to your clipboard.
* Paste that address into the Chainlink Kovan Faucet address input field, solve the captcha, and click on `Send me 100 Test LINK` button.
* You should see a green banner show up with the text: Your request was successful! View your transaction here.

![Successful Faucet Request Message](/files/fcf1ffe-Screenshot_from_2018-11-28_10-57-26.png)

* In order to see your LINK token balance in MetaMask, you will need to add the token.
* In MetaMask click the hamburger button, and click on `Add Token` and then `Custom Token`.
* On Kovan our LINK token address is: `0xa36085F69e2889c224210F603D836748e7dC0088`. Copy that address.

```text Kovan LINK Token
0xa36085F69e2889c224210F603D836748e7dC0088
```
```text Rinkeby LINK Token
0x01BE23585060835E02B77ef475b0Cc51aA1e0709
```

* Paste the token contract address into MetaMask in the Token Address input. The token symbol and decimals of precision will auto-populate. Click Next.

![Metamask Custom Tokens Screen](/files/7d69188-metamask.png)

* A new window will appear, showing the LINK token details. Click Add Tokens.

![Metamask Adding a Link Token Screen](/files/d30579b-metamask.png)

* MetaMask should now display the new LINK balance.