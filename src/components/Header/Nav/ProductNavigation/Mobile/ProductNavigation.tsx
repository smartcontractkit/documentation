import * as Dialog from "@radix-ui/react-dialog"
import React, { useEffect } from "react"
import { ProductsNav, SubProducts } from "../../config"
import { SearchTrigger } from "../../NavBar"
import { isMatchedPath } from "../../isMatchedPath"
import { clsx } from "../../utils"
import { extendRadixComponent } from "../extendRadixComponent"
import { ProductContent } from "./ProductContent"
import styles from "./productNavigation.module.css"
import { MenuIcon } from "./MenuIcon"
import { BackArrowIcon } from "./BackArrowIcon"
import { CaretRightIcon } from "./CaretRightIcon"
import MegaMenu from "./MegaMenu"

type Props = {
  searchTrigger?: SearchTrigger
  productsNav: ProductsNav
  path: string
}

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

export function ProductNavigation({ productsNav, path, searchTrigger }: Props) {
  const [open, setOpen] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [productsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)

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

        setProductsSlidePosition("submenu")
      }
    }
  }, [path, productsNav])

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
        <MenuIcon />
      </Trigger>

      <Portal>
        <Dialog.Overlay />
        <Dialog.Content className={styles.menuContent}>
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
                <div>
                  <div className={styles.header}>
                    <img
                      alt="Documentation Home"
                      title="Documentation Home"
                      style={{ display: "flex" }}
                      src="/chainlink-docs.svg"
                      height={30}
                    />
                    <Close ref={closeButtonRef} className={styles.closeButton}>
                      <img src="/assets/icons/close.svg" />
                    </Close>
                  </div>
                  <ul className={clsx(styles.productContent)}>
                    <button
                      className={styles.productContentLink}
                      onClick={() => setProductsSlidePosition("submenu")}
                      data-testid="sub-product-navigation-trigger-mobile"
                    >
                      Resources
                      <CaretRightIcon />
                    </button>
                    <a href="" className={styles.productContentLink}>
                      Docs
                    </a>
                    <a href="" className={styles.productContentLink}>
                      Demos
                    </a>
                    <a href="" className={styles.productContentLink}>
                      Tools
                    </a>
                    <a href="" className={styles.productContentLink}>
                      ChainLog
                    </a>
                  </ul>
                </div>
                <div className={clsx(styles.subProductContentPage)}>
                  <div className={styles.header}>
                    <button key="back" className={styles.back} onClick={() => setProductsSlidePosition("main")}>
                      <BackArrowIcon />
                    </button>
                    <span className={styles.subProductContentTitle}>Resources</span>
                    <span></span> {/* Spacer */}
                  </div>
                  <div className={styles.subProductContent}>
                    <MegaMenu />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Portal>
    </Root>
  )
}

export default ProductNavigation
