import type { Sections } from "../../content.config.ts"

/**
 * One group in a multi-page solution's left navigation.
 * `pages` holds page ids relative to the solution's content directory, without extension.
 * The landing page (index.mdx) is referenced as the literal string "index".
 * Array order is render order.
 */
export type SolutionNavGroup = {
  group: string
  pages: string[]
}

/**
 * A solution manifest. One per solution, in this directory.
 *
 * This file owns metadata and, for multi-page solutions, page ORDER. It does not own
 * page titles: those come from each MDX file's own frontmatter, so a nav label can
 * never drift from the page heading.
 */
export type Solution = {
  /** URL segment and content directory name. Lowercase kebab-case. */
  slug: string
  /** Display name. Used on the hub card, in the header bar and in <title>. */
  title: string
  /** One or two sentences. Used on the hub card, the landing summary and as the meta description fallback. */
  description: string
  /**
   * Sidebar section keys of the products this solution uses. Values MUST come from
   * SIDEBAR_SECTIONS in src/config/sidebarSections.ts, for example "ccip", "cre", "dataStreams".
   * Not display names. This drives which product sidebars show the solution and the hub's
   * product filter.
   */
  products: Sections[]
  /** Free-form use-case tags. Drives the hub's category filter. Keep the vocabulary small. */
  categories: string[]
  /** Public repository for the reference implementation. */
  repoUrl?: string
  /** Hub card image, path under /public. */
  image?: string
  /** ISO date string. Orders the hub, newest first. */
  datePublished?: string
  /**
   * Hides the solution from every rendered surface: no routes, no hub card, no sidebar
   * entries, no filter facets. The content and manifest stay in the repo, still validated
   * by the build guards, so they keep working as copyable examples.
   */
  hidden?: boolean
  /**
   * Left navigation, for MULTI-PAGE solutions only.
   *
   * Omit it entirely for a single-page solution: with one page there is nothing to
   * navigate and no sidebar renders. Declaring it anyway is a build error, because it
   * would suggest the field does something when it does not.
   *
   * When present, every content page must appear exactly once, and every listed page
   * must exist on disk. Both directions are checked at build time.
   */
  nav?: SolutionNavGroup[]
}
