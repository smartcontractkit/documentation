---
layout: nodes.liquid
date: Last Modified
title: "Multiply Task"
permalink: "docs/jobs/task-types/multiply/"
---

Multiplies the provided `input` and `times` values.

**Parameters**

- `input`: the value to be multipled. Possible values:
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`
- `times`: the value to multiply the input with.
    - number
    - stringified number
    - bytes-ified number
    - `$(variable)`

**Outputs**

The result of the multiplication.

**Example**

```jpv2
my_multiply_task [type="multiply" input="$(json_parse_result)" times=3]
```

Given the input `10`, the task will return `30`.

