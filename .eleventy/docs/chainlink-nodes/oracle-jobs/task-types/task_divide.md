---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Divide Task"
permalink: "docs/jobs/task-types/divide/"
---

Divides the provided `input` by the `divisor` and returns the result with a number of decimal places defined in the `precision` value.

**Parameters**

- `input`: The value to be divided
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `divisor`: The value by which to divide the `input`
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `precision`: The number of decimal places to retain in the result
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

Given the input `10`, this example returns `3.33`.
