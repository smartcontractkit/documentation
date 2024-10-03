import { clsx } from "~/lib"
import { useNavBar } from "../../Header/useNavBar/useNavBar"
import DocsPickerDesktop from "./DocsPickerDesktop"
import styles from "./docsNavigationDesktop.module.css"
import QuickLinksModal from "../../Header/Nav/QuickLinksModal"
import { useState } from "react"

function DocsNavigationDesktop({ pathname, children }: { pathname: string; children?: React.ReactNode }) {
  const { $navBarInfo } = useNavBar()
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
        })}
      >
        <div className={styles.container}>
          <div className={styles.left}>
            <DocsPickerDesktop pathname={pathname} />
            {children}
          </div>
          <div className={styles.links}>
            <button className={styles.link} id="quick-links-nav-button" onClick={() => setIsModalOpen(true)}>
              <img height={20} width={20} src="/assets/icons/quick-links.svg" />
              <span>Quick Links</span>
            </button>
            <a
              className={styles.link}
              href="https://github.com/smartcontractkit/documentation"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img height={20} width={20} src="/assets/icons/github-blue.svg" />
              <span>Github</span>
            </a>
          </div>
        </div>
      </nav>
      {isModalOpen && <QuickLinksModal toggleModal={() => setIsModalOpen((state) => !state)} />}
    </>
  )
}

export default DocsNavigationDesktop
