import type { APIRoute, GetStaticPaths } from "astro"
import { SOLUTIONS, type Solution } from "../../../config/solutions/index.ts"
import { renderSolutionLlmsDocument } from "../../../lib/markdown/solutionLlms.js"
import { getOrderedSolutionPages, getSolutionPages, type SolutionEntry } from "../../../utils/solutions.js"

export const prerender = true

type Props = { solution: Solution; pages: SolutionEntry[] }

export const getStaticPaths: GetStaticPaths = async () => {
  return Promise.all(
    SOLUTIONS.map(async (solution) => {
      const pages = await getSolutionPages(solution.slug)
      const orderedPages = getOrderedSolutionPages(solution, pages)

      return {
        params: { slug: solution.slug },
        props: { solution, pages: orderedPages },
      }
    })
  )
}

export const GET: APIRoute = async ({ props }) => {
  const { solution, pages } = props as Props
  const document = await renderSolutionLlmsDocument(solution, pages)
  return new Response(document, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `inline; filename="${solution.slug}-llms-full.txt"`,
    },
  })
}
