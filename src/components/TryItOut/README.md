# TryItOut Component

A component that displays an interactive accordion of features alongside a dynamically changing code sample preview. The code sample updates based on which accordion item is currently expanded.

## Usage

```astro
<TryItOut
  accordionTabs={[
    {
      title: "Your Feature Title",
      text: "A brief description of what this feature does.",
      codeSampleSrc: "/samples/YourCodeFile.sol",
    },
  ]}
  ctas={[
    { text: "Get Started", href: "/getting-started", variant: "primary" },
    { text: "Learn More", href: "/docs", variant: "secondary" },
  ]}
/>
```

## Props

### `accordionTabs` (required)

A list of expandable sections that describe different features. Each tab needs:

- **title**: The heading text for the accordion item
- **text**: The description that appears when the accordion is expanded
- **codeSampleSrc**: The file path to the code sample for this specific tab (should point to a file in the `/samples/` folder)

**Example:**

```js
;[
  {
    title: "Transfer Tokens",
    text: "Move tokens between different blockchains easily.",
    codeSampleSrc: "/samples/CCIP/TokenTransfer.sol",
  },
  {
    title: "Fetch Data",
    text: "Get real-time information from external sources.",
    codeSampleSrc: "/samples/DataFeeds/PriceFeed.sol",
  },
]
```

### `ctas` (optional)

An array of call-to-action buttons to display in the footer. If not provided, defaults to "Create CRE account" and "Get the SDK" buttons.

Each CTA object needs:

- **text**: The button text
- **href**: The button link URL
- **variant** (optional): Either "primary" or "secondary" (defaults to "primary")

**Example:**

```js
;[
  { text: "Get Started", href: "/getting-started", variant: "primary" },
  { text: "View Docs", href: "/documentation", variant: "secondary" },
]
```

## How It Works

The component uses [Astro's nano stores](https://docs.astro.build/en/core-concepts/sharing-state/) to track which accordion item is currently expanded. When you click on a different accordion item, the code sample automatically updates to show the code associated with that item.

### Technical Implementation

**Why we pre-render all code samples:**

All code samples are rendered at build time using the `<CodeSample>` Astro component and included in the HTML. While this means all code samples are present in the DOM, they are toggled via visibility rather than dynamically loaded. This approach is necessary because:

1. **Astro components are build-time only** - The `<CodeSample>` component uses Astro's Prism integration which only runs during the build process, not at runtime
2. **Proper syntax highlighting** - Pre-rendering ensures all code has proper syntax highlighting applied via Prism
3. **Performance** - No runtime file reading or syntax highlighting processing; instant switching between code samples
4. **Simplicity** - Avoids complex API endpoints or client-side file fetching

**Accessibility considerations:**

Inactive code samples are hidden from both visual users and assistive technology:

- `display: none` hides them visually
- `aria-hidden="true"` ensures screen readers ignore hidden code blocks
- Only the active code sample has `aria-hidden="false"`, making it visible to screen readers

When the active accordion changes, the visibility and `aria-hidden` attributes are updated via JavaScript to show the new code sample and hide all others.
