---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 493
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 493 of 933)

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

---[FILE: twilio_voice.ts]---
Location: sim-main/apps/sim/blocks/blocks/twilio_voice.ts

```typescript
import { TwilioIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { ToolResponse } from '@/tools/types'
import { getTrigger } from '@/triggers'

export const TwilioVoiceBlock: BlockConfig<ToolResponse> = {
  type: 'twilio_voice',
  name: 'Twilio Voice',
  description: 'Make and manage phone calls',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Twilio Voice into the workflow. Make outbound calls and retrieve call recordings.',
  category: 'tools',
  bgColor: '#F22F46', // Twilio brand color
  icon: TwilioIcon,
  triggerAllowed: true,
  subBlocks: [
    ...getTrigger('twilio_voice_webhook').subBlocks,
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Make Call', id: 'make_call' },
        { label: 'List Calls', id: 'list_calls' },
        { label: 'Get Recording', id: 'get_recording' },
      ],
      value: () => 'make_call',
    },
    {
      id: 'accountSid',
      title: 'Twilio Account SID',
      type: 'short-input',
      placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      required: true,
    },
    {
      id: 'authToken',
      title: 'Auth Token',
      type: 'short-input',
      placeholder: 'Your Twilio Auth Token',
      password: true,
      required: true,
    },
    {
      id: 'to',
      title: 'To Phone Number',
      type: 'short-input',
      placeholder: '+14155551234',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
      required: true,
    },
    {
      id: 'from',
      title: 'From Twilio Number',
      type: 'short-input',
      placeholder: '+14155556789',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
      required: true,
    },
    {
      id: 'url',
      title: 'TwiML URL',
      type: 'short-input',
      placeholder: 'https://example.com/twiml',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'twiml',
      title: 'TwiML Instructions',
      type: 'long-input',
      placeholder: '[Response][Say]Hello from Twilio![/Say][/Response]',
      description:
        'Use square brackets instead of angle brackets (e.g., [Response] instead of <Response>)',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'record',
      title: 'Record Call',
      type: 'switch',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'timeout',
      title: 'Timeout (seconds)',
      type: 'short-input',
      placeholder: '60',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'statusCallback',
      title: 'Status Callback URL',
      type: 'short-input',
      placeholder: 'https://example.com/status',
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'machineDetection',
      title: 'Machine Detection',
      type: 'dropdown',
      options: [
        { label: 'Disabled', id: '' },
        { label: 'Enable', id: 'Enable' },
        { label: 'Detect Message End', id: 'DetectMessageEnd' },
      ],
      condition: {
        field: 'operation',
        value: 'make_call',
      },
    },
    {
      id: 'listTo',
      title: 'To Number',
      type: 'short-input',
      placeholder: '+14155551234',
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'listFrom',
      title: 'From Number',
      type: 'short-input',
      placeholder: '+14155556789',
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'listStatus',
      title: 'Status',
      type: 'dropdown',
      options: [
        { label: 'All', id: '' },
        { label: 'Queued', id: 'queued' },
        { label: 'Ringing', id: 'ringing' },
        { label: 'In Progress', id: 'in-progress' },
        { label: 'Completed', id: 'completed' },
        { label: 'Failed', id: 'failed' },
        { label: 'Busy', id: 'busy' },
        { label: 'No Answer', id: 'no-answer' },
        { label: 'Canceled', id: 'canceled' },
      ],
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'listPageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: '50',
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'startTimeAfter',
      title: 'After (YYYY-MM-DD)',
      type: 'short-input',
      placeholder: '2025-01-01',
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'startTimeBefore',
      title: 'Before (YYYY-MM-DD)',
      type: 'short-input',
      placeholder: '2025-12-31',
      condition: {
        field: 'operation',
        value: 'list_calls',
      },
    },
    {
      id: 'recordingSid',
      title: 'Recording SID',
      type: 'short-input',
      placeholder: 'RExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      condition: {
        field: 'operation',
        value: 'get_recording',
      },
      required: true,
    },
  ],
  tools: {
    access: ['twilio_voice_make_call', 'twilio_voice_list_calls', 'twilio_voice_get_recording'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'make_call':
            return 'twilio_voice_make_call'
          case 'list_calls':
            return 'twilio_voice_list_calls'
          case 'get_recording':
            return 'twilio_voice_get_recording'
          default:
            return 'twilio_voice_make_call'
        }
      },
      params: (params) => {
        const { operation, timeout, record, listTo, listFrom, listStatus, listPageSize, ...rest } =
          params

        const baseParams = { ...rest }

        if (operation === 'make_call' && timeout) {
          baseParams.timeout = Number.parseInt(timeout, 10)
        }

        if (operation === 'make_call' && record !== undefined && record !== null) {
          if (typeof record === 'string') {
            baseParams.record = record.toLowerCase() === 'true' || record === '1'
          } else if (typeof record === 'number') {
            baseParams.record = record !== 0
          } else {
            baseParams.record = Boolean(record)
          }
        }

        if (operation === 'list_calls') {
          if (listTo) baseParams.to = listTo
          if (listFrom) baseParams.from = listFrom
          if (listStatus) baseParams.status = listStatus
          if (listPageSize) baseParams.pageSize = Number.parseInt(listPageSize, 10)
        }

        return baseParams
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Voice operation to perform' },
    accountSid: { type: 'string', description: 'Twilio Account SID' },
    authToken: { type: 'string', description: 'Twilio Auth Token' },
    to: { type: 'string', description: 'Destination phone number' },
    from: { type: 'string', description: 'Source Twilio number' },
    url: { type: 'string', description: 'TwiML URL' },
    twiml: { type: 'string', description: 'TwiML instructions' },
    record: { type: 'boolean', description: 'Record the call' },
    timeout: { type: 'string', description: 'Call timeout in seconds' },
    statusCallback: { type: 'string', description: 'Status callback URL' },
    machineDetection: { type: 'string', description: 'Answering machine detection' },
    listTo: { type: 'string', description: 'Filter calls by To number' },
    listFrom: { type: 'string', description: 'Filter calls by From number' },
    listStatus: { type: 'string', description: 'Filter calls by status' },
    listPageSize: { type: 'string', description: 'Number of calls to return per page' },
    startTimeAfter: { type: 'string', description: 'Filter calls that started after this date' },
    startTimeBefore: { type: 'string', description: 'Filter calls that started before this date' },
    recordingSid: { type: 'string', description: 'Recording SID to retrieve' },
  },
  outputs: {
    success: { type: 'boolean', description: 'Operation success status' },
    callSid: { type: 'string', description: 'Call unique identifier' },
    status: { type: 'string', description: 'Call or recording status' },
    direction: { type: 'string', description: 'Call direction' },
    duration: { type: 'number', description: 'Call/recording duration in seconds' },
    price: { type: 'string', description: 'Cost of the operation' },
    priceUnit: { type: 'string', description: 'Currency of the price' },
    recordingSid: { type: 'string', description: 'Recording unique identifier' },
    channels: { type: 'number', description: 'Number of recording channels' },
    source: { type: 'string', description: 'Recording source' },
    mediaUrl: { type: 'string', description: 'URL to download recording' },
    uri: { type: 'string', description: 'Resource URI' },
    transcriptionText: {
      type: 'string',
      description: 'Transcribed text (only if TwiML includes <Record transcribe="true">)',
    },
    transcriptionStatus: {
      type: 'string',
      description: 'Transcription status (completed, in-progress, failed)',
    },
    calls: { type: 'array', description: 'Array of call objects (for list_calls operation)' },
    total: { type: 'number', description: 'Total number of calls returned' },
    page: { type: 'number', description: 'Current page number' },
    pageSize: { type: 'number', description: 'Number of calls per page' },
    error: { type: 'string', description: 'Error message if operation failed' },
    accountSid: { type: 'string', description: 'Twilio Account SID from webhook' },
    from: { type: 'string', description: "Caller's phone number (E.164 format)" },
    to: { type: 'string', description: 'Recipient phone number (your Twilio number)' },
    callStatus: {
      type: 'string',
      description: 'Status of the incoming call (queued, ringing, in-progress, completed, etc.)',
    },
    apiVersion: { type: 'string', description: 'Twilio API version' },
    callerName: { type: 'string', description: 'Caller ID name if available' },
    forwardedFrom: { type: 'string', description: 'Phone number that forwarded this call' },
    digits: { type: 'string', description: 'DTMF digits entered by caller (from <Gather>)' },
    speechResult: { type: 'string', description: 'Speech recognition result (if using <Gather>)' },
    recordingUrl: { type: 'string', description: 'URL of call recording if available' },
    raw: { type: 'string', description: 'Complete raw webhook payload as JSON string' },
  },
  triggers: {
    enabled: true,
    available: ['twilio_voice_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: typeform.ts]---
Location: sim-main/apps/sim/blocks/blocks/typeform.ts

```typescript
import { TypeformIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { TypeformResponse } from '@/tools/typeform/types'
import { getTrigger } from '@/triggers'

export const TypeformBlock: BlockConfig<TypeformResponse> = {
  type: 'typeform',
  name: 'Typeform',
  description: 'Interact with Typeform',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Integrate Typeform into the workflow. Can retrieve responses, download files, and get form insights. Can be used in trigger mode to trigger a workflow when a form is submitted. Requires API Key.',
  docsLink: 'https://docs.sim.ai/tools/typeform',
  category: 'tools',
  bgColor: '#262627', // Typeform brand color
  icon: TypeformIcon,
  subBlocks: [
    {
      id: 'operation',
      title: 'Operation',
      type: 'dropdown',
      options: [
        { label: 'Retrieve Responses', id: 'typeform_responses' },
        { label: 'Download File', id: 'typeform_files' },
        { label: 'Form Insights', id: 'typeform_insights' },
        { label: 'List Forms', id: 'typeform_list_forms' },
        { label: 'Get Form Details', id: 'typeform_get_form' },
        { label: 'Create Form', id: 'typeform_create_form' },
        { label: 'Update Form', id: 'typeform_update_form' },
        { label: 'Delete Form', id: 'typeform_delete_form' },
      ],
      value: () => 'typeform_responses',
    },
    {
      id: 'formId',
      title: 'Form ID',
      type: 'short-input',
      placeholder: 'Enter your Typeform form ID',
      required: true,
      condition: {
        field: 'operation',
        value: [
          'typeform_responses',
          'typeform_files',
          'typeform_insights',
          'typeform_get_form',
          'typeform_update_form',
          'typeform_delete_form',
        ],
      },
    },
    {
      id: 'apiKey',
      title: 'Personal Access Token',
      type: 'short-input',
      placeholder: 'Enter your Typeform personal access token',
      password: true,
      required: true,
    },
    // Response operation fields
    {
      id: 'pageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Number of responses per page (default: 25)',
      condition: { field: 'operation', value: 'typeform_responses' },
    },
    {
      id: 'since',
      title: 'Since',
      type: 'short-input',
      placeholder: 'Retrieve responses after this date (ISO format)',
      condition: { field: 'operation', value: 'typeform_responses' },
    },
    {
      id: 'until',
      title: 'Until',
      type: 'short-input',
      placeholder: 'Retrieve responses before this date (ISO format)',
      condition: { field: 'operation', value: 'typeform_responses' },
    },
    {
      id: 'completed',
      title: 'Completed',
      type: 'dropdown',
      options: [
        { label: 'All Responses', id: 'all' },
        { label: 'Only Completed', id: 'true' },
        { label: 'Only Incomplete', id: 'false' },
      ],
      condition: { field: 'operation', value: 'typeform_responses' },
    },
    // File operation fields
    {
      id: 'responseId',
      title: 'Response ID',
      type: 'short-input',
      placeholder: 'Enter response ID (token)',
      condition: { field: 'operation', value: 'typeform_files' },
    },
    {
      id: 'fieldId',
      title: 'Field ID',
      type: 'short-input',
      placeholder: 'Enter file upload field ID',
      condition: { field: 'operation', value: 'typeform_files' },
    },
    {
      id: 'filename',
      title: 'Filename',
      type: 'short-input',
      placeholder: 'Enter exact filename of the file',
      condition: { field: 'operation', value: 'typeform_files' },
    },
    {
      id: 'inline',
      title: 'Inline Display',
      type: 'switch',
      condition: { field: 'operation', value: 'typeform_files' },
    },
    // List forms operation fields
    {
      id: 'search',
      title: 'Search Query',
      type: 'short-input',
      placeholder: 'Search forms by title',
      condition: { field: 'operation', value: 'typeform_list_forms' },
    },
    {
      id: 'workspaceId',
      title: 'Workspace ID',
      type: 'short-input',
      placeholder: 'Filter by workspace ID',
      condition: { field: 'operation', value: 'typeform_list_forms' },
    },
    {
      id: 'page',
      title: 'Page Number',
      type: 'short-input',
      placeholder: 'Page number (default: 1)',
      condition: { field: 'operation', value: 'typeform_list_forms' },
    },
    {
      id: 'listPageSize',
      title: 'Page Size',
      type: 'short-input',
      placeholder: 'Forms per page (default: 10, max: 200)',
      condition: { field: 'operation', value: 'typeform_list_forms' },
    },
    // Create form operation fields
    {
      id: 'title',
      title: 'Form Title',
      type: 'short-input',
      placeholder: 'Enter form title',
      condition: { field: 'operation', value: 'typeform_create_form' },
      required: true,
    },
    {
      id: 'type',
      title: 'Form Type',
      type: 'dropdown',
      options: [
        { label: 'Form', id: 'form' },
        { label: 'Quiz', id: 'quiz' },
      ],
      condition: { field: 'operation', value: 'typeform_create_form' },
    },
    {
      id: 'workspaceIdCreate',
      title: 'Workspace ID',
      type: 'short-input',
      placeholder: 'Workspace to create form in',
      condition: { field: 'operation', value: 'typeform_create_form' },
    },
    {
      id: 'fields',
      title: 'Fields',
      type: 'long-input',
      placeholder: 'JSON array of field objects',
      condition: { field: 'operation', value: 'typeform_create_form' },
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'long-input',
      placeholder: 'JSON object for form settings',
      condition: { field: 'operation', value: 'typeform_create_form' },
    },
    {
      id: 'themeId',
      title: 'Theme ID',
      type: 'short-input',
      placeholder: 'Theme ID to apply',
      condition: { field: 'operation', value: 'typeform_create_form' },
    },
    // Update form operation fields
    {
      id: 'operations',
      title: 'JSON Patch Operations',
      type: 'long-input',
      placeholder: 'JSON array of patch operations (RFC 6902)',
      condition: { field: 'operation', value: 'typeform_update_form' },
      required: true,
    },
    ...getTrigger('typeform_webhook').subBlocks,
  ],
  tools: {
    access: [
      'typeform_responses',
      'typeform_files',
      'typeform_insights',
      'typeform_list_forms',
      'typeform_get_form',
      'typeform_create_form',
      'typeform_update_form',
      'typeform_delete_form',
    ],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'typeform_responses':
            return 'typeform_responses'
          case 'typeform_files':
            return 'typeform_files'
          case 'typeform_insights':
            return 'typeform_insights'
          case 'typeform_list_forms':
            return 'typeform_list_forms'
          case 'typeform_get_form':
            return 'typeform_get_form'
          case 'typeform_create_form':
            return 'typeform_create_form'
          case 'typeform_update_form':
            return 'typeform_update_form'
          case 'typeform_delete_form':
            return 'typeform_delete_form'
          default:
            return 'typeform_responses'
        }
      },
      params: (params) => {
        const {
          operation,
          listPageSize,
          workspaceIdCreate,
          fields,
          settings,
          operations,
          ...rest
        } = params

        let parsedFields: any | undefined
        let parsedSettings: any | undefined
        let parsedOperations: any | undefined

        try {
          if (fields) parsedFields = JSON.parse(fields)
          if (settings) parsedSettings = JSON.parse(settings)
          if (operations) parsedOperations = JSON.parse(operations)
        } catch (error: any) {
          throw new Error(`Invalid JSON input: ${error.message}`)
        }

        const pageSize = listPageSize !== undefined ? listPageSize : params.pageSize

        const workspaceId = workspaceIdCreate || params.workspaceId

        return {
          ...rest,
          ...(pageSize && { pageSize }),
          ...(workspaceId && { workspaceId }),
          ...(parsedFields && { fields: parsedFields }),
          ...(parsedSettings && { settings: parsedSettings }),
          ...(parsedOperations && { operations: parsedOperations }),
        }
      },
    },
  },
  inputs: {
    operation: { type: 'string', description: 'Operation to perform' },
    formId: { type: 'string', description: 'Typeform form identifier' },
    apiKey: { type: 'string', description: 'Personal access token' },
    // Response operation params
    pageSize: { type: 'number', description: 'Responses per page' },
    since: { type: 'string', description: 'Start date filter' },
    until: { type: 'string', description: 'End date filter' },
    completed: { type: 'string', description: 'Completion status filter' },
    // File operation params
    responseId: { type: 'string', description: 'Response identifier' },
    fieldId: { type: 'string', description: 'Field identifier' },
    filename: { type: 'string', description: 'File name' },
    inline: { type: 'boolean', description: 'Inline display option' },
    // List forms operation params
    search: { type: 'string', description: 'Search query for form titles' },
    workspaceId: { type: 'string', description: 'Workspace ID filter' },
    page: { type: 'number', description: 'Page number' },
    listPageSize: { type: 'number', description: 'Forms per page' },
    // Create form operation params
    title: { type: 'string', description: 'Form title' },
    type: { type: 'string', description: 'Form type (form or quiz)' },
    workspaceIdCreate: { type: 'string', description: 'Workspace ID for creation' },
    fields: { type: 'json', description: 'Form fields array' },
    settings: { type: 'json', description: 'Form settings object' },
    themeId: { type: 'string', description: 'Theme ID' },
    // Update form operation params
    operations: { type: 'json', description: 'JSON Patch operations array' },
  },
  outputs: {
    // List/responses outputs
    total_items: { type: 'number', description: 'Total response/form count' },
    page_count: { type: 'number', description: 'Total page count' },
    items: { type: 'json', description: 'Response/form items array' },
    // Form details outputs
    id: { type: 'string', description: 'Form unique identifier' },
    title: { type: 'string', description: 'Form title' },
    type: { type: 'string', description: 'Form type' },
    settings: { type: 'json', description: 'Form settings object' },
    theme: { type: 'json', description: 'Theme reference' },
    workspace: { type: 'json', description: 'Workspace reference' },
    fields: { type: 'json', description: 'Form fields array' },
    welcome_screens: { type: 'json', description: 'Welcome screens array' },
    thankyou_screens: { type: 'json', description: 'Thank you screens array' },
    _links: { type: 'json', description: 'Related resource links' },
    // Delete form outputs
    deleted: { type: 'boolean', description: 'Whether the form was deleted' },
    message: { type: 'string', description: 'Deletion confirmation message' },
    // File operation outputs
    fileUrl: { type: 'string', description: 'Downloaded file URL' },
    contentType: { type: 'string', description: 'File content type' },
    filename: { type: 'string', description: 'File name' },
    // Insights outputs
    form: { type: 'json', description: 'Form analytics and performance data' },
  },
  triggers: {
    enabled: true,
    available: ['typeform_webhook'],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: variables.ts]---
Location: sim-main/apps/sim/blocks/blocks/variables.ts

```typescript
import { VariableIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'

export const VariablesBlock: BlockConfig = {
  type: 'variables',
  name: 'Variables',
  description: 'Set workflow-scoped variables',
  longDescription:
    'Set workflow-scoped variables that can be accessed throughout the workflow using <variable.variableName> syntax. All Variables blocks share the same namespace, so later blocks can update previously set variables.',
  bgColor: '#8B5CF6',
  bestPractices: `
  - Variables are workflow-scoped and persist throughout execution (but not between executions)
  - Reference variables using <variable.variableName> syntax in any block
  - Variable names should be descriptive and follow camelCase or snake_case convention
  - Any Variables block can update existing variables by setting the same variable name
  - Variables do not appear as block outputs - they're accessed via the <variable.> prefix
  `,
  icon: VariableIcon,
  category: 'blocks',
  docsLink: 'https://docs.sim.ai/blocks/variables',
  subBlocks: [
    {
      id: 'variables',
      title: 'Variable Assignments',
      type: 'variables-input',
      description:
        'Select workflow variables and update their values during execution. Access them anywhere using <variable.variableName> syntax.',
      required: false,
    },
  ],
  tools: {
    access: [],
  },
  inputs: {
    variables: {
      type: 'json',
      description: 'Array of variable objects with name and value properties',
    },
  },
  outputs: {
    // Dynamic outputs - each assigned variable will be available as a top-level output
    // For example, if you assign variable1=5, you can reference it as <variables_block.variable1>
  },
}
```

--------------------------------------------------------------------------------

---[FILE: video_generator.ts]---
Location: sim-main/apps/sim/blocks/blocks/video_generator.ts

```typescript
import { VideoIcon } from '@/components/icons'
import { AuthMode, type BlockConfig } from '@/blocks/types'
import type { VideoBlockResponse } from '@/tools/video/types'

export const VideoGeneratorBlock: BlockConfig<VideoBlockResponse> = {
  type: 'video_generator',
  name: 'Video Generator',
  description: 'Generate videos from text using AI',
  authMode: AuthMode.ApiKey,
  longDescription:
    'Generate high-quality videos from text prompts using leading AI providers. Supports multiple models, aspect ratios, resolutions, and provider-specific features like world consistency, camera controls, and audio generation.',
  docsLink: 'https://docs.sim.ai/tools/video-generator',
  category: 'tools',
  bgColor: '#181C1E',
  icon: VideoIcon,

  subBlocks: [
    // Provider selection
    {
      id: 'provider',
      title: 'Provider',
      type: 'dropdown',
      options: [
        { label: 'Runway Gen-4', id: 'runway' },
        { label: 'Google Veo 3', id: 'veo' },
        { label: 'Luma Dream Machine', id: 'luma' },
        { label: 'MiniMax Hailuo', id: 'minimax' },
        { label: 'Fal.ai (Multi-Model)', id: 'falai' },
      ],
      value: () => 'runway',
      required: true,
    },

    // Note: Runway Gen-4 only supports Gen-4 Turbo for image-to-video (no model selection needed)

    // Google Veo model selection
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'veo' },
      options: [
        { label: 'Veo 3', id: 'veo-3' },
        { label: 'Veo 3 Fast', id: 'veo-3-fast' },
        { label: 'Veo 3.1', id: 'veo-3.1' },
      ],
      value: () => 'veo-3',
      required: false,
    },

    // Luma model selection
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'luma' },
      options: [{ label: 'Ray 2', id: 'ray-2' }],
      value: () => 'ray-2',
      required: false,
    },

    // MiniMax model and endpoint selection
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'minimax' },
      options: [{ label: 'Hailuo 2.3', id: 'hailuo-02' }],
      value: () => 'hailuo-02',
      required: false,
    },

    {
      id: 'endpoint',
      title: 'Quality Endpoint',
      type: 'dropdown',
      condition: { field: 'provider', value: 'minimax' },
      options: [
        { label: 'Pro', id: 'pro' },
        { label: 'Standard', id: 'standard' },
      ],
      value: () => 'standard',
      required: false,
    },

    // Fal.ai model selection
    {
      id: 'model',
      title: 'Model',
      type: 'dropdown',
      condition: { field: 'provider', value: 'falai' },
      options: [
        { label: 'Google Veo 3.1', id: 'veo-3.1' },
        { label: 'OpenAI Sora 2', id: 'sora-2' },
        { label: 'Kling 2.5 Turbo Pro', id: 'kling-2.5-turbo-pro' },
        { label: 'Kling 2.1 Pro', id: 'kling-2.1-pro' },
        { label: 'MiniMax Hailuo 2.3 Pro', id: 'minimax-hailuo-2.3-pro' },
        { label: 'MiniMax Hailuo 2.3 Standard', id: 'minimax-hailuo-2.3-standard' },
        { label: 'WAN 2.1', id: 'wan-2.1' },
        { label: 'LTXV 0.9.8', id: 'ltxv-0.9.8' },
      ],
      value: () => 'veo-3.1',
      required: true,
    },

    // Prompt input (required)
    {
      id: 'prompt',
      title: 'Prompt',
      type: 'long-input',
      placeholder: 'Describe the video you want to generate...',
      required: true,
    },

    // Duration selection - Runway (5 or 10 seconds)
    {
      id: 'duration',
      title: 'Duration (seconds)',
      type: 'dropdown',
      condition: { field: 'provider', value: 'runway' },
      options: [
        { label: '5', id: '5' },
        { label: '10', id: '10' },
      ],
      value: () => '5',
      required: false,
    },

    // Duration selection - Veo (4, 6, or 8 seconds)
    {
      id: 'duration',
      title: 'Duration (seconds)',
      type: 'dropdown',
      condition: { field: 'provider', value: 'veo' },
      options: [
        { label: '4', id: '4' },
        { label: '6', id: '6' },
        { label: '8', id: '8' },
      ],
      value: () => '8',
      required: false,
    },

    // Duration selection - Luma (5 or 9 seconds)
    {
      id: 'duration',
      title: 'Duration (seconds)',
      type: 'dropdown',
      condition: { field: 'provider', value: 'luma' },
      options: [
        { label: '5', id: '5' },
        { label: '9', id: '9' },
      ],
      value: () => '5',
      required: false,
    },

    // Duration selection - MiniMax (6 or 10 seconds)
    {
      id: 'duration',
      title: 'Duration (seconds)',
      type: 'dropdown',
      condition: { field: 'provider', value: 'minimax' },
      options: [
        { label: '6', id: '6' },
        { label: '10', id: '10' },
      ],
      value: () => '6',
      required: false,
    },

    // Duration selection - Fal.ai (only for Kling and MiniMax models)
    {
      id: 'duration',
      title: 'Duration (seconds)',
      type: 'dropdown',
      condition: {
        field: 'model',
        value: [
          'kling-2.5-turbo-pro',
          'kling-2.1-pro',
          'minimax-hailuo-2.3-pro',
          'minimax-hailuo-2.3-standard',
        ],
      },
      options: [
        { label: '5', id: '5' },
        { label: '8', id: '8' },
        { label: '10', id: '10' },
      ],
      value: () => '5',
      required: false,
    },

    // Aspect ratio selection - Veo (only 16:9 and 9:16)
    {
      id: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'dropdown',
      condition: { field: 'provider', value: 'veo' },
      options: [
        { label: '16:9', id: '16:9' },
        { label: '9:16', id: '9:16' },
      ],
      value: () => '16:9',
      required: false,
    },

    // Aspect ratio selection - Runway (includes 1:1)
    {
      id: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'dropdown',
      condition: { field: 'provider', value: 'runway' },
      options: [
        { label: '16:9', id: '16:9' },
        { label: '9:16', id: '9:16' },
        { label: '1:1', id: '1:1' },
      ],
      value: () => '16:9',
      required: false,
    },

    // Aspect ratio selection - Luma (includes 1:1)
    {
      id: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'dropdown',
      condition: { field: 'provider', value: 'luma' },
      options: [
        { label: '16:9', id: '16:9' },
        { label: '9:16', id: '9:16' },
        { label: '1:1', id: '1:1' },
      ],
      value: () => '16:9',
      required: false,
    },

    // Aspect ratio selection - Fal.ai (only for Kling and MiniMax models)
    {
      id: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'dropdown',
      condition: {
        field: 'model',
        value: [
          'kling-2.5-turbo-pro',
          'kling-2.1-pro',
          'minimax-hailuo-2.3-pro',
          'minimax-hailuo-2.3-standard',
        ],
      },
      options: [
        { label: '16:9', id: '16:9' },
        { label: '9:16', id: '9:16' },
      ],
      value: () => '16:9',
      required: false,
    },

    // Note: MiniMax aspect ratio is fixed at 16:9 (not configurable)

    // Note: Runway Gen-4 Turbo outputs at 720p natively (no resolution selector needed)

    // Resolution selection - Veo
    {
      id: 'resolution',
      title: 'Resolution',
      type: 'dropdown',
      condition: { field: 'provider', value: 'veo' },
      options: [
        { label: '720p', id: '720p' },
        { label: '1080p', id: '1080p' },
      ],
      value: () => '1080p',
      required: false,
    },

    // Resolution selection - Luma
    {
      id: 'resolution',
      title: 'Resolution',
      type: 'dropdown',
      condition: { field: 'provider', value: 'luma' },
      options: [
        { label: '540p', id: '540p' },
        { label: '720p', id: '720p' },
        { label: '1080p', id: '1080p' },
      ],
      value: () => '1080p',
      required: false,
    },

    // Note: MiniMax resolution is fixed per endpoint (Pro=1080p, Standard=768p)

    // Runway-specific: Visual reference (REQUIRED for Gen-4)
    {
      id: 'visualReference',
      title: 'Reference Image',
      type: 'file-upload',
      condition: { field: 'provider', value: 'runway' },
      placeholder: 'Upload reference image',
      mode: 'basic',
      multiple: false,
      required: true,
      acceptedTypes: '.jpg,.jpeg,.png,.webp',
    },

    // Luma-specific: Camera controls
    {
      id: 'cameraControl',
      title: 'Camera Controls',
      type: 'long-input',
      condition: { field: 'provider', value: 'luma' },
      placeholder: 'JSON: [{ "key": "pan_right" }, { "key": "zoom_in" }]',
      required: false,
    },

    // MiniMax-specific: Prompt optimizer
    {
      id: 'promptOptimizer',
      title: 'Prompt Optimizer',
      type: 'switch',
      condition: { field: 'provider', value: 'minimax' },
    },

    // API Key
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your provider API key',
      password: true,
      required: true,
    },
  ],

  tools: {
    access: ['video_runway', 'video_veo', 'video_luma', 'video_minimax', 'video_falai'],
    config: {
      tool: (params) => {
        // Select tool based on provider
        switch (params.provider) {
          case 'runway':
            return 'video_runway'
          case 'veo':
            return 'video_veo'
          case 'luma':
            return 'video_luma'
          case 'minimax':
            return 'video_minimax'
          case 'falai':
            return 'video_falai'
          default:
            return 'video_runway'
        }
      },
      params: (params) => ({
        provider: params.provider,
        apiKey: params.apiKey,
        model: params.model,
        endpoint: params.endpoint,
        prompt: params.prompt,
        duration: params.duration ? Number(params.duration) : undefined,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        visualReference: params.visualReference,
        consistencyMode: params.consistencyMode,
        stylePreset: params.stylePreset,
        promptOptimizer: params.promptOptimizer,
        cameraControl: params.cameraControl
          ? typeof params.cameraControl === 'string'
            ? JSON.parse(params.cameraControl)
            : params.cameraControl
          : undefined,
      }),
    },
  },

  inputs: {
    provider: {
      type: 'string',
      description: 'Video generation provider (runway, veo, luma, minimax)',
    },
    apiKey: { type: 'string', description: 'Provider API key' },
    model: {
      type: 'string',
      description: 'Provider-specific model',
    },
    endpoint: {
      type: 'string',
      description: 'Quality endpoint for MiniMax (pro, standard)',
    },
    prompt: { type: 'string', description: 'Text prompt for video generation' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    aspectRatio: {
      type: 'string',
      description: 'Aspect ratio (16:9, 9:16, 1:1) - not available for MiniMax',
    },
    resolution: {
      type: 'string',
      description: 'Video resolution - not available for MiniMax (fixed per endpoint)',
    },
    visualReference: { type: 'json', description: 'Reference image for Runway (UserFile)' },
    consistencyMode: {
      type: 'string',
      description: 'Consistency mode for Runway (character, object, style, location)',
    },
    stylePreset: { type: 'string', description: 'Style preset for Runway' },
    promptOptimizer: {
      type: 'boolean',
      description: 'Enable prompt optimization for MiniMax (default: true)',
    },
    cameraControl: {
      type: 'json',
      description: 'Camera controls for Luma (pan, zoom, tilt, truck, tracking)',
    },
  },

  outputs: {
    videoUrl: { type: 'string', description: 'Generated video URL' },
    videoFile: { type: 'json', description: 'Video file object with metadata' },
    duration: { type: 'number', description: 'Video duration in seconds' },
    width: { type: 'number', description: 'Video width in pixels' },
    height: { type: 'number', description: 'Video height in pixels' },
    provider: { type: 'string', description: 'Provider used' },
    model: { type: 'string', description: 'Model used' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: vision.ts]---
Location: sim-main/apps/sim/blocks/blocks/vision.ts

```typescript
import { EyeIcon } from '@/components/icons'
import type { BlockConfig } from '@/blocks/types'
import { AuthMode } from '@/blocks/types'
import type { VisionResponse } from '@/tools/vision/types'

export const VisionBlock: BlockConfig<VisionResponse> = {
  type: 'vision',
  name: 'Vision',
  description: 'Analyze images with vision models',
  authMode: AuthMode.ApiKey,
  longDescription: 'Integrate Vision into the workflow. Can analyze images with vision models.',
  docsLink: 'https://docs.sim.ai/tools/vision',
  category: 'tools',
  bgColor: '#4D5FFF',
  icon: EyeIcon,
  subBlocks: [
    // Image file upload (basic mode)
    {
      id: 'imageFile',
      title: 'Image File',
      type: 'file-upload',
      canonicalParamId: 'imageFile',
      placeholder: 'Upload an image file',
      mode: 'basic',
      multiple: false,
      required: false,
      acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp',
    },
    // Image file reference (advanced mode)
    {
      id: 'imageFileReference',
      title: 'Image File Reference',
      type: 'short-input',
      canonicalParamId: 'imageFile',
      placeholder: 'Reference an image from previous blocks',
      mode: 'advanced',
      required: false,
    },
    {
      id: 'imageUrl',
      title: 'Image URL (alternative)',
      type: 'short-input',
      placeholder: 'Or enter publicly accessible image URL',
      required: false,
    },
    {
      id: 'model',
      title: 'Vision Model',
      type: 'dropdown',
      options: [
        { label: 'gpt-4o', id: 'gpt-4o' },
        { label: 'claude-3-opus', id: 'claude-3-opus-20240229' },
        { label: 'claude-3-sonnet', id: 'claude-3-sonnet-20240229' },
      ],
      value: () => 'gpt-4o',
    },
    {
      id: 'prompt',
      title: 'Prompt',
      type: 'long-input',
      placeholder: 'Enter prompt for image analysis',
      required: true,
    },
    {
      id: 'apiKey',
      title: 'API Key',
      type: 'short-input',
      placeholder: 'Enter your API key',
      password: true,
      required: true,
    },
  ],
  tools: {
    access: ['vision_tool'],
  },
  inputs: {
    apiKey: { type: 'string', description: 'Provider API key' },
    imageUrl: { type: 'string', description: 'Image URL' },
    imageFile: { type: 'json', description: 'Image file (UserFile)' },
    imageFileReference: { type: 'json', description: 'Image file reference' },
    model: { type: 'string', description: 'Vision model' },
    prompt: { type: 'string', description: 'Analysis prompt' },
  },
  outputs: {
    content: { type: 'string', description: 'Analysis result' },
    model: { type: 'string', description: 'Model used' },
    tokens: { type: 'number', description: 'Token usage' },
  },
}
```

--------------------------------------------------------------------------------

````
