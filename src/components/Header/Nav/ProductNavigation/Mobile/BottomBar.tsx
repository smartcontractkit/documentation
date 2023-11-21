import styles from "./bottomBar.module.css"
import { ResourcesIcon } from "./ResourcesIcon"
import { Search } from "../../../AlgoSearch/Search"

const ResourcesButton = () => (
  <a rel="noreferrer" target="_blank" className="nav-cta" href="https://github.com/smartcontractkit/documentation">
    <ResourcesIcon />
    <span
      style={{
        color: "var(--color-text-primary)", // Yes, this is necessary
      }}
    >
      GitHub
    </span>

    <div className={styles.divider} />
  </a>
)

const SearchButton = () => <Search variant="bottomBar" />

export const BottomBar = () => {
  // Additional buttons should be added to this array in order to have the right number of columns in the layout
  const buttons = [SearchButton, ResourcesButton]
  return (
    <div
      className={styles.bottomBar}
      style={{
        gridTemplateColumns: `repeat(${buttons.length}, 1fr)`,
      }}
    >
      {buttons.map((ButtonComponent, index) => (
        <ButtonComponent key={index} />
      ))}
    </div>
  )
}
