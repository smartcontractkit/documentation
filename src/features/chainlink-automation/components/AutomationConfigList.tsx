/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { Aside } from "@components"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
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
      <SectionWrapper
        title={technologyTitle}
        idOverride={slugger.slug(technologyTitle)}
        depth={3}
        updateTOC={false}
        key={technology}
      >
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

          if (title == "Fantom") {
            return (
              <SectionWrapper
                title={title}
                idOverride={slugger.slug(title)}
                depth={4}
                updateTOC={false}
                key={supportedChain}
              >
                <Aside type="note" title="New Fantom upkeeps not supported">
                  Creating new Fantom upkeeps is no longer supported. Existing Fantom upkeeps are still supported.
                </Aside>
                <AutomationConfig
                  config={config}
                  registryAddress={registryAddress}
                  getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                />
              </SectionWrapper>
            )
          } else {
            return (
              <SectionWrapper
                title={title}
                idOverride={slugger.slug(title)}
                depth={4}
                updateTOC={false}
                key={supportedChain}
              >
                <AutomationConfig
                  config={config}
                  registryAddress={registryAddress}
                  getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                />
              </SectionWrapper>
            )
          }
        })}
      </SectionWrapper>
    )
  })
}
