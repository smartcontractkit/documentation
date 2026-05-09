/**
 * Content extraction utility for converting documentation pages to Markdown
 */

import type { ExtractedContent, ExtractionConfig } from "./types.js"
import {
  formatHeading,
  formatLink,
  formatBold,
  formatItalic,
  formatInlineCode,
  formatCodeBlock,
  formatBlockquote,
  formatTable,
  formatImage,
  formatHorizontalRule,
  formatFrontmatter,
  cleanText,
  resolveUrl,
  stripHighlightComments,
} from "~/lib/markdown/index.js"

/**
 * Default configuration for content extraction
 */
const DEFAULT_CONFIG: ExtractionConfig = {
  selectorsToRemove: [
    // Navigation and UI elements
    "nav",
    ".breadcrumb",
    ".pagination",

    // Interactive elements
    "button",
    ".copy-iconbutton",
    ".copy-code-button",

    // Sidebar and TOC
    ".sidebar",
    ".table-of-contents",
    ".right-sidebar",
    ".left-sidebar",

    // Footer and metadata
    "footer",
    ".theme-edit-this-page",
    ".theme-last-updated",
    ".edit-page",

    // Feedback and social
    ".feedback",
    ".social-links",
    ".share-buttons",

    // Ads and external content
    ".advertisement",
    "iframe",

    // Chainlink-specific elements
    ".header-link",
    ".anchor-link",

    // Astro-specific elements (hydration scripts, etc.)
    "script",
    "style",
    "astro-island",
  ],
  contentSelector: "article, main, .content, [role='main']",
  includeFrontmatter: true,
}

/**
 * Extracts the main content from the current page
 * @param config - Extraction configuration
 * @returns The extracted content or null if extraction fails
 */
export function extractPageContent(config: Partial<ExtractionConfig> = {}): ExtractedContent | null {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }

  try {
    // Find the main content element
    const mainContent = document.querySelector(fullConfig.contentSelector)
    if (!mainContent) {
      console.error("Could not find main content element")
      return null
    }

    // Clone the content to avoid modifying the page
    const contentClone = mainContent.cloneNode(true) as HTMLElement

    // Remove unwanted elements
    fullConfig.selectorsToRemove.forEach((selector) => {
      const elements = contentClone.querySelectorAll(selector)
      elements.forEach((el) => el.remove())
    })

    // Get page title
    const title = getPageTitle()

    // Convert to markdown
    const markdown = convertToMarkdown(contentClone)

    // Add frontmatter if enabled
    const finalMarkdown = fullConfig.includeFrontmatter
      ? addFrontmatter({ markdown, title, url: window.location.href })
      : markdown

    return {
      markdown: finalMarkdown,
      title,
      url: window.location.href,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error("Error extracting page content:", error)
    return null
  }
}

/**
 * Gets the page title from various possible sources
 * @returns The page title
 */
function getPageTitle(): string {
  // Try document title first
  if (document.title && document.title !== "Documentation") {
    return document.title.replace(" | Chainlink Documentation", "").trim()
  }

  // Try h1 heading
  const h1 = document.querySelector("article h1, main h1, h1")
  if (h1?.textContent) {
    return h1.textContent.trim()
  }

  // Try meta og:title
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogTitleContent = ogTitle?.getAttribute("content")
  if (ogTitleContent) {
    return ogTitleContent.trim()
  }

  return "Documentation Page"
}

/**
 * Converts HTML element to Markdown
 * @param element - The HTML element to convert
 * @returns The markdown string
 */
function convertToMarkdown(element: HTMLElement): string {
  let markdown = ""

  // Process child nodes
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        markdown += cleanText(text) + "\n"
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      markdown += convertElementToMarkdown(el)
    }
  })

  return markdown.trim()
}

/**
 * Converts a single HTML element to Markdown based on its tag
 * @param el - The HTML element
 * @returns The markdown representation
 */
function convertElementToMarkdown(el: HTMLElement): string {
  // Check for CodeHighlightBlockMulti FIRST before processing by tag
  if (el.classList.contains("code-block-container")) {
    return convertCodeBlockMultiToMarkdown(el)
  }

  const tag = el.tagName.toLowerCase()

  switch (tag) {
    case "h1":
      return formatHeading(1, cleanText(el.textContent || ""))
    case "h2":
      return formatHeading(2, cleanText(el.textContent || ""))
    case "h3":
      return formatHeading(3, cleanText(el.textContent || ""))
    case "h4":
      return formatHeading(4, cleanText(el.textContent || ""))
    case "h5":
      return formatHeading(5, cleanText(el.textContent || ""))
    case "h6":
      return formatHeading(6, cleanText(el.textContent || ""))

    case "p":
      return `${convertToMarkdown(el)}\n\n`

    case "a": {
      const href = el.getAttribute("href") || ""
      const text = cleanText(el.textContent || "")
      const fullUrl = resolveUrl(href)
      return formatLink(text, fullUrl)
    }

    case "strong":
    case "b":
      return formatBold(cleanText(el.textContent || ""))

    case "em":
    case "i":
      return formatItalic(cleanText(el.textContent || ""))

    case "code":
      // Inline code
      if (el.parentElement?.tagName !== "PRE") {
        return formatInlineCode(el.textContent || "")
      }
      // Block code - handled by pre tag
      return el.textContent || ""

    case "pre": {
      const code = el.querySelector("code")
      const language = code?.className?.match(/language-(\w+)/)?.[1] || ""
      const codeText = code?.textContent || el.textContent || ""
      return formatCodeBlock(codeText, language)
    }

    case "ul":
    case "ol": {
      const items = Array.from(el.children)
        .filter((child) => child.tagName.toLowerCase() === "li")
        .map((li, index) => {
          const bullet = tag === "ul" ? "-" : `${index + 1}.`
          const content = convertToMarkdown(li as HTMLElement).trim()
          return `${bullet} ${content}`
        })
        .join("\n")
      return `${items}\n\n`
    }

    case "li":
      return convertToMarkdown(el)

    case "blockquote":
      return formatBlockquote(convertToMarkdown(el))

    case "table":
      return convertTableToMarkdown(el)

    case "img": {
      const src = el.getAttribute("src") || ""
      const alt = el.getAttribute("alt") || ""
      const fullSrc = resolveUrl(src)
      return formatImage(alt, fullSrc)
    }

    case "hr":
      return formatHorizontalRule()

    case "br":
      return "\n"

    case "div":
    case "section":
    case "aside": {
      // Check for special Chainlink components (callouts, admonitions, etc.)
      if (el.classList.contains("callout") || el.classList.contains("admonition")) {
        return convertCalloutToMarkdown(el)
      }
      return convertToMarkdown(el)
    }

    default:
      // For unknown tags, process children
      return convertToMarkdown(el)
  }
}

/**
 * Converts a table element to Markdown
 * @param table - The table element
 * @returns The markdown table
 */
function convertTableToMarkdown(table: HTMLElement): string {
  const rows: string[][] = []

  // Get all rows
  const tableRows = table.querySelectorAll("tr")
  tableRows.forEach((row) => {
    const cells: string[] = []
    row.querySelectorAll("td, th").forEach((cell) => {
      cells.push(cleanText(cell.textContent || ""))
    })
    if (cells.length > 0) {
      rows.push(cells)
    }
  })

  if (rows.length === 0) return ""

  return formatTable(rows)
}

/**
 * Converts CodeHighlightBlockMulti component to Markdown
 * @param container - The code block container element (cloned)
 * @returns The markdown code block
 */
function convertCodeBlockMultiToMarkdown(container: HTMLElement): string {
  // Get the current language from the container
  const currentLang = container.getAttribute("data-lang") || ""
  const blockId = container.getAttribute("id") || ""

  // The container is a CLONE, so it doesn't have the JavaScript properties.
  // We need to find the ORIGINAL element in the page to get _languagesData
  interface LanguageData {
    code: string
    title?: string
  }

  let languagesData: Record<string, LanguageData> | undefined

  if (blockId) {
    const originalContainer = document.getElementById(blockId) as HTMLElement & {
      _languagesData?: Record<string, LanguageData>
    }
    if (originalContainer) {
      languagesData = originalContainer._languagesData
    }
  }

  // If we found the original data, use it
  if (languagesData && languagesData[currentLang]) {
    const codeContent = languagesData[currentLang].code || ""
    // Strip highlight comments using the shared formatter
    const cleanCode = stripHighlightComments(codeContent)
    return formatCodeBlock(cleanCode, currentLang)
  }

  // Fallback: Extract code from the visible DOM table in the clone
  const codeLines: string[] = []
  const lineElements = container.querySelectorAll(".line")
  lineElements.forEach((lineElement) => {
    const lineText = lineElement.textContent || ""
    codeLines.push(lineText)
  })

  const codeContent = codeLines.join("\n")
  return formatCodeBlock(codeContent, currentLang)
}

/**
 * Converts callout/admonition elements to Markdown
 * @param el - The callout element
 * @returns The markdown representation
 */
function convertCalloutToMarkdown(el: HTMLElement): string {
  const type = el.getAttribute("data-type") || "note"
  const content = convertToMarkdown(el).trim()
  return `> **${type.toUpperCase()}**\n> ${content.replace(/\n/g, "\n> ")}\n\n`
}

/**
 * Adds frontmatter to the markdown content
 * @param content - The content object
 * @returns The markdown with frontmatter
 */
function addFrontmatter(content: { markdown: string; title: string; url: string }): string {
  const frontmatter = formatFrontmatter({
    title: content.title,
    url: content.url,
    extracted: new Date().toISOString(),
  })

  return frontmatter + content.markdown
}

/**
 * Copies text to clipboard using the modern Clipboard API
 * @param text - The text to copy
 * @returns Promise that resolves when copy is complete
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error)
    throw new Error("Failed to copy to clipboard")
  }
}
