# ResourceGrid

## What it does

This component displays a grid of resource cards. Each card can represent either an article or a video, with an optional image, title, description, and link. Article cards show a "Read the full article" footer with an arrow.

## How to use it

1. Import the component in your Astro layout or page:

```astro
import ResourceGrid from "~/components/Resource/ResourceGrid.astro" import type {ResourceItem} from "~/components/Resource/ResourceGrid.astro"
```

2. (Optional) If you want to use imported images, import them:

```astro
import myImage from "~/assets/images/my-image.png"
```

3. Create an array of resources with the information for each resource card

4. Add the component to your page and pass in the resources:

```astro
<ResourceGrid resources={yourResourcesArray} />
```

## Example

Here's a complete example showing how to use the component:

```astro
---
import ResourceGrid from "~/components/Resource/ResourceGrid.astro"
import type { ResourceItem } from "~/components/Resource/ResourceGrid.astro"
import tokenPoolImage from "~/assets/images/token-pool.png"

const resources: ResourceItem[] = [
  {
    image: tokenPoolImage,
    imageAlt: "Token Pool illustration",
    label: "Token Pool Types",
    description:
      "Explore the various token pool types supported by the Cross-Chain Token (CCT) standard with Chainlink Labs.",
    link: "/resources/token-pool-types",
    type: "article",
  },
  {
    label: "Getting Started with CCIP",
    description:
      "Learn how to build cross-chain applications using Chainlink CCIP in this comprehensive video tutorial.",
    link: "https://youtube.com/watch?v=example",
    type: "video",
  },
  {
    image: "/images/cross-chain-messaging.png",
    imageAlt: "Cross-chain messaging diagram",
    label: "Understanding Cross-Chain Messaging",
    description: "A deep dive into how cross-chain messaging works and how to implement it in your smart contracts.",
    link: "/resources/cross-chain-messaging",
    type: "article",
  },
]
---

<ResourceGrid resources={resources} />
```

## What you need to provide

Each item in your `resources` array needs these fields:

| Field           | Required? | What it is                                                                 | Example                                                          |
| --------------- | --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **label**       | Yes       | The title of the resource                                                  | `"Token Pool Types"`                                             |
| **link**        | Yes       | Where the card should link to (can be internal or external)                | `"/resources/token-pool-types"` or `"https://youtube.com/..."`   |
| **description** | Yes       | A description explaining what the resource covers                          | `"Explore the various token pool types..."`                      |
| **type**        | Yes       | The type of resource - either `"article"` or `"video"`                     | `"article"`                                                      |
| **image**       | No        | Either an imported image or a path string                                  | `myImage` (imported) or `"/images/token-pool.png"` (string path) |
| **imageAlt**    | No        | Description of the image for accessibility (required if image is provided) | `"Token Pool illustration"`                                      |

## Where to put images

Images are optional for resource cards. You have two options:

### Option 1: Import images (recommended for images in your project)

1. Place your image file in the `src/assets/images/` directory
2. Import it at the top of your file:
   ```astro
   import myImage from "~/assets/images/my-image.png"
   ```
3. Use the imported variable in your resource object

### Option 2: Use a path string (for public directory or external images)

1. Place your image file in the `/public/images/` directory
2. Reference it with the full path starting with `/images/`

Both approaches work! Use imported images for better optimization, or use path strings for simplicity.

## Resource types

- **article**: Displays "Read the full article" footer with an arrow icon
- **video**: No special footer (just the card with title and description). For video resources, the `image` prop can be a YouTube video thumbnail URL, and the `link` prop can be the YouTube video URL
