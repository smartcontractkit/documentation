---
layout: nodes.liquid
section: legacy
date: Last Modified
title: "VRF Security Considerations [v1]"
permalink: "docs/vrf-security-considerations/v1/"
---

> 🚧 VRF v2 replaces and enhances VRF v1.
>
> See the [VRF v2 documentation](/docs/vrf-security-considerations/) to learn more.

Gaining access to high quality randomness on-chain requires a solution like Chainlink's VRF, but it also requires you to understand some of the ways that randonmess generation can be manipulated by miners/validators. Here are some of the top security considerations you should review in your project.

* [Use `requestId` to match randomness requests with their fulfillment in order](#use-requestid-to-match-randomness-requests-with-their-fulfillment-in-order)
* [Choose a safe block confirmation time, which will vary between blockchains](#choose-a-safe-block-confirmation-time-which-will-vary-between-blockchains)
* [Do not re-request randomness, even if you don't get an answer right away](#do-not-re-request-randomness-even-if-you-dont-get-an-answer-right-away)
* [Don't accept bids/bets/inputs after you have made a randomness request](#dont-accept-bidsbetsinputs-after-you-have-made-a-randomness-request)
* [`fulfillRandomness` must not revert](#fulfillrandomness-must-not-revert)
* [Use `VRFConsumerBase` in your contract, to interact with the VRF service](#use-vrfconsumerbase-in-your-contract-to-interact-with-the-vrf-service)

## Use `requestId` to match randomness requests with their fulfillment in order

If your contract could have multiple VRF requests in flight simultaneously, you must ensure that the order in which the VRF fulfillments arrive cannot be used to manipulate your contract's user-significant behavior.

Blockchain miners/validators can control the order in which your requests appear on-chain, and hence the order in which your contract responds to them.

For example, if you made randomness requests `A`, `B`, `C` in short succession, there is no guarantee that the associated randomness fulfillments will also be in order `A`, `B`, `C`. The randomness fulfillments might just as well arrive at your contract in order `C`, `A`, `B` or any other order.

We recommend using the `requestID` to match randomness requests with their corresponding fulfillments.

## Choose a safe block confirmation time, which will vary between blockchains

> ⚠️Customizing block confirmation time
> [Reach out to customize your VRF block confirmation time](https://chainlinkcommunity.typeform.com/to/OYQO67EF) as this configuration must be done on the node side, and cannot be configured as part of a VRF request.

In principle, miners and validators of your underlying blockchain could rewrite the chain's history to put a randomness request from your contract into a different block, which would result in a different VRF output. Note that this does not enable a miner to determine the random value in advance. It only enables them to get a fresh random value that may or not be to their advantage. By way of analogy, they can only re-roll the dice, not predetermine or predict which side it will land on.

You must choose an appropriate confirmation time for the randomness requests you make (i.e. how many blocks the the VRF service waits before writing a fulfillment to the chain) to make such rewrite attacks unprofitable in the context of your application and its value-at-risk.

On Ethereum, such rewrites are very expensive due to the very high rate of work performed by Ethereum's proof-of-work: the hashrate of the Ethereum network is currently 630 trillion hashes per second, and any attacker would have to control at least 51% of that for the duration of the attack. Therefore, major centralized exchanges consider a __20-block confirmation time__ as highly secure for deposit confirmation times. The block confirmation time required from one use case to the next may differ.

On proof-of-stake blockchains (e.g. BSC, Polygon), what block confirmation time is considered secure depends on the specifics of their consensus mechanism and whether you're willing to trust any underlying assumptions of (partial) honesty of validators.

For further details, take a look at the consensus documentation for the chain you want to use:
- [Ethereum Consensus Mechanisms](https://ethereum.org/en/developers/docs/consensus-mechanisms/)
- [Binance Consensus Docs](https://docs.binance.org/smart-chain/guides/concepts/consensus.html)
- [Polygon Consensus Docs](https://docs.matic.network/docs/contribute/bor/consensus/)

Understanding the blockchains you build your application on is very important. You should take time to understand [chain reorganization](https://blog.ethereum.org/2015/08/08/chain-reorganisation-depth-expectations/) which will also result in a different VRF output, which could be exploited.

## Do not re-request randomness, even if you don't get an answer right away

Doing so would give the VRF service provider the option to withhold a VRF fulfillment, if it doesn't like the outcome, and wait for the re-request in the hopes that it gets a better outcome, similar to the considerations with block confirmation time.

## Don't accept bids/bets/inputs after you have made a randomness request

Consider the example of a contract that mints a random NFT in response to a users' actions.

The contract should:
1. record whatever actions of the user may affect the generated NFT
1. __stop accepting further user actions that may affect the generated NFT__ and issue a randomness request
1. on randomness fulfillment, mint the NFT

Generally speaking, whenever an outcome in your contract depends on some user-supplied inputs and randomness, the contract should not accept any additional user-supplied inputs once the randomness request has been issued.

Otherwise, the cryptoeconomic security properties may be violated by an attacker that can rewrite the chain.

## `fulfillRandomness` must not revert

If your fulfillRandomness implementation reverts, the VRF service will not attempt to call it a second time. Make sure your contract logic does not revert. Consider simply storing the randomness and taking more complex follow-on actions in separate contract calls made by you or your users.

## Use `VRFConsumerBase` in your contract, to interact with the VRF service

`VRFConsumerBase` tracks important state which needs to be synchronized with the `VRFCoordinator` state. Some users fold `VRFConsumerBase` into their own contracts, but this means taking on significant extra complexity, so we advise against doing so.

Along the same lines, don't override `rawFulfillRandomness`.
