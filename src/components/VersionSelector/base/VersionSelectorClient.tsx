import { useCallback, useEffect, useRef, useState } from "react"
import { getVersionLabel, buildVersionUrl } from "../utils"
import { PAGE_AVAILABILITY } from "@config/versions/page-availability"
import styles from "../styles/components/VersionSelector.module.css"
import { Collection } from "../types"

// Feature flags for gradual rollout
const FEATURES = {
  ENHANCED_SELECT: true,
  MOTION_SYSTEM: true,
  ADVANCED_WARNING: true,
} as const

interface DeviceCapabilities {
  supportsBackdropFilter: boolean
  supportsPreserve3d: boolean
  prefersReducedMotion: boolean
}

// Hook to check device capabilities
const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsBackdropFilter: true,
    supportsPreserve3d: true,
    prefersReducedMotion: false,
  })

  useEffect(() => {
    setCapabilities({
      supportsBackdropFilter:
        CSS.supports("backdrop-filter: blur()") || CSS.supports("-webkit-backdrop-filter: blur()"),
      supportsPreserve3d: CSS.supports("transform-style: preserve-3d"),
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    })
  }, [])

  return capabilities
}

interface ClientProps<T extends string> {
  config: {
    versions: {
      all: ReadonlyArray<T>
      latest: T
      deprecated?: ReadonlyArray<T>
      current: T
    }
    product: {
      name: Collection
      basePath: string
    }
    styling?: {
      theme?: string
    }
  }
  validatedVersion: T
  isNotLatest: boolean
  currentPath: string
}

export const VersionSelectorClient = <T extends string>({
  config,
  validatedVersion,
  isNotLatest,
  currentPath,
}: ClientProps<T>) => {
  const [isChanging, setIsChanging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentVersion, setCurrentVersion] = useState(validatedVersion)
  const selectRef = useRef<HTMLSelectElement>(null)
  const capabilities = useDeviceCapabilities()

  // Sync with prop changes
  useEffect(() => {
    setCurrentVersion(validatedVersion)
  }, [validatedVersion])

  useEffect(() => {
    setIsVisible(true)
    const staticVersion = document.querySelector("[data-client-hidden]")
    if (staticVersion) {
      staticVersion.remove()
    }

    // Add performance mark
    performance.mark("version-selector-mounted")

    return () => {
      performance.measure("version-selector-lifecycle", "version-selector-mounted")
    }
  }, [])

  const handleVersionChange = useCallback(
    (newVersion: T) => {
      if (newVersion === currentVersion) return
      setError(null)
      setIsChanging(true)

      try {
        // Extract the page path from current URL with improved regex
        const pathMatch = currentPath.match(new RegExp(`/${config.product.name}/api-reference/v[^/]+/(.+?)/?$`))

        // If no specific page (e.g., index), proceed normally
        if (!pathMatch) {
          window.location.href = buildVersionUrl(
            { ...config.product, name: config.product.name as Collection },
            currentPath,
            currentVersion,
            newVersion
          )
          return
        }

        const pagePath = pathMatch[1] // Path without trailing slash
        const hasTrailingSlash = currentPath.endsWith("/")
        const productAvailability = PAGE_AVAILABILITY[config.product.name]

        if (productAvailability) {
          const pageConfig = productAvailability[pagePath]

          // Check version-specific availability
          if (pageConfig) {
            // Check if page is only available in specific versions
            if (pageConfig.onlyAvailableIn && !pageConfig.onlyAvailableIn.includes(newVersion)) {
              setIsChanging(false)
              setError(`This page is only available in versions: ${pageConfig.onlyAvailableIn.join(", ")}`)
              return
            }

            // Check if page is not available in target version
            if (pageConfig.notAvailableIn && pageConfig.notAvailableIn.includes(newVersion)) {
              setIsChanging(false)
              setError(`This page is not available in version ${newVersion}`)
              return
            }
          }
        }

        // If we get here, either:
        // 1. Product has no availability config
        // 2. Page has no specific config
        // 3. Page exists in target version
        const newUrl =
          buildVersionUrl(
            { ...config.product, name: config.product.name as Collection },
            currentPath,
            currentVersion,
            newVersion
          ) + (hasTrailingSlash ? "/" : "")

        window.location.href = newUrl
      } catch (err) {
        setIsChanging(false)
        setError("Failed to change version. Please try again.")
      }
    },
    [currentVersion, currentPath, config.product]
  )

  // Enhanced class names based on capabilities
  const getEnhancedClasses = () => {
    const hasBackdrop = capabilities.supportsBackdropFilter
    const hasMotion = !capabilities.prefersReducedMotion
    const isEnhanced = FEATURES.ENHANCED_SELECT && hasBackdrop

    return {
      container: `${styles.selectContainer} ${isEnhanced ? "glass" : ""}`,
      select: `${styles.select} ${isEnhanced ? "glass" : ""} ${isChanging ? "loading" : ""}`,
      warning: `${styles.warning} ${FEATURES.ADVANCED_WARNING && hasMotion ? "animate-in" : ""}`,
      skeleton: `${styles.skeleton} ${isEnhanced ? "loading" : ""}`,
    }
  }

  const classes = getEnhancedClasses()

  if (!isVisible) {
    return (
      <div
        className={classes.skeleton}
        style={{ height: "var(--vs-initial-height)", width: "var(--vs-initial-width)" }}
        aria-busy="true"
        aria-label="Loading version selector"
      />
    )
  }

  return (
    <div className={styles.versionSelector}>
      <div className={classes.container}>
        <label htmlFor="version-select" className={styles.label}>
          API Version:
        </label>
        <div className={styles.selectContainer}>
          <select
            ref={selectRef}
            id="version-select"
            className={classes.select}
            value={currentVersion}
            onChange={(e) => handleVersionChange(e.target.value as T)}
            disabled={isChanging}
            aria-label="Select API Version"
            aria-invalid={!!error}
          >
            {config.versions.all.map((version) => (
              <option
                key={version}
                value={version}
                aria-label={`${version}${version === config.versions.latest ? " - Latest Version" : ""}`}
              >
                {getVersionLabel(version, version === config.versions.latest)}
              </option>
            ))}
          </select>
          <span className={styles.selectIcon} aria-hidden="true" />
        </div>
      </div>

      {error && (
        <div role="alert" className={classes.warning}>
          <span className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>{error}</p>
        </div>
      )}

      {isNotLatest && !error && (
        <div role="alert" className={classes.warning}>
          <span className={styles.warningIcon} aria-hidden="true" />
          <p className={styles.warningText}>
            You're not using the latest version.{" "}
            <button
              className={`${styles.warningLink} hover-scale`}
              onClick={() => handleVersionChange(config.versions.latest)}
            >
              Update to {config.versions.latest}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
