---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 14
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 14 of 991)

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

---[FILE: protobuf-cross-test.yml]---
Location: mlflow-master/.github/workflows/protobuf-cross-test.yml
Signals: Docker

```yaml
name: protobuf cross tests

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - "mlflow/protos/**"
      - .github/workflows/protobuf-cross-test.yml
  push:
    branches:
      - master
      - branch-[0-9]+.[0-9]+
    paths:
      - "mlflow/protos/**"
      - .github/workflows/protobuf-cross-test.yml

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
  PYTHONUTF8: "1"
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt

jobs:
  core_tests:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2]
        protobuf_major_version: [3, 4, 5]
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
          pip install -U pip setuptools wheel
          pip install tests/resources/mlflow-test-plugin
          pip install .[extras,genai,mcp]
          pip install pyspark
          # Install Hugging Face datasets to test Hugging Face usage with MLflow dataset tracking
          pip install datasets
          # Install TensorFlow to test TensorFlow dataset usage with MLflow dataset tracking
          # tensorflow >= 2.22.0 are incompatible with protobuf < 5
          pip install 'tensorflow<2.22.0' 'tf-keras<2.20.0'
          # Install torch and transformers to test metrics
          pip install torch transformers
          pip install -r requirements/test-requirements.txt
          # Test the latest minor version in protobuf_major_version
          pip install "protobuf==${{ matrix.protobuf_major_version }}.*"
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          # NB: test_mlflow_artifacts.py is excluded because it runs docker-compose with fresh
          # container builds. The protobuf version in the test environment has no effect on the
          # containers, making cross-version testing unnecessary and wasteful of disk space.
          pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} \
            --ignore-flavors \
            --ignore=tests/projects \
            --ignore=tests/examples \
            --ignore=tests/evaluate \
            --ignore=tests/optuna \
            --ignore=tests/pyspark/optuna \
            --ignore=tests/genai \
            --ignore=tests/telemetry \
            --ignore=tests/gateway \
            --ignore=tests/tracking/test_mlflow_artifacts.py \
            tests
```

--------------------------------------------------------------------------------

---[FILE: protos.yml]---
Location: mlflow-master/.github/workflows/protos.yml

```yaml
name: Protos

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - .github/workflows/protos.yml
      - dev/generate_protos.py
      - dev/generate-protos.sh
      - dev/test-generate-protos.sh
      - mlflow/protos/**
      - mlflow/java/client/src/main/java/com/databricks/api/proto/**
      # graphql related code changes could trigger changes in the autogenerated schema
      - mlflow/server/graphql/**
      - mlflow/server/js/src/graphql/**
      - requirements/skinny-requirements.yaml
      - requirements/core-requirements.yaml

env:
  MLFLOW_HOME: ${{ github.workspace }}

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  protos:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/setup-python
      - name: Check OpenTelemetry protos are up-to-date
        run: |
          ./mlflow/protos/opentelemetry/update.sh
          GIT_STATUS="$(git status --porcelain mlflow/protos/opentelemetry/)"
          if [ "$GIT_STATUS" ]; then
            echo "OpenTelemetry proto files are outdated. Please run './mlflow/protos/opentelemetry/update.sh'"
            echo "Git status:"
            echo "$GIT_STATUS"
            exit 1
          fi
      - name: Run tests
        run: |
          ./dev/test-generate-protos.sh

      - name: Test
        run: |
          uv run python -c "from google.protobuf.internal import api_implementation; assert api_implementation.Type() != 'python'"
          uv run python -c "import mlflow"

          # Ensure mlflow works fine with the python backend. See the following link for more details:
          # https://github.com/protocolbuffers/protobuf/tree/main/python#implementation-backends
          export PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
          uv run python -c "from google.protobuf.internal import api_implementation; assert api_implementation.Type() == 'python'"
          uv run python -c "import mlflow"
```

--------------------------------------------------------------------------------

---[FILE: push-images.yml]---
Location: mlflow-master/.github/workflows/push-images.yml
Signals: Docker

```yaml
name: Push-Images

on:
  release:
    types:
      - published
      - edited

defaults:
  run:
    shell: bash

jobs:
  push-images:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      packages: write # to push to ghcr.io
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - uses: ./.github/actions/setup-python

      - name: Set up QEMU
        uses: docker/setup-qemu-action@2b82ce82d56a2a04d2637cd93a637ae1b359c0a7 # v2.2.0

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@885d1462b80bc1c1c7f0b00334ad271f09369c55 # v2.10.0

      - name: Login to GitHub Container Registry
        uses: docker/login-action@465a07811f14bebb1938fbed4728c6a1ff8901fc # v2.2.0
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Check if should update latest tag
        id: check_latest
        run: |
          CURRENT_VERSION=${GITHUB_REF_NAME#v}

          HIGHEST_VERSION=$(gh release list --exclude-pre-releases --exclude-drafts --limit 100 | \
            grep -E '^v[0-9]+\.[0-9]+\.[0-9]+\s' | \
            awk '{print $1}' | \
            sed 's/^v//' | \
            sort -V | \
            tail -n1)

          if [ -z "$HIGHEST_VERSION" ] || [ "$(echo -e "$CURRENT_VERSION\n$HIGHEST_VERSION" | sort -V | tail -n1)" = "$CURRENT_VERSION" ]; then
            echo "should_update_latest=true" >> $GITHUB_OUTPUT
          else
            echo "should_update_latest=false" >> $GITHUB_OUTPUT
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Gather Docker Metadata for Tracking
        id: meta
        uses: docker/metadata-action@818d4b7b91585d195f67373fd9cb0332e31a7175 # v4.6.0
        with:
          images: |
            ghcr.io/mlflow/mlflow
          tags: |
            type=ref,event=tag
            type=raw,value=latest,enable=${{ steps.check_latest.outputs.should_update_latest == 'true' }}

      - name: Build and Push Base Image
        uses: docker/build-push-action@1104d471370f9806843c095c1db02b5a90c5f8b6 # v3.3.1
        with:
          context: docker
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          platforms: linux/amd64,linux/arm64
          build-args: |
            VERSION=${{ steps.meta.outputs.version }}

      - name: Gather Docker Metadata for Model Server
        id: modelmeta
        uses: docker/metadata-action@818d4b7b91585d195f67373fd9cb0332e31a7175 # v4.6.0
        with:
          images: |
            ghcr.io/mlflow/model-server
          tags: |
            type=ref,event=tag
            type=raw,value=latest,enable=${{ steps.check_latest.outputs.should_update_latest == 'true' }}

      - name: Build Model Server Image
        run: |
          pip install .
          mlflow models build-docker -n model-server:latest --mlflow-home `pwd`

      - name: Push Model Server Image
        run: |
          set -x

          tags=$(echo -n "${{ steps.modelmeta.outputs.tags }}" | tr '\n' ' ')
          for tag in $tags; do
            docker tag model-server:latest $tag
            docker push $tag
          done
```

--------------------------------------------------------------------------------

---[FILE: r.yml]---
Location: mlflow-master/.github/workflows/r.yml

```yaml
name: R

on:
  push:
    branches:
      - master
      - branch-[0-9]+.[0-9]+
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
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
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt

jobs:
  r:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    if: github.event_name == 'push' || (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    defaults:
      run:
        working-directory: mlflow/R/mlflow
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || null }}
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - uses: r-lib/actions/setup-r@bd49c52ffe281809afa6f0fecbf37483c5dd0b93 # v2.11.3
      # This step dumps the current set of R dependencies and R version into files to be used
      # as a cache key when caching/restoring R dependencies.
      - name: Dump dependencies
        run: |
          Rscript -e 'source(".dump-r-dependencies.R", echo = TRUE)'
      - name: Get OS name
        id: os-name
        run: |
          # `os_name` will be like "Ubuntu-20.04.1-LTS"
          os_name=$(lsb_release -ds | sed 's/\s/-/g')
          echo "os-name=$os_name" >> $GITHUB_OUTPUT
      - name: Cache R packages
        uses: actions/cache@5a3ec84eff668545956fd18022155c47e93e2684 # v4.2.3
        continue-on-error: true
        # https://github.com/actions/cache/issues/810
        env:
          SEGMENT_DOWNLOAD_TIMEOUT_MINS: 5
        with:
          path: ${{ env.R_LIBS_USER }}
          # We cache R dependencies based on a tuple of the current OS, the R version, and the list of
          # R dependencies
          key: ${{ steps.os-name.outputs.os-name }}-${{ hashFiles('mlflow/R/mlflow/R-version') }}-0-${{ hashFiles('mlflow/R/mlflow/depends.Rds') }}
      - name: Install dependencies
        run: |
          sudo apt-get install -y libcurl4-openssl-dev libharfbuzz-dev libfribidi-dev libtiff-dev
          Rscript -e 'source(".install-deps.R", echo=TRUE)'
      - name: Set USE_R_DEVEL
        run: |
          if [ "$GITHUB_EVENT_NAME" = "schedule" ]; then
            USE_R_DEVEL=true
          elif [ "$GITHUB_EVENT_NAME" = "pull_request" ]; then
            # Use r-devel on a pull request targeted to a release branch
            USE_R_DEVEL=$([[ $GITHUB_BASE_REF =~ branch-[0-9]+\.[0-9]+$ ]] && echo true || echo false)
          else
            # Use r-devel on a push to a release branch
            USE_R_DEVEL=$([[ $GITHUB_REF_NAME =~ branch-[0-9]+\.[0-9]+$ ]] && echo true || echo false)
          fi
          echo "USE_R_DEVEL=$USE_R_DEVEL" >> $GITHUB_ENV
      - name: Build package
        run: |
          ./build-package.sh
      - name: Create test environment
        run: |
          pip install $(git rev-parse --show-toplevel)
          H2O_VERSION=$(Rscript -e "print(packageVersion('h2o'))" | grep -Eo '[0-9][0-9.]+')
          # test-keras-model.R fails with tensorflow>=2.13.0
          pip install xgboost 'tensorflow<2.13.0' "h2o==$H2O_VERSION" "pydantic<3,>=1.0" "typing_extensions>=4.6.0"
          Rscript -e 'source(".install-mlflow-r.R", echo=TRUE)'
      - name: Run tests
        env:
          LINTR_COMMENT_BOT: false
        run: |
          cd tests
          export RETICULATE_PYTHON_BIN=$(which python)
          export MLFLOW_SERVER_ENABLE_JOB_EXECUTION=false
          Rscript -e 'source("../.run-tests.R", echo=TRUE)'
```

--------------------------------------------------------------------------------

---[FILE: release-note.js]---
Location: mlflow-master/.github/workflows/release-note.js

```javascript
async function fetchRepoLabels({ github, owner, repo }) {
  const { data } = await github.rest.issues.listLabelsForRepo({
    owner,
    repo,
    per_page: 100, // the default value is 30, which is too small to fetch all labels
  });
  return data.map(({ name }) => name);
}

async function fetchPrLabels({ github, owner, repo, issue_number }) {
  const { data } = await github.rest.issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number,
  });
  return data.map(({ name }) => name);
}

function isReleaseNoteLabel(name) {
  return name.startsWith("rn/");
}

async function validateLabeled({ core, context, github }) {
  const { user, html_url: pr_url } = context.payload.pull_request;
  const { owner, repo } = context.repo;
  const { number: issue_number } = context.issue;

  // Skip validation on pull requests created by the automation bot
  if (user.login === "mlflow-app[bot]") {
    console.log("This pull request was created by the automation bot, skipping");
    return;
  }

  const repoLabels = await fetchRepoLabels({ github, owner, repo });
  const releaseNoteLabels = repoLabels.filter(isReleaseNoteLabel);

  // Fetch the release-note category labels applied on this PR
  const fetchAppliedLabels = async () => {
    const backoffs = [0, 1, 2, 4, 8, 16];
    for (const [index, backoff] of backoffs.entries()) {
      console.log(`Attempt ${index + 1}/${backoffs.length}`);
      await new Promise((r) => setTimeout(r, backoff * 1000));
      const prLabels = await fetchPrLabels({
        github,
        owner,
        repo,
        issue_number,
      });
      const prReleaseNoteLabels = prLabels.filter((name) => releaseNoteLabels.includes(name));

      if (prReleaseNoteLabels.length > 0) {
        return prReleaseNoteLabels;
      }
    }
    return [];
  };

  const prReleaseNoteLabels = await fetchAppliedLabels();

  // If no release note category label is applied to this PR, set the action status to "failed"
  if (prReleaseNoteLabels.length === 0) {
    // Make sure '.github/pull_request_template.md' contains an HTML anchor with this name
    const anchorName = "release-note-category";

    // Fragmented URL to jump to the release note category section in the PR description
    const anchorUrl = `${pr_url}#user-content-${anchorName}`;
    const message = [
      "No release-note label is applied to this PR. ",
      `Please select a checkbox in the release note category section: ${anchorUrl} `,
      "or manually apply a release note category label (e.g. 'rn/bug-fix') ",
      "if you're a maintainer of this repository. ",
      "If this job failed when a release note category label is already applied, ",
      "please re-run it.",
    ].join("");
    core.setFailed(message);
  }
}

async function postMerge({ context, github }) {
  const { user } = context.payload.pull_request;
  const { owner, repo } = context.repo;
  const { number: issue_number } = context.issue;

  if (user.login === "mlflow-app[bot]") {
    console.log("This PR was created by the automation bot, skipping");
    return;
  }

  const repoLabels = await fetchRepoLabels({ github, owner, repo });
  const releaseNoteLabels = repoLabels.filter(isReleaseNoteLabel);
  const prLabels = await fetchPrLabels({
    github,
    owner,
    repo,
    issue_number,
  });
  const prReleaseNoteLabels = prLabels.filter((name) => releaseNoteLabels.includes(name));

  if (prReleaseNoteLabels.length === 0) {
    const pull = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: issue_number,
    });
    const { login: mergedBy } = pull.data.merged_by;
    const noneLabel = "rn/none";
    const body = [
      `@${mergedBy} This PR is missing a release-note label, adding \`${noneLabel}\`. `,
      "If this label is incorrect, please replace it with the correct label.",
    ].join("");
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [noneLabel],
    });
  }
}

module.exports = {
  validateLabeled,
  postMerge,
};
```

--------------------------------------------------------------------------------

---[FILE: release-note.yml]---
Location: mlflow-master/.github/workflows/release-note.yml

```yaml
# A workflow to validate at least one release-note category is selected

name: release-note

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
      - labeled
      - unlabeled
  # post-merge job requires write access to add a label and post a comment.
  pull_request_target:
    types:
      - closed

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  validate-labeled:
    if: github.event.pull_request.draft == false && github.event.action != 'closed'
    runs-on: ubuntu-slim
    permissions:
      pull-requests: read # validateLabeled looks at PR's labels
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: validate-labeled
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            // https://github.com/actions/github-script#run-a-separate-file
            const script = require("./.github/workflows/release-note.js");
            await script.validateLabeled({ core, context, github });

  post-merge:
    if: github.event.action == 'closed' && github.event.pull_request.merged == true
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      pull-requests: write # postMerge labels PRs
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: post-merge
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            // https://github.com/actions/github-script#run-a-separate-file
            const script = require("./.github/workflows/release-note.js");
            await script.postMerge({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: require-core-maintainer-approval.js]---
Location: mlflow-master/.github/workflows/require-core-maintainer-approval.js

```javascript
async function getMaintainers({ github, context }) {
  const collaborators = await github.paginate(github.rest.repos.listCollaborators, {
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  return collaborators
    .filter(({ role_name }) => ["admin", "maintain"].includes(role_name))
    .map(({ login }) => login)
    .sort();
}

const EXEMPTION_RULES = [
  // Exemption for GenAI evaluation PRs.
  {
    authors: ["alkispoly-db", "AveshCSingh", "danielseong1", "smoorjani", "SomtochiUmeh", "xsh310"],
    allowedPatterns: [
      /^mlflow\/genai\//,
      /^tests\/genai\//,
      /^docs\//,
      /^mlflow\/entities\/(assessment|dataset|evaluation|scorer)/,
    ],
    excludedPatterns: [/^mlflow\/genai\/(agent_server|git_versioning|prompts|optimize)\//],
  },
];

function matchesAnyPattern(path, patterns) {
  return patterns.some((pattern) => pattern.test(path));
}

function isAllowedPath(path, rule) {
  return (
    matchesAnyPattern(path, rule.allowedPatterns) && !matchesAnyPattern(path, rule.excludedPatterns)
  );
}

function isExempted(authorLogin, files) {
  let filesToCheck = files;
  for (const rule of EXEMPTION_RULES) {
    if (rule.authors.includes(authorLogin)) {
      filesToCheck = filesToCheck.filter(
        ({ filename, previous_filename }) =>
          // Keep files where NOT all before/after file paths are allowed by the rule.
          ![filename, previous_filename].filter(Boolean).every((path) => isAllowedPath(path, rule))
      );
      if (filesToCheck.length === 0) {
        return true;
      }
    }
  }
  return false;
}

function hasAnyApproval(reviews) {
  return reviews.some(({ state }) => state === "APPROVED");
}

module.exports = async ({ github, context, core }) => {
  const maintainers = await getMaintainers({ github, context });
  const reviews = await github.paginate(github.rest.pulls.listReviews, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });
  const maintainerApproved = reviews.some(
    ({ state, user: { login } }) => state === "APPROVED" && maintainers.includes(login)
  );

  const { pull_request: pr } = context.payload;
  const authorLogin = pr?.user?.login;

  const files = await github.paginate(github.rest.pulls.listFiles, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number,
  });

  if (isExempted(authorLogin, files)) {
    if (!hasAnyApproval(reviews)) {
      core.setFailed(
        "PR from exempted author needs at least one approval (maintainer approval not required)."
      );
    }
    return;
  }

  if (!maintainerApproved) {
    const maintainerList = maintainers.join(", ");
    const message = `This PR requires an approval from at least one of the core maintainers: ${maintainerList}.`;
    core.setFailed(message);
  }
};
```

--------------------------------------------------------------------------------

---[FILE: requirements.yml]---
Location: mlflow-master/.github/workflows/requirements.yml

```yaml
name: Test requirements

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - requirements/core-requirements.yaml
      - requirements/skinny-requirements.yaml
      - requirements/gateway-requirements.yaml
      - .github/workflows/requirements.yml
  schedule:
    - cron: "0 13 * * *"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

env:
  MLFLOW_HOME: ${{ github.workspace }}
  MLFLOW_CONDA_HOME: /usr/share/miniconda
  SPARK_LOCAL_IP: localhost
  PYTHON_VERSION: "3.11" # minimum supported version + 1
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt
  _MLFLOW_TESTING_TELEMETRY: "true"

defaults:
  run:
    shell: bash

jobs:
  skinny:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: read
    if: (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || null }}
      - uses: ./.github/actions/setup-python
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      - name: Install dev script dependencies
        run: |
          pip install -r dev/requirements.txt
      - uses: ./.github/actions/update-requirements
        if: github.event_name == 'schedule'
      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh --skinny
      - uses: ./.github/actions/show-versions
      - name: Run tests
        run: |
          ./dev/run-python-skinny-tests.sh

  core:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    if: (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2]
        include:
          - splits: 2
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || null }}
      - uses: ./.github/actions/free-disk-space
      - uses: ./.github/actions/setup-python
        with:
          python-version: ${{ env.PYTHON_VERSION }}
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dev script dependencies
        run: |
          pip install -r dev/requirements.txt
      - uses: ./.github/actions/update-requirements
        if: github.event_name == 'schedule'
      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh --ml
          pip install '.[gateway]'
          # transformers doesn't support Keras 3 yet. tf-keras needs to be installed as a workaround.
          pip install tf-keras
      - uses: ./.github/actions/show-versions
      - name: Run tests
        run: |
          source dev/setup-ssh.sh
          pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} tests --quiet --requires-ssh --ignore-flavors \
            --ignore=tests/examples --ignore=tests/evaluate \
            --ignore=tests/deployments --ignore=tests/genai
```

--------------------------------------------------------------------------------

---[FILE: rerun-cross-version-tests.js]---
Location: mlflow-master/.github/workflows/rerun-cross-version-tests.js

```javascript
module.exports = async ({ context, github, workflow_id }) => {
  const { owner, repo } = context.repo;
  const { data: workflowRunsData } = await github.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id,
    event: "schedule",
  });

  if (workflowRunsData.total_count === 0) {
    return;
  }

  const { id: run_id, conclusion } = workflowRunsData.workflow_runs[0];
  if (conclusion === "success") {
    return;
  }

  const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRun, {
    owner,
    repo,
    run_id,
  });
  const failedJobs = jobs.filter((job) => job.conclusion !== "success");
  if (failedJobs.length === 0) {
    return;
  }

  await github.rest.actions.reRunWorkflowFailedJobs({
    repo,
    owner,
    run_id,
  });
};
```

--------------------------------------------------------------------------------

---[FILE: rerun-cross-version-tests.yml]---
Location: mlflow-master/.github/workflows/rerun-cross-version-tests.yml

```yaml
# Cross version tests sometimes fail due to transient errors. This workflow reruns failed tests.
name: rerun-cross-version-tests

on:
  schedule:
    # Run this workflow daily at 19:00 UTC (6 hours after cross-version-tests.yml workflow)
    - cron: "0 19 * * *"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  set-matrix:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    if: github.repository == 'mlflow/dev'
    permissions:
      actions: write # to rerun workflows
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const rerun = require(`${process.env.GITHUB_WORKSPACE}/.github/workflows/rerun-cross-version-tests.js`);
            await rerun({ context, github, workflow_id: "cross-version-tests.yml" });
```

--------------------------------------------------------------------------------

---[FILE: rerun-workflow-run.yml]---
Location: mlflow-master/.github/workflows/rerun-workflow-run.yml

```yaml
# Triggered by rerun.yml on PR approval.
name: rerun-workflow-run
on:
  workflow_run:
    workflows: [rerun]
    types: [completed]

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.event.workflow_run.head_branch }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  rerun:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      actions: write # to rerun github action workflows
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: Download PR number
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const rerun = require(`${process.env.GITHUB_WORKSPACE}/.github/workflows/rerun.js`);
            await rerun.download({ context, github });

      - name: Unzip PR number
        run: unzip pr_number.zip

      - name: Rerun workflows
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const rerun = require(`${process.env.GITHUB_WORKSPACE}/.github/workflows/rerun.js`);
            await rerun.rerun({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: rerun.js]---
Location: mlflow-master/.github/workflows/rerun.js

```javascript
const fs = require("fs");

function computeExecutionTimeInSeconds(started_at, completed_at) {
  const startedAt = new Date(started_at);
  const completedAt = new Date(completed_at);
  return (completedAt - startedAt) / 1000;
}

async function download({ github, context }) {
  const allArtifacts = await github.rest.actions.listWorkflowRunArtifacts({
    owner: context.repo.owner,
    repo: context.repo.repo,
    run_id: context.payload.workflow_run.id,
  });

  const matchArtifact = allArtifacts.data.artifacts.find((artifact) => {
    return artifact.name == "pr_number";
  });

  const download = await github.rest.actions.downloadArtifact({
    owner: context.repo.owner,
    repo: context.repo.repo,
    artifact_id: matchArtifact.id,
    archive_format: "zip",
  });

  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/pr_number.zip`, Buffer.from(download.data));
}

async function rerun({ github, context }) {
  const pull_number = Number(fs.readFileSync("./pr_number"));
  const {
    repo: { owner, repo },
  } = context;

  const { data: pr } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number,
  });

  const checkRuns = await github.paginate(github.rest.checks.listForRef, {
    owner,
    repo,
    ref: pr.head.sha,
  });
  const runIdsToRerun = checkRuns
    // Select failed github action runs
    .filter(
      ({ name, status, conclusion, started_at, completed_at, app: { slug } }) =>
        slug === "github-actions" &&
        status === "completed" &&
        conclusion === "failure" &&
        name.toLowerCase() !== "rerun" && // Prevent recursive rerun
        (name.toLowerCase() === "protect" || // Always rerun protect job
          computeExecutionTimeInSeconds(started_at, completed_at) <= 60) // Rerun jobs that took less than 60 seconds (e.g. Maintainer approval check)
    )
    .map(
      ({
        // Example: https://github.com/mlflow/mlflow/actions/runs/10675586265/job/29587793829
        //                                                        ^^^^^^^^^^^ run_id
        html_url,
      }) => html_url.match(/\/actions\/runs\/(\d+)/)[1]
    );

  const uniqueRunIds = [...new Set(runIdsToRerun)];
  const promises = uniqueRunIds.map(async (run_id) => {
    console.log(`Rerunning https://github.com/${owner}/${repo}/actions/runs/${run_id}`);
    try {
      await github.rest.actions.reRunWorkflowFailedJobs({
        repo,
        owner,
        run_id,
      });
    } catch (error) {
      console.error(`Failed to rerun workflow for run_id ${run_id}:`, error);
    }
  });
  await Promise.all(promises);
}

module.exports = {
  download,
  rerun,
};
```

--------------------------------------------------------------------------------

---[FILE: rerun.yml]---
Location: mlflow-master/.github/workflows/rerun.yml

```yaml
# Triggers rerun-workflow-run.yml on PR approval.
# See https://stackoverflow.com/questions/67247752/how-to-use-secret-in-pull-request-review-similar-to-pull-request-target for why we need this approach and how it works.
name: rerun

on:
  pull_request_review:
    types: [submitted]

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  upload:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      contents: read
    if: github.event.review.state == 'approved' && contains(fromJSON('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.review.author_association)
    steps:
      - name: Upload PR number
        env:
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          mkdir -p /tmp/pr
          echo $PR_NUMBER > /tmp/pr/pr_number
      - uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: pr_number
          path: /tmp/pr/
```

--------------------------------------------------------------------------------

````
