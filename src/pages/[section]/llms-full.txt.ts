import type { APIRoute } from "astro"
import { serveLlmsFullSection, SINGLE_FILE_LLM_SECTIONS } from "../../lib/markdown/llmsFull.js"

export const GET: APIRoute = ({ params }) => serveLlmsFullSection(params.section)

export function getStaticPaths() {
  return SINGLE_FILE_LLM_SECTIONS.filter((section) => !section.includes("/")).map((section) => ({
    params: { section },
  }))
}
