---
source_txt: fullstack_samples/zulip-main
converted_utc: 2025-12-18T13:06:12Z
part: 6
parts_total: 1290
---

# FULLSTACK CODE DATABASE SAMPLES zulip-main

## Verbatim Content (Part 6 of 1290)

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

---[FILE: funding.json]---
Location: zulip-main/.github/funding.json

```json
{
    "version": "v1.0.0",
    "entity": {
        "type": "organisation",
        "role": "steward",
        "name": "Kandra Labs, Inc.",
        "email": "support@zulip.com",
        "description": "Guiding the Zulip community in developing a world-class organized team chat product with apps for every major desktop and mobile platform requires leadership from a talented, dedicated team. We believe that the only sustainable model is for our core team to be compensated fairly for their time. We have thus founded a company (Kandra Labs) to steward and financially support Zulip’s development. We are growing our business sustainably, without venture capital funding. VCs are incentivized to push companies to gamble for explosive growth. Often, the result is that a company with a useful product burns rapidly through its resources and goes out of business. We have built Zulip as a sustainable business (also supported by SBIR grants from the US National Science Foundation), and are being thoughtful about our pace of spending. Funding our company without venture capital also allows us to live by our values, without investor pressure to compromise them when doing so might be “good business” or “what everyone does”.",
        "webpageUrl": {
            "url": "https://zulip.com/values/",
            "wellKnown": "https://zulip.com/.well-known/funding-manifest-urls"
        }
    },
    "projects": [
        {
            "guid": "zulip",
            "name": "Zulip",
            "description": "Zulip is an open-source team chat application designed for seamless remote and hybrid work. With conversations organized by topic, Zulip is ideal for both live and asynchronous communication. Zulip’s 100% open-source software is available as a cloud service or a self-hosted solution, and is used by thousands of organizations around the world. An important part of Zulip’s mission is ensuring that worthy organizations, from programming-language developers to research communities, are able to use Zulip whether or not they have funding. For this reason, we sponsor Zulip Cloud Standard for open source projects, non-profits, education, and academic research. This program has grown exponentially since its inception; today we are proud to fully sponsor Zulip hosting for several hundred organizations. Support from the community will help us continue to afford these programs as their popularity grows.        ",
            "webpageUrl": {
                "url": "https://zulip.com/",
                "wellKnown": "https://zulip.com/.well-known/funding-manifest-urls"
            },
            "repositoryUrl": {
                "url": "https://github.com/zulip"
            },
            "licenses": ["spdx:Apache-2.0"],
            "tags": ["communication", "team-chat", "collaboration"]
        }
    ],
    "funding": {
        "channels": [
            {
                "guid": "github-sponsors",
                "type": "payment-provider",
                "address": "https://github.com/sponsors/zulip",
                "description": "Preferred channel for sponsoring Zulip, since GitHub Sponsors does not charge any fees to sponsored projects."
            },
            {
                "guid": "patreon",
                "type": "payment-provider",
                "address": "https://patreon.com/zulip"
            },
            {
                "guid": "open-collective",
                "type": "payment-provider",
                "address": "https://opencollective.com/zulip"
            }
        ],
        "plans": [
            {
                "guid": "github-sponsors",
                "status": "active",
                "name": "Support Zulip",
                "description": "Contribute to Zulip's development and free hosting for open source projects and other worthy organizations!",
                "amount": 0,
                "currency": "USD",
                "frequency": "monthly",
                "channels": ["github-sponsors"]
            },
            {
                "guid": "patreon",
                "status": "active",
                "name": "Support Zulip",
                "description": "Contribute to Zulip's development and free hosting for open source projects and other worthy organizations!",
                "amount": 0,
                "currency": "USD",
                "frequency": "monthly",
                "channels": ["patreon"]
            },
            {
                "guid": "open-collective",
                "status": "active",
                "name": "Support Zulip",
                "description": "Contribute to Zulip's development and free hosting for open source projects and other worthy organizations!",
                "amount": 0,
                "currency": "USD",
                "frequency": "monthly",
                "channels": ["open-collective"]
            }
        ]
    }
}
```

--------------------------------------------------------------------------------

---[FILE: FUNDING.yml]---
Location: zulip-main/.github/FUNDING.yml

```yaml
github: zulip
patreon: zulip
open_collective: zulip
```

--------------------------------------------------------------------------------

---[FILE: pull_request_template.md]---
Location: zulip-main/.github/pull_request_template.md

```text
<!-- Describe your pull request here.-->

Fixes: <!-- Issue link, or clear description.-->

**How changes were tested:**

<!-- If the PR makes UI changes, always include one or more still screenshots to demonstrate your changes. If it seems helpful, add a screen capture of the new functionality as well.

Tooling tips: https://zulip.readthedocs.io/en/latest/tutorials/screenshot-and-gif-software.html
-->

**Screenshots and screen captures:**

<details>
<summary>Self-review checklist</summary>

<!-- Prior to submitting a PR, follow our step-by-step guide to review your own code:
https://zulip.readthedocs.io/en/latest/contributing/code-reviewing.html#how-to-review-code -->

<!-- Once you create the PR, check off all the steps below that you have completed.
If any of these steps are not relevant or you have not completed, leave them unchecked.-->

- [ ] [Self-reviewed](https://zulip.readthedocs.io/en/latest/contributing/code-reviewing.html#how-to-review-code) the changes for clarity and maintainability
      (variable names, code reuse, readability, etc.).

Communicate decisions, questions, and potential concerns.

- [ ] Explains differences from previous plans (e.g., issue description).
- [ ] Highlights technical choices and bugs encountered.
- [ ] Calls out remaining decisions and concerns.
- [ ] Automated tests verify logic where appropriate.

Individual commits are ready for review (see [commit discipline](https://zulip.readthedocs.io/en/latest/contributing/commit-discipline.html)).

- [ ] Each commit is a coherent idea.
- [ ] Commit message(s) explain reasoning and motivation for changes.

Completed manual review and testing of the following:

- [ ] Visual appearance of the changes.
- [ ] Responsiveness and internationalization.
- [ ] Strings and tooltips.
- [ ] End-to-end functionality of buttons, interactions and flows.
- [ ] Corner cases, error conditions, and easily imagined bugs.
</details>
```

--------------------------------------------------------------------------------

---[FILE: 1_discussed_on_czo.md]---
Location: zulip-main/.github/ISSUE_TEMPLATE/1_discussed_on_czo.md

```text
---
name: Issue discussed in the Zulip development community
about: Bug report, feature or improvement already discussed on chat.zulip.org.
---

<!-- Issue description -->

<!-- Link to a topic or message where this issue was discussed on chat.zulip.org. Link back to this issue from the discussion thread. -->

CZO thread:
```

--------------------------------------------------------------------------------

---[FILE: 2_bug_report.md]---
Location: zulip-main/.github/ISSUE_TEMPLATE/2_bug_report.md

```text
---
name: Bug report
about: A concrete bug report with steps to reproduce the behavior. (See also "Possible bug" below.)
labels: ["bug"]
---

<!-- Describe what you were expecting to see, what you saw instead, and steps to take in order to reproduce the buggy behavior. Screenshots can be helpful. -->

<!-- Check the box for the version of Zulip you are using (see https://zulip.com/help/view-zulip-version).-->

**Zulip Server and web app version:**

- [ ] Zulip Cloud (`*.zulipchat.com`)
- [ ] Zulip Server 11.x
- [ ] Zulip Server 10.x
- [ ] Zulip Server 9.x
- [ ] Zulip Server 8.x or older
- [ ] Other or not sure
```

--------------------------------------------------------------------------------

---[FILE: 3_feature_request.md]---
Location: zulip-main/.github/ISSUE_TEMPLATE/3_feature_request.md

```text
---
name: Feature or improvement request
about: A specific proposal for a new feature of improvement. (See also "Feature suggestion or feedback" below.)
---

<!-- Describe the proposal, including how it would help you or your organization. -->
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: zulip-main/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: true
contact_links:
  - name: Possible bug
    url: https://zulip.readthedocs.io/en/latest/contributing/reporting-bugs.html
    about: Report unexpected behavior that may be a bug.
  - name: Feature suggestion or feedback
    url: https://zulip.readthedocs.io/en/latest/contributing/suggesting-features.html
    about: Start a discussion about your idea for improving Zulip.
  - name: Issue with running or upgrading a Zulip server
    url: https://zulip.readthedocs.io/en/latest/production/troubleshooting.html
    about: We provide free, interactive support for the vast majority of questions about running a Zulip server.
  - name: Other support requests and sales questions
    url: https://zulip.com/help/contact-support
    about: Contact us — we're happy to help!
```

--------------------------------------------------------------------------------

---[FILE: api-docs-update-check.yml]---
Location: zulip-main/.github/workflows/api-docs-update-check.yml

```yaml
name: API Documentation Update Check

on:
  push:
    branches: [main]
    paths:
      - "api_docs/**"
  workflow_dispatch:

permissions:
  contents: read

jobs:
  check-feature-level-updated:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.x"

      - name: Run tools/check-feature-level-updated
        id: run_check
        run: ./tools/check-feature-level-updated >> $GITHUB_OUTPUT

      - name: Report status to CZO
        if: ${{ steps.run_check.outputs.fail == 'true' && github.repository == 'zulip/zulip'}}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "automated testing"
          topic: ${{ steps.run_check.outputs.topic }}
          type: "stream"
          content: ${{ steps.run_check.outputs.content }}

      - name: Fail job if feature level not updated in API docs
        if: ${{ steps.run_check.outputs.fail == 'true' }}
        run: exit 1

  notify-if-api-docs-changed:
    runs-on: ubuntu-latest
    needs: check-feature-level-updated

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.x"

      - name: Run tools/github-changes-contain-file
        run: ./tools/github-changes-contain-file api_docs/changelog.md

      - name: Run tools/notify-if-api-docs-changed
        id: run_check
        run: ./tools/notify-if-api-docs-changed >> $GITHUB_OUTPUT
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Report status to CZO
        if: ${{github.repository == 'zulip/zulip'}}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "api documentation"
          topic: ${{ steps.run_check.outputs.topic }}
          type: "stream"
          content: ${{ steps.run_check.outputs.content }}
```

--------------------------------------------------------------------------------

---[FILE: codeql-analysis.yml]---
Location: zulip-main/.github/workflows/codeql-analysis.yml

```yaml
name: "Code scanning"

on:
  push:
    branches: ["*.x", chat.zulip.org, main]
    tags: ["*"]
  pull_request:
    branches: ["*.x", chat.zulip.org, main]
  workflow_dispatch:

concurrency:
  group: "${{ github.workflow }}-${{ github.head_ref || github.run_id }}"
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  CodeQL:
    permissions:
      actions: read # for github/codeql-action/init to get workflow details
      contents: read # for actions/checkout to fetch code
      security-events: write # for github/codeql-action/analyze to upload SARIF results
    if: ${{!github.event.repository.private}}
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v6

      # Initializes the CodeQL tools for scanning.
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v4

        # Override language selection by uncommenting this and choosing your languages
        # with:
        #   languages: go, javascript, csharp, python, cpp, java

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v4
```

--------------------------------------------------------------------------------

---[FILE: production-suite.yml]---
Location: zulip-main/.github/workflows/production-suite.yml
Signals: Docker

```yaml
name: Zulip production suite

on:
  push:
    branches: ["*.x", chat.zulip.org, main]
    tags: ["*"]
  pull_request:
    paths:
      - .github/workflows/production-suite.yml
      - "**/migrations/**"
      - manage.py
      - pnpm-lock.yaml
      - puppet/**
      - scripts/**
      - tools/**
      - uv.lock
      - web/babel.config.js
      - web/postcss.config.js
      - web/third/**
      - web/webpack.config.ts
      - zerver/worker/queue_processors.py
      - zerver/lib/push_notifications.py
      - zerver/lib/storage.py
      - zerver/decorator.py
      - zproject/**
  workflow_dispatch:

concurrency:
  group: "${{ github.workflow }}-${{ github.head_ref || github.run_id }}"
  cancel-in-progress: true

defaults:
  run:
    shell: bash

permissions:
  contents: read

jobs:
  production_build:
    # This job builds a release tarball from the current commit, which
    # will be used for all of the following install/upgrade tests.
    name: Ubuntu 22.04 production build
    runs-on: ubuntu-latest

    # Docker images are built from 'tools/ci/Dockerfile'; the comments at
    # the top explain how to build and upload these images.
    # Ubuntu 22.04 ships with Python 3.10.12.
    container: zulip/ci:jammy

    steps:
      - name: Add required permissions
        run: |
          # The checkout actions doesn't clone to ~/zulip or allow
          # us to use the path option to clone outside the current
          # /__w/zulip/zulip directory. Since this directory is owned
          # by root we need to change it's ownership to allow the
          # github user to clone the code here.
          # Note: /__w/ is a docker volume mounted to $GITHUB_WORKSPACE
          # which is /home/runner/work/.
          sudo chown -R github .

          # This is the GitHub Actions specific cache directory the
          # the current github user must be able to access for the
          # cache action to work. It is owned by root currently.
          sudo chmod -R 0777 /__w/_temp/

      - uses: actions/checkout@v6

      - name: Create cache directories
        run: |
          dirs=(/srv/zulip-emoji-cache)
          sudo mkdir -p "${dirs[@]}"
          sudo chown -R github "${dirs[@]}"

      - name: Restore pnpm store
        uses: actions/cache@v4
        with:
          path: /__w/.pnpm-store
          key: v1-pnpm-store-jammy-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Restore uv cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/uv
          key: uv-jammy-${{ hashFiles('uv.lock') }}
          restore-keys: uv-jammy-

      - name: Restore emoji cache
        uses: actions/cache@v4
        with:
          path: /srv/zulip-emoji-cache
          key: v1-emoji-jammy-${{ hashFiles('tools/setup/emoji/emoji_map.json') }}-${{ hashFiles('tools/setup/emoji/build_emoji') }}-${{ hashFiles('tools/setup/emoji/emoji_setup_utils.py') }}-${{ hashFiles('tools/setup/emoji/emoji_names.py') }}-${{ hashFiles('package.json') }}
          restore-keys: v1-emoji-jammy

      - name: Build production tarball
        run: ./tools/ci/production-build

      - name: Upload production build artifacts for install jobs
        uses: actions/upload-artifact@v5
        with:
          name: production-tarball
          path: /tmp/production-build
          retention-days: 1

      - name: Verify pnpm store path
        run: |
          set -x
          path="$(pnpm store path)"
          [[ "$path" == /__w/.pnpm-store/* ]]

      - name: Minimize uv cache
        run: uv cache prune --ci

      - name: Generate failure report string
        id: failure_report_string
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        run: tools/ci/generate-failure-message >> $GITHUB_OUTPUT

      - name: Report status to CZO
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "automated testing"
          topic: ${{ steps.failure_report_string.outputs.topic }}
          type: "stream"
          content: ${{ steps.failure_report_string.outputs.content }}

  production_install:
    # This job installs the server release tarball built above on a
    # range of platforms, and does some basic health checks on the
    # resulting installer Zulip server.
    strategy:
      fail-fast: false
      matrix:
        include:
          # Docker images are built from 'tools/ci/Dockerfile'; the comments at
          # the top explain how to build and upload these images.
          - docker_image: zulip/ci:jammy
            name: Ubuntu 22.04 production install and PostgreSQL upgrade with pgroonga
            os: jammy
            extra-args: ""

          - docker_image: zulip/ci:noble
            name: Ubuntu 24.04 production install
            os: noble
            extra-args: ""

          - docker_image: zulip/ci:bookworm
            name: Debian 12 production install with custom db name and user
            os: bookworm
            extra-args: --test-custom-db

          - docker_image: zulip/ci:trixie
            name: Debian 13 production install
            os: trixie
            extra-args: ""

    name: ${{ matrix.name  }}
    container:
      image: ${{ matrix.docker_image }}
      options: --init
    runs-on: ubuntu-latest
    needs: production_build

    steps:
      - name: Download built production tarball
        uses: actions/download-artifact@v6
        with:
          name: production-tarball
          path: /tmp

      - name: Add required permissions and setup
        run: |
          # This is the GitHub Actions specific cache directory the
          # the current github user must be able to access for the
          # cache action to work. It is owned by root currently.
          sudo chmod -R 0777 /__w/_temp/

          # Since actions/download-artifact@v6 loses all the permissions
          # of the tarball uploaded by the upload artifact fix those.
          chmod +x /tmp/production-upgrade-pg
          chmod +x /tmp/production-pgroonga
          chmod +x /tmp/production-install
          chmod +x /tmp/production-verify
          chmod +x /tmp/generate-failure-message

      - name: Create cache directories
        run: |
          dirs=(/srv/zulip-emoji-cache)
          sudo mkdir -p "${dirs[@]}"
          sudo chown -R github "${dirs[@]}"

      - name: Install production
        run: sudo /tmp/production-install ${{ matrix.extra-args }}

      - name: Verify install
        run: sudo /tmp/production-verify ${{ matrix.extra-args }}

      - name: Install pgroonga
        if: ${{ matrix.os == 'jammy' }}
        run: sudo /tmp/production-pgroonga

      - name: Verify install after installing pgroonga
        if: ${{ matrix.os == 'jammy' }}
        run: sudo /tmp/production-verify ${{ matrix.extra-args }}

      - name: Upgrade postgresql
        if: ${{ matrix.os == 'jammy' }}
        run: sudo /tmp/production-upgrade-pg

      - name: Verify install after upgrading postgresql
        if: ${{ matrix.os == 'jammy' }}
        run: sudo /tmp/production-verify ${{ matrix.extra-args }}

      - name: Generate failure report string
        id: failure_report_string
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        run: /tmp/generate-failure-message >> $GITHUB_OUTPUT

      - name: Report status to CZO
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "automated testing"
          topic: ${{ steps.failure_report_string.outputs.topic }}
          type: "stream"
          content: ${{ steps.failure_report_string.outputs.content }}

  production_upgrade:
    # The production upgrade job starts with a container with a
    # previous Zulip release installed, and attempts to upgrade it to
    # the release tarball built for the current commit being tested.
    #
    # This is intended to catch bugs that result in the upgrade
    # process failing.
    strategy:
      fail-fast: false
      matrix:
        include:
          # Docker images are built from 'tools/ci/Dockerfile.prod'; the comments at
          # the top explain how to build and upload these images.
          - docker_image: zulip/ci:jammy-6.0
            name: 6.0 Version Upgrade
            os: jammy
          - docker_image: zulip/ci:bookworm-7.0
            name: 7.0 Version Upgrade
            os: bookworm
          - docker_image: zulip/ci:bookworm-8.0
            name: 8.0 Version Upgrade
            os: bookworm
          - docker_image: zulip/ci:noble-9.0
            name: 9.0 Version Upgrade
            os: noble
          - docker_image: zulip/ci:noble-10.0
            name: 10.0 Version Upgrade
            os: noble
          - docker_image: zulip/ci:trixie-11.0
            name: 11.0 Version Upgrade
            os: trixie

    name: ${{ matrix.name  }}
    container:
      image: ${{ matrix.docker_image }}
      options: --init
    runs-on: ubuntu-latest
    needs: production_build

    steps:
      - name: Download built production tarball
        uses: actions/download-artifact@v6
        with:
          name: production-tarball
          path: /tmp

      - name: Add required permissions and setup
        run: |
          # This is the GitHub Actions specific cache directory the
          # the current github user must be able to access for the
          # cache action to work. It is owned by root currently.
          sudo chmod -R 0777 /__w/_temp/

          # Since actions/download-artifact@v6 loses all the permissions
          # of the tarball uploaded by the upload artifact fix those.
          chmod +x /tmp/production-upgrade
          chmod +x /tmp/production-verify
          chmod +x /tmp/generate-failure-message

      - name: Create cache directories
        run: |
          dirs=(/srv/zulip-emoji-cache)
          sudo mkdir -p "${dirs[@]}"
          sudo chown -R github "${dirs[@]}"

      - name: Upgrade production
        run: sudo /tmp/production-upgrade

        # TODO: We should be running production-verify here, but it
        # doesn't pass yet.
        #
        # - name: Verify install
        #   run: sudo /tmp/production-verify

      - name: Generate failure report string
        id: failure_report_string
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        run: /tmp/generate-failure-message >> $GITHUB_OUTPUT

      - name: Report status to CZO
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "automated testing"
          topic: ${{ steps.failure_report_string.outputs.topic }}
          type: "stream"
          content: ${{ steps.failure_report_string.outputs.content }}
```

--------------------------------------------------------------------------------

---[FILE: update-oneclick-apps.yml]---
Location: zulip-main/.github/workflows/update-oneclick-apps.yml

```yaml
name: Update one click apps
on:
  release:
    types: [published]
permissions:
  contents: read

jobs:
  update-digitalocean-oneclick-app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - name: Update DigitalOcean one click app
        env:
          DIGITALOCEAN_API_KEY: ${{ secrets.ONE_CLICK_ACTION_DIGITALOCEAN_API_KEY }}
          ZULIP_API_KEY: ${{ secrets.ONE_CLICK_ACTION_ZULIP_BOT_API_KEY }}
          ZULIP_EMAIL: ${{ secrets.ONE_CLICK_ACTION_ZULIP_BOT_EMAIL }}
          ZULIP_SITE: https://chat.zulip.org
          ONE_CLICK_ACTION_STREAM: kandra ops
          PYTHON_DIGITALOCEAN_REQUEST_TIMEOUT_SEC: 30
          RELEASE_VERSION: ${{ github.event.release.tag_name }}
        run: |
          export PATH="$HOME/.local/bin:$PATH"
          git clone https://github.com/zulip/marketplace-partners
          pip3 install python-digitalocean zulip fab-classic PyNaCl
          echo $PATH
          python3 tools/oneclickapps/prepare_digital_ocean_one_click_app_release.py
```

--------------------------------------------------------------------------------

---[FILE: zulip-ci.yml]---
Location: zulip-main/.github/workflows/zulip-ci.yml
Signals: Docker

```yaml
# NOTE: Everything test in this file should be in `tools/test-all`.  If there's a
# reason not to run it there, it should be there as a comment
# explaining why.

name: Zulip CI

on:
  push:
    branches: ["*.x", chat.zulip.org, main]
    tags: ["*"]
  pull_request:
  workflow_dispatch:

concurrency:
  group: "${{ github.workflow }}-${{ github.head_ref || github.run_id }}"
  cancel-in-progress: true

defaults:
  run:
    shell: bash

permissions:
  contents: read

jobs:
  tests:
    strategy:
      fail-fast: false
      matrix:
        include:
          # Base images are built using `tools/ci/Dockerfile`.
          # The comments at the top explain how to build and upload these images.
          # Ubuntu 22.04 ships with Python 3.10.12.
          - docker_image: zulip/ci:jammy
            name: Ubuntu 22.04 (Python 3.10, backend + frontend)
            os: jammy
            include_documentation_tests: false
            include_frontend_tests: true
          # Debian 12 ships with Python 3.11.2.
          - docker_image: zulip/ci:bookworm
            name: Debian 12 (Python 3.11, backend + documentation)
            os: bookworm
            include_documentation_tests: true
            include_frontend_tests: false
          # Ubuntu 24.04 ships with Python 3.12.2.
          - docker_image: zulip/ci:noble
            name: Ubuntu 24.04 (Python 3.12, backend)
            os: noble
            include_documentation_tests: false
            include_frontend_tests: false
          # Debian 13 ships with Python 3.13.5.
          - docker_image: zulip/ci:trixie
            name: Debian 13 (Python 3.13, backend)
            os: trixie
            include_documentation_tests: false
            include_frontend_tests: false

    runs-on: ubuntu-latest
    name: ${{ matrix.name }}
    container: ${{ matrix.docker_image }}
    env:
      # GitHub Actions sets HOME to /github/home which causes
      # problem later in provision and frontend test that runs
      # tools/setup/postgresql-init-dev-db because of the .pgpass
      # location. PostgreSQL (psql) expects .pgpass to be at
      # /home/github/.pgpass and setting home to `/home/github/`
      # ensures it written there because we write it to ~/.pgpass.
      HOME: /home/github/

    steps:
      - uses: actions/checkout@v6

      - name: Create cache directories
        run: |
          dirs=(/srv/zulip-emoji-cache)
          sudo mkdir -p "${dirs[@]}"
          sudo chown -R github "${dirs[@]}"

      - name: Restore pnpm store
        uses: actions/cache@v4
        with:
          path: /__w/.pnpm-store
          key: v1-pnpm-store-${{ matrix.os }}-${{ hashFiles('pnpm-lock.yaml') }}

      - name: Restore uv cache
        uses: actions/cache@v4
        with:
          path: ~/.cache/uv
          key: uv-${{ matrix.os }}-${{ hashFiles('uv.lock') }}
          restore-keys: uv-${{ matrix.os }}-

      - name: Restore emoji cache
        uses: actions/cache@v4
        with:
          path: /srv/zulip-emoji-cache
          key: v1-emoji-${{ matrix.os }}-${{ hashFiles('tools/setup/emoji/emoji_map.json', 'tools/setup/emoji/build_emoji', 'tools/setup/emoji/emoji_setup_utils.py', 'tools/setup/emoji/emoji_names.py', 'package.json') }}
          restore-keys: v1-emoji-${{ matrix.os }}

      - name: Install dependencies
        run: |
          # This is the main setup job for the test suite
          ./tools/ci/setup-backend --skip-dev-db-build
          scripts/lib/clean_unused_caches.py --verbose --threshold=0

      - name: Run tools test
        run: |
          source tools/ci/activate-venv
          ./tools/test-tools

      - name: Run Codespell lint
        run: |
          source tools/ci/activate-venv
          ./tools/run-codespell

      # We run the tests that are only run in a specific job early, so
      # that we get feedback to the developer about likely failures as
      # quickly as possible. Backend/mypy failures that aren't
      # identical across different versions are much more rare than
      # frontend linter or node test failures.
      - name: Run documentation and api tests
        if: ${{ matrix.include_documentation_tests }}
        run: |
          source tools/ci/activate-venv
          ./tools/build-help-center
          # In CI, we only test links we control in test-documentation to avoid flakes
          ./tools/test-documentation --skip-external-links
          ./tools/test-help-documentation --skip-external-links --help-center
          ./tools/test-api

      - name: Run node tests
        if: ${{ matrix.include_frontend_tests }}
        run: |
          source tools/ci/activate-venv
          # Run the node tests first, since they're fast and deterministic
          ./tools/test-js-with-node --coverage --parallel=1

      - name: Run frontend lint
        if: ${{ matrix.include_frontend_tests }}
        run: |
          source tools/ci/activate-venv
          ./tools/lint --groups=frontend --skip=gitlint # gitlint disabled because flaky

      - name: Check schemas
        if: ${{ matrix.include_frontend_tests }}
        run: |
          source tools/ci/activate-venv
          # Check that various schemas are consistent. (is fast)
          ./tools/check-schemas

      - name: Check capitalization of strings
        if: ${{ matrix.include_frontend_tests }}
        run: |
          source tools/ci/activate-venv
          ./manage.py makemessages --locale en
          PYTHONWARNINGS=ignore ./tools/check-capitalization --no-generate
          PYTHONWARNINGS=ignore ./tools/check-frontend-i18n --no-generate

      - name: Run astro check
        if: ${{ matrix.include_frontend_tests }}
        run: |
          pnpm run --filter=starlight_help check

      - name: Run puppeteer tests
        if: ${{ matrix.include_frontend_tests }}
        run: |
          source tools/ci/activate-venv
          ./tools/test-js-with-puppeteer

      - name: Check pnpm dedupe
        if: ${{ matrix.include_frontend_tests }}
        run: pnpm dedupe --check

      - name: Run backend lint
        run: |
          source tools/ci/activate-venv
          echo "Test suite is running under $(python --version)."
          ./tools/lint --groups=backend --skip=gitlint,mypy # gitlint disabled because flaky

      - name: Run backend tests
        run: |
          source tools/ci/activate-venv
          ./tools/test-backend ${{ matrix.os != 'bookworm' && '--coverage' || '' }} --xml-report --no-html-report --include-webhooks --include-transaction-tests --no-cov-cleanup --ban-console-output

      - name: Run mypy
        run: |
          source tools/ci/activate-venv
          # We run mypy after the backend tests so we get output from the
          # backend tests, which tend to uncover more serious problems, first.
          ./tools/run-mypy --version
          ./tools/run-mypy

      - name: Run miscellaneous tests
        run: |
          source tools/ci/activate-venv
          uv lock --check

          # ./tools/test-run-dev  # https://github.com/zulip/zulip/pull/14233
          #
          # This test has been persistently flaky at like 1% frequency, is slow,
          # and is for a very specific single feature, so we don't run it by default:
          # ./tools/test-queue-worker-reload

          ./tools/test-migrations
          ./tools/setup/optimize-svg --check
          ./tools/setup/generate_integration_bots_avatars.py --check-missing
          ./tools/ci/check-executables

          # Ban check-database-compatibility from transitively
          # relying on static/generated, because it might not be
          # up-to-date at that point in upgrade-zulip-stage-2.
          chmod 000 static/generated web/generated
          ./scripts/lib/check-database-compatibility
          chmod 755 static/generated web/generated

      - name: Check for untracked files
        run: |
          source tools/ci/activate-venv
          # This final check looks for untracked files that may have been
          # created by test-backend or provision.
          untracked="$(git ls-files --exclude-standard --others)"
          if [ -n "$untracked" ]; then
              printf >&2 "Error: untracked files:\n%s\n" "$untracked"
              exit 1
          fi

      - name: Upload coverage reports

        # Only upload coverage when both frontend and backend
        # tests are run.
        if: ${{ matrix.include_frontend_tests }}
        uses: codecov/codecov-action@v5
        with:
          files: var/coverage.xml,var/node-coverage/lcov.info
          token: ${{ secrets.CODECOV_TOKEN }}

      - name: Store Puppeteer artifacts
        # Upload these on failure, as well
        if: ${{ always() && matrix.include_frontend_tests }}
        uses: actions/upload-artifact@v5
        with:
          name: puppeteer
          path: ./var/puppeteer
          retention-days: 60

      - name: Check development database build
        run: ./tools/ci/setup-backend

      - name: Verify pnpm store path
        run: |
          set -x
          path="$(pnpm store path)"
          [[ "$path" == /__w/.pnpm-store/* ]]

      - name: Minimize uv cache
        run: uv cache prune --ci

      - name: Generate failure report string
        id: failure_report_string
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        run: tools/ci/generate-failure-message >> $GITHUB_OUTPUT

      - name: Report status to CZO
        if: ${{ failure() && github.repository == 'zulip/zulip' && github.event_name == 'push' }}
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "automated testing"
          topic: ${{ steps.failure_report_string.outputs.topic }}
          type: "stream"
          content: ${{ steps.failure_report_string.outputs.content }}
```

--------------------------------------------------------------------------------

---[FILE: zulip-cloud-deploy.yaml]---
Location: zulip-main/.github/workflows/zulip-cloud-deploy.yaml

```yaml
name: Notify of issues resolved in latest Zulip Cloud deploy

on:
  push:
    branches:
      - zulip-cloud-current
  workflow_dispatch:
    inputs:
      before:
        description: "Old commit-ish"
        required: true
      after:
        description: "New commit-ish"
        required: true
      stream:
        description: "Stream to send to"
        default: "zulip cloud"
      topic:
        description: "Topic to send to"
        default: "latest deploy"

permissions:
  contents: read
  issues: read
  pull-requests: read

jobs:
  build-messages:
    runs-on: ubuntu-latest
    outputs:
      filenames: ${{ steps.set-matrix.outputs.filenames }}
    steps:
      - name: Check out repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.x"

      - name: Install uv
        run: |
          ./scripts/lib/install-uv

      - name: Generate list of resolved issues
        id: generate
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BASE: ${{ inputs.before || github.event.before }}
          HEAD: ${{ inputs.after || github.event.after }}
        run: |
          set -o pipefail

          mkdir closed-by-commits-output
          ./tools/closed-by-commits "$BASE" "$HEAD" \
            | perl -ple 'undef $/;s/\n\n/\x00/g' \
            | split -t '\0' -C 8000 -d - closed-by-commits-output/message-
          perl -pi -e 's/\00/\n\n/g' closed-by-commits-output/message-*

      - name: Upload messages as artifacts
        uses: actions/upload-artifact@v5
        with:
          name: closed-by-commits-output
          path: closed-by-commits-output/

      - name: Store filename list for matrix
        id: set-matrix
        run: |
          cd closed-by-commits-output/
          echo "filenames=$(ls | jq -Rnc '[inputs]')" >> $GITHUB_OUTPUT

  send-messages:
    needs: build-messages
    runs-on: ubuntu-latest
    strategy:
      max-parallel: 1
      matrix:
        filename: ${{ fromJson(needs.build-messages.outputs.filenames) }}
    if: ${{ success() && github.repository == 'zulip/zulip' }}
    steps:
      - name: Download messages as artifacts
        uses: actions/download-artifact@v6
        with:
          name: closed-by-commits-output
          path: closed-by-commits-output/

      - name: Read message contents
        id: read-file
        run: |
          echo "content<<EOF" >> $GITHUB_OUTPUT
          cat "closed-by-commits-output/$FILENAME" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT
        env:
          FILENAME: ${{ matrix.filename }}

      - name: Send to Zulip
        uses: zulip/github-actions-zulip/send-message@v1
        with:
          api-key: ${{ secrets.ZULIP_BOT_KEY }}
          email: "github-actions-bot@chat.zulip.org"
          organization-url: "https://chat.zulip.org"
          to: "${{ inputs.stream || 'zulip cloud' }}"
          topic: "${{ inputs.topic || 'latest deploy' }}"
          type: "stream"
          content: ${{ steps.read-file.outputs.content }}
```

--------------------------------------------------------------------------------

````
