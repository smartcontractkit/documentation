---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Job Pipelines"
permalink: "docs/jobs/task-types/pipelines/"
---

## Writing pipelines

Pipelines are composed of tasks arranged in a DAG (directed acyclic graph). Pipelines are expressed in [DOT syntax](https://en.wikipedia.org/wiki/DOT_%28graph_description_language%29#Directed_graphs).

Each node in the graph is a task with a user-specified ID and a set of configuration parameters and attributes:

```jpv2
my_fetch_task [type="http" method=GET url="https://chain.link/eth_usd"]
```

The edges between tasks define how data flows from one task to the next. Some tasks can have multiple inputs, such as `median`. Other tasks are limited to 0 (`http`) or 1 (`jsonparse`).

```jpv2
data_source_1  [type="http" method=GET url="https://chain.link/eth_usd"]
data_source_2  [type="http" method=GET url="https://coingecko.com/eth_usd"]
medianize_data [type="median"]
submit_to_ea   [type="bridge" name="my_bridge"]

data_source_1 -> medianize_data
data_source_2 -> medianize_data
medianize_data -> submit_to_ea
```

![DAG Example](/images/dag_example.png)
