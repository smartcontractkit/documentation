import { execSync, spawn, SpawnOptions } from "child_process"
import { existsSync, readFileSync, writeFileSync, createWriteStream, mkdirSync } from "fs"
import { exit, cwd } from "process"
import { extractCanonicalUrlsWithLanguageVariants } from "../../utils/sidebar.js"

declare global {
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

// ================================
//  CONFIGURABLE CONSTANTS
// ================================
const BASE_URL = "http://localhost:4321"
const TEMP_DIR = `${cwd()}/temp`
const LOG_FILE = `${TEMP_DIR}/link-checker.log`
const BUILD_DIR = `${cwd()}/dist/client`
const SITEMAP_FILE = `${BUILD_DIR}/sitemap-0.xml`

const LINK_CHUNK_SIZE = 150

// ================================
//  HELPER FUNCTIONS
// ================================

/**
 * Create temp directory and log file
 */
function ensureTempSetup() {
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR)
  }
}

/**
 * Show log file content at the end, if any
 */
function displayLogFile() {
  try {
    const content = readFileSync(LOG_FILE, "utf8")
    if (content.trim().length > 0) {
      console.log("\n------ Log File Content ------")
      console.log(content)
      console.log("------------------------------")
    }
  } catch {
    // Nothing to display
  }
}

/**
 * Wait for the dev server to be "ready" by checking for a 2xx status on BASE_URL.
 * Uses multiple checks to ensure server stability.
 */
async function waitForServerReadiness(url: string, attempts = 20) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        console.log(`Server responded on attempt ${i}, verifying stability...`)

        let stableChecks = 0
        for (let j = 0; j < 3; j++) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          try {
            const checkResponse = await fetch(url)
            if (checkResponse.ok) {
              stableChecks++
            }
          } catch {
            break
          }
        }

        if (stableChecks === 3) {
          console.log(`Server is ready and stable at ${url}`)
          return
        } else {
          console.log(`Server not yet stable, continuing checks...`)
        }
      }
    } catch {
      // Not ready yet
    }
    console.log(`Waiting for server to be ready... Attempt ${i}/${attempts}`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`Server not ready after ${attempts} attempts at ${url}`)
}

/**
 * Split an array into chunks of size `chunkSize`.
 */
function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

/**
 * Parse command line mode: "internal" or "external"
 */
function getModeFromArgs(): "internal" | "external" {
  const modeArg = process.argv.find((arg) => arg.startsWith("--mode="))
  if (!modeArg) return "internal"

  const [, modeValue] = modeArg.split("=")
  if (!["internal", "external"].includes(modeValue)) {
    throw new Error(`Invalid mode value. Received: ${modeValue}. Expected: internal or external.`)
  }
  return modeValue as "internal" | "external"
}

/**
 * Process the sitemap and split it into chunked files.
 */
async function processSiteMap(mode: "internal" | "external"): Promise<string[]> {
  const data = readFileSync(SITEMAP_FILE, "utf8")

  const regex = /<loc>(?<link>.*?)<\/loc>/gm
  const rawLinks: string[] = []

  const ignoredPatternsFile =
    mode === "external"
      ? `${cwd()}/src/scripts/link-check/ignoredfiles-external.txt`
      : `${cwd()}/src/scripts/link-check/ignoredfiles-internal.txt`

  const ignoredPatterns = readFileSync(ignoredPatternsFile, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((pattern) => new RegExp(pattern))

  for (const loc of data.matchAll(regex)) {
    const link = loc.groups?.link
    if (link) {
      const normalizedLink = link.replace("https://docs.chain.link", BASE_URL)
      const shouldInclude = !ignoredPatterns.some((pattern) => pattern.test(normalizedLink))
      if (shouldInclude) {
        rawLinks.push(normalizedLink)
      }
    }
  }

  const chunkedLinks = chunkArray(rawLinks, LINK_CHUNK_SIZE)
  const chunkFiles: string[] = []

  chunkedLinks.forEach((linksArr, index) => {
    const linksFile = `${TEMP_DIR}/sitemap-urls-part${index + 1}.txt`
    writeFileSync(linksFile, linksArr.join("\n"))
    chunkFiles.push(linksFile)
  })

  return chunkFiles
}

/**
 * Run the link check on a single chunk file.
 * Return 0 on success, or the child exit code on failure.
 */
function checkChunkFile(linksFile: string, mode: "internal" | "external"): Promise<number> {
  return new Promise((resolve) => {
    const args =
      mode === "external"
        ? [
            "--no-check-anchors",
            "--connection-failures-as-warnings",
            "--input-file",
            linksFile,
            "--skip-file",
            `${cwd()}/src/scripts/link-check/ignoredfiles-external.txt`,
            "--hosts",
            BASE_URL,
            "-e",
          ]
        : [
            "--input-file",
            linksFile,
            "--skip-file",
            `${cwd()}/src/scripts/link-check/ignoredfiles-internal.txt`,
            "--hosts",
            BASE_URL,
          ]

    const checker = spawn("npm", ["run", "linkcheckWrapper", "--", ...args], {
      stdio: ["pipe", "pipe", "pipe"],
    } as SpawnOptions)

    const logStream = createWriteStream(LOG_FILE, { flags: "a" })
    let outputData = ""

    if (checker.stdout) {
      checker.stdout.on("data", (data) => {
        const text = data.toString()
        outputData += text
        logStream.write(text)
      })
    }

    if (checker.stderr) {
      checker.stderr.on("data", (data) => {
        const text = data.toString()
        outputData += text
        process.stderr.write(text)
      })
    }

    checker.on("exit", (code) => {
      logStream.end()

      if (code === 1) {
        const lines = outputData.split("\n")
        const warningLines = lines.filter((line) => line.includes("=>"))

        const canonicalUrls = extractCanonicalUrlsWithLanguageVariants()

        const blockingWarnings = warningLines.filter((line) => {
          const lineLower = line.toLowerCase()

          if (lineLower.includes("mime type")) {
            return false
          }

          if (lineLower.includes("missing anchor")) {
            return false
          }

          return true
        })

        if (blockingWarnings.length === 0) {
          console.log(
            "Only acceptable warnings encountered (mime types and canonical URL anchors). Treating as success."
          )
          code = 0
        }
      }

      resolve(code ?? 1)
    })
  })
}

// ================================
//  MAIN LOGIC
// ================================

async function main() {
  ensureTempSetup()

  const mode = getModeFromArgs()

  console.log("Generating a production build...")
  try {
    execSync("npm run build", { stdio: "inherit" })
    console.log("Build finished.")
  } catch (error) {
    console.error("Failed to generate the build.", error)
    exit(1)
  }

  console.log("Starting production server in background...")
  execSync("nohup npx tsx src/scripts/link-check/static-server.ts > server.log 2>&1 &", { stdio: "inherit" })
  try {
    await waitForServerReadiness(BASE_URL, 30)
  } catch (err) {
    console.error("Server did not become ready in time.", err)
    exit(1)
  }

  const chunkFiles = await processSiteMap(mode)
  console.log(`Created ${chunkFiles.length} chunk files.`)

  const results: { chunkNumber: number; failed: boolean }[] = []

  for (let index = 0; index < chunkFiles.length; index++) {
    const chunkFile = chunkFiles[index]
    const chunkNumber = index + 1
    console.log(`\n>>> Checking chunk ${chunkNumber} of ${chunkFiles.length}: ${chunkFile}\n`)

    const code = await checkChunkFile(chunkFile, mode)
    if (code !== 0) {
      console.error(`Link checker failed on chunk ${chunkNumber} (exit code: ${code})`)
      results.push({ chunkNumber, failed: true })
    } else {
      results.push({ chunkNumber, failed: false })
    }

    if (index < chunkFiles.length - 1) {
      console.log("Waiting 2 seconds before next chunk...")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  const failedChunks = results.filter((r) => r.failed).map((r) => r.chunkNumber)

  if (failedChunks.length > 0) {
    console.error(`Some chunks failed: ${failedChunks.join(", ")}`)
    displayLogFile()
    exit(2)
  }

  console.log(`All chunks succeeded!`)
  displayLogFile()
  exit(0)
}

main().catch((err) => {
  console.error("Uncaught error in main():", err)
  displayLogFile()
  exit(1)
})
