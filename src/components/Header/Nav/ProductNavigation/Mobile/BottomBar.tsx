import styles from "./bottomBar.module.css"
import { ResourcesIcon } from "./ResourcesIcon"
import { Search } from "../../../aiSearch/Search"

const ResourcesButton = () => (
  <a rel="noreferrer noopener" target="_blank" href="https://github.com/smartcontractkit/documentation">
    <ResourcesIcon />
    <span style={{ color: "var(--color-text-primary)" }}>GitHub</span>
  </a>
)

const SearchButton = () => <Search variant="bottomBar" />

const DeveloperHubButton = () => (
  <a rel="noreferrer noopener" target="_blank" href="https://dev.chain.link/">
    <span style={{ color: "var(--color-text-primary)" }}>Developer Hub</span>
  </a>
)

export const BottomBar = () => {
  const buttons = [<SearchButton />, <ResourcesButton />, <DeveloperHubButton />]
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
