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
    const technologyTitle = config.title
    return !technologyTitle ? (
      <p />
    ) : (
      <div key={technology}>
        <h3 id={slugger.slug(technologyTitle)}>{technologyTitle}</h3>
        {Object.keys(config.chains).map((supportedChain: SupportedChain) => {
          const title = getTitle(supportedChain)
          const explorerUrl = getExplorer(supportedChain)
          const registryAddress = automationAddresses[supportedChain]
            ? automationAddresses[supportedChain].registryAddress
            : ""
          return !title ? (
            <p />
          ) : (
            <div key={supportedChain}>
              <h4 id={slugger.slug(title)}>{title}</h4>
              {technologyTitle === "Optimism" && (
                <aside class="content note astro-DUQFCLOB" aria-label="Optimism Bedrock Upgrade">
                  <div class="icon astro-DUQFCLOB">
                    <img
                      src="/_astro/info-icon.ca56bc94.svg"
                      style="width: 1.5em;height: 1.5em;"
                      alt="note"
                      class="astro-DUQFCLOB"
                    ></img>
                  </div>
                  <section class="asideContent astro-DUQFCLOB">
                    <p class="title heading-100 astro-DUQFCLOB" aria-hidden="true">
                      Optimism Bedrock Upgrade
                    </p>
                    <p>
                      Optimism Bedrock mainnet feeds and Chainlink Automation services are now live and ready for
                      consumption. Let us know if you experience any issues or have any questions.
                    </p>
                  </section>
                </aside>
              )}
              <AutomationConfig
                config={chainlinkAutomationConfig[supportedChain]}
                registryAddress={registryAddress}
                getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
              />
            </div>
          )
        })}
      </div>
    )
  })
}
