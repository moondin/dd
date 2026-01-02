---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 3
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 3 of 991)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - mlflow-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/mlflow-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: CITATION.cff]---
Location: mlflow-master/CITATION.cff

```text
cff-version: 1.2.0
message: "If you use this software, please cite it as below."
type: software
title: "MLflow"
abstract: "MLflow is an open-source platform for managing the full machine learning lifecycle, providing experiment tracking, model packaging, registry, serving, evaluation, and observability capabilities to ensure reproducible and scalable ML workflows."
authors:
  - name: "The MLflow Development Team"
url: "https://mlflow.org"
repository-code: "https://github.com/mlflow/mlflow"
license: Apache-2.0
license-url: "https://github.com/mlflow/mlflow/blob/master/LICENSE.txt"
preferred-citation:
  type: article
  title: "Accelerating the Machine Learning Lifecycle with MLflow"
  authors:
    - given-names: "Matei A."
      family-names: "Zaharia"
    - given-names: "Andrew"
      family-names: "Chen"
    - given-names: "Aaron"
      family-names: "Davidson"
    - given-names: "Ali"
      family-names: "Ghodsi"
    - given-names: "Sue Ann"
      family-names: "Hong"
    - given-names: "Andy"
      family-names: "Konwinski"
    - given-names: "Siddharth"
      family-names: "Murching"
    - given-names: "Tomas"
      family-names: "Nykodym"
    - given-names: "Paul"
      family-names: "Ogilvie"
    - given-names: "Mani"
      family-names: "Parkhe"
    - given-names: "Fen"
      family-names: "Xie"
    - given-names: "Corey"
      family-names: "Zumar"
  journal: "IEEE Data Eng. Bull."
  year: 2018
  volume: 41
  start: 39
  end: 45
  url: "https://api.semanticscholar.org/CorpusID:83459546"
references:
  - type: conference-paper
    title: "Developments in MLflow: A System to Accelerate the Machine Learning Lifecycle"
    authors:
      - given-names: "Andrew"
        family-names: "Chen"
      - given-names: "Andy"
        family-names: "Chow"
      - given-names: "Aaron"
        family-names: "Davidson"
      - given-names: "Arjun"
        family-names: "DCunha"
      - given-names: "Ali"
        family-names: "Ghodsi"
      - given-names: "Sue Ann"
        family-names: "Hong"
      - given-names: "Andy"
        family-names: "Konwinski"
      - given-names: "Clemens"
        family-names: "Mewald"
      - given-names: "Siddharth"
        family-names: "Murching"
      - given-names: "Tomas"
        family-names: "Nykodym"
      - given-names: "Paul"
        family-names: "Ogilvie"
      - given-names: "Mani"
        family-names: "Parkhe"
      - given-names: "Avesh"
        family-names: "Singh"
      - given-names: "Fen"
        family-names: "Xie"
      - given-names: "Matei"
        family-names: "Zaharia"
      - given-names: "Richard"
        family-names: "Zang"
      - given-names: "Juntai"
        family-names: "Zheng"
      - given-names: "Corey"
        family-names: "Zumar"
    collection-title: "Proceedings of the Fourth International Workshop on Data Management for End-to-End Machine Learning"
    collection-type: "proceedings"
    conference:
      name: "DEEM '20"
      location: "Portland, OR, USA"
    publisher:
      name: "Association for Computing Machinery"
      address: "New York, NY, USA"
    year: 2020
    isbn: "9781450380232"
    url: "https://doi.org/10.1145/3399579.3399867"
    doi: "10.1145/3399579.3399867"
    abstract: "MLflow is a popular open source platform for managing ML development, including experiment tracking, reproducibility, and deployment. In this paper, we discuss user feedback collected since MLflow was launched in 2018, as well as three major features we have introduced in response to this feedback: a Model Registry for collaborative model management and review, tools for simplifying ML code instrumentation, and experiment analytics functions for extracting insights from millions of ML experiments."
```

--------------------------------------------------------------------------------

---[FILE: CLAUDE.md]---
Location: mlflow-master/CLAUDE.md

```text
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**For contribution guidelines, code standards, and additional development information not covered here, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).**

## Code Style Principles

- Use top-level imports (only use lazy imports when necessary)
- Only add docstrings in tests when they provide additional context
- Only add comments that explain non-obvious logic or provide additional context

## Repository Overview

MLflow is an open-source platform for managing the end-to-end machine learning lifecycle. It provides tools for:

- Experiment tracking
- Model versioning and deployment
- LLM observability and tracing
- Model evaluation
- Prompt management

## Quick Start: Development Server

### Start the Full Development Environment (Recommended)

```bash
# Start both MLflow backend and React frontend dev servers
# (The script will automatically clean up any existing servers)
nohup uv run bash dev/run-dev-server.sh > /tmp/mlflow-dev-server.log 2>&1 &

# Monitor the logs
tail -f /tmp/mlflow-dev-server.log

# Servers will be available at:
# - MLflow backend: http://localhost:5000
# - React frontend: http://localhost:3000
```

This uses `uv` (fast Python package manager) to automatically manage dependencies and run the development environment.

### Start Development Server with Databricks Backend

To run the MLflow dev server that proxies requests to a Databricks workspace:

```bash
# IMPORTANT: All four environment variables below are REQUIRED for proper Databricks backend operation
# Set them in this exact order:
export DATABRICKS_HOST="https://your-workspace.databricks.com"  # Your Databricks workspace URL
export DATABRICKS_TOKEN="your-databricks-token"                # Your Databricks personal access token
export MLFLOW_TRACKING_URI="databricks"                        # Must be set to "databricks"
export MLFLOW_REGISTRY_URI="databricks-uc"                     # Use "databricks-uc" for Unity Catalog, or "databricks" for workspace model registry

# Start the dev server with these environment variables
# (The script will automatically clean up any existing servers)
nohup uv run bash dev/run-dev-server.sh > /tmp/mlflow-dev-server.log 2>&1 &

# Monitor the logs
tail -f /tmp/mlflow-dev-server.log

# The MLflow server will now proxy tracking and model registry requests to Databricks
# Access the UI at http://localhost:3000 to see your Databricks experiments and models
```

**Note**: The MLflow server acts as a proxy, forwarding API requests to your Databricks workspace while serving the local React frontend. This allows you to develop and test UI changes against real Databricks data.

## Development Commands

### Testing

```bash
# First-time setup: Install test dependencies
uv sync
uv pip install -r requirements/test-requirements.txt

# Run Python tests
uv run pytest tests/

# Run specific test file
uv run pytest tests/test_version.py

# Run tests with specific package versions
uv run --with abc==1.2.3 --with xyz==4.5.6 pytest tests/test_version.py

# Run tests with optional dependencies/extras
uv run --with transformers pytest tests/transformers
uv run --extra gateway pytest tests/gateway

# Run JavaScript tests
(cd mlflow/server/js && yarn test)
```

**IMPORTANT**: `uv` may fail initially because the environment has not been set up yet. Follow the instructions to set up the environment and then rerun `uv` as needed.

### Code Quality

```bash
# Python linting and formatting with Ruff
uv run --only-group lint ruff check . --fix         # Lint with auto-fix
uv run --only-group lint ruff format .              # Format code

# Custom MLflow linting with Clint
uv run --only-group lint clint .                    # Run MLflow custom linter

# Check for MLflow spelling typos
uv run --only-group lint bash dev/mlflow-typo.sh .

# JavaScript linting and formatting
(cd mlflow/server/js && yarn lint)
(cd mlflow/server/js && yarn prettier:check)
(cd mlflow/server/js && yarn prettier:fix)

# Type checking
(cd mlflow/server/js && yarn type-check)

# Run all checks
(cd mlflow/server/js && yarn check-all)
```

### Special Testing

```bash
# Run tests with minimal dependencies (skinny client)
uv run bash dev/run-python-skinny-tests.sh
```

### Documentation

```bash
# Build documentation site (needs gateway extras for API doc generation)
uv run --all-extras bash dev/build-docs.sh --build-api-docs

# Build with R docs included
uv run --all-extras bash dev/build-docs.sh --build-api-docs --with-r-docs

# Serve documentation locally (after building)
cd docs && npm run serve --port 8080
```

## Important Files

- `pyproject.toml`: Package configuration and tool settings
- `.python-version`: Minimum Python version (3.10)
- `requirements/`: Dependency specifications
- `mlflow/ml-package-versions.yml`: Supported ML framework versions

## Common Development Tasks

### Modifying the UI

See `mlflow/server/js/` for frontend development.

## Language-Specific Style Guides

- [Python](/dev/guides/python.md)

## Git Workflow

### Committing Changes

**IMPORTANT**: After making your commits, run pre-commit hooks on your PR changes to ensure code quality:

```bash
# Make your commit first (with DCO sign-off)
git commit -s -m "Your commit message"

# Then check all files changed in your PR
uv run --only-group lint pre-commit run --from-ref origin/master --to-ref HEAD

# Fix any issues and amend your commit if needed
git add <fixed files>
git commit --amend -s

# Re-run pre-commit to verify fixes
uv run --only-group lint pre-commit run --from-ref origin/master --to-ref HEAD

# Only push once all checks pass
git push origin <your-branch>
```

This workflow ensures you only check files you've actually modified in your PR, avoiding false positives from unrelated files.

**IMPORTANT**: You MUST sign all commits with DCO (Developer Certificate of Origin). Always use the `-s` flag:

```bash
# REQUIRED: Always use -s flag when committing
git commit -s -m "Your commit message"

# This will NOT work - missing -s flag
# git commit -m "Your commit message"  ❌
```

Commits without DCO sign-off will be rejected by CI.

**Frontend Changes**: If your PR touches any code in `mlflow/server/js/`, you MUST run `yarn check-all` before committing:

```bash
(cd mlflow/server/js && yarn check-all)
```

### Creating Pull Requests

Follow [the PR template](./.github/pull_request_template.md) when creating pull requests. Remove any unused checkboxes from the template to keep your PR clean and focused.

### Checking CI Status

Use GitHub CLI to check for failing CI:

```bash
# Check workflow runs for current branch
gh run list --branch $(git branch --show-current)

# View details of a specific run
gh run view <run-id>

# Watch a run in progress
gh run watch
```

## Pre-commit Hooks

The repository uses pre-commit for code quality. Install hooks with:

```bash
uv run --only-group lint pre-commit install --install-hooks
uv run --only-group lint pre-commit run install-bin -a -v
```

Run pre-commit manually:

```bash
# Run on all files
uv run --only-group lint pre-commit run --all-files

# Run on specific files
uv run --only-group lint pre-commit run --files path/to/file.py

# Run a specific hook
uv run --only-group lint pre-commit run ruff --all-files
```

This runs Ruff, typos checker, and other tools automatically before commits.
```

--------------------------------------------------------------------------------

---[FILE: CODE_OF_CONDUCT.rst]---
Location: mlflow-master/CODE_OF_CONDUCT.rst

```text
MLflow Contributor Covenant Code of Conduct
===========================================

.. contents:: **Table of Contents**
  :local:
  :depth: 4

Our Pledge
##########

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, sex characteristics, gender identity and expression,
level of experience, education, socio-economic status, nationality, personal
appearance, race, religion, or sexual identity and orientation.

Our Standards
#############

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a professional setting

Our Responsibilities
####################

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

Scope
#####

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

Enforcement
###########

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the Technical Steering Committee defined `here <https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#governance>`_.
All complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

Attribution
###########

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at https://www.contributor-covenant.org/version/1/4/code-of-conduct.html

[homepage]: https://www.contributor-covenant.org

For answers to common questions about this code of conduct, see
https://www.contributor-covenant.org/faq
```

--------------------------------------------------------------------------------

---[FILE: COMMITTER.md]---
Location: mlflow-master/COMMITTER.md

```text
### Evaluation Criteria

When evaluating potential new MLflow committers, the following criteria will be considered:

- **Code Contributions**: Should have multiple non-trivial code contributions accepted and committed to the MLflow codebase. This demonstrates the ability to produce quality code aligned with the project's standards.
- **Technical Expertise**: Should demonstrate a deep understanding of MLflow's architecture and design principles, evidenced by making appropriate design choices and technical recommendations. History of caring about code quality, testing, maintainability, and ability to critically evaluate technical artifacts (PRs, designs, etc.) and provide constructive suggestions for improvement.
- **Subject Matter Breadth**: Contributions and learnings span multiple areas of the codebase, APIs, and integration points rather than a narrow niche.
- **Community Participation**: Active participation for at least 3 months prior to nomination by authoring code contributions and engaging in the code review process. Involvement in mailing lists, Slack channels, Stack Overflow, and GitHub issues is valued but not strictly required.
- **Communication**: Should maintain a constructive tone in communications, be receptive to feedback, and collaborate well with existing committers and other community members.
- **Project Commitment**: Demonstrate commitment to MLflow's long-term success, uphold project principles and values, and willingness to pitch in for "unglamorous" work.

### Committership Nomination

- Any current MLflow committer can nominate a contributor for committership by emailing MLflow's TSC members with a nomination packet.
- The nomination packet should provide details on the nominee's salient contributions, as well as justification on how they meet the evaluation criteria. Links to GitHub activity, mailing list threads, and other artifacts should be included.
- In addition to the nominator, every nomination must have a seconder -- a separate committer who advocates for the nominee. The seconder should be a more senior committer (active committer for >1 year) familiar with the nominee's work.
- It is the nominator's responsibility to identify a willing seconder and include their recommendation in the nomination packet.
- If no eligible seconder is available or interested, it may indicate insufficient support to proceed with the nomination at that time. This ensures there are two supporting committers invested in each nomination - the nominator and the seconder. The seconder's seniority and familiarity with the situation also help build more consensus among the TSC members during evaluation.

### Evaluation Process

- When a committer nomination is made, the TSC members closely review the proposal and evaluate the nominee's qualifications.
- Throughout the review, the nominator is responsible for addressing any questions from the TSC, and providing clarification or additional evidence as requested by TSC members.
- After adequate discussion (~1 week), the nominator calls for a formal consensus check among the TSC.
- A positive consensus requires at least 2 TSC +1 binding votes and no vetoes.
- Any vetoes must be accompanied by a clear rationale that can be debated.
- If consensus is not achieved, the nomination is rejected at that time.
- If consensus fails, the nominator summarizes substantive feedback and remaining gaps to the nominee for their growth and potential re-nomination later. Nomination can be tried again in 3 months after addressing any gaps identified.

### Onboarding a new committer

- Upon a positive consensus being reached, one of the TSC members will extend the formal invitation to the nominee to become a committer. They also field the private initial response from the nominee on willingness to accept.
- If the proposal is accepted, the nominator grants them the commit access and the new committer will be:
  - Added to the committer list in the README.md
  - Announced on the MLflow mailing lists, Slack channels, and the MLflow website
  - Spotlighted through a post on the MLflow LinkedIn and X handles
- The nominator will work with the new committer to identify well-scoped initial areas for the new committer to focus on, such as improvements to a specific component.
- The nominator will also set up periodic 1:1 mentorship check-ins with the new committer over their first month to provide guidance where needed.
```

--------------------------------------------------------------------------------

````
