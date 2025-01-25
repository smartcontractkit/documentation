import ProductChainTable from "~/components/QuickLinks/sections/ProductChainTable"
import styles from "./navBar.module.css"

function QuickLinksModal({ toggleModal }: { toggleModal: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={toggleModal}>
      <div className={styles.modalContentWrapper} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={toggleModal}>
          &times;
        </button>
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>
            Quick links for <span>Builders</span>
          </h2>
          <p className={styles.modalDescription}>
            Find all the supported networks at a glance, and the network-specific information you need to build your
            project.
          </p>
          <ProductChainTable />
        </div>
      </div>
    </div>
  )
}

export default QuickLinksModal
