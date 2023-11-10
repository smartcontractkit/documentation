import React from "react"
import { CaretIcon } from "../../CaretIcon"
import { getImageUrl } from "../../utils"
import { Divider } from "../../Divider"
import styles from "./trigger.module.css"

type Props = {
  icon?: string
  label: string
}
export const Trigger = ({ icon, label }: Props) => (
  <div style={{ display: "flex" }}>
    <Divider />
    <span className={styles.trigger}>
      {icon && <img height={20} width={20} src={getImageUrl(`/${icon}-navbar-icon.svg`)} />}
      {label}
      <CaretIcon aria-hidden />
    </span>
  </div>
)
