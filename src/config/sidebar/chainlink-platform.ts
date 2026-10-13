import type { Sections } from "../../content.config.ts"
import type { SectionContent, SectionEntry } from "../sidebar.ts"

/** Sidebar links for Chainlink Platform account and access management docs. */
export const CHAINLINK_PLATFORM_CONTENTS: SectionContent[] = [
  {
    title: "Creating an Account",
    url: "chainlink-platform/creating-an-account",
  },
  {
    title: "Inviting Team Members",
    url: "chainlink-platform/inviting-team-members",
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
  section: "Chainlink Platform",
  contents: CHAINLINK_PLATFORM_CONTENTS,
}

function addParentParam(url: string, parent: Sections): string {
  const [path] = url.split("?")
  return `${path}?parent=${parent}`
}

function mapContentsWithParent(contents: SectionContent[], parent: Sections): SectionContent[] {
  return contents.map((item) => ({
    ...item,
    url: item.url ? addParentParam(item.url, parent) : item.url,
    children: item.children ? mapContentsWithParent(item.children, parent) : undefined,
  }))
}

/** Returns the Chainlink Platform section with URLs scoped to a product sidebar via `?parent=`. */
export function withParentQuery(section: SectionEntry, parent: Sections): SectionEntry {
  return {
    ...section,
    contents: mapContentsWithParent(section.contents, parent),
  }
}
