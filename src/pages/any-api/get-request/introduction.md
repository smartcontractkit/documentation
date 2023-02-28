---
layout: ../../../layouts/MainLayout.astro
section: anyApi
date: Last Modified
title: "Make a GET Request"
permalink: "docs/any-api/get-request/introduction/"
whatsnext:
  {
    "Single Word Response": "/any-api/get-request/examples/single-word-response/",
    "Multi-Variable Responses": "/any-api/get-request/examples/multi-variable-responses/",
    "Fetch data from an Array": "/any-api/get-request/examples/array-response/",
    "Large Responses": "/any-api/get-request/examples/large-responses/",
    "Make an Existing Job Request": "/any-api/get-request/examples/existing-job-request/",
    "API Reference": "/any-api/api-reference/",
    "Testnet Oracles": "/any-api/testnet-oracles/",
    "Data Provider Nodes": "/any-api/data-providers/introduction/",
  }
metadata:
  title: "Make a GET Request"
  description: "Learn how to make a GET request to an API from a smart contract, using Chainlink."
  image:
    0: "/files/930cbb7-link.png"
setup: |
  import AnyApiCallout from "@features/any-api/common/AnyApiCallout.astro"
---

This series of guides explains how to make HTTP GET requests to external APIs from smart contracts, using Chainlink's [Request & Receive Data](/any-api/introduction/) cycle.

<AnyApiCallout callout="common" />

## Examples

### Single Word Response

This [guide](/any-api/get-request/examples/single-word-response/) explains how to make an HTTP GET request and parse the _json_ response to retrieve the value of one single attribute.

### Multi-Variable Responses

This [guide](/any-api/get-request/examples/multi-variable-responses/) explains how to make an HTTP GET request and parse the _json_ response to retrieve the values of multiple attributes.

### Fetch data from an Array

This [guide](/any-api/get-request/examples/array-response/) explains how to make an HTTP GET request that returns a _json_ array and parse it to retrieve the target element's value.

### Large Responses

This [guide](/any-api/get-request/examples/large-responses/) explains how to make an HTTP Get request that returns a _json_ containing an arbitrary-length raw byte data and parse it to return the data as _bytes_ data type.

### Make an Existing Job Request

This [guide](/any-api/get-request/examples/existing-job-request/) explains how to call a job that leverages [External adapters](/chainlink-nodes/external-adapters/external-adapters/) and returns the relevant data to the smart contract. This allows building succinct smart contracts that do not need to comprehend the URL or the response format of the target API.
