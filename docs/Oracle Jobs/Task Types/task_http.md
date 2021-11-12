---
layout: nodes.liquid
date: Last Modified
title: "HTTP Task"
permalink: "docs/jobs/task-types/http/"
---

HTTP tasks make HTTP requests to arbitrary URLs.

**Parameters**

- `method`: the HTTP method that the request should use.
- `url`: the URL to make the HTTP request to.
- `requestData` (optional): a statically-defined payload to be sent to the external adapter.
- `allowUnrestrictedNetworkAccess` (optional): permits the task to access a URL at `localhost`, which could present a security risk. Note that Bridge tasks allow this by default.

**Outputs**

A string containing the response body.

**Example**

```jpv2
my_http_task [type="http"
              method=PUT
              url="http://chain.link"
              requestData="{\\"foo\\": $(foo), \\"bar\\": $(bar), \\"jobID\\": 123}"
              allowUnrestrictedNetworkAccess=true
              ]
```
