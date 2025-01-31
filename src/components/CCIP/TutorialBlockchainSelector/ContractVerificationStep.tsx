import { TutorialStep } from "../TutorialSetup/TutorialStep"
import { Callout } from "../TutorialSetup/Callout"
import type { Network } from "@config/data/ccip/types"
import styles from "./ContractVerificationStep.module.css"
import { getExplorerAddressUrl } from "~/features/utils"

interface ContractVerificationStepProps {
  stepId: string
  network: Network | null
  contractAddress?: string
  contractType: "token" | "pool"
}

export const ContractVerificationStep = ({
  stepId,
  network,
  contractAddress,
  contractType,
}: ContractVerificationStepProps) => {
  const explorerContractUrl =
    contractAddress && network?.explorer ? getExplorerAddressUrl(network.explorer)(contractAddress) : undefined

  return (
    <TutorialStep id={stepId} title="Verify Contract (Optional)">
      <div className={styles.verificationIntro}>
        <Callout type="note" title="Why Verify Your Contract?">
          Contract verification makes your {contractType} contract's source code public on the blockchain explorer.
          This:
          <ul>
            <li>Builds trust by allowing anyone to audit your code</li>
            <li>Enables direct interaction through the blockchain explorer</li>
            <li>Helps other developers understand and integrate with your contract</li>
          </ul>
        </Callout>
      </div>

      <ol className={styles.verificationSteps}>
        <li>
          <span className={styles.stepTitle}>Access the Blockchain Explorer</span>
          <div className={styles.stepContent}>
            {network?.explorer ? (
              <div className={styles.explorerSection}>
                <div className={styles.explorerUrl}>
                  <span>Blockchain Explorer:</span>
                  <a
                    href={getExplorerAddressUrl(network.explorer)("")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.explorerLink}
                  >
                    {getExplorerAddressUrl(network.explorer)("")} <span className={styles.externalIcon}>↗</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className={styles.placeholderMessage}>
                Blockchain explorer information will be available once you select a network.
              </div>
            )}
          </div>
        </li>

        <li>
          <span className={styles.stepTitle}>Verify Using Remix IDE</span>
          <div className={styles.stepContent}>
            <div className={styles.verificationOptions}>
              <div className={styles.verificationOption}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionTitle}>Remix IDE Guide</span>
                </div>
                <p className={styles.optionDescription}>
                  Official guide for verifying contracts using the Remix IDE verification plugin
                </p>
                <a
                  href="https://remix-ide.readthedocs.io/en/latest/contract_verification.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.optionLink}
                >
                  View Guide <span className={styles.externalIcon}>↗</span>
                </a>
              </div>

              <div className={styles.verificationOption}>
                <div className={styles.optionHeader}>
                  <span className={styles.optionTitle}>Chainlink Tutorial</span>
                </div>
                <p className={styles.optionDescription}>
                  Step-by-step tutorial for contract verification on blockchain explorers
                </p>
                <a
                  href="https://chain.link/tutorials/how-to-verify-a-smart-contract-on-etherscan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.optionLink}
                >
                  View Tutorial <span className={styles.externalIcon}>↗</span>
                </a>
              </div>
            </div>
          </div>
        </li>

        <li>
          <span className={styles.stepTitle}>Confirm Verification</span>
          <div className={styles.stepContent}>
            <ol className={styles.subSteps}>
              <li>Return to your contract on the blockchain explorer</li>
              <li>Look for a green checkmark ✓ or "Verified" status</li>
              <li>You should now see your contract's source code in the "Code" tab</li>
            </ol>

            {!network?.explorer ? (
              <div className={styles.placeholderMessage}>
                Contract verification link will be available once you select a network.
              </div>
            ) : !contractAddress ? (
              <div className={styles.placeholderMessage}>
                Contract verification link will be available after deployment.
              </div>
            ) : (
              <div className={styles.verificationLink}>
                <span>Verify your contract at:</span>
                <a href={explorerContractUrl} target="_blank" rel="noopener noreferrer" className={styles.contractLink}>
                  {explorerContractUrl}
                </a>
              </div>
            )}
          </div>
        </li>
      </ol>
    </TutorialStep>
  )
}
