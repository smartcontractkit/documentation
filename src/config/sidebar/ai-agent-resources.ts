import type { Sections } from "../../content.config.ts"
import type { SectionContent, SectionEntry } from "../sidebar.ts"

/** Sidebar links for AI agent skills and related AI development docs. */
export const AI_AGENT_RESOURCES_CONTENTS: SectionContent[] = [
  {
    title: "Chainlink Developer Agent Skills",
    url: "resources/chainlink-developer-agent-skills",
  },
  {
    title: "Chainlink for Agents User Guide",
    url: "resources/chainlink-for-agents",
  },
]

export const AI_AGENT_RESOURCES_SECTION: SectionEntry = {
  section: "AI Agent & Skills",
  contents: AI_AGENT_RESOURCES_CONTENTS,
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

/** Returns the AI resources section with URLs scoped to a product sidebar via `?parent=`. */
export function withParentQuery(section: SectionEntry, parent: Sections): SectionEntry {
  return {
    ...section,
    contents: mapContentsWithParent(section.contents, parent),
  }
}
