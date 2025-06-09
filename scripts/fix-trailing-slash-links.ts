#!/usr/bin/env node
/**
 * Script to automatically fix internal links with trailing slashes in MDX and Astro files
 * This removes trailing slashes from internal links to ensure consistency
 */

import { readdir, readFile, writeFile } from "fs/promises"
import { join, extname, relative } from "path"

interface LinkFix {
  file: string
  line: number
  originalLink: string
  fixedLink: string
  context: string
}

// Configuration
const INCLUDE_EXTENSIONS = [".mdx", ".astro", ".md"]
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", ".astro", "temp", "bin"]
const DOCS_ROOT = process.cwd()

// Regex patterns to match and fix internal links
const LINK_PATTERNS = [
  // Markdown links: [text](/path/) -> [text](/path)
  {
    pattern: /\[([^\]]*)\]\(([^)]*\/)\)/g,
    replacement: (match: string, text: string, url: string) => `[${text}](${url.replace(/\/+$/, "")})`,
  },
  // HTML links: href="/path/" -> href="/path"
  {
    pattern: /href=(["'])([^"']*\/)\1/g,
    replacement: (match: string, quote: string, url: string) => `href=${quote}${url.replace(/\/+$/, "")}${quote}`,
  },
  // Astro/JSX links: href={"/path/"} -> href={"/path"}
  {
    pattern: /href=\{(["'])([^"']*\/)\1\}/g,
    replacement: (match: string, quote: string, url: string) => `href={${quote}${url.replace(/\/+$/, "")}${quote}}`,
  },
  // import statements: from "/path/" -> from "/path"
  {
    pattern: /from\s+(["'])([^"']*\/)\1/g,
    replacement: (match: string, quote: string, url: string) => `from ${quote}${url.replace(/\/+$/, "")}${quote}`,
  },
  // Astro components with paths: <Component path="/path/" /> -> <Component path="/path" />
  {
    pattern: /((?:path|src|href|to)=)(["'])([^"']*\/)\2/g,
    replacement: (match: string, attr: string, quote: string, url: string) =>
      `${attr}${quote}${url.replace(/\/+$/, "")}${quote}`,
  },
] as const

// Patterns to exclude (external links, file extensions, etc.)
const EXCLUDE_PATTERNS = [
  /^https?:\/\//, // External URLs
  /^mailto:/, // Email links
  /^tel:/, // Phone links
  /^#/, // Hash links
  /\.(jpg|jpeg|png|gif|svg|pdf|zip|tar|gz|css|js|json|xml|ico)$/i, // File extensions
]

async function getAllFiles(dir: string, allFiles: string[] = []): Promise<string[]> {
  try {
    const files = await readdir(dir, { withFileTypes: true })

    for (const file of files) {
      const fullPath = join(dir, file.name)

      if (file.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_DIRS.includes(file.name)) {
          await getAllFiles(fullPath, allFiles)
        }
      } else if (file.isFile()) {
        // Include only specified file extensions
        if (INCLUDE_EXTENSIONS.includes(extname(file.name))) {
          allFiles.push(fullPath)
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error)
  }

  return allFiles
}

function isInternalLinkWithTrailingSlash(url: string): boolean {
  // Skip if it matches any exclude pattern
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(url)) {
      return false
    }
  }

  // Check if it's an internal path that ends with a slash
  if (url.startsWith("/") && url.endsWith("/") && url.length > 1) {
    return true
  }

  return false
}

function fixLinksInContent(content: string): { content: string; fixes: LinkFix[] } {
  let fixedContent = content
  const fixes: LinkFix[] = []
  const lines = content.split("\n")

  for (const linkPattern of LINK_PATTERNS) {
    const regex = new RegExp(linkPattern.pattern.source, linkPattern.pattern.flags)

    fixedContent = fixedContent.replace(regex, (match, ...args) => {
      // Extract the URL from the match based on the pattern
      let url: string
      let lineNumber = 0
      let context = ""

      // Find which line this match is on
      const matchIndex = fixedContent.indexOf(match)
      const beforeMatch = fixedContent.substring(0, matchIndex)
      lineNumber = beforeMatch.split("\n").length

      if (lineNumber <= lines.length) {
        context = lines[lineNumber - 1]?.trim() || ""
      }

      // Extract URL based on pattern type
      if (match.includes("[") && match.includes("](")) {
        // Markdown link: [text](/path/)
        url = args[1]
      } else if (match.includes("href=")) {
        // HTML/JSX href
        url = args[1] || args[2]
      } else if (match.includes("from ")) {
        // Import statement
        url = args[1]
      } else {
        // Component attribute
        url = args[2]
      }

      if (url && isInternalLinkWithTrailingSlash(url)) {
        const fixedLink = url.replace(/\/+$/, "")
        const replacement = linkPattern.replacement(match, args[0], args[1], args[2])

        fixes.push({
          file: "",
          line: lineNumber,
          originalLink: url,
          fixedLink,
          context,
        })

        return replacement
      }

      return match
    })
  }

  return { content: fixedContent, fixes }
}

async function fixFile(filePath: string): Promise<LinkFix[]> {
  try {
    const content = await readFile(filePath, "utf-8")
    const { content: fixedContent, fixes } = fixLinksInContent(content)
    const relativePath = relative(DOCS_ROOT, filePath)

    // Update file path in fixes
    const updatedFixes = fixes.map((fix) => ({ ...fix, file: relativePath }))

    // Only write file if changes were made
    if (fixes.length > 0) {
      await writeFile(filePath, fixedContent, "utf-8")
    }

    return updatedFixes
  } catch (error) {
    console.warn(`Warning: Could not process file ${filePath}:`, error)
    return []
  }
}

function groupByFile(fixes: LinkFix[]): Map<string, LinkFix[]> {
  const grouped = new Map<string, LinkFix[]>()

  for (const fix of fixes) {
    if (!grouped.has(fix.file)) {
      grouped.set(fix.file, [])
    }
    const fileFixes = grouped.get(fix.file)
    if (fileFixes) {
      fileFixes.push(fix)
    }
  }

  return grouped
}

function printResults(fixes: LinkFix[]) {
  if (fixes.length === 0) {
    console.log("✅ No internal links with trailing slashes found to fix!")
    return
  }

  console.log(`🔧 Fixed ${fixes.length} internal links with trailing slashes:\n`)

  const grouped = groupByFile(fixes)

  for (const [file, fileFixes] of grouped) {
    console.log(`📁 ${file} (${fileFixes.length} fixes)`)

    for (const fix of fileFixes) {
      console.log(`  Line ${fix.line}: ${fix.originalLink} → ${fix.fixedLink}`)
      console.log(`    Context: ${fix.context}`)
      console.log()
    }
  }

  // Summary
  console.log(`\n📊 Summary:`)
  console.log(`  Files modified: ${grouped.size}`)
  console.log(`  Total fixes: ${fixes.length}`)

  // Most common fixes
  const linkCounts = new Map<string, number>()
  for (const fix of fixes) {
    linkCounts.set(fix.originalLink, (linkCounts.get(fix.originalLink) || 0) + 1)
  }

  const sortedLinks = Array.from(linkCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  if (sortedLinks.length > 0) {
    console.log(`\n🔗 Most frequently fixed links:`)
    sortedLinks.forEach(([link, count]) => {
      console.log(`  ${link} (${count} fixes)`)
    })
  }
}

async function main() {
  console.log("🔧 Fixing internal links with trailing slashes...\n")

  try {
    const allFiles = await getAllFiles(DOCS_ROOT)
    console.log(`📋 Found ${allFiles.length} files to process`)

    if (allFiles.length === 0) {
      console.log("❌ No files found to process. Check the directory path.")
      return
    }

    const allFixes: LinkFix[] = []
    let processedFiles = 0

    for (const file of allFiles) {
      const fixes = await fixFile(file)
      allFixes.push(...fixes)
      processedFiles++

      if (processedFiles % 50 === 0) {
        console.log(`  Processed ${processedFiles}/${allFiles.length} files...`)
      }
    }

    console.log(`✅ Finished processing ${processedFiles} files`)

    printResults(allFixes)

    if (allFixes.length > 0) {
      console.log("\n✅ All trailing slash issues have been automatically fixed!")
      console.log("💡 You may want to review the changes and commit them to your repository.")
    }
  } catch (error) {
    console.error("❌ Error running fix:", error)
    process.exit(1)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as fixTrailingSlashLinks }
