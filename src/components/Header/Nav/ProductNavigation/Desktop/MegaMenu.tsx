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
    title: "Cross-Chain",
    items: [
      {
        ...(evmProducts.find((product) => product.title === "CCIP") || {}),
        links: [
          {
            label: "Docs",
            href: (evmProducts.find((product) => product.title === "CCIP") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "CCIP") || {})?.learnMoreLink,
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
    title: "Data",
    items: [
      {
        ...evmProducts.find((product) => product.title === "Data Feeds"),
        title: "Data Feeds",
        links: [
          {
            label: "Docs",
            href: (evmProducts.find((product) => product.title === "Data Feeds") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Data Feeds") || {})?.learnMoreLink,
          },
        ],
      },

      {
        ...evmProducts.find((product) => product.title === "Data Streams"),
        title: "Data Streams",
        links: [
          {
            label: "Docs",
            href: (evmProducts.find((product) => product.title === "Data Streams") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Data Streams") || {})?.learnMoreLink,
          },
        ],
      },

      {
        title: "Data resources",
        image: resourcesLogo,
        description: "Global standard for building secure cross-chain applications.",
        learnMoreLink: "data-feeds",
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
            href: (evmProducts.find((product) => product.title === "Automation") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Automation") || {})?.learnMoreLink,
          },
        ],
      },
      {
        ...evmProducts.find((product) => product.title === "Functions"),
        links: [
          {
            label: "Docs",
            href: (evmProducts.find((product) => product.title === "Functions") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "Functions") || {})?.learnMoreLink,
          },
        ],
      },
      {
        ...evmProducts.find((product) => product.title === "VRF"),
        links: [
          {
            label: "Docs",
            href: (evmProducts.find((product) => product.title === "VRF") || {})?.docsLandingLink,
          },
          {
            label: "Learn",
            href: (evmProducts.find((product) => product.title === "VRF") || {})?.learnMoreLink,
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
              <h2 className="label">{section.title}</h2>
              {section.items.map((item, index) => (
                <Fragment key={index}>
                  <div className={styles.megaMenuLink}>
                    {item?.image?.src && <img src={item.image.src} alt={item.title} />}
                    <h3 className="heading-100">{item.title}</h3>
                  </div>
                  <div className={styles.links}>
                    <p className="paragraph-100">{item.description}</p>
                    {item.links.map((link, index) => (
                      <Fragment key={index}>
                        <a href={link.href} className="text-100">
                          {link.label}
                        </a>
                        {index < item.links.length - 1 && <span className={styles.verticalDivider}></span>}
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
              {section.bottomLinks && (
                <div className={styles.bottomLinks}>
                  {section.bottomLinks.map((link, index) => (
                    <div className="label" key={index}>
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
          <h2 className="label">Featured</h2>
          <a href="/chainlink-local">
            <img src="/images/megamenu-featured.jpg" alt="" className={styles.featuredImage} />
          </a>
          <div className={styles.divider}></div>

          <h3 className="heading-100">Hardhat CLI for Data Streams</h3>
          <div className={styles.links}>
            <a href="/data-streams/getting-started-hardhat" className="text-100">
              Docs
            </a>
          </div>
          <h3 className="heading-100">Try out Chainlink Automation</h3>
          <div className={styles.links}>
            <a href="/chainlink-automation/overview/getting-started" className="text-100">
              Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MegaMenu
