import fs from "fs/promises"
import path from "path"
import type { APIRoute } from "astro"
import { SUPPORTED_LLM_SECTIONS, LLM_SECTIONS_CONFIG } from "../../config/llms.js"

export const GET: APIRoute = async ({ params }) => {
  const { section, lang } = params

  if (!section || !(SUPPORTED_LLM_SECTIONS as readonly string[]).includes(section)) {
    return new Response("Section not found or not supported.", { status: 404 })
  }

  const cfg = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG]
  const supportedLanguages = cfg?.languages || []

  if (!lang || !supportedLanguages.includes(lang)) {
    return new Response("Language not supported for this section.", { status: 404 })
  }

  const filePath = path.resolve(`src/content/${section}/llms-full-${lang}.txt`)

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
  const paths: Array<{ params: { section: string; lang: string } }> = []

  for (const section of SUPPORTED_LLM_SECTIONS) {
    const cfg = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG]
    const languages = cfg?.languages || []

    for (const lang of languages) {
      paths.push({
        params: { section, lang },
      })
    }
  }

  return paths
}
