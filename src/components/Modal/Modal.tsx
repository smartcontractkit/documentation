import React from "react"
import styles from "./Modal.module.css"
import FocusTrap from "focus-trap-react"
import { createPortal } from "react-dom"
import { useKeyPress } from "~/hooks/useKeyPress"
import { clsx } from "~/lib"

export function Modal({
  children,
  isOpen,
  onClose,
  style,
  modalId,
}: {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  style?: Record<string, any>
  modalId?: string
}) {
  useKeyPress("Escape", { onDown: onClose })

  return (
    <>
      {isOpen &&
        createPortal(
          // For some reason the error says that the element doesn't match even though it does
          // and it also works correctly.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <FocusTrap>
            {/*
            For some reason the error says that the element doesn't match even though it does
            and it also works correctly.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            @ts-ignore */}
            <div>
              <div className={styles.overlay} onClick={onClose}></div>
              <div id={modalId} className={clsx(styles.modal)} tabIndex={0} style={style}>
                {children}
              </div>
            </div>
          </FocusTrap>,
          document.body
        )}
    </>
  )
}
