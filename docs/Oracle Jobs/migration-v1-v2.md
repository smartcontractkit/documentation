---
layout: nodes.liquid
date: Last Modified
title: "Jobs"
permalink: "docs/jobs/"
whatsnext: {"Tasks":"/docs/tasks/"}
---

## Example Migrations

### EthBytes32 (GET)

#### V1 spec:

```json
{ 
  "name": "Get > Bytes32",
  "initiators": [
    {
      "type": "runlog",
      "params": {
        "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
      }
    }
  ],
  "tasks": [
    {
      "type": "httpget"
    },
    {
      "type": "jsonparse"
    },
    {
      "type": "ethbytes32"
    },
    {
      "type": "ethtx"
    }
  ]
}
```

Note that in V1, the job ID is randomly generated at creation time. In V2 it can either be automatically generated, or manually specified. 

#### V2 spec:

```toml
type                = "directrequest"
schemaVersion       = 1
name                = "Get > Bytes32"
contractAddress     = "YOUR_ORACLE_CONTRACT_ADDRESS"
externalJobID       = "0EEC7E1D-D0D2-476C-A1A8-72DFB6633F47" # this can be manually specified (e.g. to match the old job spec ID) or omitted to automatically generate a random ID
observationSource   = """
    ds1          [type=http method=GET url="http://example.com" allowunrestrictednetworkaccess="true"];
    ds1_parse    [type=jsonparse path="USD"];
    ds1_multiply [type=multiply times=100];
    ds1 -> ds1_parse -> ds1_multiply;
"""
```
