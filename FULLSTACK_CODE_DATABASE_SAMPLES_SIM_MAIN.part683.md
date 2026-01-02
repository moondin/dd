---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 683
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 683 of 933)

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

---[FILE: append.ts]---
Location: sim-main/apps/sim/tools/google_sheets/append.ts

```typescript
import type {
  GoogleSheetsAppendResponse,
  GoogleSheetsToolParams,
} from '@/tools/google_sheets/types'
import type { ToolConfig } from '@/tools/types'

export const appendTool: ToolConfig<GoogleSheetsToolParams, GoogleSheetsAppendResponse> = {
  id: 'google_sheets_append',
  name: 'Append to Google Sheets',
  description: 'Append data to the end of a Google Sheets spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-sheets',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Sheets API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the spreadsheet to append to',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The A1 notation range to append after (e.g. "Sheet1", "Sheet1!A:D")',
    },
    values: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The data to append as a 2D array (e.g. [["Alice", 30], ["Bob", 25]]) or array of objects.',
    },
    valueInputOption: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The format of the data to append',
    },
    insertDataOption: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'How to insert the data (OVERWRITE or INSERT_ROWS)',
    },
    includeValuesInResponse: {
      type: 'boolean',
      required: false,
      visibility: 'hidden',
      description: 'Whether to include the appended values in the response',
    },
  },

  request: {
    url: (params) => {
      // If range is not provided, use a default range for the first sheet
      const range = params.range || 'Sheet1'

      const url = new URL(
        `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${encodeURIComponent(range)}:append`
      )

      // Default to USER_ENTERED if not specified
      const valueInputOption = params.valueInputOption || 'USER_ENTERED'
      url.searchParams.append('valueInputOption', valueInputOption)

      // Default to INSERT_ROWS if not specified
      if (params.insertDataOption) {
        url.searchParams.append('insertDataOption', params.insertDataOption)
      }

      if (params.includeValuesInResponse) {
        url.searchParams.append('includeValuesInResponse', 'true')
      }

      return url.toString()
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let processedValues: any = params.values || []

      // Handle case where values might be a string (potentially JSON string)
      if (typeof processedValues === 'string') {
        try {
          // Try to parse it as JSON
          processedValues = JSON.parse(processedValues)
        } catch (_error) {
          // If the input contains literal newlines causing JSON parse to fail,
          // try a more robust approach
          try {
            // Replace literal newlines with escaped newlines for JSON parsing
            const sanitizedInput = (processedValues as string)
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t')

            // Try to parse again with sanitized input
            processedValues = JSON.parse(sanitizedInput)
          } catch (_secondError) {
            // If all parsing attempts fail, wrap as a single cell value
            processedValues = [[processedValues]]
          }
        }
      }

      // New logic to handle array of objects
      if (
        Array.isArray(processedValues) &&
        processedValues.length > 0 &&
        typeof processedValues[0] === 'object' &&
        !Array.isArray(processedValues[0])
      ) {
        // It's an array of objects

        // First, extract all unique keys from all objects to create headers
        const allKeys = new Set<string>()
        processedValues.forEach((obj: any) => {
          if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach((key) => allKeys.add(key))
          }
        })
        const headers = Array.from(allKeys)

        // Then create rows with object values in the order of headers
        const rows = processedValues.map((obj: any) => {
          if (!obj || typeof obj !== 'object') {
            // Handle non-object items by creating an array with empty values
            return Array(headers.length).fill('')
          }
          return headers.map((key) => {
            const value = obj[key]
            // Handle nested objects/arrays by converting to JSON string
            if (value !== null && typeof value === 'object') {
              return JSON.stringify(value)
            }
            return value === undefined ? '' : value
          })
        })

        // Add headers as the first row, then add data rows
        processedValues = [headers, ...rows]
      }
      // Continue with existing logic for other array types
      else if (!Array.isArray(processedValues)) {
        processedValues = [[String(processedValues)]]
      } else if (!processedValues.every((item: any) => Array.isArray(item))) {
        // If it's an array but not all elements are arrays, wrap each element
        processedValues = (processedValues as any[]).map((row: any) =>
          Array.isArray(row) ? row : [String(row)]
        )
      }

      const body: Record<string, any> = {
        majorDimension: params.majorDimension || 'ROWS',
        values: processedValues,
      }

      // Only include range if it's provided
      if (params.range) {
        body.range = params.range
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract spreadsheet ID from the URL (guard if url is missing)
    const urlParts = typeof response.url === 'string' ? response.url.split('/spreadsheets/') : []
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Create a simple metadata object with just the ID and URL
    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }

    const result = {
      success: true,
      output: {
        tableRange: data.tableRange || '',
        updatedRange: data.updates?.updatedRange || '',
        updatedRows: data.updates?.updatedRows || 0,
        updatedColumns: data.updates?.updatedColumns || 0,
        updatedCells: data.updates?.updatedCells || 0,
        metadata: {
          spreadsheetId: metadata.spreadsheetId,
          spreadsheetUrl: metadata.spreadsheetUrl,
        },
      },
    }

    return result
  },

  outputs: {
    tableRange: { type: 'string', description: 'Range of the table where data was appended' },
    updatedRange: { type: 'string', description: 'Range of cells that were updated' },
    updatedRows: { type: 'number', description: 'Number of rows updated' },
    updatedColumns: { type: 'number', description: 'Number of columns updated' },
    updatedCells: { type: 'number', description: 'Number of cells updated' },
    metadata: { type: 'json', description: 'Spreadsheet metadata including ID and URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/google_sheets/index.ts

```typescript
import { appendTool } from '@/tools/google_sheets/append'
import { readTool } from '@/tools/google_sheets/read'
import { updateTool } from '@/tools/google_sheets/update'
import { writeTool } from '@/tools/google_sheets/write'

export const googleSheetsReadTool = readTool
export const googleSheetsWriteTool = writeTool
export const googleSheetsUpdateTool = updateTool
export const googleSheetsAppendTool = appendTool
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/google_sheets/read.ts

```typescript
import type { GoogleSheetsReadResponse, GoogleSheetsToolParams } from '@/tools/google_sheets/types'
import type { ToolConfig } from '@/tools/types'

export const readTool: ToolConfig<GoogleSheetsToolParams, GoogleSheetsReadResponse> = {
  id: 'google_sheets_read',
  name: 'Read from Google Sheets',
  description: 'Read data from a Google Sheets spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-sheets',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Sheets API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The ID of the spreadsheet (found in the URL: docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit).',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The A1 notation range to read (e.g. "Sheet1!A1:D10", "A1:B5"). Defaults to first sheet A1:Z1000 if not specified.',
    },
  },

  request: {
    url: (params) => {
      // Ensure spreadsheetId is valid
      const spreadsheetId = params.spreadsheetId?.trim()
      if (!spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }

      // If no range is provided, default to the first sheet without hardcoding the title
      // Using A1 notation without a sheet name targets the first sheet (per Sheets API)
      // Keep a generous column/row bound to avoid huge payloads
      if (!params.range) {
        const defaultRange = 'A1:Z1000'
        return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${defaultRange}`
      }

      // Otherwise, get values from the specified range
      return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(params.range)}`
    },
    method: 'GET',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract spreadsheet ID from the URL (guard if url is missing)
    const urlParts = typeof response.url === 'string' ? response.url.split('/spreadsheets/') : []
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Create a simple metadata object with just the ID and URL
    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }

    // Process the values response
    const result: GoogleSheetsReadResponse = {
      success: true,
      output: {
        data: {
          range: data.range || '',
          values: data.values || [],
        },
        metadata: {
          spreadsheetId: metadata.spreadsheetId,
          spreadsheetUrl: metadata.spreadsheetUrl,
        },
      },
    }

    return result
  },

  outputs: {
    data: { type: 'json', description: 'Sheet data including range and cell values' },
    metadata: { type: 'json', description: 'Spreadsheet metadata including ID and URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/google_sheets/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface GoogleSheetsRange {
  sheetId?: number
  sheetName?: string
  range: string
  values: any[][]
}

export interface GoogleSheetsMetadata {
  spreadsheetId: string
  spreadsheetUrl?: string
  title?: string
  sheets?: {
    sheetId: number
    title: string
    index: number
    rowCount?: number
    columnCount?: number
  }[]
}

export interface GoogleSheetsReadResponse extends ToolResponse {
  output: {
    data: GoogleSheetsRange
    metadata: GoogleSheetsMetadata
  }
}

export interface GoogleSheetsWriteResponse extends ToolResponse {
  output: {
    updatedRange: string
    updatedRows: number
    updatedColumns: number
    updatedCells: number
    metadata: GoogleSheetsMetadata
  }
}

export interface GoogleSheetsUpdateResponse extends ToolResponse {
  output: {
    updatedRange: string
    updatedRows: number
    updatedColumns: number
    updatedCells: number
    metadata: GoogleSheetsMetadata
  }
}

export interface GoogleSheetsAppendResponse extends ToolResponse {
  output: {
    tableRange: string
    updatedRange: string
    updatedRows: number
    updatedColumns: number
    updatedCells: number
    metadata: GoogleSheetsMetadata
  }
}

export interface GoogleSheetsToolParams {
  accessToken: string
  spreadsheetId: string
  range?: string
  values?: any[][]
  valueInputOption?: 'RAW' | 'USER_ENTERED'
  insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS'
  includeValuesInResponse?: boolean
  responseValueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA'
  majorDimension?: 'ROWS' | 'COLUMNS'
}

export type GoogleSheetsResponse =
  | GoogleSheetsReadResponse
  | GoogleSheetsWriteResponse
  | GoogleSheetsUpdateResponse
  | GoogleSheetsAppendResponse
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: sim-main/apps/sim/tools/google_sheets/update.ts

```typescript
import type {
  GoogleSheetsToolParams,
  GoogleSheetsUpdateResponse,
} from '@/tools/google_sheets/types'
import type { ToolConfig } from '@/tools/types'

export const updateTool: ToolConfig<GoogleSheetsToolParams, GoogleSheetsUpdateResponse> = {
  id: 'google_sheets_update',
  name: 'Update Google Sheets',
  description: 'Update data in a Google Sheets spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-sheets',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Sheets API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the spreadsheet to update',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The A1 notation range to update (e.g. "Sheet1!A1:D10", "A1:B5")',
    },
    values: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The data to update as a 2D array (e.g. [["Name", "Age"], ["Alice", 30]]) or array of objects.',
    },
    valueInputOption: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The format of the data to update',
    },
    includeValuesInResponse: {
      type: 'boolean',
      required: false,
      visibility: 'hidden',
      description: 'Whether to include the updated values in the response',
    },
  },

  request: {
    url: (params) => {
      // If range is not provided, use a default range for the first sheet, second row to preserve headers
      const range = params.range || 'Sheet1!A2'

      const url = new URL(
        `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${encodeURIComponent(range)}`
      )

      // Default to USER_ENTERED if not specified
      const valueInputOption = params.valueInputOption || 'USER_ENTERED'
      url.searchParams.append('valueInputOption', valueInputOption)

      if (params.includeValuesInResponse) {
        url.searchParams.append('includeValuesInResponse', 'true')
      }

      return url.toString()
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let processedValues: any = params.values || []

      // Minimal shape enforcement: Google requires a 2D array
      if (!Array.isArray(processedValues)) {
        processedValues = [[processedValues]]
      } else if (!processedValues.every((item: any) => Array.isArray(item))) {
        processedValues = (processedValues as any[]).map((row: any) =>
          Array.isArray(row) ? row : [row]
        )
      }

      // Handle array of objects (existing behavior)
      if (
        Array.isArray(processedValues) &&
        processedValues.length > 0 &&
        typeof processedValues[0] === 'object' &&
        !Array.isArray(processedValues[0])
      ) {
        const allKeys = new Set<string>()
        processedValues.forEach((obj: any) => {
          if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach((key) => allKeys.add(key))
          }
        })
        const headers = Array.from(allKeys)

        const rows = processedValues.map((obj: any) => {
          if (!obj || typeof obj !== 'object') {
            return Array(headers.length).fill('')
          }
          return headers.map((key) => {
            const value = obj[key]
            if (value !== null && typeof value === 'object') {
              return JSON.stringify(value)
            }
            return value === undefined ? '' : value
          })
        })

        processedValues = [headers, ...rows]
      }

      const body: Record<string, any> = {
        majorDimension: params.majorDimension || 'ROWS',
        values: processedValues,
      }
      if (params.range) {
        body.range = params.range
      }
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract spreadsheet ID from the URL (guard if url is missing)
    const urlParts = typeof response.url === 'string' ? response.url.split('/spreadsheets/') : []
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Create a simple metadata object with just the ID and URL
    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }

    const result = {
      success: true,
      output: {
        updatedRange: data.updatedRange,
        updatedRows: data.updatedRows,
        updatedColumns: data.updatedColumns,
        updatedCells: data.updatedCells,
        metadata: {
          spreadsheetId: metadata.spreadsheetId,
          spreadsheetUrl: metadata.spreadsheetUrl,
        },
      },
    }

    return result
  },

  outputs: {
    updatedRange: { type: 'string', description: 'Range of cells that were updated' },
    updatedRows: { type: 'number', description: 'Number of rows updated' },
    updatedColumns: { type: 'number', description: 'Number of columns updated' },
    updatedCells: { type: 'number', description: 'Number of cells updated' },
    metadata: { type: 'json', description: 'Spreadsheet metadata including ID and URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/google_sheets/write.ts

```typescript
import type { GoogleSheetsToolParams, GoogleSheetsWriteResponse } from '@/tools/google_sheets/types'
import type { ToolConfig } from '@/tools/types'

export const writeTool: ToolConfig<GoogleSheetsToolParams, GoogleSheetsWriteResponse> = {
  id: 'google_sheets_write',
  name: 'Write to Google Sheets',
  description: 'Write data to a Google Sheets spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-sheets',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Sheets API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The ID of the spreadsheet',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The A1 notation range to write to (e.g. "Sheet1!A1:D10", "A1:B5")',
    },
    values: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The data to write as a 2D array (e.g. [["Name", "Age"], ["Alice", 30], ["Bob", 25]]) or array of objects.',
    },
    valueInputOption: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The format of the data to write',
    },
    includeValuesInResponse: {
      type: 'boolean',
      required: false,
      visibility: 'hidden',
      description: 'Whether to include the written values in the response',
    },
  },

  request: {
    url: (params) => {
      // If range is not provided, use a default range for the first sheet, second row to preserve headers
      const range = params.range || 'Sheet1!A2'

      const url = new URL(
        `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${encodeURIComponent(range)}`
      )

      // Default to USER_ENTERED if not specified
      const valueInputOption = params.valueInputOption || 'USER_ENTERED'
      url.searchParams.append('valueInputOption', valueInputOption)

      if (params.includeValuesInResponse) {
        url.searchParams.append('includeValuesInResponse', 'true')
      }

      return url.toString()
    },
    method: 'PUT',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let processedValues: any = params.values || []

      // Handle array of objects
      if (
        Array.isArray(processedValues) &&
        processedValues.length > 0 &&
        typeof processedValues[0] === 'object' &&
        !Array.isArray(processedValues[0])
      ) {
        // It's an array of objects

        // First, extract all unique keys from all objects to create headers
        const allKeys = new Set<string>()
        processedValues.forEach((obj: any) => {
          if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach((key) => allKeys.add(key))
          }
        })
        const headers = Array.from(allKeys)

        // Then create rows with object values in the order of headers
        const rows = processedValues.map((obj: any) => {
          if (!obj || typeof obj !== 'object') {
            // Handle non-object items by creating an array with empty values
            return Array(headers.length).fill('')
          }
          return headers.map((key) => {
            const value = obj[key]
            // Handle nested objects/arrays by converting to JSON string
            if (value !== null && typeof value === 'object') {
              return JSON.stringify(value)
            }
            return value === undefined ? '' : value
          })
        })

        // Add headers as the first row, then add data rows
        processedValues = [headers, ...rows]
      }

      const body: Record<string, any> = {
        majorDimension: params.majorDimension || 'ROWS',
        values: processedValues,
      }

      // Only include range if it's provided
      if (params.range) {
        body.range = params.range
      }

      return body
    },
  },

  transformResponse: async (response: Response) => {
    const data = await response.json()

    // Extract spreadsheet ID from the URL (guard if url is missing)
    const urlParts = typeof response.url === 'string' ? response.url.split('/spreadsheets/') : []
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Create a simple metadata object with just the ID and URL
    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }

    const result = {
      success: true,
      output: {
        updatedRange: data.updatedRange,
        updatedRows: data.updatedRows,
        updatedColumns: data.updatedColumns,
        updatedCells: data.updatedCells,
        metadata: {
          spreadsheetId: metadata.spreadsheetId,
          spreadsheetUrl: metadata.spreadsheetUrl,
        },
      },
    }

    return result
  },

  outputs: {
    updatedRange: { type: 'string', description: 'Range of cells that were updated' },
    updatedRows: { type: 'number', description: 'Number of rows updated' },
    updatedColumns: { type: 'number', description: 'Number of columns updated' },
    updatedCells: { type: 'number', description: 'Number of cells updated' },
    metadata: { type: 'json', description: 'Spreadsheet metadata including ID and URL' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_image.ts]---
Location: sim-main/apps/sim/tools/google_slides/add_image.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesAddImageTool')

interface AddImageParams {
  accessToken: string
  presentationId: string
  pageObjectId: string
  imageUrl: string
  width?: number
  height?: number
  positionX?: number
  positionY?: number
}

interface AddImageResponse {
  success: boolean
  output: {
    imageId: string
    metadata: {
      presentationId: string
      pageObjectId: string
      imageUrl: string
      url: string
    }
  }
}

// EMU (English Metric Units) conversion: 1 inch = 914400 EMU, 1 pt = 12700 EMU
const PT_TO_EMU = 12700

export const addImageTool: ToolConfig<AddImageParams, AddImageResponse> = {
  id: 'google_slides_add_image',
  name: 'Add Image to Google Slides',
  description: 'Insert an image into a specific slide in a Google Slides presentation',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      description: 'The ID of the presentation',
    },
    pageObjectId: {
      type: 'string',
      required: true,
      description: 'The object ID of the slide/page to add the image to',
    },
    imageUrl: {
      type: 'string',
      required: true,
      description: 'The publicly accessible URL of the image (must be PNG, JPEG, or GIF, max 50MB)',
    },
    width: {
      type: 'number',
      required: false,
      description: 'Width of the image in points (default: 300)',
    },
    height: {
      type: 'number',
      required: false,
      description: 'Height of the image in points (default: 200)',
    },
    positionX: {
      type: 'number',
      required: false,
      description: 'X position from the left edge in points (default: 100)',
    },
    positionY: {
      type: 'number',
      required: false,
      description: 'Y position from the top edge in points (default: 100)',
    },
  },

  request: {
    url: (params) => {
      const presentationId = params.presentationId?.trim()
      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }
      return `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      const pageObjectId = params.pageObjectId?.trim()
      const imageUrl = params.imageUrl?.trim()

      if (!pageObjectId) {
        throw new Error('Page Object ID is required')
      }
      if (!imageUrl) {
        throw new Error('Image URL is required')
      }

      // Generate a unique object ID for the new image
      const imageObjectId = `image_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Convert points to EMU (default sizes if not specified)
      const widthEmu = (params.width || 300) * PT_TO_EMU
      const heightEmu = (params.height || 200) * PT_TO_EMU
      const translateX = (params.positionX || 100) * PT_TO_EMU
      const translateY = (params.positionY || 100) * PT_TO_EMU

      return {
        requests: [
          {
            createImage: {
              objectId: imageObjectId,
              url: imageUrl,
              elementProperties: {
                pageObjectId: pageObjectId,
                size: {
                  width: {
                    magnitude: widthEmu,
                    unit: 'EMU',
                  },
                  height: {
                    magnitude: heightEmu,
                    unit: 'EMU',
                  },
                },
                transform: {
                  scaleX: 1,
                  scaleY: 1,
                  translateX: translateX,
                  translateY: translateY,
                  unit: 'EMU',
                },
              },
            },
          },
        ],
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Google Slides API error:', { data })
      throw new Error(data.error?.message || 'Failed to add image')
    }

    // The response contains the created image's object ID
    const createImageReply = data.replies?.[0]?.createImage
    const imageId = createImageReply?.objectId || ''

    const presentationId = params?.presentationId?.trim() || ''
    const pageObjectId = params?.pageObjectId?.trim() || ''

    return {
      success: true,
      output: {
        imageId,
        metadata: {
          presentationId,
          pageObjectId,
          imageUrl: params?.imageUrl?.trim() || '',
          url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
        },
      },
    }
  },

  outputs: {
    imageId: {
      type: 'string',
      description: 'The object ID of the newly created image',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including presentation ID and image URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: add_slide.ts]---
Location: sim-main/apps/sim/tools/google_slides/add_slide.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesAddSlideTool')

interface AddSlideParams {
  accessToken: string
  presentationId: string
  layout?: string
  insertionIndex?: number
  placeholderIdMappings?: string
}

interface AddSlideResponse {
  success: boolean
  output: {
    slideId: string
    metadata: {
      presentationId: string
      layout: string
      insertionIndex?: number
      url: string
    }
  }
}

// Predefined layouts available in Google Slides API
const PREDEFINED_LAYOUTS = [
  'BLANK',
  'CAPTION_ONLY',
  'TITLE',
  'TITLE_AND_BODY',
  'TITLE_AND_TWO_COLUMNS',
  'TITLE_ONLY',
  'SECTION_HEADER',
  'SECTION_TITLE_AND_DESCRIPTION',
  'ONE_COLUMN_TEXT',
  'MAIN_POINT',
  'BIG_NUMBER',
] as const

export const addSlideTool: ToolConfig<AddSlideParams, AddSlideResponse> = {
  id: 'google_slides_add_slide',
  name: 'Add Slide to Google Slides',
  description: 'Add a new slide to a Google Slides presentation with a specified layout',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    presentationId: {
      type: 'string',
      required: true,
      description: 'The ID of the presentation',
    },
    layout: {
      type: 'string',
      required: false,
      description:
        'The predefined layout for the slide (BLANK, TITLE, TITLE_AND_BODY, TITLE_ONLY, SECTION_HEADER, etc.). Defaults to BLANK.',
    },
    insertionIndex: {
      type: 'number',
      required: false,
      description:
        'The optional zero-based index indicating where to insert the slide. If not specified, the slide is added at the end.',
    },
    placeholderIdMappings: {
      type: 'string',
      required: false,
      description:
        'JSON array of placeholder mappings to assign custom object IDs to placeholders. Format: [{"layoutPlaceholder":{"type":"TITLE"},"objectId":"custom_title_id"}]',
    },
  },

  request: {
    url: (params) => {
      const presentationId = params.presentationId?.trim()
      if (!presentationId) {
        throw new Error('Presentation ID is required')
      }
      return `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`
    },
    method: 'POST',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }
      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      // Generate a unique object ID for the new slide
      const slideObjectId = `slide_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Validate and normalize the layout
      let layout = (params.layout || 'BLANK').toUpperCase()
      if (!PREDEFINED_LAYOUTS.includes(layout as (typeof PREDEFINED_LAYOUTS)[number])) {
        logger.warn(`Invalid layout "${params.layout}", defaulting to BLANK`)
        layout = 'BLANK'
      }

      const createSlideRequest: Record<string, any> = {
        objectId: slideObjectId,
        slideLayoutReference: {
          predefinedLayout: layout,
        },
      }

      // Add insertion index if specified
      if (params.insertionIndex !== undefined && params.insertionIndex >= 0) {
        createSlideRequest.insertionIndex = params.insertionIndex
      }

      // Add placeholder ID mappings if specified (for advanced use cases)
      if (params.placeholderIdMappings?.trim()) {
        try {
          const mappings = JSON.parse(params.placeholderIdMappings)
          if (Array.isArray(mappings) && mappings.length > 0) {
            createSlideRequest.placeholderIdMappings = mappings
          }
        } catch (e) {
          logger.warn('Invalid placeholderIdMappings JSON, ignoring:', e)
        }
      }

      return {
        requests: [
          {
            createSlide: createSlideRequest,
          },
        ],
      }
    },
  },

  transformResponse: async (response: Response, params) => {
    const data = await response.json()

    if (!response.ok) {
      logger.error('Google Slides API error:', { data })
      throw new Error(data.error?.message || 'Failed to add slide')
    }

    // The response contains the created slide's object ID
    const createSlideReply = data.replies?.[0]?.createSlide
    const slideId = createSlideReply?.objectId || ''

    const presentationId = params?.presentationId?.trim() || ''
    const layout = (params?.layout || 'BLANK').toUpperCase()

    return {
      success: true,
      output: {
        slideId,
        metadata: {
          presentationId,
          layout,
          insertionIndex: params?.insertionIndex,
          url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
        },
      },
    }
  },

  outputs: {
    slideId: {
      type: 'string',
      description: 'The object ID of the newly created slide',
    },
    metadata: {
      type: 'json',
      description: 'Operation metadata including presentation ID, layout, and URL',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: sim-main/apps/sim/tools/google_slides/create.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  GoogleSlidesCreateResponse,
  GoogleSlidesToolParams,
} from '@/tools/google_slides/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('GoogleSlidesCreateTool')

export const createTool: ToolConfig<GoogleSlidesToolParams, GoogleSlidesCreateResponse> = {
  id: 'google_slides_create',
  name: 'Create Google Slides Presentation',
  description: 'Create a new Google Slides presentation',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'google-drive',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Google Slides API',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The title of the presentation to create',
    },
    content: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The content to add to the first slide',
    },
    folderSelector: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'Select the folder to create the presentation in',
    },
    folderId: {
      type: 'string',
      required: false,
      visibility: 'hidden',
      description: 'The ID of the folder to create the presentation in (internal use)',
    },
  },

  request: {
    url: () => {
      return 'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true'
    },
    method: 'POST',
    headers: (params) => {
      // Validate access token
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
      }
    },
    body: (params) => {
      if (!params.title) {
        throw new Error('Title is required')
      }

      const requestBody: any = {
        name: params.title,
        mimeType: 'application/vnd.google-apps.presentation',
      }

      // Add parent folder if specified (prefer folderSelector over folderId)
      const folderId = params.folderSelector || params.folderId
      if (folderId) {
        requestBody.parents = [folderId]
      }

      return requestBody
    },
  },

  postProcess: async (result, params, executeTool) => {
    if (!result.success) {
      return result
    }

    const presentationId = result.output.metadata.presentationId

    if (params.content && presentationId) {
      try {
        const writeParams = {
          accessToken: params.accessToken,
          presentationId: presentationId,
          content: params.content,
        }

        const writeResult = await executeTool('google_slides_write', writeParams)

        if (!writeResult.success) {
          logger.warn(
            'Failed to add content to presentation, but presentation was created:',
            writeResult.error
          )
        }
      } catch (error) {
        logger.warn('Error adding content to presentation:', { error })
        // Don't fail the overall operation if adding content fails
      }
    }

    return result
  },

  transformResponse: async (response: Response) => {
    try {
      // Get the response data
      const responseText = await response.text()
      const data = JSON.parse(responseText)

      const presentationId = data.id
      const title = data.name

      const metadata = {
        presentationId,
        title: title || 'Untitled Presentation',
        mimeType: 'application/vnd.google-apps.presentation',
        url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
      }

      return {
        success: true,
        output: {
          metadata,
        },
      }
    } catch (error) {
      logger.error('Google Slides create - Error processing response:', {
        error,
      })
      throw error
    }
  },

  outputs: {
    metadata: {
      type: 'json',
      description: 'Created presentation metadata including ID, title, and URL',
    },
  },
}
```

--------------------------------------------------------------------------------

````
