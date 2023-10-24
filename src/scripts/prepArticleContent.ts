import GithubSlugger from "github-slugger"

const dontWrapBase: string[] = ["H1", "H2"]
const dontWrapMap: Record<string, string[]> = {
  H1: dontWrapBase,
  H2: dontWrapBase,
  H3: [...dontWrapBase, "H3"],
  H4: [...dontWrapBase, "H3", "H4"],
}

// Recursively check if we can wrap the node
const canWrap = (element: Element, dontWrap: string[]) => {
  if (["ASTRO-ISLAND", "SECTION"].includes(element.nodeName) && element.firstElementChild) {
    return canWrap(element.firstElementChild, dontWrap)
  }
  return !dontWrap.includes(element.nodeName)
}

/**
 * Creates section wrappers around headers which interact with
 * intersection observers and TOC
 */
const wrapSection = (start: Element) => {
  const wrapper = document.createElement("section")
  const elements: Element[] = []
  elements.push(start)
  const dontWrap = dontWrapMap[start.nodeName] ?? [...dontWrapBase, "H3", "H4"]
  let next = start.nextElementSibling
  while (next && canWrap(next, dontWrap)) {
    elements.push(next)
    next = next.nextElementSibling
  }
  if (start.id) {
    wrapper.id = start.id
  }
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
  wrapSection(start)
}

const prepareSectionsInternal = (headers: NodeListOf<Element>, aboveTheFold?: boolean) => {
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
    }
    if (header.firstChild?.nodeName !== "A") {
      const anchor = document.createElement("a")
      anchor.href = `#${header.id}`
      anchor.textContent = header.textContent
      header.replaceChildren(anchor)
    }
    wrapSection(header)
  })
  aboveTheFold && wrapATF()
}

/**
 * Performs all transformations on top-level article headers
 *
 * Assigns an id, creates an anchor, makes h1 and h2 responsive to data-sticky, and wraps the header and following content in a section tag
 *
 * This picks up any headers not already modified by rehypeSlug and rehypeAutolinkHeadings (anything besides markdown content)
 */
export const prepareSections = (aboveTheFold?: boolean) => {
  // Only get direct descendants of the article content
  // Grabs mdx headers without getting nested headers in components
  const headers = document.body.querySelectorAll("#article > :where(h1, h2, h3, h4)")
  prepareSectionsInternal(headers, aboveTheFold)
}
