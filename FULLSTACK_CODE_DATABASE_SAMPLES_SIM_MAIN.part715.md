---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 715
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 715 of 933)

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

---[FILE: publish_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/publish_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpPublishLandingPage')

export interface MailchimpPublishLandingPageParams {
  apiKey: string
  pageId: string
}

export interface MailchimpPublishLandingPageResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'publish_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpPublishLandingPageTool: ToolConfig<
  MailchimpPublishLandingPageParams,
  MailchimpPublishLandingPageResponse
> = {
  id: 'mailchimp_publish_landing_page',
  name: 'Publish Landing Page in Mailchimp',
  description: 'Publish a landing page in Mailchimp',
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
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/landing-pages/${params.pageId}/actions/publish`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'publish_landing_page')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'publish_landing_page' as const,
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
      description: 'Publish confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_member_tags.ts]---
Location: sim-main/apps/sim/tools/mailchimp/remove_member_tags.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpRemoveMemberTags')

export interface MailchimpRemoveMemberTagsParams {
  apiKey: string
  listId: string
  subscriberEmail: string
  tags: string
}

export interface MailchimpRemoveMemberTagsResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'remove_member_tags'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpRemoveMemberTagsTool: ToolConfig<
  MailchimpRemoveMemberTagsParams,
  MailchimpRemoveMemberTagsResponse
> = {
  id: 'mailchimp_remove_member_tags',
  name: 'Remove Tags from Member in Mailchimp',
  description: 'Remove tags from a member in a Mailchimp audience',
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
      description: 'JSON array of tags with inactive status',
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
      handleMailchimpError(data, response.status, 'remove_member_tags')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'remove_member_tags' as const,
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
      description: 'Tag removal confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: remove_segment_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/remove_segment_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpRemoveSegmentMember')

export interface MailchimpRemoveSegmentMemberParams {
  apiKey: string
  listId: string
  segmentId: string
  subscriberEmail: string
}

export interface MailchimpRemoveSegmentMemberResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'remove_segment_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpRemoveSegmentMemberTool: ToolConfig<
  MailchimpRemoveSegmentMemberParams,
  MailchimpRemoveSegmentMemberResponse
> = {
  id: 'mailchimp_remove_segment_member',
  name: 'Remove Member from Segment in Mailchimp',
  description: 'Remove a member from a specific segment in a Mailchimp audience',
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
        `/lists/${params.listId}/segments/${params.segmentId}/members/${params.subscriberEmail}`
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
      handleMailchimpError(data, response.status, 'remove_segment_member')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'remove_segment_member' as const,
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
      description: 'Removal confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: replicate_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/replicate_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpReplicateCampaign')

export interface MailchimpReplicateCampaignParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpReplicateCampaignResponse {
  success: boolean
  output: {
    campaign: any
    metadata: {
      operation: 'replicate_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpReplicateCampaignTool: ToolConfig<
  MailchimpReplicateCampaignParams,
  MailchimpReplicateCampaignResponse
> = {
  id: 'mailchimp_replicate_campaign',
  name: 'Replicate Campaign in Mailchimp',
  description: 'Create a copy of an existing Mailchimp campaign',
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
      description: 'The unique ID for the campaign to replicate',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/actions/replicate`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'replicate_campaign')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        campaign: data,
        metadata: {
          operation: 'replicate_campaign' as const,
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
      description: 'Replicated campaign data',
      properties: {
        campaign: { type: 'object', description: 'Replicated campaign object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: schedule_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/schedule_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpScheduleCampaign')

export interface MailchimpScheduleCampaignParams {
  apiKey: string
  campaignId: string
  scheduleTime: string
}

export interface MailchimpScheduleCampaignResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'schedule_campaign'
      campaignId: string
      scheduleTime: string
    }
    success: boolean
  }
}

export const mailchimpScheduleCampaignTool: ToolConfig<
  MailchimpScheduleCampaignParams,
  MailchimpScheduleCampaignResponse
> = {
  id: 'mailchimp_schedule_campaign',
  name: 'Schedule Campaign in Mailchimp',
  description: 'Schedule a Mailchimp campaign to be sent at a specific time',
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
      description: 'The unique ID for the campaign to schedule',
    },
    scheduleTime: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'ISO 8601 format date and time',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/actions/schedule`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => ({
      schedule_time: params.scheduleTime,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'schedule_campaign')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'schedule_campaign' as const,
          campaignId: '',
          scheduleTime: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Schedule confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: send_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/send_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpSendCampaign')

export interface MailchimpSendCampaignParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpSendCampaignResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'send_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpSendCampaignTool: ToolConfig<
  MailchimpSendCampaignParams,
  MailchimpSendCampaignResponse
> = {
  id: 'mailchimp_send_campaign',
  name: 'Send Campaign in Mailchimp',
  description: 'Send a Mailchimp campaign',
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
      description: 'The unique ID for the campaign to send',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/actions/send`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'send_campaign')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'send_campaign' as const,
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
      description: 'Send confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: set_campaign_content.ts]---
Location: sim-main/apps/sim/tools/mailchimp/set_campaign_content.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpCampaignContent } from './types'

const logger = createLogger('MailchimpSetCampaignContent')

export interface MailchimpSetCampaignContentParams {
  apiKey: string
  campaignId: string
  html?: string
  plainText?: string
  templateId?: string
}

export interface MailchimpSetCampaignContentResponse {
  success: boolean
  output: {
    content: MailchimpCampaignContent
    metadata: {
      operation: 'set_campaign_content'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpSetCampaignContentTool: ToolConfig<
  MailchimpSetCampaignContentParams,
  MailchimpSetCampaignContentResponse
> = {
  id: 'mailchimp_set_campaign_content',
  name: 'Set Campaign Content in Mailchimp',
  description: 'Set the content for a Mailchimp campaign',
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
    html: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The HTML content for the campaign',
    },
    plainText: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The plain-text content for the campaign',
    },
    templateId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The ID of the template to use',
    },
  },

  request: {
    url: (params) => buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/content`),
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      const body: Record<string, unknown> = {}

      if (params.html) body.html = params.html
      if (params.plainText) body.plain_text = params.plainText
      if (params.templateId) body.template = { id: params.templateId }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'set_campaign_content')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        content: data,
        metadata: {
          operation: 'set_campaign_content' as const,
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
      description: 'Campaign content data',
      properties: {
        content: { type: 'object', description: 'Campaign content object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: start_automation.ts]---
Location: sim-main/apps/sim/tools/mailchimp/start_automation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpStartAutomation')

export interface MailchimpStartAutomationParams {
  apiKey: string
  workflowId: string
}

export interface MailchimpStartAutomationResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'start_automation'
      workflowId: string
    }
    success: boolean
  }
}

export const mailchimpStartAutomationTool: ToolConfig<
  MailchimpStartAutomationParams,
  MailchimpStartAutomationResponse
> = {
  id: 'mailchimp_start_automation',
  name: 'Start Automation in Mailchimp',
  description: 'Start all emails in a Mailchimp automation workflow',
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
    url: (params) =>
      buildMailchimpUrl(
        params.apiKey,
        `/automations/${params.workflowId}/actions/start-all-emails`
      ),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'start_automation')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'start_automation' as const,
          workflowId: '',
        },
        success: true,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    output: {
      type: 'object',
      description: 'Start confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/mailchimp/types.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('Mailchimp')

// Base params
export interface MailchimpBaseParams {
  apiKey: string // API key with server prefix (e.g., "key-us19")
}

export interface MailchimpPaginationParams {
  count?: string
  offset?: string
}

export interface MailchimpPagingInfo {
  totalItems: number
}

export interface MailchimpResponse<T> {
  success: boolean
  output: {
    data?: T
    paging?: MailchimpPagingInfo
    metadata: {
      operation: string
      [key: string]: unknown
    }
    success: boolean
  }
}

// Member/Subscriber
export interface MailchimpMember {
  id: string
  email_address: string
  unique_email_id?: string
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending'
  merge_fields?: Record<string, unknown>
  interests?: Record<string, boolean>
  stats?: {
    avg_open_rate?: number
    avg_click_rate?: number
  }
  ip_signup?: string
  timestamp_signup?: string
  ip_opt?: string
  timestamp_opt?: string
  member_rating?: number
  last_changed?: string
  language?: string
  vip?: boolean
  email_client?: string
  location?: {
    latitude?: number
    longitude?: number
    gmtoff?: number
    dstoff?: number
    country_code?: string
    timezone?: string
  }
  tags?: Array<{ id: number; name: string }>
  [key: string]: unknown
}

// Audience/List
export interface MailchimpAudience {
  id: string
  name: string
  contact: {
    company: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    country: string
    phone?: string
  }
  permission_reminder: string
  campaign_defaults: {
    from_name: string
    from_email: string
    subject: string
    language: string
  }
  email_type_option: boolean
  stats?: {
    member_count?: number
    unsubscribe_count?: number
    cleaned_count?: number
    member_count_since_send?: number
    unsubscribe_count_since_send?: number
    cleaned_count_since_send?: number
    campaign_count?: number
    campaign_last_sent?: string
    merge_field_count?: number
    avg_sub_rate?: number
    avg_unsub_rate?: number
    target_sub_rate?: number
    open_rate?: number
    click_rate?: number
    last_sub_date?: string
    last_unsub_date?: string
  }
  date_created?: string
  list_rating?: number
  subscribe_url_short?: string
  subscribe_url_long?: string
  visibility?: string
  [key: string]: unknown
}

// Campaign
export interface MailchimpCampaign {
  id: string
  type: 'regular' | 'plaintext' | 'absplit' | 'rss' | 'variate'
  create_time?: string
  archive_url?: string
  long_archive_url?: string
  status: 'save' | 'paused' | 'schedule' | 'sending' | 'sent'
  emails_sent?: number
  send_time?: string
  content_type?: string
  recipients?: {
    list_id: string
    list_name?: string
    segment_text?: string
    recipient_count?: number
  }
  settings?: {
    subject_line?: string
    preview_text?: string
    title?: string
    from_name?: string
    reply_to?: string
    use_conversation?: boolean
    to_name?: string
    folder_id?: string
    authenticate?: boolean
    auto_footer?: boolean
    inline_css?: boolean
    auto_tweet?: boolean
    fb_comments?: boolean
    timewarp?: boolean
    template_id?: number
    drag_and_drop?: boolean
  }
  tracking?: {
    opens?: boolean
    html_clicks?: boolean
    text_clicks?: boolean
    goal_tracking?: boolean
    ecomm360?: boolean
    google_analytics?: string
    clicktale?: string
  }
  [key: string]: unknown
}

// Campaign Content
export interface MailchimpCampaignContent {
  html?: string
  plain_text?: string
  archive_html?: string
  [key: string]: unknown
}

// Campaign Report
export interface MailchimpCampaignReport {
  id: string
  campaign_title?: string
  type?: string
  emails_sent?: number
  abuse_reports?: number
  unsubscribed?: number
  send_time?: string
  bounces?: {
    hard_bounces?: number
    soft_bounces?: number
    syntax_errors?: number
  }
  forwards?: {
    forwards_count?: number
    forwards_opens?: number
  }
  opens?: {
    opens_total?: number
    unique_opens?: number
    open_rate?: number
    last_open?: string
  }
  clicks?: {
    clicks_total?: number
    unique_clicks?: number
    unique_subscriber_clicks?: number
    click_rate?: number
    last_click?: string
  }
  list_stats?: {
    sub_rate?: number
    unsub_rate?: number
    open_rate?: number
    click_rate?: number
  }
  [key: string]: unknown
}

// Automation
export interface MailchimpAutomation {
  id: string
  create_time?: string
  start_time?: string
  status: 'save' | 'paused' | 'sending'
  emails_sent?: number
  recipients?: {
    list_id: string
    list_name?: string
    segment_opts?: unknown
  }
  settings?: {
    title?: string
    from_name?: string
    reply_to?: string
    use_conversation?: boolean
    to_name?: string
    authenticate?: boolean
    auto_footer?: boolean
    inline_css?: boolean
  }
  tracking?: {
    opens?: boolean
    html_clicks?: boolean
    text_clicks?: boolean
    goal_tracking?: boolean
    ecomm360?: boolean
    google_analytics?: string
    clicktale?: string
  }
  [key: string]: unknown
}

// Segment
export interface MailchimpSegment {
  id: number
  name: string
  member_count?: number
  type: 'saved' | 'static' | 'fuzzy'
  created_at?: string
  updated_at?: string
  options?: {
    match?: 'any' | 'all'
    conditions?: Array<{
      condition_type?: string
      field?: string
      op?: string
      value?: unknown
    }>
  }
  list_id?: string
  [key: string]: unknown
}

// Template
export interface MailchimpTemplate {
  id: number
  type: string
  name: string
  drag_and_drop?: boolean
  responsive?: boolean
  category?: string
  date_created?: string
  date_edited?: string
  created_by?: string
  edited_by?: string
  active?: boolean
  folder_id?: string
  thumbnail?: string
  share_url?: string
  [key: string]: unknown
}

// Landing Page
export interface MailchimpLandingPage {
  id: string
  name: string
  title?: string
  description?: string
  template_id?: number
  status: 'draft' | 'published' | 'unpublished'
  list_id?: string
  store_id?: string
  web_id?: number
  created_at?: string
  published_at?: string
  unpublished_at?: string
  updated_at?: string
  url?: string
  tracking?: {
    opens?: boolean
    html_clicks?: boolean
    text_clicks?: boolean
    goal_tracking?: boolean
    ecomm360?: boolean
    google_analytics?: string
    clicktale?: string
  }
  [key: string]: unknown
}

// Interest Category
export interface MailchimpInterestCategory {
  list_id?: string
  id: string
  title: string
  display_order?: number
  type: 'checkboxes' | 'dropdown' | 'radio' | 'hidden'
  [key: string]: unknown
}

// Interest
export interface MailchimpInterest {
  category_id?: string
  list_id?: string
  id: string
  name: string
  subscriber_count?: string
  display_order?: number
  [key: string]: unknown
}

// Merge Field
export interface MailchimpMergeField {
  merge_id?: number
  tag: string
  name: string
  type:
    | 'text'
    | 'number'
    | 'address'
    | 'phone'
    | 'date'
    | 'url'
    | 'imageurl'
    | 'radio'
    | 'dropdown'
    | 'birthday'
    | 'zip'
  required?: boolean
  default_value?: string
  public?: boolean
  display_order?: number
  options?: {
    default_country?: number
    phone_format?: string
    date_format?: string
    choices?: string[]
    size?: number
  }
  help_text?: string
  list_id?: string
  [key: string]: unknown
}

// Batch Operation
export interface MailchimpBatchOperation {
  id: string
  status: 'pending' | 'preprocessing' | 'started' | 'finalizing' | 'finished'
  total_operations?: number
  finished_operations?: number
  errored_operations?: number
  submitted_at?: string
  completed_at?: string
  response_body_url?: string
  [key: string]: unknown
}

// Tag
export interface MailchimpTag {
  id: number
  name: string
  [key: string]: unknown
}

// Error Response
export interface MailchimpErrorResponse {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Array<{
    field?: string
    message?: string
  }>
}

// Helper function to extract server prefix from API key
export function extractServerPrefix(apiKey: string): string {
  const parts = apiKey.split('-')
  if (parts.length < 2) {
    throw new Error('Invalid Mailchimp API key format. Expected format: key-dc (e.g., abc123-us19)')
  }
  return parts[parts.length - 1]
}

// Helper function to build Mailchimp API URLs
export function buildMailchimpUrl(apiKey: string, path: string): string {
  const serverPrefix = extractServerPrefix(apiKey)
  return `https://${serverPrefix}.api.mailchimp.com/3.0${path}`
}

// Helper function for consistent error handling
export function handleMailchimpError(data: unknown, status: number, operation: string): never {
  logger.error(`Mailchimp API request failed for ${operation}`, { data, status })

  const errorData = data as Record<string, unknown>
  const errorMessage =
    errorData.detail || errorData.title || errorData.error || errorData.message || 'Unknown error'
  throw new Error(`Mailchimp ${operation} failed: ${errorMessage}`)
}
```

--------------------------------------------------------------------------------

---[FILE: unarchive_member.ts]---
Location: sim-main/apps/sim/tools/mailchimp/unarchive_member.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError, type MailchimpMember } from './types'

const logger = createLogger('MailchimpUnarchiveMember')

export interface MailchimpUnarchiveMemberParams {
  apiKey: string
  listId: string
  subscriberEmail: string
  emailAddress: string
  status: string
}

export interface MailchimpUnarchiveMemberResponse {
  success: boolean
  output: {
    member: MailchimpMember
    metadata: {
      operation: 'unarchive_member'
      subscriberHash: string
    }
    success: boolean
  }
}

export const mailchimpUnarchiveMemberTool: ToolConfig<
  MailchimpUnarchiveMemberParams,
  MailchimpUnarchiveMemberResponse
> = {
  id: 'mailchimp_unarchive_member',
  name: 'Unarchive Member in Mailchimp Audience',
  description: 'Restore an archived member to a Mailchimp audience',
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
    status: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Subscriber status',
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
    body: (params) => ({
      email_address: params.emailAddress,
      status: params.status,
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'unarchive_member')
    }

    const data = await response.json()

    return {
      success: true,
      output: {
        member: data,
        metadata: {
          operation: 'unarchive_member' as const,
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
      description: 'Unarchived member data',
      properties: {
        member: { type: 'object', description: 'Unarchived member object' },
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: unpublish_landing_page.ts]---
Location: sim-main/apps/sim/tools/mailchimp/unpublish_landing_page.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUnpublishLandingPage')

export interface MailchimpUnpublishLandingPageParams {
  apiKey: string
  pageId: string
}

export interface MailchimpUnpublishLandingPageResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'unpublish_landing_page'
      pageId: string
    }
    success: boolean
  }
}

export const mailchimpUnpublishLandingPageTool: ToolConfig<
  MailchimpUnpublishLandingPageParams,
  MailchimpUnpublishLandingPageResponse
> = {
  id: 'mailchimp_unpublish_landing_page',
  name: 'Unpublish Landing Page in Mailchimp',
  description: 'Unpublish a landing page in Mailchimp',
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
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/landing-pages/${params.pageId}/actions/unpublish`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'unpublish_landing_page')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'unpublish_landing_page' as const,
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
      description: 'Unpublish confirmation',
      properties: {
        metadata: { type: 'object', description: 'Operation metadata' },
        success: { type: 'boolean', description: 'Operation success' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: unschedule_campaign.ts]---
Location: sim-main/apps/sim/tools/mailchimp/unschedule_campaign.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'
import { buildMailchimpUrl, handleMailchimpError } from './types'

const logger = createLogger('MailchimpUnscheduleCampaign')

export interface MailchimpUnscheduleCampaignParams {
  apiKey: string
  campaignId: string
}

export interface MailchimpUnscheduleCampaignResponse {
  success: boolean
  output: {
    metadata: {
      operation: 'unschedule_campaign'
      campaignId: string
    }
    success: boolean
  }
}

export const mailchimpUnscheduleCampaignTool: ToolConfig<
  MailchimpUnscheduleCampaignParams,
  MailchimpUnscheduleCampaignResponse
> = {
  id: 'mailchimp_unschedule_campaign',
  name: 'Unschedule Campaign in Mailchimp',
  description: 'Unschedule a previously scheduled Mailchimp campaign',
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
      description: 'The unique ID for the campaign to unschedule',
    },
  },

  request: {
    url: (params) =>
      buildMailchimpUrl(params.apiKey, `/campaigns/${params.campaignId}/actions/unschedule`),
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    if (!response.ok) {
      const data = await response.json()
      handleMailchimpError(data, response.status, 'unschedule_campaign')
    }

    return {
      success: true,
      output: {
        metadata: {
          operation: 'unschedule_campaign' as const,
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
      description: 'Unschedule confirmation',
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
