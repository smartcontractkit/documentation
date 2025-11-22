/**
 * Core markdown transformation using unified/remark pipeline
 */

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkMdx from "remark-mdx"
import remarkGfm from "remark-gfm"
import remarkStringify from "remark-stringify"
import { visit } from "unist-util-visit"
import type { Node, Parent, Literal } from "unist"
import type { TransformConfig, MdxJsxNode, ComponentContext } from "./types.js"
import {
  handleCcipCommon,
  handleCodeHighlightBlock,
  handleCodeHighlightBlockMulti,
  handleCopyText,
  handleDiv,
  handleAside,
  handleClickToZoom,
  handleCodeSample,
  handleBilling,
  loadCcipCommonMapping,
} from "./componentHandlers.js"
import fs from "fs"
import path from "path"

/**
 * Convert Aside components to markdown blockquotes
 * Handles multi-line Aside tags by converting them to blockquote format
 * Preserves Asides with nested JSX components (they'll be handled by AST or remain as-is)
 * @param content - Markdown content that may contain Aside components
 * @returns Content with simple Aside tags converted to blockquotes
 */
function convertAsidesToBlockquotes(content: string): string {
  // Match multi-line Aside components
  const asideRegex = /<Aside\s+type="(\w+)"(?:\s+title="([^"]*)")?\s*>([\s\S]*?)<\/Aside>/g

  return content.replace(asideRegex, (fullMatch, type, title, children) => {
    // Check if the Aside contains other JSX components (like Tabs, CopyText, etc.)
    const hasJSXComponents = /<[A-Z]\w+/.test(children)

    if (hasJSXComponents) {
      // Keep as-is - these complex nested structures need manual handling
      // or will be dropped by the AST handlers
      return fullMatch
    }

    // Create a blockquote directly in markdown format
    // This avoids JSX parsing issues entirely
    const cleanChildren = children.trim()
    const asideType = type.toUpperCase()
    const header = title ? `**${asideType}: ${title}**` : `**${asideType}**`

    // Return as markdown blockquote
    return `\n\n> ${header}\n>\n> ${cleanChildren}\n\n`
  })
}

/**
 * Convert ClickToZoom components to markdown images
 * Handles self-closing ClickToZoom tags by converting to standard markdown image syntax
 * @param content - Markdown content that may contain ClickToZoom components
 * @returns Content with ClickToZoom tags converted to markdown images
 */
function convertClickToZoomToImages(content: string): string {
  // Match self-closing ClickToZoom tags with any attributes
  // Captures src and alt, ignores other attributes like style
  const clickToZoomRegex = /<ClickToZoom\s+[^>]*src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*\/>/g

  return content.replace(clickToZoomRegex, (_, src, alt) => {
    const altText = alt || "Image"
    return `![${altText}](${src})`
  })
}

/**
 * Preprocess CcipCommon components by inlining their content
 * This is essential because remarkMdx doesn't always parse self-closing JSX tags properly
 * @param markdown - Raw markdown content
 * @returns Markdown with CcipCommon components replaced by their content
 */
function preprocessCcipCommon(markdown: string): string {
  const ccipCommonRegex = /<CcipCommon\s+callout="(\w+)"\s*\/>/g
  let preprocessedMarkdown = markdown

  for (const match of markdown.matchAll(ccipCommonRegex)) {
    const [fullMatch, calloutName] = match
    const calloutFileMap = loadCcipCommonMapping()
    const fileName = calloutFileMap[calloutName]

    if (fileName) {
      const calloutPath = path.resolve("src/features/ccip", fileName)
      if (fs.existsSync(calloutPath)) {
        let calloutContent = fs.readFileSync(calloutPath, "utf-8")

        // Strip frontmatter if present
        if (calloutContent.trim().startsWith("---")) {
          calloutContent = calloutContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
        }

        // Strip import statements
        calloutContent = calloutContent.replace(/^import\s+.+$/gm, "").trim()

        // Convert Aside components to blockquotes
        calloutContent = convertAsidesToBlockquotes(calloutContent)

        // Replace the CcipCommon tag with the processed content
        preprocessedMarkdown = preprocessedMarkdown.replace(fullMatch, "\n\n" + calloutContent + "\n\n")
      }
    }
  }

  return preprocessedMarkdown
}

/**
 * Transform markdown content using unified/remark pipeline
 * @param markdown - Raw markdown content
 * @param mdxAbsPath - Absolute path to the MDX file
 * @param config - Transformation configuration
 * @returns Transformed markdown string
 */
export async function transformMarkdown(
  markdown: string,
  mdxAbsPath: string,
  config: Partial<TransformConfig> = {}
): Promise<string> {
  const { targetLanguage } = config

  // Preprocessing pipeline - apply transformations before AST parsing
  // This handles components that remarkMdx struggles to parse (multi-line JSX)

  // Step 1: Preprocess CcipCommon components (inline callout content)
  let preprocessedMarkdown = preprocessCcipCommon(markdown)

  // Step 2: Convert Aside components to markdown blockquotes
  // Applies to both main content and inlined CcipCommon content
  preprocessedMarkdown = convertAsidesToBlockquotes(preprocessedMarkdown)

  // Step 3: Convert ClickToZoom to markdown images
  preprocessedMarkdown = convertClickToZoomToImages(preprocessedMarkdown)

  // Create unified processor with remark plugins
  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkGfm)
    .use(() => (tree: Node) => {
      // Create context for component handlers
      const context: ComponentContext = {
        mdxAbsPath,
        markdown,
        targetLanguage,
        processor,
      }

      visit(tree, (node: Node, index: number | undefined, parent: Parent | undefined) => {
        if (!parent || typeof index !== "number") return

        // Handle CodeHighlightBlockMulti
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "CodeHighlightBlockMulti") {
          return handleCodeHighlightBlockMulti(node as MdxJsxNode, parent, index, context)
        }

        // Handle CodeHighlightBlock
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "CodeHighlightBlock") {
          return handleCodeHighlightBlock(node as MdxJsxNode, parent, index, context)
        }

        // Handle CcipCommon
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "CcipCommon") {
          return handleCcipCommon(node as MdxJsxNode, parent, index, context)
        }

        // Handle Aside
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "Aside") {
          return handleAside(node as MdxJsxNode, parent, index, context)
        }

        // Handle ClickToZoom
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "ClickToZoom") {
          return handleClickToZoom(node as MdxJsxNode, parent, index, context)
        }

        // Handle CodeSample
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "CodeSample") {
          return handleCodeSample(node as MdxJsxNode, parent, index, context)
        }

        // Handle Billing
        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "Billing") {
          return handleBilling(node as MdxJsxNode, parent, index, context)
        }

        // Handle MDX JSX text elements
        if (node.type === "mdxJsxTextElement") {
          const nodeName = (node as MdxJsxNode).name

          // Handle CopyText
          if (nodeName === "CopyText") {
            return handleCopyText(node as MdxJsxNode, parent, index)
          }

          // Handle <div> tags (often used for styling in tables)
          if (nodeName === "div" && (node as Parent).children) {
            return handleDiv(node as MdxJsxNode, parent, index)
          }
        }

        // Drop MDX/import/export nodes (except handled components)
        if (
          (node.type === "mdxJsxFlowElement" &&
            (node as MdxJsxNode).name !== "Aside" &&
            (node as MdxJsxNode).name !== "CcipCommon" &&
            (node as MdxJsxNode).name !== "ClickToZoom" &&
            (node as MdxJsxNode).name !== "CodeSample" &&
            (node as MdxJsxNode).name !== "Billing") ||
          node.type === "mdxjsEsm" ||
          node.type === "import" ||
          node.type === "export"
        ) {
          parent.children.splice(index, 1)
          return
        }

        // Handle HTML nodes - drop them
        if (node.type === "html") {
          parent.children.splice(index, 1)
          return
        }

        // Replace images with their alt text
        if (node.type === "image") {
          const alt = (node as { alt?: string }).alt ? String((node as { alt?: string }).alt) : "Image"
          parent.children[index] = { type: "text", value: `(Image: ${alt})` } as Literal
        }

        // Note: We preserve link nodes as-is so they're rendered as markdown links [text](url)
      })
    })
    .use(remarkStringify, {
      fences: true,
      bullet: "-",
    })

  const file = await processor.process(preprocessedMarkdown)
  return String(file)
}

/**
 * Transform a single page to markdown with metadata
 * @param mdxContent - Raw MDX content
 * @param mdxAbsPath - Absolute path to MDX file
 * @param config - Transformation configuration
 * @returns Transformed markdown with frontmatter
 */
export async function transformPageToMarkdown(
  mdxContent: string,
  mdxAbsPath: string,
  config: Partial<TransformConfig> = {}
): Promise<string> {
  // Transform the markdown
  const transformed = await transformMarkdown(mdxContent, mdxAbsPath, config)

  return transformed
}
