import fs from "fs/promises"
import path from "path"
import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params }) => {
  const { section } = params

  const supportedSections = [
    "vrf",
    "ccip",
    "data-feeds",
    "data-streams",
    "chainlink-functions",
    "chainlink-automation",
    "resources",
    "architecture-overview",
    "getting-started",
    "chainlink-nodes",
    "chainlink-local",
  ]

  if (!section || !supportedSections.includes(section)) {
    return new Response("Section not found or not supported.", { status: 404 })
  }

  const filePath = path.resolve(`src/content/${section}/llms-full.txt`)

  try {
    const fileContents = await fs.readFile(filePath, "utf-8")
    return new Response(fileContents, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (error) {
    return new Response("File not found.", { status: 404 })
  }
}

export function getStaticPaths() {
  const supportedSections = [
    "vrf",
    "ccip",
    "data-feeds",
    "data-streams",
    "chainlink-functions",
    "chainlink-automation",
    "resources",
    "architecture-overview",
    "getting-started",
    "chainlink-nodes",
    "chainlink-local",
  ]

  return supportedSections.map((section) => ({
    params: { section },
  }))
}
