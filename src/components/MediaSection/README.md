# MediaSection Component

## What it does

The MediaSection component displays a section with a heading, description, and optionally an image or video. It's perfect for explaining concepts with visual aids, like showing architecture diagrams or tutorial videos.

## How to use it

Import the component and add it to your page with the content you want to display:

```astro
import MediaSection from "~/components/MediaSection/MediaSection.astro"

<MediaSection
  heading="Your Section Title"
  description="A description explaining what this section is about."
  image="/path/to/your/image.png"
/>
```

## Props explained

- **heading** (required) - The title of your section
- **description** (required) - A paragraph explaining the section content
- **image** (optional) - Path to an image file you want to display
- **video** (optional) - Path to a video file you want to display

**Note:** You can provide either an image OR a video, not both. If you include both, only the image will show.

## Example

```astro
<MediaSection
  heading="High-level architecture"
  description="CCIP delivers cross-chain messages from a source chain to a destination chain by combining offchain consensus and onchain execution components."
  image="/images/architecture.png"
/>
```

This will display:

1. A heading that says "High-level architecture"
2. The description text below it
3. The architecture diagram image at the bottom
