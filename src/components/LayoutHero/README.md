# LayoutHero Component

## What is it?

The LayoutHero component is a reusable hero section that displays a title, description, call-to-action buttons, and an optional image. It's perfect for landing pages or the top of important pages where you want to grab attention and guide users to take action.

## How to Use It

### Basic Usage

To use the LayoutHero component in your page, you'll need to import it and provide some information:

```astro
---
import { LayoutHero } from "@components"
---

<LayoutHero
  title="Welcome to Our Documentation"
  description="Learn how to build amazing applications with our platform"
  buttons={[
    { label: "Get Started", link: "/quickstart" },
    { label: "View Documentation", link: "/docs" },
  ]}
  image="/images/hero-image.png"
/>
```

### What Each Part Does

**title** (Required)

- This is the main heading that appears at the top
- Make it clear and attention-grabbing
- Example: "Welcome to Chainlink Docs"

**description** (Required)

- A short paragraph explaining what this page or section is about
- Keep it concise but informative
- Example: "Learn how to connect your smart contracts to real-world data"

**buttons** (Required)

- An array of buttons that link to other pages
- Each button needs two things:
  - `label`: The text shown on the button
  - `link`: Where the button takes you when clicked
- The first button will be blue (primary action)
- The second button will be white (secondary action)
- You can have 0, 1, or 2 buttons

**image** (Required)

- The path to an image file you want to display
- The image appears on the right side on larger screens
- Below the text on mobile devices
- Example: "/images/my-hero-image.png"

## Examples

### With Only One Button

```astro
<LayoutHero
  title="Start Building Today"
  description="Get started with our comprehensive guides and tutorials"
  buttons={[{ label: "Get Started", link: "/quickstart" }]}
/>
```

### With Image and Two Buttons

```astro
<LayoutHero
  title="CCIP Cross-Chain Protocol"
  description="Send tokens and messages across blockchains securely and reliably"
  buttons={[
    { label: "Try CCIP", link: "/ccip/getting-started" },
    { label: "Learn More", link: "/ccip/concepts" },
  ]}
  image="/images/ccip-hero.png"
/>
```
