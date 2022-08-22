---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Base64 Decode Task"
permalink: "docs/jobs/task-types/base64decode/"
---

Accepts a base64 encoded string and returns decoded bytes.

**Parameters**

- `input`: a base64 encoded string.

**Outputs**

Decoded bytes.

**Example**

```jpv2
my_base64decode_task [type="base64decode" input="SGVsbG8sIHBsYXlncm91bmQ="]
```

Given the input `SGVsbG8sIHBsYXlncm91bmQ=`, the task will return `Hello, playground` (as ASCII bytes).
