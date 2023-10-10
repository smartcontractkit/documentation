/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import GithubSlugger from "github-slugger"
import SectionWrapper from "~/components/PageContent/SectionWrapper"

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
      <SectionWrapper depth={3} title={technologyTitle} id={h3Slug} key={technology} updateTOC={false}>
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
            <SectionWrapper depth={4} title={title} id={h4Slug} key={supportedChain} updateTOC={false}>
              <AutomationConfig
                config={config}
                registryAddress={registryAddress}
                getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
              />
            </SectionWrapper>
          )
        })}
      </SectionWrapper>
    )
  })
}
