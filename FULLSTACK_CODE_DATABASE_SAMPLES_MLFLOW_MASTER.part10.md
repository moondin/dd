---
source_txt: fullstack_samples/mlflow-master
converted_utc: 2025-12-18T11:25:52Z
part: 10
parts_total: 991
---

# FULLSTACK CODE DATABASE SAMPLES mlflow-master

## Verbatim Content (Part 10 of 991)

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

---[FILE: snapshots.ts]---
Location: mlflow-master/.github/scripts/src/snapshots.ts

```typescript
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import type { getOctokit } from "@actions/github";
import type { context as ContextType } from "@actions/github";

type GitHub = ReturnType<typeof getOctokit>;
type Context = typeof ContextType;
type GitHubAsset = Awaited<
  ReturnType<GitHub["rest"]["repos"]["listReleaseAssets"]>
>["data"][number];
type GitHubRelease = Awaited<ReturnType<GitHub["rest"]["repos"]["getReleaseByTag"]>>["data"];

// Constants
const RELEASE_TAG = "nightly";
const DAYS_TO_KEEP = 3;

interface SnapshotParams {
  github: GitHub;
  context: Context;
  artifactDir: string;
}

/**
 * Check if artifact file type is supported
 */
function isSupportedArtifact(filename: string): boolean {
  return /\.(whl|jar|tar\.gz)$/.test(filename);
}

/**
 * Get content type based on file extension
 */
function getContentType(filename: string): string {
  if (filename.match(/\.whl$/)) {
    return "application/zip";
  } else if (filename.match(/\.tar\.gz$/)) {
    return "application/gzip";
  } else if (filename.match(/\.jar$/)) {
    return "application/java-archive";
  }
  throw new Error(
    `Unsupported file type for content type: ${filename}. Only .whl, .jar, and .tar.gz are supported.`
  );
}

/**
 * Check if asset should be deleted based on age
 */
function shouldDeleteAsset(asset: GitHubAsset, daysToKeep: number): boolean {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const assetDate = new Date(asset.created_at);
  return assetDate < cutoffDate;
}

/**
 * Add commit SHA to filename based on file type
 */
function addShaToFilename(filename: string, sha: string): string {
  const shortSha = sha.substring(0, 7);

  // Match .whl files
  if (filename.match(/\.whl$/)) {
    // For wheel files, insert SHA as build tag before .whl extension
    // Build tags must start with a digit, so prefix with "0"
    const wheelParts = filename.match(/^(.+?)(-py[^-]+(?:-[^-]+)*\.whl)$/);
    if (wheelParts) {
      return `${wheelParts[1]}-0${shortSha}${wheelParts[2]}`;
    }
    // Fallback for non-standard wheel names
    return filename.replace(/\.whl$/, `-0${shortSha}.whl`);
  }

  // Match .jar files
  if (filename.match(/\.jar$/)) {
    return filename.replace(/\.jar$/, `-${shortSha}.jar`);
  }

  // Match .tar.gz files
  if (filename.match(/\.tar\.gz$/)) {
    return filename.replace(/\.tar\.gz$/, `-${shortSha}.tar.gz`);
  }

  throw new Error(
    `Unexpected file extension for: ${filename}. Only .whl, .jar, and .tar.gz are supported.`
  );
}

/**
 * Upload artifacts to a GitHub release
 */
export async function uploadSnapshots({
  github,
  context,
  artifactDir,
}: SnapshotParams): Promise<void> {
  if (!existsSync(artifactDir)) {
    throw new Error(`Artifacts directory not found: ${artifactDir}`);
  }

  const artifactFiles = readdirSync(artifactDir)
    .map((f) => join(artifactDir, f))
    .filter((f) => statSync(f).isFile());

  if (artifactFiles.length === 0) {
    throw new Error(`No artifacts found in ${artifactDir}`);
  }

  // Check for unsupported file types
  const unsupportedFiles = artifactFiles.filter((f) => !isSupportedArtifact(f));
  if (unsupportedFiles.length > 0) {
    const names = unsupportedFiles.map((f) => `  - ${basename(f)}`).join("\n");
    throw new Error(
      `Found unsupported file types:\n${names}\nOnly .whl, .jar, and .tar.gz files are supported.`
    );
  }

  // Check if the release already exists
  const { owner, repo } = context.repo;
  let release: GitHubRelease;
  let releaseExists = false;
  try {
    const { data } = await github.rest.repos.getReleaseByTag({
      owner,
      repo,
      tag: RELEASE_TAG,
    });
    release = data;
    releaseExists = true;
    console.log(`Found existing release: ${release.id}`);
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }

  const releaseParams = {
    owner,
    repo,
    tag_name: RELEASE_TAG,
    target_commitish: context.sha,
    name: `Nightly Build ${new Date().toISOString().split("T")[0]}`,
    body: `This is an automated nightly build of MLflow.

**Last updated:** ${new Date().toUTCString()}
**Commit:** ${context.sha}

**Note:** This release is automatically updated daily with the latest changes from the master branch.`,
    prerelease: true,
    make_latest: "false" as const,
  };

  if (releaseExists) {
    console.log("Updating existing nightly release...");
    const { data: updatedRelease } = await github.rest.repos.updateRelease({
      ...releaseParams,
      release_id: release!.id,
    });
    release = updatedRelease;
    console.log(`Updated existing release: ${release.id}`);
  } else {
    console.log("Creating new nightly release...");
    const { data: newRelease } = await github.rest.repos.createRelease(releaseParams);
    release = newRelease;
    console.log(`Created new release: ${release.id}`);
  }

  console.log("Fetching all existing assets...");
  const allAssets: GitHubAsset[] = await github.paginate(github.rest.repos.listReleaseAssets, {
    owner,
    repo,
    release_id: release.id,
  });
  console.log(`Found ${allAssets.length} existing assets`);

  // Delete old assets.
  for (const asset of allAssets) {
    if (shouldDeleteAsset(asset, DAYS_TO_KEEP)) {
      const assetDate = new Date(asset.created_at).toISOString().split("T")[0];
      console.log(`Deleting old asset (created ${assetDate}): ${asset.name}`);
      await github.rest.repos.deleteReleaseAsset({
        owner,
        repo,
        asset_id: asset.id,
      });
    }
  }

  // Filter to get remaining assets after deletion
  const remainingAssets = allAssets.filter((asset) => !shouldDeleteAsset(asset, DAYS_TO_KEEP));

  // Upload all artifacts
  for (const artifactPath of artifactFiles) {
    const artifactName = basename(artifactPath);
    const contentType = getContentType(artifactName);
    const nameWithSha = addShaToFilename(artifactName, context.sha);

    // Check if artifact with SHA already exists in remaining assets
    if (remainingAssets.some((asset) => asset.name === nameWithSha)) {
      console.log(`Artifact already exists: ${nameWithSha} (skipping upload)`);
      continue;
    }

    console.log(`Uploading ${artifactName} as ${nameWithSha}...`);
    const artifactData = readFileSync(artifactPath);
    await github.rest.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: release.id,
      name: nameWithSha,
      data: artifactData as unknown as string,
      headers: {
        "content-type": contentType,
        "content-length": artifactData.length,
      },
    });

    console.log(`Successfully uploaded ${artifactName} as ${nameWithSha}`);
  }

  console.log("All artifacts uploaded successfully");
}
```

--------------------------------------------------------------------------------

---[FILE: update-release-labels.ts]---
Location: mlflow-master/.github/scripts/src/update-release-labels.ts

```typescript
import type { getOctokit } from "@actions/github";
import type { context as ContextType } from "@actions/github";
import type { components } from "@octokit/openapi-webhooks-types";

type GitHub = ReturnType<typeof getOctokit>;
type Context = typeof ContextType;
type WorkflowDispatch = components["schemas"]["webhook-workflow-dispatch"];
type ReleaseEvent = { release: { tag_name: string } };

interface ReleaseInfo {
  releaseVersion: string;
  releaseTag: string;
  releaseLabel: string;
  nextPatchLabel: string;
  releaseBranch: string;
}

interface CommitInfo {
  commit: {
    message: string;
  };
}

/**
 * Extract release information from either release event or workflow_dispatch input
 */
function extractReleaseInfo(context: Context): ReleaseInfo {
  let releaseVersion: string;
  let releaseTag: string;

  if (context.eventName === "workflow_dispatch") {
    // Manual trigger with version parameter
    const payload = context.payload as WorkflowDispatch;
    releaseVersion = payload.inputs?.release_version as string;
    if (!releaseVersion) {
      throw new Error("release_version input is required for workflow_dispatch");
    }
    releaseTag = releaseVersion.startsWith("v") ? releaseVersion : `v${releaseVersion}`;
    releaseVersion = releaseVersion.replace(/^v/, ""); // Remove 'v' prefix if present
    console.log(`Processing manual workflow for release: ${releaseTag} (${releaseVersion})`);
  } else {
    // Automatic trigger from release event
    const payload = context.payload as ReleaseEvent;
    const release = payload.release;
    if (!release) {
      throw new Error("Release information not found in payload");
    }
    releaseTag = release.tag_name;
    releaseVersion = releaseTag.replace(/^v/, ""); // Remove 'v' prefix if present
    console.log(`Processing release event: ${releaseTag} (${releaseVersion})`);
  }

  const versionMatch = releaseVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!versionMatch) {
    console.log(`Skipping invalid release: ${releaseVersion}`);
    throw new Error(`Invalid version format: ${releaseVersion}`);
  }

  const [, major, minor, patch] = versionMatch;
  const nextPatchVersion = `${major}.${minor}.${parseInt(patch) + 1}`;
  const releaseLabel = `v${releaseVersion}`;
  const nextPatchLabel = `v${nextPatchVersion}`;

  // Get release branch name (e.g., branch-3.1 for v3.1.4)
  const releaseBranch = `branch-${major}.${minor}`;

  console.log(`Release label: ${releaseLabel}`);
  console.log(`Next patch label: ${nextPatchLabel}`);
  console.log(`Release branch: ${releaseBranch}`);

  return {
    releaseVersion,
    releaseTag,
    releaseLabel,
    nextPatchLabel,
    releaseBranch,
  };
}

/**
 * Helper function to extract PR number from commit message
 */
function extractPRNumberFromCommitMessage(commitMessage: string): number | null {
  const prRegex = /\(#(\d+)\)$/;
  const lines = commitMessage.split("\n");

  for (const line of lines) {
    const match = line.trim().match(prRegex);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/**
 * Extract PR numbers from release branch commits
 */
async function extractPRNumbersFromBranch(
  github: GitHub,
  context: Context,
  releaseBranch: string
): Promise<Set<number>> {
  const releasePRNumbers = new Set<number>();

  try {
    const commits: CommitInfo[] = await github.paginate(github.rest.repos.listCommits, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      sha: releaseBranch,
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
    });

    for (const commit of commits) {
      const prNumber = extractPRNumberFromCommitMessage(commit.commit.message);
      if (prNumber) {
        releasePRNumbers.add(prNumber);
      }
    }

    console.log(`Found ${releasePRNumbers.size} PR numbers from ${releaseBranch} commits`);
  } catch (error) {
    if (
      error instanceof Error &&
      "status" in error &&
      (error as { status: number }).status === 404
    ) {
      console.log(
        `Release branch '${releaseBranch}' not found. This may be expected for new releases.`
      );
      console.log("Skipping commit analysis - will update all PRs with the release label.");
    } else {
      throw error;
    }
  }

  return releasePRNumbers;
}

/**
 * Fetch all merged PRs with a specific label
 */
async function fetchPRsWithLabel(
  github: GitHub,
  context: Context,
  releaseLabel: string
): Promise<Array<{ number: number; pull_request?: any; state: string }>> {
  const allIssues = await github.paginate(github.rest.issues.listForRepo, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: releaseLabel,
    state: "all",
  });

  const prsWithReleaseLabel = allIssues.filter((item) => {
    if (!item.pull_request) return false;
    if (item.state === "open") return true;
    if (item.state === "closed" && item.pull_request.merged_at) return true;
    return false;
  });

  console.log(`Found ${prsWithReleaseLabel.length} PRs with label ${releaseLabel}`);
  return prsWithReleaseLabel;
}

/**
 * Update PR labels for PRs not included in release
 */
async function updatePRLabels(
  github: GitHub,
  context: Context,
  prsWithReleaseLabel: Array<{ number: number; pull_request?: any; state: string }>,
  releasePRNumbers: Set<number>,
  releaseLabel: string,
  nextPatchLabel: string
): Promise<void> {
  const pullRequests = prsWithReleaseLabel.filter((item) => item.pull_request);
  console.log(
    `Processing ${pullRequests.length} PRs (filtered out ${
      prsWithReleaseLabel.length - pullRequests.length
    } issues)`
  );

  const prsToUpdate: number[] = [];

  for (const pr of pullRequests) {
    if (releasePRNumbers.has(pr.number)) continue;
    prsToUpdate.push(pr.number);
  }

  console.log(`Found ${prsToUpdate.length} PRs that need label updates: ${prsToUpdate.join(", ")}`);

  for (const prNumber of prsToUpdate) {
    try {
      await github.rest.issues.removeLabel({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        name: releaseLabel,
      });

      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: prNumber,
        labels: [nextPatchLabel],
      });

      console.log(`Updated PR #${prNumber}: ${releaseLabel} → ${nextPatchLabel}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Warning: Failed to update labels for PR #${prNumber}: ${errorMessage}`);
    }
  }
}

/**
 * Main function to update release labels
 *
 * This script checks all PRs labeled with a release version and updates
 * their labels to the next patch version if they weren't actually included
 * in the release (handles cherry-picked commits properly).
 */
export async function updateReleaseLabels({
  github,
  context,
}: {
  github: GitHub;
  context: Context;
}): Promise<void> {
  try {
    const releaseInfo = extractReleaseInfo(context);

    const releasePRNumbers = await extractPRNumbersFromBranch(
      github,
      context,
      releaseInfo.releaseBranch
    );

    const prsWithReleaseLabel = await fetchPRsWithLabel(github, context, releaseInfo.releaseLabel);

    await updatePRLabels(
      github,
      context,
      prsWithReleaseLabel,
      releasePRNumbers,
      releaseInfo.releaseLabel,
      releaseInfo.nextPatchLabel
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error updating release labels: ${errorMessage}`);
    throw error;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: advice.js]---
Location: mlflow-master/.github/workflows/advice.js

```javascript
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDcoCheck(github, owner, repo, sha) {
  const backoffs = [0, 2, 4, 6, 8];
  const numAttempts = backoffs.length;
  for (const [index, backoff] of backoffs.entries()) {
    await sleep(backoff * 1000);
    const resp = await github.rest.checks.listForRef({
      owner,
      repo,
      ref: sha,
      app_id: 1861, // ID of the DCO check app
    });

    const { check_runs } = resp.data;
    if (check_runs.length > 0 && check_runs[0].status === "completed") {
      return check_runs[0];
    }
    console.log(`[Attempt ${index + 1}/${numAttempts}]`, "The DCO check hasn't completed yet.");
  }
}

module.exports = async ({ context, github }) => {
  const { owner, repo } = context.repo;
  const { number: issue_number } = context.issue;
  const { sha, label } = context.payload.pull_request.head;
  const { user, body } = context.payload.pull_request;
  const messages = [];

  const title = "&#x1F6E0 DevTools &#x1F6E0";
  if (body && !body.includes(title)) {
    const codespacesBadge = `[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/${user.login}/mlflow/pull/${issue_number}?quickstart=1)`;
    const newSection = `
<details><summary>${title}</summary>
<p>

${codespacesBadge}

#### Install mlflow from this PR

\`\`\`
# mlflow
pip install git+https://github.com/mlflow/mlflow.git@refs/pull/${issue_number}/merge
# mlflow-skinny
pip install git+https://github.com/mlflow/mlflow.git@refs/pull/${issue_number}/merge#subdirectory=libs/skinny
\`\`\`

For Databricks, use the following command:

\`\`\`
%sh curl -LsSf https://raw.githubusercontent.com/mlflow/mlflow/HEAD/dev/install-skinny.sh | sh -s pull/${issue_number}/merge
\`\`\`

</p>
</details>
`.trim();
    await github.rest.pulls.update({
      owner,
      repo,
      pull_number: issue_number,
      body: `${newSection}\n\n${body}`,
    });
  }

  const dcoCheck = await getDcoCheck(github, owner, repo, sha);
  if (dcoCheck && dcoCheck.conclusion !== "success") {
    messages.push(
      "#### &#x26a0; DCO check\n\n" +
        "The DCO check failed. " +
        `Please sign off your commit(s) by following the instructions [here](${dcoCheck.html_url}). ` +
        "See https://github.com/mlflow/mlflow/blob/master/CONTRIBUTING.md#sign-your-work for more " +
        "details."
    );
  }

  if (label.endsWith(":master")) {
    messages.push(
      "#### &#x26a0; PR branch check\n\n" +
        "This PR was filed from the master branch in your fork, which is not recommended " +
        "and may cause our CI checks to fail. Please close this PR and file a new PR from " +
        "a non-master branch."
    );
  }

  if (!(body || "").includes("How should the PR be classified in the release notes?")) {
    messages.push(
      "#### &#x26a0; Invalid PR template\n\n" +
        "This PR does not appear to have been filed using the MLflow PR template. " +
        "Please copy the PR template from [here](https://raw.githubusercontent.com/mlflow/mlflow/master/.github/pull_request_template.md) " +
        "and fill it out."
    );
  }

  if (messages.length > 0) {
    const body =
      `@${user.login} Thank you for the contribution! Could you fix the following issue(s)?\n\n` +
      messages.join("\n\n");
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });
  }
};
```

--------------------------------------------------------------------------------

---[FILE: advice.yml]---
Location: mlflow-master/.github/workflows/advice.yml

```yaml
name: Advice

on:
  pull_request_target:
    types:
      - opened
      - ready_for_review

defaults:
  run:
    shell: bash

jobs:
  notify:
    if: >
      github.event.pull_request.draft == false &&
      !(github.event.pull_request.user.login == 'Copilot' && github.event.pull_request.user.type == 'Bot')
    runs-on: ubuntu-slim
    timeout-minutes: 10
    permissions:
      pull-requests: write # advice.js comments on PRs
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require(
              `${process.env.GITHUB_WORKSPACE}/.github/workflows/advice.js`
            );
            await script({ context, github });
```

--------------------------------------------------------------------------------

---[FILE: auto-assign.js]---
Location: mlflow-master/.github/workflows/auto-assign.js

```javascript
async function getMaintainers({ github, context }) {
  const collaborators = await github.paginate(github.rest.repos.listCollaborators, {
    owner: context.repo.owner,
    repo: context.repo.repo,
  });
  return collaborators
    .filter(
      ({ role_name, login }) =>
        ["admin", "maintain"].includes(role_name) ||
        [
          "alkispoly-db",
          "AveshCSingh",
          "danielseong1",
          "smoorjani",
          "SomtochiUmeh",
          "xsh310",
        ].includes(login)
    )
    .map(({ login }) => login)
    .sort();
}

module.exports = async ({ github, context, skipAssignment = false }) => {
  const { owner, repo } = context.repo;
  const maintainers = new Set(await getMaintainers({ github, context }));

  // Get current time minus 200 minutes to look for recent comments and PRs
  const lookbackTime = new Date(Date.now() - 200 * 60 * 1000);

  // Use search API to find recently updated open PRs
  const searchQuery = `repo:${owner}/${repo} is:pr is:open updated:>=${lookbackTime.toISOString()}`;
  const searchResults = await github.paginate(github.rest.search.issuesAndPullRequests, {
    q: searchQuery,
    sort: "updated",
    order: "desc",
  });

  console.log(`Scanning ${searchResults.length} recently updated PRs`);

  for (const pr of searchResults) {
    // Get recent comments and reviews
    const issueComments = await github.rest.issues.listComments({
      owner,
      repo,
      issue_number: pr.number,
      since: lookbackTime.toISOString(),
    });
    const reviews = await github.rest.pulls.listReviews({
      owner,
      repo,
      pull_number: pr.number,
    });

    // Filter reviews by lookback time and extract authors
    const recentReviews = reviews.data.filter((r) => new Date(r.submitted_at) > lookbackTime);
    const commentAuthors = new Set([
      ...issueComments.data.map((c) => c.user.login),
      ...recentReviews.map((r) => r.user.login),
    ]);

    // Use Set operations to find maintainers to assign
    const prAuthor = pr.user.login;
    const currentAssignees = new Set(pr.assignees.map((a) => a.login));
    const excludeSet = new Set([prAuthor, ...currentAssignees]);

    const maintainersToAssign = [
      ...commentAuthors.intersection(maintainers).difference(excludeSet),
    ];

    if (maintainersToAssign.length === 0) {
      continue;
    }

    // Assign maintainers
    if (!skipAssignment) {
      await github.rest.issues.addAssignees({
        owner,
        repo,
        issue_number: pr.number,
        assignees: maintainersToAssign,
      });
    }
    console.log(
      `${skipAssignment ? "[DRY RUN] Would assign" : "Assigned"} [${maintainersToAssign.join(
        ", "
      )}] to PR #${pr.number}`
    );
  }

  console.log("Scan completed");
};
```

--------------------------------------------------------------------------------

---[FILE: auto-assign.yml]---
Location: mlflow-master/.github/workflows/auto-assign.yml

```yaml
name: Auto-assign maintainer

on:
  schedule:
    # Run every 3 hours to check for new maintainer comments
    - cron: "0 */3 * * *"
  workflow_dispatch: # Allow manual triggering
  pull_request:
    paths:
      - .github/workflows/auto-assign.yml
      - .github/workflows/auto-assign.js

defaults:
  run:
    shell: bash

jobs:
  scan-and-assign:
    runs-on: ubuntu-slim
    timeout-minutes: 10
    permissions:
      contents: read
      issues: write
      pull-requests: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          sparse-checkout: |
            .github
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const script = require('./.github/workflows/auto-assign.js');
            const skipAssignment = context.eventName === 'pull_request';
            await script({ github, context, skipAssignment });
```

--------------------------------------------------------------------------------

---[FILE: autoformat-label-notify.yml]---
Location: mlflow-master/.github/workflows/autoformat-label-notify.yml

```yaml
name: Autoformat Label Notification

on:
  pull_request_target:
    types:
      - labeled

defaults:
  run:
    shell: bash

jobs:
  notify:
    runs-on: ubuntu-slim
    if: ${{ github.event.label.name == 'autoformat' }}
    timeout-minutes: 5
    permissions:
      pull-requests: write # to post a comment on the PR
    steps:
      - uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
        with:
          script: |
            const { owner, repo } = context.repo;
            const pull_number = context.payload.pull_request.number;

            await github.rest.issues.createComment({
              owner,
              repo,
              issue_number: pull_number,
              body: 'Please use `/autoformat` command instead of labels.'
            });

            await github.rest.issues.removeLabel({
              owner,
              repo,
              issue_number: pull_number,
              name: 'autoformat'
            });
```

--------------------------------------------------------------------------------

---[FILE: autoformat.js]---
Location: mlflow-master/.github/workflows/autoformat.js

```javascript
const createCommitStatus = async (context, github, sha, state) => {
  const { workflow, runId } = context;
  const { owner, repo } = context.repo;
  const target_url = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;
  await github.rest.repos.createCommitStatus({
    owner,
    repo,
    sha,
    state,
    target_url,
    description: sha,
    context: workflow,
  });
};

const shouldAutoformat = (comment) => {
  return comment.body.trim() === "/autoformat";
};

const getPullInfo = async (context, github) => {
  const { owner, repo } = context.repo;
  const pull_number = context.issue.number;
  const pr = await github.rest.pulls.get({ owner, repo, pull_number });
  const {
    sha: head_sha,
    ref: head_ref,
    repo: { full_name },
  } = pr.data.head;
  const { sha: base_sha, ref: base_ref, repo: base_repo } = pr.data.base;
  return {
    repository: full_name,
    pull_number,
    head_sha,
    head_ref,
    base_sha,
    base_ref,
    base_repo: base_repo.full_name,
    author_association: pr.data.author_association,
  };
};

const createReaction = async (context, github) => {
  const { owner, repo } = context.repo;
  const { id: comment_id } = context.payload.comment;
  await github.rest.reactions.createForIssueComment({
    owner,
    repo,
    comment_id,
    content: "rocket",
  });
};

const createStatus = async (context, github, core) => {
  const { head_sha, head_ref, repository } = await getPullInfo(context, github);
  if (repository === "mlflow/mlflow" && head_ref === "master") {
    core.setFailed("Running autoformat bot against master branch of mlflow/mlflow is not allowed.");
  }
  await createCommitStatus(context, github, head_sha, "pending");
};

const updateStatus = async (context, github, sha, needs) => {
  const failed = Object.values(needs).some(({ result }) => result === "failure");
  const state = failed ? "failure" : "success";
  await createCommitStatus(context, github, sha, state);
};

const fetchWorkflowRuns = async ({ context, github, head_sha }) => {
  const { owner, repo } = context.repo;
  const SLEEP_DURATION_MS = 5000;
  const MAX_RETRIES = 5;
  let prevRuns = [];
  for (let i = 0; i < MAX_RETRIES; i++) {
    console.log(`Attempt ${i + 1} to fetch workflow runs`);
    const runs = await github.paginate(github.rest.actions.listWorkflowRunsForRepo, {
      owner,
      repo,
      head_sha,
      status: "action_required",
      actor: "mlflow-app[bot]",
    });

    // If the number of runs has not changed since the last attempt,
    // we can assume that all the workflow runs have been created.
    if (runs.length > 0 && runs.length === prevRuns.length) {
      return runs;
    }

    prevRuns = runs;
    await new Promise((resolve) => setTimeout(resolve, SLEEP_DURATION_MS));
  }
  return prevRuns;
};

const approveWorkflowRuns = async (context, github, head_sha) => {
  const { owner, repo } = context.repo;
  const workflowRuns = await fetchWorkflowRuns({ context, github, head_sha });
  const approvePromises = workflowRuns.map((run) =>
    github.rest.actions.approveWorkflowRun({
      owner,
      repo,
      run_id: run.id,
    })
  );
  const results = await Promise.allSettled(approvePromises);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error(`Failed to approve run: ${result.reason}`);
    }
  }
};

const checkMaintainerAccess = async (context, github) => {
  const { owner, repo } = context.repo;
  const pull_number = context.issue.number;
  const { runId } = context;
  const pr = await github.rest.pulls.get({ owner, repo, pull_number });

  // Skip maintainer access check for copilot bot PRs
  // Copilot bot creates PRs that are owned by the repository and don't need the same permission model
  if (
    pr.data.user?.type?.toLowerCase() === "bot" &&
    pr.data.user?.login?.toLowerCase() === "copilot"
  ) {
    console.log(`Skipping maintainer access check for copilot bot PR #${pull_number}`);
    return;
  }

  const isForkPR = pr.data.head.repo.full_name !== pr.data.base.repo.full_name;
  if (isForkPR && !pr.data.maintainer_can_modify) {
    const workflowRunUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;

    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: `❌ **Autoformat failed**: The "Allow edits and access to secrets by maintainers" checkbox must be checked for autoformat to work properly.

Please:
1. Check the "Allow edits and access to secrets by maintainers" checkbox on this pull request
2. Comment \`/autoformat\` again

This permission is required for the autoformat bot to push changes to your branch.

**Details:** [View workflow run](${workflowRunUrl})`,
    });

    throw new Error(
      'The "Allow edits and access to secrets by maintainers" checkbox must be checked for autoformat to work properly.'
    );
  }
};

module.exports = {
  shouldAutoformat,
  getPullInfo,
  createReaction,
  createStatus,
  updateStatus,
  approveWorkflowRuns,
  checkMaintainerAccess,
};
```

--------------------------------------------------------------------------------

---[FILE: autoformat.md]---
Location: mlflow-master/.github/workflows/autoformat.md

```text
# Autoformat

## Testing

1. Checkout a new branch and make changes.
1. Push the branch to your fork (https://github.com/{your_username}/mlflow).
1. Switch the default branch of your fork to the branch you just pushed.
1. Create a GitHub token.
1. Create a new Actions secret with the name `MLFLOW_AUTOMATION_TOKEN` and put the token value.
1. Checkout another new branch and run the following commands to make dummy changes.

   ```shell
   # python
   echo "" >> setup.py
   # js
   echo "" >> mlflow/server/js/src/experiment-tracking/components/App.js
   # protos
   echo "message Foo {}" >> mlflow/protos/service.proto
   ```

1. Create a PR from the branch containing the dummy changes in your fork.
1. Comment `/autoformat` on the PR and ensure the workflow runs successfully.
   The workflow status can be checked at https://github.com/{your_username}/mlflow/actions/workflows/autoformat.yml.
1. Delete the GitHub token and reset the default branch.
```

--------------------------------------------------------------------------------

````
