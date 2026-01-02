---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 671
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 671 of 933)

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

---[FILE: create_pr.ts]---
Location: sim-main/apps/sim/tools/github/create_pr.ts

```typescript
import type { CreatePRParams, PRResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createPRTool: ToolConfig<CreatePRParams, PRResponse> = {
  id: 'github_create_pr',
  name: 'GitHub Create Pull Request',
  description: 'Create a new pull request in a GitHub repository',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Pull request title',
    },
    head: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the branch where your changes are implemented',
    },
    base: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the branch you want the changes pulled into',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Pull request description (Markdown)',
    },
    draft: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Create as draft pull request',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => `https://api.github.com/repos/${params.owner}/${params.repo}/pulls`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => ({
      title: params.title,
      head: params.head,
      base: params.base,
      body: params.body,
      draft: params.draft,
    }),
  },

  transformResponse: async (response) => {
    const pr = await response.json()

    const content = `PR #${pr.number} created: "${pr.title}" (${pr.state}${pr.draft ? ', draft' : ''})
From: ${pr.head.ref} → To: ${pr.base.ref}
URL: ${pr.html_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          number: pr.number,
          title: pr.title,
          state: pr.state,
          html_url: pr.html_url,
          merged: pr.merged,
          draft: pr.draft,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable PR creation confirmation' },
    metadata: {
      type: 'object',
      description: 'Pull request metadata',
      properties: {
        number: { type: 'number', description: 'Pull request number' },
        title: { type: 'string', description: 'PR title' },
        state: { type: 'string', description: 'PR state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        merged: { type: 'boolean', description: 'Whether PR is merged' },
        draft: { type: 'boolean', description: 'Whether PR is draft' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_project.ts]---
Location: sim-main/apps/sim/tools/github/create_project.ts

```typescript
import type { CreateProjectParams, ProjectResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createProjectTool: ToolConfig<CreateProjectParams, ProjectResponse> = {
  id: 'github_create_project',
  name: 'GitHub Create Project',
  description:
    'Create a new GitHub Project V2. Requires the owner Node ID (not login name). Returns the created project with ID, title, and URL.',
  version: '1.0.0',

  params: {
    owner_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'Owner Node ID (format: PVT_... or MDQ6...). Use GitHub GraphQL API to get this ID from organization or user login.',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project title',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token with project write permissions',
    },
  },

  request: {
    url: 'https://api.github.com/graphql',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const query = `
        mutation($ownerId: ID!, $title: String!) {
          createProjectV2(input: {
            ownerId: $ownerId
            title: $title
          }) {
            projectV2 {
              id
              title
              number
              url
              closed
              public
              shortDescription
            }
          }
        }
      `
      return {
        query,
        variables: {
          ownerId: params.owner_id,
          title: params.title,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        output: {
          content: `GraphQL Error: ${data.errors[0].message}`,
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: data.errors[0].message,
      }
    }

    const project = data.data?.createProjectV2?.projectV2
    if (!project) {
      return {
        success: false,
        output: {
          content: 'Failed to create project',
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: 'Failed to create project',
      }
    }

    let content = `Project created successfully!\n`
    content += `Title: ${project.title}\n`
    content += `ID: ${project.id}\n`
    content += `Number: ${project.number}\n`
    content += `URL: ${project.url}\n`
    content += `Status: ${project.closed ? 'Closed' : 'Open'}\n`
    content += `Visibility: ${project.public ? 'Public' : 'Private'}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: project.id,
          title: project.title,
          number: project.number,
          url: project.url,
          closed: project.closed,
          public: project.public,
          shortDescription: project.shortDescription || '',
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable confirmation message' },
    metadata: {
      type: 'object',
      description: 'Created project metadata',
      properties: {
        id: { type: 'string', description: 'Project node ID' },
        title: { type: 'string', description: 'Project title' },
        number: { type: 'number', description: 'Project number', optional: true },
        url: { type: 'string', description: 'Project URL' },
        closed: { type: 'boolean', description: 'Whether project is closed', optional: true },
        public: { type: 'boolean', description: 'Whether project is public', optional: true },
        shortDescription: {
          type: 'string',
          description: 'Project short description',
          optional: true,
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_release.ts]---
Location: sim-main/apps/sim/tools/github/create_release.ts

```typescript
import type { CreateReleaseParams, ReleaseResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const createReleaseTool: ToolConfig<CreateReleaseParams, ReleaseResponse> = {
  id: 'github_create_release',
  name: 'GitHub Create Release',
  description:
    'Create a new release for a GitHub repository. Specify tag name, target commit, title, description, and whether it should be a draft or prerelease.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    tag_name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the tag for this release',
    },
    target_commitish: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Specifies the commitish value that determines where the Git tag is created from. Can be any branch or commit SHA. Defaults to the repository default branch.',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The name of the release',
    },
    body: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Text describing the contents of the release (markdown supported)',
    },
    draft: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'true to create a draft (unpublished) release, false to create a published one',
      default: false,
    },
    prerelease: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description:
        'true to identify the release as a prerelease, false to identify as a full release',
      default: false,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => `https://api.github.com/repos/${params.owner}/${params.repo}/releases`,
    method: 'POST',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: any = {
        tag_name: params.tag_name,
      }

      if (params.target_commitish) {
        body.target_commitish = params.target_commitish
      }
      if (params.name) {
        body.name = params.name
      }
      if (params.body) {
        body.body = params.body
      }
      if (params.draft !== undefined) {
        body.draft = params.draft
      }
      if (params.prerelease !== undefined) {
        body.prerelease = params.prerelease
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const releaseType = data.draft ? 'Draft' : data.prerelease ? 'Prerelease' : 'Release'
    const content = `${releaseType} created: "${data.name || data.tag_name}"
Tag: ${data.tag_name}
URL: ${data.html_url}
Created: ${data.created_at}
${data.published_at ? `Published: ${data.published_at}` : 'Not yet published'}
Download URLs:
- Tarball: ${data.tarball_url}
- Zipball: ${data.zipball_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          tag_name: data.tag_name,
          name: data.name || data.tag_name,
          html_url: data.html_url,
          tarball_url: data.tarball_url,
          zipball_url: data.zipball_url,
          draft: data.draft,
          prerelease: data.prerelease,
          created_at: data.created_at,
          published_at: data.published_at,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable release creation summary' },
    metadata: {
      type: 'object',
      description: 'Release metadata including download URLs',
      properties: {
        id: { type: 'number', description: 'Release ID' },
        tag_name: { type: 'string', description: 'Git tag name' },
        name: { type: 'string', description: 'Release name' },
        html_url: { type: 'string', description: 'GitHub web URL for the release' },
        tarball_url: { type: 'string', description: 'URL to download release as tarball' },
        zipball_url: { type: 'string', description: 'URL to download release as zipball' },
        draft: { type: 'boolean', description: 'Whether this is a draft release' },
        prerelease: { type: 'boolean', description: 'Whether this is a prerelease' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        published_at: { type: 'string', description: 'Publication timestamp' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_branch.ts]---
Location: sim-main/apps/sim/tools/github/delete_branch.ts

```typescript
import type { DeleteBranchParams, DeleteBranchResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const deleteBranchTool: ToolConfig<DeleteBranchParams, DeleteBranchResponse> = {
  id: 'github_delete_branch',
  name: 'GitHub Delete Branch',
  description:
    'Delete a branch from a GitHub repository by removing its git reference. Protected branches cannot be deleted.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    branch: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the branch to delete',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/git/refs/heads/${params.branch}`,
    method: 'DELETE',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response, params) => {
    if (!params) {
      return {
        success: false,
        error: 'Missing parameters',
        output: {
          content: '',
          metadata: {
            deleted: false,
            branch: '',
          },
        },
      }
    }

    const content = `Branch "${params.branch}" has been successfully deleted from ${params.owner}/${params.repo}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          deleted: true,
          branch: params.branch,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable deletion confirmation' },
    metadata: {
      type: 'object',
      description: 'Deletion metadata',
      properties: {
        deleted: { type: 'boolean', description: 'Whether the branch was deleted' },
        branch: { type: 'string', description: 'Name of the deleted branch' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_comment.ts]---
Location: sim-main/apps/sim/tools/github/delete_comment.ts

```typescript
import type { DeleteCommentParams, DeleteCommentResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const deleteCommentTool: ToolConfig<DeleteCommentParams, DeleteCommentResponse> = {
  id: 'github_delete_comment',
  name: 'GitHub Comment Deleter',
  description: 'Delete a comment on a GitHub issue or pull request',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    comment_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Comment ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/comments/${params.comment_id}`,
    method: 'DELETE',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const content = `Comment #${response.url.split('/').pop()} successfully deleted`

    return {
      success: true,
      output: {
        content,
        metadata: {
          deleted: true,
          comment_id: Number(response.url.split('/').pop()),
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable deletion confirmation' },
    metadata: {
      type: 'object',
      description: 'Deletion result metadata',
      properties: {
        deleted: { type: 'boolean', description: 'Whether deletion was successful' },
        comment_id: { type: 'number', description: 'Deleted comment ID' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_file.ts]---
Location: sim-main/apps/sim/tools/github/delete_file.ts

```typescript
import type { DeleteFileParams, DeleteFileResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const deleteFileTool: ToolConfig<DeleteFileParams, DeleteFileResponse> = {
  id: 'github_delete_file',
  name: 'GitHub Delete File',
  description:
    'Delete a file from a GitHub repository. Requires the file SHA. This operation cannot be undone through the API.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    path: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Path to the file to delete (e.g., "src/oldfile.ts")',
    },
    message: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Commit message for this file deletion',
    },
    sha: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The blob SHA of the file being deleted (get from github_get_file_content)',
    },
    branch: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch to delete the file from (defaults to repository default branch)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`,
    method: 'DELETE',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
    body: (params) => {
      const body: Record<string, any> = {
        message: params.message,
        sha: params.sha, // Required for delete
      }

      if (params.branch) {
        body.branch = params.branch
      }

      return body
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    const content = `File deleted successfully!

Path: ${data.commit.sha ? 'File removed from repository' : 'Unknown'}
Deleted: Yes

Commit:
- SHA: ${data.commit.sha}
- Message: ${data.commit.message || 'N/A'}
- Author: ${data.commit.author?.name || 'N/A'}
- Date: ${data.commit.author?.date || 'N/A'}

View commit: ${data.commit.html_url || 'N/A'}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          deleted: true,
          path: data.commit.tree?.sha || 'N/A',
          commit: {
            sha: data.commit.sha,
            message: data.commit.message || '',
            author: {
              name: data.commit.author?.name || '',
              email: data.commit.author?.email || '',
              date: data.commit.author?.date || '',
            },
            committer: {
              name: data.commit.committer?.name || '',
              email: data.commit.committer?.email || '',
              date: data.commit.committer?.date || '',
            },
            html_url: data.commit.html_url || '',
          },
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable file deletion confirmation' },
    metadata: {
      type: 'object',
      description: 'Deletion confirmation and commit metadata',
      properties: {
        deleted: { type: 'boolean', description: 'Whether the file was deleted' },
        path: { type: 'string', description: 'File path that was deleted' },
        commit: {
          type: 'object',
          description: 'Commit information',
          properties: {
            sha: { type: 'string', description: 'Commit SHA' },
            message: { type: 'string', description: 'Commit message' },
            author: {
              type: 'object',
              description: 'Author information',
            },
            committer: {
              type: 'object',
              description: 'Committer information',
            },
            html_url: { type: 'string', description: 'Commit URL' },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_project.ts]---
Location: sim-main/apps/sim/tools/github/delete_project.ts

```typescript
import type { DeleteProjectParams, ProjectResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const deleteProjectTool: ToolConfig<DeleteProjectParams, ProjectResponse> = {
  id: 'github_delete_project',
  name: 'GitHub Delete Project',
  description:
    'Delete a GitHub Project V2. This action is permanent and cannot be undone. Requires the project Node ID.',
  version: '1.0.0',

  params: {
    project_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project Node ID (format: PVT_...)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token with project admin permissions',
    },
  },

  request: {
    url: 'https://api.github.com/graphql',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const query = `
        mutation($projectId: ID!) {
          deleteProjectV2(input: {
            projectId: $projectId
          }) {
            projectV2 {
              id
              title
              number
              url
            }
          }
        }
      `
      return {
        query,
        variables: {
          projectId: params.project_id,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        output: {
          content: `GraphQL Error: ${data.errors[0].message}`,
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: data.errors[0].message,
      }
    }

    // Extract project data
    const project = data.data?.deleteProjectV2?.projectV2
    if (!project) {
      return {
        success: false,
        output: {
          content: 'Failed to delete project',
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: 'Failed to delete project',
      }
    }

    // Create human-readable content
    let content = `Project deleted successfully!\n`
    content += `Title: ${project.title}\n`
    content += `ID: ${project.id}\n`
    if (project.number) {
      content += `Number: ${project.number}\n`
    }
    content += `URL: ${project.url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: project.id,
          title: project.title,
          number: project.number,
          url: project.url,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable confirmation message' },
    metadata: {
      type: 'object',
      description: 'Deleted project metadata',
      properties: {
        id: { type: 'string', description: 'Project node ID' },
        title: { type: 'string', description: 'Project title' },
        number: { type: 'number', description: 'Project number', optional: true },
        url: { type: 'string', description: 'Project URL' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_release.ts]---
Location: sim-main/apps/sim/tools/github/delete_release.ts

```typescript
import type { DeleteReleaseParams, DeleteReleaseResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const deleteReleaseTool: ToolConfig<DeleteReleaseParams, DeleteReleaseResponse> = {
  id: 'github_delete_release',
  name: 'GitHub Delete Release',
  description:
    'Delete a GitHub release by ID. This permanently removes the release but does not delete the associated Git tag.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    release_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'The unique identifier of the release to delete',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/releases/${params.release_id}`,
    method: 'DELETE',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response, params) => {
    if (!params) {
      return {
        success: false,
        error: 'Missing parameters',
        output: {
          content: '',
          metadata: {
            deleted: false,
            release_id: 0,
          },
        },
      }
    }

    if (response.status === 204) {
      const content = `Release deleted successfully
Release ID: ${params.release_id}
Repository: ${params.owner}/${params.repo}

Note: The associated Git tag has not been deleted and remains in the repository.`

      return {
        success: true,
        output: {
          content,
          metadata: {
            deleted: true,
            release_id: params.release_id,
          },
        },
      }
    }

    const data = await response.text()
    throw new Error(`Unexpected response: ${response.status} - ${data}`)
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable deletion confirmation' },
    metadata: {
      type: 'object',
      description: 'Deletion result metadata',
      properties: {
        deleted: { type: 'boolean', description: 'Whether the release was successfully deleted' },
        release_id: { type: 'number', description: 'ID of the deleted release' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_branch.ts]---
Location: sim-main/apps/sim/tools/github/get_branch.ts

```typescript
import type { BranchResponse, GetBranchParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getBranchTool: ToolConfig<GetBranchParams, BranchResponse> = {
  id: 'github_get_branch',
  name: 'GitHub Get Branch',
  description:
    'Get detailed information about a specific branch in a GitHub repository, including commit details and protection status.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    branch: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Branch name',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/branches/${params.branch}`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const branch = await response.json()

    const content = `Branch: ${branch.name}
Commit SHA: ${branch.commit.sha}
Commit URL: ${branch.commit.url}
Protected: ${branch.protected ? 'Yes' : 'No'}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          name: branch.name,
          commit: {
            sha: branch.commit.sha,
            url: branch.commit.url,
          },
          protected: branch.protected,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable branch details' },
    metadata: {
      type: 'object',
      description: 'Branch metadata',
      properties: {
        name: { type: 'string', description: 'Branch name' },
        commit: {
          type: 'object',
          description: 'Commit information',
          properties: {
            sha: { type: 'string', description: 'Commit SHA' },
            url: { type: 'string', description: 'Commit API URL' },
          },
        },
        protected: { type: 'boolean', description: 'Whether branch is protected' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_branch_protection.ts]---
Location: sim-main/apps/sim/tools/github/get_branch_protection.ts

```typescript
import type { BranchProtectionResponse, GetBranchProtectionParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getBranchProtectionTool: ToolConfig<
  GetBranchProtectionParams,
  BranchProtectionResponse
> = {
  id: 'github_get_branch_protection',
  name: 'GitHub Get Branch Protection',
  description:
    'Get the branch protection rules for a specific branch, including status checks, review requirements, and restrictions.',
  version: '1.0.0',

  params: {
    owner: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository owner (user or organization)',
    },
    repo: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Repository name',
    },
    branch: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Branch name',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) =>
      `https://api.github.com/repos/${params.owner}/${params.repo}/branches/${params.branch}/protection`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const protection = await response.json()

    let content = `Branch Protection for "${protection.url.split('/branches/')[1].split('/protection')[0]}":

Enforce Admins: ${protection.enforce_admins?.enabled ? 'Yes' : 'No'}`

    if (protection.required_status_checks) {
      content += `\n\nRequired Status Checks:
- Strict: ${protection.required_status_checks.strict}
- Contexts: ${protection.required_status_checks.contexts.length > 0 ? protection.required_status_checks.contexts.join(', ') : 'None'}`
    } else {
      content += '\n\nRequired Status Checks: None'
    }

    if (protection.required_pull_request_reviews) {
      content += `\n\nRequired Pull Request Reviews:
- Required Approving Reviews: ${protection.required_pull_request_reviews.required_approving_review_count || 0}
- Dismiss Stale Reviews: ${protection.required_pull_request_reviews.dismiss_stale_reviews ? 'Yes' : 'No'}
- Require Code Owner Reviews: ${protection.required_pull_request_reviews.require_code_owner_reviews ? 'Yes' : 'No'}`
    } else {
      content += '\n\nRequired Pull Request Reviews: None'
    }

    if (protection.restrictions) {
      const users = protection.restrictions.users?.map((u: any) => u.login) || []
      const teams = protection.restrictions.teams?.map((t: any) => t.slug) || []
      content += `\n\nRestrictions:
- Users: ${users.length > 0 ? users.join(', ') : 'None'}
- Teams: ${teams.length > 0 ? teams.join(', ') : 'None'}`
    } else {
      content += '\n\nRestrictions: None'
    }

    return {
      success: true,
      output: {
        content,
        metadata: {
          required_status_checks: protection.required_status_checks
            ? {
                strict: protection.required_status_checks.strict,
                contexts: protection.required_status_checks.contexts,
              }
            : null,
          enforce_admins: {
            enabled: protection.enforce_admins?.enabled || false,
          },
          required_pull_request_reviews: protection.required_pull_request_reviews
            ? {
                required_approving_review_count:
                  protection.required_pull_request_reviews.required_approving_review_count || 0,
                dismiss_stale_reviews:
                  protection.required_pull_request_reviews.dismiss_stale_reviews || false,
                require_code_owner_reviews:
                  protection.required_pull_request_reviews.require_code_owner_reviews || false,
              }
            : null,
          restrictions: protection.restrictions
            ? {
                users: protection.restrictions.users?.map((u: any) => u.login) || [],
                teams: protection.restrictions.teams?.map((t: any) => t.slug) || [],
              }
            : null,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable branch protection summary' },
    metadata: {
      type: 'object',
      description: 'Branch protection configuration',
      properties: {
        required_status_checks: {
          type: 'object',
          description: 'Status check requirements (null if not configured)',
          properties: {
            strict: { type: 'boolean', description: 'Require branches to be up to date' },
            contexts: {
              type: 'array',
              description: 'Required status check contexts',
              items: { type: 'string' },
            },
          },
        },
        enforce_admins: {
          type: 'object',
          description: 'Admin enforcement settings',
          properties: {
            enabled: { type: 'boolean', description: 'Enforce for administrators' },
          },
        },
        required_pull_request_reviews: {
          type: 'object',
          description: 'Pull request review requirements (null if not configured)',
          properties: {
            required_approving_review_count: {
              type: 'number',
              description: 'Number of approving reviews required',
            },
            dismiss_stale_reviews: {
              type: 'boolean',
              description: 'Dismiss stale pull request approvals',
            },
            require_code_owner_reviews: {
              type: 'boolean',
              description: 'Require review from code owners',
            },
          },
        },
        restrictions: {
          type: 'object',
          description: 'Push restrictions (null if not configured)',
          properties: {
            users: {
              type: 'array',
              description: 'Users who can push',
              items: { type: 'string' },
            },
            teams: {
              type: 'array',
              description: 'Teams who can push',
              items: { type: 'string' },
            },
          },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
