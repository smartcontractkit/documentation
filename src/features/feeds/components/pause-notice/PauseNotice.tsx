/** @jsxImportSource preact */
import styles from "./PauseNotice.module.css"
import dangerIcon from "../../../../components/Alert/Assets/danger-icon.svg"
import alertIcon from "../../../../components/Alert/Assets/alert-icon.svg"
import { useEffect, useState } from "preact/hooks"

// SVG icon paths
const icons = {
  alert: alertIcon,
  danger: dangerIcon,
}

export const PauseNotice = ({
  list,
  type = "alert",
  feedName,
  feedAddress,
  value,
  heartbeat,
  buffer,
  currencyName,
}: {
  value: number
  list?: boolean
  type: "alert" | "danger"
  feedName: string
  feedAddress: string
  heartbeat: number
  buffer: number
  currencyName: string
}) => {
  const [ripCord, setRipCord] = useState<boolean>(false)
  const date = Math.floor(new Date().getTime() / 1000)
  const timeSinceUpdate = date - value
  const threshold = heartbeat + buffer

  useEffect(() => {
    const fetchRipCord = async () => {
      const res = await fetch(
        `https://api.real-time-reserves.ledgerlens.io/v1/chainlink/proof-of-reserves/${currencyName}`,
        {
          method: "GET",
        }
      )
      const fecthedProofOfReserveData = await res.json()
      setRipCord(fecthedProofOfReserveData.ripCord ?? false)
    }
    fetchRipCord().catch((error) => {
      console.error(error)
    })
  }, [ripCord])
  // TODO: Add dynamic scanner URL paths from chain data.
  if (timeSinceUpdate > threshold && ripCord) {
    if (!list) {
      return (
        <>
          <div class={styles.banner + " " + styles[type]}>
            <img class={styles.icon} src={icons[type]}></img>
            <p class={styles.notice}>
              The <a href={`https://etherscan.io/address/${feedAddress}`}>{feedName} feed</a> is paused due to lack of
              attestation data. Read the <a href="/data-feeds/proof-of-reserve">Proof of Reserves</a> page to learn more
              about data attestation types.
            </p>
          </div>
        </>
      )
    } else {
      return (
        <>
          <span
            class={styles.banner + " " + styles.tooltip + " " + styles[type]}
            tooltip-text="This feed is paused due to lack of attestation data."
          >
            <img class={styles.iconSmall} src={icons[type]}></img>
            <p class={styles.notice}>Paused</p>
          </span>
        </>
      )
    }
  } else {
    return null
  }
}
