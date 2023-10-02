/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import GithubSlugger from "github-slugger"

export const AutomationConfigList = () => {
  const slugger = new GithubSlugger()
  const normalizedConfig = normalizeConfig(chainlinkAutomationConfig)
  return Object.keys(normalizedConfig).map((technology: SupportedTechnology) => {
    const config = normalizedConfig[technology]
    const technologyTitle = config?.title
    const h3Slug = technologyTitle ? slugger.slug(technologyTitle) : ""
    return !technologyTitle ? (
      <p />
    ) : (
      <>
        <section key={technology} id={h3Slug}>
          <h3 id={h3Slug}>{technologyTitle}</h3>
        </section>
        {Object.keys(config.chains).map((supportedChain: SupportedChain) => {
          const title = getTitle(supportedChain)
          const explorerUrl = getExplorer(supportedChain)
          const registryAddress = automationAddresses[supportedChain]
            ? automationAddresses[supportedChain]?.registryAddress
            : ""

          const config = chainlinkAutomationConfig[supportedChain]

          if (!(title && config && registryAddress && explorerUrl)) {
            return null
          }

          const h4Slug = slugger.slug(title)

          return (
            <section key={supportedChain} id={h4Slug}>
              <h4 id={h4Slug}>{title}</h4>
              {
                <AutomationConfig
                  config={config}
                  registryAddress={registryAddress}
                  getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                />
              }
            </section>
          )
        })}
      </>
    )
  })
}
