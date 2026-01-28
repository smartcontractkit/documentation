import { persistentAtom } from "@nanostores/persistent"

export type SupportedLanguage = "go" | "ts"

// Store with localStorage persistence
export const selectedLanguage = persistentAtom<SupportedLanguage>(
  "docs-language-preference",
  "ts" // default value
)
