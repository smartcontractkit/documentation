---
layout: nodes.liquid
date: Last Modified
title: "Service Agreement Examples"
permalink: "docs/service-agreement-examples/"
hidden: true
---
The example below is a simple service agreement where each node will reach out to the same endpoint and return their individual results.

```json Example 1
{
    "initiators": [
        {
            "type": "execagreement"
        }
    ],
    "tasks": [
        {
            "type": "httpget",
            "params": {
                "get": "https://bitstamp.net/api/ticker/"
            }
        },
        {
            "type": "jsonparse",
            "params": {
                "path": [
                    "last"
                ]
            }
        },
        {
            "type": "multiply",
            "params": {
                "times": 100000000
            }
        },
        {
            "type": "ethuint256"
        },
        {
            "type": "ethtx"
        }
    ],
    "payment": "1000000000000000000",
    "expiration": 300,
    "oracles": [
        "0xA3Ce768F041d136E8d57fD24372E5fB510b797ec",
        "0x6e6f16b7c0a00a2ac1136b3ae3e4641f1faf8d7f",
        "0xc99B3D447826532722E41bc36e644ba3479E4365",
        "0x1948C20CC492539968BB9b041F96D6556B4b7001",
        "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721"
    ],
    "endAt": "2019-10-19T22:17:19Z"
}
```

The example below shows how an external adapter can be used to retrieve the price from multiple sources in the same job.

```json Example 2
{
    "initiators": [
        {
            "type": "execagreement"
        }
    ],
    "tasks": [
        {
            "type": "priceAdapter",
            "params": {
                "coin": "ETH",
                "market": "USD"
            }
        },
        {
            "type": "multiply",
            "params": {
                "times": 100000000
            }
        },
        {
            "type": "ethuint256"
        },
        {
            "type": "ethtx"
        }
    ],
    "payment": "1000000000000000000",
    "expiration": 300,
    "oracles": [
        "0xA3Ce768F041d136E8d57fD24372E5fB510b797ec",
        "0x6e6f16b7c0a00a2ac1136b3ae3e4641f1faf8d7f",
        "0xc99B3D447826532722E41bc36e644ba3479E4365",
        "0x1948C20CC492539968BB9b041F96D6556B4b7001",
        "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721"
    ],
    "endAt": "2019-10-19T22:17:19Z"
}
```