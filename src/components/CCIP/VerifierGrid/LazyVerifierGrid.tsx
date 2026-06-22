import { lazy, Suspense } from "react"
import type { Environment } from "~/config/data/ccip/types.ts"

const VerifierGrid = lazy(() => import("./VerifierGrid.tsx"))

interface LazyVerifierGridProps {
  verifiers: Array<{
    id: string
    name: string
    logo: string
    totalNetworks: number
  }>
  environment: Environment
}

export default function LazyVerifierGrid({ verifiers, environment }: LazyVerifierGridProps) {
  return (
    <Suspense
      fallback={
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1rem",
            padding: "1rem 0",
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{
                height: "120px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                animation: "pulse 1.5s ease-in-out infinite alternate",
              }}
            />
          ))}
        </div>
      }
    >
      <VerifierGrid verifiers={verifiers} environment={environment} />
    </Suspense>
  )
}
