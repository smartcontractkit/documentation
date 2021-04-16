---
layout: nodes.liquid
date: Last Modified
title: "Adding Jobs to Your Node"
permalink: "docs/adding-jobs-to-your-node/"
hidden: true
---
Below are the [Job Specifications](../job-specifications) for the jobs available on the [Addresses & Job IDs](../addresses-and-job-ids) page.
[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbytes32\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "text",
      "name": "HttpGet -> Bytes32"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httppost\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbytes32\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "text",
      "name": "HttpPost -> Bytes32"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "text",
      "name": "HttpGet -> Int256"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"multiply\"\n    },\n    {\n      \"type\": \"ethuint256\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "text",
      "name": "HttpGet -> Uint256"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"initiators\": [\n    {\n      \"type\": \"runlog\",\n      \"params\": {\n        \"address\": \"YOUR_ORACLE_CONTRACT_ADDRESS\"\n      }\n    }\n  ],\n  \"tasks\": [\n    {\n      \"type\": \"httpget\"\n    },\n    {\n      \"type\": \"jsonparse\"\n    },\n    {\n      \"type\": \"ethbool\"\n    },\n    {\n      \"type\": \"ethtx\"\n    }\n  ]\n}",
      "language": "text",
      "name": "HttpGet -> Bool"
    }
  ]
}
[/block]