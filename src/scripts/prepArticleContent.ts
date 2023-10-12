import GithubSlugger from "github-slugger"

const dontWrapMap: Record<string, string[]> = {
  H1: ["H1", "H2"],
  H2: ["H1", "H2"],
  H3: ["H1", "H2", "H3"],
  H4: ["H1", "H2", "H3", "H4"],
}

/**
 * Creates section wrappers around headers which interact with
 * intersection observers and TOC
 */
const wrapHeader = (start: Element) => {
  const wrapper = document.createElement("section")
  const elements: Element[] = []
  elements.push(start)
  const depth = start.nodeName
  const dontWrap = dontWrapMap[depth] ?? ["H1", "H2", "H3", "H4", "H5", "H6"]
  let next = start.nextElementSibling
  while (
    next &&
    !dontWrap.includes(next.nodeName) && // Just bear with me
    (next.nodeName !== "ASTRO-ISLAND" || // Not an island
      !next.hasChildNodes() || // Island doesn't have HTML content
      next.children[0].nodeName !== "SECTION") // First child of the island is not a section
  ) {
    elements.push(next)
    next = next.nextElementSibling
  }
  wrapper.id = start.id
  start.parentNode?.insertBefore(wrapper, start)
  elements.forEach((e) => wrapper.appendChild(e))
}

/**
 * Wrap "above the fold" (ATF) content that lives before first header
 *
 * Currently only applies to Quickstarts pages
 */
const wrapATF = () => {
  const start = document.body.querySelector("#article > :not(section)")
  if (!start) {
    return
  }
  const wrapper = document.createElement("section")
  const elements: Element[] = []
  elements.push(start)
  let next = start.nextElementSibling
  while (
    next &&
    next.nodeName !== "SECTION" &&
    (next.nodeName !== "ASTRO-ISLAND" || !next.hasChildNodes() || next.children[0].nodeName !== "SECTION")
  ) {
    elements.push(next)
    next = next.nextElementSibling
  }
  start.parentNode?.insertBefore(wrapper, start)
  elements.forEach((e) => wrapper.appendChild(e))
}

// TODO: Consider also preparing top-level astro-islands, replacing SectionWrapper component
/**
 * Performs all transformations on top-level article headers
 *
 * Assigns an id, creates an anchor, makes h1 and h2 responsive to data-sticky, and wraps the header and following content in a section tag
 *
 * This picks up any headers not already modified by rehypeSlug and rehypeAutolinkHeadings (anything besides markdown content)
 */
export const prepareHeaders = (aboveTheFold?: boolean) => {
  // Only get direct descendants of the article content
  // Grabs mdx headers without getting nested headers in components
  const headers = document.body.querySelectorAll(
    "#article > :where(h1, h2, h3, h4), #article > astro-island > :where(h1, h2, h3, h4)"
  )
  console.log(headers)
  const slugger = new GithubSlugger()
  headers.forEach((header) => {
    if (!header.textContent) {
      return
    }
    if (["H1", "H2"].includes(header.nodeName)) {
      header.setAttribute("data-sticky", "")
    }
    if (!header.id) {
      header.id = slugger.slug(header.textContent)
      if (header.firstChild?.nodeName !== "A") {
        const anchor = document.createElement("a")
        anchor.href = `#${header.id}`
        anchor.textContent = header.textContent
        header.replaceChildren(anchor)
      }
    }
  })
  headers.forEach((header) => {
    wrapHeader(header)
  })

  if (aboveTheFold) {
    wrapATF()
  }
}
