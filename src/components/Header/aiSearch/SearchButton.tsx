import { clsx } from "~/lib"
import styles from "./searchButton.module.css"
import { useEffect, useState } from "react"
import SearchIcon from "../../QuickLinks/assets/search-icon.svg"

export const SearchButton = () => {
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    const checkIsMac = typeof navigator !== "undefined" ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0 : false
    setIsMac(checkIsMac)
  }, [])

  return (
    <>
      <button className={clsx(styles.default, "search-widget-trigger")}>
        <img src="/assets/icons/magnifier.svg" alt="Search" />
        <div>{isMac ? "⌘" : "Ctrl+"}K</div>
      </button>
      <button className={clsx(styles.mobile, "search-widget-trigger")}>
        <img src={SearchIcon.src} alt="Search" />
      </button>
    </>
  )
}
