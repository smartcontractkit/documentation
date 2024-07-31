import { clsx } from "~/lib"
import { useNavBar } from "../../Header/useNavBar/useNavBar"
import DocsPickerMobile from "./DocsPickerMobile"
import styles from "./docsNavigationMobile.module.css"

function DocsNavigationDesktop({ pathname }: { pathname: string }) {
  const { $navBarInfo } = useNavBar()
  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
        })}
      >
        <div className={styles.container}>
          <DocsPickerMobile path={pathname} />
        </div>
      </nav>
    </>
  )
}

export default DocsNavigationDesktop
