import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { SubProductsNav } from "../../config"
import { clsx } from "../../utils"
import { extendRadixComponent } from "../extendRadixComponent"
import styles from "./productNavigation.module.css"
import { CaretIcon } from "../CaretIcon"

type Props = {
  setNavMenuOpen: (navMenuOpen: boolean) => void
  subProductsNav?: SubProductsNav
  showMegaMenu: () => void
  isMegamenuOpen: boolean
  exitMegamenu: () => void
}

const Root = extendRadixComponent(NavigationMenu.Root)
const List = extendRadixComponent(NavigationMenu.List)
const Item = extendRadixComponent(NavigationMenu.Item)

export const ProductNavigation = ({ setNavMenuOpen, showMegaMenu, isMegamenuOpen, exitMegamenu }: Props) => {
  const productMenuRef = React.useRef<HTMLButtonElement>(null)
  const productMenuDataset = productMenuRef.current?.dataset ?? {}
  const productMenuOpen = React.useMemo(() => productMenuDataset.state === "open", [productMenuDataset.state])
  const subProductMenuRef = React.useRef<HTMLButtonElement>(null)
  const subProductMenuDataset = subProductMenuRef.current?.dataset ?? {}
  const subProductMenuOpen = React.useMemo(() => subProductMenuDataset.state === "open", [subProductMenuDataset.state])
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      if (isMegamenuOpen) {
        exitMegamenu()
      } else {
        showMegaMenu()
      }
    }
  }

  React.useEffect(() => setNavMenuOpen(productMenuOpen || subProductMenuOpen), [productMenuOpen, subProductMenuOpen])

  return (
    <>
      <Root className={clsx(styles.root, styles.alignLeft)}>
        <List className={styles.list}>
          <Item>
            <a
              className={clsx(styles.navLink, {
                [styles.active]: isMegamenuOpen,
              })}
              onMouseEnter={showMegaMenu}
              role="button"
              aria-expanded={isMegamenuOpen}
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              Resources <CaretIcon aria-hidden />
            </a>
          </Item>
          <Item onMouseEnter={exitMegamenu}>
            <NavigationMenu.Link className={styles.navLink} href="https://dev.chain.link" target="_blank">
              Docs
            </NavigationMenu.Link>
          </Item>
          <Item>
            <NavigationMenu.Link className={styles.navLink} href="https://dev.chain.link" target="_blank">
              Demos
            </NavigationMenu.Link>
          </Item>
          <Item>
            <NavigationMenu.Link className={styles.navLink} href="https://dev.chain.link" target="_blank">
              Tools
            </NavigationMenu.Link>
          </Item>
          <Item>
            <NavigationMenu.Link className={styles.navLink} href="https://dev.chain.link" target="_blank">
              ChainLog
            </NavigationMenu.Link>
          </Item>
        </List>
      </Root>
      {/* <MegaMenu /> */}
    </>
  )
}
