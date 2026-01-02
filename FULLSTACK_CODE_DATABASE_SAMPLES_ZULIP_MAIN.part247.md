---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 247
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 247 of 1290)

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

---[FILE: asking-great-questions.md]---
Location: zulip-main/docs/contributing/asking-great-questions.md

```text
# Asking great questions

A well-formed question helps you learn, respects the person answering, and makes
efficient use of time for everyone involved. Asking the right question, to the
right person, in the right way, at the right time, is a skill which requires a
lifetime of fine-tuning. This page offers some guidelines and resources that the
[Zulip community](https://zulip.com/development-community/) has found helpful in this pursuit.

## Where to ask your question

It is almost always best to ask questions and have a conversation in a public
channel, rather than in direct messages. You’ll get better and faster answers
since many people can help, and it makes it possible for others to benefit from
the discussion.

The [Zulip community
guide](https://zulip.com/development-community/#where-do-i-send-my-message)
offers guidelines on how the major public channels in the community are used.
Don’t stress too much about picking the right place if you’re not sure, as
moderators can [move your question thread to a different
channel](https://zulip.com/help/move-content-to-another-channel) if needed.

## How to ask a great question

Spending some extra time and effort to carefully formulate your question is well
worthwhile, as it makes it much more likely that you'll get the information you
need to move forward. There are a few wonderfully thoughtful blog posts that
explain what it means to ask a good question:

- [Try, Then Ask](https://www.mattringel.com/2013/09/30/you-must-try-and-then-you-must-ask/)
- [We Aren’t Just Making Code, We’re Making History](https://www.harihareswara.net/sumana/2016/10/12/0)
- [How to Ask Good Questions](https://jvns.ca/blog/good-questions/)

In brief, to formulate a great question, you should:

- Try to solve your own problem first, including reading through relevant
  documentation and code.
- Identify the precise point on which you feel stuck.
- Formulate a clear question, which includes an appropriate amount of context
  and a specific request for help.

When your question is answered, follow through on the advice you receive, and (when
appropriate) summarize the resolution of your problem so that others can learn
from your experience.

## Follow the community guidelines

As always, be sure to follow the [Zulip community
norms](https://zulip.com/development-community/). In particular, check out [the
section on getting help](https://zulip.com/development-community/#getting-help)
before you post.
```

--------------------------------------------------------------------------------

---[FILE: code-reviewing.md]---
Location: zulip-main/docs/contributing/code-reviewing.md

```text
# Reviewing Zulip code

Code review is a key part of how Zulip does development. It's an essential
aspect of our process to build a high-quality product with a maintainable
codebase. See the [pull request review process](../contributing/review-process.md)
guide for a detailed overview of Zulip's PR review process.

## Principles of code review

Zulip has an active contributor community, and just a small handful
of maintainers who can do the final rounds of code review. As such, we would
love for contributors to help each other with making pull requests that are not
only correct, but easy to review. Doing so ensures that PRs can be finalized and
merged more quickly, and accelerates the pace of progress for the entire
project.

If you're new to open source, this may be the first time you do a code review of
anyone's changes! We have therefore written this step-by-step guide to be
accessible to all Zulip contributors.

### Reviewing your own code

One of the best ways to improve the quality of your own work as a software
engineer is to do a code review of your own work before submitting it to others for
review. We thus strongly encourage you to get into the habit of reviewing you
own code. You can often find things you missed by taking a step back to look
over your work before asking others to do so, and this guide will walk you
through the process. Catching mistakes yourself will help your PRs be merged
faster, and folks will appreciate the quality and professionalism of your
work.

### Reviewing other contributors' code

Doing code reviews is a valuable contribution to the Zulip project.
It's also an important skill to develop for participating in
open-source projects and working in the industry in general. If
you're contributing to Zulip and have been working in our code for a
little while, we would love for you to start doing code reviews!

Anyone can do a code review -- you don't have to have a ton of experience, and
you don't have to have the power to ultimately merge the PR. The sections below
offer accessible, step-by-step guidance for how to go about reviewing Zulip PRs.

For students participating in Google Summer of Code or a similar
program, we expect you to spend a chunk of your time each week (after
the first couple of weeks as you're getting going) doing code reviews.

## How to review code

Whether you are reviewing your own code or somebody else's, this section
describes how to go about it.

If you are reviewing somebody else's code, you will likely need to first fetch
it so that you can play around with the new functionality. If you're working in
the Zulip server codebase, use our [Git tool][git-tool]
`tools/fetch-rebase-pull-request` to check out a pull request locally and rebase
it onto `main`.

### Code review checklist

The following review steps apply to the majority of PRs.

**Think about the issue:**

1. Start by **rereading the issue** the PR is intended to solve. Are you
   confident that you **understand everything the issue is asking for**? If not,
   try exploring the relevant parts of the Zulip app and reading any linked
   discussions on the [development community server][czo] to see if the
   additional context helps. If any part is still confusing, post a GitHub
   comment or a message on the [development community server][czo] explaining
   precisely what points you find confusing.

2. Now that you're confident that you understand the issue, **does the PR
   address all the points described in the issue**? If not, is it easy to tell
   without reading the code which points are not addressed and why? Here is a
   handful of good ways for the author to communicate why the issue as written
   might not be fully solved by the PR:

   - The issue explicitly notes that it's fine for some parts to be completed
     separately, and the PR clearly indicates which parts are solved.
   - After discussion of initial prototypes (in GitHub comments or on the
     [development community server][czo]), it was decided to change some part of
     the specification, and the PR notes this.
   - The author explains why the PR is a better way to solve the issue than what
     was described.
   - The solution changed because of changes in the project or application since
     the issue was written, and the author explains the adjustments that were
     made.

**Think about the code:**

1. Make sure the PR uses **clear function, argument, variable, and test names.**
   Every new piece of Zulip code will be read many times by other developers, and
   future developers will `grep` for relevant terms when researching a problem, so
   it's important that variable names communicate clearly the purpose of each
   piece of the codebase.

1. Make sure the PR **avoids duplicated code.** Code duplication is a huge
   source of bugs in large projects and makes the codebase difficult to
   understand, so we avoid significant code duplication wherever possible.
   Sometimes avoiding code duplication involves some refactoring of existing
   code; if so, that should usually be done as its own series of commits (not
   squashed into other changes or left as a thing to do later). That series of
   commits can be in the same pull request as the feature that they support, and
   we recommend ordering the history of commits so that the refactoring comes
   _before_ the feature. That way, it's easy to merge the refactoring (and
   minimize risk of merge conflicts) if there are still user experience issues
   under discussion for the feature itself.

1. **Good comments** help. It's often worth thinking about whether explanation
   in a commit message or pull request discussion should be included in
   a comment, `/docs`, or other documentation. But it's better yet if
   verbose explanation isn't needed. We prefer writing code that is
   readable without explanation over a heavily commented codebase using
   lots of clever tricks.

1. Make sure the PR follows Zulip's **coding style**. See the Zulip [coding
   style documentation][code-style] for details. Our goal is to have as much of
   this as possible verified via the linters and tests, but there will always be
   unusual forms of Python/JavaScript style that our tools don't check for.

1. If you can, step back and think about the **technical design**. There are a
   lot of considerations here: security, migration paths/backwards compatibility,
   cost of new dependencies, interactions with features, speed of performance,
   API changes. Security is especially important and worth thinking about
   carefully with any changes to security-sensitive code like views.

**Think about testing:**

1. **The CI build tests need to pass.** One can investigate
   any failures and figure out what to fix by clicking on a red X next
   to the commit hash or the Detail links on a pull request. (Example:
   in [#17584](https://github.com/zulip/zulip/pull/17584),
   click the red X before `49b10a3` to see the build jobs
   for that commit. You can see that there are 7 build jobs in total.
   All the 7 jobs run in GitHub Actions. You can see what caused
   the job to fail by clicking on the failed job. This will open
   up a page in the CI that has more details on why the job failed.
   For example [this](https://github.com/zulip/zulip/actions/runs/15362225042/job/43230810881)
   is the page of an "Ubuntu 22.04 (Python 3.10, backend + frontend)" job.
   See our docs on [continuous integration](../testing/continuous-integration.md)
   to learn more.

2. Make sure **the code is well-tested**; see below for details. The PR should
   summarize any [manual testing](#manual-testing) that was done to validate
   that the feature is working as expected.

**Think about the commits:**

1. Does the PR follow the principle that “**Each commit is a minimal coherent
   idea**”? See the [commit discipline guide][commit-discipline] to learn more
   about commit structure in Zulip.

2. Does each commit have a **clear commit message**? Check for content, format,
   spelling and grammar. See the [Zulip commit discipline][commit-messages]
   documentation for details on what we look for.

You should also go through any of the following checks that are applicable:

- _Error handling._ The code should always check for invalid user
  input. User-facing error messages should be clear and when possible
  be actionable (it should be obvious to the user what they need to do
  in order to correct the problem).

- _Translation._ Make sure that the strings are marked for
  [translation].

- _Completeness of refactoring._ When reviewing a refactor, verify that the changes are
  complete. Usually, one can check that efficiently using `git grep`,
  and it's worth it, as we very frequently find issues by doing so.

- _Documentation updates._ If this changes how something works, does it
  update the documentation in a corresponding way? If it's a new
  feature, is it documented, and documented in the right place?

- _mypy annotations in Python code._ New functions should be annotated using
  [mypy] and existing annotations should be updated. Use of `Any`, `ignore`, and
  unparameterized containers should be limited to cases where a more precise
  type cannot be specified.

### Automated testing

- The tests should **validate that the feature works correctly**, and
  specifically test for common error conditions, bad user input, and potential
  bugs that are likely for the type of change being made. Tests that exclude
  whole classes of potential bugs are preferred when possible (e.g., the common
  test suite `test_markdown.py` between the Zulip server's [frontend and backend
  Markdown processors](../subsystems/markdown.md), or the `GetEventsTest` test
  for buggy race condition handling). See the [test writing][test-writing]
  documentation to learn more.

- We are trying to maintain ~100% test coverage on the backend, so backend
  changes should have negative tests for the various error conditions. See
  [backend testing documentation][backend-testing] for details.

- If the feature involves frontend changes, there should be frontend tests. See
  [frontend testing documentation][frontend-testing] for details.

### Manual testing

If the PR makes any frontend changes, you should make sure to play with the part
of the app being changed to validate that things look and work as expected.
While not all of the situations below will apply, here are some ideas for things
that should be tested if they are applicable. Use the [development
environment][development-environment] to test any web app changes.

This might seem like a long process, but you can go through it quite quickly
once you get the hang of it. Trust us, it will save time and review round-trips
down the line!

**Visual appearance:**

- Open up the parts of the UI that were changed, and make sure they look as
  you were expecting.
- Is the new UI consistent with similar UI elements? Think about fonts, colors,
  sizes, etc. If a new or modified element has multiple states (e.g., "on" and
  "off"), consider all of them.
- Is the new UI aligned correctly with the elements around it, both vertically and
  horizontally?
- If the PR adds or modifies a clickable element, does it have a hover behavior
  that's consistent with similar UI elements?
- If the PR adds or modifies an element (e.g., a button or checkbox) that is
  sometimes disabled, is the disabled version of the UI consistent with similar
  UI elements?
- Did the PR accidentally affect any other parts of the UI? E.g., if the PR
  modifies some CSS, look for other elements that may have been altered
  unintentionally. Use `git grep` to see if the code you modified is being used
  elsewhere.
- Now check all of the above in the other theme (light/dark).

**Responsiveness and internationalization:**

- Check the new UI at different window sizes, including mobile sizes (you can
  use Chrome DevTools if you like). Does it look good in both wide and narrow
  windows?
- To simulate what will happen when the UI is translated to different languages,
  try changing any new strings, or ones that are now displayed differently, to
  make them 1.5x longer, and check if anything breaks. What would happen if the
  strings were half as long as in English?

**Strings (text):**
If the PR adds or modifies strings, check the following:

- Does the wording seem consistent with similar features (similar style, level
  of detail, etc.)?
- If there is a number, are the `N = 1` and `N > 1` cases both handled properly?

**Tooltips:**

- Do elements that require tooltips have them? Check similar elements to see
  whether a tooltip is needed, and what information it should contain.

**Functionality:**
We're finally getting to the part where you actually use the new/updated
feature. :) Test to see if it works as expected, trying a variety of scenarios.
If it works as described in the issue but seems awkward in some way, note this
on the PR.

If relevant, be sure to check that:

- Live updates are working as expected.
- Keyboard navigation, including tabbing to the interactive elements, is working
  as expected.

Some scenarios to consider:

- Try clicking on any interactive elements, multiple times, in a variety of orders.
- If the feature affects the **message view**, try it out in different types of
  narrows: topic, channel, Combined feed, direct messages.
- If the feature affects the **compose box** in the web app, try both ways of
  [resizing the compose box](https://zulip.com/help/resize-the-compose-box).
  Test both channel messages and direct messages.
- If the feature might require **elevated permissions**, check it out as a user who has
  permissions to use it and one who does not.
- Think about how the feature might **interact with other features**, and try out
  such scenarios. For example:
  - If the PR adds a banner, is it possible that it would be shown at the same
    time as other banners? Does something reasonable happen?
  - If the feature has to do with topic editing, do you need to think
    about what happens when a topic is resolved/unresolved?
  - If it's a message view feature, would anything go wrong if the message was
    collapsed or muted? If it was colored like an `@`-mention or a direct message?

## Review process and communication

### Asking for a code review

The [pull request review process](../contributing/review-process.md) guide
provides a detailed overview of Zulip's PR review process. Your reviewers and
Zulip's maintainers will help shepherd your PR through the process. There are
also some additional ways to ask for a code review:

- Are there folks who have been working on similar things, or a loosely related
  area? If so, they might be a good person to review your PR. `@`-mention them
  with something like "`@person`, would you be up for reviewing this?" If
  you're not sure whether they are familiar with how Zulip code reviews work, you
  can also include a link to this guide.

- If you're not sure who to ask, you can post a message in
  [#code-review](https://chat.zulip.org/#narrow/channel/91-code-review) on [the Zulip
  development community server](https://zulip.com/development-community/) to reach
  out to a wider group of potential reviewers.

Please be patient and mindful of the fact that it isn't always possible to
provide a quick reply. Going though the [review process](#how-to-review-code)
described above for your own PR will make your code easier and faster to review,
which makes it much more likely that it will be reviewed quickly and require
fewer review cycles.

### Reviewing someone else's code

#### Fast replies are key

For the author of a PR, getting feedback quickly is really important
for making progress quickly and staying productive. That means that
if you get @-mentioned on a PR with a request for you to review it,
it helps the author a lot if you reply promptly.

A reply doesn't even have to be a full review; if a PR is big or if
you're pressed for time, then just getting some kind of reply in
quickly -- initial thoughts, feedback on the general direction, or
just saying you're busy and when you'll have time to look harder -- is
still really valuable for the author and for anyone else who might
review the PR.

People in the Zulip project live and work in many time zones, and code
reviewers also need focused chunks of time to write code and do other
things, so an immediate reply isn't always possible. But a good
benchmark is to try to always reply **within one workday**, at least
with a short initial reply, if you're working regularly on Zulip. And
sooner is better.

#### Communication style

Any time you leave a code review, be sure to treat the author with respect.
Remember that they are generously spending their time on an effort to improve
the Zulip project. Thank them for their work, and express your appreciation for
anything the author did especially well, whether it's a nice commit message, a
prompt response to earlier feedback, or a well-written test.

Be as clear and direct as you can when describing requested changes. There is no
need to apologize when asking for a change; you're collaborating with the
author to make the PR as good as you can together.

Be sure to explain the motivation for the changes you're requesting if it's not
obvious, so that the author can learn for next time. It may be helpful to point
to developer documentation, such as the [commit discipline
guide][commit-discipline].

#### Fixing up the PR

If a pull request just needs a little fixing to make it mergeable,
feel free to do that in a new commit, then push your branch to GitHub
and mention the branch in a comment on the pull request. That'll save
the maintainer time and get the PR merged quicker.

### Responding to review feedback

Once you've received a review and resolved any feedback, it's critical
to update the GitHub thread to reflect that. Best practices are to:

- Make sure that CI passes and the PR is rebased onto recent `main`.
- Post comments on each feedback thread explaining at least how you
  resolved the feedback, as well as any other useful information
  (problems encountered, reasoning for why you picked one of several
  options, a test you added to make sure the bug won't recur, etc.).
- Post a summary comment in the main feed for the PR, explaining that
  this is ready for another review, and summarizing any changes from
  the previous version, details on how you tested the changes, new
  screenshots/etc. More detail is better than less, as long as you
  take the time to write clearly.

If you resolve the feedback, but the PR has merge conflicts, CI
failures, or the most recent comment is the reviewer asking you to fix
something, it's very likely that a potential reviewer skimming your PR
will assume it isn't ready for review and move on to other work.

If you need help or think an open discussion topic requires more
feedback or a more complex discussion, move the discussion to a topic
in the [Zulip development community server][czo]. Be sure to provide links
from the GitHub PR to the conversation (and vice versa) so that it's
convenient to read both conversations together.

## Additional resources

We also recommend the following resources on code reviews.

- [The Gentle Art of Patch Review](https://sage.thesharps.us/2014/09/01/the-gentle-art-of-patch-review/)
  article by Sarah Sharp
- [Zulip & Good Code Review](https://www.harihareswara.net/sumana/2016/05/17/0)
  article by Sumana Harihareswara
- [Code Review - A consolidation of advice and stuff from the
  internet](https://gist.github.com/porterjamesj/002fb27dd70df003646df46f15e898de)
  article by James J. Porter
- [Zulip code of conduct](../code-of-conduct.md)

[code-style]: code-style.md
[commit-discipline]: commit-discipline.md
[commit-messages]: commit-discipline.md#commit-messages
[test-writing]: ../testing/testing.md
[backend-testing]: ../testing/testing-with-django.md
[frontend-testing]: ../testing/testing-with-node.md
[mypy]: ../testing/mypy.md
[git-tool]: ../git/zulip-tools.md#fetch-a-pull-request-and-rebase
[translation]: ../translating/translating.md
[czo]: https://zulip.com/development-community/
[development-environment]: ../development/overview.md
```

--------------------------------------------------------------------------------

---[FILE: code-style.md]---
Location: zulip-main/docs/contributing/code-style.md

```text
# Code style and conventions

This page documents code style policies that every Zulip developer
should understand. We aim for this document to be short and focused
only on details that cannot be easily enforced another way (e.g.,
through linters, automated tests, or subsystem design that makes classes
of mistakes unlikely). This approach minimizes the cognitive
load of ensuring a consistent coding style for both contributors and
maintainers.

One can summarize Zulip's coding philosophy as a relentless focus on
making the codebase easy to understand and difficult to make dangerous
mistakes in (see the sections on [dangerous constructs](#dangerous-constructs-in-django)
at the end of this page). The majority of work in any large software
development project is understanding the existing code so one can debug
or modify it, and investments in code readability usually end up paying
for themselves when someone inevitably needs to debug or improve the code.

When there's something subtle or complex to explain or ensure in the
implementation, we try hard to make it clear through a combination of
clean and intuitive interfaces, well-named variables and functions,
comments/docstrings, and commit messages (roughly in that order of
priority -- if you can make something clear with a good interface,
that's a lot better than writing a comment explaining how the bad
interface works).

After an introduction to our lint tools and test suites, this document
outlines some general
[conventions and practices](#follow-zulip-conventions-and-practices)
applicable to all languages used in the codebase, as well as specific
guidance on [Python](#python-specific-conventions-and-practices) and
[JavaScript and TypeScript](#javascript-and-typescript-conventions-and-practices).
([HTML and CSS](../subsystems/html-css.md) are outlined in their own
documentation.)

At the end of the document, you can read about
[dangerous constructs in Django](#dangerous-constructs-in-django) and
[JavaScript and TypeScript](#dangerous-constructs-in-javascript-and-typescript)
that you should absolutely avoid.

## Be consistent with existing code

Look at the surrounding code, or a similar part of the project, and try
to do the same thing. If you think the other code has actively bad
style, fix it (in a separate commit).

When in doubt, ask in
[#development help](https://chat.zulip.org/#narrow/channel/49-development-help).

### Use the linters

You can run all of the linters at once:

```bash
$ ./tools/lint
```

Note that that takes a little time. `./tools/lint` runs many
lint checks in parallel, including:

- JavaScript ([ESLint](https://eslint.org/),
  [Prettier](https://prettier.io/))
- Python ([mypy](http://mypy-lang.org/),
  [Ruff](https://docs.astral.sh/ruff/))
- templates
- Puppet configuration
- custom checks (e.g., trailing whitespace and spaces-not-tabs)

To speed things up, you can [pass specific files or directories
to the linter](../testing/linters.md):

```
$ ./tools/lint web/src/compose.ts
```

If you'd like, you can also set up a local Git commit hook that
will lint only your changed files each time you commit:

```bash
$ ./tools/setup-git-repo
```

### Use tests to verify your logic

Clear, readable code is important for [tests](../testing/testing.md);
familiarize yourself with our
[testing frameworks](../testing/testing.md#major-test-suites) and
[testing philosophy](../testing/philosophy.md) so that you can write
clean, readable tests. In-test comments about anything subtle that is
being verified are appreciated.

You can run all of the tests like this:

```
$ ./tools/test-all
```

But consult [our documentation on running tests](../testing/testing.md#running-tests),
which covers more targeted approaches to commanding the test-runners.

## Follow Zulip conventions and practices

What follows is language-neutral advice that is beyond the bounds of
linters and automated tests.

### Observe a reasonable line length

We have an absolute hard limit on line length only for some files, but
we should still avoid extremely long lines. A general guideline is:
refactor stuff to get it under 85 characters, unless that makes the
code a lot uglier, in which case it's fine to go up to 120 or so.

### Tag user-facing strings for translation

Remember to
[tag all user-facing strings for translation](../translating/translating.md),
whether the strings are in HTML templates or output by JavaScript/TypeScript
that injects or modifies HTML (e.g., error messages).

### Correctly prepare paths destined for state or log files

When writing out state or log files, always pass an absolute path
through `zulip_path` (found in `zproject/computed_settings.py`), which
will do the right thing in both development and production.

### Never include secrets inline with code

Please don't put any passwords, secret access keys, etc. inline in the
code. Instead, use the `get_secret` function or the `get_mandatory_secret`
function in `zproject/config.py` to read secrets from `/etc/zulip/secrets.conf`.

### Familiarize yourself with rules about third-party code

See [our docs on dependencies](../subsystems/dependencies.md) for discussion of
rules about integrating third-party projects.

## Python-specific conventions and practices

- Our Python code is formatted with
  [Ruff](https://docs.astral.sh/ruff/). The [linter
  tool](../testing/linters.md) enforces this by running Ruff in check
  mode, or in write mode with
  `tools/lint --only=ruff,ruff-format --fix`. You may find it helpful
  to [integrate Ruff](https://docs.astral.sh/ruff/integrations/) with
  your editor.
- Don't put a shebang line on a Python file unless it's meaningful to
  run it as a script. (Some libraries can also be run as scripts, e.g.,
  to run a test suite.)
- Scripts should be executed directly (`./script.py`), so that the
  interpreter is implicitly found from the shebang line, rather than
  explicitly overridden (`python script.py`).
- Put all imports together at the top of the file, absent a compelling
  reason to do otherwise.
- Unpacking sequences doesn't require list brackets:
  ```python
  [x, y] = xs    # unnecessary
  x, y = xs      # better
  ```
- For string formatting, use `x % (y,)` rather than `x % y`, to avoid
  ambiguity if `y` happens to be a tuple.

## JavaScript and TypeScript conventions and practices

Our JavaScript and TypeScript code is formatted with
[Prettier](https://prettier.io/). You can ask Prettier to reformat
all code via our [linter tool](../testing/linters.md) with
`tools/lint --only=prettier --fix`. You can also [integrate it with your
editor](https://prettier.io/docs/en/editors.html).

### Build DOM elements in Handlebars

The best way to build complicated DOM elements is a Handlebars template
like `web/templates/message_reactions.hbs`. For simpler things you can
use jQuery DOM-building APIs like this:

```js
const $new_tr = $('<tr />').attr('id', object.id);
```

### Attach behaviors to event listeners

Attach callback functions to events using jQuery code. For example:

```js
$("body").on("click", ".move_message_button", function (e) {
  // message-moving UI logic
}
```

That approach has multiple benefits:

- Potential huge performance gains by using delegated events where
  possible
- When calling a function from an `onclick` attribute, `this` is not
  bound to the element like you might think
- jQuery does event normalization

Do not use `onclick` attributes in the HTML.

### Declare variables using `const` and `let`

Always declare JavaScript variables using `const` or `let` rather than
`var`.

### Manipulate objects and arrays with modern methods

For functions that operate on arrays or JavaScript objects, you should
generally use modern
[ECMAScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources)
primitives such as [`for … of`
loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of),
[`Array.prototype.{entries, every, filter, find, indexOf, map, some}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array),
[`Object.{assign, entries, keys, values}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object),
[spread
syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax),
and so on. Our Babel configuration automatically transpiles and
polyfills these using [`core-js`](https://github.com/zloirock/core-js)
when necessary. We used to use the
[Underscore](https://underscorejs.org/) library, but that should be
avoided in new code.

## HTML and CSS

See the documentation on [HTML and CSS](../subsystems/html-css.md)
for guidance on conventions in those language.

## Dangerous constructs in Django

### Avoid excessive database queries

Look out for Django code like this:

```python
bars = Bar.objects.filter(...)
for bar in bars:
    foo = bar.foo
    # Make use of foo
```

...because it equates to:

```python
bars = Bar.objects.filter(...)
for bar in bars:
    foo = Foo.objects.get(id=bar.foo.id)
    # Make use of foo
```

...which makes a database query for every `Bar`. While this may be fast
locally in development, it may be quite slow in production! Instead,
tell Django's [QuerySet
API](https://docs.djangoproject.com/en/5.0/ref/models/querysets/) to
_prefetch_ the data in the initial query:

```python
bars = Bar.objects.filter(...).select_related()
for bar in bars:
    foo = bar.foo  # This doesn't take another query, now!
    # Make use of foo
```

If you can't rewrite it as a single query, that's a sign that something
is wrong with the database schema. So don't defer this optimization when
performing schema changes, or else you may later find that it's
impossible.

### Never do direct database queries (`UserProfile.objects.get()`, `Client.objects.get()`, etc.)

In our Django code, never do direct `UserProfile.objects.get(email=foo)`
database queries. Instead always use `get_user_profile_by_{email,id}`.
There are 3 reasons for this:

1.  It's guaranteed to correctly do a case-inexact lookup
2.  It fetches the user object from remote cache, which is faster
3.  It always fetches a UserProfile object which has been queried
    using `.select_related()` ([see above](#avoid-excessive-database-queries)!),
    and thus will perform well when one later accesses related models
    like the Realm.

Similarly we have `get_client` and `access_stream_by_id` /
`access_stream_by_name` functions to fetch those commonly accessed
objects via remote cache.

### Don't use Django model objects as keys in sets/dicts

Don't use Django model objects as keys in sets/dictionaries -- you will
get unexpected behavior when dealing with objects obtained from
different database queries:

For example, the following will, surprisingly, fail:

```python
# Bad example -- will raise!
obj: UserProfile = get_user_profile_by_id(17)
some_objs = UserProfile.objects.get(id=17)
assert obj in set([some_objs])
```

You should work with the IDs instead:

```python
obj: UserProfile = get_user_profile_by_id(17)
some_objs = UserProfile.objects.get(id=17)
assert obj.id in set([o.id for o in some_objs])
```

### Don't call user_profile.save() without `update_fields`

You should always pass the `update_fields` keyword argument to `.save()`
when modifying an existing Django model object. By default, `.save()` will
overwrite every value in the column, which results in lots of race
conditions where unrelated changes made by one thread can be
accidentally overwritten by another thread that fetched its `UserProfile`
object before the first thread wrote out its change.

### Don't update important model objects with raw saves

In most cases, we already have a function in `zerver.actions` with
a name like `do_activate_user` that will correctly handle lookups,
caching, and notifying running browsers via the event system about your
change. So please check whether such a function exists before writing
new code to modify a model object, since your new code has a good chance
of getting at least one of these things wrong.

### Don't use naive datetime objects

Python allows datetime objects to not have an associated time zone, which can
cause time-related bugs that are hard to catch with a test suite, or bugs
that only show up during daylight saving time.

Good ways to make time-zone-aware datetimes are below. We import time zone
libraries as `from datetime import datetime, timezone` and
`from django.utils.timezone import now as timezone_now`.

Use:

- `timezone_now()` to get a datetime when Django is available, such as
  in `zerver/`.
- `datetime.now(tz=timezone.utc)` when Django is not available, such as
  for bots and scripts.
- `datetime.fromtimestamp(timestamp, tz=timezone.utc)` if creating a
  datetime from a timestamp. This is also available as
  `zerver.lib.timestamp.timestamp_to_datetime`.
- `datetime.strptime(date_string, format).replace(tzinfo=timezone.utc)` if
  creating a datetime from a formatted string that is in UTC.

Idioms that result in time-zone-naive datetimes, and should be avoided, are
`datetime.now()` and `datetime.fromtimestamp(timestamp)` without a `tz`
parameter, `datetime.utcnow()` and `datetime.utcfromtimestamp()`, and
`datetime.strptime(date_string, format)` without replacing the `tzinfo` at
the end.

Additional notes:

- Especially in scripts and puppet configuration where Django is not
  available, using `time.time()` to get timestamps can be cleaner than
  dealing with datetimes.
- All datetimes on the backend should be in UTC, unless there is a good
  reason to do otherwise.

## Dangerous constructs in JavaScript and TypeScript

### Do not use `for...in` statements to traverse arrays

That construct pulls in properties inherited from the prototype chain.
Don't use it:
[[1]](https://stackoverflow.com/questions/500504/javascript-for-in-with-arrays),
[[2]](https://google.github.io/styleguide/javascriptguide.xml#for-in_loop),
[[3]](https://www.jslint.com/help.html#forin)
```

--------------------------------------------------------------------------------

````
