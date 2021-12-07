---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Divide Task"
permalink: "docs/jobs/task-types/divide/"
---

Divides the provided `input` and `times` values.

**Parameters**

- `input`: the value to be divided. Possible values:
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `divisor`: the value by which to divide the `input`.
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `precision`: the number of decimal places to retain.
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`

**Outputs**

The result of the division.

**Example**

```jpv2
my_divide_task [type="divide"
                input="$(json_parse_result)"
                divisor="3"
                precision="2"]
```

Given the input `10`, the task will return `3.33`.

