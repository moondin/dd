---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 9
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 9 of 867)

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

---[FILE: sdk-container-build-push.yml]---
Location: prowler-master/.github/workflows/sdk-container-build-push.yml
Signals: Docker

```yaml
name: 'SDK: Container Build and Push'

on:
  push:
    branches:
      - 'v3'      # For v3-latest
      - 'v4.6'    # For v4-latest
      - 'master'  # For latest
    paths-ignore:
      - '.github/**'
      - '!.github/workflows/sdk-container-build-push.yml'
      - 'README.md'
      - 'docs/**'
      - 'ui/**'
      - 'api/**'
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
  # Container configuration
  IMAGE_NAME: prowler
  DOCKERFILE_PATH: ./Dockerfile

  # Python configuration
  PYTHON_VERSION: '3.12'

  # Tags (dynamically set based on version)
  LATEST_TAG: latest
  STABLE_TAG: stable

  # Container registries
  PROWLERCLOUD_DOCKERHUB_REPOSITORY: prowlercloud
  PROWLERCLOUD_DOCKERHUB_IMAGE: prowler

  # AWS configuration (for ECR)
  AWS_REGION: us-east-1

jobs:
  setup:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    outputs:
      prowler_version: ${{ steps.get-prowler-version.outputs.prowler_version }}
      prowler_version_major: ${{ steps.get-prowler-version.outputs.prowler_version_major }}
      latest_tag: ${{ steps.get-prowler-version.outputs.latest_tag }}
      stable_tag: ${{ steps.get-prowler-version.outputs.stable_tag }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Set up Python ${{ env.PYTHON_VERSION }}
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install Poetry
        run: |
          pipx install poetry==2.1.1
          pipx inject poetry poetry-bumpversion

      - name: Get Prowler version and set tags
        id: get-prowler-version
        run: |
          PROWLER_VERSION="$(poetry version -s 2>/dev/null)"
          echo "prowler_version=${PROWLER_VERSION}" >> "${GITHUB_OUTPUT}"

          # Extract major version
          PROWLER_VERSION_MAJOR="${PROWLER_VERSION%%.*}"
          echo "prowler_version_major=${PROWLER_VERSION_MAJOR}" >> "${GITHUB_OUTPUT}"

          # Set version-specific tags
          case ${PROWLER_VERSION_MAJOR} in
            3)
              echo "latest_tag=v3-latest" >> "${GITHUB_OUTPUT}"
              echo "stable_tag=v3-stable" >> "${GITHUB_OUTPUT}"
              echo "✓ Prowler v3 detected - tags: v3-latest, v3-stable"
              ;;
            4)
              echo "latest_tag=v4-latest" >> "${GITHUB_OUTPUT}"
              echo "stable_tag=v4-stable" >> "${GITHUB_OUTPUT}"
              echo "✓ Prowler v4 detected - tags: v4-latest, v4-stable"
              ;;
            5)
              echo "latest_tag=latest" >> "${GITHUB_OUTPUT}"
              echo "stable_tag=stable" >> "${GITHUB_OUTPUT}"
              echo "✓ Prowler v5 detected - tags: latest, stable"
              ;;
            *)
              echo "::error::Unsupported Prowler major version: ${PROWLER_VERSION_MAJOR}"
              exit 1
              ;;
          esac

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
          COMPONENT: SDK
          RELEASE_TAG: ${{ needs.setup.outputs.prowler_version }}
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
    timeout-minutes: 45
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

      - name: Login to Public ECR
        uses: docker/login-action@5e57cd118135c172c3672efd75eb46360885c0ef # v3.6.0
        with:
          registry: public.ecr.aws
          username: ${{ secrets.PUBLIC_ECR_AWS_ACCESS_KEY_ID }}
          password: ${{ secrets.PUBLIC_ECR_AWS_SECRET_ACCESS_KEY }}
        env:
          AWS_REGION: ${{ env.AWS_REGION }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build and push SDK container for ${{ matrix.arch }}
        id: container-push
        if: github.event_name == 'push' || github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: .
          file: ${{ env.DOCKERFILE_PATH }}
          push: true
          platforms: ${{ matrix.platform }}
          tags: |
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-${{ matrix.arch }}
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

      - name: Login to Public ECR
        uses: docker/login-action@74a5d142397b4f367a81961eba4e8cd7edddf772 # v3.4.0
        with:
          registry: public.ecr.aws
          username: ${{ secrets.PUBLIC_ECR_AWS_ACCESS_KEY_ID }}
          password: ${{ secrets.PUBLIC_ECR_AWS_SECRET_ACCESS_KEY }}
        env:
          AWS_REGION: ${{ env.AWS_REGION }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Create and push manifests for push event
        if: github.event_name == 'push'
        run: |
          docker buildx imagetools create \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }} \
            -t ${{ secrets.DOCKER_HUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }} \
            -t ${{ secrets.PUBLIC_ECR_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }} \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-amd64 \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-arm64

      - name: Create and push manifests for release event
        if: github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        run: |
          docker buildx imagetools create \
            -t ${{ secrets.DOCKER_HUB_REPOSITORY }}/${{ env.IMAGE_NAME }}:${{ needs.setup.outputs.prowler_version }} \
            -t ${{ secrets.DOCKER_HUB_REPOSITORY }}/${{ env.IMAGE_NAME }}:${{ needs.setup.outputs.stable_tag }} \
            -t ${{ secrets.PUBLIC_ECR_REPOSITORY }}/${{ env.IMAGE_NAME }}:${{ needs.setup.outputs.prowler_version }} \
            -t ${{ secrets.PUBLIC_ECR_REPOSITORY }}/${{ env.IMAGE_NAME }}:${{ needs.setup.outputs.stable_tag }} \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.prowler_version }} \
            -t ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.stable_tag }} \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-amd64 \
            ${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-arm64

      - name: Install regctl
        if: always()
        uses: regclient/actions/regctl-installer@main

      - name: Cleanup intermediate architecture tags
        if: always()
        run: |
          echo "Cleaning up intermediate tags..."
          regctl tag delete "${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-amd64" || true
          regctl tag delete "${{ env.PROWLERCLOUD_DOCKERHUB_REPOSITORY }}/${{ env.PROWLERCLOUD_DOCKERHUB_IMAGE }}:${{ needs.setup.outputs.latest_tag }}-arm64" || true
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
          COMPONENT: SDK
          RELEASE_TAG: ${{ needs.setup.outputs.prowler_version }}
          GITHUB_SERVER_URL: ${{ github.server_url }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          GITHUB_RUN_ID: ${{ github.run_id }}
        with:
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          payload-file-path: "./.github/scripts/slack-messages/container-release-completed.json"
          step-outcome: ${{ steps.outcome.outputs.outcome }}
          update-ts: ${{ needs.notify-release-started.outputs.message-ts }}

  dispatch-v3-deployment:
    if: needs.setup.outputs.prowler_version_major == '3'
    needs: [setup, container-build-push]
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read

    steps:
      - name: Calculate short SHA
        id: short-sha
        run: echo "short_sha=${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

      - name: Dispatch v3 deployment (latest)
        if: github.event_name == 'push'
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.DISPATCH_OWNER }}/${{ secrets.DISPATCH_REPO }}
          event-type: dispatch
          client-payload: '{"version":"v3-latest","tag":"${{ steps.short-sha.outputs.short_sha }}"}'

      - name: Dispatch v3 deployment (release)
        if: github.event_name == 'release'
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.DISPATCH_OWNER }}/${{ secrets.DISPATCH_REPO }}
          event-type: dispatch
          client-payload: '{"version":"release","tag":"${{ needs.setup.outputs.prowler_version }}"}'
```

--------------------------------------------------------------------------------

---[FILE: sdk-container-checks.yml]---
Location: prowler-master/.github/workflows/sdk-container-checks.yml
Signals: Docker

```yaml
name: 'SDK: Container Checks'

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
  IMAGE_NAME: prowler

jobs:
  sdk-dockerfile-lint:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check if Dockerfile changed
        id: dockerfile-changed
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: Dockerfile

      - name: Lint Dockerfile with Hadolint
        if: steps.dockerfile-changed.outputs.any_changed == 'true'
        uses: hadolint/hadolint-action@2332a7b74a6de0dda2e2221d575162eba76ba5e5 # v3.3.0
        with:
          dockerfile: Dockerfile
          ignore: DL3013

  sdk-container-build-and-scan:
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

      - name: Check for SDK changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: ./**
          files_ignore: |
            .github/**
            prowler/CHANGELOG.md
            docs/**
            permissions/**
            api/**
            ui/**
            dashboard/**
            mcp_server/**
            README.md
            mkdocs.yml
            .backportrc.json
            .env
            docker-compose*
            examples/**
            .gitignore
            contrib/**

      - name: Set up Docker Buildx
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build SDK container for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: .
          push: false
          load: true
          platforms: ${{ matrix.platform }}
          tags: ${{ env.IMAGE_NAME }}:${{ github.sha }}-${{ matrix.arch }}
          cache-from: type=gha,scope=${{ matrix.arch }}
          cache-to: type=gha,mode=max,scope=${{ matrix.arch }}

      - name: Scan SDK container with Trivy for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/trivy-scan
        with:
          image-name: ${{ env.IMAGE_NAME }}
          image-tag: ${{ github.sha }}-${{ matrix.arch }}
          fail-on-critical: 'false'
          severity: 'CRITICAL'
```

--------------------------------------------------------------------------------

---[FILE: sdk-pypi-release.yml]---
Location: prowler-master/.github/workflows/sdk-pypi-release.yml

```yaml
name: 'SDK: PyPI Release'

on:
  release:
    types:
      - 'published'

concurrency:
  group: ${{ github.workflow }}-${{ github.event.release.tag_name }}
  cancel-in-progress: false

env:
  RELEASE_TAG: ${{ github.event.release.tag_name }}
  PYTHON_VERSION: '3.12'

jobs:
  validate-release:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
    outputs:
      prowler_version: ${{ steps.parse-version.outputs.version }}
      major_version: ${{ steps.parse-version.outputs.major }}

    steps:
      - name: Parse and validate version
        id: parse-version
        run: |
          PROWLER_VERSION="${{ env.RELEASE_TAG }}"
          echo "version=${PROWLER_VERSION}" >> "${GITHUB_OUTPUT}"

          # Extract major version
          MAJOR_VERSION="${PROWLER_VERSION%%.*}"
          echo "major=${MAJOR_VERSION}" >> "${GITHUB_OUTPUT}"

          # Validate major version
          case ${MAJOR_VERSION} in
            3|4|5)
              echo "✓ Releasing Prowler v${MAJOR_VERSION} with tag ${PROWLER_VERSION}"
              ;;
            *)
              echo "::error::Unsupported Prowler major version: ${MAJOR_VERSION}"
              exit 1
              ;;
          esac

  publish-prowler:
    needs: validate-release
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      id-token: write
    environment:
      name: pypi-prowler
      url: https://pypi.org/project/prowler/${{ needs.validate-release.outputs.prowler_version }}/

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Install Poetry
        run: pipx install poetry==2.1.1

      - name: Set up Python ${{ env.PYTHON_VERSION }}
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'poetry'

      - name: Build Prowler package
        run: poetry build

      - name: Publish Prowler package to PyPI
        uses: pypa/gh-action-pypi-publish@ed0c53931b1dc9bd32cbe73a98c7f6766f8a527e # v1.13.0
        with:
          print-hash: true

  publish-prowler-cloud:
    needs: validate-release
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read
      id-token: write
    environment:
      name: pypi-prowler-cloud
      url: https://pypi.org/project/prowler-cloud/${{ needs.validate-release.outputs.prowler_version }}/

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Install Poetry
        run: pipx install poetry==2.1.1

      - name: Set up Python ${{ env.PYTHON_VERSION }}
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'poetry'

      - name: Install toml package
        run: pip install toml

      - name: Replicate PyPI package for prowler-cloud
        run: |
          rm -rf ./dist ./build prowler.egg-info
          python util/replicate_pypi_package.py

      - name: Build prowler-cloud package
        run: poetry build

      - name: Publish prowler-cloud package to PyPI
        uses: pypa/gh-action-pypi-publish@ed0c53931b1dc9bd32cbe73a98c7f6766f8a527e # v1.13.0
        with:
          print-hash: true
```

--------------------------------------------------------------------------------

---[FILE: sdk-refresh-aws-services-regions.yml]---
Location: prowler-master/.github/workflows/sdk-refresh-aws-services-regions.yml

```yaml
name: 'SDK: Refresh AWS Regions'

on:
  schedule:
    - cron: '0 9 * * 1' # Every Monday at 09:00 UTC
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: false

env:
  PYTHON_VERSION: '3.12'
  AWS_REGION: 'us-east-1'

jobs:
  refresh-aws-regions:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      id-token: write
      pull-requests: write
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
        with:
          ref: 'master'

      - name: Set up Python ${{ env.PYTHON_VERSION }}
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ env.PYTHON_VERSION }}
          cache: 'pip'

      - name: Install dependencies
        run: pip install boto3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@00943011d9042930efac3dcd3a170e4273319bc8 # v5.1.0
        with:
          aws-region: ${{ env.AWS_REGION }}
          role-to-assume: ${{ secrets.DEV_IAM_ROLE_ARN }}
          role-session-name: prowler-refresh-aws-regions

      - name: Update AWS services regions
        run: python util/update_aws_services_regions.py

      - name: Create pull request
        id: create-pr
        uses: peter-evans/create-pull-request@271a8d0340265f705b14b6d32b9829c1cb33d45e # v7.0.8
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          author: 'prowler-bot <179230569+prowler-bot@users.noreply.github.com>'
          committer: 'github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>'
          commit-message: 'feat(aws): update regions for AWS services'
          branch: 'aws-regions-update-${{ github.run_number }}'
          title: 'feat(aws): Update regions for AWS services'
          labels: |
            status/waiting-for-revision
            severity/low
            provider/aws
            no-changelog
          body: |
            ### Description

            Automated update of AWS service regions from the official AWS IP ranges.

            **Trigger:** ${{ github.event_name == 'schedule' && 'Scheduled (weekly)' || github.event_name == 'workflow_dispatch' && 'Manual' || 'Workflow update' }}
            **Run:** [#${{ github.run_number }}](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})

            ### Checklist

            - [x] This is an automated update from AWS official sources
            - [x] No manual review of region data required

            ### License

            By submitting this pull request, I confirm that my contribution is made under the terms of the Apache 2.0 license.

      - name: PR creation result
        run: |
          if [[ "${{ steps.create-pr.outputs.pull-request-number }}" ]]; then
            echo "✓ Pull request #${{ steps.create-pr.outputs.pull-request-number }} created successfully"
            echo "URL: ${{ steps.create-pr.outputs.pull-request-url }}"
          else
            echo "✓ No changes detected - AWS regions are up to date"
          fi
```

--------------------------------------------------------------------------------

---[FILE: sdk-security.yml]---
Location: prowler-master/.github/workflows/sdk-security.yml
Signals: Docker

```yaml
name: 'SDK: Security'

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
  sdk-security-scans:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Check for SDK changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: ./**
          files_ignore: |
            .github/**
            prowler/CHANGELOG.md
            docs/**
            permissions/**
            api/**
            ui/**
            dashboard/**
            mcp_server/**
            README.md
            mkdocs.yml
            .backportrc.json
            .env
            docker-compose*
            examples/**
            .gitignore
            contrib/**

      - name: Install Poetry
        if: steps.check-changes.outputs.any_changed == 'true'
        run: pipx install poetry==2.1.1

      - name: Set up Python 3.12
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: '3.12'
          cache: 'poetry'

      - name: Install dependencies
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry install --no-root

      - name: Security scan with Bandit
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run bandit -q -lll -x '*_test.py,./contrib/,./api/,./ui' -r .

      - name: Security scan with Safety
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run safety check --ignore 70612 -r pyproject.toml

      - name: Dead code detection with Vulture
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry run vulture --exclude "contrib,api,ui" --min-confidence 100 .
```

--------------------------------------------------------------------------------

````
