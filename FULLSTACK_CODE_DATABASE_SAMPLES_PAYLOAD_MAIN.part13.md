---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 13
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 13 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: README.md]---
Location: payload-main/.github/actions/triage/README.md

```text
# Triage

Modified version of https://github.com/balazsorban44/nissuer

## Modifications

- Port to TypeScript
- Remove issue locking
- Remove reproduction blocklist
- Uses `@vercel/ncc` for packaging

## Development

> [!IMPORTANT]
> Whenever a modification is made to the action, the action built to `dist` must be committed to the repository.

This is done by running:

```sh
pnpm build
```
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/.github/actions/triage/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es2020.string"],
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": false, // Undo this
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "downlevelIteration": true,
    "skipLibCheck": true,
  },
  "exclude": ["src/**/*.test.ts"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/.github/actions/triage/src/index.ts

```typescript
import { debug, error, getBooleanInput, getInput, info, setFailed } from '@actions/core'

import { context, getOctokit } from '@actions/github'
import { readFile, access } from 'node:fs/promises'
import { join } from 'node:path'

// Ensure GITHUB_TOKEN and GITHUB_WORKSPACE are present
if (!process.env.GITHUB_TOKEN) throw new TypeError('No GITHUB_TOKEN provided')
if (!process.env.GITHUB_WORKSPACE) throw new TypeError('Not a GitHub workspace')

const validActionsToPerform = ['tag', 'comment', 'close'] as const
type ActionsToPerform = (typeof validActionsToPerform)[number]

// Define the configuration object
interface Config {
  invalidLink: {
    comment: string
    bugLabels: string[]
    hosts: string[]
    label: string
    linkSection: string
  }
  areaLabels: {
    section: string
    skip: string[]
  }
  actionsToPerform: ActionsToPerform[]
  token: string
  workspace: string
}

const config: Config = {
  invalidLink: {
    comment: getInput('reproduction_comment') || '.github/invalid-reproduction.md',
    bugLabels: getInput('reproduction_issue_labels')
      .split(',')
      .map((l) => l.trim()),
    hosts: (getInput('reproduction_hosts') || 'github.com').split(',').map((h) => h.trim()),
    label: getInput('reproduction_invalid_label') || 'invalid-reproduction',
    linkSection:
      getInput('reproduction_link_section') || '### Link to reproduction(.*)### To reproduce',
  },
  areaLabels: {
    section: getInput('area_label_section') || '',
    skip: (getInput('area_label_skip') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  actionsToPerform: (getInput('actions_to_perform') || validActionsToPerform.join(','))
    .split(',')
    .map((a) => {
      const action = a.trim().toLowerCase() as ActionsToPerform
      if (validActionsToPerform.includes(action)) {
        return action
      }

      throw new TypeError(`Invalid action: ${action}`)
    }),
  token: process.env.GITHUB_TOKEN,
  workspace: process.env.GITHUB_WORKSPACE,
}

// Attempt to parse JSON, return parsed object or error
function tryParse(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json)
  } catch (e) {
    setFailed(`Could not parse JSON: ${e instanceof Error ? e.message : e}`)
    return {}
  }
}

// Retrieves a boolean input or undefined based on environment variables
function getBooleanOrUndefined(value: string): boolean | undefined {
  const variable = process.env[`INPUT_${value.toUpperCase()}`]
  return variable === undefined || variable === '' ? undefined : getBooleanInput(value)
}

// Returns the appropriate label match type
function getLabelMatch(value: string | undefined): 'name' | 'description' {
  return value === 'name' ? 'name' : 'description'
}

// Function to check if an issue contains a valid reproduction link
async function checkValidReproduction(): Promise<void> {
  const { issue, action } = context.payload as {
    issue: { number: number; body: string; labels: { name: string }[] } | undefined
    action: string
  }

  if (action !== 'opened' || !issue?.body) return

  const labels = issue.labels.map((l) => l.name)

  const issueMatchingLabel =
    labels.length &&
    config.invalidLink.bugLabels.length &&
    labels.some((l) => config.invalidLink.bugLabels.includes(l))

  if (!issueMatchingLabel) {
    info(
      `Issue #${issue.number} does not match required labels: ${config.invalidLink.bugLabels.join(', ')}`,
    )
    info(`Issue labels: ${labels.join(', ')}`)
    return
  }

  info(`Issue #${issue.number} labels: ${labels.join(', ')}`)

  const { rest: client } = getOctokit(config.token)
  const common = { ...context.repo, issue_number: issue.number }

  const labelsToRemove = labels.filter((l) => config.invalidLink.bugLabels.includes(l))

  if (await isValidReproduction(issue.body)) {
    await Promise.all(
      labelsToRemove.map((label) => client.issues.removeLabel({ ...common, name: label })),
    )

    return info(`Issue #${issue.number} contains a valid reproduction 💚`)
  }

  info(`Invalid reproduction, issue will be closed/labeled/commented...`)

  // Adjust labels
  await Promise.all(
    labelsToRemove.map((label) => client.issues.removeLabel({ ...common, name: label })),
  )

  // Tag
  if (config.actionsToPerform.includes('tag')) {
    info(`Added label: ${config.invalidLink.label}`)
    await client.issues.addLabels({ ...common, labels: [config.invalidLink.label] })
  } else {
    info('Tag - skipped, not provided in actions to perform')
  }

  // Comment
  if (config.actionsToPerform.includes('comment')) {
    const comment = join(config.workspace, config.invalidLink.comment)
    await client.issues.createComment({ ...common, body: await getCommentBody(comment) })
    info(`Commented with invalid reproduction message`)
  } else {
    info('Comment - skipped, not provided in actions to perform')
  }

  // Close
  if (config.actionsToPerform.includes('close')) {
    await client.issues.update({ ...common, state: 'closed' })
    info(`Closed issue #${issue.number}`)
  } else {
    info('Close - skipped, not provided in actions to perform')
  }
}

/**
 * Determine if an issue contains a valid/accessible link to a reproduction.
 *
 * Returns `true` if the link is valid.
 * @param body - The body content of the issue
 */
async function isValidReproduction(body: string): Promise<boolean> {
  const linkSectionRe = new RegExp(config.invalidLink.linkSection, 'is')
  const link = body.match(linkSectionRe)?.[1]?.trim()

  if (!link) {
    info('Missing link')
    info(`Link section regex: ${linkSectionRe}`)
    info(`Link section: ${body}`)
    return false
  }

  info(`Checking validity of link: ${link}`)

  if (!URL.canParse(link)) {
    info(`Invalid URL: ${link}`)
    return false
  }

  const url = new URL(link)

  if (!config.invalidLink.hosts.includes(url.hostname)) {
    info('Link did not match allowed reproduction hosts')
    return false
  }

  try {
    // Verify that the link can be accessed
    const response = await fetch(link)
    const isOk = response.status < 400 || response.status >= 500

    info(`Link status: ${response.status}`)
    if (!isOk) {
      info(`Link returned status ${response.status}`)
    }
    return isOk
  } catch (error) {
    info(`Error fetching link: ${(error as Error).message}`)
    return false
  }
}

/**
 * Return either a file's content or a string
 * @param {string} pathOrComment
 */
async function getCommentBody(pathOrComment: string) {
  try {
    await access(pathOrComment)
    return await readFile(pathOrComment, 'utf8')
  } catch (error: any) {
    if (error.code === 'ENOENT') return pathOrComment
    throw error
  }
}

/**
 * Apply area labels from the issue body dropdown selection
 */
async function checkAreaLabels(): Promise<void> {
  if (!config.areaLabels.section) {
    info('Area labels - skipped, no section regex configured')
    return
  }

  const { issue, action } = context.payload as {
    issue: { number: number; body: string } | undefined
    action: string
  }

  if (action !== 'opened' || !issue?.body) return

  const sectionRegex = new RegExp(config.areaLabels.section, 'is')
  const match = issue.body.match(sectionRegex)?.[1]?.trim()

  if (!match) {
    info('Area labels - no matching section found in issue body')
    return
  }

  const labels = match
    .split(',')
    .map((l) => l.trim())
    .filter((l) => l && !config.areaLabels.skip.includes(l))

  if (labels.length === 0) {
    info('Area labels - no labels to apply after filtering')
    return
  }

  const { rest: client } = getOctokit(config.token)
  const common = { ...context.repo, issue_number: issue.number }

  try {
    await client.issues.addLabels({ ...common, labels })
    info(`Applied area labels: ${labels.join(', ')}`)
  } catch (err) {
    error(`Failed to apply area labels: ${err instanceof Error ? err.message : err}`)
  }
}

async function run() {
  const { token, workspace, ...safeConfig } = config
  info('Configuration:')
  info(JSON.stringify(safeConfig, null, 2))

  await checkAreaLabels()
  await checkValidReproduction()
}

run().catch(setFailed)
```

--------------------------------------------------------------------------------

---[FILE: invalid-reproduction.md]---
Location: payload-main/.github/comments/invalid-reproduction.md

```text
**Please add a reproduction in order for us to be able to investigate.**

Depending on the quality of reproduction steps, this issue may be closed if no reproduction is provided.

### Why was this issue marked with the `invalid-reproduction` label?

To be able to investigate, we need access to a reproduction to identify what triggered the issue. We prefer a link to a public GitHub repository created with `create-payload-app@latest -t blank` or a forked/branched version of this repository with tests added (more info in the [reproduction-guide](https://github.com/payloadcms/payload/blob/main/.github/reproduction-guide.md)).

To make sure the issue is resolved as quickly as possible, please make sure that the reproduction is as **minimal** as possible. This means that you should **remove unnecessary code, files, and dependencies** that do not contribute to the issue. Ensure your reproduction does not depend on secrets, 3rd party registries, private dependencies, or any other data that cannot be made public. Avoid a reproduction including a whole monorepo (unless relevant to the issue). The easier it is to reproduce the issue, the quicker we can help.

Please test your reproduction against the latest version of Payload to make sure your issue has not already been fixed.

### I added a link, why was it still marked?

Ensure the link is pointing to a codebase that is accessible (e.g. not a private repository). "[example.com](http://example.com/)", "n/a", "will add later", etc. are not acceptable links -- we need to see a public codebase. See the above section for accepted links.

### Useful Resources

- [Reproduction Guide](https://github.com/payloadcms/payload/blob/main/.github/reproduction-guide.md)
- [Contributing to Payload](https://www.youtube.com/watch?v=08Qa3ggR9rw)
```

--------------------------------------------------------------------------------

---[FILE: 1.bug_report_v3.yml]---
Location: payload-main/.github/ISSUE_TEMPLATE/1.bug_report_v3.yml
Signals: Next.js

```yaml
name: Functionality Bug
description: '[REPRODUCTION REQUIRED] - Create a bug report'
labels: ['status: needs-triage', 'validate-reproduction']
body:
  - type: textarea
    attributes:
      label: Describe the Bug
    validations:
      required: true

  - type: input
    id: reproduction-link
    attributes:
      label: Link to the code that reproduces this issue
      description: >-
        _REQUIRED_: Please provide a link to your reproduction. Note, if the URL is invalid (404 or a private repository), we may close the issue.
        Either use `pnpx create-payload-app@latest -t blank` then push to a repo or follow the [reproduction-guide](https://github.com/payloadcms/payload/blob/main/.github/reproduction-guide.md) for more information.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Reproduction Steps
      description: Steps to reproduce the behavior, please provide a clear description of how to reproduce the issue, based on the linked minimal reproduction. Screenshots can be provided in the issue body below. If using code blocks, make sure that [syntax highlighting is correct](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#syntax-highlighting) and double check that the rendered preview is not broken.
    validations:
      required: true

  - type: dropdown
    attributes:
      label: Which area(s) are affected?
      multiple: true
      options:
        - 'Not sure'
        - 'area: core'
        - 'area: docs'
        - 'area: graphql'
        - 'area: live-preview'
        - 'area: templates'
        - 'area: ui'
        - 'db: d1-sqlite'
        - 'db: mongodb'
        - 'db: postgres'
        - 'db: sqlite'
        - 'db: vercel-postgres'
        - 'plugin: cloud-storage'
        - 'plugin: ecommerce'
        - 'plugin: form-builder'
        - 'plugin: import-export'
        - 'plugin: mcp'
        - 'plugin: multi-tenant'
        - 'plugin: nested-docs'
        - 'plugin: redirects'
        - 'plugin: richtext-lexical'
        - 'plugin: richtext-slate'
        - 'plugin: search'
        - 'plugin: sentry'
        - 'plugin: seo'
        - 'plugin: storage-*'
        - 'plugin: stripe'
        - 'plugin: other'
    validations:
      required: true

  - type: textarea
    attributes:
      label: Environment Info
      description: Paste output from `pnpm payload info` _or_ Payload, Node.js, and Next.js versions. Please avoid using "latest"—specific version numbers help us accurately diagnose and resolve issues.
      render: text
      placeholder: Run `pnpm payload info` in your terminal and paste the output here.
    validations:
      required: true

  - type: markdown
    attributes:
      value: Before submitting the issue, go through the steps you've written down to make sure the steps provided are detailed and clear.
  - type: markdown
    attributes:
      value: Contributors should be able to follow the steps provided in order to reproduce the bug.
  - type: markdown
    attributes:
      value: These steps are used to add integration tests to ensure the same issue does not happen again. Thanks in advance!
```

--------------------------------------------------------------------------------

---[FILE: 2.design_issue.yml]---
Location: payload-main/.github/ISSUE_TEMPLATE/2.design_issue.yml
Signals: Next.js

```yaml
name: Design Issue
description: '[SCREENSHOT REQUIRED] - Create a design issue report'
labels: ['status: needs-triage', 'v3', 'area: ui']
body:
  - type: textarea
    attributes:
      label: Describe the Bug.
      description: >-
        _REQUIRED:_ Please a screenshot/video of the issue along with a detailed description of the problem.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Reproduction Steps
      description: Steps to reproduce the behavior, please provide a clear description of how to reproduce the issue, based on the linked minimal reproduction. Screenshots can be provided in the issue body below. If using code blocks, make sure that [syntax highlighting is correct](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#syntax-highlighting) and double check that the rendered preview is not broken.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Environment Info
      description: Paste output from `pnpm payload info` _or_ Payload, Node.js, and Next.js versions. Please avoid using "latest"—specific version numbers help us accurately diagnose and resolve issues.
      render: text
      placeholder: |
        Payload:
        Node.js:
        Next.js:
    validations:
      required: true

  - type: markdown
    attributes:
      value: Before submitting the issue, go through the steps you've written down to make sure the steps provided are detailed and clear.
  - type: markdown
    attributes:
      value: Contributors should be able to follow the steps provided in order to reproduce the bug.
  - type: markdown
    attributes:
      value: These steps are used to add integration tests to ensure the same issue does not happen again. Thanks in advance!
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: payload-main/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
contact_links:
  - name: Feature Request
    url: https://github.com/payloadcms/payload/discussions
    about: Suggest an idea to improve Payload in our GitHub Discussions
  - name: Question about Payload
    url: https://github.com/payloadcms/payload/discussions
    about: Please ask Payload-related questions in our GitHub Discussions
```

--------------------------------------------------------------------------------

---[FILE: DOCUMENTATION_ISSUE.md]---
Location: payload-main/.github/ISSUE_TEMPLATE/DOCUMENTATION_ISSUE.md

```text
---
name: Documentation Issue
about: Suggest fix to Payload documentation
labels: 'documentation'
assignees: 'zubricks'
---

# Documentation Issue

<!--- Please provide a summary of the documentation issue -->

## Additional Details

<!--- Provide any other additional details -->
```

--------------------------------------------------------------------------------

---[FILE: activity-notifications.yml]---
Location: payload-main/.github/workflows/activity-notifications.yml

```yaml
name: activity-notifications

on:
  schedule:
    - cron: '0 11 * * 1'
  workflow_dispatch:
    inputs:
      debug:
        description: Enable debug logging
        required: false
        default: false

jobs:
  run:
    if: github.repository_owner == 'payloadcms'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Setup
        uses: ./.github/actions/setup
      - name: Popular Issues to Slack
        run: node ./.github/actions/activity/dist/popular-issues/index.js
        continue-on-error: true
      - name: New Issues to Slack
        run: node ./.github/actions/activity/dist/new-issues/index.js
        continue-on-error: true
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      SLACK_TOKEN: ${{ secrets.SLACK_TOKEN }}
      DEBUG: ${{ github.event.inputs.debug || 'false' }}
```

--------------------------------------------------------------------------------

---[FILE: audit-dependencies.sh]---
Location: payload-main/.github/workflows/audit-dependencies.sh

```bash
#!/bin/bash

severity=${1:-"high"}
output_file="audit_output.json"

echo "Auditing for ${severity} vulnerabilities..."

audit_json=$(pnpm audit --prod --json)

echo "${audit_json}" | jq --arg severity "${severity}" '
  .advisories | to_entries |
  map(select(.value.patched_versions != "<0.0.0" and (.value.severity == $severity or ($severity == "high" and .value.severity == "critical"))) |
    {
      package: .value.module_name,
      vulnerable: .value.vulnerable_versions,
      fixed_in: .value.patched_versions,
      findings: .value.findings
    }
  )
' >$output_file

audit_length=$(jq 'length' $output_file)

if [[ "${audit_length}" -gt "0" ]]; then
  echo "Actionable vulnerabilities found in the following packages:"
  jq -r '.[] | "\u001b[1m\(.package)\u001b[0m vulnerable in \u001b[31m\(.vulnerable)\u001b[0m fixed in \u001b[32m\(.fixed_in)\u001b[0m"' $output_file | while read -r line; do echo -e "$line"; done
  echo ""
  echo "Output written to ${output_file}"
  cat $output_file
  echo ""
  echo "This script can be rerun with: './.github/workflows/audit-dependencies.sh $severity'"
  exit 1
else
  echo "No actionable vulnerabilities"
  exit 0
fi
```

--------------------------------------------------------------------------------

---[FILE: audit-dependencies.yml]---
Location: payload-main/.github/workflows/audit-dependencies.yml
Signals: Next.js

```yaml
name: audit-dependencies

on:
  # Monday at 2am EST
  schedule:
    - cron: '0 7 * * 1'
  workflow_dispatch:
    inputs:
      audit-level:
        description: The level of audit to run (low, moderate, high, critical)
        required: false
        default: high
      debug:
        description: Enable debug logging
        required: false
        default: false

env:
  DO_NOT_TRACK: 1 # Disable Turbopack telemetry
  NEXT_TELEMETRY_DISABLED: 1 # Disable Next telemetry

jobs:
  audit:
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Setup
        uses: ./.github/actions/setup

      - name: Run audit dependencies script
        id: audit_dependencies
        run: ./.github/workflows/audit-dependencies.sh ${{ inputs.audit-level }}

      - name: Slack notification on failure
        if: failure()
        uses: slackapi/slack-github-action@v2.1.1
        with:
          webhook: ${{ inputs.debug == 'true' && secrets.SLACK_TEST_WEBHOOK_URL || secrets.SLACK_WEBHOOK_URL }}
          webhook-type: incoming-webhook
          payload: |
            {
              "username": "GitHub Actions Bot",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "🚨 Actionable vulnerabilities found: <https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Script Run Details>"
                  }
                },
              ]
            }
```

--------------------------------------------------------------------------------

---[FILE: dispatch-event.yml]---
Location: payload-main/.github/workflows/dispatch-event.yml

```yaml
name: dispatch-event

on:
  workflow_dispatch:
    inputs:
      tag:
        description: 'Release tag to process (optional)'
        required: false
        default: ''

env:
  PAYLOAD_PUSH_MAIN_EVENT: payload-push-main-event
  PAYLOAD_RELEASE_EVENT: payload-release-event

jobs:
  repository-dispatch:
    name: Repository dispatch
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Dispatch event
        if: ${{ github.event_name == 'workflow_dispatch' }}
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PAYLOAD_REPOSITORY_DISPATCH }}
          repository: ${{ secrets.REMOTE_REPOSITORY }}
          event-type: ${{ env.PAYLOAD_PUSH_MAIN_EVENT }}
          client-payload: '{"event": {"head_commit": {"id": "${{ env.GITHUB_SHA }}"}}}' # mocked for testing
          # client-payload: '{"event": ${{ toJson(github.event) }}}'

      - name: Dispatch event
        if: ${{ github.event_name == 'workflow_dispatch' }}
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PAYLOAD_REPOSITORY_DISPATCH }}
          repository: payloadcms/website
          event-type: ${{ env.PAYLOAD_RELEASE_EVENT }}
          client-payload: '{"event": {"tag": "${{ github.event.inputs.tag }}"}}'
```

--------------------------------------------------------------------------------

---[FILE: label-on-change.yml]---
Location: payload-main/.github/workflows/label-on-change.yml

```yaml
name: label-on-change

on:
  # https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target
  issues:
    types:
      - assigned
      - closed
      - labeled
      - reopened

  # TODO: Handle labeling on comment

jobs:
  on-labeled-ensure-one-status:
    runs-on: ubuntu-24.04
    permissions:
      issues: write
    # Only run on issue labeled and if label starts with 'status:'
    if: github.event.action == 'labeled' && startsWith(github.event.label.name, 'status:')
    steps:
      - name: Ensure only one status label
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            // Get all labels that start with 'status:' and are not the incoming label
            const incomingLabelName = context.payload.label.name;
            const labelNamesToRemove = context.payload.issue.labels
              .filter(label => label.name.startsWith('status:') && label.name !== incomingLabelName)
              .map(label => label.name);

            if (!labelNamesToRemove.length) {
              console.log('No labels to remove');
              return;
            }

            console.log(`Labels to remove: '${labelNamesToRemove}'`);

            // If there is more than one status label, remove all but the incoming label
            for (const labelName of labelNamesToRemove) {
              await github.rest.issues.removeLabel({
                issue_number: context.issue.number,
                name: labelName,
                owner: context.repo.owner,
                repo: context.repo.repo,
              });
              console.log(`Removed '${labelName}' label`);
            }

  on-issue-close:
    runs-on: ubuntu-24.04
    permissions:
      issues: write
    if: github.event.action == 'closed'
    steps:
      - name: Remove all labels on issue close
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            // Get all labels that start with 'status:' and 'stale'
            const labelNamesToRemove = context.payload.issue.labels
              .filter(label => label.name.startsWith('status:') || label.name === 'stale')
              .map(label => label.name);

            if (!labelNamesToRemove.length) {
              console.log('No labels to remove');
              return;
            }

            console.log(`Labels to remove: '${labelNamesToRemove}'`);

            for (const labelName of labelNamesToRemove) {
              await github.rest.issues.removeLabel({
                issue_number: context.issue.number,
                name: labelName,
                owner: context.repo.owner,
                repo: context.repo.repo,
              });
              console.log(`Removed '${labelName}' label`);
            }

  on-issue-reopen:
    runs-on: ubuntu-24.04
    permissions:
      issues: write
    if: github.event.action == 'reopened'
    steps:
      - name: Add needs-triage label on issue reopen
        uses: actions-ecosystem/action-add-labels@v1
        with:
          labels: 'status: needs-triage'

  on-issue-assigned:
    runs-on: ubuntu-24.04
    permissions:
      issues: write
    if: >
      github.event.action == 'assigned' &&
      contains(github.event.issue.labels.*.name, 'status: needs-triage')
    steps:
      - name: Remove needs-triage label on issue assign
        uses: actions-ecosystem/action-remove-labels@v1
        with:
          labels: 'status: needs-triage'

  # on-pr-merge:
  #   runs-on: ubuntu-24.04
  #   if: github.event.pull_request.merged == true
  #   steps:

  # on-pr-close:
  #   runs-on: ubuntu-24.04
  #   if: github.event_name == 'pull_request_target' && github.event.pull_request.merged == false
  #   steps:
```

--------------------------------------------------------------------------------

---[FILE: lock-issues.yml]---
Location: payload-main/.github/workflows/lock-issues.yml

```yaml
name: lock-issues

on:
  schedule:
    # Run nightly at 12am EST, staggered with stale workflow
    - cron: '0 5 * * *'
  workflow_dispatch:

permissions:
  issues: write

jobs:
  lock_issues:
    runs-on: ubuntu-24.04
    steps:
      - name: Lock issues
        uses: dessant/lock-threads@v5
        with:
          process-only: 'issues'
          issue-inactive-days: '7'
          exclude-any-issue-labels: 'status: awaiting-reply'
          log-output: true
          issue-comment: >
            This issue has been automatically locked.

            Please open a new issue if this issue persists with any additional detail.
```

--------------------------------------------------------------------------------

````
