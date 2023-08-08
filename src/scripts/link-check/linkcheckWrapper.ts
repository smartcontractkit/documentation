import { spawn } from "child_process"
import os from "os"
import path from "path"
import fs from "fs"

// Capture arguments passed to the script
const args: string[] = process.argv.slice(2)

// Detect OS and architecture
const platform: string = os.platform()
const arch: string = os.arch()

const rootDir: string = process.cwd()

function getBinaryPath(platform: string, arch: string): string | null {
  switch (platform) {
    case "linux":
      return path.join(rootDir, `bin/linkcheck/linux/${arch}/linkcheck/linkcheck`)
    case "darwin": // macOS
      return path.join(rootDir, `bin/linkcheck/macos/${arch}/linkcheck/linkcheck`)
    case "win32":
      return path.join(rootDir, `bin/linkcheck/windows/${arch}/linkcheck/linkcheck.bat`)
    default:
      return null
  }
}

const binaryPath: string | null = getBinaryPath(platform, arch)

if (!binaryPath || !fs.existsSync(binaryPath)) {
  console.error(`Unsupported or missing binary for platform: ${platform} and architecture: ${arch}`)
  process.exit(1)
}

// Execute the binary with the arguments
const proc = spawn(binaryPath, args)

proc.stdout.on("data", (data) => {
  console.log(data.toString())
})

proc.stderr.on("data", (data) => {
  console.error(data.toString())
})

proc.on("error", (error) => {
  console.error("Failed to start the binary:", error)
})

proc.on("exit", (code) => {
  if (code !== 0) {
    console.error(`Binary exited with code: ${code}`)
  }
  process.exit(code ?? 0)
})
