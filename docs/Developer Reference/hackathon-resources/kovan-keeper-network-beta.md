---
layout: nodes.liquid
section: smartContract
date: Last Modified
title: "Kovan Keeper Network (Beta)"
permalink: "docs/kovan-keeper-network-beta/"
hidden: false
metadata: 
  image: 
    0: "/files/d5ac604-cl.png"
    1: "cl.png"
    2: 1459
    3: 1459
    4: "#dbe1f8"
---
# Background

A limitation of smart contracts is that they cannot initiate functions or update their state by themselves. They need interaction from an EOA (externally owned account), like a Metamask wallet, to initiate any function and pay the gas required.

Keeper network offers a service that can automate the "upkeep" of smart contracts.  Anyone can register a contract for upkeep. For example, a contract that requires it's ETH balance to stay above a certain amount can be registered to Keeper, and if configured correctly, Keeper will send it ETH when a threshold has been breached.

# Overview

The Chainlink Keeper network aims to provide smart contracts options to outsource regular maintenance tasks (harvesting, liquidating, rebase, etc.) in a trust minimized (decentralized) manner. The network aims to provide a protocol for incentivization & governance for the keeper ecosystem.

There are 3 main actors in this network:
- **Upkeep**: These are smart contracts that need external entities to service their maintenance tasks.
- **Keepers**: External actors that execute the published upkeep.
- **Registry**: Provide discovery mechanisms for the above actors and provide hooks for governance to keep the network healthy.

The logical view of the network looks like given below. There will be a central registry where any Client can register for upkeep on one side, and node operators register as keepers to service those requests on the other side. Registration contract will check for keeper permissions & make payments after successful completion of upkeeps from active keepers. Registration contract will also provide governance by adding or removing upkeep or keepers to maintain overall network health.

[block:image]
{
  "images": [
    {
      "image": [
        "/files/79f4e61-image1.png",
        "image1.png",
        1140,
        826,
        "#cdcdcd"
      ]
    }
  ]
}
[/block]
# How To Register Upkeep

Below are the steps to register upkeep on the Chainlink registry that registered keepers in the network can pick up.

1. First of all, create a contract that implements the interface as defined below. There are two main functions.
    1. `checkUpKeep`: This function will be called at regular intervals & the boolean return value decides if the contract needs to be serviced at this time or not. If the upkeep is required, you can also return bytes that will be passed to `performUpkeep` function.
    2. `performUpkeep`: This function is the actual upkeep that the contract wants servicing. This function is called only if `checkUpKeep` has returned true.
2. Once you have deployed the above contract on Kovan, please send us the following details using <a href="https://forms.gle/6syh43t7WjMGqdTA6" target="_blank">this Google Form</a>.
    1. Contract address implementing the upkeep interface
    2. Admin address - to cancel upkeep and withdraw remaining funds
    3. Gas limit needed for `performUpkeep`. Currently, there is a minimum limit of 2300 & a maximum limit of 2500000.
    4. ‘checkData’ in Hex (as described in the interface above)
3. We will register your upkeep in the registry and inform you of your “upkeepId”
4. Next, you need to add funds to your upkeep, which is a two-step process
    1. Approve the transfer using the ‘approve’ function on the Kovan LINK contract `{{variables.KOVAN_LINK_TOKEN}}`. Please use the Chainlink registry address <a href="https://kovan.etherscan.io/address/0x42dD7716721ba279dA2f1F06F97025d739BD79a8" target="_blank">`0x42dD7716721ba279dA2f1F06F97025d739BD79a8`</a> as ‘spender’ for this call.
    2. Next, you need to fund your upkeep using the function `addFunds` on the Chainlink registry contract specified above. Use the `upkeepId` we provided before in the `id` field. Note that anyone is allowed to add funds to any upkeep so that you can use any account for this activity. 
    3. Use the `getUpkeep` function on the Chainlink registry to confirm that the funds have transferred & all the other details of the upkeep look fine. Get back to us if you see any issues.
5. Your upkeep should start getting serviced.

# Code

```javascript
// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;

interface KeeperCompatibleInterface {

  /**
   * @notice method that is simulated by the keepers to see if any work actually
   * needs to be performed. This method does does not actually need to be
   * executable, and since it is only ever simulated it can consume lots of gas.
   * @dev To ensure that it is never called, you may want to add the
   * cannotExecute modifier from KeeperBase to your implementation of this
   * method.
   * @param checkData specified in the upkeep registration so it is always the
   * same for a registered upkeep. This can easily be broken down into specific
   * arguments using `abi.decode`, so multiple upkeeps can be registered on the
   * same contract and easily differentiated by the contract.
   * @return upkeepNeeded boolean to indicate whether the keeper should call
   * performUpkeep or not.
   * @return performData bytes that the keeper should call performUpkeep with, if
   * upkeep is needed. If you would like to encode data to decode later, try
   * `abi.encode`.
   */
  function checkUpkeep(
    bytes calldata checkData
  )
    external
    returns (
      bool upkeepNeeded,
      bytes memory performData
    );

  /**
   * @notice method that is actually executed by the keepers, via the registry.
   * The data returned by the checkUpkeep simulation will be passed into
   * this method to actually be executed.
   * @dev The input to this method should not be trusted, and the caller of the
   * method should not even be restricted to any single registry. Anyone should
   * be able call it, and the input should be validated, there is no guarantee
   * that the data passed in is the performData returned from checkUpkeep. This
   * could happen due to malicious keepers, racing keepers, or simply a state
   * change while the performUpkeep transaction is waiting for confirmation.
   * Always validate the data passed in.
   * @param performData is the data which was passed back from the checkData
   * simulation. If it is encoded, it can easily be decoded into other types by
   * calling `abi.decode`. This data should not be trusted, and should be
   * validated against the contract's current state.
   */
  function performUpkeep(
    bytes calldata performData
  ) external;
}
```

- The contract & other code is undergoing audit & reviews and will be shared once completed.
- Chainlink Keeper Registry Contract: <a href="https://kovan.etherscan.io/address/0x42dD7716721ba279dA2f1F06F97025d739BD79a8#code" target="_blank">`0x42dD7716721ba279dA2f1F06F97025d739BD79a8`</a>
