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
  "/ccip/concepts/execution-latency/fast-transfers-dapps": {
    status: 301,
    destination: "/ccip/concepts/execution-latency/ftf-dapps",
  },
  "/ccip/concepts/execution-latency/fast-transfers-token-issuers": {
    status: 301,
    destination: "/ccip/concepts/execution-latency/ftf-token-issuers",
  },
  ...EVM_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/evm/api-reference/${file}`] = {
        status: 301,
        destination: `/ccip/v1/evm/api-reference/v1.5.1/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
  ...SVM_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/v1/svm/api-reference/${file}`] = {
        status: 301,
        destination: `/ccip/v1/svm/api-reference/v1.6.0/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
  ...APTOS_API_FILES.reduce(
    (redirects, file) => {
      // Only create one redirect without trailing slash
      redirects[`/ccip/v1/aptos/api-reference/${file}`] = {
        status: 301,
        destination: `/ccip/v1/aptos/api-reference/v1.6.0/${file}`,
      }
      return redirects
    },
    {} as Record<string, { status: number; destination: string }>
  ),
  "/ccip/evm/concepts/architecture/onchain/overview": {
    status: 301,
    destination: "/ccip/concepts/architecture/overview",
  },
}
