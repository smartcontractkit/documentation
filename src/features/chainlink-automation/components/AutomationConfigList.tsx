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
    return !technologyTitle ? (
      <p />
    ) : (
      <>
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

        const h3Slug = slugger.slug(title)

        return (
          <section id={h3Slug} key={supportedChain}>
            <h3 id={h3Slug}>{title}</h3>
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
