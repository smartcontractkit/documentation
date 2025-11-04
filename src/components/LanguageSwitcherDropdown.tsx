import { useState, useEffect, useRef } from "react"
import { selectedLanguage, type SupportedLanguage } from "~/lib/languageStore.js"
import styles from "./LanguageSwitcherDropdown.module.css"

const goLogo = "/images/icons/go_logo_black.png"
const tsLogo = "/images/icons/typescript_logo.png"

const languageConfig = {
  go: { label: "Go", logo: goLogo },
  ts: { label: "TypeScript", logo: tsLogo },
}

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

export function LanguageSwitcherDropdown() {
  const [clientLanguage, setClientLanguage] = useState<SupportedLanguage>(getInitialLanguage)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const setLanguage = (lang: SupportedLanguage) => {
    // Update nanostore
    selectedLanguage.set(lang)
    setIsOpen(false)

    // Dispatch custom event for page-level redirects
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: lang } }))
  }

  const currentConfig = languageConfig[clientLanguage]

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <label className={styles.label} htmlFor="language-selector-trigger">
        SDK Language
      </label>
      <button
        id="language-selector-trigger"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select programming language"
        type="button"
      >
        <img src={currentConfig.logo} alt={currentConfig.label} className={styles.triggerIcon} />
        <span className={styles.triggerText}>{currentConfig.label}</span>
        <svg className={styles.arrow} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuContent}>
            {(Object.entries(languageConfig) as [SupportedLanguage, typeof languageConfig.go][]).map(
              ([lang, config]) => (
                <button
                  key={lang}
                  className={`${styles.option} ${clientLanguage === lang ? styles.selected : ""}`}
                  onClick={() => setLanguage(lang)}
                  type="button"
                >
                  <img src={config.logo} alt={config.label} className={styles.optionIcon} />
                  <span>{config.label}</span>
                  {clientLanguage === lang && (
                    <svg className={styles.checkmark} width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.5 4.5L6 12L2.5 8.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
