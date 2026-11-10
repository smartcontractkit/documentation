import { describe, expect, it } from "@jest/globals"
import { renderSunsetNotice } from "../sunset.js"
import { buildMarkdownArtifact } from "../buildMarkdownArtifact.js"
import { GET as getPageMarkdown } from "../../../pages/api/page-markdown.js"
import {
  SUNSET_DOC_ROOTS,
  SUNSET_EXACT_PATHS,
  SUNSET_PATH_PREFIXES,
  SUNSET_QUICKSTART_SLUGS,
} from "../../../config/sunset.js"

describe("deprecation notices", () => {
  it.each(["chainlink-functions/getting-started", "any-api/introduction", "vrf/v2/subscription"])(
    "returns only the notice through the page Markdown API for %s",
    async (docsPath) => {
      const response = await getPageMarkdown({
        request: new Request(`https://docs.chain.link/api/page-markdown?path=/${docsPath}&lang=go`),
      } as never)
      expect(response.status).toBe(200)
      expect(await response.text()).toBe(renderSunsetNotice(docsPath))
    }
  )

  it.each([
    ...SUNSET_DOC_ROOTS,
    ...SUNSET_EXACT_PATHS,
    ...SUNSET_PATH_PREFIXES,
    ...SUNSET_QUICKSTART_SLUGS.map((slug) => `quickstarts/${slug}`),
  ])("provides replacement instructions for every sunset path: %s", (docsPath) => {
    expect(renderSunsetNotice(docsPath)).toContain("is deprecated.")
    expect(renderSunsetNotice(docsPath)).toContain("Do not use the deprecated product's APIs")
  })

  it.each(["any-api", "chainlink-functions", "chainlink-automation"])("directs %s to CRE", (docsPath) => {
    const notice = renderSunsetNotice(docsPath)
    expect(notice).toContain("Use Chainlink Runtime Environment (CRE) instead.")
    expect(notice).toContain("(https://docs.chain.link/cre.md)")
    expect(notice).toContain("(https://docs.chain.link/cre/llms.txt)")
  })

  it.each(["v1", "v2"])("directs VRF %s to its v2.5 migration guide", async (version) => {
    const notice = renderSunsetNotice(`/vrf/${version}/subscription?lang=go#example`)
    expect(notice).toContain("Use Chainlink VRF v2.5 instead.")
    expect(notice).toContain(`(https://docs.chain.link/vrf/v2-5/migration-from-${version}.md)`)
    expect(notice).not.toContain("/cre")
    expect(await buildMarkdownArtifact(`vrf/v2-5/migration-from-${version}`)).not.toBeNull()
  })

  it.each(["cre", "vrf/v2-5/getting-started", "any-api-extra", "chainlink-nodes/oracle-jobs/jobs"])(
    "does not replace current documentation: %s",
    (docsPath) => expect(renderSunsetNotice(docsPath)).toBeNull()
  )
})
