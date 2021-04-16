---
layout: nodes.liquid
date: Last Modified
title: "Core Adapters"
permalink: "docs/adapters/"
hidden: false
---
Core adapters are the built-in functionality that every Chainlink node supports. Strung together, they act as tasks that need to be performed to complete a Job.

Adapters that are prefixed with "Eth" refer to tasks that post data onto the chain. Here are some examples of the data types that adapters convert data to.

| Name              | Core Adapter    | Ethereum Data Type |
|-------------------|------------|--------------------|
| Signed Integers   | [EthInt256](#ethint256)  | int256             |
| Unsigned Integers | [EthUint256](#ethuint256) | uint256            |
| Bytes             | [EthBytes32](#ethbytes32) | bytes32            |
| Boolean           | [EthBool](#ethbool)    | bool               |

You can learn more about Solidity data types <a href="https://docs.soliditylang.org/en/v0.5.3/types.html" target="_blank">here</a>.
[block:api-header]
{
  "title": "Compare"
}
[/block]
This core adapter compares a user-specified value with the value from the previous adapter's result.

#### Parameters

- `operator`: the operator used to compare values. You may use one of the following:
  - `eq`: Equals
  - `neq`: Not equals
  - `gt`: Greater than
  - `gte`: Greater than or equals to
  - `lt`: Less than
  - `lte`: Less than or equals to
- `value`: the value to check against the previous adapter's result. May be a string or a number, but if the value is a string, only `eq` and `neq` may be used.

#### Solidity Example

```javascript
req.addInt("value", 10000);
req.add("operator", "gte");
```
[block:api-header]
{
  "title": "Copy"
}
[/block]
The core adapter walks the `copyPath` specified and returns the value found at that result. If returning JSON data from an [external adapter](../external-adapters), you will need to use this adapter to parse the response.

#### Parameters

- `copyPath`: takes an array of strings, each string being the next key to parse out in the JSON object or a single dot-delimited string.

#### Solidity Example

For the JSON object:

```json
{"RAW": {"ETH": {"USD": {"LASTMARKET": "_someValue"}}}}
```

You would use the following for an array of strings:

```javascript
string[] memory path = new string[](4);
path[0] = "RAW";
path[1] = "ETH";
path[2] = "USD";
path[3] = "LASTMARKET";
req.addStringArray("copyPath", path);
```

Or the following for a single dot-delimited string:

```javascript
req.add("copyPath", "RAW.ETH.USD.LASTMARKET");
```

#### Job Specification Example

```json
{
  "type": "Copy",
  "params": {
    "copyPath": [
      "RAW",
      "ETH",
      "USD",
      "LASTMARKET"
    ]
  }
}
```

For arrays, you can access the path of an array by using the index. If this is your JSON:

```json
{"endpoint": [ {"path":"value"}]}
```

You could get the `"value"` by:

```javascript
req.add("copyPath", "endpoint.0.path");
```
[block:api-header]
{
  "title": "EthBool"
}
[/block]
The core adapter reads the given Boolean value and then converts it into Solidity's `bool` format.

#### Parameters

_None taken._
[block:api-header]
{
  "title": "EthBytes32"
}
[/block]
The core adapter formats its input into a string and then converts it into Solidity's `bytes32` format.

#### Parameters

_None taken._
[block:api-header]
{
  "title": "EthInt256"
}
[/block]
The core adapter formats its input into an integer and then converts it into Solidity's `int256` format.

#### Parameters

_None taken._
[block:api-header]
{
  "title": "EthTx"
}
[/block]
The core adapter takes the input given and places it into the data field of the transaction. It then signs an Ethereum transaction and broadcasts it to the network. The task is only completed once the transaction's confirmations equal the <a href="https://github.com/smartcontractkit/chainlink/wiki/Configuration-Variables#min_outgoing_confirmations" target="_blank">`MIN_OUTGOING_CONFIRMATIONS`</a> amount.

If the transaction does not confirm by the time <a href="https://github.com/smartcontractkit/chainlink/wiki/Configuration-Variables#eth_gas_bump_threshold" target="_blank">`ETH_GAS_BUMP_THRESHOLD`</a> number of blocks have passed since initially broadcasting, then it bumps the gas price of the transaction by <a href="https://github.com/smartcontractkit/chainlink/wiki/Configuration-Variables#eth_gas_bump_wei" target="_blank">`ETH_GAS_BUMP_WEI`</a>.

#### Parameters

- `address`: the address of the Ethereum account which the transaction will be sent to.
- `functionSelector`: **(optional)** the <a href="https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#function-selector" target="_blank">function selector</a> of the contract which the transaction will invoke. `functionSelector` is placed before `dataPrefix` and the adapter's input in the data field of the transaction.
- `dataPrefix`: **(optional)** data which will be prepended before the adapter's input, but after the `functionSelector` in the transaction's data field.
- `value`: **(optional)** data to send to the function, will append after the `dataPrefix` payload if it's included. Will automatically come from the previous task.

[block:api-header]
{
  "title": "EthUint256"
}
[/block]
The core adapter formats its input into an integer and then converts it into Solidity's `uint256` format.

#### Parameters

_None taken._

[block:api-header]
{
  "title": "HttpGet"
}
[/block]
The core adapter will report the body of a successful `GET` request to the specified `get`, or return an error if the response status code is greater than or equal to 400.

#### Parameters

- `get`: takes a string containing the URL to make a `GET` request to.
- `queryParams`: takes a string or array of strings for the URL's query parameters.
- `extPath`: takes a slash-delimited string or array of strings to be appended to the job's URL.
- `headers`: takes a object containing keys as strings and values as arrays of strings.

> 🚧 Headers
>
> Currently not available on-chain. Available for job specs only.

#### Solidity Example

```javascript
req.add("get", "http://example.com");
req.add("queryParams", "firstKey=firstVal&secondKey=secondVal");
req.add("extPath", "price/BTC/USD");
```

#### Job Specification Example

```json
{
  "type": "HttpGet",
  "params": {
    "get": "https://example.com/some-endpoint",
    "headers": {
      "X-API-Key": [
        "abc123abc123abc123abc123"
      ]
    }
  }
}
```

NOTE: For security, since the URL may come from an untrusted source, HTTPGet imposes some restrictions on which IPs may be fetched. Local network and multicast IPs are disallowed by default and attempting to connect will result in an error.

If you really must access one of these IPs, you can use the `HTTPGetWithUnrestrictedNetworkAccess` adapter instead.
[block:api-header]
{
  "title": "HttpPost"
}
[/block]
The core adapter will report the body of a successful `POST` request to the specified `post`, or return an error if the response status code is greater than or equal to 400.

#### Parameters

- `post`: takes a string containing the URL to make a `POST` request to.
- `headers`: takes a object containing keys as strings and values as arrays of strings.
- `queryParams`: takes a string or array of strings for the URL's query parameters.
- `extPath`: takes a slash-delimited string or array of strings to be appended to the job's URL.
- `body`: the JSON body (as a string) that will be used as the data in the request.

> 🚧 Headers & Body
>
> Currently not available on-chain. Available for job specs only.

#### Solidity Example

```javascript
req.add("post", "http://post.example.com");
req.add("queryParams", "firstKey=firstVal&secondKey=secondVal");
req.add("extPath", "price/BTC/USD");
```

#### Job Specification Example

```
{
    "type": "HttpPost",
    "params": {
        "post": "https://example.com/some-endpoint",
        "headers": {
            "X-API-Key": [
                "abc123abc123abc123abc123"
            ]
        }
    }
}
```

NOTE: For security, since the URL may come from an untrusted source, HTTPPost imposes some restrictions on which IPs may be fetched. Local network and multicast IPs are disallowed by default and attempting to connect will result in an error.

If you really must access one of these IPs, you can use the `HTTPPostWithUnrestrictedNetworkAccess` adapter instead.
[block:api-header]
{
  "title": "JsonParse"
}
[/block]
The core adapter walks the `path` specified and returns the value found at that result. If returning JSON data from the [HttpGet](../adapters#section-httpget) or [HttpPost](../adapters#section-httppost) adapters, you must use this adapter to parse the response.

#### Parameters

- `path`: takes an array of strings, each string being the next key to parse out in the stringified JSON result or a single dot-delimited string.

#### Solidity Example

For the stringified JSON:

```json
"{\"RAW\": {\"ETH\": {\"USD\": {\"LASTMARKET\": \"_someValue\"}}}}"
```

You would use the following for an array of strings:

```javascript
string[] memory path = new string[](4);
path[0] = "RAW";
path[1] = "ETH";
path[2] = "USD";
path[3] = "LASTMARKET";
req.addStringArray("path", path);
```

Or the following for a single dot-delimited string:

```javascript
req.add("path", "RAW.ETH.USD.LASTMARKET");
```

#### Job Specification Example

```json
{
  "type": "JsonParse",
  "params": {
    "path": [
      "RAW",
      "ETH",
      "USD",
      "LASTMARKET"
    ]
  }
}
```

#### Parsing Arrays

```javascript
req.add("path", "3.standardId");
```
The above example parses the 4th object of the following JSON response and returns 677 as a result:
```javascript
[
   {
     "standardId": 20,
     "name": "ERC-20"
   },
   {
     "standardId": 721,
     "name": "ERC-721"
   },
   {
     "standardId": 1155,
     "name": "ERC-1155"
   },
   {
     "standardId": 677,
     "name": "ERC-677"
    }
]
```
[block:api-header]
{
  "title": "Multiply"
}
[/block]
The core adapter parses the input into a float and then multiplies it by the `times` field.

#### Parameters

- `times`: the number to multiply the input by.

#### Solidity Example

```javascript
run.addInt("times", 100);
```
[block:api-header]
{
  "title": "NoOp"
}
[/block]
The core adapter performs no operations, simply passing the input on as output. Commonly used for testing.

#### Parameters

_None taken._
[block:api-header]
{
  "title": "NoOpPend"
}
[/block]
The core adapter performs no operations, and marks its task run pending. Commonly used for testing.

#### Parameters

_None taken._
[block:api-header]
{
  "title": "Quotient"
}
[/block]
Quotient

The core adapter gives the result of x / y where x is a specified value (dividend) and y is the input value (result).

This can be useful for inverting outputs, e.g. if your API only offers a USD/ETH conversion rate and you want ETH/USD instead you can use this adapter with a dividend of 1 to get the inverse (i.e. 1 / result).

#### Parameters

- `dividend`: the number which is divided by the result
[block:api-header]
{
  "title": "Sleep"
}
[/block]
The core adapter will pause the current task pipeline for the given duration. 
[block:callout]
{
  "type": "warning",
  "title": "ENABLE_EXPERIMENTAL_ADAPTERS",
  "body": "You must set `ENABLE_EXPERIMENTAL_ADAPTERS=true` in order to use the sleep adapter"
}
[/block]
#### Parameters

- `until`: the UNIX timestamp of when the job should stop sleeping and resume at the next task in the pipeline.

#### Solidity Example

```javascript
req.addUint("until", now + 1 hours);
```

#### Job Specification example
```
{
  "initiators": [
    {
      "type": "web",
      "params": {
      }
    }
  ],
  "tasks": [
    {
      "type": "sleep",
      "params": {
        "until": "1605651000"
      }
    }
  ]
}
```