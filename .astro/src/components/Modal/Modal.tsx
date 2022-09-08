import React from "react"
import styles from "./Modal.module.css"
import FocusTrap from "focus-trap-react"
import { createPortal } from "react-dom"
import { useKeyPress } from "~/hooks/useKeyPress"
import { useEffect } from "preact/hooks"

export function Modal({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}) {
  useKeyPress("Escape", { onDown: onClose })

  return (
    <>
      {isOpen &&
        createPortal(
          <FocusTrap>
            <div>
              <div className={styles.overlay} onClick={onClose}></div>
              <div className={styles.modal} tabIndex={0}>
                {children}
              </div>
            </div>
          </FocusTrap>,
          document.body
        )}
    </>
  )
}
