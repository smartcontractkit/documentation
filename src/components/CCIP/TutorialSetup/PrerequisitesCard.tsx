import { useState } from "react"
import styles from "./PrerequisitesCard.module.css"
import { type StepId, type SubStepId } from "@stores/lanes"
import { SetupSection } from "./SetupSection"
import { TutorialCard } from "./TutorialCard"

interface Link {
  text: string
  url: string
}

interface PrerequisiteStep {
  id: string
  title: string
  description: string
  checkboxId: SubStepId<StepId>
  defaultOpen?: boolean
  options?: {
    title: string
    steps: {
      text: string
      type?: "numbered" | "bullet" | "header" // Default to 'numbered' if not specified
    }[]
    links?: Link[]
  }[]
}

export const PrerequisitesCard = () => {
  const [activeStep, setActiveStep] = useState<string | null>("browser-setup")

  const getSubStepId = (subStepId: string) => `setup-${subStepId}`

  const prerequisites: PrerequisiteStep[] = [
    {
      id: "browser-setup",
      checkboxId: "browser-setup" as SubStepId<StepId>,
      title: "Web Browser Setup",
      description: "Configure your browser with the required extensions and networks",
      defaultOpen: true,
      options: [
        {
          title: "Using Chainlist (Recommended)",
          steps: [
            { text: "Visit Chainlist", type: "numbered" },
            { text: "Search for your desired blockchains", type: "numbered" },
            { text: 'Click "Add to MetaMask" for each blockchain', type: "numbered" },
          ],
          links: [
            {
              text: "Open Chainlist",
              url: "https://chainlist.org",
            },
          ],
        },
        {
          title: "Manual Configuration",
          steps: [
            { text: "Open MetaMask Settings", type: "numbered" },
            { text: "Select Networks", type: "numbered" },
            { text: "Add Network manually", type: "numbered" },
          ],
          links: [
            {
              text: "View Guide",
              url: "https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/",
            },
          ],
        },
      ],
    },
    {
      id: "gas-tokens",
      checkboxId: "gas-tokens" as SubStepId<StepId>,
      title: "Native Gas Tokens",
      description: "Acquire tokens for transaction fees",
      options: [
        {
          title: "Testnet Setup",
          steps: [
            { text: "Choose one of these options:", type: "header" },
            { text: "Visit blockchain-specific faucets", type: "bullet" },
            { text: "Use the Chainlink faucet for supported networks", type: "bullet" },
          ],
          links: [
            {
              text: "Visit Chainlink Faucet",
              url: "https://faucets.chain.link/",
            },
          ],
        },
        {
          title: "Mainnet Setup",
          steps: [{ text: "Acquire tokens through an exchange", type: "bullet" }],
        },
      ],
    },
  ]

  return (
    <TutorialCard title="Prerequisites" description="Complete these steps before starting the tutorial">
      <div className={styles.requirements}>
        {prerequisites.map((step, index) => (
          <div
            key={step.id}
            id={getSubStepId(step.checkboxId)}
            className={`${styles.step} ${activeStep === step.id ? styles.active : ""}`}
          >
            <SetupSection
              title={`${index + 1}. ${step.title}`}
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
                          {option.steps.map((step, stepIdx) => (
                            <li
                              key={stepIdx}
                              className={`
                                ${step.type === "bullet" ? styles.bulletItem : ""}
                                ${step.type === "header" ? styles.headerItem : ""}
                                ${step.type === "numbered" ? styles.numberedItem : ""}
                              `}
                            >
                              {step.text}
                            </li>
                          ))}
                        </ul>
                        {option.links?.map((link, linkIdx) => (
                          <a
                            key={linkIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionButton}
                          >
                            {link.text}
                            <span className={styles.linkArrow}>→</span>
                          </a>
                        ))}
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
