import { useStore } from "@nanostores/react"
import { laneStore } from "@stores/lanes"
import { ContractAddress } from "./ContractAddress"
import { TutorialCard } from "../TutorialSetup/TutorialCard"
import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { NetworkCheck } from "../TutorialSetup/NetworkCheck"
import { SolidityParam } from "../TutorialSetup/SolidityParam"
import { Callout } from "../TutorialSetup/Callout"
import { ContractVerificationStep } from "./ContractVerificationStep"
import type { LaneState, DeployedContracts } from "@stores/lanes"
import styles from "./DeployTokenStep.module.css"

interface DeployTokenStepProps {
  chain: "source" | "destination"
  isEnabled: boolean
}

// Extend LaneState to include the properties we need
interface ExtendedLaneState extends Omit<LaneState, "progress" | "sourceContracts" | "destinationContracts"> {
  tokenAddress?: {
    [key in "source" | "destination"]?: string
  }
  sourceContracts: DeployedContracts
  destinationContracts: DeployedContracts
}

export const DeployTokenStep = ({ chain }: DeployTokenStepProps) => {
  const state = useStore(laneStore) as ExtendedLaneState

  const network = chain === "source" ? state.sourceNetwork : state.destinationNetwork
  const contractAddress = chain === "source" ? state.sourceContracts?.token : state.destinationContracts?.token

  const networkInfo = network
    ? {
        name: network.name,
        logo: network.logo,
      }
    : { name: "loading..." }

  const stepId = chain === "source" ? "sourceChain" : "destinationChain"
  const getSubStepId = (subStep: string) => `${stepId}-${subStep}`
  const deployedStepId = chain === "source" ? "token-deployed" : "dest-token-deployed"

  const content = (
    <>
      <NetworkCheck network={networkInfo} />

      <Callout type="note" title="Already Have a Token?">
        If you have an existing token that meets the{" "}
        <a href="/ccip/concepts/cross-chain-tokens#requirements-for-cross-chain-tokens">CCT requirements</a>:
        <ul>
          <li>Skip the "Deploy Token" section</li>
          <li>Enter your existing token address in the address field below</li>
          <li>Continue with "Claim and Accept Admin Role"</li>
        </ul>
        <p>The tutorial will use your provided token address for subsequent steps.</p>
      </Callout>

      <ol className={styles.steps}>
        <TutorialStep id={getSubStepId("token-config")} title="Configure Remix">
          <ul>
            <li>Open the "Deploy & Run Transactions" tab</li>
            <li>Set Environment to "Injected Provider - MetaMask"</li>
            <li>
              Select <strong>BurnMintERC677</strong> contract
            </li>
          </ul>
        </TutorialStep>

        <TutorialStep id={getSubStepId("token-params")} title="Set Parameters">
          <div className={styles.parametersIntro}>
            <p>Configure your token by setting these required parameters in Remix:</p>
          </div>

          <Callout type="note" title="About the Parameters">
            <ul>
              <li>The name and symbol help identify your token in wallets and applications.</li>
              <li>
                Using 18 decimals is standard for most ERC20 tokens (1 token = 1000000000000000000 wei or 10
                <sup>18</sup>).
              </li>
              <li>
                If maxSupply is set to 0, it allows unlimited minting. For a limited supply, you must scale the amount
                according to the number of decimals. For example, if you want a max supply of 1,000 tokens with 18
                decimals, the maxSupply would be
                <code>
                  1000 * 10<sup>18</sup>
                </code>{" "}
                = <code>1000000000000000000000</code> (that's 1 followed by 21 zeros).
              </li>
            </ul>
          </Callout>

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

        <TutorialStep id={getSubStepId(deployedStepId)} title="Deploy Contract">
          <ul>
            <li>Click "Deploy" and confirm in MetaMask</li>
            <li>Copy your token address from "Deployed Contracts"</li>
          </ul>
          <div className={styles.addressInput}>
            <ContractAddress type="token" chain={chain} placeholder="Enter deployed token address" />
          </div>
        </TutorialStep>

        <ContractVerificationStep
          stepId={getSubStepId("verify-contract")}
          network={network}
          contractAddress={contractAddress}
          contractType="token"
        />
      </ol>
    </>
  )

  return (
    <TutorialCard title="Deploy Token Contract" description="Configure and deploy your token using Remix IDE">
      {content}
    </TutorialCard>
  )
}
