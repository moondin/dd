---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 792
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 792 of 933)

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

---[FILE: conversation_property_changed.ts]---
Location: sim-main/apps/sim/triggers/hubspot/conversation_property_changed.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildConversationPropertyChangedOutputs,
  hubspotConversationTriggerOptions,
  hubspotSetupInstructions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotConversationPropertyChangedTrigger: TriggerConfig = {
  id: 'hubspot_conversation_property_changed',
  name: 'HubSpot Conversation Property Changed',
  provider: 'hubspot',
  description: 'Trigger workflow when any property of a conversation is updated in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotConversationTriggerOptions,
      value: () => 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
      },
    },
    {
      id: 'propertyName',
      title: 'Property Name (Optional)',
      type: 'short-input',
      placeholder: 'e.g., status, assignedTo',
      description:
        'Optional: Filter to only trigger when a specific property changes. Leave empty to trigger on any property change.',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_conversation_property_changed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'conversation.propertyChange',
        'The webhook will trigger whenever any property of a conversation is updated. You can optionally filter by a specific property name to only receive events for that property. The webhook provides both the property name and new value in the payload.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_conversation_property_changed',
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
        value: 'hubspot_conversation_property_changed',
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
    "eventType": "conversation.propertyChange",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to conversation property change events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_conversation_property_changed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_conversation_property_changed',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_conversation_property_changed',
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
            eventId: 3181526824,
            subscriptionId: 4629984,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'conversation.propertyChange',
            attemptNumber: 0,
            objectId: 316126906055,
            propertyName: 'status',
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
        value: 'hubspot_conversation_property_changed',
      },
    },
  ],

  outputs: buildConversationPropertyChangedOutputs(),

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

---[FILE: deal_created.ts]---
Location: sim-main/apps/sim/triggers/hubspot/deal_created.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildDealCreatedOutputs,
  hubspotDealTriggerOptions,
  hubspotSetupInstructions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotDealCreatedTrigger: TriggerConfig = {
  id: 'hubspot_deal_created',
  name: 'HubSpot Deal Created',
  provider: 'hubspot',
  description: 'Trigger workflow when a new deal is created in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotDealTriggerOptions,
      value: () => 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'deal.creation',
        'The webhook will trigger whenever a new deal is created in your HubSpot account, regardless of the source (manual entry, API, import, etc.).'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_created',
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
        value: 'hubspot_deal_created',
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
    "eventType": "deal.creation",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to deal creation events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_deal_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_created',
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
            eventId: 3181526825,
            subscriptionId: 4629985,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'deal.creation',
            attemptNumber: 0,
            objectId: 316126906060,
            changeFlag: 'CREATED',
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
        value: 'hubspot_deal_created',
      },
    },
  ],

  outputs: buildDealCreatedOutputs(),

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

---[FILE: deal_deleted.ts]---
Location: sim-main/apps/sim/triggers/hubspot/deal_deleted.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildDealDeletedOutputs,
  hubspotDealTriggerOptions,
  hubspotSetupInstructions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotDealDeletedTrigger: TriggerConfig = {
  id: 'hubspot_deal_deleted',
  name: 'HubSpot Deal Deleted',
  provider: 'hubspot',
  description: 'Trigger workflow when a deal is deleted in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotDealTriggerOptions,
      value: () => 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'deal.deletion',
        'The webhook will trigger whenever a deal is deleted from your HubSpot account.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_deleted',
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
        value: 'hubspot_deal_deleted',
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
    "eventType": "deal.deletion",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to deal deletion events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_deleted',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_deal_deleted',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_deleted',
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
            eventId: 3181526826,
            subscriptionId: 4629986,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'deal.deletion',
            attemptNumber: 0,
            objectId: 316126906060,
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
        value: 'hubspot_deal_deleted',
      },
    },
  ],

  outputs: buildDealDeletedOutputs(),

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

---[FILE: deal_property_changed.ts]---
Location: sim-main/apps/sim/triggers/hubspot/deal_property_changed.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildDealPropertyChangedOutputs,
  hubspotDealTriggerOptions,
  hubspotSetupInstructions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotDealPropertyChangedTrigger: TriggerConfig = {
  id: 'hubspot_deal_property_changed',
  name: 'HubSpot Deal Property Changed',
  provider: 'hubspot',
  description: 'Trigger workflow when any property of a deal is updated in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotDealTriggerOptions,
      value: () => 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
      },
    },
    {
      id: 'propertyName',
      title: 'Property Name (Optional)',
      type: 'short-input',
      placeholder: 'e.g., dealstage, amount, closedate',
      description:
        'Optional: Filter to only trigger when a specific property changes. Leave empty to trigger on any property change.',
      required: false,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_property_changed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'deal.propertyChange',
        'The webhook will trigger whenever any property of a deal is updated. You can optionally filter by a specific property name to only receive events for that property. The webhook provides both the property name and new value in the payload.'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_property_changed',
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
        value: 'hubspot_deal_property_changed',
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
    "eventType": "deal.propertyChange",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to deal property change events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_property_changed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_deal_property_changed',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_deal_property_changed',
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
            eventId: 3181526827,
            subscriptionId: 4629987,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'deal.propertyChange',
            attemptNumber: 0,
            objectId: 316126906060,
            propertyName: 'dealstage',
            propertyValue: 'closedwon',
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
        value: 'hubspot_deal_property_changed',
      },
    },
  ],

  outputs: buildDealPropertyChangedOutputs(),

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/hubspot/index.ts

```typescript
export { hubspotCompanyCreatedTrigger } from './company_created'
export { hubspotCompanyDeletedTrigger } from './company_deleted'
export { hubspotCompanyPropertyChangedTrigger } from './company_property_changed'
export { hubspotContactCreatedTrigger } from './contact_created'
export { hubspotContactDeletedTrigger } from './contact_deleted'
export { hubspotContactPrivacyDeletedTrigger } from './contact_privacy_deleted'
export { hubspotContactPropertyChangedTrigger } from './contact_property_changed'
export { hubspotConversationCreationTrigger } from './conversation_creation'
export { hubspotConversationDeletionTrigger } from './conversation_deletion'
export { hubspotConversationNewMessageTrigger } from './conversation_new_message'
export { hubspotConversationPrivacyDeletionTrigger } from './conversation_privacy_deletion'
export { hubspotConversationPropertyChangedTrigger } from './conversation_property_changed'
export { hubspotDealCreatedTrigger } from './deal_created'
export { hubspotDealDeletedTrigger } from './deal_deleted'
export { hubspotDealPropertyChangedTrigger } from './deal_property_changed'
export { hubspotTicketCreatedTrigger } from './ticket_created'
export { hubspotTicketDeletedTrigger } from './ticket_deleted'
export { hubspotTicketPropertyChangedTrigger } from './ticket_property_changed'
export { hubspotAllTriggerOptions, isHubSpotContactEventMatch } from './utils'
```

--------------------------------------------------------------------------------

---[FILE: ticket_created.ts]---
Location: sim-main/apps/sim/triggers/hubspot/ticket_created.ts

```typescript
import { HubspotIcon } from '@/components/icons'
import {
  buildTicketCreatedOutputs,
  hubspotSetupInstructions,
  hubspotTicketTriggerOptions,
} from '@/triggers/hubspot/utils'
import type { TriggerConfig } from '@/triggers/types'

export const hubspotTicketCreatedTrigger: TriggerConfig = {
  id: 'hubspot_ticket_created',
  name: 'HubSpot Ticket Created',
  provider: 'hubspot',
  description: 'Trigger workflow when a new ticket is created in HubSpot',
  version: '1.0.0',
  icon: HubspotIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: hubspotTicketTriggerOptions,
      value: () => 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      type: 'text',
      defaultValue: hubspotSetupInstructions(
        'ticket.creation',
        'The webhook will trigger whenever a new ticket is created in your HubSpot account, regardless of the source (manual entry, form submission, API, import, etc.).'
      ),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_created',
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
        value: 'hubspot_ticket_created',
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
    "eventType": "ticket.creation",
    "active": true
  }'`,
      readOnly: true,
      collapsible: true,
      defaultCollapsed: true,
      showCopyButton: true,
      description: 'Run this command to subscribe to ticket creation events',
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      mode: 'trigger',
      triggerId: 'hubspot_ticket_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'hubspot_ticket_created',
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
            eventId: 3181526830,
            subscriptionId: 4629990,
            portalId: 244315265,
            appId: 23608917,
            occurredAt: 1762659213730,
            subscriptionType: 'ticket.creation',
            attemptNumber: 0,
            objectId: 316126906070,
            changeFlag: 'CREATED',
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
        value: 'hubspot_ticket_created',
      },
    },
  ],

  outputs: buildTicketCreatedOutputs(),

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

````
