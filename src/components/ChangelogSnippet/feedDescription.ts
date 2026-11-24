import DOMPurify from "isomorphic-dompurify"

// Equity streams share a pair name across trading sessions; the session is only in the URL
const SESSIONS = [
  { pattern: /regularhours/i, label: "Regular Hours" },
  { pattern: /extendedhours/i, label: "Extended Hours" },
  { pattern: /overnighthours/i, label: "Overnight Hours" },
]

const TEXT_NODE = 3

interface ListEntry {
  item: Element
  pair: string
  sessionRank: number
  network: string
}

const compareEntries = (a: ListEntry, b: ListEntry) =>
  a.pair.localeCompare(b.pair) || a.sessionRank - b.sessionRank || a.network.localeCompare(b.network)

/**
 * Converts a changelog description into HTML that renders in RSS readers.
 *
 * Data feed and stream entries use site-specific markup: CSS classes for layout and
 * placeholder token icons that client-side JS swaps for the real ones. Feed readers apply
 * neither, so each entry becomes a plain list item ("<pair (session) link> (<network>)"),
 * each list is sorted by pair, session, then network, and presentational attributes are
 * stripped.
 */
export function toFeedDescription(html: string): string {
  const fragment = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true })
  const doc = fragment.ownerDocument
  const lists = new Map<Element, ListEntry[]>()

  for (const entry of fragment.querySelectorAll(".log-item__data-entry")) {
    const info = entry.querySelector(".log-item__data-entry-info")
    const link = info?.querySelector("a")
    const pair = (link ?? info)?.textContent?.trim() ?? ""
    const network = entry.querySelector(".log-item__data-entry-info2")?.textContent?.trim() ?? ""

    const sessionRank = SESSIONS.findIndex(({ pattern }) => pattern.test(link?.getAttribute("href") ?? ""))
    const label = sessionRank === -1 ? pair : `${pair} (${SESSIONS[sessionRank].label})`

    const item = doc.createElement("li")
    if (link) {
      link.textContent = label
      item.append(link)
    } else {
      item.append(label)
    }
    if (network) item.append(` (${network})`)

    const listEntry = { item, pair, sessionRank, network }

    // Group consecutive entries (separated only by whitespace) into a single list
    let previous = entry.previousSibling
    const gap: ChildNode[] = []
    while (previous?.nodeType === TEXT_NODE && !previous.textContent?.trim()) {
      gap.push(previous)
      previous = previous.previousSibling
    }
    const previousEntries = previous ? lists.get(previous as Element) : undefined
    if (previousEntries) {
      previousEntries.push(listEntry)
      gap.forEach((node) => node.remove())
      entry.remove()
    } else {
      const list = doc.createElement("ul")
      lists.set(list, [listEntry])
      entry.replaceWith(list)
    }
  }

  for (const [list, entries] of lists) {
    list.append(...entries.sort(compareEntries).map(({ item }) => item))
  }

  const container = doc.createElement("div")
  container.append(fragment)
  return DOMPurify.sanitize(container.innerHTML, {
    USE_PROFILES: { html: true },
    FORBID_ATTR: ["class", "style", "id"],
    ALLOW_DATA_ATTR: false,
  })
}
