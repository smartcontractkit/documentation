# ChangelogSnippet Component

## What This Component Does

The ChangelogSnippet component displays the most recent changelog entry for a specific product or topic. It searches through changelog entries and shows the latest update in a card format with an expandable description.

## How to Use It

Import the component into your MDX file and provide a search query:

```astro
import ChangelogSnippet from "@components/ChangelogSnippet/ChangelogSnippet.astro"

<ChangelogSnippet query="ccip" />
```

## Props

| Prop    | Type   | Required | Description                                                                                 |
| ------- | ------ | -------- | ------------------------------------------------------------------------------------------- |
| `query` | string | Yes      | The search term used to find relevant changelog entries (e.g., "ccip", "vrf", "automation") |

## Complete Example

Here's a full example of using the component in your documentation page:

```astro
---
import ChangelogSnippet from "@components/ChangelogSnippet/ChangelogSnippet.astro"
---

# CCIP Documentation Learn about Cross-Chain Interoperability Protocol.

<ChangelogSnippet query="ccip" />
```

This will display the latest CCIP-related changelog entry with a link to view the full changelog.
