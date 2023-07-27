import { exec } from "child_process"
import os from "os"
import path from "path"

// Capture arguments passed to the script
const args: string = process.argv.slice(2).join(" ")

// Detect OS and architecture
const platform: string = os.platform()
const arch: string = os.arch()

const rootDir: string = process.cwd()

// Determine path to appropriate binary
let binaryPath: string

switch (platform) {
  case "linux":
    binaryPath = path.join(rootDir, `bin/linkcheck/linux/${arch}/linkcheck/linkcheck`)
    break
  case "darwin": // macOS
    binaryPath = path.join(rootDir, `bin/linkcheck/macos/${arch}/linkcheck/linkcheck`)
    break
  case "win32":
    binaryPath = path.join(rootDir, `bin/linkcheck/windows/${arch}/linkcheck/linkcheck.bat`)
    break
  default:
    console.error("Unsupported platform:", platform)
    process.exit(1)
}

// Execute the binary with the arguments

const proc = exec(`${binaryPath} ${args}`)

proc.stdout.on("data", (data) => {
  console.log(data.toString())
})

proc.stderr.on("data", (data) => {
  console.error(data.toString())
})

proc.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Binary exited with code: ${code}`)
  }
  process.exit(code)
})
