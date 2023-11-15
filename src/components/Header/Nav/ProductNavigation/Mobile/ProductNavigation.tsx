import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import { CaretIcon } from "../../CaretIcon"
import { ProductsNav } from "../../config"
import { SearchTrigger } from "../../NavBar"
import { clsx, getIconUrl, getPortalRootContainer } from "../../utils"
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
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Trigger data-testid="product-navigation-trigger-mobile" className={styles.trigger}>
        <img
          alt={`Chainlink Documentation`}
          title={`Chainlink Documentation`}
          style={{ display: "flex" }}
          srcSet={getIconUrl(`logo-developerHub`)}
          height={24}
        />
        <CaretIcon
          style={{
            color: "gray",
            fill: "gray",
            width: "var(--space-4x)",
            height: "var(--space-4x)",
          }}
        />
      </Trigger>

      <Portal {...getPortalRootContainer()}>
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
            <img src={getIconUrl("Close_gray")} />
          </Close>

          <BottomBar />
        </Dialog.Content>
      </Portal>
    </Dialog.Root>
  )
}

export default ProductNavigation
