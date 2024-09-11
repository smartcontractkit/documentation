import styles from "./bottomBar.module.css"
import { clsx } from "~/lib"

const ResourcesButton = () => (
  <a rel="noreferrer noopener" target="_blank" href="https://github.com/smartcontractkit/documentation">
    <img height={20} width={20} src="/assets/icons/github-blue.svg" />
    GitHub
  </a>
)

export const BottomBar = () => {
  const buttons = [<ResourcesButton />]
  return (
    <div className={clsx(styles.bottomBar, "text-200")}>
      <div>
        {buttons.map((ButtonComponent, index) => (
          <div key={index}>{ButtonComponent}</div>
        ))}
      </div>
    </div>
  )
}
