# Version Selector Component

A React/Astro component for handling versioned API documentation with SEO support and version availability checks.

## Setup Tutorial

### 1. Content Structure

Create your API reference content following this structure:

```
src/content/your-product/api-reference/
├── index.mdx                # Main API reference landing page
├── v1.0.0/                 # Version directory
│   ├── index.mdx          # Version landing page
│   ├── contract-1.mdx     # Contract documentation
│   ├── contract-2.mdx     # More contracts...
│   └── interface-1.mdx    # Interface documentation
└── v0.9.0/                # Another version
    ├── index.mdx
    └── ...
```

Example from Chainlink Local:

```
src/content/chainlink-local/api-reference/
├── index.mdx
├── v0.2.3/
│   ├── aggregator-interface.mdx
│   ├── ccip-local-simulator.mdx
│   └── ...
└── v0.2.2/
    ├── aggregator-interface.mdx
    └── ...
```

### 2. Version Configuration

Update `src/config/versions/index.ts`:

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
  // Add your product
  "your-product": {
    LATEST: "v1.0.0",
    ALL: ["v1.0.0", "v0.9.0"] as const,
    RELEASE_DATES: {
      "v1.0.0": "2023-12-01T00:00:00Z",
      "v0.9.0": "2023-11-01T00:00:00Z",
    },
    // Optional: mark deprecated versions
    DEPRECATED: ["v0.9.0"] as const,
  },
}
```

### 3. Page Availability (Optional)

If some pages are version-specific, update `src/config/versions/page-availability.ts`:

```typescript
export const PAGE_AVAILABILITY: Record<string, Record<string, PageAvailability>> = {
  "your-product": {
    "contract-1": {
      // Page only exists in these versions
      onlyAvailableIn: ["v1.0.0"],
    },
    "contract-2": {
      // Page doesn't exist in these versions
      notAvailableIn: ["v0.9.0"],
    },
  },
}
```

### 4. Sidebar Configuration

1. Create version-specific JSON files in `src/config/sidebar/your-product/api-reference/`:

```typescript
// v1_0_0.json
;[
  {
    title: "Contract 1",
    url: "your-product/api-reference/v1.0.0/contract-1",
  },
  {
    title: "Contract 2",
    url: "your-product/api-reference/v1.0.0/contract-2",
  },
]
```

2. Update `src/config/sidebar.ts`:

```typescript
import productV100Contents from "./sidebar/your-product/api-reference/v1_0_0.json"

export const SIDEBAR = {
  "your-product": {
    "api-reference": [
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
  },
}
```

### 5. Page Frontmatter

Each MDX file should have this frontmatter:

```mdx
---
section: yourProduct
date: Last Modified
title: "Contract Name v1.0.0 API Reference"
metadata:
  description: "API documentation for ContractName in Solidity, version v1.0.0."
---

import { Aside } from "@components"
import Common from "@features/your-product/Common.astro"

<Common callout="importPackage100" />

## ContractName

Your content here...
```

Note: No need to specify `canonical` in frontmatter as it's handled by VersionSelectorHead.

## Features

- Version selection UI with enhanced accessibility
- SEO-friendly metadata generation
- Version availability checks
- Trailing slash preservation
- Device capability detection
- Progressive enhancement
- Graceful error handling

## Key Components

### VersionSelectorClient.tsx

Client-side component handling version selection and navigation:

- Checks page availability in target versions
- Preserves trailing slashes
- Shows user-friendly error messages
- Handles device capabilities
- Provides loading states

### VersionSelectorHead.astro

Generates SEO metadata and alternate version links:

- Structured data (schema.org)
- Version alternates
- Canonical URLs (automatically handled)
- Version status metadata
- Changelog links

## Configuration

### Page Availability

Configure version availability in `page-availability.ts`:

```typescript
type PageAvailability = {
  notAvailableIn?: string[]
  onlyAvailableIn?: string[]
}

export const PAGE_AVAILABILITY: Record<string, Record<string, PageAvailability>> = {
  "product-name": {
    "page-path": {
      notAvailableIn: ["v1.0.0"],
      onlyAvailableIn: ["v2.0.0"],
    },
  },
}
```

### Version Configuration

Configure versions in your product's version config:

```typescript
export const VERSIONS = {
  ALL: ["v2.0.0", "v1.0.0"] as const,
  LATEST: "v2.0.0",
  DEPRECATED: ["v1.0.0"],
}
```

## Usage

```astro
---
// In your layout
import { VersionSelector } from "@components/VersionSelector"
---

<VersionSelector product="your-product" version="v2.0.0" currentPath="/your-product/api-reference/v2.0.0/some-page" />
```

## Important Notes

1. **SEO Handling**:

   - Canonical URLs are automatically handled by VersionSelectorHead
   - No need to specify canonical in page frontmatter
   - Alternate links are generated only for available versions

2. **Version Availability**:

   - Pages can be marked as only available in specific versions
   - Pages can be marked as not available in specific versions
   - Default behavior assumes page is available in all versions

3. **URL Handling**:

   - Trailing slashes are preserved during version changes
   - URLs are built consistently using buildVersionUrl utility
   - Version patterns are validated against configuration

4. **Error Handling**:

   - Clear error messages for unavailable versions
   - Graceful fallbacks for unsupported features
   - Loading states during version changes

5. **Accessibility**:
   - ARIA labels and roles
   - Progressive enhancement
   - Motion preferences respect
   - Device capability detection

## Best Practices

1. Always configure page availability when a page is version-specific
2. Use the provided utilities for URL building and version validation
3. Test with and without trailing slashes
4. Consider motion preferences and device capabilities
5. Maintain consistent version patterns across your documentation

## TypeScript Support

The component is fully typed and includes:

- Version string literals
- Configuration types
- Product collection types
- Device capability types

## Browser Support

- Modern browsers with CSS Grid and Flexbox
- Fallbacks for backdrop-filter
- Motion reduction media query support
- Progressive enhancement for older browsers
