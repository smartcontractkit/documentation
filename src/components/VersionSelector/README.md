# Version Selector Component

A highly reusable, accessible, and performant version selector component for documentation systems.

## Adding Versioned API Reference for Your Product

### 1. Add Version Configuration

Add your product's versions in `src/config/versions/index.ts`:

```typescript
export const VERSIONS = {
  // Existing versions
  ccip: {
    LATEST: "v1.5.1",
    ALL: ["v1.5.1", "v1.5.0"] as const,
    RELEASE_DATES: {
      "v1.5.0": "2023-10-04T00:00:00Z",
      "v1.5.1": "2023-12-04T00:00:00Z",
    },
  },
  // Add your product here
  "your-product": {
    LATEST: "v1.0.0",
    ALL: ["v1.0.0", "v0.9.0"] as const,
    RELEASE_DATES: {
      "v1.0.0": "2023-12-01T00:00:00Z",
      "v0.9.0": "2023-11-01T00:00:00Z",
    },
    // Optional: DEPRECATED: ["v0.9.0"] as const,
  },
}
```

### 2. Create Sidebar Configuration

Create a JSON file for each version in `src/config/sidebar/your-product/api-reference/`:

```typescript
// v1_0_0.json
;[
  {
    title: "ContractName",
    url: "your-product/api-reference/v1.0.0/contract-name",
  },
  // ... more contracts/interfaces
]
```

Then import and use them in `src/config/sidebar.ts`:

```typescript
import productV100Contents from "./sidebar/your-product/api-reference/v1_0_0.json"

// In the sidebar configuration:
{
  section: "API Reference",
  contents: [
    {
      title: "Overview",
      url: "your-product/api-reference",
    },
    {
      title: "v1.0.0 (Latest)",
      url: "your-product/api-reference/v1.0.0",
      isCollapsible: true,
      children: productV100Contents,
    },
  ],
}
```

### 3. Create Content Structure

Follow this structure for your API reference content (example from CCIP):

```
src/content/your-product/api-reference/
├── index.mdx                # Landing page for API reference
├── v1.0.0/                 # Version directory (with dots)
│   ├── index.mdx          # Version landing page
│   ├── contract-name.mdx  # Contract documentation
│   ├── interface-name.mdx # Interface documentation
└── v0.9.0/               # Another version
    ├── index.mdx
    ├── contract-name.mdx
    └── interface-name.mdx
```

Real example from Chainlink Local:

```
src/content/chainlink-local/api-reference/
├── index.mdx
├── v0.2.3/
│   ├── aggregator-interface.mdx
│   ├── aggregator-v2-v3-interface.mdx
│   ├── aggregator-v3-interface.mdx
│   ├── ccip-local-simulator.mdx
└── index.mdx
└── v0.2.2/
    ├── aggregator-interface.mdx
    ├── aggregator-v2-v3-interface.mdx
    ├── aggregator-v3-interface.mdx
    ├── ccip-local-simulator.mdx
    └── index.mdx
```

### 4. Add Frontmatter

Each MDX file should have this frontmatter:

```mdx
---
title: Your API Title
section: chainlinkLocal # Must match section enum in content config
date: 2023-01-01 # Optional
metadata:
  description: "API documentation for YourContract in Solidity"
  canonical: "/your-product/api-reference/v1.0.0/your-contract"
---

import { Aside } from "@components"
import Common from "@features/your-product/Common.astro"

<Common callout="importPackage100" />

Your content here...
```

That's it! The version selector will automatically appear for your API reference pages.

## URL Structure

The version selector expects URLs to follow this pattern:
`/your-product/api-reference/v1.0.0/[page-path]`

- Product: Must match your config key in `VERSIONS`
- Version: Must match one in your version config (with dots, e.g., `v1.5.1`)
- Page Path: Your documentation structure (e.g., `client`, `errors`, etc.)

## Features

- 🎯 Zero Runtime Overhead
- 🎨 Modern CSS Features
- ⚡️ Optimized Performance
- ♿️ Fully Accessible
- 🌗 Dark Mode Support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported
