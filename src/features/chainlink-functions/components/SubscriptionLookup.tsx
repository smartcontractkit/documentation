/** @jsxImportSource preact */
import { useMemo, useState } from "preact/hooks"
import styles from "./SubscriptionLookup.module.css"
import button from "@chainlink/design-system/button.module.css"
import subscriptions from "../data/subscriptions.json" with { type: "json" }

const NETWORK_LABELS: Record<string, string> = {
  "avalanche-mainnet": "Avalanche",
  "celo-mainnet": "Celo",
  "ethereum-mainnet": "Ethereum",
  "ethereum-mainnet-arbitrum-1": "Arbitrum",
  "ethereum-mainnet-base-1": "BASE",
  "ethereum-mainnet-optimism-1": "OP",
  "polygon-mainnet": "Polygon",
  "soneium-mainnet": "Soneium",
}

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/

type Subscription = {
  network: string
  router: string
  admin: string
  id: string
}

const ALL_SUBSCRIPTIONS = subscriptions as Subscription[]

export default function SubscriptionLookup() {
  const [address, setAddress] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [error, setError] = useState("")

  const results = useMemo(() => {
    if (!submitted) return null
    return ALL_SUBSCRIPTIONS.filter((s) => s.admin === submitted.toLowerCase())
  }, [submitted])

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const trimmed = address.trim()

    if (!ADDRESS_PATTERN.test(trimmed)) {
      setError("Enter a valid wallet address (0x followed by 40 hex characters).")
      setSubmitted("")
      return
    }

    setError("")
    setSubmitted(trimmed)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${error ? styles.invalid : ""}`}
          type="text"
          placeholder="0xYourOwnerAddress"
          value={address}
          onInput={(e) => setAddress((e.target as HTMLInputElement).value)}
          aria-label="Owner wallet address"
        />
        <button type="submit" className={button.primary}>
          Look up
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {results && (
        <div className={styles.results}>
          {results.length === 0 ? (
            <p className={styles.empty}>No subscriptions found for this address.</p>
          ) : (
            <>
              <p className={styles.count}>
                Found {results.length} subscription{results.length === 1 ? "" : "s"} owned by this address:
              </p>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Network</th>
                    <th>Subscription ID</th>
                    <th>FunctionsRouter address</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={`${r.network}-${r.id}`}>
                      <td>{NETWORK_LABELS[r.network] ?? r.network}</td>
                      <td>{r.id}</td>
                      <td>
                        <code>{r.router}</code>
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
