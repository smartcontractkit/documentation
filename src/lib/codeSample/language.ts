export function languageBadge(language: string): string {
  const l = language.toLowerCase()
  if (l === "solidity" || l === "sol") return "SOL"
  if (["javascript", "js", "mjs", "cjs"].includes(l)) return "JS"
  if (["typescript", "ts", "mts", "cts"].includes(l)) return "TS"
  if (["bash", "sh", "shell"].includes(l)) return "SH"
  if (l === "go" || l === "golang") return "GO"
  if (l === "json" || l === "jsonc") return "JSON"
  if (l === "yaml" || l === "yml") return "YAML"
  return l.slice(0, 4).toUpperCase()
}

export function getLanguageIconSrc(language: string): string | undefined {
  const l = language.toLowerCase()
  // Map language names/aliases to icons in `public/images/language-icons/`.
  if (l === "solidity" || l === "sol") return "/images/language-icons/solidity.svg"
  if (["typescript", "ts", "mts", "cts"].includes(l)) return "/images/language-icons/typescript.svg"
  if (["go", "golang"].includes(l)) return "/images/language-icons/go.svg"
  if (["json", "jsonc"].includes(l)) return "/images/language-icons/json.svg"
  if (l === "toml") return "/images/language-icons/toml.svg"
  if (["python", "py"].includes(l)) return "/images/language-icons/python.svg"
  if (["rust", "rs"].includes(l)) return "/images/language-icons/rust.svg"
  if (["bash", "sh", "shell", "zsh", "terminal"].includes(l)) return "/images/language-icons/terminal.svg"
  return undefined
}
