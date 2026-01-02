---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 589
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 589 of 933)

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

---[FILE: provider-subscriptions.ts]---
Location: sim-main/apps/sim/lib/webhooks/provider-subscriptions.ts
Signals: Next.js

```typescript
import type { NextRequest } from 'next/server'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { getOAuthToken, refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

const teamsLogger = createLogger('TeamsSubscription')
const telegramLogger = createLogger('TelegramWebhook')
const airtableLogger = createLogger('AirtableWebhook')
const typeformLogger = createLogger('TypeformWebhook')
const calendlyLogger = createLogger('CalendlyWebhook')

function getProviderConfig(webhook: any): Record<string, any> {
  return (webhook.providerConfig as Record<string, any>) || {}
}

function getNotificationUrl(webhook: any): string {
  return `${getBaseUrl()}/api/webhooks/trigger/${webhook.path}`
}

/**
 * Create a Microsoft Teams chat subscription
 * Throws errors with friendly messages if subscription creation fails
 */
export async function createTeamsSubscription(
  request: NextRequest,
  webhook: any,
  workflow: any,
  requestId: string
): Promise<void> {
  const config = getProviderConfig(webhook)

  if (config.triggerId !== 'microsoftteams_chat_subscription') {
    return
  }

  const credentialId = config.credentialId as string | undefined
  const chatId = config.chatId as string | undefined

  if (!credentialId) {
    teamsLogger.warn(
      `[${requestId}] Missing credentialId for Teams chat subscription ${webhook.id}`
    )
    throw new Error(
      'Microsoft Teams credentials are required. Please connect your Microsoft account in the trigger configuration.'
    )
  }

  if (!chatId) {
    teamsLogger.warn(`[${requestId}] Missing chatId for Teams chat subscription ${webhook.id}`)
    throw new Error(
      'Chat ID is required to create a Teams subscription. Please provide a valid chat ID.'
    )
  }

  const accessToken = await refreshAccessTokenIfNeeded(credentialId, workflow.userId, requestId)
  if (!accessToken) {
    teamsLogger.error(
      `[${requestId}] Failed to get access token for Teams subscription ${webhook.id}`
    )
    throw new Error(
      'Failed to authenticate with Microsoft Teams. Please reconnect your Microsoft account and try again.'
    )
  }

  const existingSubscriptionId = config.externalSubscriptionId as string | undefined
  if (existingSubscriptionId) {
    try {
      const checkRes = await fetch(
        `https://graph.microsoft.com/v1.0/subscriptions/${existingSubscriptionId}`,
        { method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } }
      )
      if (checkRes.ok) {
        teamsLogger.info(
          `[${requestId}] Teams subscription ${existingSubscriptionId} already exists for webhook ${webhook.id}`
        )
        return
      }
    } catch {
      teamsLogger.debug(`[${requestId}] Existing subscription check failed, will create new one`)
    }
  }

  // Always use NEXT_PUBLIC_APP_URL to ensure Microsoft Graph can reach the public endpoint
  const notificationUrl = getNotificationUrl(webhook)
  const resource = `/chats/${chatId}/messages`

  // Max lifetime: 4230 minutes (~3 days) - Microsoft Graph API limit
  const maxLifetimeMinutes = 4230
  const expirationDateTime = new Date(Date.now() + maxLifetimeMinutes * 60 * 1000).toISOString()

  const body = {
    changeType: 'created,updated',
    notificationUrl,
    lifecycleNotificationUrl: notificationUrl,
    resource,
    includeResourceData: false,
    expirationDateTime,
    clientState: webhook.id,
  }

  try {
    const res = await fetch('https://graph.microsoft.com/v1.0/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const payload = await res.json()
    if (!res.ok) {
      const errorMessage =
        payload.error?.message || payload.error?.code || 'Unknown Microsoft Graph API error'
      teamsLogger.error(
        `[${requestId}] Failed to create Teams subscription for webhook ${webhook.id}`,
        {
          status: res.status,
          error: payload.error,
        }
      )

      let userFriendlyMessage = 'Failed to create Teams subscription'
      if (res.status === 401 || res.status === 403) {
        userFriendlyMessage =
          'Authentication failed. Please reconnect your Microsoft Teams account and ensure you have the necessary permissions.'
      } else if (res.status === 404) {
        userFriendlyMessage =
          'Chat not found. Please verify that the Chat ID is correct and that you have access to the specified chat.'
      } else if (errorMessage && errorMessage !== 'Unknown Microsoft Graph API error') {
        userFriendlyMessage = `Teams error: ${errorMessage}`
      }

      throw new Error(userFriendlyMessage)
    }

    teamsLogger.info(
      `[${requestId}] Successfully created Teams subscription ${payload.id} for webhook ${webhook.id}`
    )
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error.message.includes('credentials') ||
        error.message.includes('Chat ID') ||
        error.message.includes('authenticate'))
    ) {
      throw error
    }

    teamsLogger.error(
      `[${requestId}] Error creating Teams subscription for webhook ${webhook.id}`,
      error
    )
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create Teams subscription. Please try again.'
    )
  }
}

/**
 * Delete a Microsoft Teams chat subscription
 * Don't fail webhook deletion if cleanup fails
 */
export async function deleteTeamsSubscription(
  webhook: any,
  workflow: any,
  requestId: string
): Promise<void> {
  try {
    const config = getProviderConfig(webhook)

    if (config.triggerId !== 'microsoftteams_chat_subscription') {
      return
    }

    const externalSubscriptionId = config.externalSubscriptionId as string | undefined
    const credentialId = config.credentialId as string | undefined

    if (!externalSubscriptionId || !credentialId) {
      teamsLogger.info(
        `[${requestId}] No external subscription to delete for webhook ${webhook.id}`
      )
      return
    }

    const accessToken = await refreshAccessTokenIfNeeded(credentialId, workflow.userId, requestId)
    if (!accessToken) {
      teamsLogger.warn(
        `[${requestId}] Could not get access token to delete Teams subscription for webhook ${webhook.id}`
      )
      return
    }

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/subscriptions/${externalSubscriptionId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    if (res.ok || res.status === 404) {
      teamsLogger.info(
        `[${requestId}] Successfully deleted Teams subscription ${externalSubscriptionId} for webhook ${webhook.id}`
      )
    } else {
      const errorBody = await res.text()
      teamsLogger.warn(
        `[${requestId}] Failed to delete Teams subscription ${externalSubscriptionId} for webhook ${webhook.id}. Status: ${res.status}`
      )
    }
  } catch (error) {
    teamsLogger.error(
      `[${requestId}] Error deleting Teams subscription for webhook ${webhook.id}`,
      error
    )
  }
}

/**
 * Create a Telegram bot webhook
 * Throws errors with friendly messages if webhook creation fails
 */
export async function createTelegramWebhook(
  request: NextRequest,
  webhook: any,
  requestId: string
): Promise<void> {
  const config = getProviderConfig(webhook)
  const botToken = config.botToken as string | undefined

  if (!botToken) {
    telegramLogger.warn(`[${requestId}] Missing botToken for Telegram webhook ${webhook.id}`)
    throw new Error(
      'Bot token is required to create a Telegram webhook. Please provide a valid Telegram bot token.'
    )
  }

  const notificationUrl = getNotificationUrl(webhook)
  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook`

  try {
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TelegramBot/1.0',
      },
      body: JSON.stringify({ url: notificationUrl }),
    })

    const responseBody = await telegramResponse.json()
    if (!telegramResponse.ok || !responseBody.ok) {
      const errorMessage =
        responseBody.description ||
        `Failed to create Telegram webhook. Status: ${telegramResponse.status}`
      telegramLogger.error(`[${requestId}] ${errorMessage}`, { response: responseBody })

      let userFriendlyMessage = 'Failed to create Telegram webhook'
      if (telegramResponse.status === 401) {
        userFriendlyMessage =
          'Invalid bot token. Please verify that the bot token is correct and try again.'
      } else if (responseBody.description) {
        userFriendlyMessage = `Telegram error: ${responseBody.description}`
      }

      throw new Error(userFriendlyMessage)
    }

    telegramLogger.info(
      `[${requestId}] Successfully created Telegram webhook for webhook ${webhook.id}`
    )
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error.message.includes('Bot token') || error.message.includes('Telegram error'))
    ) {
      throw error
    }

    telegramLogger.error(
      `[${requestId}] Error creating Telegram webhook for webhook ${webhook.id}`,
      error
    )
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create Telegram webhook. Please try again.'
    )
  }
}

/**
 * Delete a Telegram bot webhook
 * Don't fail webhook deletion if cleanup fails
 */
export async function deleteTelegramWebhook(webhook: any, requestId: string): Promise<void> {
  try {
    const config = getProviderConfig(webhook)
    const botToken = config.botToken as string | undefined

    if (!botToken) {
      telegramLogger.warn(
        `[${requestId}] Missing botToken for Telegram webhook deletion ${webhook.id}`
      )
      return
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/deleteWebhook`
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const responseBody = await telegramResponse.json()
    if (!telegramResponse.ok || !responseBody.ok) {
      const errorMessage =
        responseBody.description ||
        `Failed to delete Telegram webhook. Status: ${telegramResponse.status}`
      telegramLogger.error(`[${requestId}] ${errorMessage}`, { response: responseBody })
    } else {
      telegramLogger.info(
        `[${requestId}] Successfully deleted Telegram webhook for webhook ${webhook.id}`
      )
    }
  } catch (error) {
    telegramLogger.error(
      `[${requestId}] Error deleting Telegram webhook for webhook ${webhook.id}`,
      error
    )
  }
}

/**
 * Delete an Airtable webhook
 * Don't fail webhook deletion if cleanup fails
 */
export async function deleteAirtableWebhook(
  webhook: any,
  workflow: any,
  requestId: string
): Promise<void> {
  try {
    const config = getProviderConfig(webhook)
    const { baseId, externalId } = config as {
      baseId?: string
      externalId?: string
    }

    if (!baseId) {
      airtableLogger.warn(`[${requestId}] Missing baseId for Airtable webhook deletion`, {
        webhookId: webhook.id,
      })
      return
    }

    const userIdForToken = workflow.userId
    const accessToken = await getOAuthToken(userIdForToken, 'airtable')
    if (!accessToken) {
      airtableLogger.warn(
        `[${requestId}] Could not retrieve Airtable access token for user ${userIdForToken}. Cannot delete webhook in Airtable.`,
        { webhookId: webhook.id }
      )
      return
    }

    let resolvedExternalId: string | undefined = externalId

    if (!resolvedExternalId) {
      try {
        const expectedNotificationUrl = getNotificationUrl(webhook)

        const listUrl = `https://api.airtable.com/v0/bases/${baseId}/webhooks`
        const listResp = await fetch(listUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const listBody = await listResp.json().catch(() => null)

        if (listResp.ok && listBody && Array.isArray(listBody.webhooks)) {
          const match = listBody.webhooks.find((w: any) => {
            const url: string | undefined = w?.notificationUrl
            if (!url) return false
            return (
              url === expectedNotificationUrl ||
              url.endsWith(`/api/webhooks/trigger/${webhook.path}`)
            )
          })
          if (match?.id) {
            resolvedExternalId = match.id as string
            airtableLogger.info(`[${requestId}] Resolved Airtable externalId by listing webhooks`, {
              baseId,
              externalId: resolvedExternalId,
            })
          } else {
            airtableLogger.warn(`[${requestId}] Could not resolve Airtable externalId from list`, {
              baseId,
              expectedNotificationUrl,
            })
          }
        } else {
          airtableLogger.warn(
            `[${requestId}] Failed to list Airtable webhooks to resolve externalId`,
            {
              baseId,
              status: listResp.status,
              body: listBody,
            }
          )
        }
      } catch (e: any) {
        airtableLogger.warn(`[${requestId}] Error attempting to resolve Airtable externalId`, {
          error: e?.message,
        })
      }
    }

    if (!resolvedExternalId) {
      airtableLogger.info(
        `[${requestId}] Airtable externalId not found; skipping remote deletion`,
        { baseId }
      )
      return
    }

    const airtableDeleteUrl = `https://api.airtable.com/v0/bases/${baseId}/webhooks/${resolvedExternalId}`
    const airtableResponse = await fetch(airtableDeleteUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!airtableResponse.ok) {
      let responseBody: any = null
      try {
        responseBody = await airtableResponse.json()
      } catch {
        // Ignore parse errors
      }

      airtableLogger.warn(
        `[${requestId}] Failed to delete Airtable webhook in Airtable. Status: ${airtableResponse.status}`,
        { baseId, externalId: resolvedExternalId, response: responseBody }
      )
    } else {
      airtableLogger.info(`[${requestId}] Successfully deleted Airtable webhook in Airtable`, {
        baseId,
        externalId: resolvedExternalId,
      })
    }
  } catch (error: any) {
    airtableLogger.error(`[${requestId}] Error deleting Airtable webhook`, {
      webhookId: webhook.id,
      error: error.message,
      stack: error.stack,
    })
  }
}

/**
 * Create a Typeform webhook subscription
 * Throws errors with friendly messages if webhook creation fails
 */
export async function createTypeformWebhook(
  request: NextRequest,
  webhook: any,
  requestId: string
): Promise<string> {
  const config = getProviderConfig(webhook)
  const formId = config.formId as string | undefined
  const apiKey = config.apiKey as string | undefined
  const webhookTag = config.webhookTag as string | undefined
  const secret = config.secret as string | undefined

  if (!formId) {
    typeformLogger.warn(`[${requestId}] Missing formId for Typeform webhook ${webhook.id}`)
    throw new Error(
      'Form ID is required to create a Typeform webhook. Please provide a valid form ID.'
    )
  }

  if (!apiKey) {
    typeformLogger.warn(`[${requestId}] Missing apiKey for Typeform webhook ${webhook.id}`)
    throw new Error(
      'Personal Access Token is required to create a Typeform webhook. Please provide your Typeform API key.'
    )
  }

  const tag = webhookTag || `sim-${webhook.id.substring(0, 8)}`
  const notificationUrl = getNotificationUrl(webhook)

  try {
    const typeformApiUrl = `https://api.typeform.com/forms/${formId}/webhooks/${tag}`

    const requestBody: Record<string, any> = {
      url: notificationUrl,
      enabled: true,
      verify_ssl: true,
      event_types: {
        form_response: true,
      },
    }

    if (secret) {
      requestBody.secret = secret
    }

    const typeformResponse = await fetch(typeformApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!typeformResponse.ok) {
      const responseBody = await typeformResponse.json().catch(() => ({}))
      const errorMessage = responseBody.description || responseBody.message || 'Unknown error'

      typeformLogger.error(`[${requestId}] Typeform API error: ${errorMessage}`, {
        status: typeformResponse.status,
        response: responseBody,
      })

      let userFriendlyMessage = 'Failed to create Typeform webhook'
      if (typeformResponse.status === 401) {
        userFriendlyMessage =
          'Invalid Personal Access Token. Please verify your Typeform API key and try again.'
      } else if (typeformResponse.status === 403) {
        userFriendlyMessage =
          'Access denied. Please ensure you have a Typeform PRO or PRO+ account and the API key has webhook permissions.'
      } else if (typeformResponse.status === 404) {
        userFriendlyMessage = 'Form not found. Please verify the form ID is correct.'
      } else if (responseBody.description || responseBody.message) {
        userFriendlyMessage = `Typeform error: ${errorMessage}`
      }

      throw new Error(userFriendlyMessage)
    }

    const responseBody = await typeformResponse.json()
    typeformLogger.info(
      `[${requestId}] Successfully created Typeform webhook for webhook ${webhook.id} with tag ${tag}`,
      { webhookId: responseBody.id }
    )

    return tag
  } catch (error: any) {
    if (
      error instanceof Error &&
      (error.message.includes('Form ID') ||
        error.message.includes('Personal Access Token') ||
        error.message.includes('Typeform error'))
    ) {
      throw error
    }

    typeformLogger.error(
      `[${requestId}] Error creating Typeform webhook for webhook ${webhook.id}`,
      error
    )
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to create Typeform webhook. Please try again.'
    )
  }
}

/**
 * Delete a Typeform webhook
 * Don't fail webhook deletion if cleanup fails
 */
export async function deleteTypeformWebhook(webhook: any, requestId: string): Promise<void> {
  try {
    const config = getProviderConfig(webhook)
    const formId = config.formId as string | undefined
    const apiKey = config.apiKey as string | undefined
    const webhookTag = config.webhookTag as string | undefined

    if (!formId || !apiKey) {
      typeformLogger.warn(
        `[${requestId}] Missing formId or apiKey for Typeform webhook deletion ${webhook.id}, skipping cleanup`
      )
      return
    }

    const tag = webhookTag || `sim-${webhook.id.substring(0, 8)}`
    const typeformApiUrl = `https://api.typeform.com/forms/${formId}/webhooks/${tag}`

    const typeformResponse = await fetch(typeformApiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!typeformResponse.ok && typeformResponse.status !== 404) {
      typeformLogger.warn(
        `[${requestId}] Failed to delete Typeform webhook (non-fatal): ${typeformResponse.status}`
      )
    } else {
      typeformLogger.info(`[${requestId}] Successfully deleted Typeform webhook with tag ${tag}`)
    }
  } catch (error) {
    typeformLogger.warn(`[${requestId}] Error deleting Typeform webhook (non-fatal)`, error)
  }
}

/**
 * Delete a Calendly webhook subscription
 * Don't fail webhook deletion if cleanup fails
 */
export async function deleteCalendlyWebhook(webhook: any, requestId: string): Promise<void> {
  try {
    const config = getProviderConfig(webhook)
    const apiKey = config.apiKey as string | undefined
    const externalId = config.externalId as string | undefined

    if (!apiKey) {
      calendlyLogger.warn(
        `[${requestId}] Missing apiKey for Calendly webhook deletion ${webhook.id}, skipping cleanup`
      )
      return
    }

    if (!externalId) {
      calendlyLogger.warn(
        `[${requestId}] Missing externalId for Calendly webhook deletion ${webhook.id}, skipping cleanup`
      )
      return
    }

    const calendlyApiUrl = `https://api.calendly.com/webhook_subscriptions/${externalId}`

    const calendlyResponse = await fetch(calendlyApiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!calendlyResponse.ok && calendlyResponse.status !== 404) {
      const responseBody = await calendlyResponse.json().catch(() => ({}))
      calendlyLogger.warn(
        `[${requestId}] Failed to delete Calendly webhook (non-fatal): ${calendlyResponse.status}`,
        { response: responseBody }
      )
    } else {
      calendlyLogger.info(
        `[${requestId}] Successfully deleted Calendly webhook subscription ${externalId}`
      )
    }
  } catch (error) {
    calendlyLogger.warn(`[${requestId}] Error deleting Calendly webhook (non-fatal)`, error)
  }
}

/**
 * Clean up external webhook subscriptions for a webhook
 * Handles Airtable, Teams, Telegram, Typeform, and Calendly cleanup
 * Don't fail deletion if cleanup fails
 */
export async function cleanupExternalWebhook(
  webhook: any,
  workflow: any,
  requestId: string
): Promise<void> {
  if (webhook.provider === 'airtable') {
    await deleteAirtableWebhook(webhook, workflow, requestId)
  } else if (webhook.provider === 'microsoft-teams') {
    await deleteTeamsSubscription(webhook, workflow, requestId)
  } else if (webhook.provider === 'telegram') {
    await deleteTelegramWebhook(webhook, requestId)
  } else if (webhook.provider === 'typeform') {
    await deleteTypeformWebhook(webhook, requestId)
  } else if (webhook.provider === 'calendly') {
    await deleteCalendlyWebhook(webhook, requestId)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: provider-utils.ts]---
Location: sim-main/apps/sim/lib/webhooks/provider-utils.ts

```typescript
/**
 * Provider-specific unique identifier extractors for webhook idempotency
 */

function extractSlackIdentifier(body: any): string | null {
  if (body.event_id) {
    return body.event_id
  }

  if (body.event?.ts && body.team_id) {
    return `${body.team_id}:${body.event.ts}`
  }

  return null
}

function extractTwilioIdentifier(body: any): string | null {
  return body.MessageSid || body.CallSid || null
}

function extractStripeIdentifier(body: any): string | null {
  if (body.id && body.object === 'event') {
    return body.id
  }
  return null
}

function extractHubSpotIdentifier(body: any): string | null {
  if (Array.isArray(body) && body.length > 0 && body[0]?.eventId) {
    return String(body[0].eventId)
  }
  return null
}

function extractLinearIdentifier(body: any): string | null {
  if (body.action && body.data?.id) {
    return `${body.action}:${body.data.id}`
  }
  return null
}

function extractJiraIdentifier(body: any): string | null {
  if (body.webhookEvent && (body.issue?.id || body.project?.id)) {
    return `${body.webhookEvent}:${body.issue?.id || body.project?.id}`
  }
  return null
}

function extractMicrosoftTeamsIdentifier(body: any): string | null {
  if (body.value && Array.isArray(body.value) && body.value.length > 0) {
    const notification = body.value[0]
    if (notification.subscriptionId && notification.resourceData?.id) {
      return `${notification.subscriptionId}:${notification.resourceData.id}`
    }
  }
  return null
}

function extractAirtableIdentifier(body: any): string | null {
  if (body.cursor && typeof body.cursor === 'string') {
    return body.cursor
  }
  return null
}

const PROVIDER_EXTRACTORS: Record<string, (body: any) => string | null> = {
  slack: extractSlackIdentifier,
  twilio: extractTwilioIdentifier,
  twilio_voice: extractTwilioIdentifier,
  stripe: extractStripeIdentifier,
  hubspot: extractHubSpotIdentifier,
  linear: extractLinearIdentifier,
  jira: extractJiraIdentifier,
  'microsoft-teams': extractMicrosoftTeamsIdentifier,
  airtable: extractAirtableIdentifier,
}

export function extractProviderIdentifierFromBody(provider: string, body: any): string | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const extractor = PROVIDER_EXTRACTORS[provider]
  return extractor ? extractor(body) : null
}
```

--------------------------------------------------------------------------------

---[FILE: rss-polling-service.ts]---
Location: sim-main/apps/sim/lib/webhooks/rss-polling-service.ts

```typescript
import { db } from '@sim/db'
import { webhook, workflow } from '@sim/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import Parser from 'rss-parser'
import { pollingIdempotency } from '@/lib/core/idempotency/service'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('RssPollingService')

const MAX_CONSECUTIVE_FAILURES = 10
const MAX_GUIDS_TO_TRACK = 100 // Track recent guids to prevent duplicates

interface RssWebhookConfig {
  feedUrl: string
  lastCheckedTimestamp?: string
  lastSeenGuids?: string[]
  etag?: string
  lastModified?: string
}

interface RssItem {
  title?: string
  link?: string
  pubDate?: string
  guid?: string
  description?: string
  content?: string
  contentSnippet?: string
  author?: string
  creator?: string
  categories?: string[]
  enclosure?: {
    url: string
    type?: string
    length?: string | number
  }
  isoDate?: string
  [key: string]: any
}

interface RssFeed {
  title?: string
  link?: string
  description?: string
  items: RssItem[]
}

export interface RssWebhookPayload {
  item: RssItem
  feed: {
    title?: string
    link?: string
    description?: string
  }
  timestamp: string
}

const parser = new Parser({
  timeout: 30000,
  headers: {
    'User-Agent': 'SimStudio/1.0 RSS Poller',
  },
})

async function markWebhookFailed(webhookId: string) {
  try {
    const result = await db
      .update(webhook)
      .set({
        failedCount: sql`COALESCE(${webhook.failedCount}, 0) + 1`,
        lastFailedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(webhook.id, webhookId))
      .returning({ failedCount: webhook.failedCount })

    const newFailedCount = result[0]?.failedCount || 0
    const shouldDisable = newFailedCount >= MAX_CONSECUTIVE_FAILURES

    if (shouldDisable) {
      await db
        .update(webhook)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(webhook.id, webhookId))

      logger.warn(
        `Webhook ${webhookId} auto-disabled after ${MAX_CONSECUTIVE_FAILURES} consecutive failures`
      )
    }
  } catch (err) {
    logger.error(`Failed to mark webhook ${webhookId} as failed:`, err)
  }
}

async function markWebhookSuccess(webhookId: string) {
  try {
    await db
      .update(webhook)
      .set({
        failedCount: 0,
        updatedAt: new Date(),
      })
      .where(eq(webhook.id, webhookId))
  } catch (err) {
    logger.error(`Failed to mark webhook ${webhookId} as successful:`, err)
  }
}

export async function pollRssWebhooks() {
  logger.info('Starting RSS webhook polling')

  try {
    const activeWebhooksResult = await db
      .select({ webhook })
      .from(webhook)
      .innerJoin(workflow, eq(webhook.workflowId, workflow.id))
      .where(
        and(eq(webhook.provider, 'rss'), eq(webhook.isActive, true), eq(workflow.isDeployed, true))
      )

    const activeWebhooks = activeWebhooksResult.map((r) => r.webhook)

    if (!activeWebhooks.length) {
      logger.info('No active RSS webhooks found')
      return { total: 0, successful: 0, failed: 0, details: [] }
    }

    logger.info(`Found ${activeWebhooks.length} active RSS webhooks`)

    const CONCURRENCY = 10
    const running: Promise<void>[] = []
    let successCount = 0
    let failureCount = 0

    const enqueue = async (webhookData: (typeof activeWebhooks)[number]) => {
      const webhookId = webhookData.id
      const requestId = nanoid()

      try {
        const config = webhookData.providerConfig as unknown as RssWebhookConfig

        if (!config?.feedUrl) {
          logger.error(`[${requestId}] Missing feedUrl for webhook ${webhookId}`)
          await markWebhookFailed(webhookId)
          failureCount++
          return
        }

        const now = new Date()

        const { feed, items: newItems } = await fetchNewRssItems(config, requestId)

        if (!newItems.length) {
          await updateWebhookConfig(webhookId, config, now.toISOString(), [])
          await markWebhookSuccess(webhookId)
          logger.info(`[${requestId}] No new items found for webhook ${webhookId}`)
          successCount++
          return
        }

        logger.info(`[${requestId}] Found ${newItems.length} new items for webhook ${webhookId}`)

        const { processedCount, failedCount: itemFailedCount } = await processRssItems(
          newItems,
          feed,
          webhookData,
          requestId
        )

        // Collect guids from processed items
        const newGuids = newItems
          .map((item) => item.guid || item.link || '')
          .filter((guid) => guid.length > 0)

        await updateWebhookConfig(webhookId, config, now.toISOString(), newGuids)

        if (itemFailedCount > 0 && processedCount === 0) {
          await markWebhookFailed(webhookId)
          failureCount++
          logger.warn(
            `[${requestId}] All ${itemFailedCount} items failed to process for webhook ${webhookId}`
          )
        } else {
          await markWebhookSuccess(webhookId)
          successCount++
          logger.info(
            `[${requestId}] Successfully processed ${processedCount} items for webhook ${webhookId}${itemFailedCount > 0 ? ` (${itemFailedCount} failed)` : ''}`
          )
        }
      } catch (error) {
        logger.error(`[${requestId}] Error processing RSS webhook ${webhookId}:`, error)
        await markWebhookFailed(webhookId)
        failureCount++
      }
    }

    for (const webhookData of activeWebhooks) {
      const promise = enqueue(webhookData)
        .then(() => {})
        .catch((err) => {
          logger.error('Unexpected error in webhook processing:', err)
          failureCount++
        })

      running.push(promise)

      if (running.length >= CONCURRENCY) {
        const completedIdx = await Promise.race(running.map((p, i) => p.then(() => i)))
        running.splice(completedIdx, 1)
      }
    }

    await Promise.allSettled(running)

    const summary = {
      total: activeWebhooks.length,
      successful: successCount,
      failed: failureCount,
      details: [],
    }

    logger.info('RSS polling completed', {
      total: summary.total,
      successful: summary.successful,
      failed: summary.failed,
    })

    return summary
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Error in RSS polling service:', errorMessage)
    throw error
  }
}

async function fetchNewRssItems(
  config: RssWebhookConfig,
  requestId: string
): Promise<{ feed: RssFeed; items: RssItem[] }> {
  try {
    logger.debug(`[${requestId}] Fetching RSS feed: ${config.feedUrl}`)

    // Parse the RSS feed
    const feed = await parser.parseURL(config.feedUrl)

    if (!feed.items || !feed.items.length) {
      logger.debug(`[${requestId}] No items in feed`)
      return { feed: feed as RssFeed, items: [] }
    }

    // Filter new items based on timestamp and guids
    const lastCheckedTime = config.lastCheckedTimestamp
      ? new Date(config.lastCheckedTimestamp)
      : null
    const lastSeenGuids = new Set(config.lastSeenGuids || [])

    const newItems = feed.items.filter((item) => {
      const itemGuid = item.guid || item.link || ''

      // Check if we've already seen this item by guid
      if (itemGuid && lastSeenGuids.has(itemGuid)) {
        return false
      }

      // Check if the item is newer than our last check
      if (lastCheckedTime && item.isoDate) {
        const itemDate = new Date(item.isoDate)
        if (itemDate <= lastCheckedTime) {
          return false
        }
      }

      return true
    })

    // Sort by date, newest first
    newItems.sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0
      return dateB - dateA
    })

    // Limit to 25 items per poll to prevent overwhelming the system
    const limitedItems = newItems.slice(0, 25)

    logger.info(
      `[${requestId}] Found ${newItems.length} new items (processing ${limitedItems.length})`
    )

    return { feed: feed as RssFeed, items: limitedItems as RssItem[] }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`[${requestId}] Error fetching RSS feed:`, errorMessage)
    throw error
  }
}

async function processRssItems(
  items: RssItem[],
  feed: RssFeed,
  webhookData: any,
  requestId: string
): Promise<{ processedCount: number; failedCount: number }> {
  let processedCount = 0
  let failedCount = 0

  for (const item of items) {
    try {
      const itemGuid = item.guid || item.link || `${item.title}-${item.pubDate}`

      await pollingIdempotency.executeWithIdempotency(
        'rss',
        `${webhookData.id}:${itemGuid}`,
        async () => {
          const payload: RssWebhookPayload = {
            item: {
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              guid: item.guid,
              description: item.description,
              content: item.content,
              contentSnippet: item.contentSnippet,
              author: item.author || item.creator,
              categories: item.categories,
              enclosure: item.enclosure,
              isoDate: item.isoDate,
            },
            feed: {
              title: feed.title,
              link: feed.link,
              description: feed.description,
            },
            timestamp: new Date().toISOString(),
          }

          const webhookUrl = `${getBaseUrl()}/api/webhooks/trigger/${webhookData.path}`

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': webhookData.secret || '',
              'User-Agent': 'SimStudio/1.0',
            },
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            const errorText = await response.text()
            logger.error(
              `[${requestId}] Failed to trigger webhook for item ${itemGuid}:`,
              response.status,
              errorText
            )
            throw new Error(`Webhook request failed: ${response.status} - ${errorText}`)
          }

          return {
            itemGuid,
            webhookStatus: response.status,
            processed: true,
          }
        }
      )

      logger.info(
        `[${requestId}] Successfully processed item ${item.title || itemGuid} for webhook ${webhookData.id}`
      )
      processedCount++
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error(`[${requestId}] Error processing item:`, errorMessage)
      failedCount++
    }
  }

  return { processedCount, failedCount }
}

async function updateWebhookConfig(
  webhookId: string,
  _config: RssWebhookConfig,
  timestamp: string,
  newGuids: string[]
) {
  try {
    const result = await db.select().from(webhook).where(eq(webhook.id, webhookId))
    const existingConfig = (result[0]?.providerConfig as Record<string, any>) || {}

    // Merge new guids with existing ones, keeping only the most recent
    const existingGuids = existingConfig.lastSeenGuids || []
    const allGuids = [...newGuids, ...existingGuids].slice(0, MAX_GUIDS_TO_TRACK)

    await db
      .update(webhook)
      .set({
        providerConfig: {
          ...existingConfig,
          lastCheckedTimestamp: timestamp,
          lastSeenGuids: allGuids,
        } as any,
        updatedAt: new Date(),
      })
      .where(eq(webhook.id, webhookId))
  } catch (err) {
    logger.error(`Failed to update webhook ${webhookId} config:`, err)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: test-tokens.ts]---
Location: sim-main/apps/sim/lib/webhooks/test-tokens.ts

```typescript
import { jwtVerify, SignJWT } from 'jose'
import { env } from '@/lib/core/config/env'

type TestTokenPayload = {
  typ: 'webhook_test'
  wid: string
}

const getSecretKey = () => new TextEncoder().encode(env.INTERNAL_API_SECRET)

export async function signTestWebhookToken(webhookId: string, ttlSeconds: number): Promise<string> {
  const secret = getSecretKey()
  const payload: TestTokenPayload = { typ: 'webhook_test', wid: webhookId }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .setIssuer('sim-webhooks')
    .setAudience('sim-test')
    .sign(secret)

  return token
}

export async function verifyTestWebhookToken(
  token: string,
  expectedWebhookId: string
): Promise<boolean> {
  try {
    const secret = getSecretKey()
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'sim-webhooks',
      audience: 'sim-test',
    })

    if (
      payload &&
      (payload as any).typ === 'webhook_test' &&
      (payload as any).wid === expectedWebhookId
    ) {
      return true
    }
    return false
  } catch (_e) {
    return false
  }
}
```

--------------------------------------------------------------------------------

````
