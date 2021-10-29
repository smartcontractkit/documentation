---
layout: nodes.liquid
date: Last Modified
title: 'MultiWord Example Job Spec'
permalink: "docs/example-job-spec-multi-word/"
---

This is an example v1 job spec for returning multiple responses in 1 Chainlink API Call. 

```json
{
  "name": "multi-word",
  "initiators": [
    {
      "id": 3,
      "jobSpecId": "64566152-8ea4-4aa7-b137-ed9f9d54c3d5",
      "type": "runlog",
      "params": {
        "address": "0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8"
      }
    }
  ],
  "tasks": [
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "httpget",
      "params": {
        "get": "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR"
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "jsonparse",
      "params": {
        "path": [
          "USD"
        ]
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "multiply",
      "params": {
        "times": 100
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "ethuint256"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "resultcollect"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "httpget",
      "params": {
        "get": "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR"
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "jsonparse",
      "params": {
        "path": [
          "EUR"
        ]
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "multiply",
      "params": {
        "times": 100
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "ethuint256"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "resultcollect"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "httpget",
      "params": {
        "get": "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,JPY,EUR"
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "jsonparse",
      "params": {
        "path": [
          "JPY"
        ]
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "multiply",
      "params": {
        "times": 100
      }
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "ethuint256"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "resultcollect"
    },
    {
      "jobSpecId": "645661528ea44aa7b137ed9f9d54c3d5",
      "type": "ethtx",
      "confirmations": 1,
      "params": {
        "abiEncoding": [
          "bytes32",
          "bytes32",
          "bytes32",
          "bytes32"
        ]
      }
    }
  ]
}
```
