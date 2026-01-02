---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 700
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 700 of 933)

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

---[FILE: update_comment.ts]---
Location: sim-main/apps/sim/tools/jira/update_comment.ts

```typescript
import type { JiraUpdateCommentParams, JiraUpdateCommentResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraUpdateCommentTool: ToolConfig<JiraUpdateCommentParams, JiraUpdateCommentResponse> =
  {
    id: 'jira_update_comment',
    name: 'Jira Update Comment',
    description: 'Update an existing comment on a Jira issue',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'jira',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'OAuth access token for Jira',
      },
      domain: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
      },
      issueKey: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Jira issue key containing the comment (e.g., PROJ-123)',
      },
      commentId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'ID of the comment to update',
      },
      body: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Updated comment text',
      },
      cloudId: {
        type: 'string',
        required: false,
        visibility: 'hidden',
        description:
          'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
      },
    },

    request: {
      url: (params: JiraUpdateCommentParams) => {
        if (params.cloudId) {
          return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/comment/${params.commentId}`
        }
        return 'https://api.atlassian.com/oauth/token/accessible-resources'
      },
      method: (params: JiraUpdateCommentParams) => (params.cloudId ? 'PUT' : 'GET'),
      headers: (params: JiraUpdateCommentParams) => {
        return {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
      body: (params: JiraUpdateCommentParams) => {
        if (!params.cloudId) return undefined as any
        return {
          body: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: params.body,
                  },
                ],
              },
            ],
          },
        }
      },
    },

    transformResponse: async (response: Response, params?: JiraUpdateCommentParams) => {
      if (!params?.cloudId) {
        const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
        // Make the actual request with the resolved cloudId
        const commentUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/comment/${params?.commentId}`
        const commentResponse = await fetch(commentUrl, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${params?.accessToken}`,
          },
          body: JSON.stringify({
            body: {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: params?.body,
                    },
                  ],
                },
              ],
            },
          }),
        })

        if (!commentResponse.ok) {
          let message = `Failed to update comment on Jira issue (${commentResponse.status})`
          try {
            const err = await commentResponse.json()
            message = err?.errorMessages?.join(', ') || err?.message || message
          } catch (_e) {}
          throw new Error(message)
        }

        const data = await commentResponse.json()

        return {
          success: true,
          output: {
            ts: new Date().toISOString(),
            issueKey: params?.issueKey || 'unknown',
            commentId: data?.id || params?.commentId || 'unknown',
            body: params?.body || '',
            success: true,
          },
        }
      }

      // If cloudId was provided, process the response
      if (!response.ok) {
        let message = `Failed to update comment on Jira issue (${response.status})`
        try {
          const err = await response.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          commentId: data?.id || params?.commentId || 'unknown',
          body: params?.body || '',
          success: true,
        },
      }
    },

    outputs: {
      ts: { type: 'string', description: 'Timestamp of the operation' },
      issueKey: { type: 'string', description: 'Issue key' },
      commentId: { type: 'string', description: 'Updated comment ID' },
      body: { type: 'string', description: 'Updated comment text' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: update_worklog.ts]---
Location: sim-main/apps/sim/tools/jira/update_worklog.ts

```typescript
import type { JiraUpdateWorklogParams, JiraUpdateWorklogResponse } from '@/tools/jira/types'
import { getJiraCloudId } from '@/tools/jira/utils'
import type { ToolConfig } from '@/tools/types'

export const jiraUpdateWorklogTool: ToolConfig<JiraUpdateWorklogParams, JiraUpdateWorklogResponse> =
  {
    id: 'jira_update_worklog',
    name: 'Jira Update Worklog',
    description: 'Update an existing worklog entry on a Jira issue',
    version: '1.0.0',

    oauth: {
      required: true,
      provider: 'jira',
    },

    params: {
      accessToken: {
        type: 'string',
        required: true,
        visibility: 'hidden',
        description: 'OAuth access token for Jira',
      },
      domain: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
      },
      issueKey: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'Jira issue key containing the worklog (e.g., PROJ-123)',
      },
      worklogId: {
        type: 'string',
        required: true,
        visibility: 'user-or-llm',
        description: 'ID of the worklog entry to update',
      },
      timeSpentSeconds: {
        type: 'number',
        required: false,
        visibility: 'user-or-llm',
        description: 'Time spent in seconds',
      },
      comment: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Optional comment for the worklog entry',
      },
      started: {
        type: 'string',
        required: false,
        visibility: 'user-or-llm',
        description: 'Optional start time in ISO format',
      },
      cloudId: {
        type: 'string',
        required: false,
        visibility: 'hidden',
        description:
          'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
      },
    },

    request: {
      url: (params: JiraUpdateWorklogParams) => {
        if (params.cloudId) {
          return `https://api.atlassian.com/ex/jira/${params.cloudId}/rest/api/3/issue/${params.issueKey}/worklog/${params.worklogId}`
        }
        return 'https://api.atlassian.com/oauth/token/accessible-resources'
      },
      method: (params: JiraUpdateWorklogParams) => (params.cloudId ? 'PUT' : 'GET'),
      headers: (params: JiraUpdateWorklogParams) => {
        return {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${params.accessToken}`,
        }
      },
      body: (params: JiraUpdateWorklogParams) => {
        if (!params.cloudId) return undefined as any
        return {
          timeSpentSeconds: Number(params.timeSpentSeconds),
          comment: params.comment
            ? {
                type: 'doc',
                version: 1,
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: params.comment,
                      },
                    ],
                  },
                ],
              }
            : undefined,
          started: params.started,
        }
      },
    },

    transformResponse: async (response: Response, params?: JiraUpdateWorklogParams) => {
      if (!params?.cloudId) {
        const cloudId = await getJiraCloudId(params!.domain, params!.accessToken)
        // Make the actual request with the resolved cloudId
        const worklogUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${params?.issueKey}/worklog/${params?.worklogId}`
        const worklogResponse = await fetch(worklogUrl, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${params?.accessToken}`,
          },
          body: JSON.stringify({
            timeSpentSeconds: params?.timeSpentSeconds ? Number(params.timeSpentSeconds) : 0,
            comment: params?.comment
              ? {
                  type: 'doc',
                  version: 1,
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: params.comment,
                        },
                      ],
                    },
                  ],
                }
              : undefined,
            started: params?.started,
          }),
        })

        if (!worklogResponse.ok) {
          let message = `Failed to update worklog on Jira issue (${worklogResponse.status})`
          try {
            const err = await worklogResponse.json()
            message = err?.errorMessages?.join(', ') || err?.message || message
          } catch (_e) {}
          throw new Error(message)
        }

        const data = await worklogResponse.json()

        return {
          success: true,
          output: {
            ts: new Date().toISOString(),
            issueKey: params?.issueKey || 'unknown',
            worklogId: data?.id || params?.worklogId || 'unknown',
            success: true,
          },
        }
      }

      // If cloudId was provided, process the response
      if (!response.ok) {
        let message = `Failed to update worklog on Jira issue (${response.status})`
        try {
          const err = await response.json()
          message = err?.errorMessages?.join(', ') || err?.message || message
        } catch (_e) {}
        throw new Error(message)
      }

      const data = await response.json()

      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: params?.issueKey || 'unknown',
          worklogId: data?.id || params?.worklogId || 'unknown',
          success: true,
        },
      }
    },

    outputs: {
      ts: { type: 'string', description: 'Timestamp of the operation' },
      issueKey: { type: 'string', description: 'Issue key' },
      worklogId: { type: 'string', description: 'Updated worklog ID' },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/jira/utils.ts

```typescript
export async function getJiraCloudId(domain: string, accessToken: string): Promise<string> {
  const response = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  })

  const resources = await response.json()

  // If we have resources, find the matching one
  if (Array.isArray(resources) && resources.length > 0) {
    const normalizedInput = `https://${domain}`.toLowerCase()
    const matchedResource = resources.find((r) => r.url.toLowerCase() === normalizedInput)

    if (matchedResource) {
      return matchedResource.id
    }
  }

  // If we couldn't find a match, return the first resource's ID
  // This is a fallback in case the URL matching fails
  if (Array.isArray(resources) && resources.length > 0) {
    return resources[0].id
  }

  throw new Error('No Jira resources found')
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/jira/write.ts

```typescript
import type { JiraWriteParams, JiraWriteResponse } from '@/tools/jira/types'
import type { ToolConfig } from '@/tools/types'

export const jiraWriteTool: ToolConfig<JiraWriteParams, JiraWriteResponse> = {
  id: 'jira_write',
  name: 'Jira Write',
  description: 'Write a Jira issue',
  version: '1.0.0',

  oauth: {
    required: true,
    provider: 'jira',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'OAuth access token for Jira',
    },
    domain: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Your Jira domain (e.g., yourcompany.atlassian.net)',
    },
    projectId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Project ID for the issue',
    },
    summary: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'Summary for the issue',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'Description for the issue',
    },
    priority: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Priority for the issue',
    },
    assignee: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'Assignee for the issue',
    },
    cloudId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description:
        'Jira Cloud ID for the instance. If not provided, it will be fetched using the domain.',
    },
    issueType: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'Type of issue to create (e.g., Task, Story)',
    },
  },

  request: {
    url: '/api/tools/jira/write',
    method: 'POST',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      // Pass all parameters to the internal API route
      return {
        domain: params.domain,
        accessToken: params.accessToken,
        projectId: params.projectId,
        summary: params.summary,
        description: params.description,
        priority: params.priority,
        assignee: params.assignee,
        cloudId: params.cloudId,
        issueType: params.issueType,
        parent: params.parent,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const responseText = await response.text()

    if (!responseText) {
      return {
        success: true,
        output: {
          ts: new Date().toISOString(),
          issueKey: 'unknown',
          summary: 'Issue created successfully',
          success: true,
          url: '',
        },
      }
    }

    const data = JSON.parse(responseText)

    // The internal API route already returns the correct format
    if (data.success && data.output) {
      return data
    }

    // Fallback for unexpected response format
    return {
      success: data.success || false,
      output: data.output || {
        ts: new Date().toISOString(),
        issueKey: 'unknown',
        summary: 'Issue created',
        success: false,
      },
      error: data.error,
    }
  },

  outputs: {
    ts: { type: 'string', description: 'Timestamp of the operation' },
    issueKey: { type: 'string', description: 'Created issue key (e.g., PROJ-123)' },
    summary: { type: 'string', description: 'Issue summary' },
    url: { type: 'string', description: 'URL to the created issue' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: amend_order.ts]---
Location: sim-main/apps/sim/tools/kalshi/amend_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiAuthParams, KalshiOrder } from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiAmendOrderParams extends KalshiAuthParams {
  orderId: string // Order ID to amend (required)
  ticker: string // Market ticker (required)
  side: string // 'yes' or 'no' (required)
  action: string // 'buy' or 'sell' (required)
  clientOrderId: string // Original client order ID (required)
  updatedClientOrderId: string // New client order ID (required)
  count?: string // Updated quantity
  yesPrice?: string // Updated yes price in cents (1-99)
  noPrice?: string // Updated no price in cents (1-99)
  yesPriceDollars?: string // Updated yes price in dollars
  noPriceDollars?: string // Updated no price in dollars
}

export interface KalshiAmendOrderResponse {
  success: boolean
  output: {
    order: KalshiOrder
  }
}

export const kalshiAmendOrderTool: ToolConfig<KalshiAmendOrderParams, KalshiAmendOrderResponse> = {
  id: 'kalshi_amend_order',
  name: 'Amend Order on Kalshi',
  description: 'Modify the price or quantity of an existing order on Kalshi',
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
    orderId: {
      type: 'string',
      required: true,
      description: 'The order ID to amend',
    },
    ticker: {
      type: 'string',
      required: true,
      description: 'Market ticker',
    },
    side: {
      type: 'string',
      required: true,
      description: "Side of the order: 'yes' or 'no'",
    },
    action: {
      type: 'string',
      required: true,
      description: "Action type: 'buy' or 'sell'",
    },
    clientOrderId: {
      type: 'string',
      required: true,
      description: 'The original client-specified order ID',
    },
    updatedClientOrderId: {
      type: 'string',
      required: true,
      description: 'The new client-specified order ID after amendment',
    },
    count: {
      type: 'string',
      required: false,
      description: 'Updated quantity for the order',
    },
    yesPrice: {
      type: 'string',
      required: false,
      description: 'Updated yes price in cents (1-99)',
    },
    noPrice: {
      type: 'string',
      required: false,
      description: 'Updated no price in cents (1-99)',
    },
    yesPriceDollars: {
      type: 'string',
      required: false,
      description: 'Updated yes price in dollars (e.g., "0.56")',
    },
    noPriceDollars: {
      type: 'string',
      required: false,
      description: 'Updated no price in dollars (e.g., "0.56")',
    },
  },

  request: {
    url: (params) => buildKalshiUrl(`/portfolio/orders/${params.orderId}/amend`),
    method: 'POST',
    headers: (params) => {
      const path = `/trade-api/v2/portfolio/orders/${params.orderId}/amend`
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'POST', path)
    },
    body: (params) => {
      const body: Record<string, any> = {
        ticker: params.ticker,
        side: params.side.toLowerCase(),
        action: params.action.toLowerCase(),
        client_order_id: params.clientOrderId,
        updated_client_order_id: params.updatedClientOrderId,
      }

      if (params.count) body.count = Number.parseInt(params.count, 10)
      if (params.yesPrice) body.yes_price = Number.parseInt(params.yesPrice, 10)
      if (params.noPrice) body.no_price = Number.parseInt(params.noPrice, 10)
      if (params.yesPriceDollars) body.yes_price_dollars = params.yesPriceDollars
      if (params.noPriceDollars) body.no_price_dollars = params.noPriceDollars

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'amend_order')
    }

    return {
      success: true,
      output: {
        order: data.order,
      },
    }
  },

  outputs: {
    order: {
      type: 'object',
      description: 'The amended order object',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: cancel_order.ts]---
Location: sim-main/apps/sim/tools/kalshi/cancel_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiAuthParams, KalshiOrder } from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiCancelOrderParams extends KalshiAuthParams {
  orderId: string // Order ID to cancel (required)
}

export interface KalshiCancelOrderResponse {
  success: boolean
  output: {
    order: KalshiOrder
    reducedBy: number
  }
}

export const kalshiCancelOrderTool: ToolConfig<KalshiCancelOrderParams, KalshiCancelOrderResponse> =
  {
    id: 'kalshi_cancel_order',
    name: 'Cancel Order on Kalshi',
    description: 'Cancel an existing order on Kalshi',
    version: '1.0.0',

    params: {
      keyId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Kalshi API Key ID',
      },
      privateKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your RSA Private Key (PEM format)',
      },
      orderId: {
        type: 'string',
        required: true,
        description: 'The order ID to cancel',
      },
    },

    request: {
      url: (params) => buildKalshiUrl(`/portfolio/orders/${params.orderId}`),
      method: 'DELETE',
      headers: (params) => {
        const path = `/trade-api/v2/portfolio/orders/${params.orderId}`
        return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'DELETE', path)
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!response.ok) {
        handleKalshiError(data, response.status, 'cancel_order')
      }

      return {
        success: true,
        output: {
          order: data.order,
          reducedBy: data.reduced_by || 0,
        },
      }
    },

    outputs: {
      order: {
        type: 'object',
        description: 'The canceled order object',
      },
      reducedBy: {
        type: 'number',
        description: 'Number of contracts canceled',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: create_order.ts]---
Location: sim-main/apps/sim/tools/kalshi/create_order.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiAuthParams, KalshiOrder } from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiCreateOrderParams extends KalshiAuthParams {
  ticker: string // Market ticker (required)
  side: string // 'yes' or 'no' (required)
  action: string // 'buy' or 'sell' (required)
  count: string // Number of contracts (required)
  type?: string // 'limit' or 'market' (default: limit)
  yesPrice?: string // Yes price in cents (1-99)
  noPrice?: string // No price in cents (1-99)
  yesPriceDollars?: string // Yes price in dollars (e.g., "0.56")
  noPriceDollars?: string // No price in dollars (e.g., "0.56")
  clientOrderId?: string // Custom order identifier
  expirationTs?: string // Unix timestamp expiration
  timeInForce?: string // 'fill_or_kill', 'good_till_canceled', 'immediate_or_cancel'
  buyMaxCost?: string // Maximum cost in cents
  postOnly?: string // 'true' or 'false' - maker-only orders
  reduceOnly?: string // 'true' or 'false' - position reduction only
  selfTradePreventionType?: string // 'taker_at_cross' or 'maker'
  orderGroupId?: string // Associated order group
}

export interface KalshiCreateOrderResponse {
  success: boolean
  output: {
    order: KalshiOrder
  }
}

export const kalshiCreateOrderTool: ToolConfig<KalshiCreateOrderParams, KalshiCreateOrderResponse> =
  {
    id: 'kalshi_create_order',
    name: 'Create Order on Kalshi',
    description: 'Create a new order on a Kalshi prediction market',
    version: '1.0.0',

    params: {
      keyId: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your Kalshi API Key ID',
      },
      privateKey: {
        type: 'string',
        required: true,
        visibility: 'user-only',
        description: 'Your RSA Private Key (PEM format)',
      },
      ticker: {
        type: 'string',
        required: true,
        description: 'Market ticker (e.g., KXBTC-24DEC31)',
      },
      side: {
        type: 'string',
        required: true,
        description: "Side of the order: 'yes' or 'no'",
      },
      action: {
        type: 'string',
        required: true,
        description: "Action type: 'buy' or 'sell'",
      },
      count: {
        type: 'string',
        required: true,
        description: 'Number of contracts (minimum 1)',
      },
      type: {
        type: 'string',
        required: false,
        description: "Order type: 'limit' or 'market' (default: limit)",
      },
      yesPrice: {
        type: 'string',
        required: false,
        description: 'Yes price in cents (1-99)',
      },
      noPrice: {
        type: 'string',
        required: false,
        description: 'No price in cents (1-99)',
      },
      yesPriceDollars: {
        type: 'string',
        required: false,
        description: 'Yes price in dollars (e.g., "0.56")',
      },
      noPriceDollars: {
        type: 'string',
        required: false,
        description: 'No price in dollars (e.g., "0.56")',
      },
      clientOrderId: {
        type: 'string',
        required: false,
        description: 'Custom order identifier',
      },
      expirationTs: {
        type: 'string',
        required: false,
        description: 'Unix timestamp for order expiration',
      },
      timeInForce: {
        type: 'string',
        required: false,
        description: "Time in force: 'fill_or_kill', 'good_till_canceled', 'immediate_or_cancel'",
      },
      buyMaxCost: {
        type: 'string',
        required: false,
        description: 'Maximum cost in cents (auto-enables fill_or_kill)',
      },
      postOnly: {
        type: 'string',
        required: false,
        description: "Set to 'true' for maker-only orders",
      },
      reduceOnly: {
        type: 'string',
        required: false,
        description: "Set to 'true' for position reduction only",
      },
      selfTradePreventionType: {
        type: 'string',
        required: false,
        description: "Self-trade prevention: 'taker_at_cross' or 'maker'",
      },
      orderGroupId: {
        type: 'string',
        required: false,
        description: 'Associated order group ID',
      },
    },

    request: {
      url: () => buildKalshiUrl('/portfolio/orders'),
      method: 'POST',
      headers: (params) => {
        const path = '/trade-api/v2/portfolio/orders'
        return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'POST', path)
      },
      body: (params) => {
        const body: Record<string, any> = {
          ticker: params.ticker,
          side: params.side.toLowerCase(),
          action: params.action.toLowerCase(),
          count: Number.parseInt(params.count, 10),
        }

        if (params.type) body.type = params.type.toLowerCase()
        if (params.yesPrice) body.yes_price = Number.parseInt(params.yesPrice, 10)
        if (params.noPrice) body.no_price = Number.parseInt(params.noPrice, 10)
        if (params.yesPriceDollars) body.yes_price_dollars = params.yesPriceDollars
        if (params.noPriceDollars) body.no_price_dollars = params.noPriceDollars
        if (params.clientOrderId) body.client_order_id = params.clientOrderId
        if (params.expirationTs) body.expiration_ts = Number.parseInt(params.expirationTs, 10)
        if (params.timeInForce) body.time_in_force = params.timeInForce
        if (params.buyMaxCost) body.buy_max_cost = Number.parseInt(params.buyMaxCost, 10)
        if (params.postOnly) body.post_only = params.postOnly === 'true'
        if (params.reduceOnly) body.reduce_only = params.reduceOnly === 'true'
        if (params.selfTradePreventionType)
          body.self_trade_prevention_type = params.selfTradePreventionType
        if (params.orderGroupId) body.order_group_id = params.orderGroupId

        return body
      },
    },

    transformResponse: async (response: Response) => {
      const data = await response.json()

      if (!response.ok) {
        handleKalshiError(data, response.status, 'create_order')
      }

      return {
        success: true,
        output: {
          order: data.order,
        },
      }
    },

    outputs: {
      order: {
        type: 'object',
        description: 'The created order object',
      },
    },
  }
```

--------------------------------------------------------------------------------

---[FILE: get_balance.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_balance.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiAuthParams } from './types'
import { buildKalshiAuthHeaders, buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetBalanceParams extends KalshiAuthParams {}

export interface KalshiGetBalanceResponse {
  success: boolean
  output: {
    balance: number // In cents
    portfolioValue?: number // In cents
    balanceDollars: number // Converted to dollars
    portfolioValueDollars?: number // Converted to dollars
  }
}

export const kalshiGetBalanceTool: ToolConfig<KalshiGetBalanceParams, KalshiGetBalanceResponse> = {
  id: 'kalshi_get_balance',
  name: 'Get Balance from Kalshi',
  description: 'Retrieve your account balance and portfolio value from Kalshi',
  version: '1.0.0',

  params: {
    keyId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Kalshi API Key ID',
    },
    privateKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your RSA Private Key (PEM format)',
    },
  },

  request: {
    url: () => buildKalshiUrl('/portfolio/balance'),
    method: 'GET',
    headers: (params) => {
      const path = '/trade-api/v2/portfolio/balance'
      return buildKalshiAuthHeaders(params.keyId, params.privateKey, 'GET', path)
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_balance')
    }

    const balance = data.balance || 0
    const portfolioValue = data.portfolio_value

    return {
      success: true,
      output: {
        balance,
        portfolioValue,
        balanceDollars: balance / 100,
        portfolioValueDollars: portfolioValue ? portfolioValue / 100 : undefined,
      },
    }
  },

  outputs: {
    balance: { type: 'number', description: 'Account balance in cents' },
    portfolioValue: { type: 'number', description: 'Portfolio value in cents' },
    balanceDollars: { type: 'number', description: 'Account balance in dollars' },
    portfolioValueDollars: { type: 'number', description: 'Portfolio value in dollars' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_candlesticks.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_candlesticks.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiCandlestick } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetCandlesticksParams {
  seriesTicker: string
  ticker: string
  startTs: number
  endTs: number
  periodInterval: number // 1, 60, or 1440 (1min, 1hour, 1day)
}

export interface KalshiGetCandlesticksResponse {
  success: boolean
  output: {
    candlesticks: KalshiCandlestick[]
  }
}

export const kalshiGetCandlesticksTool: ToolConfig<
  KalshiGetCandlesticksParams,
  KalshiGetCandlesticksResponse
> = {
  id: 'kalshi_get_candlesticks',
  name: 'Get Market Candlesticks from Kalshi',
  description: 'Retrieve OHLC candlestick data for a specific market',
  version: '1.0.0',

  params: {
    seriesTicker: {
      type: 'string',
      required: true,
      description: 'Series ticker',
    },
    ticker: {
      type: 'string',
      required: true,
      description: 'Market ticker (e.g., KXBTC-24DEC31)',
    },
    startTs: {
      type: 'number',
      required: true,
      description: 'Start timestamp (Unix seconds)',
    },
    endTs: {
      type: 'number',
      required: true,
      description: 'End timestamp (Unix seconds)',
    },
    periodInterval: {
      type: 'number',
      required: true,
      description: 'Period interval: 1 (1min), 60 (1hour), or 1440 (1day)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      queryParams.append('start_ts', params.startTs.toString())
      queryParams.append('end_ts', params.endTs.toString())
      queryParams.append('period_interval', params.periodInterval.toString())

      const query = queryParams.toString()
      const url = buildKalshiUrl(
        `/series/${params.seriesTicker}/markets/${params.ticker}/candlesticks`
      )
      return `${url}?${query}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_candlesticks')
    }

    const candlesticks = data.candlesticks || []

    return {
      success: true,
      output: {
        candlesticks,
      },
    }
  },

  outputs: {
    candlesticks: {
      type: 'array',
      description: 'Array of OHLC candlestick data',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_event.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_event.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiEvent } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetEventParams {
  eventTicker: string // Event ticker
  withNestedMarkets?: string // 'true' or 'false'
}

export interface KalshiGetEventResponse {
  success: boolean
  output: {
    event: KalshiEvent
  }
}

export const kalshiGetEventTool: ToolConfig<KalshiGetEventParams, KalshiGetEventResponse> = {
  id: 'kalshi_get_event',
  name: 'Get Event from Kalshi',
  description: 'Retrieve details of a specific event by ticker',
  version: '1.0.0',

  params: {
    eventTicker: {
      type: 'string',
      required: true,
      description: 'The event ticker',
    },
    withNestedMarkets: {
      type: 'string',
      required: false,
      description: 'Include nested markets in response (true/false)',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.withNestedMarkets)
        queryParams.append('with_nested_markets', params.withNestedMarkets)

      const query = queryParams.toString()
      const url = buildKalshiUrl(`/events/${params.eventTicker}`)
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_event')
    }

    return {
      success: true,
      output: {
        event: data.event,
      },
    }
  },

  outputs: {
    event: {
      type: 'object',
      description: 'Event object with details',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_events.ts]---
Location: sim-main/apps/sim/tools/kalshi/get_events.ts

```typescript
import type { ToolConfig } from '@/tools/types'
import type { KalshiEvent, KalshiPaginationParams, KalshiPagingInfo } from './types'
import { buildKalshiUrl, handleKalshiError } from './types'

export interface KalshiGetEventsParams extends KalshiPaginationParams {
  status?: string // open, closed, settled
  seriesTicker?: string
  withNestedMarkets?: string // 'true' or 'false'
}

export interface KalshiGetEventsResponse {
  success: boolean
  output: {
    events: KalshiEvent[]
    paging?: KalshiPagingInfo
  }
}

export const kalshiGetEventsTool: ToolConfig<KalshiGetEventsParams, KalshiGetEventsResponse> = {
  id: 'kalshi_get_events',
  name: 'Get Events from Kalshi',
  description: 'Retrieve a list of events from Kalshi with optional filtering',
  version: '1.0.0',

  params: {
    status: {
      type: 'string',
      required: false,
      description: 'Filter by status (open, closed, settled)',
    },
    seriesTicker: {
      type: 'string',
      required: false,
      description: 'Filter by series ticker',
    },
    withNestedMarkets: {
      type: 'string',
      required: false,
      description: 'Include nested markets in response (true/false)',
    },
    limit: {
      type: 'string',
      required: false,
      description: 'Number of results (1-200, default: 200)',
    },
    cursor: {
      type: 'string',
      required: false,
      description: 'Pagination cursor for next page',
    },
  },

  request: {
    url: (params) => {
      const queryParams = new URLSearchParams()
      if (params.status) queryParams.append('status', params.status)
      if (params.seriesTicker) queryParams.append('series_ticker', params.seriesTicker)
      if (params.withNestedMarkets)
        queryParams.append('with_nested_markets', params.withNestedMarkets)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.cursor) queryParams.append('cursor', params.cursor)

      const query = queryParams.toString()
      const url = buildKalshiUrl('/events')
      return query ? `${url}?${query}` : url
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    if (!response.ok) {
      handleKalshiError(data, response.status, 'get_events')
    }

    const events = data.events || []

    return {
      success: true,
      output: {
        events,
        paging: {
          cursor: data.cursor || null,
        },
      },
    }
  },

  outputs: {
    events: {
      type: 'array',
      description: 'Array of event objects',
    },
    paging: {
      type: 'object',
      description: 'Pagination cursor for fetching more results',
    },
  },
}
```

--------------------------------------------------------------------------------

````
