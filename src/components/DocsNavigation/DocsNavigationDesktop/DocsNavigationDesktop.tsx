import { clsx } from "~/lib/clsx/clsx.ts"
import { useNavBar } from "../../Header/useNavBar/useNavBar.ts"
import styles from "./docsNavigationDesktop.module.css"
import QuickLinksModal from "../../Header/Nav/QuickLinksModal.tsx"
import { useState } from "react"
import { PageIcon, MailIcon } from "./Icons/index.ts"

function DocsNavigationDesktop({
  pathname,
  children,
  isCcipDirectory = false,
}: {
  pathname: string
  children?: React.ReactNode
  isCcipDirectory?: boolean
}) {
  const { $navBarInfo } = useNavBar()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Check if we're in a CCIP Directory page
  const isCcipPage = isCcipDirectory || pathname.includes("/ccip/directory/")

  return (
    <>
      <nav
        className={clsx(styles.nav, {
          [styles.hidden]: $navBarInfo.hidden,
        })}
      >
        <div className={styles.container}>
          <div className={styles.left}>{children}</div>
          <div className={styles.links}>
            {isCcipPage ? (
              /* Custom links for CCIP Directory pages */
              <>
                <a className={styles.ccipDirectoryLink} href="/ccip" target="_blank" rel="noopener noreferrer">
                  <PageIcon />
                  <span>Go to CCIP docs</span>
                </a>
                <a
                  className={styles.ccipDirectoryLink}
                  href="https://chain.link/ccip-contact"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MailIcon />
                  <span>Talk to a CCIP expert</span>
                </a>
              </>
            ) : (
              /* Default links for other documentation pages */
              <>
                <button
                  className={styles.link}
                  id="quick-links-nav-button"
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Open quick links menu"
                >
                  <img height={20} width={20} src="/assets/icons/quick-links.svg" alt="Quick links menu" />
                  <span>Quick Links</span>
                </button>
                <a
                  className={styles.link}
                  href="https://github.com/smartcontractkit/documentation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img height={20} width={20} src="/assets/icons/github-blue.svg" alt="GitHub repository" />
                  <span>Github</span>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
      {isModalOpen && <QuickLinksModal toggleModal={() => setIsModalOpen((state) => !state)} />}
    </>
  )
}

export default DocsNavigationDesktop
