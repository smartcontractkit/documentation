---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: 'GET > String Example Job Spec'
permalink: 'docs/direct-request-get-string/'
---

This is an example v2 (TOML) job spec for returning a _string_ in one Chainlink API Call. Note that the job calls the `fulfillOracleRequest2` function. If you are a node operator, use an [Operator contract](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.7/Operator.sol) with this job.
To test it from a smart contract, see this [Example](/docs/api-array-response/).

```jpv2
{% include 'samples/NodeOperators/jobs/get-string.toml' %}
```
