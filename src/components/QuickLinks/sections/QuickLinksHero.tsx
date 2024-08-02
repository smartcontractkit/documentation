import styles from "./QuickLinksHero.module.css"

const QuickLinksHero = () => {
  return (
    <section id="quick-links-hero" className={styles.quickLinksHero}>
      <div>
        <a href="/" className={styles.backLink}>
          &larr; Docs home page
        </a>
        <h2>
          Quick links for <span>Builders</span>
        </h2>
        <p>
          Find all the supported networks at a glance, and the network-specific information you need to build your
          project.
        </p>
      </div>
    </section>
  )
}

export default QuickLinksHero
