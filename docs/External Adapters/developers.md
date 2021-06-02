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

- `data` (guaranteed to be present but may be empty)
- `meta` (optional, depends on job type)
- `responseURL` (optional, will be supplied if job supports asynchronous callbacks)

#### Examples

```json
{"data":{}}
```

```json
{"data":{}, "responseURL": "http://localhost:6688/v2/runs/278c97ffadb54a5bbb93cfec5f7b5503"}
```

```json
{"data":{"foo": 42}, "meta":{"bar": "baz"}}
```

Additional data may be specified in the spec to be utilized by the adapter. This can be useful for requesting data from a REST endpoint where the keys and values can be specified by the requester. For example, if the REST endpoint supports the following:

```
https://example.com/api/:parent/:child
```

Then the payload to the external adapter would need:

```json
{
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

When the external adapter wants to return data immediately, it must include `data` in the returned JSON.

An example of the response data can look like:

```json
{
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

### Returning Errors

If the endpoint gave a known error, the `error` field should be included in the external adapter's response back to the Chainlink node.

An example of what the error response payload should look like:

```json
{
  "error": "The endpoint is under maintenance."
}
```

### Asynchronous callbacks

Some job types support external callbacks. When supported, Chainlink will provide a non-null `responseURL` alongside the request payload.

If the external adapter wants to return data immediately it can simply respond with data directly as normal.

If the external adapter wants to use this URL to return data later, it may return a response like this:

```json
{
    "pending": true
}
```

In this case, the job run on Chainlink side will be put into a `pending` state, awaiting data which can be delivered at a later date.

When the external adapter is ready, it should callback to the node to resume the JobRun using an HTTP PATCH request to the `responseURL` field.


```json
{
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

Or, for the error case:

```json
{
  "error": "something went wrong"
}
```

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
