/** @jsxImportSource preact */
import { clsx } from "~/lib"
import tabs from "./Tabs.module.css"
import { ProductCard } from "./ProductCard"
import { evmProducts } from "../data"

export const Tabs = () => {
  return (
    <>
      <div class={tabs.tabContent}>
        <div>
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
