---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 7
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 7 of 867)

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

---[FILE: comment-label-update.yml]---
Location: prowler-master/.github/workflows/comment-label-update.yml

```yaml
name: 'Tools: Comment Label Update'

on:
  issue_comment:
    types:
      - 'created'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.issue.number }}
  cancel-in-progress: false

jobs:
  update-labels:
    if: contains(github.event.issue.labels.*.name, 'status/awaiting-response')
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      issues: write
      pull-requests: write

    steps:
      - name: Remove 'status/awaiting-response' label
        env:
          GH_TOKEN: ${{ github.token }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
        run: |
          echo "Removing 'status/awaiting-response' label from #$ISSUE_NUMBER"
          gh api /repos/${{ github.repository }}/issues/$ISSUE_NUMBER/labels/status%2Fawaiting-response \
            -X DELETE

      - name: Add 'status/waiting-for-revision' label
        env:
          GH_TOKEN: ${{ github.token }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
        run: |
          echo "Adding 'status/waiting-for-revision' label to #$ISSUE_NUMBER"
          gh api /repos/${{ github.repository }}/issues/$ISSUE_NUMBER/labels \
            -X POST \
            -f labels[]='status/waiting-for-revision'
```

--------------------------------------------------------------------------------

---[FILE: conventional-commit.yml]---
Location: prowler-master/.github/workflows/conventional-commit.yml

```yaml
name: 'Tools: Conventional Commit'

on:
  pull_request:
    branches:
      - 'master'
      - 'v3'
      - 'v4.*'
      - 'v5.*'
    types:
      - 'opened'
      - 'edited'
      - 'synchronize'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  conventional-commit-check:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: read

    steps:
      - name: Check PR title format
        uses: agenthunt/conventional-commit-checker-action@f1823f632e95a64547566dcd2c7da920e67117ad # v2.0.1
        with:
          pr-title-regex: '^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\([^)]+\))?!?: .+'
```

--------------------------------------------------------------------------------

---[FILE: create-backport-label.yml]---
Location: prowler-master/.github/workflows/create-backport-label.yml

```yaml
name: 'Tools: Backport Label'

on:
  release:
    types:
      - 'published'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.release.tag_name }}
  cancel-in-progress: false

env:
  BACKPORT_LABEL_PREFIX: backport-to-
  BACKPORT_LABEL_COLOR: B60205

jobs:
  create-label:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      issues: write

    steps:
      - name: Create backport label for minor releases
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          RELEASE_TAG="${{ github.event.release.tag_name }}"

          if [ -z "$RELEASE_TAG" ]; then
            echo "Error: No release tag provided"
            exit 1
          fi

          echo "Processing release tag: $RELEASE_TAG"

          # Remove 'v' prefix if present (e.g., v3.2.0 -> 3.2.0)
          VERSION_ONLY="${RELEASE_TAG#v}"

          # Check if it's a minor version (X.Y.0)
          if [[ "$VERSION_ONLY" =~ ^([0-9]+)\.([0-9]+)\.0$ ]]; then
            echo "Release $RELEASE_TAG (version $VERSION_ONLY) is a minor version. Proceeding to create backport label."

            # Extract X.Y from X.Y.0 (e.g., 5.6 from 5.6.0)
            MAJOR="${BASH_REMATCH[1]}"
            MINOR="${BASH_REMATCH[2]}"
            TWO_DIGIT_VERSION="${MAJOR}.${MINOR}"

            LABEL_NAME="${BACKPORT_LABEL_PREFIX}v${TWO_DIGIT_VERSION}"
            LABEL_DESC="Backport PR to the v${TWO_DIGIT_VERSION} branch"
            LABEL_COLOR="$BACKPORT_LABEL_COLOR"

            echo "Label name: $LABEL_NAME"
            echo "Label description: $LABEL_DESC"

            # Check if label already exists
            if gh label list --repo ${{ github.repository }} --limit 1000 | grep -q "^${LABEL_NAME}[[:space:]]"; then
              echo "Label '$LABEL_NAME' already exists."
            else
              echo "Label '$LABEL_NAME' does not exist. Creating it..."
              gh label create "$LABEL_NAME" \
                --description "$LABEL_DESC" \
                --color "$LABEL_COLOR" \
                --repo ${{ github.repository }}
              echo "Label '$LABEL_NAME' created successfully."
            fi
          else
            echo "Release $RELEASE_TAG (version $VERSION_ONLY) is not a minor version. Skipping backport label creation."
          fi
```

--------------------------------------------------------------------------------

---[FILE: find-secrets.yml]---
Location: prowler-master/.github/workflows/find-secrets.yml

```yaml
name: 'Tools: TruffleHog'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  scan-secrets:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          fetch-depth: 0

      - name: Scan for secrets with TruffleHog
        uses: trufflesecurity/trufflehog@b84c3d14d189e16da175e2c27fa8136603783ffc # v3.90.12
        with:
          extra_args: '--results=verified,unknown'
```

--------------------------------------------------------------------------------

---[FILE: labeler.yml]---
Location: prowler-master/.github/workflows/labeler.yml

```yaml
name: 'Tools: PR Labeler'

on:
  pull_request_target:
    branches:
      - 'master'
      - 'v5.*'
    types:
      - 'opened'
      - 'reopened'
      - 'synchronize'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  labeler:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Apply labels to PR
        uses: actions/labeler@634933edcd8ababfe52f92936142cc22ac488b1b # v6.0.1
        with:
          sync-labels: true

  label-community:
    name: Add 'community' label if the PR is from a community contributor
    needs: labeler
    if: github.repository == 'prowler-cloud/prowler' && github.event.action == 'opened'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - name: Check if author is org member
        id: check_membership
        env:
          AUTHOR: ${{ github.event.pull_request.user.login }}
        run: |
          # Hardcoded list of prowler-cloud organization members
          # This list includes members who have set their organization membership as private
          ORG_MEMBERS=(
            "AdriiiPRodri"
            "Alan-TheGentleman"
            "alejandrobailo"
            "amitsharm"
            "andoniaf"
            "cesararroba"
            "Chan9390"
            "danibarranqueroo"
            "HugoPBrito"
            "jfagoagas"
            "josemazo"
            "lydiavilchez"
            "mmuller88"
            "MrCloudSec"
            "pedrooot"
            "prowler-bot"
            "puchy22"
            "rakan-pro"
            "RosaRivasProwler"
            "StylusFrost"
            "toniblyx"
            "vicferpoy"
          )

          echo "Checking if $AUTHOR is a member of prowler-cloud organization"

          # Check if author is in the org members list
          if printf '%s\n' "${ORG_MEMBERS[@]}" | grep -q "^${AUTHOR}$"; then
            echo "is_member=true" >> $GITHUB_OUTPUT
            echo "$AUTHOR is an organization member"
          else
            echo "is_member=false" >> $GITHUB_OUTPUT
            echo "$AUTHOR is not an organization member"
          fi

      - name: Add community label
        if: steps.check_membership.outputs.is_member == 'false'
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
          GH_TOKEN: ${{ github.token }}
        run: |
          echo "Adding 'community' label to PR #$PR_NUMBER"
          gh api /repos/${{ github.repository }}/issues/${{ github.event.number }}/labels \
            -X POST \
            -f labels[]='community'
```

--------------------------------------------------------------------------------

---[FILE: mcp-container-build-push.yml]---
Location: prowler-master/.github/workflows/mcp-container-build-push.yml
Signals: Docker

```yaml
name: 'MCP: Container Build and Push'

on:
  push:
    branches:
      - 'master'
    paths:
      - 'mcp_server/**'
      - '.github/workflows/mcp-container-build-push.yml'
  release:
    types:
      - 'published'
  workflow_dispatch:
    inputs:
      release_tag:
        description: 'Release tag (e.g., 5.14.0)'
        required: true
        type: string

permissions:
  contents: read

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

env:
  # Tags
  LATEST_TAG: latest
  RELEASE_TAG: ${{ github.event.release.tag_name || inputs.release_tag }}
  STABLE_TAG: stable
  WORKING_DIRECTORY: ./mcp_server

  # Container registries
  PROWLERCLOUD_DOCKERHUB_REPOSITORY: prowlercloud
  PROWLERCLOUD_DOCKERHUB_IMAGE: prowler-mcp

jobs:
  setup:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    outputs:
      short-sha: ${{ steps.set-short-sha.outputs.short-sha }}
    steps:
      - name: Calculate short SHA
        id: set-short-sha
        run: echo "short-sha=${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

  notify-release-started:
    if: github.repository == 'prowler-cloud/prowler' && (github.event_name == 'release' || github.event_name == 'workflow_dispatch')
    needs: setup
    runs-on: ubuntu-latest
    timeout-minutes: 5
    outputs:
      message-ts: ${{ steps.slack-notification.outputs.ts }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Notify container push started
        id: slack-notification
        uses: ./.github/actions/slack-notification
        env:
          SLACK_CHANNEL_ID: ${{ secrets.SLACK_PLATFORM_DEPLOYMENTS }}
          COMPONENT: MCP
          RELEASE_TAG: ${{ env.RELEASE_TAG }}
          GITHUB_SERVER_URL: ${{ github.server_url }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          GITHUB_RUN_ID: ${{ github.run_id }}
        with:
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          payload-file-path: "./.github/scripts/slack-messages/container-release-started.json"

  container-build-push:
    needs: [setup, notify-release-started]
    if: always() && needs.setup.result == 'success' && (needs.notify-release-started.result == 'success' || needs.notify-release-started.result == 'skipped')
    runs-on: ${{ matrix.runner }}
    strategy:
      matrix:
        include:
          - platform: linux/amd64
            runner: ubuntu-latest
            arch: amd64
          - platform: linux/arm64
            runner: ubuntu-24.04-arm
            arch: arm64
    timeout-minutes: 30
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Login to DockerHub
        uses: docker/login-action@5e57cd118135c172c3672efd75eb46360885c0ef # v3.6.0
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build and push MCP container for ${{ matrix.arch }}
        id: container-push
        if: github.event_name == 'push' || github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.WORKING_DIRECTORY }}
          push: true
          platforms: ${{ matrix.platform }}
          tags: |
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-${{ matrix.arch }}
          labels: |
            org.opencontainers.image.title=Prowler MCP Server
            org.opencontainers.image.description=Model Context Protocol server for Prowler
            org.opencontainers.image.vendor=ProwlerPro, Inc.
            org.opencontainers.image.source=https://github.com/${{ github.repository }}
            org.opencontainers.image.revision=${{ github.sha }}
            org.opencontainers.image.created=${{ github.event_name == 'release' && github.event.release.published_at || github.event.head_commit.timestamp }}
            ${{ github.event_name == 'release' && format('org.opencontainers.image.version={0}', env.RELEASE_TAG) || '' }}
          cache-from: type=gha,scope=${{ matrix.arch }}
          cache-to: type=gha,mode=max,scope=${{ matrix.arch }}

  # Create and push multi-architecture manifest
  create-manifest:
    needs: [setup, container-build-push]
    if: github.event_name == 'push' || github.event_name == 'release' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest

    steps:
      - name: Login to DockerHub
        uses: docker/login-action@74a5d142397b4f367a81961eba4e8cd7edddf772 # v3.4.0
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Create and push manifests for push event
        if: github.event_name == 'push'
        run: |
          docker buildx imagetools create \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ env.LATEST_TAG }} \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }} \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-amd64 \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-arm64

      - name: Create and push manifests for release event
        if: github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        run: |
          docker buildx imagetools create \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ env.RELEASE_TAG }} \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ env.STABLE_TAG }} \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-amd64 \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-arm64

      - name: Install regctl
        if: always()
        uses: regclient/actions/regctl-installer@main

      - name: Cleanup intermediate architecture tags
        if: always()
        run: |
          echo "Cleaning up intermediate tags..."
          regctl tag delete "${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-amd64" || true
          regctl tag delete "${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-arm64" || true
          echo "Cleanup completed"

  notify-release-completed:
    if: always() && needs.notify-release-started.result == 'success' && (github.event_name == 'release' || github.event_name == 'workflow_dispatch')
    needs: [setup, notify-release-started, container-build-push, create-manifest]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Determine overall outcome
        id: outcome
        run: |
          if [[ "${{ needs.container-build-push.result }}" == "success" && "${{ needs.create-manifest.result }}" == "success" ]]; then
            echo "outcome=success" >> $GITHUB_OUTPUT
          else
            echo "outcome=failure" >> $GITHUB_OUTPUT
          fi

      - name: Notify container push completed
        uses: ./.github/actions/slack-notification
        env:
          SLACK_CHANNEL_ID: ${{ secrets.SLACK_PLATFORM_DEPLOYMENTS }}
          MESSAGE_TS: ${{ needs.notify-release-started.outputs.message-ts }}
          COMPONENT: MCP
          RELEASE_TAG: ${{ env.RELEASE_TAG }}
          GITHUB_SERVER_URL: ${{ github.server_url }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          GITHUB_RUN_ID: ${{ github.run_id }}
        with:
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          payload-file-path: "./.github/scripts/slack-messages/container-release-completed.json"
          step-outcome: ${{ steps.outcome.outputs.outcome }}
          update-ts: ${{ needs.notify-release-started.outputs.message-ts }}

  trigger-deployment:
    if: github.event_name == 'push'
    needs: [setup, container-build-push]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read

    steps:
      - name: Trigger MCP deployment
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.CLOUD_DISPATCH }}
          event-type: mcp-prowler-deployment
          client-payload: '{"sha": "${{ github.sha }}", "short_sha": "${{ needs.setup.outputs.short-sha }}"}'
```

--------------------------------------------------------------------------------

---[FILE: mcp-container-checks.yml]---
Location: prowler-master/.github/workflows/mcp-container-checks.yml
Signals: Docker

```yaml
name: 'MCP: Container Checks'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  MCP_WORKING_DIR: ./mcp_server
  IMAGE_NAME: prowler-mcp

jobs:
  mcp-dockerfile-lint:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check if Dockerfile changed
        id: dockerfile-changed
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: mcp_server/Dockerfile

      - name: Lint Dockerfile with Hadolint
        if: steps.dockerfile-changed.outputs.any_changed == 'true'
        uses: hadolint/hadolint-action@2332a7b74a6de0dda2e2221d575162eba76ba5e5 # v3.3.0
        with:
          dockerfile: mcp_server/Dockerfile

  mcp-container-build-and-scan:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ${{ matrix.runner }}
    strategy:
      matrix:
        include:
          - platform: linux/amd64
            runner: ubuntu-latest
            arch: amd64
          - platform: linux/arm64
            runner: ubuntu-24.04-arm
            arch: arm64
    timeout-minutes: 30
    permissions:
      contents: read
      security-events: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for MCP changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: mcp_server/**
          files_ignore: |
            mcp_server/README.md
            mcp_server/CHANGELOG.md

      - name: Set up Docker Buildx
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build MCP container for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.MCP_WORKING_DIR }}
          push: false
          load: true
          platforms: ${{ matrix.platform }}
          tags: ${{ env.IMAGE_NAME }}:${{ github.sha }}-${{ matrix.arch }}
          cache-from: type=gha,scope=${{ matrix.arch }}
          cache-to: type=gha,mode=max,scope=${{ matrix.arch }}

      - name: Scan MCP container with Trivy for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/trivy-scan
        with:
          image-name: ${{ env.IMAGE_NAME }}
          image-tag: ${{ github.sha }}-${{ matrix.arch }}
          fail-on-critical: 'false'
          severity: 'CRITICAL'
```

--------------------------------------------------------------------------------

---[FILE: pr-check-changelog.yml]---
Location: prowler-master/.github/workflows/pr-check-changelog.yml

```yaml
name: 'Tools: Check Changelog'

on:
  pull_request:
    types:
      - 'opened'
      - 'synchronize'
      - 'reopened'
      - 'labeled'
      - 'unlabeled'
    branches:
      - 'master'
      - 'v5.*'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  check-changelog:
    if: contains(github.event.pull_request.labels.*.name, 'no-changelog') == false
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
    env:
      MONITORED_FOLDERS: 'api ui prowler mcp_server'

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          fetch-depth: 0

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            api/**
            ui/**
            prowler/**
            mcp_server/**

      - name: Check for folder changes and changelog presence
        id: check-folders
        run: |
          missing_changelogs=""

          # Check api folder
          if [[ "${{ steps.changed-files.outputs.any_changed }}" == "true" ]]; then
            for folder in $MONITORED_FOLDERS; do
              # Get files changed in this folder
              changed_in_folder=$(echo "${{ steps.changed-files.outputs.all_changed_files }}" | tr ' ' '\n' | grep "^${folder}/" || true)

              if [ -n "$changed_in_folder" ]; then
                echo "Detected changes in ${folder}/"

                # Check if CHANGELOG.md was updated
                if ! echo "$changed_in_folder" | grep -q "^${folder}/CHANGELOG.md$"; then
                  echo "No changelog update found for ${folder}/"
                  missing_changelogs="${missing_changelogs}- \`${folder}\`"$'\n'
                fi
              fi
            done
          fi

          {
            echo "missing_changelogs<<EOF"
            echo -e "${missing_changelogs}"
            echo "EOF"
          } >> $GITHUB_OUTPUT

      - name: Find existing changelog comment
        if: github.event.pull_request.head.repo.full_name == github.repository
        id: find-comment
        uses: peter-evans/find-comment@b30e6a3c0ed37e7c023ccd3f1db5c6c0b0c23aad # v4.0.0
        with:
          issue-number: ${{ github.event.pull_request.number }}
          comment-author: 'github-actions[bot]'
          body-includes: '<!-- changelog-check -->'

      - name: Update PR comment with changelog status
        if: github.event.pull_request.head.repo.full_name == github.repository
        uses: peter-evans/create-or-update-comment@e8674b075228eee787fea43ef493e45ece1004c9 # v5.0.0
        with:
          issue-number: ${{ github.event.pull_request.number }}
          comment-id: ${{ steps.find-comment.outputs.comment-id }}
          edit-mode: replace
          body: |
            <!-- changelog-check -->
            ${{ steps.check-folders.outputs.missing_changelogs != '' && format('⚠️ **Changes detected in the following folders without a corresponding update to the `CHANGELOG.md`:**

            {0}

            Please add an entry to the corresponding `CHANGELOG.md` file to maintain a clear history of changes.', steps.check-folders.outputs.missing_changelogs) || '✅ All necessary `CHANGELOG.md` files have been updated.' }}

      - name: Fail if changelog is missing
        if: steps.check-folders.outputs.missing_changelogs != ''
        run: |
          echo "::error::Missing changelog updates in some folders"
          exit 1
```

--------------------------------------------------------------------------------

---[FILE: pr-conflict-checker.yml]---
Location: prowler-master/.github/workflows/pr-conflict-checker.yml

```yaml
name: 'Tools: PR Conflict Checker'

on:
  pull_request_target:
    types:
      - 'opened'
      - 'synchronize'
      - 'reopened'
    branches:
      - 'master'
      - 'v5.*'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  check-conflicts:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - name: Checkout PR head
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          ref: ${{ github.event.pull_request.head.sha }}
          fetch-depth: 0

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: '**'

      - name: Check for conflict markers
        id: conflict-check
        run: |
          echo "Checking for conflict markers in changed files..."

          CONFLICT_FILES=""
          HAS_CONFLICTS=false

          # Check each changed file for conflict markers
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            if [ -f "$file" ]; then
              echo "Checking file: $file"

              # Look for conflict markers (more precise regex)
              if grep -qE '^(<<<<<<<|=======|>>>>>>>)' "$file" 2>/dev/null; then
                echo "Conflict markers found in: $file"
                CONFLICT_FILES="${CONFLICT_FILES}- \`${file}\`"$'\n'
                HAS_CONFLICTS=true
              fi
            fi
          done

          if [ "$HAS_CONFLICTS" = true ]; then
            echo "has_conflicts=true" >> $GITHUB_OUTPUT
            {
              echo "conflict_files<<EOF"
              echo "$CONFLICT_FILES"
              echo "EOF"
            } >> $GITHUB_OUTPUT
            echo "Conflict markers detected"
          else
            echo "has_conflicts=false" >> $GITHUB_OUTPUT
            echo "No conflict markers found in changed files"
          fi

      - name: Manage conflict label
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          HAS_CONFLICTS: ${{ steps.conflict-check.outputs.has_conflicts }}
        run: |
          LABEL_NAME="has-conflicts"

          # Add or remove label based on conflict status
          if [ "$HAS_CONFLICTS" = "true" ]; then
            echo "Adding conflict label to PR #${PR_NUMBER}..."
            gh pr edit "$PR_NUMBER" --add-label "$LABEL_NAME" --repo ${{ github.repository }} || true
          else
            echo "Removing conflict label from PR #${PR_NUMBER}..."
            gh pr edit "$PR_NUMBER" --remove-label "$LABEL_NAME" --repo ${{ github.repository }} || true
          fi

      - name: Find existing comment
        uses: peter-evans/find-comment@b30e6a3c0ed37e7c023ccd3f1db5c6c0b0c23aad # v4.0.0
        id: find-comment
        with:
          issue-number: ${{ github.event.pull_request.number }}
          comment-author: 'github-actions[bot]'
          body-includes: '<!-- conflict-checker-comment -->'

      - name: Create or update comment
        uses: peter-evans/create-or-update-comment@e8674b075228eee787fea43ef493e45ece1004c9 # v5.0.0
        with:
          comment-id: ${{ steps.find-comment.outputs.comment-id }}
          issue-number: ${{ github.event.pull_request.number }}
          edit-mode: replace
          body: |
            <!-- conflict-checker-comment -->
            ${{ steps.conflict-check.outputs.has_conflicts == 'true' && '⚠️ **Conflict Markers Detected**' || '✅ **Conflict Markers Resolved**' }}

            ${{ steps.conflict-check.outputs.has_conflicts == 'true' && format('This pull request contains unresolved conflict markers in the following files:

            {0}

            Please resolve these conflicts by:
            1. Locating the conflict markers: `<<<<<<<`, `=======`, and `>>>>>>>`
            2. Manually editing the files to resolve the conflicts
            3. Removing all conflict markers
            4. Committing and pushing the changes', steps.conflict-check.outputs.conflict_files) || 'All conflict markers have been successfully resolved in this pull request.' }}

      - name: Fail workflow if conflicts detected
        if: steps.conflict-check.outputs.has_conflicts == 'true'
        run: |
          echo "::error::Workflow failed due to conflict markers detected in the PR"
          exit 1
```

--------------------------------------------------------------------------------

---[FILE: pr-merged.yml]---
Location: prowler-master/.github/workflows/pr-merged.yml

```yaml
name: 'Tools: PR Merged'

on:
  pull_request_target:
    branches:
      - 'master'
    types:
      - 'closed'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: false

jobs:
  trigger-cloud-pull-request:
    if: github.event.pull_request.merged == true && github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    steps:
      - name: Calculate short commit SHA
        id: vars
        run: |
          SHORT_SHA="${{ github.event.pull_request.merge_commit_sha }}"
          echo "SHORT_SHA=${SHORT_SHA::7}" >> $GITHUB_ENV

      - name: Trigger Cloud repository pull request
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.CLOUD_DISPATCH }}
          event-type: prowler-pull-request-merged
          client-payload: |
            {
              "PROWLER_COMMIT_SHA": "${{ github.event.pull_request.merge_commit_sha }}",
              "PROWLER_COMMIT_SHORT_SHA": "${{ env.SHORT_SHA }}",
              "PROWLER_PR_NUMBER": "${{ github.event.pull_request.number }}",
              "PROWLER_PR_TITLE": ${{ toJson(github.event.pull_request.title) }},
              "PROWLER_PR_LABELS": ${{ toJson(github.event.pull_request.labels.*.name) }},
              "PROWLER_PR_BODY": ${{ toJson(github.event.pull_request.body) }},
              "PROWLER_PR_URL": ${{ toJson(github.event.pull_request.html_url) }},
              "PROWLER_PR_MERGED_BY": "${{ github.event.pull_request.merged_by.login }}",
              "PROWLER_PR_BASE_BRANCH": "${{ github.event.pull_request.base.ref }}",
              "PROWLER_PR_HEAD_BRANCH": "${{ github.event.pull_request.head.ref }}"
            }
```

--------------------------------------------------------------------------------

````
