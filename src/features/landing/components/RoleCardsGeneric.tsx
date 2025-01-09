import type { RoleConfig } from "@config/roles/types"
import { RoleCardGeneric } from "./RoleCardGeneric"
import styles from "./RoleCards.module.css"

interface RoleCardsGenericProps {
  roles: RoleConfig[]
}

export const RoleCardsGeneric = ({ roles }: RoleCardsGenericProps) => {
  return (
    <section className={styles.rolesSection} aria-label="Documentation by Role">
      <div className={styles.rolesContainer}>
        <div className={styles.cardGrid}>
          {roles.map((role) => (
            <RoleCardGeneric key={role.id} role={role} />
          ))}
        </div>
      </div>
    </section>
  )
}
