---
layout: ../../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Uppercase Task"
permalink: "docs/jobs/task-types/uppercase/"
---

Accepts a string and returns an uppercase string.

**Parameters**

- `input`: a string.

**Outputs**

Uppercase string.

**Example**

```toml
my_uppercase_task [type="uppercase" input="Hello World!"]
```

Given the input `Hello World!`, the task will return `HELLO WORLD!`.
