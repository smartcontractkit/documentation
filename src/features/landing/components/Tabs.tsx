/** @jsxImportSource preact */
import tabs from "./Tabs.module.css"
import { ProductCard } from "./ProductCard"
import { evmProducts } from "../data"

export const Tabs = () => {
  return (
    <>
      <div class={tabs.tabContent}>
        {evmProducts.map((props) => (
          <ProductCard {...props} />
        ))}
      </div>
    </>
  )
}
