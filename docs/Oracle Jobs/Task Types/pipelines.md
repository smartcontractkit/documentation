---
layout: nodes.liquid
date: Last Modified
title: "Job Pipelines"
permalink: "docs/jobs/task-types/pipelines/"
---

## Writing pipelines

Pipelines are composed of tasks arranged in a DAG (directed acyclic graph) expressed in DOT syntax:

[DOT (graph description language) - Wikipedia](https://en.wikipedia.org/wiki/DOT_%28graph_description_language%29#Directed_graphs)

Each node in the graph is a task, and has both a user-specified ID as well as a set of configuration parameters/attributes:

```dot
my_fetch_task [type="http" method="get" url="https://chain.link/eth_usd"]
```

The edges between tasks define how data flows from one task to the next. Some tasks can have multiple inputs (such as `median`), while others are limited to 0 (`http`) or 1 (`jsonparse`).

```dot
data_source_1  [type="http" method="get" url="https://chain.link/eth_usd"]
data_source_2  [type="http" method="get" url="https://coingecko.com/eth_usd"]
medianize_data [type="median"]
submit_to_ea   [type="bridge" name="my_bridge"]

data_source_1 -> medianize_data
data_source_2 -> medianize_data
medianize_data -> submit_to_ea
```

![DAG Example](/images/dag_example.png)
