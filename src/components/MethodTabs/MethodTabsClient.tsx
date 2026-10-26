/** @jsxImportSource preact */
import type { ComponentChild } from "preact"
import { useRef, useEffect } from "preact/hooks"
import { useTabState } from "../Tabs/useTabState.ts"
import styles from "./MethodTabs.module.css"
import { clsx } from "~/lib/clsx/clsx.ts"

const UIIcon = () => (
  <span className={styles.tabIcon}>
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="12" height="9" rx="1.5" />
      <line x1="5.5" y1="14" x2="10.5" y2="14" />
      <line x1="8" y1="12" x2="8" y2="14" />
    </svg>
  </span>
)

const APIIcon = () => (
  <span className={styles.tabIcon}>
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4,12 1,8 4,4" />
      <polyline points="12,4 15,8 12,12" />
      <line x1="10" y1="3" x2="6" y2="13" />
    </svg>
  </span>
)

type Props = {
  "panel.ui"?: ComponentChild
  "panel.api"?: ComponentChild
}

function switchMethodTab(newTab: string, anchorEl: HTMLElement) {
  const topBefore = anchorEl.getBoundingClientRect().top

  document.documentElement.dataset.methodTab = newTab

  const topAfter = anchorEl.getBoundingClientRect().top

  const delta = topAfter - topBefore
  if (delta !== 0) {
    window.scrollBy(0, delta)
  }
}

export function MethodTabsClient(props: Props) {
  const [curr, setCurr] = useTabState("api", "methodPreference")
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.methodTab ??= curr
  }, [])

  const handleSwitch = (tab: "ui" | "api") => {
    if (tab === curr) return
    switchMethodTab(tab, wrapperRef.current!)
    setCurr(tab)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={styles.tabBar} role="tablist">
        <button
          role="tab"
          type="button"
          aria-selected={curr === "ui"}
          tabIndex={curr === "ui" ? 0 : -1}
          className={clsx(styles.tab, curr === "ui" && styles.tabActive)}
          onClick={() => handleSwitch("ui")}
        >
          <UIIcon />
          Platform UI
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={curr === "api"}
          tabIndex={curr === "api" ? 0 : -1}
          className={clsx(styles.tab, curr === "api" && styles.tabActive)}
          onClick={() => handleSwitch("api")}
        >
          <APIIcon />
          API
        </button>
      </div>

      <div className={styles.panelContainer}>
        <div role="tabpanel" aria-label="Platform UI" className={styles.panelUI}>
          {props["panel.ui"]}
        </div>
        <div role="tabpanel" aria-label="API" className={styles.panelAPI}>
          {props["panel.api"]}
        </div>
      </div>
    </div>
  )
}
