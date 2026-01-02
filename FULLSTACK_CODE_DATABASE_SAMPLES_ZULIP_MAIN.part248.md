---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 248
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 248 of 1290)

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

---[FILE: commit-discipline.md]---
Location: zulip-main/docs/contributing/commit-discipline.md

```text
# Commit discipline

We follow the Git project's own commit discipline practice of "Each
commit is a minimal coherent idea". This discipline takes a bit of work,
but it makes it much easier for code reviewers to spot bugs, and
makes the commit history a much more useful resource for developers
trying to understand why the code works the way it does, which also
helps a lot in preventing bugs.

Use `git rebase -i` as much as you need to shape your commit structure. See the
[Git guide](../git/overview.md) for useful resources on mastering Git.

## Each commit must be coherent

- It should pass tests (so test updates needed by a change should be
  in the same commit as the original change, not a separate "fix the
  tests that were broken by the last commit" commit).
- It should not make Zulip worse. For example, it is fine to add backend
  capabilities without adding a frontend to access them. It's not fine to add a
  frontend component with no backend to make it work.
- It should be safe to deploy individually, or explain in detail in
  the commit message as to why it isn't (maybe with a [manual] tag).
  So implementing a new API endpoint in one commit and then adding the
  security checks in a future commit should be avoided -- the security
  checks should be there from the beginning.
- Error handling should generally be included along with the code that
  might trigger the error.
- TODO comments should be in the commit that introduces the issue or
  the functionality with further work required.

## Commits should generally be minimal

Whenever possible, find chunks of complexity that you can separate from the
rest of the project.

- If you need to refactor code, add tests for existing functionality,
  rename variables or functions, or make other changes that do not
  change the functionality of the product, make those changes into a
  series of preparatory commits that can be merged independently of
  building the feature itself.
- Moving code from one file to another should be done in a separate
  commits from functional changes or even refactoring within a file.
- 2 different refactorings should be done in different commits.
- 2 different features should be done in different commits.
- If you find yourself writing a commit message that reads like a list
  of somewhat dissimilar things that you did, you probably should have
  just done multiple commits.

### When not to be overly minimal

- For completely new features, you don't necessarily need to split out
  new commits for each little subfeature of the new feature. E.g., if
  you're writing a new tool from scratch, it's fine to have the
  initial tool have plenty of options/features without doing separate
  commits for each one. That said, reviewing a 2000-line giant blob of
  new code isn't fun, so please be thoughtful about submitting things
  in reviewable units.
- Don't bother to split backend commits from frontend commits, even
  though the backend can often be coherent on its own.

## Write a clean commit history

- Overly fine commits are easy to squash later, but not vice versa.
  So err toward small commits, and the code reviewer can advise on
  squashing.
- If a commit you write doesn't pass tests, you should usually fix
  that by amending the commit to fix the bug, not writing a new "fix
  tests" commit on top of it.

Zulip expects you to structure the commits in your pull requests to form
a clean history before we will merge them. It's best to write your
commits following these guidelines in the first place, but if you don't,
you can always fix your history using `git rebase -i` (more on that
[here](../git/fixing-commits.md)).

Never mix multiple changes together in a single commit, but it's great
to include several related changes, each in their own commit, in a
single pull request. If you notice an issue that is only somewhat
related to what you were working on, but you feel that it's too minor
to create a dedicated pull request, feel free to append it as an
additional commit in the pull request for your main project (that
commit should have a clear explanation of the bug in its commit
message). This way, the bug gets fixed, but this independent change
is highlighted for reviewers. Or just create a dedicated pull request
for it. Whatever you do, don't squash unrelated changes together in a
single commit; the reviewer will ask you to split the changes out into
their own commits.

It can take some practice to get used to writing your commits with a
clean history so that you don't spend much time doing interactive
rebases. For example, often you'll start adding a feature, and discover
you need to do a refactoring partway through writing the feature. When that
happens, we recommend you stash your partial feature, do the refactoring,
commit it, and then unstash and finish implementing your feature.

For additional guidance on how to structure your commits (and why it matters!),
check out GitHub's excellent [blog post](https://github.blog/2022-06-30-write-better-commits-build-better-projects).

## Commit messages

Commit messages have two parts:

1. A **summary**, which is a brief one-line overview of the changes.
2. A **description**, which provides further details on the changes,
   the motivation behind them, and why they improve the project.

In Zulip, commit summaries have a two-part structure:

1. A one or two word description of the part of the codebase changed
   by the commit.
2. A short sentence summarizing your changes.

Here is an
[example](https://github.com/zulip/zulip/commit/084dd216f017c32e15c1b13469bcbc928cd0bce9)
of a good commit message:

> tests: Remove ignored realm_str parameter from message send test.
>
> In commit
> [8181ec4](https://github.com/zulip/zulip/commit/8181ec4b56abf598223112e7bc65ce20f3a6236b),
> we removed the `realm_str` as a parameter for `send_message_backend`. This
> removes a missed test that included this as a parameter for that
> endpoint/function.

The commit message is a key piece of how you communicate with reviewers and
future contributors, and is no less important than the code you write. This
section provides detailed guidance on how to write an excellent commit message.

**Tip:** You can set up [Zulip's Git pre-commit hook][commit-hook] to
automatically catch common commit message mistakes.

[commit-hook]: ../git/zulip-tools.md#set-up-git-repo-script

### Commit summary, part 1

The first part of the commit summary should only be 1-2 **lower-case**
words, followed by a `:`, describing what the part of the product the
commit changes. These prefixes are essential for maintainers to
efficiently skim commits when doing release management or
investigating regressions.

Common examples include: settings, message feed, compose, left
sidebar, right sidebar, recent (for **Recent conversations**), search,
markdown, tooltips, popovers, drafts, integrations, email, docs, help,
and api docs.

When it's possible to do so concisely, it's helpful to be a little more
specific, e.g., emoji, spoilers, polls. However, a simple `settings:` is better
than a lengthy description of a specific setting.

If your commit doesn't cleanly map to a part of the product, you might
use something like "css" for CSS-only changes, or the name of the file
or technical subsystem principally being modified (not the full path,
so `realm_icon`, not `zerver/lib/realm_icon.py`).

There is no need to be creative here! If one of the examples above
fits your commit, use it. Consistency makes it easier for others to
scan commit messages to find what they need.

Additional tips:

- Use lowercase (e.g., "settings", not "Settings").
- If it's hard to find a 1-2 word description of the part of the codebase
  affected by your commit, consider again whether you have structured your
  commits well.
- Never use a generic term like "bug", "fix", or "refactor".

### Commit summary, part 2

This is a **complete sentence** that briefly summarizes your changes. There are
a few rules to keep in mind:

- Start the sentence with an
  [imperative](https://en.wikipedia.org/wiki/Imperative_mood) verb, e.g.,
  "fix", "add", "change", "rename", etc.
- Use proper capitalization and punctuation.
- Avoid abbreviations and acronyms.
- Be concise, and don't include unnecessary details. For example, "Change X and
  update tests/docs," would be better written as just, "Change X," since (as
  discussed above) _every_ commit is expected to update tests and documentation
  as needed.
- Make it readable to someone who is familiar with Zulip's codebase, but hasn't
  been involved with the effort you're working on.
- Use no more than 72 characters for the entire commit summary (parts 1 and 2).

### Examples of good commit summaries

- `provision: Improve performance of installing npm.`
- `channel: Discard all HTTP responses while reloading.`
- `integrations: Add GitLab integration.`
- `typeahead: Rename compare_by_popularity() for clarity.`
- `typeahead: Convert to ES6 module.`
- `tests: Compile Handlebars templates with source maps.`
- `blueslip: Add feature to time common operations.`
- `gather_subscriptions: Fix exception handling bad input.`
- `channel_settings: Fix save/discard widget on narrow screens.`

#### Detailed example

- **Good summary**: "gather_subscriptions: Fix exception handling bad input."
- **Not so good alternatives**:
  - "gather_subscriptions was broken": This doesn't explain how it was broken, and
    doesn't follow the format guidelines for commit summaries.
  - "Fix exception when given bad input": It's impossible to tell what part of the
    codebase was changed.
  - Not using the imperative:
    - "gather_subscriptions: Fixing exception when given bad input."
    - "gather_subscriptions: Fixed exception when given bad input."

### Commit description

The body of the commit message should explain why and how the change
was made. Like a good code comment, it should provide context and
motivation that will help both a reviewer now, and a developer looking
at your changes a year later, understand the motivation behind your
decisions.

Many decisions may be documented in multiple places (for example, both
in a commit message and a code comment). The general rules of thumb are:

- Use the commit message for information that's relevant for someone
  trying to understand the change this commit is making, or the difference
  between the old version of the code and the new version. In particular,
  this includes information about why the new version of the code is better than,
  or not worse than, the old version.
- Use code comments, or the code itself, for information that's relevant
  for someone trying to read and understand the new version of the code
  in the future, without comparing it to the old version.
- If the information is helpful for reviewing your work (for example,
  an alternative approach that you rejected or are considering,
  something you noticed that seemed weird, or an error you aren't sure
  you resolved correctly), include it in the PR description /
  discussion.

As an example, if you have a question that you expect to be resolved
during the review process, put it in a PR comment attached to a
relevant part of the changes. When the question is resolved, remember
to update code comments and/or the commit description to document the
reasoning behind the decisions.

There are some cases when the best approach is improving the code or commit
structure, not writing up details in a comment or a commit message. For example:

- If the information is the description of a calculation or function,
  consider the abstractions you're using. Often, a better name for a
  variable or function is a better path to readable code than writing
  a prose explanation.
- If the information describes an additional change that you made while working
  on the commit, consider whether it is separable from the rest of the changes.
  If it is, it should probably be moved to its own commit, with its own commit
  message explaining it. Reviewing and integrating a series of several
  well-written commits is far easier than reviewing those same changes in a
  single commit.

When you fix a GitHub issue, [mark that you have fixed the issue in
your commit
message](https://help.github.com/en/articles/closing-issues-via-commit-messages)
so that the issue is automatically closed when your code is merged,
and the commit has a permanent reference to the issue(s) that it
resolves. Zulip's preferred style for this is to have the final
paragraph of the commit message read, e.g., `Fixes #123.`.

**Note:** Avoid using a phrase like `Partially fixes #1234.`, as
GitHub's regular expressions ignore the "partially" and close the
issue. `Fixes part of #1234.` is a good alternative.

#### The purpose of the commit description

The commit summary and description should, taken together, explain to another
Zulip developer (who may not be deeply familiar with the specific
files/subsystems you're changing) why this commit improves the project. This
means explaining both what it accomplishes, and why it won't break things one
might worry about it breaking.

- Include any important investigation/reasoning that another developer
  would need to understand in order to verify the correctness of your
  change. For example, if you're removing a parameter from a function,
  the commit message might say, "It's safe to remove this parameter
  because it was always False," or, "This behavior needs to be removed
  because ...". A reviewer will likely check that indeed it was always
  `False` as part of checking your work -- what you're doing is
  providing them a chain of reasoning that they can verify.
- Provide background context. A good pattern in a commit message
  description is, "Previously, when X happened, this caused Y to
  happen, which resulted in ...", followed by a description of the
  negative outcome.
- Don't include details that are obvious from looking at the diff for
  the commit, such as lists of the names of the files or functions
  that were changed, or the fact that you updated the tests.
- Avoid unnecessary personal narrative about the process through which
  you developed this commit or pull request, like "First I tried X" or
  "I changed Y".

#### Mentioning other contributors

You can
[credit](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors)
co-authors on a commit by adding a `Co-authored-by:` line after a blank line at
the end of your commit message:

    Co-authored-by: Greg Price <greg@zulip.com>

You should always give credit where credit is due. See our [guide on continuing
unfinished work](../contributing/continuing-unfinished-work.md) for step-by-step
guidance on continuing work someone else has started.

You can also add other notes, such as `Reported-by:`, `Debugged-by:`, or
`Suggested-by:`, but we don't typically do so.

@-mentions don't belong in commit messages (and won't notify the user you
mentioned). If you want to send someone a notification about a change, @-mention
them in the PR thread.

#### Formatting guidelines

There are a few specific formatting guidelines to keep in mind:

- The commit description should be separated from the commit summary
  by a blank line. Most tools, including GitHub, will misrender commit
  messages that don't do this.
- Use full sentences and paragraphs, with proper punctuation and
  capitalization. Paragraphs should be separated with a single blank
  line.
- Be sure to check your description for typos, spelling, and grammar
  mistakes; commit messages are important technical writing and
  English mistakes will distract reviewers from your ideas.
- Your commit message should be line-wrapped to about 68 characters
  per line, but no more than 70, so that your commit message will be
  easy to read in `git log` in a normal terminal. (It's OK for links
  to be longer -- ignore `gitlint` when it complains about them.)

**Tip:** You may find it helpful to configure Git to use your preferred editor
using the `EDITOR` environment variable or `git config --global core.editor`,
and configure the editor to automatically wrap text to 70 or fewer columns per
line (all text editors support this).

### Examples of good commit messages

- [A backend testing
  commit](https://github.com/zulip/zulip/commit/4869e1b0b2bc6d56fcf44b7d0e36ca20f45d0521)
- [A development environment provisioning
  commit](https://github.com/zulip/zulip/commit/cd5b38f5d8bdcc1771ad794f37262a61843c56c0)
```

--------------------------------------------------------------------------------

---[FILE: continuing-unfinished-work.md]---
Location: zulip-main/docs/contributing/continuing-unfinished-work.md

```text
# Continuing unfinished work

Sometimes, work is started on an issue or PR, but not brought to completion.
This may happen for a variety of reasons — the contributor working on the
project gets busy, maintainers cannot prioritize reviewing the work, a
contributor doesn't have the skills required to complete the project, there is
an unexpected technical challenge or blocker, etc.

Completing work that someone else has started is a great way to contribute! Here
are the steps required:

1. [Find work to be completed.](#find-work-to-be-completed)
1. [Review existing work and feedback.](#review-existing-work-and-feedback)
1. [Decide how to use prior work.](#decide-how-to-use-prior-work)
1. [Credit prior work in your commit history.](#credit-prior-work-in-your-commit-history)
1. [Present your pull request.](#present-your-pull-request)

## Find work to be completed

In Zulip's server and web app [repository](https://github.com/zulip/zulip), pull
requests that have significant work towards something valuable are often tagged
with a [completion candidate][completion-candidate] label. You can review
this label for unfinished work that you find interesting and have the skills to
complete.

Note that it's common to see one or more pull requests linked to an issue
you're interested in. The guidelines below apply regardless of whether you
intentionally set out to find work to complete or simply find yourself
building on someone else's work.

## Review existing work and feedback

Any time there are pull requests linked to the issue you are working on, start
by reviewing the existing work. Read the code, and pay close attention to any
feedback the pull request received. This will help you avoid any pitfalls other
contributors encountered.

## Decide how to use prior work

Consider how to use prior work on the issue. In your best judgment, is the
existing PR on the right track? If there's reviewer feedback, it should help you
figure this out.

If prior work looks like a good start:

1. Pull down the existing pull request.
1. Rebase it on the current version of the `main` branch.
1. Carefully address any open feedback from reviewers.
1. Make any other changes you think are needed, including completing any parts
   of the work that had not been finished.
1. Make sure the work of others is [properly credited](#credit-prior-work-in-your-commit-history).
1. [Self-review](../contributing/code-reviewing.md), test, and revise the work,
   including potentially [splitting out](../contributing/commit-discipline.md)
   preparatory commits to make it easier to read. You should be proud of the
   resulting series of commits, and be prepared to argue that it is the best
   work you can produce to complete the issue.

Otherwise, you can:

1. Make your own changes from scratch.
1. Go through reviewer feedback on prior work. Would any of it apply to the
   changes you're proposing? Be sure to address it if so.

## Credit prior work in your commit history

When you use or build upon someone else's unmerged work, it is both
professionally and ethically necessary to [properly
credit][coauthor-git-guide] their contributions in the commit history
of work that you submit. Git, used properly, does a good job of
preserving the original authorship of commits.

However, it's normal to find yourself making changes to commits
originally authored by other contributors, whether resolving merge
conflicts when doing `git rebase` or fixing bugs to create an
atomically correct commit compliant with Zulip's [commit
guidelines](../contributing/commit-discipline.md).

When you do that, it's your responsibility to ensure the resulting
commit series correctly credits the work of everyone who materially
contributed to it. The most direct way to credit the work of someone
beyond the commit's author maintained in the Git metadata is
`Co-authored-by:` line after a blank line at the end of your commit
message:

    Co-authored-by: Greg Price <greg@zulip.com>

Be careful to type it precisely, because software parses these commit
message records in generating statistics. You should add such a line
in two scenarios:

- If your own work was squashed into a commit originally authored by
  another contributor, add such a line crediting yourself.
- If you used another contributor's work in generating your own
  commit, add such a line crediting the other contributor(s).

Sometimes, you make a mistake when rebasing and accidentally squash
commits in a way that messes up Git's authorship records. Often,
undoing the rebase change via `git reflog` is the best way to correct
such mistakes, but there are two other Git commands that can be used
to correct Git's primary authorship information after the fact:

- `git commit --amend --reset-author` will replace the Git commit
  metadata (date, author, etc.) of the currently checked out commit
  with yourself. This is useful to correct a commit that incorrectly
  shows someone else as the author of your work.
- `git commit --amend -C <commit_id>` will replace the commit metadata
  (date, author, etc.) on a commit with that of the provided commit
  ID. This is useful if you accidentally made someone else's commit
  show yourself as the author, or lost a useful commit message via
  accidental squashing. (You can usually find the right commit ID to
  use with `git reflog` or from GitHub).

As an aside, maintainers who modify commits before merging them are
credited via Git's "Committer" records (visible with `git show
--pretty=fuller`, for example). As a result, they may not bother with
adding a separate `Co-authored-by` record on commits that they revise
as part of merging a pull request.

## Present your pull request

In addition to the usual [guidance](../contributing/reviewable-prs.md) for
putting together your pull request, there are a few key points to keep in mind.

- **Take responsibility for the work.** Any time you propose changes to the
  Zulip project, you are accountable for those changes. Do your very best to verify that they are correct.

  - Don't submit code you don't understand — dig in to figure out what it's
    doing, even if you didn't write it. This is a great way to catch bugs and
    make improvements.
  - Test the work carefully, even if others have tested it before. There may be
    problems that the reviewers missed, or that were introduced by rebasing across other changes.

- **Give credit where credit is due.** Reviewers should be able to examine your
  commit history and see that you have [properly credited](#credit-prior-work-in-your-commit-history)
  the work of others.

- **Explain the relationship between your PR and prior work** in the description
  for your pull request. This is required for your PR to be reviewed, as
  reviewing a new PR when there is an existing one is a good use of time only if
  the motivation for doing so is clear.
  - If you started from an existing PR, explain what changes you made, and how
    you addressed each point of reviewer feedback that hadn't been addressed previously.
  - If you started from scratch, explain _why_ you decided to do so, and how
    your approach differs from prior work. For example:
    - "I didn't use the work in PR #12345, because the surrounding code has
      changed too much since it was written."
    - "I didn't use the work in PR #23154, because [this reviewer
      comment](#present-your-pull-request) asked to solve this issue using CSS,
      rather than the JavaScript changes made in #23154."
    - "I didn't use the work in PRs #12345 and #23154, because both didn't work
      properly when a user opened their own profile."

[completion-candidate]: https://github.com/zulip/zulip/pulls?q=is%3Aopen+is%3Apr+label%3A%22completion+candidate%22
[coauthor-git-guide]: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
```

--------------------------------------------------------------------------------

---[FILE: contributing.md]---
Location: zulip-main/docs/contributing/contributing.md

```text
../../CONTRIBUTING.md
```

--------------------------------------------------------------------------------

---[FILE: counting-contributions.md]---
Location: zulip-main/docs/contributing/counting-contributions.md

```text
# Counting contributions

The [Zulip team page](https://zulip.com/team/) displays commit counts for
contributors to Zulip projects. We display these statistics prominently because
they are easy to compute, and can be fun and motivating for some of our
contributors.

We do not consider commit count to be a good way to measure someone's
contributions to a software project. Many invaluable contributions may not
result in the contributor authoring any code at all, including design, feedback,
translations, bug reports, helping new contributors, and other types of
participation in our [development community][dev-community]. These non-code
contributions are essential to making the Zulip project successful.

Thus, Zulip's policy is to always express appreciation for non-code
contributions to the project whenever we discuss code contribution
statistics, especially in our highest-visibility contexts like release
blog posts.

## How the contribution stats are calculated

The data for all contributors to the Zulip project is aggregated by
querying [GitHub's API endpoint for listing a repository's
contributors][github-list-contrib-endpoint]. The numbers Zulip gets
from this endpoint differs slightly from the data GitHub displays in a
repository's [contributors page][github-contrib-page]. This
discrepancy is due to the following reasons:

- A repository's contributors page excludes commits with author email
  addresses that do not have an associated GitHub account. However,
  the GitHub API counts such emails in its contributor stats.
- A repository's contributors page does not count commits authored by
  email addresses that have been deleted from a GitHub profile by the
  user. However, the GitHub API treats these stale emails as
  contributors as well.
- Some commits have multiple authors when that is declared via
  [Co-Authored-By][co-authored-by] in a commit message.

## Old email addresses

If you remove an email address from your GitHub profile, the commits
you contributed with that email as the `GIT_AUTHOR_EMAIL` will
disappear from your GitHub profile. If you made contributions to Zulip
with an author email address that is no longer associated with your
GitHub profile, here are some important points to keep in mind:

- Zulip's team page will still display your contributions. These
  contributions will be grouped under the email that was used for the
  commits, but will not link to your GitHub profile.
- If you still have access to the email used for the contributions, you
  can link the contributions to your GitHub profile by
  [adding the email to your GitHub account][github-add-email].
- If you do not have access to the email in question, you can ask for
  help on chat.zulip.org, or submit a pull request editing the
  `.mailmap` file at the root of the repository where your
  contributed.

The comments at the top of our `.mailmap` files document how to map
your old email address to one currently associated with your GitHub
account.

## Relevant source code

To dig deeper into how the contributor stats are calculated, please check
out the following files in the [Zulip server repository][server-repo]:

- `tools/fetch-contributor-data` - The script that fetches contributor
  data from GitHub's API.
- `static/js/portico/team.js` - The JavaScript code that processes and
  renders the data received from GitHub.

## Attribution for non-code contributions

As noted above, Zulip's policy is to express appreciation for non-code
contributions to the project whenever we discuss code contribution
statistics.

We do not specifically attribute non-code contributions by name, because the
logistics of giving individual attributions in a consistent and fair way across
50+ features in a release are far more than we have the capacity to manage.

For context, a significant feature usually involves a half-dozen people or more
helping with different parts of the work (suggesting ideas, providing technical
and non-technical feedback, etc.). Contributions can range from multiple rounds
of PR reviews to a 👍 reaction on someone else's suggestion. Even if one could
review everything that happened (in itself a daunting task), it may not be clear
which contributions should "count". At the same time, seeing that your name is
missing from a list of attributions where it belongs can feel really hurtful.

So, while we cannot thank everyone by name, please know that your contributions
are deeply appreciated!

[github-list-contrib-endpoint]: https://docs.github.com/en/rest/reference/repos#list-repository-contributors
[github-contrib-page]: https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-a-projects-contributors
[dev-community]: https://zulip.com/development-community/
[server-repo]: https://github.com/zulip/zulip
[github-add-email]: https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-user-account/managing-email-preferences/adding-an-email-address-to-your-github-account
[co-authored-by]: https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors
```

--------------------------------------------------------------------------------

````
