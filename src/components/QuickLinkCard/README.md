# QuickLinkCard Component

A responsive component that displays a grid of quick links with icons, perfect for creating a "Tools & Utilities" section or similar resource lists.

## What This Component Does

The QuickLinkCard component creates a visually appealing section that:

- Shows a decorative sidebar image on larger screens
- Arranges your links in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop)
- Each link has an icon and a label
- Icons are displayed in brand color (blue)

## How to Use It

### Basic Usage

1. Import the component and icon components in your Astro page:

```astro
---
import QuickLinkCard from "~/components/QuickLinkCard/QuickLinkCard.astro"
import { SvgEyeOptic, SvgStartup, SvgBulletList } from "@chainlink/blocks"
---
```

2. Add the component with your links:

```astro
<QuickLinkCard
  links={[
    {
      icon: SvgEyeOptic,
      label: "View Network Configs",
      link: "/network-configs",
    },
    {
      icon: SvgStartup,
      label: "Check Transaction Status",
      link: "/transaction-status",
    },
    {
      icon: SvgBulletList,
      label: "Get Testnet Tokens",
      link: "/faucet",
    },
  ]}
/>
```

## Understanding the Props

The component accepts one prop called `links`, which is a list (array) of link objects. Each link object has three parts:

### `icon` (required)

- **What it is:** An icon component that appears next to the link
- **Format:** A component from `@chainlink/blocks` or any other icon component
- **Example:** `SvgEyeOptic`, `SvgStartup`, `SvgBulletList`
- **Tip:** Use icons from the `@chainlink/blocks` package for consistency with the rest of the site

### `label` (required)

- **What it is:** The text that appears next to the icon
- **Format:** Plain text
- **Example:** `'View Network Configs'`
- **Tip:** Keep it short and descriptive (2-4 words works best)

### `link` (required)

- **What it is:** Where the link goes when clicked
- **Format:** A URL path
- **Example:** `'/network-configs'` or `'https://example.com'`
- **Tip:** Use relative paths (starting with `/`) for internal pages

## Complete Example

Here's a full example showing 6 links:

```astro
---
import QuickLinkCard from "~/components/QuickLinkCard/QuickLinkCard.astro"
import {
  SvgEyeOptic,
  SvgTransactionRepeatRecurring,
  SvgWaveSignal,
  SvgStartup,
  SvgCrossChain,
  SvgBulletList,
} from "@chainlink/blocks"

// Define your links here
const quickLinks = [
  {
    icon: SvgEyeOptic,
    label: "View Network Configs",
    link: "https://docs.chain.link/ccip/directory/mainnet",
  },
  {
    icon: SvgTransactionRepeatRecurring,
    label: "Check Transaction Status",
    link: "https://ccip.chain.link/",
  },
  {
    icon: SvgWaveSignal,
    label: "View Lane Status",
    link: "https://ccip.chain.link/status",
  },
  {
    icon: SvgStartup,
    label: "Get Testnet Tokens",
    link: "https://tokenmanager.chain.link/",
  },
  {
    icon: SvgCrossChain,
    label: "Convert Chainlink tokens",
    link: "https://www.transporter.io/",
  },
  {
    icon: SvgBulletList,
    label: "View the Changelog",
    link: "https://dev.chain.link/changelog?product=CCIP",
  },
]
---

<QuickLinkCard links={quickLinks} />
```

## Customizing the Look

### Icon Color

The icon color is set in the component itself. To change it:

1. Open: `src/components/QuickLinkCard/QuickLinkCard.astro`
2. Find line with `<Icon color="brand" />`
3. Change `"brand"` to another color from `@chainlink/blocks` (e.g., `"blue-600"`, `"green-500"`, etc.)

### Spacing and Layout

If you want to change spacing or other visual aspects:

1. Open the file: `src/components/QuickLinkCard/QuickLinkCard.module.css`
2. Look for the section you want to change:
   - `.linkItem` - changes how each link looks
   - `.linksGrid` - changes spacing and layout of the grid
   - `.sidebar` - changes the sidebar image size

### Example Customizations

**Make the grid spacing tighter:**

```css
.linksGrid {
  gap: var(--space-4x); /* Change from var(--space-6x) */
}
```

**Change the sidebar image size:**

```css
.sidebar img {
  width: 48px; /* Change from 32px */
}
```

## Responsive Behavior

The component automatically adapts to different screen sizes:

- **Mobile (small screens):** Links stack in 1 column, sidebar image is hidden
- **Tablet (medium screens):** Links display in 2 columns, sidebar image is hidden
- **Desktop (large screens):** Links display in 3 columns, sidebar image appears on the left

## Available Icons

The `@chainlink/blocks` package provides many icons. Here are some commonly used ones:

- `SvgEyeOptic` - Eye/view icon
- `SvgTransactionRepeatRecurring` - Transaction icon
- `SvgWaveSignal` - Signal/status icon
- `SvgStartup` - Rocket/startup icon
- `SvgCrossChain` - Cross-chain/transfer icon
- `SvgBulletList` - List icon
- And many more...

Explore the `@chainlink/blocks` package to see all available icons.

## Tips for Best Results

1. **Icon Tips:**
   - Use icons from `@chainlink/blocks` for consistency
   - Keep all icons simple and recognizable
   - Match the icon to the action (eye for "view", rocket for "get started", etc.)

2. **Label Tips:**
   - Keep labels short (2-4 words)
   - Use action words like "View", "Check", "Get", "Convert"
   - Be clear about what happens when the link is clicked

3. **Link Tips:**
   - Test all your links to make sure they work
   - Use relative paths for internal pages (starts with `/`)
   - Use full URLs for external sites (starts with `http://` or `https://`)

## Need Help?

If something isn't working:

1. Check that all three parts (icon, label, link) are included for each link
2. Make sure you've imported the icon components from `@chainlink/blocks`
3. Verify that your links are correct paths
4. Check the browser console for any error messages
