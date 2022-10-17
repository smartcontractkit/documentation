## How to migrate

1. Run `npm run import`
2. Copy over the files from tempdocs
3. Remove `/` and `/404` from the generated `redirects.json`
4. Copy the values of redirects into the update-sidebar-links.ts script without `{"redirects":[` and the trailing `]}` (dirty hack)
5. Run `npm run update-sidebar` to update the sidebar links with the ones in the redirects variable.

## When manually updating the imported pages

- make sure the property `section` is correct in the frontmatter
- fix the heading hierarchy accordingly (no h1's in the page. h2,h3 for headings we want on the sidebar. h4,h5 for other headings)
- check the callouts to make sure the titles are correct `:::note[some very long title...]`
- run `npm run linkcheck` to make sure that there are no broken links on the pages your'e importing
- check the page to make sure it's okay visually
- if a feature is missing ping `Fernando Montero` on slack
- use the `<Youtube />` component if you need to embed a video
- check that the current page is properly highlighted on the sidebar when you're viewing that page
- if an image is missing you probably have to copy over the content from the `/public/` folder in 11ty to that one of astro
- check the README page in localhost:3000/README to check the new syntax features

# Writing

## Headings

New sections should be at the `<h2>` level. The page title is an `<h1>` element.

Please keep headings short. `<h2>` and `<h3>` headings will appear in the right sidebar / "On this page" menu, so please check previews and consider shortening headings if the sidebar entry looks too long.

Headings should not end in punctuation (e.g. ":") but should format `<code>` when appropriate.

Do use headings to break up text into organized sections! Many readers prefer to skim, and your headings will show up in the sidebar / table of contents menu to help your readers navigate, and let them know they are on the correct page.
