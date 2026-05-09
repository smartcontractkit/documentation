/** @jsxImportSource react */
import { useStore } from "@nanostores/react"
import { selectedChainType } from "~/stores/chainType.js"
import { Callout } from "@components/Callout/Callout.tsx"

export function AptosCCTCallout() {
  const chainType = useStore(selectedChainType)

  if (chainType !== "aptos") {
    return null
  }

  return (
    <Callout type="caution" title="Aptos CCT Documentation Coming Soon">
      Cross-Chain Token (CCT) implementation documentation for Aptos is currently in development. If you are a token
      developer and wish to enable your token on Aptos, please submit your project details via this{" "}
      <a href="https://chain.link/ccip-contact">contact form</a>. When filling out the form, select{" "}
      <strong>Token admin registration</strong> as the support request type.
    </Callout>
  )
}
