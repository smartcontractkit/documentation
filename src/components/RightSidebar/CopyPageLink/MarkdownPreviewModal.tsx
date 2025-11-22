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
              {isCopied ? "✓ Copied!" : "Copy"}
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
