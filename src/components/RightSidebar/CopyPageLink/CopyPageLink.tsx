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

          window.open(chatgptUrl, "_blank", "noopener,noreferrer")
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

          window.open(claudeUrl, "_blank", "noopener,noreferrer")
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
        <label className={styles.label} htmlFor="copy-page-trigger">
          Copy Page
        </label>
        <button
          id="copy-page-trigger"
          ref={buttonRef}
          className={styles.trigger}
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label="Copy page content options"
          type="button"
        >
          <svg
            className={styles.triggerIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V7C20 6.46957 19.7893 5.96086 19.4142 5.58579C19.0391 5.21071 18.5304 5 18 5H16M8 5C8 5.53043 8.21071 6.03914 8.58579 6.41421C8.96086 6.78929 9.46957 7 10 7H14C14.5304 7 15.0391 6.78929 15.4142 6.41421C15.7893 6.03914 16 5.53043 16 5M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.triggerText}>{copiedAction === "copy" ? "Copied!" : "Copy page"}</span>
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

        {isDropdownOpen && (
          <div ref={dropdownRef} className={styles.dropdown} role="menu">
            <div className={styles.dropdownContent}>
              <button
                className={styles.dropdownItem}
                onClick={() => handleAction("copy")}
                role="menuitem"
                type="button"
              >
                <svg
                  className={styles.itemIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Copy page</div>
                  <div className={styles.itemDescription}>Copy the page as MarkDown for LLMs</div>
                </div>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => handleAction("preview")}
                role="menuitem"
                type="button"
              >
                <svg
                  className={styles.itemIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.45801 12C3.73201 7.943 7.52301 5 12.001 5C16.479 5 20.268 7.943 21.542 12C20.268 16.057 16.479 19 12.001 19C7.52301 19 3.73201 16.057 2.45801 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>View as MarkDown</div>
                  <div className={styles.itemDescription}>View this page as plain text</div>
                </div>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => handleAction("chatgpt")}
                role="menuitem"
                type="button"
              >
                <svg
                  className={styles.itemIcon}
                  width="20"
                  height="20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="1.5"
                  viewBox="-0.17090198558635983 0.482230148717937 41.14235318283891 40.0339509076386"
                  aria-hidden="true"
                >
                  <path
                    d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18z"
                    fill="currentColor"
                  />
                </svg>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Open in ChatGPT</div>
                  <div className={styles.itemDescription}>Ask questions about this page</div>
                </div>
              </button>

              <button
                className={styles.dropdownItem}
                onClick={() => handleAction("claude")}
                role="menuitem"
                type="button"
              >
                <svg
                  className={styles.itemIcon}
                  width="20"
                  height="20"
                  fill="currentColor"
                  fillRule="evenodd"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                </svg>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>Open in Claude</div>
                  <div className={styles.itemDescription}>Ask questions about this page</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      <MarkdownPreviewModal markdown={extractedMarkdown} isOpen={isModalOpen} onClose={closeModal} title={pageTitle} />
    </>
  )
}
