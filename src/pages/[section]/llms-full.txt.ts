import fs from "fs/promises"
import path from "path"
import type { APIRoute } from "astro"
import { SUPPORTED_LLM_SECTIONS, LLM_SECTIONS_CONFIG } from "../../config/llms.js"

// Get sections that use single llms-full.txt (no language-specific files)
const SINGLE_FILE_SECTIONS = SUPPORTED_LLM_SECTIONS.filter((section) => {
  const cfg = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG]
  return !cfg?.languages || cfg.languages.length === 0
})

export const GET: APIRoute = async ({ params }) => {
  const { section } = params

  if (!section || !(SINGLE_FILE_SECTIONS as readonly string[]).includes(section)) {
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
  } catch (error) {
    return new Response("File not found.", { status: 404 })
  }
}

export function getStaticPaths() {
  return SINGLE_FILE_SECTIONS.map((section) => ({
    params: { section },
  }))
}
