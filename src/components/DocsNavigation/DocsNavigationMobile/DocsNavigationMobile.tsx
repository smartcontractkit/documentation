import { clsx } from "~/lib/clsx/clsx.ts"
import { useNavBar } from "../../Header/useNavBar/useNavBar.ts"
import DocsPickerMobile from "./DocsPickerMobile.tsx"
import styles from "./docsNavigationMobile.module.css"

function DocsNavigationMobile({
  pathname,
  children,
  parentSection = null,
}: {
  pathname: string
  children?: React.ReactNode
  parentSection?: string | null
}) {
  const { $navBarInfo } = useNavBar()
  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
        })}
      >
        <div className={styles.DocsPickerContainer}>
          <DocsPickerMobile path={pathname} parentSection={parentSection} />
          {children}
        </div>
      </nav>
    </>
  )
}

export default DocsNavigationMobile
