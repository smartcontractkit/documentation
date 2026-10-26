import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { SubProductsNav } from "../../config.tsx"
import { clsx } from "../../utils.ts"
import { extendRadixComponent } from "../extendRadixComponent.ts"
import styles from "./productNavigation.module.css"
import { CaretIcon } from "../CaretIcon.tsx"
import MegaMenu from "./MegaMenu.tsx"
import MegaMenuContainer from "./MegaMenuContainer.tsx"
import { SOLUTIONS_HUB_ENABLED } from "~/config/solutions/hub.ts"

type Props = {
  setNavMenuOpen: (navMenuOpen: boolean) => void
  subProductsNav?: SubProductsNav
  showMegaMenu: () => void
  isMegamenuOpen: boolean
  exitMegamenu: () => void
  path: string
}

const Root = extendRadixComponent(NavigationMenu.Root)
const List = extendRadixComponent(NavigationMenu.List)
const Item = extendRadixComponent(NavigationMenu.Item)

export const ProductNavigation = ({ setNavMenuOpen, showMegaMenu, isMegamenuOpen, exitMegamenu, path }: Props) => {
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
  // "Docs" is active everywhere except on Solutions pages, where "Solutions" takes
  // the indicator.
  const isSolutionsPage = SOLUTIONS_HUB_ENABLED && path.startsWith("/solutions")
  React.useEffect(() => setNavMenuOpen(productMenuOpen || subProductMenuOpen), [productMenuOpen, subProductMenuOpen])

  return (
    <>
      <Root className={clsx(styles.root, styles.alignLeft)}>
        <List className={styles.list}>
          <Item onMouseEnter={exitMegamenu}>
            <a
              className={clsx(styles.navLink, { [styles.active]: !isSolutionsPage })}
              href="/"
              onMouseEnter={showMegaMenu}
              role="button"
              aria-expanded={isMegamenuOpen}
              aria-controls="mega-menu"
              aria-label="Docs menu"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              Docs <CaretIcon aria-hidden />
            </a>
          </Item>
          {SOLUTIONS_HUB_ENABLED && (
            <Item>
              <NavigationMenu.Link
                className={clsx(styles.navLink, { [styles.active]: isSolutionsPage })}
                href="/solutions"
              >
                Solutions
              </NavigationMenu.Link>
            </Item>
          )}
          <Item>
            <NavigationMenu.Link className={styles.navLink} href="/changelog">
              Changelog
            </NavigationMenu.Link>
          </Item>
          <Item>
            <NavigationMenu.Link className={styles.navLink} href="/certification">
              Get Certified
            </NavigationMenu.Link>
          </Item>
        </List>
        {isMegamenuOpen && (
          <MegaMenuContainer id="mega-menu" cancel={exitMegamenu}>
            <MegaMenu cancel={exitMegamenu} />
          </MegaMenuContainer>
        )}
      </Root>
    </>
  )
}
