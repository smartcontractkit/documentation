import { fallbackVerifierIconUrl } from "~/features/utils/index.ts"
import Card from "../Cards/Card.tsx"
import Grid from "../Landing/Grid.tsx"

interface VerifierGridProps {
  verifiers: {
    id: string
    name: string
    logo: string
    totalNetworks: number
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 2 * 4 // Number of verifiers to show before the "See more" button, 2 rows x 4 items

function VerifierGrid({ verifiers, environment }: VerifierGridProps) {
  return (
    <Grid
      items={verifiers}
      initialDisplayCount={BEFORE_SEE_MORE}
      seeMoreLabel="View all verifiers"
      seeMoreLink="/verifiers"
      renderItem={(verifier) => {
        const subtitle = `${verifier.totalNetworks} ${verifier.totalNetworks === 1 ? "network" : "networks"}`
        const logoElement = (
          <object data={verifier.logo} type="image/svg+xml" aria-label={`${verifier.name} verifier logo`}>
            <img src={fallbackVerifierIconUrl} alt={`${verifier.name} verifier logo`} loading="lazy" />
          </object>
        )
        return (
          <Card
            key={verifier.id}
            logo={logoElement}
            title={verifier.name}
            subtitle={subtitle}
            link={`/ccip/directory/${environment}/verifier/${verifier.id}`}
            ariaLabel={`View ${verifier.name} verifier details`}
          />
        )
      }}
    />
  )
}

export default VerifierGrid
