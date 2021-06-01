---
layout: nodes.liquid
date: Last Modified
title: "Building External Adapters"
permalink: "docs/developers/"
whatsnext: {"Bridges: Adding External Adapters to Nodes":"/docs/node-operators/"}
hidden: false
---
Developers of external adapters will need to know how the Chainlink node requests data from it, and how the data should be formatted for a response. External adapters can be written in any language, and even run on separate machines, to include serverless functions.

Here are some project templates to get started:

* <a href="https://github.com/thodges-gh/CL-EA-NodeJS-Template" target="_blank">NodeJS Template</a>
* <a href="https://github.com/thodges-gh/CL-EA-Python-Template" target="_blank">Python Template</a>
* <a href="https://github.com/smartcontractkit/external-adapters-js" target="_blank">Official Chainlink External Adapter Monorepo (NodeJS)</a>

Once created, you can submit your adapter repo to <a href="https://market.link/profile/adapters" target="_blank">Chainlink Market</a>, so node operators can find and start using it.

### Requesting Data

When an external adapter receives a request from the Chainlink node, the JSON payload will include the following objects:

-  `id` (may be null or absent)
-  `data` (guaranteed to be present but may be empty)

e.g.

```json
{"id":"278c97ffadb54a5bbb93cfec5f7b5503","data":{}}
```


If the node has a value defined for the Bridge Response URL, the payload will include a `"responseURL"` field that can be used to update responses via PATCH requests:

```json
{
  "id": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {},
  "responseURL": "http://localhost:6688/v2/runs/278c97ffadb54a5bbb93cfec5f7b5503"
}
```

Additional data may be specified in the spec to be utilized by the adapter. This can be useful for requesting data from a REST endpoint where the keys and values can be specified by the requester. For example, if the REST endpoint supports the following:

```
https://example.com/api/:parent/:child
```

Then the payload to the external adapter would need:

```json
{
  "id": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "parent": "myParentValue",
    "child": "myChildValue"
  }
}
```

The values for `:parent` and `:child` can be used within the adapter to dynamically build the URL for the request. This same concept can also be applied to URLs with query values. For example:

```
https://example.com/api/?parent=myParentValue&child=myChildValue
```

### Returning Data

Returning data is only supported when Chainlink provides a non-null `id` with the request payload. This is only provided for certain job types.

When the external adapter has a response payload, it must include the response payload with the given `jobRunID` back to the node. In the adapter itself, this is easily accomplished by mapping the value for the given `id` to a new field in the return data called `jobRunID`. You'll need at least:

- `jobRunID`
- `data`

An example of the response data can look like:

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "symbol": "ETH-USD",
    "last": {
      "price": 467.85,
      "size": 0.01816561,
      "timestamp": 1528926483463
    }
  }
}
```

You'll also notice some additional fields: `status`, `error`, and `pending`. An external adapter may mark the JobRun as pending if the answer needs to be returned at a specified time, or when a desired result is found. The `pending` field should also be set to `true` if this is the case. When the external adapter calls back to the node to update the JobRun, this should be done with an HTTP PATCH request.

### Returning Errors

If the endpoint gave a known error, the error should be included in the external adapter's response back to the Chainlink node.

An example of what the error response payload should look like:

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {},
  "status": "errored",
  "error": "The endpoint is under maintenance."
}
```

When an external adapter returns an error, the next task in the Job Spec is not executed.

### Example

Here is a complete example of a simple external adapter written as a serverless function. This external adapter takes two input fields, inserts the API key as a header, and returns the resulting payload to the node.
[block:code]
{
  "codes": [
    {
      "code": "let request = require('request');\n\nexports.myExternalAdapter = (req, res) => {\n  const url = \"https://some-api.example.com/api\";\n  const coin = req.body.data.coin || \"\";\n  const market = req.body.data.market || \"\";\n  let requestObj = {\n    coin: coin,\n    market: market\n  };\n  let headerObj = {\n    \"API_KEY\": \"abcd-efgh-ijkl-mnop-qrst-uvwy\"\n  };\n  let options = {\n      url: url,\n      headers: headerObj,\n      qs: requestObj,\n      json: true\n  };\n\n  request(options, (error, response, body) => {\n    if (error || response.statusCode >= 400) {\n        let errorData = {\n            jobRunID: req.body.id,\n            status: \"errored\",\n            error: body\n        };\n        res.status(response.statusCode).send(errorData);\n    } else {\n      let returnData = {\n        jobRunID: req.body.id,\n        data: body\n      };\n      res.status(response.statusCode).send(returnData);\n    }\n  });\n};",
      "language": "javascript",
      "name": "External Adapter"
    }
  ]
}
[/block]
If given "ETH" as the value for `coin` and "USD" as the value for `market`, this external adapter will build the following URL for the request:

```
https://some-api.example.com/api?coin=ETH&market=USD
```

The headers in this case would include the API key, but that could just as easily be added to the `requestObj` if an API requires the key in the URL.
