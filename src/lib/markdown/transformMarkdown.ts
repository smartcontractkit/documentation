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
  handlePageTabs,
  handleTabs,
  handlePackageManagerTabs,
  handleFragment,
  handleAccordion,
  handleAddress,
  handleCallout,
  handleAnyApiCallout,
  handleFeedsCommonCallout,
  handleResourcesCallout,
  handleDataStreams,
  handleSchemaFieldsTable,
  loadCcipCommonMapping,
} from "./componentHandlers.js"
import fs from "fs"
import path from "path"

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
 * Inlined MDX components continue through the normal remark AST visitor
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
      let calloutPath: string | undefined
      try {
        const ccipRoot = fs.realpathSync(path.resolve("src/features/ccip"))
        const candidate = fs.realpathSync(path.resolve(ccipRoot, fileName))
        if (candidate === ccipRoot || candidate.startsWith(ccipRoot + path.sep)) calloutPath = candidate
      } catch {
        // Missing or escaping selector targets remain unexpanded and are dropped by the AST visitor.
      }
      if (calloutPath) {
        let calloutContent = fs.readFileSync(calloutPath, "utf-8")

        // Strip frontmatter if present
        if (calloutContent.trim().startsWith("---")) {
          calloutContent = calloutContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
        }

        // Strip import statements
        calloutContent = calloutContent.replace(/^import\s+.+$/gm, "").trim()

        // Replace the CcipCommon tag with the inlined content
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

  // Inline CcipCommon content before AST parsing so embedded components reach the normal AST handlers.
  let preprocessedMarkdown = preprocessCcipCommon(markdown)

  // Convert ClickToZoom to markdown images
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
          return handleBilling(parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "PageTabs") {
          return handlePageTabs(node as MdxJsxNode, parent, index)
        }

        if (
          node.type === "mdxJsxFlowElement" &&
          ((node as MdxJsxNode).name === "Tabs" || (node as MdxJsxNode).name === "TabsContent")
        ) {
          return handleTabs(node as MdxJsxNode, parent, index)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "PackageManagerTabs") {
          return handlePackageManagerTabs(node as MdxJsxNode, parent, index)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "Accordion") {
          return handleAccordion(node as MdxJsxNode, parent, index)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "Callout") {
          return handleCallout(node as MdxJsxNode, parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "AnyApiCallout") {
          return handleAnyApiCallout(node as MdxJsxNode, parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "FeedsCommonCallout") {
          return handleFeedsCommonCallout(node as MdxJsxNode, parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "ResourcesCallout") {
          return handleResourcesCallout(node as MdxJsxNode, parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "DataStreams") {
          return handleDataStreams(node as MdxJsxNode, parent, index, context)
        }

        if (node.type === "mdxJsxFlowElement" && (node as MdxJsxNode).name === "SchemaFieldsTable") {
          return handleSchemaFieldsTable(node as MdxJsxNode, parent, index, context)
        }

        if (
          (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
          (node as MdxJsxNode).name === "Address"
        ) {
          return handleAddress(node as MdxJsxNode, parent, index)
        }

        if (
          (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
          (node as MdxJsxNode).name === "Fragment"
        ) {
          return handleFragment(node as MdxJsxNode, parent, index)
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

        // Drop MDX/import/export nodes except the explicitly projected component names above.
        if (
          ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
            (node as MdxJsxNode).name !== "Aside" &&
            (node as MdxJsxNode).name !== "CcipCommon" &&
            (node as MdxJsxNode).name !== "ClickToZoom" &&
            (node as MdxJsxNode).name !== "CodeSample" &&
            (node as MdxJsxNode).name !== "Billing" &&
            (node as MdxJsxNode).name !== "PageTabs" &&
            (node as MdxJsxNode).name !== "Tabs" &&
            (node as MdxJsxNode).name !== "TabsContent" &&
            (node as MdxJsxNode).name !== "PackageManagerTabs" &&
            (node as MdxJsxNode).name !== "Fragment" &&
            (node as MdxJsxNode).name !== "Accordion" &&
            (node as MdxJsxNode).name !== "Address" &&
            (node as MdxJsxNode).name !== "Callout" &&
            (node as MdxJsxNode).name !== "AnyApiCallout" &&
            (node as MdxJsxNode).name !== "FeedsCommonCallout" &&
            (node as MdxJsxNode).name !== "ResourcesCallout" &&
            (node as MdxJsxNode).name !== "DataStreams" &&
            (node as MdxJsxNode).name !== "SchemaFieldsTable") ||
          node.type === "mdxjsEsm" ||
          node.type === "import" ||
          node.type === "export" ||
          node.type === "mdxFlowExpression" ||
          node.type === "mdxTextExpression" ||
          node.type === "html"
        ) {
          parent.children.splice(index, 1)
          return index
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
  let result = String(file)

  // Remove any JSX comments that might have slipped through as text
  result = result
    .split("\n")
    .filter((line) => !line.trim().match(/^{\/\*.*?\*\/}$/))
    .join("\n")

  return result
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
