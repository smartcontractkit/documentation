import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { extendRadixComponent } from "../../extendRadixComponent"
import { clsx, getImageUrl } from "../../utils"
import { AppName, config, ProductsNav, SubProductsNav } from "../../config"
import { isMatchedPath } from "../../isMatchedPath"
import { ProductContent } from "./ProductContent"
import styles from "./productNavigation.module.css"
import trigger from "./trigger.module.css"
import { SubProductContent } from "./SubProductContent"
import { Trigger } from "./Trigger"
import { Divider } from "../../Divider"

type Props = {
  app: AppName
  path: string
  setNavMenuOpen: (navMenuOpen: boolean) => void
  productsNav?: ProductsNav
  subProductsNav?: SubProductsNav
}

const Root = extendRadixComponent(NavigationMenu.Root)
const List = extendRadixComponent(NavigationMenu.List)
const Indicator = extendRadixComponent(NavigationMenu.Indicator)
const Item = extendRadixComponent(NavigationMenu.Item)
const Viewport = extendRadixComponent(NavigationMenu.Viewport)
const RadixTrigger = extendRadixComponent(NavigationMenu.Trigger)
const RadixContent = extendRadixComponent(NavigationMenu.Content)

export const ProductNavigation = ({
  app,
  path,
  setNavMenuOpen,
  productsNav: customProductsNav,
  subProductsNav,
}: Props) => {
  const productsNav = customProductsNav || config[app].productsNav
  const productMenuRef = React.useRef<HTMLButtonElement>(null)
  const productMenuDataset = productMenuRef.current?.dataset ?? {}
  const productMenuOpen = React.useMemo(() => productMenuDataset.state === "open", [productMenuDataset.state])
  const subProductMenuRef = React.useRef<HTMLButtonElement>(null)
  const subProductMenuDataset = subProductMenuRef.current?.dataset ?? {}
  const subProductMenuOpen = React.useMemo(() => subProductMenuDataset.state === "open", [subProductMenuDataset.state])

  React.useEffect(() => setNavMenuOpen(productMenuOpen || subProductMenuOpen), [productMenuOpen, subProductMenuOpen])

  const subProductTrigger = subProductsNav?.items.find(({ href }) => isMatchedPath(path, href))

  return (
    <>
      <Root className={clsx(styles.root, !subProductTrigger && styles.alignLeft)}>
        <List className={styles.list}>
          <Item>
            <RadixTrigger className="nav-product" ref={productMenuRef}>
              <Trigger icon={!subProductTrigger?.icon ? productsNav.trigger.icon : undefined} label={"Developer Hub"} />
            </RadixTrigger>
            <RadixContent className={styles.content}>
              <ProductContent categories={productsNav.categories} />
            </RadixContent>
          </Item>
          <Divider />
          <Item>
            <NavigationMenu.Link href="https://github.com/radix-ui">
              <div className={trigger.trigger}>
                <img height={20} width={20} src={getImageUrl(`/docs-navbar-icon.svg`)} />
                Docs
              </div>
            </NavigationMenu.Link>
          </Item>

          {subProductTrigger && subProductsNav && (
            <Item>
              <RadixTrigger className="nav-subproduct" ref={subProductMenuRef}>
                <Trigger icon={subProductTrigger.icon} label={subProductTrigger.label} />
              </RadixTrigger>
              <RadixContent className={styles.content}>
                <SubProductContent {...subProductsNav} />
              </RadixContent>
            </Item>
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
