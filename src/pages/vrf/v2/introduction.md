---
layout: ../../../layouts/MainLayout.astro
section: vrf
date: Last Modified
title: "Introduction to Chainlink VRF"
permalink: "docs/vrf/v2/introduction/"
whatsnext: { "Subscription Method": "/vrf/v2/subscription/", "Direct Funding Method": "/vrf/v2/direct-funding/" }
metadata:
  title: "Generate Random Numbers for Smart Contracts using Chainlink VRF"
  description: "Learn how to securely generate random numbers for your smart contract with Chainlink VRF (an RNG). This guide uses Solidity code examples."
setup: |
  import VrfCommon from "@features/vrf/v2/common/VrfCommon.astro"
  import { Aside } from "@components"
---

<Aside type="note" title="Talk to an expert">
  <a href="https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-vrf">Contact us</a> to talk to an expert about using Chainlink VRF with your applications.
</Aside>

**Chainlink VRF (Verifiable Random Function)** is a provably fair and verifiable random number generator (RNG) that enables smart contracts to access random values without compromising security or usability. For each request, Chainlink VRF generates one or more random values and cryptographic proof of how those values were determined. The proof is published and verified on-chain before any consuming applications can use it. This process ensures that results cannot be tampered with or manipulated by any single entity including oracle operators, miners, users, or smart contract developers.

<VrfCommon callout="common"/>

Use Chainlink VRF to build reliable smart contracts for any applications that rely on unpredictable outcomes:

- Building blockchain games and NFTs.
- Random assignment of duties and resources. For example, randomly assigning judges to cases.
- Choosing a representative sample for consensus mechanisms.

To learn more about the benefits of Chainlink VRF v2, see our blog post [Chainlink VRF v2 Is Now Live on Mainnet](https://blog.chain.link/vrf-v2-mainnet-launch/). For help with your specific use case, [contact us](https://chainlinkcommunity.typeform.com/to/OYQO67EF?page=docs-footer) to connect with one of our Solutions Architects. You can also ask questions about Chainlink VRF on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=chainlink).

## Two methods to request randomness

Chainlink VRF v2 offers two methods for requesting randomness:

- [Subscription](/vrf/v2/subscription/): Create a subscription account and fund its balance with LINK tokens. Users can then connect multiple consuming contracts to the subscription account. When the consuming contracts request randomness, the transaction costs are calculated after the randomness requests are fulfilled and the subscription balance is deducted accordingly. This method allows you to fund requests for multiple consumer contracts from a single subscription.
- [Direct funding](/vrf/v2/direct-funding/): Consuming contracts directly pay with LINK when they request random values. You must directly fund your consumer contracts and ensure that there are enough LINK tokens to pay for randomness requests.

## Choosing the correct method

Depending on your use case, one method might be more suitable than another. Consider the following characteristics when you choose a method:

<!-- prettier-ignore -->
| [Subscription method](/vrf/v2/subscription/)      | [Direct funding method](/vrf/v2/direct-funding/)  |
| ------------------------------------------------- | --------------------------------------------------|
| Suitable for regular requests                     | Suitable for infrequent one-off requests          |
| Supports multiple VRF consuming contracts connected to one subscription account  | Each VRF consuming contract directly pays for its requests |
| VRF costs are calculated after requests are fulfilled and then deducted from the subscription balance. Learn [how VRF costs are calculated for the subscription method](/vrf/v2/subscription/). | VRF costs are estimated and charged at request time, which may make it easier to transfer the cost of VRF to the end user. Learn [how VRF costs are calculated for the direct funding method](/vrf/v2/direct-funding/).  |
| Reduced gas overhead and more control over the maximum gas price for requests | Higher gas overhead than the subscription method |
| More random values returned per single request. See the maximum random values per request for the [Subscription supported networks](/vrf/v2/subscription/supported-networks/#configurations).   | Fewer random values returned per single request than the subscription method, due to higher overhead. See the maximum random values per request and gas overhead for the [Direct funding supported networks](/vrf/v2/direct-funding/supported-networks/#configurations). |
| You don't have to estimate costs precisely for each request. Ensure that the subscription account has enough funds.  | You must estimate transaction costs carefully for each request to ensure the consuming contract has enough funds to pay for the request. |
| Requires a subscription account                     | No subscription account required |
| VRF costs are billed to your subscription account. [Manage and monitor your balance](/vrf/v2/subscription/ui) | No refunds for overpayment after requests are completed |
| Flexible funding method first introduced in VRF v2. [Compare the VRF v2 subscription method to VRF v1](/vrf/v2/subscription/migration-from-v1/). | Similar funding method to VRF v1, with the benefit of receiving more random values per request than VRF v1. [Compare direct funding in VRF v2 and v1](/vrf/v2/direct-funding/migration-from-v1/). |

## Supported networks

The contract addresses and gas price limits are different depending on which method you use to get randomness. You can find the configuration, addresses, and limits for each method on the following pages:

- [Subscription Supported networks](/vrf/v2/subscription/supported-networks/)
- [Direct Funding Supported networks](/vrf/v2/direct-funding/supported-networks/)

To learn when VRF v2 becomes available on more networks, follow us on [Twitter](https://twitter.com/chainlink) or sign up for our [mailing list](/resources/developer-communications/).
