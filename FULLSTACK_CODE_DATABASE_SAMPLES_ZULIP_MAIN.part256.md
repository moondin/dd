---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 256
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 256 of 1290)

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

---[FILE: openapi.md]---
Location: zulip-main/docs/documentation/openapi.md

```text
# OpenAPI configuration

[OpenAPI][openapi-spec] is a popular format for describing an API. An
OpenAPI file can be used by various tools to generate documentation
for the API or even basic client-side bindings for dozens of
programming languages.

Zulip's API is described in `zerver/openapi/zulip.yaml`. Our aim is
for that file to fully describe every endpoint in the Zulip API, and
for the Zulip test suite to fail should the API every change without a
corresponding adjustment to the documentation. In particular,
essentially all content in Zulip's [REST API
documentation](api.md) is generated from our OpenAPI
file.

In an OpenAPI Swagger file, every configuration section is an object.
Objects may contain other objects, or reference objects defined
elsewhere. Larger API specifications may be split into multiple
files. See the [OpenAPI specification][openapi-spec].

[openapi-spec]: https://swagger.io/docs/specification/about/

This library isn't in production use yet, but it is our current plan
for how Zulip's API documentation will work.

## Working with the `zulip.yaml` file

An OpenAPI specification file has three general parts: information and
configuration, endpoint definitions, and object schemas referenced by
other objects (as an alternative to defining everything inline.)
References can either specify an individual object, using `$ref:`, or
compose a larger definition from individual objects with `allOf:`
(which may itself contain a `$ref`.)

### Configuration

These objects, at the top of `zulip.yaml`, identify the API, define
the backend host for the working examples, list supported schemes and
types of authentication, and configure other settings. Once defined,
information in this section rarely changes.

For example, the `swagger` and `info` objects look like this:

```yaml
# Basic Swagger UI info
openapi: 3.0.1
info:
  version: 1.0.0
  title: Zulip REST API
  description: Powerful open source group chat.
  contact:
    url: https://zulip.com
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
```

### Endpoint definitions

The [Paths Object](https://swagger.io/specification/#pathsObject)
contains
[Path Item Objects](https://swagger.io/specification/#pathItemObject)
for each endpoint. It describes in detail the methods and parameters
the endpoint accepts and responses it returns.

There is one Path Item Object for each supported method, containing a
[Parameters Definition Object](https://swagger.io/specification/#parametersDefinitionObject)
describing the required and optional inputs. A
[Response Object](https://swagger.io/specification/#responseObject)
similarly specifies the content of the response. They may reference
schemas from a global Definitions Object (see [Schemas](#schemas),
below.)

Example:

The `/users/{user}/presence` endpoint (defined in a
[Path Item Object](https://swagger.io/specification/#pathItemObject))
expects a GET request with one
[parameter](https://swagger.io/specification/#parameterObject), HTTP
Basic authentication, and returns a JSON response containing `msg`,
`result`, and `presence` values.

```yaml
/users/{user}/presence:
  get:
    description: Get presence data for another user.
    operationId: getPresence
    parameters:
    - name: user
      in: path
      description: Enter email address
      required: true
      type: string
    security:
    - basicAuth: []
    responses:
      '200':
        description: The response from a successful call
        schema:
          type: object
          required:
          - msg
          - result
          - presence
          properties:
            msg:
              type: string
            result:
              type: string
            presence:
              type: array
```

### Schemas

The
[Definitions Object](https://swagger.io/specification/#definitionsObject)
contains schemas referenced by other objects. For example,
`MessageResponse`, the response from the `/messages` endpoint,
contains three required parameters. Two are strings, and one is an
integer.

```yaml
MessageResponse:
  type: object
  required:
    - msg
    - result
    - id
  properties:
    msg:
      type: string
    result:
      type: string
    id:
      type: integer
      format: int64
```

You can find more examples, including GET requests and nested objects, in
`zerver/openapi/zulip.yaml`.

## Zulip Swagger YAML style:

We're collecting decisions we've made on how our Swagger YAML files
should be organized here:

- Use shared definitions and YAML anchors to avoid duplicating content
  where possible.

## Tips for working with YAML:

You can edit YAML files in any text editor. Indentation defines
blocks, so whitespace is important (as it is in Python.) TAB
characters are not permitted. If your editor has an option to replace
tabs with spaces, this is helpful.

You can also use the
[Swagger Editor](https://swagger.io/swagger-editor), which validates
YAML and understands the Swagger specification. Download and run it
locally, or use the online version. If you aren't using a YAML-aware
editor, make small changes and check your additions often.

Note: if you are working with
[Swagger UI](https://swagger.io/swagger-ui/) in a local development
environment, it uses an online validator that must be able to access
your file. You may see a red "ERROR" button at the bottom of your API
docs page instead of the green "VALID" one even if your file is
correct.

### Formatting help:

- Comments begin with a # character.

- Descriptions do not need to be in quotes, and may use common
  Markdown format options like inline code \` (backtick) and `#`
  headings.

- A single `|` (pipe) character begins a multi-line description on the
  next line. Single spaced lines (one newline at the end of each) are
  joined. Use an extra blank line for a paragraph break. We prefer
  to use this format for all descriptions because it doesn't require
  extra effort to expand.

### Examples:

```yaml
Description: |
             This description has multiple lines.
             Sometimes descriptions can go on for
             several sentences.

             A description might have multiple paragraphs
             as well.
```
```

--------------------------------------------------------------------------------

---[FILE: overview.md]---
Location: zulip-main/docs/documentation/overview.md

```text
# Documentation systems

Zulip has three major documentation systems:

- **Developer and sysadmin documentation**: Documentation for people
  actually interacting with the Zulip codebase (either by developing
  it or installing it), and written in Markdown.

- **Core website documentation**: Complete webpages for complex topics,
  written in HTML, JavaScript, and CSS (using the Django templating
  system). These roughly correspond to the documentation someone
  might look at when deciding whether to use Zulip. We don't expect
  to ever have more than about 10 pages written using this system.

- **User-facing documentation**: Zulip uses a scalable system for
  documenting Zulip's integrations and REST API, without a lot of
  overhead or duplicated code/syntax, written in Markdown. Zulip's
  help center uses [@astro/starlight](https://starlight.astro.build/),
  with most of the content written in MDX.
  - [Help center documentation](#help-center-documentation)
    (with a target audience of individual Zulip users)
  - [Integrations documentation](#integrations-documentation)
    (with a target audience of IT folks setting up integrations)
  - [API documentation](#api-documentation) (with a target audience
    of developers writing code to extend Zulip)

These three systems are documented in detail.

## Developer and sysadmin documentation

What you are reading right now is part of the collection of
documentation targeted at developers and people running their own
Zulip servers. These docs are written in
[CommonMark Markdown](https://commonmark.org/).
We've chosen Markdown because it is
[easy to write](https://commonmark.org/help/). The source for Zulip's
developer documentation is at `docs/` in the Zulip Git repository, and
they are served in production at
[zulip.readthedocs.io](https://zulip.readthedocs.io/en/latest/).

This documentation is hosted by the excellent [ReadTheDocs
service](https://readthedocs.org/). ReadTheDocs automatically [builds
a preview](https://docs.readthedocs.io/en/stable/pull-requests.html)
for every pull request, accessible from a "Details" link in the
"Checks" section of the pull request page. It's nonetheless valuable
to submit a screenshot with any pull request modifying documentation
to help make reviews efficient.

If you want to build the developer documentation locally (e.g., to test
your changes), the dependencies are automatically installed as part of
Zulip development environment provisioning, and you can build the
documentation using:

```bash
./tools/build-docs
```

and then opening `http://127.0.0.1:9991/docs/index.html` in your
browser. The raw files are available at
`file:///path/to/zulip/docs/_build/html/index.html` in your browser
(so you can also use, for example, `firefox docs/_build/html/index.html`
from the root of your Zulip checkout).

If you are adding a new page to the table of contents, you will want
to modify `docs/index.md` and run `make clean` before `make html`, so
that other docs besides your new one also get the new entry in the
table of contents.

You can also usually test your changes by pushing a branch to GitHub
and looking at the content on the GitHub web UI, since GitHub renders
Markdown, though that won't be as faithful as the `make html`
approach or the preview build.

We manage Python requirements for the documentation build in the `docs` uv
[group](https://docs.astral.sh/uv/concepts/projects/dependencies/#dependency-groups),
which is used by our ReadTheDocs build configuration in
[`.readthedocs.yaml`](https://docs.readthedocs.com/platform/stable/config-file/v2.html).

## Core website documentation

Zulip has around 10 HTML documentation pages under `templates/zerver`
for specific major topics, like the features list, client apps,
integrations, hotkeys, API bindings, etc. These documents often have
somewhat complex HTML and JavaScript, without a great deal of common
patterns between them other than inheriting from the `portico.html`
template. We generally avoid adding new pages to this collection
unless there's a good reason, but we don't intend to migrate them,
either, since this system gives us the flexibility to express these
important elements of the product clearly.

## User-facing documentation

Zulip's API and integrations documentation use a common Markdown-based
framework with various extensions for macros and variable interpolation,
(`render_markdown_path` in the code), designed to make it convenient
to do the things one does a lot in each type of documentation.

Zulip's help center is built with [@astro/starlight](https://starlight.astro.build/).
Starlight is a full-featured documentation theme built on top of the
[Astro](https://astro.build/) framework. Astro is a web framework designed
for content driven websites.

### Help center documentation

Zulip's [help center](https://zulip.com/help/) documentation is
designed to explain how the product works to end users. We aim for
this to be clear, concise, correct, and readable to nontechnical
audiences where possible.

See our guide on [writing help center articles](helpcenter.md).

### Integrations documentation

Zulip's [integrations documentation](https://zulip.com/integrations/)
is user-facing documentation explaining to end users how to set up each
of Zulip's more than 100 integrations. There is a detailed [guide on
documenting integrations](integrations.md), including style guidelines
to ensure that the documentation is high quality and consistent.

See also our broader [integrations developer
guide](https://zulip.com/api/integrations-overview).

### API documentation

Zulip's [API documentation](https://zulip.com/api/) is intended to make
it easy for a technical user to write automation tools that interact
with Zulip. This documentation also serves as our main mechanism for
Zulip server developers to communicate with client developers about
how the Zulip API works.

See the [API documentation tutorial](api.md) for
details on how to contribute to this documentation.

## Automated testing

Zulip has several automated test suites that we run in CI and
recommend running locally when making significant edits:

- `tools/lint` catches a number of common mistakes, and we highly
  recommend
  [using our linter pre-commit hook](../git/zulip-tools.md#set-up-git-repo-script).
  See the [main linter doc](../testing/linters.md) for more details.

- The ReadTheDocs docs are built and the links tested by
  `tools/test-documentation`, which runs `build-docs` and then checks
  all the links.

There's an exclude list for the link testing at this horrible path:
`tools/documentation_crawler/documentation_crawler/spiders/common/spiders.py`,
which is relevant for flaky links.

- The API docs are tested by `tools/test-api`, which does some basic
  payload verification. Note that this test does not check for broken
  links (those are checked by `test-help-documentation`).

- `tools/test-help-documentation` checks `/help/`, `/api/`,
  `/integrations/`, and the core website ("portico") documentation for
  broken links. Note that the "portico" documentation check has a
  manually maintained whitelist of pages, so if you add a new page to
  this site, you will need to edit `PorticoDocumentationSpider` to add it.

- `tools/test-backend test_docs.py` tests various internal details of
  the variable substitution logic, as well as rendering. It's
  essential when editing the documentation framework, but not
  something you'll usually need to interact with when editing
  documentation.
```

--------------------------------------------------------------------------------

---[FILE: cheat-sheet.md]---
Location: zulip-main/docs/git/cheat-sheet.md

```text
# Git cheat sheet

See also [fixing commits][fix-commit]

## Common commands

- add
  - `git add foo.py`
- checkout
  - `git checkout -b new-branch-name`
  - `git checkout main`
  - `git checkout old-branch-name`
- commit
  - `git commit -m "topic: Commit message title."`
  - `git commit --amend`: Modify the previous commit.
- config
  - `git config --global core.editor nano`
  - `git config --global core.symlinks true`
- diff
  - `git diff`
  - `git diff --cached`
  - `git diff HEAD~2..`
- fetch
  - `git fetch origin`
  - `git fetch upstream`
- grep
  - `git grep update_unread_counts`
- log
  - `git log`
- pull
  - `git pull --rebase`: **Use this**. Zulip uses a [rebase oriented workflow][git-overview].
  - `git pull` (with no options): Will either create a merge commit
    (which you don't want) or do the same thing as `git pull --rebase`,
    depending on [whether you've configured Git properly][git-config-clone]
- push
  - `git push origin +branch-name`
- rebase
  - `git rebase -i HEAD~3`
  - `git rebase -i main`
  - `git rebase upstream/main`
- reflog
  - `git reflog | head -10`
- remote
  - `git remote -v`
- reset
  - `git reset HEAD~2`
- rm
  - `git rm oops.txt`
- show
  - `git show HEAD`
  - `git show HEAD~~~`
  - `git show main`
- status
  - `git status`

## Detailed cheat sheet

- add
  - `git add foo.py`: add `foo.py` to the staging area
  - `git add foo.py bar.py`: add `foo.py` AND `bar.py` to the staging area
  - `git add -u`: Adds all tracked files to the staging area.
- checkout
  - `git checkout -b new-branch-name`: create branch `new-branch-name` and switch to/check out that new branch
  - `git checkout main`: switch to your `main` branch
  - `git checkout old-branch-name`: switch to an existing branch `old-branch-name`
- commit
  - `git commit -m "commit message"`: It is recommended to type a
    multiline commit message, however.
  - `git commit`: Opens your default text editor to write a commit message.
  - `git commit --amend`: changing the last commit message. Read more [here][fix-commit]
- config
  - `git config --global core.editor nano`: set core editor to `nano` (you can set this to `vim` or others)
  - `git config --global core.symlinks true`: allow symbolic links
- diff
  - `git diff`: display the changes you have made to all files
  - `git diff --cached`: display the changes you have made to staged files
  - `git diff HEAD~2..`: display the 2 most recent changes you have made to files
- fetch
  - `git fetch origin`: fetch origin repository
  - `git fetch upstream`: fetch upstream repository
- grep
  - `git grep update_unread_counts web/src`: Search our JS for references to update_unread_counts.
- log
  - `git log`: show commit logs
  - `git log --oneline | head`: To quickly see the latest ten commits on a branch.
- pull
  - `git pull --rebase`: rebase your changes on top of `main`.
  - `git pull` (with no options): Will either create a merge commit
    (which you don't want) or do the same thing as `git pull --rebase`,
    depending on [whether you've configured Git properly][git-config-clone]
- push
  - `git push origin branch-name`: push you commits to the origin repository _only if_ there are no conflicts.
    Use this when collaborating with others to prevent overwriting their work.
  - `git push origin +branch-name`: force push your commits to your origin repository.
- rebase
  - `git rebase -i HEAD~3`: interactive rebasing current branch with first three items on HEAD
  - `git rebase -i main`: interactive rebasing current branch with `main` branch
  - `git rebase upstream/main`: rebasing current branch with `main` branch from upstream repository
- reflog
  - `git reflog | head -10`: manage reference logs for the past 10 commits
- remote
  - `git remote -v`: display your origin and upstream repositories
- reset
  - `git reset HEAD~2`: reset two most recent commits
- rm
  - `git rm oops.txt`: remove `oops.txt`
- show
  - `git show HEAD`: display most recent commit
  - `git show HEAD~~~`: display third most recent commit
  - `git show main`: display most recent commit on `main`
- status
  - `git status`: show the working tree status, unstaged and staged files

[fix-commit]: fixing-commits.md
[git-config-clone]: cloning.md#step-1b-clone-to-your-machine
[git-overview]: overview.md
```

--------------------------------------------------------------------------------

---[FILE: cloning.md]---
Location: zulip-main/docs/git/cloning.md

```text
# Get Zulip code

Zulip uses a **forked-repo** and **[rebase][gitbook-rebase]-oriented
workflow**. This means that all contributors create a fork of the [Zulip
repository][github-zulip] they want to contribute to and then submit pull
requests to the upstream repository to have their contributions reviewed and
accepted. We also recommend you work on feature branches.

## Step 1a: Create your fork

The following steps you'll only need to do the first time you set up a machine
for contributing to a given Zulip project. You'll need to repeat the steps for
any additional Zulip projects ([list][github-zulip]) that you work on.

The first thing you'll want to do to contribute to Zulip is fork ([see
how][github-help-fork]) the appropriate [Zulip repository][github-zulip]. For
the main server app, this is [zulip/zulip][github-zulip-zulip].

## Step 1b: Clone to your machine

Next, clone your fork to your local machine:

```console
$ git clone --config pull.rebase https://github.com/YOUR_USERNAME/zulip.git
Cloning into 'zulip'
remote: Counting objects: 86768, done.
remote: Compressing objects: 100% (15/15), done.
remote: Total 86768 (delta 5), reused 1 (delta 1), pack-reused 86752
Receiving objects: 100% (86768/86768), 112.96 MiB | 523.00 KiB/s, done.
Resolving deltas: 100% (61106/61106), done.
Checking connectivity... done.
```

(The `--config pull.rebase` option configures Git so that `git pull`
will behave like `git pull --rebase` by default. Using
`git pull --rebase` to update your changes to resolve merge conflicts
is expected by essentially all of open source projects, including
Zulip. You can also set that option after cloning using
`git config --add pull.rebase true`, or just be careful to always run
`git pull --rebase`, never `git pull`).

Note: If you receive an error while cloning, you may not have [added your ssh
key to GitHub][github-help-add-ssh-key].

Once the repository is cloned, we recommend running
[setup-git-repo][zulip-rtd-tools-setup] to install Zulip's pre-commit
hook which runs the Zulip linters on the changed files when you
commit.

## Step 1c: Connect your fork to Zulip upstream

Next you'll want to [configure an upstream remote
repository][github-help-conf-remote] for your fork of Zulip. This will allow
you to [sync changes][github-help-sync-fork] from the main project back into
your fork.

First, show the currently configured remote repository:

```console
$ git remote -v
origin  git@github.com:YOUR_USERNAME/zulip.git (fetch)
origin  git@github.com:YOUR_USERNAME/zulip.git (push)
```

Note: If you've cloned the repository using a graphical client, you may already
have the upstream remote repository configured. For example, when you clone
[zulip/zulip][github-zulip-zulip] with the GitHub desktop client it configures
the remote repository `zulip` and you see the following output from
`git remote -v`:

```console
origin  git@github.com:YOUR_USERNAME/zulip.git (fetch)
origin  git@github.com:YOUR_USERNAME/zulip.git (push)
zulip    https://github.com/zulip/zulip.git (fetch)
zulip    https://github.com/zulip/zulip.git (push)
```

If your client hasn't automatically configured a remote for zulip/zulip, you'll
need to with:

```console
$ git remote add -f upstream https://github.com/zulip/zulip.git
```

Finally, confirm that the new remote repository, upstream, has been configured:

```console
$ git remote -v
origin  git@github.com:YOUR_USERNAME/zulip.git (fetch)
origin  git@github.com:YOUR_USERNAME/zulip.git (push)
upstream https://github.com/zulip/zulip.git (fetch)
upstream https://github.com/zulip/zulip.git (push)
```

## Step 2: Set up the Zulip development environment

If you haven't already, now is a good time to install the Zulip development environment
([overview][zulip-rtd-dev-overview]). If you're new to working on Zulip or open
source projects in general, we recommend following our [detailed guide for
first-time contributors][zulip-rtd-dev-first-time].

## Step 3: Configure continuous integration for your fork

This step is optional, but recommended.

The Zulip Server project is configured to use [GitHub Actions][github-actions]
to test and create builds upon each new commit and pull request.
GitHub Actions is the primary CI that runs frontend and backend
tests across a wide range of Ubuntu distributions.

GitHub Actions is free for open source projects and it's easy to
configure for your own fork of Zulip. After doing so, GitHub Actions
will run tests for new refs you push to GitHub and email you the outcome
(you can also view the results in the web interface).

Running CI against your fork can help save both your and the
Zulip maintainers time by making it easy to test a change fully before
submitting a pull request. We generally recommend a workflow where as
you make changes, you use a fast edit-refresh cycle running individual
tests locally until your changes work. But then once you've gotten
the tests you'd expect to be relevant to your changes working, push a
branch to run the full test suite in GitHub Actions before
you create a pull request. While you wait for GitHub Actions jobs
to run, you can start working on your next task. When the tests finish,
you can create a pull request that you already know passes the tests.

GitHub Actions will run all the jobs by default on your forked repository.
You can check the `Actions` tab of your repository to see the builds.

[gitbook-rebase]: https://git-scm.com/book/en/v2/Git-Branching-Rebasing
[github-help-add-ssh-key]: https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
[github-help-conf-remote]: https://help.github.com/en/articles/configuring-a-remote-for-a-fork
[github-help-fork]: https://help.github.com/en/articles/fork-a-repo
[github-help-sync-fork]: https://help.github.com/en/articles/syncing-a-fork
[github-zulip]: https://github.com/zulip/
[github-zulip-zulip]: https://github.com/zulip/zulip/
[github-actions]: https://docs.github.com/en/actions
[zulip-rtd-dev-first-time]: ../development/setup-recommended.md
[zulip-rtd-dev-overview]: ../development/overview.md
[zulip-rtd-tools-setup]: zulip-tools.md#set-up-git-repo-script
```

--------------------------------------------------------------------------------

---[FILE: collaborate.md]---
Location: zulip-main/docs/git/collaborate.md

```text
# Collaborate

## Fetch another contributor's branch

What happens when you would like to collaborate with another contributor and
they have work-in-progress on their own fork of Zulip? No problem! Just add
their fork as a remote and pull their changes.

```console
$ git remote add <username> https://github.com/<username>/zulip.git
$ git fetch <username>
```

Now you can check out their branch just like you would any other. You can name
the branch anything you want, but using both the username and branch name will
help you keep things organized.

```console
$ git checkout -b <username>/<branchname>
```

You can choose to rename the branch if you prefer:

```bash
git checkout -b <custombranchname> <username>/<branchname>
```

## Check out a pull request locally

Just as you can check out any user's branch locally, you can also check out any
pull request locally. GitHub provides a special syntax
([details][github-help-co-pr-locally]) for this since pull requests are
specific to GitHub rather than Git.

First, fetch and create a branch for the pull request, replacing _ID_ and
_BRANCHNAME_ with the ID of the pull request and your desired branch name:

```console
$ git fetch upstream pull/ID/head:BRANCHNAME
```

Now switch to the branch:

```console
$ git checkout BRANCHNAME
```

Now you work on this branch as you would any other.

Note: you can use the scripts provided in the tools/ directory to fetch pull
requests. You can read more about what they do [here][tools-pr].

```bash
tools/fetch-rebase-pull-request <PR-number>
tools/fetch-pull-request <PR-number>
```

[github-help-co-pr-locally]: https://help.github.com/en/articles/checking-out-pull-requests-locally
[tools-pr]: zulip-tools.md#fetch-a-pull-request-and-rebase
```

--------------------------------------------------------------------------------

---[FILE: fixing-commits.md]---
Location: zulip-main/docs/git/fixing-commits.md

```text
# Fixing commits

This is mostly from
[here](https://help.github.com/en/articles/changing-a-commit-message#rewriting-the-most-recent-commit-message).

## Fixing the last commit

### Changing the last commit message

1. `git commit --amend -m "New message"`

### Changing the last commit

1. Make your changes to the files
2. Run `git add <filename>` to add one file or `git add <filename1> <filename2> ...` to add multiple files
3. `git commit --amend`

## Fixing older commits

### Changing commit messages

1. `git rebase -i HEAD~5` (if, for example, you are editing some of the last five commits)
2. For each commit that you want to change the message, change `pick` to `reword`, and save
3. Change the commit messages

### Deleting old commits

1. `git rebase -i HEAD~n` where `n` is the number of commits you are looking at
2. For each commit that you want to delete, change `pick` to `drop`, and save

## Squashing commits

Sometimes, you want to make one commit out of a bunch of commits. To do this,

1. `git rebase -i HEAD~n` where `n` is the number of commits you are interested in
2. Change `pick` to `squash` on the lines containing the commits you want to squash and save

## Reordering commits

1. `git rebase -i HEAD~n` where `n` is the number of commits you are interested in
2. Reorder the lines containing the commits and save

## Pushing commits after tidying them

1. `git push origin +my-feature-branch` (Note the `+` there and substitute your actual branch name.)
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/git/index.md

```text
# Git guide

```{toctree}
---
maxdepth: 3
---

Quick start <overview>
Set up Git <setup>
Zulip-specific tools <zulip-tools>
How Git is different <the-git-difference>
Important Git terms <terminology>
Get Zulip code <cloning>
Working copies <working-copies>
Using Git as you work <using>
Pull requests <pull-requests>
Collaborate <collaborate>
Fixing commits <fixing-commits>
Reviewing changes <reviewing>
Get and stay out of trouble <troubleshooting>
Git cheat sheet <cheat-sheet>
```
```

--------------------------------------------------------------------------------

---[FILE: overview.md]---
Location: zulip-main/docs/git/overview.md

```text
# Quick start: how Zulip uses Git and GitHub

This quick start provides a brief overview of how Zulip uses Git and GitHub.

Those who are familiar with Git and GitHub should be able to start contributing
with these details in mind:

- We use **GitHub for source control and code review.** To contribute, fork
  [zulip/zulip][github-zulip-zulip] (or the appropriate
  [repository][github-zulip], if you are working on something else besides
  Zulip server) to your own account and then create feature/issue branches.
  When you're ready to get feedback, submit a [draft][github-help-draft-pr]
  pull request. _We encourage you to submit draft pull requests early and
  often._

- We use a **[rebase][gitbook-rebase]-oriented workflow.** We do not use merge
  commits. This means you should use `git fetch` followed by `git rebase`
  rather than `git pull` (or you can use `git pull --rebase`). Also, to prevent
  pull requests from becoming out of date with the main line of development,
  you should rebase your feature branch prior to submitting a pull request, and
  as needed thereafter. If you're unfamiliar with how to rebase a pull request,
  [read this excellent guide][edx-howto-rebase-pr].

  We use this strategy in order to avoid the extra commits that appear
  when another branch is merged, that clutter the commit history (it's
  popular with other large projects such as Django). This makes
  Zulip's commit history more readable, but a side effect is that many
  pull requests we merge will be reported by GitHub's UI as _closed_
  instead of _merged_, since GitHub has poor support for
  rebase-oriented workflows.

- We have a **[code style guide][zulip-rtd-code-style]**, a **[commit message
  guide][zulip-rtd-commit-messages]**, and strive for each commit to be _a
  minimal coherent idea_ (see **[commit
  discipline][zulip-rtd-commit-discipline]** for details).

- We provide **many tools to help you submit quality code.** These include
  [linters][zulip-rtd-lint-tools], [tests][zulip-rtd-testing], [continuous
  integration][continuous-integration] and [mypy][zulip-rtd-mypy].

- We use [zulipbot][zulip-rtd-zulipbot-usage] to manage our issues and
  pull requests to create a better GitHub workflow for contributors.

- We provide some handy **[Zulip-specific Git scripts][zulip-rtd-zulip-tools]**
  for developers to easily do tasks like fetching and rebasing a pull
  request, cleaning unimportant branches, etc. These reduce the common
  tasks of testing other contributors' pull requests to single commands.

Finally, install the [Zulip developer environment][zulip-rtd-dev-overview], and then
[configure continuous integration for your fork][zulip-git-guide-fork-ci].

---

The following sections will help you be awesome with Zulip and Git/GitHub in a
rebased-based workflow. Read through it if you're new to Git, to a rebase-based
Git workflow, or if you'd like a Git refresher.

[github-help-draft-pr]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests
[gitbook-rebase]: https://git-scm.com/book/en/v2/Git-Branching-Rebasing
[edx-howto-rebase-pr]: https://web.archive.org/web/20240204225038/https://github.com/openedx/edx-platform/wiki/How-to-Rebase-a-Pull-Request
[github-zulip]: https://github.com/zulip/
[github-zulip-zulip]: https://github.com/zulip/zulip/
[continuous-integration]: ../testing/continuous-integration.md
[zulip-git-guide-fork-ci]: cloning.md#step-3-configure-continuous-integration-for-your-fork
[zulip-rtd-code-style]: ../contributing/code-style.md
[zulip-rtd-commit-discipline]: ../contributing/commit-discipline.md
[zulip-rtd-commit-messages]: ../contributing/commit-discipline.md
[zulip-rtd-dev-overview]: ../development/overview.md
[zulip-rtd-lint-tools]: ../contributing/code-style.md#use-the-linters
[zulip-rtd-mypy]: ../testing/mypy.md
[zulip-rtd-testing]: ../testing/testing.md
[zulip-rtd-zulip-tools]: zulip-tools.md
[zulip-rtd-zulipbot-usage]: ../contributing/zulipbot-usage.md
```

--------------------------------------------------------------------------------

---[FILE: pull-requests.md]---
Location: zulip-main/docs/git/pull-requests.md

```text
# Pull requests

When you're ready for feedback, submit a pull request. Pull requests
are a feature specific to GitHub. They provide a simple, web-based way
to submit your work (often called "patches") to a project. It's called
a _pull request_ because you're asking the project to _pull changes_
from your fork.

If you're unfamiliar with how to create a pull request, you can check
out GitHub's documentation on
[creating a pull request from a fork][github-help-create-pr-fork]. You
might also find GitHub's article
[about pull requests][github-help-about-pr] helpful. That all said,
the tutorial below will walk you through the process.

## Draft pull requests

In the Zulip project, we encourage submitting [draft pull
requests][github-help-draft-pr] early and often. This allows you to
share your code to make it easier to get feedback and help with your
changes, even if you don't think your pull request is ready to be
merged (e.g., it might not work or pass tests). This sets expectations
correctly for any feedback from other developers, and prevents your
work from being merged before you're confident in it.

## Create a pull request

### Step 0: Make sure you're on a feature branch (not `main`)

It is important to [work on a feature
branch](using.md#work-on-a-feature-branch) when creating a pull
request. Your new pull request will be inextricably linked with your
branch while it is open, so you will need to reserve your branch only
for changes related to your issue, and avoid introducing extraneous
changes for other issues or from upstream.

If you are working on a branch named `main`, you need to create and
switch to a feature branch before proceeding.

### Step 1: Update your branch with git rebase

The best way to update your branch is with `git fetch` and `git rebase`. Do not
use `git pull` or `git merge` as this will create merge commits. See [keep your
fork up to date][keep-up-to-date] for details.

Here's an example (you would replace _issue-123_ with the name of your feature branch):

```console
$ git checkout issue-123
Switched to branch 'issue-123'

$ git fetch upstream
remote: Counting objects: 69, done.
remote: Compressing objects: 100% (23/23), done.
remote: Total 69 (delta 49), reused 39 (delta 39), pack-reused 7
Unpacking objects: 100% (69/69), done.
From https://github.com/zulip/zulip
   69fa600..43e21f6  main     -> upstream/main

$ git rebase upstream/main

First, rewinding head to replay your work on top of it...
Applying: troubleshooting tip about provisioning
```

### Step 2: Push your updated branch to your remote fork

Once you've updated your local feature branch, push the changes to GitHub:

```console
$ git push origin issue-123
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (6/6), 658 bytes | 0 bytes/s, done.
Total 6 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 1 local objects.
To git@github.com:christi3k/zulip.git
 + 2d49e2d...bfb2433 issue-123 -> issue-123
```

If your push is rejected with error **failed to push some refs** then you need
to prefix the name of your branch with a `+`:

```console
$ git push origin +issue-123
Counting objects: 6, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (6/6), 658 bytes | 0 bytes/s, done.
Total 6 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 1 local objects.
To git@github.com:christi3k/zulip.git
 + 2d49e2d...bfb2433 issue-123 -> issue-123 (forced update)
```

This is perfectly okay to do on your own feature branches, especially if you're
the only one making changes to the branch. If others are working along with
you, they might run into complications when they retrieve your changes because
anyone who has based their changes off a branch you rebase will have to do a
complicated rebase.

### Step 3: Open the pull request

If you've never created a pull request or need a refresher, take a look at
GitHub's article on [creating a pull request from a
fork][github-help-create-pr-fork]. We'll briefly review the process here.

First, sign in to GitHub on your web browser and navigate to your fork of Zulip.

Next, navigate to the branch you've been working on. Do this by clicking on the
**Branch** button and selecting the relevant branch. Finally, click the **New
pull request** button. Alternatively, if you've recently pushed the relevant
branch to your fork, you will see a **Compare & pull request** button.

A pull request template will open with some information pre-filled in.
Provide (or update) the title for your pull request and write a first comment.

If your pull request makes UI changes, always include one or more still
screenshots to demonstrate your changes. If it seems helpful, add a screen
capture of the new functionality as well. You can find a list of tools you can
use for this [here][screenshots-gifs].

See the documentation for creating [reviewable pull requests][reviewable-prs]
for more guidance and tips when writing pull request comments. If the repository
has a self-review checklist in the pull request template, make sure that all the
relevant points have been addressed before submitting it.

When ready, click the **Create pull request** button to submit the pull request.
Remember to mark your pull request as a [draft][github-help-draft-pr] if it is a
work-in-progress.

Note: **Pull request titles are different from commit messages.** Commit
messages can be edited with `git commit --amend`, `git rebase -i`, etc., while
the title of a pull request can only be edited via GitHub.

## Update a pull request

As you get make progress on your feature or bugfix, your pull request, once
submitted, will be updated each time you [push commits][self-push-commits] to
your remote branch. This means you can keep your pull request open as long as
you need, rather than closing and opening new ones for the same feature or
bugfix.

It's a good idea to keep your pull request mergeable with Zulip upstream by
frequently fetching, rebasing, and pushing changes. See [keep your fork up to
date][keep-up-to-date] for details. You might also find this excellent
article [How to Rebase a Pull Request][edx-howto-rebase-pr] helpful.

And, as you address review comments others have made, we recommend posting a
follow-up comment in which you: a) ask for any clarifications you need, b)
explain to the reviewer how you solved any problems they mentioned, and c) ask
for another review.

[edx-howto-rebase-pr]: https://web.archive.org/web/20240204225038/https://github.com/openedx/edx-platform/wiki/How-to-Rebase-a-Pull-Request
[github-help-about-pr]: https://help.github.com/en/articles/about-pull-requests
[github-help-create-pr-fork]: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork
[github-help-draft-pr]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests#draft-pull-requests
[keep-up-to-date]: using.md#keep-your-fork-up-to-date
[self-push-commits]: using.md#push-your-commits-to-github
[screenshots-gifs]: ../tutorials/screenshot-and-gif-software.md
[reviewable-prs]: ../contributing/reviewable-prs.md
```

--------------------------------------------------------------------------------

````
