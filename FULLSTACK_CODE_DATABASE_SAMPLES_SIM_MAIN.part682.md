---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 682
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 682 of 933)

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

---[FILE: get_responses.ts]---
Location: sim-main/apps/sim/tools/google_form/get_responses.ts

```typescript
import type {
  GoogleFormsGetResponsesParams,
  GoogleFormsResponse,
  GoogleFormsResponseList,
} from '@/tools/google_form/types'
import { buildGetResponseUrl, buildListResponsesUrl } from '@/tools/google_form/utils'
import type { ToolConfig } from '@/tools/types'

export const getResponsesTool: ToolConfig<GoogleFormsGetResponsesParams> = {
  id: 'google_forms_get_responses',
  name: 'Google Forms: Get Responses',
  description: 'Retrieve a single response or list responses from a Google Form',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-forms',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth2 access token',
    },
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Google Form',
    },
    responseId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'If provided, returns this specific response',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description:
        'Maximum number of responses to return (service may return fewer). Defaults to 5000.',
    },
  },

  request: {
    url: (params: GoogleFormsGetResponsesParams) =>
      params.responseId
        ? buildGetResponseUrl({ formId: params.formId, responseId: params.responseId })
        : buildListResponsesUrl({
            formId: params.formId,
            pageSize: params.pageSize ? Number(params.pageSize) : undefined,
          }),
    method: 'GET',
    headers: (params: GoogleFormsGetResponsesParams) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params?: GoogleFormsGetResponsesParams) => {
    const data = (await response.json()) as unknown

    if (!response.ok) {
      let errorMessage = response.statusText || 'Failed to fetch responses'
      if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>
        const error = record.error as { message?: string } | undefined
        if (error?.message) {
          errorMessage = error.message
        }
      }

      return {
        success: false,
        output: (data as Record<string, unknown>) || {},
        error: errorMessage,
      }
    }

    // Normalize answers into a flat key/value map per response
    const normalizeAnswerContainer = (container: unknown): unknown => {
      if (!container || typeof container !== 'object') return container
      const record = container as Record<string, unknown>
      const answers = record.answers as unknown[] | undefined
      if (Array.isArray(answers)) {
        const values = answers.map((entry) => {
          if (entry && typeof entry === 'object') {
            const er = entry as Record<string, unknown>
            if (typeof er.value !== 'undefined') return er.value
          }
          return entry
        })
        return values.length === 1 ? values[0] : values
      }
      return container
    }

    const normalizeAnswers = (answers: unknown): Record<string, unknown> => {
      if (!answers || typeof answers !== 'object') return {}
      const src = answers as Record<string, unknown>
      const out: Record<string, unknown> = {}
      for (const [questionId, answerObj] of Object.entries(src)) {
        if (answerObj && typeof answerObj === 'object') {
          const aRec = answerObj as Record<string, unknown>
          // Find first *Answers property that contains an answers array
          const key = Object.keys(aRec).find(
            (k) => k.toLowerCase().endsWith('answers') && Array.isArray((aRec[k] as any)?.answers)
          )
          if (key) {
            out[questionId] = normalizeAnswerContainer(aRec[key])
            continue
          }
        }
        out[questionId] = answerObj as unknown
      }
      return out
    }

    const normalizeResponse = (r: GoogleFormsResponse): Record<string, unknown> => ({
      responseId: r.responseId,
      createTime: r.createTime,
      lastSubmittedTime: r.lastSubmittedTime,
      answers: normalizeAnswers(r.answers as unknown),
    })

    // Distinguish single vs list response shapes
    const isList = (obj: unknown): obj is GoogleFormsResponseList =>
      !!obj && typeof obj === 'object' && Array.isArray((obj as GoogleFormsResponseList).responses)

    if (isList(data)) {
      const listData = data as GoogleFormsResponseList
      const toTimestamp = (s?: string): number => {
        if (!s) return 0
        const t = Date.parse(s)
        return Number.isNaN(t) ? 0 : t
      }
      const sorted = (listData.responses || [])
        .slice()
        .sort(
          (a, b) =>
            toTimestamp(b.lastSubmittedTime || b.createTime) -
            toTimestamp(a.lastSubmittedTime || a.createTime)
        )
      const normalized = sorted.map((r) => normalizeResponse(r))
      return {
        success: true,
        output: {
          responses: normalized,
          raw: listData,
        } as unknown as Record<string, unknown>,
      }
    }

    const single = data as GoogleFormsResponse
    const normalizedSingle = normalizeResponse(single)

    return {
      success: true,
      output: {
        response: normalizedSingle,
        raw: single,
      } as unknown as Record<string, unknown>,
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_form/index.ts

```typescript
import { getResponsesTool } from '@/tools/google_form/get_responses'

export const googleFormsGetResponsesTool = getResponsesTool
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_form/types.ts

```typescript
export interface GoogleFormsResponse {
  responseId?: string
  createTime?: string
  lastSubmittedTime?: string
  answers?: Record<string, unknown>
  respondentEmail?: string
  totalScore?: number
  [key: string]: unknown
}

export interface GoogleFormsResponseList {
  responses?: GoogleFormsResponse[]
  nextPageToken?: string
}

export interface GoogleFormsGetResponsesParams {
  accessToken: string
  formId: string
  responseId?: string
  pageSize?: number
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/google_form/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

export const FORMS_API_BASE = 'https://forms.googleapis.com/v1'

const logger = createLogger('GoogleFormsUtils')

export function buildListResponsesUrl(params: { formId: string; pageSize?: number }): string {
  const { formId, pageSize } = params
  const url = new URL(`${FORMS_API_BASE}/forms/${encodeURIComponent(formId)}/responses`)
  if (pageSize && pageSize > 0) {
    const limited = Math.min(pageSize, 5000)
    url.searchParams.set('pageSize', String(limited))
  }
  const finalUrl = url.toString()
  logger.debug('Built Google Forms list responses URL', { finalUrl })
  return finalUrl
}

export function buildGetResponseUrl(params: { formId: string; responseId: string }): string {
  const { formId, responseId } = params
  const finalUrl = `${FORMS_API_BASE}/forms/${encodeURIComponent(formId)}/responses/${encodeURIComponent(responseId)}`
  logger.debug('Built Google Forms get response URL', { finalUrl })
  return finalUrl
}
```

--------------------------------------------------------------------------------

---[FILE: add_member.ts]---
Location: sim-main/apps/sim/tools/google_groups/add_member.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsAddMemberParams, GoogleGroupsResponse } from './types'

export const addMemberTool: ToolConfig<GoogleGroupsAddMemberParams, GoogleGroupsResponse> = {
  id: 'google_groups_add_member',
  name: 'Google Groups Add Member',
  description: 'Add a new member to a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    email: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email address of the member to add',
    },
    role: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Role for the member (MEMBER, MANAGER, or OWNER). Defaults to MEMBER.',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/members`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, string> = {
        email: params.email,
        role: params.role || 'MEMBER',
      }

      return JSON.stringify(body)
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to add member to group')
    }
    return {
      success: true,
      output: { member: data },
    }
  },

  outputs: {
    member: { type: 'json', description: 'Added member object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_group.ts]---
Location: sim-main/apps/sim/tools/google_groups/create_group.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsCreateParams, GoogleGroupsResponse } from './types'

export const createGroupTool: ToolConfig<GoogleGroupsCreateParams, GoogleGroupsResponse> = {
  id: 'google_groups_create_group',
  name: 'Google Groups Create Group',
  description: 'Create a new Google Group in the domain',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    email: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email address for the new group (e.g., team@yourdomain.com)',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Display name for the group',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description of the group',
    },
  },

  request: {
    url: () => 'https://admin.googleapis.com/admin/directory/v1/groups',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, string> = {
        email: params.email,
        name: params.name,
      }

      if (params.description) {
        body.description = params.description
      }

      return JSON.stringify(body)
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create group')
    }
    return {
      success: true,
      output: { group: data },
    }
  },

  outputs: {
    group: { type: 'json', description: 'Created group object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_group.ts]---
Location: sim-main/apps/sim/tools/google_groups/delete_group.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsDeleteParams, GoogleGroupsResponse } from './types'

export const deleteGroupTool: ToolConfig<GoogleGroupsDeleteParams, GoogleGroupsResponse> = {
  id: 'google_groups_delete_group',
  name: 'Google Groups Delete Group',
  description: 'Delete a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID to delete',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || 'Failed to delete group')
    }
    return {
      success: true,
      output: { message: 'Group deleted successfully' },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_group.ts]---
Location: sim-main/apps/sim/tools/google_groups/get_group.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsGetParams, GoogleGroupsResponse } from './types'

export const getGroupTool: ToolConfig<GoogleGroupsGetParams, GoogleGroupsResponse> = {
  id: 'google_groups_get_group',
  name: 'Google Groups Get Group',
  description: 'Get details of a specific Google Group by email or group ID',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get group')
    }
    return {
      success: true,
      output: { group: data },
    }
  },

  outputs: {
    group: { type: 'json', description: 'Group object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_member.ts]---
Location: sim-main/apps/sim/tools/google_groups/get_member.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsGetMemberParams, GoogleGroupsResponse } from './types'

export const getMemberTool: ToolConfig<GoogleGroupsGetMemberParams, GoogleGroupsResponse> = {
  id: 'google_groups_get_member',
  name: 'Google Groups Get Member',
  description: 'Get details of a specific member in a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    memberKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Member email address or unique member ID',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      const encodedMemberKey = encodeURIComponent(params.memberKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/members/${encodedMemberKey}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get group member')
    }
    return {
      success: true,
      output: { member: data },
    }
  },

  outputs: {
    member: { type: 'json', description: 'Member object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: has_member.ts]---
Location: sim-main/apps/sim/tools/google_groups/has_member.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsHasMemberParams, GoogleGroupsResponse } from './types'

export const hasMemberTool: ToolConfig<GoogleGroupsHasMemberParams, GoogleGroupsResponse> = {
  id: 'google_groups_has_member',
  name: 'Google Groups Has Member',
  description: 'Check if a user is a member of a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    memberKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Member email address or unique member ID to check',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      const encodedMemberKey = encodeURIComponent(params.memberKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/hasMember/${encodedMemberKey}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to check membership')
    }
    return {
      success: true,
      output: { isMember: data.isMember },
    }
  },

  outputs: {
    isMember: { type: 'boolean', description: 'Whether the user is a member of the group' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_groups/index.ts

```typescript
import { addMemberTool } from './add_member'
import { createGroupTool } from './create_group'
import { deleteGroupTool } from './delete_group'
import { getGroupTool } from './get_group'
import { getMemberTool } from './get_member'
import { hasMemberTool } from './has_member'
import { listGroupsTool } from './list_groups'
import { listMembersTool } from './list_members'
import { removeMemberTool } from './remove_member'
import { updateGroupTool } from './update_group'
import { updateMemberTool } from './update_member'

export const googleGroupsAddMemberTool = addMemberTool
export const googleGroupsCreateGroupTool = createGroupTool
export const googleGroupsDeleteGroupTool = deleteGroupTool
export const googleGroupsGetGroupTool = getGroupTool
export const googleGroupsGetMemberTool = getMemberTool
export const googleGroupsHasMemberTool = hasMemberTool
export const googleGroupsListGroupsTool = listGroupsTool
export const googleGroupsListMembersTool = listMembersTool
export const googleGroupsRemoveMemberTool = removeMemberTool
export const googleGroupsUpdateGroupTool = updateGroupTool
export const googleGroupsUpdateMemberTool = updateMemberTool
```

--------------------------------------------------------------------------------

---[FILE: list_groups.ts]---
Location: sim-main/apps/sim/tools/google_groups/list_groups.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsListParams, GoogleGroupsResponse } from './types'

export const listGroupsTool: ToolConfig<GoogleGroupsListParams, GoogleGroupsResponse> = {
  id: 'google_groups_list_groups',
  name: 'Google Groups List Groups',
  description: 'List all groups in a Google Workspace domain',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    customer: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Customer ID or "my_customer" for the authenticated user\'s domain',
    },
    domain: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Domain name to filter groups by',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (1-200)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Token for pagination',
    },
    query: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search query to filter groups (e.g., "email:admin*")',
    },
  },

  request: {
    url: (params) => {
      const url = new URL('https://admin.googleapis.com/admin/directory/v1/groups')

      // Use my_customer as default if no customer or domain specified
      if (params.customer) {
        url.searchParams.set('customer', params.customer)
      } else if (!params.domain) {
        url.searchParams.set('customer', 'my_customer')
      }

      if (params.domain) {
        url.searchParams.set('domain', params.domain)
      }
      if (params.maxResults) {
        url.searchParams.set('maxResults', String(params.maxResults))
      }
      if (params.pageToken) {
        url.searchParams.set('pageToken', params.pageToken)
      }
      if (params.query) {
        url.searchParams.set('query', params.query)
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list groups')
    }
    return {
      success: true,
      output: {
        groups: data.groups || [],
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    groups: { type: 'json', description: 'Array of group objects' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_members.ts]---
Location: sim-main/apps/sim/tools/google_groups/list_members.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsListMembersParams, GoogleGroupsResponse } from './types'

export const listMembersTool: ToolConfig<GoogleGroupsListMembersParams, GoogleGroupsResponse> = {
  id: 'google_groups_list_members',
  name: 'Google Groups List Members',
  description: 'List all members of a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    maxResults: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Maximum number of results to return (1-200)',
    },
    pageToken: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Token for pagination',
    },
    roles: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Filter by roles (comma-separated: OWNER, MANAGER, MEMBER)',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      const url = new URL(
        `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/members`
      )

      if (params.maxResults) {
        url.searchParams.set('maxResults', String(params.maxResults))
      }
      if (params.pageToken) {
        url.searchParams.set('pageToken', params.pageToken)
      }
      if (params.roles) {
        url.searchParams.set('roles', params.roles)
      }

      return url.toString()
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to list group members')
    }
    return {
      success: true,
      output: {
        members: data.members || [],
        nextPageToken: data.nextPageToken,
      },
    }
  },

  outputs: {
    members: { type: 'json', description: 'Array of member objects' },
    nextPageToken: { type: 'string', description: 'Token for fetching next page of results' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_member.ts]---
Location: sim-main/apps/sim/tools/google_groups/remove_member.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsRemoveMemberParams, GoogleGroupsResponse } from './types'

export const removeMemberTool: ToolConfig<GoogleGroupsRemoveMemberParams, GoogleGroupsResponse> = {
  id: 'google_groups_remove_member',
  name: 'Google Groups Remove Member',
  description: 'Remove a member from a Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    memberKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Email address or unique ID of the member to remove',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      const encodedMemberKey = encodeURIComponent(params.memberKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/members/${encodedMemberKey}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response) => {
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || 'Failed to remove member from group')
    }
    return {
      success: true,
      output: { message: 'Member removed successfully' },
    }
  },

  outputs: {
    message: { type: 'string', description: 'Success message' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_groups/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

/**
 * Common parameters for Google Groups API calls
 */
export interface GoogleGroupsCommonParams {
  accessToken: string
}

/**
 * Parameters for listing groups
 */
export interface GoogleGroupsListParams extends GoogleGroupsCommonParams {
  customer?: string
  domain?: string
  maxResults?: number
  pageToken?: string
  query?: string
}

/**
 * Parameters for getting a specific group
 */
export interface GoogleGroupsGetParams extends GoogleGroupsCommonParams {
  groupKey: string
}

/**
 * Parameters for creating a group
 */
export interface GoogleGroupsCreateParams extends GoogleGroupsCommonParams {
  email: string
  name: string
  description?: string
}

/**
 * Parameters for updating a group
 */
export interface GoogleGroupsUpdateParams extends GoogleGroupsCommonParams {
  groupKey: string
  name?: string
  description?: string
  email?: string
}

/**
 * Parameters for deleting a group
 */
export interface GoogleGroupsDeleteParams extends GoogleGroupsCommonParams {
  groupKey: string
}

/**
 * Parameters for listing group members
 */
export interface GoogleGroupsListMembersParams extends GoogleGroupsCommonParams {
  groupKey: string
  maxResults?: number
  pageToken?: string
  roles?: string
}

/**
 * Parameters for getting a specific member
 */
export interface GoogleGroupsGetMemberParams extends GoogleGroupsCommonParams {
  groupKey: string
  memberKey: string
}

/**
 * Parameters for adding a member to a group
 */
export interface GoogleGroupsAddMemberParams extends GoogleGroupsCommonParams {
  groupKey: string
  email: string
  role?: 'MEMBER' | 'MANAGER' | 'OWNER'
}

/**
 * Parameters for removing a member from a group
 */
export interface GoogleGroupsRemoveMemberParams extends GoogleGroupsCommonParams {
  groupKey: string
  memberKey: string
}

/**
 * Parameters for updating a member's role in a group
 */
export interface GoogleGroupsUpdateMemberParams extends GoogleGroupsCommonParams {
  groupKey: string
  memberKey: string
  role: 'MEMBER' | 'MANAGER' | 'OWNER'
}

/**
 * Parameters for checking if a user is a member of a group
 */
export interface GoogleGroupsHasMemberParams extends GoogleGroupsCommonParams {
  groupKey: string
  memberKey: string
}

/**
 * Standard response for Google Groups operations
 */
export interface GoogleGroupsResponse extends ToolResponse {
  output: Record<string, unknown>
}
```

--------------------------------------------------------------------------------

---[FILE: update_group.ts]---
Location: sim-main/apps/sim/tools/google_groups/update_group.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsResponse, GoogleGroupsUpdateParams } from './types'

export const updateGroupTool: ToolConfig<GoogleGroupsUpdateParams, GoogleGroupsResponse> = {
  id: 'google_groups_update_group',
  name: 'Google Groups Update Group',
  description: 'Update an existing Google Group',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New display name for the group',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New description for the group',
    },
    email: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'New email address for the group',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, string> = {}

      if (params.name) {
        body.name = params.name
      }
      if (params.description) {
        body.description = params.description
      }
      if (params.email) {
        body.email = params.email
      }

      return JSON.stringify(body)
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update group')
    }
    return {
      success: true,
      output: { group: data },
    }
  },

  outputs: {
    group: { type: 'json', description: 'Updated group object' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_member.ts]---
Location: sim-main/apps/sim/tools/google_groups/update_member.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { GoogleGroupsResponse, GoogleGroupsUpdateMemberParams } from './types'

export const updateMemberTool: ToolConfig<GoogleGroupsUpdateMemberParams, GoogleGroupsResponse> = {
  id: 'google_groups_update_member',
  name: 'Google Groups Update Member',
  description: "Update a member's role in a Google Group (promote or demote)",
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'google-groups',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token',
    },
    groupKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Group email address or unique group ID',
    },
    memberKey: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Member email address or unique member ID',
    },
    role: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'New role for the member (MEMBER, MANAGER, or OWNER)',
    },
  },

  request: {
    url: (params) => {
      const encodedGroupKey = encodeURIComponent(params.groupKey)
      const encodedMemberKey = encodeURIComponent(params.memberKey)
      return `https://admin.googleapis.com/admin/directory/v1/groups/${encodedGroupKey}/members/${encodedMemberKey}`
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      return JSON.stringify({
        role: params.role,
      })
    },
  },

  transformResponse: async (response) => {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update member role')
    }
    return {
      success: true,
      output: { member: data },
    }
  },

  outputs: {
    member: { type: 'json', description: 'Updated member object' },
  },
}
```

--------------------------------------------------------------------------------

````
