---
layout: nodes.liquid
date: Last Modified
title: "Introduction"
permalink: "docs/introduction/"
hidden: false
---
This API reference provides information on how to interact directly with a Chainlink node. If you are creating services which need direct communication with a Chainlink node, this information will be helpful for you. If you are wanting to connect an external resource (API) to a smart contract using Chainlink, please see the the [Developers section of external adapters](../developers).

Most endpoints of the Chainlink node require session authentication. You will need to [POST](ref:sessions) to `/session` to create a cookie to be used for subsequent requests.