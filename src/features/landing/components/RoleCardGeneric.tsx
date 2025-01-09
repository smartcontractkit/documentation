import React from "react"
import type { RoleConfig } from "@config/roles/types"
import { roleIconMap } from "@assets/role-icons"
import styles from "./RoleCards.module.css"

interface RoleCardGenericProps {
  role: RoleConfig
}

export const RoleCardGeneric = ({ role }: RoleCardGenericProps) => {
  const { title, description, iconType, links } = role

  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.type]) {
      acc[link.type] = []
    }
    acc[link.type].push(link)
    return acc
  }, {} as Record<string, typeof links>)

  return (
    <article className={styles.card} role="region" aria-labelledby={`${role.id}-title`}>
      <div className={styles.cardInner}>
        <header className={styles.cardHeader}>
          <div className={styles.iconWrapper}>
            {iconType && (
              <img src={roleIconMap[iconType]} alt="" className={styles.cardIcon} aria-hidden="true" loading="lazy" />
            )}
          </div>
          <h2 id={`${role.id}-title`} className={styles.cardTitle}>
            {title}
          </h2>
        </header>

        <p className={styles.cardDescription}>{description}</p>

        <nav className={styles.linkGroups} aria-label={`${title} navigation`}>
          {Object.entries(groupedLinks).map(([type, typeLinks]) => (
            <div key={type} className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              <ul className={styles.linkList} role="list">
                {typeLinks.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} className={styles.link} onClick={(e) => e.currentTarget.blur()}>
                      <span className={styles.linkText}>{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </article>
  )
}
