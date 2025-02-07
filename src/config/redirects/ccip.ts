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

export const ccipRedirects = API_FILES.reduce((redirects, file) => {
  // For each file, create redirects with proper status code
  redirects[`/ccip/api-reference/${file}`] = {
    status: 301,
    destination: `/ccip/api-reference/v1.5.1/${file}`,
  }
  redirects[`/ccip/api-reference/${file}/`] = {
    status: 301,
    destination: `/ccip/api-reference/v1.5.1/${file}`,
  }
  return redirects
}, {} as Record<string, { status: number; destination: string }>)
