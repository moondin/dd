---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 771
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 771 of 933)

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

---[FILE: list_calls.ts]---
Location: sim-main/apps/sim/tools/twilio_voice/list_calls.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { TwilioListCallsOutput, TwilioListCallsParams } from '@/tools/twilio_voice/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('TwilioVoiceListCallsTool')

export const listCallsTool: ToolConfig<TwilioListCallsParams, TwilioListCallsOutput> = {
  id: 'twilio_voice_list_calls',
  name: 'Twilio Voice List Calls',
  description: 'Retrieve a list of calls made to and from an account.',
  version: '1.0.0',

  params: {
    accountSid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Account SID',
    },
    authToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Auth Token',
    },
    to: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by calls to this phone number',
    },
    from: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by calls from this phone number',
    },
    status: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by call status (queued, ringing, in-progress, completed, etc.)',
    },
    startTimeAfter: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter calls that started on or after this date (YYYY-MM-DD)',
    },
    startTimeBefore: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter calls that started on or before this date (YYYY-MM-DD)',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of records to return (max 1000, default 50)',
    },
  },

  request: {
    url: (params) => {
      if (!params.accountSid) {
        throw new Error('Twilio Account SID is required')
      }
      if (!params.accountSid.startsWith('AC')) {
        throw new Error(
          `Invalid Account SID format. Account SID must start with "AC" (you provided: ${params.accountSid.substring(0, 2)}...)`
        )
      }

      const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Calls.json`
      const queryParams = new URLSearchParams()

      if (params.to) queryParams.append('To', params.to)
      if (params.from) queryParams.append('From', params.from)
      if (params.status) queryParams.append('Status', params.status)
      if (params.startTimeAfter) queryParams.append('StartTime>', params.startTimeAfter)
      if (params.startTimeBefore) queryParams.append('StartTime<', params.startTimeBefore)
      if (params.pageSize) queryParams.append('PageSize', Number(params.pageSize).toString())

      const queryString = queryParams.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accountSid || !params.authToken) {
        throw new Error('Twilio credentials are required')
      }
      const authToken = Buffer.from(`${params.accountSid}:${params.authToken}`).toString('base64')
      return {
        Authorization: `Basic ${authToken}`,
      }
    },
  },

  transformResponse: async (response, params) => {
    const data = await response.json()

    logger.info('Twilio List Calls Response:', { total: data.calls?.length || 0 })

    if (data.error_code) {
      return {
        success: false,
        output: {
          success: false,
          calls: [],
          error: data.message || data.error_message || 'Failed to retrieve calls',
        },
        error: data.message || data.error_message || 'Failed to retrieve calls',
      }
    }

    const authToken = Buffer.from(`${params?.accountSid}:${params?.authToken}`).toString('base64')

    const calls = await Promise.all(
      (data.calls || []).map(async (call: any) => {
        let recordingSids: string[] = []
        if (call.subresource_uris?.recordings) {
          try {
            const recordingsUrl = `https://api.twilio.com${call.subresource_uris.recordings}`
            const recordingsResponse = await fetch(recordingsUrl, {
              method: 'GET',
              headers: { Authorization: `Basic ${authToken}` },
            })

            if (recordingsResponse.ok) {
              const recordingsData = await recordingsResponse.json()
              recordingSids = (recordingsData.recordings || []).map((rec: any) => rec.sid)
            }
          } catch (error) {
            logger.warn(`Failed to fetch recordings for call ${call.sid}:`, error)
          }
        }

        return {
          callSid: call.sid,
          from: call.from,
          to: call.to,
          status: call.status,
          direction: call.direction,
          duration: call.duration ? Number.parseInt(call.duration, 10) : null,
          price: call.price,
          priceUnit: call.price_unit,
          startTime: call.start_time,
          endTime: call.end_time,
          dateCreated: call.date_created,
          recordingSids,
        }
      })
    )

    logger.info('Transformed calls with recordings:', {
      totalCalls: calls.length,
      callsWithRecordings: calls.filter((c) => c.recordingSids.length > 0).length,
    })

    return {
      success: true,
      output: {
        success: true,
        calls,
        total: calls.length,
        page: data.page,
        pageSize: data.page_size,
      },
      error: undefined,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the calls were successfully retrieved' },
    calls: { type: 'array', description: 'Array of call objects' },
    total: { type: 'number', description: 'Total number of calls returned' },
    page: { type: 'number', description: 'Current page number' },
    pageSize: { type: 'number', description: 'Number of calls per page' },
    error: { type: 'string', description: 'Error message if retrieval failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: make_call.ts]---
Location: sim-main/apps/sim/tools/twilio_voice/make_call.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { convertSquareBracketsToTwiML } from '@/lib/webhooks/utils'
import type { TwilioCallOutput, TwilioMakeCallParams } from '@/tools/twilio_voice/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('TwilioVoiceMakeCallTool')

export const makeCallTool: ToolConfig<TwilioMakeCallParams, TwilioCallOutput> = {
  id: 'twilio_voice_make_call',
  name: 'Twilio Voice Make Call',
  description: 'Make an outbound phone call using Twilio Voice API.',
  version: '1.0.0',

  params: {
    to: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Phone number to call (E.164 format, e.g., +14155551234)',
    },
    from: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Your Twilio phone number to call from (E.164 format)',
    },
    url: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'URL that returns TwiML instructions for the call',
    },
    twiml: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'TwiML instructions to execute (alternative to URL). Use square brackets instead of angle brackets, e.g., [Response][Say]Hello[/Say][/Response]',
    },
    statusCallback: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Webhook URL for call status updates',
    },
    statusCallbackMethod: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'HTTP method for status callback (GET or POST)',
    },
    accountSid: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Account SID',
    },
    authToken: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Twilio Auth Token',
    },
    record: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to record the call',
    },
    recordingStatusCallback: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Webhook URL for recording status updates',
    },
    timeout: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Time to wait for answer before giving up (seconds, default: 60)',
    },
    machineDetection: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Answering machine detection: Enable or DetectMessageEnd',
    },
  },

  request: {
    url: (params) => {
      if (!params.accountSid) {
        throw new Error('Twilio Account SID is required')
      }
      if (!params.accountSid.startsWith('AC')) {
        throw new Error(
          `Invalid Account SID format. Account SID must start with "AC" (you provided: ${params.accountSid.substring(0, 2)}...)`
        )
      }
      return `https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Calls.json`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accountSid || !params.authToken) {
        throw new Error('Twilio credentials are required')
      }
      const authToken = Buffer.from(`${params.accountSid}:${params.authToken}`).toString('base64')
      return {
        Authorization: `Basic ${authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    },
    body: ((params) => {
      if (!params.to) {
        throw new Error('Destination phone number (to) is required')
      }
      if (!params.from) {
        throw new Error('Source phone number (from) is required')
      }
      if (!params.url && !params.twiml) {
        throw new Error('Either URL or TwiML is required to execute the call')
      }

      logger.info('Make call params:', {
        to: params.to,
        from: params.from,
        record: params.record,
        recordType: typeof params.record,
      })

      const formData = new URLSearchParams()
      formData.append('To', params.to)
      formData.append('From', params.from)

      if (params.url) {
        formData.append('Url', params.url)
      } else if (params.twiml) {
        const convertedTwiml = convertSquareBracketsToTwiML(params.twiml) || params.twiml
        formData.append('Twiml', convertedTwiml)
      }

      if (params.statusCallback) {
        formData.append('StatusCallback', params.statusCallback)
      }
      if (params.statusCallbackMethod) {
        formData.append('StatusCallbackMethod', params.statusCallbackMethod)
      }

      if (params.record === true) {
        logger.info('Enabling call recording')
        formData.append('Record', 'true')
      }

      if (params.recordingStatusCallback) {
        formData.append('RecordingStatusCallback', params.recordingStatusCallback)
      }
      if (params.timeout) {
        formData.append('Timeout', Number(params.timeout).toString())
      }
      if (params.machineDetection) {
        formData.append('MachineDetection', params.machineDetection)
      }

      const bodyString = formData.toString()
      logger.info('Final Twilio request body:', bodyString)

      return bodyString as any
    }) as (params: TwilioMakeCallParams) => Record<string, any>,
  },

  transformResponse: async (response) => {
    const data = await response.json()

    logger.info('Twilio Make Call Response:', data)

    if (data.error_code || data.status === 'failed') {
      return {
        success: false,
        output: {
          success: false,
          error: data.message || data.error_message || 'Call failed',
        },
        error: data.message || data.error_message || 'Call failed',
      }
    }

    return {
      success: true,
      output: {
        success: true,
        callSid: data.sid,
        status: data.status,
        direction: data.direction,
        from: data.from,
        to: data.to,
        duration: data.duration,
        price: data.price,
        priceUnit: data.price_unit,
      },
      error: undefined,
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the call was successfully initiated' },
    callSid: { type: 'string', description: 'Unique identifier for the call' },
    status: {
      type: 'string',
      description: 'Call status (queued, ringing, in-progress, completed, etc.)',
    },
    direction: { type: 'string', description: 'Call direction (outbound-api)' },
    from: { type: 'string', description: 'Phone number the call is from' },
    to: { type: 'string', description: 'Phone number the call is to' },
    duration: { type: 'number', description: 'Call duration in seconds' },
    price: { type: 'string', description: 'Cost of the call' },
    priceUnit: { type: 'string', description: 'Currency of the price' },
    error: { type: 'string', description: 'Error message if call failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/twilio_voice/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface TwilioMakeCallParams {
  to: string
  from: string
  url?: string
  twiml?: string
  statusCallback?: string
  statusCallbackMethod?: 'GET' | 'POST'
  statusCallbackEvent?: string[]
  accountSid: string
  authToken: string
  record?: boolean
  recordingStatusCallback?: string
  recordingStatusCallbackMethod?: 'GET' | 'POST'
  timeout?: number
  machineDetection?: 'Enable' | 'DetectMessageEnd'
  asyncAmd?: boolean
  asyncAmdStatusCallback?: string
}

export interface TwilioCallOutput extends ToolResponse {
  output: {
    success: boolean
    callSid?: string
    status?: string
    direction?: string
    from?: string
    to?: string
    duration?: number
    price?: string
    priceUnit?: string
    error?: string
  }
}

export interface TwilioGetRecordingParams {
  recordingSid: string
  accountSid: string
  authToken: string
}

export interface TwilioGetRecordingOutput extends ToolResponse {
  output: {
    success: boolean
    recordingSid?: string
    callSid?: string
    duration?: number
    status?: string
    channels?: number
    source?: string
    mediaUrl?: string
    price?: string
    priceUnit?: string
    uri?: string
    transcriptionText?: string
    transcriptionStatus?: string
    transcriptionPrice?: string
    transcriptionPriceUnit?: string
    error?: string
  }
}

export interface TwilioListCallsParams {
  accountSid: string
  authToken: string
  to?: string
  from?: string
  status?: string
  startTimeAfter?: string
  startTimeBefore?: string
  pageSize?: number
}

export interface TwilioListCallsOutput extends ToolResponse {
  output: {
    success: boolean
    calls?: Array<{
      callSid: string
      from: string
      to: string
      status: string
      direction: string
      duration: number | null
      price: string | null
      priceUnit: string
      startTime: string
      endTime: string | null
      dateCreated: string
      recordingSids: string[]
    }>
    total?: number
    page?: number
    pageSize?: number
    error?: string
  }
}
```

--------------------------------------------------------------------------------

---[FILE: create_form.ts]---
Location: sim-main/apps/sim/tools/typeform/create_form.ts

```typescript
import type { TypeformCreateFormParams, TypeformCreateFormResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const createFormTool: ToolConfig<TypeformCreateFormParams, TypeformCreateFormResponse> = {
  id: 'typeform_create_form',
  name: 'Typeform Create Form',
  description: 'Create a new form with fields and settings',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Form title',
    },
    type: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Form type (default: "form"). Options: "form", "quiz"',
    },
    workspaceId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Workspace ID to create the form in',
    },
    fields: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description:
        'Array of field objects defining the form structure. Each field needs: type, title, and optional properties/validations',
    },
    settings: {
      type: 'json',
      required: false,
      visibility: 'user-only',
      description: 'Form settings object (language, progress_bar, etc.)',
    },
    themeId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Theme ID to apply to the form',
    },
  },

  request: {
    url: () => 'https://api.typeform.com/forms',
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
    body: (params: TypeformCreateFormParams) => {
      const body: any = {
        title: params.title,
      }

      if (params.type) {
        body.type = params.type
      }

      if (params.workspaceId) {
        body.workspace = {
          href: `https://api.typeform.com/workspaces/${params.workspaceId}`,
        }
      }

      if (params.fields) {
        body.fields = params.fields
      }

      if (params.settings) {
        body.settings = params.settings
      }

      if (params.themeId) {
        body.theme = {
          href: `https://api.typeform.com/themes/${params.themeId}`,
        }
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    id: {
      type: 'string',
      description: 'Created form unique identifier',
    },
    title: {
      type: 'string',
      description: 'Form title',
    },
    type: {
      type: 'string',
      description: 'Form type',
    },
    fields: {
      type: 'array',
      description: 'Array of created form fields',
    },
    _links: {
      type: 'object',
      description: 'Related resource links including public form URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: delete_form.ts]---
Location: sim-main/apps/sim/tools/typeform/delete_form.ts

```typescript
import type { TypeformDeleteFormParams, TypeformDeleteFormResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const deleteFormTool: ToolConfig<TypeformDeleteFormParams, TypeformDeleteFormResponse> = {
  id: 'typeform_delete_form',
  name: 'Typeform Delete Form',
  description: 'Permanently delete a form and all its responses',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Form unique identifier to delete',
    },
  },

  request: {
    url: (params: TypeformDeleteFormParams) => {
      return `https://api.typeform.com/forms/${params.formId}`
    },
    method: 'DELETE',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    if (response.status === 204) {
      return {
        success: true,
        output: {
          deleted: true,
          message: 'Form successfully deleted',
        },
      }
    }

    const data = await response.json().catch(() => ({}))

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    deleted: {
      type: 'boolean',
      description: 'Whether the form was successfully deleted',
    },
    message: {
      type: 'string',
      description: 'Deletion confirmation message',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: files.ts]---
Location: sim-main/apps/sim/tools/typeform/files.ts

```typescript
import type { TypeformFilesParams, TypeformFilesResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const filesTool: ToolConfig<TypeformFilesParams, TypeformFilesResponse> = {
  id: 'typeform_files',
  name: 'Typeform Files',
  description: 'Download files uploaded in Typeform responses',
  version: '1.0.0',

  params: {
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform form ID',
    },
    responseId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Response ID containing the files',
    },
    fieldId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Unique ID of the file upload field',
    },
    filename: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Filename of the uploaded file',
    },
    inline: {
      type: 'boolean',
      required: false,
      visibility: 'user-only',
      description: 'Whether to request the file with inline Content-Disposition',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
  },

  request: {
    url: (params: TypeformFilesParams) => {
      const encodedFormId = encodeURIComponent(params.formId)
      const encodedResponseId = encodeURIComponent(params.responseId)
      const encodedFieldId = encodeURIComponent(params.fieldId)
      const encodedFilename = encodeURIComponent(params.filename)

      let url = `https://api.typeform.com/forms/${encodedFormId}/responses/${encodedResponseId}/fields/${encodedFieldId}/files/${encodedFilename}`

      // Add the inline parameter if provided
      if (params.inline !== undefined) {
        url += `?inline=${params.inline}`
      }

      return url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response, params?: TypeformFilesParams) => {
    // For file downloads, we get the file directly
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition') || ''

    // Try to extract filename from content-disposition if possible
    let filename = ''
    const filenameMatch = contentDisposition.match(/filename="(.+?)"/)
    if (filenameMatch?.[1]) {
      filename = filenameMatch[1]
    }

    // Get file URL from the response URL or construct it from parameters if not available
    let fileUrl = response.url

    // If the response URL is not available (common in test environments), construct it from params
    if (!fileUrl && params) {
      const encodedFormId = encodeURIComponent(params.formId)
      const encodedResponseId = encodeURIComponent(params.responseId)
      const encodedFieldId = encodeURIComponent(params.fieldId)
      const encodedFilename = encodeURIComponent(params.filename)

      fileUrl = `https://api.typeform.com/forms/${encodedFormId}/responses/${encodedResponseId}/fields/${encodedFieldId}/files/${encodedFilename}`

      if (params.inline !== undefined) {
        fileUrl += `?inline=${params.inline}`
      }
    }

    return {
      success: true,
      output: {
        fileUrl: fileUrl || '',
        contentType,
        filename,
      },
    }
  },

  outputs: {
    fileUrl: { type: 'string', description: 'Direct download URL for the uploaded file' },
    contentType: { type: 'string', description: 'MIME type of the uploaded file' },
    filename: { type: 'string', description: 'Original filename of the uploaded file' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get_form.ts]---
Location: sim-main/apps/sim/tools/typeform/get_form.ts

```typescript
import type { TypeformGetFormParams, TypeformGetFormResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const getFormTool: ToolConfig<TypeformGetFormParams, TypeformGetFormResponse> = {
  id: 'typeform_get_form',
  name: 'Typeform Get Form',
  description: 'Retrieve complete details and structure of a specific form',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Form unique identifier',
    },
  },

  request: {
    url: (params: TypeformGetFormParams) => {
      return `https://api.typeform.com/forms/${params.formId}`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    id: {
      type: 'string',
      description: 'Form unique identifier',
    },
    title: {
      type: 'string',
      description: 'Form title',
    },
    type: {
      type: 'string',
      description: 'Form type (form, quiz, etc.)',
    },
    settings: {
      type: 'object',
      description: 'Form settings including language, progress bar, etc.',
    },
    theme: {
      type: 'object',
      description: 'Theme reference',
    },
    workspace: {
      type: 'object',
      description: 'Workspace reference',
    },
    fields: {
      type: 'array',
      description: 'Array of form fields/questions',
    },
    welcome_screens: {
      type: 'array',
      description: 'Array of welcome screens',
    },
    thankyou_screens: {
      type: 'array',
      description: 'Array of thank you screens',
    },
    _links: {
      type: 'object',
      description: 'Related resource links including public form URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/typeform/index.ts

```typescript
import { createFormTool } from '@/tools/typeform/create_form'
import { deleteFormTool } from '@/tools/typeform/delete_form'
import { filesTool } from '@/tools/typeform/files'
import { getFormTool } from '@/tools/typeform/get_form'
import { insightsTool } from '@/tools/typeform/insights'
import { listFormsTool } from '@/tools/typeform/list_forms'
import { responsesTool } from '@/tools/typeform/responses'
import { updateFormTool } from '@/tools/typeform/update_form'

export const typeformResponsesTool = responsesTool
export const typeformFilesTool = filesTool
export const typeformInsightsTool = insightsTool
export const typeformListFormsTool = listFormsTool
export const typeformGetFormTool = getFormTool
export const typeformCreateFormTool = createFormTool
export const typeformUpdateFormTool = updateFormTool
export const typeformDeleteFormTool = deleteFormTool
```

--------------------------------------------------------------------------------

---[FILE: insights.ts]---
Location: sim-main/apps/sim/tools/typeform/insights.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { TypeformInsightsParams, TypeformInsightsResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('TypeformInsightsTool')

export const insightsTool: ToolConfig<TypeformInsightsParams, TypeformInsightsResponse> = {
  id: 'typeform_insights',
  name: 'Typeform Insights',
  description: 'Retrieve insights and analytics for Typeform forms',
  version: '1.0.0',

  params: {
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform form ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
  },

  request: {
    url: (params: TypeformInsightsParams) => {
      const encodedFormId = encodeURIComponent(params.formId)
      return `https://api.typeform.com/insights/${encodedFormId}/summary`
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()
    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dropoffs: {
            type: 'number',
            description: 'Number of users who dropped off at this field',
          },
          id: { type: 'string', description: 'Unique field ID' },
          label: { type: 'string', description: 'Field label' },
          ref: { type: 'string', description: 'Field reference name' },
          title: { type: 'string', description: 'Field title/question' },
          type: { type: 'string', description: 'Field type (e.g., short_text, multiple_choice)' },
          views: { type: 'number', description: 'Number of times this field was viewed' },
        },
      },
      description: 'Analytics data for individual form fields',
    },
    form: {
      type: 'object',
      properties: {
        platforms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              average_time: {
                type: 'number',
                description: 'Average completion time for this platform',
              },
              completion_rate: { type: 'number', description: 'Completion rate for this platform' },
              platform: { type: 'string', description: 'Platform name (e.g., desktop, mobile)' },
              responses_count: {
                type: 'number',
                description: 'Number of responses from this platform',
              },
              total_visits: { type: 'number', description: 'Total visits from this platform' },
              unique_visits: { type: 'number', description: 'Unique visits from this platform' },
            },
          },
          description: 'Platform-specific analytics data',
        },
        summary: {
          type: 'object',
          properties: {
            average_time: { type: 'number', description: 'Overall average completion time' },
            completion_rate: { type: 'number', description: 'Overall completion rate' },
            responses_count: { type: 'number', description: 'Total number of responses' },
            total_visits: { type: 'number', description: 'Total number of visits' },
            unique_visits: { type: 'number', description: 'Total number of unique visits' },
          },
          description: 'Overall form performance summary',
        },
      },
      description: 'Form-level analytics and performance data',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: list_forms.ts]---
Location: sim-main/apps/sim/tools/typeform/list_forms.ts

```typescript
import type { TypeformListFormsParams, TypeformListFormsResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const listFormsTool: ToolConfig<TypeformListFormsParams, TypeformListFormsResponse> = {
  id: 'typeform_list_forms',
  name: 'Typeform List Forms',
  description: 'Retrieve a list of all forms in your Typeform account',
  version: '1.0.0',

  params: {
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    search: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Search query to filter forms by title',
    },
    page: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Page number (default: 1)',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of forms per page (default: 10, max: 200)',
    },
    workspaceId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter forms by workspace ID',
    },
  },

  request: {
    url: (params: TypeformListFormsParams) => {
      const url = 'https://api.typeform.com/forms'
      const queryParams = []

      if (params.search) {
        queryParams.push(`search=${encodeURIComponent(params.search)}`)
      }

      if (params.page) {
        queryParams.push(`page=${Number(params.page)}`)
      }

      if (params.pageSize) {
        queryParams.push(`page_size=${Number(params.pageSize)}`)
      }

      if (params.workspaceId) {
        queryParams.push(`workspace_id=${encodeURIComponent(params.workspaceId)}`)
      }

      return queryParams.length > 0 ? `${url}?${queryParams.join('&')}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    total_items: {
      type: 'number',
      description: 'Total number of forms in the account',
    },
    page_count: {
      type: 'number',
      description: 'Total number of pages available',
    },
    items: {
      type: 'array',
      description:
        'Array of form objects with id, title, created_at, last_updated_at, settings, theme, and _links',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: responses.ts]---
Location: sim-main/apps/sim/tools/typeform/responses.ts

```typescript
import type { TypeformResponsesParams, TypeformResponsesResponse } from '@/tools/typeform/types'
import type { ToolConfig } from '@/tools/types'

export const responsesTool: ToolConfig<TypeformResponsesParams, TypeformResponsesResponse> = {
  id: 'typeform_responses',
  name: 'Typeform Responses',
  description: 'Retrieve form responses from Typeform',
  version: '1.0.0',

  params: {
    formId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform form ID',
    },
    apiKey: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'Typeform Personal Access Token',
    },
    pageSize: {
      type: 'number',
      required: false,
      visibility: 'user-only',
      description: 'Number of responses to retrieve (default: 25)',
    },
    since: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Retrieve responses submitted after this date (ISO 8601 format)',
    },
    until: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Retrieve responses submitted before this date (ISO 8601 format)',
    },
    completed: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Filter by completion status (true/false)',
    },
  },

  request: {
    url: (params: TypeformResponsesParams) => {
      const url = `https://api.typeform.com/forms/${params.formId}/responses`

      const queryParams = []

      if (params.pageSize) {
        queryParams.push(`page_size=${Number(params.pageSize)}`)
      }

      if (params.since) {
        queryParams.push(`since=${encodeURIComponent(params.since)}`)
      }

      if (params.until) {
        queryParams.push(`until=${encodeURIComponent(params.until)}`)
      }

      if (params.completed && params.completed !== 'all') {
        queryParams.push(`completed=${params.completed}`)
      }

      return queryParams.length > 0 ? `${url}?${queryParams.join('&')}` : url
    },
    method: 'GET',
    headers: (params) => ({
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    return {
      success: true,
      output: data,
    }
  },

  outputs: {
    total_items: {
      type: 'number',
      description: 'Total number of responses',
    },
    page_count: {
      type: 'number',
      description: 'Total number of pages available',
    },
    items: {
      type: 'array',
      description:
        'Array of response objects with response_id, submitted_at, answers, and metadata',
    },
  },
}
```

--------------------------------------------------------------------------------

````
