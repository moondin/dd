---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:13Z
part: 276
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 276 of 1290)

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

---[FILE: dependencies.md]---
Location: zulip-main/docs/subsystems/dependencies.md

```text
# Provisioning and third-party dependencies

Zulip is a large project, with well over 100 third-party dependencies,
and managing them well is essential to the quality of the project. In
this document, we discuss the various classes of dependencies that
Zulip has, and how we manage them. Zulip's dependency management has
some really nice properties:

- **Fast provisioning**. When switching to a different commit in the
  Zulip project with the same dependencies, it takes under 5 seconds
  to re-provision a working Zulip development environment after
  switching. If there are new dependencies, one only needs to wait to
  download the new ones, not all the pre-existing dependencies.
- **Consistent provisioning**. Every time a Zulip development or
  production environment is provisioned/installed, it should end up
  using the exactly correct versions of all major dependencies.
- **Low maintenance burden**. To the extent possible, we want to
  avoid manual work and keeping track of things that could be
  automated. This makes it easy to keep running the latest versions
  of our various dependencies.

The purpose of this document is to detail all of Zulip's third-party
dependencies and how we manage their versions.

## Provisioning

We refer to "provisioning" as the process of installing and
configuring the dependencies of a Zulip development environment. It's
done using `tools/provision`, and the output is conveniently logged by
`var/log/provision.log` to help with debugging. Provisioning makes
use of a lot of caching. Some of those caches are not immune to being
corrupted if you mess around with files in your repository a lot. We
have `tools/provision --force` to (still fairly quickly) rerun most
steps that would otherwise have been skipped due to caching.

In the Vagrant development environment, `vagrant provision` will run
the provision script; `vagrant up` will boot the machine, and will
also run an initial provision the first time only.

### PROVISION_VERSION

In `version.py`, we have a special parameter, `PROVISION_VERSION`,
which is used to help ensure developers don't spend time debugging
test/linter/etc. failures that actually were caused by the developer
rebasing and forgetting to provision". `PROVISION_VERSION` has a
format of `(x, y)`; when `x` doesn't match the value from the last time
the user provisioned, or `y` is higher than the value from last
time, most Zulip tools will crash early and ask the user to provision.
This has empirically made a huge impact on how often developers spend
time debugging a "weird failure" after rebasing that had an easy
solution. (Of course, the other key part of achieving this is all the
work that goes into making sure that `provision` reliably leaves the
development environment in a good state.)

`PROVISION_VERSION` must be manually updated when making changes that
require re-running provision, so don't forget about it!

## Philosophy on adding third-party dependencies

In the Zulip project, we take a pragmatic approach to third-party
dependencies. Overall, if a third-party project does something well
that Zulip needs to do (and has an appropriate license), we'd love to
use it rather than reinventing the wheel. If the third-party project
needs some small changes to work, we prefer to make those changes and
contribute them upstream. When the upstream maintainer is slow to
respond, we may use a fork of the dependency until the code is merged
upstream; as a result, we usually have a few packages in
`requirements.txt` that are installed from a GitHub URL.

What we look for in choosing dependencies is whether the project is
well-maintained. Usually one can tell fairly quickly from looking at
a project's issue tracker how well-managed it is: a quick look at how
the issue tracker is managed (or not) and the test suite is usually
enough to decide if a project is going to be a high-maintenance
dependency or not. That said, we do still take on some smaller
dependencies that don't have a well-managed project, if we feel that
using the project will still be a better investment than writing our
own implementation of that project's functionality. We've adopted a
few projects in the past that had a good codebase but whose maintainer
no longer had time for them.

One case where we apply added scrutiny to third-party dependencies is
JS libraries. They are a particularly important concern because we
want to keep the Zulip web app's JS bundle small, so that Zulip
continues to load quickly on systems with low network bandwidth.
We'll look at large JS libraries with much greater scrutiny for
whether their functionality justifies their size than Python
dependencies, since an extra 50KB of code usually doesn't matter in
the backend, but does in JavaScript.

## System packages

For the third-party services like PostgreSQL, Redis, nginx, and RabbitMQ
that are documented in the
[architecture overview](../overview/architecture-overview.md), we rely on the
versions of those packages provided alongside the Linux distribution
on which Zulip is deployed. Because Zulip
[only supports Debian or Ubuntu in production](../production/requirements.md),
this usually means `apt`, though we do support
[other platforms in development](../development/setup-advanced.md). Since
we don't control the versions of these dependencies, we avoid relying
on specific versions of these packages wherever possible.

The exact lists of `apt` packages needed by Zulip are maintained in a
few places:

- For production, in our Puppet configuration, `puppet/zulip/`, using
  the `Package` and `SafePackage` directives.
- For development, in `SYSTEM_DEPENDENCIES` in `tools/lib/provision.py`.
- The packages needed to build a Zulip virtualenv, in
  `VENV_DEPENDENCIES` in `scripts/lib/setup_venv.py`. These are
  separate from the rest because (1) we may need to install a
  virtualenv before running the more complex scripts that, in turn,
  install other dependencies, and (2) because that list is shared
  between development and production.

We also rely on the PGroonga PPA for the PGroonga PostgreSQL
extension, used by our [full-text search](full-text-search.md).

## Python packages

Zulip uses the version of Python itself provided by the host OS for
the Zulip server. We currently support Python 3.10 and newer, with
Ubuntu 22.04 being the platform requiring 3.10 support. The comments
in `.github/workflows/zulip-ci.yml` document the Python versions used
by each supported platform.

We manage third-party Python packages using [uv](https://docs.astral.sh/uv/),
with our requirements listed in
[pyproject.toml](https://docs.astral.sh/uv/concepts/projects/layout/#the-pyprojecttoml),
and locked versions stored in
[`uv.lock`](https://docs.astral.sh/uv/concepts/projects/layout/#the-lockfile).

- **Scripts**. Often, we want a script running in production to use
  the Zulip virtualenv. To make that work without a lot of duplicated
  code, we have a helpful function,
  `scripts.lib.setup_path.setup_path`, which on import will put the
  currently running Python script into the Zulip virtualenv. This is
  called by `./manage.py` to ensure that our Django code always uses
  the correct virtualenv as well.
- **Mypy type checker**. Because we're using mypy in a strict mode,
  when you add use of a new Python dependency, you usually need to
  either adds stubs to the `stubs/` directory for the library, or edit
  `pyproject.toml` in the root of the Zulip project to configure
  `ignore_missing_imports` for the new library. See
  [our mypy docs][mypy-docs] for more details.

[mypy-docs]: ../testing/mypy.md

## JavaScript and other frontend packages

We use the same set of strategies described for Python dependencies
for most of our JavaScript dependencies, so we won't repeat the
reasoning here.

- We use [pnpm][], a `pip`-like tool for JavaScript, to download most
  JavaScript dependencies. pnpm talks to the standard [npm][]
  repository. We use the standard `package.json` file to declare our
  direct dependencies, with sections for development and
  production. pnpm takes care of pinning the versions of indirect
  dependencies in the `pnpm-lock.yaml` file; `pnpm install` updates the
  `pnpm-lock.yaml` file.
- `tools/update-prod-static`. This process is discussed in detail in
  the [static asset pipeline](html-css.md#static-asset-pipeline)
  article, but we don't use the `node_modules` directories directly in
  production. Instead, static assets are compiled using our static
  asset pipeline and it is the compiled assets that are served
  directly to users. As a result, we don't ship the `node_modules`
  directory in a Zulip production release tarball, which is a good
  thing, because doing so would more than double the size of a Zulip
  release tarball.
- **Checked-in packages**. In contrast with Python, we have a few
  JavaScript dependencies that we have copied into the main Zulip
  repository under `web/third`, often with patches. These date
  from an era before `npm` existed. It is a project goal to eliminate
  these checked-in versions of dependencies and instead use versions
  managed by the npm repositories.

## Node.js and pnpm

Node.js is installed by `scripts/lib/install-node` to
`/srv/zulip-node` and symlinked to `/usr/local/bin/node`. A pnpm
symlink at `/usr/local/bin/pnpm` is managed by
[Corepack](https://nodejs.org/api/corepack.html).

We don't do anything special to try to manage multiple versions of
Node.js. (Previous versions of Zulip installed multiple versions of
Node.js using the third-party `nvm` installer, but the current version
no longer uses `nvm`; if it’s present in `/usr/local/nvm` where
previous versions installed it, it will now be removed.)

## ShellCheck and shfmt

In the development environment, the `tools/setup/install-shellcheck`
and `tools/setup/install-shfmt` scripts download binaries for
ShellCheck and shfmt from GitHub, check them against a known hash, and
install them to `/usr/local/bin`. These tools are run as part of the
[linting system](../testing/linters.md).

## Puppet packages

Third-party puppet modules are downloaded from the Puppet Forge into
subdirectories under `/srv/zulip-puppet-cache`, hashed based on their
versions; the latest is always symlinked as
`/srv/zulip-puppet-cache/current`. `zulip-puppet-apply` installs
these dependencies immediately before they are needed.

## Other third-party and generated files

In this section, we discuss the other third-party dependencies,
generated code, and other files whose original primary source is not
the Zulip server repository, and how we provision and otherwise
maintain them.

### Emoji

Zulip uses the [iamcal emoji data package][iamcal] for its emoji data
and sprite sheets. We download this dependency using `npm`, and then
have a tool, `tools/setup/build_emoji`, which reformats the emoji data
into the files under `static/generated/emoji`. Those files are in
turn used by our [Markdown processor](markdown.md) and
`tools/update-prod-static` to make Zulip's emoji work in the various
environments where they need to be displayed.

Since processing emoji is a relatively expensive operation, as part of
optimizing provisioning, we use the same caching strategy for the
compiled emoji data as we use for virtualenvs and `node_modules`
directories, with `scripts/lib/clean_emoji_cache.py` responsible for
garbage-collection. This caching and garbage-collection is required
because a correct emoji implementation involves over 1000 small image
files and a few large ones. There is a more extended article on our
[emoji infrastructure](emoji.md).

### Translations data

Zulip's [translations infrastructure](../translating/translating.md) generates
several files from the source data, which we manage similar to our
emoji, but without the caching (and thus without the
garbage-collection). New translations data is downloaded from
Transifex and then compiled to generate both the production locale
files and also language data in `locale/language*.json` using
`manage.py compilemessages`, which extends the default Django
implementation of that tool.

### Pygments data

The list of languages supported by our Markdown syntax highlighting
comes from the [pygments][] package. `tools/setup/build_pygments_data` is
responsible for generating `web/generated/pygments_data.json` so that
our JavaScript Markdown processor has access to the supported list.

## Modifying provisioning

When making changes to Zulip's provisioning process or dependencies,
usually one needs to think about making changes in 3 places:

- `tools/lib/provision.py`. This is the main provisioning script,
  used by most developers to maintain their development environment.
- `docs/development/dev-setup-non-vagrant.md`. This is our "manual installation"
  documentation. Strategically, we'd like to move the support for more
  versions of Linux from here into `tools/lib/provision.py`.
- Production. Our tools for compiling/generating static assets need
  to be called from `tools/update-prod-static`, which is called by
  `tools/build-release-tarball` (for doing Zulip releases) as well as
  `tools/upgrade-zulip-from-git` (for deploying a Zulip server off of
  `main`).

[virtualenv]: https://virtualenv.pypa.io/en/stable/
[virtualenv-clone]: https://github.com/edwardgeorge/virtualenv-clone/
[pnpm]: https://pnpm.io/
[npm]: https://npmjs.com/
[iamcal]: https://github.com/iamcal/emoji-data
[pygments]: https://pygments.org/
```

--------------------------------------------------------------------------------

---[FILE: django-upgrades.md]---
Location: zulip-main/docs/subsystems/django-upgrades.md

```text
# Upgrading Django

This article documents notes on the process for upgrading Zulip to
new major versions of Django. Here are the steps:

- Carefully read the Django upstream changelog, and `git grep` to
  check if we're using anything deprecated or significantly modified
  and put them in an issue (and then starting working through them).
  Also, note any new features we might want to use after the upgrade,
  and open an issue listing them;
  [example](https://github.com/zulip/zulip/issues/2564).
- Start submitting PRs to do any deprecation-type migrations that work
  on both the old and new version of Django. The goal here is to have
  the actual cutover commit be as small as possible, and to test as
  much of the changes for the migration as we can independently from
  the big cutover.
- Check the version support of the third-party Django packages we use
  (`git grep django pyproject.toml` to see a list), upgrade any as
  needed and file bugs upstream for any that lack support. Look into
  fixing said bugs.
- Look at the pieces of Django code that we've copied and then
  adapted, and confirm whether Django has any updates to the modified
  code we should apply. Partial list:
  - `CursorDebugWrapper`, which we have a modified version of in
    `zerver/lib/db.py`. See
    [the issue for contributing this upstream](https://github.com/zulip/zulip/issues/974)
  - `PasswordResetForm` and any other forms we import from
    `django.contrib.auth.forms` in `zerver/forms.py` (which has all of
    our Django forms).
  - Our AsyncDjangoHandler class has some code copied from the core
    Django handlers code; look at whether that code was changed in
    Django upstream.
  - Our `FilteredManagementUtility` in `manage.py`, which forks the
    management command discovery code.
  - `zerver/management/commands/change_password.py` is forked from the
    upstream `changepassword.py`.
```

--------------------------------------------------------------------------------

---[FILE: email.md]---
Location: zulip-main/docs/subsystems/email.md

```text
# Email

This page has developer documentation on the Zulip email system. If you're
trying to configure your server to send email, you might be looking for our
guide to [sending outgoing email](../production/email.md). If you're trying to
configure an email integration to receive incoming email (e.g., so that users
can reply to message notification emails via email), you might be interested in
our instructions for
[setting up an email integration](https://zulip.com/integrations/email).

On to the documentation. Zulip's email system is fairly straightforward,
with only a few things you need to know to get started.

- All email templates are in `templates/zerver/emails/`. Each email has three
  template files: `<template_prefix>.subject.txt`, `<template_prefix>.txt`, and
  `<template_prefix>.html`. Email templates, along with all other templates
  in the `templates/` directory, are Jinja2 templates.
- Most of the CSS and HTML layout for emails is in `email_base_default.html`. Note
  that email has to ship with all of its CSS and HTML, so nothing in
  `static/` is useful for an email. If you're adding new CSS or HTML for an
  email, there's a decent chance it should go in `email_base_default.html`.
- All email is eventually sent by `zerver.lib.send_email.send_email`. There
  are several other functions in `zerver.lib.send_email`, but all of them
  eventually call the `send_email` function. The most interesting one is
  `send_future_email`. The `ScheduledEmail` entries are eventually processed
  by a supervisor job that runs `zerver/management/commands/deliver_scheduled_emails.py`.
- Always use `user_profile.delivery_email`, not `user_profile.email`,
  when passing data into the `send_email` library. The
  `user_profile.email` field may not always be valid.
- A good way to find a bunch of example email pathways is to `git grep` for
  `zerver/emails` in the `zerver/` directory.

One slightly complicated decision you may have to make when adding an email
is figuring out how to schedule it. There are 3 ways to schedule email.

- Send it immediately, in the current Django process, e.g., by calling
  `send_email` directly. An example of this is the `confirm_registration`
  email.
- Add it to a queue. An example is the `invitation` email.
- Send it (approximately) at a specified time in the future, using
  `send_future_email`. An example is the `onboarding_zulip_topics` email.

Email takes about a quarter second per email to process and send. Generally
speaking, if you're sending just one email, doing it in the current process
is fine. If you're sending emails in a loop, you probably want to send it
from a queue. Documentation on our queueing system is available
[here](queuing.md).

## Development and testing

All the emails sent in the development environment can be accessed by
visiting `/emails` in the browser. The way that this works is that
we've set the email backend (aka what happens when you call the email
`.send()` method in Django) in the development environment to be our
custom backend, `EmailLogBackEnd`. It does the following:

- Logs any sent emails to `var/log/email_content.log`. This log is
  displayed by the `/emails` endpoint
  (e.g., http://zulip.zulipdev.com:9991/emails).
- Print a friendly message on console advertising `/emails` to make
  this nice and discoverable.

### Testing in a real email client

You can also forward all the emails sent in the development
environment to an email account of your choice by clicking on
**Forward emails to an email account** on the `/emails` page. This
feature can be used for testing how the emails gets rendered by
actual email clients. This is important because web email clients
have limited CSS functionality, autolinkify things, and otherwise
mutate the HTML email one can see previewed on `/emails`.

To do this sort of testing, you need to set up an outgoing SMTP
provider. Our production advice for
[Gmail](../production/email.md#using-gmail-for-outgoing-email) and
[transactional email
providers](../production/email.md#free-outgoing-email-services) are
relevant; you can ignore the Gmail warning as Gmail's rate limits are
appropriate for this sort of low-volume testing.

Once you have the login credentials of the SMTP provider, since there
is not `/etc/zulip/settings.py` in development, configure it using the
following keys in `zproject/dev-secrets.conf`

- `email_host` - SMTP hostname.
- `email_port` - SMTP port.
- `email_host_user` - Username of the SMTP user
- `email_password` - Password of the SMTP user.
- `email_use_tls` - Set to `true` for most providers. Else, don't set any value.

Here is an example of how `zproject/dev-secrets.conf` might look if
you are using Gmail.

```ini
email_host = smtp.gmail.com
email_port = 587
email_host_user = username@gmail.com
email_use_tls = true

# This is different from your Gmail password if you have 2FA enabled for your Google account.
# See the configuring Gmail to send email section above for more details
email_password = gmail_password
```

### Notes

- Images won't be displayed in a real email client unless you change
  the `images_base_url` used for emails to a public URL such as
  `https://chat.zulip.org/static/images/emails` (image links to
  `localhost:9991` aren't allowed by modern email providers). See
  `zproject/email_backends.py` for more details.

- While running the backend test suite, we use
  `django.core.mail.backends.locmem.EmailBackend` as the email
  backend. The `locmem` backend stores messages in a special attribute
  of the django.core.mail module, "outbox". The outbox attribute is
  created when the first message is sent. It’s a list with an
  EmailMessage instance for each message that would be sent.

## Email templates

Zulip's email templates live under `templates/zerver/emails`. Email
templates are a messy problem, because on the one hand, you want nice,
readable markup and styling, but on the other, email clients have very
limited CSS support and generally require us to inject any CSS we're
using in the emails into the email as inline styles. And then you
also need both plain-text and HTML emails. We solve these problems
using a combination of the
[css-inline](https://github.com/Stranger6667/css-inline) library and having
two copies of each email (plain-text and HTML).

So, for each email, there are two source templates: the `.txt` version
(for plain-text format) as well as a `.html` template. The `.txt` version
is used directly, while `.html` is processed by `css-inline`, which injects
the CSS we use for styling our emails (`templates/zerver/emails/email.css`)
into the templates just before sending an email.

While this model is great for the markup side, it isn't ideal for
[translations](../translating/translating.md). The Django
translation system works with exact strings, and having different new
markup can require translators to re-translate strings, which can
result in problems like needing 2 copies of each string (one for
plain-text, one for HTML). Re-translating these strings is
relatively easy in Transifex, but annoying.

So when writing email templates, we try to translate individual
sentences that are shared between the plain-text and HTML content
rather than larger blocks that might contain markup; this allows
translators to not have to deal with multiple versions of each string
in our emails.

One can test whether you did the translating part right by running
`manage.py makemessages` and then searching
for the strings in `locale/en/LC_MESSAGES/django.po`; if there
are multiple copies or they contain CSS colors, you did it wrong.

A final note for translating emails is that strings that are sent to
user accounts (where we know the user's language) are higher-priority
to translate than things sent to an email address (where we don't).
E.g., for password reset emails, it makes sense for the code path for
people with an actual account can be tagged for translation, while the
code path for the "you don't have an account email" might not be,
since we might not know what language to use in the second case.

Future work in this space could be to actually generate the plain-text
versions of emails from the `.html` markup, so that we don't
need to maintain two copies of each email's text.
```

--------------------------------------------------------------------------------

---[FILE: emoji.md]---
Location: zulip-main/docs/subsystems/emoji.md

```text
# Emoji

Emoji seem like a simple idea, but there's actually a ton of
complexity that goes into an effective emoji implementation. This
document discusses a number of these issues.

Currently, Zulip supports these three display formats for emoji:

- Google
- Twitter
- Plain text

## Emoji codes

The Unicode standard has various ranges of characters set aside for
emoji. So you can put emoji in your terminal using actual Unicode
characters like 😀 and 👍. If you paste those into Zulip, Zulip will
render them as the corresponding emoji image.

However, the Unicode committee did not standardize on a set of
human-readable names for emoji. So, for example, when using the
popular `:` based style for entering emoji from the keyboard, we have
to decide whether to use `:angry:` or `:angry_face:` to represent an
angry face. Different products use different approaches, but for
purposes like emoji pickers or autocomplete, you definitely want to
pick exactly one of these names, since otherwise users will always be
seeing duplicates of a given emoji next to each other.

Picking which emoji name to use is surprisingly complicated! See the
section on [picking emoji names](#picking-emoji-names) below.

### Custom emoji

Zulip supports custom user-uploaded emoji. We manage those by having
the name of the emoji be its "emoji code", and using an emoji_type
field to keep track of it. We are in the progress of migrating Zulip
to refer to these emoji only by ID, which is a requirement for being
able to support deprecating old realm emoji in a sensible way.

## Tooling

We use the [iamcal emoji data package][iamcal] to provide sprite
sheets and individual images for our emoji, as well as a data set of
emoji categories, code points, etc. The sprite sheets are used
by the Zulip web app to display emoji in messages, emoji reactions,
etc. However, we can't use the sprite sheets in some contexts, such
as missed-message and digest emails, that need to have self-contained
assets. For those, we use individual emoji files under
`static/generated/emoji`. The structure of that repository contains
both files named after the Unicode representation of emoji (as actual
image files) as well as symlinks pointing to those emoji.

We need to maintain those both for the names used in the iamcal emoji
data set as well as our old emoji data set (`emoji_map.json`). Zulip
has a tool, `tools/setup/emoji/build_emoji`, that combines the
`emoji.json` file from iamcal with the old `emoji_map.json` data set
to construct the various symlink farms and output files described
below that support our emoji experience.

The `build_emoji` tool generates the set of files under
`static/generated/emoji` (or really, it generates the
`/srv/zulip-emoji-cache/<sha1>/emoji` tree, and
`static/generated/emoji` is a symlink to that tree; we do this in
order to cache old versions to make provisioning and production
deployments super fast in the common case that we haven't changed the
emoji tooling). See [our dependencies document](dependencies.md)
for more details on this strategy.

The emoji tree generated by this process contains several import elements:

- `emoji_codes.json`: A set of mappings used by the Zulip frontend to
  understand what Unicode emoji exist and what their shortnames are,
  used for autocomplete, emoji pickers, etc. This has been
  deduplicated using the logic in
  `tools/setup/emoji/emoji_setup_utils.py` to generally only have
  `:angry:` and not also `:angry_face:`, since having both is ugly and
  pointless for purposes like autocomplete and emoji pickers.
- `images/emoji/unicode/*.png`: A farm of emoji
- `images/emoji/*.png`: A farm of symlinks from emoji names to the
  `images/emoji/unicode/` tree. This is used to serve individual emoji
  images, as well as for the
  [backend Markdown processor](markdown.md) to know which emoji
  names exist and what Unicode emoji / images they map to. In this
  tree, we currently include all of the emoji in `emoji-map.json`;
  this means that if you send `:angry_face:`, it won't autocomplete,
  but will still work (but not in previews).
- Some CSS and PNGs for the emoji spritesheets, used in Zulip for
  emoji pickers where we would otherwise need to download over 1000 of
  individual emoji images (which would cause a browser performance
  problem). We have multiple spritesheets: one for each emoji
  provider that we support (Google, Twitter, EmojiOne, and Apple.).

[iamcal]: https://github.com/iamcal/emoji-data

## Picking emoji names

I think it is fair to say Zulip has by far the best set of emoji names of
any product at the time of the writing of this document. If you find an
emoji name you don't like, or think is missing, please let us know!

The following set of considerations is not comprehensive, but has a few
principles that were applied to the current set of names. We use (strong),
(medium), and (weak) denote how strong a consideration it is.

- Even with over 1000 symbols, emoji feels surprisingly sparse as a language,
  and more often than not, if you search for something, you don't find an
  appropriate emoji for it. So a primary goal for our set of names is to
  maximize the number of situations in which the user finds an emoji that
  feels appropriate. (strong)

- Conversely, we remove generic words that will gum up the typeahead. So
  `:outbox:` instead of `:outbox_tray:`. Each word should count. (medium)

- We aim for the set of names to be as widely culturally applicable as
  possible, even if the glyphs are not. So `:statue:` instead of
  `:new_york:` for the statue of liberty, and `:tower:` instead of
  `:tokyo_tower:`. (strong)

- We remove unnecessary gender descriptions. So `:ok_signal:` instead of
  `:ok_woman:`. (strong)

- We don't add names that could be inappropriate in school or work
  environments, even if the use is common on the internet. For example, we
  have not added `:butt:` for `:peach:`, or `:cheers:` for
  `:beers:`. (strong)

- Names should be compatible with the four emoji sets we support, but don't
  have to be compatible with any other emoji set. (medium)

- We try not to use a creative canonical_name for emoji that are likely to
  be familiar to a large subset of users. This largely applies to certain
  faces. (medium)

- The set of names should be compatible with the iamcal, gemoji, and Unicode
  names. Compatible here means that if there is an emoji name a user knows
  from one of those sets, and the user searches for the key word of that
  name, they will get an emoji in our set. It is okay if this emoji has a
  slightly different name or codepoint from the names/codepoints in the
  other sets. (weak)

Much of the work of picking names went into the first bullet above: making
the emoji language less sparse. Some tricks and heuristics that were used
for that:

- There are many near duplicates, like `:dog:` and `:dog_face:`, or
  `:mailbox:`, `:mailbox_with_mail:`, and `:mailbox_with_no_mail:`. In these
  cases we repurpose the duplicates to be as useful as we can, like `:dog:`
  and `:puppy:`, and `:mailbox:`, `:unread_mail:`, `:inbox_zero:` for the
  ones above. There isn't a ton of flexibility, since we can't change the
  glyphs. But in most cases we have been able to come up with something.

- Many emoji have commonly understood meanings among people that use emoji a
  lot, and there are websites and articles that document some of these
  meanings. A commonly understood meaning can be a great thing to add as an
  alternate name, since often it is a sign that the meaning is addressing a
  real gap in the emoji system.

- Many emoji names are unnecessarily specific in iamcal/etc, like
  `:flower_playing_cards:`, `:izakaya_lantern:`, or `:amphora:`. Renaming
  them to `:playing_cards:`, `:lantern:`, and `:vase:` makes them more
  widely usable. In such cases we often keep the specific name as an
  alternate.

- If there are natural things someone might type, like `:happy:`, we try to
  find an emoji to match. This extends to things that someone might not
  think to type, but as soon as someone in the organization discovers it
  could get wide use, like `:working_on_it:`. Good future work would be to
  collect (by survey or tooling) things people type into the emoji picker
  typeahead on chat.zulip.org, and find ways to add those names as
  alternates.

Other notes

- Occasionally there are near duplicates where we don't have ideas for
  useful names for the second one. In that case we sometimes remove the
  emoji rather than have two nearly identical glyphs in the emoji picker and
  typeahead. For instance, we kept `:spiral_notepad:` and dropped
  `:spiral_calendar_pad:`. If the concepts are near duplicates but the sets
  of glyphs look very different, we'll find two names that allow them both
  to stay.

- We removed many of the moons and clocks, to make the typeahead experience
  better when searching for something that catches all the moons or all the
  clocks. We kept all the squares and diamonds and other shapes, even though
  they have the same problem, since they are commonly used to make emoji art
  on Twitter, and could conceivably be used the same way on Zulip.
```

--------------------------------------------------------------------------------

````
