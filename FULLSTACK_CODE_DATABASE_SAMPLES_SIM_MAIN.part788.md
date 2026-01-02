---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 788
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 788 of 933)

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

---[FILE: push.ts]---
Location: sim-main/apps/sim/triggers/github/push.ts

```typescript
import { GithubIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const githubPushTrigger: TriggerConfig = {
  id: 'github_push',
  name: 'GitHub Push',
  provider: 'github',
  description: 'Trigger workflow when code is pushed to a repository',
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
        value: 'github_push',
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
        value: 'github_push',
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
        value: 'github_push',
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
        value: 'github_push',
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
        'Select "Let me select individual events" and check <strong>Pushes</strong>.',
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
        value: 'github_push',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'github_push',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_push',
      },
    },
  ],

  outputs: {
    ref: {
      type: 'string',
      description: 'Git reference that was pushed (e.g., refs/heads/main)',
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
      description: 'Whether this push created a new branch or tag',
    },
    deleted: {
      type: 'boolean',
      description: 'Whether this push deleted a branch or tag',
    },
    forced: {
      type: 'boolean',
      description: 'Whether this was a force push',
    },
    base_ref: {
      type: 'string',
      description: 'Base reference for the push',
    },
    compare: {
      type: 'string',
      description: 'URL to compare the changes',
    },
    commits: {
      type: 'array',
      description: 'Array of commit objects included in this push',
      items: {
        id: {
          type: 'string',
          description: 'Commit SHA',
        },
        tree_id: {
          type: 'string',
          description: 'Git tree SHA',
        },
        distinct: {
          type: 'boolean',
          description: 'Whether this commit is distinct from others in the push',
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
          name: {
            type: 'string',
            description: 'Author name',
          },
          email: {
            type: 'string',
            description: 'Author email',
          },
          username: {
            type: 'string',
            description: 'Author GitHub username',
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
          username: {
            type: 'string',
            description: 'Committer GitHub username',
          },
        },
        added: {
          type: 'array',
          description: 'Array of file paths added in this commit',
        },
        removed: {
          type: 'array',
          description: 'Array of file paths removed in this commit',
        },
        modified: {
          type: 'array',
          description: 'Array of file paths modified in this commit',
        },
      },
    },
    head_commit: {
      id: {
        type: 'string',
        description: 'Commit SHA of the most recent commit',
      },
      tree_id: {
        type: 'string',
        description: 'Git tree SHA',
      },
      distinct: {
        type: 'boolean',
        description: 'Whether this commit is distinct',
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
        name: {
          type: 'string',
          description: 'Author name',
        },
        email: {
          type: 'string',
          description: 'Author email',
        },
        username: {
          type: 'string',
          description: 'Author GitHub username',
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
        username: {
          type: 'string',
          description: 'Committer GitHub username',
        },
      },
      added: {
        type: 'array',
        description: 'Array of file paths added in this commit',
      },
      removed: {
        type: 'array',
        description: 'Array of file paths removed in this commit',
      },
      modified: {
        type: 'array',
        description: 'Array of file paths modified in this commit',
      },
    },
    pusher: {
      name: {
        type: 'string',
        description: 'Pusher name',
      },
      email: {
        type: 'string',
        description: 'Pusher email',
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
      fork: {
        type: 'boolean',
        description: 'Whether the repository is a fork',
      },
      url: {
        type: 'string',
        description: 'Repository API URL',
      },
      homepage: {
        type: 'string',
        description: 'Repository homepage URL',
      },
      size: {
        type: 'number',
        description: 'Repository size in KB',
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
      open_issues_count: {
        type: 'number',
        description: 'Number of open issues',
      },
      default_branch: {
        type: 'string',
        description: 'Default branch name',
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
      'X-GitHub-Event': 'push',
      'X-GitHub-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'X-Hub-Signature-256': 'sha256=...',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: release_published.ts]---
Location: sim-main/apps/sim/triggers/github/release_published.ts

```typescript
import { GithubIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const githubReleasePublishedTrigger: TriggerConfig = {
  id: 'github_release_published',
  name: 'GitHub Release Published',
  provider: 'github',
  description: 'Trigger workflow when a new release is published in a GitHub repository',
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
        value: 'github_release_published',
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
        value: 'github_release_published',
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
        value: 'github_release_published',
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
        value: 'github_release_published',
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
        'Select "Let me select individual events" and check <strong>Releases</strong> event.',
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
        value: 'github_release_published',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'github_release_published',
      condition: {
        field: 'selectedTriggerId',
        value: 'github_release_published',
      },
    },
  ],

  outputs: {
    action: {
      type: 'string',
      description:
        'Action performed (published, unpublished, created, edited, deleted, prereleased, released)',
    },
    release: {
      id: {
        type: 'number',
        description: 'Release ID',
      },
      node_id: {
        type: 'string',
        description: 'Release node ID',
      },
      tag_name: {
        type: 'string',
        description: 'Git tag name for the release',
      },
      target_commitish: {
        type: 'string',
        description: 'Target branch or commit SHA',
      },
      name: {
        type: 'string',
        description: 'Release name/title',
      },
      body: {
        type: 'string',
        description: 'Release description/notes in markdown format',
      },
      draft: {
        type: 'boolean',
        description: 'Whether the release is a draft',
      },
      prerelease: {
        type: 'boolean',
        description: 'Whether the release is a pre-release',
      },
      created_at: {
        type: 'string',
        description: 'Release creation timestamp',
      },
      published_at: {
        type: 'string',
        description: 'Release publication timestamp',
      },
      url: {
        type: 'string',
        description: 'Release API URL',
      },
      html_url: {
        type: 'string',
        description: 'Release HTML URL',
      },
      assets_url: {
        type: 'string',
        description: 'Release assets API URL',
      },
      upload_url: {
        type: 'string',
        description: 'URL for uploading release assets',
      },
      tarball_url: {
        type: 'string',
        description: 'Source code tarball download URL',
      },
      zipball_url: {
        type: 'string',
        description: 'Source code zipball download URL',
      },
      discussion_url: {
        type: 'string',
        description: 'Discussion URL if available',
      },
      author: {
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
        gravatar_id: {
          type: 'string',
          description: 'Gravatar ID',
        },
        url: {
          type: 'string',
          description: 'User API URL',
        },
        html_url: {
          type: 'string',
          description: 'Profile URL',
        },
        followers_url: {
          type: 'string',
          description: 'Followers API URL',
        },
        following_url: {
          type: 'string',
          description: 'Following API URL',
        },
        gists_url: {
          type: 'string',
          description: 'Gists API URL',
        },
        starred_url: {
          type: 'string',
          description: 'Starred repositories API URL',
        },
        subscriptions_url: {
          type: 'string',
          description: 'Subscriptions API URL',
        },
        organizations_url: {
          type: 'string',
          description: 'Organizations API URL',
        },
        repos_url: {
          type: 'string',
          description: 'Repositories API URL',
        },
        events_url: {
          type: 'string',
          description: 'Events API URL',
        },
        received_events_url: {
          type: 'string',
          description: 'Received events API URL',
        },
        user_type: {
          type: 'string',
          description: 'User type (User, Bot, Organization)',
        },
        site_admin: {
          type: 'boolean',
          description: 'Whether user is a site administrator',
        },
      },
      assets: {
        type: 'array',
        description: 'Array of release asset objects with download URLs',
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
      fork: {
        type: 'boolean',
        description: 'Whether the repository is a fork',
      },
      url: {
        type: 'string',
        description: 'Repository API URL',
      },
      archive_url: {
        type: 'string',
        description: 'Archive API URL',
      },
      assignees_url: {
        type: 'string',
        description: 'Assignees API URL',
      },
      blobs_url: {
        type: 'string',
        description: 'Blobs API URL',
      },
      branches_url: {
        type: 'string',
        description: 'Branches API URL',
      },
      collaborators_url: {
        type: 'string',
        description: 'Collaborators API URL',
      },
      comments_url: {
        type: 'string',
        description: 'Comments API URL',
      },
      commits_url: {
        type: 'string',
        description: 'Commits API URL',
      },
      compare_url: {
        type: 'string',
        description: 'Compare API URL',
      },
      contents_url: {
        type: 'string',
        description: 'Contents API URL',
      },
      contributors_url: {
        type: 'string',
        description: 'Contributors API URL',
      },
      deployments_url: {
        type: 'string',
        description: 'Deployments API URL',
      },
      downloads_url: {
        type: 'string',
        description: 'Downloads API URL',
      },
      events_url: {
        type: 'string',
        description: 'Events API URL',
      },
      forks_url: {
        type: 'string',
        description: 'Forks API URL',
      },
      git_commits_url: {
        type: 'string',
        description: 'Git commits API URL',
      },
      git_refs_url: {
        type: 'string',
        description: 'Git refs API URL',
      },
      git_tags_url: {
        type: 'string',
        description: 'Git tags API URL',
      },
      hooks_url: {
        type: 'string',
        description: 'Hooks API URL',
      },
      issue_comment_url: {
        type: 'string',
        description: 'Issue comment API URL',
      },
      issue_events_url: {
        type: 'string',
        description: 'Issue events API URL',
      },
      issues_url: {
        type: 'string',
        description: 'Issues API URL',
      },
      keys_url: {
        type: 'string',
        description: 'Keys API URL',
      },
      labels_url: {
        type: 'string',
        description: 'Labels API URL',
      },
      languages_url: {
        type: 'string',
        description: 'Languages API URL',
      },
      merges_url: {
        type: 'string',
        description: 'Merges API URL',
      },
      milestones_url: {
        type: 'string',
        description: 'Milestones API URL',
      },
      notifications_url: {
        type: 'string',
        description: 'Notifications API URL',
      },
      pulls_url: {
        type: 'string',
        description: 'Pull requests API URL',
      },
      releases_url: {
        type: 'string',
        description: 'Releases API URL',
      },
      stargazers_url: {
        type: 'string',
        description: 'Stargazers API URL',
      },
      statuses_url: {
        type: 'string',
        description: 'Statuses API URL',
      },
      subscribers_url: {
        type: 'string',
        description: 'Subscribers API URL',
      },
      subscription_url: {
        type: 'string',
        description: 'Subscription API URL',
      },
      tags_url: {
        type: 'string',
        description: 'Tags API URL',
      },
      teams_url: {
        type: 'string',
        description: 'Teams API URL',
      },
      trees_url: {
        type: 'string',
        description: 'Trees API URL',
      },
      homepage: {
        type: 'string',
        description: 'Repository homepage URL',
      },
      size: {
        type: 'number',
        description: 'Repository size in KB',
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
      has_issues: {
        type: 'boolean',
        description: 'Whether issues are enabled',
      },
      has_projects: {
        type: 'boolean',
        description: 'Whether projects are enabled',
      },
      has_downloads: {
        type: 'boolean',
        description: 'Whether downloads are enabled',
      },
      has_wiki: {
        type: 'boolean',
        description: 'Whether wiki is enabled',
      },
      has_pages: {
        type: 'boolean',
        description: 'Whether GitHub Pages is enabled',
      },
      forks_count: {
        type: 'number',
        description: 'Number of forks',
      },
      mirror_url: {
        type: 'string',
        description: 'Mirror URL if repository is a mirror',
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
      license: {
        key: {
          type: 'string',
          description: 'License key',
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
          description: 'License API URL',
        },
        node_id: {
          type: 'string',
          description: 'License node ID',
        },
      },
      allow_forking: {
        type: 'boolean',
        description: 'Whether forking is allowed',
      },
      is_template: {
        type: 'boolean',
        description: 'Whether repository is a template',
      },
      topics: {
        type: 'array',
        description: 'Array of repository topics',
      },
      visibility: {
        type: 'string',
        description: 'Repository visibility (public, private, internal)',
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
      created_at: {
        type: 'string',
        description: 'Repository creation timestamp',
      },
      updated_at: {
        type: 'string',
        description: 'Repository last update timestamp',
      },
      pushed_at: {
        type: 'string',
        description: 'Repository last push timestamp',
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
        followers_url: {
          type: 'string',
          description: 'Followers API URL',
        },
        following_url: {
          type: 'string',
          description: 'Following API URL',
        },
        gists_url: {
          type: 'string',
          description: 'Gists API URL',
        },
        starred_url: {
          type: 'string',
          description: 'Starred repositories API URL',
        },
        subscriptions_url: {
          type: 'string',
          description: 'Subscriptions API URL',
        },
        organizations_url: {
          type: 'string',
          description: 'Organizations API URL',
        },
        repos_url: {
          type: 'string',
          description: 'Repositories API URL',
        },
        events_url: {
          type: 'string',
          description: 'Events API URL',
        },
        received_events_url: {
          type: 'string',
          description: 'Received events API URL',
        },
        owner_type: {
          type: 'string',
          description: 'Owner type (User, Organization)',
        },
        site_admin: {
          type: 'boolean',
          description: 'Whether owner is a site administrator',
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
      gravatar_id: {
        type: 'string',
        description: 'Gravatar ID',
      },
      url: {
        type: 'string',
        description: 'User API URL',
      },
      html_url: {
        type: 'string',
        description: 'Profile URL',
      },
      followers_url: {
        type: 'string',
        description: 'Followers API URL',
      },
      following_url: {
        type: 'string',
        description: 'Following API URL',
      },
      gists_url: {
        type: 'string',
        description: 'Gists API URL',
      },
      starred_url: {
        type: 'string',
        description: 'Starred repositories API URL',
      },
      subscriptions_url: {
        type: 'string',
        description: 'Subscriptions API URL',
      },
      organizations_url: {
        type: 'string',
        description: 'Organizations API URL',
      },
      repos_url: {
        type: 'string',
        description: 'Repositories API URL',
      },
      events_url: {
        type: 'string',
        description: 'Events API URL',
      },
      received_events_url: {
        type: 'string',
        description: 'Received events API URL',
      },
      user_type: {
        type: 'string',
        description: 'User type (User, Bot, Organization)',
      },
      site_admin: {
        type: 'boolean',
        description: 'Whether user is a site administrator',
      },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-GitHub-Event': 'release',
      'X-GitHub-Delivery': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'X-Hub-Signature-256': 'sha256=...',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/triggers/github/utils.ts

```typescript
/**
 * Shared repository output schema
 */
export const repositoryOutputs = {
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
  description: {
    type: 'string',
    description: 'Repository description',
  },
  fork: {
    type: 'boolean',
    description: 'Whether the repository is a fork',
  },
  url: {
    type: 'string',
    description: 'Repository API URL',
  },
  homepage: {
    type: 'string',
    description: 'Repository homepage URL',
  },
  size: {
    type: 'number',
    description: 'Repository size in KB',
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
  open_issues_count: {
    type: 'number',
    description: 'Number of open issues',
  },
  default_branch: {
    type: 'string',
    description: 'Default branch name',
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
    avatar_url: {
      type: 'string',
      description: 'Owner avatar URL',
    },
    html_url: {
      type: 'string',
      description: 'Owner profile URL',
    },
  },
} as const

/**
 * Shared sender/user output schema
 */
export const userOutputs = {
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
} as const

/**
 * Check if a GitHub event matches the expected trigger configuration
 * This is used for event filtering in the webhook processor
 */
export function isGitHubEventMatch(
  triggerId: string,
  eventType: string,
  action?: string,
  payload?: any
): boolean {
  const eventMap: Record<
    string,
    { event: string; actions?: string[]; validator?: (payload: any) => boolean }
  > = {
    github_issue_opened: { event: 'issues', actions: ['opened'] },
    github_issue_closed: { event: 'issues', actions: ['closed'] },
    github_issue_comment: {
      event: 'issue_comment',
      validator: (p) => !p.issue?.pull_request, // Only issues, not PRs
    },
    github_pr_opened: { event: 'pull_request', actions: ['opened'] },
    github_pr_closed: {
      event: 'pull_request',
      actions: ['closed'],
      validator: (p) => p.pull_request?.merged === false, // Not merged
    },
    github_pr_merged: {
      event: 'pull_request',
      actions: ['closed'],
      validator: (p) => p.pull_request?.merged === true, // Merged
    },
    github_pr_comment: {
      event: 'issue_comment',
      validator: (p) => !!p.issue?.pull_request, // Only PRs, not issues
    },
    github_pr_reviewed: { event: 'pull_request_review', actions: ['submitted'] },
    github_push: { event: 'push' },
    github_release_published: { event: 'release', actions: ['published'] },
  }

  const config = eventMap[triggerId]
  if (!config) {
    return true // Unknown trigger, allow through
  }

  // Check event type
  if (config.event !== eventType) {
    return false
  }

  // Check action if specified
  if (config.actions && action && !config.actions.includes(action)) {
    return false
  }

  // Run custom validator if provided
  if (config.validator && payload) {
    return config.validator(payload)
  }

  return true
}
```

--------------------------------------------------------------------------------

````
