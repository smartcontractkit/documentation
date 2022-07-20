---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Hex Decode Task"
permalink: "docs/jobs/task-types/hexdecode/"
---

Accepts a hexadecimal encoded string and returns decoded bytes.

**Parameters**

- `input`: a hexadecimal encoded string, must have prefix `0x`.

**Outputs**

Decoded bytes.

**Example**

```jpv2
my_hexdecode_task [type="hexdecode" input="0x12345678"]
```

Given the input `0x12345678`, the task will return `[0x12, 0x34, 0x56, 0x78]`.
