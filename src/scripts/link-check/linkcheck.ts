import { platform, exit, argv, stdout } from "process"

import { spawn, execSync } from "child_process"
import * as fs from "fs"

const parseBaseUrl = (data) => {
  const regex = /(Local.*?)(?<baseUrl>http:\/\/.*?)\//
  const match = (data.toString() as string).match(regex)

  let baseUrl = ""

  if (match && match.groups && match.groups.baseUrl) {
    baseUrl = match.groups.baseUrl
  }
  return baseUrl
}
const processSiteMap = (baseUrl: string) => {
  const siteMap = `${process.cwd()}/dist/sitemap-0.xml`
  const tempDir = `${process.cwd()}/temp`
  const linksFile = `${tempDir}/sitemap-urls.txt`

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }
  const data = fs.readFileSync(siteMap, { encoding: "utf8" })
  const regex = /<loc>(?<link>.*?)<\/loc>/gm
  const locs = data.matchAll(regex)
  const links: string[] = []
  for (const loc of locs) {
    if (loc.groups && loc.groups.link) {
      links.push(loc.groups.link.replace("https://docs.chain.link", baseUrl))
    }
  }
  const fileContent = links.join("\n")
  fs.writeFileSync(linksFile, fileContent)
  return linksFile
}

// first ensure that build is run
console.log("generate a production build")
execSync("npm run build")
console.log("build finished")

const server = spawn("npm", ["run", "preview"], {
  stdio: ["ignore", "pipe", "ignore"],
})

let external = false
if (argv[argv.length - 1] === "-e") {
  external = true
}

let output = ""
server.stdout.on("data", (data) => {
  const baseUrl = parseBaseUrl(data)

  stdout.write(data.toString())
  output = output + data.toString()
  if (baseUrl) {
    let program
    if (platform === "linux") {
      program = "linkcheck-linux"
    } else if (platform === "darwin") {
      program = "linkcheck"
    } else {
      program = "linkcheck-win"
    }
    console.log(__dirname, process.cwd())

    const args = [":3000", "--skip-file", `${process.cwd()}/src/scripts/link-check/ignoredfiles.txt`]
    if (external) {
      args.push("-e")
      console.log("Also checking external links.")
    }
    const checker = spawn(program, args, {
      stdio: ["ignore", "pipe", "ignore"],
    })
    checker.stdout.on("data", (checkerData) => {
      stdout.write(checkerData.toString())
    })
    checker.on("exit", (buildCheckerExitCode, other) => {
      console.log(`linkcheck build folder finished, exit code ${buildCheckerExitCode}, signal ${other}`)

      const linksFile = processSiteMap(baseUrl)
      console.log("check site maps links", linksFile)

      const args = [
        "--input-file",
        linksFile,
        "--skip-file",
        `${process.cwd()}/src/scripts/link-check/ignoredfiles.txt`,
        "--hosts",
        baseUrl,
      ]

      const siteMapChecker = spawn(program, args, {
        stdio: ["ignore", "pipe", "ignore"],
      })
      siteMapChecker.stdout.on("data", (checkerData) => {
        stdout.write(checkerData.toString())
      })

      siteMapChecker.on("exit", (siteMapCheckerExitCode, signal) => {
        console.log(`linkcheck of sitemaps link  finished, exit code ${siteMapCheckerExitCode}, signal ${signal}`)
        server.stdout.destroy()
        server.kill()
        checker.stdout.destroy()
        checker.kill()
        siteMapChecker.stdout.destroy()
        siteMapChecker.kill()
        let result
        if (
          (buildCheckerExitCode === null || buildCheckerExitCode === 0) &&
          (siteMapCheckerExitCode === null || siteMapCheckerExitCode === 0)
        ) {
          result = undefined
        } else {
          console.error(`build folder link checker exited with code ${buildCheckerExitCode}`)
          console.error(`sitemaps link checker exited with code ${siteMapCheckerExitCode}`)
          result = 2
        }
        exit(result)
      })
    })
  }
})
