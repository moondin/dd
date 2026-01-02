---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 13
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 13 of 991)

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

---[FILE: master.yml]---
Location: mlflow-master/.github/workflows/master.yml
Signals: Docker

```yaml
name: MLflow tests

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

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

# Use `bash` by default for all `run` steps in this workflow:
# https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#defaultsrun
defaults:
  run:
    shell: bash

env:
  MLFLOW_HOME: ${{ github.workspace }}
  # Note miniconda is pre-installed in the virtual environments for GitHub Actions:
  # https://github.com/actions/virtual-environments/blob/main/images/linux/scripts/installers/miniconda.sh
  MLFLOW_CONDA_HOME: /usr/share/miniconda
  SPARK_LOCAL_IP: localhost
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt
  PYTHONUTF8: "1"
  _MLFLOW_TESTING_TELEMETRY: "true"
  MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"

jobs:
  # python-skinny tests cover a subset of mlflow functionality
  # that is meant to be supported with a smaller dependency footprint.
  # The python skinny tests cover the subset of mlflow functionality
  # while also verifying certain dependencies are omitted.
  python-skinny:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh --skinny
      - name: Run tests
        run: |
          ./dev/run-python-skinny-tests.sh

  python:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2, 3]
        include:
          - splits: 3
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/free-disk-space
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --extra extras --extra gateway --extra mcp --extra genai
          uv pip install \
            -r requirements/test-requirements.txt \
            -r requirements/extra-ml-requirements.txt
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Import check
        run: |
          # `-I` is used to avoid importing modules from user-specific site-packages
          # that might conflict with the built-in modules (e.g. `types`).
          uv run --no-sync python -I tests/check_mlflow_lazily_imports_ml_packages.py
      - name: Run tests
        run: |
          source dev/setup-ssh.sh
          uv run --no-sync pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} \
            --quiet --requires-ssh --ignore-flavors \
            --ignore=tests/examples \
            --ignore=tests/evaluate \
            --ignore=tests/genai \
            tests

      - name: Run databricks-connect related tests
        run: |
          # this needs to be run in a separate job because installing databricks-connect could break other
          # tests that uses normal SparkSession instead of remote SparkSession
          uv run --no-sync --with databricks-agents \
            pytest tests/utils/test_requirements_utils.py::test_infer_pip_requirements_on_databricks_agents

  database:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 90
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - name: Build
        run: |
          ./tests/db/compose.sh pull -q postgresql mysql mssql
          docker images --digests
          ./tests/db/compose.sh build --build-arg DEPENDENCIES="$(python dev/extract_deps.py)"
      - name: Run tests
        run: |
          set +e
          err=0
          trap 'err=1' ERR
          RESULTS=""
          for service in $(./tests/db/compose.sh config --services | grep '^mlflow-' | sort)
          do
            # Set `--no-TTY` to show container logs on GitHub Actions:
            # https://github.com/actions/virtual-environments/issues/5022
            ./tests/db/compose.sh run --rm --no-TTY $service pytest \
              tests/store/tracking/test_sqlalchemy_store.py \
              tests/store/tracking/test_gateway_sql_store.py \
              tests/store/model_registry/test_sqlalchemy_store.py \
              tests/db
              RESULTS="$RESULTS\n$service: $(if [ $? -eq 0 ]; then echo "✅"; else echo "❌"; fi)"
          done

          echo -e "$RESULTS"
          test $err = 0

      - name: Run migration check
        run: |
          set +e
          err=0
          trap 'err=1' ERR

          ./tests/db/compose.sh down --volumes --remove-orphans
          for service in $(./tests/db/compose.sh config --services | grep '^migration-')
          do
            ./tests/db/compose.sh run --rm --no-TTY $service
          done

          test $err = 0

      - name: Clean up
        run: |
          ./tests/db/compose.sh down --volumes --remove-orphans --rmi all

  java:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-java
        with:
          java-version: 11
      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          cd mlflow/java
          mvn clean package -q

  flavors:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --extra extras
          uv pip install \
            -r requirements/test-requirements.txt \
            -r requirements/extra-ml-requirements.txt
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          uv run --no-sync pytest \
            tests/tracking/fluent/test_fluent_autolog.py \
            tests/autologging

  models:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2]
        include:
          - splits: 2
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/free-disk-space
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --extra mlserver
          uv pip install \
            -r requirements/test-requirements.txt \
            pyspark langchain langchain-community
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          uv run --no-sync pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} tests/models

  evaluate:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 90
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2]
        include:
          - splits: 2
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --extra extras --extra genai
          uv pip install \
            -r requirements/test-requirements.txt \
            torch transformers pyspark langchain langchain-experimental 'shap<0.47.0' lightgbm xgboost
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          uv run --no-sync pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} tests/evaluate --ignore=tests/evaluate/test_default_evaluator_delta.py
      - name: Run tests with delta
        run: |
          uv run --no-sync pytest tests/evaluate/test_default_evaluator_delta.py

  genai:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh
          pip install openai dspy deepeval litellm ragas
      - uses: ./.github/actions/show-versions
      - name: Run GenAI Tests (OSS)
        run: |
          pytest tests/genai

      - name: Run GenAI Tests (Databricks)
        run: |
          pip install databricks-agents
          pytest tests/genai --ignore tests/genai/test_genai_import_without_agent_sdk.py \
            --ignore tests/genai/optimize --ignore tests/genai/prompts

      - name: Run Tests with Local Spark Session
        run: |
          # databricks-agents installs databricks-connect that blocks us from running spark-related
          # tests with local spark session. To work around this, we run skipped tests after
          # uninstalling databricks-connect.
          pip uninstall -y databricks-connect pyspark
          pip install pyspark
          pytest tests/genai/evaluate/test_utils.py

  pyfunc:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2, 3, 4]
        include:
          - splits: 4
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/free-disk-space
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --extra extras --extra gateway
          uv pip install \
            -r requirements/test-requirements.txt \
            tensorflow 'pyspark[connect]'
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          uv run --no-sync pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} --durations=30 \
            tests/pyfunc tests/types --ignore tests/pyfunc/test_spark_connect.py

          # test_spark_connect.py fails if it's run with other tests, so run it separately.
          uv run --no-sync pytest tests/pyfunc/test_spark_connect.py

  windows:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: windows-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2, 3, 4]
        include:
          - splits: 4
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install python dependencies
        run: |
          uv sync --extra extras --extra genai --extra mcp
          uv pip install \
            -r requirements/test-requirements.txt \
            pyspark datasets tensorflow torch transformers tf-keras openai \
            tests/resources/mlflow-test-plugin
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Download Hadoop winutils for Spark
        run: |
          git clone https://github.com/cdarlint/winutils /tmp/winutils
      - name: Run python tests
        env:
          # Starting from SQLAlchemy version 2.0, `QueuePool` is the default connection pool
          # when creating an `Engine`. `QueuePool` prevents the removal of temporary database
          # files created during tests on Windows as it keeps the DB connection open until
          # it's explicitly disposed.
          MLFLOW_SQLALCHEMYSTORE_POOLCLASS: "NullPool"
        run: |
          # Set Hadoop environment variables required for testing Spark integrations on Windows
          export HADOOP_HOME=/tmp/winutils/hadoop-3.2.2
          export PATH=$PATH:$HADOOP_HOME/bin

          # Define function to run pytest with common arguments
          run_pytest() {
            uv run --no-sync pytest "$@" \
              --ignore-flavors \
              --ignore=tests/projects \
              --ignore=tests/examples \
              --ignore=tests/evaluate \
              --ignore=tests/optuna \
              --ignore=tests/pyspark/optuna \
              --ignore=tests/genai \
              --ignore=tests/sagemaker \
              --ignore=tests/gateway \
              --ignore=tests/server/auth \
              --ignore=tests/data/test_spark_dataset.py \
              tests
          }

          # Run Windows tests
          # Retry failed tests once to handle flaky tests on Windows
          set +e
          run_pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }}
          status=$?
          set -e
          if [ $status -ne 0 ]; then
            echo "Retrying failed tests..."
            run_pytest --last-failed
          fi
```

--------------------------------------------------------------------------------

---[FILE: patch.js]---
Location: mlflow-master/.github/workflows/patch.js

```javascript
// Helper function to parse semantic version for comparison
function parseSemanticVersion(version) {
  const versionStr = version.replace(/^v/, "");
  const cleanVersion = versionStr.replace(/rc\d+$/, "");
  const parts = cleanVersion.split(".").map(Number);

  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    micro: parts[2] || 0,
    isRc: versionStr.includes("rc"),
    original: version,
  };
}

// Helper function to compare versions for sorting
function compareVersions(a, b) {
  const versionA = parseSemanticVersion(a.tag_name);
  const versionB = parseSemanticVersion(b.tag_name);

  // Compare major.minor.micro in descending order
  if (versionA.major !== versionB.major) {
    return versionB.major - versionA.major;
  }
  if (versionA.minor !== versionB.minor) {
    return versionB.minor - versionA.minor;
  }
  if (versionA.micro !== versionB.micro) {
    return versionB.micro - versionA.micro;
  }

  // If versions are equal, prefer non-rc over rc
  if (versionA.isRc !== versionB.isRc) {
    return versionA.isRc ? 1 : -1;
  }

  return 0;
}

module.exports = async ({ context, github, core }) => {
  const { owner, repo } = context.repo;
  const { base, number: pull_number } = context.payload.pull_request;
  if (base.ref.match(/^branch-\d+\.\d+$/)) {
    return;
  }

  const pr = await github.rest.pulls.get({
    owner,
    repo,
    pull_number,
  });
  const { body } = pr.data;

  // Skip running this check if PR is filed by a bot (except GitHub Copilot)
  if (pr.data.user?.type?.toLowerCase() === "bot" && pr.data.user?.login !== "Copilot") {
    core.info(
      `Skipping processing because the PR is filed by a bot: ${pr.data.user?.login || "unknown"}`
    );
    return;
  }

  // Skip running this check on CD automation PRs
  if (!body || body.trim() === "") {
    core.info("Skipping processing because the PR has no body.");
    return;
  }

  const yesRegex = /- \[( |x)\] yes \(this PR will be/gi;
  const yesMatches = [...body.matchAll(yesRegex)];
  const yesMatch = yesMatches.length > 0 ? yesMatches[yesMatches.length - 1] : null;
  const yes = yesMatch ? yesMatch[1].toLowerCase() === "x" : false;
  const noRegex = /- \[( |x)\] no \(this PR will be/gi;
  const noMatches = [...body.matchAll(noRegex)];
  const noMatch = noMatches.length > 0 ? noMatches[noMatches.length - 1] : null;
  const no = noMatch ? noMatch[1].toLowerCase() === "x" : false;

  if (yes && no) {
    core.setFailed(
      "Both yes and no are selected. Please select only one in the `Should this PR be included in the next patch release?` section."
    );
    return;
  }

  if (!yes && !no) {
    core.setFailed(
      "Please fill in the `Should this PR be included in the next patch release?` section."
    );
    return;
  }

  if (no) {
    return;
  }

  // Check if a version label already exists
  const existingLabels = await github.rest.issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: context.payload.pull_request.number,
  });

  const versionLabelPattern = /^v\d+\.\d+\.\d+$/;
  const existingVersionLabel = existingLabels.data.find((label) =>
    versionLabelPattern.test(label.name)
  );

  if (existingVersionLabel) {
    core.info(
      `Version label ${existingVersionLabel.name} already exists on this PR. Skipping label addition.`
    );
    return;
  }

  const releases = await github.rest.repos.listReleases({
    owner,
    repo,
  });

  // Filter version tags that start with 'v', sort by semantic version, and select the latest
  const versionReleases = releases.data.filter(({ tag_name }) => tag_name.startsWith("v"));
  const sortedReleases = versionReleases.sort(compareVersions);
  const latest = sortedReleases[0];
  const version = latest.tag_name.replace("v", "");
  const [major, minor, micro] = version.replace(/rc\d+$/, "").split(".");
  const nextMicro = version.includes("rc") ? micro : (parseInt(micro) + 1).toString();
  const label = `v${major}.${minor}.${nextMicro}`;
  await github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: context.payload.pull_request.number,
    labels: [label],
  });
};
```

--------------------------------------------------------------------------------

---[FILE: patch.yml]---
Location: mlflow-master/.github/workflows/patch.yml

```yaml
name: Patch

on:
  pull_request_target:
    types:
      - opened
      - edited
      - synchronize

defaults:
  run:
    shell: bash

jobs:
  patch:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    timeout-minutes: 120
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require('./.github/workflows/patch.js');
            await script({ github, context, core });
```

--------------------------------------------------------------------------------

---[FILE: preview-comment.js]---
Location: mlflow-master/.github/workflows/preview-comment.js

```javascript
/**
 * Script to manage documentation preview comments on pull requests.
 */

const path = require("path");

const MARKER = "<!-- documentation preview -->";

/**
 * Check if a URL is accessible
 * @param {string} url - URL to check
 * @returns {Promise<boolean|undefined>} True if the URL is accessible (200 or 3xx), false otherwise; undefined if an error occurs
 */
async function isUrlAccessible(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    // treat 200 and 3xx as "accessible", 404 as "missing"
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch (e) {
    console.error(`Error checking accessibility for ${url}:`, e);
    return undefined;
  }
}

/**
 * Fetch changed files from a pull request
 * @param {object} params - Parameters object
 * @param {object} params.github - GitHub API client
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.pullNumber - Pull request number
 * @returns {Promise<Array<{filename: string, status: string}>>} Array of changed file objects with filename and status
 */
async function fetchChangedFiles({ github, owner, repo, pullNumber }) {
  const iterator = github.paginate.iterator(github.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });

  const changedFiles = [];
  for await (const { data } of iterator) {
    changedFiles.push(...data.map(({ filename, status }) => ({ filename, status })));
  }

  return changedFiles;
}

/**
 * Get changed documentation pages from the list of changed files
 * @param {Array<{filename: string, status: string}>} changedFiles - Array of changed file objects
 * @returns {Array<{page: string, status: string}>} Array of documentation page objects with page path and status, sorted alphabetically by page path
 */
function getChangedDocPages(changedFiles) {
  const DOCS_DIR = "docs/docs/";
  const changedPages = [];

  for (const { filename, status } of changedFiles) {
    const ext = path.extname(filename);
    if (ext !== ".md" && ext !== ".mdx") continue;
    if (!filename.startsWith(DOCS_DIR)) continue;

    const relativePath = path.relative(DOCS_DIR, filename);
    const { dir, name, base } = path.parse(relativePath);

    let pagePath;
    if (base === "index.mdx") {
      pagePath = dir;
    } else {
      pagePath = path.join(dir, name);
    }

    // Adjust classic-ml/ to ml/
    pagePath = pagePath.replace(/^classic-ml/, "ml");

    // Ensure forward slashes for web paths
    pagePath = pagePath.split(path.sep).join("/");

    changedPages.push({ page: pagePath, status });
  }

  // Sort alphabetically by page path for easier lookup
  changedPages.sort((a, b) => a.page.localeCompare(b.page));

  return changedPages;
}

/**
 * Create or update a PR comment with documentation preview information
 * @param {object} params - Parameters object
 * @param {object} params.github - GitHub API client
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.pullNumber - Pull request number
 * @param {string} params.commentBody - Comment body content
 */
async function upsertComment({ github, owner, repo, pullNumber, commentBody }) {
  // Get existing comments on the PR
  const { data: comments } = await github.rest.issues.listComments({
    owner,
    repo,
    issue_number: pullNumber,
    per_page: 100,
  });

  // Find existing preview docs comment
  const existingComment = comments.find((comment) => comment.body.includes(MARKER));
  const commentBodyWithMarker = `${MARKER}\n\n${commentBody}`;

  if (!existingComment) {
    console.log("Creating comment");
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: commentBodyWithMarker,
    });
  } else {
    console.log("Updating comment");
    await github.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: commentBodyWithMarker,
    });
  }
}

/**
 * Generate the comment template for documentation preview
 * @param {object} params - Parameters object
 * @param {string} params.commitSha - Git commit SHA
 * @param {string} params.workflowRunLink - Link to the workflow run
 * @param {string} params.docsWorkflowRunUrl - Link to the docs workflow run
 * @param {string} params.mainMessage - Main message content
 * @param {Array<{link: string, status: string, isAccessible?: boolean}>} params.changedPages - Array of changed documentation page objects with link, status, and optional accessibility flag
 * @returns {string} Comment template
 */
function getCommentTemplate({
  commitSha,
  workflowRunLink,
  docsWorkflowRunUrl,
  mainMessage,
  changedPages,
}) {
  let changedPagesSection = "";

  if (changedPages && changedPages.length > 0) {
    const pageLinks = changedPages
      .map(({ link, status, isAccessible }) => {
        let statusText = status;
        // Add warning or success indicator for removed and renamed files
        if (status === "removed" || status === "renamed") {
          if (isAccessible === true) {
            statusText = `${status}, ✅ redirect exists`;
          } else if (isAccessible === false) {
            statusText = `${status}, ❌ add a redirect`;
          } else {
            // If accessibility check failed
            statusText = `${status}, ⚠️ failed to check`;
          }
        }
        return `- ${link} (${statusText})`;
      })
      .join("\n");

    // Only collapse if there are more than 5 changed pages
    if (changedPages.length > 5) {
      changedPagesSection = `

<details>
<summary>Changed Pages (${changedPages.length})</summary>

${pageLinks}

</details>
`;
    } else {
      changedPagesSection = `

**Changed Pages (${changedPages.length})**

${pageLinks}
`;
    }
  }

  return `
Documentation preview for ${commitSha} ${mainMessage}
${changedPagesSection}
<details>
<summary>More info</summary>

- Ignore this comment if this PR does not change the documentation.
- The preview is updated when a new commit is pushed to this PR.
- This comment was created by [this workflow run](${workflowRunLink}).
- The documentation was built by [this workflow run](${docsWorkflowRunUrl}).

</details>
`;
}

/**
 * Main function to handle documentation preview comments
 * @param {object} params - Parameters object containing context and github
 * @param {object} params.github - GitHub API client
 * @param {object} params.context - GitHub context
 * @param {object} params.env - Environment variables
 */
module.exports = async ({ github, context, env }) => {
  const commitSha = env.COMMIT_SHA;
  const pullNumber = env.PULL_NUMBER;
  const workflowRunId = env.WORKFLOW_RUN_ID;
  const stage = env.STAGE;
  const netlifyUrl = env.NETLIFY_URL;
  const docsWorkflowRunUrl = env.DOCS_WORKFLOW_RUN_URL;

  // Validate required parameters
  if (!commitSha || !pullNumber || !workflowRunId || !stage || !docsWorkflowRunUrl) {
    throw new Error(
      "Missing required parameters: commit-sha, pull-number, workflow-run-id, stage, docs-workflow-run-url"
    );
  }

  if (!["completed", "failed"].includes(stage)) {
    throw new Error("Stage must be either 'completed' or 'failed'");
  }

  if (stage === "completed" && !netlifyUrl) {
    throw new Error("netlify-url is required for completed stage");
  }

  const { owner, repo } = context.repo;
  const workflowRunLink = `https://github.com/${owner}/${repo}/actions/runs/${workflowRunId}`;

  let mainMessage;
  let changedPages = [];

  if (stage === "completed") {
    mainMessage = `is available at:\n\n- ${netlifyUrl}`;

    // Fetch changed files and get documentation pages
    try {
      const changedFiles = await fetchChangedFiles({ github, owner, repo, pullNumber });
      const docPages = getChangedDocPages(changedFiles);

      // Convert to clickable links with status if we have changed pages
      if (docPages.length > 0) {
        changedPages = await Promise.all(
          docPages.map(async ({ page, status }) => {
            const pageUrl = `${netlifyUrl}/${page}`;
            const link = `[${page}](${pageUrl})`;

            // Check accessibility for removed or renamed pages
            let isAccessible;
            if (status === "removed" || status === "renamed") {
              isAccessible = await isUrlAccessible(pageUrl);
            }

            return {
              link,
              status,
              isAccessible,
            };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching changed files:", error);
      // Continue without changed pages list
    }
  } else if (stage === "failed") {
    mainMessage = "failed to build or deploy.";
  }

  const commentBody = getCommentTemplate({
    commitSha,
    workflowRunLink,
    docsWorkflowRunUrl,
    mainMessage,
    changedPages,
  });
  await upsertComment({ github, owner, repo, pullNumber, commentBody });
};
```

--------------------------------------------------------------------------------

---[FILE: preview-docs.yml]---
Location: mlflow-master/.github/workflows/preview-docs.yml

```yaml
name: Preview docs

on:
  workflow_run:
    workflows: [docs]
    types: [completed]

defaults:
  run:
    shell: bash

jobs:
  main:
    if: github.repository == 'mlflow/mlflow'
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # To post comments on PRs
      actions: write # To delete artifacts
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: Download alias
        uses: actions/download-artifact@95815c38cf2ff2164869cbab79da8d1f422bc89e # v4.2.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
          name: alias
          path: /tmp
      - name: Set alias
        id: alias
        run: |
          cat /tmp/alias.txt
          echo "value=$(cat /tmp/alias.txt)" >> $GITHUB_OUTPUT
      - name: Download build artifact
        uses: actions/download-artifact@95815c38cf2ff2164869cbab79da8d1f422bc89e # v4.2.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
          name: docs-build-${{ github.event.workflow_run.id }}
          path: downloaded-artifact
      - uses: ./.github/actions/setup-node
      - name: Deploy to Netlify
        id: netlify_deploy
        working-directory: downloaded-artifact
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          ALIAS: ${{ steps.alias.outputs.value }}
          RUN_ID: ${{ github.run_id }}
        run: |-
          OUTPUT=$(npx -y netlify-cli deploy \
            --dir=. \
            --no-build \
            --message="Preview ${ALIAS} - GitHub Run ID: $RUN_ID" \
            --alias="${ALIAS}" \
            --json)
          DEPLOY_URL=$(echo "$OUTPUT" | jq -r '.deploy_url')
          echo "deploy_url=${DEPLOY_URL}/docs/latest/" >> $GITHUB_OUTPUT
        continue-on-error: true
      - name: Extract PR number
        id: pr_number
        if: startsWith(steps.alias.outputs.value, 'pr-')
        env:
          ALIAS: ${{ steps.alias.outputs.value }}
        run: |
          # Extract number from alias (e.g., "pr-123" -> "123")
          PR_NUM=$(echo "$ALIAS" | sed 's/^pr-//')
          echo "value=$PR_NUM" >> $GITHUB_OUTPUT
          echo "Extracted PR number: $PR_NUM"
      - name: Create preview link
        if: startsWith(steps.alias.outputs.value, 'pr-')
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        env:
          COMMIT_SHA: ${{ github.event.workflow_run.head_sha }}
          PULL_NUMBER: ${{ steps.pr_number.outputs.value }}
          WORKFLOW_RUN_ID: ${{ github.run_id }}
          STAGE: ${{ steps.netlify_deploy.outcome == 'success' && 'completed' || 'failed' }}
          NETLIFY_URL: ${{ steps.netlify_deploy.outputs.deploy_url }}
          DOCS_WORKFLOW_RUN_URL: ${{ github.event.workflow_run.html_url }}
        with:
          script: |
            const script = require(
              `${process.env.GITHUB_WORKSPACE}/.github/workflows/preview-comment.js`
            );
            await script({ context, github, env: process.env });
      - name: Delete Build Artifact
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        env:
          RUN_ID: ${{ github.event.workflow_run.id }}
          ARTIFACT_NAME: docs-build-${{ github.event.workflow_run.id }}
        with:
          script: |
            const script = require(
              `${process.env.GITHUB_WORKSPACE}/.github/workflows/delete-artifact.js`
            );
            await script({ context, github, env: process.env });
```

--------------------------------------------------------------------------------

---[FILE: protect.js]---
Location: mlflow-master/.github/workflows/protect.js

```javascript
function getSleepLength(iterationCount, numPendingJobs) {
  if (iterationCount <= 5 && numPendingJobs <= 5) {
    // It's likely that this job was triggered with other quick jobs.
    // To minimize the wait time, shorten the polling interval for the first 5 iterations.
    return 5 * 1000; // 5 seconds
  }
  // If the number of pending jobs is small, poll more frequently to reduce wait time.
  return (numPendingJobs <= 7 ? 30 : 5 * 60) * 1000;
}
module.exports = async ({ github, context }) => {
  const {
    repo: { owner, repo },
  } = context;
  const { sha } = context.payload.pull_request.head;

  const STATE = {
    pending: "pending",
    success: "success",
    failure: "failure",
  };

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function logRateLimit() {
    const { data: rateLimit } = await github.rest.rateLimit.get();
    console.log(`Rate limit remaining: ${rateLimit.resources.core.remaining}`);
  }

  function isNewerRun(newRun, existingRun) {
    // Returns true if newRun should replace existingRun
    if (!existingRun) return true;

    // Higher run_attempt takes priority (re-runs)
    if (newRun.run_attempt > existingRun.run_attempt) return true;

    // For same run_attempt, use newer created_at as tiebreaker
    if (
      newRun.run_attempt === existingRun.run_attempt &&
      new Date(newRun.created_at) > new Date(existingRun.created_at)
    ) {
      return true;
    }

    return false;
  }

  async function fetchChecks(ref) {
    // Check runs (e.g., DCO check, but excluding GitHub Actions)
    const checkRuns = (
      await github.paginate(github.rest.checks.listForRef, {
        owner,
        repo,
        ref,
        filter: "latest",
      })
    ).filter(({ app }) => app?.slug !== "github-actions");

    const latestCheckRuns = {};
    for (const run of checkRuns) {
      const { name } = run;
      if (
        !latestCheckRuns[name] ||
        new Date(run.started_at) > new Date(latestCheckRuns[name].started_at)
      ) {
        latestCheckRuns[name] = run;
      }
    }
    const checks = Object.values(latestCheckRuns).map(({ name, status, conclusion }) => ({
      name,
      status:
        status !== "completed"
          ? STATE.pending
          : conclusion === "success" || conclusion === "skipped"
          ? STATE.success
          : STATE.failure,
    }));

    // Workflow runs (e.g., GitHub Actions)
    const workflowRuns = (
      await github.paginate(github.rest.actions.listWorkflowRunsForRepo, {
        owner,
        repo,
        head_sha: ref,
      })
    ).filter(
      ({ path, conclusion }) =>
        path !== ".github/workflows/protect.yml" && conclusion !== "cancelled"
    );

    // Deduplicate workflow runs by path and event, keeping the latest attempt
    const latestRuns = {};
    for (const run of workflowRuns) {
      const { path, event } = run;
      const key = `${path}-${event}`;
      if (isNewerRun(run, latestRuns[key])) {
        latestRuns[key] = run;
      }
    }

    // Fetch jobs for each workflow run
    const runs = [];
    for (const run of Object.values(latestRuns)) {
      // Fetch jobs for this workflow run
      const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRun, {
        owner,
        repo,
        run_id: run.id,
      });

      // Process each job as a separate check
      for (const job of jobs) {
        const runName = run.path.replace(".github/workflows/", "");
        runs.push({
          name: `${job.name} (${runName}, attempt ${run.run_attempt})`,
          status:
            job.status !== "completed"
              ? STATE.pending
              : job.conclusion === "success" || job.conclusion === "skipped"
              ? STATE.success
              : STATE.failure,
        });
      }
    }

    return [...checks, ...runs].sort((a, b) => a.name.localeCompare(b.name));
  }

  const start = new Date();
  let iterationCount = 0;
  const TIMEOUT = 120 * 60 * 1000; // 2 hours
  while (new Date() - start < TIMEOUT) {
    ++iterationCount;
    const checks = await fetchChecks(sha);
    const longest = Math.max(...checks.map(({ name }) => name.length));
    checks.forEach(({ name, status }) => {
      const icon = status === STATE.success ? "✅" : status === STATE.failure ? "❌" : "🕒";
      console.log(`- ${name.padEnd(longest)}: ${icon} ${status}`);
    });

    if (checks.some(({ status }) => status === STATE.failure)) {
      throw new Error(
        "This job ensures that all checks except for this one have passed to prevent accidental auto-merges."
      );
    }

    if (checks.length > 0 && checks.every(({ status }) => status === STATE.success)) {
      console.log("All checks passed");
      return;
    }

    await logRateLimit();
    const pendingJobs = checks.filter(({ status }) => status === STATE.pending);
    const sleepLength = getSleepLength(iterationCount, pendingJobs.length);
    console.log(`Sleeping for ${sleepLength / 1000} seconds (${pendingJobs.length} pending jobs)`);
    await sleep(sleepLength);
  }

  throw new Error("Timeout");
};
```

--------------------------------------------------------------------------------

---[FILE: protect.yml]---
Location: mlflow-master/.github/workflows/protect.yml

```yaml
# This job prevents accidental auto-merging of PRs when jobs that are conditionally
# triggered (for example, those defined in `cross-version-tests.yml`) are either still
# in the process of running or have resulted in failures.
name: Protect

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
  merge_group:
    types:
      - checks_requested

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  protect:
    # Skip this job in a merge queue
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      checks: read # to read check statuses
      actions: read # to read workflow runs and jobs
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require('./.github/workflows/protect.js');
            await script({ github, context });
```

--------------------------------------------------------------------------------

````
