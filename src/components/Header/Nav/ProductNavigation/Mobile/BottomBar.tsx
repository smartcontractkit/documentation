import React from "react"
import { clsx, getIconUrl } from "../../utils"
import { AppName } from "../../config"
import { getDevHubPageHref } from "../../getDevHubPageHref"
import { ResourcesIcon } from "../../ResourcesIcon"
import { BackArrowIcon } from "./BackArrowIcon"
import styles from "./bottomBar.module.css"

type Props = {
  app: AppName
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  showSearch?: boolean
  searchInput: boolean
}

const SearchButton = ({ showSearch, setShowSearch }: Props) => (
  <button
    data-testid="search-submenu-trigger"
    className={clsx(showSearch === true && styles.back)}
    onClick={() => setShowSearch(showSearch ? false : true)}
  >
    {showSearch ? (
      <>
        <BackArrowIcon />
        Back
      </>
    ) : (
      <>
        <img src={getIconUrl("search")} />
        Search
      </>
    )}
    <div className={styles.divider} />
  </button>
)

const ResourcesButton = ({ app }: { app: AppName }) => (
  <a target="blank" rel="noreferrer" className="nav-cta" href={getDevHubPageHref(app)}>
    <ResourcesIcon />
    <span
      style={{
        color: "var(--color-text-primary)", // Yes, this is necessary
      }}
    >
      Resources
    </span>
  </a>
)

export const BottomBar = (props: Props) => {
  const showSearchButtom = Boolean(props.searchInput)

  return (
    <div
      className={styles.bottomBar}
      style={{
        gridTemplateColumns: `repeat(${showSearchButtom ? "2" : "1"}, 1fr)`,
      }}
    >
      {showSearchButtom && <SearchButton {...props} />}
      <ResourcesButton app={props.app} />
    </div>
  )
}
