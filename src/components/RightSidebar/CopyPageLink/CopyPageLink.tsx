/**
 * Copy Page Link component for the MoreMenu
 * Provides multiple actions for copying page content as markdown
 */

import { useState, useRef, useEffect } from "react"
import { extractPageContent, copyToClipboard } from "./contentExtractor.js"
import { MarkdownPreviewModal } from "./MarkdownPreviewModal.js"
import type { CopyPageLinkProps, CopyAction } from "./types.js"
import styles from "./CopyPageLink.module.css"

export function CopyPageLink({ className }: CopyPageLinkProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [extractedMarkdown, setExtractedMarkdown] = useState("")
  const [pageTitle, setPageTitle] = useState("")
  const [copiedAction, setCopiedAction] = useState<CopyAction | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  // Close dropdown on ESC
  useEffect(() => {
    if (!isDropdownOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isDropdownOpen])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleAction = async (action: CopyAction) => {
    setIsDropdownOpen(false)

    try {
      // Try to fetch from API first (high quality markdown)
      let markdown: string
      let title: string

      try {
        const currentPath = window.location.pathname
        const response = await fetch(`/api/page-markdown?path=${encodeURIComponent(currentPath)}`)

        if (response.ok) {
          markdown = await response.text()
          // Extract title from markdown (first line after frontmatter)
          const titleMatch = markdown.match(/^# (.+)$/m)
          title = titleMatch ? titleMatch[1] : document.title
        } else {
          throw new Error("API fetch failed")
        }
      } catch (apiError) {
        // Fallback to client-side extraction
        console.warn("API fetch failed, falling back to client-side extraction:", apiError)
        const content = extractPageContent()

        if (!content) {
          alert("Failed to extract page content. Please try again.")
          return
        }

        markdown = content.markdown
        title = content.title
      }

      setExtractedMarkdown(markdown)
      setPageTitle(title)

      switch (action) {
        case "copy":
          await copyToClipboard(markdown)
          showCopyFeedback("copy")
          break

        case "preview":
          setIsModalOpen(true)
          break

        case "chatgpt": {
          // Copy markdown to clipboard first
          await copyToClipboard(markdown)

          // Create instruction prompt for ChatGPT
          const pageUrl = window.location.href
          const instructionPrompt = `I'm analyzing a Chainlink documentation page: ${pageUrl}

I have the full page content on my clipboard as plain text (Markdown).
The Chainlink docs site already copied it for me.

Please ask me to paste it now. After I paste, please:
- Explain the contents clearly
- Answer any questions I have about Chainlink
- Help me understand how to implement the features described`

          const chatgptUrl = `https://chatgpt.com/?prompt=${encodeURIComponent(instructionPrompt)}`

          if (
            confirm(
              "✓ Page content copied to clipboard!\n\nChatGPT will open and ask you to paste it. Just press Ctrl+V (or Cmd+V on Mac).\n\nContinue?"
            )
          ) {
            window.open(chatgptUrl, "_blank", "noopener,noreferrer")
          }
          break
        }

        case "claude": {
          // Copy markdown to clipboard first
          await copyToClipboard(markdown)

          // Create instruction prompt for Claude
          const pageUrl = window.location.href
          const instructionPrompt = `I'm analyzing a Chainlink documentation page: ${pageUrl}

I have the full page content on my clipboard as plain text (Markdown).
The Chainlink docs site already copied it for me.

Please ask me to paste it now. After I paste, please:
- Explain the contents clearly
- Answer any questions I have about Chainlink
- Help me understand how to implement the features described`

          const claudeUrl = `https://claude.ai/new?q=${encodeURIComponent(instructionPrompt)}`

          if (
            confirm(
              "✓ Page content copied to clipboard!\n\nClaude will open and ask you to paste it. Just press Ctrl+V (or Cmd+V on Mac).\n\nContinue?"
            )
          ) {
            window.open(claudeUrl, "_blank", "noopener,noreferrer")
          }
          break
        }
      }
    } catch (error) {
      console.error(`Error handling action ${action}:`, error)
      alert(`Failed to ${action} page content. Please try again.`)
    }
  }

  const showCopyFeedback = (action: CopyAction) => {
    setCopiedAction(action)
    setTimeout(() => setCopiedAction(null), 2000)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className={`${styles.container} ${className || ""}`}>
        <button
          ref={buttonRef}
          className={styles.trigger}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M13.5 2H6.5C5.67 2 5 2.67 5 3.5V10.5C5 11.33 5.67 12 6.5 12H13.5C14.33 12 15 11.33 15 10.5V3.5C15 2.67 14.33 2 13.5 2ZM13.5 10.5H6.5V3.5H13.5V10.5ZM2.5 5H4V6.5H2.5V13.5H9.5V12H11V13.5C11 14.33 10.33 15 9.5 15H2.5C1.67 15 1 14.33 1 13.5V6.5C1 5.67 1.67 5 2.5 5Z"
              fill="currentColor"
            />
          </svg>
          <span>{copiedAction === "copy" ? "Copied!" : "Copy page content"}</span>
        </button>

        {isDropdownOpen && (
          <div ref={dropdownRef} className={styles.dropdown} role="menu">
            <button
              className={`${styles.dropdownItem} ${styles.dropdownItemPrimary}`}
              onClick={() => handleAction("copy")}
              role="menuitem"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M13.5 2H6.5C5.67 2 5 2.67 5 3.5V10.5C5 11.33 5.67 12 6.5 12H13.5C14.33 12 15 11.33 15 10.5V3.5C15 2.67 14.33 2 13.5 2Z"
                  fill="currentColor"
                />
              </svg>
              Copy to clipboard
            </button>

            <button
              className={styles.dropdownItem}
              onClick={() => handleAction("preview")}
              role="menuitem"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8 3C4.5 3 1.5 5.5 0 8.5C1.5 11.5 4.5 14 8 14C11.5 14 14.5 11.5 16 8.5C14.5 5.5 11.5 3 8 3ZM8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12ZM8 7.5C7.17 7.5 6.5 8.17 6.5 9C6.5 9.83 7.17 10.5 8 10.5C8.83 10.5 9.5 9.83 9.5 9C9.5 8.17 8.83 7.5 8 7.5Z"
                  fill="currentColor"
                />
              </svg>
              Preview markdown
            </button>

            <hr className={styles.dropdownSeparator} role="separator" aria-hidden="true" />

            <button
              className={styles.dropdownItem}
              onClick={() => handleAction("chatgpt")}
              role="menuitem"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 8C2 5.8 3.8 4 6 4H10C12.2 4 14 5.8 14 8C14 10.2 12.2 12 10 12H8L5 14V12C3.3 12 2 10.7 2 9V8Z"
                  fill="currentColor"
                />
              </svg>
              Open in ChatGPT
            </button>

            <button
              className={styles.dropdownItem}
              onClick={() => handleAction("claude")}
              role="menuitem"
              type="button"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8 1L9.5 4.5L13 6L9.5 7.5L8 11L6.5 7.5L3 6L6.5 4.5L8 1ZM11 9L11.8 11.2L14 12L11.8 12.8L11 15L10.2 12.8L8 12L10.2 11.2L11 9Z"
                  fill="currentColor"
                />
              </svg>
              Open in Claude
            </button>
          </div>
        )}
      </div>

      <MarkdownPreviewModal markdown={extractedMarkdown} isOpen={isModalOpen} onClose={closeModal} title={pageTitle} />
    </>
  )
}
