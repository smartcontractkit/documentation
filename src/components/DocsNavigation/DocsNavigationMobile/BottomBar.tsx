import styles from "./bottomBar.module.css"

const ResourcesButton = () => (
  <a rel="noreferrer noopener" target="_blank" href="https://github.com/smartcontractkit/documentation">
    <img height={24} width={24} src="/assets/icons/github-blue.svg" />
    GitHub
  </a>
)

const DeveloperHubButton = () => (
  <a rel="noreferrer noopener" target="_blank" href="https://dev.chain.link/">
    Developer Hub
  </a>
)

export const BottomBar = () => {
  const buttons = [<ResourcesButton />, <DeveloperHubButton />]
  return (
    <div className={styles.bottomBar}>
      <div>
        {buttons.map((ButtonComponent, index) => (
          <div key={index}>{ButtonComponent}</div>
        ))}
      </div>
    </div>
  )
}
