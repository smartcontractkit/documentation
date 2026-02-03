# DocsV3Layout Component Guide

## What is DocsV3Layout?

DocsV3Layout is the template that creates the standard layout for documentation pages on the Chainlink Docs website. Think of it as a "frame" that wraps around your content to give it a consistent look and feel.

## What Does It Do?

When you use this layout, it automatically creates:

- **A left sidebar** with navigation links to help users find related pages
- **A main content area** where your documentation content appears
- **A header** that shows the page outline (on mobile devices)
- **Responsive design** that adapts to different screen sizes (mobile, tablet, desktop)

## How to Use It

### Basic Setup

To use this layout for a documentation page, you need to specify it at the top of your Markdown file:

```
---
layout: ~/layouts/DocsV3Layout/DocsV3Layout.astro
title: Your Page Title
section: your-section-name
---

Your content goes here...
```

### Required Information

You need to provide two key pieces of information:

1. **Title** - The name of your documentation page
   - Example: `title: Getting Started with Chainlink`

2. **Section** - Which documentation section this page belongs to
   - Example: `section: quickstarts`
   - This helps organize pages in the left sidebar navigation

### Optional Information

You can also include:

- **Metadata** - Special settings for the page, like SEO information
- **Link to Wallet** - If your page needs blockchain wallet integration, add:
  ```
  metadata:
    linkToWallet: true
  ```

## Example Usage

Here's a complete example of how to set up a documentation page:

```
---
layout: ~/layouts/DocsV3Layout/DocsV3Layout.astro
title: How to Use Chainlink Data Feeds
section: data-feeds
---

# How to Use Chainlink Data Feeds

This guide will teach you how to use data feeds...

## Step 1: Prerequisites

Before you begin, make sure you have...

## Step 2: Installation

To install the required packages...
```

## What Happens Behind the Scenes

When you use this layout:

1. **Your title** becomes the main heading and appears in the page outline
2. **Your headings** (anything starting with `#`, `##`, `###`) are automatically collected and used for navigation
3. **The sidebar** is populated with links based on your section
4. **The layout adapts** to the user's screen size automatically

## Layout Structure

The page is divided into three columns:

```
┌──────────────┬─────────────────────┬──────────────┐
│              │                     │              │
│   Left       │    Main Content     │    Right     │
│   Sidebar    │    (Your Docs)      │   Sidebar    │
│ (Navigation) │                     │  (Future)    │
│              │                     │              │
└──────────────┴─────────────────────┴──────────────┘
```

- **Left Sidebar**: Shows navigation for the current section
- **Main Content**: Your documentation content
- **Right Sidebar**: Reserved for future use (currently empty)

## Tips for Best Results

1. **Use clear headings** - Your headings create the page outline, so make them descriptive
2. **Keep titles concise** - The title appears in multiple places, so shorter is better
3. **Choose the right section** - Make sure your page is in the correct section so users can find it
4. **Limit heading depth** - Only headings up to level 4 (`####`) are included in the navigation
