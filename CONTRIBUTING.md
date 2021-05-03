# Contributing to the Chainlink Documentation

PRs are welcome! We try to keep a clean commit history, so we'll follow a standard process:

* Create a PR
    * If your PR contains multiple commits, we'll ask you to squash them
    * If your PR has conflicts with `main`, we'll ask you to rebase it
* Someone will review your PR
* Your PR will be merged, amended, closed, or you'll be asked for changes

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

Next, comment or remove all of your commit messages and leave the one that describes your PR: `add doc X`, `fix page Y`, `improve docs for Z`. For example: `add contract addresses for X blockchain`.

### 3. Force push to your branch

Lastly, force push the changes to your branch to have a clean history:

```shell
git push -f
```

Here's a [complete example](https://twitter.com/stephenfluin/status/1009904095073718275) of git squashing.

It's easier to use `git --amend` while working on your PR first. Avoiding multiple commits is much cleaner and easier than fixing them.

## Other Standards
* Trust the autoformatter (prettier)