---
layout: nodes.liquid
date: Last Modified
title: "Bridges: Adding External Adapters to Nodes"
permalink: "docs/node-operators/"
hidden: false
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

Since `randomNumber` is not a [core adapter](../adapters/), it is an external adapter that each node on the request needs to have in order to fulfill the request. If you try to add a task type that does not exist already as a bridge, the job will fail to create.

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

## Testing External Adapters and Bridges

The easiest way to test to see if you're external adapter is working, is to use a web job. You can read more about the [web initiator here](/docs/initiators/#web).

Let's say you have an external adapter called `weather-cl-ea` and it's registered in the `bridges` tab. It takes 1 parameter: `city:boston`, and in solidity, you'd pass the parameter with: 
```javascript
request.add("city","boston")
```
How can we test the adapter on our node?

The easiest way is to setup a web job and manually add the parameter. 

```json
{
  "name": "weather-cl-ea BOSTON",
  "initiators": [
    {
      "type": "web"
    }
  ],
  "tasks": [
    {
      "type": "weather_cl_ea",
      "params": {
        "city": "boston"
      }
    }
  ]
}
``` 

Adding the following:
```json
"params": {
        "city": "boston"
      }
```
Manually sets the parameters, and is equivalent to using `request.add` as shown above, or adding the data in the `--d` if you're using [curl](https://curl.se/).

There will be a big `Run` button on your job definition, just hit it to kick off the job. 
[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/b75c859-Screen_Shot_2021-02-19_at_11.44.44_AM.png",
        "Screen Shot 2021-02-19 at 11.44.44 AM.png",
        2372,
        396,
        "#f8f8f9"
      ]
    }
  ]
}
[/block]