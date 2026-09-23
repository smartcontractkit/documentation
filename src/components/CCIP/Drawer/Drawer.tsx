import { useStore } from "@nanostores/react"
import "./Drawer.css"
import { drawerContentStore, drawerWidthStore, DrawerWidth } from "./drawerStore.ts"
import { useRef, useEffect, useState } from "react"
import { clsx } from "~/lib/clsx/clsx.ts"
import type { ReactNode } from "react"

function Drawer() {
  const drawerRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)
  const $drawerContent = useStore(drawerContentStore) as (() => ReactNode) | ReactNode | null
  const $drawerWidth = useStore(drawerWidthStore)
  const [isOpened, setIsOpened] = useState(false)

  // exit when press esc
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    if ($drawerContent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    if ($drawerContent) {
      setIsOpened(true)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [$drawerContent])

  if (!$drawerContent) return null

  const handleClickOutside = (event) => {
    if (drawerRef.current && drawerContentRef.current && !drawerContentRef.current.contains(event.target as Node)) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpened(false)

    // Use transitionend event instead of setTimeout for better performance
    const handleTransitionEnd = () => {
      drawerContentStore.set(null)
      drawerWidthStore.set(DrawerWidth.Default)
      drawerRef.current?.removeEventListener("transitionend", handleTransitionEnd)
    }

    // Listen for the transition to complete
    drawerRef.current?.addEventListener("transitionend", handleTransitionEnd)
  }

  return (
    <div
      className={clsx("drawer", {
        drawer__open: isOpened,
      })}
      ref={drawerRef}
      onClick={handleClickOutside}
    >
      <div
        className={clsx("drawer__container", {
          "drawer__container--wide": $drawerWidth === DrawerWidth.Wide,
        })}
        ref={drawerContentRef}
      >
        <div className="drawer__close">
          <button id="drawer-exit" onClick={handleClose} aria-label="Close drawer">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1667 1.33331L1.83337 14.6666M1.83337 1.33331L15.1667 14.6666" stroke="white" />
            </svg>
          </button>
          <label htmlFor="drawer-exit">Esc</label>
        </div>
        <div className="drawer__content">
          <button onClick={handleClose} className="drawer__closeMobile" aria-label="Close drawer">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.1667 1.33331L1.83337 14.6666M1.83337 1.33331L15.1667 14.6666" stroke="#000000" />
            </svg>
          </button>

          <div>{typeof $drawerContent === "function" ? $drawerContent() : $drawerContent}</div>
        </div>
      </div>
    </div>
  )
}

export default Drawer
