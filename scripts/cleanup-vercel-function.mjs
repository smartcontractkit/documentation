#!/usr/bin/env node
/**
 * Post-build script to remove unnecessary files from Vercel serverless function
 * Reduces function size from 364MB to under 250MB limit
 */

import { rm } from "fs/promises"
import { existsSync } from "fs"
import { execSync } from "child_process"

const FUNCTION_DIR = ".vercel/output/functions/_render.func"

async function cleanup() {
  if (!existsSync(FUNCTION_DIR)) {
    console.error(`❌ Function directory not found: ${FUNCTION_DIR}`)
    process.exit(1)
  }

  console.log("🧹 Cleaning up serverless function bundle...")

  const sizeBefore = execSync(`du -sh ${FUNCTION_DIR}`, { encoding: "utf-8" }).trim()
  console.log(`📦 Size before: ${sizeBefore}`)

  // Remove large files/directories that are served statically by CDN
  const itemsToRemove = [
    `${FUNCTION_DIR}/public/images`,
    `${FUNCTION_DIR}/public/search-index.json`,
    `${FUNCTION_DIR}/public/files`,
    `${FUNCTION_DIR}/public/default-og-image.png`,
    `${FUNCTION_DIR}/public/samples`,
    `${FUNCTION_DIR}/public/changelog.json`,
  ]

  for (const item of itemsToRemove) {
    if (existsSync(item)) {
      await rm(item, { recursive: true, force: true })
      console.log(`  ✓ Removed: ${item.replace(FUNCTION_DIR + "/", "")}`)
    }
  }

  const sizeAfter = execSync(`du -sh ${FUNCTION_DIR}`, { encoding: "utf-8" }).trim()
  console.log(`📦 Size after:  ${sizeAfter}`)
  console.log("✨ Cleanup complete!")
}

cleanup().catch((error) => {
  console.error("❌ Cleanup failed:", error)
  process.exit(1)
})
