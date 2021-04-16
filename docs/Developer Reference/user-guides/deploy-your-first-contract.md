---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Deploy your first contract"
permalink: "docs/deploy-your-first-contract/"
hidden: false
---
[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FJWJWT9cwFbo%3Ffeature%3Doembed&display_name=YouTube&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DJWJWT9cwFbo&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FJWJWT9cwFbo%2Fhqdefault.jpg&key=f2aa6fc3595946d0afc3d76cbbd25dc3&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" title=\"YouTube embed\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
  "url": "https://www.youtube.com/watch?v=JWJWT9cwFbo&feature=youtu.be",
  "title": "Intro to Remix & Solidity, deploy your first Smart Contract - Chainlink Engineering Tutorials",
  "favicon": "https://www.youtube.com/s/desktop/d750d05d/img/favicon.ico",
  "image": "https://i.ytimg.com/vi/JWJWT9cwFbo/hqdefault.jpg"
}
[/block]

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