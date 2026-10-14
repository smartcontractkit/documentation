#!/usr/bin/env node
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "node:url"
import { SUPPORTED_LLM_SECTIONS, LLM_SECTIONS_CONFIG } from "../config/llms.js"
import { SOLUTIONS, toPagePath, type Solution } from "../config/solutions/index.ts"
import { SOLUTION_DISCLAIMER } from "../config/solutions/disclaimer.ts"
import { solutionLlmsOutputPath } from "../lib/markdown/solutionLlms.js"

type LlmsFile = { path: string; label: string; maxBytes: number; solution?: Solution }
const SOFT_LIMIT_BYTES = 3_000_000 // ~3 MB warn threshold
const HARD_LIMIT_BYTES = 5_000_000 // ~5 MB fail threshold

export function llmsFilesToValidate(): LlmsFile[] {
  const files: LlmsFile[] = []
  for (const section of SUPPORTED_LLM_SECTIONS) {
    const cfg = LLM_SECTIONS_CONFIG[section]
    const filenames = cfg.languages?.length ? cfg.languages.map((lang) => `llms-full-${lang}.txt`) : ["llms-full.txt"]
    for (const filename of filenames) {
      files.push({
        path: path.resolve("src/content", section, filename),
        label: filename === "llms-full.txt" ? section : `${section}-${filename.slice(10, -4)}`,
        maxBytes: cfg.maxBytes ?? HARD_LIMIT_BYTES,
      })
    }
  }
  for (const solution of SOLUTIONS.filter((solution) => !solution.hidden)) {
    files.push({
      path: solutionLlmsOutputPath(solution.slug),
      label: `solutions/${solution.slug}`,
      maxBytes: HARD_LIMIT_BYTES,
      solution,
    })
  }
  return files
}

export async function validateLlmsFile(file: LlmsFile): Promise<{ errors: string[]; warnings: string[] }> {
  const { path: filePath, label, maxBytes, solution } = file
  const errors: string[] = []
  const warnings: string[] = []
  let content: string
  try {
    content = await fs.readFile(filePath, "utf8")
  } catch {
    return { errors: [`${label}: file not found at ${filePath}`], warnings }
  }
  const sizeBytes = Buffer.byteLength(content, "utf8")
  if (sizeBytes > maxBytes) errors.push(`${label}: file size ${sizeBytes} bytes exceeds hard limit ${maxBytes}`)
  else if (sizeBytes > SOFT_LIMIT_BYTES)
    warnings.push(`${label}: file size ${sizeBytes} bytes exceeds soft limit ${SOFT_LIMIT_BYTES}`)
  if (!content.trim()) errors.push(`${label}: file is empty`)

  const links = Array.from(content.matchAll(/\((https?:[^)]+)\)/g)).map((match) => match[1])
  if (links.some((url) => /[?&]utm_/i.test(url))) warnings.push(`${label}: found tracking params in links`)
  for (const match of content.matchAll(/^Last Updated:\s*(.+)$/gm)) {
    if (isNaN(new Date(match[1].trim()).getTime()))
      warnings.push(`${label}: invalid Last Updated format '${match[1].trim()}'`)
  }
  if (solution) {
    const headers = [...content.matchAll(/^# [^\n]+\nSource: (https:\/\/docs\.chain\.link\/solutions\/[^\n]+)\n/gm)]
    const expectedUrls = (solution.nav?.flatMap((group) => group.pages) ?? ["index"]).map(
      (pageId) => `https://docs.chain.link${toPagePath(solution.slug, pageId)}`
    )
    if (JSON.stringify(headers.map((header) => header[1])) !== JSON.stringify(expectedUrls)) {
      errors.push(`${label}: solution pages are missing, duplicated, or out of navigation order`)
    }
    const normalize = (text: string) => text.replace(/\s+/g, " ").trim()
    const disclaimer = normalize(
      SOLUTION_DISCLAIMER.beforeTerms +
        ` [${SOLUTION_DISCLAIMER.termsLabel}](${SOLUTION_DISCLAIMER.termsUrl})` +
        SOLUTION_DISCLAIMER.afterTerms
    )
    headers.forEach((header, index) => {
      const page = content.slice(header.index, headers[index + 1]?.index ?? content.length)
      if (!normalize(page).includes(disclaimer)) errors.push(`${label}: complete disclaimer missing from ${header[1]}`)
    })
  }
  return { errors, warnings }
}

async function main() {
  const errors: string[] = []
  const warnings: string[] = []
  for (const file of llmsFilesToValidate()) {
    const result = await validateLlmsFile(file)
    errors.push(...result.errors)
    warnings.push(...result.warnings)
  }

  if (errors.length) {
    console.error("Validation errors:\n" + errors.map((e) => `- ${e}`).join("\n"))
    process.exit(1)
  }

  if (warnings.length) {
    console.warn("Validation warnings:\n" + warnings.map((w) => `- ${w}`).join("\n"))
  }

  console.log("LLM validation complete.")
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
