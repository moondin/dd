---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 797
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 797 of 933)

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

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/telegram/webhook.ts

```typescript
import { TelegramIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const telegramWebhookTrigger: TriggerConfig = {
  id: 'telegram_webhook',
  name: 'Telegram Webhook',
  provider: 'telegram',
  description: 'Trigger workflow from Telegram bot messages and events',
  version: '1.0.0',
  icon: TelegramIcon,

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
    },
    {
      id: 'botToken',
      title: 'Bot Token',
      type: 'short-input',
      placeholder: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
      description: 'Your Telegram Bot Token from BotFather',
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Message "/newbot" to <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" class="text-muted-foreground underline transition-colors hover:text-muted-foreground/80">@BotFather</a> in Telegram to create a bot and copy its token.',
        'Enter your Bot Token above.',
        'Save settings and any message sent to your bot will trigger the workflow.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'telegram_webhook',
    },
  ],

  outputs: {
    message: {
      id: {
        type: 'number',
        description: 'Telegram message ID',
      },
      text: {
        type: 'string',
        description: 'Message text content (if present)',
      },
      date: {
        type: 'number',
        description: 'Date the message was sent (Unix timestamp)',
      },
      messageType: {
        type: 'string',
        description:
          'Detected content type: text, photo, document, audio, video, voice, sticker, location, contact, poll',
      },
      raw: {
        message_id: {
          type: 'number',
          description: 'Original Telegram message_id',
        },
        date: {
          type: 'number',
          description: 'Original Telegram message date (Unix timestamp)',
        },
        text: {
          type: 'string',
          description: 'Original Telegram text (if present)',
        },
        caption: {
          type: 'string',
          description: 'Original Telegram caption (if present)',
        },
        chat: {
          id: { type: 'number', description: 'Chat identifier' },
          username: { type: 'string', description: 'Chat username (if available)' },
          first_name: { type: 'string', description: 'First name (for private chats)' },
          last_name: { type: 'string', description: 'Last name (for private chats)' },
        },
        from: {
          id: { type: 'number', description: 'Sender user ID' },
          is_bot: { type: 'boolean', description: 'Whether the sender is a bot' },
          first_name: { type: 'string', description: 'Sender first name' },
          last_name: { type: 'string', description: 'Sender last name' },
          language_code: { type: 'string', description: 'Sender language code (if available)' },
        },
      },
    },
    sender: {
      id: { type: 'number', description: 'Sender user ID' },
      firstName: { type: 'string', description: 'Sender first name' },
      lastName: { type: 'string', description: 'Sender last name' },
      languageCode: { type: 'string', description: 'Sender language code (if available)' },
      isBot: { type: 'boolean', description: 'Whether the sender is a bot' },
    },
    updateId: {
      type: 'number',
      description: 'Update ID for this webhook delivery',
    },
    updateType: {
      type: 'string',
      description:
        'Type of update: message, edited_message, channel_post, edited_channel_post, unknown',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/twilio_voice/index.ts

```typescript
export { twilioVoiceWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/twilio_voice/webhook.ts

```typescript
import { TwilioIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const twilioVoiceWebhookTrigger: TriggerConfig = {
  id: 'twilio_voice_webhook',
  name: 'Twilio Voice Webhook',
  provider: 'twilio_voice',
  description: 'Trigger workflow when phone calls are received via Twilio Voice',
  version: '1.0.0',
  icon: TwilioIcon,

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
    },
    {
      id: 'accountSid',
      title: 'Twilio Account SID',
      type: 'short-input',
      placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      description: 'Your Twilio Account SID from the Twilio Console',
      required: true,
      mode: 'trigger',
    },
    {
      id: 'authToken',
      title: 'Auth Token',
      type: 'short-input',
      placeholder: 'Your Twilio Auth Token',
      description: 'Your Twilio Auth Token for webhook signature verification',
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'twimlResponse',
      title: 'TwiML Response',
      type: 'long-input',
      placeholder: '[Response][Say]Please hold.[/Say][/Response]',
      description:
        'TwiML instructions to return immediately to Twilio. Use square brackets instead of angle brackets (e.g., [Response] instead of <Response>). This controls what happens when the call comes in (e.g., play a message, record, gather input). Your workflow will execute in the background.',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Enter a TwiML Response above - this tells Twilio what to do when a call comes in (e.g., play a message, record, gather input). Note: Use square brackets [Tag] instead of angle brackets for TwiML tags',
        'Example TwiML for recording with transcription: [Response][Say]Please leave a message.[/Say][Record transcribe="true" maxLength="120"/][/Response]',
        'Go to your Twilio Console Phone Numbers page at https://console.twilio.com/us1/develop/phone-numbers/manage/incoming',
        'Select the phone number you want to use for incoming calls.',
        'Scroll down to the "Voice Configuration" section.',
        'In the "A CALL COMES IN" field, select "Webhook" and paste the Webhook URL (from above).',
        'Ensure the HTTP method is set to POST.',
        'Click "Save configuration".',
        'How it works: When a call comes in, Twilio receives your TwiML response immediately and executes those instructions. Your workflow runs in the background with access to caller information, call status, and any recorded/transcribed data.',
      ]
        .map((instruction, index) => `${index + 1}. ${instruction}`)
        .join('\n\n'),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'twilio_voice_webhook',
    },
  ],

  outputs: {
    callSid: {
      type: 'string',
      description: 'Unique identifier for this call',
    },
    accountSid: {
      type: 'string',
      description: 'Twilio Account SID',
    },
    from: {
      type: 'string',
      description: "Caller's phone number (E.164 format)",
    },
    to: {
      type: 'string',
      description: 'Recipient phone number (your Twilio number)',
    },
    callStatus: {
      type: 'string',
      description: 'Status of the call (queued, ringing, in-progress, completed, etc.)',
    },
    direction: {
      type: 'string',
      description: 'Call direction: inbound or outbound',
    },
    apiVersion: {
      type: 'string',
      description: 'Twilio API version',
    },
    callerName: {
      type: 'string',
      description: 'Caller ID name if available',
    },
    forwardedFrom: {
      type: 'string',
      description: 'Phone number that forwarded this call',
    },
    digits: {
      type: 'string',
      description: 'DTMF digits entered by caller (from <Gather>)',
    },
    speechResult: {
      type: 'string',
      description: 'Speech recognition result (if using <Gather> with speech)',
    },
    recordingUrl: {
      type: 'string',
      description: 'URL of call recording if available',
    },
    recordingSid: {
      type: 'string',
      description: 'Recording SID if available',
    },
    called: {
      type: 'string',
      description: 'Phone number that was called (same as "to")',
    },
    caller: {
      type: 'string',
      description: 'Phone number of the caller (same as "from")',
    },
    toCity: {
      type: 'string',
      description: 'City of the called number',
    },
    toState: {
      type: 'string',
      description: 'State/province of the called number',
    },
    toZip: {
      type: 'string',
      description: 'Zip/postal code of the called number',
    },
    toCountry: {
      type: 'string',
      description: 'Country of the called number',
    },
    fromCity: {
      type: 'string',
      description: 'City of the caller',
    },
    fromState: {
      type: 'string',
      description: 'State/province of the caller',
    },
    fromZip: {
      type: 'string',
      description: 'Zip/postal code of the caller',
    },
    fromCountry: {
      type: 'string',
      description: 'Country of the caller',
    },
    calledCity: {
      type: 'string',
      description: 'City of the called number (same as toCity)',
    },
    calledState: {
      type: 'string',
      description: 'State of the called number (same as toState)',
    },
    calledZip: {
      type: 'string',
      description: 'Zip code of the called number (same as toZip)',
    },
    calledCountry: {
      type: 'string',
      description: 'Country of the called number (same as toCountry)',
    },
    callerCity: {
      type: 'string',
      description: 'City of the caller (same as fromCity)',
    },
    callerState: {
      type: 'string',
      description: 'State of the caller (same as fromState)',
    },
    callerZip: {
      type: 'string',
      description: 'Zip code of the caller (same as fromZip)',
    },
    callerCountry: {
      type: 'string',
      description: 'Country of the caller (same as fromCountry)',
    },
    callToken: {
      type: 'string',
      description: 'Twilio call token for authentication',
    },
    raw: {
      type: 'string',
      description: 'Complete raw webhook payload from Twilio as JSON string',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/typeform/index.ts

```typescript
export { typeformWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/typeform/webhook.ts

```typescript
import { TypeformIcon } from '@/components/icons'
import type { TriggerConfig } from '@/triggers/types'

export const typeformWebhookTrigger: TriggerConfig = {
  id: 'typeform_webhook',
  name: 'Typeform Webhook',
  provider: 'typeform',
  description: 'Trigger workflow when a Typeform submission is received',
  version: '1.0.0',
  icon: TypeformIcon,

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
    },
    {
      id: 'formId',
      title: 'Form ID',
      type: 'short-input',
      placeholder: 'Enter your Typeform form ID',
      description:
        'The unique identifier for your Typeform. Find it in the form URL or form settings.',
      required: true,
      mode: 'trigger',
    },
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Typeform personal access token',
      description:
        'Required to automatically register the webhook with Typeform. Get yours at https://admin.typeform.com/account#/section/tokens',
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'secret',
      title: 'Webhook Secret',
      type: 'short-input',
      placeholder: 'Enter a secret for webhook signature verification (optional)',
      description:
        'A secret string used to verify webhook authenticity. Highly recommended for security. Generate a secure random string (min 20 characters recommended).',
      password: true,
      required: false,
      mode: 'trigger',
    },
    {
      id: 'includeDefinition',
      title: 'Include Form Definition',
      type: 'switch',
      description:
        'Include the complete form structure (questions, fields, endings) in your workflow variables. Note: Typeform always sends this data, but enabling this makes it accessible in your workflow.',
      defaultValue: false,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Get your Typeform Personal Access Token from <a href="https://admin.typeform.com/account#/section/tokens" target="_blank" rel="noopener noreferrer">https://admin.typeform.com/account#/section/tokens</a>',
        'Find your Form ID in the URL when editing your form (e.g., <code>https://admin.typeform.com/form/ABC123/create</code> → Form ID is <code>ABC123</code>)',
        'Fill in the form above with your Form ID and Personal Access Token',
        'Optionally add a Webhook Secret for enhanced security - Sim will verify all incoming webhooks match this secret',
        'Click "Save" below - Sim will automatically register the webhook with Typeform',
        '<strong>Note:</strong> Requires a Typeform PRO or PRO+ account to use webhooks',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'typeform_webhook',
    },
  ],

  outputs: {
    event_id: {
      type: 'string',
      description: 'Unique identifier for this webhook event',
    },
    event_type: {
      type: 'string',
      description: 'Type of event (always "form_response" for form submissions)',
    },
    form_id: {
      type: 'string',
      description: 'Typeform form identifier',
    },
    token: {
      type: 'string',
      description: 'Unique response/submission identifier',
    },
    submitted_at: {
      type: 'string',
      description: 'ISO timestamp when the form was submitted',
    },
    landed_at: {
      type: 'string',
      description: 'ISO timestamp when the user first landed on the form',
    },
    calculated: {
      score: {
        type: 'number',
        description: 'Calculated score value',
      },
    },
    variables: {
      type: 'array',
      description: 'Array of dynamic variables with key, type, and value',
    },
    hidden: {
      type: 'json',
      description: 'Hidden fields passed to the form (e.g., UTM parameters)',
    },
    answers: {
      type: 'array',
      description:
        'Array of respondent answers (only includes answered questions). Each answer contains type, value, and field reference.',
    },
    definition: {
      id: {
        type: 'string',
        description: 'Form ID',
      },
      title: {
        type: 'string',
        description: 'Form title',
      },
      fields: {
        type: 'array',
        description: 'Array of form fields',
      },
      endings: {
        type: 'array',
        description: 'Array of form endings',
      },
    },
    ending: {
      id: {
        type: 'string',
        description: 'Ending screen ID',
      },
      ref: {
        type: 'string',
        description: 'Ending screen reference',
      },
    },
    raw: {
      type: 'json',
      description: 'Complete original webhook payload from Typeform',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Typeform-Signature': 'sha256=<signature>',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: collection_item_changed.ts]---
Location: sim-main/apps/sim/triggers/webflow/collection_item_changed.ts

```typescript
import { WebflowIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const webflowCollectionItemChangedTrigger: TriggerConfig = {
  id: 'webflow_collection_item_changed',
  name: 'Collection Item Changed',
  provider: 'webflow',
  description:
    'Trigger workflow when an item is updated in a Webflow CMS collection (requires Webflow credentials)',
  version: '1.0.0',
  icon: WebflowIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires webflow credentials to access your account.',
      serviceId: 'webflow',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_changed',
      },
    },
    {
      id: 'siteId',
      title: 'Site',
      type: 'dropdown',
      placeholder: 'Select a site',
      description: 'The Webflow site to monitor',
      required: true,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_changed',
      },
    },
    {
      id: 'collectionId',
      title: 'Collection',
      type: 'dropdown',
      placeholder: 'Select a collection (optional)',
      description: 'Optionally filter to monitor only a specific collection',
      required: false,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_changed',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Webflow account using the "Select Webflow credential" button above.',
        'Enter your Webflow Site ID (found in the site URL or site settings).',
        'Optionally enter a Collection ID to monitor only specific collections.',
        'If no Collection ID is provided, the trigger will fire for items changed in any collection on the site.',
        'The webhook will trigger whenever an existing item is updated in the specified collection(s).',
        'Make sure your Webflow account has appropriate permissions for the specified site.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_changed',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'webflow_collection_item_changed',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_changed',
      },
    },
  ],

  outputs: {
    siteId: {
      type: 'string',
      description: 'The site ID where the event occurred',
    },
    workspaceId: {
      type: 'string',
      description: 'The workspace ID where the event occurred',
    },
    collectionId: {
      type: 'string',
      description: 'The collection ID where the item was changed',
    },
    payload: {
      id: { type: 'string', description: 'The ID of the changed item' },
      cmsLocaleId: { type: 'string', description: 'CMS locale ID' },
      lastPublished: { type: 'string', description: 'Last published timestamp' },
      lastUpdated: { type: 'string', description: 'Last updated timestamp' },
      createdOn: { type: 'string', description: 'Timestamp when the item was created' },
      isArchived: { type: 'boolean', description: 'Whether the item is archived' },
      isDraft: { type: 'boolean', description: 'Whether the item is a draft' },
      fieldData: { type: 'object', description: 'The updated field data of the item' },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: collection_item_created.ts]---
Location: sim-main/apps/sim/triggers/webflow/collection_item_created.ts

```typescript
import { WebflowIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const webflowCollectionItemCreatedTrigger: TriggerConfig = {
  id: 'webflow_collection_item_created',
  name: 'Collection Item Created',
  provider: 'webflow',
  description:
    'Trigger workflow when a new item is created in a Webflow CMS collection (requires Webflow credentials)',
  version: '1.0.0',
  icon: WebflowIcon,

  subBlocks: [
    {
      id: 'selectedTriggerId',
      title: 'Trigger Type',
      type: 'dropdown',
      mode: 'trigger',
      options: [
        { label: 'Collection Item Created', id: 'webflow_collection_item_created' },
        { label: 'Collection Item Changed', id: 'webflow_collection_item_changed' },
        { label: 'Collection Item Deleted', id: 'webflow_collection_item_deleted' },
      ],
      value: () => 'webflow_collection_item_created',
      required: true,
    },
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires webflow credentials to access your account.',
      serviceId: 'webflow',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_created',
      },
    },
    {
      id: 'siteId',
      title: 'Site',
      type: 'dropdown',
      placeholder: 'Select a site',
      description: 'The Webflow site to monitor',
      required: true,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_created',
      },
    },
    {
      id: 'collectionId',
      title: 'Collection',
      type: 'dropdown',
      placeholder: 'Select a collection (optional)',
      description: 'Optionally filter to monitor only a specific collection',
      required: false,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_created',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Webflow account using the "Select Webflow credential" button above.',
        'Enter your Webflow Site ID (found in the site URL or site settings).',
        'Optionally enter a Collection ID to monitor only specific collections.',
        'If no Collection ID is provided, the trigger will fire for items created in any collection on the site.',
        'The webhook will trigger whenever a new item is created in the specified collection(s).',
        'Make sure your Webflow account has appropriate permissions for the specified site.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_created',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'webflow_collection_item_created',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_created',
      },
    },
  ],

  outputs: {
    siteId: {
      type: 'string',
      description: 'The site ID where the event occurred',
    },
    workspaceId: {
      type: 'string',
      description: 'The workspace ID where the event occurred',
    },
    collectionId: {
      type: 'string',
      description: 'The collection ID where the item was created',
    },
    payload: {
      id: { type: 'string', description: 'The ID of the created item' },
      cmsLocaleId: { type: 'string', description: 'CMS locale ID' },
      lastPublished: { type: 'string', description: 'Last published timestamp' },
      lastUpdated: { type: 'string', description: 'Last updated timestamp' },
      createdOn: { type: 'string', description: 'Timestamp when the item was created' },
      isArchived: { type: 'boolean', description: 'Whether the item is archived' },
      isDraft: { type: 'boolean', description: 'Whether the item is a draft' },
      fieldData: { type: 'object', description: 'The field data of the item' },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: collection_item_deleted.ts]---
Location: sim-main/apps/sim/triggers/webflow/collection_item_deleted.ts

```typescript
import { WebflowIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const webflowCollectionItemDeletedTrigger: TriggerConfig = {
  id: 'webflow_collection_item_deleted',
  name: 'Collection Item Deleted',
  provider: 'webflow',
  description:
    'Trigger workflow when an item is deleted from a Webflow CMS collection (requires Webflow credentials)',
  version: '1.0.0',
  icon: WebflowIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires webflow credentials to access your account.',
      serviceId: 'webflow',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_deleted',
      },
    },
    {
      id: 'siteId',
      title: 'Site',
      type: 'dropdown',
      placeholder: 'Select a site',
      description: 'The Webflow site to monitor',
      required: true,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_deleted',
      },
    },
    {
      id: 'collectionId',
      title: 'Collection',
      type: 'dropdown',
      placeholder: 'Select a collection (optional)',
      description: 'Optionally filter to monitor only a specific collection',
      required: false,
      options: [],
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_deleted',
      },
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Webflow account using the "Select Webflow credential" button above.',
        'Enter your Webflow Site ID (found in the site URL or site settings).',
        'Optionally enter a Collection ID to monitor only specific collections.',
        'If no Collection ID is provided, the trigger will fire for items deleted in any collection on the site.',
        'The webhook will trigger whenever an item is deleted from the specified collection(s).',
        'Note: Once an item is deleted, only minimal information (ID, collection, site) is available.',
        'Make sure your Webflow account has appropriate permissions for the specified site.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_deleted',
      },
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'webflow_collection_item_deleted',
      condition: {
        field: 'selectedTriggerId',
        value: 'webflow_collection_item_deleted',
      },
    },
  ],

  outputs: {
    siteId: {
      type: 'string',
      description: 'The site ID where the event occurred',
    },
    workspaceId: {
      type: 'string',
      description: 'The workspace ID where the event occurred',
    },
    collectionId: {
      type: 'string',
      description: 'The collection ID where the item was deleted',
    },
    payload: {
      id: { type: 'string', description: 'The ID of the deleted item' },
      deletedOn: { type: 'string', description: 'Timestamp when the item was deleted' },
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: form_submission.ts]---
Location: sim-main/apps/sim/triggers/webflow/form_submission.ts

```typescript
import { WebflowIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const webflowFormSubmissionTrigger: TriggerConfig = {
  id: 'webflow_form_submission',
  name: 'Form Submission',
  provider: 'webflow',
  description:
    'Trigger workflow when a form is submitted on a Webflow site (requires Webflow credentials)',
  version: '1.0.0',
  icon: WebflowIcon,

  subBlocks: [
    {
      id: 'triggerCredentials',
      title: 'Credentials',
      type: 'oauth-input',
      description: 'This trigger requires webflow credentials to access your account.',
      serviceId: 'webflow',
      requiredScopes: [],
      required: true,
      mode: 'trigger',
    },
    {
      id: 'siteId',
      title: 'Site',
      type: 'dropdown',
      placeholder: 'Select a site',
      description: 'The Webflow site to monitor',
      required: true,
      options: [],
      mode: 'trigger',
    },
    {
      id: 'formId',
      title: 'Form ID',
      type: 'short-input',
      placeholder: 'form-123abc (optional)',
      description: 'The ID of the specific form to monitor (optional - leave empty for all forms)',
      required: false,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Connect your Webflow account using the "Select Webflow credential" button above.',
        'Enter your Webflow Site ID (found in the site URL or site settings).',
        'Optionally enter a Form ID to monitor only a specific form.',
        'If no Form ID is provided, the trigger will fire for any form submission on the site.',
        'The webhook will trigger whenever a form is submitted on the specified site.',
        'Form data will be included in the payload with all submitted field values.',
        'Make sure your Webflow account has appropriate permissions for the specified site.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'webflow_form_submission',
    },
  ],

  outputs: {
    siteId: {
      type: 'string',
      description: 'The site ID where the form was submitted',
    },
    workspaceId: {
      type: 'string',
      description: 'The workspace ID where the event occurred',
    },
    name: {
      type: 'string',
      description: 'The name of the form',
    },
    id: {
      type: 'string',
      description: 'The unique ID of the form submission',
    },
    submittedAt: {
      type: 'string',
      description: 'Timestamp when the form was submitted',
    },
    data: {
      type: 'object',
      description: 'The form submission field data (keys are field names)',
    },
    schema: {
      type: 'object',
      description: 'Form schema information',
    },
    formElementId: {
      type: 'string',
      description: 'The form element ID',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/webflow/index.ts

```typescript
export { webflowCollectionItemChangedTrigger } from './collection_item_changed'
export { webflowCollectionItemCreatedTrigger } from './collection_item_created'
export { webflowCollectionItemDeletedTrigger } from './collection_item_deleted'
export { webflowFormSubmissionTrigger } from './form_submission'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/triggers/whatsapp/index.ts

```typescript
export { whatsappWebhookTrigger } from './webhook'
```

--------------------------------------------------------------------------------

---[FILE: webhook.ts]---
Location: sim-main/apps/sim/triggers/whatsapp/webhook.ts

```typescript
import { WhatsAppIcon } from '@/components/icons'
import type { TriggerConfig } from '../types'

export const whatsappWebhookTrigger: TriggerConfig = {
  id: 'whatsapp_webhook',
  name: 'WhatsApp Webhook',
  provider: 'whatsapp',
  description: 'Trigger workflow from WhatsApp messages and events via Business Platform webhooks',
  version: '1.0.0',
  icon: WhatsAppIcon,

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
    },
    {
      id: 'verificationToken',
      title: 'Verification Token',
      type: 'short-input',
      placeholder: 'Generate or enter a verification token',
      description:
        "Enter any secure token here. You'll need to provide the same token in your WhatsApp Business Platform dashboard.",
      password: true,
      required: true,
      mode: 'trigger',
    },
    {
      id: 'triggerInstructions',
      title: 'Setup Instructions',
      hideFromPreview: true,
      type: 'text',
      defaultValue: [
        'Go to your <a href="https://developers.facebook.com/apps/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground underline transition-colors hover:text-muted-foreground/80">Meta for Developers Apps</a> page and navigate to the "Build with us" --> "App Events" section.',
        'If you don\'t have an app:<br><ul class="mt-1 ml-5 list-disc"><li>Create an app from scratch</li><li>Give it a name and select your workspace</li></ul>',
        'Select your App, then navigate to WhatsApp > Configuration.',
        'Find the Webhooks section and click "Edit".',
        'Paste the <strong>Webhook URL</strong> above into the "Callback URL" field.',
        'Paste the <strong>Verification Token</strong> into the "Verify token" field.',
        'Click "Verify and save".',
        'Click "Manage" next to Webhook fields and subscribe to `messages`.',
      ]
        .map(
          (instruction, index) =>
            `<div class="mb-3"><strong>${index + 1}.</strong> ${instruction}</div>`
        )
        .join(''),
      mode: 'trigger',
    },
    {
      id: 'triggerSave',
      title: '',
      type: 'trigger-save',
      hideFromPreview: true,
      mode: 'trigger',
      triggerId: 'whatsapp_webhook',
    },
  ],

  outputs: {
    messageId: {
      type: 'string',
      description: 'Unique message identifier',
    },
    from: {
      type: 'string',
      description: 'Phone number of the message sender',
    },
    phoneNumberId: {
      type: 'string',
      description: 'WhatsApp Business phone number ID that received the message',
    },
    text: {
      type: 'string',
      description: 'Message text content',
    },
    timestamp: {
      type: 'string',
      description: 'Message timestamp',
    },
    raw: {
      type: 'string',
      description: 'Complete raw message object from WhatsApp as JSON string',
    },
  },

  webhook: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
}
```

--------------------------------------------------------------------------------

````
