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
  replaceNode,
  staticEstreeValue,
} from "./componentHandlers.js"
import fs from "fs"
import path from "path"
import { removeLeadingMdxFrontmatter } from "./sourceScanners.js"

function staticMdxString(value: unknown): string | undefined {
  const expression = (
    value as { data?: { estree?: { body?: { expression?: Parameters<typeof staticEstreeValue>[0] }[] } } } | undefined
  )?.data?.estree?.body?.[0]?.expression
  const staticValue = staticEstreeValue(expression)
  return typeof staticValue === "string" ? staticValue : undefined
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
        calloutContent = removeLeadingMdxFrontmatter(calloutContent)

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
  const preprocessedMarkdown = preprocessCcipCommon(markdown)

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
        if (
          (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
          (node as MdxJsxNode).name === "ClickToZoom"
        ) {
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

        if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
          const mdxNode = node as MdxJsxNode
          const nodeName = mdxNode.name
          const children = (mdxNode as Parent).children || []

          if (nodeName === "a") {
            const hrefAttribute = mdxNode.attributes?.find((attribute) => attribute.name === "href")
            const href =
              typeof hrefAttribute?.value === "string" ? hrefAttribute.value : staticMdxString(hrefAttribute?.value)
            if (href !== undefined) {
              parent.children[index] = { type: "link", url: href, children } as Parent & { url: string }
              return
            }
            parent.children.splice(index, 1, ...children)
            return index
          }

          if (nodeName === "code") {
            let value = ""
            for (const child of children) {
              if (child.type === "text") value += String((child as Literal).value)
              else if (child.type === "mdxTextExpression" || child.type === "mdxFlowExpression") {
                value += staticMdxString(child) ?? ""
              }
            }
            parent.children[index] = { type: "inlineCode", value } as Literal
            return
          }

          if (nodeName === "b" || nodeName === "strong") {
            parent.children[index] = { type: "strong", children } as Parent
            return
          }

          if (nodeName === "ul") {
            const replacement: Node[] = []
            let listItemCount = 0
            for (const child of children) {
              if (
                (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") &&
                (child as MdxJsxNode).name === "li"
              ) {
                if (listItemCount > 0) replacement.push({ type: "text", value: "; " } as Literal)
                replacement.push(...((child as Parent).children || []))
                listItemCount++
              } else if (child.type !== "text" || String((child as Literal).value).trim()) {
                replacement.push(child)
              }
            }
            parent.children.splice(index, 1, ...replacement)
            return index
          }

          // ponytail: unwrap HTML tables to text; emit markdown tables if agents need grid structure
          if (
            nodeName === "li" ||
            nodeName === "sub" ||
            nodeName === "span" ||
            nodeName === "p" ||
            nodeName === "div" ||
            nodeName === "table" ||
            nodeName === "thead" ||
            nodeName === "tbody" ||
            nodeName === "tr" ||
            nodeName === "th" ||
            nodeName === "td" ||
            ((nodeName === "br" || nodeName === "nobr") && children.length > 0)
          ) {
            return replaceNode(mdxNode, parent, index, children)
          }

          if (nodeName === "br" || nodeName === "nobr") {
            parent.children.splice(index, 1)
            return index
          }
        }

        if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
          const value = staticMdxString(node)
          if (value !== undefined) {
            parent.children[index] = { type: "text", value } as Literal
            return
          }
          parent.children.splice(index, 1)
          return index
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
          node.type === "html"
        ) {
          parent.children.splice(index, 1)
          return index
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
