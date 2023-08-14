<p align="center"><img src="https://raw.githubusercontent.com/smartcontractkit/documentation/main/public/chainlink-docs.svg" style="background: white; padding: 8px;" alt="Chainlink Docs logo" width="400"></p>

Welcome to Chainlink developer documentation repository. This repository is the source for developer documentation on [docs.chain.link](https://docs.chain.link/), which is a resource for smart contract developers and node operators building decentralized applications on several networks.

This documentation is open source. If you want to contribute tutorials or improvements, see the [Contributing](https://github.com/smartcontractkit/documentation/blob/main/CONTRIBUTING.md) guide.

## Developing

To run a local development environment, use the following command:

```
npm install && npm run dev
```

## Docs architecture

- All docs are markdown and stored in `/src/content`.
- Navigation is JSON in `/src/config/sidebar.ts`

## Deploy Preview

This repo is configured to automatically create a preview environment on Vercel when a PR is opened. After the deployment is approved, the Vercel bot will leave a comment with a link to the preview on your PR.

## Deploying to Production

This repo is configured to automatically update the production (`https://docs.chain.link`) site when commits are pushed to the `main` branch.
