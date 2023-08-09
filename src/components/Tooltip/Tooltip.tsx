/** @jsxImportSource preact */
import styles from "./Tooltip.module.css"

export type Props = {
  inline: boolean
  description: string
  children: any
}

const Tooltip = ({ inline, description, children }: Props) => {
  return (
    <span class={inline ? styles.textTooltip : styles.tooltip} tooltip-text={description}>
      {children}
    </span>
  )
}

export default Tooltip
