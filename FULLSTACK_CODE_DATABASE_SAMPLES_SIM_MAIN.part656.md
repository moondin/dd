---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 656
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 656 of 933)

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

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/arxiv/search.ts

```typescript
import type { ArxivSearchParams, ArxivSearchResponse } from '@/tools/arxiv/types'
import { extractTotalResults, parseArxivXML } from '@/tools/arxiv/utils'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<ArxivSearchParams, ArxivSearchResponse> = {
  id: 'arxiv_search',
  name: 'ArXiv Search',
  description: 'Search for academic papers on ArXiv by keywords, authors, titles, or other fields.',
  version: '1.0.0',

  params: {
    searchQuery: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query to execute',
    },
    searchField: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description:
        'Field to search in: all, ti (title), au (author), abs (abstract), co (comment), jr (journal), cat (category), rn (report number)',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (default: 10, max: 2000)',
    },
    sortBy: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort by: relevance, lastUpdatedDate, submittedDate (default: relevance)',
    },
    sortOrder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Sort order: ascending, descending (default: descending)',
    },
  },

  request: {
    url: (params: ArxivSearchParams) => {
      const baseUrl = 'https://export.arxiv.org/api/query'
      const searchParams = new URLSearchParams()

      // Build search query
      let searchQuery = params.searchQuery
      if (params.searchField && params.searchField !== 'all') {
        searchQuery = `${params.searchField}:${params.searchQuery}`
      }
      searchParams.append('search_query', searchQuery)

      // Add optional parameters
      if (params.maxResults) {
        searchParams.append('max_results', Math.min(Number(params.maxResults), 2000).toString())
      } else {
        searchParams.append('max_results', '10')
      }

      if (params.sortBy) {
        searchParams.append('sortBy', params.sortBy)
      }

      if (params.sortOrder) {
        searchParams.append('sortOrder', params.sortOrder)
      }

      return `${baseUrl}?${searchParams.toString()}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/xml',
    }),
  },

  transformResponse: async (response: Response) => {
    const xmlText = await response.text()

    // Parse XML response
    const papers = parseArxivXML(xmlText)
    const totalResults = extractTotalResults(xmlText)

    return {
      success: true,
      output: {
        papers,
        totalResults,
        query: '', // Will be filled by the calling code
      },
    }
  },

  outputs: {
    papers: {
      type: 'json',
      description: 'Array of papers matching the search query',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          authors: { type: 'string' },
          published: { type: 'string' },
          updated: { type: 'string' },
          link: { type: 'string' },
          pdfLink: { type: 'string' },
          categories: { type: 'string' },
          primaryCategory: { type: 'string' },
          comment: { type: 'string' },
          journalRef: { type: 'string' },
          doi: { type: 'string' },
        },
      },
    },
    totalResults: {
      type: 'number',
      description: 'Total number of results found for the search query',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/arxiv/types.ts

```typescript
// Common types for ArXiv tools
import type { ToolResponse } from '@/tools/types'

// Search tool types
export interface ArxivSearchParams {
  searchQuery: string
  searchField?: 'all' | 'ti' | 'au' | 'abs' | 'co' | 'jr' | 'cat' | 'rn'
  maxResults?: number
  sortBy?: 'relevance' | 'lastUpdatedDate' | 'submittedDate'
  sortOrder?: 'ascending' | 'descending'
}

export interface ArxivPaper {
  id: string
  title: string
  summary: string
  authors: string[]
  published: string
  updated: string
  link: string
  pdfLink: string
  categories: string[]
  primaryCategory: string
  comment?: string
  journalRef?: string
  doi?: string
}

export interface ArxivSearchResponse extends ToolResponse {
  output: {
    papers: ArxivPaper[]
    totalResults: number
    query: string
  }
}

// Get Paper Details tool types
export interface ArxivGetPaperParams {
  paperId: string
}

export interface ArxivGetPaperResponse extends ToolResponse {
  output: {
    paper: ArxivPaper
  }
}

// Get Author Papers tool types
export interface ArxivGetAuthorPapersParams {
  authorName: string
  maxResults?: number
}

export interface ArxivGetAuthorPapersResponse extends ToolResponse {
  output: {
    authorPapers: ArxivPaper[]
    totalResults: number
    authorName: string
  }
}

export type ArxivResponse =
  | ArxivSearchResponse
  | ArxivGetPaperResponse
  | ArxivGetAuthorPapersResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/arxiv/utils.ts

```typescript
import type { ArxivPaper } from '@/tools/arxiv/types'

export function parseArxivXML(xmlText: string): ArxivPaper[] {
  const papers: ArxivPaper[] = []

  // Extract entries using regex (since we don't have XML parser in this environment)
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1]

    const paper: ArxivPaper = {
      id: extractXmlValue(entryXml, 'id')?.replace('http://arxiv.org/abs/', '') || '',
      title: cleanText(extractXmlValue(entryXml, 'title') || ''),
      summary: cleanText(extractXmlValue(entryXml, 'summary') || ''),
      authors: extractAuthors(entryXml),
      published: extractXmlValue(entryXml, 'published') || '',
      updated: extractXmlValue(entryXml, 'updated') || '',
      link: extractXmlValue(entryXml, 'id') || '',
      pdfLink: extractPdfLink(entryXml),
      categories: extractCategories(entryXml),
      primaryCategory: extractXmlAttribute(entryXml, 'arxiv:primary_category', 'term') || '',
      comment: extractXmlValue(entryXml, 'arxiv:comment'),
      journalRef: extractXmlValue(entryXml, 'arxiv:journal_ref'),
      doi: extractXmlValue(entryXml, 'arxiv:doi'),
    }

    papers.push(paper)
  }

  return papers
}

export function extractTotalResults(xmlText: string): number {
  const totalResultsMatch = xmlText.match(
    /<opensearch:totalResults[^>]*>(\d+)<\/opensearch:totalResults>/
  )
  return totalResultsMatch ? Number.parseInt(totalResultsMatch[1], 10) : 0
}

export function extractXmlValue(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\/${tagName}>`)
  const match = xml.match(regex)
  return match ? match[1].trim() : undefined
}

export function extractXmlAttribute(
  xml: string,
  tagName: string,
  attrName: string
): string | undefined {
  const regex = new RegExp(`<${tagName}[^>]*${attrName}="([^"]*)"[^>]*>`)
  const match = xml.match(regex)
  return match ? match[1] : undefined
}

export function extractAuthors(entryXml: string): string[] {
  const authors: string[] = []
  const authorRegex = /<author[^>]*>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/g
  let match

  while ((match = authorRegex.exec(entryXml)) !== null) {
    authors.push(match[1].trim())
  }

  return authors
}

export function extractPdfLink(entryXml: string): string {
  const linkRegex = /<link[^>]*href="([^"]*)"[^>]*title="pdf"[^>]*>/
  const match = entryXml.match(linkRegex)
  return match ? match[1] : ''
}

export function extractCategories(entryXml: string): string[] {
  const categories: string[] = []
  const categoryRegex = /<category[^>]*term="([^"]*)"[^>]*>/g
  let match

  while ((match = categoryRegex.exec(entryXml)) !== null) {
    categories.push(match[1])
  }

  return categories
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
```

--------------------------------------------------------------------------------

---[FILE: add_comment.ts]---
Location: sim-main/apps/sim/tools/asana/add_comment.ts

```typescript
import type { AsanaAddCommentParams, AsanaAddCommentResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaAddCommentTool: ToolConfig<AsanaAddCommentParams, AsanaAddCommentResponse> = {
  id: 'asana_add_comment',
  name: 'Asana Add Comment',
  description: 'Add a comment (story) to an Asana task',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    taskGid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The globally unique identifier (GID) of the task',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text content of the comment',
    },
  },

  request: {
    url: '/api/tools/asana/add-comment',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      taskGid: params.taskGid,
      text: params.text,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: false,
        output: {},
        error: 'Empty response from Asana',
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    gid: { type: 'string', description: 'Comment globally unique identifier' },
    text: { type: 'string', description: 'Comment text content' },
    created_at: { type: 'string', description: 'Comment creation timestamp' },
    created_by: {
      type: 'object',
      description: 'Comment author details',
      properties: {
        gid: { type: 'string', description: 'Author GID' },
        name: { type: 'string', description: 'Author name' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_task.ts]---
Location: sim-main/apps/sim/tools/asana/create_task.ts

```typescript
import type { AsanaCreateTaskParams, AsanaCreateTaskResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaCreateTaskTool: ToolConfig<AsanaCreateTaskParams, AsanaCreateTaskResponse> = {
  id: 'asana_create_task',
  name: 'Asana Create Task',
  description: 'Create a new task in Asana',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    workspace: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Workspace GID where the task will be created',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Name of the task',
    },
    notes: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Notes or description for the task',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'User GID to assign the task to',
    },
    due_on: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Due date in YYYY-MM-DD format',
    },
  },

  request: {
    url: '/api/tools/asana/create-task',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      workspace: params.workspace,
      name: params.name,
      notes: params.notes,
      assignee: params.assignee,
      due_on: params.due_on,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          gid: 'unknown',
          name: 'Task created successfully',
          notes: '',
          completed: false,
          created_at: new Date().toISOString(),
          permalink_url: '',
        },
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    gid: { type: 'string', description: 'Task globally unique identifier' },
    name: { type: 'string', description: 'Task name' },
    notes: { type: 'string', description: 'Task notes or description' },
    completed: { type: 'boolean', description: 'Whether the task is completed' },
    created_at: { type: 'string', description: 'Task creation timestamp' },
    permalink_url: { type: 'string', description: 'URL to the task in Asana' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_projects.ts]---
Location: sim-main/apps/sim/tools/asana/get_projects.ts

```typescript
import type { AsanaGetProjectsParams, AsanaGetProjectsResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaGetProjectsTool: ToolConfig<AsanaGetProjectsParams, AsanaGetProjectsResponse> = {
  id: 'asana_get_projects',
  name: 'Asana Get Projects',
  description: 'Retrieve all projects from an Asana workspace',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    workspace: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Workspace GID to retrieve projects from',
    },
  },

  request: {
    url: '/api/tools/asana/get-projects',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      workspace: params.workspace,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: false,
        output: {},
        error: 'Empty response from Asana',
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    projects: {
      type: 'array',
      description: 'Array of projects',
      items: {
        type: 'object',
        properties: {
          gid: { type: 'string', description: 'Project GID' },
          name: { type: 'string', description: 'Project name' },
          resource_type: { type: 'string', description: 'Resource type (project)' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_task.ts]---
Location: sim-main/apps/sim/tools/asana/get_task.ts

```typescript
import type { AsanaGetTaskParams, AsanaGetTaskResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaGetTaskTool: ToolConfig<AsanaGetTaskParams, AsanaGetTaskResponse> = {
  id: 'asana_get_task',
  name: 'Asana Get Task',
  description: 'Retrieve a single task by GID or get multiple tasks with filters',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    taskGid: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The globally unique identifier (GID) of the task. If not provided, will get multiple tasks.',
    },
    workspace: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Workspace GID to filter tasks (required when not using taskGid)',
    },
    project: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Project GID to filter tasks',
    },
    limit: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of tasks to return (default: 50)',
    },
  },

  request: {
    url: '/api/tools/asana/get-task',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      taskGid: params.taskGid,
      workspace: params.workspace,
      project: params.project,
      limit: params.limit,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: false,
        output: {},
        error: 'Empty response from Asana',
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    gid: { type: 'string', description: 'Task globally unique identifier' },
    resource_type: { type: 'string', description: 'Resource type (task)' },
    resource_subtype: { type: 'string', description: 'Resource subtype' },
    name: { type: 'string', description: 'Task name' },
    notes: { type: 'string', description: 'Task notes or description' },
    completed: { type: 'boolean', description: 'Whether the task is completed' },
    assignee: {
      type: 'object',
      description: 'Assignee details',
      properties: {
        gid: { type: 'string', description: 'Assignee GID' },
        name: { type: 'string', description: 'Assignee name' },
      },
    },
    created_by: {
      type: 'object',
      description: 'Creator details',
      properties: {
        gid: { type: 'string', description: 'Creator GID' },
        name: { type: 'string', description: 'Creator name' },
      },
    },
    due_on: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
    created_at: { type: 'string', description: 'Task creation timestamp' },
    modified_at: { type: 'string', description: 'Task last modified timestamp' },
    tasks: {
      type: 'array',
      description: 'Array of tasks (when fetching multiple)',
      items: {
        type: 'object',
        properties: {
          gid: { type: 'string', description: 'Task GID' },
          name: { type: 'string', description: 'Task name' },
          completed: { type: 'boolean', description: 'Completion status' },
        },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/asana/index.ts

```typescript
import { asanaAddCommentTool } from '@/tools/asana/add_comment'
import { asanaCreateTaskTool } from '@/tools/asana/create_task'
import { asanaGetProjectsTool } from '@/tools/asana/get_projects'
import { asanaGetTaskTool } from '@/tools/asana/get_task'
import { asanaSearchTasksTool } from '@/tools/asana/search_tasks'
import { asanaUpdateTaskTool } from '@/tools/asana/update_task'

export { asanaGetTaskTool }
export { asanaCreateTaskTool }
export { asanaUpdateTaskTool }
export { asanaGetProjectsTool }
export { asanaSearchTasksTool }
export { asanaAddCommentTool }
```

--------------------------------------------------------------------------------

---[FILE: search_tasks.ts]---
Location: sim-main/apps/sim/tools/asana/search_tasks.ts

```typescript
import type { AsanaSearchTasksParams, AsanaSearchTasksResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaSearchTasksTool: ToolConfig<AsanaSearchTasksParams, AsanaSearchTasksResponse> = {
  id: 'asana_search_tasks',
  name: 'Asana Search Tasks',
  description: 'Search for tasks in an Asana workspace',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    workspace: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Workspace GID to search tasks in',
    },
    text: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Text to search for in task names',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter tasks by assignee user GID',
    },
    projects: {
      type: 'array',
      required: false,
      visibility: 'user-only',
      description: 'Array of project GIDs to filter tasks by',
    },
    completed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by completion status',
    },
  },

  request: {
    url: '/api/tools/asana/search-tasks',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      workspace: params.workspace,
      text: params.text,
      assignee: params.assignee,
      projects: params.projects,
      completed: params.completed,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: false,
        output: {},
        error: 'Empty response from Asana',
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    tasks: {
      type: 'array',
      description: 'Array of matching tasks',
      items: {
        type: 'object',
        properties: {
          gid: { type: 'string', description: 'Task GID' },
          resource_type: { type: 'string', description: 'Resource type' },
          resource_subtype: { type: 'string', description: 'Resource subtype' },
          name: { type: 'string', description: 'Task name' },
          notes: { type: 'string', description: 'Task notes' },
          completed: { type: 'boolean', description: 'Completion status' },
          assignee: {
            type: 'object',
            description: 'Assignee details',
            properties: {
              gid: { type: 'string', description: 'Assignee GID' },
              name: { type: 'string', description: 'Assignee name' },
            },
          },
          due_on: { type: 'string', description: 'Due date' },
          created_at: { type: 'string', description: 'Creation timestamp' },
          modified_at: { type: 'string', description: 'Modified timestamp' },
        },
      },
    },
    next_page: {
      type: 'object',
      description: 'Pagination info',
      properties: {
        offset: { type: 'string', description: 'Offset token' },
        path: { type: 'string', description: 'API path' },
        uri: { type: 'string', description: 'Full URI' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/asana/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface AsanaGetTaskParams {
  accessToken: string
  taskGid?: string
  workspace?: string
  project?: string
  limit?: number
}

export interface AsanaGetTaskResponse extends ToolResponse {
  output: {
    ts: string
    gid?: string
    resource_type?: string
    resource_subtype?: string
    name?: string
    notes?: string
    completed?: boolean
    assignee?: {
      gid: string
      name: string
    }
    created_by?: {
      gid: string
      resource_type: string
      name: string
    }
    due_on?: string
    created_at?: string
    modified_at?: string
    tasks?: Array<{
      gid: string
      resource_type: string
      resource_subtype: string
      name: string
      notes?: string
      completed: boolean
      assignee?: {
        gid: string
        name: string
      }
      created_by?: {
        gid: string
        resource_type: string
        name: string
      }
      due_on?: string
      created_at: string
      modified_at: string
    }>
    next_page?: {
      offset: string
      path: string
      uri: string
    }
  }
}

export interface AsanaCreateTaskParams {
  accessToken: string
  workspace: string
  name: string
  notes?: string
  assignee?: string
  due_on?: string
}

export interface AsanaCreateTaskResponse extends ToolResponse {
  output: {
    ts: string
    gid: string
    name: string
    notes: string
    completed: boolean
    created_at: string
    permalink_url: string
  }
}

export interface AsanaUpdateTaskParams {
  accessToken: string
  taskGid: string
  name?: string
  notes?: string
  assignee?: string
  completed?: boolean
  due_on?: string
}

export interface AsanaUpdateTaskResponse extends ToolResponse {
  output: {
    ts: string
    gid: string
    name: string
    notes: string
    completed: boolean
    modified_at: string
  }
}

export interface AsanaGetProjectsParams {
  accessToken: string
  workspace: string
}

export interface AsanaGetProjectsResponse extends ToolResponse {
  output: {
    ts: string
    projects: Array<{
      gid: string
      name: string
      resource_type: string
    }>
  }
}

export interface AsanaSearchTasksParams {
  accessToken: string
  workspace: string
  text?: string
  assignee?: string
  projects?: string[]
  completed?: boolean
}

export interface AsanaSearchTasksResponse extends ToolResponse {
  output: {
    ts: string
    tasks: Array<{
      gid: string
      resource_type: string
      resource_subtype: string
      name: string
      notes?: string
      completed: boolean
      assignee?: {
        gid: string
        name: string
      }
      created_by?: {
        gid: string
        resource_type: string
        name: string
      }
      due_on?: string
      created_at: string
      modified_at: string
    }>
    next_page?: {
      offset: string
      path: string
      uri: string
    }
  }
}

export interface AsanaTask {
  gid: string
  resource_type: string
  resource_subtype: string
  name: string
  notes?: string
  completed: boolean
  assignee?: {
    gid: string
    name: string
  }
  created_by?: {
    gid: string
    resource_type: string
    name: string
  }
  due_on?: string
  created_at: string
  modified_at: string
}

export interface AsanaProject {
  gid: string
  name: string
  resource_type: string
}

export interface AsanaAddCommentParams {
  accessToken: string
  taskGid: string
  text: string
}

export interface AsanaAddCommentResponse extends ToolResponse {
  output: {
    ts: string
    gid: string
    text: string
    created_at: string
    created_by: {
      gid: string
      name: string
    }
  }
}

export type AsanaResponse =
  | AsanaGetTaskResponse
  | AsanaCreateTaskResponse
  | AsanaUpdateTaskResponse
  | AsanaGetProjectsResponse
  | AsanaSearchTasksResponse
  | AsanaAddCommentResponse
```

--------------------------------------------------------------------------------

---[FILE: update_task.ts]---
Location: sim-main/apps/sim/tools/asana/update_task.ts

```typescript
import type { AsanaUpdateTaskParams, AsanaUpdateTaskResponse } from '@/tools/asana/types'
import type { ToolConfig } from '@/tools/types'

export const asanaUpdateTaskTool: ToolConfig<AsanaUpdateTaskParams, AsanaUpdateTaskResponse> = {
  id: 'asana_update_task',
  name: 'Asana Update Task',
  description: 'Update an existing task in Asana',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'asana',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Asana',
    },
    taskGid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The globally unique identifier (GID) of the task to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated name for the task',
    },
    notes: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated notes or description for the task',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated assignee user GID',
    },
    completed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mark task as completed or not completed',
    },
    due_on: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated due date in YYYY-MM-DD format',
    },
  },

  request: {
    url: '/api/tools/asana/update-task',
    method: 'PUT',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      accessToken: params.accessToken,
      taskGid: params.taskGid,
      name: params.name,
      notes: params.notes,
      assignee: params.assignee,
      completed: params.completed,
      due_on: params.due_on,
    }),
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          gid: 'unknown',
          name: 'Task updated successfully',
          notes: '',
          completed: false,
          modified_at: new Date().toISOString(),
        },
      }
    }

    const data = JSON.parse(responseText)
    const { success, error, ...output } = data
    return {
      success: success ?? true,
      output,
      error,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    ts: { type: 'string', description: 'Timestamp of the response' },
    gid: { type: 'string', description: 'Task globally unique identifier' },
    name: { type: 'string', description: 'Task name' },
    notes: { type: 'string', description: 'Task notes or description' },
    completed: { type: 'boolean', description: 'Whether the task is completed' },
    modified_at: { type: 'string', description: 'Task last modified timestamp' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/browser_use/index.ts

```typescript
import { runTaskTool } from '@/tools/browser_use/run_task'

export const browserUseRunTaskTool = runTaskTool
```

--------------------------------------------------------------------------------

---[FILE: run_task.ts]---
Location: sim-main/apps/sim/tools/browser_use/run_task.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { BrowserUseRunTaskParams, BrowserUseRunTaskResponse } from '@/tools/browser_use/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('BrowserUseTool')

const POLL_INTERVAL_MS = 5000 // 5 seconds between polls
const MAX_POLL_TIME_MS = 180000 // 3 minutes maximum polling time

export const runTaskTool: ToolConfig<BrowserUseRunTaskParams, BrowserUseRunTaskResponse> = {
  id: 'browser_use_run_task',
  name: 'Browser Use',
  description: 'Runs a browser automation task using BrowserUse',
  version: '1.0.0',

  params: {
    task: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'What should the browser agent do',
    },
    variables: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description: 'Optional variables to use as secrets (format: {key: value})',
    },
    save_browser_data: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to save browser data',
    },
    model: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'LLM model to use (default: gpt-4o)',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'API key for BrowserUse API',
    },
  },
  request: {
    url: 'https://api.browser-use.com/api/v1/run-task',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const requestBody: Record<string, any> = {
        task: params.task,
      }

      if (params.variables) {
        let secrets: Record<string, string> = {}

        if (Array.isArray(params.variables)) {
          logger.info('Converting variables array to dictionary format')
          params.variables.forEach((row) => {
            if (row.cells?.Key && row.cells.Value !== undefined) {
              secrets[row.cells.Key] = row.cells.Value
              logger.info(`Added secret for key: ${row.cells.Key}`)
            } else if (row.Key && row.Value !== undefined) {
              secrets[row.Key] = row.Value
              logger.info(`Added secret for key: ${row.Key}`)
            }
          })
        } else if (typeof params.variables === 'object' && params.variables !== null) {
          logger.info('Using variables object directly')
          secrets = params.variables
        }

        if (Object.keys(secrets).length > 0) {
          logger.info(`Found ${Object.keys(secrets).length} secrets to include`)
          requestBody.secrets = secrets
        } else {
          logger.warn('No usable secrets found in variables')
        }
      }

      if (params.model) {
        requestBody.llm_model = params.model
      }

      if (params.save_browser_data) {
        requestBody.save_browser_data = params.save_browser_data
      }

      requestBody.use_adblock = true
      requestBody.highlight_elements = true

      return requestBody
    },
  },

  transformResponse: async (response: Response) => {
    const data = (await response.json()) as { id: string }
    return {
      success: true,
      output: {
        id: data.id,
        success: true,
        output: null,
        steps: [],
      },
    }
  },

  postProcess: async (result, params) => {
    if (!result.success) {
      return result
    }

    const taskId = result.output.id
    let liveUrlLogged = false

    try {
      const initialTaskResponse = await fetch(`https://api.browser-use.com/api/v1/task/${taskId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${params.apiKey}`,
        },
      })

      if (initialTaskResponse.ok) {
        const initialTaskData = await initialTaskResponse.json()
        if (initialTaskData.live_url) {
          logger.info(
            `BrowserUse task ${taskId} launched with live URL: ${initialTaskData.live_url}`
          )
          liveUrlLogged = true
        }
      }
    } catch (error) {
      logger.warn(`Failed to get initial task details for ${taskId}:`, error)
    }

    let elapsedTime = 0

    while (elapsedTime < MAX_POLL_TIME_MS) {
      try {
        const statusResponse = await fetch(
          `https://api.browser-use.com/api/v1/task/${taskId}/status`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${params.apiKey}`,
            },
          }
        )

        if (!statusResponse.ok) {
          throw new Error(`Failed to get task status: ${statusResponse.statusText}`)
        }

        const status = await statusResponse.json()

        logger.info(`BrowserUse task ${taskId} status: ${status}`)

        if (['finished', 'failed', 'stopped'].includes(status)) {
          const taskResponse = await fetch(`https://api.browser-use.com/api/v1/task/${taskId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${params.apiKey}`,
            },
          })

          if (taskResponse.ok) {
            const taskData = await taskResponse.json()
            result.output = {
              id: taskId,
              success: status === 'finished',
              output: taskData.output,
              steps: taskData.steps || [],
            }
          }

          return result
        }

        if (!liveUrlLogged && status === 'running') {
          const taskResponse = await fetch(`https://api.browser-use.com/api/v1/task/${taskId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${params.apiKey}`,
            },
          })

          if (taskResponse.ok) {
            const taskData = await taskResponse.json()
            if (taskData.live_url) {
              logger.info(`BrowserUse task ${taskId} running with live URL: ${taskData.live_url}`)
              liveUrlLogged = true
            }
          }
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
        elapsedTime += POLL_INTERVAL_MS
      } catch (error: any) {
        logger.error('Error polling for task status:', {
          message: error.message || 'Unknown error',
          taskId,
        })

        return {
          ...result,
          error: `Error polling for task status: ${error.message || 'Unknown error'}`,
        }
      }
    }

    logger.warn(
      `Task ${taskId} did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`
    )
    return {
      ...result,
      error: `Task did not complete within the maximum polling time (${MAX_POLL_TIME_MS / 1000}s)`,
    }
  },

  outputs: {
    id: { type: 'string', description: 'Task execution identifier' },
    success: { type: 'boolean', description: 'Task completion status' },
    output: { type: 'json', description: 'Task output data' },
    steps: { type: 'json', description: 'Execution steps taken' },
  },
}
```

--------------------------------------------------------------------------------

````
