import styles from "./megaMenu.module.css"
import { Fragment } from "react/jsx-runtime"
import { megaMenuSections } from "../Desktop/MegaMenu"
import { useState } from "react"

function MegaMenu() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.resourcesMenuContentMain}>
        {megaMenuSections.map((section) => (
          <div className={styles.resourcesMenuContentRow} key={section.title}>
            <h2 className="label">{section.title}</h2>
            {section.items.map((item, index) => (
              <MegaMenuItem
                key={index}
                image={item.image?.src}
                title={item?.title}
                description={item.description}
                links={item.links}
              />
            ))}
          </div>
        ))}

        <div className={styles.bottomLinks}>
          <div className="label">
            <a href="https://dev.chain.link/resources" target="_blank" rel="noopener noreferrer">
              View all resources
            </a>
            <img src="/images/tabler_arrow-up.svg" alt="" />
          </div>
          <div className="label">
            <a href="https://dev.chain.link/products/general" target="_blank" rel="noopener noreferrer">
              Learn about Chainlink
            </a>
            <img src="/images/tabler_arrow-up.svg" alt="" />
          </div>
        </div>
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
  )
}

function MegaMenuItem({
  image,
  title,
  description,
  links,
}: {
  image?: string
  title?: string
  description?: string
  links: { label: string; href: string | undefined }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={styles.megaMenuButton} onClick={() => setOpen((state) => !state)}>
        <div className={styles.megaMenuLink}>
          <img src={image} alt={title} />
          <h3 className="heading-100">{title}</h3>
        </div>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && (
        <div className={styles.links}>
          <p className="paragraph-100">{description}</p>
          {links.map((link, index) => (
            <Fragment key={index}>
              <a href={link.href} className="text-100">
                {link.label}
              </a>
              {index < links.length - 1 && <span className={styles.verticalDivider}></span>}
            </Fragment>
          ))}
        </div>
      )}
    </>
  )
}

export default MegaMenu
