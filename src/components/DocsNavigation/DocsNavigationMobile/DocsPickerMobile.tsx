import * as Dialog from "@radix-ui/react-dialog"
import React, { useEffect } from "react"
import { SubProducts } from "../../Header/Nav/config"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath"
import { clsx } from "~/lib"
// import { CaretIcon } from "../CaretIcon"
import { extendRadixComponent } from "./extendRadixComponent"
import { BottomBar } from "./BottomBar"
import { ProductContent } from "./ProductContent"
import { SubProductContent } from "./SubProductContent"
import styles from "./productNavigation.module.css"
import { getNavigationProps } from "../../Header/getNavigationProps"
import defaultLogo from "../../../assets/product-logos/default-logo.svg"

type Props = {
  path: string
}

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

export function ProductNavigation({ path }: Props) {
  const [open, setOpen] = React.useState(false)
  const [subProducts, setSubProducts] = React.useState<SubProducts | undefined>(undefined)
  const [showSearch, setShowSearch] = React.useState(false)
  const [productsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)
  const { productsNav } = getNavigationProps()

  const { subProductsNav } = getNavigationProps()
  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(path, href))

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : defaultLogo.src

  useEffect(() => {
    const foundSubProduct = productsNav.categories.find((category) =>
      category.items.some((item) => item.subProducts && isMatchedPath(path, item.href))
    )

    if (foundSubProduct) {
      const subProduct = foundSubProduct.items.find((item) => item.subProducts && isMatchedPath(path, item.href))

      if (subProduct?.subProducts && Array.isArray(subProduct.subProducts)) {
        const items = subProduct.subProducts.map((subProductItem) => ({
          label: subProductItem.label,
          href: "#",
          pages: subProductItem.items.map((page) => ({
            label: page.label,
            href: page.href,
            children: page.children || [],
          })),
        }))

        const safeSubProducts: SubProducts = {
          label: subProduct.label,
          items,
        }

        setSubProducts(safeSubProducts)
        setProductsSlidePosition("submenu")
      }
    } else {
      setSubProducts(undefined)
    }
  }, [path, productsNav])

  const onProductClick = React.useCallback((subProducts: SubProducts) => {
    setSubProducts(subProducts)
    setProductsSlidePosition("submenu")
  }, [])

  const onSubproductClick = () => {
    setProductsSlidePosition("main")
    setSubProducts(undefined)
  }

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState)
    if (!newOpenState) {
      setProductsSlidePosition("main")
      setShowSearch(false)
      setSubProducts(undefined)
    }
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Trigger data-testid="product-navigation-trigger-mobile" className={styles.trigger}>
        <img src={icon} alt="" className={styles.logo} />
        <span>{label}</span>
        <div className={styles.caret}>
          <span></span>
        </div>
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
              <div className={clsx(styles.content, styles[productsSlidePosition])}>
                <ul className={clsx(styles.productContent)}>
                  <ProductContent onProductClick={onProductClick} productsNav={productsNav} currentPath={path} />
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
          <Close
            ref={closeButtonRef}
            className={clsx(styles.closeButton, { [styles.hidden]: productsSlidePosition === "submenu" })}
          >
            <img src="/assets/icons/close-small.svg" />
          </Close>
          <BottomBar />
        </Dialog.Content>
      </Portal>
    </Root>
  )
}

export default ProductNavigation
