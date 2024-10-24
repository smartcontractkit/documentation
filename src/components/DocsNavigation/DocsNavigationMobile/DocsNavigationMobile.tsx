import { clsx } from "~/lib"
import { useNavBar } from "../../Header/useNavBar/useNavBar"
import DocsPickerMobile from "./DocsPickerMobile"
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
