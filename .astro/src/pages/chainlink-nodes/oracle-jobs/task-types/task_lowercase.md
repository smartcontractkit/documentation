---
layout: ../../../../layouts/MainLayout.astro
section: nodeOperator
date: Last Modified
title: "Lowercase Task"
permalink: "docs/jobs/task-types/lowercase/"
---

Accepts a string and returns a lowercase string.

**Parameters**

- `input`: a string.

**Outputs**

Lowercase string.

**Example**

```toml
my_lowercase_task [type="lowercase" input="Hello World!"]
```

Given the input `Hello World!`, the task will return `hello world!`.
