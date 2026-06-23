# TabGrid Components

Two components for displaying grid items organized by category: one with built-in tabs and one that syncs with the global chain type selector.

## Components

### TabGrid

A tabbed interface for displaying grid items organized by category with its own tab selector.

#### What is this?

The TabGrid component displays a collection of items in a clean, organized layout with tabs. Each tab represents a category of items (like "EVM" or "Solana"), and clicking on a tab shows the relevant items as clickable cards.

This component is useful when you have multiple items and want to group them by topic or category, making it easier for users to find what they need.

#### Usage

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

---

### ChainAwareTabGrid

A grid component that automatically filters content based on the selected chain type from the ChainTypeSelector dropdown.

#### What is this?

The ChainAwareTabGrid component displays a collection of items filtered by the currently selected blockchain type (EVM, Solana, Aptos, etc.). Unlike the regular TabGrid which has its own tab selector, this component syncs with the global chain type selector in the DocsLayout sidebar/header.

This component is ideal for product landing pages (like CCIP) where content should automatically update based on the chain type selected in the main navigation.

#### Usage

```tsx
import { ChainAwareTabGrid } from "@components/TabGrid/ChainAwareTabGrid"

// Define tutorials for each chain type
const tutorials = [
  {
    name: "EVM",
    links: [
      {
        title: "Transfer Tokens",
        description: "Unlock seamless token transfers from contracts",
        link: "/ccip/tutorials/evm/transfer-tokens-from-contract",
      },
      {
        title: "Transfer Tokens with Data",
        description: "Go beyond basic transfers with logic-infused token movements",
        link: "/ccip/tutorials/evm/programmable-token-transfers",
      },
    ],
  },
  {
    name: "Solana",
    links: [
      {
        title: "Getting Started with Solana",
        description: "Learn the basics of building on Solana blockchain",
        link: "/ccip/tutorials/svm",
      },
      {
        title: "Solana Token Transfers",
        description: "Transfer tokens on the Solana blockchain",
        link: "/ccip/tutorials/svm/source/token-transfers",
      },
    ],
  },
  {
    name: "Aptos",
    links: [
      {
        title: "Getting Started with Aptos",
        description: "Start building on the Aptos blockchain",
        link: "/ccip/tutorials/aptos",
      },
    ],
  },
]

;<ChainAwareTabGrid header="Tutorials" client:visible tabs={tutorials} />
```

#### How it works

1. The component subscribes to the global `selectedChainType` store
2. When the user changes the chain type using the ChainTypeSelector dropdown, the component automatically updates
3. It finds the tab matching the selected chain type (case-insensitive)
4. Displays only the content for that chain type
5. Falls back to the first tab if no match is found

#### When to use

- **Use ChainAwareTabGrid** when content should sync with the global chain type selector (e.g., product landing pages)
- **Use TabGrid** when you need independent tab navigation that doesn't relate to blockchain types

## How to set it up

Both components require a `tabs` prop, which is an array of tab objects. Each tab object contains:

- A **name** (the label shown on the tab button for TabGrid, or the chain type identifier for ChainAwareTabGrid)
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
| `columns` | `number` | No       | Number of columns in the grid (defaults to 3)     |

### `ChainAwareTabGrid`

| Prop      | Type     | Required | Description                                                                    |
| --------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `header`  | `string` | Yes      | The heading text displayed above the grid                                      |
| `tabs`    | `Tab[]`  | Yes      | List of tabs, each with a `name` matching a chain type (e.g., "EVM", "Solana") |
| `columns` | `number` | No       | Number of columns in the grid (defaults to 3)                                  |

### `Tab`

| Property | Type         | Required | Description                                                                                  |
| -------- | ------------ | -------- | -------------------------------------------------------------------------------------------- |
| `name`   | `string`     | Yes      | For TabGrid: any label. For ChainAwareTabGrid: must match chain type (e.g., "EVM", "Solana") |
| `links`  | `GridItem[]` | Yes      | The list of items to show when this tab is selected                                          |

### `GridItem`

| Property      | Type     | Required | Description                                       |
| ------------- | -------- | -------- | ------------------------------------------------- |
| `title`       | `string` | Yes      | The item's heading                                |
| `description` | `string` | Yes      | A brief explanation of what users will learn      |
| `link`        | `string` | Yes      | The URL path to the item page                     |
| `badge`       | `string` | No       | Optional badge label (e.g., "CCIP", "DATA FEEDS") |

## Components

- **TabGrid** - Main container with tabs and header (includes tab selector)
- **ChainAwareTabGrid** - Main container that syncs with global chain type selector (no built-in tabs)
- **ItemGrid** - Grid layout for item cards
- **GridCard** - Individual item card with hover effects
