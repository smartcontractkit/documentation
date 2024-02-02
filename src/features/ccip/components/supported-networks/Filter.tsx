import { FunctionalComponent } from "preact"
import { useState } from "preact/hooks"
import { FilterDropdown, FilterOption } from "@chainlink/components"
import { loadReferenceData, Environment, Version } from "@config/data/ccip/"
import { directoryToSupportedChain, getTitle, getChainIcon } from "@features/utils"

export const FilterComponent: FunctionalComponent<{ environment: Environment; version: Version }> = ({
  environment,
  version,
}) => {
  type FilterType = "source" | "destination"
  const [filters, setFilters] = useState<Record<FilterType, string[]>>({
    source: [],
    destination: [],
  })

  const chainsReferenceData = loadReferenceData({ environment, version }).chainsReferenceData

  const sourceNetworkOptions = Object.keys(chainsReferenceData).map((chainRefId): FilterOption<FilterType> => {
    const chainKey = directoryToSupportedChain(chainRefId)
    const chainTitle = getTitle(chainKey)
    if (!chainTitle) throw Error(`Title not found for chain ${chainKey}`)

    return {
      name: chainTitle,
      type: "source",
      value: chainKey,
      icon: getChainIcon(chainKey) || "",
    }
  })

  const hasActiveFilters = Object.values(filters).some((filters) => filters.length)
  return (
    <div>
      <p>"hello"</p>
      <FilterDropdown
        label="Source"
        type="source"
        options={sourceNetworkOptions}
        filters={filters}
        setFilters={setFilters}
      />
      <div>
        {hasActiveFilters && (
          <button
            style={{ paddingLeft: "var(--space-4x)" }}
            className={"tertiary"}
            onClick={() => setFilters({ source: [], destination: [] })}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
