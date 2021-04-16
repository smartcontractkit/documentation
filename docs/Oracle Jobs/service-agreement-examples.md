---
layout: nodes.liquid
date: Last Modified
title: "Service Agreement Examples"
permalink: "docs/service-agreement-examples/"
hidden: true
---
The example below is a simple service agreement where each node will reach out to the same endpoint and return their individual results.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"execagreement\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"httpget\",\n\t\t\t\"params\": {\n\t\t\t\t\"get\": \"https://bitstamp.net/api/ticker/\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"jsonparse\",\n\t\t\t\"params\": {\n\t\t\t\t\"path\": [\n\t\t\t\t\t\"last\"\n\t\t\t\t]\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 100000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethuint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t],\n\t\"payment\": \"1000000000000000000\",\n\t\"expiration\": 300,\n\t\"oracles\": [\n\t\t\"0xA3Ce768F041d136E8d57fD24372E5fB510b797ec\",\n\t\t\"0x6e6f16b7c0a00a2ac1136b3ae3e4641f1faf8d7f\",\n\t\t\"0xc99B3D447826532722E41bc36e644ba3479E4365\",\n\t\t\"0x1948C20CC492539968BB9b041F96D6556B4b7001\",\n\t\t\"0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721\"\n\t],\n\t\"endAt\": \"2019-10-19T22:17:19Z\"\n}",
      "language": "json",
      "name": "Example 1"
    }
  ]
}
[/block]
The example below shows how an external adapter can be used to retrieve the price from multiple sources in the same job.
[block:code]
{
  "codes": [
    {
      "code": "{\n\t\"initiators\": [\n\t\t{\n\t\t\t\"type\": \"execagreement\"\n\t\t}\n\t],\n\t\"tasks\": [\n\t\t{\n\t\t\t\"type\": \"priceAdapter\",\n\t\t\t\"params\": {\n\t\t\t\t\"coin\": \"ETH\",\n\t\t\t\t\"market\": \"USD\"\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"multiply\",\n\t\t\t\"params\": {\n\t\t\t\t\"times\": 100000000\n\t\t\t}\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethuint256\"\n\t\t},\n\t\t{\n\t\t\t\"type\": \"ethtx\"\n\t\t}\n\t],\n\t\"payment\": \"1000000000000000000\",\n\t\"expiration\": 300,\n\t\"oracles\": [\n\t\t\"0xA3Ce768F041d136E8d57fD24372E5fB510b797ec\",\n\t\t\"0x6e6f16b7c0a00a2ac1136b3ae3e4641f1faf8d7f\",\n\t\t\"0xc99B3D447826532722E41bc36e644ba3479E4365\",\n\t\t\"0x1948C20CC492539968BB9b041F96D6556B4b7001\",\n\t\t\"0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721\"\n\t],\n\t\"endAt\": \"2019-10-19T22:17:19Z\"\n}",
      "language": "json",
      "name": "Example 2"
    }
  ]
}
[/block]