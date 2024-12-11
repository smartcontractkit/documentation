import styles from "./ContractAddressDisplay.module.css"

interface ContractAddressDisplayProps {
  address: string
}

export const ContractAddressDisplay = ({ address }: ContractAddressDisplayProps) => {
  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className={styles.addressContainer} data-tooltip={address}>
      <span className={styles.addressText}>{truncateAddress(address)}</span>
    </div>
  )
}
