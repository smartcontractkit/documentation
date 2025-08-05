# SEO Metadata Guide for Technical Writers

This guide explains how to properly implement metadata for bulletproof SEO across all content types in the Chainlink documentation. Our SEO system uses both HTML meta tags and JSON-LD structured data to ensure optimal search engine visibility and rich result display.

## Table of Contents

- [Overview](#overview)
- [SEO Architecture](#seo-architecture)
- [Content Types & Templates](#content-types--templates)
- [Metadata Schema Reference](#metadata-schema-reference)
- [Best Practices](#best-practices)
- [Validation & Testing](#validation--testing)
- [Troubleshooting](#troubleshooting)

## Overview

### Dual SEO System

Our documentation uses a comprehensive dual SEO approach:

1. **HTML Meta Tags**: Traditional SEO elements (title, description, OpenGraph, Twitter Cards)
2. **JSON-LD Structured Data**: Schema.org compliant structured data for rich snippets and enhanced search results

Both systems work together automatically when you provide proper frontmatter metadata.

### Content Coverage

This system supports all content types:

- **Quickstarts**: Step-by-step getting started guides
- **Tutorials**: In-depth learning content
- **Concepts**: Educational explanations
- **Guides**: How-to documentation
- **API References**: Technical documentation

## SEO Architecture

### Automatic Processing Flow

```
Content (MDX) with Frontmatter
    ↓
Layout System (QuickstartLayout, DocsLayout, etc.)
    ↓
BaseLayout
    ↓
HeadSEO Component
    ↓
- HTML meta tags generation
- JSON-LD structured data generation
    ↓
Search Engine Crawler
```

### Generated Output

Every page automatically receives:

**HTML Meta Tags:**

```html
<title>Page Title | Chainlink Documentation</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />
<link rel="canonical" href="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta name="twitter:card" content="summary_large_image" />
```

**JSON-LD Structured Data:**

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["HowTo", "TechArticle"],
    "name": "Deploy Your First Smart Contract",
    "description": "Learn to deploy smart contracts in 10 minutes",
    "totalTime": "PT10M",
    "author": { "@type": "Organization", "name": "Chainlink" },
    "publisher": { "@type": "Organization", "name": "Chainlink" }
  }
</script>
```

## Content Types & Templates

### Quickstarts

**File Location**: `src/content/quickstarts/`

**Frontmatter Template:**

```yaml
---
title: "Deploy Your First Smart Contract"
description: "Write and deploy a smart contract in 10 minutes using Remix IDE"
image: "quickstart-deploy.webp"
products: ["general"]
time: "10 minutes"
requires: "MetaMask wallet"
---
```

**Generated Schema**: HowTo + TechArticle with quickstart-specific properties

- `totalTime`: Parsed from `time` field (e.g., "10 minutes" → "PT10M")
- `supply`: Generated from `requires` field
- `learningResourceType`: "Quickstart"

### Tutorials

**File Location**: `src/content/[product]/tutorials/`

**Frontmatter Template:**

```yaml
---
section: ccip
title: "Transfer Tokens Cross-Chain"
metadata:
  description: "Learn how to transfer tokens between blockchains using CCIP"
  excerpt: "ccip cross-chain token transfer tutorial hardhat solidity"
  estimatedTime: "45 minutes"
  difficulty: "intermediate"
  image: "/images/ccip-tutorial.png"
whatsnext:
  "Build a cross-chain dApp": "/ccip/tutorials/cross-chain-dapp"
---
```

**Generated Schema**: HowTo + TechArticle with tutorial properties

- `totalTime`: From `estimatedTime` field
- `educationalLevel`: From `difficulty` field
- `learningResourceType`: "Tutorial"

### Concepts

**File Location**: `src/content/[product]/concepts/`

**Frontmatter Template:**

```yaml
---
section: ccip
title: "CCIP Architecture Overview"
metadata:
  description: "Understanding the architecture of Chainlink CCIP"
  excerpt: "ccip architecture cross-chain protocol intermediate concepts"
  difficulty: "intermediate"
  image: "/images/ccip-architecture.png"
---
```

**Generated Schema**: TechArticle + LearningResource

- `educationalLevel`: From `difficulty` field
- `teaches`: Auto-generated from content analysis
- `learningResourceType`: "Concept"

### Guides

**File Location**: `src/content/[product]/guides/` or similar

**Frontmatter Template:**

```yaml
---
section: vrf
title: "Generate Random Numbers"
metadata:
  description: "Step-by-step guide to implement VRF in your smart contract"
  excerpt: "vrf random numbers smart contract solidity guide"
  estimatedTime: "30 minutes"
  difficulty: "beginner"
---
```

**Generated Schema**: HowTo + TechArticle

- Similar to tutorials but classified as "Guide"

### API References

**File Location**: `src/content/[product]/api-reference/`

**Frontmatter Template:**

```yaml
---
section: ccip
title: "Router Interface"
metadata:
  description: "Complete API reference for CCIP Router contract"
  excerpt: "ccip router api interface solidity smart contract reference"
  version: "1.6.0"
  datePublished: "2024-01-15T10:00:00Z"
  lastModified: "2024-03-10T14:30:00Z"
---
```

**Generated Schema**: APIReference + TechArticle

- `version`: API version from metadata
- `programmingModel`: Auto-detected (e.g., "Smart Contract")
- `targetPlatform`: "Blockchain"

## Metadata Schema Reference

### Required Fields

**All Content Types:**

- `title`: Page title (string)
- `metadata.description`: Meta description, 150-160 characters (string)

### Recommended Fields

**Enhanced SEO:**

- `metadata.excerpt`: Keywords for search optimization (string)
- `metadata.image`: Social sharing image path (string)
- `metadata.estimatedTime`: Reading/completion time (string, e.g., "30 minutes")
- `metadata.difficulty`: Content difficulty level ("beginner" | "intermediate" | "advanced")

**Quickstart Specific:**

- `time`: Completion time (string, e.g., "10 minutes")
- `requires`: Prerequisites (string)
- `products`: Product array (string[])

### Optional Fields

**Advanced SEO:**

- `metadata.canonical`: Canonical URL for duplicate content (string)
- `metadata.version`: Version for API references (string)
- `metadata.lastModified`: Last update date, ISO format (string)
- `metadata.datePublished`: Original publication date, ISO format (string)

### Field Validation Rules

**Time Formats:**

- Input: "10 minutes", "1 hour", "30 mins", "2 hours"
- Output: ISO 8601 duration (PT10M, PT1H, PT30M, PT2H)

**Difficulty Levels:**

- Must be one of: "beginner", "intermediate", "advanced"
- Maps to Schema.org `educationalLevel`

**Description Length:**

- Optimal: 150-160 characters
- Maximum: 300 characters
- Should include primary keywords

**Excerpt Keywords:**

- Space-separated keywords
- Include product name, main concepts, target audience
- Example: "ccip cross-chain token transfer tutorial hardhat solidity"

**Date Fields (Optional but Recommended):**

- `datePublished`: Use for first publication (ISO 8601 format: "2024-01-15T10:00:00Z")
- `lastModified`: Update when content changes significantly
- Falls back to current date if not provided

## Best Practices

### Writing Effective Descriptions

**Good Example:**

```yaml
description: "Learn how to transfer tokens between Ethereum and Polygon using Chainlink CCIP in this step-by-step tutorial"
```

**Why it works:**

- Clearly states the goal ("transfer tokens")
- Mentions specific networks ("Ethereum and Polygon")
- Includes the product ("Chainlink CCIP")
- Indicates content type ("step-by-step tutorial")
- Within 150-160 character limit

### Choosing Keywords for Excerpt

**Structure**: `[product] [main-concept] [secondary-concepts] [content-type] [tools] [audience]`

**Example:**

```yaml
excerpt: "ccip cross-chain token transfer tutorial hardhat solidity intermediate"
```

### Time Estimation Guidelines

**Quickstarts**: 5-15 minutes

- Quick setup or simple implementation
- Minimal explanation, focus on doing

**Tutorials**: 30-60 minutes

- Comprehensive learning experience
- Includes context and explanation

**Concepts**: 10-20 minutes

- Reading and understanding time
- No hands-on implementation

### Image Guidelines

**Path Format**: `/images/[product]/[descriptive-name].png`

**Requirements:**

- Minimum 1200x630px for social sharing
- Use WebP format when possible
- Include alt text context in filename

**Note**: Images are optional - the system automatically falls back to the Chainlink logo for social sharing if no custom image is provided.

### Content Hierarchy

**Use consistent section values:**

- `ccip`: Cross-Chain Interoperability Protocol
- `vrf`: Verifiable Random Function
- `automation`: Chainlink Automation
- `dataFeeds`: Data Feeds
- `chainlinkFunctions`: Chainlink Functions

## Validation & Testing

### Build-Time Validation

Run the validation script to check structured data compliance:

```bash
npm run validate-structured-data
```

This script validates:

- Required Schema.org properties
- ISO 8601 duration formats
- URL validity
- Content type classification

### Manual Testing Tools

**Google Rich Results Test:**

1. Build your page locally
2. Visit [Rich Results Test](https://search.google.com/test/rich-results)
3. Enter your page URL or paste HTML
4. Verify structured data recognition

**Schema.org Validator:**

1. Visit [Schema.org Validator](https://validator.schema.org/)
2. Paste your JSON-LD structured data
3. Check for compliance issues

### Common Validation Errors

**Missing Required Properties:**

```
Error: Missing required property 'headline' for type 'TechArticle'
```

Solution: Ensure `title` is provided in frontmatter

**Invalid Time Format:**

```
Error: Invalid duration format 'thirty minutes'
```

Solution: Use numeric format like "30 minutes"

**Missing Description:**

```
Error: Missing required property 'description'
```

Solution: Add `metadata.description` to frontmatter

## Troubleshooting

### Structured Data Not Appearing

**Check 1: Frontmatter Format**
Ensure proper YAML syntax:

```yaml
---
title: "Your Title"
metadata:
  description: "Your description"
  # More fields...
---
```

**Check 2: Required Fields**
Verify both `title` and `metadata.description` are present.

**Check 3: Build Process**
Run `npm run build` and check for errors in console.

### SEO Meta Tags Missing

**Issue**: Page shows "undefined" in title or description
**Solution**: Check that frontmatter includes required fields and follows the correct nested structure for your content type.

### Rich Snippets Not Showing

**Issue**: Google doesn't show rich snippets in search results
**Causes**:

1. New content (can take weeks to appear)
2. Missing required structured data properties
3. Content quality doesn't meet Google's standards

**Solution**: Use validation tools and ensure content provides real value to users.

### Quickstart vs Tutorial Classification

**Issue**: Uncertain which content type to use
**Guidelines**:

- **Quickstart**: Get something working quickly (≤15 minutes)
- **Tutorial**: Learn concepts thoroughly (30+ minutes)
- **Guide**: Solve a specific problem (varies)
- **Concept**: Understand how something works (reading time)

### Performance Impact

**Issue**: Concerns about SEO system affecting page load
**Reality**: Minimal impact

- JSON-LD scripts are small (typically <2KB)
- Processed at build time, not runtime
- No additional HTTP requests
- Automatic fallbacks prevent missing data

---

## Content Migration Checklist

When updating existing content for better SEO:

### Required (Critical)

- [ ] Add `metadata.description` (150-160 characters)
- [ ] Verify `title` is descriptive and unique

### Recommended (Enhanced SEO)

- [ ] Add `metadata.excerpt` (relevant keywords)
- [ ] Add `metadata.estimatedTime` for tutorials/quickstarts
- [ ] Add `metadata.difficulty` for learning content
- [ ] Add `metadata.image` for custom social sharing (optional - falls back to logo)

### Advanced (Optimal SEO)

- [ ] Add `metadata.datePublished` for new content
- [ ] Add `metadata.lastModified` when updating content
- [ ] Add `metadata.version` for API references

### Validation

- [ ] Test with validation script: `npm run validate-structured-data`
- [ ] Check Rich Results Test
- [ ] Verify social sharing preview

## Current Implementation Status

**✅ Fully Implemented Features:**

- Automatic image fallbacks (Chainlink logo)
- Smart date handling (metadata with fallbacks)
- API version detection (metadata + URL)
- Enhanced organization schema
- 100% Schema.org compliance
- Rich results eligibility

**System Benefits:**

- No missing images in social sharing
- Proper date attribution for content freshness
- Enhanced rich results display
- Improved search engine understanding
- Professional fallbacks for all content

Following this guide ensures consistent, high-quality SEO implementation across all Chainlink documentation content types with bulletproof fallbacks and enhanced rich result eligibility.
