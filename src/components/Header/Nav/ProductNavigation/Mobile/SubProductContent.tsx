import { clsx } from "../../utils"
import { BackArrowIcon } from "./BackArrowIcon"
import styles from "./subProductContent.module.css"

type Props = {
  onSubproductClick: () => void
  subProducts?:
    | {
        label: string
        items: { label: string; icon?: string; href: string }[]
      }
    | undefined
}

export const SubProductContent = ({ subProducts, onSubproductClick }: Props) => {
  if (!subProducts) return null
  return (
    <>
      <button className={styles.back} onClick={onSubproductClick}>
        <BackArrowIcon />
        Back
      </button>
      <span
        style={{
          color: "var(--gray-400",
          margin: "var(--space-3x) var(--space-0x)",
        }}
      >
        {subProducts.label}
      </span>
      {subProducts.items.map(({ label, href }) => (
        <a key={label} className={clsx(styles.link, "subproduct-link")} href={href}>
          {label}
        </a>
      ))}
    </>
  )
}
