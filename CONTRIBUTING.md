# Contributing to the Chainlink Documentation

PRs are welcome! We try to keep a clean commit history, so we'll follow a standard process:

* Create a PR
    * If your PR contains multiple commits, we'll ask you to squash them
    * If your PR has conflicts with `main`, we'll ask you to rebase it
* Someone will review your PR
* Your PR will be merged, amended, closed, or you'll be asked for changes

## Standards
* Commit messages
    * Start with a present tense verb
    * Keep your commit headline short but sufficient to understand the scope and focus of the change. 
    * Changes are often formatted like `add doc X`, `fix page Y`, `improve docs for Z`.
    * Example: "`update contract addresses for BSC`".
* If you touch any infrastructure, make sure it builds with `yarn build`
* Trust the autoformatter (prettier)
* Make sure images are optimized and compressed
* Keep images < 20kb whenever possible to keep the site fast and the repo small (try [trimage](https://trimage.org/))

## How to rebase a PR
```shell
git fetch
git rebase origin/main
# resolve conflicts
git push -f
```

It's okay to force push over your own PR branch. In fact, that's what we want so that the commits are clean.

## How to squash a PR
To squash multiple commits, use the following steps:

### 1. Rebase multiple commits into one

When squashing commits, you should always rebase from the main branch of the repo: `git rebase -i origin/main`.

After rebasing, you can squash the commits by changing `pick` into `squash` for all of your commits except the recent one:
```shell
pick 686e386 add doc structure
squash ee2eed7 add main content
squash 3eccd39 fix typos

# Rebase 287bc79..3eccd39 onto 287bc79 (3 commands)
# …
```

### 2. Fix your commit message

Next, comment or remove all of your commit messages and leave the one that describes your PR.

### 3. Force push to your branch

Lastly, force push the changes to your branch to have a clean history:

```shell
git push -f
```

Here's a [complete example](https://twitter.com/stephenfluin/status/1009904095073718275) of git squashing.

It's easier to use `git --amend` while working on your PR first. Avoiding multiple commits is much cleaner and easier than fixing them.

## Adding a new chain feed
Feed data for various chains comes from a private GitHub repository, processed regularly on the server via `process-feeds.yml` and published as JSON. This JSON is loaded by each of the `feed.liquid` based pages.

To test a new feed locally, get access to the private repo, then clone it into `data-source`, and then run `yarn process`. 

## Checking Links
To check the site for broken links, [install `linkcheck`](https://github.com/filiph/linkcheck/), serve the site locally and point to the executable in the command below and run:

```
./path-to-link-check.exe :4200
```

## Adding or updating code samples

The main code samples are stored in `/_includes/samples` directory. If you need to edit or add new code samples, do it in the corresponding nested folder. If Chainlink introduces a new product or feature, create a new folder and place your code sample there.

To embed a code sample in the documentation, use the following format:

```solidity Kovan
{% include samples/APIRequests/APIConsumer.sol %}
```

Note, you have to include only samples that represent the main Chainlink products. The following code shoudn't be included in `/_includes/samples` directory:
- JSON or TOML descriptions and outputs
- API functions
- Code samples that are broken down into smaller pieces
- Shell, bash, or text commands
- Tables, blocks, or similar markdown structures

## Style Guide
- **Bold** key terms or any terms the user must absolutely know when reading a doc.
- *Italicize* terms for emphasis but only when necessary.
- When referring to dropdown menus or a sequence of dropdown events, bold the relevant entities. Example: Go to **Menu Name** > **Option**. Do not use quotes.
- Use markdown over HTML wherever possible.
- When writing an additional note, start it with **Note:**.
- For a comprehensive guide on how to write tutorials specifically, use our [template guide](/TEMPLATE.md).
- Use a consistent voice. When writing documentation, avoid first person plural (we) and opt for second person singular (you). Avoid passive voice.