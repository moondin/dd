---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 710
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 710 of 933)

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

---[FILE: update_project_label.ts]---
Location: sim-main/apps/sim/tools/linear/update_project_label.ts

```typescript
import type {
  LinearUpdateProjectLabelParams,
  LinearUpdateProjectLabelResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateProjectLabelTool: ToolConfig<
  LinearUpdateProjectLabelParams,
  LinearUpdateProjectLabelResponse
> = {
  id: 'linear_update_project_label',
  name: 'Linear Update Project Label',
  description: 'Update a project label in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    labelId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project label ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated label name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated label color',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {}

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.color != null && params.color !== '') {
        input.color = params.color
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }

      return {
        query: `
          mutation ProjectLabelUpdate($id: String!, $input: ProjectLabelUpdateInput!) {
            projectLabelUpdate(id: $id, input: $input) {
              success
              projectLabel {
                id
                name
                description
                color
                isGroup
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          id: params.labelId,
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update project label',
        output: {},
      }
    }

    const result = data.data.projectLabelUpdate
    return {
      success: result.success,
      output: {
        projectLabel: result.projectLabel,
      },
    }
  },

  outputs: {
    projectLabel: {
      type: 'object',
      description: 'The updated project label',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_project_milestone.ts]---
Location: sim-main/apps/sim/tools/linear/update_project_milestone.ts

```typescript
import type {
  LinearUpdateProjectMilestoneParams,
  LinearUpdateProjectMilestoneResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateProjectMilestoneTool: ToolConfig<
  LinearUpdateProjectMilestoneParams,
  LinearUpdateProjectMilestoneResponse
> = {
  id: 'linear_update_project_milestone',
  name: 'Linear Update Project Milestone',
  description: 'Update a project milestone in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    milestoneId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project milestone ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated milestone name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    targetDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated target date (ISO 8601)',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {}

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.targetDate != null && params.targetDate !== '') {
        input.targetDate = params.targetDate
      }

      return {
        query: `
          mutation ProjectMilestoneUpdate($id: String!, $input: ProjectMilestoneUpdateInput!) {
            projectMilestoneUpdate(id: $id, input: $input) {
              success
              projectMilestone {
                id
                name
                description
                projectId
                targetDate
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          id: params.milestoneId,
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update project milestone',
        output: {},
      }
    }

    const result = data.data.projectMilestoneUpdate
    return {
      success: result.success,
      output: {
        projectMilestone: result.projectMilestone,
      },
    }
  },

  outputs: {
    projectMilestone: {
      type: 'object',
      description: 'The updated project milestone',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_project_status.ts]---
Location: sim-main/apps/sim/tools/linear/update_project_status.ts

```typescript
import type {
  LinearUpdateProjectStatusParams,
  LinearUpdateProjectStatusResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateProjectStatusTool: ToolConfig<
  LinearUpdateProjectStatusParams,
  LinearUpdateProjectStatusResponse
> = {
  id: 'linear_update_project_status',
  name: 'Linear Update Project Status',
  description: 'Update a project status in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    statusId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Project status ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated status name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated status color',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated description',
    },
    indefinite: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated indefinite flag',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'Updated position',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {}

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.color != null && params.color !== '') {
        input.color = params.color
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.indefinite != null) {
        input.indefinite = params.indefinite
      }
      if (params.position != null) {
        input.position = params.position
      }

      return {
        query: `
          mutation ProjectStatusUpdate($id: String!, $input: ProjectStatusUpdateInput!) {
            projectStatusUpdate(id: $id, input: $input) {
              success
              status {
                id
                name
                description
                color
                indefinite
                position
                createdAt
                archivedAt
              }
            }
          }
        `,
        variables: {
          id: params.statusId,
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update project status',
        output: {},
      }
    }

    const result = data.data.projectStatusUpdate
    return {
      success: result.success,
      output: {
        projectStatus: result.status,
      },
    }
  },

  outputs: {
    projectStatus: {
      type: 'object',
      description: 'The updated project status',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_workflow_state.ts]---
Location: sim-main/apps/sim/tools/linear/update_workflow_state.ts

```typescript
import type {
  LinearUpdateWorkflowStateParams,
  LinearUpdateWorkflowStateResponse,
} from '@/tools/linear/types'
import type { ToolConfig } from '@/tools/types'

export const linearUpdateWorkflowStateTool: ToolConfig<
  LinearUpdateWorkflowStateParams,
  LinearUpdateWorkflowStateResponse
> = {
  id: 'linear_update_workflow_state',
  name: 'Linear Update Workflow State',
  description: 'Update an existing workflow state in Linear',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linear',
  },

  params: {
    stateId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Workflow state ID to update',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New state name',
    },
    color: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New state color (hex format)',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New state description',
    },
    position: {
      type: 'number',
      required: false,
      visibility: 'user-or-llm',
      description: 'New position in workflow',
    },
  },

  request: {
    url: 'https://api.linear.app/graphql',
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Missing access token for Linear API request')
      }
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
    body: (params) => {
      const input: Record<string, any> = {}

      if (params.name != null && params.name !== '') {
        input.name = params.name
      }
      if (params.color != null && params.color !== '') {
        input.color = params.color
      }
      if (params.description != null && params.description !== '') {
        input.description = params.description
      }
      if (params.position != null) {
        input.position = Number(params.position)
      }

      return {
        query: `
          mutation UpdateWorkflowState($id: String!, $input: WorkflowStateUpdateInput!) {
            workflowStateUpdate(id: $id, input: $input) {
              success
              workflowState {
                id
                name
                type
                color
                position
                team {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: {
          id: params.stateId,
          input,
        },
      }
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()

    if (data.errors) {
      return {
        success: false,
        error: data.errors[0]?.message || 'Failed to update workflow state',
        output: {},
      }
    }

    const result = data.data.workflowStateUpdate
    if (!result.success) {
      return {
        success: false,
        error: 'Workflow state update was not successful',
        output: {},
      }
    }

    return {
      success: true,
      output: {
        state: result.workflowState,
      },
    }
  },

  outputs: {
    state: {
      type: 'object',
      description: 'The updated workflow state',
      properties: {
        id: { type: 'string', description: 'State ID' },
        name: { type: 'string', description: 'State name' },
        type: { type: 'string', description: 'State type' },
        color: { type: 'string', description: 'State color' },
        position: { type: 'number', description: 'State position' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_profile.ts]---
Location: sim-main/apps/sim/tools/linkedin/get_profile.ts

```typescript
import type { GetProfileParams, GetProfileResponse } from '@/tools/linkedin/types'
import type { ToolConfig } from '@/tools/types'

export const linkedInGetProfileTool: ToolConfig<GetProfileParams, GetProfileResponse> = {
  id: 'linkedin_get_profile',
  name: 'Get LinkedIn Profile',
  description: 'Retrieve your LinkedIn profile information',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linkedin',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for LinkedIn API',
    },
  },

  request: {
    url: () => 'https://api.linkedin.com/v2/userinfo',
    method: 'GET',
    headers: (params: GetProfileParams): Record<string, string> => ({
      Authorization: `Bearer ${params.accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    }),
  },

  transformResponse: async (response: Response): Promise<GetProfileResponse> => {
    if (!response.ok) {
      return {
        success: false,
        output: {},
        error: `Failed to get profile: ${response.statusText}`,
      }
    }

    const profile = await response.json()

    return {
      success: true,
      output: {
        profile: {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        },
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/linkedin/index.ts

```typescript
export { linkedInGetProfileTool } from './get_profile'
export { linkedInSharePostTool } from './share_post'
```

--------------------------------------------------------------------------------

---[FILE: share_post.ts]---
Location: sim-main/apps/sim/tools/linkedin/share_post.ts

```typescript
import type {
  LinkedInProfileOutput,
  ProfileIdExtractor,
  SharePostParams,
  SharePostResponse,
} from '@/tools/linkedin/types'
import type { ToolConfig } from '@/tools/types'

// Helper function to extract profile ID from various response formats
const extractProfileId: ProfileIdExtractor = (output: unknown): string | null => {
  if (typeof output === 'object' && output !== null) {
    const profileOutput = output as LinkedInProfileOutput
    return profileOutput.profile?.id || profileOutput.sub || profileOutput.id || null
  }
  return null
}

export const linkedInSharePostTool: ToolConfig<SharePostParams, SharePostResponse> = {
  id: 'linkedin_share_post',
  name: 'Share Post on LinkedIn',
  description: 'Share a post to your personal LinkedIn feed',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'linkedin',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Access token for LinkedIn API',
    },
    text: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The text content of your LinkedIn post',
    },
    visibility: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Who can see this post: "PUBLIC" or "CONNECTIONS" (default: "PUBLIC")',
    },
  },

  // First request: Get user profile to obtain the person URN
  request: {
    url: () => 'https://api.linkedin.com/v2/userinfo',
    method: 'GET',
    headers: (params: SharePostParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'X-Restli-Protocol-Version': '2.0.0',
    }),
  },

  // Use postProcess to make the actual post creation request
  postProcess: async (profileResult, params, executeTool) => {
    try {
      // Extract profile from the first request
      if (!profileResult.success || !profileResult.output) {
        return {
          success: false,
          output: {},
          error: 'Failed to fetch user profile',
        }
      }

      // Get profile data from output
      const profileOutput = profileResult.output as LinkedInProfileOutput
      const authorId = extractProfileId(profileOutput)

      if (!authorId) {
        return {
          success: false,
          output: {},
          error: 'Could not extract LinkedIn profile ID from response',
        }
      }

      const authorUrn = `urn:li:person:${authorId}`

      // Create the post
      const postData = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: params.text,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': params.visibility || 'PUBLIC',
        },
      }

      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const error = await response.text()
        return {
          success: false,
          output: {},
          error: `LinkedIn API error: ${error}`,
        }
      }

      const result = await response.json()

      return {
        success: true,
        output: {
          postId: result.id,
        },
      }
    } catch (error) {
      return {
        success: false,
        output: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  },

  transformResponse: async (response: Response): Promise<SharePostResponse> => {
    // This handles the initial profile fetch response
    if (!response.ok) {
      return {
        success: false,
        output: {},
        error: `Failed to fetch profile: ${response.statusText}`,
      }
    }

    const profile = await response.json()

    // Return profile data for postProcess to use
    return {
      success: true,
      output: profile,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/linkedin/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface LinkedInProfile {
  sub: string
  name: string
  given_name: string
  family_name: string
  email?: string
  picture?: string
  email_verified?: boolean
}

export interface LinkedInPost {
  author: string // URN format: urn:li:person:abc123
  lifecycleState: 'PUBLISHED'
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: {
        text: string
      }
      shareMediaCategory: 'NONE' | 'ARTICLE' | 'IMAGE'
      media?: Array<{
        status: 'READY'
        description: {
          text: string
        }
        media: string // URN format
        title: {
          text: string
        }
      }>
    }
  }
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' | 'CONNECTIONS'
  }
}

export type LinkedInResponse = {
  success: boolean
  output: {
    postId?: string
    profile?: {
      id: string
      name: string
      email?: string
      picture?: string
    }
  }
  error?: string
}

// Tool-specific type definitions
export interface LinkedInProfileOutput {
  profile?: {
    id: string
    name?: string
    email?: string
    picture?: string
  }
  sub?: string
  id?: string
  [key: string]: unknown
}

export interface SharePostParams {
  accessToken: string
  text: string
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN'
  mediaUrls?: string
}

export interface SharePostResponse extends ToolResponse {
  output: {
    postId?: string
    postUrl?: string
    visibility?: string
  }
}

export interface GetProfileParams {
  accessToken: string
}

export interface GetProfileResponse extends ToolResponse {
  output: LinkedInProfileOutput
}

export type ProfileIdExtractor = (output: unknown) => string | null
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/linkup/index.ts

```typescript
import { searchTool } from '@/tools/linkup/search'

export const linkupSearchTool = searchTool
```

--------------------------------------------------------------------------------

---[FILE: search.ts]---
Location: sim-main/apps/sim/tools/linkup/search.ts

```typescript
import type {
  LinkupSearchParams,
  LinkupSearchResponse,
  LinkupSearchToolResponse,
} from '@/tools/linkup/types'
import type { ToolConfig } from '@/tools/types'

export const searchTool: ToolConfig<LinkupSearchParams, LinkupSearchToolResponse> = {
  id: 'linkup_search',
  name: 'Linkup Search',
  description: 'Search the web for information using Linkup',
  version: '1.0.0',

  params: {
    q: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The search query',
    },
    depth: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Search depth (has to either be "standard" or "deep")',
    },
    outputType: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Type of output to return (has to be "sourcedAnswer" or "searchResults")',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Enter your Linkup API key',
    },
    includeImages: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether to include images in search results',
    },
    fromDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Start date for filtering results (YYYY-MM-DD format)',
    },
    toDate: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'End date for filtering results (YYYY-MM-DD format)',
    },
    excludeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of domain names to exclude from search results',
    },
    includeDomains: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Comma-separated list of domain names to restrict search results to',
    },
    includeInlineCitations: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description:
        'Add inline citations to answers (only applies when outputType is "sourcedAnswer")',
    },
    includeSources: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Include sources in response',
    },
  },

  request: {
    url: 'https://api.linkup.so/v1/search',
    method: 'POST',
    headers: (params) => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey}`,
    }),
    body: (params) => {
      const body: Record<string, any> = {
        q: params.q,
        depth: params.depth,
        outputType: params.outputType,
      }

      if (params.includeImages !== undefined) body.includeImages = params.includeImages
      if (params.fromDate) body.fromDate = params.fromDate
      if (params.toDate) body.toDate = params.toDate

      if (params.excludeDomains) {
        body.excludeDomains = params.excludeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }

      if (params.includeDomains) {
        body.includeDomains = params.includeDomains
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 0)
      }

      if (params.includeInlineCitations !== undefined)
        body.includeInlineCitations = params.includeInlineCitations

      if (params.includeSources !== undefined) body.includeSources = params.includeSources

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data: LinkupSearchResponse = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    answer: {
      type: 'string',
      description: 'The sourced answer to the search query',
    },
    sources: {
      type: 'array',
      description:
        'Array of sources used to compile the answer, each containing name, url, and snippet',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/linkup/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface LinkupSource {
  name: string
  url: string
  snippet: string
}

export interface LinkupSearchParams {
  q: string
  apiKey: string
  depth?: 'standard' | 'deep'
  outputType?: 'sourcedAnswer' | 'searchResults'
  includeImages?: boolean
  fromDate?: string
  toDate?: string
  excludeDomains?: string
  includeDomains?: string
  includeInlineCitations?: boolean
  includeSources?: boolean
}

export interface LinkupSearchResponse {
  answer?: string
  sources?: LinkupSource[]
  results?: any[]
  [key: string]: any
}

export interface LinkupSearchToolResponse extends ToolResponse {
  output: LinkupSearchResponse
}
```

--------------------------------------------------------------------------------

---[FILE: chat.ts]---
Location: sim-main/apps/sim/tools/llm/chat.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getProviderFromModel } from '@/providers/utils'
import type { ToolConfig, ToolResponse } from '@/tools/types'

const logger = createLogger('LLMChatTool')

interface LLMChatParams {
  model: string
  systemPrompt?: string
  context: string
  apiKey?: string
  temperature?: number
  maxTokens?: number
  azureEndpoint?: string
  azureApiVersion?: string
  vertexProject?: string
  vertexLocation?: string
}

interface LLMChatResponse extends ToolResponse {
  output: {
    content: string
    model: string
    tokens?: {
      prompt?: number
      completion?: number
      total?: number
    }
  }
}

export const llmChatTool: ToolConfig<LLMChatParams, LLMChatResponse> = {
  id: 'llm_chat',
  name: 'LLM Chat',
  description: 'Send a chat completion request to any supported LLM provider',
  version: '1.0.0',

  params: {
    model: {
      type: 'string',
      required: true,
      description: 'The model to use (e.g., gpt-4o, claude-sonnet-4-5, gemini-2.0-flash)',
    },
    systemPrompt: {
      type: 'string',
      required: false,
      description: 'System prompt to set the behavior of the assistant',
    },
    context: {
      type: 'string',
      required: true,
      description: 'The user message or context to send to the model',
    },
    apiKey: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'API key for the provider (uses platform key if not provided for hosted models)',
    },
    temperature: {
      type: 'number',
      required: false,
      description: 'Temperature for response generation (0-2)',
    },
    maxTokens: {
      type: 'number',
      required: false,
      description: 'Maximum tokens in the response',
    },
    azureEndpoint: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Azure OpenAI endpoint URL',
    },
    azureApiVersion: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Azure OpenAI API version',
    },
    vertexProject: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Google Cloud project ID for Vertex AI',
    },
    vertexLocation: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Google Cloud location for Vertex AI (defaults to us-central1)',
    },
  },

  request: {
    url: () => '/api/providers',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const provider = getProviderFromModel(params.model)

      return {
        provider,
        model: params.model,
        systemPrompt: params.systemPrompt,
        context: JSON.stringify([{ role: 'user', content: params.context }]),
        apiKey: params.apiKey,
        temperature: params.temperature,
        maxTokens: params.maxTokens,
        azureEndpoint: params.azureEndpoint,
        azureApiVersion: params.azureApiVersion,
        vertexProject: params.vertexProject,
        vertexLocation: params.vertexLocation,
      }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `LLM API error: ${response.status}`
      logger.error('LLM chat request failed', { error: errorMessage })
      throw new Error(errorMessage)
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        content: data.content,
        model: data.model,
        tokens: data.tokens,
      },
    }
  },

  outputs: {
    content: { type: 'string', description: 'The generated response content' },
    model: { type: 'string', description: 'The model used for generation' },
    tokens: { type: 'object', description: 'Token usage information' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/llm/index.ts

```typescript
export { llmChatTool } from './chat'
```

--------------------------------------------------------------------------------

---[FILE: add_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/add_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpAddMember')

export interface MailchimpAddMemberParams {
  apiKey: string
  listId: string
  emailAddress: string
  status: string
  mergeFields?: string
  interests?: string
}

export interface MailchimpAddMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'add_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpAddMemberTool: ToolConfig<
  MailchimpAddMemberParams,
  MailchimpAddMemberResponse
> = {
  id: 'mailchimp_add_member',
  name: 'Add Member to Mailchimp Audience',
  description: 'Add a new member to a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    emailAddress: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Member email address',
    },
    status: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Subscriber status',
    },
    mergeFields: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of merge fields',
    },
    interests: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of interests',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/members`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        email_address: params.emailAddress,
        status: params.status,
      }

      if (params.mergeFields) {
        try {
          body.merge_fields = JSON.parse(params.mergeFields)
        } catch (error) {
          logger.warn('Failed to parse merge fields', { error })
        }
      }

      if (params.interests) {
        try {
          body.interests = JSON.parse(params.interests)
        } catch (error) {
          logger.warn('Failed to parse interests', { error })
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'add_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'add_member' as const,
          subscriberHash: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Added member data',
      properties: {
        member: { type: 'object', description: 'Added member object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_member_tags.ts]---
Location: sim-main/apps/sim/tools/mailchimp/add_member_tags.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpAddMemberTags')

export interface MailchimpAddMemberTagsParams {
  apiKey: string
  listId: string
  subscriberEmail: string
  tags: string
}

export interface MailchimpAddMemberTagsResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'add_member_tags'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpAddMemberTagsTool: ToolConfig<
  MailchimpAddMemberTagsParams,
  MailchimpAddMemberTagsResponse
> = {
  id: 'mailchimp_add_member_tags',
  name: 'Add Tags to Member in Mailchimp',
  description: 'Add tags to a member in a Mailchimp audience',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    listId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the list',
    },
    subscriberEmail: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Member email address or MD5 hash',
    },
    tags: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON array of tags',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/members/${params.subscriberEmail}/tags`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let tags = []
      try {
        tags = JSON.parse(params.tags)
      } catch (error) {
        logger.warn('Failed to parse tags', { error })
      }

      return { tags }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'add_member_tags')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'add_member_tags' as const,
          subscriberHash: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Tag addition confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
