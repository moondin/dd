---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 15
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 15 of 991)

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

---[FILE: resolve.yml]---
Location: mlflow-master/.github/workflows/resolve.yml

```yaml
name: resolve

on:
  issue_comment:
    types: [created]
  pull_request:
    paths:
      - .github/workflows/resolve.yml
      - .claude/commands/resolve.md
      - .claude/skills/fetch-unresolved-comments/**

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

defaults:
  run:
    shell: bash

jobs:
  precheck:
    runs-on: ubuntu-slim
    permissions:
      pull-requests: write
    timeout-minutes: 5
    if: >
      (github.event_name == 'pull_request' &&
       github.event.pull_request.head.repo.full_name == github.repository &&
       (
        contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.pull_request.author_association) ||
        (github.event.pull_request.user.login == 'Copilot' && github.event.pull_request.user.type == 'Bot')
       ))
      ||
      (github.event_name == 'issue_comment' &&
       github.event.issue.pull_request &&
       (
        contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.issue.author_association) ||
        (github.event.issue.user.login == 'Copilot' && github.event.issue.user.type == 'Bot')
       ) &&
       contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.comment.author_association) &&
       startsWith(github.event.comment.body, '/resolve'))
    outputs:
      head_ref: ${{ steps.pr-info.outputs.head_ref }}
      head_repository: ${{ steps.pr-info.outputs.head_repository }}
      prompt: ${{ steps.prompt.outputs.prompt }}
      comment_id: ${{ github.event.comment.id }}
    steps:
      - name: Check authorization
        if: ${{ github.event_name == 'issue_comment' }}
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const { comment } = context.payload;

            // Check user association - only allow OWNER, MEMBER, or COLLABORATOR
            const authorAssociation = comment.author_association;
            const isAllowed = ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(authorAssociation);

            let message;
            if (isAllowed) {
              const workflowUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}?pr=${context.issue.number}`;
              message = `🚀 [Resolve workflow started](${workflowUrl})`;
            } else {
              message = `⚠️ Only repository maintainers and collaborators are allowed to trigger this workflow. Your association: ${authorAssociation}`;
            }

            const updatedBody = `${comment.body}\n\n---\n${message}`;

            await github.rest.issues.updateComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              comment_id: comment.id,
              body: updatedBody,
            });

            if (!isAllowed) {
              throw new Error(`User not allowed to trigger workflow: ${comment.user.login} (association: ${authorAssociation})`);
            }

      - name: Get PR information
        id: pr-info
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        env:
          PR_NUMBER: ${{ github.event.pull_request.number || github.event.issue.number }}
        with:
          script: |
            const prNumber = parseInt(process.env.PR_NUMBER, 10);
            const { data: pr } = await github.rest.pulls.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: prNumber
            });

            core.setOutput('head_ref', pr.head.ref);
            core.setOutput('head_repository', pr.head.repo.full_name);

      - name: Extract optional prompt from comment
        if: github.event_name == 'issue_comment'
        id: prompt
        env:
          COMMENT_BODY: ${{ github.event.comment.body }}
        run: |
          PROMPT=$(echo "$COMMENT_BODY" | sed 's|^/resolve\s*||' | xargs)
          echo "prompt=$PROMPT" >> $GITHUB_OUTPUT

  resolve:
    needs: precheck
    runs-on: ubuntu-latest
    permissions:
      pull-requests: read
    timeout-minutes: 30
    steps:
      - uses: actions/create-github-app-token@d72941d797fd3113feb6b93fd0dec494b13a2547 # v1.12.0
        id: app-token
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}

      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ needs.precheck.outputs.head_repository }}
          ref: ${{ needs.precheck.outputs.head_ref }}
          token: ${{ steps.app-token.outputs.token }}

      - name: Configure git
        run: |
          git config user.name 'mlflow-app[bot]'
          git config user.email 'mlflow-app[bot]@users.noreply.github.com'

      - uses: ./.github/actions/setup-python

      - name: Set up pre-commit
        run: |
          uv run --only-group lint pre-commit install
          uv run --only-group lint pre-commit run install-bin -a -v

      - name: Install Claude CLI
        run: |
          npm install -g @anthropic-ai/claude-code@2.0.24

      - name: Run Claude resolve command
        id: claude-fix
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PROMPT: ${{ needs.precheck.outputs.prompt }}
          PR_NUMBER: ${{ github.event.pull_request.number || github.event.issue.number }}
        run: |
          OUTPUT_FILE="/tmp/output.json"

          # Safe construction using arrays - PROMPT is passed as separate argument to prevent shell injection
          ARGS=("/resolve")
          [ -n "$PROMPT" ] && ARGS+=("$PROMPT")
          timeout 10m claude --print --verbose --output-format json "${ARGS[*]}" > "$OUTPUT_FILE" || true

          # Display output in workflow logs (pretty print if valid JSON)
          echo "=== Claude Output ==="
          if jq empty "$OUTPUT_FILE" 2>/dev/null; then
            jq . "$OUTPUT_FILE"
          else
            cat "$OUTPUT_FILE"
          fi
          echo "===================="

      - name: Upload Claude output
        if: always()
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        with:
          name: claude-output
          path: /tmp/output.json
          if-no-files-found: ignore

      - name: Push changes
        env:
          IS_PULL_REQUEST: ${{ github.event_name == 'pull_request' }}
        run: |
          if [ "$IS_PULL_REQUEST" = "true" ]; then
            echo "Running git push in dry-run mode (pull_request event)"
            git push --dry-run
          else
            echo "Pushing changes to remote"
            git push
          fi

  report:
    needs: [precheck, resolve]
    if: |
      always() &&
      !contains(needs.*.result, 'cancelled') &&
      !contains(needs.*.result, 'skipped')
    runs-on: ubuntu-slim
    permissions:
      pull-requests: write
    timeout-minutes: 5
    steps:
      - name: Download Claude output
        uses: actions/download-artifact@95815c38cf2ff2164869cbab79da8d1f422bc89e # v4.2.1
        with:
          name: claude-output
          path: /tmp
        continue-on-error: true

      - name: Update original comment with result
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        env:
          COMMENT_ID: ${{ needs.precheck.outputs.comment_id }}
          RESOLVE_JOB_STATUS: ${{ needs.resolve.result }}
        with:
          script: |
            const fs = require('fs');

            const resolveJobStatus = process.env.RESOLVE_JOB_STATUS;
            const statusMessage = resolveJobStatus !== 'success'
              ? `⚠️ Workflow encountered an error.`
              : `✅ Workflow completed successfully.`;

            let resultMessage = statusMessage;

            // Read Claude output from file instead of environment variable
            const outputPath = '/tmp/output.json';
            let claudeOutput = '';
            try {
              if (fs.existsSync(outputPath)) {
                claudeOutput = fs.readFileSync(outputPath, 'utf8');
              }
            } catch (e) {
              console.log('Failed to read Claude output file:', e);
            }

            // Extract and display Claude's result and raw output
            if (claudeOutput) {
              try {
                const events = JSON.parse(claudeOutput);
                const resultEvent = events.find(({ type }) => type === 'result');
                if (resultEvent) {
                  resultMessage += `\n\n<details>\n<summary>Claude Output</summary>\n\n${resultEvent.result}\n\n</details>`;
                }
              } catch (e) {
                console.log('Failed to parse Claude output as JSON:', e);
              }
            }

            console.log('Result message to post:', resultMessage);

            if (process.env.COMMENT_ID) {
              const commentId = parseInt(process.env.COMMENT_ID, 10);
              const { data: currentComment } = await github.rest.issues.getComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: commentId,
              });

              const updatedBody = `${currentComment.body}\n\n---\n${resultMessage}`;

              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: commentId,
                body: updatedBody,
              });
            }
```

--------------------------------------------------------------------------------

---[FILE: review.yml]---
Location: mlflow-master/.github/workflows/review.yml
Signals: React

```yaml
name: review

on:
  issue_comment:
    types: [created]
  pull_request:
    paths:
      - .github/workflows/review.yml
      - .claude/commands/pr-review.md
      - dev/mcps/review.py

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}

defaults:
  run:
    shell: bash

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    timeout-minutes: 30
    # Security: Only run for authorized users.
    # - pull_request: Only run for PRs from the upstream repo by authorized users (not forks)
    # - issue_comment: BOTH PR author and commenter must be authorized (can't trust external PRs)
    if: >
      (github.event_name == 'pull_request' &&
       github.event.pull_request.head.repo.full_name == github.repository &&
       (
        contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.pull_request.author_association) ||
        (github.event.pull_request.user.login == 'Copilot' && github.event.pull_request.user.type == 'Bot')
       ))
      ||
      (github.event_name == 'issue_comment' &&
       github.event.issue.pull_request &&
       (
        contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.issue.author_association) ||
        (github.event.issue.user.login == 'Copilot' && github.event.issue.user.type == 'Bot')
       ) &&
       contains(fromJson('["OWNER", "MEMBER", "COLLABORATOR"]'), github.event.comment.author_association) &&
       startsWith(github.event.comment.body, '/review'))
    steps:
      - name: React to comment
        if: ${{ github.event_name == 'issue_comment' }}
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const { comment } = context.payload;

            // Check user association - only allow OWNER, MEMBER, or COLLABORATOR
            const authorAssociation = comment.author_association;
            const isAllowed = ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(authorAssociation);

            let message;
            if (isAllowed) {
              const workflowUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}?pr=${context.issue.number}`;
              message = `🚀 [Review workflow started](${workflowUrl})`;
            } else {
              message = `⚠️ Only repository maintainers and collaborators are allowed to trigger this workflow. Your association: ${authorAssociation}`;
            }

            const updatedBody = `${comment.body}\n\n---\n${message}`;

            await github.rest.issues.updateComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              comment_id: comment.id,
              body: updatedBody,
            });

            if (!isAllowed) {
              throw new Error(`User not allowed to trigger workflow: ${comment.user.login} (association: ${authorAssociation})`);
            }
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          ref: refs/pull/${{ github.event.pull_request.number || github.event.issue.number }}/merge
      - uses: astral-sh/setup-uv@f0ec1fc3b38f5e7cd731bb6ce540c5af426746bb # v6.1.0
      - name: Install Claude CLI
        run: |
          npm install -g @anthropic-ai/claude-code@2.0.24

      - name: Set up MCP servers
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          claude mcp add review --env "GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }}" -- uv run --no-project dev/mcps/review.py

      - name: Extract optional prompt from comment
        if: github.event_name == 'issue_comment'
        id: prompt
        env:
          COMMENT_BODY: ${{ github.event.comment.body }}
        run: |
          PROMPT=$(echo "$COMMENT_BODY" | sed 's|^/review\s*||' | xargs)
          echo "prompt=$PROMPT" >> $GITHUB_OUTPUT

      - name: Review
        id: review
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          PR_NUMBER: ${{ github.event.pull_request.number || github.event.issue.number }}
          PROMPT: ${{ steps.prompt.outputs.prompt }}
        run: |
          OUTPUT_FILE="/tmp/output.json"

          # Safe construction using arrays - PROMPT is passed as separate argument to prevent shell injection
          ARGS=("/pr-review")
          [ -n "$PROMPT" ] && ARGS+=("$PROMPT")

          EXIT_CODE=0
          timeout 20m claude --print --verbose --output-format json "${ARGS[*]}" > "$OUTPUT_FILE" 2>&1 || EXIT_CODE=$?
          if [ "${EXIT_CODE:-0}" -eq 124 ]; then
            echo "Warning: Claude command timed out after 20 minutes"
          elif [ "${EXIT_CODE:-0}" -ne 0 ]; then
            echo "Error: Claude command failed with exit code $EXIT_CODE"
            cat "$OUTPUT_FILE"
            exit $EXIT_CODE
          fi

          # Display output in workflow logs (pretty print if valid JSON)
          echo "=== Claude Output ==="
          if [ ! -s "$OUTPUT_FILE" ]; then
            echo "(empty output)"
          elif jq empty "$OUTPUT_FILE" 2>/dev/null; then
            jq . "$OUTPUT_FILE"
          else
            cat "$OUTPUT_FILE"
          fi
          echo "===================="

      - name: Report review results
        if: ${{ github.event_name == 'issue_comment' }}
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const fs = require('fs');
            const { owner, repo } = context.repo;
            const { comment } = context.payload;

            // Read Claude output from file instead of environment variable
            const outputPath = '/tmp/output.json';
            let claudeOutput = '';
            try {
              if (fs.existsSync(outputPath)) {
                claudeOutput = fs.readFileSync(outputPath, 'utf8');
              }
            } catch (e) {
              console.log('Failed to read Claude output file:', e);
            }

            let resultMessage = '✅ Review completed.';

            // Extract and display Claude's result from JSON output
            if (claudeOutput) {
              try {
                const events = JSON.parse(claudeOutput);
                const resultEvent = events.findLast(({ type }) => type === 'result');
                if (resultEvent) {
                  resultMessage += `\n\n<details>\n<summary>Review Output</summary>\n\n${resultEvent.result}\n\n</details>`;
                }
              } catch (e) {
                console.log('Failed to parse Claude output as JSON:', e);
              }
            }

            console.log('Result message to post:', resultMessage);

            const { data: currentComment } = await github.rest.issues.getComment({
              owner,
              repo,
              comment_id: comment.id,
            });

            const updatedBody = `${currentComment.body}\n\n---\n${resultMessage}`;

            await github.rest.issues.updateComment({
              owner,
              repo,
              comment_id: comment.id,
              body: updatedBody
            });
```

--------------------------------------------------------------------------------

---[FILE: slow-tests.yml]---
Location: mlflow-master/.github/workflows/slow-tests.yml
Signals: Docker

```yaml
# A daily job to run slow tests with MLFLOW_RUN_SLOW_TESTS environment variable set to true.
name: MLflow Slow Tests

on:
  pull_request:
    paths:
      # Run this workflow in PR when relevant files change
      - ".github/workflows/slow-tests.yml"
      - "tests/pyfunc/docker/**"
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
  MLFLOW_RUN_SLOW_TESTS: "true"
  MLFLOW_HOME: ${{ github.workspace }}
  PIP_EXTRA_INDEX_URL: https://download.pytorch.org/whl/cpu
  PIP_CONSTRAINT: ${{ github.workspace }}/requirements/constraints.txt

jobs:
  docker-build:
    runs-on: ubuntu-latest
    timeout-minutes: 120
    permissions:
      contents: read
    if: (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || github.event_name == 'workflow_dispatch' || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    strategy:
      fail-fast: false
      matrix:
        group: [1, 2, 3]
        include:
          - splits: 3
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/free-disk-space
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-pyenv
      - uses: ./.github/actions/setup-java
      - name: Install dependencies
        run: |
          python -m venv .venv
          source .venv/bin/activate
          source ./dev/install-common-deps.sh --ml
          # transformers requires `tf-keras` when keras 3.0 is installed.
          # See https://github.com/huggingface/transformers/issues/27377 for more details.
          # Installing pyarrow < 18 to prevent lightgbm test pip installation resolution conflicts.
          python -m pip install langchain_experimental tf-keras "pyarrow<18"
      - uses: ./.github/actions/show-versions
      - uses: ./.github/actions/pipdeptree
      - name: Run tests
        run: |
          source .venv/bin/activate
          pytest --splits=${{ matrix.splits }} --group=${{ matrix.group }} tests/pyfunc/docker
```

--------------------------------------------------------------------------------

---[FILE: snapshots.yml]---
Location: mlflow-master/.github/workflows/snapshots.yml

```yaml
name: snapshots
description: Daily uploads package snapshots to https://github.com/mlflow/mlflow/releases/tag/nightly.

on:
  schedule:
    - cron: "0 0 * * *" # Runs daily at midnight UTC
  workflow_dispatch: # Allows manual triggering
  pull_request: # To test updates
    paths:
      - ".github/workflows/snapshots.yml"
      - ".github/scripts/src/snapshots.ts"

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write # Needed to create/update releases and manage assets
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-python
      - uses: ./.github/actions/setup-java
      - uses: ./.github/actions/setup-node
      - uses: r-lib/actions/setup-r@bd49c52ffe281809afa6f0fecbf37483c5dd0b93 # v2.11.3

      - name: Create artifacts directory
        run: |
          ARTIFACT_DIR=$(mktemp -d)
          echo "ARTIFACT_DIR=$ARTIFACT_DIR" >> $GITHUB_ENV

      - name: Build Python packages
        id: build-dist
        run: |
          pip install build
          python dev/build.py
          find $PWD/dist -type f -name "*.whl" -exec cp {} $ARTIFACT_DIR/ \;
          python dev/build.py --package-type skinny
          find $PWD/dist -type f -name "*.whl" -exec cp {} $ARTIFACT_DIR/ \;
          ls $ARTIFACT_DIR

      - name: Build R package
        working-directory: mlflow/R/mlflow
        run: |
          Rscript -e 'install.packages("devtools")'
          Rscript -e 'devtools::build(path = ".")'
          find $PWD -name "*.tar.gz" -type f -exec cp {} $ARTIFACT_DIR/ \;
          ls $ARTIFACT_DIR

      - name: Build Java packages
        working-directory: mlflow/java
        run: |
          mvn -B -DskipTests clean package
          find $PWD -path "*/target/*.jar" \
              ! -name "*sources.jar" \
              ! -name "*javadoc.jar" \
              ! -name "original-*.jar" \
              -exec cp {} $ARTIFACT_DIR/ \;
          ls $ARTIFACT_DIR

      - name: Install and build
        working-directory: .github/scripts
        run: npm ci && npm run build

      - name: Upload artifacts to nightly release
        # This step requires contents write permission, but pull requests filed from forks do not have this permission.
        if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == 'mlflow/mlflow'
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const { uploadSnapshots } = require('./.github/scripts/dist/bundle.js');
            await uploadSnapshots({
              github,
              context,
              artifactDir: process.env.ARTIFACT_DIR
            });
```

--------------------------------------------------------------------------------

---[FILE: stale.yml]---
Location: mlflow-master/.github/workflows/stale.yml

```yaml
name: Stale

on:
  schedule:
    - cron: "0 0 * * *" # Run daily at midnight UTC
  workflow_dispatch:

defaults:
  run:
    shell: bash

jobs:
  stale:
    runs-on: ubuntu-slim
    permissions:
      issues: write
      pull-requests: write
    timeout-minutes: 10
    steps:
      - uses: actions/stale@997185467fa4f803885201cee163a9f38240193d # v10.1.1
        with:
          days-before-stale: 365
          days-before-close: 14
          stale-issue-label: stale
          stale-pr-label: stale
          exempt-issue-labels: security,bug,enhancement
          exempt-pr-labels: security
          operations-per-run: 100
```

--------------------------------------------------------------------------------

---[FILE: team-review.yml]---
Location: mlflow-master/.github/workflows/team-review.yml

```yaml
name: Team review

on:
  pull_request_target:
    types:
      - labeled

concurrency:
  group: ${{ github.workflow }}
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  review:
    runs-on: ubuntu-slim
    if: ${{ github.event.label.name == 'team-review' }}
    timeout-minutes: 5
    permissions:
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: .github/scripts

      - name: Select reviewers
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require('./.github/scripts/select-reviewers.js');
            await script({ github, context });
```

--------------------------------------------------------------------------------

---[FILE: tracing.yaml]---
Location: mlflow-master/.github/workflows/tracing.yaml

```yaml
name: 🔍 Tracing SDK Test

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
  MLFLOW_HOME: /home/runner/work/mlflow/mlflow
  MLFLOW_CONDA_HOME: /usr/share/miniconda
  PYTHONUTF8: "1"
  MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"

jobs:
  core:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    timeout-minutes: 30
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/setup-python

      # Install mlflow-tracing SDK from the current directory
      - name: Install mlflow-tracing SDK
        run: |
          pip install pip setuptools --upgrade
          pip install ./libs/tracing

      - name: Install test dependencies
        run: |
          pip install pytest pytest-asyncio pytest-timeout

      - name: Run core tracing tests
        # NB: OTLP exporter includes large dependencies, so we want to test it in a separate job
        #     to avoid overlooking unnecessary dependencies in the core tracing package.
        run: |
          export PYTHONPATH=$(pwd)
          pytest tests/tracing \
            --ignore tests/tracing/utils/test_otlp.py \
            --ignore tests/tracing/test_assessment.py \
            --ignore tests/tracing/test_otel_logging.py \
            --ignore tests/tracing/processor/test_otel_metrics.py \
            --ignore tests/tracing/opentelemetry/test_integration.py \
            --ignore tests/tracing/test_otel_loading.py \
            --import-mode=importlib

  # TODO: Add a job to run autologging tests against integrated libraries (latest versions)

  # TODO: Add a job to warn large package size increase.
  # package-size:

  # TODO: Add a job to test OTLP export
```

--------------------------------------------------------------------------------

---[FILE: typescript.yml]---
Location: mlflow-master/.github/workflows/typescript.yml

```yaml
name: TypeScript SDK

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

defaults:
  run:
    shell: bash

jobs:
  typescript-sdk:
    if: github.event_name != 'pull_request' || github.event.pull_request.draft == false
    permissions:
      contents: read
    timeout-minutes: 20
    strategy:
      fail-fast: false
      matrix:
        node-version: [20, 22, 24]
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: libs/typescript
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: ./.github/actions/untracked
      - uses: ./.github/actions/setup-python # Required for running a tracking server
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
          cache-dependency-path: libs/typescript/package-lock.json

      - name: Install dependencies
        run: npm install

      - name: Run format check
        run: npm run format:check

      - name: Run linting
        run: npm run lint

      - name: Run build
        run: npm run build

      - name: Run core tests
        run: npm run test:core

      - name: Run tests for integrations
        run: npm run test:integrations
```

--------------------------------------------------------------------------------

---[FILE: uc-oss.yml]---
Location: mlflow-master/.github/workflows/uc-oss.yml

```yaml
name: uc-oss

on:
  pull_request: # for testing
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - .github/workflows/uc-oss.yml
      - mlflow/protos/**
      - mlflow/store/**
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
  MLFLOW_SERVER_ENABLE_JOB_EXECUTION: "false"

jobs:
  uc-oss-integration-test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    if: github.event_name == 'workflow_dispatch' || (github.event_name == 'schedule' && github.repository == 'mlflow/dev') || (github.event_name == 'pull_request' && github.event.pull_request.draft == false)
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          repository: ${{ github.event_name == 'schedule' && 'mlflow/mlflow' || github.event.inputs.repository }}
          ref: ${{ github.event.inputs.ref }}
      - uses: ./.github/actions/setup-python

      - name: Install dependencies
        run: |
          source ./dev/install-common-deps.sh

      - name: Set up Java 17
        uses: actions/setup-java@0ab4596768b603586c0de567f2430c30f5b0d2b0 # v3.13.0
        with:
          java-version: "17"
          distribution: "temurin" # Use Temurin distribution of OpenJDK

      - name: Clone UnityCatalog at tag v0.2.1
        run: |
          git clone --branch v0.2.1 --depth 1 https://github.com/unitycatalog/unitycatalog.git

      - name: Build uc-oss server
        working-directory: unitycatalog
        run: |
          build/sbt package

      - name: Run tests for UnityCatalog
        run: |
          export UC_OSS_INTEGRATION=true
          pytest tests/uc_oss/test_uc_oss_integration.py
```

--------------------------------------------------------------------------------

---[FILE: update-release-labels.yml]---
Location: mlflow-master/.github/workflows/update-release-labels.yml

```yaml
name: Update Release Labels

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      release_version:
        description: "Target release version (e.g., 3.1.4)"
        required: true
        type: string

defaults:
  run:
    shell: bash

jobs:
  update-labels:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
      issues: write
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7

      - uses: ./.github/actions/setup-node

      - name: Install and build tools
        working-directory: .github/scripts
        run: npm ci && npm run build

      - name: Update release labels
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const { updateReleaseLabels } = require('.github/scripts/dist/bundle.js');
            await updateReleaseLabels({ github, context });
```

--------------------------------------------------------------------------------

---[FILE: uv.js]---
Location: mlflow-master/.github/workflows/uv.js

```javascript
const { spawnSync } = require("child_process");

function exec(cmd, args) {
  console.log(`> ${cmd} ${args.join(" ")}`);

  const result = spawnSync(cmd, args, {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${cmd} ${args.join(" ")}`);
  }

  return result;
}

function execWithOutput(cmd, args) {
  console.log(`> ${cmd} ${args.join(" ")}`);

  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });

  const output = (result.stdout || "") + (result.stderr || "");
  if (result.status !== 0) {
    throw new Error(
      `Command failed with exit code ${result.status}: ${cmd} ${args.join(" ")}\nOutput: ${output}`
    );
  }

  return output;
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
}

module.exports = async ({ github, context }) => {
  // Note: We intentionally avoid early exits to maximize test coverage on PRs
  // This allows testing the entire workflow except git push and PR creation

  const uvLockOutput = execWithOutput("uv", ["lock", "--upgrade"]);
  console.log(`uv lock output:\n${uvLockOutput}`);

  // Check if uv.lock has changes
  const gitStatus = execWithOutput("git", ["status", "--porcelain", "uv.lock"]);
  const hasChanges = gitStatus.trim() !== "";

  const branchName = `uv-lock-update-${getTimestamp()}`;
  exec("git", ["config", "user.name", "mlflow-app[bot]"]);
  exec("git", ["config", "user.email", "mlflow-app[bot]@users.noreply.github.com"]);
  exec("git", ["checkout", "-b", branchName]);
  // `git add` succeeds even if there are no changes
  exec("git", ["add", "uv.lock"]);
  // `--allow-empty` in case `uv.lock` is unchanged
  exec("git", ["commit", "-s", "--allow-empty", "-m", "Update uv.lock"]);
  // `--dry-run` to avoid actual push but verify it would succeed
  const isPr = context.eventName === "pull_request";
  const args = isPr ? ["--dry-run"] : [];
  exec("git", ["push", ...args, "origin", branchName]);

  // Search for existing PR
  const PR_TITLE = "Update `uv.lock`";
  const { repo, owner } = context.repo;
  const { data: searchResults } = await github.rest.search.issuesAndPullRequests({
    q: `repo:${owner}/${repo} is:pr is:open base:master "${PR_TITLE}" in:title`,
    per_page: 1,
  });

  if (isPr) {
    console.log("In pull request mode, not pushing changes or creating a new PR");
    return;
  } else if (searchResults.total_count > 0) {
    console.log(`An open PR already exists: ${searchResults.items[0].html_url}`);
    return;
  } else if (!hasChanges) {
    console.log("No changes to uv.lock, not creating a PR");
    return;
  }

  // Create PR
  const runUrl = `https://github.com/${owner}/${repo}/actions/runs/${context.runId}`;
  const { data: pr } = await github.rest.pulls.create({
    owner,
    repo,
    title: PR_TITLE,
    head: branchName,
    base: "master",
    body: `This PR was created automatically to update \`uv.lock\`.

### \`uv lock\` output

\`\`\`
${uvLockOutput.trim()}
\`\`\`

Created by: ${runUrl}
`,
  });
  console.log(`Created PR: ${pr.html_url}`);

  // Add team-review label to request review from the team
  await github.rest.issues.addLabels({
    owner,
    repo,
    issue_number: pr.number,
    labels: ["team-review"],
  });
  console.log("Added team-review label to the PR");
};
```

--------------------------------------------------------------------------------

---[FILE: uv.yml]---
Location: mlflow-master/.github/workflows/uv.yml

```yaml
name: uv

on:
  pull_request:
    branches:
      - master
    paths:
      - .github/workflows/uv.yml
      - .github/workflows/uv.js
  schedule:
    # Run this workflow on Monday and Thursday at 13:00 UTC
    - cron: "0 13 * * 1,4"
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.event_name }}-${{ github.ref }}
  cancel-in-progress: true

defaults:
  run:
    shell: bash

jobs:
  uv:
    # Skip scheduled runs on forks
    if: github.event_name != 'schedule' || github.repository == 'mlflow/mlflow'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/create-github-app-token@67018539274d69449ef7c02e8e71183d1719ab42 # v2.1.4
        id: app-token
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          token: ${{ steps.app-token.outputs.token }}
      - uses: ./.github/actions/setup-python
      - name: Update uv.lock and create PR
        uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          github-token: ${{ steps.app-token.outputs.token }}
          script: |
            const script = require('.github/workflows/uv.js');
            await script({ github, context });
```

--------------------------------------------------------------------------------

---[FILE: xtest-viz.yml]---
Location: mlflow-master/.github/workflows/xtest-viz.yml

```yaml
name: xtest-viz

on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    paths:
      - .github/workflows/xtest-viz.yml
      - dev/xtest_viz.py
  schedule:
    # Run daily at 16:00 UTC (3 hours after cross-version-tests.yml at 13:00)
    - cron: "0 16 * * *"

defaults:
  run:
    shell: bash

jobs:
  xtest-viz:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    permissions:
      contents: read
      actions: read
    if: >
      (
        github.event_name == 'schedule' &&
        github.repository == 'mlflow/dev'
      ) || (
        github.event_name == 'pull_request' &&
        github.event.pull_request.draft == false
      )

    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2

      - name: Set up Python
        uses: ./.github/actions/setup-python

      - name: Generate cross-version test visualization
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          echo "## Cross-Version Test Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "**Generated:** $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          uv run dev/xtest_viz.py \
            --days 14 \
            --repo mlflow/dev >> $GITHUB_STEP_SUMMARY
```

--------------------------------------------------------------------------------

---[FILE: clint.json]---
Location: mlflow-master/.github/workflows/matchers/clint.json

```json
{
  "problemMatcher": [
    {
      "owner": "clint",
      "severity": "error",
      "pattern": [
        {
          "regexp": "^(.+?):(\\d+):(\\d+):\\s*([A-Z]+\\d+):\\s*(.+)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "message": 5,
          "code": 4
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: format.json]---
Location: mlflow-master/.github/workflows/matchers/format.json

```json
{
  "problemMatcher": [
    {
      "owner": "black",
      "severity": "error",
      "pattern": [
        {
          "regexp": "^([^:]+):(\\d+):(\\d+): (Unformatted file\\. .+)$",
          "file": 1,
          "line": 2,
          "column": 3,
          "message": 4
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

````
