import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import type { Collection } from "~/content.config"

function normalize(value: string) {
  return value.replace(/^\/+|\/+$/g, "")
}

export const GET: APIRoute = async ({ params }) => {
  const product = params.product as Collection
  const id = normalize(params.id ?? "")

  const entries = await getCollection(product)

  const entry = entries.find((e) => normalize(e.id) === id)

  if (!entry) {
    return new Response("Not found", { status: 404 })
  }

  // raw markdown content
  return new Response(entry.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown",
    },
  })
}
