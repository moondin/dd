---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:14Z
part: 5
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 5 of 867)

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

---[FILE: action.yml]---
Location: prowler-master/.github/actions/slack-notification/action.yml

```yaml
name: 'Slack Notification'
description: 'Generic action to send Slack notifications with optional message updates and automatic status detection'
inputs:
  slack-bot-token:
    description: 'Slack bot token for authentication'
    required: true
  payload-file-path:
    description: 'Path to JSON file with the Slack message payload'
    required: true
  update-ts:
    description: 'Message timestamp to update (only for updates, leave empty for new messages)'
    required: false
    default: ''
  step-outcome:
    description: 'Outcome of a step to determine status (success/failure) - automatically sets STATUS_TEXT and STATUS_COLOR env vars'
    required: false
    default: ''
outputs:
  ts:
    description: 'Timestamp of the Slack message'
    value: ${{ steps.slack-notification.outputs.ts }}
runs:
  using: 'composite'
  steps:
    - name: Determine status
      id: status
      shell: bash
      run: |
        if [[ "${{ inputs.step-outcome }}" == "success" ]]; then
          echo "STATUS_TEXT=Completed" >> $GITHUB_ENV
          echo "STATUS_COLOR=#6aa84f" >> $GITHUB_ENV
        elif [[ "${{ inputs.step-outcome }}" == "failure" ]]; then
          echo "STATUS_TEXT=Failed" >> $GITHUB_ENV
          echo "STATUS_COLOR=#fc3434" >> $GITHUB_ENV
        else
          # No outcome provided - pending/in progress state
          echo "STATUS_COLOR=#dbab09" >> $GITHUB_ENV
        fi

    - name: Send Slack notification (new message)
      if: inputs.update-ts == ''
      id: slack-notification-post
      uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
      env:
        SLACK_PAYLOAD_FILE_PATH: ${{ inputs.payload-file-path }}
      with:
        method: chat.postMessage
        token: ${{ inputs.slack-bot-token }}
        payload-file-path: ${{ inputs.payload-file-path }}
        payload-templated: true
        errors: true

    - name: Update Slack notification
      if: inputs.update-ts != ''
      id: slack-notification-update
      uses: slackapi/slack-github-action@91efab103c0de0a537f72a35f6b8cda0ee76bf0a # v2.1.1
      env:
        SLACK_PAYLOAD_FILE_PATH: ${{ inputs.payload-file-path }}
      with:
        method: chat.update
        token: ${{ inputs.slack-bot-token }}
        payload-file-path: ${{ inputs.payload-file-path }}
        payload-templated: true
        errors: true

    - name: Set output
      id: slack-notification
      shell: bash
      run: |
        if [[ "${{ inputs.update-ts }}" == "" ]]; then
          echo "ts=${{ steps.slack-notification-post.outputs.ts }}" >> $GITHUB_OUTPUT
        else
          echo "ts=${{ inputs.update-ts }}" >> $GITHUB_OUTPUT
        fi
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/.github/actions/slack-notification/README.md

```text
# Slack Notification Action

A generic and flexible GitHub composite action for sending Slack notifications using JSON template files. Supports both standalone messages and message updates, with automatic status detection.

## Features

- **Template-based**: All messages use JSON template files for consistency
- **Automatic status detection**: Pass `step-outcome` to auto-calculate success/failure
- **Message updates**: Supports updating existing messages (using `chat.update`)
- **Simple API**: Clean and minimal interface
- **Reusable**: Use across all workflows and scenarios
- **Maintainable**: Centralized message templates

## Use Cases

1. **Container releases**: Track push start and completion with automatic status
2. **Deployments**: Track deployment progress with rich Block Kit formatting
3. **Custom notifications**: Any scenario where you need to notify Slack

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `slack-bot-token` | Slack bot token for authentication | Yes | - |
| `payload-file-path` | Path to JSON file with the Slack message payload | Yes | - |
| `update-ts` | Message timestamp to update (leave empty for new messages) | No | `''` |
| `step-outcome` | Step outcome for automatic status detection (sets STATUS_EMOJI and STATUS_TEXT env vars) | No | `''` |

## Outputs

| Output | Description |
|--------|-------------|
| `ts` | Timestamp of the Slack message (use for updates) |

## Usage Examples

### Example 1: Container Release with Automatic Status Detection

Using JSON template files with automatic status detection:

```yaml
# Send start notification
- name: Notify container push started
  if: github.event_name == 'release'
  uses: ./.github/actions/slack-notification
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    COMPONENT: API
    RELEASE_TAG: ${{ env.RELEASE_TAG }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/container-release-started.json"

# Do the work
- name: Build and push container
  if: github.event_name == 'release'
  id: container-push
  uses: docker/build-push-action@...
  with:
    push: true
    tags: ...

# Send completion notification with automatic status detection
- name: Notify container push completed
  if: github.event_name == 'release' && always()
  uses: ./.github/actions/slack-notification
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    COMPONENT: API
    RELEASE_TAG: ${{ env.RELEASE_TAG }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/container-release-completed.json"
    step-outcome: ${{ steps.container-push.outcome }}
```

**Benefits:**
- No status calculation needed in workflow
- Reusable template files
- Clean and concise
- Automatic `STATUS_EMOJI` and `STATUS_TEXT` env vars set by action
- Consistent message format across all workflows

### Example 2: Deployment with Message Update Pattern

```yaml
# Send initial deployment message
- name: Notify deployment started
  id: slack-start
  uses: ./.github/actions/slack-notification
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
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    payload-file-path: "./.github/scripts/slack-messages/deployment-started.json"

# Run deployment
- name: Deploy
  id: deploy
  run: terraform apply -auto-approve

# Determine additional status variables
- name: Determine deployment status
  if: always()
  id: deploy-status
  run: |
    if [[ "${{ steps.deploy.outcome }}" == "success" ]]; then
      echo "STATUS_COLOR=28a745" >> $GITHUB_ENV
      echo "STATUS=Completed" >> $GITHUB_ENV
    else
      echo "STATUS_COLOR=fc3434" >> $GITHUB_ENV
      echo "STATUS=Failed" >> $GITHUB_ENV
    fi

# Update the same message with final status
- name: Update deployment notification
  if: always()
  uses: ./.github/actions/slack-notification
  env:
    SLACK_CHANNEL_ID: ${{ secrets.SLACK_CHANNEL_ID }}
    MESSAGE_TS: ${{ steps.slack-start.outputs.ts }}
    COMPONENT: API
    ENVIRONMENT: PRODUCTION
    COMMIT_HASH: ${{ github.sha }}
    VERSION_DEPLOYED: latest
    GITHUB_ACTOR: ${{ github.actor }}
    GITHUB_WORKFLOW: ${{ github.workflow }}
    GITHUB_SERVER_URL: ${{ github.server_url }}
    GITHUB_REPOSITORY: ${{ github.repository }}
    GITHUB_RUN_ID: ${{ github.run_id }}
    STATUS: ${{ env.STATUS }}
    STATUS_COLOR: ${{ env.STATUS_COLOR }}
  with:
    slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
    update-ts: ${{ steps.slack-start.outputs.ts }}
    payload-file-path: "./.github/scripts/slack-messages/deployment-completed.json"
    step-outcome: ${{ steps.deploy.outcome }}
```

## Automatic Status Detection

When you provide `step-outcome` input, the action automatically sets these environment variables:

| Outcome | STATUS_EMOJI | STATUS_TEXT |
|---------|--------------|-------------|
| success | `[✓]` | `completed successfully!` |
| failure | `[✗]` | `failed` |

These variables are then available in your payload template files.

## Template File Format

All template files must be valid JSON and support environment variable substitution. Example:

```json
{
  "channel": "$SLACK_CHANNEL_ID",
  "text": "$STATUS_EMOJI $COMPONENT container release $RELEASE_TAG push $STATUS_TEXT <$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID|View run>"
}
```

See available templates in [`.github/scripts/slack-messages/`](../../scripts/slack-messages/).

## Requirements

- Slack Bot Token with scopes: `chat:write`, `chat:write.public`
- Slack Channel ID where messages will be posted
- JSON template files for your messages

## Benefits

- **Consistency**: All notifications use standardized templates
- **Automatic status handling**: No need to calculate success/failure in workflows
- **Clean workflows**: Minimal boilerplate code
- **Reusable templates**: One template for all components
- **Easy to maintain**: Change template once, applies everywhere
- **Version controlled**: All message formats in git

## Related Resources

- [Slack Block Kit Builder](https://app.slack.com/block-kit-builder)
- [Slack API Method Documentation](https://docs.slack.dev/tools/slack-github-action/sending-techniques/sending-data-slack-api-method/)
- [Message templates documentation](../../scripts/slack-messages/README.md)
```

--------------------------------------------------------------------------------

---[FILE: action.yml]---
Location: prowler-master/.github/actions/trivy-scan/action.yml

```yaml
name: 'Container Security Scan with Trivy'
description: 'Scans container images for vulnerabilities using Trivy and reports results'
author: 'Prowler'

inputs:
  image-name:
    description: 'Container image name to scan'
    required: true
  image-tag:
    description: 'Container image tag to scan'
    required: true
    default: ${{ github.sha }}
  severity:
    description: 'Severities to scan for (comma-separated)'
    required: false
    default: 'CRITICAL,HIGH,MEDIUM,LOW'
  fail-on-critical:
    description: 'Fail the build if critical vulnerabilities are found'
    required: false
    default: 'false'
  upload-sarif:
    description: 'Upload results to GitHub Security tab'
    required: false
    default: 'true'
  create-pr-comment:
    description: 'Create a comment on the PR with scan results'
    required: false
    default: 'true'
  artifact-retention-days:
    description: 'Days to retain the Trivy report artifact'
    required: false
    default: '2'

outputs:
  critical-count:
    description: 'Number of critical vulnerabilities found'
    value: ${{ steps.security-check.outputs.critical }}
  high-count:
    description: 'Number of high vulnerabilities found'
    value: ${{ steps.security-check.outputs.high }}
  total-count:
    description: 'Total number of vulnerabilities found'
    value: ${{ steps.security-check.outputs.total }}

runs:
  using: 'composite'
  steps:
    - name: Cache Trivy vulnerability database
      uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
      with:
        path: ~/.cache/trivy
        key: trivy-db-${{ runner.os }}-${{ github.run_id }}
        restore-keys: |
          trivy-db-${{ runner.os }}-

    - name: Run Trivy vulnerability scan (JSON)
      uses: aquasecurity/trivy-action@b6643a29fecd7f34b3597bc6acb0a98b03d33ff8 # v0.33.1
      with:
        image-ref: ${{ inputs.image-name }}:${{ inputs.image-tag }}
        format: 'json'
        output: 'trivy-report.json'
        severity: ${{ inputs.severity }}
        exit-code: '0'
        scanners: 'vuln'
        timeout: '5m'

    - name: Run Trivy vulnerability scan (SARIF)
      if: inputs.upload-sarif == 'true' && github.event_name == 'push'
      uses: aquasecurity/trivy-action@b6643a29fecd7f34b3597bc6acb0a98b03d33ff8 # v0.33.1
      with:
        image-ref: ${{ inputs.image-name }}:${{ inputs.image-tag }}
        format: 'sarif'
        output: 'trivy-results.sarif'
        severity: 'CRITICAL,HIGH'
        exit-code: '0'
        scanners: 'vuln'
        timeout: '5m'

    - name: Upload Trivy results to GitHub Security tab
      if: inputs.upload-sarif == 'true' && github.event_name == 'push'
      uses: github/codeql-action/upload-sarif@3599b3baa15b485a2e49ef411a7a4bb2452e7f93 # v3.30.5
      with:
        sarif_file: 'trivy-results.sarif'
        category: 'trivy-container'

    - name: Upload Trivy report artifact
      uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
      if: always()
      with:
        name: trivy-scan-report-${{ inputs.image-name }}-${{ inputs.image-tag }}
        path: trivy-report.json
        retention-days: ${{ inputs.artifact-retention-days }}

    - name: Generate security summary
      id: security-check
      shell: bash
      run: |
        CRITICAL=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity=="CRITICAL")] | length' trivy-report.json)
        HIGH=$(jq '[.Results[]?.Vulnerabilities[]? | select(.Severity=="HIGH")] | length' trivy-report.json)
        TOTAL=$(jq '[.Results[]?.Vulnerabilities[]?] | length' trivy-report.json)

        echo "critical=$CRITICAL" >> $GITHUB_OUTPUT
        echo "high=$HIGH" >> $GITHUB_OUTPUT
        echo "total=$TOTAL" >> $GITHUB_OUTPUT

        echo "### 🔒 Container Security Scan" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "**Image:** \`${{ inputs.image-name }}:${{ inputs.image-tag }}\`" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "- 🔴 Critical: $CRITICAL" >> $GITHUB_STEP_SUMMARY
        echo "- 🟠 High: $HIGH" >> $GITHUB_STEP_SUMMARY
        echo "- **Total**: $TOTAL" >> $GITHUB_STEP_SUMMARY

    - name: Comment scan results on PR
      if: inputs.create-pr-comment == 'true' && github.event_name == 'pull_request'
      uses: actions/github-script@ed597411d8f924073f98dfc5c65a23a2325f34cd # v8.0.0
      env:
        IMAGE_NAME: ${{ inputs.image-name }}
        GITHUB_SHA: ${{ inputs.image-tag }}
        SEVERITY: ${{ inputs.severity }}
      with:
        script: |
          const comment = require('./.github/scripts/trivy-pr-comment.js');

          // Unique identifier to find our comment
          const marker = '<!-- trivy-scan-comment:${{ inputs.image-name }} -->';
          const body = marker + '\n' + comment;

          // Find existing comment
          const { data: comments } = await github.rest.issues.listComments({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
          });

          const existingComment = comments.find(c => c.body?.includes(marker));

          if (existingComment) {
            // Update existing comment
            await github.rest.issues.updateComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              comment_id: existingComment.id,
              body: body
            });
            console.log('✅ Updated existing Trivy scan comment');
          } else {
            // Create new comment
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
            console.log('✅ Created new Trivy scan comment');
          }

    - name: Check for critical vulnerabilities
      if: inputs.fail-on-critical == 'true' && steps.security-check.outputs.critical != '0'
      shell: bash
      run: |
        echo "::error::Found ${{ steps.security-check.outputs.critical }} critical vulnerabilities"
        echo "::warning::Please update packages or use a different base image"
        exit 1
```

--------------------------------------------------------------------------------

---[FILE: api-codeql-config.yml]---
Location: prowler-master/.github/codeql/api-codeql-config.yml

```yaml
name: 'API: CodeQL Config'
paths:
  - 'api/'

paths-ignore:
  - 'api/tests/**'
  - 'api/**/__pycache__/**'
  - 'api/**/migrations/**'
  - 'api/**/*.md'

queries:
  - uses: security-and-quality
```

--------------------------------------------------------------------------------

---[FILE: sdk-codeql-config.yml]---
Location: prowler-master/.github/codeql/sdk-codeql-config.yml

```yaml
name: 'SDK: CodeQL Config'
paths:
  - 'prowler/'

paths-ignore:
  - 'api/'
  - 'ui/'
  - 'dashboard/'
  - 'mcp_server/'
  - 'tests/**'
  - 'util/**'
  - 'contrib/**'
  - 'examples/**'
  - 'prowler/**/__pycache__/**'
  - 'prowler/**/*.md'

queries:
  - uses: security-and-quality
```

--------------------------------------------------------------------------------

---[FILE: ui-codeql-config.yml]---
Location: prowler-master/.github/codeql/ui-codeql-config.yml
Signals: Next.js

```yaml
name: 'UI: CodeQL Config'
paths:
  - 'ui/'

paths-ignore:
  - 'ui/node_modules/**'
  - 'ui/.next/**'
  - 'ui/out/**'
  - 'ui/tests/**'
  - 'ui/**/*.test.ts'
  - 'ui/**/*.test.tsx'
  - 'ui/**/*.spec.ts'
  - 'ui/**/*.spec.tsx'
  - 'ui/**/*.md'

queries:
  - uses: security-and-quality
```

--------------------------------------------------------------------------------

---[FILE: bug_report.yml]---
Location: prowler-master/.github/ISSUE_TEMPLATE/bug_report.yml
Signals: Docker

```yaml
name: 🐞 Bug Report
description: Create a report to help us improve
labels: ["bug", "status/needs-triage"]

body:
  - type: checkboxes
    id: search
    attributes:
      label: Issue search
      options:
        - label: I have searched the existing issues and this bug has not been reported yet
          required: true
  - type: dropdown
    id: component
    attributes:
      label: Which component is affected?
      multiple: true
      options:
        - Prowler CLI/SDK
        - Prowler API
        - Prowler UI
        - Prowler Dashboard
        - Prowler MCP Server
        - Documentation
        - Other
    validations:
      required: true
  - type: dropdown
    id: provider
    attributes:
      label: Cloud Provider (if applicable)
      multiple: true
      options:
        - AWS
        - Azure
        - GCP
        - Kubernetes
        - GitHub
        - Microsoft 365
        - Not applicable
  - type: textarea
    id: reproduce
    attributes:
      label: Steps to Reproduce
      description: Steps to reproduce the behavior
      placeholder: |-
        1. What command are you running?
        2. Cloud provider you are launching
        3. Environment you have, like single account, multi-account, organizations, multi or single subscription, etc.
        4. See error
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: A clear and concise description of what you expected to happen.
    validations:
      required: true
  - type: textarea
    id: actual
    attributes:
      label: Actual Result with Screenshots or Logs
      description: If applicable, add screenshots to help explain your problem. Also, you can add logs (anonymize them first!). Here a command that may help to share a log `prowler <your arguments> --log-level ERROR --log-file $(date +%F)_error.log` then attach here the log file.
    validations:
      required: true
  - type: dropdown
    id: type
    attributes:
      label: How did you install Prowler?
      options:
        - Cloning the repository from github.com (git clone)
        - From pip package (pip install prowler)
        - From brew (brew install prowler)
        - Docker (docker pull toniblyx/prowler)
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment Resource
      description: From where are you running Prowler?
      placeholder: |-
        1. EC2 instance
        2. Fargate task
        3. Docker container locally
        4. EKS
        5. Cloud9
        6. CodeBuild
        7. Workstation
        8. Other(please specify)
    validations:
      required: true
  - type: textarea
    id: os
    attributes:
      label: OS used
      description: Which OS are you using?
      placeholder: |-
        1. Amazon Linux 2
        2. MacOS
        3. Alpine Linux
        4. Windows
        5. Other(please specify)
    validations:
      required: true
  - type: input
    id: prowler-version
    attributes:
      label: Prowler version
      description: Which Prowler version are you using?
      placeholder: |-
        prowler --version
    validations:
      required: true
  - type: input
    id: python-version
    attributes:
      label: Python version
      description: Which Python version are you using?
      placeholder: |-
        python --version
    validations:
      required: true
  - type: input
    id: pip-version
    attributes:
      label: Pip version
      description: Which pip version are you using?
      placeholder: |-
        pip --version
    validations:
      required: true
  - type: textarea
    id: additional
    attributes:
      description: Additional context
      label: Context
    validations:
      required: false
```

--------------------------------------------------------------------------------

---[FILE: config.yml]---
Location: prowler-master/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
contact_links:
  - name: 📖 Documentation
    url: https://docs.prowler.com
    about: Check our comprehensive documentation for guides and tutorials
  - name: 💬 GitHub Discussions
    url: https://github.com/prowler-cloud/prowler/discussions
    about: Ask questions and discuss with the community
  - name: 🌟 Prowler Community
    url: https://goto.prowler.com/slack
    about: Join our community for support and updates
```

--------------------------------------------------------------------------------

---[FILE: feature-request.yml]---
Location: prowler-master/.github/ISSUE_TEMPLATE/feature-request.yml

```yaml
name: 💡 Feature Request
description: Suggest an idea for this project
labels: ["feature-request", "status/needs-triage"]

body:
  - type: checkboxes
    id: search
    attributes:
      label: Feature search
      options:
        - label: I have searched the existing issues and this feature has not been requested yet or is already in our [Public Roadmap](https://roadmap.prowler.com/roadmap)
          required: true
  - type: dropdown
    id: component
    attributes:
      label: Which component would this feature affect?
      multiple: true
      options:
        - Prowler CLI/SDK
        - Prowler API
        - Prowler UI
        - Prowler Dashboard
        - Prowler MCP Server
        - Documentation
        - New component/Integration
    validations:
      required: true
  - type: dropdown
    id: provider
    attributes:
      label: Related to specific cloud provider?
      multiple: true
      options:
        - AWS
        - Azure
        - GCP
        - Kubernetes
        - GitHub
        - Microsoft 365
        - All providers
        - Not provider-specific
  - type: textarea
    id: Problem
    attributes:
      label: New feature motivation
      description: Is your feature request related to a problem? Please describe
      placeholder: |-
        1. A clear and concise description of what the problem is. Ex. I'm always frustrated when
    validations:
      required: true
  - type: textarea
    id: Solution
    attributes:
      label: Solution Proposed
      description: A clear and concise description of what you want to happen.
    validations:
      required: true
  - type: textarea
    id: use-case
    attributes:
      label: Use case and benefits
      description: Who would benefit from this feature and how?
      placeholder: This would help security teams by...
    validations:
      required: true
  - type: textarea
    id: Alternatives
    attributes:
      label: Describe alternatives you've considered
      description: A clear and concise description of any alternative solutions or features you've considered.
    validations:
      required: true
  - type: textarea
    id: Context
    attributes:
      label: Additional context
      description: Add any other context or screenshots about the feature request here.
    validations:
      required: false
```

--------------------------------------------------------------------------------

---[FILE: trivy-pr-comment.js]---
Location: prowler-master/.github/scripts/trivy-pr-comment.js

```javascript
const fs = require('fs');

// Configuration from environment variables
const REPORT_FILE = process.env.TRIVY_REPORT_FILE || 'trivy-report.json';
const IMAGE_NAME = process.env.IMAGE_NAME || 'container-image';
const GITHUB_SHA = process.env.GITHUB_SHA || 'unknown';
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || '';
const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID || '';
const SEVERITY = process.env.SEVERITY || 'CRITICAL,HIGH,MEDIUM,LOW';

// Parse severities to scan
const scannedSeverities = SEVERITY.split(',').map(s => s.trim());

// Read and parse the Trivy report
const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));

let vulnCount = 0;
let vulnsByType = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
let affectedPackages = new Set();

if (report.Results && Array.isArray(report.Results)) {
    for (const result of report.Results) {
        if (result.Vulnerabilities && Array.isArray(result.Vulnerabilities)) {
            for (const vuln of result.Vulnerabilities) {
                vulnCount++;
                if (vulnsByType[vuln.Severity] !== undefined) {
                    vulnsByType[vuln.Severity]++;
                }
                if (vuln.PkgName) {
                    affectedPackages.add(vuln.PkgName);
                }
            }
        }
    }
}

const shortSha = GITHUB_SHA.substring(0, 7);
const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

// Severity icons and labels
const severityConfig = {
    CRITICAL: { icon: '🔴', label: 'Critical' },
    HIGH: { icon: '🟠', label: 'High' },
    MEDIUM: { icon: '🟡', label: 'Medium' },
    LOW: { icon: '🔵', label: 'Low' }
};

let comment = '## 🔒 Container Security Scan\n\n';
comment += `**Image:** \`${IMAGE_NAME}:${shortSha}\`\n`;
comment += `**Last scan:** ${timestamp}\n\n`;

if (vulnCount === 0) {
    comment += '### ✅ No Vulnerabilities Detected\n\n';
    comment += 'The container image passed all security checks. No known CVEs were found.\n';
} else {
    comment += '### 📊 Vulnerability Summary\n\n';
    comment += '| Severity | Count |\n';
    comment += '|----------|-------|\n';

    // Only show severities that were scanned
    for (const severity of scannedSeverities) {
        const config = severityConfig[severity];
        const count = vulnsByType[severity] || 0;
        const isBold = (severity === 'CRITICAL' || severity === 'HIGH') && count > 0;
        const countDisplay = isBold ? `**${count}**` : count;
        comment += `| ${config.icon} ${config.label} | ${countDisplay} |\n`;
    }

    comment += `| **Total** | **${vulnCount}** |\n\n`;

    if (affectedPackages.size > 0) {
        comment += `**${affectedPackages.size}** package(s) affected\n\n`;
    }

    if (vulnsByType.CRITICAL > 0) {
        comment += '### ⚠️ Action Required\n\n';
        comment += '**Critical severity vulnerabilities detected.** These should be addressed before merging:\n';
        comment += '- Review the detailed scan results\n';
        comment += '- Update affected packages to patched versions\n';
        comment += '- Consider using a different base image if updates are unavailable\n\n';
    } else if (vulnsByType.HIGH > 0) {
        comment += '### ⚠️ Attention Needed\n\n';
        comment += '**High severity vulnerabilities found.** Please review and plan remediation:\n';
        comment += '- Assess the risk and exploitability\n';
        comment += '- Prioritize updates in the next maintenance cycle\n\n';
    } else {
        comment += '### ℹ️ Review Recommended\n\n';
        comment += 'Medium/Low severity vulnerabilities found. Consider addressing during regular maintenance.\n\n';
    }
}

comment += '---\n';
comment += '📋 **Resources:**\n';

if (GITHUB_REPOSITORY && GITHUB_RUN_ID) {
    comment += `- [Download full report](https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}) (see artifacts)\n`;
}

comment += '- [View in Security tab](https://github.com/' + (GITHUB_REPOSITORY || 'repository') + '/security/code-scanning)\n';
comment += '- Scanned with [Trivy](https://github.com/aquasecurity/trivy)\n';

module.exports = comment;
```

--------------------------------------------------------------------------------

---[FILE: container-release-completed.json]---
Location: prowler-master/.github/scripts/slack-messages/container-release-completed.json

```json
{
  "channel": "${{ env.SLACK_CHANNEL_ID }}",
  "ts": "${{ env.MESSAGE_TS }}",
  "attachments": [
    {
      "color": "${{ env.STATUS_COLOR }}",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Status:*\n${{ env.STATUS_TEXT }}\n\n${{ env.COMPONENT }} container release ${{ env.RELEASE_TAG }} push ${{ env.STATUS_TEXT }}\n\n<${{ env.GITHUB_SERVER_URL }}/${{ env.GITHUB_REPOSITORY }}/actions/runs/${{ env.GITHUB_RUN_ID }}|View run>"
          }
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: container-release-started.json]---
Location: prowler-master/.github/scripts/slack-messages/container-release-started.json

```json
{
  "channel": "${{ env.SLACK_CHANNEL_ID }}",
  "attachments": [
    {
      "color": "${{ env.STATUS_COLOR }}",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Status:*\nStarted\n\n${{ env.COMPONENT }} container release ${{ env.RELEASE_TAG }} push started...\n\n<${{ env.GITHUB_SERVER_URL }}/${{ env.GITHUB_REPOSITORY }}/actions/runs/${{ env.GITHUB_RUN_ID }}|View run>"
          }
        }
      ]
    }
  ]
}
```

--------------------------------------------------------------------------------

````
