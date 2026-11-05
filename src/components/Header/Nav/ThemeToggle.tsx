import { useEffect, useState } from "react"
import styles from "./themeToggle.module.css"

// Keep in sync with the inline theme script in src/layouts/BaseLayout.astro.
const STORAGE_KEY = "docs-theme"

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = () => {
    const root = document.documentElement
    const next = !root.classList.contains("dark")

    // Disable transitions during the switch so components don't fade out of sync (next-themes'
    // disableTransitionOnChange). The toggle icons are exempt so they can animate.
    const applyTheme = () => {
      const noTransitions = document.createElement("style")
      noTransitions.textContent = "*:not([data-theme-icon]),*::before,*::after{transition:none!important}"
      document.head.appendChild(noTransitions)
      root.classList.toggle("dark", next)
      // Flush styles while transitions are off
      window.getComputedStyle(document.body).getPropertyValue("color")
      requestAnimationFrame(() => noTransitions.remove())
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      applyTheme()
    } else {
      root.classList.add("theme-transition")
      document.startViewTransition(applyTheme).finished.finally(() => root.classList.remove("theme-transition"))
    }

    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light")
    } catch (e) {
      // localStorage unavailable
    }
    setIsDark(next)
  }

  // Wait for the theme so the icon doesn't flip after hydration
  if (isDark === null) return <span className={styles.placeholder} />

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg
        data-theme-icon
        className={`${styles.icon} ${isDark ? styles.iconHidden : ""}`}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        data-theme-icon
        className={`${styles.icon} ${isDark ? "" : styles.iconHidden}`}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}
