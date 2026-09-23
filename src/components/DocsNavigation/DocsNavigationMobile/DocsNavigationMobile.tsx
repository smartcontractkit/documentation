import { clsx } from "~/lib/clsx/clsx.ts"
import { useNavBar } from "../../Header/useNavBar/useNavBar.ts"
import DocsPickerMobile from "./DocsPickerMobile.tsx"
import styles from "./docsNavigationMobile.module.css"

function DocsNavigationMobile({
  pathname,
  children,
  hideAtDesktopSidebar = false,
}: {
  pathname: string
  children?: React.ReactNode
  hideAtDesktopSidebar?: boolean
}) {
  const { $navBarInfo } = useNavBar()
  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
          [styles.hideAtDesktopSidebar]: hideAtDesktopSidebar,
        })}
      >
        <div className={styles.DocsPickerContainer}>
          <DocsPickerMobile path={pathname} />
          {children}
        </div>
      </nav>
    </>
  )
}

export default DocsNavigationMobile
