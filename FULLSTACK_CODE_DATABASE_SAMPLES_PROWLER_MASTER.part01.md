---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 1
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 1 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: .backportrc.json]---
Location: prowler-master/.backportrc.json

```json
{
  "repoOwner": "prowler-cloud",
  "repoName": "prowler",
  "targetPRLabels": [
    "backport"
  ],
  "sourcePRLabels": [
    "was-backported"
  ],
  "copySourcePRLabels": false,
  "copySourcePRReviewers": true,
  "prTitle": "{{sourcePullRequest.title}}",
  "commitConflicts": true
}
```

--------------------------------------------------------------------------------

---[FILE: .env]---
Location: prowler-master/.env

```bash
#### Important Note ####
# This file is used to store environment variables for the Prowler App.
# For production, it is recommended to use a secure method to store these variables and change the default secret keys.

#### Prowler UI Configuration ####
PROWLER_UI_VERSION="stable"
AUTH_URL=http://localhost:3000
API_BASE_URL=http://prowler-api:8080/api/v1
NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL}
NEXT_PUBLIC_API_DOCS_URL=http://prowler-api:8080/api/v1/docs
AUTH_TRUST_HOST=true
UI_PORT=3000
# openssl rand -base64 32
AUTH_SECRET="N/c6mnaS5+SWq81+819OrzQZlmx1Vxtp/orjttJSmw8="
# Google Tag Manager ID
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=""

#### MCP Server ####
PROWLER_MCP_VERSION=stable
# For UI and MCP running on docker:
PROWLER_MCP_SERVER_URL=http://mcp-server:8000/mcp
# For UI running on host, MCP in docker:
# PROWLER_MCP_SERVER_URL=http://localhost:8000/mcp

#### Code Review Configuration ####
# Enable Claude Code standards validation on pre-push hook
# Set to 'true' to validate changes against AGENTS.md standards via Claude Code
# Set to 'false' to skip validation
CODE_REVIEW_ENABLED=true

#### Prowler API Configuration ####
PROWLER_API_VERSION="stable"
# PostgreSQL settings
# If running Django and celery on host, use 'localhost', else use 'postgres-db'
POSTGRES_HOST=postgres-db
POSTGRES_PORT=5432
POSTGRES_ADMIN_USER=prowler_admin
POSTGRES_ADMIN_PASSWORD=postgres
POSTGRES_USER=prowler
POSTGRES_PASSWORD=postgres
POSTGRES_DB=prowler_db
# Read replica settings (optional)
# POSTGRES_REPLICA_HOST=postgres-db
# POSTGRES_REPLICA_PORT=5432
# POSTGRES_REPLICA_USER=prowler
# POSTGRES_REPLICA_PASSWORD=postgres
# POSTGRES_REPLICA_DB=prowler_db
# POSTGRES_REPLICA_MAX_ATTEMPTS=3
# POSTGRES_REPLICA_RETRY_BASE_DELAY=0.5

# Celery-Prowler task settings
TASK_RETRY_DELAY_SECONDS=0.1
TASK_RETRY_ATTEMPTS=5

# Valkey settings
# If running Valkey and celery on host, use localhost, else use 'valkey'
VALKEY_HOST=valkey
VALKEY_PORT=6379
VALKEY_DB=0

# API scan settings

# The path to the directory where scan output should be stored
DJANGO_TMP_OUTPUT_DIRECTORY="/tmp/prowler_api_output"

# The maximum number of findings to process in a single batch
DJANGO_FINDINGS_BATCH_SIZE=1000

# The AWS access key to be used when uploading scan output to an S3 bucket
# If left empty, default AWS credentials resolution behavior will be used
DJANGO_OUTPUT_S3_AWS_ACCESS_KEY_ID=""

# The AWS secret key to be used when uploading scan output to an S3 bucket
DJANGO_OUTPUT_S3_AWS_SECRET_ACCESS_KEY=""

# An optional AWS session token
DJANGO_OUTPUT_S3_AWS_SESSION_TOKEN=""

# The AWS region where your S3 bucket is located (e.g., "us-east-1")
DJANGO_OUTPUT_S3_AWS_DEFAULT_REGION=""

# The name of the S3 bucket where scan output should be stored
DJANGO_OUTPUT_S3_AWS_OUTPUT_BUCKET=""

# Django settings
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,prowler-api
DJANGO_BIND_ADDRESS=0.0.0.0
DJANGO_PORT=8080
DJANGO_DEBUG=False
DJANGO_SETTINGS_MODULE=config.django.production
# Select one of [ndjson|human_readable]
DJANGO_LOGGING_FORMATTER=human_readable
# Select one of [DEBUG|INFO|WARNING|ERROR|CRITICAL]
# Applies to both Django and Celery Workers
DJANGO_LOGGING_LEVEL=INFO
# Defaults to the maximum available based on CPU cores if not set.
DJANGO_WORKERS=4
# Token lifetime is in minutes
DJANGO_ACCESS_TOKEN_LIFETIME=30
# Token lifetime is in minutes
DJANGO_REFRESH_TOKEN_LIFETIME=1440
DJANGO_CACHE_MAX_AGE=3600
DJANGO_STALE_WHILE_REVALIDATE=60
DJANGO_MANAGE_DB_PARTITIONS=True
# openssl genrsa -out private.pem 2048
DJANGO_TOKEN_SIGNING_KEY=""
# openssl rsa -in private.pem -pubout -out public.pem
DJANGO_TOKEN_VERIFYING_KEY=""
# openssl rand -base64 32
DJANGO_SECRETS_ENCRYPTION_KEY="oE/ltOhp/n1TdbHjVmzcjDPLcLA41CVI/4Rk+UB5ESc="
DJANGO_BROKER_VISIBILITY_TIMEOUT=86400
DJANGO_SENTRY_DSN=
DJANGO_THROTTLE_TOKEN_OBTAIN=50/minute

# Sentry settings
SENTRY_ENVIRONMENT=local
SENTRY_RELEASE=local
NEXT_PUBLIC_SENTRY_ENVIRONMENT=${SENTRY_ENVIRONMENT}


#### Prowler release version ####
NEXT_PUBLIC_PROWLER_RELEASE_VERSION=v5.12.2

# Social login credentials
SOCIAL_GOOGLE_OAUTH_CALLBACK_URL="${AUTH_URL}/api/auth/callback/google"
SOCIAL_GOOGLE_OAUTH_CLIENT_ID=""
SOCIAL_GOOGLE_OAUTH_CLIENT_SECRET=""

SOCIAL_GITHUB_OAUTH_CALLBACK_URL="${AUTH_URL}/api/auth/callback/github"
SOCIAL_GITHUB_OAUTH_CLIENT_ID=""
SOCIAL_GITHUB_OAUTH_CLIENT_SECRET=""

# Single Sign-On (SSO)
SAML_SSO_CALLBACK_URL="${AUTH_URL}/api/auth/callback/saml"

# Lighthouse tracing
LANGSMITH_TRACING=false
LANGSMITH_ENDPOINT="https://api.smith.langchain.com"
LANGSMITH_API_KEY=""
LANGCHAIN_PROJECT=""

# RSS Feed Configuration
# Multiple feed sources can be configured as a JSON array (must be valid JSON, no trailing commas)
# Each source requires: id, name, type (github_releases|blog|custom), url, and enabled flag
# IMPORTANT: Must be a single line with valid JSON (no newlines, no trailing commas)
# Example with one source:
RSS_FEED_SOURCES='[{"id":"prowler-releases","name":"Prowler Releases","type":"github_releases","url":"https://github.com/prowler-cloud/prowler/releases.atom","enabled":true}]'
# Example with multiple sources (no trailing comma after last item):
# RSS_FEED_SOURCES='[{"id":"prowler-releases","name":"Prowler Releases","type":"github_releases","url":"https://github.com/prowler-cloud/prowler/releases.atom","enabled":true},{"id":"prowler-blog","name":"Prowler Blog","type":"blog","url":"https://prowler.com/blog/rss","enabled":false}]'
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: prowler-master/.gitignore

```text
# Swap
[._]*.s[a-v][a-z]
[._]*.sw[a-p]
[._]s[a-rt-v][a-z]
[._]ss[a-gi-z]
[._]sw[a-p]

# Python code
__pycache__
venv/
build/
/dist/
*.egg-info/
*/__pycache__/*.pyc
.idea/

# Session
Session.vim
Sessionx.vim

# Temporary
.netrwhist
*~
# Auto-generated tag files
tags

# Persistent undo
[._]*.un~

# MacOs DS_Store
*.DS_Store

# Prowler output
/output

# Prowler found secrets
secrets-*/

# JUnit Reports
junit-reports/

# Test and coverage artifacts
*_coverage.xml
pytest_*.xml
.coverage
htmlcov/

# VSCode files and settings
.vscode/
*.code-workspace
.vscode-test/

# VSCode extension settings and workspaces
.history/
.ionide/

# MCP Server Settings (various locations)
**/cline_mcp_settings.json
**/mcp_settings.json
**/mcp-config.json
**/mcpServers.json
.mcp/

# AI Coding Assistants - Cursor
.cursorignore
.cursor/
.cursorrules

# AI Coding Assistants - RooCode
.roo/
.rooignore
.roomodes

# AI Coding Assistants - Cline (formerly Claude Dev)
.cline/
.clineignore
.clinerules

# AI Coding Assistants - Continue
.continue/
continue.json
.continuerc
.continuerc.json

# AI Coding Assistants - GitHub Copilot
.copilot/
.github/copilot/

# AI Coding Assistants - Amazon Q Developer (formerly CodeWhisperer)
.aws/
.codewhisperer/
.amazonq/
.aws-toolkit/

# AI Coding Assistants - Tabnine
.tabnine/
tabnine_config.json

# AI Coding Assistants - Kiro
.kiro/
.kiroignore
kiro.config.json

# AI Coding Assistants - Aider
.aider/
.aider.chat.history.md
.aider.input.history
.aider.tags.cache.v3/

# AI Coding Assistants - Windsurf
.windsurf/
.windsurfignore

# AI Coding Assistants - Replit Agent
.replit
.replitignore

# AI Coding Assistants - Supermaven
.supermaven/

# AI Coding Assistants - Sourcegraph Cody
.cody/

# AI Coding Assistants - General
.ai/
.aiconfig
ai-config.json

# Terraform
.terraform*
*.tfstate
*.tfstate.*

# .env
ui/.env*
api/.env*
mcp_server/.env*

# Coverage
.coverage*
.coverage
coverage*

# Node
node_modules

# Persistent data
_data/

# Claude
CLAUDE.md

# Compliance report
*.pdf
```

--------------------------------------------------------------------------------

---[FILE: .pre-commit-config.yaml]---
Location: prowler-master/.pre-commit-config.yaml
Signals: Docker

```yaml
repos:
  ## GENERAL
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: check-merge-conflict
      - id: check-yaml
        args: ["--unsafe"]
        exclude: prowler/config/llm_config.yaml
      - id: check-json
      - id: end-of-file-fixer
      - id: trailing-whitespace
      - id: no-commit-to-branch
      - id: pretty-format-json
        args: ["--autofix", --no-sort-keys, --no-ensure-ascii]

  ## TOML
  - repo: https://github.com/macisamuele/language-formatters-pre-commit-hooks
    rev: v2.13.0
    hooks:
      - id: pretty-format-toml
        args: [--autofix]
        files: pyproject.toml

  ## BASH
  - repo: https://github.com/koalaman/shellcheck-precommit
    rev: v0.10.0
    hooks:
      - id: shellcheck
        exclude: contrib

  ## PYTHON
  - repo: https://github.com/myint/autoflake
    rev: v2.3.1
    hooks:
      - id: autoflake
        args:
          [
            "--in-place",
            "--remove-all-unused-imports",
            "--remove-unused-variable",
          ]

  - repo: https://github.com/timothycrosley/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ["--profile", "black"]

  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8
        exclude: contrib
        args: ["--ignore=E266,W503,E203,E501,W605"]

  - repo: https://github.com/python-poetry/poetry
    rev: 2.1.1
    hooks:
      - id: poetry-check
        name: API - poetry-check
        args: ["--directory=./api"]
        pass_filenames: false

      - id: poetry-lock
        name: API - poetry-lock
        args: ["--directory=./api"]
        pass_filenames: false

      - id: poetry-check
        name: SDK - poetry-check
        args: ["--directory=./"]
        pass_filenames: false

      - id: poetry-lock
        name: SDK - poetry-lock
        args: ["--directory=./"]
        pass_filenames: false


  - repo: https://github.com/hadolint/hadolint
    rev: v2.13.0-beta
    hooks:
      - id: hadolint
        args: ["--ignore=DL3013"]

  - repo: local
    hooks:
      - id: pylint
        name: pylint
        entry: bash -c 'pylint --disable=W,C,R,E -j 0 -rn -sn prowler/'
        language: system
        files: '.*\.py'

      - id: trufflehog
        name: TruffleHog
        description: Detect secrets in your data.
        entry: bash -c 'trufflehog --no-update git file://. --only-verified --fail'
        # For running trufflehog in docker, use the following entry instead:
        # entry: bash -c 'docker run -v "$(pwd):/workdir" -i --rm trufflesecurity/trufflehog:latest git file:///workdir --only-verified --fail'
        language: system
        stages: ["pre-commit", "pre-push"]

      - id: bandit
        name: bandit
        description: "Bandit is a tool for finding common security issues in Python code"
        entry: bash -c 'bandit -q -lll -x '*_test.py,./contrib/,./.venv/' -r .'
        language: system
        files: '.*\.py'

      - id: safety
        name: safety
        description: "Safety is a tool that checks your installed dependencies for known security vulnerabilities"
        # TODO: Botocore needs urllib3 1.X so we need to ignore these vulnerabilities 77744,77745. Remove this once we upgrade to urllib3 2.X
        entry: bash -c 'safety check --ignore 70612,66963,74429,76352,76353,77744,77745'
        language: system

      - id: vulture
        name: vulture
        description: "Vulture finds unused code in Python programs."
        entry: bash -c 'vulture --exclude "contrib,.venv,api/src/backend/api/tests/,api/src/backend/conftest.py,api/src/backend/tasks/tests/" --min-confidence 100 .'
        language: system
        files: '.*\.py'

      - id: ui-checks
        name: UI - Husky Pre-commit
        description: "Run UI pre-commit checks (Claude Code validation + healthcheck)"
        entry: bash -c 'cd ui && .husky/pre-commit'
        language: system
        files: '^ui/.*\.(ts|tsx|js|jsx|json|css)$'
        pass_filenames: false
        verbose: true
```

--------------------------------------------------------------------------------

---[FILE: .readthedocs.yaml]---
Location: prowler-master/.readthedocs.yaml

```yaml
# .readthedocs.yaml
# Read the Docs configuration file
# See https://docs.readthedocs.io/en/stable/config-file/v2.html for details

# Required
version: 2

build:
  os: "ubuntu-22.04"
  tools:
    python: "3.11"
  jobs:
    post_create_environment:
      # Install poetry
      # https://python-poetry.org/docs/#installing-manually
      - python -m pip install poetry
    post_install:
      # Install dependencies with 'docs' dependency group
      # https://python-poetry.org/docs/managing-dependencies/#dependency-groups
      # VIRTUAL_ENV needs to be set manually for now.
      # See https://github.com/readthedocs/readthedocs.org/pull/11152/
      - VIRTUAL_ENV=${READTHEDOCS_VIRTUALENV_PATH} python -m poetry install --only=docs

mkdocs:
  configuration: mkdocs.yml
```

--------------------------------------------------------------------------------

---[FILE: AGENTS.md]---
Location: prowler-master/AGENTS.md

```text
# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms, Prowler is a monorepo with several components. Every component should have an `AGENTS.md` file that contains the guidelines for the agents in that component. The file is located beside the code you are touching (e.g. `api/AGENTS.md`, `ui/AGENTS.md`, `prowler/AGENTS.md`).
- Follow the stricter rule when guidance conflicts; component docs override this file for their scope.
- Keep instructions synchronized. When you add new workflows or scripts, update both, the relevant component `AGENTS.md` and this file if they apply broadly.

## Project Overview

Prowler is an open-source cloud security assessment tool that supports multiple cloud providers (AWS, Azure, GCP, Kubernetes, GitHub, M365, etc.). The project consists in a monorepo with the following main components:

- **Prowler SDK**: Python SDK, includes the Prowler CLI, providers, services, checks, compliances, config, etc. (`prowler/`)
- **Prowler API**: Django-based REST API backend (`api/`)
- **Prowler UI**: Next.js frontend application (`ui/`)
- **Prowler MCP Server**: Model Context Protocol server that gives access to the entire Prowler ecosystem for LLMs (`mcp_server/`)
- **Prowler Dashboard**: Prowler CLI feature that allows to visualize the results of the scans in a simple dashboard (`dashboard/`)

### Project Structure (Key Folders & Files)

- `prowler/`: Main source code for Prowler SDK (CLI, providers, services, checks, compliances, config, etc.)
- `api/`: Django-based REST API backend components
- `ui/`: Next.js frontend application
- `mcp_server/`: Model Context Protocol server that gives access to the entire Prowler ecosystem for LLMs
- `dashboard/`: Prowler CLI feature that allows to visualize the results of the scans in a simple dashboard
- `docs/`: Documentation
- `examples/`: Example output formats for providers and scripts
- `permissions/`: Permission-related files and policies
- `contrib/`: Community-contributed scripts or modules
- `tests/`: Prowler SDK test suite
- `docker-compose.yml`: Docker compose file to run the Prowler App (API + UI) production environment
- `docker-compose-dev.yml`: Docker compose file to run the Prowler App (API + UI) development environment
- `pyproject.toml`: Poetry Prowler SDK project file
- `.pre-commit-config.yaml`: Pre-commit hooks configuration
- `Makefile`: Makefile to run the project
- `LICENSE`: License file
- `README.md`: README file
- `CONTRIBUTING.md`: Contributing guide

## Python Development

Most of the code is written in Python, so the main files in the root are focused on Python code.

### Poetry Dev Environment

For developing in Python we recommend using `poetry` to manage the dependencies. The minimal version is `2.1.1`. So it is recommended to run all commands using `poetry run ...`.

To install the core dependencies to develop it is needed to run `poetry install --with dev`.

### Pre-commit hooks

The project has pre-commit hooks to lint and format the code. They are installed by running `poetry run pre-commit install`.

When commiting a change, the hooks will be run automatically. Some of them are:

- Code formatting (black, isort)
- Linting (flake8, pylint)
- Security checks (bandit, safety, trufflehog)
- YAML/JSON validation
- Poetry lock file validation


### Linting and Formatting

We use the following tools to lint and format the code:

- `flake8`: for linting the code
- `black`: for formatting the code
- `pylint`: for linting the code

You can run all using the `make` command:
```bash
poetry run make lint
poetry run make format
```

Or they will be run automatically when you commit your changes using pre-commit hooks.

## Commit & Pull Request Guidelines

For the commit messages and pull requests name follow the conventional-commit style.

Befire creating a pull request, complete the checklist in `.github/pull_request_template.md`. Summaries should explain deployment impact, highlight review steps, and note changelog or permission updates. Run all relevant tests and linters before requesting review and link screenshots for UI or dashboard changes.

### Conventional Commit Style

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of.

The commit message should be structured as follows:

```
<type>[optional scope]: <description>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer(s)]
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools

#### Commit Types

- **feat**: code change introuce new functionality to the application
- **fix**: code change that solve a bug in the codebase
- **docs**: documentation only changes
- **chore**: changes related to the build process or auxiliary tools and libraries, that do not affect the application's functionality
- **perf**: code change that improves performance
- **refactor**: code change that neither fixes a bug nor adds a feature
- **style**: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: adding missing tests or correcting existing tests
```

--------------------------------------------------------------------------------

---[FILE: codecov.yml]---
Location: prowler-master/codecov.yml

```yaml
component_management:
  individual_components:
    - component_id: "prowler"
      paths:
        - "prowler/**"
    - component_id: "api"
      paths:
        - "api/**"

comment:
  layout: "header, diff, flags, components"
```

--------------------------------------------------------------------------------

---[FILE: CODE_OF_CONDUCT.md]---
Location: prowler-master/CODE_OF_CONDUCT.md

```text
# Contributor Covenant Code of Conduct

## Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, sex characteristics, gender identity and expression,
level of experience, education, socio-economic status, nationality, personal
appearance, race, religion, or sexual identity and orientation.

## Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
 advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
 address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
 professional setting

## Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

## Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [support.prowler.com](https://customer.support.prowler.com/servicedesk/customer/portals). All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see
https://www.contributor-covenant.org/faq
```

--------------------------------------------------------------------------------

---[FILE: CONTRIBUTING.md]---
Location: prowler-master/CONTRIBUTING.md

```text
# Do you want to learn on how to...

- Contribute with your code or fixes to Prowler
- Create a new check for a provider
- Create a new security compliance framework
- Add a custom output format
- Add a new integration
- Contribute with documentation

Want some swag as appreciation for your contribution?

# Prowler Developer Guide
https://goto.prowler.com/devguide
```

--------------------------------------------------------------------------------

---[FILE: docker-compose-dev.yml]---
Location: prowler-master/docker-compose-dev.yml
Signals: Docker

```yaml
services:
  api-dev:
    hostname: "prowler-api"
    build:
      context: ./api
      dockerfile: Dockerfile
      target: dev
    environment:
      - DJANGO_SETTINGS_MODULE=config.django.devel
      - DJANGO_LOGGING_FORMATTER=${LOGGING_FORMATTER:-human_readable}
    env_file:
      - path: .env
        required: false
    ports:
      - "${DJANGO_PORT:-8080}:${DJANGO_PORT:-8080}"
    volumes:
      - ./api/src/backend:/home/prowler/backend
      - ./api/pyproject.toml:/home/prowler/pyproject.toml
      - ./api/docker-entrypoint.sh:/home/prowler/docker-entrypoint.sh
      - ./_data/api:/home/prowler/.config/prowler-api
      - outputs:/tmp/prowler_api_output
    depends_on:
      postgres:
        condition: service_healthy
      valkey:
        condition: service_healthy
    entrypoint:
      - "/home/prowler/docker-entrypoint.sh"
      - "dev"

  ui-dev:
    build:
      context: ./ui
      dockerfile: Dockerfile
      target: dev
    env_file:
      - path: .env
        required: false
    ports:
      - 3000:3000
    volumes:
      - "./ui:/app"
      - "/app/node_modules"
    depends_on:
      mcp-server:
        condition: service_healthy

  postgres:
    image: postgres:16.3-alpine3.20
    hostname: "postgres-db"
    volumes:
      - ./_data/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_ADMIN_USER}
      - POSTGRES_PASSWORD=${POSTGRES_ADMIN_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    env_file:
      - path: .env
        required: false
    ports:
      - "${POSTGRES_PORT:-5432}:${POSTGRES_PORT:-5432}"
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "sh -c 'pg_isready -U ${POSTGRES_ADMIN_USER} -d ${POSTGRES_DB}'",
        ]
      interval: 5s
      timeout: 5s
      retries: 5

  valkey:
    image: valkey/valkey:7-alpine3.19
    hostname: "valkey"
    volumes:
      - ./_data/valkey:/data
    env_file:
      - path: .env
        required: false
    ports:
      - "${VALKEY_PORT:-6379}:6379"
    healthcheck:
      test: ["CMD-SHELL", "sh -c 'valkey-cli ping'"]
      interval: 10s
      timeout: 5s
      retries: 3

  worker-dev:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: dev
    environment:
      - DJANGO_SETTINGS_MODULE=config.django.devel
    env_file:
      - path: .env
        required: false
    volumes:
      - "outputs:/tmp/prowler_api_output"
    depends_on:
      valkey:
        condition: service_healthy
      postgres:
        condition: service_healthy
    entrypoint:
      - "/home/prowler/docker-entrypoint.sh"
      - "worker"

  worker-beat:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: dev
    environment:
      - DJANGO_SETTINGS_MODULE=config.django.devel
    env_file:
      - path: ./.env
        required: false
    depends_on:
      valkey:
        condition: service_healthy
      postgres:
        condition: service_healthy
    entrypoint:
      - "../docker-entrypoint.sh"
      - "beat"

  mcp-server:
    build:
      context: ./mcp_server
      dockerfile: Dockerfile
    environment:
      - PROWLER_MCP_TRANSPORT_MODE=http
    env_file:
      - path: .env
        required: false
    ports:
      - "8000:8000"
    volumes:
      - ./mcp_server/prowler_mcp_server:/app/prowler_mcp_server
      - ./mcp_server/pyproject.toml:/app/pyproject.toml
      - ./mcp_server/entrypoint.sh:/app/entrypoint.sh
    command: ["uvicorn", "--host", "0.0.0.0", "--port", "8000"]
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "wget -q -O /dev/null http://127.0.0.1:8000/health || exit 1",
        ]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  outputs:
    driver: local
```

--------------------------------------------------------------------------------

---[FILE: docker-compose.yml]---
Location: prowler-master/docker-compose.yml
Signals: Docker

```yaml
# Production Docker Compose configuration
# Uses pre-built images from Docker Hub (prowlercloud/*)
#
# For development with local builds and hot-reload, use docker-compose-dev.yml instead:
#   docker compose -f docker-compose-dev.yml up
#
services:
  api:
    hostname: "prowler-api"
    image: prowlercloud/prowler-api:${PROWLER_API_VERSION:-stable}
    env_file:
      - path: .env
        required: false
    ports:
      - "${DJANGO_PORT:-8080}:${DJANGO_PORT:-8080}"
    volumes:
      - ./_data/api:/home/prowler/.config/prowler-api
      - output:/tmp/prowler_api_output
    depends_on:
      postgres:
        condition: service_healthy
      valkey:
        condition: service_healthy
    entrypoint:
      - "/home/prowler/docker-entrypoint.sh"
      - "prod"

  ui:
    image: prowlercloud/prowler-ui:${PROWLER_UI_VERSION:-stable}
    env_file:
      - path: .env
        required: false
    ports:
      - ${UI_PORT:-3000}:${UI_PORT:-3000}
    depends_on:
      mcp-server:
        condition: service_healthy

  postgres:
    image: postgres:16.3-alpine3.20
    hostname: "postgres-db"
    volumes:
      - ./_data/postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_ADMIN_USER}
      - POSTGRES_PASSWORD=${POSTGRES_ADMIN_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    env_file:
      - path: .env
        required: false
    ports:
      - "${POSTGRES_PORT:-5432}:${POSTGRES_PORT:-5432}"
    healthcheck:
      test: ["CMD-SHELL", "sh -c 'pg_isready -U ${POSTGRES_ADMIN_USER} -d ${POSTGRES_DB}'"]
      interval: 5s
      timeout: 5s
      retries: 5

  valkey:
    image: valkey/valkey:7-alpine3.19
    hostname: "valkey"
    volumes:
      - ./_data/valkey:/data
    env_file:
      - path: .env
        required: false
    ports:
      - "${VALKEY_PORT:-6379}:6379"
    healthcheck:
      test: ["CMD-SHELL", "sh -c 'valkey-cli ping'"]
      interval: 10s
      timeout: 5s
      retries: 3

  worker:
    image: prowlercloud/prowler-api:${PROWLER_API_VERSION:-stable}
    env_file:
      - path: .env
        required: false
    volumes:
      - "output:/tmp/prowler_api_output"
    depends_on:
      valkey:
        condition: service_healthy
      postgres:
        condition: service_healthy
    entrypoint:
      - "/home/prowler/docker-entrypoint.sh"
      - "worker"

  worker-beat:
    image: prowlercloud/prowler-api:${PROWLER_API_VERSION:-stable}
    env_file:
      - path: ./.env
        required: false
    depends_on:
      valkey:
        condition: service_healthy
      postgres:
        condition: service_healthy
    entrypoint:
      - "../docker-entrypoint.sh"
      - "beat"

  mcp-server:
    image: prowlercloud/prowler-mcp:${PROWLER_MCP_VERSION:-stable}
    environment:
      - PROWLER_MCP_TRANSPORT_MODE=http
    env_file:
      - path: .env
        required: false
    ports:
      - "8000:8000"
    command: ["uvicorn", "--host", "0.0.0.0", "--port", "8000"]
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O /dev/null http://127.0.0.1:8000/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  output:
    driver: local
```

--------------------------------------------------------------------------------

---[FILE: Dockerfile]---
Location: prowler-master/Dockerfile

```text
FROM python:3.12.11-slim-bookworm AS build

LABEL maintainer="https://github.com/prowler-cloud/prowler"
LABEL org.opencontainers.image.source="https://github.com/prowler-cloud/prowler"

ARG POWERSHELL_VERSION=7.5.0
ENV POWERSHELL_VERSION=${POWERSHELL_VERSION}

ARG TRIVY_VERSION=0.66.0
ENV TRIVY_VERSION=${TRIVY_VERSION}

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget libicu72 libunwind8 libssl3 libcurl4 ca-certificates apt-transport-https gnupg \
    build-essential pkg-config libzstd-dev zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PowerShell
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        wget --progress=dot:giga https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}/powershell-${POWERSHELL_VERSION}-linux-x64.tar.gz -O /tmp/powershell.tar.gz ; \
    elif [ "$ARCH" = "aarch64" ]; then \
        wget --progress=dot:giga https://github.com/PowerShell/PowerShell/releases/download/v${POWERSHELL_VERSION}/powershell-${POWERSHELL_VERSION}-linux-arm64.tar.gz -O /tmp/powershell.tar.gz ; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1 ; \
    fi && \
    mkdir -p /opt/microsoft/powershell/7 && \
    tar zxf /tmp/powershell.tar.gz -C /opt/microsoft/powershell/7 && \
    chmod +x /opt/microsoft/powershell/7/pwsh && \
    ln -s /opt/microsoft/powershell/7/pwsh /usr/bin/pwsh && \
    rm /tmp/powershell.tar.gz

# Install Trivy for IaC scanning
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        TRIVY_ARCH="Linux-64bit" ; \
    elif [ "$ARCH" = "aarch64" ]; then \
        TRIVY_ARCH="Linux-ARM64" ; \
    else \
        echo "Unsupported architecture for Trivy: $ARCH" && exit 1 ; \
    fi && \
    wget --progress=dot:giga "https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_${TRIVY_ARCH}.tar.gz" -O /tmp/trivy.tar.gz && \
    tar zxf /tmp/trivy.tar.gz -C /tmp && \
    mv /tmp/trivy /usr/local/bin/trivy && \
    chmod +x /usr/local/bin/trivy && \
    rm /tmp/trivy.tar.gz && \
    # Create trivy cache directory with proper permissions
    mkdir -p /tmp/.cache/trivy && \
    chmod 777 /tmp/.cache/trivy

# Add prowler user
RUN addgroup --gid 1000 prowler && \
    adduser --uid 1000 --gid 1000 --disabled-password --gecos "" prowler

USER prowler

WORKDIR /home/prowler

# Copy necessary files
COPY prowler/  /home/prowler/prowler/
COPY dashboard/ /home/prowler/dashboard/
COPY pyproject.toml /home/prowler
COPY README.md /home/prowler/
COPY prowler/providers/m365/lib/powershell/m365_powershell.py /home/prowler/prowler/providers/m365/lib/powershell/m365_powershell.py

# Install Python dependencies
ENV HOME='/home/prowler'
ENV PATH="${HOME}/.local/bin:${PATH}"
#hadolint ignore=DL3013
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir poetry

RUN poetry install --compile && \
    rm -rf ~/.cache/pip

# Install PowerShell modules
RUN poetry run python prowler/providers/m365/lib/powershell/m365_powershell.py

# Remove deprecated dash dependencies
RUN pip uninstall dash-html-components -y && \
    pip uninstall dash-core-components -y

USER prowler
ENTRYPOINT ["poetry", "run", "prowler"]
```

--------------------------------------------------------------------------------

````
