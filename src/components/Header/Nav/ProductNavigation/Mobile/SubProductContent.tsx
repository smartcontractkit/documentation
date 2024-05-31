import { clsx } from "../../utils"
import { BackArrowIcon } from "./BackArrowIcon"
import styles from "./subProductContent.module.css"

type Page = {
  label: string
  href: string
}

type Props = {
  onSubproductClick: () => void
  subProducts?:
    | {
        label: string
        items: { label: string; icon?: string; href: string; pages?: Page[] }[]
      }
    | undefined
}

export const SubProductContent = ({ subProducts, onSubproductClick }: Props) => {
  if (!subProducts) return null
  return (
    <>
      <button key="back" className={styles.back} onClick={onSubproductClick}>
        <BackArrowIcon />
        Back
      </button>
      {subProducts.items.map(({ label, pages }) => (
        <div key={label}>
          <h3 key={label} className={clsx(styles.section)}>
            {label}
          </h3>
          {pages?.map(({ label, href }) => (
            <a key={label} className={clsx(styles.link, "subproduct-link")} href={"/" + href}>
              {label}
            </a>
          ))}
        </div>
      ))}
    </>
  )
}
