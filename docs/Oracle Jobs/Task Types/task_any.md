---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "'Any' Task"
permalink: "docs/jobs/task-types/any/"
---

Returns a random value from the set of inputs passed in.

**Parameters**

None.

**Inputs**

Can be anything.

**Outputs**

A randomly-selected value from the set of inputs.

**Example**

```jpv2
fetch1   [type="http" ...]
fetch2   [type="http" ...]
fetch3   [type="http" ...]
pick_any [type="any"]

fetch1 -> pick_any
fetch2 -> pick_any
fetch3 -> pick_any
```

`pick_any` will return either the result of `fetch1`, `fetch2`, or `fetch3`.

