import * as Dialog from "@radix-ui/react-dialog"
import React, { useEffect } from "react"
import { SubProducts, ProductItem, ProductsNav, Page } from "../../Header/Nav/config.tsx"
import { isMatchedPath } from "../../Header/Nav/isMatchedPath.ts"
import { clsx } from "~/lib/clsx/clsx.ts"
// import { CaretIcon } from "../CaretIcon"
import { extendRadixComponent } from "./extendRadixComponent.ts"
import { BottomBar } from "./BottomBar.tsx"
import { ProductContent } from "./ProductContent.tsx"
import { SubProductContent } from "./SubProductContent.tsx"
import styles from "./productNavigation.module.css"
import { getNavigationProps, getSubProducts } from "../../Header/getNavigationProps.ts"
import defaultLogo from "../../../assets/product-logos/default-logo.svg"
import { useStore } from "@nanostores/react"
import { selectedCcipVersion } from "~/stores/ccipVersion.js"
import type { CcipVersion } from "~/config/types.js"
import { CCIP_SIDEBARS } from "~/config/sidebar.js"

declare global {
  interface Window {
    __PAGE_SDK_LANG_MAP__?: Record<string, string>
  }
}

type Props = {
  path: string
}

const Trigger = extendRadixComponent(Dialog.Trigger)
const Close = extendRadixComponent(Dialog.Close)
const Portal = extendRadixComponent(Dialog.Portal)
const Root = extendRadixComponent(Dialog.Root)

// Call getNavigationProps once at module level
// Get SDK lang data from window (injected by Header.astro)
const getPageSdkLangMap = (): Map<string, string> => {
  if (typeof window !== "undefined" && window.__PAGE_SDK_LANG_MAP__) {
    return new Map(Object.entries(window.__PAGE_SDK_LANG_MAP__))
  }
  return new Map()
}

const navigationPropsStatic = getNavigationProps(getPageSdkLangMap())

// Find a product entry by its href across all categories.
const findProduct = (productsNav: ProductsNav, href: string): ProductItem | undefined => {
  for (const category of productsNav.categories) {
    const found = category.items.find((item) => item.href === href)
    if (found) return found
  }
  return undefined
}

// Build the mobile sub-nav tree for a product. CCIP is versioned, so its tree is ALWAYS sourced from
// CCIP_SIDEBARS[active version] (the same source the desktop sidebar uses) — never a stale static
// tree. Every other product uses its own static tree. This is the single source of truth that keeps
// first-open and re-tap identical and version-correct.
const buildSubProducts = (product: ProductItem | undefined, ccipVersion: CcipVersion): SubProducts | undefined => {
  if (!product) return undefined
  let sections: Array<{ label: string; items: Page[] }> | undefined
  if (product.href === "/ccip") {
    const versioned = CCIP_SIDEBARS[ccipVersion]
    if (!versioned) return undefined // guard against an unknown version (avoids a render crash)
    sections = getSubProducts(versioned, new Map())
  } else {
    sections = product.subProducts as unknown as Array<{ label: string; items: Page[] }>
  }
  if (!sections || !Array.isArray(sections)) return undefined
  return {
    label: product.label,
    items: sections.map((section) => ({ label: section.label, href: "#", pages: section.items })),
  }
}

export function ProductNavigation({ path }: Props) {
  const [open, setOpen] = React.useState(false)
  // Which product's sub-nav is open. The tree itself is DERIVED from this (+ the CCIP version) in the
  // `subProducts` memo below, so there is exactly one source of truth and the tree can never diverge
  // between first-open and re-tap.
  const [activeProductHref, setActiveProductHref] = React.useState<string | null>(null)
  const [showSearch, setShowSearch] = React.useState(false)
  const [productsSlidePosition, setProductsSlidePosition] = React.useState<"main" | "submenu">("main")
  const closeButtonRef = React.useRef(null)

  // Use the static navigation props
  const { productsNav, subProductsNav } = navigationPropsStatic

  // CCIP is versioned; read the active version reactively so the picker tree tracks the v1/v2 toggle.
  const ccipVersion = useStore(selectedCcipVersion)

  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(path, href))

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : defaultLogo.src

  // Single source of truth for the open product's tree. Rebuilds when the active product OR the CCIP
  // version changes — so re-entering CCIP always shows the correct, versioned, chain-filterable tree
  // (never the stale static one). Chain-family filtering itself happens at render time in
  // SubProductContent.
  const subProducts = React.useMemo(
    () => (activeProductHref ? buildSubProducts(findProduct(productsNav, activeProductHref), ccipVersion) : undefined),
    [activeProductHref, ccipVersion, productsNav]
  )

  // On page (path) change, select the product whose section owns this URL and show its sub-nav.
  // Version is handled by the memo above, so it is intentionally NOT a dependency here.
  useEffect(() => {
    const match = productsNav.categories
      .flatMap((category) => category.items)
      .find((item) => item.subProducts && isMatchedPath(path, item.href))
    if (match) {
      setActiveProductHref(match.href)
      setProductsSlidePosition("submenu")
    } else {
      setActiveProductHref(null)
    }
  }, [path, productsNav])

  const onProductClick = React.useCallback((product: ProductItem) => {
    setActiveProductHref(product.href)
    setProductsSlidePosition("submenu")
  }, [])

  const onSubproductClick = () => {
    // Back to the product list. Keep `activeProductHref` so reopening restores the content sidebar.
    setProductsSlidePosition("main")
  }

  const handleOpenChange = (newOpenState: boolean) => {
    setOpen(newOpenState)
    if (!newOpenState) {
      // Keep the current product's submenu state so reopening shows the content sidebar again
      // (not the products list). `subProducts` stays in sync with the page via the effect above.
      setShowSearch(false)
    }
  }

  return (
    <Root open={open} onOpenChange={handleOpenChange}>
      <Trigger data-testid="docs-picker-trigger-mobile" className={styles.trigger}>
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
            aria-label="Close navigation"
          >
            <img src="/assets/icons/close-small.svg" alt="" />
          </Close>
          <BottomBar />
        </Dialog.Content>
      </Portal>
    </Root>
  )
}

export default ProductNavigation
