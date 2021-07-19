---
layout: nodes.liquid
date: Last Modified
title: "FluxAggregator Uses"
permalink: "docs/fluxaggregator-uses/"
---
This page outlines the uses of the FluxAggregator contract for the node operators that feed data into it.
[block:api-header]
{
  "title": "Withdrawing funds"
}
[/block]

[block:callout]
{
  "type": "warning",
  "body": "Keep in mind the `oracle` variable is currently your node's address rather than your oracle contract's address."
}
[/block]
You'll need the following interface. Compile the code below. Any Solidity version greater than 0.5.0 should work fine:
[block:code]
{
  "codes": [
    {
      "code": "pragma solidity >=0.5.0;\n\ninterface FluxAggregatorNode {\n    function withdrawablePayment(address oracle) external view returns (uint256);\n    function withdrawPayment(address oracle, address recipient, uint256 amount) external;\n}",
      "language": "javascript",
      "name": "Interface"
    }
  ]
}
[/block]
You can throw that into Remix and use the `At Address` with the address of the FluxAggregator to be able to call the functions.
[block:image]
{
  "images": [
    {
      "image": [
        "/files/48a267a-Screenshot_20200605_162024.png",
        "Screenshot_20200605_162024.png",
        370,
        143,
        "#475069"
      ]
    }
  ]
}
[/block]
If using a tool which requires the ABI, you can use this:
[block:code]
{
  "codes": [
    {
      "code": "[\n\t{\n\t\t\"constant\": false,\n\t\t\"inputs\": [\n\t\t\t{\n\t\t\t\t\"internalType\": \"address\",\n\t\t\t\t\"name\": \"oracle\",\n\t\t\t\t\"type\": \"address\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"internalType\": \"address\",\n\t\t\t\t\"name\": \"recipient\",\n\t\t\t\t\"type\": \"address\"\n\t\t\t},\n\t\t\t{\n\t\t\t\t\"internalType\": \"uint256\",\n\t\t\t\t\"name\": \"amount\",\n\t\t\t\t\"type\": \"uint256\"\n\t\t\t}\n\t\t],\n\t\t\"name\": \"withdrawPayment\",\n\t\t\"outputs\": [],\n\t\t\"payable\": false,\n\t\t\"stateMutability\": \"nonpayable\",\n\t\t\"type\": \"function\"\n\t},\n\t{\n\t\t\"constant\": true,\n\t\t\"inputs\": [\n\t\t\t{\n\t\t\t\t\"internalType\": \"address\",\n\t\t\t\t\"name\": \"oracle\",\n\t\t\t\t\"type\": \"address\"\n\t\t\t}\n\t\t],\n\t\t\"name\": \"withdrawablePayment\",\n\t\t\"outputs\": [\n\t\t\t{\n\t\t\t\t\"internalType\": \"uint256\",\n\t\t\t\t\"name\": \"\",\n\t\t\t\t\"type\": \"uint256\"\n\t\t\t}\n\t\t],\n\t\t\"payable\": false,\n\t\t\"stateMutability\": \"view\",\n\t\t\"type\": \"function\"\n\t}\n]",
      "language": "json",
      "name": "ABI"
    }
  ]
}
[/block]