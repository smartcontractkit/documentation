---
layout: nodes.liquid
date: Last Modified
title: "Building External Initiators"
permalink: "docs/building-external-initiators/"
whatsnext: {"Adding External Initiators to Nodes":"/docs/external-initiators-in-nodes/"}
---

An external initiator can trigger a run for any webhook job that it has been linked to.

The URL for triggering a run is such:

```
curl -X POST -H "Content-Type: application/json" --data '{"myKey": "myVal"}' http://localhost:6688/v2/jobs/<job external UUID>/runs
```

You will need to specify two headers:

1. "X-Chainlink-EA-AccessKey"
1. "X-Chainlink-EA-Secret"

## JSON jobs (REMOVED)

> ❗️ v1 Jobs are removed
> The initiators for v1 Jobs are removed for Chainlink nodes running version 1.0.0 and later. Use [v2 jobs](/docs/jobs) instead.
>
> See the [v2 jobs migration page](/docs/jobs/migration-v1-v2) to learn how to migrate to v2 jobs.

We will be using the <a href="https://github.com/smartcontractkit/external-initiator">Chainlink external initiator</a> repo for reference. You can see some examples of existing initiators in the <a href="https://github.com/smartcontractkit/external-initiator/tree/master/blockchain" >blockchain</a> folder.

External initiators are simple web initiators that can be activated by any job instead of just one. To set one up, you need to have a service similar to an external adapter that sends an `HTTPPost` message runs API call to your chainlink node service. Here is a sample URL for a web job could look like:

```
curl -b cookiefile -X POST -H "Content-Type: application/json" --data '{"myKey":"myVal"}' http://localhost:6688/v2/specs/%s/runs
```
Where `%s` is the jobId.

External initiators make the same API call, with 2 added headers:
1. "X-Chainlink-EA-AccessKey"
1. "X-Chainlink-EA-Secret"

These are keys generated when you register your external initiator with your node.

Triggering a run through an external initiator is as simple as making this API call to your node. All jobs with this EI configured will then be kicked off in this way. A simple external initiator in psedo code could look like this:

```
while(True):
    send_api_call_with_external_initiator_access_key_headers()
    sleep(4)
```

And have this job run on the same machine as your node.
