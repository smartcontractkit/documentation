import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection } from "astro:content"
import type { CollectionEntry } from "astro:content"

const PRODUCTS = [
  "ccip",
  "chainlink-local",
  "vrf",
  "data-feeds",
  "data-streams",
  "chainlink-functions",
  "chainlink-automation",
  "chainlink-nodes",
] as const

type Collection = (typeof PRODUCTS)[number]
type RouteEntry = CollectionEntry<Collection>

function normalize(value: string) {
  return value.replace(/^\/+|\/+$/g, "")
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<{ params: { product: Collection; id: string } }> = []

  for (const product of PRODUCTS) {
    const entries = (await getCollection(product)) as RouteEntry[]

    for (const entry of entries) {
      const id = normalize(entry.id)
      if (!id) continue

      paths.push({
        params: { product, id },
      })
    }
  }

  return paths
}

export const GET: APIRoute = async ({ params }) => {
  const product = params.product as Collection
  const id = normalize(params.id ?? "")

  const entries = (await getCollection(product)) as RouteEntry[]

  const entry = entries.find((e) => normalize(e.id) === id)

  if (!entry) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(entry.body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
      "CDN-Cache-Control": "max-age=300",
      "Vercel-CDN-Cache-Control": "max-age=300",
    },
  })
}
