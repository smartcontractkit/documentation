import TickIcon from "../assets/tick-icon.svg"
import LinkIcon from "../assets/external-link-icon.svg"
import LINKTokenIcon from "../assets/link-token-icon.svg"
import styles from "./ProductChainTable.module.css"
import { evmProducts } from "../../../features/landing/data/index"
import { productChainLinks } from "../data/productChainLinks"

const allChains = Array.from(
  new Set(evmProducts.flatMap((product) => product.chains.map((chain) => chain.title)))
).sort()

const getProductChainLink = (productTitle: string, chainId: string) => {
  return productChainLinks[productTitle]?.[chainId] || ""
}

const getLINKTokenLink = (chainId: string) => {
  return productChainLinks.linkTokenContracts?.[chainId] || ""
}

const ProductCard = ({ chain, chainId }: { chain: string; chainId: string }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>{chain}</h3>
    <div className={styles.productLinks}>
      {evmProducts.map((product) => {
        const productChainLink = getProductChainLink(product.title, chainId)
        if (!productChainLink) return null
        return (
          <div key={product.title} className={styles.productItem}>
            <a href={productChainLink} className={styles.productLink}>
              <img src={product.image.src} alt={`${product.title} logo`} className={styles.icon} />
              <span>{product.title}</span>
              {productChainLink && <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />}
            </a>
          </div>
        )
      })}
      {getLINKTokenLink(chain.toLowerCase().replace(/\s+/g, "-")) && (
        <div className={styles.productItem}>
          <a href={getLINKTokenLink(chain.toLowerCase().replace(/\s+/g, "-"))} className={styles.productLink}>
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
            {evmProducts.map((product) => (
              <th
                key={product.title}
                title={product.title}
                className={`${styles.productHeaderCell} ${styles.stickyHeader}`}
              >
                <a href={`/${product.learnMorelink}`} className={styles.productLink}>
                  <div className={styles.productHeader}>
                    <img src={product.image.src} alt={`${product.title} logo`} className={styles.icon} />
                    {product.title}
                  </div>
                </a>
              </th>
            ))}
            <th title="LINK Token Contracts" className={`${styles.linkTokenHeaderCell} ${styles.stickyHeader}`}>
              <a href="/resources/link-token-contracts" className={styles.productLink}>
                <div className={styles.productHeader}>
                  <img src={LINKTokenIcon.src} alt="LINK Token Contracts" className={styles.icon} />
                  LINK Token Contracts
                </div>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          {allChains.map((chain) => (
            <tr key={chain}>
              <td className={styles.networkHeader}>{chain}</td>
              {evmProducts.map((product) => {
                const chainInfo = product.chains.find((c) => c.title === chain)
                const chainId = chainInfo ? chainInfo.id : null
                const productChainLink = chainId ? getProductChainLink(product.title, chainId) : ""
                return (
                  <td key={product.title} className={styles.productCell}>
                    {chainId && (
                      <a href={productChainLink} className={styles.cellLink}>
                        <div className={styles.supportedContainer}>
                          <img src={TickIcon.src} alt="Supported" className={styles.icon} />
                          {productChainLink && <img src={LinkIcon.src} alt="More info" className={styles.linkIcon} />}
                        </div>
                      </a>
                    )}
                  </td>
                )
              })}
              <td className={styles.productCell}>
                {getLINKTokenLink(chain.toLowerCase().replace(/\s+/g, "-")) && (
                  <a href={getLINKTokenLink(chain.toLowerCase().replace(/\s+/g, "-"))} className={styles.cellLink}>
                    <img src={LINKTokenIcon.src} alt="LINK Token Contracts" className={styles.linkIcon} />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className={styles.cardContainer}>
      {allChains.map((chain) => {
        const chainId = chain.toLowerCase().replace(/\s+/g, "-")
        return <ProductCard key={chain} chain={chain} chainId={chainId} />
      })}
    </div>
  </div>
)

export default ProductChainTable
