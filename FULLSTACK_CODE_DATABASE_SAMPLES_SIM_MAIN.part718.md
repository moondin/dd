---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 718
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 718 of 933)

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

---[FILE: get_all.ts]---
Location: sim-main/apps/sim/tools/memory/get_all.ts

```typescript
import type { MemoryResponse } from '@/tools/memory/types'
import type { ToolConfig } from '@/tools/types'

export const memoryGetAllTool: ToolConfig<any, MemoryResponse> = {
  id: 'memory_get_all',
  name: 'Get All Memories',
  description: 'Retrieve all memories from the database',
  version: '1.0.0',

  params: {},

  request: {
    url: (params): any => {
      const workflowId = params._context?.workflowId

      if (!workflowId) {
        return {
          _errorResponse: {
            status: 400,
            data: {
              success: false,
              error: {
                message: 'workflowId is required and must be provided in execution context',
              },
            },
          },
        }
      }

      return `/api/memory?workflowId=${encodeURIComponent(workflowId)}`
    },
    method: 'GET',
    headers: () => ({
      'Content-Type': 'application/json',
    }),
  },

  transformResponse: async (response): Promise<MemoryResponse> => {
    const result = await response.json()

    const data = result.data || result
    const memories = data.memories || data || []

    if (!Array.isArray(memories) || memories.length === 0) {
      return {
        success: true,
        output: {
          memories: [],
          message: 'No memories found',
        },
      }
    }

    return {
      success: true,
      output: {
        memories,
        message: `Found ${memories.length} memories`,
      },
    }
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether all memories were retrieved successfully' },
    memories: {
      type: 'array',
      description:
        'Array of all memory objects with key, conversationId, blockId, blockName, and data fields',
    },
    message: { type: 'string', description: 'Success or error message' },
    error: { type: 'string', description: 'Error message if operation failed' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: helpers.ts]---
Location: sim-main/apps/sim/tools/memory/helpers.ts

```typescript
/**
 * Parse memory key into conversationId and blockId
 * Supports two formats:
 * - New format: conversationId:blockId (splits on LAST colon to handle IDs with colons)
 * - Legacy format: id (without colon, treated as conversationId with blockId='default')
 * @param key The memory key to parse
 * @returns Object with conversationId and blockId, or null if invalid
 */
export function parseMemoryKey(key: string): { conversationId: string; blockId: string } | null {
  if (!key) {
    return null
  }

  const lastColonIndex = key.lastIndexOf(':')

  // Legacy format: no colon found
  if (lastColonIndex === -1) {
    return {
      conversationId: key,
      blockId: 'default',
    }
  }

  // Invalid: colon at start or end
  if (lastColonIndex === 0 || lastColonIndex === key.length - 1) {
    return null
  }

  // New format: split on last colon to handle IDs with colons
  // This allows conversationIds like "user:123" to work correctly
  return {
    conversationId: key.substring(0, lastColonIndex),
    blockId: key.substring(lastColonIndex + 1),
  }
}

/**
 * Build memory key from conversationId and blockId
 * @param conversationId The conversation ID
 * @param blockId The block ID
 * @returns The memory key in format conversationId:blockId
 */
export function buildMemoryKey(conversationId: string, blockId: string): string {
  return `${conversationId}:${blockId}`
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/memory/index.ts

```typescript
import { memoryAddTool } from '@/tools/memory/add'
import { memoryDeleteTool } from '@/tools/memory/delete'
import { memoryGetTool } from '@/tools/memory/get'
import { memoryGetAllTool } from '@/tools/memory/get_all'

export { memoryAddTool, memoryGetTool, memoryGetAllTool, memoryDeleteTool }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/memory/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

export interface MemoryResponse extends ToolResponse {
  output: {
    memories?: any[]
    message?: string
  }
}

export interface AgentMemoryData {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface MemoryRecord {
  id: string
  key: string
  conversationId: string
  blockId: string
  blockName: string
  data: AgentMemoryData[]
  createdAt: string
  updatedAt: string
  workflowId?: string
  workspaceId?: string
}

export interface MemoryError {
  code: string
  message: string
  details?: Record<string, any>
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/index.ts

```typescript
import { readTool } from '@/tools/microsoft_excel/read'
import { tableAddTool } from '@/tools/microsoft_excel/table_add'
import { worksheetAddTool } from '@/tools/microsoft_excel/worksheet_add'
import { writeTool } from '@/tools/microsoft_excel/write'

export const microsoftExcelReadTool = readTool
export const microsoftExcelTableAddTool = tableAddTool
export const microsoftExcelWorksheetAddTool = worksheetAddTool
export const microsoftExcelWriteTool = writeTool
```

--------------------------------------------------------------------------------

---[FILE: read.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/read.ts

```typescript
import type {
  ExcelCellValue,
  MicrosoftExcelReadResponse,
  MicrosoftExcelToolParams,
} from '@/tools/microsoft_excel/types'
import {
  getSpreadsheetWebUrl,
  trimTrailingEmptyRowsAndColumns,
} from '@/tools/microsoft_excel/utils'
import type { ToolConfig } from '@/tools/types'

export const readTool: ToolConfig<MicrosoftExcelToolParams, MicrosoftExcelReadResponse> = {
  id: 'microsoft_excel_read',
  name: 'Read from Microsoft Excel',
  description: 'Read data from a Microsoft Excel spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-excel',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Excel API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the spreadsheet to read from',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description:
        'The range of cells to read from. Accepts "SheetName!A1:B2" for explicit ranges or just "SheetName" to read the used range of that sheet. If omitted, reads the used range of the first sheet.',
    },
  },

  request: {
    url: (params) => {
      const spreadsheetId = params.spreadsheetId?.trim()
      if (!spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }

      if (!params.range) {
        // When no range is provided, first fetch the first worksheet name (to avoid hardcoding "Sheet1")
        // We'll read its default range after in transformResponse
        return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets?$select=name&$orderby=position&$top=1`
      }

      const rangeInput = params.range.trim()

      // If the input contains no '!', treat it as a sheet name only and fetch usedRange
      if (!rangeInput.includes('!')) {
        const sheetOnly = encodeURIComponent(rangeInput)
        return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets('${sheetOnly}')/usedRange(valuesOnly=true)`
      }

      const match = rangeInput.match(/^([^!]+)!(.+)$/)

      if (!match) {
        throw new Error(
          `Invalid range format: "${params.range}". Use "Sheet1!A1:B2" or just "Sheet1" to read the whole sheet`
        )
      }

      const sheetName = encodeURIComponent(match[1])
      const address = encodeURIComponent(match[2])

      return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets('${sheetName}')/range(address='${address}')`
    },
    method: 'GET',
    headers: (params) => {
      if (!params.accessToken) {
        throw new Error('Access token is required')
      }

      return {
        Authorization: `Bearer ${params.accessToken}`,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftExcelToolParams) => {
    // If we came from the worksheets listing (no range provided), resolve first sheet name then fetch range
    if (response.url.includes('/workbook/worksheets?')) {
      const listData = await response.json()
      const firstSheetName: string | undefined = listData?.value?.[0]?.name

      if (!firstSheetName) {
        throw new Error('No worksheets found in the Excel workbook')
      }

      const spreadsheetIdFromUrl = response.url.split('/drive/items/')[1]?.split('/')[0] || ''
      const accessToken = params?.accessToken
      if (!accessToken) {
        throw new Error('Access token is required to read Excel range')
      }

      // Use usedRange(valuesOnly=true) to fetch only populated cells, avoiding thousands of empty rows
      const rangeUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(
        spreadsheetIdFromUrl
      )}/workbook/worksheets('${encodeURIComponent(firstSheetName)}')/usedRange(valuesOnly=true)`

      const rangeResp = await fetch(rangeUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!rangeResp.ok) {
        // Normalize Microsoft Graph sheet/range errors to a friendly message
        throw new Error(
          'Invalid range provided or worksheet not found. Provide a range like "Sheet1!A1:B2" or just the sheet name to read the whole sheet'
        )
      }

      const data = await rangeResp.json()

      // usedRange returns an address (A1 notation) and values matrix
      const address: string = data.address || data.addressLocal || `${firstSheetName}!A1`
      const rawValues: ExcelCellValue[][] = data.values || []

      const values = trimTrailingEmptyRowsAndColumns(rawValues)

      // Fetch the browser-accessible web URL
      const webUrl = await getSpreadsheetWebUrl(spreadsheetIdFromUrl, accessToken)

      const metadata = {
        spreadsheetId: spreadsheetIdFromUrl,
        properties: {},
        spreadsheetUrl: webUrl,
      }

      const result: MicrosoftExcelReadResponse = {
        success: true,
        output: {
          data: {
            range: address,
            values,
          },
          metadata: {
            spreadsheetId: metadata.spreadsheetId,
            spreadsheetUrl: metadata.spreadsheetUrl,
          },
        },
      }

      return result
    }

    // Normal path: caller supplied a range; just return the parsed result
    const data = await response.json()

    const urlParts = response.url.split('/drive/items/')
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Fetch the browser-accessible web URL
    const accessToken = params?.accessToken
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    const webUrl = await getSpreadsheetWebUrl(spreadsheetId, accessToken)

    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: webUrl,
    }

    const address: string = data.address || data.addressLocal || data.range || ''
    const rawValues: ExcelCellValue[][] = data.values || []
    const values = trimTrailingEmptyRowsAndColumns(rawValues)

    const result: MicrosoftExcelReadResponse = {
      success: true,
      output: {
        data: {
          range: address,
          values,
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
    data: {
      type: 'object',
      description: 'Range data from the spreadsheet',
      properties: {
        range: { type: 'string', description: 'The range that was read' },
        values: { type: 'array', description: 'Array of rows containing cell values' },
      },
    },
    metadata: {
      type: 'object',
      description: 'Spreadsheet metadata',
      properties: {
        spreadsheetId: { type: 'string', description: 'The ID of the spreadsheet' },
        spreadsheetUrl: { type: 'string', description: 'URL to access the spreadsheet' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: table_add.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/table_add.ts

```typescript
import type {
  MicrosoftExcelTableAddResponse,
  MicrosoftExcelTableToolParams,
} from '@/tools/microsoft_excel/types'
import { getSpreadsheetWebUrl } from '@/tools/microsoft_excel/utils'
import type { ToolConfig } from '@/tools/types'

export const tableAddTool: ToolConfig<
  MicrosoftExcelTableToolParams,
  MicrosoftExcelTableAddResponse
> = {
  id: 'microsoft_excel_table_add',
  name: 'Add to Microsoft Excel Table',
  description: 'Add new rows to a Microsoft Excel table',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-excel',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Excel API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the spreadsheet containing the table',
    },
    tableName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description: 'The name of the table to add rows to',
    },
    values: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The data to add to the table (array of arrays or array of objects)',
    },
  },

  request: {
    url: (params) => {
      const tableName = encodeURIComponent(params.tableName)
      return `https://graph.microsoft.com/v1.0/me/drive/items/${params.spreadsheetId}/workbook/tables('${tableName}')/rows/add`
    },
    method: 'POST',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let processedValues: any = params.values || []

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

        processedValues = processedValues.map((obj: any) => {
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
      }

      if (!Array.isArray(processedValues) || processedValues.length === 0) {
        throw new Error('Values must be a non-empty array')
      }

      if (!Array.isArray(processedValues[0])) {
        processedValues = [processedValues]
      }

      return {
        values: processedValues,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftExcelTableToolParams) => {
    const data = await response.json()

    const urlParts = response.url.split('/drive/items/')
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Fetch the browser-accessible web URL
    const accessToken = params?.accessToken
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    const webUrl = await getSpreadsheetWebUrl(spreadsheetId, accessToken)

    const metadata = {
      spreadsheetId,
      spreadsheetUrl: webUrl,
    }

    const result = {
      success: true,
      output: {
        index: data.index || 0,
        values: data.values || [],
        metadata: {
          spreadsheetId: metadata.spreadsheetId,
          spreadsheetUrl: metadata.spreadsheetUrl,
        },
      },
    }

    return result
  },

  outputs: {
    index: { type: 'number', description: 'Index of the first row that was added' },
    values: { type: 'array', description: 'Array of rows that were added to the table' },
    metadata: {
      type: 'object',
      description: 'Spreadsheet metadata',
      properties: {
        spreadsheetId: { type: 'string', description: 'The ID of the spreadsheet' },
        spreadsheetUrl: { type: 'string', description: 'URL to access the spreadsheet' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/types.ts

```typescript
import type { ToolResponse } from '@/tools/types'

// Type for Excel cell values - covers all valid data types that Excel supports
export type ExcelCellValue = string | number | boolean | null

export interface MicrosoftExcelRange {
  sheetId?: number
  sheetName?: string
  range: string
  values: ExcelCellValue[][]
}

export interface MicrosoftExcelMetadata {
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

export interface MicrosoftExcelReadResponse extends ToolResponse {
  output: {
    data: MicrosoftExcelRange
    metadata: MicrosoftExcelMetadata
  }
}

export interface MicrosoftExcelWriteResponse extends ToolResponse {
  output: {
    updatedRange: string
    updatedRows: number
    updatedColumns: number
    updatedCells: number
    metadata: MicrosoftExcelMetadata
  }
}

export interface MicrosoftExcelTableAddResponse extends ToolResponse {
  output: {
    index: number
    values: ExcelCellValue[][]
    metadata: MicrosoftExcelMetadata
  }
}

export interface MicrosoftExcelWorksheetAddResponse extends ToolResponse {
  output: {
    worksheet: {
      id: string
      name: string
      position: number
      visibility: string
    }
    metadata: MicrosoftExcelMetadata
  }
}

export interface MicrosoftExcelToolParams {
  accessToken: string
  spreadsheetId: string
  range?: string
  values?: ExcelCellValue[][]
  valueInputOption?: 'RAW' | 'USER_ENTERED'
  insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS'
  includeValuesInResponse?: boolean
  responseValueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA'
  majorDimension?: 'ROWS' | 'COLUMNS'
}

export interface MicrosoftExcelTableToolParams {
  accessToken: string
  spreadsheetId: string
  tableName: string
  values: ExcelCellValue[][]
  rowIndex?: number
}

export interface MicrosoftExcelWorksheetToolParams {
  accessToken: string
  spreadsheetId: string
  worksheetName: string
}

export type MicrosoftExcelResponse =
  | MicrosoftExcelReadResponse
  | MicrosoftExcelWriteResponse
  | MicrosoftExcelTableAddResponse
  | MicrosoftExcelWorksheetAddResponse
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { ExcelCellValue } from '@/tools/microsoft_excel/types'

const logger = createLogger('MicrosoftExcelUtils')

export function trimTrailingEmptyRowsAndColumns(matrix: ExcelCellValue[][]): ExcelCellValue[][] {
  if (!Array.isArray(matrix) || matrix.length === 0) return []

  const isEmptyValue = (v: ExcelCellValue) => v === null || v === ''

  // Determine last non-empty row
  let lastNonEmptyRowIndex = -1
  for (let r = 0; r < matrix.length; r++) {
    const row = matrix[r] || []
    const hasData = row.some((cell: ExcelCellValue) => !isEmptyValue(cell))
    if (hasData) lastNonEmptyRowIndex = r
  }

  if (lastNonEmptyRowIndex === -1) return []

  const trimmedRows = matrix.slice(0, lastNonEmptyRowIndex + 1)

  // Determine last non-empty column across trimmed rows
  let lastNonEmptyColIndex = -1
  for (let r = 0; r < trimmedRows.length; r++) {
    const row = trimmedRows[r] || []
    for (let c = 0; c < row.length; c++) {
      if (!isEmptyValue(row[c])) {
        if (c > lastNonEmptyColIndex) lastNonEmptyColIndex = c
      }
    }
  }

  if (lastNonEmptyColIndex === -1) return []

  return trimmedRows.map((row) => (row || []).slice(0, lastNonEmptyColIndex + 1))
}

/**
 * Fetches the browser-accessible web URL for an Excel spreadsheet.
 * This URL can be opened in a browser if the user is logged into OneDrive/Microsoft,
 * unlike the Graph API URL which requires an access token.
 */
export async function getSpreadsheetWebUrl(
  spreadsheetId: string,
  accessToken: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}?$select=id,webUrl`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      logger.warn('Failed to fetch spreadsheet webUrl, using Graph API URL as fallback', {
        spreadsheetId,
        status: response.status,
      })
      return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}`
    }

    const data = await response.json()
    return data.webUrl || `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}`
  } catch (error) {
    logger.warn('Error fetching spreadsheet webUrl, using Graph API URL as fallback', {
      spreadsheetId,
      error,
    })
    return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}`
  }
}
```

--------------------------------------------------------------------------------

---[FILE: worksheet_add.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/worksheet_add.ts

```typescript
import type {
  MicrosoftExcelWorksheetAddResponse,
  MicrosoftExcelWorksheetToolParams,
} from '@/tools/microsoft_excel/types'
import { getSpreadsheetWebUrl } from '@/tools/microsoft_excel/utils'
import type { ToolConfig } from '@/tools/types'

/**
 * Tool for adding a new worksheet to a Microsoft Excel workbook
 * Uses Microsoft Graph API endpoint: POST /me/drive/items/{id}/workbook/worksheets/add
 */
export const worksheetAddTool: ToolConfig<
  MicrosoftExcelWorksheetToolParams,
  MicrosoftExcelWorksheetAddResponse
> = {
  id: 'microsoft_excel_worksheet_add',
  name: 'Add Worksheet to Microsoft Excel',
  description: 'Create a new worksheet (sheet) in a Microsoft Excel workbook',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-excel',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Excel API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the Excel workbook to add the worksheet to',
    },
    worksheetName: {
      type: 'string',
      required: true,
      visibility: 'user-or-llm',
      description:
        'The name of the new worksheet. Must be unique within the workbook and cannot exceed 31 characters',
    },
  },

  request: {
    url: (params) => {
      const spreadsheetId = params.spreadsheetId?.trim()
      if (!spreadsheetId) {
        throw new Error('Spreadsheet ID is required')
      }
      return `https://graph.microsoft.com/v1.0/me/drive/items/${spreadsheetId}/workbook/worksheets/add`
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
      const worksheetName = params.worksheetName?.trim()

      if (!worksheetName) {
        throw new Error('Worksheet name is required')
      }

      // Validate worksheet name length (Excel limitation)
      if (worksheetName.length > 31) {
        throw new Error('Worksheet name cannot exceed 31 characters. Please provide a shorter name')
      }

      // Validate worksheet name doesn't contain invalid characters
      const invalidChars = ['\\', '/', '?', '*', '[', ']', ':']
      for (const char of invalidChars) {
        if (worksheetName.includes(char)) {
          throw new Error(`Worksheet name cannot contain the following characters: \\ / ? * [ ] :`)
        }
      }

      return {
        name: worksheetName,
      }
    },
  },

  transformResponse: async (response: Response, params?: MicrosoftExcelWorksheetToolParams) => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage =
        errorData?.error?.message || `Failed to create worksheet: ${response.statusText}`

      // Handle specific error cases
      if (response.status === 409) {
        throw new Error('A worksheet with this name already exists. Please choose a different name')
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()

    const urlParts = response.url.split('/drive/items/')
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Fetch the browser-accessible web URL
    const accessToken = params?.accessToken
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    const webUrl = await getSpreadsheetWebUrl(spreadsheetId, accessToken)

    const result: MicrosoftExcelWorksheetAddResponse = {
      success: true,
      output: {
        worksheet: {
          id: data.id || '',
          name: data.name || '',
          position: data.position ?? 0,
          visibility: data.visibility || 'Visible',
        },
        metadata: {
          spreadsheetId,
          spreadsheetUrl: webUrl,
        },
      },
    }

    return result
  },

  outputs: {
    worksheet: {
      type: 'object',
      description: 'Details of the newly created worksheet',
      properties: {
        id: { type: 'string', description: 'The unique ID of the worksheet' },
        name: { type: 'string', description: 'The name of the worksheet' },
        position: { type: 'number', description: 'The zero-based position of the worksheet' },
        visibility: {
          type: 'string',
          description: 'The visibility state of the worksheet (Visible/Hidden/VeryHidden)',
        },
      },
    },
    metadata: {
      type: 'object',
      description: 'Spreadsheet metadata',
      properties: {
        spreadsheetId: { type: 'string', description: 'The ID of the spreadsheet' },
        spreadsheetUrl: { type: 'string', description: 'URL to access the spreadsheet' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: write.ts]---
Location: sim-main/apps/sim/tools/microsoft_excel/write.ts

```typescript
import type {
  MicrosoftExcelToolParams,
  MicrosoftExcelWriteResponse,
} from '@/tools/microsoft_excel/types'
import { getSpreadsheetWebUrl } from '@/tools/microsoft_excel/utils'
import type { ToolConfig } from '@/tools/types'

export const writeTool: ToolConfig<MicrosoftExcelToolParams, MicrosoftExcelWriteResponse> = {
  id: 'microsoft_excel_write',
  name: 'Write to Microsoft Excel',
  description: 'Write data to a Microsoft Excel spreadsheet',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-excel',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Excel API',
    },
    spreadsheetId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the spreadsheet to write to',
    },
    range: {
      type: 'string',
      required: false,
      visibility: 'user-or-llm',
      description: 'The range of cells to write to',
    },
    values: {
      type: 'array',
      required: true,
      visibility: 'user-or-llm',
      description: 'The data to write to the spreadsheet',
    },
    valueInputOption: {
      type: 'string',
      required: false,
      visibility: 'user-only',
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
      const rangeInput = params.range?.trim()
      const match = rangeInput?.match(/^([^!]+)!(.+)$/)

      if (!match) {
        throw new Error(`Invalid range format: "${params.range}". Use the format "Sheet1!A1:B2"`)
      }

      const sheetName = encodeURIComponent(match[1])
      const address = encodeURIComponent(match[2])

      const url = new URL(
        `https://graph.microsoft.com/v1.0/me/drive/items/${params.spreadsheetId}/workbook/worksheets('${sheetName}')/range(address='${address}')`
      )

      const valueInputOption = params.valueInputOption || 'USER_ENTERED'
      url.searchParams.append('valueInputOption', valueInputOption)

      if (params.includeValuesInResponse) {
        url.searchParams.append('includeValuesInResponse', 'true')
      }

      return url.toString()
    },
    method: 'PATCH',
    headers: (params) => ({
      Authorization: `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    }),
    body: (params) => {
      let processedValues: any = params.values || []

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

  transformResponse: async (response: Response, params?: MicrosoftExcelToolParams) => {
    const data = await response.json()

    const urlParts = response.url.split('/drive/items/')
    const spreadsheetId = urlParts[1]?.split('/')[0] || ''

    // Fetch the browser-accessible web URL
    const accessToken = params?.accessToken
    if (!accessToken) {
      throw new Error('Access token is required')
    }
    const webUrl = await getSpreadsheetWebUrl(spreadsheetId, accessToken)

    const metadata = {
      spreadsheetId,
      properties: {},
      spreadsheetUrl: webUrl,
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
    updatedRange: { type: 'string', description: 'The range that was updated' },
    updatedRows: { type: 'number', description: 'Number of rows that were updated' },
    updatedColumns: { type: 'number', description: 'Number of columns that were updated' },
    updatedCells: { type: 'number', description: 'Number of cells that were updated' },
    metadata: {
      type: 'object',
      description: 'Spreadsheet metadata',
      properties: {
        spreadsheetId: { type: 'string', description: 'The ID of the spreadsheet' },
        spreadsheetUrl: { type: 'string', description: 'URL to access the spreadsheet' },
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_bucket.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/create_bucket.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerCreateBucketResponse,
  MicrosoftPlannerToolParams,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerCreateBucket')

export const createBucketTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerCreateBucketResponse
> = {
  id: 'microsoft_planner_create_bucket',
  name: 'Create Microsoft Planner Bucket',
  description: 'Create a new bucket in a Microsoft Planner plan',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-planner',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Planner API',
    },
    planId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the plan where the bucket will be created',
    },
    name: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The name of the bucket',
    },
  },

  request: {
    url: () => 'https://graph.microsoft.com/v1.0/planner/buckets',
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
      if (!params.planId) {
        throw new Error('Plan ID is required')
      }
      if (!params.name) {
        throw new Error('Bucket name is required')
      }

      const body = {
        name: params.name,
        planId: params.planId,
        orderHint: ' !',
      }

      logger.info('Creating bucket with body:', body)
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const bucket = await response.json()
    logger.info('Created bucket:', bucket)

    const result: MicrosoftPlannerCreateBucketResponse = {
      success: true,
      output: {
        bucket,
        metadata: {
          bucketId: bucket.id,
          planId: bucket.planId,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the bucket was created successfully' },
    bucket: { type: 'object', description: 'The created bucket object with all properties' },
    metadata: { type: 'object', description: 'Metadata including bucketId and planId' },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: create_task.ts]---
Location: sim-main/apps/sim/tools/microsoft_planner/create_task.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type {
  MicrosoftPlannerCreateResponse,
  MicrosoftPlannerToolParams,
  PlannerTask,
} from '@/tools/microsoft_planner/types'
import type { ToolConfig } from '@/tools/types'

const logger = createLogger('MicrosoftPlannerCreateTask')

export const createTaskTool: ToolConfig<
  MicrosoftPlannerToolParams,
  MicrosoftPlannerCreateResponse
> = {
  id: 'microsoft_planner_create_task',
  name: 'Create Microsoft Planner Task',
  description: 'Create a new task in Microsoft Planner',
  version: '1.0',

  oauth: {
    required: true,
    provider: 'microsoft-planner',
  },

  params: {
    accessToken: {
      type: 'string',
      required: true,
      visibility: 'hidden',
      description: 'The access token for the Microsoft Planner API',
    },
    planId: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The ID of the plan where the task will be created',
    },
    title: {
      type: 'string',
      required: true,
      visibility: 'user-only',
      description: 'The title of the task',
    },
    description: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The description of the task',
    },
    dueDateTime: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The due date and time for the task (ISO 8601 format)',
    },
    assigneeUserId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The user ID to assign the task to',
    },
    bucketId: {
      type: 'string',
      required: false,
      visibility: 'user-only',
      description: 'The bucket ID to place the task in',
    },
  },

  request: {
    url: () => 'https://graph.microsoft.com/v1.0/planner/tasks',
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
      if (!params.planId) {
        throw new Error('Plan ID is required')
      }
      if (!params.title) {
        throw new Error('Task title is required')
      }

      const body: PlannerTask = {
        planId: params.planId,
        title: params.title,
      }

      if (params.bucketId !== undefined && params.bucketId !== null && params.bucketId !== '') {
        body.bucketId = params.bucketId
      }

      if (
        params.dueDateTime !== undefined &&
        params.dueDateTime !== null &&
        params.dueDateTime !== ''
      ) {
        body.dueDateTime = params.dueDateTime
      }

      if (
        params.assigneeUserId !== undefined &&
        params.assigneeUserId !== null &&
        params.assigneeUserId !== ''
      ) {
        body.assignments = {
          [params.assigneeUserId]: {
            '@odata.type': 'microsoft.graph.plannerAssignment',
            orderHint: ' !',
          },
        }
      }

      logger.info('Creating task with body:', body)
      return body
    },
  },

  transformResponse: async (response: Response) => {
    const task = await response.json()
    logger.info('Created task:', task)

    const result: MicrosoftPlannerCreateResponse = {
      success: true,
      output: {
        task,
        metadata: {
          planId: task.planId,
          taskId: task.id,
          taskUrl: `https://graph.microsoft.com/v1.0/planner/tasks/${task.id}`,
        },
      },
    }

    return result
  },

  outputs: {
    success: { type: 'boolean', description: 'Whether the task was created successfully' },
    task: { type: 'object', description: 'The created task object with all properties' },
    metadata: { type: 'object', description: 'Metadata including planId, taskId, and taskUrl' },
  },
}
```

--------------------------------------------------------------------------------

````
