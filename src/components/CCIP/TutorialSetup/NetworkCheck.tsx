import styles from "./NetworkCheck.module.css"

interface NetworkCheckProps {
  network: {
    name: string
    logo?: string
  }
}

export const NetworkCheck = ({ network }: NetworkCheckProps) => (
  <div className={styles.networkCheck}>
    {network?.logo && <img src={network.logo} alt={network.name} width={24} height={24} />}
    <span>
      Ensure MetaMask is connected to <strong>{network?.name || "loading..."}</strong>
    </span>
  </div>
)
