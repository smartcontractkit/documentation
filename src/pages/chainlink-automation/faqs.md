---
layout: ../../layouts/MainLayout.astro
section: automation
date: Last Modified
title: "Frequently Asked Questions"
---

## Will Chainlink Automation work for my use case?

For help with your specific use case, [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-keepers) to connect with one of our Solutions Architects. You can also ask questions about Chainlink Automation on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink) or the [#automation channel](https://discord.com/channels/592041321326182401/821350860302581771) in our [Discord server](https://discord.gg/qj9qarT). [Utility contracts](/chainlink-automation/utility-contracts) can also help you get started quickly.

## I registered my upkeep successfully, but I can’t see it. How can I find my upkeeps?

Open the [Chainlink Automation app](https://automation.chain.link/) and ensure your wallet is connected. Also ensure that the wallet is set to use the network where you registered the Upkeep. Your Upkeep should be under the My Upkeeps tab.

## Is the Chainlink Automation Network available on platforms other than Ethereum?

Chainlink Automation is available on the networks listed in the [Supported Blockchain Networks](/chainlink-automation/supported-networks) page. To see when we integrate with other platforms, [follow us on Twitter](https://twitter.com/chainlink) or [join our community on Discord](https://discord.com/channels/592041321326182401/821350860302581771).

## How much does it cost to use Chainlink Automation?

See the [Automation Economics](/chainlink-automation/automation-economics) page to learn more about the cost of using Chainlink Automation.

## How do I determine the Gas Limit for my Upkeep?

The **Gas Limit** specified during Upkeep Registration is the maximum amount of gas that will be used to execute your function on-chain. We simulate `performUpkeep` and if the gas exceeds this limit the function will not execute on-chain. One method to determine your Upkeep's Gas Limit is to simulate the `performUpkeep` function and add enough overhead to take into account increases that might happen due to changes in `performData` or on-chain data.

## What is the maximum Gas that my `checkUpkeep` can use?

`checkUpkeep` is subject to the `checkGasLimit` in the [configuration of the registry](/chainlink-automation/supported-networks/#configurations).

## What is the maximum Gas that my `performUpkeep` can use?

`performUpkeep` is subject to the `callGasLimit` in the [configuration of the registry](/chainlink-automation/supported-networks/#configurations).

## How often will my Upkeep be checked off-chain to see if it should be executed on-chain?

See [How it works](/chainlink-automation/overview/#how-it-works).

## How long will it take for my `performUpkeep` to be executed once it has been broadcasted on-chain?

This depends on the network congestion, the amount of gas used by the `performUpkeep`, and the gas price specified when the transaction is broadcasted. See the [Price Selection and Gas Bumping](/chainlink-automation/automation-economics/#price-selection-and-gas-bumping) documentation to learn about optimizing the chances of executing your `performUpkeep` function.

## Which contract will call my `performUpkeep` function on-chain?

The **Automation Registry** will call the `performUpkeep` function on-chain.

## Will the address of the Automation Registry always stay the same?

No. As we add new functionality we have to upgrade our contract and deploy a new **Automation Registry**. We will work with all our users to ensure Upkeeps are migrated without causing business interruptions.

## Can I require that `performUpkeep` is only callable by the `Automation Registry`?

Our preferred and recommended route before locking access to `performUpkeep`is [revalidation](/chainlink-automation/compatible-contracts/#revalidate-performupkeep). We understand you might want to add a require statement, but then recommend that you make the **Automation Registry** address configurable otherwise you will need to deploy a new contract when the Registry address changes. If you add a require statement to `performUpkeep` you will have to update the Registry Address in your contract when the Registry Address changes. We also recommend that the `owner` can always call `performUpkeep`.

## What gas price does Automation Node use to trigger the function?

See the [Price Selection and Gas Bumping](/chainlink-automation/automation-economics/#price-selection-and-gas-bumping) section to learn about the gas price used to trigger the function.

## How do you prevent Automation Nodes from racing against each other and escalating execution costs?

See [How it works](/chainlink-automation/overview/#how-it-works).

## How is the Upkeep minimum balance determined?

See [Minimum balance](/chainlink-automation/automation-economics/#minimum-balance).

## How do I fund my Upkeep?

See [Fund your Upkeep](/chainlink-automation/manage-upkeeps/#fund-your-upkeep).

## How do I withdraw funds?

See [Withdraw funds](/chainlink-automation/manage-upkeeps/#withdraw-funds).

## My Upkeep stopped performing. How can I debug it?

The simplest way to test your function is to call it yourself and see if it executes. To do so, deploy the contract to a testnet and debug the function. If you can call the function successfully, then Chainlink Automation will also be able to call it. If your function is working, but the Upkeep is not executing, your Upkeep might be underfunded. See the [Fund your Upkeep](/chainlink-automation/manage-upkeeps/#fund-your-upkeep) section to learn how to fund your Upkeep.

## How do I join the Chainlink Automation Network as a node operator?

We are not accepting new Automation Nodes at this time, but be sure to sign up for our [mailing list](/resources/developer-communications/), or join our [Discord server](https://discord.gg/qj9qarT) to be notified when this becomes available.

## Why won't the Chainlink Automation App recognize the LINK in my wallet?

For registration on Mainnet, you need ERC-677 LINK. Many token bridges give you ERC-20 LINK tokens. Use PegSwap to [convert Chainlink tokens (LINK) to be ERC-677 compatible](https://pegswap.chain.link/). To register on a supported testnet, get [LINK](/resources/link-token-contracts/) for the testnet that you want to use from our faucet.
