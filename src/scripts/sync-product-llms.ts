import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const contentDir = path.join(root, "src", "content")
const publicDir = path.join(root, "public")

function syncProductLlms() {
  if (!fs.existsSync(contentDir)) {
    throw new Error(`Missing content directory: ${contentDir}`)
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true })

  let copied = 0

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const product = entry.name
    const source = path.join(contentDir, product, "llms.txt")

    if (!fs.existsSync(source)) continue

    const targetDir = path.join(publicDir, product)
    const target = path.join(targetDir, "llms.txt")

    fs.mkdirSync(targetDir, { recursive: true })
    fs.copyFileSync(source, target)

    console.log(`[llms] ${product} → /${product}/llms.txt`)
    copied++
  }

  if (copied === 0) {
    console.warn("[llms] No product llms.txt files found")
  } else {
    console.log(`[llms] Copied ${copied} product llms.txt files`)
  }
}

try {
  syncProductLlms()
} catch (err) {
  console.error("[llms] Sync failed:", err)
  process.exit(1)
}
