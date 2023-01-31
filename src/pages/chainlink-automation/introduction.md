---
layout: ../../layouts/MainLayout.astro
section: ethereum
date: Last Modified
title: "Chainlink Automation Documentation"
whatsnext:
  {
    "Register a time-based Upkeep": "/chainlink-automation/job-scheduler/",
    "Register a Custom Logic Upkeep": "/chainlink-automation/register-upkeep/",
    "Create an compatible contract for custom logic upkeep": "/chainlink-automation/compatible-contracts/",
    "Automation architecture": "/chainlink-automation/overview/",
    "Automation economics": "/chainlink-automation/automation-economics/",
  }
setup: |
  import { Aside } from "@components"
---


 **Chainlink Automation** provides reliable, performant, and easy-to-use automation for your smart contracts. Chainlink Automation will help you get to market faster and make scaling easier. Leverage the decentralized Automation network today and take your dApp to the next level.


![Chainlink Automation](/images/contract-devs/automation/automation_intro.gif)

## Quick start
Use the Chainlink Automation app to create and manage your upkeeps. Consider the following before you start:

- Is your [network supported](/chainlink-automation/supported-networks/)?
- Can your function be called by external parties and if not, have you given permission to our registry? You can find the latest address in the app.
- What trigger should execute your function? Currently, we support time-based triggers or custom logic triggers. Custom logic triggers requires that you to create an Automation-compatible contract.
- Are the inputs to your function static or dynamic. If they are dynamic you will need to create an Automation-compatible contract.


Depending on how you answered these questions, you may want create a [time-based trigger](/chainlink-automation/job-scheduler/) upkeep. Alternatively if you want to dive in and learn how to write an Automation-compatible contract, see our [counter example] on or write your own [Automation-compatible](/chainlink-automation/compatible-contracts/) contract for a custom logic upkeep. 
For more advanced Automation examples, such as dynamic NFTs where we combined multiple Chainlink Labs services, refer to [Other Tutorials](/getting-started/other-tutorials/).


## Funding

For the Automation network to service your upkeeps, you will need to fund them with ERC-677 LINK in the app or via the registry. Do **NOT** send LINK to your contract.See the [LINK token contracts](/resources/link-token-contracts/) page to determine where to acquire ERC-677 LINK on your network. For testnet LINK use [faucets.chain.link](https://faucets.chain.link/). View the [Automation Economics](/chainlink-automation/automation-economics) page to learn more about the cost of using Chainlink Automation.


## Questions and examples

If you have questions, read the [Chainlink Automation Frequently Asked Questions](/chainlink-automation/faqs/) page, ask them in the [#automation channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT), or [talk to an expert](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-automation).

