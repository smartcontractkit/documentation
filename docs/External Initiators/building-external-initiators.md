---
layout: nodes.liquid
date: Last Modified
title: "Building External Initiators"
permalink: "docs/building-external-initiators/"
whatsnext: {"Adding External Initiators to Nodes":"/docs/external-initiators-in-nodes"}
hidden: false
---
We will be using the <a target="_blank" href="https://github.com/smartcontractkit/external-initiator">Chainlink external initiator</a> repo for reference. You can see some examples of existing initiators in the <a href="https://github.com/smartcontractkit/external-initiator/tree/master/blockchain" target="_blank">blockchain</a> folder, and a walkthrough of setting one up (not writing the code) <a href="https://www.youtube.com/watch?v=J8oJEp4qz5w" target="_blank">here</a>.

External initiators are simple web initiators that can be activated by any job instead of just one. To set one up, you need to have a service similar to an external adapter that sends an [`HTTPPost` message runs API call](/reference#runs) to your chainlink node service. Here is a sample URL for a web job could look like:

```
curl -b cookiefile -X POST -H "Content-Type: application/json" --data '{"myKey":"myVal"}' http://localhost:6688/v2/specs/%s/runs
```
Where `%s` is the jobId. 

External initiators make the same API call, with 2 added headers: 
1. "X-Chainlink-EA-AccessKey"
2. "X-Chainlink-EA-Secret"

These are keys generated when you register your external initiator with your node.

Triggering a run through an external initiator is as simple as making this API call to your node. All jobs with this EI configured will then be kicked off in this way. A simple external initiator in psedo code could look like this:


```
while(True):
    send_api_call_with_external_initiator_access_key_headers()
    sleep(4)
```

And have this job run on the same machine as your node.