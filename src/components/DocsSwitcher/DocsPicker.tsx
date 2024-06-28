import { MENU } from "~/config"
import { ProductNavigation } from "../Header/Nav/ProductNavigation/ProductNavigation"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { extendRadixComponent } from "@chainlink/components/src/extendRadixComponent"
import { SubProductContent } from "../Header/Nav/ProductNavigation/Desktop/SubProductContent"
import { useEffect, useMemo, useRef, useState } from "react"
import { isMatchedPath } from "../Header/Nav/isMatchedPath"
import { getNavigationProps } from "../Header/getNavigationProps"
import styles from "./docsPicker.module.css"
import { clsx } from "../Header/Nav/utils"
import { Trigger } from "../Header/Nav/ProductNavigation/Desktop/Trigger"
const Root = extendRadixComponent(NavigationMenu.Root)
const List = extendRadixComponent(NavigationMenu.List)
const Indicator = extendRadixComponent(NavigationMenu.Indicator)
const Item = extendRadixComponent(NavigationMenu.Item)
const Viewport = extendRadixComponent(NavigationMenu.Viewport)
const RadixTrigger = extendRadixComponent(NavigationMenu.Trigger)
const RadixContent = extendRadixComponent(NavigationMenu.Content)

function DocsPicker() {
  const productMenuRef = useRef<HTMLButtonElement>(null)
  const productMenuDataset = productMenuRef.current?.dataset ?? {}
  const productMenuOpen = useMemo(() => productMenuDataset.state === "open", [productMenuDataset.state])
  const subProductMenuRef = useRef<HTMLButtonElement>(null)
  const subProductMenuDataset = subProductMenuRef.current?.dataset ?? {}
  const subProductMenuOpen = useMemo(() => subProductMenuDataset.state === "open", [subProductMenuDataset.state])
  const [navMenuOpen, setNavMenuOpen] = useState(false)

  useEffect(() => setNavMenuOpen(productMenuOpen || subProductMenuOpen), [productMenuOpen, subProductMenuOpen])
  const { subProductsNav } = getNavigationProps("/data-feeds")
  const subProductTrigger = subProductsNav?.find(({ href }) => isMatchedPath("/data-feeds", href))
  console.log(subProductTrigger)

  const label = subProductTrigger?.label || "Resources"
  const icon = subProductTrigger?.label ? subProductTrigger.icon : undefined
  // MENU
  return (
    <Root className={clsx(styles.root, styles.alignLeft)}>
      <List className={styles.list}>
        <Item>
          <RadixTrigger className="nav-subproduct" ref={subProductMenuRef}>
            <Trigger icon={icon} label={label} />
          </RadixTrigger>
          {(subProductTrigger || label === "Resources") && subProductsNav && (
            <RadixContent className={styles.content}>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                  listStyle: "none",
                  padding: "var(--space-2x)",
                  width: "240px",
                }}
              >
                <li className={styles.item}>
                  {subProductsNav
                    .filter((item) => !item.hideFromDropdown)
                    .map((item) => (
                      <NavigationMenu.Link key={item.label} asChild>
                        <a className={clsx(styles.link, "subproduct-link")} href={item.href}>
                          <img className={clsx(styles.icon, "subproduct-icon")} src={item.icon}></img>
                          {item.label}
                        </a>
                      </NavigationMenu.Link>
                    ))}
                </li>
              </ul>
            </RadixContent>
          )}
          <RadixContent className={styles.content}>
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "0",
                listStyle: "none",
                padding: "var(--space-2x)",
                width: "240px",
              }}
            >
              <li className={styles.item}>
                {subProductsNav
                  .filter((item) => !item.hideFromDropdown)
                  .map((item) => (
                    <NavigationMenu.Link key={item.label} asChild>
                      <a className={clsx(styles.link, "subproduct-link")} href={item.href}>
                        <img className={clsx(styles.icon, "subproduct-icon")} src={item.icon}></img>
                        {item.label}
                      </a>
                    </NavigationMenu.Link>
                  ))}
              </li>
            </ul>
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
  )
}

export default DocsPicker
