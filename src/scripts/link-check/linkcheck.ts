import { execSync, spawn, SpawnOptions } from "child_process"
import { existsSync, readFileSync, writeFileSync, createWriteStream, statSync, mkdirSync } from "fs"
import { exit, cwd } from "process"

declare global {
  function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

// ================================
//  CONFIGURABLE CONSTANTS
// ================================
const BASE_URL = "http://localhost:4321"
const TEMP_DIR = `${cwd()}/temp`
const LOG_FILE = `${TEMP_DIR}/link-checker.log`

const LINK_CHUNK_SIZE = 300

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
  if (existsSync(LOG_FILE) && statSync(LOG_FILE).size > 0) {
    const content = readFileSync(LOG_FILE, "utf8")
    console.log("\n------ Log File Content ------")
    console.log(content)
    console.log("------------------------------")
  }
}

/**
 * Wait for the dev server to be "ready" by checking for a 2xx status on BASE_URL.
 */
async function waitForServerReadiness(url: string, attempts = 20) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        console.log(`Server is ready at ${url}`)
        return
      }
    } catch {
      // Connection error or not ready yet
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
  const siteMap = `${cwd()}/.vercel/output/static/sitemap-0.xml`
  const data = readFileSync(siteMap, "utf8")

  const regex = /<loc>(?<link>.*?)<\/loc>/gm
  const rawLinks: string[] = []

  // Use the appropriate ignore file
  const ignoredPatternsFile =
    mode === "external"
      ? `${cwd()}/src/scripts/link-check/ignoredfiles-external.txt`
      : `${cwd()}/src/scripts/link-check/ignoredfiles-internal.txt`

  const ignoredPatterns = readFileSync(ignoredPatternsFile, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((pattern) => new RegExp(pattern))

  // Collect all relevant links
  for (const loc of data.matchAll(regex)) {
    const link = loc.groups?.link
    if (link) {
      // Replace production domain with the local base
      const normalizedLink = link.replace("https://docs.chain.link", BASE_URL)
      const shouldInclude = !ignoredPatterns.some((pattern) => pattern.test(normalizedLink))
      if (shouldInclude) {
        rawLinks.push(normalizedLink)
      }
    }
  }

  // Split into chunks
  const chunkedLinks = chunkArray(rawLinks, LINK_CHUNK_SIZE)

  // Write each chunk to its own file
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

    // We'll just spawn the linkcheck wrapper
    const checker = spawn("npm", ["run", "linkcheckWrapper", "--", ...args], {
      stdio: ["pipe", "pipe", "pipe"],
    } as SpawnOptions)

    // Write stdout to log file
    const logStream = createWriteStream(LOG_FILE, { flags: "a" })
    if (checker.stdout) {
      checker.stdout.on("data", (data) => {
        logStream.write(data)
      })
    }

    // Write stderr to console and log
    if (checker.stderr) {
      checker.stderr.on("data", (data) => {
        process.stderr.write(data.toString())
      })
    }

    // When process exits
    checker.on("exit", (code) => {
      logStream.end()

      // if exit code is 1 (warnings only), treat as success (0).
      if (code === 1) {
        console.log("Link checker reported warnings only. Treating as success.")
        code = 0
      }

      resolve(code ?? 1) // if code is null, treat as error
    })
  })
}

// ================================
//  MAIN LOGIC
// ================================

async function main() {
  ensureTempSetup()

  // 1) Determine mode from command line
  const mode = getModeFromArgs()

  // 2) Build site once (production build)
  console.log("Generating a production build...")
  try {
    execSync("npm run build", { stdio: "inherit" })
    console.log("Build finished.")
  } catch (error) {
    console.error("Failed to generate the build.", error)
    exit(1)
  }

  // 3) Serve the static build in the background
  console.log("Starting production server in background...")
  execSync("nohup npx serve .vercel/output/static --listen 4321 > server.log 2>&1 &", { stdio: "inherit" })

  // 4) Wait for readiness
  try {
    await waitForServerReadiness(BASE_URL, 30) // Wait up to 30 attempts
  } catch (err) {
    console.error("Server did not become ready in time.", err)
    exit(1)
  }

  // 5) Process site map: get chunk files
  const chunkFiles = await processSiteMap(mode)
  console.log(`Created ${chunkFiles.length} chunk files.`)

  // 6) Run link check on each chunk in parallel, collecting any failures
  const checkPromises = chunkFiles.map((chunkFile, index) => {
    const chunkNumber = index + 1
    console.log(`\n>>> Checking chunk ${chunkNumber} of ${chunkFiles.length}: ${chunkFile}\n`)

    return checkChunkFile(chunkFile, mode).then((code) => {
      if (code !== 0) {
        console.error(`Link checker failed on chunk ${chunkNumber} (exit code: ${code})`)
        // We'll store chunkNumber with the failure
        return { chunkNumber, failed: true }
      }
      return { chunkNumber, failed: false }
    })
  })

  const results = await Promise.all(checkPromises)
  const failedChunks = results.filter((r) => r.failed).map((r) => r.chunkNumber)

  // 7) If any chunks failed, exit with error after we've checked them all
  if (failedChunks.length > 0) {
    console.error(`Some chunks failed: ${failedChunks.join(", ")}`)
    displayLogFile()
    exit(2)
  }

  // 8) Otherwise, success
  console.log(`All chunks succeeded!`)
  displayLogFile()
  exit(0)
}

// Run main, and handle uncaught rejections
main().catch((err) => {
  console.error("Uncaught error in main():", err)
  displayLogFile()
  exit(1)
})
