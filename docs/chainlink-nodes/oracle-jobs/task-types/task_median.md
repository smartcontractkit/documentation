---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Median Task"
permalink: "docs/jobs/task-types/median/"
---

Accepts multiple numerical inputs and returns the median of them.

**Parameters**

- `values`: an array of values from which to select a median.
- `allowedFaults` (optional): the maximum number of input tasks that can error without the Median task erroring. If not specified, this value defaults to `N - 1`, where `N` is the number of inputs.

**Outputs**

The median of the values in the `values` array.

**Example**

```jpv2
my_median_task [type="median"
                values=<[ $(fetch1), $(fetch2), $(fetch3) ]>
                allowedFaults=1]
```

Given the inputs `2`, `5`, and `20`, the task will return `5`.
