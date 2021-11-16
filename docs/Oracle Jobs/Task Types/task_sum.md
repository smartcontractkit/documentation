---
layout: nodes.liquid
date: Last Modified
title: "Sum Task"
permalink: "docs/jobs/task-types/sum/"
---

Accepts multiple numerical inputs and returns the sum of them.

**Parameters**

- `values`: an array of values to sum.
- `allowedFaults` (optional): the maximum number of input tasks that can error without the Sum task erroring. If not specified, this value defaults to `N - 1`, where `N` is the number of inputs.

**Outputs**

The sum of the values in the `values` array.

**Example**

```jpv2
my_sum_task [type="sum"
             values=<[ $(fetch1), $(fetch2), $(fetch3) ]>
             allowedFaults=1]
```

Given the inputs `2`, `5`, and `20`, the task will return `27`.
