import * as Dialog from "@radix-ui/react-dialog"
import { useEffect, useState } from "react"
import type { ResolvedNavGroup } from "~/utils/solutions.ts"
import styles from "./solutionMobileNavigation.module.css"

interface Props {
  title: string
  groups: ResolvedNavGroup[]
  currentPage: string
}

export default function SolutionMobileNavigation({ title, groups, currentPage }: Props) {
  const [open, setOpen] = useState(false)
  const normalizedPage = currentPage.replace(/\/$/, "")

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 50em)")
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={styles.trigger}
        aria-label={`Browse ${title} pages`}
        data-testid="solution-navigation-trigger-mobile"
      >
        <span>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close solution navigation">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          </div>

          <nav className={styles.pages} aria-label={`${title} pages`}>
            {groups.map((group) => (
              <section key={group.section}>
                <h3 className={styles.groupTitle}>{group.section}</h3>
                <ul>
                  {group.contents.map((page) => (
                    <li key={page.url}>
                      <Dialog.Close asChild>
                        <a
                          className={styles.link}
                          href={`/${page.url}`}
                          aria-current={`/${page.url}` === normalizedPage ? "page" : undefined}
                        >
                          {page.title}
                        </a>
                      </Dialog.Close>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
