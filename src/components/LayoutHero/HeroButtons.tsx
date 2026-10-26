/** @jsxImportSource react */
import { useEffect, useState } from "react"
import { useStore } from "@nanostores/react"
import { buttonVariants } from "@chainlink/blocks"
import { selectedChainType } from "~/stores/chainType.js"
import { DEFAULT_CHAIN_TYPE } from "~/config/chainTypes.js"
import styles from "./LayoutHero.module.css"

export interface HeroButton {
  label: string
  link: string
}

interface HeroButtonsProps {
  buttons: HeroButton[]
  // Optional per-chain override list, keyed by ChainType id (e.g. "canton"). Chains without
  // an entry keep the default `buttons` — this is how EVM stays on its original links.
  chainOverrides?: Record<string, HeroButton[]>
}

export const HeroButtons = ({ buttons, chainOverrides }: HeroButtonsProps) => {
  // Same hydration-safe pattern as ChainAwareTabGrid: the server always renders with
  // DEFAULT_CHAIN_TYPE, so the first (hydration) render must match that exactly. The real
  // chain-specific override is swapped in via a post-mount effect instead.
  const [mounted, setMounted] = useState(false)
  const activeChainType = useStore(selectedChainType)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedChainType = mounted ? activeChainType : DEFAULT_CHAIN_TYPE
  const displayButtons = chainOverrides?.[resolvedChainType] ?? buttons

  return (
    <div className={styles.heroButtons}>
      {displayButtons.map((button, index) => (
        <a
          key={button.link}
          href={button.link}
          className={buttonVariants({
            variant: index === 0 ? "primary" : "tertiary",
            size: "sm",
          })}
        >
          {button.label}
        </a>
      ))}
    </div>
  )
}
