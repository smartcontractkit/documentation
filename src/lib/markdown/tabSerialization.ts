import type { Literal, Node, Parent } from "unist"
import { SKIP, visit } from "unist-util-visit"
import type { MdxJsxNode } from "./types.js"

const TAB_COMPONENTS = new Set(["Tabs", "TabsContent"])

function getSlot(node: MdxJsxNode): string | undefined {
  const slot = node.attributes?.find((attribute) => attribute.name === "slot")
  return typeof slot?.value === "string" ? slot.value : undefined
}

function getText(node: Node): string {
  if ("value" in node && typeof node.value === "string") return node.value
  if ("children" in node && Array.isArray(node.children)) return node.children.map(getText).join("").trim()
  return ""
}

function createLabel(label: string): Parent {
  return {
    type: "paragraph",
    children: [
      {
        type: "strong",
        children: [{ type: "text", value: label } as Literal],
      } as Parent,
    ],
  }
}

function getFragments(node: Node): MdxJsxNode[] {
  const candidate = node as MdxJsxNode
  if (
    (candidate.type === "mdxJsxFlowElement" || candidate.type === "mdxJsxTextElement") &&
    candidate.name === "Fragment"
  ) {
    return [candidate]
  }

  if (node.type !== "paragraph") return []

  const significantChildren = (node as Parent).children.filter(
    (child) => child.type !== "text" || !("value" in child) || String(child.value).trim()
  )
  const fragments = significantChildren.flatMap(getFragments)
  return fragments.length === significantChildren.length ? fragments : []
}

/** Convert interactive tab slots into sequential, labeled markdown content. */
export function serializeTabbedContent(tree: Node): void {
  visit(tree, "mdxJsxFlowElement", (node: MdxJsxNode, index, parent: Parent | undefined) => {
    if (!parent || typeof index !== "number" || !node.name || !TAB_COMPONENTS.has(node.name)) return

    const children = (node as Parent).children || []
    const labels = new Map<string, string>()
    const panels: Array<{ key: string; children: Node[] }> = []
    const unassigned: Node[] = []

    for (const child of children) {
      const fragments = getFragments(child)
      if (fragments.length === 0) {
        unassigned.push(child)
        continue
      }

      for (const fragment of fragments) {
        const slot = getSlot(fragment)
        if (slot?.startsWith("tab.")) labels.set(slot.slice("tab.".length), getText(fragment))
        else if (slot?.startsWith("panel.")) {
          panels.push({ key: slot.slice("panel.".length), children: (fragment as Parent).children || [] })
        } else unassigned.push(...((fragment as Parent).children || []))
      }
    }

    const replacement: Node[] = [...unassigned]
    for (const panel of panels) {
      replacement.push(createLabel(labels.get(panel.key) || `Option ${panel.key}`), ...panel.children)
    }

    parent.children.splice(index, 1, ...replacement)
    return [SKIP, index + replacement.length]
  })
}
