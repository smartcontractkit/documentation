import { useEffect } from "react"
import styles from "./megaMenu.module.css"

interface MegaMenuProps {
  cancel: () => void
  id?: string
  children?: React.ReactNode
}

export default function MegaMenuContainer({ cancel, id, children }: MegaMenuProps) {
  useEffect(() => {
    const onESC = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        cancel()
      }
    }
    window.addEventListener("keyup", onESC, false)
    return () => {
      window.removeEventListener("keyup", onESC, false)
    }
  }, [])
  return (
    <div className={styles.megaMenuContainer} id={id}>
      {children}
    </div>
  )
}
