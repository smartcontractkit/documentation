
This is the open source project for the Chainlink documentation.

## Developing

```
npm install && npm run dev
```

## Docs architecture

- All docs are markdown and stored in `/src/pages`.
- Navigation is JSON in `/src/config/sidebar.ts`

## Deploy Preview

This repo is configured to automatically create a preview environment
on Vercel when a PR is opened. The Vercel bot will leave a comment with a link to the preview on your PR.

## Deploying to Production

This repo is configured to automatically update production (`https://docs.chain.link`) when the `main` branch is updated.