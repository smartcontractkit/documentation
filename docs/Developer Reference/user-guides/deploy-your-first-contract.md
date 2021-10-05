---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Deploy your first contract"
permalink: "docs/deploy-your-first-contract/"
whatsnext: {"Fund your contract":"/docs/fund-your-contract/"}
---

<p>
  https://www.youtube.com/watch?v=JWJWT9cwFbo
</p>

## Introducing Remix

Remix is a web IDE (integrated development environment) for creating, running, and debugging smart contracts in the browser. It is developed and maintained by the Ethereum foundation. Remix allows Solidity developers to write smart contracts without a development machine since everything required is included in the web interface. It allows for a simplified method of interacting with deployed contracts, without the need for a command line interface.

## Create and deploy your first contract

* Navigate to Remix: <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/APIRequests/ATestnetConsumer.sol" target="_blank" rel="noreferrer, noopener">https://remix.ethereum.org</a>

* Remix opens up with an empty interface, or possible with a default contract

![Remix Welcome Screen](/files/8dbedba-Screen_Shot_2020-09-08_at_7.05.27_AM.png)

* If you open remix for the first time, you should chose the **Environments** to **Solidity**

![Remix Choose Solidity Environment](/files/7c7f098-remix.jpg)

* Click the **gist** label on the left side menu and click on ATestnetConsumer.sol

![Remix Open File Explorer](/files/50b7476-remix.png)

* Click the `Solidity Compiler` button in the left side bar, it will show compile tab page.

![Remix Choose Solidity Compiler](/files/429ae12-remix.png)

* Click `Compile ATestnetConsumer.sol` button in the upper left-hand of Remix.

![Remix Click Compile](/files/b8774fe-Screen_Shot_2020-09-08_at_7.10.07_AM.png)

> 🚧
>
> If you get errors after compiling, make sure your compiler is set to one of the **0.6.0** compilers. If you used the link to Remix within this guide above, this would have been set for you.

* Now select the `Deploy & run transactions` tab in the left-hand of Remix.
* Change your Environment to `Injected Web3` (if it is not already set) then click on `Deploy`.

![Remix Deploy a Contract](/files/d5708a0-remix.png)

* MetaMask will pop-up to confirm the transaction. Click on Confirm.

![Metamask Confirm a Transaction Screen](/files/d082799-metamask.png)

> 🚧 Metamask doesn't pop up?
>
> If Metamask does not prompt you and instead displays the error below, you will need to disable "Privacy Mode" in Metamask. You can do this by clicking on your unique account icon at the top-right, then go to the Settings. Privacy Mode will be a switch near the bottom. The error: **Send transaction failed: invalid address. If you use an injected provider, please check it is properly unlocked.**

* A transaction link will be displayed at the bottom of Remix that displays deployment status.
It will take a few moments for the contract to be deployed. The Remix UI will update upon completion.

![Remix Transaction Confirmation Message](/files/8ff4abe-remix7.jpg)

* On the left side panel there is a section that displays the title of the contract (example `ATestnetConsumer at 0x123...890 (blockchain)`).

![Remix Deployed Contracts](/files/64722ed-remix8.jpg)

* You can click on it to interact with your contract.

![Remix Contract Interaction Screen](/files/85c4ddb-remix.png)

* You can't do anything to this contract except read its state until you send LINK to it.
