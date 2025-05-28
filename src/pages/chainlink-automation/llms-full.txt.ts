import fs from "fs/promises"
import path from "path"
import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
  const filePath = path.resolve("src/content/chainlink-automation/llms-full.txt")

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
