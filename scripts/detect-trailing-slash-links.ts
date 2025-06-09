#!/usr/bin/env node
/**
 * Script to detect internal links with trailing slashes in MDX and Astro files
 * This helps identify inconsistent internal linking that can cause SEO issues
 */

import { readdir, readFile } from "fs/promises"
import { join, extname, relative } from "path"

interface LinkIssue {
  file: string
  line: number
  link: string
  context: string
}

// Configuration
const INCLUDE_EXTENSIONS = [".mdx", ".astro", ".md"]
const EXCLUDE_DIRS = ["node_modules", ".git", "dist", ".astro", "temp", "bin"]
const DOCS_ROOT = process.cwd()

// Regex patterns to match internal links
const LINK_PATTERNS = [
  // Markdown links: [text](/path/)
  /\[([^\]]*)\]\(([^)]*\/)\)/g,
  // HTML links: href="/path/"
  /href=["']([^"']*\/)["']/g,
  // Astro/JSX links: href={"/path/"}
  /href=\{["']([^"']*\/)["']\}/g,
  // import statements: from "/path/"
  /from\s+["']([^"']*\/)["']/g,
  // Astro components with paths: <Component path="/path/" />
  /(?:path|src|href|to)=["']([^"']*\/)["']/g,
]

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

function extractLinks(content: string): { link: string; line: number; context: string }[] {
  const lines = content.split("\n")
  const links: { link: string; line: number; context: string }[] = []

  lines.forEach((line, index) => {
    LINK_PATTERNS.forEach((pattern) => {
      let match
      // Reset regex state
      pattern.lastIndex = 0

      while ((match = pattern.exec(line)) !== null) {
        // For markdown links [text](/path/), the URL is in group 2
        // For all other patterns, the URL is in group 1
        const linkUrl = match[0].startsWith("[") ? match[2] : match[1]

        if (linkUrl && isInternalLinkWithTrailingSlash(linkUrl)) {
          links.push({
            link: linkUrl,
            line: index + 1,
            context: line.trim(),
          })
        }
      }
    })
  })

  return links
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

async function analyzeFile(filePath: string): Promise<LinkIssue[]> {
  try {
    const content = await readFile(filePath, "utf-8")
    const links = extractLinks(content)
    const relativePath = relative(DOCS_ROOT, filePath)

    return links.map((link) => ({
      file: relativePath,
      line: link.line,
      link: link.link,
      context: link.context,
    }))
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error)
    return []
  }
}

function groupByFile(issues: LinkIssue[]): Map<string, LinkIssue[]> {
  const grouped = new Map<string, LinkIssue[]>()

  for (const issue of issues) {
    if (!grouped.has(issue.file)) {
      grouped.set(issue.file, [])
    }
    const fileIssues = grouped.get(issue.file)
    if (fileIssues) {
      fileIssues.push(issue)
    }
  }

  return grouped
}

function printResults(issues: LinkIssue[]) {
  if (issues.length === 0) {
    console.log("✅ No internal links with trailing slashes found!")
    return
  }

  console.log(`🔍 Found ${issues.length} internal links with trailing slashes:\n`)

  const grouped = groupByFile(issues)

  for (const [file, fileIssues] of grouped) {
    console.log(`📁 ${file} (${fileIssues.length} issues)`)

    for (const issue of fileIssues) {
      console.log(`  Line ${issue.line}: ${issue.link}`)
      console.log(`    Context: ${issue.context}`)
      console.log()
    }
  }

  // Summary
  console.log(`\n📊 Summary:`)
  console.log(`  Files affected: ${grouped.size}`)
  console.log(`  Total issues: ${issues.length}`)

  // Most common problematic links
  const linkCounts = new Map<string, number>()
  for (const issue of issues) {
    linkCounts.set(issue.link, (linkCounts.get(issue.link) || 0) + 1)
  }

  const sortedLinks = Array.from(linkCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  if (sortedLinks.length > 0) {
    console.log(`\n🔗 Most common problematic links:`)
    sortedLinks.forEach(([link, count]) => {
      console.log(`  ${link} (${count} occurrences)`)
    })
  }
}

async function main() {
  console.log("🔍 Scanning for internal links with trailing slashes...\n")

  try {
    const allFiles = await getAllFiles(DOCS_ROOT)
    console.log(`📋 Found ${allFiles.length} files to analyze`)

    if (allFiles.length === 0) {
      console.log("❌ No files found to analyze. Check the directory path.")
      return
    }

    const allIssues: LinkIssue[] = []
    let processedFiles = 0

    for (const file of allFiles) {
      const issues = await analyzeFile(file)
      allIssues.push(...issues)
      processedFiles++

      if (processedFiles % 50 === 0) {
        console.log(`  Processed ${processedFiles}/${allFiles.length} files...`)
      }
    }

    console.log(`✅ Finished analyzing ${processedFiles} files`)

    printResults(allIssues)

    // Exit with error code if issues found (useful for CI)
    if (allIssues.length > 0) {
      console.log("\n⚠️  Please fix the trailing slash issues above.")
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Error running analysis:", error)
    process.exit(1)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as detectTrailingSlashLinks }
