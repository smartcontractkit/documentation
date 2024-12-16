import { type ReactNode } from "react"
import styles from "./SolidityParam.module.css"
import { ReactCopyText } from "@components/ReactCopyText"

interface SolidityParamProps {
  name: string
  type: string
  description: string
  example?: string | ReactNode
  children?: ReactNode
}

export const SolidityParam = ({ name, type, description, example, children }: SolidityParamProps) => (
  <div className={styles.parameter}>
    <code className={styles.name}>{name}</code>
    <code className={styles.type}>{type}</code>
    <div className={styles.info}>
      <p className={styles.description}>{description}</p>
      {example && (typeof example === "string" ? <ReactCopyText text={example} code /> : example)}
    </div>
    {children && <div className={styles.parameterContent}>{children}</div>}
  </div>
)
