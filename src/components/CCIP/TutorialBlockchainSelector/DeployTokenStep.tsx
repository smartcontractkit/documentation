import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { ContractAddress } from "./ContractAddress"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import styles from "./DeployTokenStep.module.css"

interface DeployTokenStepProps {
  chain: "source" | "destination"
  isEnabled: boolean
}

export const DeployTokenStep = ({ chain }: DeployTokenStepProps) => {
  const state = useStore(laneStore)
  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const networkInfo = network
    ? {
        name: network.name,
        logo: network.logo,
      }
    : { name: "loading..." }

  const content = (
    <>
      <NetworkCheck network={networkInfo} />

      <ol className={styles.steps}>
        <TutorialStep title="Configure Remix">
          <ul>
            <li>Open the "Deploy & Run Transactions" tab</li>
            <li>Set Environment to "Injected Provider - MetaMask"</li>
            <li>
              Select <strong>BurnMintERC677</strong> contract
            </li>
          </ul>
        </TutorialStep>

        <TutorialStep title="Set Contract Parameters">
          <div className={styles.parametersIntro}>
            <p>Configure your token by setting these required parameters in Remix:</p>
          </div>

          <div className={styles.parameters}>
            <SolidityParam
              name="name"
              type="string"
              description="The full name of your token that users will see"
              example='"My Cross Chain Token"'
            />
            <SolidityParam
              name="symbol"
              type="string"
              description="A short ticker symbol for your token (usually 3-4 letters)"
              example='"MCCT"'
            />
            <SolidityParam
              name="decimals"
              type="uint8"
              description="Number of decimal places your token will support (18 is standard)"
              example="18"
            />
            <SolidityParam
              name="maxSupply"
              type="uint256"
              description="The maximum amount of tokens that can ever exist (0 means unlimited)"
              example="0"
            />
          </div>
        </TutorialStep>

        <TutorialStep title="Deploy Contract">
          <ul>
            <li>Click "Deploy" and confirm in MetaMask</li>
            <li>Copy your token address from "Deployed Contracts"</li>
          </ul>
          <div className={styles.addressInput}>
            <ContractAddress type="token" chain={chain} placeholder="Enter deployed token address" />
          </div>
        </TutorialStep>
      </ol>
    </>
  )

  return (
    <TutorialCard title="Deploy Token Contract" description="Configure and deploy your token using Remix IDE">
      {content}
    </TutorialCard>
  )
}
