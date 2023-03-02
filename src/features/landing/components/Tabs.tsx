/** @jsxImportSource preact */
import { useState } from "preact/hooks"
import { clsx } from "~/lib"
import tabs from "./Tabs.module.css"
import { ProductCard } from "./ProductCard"
import { evmProducts } from "../data"

export const Tabs = () => {
  const [tabId] = useState("evm-products")

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
