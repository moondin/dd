---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 789
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 789 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/github/webhook.ts

```typescript
import { GithubIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const githubWebhookTrigger: TriggerConfig = {
  id: 'github_webhook',
  name: 'GitHub Webhook',
  provider: 'github',
  description: 'Trigger workflow from GitHub events like push, pull requests, issues, and more',
  version: '1.0.0',
  icon: GithubIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'application/json', id: 'application/json' },
        { label: 'application/x-www-form-urlencoded', id: 'application/x-www-form-urlencoded' },
      ],
      defaultValue: 'application/json',
      description: 'Format GitHub will use when sending the webhook payload.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Generate or enter a strong secret',
      description: 'Validates that webhook deliveries originate from GitHub.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
    {
      id: 'sslVerification',
      title: 'SSL Verification',
      type: 'dropdown',
      options: [
        { label: 'Enabled', id: 'enabled' },
        { label: 'Disabled', id: 'disabled' },
      ],
      defaultValue: 'enabled',
      description: 'GitHub verifies SSL certificates when delivering webhooks.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Go to your GitHub Repository > Settings > Webhooks.',
        'Click "Add webhook".',
        'Paste the <strong>Webhook URL</strong> above into the "Payload URL" field.',
        'Select your chosen Content Type from the dropdown.',
        'Enter the <strong>Webhook Secret</strong> into the "Secret" field if you\'ve configured one.',
        'Set SSL verification according to your selection.',
        'Choose which events should trigger this webhook.',
        'Ensure "Active" is checked and click "Add webhook".',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'github_webhook',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_webhook',
      },
    },
  ],

  outputs: {
    ref: {
      type: 'string',
      description: 'Git reference (e.g., refs/heads/fix/telegram-wh)',
    },
    before: {
      type: 'string',
      description: 'SHA of the commit before the push',
    },
    after: {
      type: 'string',
      description: 'SHA of the commit after the push',
    },
    created: {
      type: 'boolean',
      description: 'Whether the push created the reference',
    },
    deleted: {
      type: 'boolean',
      description: 'Whether the push deleted the reference',
    },
    forced: {
      type: 'boolean',
      description: 'Whether the push was forced',
    },
    base_ref: {
      type: 'string',
      description: 'Base reference for the push',
    },
    compare: {
      type: 'string',
      description: 'URL to compare the changes',
    },
    repository: {
      id: {
        type: 'number',
        description: 'Repository ID',
      },
      node_id: {
        type: 'string',
        description: 'Repository node ID',
      },
      name: {
        type: 'string',
        description: 'Repository name',
      },
      full_name: {
        type: 'string',
        description: 'Repository full name (owner/repo)',
      },
      private: {
        type: 'boolean',
        description: 'Whether the repository is private',
      },
      html_url: {
        type: 'string',
        description: 'Repository HTML URL',
      },
      fork: {
        type: 'boolean',
        description: 'Whether the repository is a fork',
      },
      url: {
        type: 'string',
        description: 'Repository API URL',
      },
      created_at: {
        type: 'number',
        description: 'Repository creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Repository last updated time',
      },
      pushed_at: {
        type: 'number',
        description: 'Repository last push timestamp',
      },
      git_url: {
        type: 'string',
        description: 'Repository git URL',
      },
      ssh_url: {
        type: 'string',
        description: 'Repository SSH URL',
      },
      clone_url: {
        type: 'string',
        description: 'Repository clone URL',
      },
      homepage: {
        type: 'string',
        description: 'Repository homepage URL',
      },
      size: {
        type: 'number',
        description: 'Repository size',
      },
      stargazers_count: {
        type: 'number',
        description: 'Number of stars',
      },
      watchers_count: {
        type: 'number',
        description: 'Number of watchers',
      },
      language: {
        type: 'string',
        description: 'Primary programming language',
      },
      forks_count: {
        type: 'number',
        description: 'Number of forks',
      },
      archived: {
        type: 'boolean',
        description: 'Whether the repository is archived',
      },
      disabled: {
        type: 'boolean',
        description: 'Whether the repository is disabled',
      },
      open_issues_count: {
        type: 'number',
        description: 'Number of open issues',
      },
      topics: {
        type: 'array',
        description: 'Repository topics',
      },
      visibility: {
        type: 'string',
        description: 'Repository visibility (public, private)',
      },
      forks: {
        type: 'number',
        description: 'Number of forks',
      },
      open_issues: {
        type: 'number',
        description: 'Number of open issues',
      },
      watchers: {
        type: 'number',
        description: 'Number of watchers',
      },
      default_branch: {
        type: 'string',
        description: 'Default branch name',
      },
      stargazers: {
        type: 'number',
        description: 'Number of stargazers',
      },
      master_branch: {
        type: 'string',
        description: 'Master branch name',
      },
      owner: {
        name: {
          type: 'string',
          description: 'Owner name',
        },
        email: {
          type: 'string',
          description: 'Owner email',
        },
        login: {
          type: 'string',
          description: 'Owner username',
        },
        id: {
          type: 'number',
          description: 'Owner ID',
        },
        node_id: {
          type: 'string',
          description: 'Owner node ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Owner avatar URL',
        },
        gravatar_id: {
          type: 'string',
          description: 'Owner gravatar ID',
        },
        url: {
          type: 'string',
          description: 'Owner API URL',
        },
        html_url: {
          type: 'string',
          description: 'Owner profile URL',
        },
        user_view_type: {
          type: 'string',
          description: 'User view type',
        },
        site_admin: {
          type: 'boolean',
          description: 'Whether the owner is a site admin',
        },
      },
      license: {
        type: 'object',
        description: 'Repository license information',
        key: {
          type: 'string',
          description: 'License key (e.g., apache-2.0)',
        },
        name: {
          type: 'string',
          description: 'License name',
        },
        spdx_id: {
          type: 'string',
          description: 'SPDX license identifier',
        },
        url: {
          type: 'string',
          description: 'License URL',
        },
        node_id: {
          type: 'string',
          description: 'License node ID',
        },
      },
    },
    pusher: {
      type: 'object',
      description: 'Information about who pushed the changes',
      name: {
        type: 'string',
        description: 'Pusher name',
      },
      email: {
        type: 'string',
        description: 'Pusher email',
      },
    },
    sender: {
      login: {
        type: 'string',
        description: 'Sender username',
      },
      id: {
        type: 'number',
        description: 'Sender ID',
      },
      node_id: {
        type: 'string',
        description: 'Sender node ID',
      },
      avatar_url: {
        type: 'string',
        description: 'Sender avatar URL',
      },
      gravatar_id: {
        type: 'string',
        description: 'Sender gravatar ID',
      },
      url: {
        type: 'string',
        description: 'Sender API URL',
      },
      html_url: {
        type: 'string',
        description: 'Sender profile URL',
      },
      user_view_type: {
        type: 'string',
        description: 'User view type',
      },
      site_admin: {
        type: 'boolean',
        description: 'Whether the sender is a site admin',
      },
    },
    commits: {
      type: 'array',
      description: 'Array of commit objects',
      id: {
        type: 'string',
        description: 'Commit SHA',
      },
      tree_id: {
        type: 'string',
        description: 'Tree SHA',
      },
      distinct: {
        type: 'boolean',
        description: 'Whether the commit is distinct',
      },
      message: {
        type: 'string',
        description: 'Commit message',
      },
      timestamp: {
        type: 'string',
        description: 'Commit timestamp',
      },
      url: {
        type: 'string',
        description: 'Commit URL',
      },
      author: {
        type: 'object',
        description: 'Commit author',
        name: {
          type: 'string',
          description: 'Author name',
        },
        email: {
          type: 'string',
          description: 'Author email',
        },
      },
      committer: {
        type: 'object',
        description: 'Commit committer',
        name: {
          type: 'string',
          description: 'Committer name',
        },
        email: {
          type: 'string',
          description: 'Committer email',
        },
      },
      added: {
        type: 'array',
        description: 'Array of added files',
      },
      removed: {
        type: 'array',
        description: 'Array of removed files',
      },
      modified: {
        type: 'array',
        description: 'Array of modified files',
      },
    },
    head_commit: {
      type: 'object',
      description: 'Head commit object',
      id: {
        type: 'string',
        description: 'Commit SHA',
      },
      tree_id: {
        type: 'string',
        description: 'Tree SHA',
      },
      distinct: {
        type: 'boolean',
        description: 'Whether the commit is distinct',
      },
      message: {
        type: 'string',
        description: 'Commit message',
      },
      timestamp: {
        type: 'string',
        description: 'Commit timestamp',
      },
      url: {
        type: 'string',
        description: 'Commit URL',
      },
      author: {
        type: 'object',
        description: 'Commit author',
        name: {
          type: 'string',
          description: 'Author name',
        },
        email: {
          type: 'string',
          description: 'Author email',
        },
      },
      committer: {
        type: 'object',
        description: 'Commit committer',
        name: {
          type: 'string',
          description: 'Committer name',
        },
        email: {
          type: 'string',
          description: 'Committer email',
        },
      },
      added: {
        type: 'array',
        description: 'Array of added files',
      },
      removed: {
        type: 'array',
        description: 'Array of removed files',
      },
      modified: {
        type: 'array',
        description: 'Array of modified files',
      },
    },

    // Convenient flat fields for easy access
    event_type: {
      type: 'string',
      description: 'Type of GitHub event (e.g., push, pull_request, issues)',
    },
    action: {
      type: 'string',
      description: 'The action that was performed (e.g., opened, closed, synchronize)',
    },
    branch: {
      type: 'string',
      description: 'Branch name extracted from ref',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'pull_request',
      'X-GitHub-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: workflow_run.ts]---
Location: sim-main/apps/sim/triggers/github/workflow_run.ts

```typescript
import { GithubIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const githubWorkflowRunTrigger: TriggerConfig = {
  id: 'github_workflow_run',
  name: 'GitHub Actions Workflow Run',
  provider: 'github',
  description:
    'Trigger workflow when a GitHub Actions workflow run is requested, in progress, or completed',
  version: '1.0.0',
  icon: GithubIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
    {
      id: 'contentType',
      title: 'Content Type',
      type: 'dropdown',
      options: [
        { label: 'application/json', id: 'application/json' },
        {
          label: 'application/x-www-form-urlencoded',
          id: 'application/x-www-form-urlencoded',
        },
      ],
      defaultValue: 'application/json',
      description: 'Format GitHub will use when sending the webhook payload.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Generate or enter a strong secret',
      description: 'Validates that webhook deliveries originate from GitHub.',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
    {
      id: 'sslVerification',
      title: 'SSL Verification',
      type: 'dropdown',
      options: [
        { label: 'Enabled', id: 'enabled' },
        { label: 'Disabled', id: 'disabled' },
      ],
      defaultValue: 'enabled',
      description: 'GitHub verifies SSL certificates when delivering webhooks.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Go to your GitHub Repository > Settings > Webhooks.',
        'Click "Add webhook".',
        'Paste the <strong>Webhook URL</strong> above into the "Payload URL" field.',
        'Select your chosen Content Type from the dropdown.',
        'Enter the <strong>Webhook Secret</strong> into the "Secret" field if you\'ve configured one.',
        'Set SSL verification according to your selection.',
        'Select "Let me select individual events" and check <strong>Workflow runs</strong>.',
        'Ensure "Active" is checked and click "Add webhook".',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'github_workflow_run',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_workflow_run',
      },
    },
  ],

  outputs: {
    action: {
      type: 'string',
      description: 'Action performed (requested, in_progress, completed)',
    },
    workflow_run: {
      id: {
        type: 'number',
        description: 'Workflow run ID',
      },
      node_id: {
        type: 'string',
        description: 'Workflow run node ID',
      },
      name: {
        type: 'string',
        description: 'Workflow name',
      },
      workflow_id: {
        type: 'number',
        description: 'Workflow ID',
      },
      run_number: {
        type: 'number',
        description: 'Run number for this workflow',
      },
      run_attempt: {
        type: 'number',
        description: 'Attempt number for this run',
      },
      event: {
        type: 'string',
        description: 'Event that triggered the workflow (push, pull_request, etc.)',
      },
      status: {
        type: 'string',
        description: 'Current status (queued, in_progress, completed)',
      },
      conclusion: {
        type: 'string',
        description:
          'Conclusion (success, failure, cancelled, skipped, timed_out, action_required)',
      },
      head_branch: {
        type: 'string',
        description: 'Branch name',
      },
      head_sha: {
        type: 'string',
        description: 'Commit SHA that triggered the workflow',
      },
      path: {
        type: 'string',
        description: 'Path to the workflow file',
      },
      display_title: {
        type: 'string',
        description: 'Display title for the run',
      },
      run_started_at: {
        type: 'string',
        description: 'Timestamp when the run started',
      },
      created_at: {
        type: 'string',
        description: 'Workflow run creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Workflow run last update timestamp',
      },
      html_url: {
        type: 'string',
        description: 'Workflow run HTML URL',
      },
      check_suite_id: {
        type: 'number',
        description: 'Associated check suite ID',
      },
      check_suite_node_id: {
        type: 'string',
        description: 'Associated check suite node ID',
      },
      url: {
        type: 'string',
        description: 'Workflow run API URL',
      },
      actor: {
        login: {
          type: 'string',
          description: 'Username',
        },
        id: {
          type: 'number',
          description: 'User ID',
        },
        node_id: {
          type: 'string',
          description: 'User node ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Avatar URL',
        },
        html_url: {
          type: 'string',
          description: 'Profile URL',
        },
        user_type: {
          type: 'string',
          description: 'User type (User, Bot, Organization)',
        },
      },
      triggering_actor: {
        login: {
          type: 'string',
          description: 'Username',
        },
        id: {
          type: 'number',
          description: 'User ID',
        },
        node_id: {
          type: 'string',
          description: 'User node ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Avatar URL',
        },
        html_url: {
          type: 'string',
          description: 'Profile URL',
        },
        user_type: {
          type: 'string',
          description: 'User type (User, Bot, Organization)',
        },
      },
      repository: {
        id: {
          type: 'number',
          description: 'Repository ID',
        },
        node_id: {
          type: 'string',
          description: 'Repository node ID',
        },
        name: {
          type: 'string',
          description: 'Repository name',
        },
        full_name: {
          type: 'string',
          description: 'Repository full name',
        },
        private: {
          type: 'boolean',
          description: 'Whether repository is private',
        },
      },
      head_repository: {
        id: {
          type: 'number',
          description: 'Head repository ID',
        },
        node_id: {
          type: 'string',
          description: 'Head repository node ID',
        },
        name: {
          type: 'string',
          description: 'Head repository name',
        },
        full_name: {
          type: 'string',
          description: 'Head repository full name',
        },
        private: {
          type: 'boolean',
          description: 'Whether repository is private',
        },
      },
      head_commit: {
        id: {
          type: 'string',
          description: 'Commit SHA',
        },
        tree_id: {
          type: 'string',
          description: 'Tree ID',
        },
        message: {
          type: 'string',
          description: 'Commit message',
        },
        timestamp: {
          type: 'string',
          description: 'Commit timestamp',
        },
        author: {
          name: {
            type: 'string',
            description: 'Author name',
          },
          email: {
            type: 'string',
            description: 'Author email',
          },
        },
        committer: {
          name: {
            type: 'string',
            description: 'Committer name',
          },
          email: {
            type: 'string',
            description: 'Committer email',
          },
        },
      },
      pull_requests: {
        type: 'array',
        description: 'Array of associated pull requests',
      },
      referenced_workflows: {
        type: 'array',
        description: 'Array of referenced workflow runs',
      },
    },
    workflow: {
      id: {
        type: 'number',
        description: 'Workflow ID',
      },
      node_id: {
        type: 'string',
        description: 'Workflow node ID',
      },
      name: {
        type: 'string',
        description: 'Workflow name',
      },
      path: {
        type: 'string',
        description: 'Path to workflow file',
      },
      state: {
        type: 'string',
        description: 'Workflow state (active, deleted, disabled_fork, etc.)',
      },
      created_at: {
        type: 'string',
        description: 'Workflow creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Workflow last update timestamp',
      },
      url: {
        type: 'string',
        description: 'Workflow API URL',
      },
      html_url: {
        type: 'string',
        description: 'Workflow HTML URL',
      },
      badge_url: {
        type: 'string',
        description: 'Workflow badge URL',
      },
    },
    repository: {
      id: {
        type: 'number',
        description: 'Repository ID',
      },
      node_id: {
        type: 'string',
        description: 'Repository node ID',
      },
      name: {
        type: 'string',
        description: 'Repository name',
      },
      full_name: {
        type: 'string',
        description: 'Repository full name (owner/repo)',
      },
      private: {
        type: 'boolean',
        description: 'Whether the repository is private',
      },
      html_url: {
        type: 'string',
        description: 'Repository HTML URL',
      },
      repo_description: {
        type: 'string',
        description: 'Repository description',
      },
      owner: {
        login: {
          type: 'string',
          description: 'Owner username',
        },
        id: {
          type: 'number',
          description: 'Owner ID',
        },
        node_id: {
          type: 'string',
          description: 'Owner node ID',
        },
        avatar_url: {
          type: 'string',
          description: 'Owner avatar URL',
        },
        html_url: {
          type: 'string',
          description: 'Owner profile URL',
        },
        owner_type: {
          type: 'string',
          description: 'Owner type (User, Organization)',
        },
      },
    },
    sender: {
      login: {
        type: 'string',
        description: 'Username',
      },
      id: {
        type: 'number',
        description: 'User ID',
      },
      node_id: {
        type: 'string',
        description: 'User node ID',
      },
      avatar_url: {
        type: 'string',
        description: 'Avatar URL',
      },
      html_url: {
        type: 'string',
        description: 'Profile URL',
      },
      user_type: {
        type: 'string',
        description: 'User type (User, Bot, Organization)',
      },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'workflow_run',
      'X-GitHub-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'X-Hub-Signature-256': 'sha256=...',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/gmail/index.ts

```typescript
export { gmailPollingTrigger } from './poller'
```

--------------------------------------------------------------------------------

---[FILE: poller.ts]---
Location: sim-main/apps/sim/triggers/gmail/poller.ts

```typescript
import { GmailIcon } from '@/components/icons'
import { createLogger } from '@/lib/logs/console/logger'
import { useSubBlockStore } from '@/stores/workflows/subblock/store'
import type { TriggerConfig } from '@/triggers/types'

const logger = createLogger('GmailPollingTrigger')

export const gmailPollingTrigger: TriggerConfig = {
  id: 'gmail_poller',
  name: 'Gmail Email Trigger',
  provider: 'gmail',
  description: 'Triggers when new emails are received in Gmail (requires Gmail credentials)',
  version: '1.0.0',
  icon: GmailIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires google email credentials to access your account.',
      serviceId: 'gmail',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
    },
    {
      id: 'labelIds',
      title: 'Gmail Labels to Monitor',
      type: 'dropdown',
      multiSelect: true,
      placeholder: 'Select Gmail labels to monitor for new emails',
      description: 'Choose which Gmail labels to monitor. Leave empty to monitor all emails.',
      required: false,
      options: [], // Will be populated dynamically from user's Gmail labels
      fetchOptions: async (blockId: string, subBlockId: string) => {
        const credentialId = useSubBlockStore.getState().getValue(blockId, 'triggerCredentials') as
          | string
          | null
        if (!credentialId) {
          // Return a sentinel to prevent infinite retry loops when credential is missing
          throw new Error('No Gmail credential selected')
        }
        try {
          const response = await fetch(`/api/tools/gmail/labels?credentialId=${credentialId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch Gmail labels')
          }
          const data = await response.json()
          if (data.labels && Array.isArray(data.labels)) {
            return data.labels.map((label: { id: string; name: string }) => ({
              id: label.id,
              label: label.name,
            }))
          }
          return []
        } catch (error) {
          logger.error('Error fetching Gmail labels:', error)
          throw error
        }
      },
      dependsOn: ['triggerCredentials'],
      mode: 'trigger',
    },
    {
      id: 'labelFilterBehavior',
      title: 'Label Filter Behavior',
      type: 'dropdown',
      options: [
        { label: 'INCLUDE', id: 'INCLUDE' },
        { label: 'EXCLUDE', id: 'EXCLUDE' },
      ],
      defaultValue: 'INCLUDE',
      description:
        'Include only emails with selected labels, or exclude emails with selected labels',
      required: true,
      mode: 'trigger',
    },
    {
      id: 'searchQuery',
      title: 'Gmail Search Query',
      type: 'short-input',
      placeholder: 'subject:report OR from:important@example.com',
      description:
        'Optional Gmail search query to filter emails. Use the same format as Gmail search box (e.g., "subject:invoice", "from:boss@company.com", "has:attachment"). Leave empty to search all emails.',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'markAsRead',
      title: 'Mark as Read',
      type: 'switch',
      defaultValue: false,
      description: 'Automatically mark emails as read after processing',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'includeAttachments',
      title: 'Include Attachments',
      type: 'switch',
      defaultValue: false,
      description: 'Download and include email attachments in the trigger payload',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Gmail account using OAuth credentials',
        'Configure which Gmail labels to monitor (optional)',
        'The system will automatically check for new emails and trigger your workflow',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'gmail_poller',
    },
  ],

  outputs: {
    email: {
      id: {
        type: 'string',
        description: 'Gmail message ID',
      },
      threadId: {
        type: 'string',
        description: 'Gmail thread ID',
      },
      subject: {
        type: 'string',
        description: 'Email subject line',
      },
      from: {
        type: 'string',
        description: 'Sender email address',
      },
      to: {
        type: 'string',
        description: 'Recipient email address',
      },
      cc: {
        type: 'string',
        description: 'CC recipients',
      },
      date: {
        type: 'string',
        description: 'Email date in ISO format',
      },
      bodyText: {
        type: 'string',
        description: 'Plain text email body',
      },
      bodyHtml: {
        type: 'string',
        description: 'HTML email body',
      },
      labels: {
        type: 'string',
        description: 'Email labels array',
      },
      hasAttachments: {
        type: 'boolean',
        description: 'Whether email has attachments',
      },
      attachments: {
        type: 'file[]',
        description: 'Array of email attachments as files (if includeAttachments is enabled)',
      },
    },
    timestamp: {
      type: 'string',
      description: 'Event timestamp',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/googleforms/index.ts

```typescript
export { googleFormsWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/googleforms/webhook.ts

```typescript
import { GoogleFormsIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const googleFormsWebhookTrigger: TriggerConfig = {
  id: 'google_forms_webhook',
  name: 'Google Forms Webhook',
  provider: 'google_forms',
  description: 'Trigger workflow from Google Form submissions (via Apps Script forwarder)',
  version: '1.0.0',
  icon: GoogleFormsIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
    },
    {
      id: 'token',
      title: 'Shared Secret',
      type: 'short-input',
      placeholder: 'Enter a secret used by your Apps Script forwarder',
      description:
        'We validate requests using this secret. Send it as Authorization: Bearer <token> or a custom header.',
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'secretHeaderName',
      title: 'Custom Secret Header',
      type: 'short-input',
      placeholder: 'X-GForms-Secret',
      description:
        'If set, the webhook will validate this header equals your Shared Secret instead of Authorization.',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'formId',
      title: 'Form ID',
      type: 'short-input',
      placeholder: '1FAIpQLSd... (Google Form ID)',
      description:
        'Optional, for clarity and matching in workflows. Not required for webhook to work.',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'includeRawPayload',
      title: 'Include Raw Payload',
      type: 'switch',
      description: 'Include the original payload from Apps Script in the workflow input.',
      defaultValue: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Open your Google Form → More (⋮) → Script editor.',
        'Paste the Apps Script snippet from below into <code>Code.gs</code> → Save.',
        'Triggers (clock icon) → Add Trigger → Function: <code>onFormSubmit</code> → Event source: <code>From form</code> → Event type: <code>On form submit</code> → Save.',
        'Authorize when prompted. Submit a test response and verify the run in Sim → Logs.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'setupScript',
      title: 'Apps Script Code',
      type: 'code',
      language: 'javascript',
      value: (params: Record<string, any>) => {
        const script = `function onFormSubmit(e) {
  const WEBHOOK_URL = "{{WEBHOOK_URL}}";
  const SHARED_SECRET = "{{SHARED_SECRET}}";
  
  try {
    const form = FormApp.getActiveForm();
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Build answers object
    const answers = {};
    for (var i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const question = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      answers[question] = answer;
    }
    
    // Build payload
    const payload = {
      provider: "google_forms",
      formId: form.getId(),
      responseId: formResponse.getId(),
      createTime: formResponse.getTimestamp().toISOString(),
      lastSubmittedTime: formResponse.getTimestamp().toISOString(),
      answers: answers
    };
    
    // Send to webhook
    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": "Bearer " + SHARED_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    
    if (response.getResponseCode() !== 200) {
      Logger.log("Webhook failed: " + response.getContentText());
    } else {
      Logger.log("Successfully sent form response to webhook");
    }
  } catch (error) {
    Logger.log("Error in onFormSubmit: " + error.toString());
  }
}`
        const webhookUrl = params.webhookUrlDisplay || ''
        const token = params.token || ''
        return script
          .replace(/\{\{WEBHOOK_URL\}\}/g, webhookUrl)
          .replace(/\{\{SHARED_SECRET\}\}/g, token)
      },
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Copy this code and paste it into your Google Forms Apps Script editor',
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'google_forms_webhook',
    },
  ],

  outputs: {
    responseId: { type: 'string', description: 'Unique response identifier (if available)' },
    createTime: { type: 'string', description: 'Response creation timestamp' },
    lastSubmittedTime: { type: 'string', description: 'Last submitted timestamp' },
    formId: { type: 'string', description: 'Google Form ID' },
    answers: { type: 'object', description: 'Normalized map of question -> answer' },
    raw: { type: 'object', description: 'Original payload (when enabled)' },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

````
