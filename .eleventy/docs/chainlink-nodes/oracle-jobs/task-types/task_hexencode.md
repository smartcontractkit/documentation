---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Hex Encode Task"
permalink: "docs/jobs/task-types/hexencode/"
---

Encodes bytes/string/integer into a hexadecimal string.

**Parameters**

- `input`: Byte array, string or integer to be encoded.

**Outputs**

Hexadecimal string prefixed with "0x" (or empty string if input was empty).

**Example**

```jpv2
my_hexencode_task [type="hexencode" input="xyz"]
```

Given the input string "xyz", the task will return "0x78797a", which are the ascii values of characters in the string.
