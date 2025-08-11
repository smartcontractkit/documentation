import { lazy, Suspense } from "react"
import type { Environment } from "~/config/data/ccip/types"

const NetworkGrid = lazy(() => import("./NetworkGrid"))

interface LazyNetworkGridProps {
  networks: Array<{
    name: string
    totalLanes: number
    totalTokens: number
    logo: string
    chain: string
  }>
  environment: Environment
}

export default function LazyNetworkGrid({ networks, environment }: LazyNetworkGridProps) {
  return (
    <Suspense 
      fallback={
        <div className="grid" style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          padding: '1rem 0'
        }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div 
              key={i}
              style={{
                height: '120px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                animation: 'pulse 1.5s ease-in-out infinite alternate'
              }}
            />
          ))}
        </div>
      }
    >
      <NetworkGrid networks={networks} environment={environment} />
    </Suspense>
  )
}