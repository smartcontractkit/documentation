/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import styles from "./EnsLookupForm.module.css"
import { getWeb3Provider } from "@features/utils"
import button from "@chainlink/design-system/button.module.css"

export const EnsManualLookupForm = () => {
  const [ensResult, setEnsResult] = useState<
    | {
        ensName: string
        address: string
      }
    | undefined
  >()
  const [asset1, setAsset1] = useState("ETH")
  const [asset2, setAsset2] = useState("USD")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const selectedEnsString = formData.get("asset-1") + "-" + formData.get("asset-2") + ".data.eth"

    try {
      setIsLoading(true)

      const result = await getWeb3Provider("ETHEREUM_MAINNET")?.resolveName(selectedEnsString)
      if (!result) throw Error("No address")
      setEnsResult({
        ensName: selectedEnsString,
        address: result,
      })
    } catch (e) {
      setEnsResult({
        ensName: selectedEnsString,
        address: "Not found",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form class={styles.form} onSubmit={handleSubmit}>
        <div>
          <input
            name="asset-1"
            class={styles.input}
            type="text"
            value={asset1}
            onChange={(e: any) => setAsset1(e.target.value)}
          />
          <span style={{ margin: "0 var(--space-2x)" }}>/</span>
          <input
            name="asset-2"
            class={styles.input}
            type="text"
            value={asset2}
            onChange={(e: any) => setAsset2(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" class={button.primary}>
            Lookup
          </button>
        </div>
      </form>

      <div class={styles.form} style={{ marginTop: "var(--space-4x)" }}>
        <label>ENS Name:</label>
        <input class={styles.input} value={isLoading ? "Loading..." : ensResult ? ensResult.ensName : ""} />
        <label>Address:</label>
        <input class={styles.input} value={isLoading ? "Loading..." : ensResult ? ensResult.address : ""} />
      </div>
    </div>
  )
}
