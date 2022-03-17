---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Bridge Task"
permalink: "docs/jobs/task-types/bridge/"
---

Bridge tasks make HTTP POST requests to pre-configured URLs. Bridges can be configured via the UI or the CLI, and are referred to by a simple user-specified name. This is the way that most jobs interact with [External Adapters](/docs/external-adapters/).

**Parameters**

- `name`: an arbitrary name given to the bridge by the node operator.
- `requestData` (optional): a statically-defined payload to be sent to the external adapter.
- `async` (optional): a boolean indicating whether the task should hibernate and wait for the Bridge to make an HTTP request back to the node at a later time with the result.

**Outputs**

A string containing the response body.

**Example**

```jpv2
my_bridge_task [type="bridge"
                name="some_bridge"
                requestData="{\\"data\\":{\\"foo\\": $(foo), \\"bar\\": $(bar)}}"
                ]
```
