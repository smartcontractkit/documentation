import React, { useCallback, useState, useRef, useMemo, useEffect } from "react"
import styles from "./styles.module.css"
import type { BundledLanguage, SpecialLanguage, LanguageRegistration } from "shiki"

interface LineHighlight {
  lines: number[]
  label: string
  description: string
}

interface SideBySideCodeProps {
  language?: BundledLanguage | SpecialLanguage | LanguageRegistration | string
  codeSrc: string
  children: React.ReactNode
  highlightedCode: string
  title?: string
  highlights?: LineHighlight[]
}

const SideBySideCode: React.FC<SideBySideCodeProps> = ({
  highlightedCode,
  children,
  title,
  language,
  highlights = [],
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null)
  const codeContentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number>()

  // Get language display name
  const languageDisplay = typeof language === "string" ? language : language?.name || "plaintext"

  const handleCopy = useCallback(async () => {
    try {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = highlightedCode
      const plainText = tempDiv.textContent || tempDiv.innerText || ""

      if (!plainText) {
        throw new Error("No text content found to copy")
      }

      await navigator.clipboard.writeText(plainText)
      setIsCopied(true)
      setCopyError(null)

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
      setCopyError("Failed to copy code")

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopyError(null)
      }, 2000)
    }
  }, [highlightedCode])

  const processHighlightedCode = useCallback(() => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = highlightedCode

    // Get all line elements
    const codeLines = Array.from(tempDiv.querySelectorAll(".line"))

    // Get the active highlight's lines
    const activeLines = activeHighlight !== null ? new Set(highlights[activeHighlight].lines) : new Set()

    codeLines.forEach((line, index) => {
      const lineNumber = index + 1
      line.setAttribute("data-line-number", String(lineNumber))

      // Remove existing highlight classes
      line.classList.remove("highlightableLine", "activeHighlight")

      // Only highlight lines from the active highlight
      if (activeLines.has(lineNumber)) {
        line.classList.add("highlightableLine", "activeHighlight")
      }
    })

    return tempDiv.innerHTML
  }, [highlightedCode, highlights, activeHighlight])

  // Memoize the processed code
  const processedCode = useMemo(() => processHighlightedCode(), [processHighlightedCode])

  const scrollToHighlight = useCallback((lines: number[]) => {
    if (!codeContentRef.current) return

    const lineElements = codeContentRef.current.querySelectorAll("span.line")
    const firstLineIndex = lines[0] - 1
    const lineElement = lineElements[firstLineIndex]

    if (lineElement) {
      lineElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  const handleHighlightClick = useCallback(
    (index: number, highlight: LineHighlight) => {
      setActiveHighlight((prev) => {
        const newValue = prev === index ? null : index
        if (newValue !== null) {
          scrollToHighlight(highlight.lines)
        }
        return newValue
      })
    },
    [scrollToHighlight]
  )

  const handleHighlightHover = useCallback((index: number, isEnter: boolean) => {
    setActiveHighlight(isEnter ? index : null)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.codeWrapper}>
        <div className={styles.codeHeader}>
          <div className={styles.headerLeft}>
            {title && <span className={styles.title}>{title}</span>}
            {language && <span className={styles.language}>{languageDisplay}</span>}
          </div>
          <button
            onClick={handleCopy}
            className={`${styles.copyButton} ${copyError ? styles.error : ""} ${isCopied ? styles.success : ""}`}
            aria-label={copyError ? "Failed to copy" : isCopied ? "Copied to clipboard" : "Copy code to clipboard"}
            disabled={isCopied}
          >
            <span aria-hidden="true">{copyError ? "Error" : isCopied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
        <div ref={codeContentRef} className={styles.codeContent} dangerouslySetInnerHTML={{ __html: processedCode }} />
      </div>
      <div className={styles.explanation}>
        {children}
        {highlights.length > 0 && (
          <div className={styles.highlightsList}>
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className={`${styles.highlightItem} ${index === activeHighlight ? styles.active : ""}`}
                onMouseEnter={() => handleHighlightHover(index, true)}
                onMouseLeave={() => handleHighlightHover(index, false)}
                onClick={() => handleHighlightClick(index, highlight)}
              >
                <div className={styles.highlightLabel}>
                  Lines {highlight.lines.join(", ")}: {highlight.label}
                </div>
                <div className={styles.highlightDescription}>{highlight.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SideBySideCode
