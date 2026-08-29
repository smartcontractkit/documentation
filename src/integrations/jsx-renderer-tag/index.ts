/**
 * This site mixes React and Preact components (each file opts into one via a
 * `/** @jsxImportSource preact *\/` pragma, defaulting to React otherwise, per
 * tsconfig's `jsxImportSource`), and many of them are re-exported through
 * shared barrel files (e.g. `@components`, `@components/Tabs`) so the same
 * import specifier can resolve to components of either framework.
 *
 * Astro decides which renderer (@astrojs/react vs @astrojs/preact) owns a
 * given component at SSR time. Since @astrojs/preact@5 / @astrojs/react@5,
 * that decision is gated by the integration's `include`/`exclude` option
 * matching the component's *import specifier* — which can't disambiguate
 * barrel imports, since multiple components of different frameworks can share
 * the exact same specifier string.
 *
 * Astro has a lower-level, content-based escape hatch for this: tagging a
 * component's exported value with `Symbol.for("astro:renderer")` makes Astro
 * use that renderer directly, skipping the broken specifier-matching path
 * entirely (see astro's `renderFrameworkComponent`). This plugin does that
 * tagging automatically for every component export, based on the file's own
 * pragma, so it works regardless of how the component is later imported.
 */

import { readFileSync } from "node:fs"
import { init, parse } from "es-module-lexer"
import type { AstroIntegration } from "astro"
import type { Plugin } from "vite"

const JSX_IMPORT_SOURCE_RE = /@jsxImportSource\s+(\S+)/
const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/

const RENDERER_BY_JSX_SOURCE: Record<string, string> = {
  preact: "@astrojs/preact",
  react: "@astrojs/react",
}

let lexerReady: Promise<void> | undefined

function jsxRendererTagVitePlugin(): Plugin {
  return {
    name: "jsx-renderer-tag",
    enforce: "post",
    async transform(code, rawId) {
      const id = rawId.split("?")[0]
      if (!/\.[jt]sx$/.test(id) || id.includes("/node_modules/")) {
        return null
      }

      let source: string
      try {
        source = readFileSync(id, "utf-8")
      } catch {
        return null
      }

      // Defaults to react to match tsconfig's project-wide `jsxImportSource`.
      const match = source.match(JSX_IMPORT_SOURCE_RE)
      const jsxSource = match ? match[1] : "react"
      const rendererName = RENDERER_BY_JSX_SOURCE[jsxSource]
      if (!rendererName) return null

      lexerReady ??= init
      await lexerReady

      let exportsList
      try {
        ;[, exportsList] = parse(code)
      } catch {
        return null
      }

      const localNames = new Set<string>()
      for (const exp of exportsList) {
        let localName = exp.ln
        if (!localName && exp.n === "default") {
          // `export default <identifier>;` — es-module-lexer's `s`/`e` span the
          // `default` keyword itself here (not the referenced identifier), so
          // pull the identifier from the statement text instead.
          const stmt = code.slice(exp.ss)
          const identMatch = stmt.match(/^export\s+default\s+([A-Za-z_$][A-Za-z0-9_$]*)(?![A-Za-z0-9_$])/)
          if (identMatch) localName = identMatch[1]
        }
        if (localName && IDENTIFIER_RE.test(localName)) {
          localNames.add(localName)
        }
      }
      if (localNames.size === 0) return null

      const tagLines = [...localNames]
        .map(
          (name) =>
            `try { if (${name} && (typeof ${name} === "function" || typeof ${name} === "object")) { ${name}[Symbol.for("astro:renderer")] = ${JSON.stringify(rendererName)}; } } catch {}`
        )
        .join("\n")

      return {
        code: `${code}\n${tagLines}\n`,
        map: null,
      }
    },
  }
}

export default function jsxRendererTag(): AstroIntegration {
  return {
    name: "jsx-renderer-tag",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [jsxRendererTagVitePlugin()],
          },
        })
      },
    },
  }
}
