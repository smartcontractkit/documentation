import { CCIP_VERSIONS, type CCIPVersion } from "@config/versions/ccip"
import styles from "./VersionSelector.module.css"

type VersionSelectorProps = {
  currentVersion: CCIPVersion
  currentPath: string
}

export const VersionSelector = ({ currentVersion, currentPath }: VersionSelectorProps): JSX.Element => {
  const pathAfterVersion = currentPath.split(currentVersion)[1] ?? ""

  const handleVersionChange = (newVersion: CCIPVersion): void => {
    const newPath = `/ccip/api-reference/${newVersion}${pathAfterVersion}`
    window.location.href = newPath
  }

  if (!CCIP_VERSIONS.ALL.includes(currentVersion)) {
    console.warn(`Invalid version ${currentVersion} provided to VersionSelector`)
  }

  return (
    <div className={styles.versionSelector} role="region" aria-label="API Version Selector">
      <div className={styles.selectWrapper}>
        <label htmlFor="version-select" className={styles.label}>
          API Version:
        </label>
        <div className={styles.selectContainer}>
          <select
            id="version-select"
            value={currentVersion}
            onChange={({ target: { value } }) => handleVersionChange(value as CCIPVersion)}
            className={styles.select}
            aria-label="Select API Version"
          >
            {CCIP_VERSIONS.ALL.map((version) => (
              <option
                key={version}
                value={version}
                aria-label={`${version}${version === CCIP_VERSIONS.LATEST ? " - Latest Version" : ""}`}
              >
                {`${version}${version === CCIP_VERSIONS.LATEST ? " (Latest)" : ""}`}
              </option>
            ))}
          </select>
          <span className={styles.selectIcon} aria-hidden="true" />
        </div>
      </div>

      {currentVersion !== CCIP_VERSIONS.LATEST && (
        <div className={styles.warning} role="alert" aria-live="polite">
          <span className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            You are viewing documentation for {currentVersion}.{" "}
            <a href={`/ccip/api-reference/${CCIP_VERSIONS.LATEST}${pathAfterVersion}`} className={styles.warningLink}>
              Switch to latest ({CCIP_VERSIONS.LATEST})
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
