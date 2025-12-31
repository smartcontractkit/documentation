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
  TokenMechanism,
} from "../../config/data/ccip/index.js"

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
        const calloutPath = path.resolve("src/features/ccip", fileName)

        if (fs.existsSync(calloutPath)) {
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
            return index + calloutTree.children.length
          }
        }
      }
    }
  } catch (e) {
    console.warn(`Failed to process CcipCommon in ${context.mdxAbsPath}:`, e)
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
        const codeAbsPath = path.resolve(path.dirname(context.mdxAbsPath), importPath)
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
  } catch (e) {
    console.warn(`Failed to process CodeHighlightBlock in ${context.mdxAbsPath}:`, e)
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
    const languagesAttr = node.attributes?.find((a) => a.name === "languages")

    if (languagesAttr && context.targetLanguage) {
      // Extract the code variable name for the target language
      // The structure is: languages={{ go: { code: goVar }, ts: { code: tsVar } }}
      const attrValue = languagesAttr.value
      const estreeBody =
        typeof attrValue === "object" && attrValue && "data" in attrValue
          ? attrValue.data?.estree?.body?.[0]
          : undefined
      const languagesObj =
        estreeBody && typeof estreeBody === "object" && "expression" in estreeBody
          ? (estreeBody.expression as { properties?: unknown })?.properties
          : undefined

      if (languagesObj) {
        for (const langProp of languagesObj as Record<string, unknown>[]) {
          const langKey =
            (langProp.key as { name?: string; value?: string })?.name ||
            (langProp.key as { name?: string; value?: string })?.value

          if (langKey === context.targetLanguage) {
            const codeProperty = (langProp.value as { properties?: Record<string, unknown>[] })?.properties?.find(
              (p) => (p.key as { name?: string })?.name === "code"
            )
            const codeVarName = (codeProperty?.value as { name?: string })?.name

            if (codeVarName) {
              // Find the import statement for this variable
              const importRegex = new RegExp(`import\\s+${codeVarName}\\s+from\\s+['"](.+?)['"]`)
              const match = context.markdown.match(importRegex)

              if (match) {
                const importPath = match[1].split("?")[0] // Strip "?raw"
                const codeAbsPath = path.resolve(path.dirname(context.mdxAbsPath), importPath)
                let codeContent = fs.readFileSync(codeAbsPath, "utf-8")

                // Strip highlighter comments
                codeContent = codeContent
                  .split("\n")
                  .map((line) => line.replace(/\s*\/\/\s*highlight-(line|start|end)/, ""))
                  .join("\n")

                // Infer language from file extension
                const fileExt = path.extname(codeAbsPath).slice(1)
                const lang = fileExt || context.targetLanguage

                // Create a code block for this language
                const newNodes: Node[] = []
                newNodes.push({
                  type: "code",
                  lang,
                  value: codeContent.trim(),
                } as Literal)

                parent.children.splice(index, 1, ...newNodes)
                return index + newNodes.length
              }
            }
            break
          }
        }
      }
    }
  } catch (e) {
    console.warn(`Failed to process CodeHighlightBlockMulti in ${context.mdxAbsPath}:`, e)
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
    const typeAttr = node.attributes?.find((a) => a.name === "type")
    const titleAttr = node.attributes?.find((a) => a.name === "title")

    const type = typeof typeAttr?.value === "string" ? typeAttr.value.toUpperCase() : "NOTE"
    const title = typeof titleAttr?.value === "string" ? titleAttr.value : ""

    // Get children content
    const children = (node as Parent).children || []

    if (children.length === 0) {
      return
    }

    // Create blockquote header
    const header = title ? `**${type}: ${title}**` : `**${type}**`

    // Create new nodes for blockquote
    const newNodes: Node[] = []

    // Add blockquote paragraph with header
    newNodes.push({
      type: "blockquote",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", value: header } as Literal],
        } as Parent,
        {
          type: "paragraph",
          children: [{ type: "text", value: "" } as Literal],
        } as Parent,
        ...children,
      ],
    } as Parent)

    parent.children.splice(index, 1, ...newNodes)
    return index + newNodes.length
  } catch (e) {
    console.warn(`Failed to process Aside in ${context.mdxAbsPath}:`, e)
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
      const possiblePaths = [path.resolve(`public/${src}`), path.resolve(src), path.resolve(`src/${src}`)]

      let codeContent: string | null = null
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          codeContent = fs.readFileSync(p, "utf-8")
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
 * @param node - AST node
 * @param parent - Parent node
 * @param index - Index in parent's children
 * @param context - Component context
 * @returns New index or void
 */
export function handleBilling(
  node: MdxJsxNode,
  parent: Parent,
  index: number,
  context: ComponentContext
): number | void {
  try {
    // Calculate fees using the same logic as Billing.astro
    const lockAndUnlockAllLanes = calculateNetworkFeesForTokenMechanismDirect(TokenMechanism.LockAndUnlock, "allLanes")
    const restFromEthereum = calculateNetworkFeesForTokenMechanismDirect(TokenMechanism.BurnAndMint, "fromEthereum")
    const restToEthereum = calculateNetworkFeesForTokenMechanismDirect(TokenMechanism.BurnAndMint, "toEthereum")
    const restMechanismNonEthereum = calculateNetworkFeesForTokenMechanismDirect(
      TokenMechanism.BurnAndMint,
      "nonEthereum"
    )
    const messagingFeesFromToEthereum = calculateMessagingNetworkFeesDirect("fromToEthereum")
    const messagingFeesNonEthereum = calculateMessagingNetworkFeesDirect("nonEthereum")

    // Generate markdown table
    const tableRows = [
      "| Use case | Token Pool Mechanism | Lanes | LINK | Others |",
      "|----------|----------------------|-------|------|--------|",
      `| Token Transfers / Programmable Token Transfers | Lock and Unlock | All Lanes | ${lockAndUnlockAllLanes.linkFee} | ${lockAndUnlockAllLanes.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | Non-Ethereum | ${restMechanismNonEthereum.linkFee} | ${restMechanismNonEthereum.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | From: Ethereum | ${restFromEthereum.linkFee} | ${restFromEthereum.gasTokenFee} |`,
      `| Token Transfers / Programmable Token Transfers | Lock and Mint / Burn and Mint / Burn and Unlock | To: Ethereum | ${restToEthereum.linkFee} | ${restToEthereum.gasTokenFee} |`,
      `| Messaging | N/A | Non-Ethereum | ${messagingFeesNonEthereum.linkFee} | ${messagingFeesNonEthereum.gasTokenFee} |`,
      `| Messaging | N/A | From/To: Ethereum | ${messagingFeesFromToEthereum.linkFee} | ${messagingFeesFromToEthereum.gasTokenFee} |`,
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
