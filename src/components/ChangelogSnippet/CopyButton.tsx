import { SvgCopy, Typography } from "@chainlink/blocks"
import styles from "./ChangelogCard.module.css"
import { useState } from "react"

export default function CopyButton({ url }: { url: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    const mode = import.meta.env.MODE === "development" ? "http://localhost:4321" : "https://dev.chain.link"
    navigator.clipboard.writeText(`${mode}/changelog/${url}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button className={styles.copyButton} onClick={copyToClipboard}>
      {isCopied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={styles.checkmark}
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <Typography color="success" variant="body-xs" className={styles.copyText}>
            Copied
          </Typography>
        </>
      ) : (
        <>
          <SvgCopy
            style={{
              width: "13px",
              height: "12px",
            }}
            className={styles.copyIconDesktop}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className={styles.copyIconMobile}
          >
            <path d="M12 3v12" />
            <path d="m17 8-5-5-5 5" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          </svg>
          <Typography color="muted" variant="body-xs" className={styles.copyText}>
            Copy URL
          </Typography>
        </>
      )}
    </button>
  )
}
