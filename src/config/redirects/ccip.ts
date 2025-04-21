const API_FILES = [
  "burn-from-mint-token-pool",
  "burn-mint-token-pool-abstract",
  "burn-mint-token-pool",
  "ccip-receiver",
  "client",
  "i-router-client",
  "lock-release-token-pool",
  "pool",
  "registry-module-owner-custom",
  "token-admin-registry",
  "token-pool",
  "errors",
]

export const ccipRedirects = API_FILES.reduce(
  (redirects, file) => {
    // Only create one redirect without trailing slash
    redirects[`/ccip/tools-resources/api-reference/evm/${file}`] = {
      status: 301,
      destination: `/ccip/tools-resources/api-reference/evm/v1.5.1/${file}`,
    }
    return redirects
  },
  {} as Record<string, { status: number; destination: string }>
)
