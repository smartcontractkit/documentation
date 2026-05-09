import { useState, useEffect } from "react"
import { selectedLanguage, type SupportedLanguage } from "~/lib/languageStore.js"
import { SidebarDropdown, type DropdownItem } from "./SidebarDropdown/index.js"

const goLogo = "/images/icons/go_logo_black.png"
const tsLogo = "/images/icons/typescript_logo.png"

const languageConfig = {
  go: { label: "Go", logo: goLogo },
  ts: { label: "TypeScript", logo: tsLogo },
}

// Initialize language from localStorage immediately to prevent flash of wrong language
function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "ts"

  try {
    const stored = localStorage.getItem("docs-language-preference")
    if (!stored) return "ts"
    return stored === "go" || stored === '"go"' ? "go" : "ts"
  } catch {
    return "ts"
  }
}

// Convert language config to dropdown items format
const languageItems: DropdownItem[] = [
  { id: "go", label: "Go", icon: goLogo },
  { id: "ts", label: "TypeScript", icon: tsLogo },
]

export function LanguageSwitcherDropdown() {
  const [clientLanguage, setClientLanguage] = useState<SupportedLanguage>(getInitialLanguage)

  // After component mounts on client, sync with the store
  useEffect(() => {
    // Subscribe to nanostore changes
    const unsubscribe = selectedLanguage.subscribe((newLang) => {
      setClientLanguage(newLang)
      // Update HTML class for any CSS-based switching
      document.documentElement.classList.remove("lang-go", "lang-ts")
      document.documentElement.classList.add(`lang-${newLang}`)
    })

    // Set initial state from store
    const initialLang = selectedLanguage.get()
    setClientLanguage(initialLang)
    document.documentElement.classList.remove("lang-go", "lang-ts")
    document.documentElement.classList.add(`lang-${initialLang}`)

    // Listen for languageChanged events from other components (like CodeHighlightBlockMulti)
    const handleLanguageChanged = (event: CustomEvent) => {
      const newLang = event.detail.language as SupportedLanguage
      // Update nanostore to sync all components
      selectedLanguage.set(newLang)
    }
    window.addEventListener("languageChanged", handleLanguageChanged as EventListener)

    return () => {
      unsubscribe()
      window.removeEventListener("languageChanged", handleLanguageChanged as EventListener)
    }
  }, [])

  const handleSelect = (lang: string) => {
    const newLang = lang as SupportedLanguage
    // Update nanostore
    selectedLanguage.set(newLang)

    // Dispatch custom event for page-level redirects
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: newLang } }))
  }

  return (
    <SidebarDropdown
      label="SDK Language"
      items={languageItems}
      selectedId={clientLanguage}
      onSelect={handleSelect}
      triggerId="language-selector-trigger"
      ariaLabel="Select programming language"
    />
  )
}
