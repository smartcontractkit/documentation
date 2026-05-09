import { visit } from "unist-util-visit"

import { getLanguageIconSrc, languageBadge } from "../codeSample/language.js"

function toCamelCaseDataAttr(attr: string): string {
  // "data-filename" -> "dataFilename"
  return attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function getProp(node: any, attr: string): unknown {
  if (!node?.properties) return undefined
  return node.properties[attr] ?? node.properties[toCamelCaseDataAttr(attr)]
}

function deleteProp(node: any, attr: string): void {
  if (!node?.properties) return
  delete node.properties[attr]
  delete node.properties[toCamelCaseDataAttr(attr)]
}

function normalizeClassName(className: unknown): string[] {
  if (!className) return []
  if (Array.isArray(className)) return className.map(String)
  return String(className)
    .split(/\s+/)
    .map((c) => c.trim())
    .filter(Boolean)
}

/**
 * Convert `.code-sample[data-filename]` wrappers (created in remark) into full
 * CodeSample-style blocks by inserting the header markup and adjusting the
 * contained `<pre>` for shared styling + copy-button behavior.
 */
export default function rehypeCodeSampleFences() {
  return (tree: unknown) => {
    visit(tree as any, "element", (node: any, index: number | undefined, parent: any) => {
      if (!node || node.tagName !== "div") return

      const classes = normalizeClassName(node.properties?.className)
      if (!classes.includes("code-sample")) return

      const filenameRaw = getProp(node, "data-filename")
      const filename = typeof filenameRaw === "string" ? filenameRaw.trim() : ""
      if (!filename) return

      // Avoid double-inserting if this already has a header.
      const hasHeader =
        Array.isArray(node.children) &&
        node.children.some(
          (c: any) =>
            c?.type === "element" &&
            c?.tagName === "div" &&
            normalizeClassName(c?.properties?.className).includes("code-sample__header")
        )
      if (hasHeader) return

      const preEl =
        Array.isArray(node.children) && node.children.find((c: any) => c?.type === "element" && c?.tagName === "pre")
      if (!preEl) return

      const languageRaw = getProp(node, "data-language") ?? getProp(preEl, "data-language")
      const language = typeof languageRaw === "string" && languageRaw.trim() ? languageRaw.trim() : "text"
      const languageKey = language.toLowerCase()
      const iconSrc = getLanguageIconSrc(languageKey)

      // Update the <pre> node to match CodeSample behavior
      const existing = normalizeClassName(preEl.properties?.className)
      preEl.properties = preEl.properties || {}
      preEl.properties.className = Array.from(
        new Set([...existing, "code-sample__pre", "code-sample__pre--with-header"])
      )
      preEl.properties["data-no-copy-button"] = ""

      const langSpan: any = {
        type: "element",
        tagName: "span",
        properties: {
          className: ["code-sample__lang", ...(iconSrc ? ["code-sample__lang--icon"] : [])],
          "aria-hidden": "true",
        },
        children: iconSrc
          ? [
              {
                type: "element",
                tagName: "img",
                properties: { className: ["code-sample__lang-icon"], src: iconSrc, alt: "" },
                children: [],
              },
            ]
          : [{ type: "text", value: languageBadge(languageKey) }],
      }

      const filenameSpan: any = {
        type: "element",
        tagName: "span",
        properties: { className: ["code-sample__filename"], title: filename },
        children: [{ type: "text", value: filename }],
      }

      const headerLeft: any = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-sample__header-left"] },
        children: [langSpan, filenameSpan],
      }

      const copyButton: any = {
        type: "element",
        tagName: "button",
        properties: { type: "button", className: ["code-sample__copy-button"], "aria-label": "Copy code" },
        children: [
          {
            type: "element",
            tagName: "img",
            properties: { src: "/assets/icons/copyIcon.svg", alt: "Copy code", width: "16", height: "16" },
            children: [],
          },
        ],
      }

      const header: any = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-sample__header"] },
        children: [headerLeft, copyButton],
      }

      const wrapper: any = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-sample"], "data-language": languageKey },
        children: [header, preEl],
      }

      // Replace this placeholder wrapper with the full wrapper (keeping only the pre).
      // (We intentionally don't preserve `data-filename` in output markup.)
      if (parent && typeof index === "number") parent.children[index] = wrapper
    })
  }
}
