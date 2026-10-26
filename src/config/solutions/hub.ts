/**
 * Global switch for the Solutions hub (/solutions).
 *
 * While false:
 *   - /solutions is not generated (404) and stays out of the sitemap
 *   - the "Solutions" entry is removed from the site header (desktop and mobile)
 *   - the "All Chainlink Solutions" breadcrumb is removed from the solution bar
 *
 * Individual solutions are NOT affected: every solution that is not `hidden` keeps its
 * routes and its "Solutions" entries in the product sidebars. This lets solutions ship
 * one by one.
 */
export const SOLUTIONS_HUB_ENABLED = false
