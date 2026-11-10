import type { APIRoute } from "astro"
import { GET as getSection } from "../../[section]/llms-full.txt.js"

export const GET: APIRoute = (context) =>
  getSection({ ...context, params: { section: `vrf/${context.params.version}` } })

export function getStaticPaths() {
  return ["v1", "v2"].map((version) => ({ params: { version } }))
}
