# TabGrid Component

A tabbed interface for displaying grid items organized by category.

## What is this?

The TabGrid component displays a collection of items in a clean, organized layout with tabs. Each tab represents a category of items (like "EVM" or "Solana"), and clicking on a tab shows the relevant items as clickable cards.

This component is useful when you have multiple items and want to group them by topic or category, making it easier for users to find what they need.

## Usage

```tsx
import { TabGrid } from "@components/TabGrid/TabGrid"
;<TabGrid
  header="Tutorials"
  tabs={[
    {
      name: "Getting Started",
      links: [
        {
          title: "Quick Start Guide",
          description: "Learn the basics in 5 minutes",
          link: "/docs/quickstart",
        },
        {
          title: "Installation",
          description: "Set up your development environment",
          link: "/docs/installation",
        },
      ],
    },
    {
      name: "Advanced",
      links: [
        {
          title: "Architecture Overview",
          description: "Understand the system design",
          link: "/docs/architecture",
        },
      ],
    },
  ]}
/>
```

## How to set it up

The component requires a `tabs` prop, which is an array of tab objects. Each tab object contains:

- A **name** (the label shown on the tab button)
- A list of **links** (the items shown when that tab is active)

Each grid item needs three pieces of information:

- **title** - The name of the item
- **description** - A short sentence explaining what the item covers
- **link** - The URL where the item can be found

## Props Reference

### `TabGrid`

| Prop      | Type     | Required | Description                                       |
| --------- | -------- | -------- | ------------------------------------------------- |
| `header`  | `string` | Yes      | The heading text displayed above the tabs         |
| `tabs`    | `Tab[]`  | Yes      | List of tabs, each containing a category of items |
| `columns` | `number` | No       | Number of columns in the grid (defaults to 2)     |

### `Tab`

| Property | Type         | Required | Description                                              |
| -------- | ------------ | -------- | -------------------------------------------------------- |
| `name`   | `string`     | Yes      | The label displayed on the tab (e.g., "Getting Started") |
| `links`  | `GridItem[]` | Yes      | The list of items to show when this tab is selected      |

### `GridItem`

| Property      | Type     | Required | Description                                       |
| ------------- | -------- | -------- | ------------------------------------------------- |
| `title`       | `string` | Yes      | The item's heading                                |
| `description` | `string` | Yes      | A brief explanation of what users will learn      |
| `link`        | `string` | Yes      | The URL path to the item page                     |
| `badge`       | `string` | No       | Optional badge label (e.g., "CCIP", "DATA FEEDS") |

## Components

- **TabGrid** - Main container with tabs and header
- **ItemGrid** - Grid layout for item cards
- **GridCard** - Individual item card with hover effects
