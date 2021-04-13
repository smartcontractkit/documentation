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
See [this how to](https://twitter.com/stephenfluin/status/1009904095073718275).


## Other Standards
* Trust the autoformatter (prettier)