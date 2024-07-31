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
            href: "/ccip",
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
        href: "https://dev.chain.link/resources",
      },
      {
        label: "Learn about Chainlink",
        href: "https://dev.chain.link/products/general",
      },
    ],
  },
  {
    title: "Data Feeds",
    items: [
      {
        ...evmProducts.find((product) => product.title === "Data Feeds"),
        title: "Feeds",
        docs: "/data-feeds",
        links: [
          {
            label: "Docs",
            href: "/data-feeds",
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
        docs: "/data-feeds",
        links: [
          {
            label: "Docs",
            href: "/data-streams",
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
            href: "https://dev.chain.link/products/data",
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
            href: "/chainlink-automation",
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
            href: "/chainlink-functions",
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
          <img src="/images/megamenu-featured.png" alt="" className={styles.featuredImage} />
          <div className={styles.divider}></div>

          <h3>Hardhat CLI for Data Streams</h3>
          <div className={styles.links}>
            <a href="https://docs.chain.link/data-streams/getting-started-hardhat">Docs</a>
          </div>
          <h3>Try out Chainlink Automation</h3>
          <div className={styles.links}>
            <a href="https://docs.chain.link/chainlink-automation/overview/getting-started">Docs</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
