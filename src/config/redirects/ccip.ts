const EVM_API_FILES = [
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

const SVM_API_FILES = ["events", "router", "errors", "messages"]
const APTOS_API_FILES = ["events", "router", "errors", "messages"]

export const ccipRedirects = {
  ...EVM_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/api-reference/evm/${file}`] = {
        status: 301,
        destination: `/ccip/v2.0/api-reference/evm/v1.5.1/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
  ...SVM_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/api-reference/svm/${file}`] = {
        status: 301,
        destination: `/ccip/v2.0/api-reference/svm/v1.6.0/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
  ...APTOS_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/api-reference/aptos/${file}`] = {
        status: 301,
        destination: `/ccip/v2.0/api-reference/aptos/v1.6.0/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
}
