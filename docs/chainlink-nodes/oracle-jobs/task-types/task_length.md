---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Length Task"
permalink: "docs/jobs/task-types/length/"
---

Returns the length of a byte array or string.

**Parameters**

- `input`: Byte array, or string to get the length for.

**Outputs**

The length of the byte array or string.

**Note**: For strings containing multi-byte unicode characters, the output is the length in bytes and not number of characters.

**Example**

```jpv2
my_length_task [type="length" input="xyz"]
```

Given the input string "xyz", the task will return 3, length of the string.
