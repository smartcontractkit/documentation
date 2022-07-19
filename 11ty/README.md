This is the open source project for the Chainlink documentation.

## Developing
    yarn serve

## Building & Deploying
The site is hosted on a static site CDN. The files are super portable. Builds end up in `_site`.

    yarn deploy

Make sure you use `yarn` and have a recent version of `node` (see the `package.json` for specific version requirements).

## Docs architecture
* All docs are markdown and stored in `/docs`.
* Navigation is JSON in `/_data/navigation`
* Pages are processed as Readme.com markdown, and then syntax highlight is applied client-side
* Custom client side code powers the ENS page

## Contributing
See `CONTRIBUTING.md`