import { clsx } from "~/lib/clsx/clsx.ts"
import { useNavBar } from "../../Header/useNavBar/useNavBar.ts"
import DocsPickerMobile from "./DocsPickerMobile.tsx"
import styles from "./docsNavigationMobile.module.css"

function DocsNavigationMobile({ pathname, children }: { pathname: string; children?: React.ReactNode }) {
  const { $navBarInfo } = useNavBar()
  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
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
