/**
 * Content extraction utility for converting documentation pages to Markdown
 */

import type { ExtractedContent, ExtractionConfig } from "./types.js"

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
  const tag = el.tagName.toLowerCase()

  switch (tag) {
    case "h1":
      return `# ${cleanText(el.textContent || "")}\n\n`
    case "h2":
      return `## ${cleanText(el.textContent || "")}\n\n`
    case "h3":
      return `### ${cleanText(el.textContent || "")}\n\n`
    case "h4":
      return `#### ${cleanText(el.textContent || "")}\n\n`
    case "h5":
      return `##### ${cleanText(el.textContent || "")}\n\n`
    case "h6":
      return `###### ${cleanText(el.textContent || "")}\n\n`

    case "p":
      return `${convertToMarkdown(el)}\n\n`

    case "a": {
      const href = el.getAttribute("href") || ""
      const text = cleanText(el.textContent || "")
      const fullUrl = href.startsWith("http") ? href : new URL(href, window.location.origin).href
      return `[${text}](${fullUrl})`
    }

    case "strong":
    case "b":
      return `**${cleanText(el.textContent || "")}**`

    case "em":
    case "i":
      return `*${cleanText(el.textContent || "")}*`

    case "code":
      // Inline code
      if (el.parentElement?.tagName !== "PRE") {
        return `\`${el.textContent || ""}\``
      }
      // Block code - handled by pre tag
      return el.textContent || ""

    case "pre": {
      const code = el.querySelector("code")
      const language = code?.className?.match(/language-(\w+)/)?.[1] || ""
      const codeText = code?.textContent || el.textContent || ""
      return `\`\`\`${language}\n${codeText}\n\`\`\`\n\n`
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
      return `> ${convertToMarkdown(el)}\n\n`

    case "table":
      return convertTableToMarkdown(el)

    case "img": {
      const src = el.getAttribute("src") || ""
      const alt = el.getAttribute("alt") || ""
      const fullSrc = src.startsWith("http") ? src : new URL(src, window.location.origin).href
      return `![${alt}](${fullSrc})`
    }

    case "hr":
      return "---\n\n"

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

  let markdown = ""

  // Header row
  const headerRow = rows[0]
  markdown += `| ${headerRow.join(" | ")} |\n`

  // Separator row
  markdown += `| ${headerRow.map(() => "---").join(" | ")} |\n`

  // Data rows
  rows.slice(1).forEach((row) => {
    markdown += `| ${row.join(" | ")} |\n`
  })

  return `${markdown}\n`
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
 * Cleans and normalizes text content
 * @param text - The text to clean
 * @returns The cleaned text
 */
function cleanText(text: string): string {
  return (
    text
      // Fix common encoding issues
      .replace(/â/g, "'")
      .replace(/â/g, '"')
      .replace(/â/g, '"')
      .replace(/â¦/g, "...")
      .replace(/â/g, "—")
      .replace(/â/g, "–")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .replace(/\n\s+\n/g, "\n\n")
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
  )
}

/**
 * Adds frontmatter to the markdown content
 * @param content - The content object
 * @returns The markdown with frontmatter
 */
function addFrontmatter(content: { markdown: string; title: string; url: string }): string {
  const frontmatter = [
    "---",
    `title: "${content.title}"`,
    `url: ${content.url}`,
    `extracted: ${new Date().toISOString()}`,
    "---",
    "",
    "",
  ].join("\n")

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
