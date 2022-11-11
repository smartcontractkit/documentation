---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: 'Make a GET Request'
permalink: 'docs/any-api/get-request/introduction/'
whatsnext:
  {
    'Single Word Response': '/docs/any-api/get-request/examples/single-word-response/',
    'Multi-Variable Responses': '/docs/any-api/get-request/examples/multi-variable-responses/',
    'Fetch data from an Array': '/docs/any-api/get-request/examples/api-array-response/',
    'Large Responses': '/docs/any-api/get-request/examples/large-responses/',
    'Make an Existing Job Request': '/docs/any-api/get-request/examples/existing-job-request/',
    'API Reference': '/docs/any-api/api-reference/',
    'Testnet Oracles': '/docs/any-api/testnet-oracles/',
    'Data Provider Nodes': '/docs/any-api/data-providers/introduction/',
  }
metadata:
  title: 'Make a GET Request'
  description: 'Learn how to make a GET request to an API from a smart contract, using Chainlink.'
  image:
    0: '/files/930cbb7-link.png'
---

## Overview

This series of guides explains how to make HTTP GET requests to external APIs from smart contracts, using Chainlink's [Request & Receive Data](/docs/any-api/introduction/) cycle.

{% include 'sections/any-api-common-prereq.md' %}

**Topics**

- [Examples](#examples)
  - [Single Word Response](#single-word-response)
  - [Multi-Variable Responses](#multi-variable-responses)
  - [Fetch data from an Array](#fetch-data-from-an-array)
  - [Large Responses](#large-responses)
  - [Make an Existing Job Request](#make-an-existing-job-request)

## Examples

### Single Word Response

This [guide](/docs/any-api/get-request/examples/single-word-response/) explains how to make an HTTP GET request and parse the _json_ response to retrieve the value of one single attribute.

### Multi-Variable Responses

This [guide](/docs/any-api/get-request/examples/multi-variable-responses/) explains how to make an HTTP GET request and parse the _json_ response to retrieve the values of multiple attributes.

### Fetch data from an Array

This [guide](/docs/any-api/get-request/examples/api-array-response/) explains how to make an HTTP GET request that returns a _json_ array and parse it to retrieve the target element's value.

### Large Responses

This [guide](/docs/any-api/get-request/examples/large-responses/) explains how to make an HTTP Get request that returns a _json_ containing an arbitrary-length raw byte data and parse it to return the data as _bytes_ data type.

### Make an Existing Job Request

This [guide](/docs/any-api/get-request/examples/existing-job-request/) explains how to call a job that leverages [External adapters](/docs/external-adapters/) and returns the relevant data to the smart contract. This allows building succinct smart contracts that do not need to comprehend the URL or the response format of the target API.
