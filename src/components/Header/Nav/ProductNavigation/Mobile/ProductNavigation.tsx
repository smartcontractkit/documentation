import * as Dialog from "@radix-ui/react-dialog"
import React, { useEffect } from "react"
import { ProductsNav } from "../../config"
import { SearchTrigger } from "../../NavBar"
import { isMatchedPath } from "../../isMatchedPath"
import { clsx } from "../../utils"
import { CaretIcon } from "../CaretIcon"
import { extendRadixComponent } from "../extendRadixComponent"
import { BottomBar } from "./BottomBar"
import { ProductContent } from "./ProductContent"
import styles from "./productNavigation.module.css"
import { SubProductContent } from "./SubProductContent"

type Page = {
  label: string
  href: string
}

export type SubProducts = {
  label: string
  items: { label: string; href: string; pages?: Page[] }[]
}

type Props = {
  searchTrigger?: SearchTrigger
  productsNav: ProductsNav
  path: string
}

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

export function ProductNavigation({ productsNav, path }: Props) {
  const [open, setOpen] = React.useState(false)
  const [subProducts, setSubProducts] = React.useState<SubProducts | undefined>(undefined)
  const [showSearch, setShowSearch] = React.useState(false)
  const [producsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)

  useEffect(() => {
    const foundSubProduct = productsNav.categories.find((category) =>
      category.items.some((item) => item.subProducts && isMatchedPath(path, item.href))
    )

    if (foundSubProduct) {
      const subProduct = foundSubProduct.items.find((item) => item.subProducts && isMatchedPath(path, item.href))

      if (subProduct?.subProducts?.items) {
        const safeSubProducts: SubProducts = {
          label: subProduct.subProducts.label,
          items: subProduct.subProducts.items.map((item) => ({
            label: item.label,
            href: item.href || "#",
            pages:
              item.pages?.map((page) => ({
                label: page.label,
                href: page.href,
              })) || [],
          })),
        }

        setSubProducts(safeSubProducts)
        setProductsSlidePosition("submenu")
      }
    }
  }, [path, productsNav])

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
      setProductsSlidePosition("main")
      setShowSearch(false)
    }
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Trigger data-testid="product-navigation-trigger-mobile" className={styles.trigger}>
        <img
          alt="Documentation Home"
          title="Documentation Home"
          style={{ display: "flex" }}
          src="/chainlink-docs.svg"
          height={30}
        />
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
                  <SubProductContent
                    subProducts={subProducts}
                    onSubproductClick={onSubproductClick}
                    currentPath={path}
                  />
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
