---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Mode Task"
permalink: "docs/jobs/task-types/mode/"
---

Accepts multiple numerical inputs and returns the mode (most common) of them. If more than one value occur the maximum number of times, it returns all of them.

**Parameters**

- `values`: an array of values from which to select a mode.
- `allowedFaults` (optional): the maximum number of input tasks that can error without the Mode task erroring. If not specified, this value defaults to `N - 1`, where `N` is the number of inputs.

**Outputs**

A map containing two keys:

```json
{
    "results": [ ... ], // An array containing all of the values that occurred the maximum number of times
    "occurrences": ..., // The number of times those values occurred
}
```

**Example**

```jpv2
my_median_task [type="median"
                values=<[ $(fetch1), $(fetch2), $(fetch3), $(fetch4), $(fetch5), $(fetch6), $(fetch7), $(fetch8) ]>
                allowedFaults=3]
```

Given a `values` array containing `[ 2, 5, 2, "foo", "foo" "bar", "foo", 2 ]`, the task will return:

```json
{
    "results": [ 2, "foo" ],
    "occurrences": 3
}
````
