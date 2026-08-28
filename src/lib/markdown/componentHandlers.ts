/**
 * Handlers for custom MDX components
 */

import fs from "fs"
import path from "path"
import type { Parent, Literal, Node } from "unist"
import type { MdxJsxNode, ComponentContext } from "./types.js"
import {
  calculateNetworkFeesForTokenMechanismDirect,
  calculateMessagingNetworkFeesDirect,
} from "../../config/data/ccip/utils.js"
import { TokenMechanism } from "../../config/data/ccip/types.js"
import { REPORT_SCHEMA_DEFINITIONS } from "../../features/feeds/components/reportSchemaData.js"

type StaticValue = null | boolean | number | string | StaticValue[] | { [key: string]: StaticValue }
type EstreeNode = {
  type?: string
  value?: unknown
  name?: string
  operator?: string
  argument?: EstreeNode
  elements?: (EstreeNode | null)[]
  properties?: EstreeNode[]
  key?: EstreeNode
  computed?: boolean
  kind?: string
  method?: boolean
  shorthand?: boolean
  expressions?: EstreeNode[]
  quasis?: { value?: { cooked?: string | null; raw?: string } }[]
}

const NON_STATIC = Symbol("non-static")

function staticEstreeValue(node: EstreeNode | undefined): StaticValue | typeof NON_STATIC {
  if (!node) return NON_STATIC
  if (node.type === "Literal") {
    return node.value === null || ["boolean", "number", "string"].includes(typeof node.value)
      ? (node.value as StaticValue)
      : NON_STATIC
  }
  if (node.type === "TemplateLiteral" && node.expressions?.length === 0 && node.quasis?.length === 1) {
    return node.quasis[0].value?.cooked ?? node.quasis[0].value?.raw ?? ""
  }
  if (node.type === "UnaryExpression" && (node.operator === "+" || node.operator === "-")) {
    const value = staticEstreeValue(node.argument)
    return typeof value === "number" ? (node.operator === "-" ? -value : value) : NON_STATIC
  }
  if (node.type === "ArrayExpression") {
    const values: StaticValue[] = []
    for (const element of node.elements || []) {
      if (!element) return NON_STATIC
      const value = staticEstreeValue(element)
      if (value === NON_STATIC) return NON_STATIC
      values.push(value)
    }
    return values
  }
  if (node.type === "ObjectExpression") {
    const value: { [key: string]: StaticValue } = {}
    for (const property of node.properties || []) {
      if (
        property.type !== "Property" ||
        property.computed ||
        property.kind !== "init" ||
        property.method ||
        property.shorthand
      ) {
        return NON_STATIC
      }
      const key =
        property.key?.type === "Identifier"
          ? property.key.name
          : property.key?.type === "Literal" &&
              (typeof property.key.value === "string" || typeof property.key.value === "number")
            ? String(property.key.value)
            : undefined
      const propertyValue = staticEstreeValue(property.value as EstreeNode)
      if (key === undefined || propertyValue === NON_STATIC) return NON_STATIC
      value[key] = propertyValue
    }
    return value
  }
  return NON_STATIC
}

function staticAttribute(node: MdxJsxNode, name: string): StaticValue | typeof NON_STATIC | undefined {
  const attribute = node.attributes?.find((candidate) => candidate.name === name)
  if (!attribute) return undefined
  const rawValue = attribute.value as unknown
  if (rawValue === null || rawValue === undefined) return true
  if (typeof rawValue === "string") return rawValue
  if (typeof rawValue !== "object") return NON_STATIC
  const expression = (
    rawValue as {
      data?: { estree?: { body?: { expression?: EstreeNode }[] } }
    }
  ).data?.estree?.body?.[0]?.expression
  return staticEstreeValue(expression)
}

function dropNode(parent: Parent, index: number): number {
  parent.children.splice(index, 1)
  return index
}

function textNode(value: string): Literal {
  return { type: "text", value } as Literal
}

function headingNode(depth: number, value: string): Parent {
  return { type: "heading", depth, children: [textNode(value)] } as Parent
}

function paragraphNode(children: Node[]): Parent {
  return { type: "paragraph", children } as Parent
}

function linkNode(label: string, url: string): Parent {
  return { type: "link", url, children: [textNode(label)] } as Parent
}

function staticNodeText(node: Node): string | typeof NON_STATIC {
  if (node.type === "text" || node.type === "inlineCode") {
    return typeof (node as Literal).value === "string" ? String((node as Literal).value) : NON_STATIC
  }
  if (node.type === "break") return " "
  if (node.type === "paragraph" || node.type === "emphasis" || node.type === "strong" || node.type === "delete") {
    const parts: string[] = []
    for (const child of (node as Parent).children || []) {
      const part = staticNodeText(child)
      if (part === NON_STATIC) return NON_STATIC
      parts.push(part)
    }
    return parts.join("")
  }
  return NON_STATIC
}

function staticChildrenText(node: Parent): string | typeof NON_STATIC {
  const parts: string[] = []
  for (const child of node.children || []) {
    const part = staticNodeText(child)
    if (part === NON_STATIC) return NON_STATIC
    parts.push(part)
  }
  return parts.join("").trim()
}

function resolveExistingWithin(root: string, candidate: string): string | undefined {
  try {
    const realRoot = fs.realpathSync(root)
    const realCandidate = fs.realpathSync(path.resolve(root, candidate))
    if (realCandidate === realRoot || realCandidate.startsWith(realRoot + path.sep)) return realCandidate
  } catch {
    // Missing files are not projectable.
  }
}

function stripHighlighterComments(code: string): string {
  return code
    .split("\n")
    .map((line) => line.replace(/\s*\/\/\s*highlight-(line|start|end)/, ""))
    .join("\n")
}

/**
 * Load CcipCommon callout mapping dynamically from CcipCommon.astro
 * @returns Mapping of callout names to file paths
 */
export function loadCcipCommonMapping(): Record<string, string> {
  try {
    const astroFilePath = path.resolve("src/features/ccip/CcipCommon.astro")
    const astroContent = fs.readFileSync(astroFilePath, "utf-8")

    // First, build a map of Component names to file paths from imports
    const importRegex = /import\s+(\w+)\s+from\s+["'](.+?)["']/g
    const componentToFile: Record<string, string> = {}

    for (const match of astroContent.matchAll(importRegex)) {
      const [, componentName, filePath] = match
      const cleanPath = filePath.replace(/^\.\//, "")
      componentToFile[componentName] = cleanPath
    }

    // Then, parse the conditional statements to map callout names to component names
    const conditionalRegex = /callout\s+===\s+["'](\w+)["']\s+&&\s+<(\w+)/g
    const mapping: Record<string, string> = {}

    for (const match of astroContent.matchAll(conditionalRegex)) {
      const [, calloutName, componentName] = match
      const filePath = componentToFile[componentName]
      if (filePath) {
        mapping[calloutName] = filePath
      }
    }

    return mapping
  } catch (e) {
    console.warn("Failed to load CcipCommon mapping:", e)
    return {}
  }
}

/**
 * Handle CcipCommon component - inline the referenced markdown content
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleCcipCommon(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    const calloutAttr = node.attributes?.find((a) => a.name === "callout")
    const calloutValue = typeof calloutAttr?.value === "string" ? calloutAttr.value : undefined

    if (calloutValue) {
      // Load mapping dynamically from CcipCommon.astro
      const calloutFileMap = loadCcipCommonMapping()
      const fileName = calloutFileMap[calloutValue]

      if (fileName) {
        const calloutPath = resolveExistingWithin(path.resolve("src/features/ccip"), fileName)

        if (calloutPath) {
          let calloutContent = fs.readFileSync(calloutPath, "utf-8")

          // Strip frontmatter if present
          if (calloutContent.trim().startsWith("---")) {
            calloutContent = calloutContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
          }

          // Strip import statements
          calloutContent = calloutContent.replace(/^import\s+.+$/gm, "").trim()

          // Parse the callout markdown and insert it
          const calloutTree = context.processor.parse(calloutContent)
          if (calloutTree && calloutTree.children) {
            parent.children.splice(index, 1, ...calloutTree.children)
            return index
          }
        }
      }
    }
    return dropNode(parent, index)
  } catch (e) {
    console.warn(`Failed to process CcipCommon in ${context.mdxAbsPath}:`, e)
    return dropNode(parent, index)
  }
}

/**
 * Handle CodeHighlightBlock component - inline imported code
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleCodeHighlightBlock(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    const codeVarAttr = node.attributes?.find((a) => a.name === "code")
    const codeVarName = (codeVarAttr?.value as { data?: { estree?: { body?: { expression?: { name?: string } }[] } } })
      ?.data?.estree?.body?.[0]?.expression?.name

    if (codeVarName) {
      const importRegex = new RegExp(`import\\s+${codeVarName}\\s+from\\s+['"](.+?)['"]`)
      const match = context.markdown.match(importRegex)

      if (match) {
        const importPath = match[1].split("?")[0] // Strip "?raw" and other query params
        const codeAbsPath = resolveExistingWithin(
          process.cwd(),
          path.resolve(path.dirname(context.mdxAbsPath), importPath)
        )
        if (!codeAbsPath) {
          return dropNode(parent, index)
        }
        let codeContent = fs.readFileSync(codeAbsPath, "utf-8")

        // Strip highlighter comments
        codeContent = codeContent
          .split("\n")
          .map((line) => line.replace(/\s*\/\/\s*highlight-(line|start|end)/, ""))
          .join("\n")

        const langAttr = node.attributes?.find((a) => a.name === "lang")
        const titleAttr = node.attributes?.find((a) => a.name === "title")

        const newNodes: Node[] = []

        if (titleAttr) {
          const title = `Code snippet for ${titleAttr.value}:`
          newNodes.push({ type: "paragraph", children: [{ type: "text", value: title } as Literal] } as Parent)
        }

        newNodes.push({
          type: "code",
          lang: langAttr?.value || "",
          value: codeContent.trim(),
        } as Literal)

        parent.children.splice(index, 1, ...newNodes)
        return index + newNodes.length
      }
    }
    return dropNode(parent, index)
  } catch (e) {
    console.warn(`Failed to process CodeHighlightBlock in ${context.mdxAbsPath}:`, e)
    return dropNode(parent, index)
  }
}

/**
 * Handle CodeHighlightBlockMulti component - inline language-specific code
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleCodeHighlightBlockMulti(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    const languagesAttr = node.attributes?.find((attribute) => attribute.name === "languages")
    const expression = (
      languagesAttr?.value as {
        data?: { estree?: { body?: { expression?: EstreeNode }[] } }
      }
    )?.data?.estree?.body?.[0]?.expression
    if (expression?.type !== "ObjectExpression") {
      return dropNode(parent, index)
    }

    const codeNodes: Node[] = []
    for (const languageProperty of expression.properties || []) {
      if (languageProperty.type !== "Property" || languageProperty.computed) continue
      const language =
        languageProperty.key?.type === "Identifier"
          ? languageProperty.key.name
          : languageProperty.key?.type === "Literal" && typeof languageProperty.key.value === "string"
            ? languageProperty.key.value
            : undefined
      if (!language || (context.targetLanguage && language !== context.targetLanguage)) continue

      const languageConfig = languageProperty.value as EstreeNode
      if (languageConfig?.type !== "ObjectExpression") continue
      const codeProperty = (languageConfig.properties || []).find((property) => {
        if (property.type !== "Property" || property.computed) return false
        return (
          (property.key?.type === "Identifier" && property.key.name === "code") ||
          (property.key?.type === "Literal" && property.key.value === "code")
        )
      })
      const codeExpression = codeProperty?.value as EstreeNode | undefined
      let code: string | undefined
      let codeLanguage = language

      if (codeExpression?.type === "Identifier" && codeExpression.name) {
        const importRegex = new RegExp(`import\\s+${codeExpression.name}\\s+from\\s+['"](.+?)['"]`)
        const importPath = context.markdown.match(importRegex)?.[1]?.split("?")[0]
        if (importPath) {
          const codePath = resolveExistingWithin(
            process.cwd(),
            path.resolve(path.dirname(context.mdxAbsPath), importPath)
          )
          if (codePath) {
            code = fs.readFileSync(codePath, "utf-8")
            codeLanguage = path.extname(codePath).slice(1) || language
          }
        }
      } else {
        const staticCode = staticEstreeValue(codeExpression)
        if (typeof staticCode === "string") code = staticCode
      }

      if (code !== undefined) {
        codeNodes.push({
          type: "code",
          lang: codeLanguage,
          value: stripHighlighterComments(code).trim(),
        } as Literal)
      }
    }

    if (codeNodes.length === 0) {
      return dropNode(parent, index)
    }
    parent.children.splice(index, 1, ...codeNodes)
    return index + codeNodes.length
  } catch (e) {
    console.warn(`Failed to process CodeHighlightBlockMulti in ${context.mdxAbsPath}:`, e)
    return dropNode(parent, index)
  }
}

/**
 * Handle CopyText component - extract text attribute
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleCopyText(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const textAttr = node.attributes?.find((a) => a.name === "text")

  if (textAttr?.value) {
    const attrValue = textAttr.value
    const textValue =
      typeof attrValue === "string"
        ? attrValue
        : typeof attrValue === "object" && attrValue && "value" in attrValue
          ? attrValue.value
          : ""

    parent.children[index] = { type: "text", value: textValue } as Literal
  }
}

/**
 * Handle generic MDX div elements - extract children
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleDiv(node: MdxJsxNode, parent: Parent, index: number): number | void {
  // Replace the <div> element with just its children
  if ((node as Parent).children) {
    parent.children.splice(index, 1, ...(node as Parent).children)
    return index
  }
}

/**
 * Handle Aside component - convert to markdown blockquote
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleAside(node: MdxJsxNode, parent: Parent, index: number, context: ComponentContext): number | void {
  try {
    const typeValue = staticAttribute(node, "type")
    const titleValue = staticAttribute(node, "title")
    if (
      typeValue === NON_STATIC ||
      (typeValue !== undefined && typeof typeValue !== "string") ||
      titleValue === NON_STATIC ||
      (titleValue !== undefined && typeof titleValue !== "string")
    ) {
      return dropNode(parent, index)
    }
    const type = typeof typeValue === "string" ? typeValue.toUpperCase() : "NOTE"
    const title = typeof titleValue === "string" ? titleValue : ""
    const header = title ? `${type}: ${title}` : type
    const blockquote = {
      type: "blockquote",
      children: [
        paragraphNode([{ type: "strong", children: [textNode(header)] } as Parent]),
        ...((node as Parent).children || []),
      ],
    } as Parent
    parent.children.splice(index, 1, blockquote)
    return index
  } catch (e) {
    console.warn(`Failed to process Aside in ${context.mdxAbsPath}:`, e)
    return dropNode(parent, index)
  }
}

/**
 * Handle ClickToZoom component - convert to markdown image
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleClickToZoom(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    const srcAttr = node.attributes?.find((a) => a.name === "src")
    const altAttr = node.attributes?.find((a) => a.name === "alt")

    const src = typeof srcAttr?.value === "string" ? srcAttr.value : ""
    const alt = typeof altAttr?.value === "string" ? altAttr.value : "Image"

    if (!src) return

    // Create markdown image node
    parent.children[index] = {
      type: "image",
      url: src,
      alt,
    } as Literal & { url: string; alt: string }
  } catch (e) {
    console.warn(`Failed to process ClickToZoom in ${context.mdxAbsPath}:`, e)
  }
}

/**
 * Handle CodeSample component - generate Remix link or inline code
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleCodeSample(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    const srcAttr = node.attributes?.find((a) => a.name === "src")
    const showButtonOnlyAttr = node.attributes?.find((a) => a.name === "showButtonOnly")

    const src = typeof srcAttr?.value === "string" ? srcAttr.value : ""

    // showButtonOnly is a boolean attribute - check for its presence or explicit value
    let showButtonOnly = false
    if (showButtonOnlyAttr) {
      if (
        typeof showButtonOnlyAttr.value === "object" &&
        showButtonOnlyAttr.value &&
        "value" in showButtonOnlyAttr.value
      ) {
        showButtonOnly = Boolean(showButtonOnlyAttr.value.value)
      } else if (showButtonOnlyAttr.value === undefined || showButtonOnlyAttr.value === null) {
        // Attribute present without value means true
        showButtonOnly = true
      }
    }

    if (!src) return

    if (showButtonOnly) {
      // Generate Remix link
      const fileName = path.basename(src)
      const remixUrl = `https://remix.ethereum.org/#url=https://docs.chain.link/${src}`

      parent.children[index] = {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: remixUrl,
            children: [{ type: "text", value: `Open ${fileName} in Remix` } as Literal],
          } as Parent & { url: string },
        ],
      } as Parent
    } else {
      // Try to inline the code
      const publicPath = path.join(process.cwd(), "public", src)
      const possiblePaths = [publicPath, path.resolve(src), path.join(process.cwd(), "src", src)]

      let codeContent: string | null = null
      for (const candidate of possiblePaths) {
        const safePath = resolveExistingWithin(process.cwd(), candidate)
        if (safePath) {
          codeContent = fs.readFileSync(safePath, "utf-8")
          break
        }
      }

      if (codeContent) {
        // Detect language from file extension
        const ext = path.extname(src).slice(1)
        const lang = ext || "text"

        parent.children[index] = {
          type: "code",
          lang,
          value: codeContent.trim(),
        } as Literal & { lang: string }
      } else {
        // Fallback to link if file not found
        const fileName = path.basename(src)
        parent.children[index] = {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: `Code sample: ${fileName} (file not found at build time)`,
            } as Literal,
          ],
        } as Parent
      }
    }
  } catch (e) {
    console.warn(`Failed to process CodeSample in ${context.mdxAbsPath}:`, e)
  }
}

/**
 * Handle Billing component - generate markdown table with CCIP network fees
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleBilling(parent: Parent, index: number, context: ComponentContext): number | void {
  try {
    // Calculate fees using the same logic as Billing.astro
    const lockAndUnlockAllLanes = calculateNetworkFeesForTokenMechanismDirect(TokenMechanism.LockAndUnlock, "allLanes")
    const restFromEthereumToNonEthereum = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "fromEthereumToNonEthereum"
    )
    const restFromEthereumToSolana = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "fromEthereumToSolana"
    )
    const restFromNonEthereumToEthereum = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "fromNonEthereumToEthereum"
    )
    const restFromNonEthereumToNonEthereum = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "fromNonEthereumToNonEthereum"
    )
    const restFromNonEthereumToSolana = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "fromNonEthereumToSolana"
    )
    const messagingFeesFromToEthereum = calculateMessagingNetworkFeesDirect("fromToEthereum")
    const messagingFeesFromNonEthereumToNonEthereum =
      calculateMessagingNetworkFeesDirect("fromNonEthereumToNonEthereum")
    const messagingFeesFromNonEthereumToSolana = calculateMessagingNetworkFeesDirect("fromNonEthereumToSolana")

    // Generate markdown table
    const tableRows = [
      "| Use case | Token Pool Mechanism | Source Chain | Destination Chain | LINK | Others |",
      "|----------|----------------------|--------------|-------------------|------|--------|",
      `| Token Transfers / Programmable Token Transfers | Lock and Unlock | All Chains | All Chains | ${lockAndUnlockAllLanes.linkFee} | ${lockAndUnlockAllLanes.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Ethereum | Not Ethereum | ${restFromEthereumToNonEthereum.linkFee} | ${restFromEthereumToNonEthereum.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Ethereum | Solana | ${restFromEthereumToSolana.linkFee} | ${restFromEthereumToSolana.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Not Ethereum | Solana | ${restFromNonEthereumToSolana.linkFee} | ${restFromNonEthereumToSolana.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Not Ethereum | Ethereum | ${restFromNonEthereumToEthereum.linkFee} | ${restFromNonEthereumToEthereum.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Not Ethereum | Not Ethereum | ${restFromNonEthereumToNonEthereum.linkFee} | ${restFromNonEthereumToNonEthereum.gasTokenFee} |`,
      `| Messaging | N/A | Ethereum | Not Ethereum | ${messagingFeesFromToEthereum.linkFee} | ${messagingFeesFromToEthereum.gasTokenFee} |`,
      `| Messaging | N/A | Ethereum | Solana | ${messagingFeesFromToEthereum.linkFee} | ${messagingFeesFromToEthereum.gasTokenFee} |`,
      `| Messaging | N/A | Not Ethereum | Solana | ${messagingFeesFromNonEthereumToSolana.linkFee} | ${messagingFeesFromNonEthereumToSolana.gasTokenFee} |`,
      `| Messaging | N/A | Not Ethereum | Ethereum | ${messagingFeesFromToEthereum.linkFee} | ${messagingFeesFromToEthereum.gasTokenFee} |`,
      `| Messaging | N/A | Not Ethereum | Not Ethereum | ${messagingFeesFromNonEthereumToNonEthereum.linkFee} | ${messagingFeesFromNonEthereumToNonEthereum.gasTokenFee} |`,
    ]

    const markdownTable = tableRows.join("\n")

    // Parse the table markdown and insert it
    const tableTree = context.processor.parse(markdownTable)
    if (tableTree && tableTree.children) {
      parent.children.splice(index, 1, ...tableTree.children)
      return index + tableTree.children.length
    }
  } catch (e) {
    console.warn(`Failed to process Billing in ${context.mdxAbsPath}:`, e)
    // Fallback: replace with a note about the table
    parent.children[index] = {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "(Network fee table - see https://docs.chain.link/ccip/billing for details)",
        } as Literal,
      ],
    } as Parent
  }
}

export function handlePageTabs(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const pages = staticAttribute(node, "pages")
  const showHeader = staticAttribute(node, "showHeader")
  const headerTitle = staticAttribute(node, "headerTitle")
  if (
    pages === NON_STATIC ||
    !Array.isArray(pages) ||
    showHeader === NON_STATIC ||
    (showHeader !== undefined && typeof showHeader !== "boolean") ||
    headerTitle === NON_STATIC ||
    (headerTitle !== undefined && typeof headerTitle !== "string")
  ) {
    return dropNode(parent, index)
  }

  const links: { label: string; url: string }[] = []
  for (const pageOrGroup of pages) {
    const group = Array.isArray(pageOrGroup) ? pageOrGroup : [pageOrGroup]
    if (group.length === 0) {
      return dropNode(parent, index)
    }
    const groupPages: { name: string; url: string }[] = []
    for (const page of group) {
      if (
        !page ||
        Array.isArray(page) ||
        typeof page !== "object" ||
        typeof page.name !== "string" ||
        typeof page.url !== "string"
      ) {
        return dropNode(parent, index)
      }
      groupPages.push({ name: page.name, url: page.url })
    }
    links.push({ label: groupPages.map((page) => page.name).join(" / "), url: groupPages[0].url })
  }

  const replacement: Node[] = []
  if (showHeader !== false)
    replacement.push(headingNode(2, typeof headerTitle === "string" ? headerTitle : "Guide Versions"))
  if (links.length > 0) {
    replacement.push({
      type: "list",
      ordered: false,
      children: links.map(
        ({ label, url }) =>
          ({
            type: "listItem",
            children: [paragraphNode([linkNode(label, url)])],
          }) as Parent
      ),
    } as Parent)
  }
  parent.children.splice(index, 1, ...replacement)
  return index + replacement.length
}

type SlottedElement = { node: MdxJsxNode; parent: Parent; slot: string }

function slottedElements(node: Parent): SlottedElement[] {
  const elements: SlottedElement[] = []
  const collect = (parent: Parent) => {
    for (const child of parent.children || []) {
      if (child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") {
        const slot = staticAttribute(child as MdxJsxNode, "slot")
        if (typeof slot === "string") elements.push({ node: child as MdxJsxNode, parent, slot })
        continue
      }
      if ((child as Parent).children) collect(child as Parent)
    }
  }
  collect(node)
  return elements
}

export function handleTabs(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const tabs: { key: string; label: string }[] = []
  const panels = new Map<string, Node[]>()

  for (const { node: child, slot } of slottedElements(node as Parent)) {
    if (slot.startsWith("tab.")) {
      const label = staticChildrenText(child as Parent)
      if (label !== NON_STATIC && label) tabs.push({ key: slot.slice(4), label })
    } else if (slot.startsWith("panel.")) {
      panels.set(slot.slice(6), (child as Parent).children || [])
    }
  }

  const replacement: Node[] = []
  for (const tab of tabs) {
    const panel = panels.get(tab.key)
    if (!panel) continue
    replacement.push(headingNode(3, tab.label), ...panel)
  }
  if (replacement.length === 0) {
    return dropNode(parent, index)
  }
  parent.children.splice(index, 1, ...replacement)
  return index
}

export function handlePackageManagerTabs(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const slots = slottedElements(node as Parent)
  const replacement: Node[] = []
  for (const manager of ["npm", "yarn"]) {
    const content = slots.find(({ slot }) => slot === manager)?.node as Parent | undefined
    if (content) replacement.push(headingNode(3, manager), ...(content.children || []))
  }
  if (replacement.length === 0) {
    return dropNode(parent, index)
  }
  parent.children.splice(index, 1, ...replacement)
  return index
}

export function handleFragment(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const children = (node as Parent).children || []
  parent.children.splice(index, 1, ...children)
  return index
}

export function handleAccordion(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const title = staticAttribute(node, "title")
  const number = staticAttribute(node, "number")
  const titleSlot = slottedElements(node as Parent).find(({ slot }) => slot === "title")
  const slotTitle = titleSlot ? staticChildrenText(titleSlot.node as Parent) : undefined
  if (
    title === NON_STATIC ||
    typeof title !== "string" ||
    number === NON_STATIC ||
    (number !== undefined && typeof number !== "number") ||
    slotTitle === NON_STATIC ||
    (titleSlot && !slotTitle)
  ) {
    return dropNode(parent, index)
  }
  if (titleSlot) {
    titleSlot.parent.children.splice(titleSlot.parent.children.indexOf(titleSlot.node), 1)
  }
  const label = `${typeof number === "number" ? `${number}. ` : ""}${slotTitle || title}`
  const replacement: Node[] = [headingNode(3, label), ...((node as Parent).children || [])]
  parent.children.splice(index, 1, ...replacement)
  return index
}

export function handleAddress(node: MdxJsxNode, parent: Parent, index: number): number | void {
  const contractUrl = staticAttribute(node, "contractUrl")
  const address = staticAttribute(node, "address")
  const endLength = staticAttribute(node, "endLength")
  if (
    contractUrl === NON_STATIC ||
    typeof contractUrl !== "string" ||
    address === NON_STATIC ||
    (address !== undefined && typeof address !== "string") ||
    endLength === NON_STATIC ||
    (endLength !== undefined && (typeof endLength !== "number" || !Number.isInteger(endLength) || endLength < 0))
  ) {
    return dropNode(parent, index)
  }

  const value = typeof address === "string" && address ? address : contractUrl.split("/").pop() || contractUrl
  const display =
    typeof endLength === "number" && endLength > 0
      ? `${value.slice(0, endLength + 2)}...${value.slice(-endLength)}`
      : value
  parent.children[index] = linkNode(display, contractUrl)
}

export function handleCallout(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  return handleAside(node, parent, index, context)
}

const SELECTOR_COMPONENTS = {
  AnyApiCallout: { astro: "src/features/any-api/common/AnyApiCallout.astro", attribute: "callout" },
  FeedsCommonCallout: { astro: "src/features/feeds/callouts/FeedsCommonCallout.astro", attribute: "callout" },
  ResourcesCallout: { astro: "src/features/resources/callouts/ResourcesCallout.astro", attribute: "callout" },
  DataStreams: { astro: "src/features/data-streams/common/DataStreams.astro", attribute: "section" },
} as const

function handleAstroSelector(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext,
  componentName: keyof typeof SELECTOR_COMPONENTS
): number | void {
  const config = SELECTOR_COMPONENTS[componentName]
  const selector = staticAttribute(node, config.attribute)
  if (typeof selector !== "string") {
    return dropNode(parent, index)
  }

  try {
    const astroPath = resolveExistingWithin(process.cwd(), config.astro)
    if (!astroPath) {
      return dropNode(parent, index)
    }
    const astroDirectory = path.dirname(astroPath)
    const source = fs.readFileSync(astroPath, "utf-8")
    const imports = new Map<string, string>()
    for (const match of source.matchAll(/import\s+(\w+)\s+from\s+["'](.+?\.mdx)["']/g)) {
      imports.set(match[1], match[2])
    }
    const conditions = new Map<string, string>()
    const conditionRegex = new RegExp(`${config.attribute}\\s*===\\s*["']([^"']+)["']\\s*&&\\s*<(\\w+)`, "g")
    for (const match of source.matchAll(conditionRegex)) conditions.set(match[1], match[2])

    const importPath = imports.get(conditions.get(selector) || "")
    const markdownPath = importPath && resolveExistingWithin(astroDirectory, importPath)
    if (!markdownPath || path.extname(markdownPath) !== ".mdx") {
      return dropNode(parent, index)
    }
    const markdown = fs.readFileSync(markdownPath, "utf-8").replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "")
    const tree = context.processor.parse(markdown) as Parent
    parent.children.splice(index, 1, ...(tree.children || []))
    return index
  } catch (e) {
    console.warn(`Failed to process ${componentName} in ${context.mdxAbsPath}:`, e)
    return dropNode(parent, index)
  }
}

export function handleAnyApiCallout(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  return handleAstroSelector(node, parent, index, context, "AnyApiCallout")
}

export function handleFeedsCommonCallout(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  return handleAstroSelector(node, parent, index, context, "FeedsCommonCallout")
}

export function handleResourcesCallout(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  return handleAstroSelector(node, parent, index, context, "ResourcesCallout")
}

export function handleDataStreams(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  return handleAstroSelector(node, parent, index, context, "DataStreams")
}

function escapeTableCell(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|").replace(/\r?\n/g, " ")
}

export function handleSchemaFieldsTable(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  const schema = staticAttribute(node, "schema")
  const definition = typeof schema === "string" ? REPORT_SCHEMA_DEFINITIONS[schema] : undefined
  if (!definition) {
    return dropNode(parent, index)
  }
  const rows = [
    "| Field | Type | Description |",
    "| --- | --- | --- |",
    ...definition.fields.map((field) => {
      const description = `${field.description}${field.link ? ` — [${field.link.label}](${field.link.href})` : ""}`
      return `| \`${escapeTableCell(field.field)}\` | \`${escapeTableCell(field.type)}\` | ${escapeTableCell(description)} |`
    }),
  ]
  const tree = context.processor.parse(rows.join("\n")) as Parent
  parent.children.splice(index, 1, ...(tree.children || []))
  return index + (tree.children?.length || 0)
}
