import type { SectionContent, SectionEntry } from "../sidebar.ts"
import { withParentQuery } from "./parent-query.ts"

export { withParentQuery }

/** Sidebar links for Chainlink Platform account and access management docs. */
export const CHAINLINK_PLATFORM_CONTENTS: SectionContent[] = [
  {
    title: "Overview",
    url: "chainlink-platform/overview",
  },
  {
    title: "Creating an Account",
    url: "chainlink-platform/creating-an-account",
  },
  {
    title: "Inviting Team Members",
    url: "chainlink-platform/inviting-team-members",
  },
  {
    title: "Understanding Organizations",
    url: "chainlink-platform/understanding-organizations",
  },
  {
    title: "RBAC",
    url: "chainlink-platform/rbac",
  },
  {
    title: "API Keys",
    url: "chainlink-platform/api-keys",
  },
]

export const CHAINLINK_PLATFORM_SECTION: SectionEntry = {
  section: "Platform",
  contents: CHAINLINK_PLATFORM_CONTENTS,
}
