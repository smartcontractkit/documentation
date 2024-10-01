import { useStore } from "@nanostores/react"
import "./Drawer.css"
import { drawerContentStore } from "./drawerStore"
import { useRef } from "react"

function Drawer() {
  const drawerRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)
  const $drawerContent = useStore(drawerContentStore)

  if (!$drawerContent) return null

  const handleClickOutside = (event) => {
    if (drawerRef.current && drawerContentRef.current && !drawerContentRef.current.contains(event.target as Node)) {
      drawerContentStore.set(null)
    }
  }

  return (
    <div className="drawer" ref={drawerRef} onClick={handleClickOutside}>
      <div className="drawer__close">
        <button id="drawer-exit" onClick={() => drawerContentStore.set(null)}>
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1667 1.33331L1.83337 14.6666M1.83337 1.33331L15.1667 14.6666" stroke="white" />
          </svg>
        </button>
        <label htmlFor="drawer-exit">Esc</label>
      </div>
      <div className="drawer__container" ref={drawerContentRef}>
        <div className="drawer__content">
          {typeof $drawerContent === "function" ? $drawerContent() : $drawerContent}
        </div>
      </div>
    </div>
  )
}

export default Drawer
