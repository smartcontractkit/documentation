import { fallbackTokenIconUrl } from "~/features/utils/index.ts"
import Card from "../Cards/Card.tsx"
import Grid from "../Landing/Grid.tsx"

interface TokenGridProps {
  tokens: {
    id: string
    logo: string
    totalNetworks?: number
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 2 * 4 // Number of tokens to show before the "See more" button, 2 rows x 4 items

function TokenGrid({ tokens, environment }: TokenGridProps) {
  return (
    <Grid
      items={tokens}
      initialDisplayCount={BEFORE_SEE_MORE}
      seeMoreLabel="View all tokens"
      renderItem={(token) => {
        const subtitle =
          token.totalNetworks !== undefined
            ? `${token.totalNetworks} ${token.totalNetworks === 1 ? "network" : "networks"}`
            : undefined
        const logoElement = (
          <object data={token.logo} type="image/png" aria-label={`${token.id} token logo`}>
            <img src={fallbackTokenIconUrl} alt={`${token.id} token logo`} loading="lazy" />
          </object>
        )
        return (
          <Card
            key={token.id}
            logo={logoElement}
            title={token.id}
            subtitle={subtitle}
            link={`/ccip/directory/${environment}/token/${token.id}`}
            ariaLabel={`View ${token.id} token details`}
          />
        )
      }}
    />
  )
}

export default TokenGrid
