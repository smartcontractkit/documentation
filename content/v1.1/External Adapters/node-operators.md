---
layout: nodes.liquid
title: "Adding External Adapters to Nodes"
slug: "node-operators"
hidden: false
date: Last Modified
---
External adapters are added to the Chainlink node by creating a bridge type. Bridges define the task's name and URL of the external adapter. When a task type is received that is not one of the core adapters, the node will search for a bridge type with that name, utilizing the bridge to your external adapter. Bridge and task type names are case insensitive.

To create a bridge on the node, you can navigate to the "Create Bridge" page in the GUI. From there, you will specify a Name, URL, and optionally the number of Confirmations for the bridge.
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/43ac349-Screenshot_from_2018-12-07_06-37-27.png",
        "Screenshot from 2018-12-07 06-37-27.png",
        1064,
        699,
        "#f8f8f9"
      ]
    }
  ]
}
[/block]
The Bridge Name should be unique to the local node, and the Bridge URL should be the URL of your external adapter, whether local or on a separate machine.

To add jobs which use the bridge, simply give their bridge name to the task type, as shown below for the `randomNumber` type.

```json
{
  "initiators": [
    { "type": "runLog" }
  ],
  "tasks": [
    { "type": "randomNumber" },
    { "type": "copy",
      "params": {"copyPath": ["details", "current"]}},
    { "type": "multiply",
      "params": {"times": 100 }},
    { "type": "ethuint256" },
    { "type": "ethtx" }
  ]
}
```

Since `randomNumber` is not a [core adapter](doc:adapters), it is an external adapter that each node on the request needs to have in order to fulfill the request. If you try to add a task type that does not exist already as a bridge, the job will fail to create.

You can also exclude extra parameters from the spec when creating the job. This will allow requesters the ability to specify them per-request:

```json
{
  "initiators": [
    { "type": "runLog" }
  ],
  "tasks": [
    { "type": "randomNumber" },
    { "type": "copy" },
    { "type": "multiply" },
    { "type": "ethuint256" },
    { "type": "ethtx" }
  ]
}
```