import Card from "../Cards/Card.tsx"
import Grid from "./Grid.tsx"

interface NetworkGridProps {
  networks: {
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }[]
  environment: string
}

const BEFORE_SEE_MORE = 2 * 4 // Number of networks to show before the "See more" button, 2 rows x 4 items

function NetworkGrid({ networks, environment }: NetworkGridProps) {
  return (
    <Grid
      items={networks}
      initialDisplayCount={BEFORE_SEE_MORE}
      seeMoreLabel="View all networks"
      renderItem={(chain) => {
        const subtitle = `${chain.totalLanes} ${chain.totalLanes === 1 ? "lane" : "lanes"} | ${chain.totalTokens} ${chain.totalTokens === 1 ? "token" : "tokens"}`
        return (
          <Card
            key={chain.chain}
            logo={<img src={chain.logo} alt="" loading="lazy" />}
            title={chain.name}
            subtitle={subtitle}
            link={`/ccip/directory/${environment}/chain/${chain.chain}`}
          />
        )
      }}
    />
  )
}

export default NetworkGrid
