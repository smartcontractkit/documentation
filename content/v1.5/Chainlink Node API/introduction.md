---
title: "Introduction"
slug: "introduction"
hidden: false
createdAt: "2018-10-09T13:13:20.758Z"
updatedAt: "2019-11-28T22:11:39.278Z"
---
This API reference provides information on how to interact directly with a Chainlink node. If you are creating services which need direct communication with a Chainlink node, this information will be helpful for you. If you are wanting to connect an external resource (API) to a smart contract using Chainlink, please see the the [Developers section of external adapters](doc:developers).

Most endpoints of the Chainlink node require session authentication. You will need to [POST](ref:sessions) to `/session` to create a cookie to be used for subsequent requests.