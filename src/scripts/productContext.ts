/**
 * Client-side helpers for shared docs that carry their product context in
 * `?parent=<section>`. Shared Chainlink Platform pages use these to keep links
 * and product-scoped content in the current product's docs.
 */

const SECTIONS_WITHOUT_PRODUCT_CONTEXT = new Set(["chainlinkPlatform", "global", "legacy"])

/** Returns the product context for this page, if there is one. */
export function getProductContext(): string | null {
  const parent = new URLSearchParams(window.location.search).get("parent")
  if (parent) return parent

  const section = document.querySelector<HTMLElement>("nav[aria-labelledby='grid-left']")?.dataset.section
  return section && !SECTIONS_WITHOUT_PRODUCT_CONTEXT.has(section) ? section : null
}

/** Keeps links to shared platform pages inside the current product's docs. */
export const preservePlatformParentLinks = () => {
  const parent = getProductContext()
  if (!parent) return

  const links = document.querySelectorAll<HTMLAnchorElement>(
    'main a[href^="/chainlink-platform/"], main a[href="/chainlink-platform"]'
  )
  for (const link of links) {
    const url = new URL(link.href)
    if (url.searchParams.has("parent")) continue
    url.searchParams.set("parent", parent)
    link.href = `${url.pathname}${url.search}${url.hash}`
  }
}

/** Hides inline content that only applies to the listed products. */
export const applyProductOnlyVisibility = () => {
  const parent = getProductContext()

  for (const element of document.querySelectorAll<HTMLElement>("[data-product-only]")) {
    const allowed = element.dataset.productOnly?.split(",") ?? []
    const strict = element.dataset.productOnlyStrict === "true"
    const matches = parent !== null && allowed.includes(parent)
    const hide = strict ? !matches : Boolean(parent) && !matches

    element.hidden = hide
    const listItem = element.closest("li")
    if (listItem) {
      listItem.hidden = hide
    }
  }
}
