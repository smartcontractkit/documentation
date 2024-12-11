import { useState } from "react"
import styles from "./PrerequisitesCard.module.css"
import { type StepId, type SubStepId } from "@stores/lanes"
import { StepCheckbox } from "@components/CCIP/TutorialProgress/StepCheckbox"
import { SetupSection } from "./SetupSection"
import { TutorialCard } from "./TutorialCard"

interface PrerequisiteStep {
  id: string
  title: string
  description: string
  checkboxId: SubStepId<StepId>
  defaultOpen?: boolean
  options?: {
    title: string
    steps: string[]
    link?: {
      text: string
      url: string
    }
  }[]
}

export const PrerequisitesCard = () => {
  const [activeStep, setActiveStep] = useState<string | null>("browser-setup")

  const getSubStepId = (subStepId: string) => `setup-${subStepId}`

  const prerequisites: PrerequisiteStep[] = [
    {
      id: "browser-setup",
      checkboxId: "browser-setup" as SubStepId<StepId>,
      title: "1. Web Browser Setup",
      description: "Configure your browser with the required extensions and networks",
      defaultOpen: true,
      options: [
        {
          title: "Using Chainlist (Recommended)",
          steps: [
            "Visit Chainlist",
            "Search for your desired blockchains",
            'Click "Add to MetaMask" for each blockchain',
          ],
          link: {
            text: "Open Chainlist",
            url: "https://chainlist.org",
          },
        },
        {
          title: "Manual Configuration",
          steps: ["Open MetaMask Settings", "Select Networks", "Add Network manually"],
          link: {
            text: "View Guide",
            url: "https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/",
          },
        },
      ],
    },
    {
      id: "gas-tokens",
      checkboxId: "gas-tokens" as SubStepId<StepId>,
      title: "2. Native Gas Tokens",
      description: "Acquire tokens for transaction fees",
      options: [
        {
          title: "Testnet Setup",
          steps: ["Visit blockchain-specific faucets", "Request test tokens"],
        },
        {
          title: "Mainnet Setup",
          steps: ["Acquire tokens through an exchange"],
        },
      ],
    },
  ]

  return (
    <TutorialCard title="Prerequisites" description="Complete these steps before starting the tutorial">
      <div className={styles.requirements}>
        {prerequisites.map((step) => (
          <div
            key={step.id}
            id={getSubStepId(step.checkboxId)}
            className={`${styles.step} ${activeStep === step.id ? styles.active : ""}`}
          >
            <SetupSection
              title={step.title}
              description={step.description}
              checkbox={{
                stepId: "setup" as StepId,
                subStepId: step.checkboxId,
              }}
            >
              <div className={styles.stepContent}>
                <button
                  className={styles.expandButton}
                  onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                  aria-label={activeStep === step.id ? "Collapse section" : "Expand section"}
                >
                  {activeStep === step.id ? "▼" : "▶"}
                </button>
                {activeStep === step.id && step.options && (
                  <div className={styles.optionsGrid}>
                    {step.options.map((option, idx) => (
                      <div key={idx} className={styles.optionCard}>
                        <h4>{option.title}</h4>
                        <ul className={styles.stepsList}>
                          {option.steps.map((stepText, stepIdx) => (
                            <li key={stepIdx}>{stepText}</li>
                          ))}
                        </ul>
                        {option.link && (
                          <a
                            href={option.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionButton}
                          >
                            {option.link.text}
                            <span className={styles.linkArrow}>→</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SetupSection>
          </div>
        ))}
      </div>
    </TutorialCard>
  )
}
