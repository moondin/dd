---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 258
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 258 of 1290)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - zulip-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/zulip-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: working-copies.md]---
Location: zulip-main/docs/git/working-copies.md

```text
# Working copies

When you work on Zulip code, there are three copies of the Zulip Git
repository that you are generally concerned with:

- The `upstream` remote. This is the [official Zulip
  repository](https://github.com/zulip/zulip) on GitHub. You probably
  don't have write access to this repository.
- The **origin** remote: Your personal remote repository on GitHub.
  You'll use this to share your code and create [pull requests](pull-requests.md).
- local copy: This lives on your laptop or your remote dev instance,
  and is what you'll use to make changes and create commits.

When you work on Zulip code, you will end up moving code between
the various working copies.

## Workflows

Sometimes you need to get commits. Here are some scenarios:

- You may fork the official Zulip repository to your GitHub fork.
- You may fetch commits from the official Zulip repository to your local copy.
- You occasionally may fetch commits from your forked copy.

Sometimes you want to publish commits. Here are some scenarios:

- You push code from your local copy to your GitHub fork. (You usually
  want to put the commit on a feature branch.)
- You submit a PR to the official Zulip repo.

Finally, the Zulip core team will occasionally want your changes!

- The Zulip core team can accept your changes and add them to
  the official repo, usually on the `main` branch.

## Relevant Git commands

The following commands are useful for moving commits between
working copies:

- `git fetch`: This grabs code from another repository to your local
  copy. (Defaults to fetching from your default remote, `origin`).
- `git fetch upstream`: This grabs code from the upstream repository to your local copy.
- `git push`: This pushes code from your local repository to one of the remotes.
- `git remote`: This helps you configure short names for remotes.
- `git pull`: This pulls code, but by default creates a merge commit
  (which you definitely don't want). However, if you've followed our
  [cloning documentation](cloning.md), this will do
  `git pull --rebase` instead, which is the only mode you'll want to
  use when working on Zulip.
```

--------------------------------------------------------------------------------

---[FILE: zulip-tools.md]---
Location: zulip-main/docs/git/zulip-tools.md

```text
# Zulip-specific tools

This article documents several useful tools that can save you a lot of
time when working with Git on the Zulip project.

## Set up Git repo script

**Extremely useful**. In the `tools` directory of
[zulip/zulip][github-zulip-zulip] you'll find a bash script
`setup-git-repo`. This script installs a pre-commit hook, which will
run each time you `git commit` to automatically run
[Zulip's linter suite](../testing/linters.md) on just the files that
the commit modifies (which is really fast!). The hook passes no matter
the result of the linter, but you should still pay attention to any
notices or warnings it displays.

It's simple to use. Make sure you're in the clone of zulip and run the following:

```console
$ ./tools/setup-git-repo
```

The script doesn't produce any output if successful. To check that the hook has
been installed, print a directory listing for `.git/hooks` and you should see
something similar to:

```console
$ ls -l .git/hooks
pre-commit -> ../../tools/pre-commit
```

## Configure continuous integration for your Zulip fork

You might also wish to [configure continuous integration for your fork][zulip-git-guide-ci].

## Reset to pull request

`tools/reset-to-pull-request` is a short-cut for [checking out a pull request
locally][zulip-git-guide-fetch-pr]. It works slightly differently from the method
described above in that it does not create a branch for the pull request
checkout.

**This tool checks for uncommitted changes, but it will move the
current branch using `git reset --hard`. Use with caution.**

First, make sure you are working in a branch you want to move (in this
example, we'll use the local `main` branch). Then run the script
with the ID number of the pull request as the first argument.

```console
$ git checkout main
Switched to branch 'main'
Your branch is up-to-date with 'origin/main'.

$ ./tools/reset-to-pull-request 1900
+ request_id=1900
+ git fetch upstream pull/1900/head
remote: Counting objects: 159, done.
remote: Compressing objects: 100% (17/17), done.
remote: Total 159 (delta 94), reused 91 (delta 91), pack-reused 51
Receiving objects: 100% (159/159), 55.57 KiB | 0 bytes/s, done.
Resolving deltas: 100% (113/113), completed with 54 local objects.
From https://github.com/zulip/zulip
 * branch            refs/pull/1900/head -> FETCH_HEAD
+ git reset --hard FETCH_HEAD
HEAD is now at 2bcd1d8 troubleshooting tip about provisioning
```

## Fetch a pull request and rebase

`tools/fetch-rebase-pull-request` is a short-cut for [checking out a pull
request locally][zulip-git-guide-fetch-pr] in its own branch and then updating it with any
changes from `upstream/main` with `git rebase`.

Run the script with the ID number of the pull request as the first argument.

```console
$ tools/fetch-rebase-pull-request 1913
+ request_id=1913
+ git fetch upstream pull/1913/head
remote: Counting objects: 4, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (4/4), done.
From https://github.com/zulip/zulip
 * branch            refs/pull/1913/head -> FETCH_HEAD
+ git checkout upstream/main -b review-1913
Branch review-1913 set up to track remote branch main from upstream.
Switched to a new branch 'review-1913'
+ git reset --hard FETCH_HEAD
HEAD is now at 99aa2bf Add provision.py fails issue in common errors
+ git pull --rebase
Current branch review-1913 is up to date.
```

## Fetch a pull request without rebasing

`tools/fetch-pull-request` is a similar to `tools/fetch-rebase-pull-request`, but
it does not rebase the pull request against `upstream/main`, thereby getting
exactly the same repository state as the commit author had.

Run the script with the ID number of the pull request as the first argument.

```console
$ tools/fetch-pull-request 5156
+ git diff-index --quiet HEAD
+ request_id=5156
+ remote=upstream
+ git fetch upstream pull/5156/head
From https://github.com/zulip/zulip
 * branch            refs/pull/5156/head -> FETCH_HEAD
+ git checkout -B review-original-5156
Switched to a new branch 'review-original-5156'
+ git reset --hard FETCH_HEAD
HEAD is now at 5a1e982 tools: Update clean-branches to clean review branches.
```

## Push to a pull request

`tools/push-to-pull-request` is primarily useful for maintainers who
are merging other users' commits into a Zulip repository. After doing
`reset-to-pull-request` or `fetch-pull-request` and making some
changes, you can push a branch back to a pull request with, for example,
`tools/push-to-pull-request 1234`. This is useful for a few things:

- Getting CI to run and enabling you to use the GitHub "Merge" buttons
  to merge a PR after you make some corrections to a PR, without
  waiting for an extra round trip with the PR author.
- For commits that aren't ready to merge yet, communicating clearly
  any changes you'd like to see happen that are easier for you to
  explain by just editing the code than in words.
- Saving a contributor from needing to duplicate any rebase work that
  you did as part of integrating parts of the PR.

You'll likely want to comment on the PR after doing so, to ensure that
the original contributor knows to pull your changes rather than
accidentally overwriting them with a force push when they make their
next batch of changes.

Note that in order to do this you need permission to do such a push,
which GitHub offers by default to users with write access to the
repository. For multiple developers collaborating on a PR, you can
achieve this by granting other users permission to write to your fork.

## Delete unimportant branches

`tools/clean-branches` is a shell script that removes branches that are either:

1. Local branches that are ancestors of `origin/main`.
2. Branches in origin that are ancestors of `origin/main` and named like `$USER-*`.
3. Review branches created by `tools/fetch-rebase-pull-request` and `tools/fetch-pull-request`.

First, make sure you are working in branch `main`. Then run the script without any
arguments for default behavior. Since removing review branches can inadvertently remove any
feature branches whose names are like `review-*`, it is not done by default. To
use it, run `tools/clean-branches --reviews`.

```console
$ tools/clean-branches --reviews
Deleting local branch review-original-5156 (was 5a1e982)
```

## Merge conflict on `pnpm-lock.yaml` file

If there is a merge conflict on `pnpm-lock.yaml`, pnpm should be run to
regenerate the file. _Important:_ don't delete the `pnpm-lock.yaml` file. Check out the
latest one from `origin/main` so that pnpm knows the previous asset versions.

Run the following commands

```bash
git checkout origin/main -- pnpm-lock.yaml
pnpm install
git add pnpm-lock.yaml
git rebase --continue
```

[github-zulip-zulip]: https://github.com/zulip/zulip/
[zulip-git-guide-fetch-pr]: collaborate.md#check-out-a-pull-request-locally
[zulip-git-guide-ci]: cloning.md#step-3-configure-continuous-integration-for-your-fork
```

--------------------------------------------------------------------------------

````
