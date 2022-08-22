---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "External Adapters in Solidity"
permalink: "docs/contract-creators/"
whatsnext: {"Building External Adapters":"/docs/developers/", "Bridges: Adding External Adapters to Nodes":"/docs/node-operators/"}
---
### Using parameters with an External Adapter

As a contract creator, using an external adapter is no different than creating a request for any other job spec. You will simply need to know which parameters are supported by the adapter. Notice the method below uses `req.add` to create a run parameter for each required value.

```javascript
function requestMWAPrice(string _coin, string _market)
  public
  onlyOwner
  returns (bytes32 requestId) 
{
  Chainlink.Request memory req = buildChainlinkRequest(SPEC_ID, this, this.fulfill.selector);
  req.add("endpoint", "mwa-historic");
  req.add("coin", _coin);
  req.add("market", _market);
  req.add("copyPath", "data.-1.1");
  req.addInt("times", 100);
  requestId = sendChainlinkRequest(req, oraclePayment);
}
```

### Using the Copy adapter with an External Adapter

The [Copy](../core-adapters/#copy) adapter allows for the same functionality of the [JsonParse](../core-adapters/#jsonparse)  adapter but for getting data from the external adapter's response.

For example, if an adapter returns JSON data like what is below:

```json
{
    "firstValue": "SomeValue",
    "details": {
        "close": "100",
        "open": "110",
        "current": "111"
    },
    "other": "GetData"
}
```

And you wanted the value in the field "open", you would specify the path for the adapter to walk through the JSON object to your desired field.

```json
"copyPath": ["details", "open"]
```

In Solidity, this would look like:

```javascript
string[] memory path = new string[](2);
path[0] = "details";
path[1] = "open";
run.addStringArray("copyPath", path);
```

Or you can use dot-notation <a href="https://jsonpath.com/" target="_blank">JSONPath</a> to simplify it:

```javascript
run.add("copyPath", "details.open");
```