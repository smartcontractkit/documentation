import { useState, useEffect } from "react"
import { selectedLanguage, type SupportedLanguage } from "~/lib/languageStore.js"
import styles from "./LanguageSwitcher.module.css"

const goLogo = "/images/icons/go_logo_black.png"
const tsLogo = "/images/icons/typescript_logo.png"

// Initialize language from localStorage immediately to prevent flash of wrong language
function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "go"

  try {
    const stored = localStorage.getItem("docs-language-preference")
    if (!stored) return "go"
    return stored === "ts" || stored === '"ts"' ? "ts" : "go"
  } catch {
    return "go"
  }
}

export function LanguageSwitcher() {
  const [clientLanguage, setClientLanguage] = useState<SupportedLanguage>(getInitialLanguage)

  useEffect(() => {
    // Sync with the store on mount
    const unsubscribe = selectedLanguage.subscribe((lang) => {
      setClientLanguage(lang)
      // Update the class on the html element for CSS to react
      document.documentElement.classList.remove("lang-go", "lang-ts")
      document.documentElement.classList.add(`lang-${lang}`)
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

  const setLanguage = (lang: SupportedLanguage) => {
    // Update nanostore
    selectedLanguage.set(lang)

    // Emit custom event so page scripts can react
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }))
  }

  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.button} ${clientLanguage === "go" ? styles.active : ""}`}
        onClick={() => setLanguage("go")}
        aria-pressed={clientLanguage === "go"}
        data-lang="go"
      >
        <img src={goLogo} alt="Go" className={styles.icon} />
        Go
      </button>
      <button
        className={`${styles.button} ${clientLanguage === "ts" ? styles.active : ""}`}
        onClick={() => setLanguage("ts")}
        aria-pressed={clientLanguage === "ts"}
        data-lang="ts"
      >
        <img src={tsLogo} alt="TypeScript" className={styles.icon} />
        TypeScript
      </button>
    </div>
  )
}
