/** @jsxImportSource preact */
import type { ComponentChildren, Key } from "preact"
import { createElement } from "preact"
import { useEffect, useRef } from "preact/hooks"
import { updateTableOfContents } from "~/components/TableOfContents/tocStore"
import GithubSlugger from "github-slugger"

type Props = {
  title: string
  depth: number // Depth must be between 2 and 4 inclusive
  children: ComponentChildren
  idOverride?: string
  updateTOC?: boolean
  key?: Key
}

/**
 * Use this component to wrap client-side components which feature section headers between h2 - h4.
 * Provides sticky functionality, anchor tags and updates table of contents as needed
 */
function SectionWrapper({ title, depth, children, idOverride, updateTOC = true, key }: Props) {
  const slugger = new GithubSlugger()
  const id = idOverride || slugger.slug(title)
  const headerRef = useRef<HTMLElement>(null)
  const sectionHeader = createElement(`h${depth}`, {
    children: <a href={`#${id}`}>{title}</a>,
  })
  sectionHeader.props.id = id
  sectionHeader.ref = headerRef
  useEffect(() => {
    if (updateTOC) {
      updateTableOfContents()
    }
    const header = headerRef.current
    if (header && depth === 2) {
      header.setAttribute("data-sticky", "")
    }
  }, [])

  if (depth < 2 || depth > 4) {
    throw new Error(`Depth must be between 2 and 4, was provided with ${depth}`)
  }

  return (
    <section key={key} id={id}>
      {sectionHeader}
      {children}
    </section>
  )
}

export default SectionWrapper
