---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 12
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 12 of 991)

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

---[FILE: cross-version-tests.yml]---
Location: mlflow-master/.github/workflows/cross-version-tests.yml

```yaml
name: Cross version tests
run-name: ${{ inputs.uuid }}

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
  workflow_dispatch:
    inputs:
      repository:
        description: >
          [Optional] Repository name with owner. For example, mlflow/mlflow.
           Defaults to the repository that triggered a workflow.
        required: false
        default: ""
      ref:
        description: >
          [Optional] The branch, tag or SHA to checkout. When checking out the repository that
           triggered a workflow, this defaults to the reference or SHA for that event. Otherwise,
           uses the default branch.
        required: false
        default: ""
      flavors:
        description: "[Optional] Comma-separated string specifying which flavors to test (e.g. 'sklearn, xgboost'). If unspecified, all flavors are tested."
        required: false
        default: ""
      versions:
        description: "[Optional] Comma-separated string specifying which versions to test (e.g. '1.2.3, 4.5.6'). If unspecified, all versions are tested."
        required: false
        default: ""
      uuid:
        description: "[Optional] A unique identifier for this run."
        required: false
        default: ""
  schedule:
    # Run this workflow daily at 13:00 UTC
    - cron: "0 13 * * *"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

env:
  MLFLOW_HOME: ${{ github.workspace }}
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt

jobs:
  set-matrix:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    if: github.event_name == 'workflow_dispatch' || (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    permissions:
      issues: read # listLabelsOnIssue
    outputs:
      matrix1: ${{ steps.set-matrix.outputs.matrix1 }}
      matrix2: ${{ steps.set-matrix.outputs.matrix2 }}
      is_matrix1_empty: ${{ steps.set-matrix.outputs.is_matrix1_empty }}
      is_matrix2_empty: ${{ steps.set-matrix.outputs.is_matrix2_empty }}
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - name: Install dependencies
        run: |
          pip install -r dev/requirements.txt
          pip install pytest pytest-cov
      - name: Check labels
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        id: check-labels
        with:
          script: |
            if (context.eventName !== "pull_request") {
              return {
                enable_dev_tests: true,
                only_latest: false,
              };
            }
            const labels = await github.rest.issues.listLabelsOnIssue({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            const labelNames = labels.data.map(({ name }) => name);
            return {
              enable_dev_tests: labelNames.includes("enable-dev-tests"),
              only_latest: labelNames.includes("only-latest"),
            };
      - name: Test set_matrix.py
        run: |
          python -m pytest --noconftest dev/tests
      - id: set-matrix
        name: Set matrix
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          EVENT_NAME="${{ github.event_name }}"
          if [ "$EVENT_NAME" = "pull_request" ]; then
            REPO="${{ github.repository }}"
            PR_NUMBER="${{ github.event.pull_request.number }}"
            BASE_REF="${{ github.base_ref }}"
            REF_VERSIONS_YAML="https://raw.githubusercontent.com/$REPO/$BASE_REF/mlflow/ml-package-versions.yml"
            CHANGED_FILES=$(python dev/list_changed_files.py --repository $REPO --pr-num $PR_NUMBER | grep -v '^mlflow/server/js' || true)
            ENABLE_DEV_TESTS="${{ fromJson(steps.check-labels.outputs.result).enable_dev_tests }}"
            NO_DEV_FLAG=$([ "$ENABLE_DEV_TESTS" == "true" ] && echo "" || echo "--no-dev")
            ONLY_LATEST="${{ fromJson(steps.check-labels.outputs.result).only_latest }}"
            ONLY_LATEST_FLAG=$([ "$ONLY_LATEST" == "true" ] && echo "--only-latest" || echo "")
            python dev/set_matrix.py --ref-versions-yaml $REF_VERSIONS_YAML --changed-files "$CHANGED_FILES" $NO_DEV_FLAG $ONLY_LATEST_FLAG
          elif [ "$EVENT_NAME" = "workflow_dispatch" ]; then
            python dev/set_matrix.py --flavors "${{ github.event.inputs.flavors }}" --versions "${{ github.event.inputs.versions }}"
          else
            python dev/set_matrix.py
          fi

  test1:
    needs: set-matrix
    if: ${{ needs.set-matrix.outputs.is_matrix1_empty == 'false' }}
    runs-on: ${{ matrix.runs_on }}
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.set-matrix.outputs.matrix1) }}
    steps: &test-steps
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/free-disk-space
        if: matrix.free_disk_space
      - uses: ./.github/actions/setup-python
        with:
          python-version: ${{ matrix.python }}
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
        with:
          java-version: ${{ matrix.java }}
      - name: Remove constraints
        run: |
          # Remove any constraints for the current package to prevent installation conflicts
          sed -i '/^${{ matrix.package }}/d' requirements/constraints.txt

          if ! git diff --exit-code requirements/constraints.txt; then
            git diff
            git config user.name 'mlflow-app[bot]'
            git config user.email 'mlflow-app[bot]@users.noreply.github.com'
            git add requirements/constraints.txt
            git commit -m "Remove constraints for testing"
          fi
      - name: Install mlflow & test dependencies
        run: |
          pip install -U pip wheel setuptools
          # For tracing SDK test, install the tracing package from the local path and minimal test dependencies
          if [[ "${{ matrix.category }}" == "tracing-sdk" ]]; then
            pip install libs/tracing
            pip install pytest pytest-asyncio pytest-cov
          # Other two categories of tests (model/autologging)
          else
            pip install .[extras]
            pip install -r requirements/test-requirements.txt
          fi
      - name: Install ${{ matrix.package }} ${{ matrix.version }}
        run: |
          ${{ matrix.install }}
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Pre-test
        if: matrix.pre_test
        run: |
          ${{ matrix.pre_test }}
      - name: Run tests
        env:
          MLFLOW_CONDA_HOME: /usr/share/miniconda
          SPARK_LOCAL_IP: localhost
          JOHNSNOWLABS_LICENSE_JSON: ${{ secrets.JOHNSNOWLABS_LICENSE_JSON }}
          HF_HUB_ENABLE_HF_TRANSFER: 1
        run: |
          ${{ matrix.run }}

  test2:
    needs: set-matrix
    if: ${{ needs.set-matrix.outputs.is_matrix2_empty == 'false' }}
    runs-on: ${{ matrix.runs_on }}
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix: ${{ fromJson(needs.set-matrix.outputs.matrix2) }}
    steps: *test-steps
```

--------------------------------------------------------------------------------

---[FILE: delete-artifact.js]---
Location: mlflow-master/.github/workflows/delete-artifact.js

```javascript
/**
 * Main function to handle documentation preview comments
 * @param {object} params - Parameters object containing context and github
 * @param {object} params.github - GitHub API client
 * @param {object} params.context - GitHub context
 * @param {object} params.env - Environment variables
 */
module.exports = async ({ github, context, env }) => {
  const artifactName = env.ARTIFACT_NAME;
  const runId = env.RUN_ID;

  if (!artifactName || !runId) {
    throw new Error("Missing required parameters: ARTIFACT_NAME, RUN_ID");
  }

  const { owner, repo } = context.repo;

  try {
    // INFO: https://octokit.github.io/rest.js/v22/#actions-list-workflow-run-artifacts
    const {
      data: { artifacts },
    } = await github.rest.actions.listWorkflowRunArtifacts({
      owner,
      repo,
      run_id: runId,
      name: artifactName,
    });

    const [artifact] = artifacts;

    // INFO: https://octokit.github.io/rest.js/v22/#actions-delete-artifact
    await github.rest.actions.deleteArtifact({
      owner,
      repo,
      artifact_id: artifact.id,
    });
  } catch (error) {
    console.error(`Could not find or delete the artifact for ${runId} and ${artifactName}`);
    throw error;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: dev-setup.yml]---
Location: mlflow-master/.github/workflows/dev-setup.yml

```yaml
name: Dev environment setup

on:
  push:
    paths:
      - "dev/dev-env-setup.sh"
      - "dev/test-dev-env-setup.sh"
      - ".github/workflows/dev-setup.yml"
  pull_request:
    paths:
      - "dev/dev-env-setup.sh"
      - "dev/test-dev-env-setup.sh"
      - ".github/workflows/dev-setup.yml"
  schedule:
    - cron: "42 7 * * 0"
  workflow_dispatch:
    inputs:
      repository:
        description: >
          [Optional] Repository name with owner. For example, mlflow/mlflow.
           Defaults to the repository that triggered a workflow.
        required: false
        default: ""
      ref:
        description: >
          [Optional] The branch, tag or SHA to checkout. When checking out the repository that
           triggered a workflow, this defaults to the reference or SHA for that event. Otherwise,
           uses the default branch.
        required: false
        default: ""

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  linux-env-setup:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    if: github.event_name != 'schedule' || github.repository == 'mlflow/dev'
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/free-disk-space
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - name: Setup environment
        run: |
          git config --global user.name "test"
          git config --global user.email "test@mlflow.org"
      - name: Run Environment tests
        run: |
          TERM=xterm bash ./dev/test-dev-env-setup.sh
```

--------------------------------------------------------------------------------

---[FILE: docs.yml]---
Location: mlflow-master/.github/workflows/docs.yml

```yaml
name: docs

on:
  push:
    paths:
      - pyproject.toml
      - uv.lock
      - mlflow/**
      - docs/**
      - .github/workflows/docs.yml
    branches:
      - master
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - pyproject.toml
      - uv.lock
      - mlflow/**
      - docs/**
      - .github/workflows/docs.yml

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash
    working-directory: docs

jobs:
  check:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-node
      - name: Install dependencies
        run: |
          npm ci
      - name: Run lint
        run: |
          npm run eslint
      - name: Run prettier
        run: |
          npm run prettier:check

  build:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-java
      - uses: ./.github/actions/setup-node
      - uses: ./.github/actions/setup-python
      - name: Install dependencies
        working-directory: .
        run: |
          uv sync --group docs --extra gateway
      - run: |
          npm ci
      - uses: ./.github/actions/show-versions
      - run: |
          npm run convert-notebooks
      - name: Set alias
        id: alias
        env:
          EVENT_NAME: ${{ github.event_name }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          if [ "$EVENT_NAME" = "push" ]; then
            ALIAS="dev"
          else
            ALIAS="pr-$PR_NUMBER"
          fi
          echo "value=$ALIAS" >> $GITHUB_OUTPUT
          echo "$ALIAS" > /tmp/alias.txt
          cat /tmp/alias.txt
      - name: Build docs
        env:
          GTM_ID: "GTM-TEST"
          API_REFERENCE_PREFIX: https://${{ steps.alias.outputs.value }}--mlflow-docs-preview.netlify.app/docs/
        run: |
          npm run build-all -- --no-r --use-npm
      - name: Check API inventory
        run: |
          if [ -n "$(git status --porcelain api_reference/api_inventory.txt)" ]; then
            echo "The API inventory file 'docs/api_reference/api_inventory.txt' is outdated (see the diff below)."
            echo "Please update it by running 'make rsthtml' in the 'docs/api_reference' directory."
            echo "If the new APIs should be marked as experimental, please decorate them with '@experimental'."
            echo "Diff:"
            git diff api_reference/api_inventory.txt
            exit 1
          fi
      - name: Check sitemap
        run: |
          npm run sitemap -- https://mlflow.org/docs/latest/sitemap.xml ./build/latest/sitemap.xml
      - name: Move build artifacts
        run: |
          mkdir -p /tmp/docs-build/docs
          mv build/latest /tmp/docs-build/docs/latest

          # Create `docs/versions.json` for the version selector in the API reference
          VERSION="$(uv version | cut -d' ' -f2)"
          echo "{\"versions\": [\"$VERSION\"]}" > /tmp/docs-build/docs/versions.json
      - name: Upload build artifacts
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: docs-build-${{ github.run_id }}
          path: /tmp/docs-build
          retention-days: 1
          if-no-files-found: error

      # `github.event.workflow_run.pull_requests` is empty when a PR is created from a fork:
      # https://github.com/orgs/community/discussions/25220#discussioncomment-11001085
      - uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: alias
          path: /tmp/alias.txt
          retention-days: 1
          if-no-files-found: error

  test-examples:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 30
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs/api_reference
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-python
      - name: Install dependencies
        working-directory: .
        run: |
          uv sync --group docs --extra gateway
      - name: Extract examples
        run: |
          uv run source/testcode_block.py
      - name: Run tests
        run: |
          uv run pytest .examples

  r:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - name: Build docs
        working-directory: docs/api_reference
        run: |
          ./build-rdoc.sh
          if [ -n "$(git status --porcelain)" ]; then
            echo "The following files have changed:"
            git status --porcelain
            exit 1
          fi
```

--------------------------------------------------------------------------------

---[FILE: examples.yml]---
Location: mlflow-master/.github/workflows/examples.yml
Signals: Docker

```yaml
name: Examples

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
  schedule:
    # Run this action daily at 13:00 UTC
    - cron: "0 13 * * *"
  workflow_dispatch:
    inputs:
      repository:
        description: >
          [Optional] Repository name with owner. For example, mlflow/mlflow.
           Defaults to the repository that triggered a workflow.
        required: false
        default: ""
      ref:
        description: >
          [Optional] The branch, tag or SHA to checkout. When checking out the repository that
           triggered a workflow, this defaults to the reference or SHA for that event. Otherwise,
           uses the default branch.
        required: false
        default: ""

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

env:
  MLFLOW_HOME: ${{ github.workspace }}
  MLFLOW_CONDA_HOME: /usr/share/miniconda
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PYTHONFAULTHANDLER: "1"

jobs:
  examples:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    if: github.event_name == 'workflow_dispatch' || (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2]
        include:
          - splits: 2
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/free-disk-space
      - name: Check diff
        id: check-diff
        if: github.event_name == 'pull_request'
        env:
          FORCE_RUN_EXAMPLES: ${{ contains(github.event.pull_request.labels.*.name, 'examples.yml') }}
        run: |
          REPO="${{ github.repository }}"
          PR_NUMBER="${{ github.event.pull_request.number }}"
          BASE_REF="${{ github.base_ref }}"
          CHANGED_FILES=$(python dev/list_changed_files.py --repository $REPO --pr-num $PR_NUMBER | grep "tests/examples\|examples" || true);
          if [ "$FORCE_RUN_EXAMPLES" = "true" ]; then
            EXAMPLES_CHANGED="true"
          else
            EXAMPLES_CHANGED=$([ ! -z "$CHANGED_FILES" ] && echo "true" || echo "false")
          fi

          echo -e "CHANGED_FILES:\n$CHANGED_FILES"
          echo "EXAMPLES_CHANGED: $EXAMPLES_CHANGED"
          echo "examples_changed=$EXAMPLES_CHANGED" >> $GITHUB_OUTPUT

      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv

      - name: Install dependencies
        if: ${{ github.event_name == 'schedule' || github.event_name == 'workflow_dispatch' || steps.check-diff.outputs.examples_changed == 'true' }}
        run: |
          source ./dev/install-common-deps.sh --ml
          pip install fastapi uvicorn tf-keras
          sudo apt-get update -y
          # Required for the transformers example that uses the Whisper model
          sudo apt-get install -y ffmpeg

      - name: Run example tests
        if: ${{ github.event_name == 'schedule' || github.event_name == 'workflow_dispatch' || steps.check-diff.outputs.examples_changed == 'true' }}
        env:
          SPARK_LOCAL_IP: localhost
        run: |
          pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} --serve-wheel tests/examples --durations=30

      - name: Remove conda environments
        run: |
          ./dev/remove-conda-envs.sh

      - name: Show disk usage
        run: |
          df -h

  docker:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    if: github.event_name == 'workflow_dispatch' || (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - name: Check diff
        id: check-diff
        if: github.event_name == 'pull_request'
        run: |
          REPO="${{ github.repository }}"
          PR_NUMBER="${{ github.event.pull_request.number }}"
          CHANGED_FILES=$(python dev/list_changed_files.py --repository $REPO --pr-num $PR_NUMBER | grep "Dockerfile\|\.dockerignore" || true);
          DOCKER_CHANGED=$([[ ! -z "$CHANGED_FILES" ]] && echo "true" || echo "false")
          echo -e "CHANGED_FILES:\nCHANGED_FILES"
          echo "DOCKER_CHANGED: $DOCKER_CHANGED"
          echo "docker_changed=$DOCKER_CHANGED" >> $GITHUB_OUTPUT

      - name: Run docker tests
        if: ${{ github.event_name == 'schedule' || github.event_name == 'workflow_dispatch' || steps.check-diff.outputs.docker_changed == 'true' }}
        run: |
          docker build -t mlflow_test_build . && docker images | grep mlflow_test_build

      - name: Show disk usage
        run: |
          df -h
```

--------------------------------------------------------------------------------

---[FILE: js.yml]---
Location: mlflow-master/.github/workflows/js.yml
Signals: React

```yaml
name: JS

on:
  push:
    paths:
      - mlflow/server/js/**
      - .github/workflows/js.yml
    branches:
      - master
      - branch-[0-9]+.[0-9]+
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - mlflow/server/js/**
      - .github/workflows/js.yml

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  js:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
        option: [--testPathPattern, --testPathIgnorePatterns]
        include:
          - os: ubuntu-latest
            shell: bash
          - os: windows-latest
            shell: pwsh
    runs-on: ${{ matrix.os }}
    defaults:
      run:
        shell: ${{ matrix.shell }}
        working-directory: mlflow/server/js
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-node
      - name: Disable problem matcher
        if: runner.os == 'Windows'
        run: |
          echo "::remove-matcher owner=eslint-compact::"
          echo "::remove-matcher owner=eslint-stylish::"
      - name: Install dependencies (windows)
        if: runner.os == 'Windows'
        run: |
          # On Windows, `yarn install` changes hash of @databricks/design-system in yarn.lock.
          # Use `--no-immutable` to allow the change.
          yarn install --no-immutable
          git diff
      - name: Install dependencies (non-windows)
        if: runner.os != 'Windows'
        run: |
          yarn install --immutable
      - name: Run lint
        run: |
          yarn lint
      - name: Run prettier
        run: |
          yarn prettier:check
      # TODO: Disabled for now. Revisit after DAIS.
      # - name: Run knip
      #   run: |
      #     yarn knip
      - name: Run extract-i18n lint
        run: |
          yarn i18n:check
      - name: Run type-check
        run: |
          yarn type-check
      - name: Run tests
        run: |
          yarn test ${{ runner.os == 'Windows' && '--testTimeout=10000' || '' }} --silent ${{ matrix.option }} src/experiment-tracking/components
      - name: Run build
        if: runner.os == 'Linux'
        env:
          # Prevent warnings (emitted from react-pdf) from being treated as errors
          # https://github.com/wojtekmaj/react-pdf/issues/280
          CI: false
        run: |
          yarn build
```

--------------------------------------------------------------------------------

---[FILE: labeling.js]---
Location: mlflow-master/.github/workflows/labeling.js

```javascript
module.exports = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  const { body, number: issue_number } = context.payload.issue || context.payload.pull_request;
  const pattern = /- \[(.*?)\]\s*`(.+?)`/g;
  // Labels extracted from the issue/PR body
  const bodyLabels = [];
  let match;
  while ((match = pattern.exec(body)) !== null) {
    bodyLabels.push({ checked: match[1].trim().toLowerCase() === "x", name: match[2].trim() });
  }
  console.log("Body labels:", bodyLabels);

  const events = await github.paginate(github.rest.issues.listEvents, {
    owner,
    repo,
    issue_number,
  });
  // Labels added or removed by a user
  const userLabels = events
    .filter(({ event, actor }) => ["labeled", "unlabeled"].includes(event) && actor.type === "User")
    .map(({ label }) => label.name);
  console.log("User labels:", userLabels);

  // Labels available in the repository
  const repoLabels = (
    await github.paginate(github.rest.issues.listLabelsForRepo, {
      owner,
      repo,
    })
  ).map(({ name }) => name);

  // Exclude labels that are not available in the repository or have been added/removed by a user
  const labels = bodyLabels.filter(
    ({ name }) => repoLabels.includes(name) && !userLabels.includes(name)
  );
  console.log("Labels to add/remove:", labels);

  const existingLabels = (
    await github.paginate(github.rest.issues.listLabelsOnIssue, {
      owner,
      repo,
      issue_number,
    })
  ).map(({ name }) => name);
  console.log("Existing labels:", existingLabels);

  const labelsToAdd = labels
    .filter(({ name, checked }) => checked && !existingLabels.includes(name))
    .map(({ name }) => name);
  console.log("Labels to add:", labelsToAdd);
  if (labelsToAdd.length > 0) {
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: labelsToAdd,
    });
  }

  const labelsToRemove = labels
    .filter(({ name, checked }) => !checked && existingLabels.includes(name))
    .map(({ name }) => name);
  console.log("Labels to remove:", labelsToRemove);
  if (labelsToRemove.length > 0) {
    const results = await Promise.allSettled(
      labelsToRemove.map((name) =>
        github.rest.issues.removeLabel({
          owner,
          repo,
          issue_number,
          name,
        })
      )
    );
    for (const { status, reason } of results) {
      if (status === "rejected") {
        console.error(reason);
      }
    }
  }
};
```

--------------------------------------------------------------------------------

---[FILE: labeling.yml]---
Location: mlflow-master/.github/workflows/labeling.yml

```yaml
name: Labeling

on:
  issues:
    types:
      - opened
      - edited
  pull_request_target:
    types:
      - opened
      - edited
      - ready_for_review

defaults:
  run:
    shell: bash

jobs:
  labeling:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-slim
    permissions:
      pull-requests: write
      issues: write
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require('./.github/workflows/labeling.js');
            await script({ github, context });
```

--------------------------------------------------------------------------------

---[FILE: link-checker.yml]---
Location: mlflow-master/.github/workflows/link-checker.yml

```yaml
name: External Link Checker

on:
  schedule:
    # Runs at 00:00 UTC every day
    - cron: "0 13 * * *"
  workflow_dispatch: # Allow manual runs
  pull_request:
    paths:
      - ".github/workflows/link-checker.yml"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash
    working-directory: docs

jobs:
  check-external-links:
    # Only run on the main repository
    if: github.repository == 'mlflow/mlflow'
    permissions:
      contents: read
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-node
        with:
          cache: "npm"
          cache-dependency-path: docs/package-lock.json
      - name: Install dependencies
        run: |
          npm ci
      - name: Run external links checker
        run: |
          npm run check-links
```

--------------------------------------------------------------------------------

---[FILE: lint.yml]---
Location: mlflow-master/.github/workflows/lint.yml

```yaml
name: Lint

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
  push:
    branches:
      - master
      - branch-[0-9]+.[0-9]+
  merge_group:
    types:
      - checks_requested

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

env:
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt

jobs:
  lint:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    timeout-minutes: 30
    permissions:
      contents: read
      pull-requests: read
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    name: ${{ matrix.os == 'ubuntu-latest' && 'lint' || 'lint-macos' }}
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          # To ensure `git diff` works correctly in dev/check_function_signatures.py,
          # we need to fetch enough history to include the base branch.
          fetch-depth: 300
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
        id: setup-python
      - name: Add problem matchers
        if: matrix.os == 'ubuntu-latest'
        run: |
          echo "::add-matcher::.github/workflows/matchers/clint.json"
          echo "::add-matcher::.github/workflows/matchers/format.json"
          echo "::add-matcher::.github/workflows/matchers/ruff.json"
          echo "::add-matcher::.github/workflows/matchers/typos.json"
      - name: Install dependencies
        run: |
          uv sync --locked --only-group lint --only-group test
      - name: Install pre-commit hooks
        run: |
          uv run --only-group lint pre-commit install --install-hooks
          uv run --only-group lint pre-commit run install-bin -a -v
      - name: Run pre-commit
        id: pre-commit
        env:
          IS_MAINTAINER: ${{ contains(fromJSON('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.pull_request.author_association )}}
          NO_FIX: "true"
        run: |
          uv run --only-group lint pre-commit run --all-files

      - name: Test clint
        run: |
          uv run --only-group test pytest dev/clint

      - name: Check function signatures
        if: matrix.os == 'ubuntu-latest'
        run: |
          uv run --no-project dev/check_function_signatures.py

      - name: Check whitespace-only changes
        if: matrix.os == 'ubuntu-latest' && github.event_name == 'pull_request'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          uv run --no-project dev/check_whitespace_only.py \
            --repo ${{ github.repository }} \
            --pr ${{ github.event.pull_request.number }}

      - name: Check unused media
        run: |
          dev/find-unused-media.sh
```

--------------------------------------------------------------------------------

---[FILE: maintainer-approval.yml]---
Location: mlflow-master/.github/workflows/maintainer-approval.yml

```yaml
name: Maintainer approval

on:
  pull_request_target:

defaults:
  run:
    shell: bash

jobs:
  check:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      pull-requests: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: Fail without core maintainer approval
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require(`${process.env.GITHUB_WORKSPACE}/.github/workflows/require-core-maintainer-approval.js`);
            await script({ context, github, core });
```

--------------------------------------------------------------------------------

````
