---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Introduction"
permalink: "docs/external-initiators-introduction/"
whatsnext: {"Building External Initiators":"/docs/building-external-initiators/", "Adding External Initiators to Nodes":"/docs/external-initiators-in-nodes/"}
---

External initiators allow jobs in a node to be initiated depending on some external condition. The ability to create and add external initiators to Chainlink nodes enables blockchain agnostic cross-chain compatibility.

> 🚧 Note
>
> At this time of writing, external initiators do not show up in the bridges tab. However, they act exactly the same as if they did.

> ⚠️ NOTE
> External initiators are disabled on nodes by default. Set the `FEATURE_EXTERNAL_INITIATORS=true` [configuration variable](/docs/configuration-variables/#feature_external_initiators) to enable this feature.

Initiator Bridges handle the authentication to and from the External Initiator and where to send the messages. When creating a Bridge two parameters are required:

Only the [webhook](/docs/jobs/types/webhook/) job type can be initiated using an External Initiator.

The external initiator must be created before the webhook job, and must be referenced by name (whitelisted) in order for that external initiator to be allowed to trigger the given webhook job.

When the External Initiator is created it generates two pairs of credentials: Outgoing and Incoming. The Outgoing Access Key and Secret are used to authenticate messages sent from the Core to the External Initiator. The Incoming Access Key and Secret are used to authenticate messages sent from the External Initiator to the Core.

Then, once you've created the name, bridge, and have the correct access keys for the URL, you can proceed to use the external initiator as if it's a regular initiator in future job specs.

For how to create an external initiator see [adding external initiators to nodes](/docs/external-initiators-in-nodes).
