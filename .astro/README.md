## How to migrate

1. Run `npm run import`
2. Copy over the files from tempdocs
3. Remove `/` and `/404` from the generated `redirects.json`
4. Copy the values of redirects into thre redirect script (dirty hack)
5. Run `npm run update-sidebar` to update the sidebar links with the ones in the redirects variable.

# Writing

## Headings

New sections should be at the `<h2>` level. The page title is an `<h1>` element.

Please keep headings short. `<h2>` and `<h3>` headings will appear in the right sidebar / "On this page" menu, so please check previews and consider shortening headings if the sidebar entry looks too long.

Headings should not end in punctuation (e.g. ":") but should format `<code>` when appropriate.

Do use headings to break up text into organized sections! Many readers prefer to skim, and your headings will show up in the sidebar / table of contents menu to help your readers navigate, and let them know they are on the correct page.
