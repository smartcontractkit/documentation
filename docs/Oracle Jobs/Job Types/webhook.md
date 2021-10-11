---
layout: nodes.liquid
date: Last Modified
title: "Webhook Jobs"
permalink: "docs/jobs/types/webhook/"
---

Webhook jobs can be initiated by HTTP request, either by a user or external initiator.

> Note: You'll need `FEATURE_WEBHOOK_V2=true` in your `.env` file.

This is an example webhook job:

```toml
type            = "webhook"
schemaVersion   = 1
externalInitiators = [
  { name = "my-external-initiator-1", spec = "{\"foo\": 42}" },
  { name = "my-external-initiator-2", spec = "{}" }
]
observationSource   = """
    parse_request  [type=jsonparse path="data,result" data="$(jobRun.requestBody)"]
    multiply       [type=multiply input="$(parse_request)" times="100"]
    send_to_bridge [type=bridge name="my_bridge" requestData=<{ "result": $(multiply) }>]

    parse_request -> multiply -> send_to_bridge
"""
```

All webhook jobs can have runs triggered by a logged in user.

Webhook jobs may additionally specify zero or more external initiators, which can also trigger runs for this job. The name must exactly match the name of the referred external initiator. The external initiator definition here must contain a `spec` which defines the JSON payload that will be sent to the External Initiator on job creation if the external initiator has a URL. If you don't care about the spec, you can simply use the empty JSON object.

**Unique fields**

- `externalInitiators`: an array of `{name, spec}` objects, where `name` is the name registered with the node, and `spec` is the job spec to be forwarded to the external initiator when it is created.

**Shared fields**
See [shared fields](/docs/jobs/#shared-fields).

**Job type specific pipeline variables**

- `$(jobSpec.databaseID)`: the ID of the job spec in the local database. You shouldn't need this in 99% of cases.
- `$(jobSpec.externalJobID)`: the globally-unique job ID for this job. Used to coordinate between node operators in certain cases.
- `$(jobSpec.name)`: the local name of the job.
- `$(jobRun.meta)`: a map of metadata that can be sent to a bridge, etc.
- `$(jobRun.requestBody)`: the body of the request that initiated the job run.
