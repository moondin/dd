---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 6
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 6 of 867)

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

---[FILE: README.md]---
Location: prowler-master/.github/scripts/slack-messages/README.md

```text
# Slack Message Templates

This directory contains reusable message templates for Slack notifications sent from GitHub Actions workflows.

## Usage

These JSON templates are used with the `slackapi/slack-github-action` using the Slack API method (`chat.postMessage` and `chat.update`). All templates support rich Block Kit formatting and message updates.

### Available Templates

**Container Releases**
- `container-release-started.json`: Simple one-line notification when container push starts
- `container-release-completed.json`: Simple one-line notification when container release completes

**Deployments**
- `deployment-started.json`: Deployment start notification with Block Kit formatting
- `deployment-completed.json`: Deployment completion notification (updates the start message)

All templates use the Slack API method and require a Slack Bot Token.

## Setup Requirements

1. Create a Slack App (or use existing)
2. Add Bot Token Scopes: `chat:write`, `chat:write.public`
3. Install the app to your workspace
4. Get the Bot Token from OAuth & Permissions page
5. Add secrets:
   - `SLACK_BOT_TOKEN`: Your bot token
   - `SLACK_CHANNEL_ID`: The channel ID where messages will be posted

Reference: [Sending data using a Slack API method](https://docs.slack.dev/tools/slack-github-action/sending-techniques/sending-data-slack-api-method/)

## Environment Variables

### Required Secrets (GitHub Secrets)
- `SLACK_BOT_TOKEN`: Passed as `token` parameter to the action (not as env variable)
- `SLACK_CHANNEL_ID`: Used in payload as env variable

### Container Release Variables (configured as env)
- `COMPONENT`: Component name (e.g., "API", "SDK", "UI", "MCP")
- `RELEASE_TAG` / `PROWLER_VERSION`: The release tag or version being deployed
- `GITHUB_SERVER_URL`: Provided by GitHub context
- `GITHUB_REPOSITORY`: Provided by GitHub context
- `GITHUB_RUN_ID`: Provided by GitHub context
- `STATUS_EMOJI`: Status symbol (calculated: `[✓]` for success, `[✗]` for failure)
- `STATUS_TEXT`: Status text (calculated: "completed successfully!" or "failed")

### Deployment Variables (configured as env)
- `COMPONENT`: Component name (e.g., "API", "SDK", "UI", "MCP")
- `ENVIRONMENT`: Environment name (e.g., "DEVELOPMENT", "PRODUCTION")
- `COMMIT_HASH`: Commit hash being deployed
- `VERSION_DEPLOYED`: Version being deployed
- `GITHUB_ACTOR`: User who triggered the workflow
- `GITHUB_WORKFLOW`: Workflow name
- `GITHUB_SERVER_URL`: Provided by GitHub context
- `GITHUB_REPOSITORY`: Provided by GitHub context
- `GITHUB_RUN_ID`: Provided by GitHub context

All other variables (MESSAGE_TS, STATUS, STATUS_COLOR, STATUS_EMOJI, etc.) are calculated internally within the workflow and should NOT be configured as environment variables.

## Example Workflow Usage

### Using the Generic Slack Notification Action (Recommended)

**Recommended approach**: Use the generic reusable action `.github/actions/slack-notification` which provides maximum flexibility:

#### Example 1: Container Release (Start + Completion)

```yaml
# Send start notification
- name: Notify container push started
  if: github.event_name == 'release'
  uses: ./.github/actions/slack-notification
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload: |
      {
        "channel": "${{ secrets.SLACK_CHANNEL_ID }}",
        "text": "API container release ${{ env.RELEASE_TAG }} push started... <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View run>"
      }

# Build and push container
- name: Build and push container
  if: github.event_name == 'release'
  id: container-push
  uses: docker/build-push-action@...
  with:
    push: true
    tags: ...

# Calculate status
- name: Determine push status
  if: github.event_name == 'release' && always()
  id: push-status
  run: |
    if [[ "${{ steps.container-push.outcome }}" == "success" ]]; then
      echo "emoji=[✓]" >> $GITHUB_OUTPUT
      echo "text=completed successfully!" >> $GITHUB_OUTPUT
    else
      echo "emoji=[✗]" >> $GITHUB_OUTPUT
      echo "text=failed" >> $GITHUB_OUTPUT
    fi

# Send completion notification
- name: Notify container push completed
  if: github.event_name == 'release' && always()
  uses: ./.github/actions/slack-notification
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload: |
      {
        "channel": "${{ secrets.SLACK_CHANNEL_ID }}",
        "text": "${{ steps.push-status.outputs.emoji }} API container release ${{ env.RELEASE_TAG }} push ${{ steps.push-status.outputs.text }} <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View run>"
      }
```

#### Example 2: Simple One-Time Message

```yaml
- name: Send notification
  uses: ./.github/actions/slack-notification
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload: |
      {
        "channel": "${{ secrets.SLACK_CHANNEL_ID }}",
        "text": "Deployment completed successfully!"
      }
```

#### Example 3: Deployment with Message Update Pattern

```yaml
# Send initial deployment message
- name: Notify deployment started
  id: slack-start
  uses: ./.github/actions/slack-notification
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload: |
      {
        "channel": "${{ secrets.SLACK_CHANNEL_ID }}",
        "text": "API deployment to PRODUCTION started",
        "attachments": [
          {
            "color": "dbab09",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "API | Deployment to PRODUCTION"
                }
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Status:*\nIn Progress"
                  }
                ]
              }
            ]
          }
        ]
      }

# Run deployment
- name: Deploy
  id: deploy
  run: terraform apply -auto-approve

# Calculate status
- name: Determine status
  if: always()
  id: status
  run: |
    if [[ "${{ steps.deploy.outcome }}" == "success" ]]; then
      echo "color=28a745" >> $GITHUB_OUTPUT
      echo "emoji=[✓]" >> $GITHUB_OUTPUT
      echo "status=Completed" >> $GITHUB_OUTPUT
    else
      echo "color=fc3434" >> $GITHUB_OUTPUT
      echo "emoji=[✗]" >> $GITHUB_OUTPUT
      echo "status=Failed" >> $GITHUB_OUTPUT
    fi

# Update the same message with final status
- name: Update deployment notification
  if: always()
  uses: ./.github/actions/slack-notification
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    update-ts: ${{ steps.slack-start.outputs.ts }}
    payload: |
      {
        "channel": "${{ secrets.SLACK_CHANNEL_ID }}",
        "ts": "${{ steps.slack-start.outputs.ts }}",
        "text": "${{ steps.status.outputs.emoji }} API deployment to PRODUCTION ${{ steps.status.outputs.status }}",
        "attachments": [
          {
            "color": "${{ steps.status.outputs.color }}",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "API | Deployment to PRODUCTION"
                }
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Status:*\n${{ steps.status.outputs.emoji }} ${{ steps.status.outputs.status }}"
                  }
                ]
              }
            ]
          }
        ]
      }
```

**Benefits of using the generic action:**
- Maximum flexibility: Build any payload you need directly in the workflow
- No template files needed: Everything inline
- Supports all scenarios: one-time messages, start/update patterns, rich Block Kit
- Easy to customize per use case
- Generic: Works for containers, deployments, or any notification type

For more details, see [Slack Notification Action](../../actions/slack-notification/README.md).

### Using Message Templates (Alternative Approach)

Simple one-line notifications for container releases:

```yaml
# Step 1: Notify when push starts
- name: Notify container push started
  if: github.event_name == 'release'
  uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    COMPONENT: API
    RELEASE_TAG: ${{ env.RELEASE_TAG }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
  with:
    method: chat.postMessage
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/container-release-started.json"

# Step 2: Build and push container
- name: Build and push container
  id: container-push
  uses: docker/build-push-action@...
  with:
    push: true
    tags: ...

# Step 3: Determine push status
- name: Determine push status
  if: github.event_name == 'release' && always()
  id: push-status
  run: |
    if [[ "${{ steps.container-push.outcome }}" == "success" ]]; then
      echo "status-emoji=[✓]" >> $GITHUB_OUTPUT
      echo "status-text=completed successfully!" >> $GITHUB_OUTPUT
    else
      echo "status-emoji=[✗]" >> $GITHUB_OUTPUT
      echo "status-text=failed" >> $GITHUB_OUTPUT
    fi

# Step 4: Notify when push completes (success or failure)
- name: Notify container push completed
  if: github.event_name == 'release' && always()
  uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    COMPONENT: API
    RELEASE_TAG: ${{ env.RELEASE_TAG }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
    STATUS_EMOJI: ${{ steps.push-status.outputs.status-emoji }}
    STATUS_TEXT: ${{ steps.push-status.outputs.status-text }}
  with:
    method: chat.postMessage
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/container-release-completed.json"
```

### Deployment with Update Pattern

For deployments that start with one message and update it with the final status:

```yaml
# Step 1: Send deployment start notification
- name: Notify Deployment Start
  id: slack-notification-start
  uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    COMPONENT: API
    ENVIRONMENT: PRODUCTION
    COMMIT_HASH: ${{ github.sha }}
    VERSION_DEPLOYED: latest
    GITHUB_ACTOR: ${{ github.actor }}
    GITHUB_WORKFLOW: ${{ github.workflow }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
  with:
    method: chat.postMessage
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/deployment-started.json"

# Step 2: Run your deployment steps
- name: Terraform Plan
  id: terraform-plan
  run: terraform plan

- name: Terraform Apply
  id: terraform-apply
  run: terraform apply -auto-approve

# Step 3: Determine status (calculated internally, not configured)
- name: Determine Status
  if: always()
  id: determine-status
  run: |
    if [[ "${{ steps.terraform-apply.outcome }}" == "success" ]]; then
      echo "status=Completed" >> $GITHUB_OUTPUT
      echo "status-color=28a745" >> $GITHUB_OUTPUT
      echo "status-emoji=[✓]" >> $GITHUB_OUTPUT
      echo "plan-emoji=[✓]" >> $GITHUB_OUTPUT
      echo "apply-emoji=[✓]" >> $GITHUB_OUTPUT
    elif [[ "${{ steps.terraform-plan.outcome }}" == "failure" || "${{ steps.terraform-apply.outcome }}" == "failure" ]]; then
      echo "status=Failed" >> $GITHUB_OUTPUT
      echo "status-color=fc3434" >> $GITHUB_OUTPUT
      echo "status-emoji=[✗]" >> $GITHUB_OUTPUT
      if [[ "${{ steps.terraform-plan.outcome }}" == "failure" ]]; then
        echo "plan-emoji=[✗]" >> $GITHUB_OUTPUT
      else
        echo "plan-emoji=[✓]" >> $GITHUB_OUTPUT
      fi
      if [[ "${{ steps.terraform-apply.outcome }}" == "failure" ]]; then
        echo "apply-emoji=[✗]" >> $GITHUB_OUTPUT
      else
        echo "apply-emoji=[✓]" >> $GITHUB_OUTPUT
      fi
    else
      echo "status=Failed" >> $GITHUB_OUTPUT
      echo "status-color=fc3434" >> $GITHUB_OUTPUT
      echo "status-emoji=[✗]" >> $GITHUB_OUTPUT
      echo "plan-emoji=[?]" >> $GITHUB_OUTPUT
      echo "apply-emoji=[?]" >> $GITHUB_OUTPUT
    fi

# Step 4: Update the same Slack message (using calculated values)
- name: Notify Deployment Result
  if: always()
  uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    MESSAGE_TS: ${{ steps.slack-notification-start.outputs.ts }}
    COMPONENT: API
    ENVIRONMENT: PRODUCTION
    COMMIT_HASH: ${{ github.sha }}
    VERSION_DEPLOYED: latest
    GITHUB_ACTOR: ${{ github.actor }}
    GITHUB_WORKFLOW: ${{ github.workflow }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
    STATUS: ${{ steps.determine-status.outputs.status }}
    STATUS_COLOR: ${{ steps.determine-status.outputs.status-color }}
    STATUS_EMOJI: ${{ steps.determine-status.outputs.status-emoji }}
    PLAN_EMOJI: ${{ steps.determine-status.outputs.plan-emoji }}
    APPLY_EMOJI: ${{ steps.determine-status.outputs.apply-emoji }}
    TERRAFORM_PLAN_OUTCOME: ${{ steps.terraform-plan.outcome }}
    TERRAFORM_APPLY_OUTCOME: ${{ steps.terraform-apply.outcome }}
  with:
    method: chat.update
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/deployment-completed.json"
```

**Note**: Variables like `STATUS`, `STATUS_COLOR`, `STATUS_EMOJI`, `PLAN_EMOJI`, `APPLY_EMOJI` are calculated by the `determine-status` step based on the outcomes of previous steps. They should NOT be manually configured.

## Key Features

### Benefits of Using Slack API Method

- **Rich Block Kit Formatting**: Full support for Slack's Block Kit including headers, sections, fields, colors, and attachments
- **Message Updates**: Update the same message instead of posting multiple messages (using `chat.update` with `ts`)
- **Consistent Experience**: Same look and feel as Prowler Cloud notifications
- **Flexible**: Easy to customize message appearance by editing JSON templates

### Differences from Webhook Method

| Feature | webhook-trigger | Slack API (chat.postMessage) |
|---------|-----------------|------------------------------|
| Setup | Workflow Builder webhook | Slack Bot Token + Channel ID |
| Formatting | Plain text/simple | Full Block Kit support |
| Message Update | No | Yes (with chat.update) |
| Authentication | Webhook URL | Bot Token |
| Scopes Required | None | chat:write, chat:write.public |

## Message Appearance

### Container Release (Simple One-Line)

**Start message:**
```
API container release 4.5.0 push started... View run
```

**Completion message (success):**
```
[✓] API container release 4.5.0 push completed successfully! View run
```

**Completion message (failure):**
```
[✗] API container release 4.5.0 push failed View run
```

All messages are simple one-liners with a clickable "View run" link. The completion message adapts to show success `[✓]` or failure `[✗]` based on the outcome of the container push.

### Deployment Start
- Header: Component and environment
- Yellow bar (color: `dbab09`)
- Status: In Progress
- Details: Commit, version, actor, workflow
- Link: Direct link to deployment run

### Deployment Completion
- Header: Component and environment
- Green bar for success (color: `28a745`) / Red bar for failure (color: `fc3434`)
- Status: [✓] Completed or [✗] Failed
- Details: All deployment info plus terraform outcomes
- Link: Direct link to deployment run

## Adding New Templates

1. Create a new JSON file with Block Kit structure
2. Use environment variable placeholders (e.g., `$VAR_NAME`)
3. Include `channel` and `text` fields (required)
4. Add `blocks` or `attachments` for rich formatting
5. For update templates, include `ts` field as `$MESSAGE_TS`
6. Document the template in this README
7. Reference it in your workflow using `payload-file-path`

## Reference

- [Slack Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Slack API Method Documentation](https://docs.slack.dev/tools/slack-github-action/sending-techniques/sending-data-slack-api-method/)
```

--------------------------------------------------------------------------------

---[FILE: api-code-quality.yml]---
Location: prowler-master/.github/workflows/api-code-quality.yml

```yaml
name: 'API: Code Quality'

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
  API_WORKING_DIR: ./api

jobs:
  api-code-quality:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    strategy:
      matrix:
        python-version:
          - '3.12'
    defaults:
      run:
        working-directory: ./api

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for API changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            api/**
            .github/workflows/api-code-quality.yml
          files_ignore: |
            api/docs/**
            api/README.md
            api/CHANGELOG.md

      - name: Setup Python with Poetry
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/setup-python-poetry
        with:
          python-version: ${{ matrix.python-version }}
          working-directory: ./api

      - name: Poetry check
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry check --lock

      - name: Ruff lint
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run ruff check . --exclude contrib

      - name: Ruff format
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run ruff format --check . --exclude contrib

      - name: Pylint
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run pylint --disable=W,C,R,E -j 0 -rn -sn src/
```

--------------------------------------------------------------------------------

---[FILE: api-codeql.yml]---
Location: prowler-master/.github/workflows/api-codeql.yml

```yaml
name: 'API: CodeQL'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'api/**'
      - '.github/workflows/api-codeql.yml'
      - '.github/codeql/api-codeql-config.yml'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'api/**'
      - '.github/workflows/api-codeql.yml'
      - '.github/codeql/api-codeql-config.yml'
  schedule:
    - cron: '00 12 * * *'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  api-analyze:
    name: CodeQL Security Analysis
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language:
          - 'python'

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Initialize CodeQL
        uses: github/codeql-action/init@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          languages: ${{ matrix.language }}
          config-file: ./.github/codeql/api-codeql-config.yml

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          category: '/language:${{ matrix.language }}'
```

--------------------------------------------------------------------------------

---[FILE: api-container-build-push.yml]---
Location: prowler-master/.github/workflows/api-container-build-push.yml
Signals: Docker

```yaml
name: 'API: Container Build and Push'

on:
  push:
    branches:
      - 'master'
    paths:
      - 'api/**'
      - 'prowler/**'
      - '.github/workflows/api-container-build-push.yml'
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
  WORKING_DIRECTORY: ./api

  # Container registries
  PROWLERCLOUD_DOCKERHUB_REPOSITORY: prowlercloud
  PROWLERCLOUD_DOCKERHUB_IMAGE: prowler-api

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
          COMPONENT: API
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

      - name: Build and push API container for ${{ matrix.arch }}
        id: container-push
        if: github.event_name == 'push' || github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.WORKING_DIRECTORY }}
          push: true
          platforms: ${{ matrix.platform }}
          tags: |
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.short-sha }}-${{ matrix.arch }}
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
        uses: regclient/actions/regctl-installer@f61d18f46c86af724a9c804cb9ff2a6fec741c7c # main

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
          COMPONENT: API
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
      - name: Trigger API deployment
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.CLOUD_DISPATCH }}
          event-type: api-prowler-deployment
          client-payload: '{"sha": "${{ github.sha }}", "short_sha": "${{ needs.setup.outputs.short-sha }}"}'
```

--------------------------------------------------------------------------------

---[FILE: api-container-checks.yml]---
Location: prowler-master/.github/workflows/api-container-checks.yml
Signals: Docker

```yaml
name: 'API: Container Checks'

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
  API_WORKING_DIR: ./api
  IMAGE_NAME: prowler-api

jobs:
  api-dockerfile-lint:
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
          files: api/Dockerfile

      - name: Lint Dockerfile with Hadolint
        if: steps.dockerfile-changed.outputs.any_changed == 'true'
        uses: hadolint/hadolint-action@2332a7b74a6de0dda2e2221d575162eba76ba5e5 # v3.3.0
        with:
          dockerfile: api/Dockerfile
          ignore: DL3013

  api-container-build-and-scan:
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

      - name: Check for API changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: api/**
          files_ignore: |
            api/docs/**
            api/README.md
            api/CHANGELOG.md

      - name: Set up Docker Buildx
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build container for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.API_WORKING_DIR }}
          push: false
          load: true
          platforms: ${{ matrix.platform }}
          tags: ${{ env.IMAGE_NAME }}:${{ github.sha }}-${{ matrix.arch }}
          cache-from: type=gha,scope=${{ matrix.arch }}
          cache-to: type=gha,mode=max,scope=${{ matrix.arch }}

      - name: Scan container with Trivy for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/trivy-scan
        with:
          image-name: ${{ env.IMAGE_NAME }}
          image-tag: ${{ github.sha }}-${{ matrix.arch }}
          fail-on-critical: 'false'
          severity: 'CRITICAL'
```

--------------------------------------------------------------------------------

---[FILE: api-security.yml]---
Location: prowler-master/.github/workflows/api-security.yml

```yaml
name: 'API: Security'

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
  API_WORKING_DIR: ./api

jobs:
  api-security-scans:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
    strategy:
      matrix:
        python-version:
          - '3.12'
    defaults:
      run:
        working-directory: ./api

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for API changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            api/**
            .github/workflows/api-security.yml
          files_ignore: |
            api/docs/**
            api/README.md
            api/CHANGELOG.md

      - name: Setup Python with Poetry
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/setup-python-poetry
        with:
          python-version: ${{ matrix.python-version }}
          working-directory: ./api

      - name: Bandit
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run bandit -q -lll -x '*_test.py,./contrib/' -r .

      - name: Safety
        if: steps.check-changes.outputs.any_changed == 'true'
        # 76352, 76353, 77323 come from SDK, but they cannot upgrade it yet. It does not affect API
        # TODO: Botocore needs urllib3 1.X so we need to ignore these vulnerabilities 77744,77745. Remove this once we upgrade to urllib3 2.X
        run: poetry run safety check --ignore 70612,66963,74429,76352,76353,77323,77744,77745

      - name: Vulture
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run vulture --exclude "contrib,tests,conftest.py" --min-confidence 100 .
```

--------------------------------------------------------------------------------

---[FILE: api-tests.yml]---
Location: prowler-master/.github/workflows/api-tests.yml

```yaml
name: 'API: Tests'

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
  POSTGRES_HOST: localhost
  POSTGRES_PORT: 5432
  POSTGRES_ADMIN_USER: prowler
  POSTGRES_ADMIN_PASSWORD: S3cret
  POSTGRES_USER: prowler_user
  POSTGRES_PASSWORD: prowler
  POSTGRES_DB: postgres-db
  VALKEY_HOST: localhost
  VALKEY_PORT: 6379
  VALKEY_DB: 0
  API_WORKING_DIR: ./api

jobs:
  api-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    strategy:
      matrix:
        python-version:
          - '3.12'
    defaults:
      run:
        working-directory: ./api

    services:
      postgres:
        image: postgres
        env:
          POSTGRES_HOST: ${{ env.POSTGRES_HOST }}
          POSTGRES_PORT: ${{ env.POSTGRES_PORT }}
          POSTGRES_USER: ${{ env.POSTGRES_USER }}
          POSTGRES_PASSWORD: ${{ env.POSTGRES_PASSWORD }}
          POSTGRES_DB: ${{ env.POSTGRES_DB }}
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      valkey:
        image: valkey/valkey:7-alpine3.19
        env:
          VALKEY_HOST: ${{ env.VALKEY_HOST }}
          VALKEY_PORT: ${{ env.VALKEY_PORT }}
          VALKEY_DB: ${{ env.VALKEY_DB }}
        ports:
          - 6379:6379
        options: >-
          --health-cmd "valkey-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for API changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            api/**
            .github/workflows/api-tests.yml
          files_ignore: |
            api/docs/**
            api/README.md
            api/CHANGELOG.md

      - name: Setup Python with Poetry
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/setup-python-poetry
        with:
          python-version: ${{ matrix.python-version }}
          working-directory: ./api

      - name: Run tests with pytest
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run pytest --cov=./src/backend --cov-report=xml src/backend

      - name: Upload coverage reports to Codecov
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: api
```

--------------------------------------------------------------------------------

---[FILE: backport.yml]---
Location: prowler-master/.github/workflows/backport.yml

```yaml
name: 'Tools: Backport'

on:
  pull_request_target:
    branches:
      - 'master'
    types:
      - 'labeled'
      - 'closed'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number }}
  cancel-in-progress: false

env:
  BACKPORT_LABEL_PREFIX: backport-to-
  BACKPORT_LABEL_IGNORE: was-backported

jobs:
  backport:
    if: github.event.pull_request.merged == true && !(contains(github.event.pull_request.labels.*.name, 'backport')) && !(contains(github.event.pull_request.labels.*.name, 'was-backported'))
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: write
      pull-requests: write

    steps:
      - name: Check labels
        id: label_check
        uses: agilepathway/label-checker@c3d16ad512e7cea5961df85ff2486bb774caf3c5 # v1.6.65
        with:
          allow_failure: true
          prefix_mode: true
          any_of: ${{ env.BACKPORT_LABEL_PREFIX }}
          none_of: ${{ env.BACKPORT_LABEL_IGNORE }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Backport PR
        if: steps.label_check.outputs.label_check == 'success'
        uses: sorenlouv/backport-github-action@516854e7c9f962b9939085c9a92ea28411d1ae90 # v10.2.0
        with:
          github_token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          auto_backport_label_prefix: ${{ env.BACKPORT_LABEL_PREFIX }}

      - name: Display backport info log
        if: success() && steps.label_check.outputs.label_check == 'success'
        run: cat ~/.backport/backport.info.log

      - name: Display backport debug log
        if: failure() && steps.label_check.outputs.label_check == 'success'
        run: cat ~/.backport/backport.debug.log
```

--------------------------------------------------------------------------------

````
