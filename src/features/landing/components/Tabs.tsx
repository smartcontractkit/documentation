/** @jsxImportSource preact */
import tabs from "./Tabs.module.css"
import { ProductCard } from "./ProductCard.tsx"
import { evmProducts } from "../data/index.ts"

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
