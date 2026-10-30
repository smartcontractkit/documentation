import type { SectionContent, SectionEntry } from "../sidebar.ts"
import { withParentQuery } from "./parent-query.ts"

export { withParentQuery }

/** Sidebar links for AI agent skills and related AI development docs. */
export const AI_AGENT_RESOURCES_CONTENTS: SectionContent[] = [
  {
    title: "Chainlink Developer Agent Skills",
    url: "resources/chainlink-developer-agent-skills",
  },
]

export const AI_AGENT_RESOURCES_SECTION: SectionEntry = {
  section: "AI Agent & Skills",
  contents: AI_AGENT_RESOURCES_CONTENTS,
}
