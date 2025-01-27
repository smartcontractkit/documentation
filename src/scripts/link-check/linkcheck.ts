import { ChildProcessByStdio, execSync, spawn } from "child_process"
import { existsSync, readFileSync, writeFileSync, createWriteStream, statSync, mkdirSync } from "fs"
import { Readable } from "node:stream"
import { exit, cwd, stdout } from "process"

const tempDir = `${cwd()}/temp`
if (!existsSync(tempDir)) {
  mkdirSync(tempDir)
}
const logFile = `${tempDir}/link-checker.log`
const logStream = createWriteStream(logFile, { flags: "w" })

const displayLogFile = () => {
  if (existsSync(logFile) && statSync(logFile).size > 0) {
    const content = readFileSync(logFile, "utf8")
    console.log("\n------ Log File Content ------")
    console.log(content)
    console.log("------------------------------")
  }
}

// eslint-disable-next-line prefer-const
let server: ChildProcessByStdio<null, Readable, Readable>

let siteMapChecker: ChildProcessByStdio<null, Readable, Readable>

const cleanup = () => {
  displayLogFile()
  server?.kill("SIGTERM")
  siteMapChecker?.kill("SIGTERM")
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err)
  cleanup()
  exit(1)
})

process.on("exit", cleanup)

const getModeFromArgs = (): "internal" | "external" => {
  const modeArg = process.argv.find((arg) => arg.startsWith("--mode="))
  if (!modeArg) return "internal"

  const [, modeValue] = modeArg.split("=")
  if (!["internal", "external"].includes(modeValue)) {
    throw new Error(`Invalid mode value. Received: ${modeValue}. Expected: internal or external.`)
  }
  return modeValue as "internal" | "external"
}

const parseBaseUrl = (data: string): string => {
  const regex = /(Local.*?)(?<baseUrl>http:\/\/.*?)\//
  const match = data.toString().match(regex)
  return match?.groups?.baseUrl || ""
}

const processSiteMap = (baseUrl: string): string => {
  const siteMap = `${cwd()}/.vercel/output/static/sitemap-0.xml`
  const linksFile = `${tempDir}/sitemap-urls.txt`

  const data = readFileSync(siteMap, { encoding: "utf8" })
  const regex = /<loc>(?<link>.*?)<\/loc>/gm
  const links: string[] = []

  // Use the appropriate ignore file based on mode
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
      const normalizedLink = link.replace("https://docs.chain.link", baseUrl)
      // Only add the link if it doesn't match any of the ignored patterns
      const shouldInclude = !ignoredPatterns.some((pattern) => pattern.test(normalizedLink))
      if (shouldInclude) {
        links.push(normalizedLink)
      }
    }
  }

  writeFileSync(linksFile, links.join("\n"))
  return linksFile
}

let mode: "internal" | "external"
try {
  mode = getModeFromArgs()
} catch (error) {
  console.error(error.message)
  exit(1)
}

console.log("Generating a production build...")
try {
  execSync("npm run build")
  console.log("Build finished.")
} catch (error) {
  console.error("Failed to generate the build.", error)
  exit(1)
}

server = spawn("npm", ["run", "dev"], {
  stdio: ["ignore", "pipe", "pipe"],
})

server.stdout.on("data", (data) => {
  const baseUrl = parseBaseUrl(data)
  stdout.write(data.toString())

  if (baseUrl) {
    const linksFile = processSiteMap(baseUrl)

    console.log("Checking sitemap links:", linksFile)

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
            baseUrl,
            "-e",
          ]
        : [
            "--input-file",
            linksFile,
            "--skip-file",
            `${cwd()}/src/scripts/link-check/ignoredfiles-internal.txt`,
            "--hosts",
            baseUrl,
          ]

    siteMapChecker = spawn("npm", ["run", "linkcheckWrapper", "--", ...args], {
      stdio: ["ignore", "pipe", "pipe"],
    })

    siteMapChecker.stdout.on("data", (checkerData) => {
      logStream.write(checkerData)
    })

    siteMapChecker.stderr.on("data", (errorData) => {
      console.error("Linkcheck error:", errorData.toString())
    })

    siteMapChecker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Sitemap link checker exited with code ${code}`)
        exit(2)
      }
      exit(0)
    })
  }
})

server.stderr.on("data", (errorData) => {
  console.error("Server error:", errorData.toString())
})

server.on("error", (error) => {
  console.error("Failed to start the server.", error)
  exit(1)
})
