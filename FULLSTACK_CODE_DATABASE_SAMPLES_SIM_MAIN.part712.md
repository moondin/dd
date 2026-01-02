---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 712
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 712 of 933)

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

---[FILE: create_template.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_template.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateTemplate')

export interface MailchimpCreateTemplateParams {
  apiKey: string
  templateName: string
  templateHtml: string
}

export interface MailchimpCreateTemplateResponse {
  success: boolean
  output: {
    template: any
    metadata: {
      operation: 'create_template'
      templateId: string
    }
    success: boolean
  }
}

export const mailchimpCreateTemplateTool: ToolConfig<
  MailchimpCreateTemplateParams,
  MailchimpCreateTemplateResponse
> = {
  id: 'mailchimp_create_template',
  name: 'Create Template in Mailchimp',
  description: 'Create a new template in Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    templateName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the template',
    },
    templateHtml: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The HTML content for the template',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, '/templates'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      name: params.templateName,
      html: params.templateHtml,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_template')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        template: data,
        metadata: {
          operation: 'create_template' as const,
          templateId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created template data',
      properties: {
        template: { type: 'object', description: 'Created template object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_audience.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_audience.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteAudience')

export interface MailchimpDeleteAudienceParams {
  apiKey: string
  listId: string
}

export interface MailchimpDeleteAudienceResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_audience'
      listId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteAudienceTool: ToolConfig<
  MailchimpDeleteAudienceParams,
  MailchimpDeleteAudienceResponse
> = {
  id: 'mailchimp_delete_audience',
  name: 'Delete Audience from Mailchimp',
  description: 'Delete an audience (list) from Mailchimp',
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
      description: 'The unique ID for the list to delete',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_audience')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_audience' as const,
          listId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_batch_operation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_batch_operation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteBatchOperation')

export interface MailchimpDeleteBatchOperationParams {
  apiKey: string
  batchId: string
}

export interface MailchimpDeleteBatchOperationResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_batch_operation'
      batchId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteBatchOperationTool: ToolConfig<
  MailchimpDeleteBatchOperationParams,
  MailchimpDeleteBatchOperationResponse
> = {
  id: 'mailchimp_delete_batch_operation',
  name: 'Delete Batch Operation from Mailchimp',
  description: 'Delete a batch operation from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    batchId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the batch operation to delete',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/batches/${params.batchId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_batch_operation')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_batch_operation' as const,
          batchId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteCampaign')

export interface MailchimpDeleteCampaignParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpDeleteCampaignResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteCampaignTool: ToolConfig<
  MailchimpDeleteCampaignParams,
  MailchimpDeleteCampaignResponse
> = {
  id: 'mailchimp_delete_campaign',
  name: 'Delete Campaign from Mailchimp',
  description: 'Delete a campaign from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the campaign to delete',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_campaign')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_campaign' as const,
          campaignId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_interest.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_interest.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteInterest')

export interface MailchimpDeleteInterestParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  interestId: string
}

export interface MailchimpDeleteInterestResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_interest'
      interestId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteInterestTool: ToolConfig<
  MailchimpDeleteInterestParams,
  MailchimpDeleteInterestResponse
> = {
  id: 'mailchimp_delete_interest',
  name: 'Delete Interest from Mailchimp Interest Category',
  description: 'Delete an interest from an interest category in a Mailchimp audience',
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
    interestCategoryId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest category',
    },
    interestId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest to delete',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}/interests/${params.interestId}`
      ),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_interest')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_interest' as const,
          interestId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_interest_category.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_interest_category.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteInterestCategory')

export interface MailchimpDeleteInterestCategoryParams {
  apiKey: string
  listId: string
  interestCategoryId: string
}

export interface MailchimpDeleteInterestCategoryResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_interest_category'
      interestCategoryId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteInterestCategoryTool: ToolConfig<
  MailchimpDeleteInterestCategoryParams,
  MailchimpDeleteInterestCategoryResponse
> = {
  id: 'mailchimp_delete_interest_category',
  name: 'Delete Interest Category from Mailchimp Audience',
  description: 'Delete an interest category from a Mailchimp audience',
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
    interestCategoryId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the interest category to delete',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}`
      ),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_interest_category')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_interest_category' as const,
          interestCategoryId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteLandingPage')

export interface MailchimpDeleteLandingPageParams {
  apiKey: string
  pageId: string
}

export interface MailchimpDeleteLandingPageResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteLandingPageTool: ToolConfig<
  MailchimpDeleteLandingPageParams,
  MailchimpDeleteLandingPageResponse
> = {
  id: 'mailchimp_delete_landing_page',
  name: 'Delete Landing Page from Mailchimp',
  description: 'Delete a landing page from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    pageId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the landing page to delete',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/landing-pages/${params.pageId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_landing_page')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_landing_page' as const,
          pageId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteMember')

export interface MailchimpDeleteMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
}

export interface MailchimpDeleteMemberResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpDeleteMemberTool: ToolConfig<
  MailchimpDeleteMemberParams,
  MailchimpDeleteMemberResponse
> = {
  id: 'mailchimp_delete_member',
  name: 'Delete Member from Mailchimp Audience',
  description: 'Delete a member from a Mailchimp audience',
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
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/members/${params.subscriberEmail}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_member')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_member' as const,
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
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_merge_field.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_merge_field.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteMergeField')

export interface MailchimpDeleteMergeFieldParams {
  apiKey: string
  listId: string
  mergeId: string
}

export interface MailchimpDeleteMergeFieldResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_merge_field'
      mergeId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteMergeFieldTool: ToolConfig<
  MailchimpDeleteMergeFieldParams,
  MailchimpDeleteMergeFieldResponse
> = {
  id: 'mailchimp_delete_merge_field',
  name: 'Delete Merge Field from Mailchimp Audience',
  description: 'Delete a merge field from a Mailchimp audience',
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
    mergeId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the merge field to delete',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/merge-fields/${params.mergeId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_merge_field')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_merge_field' as const,
          mergeId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_segment.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_segment.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteSegment')

export interface MailchimpDeleteSegmentParams {
  apiKey: string
  listId: string
  segmentId: string
}

export interface MailchimpDeleteSegmentResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_segment'
      segmentId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteSegmentTool: ToolConfig<
  MailchimpDeleteSegmentParams,
  MailchimpDeleteSegmentResponse
> = {
  id: 'mailchimp_delete_segment',
  name: 'Delete Segment from Mailchimp Audience',
  description: 'Delete a segment from a Mailchimp audience',
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
    segmentId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the segment to delete',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/segments/${params.segmentId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_segment')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_segment' as const,
          segmentId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_template.ts]---
Location: sim-main/apps/sim/tools/mailchimp/delete_template.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpDeleteTemplate')

export interface MailchimpDeleteTemplateParams {
  apiKey: string
  templateId: string
}

export interface MailchimpDeleteTemplateResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'delete_template'
      templateId: string
    }
    success: boolean
  }
}

export const mailchimpDeleteTemplateTool: ToolConfig<
  MailchimpDeleteTemplateParams,
  MailchimpDeleteTemplateResponse
> = {
  id: 'mailchimp_delete_template',
  name: 'Delete Template from Mailchimp',
  description: 'Delete a template from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    templateId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the template to delete',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/templates/${params.templateId}`),
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'delete_template')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'delete_template' as const,
          templateId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Deletion confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_audience.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_audience.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAudience } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetAudience')

export interface MailchimpGetAudienceParams {
  apiKey: string
  listId: string
}

export interface MailchimpGetAudienceResponse {
  success: boolean
  output: {
    list: MailchimpAudience
    metadata: {
      operation: 'get_audience'
      listId: string
    }
    success: boolean
  }
}

export const mailchimpGetAudienceTool: ToolConfig<
  MailchimpGetAudienceParams,
  MailchimpGetAudienceResponse
> = {
  id: 'mailchimp_get_audience',
  name: 'Get Audience from Mailchimp',
  description: 'Retrieve details of a specific audience (list) from Mailchimp',
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
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_audience')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        list: data,
        metadata: {
          operation: 'get_audience' as const,
          listId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Audience data and metadata',
      properties: {
        list: { type: 'object', description: 'Audience/list object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_audiences.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_audiences.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAudience } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetAudiences')

export interface MailchimpGetAudiencesParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetAudiencesResponse {
  success: boolean
  output: {
    lists: MailchimpAudience[]
    totalItems: number
    metadata: {
      operation: 'get_audiences'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetAudiencesTool: ToolConfig<
  MailchimpGetAudiencesParams,
  MailchimpGetAudiencesResponse
> = {
  id: 'mailchimp_get_audiences',
  name: 'Get Audiences from Mailchimp',
  description: 'Retrieve a list of audiences (lists) from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/lists')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_audiences')
    }

    const data = await response.json()
    const lists = data.lists || []

    return {
      success: true,
      output: {
        lists,
        totalItems: data.total_items || lists.length,
        metadata: {
          operation: 'get_audiences' as const,
          totalReturned: lists.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Audiences data and metadata',
      properties: {
        lists: { type: 'array', description: 'Array of audience/list objects' },
        totalItems: { type: 'number', description: 'Total number of lists' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_automation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_automation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAutomation } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetAutomation')

export interface MailchimpGetAutomationParams {
  apiKey: string
  workflowId: string
}

export interface MailchimpGetAutomationResponse {
  success: boolean
  output: {
    automation: MailchimpAutomation
    metadata: {
      operation: 'get_automation'
      workflowId: string
    }
    success: boolean
  }
}

export const mailchimpGetAutomationTool: ToolConfig<
  MailchimpGetAutomationParams,
  MailchimpGetAutomationResponse
> = {
  id: 'mailchimp_get_automation',
  name: 'Get Automation from Mailchimp',
  description: 'Retrieve details of a specific automation from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    workflowId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the automation workflow',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/automations/${params.workflowId}`),
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_automation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        automation: data,
        metadata: {
          operation: 'get_automation' as const,
          workflowId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Automation data and metadata',
      properties: {
        automation: { type: 'object', description: 'Automation object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_automations.ts]---
Location: sim-main/apps/sim/tools/mailchimp/get_automations.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAutomation } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpGetAutomations')

export interface MailchimpGetAutomationsParams {
  apiKey: string
  count?: string
  offset?: string
}

export interface MailchimpGetAutomationsResponse {
  success: boolean
  output: {
    automations: MailchimpAutomation[]
    totalItems: number
    metadata: {
      operation: 'get_automations'
      totalReturned: number
    }
    success: boolean
  }
}

export const mailchimpGetAutomationsTool: ToolConfig<
  MailchimpGetAutomationsParams,
  MailchimpGetAutomationsResponse
> = {
  id: 'mailchimp_get_automations',
  name: 'Get Automations from Mailchimp',
  description: 'Retrieve a list of automations from Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    count: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results (default: 10, max: 1000)',
    },
    offset: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Number of results to skip',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.count) queryParams.append('count', params.count)
      if (params.offset) queryParams.append('offset', params.offset)

      const query = queryParams.toString()
      const url = buildMailchimpUrl(params.apiKey, '/automations')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'get_automations')
    }

    const data = await response.json()
    const automations = data.automations || []

    return {
      success: true,
      output: {
        automations,
        totalItems: data.total_items || automations.length,
        metadata: {
          operation: 'get_automations' as const,
          totalReturned: automations.length,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Automations data and metadata',
      properties: {
        automations: { type: 'array', description: 'Array of automation objects' },
        totalItems: { type: 'number', description: 'Total number of automations' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
