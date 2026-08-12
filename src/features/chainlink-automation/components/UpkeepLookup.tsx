/** @jsxImportSource preact */
import { useMemo, useState } from "preact/hooks"
import styles from "./UpkeepLookup.module.css"
import button from "@chainlink/design-system/button.module.css"
import { CopyText } from "@components"

const NETWORK_LABELS: Record<string, string> = {
  "avalanche-mainnet": "Avalanche",
  "binance_smart_chain-mainnet": "BNB Chain",
  "ethereum-mainnet": "Ethereum",
  "ethereum-mainnet-arbitrum-1": "Arbitrum",
  "ethereum-mainnet-base-1": "Base",
  "ethereum-mainnet-optimism-1": "OP",
  "ethereum-mainnet-scroll-1": "Scroll",
  "ethereum-mainnet-zksync-1": "ZkSync",
  "gnosis_chain-mainnet": "Gnosis",
  "polygon-mainnet": "Polygon",
}

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/

const DATA_URL = "/chainlink-automation/upkeeps.json"

type Upkeep = {
  network: string
  registry: string
  admin: string
  id: string
}

export default function UpkeepLookup() {
  const [address, setAddress] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [upkeeps, setUpkeeps] = useState<Upkeep[] | null>(null)

  const results = useMemo(() => {
    if (!submitted || !upkeeps) return null
    return upkeeps.filter((u) => u.admin === submitted.toLowerCase())
  }, [submitted, upkeeps])

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const trimmed = address.trim()

    if (!ADDRESS_PATTERN.test(trimmed)) {
      setError("Enter a valid wallet address (0x followed by 40 hex characters).")
      setSubmitted("")
      return
    }

    setError("")

    if (upkeeps) {
      setSubmitted(trimmed)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(DATA_URL)
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
      const data = (await response.json()) as Upkeep[]
      setUpkeeps(data)
      setSubmitted(trimmed)
    } catch {
      setError("Couldn't load the Upkeep ID registry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${error ? styles.invalid : ""}`}
          type="text"
          placeholder="0xYourAdminAddress"
          value={address}
          onInput={(e) => setAddress((e.target as HTMLInputElement).value)}
          aria-label="Upkeep admin wallet address"
        />
        <button type="submit" className={button.primary} disabled={loading}>
          {loading ? "Looking up..." : "Look up"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {results && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <p className={styles.empty}>No upkeeps found for this address.</p>
          ) : (
            <>
              <p className={styles.count}>
                Found {results.length} upkeep{results.length === 1 ? "" : "s"} owned by this address:
              </p>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Network</th>
                    <th>Upkeep ID</th>
                    <th>Registry address</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((u) => (
                    <tr key={`${u.network}-${u.id}`}>
                      <td>{NETWORK_LABELS[u.network] ?? u.network}</td>
                      <td>
                        <CopyText text={u.id} code />
                      </td>
                      <td>
                        <CopyText text={u.registry} code />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  )
}
