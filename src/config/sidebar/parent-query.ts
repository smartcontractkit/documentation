import type { Sections } from "../../content.config.ts"
import type { SectionContent, SectionEntry } from "../sidebar.ts"

/**
 * Shared helpers for sidebar sections whose pages live in one section but are
 * also surfaced in other products' sidebars via a `?parent=<section>` query
 * parameter (e.g. `/chainlink-platform/rbac?parent=cre`).
 */

function addParentParam(url: string, parent: Sections): string {
  const [path] = url.split("?")
  return `${path}?parent=${parent}`
}

function mapContentsWithParent(contents: SectionContent[], parent: Sections): SectionContent[] {
  return contents.map((item) => ({
    ...item,
    url: item.url ? addParentParam(item.url, parent) : item.url,
    children: item.children ? mapContentsWithParent(item.children, parent) : undefined,
  }))
}

/** Returns the section with URLs scoped to a product sidebar via `?parent=`. */
export function withParentQuery(section: SectionEntry, parent: Sections): SectionEntry {
  return {
    ...section,
    contents: mapContentsWithParent(section.contents, parent),
  }
}
