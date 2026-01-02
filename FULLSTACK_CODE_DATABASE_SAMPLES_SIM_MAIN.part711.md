---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 711
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 711 of 933)

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

---[FILE: add_or_update_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/add_or_update_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpAddOrUpdateMember')

export interface MailchimpAddOrUpdateMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
  emailAddress: string
  statusIfNew: string
  mergeFields?: string
  interests?: string
}

export interface MailchimpAddOrUpdateMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'add_or_update_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpAddOrUpdateMemberTool: ToolConfig<
  MailchimpAddOrUpdateMemberParams,
  MailchimpAddOrUpdateMemberResponse
> = {
  id: 'mailchimp_add_or_update_member',
  name: 'Add or Update Member in Mailchimp Audience',
  description: 'Add a new member or update an existing member in a Mailchimp audience (upsert)',
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
      required: true,
      visibility: 'user-only',
      description: 'Member email address',
    },
    statusIfNew: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Subscriber status if new member',
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
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        email_address: params.emailAddress,
        status_if_new: params.statusIfNew,
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
      handleMailchimpError(data, response.status, 'add_or_update_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'add_or_update_member' as const,
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
      description: 'Member data',
      properties: {
        member: { type: 'object', description: 'Member object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_segment_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/add_segment_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpAddSegmentMember')

export interface MailchimpAddSegmentMemberParams {
  apiKey: string
  listId: string
  segmentId: string
  emailAddress: string
}

export interface MailchimpAddSegmentMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'add_segment_member'
      segmentId: string
    }
    success: boolean
  }
}

export const mailchimpAddSegmentMemberTool: ToolConfig<
  MailchimpAddSegmentMemberParams,
  MailchimpAddSegmentMemberResponse
> = {
  id: 'mailchimp_add_segment_member',
  name: 'Add Member to Segment in Mailchimp',
  description: 'Add a member to a specific segment in a Mailchimp audience',
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
    emailAddress: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Email address of the member',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/segments/${params.segmentId}/members`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      email_address: params.emailAddress,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'add_segment_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'add_segment_member' as const,
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

---[FILE: add_subscriber_to_automation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/add_subscriber_to_automation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpMember } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpAddSubscriberToAutomation')

export interface MailchimpAddSubscriberToAutomationParams {
  apiKey: string
  workflowId: string
  workflowEmailId: string
  emailAddress: string
}

export interface MailchimpAddSubscriberToAutomationResponse {
  success: boolean
  output: {
    subscriber: MailchimpMember
    metadata: {
      operation: 'add_subscriber_to_automation'
      workflowId: string
      workflowEmailId: string
    }
    success: boolean
  }
}

export const mailchimpAddSubscriberToAutomationTool: ToolConfig<
  MailchimpAddSubscriberToAutomationParams,
  MailchimpAddSubscriberToAutomationResponse
> = {
  id: 'mailchimp_add_subscriber_to_automation',
  name: 'Add Subscriber to Automation in Mailchimp',
  description: 'Manually add a subscriber to a workflow email queue',
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
    workflowEmailId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The unique ID for the workflow email',
    },
    emailAddress: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Email address of the subscriber',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/automations/${params.workflowId}/emails/${params.workflowEmailId}/queue`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      email_address: params.emailAddress,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'add_subscriber_to_automation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        subscriber: data,
        metadata: {
          operation: 'add_subscriber_to_automation' as const,
          workflowId: '',
          workflowEmailId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Subscriber queue data',
      properties: {
        subscriber: { type: 'object', description: 'Subscriber object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: archive_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/archive_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpArchiveMember')

export interface MailchimpArchiveMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
}

export interface MailchimpArchiveMemberResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'archive_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpArchiveMemberTool: ToolConfig<
  MailchimpArchiveMemberParams,
  MailchimpArchiveMemberResponse
> = {
  id: 'mailchimp_archive_member',
  name: 'Archive Member from Mailchimp Audience',
  description: 'Permanently archive (delete) a member from a Mailchimp audience',
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
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/members/${params.subscriberEmail}/actions/delete-permanent`
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
      handleMailchimpError(data, response.status, 'archive_member')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'archive_member' as const,
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
      description: 'Archive confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_audience.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_audience.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpAudience } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateAudience')

export interface MailchimpCreateAudienceParams {
  apiKey: string
  audienceName: string
  contact: string
  permissionReminder: string
  campaignDefaults: string
  emailTypeOption: string
}

export interface MailchimpCreateAudienceResponse {
  success: boolean
  output: {
    list: MailchimpAudience
    metadata: {
      operation: 'create_audience'
      listId: string
    }
    success: boolean
  }
}

export const mailchimpCreateAudienceTool: ToolConfig<
  MailchimpCreateAudienceParams,
  MailchimpCreateAudienceResponse
> = {
  id: 'mailchimp_create_audience',
  name: 'Create Audience in Mailchimp',
  description: 'Create a new audience (list) in Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    audienceName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the list',
    },
    contact: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON object of contact information',
    },
    permissionReminder: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Permission reminder text',
    },
    campaignDefaults: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON object of default campaign settings',
    },
    emailTypeOption: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Support multiple email formats',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, '/lists'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        name: params.audienceName,
        permission_reminder: params.permissionReminder,
        email_type_option: params.emailTypeOption === 'true',
      }

      if (params.contact) {
        try {
          body.contact = JSON.parse(params.contact)
        } catch (error) {
          logger.warn('Failed to parse contact', { error })
        }
      }

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
      handleMailchimpError(data, response.status, 'create_audience')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        list: data,
        metadata: {
          operation: 'create_audience' as const,
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
      description: 'Created audience data',
      properties: {
        list: { type: 'object', description: 'Created audience/list object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_batch_operation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_batch_operation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpBatchOperation } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateBatchOperation')

export interface MailchimpCreateBatchOperationParams {
  apiKey: string
  operations: string
}

export interface MailchimpCreateBatchOperationResponse {
  success: boolean
  output: {
    batch: MailchimpBatchOperation
    metadata: {
      operation: 'create_batch_operation'
      batchId: string
    }
    success: boolean
  }
}

export const mailchimpCreateBatchOperationTool: ToolConfig<
  MailchimpCreateBatchOperationParams,
  MailchimpCreateBatchOperationResponse
> = {
  id: 'mailchimp_create_batch_operation',
  name: 'Create Batch Operation in Mailchimp',
  description: 'Create a new batch operation in Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    operations: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'JSON array of operations',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, '/batches'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let operations = []
      try {
        operations = JSON.parse(params.operations)
      } catch (error) {
        logger.warn('Failed to parse operations', { error })
      }

      return { operations }
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_batch_operation')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        batch: data,
        metadata: {
          operation: 'create_batch_operation' as const,
          batchId: data.id,
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Created batch operation data',
      properties: {
        batch: { type: 'object', description: 'Created batch operation object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaign } from './types'

const logger = createLogger('MailchimpCreateCampaign')

export interface MailchimpCreateCampaignParams {
  apiKey: string
  campaignType: string
  campaignSettings: string
  recipients?: string
}

export interface MailchimpCreateCampaignResponse {
  success: boolean
  output: {
    campaign: MailchimpCampaign
    metadata: {
      operation: 'create_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpCreateCampaignTool: ToolConfig<
  MailchimpCreateCampaignParams,
  MailchimpCreateCampaignResponse
> = {
  id: 'mailchimp_create_campaign',
  name: 'Create Campaign in Mailchimp',
  description: 'Create a new campaign in Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    campaignType: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Campaign type',
    },
    campaignSettings: {
      type: 'string',
      required: true,
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
    url: (params) => buildMailchimpUrl(params.apiKey, '/campaigns'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        type: params.campaignType,
      }

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
      handleMailchimpError(data, response.status, 'create_campaign')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        campaign: data,
        metadata: {
          operation: 'create_campaign' as const,
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
      description: 'Created campaign data',
      properties: {
        campaign: { type: 'object', description: 'Created campaign object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_interest.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_interest.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterest } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateInterest')

export interface MailchimpCreateInterestParams {
  apiKey: string
  listId: string
  interestCategoryId: string
  interestName: string
}

export interface MailchimpCreateInterestResponse {
  success: boolean
  output: {
    interest: MailchimpInterest
    metadata: {
      operation: 'create_interest'
      interestId: string
    }
    success: boolean
  }
}

export const mailchimpCreateInterestTool: ToolConfig<
  MailchimpCreateInterestParams,
  MailchimpCreateInterestResponse
> = {
  id: 'mailchimp_create_interest',
  name: 'Create Interest in Mailchimp Interest Category',
  description: 'Create a new interest in an interest category in a Mailchimp audience',
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
    interestName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the interest',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/lists/${params.listId}/interest-categories/${params.interestCategoryId}/interests`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      name: params.interestName,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_interest')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        interest: data,
        metadata: {
          operation: 'create_interest' as const,
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
      description: 'Created interest data',
      properties: {
        interest: { type: 'object', description: 'Created interest object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_interest_category.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_interest_category.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpInterestCategory } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateInterestCategory')

export interface MailchimpCreateInterestCategoryParams {
  apiKey: string
  listId: string
  interestCategoryTitle: string
  interestCategoryType: string
}

export interface MailchimpCreateInterestCategoryResponse {
  success: boolean
  output: {
    category: MailchimpInterestCategory
    metadata: {
      operation: 'create_interest_category'
      interestCategoryId: string
    }
    success: boolean
  }
}

export const mailchimpCreateInterestCategoryTool: ToolConfig<
  MailchimpCreateInterestCategoryParams,
  MailchimpCreateInterestCategoryResponse
> = {
  id: 'mailchimp_create_interest_category',
  name: 'Create Interest Category in Mailchimp Audience',
  description: 'Create a new interest category in a Mailchimp audience',
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
    interestCategoryTitle: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The title of the interest category',
    },
    interestCategoryType: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The type of interest category (checkboxes, dropdown, radio, hidden)',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/interest-categories`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      title: params.interestCategoryTitle,
      type: params.interestCategoryType,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_interest_category')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        category: data,
        metadata: {
          operation: 'create_interest_category' as const,
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
      description: 'Created interest category data',
      properties: {
        category: { type: 'object', description: 'Created interest category object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpLandingPage } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateLandingPage')

export interface MailchimpCreateLandingPageParams {
  apiKey: string
  landingPageType: string
  landingPageTitle?: string
}

export interface MailchimpCreateLandingPageResponse {
  success: boolean
  output: {
    landingPage: MailchimpLandingPage
    metadata: {
      operation: 'create_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpCreateLandingPageTool: ToolConfig<
  MailchimpCreateLandingPageParams,
  MailchimpCreateLandingPageResponse
> = {
  id: 'mailchimp_create_landing_page',
  name: 'Create Landing Page in Mailchimp',
  description: 'Create a new landing page in Mailchimp',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Mailchimp API key with server prefix',
    },
    landingPageType: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The type of landing page (signup)',
    },
    landingPageTitle: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The title of the landing page',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, '/landing-pages'),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        type: params.landingPageType,
      }

      if (params.landingPageTitle) body.title = params.landingPageTitle

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_landing_page')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        landingPage: data,
        metadata: {
          operation: 'create_landing_page' as const,
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
      description: 'Created landing page data',
      properties: {
        landingPage: { type: 'object', description: 'Created landing page object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_merge_field.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_merge_field.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpMergeField } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateMergeField')

export interface MailchimpCreateMergeFieldParams {
  apiKey: string
  listId: string
  mergeName: string
  mergeType: string
}

export interface MailchimpCreateMergeFieldResponse {
  success: boolean
  output: {
    mergeField: MailchimpMergeField
    metadata: {
      operation: 'create_merge_field'
      mergeId: string
    }
    success: boolean
  }
}

export const mailchimpCreateMergeFieldTool: ToolConfig<
  MailchimpCreateMergeFieldParams,
  MailchimpCreateMergeFieldResponse
> = {
  id: 'mailchimp_create_merge_field',
  name: 'Create Merge Field in Mailchimp Audience',
  description: 'Create a new merge field in a Mailchimp audience',
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
    mergeName: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the merge field',
    },
    mergeType: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description:
        'The type of the merge field (text, number, address, phone, date, url, imageurl, radio, dropdown, birthday, zip)',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/merge-fields`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      name: params.mergeName,
      type: params.mergeType,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'create_merge_field')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        mergeField: data,
        metadata: {
          operation: 'create_merge_field' as const,
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
      description: 'Created merge field data',
      properties: {
        mergeField: { type: 'object', description: 'Created merge field object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_segment.ts]---
Location: sim-main/apps/sim/tools/mailchimp/create_segment.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import type { MailchimpSegment } from './types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpCreateSegment')

export interface MailchimpCreateSegmentParams {
  apiKey: string
  listId: string
  segmentName: string
  segmentOptions?: string
}

export interface MailchimpCreateSegmentResponse {
  success: boolean
  output: {
    segment: MailchimpSegment
    metadata: {
      operation: 'create_segment'
      segmentId: string
    }
    success: boolean
  }
}

export const mailchimpCreateSegmentTool: ToolConfig<
  MailchimpCreateSegmentParams,
  MailchimpCreateSegmentResponse
> = {
  id: 'mailchimp_create_segment',
  name: 'Create Segment in Mailchimp Audience',
  description: 'Create a new segment in a Mailchimp audience',
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
    segmentName: {
      type: 'string',
      required: true,
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
    url: (params) => buildMailchimpUrl(params.apiKey, `/lists/${params.listId}/segments`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {
        name: params.segmentName,
      }

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
      handleMailchimpError(data, response.status, 'create_segment')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        segment: data,
        metadata: {
          operation: 'create_segment' as const,
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
      description: 'Created segment data',
      properties: {
        segment: { type: 'object', description: 'Created segment object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

````
