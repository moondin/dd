---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 264
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 264 of 1290)

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

---[FILE: directory-structure.md]---
Location: zulip-main/docs/overview/directory-structure.md

```text
# Directory structure

This page documents the directory structure of the [Zulip server and
web app project](https://github.com/zulip/zulip). You may also find
the [new application feature
tutorial](../tutorials/new-feature-tutorial.md) helpful for
understanding the flow through these files.

### Core Python files

Zulip uses the [Django web
framework](https://docs.djangoproject.com/en/5.0/), so a lot of these
paths will be familiar to Django developers.

- `zproject/urls.py` Main
  [Django routes file](https://docs.djangoproject.com/en/5.0/topics/http/urls/).
  Defines which URLs are handled by which view functions or templates.

- `zerver/models/*.py`
  [Django models](https://docs.djangoproject.com/en/5.0/topics/db/models/)
  files. Defines Zulip's database tables.

- `zerver/lib/*.py` Most library code.

- `zerver/actions/*.py` Most code doing writes to user-facing
  database tables lives here. In particular, we have a policy that
  all code calling `send_event_on_commit` to trigger [pushing data to
  clients](../subsystems/events-system.md) must live here.

- `zerver/views/*.py` Most [Django views](https://docs.djangoproject.com/en/5.0/topics/http/views/).

- `zerver/webhooks/` Webhook views and tests for [Zulip's incoming webhook integrations](https://zulip.com/api/incoming-webhooks-overview).

- `zerver/tornado/views.py` Tornado views.

- `zerver/worker/` [Queue workers](../subsystems/queuing.md).

- `zerver/lib/markdown/` [Backend Markdown processor](../subsystems/markdown.md).

- `zproject/backends.py` [Authentication backends](https://docs.djangoproject.com/en/5.0/topics/auth/customizing/).

---

### HTML templates

See [our docs](../subsystems/html-css.md) for details on Zulip's
templating systems.

- `templates/zerver/` For [Jinja2](http://jinja.pocoo.org/) templates
  for the backend (for zerver app; logged-in content is in `templates/zerver/app`).

- `web/templates/` [Handlebars](https://handlebarsjs.com/) templates for the frontend.

---

### JavaScript, TypeScript, and other frontend assets

- `web/src/` Zulip's own JavaScript and TypeScript sources.

- `web/styles/` Zulip's own CSS.

- `web/images/` Images bundled with webpack.

- `static/images/` Images served directly to the web.

- `web/third/` Third-party JavaScript and CSS that has been vendored.

- `node_modules/` Third-party JavaScript installed via pnpm.

- `web/icons/` Icons placed in this directory are compiled
  into an icon font.

---

### Tests

- `zerver/tests/` Backend tests.

- `web/tests/` Node Frontend unit tests.

- `web/e2e-tests/` Puppeteer frontend integration tests.

- `tools/test-*` Developer-facing test runner scripts.

---

### Management commands

These are distinguished from scripts, below, by needing to run a
Django context (i.e. with database access).

- `zerver/management/commands/`
  [Management commands](../subsystems/management-commands.md) one might run at a
  production deployment site (e.g., scripts to change a value or
  deactivate a user properly).

- `zilencer/management/commands/` includes some dev-specific
  commands such as `populate_db`, which are not included in
  the production distribution.

---

### Scripts

- `scripts/` Scripts that production deployments might run manually
  (e.g., `restart-server`).

- `scripts/lib/` Scripts that are needed on production deployments but
  humans should never run directly.

- `scripts/setup/` Scripts that production deployments will only run
  once, during installation.

- `tools/` Scripts used only in a Zulip development environment.
  These are not included in production release tarballs for Zulip, so
  that we can include scripts here one wouldn't want someone to run in
  production accidentally (e.g., things that delete the Zulip database
  without prompting).

- `tools/setup/` Subdirectory of `tools/` for things only used during
  the development environment setup process.

- `tools/ci/` Subdirectory of `tools/` for things only used to
  set up and run our tests in CI. Actual test suites should
  go in `tools/`.

---

### API and bots

- See the [Zulip API repository](https://github.com/zulip/python-zulip-api).
  Zulip's Python API bindings, a number of Zulip integrations and
  bots, and a framework for running and testing Zulip bots, used to be
  developed in the main Zulip server repo but are now in their own repo.

- `templates/zerver/integrations/` (within `templates/zerver/`, above).
  Documentation for these integrations.

---

### Production Puppet configuration

This is used to deploy essentially all configuration in production.

- `puppet/zulip/` For configuration for production deployments.

- `puppet/zulip/manifests/profile/standalone.pp` Main manifest for Zulip standalone deployments.

---

### Additional Django apps

- `confirmation` Email confirmation system.

- `analytics` Analytics for the Zulip server administrator (needs work to
  be useful to normal Zulip sites).

- `corporate` The old Zulip.com website. Not included in production
  distribution.

- `zilencer` Primarily used to hold management commands that aren't
  used in production. Not included in production distribution.

---

### Jinja2 compatibility files

- `zproject/jinja2/__init__.py` Jinja2 environment.

---

### Translation files

- `locale/` Backend (Django) and frontend translation data files.

---

### Documentation

- `docs/` Source for this documentation.

---

You can consult the repository's `.gitattributes` file to see exactly
which components are excluded from production releases (release
tarballs are generated using `tools/build-release-tarball`).
```

--------------------------------------------------------------------------------

---[FILE: index.md]---
Location: zulip-main/docs/overview/index.md

```text
# Overview

```{toctree}
---
maxdepth: 3
---

readme
architecture-overview
directory-structure
release-lifecycle
roadmap
changelog
```
```

--------------------------------------------------------------------------------

---[FILE: readme.md]---
Location: zulip-main/docs/overview/readme.md

```text
../../README.md
```

--------------------------------------------------------------------------------

---[FILE: release-lifecycle.md]---
Location: zulip-main/docs/overview/release-lifecycle.md

```text
# Release lifecycle

This page provides an overview of Zulip server and client app release
lifecycles. As discussed below, we highly recommend running [the latest Zulip
server release](#stable-releases). We work extremely hard to make sure these
releases are stable and have no regressions, and that the [upgrade
process](../production/upgrade.md) Just Works.

New server releases are announced via the low-traffic [zulip-announce email
list](https://groups.google.com/g/zulip-announce). Please subscribe to get
notified about new security releases.

## Server and web app versions

The Zulip server and web app are developed together in the [Zulip
server repository][zulip-server].

### Stable releases

:::{note}

The first digit of the Zulip server release version is its major release series
(e.g., 9.4 is part of the 9.x series).

:::

Organizations self-hosting Zulip primarily use stable releases (e.g., Zulip {{
LATEST_RELEASE_VERSION }}).

- [New major releases][blog-major-releases], like Zulip 9.0, are published twice
  a year, and contain hundreds of features, bug fixes, and improvements to Zulip's
  internals.

- New maintenance releases, like 9.4, are published roughly once a month.
  Maintenance releases are designed to have no risky changes and be easy to
  reverse, to minimize stress for administrators.

When upgrading to a new major release series, we recommend always upgrading to
the latest maintenance release in that series, so that you use the latest
version of the upgrade code.

[blog-major-releases]: https://blog.zulip.com/tag/major-releases/

#### Security releases

When we discover a security issue in Zulip, we publish a security and
bug fix release, transparently documenting the issue using the
industry-standard [CVE advisory process](https://cve.mitre.org/).

When new security releases are published, we simultaneously publish the fixes to
the `main` branch and the release branch for the current major release series.

See also our [security overview][security-overview], and our [guide on securing
your Zulip server][securing-your-zulip-server].

[security-overview]: https://zulip.com/security/
[securing-your-zulip-server]: ../production/securing-your-zulip-server.md

### Git versions

Many Zulip servers run versions from Git that have not been published
in a stable release.

- You can [upgrade to `main`][upgrading-to-main] for the latest changes.
- We maintain Git branches with names like `9.x` containing backported
  commits from `main` that we plan to include in the next maintenance
  release. Self-hosters can [upgrade][upgrade-from-git] to these
  stable release branches to get bug fixes staged for the next stable
  release (which is very useful when you reported a bug whose fix we
  choose to backport). We support these branches as though they were a
  stable release.
- The bleeding-edge server for the [Zulip development community][chat-zulip-org]
  at <https://chat.zulip.org> runs the `chat.zulip.org` branch. It's upgraded
  to `main` several times a week. We also often "test deploy" changes not yet in
  `main` to this branch, to facilitate design feedback.
- [Zulip Cloud](https://zulip.com) runs the `zulip-cloud-current` branch plus
  some cherry-picked changes. This branch is usually delayed by one to two weeks
  from `main` to allow for recent changes to be validated further prior to being
  deployed to customers.
- You can also run [a fork of Zulip][fork-zulip] on top of any of
  these branches.

[upgrade-from-git]: ../production/upgrade.md#upgrading-from-a-git-repository

### What version am I running?

The Zulip web app displays the current server version [in the gear
menu](https://zulip.com/help/view-zulip-version); it's also available [via the
API](https://zulip.com/api/get-server-settings).

### Versioned documentation

To make sure you can access documentation for your server version, [the help
center](https://zulip.com/help/), [API documentation](https://zulip.com/api/),
and [integrations documentation](https://zulip.com/integrations/) are
distributed with the Zulip server itself (e.g.,
`https://zulip.example.com/help/`).

This ReadTheDocs documentation has a widget in the top left corner
that lets you view the documentation for other versions.

## Client apps

Zulip's official client apps support all Zulip server versions
released in the **previous 18 months**.

The official client apps are designed to be compatible with
intermediate Zulip server Git commits between the oldest supported
server release and the current `main` branch.

This allows server administrators to take advantage of the ability to
upgrade to [Git versions](#git-versions) without breaking clients.

[The API changelog](https://zulip.com/api/changelog) details all
changes to the API, to make it easy for third-party client developers
to maintain a similar level of compatibility.

### Mobile app

The Zulip mobile apps release new versions from the development
branch frequently (usually every couple weeks). Except when fixing a
critical bug, releases are first published to our [beta
channels][mobile-beta].

Mobile and desktop client apps update automatically, unless a user disables
automatic updates.

### Desktop app

The Zulip [desktop app](https://zulip.com/apps/) is implemented in
[Electron][electron], the browser-based desktop application framework used by
essentially all modern chat applications. The Zulip UI in these apps is served
from the Zulip server (and thus can vary between tabs when it is connected to
organizations hosted by different servers).

The desktop app automatically updates soon after each new release. New desktop
app releases rarely contain new features, because the desktop app tab inherits
its features from the Zulip server/web app. However, it is important to upgrade
because they often contain important security or OS compatibility fixes from the
upstream Chromium project. Be sure to leave automatic updates enabled, or
otherwise arrange to promptly upgrade after new security releases.

The Zulip server supports blocking access or displaying a warning to
users attempting to access the server with extremely old or known
insecure versions of the Zulip desktop and mobile apps, with an error
message telling the user to upgrade.

### Terminal app

The beta Zulip [terminal app](https://github.com/zulip/zulip-terminal)
is designed to support the same range of server versions targeted by
other client apps.

However, we do not support running old versions of the terminal app
against the latest Zulip server. This means that terminal app users
will sometimes need to upgrade to the latest version after their Zulip
Server is upgraded to a new major release.

## Server and client app compatibility

Zulip is designed to make sure you can always run the [latest server
release](#server-and-web-app-versions) (and we highly recommend that you do
so!). We therefore generally do not backport changes to previous stable
release series, except in rare cases involving a security issue or
critical bug discovered just after publishing a major release.

The Zulip server preserves backwards compatibility in its API to support
versions of the mobile and desktop apps released in the last 12 months. Because
these clients auto-update, the vast majority of active clients will have upgraded
by the time we desupport a version.

As noted [above](#client-apps), Zulip's official client apps support
all Zulip server versions released in the **previous 18 months**.

### Upgrade nag

The Zulip web app will display a banner warning users of a server running a
Zulip release that is more than 18 months old, and is no longer officially
supported by mobile and desktop apps. The nag will appear only to organization
administrators starting a month before the deadline; after that, it will appear
for all users on the server.

You can adjust the deadline for your installation by setting, for
example, `SERVER_UPGRADE_NAG_DEADLINE_DAYS = 30 * 21` in
`/etc/zulip/settings.py`, and [restarting the server](../production/settings.md).

:::{warning}

Servers older than 18 months are likely to be vulnerable to security bugs in
Zulip or its upstream dependencies.

:::

## Operating system support

For platforms we support, like Debian and Ubuntu, Zulip aims to
support all versions of the upstream operating systems that are fully
supported by the vendor. We document how to correctly [upgrade the
operating system][os-upgrade] for a Zulip server, including how to
correctly chain upgrades when the latest Zulip release no longer
supports your OS.

Note that we consider [Ubuntu interim releases][ubuntu-release-cycle],
which only have 8 months of security support, to be betas, not
releases, and do not support them in production.

[ubuntu-release-cycle]: https://ubuntu.com/about/release-cycle

## API bindings

The [Zulip API](https://zulip.com/api/) bindings, and related projects like the
[Python](https://zulip.com/api/configuring-python-bindings) and
[JavaScript](https://github.com/zulip/zulip-js#readme) bindings, are released
independently as needed.

[electron]: https://www.electronjs.org/
[upgrading-to-main]: ../production/modify.md#upgrading-to-main
[os-upgrade]: ../production/upgrade.md#upgrading-the-operating-system
[chat-zulip-org]: https://zulip.com/development-community/
[fork-zulip]: ../production/modify.md
[zulip-server]: https://github.com/zulip/zulip
[mobile-beta]: https://zulip.com/help/mobile-app-install-guide#install-a-beta-release
[label-blocker]: https://github.com/zulip/zulip/issues?q=is%3Aissue+is%3Aopen+label%3A%22priority%3A+blocker%22
[label-high]: https://github.com/zulip/zulip/issues?q=is%3Aissue+is%3Aopen+label%3A%22priority%3A+high%22
[label-help-wanted]: https://github.com/zulip/zulip/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22
```

--------------------------------------------------------------------------------

---[FILE: roadmap.md]---
Location: zulip-main/docs/overview/roadmap.md

```text
# Roadmap

We welcome participation from our user community in influencing the Zulip
roadmap. If a bug or missing feature is causing significant pain for you, we'd
love to hear from you, either in
[chat.zulip.org](https://zulip.com/development-community/) or on the relevant
GitHub issue.

Please an include an explanation of your use case: such details can be extremely
helpful in designing appropriately general solutions, and also helps us identify
cases where an existing solution can solve your problem. See our guide on
[suggesting features and improvements](../contributing/suggesting-features.md)
for more details.

## Server and web app roadmap

The Zulip server project uses GitHub projects and labels to structure
communication about priorities:

- We use a [GitHub project
  board](https://github.com/orgs/zulip/projects/9/views/13) to publicly track
  goals for major releases. The items with the "Done" status will be included in
  the next major release. Otherwise, the project board should be seen a list of
  priorities being _considered_ for the release, not a guarantee that features
  will be included. As the release date approaches, features that will not make
  it into the release are dropped from the project board on an ongoing basis.

- The [high priority][label-high] label tags issues that we consider important.
  It is reviewed in the planning stage of the release cycle to identify
  priorities for the next release.

- The [help wanted][label-help-wanted] label tags issues that are open for
  contributions.

The Zulip community feels strongly that all the little issues are, in
aggregate, just as important as the big things. Many resolved issues
are never explicitly tagged as release goals.

[label-high]: https://github.com/zulip/zulip/issues?q=is%3Aissue+is%3Aopen+label%3A%22priority%3A+high%22
[label-help-wanted]: https://github.com/zulip/zulip/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22

## Mobile app roadmap

We use a [GitHub project
board](https://github.com/orgs/zulip/projects/5/views/4) to publicly track
milestones for Zulip's [next-generation mobile
app](https://blog.zulip.com/2024/12/12/new-flutter-mobile-app-beta/).
```

--------------------------------------------------------------------------------

---[FILE: ai-integrations.md]---
Location: zulip-main/docs/production/ai-integrations.md

```text
# AI integrations

Zulip’s [topics](https://zulip.com/help/introduction-to-topics) organize
conversations within a channel, which is ideal for integrating with AI systems
and collaborating with AI agents. With Zulip's structure, it's easy to prompt an AI
with the appropriate context for what you want to accomplish.

You can connect your AI models of choice with Zulip using the [interactive bots
API](https://zulip.com/api/running-bots), which makes it convenient to have AI
models participate in conversations in whatever ways your organization finds
most effective as the technology evolves.

Future Zulip releases will also contain built-in AI features, such as topic
summarization. A major advantage of self-hosting your team chat system
in the age of AI is that you maintain full control over your internal
communications. It’s up to you how you allow third parties and AI models to
process messages.

Zulip Server 10.x includes a beta topic summarization feature that is available
for testing and experimentation. We appreciate any
[feedback](../contributing/suggesting-features.md)
on your experience, and what configuration options and additional features your
organization would find useful.

## Built-in AI features

### Data privacy

Making sure customer data is protected is [our highest
priority](https://zulip.com/security/). We don’t train LLMs on Zulip Cloud
customer data, and we have [no plans to do
so](https://blog.zulip.com/2024/05/23/self-hosting-keeps-your-private-data-out-of-ai-models/).

We are committed to keeping Zulip 100% open-source, so the source code that
defines how data is processed is available for third parties to review and
audit.

### General configurations

Self-hosted Zulip installations can choose whether to self-host their own AI
models or use a third-party AI model API provider of their choice. Zulip’s AI
integrations use the [LiteLLM](https://www.litellm.ai/) library, which makes it
convenient to configure Zulip to use any popular AI model API provider.

- **Server settings**: You can control costs using `INPUT_COST_PER_GIGATOKEN`,
  `OUTPUT_COST_PER_GIGATOKEN`, and `MAX_PER_USER_MONTHLY_AI_COST` settings,
  which let you set a monthly per-user AI usage budget with whatever pricing is
  appropriate for your selected model.
- **Organization settings**: Administrators can specify who can use each AI
  feature that is enabled by the server. The permission can be assigned to any
  combination of roles, groups, and individual users.
- **Personal settings**: Users who find AI features intrusive or distracting can
  hide them from the UI with a **Hide AI features** personal preference setting.

### Topic summarization beta

:::{note}

Topic summarization is not yet available in Zulip Cloud.

:::

The Zulip server supports generating summaries of topics, with convenient
options for doing so in the web/desktop application’s topic actions menus.

#### How it works

:::{warning}

As with all features powered by LLMs, topic summaries may contain errors and
hallucinations.

:::

The topic summarization feature uses a Zulip-specific prompt with off-the-shelf
third-party large language models.

When a user asks for a summary of a given topic, the Zulip server fetches recent
messages in that conversation that are accessible to the acting user, and sends
them to the AI model to generate a summary.

Emoji reactions, images, and uploaded files are currently not included in what
is sent to the AI model, though some LLMs may have features that might follow
links in content they are asked to summarize. (Note that Zulip’s permissions
model for uploaded files will prevent the LLM from accessing them unless the
files have been posted to a channel with the [public access
option](https://zulip.com/help/public-access-option) enabled.)

#### Enabling topic summarization

:::{important}

If you use a third-party AI platform for topic summarization, you are trusting
the third party with the security and confidentiality of all the messages that
are sent for summarization.

:::

Enable topic summarization by configuring `TOPIC_SUMMARIZATION_MODEL`
and related configuration settings in `/etc/zulip/settings.py`. Topic
summarization and settings for controlling it will appear in the UI
only if your server is configured to enable it.

#### Choosing a model

When modeling the pricing for a given model provider, you’ll primarily want to
look at the cost per input token. Because useful summaries are short compared to
the messages being summarized, more than 90% of tokens used in generating topic
summaries end up being input tokens.

Our experience in early 2025 has been that midsize ~70B parameter models
generate considerably more useful and accurate summaries than smaller ~8B
parameter models.
```

--------------------------------------------------------------------------------

````
