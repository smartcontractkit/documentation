import type { Sections } from "../../content.config.ts"
import type { SectionContent, SectionEntry } from "../sidebar.ts"
import { withParentQuery } from "./parent-query.ts"

export { withParentQuery }

/**
 * Shared Chainlink Platform account/access docs.
 *
 * - The standalone platform sidebar uses `CHAINLINK_PLATFORM_SECTION`.
 * - Product sidebars call `getAccountOrganizationSection(product)` from
 *   src/config/sidebar.ts, which scopes the links with `?parent=`.
 * - Adding a product also needs a reveal rule in src/styles/product-context.css.
 */

const ORGANIZATION_LINKS: SectionContent[] = [
  { title: "Understanding Organizations", url: "chainlink-platform/understanding-organizations" },
  { title: "Inviting Team Members", url: "chainlink-platform/inviting-team-members" },
  { title: "Assigning and Modifying Roles", url: "chainlink-platform/assigning-and-modifying-roles" },
  { title: "RBAC (Role-Based Access Control)", url: "chainlink-platform/rbac" },
]

const API_KEYS_LINK: SectionContent = { title: "API Keys", url: "chainlink-platform/api-keys" }

/** Links for the standalone Chainlink Platform product sidebar. */
export const CHAINLINK_PLATFORM_CONTENTS: SectionContent[] = [
  { title: "Getting Started", url: "chainlink-platform/getting-started" },
  { title: "Creating an Account", url: "chainlink-platform/creating-an-account" },
  ...ORGANIZATION_LINKS,
  API_KEYS_LINK,
]

export const CHAINLINK_PLATFORM_SECTION: SectionEntry = {
  section: "Chainlink Platform",
  contents: CHAINLINK_PLATFORM_CONTENTS,
}

/**
 * Product sidebar variant, grouped as Account and Organization. Data Streams
 * uses its own credentials, so it does not include the platform API Keys page.
 */
function accountOrganizationSection(includeApiKeys = true): SectionEntry {
  return {
    section: "Account & Organization",
    contents: [
      {
        title: "Account",
        url: "chainlink-platform/creating-an-account",
      },
      {
        title: "Organization",
        url: "chainlink-platform/understanding-organizations",
        children: includeApiKeys ? [...ORGANIZATION_LINKS, API_KEYS_LINK] : ORGANIZATION_LINKS,
      },
    ],
  }
}

const ACCOUNT_ORGANIZATION_SECTION = accountOrganizationSection()
const DATA_STREAMS_ACCOUNT_ORGANIZATION_SECTION = accountOrganizationSection(false)

/**
 * Returns the Account & Organization section for a product sidebar, with every
 * link scoped to that product via `?parent=`.
 */
export function getAccountOrganizationSection(parent: Sections): SectionEntry {
  const section = parent === "dataStreams" ? DATA_STREAMS_ACCOUNT_ORGANIZATION_SECTION : ACCOUNT_ORGANIZATION_SECTION
  return withParentQuery(section, parent)
}
