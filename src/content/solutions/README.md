# Solutions

A **solution** is a documented way to apply one or more Chainlink products to a specific problem.
It can be a single page or a mini-site of many pages.

This directory holds the content. The metadata and navigation live in `src/config/solutions/`.

## One page or many

You do not declare this. It is derived from how many pages you write.

- **One page:** create `index.mdx` and nothing else. No left navigation renders. The page shows a title, a summary
  block with your product badges and repository link, your content, and the disclaimer.
- **Several pages:** create `index.mdx` plus the rest, and declare their order in your manifest's `nav` field. A
  left navigation renders, grouped as you declared it.

A solution that starts as one page and later grows keeps its URL and gains a navigation automatically. Nothing to
migrate.

## Adding a solution: three steps

### 1. Write the pages

```
src/content/solutions/<your-slug>/
  index.mdx                 <- required, this is the landing page
  overview/how-it-works.mdx  <- any structure you like, for multi-page solutions
  reference/limitations.mdx
```

Frontmatter on every page:

```mdx
---
title: "How it works"
description: "One sentence. Optional, but used as the meta description fallback."
metadata:
  description: "Optional. Overrides the description for SEO."
---
```

Those are the only fields allowed. The schema is strict, so any extra field fails the build. In particular,
`section`, `date` and `whatsnext` are docs-only fields and are rejected here.

Do not write a Markdown `# Heading` at the top of a page. The `title` from frontmatter is rendered as the page
heading. Adding one produces two headings.

In `index.mdx`, do not repeat the solution title or description in the body: the summary block above your content
already shows them.

### 2. Write the manifest

`src/config/solutions/<your-slug>.ts`:

```ts
import type { Solution } from "./types.ts"

export const yourSolution: Solution = {
  slug: "your-slug", // must match the content directory name
  title: "Your Solution",
  description: "One or two sentences. Shown on the hub card and on the landing page.",
  products: ["ccip", "dataStreams"], // see below
  categories: ["tokenization", "cross-chain"],
  repoUrl: "https://github.com/smartcontractkit/your-repo", // optional. Omit it and no "View on GitHub" button renders
  image: "/images/solutions/your-slug.png", // optional. Social preview image for every page of the solution
  datePublished: "2026-10-01", // optional. Orders the hub, newest first. Undated solutions sort last

  // optional. Multi-page solutions only. Omit this field entirely if you wrote one page.
  nav: [
    { group: "Overview", pages: ["index", "overview/how-it-works"] },
    { group: "Reference", pages: ["reference/limitations"] },
  ],
}
```

**`products` takes sidebar section keys, not display names.** This is the single most common mistake. The valid
values are in `src/config/sidebarSections.ts`. Some of them do not look like the product name:

| Product      | Value to write       |
| ------------ | -------------------- |
| CCIP         | `ccip`               |
| CRE          | `cre`                |
| CRE Connect  | `crec`               |
| Data Feeds   | `dataFeeds`          |
| Data Streams | `dataStreams`        |
| DataLink     | `dataLink`           |
| Functions    | `chainlinkFunctions` |
| Automation   | `automation`         |
| VRF          | `vrf`                |
| ACE          | `ace`                |

Every product you list here gets a "Solutions" entry pointing at your solution in its documentation sidebar. List
the products the solution genuinely uses, not the ones you would like it associated with.

In `nav`, page ids are paths relative to your content directory, without the extension. The landing page is the
literal string `index`. Every page you wrote must appear exactly once, and every page you list must exist. Both
directions are checked at build time.

### 3. Register it

In `src/config/solutions/index.ts`, import your manifest and add it to the `ALL_REGISTERED` array. Two lines.

That is the whole change. You do not touch `src/config/sidebar.ts`, any layout, the hub page or the filters.
Sidebar placement, the hub card, the hub filters, whether a navigation renders, and the legal disclaimer are all
derived from what you wrote.

## Copy an existing solution

Two fixtures in this directory show both shapes:

- `demo-single-page/` with `src/config/solutions/demo-single-page.ts`: one page, no `nav`, no sidebar.
- `demo-multi-page/` with `src/config/solutions/demo-multi-page.ts`: six pages in three groups, declared in `nav`,
  and two products so it appears in two documentation sidebars.

They carry placeholder text. Copy their shape, not their content.

The fixtures are marked `hidden: true` in their manifests: they are never rendered on the site (no routes, no hub
cards, no sidebar entries), but they stay in the repo and the build still validates them, so they cannot rot. Read
them on GitHub, or flip `hidden` to `false` temporarily to preview one locally. Do not set `hidden` on a real
solution: it would silently keep it out of production.

## The hub switch

The hub at `/solutions` is controlled by one global flag, `SOLUTIONS_HUB_ENABLED` in `src/config/solutions/hub.ts`.
It is separate from the per-solution `hidden` field.

While it is `false`:

- `/solutions` is not built (404) and is not in the sitemap
- the "Solutions" entry is removed from the site header, on desktop and mobile
- the "All Chainlink Solutions" breadcrumb is removed from the bar above each solution

Solutions that are not `hidden` are unaffected: their pages are built and they appear in the "Solutions" group of
every product sidebar they declare. This is how solutions ship one at a time before the hub is announced. Flip the
flag to `true` when there are enough solutions to fill the hub. Do not flip it as part of adding a solution.

## Things that will fail review

- Adding the disclaimer yourself. It is rendered automatically on every page. Do not import or paste it.
- Editing `src/config/sidebar.ts`. Never needed.
- Trailing slashes in links. This site is configured with `trailingSlash: "never"`.
- `.html` suffixes in links, usually left over from a site you copied the content from.
- Absolute links to `docs.chain.link`. Use site-relative paths: `/ccip/directory`.
- Images larger than necessary. Compress them, and keep them under 20 KB where you can.

## Check your work before opening the PR

```shell
npm install
npm run dev     # open http://localhost:4321/solutions/<your-slug>
npm run build   # this is what catches manifest mistakes
```

`npm run build` fails with a message naming the exact file when:

- a page you listed in `nav` does not exist
- a page you wrote is missing from `nav`
- you wrote several pages but declared no `nav`
- you wrote one page but declared a `nav` anyway
- you registered a manifest with no content directory, or wrote content with no registered manifest
- your solution has no `index.mdx`

Read the message. It tells you which file and what to change.
