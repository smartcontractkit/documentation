---
layout: nodes.liquid
date: Last Modified
title: 'MultiWord Example Job Spec'
permalink: "docs/example-job-spec-large/"
---

This is an example v1 job spec for returning multiple responses in 1 Chainlink API Call. 

```json
{
  "name": "large-word",
  "initiators": [
    {
      "id": 9,
      "jobSpecId": "7a97ff84-93ec-406d-9062-1b2531f9251a",
      "type": "runlog",
      "params": {
        "address": "0xc57b33452b4f7bb189bb5afae9cc4aba1f7a4fd8"
      }
    }
  ],
  "tasks": [
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "httpget"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "jsonparse"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "resultcollect"
    },
    {
      "jobSpecId": "7a97ff8493ec406d90621b2531f9251a",
      "type": "ethtx",
      "confirmations": 1,
      "params": {
        "abiEncoding": [
          "bytes32",
          "bytes"
        ]
      }
    }
  ]
}
```
