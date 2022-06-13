---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'Building External Adapters'
permalink: 'docs/developers/'
whatsnext: { 'Bridges: Adding External Adapters to Nodes': '/docs/node-operators/' }
---

Developers of external adapters will need to know how the Chainlink node requests data from it, and how the data should be formatted for a response. External adapters can be written in any language, and even run on separate machines, to include serverless functions.

Here is our external adapters monorepo which contains many examples to help get you started:

- [Official Chainlink External Adapter Monorepo (NodeJS)](https://github.com/smartcontractkit/external-adapters-js).

Once created, you can submit your adapter repo to <a href="https://market.link/profile/adapters" target="_blank">Chainlink Market</a>, so node operators can find and start using it.

### Example

In this guide, we will explain how you can leverage the [Official Chainlink External Adapter Monorepo (NodeJS)](https://github.com/smartcontractkit/external-adapters-js) to build a custom adapter.
[Coinpaprika API](https://api.coinpaprika.com) delivers crypto market data: coin prices, volumes, all time highs..ETc. In this example, we will build a custom adapter that calls the [getTickersById operation](https://api.coinpaprika.com/#operation/getTickersById) to fetch price data of a single coin.

### Creating a new Adapter

First of all, fork [Official Chainlink External Adapter Monorepo (NodeJS)](https://github.com/smartcontractkit/external-adapters-js) as explained in [here](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
Then create the new customer adapter as explained in the [contributing page](https://github.com/smartcontractkit/external-adapters-js/blob/develop/CONTRIBUTING.md):

```sh
yarn new source coinpaprika-custom
```

- `source` is the template to use when generating an adapter. see [contributing page](https://github.com/smartcontractkit/external-adapters-js/blob/develop/CONTRIBUTING.md) for other configuration options.
- `coinpaprika-custom` is the name of our custom adapter.

This will create a new repository `packages/sources/coinpaprika-custom/`. It has the [following files and folders](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/examples/source):

- `schemas` folder: contains `env.json` file. Parsed by the [README generator](https://github.com/smartcontractkit/external-adapters-js/tree/develop/packages/scripts#readme-generator) to automatically generate the README file of the source adapter.
- `test` folder: contains all the tests.
  - `e2e`folder: Tests that run the adapter and send end to end requests using live API endpoints.
  - `integration` folder: Tests that run the adapter and send end to end requests using mocked API endpoints.
  - `unit` folder: Tests that test particular endpoints or helpfer funtions from the adapter.
- `src` folder: main source folder.
  - `config` folder
    - `includes.json`:
    - `index.ts`:
    - `limits.json`:
    - `symbols.json`:
  - `endpoint` folder:
    - `example.ts`:
    - `index.ts`:
  - `adapter.ts`: contains the main functions needed to run the adapter. You don't need to modify this file.
  - `index.ts`: entry point to the adapter when the server is started. You don't need to modify this file.
  - `types.ts`


### Requesting Data

When an external adapter receives a request from the Chainlink node, the JSON payload will include the following objects:

- `data` (guaranteed to be present but may be empty. See [AdapterRequestData type](https://github.com/smartcontractkit/external-adapters-js/blob/develop/packages/core/types/@chainlink/index.d.ts) )
- `meta` (optional. See [AdapterRequestMeta type](https://github.com/smartcontractkit/external-adapters-js/blob/develop/packages/core/types/@chainlink/index.d.ts))
- `metricsMeta` (optional. See [AdapterMetricsMeta type](https://github.com/smartcontractkit/external-adapters-js/blob/develop/packages/core/types/@chainlink/index.d.ts))
- `debug` (Optional. See [AdapterDebug type](https://github.com/smartcontractkit/external-adapters-js/blob/develop/packages/core/types/@chainlink/index.d.ts))
- `rateLimitMaxAge` (Optional)
- `id` (optional, can be nice to use for EA logging to help debug job runs)

#### Examples

```json
{ "data": {} }
```

```json
{ "data": { "foo": 42 }, "meta": { "bar": "baz" }, "id": "2d38ecdb-975c-4f99-801c-b916a429947c" }
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

If the external adapter wants to use the response URL to send data later, it may initially return a response like this:

```json
{
  "pending": true
}
```

In this case, the job run on Chainlink side will be put into a `pending` state, awaiting data which can be delivered at a later date.

When the external adapter is ready, it should callback to the node to resume the JobRun using an HTTP PATCH request to the `responseURL` field. This will resume the job on the Chainlink side.

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

```javascript External Adapter
let request = require('request');

exports.myExternalAdapter = (req, res) => {
  const url = 'https://some-api.example.com/api';
  const coin = req.body.data.coin || '';
  const market = req.body.data.market || '';
  let requestObj = {
    coin: coin,
    market: market,
  };
  let headerObj = {
    API_KEY: 'abcd-efgh-ijkl-mnop-qrst-uvwy',
  };
  let options = {
    url: url,
    headers: headerObj,
    qs: requestObj,
    json: true,
  };

  request(options, (error, response, body) => {
    if (error || response.statusCode >= 400) {
      let errorData = {
        jobRunID: req.body.id,
        status: 'errored',
        error: body,
      };
      res.status(response.statusCode).send(errorData);
    } else {
      let returnData = {
        jobRunID: req.body.id,
        data: body,
      };
      res.status(response.statusCode).send(returnData);
    }
  });
};
```

If given "ETH" as the value for `coin` and "USD" as the value for `market`, this external adapter will build the following URL for the request:

```
https://some-api.example.com/api?coin=ETH&market=USD
```

The headers in this case would include the API key, but that could just as easily be added to the `requestObj` if an API requires the key in the URL.
