import GithubSlugger from "github-slugger"

const parentMap: Record<string, string[]> = {
  H1: ["H3", "H4", "H5", "H6"],
  H2: ["H3", "H4", "H5", "H6"],
  H3: ["H4", "H5", "H6"],
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
  const isParentTo = parentMap[depth] ?? []
  let next = start.nextElementSibling
  while (
    next && // Just bear with me
    (next.nodeName !== "ASTRO-ISLAND" || // Not an island
      !next.hasChildNodes() || // Island doesn't have HTML content
      next.children[0].nodeName !== "SECTION" || // First child of the island is not a section
      !next.children[0].id) && // Section does not have an id
    (!next.id || isParentTo.includes(next.nodeName))
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
    (next.nodeName !== "ASTRO-ISLAND" ||
      !next.hasChildNodes() ||
      next.children[0].nodeName !== "SECTION" ||
      !next.children[0].id) &&
    (!next.id || !["SECTION"].includes(next.nodeName))
  ) {
    elements.push(next)
    next = next.nextElementSibling
  }
  start.parentNode?.insertBefore(wrapper, start)
  elements.forEach((e) => wrapper.appendChild(e))
}

const attachAnchor = (e: Element) => {
  const anchor = document.createElement("a")
  anchor.href = `#${e.id}`
  anchor.textContent = e.textContent
  e.replaceChildren(anchor)
}

/**
 * Performs all transformations on top-level article headers
 *
 * Assigns an id, creates an anchor, makes h1 and h2 responsive to data-sticky, and wraps the header and following content in a section tag
 *
 * Previously this was done by rehype plugins, but they are unreliable as they only work for markdown
 */
export const prepareHeaders = (aboveTheFold?: boolean) => {
  // Only get direct descendants of the article content
  // Grabs mdx headers without getting nested headers in components
  const headers = document.body.querySelectorAll("#article > :where(h1, h2, h3, h4)")
  const slugger = new GithubSlugger()
  headers.forEach((header) => {
    if (!header.textContent) {
      return
    }
    if (["H1", "H2"].includes(header.nodeName)) {
      header.setAttribute("data-sticky", "")
    }
    header.id = slugger.slug(header.textContent)
    attachAnchor(header)
    wrapHeader(header)
  })

  if (aboveTheFold) {
    wrapATF()
  }
}
