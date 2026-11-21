import fs from "node:fs/promises"
import path from "node:path"
import { SUPPORTED_LLM_SECTIONS, LLM_SECTIONS_CONFIG } from "../../config/llms.js"

// Sections with a single bundle, including deprecated product versions such as vrf/v1.
export const SINGLE_FILE_LLM_SECTIONS = SUPPORTED_LLM_SECTIONS.filter((section) => {
  const cfg = LLM_SECTIONS_CONFIG[section]
  return !cfg.languages?.length
})

export async function serveLlmsFullSection(section: string | undefined): Promise<Response> {
  if (!section || !(SINGLE_FILE_LLM_SECTIONS as readonly string[]).includes(section)) {
    return new Response("Section not found or not supported.", { status: 404 })
  }

  const filePath = path.resolve(`src/content/${section}/llms-full.txt`)
  try {
    const fileContents = await fs.readFile(filePath, "utf-8")
    return new Response(fileContents, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new Response("File not found.", { status: 404 })
  }
}
