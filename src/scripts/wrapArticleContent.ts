const parentMap: Record<string, string[]> = {
  H1: ["H3", "H4", "H5", "H6"],
  H2: ["H3", "H4", "H5", "H6"],
  H3: ["H4", "H5", "H6"],
}

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
  if (["H1", "H2"].includes(depth)) {
    start.setAttribute("data-sticky", "")
  }
  elements.forEach((e) => wrapper.appendChild(e))
}

/**
 * Creates sticky headers which interact with
 * intersection observers for nested h3, h4 headers
 */
export const wrapHeaders = () => {
  // Only get direct descendants of the article content
  // Grabs mdx headers without getting nested headers in components
  const headers = document.body.querySelectorAll("#article > :where(h1, h2, h3, h4)")
  headers.forEach((e) => wrapHeader(e))
}

/**
 * Wrap "above the fold" (ATF) content that lives before first header
 */
export const wrapATF = () => {
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
