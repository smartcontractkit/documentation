import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { ProductsNav, SubProductsNav } from "../../config"
import { Divider } from "../../Divider"
import { isMatchedPath } from "../../isMatchedPath"
import { clsx } from "../../utils"
import { extendRadixComponent } from "../extendRadixComponent"
import { ProductContent } from "./ProductContent"
import styles from "./productNavigation.module.css"
import { SubProductContent } from "./SubProductContent"
import { Trigger } from "./Trigger"

type Props = {
  path: string
  setNavMenuOpen: (navMenuOpen: boolean) => void
  productsNav: ProductsNav
  subProductsNav?: SubProductsNav
}

const Root = extendRadixComponent(NavigationMenu.Root)
const List = extendRadixComponent(NavigationMenu.List)
const Indicator = extendRadixComponent(NavigationMenu.Indicator)
const Item = extendRadixComponent(NavigationMenu.Item)
const Viewport = extendRadixComponent(NavigationMenu.Viewport)
const RadixTrigger = extendRadixComponent(NavigationMenu.Trigger)
const RadixContent = extendRadixComponent(NavigationMenu.Content)

export const ProductNavigation = ({ path, setNavMenuOpen, productsNav, subProductsNav }: Props) => {
  const productMenuRef = React.useRef<HTMLButtonElement>(null)
  const productMenuDataset = productMenuRef.current?.dataset ?? {}
  const productMenuOpen = React.useMemo(() => productMenuDataset.state === "open", [productMenuDataset.state])
  const subProductMenuRef = React.useRef<HTMLButtonElement>(null)
  const subProductMenuDataset = subProductMenuRef.current?.dataset ?? {}
  const subProductMenuOpen = React.useMemo(() => subProductMenuDataset.state === "open", [subProductMenuDataset.state])

  React.useEffect(() => setNavMenuOpen(productMenuOpen || subProductMenuOpen), [productMenuOpen, subProductMenuOpen])

  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath(path, href))

  return (
    <>
      <a rel="noreferrer" target="_blank" className={clsx("home-logo", styles.logo)} href="https://chain.link/">
        <img
          alt="Chainlink Home"
          title="Chainlink Home"
          style={{ display: "flex" }}
          src="/assets/icons/chainlink-logo.svg"
          height={28}
        />
      </a>
      <Root className={clsx(styles.root, !subProductTrigger && styles.alignLeft)}>
        <List className={styles.list}>
          <Divider className={styles.divider} />
          <Item>
            <RadixTrigger className="nav-product" ref={productMenuRef}>
              <Trigger className={styles.productTrigger} label="Developer Hub" />
            </RadixTrigger>
            <RadixContent className={styles.content}>
              <ProductContent categories={productsNav.categories} />
            </RadixContent>
          </Item>

          <Indicator className={styles.indicator}>
            <div className={styles.arrow} />
          </Indicator>
        </List>

        <div className={styles.viewportPosition}>
          <Viewport className={styles.navigationViewport} />
        </div>
      </Root>

      <Root className={clsx(styles.root, styles.alignLeft)}>
        <Divider className={styles.divider} />
        <List className={styles.list}>
          <Item>
            <NavigationMenu.Link className={styles.button} href="/">
              Docs
            </NavigationMenu.Link>
          </Item>
          {subProductTrigger && subProductsNav && (
            <>
              <Divider className={styles.divider} />
              <Item>
                <RadixTrigger className="nav-subproduct" ref={subProductMenuRef}>
                  <Trigger label={subProductTrigger.label} />
                </RadixTrigger>
                <RadixContent className={styles.content}>
                  <SubProductContent subProductsNav={subProductsNav} />
                </RadixContent>
              </Item>
            </>
          )}

          <Indicator className={styles.indicator}>
            <div className={styles.arrow} />
          </Indicator>
        </List>

        <div className={styles.viewportPosition}>
          <Viewport className={styles.navigationViewport} />
        </div>
      </Root>
    </>
  )
}
