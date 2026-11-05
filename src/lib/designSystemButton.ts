import styles from "@chainlink/design-system/button.module.css"

// The deprecated design-system button module hardcodes white. These global class names let
// dark.css restyle it. Import this instead of the module directly.
const button: Record<string, string> = {
  ...styles,
  primary: `${styles.primary} ds-button-primary`,
  secondary: `${styles.secondary} ds-button-secondary`,
}

export default button
