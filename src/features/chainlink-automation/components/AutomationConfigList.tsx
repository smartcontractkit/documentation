/** @jsxImportSource preact */
import { AutomationConfig, chainlinkAutomationConfig, automationAddresses } from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import { getTitle, getExplorer, getExplorerAddressUrl, normalizeConfig } from "@features/utils"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"

export const AutomationConfigList = () => {
  const normalizedConfig = normalizeConfig(chainlinkAutomationConfig)
  return Object.keys(normalizedConfig).map((technology: SupportedTechnology) => {
    const config = normalizedConfig[technology]
    const technologyTitle = config?.title
    return !technologyTitle ? (
      <p />
    ) : (
      <SectionWrapper title={technologyTitle} depth={3} updateTOC={false} key={technology}>
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

          return (
            <SectionWrapper title={title} depth={4} updateTOC={false} key={supportedChain}>
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
