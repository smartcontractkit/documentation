---
layout: nodes.liquid
date: Last Modified
title: "Webhook Jobs"
permalink: "docs/job-types/webhook"
---

Webhook jobs can be initiated by HTTP request, either by a user or external initiator.

This is an example webhook job:

```toml
type            = "webhook"
schemaVersion   = 1
externalInitiators = [
  { name = "my-external-initiator-1", spec = "{\"foo\": 42}" },
  { name = "my-external-initiator-2" spec = "{}" }
]
observationSource   = """
    parse_request  [type=jsonparse path="data,result" data="$(jobRun.requestBody)"];
    multiply       [type=multiply times="100"];
    send_to_bridge [type=bridge name="my_bridge" includeInputAtKey="result" ];

    parse_request -> multiply -> send_to_bridge;
"""
```

All webhook jobs can have runs triggered by a logged in user.

Webhook jobs may additionally specify zero or more external initiators, which can also trigger runs for this job. The name must exactly match the name of the referred external initiator. The external initiator definition here must contain a `spec` which defines the JSON payload that will be sent to the External Initiator on job creation if the external initiator has a URL. If you don't care about the spec, you can simply use the empty JSON object.
