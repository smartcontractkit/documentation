# ToolsUtilitiesGrid

## What it does

This component displays a grid of clickable cards that showcase tools and utilities. Each card includes an icon, title, description, and link. It's perfect for creating a visual directory of resources, tools, or utilities that users can browse and click through to.

## How to use it

1. Import the component in your Astro layout or page:

```astro
import ToolsUtilitiesGrid from "~/components/ToolsUtilitiesGrid/ToolsUtilitiesGrid.astro"
```

2. Create an array of links with the information for each tool/utility you want to display

3. Add the component to your page and pass in the links:

```astro
<ToolsUtilitiesGrid links={yourLinksArray} />
```

## Example

Here's a complete example showing how to use the component:

```astro
---
import ToolsUtilitiesGrid from "~/components/ToolsUtilitiesGrid/ToolsUtilitiesGrid.astro"

const toolsAndUtilities = [
  {
    image: "/images/ccip-logo.svg",
    imageAlt: "CCIP API icon",
    label: "CCIP API",
    link: "/ccip/api",
    description: "An API for message retrieval and lane latency information.",
  },
  {
    image: "/images/js-logo.svg",
    imageAlt: "JavaScript SDK icon",
    label: "Javascript SDK",
    link: "https://github.com/smartcontractkit/ccip-javascript-sdk",
    description: "Integrate CCIP functionality directly into your web applications for EVM-compatible chains.",
  },
  {
    image: "/images/hardhat-logo.svg",
    imageAlt: "Hardhat icon",
    label: "Hardhat Starter Kit",
    link: "https://github.com/smartcontractkit/hardhat-starter-kit",
    description:
      "Ready-to-go boilerplate for basic CCIP use cases that help you get started building quickly with Hardhat.",
  },
]
---

<ToolsUtilitiesGrid links={toolsAndUtilities} />
```

## What you need to provide

Each item in your `links` array needs these fields:

| Field           | What it is                                                  | Example                                                        |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| **image**       | The full path to the icon/logo image                        | `"/images/ccip-logo.svg"`                                      |
| **imageAlt**    | Description of the image for accessibility                  | `"CCIP API icon"`                                              |
| **label**       | The title/name of the tool or utility                       | `"CCIP API"`                                                   |
| **link**        | Where the card should link to (can be internal or external) | `"/ccip/api"` or `"https://github.com/..."`                    |
| **description** | A short description explaining what the tool does           | `"An API for message retrieval and lane latency information."` |

## Where to put images

Place your icon/logo images in the `/public/images/` directory, and reference them with the full path starting with `/images/`.

For example, if you use `image: "/images/my-tool-logo.svg"`, the actual file should be at:

```
/public/images/my-tool-logo.svg
```

You can also use images from other locations by providing the full path (e.g., `"/assets/logos/my-logo.png"`).
