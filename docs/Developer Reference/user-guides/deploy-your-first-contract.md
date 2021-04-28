---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Deploy your first contract"
permalink: "docs/deploy-your-first-contract/"
whatsnext: {"Fund your contract":"/docs/fund-your-contract/"}
hidden: false
---

<p>
  https://www.youtube.com/watch?v=JWJWT9cwFbo
</p>

[block:api-header]
{
  "title": "Introducing Remix"
}
[/block]
Remix is a web IDE (integrated development environment) for creating, running, and debugging smart contracts in the browser. It is developed and maintained by the Ethereum foundation. Remix allows Solidity developers to write smart contracts without a development machine since everything required is included in the web interface. It allows for a simplified method of interacting with deployed contracts, without the need for a command line interface.
[block:api-header]
{
  "title": "Create and deploy your first contract."
}
[/block]
* Navigate to Remix: <a href="https://remix.ethereum.org/#version=soljson-v0.6.0+commit.26b70077.js&optimize=false&gist=9b71e0718d0ad3f2f9a6b2e4018cac82&evmVersion=null" target="_blank" rel="noreferrer, noopener">https://remix.ethereum.org</a>
* Remix opens up with an empty interface, or possible with a default contract
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8dbedba-Screen_Shot_2020-09-08_at_7.05.27_AM.png",
        "Screen Shot 2020-09-08 at 7.05.27 AM.png",
        2604,
        1268,
        "#2b2f43"
      ]
    }
  ]
}
[/block]
* If you open remix for the first time, you should chose the **Environments** to **Solidity**
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/7c7f098-remix.jpg",
        "remix.jpg",
        907,
        634,
        "#f5f6f7"
      ],
      "border": true
    }
  ]
}
[/block]
* Click the **gist** label on the left side menu and click on ATestnetConsumer.sol
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/50b7476-remix.png",
        "remix.png",
        454,
        264,
        "#282a3c"
      ]
    }
  ]
}
[/block]
* Click the `Solidity Compiler` button in the left side bar, it will show compile tab page.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/429ae12-remix.png",
        "remix.png",
        454,
        350,
        "#2d2f40"
      ]
    }
  ]
}
[/block]
* Click `Compile ATestnetConsumer.sol` button in the upper left-hand of Remix.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b8774fe-Screen_Shot_2020-09-08_at_7.10.07_AM.png",
        "Screen Shot 2020-09-08 at 7.10.07 AM.png",
        2578,
        1248,
        "#2b2d3f"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "If you get errors after compiling, make sure your compiler is set to one of the **0.6.0** compilers. If you used the link to Remix within this guide above, this would have been set for you."
}
[/block]
* Now select the `Deploy & run transactions` tab in the left-hand of Remix.
* Change your Environment to `Injected Web3` (if it is not already set) then click on `Deploy`.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d5708a0-remix.png",
        "remix.png",
        340,
        446,
        "#343a41"
      ]
    }
  ]
}
[/block]
* MetaMask will pop-up to confirm the transaction. Click on Confirm.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/d082799-metamask.png",
        "metamask.png",
        340,
        597,
        "#eaedf0"
      ]
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "If Metamask does not prompt you and instead displays the error below, you will need to disable \"Privacy Mode\" in Metamask. You can do this by clicking on your unique account icon at the top-right, then go to the Settings. Privacy Mode will be a switch near the bottom.\n&nbsp;\nThe error:\n> **Send transaction failed: invalid address . if you use an injected provider, please check it is properly unlocked.**",
  "title": "Metamask doesn't pop up?"
}
[/block]
* A transaction link will be displayed at the bottom of Remix that displays deployment status. 
It will take a few moments for the contract to be deployed. The Remix UI will update upon completion.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/8ff4abe-remix7.jpg",
        "remix7.jpg",
        1480,
        184,
        "#e8eaef"
      ]
    }
  ]
}
[/block]
* On the left side panel there is a section that displays the title of the contract (example `ATestnetConsumer at 0x123...890 (blockchain)`). 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/64722ed-remix8.jpg",
        "remix8.jpg",
        892,
        226,
        "#f4f5f9"
      ]
    }
  ]
}
[/block]
* You can click on it to interact with your contract.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/85c4ddb-remix.png",
        "remix.png",
        283,
        650,
        "#3f3c48"
      ],
      "caption": "Orange labels are buttons which indicate the calling function will cost gas. Blue labels are buttons which simply read the state of the contract, and do not cost gas to call."
    }
  ]
}
[/block]
* You can't do anything to this contract except read its state until you send LINK to it.