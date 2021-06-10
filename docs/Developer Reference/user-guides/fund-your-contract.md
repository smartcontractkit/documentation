---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Fund your contract"
permalink: "docs/fund-your-contract/"
whatsnext: {"Use your first contract!":"/docs/use-your-first-contract/"}
---
This guide explains how to fund your Solidity contract with LINK using the Remix IDE.

# Retrieveing the contract address 

* Deploy your contract and wait until you see a new contract in the `Deployed Contracts` section.
* Copy the contract address to your clipboard using the copy icon located near the contract title on the left side panel.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/25d2c8e-Screen_Shot_2020-09-08_at_7.15.50_AM.png",
        "Screen Shot 2020-09-08 at 7.15.50 AM.png",
        2596,
        1550,
        "#2c2e3e"
      ]
    }
  ]
}
[/block]
# Sending LINK

* Open MetaMask; click the hamburger (☰) button at the top-left corner.
* Click on the LINK token, then press `Next`.
* Paste your contract's address in the recipient field and enter a value for the amount to send (e.g. 10 LINK).
* Click `Confirm` and wait until the transaction is processed.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/867073d-metamask.png",
        "metamask.png",
        340,
        577,
        "#eef1f4"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "You may need to click **Fastest**, **Fast**, **Slow**, or **Advanced Options** after entering the **Amount** to update the gas limit for the token transfer to be successful.",
  "title": "Transaction fee didn't update?"
}
[/block]