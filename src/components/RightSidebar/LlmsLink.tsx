import { useStore } from "@nanostores/react"
import { selectedLanguage } from "~/lib/languageStore.js"
import styles from "./LlmsLink.module.css"

interface LlmsLinkProps {
  section: string
  supportedLanguages: string[]
  currentPageLanguage?: string | null
}

export function LlmsLink({ section, supportedLanguages, currentPageLanguage }: LlmsLinkProps) {
  // Subscribe to the language store for reactive updates
  const storeLanguage = useStore(selectedLanguage)

  // Determine which language to use for the link
  const effectiveLanguage = currentPageLanguage || storeLanguage

  // Generate the appropriate link
  const hasLanguages = supportedLanguages.length > 0
  let llmsHref = ""
  let llmsLabel = "View as plain text for LLMs"

  if (hasLanguages) {
    // Language-specific section (like CRE)
    const langToUse =
      effectiveLanguage && supportedLanguages.includes(effectiveLanguage) ? effectiveLanguage : supportedLanguages[0]
    llmsHref = `/${section}/llms-full-${langToUse}.txt`
    llmsLabel = `View ${langToUse.toUpperCase()} docs for LLMs`
  } else {
    // Single file section
    llmsHref = `/${section}/llms-full.txt`
  }

  return (
    <li className={styles.headerLink}>
      <a href={llmsHref} target="_blank" className={styles.llmsLink}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.06 2.06L13 0L13.94 2.06L16 3L13.94 3.94L13 6L12.06 3.94L10 3L12.06 2.06ZM4.47 7.47L6.5 3L8.53 7.47L13 9.5L8.53 11.53L6.5 16L4.47 11.53L0 9.5L4.47 7.47Z"
            fill="#0847F7"
          />
        </svg>
        <p>{llmsLabel}</p>
      </a>
    </li>
  )
}
