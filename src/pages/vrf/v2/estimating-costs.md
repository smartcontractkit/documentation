---
layout: ../../../layouts/MainLayout.astro
section: ethereum
date: Last Modified
title: "Estimating VRF Costs"
whatsnext:
  {
    "Get a Random Number": "/vrf/v2/direct-funding/examples/get-a-random-number/",
    "Supported Networks": "/vrf/v2/direct-funding/supported-networks/",
  }
metadata:
  title: "Estimating costs for Chainlink VRF v2"
  description: "Learn how to estimate costs for Chainlink VRF v2."
setup: |
  import VrfCommon from "@features/vrf/v2/common/VrfCommon.astro"
  import { Tabs } from "@components/Tabs"
---

This guide explains how to estimate VRF costs when using the _direct funding_ method.

## Understanding transaction costs

<Tabs sharedStore="vrfMethod" client:visible>
<Fragment slot="tab.1">Subscription</Fragment>
<Fragment slot="tab.2">Direct funding</Fragment>
<Fragment slot="panel.1">

For Chainlink VRF v2 to fulfill your requests, you must maintain a sufficient amount of LINK in your subscription balance. Gas cost calculation includes the following variables:

- **Gas price:** The current gas price, which fluctuates depending on network conditions.

- **Callback gas:** The amount of gas used for the callback request that returns your requested random values.

- **Verification gas:** The amount of gas used to verify randomness on-chain.

The gas price depends on current network conditions. The callback gas depends on your callback function, and the number of random values in your request. The cost of each request is final only after the transaction is complete, but you define the limits you are willing to spend for the request with the following variables:

- **Gas lane:** The maximum gas price you are willing to pay for a request in wei. Define this limit by specifying the appropriate `keyHash` in your request. The limits of each gas lane are important for handling gas price spikes when Chainlink VRF bumps the gas price to fulfill your request quickly.

- **Callback gas limit:** Specifies the maximum amount of gas you are willing to spend on the callback request. Define this limit by specifying the `callbackGasLimit` value in your request.

</Fragment>
<Fragment slot="panel.2">

For Chainlink VRF v2 to fulfill your requests, you must have a sufficient amount of LINK in your consuming contract. Gas cost calculation includes the following variables:

- **Gas price:** The current gas price, which fluctuates depending on network conditions.

- **Callback gas:** The amount of gas used for the callback request that returns your requested random values. The callback gas depends on your callback function and the number of random values in your request. Set the **callback gas limit** to specify the maximum amount of gas you are willing to spend on the callback request.

- **Verification gas:** The amount of gas used to verify randomness on-chain.

- **Wrapper overhead gas:** The amount of gas used by the VRF Wrapper contract. See the [Request and Receive Data](/vrf/v2/direct-funding#request-and-receive-data) section for details about the VRF v2 Wrapper contract design.

Because the consuming contract directly pays the LINK for the request, the cost is calculated during the request and not during the callback when the randomness is fulfilled. Test your callback function to learn how to correctly estimate the callback gas limit.

- If the gas limit is underestimated, the callback fails and the consuming contract is still charged for the work done to generate the requested random values.
- If the gas limit is overestimated, the callback function will be executed but your contract is not refunded for the excess gas amount that you paid.

Make sure that your consuming contracts are funded with enough LINK tokens to cover the transaction costs. If the consuming contract doesn't have enough LINK tokens, your request will revert.
</Fragment>
</Tabs>

### Estimate gas costs

<Tabs sharedStore="vrfMethod"  client:visible>
<Fragment slot="tab.1">Subscription</Fragment>
<Fragment slot="tab.2">Direct funding</Fragment>
<Fragment slot="panel.1">

After the request is complete, the final gas cost is recorded based on how much gas is required for the verification and callback. The total gas cost in wei for your request uses the following formula:

```
(Gas price * (Verification gas + Callback gas)) = total gas cost
```

The total gas cost is converted to LINK using the ETH/LINK data feed. In the unlikely event that the data feed is unavailable, the VRF coordinator uses the `fallbackWeiPerUnitLink` value for the conversion instead. The `fallbackWeiPerUnitLink` value is defined in the [coordinator contract](/vrf/v2/subscription/supported-networks/#configurations) for your selected network.
</Fragment>
<Fragment slot="panel.2">

The final gas cost to fulfill randomness is estimated based on how much gas is expected for the verification and callback. The total gas cost in wei uses the following formula:

```
(Gas price * (Verification gas
              + Callback gas limit
              + Wrapper gas overhead)) = total gas cost
```

The total gas cost is converted to LINK using the ETH/LINK data feed. In the unlikely event that the data feed is unavailable, the VRF Wrapper uses the `fallbackWeiPerUnitLink` value for the conversion instead. The `fallbackWeiPerUnitLink` value is defined in the [VRF v2 Wrapper contract](/vrf/v2/direct-funding/supported-networks/#configurations) for your selected network.

The maximum allowed `callbackGasLimit` value for your requests is defined in the [Coordinator contract supported networks](/vrf/v2/subscription/supported-networks/) page. Because the VRF v2 Wrapper adds a gas overhead, your `callbackGasLimit` must not exceed `maxGasLimit - wrapperGasOverhead`.
</Fragment>
</Tabs>

### LINK premium

<Tabs sharedStore="vrfMethod" client:visible>
<Fragment slot="tab.1">Subscription</Fragment>
<Fragment slot="tab.2">Direct funding</Fragment>
<Fragment slot="panel.1">

The LINK premium is added to the total gas cost. The premium is defined in the [coordinator contract](/vrf/v2/subscription/supported-networks/#configurations) with the `fulfillmentFlatFeeLinkPPMTier1` parameter in millionths of LINK.

```
(total gas cost + LINK premium) = total request cost
```

The total request cost is charged to your subscription balance.
</Fragment>
<Fragment slot="panel.2">

A LINK premium is then added to the total gas cost. The premium is divided in two parts:

- Wrapper premium: The premium percentage. You can find the percentage for your network in the [Supported networks](/vrf/v2/direct-funding/supported-networks/#configurations) page.
- Coordinator premium: A flat fee. This premium is defined in the `fulfillmentFlatFeeLinkPPMTier1` parameter in millionths of LINK. You can find the flat fee of the coordinator for your network in the [Supported networks](/vrf/v2/direct-funding/supported-networks/#configurations) page.

```
(Coordinator premium
  + (total gas cost * Wrapper premium)) = total request cost
```

</Fragment>
</Tabs>
