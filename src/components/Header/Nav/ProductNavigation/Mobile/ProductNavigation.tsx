import * as Dialog from "@radix-ui/react-dialog"
import React from "react"
import { clsx } from "../../utils.ts"
import { extendRadixComponent } from "../extendRadixComponent.ts"
import styles from "./productNavigation.module.css"
import { MenuIcon } from "./MenuIcon.tsx"
import { BackArrowIcon } from "./BackArrowIcon.tsx"
import { CaretRightIcon } from "./CaretRightIcon.tsx"
import MegaMenu from "../Desktop/MegaMenu.tsx"

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

export function ProductNavigation() {
  const [open, setOpen] = React.useState(false)
  const [showSearch, setShowSearch] = React.useState(false)
  const [productsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)

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
          height={32}
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
                      height={32}
                    />
                    <Close ref={closeButtonRef} className={styles.closeButton} aria-label="Close navigation">
                      <img src="/assets/icons/close.svg" alt="" />
                    </Close>
                  </div>
                  <ul className={clsx(styles.productContent)}>
                    <button
                      className={styles.productContentLink}
                      onClick={() => setProductsSlidePosition("submenu")}
                      data-testid="sub-product-navigation-trigger-mobile"
                      aria-label="Open Docs submenu"
                    >
                      Docs
                      <CaretRightIcon />
                    </button>

                    <a href="https://dev.chain.link/demos" className={styles.productContentLink}>
                      Demos
                    </a>
                    <a href="https://dev.chain.link/tools" className={styles.productContentLink}>
                      Tools
                    </a>
                    <a href="https://dev.chain.link/changelog" className={styles.productContentLink}>
                      Changelog
                    </a>
                    <a href="https://dev.chain.link/certification" className={styles.productContentLink}>
                      Get Certified
                    </a>
                  </ul>
                </div>
                <div className={clsx(styles.subProductContentPage)}>
                  <div className={styles.header}>
                    <button
                      key="back"
                      className={styles.back}
                      onClick={() => setProductsSlidePosition("main")}
                      aria-label="Go back to main menu"
                    >
                      <BackArrowIcon />
                    </button>
                    <span className={styles.subProductContentTitle}>Docs</span>
                    <span></span> {/* Spacer */}
                  </div>
                  <div className={styles.subProductContent}>
                    <MegaMenu isMobile />
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
