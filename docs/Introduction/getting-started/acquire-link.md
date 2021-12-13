---
layout: nodes.liquid
section: gettingStarted
date: Last Modified
title: "Acquire testnet LINK"
permalink: "docs/acquire-link/"
whatsnext: {"Deploy your first contract":"/docs/deploy-your-first-contract/"}
---

The Getting Started guides show you how to send ETH on the Kovan testnet, but some contracts might require you to use LINK token instead. This page shows you how to obtain testnet LINK and send it to your MetaMask wallet.


## Configure MetaMask to use LINK tokens

To see your LINK token balance in MetaMask, you must manually add the token.

1. Open up MetaMask.
1. At the bottom of the MetaMask windows, click **Import tokens**.
1. Find the LINK token contract address for the network that you want to use. On Kovan our LINK token address is: `0xa36085F69e2889c224210F603D836748e7dC0088`. See the [LINK Token Contracts](/docs/link-token-contracts/) page to find addresses for different testnets.
1. Paste the token contract address into MetaMask in the Token Address input. The token symbol and decimals of precision will auto-populate.
    ![Metamask Custom Tokens Screen](/images/getting-started/metamaskImportTokens.png)
1. Click **Next**. A new window will appears, showing the LINK token details.
1. Click **Import Tokens** to confirm adding the new token.

MetaMask should now display the new LINK token balance.

## Get testnet LINK from a faucet

1. Go to [https://faucets.chain.link/](https://faucets.chain.link/).
1. Select the network where you want to receive testnet LINK.
    ![Link Kovan Faucet](/files/faucet.png)
1. Open up MetaMask.
1. Click the wallet account name at the top to copy your wallet address to your clipboard.
1. Paste that address into the Chainlink Faucet address input field, solve the captcha, and click the **Send request** button.

After you send the request, a modal shows up to track the progress of the transaction. After the transaction is confirmed on-chain, the modal shows "Request complete" and the transaction hash of your request.

![Successful Faucet Request Message](/files/faucet-success.png)
