---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Acquire testnet LINK'
permalink: 'docs/acquire-link/'
whatsnext: { 'Deploy your first contract': '/docs/deploy-your-first-contract/' }
---

The Getting Started guides show you how to send ETH on the Goerli testnet, but some contracts might require you to use LINK token instead. This page shows you how to obtain testnet LINK and send it to your MetaMask wallet.

## Configure MetaMask to use LINK tokens

To see your LINK token balance in MetaMask, you must manually add the token.

1. Open up MetaMask.
1. At the bottom of the MetaMask windows, click **Import tokens**.
1. Find the LINK token contract address for the network that you want to use. On Goerli the LINK token address is: `0x326C977E6efc84E512bB9C30f76E30c160eD06FB`. See the [LINK Token Contracts](/docs/link-token-contracts/) page to find addresses for different testnets.
1. Paste the token contract address into MetaMask in the Token Address input. The token symbol and decimals of precision will auto-populate.
   ![Metamask Custom Tokens Screen](/images/getting-started/metamaskImportTokens.webp)
1. Click **Next**. A new window will appears, showing the LINK token details.
1. Click **Import Tokens** to confirm adding the new token.

MetaMask should now display the new LINK token balance.

## Get testnet LINK from a faucet

1. Go to [https://faucets.chain.link/](https://faucets.chain.link/).
1. In Metmask, select the network where you want to receive testnet LINK.
1. Click **Connect wallet** so the faucet app can detect the network and wallet address.
1. If you want to receive testnet funds at a different address, paste it in the **Wallet address** section. This field defaults to your connected wallet address.
1. In the **Request type** section, select the testnet funds that you want to receive.
1. Complete the Captcha and click **Send request**. The funds are transferred from the faucet to the wallet address that you specified.

After the transaction is confirmed on-chain, the faucet app shows "Request complete" and the transaction hash of your request.

![Successful Faucet Request Message](/files/faucet-success.png)
