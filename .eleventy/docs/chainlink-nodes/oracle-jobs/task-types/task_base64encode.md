---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Base64 Encode Task"
permalink: "docs/jobs/task-types/base64encode/"
---

Encodes bytes/string into a Base64 string.

**Parameters**

- `input`: Byte array or string to be encoded.

**Outputs**

String with Base64 encoding of input.

**Example**

```jpv2
my_base64encode_task [type="base64encode" input="Hello, playground"]
```

Given the input string "Hello, playground", the task will return "SGVsbG8sIHBsYXlncm91bmQ=".
