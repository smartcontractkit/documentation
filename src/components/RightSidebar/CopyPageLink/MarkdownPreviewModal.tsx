/**
 * Modal component for previewing markdown content
 */

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FocusTrap } from "focus-trap-react"
import { useKeyPress } from "~/hooks/useKeyPress.ts"
import { copyToClipboard } from "./contentExtractor.js"
import type { MarkdownPreviewModalProps } from "./types.js"
import styles from "./MarkdownPreviewModal.module.css"

export function MarkdownPreviewModal({ markdown, isOpen, onClose, title }: MarkdownPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  // Use the shared useKeyPress hook for ESC key handling
  useKeyPress("Escape", { onDown: onClose })

  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Focus the modal
    modalRef.current?.focus()

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""

      // Restore focus to the previous element
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  const handleCopyClick = async () => {
    try {
      await copyToClipboard(markdown)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy markdown:", error)
      alert("Failed to copy to clipboard. Please try again.")
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null
  if (typeof document === "undefined") return null // SSR safety

  return createPortal(
    <FocusTrap>
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <div
          ref={modalRef}
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          tabIndex={-1}
        >
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title || "Markdown Preview"}
            </h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close modal" type="button">
              ✕
            </button>
          </div>

          <div className={styles.content}>
            <div id="modal-description" className={styles.srOnly}>
              Preview of extracted markdown content. You can copy this content or close the preview.
            </div>
            <pre className={styles.markdown} data-no-copy-button="true">
              <code>{markdown}</code>
            </pre>
          </div>

          <div className={styles.footer}>
            <button className={styles.copyButton} onClick={handleCopyClick} type="button">
              {isCopied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.5 4.5L6 12L2.5 8.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button className={styles.cancelButton} onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>,
    document.body
  )
}
