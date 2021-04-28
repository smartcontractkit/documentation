---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Acquire testnet LINK"
permalink: "docs/acquire-link/"
whatsnext: {"Deploy your first contract":"/docs/deploy-your-first-contract/"}
hidden: false
---
This page will show you how to obtain and add testnet LINK to MetaMask. If you already have testnet LINK, skip to [Deploy your first contract](../deploy-your-first-contract/).

# Testnet LINK Faucet

* Navigate to the Chainlink Kovan Faucet site: <a href="https://kovan.chain.link/" target="_blank" rel="noreferrer, noopener">https://kovan.chain.link</a>
[block:callout]
{
  "type": "success",
  "body": "You can also get testnet LINK from Rinkeby:\n[Rinkeby](https://rinkeby.chain.link/)"
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/42e03a2-faucet.png",
        "faucet.png",
        510,
        493,
        "#dadbed"
      ],
      "sizing": "smart"
    }
  ]
}
[/block]
* Open up MetaMask, click the Wallet account name at the top to copy the address to your clipboard.
* Paste that address into the Chainlink Kovan Faucet address input field, solve the captcha, and click on `Send me 100 Test LINK` button.
* You should see a green banner show up with the text: Your request was successful! View your transaction here.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/fcf1ffe-Screenshot_from_2018-11-28_10-57-26.png",
        "Screenshot from 2018-11-28 10-57-26.png",
        482,
        53,
        "#0ecb5c"
      ]
    }
  ]
}
[/block]
* In order to see your LINK token balance in MetaMask, you will need to add the token.
* In MetaMask click the hamburger button, and click on `Add Token` and then `Custom Token`.
* On Kovan our LINK token address is: `0xa36085F69e2889c224210F603D836748e7dC0088`. Copy that address.
[block:code]
{
  "codes": [
    {
      "code": "0xa36085F69e2889c224210F603D836748e7dC0088",
      "language": "text",
      "name": "Kovan LINK Token"
    },
    {
      "code": "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
      "language": "text",
      "name": "Rinkeby LINK Token"
    }
  ]
}
[/block]
* Paste the token contract address into MetaMask in the Token Address input. The token symbol and decimals of precision will auto-populate. Click Next.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7d69188-metamask.png",
        "metamask.png",
        340,
        577,
        "#f5f5f5"
      ],
      "border": true
    }
  ]
}
[/block]
* A new window will appear, showing the LINK token details. Click Add Tokens.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d30579b-metamask.png",
        "metamask.png",
        283,
        397,
        "#fafafb"
      ],
      "border": true
    }
  ]
}
[/block]
* MetaMask should now display the new LINK balance.