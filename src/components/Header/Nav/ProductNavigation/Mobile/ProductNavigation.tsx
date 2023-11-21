import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import { ProductsNav } from "../../config"
import { SearchTrigger } from "../../NavBar"
import { clsx } from "../../utils"
import { CaretIcon } from "../CaretIcon"
import { extendRadixComponent } from "../extendRadixComponent"
import { BottomBar } from "./BottomBar"
import { ProductContent } from "./ProductContent"
import styles from "./productNavigation.module.css"
import { SubProductContent } from "./SubProductContent"

export type SubProducts = {
  label: string
  items: { label: string; href: string }[]
}

type Props = {
  searchTrigger?: SearchTrigger
  productsNav: ProductsNav
}

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

export function ProductNavigation({ productsNav }: Props) {
  const [open, setOpen] = React.useState(false)
  const [subProducts, setSubProducts] = React.useState<SubProducts | undefined>(undefined)
  const [showSearch, setShowSearch] = React.useState(false)
  const [producsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)

  const onProductClick = React.useCallback((subProducts: SubProducts) => {
    setSubProducts(subProducts)
    setProductsSlidePosition("submenu")
  }, [])

  const onSubproductClick = () => {
    setProductsSlidePosition("main")
  }

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState)
    if (!newOpenState) {
      setShowSearch(false)
    }
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <a rel="noreferrer" target="_blank" className={clsx("home-logo", styles.logo)} href="https://chain.link/">
        <img
          alt="Chainlink Home"
          title="Chainlink Home"
          style={{ display: "flex" }}
          src="/assets/icons/chainlink.svg"
          height={24}
          width={24}
        />
      </a>
      <Trigger data-testid="product-navigation-trigger-mobile" className={styles.trigger}>
        <span
          className={"text-300"}
          style={{ color: "var(--color-text-label)", fontWeight: "var(--font-weight-medium)" }}
        >
          Developer Hub
        </span>
        <CaretIcon
          style={{
            color: "var(--color-text-primary)",
            fill: "var(--color-text-primary)",
          }}
        />
      </Trigger>

      <Portal>
        <Dialog.Overlay />
        <Dialog.Content className={clsx(styles.menuContent)}>
          <div className={clsx(styles.content, styles[showSearch ? "submenu" : "main"])}>
            <div
              style={{
                position: "relative",
                display: "flex",
                width: "100vw",
                overflow: "hidden",
              }}
            >
              <div className={clsx(styles.content, styles[producsSlidePosition])}>
                <ul className={clsx(styles.productContent)}>
                  <ProductContent onProductClick={onProductClick} productsNav={productsNav} />
                </ul>
                <div className={clsx(styles.subProductContent)}>
                  <SubProductContent subProducts={subProducts} onSubproductClick={onSubproductClick} />
                </div>
              </div>
            </div>
          </div>
          <Close ref={closeButtonRef} className={styles.closeButton}>
            <img src="/assets/icons/close.svg" />
          </Close>

          <BottomBar />
        </Dialog.Content>
      </Portal>
    </Root>
  )
}

export default ProductNavigation
