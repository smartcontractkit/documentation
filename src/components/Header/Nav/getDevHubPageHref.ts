import { AppName } from './config'

export const getDevHubPageHref = (app: AppName) =>
  ['Automation', 'VRF', 'CCIP', 'Functions', 'Data'].includes(app)
    ? `https://dev.chain.link/products/${app.toLowerCase()}`
    : 'https://dev.chain.link/'
