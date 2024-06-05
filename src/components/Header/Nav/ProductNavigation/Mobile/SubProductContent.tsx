import { clsx } from "../../utils"
import { BackArrowIcon } from "./BackArrowIcon"
import styles from "./subProductContent.module.css"

type Page = {
  label: string
  href: string
}

type Props = {
  onSubproductClick: () => void
  subProducts?: {
    label: string
    items: { label: string; icon?: string; href: string; pages?: Page[] }[]
  }
  currentPath: string
}

export const SubProductContent = ({ subProducts, onSubproductClick, currentPath }: Props) => {
  if (!subProducts) return null

  return (
    <>
      <button key="back" className={styles.back} onClick={onSubproductClick}>
        <BackArrowIcon />
        Back
      </button>
      {subProducts.items.map(({ label, pages }) => (
        <div key={label}>
          <h3 className={styles.section}>{label}</h3>
          {pages?.map(({ label, href }) => {
            const adjustedHref = "/" + href
            const isActive = currentPath.replace(/\/$/, "") === adjustedHref.replace(/\/$/, "")

            const linkStyle = {
              backgroundColor: isActive ? "var(--blue-100)" : "transparent",
              color: isActive ? "var(--blue-600)" : "inherit",
              fontWeight: isActive ? "500" : "normal",
            }

            return (
              <a key={label} style={linkStyle} className={`${styles.link} subproduct-link`} href={adjustedHref}>
                {label}
              </a>
            )
          })}
        </div>
      ))}
    </>
  )
}
