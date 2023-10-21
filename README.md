<p align="center"><img src="https://raw.githubusercontent.com/smartcontractkit/documentation/main/public/chainlink-docs.svg" style="background: white; padding: 8px;" alt="Chainlink Docs logo" width="400"></p>

> [!NOTE]
> The code samples in this documentation are examples for using Chainlink products and services and are provided to help you understand how to
> interact with Chainlink's systems and services so that you can integrate them into your own. These templates are provided
> "AS IS" and "AS AVAILABLE" without warranties of any kind, have not been audited, and may be missing key checks or
> error handling to make the usage of the product more clear. Do not use the example code in a production
> environment without completing your own audits and application of best practices. Neither Chainlink Labs, the
> Chainlink Foundation, nor Chainlink node operators are responsible for unintended outputs that are generated due to
> errors in code.

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
This is amazing!!!
