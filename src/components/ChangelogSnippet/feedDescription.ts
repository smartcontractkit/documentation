import DOMPurify from "isomorphic-dompurify"

/**
 * Converts a changelog description into HTML that renders in RSS readers.
 *
 * Data feed entries use site-specific markup: CSS classes for layout and placeholder
 * token icons that client-side JS swaps for the real ones. Feed readers apply neither,
 * so each entry becomes a plain list item ("<pair link> (<network>)") and
 * presentational attributes are stripped.
 */
export function toFeedDescription(html: string): string {
  const fragment = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true })
  const doc = fragment.ownerDocument
  const lists = new Set<Element>()

  for (const entry of fragment.querySelectorAll(".log-item__data-entry")) {
    const info = entry.querySelector(".log-item__data-entry-info")
    const network = entry.querySelector(".log-item__data-entry-info2")?.textContent?.trim()

    const item = doc.createElement("li")
    item.append(info?.querySelector("a") ?? info?.textContent?.trim() ?? "")
    if (network) item.append(` (${network})`)

    // Group consecutive entries into a single list
    const previous = entry.previousElementSibling
    if (previous && lists.has(previous)) {
      previous.append(item)
      entry.remove()
    } else {
      const list = doc.createElement("ul")
      list.append(item)
      lists.add(list)
      entry.replaceWith(list)
    }
  }

  const container = doc.createElement("div")
  container.append(fragment)
  return DOMPurify.sanitize(container.innerHTML, {
    USE_PROFILES: { html: true },
    FORBID_ATTR: ["class", "style", "id"],
    ALLOW_DATA_ATTR: false,
  })
}
