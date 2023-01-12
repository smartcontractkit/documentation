---
layout: ../../../layouts/MainLayout.astro
section: chainlinkFunctions
date: Last Modified
title: "Chainlink Functions Service Limits"
whatsnext: { "What's next?": "/chainlink-functions/tutorials/" }
---

| Item                                         | Limits                                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Supported languages                          | Only JavaScript is supported for the moment. Your source code can only use vanilla Node.js features (you cannot import modules) |
| Maximum requests in flight                   | Limited by the [effective balance](/chainlink-functions/resources/concepts#subscriptions)                                       |
| Maximum callback gas limit                   | 300,000                                                                                                                         |
| Maximum subscriptions                        | unbounded                                                                                                                       |
| Maximum consumer contracts per subscription  | 100                                                                                                                             |
| Request fulfillment timeout                  | 5 minutes                                                                                                                       |
| Maximum request size                         | 30 kilobytes                                                                                                                    |
| Maximum response size                        | 256 bytes                                                                                                                       |
| Maximum source code execution time           | 10 seconds                                                                                                                      |
| Maximum memory allocated to the source code  | 128 megabytes                                                                                                                   |
| Maximum HTTP queries                         | 5                                                                                                                               |
| HTTP query timeout                           | 3 seconds                                                                                                                       |
| Maximum URL length                           | 2048 characters                                                                                                                 |
| Maximum HTTP request length (body + headers) | 2 kilobytes                                                                                                                     |
| Maximum HTTP response length                 | 2 megabytes                                                                                                                     |
