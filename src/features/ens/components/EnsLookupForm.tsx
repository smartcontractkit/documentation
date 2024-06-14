/** @jsxImportSource preact */
import { EnsOptions } from "../data"
import { useState } from "preact/hooks"
import styles from "./EnsLookupForm.module.css"
import { getWeb3Provider } from "@features/utils"

export const EnsLookupForm = () => {
  const [ensResult, setEnsResult] = useState<
    | {
        ensName: string
        address: string
        hash: string
      }
    | undefined
  >()
  const [isLoading, setIsLoading] = useState(false)
  async function getDropdownAddress(selectedEnsString: string) {
    if (selectedEnsString === "") {
      return
    }
    setIsLoading(true)

    try {
      const data = JSON.stringify({
        query: `{
            domains(where:{name:"${selectedEnsString}"}) {
              id
              name
            }
          }`,
      })

      const response = await fetch(
        "https://gateway-arbitrum.network.thegraph.com/api/934b65a95f6dd6f3d9a468d9cdda9ec6/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH",
        {
          method: "post",
          body: data,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length.toString(),
            "User-Agent": "Node",
          },
        }
      )
      const json = await response.json()
      const hashName = json.data.domains[0] ? json.data.domains[0].id : "Not Found"

      const result = await getWeb3Provider("ETHEREUM_MAINNET")?.resolveName(selectedEnsString)

      result &&
        setEnsResult({
          ensName: selectedEnsString,
          address: result,
          hash: hashName,
        })
    } catch (e) {
      setEnsResult({
        ensName: selectedEnsString,
        address: "Not found",
        hash: "Not found",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form class={styles.form}>
        <label>Pair:</label>
        <select className={styles.input} onChange={(event) => getDropdownAddress(event.currentTarget.value)}>
          <option value="">Choose Pair</option>
          {EnsOptions.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <label>ENS Name:</label>
        <input className={styles.input} value={isLoading ? "Loading..." : ensResult ? ensResult.ensName : ""} />
        <label>Address:</label>
        <input className={styles.input} value={isLoading ? "Loading..." : ensResult ? ensResult.address : ""} />
        <label>Hash ID:</label>
        <input className={styles.input} value={isLoading ? "Loading..." : ensResult ? ensResult.hash : ""} />
      </form>
    </div>
  )
}
