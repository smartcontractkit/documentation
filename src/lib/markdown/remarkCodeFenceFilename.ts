import { visit } from "unist-util-visit"

import { getLanguageIconSrc, languageBadge } from "../codeSample/language.js"

const FILENAME_RE = /(?:^|\s)filename\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s]+))/i

/**
 * Wrap fenced code blocks that include `filename="..."` meta in a lightweight
 * `.code-sample` container so we can add a CodeSample-like header in rehype
 * (after syntax highlighting), while keeping the filename metadata intact.
 */
export default function remarkCodeFenceFilename() {
  return (tree: unknown) => {
    visit(tree as any, "code", (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== "number") return

      const meta = typeof node?.meta === "string" ? node.meta : ""
      if (!meta) return

      const match = meta.match(FILENAME_RE)
      if (!match) return

      const filename = String(match[1] || match[2] || match[3] || "").trim()
      if (!filename) return

      const language = typeof node.lang === "string" && node.lang.trim() ? node.lang.trim().toLowerCase() : "text"

      const iconSrc = getLanguageIconSrc(language)
      const badge = languageBadge(language)

      const langChildren = iconSrc
        ? [
            {
              type: "mdxJsxFlowElement",
              name: "img",
              attributes: [
                { type: "mdxJsxAttribute", name: "class", value: "code-sample__lang-icon" },
                { type: "mdxJsxAttribute", name: "src", value: iconSrc },
                { type: "mdxJsxAttribute", name: "alt", value: "" },
              ],
              children: [],
            },
          ]
        : [{ type: "text", value: badge }]

      const header = {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [{ type: "mdxJsxAttribute", name: "class", value: "code-sample__header" }],
        children: [
          {
            type: "mdxJsxFlowElement",
            name: "div",
            attributes: [{ type: "mdxJsxAttribute", name: "class", value: "code-sample__header-left" }],
            children: [
              {
                type: "mdxJsxFlowElement",
                name: "span",
                attributes: [
                  {
                    type: "mdxJsxAttribute",
                    name: "class",
                    value: `code-sample__lang${iconSrc ? " code-sample__lang--icon" : ""}`,
                  },
                  { type: "mdxJsxAttribute", name: "aria-hidden", value: "true" },
                ],
                children: langChildren,
              },
              {
                type: "mdxJsxFlowElement",
                name: "span",
                attributes: [
                  { type: "mdxJsxAttribute", name: "class", value: "code-sample__filename" },
                  { type: "mdxJsxAttribute", name: "title", value: filename },
                ],
                children: [{ type: "text", value: filename }],
              },
            ],
          },
          {
            type: "mdxJsxFlowElement",
            name: "button",
            attributes: [
              { type: "mdxJsxAttribute", name: "type", value: "button" },
              { type: "mdxJsxAttribute", name: "class", value: "code-sample__copy-button" },
              { type: "mdxJsxAttribute", name: "aria-label", value: "Copy code" },
            ],
            children: [
              {
                type: "mdxJsxFlowElement",
                name: "img",
                attributes: [
                  { type: "mdxJsxAttribute", name: "src", value: "/assets/icons/copyIcon.svg" },
                  { type: "mdxJsxAttribute", name: "alt", value: "Copy code" },
                  { type: "mdxJsxAttribute", name: "width", value: "16" },
                  { type: "mdxJsxAttribute", name: "height", value: "16" },
                ],
                children: [],
              },
            ],
          },
        ],
      }

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [
          { type: "mdxJsxAttribute", name: "class", value: "code-sample" },
          { type: "mdxJsxAttribute", name: "data-language", value: language },
          { type: "mdxJsxAttribute", name: "data-filename", value: filename },
        ],
        children: [header, node],
      }
    })
  }
}
