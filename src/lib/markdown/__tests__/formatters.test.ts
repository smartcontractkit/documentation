/**
 * Tests for shared markdown formatting utilities
 * These are pure functions used by both build-time (generate-llms.ts)
 * and runtime (CopyPageLink) markdown generation
 */

import { describe, it, expect } from "@jest/globals"
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
  formatUnorderedList,
  formatOrderedList,
  formatFrontmatter,
  cleanText,
  normalizeMarkdown,
  unescapeMarkdown,
  stripHighlightComments,
  resolveUrl,
} from "../formatters.js"

describe("Heading Formatters", () => {
  it("should format h1 correctly", () => {
    expect(formatHeading(1, "Title")).toBe("# Title\n\n")
  })

  it("should format h2 correctly", () => {
    expect(formatHeading(2, "Subtitle")).toBe("## Subtitle\n\n")
  })

  it("should format h3-h6 correctly", () => {
    expect(formatHeading(3, "Section")).toBe("### Section\n\n")
    expect(formatHeading(4, "Subsection")).toBe("#### Subsection\n\n")
    expect(formatHeading(5, "Minor")).toBe("##### Minor\n\n")
    expect(formatHeading(6, "Smallest")).toBe("###### Smallest\n\n")
  })

  it("should handle empty headings", () => {
    expect(formatHeading(1, "")).toBe("# \n\n")
  })
})

describe("Inline Formatters", () => {
  it("should format links", () => {
    expect(formatLink("Click here", "https://example.com")).toBe("[Click here](https://example.com)")
  })

  it("should format bold text", () => {
    expect(formatBold("important")).toBe("**important**")
  })

  it("should format italic text", () => {
    expect(formatItalic("emphasis")).toBe("*emphasis*")
  })

  it("should format inline code", () => {
    expect(formatInlineCode("const x = 1")).toBe("`const x = 1`")
  })
})

describe("Code Block Formatter", () => {
  it("should format code block with language", () => {
    const code = "function test() {\n  return true\n}"
    const result = formatCodeBlock(code, "javascript")
    expect(result).toBe("```javascript\nfunction test() {\n  return true\n}\n```\n\n")
  })

  it("should format code block without language", () => {
    const code = "plain text"
    const result = formatCodeBlock(code)
    expect(result).toBe("```\nplain text\n```\n\n")
  })

  it("should handle empty code blocks", () => {
    expect(formatCodeBlock("")).toBe("```\n\n```\n\n")
  })
})

describe("Table Formatter", () => {
  it("should format table with header", () => {
    const rows = [
      ["Name", "Age"],
      ["Alice", "30"],
      ["Bob", "25"],
    ]
    const result = formatTable(rows)

    expect(result).toContain("| Name | Age |")
    expect(result).toContain("| --- | --- |")
    expect(result).toContain("| Alice | 30 |")
    expect(result).toContain("| Bob | 25 |")
    expect(result.endsWith("\n")).toBe(true)
  })

  it("should format table without header", () => {
    const rows = [
      ["A", "B"],
      ["C", "D"],
    ]
    const result = formatTable(rows, false)

    expect(result).toContain("| A | B |")
    expect(result).toContain("| C | D |")
    expect(result).not.toContain("| --- | --- |")
  })

  it("should handle single row table", () => {
    const rows = [["Single", "Row"]]
    const result = formatTable(rows)

    expect(result).toContain("| Single | Row |")
    expect(result).toContain("| --- | --- |")
  })

  it("should handle empty table", () => {
    expect(formatTable([])).toBe("")
  })
})

describe("List Formatters", () => {
  it("should format unordered list", () => {
    const items = ["First item", "Second item", "Third item"]
    const result = formatUnorderedList(items)

    expect(result).toBe("- First item\n- Second item\n- Third item\n\n")
  })

  it("should format ordered list", () => {
    const items = ["First", "Second", "Third"]
    const result = formatOrderedList(items)

    expect(result).toBe("1. First\n2. Second\n3. Third\n\n")
  })

  it("should handle empty lists", () => {
    expect(formatUnorderedList([])).toBe("\n\n")
    expect(formatOrderedList([])).toBe("\n\n")
  })
})

describe("Other Formatters", () => {
  it("should format blockquote", () => {
    const result = formatBlockquote("Important note\nSecond line")
    expect(result).toBe("> Important note\n> Second line\n\n")
  })

  it("should format horizontal rule", () => {
    expect(formatHorizontalRule()).toBe("---\n\n")
  })

  it("should format image", () => {
    expect(formatImage("Alt text", "/path/to/image.png")).toBe("![Alt text](/path/to/image.png)")
  })

  it("should format image with title", () => {
    expect(formatImage("Alt", "/img.png", "Title")).toBe('![Alt](/img.png "Title")')
  })
})

describe("Frontmatter Formatter", () => {
  it("should format frontmatter with simple values", () => {
    const data = {
      title: "Test Page",
      url: "https://example.com",
      extracted: "2024-01-01T00:00:00.000Z",
    }
    const result = formatFrontmatter(data)

    expect(result).toContain("---")
    expect(result).toContain("title: Test Page")
    // URLs with colons get quoted (correct YAML behavior)
    expect(result).toContain('url: "https://example.com"')
    expect(result).toContain('extracted: "2024-01-01T00:00:00.000Z"')
    expect(result.endsWith("\n\n")).toBe(true)
  })

  it("should quote strings with special YAML characters", () => {
    const data = {
      title: "Title: With Colon",
      description: "Has # hash",
    }
    const result = formatFrontmatter(data)

    expect(result).toContain('title: "Title: With Colon"')
    expect(result).toContain('description: "Has # hash"')
  })

  it("should handle boolean and number values", () => {
    const data = {
      published: true,
      count: 42,
    }
    const result = formatFrontmatter(data)

    expect(result).toContain("published: true")
    expect(result).toContain("count: 42")
  })
})

describe("Text Utilities", () => {
  it("should clean text with encoding issues", () => {
    expect(cleanText("â€™")).toBe("'")
    expect(cleanText("â€œtest â€")).toBe('"test "')
  })

  it("should normalize whitespace", () => {
    expect(cleanText("  hello   world  ")).toBe("hello world")
    expect(cleanText("test\n\n\nmore")).toBe("test more")
  })

  it("should remove zero-width characters", () => {
    expect(cleanText("test\u200B\u200C\u200Dtext")).toBe("testtext")
    // BOM character gets normalized to space by whitespace normalization
    expect(cleanText("hello\uFEFFworld")).toBe("hello world")
  })

  it("should handle smart quotes", () => {
    // Left/right single quotes → straight apostrophes
    expect(cleanText("\u2018test\u2019")).toBe("'test'")
    // Left/right double quotes → straight quotes
    expect(cleanText("\u201Ctest\u201D")).toBe('"test"')
  })
})

describe("Markdown Normalization", () => {
  it("should normalize line endings", () => {
    const markdown = "Line 1\r\nLine 2\r\nLine 3"
    expect(normalizeMarkdown(markdown)).toBe("Line 1\nLine 2\nLine 3")
  })

  it("should normalize multiple blank lines", () => {
    const markdown = "Paragraph 1\n\n\n\nParagraph 2"
    expect(normalizeMarkdown(markdown)).toBe("Paragraph 1\n\nParagraph 2")
  })

  it("should normalize list markers", () => {
    const markdown = "* Item 1\n+ Item 2\n- Item 3"
    expect(normalizeMarkdown(markdown)).toBe("- Item 1\n- Item 2\n- Item 3")
  })

  it("should trim trailing whitespace", () => {
    const markdown = "Line with spaces   \nAnother line  "
    const result = normalizeMarkdown(markdown)
    expect(result).toBe("Line with spaces\nAnother line")
  })
})

describe("Unescape Markdown", () => {
  it("should unescape markdown characters outside code blocks", () => {
    const text = "Test \\_underscore\\_ and \\[brackets\\]"
    expect(unescapeMarkdown(text)).toBe("Test _underscore_ and [brackets]")
  })

  it("should preserve escaping inside code blocks", () => {
    const text = "```\n\\_code\\_\n```"
    expect(unescapeMarkdown(text)).toBe("```\n\\_code\\_\n```")
  })

  it("should remove prettier-ignore comments", () => {
    const text = "Line 1\n{/* prettier-ignore */}\nLine 2"
    expect(unescapeMarkdown(text)).toBe("Line 1\nLine 2")
  })

  it("should handle multiple code blocks", () => {
    const text = "Before\n```\ncode1\n```\nMiddle\n```\ncode2\n```\nAfter"
    const result = unescapeMarkdown(text)
    expect(result).toContain("code1")
    expect(result).toContain("code2")
  })
})

describe("Strip Highlight Comments", () => {
  it("should remove highlight-line comments", () => {
    const code = "const x = 1 // highlight-line\nconst y = 2"
    expect(stripHighlightComments(code)).toBe("const x = 1\nconst y = 2")
  })

  it("should remove highlight-start and highlight-end", () => {
    const code = "line1 // highlight-start\nline2\nline3 // highlight-end"
    expect(stripHighlightComments(code)).toBe("line1\nline2\nline3")
  })

  it("should handle mixed whitespace", () => {
    const code = "test   //   highlight-line  \nnext"
    // Removes comment but preserves leading whitespace on the line
    expect(stripHighlightComments(code)).toBe("test  \nnext")
  })

  it("should preserve non-highlight comments", () => {
    const code = "const x = 1 // regular comment\nconst y = 2 // highlight-line\nconst z = 3 // another comment"
    const result = stripHighlightComments(code)
    expect(result).toContain("// regular comment")
    expect(result).toContain("// another comment")
    expect(result).not.toContain("highlight-line")
  })
})

describe("URL Resolution", () => {
  it("should preserve absolute URLs", () => {
    expect(resolveUrl("https://example.com/path", "https://base.com")).toBe("https://example.com/path")
    expect(resolveUrl("http://example.com", "https://base.com")).toBe("http://example.com")
  })

  it("should resolve relative URLs with base", () => {
    expect(resolveUrl("/path/to/page", "https://example.com")).toBe("https://example.com/path/to/page")
  })

  it("should handle URLs without base (server-side)", () => {
    // When window is not defined (Node.js), base defaults to empty string
    const result = resolveUrl("https://example.com")
    expect(result).toBe("https://example.com")
  })

  it("should handle invalid URLs gracefully", () => {
    // If URL constructor fails, return original
    const result = resolveUrl("not-a-valid-url", "")
    expect(result).toBe("not-a-valid-url")
  })
})

describe("Integration Tests", () => {
  it("should format a complete markdown document", () => {
    const title = formatHeading(1, "Documentation")
    const intro = "This is an introduction.\n\n"
    const code = formatCodeBlock('console.log("Hello")', "javascript")
    const list = formatUnorderedList(["Feature 1", "Feature 2"])

    const result = title + intro + code + list

    expect(result).toContain("# Documentation")
    expect(result).toContain("introduction")
    expect(result).toContain("```javascript")
    expect(result).toContain("- Feature 1")
  })

  it("should produce consistent output for same input", () => {
    const data = { title: "Test", url: "https://test.com" }

    const result1 = formatFrontmatter(data)
    const result2 = formatFrontmatter(data)

    expect(result1).toBe(result2)
  })

  it("should handle text cleaning pipeline", () => {
    const dirtyText = "  â€™test â€œquotesâ€  with   spaces  "
    const cleaned = cleanText(dirtyText)
    const normalized = normalizeMarkdown(cleaned)

    expect(normalized).toBe('\'test "quotes" with spaces')
  })
})
