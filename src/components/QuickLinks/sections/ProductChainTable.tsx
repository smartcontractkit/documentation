import TickIcon from "../assets/tick-icon.svg"
import LinkIcon from "../assets/external-link-icon.svg"
import LINKTokenIcon from "../assets/link-token-icon.svg"
import styles from "./ProductChainTable.module.css"
import { chainNames, productChainLinks } from "../data/productChainLinks"

interface ProductData {
  learnMoreLink: string
  logo: { src: string }
  chains: Record<string, string>
}

const allChains = Array.from(
  new Set(
    Object.entries(productChainLinks)
      .filter(([key]) => key !== "linkTokenContracts")
      .flatMap(([, product]) => Object.keys((product as ProductData).chains))
  )
).sort()

const getProductChainLink = (productTitle: string, chainId: string) => {
  return productChainLinks[productTitle]?.chains?.[chainId] || ""
}

const getLINKTokenLink = (chainId: string) => {
  return productChainLinks.linkTokenContracts?.[chainId] || ""
}

const handleLinkClick = (productTitle: string, network: string, url: string) => {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: "quick_link_clicked",
    product: productTitle,
    network,
    url,
  })
}

const ProductCard = ({ chainId }: { chainId: string }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <img
        src={`/assets/chains/${chainId}.svg`}
        alt={`${chainNames[chainId] || chainId} logo`}
        className={styles.networkIcon}
      />
      <h2 className={styles.cardTitle}>{chainNames[chainId] || chainId}</h2>
    </div>
    <div className={styles.productLinks}>
      {Object.entries(productChainLinks).map(([productTitle, productData]) => {
        const productChainLink = getProductChainLink(productTitle, chainId)
        if (!productChainLink) return null
        const product = productData as ProductData
        return (
          <div key={productTitle} className={styles.productItem}>
            <a href={productChainLink} className={styles.productLink} target="_blank" rel="noopener noreferrer">
              <img src={product.logo.src} alt={`${productTitle} logo`} className={styles.icon} />
              <span>{productTitle}</span>
              <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />
            </a>
          </div>
        )
      })}
      {getLINKTokenLink(chainId) && (
        <div className={styles.productItem}>
          <a href={getLINKTokenLink(chainId)} className={styles.productLink} target="_blank" rel="noopener noreferrer">
            <img src={LINKTokenIcon.src} alt="LINK Token Contracts" className={styles.icon} />
            <span>LINK Token Contracts</span>
            <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />
          </a>
        </div>
      )}
    </div>
  </div>
)

const ProductChainTable = () => (
  <div className={styles.responsiveContainer}>
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.networkHeaderCell} ${styles.stickyHeader}`}>Network / Product</th>
            {Object.entries(productChainLinks)
              .filter(([key]) => key !== "linkTokenContracts")
              .map(([productTitle, productData]) => {
                const product = productData as ProductData
                return (
                  <th
                    key={productTitle}
                    title={productTitle}
                    className={`${styles.productHeaderCell} ${styles.stickyHeader}`}
                  >
                    <a
                      href={`/${product.learnMoreLink}`}
                      className={styles.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleLinkClick(productTitle, "Header Row Click", e.currentTarget.href)}
                    >
                      <div className={styles.productHeader}>
                        <img src={product.logo.src} alt={`${productTitle} logo`} className={styles.icon} />
                        {productTitle}
                      </div>
                    </a>
                  </th>
                )
              })}
            <th title="LINK Token Contracts" className={`${styles.linkTokenHeaderCell} ${styles.stickyHeader}`}>
              <a
                href="/resources/link-token-contracts"
                className={styles.productLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleLinkClick("LINK Token Contracts", "Header Row Click", e.currentTarget.href)}
              >
                <div className={styles.productHeader}>
                  <img src={LINKTokenIcon.src} alt="LINK Token Contracts" className={styles.icon} />
                  LINK Token Contracts
                </div>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {allChains.map((chainId) => (
            <tr key={chainId}>
              <td className={styles.networkHeader}>{chainNames[chainId] || chainId}</td>
              {Object.entries(productChainLinks)
                .filter(([key]) => key !== "linkTokenContracts")
                .map(([productTitle]) => {
                  const productChainLink = getProductChainLink(productTitle, chainId)
                  return (
                    <td key={productTitle} className={styles.productCell}>
                      {productChainLink && (
                        <a
                          href={productChainLink}
                          className={styles.cellLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) =>
                            handleLinkClick(productTitle, chainNames[chainId] || chainId, e.currentTarget.href)
                          }
                        >
                          <div className={styles.supportedContainer}>
                            <img src={TickIcon.src} alt="Supported" className={styles.icon} />
                            <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />
                          </div>
                        </a>
                      )}
                    </td>
                  )
                })}
              <td className={styles.productCell}>
                {getLINKTokenLink(chainId) && (
                  <a
                    href={getLINKTokenLink(chainId)}
                    className={styles.cellLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) =>
                      handleLinkClick("LINK Token Contracts", chainNames[chainId] || chainId, e.currentTarget.href)
                    }
                  >
                    <img src={LINKTokenIcon.src} alt="LINK Token Contracts" className={styles.linkTokenIcon} />
                    <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className={styles.cardContainer}>
      {allChains.map((chainId) => (
        <ProductCard key={chainId} chainId={chainId} />
      ))}
    </div>
  </div>
)

export default ProductChainTable
