---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 10
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 10 of 867)

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

---[FILE: sdk-tests.yml]---
Location: prowler-master/.github/workflows/sdk-tests.yml
Signals: Docker

```yaml
name: 'SDK: Tests'

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
  sdk-tests:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      matrix:
        python-version:
          - '3.9'
          - '3.10'
          - '3.11'
          - '3.12'

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

      - name: Set up Python ${{ matrix.python-version }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: actions/setup-python@e797f83bcb11b83ae66e0230d6156d7c80228e7c # v6.0.0
        with:
          python-version: ${{ matrix.python-version }}
          cache: 'poetry'

      - name: Install dependencies
        if: steps.check-changes.outputs.any_changed == 'true'
        run: poetry install --no-root

      # AWS Provider
      - name: Check if AWS files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-aws
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/aws/**
            ./tests/**/aws/**
            ./poetry.lock

      - name: Resolve AWS services under test
        if: steps.changed-aws.outputs.any_changed == 'true'
        id: aws-services
        shell: bash
        run: |
          python3 <<'PY'
          import os
          from pathlib import Path

          dependents = {
              "acm": ["elb"],
              "autoscaling": ["dynamodb"],
              "awslambda": ["ec2", "inspector2"],
              "backup": ["dynamodb", "ec2", "rds"],
              "cloudfront": ["shield"],
              "cloudtrail": ["awslambda", "cloudwatch"],
              "cloudwatch": ["bedrock"],
              "ec2": ["dlm", "dms", "elbv2", "emr", "inspector2", "rds", "redshift", "route53", "shield", "ssm"],
              "ecr": ["inspector2"],
              "elb": ["shield"],
              "elbv2": ["shield"],
              "globalaccelerator": ["shield"],
              "iam": ["bedrock", "cloudtrail", "cloudwatch", "codebuild"],
              "kafka": ["firehose"],
              "kinesis": ["firehose"],
              "kms": ["kafka"],
              "organizations": ["iam", "servicecatalog"],
              "route53": ["shield"],
              "s3": ["bedrock", "cloudfront", "cloudtrail", "macie"],
              "ssm": ["ec2"],
              "vpc": ["awslambda", "ec2", "efs", "elasticache", "neptune", "networkfirewall", "rds", "redshift", "workspaces"],
              "waf": ["elbv2"],
              "wafv2": ["cognito", "elbv2"],
          }

          changed_raw = """${{ steps.changed-aws.outputs.all_changed_files }}"""
          # all_changed_files is space-separated, not newline-separated
          # Strip leading "./" if present for consistent path handling
          changed_files = [Path(f.lstrip("./")) for f in changed_raw.split() if f]

          services = set()
          run_all = False

          for path in changed_files:
              path_str = path.as_posix()
              parts = path.parts
              if path_str.startswith("prowler/providers/aws/services/"):
                  if len(parts) > 4 and "." not in parts[4]:
                      services.add(parts[4])
                  else:
                      run_all = True
              elif path_str.startswith("tests/providers/aws/services/"):
                  if len(parts) > 4 and "." not in parts[4]:
                      services.add(parts[4])
                  else:
                      run_all = True
              elif path_str.startswith("prowler/providers/aws/") or path_str.startswith("tests/providers/aws/"):
                  run_all = True

          # Expand with direct dependent services (one level only)
          # We only test services that directly depend on the changed services,
          # not transitive dependencies (services that depend on dependents)
          original_services = set(services)
          for svc in original_services:
              for dep in dependents.get(svc, []):
                  services.add(dep)

          if run_all or not services:
              run_all = True
              services = set()

          service_paths = " ".join(sorted(f"tests/providers/aws/services/{svc}" for svc in services))

          output_lines = [
              f"run_all={'true' if run_all else 'false'}",
              f"services={' '.join(sorted(services))}",
              f"service_paths={service_paths}",
          ]

          with open(os.environ["GITHUB_OUTPUT"], "a") as gh_out:
              for line in output_lines:
                  gh_out.write(line + "\n")

          print(f"AWS changed files (filtered): {changed_raw or 'none'}")
          print(f"Run all AWS tests: {run_all}")
          if services:
              print(f"AWS service test paths: {service_paths}")
          else:
              print("AWS service test paths: none detected")
          PY

      - name: Run AWS tests
        if: steps.changed-aws.outputs.any_changed == 'true'
        run: |
          echo "AWS run_all=${{ steps.aws-services.outputs.run_all }}"
          echo "AWS service_paths='${{ steps.aws-services.outputs.service_paths }}'"

          if [ "${{ steps.aws-services.outputs.run_all }}" = "true" ]; then
            poetry run pytest -n auto --cov=./prowler/providers/aws --cov-report=xml:aws_coverage.xml tests/providers/aws
          elif [ -z "${{ steps.aws-services.outputs.service_paths }}" ]; then
            echo "No AWS service paths detected; skipping AWS tests."
          else
            poetry run pytest -n auto --cov=./prowler/providers/aws --cov-report=xml:aws_coverage.xml ${{ steps.aws-services.outputs.service_paths }}
          fi

      - name: Upload AWS coverage to Codecov
        if: steps.changed-aws.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-aws
          files: ./aws_coverage.xml

      # Azure Provider
      - name: Check if Azure files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-azure
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/azure/**
            ./tests/**/azure/**
            ./poetry.lock

      - name: Run Azure tests
        if: steps.changed-azure.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/azure --cov-report=xml:azure_coverage.xml tests/providers/azure

      - name: Upload Azure coverage to Codecov
        if: steps.changed-azure.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-azure
          files: ./azure_coverage.xml

      # GCP Provider
      - name: Check if GCP files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-gcp
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/gcp/**
            ./tests/**/gcp/**
            ./poetry.lock

      - name: Run GCP tests
        if: steps.changed-gcp.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/gcp --cov-report=xml:gcp_coverage.xml tests/providers/gcp

      - name: Upload GCP coverage to Codecov
        if: steps.changed-gcp.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-gcp
          files: ./gcp_coverage.xml

      # Kubernetes Provider
      - name: Check if Kubernetes files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-kubernetes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/kubernetes/**
            ./tests/**/kubernetes/**
            ./poetry.lock

      - name: Run Kubernetes tests
        if: steps.changed-kubernetes.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/kubernetes --cov-report=xml:kubernetes_coverage.xml tests/providers/kubernetes

      - name: Upload Kubernetes coverage to Codecov
        if: steps.changed-kubernetes.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-kubernetes
          files: ./kubernetes_coverage.xml

      # GitHub Provider
      - name: Check if GitHub files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-github
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/github/**
            ./tests/**/github/**
            ./poetry.lock

      - name: Run GitHub tests
        if: steps.changed-github.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/github --cov-report=xml:github_coverage.xml tests/providers/github

      - name: Upload GitHub coverage to Codecov
        if: steps.changed-github.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-github
          files: ./github_coverage.xml

      # NHN Provider
      - name: Check if NHN files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-nhn
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/nhn/**
            ./tests/**/nhn/**
            ./poetry.lock

      - name: Run NHN tests
        if: steps.changed-nhn.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/nhn --cov-report=xml:nhn_coverage.xml tests/providers/nhn

      - name: Upload NHN coverage to Codecov
        if: steps.changed-nhn.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-nhn
          files: ./nhn_coverage.xml

      # M365 Provider
      - name: Check if M365 files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-m365
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/m365/**
            ./tests/**/m365/**
            ./poetry.lock

      - name: Run M365 tests
        if: steps.changed-m365.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/m365 --cov-report=xml:m365_coverage.xml tests/providers/m365

      - name: Upload M365 coverage to Codecov
        if: steps.changed-m365.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-m365
          files: ./m365_coverage.xml

      # IaC Provider
      - name: Check if IaC files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-iac
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/iac/**
            ./tests/**/iac/**
            ./poetry.lock

      - name: Run IaC tests
        if: steps.changed-iac.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/iac --cov-report=xml:iac_coverage.xml tests/providers/iac

      - name: Upload IaC coverage to Codecov
        if: steps.changed-iac.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-iac
          files: ./iac_coverage.xml

      # MongoDB Atlas Provider
      - name: Check if MongoDB Atlas files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-mongodbatlas
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/mongodbatlas/**
            ./tests/**/mongodbatlas/**
            ./poetry.lock

      - name: Run MongoDB Atlas tests
        if: steps.changed-mongodbatlas.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/mongodbatlas --cov-report=xml:mongodbatlas_coverage.xml tests/providers/mongodbatlas

      - name: Upload MongoDB Atlas coverage to Codecov
        if: steps.changed-mongodbatlas.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-mongodbatlas
          files: ./mongodbatlas_coverage.xml

      # OCI Provider
      - name: Check if OCI files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-oraclecloud
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/**/oraclecloud/**
            ./tests/**/oraclecloud/**
            ./poetry.lock

      - name: Run OCI tests
        if: steps.changed-oraclecloud.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/providers/oraclecloud --cov-report=xml:oraclecloud_coverage.xml tests/providers/oraclecloud

      - name: Upload OCI coverage to Codecov
        if: steps.changed-oraclecloud.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-oraclecloud
          files: ./oraclecloud_coverage.xml

      # Lib
      - name: Check if Lib files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-lib
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/lib/**
            ./tests/lib/**
            ./poetry.lock

      - name: Run Lib tests
        if: steps.changed-lib.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/lib --cov-report=xml:lib_coverage.xml tests/lib

      - name: Upload Lib coverage to Codecov
        if: steps.changed-lib.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-lib
          files: ./lib_coverage.xml

      # Config
      - name: Check if Config files changed
        if: steps.check-changes.outputs.any_changed == 'true'
        id: changed-config
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: |
            ./prowler/config/**
            ./tests/config/**
            ./poetry.lock

      - name: Run Config tests
        if: steps.changed-config.outputs.any_changed == 'true'
        run: poetry run pytest -n auto --cov=./prowler/config --cov-report=xml:config_coverage.xml tests/config

      - name: Upload Config coverage to Codecov
        if: steps.changed-config.outputs.any_changed == 'true'
        uses: codecov/codecov-action@5a1091511ad55cbe89839c7260b706298ca349f7 # v5.5.1
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
        with:
          flags: prowler-py${{ matrix.python-version }}-config
          files: ./config_coverage.xml
```

--------------------------------------------------------------------------------

---[FILE: ui-codeql.yml]---
Location: prowler-master/.github/workflows/ui-codeql.yml

```yaml
name: 'UI: CodeQL'

on:
  push:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'ui/**'
      - '.github/workflows/ui-codeql.yml'
      - '.github/codeql/ui-codeql-config.yml'
      - '!ui/CHANGELOG.md'
  pull_request:
    branches:
      - 'master'
      - 'v5.*'
    paths:
      - 'ui/**'
      - '.github/workflows/ui-codeql.yml'
      - '.github/codeql/ui-codeql-config.yml'
      - '!ui/CHANGELOG.md'
  schedule:
    - cron: '00 12 * * *'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ui-analyze:
    if: github.repository == 'prowler-cloud/prowler'
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
          - 'javascript-typescript'

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0

      - name: Initialize CodeQL
        uses: github/codeql-action/init@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          languages: ${{ matrix.language }}
          config-file: ./.github/codeql/ui-codeql-config.yml

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@0499de31b99561a6d14a36a5f662c2a54f91beee # v4.31.2
        with:
          category: '/language:${{ matrix.language }}'
```

--------------------------------------------------------------------------------

---[FILE: ui-container-build-push.yml]---
Location: prowler-master/.github/workflows/ui-container-build-push.yml
Signals: Docker

```yaml
name: 'UI: Container Build and Push'

on:
  push:
    branches:
      - 'master'
    paths:
      - 'ui/**'
      - '.github/workflows/ui-container-build-push.yml'
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
  WORKING_DIRECTORY: ./ui

  # Container registries
  PROWLERCLOUD_DOCKERHUB_REPOSITORY: prowlercloud
  PROWLERCLOUD_DOCKERHUB_IMAGE: prowler-ui

  # Build args
  NEXT_PUBLIC_API_BASE_URL: http://prowler-api:8080/api/v1

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
          COMPONENT: UI
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

      - name: Build and push UI container for ${{ matrix.arch }}
        id: container-push
        if: github.event_name == 'push' || github.event_name == 'release' || github.event_name == 'workflow_dispatch'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.WORKING_DIRECTORY }}
          build-args: |
            NEXT_PUBLIC_PROWLER_RELEASE_VERSION=${{ (github.event_name == 'release' || github.event_name == 'workflow_dispatch') && format('v{0}', env.RELEASE_TAG) || needs.setup.outputs.short-sha }}
            NEXT_PUBLIC_API_BASE_URL=${{ env.NEXT_PUBLIC_API_BASE_URL }}
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
          COMPONENT: UI
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
      - name: Trigger UI deployment
        uses: peter-evans/repository-dispatch@5fc4efd1a4797ddb68ffd0714a238564e4cc0e6f # v4.0.0
        with:
          token: ${{ secrets.PROWLER_BOT_ACCESS_TOKEN }}
          repository: ${{ secrets.CLOUD_DISPATCH }}
          event-type: ui-prowler-deployment
          client-payload: '{"sha": "${{ github.sha }}", "short_sha": "${{ needs.setup.outputs.short-sha }}"}'
```

--------------------------------------------------------------------------------

---[FILE: ui-container-checks.yml]---
Location: prowler-master/.github/workflows/ui-container-checks.yml
Signals: Docker

```yaml
name: 'UI: Container Checks'

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
  UI_WORKING_DIR: ./ui
  IMAGE_NAME: prowler-ui

jobs:
  ui-dockerfile-lint:
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
          files: ui/Dockerfile

      - name: Lint Dockerfile with Hadolint
        if: steps.dockerfile-changed.outputs.any_changed == 'true'
        uses: hadolint/hadolint-action@2332a7b74a6de0dda2e2221d575162eba76ba5e5 # v3.3.0
        with:
          dockerfile: ui/Dockerfile
          ignore: DL3018

  ui-container-build-and-scan:
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

      - name: Check for UI changes
        id: check-changes
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62 # v47.0.0
        with:
          files: ui/**
          files_ignore: |
            ui/CHANGELOG.md
            ui/README.md

      - name: Set up Docker Buildx
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/setup-buildx-action@e468171a9de216ec08956ac3ada2f0791b6bd435 # v3.11.1

      - name: Build UI container for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: docker/build-push-action@263435318d21b8e681c14492fe198d362a7d2c83 # v6.18.0
        with:
          context: ${{ env.UI_WORKING_DIR }}
          target: prod
          push: false
          load: true
          platforms: ${{ matrix.platform }}
          tags: ${{ env.IMAGE_NAME }}:${{ github.sha }}-${{ matrix.arch }}
          cache-from: type=gha,scope=${{ matrix.arch }}
          cache-to: type=gha,mode=max,scope=${{ matrix.arch }}
          build-args: |
            NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51LwpXXXX

      - name: Scan UI container with Trivy for ${{ matrix.arch }}
        if: steps.check-changes.outputs.any_changed == 'true'
        uses: ./.github/actions/trivy-scan
        with:
          image-name: ${{ env.IMAGE_NAME }}
          image-tag: ${{ github.sha }}-${{ matrix.arch }}
          fail-on-critical: 'false'
          severity: 'CRITICAL'
```

--------------------------------------------------------------------------------

---[FILE: ui-e2e-tests.yml]---
Location: prowler-master/.github/workflows/ui-e2e-tests.yml
Signals: Docker

```yaml
name: UI - E2E Tests

on:
  pull_request:
    branches:
      - master
      - "v5.*"
    paths:
      - '.github/workflows/ui-e2e-tests.yml'
      - 'ui/**'

jobs:

  e2e-tests:
    if: github.repository == 'prowler-cloud/prowler'
    runs-on: ubuntu-latest
    env:
      AUTH_SECRET: 'fallback-ci-secret-for-testing'
      AUTH_TRUST_HOST: true
      NEXTAUTH_URL: 'http://localhost:3000'
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080/api/v1'
      E2E_ADMIN_USER: ${{ secrets.E2E_ADMIN_USER }}
      E2E_ADMIN_PASSWORD: ${{ secrets.E2E_ADMIN_PASSWORD }}
      E2E_AWS_PROVIDER_ACCOUNT_ID: ${{ secrets.E2E_AWS_PROVIDER_ACCOUNT_ID }}
      E2E_AWS_PROVIDER_ACCESS_KEY: ${{ secrets.E2E_AWS_PROVIDER_ACCESS_KEY }}
      E2E_AWS_PROVIDER_SECRET_KEY: ${{ secrets.E2E_AWS_PROVIDER_SECRET_KEY }}
      E2E_AWS_PROVIDER_ROLE_ARN: ${{ secrets.E2E_AWS_PROVIDER_ROLE_ARN }}
      E2E_AZURE_SUBSCRIPTION_ID: ${{ secrets.E2E_AZURE_SUBSCRIPTION_ID }}
      E2E_AZURE_CLIENT_ID: ${{ secrets.E2E_AZURE_CLIENT_ID }}
      E2E_AZURE_SECRET_ID: ${{ secrets.E2E_AZURE_SECRET_ID }}
      E2E_AZURE_TENANT_ID: ${{ secrets.E2E_AZURE_TENANT_ID }}
      E2E_M365_DOMAIN_ID: ${{ secrets.E2E_M365_DOMAIN_ID }}
      E2E_M365_CLIENT_ID: ${{ secrets.E2E_M365_CLIENT_ID }}
      E2E_M365_SECRET_ID: ${{ secrets.E2E_M365_SECRET_ID }}
      E2E_M365_TENANT_ID: ${{ secrets.E2E_M365_TENANT_ID }}
      E2E_M365_CERTIFICATE_CONTENT: ${{ secrets.E2E_M365_CERTIFICATE_CONTENT }}
      E2E_KUBERNETES_CONTEXT: 'kind-kind'
      E2E_KUBERNETES_KUBECONFIG_PATH: /home/runner/.kube/config
      E2E_GCP_BASE64_SERVICE_ACCOUNT_KEY: ${{ secrets.E2E_GCP_BASE64_SERVICE_ACCOUNT_KEY }}
      E2E_GCP_PROJECT_ID: ${{ secrets.E2E_GCP_PROJECT_ID }}
      E2E_GITHUB_APP_ID: ${{ secrets.E2E_GITHUB_APP_ID }}
      E2E_GITHUB_BASE64_APP_PRIVATE_KEY: ${{ secrets.E2E_GITHUB_BASE64_APP_PRIVATE_KEY }}
      E2E_GITHUB_USERNAME: ${{ secrets.E2E_GITHUB_USERNAME }}
      E2E_GITHUB_PERSONAL_ACCESS_TOKEN: ${{ secrets.E2E_GITHUB_PERSONAL_ACCESS_TOKEN }}
      E2E_GITHUB_ORGANIZATION: ${{ secrets.E2E_GITHUB_ORGANIZATION }}
      E2E_GITHUB_ORGANIZATION_ACCESS_TOKEN: ${{ secrets.E2E_GITHUB_ORGANIZATION_ACCESS_TOKEN }}
      E2E_ORGANIZATION_ID: ${{ secrets.E2E_ORGANIZATION_ID }}
      E2E_OCI_TENANCY_ID: ${{ secrets.E2E_OCI_TENANCY_ID }}
      E2E_OCI_USER_ID: ${{ secrets.E2E_OCI_USER_ID }}
      E2E_OCI_FINGERPRINT: ${{ secrets.E2E_OCI_FINGERPRINT }}
      E2E_OCI_KEY_CONTENT: ${{ secrets.E2E_OCI_KEY_CONTENT }}
      E2E_OCI_REGION: ${{ secrets.E2E_OCI_REGION }}
      E2E_NEW_USER_PASSWORD: ${{ secrets.E2E_NEW_USER_PASSWORD }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v5.0.0
      - name: Create k8s Kind Cluster
        uses: helm/kind-action@v1
        with:
          cluster_name: kind
      - name: Modify kubeconfig
        run: |
            # Modify the kubeconfig to use the kind cluster server to https://kind-control-plane:6443
            # from worker service into docker-compose.yml
            kubectl config set-cluster kind-kind --server=https://kind-control-plane:6443
            kubectl config view
      - name: Add network kind to docker compose
        run: |
          # Add the network kind to the docker compose to interconnect to kind cluster
          yq -i '.networks.kind.external = true' docker-compose.yml
          # Add network kind to worker service and default network too
          yq -i '.services.worker.networks = ["kind","default"]' docker-compose.yml
      - name: Fix API data directory permissions
        run: docker run --rm -v $(pwd)/_data/api:/data alpine chown -R 1000:1000 /data
      - name: Add AWS credentials for testing AWS SDK Default Adding Provider
        run: |
          echo "Adding AWS credentials for testing AWS SDK Default Adding Provider..."
          echo "AWS_ACCESS_KEY_ID=${{ secrets.E2E_AWS_PROVIDER_ACCESS_KEY }}" >> .env
          echo "AWS_SECRET_ACCESS_KEY=${{ secrets.E2E_AWS_PROVIDER_SECRET_KEY }}" >> .env
      - name: Start API services
        run: |
          # Override docker-compose image tag to use latest instead of stable
          # This overrides any PROWLER_API_VERSION set in .env file
          export PROWLER_API_VERSION=latest
          echo "Using PROWLER_API_VERSION=${PROWLER_API_VERSION}"
          docker compose up -d api worker worker-beat
      - name: Wait for API to be ready
        run: |
          echo "Waiting for prowler-api..."
          timeout=150  # 5 minutes max
          elapsed=0
          while [ $elapsed -lt $timeout ]; do
            if curl -s ${NEXT_PUBLIC_API_BASE_URL}/docs >/dev/null 2>&1; then
              echo "Prowler API is ready!"
              exit 0
            fi
            echo "Waiting for prowler-api... (${elapsed}s elapsed)"
            sleep 5
            elapsed=$((elapsed + 5))
          done
          echo "Timeout waiting for prowler-api to start"
          exit 1
      - name: Load database fixtures for E2E tests
        run: |
          docker compose exec -T api sh -c '
            echo "Loading all fixtures from api/fixtures/dev/..."
            for fixture in api/fixtures/dev/*.json; do
              if [ -f "$fixture" ]; then
                echo "Loading $fixture"
                poetry run python manage.py loaddata "$fixture" --database admin
              fi
            done
            echo "All database fixtures loaded successfully!"
          '
      - name: Setup Node.js environment
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
        with:
          node-version: '20.x'
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
          run_install: false
      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
      - name: Setup pnpm cache
        uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('ui/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
      - name: Install UI dependencies
        working-directory: ./ui
        run: pnpm install --frozen-lockfile
      - name: Build UI application
        working-directory: ./ui
        run: pnpm run build
      - name: Cache Playwright browsers
        uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('ui/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-playwright-
      - name: Install Playwright browsers
        working-directory: ./ui
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: pnpm run test:e2e:install
      - name: Run E2E tests
        working-directory: ./ui
        run: pnpm run test:e2e
      - name: Upload test reports
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        if: failure()
        with:
          name: playwright-report
          path: ui/playwright-report/
          retention-days: 30
      - name: Cleanup services
        if: always()
        run: |
          echo "Shutting down services..."
          docker compose down -v || true
          echo "Cleanup completed"
```

--------------------------------------------------------------------------------

````
