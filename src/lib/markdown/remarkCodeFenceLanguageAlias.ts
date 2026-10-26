import { visit } from "unist-util-visit"

/**
 * Prism has no grammar for some of the fence languages we author with, so
 * `@astrojs/prism` logs "Language does not exist: <lang>" on every page that
 * contains one. Remap those fences onto the closest grammar Prism does ship.
 *
 * This only changes the value handed to the highlighter. It must run *after*
 * `remarkCodeFenceFilename`, which reads the original `lang` for the code-sample
 * header badge and the `data-language` attribute — so an `env` fence keeps its
 * "ENV" badge while being highlighted with Prism's `ini` grammar.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  // `.env` files are `#` comments plus `KEY=value`, which `ini` tokenizes exactly.
  env: "ini",
}

export default function remarkCodeFenceLanguageAlias() {
  return (tree: unknown) => {
    visit(tree as any, "code", (node: any) => {
      const lang = typeof node?.lang === "string" ? node.lang.trim().toLowerCase() : ""
      if (!lang) return

      const alias = LANGUAGE_ALIASES[lang]
      if (alias) node.lang = alias
    })
  }
}
