import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { ProductsNav, SubProductsNav } from "../../config"
import { Divider } from "../../Divider"
import { isMatchedPath } from "../../isMatchedPath"
import { clsx } from "../../utils"
import { extendRadixComponent } from "../extendRadixComponent"
import styles from "./productNavigation.module.css"
import { SubProductContent } from "./SubProductContent"
import { Trigger } from "./Trigger"
import externalArrow from "../../../../../assets/icons/external-arrow.svg"

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

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : undefined

  return (
    <>
      <Root className={clsx(styles.root, styles.alignLeft)}>
        <List className={styles.list}>
          <Item>
            <RadixTrigger className="nav-subproduct" ref={subProductMenuRef}>
              <Trigger icon={icon} label={label} />
            </RadixTrigger>
            {(subProductTrigger || label === "Resources") && subProductsNav && (
              <RadixContent className={styles.content}>
                <SubProductContent subProductsNav={subProductsNav} />
              </RadixContent>
            )}
          </Item>
          <Indicator className={styles.indicator}>
            <div className={styles.arrow} />
          </Indicator>
        </List>

        <div className={styles.viewportPosition}>
          <Viewport className={styles.navigationViewport} />
        </div>
        <Divider className={styles.divider} />
        <NavigationMenu.Link className={styles.button} href="https://dev.chain.link" target="_blank">
          Developer Hub
          <div>
            <img src={externalArrow.src}></img>
          </div>
        </NavigationMenu.Link>
      </Root>
    </>
  )
}
