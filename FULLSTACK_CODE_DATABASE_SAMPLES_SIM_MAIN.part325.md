---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 325
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 325 of 933)

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

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/poll/rss/route.ts
Signals: Next.js

```typescript
import { nanoid } from 'nanoid'
import { type NextRequest, NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/auth/internal'
import { acquireLock, releaseLock } from '@/lib/core/config/redis'
import { createLogger } from '@/lib/logs/console/logger'
import { pollRssWebhooks } from '@/lib/webhooks/rss-polling-service'

const logger = createLogger('RssPollingAPI')

export const dynamic = 'force-dynamic'
export const maxDuration = 180 // Allow up to 3 minutes for polling to complete

const LOCK_KEY = 'rss-polling-lock'
const LOCK_TTL_SECONDS = 180 // Same as maxDuration (3 min)

export async function GET(request: NextRequest) {
  const requestId = nanoid()
  logger.info(`RSS webhook polling triggered (${requestId})`)

  let lockValue: string | undefined

  try {
    const authError = verifyCronAuth(request, 'RSS webhook polling')
    if (authError) {
      return authError
    }

    lockValue = requestId
    const locked = await acquireLock(LOCK_KEY, lockValue, LOCK_TTL_SECONDS)

    if (!locked) {
      return NextResponse.json(
        {
          success: true,
          message: 'Polling already in progress – skipped',
          requestId,
          status: 'skip',
        },
        { status: 202 }
      )
    }

    const results = await pollRssWebhooks()

    return NextResponse.json({
      success: true,
      message: 'RSS polling completed',
      requestId,
      status: 'completed',
      ...results,
    })
  } catch (error) {
    logger.error(`Error during RSS polling (${requestId}):`, error)
    return NextResponse.json(
      {
        success: false,
        message: 'RSS polling failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    )
  } finally {
    if (lockValue) {
      await releaseLock(LOCK_KEY, lockValue).catch(() => {})
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/test/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { webhook } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('WebhookTestAPI')

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const { searchParams } = new URL(request.url)
    const webhookId = searchParams.get('id')

    if (!webhookId) {
      logger.warn(`[${requestId}] Missing webhook ID in test request`)
      return NextResponse.json({ success: false, error: 'Webhook ID is required' }, { status: 400 })
    }

    logger.debug(`[${requestId}] Testing webhook with ID: ${webhookId}`)

    const webhooks = await db.select().from(webhook).where(eq(webhook.id, webhookId)).limit(1)

    if (webhooks.length === 0) {
      logger.warn(`[${requestId}] Webhook not found: ${webhookId}`)
      return NextResponse.json({ success: false, error: 'Webhook not found' }, { status: 404 })
    }

    const foundWebhook = webhooks[0]
    const provider = foundWebhook.provider || 'generic'
    const providerConfig = (foundWebhook.providerConfig as Record<string, any>) || {}

    const webhookUrl = `${getBaseUrl()}/api/webhooks/trigger/${foundWebhook.path}`

    logger.info(`[${requestId}] Testing webhook for provider: ${provider}`, {
      webhookId,
      path: foundWebhook.path,
      isActive: foundWebhook.isActive,
    })

    switch (provider) {
      case 'whatsapp': {
        const verificationToken = providerConfig.verificationToken

        if (!verificationToken) {
          logger.warn(`[${requestId}] WhatsApp webhook missing verification token: ${webhookId}`)
          return NextResponse.json(
            { success: false, error: 'Webhook has no verification token' },
            { status: 400 }
          )
        }

        const challenge = `test_${Date.now()}`

        const whatsappUrl = `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verificationToken}&hub.challenge=${challenge}`

        logger.debug(`[${requestId}] Testing WhatsApp webhook verification`, {
          webhookId,
          challenge,
        })

        const response = await fetch(whatsappUrl, {
          headers: {
            'User-Agent': 'facebookplatform/1.0',
          },
        })

        const status = response.status
        const contentType = response.headers.get('content-type')
        const responseText = await response.text()

        const success = status === 200 && responseText === challenge

        if (success) {
          logger.info(`[${requestId}] WhatsApp webhook verification successful: ${webhookId}`)
        } else {
          logger.warn(`[${requestId}] WhatsApp webhook verification failed: ${webhookId}`, {
            status,
            contentType,
            responseTextLength: responseText.length,
          })
        }

        return NextResponse.json({
          success,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            verificationToken,
            isActive: foundWebhook.isActive,
          },
          test: {
            status,
            contentType,
            responseText,
            expectedStatus: 200,
            expectedContentType: 'text/plain',
            expectedResponse: challenge,
          },
          message: success
            ? 'Webhook configuration is valid. You can now use this URL in WhatsApp.'
            : 'Webhook verification failed. Please check your configuration.',
          diagnostics: {
            statusMatch: status === 200 ? '✅ Status code is 200' : '❌ Status code should be 200',
            contentTypeMatch:
              contentType === 'text/plain'
                ? '✅ Content-Type is text/plain'
                : '❌ Content-Type should be text/plain',
            bodyMatch:
              responseText === challenge
                ? '✅ Response body matches challenge'
                : '❌ Response body should exactly match the challenge string',
          },
        })
      }

      case 'telegram': {
        const botToken = providerConfig.botToken

        if (!botToken) {
          logger.warn(`[${requestId}] Telegram webhook missing configuration: ${webhookId}`)
          return NextResponse.json(
            { success: false, error: 'Webhook has incomplete configuration' },
            { status: 400 }
          )
        }

        const testMessage = {
          update_id: 12345,
          message: {
            message_id: 67890,
            from: {
              id: 123456789,
              first_name: 'Test',
              username: 'testbot',
            },
            chat: {
              id: 123456789,
              first_name: 'Test',
              username: 'testbot',
              type: 'private',
            },
            date: Math.floor(Date.now() / 1000),
            text: 'This is a test message',
          },
        }

        logger.debug(`[${requestId}] Testing Telegram webhook connection`, {
          webhookId,
          url: webhookUrl,
        })

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'TelegramBot/1.0',
          },
          body: JSON.stringify(testMessage),
        })

        const status = response.status
        let responseText = ''
        try {
          responseText = await response.text()
        } catch (_e) {}

        const success = status >= 200 && status < 300

        if (success) {
          logger.info(`[${requestId}] Telegram webhook test successful: ${webhookId}`)
        } else {
          logger.warn(`[${requestId}] Telegram webhook test failed: ${webhookId}`, {
            status,
            responseText,
          })
        }

        let webhookInfo = null
        try {
          const webhookInfoUrl = `https://api.telegram.org/bot${botToken}/getWebhookInfo`
          const infoResponse = await fetch(webhookInfoUrl, {
            headers: {
              'User-Agent': 'TelegramBot/1.0',
            },
          })
          if (infoResponse.ok) {
            const infoJson = await infoResponse.json()
            if (infoJson.ok) {
              webhookInfo = infoJson.result
            }
          }
        } catch (e) {
          logger.warn(`[${requestId}] Failed to get Telegram webhook info`, e)
        }

        const curlCommand = [
          `curl -X POST "${webhookUrl}"`,
          `-H "Content-Type: application/json"`,
          `-H "User-Agent: TelegramBot/1.0"`,
          `-d '${JSON.stringify(testMessage, null, 2)}'`,
        ].join(' \\\n')

        return NextResponse.json({
          success,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            botToken: `${botToken.substring(0, 5)}...${botToken.substring(botToken.length - 5)}`, // Show partial token for security
            isActive: foundWebhook.isActive,
          },
          test: {
            status,
            responseText,
            webhookInfo,
          },
          message: success
            ? 'Telegram webhook appears to be working. Any message sent to your bot will trigger the workflow.'
            : 'Telegram webhook test failed. Please check server logs for more details.',
          curlCommand,
          info: 'To fix issues with Telegram webhooks getting 403 Forbidden responses, ensure the webhook request includes a User-Agent header.',
        })
      }

      case 'github': {
        const contentType = providerConfig.contentType || 'application/json'

        logger.info(`[${requestId}] GitHub webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            contentType,
            isActive: foundWebhook.isActive,
          },
          message:
            'GitHub webhook configuration is valid. Use this URL in your GitHub repository settings.',
          setup: {
            url: webhookUrl,
            contentType,
            events: ['push', 'pull_request', 'issues', 'issue_comment'],
          },
        })
      }

      case 'stripe': {
        logger.info(`[${requestId}] Stripe webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            isActive: foundWebhook.isActive,
          },
          message: 'Stripe webhook configuration is valid. Use this URL in your Stripe dashboard.',
          setup: {
            url: webhookUrl,
            events: [
              'charge.succeeded',
              'invoice.payment_succeeded',
              'customer.subscription.created',
            ],
          },
        })
      }

      case 'generic': {
        const token = providerConfig.token
        const secretHeaderName = providerConfig.secretHeaderName
        const requireAuth = providerConfig.requireAuth
        const allowedIps = providerConfig.allowedIps

        let curlCommand = `curl -X POST "${webhookUrl}" -H "Content-Type: application/json"`

        if (requireAuth && token) {
          if (secretHeaderName) {
            curlCommand += ` -H "${secretHeaderName}: ${token}"`
          } else {
            curlCommand += ` -H "Authorization: Bearer ${token}"`
          }
        }

        curlCommand += ` -d '{"event":"test_event","timestamp":"${new Date().toISOString()}"}'`

        logger.info(`[${requestId}] General webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            isActive: foundWebhook.isActive,
          },
          message:
            'General webhook configuration is valid. Use the URL and authentication details as needed.',
          details: {
            requireAuth: requireAuth || false,
            hasToken: !!token,
            hasCustomHeader: !!secretHeaderName,
            customHeaderName: secretHeaderName,
            hasIpRestrictions: Array.isArray(allowedIps) && allowedIps.length > 0,
          },
          test: {
            curlCommand,
            headers: requireAuth
              ? secretHeaderName
                ? { [secretHeaderName]: token }
                : { Authorization: `Bearer ${token}` }
              : {},
            samplePayload: {
              event: 'test_event',
              timestamp: new Date().toISOString(),
            },
          },
        })
      }

      case 'slack': {
        const signingSecret = providerConfig.signingSecret

        if (!signingSecret) {
          logger.warn(`[${requestId}] Slack webhook missing signing secret: ${webhookId}`)
          return NextResponse.json(
            { success: false, error: 'Webhook has no signing secret configured' },
            { status: 400 }
          )
        }

        logger.info(`[${requestId}] Slack webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            isActive: foundWebhook.isActive,
          },
          message:
            'Slack webhook configuration is valid. Use this URL in your Slack Event Subscriptions settings.',
          setup: {
            url: webhookUrl,
            events: ['message.channels', 'reaction_added', 'app_mention'],
            signingSecretConfigured: true,
          },
          test: {
            curlCommand: [
              `curl -X POST "${webhookUrl}"`,
              `-H "Content-Type: application/json"`,
              `-H "X-Slack-Request-Timestamp: $(date +%s)"`,
              `-H "X-Slack-Signature: v0=$(date +%s)"`,
              `-d '{"type":"event_callback","event":{"type":"message","channel":"C0123456789","user":"U0123456789","text":"Hello from Slack!","ts":"1234567890.123456"},"team_id":"T0123456789"}'`,
            ].join(' \\\n'),
            samplePayload: {
              type: 'event_callback',
              token: 'XXYYZZ',
              team_id: 'T123ABC',
              event: {
                type: 'message',
                user: 'U123ABC',
                text: 'Hello from Slack!',
                ts: '1234567890.1234',
              },
              event_id: 'Ev123ABC',
            },
          },
        })
      }

      case 'airtable': {
        const baseId = providerConfig.baseId
        const tableId = providerConfig.tableId
        const webhookSecret = providerConfig.webhookSecret

        if (!baseId || !tableId) {
          logger.warn(`[${requestId}] Airtable webhook missing Base ID or Table ID: ${webhookId}`)
          return NextResponse.json(
            {
              success: false,
              error: 'Webhook configuration is incomplete (missing Base ID or Table ID)',
            },
            { status: 400 }
          )
        }

        const samplePayload = {
          webhook: {
            id: 'whiYOUR_WEBHOOK_ID',
          },
          base: {
            id: baseId,
          },
          payloadFormat: 'v0',
          actionMetadata: {
            source: 'tableOrViewChange',
            sourceMetadata: {},
          },
          payloads: [
            {
              timestamp: new Date().toISOString(),
              baseTransactionNumber: Date.now(),
              changedTablesById: {
                [tableId]: {
                  changedRecordsById: {
                    recSAMPLEID1: {
                      current: { cellValuesByFieldId: { fldSAMPLEID: 'New Value' } },
                      previous: { cellValuesByFieldId: { fldSAMPLEID: 'Old Value' } },
                    },
                  },
                  changedFieldsById: {},
                  changedViewsById: {},
                },
              },
            },
          ],
        }

        let curlCommand = `curl -X POST "${webhookUrl}" -H "Content-Type: application/json"`
        curlCommand += ` -d '${JSON.stringify(samplePayload, null, 2)}'`

        logger.info(`[${requestId}] Airtable webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            baseId: baseId,
            tableId: tableId,
            secretConfigured: !!webhookSecret,
            isActive: foundWebhook.isActive,
          },
          message:
            'Airtable webhook configuration appears valid. Use the sample curl command to manually send a test payload to your webhook URL.',
          test: {
            curlCommand: curlCommand,
            samplePayload: samplePayload,
          },
        })
      }

      case 'microsoft-teams': {
        const hmacSecret = providerConfig.hmacSecret

        if (!hmacSecret) {
          logger.warn(`[${requestId}] Microsoft Teams webhook missing HMAC secret: ${webhookId}`)
          return NextResponse.json(
            { success: false, error: 'Microsoft Teams webhook requires HMAC secret' },
            { status: 400 }
          )
        }

        logger.info(`[${requestId}] Microsoft Teams webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            isActive: foundWebhook.isActive,
          },
          message: 'Microsoft Teams outgoing webhook configuration is valid.',
          setup: {
            url: webhookUrl,
            hmacSecretConfigured: !!hmacSecret,
            instructions: [
              'Create an outgoing webhook in Microsoft Teams',
              'Set the callback URL to the webhook URL above',
              'Copy the HMAC security token to the configuration',
              'Users can trigger the webhook by @mentioning it in Teams',
            ],
          },
          test: {
            curlCommand: `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: HMAC <signature>" \\
  -d '{"type":"message","text":"Hello from Microsoft Teams!","from":{"id":"test","name":"Test User"}}'`,
            samplePayload: {
              type: 'message',
              id: '1234567890',
              timestamp: new Date().toISOString(),
              text: 'Hello Sim Bot!',
              from: {
                id: '29:1234567890abcdef',
                name: 'Test User',
              },
              conversation: {
                id: '19:meeting_abcdef@thread.v2',
              },
            },
          },
        })
      }

      default: {
        logger.info(`[${requestId}] Generic webhook test successful: ${webhookId}`)
        return NextResponse.json({
          success: true,
          webhook: {
            id: foundWebhook.id,
            url: webhookUrl,
            provider: foundWebhook.provider,
            isActive: foundWebhook.isActive,
          },
          message:
            'Webhook configuration is valid. You can use this URL to receive webhook events.',
        })
      }
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Error testing webhook`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/webhooks/test/[id]/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  checkWebhookPreprocessing,
  findWebhookAndWorkflow,
  handleProviderChallenges,
  parseWebhookBody,
  queueWebhookExecution,
  verifyProviderAuth,
} from '@/lib/webhooks/processor'
import { verifyTestWebhookToken } from '@/lib/webhooks/test-tokens'

const logger = createLogger('WebhookTestReceiverAPI')

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = generateRequestId()
  const webhookId = (await params).id

  logger.info(`[${requestId}] Test webhook request received for webhook ${webhookId}`)

  const parseResult = await parseWebhookBody(request, requestId)
  if (parseResult instanceof NextResponse) {
    return parseResult
  }

  const { body, rawBody } = parseResult

  const challengeResponse = await handleProviderChallenges(body, request, requestId, '')
  if (challengeResponse) {
    return challengeResponse
  }

  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    logger.warn(`[${requestId}] Test webhook request missing token`)
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const isValid = await verifyTestWebhookToken(token, webhookId)
  if (!isValid) {
    logger.warn(`[${requestId}] Invalid test webhook token`)
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const result = await findWebhookAndWorkflow({ requestId, webhookId })
  if (!result) {
    logger.warn(`[${requestId}] No active webhook found for id: ${webhookId}`)
    return new NextResponse('Webhook not found', { status: 404 })
  }

  const { webhook: foundWebhook, workflow: foundWorkflow } = result

  const authError = await verifyProviderAuth(
    foundWebhook,
    foundWorkflow,
    request,
    rawBody,
    requestId
  )
  if (authError) {
    return authError
  }

  let preprocessError: NextResponse | null = null
  try {
    // Test webhooks skip deployment check but still enforce rate limits and usage limits
    // They run on live/draft state to allow testing before deployment
    preprocessError = await checkWebhookPreprocessing(foundWorkflow, foundWebhook, requestId, {
      isTestMode: true,
    })
    if (preprocessError) {
      return preprocessError
    }
  } catch (error) {
    logger.error(`[${requestId}] Unexpected error during webhook preprocessing`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      webhookId: foundWebhook.id,
      workflowId: foundWorkflow.id,
    })

    if (foundWebhook.provider === 'microsoft-teams') {
      return NextResponse.json(
        {
          type: 'message',
          text: 'An unexpected error occurred during preprocessing',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during preprocessing' },
      { status: 500 }
    )
  }

  logger.info(
    `[${requestId}] Executing TEST webhook for ${foundWebhook.provider} (workflow: ${foundWorkflow.id})`
  )

  return queueWebhookExecution(foundWebhook, foundWorkflow, body, request, {
    requestId,
    path: foundWebhook.path,
    testMode: true,
    executionTarget: 'live',
  })
}
```

--------------------------------------------------------------------------------

````
