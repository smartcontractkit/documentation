---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Less Than Task"
permalink: "docs/jobs/task-types/lessthan/"
---

Returns a boolean, result of computing `left` < `right`.

**Parameters**

- `left`: the left hand side of comparison. Possible values:
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `right`: the right hand side of comparison. Possible values:
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`

**Outputs**

The result of less than comparison.

**Example**

```jpv2
my_lessthan_task [type="lessthan" left="3" right="10"]
```

the task will return true which is the result of `3 < 10`
