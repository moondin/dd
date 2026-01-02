---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 5
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 5 of 1290)

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

---[FILE: pnpm-workspace.yaml]---
Location: zulip-main/pnpm-workspace.yaml

```yaml
packages:
  - starlight_help
```

--------------------------------------------------------------------------------

---[FILE: prettier.config.js]---
Location: zulip-main/prettier.config.js

```javascript
// @ts-check

/** @type {import("prettier").Config} */
export default {
    bracketSpacing: false,
    trailingComma: "all",
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: ["tsconfig.json"],
            options: {
                parser: "json5",
                quoteProps: "preserve",
            },
        },
        {
            files: ["*.md"],
            options: {
                embeddedLanguageFormatting: "off",
            },
        },
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
};
```

--------------------------------------------------------------------------------

---[FILE: pyproject.toml]---
Location: zulip-main/pyproject.toml

```toml
[project]
name = "zulip-server"
version = "0.1.0"
requires-python = ">=3.10"

[dependency-groups]
prod = [
  # Django itself
  "django[argon2]==5.2.*",
  "asgiref",

  # needed for NotRequired, ParamSpec
  "typing-extensions",

  # Needed for rendering backend templates
  "jinja2",

  # Needed for Markdown processing
  "markdown",
  "pygments",
  "jsx-lexer",
  "uri-template",
  "regex",

  # Needed for manage.py
  "ipython<9",  # 9.0.0 requires Python ≥ 3.11

  # Needed for image processing and thumbnailing
  "pyvips",

  # Needed for building complex DB queries
  "sqlalchemy==1.4.*",
  "greenlet",

  # Needed for S3 file uploads and other AWS tools
  "boto3",

  # The runtime-relevant part of boto3-stubs (see mypy.in)
  "mypy-boto3-s3",
  "mypy-boto3-ses",
  "mypy-boto3-sns",
  "mypy-boto3-sqs",

  # Needed for integrations
  "defusedxml",

  # Needed for LDAP support
  "python-ldap",
  "django-auth-ldap",

  # Django extension providing bitfield support
  "django-bitfield",

  # Needed for Android push notifications
  "firebase-admin",

  # Needed for the email mirror
  "html2text",
  "talon-core",

  # Needed for inlining the CSS in emails
  "css-inline",

  # Needed for JWT-based auth
  "pyjwt",

  # Needed to access RabbitMQ
  "pika",

  # Needed to access our database
  "psycopg2",

  # Needed for memcached usage
  "python-binary-memcached",

  # Needed for compression support in memcached via python-binary-memcached
  "django-bmemcached",

  # Needed for zerver/tests/test_timestamp.py
  "python-dateutil",

  # Needed for Redis
  "redis",

  # Tornado used for server->client push system
  "tornado",

  # Fast JSON parser
  "orjson",

  # Needed for iOS push notifications
  "aioapns",

  # To parse po files
  "polib",

  # Needed for cloning virtual environments
  "virtualenv-clone",

  # Needed for link preview
  "beautifulsoup4",
  "pyoembed",
  "python-magic",

  # The Zulip API bindings, from its own repository.
  "zulip",
  "zulip-bots",

  # Used for Hesiod lookups, etc.
  "dnspython",

  # Install Python Social Auth
  "social-auth-app-django",
  "social-auth-core[azuread,saml]",
  "python3-saml",

  # For encrypting a login token to the desktop app
  "cryptography",

  # Needed for messages' rendered content parsing in push notifications.
  "lxml",

  # Needed for 2-factor authentication
  "django-two-factor-auth[call,phonenumberslite,sms]",

  # Needed for processing payments (in corporate)
  "stripe",

  # For checking whether email of the user is from a disposable email provider.
  "disposable-email-domains",

  # Needed for parsing YAML with JSON references from the REST API spec files
  "jsonref",

  # Needed for string matching in AlertWordProcessor
  "pyahocorasick",

  # Needed for function decorators that don't break introspection.
  # Used for rate limiting authentication.
  "decorator",

  # For server-side enforcement of password strength
  "zxcvbn",

  # Needed for sending HTTP requests
  "requests[security]",
  "requests-oauthlib",

  # For OpenAPI schema validation.
  "openapi-core",
  "werkzeug<3.1.2", # https://github.com/python-openapi/openapi-core/issues/938

  # For reporting errors to sentry.io
  "sentry-sdk",

  # For detecting URLs to link
  "tlds",

  # Unicode Collation Algorithm for sorting multilingual strings
  "pyuca",

  # Handle connection retries with exponential backoff
  "backoff",

  # Needed for reading bson files in rocketchat import tool
  "pymongo",

  # Non-backtracking regular expressions
  "google-re2",

  # For querying recursive group membership
  "django-cte",

  # SCIM integration
  "django-scim2",

  # Circuit-breaking for outgoing services
  "circuitbreaker",

  # Runtime monkeypatching of django-stubs generics
  "django-stubs-ext",

  # Structured data representation with parsing.
  "pydantic",
  "annotated-types",

  # For requesting LLM API endpoints.
  "litellm",

  # Used for running the Zulip production Django server
  "uwsgi",

  # Used for monitoring memcached
  "prometheus-client",

  # For captchas on unauth'd pages which can generate emails
  "altcha",

  # SMTP server for accepting incoming email
  "aiosmtpd>=1.4.6",

  # For using Missing sentinel
  "pydantic-partials",

  # For E2EE of push notifications
  "pynacl",

  # Character set detection for text/plain
  "chardet>=5.1.0",

  # Better compression than zlib
  "zstd",

  # Internationalization
  "pyicu",

  # Backport datetime.fromisoformat fixes to Python < 3.11
  "backports-datetime-fromisoformat; python_version < '3.11'",
]
docs = [
  # Needed to build RTD docs
  "sphinx<8.2",  # 8.2.0 requires Python ≥ 3.11
  "sphinx-rtd-theme",
  "sphinx-design",

  # Needed to build Markdown docs
  "myst-parser",
]

# This group is for minimal CI / local release tooling; see tools/closed-by-commits
release-tools = [
   # Talks to GitHub
   "PyGithub",
   # And also to chat.zulip.org
   "requests",
   # For building a CLI
   "typer",
]

dev = [
  { include-group = "prod" },
  { include-group = "docs" },
  { include-group = "release-tools" },

  # moto s3 mock
  "moto[s3]",

  # For tools/run-dev
  "aiohttp",

  # Needed for documentation links test
  "scrapy",

  # Needed to compute test coverage
  "coverage",

  # fake for LDAP testing
  "fakeldap",

  # For testing mock http requests
  "responses",

  # For doing highly usable Python profiling
  "line-profiler",

  # Python reformatter
  "black",

  # Python linter
  "ruff",

  # Needed for watching file changes
  "pyinotify",
  "pyasyncore", # https://github.com/seb-m/pyinotify/issues/204

  # Needed to run tests in parallel
  "tblib",

  # For linting Git commit messages
  "gitlint-core",

  # Needed for visualising cProfile reports
  "snakeviz",

  # Needed for creating DigitalOcean droplets
  "python-digitalocean",

  # zulip's linting framework - zulint
  "zulint",

  # For type checking
  "mypy[faster-cache]",

  "boto3-stubs[s3,ses,sns,sqs]",
  "django-stubs",
  "google-re2-stubs",
  "lxml-stubs",
  "SQLAlchemy[mypy]",
  "types-beautifulsoup4",
  "types-boto",
  "types-decorator",
  "types-defusedxml",
  "types-jsonschema",
  "types-Markdown",
  "types-oauthlib",
  "types-polib",
  "types-pika",
  "types-psycopg2",
  "types-Pygments",
  "types-pyOpenSSL",
  "types-python-dateutil",
  "types-PyYAML",
  "types-redis",
  "types-regex",
  "types-requests",
  "types-requests-oauthlib",
  "types-uwsgi",
  "types-zstd",
  "types-zxcvbn",

  # Needed for tools/check-thirdparty
  "python-debian",

  # Pattern-based lint tool
  "semgrep<1.80.0", # https://github.com/semgrep/semgrep/issues/10408

  # For sorting versions when uploading releases
  "natsort",

  # For spell check linter
  "codespell",

  # For mocking time
  "time-machine",
]

[tool.uv]
no-binary-package = ["lxml", "xmlsec"]

[tool.uv.sources]
# Forked to avoid pulling in scipy: https://github.com/mailgun/talon/pull/200
# and chardet, cchardet: https://github.com/mailgun/talon/pull/239
# and fix invalid escape sequences: https://github.com/mailgun/talon/pull/245
talon-core = { url = "https://github.com/zulip/talon/archive/e87a64dccc3c5ee1b8ea157d4b6e15ecd46f2bed.zip", subdirectory = "talon-core" }

# We integrate with these tightly, including fetching content not included in
# the official PyPI release tarballs, such as logos, assets and documentation
# files that we render on our /integrations/ page. Therefore, we need to pin the
# version from Git rather than a PyPI release. Keeping everything in one
# repository simplifies the process of implementing and documenting new bots for
# new contributors.
zulip = { url = "https://github.com/zulip/python-zulip-api/archive/b7fbf1b4299bf225597e45b567e058387d5feee1.zip", subdirectory = "zulip" }
zulip-bots = { url = "https://github.com/zulip/python-zulip-api/archive/b7fbf1b4299bf225597e45b567e058387d5feee1.zip", subdirectory = "zulip_bots" }

# zulip's linting framework - zulint
zulint = { url = "https://github.com/zulip/zulint/archive/448e36a1e50e79c82257ed3d65fcf5c8591cdb61.zip" }

[tool.black]
line-length = 100
target-version = ["py310"]

[tool.isort]
src_paths = [".", "tools"]
known_third_party = "zulip"
profile = "black"
line_length = 100

[tool.mypy]
# Logistics of what code to check and how to handle the data.
scripts_are_modules = true
show_traceback = true
# See https://zulip.readthedocs.io/en/latest/testing/mypy.html#mypy-stubs-for-third-party-modules
# for notes on how we manage mypy stubs.
mypy_path = "$MYPY_CONFIG_FILE_DIR/stubs"
cache_dir = "$MYPY_CONFIG_FILE_DIR/var/mypy-cache"

# Enable strict mode, with some exceptions.
strict = true
disallow_subclassing_any = false
disallow_untyped_calls = false
disallow_untyped_decorators = false
warn_return_any = false

# Enable optional errors.
enable_error_code = [
    "redundant-self",
    "deprecated",
    "redundant-expr",
    "truthy-bool",
    "truthy-iterable",
    "ignore-without-code",
    "unused-awaitable",
    "explicit-override",
    "exhaustive-match",
]

# Display the codes needed for # type: ignore[code] annotations.
show_error_codes = true

# Warn of unreachable or redundant code.
warn_unreachable = true

# dmypy enables local_partial_types implicitly. We need mypy to align
# with this behavior.
local_partial_types = true

plugins = [
    "mypy_django_plugin.main",
    "pydantic.mypy",
]

[[tool.mypy.overrides]]
module = [
    "ahocorasick.*",
    "backports.datetime_fromisoformat.*",
    "bitfield.*",
    "bmemcached.*",
    "circuitbreaker.*",
    "digitalocean.*",
    "django_auth_ldap.*",
    "django_bmemcached.*",
    "django_cte.*",
    "django_otp.*",
    "django_scim.*",
    "fakeldap.*",
    "firebase_admin.*",
    "gitlint.*",
    "icu.*", # https://gitlab.pyicu.org/main/pyicu/-/issues/156
    "integrations.*",
    "jsonref.*",
    "ldap.*", # https://github.com/python-ldap/python-ldap/issues/368
    "onelogin.*",
    "pyinotify.*",
    "pyoembed.*",
    "pyuca.*",
    "pyvips.*",
    "scim2_filter_parser.attr_paths",
    "talon_core.*",
    "tlds.*",
    "two_factor.*",
]
ignore_missing_imports = true

[tool.django-stubs]
django_settings_module = "zproject.settings"

[tool.pydantic-mypy]
# See https://docs.pydantic.dev/latest/integrations/mypy/#mypy-plugin-capabilities for the effects of these options.
init_forbid_extra = true
init_typed = true
warn_required_dynamic_aliases = true

[tool.ruff]
line-length = 100
src = [".", "tools"]
target-version = "py310"

[tool.ruff.lint]
# See https://github.com/astral-sh/ruff#rules for error code definitions.
select = [
    "ANN", # annotations
    "B", # bugbear
    "C4", # comprehensions
    "COM", # trailing comma
    "DJ", # Django
    "DTZ", # naive datetime
    "E", # style errors
    "EXE", # shebang
    "F", # flakes
    "FLY", # string formatting
    "FURB", # refurbishing
    "G", # logging format
    "I", # import sorting
    "INT", # gettext
    "ISC", # string concatenation
    "LOG", # logging
    "N", # naming
    "PERF", # performance
    "PGH", # pygrep-hooks
    "PIE", # miscellaneous
    "PL", # pylint
    "PYI", # typing stubs
    "Q", # quotes
    "RSE", # raise
    "RUF", # Ruff
    "S", # security
    "SLOT", # __slots__
    "SIM", # simplify
    "T10", # debugger
    "TC", # type-checking
    "TID", # tidy imports
    "UP", # upgrade
    "W", # style warnings
    "YTT", # sys.version
]
ignore = [
    "ANN401", # Dynamically typed expressions (typing.Any) are disallowed
    "B007", # Loop control variable not used within the loop body
    "B904", # Within an except clause, raise exceptions with raise ... from err or raise ... from None to distinguish them from errors in exception handling
    "C408", # Unnecessary `dict` call (rewrite as a literal)
    "COM812", # Trailing comma missing
    "DJ001", # Avoid using `null=True` on string-based fields
    "DJ008", # Model does not define `__str__` method
    "E402", # Module level import not at top of file
    "E501", # Line too long
    "E731", # Do not assign a lambda expression, use a def
    "LOG015", # `error()` call on root logger
    "N802", # Function name should be lowercase
    "N806", # Variable in function should be lowercase
    "PERF203", # `try`-`except` within a loop incurs performance overhead
    "PLC0414", # Import alias does not rename original package
    "PLC0415", # `import` should be at the top-level of a file
    "PLC1901", # `s == ""` can be simplified to `not s` as an empty string is falsey
    "PLR0911", # Too many return statements
    "PLR0912", # Too many branches
    "PLR0913", # Too many arguments to function call
    "PLR0915", # Too many statements
    "PLR2004", # Magic value used in comparison
    "PLR5501", # Consider using `elif` instead of `else` then `if` to remove one indentation level
    "PLW0603", # Using the global statement is discouraged
    "PLW2901", # Outer for loop variable overwritten by inner for loop target
    "RUF001", # String contains ambiguous unicode character
    "RUF002", # Docstring contains ambiguous unicode character
    "RUF003", # Comment contains ambiguous unicode character
    "RUF012", # Mutable class attributes should be annotated with `typing.ClassVar`
    "S101", # Use of `assert` detected
    "S105", # Possible hardcoded password
    "S106", # Possible hardcoded password
    "S107", # Possible hardcoded password
    "S110", # `try`-`except`-`pass` detected, consider logging the exception
    "S113", # Probable use of requests call without timeout
    "S310", # Audit URL open for permitted schemes. Allowing use of `file:` or custom schemes is often unexpected.
    "S311", # Standard pseudo-random generators are not suitable for cryptographic purposes
    "S324", # Probable use of insecure hash functions in `hashlib`
    "S603", # `subprocess` call: check for execution of untrusted input
    "S606", # Starting a process without a shell
    "S607", # Starting a process with a partial executable path
    "SIM103", # Return the condition directly
    "SIM108", # Use ternary operator `action = "[commented]" if action == "created" else f"{action} a [comment]"` instead of if-else-block
    "SIM114", # Combine `if` branches using logical `or` operator
    "SIM401", # Use `d.get(key, default)` instead of an `if` block
    "TC001", # Move application import into a type-checking block
    "TC002", # Move third-party import into a type-checking block
    "TC003", # Move standard library import into a type-checking block
    "TC006", # Add quotes to type expression in `typing.cast()`
]

[tool.ruff.lint.flake8-bandit]
allowed-markup-calls = ["bs4.BeautifulSoup.decode", "lxml.html.tostring"]

[tool.ruff.lint.flake8-gettext]
extend-function-names = ["gettext_lazy"]

[tool.ruff.lint.isort]
known-third-party = ["zulip"]
split-on-trailing-comma = false
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: zulip-main/README.md

```text
# Zulip overview

[Zulip](https://zulip.com) is an open-source team collaboration tool with unique
[topic-based threading][why-zulip] that combines the best of email and chat to
make remote work productive and delightful. Fortune 500 companies, [leading open
source projects][rust-case-study], and thousands of other organizations use
Zulip every day. Zulip is the only [modern team chat app][features] that is
designed for both live and asynchronous conversations.

Zulip is built by a distributed community of developers from all around the
world, with 97+ people who have each contributed 100+ commits. With
over 1,500 contributors merging over 500 commits a month, Zulip is the
largest and fastest growing open source team chat project.

Come find us on the [development community chat](https://zulip.com/development-community/)!

[![GitHub Actions build status](https://github.com/zulip/zulip/actions/workflows/zulip-ci.yml/badge.svg)](https://github.com/zulip/zulip/actions/workflows/zulip-ci.yml?query=branch%3Amain)
[![coverage status](https://img.shields.io/codecov/c/github/zulip/zulip/main.svg)](https://codecov.io/gh/zulip/zulip)
[![Mypy coverage](https://img.shields.io/badge/mypy-100%25-green.svg)][mypy-coverage]
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![GitHub release](https://img.shields.io/github/release/zulip/zulip.svg)](https://github.com/zulip/zulip/releases/latest)
[![docs](https://readthedocs.org/projects/zulip/badge/?version=latest)](https://zulip.readthedocs.io/en/latest/)
[![Zulip chat](https://img.shields.io/badge/zulip-join_chat-brightgreen.svg)](https://chat.zulip.org)
[![Twitter](https://img.shields.io/badge/twitter-@zulip-blue.svg?style=flat)](https://twitter.com/zulip)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/zulip)](https://github.com/sponsors/zulip)

[mypy-coverage]: https://blog.zulip.org/2016/10/13/static-types-in-python-oh-mypy/
[why-zulip]: https://zulip.com/why-zulip/
[rust-case-study]: https://zulip.com/case-studies/rust/
[features]: https://zulip.com/features/

## Getting started

- **Contributing code**. Check out our [guide for new
  contributors](https://zulip.readthedocs.io/en/latest/contributing/contributing.html)
  to get started. We have invested in making Zulip’s code highly
  readable, thoughtfully tested, and easy to modify. Beyond that, we
  have written an extraordinary 185K words of documentation for Zulip
  contributors.

- **Contributing non-code**. [Report an
  issue](https://zulip.readthedocs.io/en/latest/contributing/contributing.html#reporting-issues),
  [translate](https://zulip.readthedocs.io/en/latest/translating/translating.html)
  Zulip into your language, or [give us
  feedback](https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html).
  We'd love to hear from you, whether you've been using Zulip for years, or are just
  trying it out for the first time.

- **Checking Zulip out**. The best way to see Zulip in action is to drop by the
  [Zulip community server](https://zulip.com/development-community/). We also
  recommend reading about Zulip's [unique
  approach](https://zulip.com/why-zulip/) to organizing conversations.

- **Running a Zulip server**. Self-host Zulip directly on Ubuntu or Debian
  Linux, in [Docker](https://github.com/zulip/docker-zulip), or with prebuilt
  images for [Digital Ocean](https://marketplace.digitalocean.com/apps/zulip) and
  [Render](https://render.com/docs/deploy-zulip).
  Learn more about [self-hosting Zulip](https://zulip.com/self-hosting/).

- **Using Zulip without setting up a server**. Learn about [Zulip
  Cloud](https://zulip.com/plans/) hosting options. Zulip sponsors free [Zulip
  Cloud Standard](https://zulip.com/plans/) for hundreds of worthy
  organizations, including [fellow open-source
  projects](https://zulip.com/for/open-source/).

- **Participating in [outreach
  programs](https://zulip.readthedocs.io/en/latest/contributing/contributing.html#outreach-programs)**
  like [Google Summer of Code](https://developers.google.com/open-source/gsoc/)
  and [Outreachy](https://www.outreachy.org/).

- **Supporting Zulip**. Advocate for your organization to use Zulip, become a
  [sponsor](https://github.com/sponsors/zulip), write a review in the mobile app
  stores, or [help others find
  Zulip](https://zulip.readthedocs.io/en/latest/contributing/contributing.html#help-others-find-zulip).

You may also be interested in reading our [blog](https://blog.zulip.org/), and
following us on [Twitter](https://twitter.com/zulip) and
[LinkedIn](https://www.linkedin.com/company/zulip-project/).

Zulip is distributed under the
[Apache 2.0](https://github.com/zulip/zulip/blob/main/LICENSE) license.
```

--------------------------------------------------------------------------------

---[FILE: SECURITY.md]---
Location: zulip-main/SECURITY.md

```text
# Reporting security vulnerabilities

If you believe you’ve identified a security vulnerability in Zulip, please
[contact our security team](#how-to-report-a-possible-security-issue) as soon as
possible! Responsible disclosure helps us keep our user community safe.

Since Zulip is 100% open-source software, security researchers have
full access to [Zulip’s codebase](https://github.com/zulip/). To learn
about Zulip’s security model, check out:

- [Security overview](https://zulip.com/security/)
- [Securing your Zulip server](https://zulip.readthedocs.io/en/latest/production/securing-your-zulip-server.html)
- [Release lifecycle](https://zulip.readthedocs.io/en/latest/overview/release-lifecycle.html)

Join our low-traffic [release announcements mailing
list](https://groups.google.com/g/zulip-announce) to get notified
about new security releases.

## How to report a possible security issue

To allow us to responsibly remediate security issues, please _do not_
report them publicly on GitHub, in the Zulip development community, or
anywhere else. Thank you for helping us protect Zulip’s user
community!

Contact Zulip’s security team at [security@zulip.com](mailto:security@zulip.com)
or via our [HackerOne disclosure program](#hackerone-disclosure-program). Reach
out to [security@zulip.com](mailto:security@zulip.com) for an invitation to the
program.

Please include the following information in your report:

1. The product where you’ve identified a vulnerability, including the versions
   of the software that you tested.
2. A clear series of steps that maintainers can use to reproduce the
   vulnerability, and any investigation you’ve done into the root cause.
3. Any suggestions you have for remediating the issue.
4. How you'd like to be credited in our release announcement when we publish the
   fix, if your report is confirmed.

You are welcome to use automated tools, including AI, to research
vulnerabilities. However, please take the time to **_personally_**
verify the issue, and write the vulnerability description yourself to
avoid errors. Reporting “vulnerabilities” that were hallucinated by AI
wastes the time of open-source maintainers.

## What happens when a security issue is reported

1. When a credible report of a security issue is received, our security team
   will promptly acknowledge the report, and begin investigation. If you have
   not received a response acknowledging receipt of a report within 2 business
   days, please follow up to confirm that your report was not blocked by spam
   filters.
2. If our investigation determines that the report identifies a vulnerability in
   our software, we will create a CVE for the security issue, and begin work on
   remediation.
3. We will publish the fixes to the `main` branch and the release branch for the
   current major release series.
4. The security issue and remediation will be announced on our
   [blog](https://blog.zulip.com/tag/security/), crediting any external
   reporters.

Please do not publicly disclose an issue prior to us notifying you
that a fix has been released, or share exploit code that might be used
against self-hosted instances that have not yet upgraded to the
patched version.

## Useful resources for security researchers

- Follow our
  [guide](https://zulip.readthedocs.io/en/latest/development/overview.html)
  to set up Zulip’s development environment. This will let you test
  Zulip without risk of disrupting Zulip’s users. The development
  environment is designed for developer convenience (you can log in as
  any user with `/devlogin`; see also `/devtools` features), but those
  features use a separate URL namespace, so it's easy to determine if
  you're accidentally using one. Historically, the vast majority of
  security issues found in Zulip could be reproduced in the
  development environment.
- To test against a production instance, follow our
  [guide](https://zulip.readthedocs.io/en/latest/production/install.html) for
  setting up a Zulip production server.
- The Zulip software's [default production puppet
  configuration](https://github.com/zulip/zulip/tree/main/puppet) is a great
  resource when looking for configuration problems. Issues impacting the
  `zulip/` and `kandra/` (Zulip Cloud) configurations are in scope.
- Zulip is a [Django](https://docs.djangoproject.com/) project, and
  `zproject/urls.py` and the files it includes are a reference for the endpoints
  supported by the software, most of which are detailed in the [API
  documentation](https://zulip.com/api/).
- Zulip has [extensive developer
  documentation](https://zulip.readthedocs.io/en/latest/overview/readme.html)
  that describes how the software works under the hood.
- The [help center](https://zulip.com/help/) has extensive documentation on how
  Zulip is expected to work. We appreciate reports of any inconsistencies
  between the documented security model and actual behavior, e.g., regarding
  which users can see a given piece of information or perform a given action.

## HackerOne disclosure program

Zulip operates a private HackerOne disclosure program.

### What’s in scope

Security issues must be reported for the [latest
release](https://zulip.readthedocs.io/en/latest/overview/release-lifecycle.html)
or the `main` branch.

- **Security issues**: Security issues impacting any part of the Zulip
  open-source project, including the [Server](https://github.com/zulip/zulip/),
  [Electron desktop app](https://github.com/zulip/zulip-desktop/), [Flutter
  mobile app](https://github.com/zulip/zulip-flutter), or API bindings for
  various languages. All official projects are in the
  <https://github.com/zulip/> GitHub organization.
- **Security hardening**: We love to recognize significant work on hardening
  Zulip against potential security issues! If you’ve contributed a _merged_
  security hardening pull request, you’re welcome to submit a link to it to the
  HackerOne program to receive recognition.

### What’s out of scope

The following are out of scope for this program:

- Penetration testing against specific production installations of
  Zulip. **Do not test against an installation of Zulip that you do
  not own**. This includes `chat.zulip.org`, `zulipchat.com`, and any
  other existing install you might find. If you see a configuration
  that appears to be risky with Zulip Cloud, please report the issue;
  we will do the testing.

- Vulnerabilities in third-party libraries are in scope only if they
  can be fixed by upgrading the version of the third-party library
  used by Zulip, the library is unmaintained, or you otherwise have a
  reason to believe we can help get the vulnerability fixed sooner.

- Issues that only affect the Zulip development environment must
  explain how they violate the security model _for the development
  environment_.
```

--------------------------------------------------------------------------------

---[FILE: stylelint.config.js]---
Location: zulip-main/stylelint.config.js

```javascript
// @ts-check

/** @type {import("stylelint").Config} */
export default {
    extends: ["stylelint-config-standard"],
    plugins: ["stylelint-high-performance-animation"],
    rules: {
        // Add some exceptions for recommended rules
        "at-rule-no-unknown": [true, {ignoreAtRules: ["extend"]}],
        "font-family-no-missing-generic-family-keyword": [
            true,
            {ignoreFontFamilies: ["FontAwesome"]},
        ],

        // Disable recommended rules we don't comply with yet
        "media-query-no-invalid": null,
        "no-descending-specificity": null,

        // Disable standard rules we don't comply with yet
        "comment-empty-line-before": null,
        "declaration-empty-line-before": null,
        "keyframes-name-pattern": null,
        "selector-class-pattern": null,
        "selector-id-pattern": null,

        // Limit language features
        "color-no-hex": true,
        "color-named": "never",
        "declaration-property-value-disallowed-list": {
            // thin/medium/thick is under-specified, please use pixels
            "/^(border(-top|-right|-bottom|-left)?|outline)(-width)?$/": [
                /\b(thin|medium|thick)\b/,
            ],
            // no quotation marks around grid-area; use
            // `grid-area: my_area`, not `grid-area: "my_area"`
            "grid-area": [/".*"/],
        },
        "function-disallowed-list": [
            // We use hsl instead of rgb
            "rgb",
        ],
        "plugin/no-low-performance-animation-properties": [true, {ignore: "paint-properties"}],

        // Zulip CSS should have no dependencies on external resources
        "function-url-no-scheme-relative": true,
        "function-url-scheme-allowed-list": [
            "data", // Allow data URLs
        ],
    },
};
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: zulip-main/tsconfig.json

```json
{
    "compilerOptions": {
        /* Type Checking */
        "exactOptionalPropertyTypes": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitOverride": true,
        "noImplicitReturns": true,
        "noPropertyAccessFromIndexSignature": true,
        "noUncheckedIndexedAccess": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "strict": true,

        /* Modules */
        "allowImportingTsExtensions": true,
        "module": "preserve",
        "moduleResolution": "bundler",
        "paths": {
            "*": ["./web/src/types/*"],
        },
        "resolveJsonModule": true,
        "types": ["@types/jquery.validation"],

        /* Emit */
        "noEmit": true,

        /* JavaScript support */
        "allowJs": true,

        /* Interop Constraints */
        "erasableSyntaxOnly": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "verbatimModuleSyntax": true,

        /* Language and Environment */
        "target": "ESNext",

        /* Projects */
        "composite": true,
    },
    "exclude": [
        // This is a separate package with its own TypeScript configuration.
        "starlight_help",

        // Skip walking large generated directories.
        ".venv",
        "docs/_build",
        "static/webpack-bundles",
        "var",
    ],
}
```

--------------------------------------------------------------------------------

---[FILE: Vagrantfile]---
Location: zulip-main/Vagrantfile

```text
# -*- mode: ruby -*-

Vagrant.require_version ">= 2.2.6"

Vagrant.configure("2") do |config|
  # The Zulip development environment runs on 9991 on the guest.
  host_port = 9991
  http_proxy = https_proxy = no_proxy = nil
  host_ip_addr = "127.0.0.1"

  # System settings for the virtual machine.
  vm_num_cpus = "2"
  vm_memory = "2048"

  ubuntu_mirror = ""
  vboxadd_version = nil

  config.vm.box = "bento/ubuntu-22.04"

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/srv/zulip", docker_consistency: "z"

  vagrant_config_file = ENV["HOME"] + "/.zulip-vagrant-config"
  if File.file?(vagrant_config_file)
    IO.foreach(vagrant_config_file) do |line|
      line.chomp!
      key, value = line.split(nil, 2)
      case key
      when /^([#;]|$)/ # ignore comments
      when "HTTP_PROXY"; http_proxy = value
      when "HTTPS_PROXY"; https_proxy = value
      when "NO_PROXY"; no_proxy = value
      when "HOST_PORT"; host_port = value.to_i
      when "HOST_IP_ADDR"; host_ip_addr = value
      when "GUEST_CPUS"; vm_num_cpus = value
      when "GUEST_MEMORY_MB"; vm_memory = value
      when "UBUNTU_MIRROR"; ubuntu_mirror = value
      when "VBOXADD_VERSION"; vboxadd_version = value
      end
    end
  end

  if Vagrant.has_plugin?("vagrant-proxyconf")
    if !http_proxy.nil?
      config.proxy.http = http_proxy
    end
    if !https_proxy.nil?
      config.proxy.https = https_proxy
    end
    if !no_proxy.nil?
      config.proxy.no_proxy = no_proxy
    end
  elsif !http_proxy.nil? or !https_proxy.nil?
    # This prints twice due to https://github.com/hashicorp/vagrant/issues/7504
    # We haven't figured out a workaround.
    puts "You have specified value for proxy in ~/.zulip-vagrant-config file but did not " \
         "install the vagrant-proxyconf plugin. To install it, run `vagrant plugin install " \
         "vagrant-proxyconf` in a terminal.  This error will appear twice."
    exit
  end

  config.vm.network "forwarded_port", guest: 9991, host: host_port, host_ip: host_ip_addr
  config.vm.network "forwarded_port", guest: 9994, host: host_port + 3, host_ip: host_ip_addr
  config.vm.network "forwarded_port", guest: 9995, host: host_port + 4, host_ip: host_ip_addr
  # Specify Docker provider before VirtualBox provider so it's preferred.
  config.vm.provider "docker" do |d, override|
    override.vm.box = nil
    d.build_dir = File.join(__dir__, "tools", "setup", "dev-vagrant-docker")
    d.build_args = ["--build-arg", "VAGRANT_UID=#{Process.uid}"]
    if !ubuntu_mirror.empty?
      d.build_args += ["--build-arg", "UBUNTU_MIRROR=#{ubuntu_mirror}"]
    end
    d.has_ssh = true
    d.create_args = ["--ulimit", "nofile=1024:65536"]
  end

  config.vm.provider "virtualbox" do |vb, override|
    # It's possible we can get away with just 1.5GB; more testing needed
    vb.memory = vm_memory
    vb.cpus = vm_num_cpus

    if !vboxadd_version.nil?
      override.vbguest.installer = Class.new(VagrantVbguest::Installers::Ubuntu) do
        define_method(:host_version) do |reload = false|
          VagrantVbguest::Version(vboxadd_version)
        end
      end
      override.vbguest.allow_downgrade = true
      override.vbguest.iso_path = "https://download.virtualbox.org/virtualbox/#{vboxadd_version}/VBoxGuestAdditions_#{vboxadd_version}.iso"
    end
  end

  config.vm.provider "hyperv" do |h, override|
    h.memory = vm_memory
    h.maxmemory = vm_memory
    h.cpus = vm_num_cpus
  end

  config.vm.provider "parallels" do |prl, override|
    prl.memory = vm_memory
    prl.cpus = vm_num_cpus
  end

  config.vm.provision "shell",
    # We want provision to be run with the permissions of the vagrant user.
    privileged: false,
    path: "tools/setup/vagrant-provision",
    env: { "UBUNTU_MIRROR" => ubuntu_mirror }
end
```

--------------------------------------------------------------------------------

---[FILE: version.py]---
Location: zulip-main/version.py

```python
import os

ZULIP_VERSION = "12.0-dev+git"

# Add information on number of commits and commit hash to version, if available
ZULIP_VERSION_WITHOUT_COMMIT = ZULIP_VERSION
zulip_git_version_file = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "zulip-git-version"
)
lines = [ZULIP_VERSION, ""]
if os.path.exists(zulip_git_version_file):
    with open(zulip_git_version_file) as f:
        lines = [*f, "", ""]
ZULIP_VERSION = lines.pop(0).strip()
ZULIP_MERGE_BASE = lines.pop(0).strip()

LATEST_MAJOR_VERSION = "11.0"
LATEST_RELEASE_VERSION = "11.4"
LATEST_RELEASE_ANNOUNCEMENT = "https://blog.zulip.com/zulip-server-11-0"

# Versions of the desktop app below DESKTOP_MINIMUM_VERSION will be
# prevented from connecting to the Zulip server.  Versions above
# DESKTOP_MINIMUM_VERSION but below DESKTOP_WARNING_VERSION will have
# a banner at the top of the page asking the user to upgrade.
DESKTOP_MINIMUM_VERSION = "5.4.3"
DESKTOP_WARNING_VERSION = "5.9.3"

# Bump the API_FEATURE_LEVEL whenever an API change is made
# that clients might want to condition on.  If we forget at
# the time we make the change, then bump it later as soon
# as we notice; clients using API_FEATURE_LEVEL will just not
# use the new feature/API until the bump.
#
# Changes should be accompanied by documentation explaining what the
# new level means in api_docs/changelog.md, as well as "**Changes**"
# entries in the endpoint's documentation in `zulip.yaml`.

API_FEATURE_LEVEL = 442

# Bump the minor PROVISION_VERSION to indicate that folks should provision
# only when going from an old version of the code to a newer version. Bump
# the major version to indicate that folks should provision in both
# directions.

# Typically,
# * adding a dependency only requires a minor version bump;
# * removing a dependency requires a major version bump;
# * upgrading a dependency requires a major version bump, unless the
#   upgraded dependency is backwards compatible with all of our
#   historical commits sharing the same major version, in which case a
#   minor version bump suffices.

PROVISION_VERSION = (361, 1)  # bumped 2025-12-03 to add backports-datetime-fromisoformat
```

--------------------------------------------------------------------------------

````
