---
title: "Introduction"
slug: "introduction-1"
hidden: false
createdAt: "2020-12-15T09:50:35.468Z"
updatedAt: "2020-12-15T10:43:43.360Z"
---
External Initiators are customizable initiators allowing engineers to have jobs kick-off depending on any parameters they please. These are initiators outside the core initiators. They are one of the key pieces to Chainlink being blockchain agnostic.

Communication between External Initiators is handled by the Initiator Bridge. These bridges are defined in the `bridges` tab, and are the same bridges used to define external adapters. 
[block:callout]
{
  "type": "warning",
  "title": "Bridges and External Initiators",
  "body": "At this time of writing, external initiators do not show up in the bridges tab. However, they act exactly the same as if they did."
}
[/block]
 Initiator Bridges handle the authentication to and from the External Initiator and where to send the messages. When creating a Bridge two parameters are required: 

1. A Name 
2. A URL

The Name is used in subsequent Job Specifications as an easy way to identify the Initiator that is triggering new Runs. The URL specifies where to send messages to the External Initiator.

When the Bridge is created it generates two pairs of credentials: Outgoing and Incoming. The Outgoing Access Key and Secret are used to authenticate messages sent from the Core to the External Initiator. The Incoming Access Key and Secret are used to authenticate messages sent from the External Initiator to the Core.

Then, once you've created the name, bridge, and have the correct access keys for the URL, you can proceed to use the external initiator as if it's a regular initiator in future job specs.