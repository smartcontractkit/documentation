---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Mean Task"
permalink: "docs/jobs/task-types/mean/"
---

Accepts multiple numerical inputs and returns the mean (average) of them.

**Parameters**

- `values`: an array of values to be averaged.
- `allowedFaults` (optional): the maximum number of input tasks that can error without the Mean task erroring. If not specified, this value defaults to `N - 1`, where `N` is the number of inputs.
- `precision`: the number of decimal places in the result.

**Outputs**

The average of the values in the `values` array.

**Example**

```jpv2
my_mean_task [type="mean"
              values=<[ $(fetch1), $(fetch2), $(fetch3) ]>
              precision=2
              allowedFaults=1]
```

Given the inputs `2`, `5`, and `20`, the task will return `9`.
