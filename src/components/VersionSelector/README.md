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
  },
  // Add your product here
  "your-product": {
    LATEST: "v1.0.0",
    ALL: ["v1.0.0", "v0.9.0"] as const,
    // Optional: DEPRECATED: ["v0.9.0"] as const,
  },
}
```

### 2. Create Content Structure

Follow this structure for your API reference content (example from CCIP):

```
src/content/your-product/api-reference/
├── index.mdx                # Landing page for API reference
├── v1.0.0/                 # Version directory (with dots)
│   ├── index.mdx          # Version landing page
│   ├── endpoints.mdx      # API documentation
│   ├── errors.mdx        # More documentation
└── v0.9.0/               # Another version
    ├── index.mdx
    ├── endpoints.mdx
    └── errors.mdx
```

Real example from CCIP:

```
src/content/ccip/api-reference/
├── index.mdx
├── v1.5.0/
│   ├── burn-from-mint-token-pool.mdx
│   ├── burn-mint-token-pool.mdx
│   ├── ccip-receiver.mdx
│   ├── client.mdx
│   ├── errors.mdx
│   └── index.mdx
└── v1.5.1/
    ├── burn-from-mint-token-pool.mdx
    ├── burn-mint-token-pool.mdx
    ├── ccip-receiver.mdx
    ├── client.mdx
    ├── errors.mdx
    └── index.mdx
```

### 3. Add Frontmatter

Each MDX file should have this frontmatter:

```mdx
---
title: Your API Title
section: ccip # Must match section enum in content config
date: 2023-01-01 # Optional
---

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
