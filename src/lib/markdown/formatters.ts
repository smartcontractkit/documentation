/**
 * Shared markdown formatting utilities
 * Used by both build-time (generate-llms.ts) and runtime (CopyPageLink) markdown generation
 */

/**
 * Format a heading at the specified level
 */
export function formatHeading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): string {
  const hashes = "#".repeat(level)
  return `${hashes} ${text}\n\n`
}

/**
 * Format a link
 */
export function formatLink(text: string, url: string): string {
  return `[${text}](${url})`
}

/**
 * Format bold text
 */
export function formatBold(text: string): string {
  return `**${text}**`
}

/**
 * Format italic text
 */
export function formatItalic(text: string): string {
  return `*${text}*`
}

/**
 * Format inline code
 */
export function formatInlineCode(text: string): string {
  return `\`${text}\``
}

/**
 * Format a code block with optional language
 */
export function formatCodeBlock(code: string, language = ""): string {
  return `\`\`\`${language}\n${code}\n\`\`\`\n\n`
}

/**
 * Format a blockquote
 */
export function formatBlockquote(text: string): string {
  const lines = text.split("\n").filter((line) => line.trim())
  return lines.map((line) => `> ${line}`).join("\n") + "\n\n"
}

/**
 * Format a horizontal rule
 */
export function formatHorizontalRule(): string {
  return "---\n\n"
}

/**
 * Format an unordered list
 */
export function formatUnorderedList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n") + "\n\n"
}

/**
 * Format an ordered list
 */
export function formatOrderedList(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n") + "\n\n"
}

/**
 * Format a markdown table
 * @param rows - Array of rows, where each row is an array of cell values
 * @param hasHeader - Whether the first row should be treated as a header (default: true)
 */
export function formatTable(rows: string[][], hasHeader = true): string {
  if (rows.length === 0) return ""

  let markdown = ""
  const firstRow = rows[0]

  // Header row
  markdown += `| ${firstRow.join(" | ")} |\n`

  // Separator row
  if (hasHeader) {
    markdown += `| ${firstRow.map(() => "---").join(" | ")} |\n`
  }

  // Data rows (skip first if it's a header)
  const dataRows = hasHeader ? rows.slice(1) : rows
  dataRows.forEach((row) => {
    // Pad rows to match header length
    const paddedRow = [...row]
    while (paddedRow.length < firstRow.length) {
      paddedRow.push("")
    }
    markdown += `| ${paddedRow.join(" | ")} |\n`
  })

  return `${markdown}\n`
}

/**
 * Format an image
 */
export function formatImage(alt: string, src: string, title?: string): string {
  const titlePart = title ? ` "${title}"` : ""
  return `![${alt}](${src}${titlePart})`
}

/**
 * Format YAML frontmatter
 */
export function formatFrontmatter(data: Record<string, string | number | boolean>): string {
  const lines = ["---"]

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" && (value.includes(":") || value.includes("#"))) {
      // Quote strings that contain special YAML characters
      lines.push(`${key}: "${value}"`)
    } else if (typeof value === "string") {
      lines.push(`${key}: ${value}`)
    } else {
      lines.push(`${key}: ${value}`)
    }
  }

  lines.push("---", "", "")
  return lines.join("\n")
}

/**
 * Clean and normalize text content
 * Fixes common encoding issues and normalizes whitespace
 */
export function cleanText(text: string): string {
  return (
    text
      // Fix common encoding issues
      .replace(/â€™/g, "'")
      .replace(/â€œ/g, '"')
      .replace(/â€/g, '"')
      .replace(/â€¦/g, "...")
      .replace(/â€"/g, "—")
      .replace(/â€"/g, "–")
      // Also handle actual smart quotes (using Unicode escapes for clarity)
      .replace(/[\u2018\u2019]/g, "'") // ' and '
      .replace(/[\u201C\u201D]/g, '"') // " and "
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .replace(/\n\s+\n/g, "\n\n")
      // Remove zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
  )
}

/**
 * Normalize markdown for comparison/consistency
 * Useful for testing that different markdown generators produce similar output
 */
export function normalizeMarkdown(markdown: string): string {
  return (
    markdown
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      // Normalize multiple blank lines to single blank line
      .replace(/\n{3,}/g, "\n\n")
      // Normalize whitespace at end of lines
      .replace(/[ \t]+$/gm, "")
      // Normalize list markers
      .replace(/^[*+-]\s+/gm, "- ")
      .trim()
  )
}

/**
 * Unescape markdown characters for plain text
 * Useful when generating markdown that will be read as plain text
 */
export function unescapeMarkdown(text: string): string {
  let inFence = false
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      return line
        .replace(/\\_/g, "_")
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
    })
    .filter((line) => line.trim() !== "{/* prettier-ignore */}")
    .join("\n")
}

/**
 * Strip highlighter comments from code
 * Removes // highlight-line, // highlight-start, // highlight-end
 */
export function stripHighlightComments(code: string): string {
  return code
    .split("\n")
    .map((line) => line.replace(/\/\/\s*highlight-(line|start|end)/, ""))
    .join("\n")
}

/**
 * Resolve relative URL to absolute URL
 */
export function resolveUrl(url: string, baseUrl = typeof window !== "undefined" ? window.location.origin : ""): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  if (url.startsWith("/")) {
    return `${baseUrl}${url}`
  }

  // For relative URLs, try to resolve them
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}
