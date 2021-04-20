This is a trial project to explore new ways of hosting the Chainlink documentation.

## Developing
    yarn serve

## Building & Deploying
The site is hosted on firebase today on the free tier. This will likely move, but the files are super portable. Builds end up in `_site`.

    yarn deploy


## Docs architecture
* All docs are markdown and stored in `/docs`.
* Navigation is JSON in `/_data`
* Pages are processed as Readme.com markdown, and then syntax highlight is applied client-side
* Custom client side code powers the ENS page

## Contributing
See `CONTRIBUTING.md`