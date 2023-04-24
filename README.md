<p align="center"><img src="https://user-images.githubusercontent.com/99068989/233969677-72ce0ba4-7cf3-4ea9-bb9d-61479ddca307.png" width="300px"></p>

<h2 align="center" style="font-size: 32px;">Start building with Chainlink Docs 📃</h2>

<p>Welcome to Chainlink developer documentation website for Blockchain Devs, Smart Contract Devs and Node Operators. Chainlink gives the go-to resource for smart contract developers and node operators looking to integrate external data into their decentralized applications. As the leading oracle infrastructure provider, Chainlink offers a robust set of tools and services that enable developers to build scalable and externally-connected dApps on any blockchain or layer-2 network.
  
This open source project is dedicated to providing comprehensive documentation for the Chainlink platform, empowering users to leverage the full potential of our technology. Whether you're a seasoned developer or just getting started, the Chainlink Docs are here to help you succeed. Let's get building! 🚀 </p>

<p>For more information, please visit the <a href="https://docs.chain.link/">Chainlink documentation website</a>.</p>

<br>


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
