---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 793
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 793 of 933)

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

---[FILE: ticket_deleted.ts]---
Location: sim-main/apps/sim/triggers/hubspot/ticket_deleted.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildTicketDeletedOutputs,
  hubspotSetupInstructions,
  hubspotTicketTriggerOptions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotTicketDeletedTrigger: TriggerConfig = {
  id: 'hubspot_ticket_deleted',
  name: 'HubSpot Ticket Deleted',
  provider: 'hubspot',
  description: 'Trigger workflow when a ticket is deleted in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotTicketTriggerOptions,
      value: () => 'hubspot_ticket_deleted',
      required: true,
    },
    {
      id: 'clientId',
      title: 'Client ID',
      type: 'short-input',
      placeholder: 'Enter your HubSpot app Client ID',
      description: 'Found in your HubSpot app settings under Auth tab',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'clientSecret',
      title: 'Client Secret',
      type: 'short-input',
      placeholder: 'Enter your HubSpot app Client Secret',
      description: 'Found in your HubSpot app settings under Auth tab',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'appId',
      title: 'App ID',
      type: 'short-input',
      placeholder: 'Enter your HubSpot App ID',
      description: 'Found in your HubSpot app settings. Used to identify your app.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'developerApiKey',
      title: 'Developer API Key',
      type: 'short-input',
      placeholder: 'Enter your HubSpot Developer API Key',
      description: 'Used for making API calls to HubSpot. Found in your HubSpot app settings.',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      description: 'Copy this URL and paste it into your HubSpot app webhook subscription settings',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'ticket.deletion',
        'The webhook will trigger whenever a ticket is deleted from your HubSpot account.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'curlSetWebhookUrl',
      title: '1. Set Webhook Target URL',
      type: 'code',
      language: 'javascript',
      value: (params: Record<string, any>) => {
        const webhookUrl = params.webhookUrlDisplay || '{YOUR_WEBHOOK_URL_FROM_ABOVE}'
        return `curl -X PUT "https://api.hubapi.com/webhooks/v3/{YOUR_APP_ID}/settings?hapikey={YOUR_DEVELOPER_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetUrl": "${webhookUrl}",
    "throttling": {
      "maxConcurrentRequests": 10
    }
  }'`
      },
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to set your webhook URL in HubSpot',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'curlCreateSubscription',
      title: '2. Create Webhook Subscription',
      type: 'code',
      language: 'javascript',
      defaultValue: `curl -X POST "https://api.hubapi.com/webhooks/v3/{YOUR_APP_ID}/subscriptions?hapikey={YOUR_DEVELOPER_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "ticket.deletion",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to ticket deletion events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_ticket_deleted',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
    {
      id: 'samplePayload',
      title: 'Event Payload Example',
      type: 'code',
      language: 'json',
      defaultValue: JSON.stringify(
        [
          {
            eventId: 3181526831,
            subscriptionId: 4629991,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'ticket.deletion',
            attemptNumber: 0,
            objectId: 316126906070,
            changeFlag: 'DELETED',
            changeSource: 'CRM_UI',
            sourceId: 'userId:84916424',
          },
        ],
        null,
        2
      ),
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_deleted',
      },
    },
  ],

  outputs: buildTicketDeletedOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-HubSpot-Signature': 'sha256=...',
      'X-HubSpot-Request-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'User-Agent': 'HubSpot Webhooks',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ticket_property_changed.ts]---
Location: sim-main/apps/sim/triggers/hubspot/ticket_property_changed.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildTicketPropertyChangedOutputs,
  hubspotSetupInstructions,
  hubspotTicketTriggerOptions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotTicketPropertyChangedTrigger: TriggerConfig = {
  id: 'hubspot_ticket_property_changed',
  name: 'HubSpot Ticket Property Changed',
  provider: 'hubspot',
  description: 'Trigger workflow when any property of a ticket is updated in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotTicketTriggerOptions,
      value: () => 'hubspot_ticket_property_changed',
      required: true,
    },
    {
      id: 'clientId',
      title: 'Client ID',
      type: 'short-input',
      placeholder: 'Enter your HubSpot app Client ID',
      description: 'Found in your HubSpot app settings under Auth tab',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'clientSecret',
      title: 'Client Secret',
      type: 'short-input',
      placeholder: 'Enter your HubSpot app Client Secret',
      description: 'Found in your HubSpot app settings under Auth tab',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'appId',
      title: 'App ID',
      type: 'short-input',
      placeholder: 'Enter your HubSpot App ID',
      description: 'Found in your HubSpot app settings. Used to identify your app.',
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'developerApiKey',
      title: 'Developer API Key',
      type: 'short-input',
      placeholder: 'Enter your HubSpot Developer API Key',
      description: 'Used for making API calls to HubSpot. Found in your HubSpot app settings.',
      password: true,
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      description: 'Copy this URL and paste it into your HubSpot app webhook subscription settings',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'propertyName',
      title: 'Property Name (Optional)',
      type: 'short-input',
      placeholder: 'e.g., hs_pipeline_stage, hs_ticket_priority',
      description:
        'Optional: Filter to only trigger when a specific property changes. Leave empty to trigger on any property change.',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'ticket.propertyChange',
        'The webhook will trigger whenever any property of a ticket is updated. You can optionally filter by a specific property name to only receive events for that property. The webhook provides both the property name and new value in the payload.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'curlSetWebhookUrl',
      title: '1. Set Webhook Target URL',
      type: 'code',
      language: 'javascript',
      value: (params: Record<string, any>) => {
        const webhookUrl = params.webhookUrlDisplay || '{YOUR_WEBHOOK_URL_FROM_ABOVE}'
        return `curl -X PUT "https://api.hubapi.com/webhooks/v3/{YOUR_APP_ID}/settings?hapikey={YOUR_DEVELOPER_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetUrl": "${webhookUrl}",
    "throttling": {
      "maxConcurrentRequests": 10
    }
  }'`
      },
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to set your webhook URL in HubSpot',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'curlCreateSubscription',
      title: '2. Create Webhook Subscription',
      type: 'code',
      language: 'javascript',
      defaultValue: `curl -X POST "https://api.hubapi.com/webhooks/v3/{YOUR_APP_ID}/subscriptions?hapikey={YOUR_DEVELOPER_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "eventType": "ticket.propertyChange",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to ticket property change events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_ticket_property_changed',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
    {
      id: 'samplePayload',
      title: 'Event Payload Example',
      type: 'code',
      language: 'json',
      defaultValue: JSON.stringify(
        [
          {
            eventId: 3181526832,
            subscriptionId: 4629992,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'ticket.propertyChange',
            attemptNumber: 0,
            objectId: 316126906070,
            propertyName: 'hs_pipeline_stage',
            propertyValue: 'closed',
            changeFlag: 'UPDATED',
            changeSource: 'CRM_UI',
            sourceId: 'userId:84916424',
          },
        ],
        null,
        2
      ),
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_property_changed',
      },
    },
  ],

  outputs: buildTicketPropertyChangedOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-HubSpot-Signature': 'sha256=...',
      'X-HubSpot-Request-Id': 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'User-Agent': 'HubSpot Webhooks',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/triggers/hubspot/utils.ts

```typescript
import type { TriggerOutput } from '@/triggers/types'

/**
 * Combined trigger dropdown options for all HubSpot triggers (for block config)
 */
export const hubspotAllTriggerOptions = [
  { label: 'Contact Created', id: 'hubspot_contact_created' },
  { label: 'Contact Deleted', id: 'hubspot_contact_deleted' },
  { label: 'Contact Privacy Deleted', id: 'hubspot_contact_privacy_deleted' },
  { label: 'Contact Property Changed', id: 'hubspot_contact_property_changed' },
  { label: 'Company Created', id: 'hubspot_company_created' },
  { label: 'Company Deleted', id: 'hubspot_company_deleted' },
  { label: 'Company Property Changed', id: 'hubspot_company_property_changed' },
  { label: 'Conversation Creation', id: 'hubspot_conversation_creation' },
  { label: 'Conversation Deletion', id: 'hubspot_conversation_deletion' },
  { label: 'Conversation New Message', id: 'hubspot_conversation_new_message' },
  { label: 'Conversation Privacy Deletion', id: 'hubspot_conversation_privacy_deletion' },
  { label: 'Conversation Property Changed', id: 'hubspot_conversation_property_changed' },
  { label: 'Deal Created', id: 'hubspot_deal_created' },
  { label: 'Deal Deleted', id: 'hubspot_deal_deleted' },
  { label: 'Deal Property Changed', id: 'hubspot_deal_property_changed' },
  { label: 'Ticket Created', id: 'hubspot_ticket_created' },
  { label: 'Ticket Deleted', id: 'hubspot_ticket_deleted' },
  { label: 'Ticket Property Changed', id: 'hubspot_ticket_property_changed' },
]

/**
 * Shared trigger dropdown options for all HubSpot contact triggers
 */
export const hubspotContactTriggerOptions = [
  { label: 'Contact Created', id: 'hubspot_contact_created' },
  { label: 'Contact Deleted', id: 'hubspot_contact_deleted' },
  { label: 'Contact Privacy Deleted', id: 'hubspot_contact_privacy_deleted' },
  { label: 'Contact Property Changed', id: 'hubspot_contact_property_changed' },
]

/**
 * Shared trigger dropdown options for all HubSpot company triggers
 */
export const hubspotCompanyTriggerOptions = [
  { label: 'Company Created', id: 'hubspot_company_created' },
  { label: 'Company Deleted', id: 'hubspot_company_deleted' },
  { label: 'Company Property Changed', id: 'hubspot_company_property_changed' },
]

/**
 * Shared trigger dropdown options for all HubSpot conversation triggers
 */
export const hubspotConversationTriggerOptions = [
  { label: 'Conversation Creation', id: 'hubspot_conversation_creation' },
  { label: 'Conversation Deletion', id: 'hubspot_conversation_deletion' },
  { label: 'Conversation New Message', id: 'hubspot_conversation_new_message' },
  { label: 'Conversation Privacy Deletion', id: 'hubspot_conversation_privacy_deletion' },
  { label: 'Conversation Property Changed', id: 'hubspot_conversation_property_changed' },
]

/**
 * Shared trigger dropdown options for all HubSpot deal triggers
 */
export const hubspotDealTriggerOptions = [
  { label: 'Deal Created', id: 'hubspot_deal_created' },
  { label: 'Deal Deleted', id: 'hubspot_deal_deleted' },
  { label: 'Deal Property Changed', id: 'hubspot_deal_property_changed' },
]

/**
 * Shared trigger dropdown options for all HubSpot ticket triggers
 */
export const hubspotTicketTriggerOptions = [
  { label: 'Ticket Created', id: 'hubspot_ticket_created' },
  { label: 'Ticket Deleted', id: 'hubspot_ticket_deleted' },
  { label: 'Ticket Property Changed', id: 'hubspot_ticket_property_changed' },
]

/**
 * Generate setup instructions for a specific HubSpot event type
 */
export function hubspotSetupInstructions(eventType: string, additionalNotes?: string): string {
  const instructions = [
    '<strong>Step 1: Create a HubSpot Developer Account</strong><br/>Sign up for a free developer account at <a href="https://developers.hubspot.com" target="_blank">developers.hubspot.com</a> if you don\'t have one.',
    '<strong>Step 2: Create a Public App via CLI</strong><br/><strong>Note:</strong> HubSpot has deprecated the web UI for creating apps. You must use the HubSpot CLI to create and manage apps. Install the CLI with <code>npm install -g @hubspot/cli</code> and run <code>hs project create</code> to create a new app. See <a href="https://developers.hubspot.com/docs/platform/create-an-app" target="_blank">HubSpot\'s documentation</a> for details.',
    '<strong>Step 3: Configure OAuth Settings</strong><br/>After creating your app via CLI, configure it to add the OAuth Redirect URL: <code>https://www.sim.ai/api/auth/oauth2/callback/hubspot</code>. Then retrieve your <strong>Client ID</strong> and <strong>Client Secret</strong> from your app configuration and enter them in the fields above.',
    "<strong>Step 4: Get App ID and Developer API Key</strong><br/>In your HubSpot developer account, find your <strong>App ID</strong> (shown below your app name) and your <strong>Developer API Key</strong> (in app settings). You'll need both for the next steps.",
    '<strong>Step 5: Set Required Scopes</strong><br/>Configure your app to include the required OAuth scope: <code>crm.objects.contacts.read</code>',
    '<strong>Step 6: Save Configuration in Sim</strong><br/>Click the <strong>"Save Configuration"</strong> button below. This will generate your unique webhook URL.',
    '<strong>Step 7: Configure Webhook in HubSpot via API</strong><br/>After saving above, copy the <strong>Webhook URL</strong> and run the two curl commands below (replace <code>{YOUR_APP_ID}</code>, <code>{YOUR_DEVELOPER_API_KEY}</code>, and <code>{YOUR_WEBHOOK_URL_FROM_ABOVE}</code> with your actual values).',
    "<strong>Step 8: Test Your Webhook</strong><br/>Create or modify a contact in HubSpot to trigger the webhook. Check your workflow execution logs in Sim to verify it's working.",
  ]

  if (additionalNotes) {
    instructions.push(`<strong>Additional Info:</strong> ${additionalNotes}`)
  }

  return instructions.map((instruction, index) => `<div class="mb-3">${instruction}</div>`).join('')
}

/**
 * Base webhook outputs that are common to all HubSpot triggers
 * Clean structure with payload, provider, and providerConfig at root level
 */
function buildBaseHubSpotOutputs(): Record<string, TriggerOutput> {
  return {
    payload: {
      type: 'json',
      description: 'Full webhook payload array from HubSpot containing event details',
    },
    provider: {
      type: 'string',
      description: 'Provider name (hubspot)',
    },
    providerConfig: {
      appId: {
        type: 'string',
        description: 'HubSpot App ID',
      },
      clientId: {
        type: 'string',
        description: 'HubSpot Client ID',
      },
      triggerId: {
        type: 'string',
        description: 'Trigger ID (e.g., hubspot_company_created)',
      },
      clientSecret: {
        type: 'string',
        description: 'HubSpot Client Secret',
      },
      developerApiKey: {
        type: 'string',
        description: 'HubSpot Developer API Key',
      },
      curlSetWebhookUrl: {
        type: 'string',
        description: 'curl command to set webhook URL',
      },
      curlCreateSubscription: {
        type: 'string',
        description: 'curl command to create subscription',
      },
      webhookUrlDisplay: {
        type: 'string',
        description: 'Webhook URL display value',
      },
      propertyName: {
        type: 'string',
        description: 'Optional property name filter (for property change triggers)',
      },
    },
  } as any
}

/**
 * Build output schema for contact creation events
 */
export function buildContactCreatedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for contact deletion events
 */
export function buildContactDeletedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for contact privacy deletion events
 */
export function buildContactPrivacyDeletedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for contact property change events
 */
export function buildContactPropertyChangedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for company creation events
 */
export function buildCompanyCreatedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for company deletion events
 */
export function buildCompanyDeletedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for company property change events
 */
export function buildCompanyPropertyChangedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for conversation creation events
 */
export function buildConversationCreationOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for conversation deletion events
 */
export function buildConversationDeletionOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for conversation new message events
 */
export function buildConversationNewMessageOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for conversation privacy deletion events
 */
export function buildConversationPrivacyDeletionOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for conversation property change events
 */
export function buildConversationPropertyChangedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for deal creation events
 */
export function buildDealCreatedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for deal deletion events
 */
export function buildDealDeletedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for deal property change events
 */
export function buildDealPropertyChangedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for ticket creation events
 */
export function buildTicketCreatedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for ticket deletion events
 */
export function buildTicketDeletedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Build output schema for ticket property change events
 */
export function buildTicketPropertyChangedOutputs(): Record<string, TriggerOutput> {
  return buildBaseHubSpotOutputs()
}

/**
 * Check if a HubSpot event matches the expected trigger configuration
 */
export function isHubSpotContactEventMatch(triggerId: string, eventType: string): boolean {
  const eventMap: Record<string, string> = {
    hubspot_contact_created: 'contact.creation',
    hubspot_contact_deleted: 'contact.deletion',
    hubspot_contact_privacy_deleted: 'contact.privacyDeletion',
    hubspot_contact_property_changed: 'contact.propertyChange',
    hubspot_company_created: 'company.creation',
    hubspot_company_deleted: 'company.deletion',
    hubspot_company_property_changed: 'company.propertyChange',
    hubspot_conversation_creation: 'conversation.creation',
    hubspot_conversation_deletion: 'conversation.deletion',
    hubspot_conversation_new_message: 'conversation.newMessage',
    hubspot_conversation_privacy_deletion: 'conversation.privacyDeletion',
    hubspot_conversation_property_changed: 'conversation.propertyChange',
    hubspot_deal_created: 'deal.creation',
    hubspot_deal_deleted: 'deal.deletion',
    hubspot_deal_property_changed: 'deal.propertyChange',
    hubspot_ticket_created: 'ticket.creation',
    hubspot_ticket_deleted: 'ticket.deletion',
    hubspot_ticket_property_changed: 'ticket.propertyChange',
  }

  const expectedEventType = eventMap[triggerId]
  if (!expectedEventType) {
    return true // Unknown trigger, allow through
  }

  return expectedEventType === eventType
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/jira/index.ts

```typescript
/**
 * Jira Triggers
 * Export all Jira webhook triggers
 */

export { jiraIssueCommentedTrigger } from './issue_commented'
export { jiraIssueCreatedTrigger } from './issue_created'
export { jiraIssueDeletedTrigger } from './issue_deleted'
export { jiraIssueUpdatedTrigger } from './issue_updated'
export { jiraWebhookTrigger } from './webhook'
export { jiraWorklogCreatedTrigger } from './worklog_created'
```

--------------------------------------------------------------------------------

---[FILE: issue_commented.ts]---
Location: sim-main/apps/sim/triggers/jira/issue_commented.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildCommentOutputs, jiraSetupInstructions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Jira Issue Commented Trigger
 * Triggers when a comment is added to an issue
 */
export const jiraIssueCommentedTrigger: TriggerConfig = {
  id: 'jira_issue_commented',
  name: 'Jira Issue Commented',
  provider: 'jira',
  description: 'Trigger workflow when a comment is added to a Jira issue',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_commented',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_commented',
      },
    },
    {
      id: 'jqlFilter',
      title: 'JQL Filter',
      type: 'long-input',
      placeholder: 'project = PROJ AND issuetype = Bug',
      description: 'Filter which issue comments trigger this workflow using JQL',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_commented',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('comment_created'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_commented',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_issue_commented',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_commented',
      },
    },
  ],

  outputs: buildCommentOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: issue_created.ts]---
Location: sim-main/apps/sim/triggers/jira/issue_created.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildIssueOutputs, jiraSetupInstructions, jiraTriggerOptions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Jira Issue Created Trigger
 * Triggers when a new issue is created in Jira
 */
export const jiraIssueCreatedTrigger: TriggerConfig = {
  id: 'jira_issue_created',
  name: 'Jira Issue Created',
  provider: 'jira',
  description: 'Trigger workflow when a new issue is created in Jira',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: jiraTriggerOptions,
      value: () => 'jira_issue_created',
      required: true,
    },
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_created',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_created',
      },
    },
    {
      id: 'jqlFilter',
      title: 'JQL Filter',
      type: 'long-input',
      placeholder: 'project = PROJ AND issuetype = Bug',
      description: 'Filter which issues trigger this workflow using JQL (Jira Query Language)',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('jira:issue_created'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_issue_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_created',
      },
    },
  ],

  outputs: buildIssueOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: issue_deleted.ts]---
Location: sim-main/apps/sim/triggers/jira/issue_deleted.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildIssueOutputs, jiraSetupInstructions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Jira Issue Deleted Trigger
 * Triggers when an issue is deleted in Jira
 */
export const jiraIssueDeletedTrigger: TriggerConfig = {
  id: 'jira_issue_deleted',
  name: 'Jira Issue Deleted',
  provider: 'jira',
  description: 'Trigger workflow when an issue is deleted in Jira',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_deleted',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_deleted',
      },
    },
    {
      id: 'jqlFilter',
      title: 'JQL Filter',
      type: 'long-input',
      placeholder: 'project = PROJ',
      description: 'Filter which issue deletions trigger this workflow using JQL',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_deleted',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('jira:issue_deleted'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_deleted',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_issue_deleted',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_deleted',
      },
    },
  ],

  outputs: buildIssueOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: issue_updated.ts]---
Location: sim-main/apps/sim/triggers/jira/issue_updated.ts

```typescript
import { JiraIcon } from '@/components/icons'
import { buildIssueUpdatedOutputs, jiraSetupInstructions } from '@/triggers/jira/utils'
import type { TriggerConfig } from '@/triggers/types'

/**
 * Jira Issue Updated Trigger
 * Triggers when an existing issue is updated in Jira
 */
export const jiraIssueUpdatedTrigger: TriggerConfig = {
  id: 'jira_issue_updated',
  name: 'Jira Issue Updated',
  provider: 'jira',
  description: 'Trigger workflow when an issue is updated in Jira',
  version: '1.0.0',
  icon: JiraIcon,

  subBlocks: [
    {
      id: 'webhookUrlDisplay',
      title: 'Webhook URL',
      type: 'short-input',
      readOnly: true,
      showCopyButton: true,
      useWebhookUrl: true,
      placeholder: 'Webhook URL will be generated',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
    {
      id: 'webhookSecret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a strong secret',
      description: 'Optional secret to validate webhook deliveries from Jira using HMAC signature',
      password: true,
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
    {
      id: 'jqlFilter',
      title: 'JQL Filter',
      type: 'long-input',
      placeholder: 'project = PROJ AND status changed to "In Progress"',
      description: 'Filter which issue updates trigger this workflow using JQL',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
    {
      id: 'fieldFilters',
      title: 'Field Filters',
      type: 'long-input',
      placeholder: 'status, assignee, priority',
      description:
        'Comma-separated list of fields to monitor. Only trigger when these fields change.',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: jiraSetupInstructions('jira:issue_updated'),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'jira_issue_updated',
      condition: {
        field: 'selectedTriggerId',
        value: 'jira_issue_updated',
      },
    },
  ],

  outputs: buildIssueUpdatedOutputs(),

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature': 'sha256=...',
      'X-Atlassian-Webhook-Identifier': 'unique-webhook-id',
    },
  },
}
```

--------------------------------------------------------------------------------

````
