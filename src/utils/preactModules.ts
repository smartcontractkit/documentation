import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

type Framework = "preact" | "react"

const PREACT_PRAGMA = /@jsxImportSource\s+preact\b/
const RE_EXPORT = /export\s+(?:\*|\{[^}]*\})\s+from\s+["'](\.{1,2}\/[^"']+)["']/g
const SOURCE_FILE = /\.(?:[jt]sx?)$/
const CANDIDATE_EXTENSIONS = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts", "/index.js"]

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : listFiles(full)
    return SOURCE_FILE.test(entry.name) && !entry.name.endsWith(".d.ts") ? [full] : []
  })
}

/** Resolves a relative re-export to a source file. `./Foo.js` may point to `./Foo.tsx` (TypeScript convention). */
function resolveRelative(fromFile: string, specifier: string): string | undefined {
  const base = path.resolve(path.dirname(fromFile), specifier.replace(/\.jsx?$/, ""))
  const withOriginal = path.resolve(path.dirname(fromFile), specifier)
  for (const candidate of [withOriginal, ...CANDIDATE_EXTENSIONS.map((ext) => base + ext)]) {
    try {
      if (SOURCE_FILE.test(candidate) && statSync(candidate).isFile()) return candidate
    } catch {
      // try the next candidate
    }
  }
  return undefined
}

/** Path aliases from tsconfig `compilerOptions.paths`, e.g. `@components/*` -> `<root>/src/components`. */
function readPathAliases(rootDir: string): { alias: string; target: string; wildcard: boolean }[] {
  const raw = readFileSync(path.join(rootDir, "tsconfig.json"), "utf8")
  // Strip comments outside of strings, then trailing commas (tsconfig is JSONC)
  const json = raw
    .replace(/("(?:\\.|[^"\\])*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, (match, str) => str ?? "")
    .replace(/,(\s*[}\]])/g, "$1")
  const { baseUrl = ".", paths = {} } = JSON.parse(json).compilerOptions ?? {}
  return Object.entries(paths as Record<string, string[]>).map(([key, [target]]) => {
    const wildcard = key.endsWith("/*")
    const resolved = path.resolve(rootDir, baseUrl, wildcard ? target.slice(0, -2) : target)
    return { alias: wildcard ? key.slice(0, -2) : key, target: stripIndex(stripExtension(resolved)), wildcard }
  })
}

const stripExtension = (file: string) => file.replace(/\.(?:[jt]sx?)$/, "").replace(/\/$/, "")
const stripIndex = (stem: string) => (path.basename(stem) === "index" ? path.dirname(stem) : stem)
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/**
 * Builds a matcher for every Preact module of the project, for the `include`/`exclude` options of
 * @astrojs/preact and @astrojs/react.
 *
 * Preact and React components live side by side: a file opts into Preact with a `@jsxImportSource preact`
 * pragma, everything else is React. Both integrations use `include`/`exclude` for two things:
 * - picking the JSX transform, matched on the absolute file path;
 * - picking the server renderer of hydrated islands (`client:*`), matched on the island's import path as
 *   written: absolute without extension for relative imports, or the raw alias (`~/…`, `@components/Tabs`).
 * An island imported through a barrel is matched on the barrel, so barrels that only re-export Preact
 * components count as Preact modules. Barrels that mix both frameworks are left to React: import Preact
 * islands from their own file there.
 *
 * @param rootDir - Project root (absolute), containing `src/` and `tsconfig.json`
 * @returns A RegExp matching every spelling of each Preact module (optionally with a query string)
 */
export function preactModulesMatcher(rootDir: string): RegExp {
  const files = listFiles(path.join(rootDir, "src"))
  const frameworksByFile = new Map<string, Set<Framework>>()
  const frameworksOf = (file: string): Set<Framework> => {
    const known = frameworksByFile.get(file)
    if (known) return known
    const frameworks = new Set<Framework>()
    frameworksByFile.set(file, frameworks) // set before recursing, so re-export cycles terminate
    const code = readFileSync(file, "utf8")
    if (/\.[jt]sx$/.test(file)) {
      frameworks.add(PREACT_PRAGMA.test(code) ? "preact" : "react")
    } else {
      for (const [, specifier] of code.matchAll(RE_EXPORT)) {
        const target = resolveRelative(file, specifier)
        if (target) frameworksOf(target).forEach((framework) => frameworks.add(framework))
      }
    }
    return frameworks
  }
  const preactFiles = files.filter((file) => {
    const frameworks = frameworksOf(file)
    return frameworks.size === 1 && frameworks.has("preact")
  })

  const aliases = readPathAliases(rootDir)
  const alternatives = new Set<string>()
  for (const file of preactFiles) {
    const stem = stripExtension(file)
    // A module can be written with or without its extension; a barrel (`dir/index`) also as its directory
    const spellings = [{ id: stem, extension: true }]
    if (path.basename(stem) === "index") spellings.push({ id: path.dirname(stem), extension: false })
    for (const { id, extension } of spellings) {
      const suffix = extension ? "(?:\\.[jt]sx?)?" : ""
      alternatives.add(escapeRegExp(id) + suffix)
      for (const { alias, target, wildcard } of aliases) {
        if (wildcard && id.startsWith(target + "/"))
          alternatives.add(escapeRegExp(alias + id.slice(target.length)) + suffix)
        if (!wildcard && id === target) alternatives.add(escapeRegExp(alias))
      }
    }
  }
  return new RegExp(`^(?:${[...alternatives].join("|")})(?:\\?.*)?$`)
}
