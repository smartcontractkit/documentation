---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'GET > String Example Job Spec'
permalink: 'docs/direct-request-get-string/'
---

This is an example v2 (TOML) job spec for returning a _string_ in 1 Chainlink API Call. Note that the job calls `fulfillOracleRequest2` function. if you are a node operator, you will need to work with an [Operator contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol).
To test it from a smart contract, see this [Example](/docs/api-array-response/).

```jpv2
{% include 'samples/NodeOperators/jobs/get-string.toml' %}
```
