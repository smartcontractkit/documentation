/** @jsxImportSource preact */
import h from "preact"
import { useState } from "preact/hooks"
import { clsx } from "~/lib"
import tabs from "./Tabs.module.css"
import { ProductCard } from "./ProductCard"
import solanaIcon from "../assets/solana-chains.svg"
import ethereumIcon from "../assets/evm-chains.svg"
import { evmProducts, solanaProducts } from "../data"

export const Tabs = () => {
  const [tabId, setTabId] = useState("evm-products")

  return (
    <>
      <div class={tabs.tabContent}>
        <div
          id="evm-products"
          class={clsx(tabs.tabPane, {
            [tabs.active]: tabId === "evm-products",
          })}
        >
          {evmProducts.map((props) => (
            <div class={tabs.tabElement}>
              <ProductCard {...props} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
