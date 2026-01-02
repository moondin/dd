---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 11
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 11 of 991)

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

---[FILE: autoformat.yml]---
Location: mlflow-master/.github/workflows/autoformat.yml

```yaml
# See .github/workflows/autoformat.md for instructions on how to test this workflow.

name: Autoformat
on:
  issue_comment:
    types: [created, edited]

defaults:
  run:
    shell: bash

jobs:
  check-comment:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    if: ${{ github.event.issue.pull_request && startsWith(github.event.comment.body, '/autoformat') }}
    permissions:
      statuses: write # autoformat.createStatus
      pull-requests: write # autoformat.createReaction on PRs
    outputs:
      should_autoformat: ${{ fromJSON(steps.judge.outputs.result).shouldAutoformat }}
      repository: ${{ fromJSON(steps.judge.outputs.result).repository }}
      head_ref: ${{ fromJSON(steps.judge.outputs.result).head_ref }}
      head_sha: ${{ fromJSON(steps.judge.outputs.result).head_sha }}
      base_ref: ${{ fromJSON(steps.judge.outputs.result).base_ref }}
      base_sha: ${{ fromJSON(steps.judge.outputs.result).base_sha }}
      base_repo: ${{ fromJSON(steps.judge.outputs.result).base_repo }}
      pull_number: ${{ fromJSON(steps.judge.outputs.result).pull_number }}
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: ./.github/actions/validate-author
      - name: judge
        id: judge
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            core.debug(JSON.stringify(context, null, 2));
            const autoformat = require('./.github/workflows/autoformat.js');
            const { comment } = context.payload;
            const shouldAutoformat = autoformat.shouldAutoformat(comment);
            if (shouldAutoformat) {
              await autoformat.createReaction(context, github);
              await autoformat.createStatus(context, github, core);
            }
            const pullInfo = await autoformat.getPullInfo(context, github);
            return { ...pullInfo, shouldAutoformat };

      - name: Check maintainer access
        if: ${{ fromJSON(steps.judge.outputs.result).shouldAutoformat }}
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const autoformat = require('./.github/workflows/autoformat.js');
            await autoformat.checkMaintainerAccess(context, github);

  format:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    needs: check-comment
    if: ${{ needs.check-comment.outputs.should_autoformat == 'true' }}
    permissions:
      pull-requests: read # view files modified in PR
    outputs:
      reformatted: ${{ steps.patch.outputs.reformatted }}
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ needs.check-comment.outputs.repository }}
          ref: ${{ needs.check-comment.outputs.head_ref }}
          # Set fetch-depth to merge the base branch
          fetch-depth: 100
      - name: Check diff
        id: diff
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          changed_files="$(gh pr view --repo ${{ github.repository }} ${{ needs.check-comment.outputs.pull_number }} --json files --jq '.files.[].path')"
          protos=$([[ -z $(echo "$changed_files" | grep '^\(mlflow/protos\|tests/protos\)') ]] && echo "false" || echo "true")
          js=$([[ -z $(echo "$changed_files" | grep '^mlflow/server/js') ]] && echo "false" || echo "true")
          docs=$([[ -z $(echo "$changed_files" | grep '^docs/') ]] && echo "false" || echo "true")
          r=$([[ -z $(echo "$changed_files" | grep '^mlflow/R/mlflow') ]] && echo "false" || echo "true")
          db=$([[ -z $(echo "$changed_files" | grep '^mlflow/store/db_migrations/') ]] && echo "false" || echo "true")
          api=$([[ -z $(echo "$changed_files" | grep -E '(^mlflow/.*\.py$|^docs/api_reference/.*\.rst$)') ]] && echo "false" || echo "true")
          echo "protos=$protos" >> $GITHUB_OUTPUT
          echo "js=$js" >> $GITHUB_OUTPUT
          echo "docs=$docs" >> $GITHUB_OUTPUT
          echo "r=$r" >> $GITHUB_OUTPUT
          echo "db=$db" >> $GITHUB_OUTPUT
          echo "api=$api" >> $GITHUB_OUTPUT
      # Merge the base branch (which is usually master) to apply formatting using the latest configurations.
      - name: Merge base branch
        run: |
          git config user.name 'mlflow-app[bot]'
          git config user.email 'mlflow-app[bot]@users.noreply.github.com'
          git remote add base https://github.com/${{ needs.check-comment.outputs.base_repo }}.git
          git fetch base ${{ needs.check-comment.outputs.base_ref }}
          git merge base/${{ needs.check-comment.outputs.base_ref }}
      - uses: ./.github/actions/setup-python
      # ************************************************************************
      # pre-commit
      # ************************************************************************
      - run: |
          uv run --only-group lint pre-commit install --install-hooks
          uv run --only-group lint pre-commit run install-bin -a -v
          uv run --only-group lint pre-commit run --all-files --color=always || true
      # ************************************************************************
      # protos
      # ************************************************************************
      - if: steps.diff.outputs.protos == 'true'
        env:
          DOCKER_BUILDKIT: 1
        run: |
          # Run the script multiple times. The changes generated by the first run
          # may trigger additional changes, which need to be applied in subsequent runs.
          for i in {1..3}; do
            ./dev/generate-protos.sh
          done
      # ************************************************************************
      # DB
      # ************************************************************************
      - if: steps.diff.outputs.db == 'true'
        run: |
          tests/db/update_schemas.sh
      # ************************************************************************
      # js
      # ************************************************************************
      - if: steps.diff.outputs.js == 'true'
        uses: ./.github/actions/setup-node
      - if: steps.diff.outputs.js == 'true'
        working-directory: mlflow/server/js
        run: |
          yarn install
      - if: steps.diff.outputs.js == 'true'
        working-directory: mlflow/server/js
        run: |
          yarn lint:fix
          yarn prettier:fix
      - if: steps.diff.outputs.js == 'true'
        working-directory: mlflow/server/js
        run: |
          yarn i18n
      - if: steps.diff.outputs.docs == 'true'
        working-directory: docs
        run: |
          npm ci
      - if: steps.diff.outputs.docs == 'true'
        working-directory: docs
        run: |
          npm run prettier:fix
      # ************************************************************************
      # R
      # ************************************************************************
      - if: steps.diff.outputs.r == 'true'
        working-directory: docs/api_reference
        run: |
          ./build-rdoc.sh
      # ************************************************************************
      # API Reference
      # ************************************************************************
      - if: steps.diff.outputs.api == 'true'
        run: |
          uv run --group docs --extra gateway --directory docs/api_reference make dummy
      # ************************************************************************
      # Upload patch
      # ************************************************************************
      - name: Create patch
        id: patch
        run: |
          git add -N .
          git diff > ${{ github.run_id }}.diff
          reformatted=$([[ -s ${{ github.run_id }}.diff ]] && echo "true" || echo "false")
          echo "reformatted=$reformatted" >> $GITHUB_OUTPUT

      - name: Upload patch
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: ${{ github.run_id }}.diff
          path: ${{ github.run_id }}.diff

  push:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    needs: [check-comment, format]
    if: ${{ needs.format.outputs.reformatted == 'true' }}
    permissions:
      contents: read
    outputs:
      head_sha: ${{ steps.push.outputs.head_sha }}
    steps:
      - uses: actions/create-github-app-token@d72941d797fd3113feb6b93fd0dec494b13a2547 # v1.12.0
        id: app-token
        with:
          app-id: ${{ secrets.APP_ID }}
          # See https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps
          # for how to rotate the private key
          private-key: ${{ secrets.APP_PRIVATE_KEY }}
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ needs.check-comment.outputs.repository }}
          ref: ${{ needs.check-comment.outputs.head_ref }}
          # Set fetch-depth to merge the base branch
          fetch-depth: 100
          # As reported in https://github.com/orgs/community/discussions/25702, if an action pushes
          # code using `GITHUB_TOKEN`, that won't trigger new workflow runs on the PR.
          # A personal access token is required to trigger new workflow runs.
          token: ${{ steps.app-token.outputs.token }}

      - name: Merge base branch
        env:
          BASE_REPO: ${{ needs.check-comment.outputs.base_repo }}
          BASE_REF: ${{ needs.check-comment.outputs.base_ref }}
        run: |
          git config user.name 'mlflow-app[bot]'
          git config user.email 'mlflow-app[bot]@users.noreply.github.com'
          git remote add base https://github.com/${BASE_REPO}.git
          git fetch base $BASE_REF
          git merge base/${BASE_REF}

      - name: Download patch
        uses: actions/download-artifact@95815c38cf2ff2164869cbab79da8d1f422bc89e # v4.2.1
        with:
          name: ${{ github.run_id }}.diff
          path: /tmp

      - name: Apply patch and push
        id: push
        env:
          RUN_ID: ${{ github.run_id }}
          REPOSITORY: ${{ github.repository }}
        run: |
          git apply /tmp/${RUN_ID}.diff
          git add .
          git commit -sm "Autoformat: https://github.com/${REPOSITORY}/actions/runs/${RUN_ID}"
          echo "head_sha=$(git rev-parse HEAD)" >> $GITHUB_OUTPUT
          git push

  update-status:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    needs: [check-comment, format, push]
    if: always() && needs.check-comment.outputs.should_autoformat == 'true'
    permissions:
      statuses: write # To update check statuses
      actions: write # To approve workflow runs
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - name: Update status
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const needs = ${{ toJson(needs) }};
            const head_sha = '${{ needs.check-comment.outputs.head_sha }}'
            const autoformat = require('./.github/workflows/autoformat.js');
            const push_head_sha = '${{ needs.push.outputs.head_sha }}';
            if (push_head_sha) {
              await autoformat.approveWorkflowRuns(context, github, push_head_sha);
            }
            await autoformat.updateStatus(context, github, head_sha, needs);
```

--------------------------------------------------------------------------------

---[FILE: build-wheel.yml]---
Location: mlflow-master/.github/workflows/build-wheel.yml

```yaml
# Build a wheel for MLflow and upload it as an artifact.
name: build-wheel

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
  workflow_dispatch:
    inputs:
      ref:
        description: "The branch, tag or SHA to build the wheel from."
        required: true
        default: "master"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  build:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        type: ["dev", "skinny", "tracing"]
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-node

      - name: Build UI
        working-directory: mlflow/server/js
        run: |
          yarn
          yarn build

      - name: Install dependencies
        run: |
          pip install build setuptools twine wheel

      - name: Build distribution files
        id: build-dist
        run: |
          # if workflow_dispatch is triggered, use the specified ref
          if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
            SHA_OPT="--sha $(git rev-parse HEAD)"
          else
            SHA_OPT=""
          fi

          python dev/build.py --package-type "${{ matrix.type }}" $SHA_OPT

          # List distribution files and check their file sizes
          ls -lh dist

          # Set step outputs
          sdist_path=$(find dist -type f -name "*.tar.gz")
          wheel_path=$(find dist -type f -name "*.whl")
          wheel_name=$(basename $wheel_path)
          wheel_size=$(stat -c %s $wheel_path)
          echo "sdist-path=${sdist_path}" >> $GITHUB_OUTPUT
          echo "wheel-path=${wheel_path}" >> $GITHUB_OUTPUT
          echo "wheel-name=${wheel_name}" >> $GITHUB_OUTPUT
          echo "wheel-size=${wheel_size}" >> $GITHUB_OUTPUT

      - name: List files in source distribution
        run: |
          tar -tf ${{ steps.build-dist.outputs.sdist-path }}

      - name: List files in binary distribution
        run: |
          unzip -l ${{ steps.build-dist.outputs.wheel-path }}

      - name: Compare files in source and binary distributions
        run: |
          tar -tzf ${{ steps.build-dist.outputs.sdist-path }} | grep -v '/$' | cut -d'/' -f2- | sort > /tmp/source.txt
          zipinfo -1 ${{ steps.build-dist.outputs.wheel-path }} | sort > /tmp/wheel.txt
          diff /tmp/source.txt /tmp/wheel.txt || true

      - name: Run twine check
        run: |
          twine check --strict ${{ steps.build-dist.outputs.wheel-path }}

      - name: Test installation from tarball
        run: |
          pip install ${{ steps.build-dist.outputs.sdist-path }}
          python -c "import mlflow; print(mlflow.__version__)"
          python -c "from mlflow import *"

      - name: Test installation from wheel
        run: |
          pip install --force-reinstall ${{ steps.build-dist.outputs.wheel-path }}
          python -c "import mlflow; print(mlflow.__version__)"
          python -c "from mlflow import *"

      - name: Test installation from GitHub
        env:
          REPO: ${{ github.repository }}
          REF: ${{ github.ref }}
        run: |
          if [ "${{ matrix.type }}" == "skinny" ]; then
            URL="git+https://github.com/${REPO}.git@${REF}#subdirectory=libs/skinny"
          elif [ "${{ matrix.type }}" == "tracing" ]; then
            URL="git+https://github.com/${REPO}.git@${REF}#subdirectory=libs/tracing"
          else
            URL="git+https://github.com/${REPO}.git@${REF}"
          fi

          uv run --isolated --no-project --with $URL python -I -c 'import mlflow; print(mlflow.__version__)'

      - name: Test dev/install-skinny.sh
        if: github.event_name == 'pull_request'
        run: |
          dev/install-skinny.sh pull/${{ github.event.pull_request.number }}/merge

      # Anyone with read access can download the uploaded wheel on GitHub.
      - name: Upload wheel
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        if: github.event_name == 'workflow_dispatch'
        id: upload-wheel
        with:
          name: ${{ steps.build-dist.outputs.wheel-name }}
          path: ${{ steps.build-dist.outputs.wheel-path }}
          retention-days: 7
          if-no-files-found: error

      - name: Generate summary
        if: github.event_name == 'workflow_dispatch'
        run: |
          echo "### Download URL" >> $GITHUB_STEP_SUMMARY
          echo "${{ steps.upload-wheel.outputs.artifact-url }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Notes" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- The artifact will be deleted after 7 days." >> $GITHUB_STEP_SUMMARY
          echo "- Unzip the downloaded artifact to get the wheel." >> $GITHUB_STEP_SUMMARY
```

--------------------------------------------------------------------------------

---[FILE: cancel.js]---
Location: mlflow-master/.github/workflows/cancel.js

```javascript
module.exports = async ({ context, github }) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const headSha = context.payload.pull_request.head.sha;
  const prRuns = await github.paginate(github.rest.actions.listWorkflowRunsForRepo, {
    owner,
    repo,
    head_sha: headSha,
    event: "pull_request",
    per_page: 100,
  });
  const unfinishedRuns = prRuns.filter(
    ({ status, name }) =>
      // `post-merge` job in `release-note` workflow should not be cancelled
      status !== "completed" && name !== "release-note"
  );
  for (const run of unfinishedRuns) {
    try {
      // Some runs may have already completed, so we need to handle errors.
      await github.rest.actions.cancelWorkflowRun({
        owner,
        repo,
        run_id: run.id,
      });
      console.log(`Cancelled run ${run.id}`);
    } catch (error) {
      console.error(`Failed to cancel run ${run.id}`, error);
    }
  }
};
```

--------------------------------------------------------------------------------

---[FILE: cancel.yml]---
Location: mlflow-master/.github/workflows/cancel.yml

```yaml
# Cancel workflow runs associated with a pull request when it is closed or merged.
name: Cancel

on:
  pull_request_target:
    types:
      - closed

defaults:
  run:
    shell: bash

jobs:
  cancel:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      actions: write # to cancel workflow runs
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require(
              `${process.env.GITHUB_WORKSPACE}/.github/workflows/cancel.js`
            );
            await script({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: cherry-picks-warn.yml]---
Location: mlflow-master/.github/workflows/cherry-picks-warn.yml

```yaml
name: cherry-picks-warn

on:
  pull_request_target:
    types:
      - opened
    branches:
      - branch-[0-9]+.[0-9]+

defaults:
  run:
    shell: bash

jobs:
  notify:
    runs-on: ubuntu-slim
    timeout-minutes: 5
    permissions:
      pull-requests: write # to post a comment on the PR
    steps:
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `# ⚠️ Important: Cherry-Pick Merge Instructions

            **If you are cherry-picking commits to a release branch, "Rebase and merge" must be used when merging this PR, NOT "Squash and merge".**

            ### Why "Squash and merge" causes problems:

            - It makes reverting individual commits impossible
            - It removes the association between original and cherry-picked commits
            - It makes it difficult to track which commits have been cherry-picked
            - It causes incorrect results in:
              - [\`update-release-labels.yml\`](.github/workflows/update-release-labels.yml)
              - [\`update_changelog.py\`](dev/update_changelog.py)
              - [\`check_patch_prs.py\`](dev/check_patch_prs.py)

            If "Rebase and merge" is disabled, follow [Configuring commit rebasing for pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-rebasing-for-pull-requests) to enable it.`
            });
```

--------------------------------------------------------------------------------

---[FILE: closing-pr.js]---
Location: mlflow-master/.github/workflows/closing-pr.js

```javascript
// Regular expressions to capture a closing syntax in the PR body
// https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
const CLOSING_SYNTAX_PATTERNS = [
  /(?:(?:close|fixe|resolve)[sd]?|fix)\s+(?:mlflow\/mlflow)?#(\d+)/gi,
  /(?:(?:close|fixe|resolve)[sd]?|fix)\s+(?:https?:\/\/github.com\/mlflow\/mlflow\/issues\/)(\d+)/gi,
];
const HAS_CLOSING_PR_LABEL = "has-closing-pr";

const getIssuesToClose = (body) => {
  const commentsExcluded = body.replace(/<!--(.+?)-->/gs, ""); // remove comments
  const matches = CLOSING_SYNTAX_PATTERNS.flatMap((pattern) =>
    Array.from(commentsExcluded.matchAll(pattern))
  );
  const issueNumbers = matches.map((match) => match[1]);
  return [...new Set(issueNumbers)].sort();
};

const arraysEqual = (a1, a2) => {
  return JSON.stringify(a1) == JSON.stringify(a2);
};

const assertArrayEqual = (a1, a2) => {
  if (!arraysEqual(a1, a2)) {
    throw `[${a1}] !== [${a2}]`;
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const test = () => {
  ["close", "closes", "closed", "fix", "fixes", "fixed", "resolve", "resolves", "resolved"].forEach(
    (keyword) => {
      assertArrayEqual(getIssuesToClose(`${keyword} #123`), ["123"]);
      assertArrayEqual(getIssuesToClose(`${capitalizeFirstLetter(keyword)} #123`), ["123"]);
    }
  );

  const body2 = `
Fix mlflow/mlflow#123
Resolve https://github.com/mlflow/mlflow/issues/456
`;
  assertArrayEqual(getIssuesToClose(body2), ["123", "456"]);

  const body3 = `
Fix #123
Close #123
`;
  assertArrayEqual(getIssuesToClose(body3), ["123"]);

  const body4 = "Relates to #123";
  assertArrayEqual(getIssuesToClose(body4), []);

  const body5 = "<!-- close #123 -->";
  assertArrayEqual(getIssuesToClose(body5), []);

  const body6 = "Fixs #123 Fixd #456";
  assertArrayEqual(getIssuesToClose(body6), []);
};

// `node .github/workflows/closing-pr.js` runs this block
if (require.main === module) {
  test();
}

module.exports = async ({ context, github }) => {
  const { body } = context.payload.pull_request;
  const { owner, repo } = context.repo;
  for (const issue_number of getIssuesToClose(body || "")) {
    // Ignore PRs
    const { data: issue } = await github.rest.issues.get({
      owner,
      repo,
      issue_number,
    });
    if (issue.pull_request) {
      continue;
    }
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number,
      labels: [HAS_CLOSING_PR_LABEL],
    });
  }
};
```

--------------------------------------------------------------------------------

---[FILE: closing-pr.yml]---
Location: mlflow-master/.github/workflows/closing-pr.yml

```yaml
name: Closing PR

on:
  pull_request_target:
    types:
      - opened
      - edited

defaults:
  run:
    shell: bash

jobs:
  closing-pr:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    permissions:
      pull-requests: read # closing-pr.js reads the PR body
      issues: write # closing-pr.js labels issues
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require(
              `${process.env.GITHUB_WORKSPACE}/.github/workflows/closing-pr.js`
            );
            await script({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: copilot-setup-steps.yml]---
Location: mlflow-master/.github/workflows/copilot-setup-steps.yml

```yaml
name: copilot-setup-steps

on:
  workflow_dispatch:
  pull_request:
    paths:
      - .github/workflows/copilot-setup-steps.yml

defaults:
  run:
    shell: bash

jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-node
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          uv sync --only-group lint
      - name: pre-commit setup
        run: |
          uv run --only-group lint pre-commit install --install-hooks
          uv run --only-group lint pre-commit run install-bin -a -v
```

--------------------------------------------------------------------------------

---[FILE: cross-version-test-runner.js]---
Location: mlflow-master/.github/workflows/cross-version-test-runner.js

```javascript
async function main({ context, github }) {
  const { comment } = context.payload;
  const { owner, repo } = context.repo;
  const pull_number = context.issue.number;

  const { data: pr } = await github.rest.pulls.get({ owner, repo, pull_number });
  const flavorsMatch = comment.body.match(/\/(?:cross-version-test|cvt)\s+([^\n]+)\n?/);
  if (!flavorsMatch) {
    return;
  }

  // Run the workflow
  const flavors = flavorsMatch[1];
  const uuid = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(
    ""
  );
  const workflow_id = "cross-version-tests.yml";
  await github.rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id,
    ref: pr.base.ref,
    inputs: {
      repository: `${owner}/${repo}`,
      ref: pr.merge_commit_sha,
      flavors,
      // The response of create-workflow-dispatch request doesn't contain the ID of the triggered
      // workflow run. We need to pass a unique identifier to the workflow run and find the run by
      // the identifier. See https://github.com/orgs/community/discussions/9752 for more details.
      uuid,
    },
  });

  // Find the triggered workflow run
  let run;
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const { data: runs } = await github.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      workflow_id,
      event: "workflow_dispatch",
    });
    run = runs.workflow_runs.find((run) => run.name.includes(uuid));
    if (run) {
      break;
    }
  }

  if (!run) {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: "Failed to find the triggered workflow run.",
    });
    return;
  }

  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body: `Cross-version test run started: ${run.html_url}`,
  });
}

module.exports = {
  main,
};
```

--------------------------------------------------------------------------------

---[FILE: cross-version-test-runner.yml]---
Location: mlflow-master/.github/workflows/cross-version-test-runner.yml

```yaml
name: Cross version test runner
on:
  issue_comment:
    types: [created]

defaults:
  run:
    shell: bash

jobs:
  run:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    if: ${{ github.event.issue.pull_request && startsWith(github.event.comment.body, '/cvt') }}
    permissions:
      pull-requests: write
      actions: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: ./.github/actions/validate-author
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        id: get-ref
        with:
          result-encoding: string
          script: |
            const runner = require('./.github/workflows/cross-version-test-runner.js');
            await runner.main({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: cross-version-testing.md]---
Location: mlflow-master/.github/workflows/cross-version-testing.md

```text
# Cross version testing

## What is cross version testing?

Cross version testing is a testing strategy to ensure ML integrations in MLflow such as
`mlflow.sklearn` work properly with their associated packages across various versions.

## Key files

| File (relative path from the root)              | Role                                                           |
| :---------------------------------------------- | :------------------------------------------------------------- |
| [`mlflow/ml-package-versions.yml`][]            | Define which versions to test for each ML package.             |
| [`dev/set_matrix.py`][]                         | Generate a test matrix from `ml-package-versions.yml`.         |
| [`dev/update_ml_package_versions.py`][]         | Update `ml-package-versions.yml` when releasing a new version. |
| [`.github/workflows/cross-version-tests.yml`][] | Define a Github Actions workflow for cross version testing.    |

[`mlflow/ml-package-versions.yml`]: ../../mlflow/ml-package-versions.yml
[`dev/set_matrix.py`]: ../../dev/set_matrix.py
[`dev/update_ml_package_versions.py`]: ../../dev/update_ml_package_versions.py
[`.github/workflows/cross-version-tests.yml`]: ./cross-version-tests.yml

## Configuration keys in `ml-package-versions.yml`

```yml
# Note this is just an example and not the actual sklearn configuration.

# The top-level key specifies the integration name.
sklearn:
  package_info:
    # [Required] `pip_release` specifies the package this integration depends on.
    pip_release: "scikit-learn"

    # [Optional] `install_dev` specifies a set of commands to install the dev version of the package.
    # For example, the command below builds a wheel from the latest main branch of
    # the scikit-learn repository and installs it.
    #
    # The aim of testing the dev version is to spot issues as early as possible before they get
    # piled up, and fix them incrementally rather than fixing them at once when the package
    # releases a new version.
    install_dev: |
      pip install git+https://github.com/scikit-learn/scikit-learn.git

  # [At least one of `models` and `autologging` must be specified]
  # `models` specifies the configuration for model serialization and serving tests.
  # `autologging` specifies the configuration for autologging tests.
  models or autologging:
    # [Optional] `requirements` specifies additional pip requirements required for running tests.
    # For example, '">= 0.24.0": ["xgboost"]' is interpreted as 'if the version of scikit-learn
    # to install is newer than or equal to 0.24.0, install xgboost'.
    requirements:
      ">= 0.24.0": ["xgboost"]

    # [Required] `minimum` specifies the minimum supported version for the latest release of MLflow.
    minimum: "0.20.3"

    # [Required] `maximum` specifies the maximum supported version for the latest release of MLflow.
    maximum: "1.0"

    # [Optional] `unsupported` specifies a list of versions that should NOT be supported due to
    # unacceptable issues or bugs.
    unsupported: ["0.21.3"]

    # [Required] `run` specifies a set of commands to run tests.
    run: |
      pytest tests/sklearn/test_sklearn_model_export.py
```

## How do we determine which versions to test?

We determine which versions to test based on the following rules:

1. Only test [final][] (e.g. `1.0.0`) and [post][] (`1.0.0.post0`) releases.
2. Only test the latest micro version in each minor version.
   For example, if `1.0.0`, `1.0.1`, and `1.0.2` are available, we only test `1.0.2`.
3. The `maximum` version defines the maximum **major** version to test.
   For example, if the value of `maximum` is `1.0.0`, we test `1.1.0` (if available) but not `2.0.0`.
4. Always test the `minimum` version.

[final]: https://www.python.org/dev/peps/pep-0440/#final-releases
[post]: https://www.python.org/dev/peps/pep-0440/#post-releases

The table below describes which `scikit-learn` versions to test for the example configuration in
the previous section:

| Version       | Tested | Comment                                            |
| :------------ | :----- | -------------------------------------------------- |
| 0.20.3        | ✅     | The value of `minimum`                             |
| 0.20.4        | ✅     | The latest micro version of `0.20`                 |
| 0.21rc2       |        |                                                    |
| 0.21.0        |        |                                                    |
| 0.21.1        |        |                                                    |
| 0.21.2        | ✅     | The latest micro version of `0.21` without`0.21.3` |
| 0.21.3        |        | Excluded by `unsupported`                          |
| 0.22rc2.post1 |        |                                                    |
| 0.22rc3       |        |                                                    |
| 0.22          |        |                                                    |
| 0.22.1        |        |                                                    |
| 0.22.2        |        |                                                    |
| 0.22.2.post1  | ✅     | The latest micro version of `0.22`                 |
| 0.23.0rc1     |        |                                                    |
| 0.23.0        |        |                                                    |
| 0.23.1        |        |                                                    |
| 0.23.2        | ✅     | The latest micro version of `0.23`                 |
| 0.24.dev0     |        |                                                    |
| 0.24.0rc1     |        |                                                    |
| 0.24.0        |        |                                                    |
| 0.24.1        |        |                                                    |
| 0.24.2        | ✅     | The latest micro version of `0.24`                 |
| 1.0rc1        |        |                                                    |
| 1.0rc2        |        |                                                    |
| 1.0           |        | The value of `maximum`                             |
| 1.0.1         | ✅     | The latest micro version of `1.0`                  |
| 1.1.dev       | ✅     | The version installed by `install_dev`             |

## Why do we run tests against development versions?

In cross-version testing, we run daily tests against both publicly available and pre-release
development versions for all dependent libraries that are used by MLflow.
This section explains why.

### Without dev version test

First, let's take a look at what would happen **without** dev version test.

```
  |
  ├─ XGBoost merges a change on the master branch that breaks MLflow's XGBoost integration.
  |
  ├─ MLflow 1.20.0 release date
  |
  ├─ XGBoost 1.5.0 release date
  ├─ ❌ We notice the change here and might need to make a patch release if it's critical.
  |
  v
time
```

- We didn't notice the change until after XGBoost 1.5.0 was released.
- MLflow 1.20.0 doesn't work with XGBoost 1.5.0.

### With dev version test

Then, let's take a look at what would happen **with** dev version test.

```
  |
  ├─ XGBoost merges a change on the master branch that breaks MLflow's XGBoost integration.
  ├─ ✅ Tests for the XGBoost integration fail -> We can notice the change and apply a fix for it.
  |
  ├─ MLflow 1.20.0 release date
  |
  ├─ XGBoost 1.5.0 release date
  |
  v
time
```

- We can notice the change **before XGBoost 1.5.0 is released** and apply a fix for it **before releasing MLflow 1.20.0**.
- MLflow 1.20.0 works with XGBoost 1.5.0.

## When do we run cross version tests?

1. Daily at 7:00 UTC using a cron scheduler.
   [README on the repository root](../../README.md) has a badge ([![badge-img][]][badge-target]) that indicates the status of the most recent cron run.
2. When a PR that affects the ML integrations is created. Note we only run tests relevant to
   the affected ML integrations. For example, a PR that affects files in `mlflow/sklearn` triggers
   cross version tests for `sklearn`.

[badge-img]: https://github.com/mlflow/mlflow/workflows/Cross%20version%20tests/badge.svg?event=schedule
[badge-target]: https://github.com/mlflow/mlflow/actions?query=workflow%3ACross%2Bversion%2Btests+event%3Aschedule

## How to run cross version test for dev versions on a pull request

By default, cross version tests for dev versions are disabled on a pull request.
To enable them, the following steps are required.

1. Click `Labels` in the right sidebar.
2. Click the `enable-dev-tests` label and make sure it's applied on the pull request.
3. Push a new commit or re-run the `cross-version-tests` workflow.

See also:

- [GitHub Docs - Applying a label](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels#applying-a-label)
- [GitHub Docs - Re-running workflows and jobs](https://docs.github.com/en/actions/managing-workflow-runs/re-running-workflows-and-jobs)

## How to run cross version tests manually

The `cross-version-tests.yml` workflow can be run manually without creating a pull request.

1. Open https://github.com/mlflow/mlflow/actions/workflows/cross-version-tests.yml.
2. Click `Run workflow`.
3. Fill in the input parameters.
4. Click `Run workflow` at the bottom of the parameter input form.

See also:

- [GitHub Docs - Manually running a workflow](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow)
```

--------------------------------------------------------------------------------

````
