import GithubSlugger from "github-slugger"

const slugger = new GithubSlugger()

const dontWrapBase = new Set(["H1", "H2"])
const dontWrapFallback = new Set([...dontWrapBase.values(), "H3", "H4"])
const dontWrapMap: Record<string, Set<string>> = {
  H1: dontWrapBase,
  H2: dontWrapBase,
  H3: new Set([...dontWrapBase.values(), "H3"]),
  H4: new Set([...dontWrapBase.values(), "H3", "H4"]),
}

const childBase = new Set(["H4"])
const childMap: Record<string, Set<string>> = {
  H1: new Set([...childBase.values(), "H3"]),
  H2: new Set([...childBase.values(), "H3"]),
  H3: childBase,
}

// Recursively check if we can wrap the node
const canWrap = (element: Element, dontWrap: Set<string>) => {
  if (["ASTRO-ISLAND", "SECTION"].includes(element.nodeName) && element.firstElementChild) {
    return canWrap(element.firstElementChild, dontWrap)
  }
  return !dontWrap.has(element.nodeName)
}

// If starting element is an island, check that it's not already using SectionWrapper
const isValidStartingElement = (element: Element) => {
  if (["ASTRO-ISLAND", "SECTION"].includes(element.nodeName) && element.firstElementChild) {
    return canWrap(element.firstElementChild, dontWrapFallback)
  }
  return true
}

/**
 * Creates section wrappers around content
 * and headers that interact with observers and TOC
 */
const wrapSection = (start: Element) => {
  let next = start.nextElementSibling
  if (!isValidStartingElement(start)) {
    return next
  }
  const dontWrap = dontWrapMap[start.nodeName] ?? dontWrapFallback
  const children = childMap[start.nodeName] ?? null
  const elements: Element[] = []
  elements.push(start)
  while (next && canWrap(next, dontWrap)) {
    if (children && children.has(next.nodeName)) {
      wrapSection(next)
      if (next.parentElement) {
        next = next.parentElement
      }
    }
    elements.push(next)
    next = next.nextElementSibling
  }
  const wrapper = document.createElement("section")
  if (start.id) {
    wrapper.id = start.id
  }
  start.parentNode?.insertBefore(wrapper, start)
  elements.forEach((e) => wrapper.appendChild(e))
  return next // Get the start of the next wrapper
}

const prepareHeader = (e: Element) => {
  if (["H1", "H2"].includes(e.nodeName)) {
    e.setAttribute("data-sticky", "")
  }
  if (!e.id && e.textContent) {
    e.id = slugger.slug(e.textContent)
  }
  if (e.firstChild?.nodeName !== "A") {
    const anchor = document.createElement("a")
    anchor.href = `#${e.id}`
    anchor.textContent = e.textContent
    e.replaceChildren(anchor)
  }
}

const prepareSection = (e: Element) => {
  if (["H1", "H2", "H3", "H4"].includes(e.nodeName)) {
    prepareHeader(e)
  }
  return wrapSection(e)
}

/**
 * Performs all transformations on top-level article headers
 *
 * Assigns an id, creates an anchor, makes h1 and h2 responsive to data-sticky, and wraps the header and following content in a section tag
 *
 * This picks up any headers not already modified by rehypeSlug and rehypeAutolinkHeadings (anything besides markdown content)
 */
export const prepareSections = () => {
  let start = document.body.querySelector("#article > :not(section)")
  while (start) {
    start = prepareSection(start)
  }
}
