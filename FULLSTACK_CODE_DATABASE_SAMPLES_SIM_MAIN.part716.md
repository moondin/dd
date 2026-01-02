---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 716
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 716 of 933)

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

---[FILE: update_audience.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_audience.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAudience } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateAudience')

export interface MailchimpUpdateAudienceParams {
  apiKey: string
  listId: string
  audienceName?: string
  permissionReminder?: string
  campaignDefaults?: string
  emailTypeOption?: string
}

export interface MailchimpUpdateAudienceResponse {
  success: boolean
  output: {
    list: MailchimpAudience
    metadata: {
      operation: 'update_audience'
      listId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateAudienceTool: ToolConfig<
  MailchimpUpdateAudienceParams,
  MailchimpUpdateAudienceResponse
> = {
  id: 'mailchimp_update_audience',
  name: 'Update Audience in Mailchimp',
  description: 'Update an existing audience (list) in Mailchimp',
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
    audienceName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the list',
    },
    permissionReminder: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Permission reminder text',
    },
    campaignDefaults: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of default campaign settings',
    },
    emailTypeOption: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Support multiple email formats',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.audienceName) body.name = params.audienceName
      if (params.permissionReminder) body.permission_reminder = params.permissionReminder
      if (params.emailTypeOption !== undefined)
        body.email_type_option = params.emailTypeOption === 'true'

      if (params.campaignDefaults) {
        try {
          body.campaign_defaults = JSON.parse(params.campaignDefaults)
        } catch (error) {
          logger.warn('Failed to parse campaign defaults', { error })
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_audience')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        list: data,
        metadata: {
          operation: 'update_audience' as const,
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
      description: 'Updated audience data',
      properties: {
        list: { type: 'object', description: 'Updated audience/list object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaign } from './types'

const logger = createLogger('MailchimpUpdateCampaign')

export interface MailchimpUpdateCampaignParams {
  apiKey: string
  campaignId: string
  campaignSettings?: string
  recipients?: string
}

export interface MailchimpUpdateCampaignResponse {
  success: boolean
  output: {
    campaign: MailchimpCampaign
    metadata: {
      operation: 'update_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateCampaignTool: ToolConfig<
  MailchimpUpdateCampaignParams,
  MailchimpUpdateCampaignResponse
> = {
  id: 'mailchimp_update_campaign',
  name: 'Update Campaign in Mailchimp',
  description: 'Update an existing campaign in Mailchimp',
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
      description: 'The unique ID for the campaign',
    },
    campaignSettings: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of campaign settings',
    },
    recipients: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of recipients',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.campaignSettings) {
        try {
          body.settings = JSON.parse(params.campaignSettings)
        } catch (error) {
          logger.warn('Failed to parse campaign settings', { error })
        }
      }

      if (params.recipients) {
        try {
          body.recipients = JSON.parse(params.recipients)
        } catch (error) {
          logger.warn('Failed to parse recipients', { error })
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_campaign')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        campaign: data,
        metadata: {
          operation: 'update_campaign' as const,
          campaignId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated campaign data',
      properties: {
        campaign: { type: 'object', description: 'Updated campaign object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_interest.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_interest.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterest } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateInterest')

export interface MailchimpUpdateInterestParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  interestId: string
  interestName?: string
}

export interface MailchimpUpdateInterestResponse {
  success: boolean
  output: {
    interest: MailchimpInterest
    metadata: {
      operation: 'update_interest'
      interestId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateInterestTool: ToolConfig<
  MailchimpUpdateInterestParams,
  MailchimpUpdateInterestResponse
> = {
  id: 'mailchimp_update_interest',
  name: 'Update Interest in Mailchimp Interest Category',
  description: 'Update an existing interest in an interest category in a Mailchimp audience',
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
      description: 'The unique ID for the interest',
    },
    interestName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the interest',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}/interests/${params.interestId}`
      ),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.interestName) body.name = params.interestName

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_interest')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        interest: data,
        metadata: {
          operation: 'update_interest' as const,
          interestId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated interest data',
      properties: {
        interest: { type: 'object', description: 'Updated interest object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_interest_category.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_interest_category.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterestCategory } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateInterestCategory')

export interface MailchimpUpdateInterestCategoryParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  interestCategoryTitle?: string
}

export interface MailchimpUpdateInterestCategoryResponse {
  success: boolean
  output: {
    category: MailchimpInterestCategory
    metadata: {
      operation: 'update_interest_category'
      interestCategoryId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateInterestCategoryTool: ToolConfig<
  MailchimpUpdateInterestCategoryParams,
  MailchimpUpdateInterestCategoryResponse
> = {
  id: 'mailchimp_update_interest_category',
  name: 'Update Interest Category in Mailchimp Audience',
  description: 'Update an existing interest category in a Mailchimp audience',
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
    interestCategoryTitle: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The title of the interest category',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}`
      ),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.interestCategoryTitle) body.title = params.interestCategoryTitle

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_interest_category')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        category: data,
        metadata: {
          operation: 'update_interest_category' as const,
          interestCategoryId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated interest category data',
      properties: {
        category: { type: 'object', description: 'Updated interest category object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpLandingPage } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateLandingPage')

export interface MailchimpUpdateLandingPageParams {
  apiKey: string
  pageId: string
  landingPageTitle?: string
}

export interface MailchimpUpdateLandingPageResponse {
  success: boolean
  output: {
    landingPage: MailchimpLandingPage
    metadata: {
      operation: 'update_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateLandingPageTool: ToolConfig<
  MailchimpUpdateLandingPageParams,
  MailchimpUpdateLandingPageResponse
> = {
  id: 'mailchimp_update_landing_page',
  name: 'Update Landing Page in Mailchimp',
  description: 'Update an existing landing page in Mailchimp',
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
      description: 'The unique ID for the landing page',
    },
    landingPageTitle: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The title of the landing page',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/landing-pages/${params.pageId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.landingPageTitle) body.title = params.landingPageTitle

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_landing_page')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        landingPage: data,
        metadata: {
          operation: 'update_landing_page' as const,
          pageId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated landing page data',
      properties: {
        landingPage: { type: 'object', description: 'Updated landing page object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpUpdateMember')

export interface MailchimpUpdateMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
  emailAddress?: string
  status?: string
  mergeFields?: string
  interests?: string
}

export interface MailchimpUpdateMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'update_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpUpdateMemberTool: ToolConfig<
  MailchimpUpdateMemberParams,
  MailchimpUpdateMemberResponse
> = {
  id: 'mailchimp_update_member',
  name: 'Update Member in Mailchimp Audience',
  description: 'Update an existing member in a Mailchimp audience',
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
    emailAddress: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Member email address',
    },
    status: {
      type: 'string',
      required: false,
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
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/members/${params.subscriberEmail}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.emailAddress) body.email_address = params.emailAddress
      if (params.status) body.status = params.status

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
      handleMailchimpError(data, response.status, 'update_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'update_member' as const,
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
      description: 'Updated member data',
      properties: {
        member: { type: 'object', description: 'Updated member object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_merge_field.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_merge_field.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpMergeField } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateMergeField')

export interface MailchimpUpdateMergeFieldParams {
  apiKey: string
  listId: string
  mergeId: string
  mergeName?: string
}

export interface MailchimpUpdateMergeFieldResponse {
  success: boolean
  output: {
    mergeField: MailchimpMergeField
    metadata: {
      operation: 'update_merge_field'
      mergeId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateMergeFieldTool: ToolConfig<
  MailchimpUpdateMergeFieldParams,
  MailchimpUpdateMergeFieldResponse
> = {
  id: 'mailchimp_update_merge_field',
  name: 'Update Merge Field in Mailchimp Audience',
  description: 'Update an existing merge field in a Mailchimp audience',
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
      description: 'The unique ID for the merge field',
    },
    mergeName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the merge field',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/merge-fields/${params.mergeId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.mergeName) body.name = params.mergeName

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_merge_field')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        mergeField: data,
        metadata: {
          operation: 'update_merge_field' as const,
          mergeId: data.merge_id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated merge field data',
      properties: {
        mergeField: { type: 'object', description: 'Updated merge field object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_segment.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_segment.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpSegment } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateSegment')

export interface MailchimpUpdateSegmentParams {
  apiKey: string
  listId: string
  segmentId: string
  segmentName?: string
  segmentOptions?: string
}

export interface MailchimpUpdateSegmentResponse {
  success: boolean
  output: {
    segment: MailchimpSegment
    metadata: {
      operation: 'update_segment'
      segmentId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateSegmentTool: ToolConfig<
  MailchimpUpdateSegmentParams,
  MailchimpUpdateSegmentResponse
> = {
  id: 'mailchimp_update_segment',
  name: 'Update Segment in Mailchimp Audience',
  description: 'Update an existing segment in a Mailchimp audience',
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
      description: 'The unique ID for the segment',
    },
    segmentName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the segment',
    },
    segmentOptions: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'JSON object of segment options',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/segments/${params.segmentId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.segmentName) body.name = params.segmentName

      if (params.segmentOptions) {
        try {
          const options = JSON.parse(params.segmentOptions)
          body.options = options
        } catch (error) {
          logger.warn('Failed to parse segment options', { error })
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_segment')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        segment: data,
        metadata: {
          operation: 'update_segment' as const,
          segmentId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Updated segment data',
      properties: {
        segment: { type: 'object', description: 'Updated segment object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: update_template.ts]---
Location: sim-main/apps/sim/tools/mailchimp/update_template.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpTemplate } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUpdateTemplate')

export interface MailchimpUpdateTemplateParams {
  apiKey: string
  templateId: string
  templateName?: string
  templateHtml?: string
}

export interface MailchimpUpdateTemplateResponse {
  success: boolean
  output: {
    template: MailchimpTemplate
    metadata: {
      operation: 'update_template'
      templateId: string
    }
    success: boolean
  }
}

export const mailchimpUpdateTemplateTool: ToolConfig<
  MailchimpUpdateTemplateParams,
  MailchimpUpdateTemplateResponse
> = {
  id: 'mailchimp_update_template',
  name: 'Update Template in Mailchimp',
  description: 'Update an existing template in Mailchimp',
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
      description: 'The unique ID for the template',
    },
    templateName: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The name of the template',
    },
    templateHtml: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The HTML content for the template',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/templates/${params.templateId}`),
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.templateName) body.name = params.templateName
      if (params.templateHtml) body.html = params.templateHtml

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'update_template')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        template: data,
        metadata: {
          operation: 'update_template' as const,
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
      description: 'Updated template data',
      properties: {
        template: { type: 'object', description: 'Updated template object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_list_member.ts]---
Location: sim-main/apps/sim/tools/mailgun/add_list_member.ts

```typescript
import type { AddListMemberParams, AddListMemberResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunAddListMemberTool: ToolConfig<AddListMemberParams, AddListMemberResult> = {
  id: 'mailgun_add_list_member',
  name: 'Mailgun Add List Member',
  description: 'Add a member to a mailing list',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    listAddress: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Mailing list address',
    },
    address: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Member email address',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Member name',
    },
    vars: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'JSON string of custom variables',
    },
    subscribed: {
      type: 'boolean',
      required: false,
      visibility: 'user-or-llm',
      description: 'Whether the member is subscribed',
    },
  },

  request: {
    url: (params) => `https://api.mailgun.net/v3/lists/${params.listAddress}/members`,
    method: 'POST',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
    body: (params) => {
      const formData = new FormData()
      formData.append('address', params.address)

      if (params.name) {
        formData.append('name', params.name)
      }
      if (params.vars) {
        formData.append('vars', params.vars)
      }
      if (params.subscribed !== undefined) {
        formData.append('subscribed', params.subscribed ? 'yes' : 'no')
      }

      return { body: formData }
    },
  },

  transformResponse: async (response, params): Promise<AddListMemberResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to add list member')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        message: result.message,
        member: {
          address: result.member.address,
          name: result.member.name,
          subscribed: result.member.subscribed,
          vars: result.member.vars,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the member was added successfully' },
    message: { type: 'string', description: 'Response message' },
    member: { type: 'json', description: 'Added member details' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_mailing_list.ts]---
Location: sim-main/apps/sim/tools/mailgun/create_mailing_list.ts

```typescript
import type { CreateMailingListParams, CreateMailingListResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunCreateMailingListTool: ToolConfig<
  CreateMailingListParams,
  CreateMailingListResult
> = {
  id: 'mailgun_create_mailing_list',
  name: 'Mailgun Create Mailing List',
  description: 'Create a new mailing list',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    address: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Mailing list address (e.g., list@example.com)',
    },
    name: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mailing list name',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Mailing list description',
    },
    accessLevel: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Access level: readonly, members, or everyone',
    },
  },

  request: {
    url: () => 'https://api.mailgun.net/v3/lists',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
    body: (params) => {
      const formData = new FormData()
      formData.append('address', params.address)

      if (params.name) {
        formData.append('name', params.name)
      }
      if (params.description) {
        formData.append('description', params.description)
      }
      if (params.accessLevel) {
        formData.append('access_level', params.accessLevel)
      }

      return { body: formData }
    },
  },

  transformResponse: async (response, params): Promise<CreateMailingListResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create mailing list')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        message: result.message,
        list: {
          address: result.list.address,
          name: result.list.name,
          description: result.list.description,
          accessLevel: result.list.access_level,
          createdAt: result.list.created_at,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the list was created successfully' },
    message: { type: 'string', description: 'Response message' },
    list: { type: 'json', description: 'Created mailing list details' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_domain.ts]---
Location: sim-main/apps/sim/tools/mailgun/get_domain.ts

```typescript
import type { GetDomainParams, GetDomainResult } from '@/tools/mailgun/types'
import type { ToolConfig } from '@/tools/types'

export const mailgunGetDomainTool: ToolConfig<GetDomainParams, GetDomainResult> = {
  id: 'mailgun_get_domain',
  name: 'Mailgun Get Domain',
  description: 'Get details of a specific domain',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Mailgun API key',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Domain name',
    },
  },

  request: {
    url: (params) => `https://api.mailgun.net/v3/domains/${params.domain}`,
    method: 'GET',
    headers: (params) => ({
      Authorization: `Basic ${Buffer.from(`api:${params.apiKey}`).toString('base64')}`,
    }),
  },

  transformResponse: async (response, params): Promise<GetDomainResult> => {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get domain')
    }

    const result = await response.json()

    return {
      success: true,
      output: {
        success: true,
        domain: {
          name: result.domain.name,
          smtpLogin: result.domain.smtp_login,
          smtpPassword: result.domain.smtp_password,
          spamAction: result.domain.spam_action,
          state: result.domain.state,
          createdAt: result.domain.created_at,
          type: result.domain.type,
        },
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the request was successful' },
    domain: { type: 'json', description: 'Domain details' },
  },
}
```

--------------------------------------------------------------------------------

````
