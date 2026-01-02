---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 257
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 257 of 1290)

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

---[FILE: reviewing.md]---
Location: zulip-main/docs/git/reviewing.md

```text
# Review changes

**Note** - The following section covers reviewing changes on your local
clone. Please read the section on [code reviews][zulip-rtd-review] for a guide
on reviewing changes by other contributors.

## Changes on (local) working tree

Display changes between index and working tree (what is not yet staged for commit):

```console
$ git diff
```

Display changes between index and last commit (what you have staged for commit):

```console
$ git diff --cached
```

Display changes in working tree since last commit (changes that are staged as
well as ones that are not):

```console
$ git diff HEAD
```

## Changes within branches

Use any git-ref to compare changes between two commits on the current branch.

Display changes between commit before last and last commit:

```console
$ git diff HEAD^ HEAD
```

Display changes between two commits using their hashes:

```console
$ git diff e2f404c 7977169
```

## Changes between branches

Display changes between tip of `topic` branch and tip of `main` branch:

```console
$ git diff topic main
```

Display changes that have occurred on `main` branch since `topic` branch was created:

```console
$ git diff topic...main
```

Display changes you've committed so far since creating a branch from `upstream/main`:

```console
$ git diff upstream/main...HEAD
```

[zulip-rtd-review]: ../contributing/code-reviewing.md
```

--------------------------------------------------------------------------------

---[FILE: setup.md]---
Location: zulip-main/docs/git/setup.md

```text
# Set up Git

If you're already using Git, have a client you like, and a GitHub account, you
can skip this section. Otherwise, read on!

## Install and configure Git, join GitHub

If you're not already using Git, you might need to [install][gitbook-install]
and [configure][gitbook-setup] it.

**If you are using Windows 10 without [WSL
2](https://docs.microsoft.com/en-us/windows/wsl/wsl2-about), make sure you
[are running Git BASH as an administrator][git-bash-admin] at all times.**

You'll also need a GitHub account, which you can sign up for
[here][github-join].

We highly recommend you create an SSH key if you don't already have
one and [add it to your GitHub account][github-help-add-ssh-key]. If
you don't, you'll have to type your GitHub username and password every
time you interact with GitHub, which is usually several times a day.

We also highly recommend the following:

- [Configure Git][gitbook-config] with your name and email and
  [aliases][gitbook-aliases] for commands you'll use often. We
  recommend using your full name (not just your first name), since
  that's what we'll use to give credit to your work in places like the
  Zulip release notes.
- Install the command auto-completion and/or git-prompt plugins available for
  [Bash][gitbook-other-envs-bash] and [Zsh][gitbook-other-envs-zsh].

If you are installing the Zulip development environment, now you are ready to
continue with [Step 1: Install prerequisites](../development/setup-recommended.md#step-1-install-prerequisites).

## Get a graphical client

Even if you're comfortable using Git on the command line, having a graphical
client can be useful for viewing your repository. This is especially true
when doing complicated rebases and similar operations because you can check
the state of your repository after each command to see what changed. If
something goes wrong, this helps you figure out when and why.

If you don't already have one installed, here are some suggestions:

- macOS: [GitX][gitgui-gitx] (previously [GitX-dev][gitgui-gitxdev])
- Ubuntu/Linux: [git-cola][gitgui-gitcola], [gitg][gitgui-gitg], [gitk][gitgui-gitk]
- Windows: [SourceTree][gitgui-sourcetree]

If you like working on the command line, but want better visualization and
navigation of your Git repo, try [Tig][tig], a cross-platform ncurses-based
text-mode interface to Git.

And, if none of the above are to your liking, try [one of these][gitbook-guis].

[git-bash-admin]: ../development/setup-advanced.md#running-git-bash-as-an-administrator
[gitbook-aliases]: https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases
[gitbook-config]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration
[gitbook-guis]: https://git-scm.com/downloads/guis
[gitbook-install]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[github-join]: https://github.com/join
[gitbook-setup]: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
[gitbook-other-envs-bash]: https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Bash
[gitbook-other-envs-zsh]: https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Zsh
[gitgui-gitcola]: https://git-cola.github.io/
[gitgui-gitg]: https://wiki.gnome.org/Apps/Gitg
[gitgui-gitk]: https://git-scm.com/docs/gitk
[gitgui-gitx]: https://github.com/gitx/gitx/
[gitgui-gitxdev]: https://rowanj.github.io/gitx/
[gitgui-sourcetree]: https://www.sourcetreeapp.com/
[github-help-add-ssh-key]: https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
[tig]: https://jonas.github.io/tig/
```

--------------------------------------------------------------------------------

---[FILE: terminology.md]---
Location: zulip-main/docs/git/terminology.md

```text
# Important Git terms

When you install Git, it adds a manual entry for `gitglossary`. You can view
this glossary by running `man gitglossary`. Below we've included the Git terms
you'll encounter most often along with their definitions from _gitglossary_.

## branch

A "branch" is an active line of development. The most recent commit
on a branch is referred to as the tip of that branch. The tip of
the branch is referenced by a branch head, which moves forward as
additional development is done on the branch. A single Git
repository can track an arbitrary number of branches, but your
working tree is associated with just one of them (the "current" or
"checked out" branch), and HEAD points to that branch.

## cache

Obsolete for: index

## checkout

The action of updating all or part of the working tree with a tree
object or blob from the object database, and updating the index and
HEAD if the whole working tree has been pointed at a new branch.

## commit

As a noun: A single point in the Git history; the entire history of
a project is represented as a set of interrelated commits. The word
"commit" is often used by Git in the same places other revision
control systems use the words "revision" or "version". Also used as
a short hand for commit object.

As a verb: The action of storing a new snapshot of the project's
state in the Git history, by creating a new commit representing the
current state of the index and advancing HEAD to point at the new

## fast-forward

A fast-forward is a special type of merge where you have a revision
and you are "merging" another branch's changes that happen to be a
descendant of what you have. In such these cases, you do not make a
new merge commit but instead just update to their revision. This will
happen frequently on a remote-tracking branch of a remote
repository.

## fetch

Fetching a branch means to get the branch's head ref from a remote
repository, to find out which objects are missing from the local
object database, and to get them, too. See also [git-fetch(1)](https://git-scm.com/docs/git-fetch)

## hash

In Git's context, synonym for object name.

## head

A named reference to the commit at the tip of a branch. Heads are
stored in a file in $GIT_DIR/refs/heads/ directory, except when
using packed refs. See also [git-pack-refs(1)](https://git-scm.com/docs/git-pack-refs).

## HEAD

The current branch. In more detail: Your working tree is normally
derived from the state of the tree referred to by HEAD. HEAD is a
reference to one of the heads in your repository, except when using
a detached HEAD, in which case it directly references an arbitrary
commit.

## index

A collection of files with stat information, whose contents are
stored as objects. The index is a stored version of your working
tree. Truth be told, it can also contain a second, and even a third
version of a working tree, which are used when merging.

## pull

Pulling a branch means to fetch it and merge it. See also [git-pull(1)](https://git-scm.com/docs/git-pull)

## push

Pushing a branch means to get the branch's head ref from a remote
repository, find out if it is a direct ancestor to the branch's
local head ref, and in that case, putting all objects, which are
reachable from the local head ref, and which are missing from the
remote repository, into the remote object database, and updating
the remote head ref. If the remote head is not an ancestor to the
local head, the push fails.

## rebase

To reapply a series of changes from a branch to a different base,
and reset the head of that branch to the result.
```

--------------------------------------------------------------------------------

---[FILE: the-git-difference.md]---
Location: zulip-main/docs/git/the-git-difference.md

```text
# How Git is different

Whether you're new to Git or have experience with another version control
system (VCS), it's a good idea to learn a bit about how Git works. We recommend
this excellent presentation _[Understanding Git][understanding-git]_ from
Nelson Elhage and Anders Kaseorg and the [Git Basics][gitbook-basics] chapter
from _Pro Git_ by Scott Chacon and Ben Straub.

Here are the top things to know:

- **Git works on snapshots.** Unlike other version control systems (e.g.,
  Subversion, Perforce, Bazaar), which track files and changes to those files
  made over time, Git tracks _snapshots_ of your project. Each time you commit
  or otherwise make a change to your repository, Git takes a snapshot of your
  project and stores a reference to that snapshot. If a file hasn't changed,
  Git creates a link to the identical file rather than storing it again.

- **Most Git operations are local.** Git is a distributed version control
  system, so once you've cloned a repository, you have a complete copy of that
  repository's _entire history_. Staging, committing, branching, and browsing
  history are all things you can do locally without network access and without
  immediately affecting any remote repositories. To make or receive changes
  from remote repositories, you need to `git fetch`, `git pull`, or `git push`.

- **Nearly all Git actions add information to the Git database**, rather than
  removing it. As such, it's hard to make Git perform actions that you can't
  undo. However, Git can't undo what it doesn't know about, so it's a good
  practice to frequently commit your changes and frequently push your commits to
  your remote repository.

- **Git is designed for lightweight branching and merging.** Branches are
  simply references to snapshots. It's okay and expected to make a lot of
  branches, even throwaway and experimental ones.

- **Git stores all data as objects, of which there are four types:** blob
  (file), tree (directory), commit (revision), and tag. Each of these objects
  is named by a unique hash, the SHA-1 hash of its contents. Most of the time
  you'll refer to objects by their truncated hash or more human-readable
  reference like `HEAD` (the current branch). Blobs and trees represent files
  and directories. Tags are named references to other objects. A commit object
  includes: tree id, zero or more parents as commit ids, an author (name,
  email, date), a committer (name, email, date), and a log message. A Git
  repository is a collection of mutable pointers to these objects called
  **refs**.

- **Cloning a repository creates a working copy.** Every working copy has a
  `.git` subdirectory, which contains its own Git repository. The `.git`
  subdirectory also tracks the _index_, a staging area for changes that will
  become part of the next commit. All files outside of `.git` is the _working
  tree_.

- **Files tracked with Git have possible three states: committed, modified, and
  staged.** Committed files are those safely stored in your local `.git`
  repository/database. Staged files have changes and have been marked for
  inclusion in the next commit; they are part of the index. Modified files have
  changes but have not yet been marked for inclusion in the next commit; they
  have not been added to the index.

- **Git commit workflow is as follows.** Edit files in your _working tree_. Add
  to the _index_ (that is _stage_) with `git add`. _Commit_ to the HEAD of the
  current branch with `git commit`.

[gitbook-basics]: https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository
[understanding-git]: https://web.mit.edu/nelhage/Public/git-slides-2009.pdf
```

--------------------------------------------------------------------------------

---[FILE: troubleshooting.md]---
Location: zulip-main/docs/git/troubleshooting.md

```text
# Get and stay out of trouble

Git is a powerful yet complex version control system. Even for contributors
experienced at using version control, it can be confusing. The good news is
that nearly all Git actions add information to the Git database, rather than
removing it. As such, it's hard to make Git perform actions that you can't
undo. However, Git can't undo what it doesn't know about, so it's a good
practice to frequently commit your changes and frequently push your commits to
your remote repository.

## Undo a merge commit

A merge commit is a special type of commit that has two parent commits. It's
created by Git when you merge one branch into another and the last commit on
your current branch is not a direct ancestor of the branch you are trying to
merge in. This happens quite often in a busy project like Zulip where there are
many contributors because upstream/zulip will have new commits while you're
working on a feature or bugfix. In order for Git to merge your changes and the
changes that have occurred on zulip/upstream since you first started your work,
it must perform a three-way merge and create a merge commit.

Merge commits aren't bad, however, Zulip doesn't use them. Instead Zulip uses a
forked-repo, rebase-oriented workflow.

A merge commit is usually created when you've run `git pull` or `git merge`.
You'll know you're creating a merge commit if you're prompted for a commit
message and the default is something like this:

```text
Merge branch 'main' of https://github.com/zulip/zulip

# Please enter a commit message to explain why this merge is necessary,
# especially if it merges an updated upstream into a topic branch.
#
# Lines starting with '#' will be ignored, and an empty message aborts
# the commit.
```

And the first entry for `git log` will show something like:

```console
commit e5f8211a565a5a5448b93e98ed56415255546f94
Merge: 13bea0e e0c10ed
Author: Christie Koehler <ck@christi3k.net>
Date:   Mon Oct 10 13:25:51 2016 -0700

    Merge branch 'main' of https://github.com/zulip/zulip
```

Some graphical Git clients may also create merge commits.

To undo a merge commit, first run `git reflog` to identify the commit you want
to roll back to:

```console
$ git reflog

e5f8211 HEAD@{0}: pull upstream main: Merge made by the 'recursive' strategy.
13bea0e HEAD@{1}: commit: test commit for docs.
```

Reflog output will be long. The most recent Git refs will be listed at the top.
In the example above `e5f8211 HEAD@{0}:` is the merge commit made automatically
by `git pull` and `13bea0e HEAD@{1}:` is the last commit I made before running
`git pull`, the commit that I want to rollback to.

Once you'd identified the ref you want to revert to, you can do so with [git
reset][gitbook-reset]:

```console
$ git reset --hard 13bea0e
HEAD is now at 13bea0e test commit for docs.
```

:::{important}
`git reset --hard <commit>` will discard all changes in your
working directory and index since the commit you're resetting to with
`<commit>`. _This is the main way you can lose work in Git_. If you need
to keep any changes that are in your working directory or that you have
committed, use `git reset --merge <commit>` instead.
:::

You can also use the relative reflog `HEAD@{1}` instead of the commit hash,
just keep in mind that this changes as you run Git commands.

Now when you look at the output of `git reflog`, you should see that the tip of your branch points to your
last commit `13bea0e` before the merge:

```console
$ git reflog

13bea0e HEAD@{2}: reset: moving to HEAD@{1}
e5f8211 HEAD@{3}: pull upstream main: Merge made by the 'recursive' strategy.
13bea0e HEAD@{4}: commit: test commit for docs.
```

And the first entry `git log` shows is this:

```console
commit 13bea0e40197b1670e927a9eb05aaf50df9e8277
Author: Christie Koehler <ck@christi3k.net>
Date:   Mon Oct 10 13:25:38 2016 -0700

    test commit for docs.
```

## Restore a lost commit

We've mentioned you can use `git reset --hard` to rollback to a previous
commit. What if you run `git reset --hard` and then realize you actually need
one or more of the commits you just discarded? No problem, you can restore them
with `git cherry-pick` ([docs][gitbook-git-cherry-pick]).

For example, let's say you just committed "some work" and your `git log` looks
like this:

```console
* 67aea58 (HEAD -> main) some work
* 13bea0e test commit for docs.
```

You then mistakenly run `git reset --hard 13bea0e`:

```console
$ git reset --hard 13bea0e
HEAD is now at 13bea0e test commit for docs.

$ git log
* 13bea0e (HEAD -> main) test commit for docs.
```

And then realize you actually needed to keep commit 67aea58. First, use
`git reflog` to confirm that commit you want to restore and then run
`git cherry-pick <commit>`:

```console
$ git reflog
13bea0e HEAD@{0}: reset: moving to 13bea0e
67aea58 HEAD@{1}: commit: some work

$ git cherry-pick 67aea58
 [main 67aea58] some work
 Date: Thu Oct 13 11:51:19 2016 -0700
 1 file changed, 1 insertion(+)
 create mode 100644 test4.txt
```

## Recover from a `git rebase` failure

One situation in which `git rebase` will fail and require you to intervene is
when your change, which Git will try to re-apply on top of new commits from
which ever branch you are rebasing on top of, is to code that has been changed
by those new commits.

For example, while I'm working on a file, another contributor makes a change to
that file, submits a pull request and has their code merged into `main`.
Usually this is not a problem, but in this case the other contributor made a
change to a part of the file I also want to change. When I try to bring my
branch up to date with `git fetch` and then `git rebase upstream/main`, I see
the following:

```console
First, rewinding head to replay your work on top of it...
Applying: test change for docs
Using index info to reconstruct a base tree...
M    README.md
Falling back to patching base and 3-way merge...
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
error: Failed to merge in the changes.
Patch failed at 0001 test change for docs
The copy of the patch that failed is found in: .git/rebase-apply/patch

When you have resolved this problem, run "git rebase --continue".
If you prefer to skip this patch, run "git rebase --skip" instead.
To check out the original branch and stop rebasing, run "git rebase --abort".
```

This message tells me that Git was not able to apply my changes to README.md
after bringing in the new commits from upstream/main.

Running `git status` also gives me some information:

```console
rebase in progress; onto 5ae56e6
You are currently rebasing branch 'docs-test' on '5ae56e6'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)

Unmerged paths:
  (use "git reset HEAD <file>..." to unstage)
  (use "git add <file>..." to mark resolution)

  both modified:   README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

To fix, open all the files with conflicts in your editor and decide which edits
should be applied. Git uses standard conflict-resolution (`<<<<<<<`, `=======`,
and `>>>>>>>`) markers to indicate where in files there are conflicts.

Tip: You can see recent changes made to a file by running the following
commands:

```bash
git fetch upstream
git log -p upstream/main -- /path/to/file
```

You can use this to compare the changes that you have made to a file with the
ones in upstream, helping you avoid undoing changes from a previous commit when
you are rebasing.

Once you've done that, save the file(s), stage them with `git add` and then
continue the rebase with `git rebase --continue`:

```console
$ git add README.md

$ git rebase --continue
Applying: test change for docs
```

For help resolving merge conflicts, see [basic merge
conflicts][gitbook-basic-merge-conflicts], [advanced
merging][gitbook-advanced-merging], and/or GitHub's help on [how to resolve a
merge conflict][github-help-resolve-merge-conflict].

## Working from multiple computers

Working from multiple computers with Zulip and Git is fine, but you'll need to
pay attention and do a bit of work to ensure all of your work is readily
available.

Recall that most Git operations are local. When you commit your changes with
`git commit` they are safely stored in your _local_ Git database only. That is,
until you _push_ the commits to GitHub, they are only available on the computer
where you committed them.

So, before you stop working for the day, or before you switch computers, push
all of your commits to GitHub with `git push`:

```console
$ git push origin <branchname>
```

When you first start working on a new computer, you'll [clone the Zulip
repository][clone-to-your-machine] and [connect it to Zulip
upstream][connect-upstream]. A clone retrieves all current commits,
including the ones you pushed to GitHub from your other computer.

But if you're switching to another computer on which you have already cloned
Zulip, you need to update your local Git database with new refs from your
GitHub fork. You do this with `git fetch`:

```console
$ git fetch <username>
```

Ideally you should do this before you have made any commits on the same branch
on the second computer. Then you can `git merge` on whichever branch you need
to update:

```console
$ git checkout <my-branch>
Switched to branch '<my-branch>'

$ git merge origin/main
```

**If you have already made commits on the second computer that you need to
keep,** you'll need to use `git log FETCH_HEAD` to identify that hashes of the
commits you want to keep and then `git cherry-pick <commit>` those commits into
whichever branch you need to update.

[clone-to-your-machine]: cloning.md#step-1b-clone-to-your-machine
[connect-upstream]: cloning.md#step-1c-connect-your-fork-to-zulip-upstream
[gitbook-advanced-merging]: https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#_advanced_merging
[gitbook-basic-merge-conflicts]: https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#Basic-Merge-Conflicts
[gitbook-git-cherry-pick]: https://git-scm.com/docs/git-cherry-pick
[gitbook-reset]: https://git-scm.com/docs/git-reset
[github-help-resolve-merge-conflict]: https://help.github.com/en/articles/resolving-a-merge-conflict-using-the-command-line
```

--------------------------------------------------------------------------------

---[FILE: using.md]---
Location: zulip-main/docs/git/using.md

```text
# Using Git as you work

## Know what branch you're working on

When using Git, it's important to know which branch you currently have checked
out because most Git commands implicitly operate on the current branch. You can
determine the currently checked out branch several ways.

One way is with [git status][gitbook-git-status]:

```console
$ git status
On branch issue-demo
nothing to commit, working directory clean
```

Another is with [git branch][gitbook-git-branch] which will display all local
branches, with a star next to the current branch:

```console
$ git branch
* issue-demo
  main
```

To see even more information about your branches, including remote branches,
use `git branch -vva`:

```console
$ git branch -vva
* issue-123                 517468b troubleshooting tip about provisioning
  main                      f0eaee6 [origin/main] bug: Fix traceback in get_missed_message_token_from_address().
  remotes/origin/HEAD       -> origin/main
  remotes/origin/issue-1234 4aeccb7 Another test commit, with longer message.
  remotes/origin/main       f0eaee6 bug: Fix traceback in get_missed_message_token_from_address().
  remotes/upstream/main     dbeab6a Optimize checks of test database state by moving into Python.
```

You can also configure [Bash][gitbook-other-envs-bash] and
[Zsh][gitbook-other-envs-zsh] to display the current branch in your prompt.

## Keep your fork up to date

You'll want to [keep your fork][github-help-sync-fork] up-to-date with changes
from Zulip's main repositories.

**Note about `git pull`**: You might be used to using `git pull` on other
projects. With Zulip, because we don't use merge commits, you'll want to avoid
it. Rather than using `git pull`, which by default is a shortcut for
`git fetch && git merge FETCH_HEAD` ([docs][gitbook-git-pull]), you
should use `git fetch` and then `git rebase`.

First, [fetch][gitbook-fetch] changes from Zulip's upstream repository you
configured in the step above:

```console
$ git fetch upstream
```

Next, check out your `main` branch and [rebase][gitbook-git-rebase] it on top
of `upstream/main`:

```console
$ git checkout main
Switched to branch 'main'

$ git rebase upstream/main
```

This will rollback any changes you've made to `main`, update it from
`upstream/main`, and then re-apply your changes. Rebasing keeps the commit
history clean and readable.

When you're ready, [push your changes][github-help-push] to your remote fork.
Make sure you're in branch `main` and then run `git push`:

```console
$ git checkout main
$ git push origin main
```

You can keep any branch up to date using this method. If you're working on a
feature branch (see next section), which we recommend, you would change the
command slightly, using the name of your `feature-branch` rather than `main`:

```console
$ git checkout feature-branch
Switched to branch 'feature-branch'

$ git rebase upstream/main

$ git push origin feature-branch
```

## Work on a feature branch

One way to keep your work organized is to create a branch for each issue or
feature. Recall from [how Git is different][how-git-is-different] that
**Git is designed for lightweight branching and merging.** You can and should
create as many branches as you'd like.

First, make sure your `main` branch is up-to-date with Zulip upstream ([see
how][zulip-git-guide-up-to-date]).

Next, from your `main` branch, create a new tracking branch, providing a
descriptive name for your feature branch:

```console
$ git checkout main
Switched to branch 'main'

$ git checkout -b issue-1755-fail2ban
Switched to a new branch 'issue-1755-fail2ban'
```

Alternatively, you can create a new branch explicitly based off
`upstream/main`:

```console
$ git checkout -b issue-1755-fail2ban upstream/main
Switched to a new branch 'issue-1755-fail2ban'
```

Now you're ready to work on the issue or feature.

## Run linters and tests locally

In addition to having GitHub Actions run tests and linters each time you
push a new commit, you can also run them locally. See
[testing](../testing/testing.md) for details.

## Stage changes

Recall that files tracked with Git have possible three states:
committed, modified, and staged.

To prepare a commit, first add the files with changes that you want
to include in your commit to your staging area. You _add_ both new files and
existing ones. You can also remove files from staging when necessary.

### Get status of working directory

To see what files in the working directory have changes that have not been
staged, use `git status`.

If you have no changes in the working directory, you'll see something like
this:

```console
$ git status
On branch issue-123
nothing to commit, working directory clean
```

If you have unstaged changes, you'll see something like this:

```console
On branch issue-123
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        newfile.py

nothing added to commit but untracked files present (use "git add" to track)
```

### Stage additions with `git add`

To add changes to your staging area, use `git add <filename>`. Because
`git add` is all about staging the changes you want to commit, you use
it to add _new files_ as well as _files with changes_ to your staging
area.

Continuing our example from above, after we run `git add newfile.py`, we'll see
the following from `git status`:

```console
On branch issue-123
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   newfile.py
```

You can view the changes in files you have staged with `git diff --cached`. To
view changes to files you haven't yet staged, just use `git diff`.

If you want to add all changes in the working directory, use `git add -A`
([documentation][gitbook-add]).

You can also stage changes using your graphical Git client.

If you stage a file, you can undo it with `git reset HEAD <filename>`. Here's
an example where we stage a file `test3.txt` and then unstage it:

```console
$ git add test3.txt
On branch issue-1234
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   test3.txt

$ git reset HEAD test3.txt
$ git status
On branch issue-1234
Untracked files:
  (use "git add <file>..." to include in what will be committed)

        test3.txt

nothing added to commit but untracked files present (use "git add" to track)
```

### Stage deletions with `git rm`

To remove existing files from your repository, use `git rm`
([documentation][gitbook-rm]). This command can either stage the file for
removal from your repository AND delete it from your working directory or just
stage the file for deletion and leave it in your working directory.

To stage a file for deletion and **remove** it from your working directory, use
`git rm <filename>`:

```console
$ git rm test.txt
rm 'test.txt'

$ git status
On branch issue-1234
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        deleted:    test.txt

$ ls test.txt
ls: No such file or directory
```

To stage a file for deletion and **keep** it in your working directory, use
`git rm --cached <filename>`:

```console
$ git rm --cached test2.txt
rm 'test2.txt'

$ git status
On branch issue-1234
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        deleted:    test2.txt

$ ls test2.txt
test2.txt
```

If you stage a file for deletion with the `--cached` option, and haven't yet
run `git commit`, you can undo it with `git reset HEAD <filename>`:

```console
$ git reset HEAD test2.txt
```

Unfortunately, you can't restore a file deleted with `git rm` if you didn't use
the `--cache` option. However, `git rm` only deletes files it knows about.
Files you have never added to Git won't be deleted.

## Commit changes

When you've staged all your changes, you're ready to commit. You can do this
with `git commit -m "My commit message."` to include a commit message.

Here's an example of committing with the `-m` for a one-line commit message:

```console
$ git commit -m "Add a test commit for docs."
[issue-123 173e17a] Add a test commit for docs.
 1 file changed, 1 insertion(+)
 create mode 100644 newfile.py
```

You can also use `git commit` without the `-m` option and your editor to open,
allowing you to easily draft a multi-line commit message.

How long your commit message should be depends on where you are in your work.
Using short, one-line messages for commits related to in-progress work makes
sense. For a commit that you intend to be final or that encompasses a
significant amount or complex work, you should include a longer message.

Keep in mind that your commit should contain a 'minimal coherent idea' and have
a quality commit message. See Zulip docs [Commit
Discipline][zulip-rtd-commit-discipline] and [Commit
messages][zulip-rtd-commit-messages] for details.

Here's an example of a longer commit message that will be used for a pull request:

```text
Integrate Fail2Ban.

Updates Zulip logging to put an unambiguous entry into the logs such
that fail2ban can be configured to look for these entries.

Tested on my local Ubuntu development server, but would appreciate
someone testing on a production install with more users.

Fixes #1755.
```

The first line is the summary. It's a complete sentence, ending in a period. It
uses a present-tense action verb, "Integrate", rather than "Integrates" or
"Integrating".

The following paragraphs are full prose and explain why and how the change was
made. It explains what testing was done and asks specifically for further
testing in a more production-like environment.

The final paragraph indicates that this commit addresses and fixes issue #1755.
When you submit your pull request, GitHub will detect and link this reference
to the appropriate issue. Once your commit is merged into `upstream/main`, GitHub
will automatically close the referenced issue. See [Closing issues via commit
messages][github-help-closing-issues] for details.

Note in particular that GitHub's regular expressions for this feature
are sloppy, so phrases like `Partially fixes #1234` will automatically
close the issue. Phrases like `Fixes part of #1234` are a good
alternative.

Make as many commits as you need to address the issue or implement your feature.

## Push your commits to GitHub

As you're working, it's a good idea to frequently push your changes to GitHub.
This ensures your work is backed up should something happen to your local
machine and allows others to follow your progress. It also allows you to
[work from multiple computers][self-multiple-computers] without losing work.

Pushing to a feature branch is just like pushing to `main`:

```console
$ git push origin <branch-name>
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (6/6), 658 bytes | 0 bytes/s, done.
Total 6 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 1 local objects.
To git@github.com:christi3k/zulip.git
 * [new branch]      issue-demo -> issue-demo
```

If you want to see what Git will do without actually performing the push, add
the `-n` (dry-run) option: `git push -n origin <branch-name>`. If everything
looks good, re-run the push command without `-n`.

If the feature branch does not already exist on GitHub, it will be created when
you push and you'll see `* [new branch]` in the command output.

## Examine and tidy your commit history

Examining your commit history prior to submitting your pull request is a good
idea. Is it tidy such that each commit represents a minimally coherent idea
(see [commit discipline][zulip-rtd-commit-discipline])? Do your commit messages
follow [Zulip's style][zulip-rtd-commit-messages]? Will the person reviewing
your commit history be able to clearly understand your progression of work?

On the command line, you can use the `git log` command to display an easy to
read list of your commits:

```console
$ git log --all --graph --oneline --decorate

* 4f8d75d (HEAD -> 1754-docs-add-git-workflow) docs: Add details about configuring Travis CI.
* bfb2433 (origin/1754-docs-add-git-workflow) docs: Add section for keeping fork up-to-date to Git Guide.
* 4fe10f8 docs: Add sections for creating and configuring fork to Git Guide.
* 985116b docs: Add graphic client recs to Git Guide.
* 3c40103 docs: Add stubs for remaining Git Guide sections.
* fc2c01e docs: Add git guide quickstart.
| * f0eaee6 (upstream/main) bug: Fix traceback in get_missed_message_token_from_address().
```

Alternatively, use your graphical client to view the history for your feature branch.

If you need to update any of your commits, you can do so with an interactive
[rebase][github-help-rebase]. Common reasons to use an interactive rebase
include:

- squashing several commits into fewer commits
- splitting a single commit into two or more
- rewriting one or more commit messages

There is ample documentation on how to rebase, so we won't go into details
here. We recommend starting with GitHub's help article on
[rebasing][github-help-rebase] and then consulting Git's documentation for
[git-rebase][gitbook-git-rebase] if you need more details.

If all you need to do is edit the commit message for your last commit, you can
do that with `git commit --amend`. See [Git Basics - Undoing
Things][gitbook-basics-undoing] for details on this and other useful commands.

## Force-push changes to GitHub after you've altered your history

Any time you alter history for commits you have already pushed to GitHub,
you'll need to prefix the name of your branch with a `+`. Without this, your
updates will be rejected with a message such as:

```console
$ git push origin 1754-docs-add-git-workflow
To git@github.com:christi3k/zulip.git
 ! [rejected] 1754-docs-add-git-workflow -> 1754-docs-add-git-workflow (non-fast-forward)
error: failed to push some refs to 'git@github.com:christi3k/zulip.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.,
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

Re-running the command with `+<branch>` allows the push to continue by
re-writing the history for the remote repository:

```console
$ git push origin +1754-docs-add-git-workflow
Counting objects: 12, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (12/12), 3.71 KiB | 0 bytes/s, done.
Total 12 (delta 8), reused 0 (delta 0)
remote: Resolving deltas: 100% (8/8), completed with 2 local objects.
To git@github.com:christi3k/zulip.git
 + 2d49e2d...bfb2433 1754-docs-add-git-workflow -> 1754-docs-add-git-workflow (forced update)
```

This is perfectly okay to do on your own feature branches, especially if you're
the only one making changes to the branch. If others are working along with
you, they might run into complications when they retrieve your changes because
anyone who has based their changes off a branch you rebase will have to do a
complicated rebase.

[gitbook-add]: https://git-scm.com/docs/git-add
[gitbook-basics-undoing]: https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things
[gitbook-fetch]: https://git-scm.com/docs/git-fetch
[gitbook-git-branch]: https://git-scm.com/docs/git-branch
[gitbook-git-pull]: https://git-scm.com/docs/git-pull
[gitbook-git-rebase]: https://git-scm.com/docs/git-rebase
[gitbook-git-status]: https://git-scm.com/docs/git-status
[gitbook-other-envs-bash]: https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Bash
[gitbook-other-envs-zsh]: https://git-scm.com/book/en/v2/Appendix-A%3A-Git-in-Other-Environments-Git-in-Zsh
[gitbook-rm]: https://git-scm.com/docs/git-rm
[github-help-closing-issues]: https://help.github.com/en/articles/closing-issues-via-commit-messages
[github-help-push]: https://help.github.com/en/articles/pushing-to-a-remote
[github-help-rebase]: https://help.github.com/en/articles/using-git-rebase
[github-help-sync-fork]: https://help.github.com/en/articles/syncing-a-fork
[how-git-is-different]: the-git-difference.md
[self-multiple-computers]: troubleshooting.md#working-from-multiple-computers
[zulip-git-guide-up-to-date]: #keep-your-fork-up-to-date
[zulip-rtd-commit-discipline]: ../contributing/commit-discipline.md
[zulip-rtd-commit-messages]: ../contributing/commit-discipline.md
```

--------------------------------------------------------------------------------

````
