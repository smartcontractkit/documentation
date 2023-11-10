import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import React from "react"
import { ProductItem } from "../../config"
import { ArrowIcon } from "./ArrowIcon"
import { Category } from "./Category"
import { HubIcon } from "./HubIcon"
import styles from "./productContent.module.css"

type Props = { categories: { label: string; items: ProductItem[] }[] }

export const ProductContent = ({ categories }: Props) => (
  <div className={styles.content}>
    <ul>
      {categories.map(({ label, items }) => (
        <Category key={label} label={label} items={items} className="product-link" />
      ))}
    </ul>

    <div className={styles.callout}>
      <NavigationMenu.Link className={styles.callout} asChild>
        <a rel="noreferrer" target="blank" className="nav-cta" href="https://dev.chain.link">
          <div className={styles.heading}>
            <HubIcon />
            <h6>Developer Hub</h6>
            <p className="paragraph-100">Discover the latest product news, deep dives, developer tutorials, and more</p>
          </div>
          <span className={styles.link}>
            Explore all resources
            <ArrowIcon />
          </span>
        </a>
      </NavigationMenu.Link>
    </div>
  </div>
)
