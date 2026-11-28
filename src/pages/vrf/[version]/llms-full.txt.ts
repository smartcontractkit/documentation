import type { APIRoute } from "astro"
import { serveLlmsFullSection } from "../../../lib/markdown/llmsFull.js"

export const GET: APIRoute = ({ params }) => serveLlmsFullSection(`vrf/${params.version}`)

export function getStaticPaths() {
  return ["v1", "v2"].map((version) => ({ params: { version } }))
}
