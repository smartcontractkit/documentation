#!/usr/bin/env node
import fs from "fs/promises"
import path from "path"
import { SUPPORTED_LLM_SECTIONS, LLM_SECTIONS_CONFIG } from "../config/llms.js"

async function main() {
  const errors: string[] = []
  const warnings: string[] = []
  const SOFT_LIMIT_BYTES = 3_000_000 // ~3 MB warn threshold
  const HARD_LIMIT_BYTES = 5_000_000 // ~5 MB fail threshold

  for (const section of SUPPORTED_LLM_SECTIONS) {
    const cfg = LLM_SECTIONS_CONFIG[section as keyof typeof LLM_SECTIONS_CONFIG]
    const languages = cfg?.languages || []

    const filesToCheck: Array<{ path: string; label: string }> = []

    if (languages.length > 0) {
      // Check language-specific files
      for (const lang of languages) {
        filesToCheck.push({
          path: path.resolve(`src/content/${section}/llms-full-${lang}.txt`),
          label: `${section}-${lang}`,
        })
      }
    } else {
      // Check single file (backward compatibility)
      filesToCheck.push({
        path: path.resolve(`src/content/${section}/llms-full.txt`),
        label: section,
      })
    }

    for (const { path: filePath, label } of filesToCheck) {
      try {
        const content = await fs.readFile(filePath, "utf-8")
        const sizeBytes = Buffer.byteLength(content, "utf-8")
        if (sizeBytes > HARD_LIMIT_BYTES) {
          errors.push(`${label}: file size ${sizeBytes} bytes exceeds hard limit ${HARD_LIMIT_BYTES}`)
        } else if (sizeBytes > SOFT_LIMIT_BYTES) {
          warnings.push(`${label}: file size ${sizeBytes} bytes exceeds soft limit ${SOFT_LIMIT_BYTES}`)
        }
        if (!content.trim()) errors.push(`${label}: file is empty`)

        // Basic link checks (absolute links)
        const links = Array.from(content.matchAll(/\((https?:[^)]+)\)/g)).map((m) => m[1])
        const hasBadTracking = links.some((u) => /[?&]utm_/i.test(u))
        if (hasBadTracking) warnings.push(`${label}: found tracking params in links`)

        // Validate ISO dates when present
        for (const m of content.matchAll(/^Last Updated:\s*(.+)$/gm)) {
          const val = m[1].trim()
          const d = new Date(val)
          if (isNaN(d.getTime())) warnings.push(`${label}: invalid Last Updated format '${val}'`)
        }
      } catch {
        errors.push(`${label}: file not found at ${filePath}`)
      }
    }
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

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
