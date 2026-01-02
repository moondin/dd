---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 672
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 672 of 933)

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

---[FILE: get_file_content.ts]---
Location: sim-main/apps/sim/tools/github/get_file_content.ts

```typescript
import type { FileContentResponse, GetFileContentParams } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getFileContentTool: ToolConfig<GetFileContentParams, FileContentResponse> = {
  id: 'github_get_file_content',
  name: 'GitHub Get File Content',
  description:
    'Get the content of a file from a GitHub repository. Supports files up to 1MB. Content is returned decoded and human-readable.',
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
      description: 'Path to the file in the repository (e.g., "src/index.ts")',
    },
    ref: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch name, tag, or commit SHA (defaults to repository default branch)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => {
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${params.path}`
      return params.ref ? `${baseUrl}?ref=${params.ref}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (Array.isArray(data)) {
      return {
        success: false,
        error: 'Path points to a directory. Use github_get_tree to list directory contents.',
        output: {
          content: '',
          metadata: {
            name: '',
            path: '',
            sha: '',
            size: 0,
            type: 'dir',
            download_url: '',
            html_url: '',
          },
        },
      }
    }

    let decodedContent = ''
    if (data.content) {
      try {
        decodedContent = Buffer.from(data.content, 'base64').toString('utf-8')
      } catch (error) {
        decodedContent = '[Binary file - content cannot be displayed as text]'
      }
    }

    const contentPreview =
      decodedContent.length > 500
        ? `${decodedContent.substring(0, 500)}...\n\n[Content truncated. Full content available in metadata]`
        : decodedContent

    const content = `File: ${data.name}
Path: ${data.path}
Size: ${data.size} bytes
Type: ${data.type}
SHA: ${data.sha}

Content Preview:
${contentPreview}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          name: data.name,
          path: data.path,
          sha: data.sha,
          size: data.size,
          type: data.type,
          download_url: data.download_url,
          html_url: data.html_url,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Human-readable file information with content preview',
    },
    metadata: {
      type: 'object',
      description: 'File metadata including name, path, SHA, size, and URLs',
      properties: {
        name: { type: 'string', description: 'File name' },
        path: { type: 'string', description: 'Full path in repository' },
        sha: { type: 'string', description: 'Git blob SHA' },
        size: { type: 'number', description: 'File size in bytes' },
        type: { type: 'string', description: 'Content type (file or dir)' },
        download_url: { type: 'string', description: 'Direct download URL', optional: true },
        html_url: { type: 'string', description: 'GitHub web UI URL', optional: true },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_issue.ts]---
Location: sim-main/apps/sim/tools/github/get_issue.ts

```typescript
import type { GetIssueParams, IssueResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getIssueTool: ToolConfig<GetIssueParams, IssueResponse> = {
  id: 'github_get_issue',
  name: 'GitHub Get Issue',
  description: 'Get detailed information about a specific issue in a GitHub repository',
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
    issue_number: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Issue number',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/issues/${params.issue_number}`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const issue = await response.json()

    const labels = issue.labels?.map((label: any) => label.name) || []

    const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []

    const content = `Issue #${issue.number}: "${issue.title}"
State: ${issue.state}
Created: ${issue.created_at}
Updated: ${issue.updated_at}
${issue.closed_at ? `Closed: ${issue.closed_at}` : ''}
URL: ${issue.html_url}
${labels.length > 0 ? `Labels: ${labels.join(', ')}` : 'No labels'}
${assignees.length > 0 ? `Assignees: ${assignees.join(', ')}` : 'No assignees'}

Description:
${issue.body || 'No description provided'}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          number: issue.number,
          title: issue.title,
          state: issue.state,
          html_url: issue.html_url,
          labels,
          assignees,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          closed_at: issue.closed_at,
          body: issue.body,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable issue details' },
    metadata: {
      type: 'object',
      description: 'Detailed issue metadata',
      properties: {
        number: { type: 'number', description: 'Issue number' },
        title: { type: 'string', description: 'Issue title' },
        state: { type: 'string', description: 'Issue state (open/closed)' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        labels: { type: 'array', description: 'Array of label names' },
        assignees: { type: 'array', description: 'Array of assignee usernames' },
        created_at: { type: 'string', description: 'Creation timestamp' },
        updated_at: { type: 'string', description: 'Last update timestamp' },
        closed_at: { type: 'string', description: 'Closed timestamp' },
        body: { type: 'string', description: 'Issue body/description' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_project.ts]---
Location: sim-main/apps/sim/tools/github/get_project.ts

```typescript
import type { GetProjectParams, ProjectResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getProjectTool: ToolConfig<GetProjectParams, ProjectResponse> = {
  id: 'github_get_project',
  name: 'GitHub Get Project',
  description:
    'Get detailed information about a specific GitHub Project V2 by its number. Returns project details including ID, title, description, URL, and status.',
  version: '1.0.0',

  params: {
    owner_type: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Owner type: "org" for organization or "user" for user',
    },
    owner_login: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Organization or user login name',
    },
    project_number: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project number',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token with project read permissions',
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
      const ownerType = params.owner_type === 'org' ? 'organization' : 'user'
      const query = `
        query($login: String!, $number: Int!) {
          ${ownerType}(login: $login) {
            projectV2(number: $number) {
              id
              title
              number
              url
              closed
              public
              shortDescription
              readme
              createdAt
              updatedAt
            }
          }
        }
      `
      return {
        query,
        variables: {
          login: params.owner_login,
          number: params.project_number,
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

    const ownerData = data.data?.organization || data.data?.user
    if (!ownerData || !ownerData.projectV2) {
      return {
        success: false,
        output: {
          content: 'Project not found',
          metadata: {
            id: '',
            title: '',
            url: '',
          },
        },
        error: 'Project not found',
      }
    }

    const project = ownerData.projectV2

    let content = `Project: ${project.title} (#${project.number})\n`
    content += `ID: ${project.id}\n`
    content += `URL: ${project.url}\n`
    content += `Status: ${project.closed ? 'Closed' : 'Open'}\n`
    content += `Visibility: ${project.public ? 'Public' : 'Private'}\n`
    if (project.shortDescription) {
      content += `Description: ${project.shortDescription}\n`
    }
    if (project.createdAt) {
      content += `Created: ${project.createdAt}\n`
    }
    if (project.updatedAt) {
      content += `Updated: ${project.updatedAt}\n`
    }

    return {
      success: true,
      output: {
        content: content.trim(),
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
    content: { type: 'string', description: 'Human-readable project details' },
    metadata: {
      type: 'object',
      description: 'Project metadata',
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

---[FILE: get_pr_files.ts]---
Location: sim-main/apps/sim/tools/github/get_pr_files.ts

```typescript
import type { GetPRFilesParams, PRFilesListResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getPRFilesTool: ToolConfig<GetPRFilesParams, PRFilesListResponse> = {
  id: 'github_get_pr_files',
  name: 'GitHub Get PR Files',
  description: 'Get the list of files changed in a pull request',
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
    pullNumber: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Pull request number',
    },
    per_page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Results per page (max 100)',
      default: 30,
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Page number',
      default: 1,
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub API token',
    },
  },

  request: {
    url: (params) => {
      const url = new URL(
        `https://api.github.com/repos/${params.owner}/${params.repo}/pulls/${params.pullNumber}/files`
      )
      if (params.per_page) url.searchParams.append('per_page', Number(params.per_page).toString())
      if (params.page) url.searchParams.append('page', Number(params.page).toString())
      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const files = await response.json()

    const totalAdditions = files.reduce((sum: number, file: any) => sum + file.additions, 0)
    const totalDeletions = files.reduce((sum: number, file: any) => sum + file.deletions, 0)
    const totalChanges = files.reduce((sum: number, file: any) => sum + file.changes, 0)

    const content = `Found ${files.length} file(s) changed in PR
Total additions: ${totalAdditions}, Total deletions: ${totalDeletions}, Total changes: ${totalChanges}

Files:
${files
  .map(
    (file: any) =>
      `- ${file.filename} (${file.status})
  +${file.additions} -${file.deletions} (~${file.changes} changes)`
  )
  .join('\n')}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          files: files.map((file: any) => ({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            patch: file.patch,
            blob_url: file.blob_url,
            raw_url: file.raw_url,
          })),
          total_count: files.length,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable list of files changed in PR' },
    metadata: {
      type: 'object',
      description: 'PR files metadata',
      properties: {
        files: {
          type: 'array',
          description: 'Array of file changes',
          items: {
            type: 'object',
            properties: {
              filename: { type: 'string', description: 'File path' },
              status: {
                type: 'string',
                description: 'Change type (added/modified/deleted/renamed)',
              },
              additions: { type: 'number', description: 'Lines added' },
              deletions: { type: 'number', description: 'Lines deleted' },
              changes: { type: 'number', description: 'Total changes' },
              patch: { type: 'string', description: 'File diff patch' },
              blob_url: { type: 'string', description: 'GitHub blob URL' },
              raw_url: { type: 'string', description: 'Raw file URL' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of files changed' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_release.ts]---
Location: sim-main/apps/sim/tools/github/get_release.ts

```typescript
import type { GetReleaseParams, ReleaseResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getReleaseTool: ToolConfig<GetReleaseParams, ReleaseResponse> = {
  id: 'github_get_release',
  name: 'GitHub Get Release',
  description:
    'Get detailed information about a specific GitHub release by ID. Returns release metadata including assets and download URLs.',
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
      description: 'The unique identifier of the release',
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
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const releaseType = data.draft ? 'Draft' : data.prerelease ? 'Prerelease' : 'Release'
    const assetsInfo =
      data.assets && data.assets.length > 0
        ? `\n\nAssets (${data.assets.length}):\n${data.assets.map((asset: any) => `- ${asset.name} (${asset.size} bytes, downloaded ${asset.download_count} times)`).join('\n')}`
        : '\n\nNo assets attached'

    const content = `${releaseType}: "${data.name || data.tag_name}"
Tag: ${data.tag_name}
Author: ${data.author?.login || 'Unknown'}
Created: ${data.created_at}
${data.published_at ? `Published: ${data.published_at}` : 'Not yet published'}
URL: ${data.html_url}

Description:
${data.body || 'No description provided'}

Download URLs:
- Tarball: ${data.tarball_url}
- Zipball: ${data.zipball_url}${assetsInfo}`

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
    content: { type: 'string', description: 'Human-readable release details' },
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

---[FILE: get_tree.ts]---
Location: sim-main/apps/sim/tools/github/get_tree.ts

```typescript
import type { GetTreeParams, TreeResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getTreeTool: ToolConfig<GetTreeParams, TreeResponse> = {
  id: 'github_get_tree',
  name: 'GitHub Get Repository Tree',
  description:
    'Get the contents of a directory in a GitHub repository. Returns a list of files and subdirectories. Use empty path or omit to get root directory contents.',
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
      required: false,
      visibility: 'user-or-llm',
      description: 'Directory path (e.g., "src/components"). Leave empty for root directory.',
      default: '',
    },
    ref: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Branch name, tag, or commit SHA (defaults to repository default branch)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'GitHub Personal Access Token',
    },
  },

  request: {
    url: (params) => {
      const path = params.path || ''
      const baseUrl = `https://api.github.com/repos/${params.owner}/${params.repo}/contents/${path}`
      return params.ref ? `${baseUrl}?ref=${params.ref}` : baseUrl
    },
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (!Array.isArray(data)) {
      return {
        success: false,
        error: 'Path points to a file. Use github_get_file_content to get file contents.',
        output: {
          content: '',
          metadata: {
            path: '',
            items: [],
            total_count: 0,
          },
        },
      }
    }

    const items = data.map((item: any) => ({
      name: item.name,
      path: item.path,
      sha: item.sha,
      size: item.size,
      type: item.type,
      download_url: item.download_url,
      html_url: item.html_url,
    }))

    const files = items.filter((item) => item.type === 'file')
    const dirs = items.filter((item) => item.type === 'dir')
    const other = items.filter((item) => item.type !== 'file' && item.type !== 'dir')

    let content = `Repository Tree: ${data[0]?.path ? data[0].path.split('/').slice(0, -1).join('/') || '/' : '/'}
Total items: ${items.length}

`

    if (dirs.length > 0) {
      content += `Directories (${dirs.length}):\n`
      dirs.forEach((dir) => {
        content += `  - ${dir.name}/\n`
      })
      content += '\n'
    }

    if (files.length > 0) {
      content += `Files (${files.length}):\n`
      files.forEach((file) => {
        const sizeKB = (file.size / 1024).toFixed(2)
        content += `  - ${file.name} (${sizeKB} KB)\n`
      })
      content += '\n'
    }

    if (other.length > 0) {
      content += `Other (${other.length}):\n`
      other.forEach((item) => {
        content += `  - ${item.name} [${item.type}]\n`
      })
    }

    return {
      success: true,
      output: {
        content,
        metadata: {
          path: data[0]?.path?.split('/').slice(0, -1).join('/') || '/',
          items,
          total_count: items.length,
        },
      },
    }
  },

  outputs: {
    content: {
      type: 'string',
      description: 'Human-readable directory tree listing',
    },
    metadata: {
      type: 'object',
      description: 'Directory contents metadata',
      properties: {
        path: { type: 'string', description: 'Directory path' },
        items: {
          type: 'array',
          description: 'Array of files and directories',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'File or directory name' },
              path: { type: 'string', description: 'Full path in repository' },
              sha: { type: 'string', description: 'Git object SHA' },
              size: { type: 'number', description: 'Size in bytes' },
              type: { type: 'string', description: 'Type (file, dir, symlink, submodule)' },
              download_url: { type: 'string', description: 'Direct download URL (files only)' },
              html_url: { type: 'string', description: 'GitHub web UI URL' },
            },
          },
        },
        total_count: { type: 'number', description: 'Total number of items' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_workflow.ts]---
Location: sim-main/apps/sim/tools/github/get_workflow.ts

```typescript
import type { GetWorkflowParams, WorkflowResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getWorkflowTool: ToolConfig<GetWorkflowParams, WorkflowResponse> = {
  id: 'github_get_workflow',
  name: 'GitHub Get Workflow',
  description:
    'Get details of a specific GitHub Actions workflow by ID or filename. Returns workflow information including name, path, state, and badge URL.',
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
    workflow_id: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Workflow ID (number) or workflow filename (e.g., "main.yaml")',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/actions/workflows/${params.workflow_id}`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Workflow: ${data.name}
State: ${data.state}
Path: ${data.path}
ID: ${data.id}
Badge URL: ${data.badge_url}
Created: ${data.created_at}
Updated: ${data.updated_at}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          name: data.name,
          path: data.path,
          state: data.state,
          badge_url: data.badge_url,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable workflow details' },
    metadata: {
      type: 'object',
      description: 'Workflow metadata',
      properties: {
        id: { type: 'number', description: 'Workflow ID' },
        name: { type: 'string', description: 'Workflow name' },
        path: { type: 'string', description: 'Path to workflow file' },
        state: { type: 'string', description: 'Workflow state (active/disabled)' },
        badge_url: { type: 'string', description: 'Badge URL for workflow' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_workflow_run.ts]---
Location: sim-main/apps/sim/tools/github/get_workflow_run.ts

```typescript
import type { GetWorkflowRunParams, WorkflowRunResponse } from '@/tools/github/types'
import type { ToolConfig } from '@/tools/types'

export const getWorkflowRunTool: ToolConfig<GetWorkflowRunParams, WorkflowRunResponse> = {
  id: 'github_get_workflow_run',
  name: 'GitHub Get Workflow Run',
  description:
    'Get detailed information about a specific workflow run by ID. Returns status, conclusion, timing, and links to the run.',
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
    run_id: {
      type: 'number',
      required: true,
      visibility: 'user-or-llm',
      description: 'Workflow run ID',
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
      `https://api.github.com/repos/${params.owner}/${params.repo}/actions/runs/${params.run_id}`,
    method: 'GET',
    headers: (params) => ({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${params.apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()

    const content = `Workflow Run #${data.run_number}: ${data.name}
Status: ${data.status}${data.conclusion ? ` - ${data.conclusion}` : ''}
Branch: ${data.head_branch}
Commit: ${data.head_sha.substring(0, 7)}
Event: ${data.event}
Triggered by: ${data.triggering_actor?.login || 'Unknown'}
Started: ${data.run_started_at || data.created_at}
${data.updated_at ? `Updated: ${data.updated_at}` : ''}
${data.run_attempt ? `Attempt: ${data.run_attempt}` : ''}
URL: ${data.html_url}
Logs: ${data.logs_url}`

    return {
      success: true,
      output: {
        content,
        metadata: {
          id: data.id,
          name: data.name,
          status: data.status,
          conclusion: data.conclusion,
          html_url: data.html_url,
          run_number: data.run_number,
        },
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'Human-readable workflow run details' },
    metadata: {
      type: 'object',
      description: 'Workflow run metadata',
      properties: {
        id: { type: 'number', description: 'Workflow run ID' },
        name: { type: 'string', description: 'Workflow name' },
        status: { type: 'string', description: 'Run status' },
        conclusion: { type: 'string', description: 'Run conclusion' },
        html_url: { type: 'string', description: 'GitHub web URL' },
        run_number: { type: 'number', description: 'Run number' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/github/index.ts

```typescript
import { addAssigneesTool } from '@/tools/github/add_assignees'
import { addLabelsTool } from '@/tools/github/add_labels'
import { cancelWorkflowRunTool } from '@/tools/github/cancel_workflow_run'
import { closeIssueTool } from '@/tools/github/close_issue'
import { closePRTool } from '@/tools/github/close_pr'
import { commentTool } from '@/tools/github/comment'
import { createBranchTool } from '@/tools/github/create_branch'
import { createFileTool } from '@/tools/github/create_file'
import { createIssueTool } from '@/tools/github/create_issue'
import { createPRTool } from '@/tools/github/create_pr'
import { createProjectTool } from '@/tools/github/create_project'
import { createReleaseTool } from '@/tools/github/create_release'
import { deleteBranchTool } from '@/tools/github/delete_branch'
import { deleteCommentTool } from '@/tools/github/delete_comment'
import { deleteFileTool } from '@/tools/github/delete_file'
import { deleteProjectTool } from '@/tools/github/delete_project'
import { deleteReleaseTool } from '@/tools/github/delete_release'
import { getBranchTool } from '@/tools/github/get_branch'
import { getBranchProtectionTool } from '@/tools/github/get_branch_protection'
import { getFileContentTool } from '@/tools/github/get_file_content'
import { getIssueTool } from '@/tools/github/get_issue'
import { getPRFilesTool } from '@/tools/github/get_pr_files'
import { getProjectTool } from '@/tools/github/get_project'
import { getReleaseTool } from '@/tools/github/get_release'
import { getTreeTool } from '@/tools/github/get_tree'
import { getWorkflowTool } from '@/tools/github/get_workflow'
import { getWorkflowRunTool } from '@/tools/github/get_workflow_run'
import { issueCommentTool } from '@/tools/github/issue_comment'
import { latestCommitTool } from '@/tools/github/latest_commit'
import { listBranchesTool } from '@/tools/github/list_branches'
import { listIssueCommentsTool } from '@/tools/github/list_issue_comments'
import { listIssuesTool } from '@/tools/github/list_issues'
import { listPRCommentsTool } from '@/tools/github/list_pr_comments'
import { listProjectsTool } from '@/tools/github/list_projects'
import { listPRsTool } from '@/tools/github/list_prs'
import { listReleasesTool } from '@/tools/github/list_releases'
import { listWorkflowRunsTool } from '@/tools/github/list_workflow_runs'
import { listWorkflowsTool } from '@/tools/github/list_workflows'
import { mergePRTool } from '@/tools/github/merge_pr'
import { prTool } from '@/tools/github/pr'
import { removeLabelTool } from '@/tools/github/remove_label'
import { repoInfoTool } from '@/tools/github/repo_info'
import { requestReviewersTool } from '@/tools/github/request_reviewers'
import { rerunWorkflowTool } from '@/tools/github/rerun_workflow'
import { triggerWorkflowTool } from '@/tools/github/trigger_workflow'
import { updateBranchProtectionTool } from '@/tools/github/update_branch_protection'
import { updateCommentTool } from '@/tools/github/update_comment'
import { updateFileTool } from '@/tools/github/update_file'
import { updateIssueTool } from '@/tools/github/update_issue'
import { updatePRTool } from '@/tools/github/update_pr'
import { updateProjectTool } from '@/tools/github/update_project'
import { updateReleaseTool } from '@/tools/github/update_release'

export const githubCancelWorkflowRunTool = cancelWorkflowRunTool
export const githubClosePRTool = closePRTool
export const githubCommentTool = commentTool
export const githubCreateBranchTool = createBranchTool
export const githubCreateFileTool = createFileTool
export const githubCreatePRTool = createPRTool
export const githubCreateProjectTool = createProjectTool
export const githubCreateReleaseTool = createReleaseTool
export const githubDeleteBranchTool = deleteBranchTool
export const githubDeleteCommentTool = deleteCommentTool
export const githubDeleteFileTool = deleteFileTool
export const githubDeleteProjectTool = deleteProjectTool
export const githubDeleteReleaseTool = deleteReleaseTool
export const githubGetBranchTool = getBranchTool
export const githubGetBranchProtectionTool = getBranchProtectionTool
export const githubGetFileContentTool = getFileContentTool
export const githubGetPRFilesTool = getPRFilesTool
export const githubGetProjectTool = getProjectTool
export const githubGetReleaseTool = getReleaseTool
export const githubGetTreeTool = getTreeTool
export const githubGetWorkflowTool = getWorkflowTool
export const githubGetWorkflowRunTool = getWorkflowRunTool
export const githubIssueCommentTool = issueCommentTool
export const githubLatestCommitTool = latestCommitTool
export const githubListBranchesTool = listBranchesTool
export const githubListIssueCommentsTool = listIssueCommentsTool
export const githubListPRCommentsTool = listPRCommentsTool
export const githubListPRsTool = listPRsTool
export const githubListProjectsTool = listProjectsTool
export const githubListReleasesTool = listReleasesTool
export const githubListWorkflowRunsTool = listWorkflowRunsTool
export const githubListWorkflowsTool = listWorkflowsTool
export const githubMergePRTool = mergePRTool
export const githubPrTool = prTool
export const githubRepoInfoTool = repoInfoTool
export const githubRequestReviewersTool = requestReviewersTool
export const githubRerunWorkflowTool = rerunWorkflowTool
export const githubTriggerWorkflowTool = triggerWorkflowTool
export const githubUpdateBranchProtectionTool = updateBranchProtectionTool
export const githubUpdateCommentTool = updateCommentTool
export const githubUpdateFileTool = updateFileTool
export const githubUpdatePRTool = updatePRTool
export const githubUpdateProjectTool = updateProjectTool
export const githubUpdateReleaseTool = updateReleaseTool
export const githubAddAssigneesTool = addAssigneesTool
export const githubAddLabelsTool = addLabelsTool
export const githubCloseIssueTool = closeIssueTool
export const githubCreateIssueTool = createIssueTool
export const githubGetIssueTool = getIssueTool
export const githubListIssuesTool = listIssuesTool
export const githubRemoveLabelTool = removeLabelTool
export const githubUpdateIssueTool = updateIssueTool
```

--------------------------------------------------------------------------------

````
