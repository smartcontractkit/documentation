import styles from "./ChainSelectorDisplay.module.css"

interface ChainSelectorDisplayProps {
  selector: string
}

export const ChainSelectorDisplay = ({ selector }: ChainSelectorDisplayProps) => {
  const truncateChainSelector = (selector: string) => {
    if (!selector) return ""
    const prefix = selector.slice(0, 4)
    const suffix = selector.slice(-4)
    return `${prefix}...${suffix}`
  }

  return (
    <div className={styles.selectorContainer} data-tooltip={selector}>
      <span className={styles.selectorText}>{truncateChainSelector(selector)}</span>
    </div>
  )
}
