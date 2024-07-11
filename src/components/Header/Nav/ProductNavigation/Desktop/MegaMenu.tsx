import { evmProducts } from "~/features/landing/data"
import styles from "./megaMenu.module.css"
import resourcesLogo from "../../../../../assets/product-logos/data-resources-logo.svg"
import { Fragment } from "react/jsx-runtime"
import { useEffect } from "react"

interface MegaMenuProps {
  cancel: () => void
}

export const megaMenuSections = [
  {
    title: "Cross Chain",
    items: [
      {
        ...(evmProducts.find((product) => product.title === "CCIP") || {}),
        links: [
          {
            label: "Docs",
            href: "/ccip/getting-started",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "CCIP") || {})?.learnMorelink,
          },
        ],
      },
    ],
    bottomLinks: [
      {
        label: "View all resources",
        href: "/cross-chain",
      },
      {
        label: "Learn about Chainlink",
        href: "#",
      },
    ],
  },
  {
    title: "Data Feeds",
    items: [
      {
        ...evmProducts.find((product) => product.title === "Data Feeds"),
        title: "Feeds",
        docs: "/data-feeds/getting-started",
        links: [
          {
            label: "Docs",
            href: "/data-feeds/getting-started",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Data Feeds") || {})?.learnMorelink,
          },
        ],
      },

      {
        ...evmProducts.find((product) => product.title === "Data Streams"),
        title: "Streams",
        docs: "/data-feeds/getting-started",
        links: [
          {
            label: "Docs",
            href: "/data-feeds/getting-started",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Data Streams") || {})?.learnMorelink,
          },
        ],
      },

      {
        title: "Data resources",
        image: resourcesLogo,
        description: "Global standard for building secure cross-chain applications.",
        learnMorelink: "data-feeds",
        links: [
          {
            label: "Learn",
            href: "/data-feeds",
          },
        ],
      },
    ],
  },
  {
    title: "Compute",
    items: [
      {
        ...evmProducts.find((product) => product.title === "Automation"),
        links: [
          {
            label: "Docs",
            href: "/chainlink-automation/getting-started",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Automation") || {})?.learnMorelink,
          },
        ],
      },
      {
        ...evmProducts.find((product) => product.title === "Functions"),
        links: [
          {
            label: "Docs",
            href: "/chainlink-functions/getting-started",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Functions") || {})?.learnMorelink,
          },
        ],
      },
      {
        ...evmProducts.find((product) => product.title === "VRF"),
        links: [
          {
            label: "Docs",
            href: "/vrf",
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "VRF") || {})?.learnMorelink,
          },
        ],
      },
    ],
  },
]

function MegaMenu({ cancel }: MegaMenuProps) {
  useEffect(() => {
    const onESC = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        cancel()
      }
    }
    window.addEventListener("keyup", onESC, false)
    return () => {
      window.addEventListener("keyup", onESC, false)
    }
  }, [])

  return (
    <div className={styles.megaMenuContainer}>
      <div className={styles.wrapper} onMouseLeave={cancel}>
        <div className={styles.resourcesMenuContentMain}>
          {megaMenuSections.map((section) => (
            <div className={styles.resourcesMenuContentRow} key={section.title}>
              <h2>{section.title}</h2>
              {section.items.map((item, index) => (
                <Fragment key={index}>
                  <div className={styles.megaMenuLink}>
                    <img src={item.image.src} alt={item.title} />
                    <h3>{item.title}</h3>
                  </div>
                  <div className={styles.links}>
                    <p>{item.description}</p>
                    {item.links.map((link, index) => (
                      <Fragment key={index}>
                        <a href={link.href}>{link.label}</a>
                        {index < item.links.length - 1 && <span className={styles.verticalDivider}></span>}
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
              {section.bottomLinks && (
                <div className={styles.bottomLinks}>
                  {section.bottomLinks.map((link, index) => (
                    <div className={styles.bottomLink} key={index}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                      <img src="/images/tabler_arrow-up.svg" alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.resourcesMenuContentFeatured}>
          <h2>Featured</h2>
          <img src="/images/quick-start.png" alt="" className={styles.featuredImage} />
          <div className={styles.divider}></div>

          <h3>Blockchain 101</h3>
          <div className={styles.links}>
            <a href="">Docs</a>
            <span className={styles.verticalDivider}></span>
            <a href="">SDK</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
