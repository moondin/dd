---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 310
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 310 of 933)

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
Location: sim-main/apps/sim/app/api/tools/onedrive/upload/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import {
  getExtensionFromMimeType,
  processSingleFileToUserFile,
} from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import { normalizeExcelValues } from '@/tools/onedrive/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('OneDriveUploadAPI')

const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0'

const ExcelCellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const ExcelRowSchema = z.array(ExcelCellSchema)
const ExcelValuesSchema = z.union([
  z.string(),
  z.array(ExcelRowSchema),
  z.array(z.record(ExcelCellSchema)),
])

const OneDriveUploadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  fileName: z.string().min(1, 'File name is required'),
  file: z.any().optional(), // UserFile object (optional for blank Excel creation)
  folderId: z.string().optional().nullable(),
  mimeType: z.string().nullish(), // Accept string, null, or undefined
  values: ExcelValuesSchema.optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized OneDrive upload attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated OneDrive upload request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OneDriveUploadSchema.parse(body)
    const excelValues = normalizeExcelValues(validatedData.values)

    let fileBuffer: Buffer
    let mimeType: string

    // Check if we're creating a blank Excel file
    const isExcelCreation =
      validatedData.mimeType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && !validatedData.file

    if (isExcelCreation) {
      // Create a blank Excel workbook

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet([[]])
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

      // Generate XLSX file as buffer
      const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      fileBuffer = Buffer.from(xlsxBuffer)
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else {
      // Handle regular file upload
      const rawFile = validatedData.file

      if (!rawFile) {
        return NextResponse.json(
          {
            success: false,
            error: 'No file provided',
          },
          { status: 400 }
        )
      }

      let fileToProcess
      if (Array.isArray(rawFile)) {
        if (rawFile.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: 'No file provided',
            },
            { status: 400 }
          )
        }
        fileToProcess = rawFile[0]
      } else {
        fileToProcess = rawFile
      }

      // Convert to UserFile format
      let userFile
      try {
        userFile = processSingleFileToUserFile(fileToProcess, requestId, logger)
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process file',
          },
          { status: 400 }
        )
      }

      try {
        fileBuffer = await downloadFileFromStorage(userFile, requestId, logger)
      } catch (error) {
        logger.error(`[${requestId}] Failed to download file from storage:`, error)
        return NextResponse.json(
          {
            success: false,
            error: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
          { status: 500 }
        )
      }

      mimeType = userFile.type || 'application/octet-stream'
    }

    const maxSize = 250 * 1024 * 1024 // 250MB
    if (fileBuffer.length > maxSize) {
      const sizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2)
      logger.warn(`[${requestId}] File too large: ${sizeMB}MB`)
      return NextResponse.json(
        {
          success: false,
          error: `File size (${sizeMB}MB) exceeds OneDrive's limit of 250MB for simple uploads. Use chunked upload for larger files.`,
        },
        { status: 400 }
      )
    }

    // Ensure file name has an appropriate extension
    let fileName = validatedData.fileName
    const hasExtension = fileName.includes('.') && fileName.lastIndexOf('.') > 0

    if (!hasExtension) {
      const extension = getExtensionFromMimeType(mimeType)
      if (extension) {
        fileName = `${fileName}.${extension}`
        logger.info(`[${requestId}] Added extension to filename: ${fileName}`)
      }
    } else if (isExcelCreation && !fileName.endsWith('.xlsx')) {
      fileName = `${fileName.replace(/\.[^.]*$/, '')}.xlsx`
    }

    let uploadUrl: string
    const folderId = validatedData.folderId?.trim()

    if (folderId && folderId !== '') {
      uploadUrl = `${MICROSOFT_GRAPH_BASE}/me/drive/items/${encodeURIComponent(folderId)}:/${encodeURIComponent(fileName)}:/content`
    } else {
      uploadUrl = `${MICROSOFT_GRAPH_BASE}/me/drive/root:/${encodeURIComponent(fileName)}:/content`
    }

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
        'Content-Type': mimeType,
      },
      body: new Uint8Array(fileBuffer),
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      return NextResponse.json(
        {
          success: false,
          error: `OneDrive upload failed: ${uploadResponse.statusText}`,
          details: errorText,
        },
        { status: uploadResponse.status }
      )
    }

    const fileData = await uploadResponse.json()

    // If this is an Excel creation and values were provided, write them using the Excel API
    let excelWriteResult: any | undefined
    const shouldWriteExcelContent =
      isExcelCreation && Array.isArray(excelValues) && excelValues.length > 0

    if (shouldWriteExcelContent) {
      try {
        // Create a workbook session to ensure reliability and persistence of changes
        let workbookSessionId: string | undefined
        const sessionResp = await fetch(
          `${MICROSOFT_GRAPH_BASE}/me/drive/items/${encodeURIComponent(fileData.id)}/workbook/createSession`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ persistChanges: true }),
          }
        )

        if (sessionResp.ok) {
          const sessionData = await sessionResp.json()
          workbookSessionId = sessionData?.id
        }

        // Determine the first worksheet name
        let sheetName = 'Sheet1'
        try {
          const listUrl = `${MICROSOFT_GRAPH_BASE}/me/drive/items/${encodeURIComponent(
            fileData.id
          )}/workbook/worksheets?$select=name&$orderby=position&$top=1`
          const listResp = await fetch(listUrl, {
            headers: {
              Authorization: `Bearer ${validatedData.accessToken}`,
              ...(workbookSessionId ? { 'workbook-session-id': workbookSessionId } : {}),
            },
          })
          if (listResp.ok) {
            const listData = await listResp.json()
            const firstSheetName = listData?.value?.[0]?.name
            if (firstSheetName) {
              sheetName = firstSheetName
            }
          } else {
            const listErr = await listResp.text()
            logger.warn(`[${requestId}] Failed to list worksheets, using default Sheet1`, {
              status: listResp.status,
              error: listErr,
            })
          }
        } catch (listError) {
          logger.warn(`[${requestId}] Error listing worksheets, using default Sheet1`, listError)
        }

        let processedValues: any = excelValues || []

        if (
          Array.isArray(processedValues) &&
          processedValues.length > 0 &&
          typeof processedValues[0] === 'object' &&
          !Array.isArray(processedValues[0])
        ) {
          const ws = XLSX.utils.json_to_sheet(processedValues)
          processedValues = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        }

        const rowsCount = processedValues.length
        const colsCount = Math.max(...processedValues.map((row: any[]) => row.length), 0)
        processedValues = processedValues.map((row: any[]) => {
          const paddedRow = [...row]
          while (paddedRow.length < colsCount) paddedRow.push('')
          return paddedRow
        })

        // Compute concise end range from A1 and matrix size (no network round-trip)
        const indexToColLetters = (index: number): string => {
          let n = index
          let s = ''
          while (n > 0) {
            const rem = (n - 1) % 26
            s = String.fromCharCode(65 + rem) + s
            n = Math.floor((n - 1) / 26)
          }
          return s
        }

        const endColLetters = colsCount > 0 ? indexToColLetters(colsCount) : 'A'
        const endRow = rowsCount > 0 ? rowsCount : 1
        const computedRangeAddress = `A1:${endColLetters}${endRow}`

        const url = new URL(
          `${MICROSOFT_GRAPH_BASE}/me/drive/items/${encodeURIComponent(
            fileData.id
          )}/workbook/worksheets('${encodeURIComponent(
            sheetName
          )}')/range(address='${encodeURIComponent(computedRangeAddress)}')`
        )

        const excelWriteResponse = await fetch(url.toString(), {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${validatedData.accessToken}`,
            'Content-Type': 'application/json',
            ...(workbookSessionId ? { 'workbook-session-id': workbookSessionId } : {}),
          },
          body: JSON.stringify({ values: processedValues }),
        })

        if (!excelWriteResponse || !excelWriteResponse.ok) {
          const errorText = excelWriteResponse ? await excelWriteResponse.text() : 'no response'
          logger.error(`[${requestId}] Excel content write failed`, {
            status: excelWriteResponse?.status,
            statusText: excelWriteResponse?.statusText,
            error: errorText,
          })
          // Do not fail the entire request; return upload success with write error details
          excelWriteResult = {
            success: false,
            error: `Excel write failed: ${excelWriteResponse?.statusText || 'unknown'}`,
            details: errorText,
          }
        } else {
          const writeData = await excelWriteResponse.json()
          // The Range PATCH returns a Range object; log address and values length
          const addr = writeData.address || writeData.addressLocal
          const v = writeData.values || []
          excelWriteResult = {
            success: true,
            updatedRange: addr,
            updatedRows: Array.isArray(v) ? v.length : undefined,
            updatedColumns: Array.isArray(v) && v[0] ? v[0].length : undefined,
            updatedCells: Array.isArray(v) && v[0] ? v.length * (v[0] as any[]).length : undefined,
          }
        }

        // Attempt to close the workbook session if one was created
        if (workbookSessionId) {
          try {
            const closeResp = await fetch(
              `${MICROSOFT_GRAPH_BASE}/me/drive/items/${encodeURIComponent(fileData.id)}/workbook/closeSession`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${validatedData.accessToken}`,
                  'workbook-session-id': workbookSessionId,
                },
              }
            )
            if (!closeResp.ok) {
              const closeText = await closeResp.text()
              logger.warn(`[${requestId}] Failed to close Excel session`, {
                status: closeResp.status,
                error: closeText,
              })
            }
          } catch (closeErr) {
            logger.warn(`[${requestId}] Error closing Excel session`, closeErr)
          }
        }
      } catch (err) {
        logger.error(`[${requestId}] Exception during Excel content write`, err)
        excelWriteResult = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error during Excel write',
        }
      }
    }

    return NextResponse.json({
      success: true,
      output: {
        file: {
          id: fileData.id,
          name: fileData.name,
          mimeType: fileData.file?.mimeType || mimeType,
          webViewLink: fileData.webUrl,
          webContentLink: fileData['@microsoft.graph.downloadUrl'],
          size: fileData.size,
          createdTime: fileData.createdDateTime,
          modifiedTime: fileData.lastModifiedDateTime,
          parentReference: fileData.parentReference,
        },
        ...(excelWriteResult ? { excelWriteResult } : {}),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error uploading file to OneDrive:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/copy/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookCopyAPI')

const OutlookCopySchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
  destinationId: z.string().min(1, 'Destination folder ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook copy attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Outlook copy request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OutlookCopySchema.parse(body)

    logger.info(`[${requestId}] Copying Outlook email`, {
      messageId: validatedData.messageId,
      destinationId: validatedData.destinationId,
    })

    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${validatedData.messageId}/copy`

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        destinationId: validatedData.destinationId,
      }),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to copy email',
        },
        { status: graphResponse.status }
      )
    }

    const responseData = await graphResponse.json()

    logger.info(`[${requestId}] Email copied successfully`, {
      originalMessageId: validatedData.messageId,
      copiedMessageId: responseData.id,
      destinationFolderId: responseData.parentFolderId,
    })

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email copied successfully',
        originalMessageId: validatedData.messageId,
        copiedMessageId: responseData.id,
        destinationFolderId: responseData.parentFolderId,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error copying Outlook email:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/delete/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookDeleteAPI')

const OutlookDeleteSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook delete attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Outlook delete request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OutlookDeleteSchema.parse(body)

    logger.info(`[${requestId}] Deleting Outlook email`, {
      messageId: validatedData.messageId,
    })

    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${validatedData.messageId}`

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to delete email',
        },
        { status: graphResponse.status }
      )
    }

    logger.info(`[${requestId}] Email deleted successfully`, {
      messageId: validatedData.messageId,
    })

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email moved to Deleted Items successfully',
        messageId: validatedData.messageId,
        status: 'deleted',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error deleting Outlook email:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/draft/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookDraftAPI')

const OutlookDraftSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  to: z.string().min(1, 'Recipient email is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
  contentType: z.enum(['text', 'html']).optional().nullable(),
  cc: z.string().optional().nullable(),
  bcc: z.string().optional().nullable(),
  attachments: z.array(z.any()).optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook draft attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Outlook draft request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = OutlookDraftSchema.parse(body)

    logger.info(`[${requestId}] Creating Outlook draft`, {
      to: validatedData.to,
      subject: validatedData.subject,
      hasAttachments: !!(validatedData.attachments && validatedData.attachments.length > 0),
      attachmentCount: validatedData.attachments?.length || 0,
    })

    const toRecipients = validatedData.to.split(',').map((email) => ({
      emailAddress: { address: email.trim() },
    }))

    const ccRecipients = validatedData.cc
      ? validatedData.cc.split(',').map((email) => ({
          emailAddress: { address: email.trim() },
        }))
      : undefined

    const bccRecipients = validatedData.bcc
      ? validatedData.bcc.split(',').map((email) => ({
          emailAddress: { address: email.trim() },
        }))
      : undefined

    const message: any = {
      subject: validatedData.subject,
      body: {
        contentType: validatedData.contentType || 'text',
        content: validatedData.body,
      },
      toRecipients,
    }

    if (ccRecipients) {
      message.ccRecipients = ccRecipients
    }

    if (bccRecipients) {
      message.bccRecipients = bccRecipients
    }

    if (validatedData.attachments && validatedData.attachments.length > 0) {
      const rawAttachments = validatedData.attachments
      logger.info(`[${requestId}] Processing ${rawAttachments.length} attachment(s)`)

      const attachments = processFilesToUserFiles(rawAttachments, requestId, logger)

      if (attachments.length > 0) {
        const totalSize = attachments.reduce((sum, file) => sum + file.size, 0)
        const maxSize = 4 * 1024 * 1024 // 4MB

        if (totalSize > maxSize) {
          const sizeMB = (totalSize / (1024 * 1024)).toFixed(2)
          return NextResponse.json(
            {
              success: false,
              error: `Total attachment size (${sizeMB}MB) exceeds Outlook's limit of 4MB per request`,
            },
            { status: 400 }
          )
        }

        const attachmentObjects = await Promise.all(
          attachments.map(async (file) => {
            try {
              logger.info(
                `[${requestId}] Downloading attachment: ${file.name} (${file.size} bytes)`
              )

              const buffer = await downloadFileFromStorage(file, requestId, logger)

              const base64Content = buffer.toString('base64')

              return {
                '@odata.type': '#microsoft.graph.fileAttachment',
                name: file.name,
                contentType: file.type || 'application/octet-stream',
                contentBytes: base64Content,
              }
            } catch (error) {
              logger.error(`[${requestId}] Failed to download attachment ${file.name}:`, error)
              throw new Error(
                `Failed to download attachment "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            }
          })
        )

        logger.info(`[${requestId}] Converted ${attachmentObjects.length} attachments to base64`)
        message.attachments = attachmentObjects
      }
    }

    const graphEndpoint = 'https://graph.microsoft.com/v1.0/me/messages'

    logger.info(`[${requestId}] Creating draft via Microsoft Graph API`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify(message),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to create draft',
        },
        { status: graphResponse.status }
      )
    }

    const responseData = await graphResponse.json()
    logger.info(`[${requestId}] Draft created successfully, ID: ${responseData.id}`)

    return NextResponse.json({
      success: true,
      output: {
        message: 'Draft created successfully',
        messageId: responseData.id,
        subject: responseData.subject,
        attachmentCount: message.attachments?.length || 0,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error creating Outlook draft:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/folders/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { account } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { refreshAccessTokenIfNeeded } from '@/app/api/auth/oauth/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookFoldersAPI')

interface OutlookFolder {
  id: string
  displayName: string
  totalItemCount?: number
  unreadItemCount?: number
}

export async function GET(request: Request) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const credentialId = searchParams.get('credentialId')

    if (!credentialId) {
      logger.error('Missing credentialId in request')
      return NextResponse.json({ error: 'Credential ID is required' }, { status: 400 })
    }

    try {
      // Ensure we have a session for permission checks
      const sessionUserId = session?.user?.id || ''

      if (!sessionUserId) {
        logger.error('No user ID found in session')
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      // Resolve the credential owner to support collaborator-owned credentials
      const creds = await db.select().from(account).where(eq(account.id, credentialId)).limit(1)
      if (!creds.length) {
        logger.warn('Credential not found', { credentialId })
        return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
      }
      const credentialOwnerUserId = creds[0].userId

      const accessToken = await refreshAccessTokenIfNeeded(
        credentialId,
        credentialOwnerUserId,
        generateRequestId()
      )

      if (!accessToken) {
        logger.error('Failed to get access token', { credentialId, userId: credentialOwnerUserId })
        return NextResponse.json(
          {
            error: 'Could not retrieve access token',
            authRequired: true,
          },
          { status: 401 }
        )
      }

      const response = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        logger.error('Microsoft Graph API error getting folders', {
          status: response.status,
          error: errorData,
          endpoint: 'https://graph.microsoft.com/v1.0/me/mailFolders',
        })

        // Check for auth errors specifically
        if (response.status === 401) {
          return NextResponse.json(
            {
              error: 'Authentication failed. Please reconnect your Outlook account.',
              authRequired: true,
            },
            { status: 401 }
          )
        }

        throw new Error(`Microsoft Graph API error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const folders = data.value || []

      // Transform folders to match the expected format
      const transformedFolders = folders.map((folder: OutlookFolder) => ({
        id: folder.id,
        name: folder.displayName,
        type: 'folder',
        messagesTotal: folder.totalItemCount || 0,
        messagesUnread: folder.unreadItemCount || 0,
      }))

      return NextResponse.json({
        folders: transformedFolders,
      })
    } catch (innerError) {
      logger.error('Error during API requests:', innerError)

      // Check if it's an authentication error
      const errorMessage = innerError instanceof Error ? innerError.message : String(innerError)
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('unauthenticated')
      ) {
        return NextResponse.json(
          {
            error: 'Authentication failed. Please reconnect your Outlook account.',
            authRequired: true,
            details: errorMessage,
          },
          { status: 401 }
        )
      }

      throw innerError
    }
  } catch (error) {
    logger.error('Error processing Outlook folders request:', error)
    return NextResponse.json(
      {
        error: 'Failed to retrieve Outlook folders',
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/mark-read/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookMarkReadAPI')

const OutlookMarkReadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook mark read attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Outlook mark read request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = OutlookMarkReadSchema.parse(body)

    logger.info(`[${requestId}] Marking Outlook email as read`, {
      messageId: validatedData.messageId,
    })

    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${validatedData.messageId}`

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        isRead: true,
      }),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to mark email as read',
        },
        { status: graphResponse.status }
      )
    }

    const responseData = await graphResponse.json()

    logger.info(`[${requestId}] Email marked as read successfully`, {
      messageId: responseData.id,
      isRead: responseData.isRead,
    })

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email marked as read successfully',
        messageId: responseData.id,
        isRead: responseData.isRead,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error marking Outlook email as read:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/outlook/mark-unread/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'

export const dynamic = 'force-dynamic'

const logger = createLogger('OutlookMarkUnreadAPI')

const OutlookMarkUnreadSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  messageId: z.string().min(1, 'Message ID is required'),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Outlook mark unread attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(
      `[${requestId}] Authenticated Outlook mark unread request via ${authResult.authType}`,
      {
        userId: authResult.userId,
      }
    )

    const body = await request.json()
    const validatedData = OutlookMarkUnreadSchema.parse(body)

    logger.info(`[${requestId}] Marking Outlook email as unread`, {
      messageId: validatedData.messageId,
    })

    const graphEndpoint = `https://graph.microsoft.com/v1.0/me/messages/${validatedData.messageId}`

    logger.info(`[${requestId}] Sending to Microsoft Graph API: ${graphEndpoint}`)

    const graphResponse = await fetch(graphEndpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${validatedData.accessToken}`,
      },
      body: JSON.stringify({
        isRead: false,
      }),
    })

    if (!graphResponse.ok) {
      const errorData = await graphResponse.json().catch(() => ({}))
      logger.error(`[${requestId}] Microsoft Graph API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to mark email as unread',
        },
        { status: graphResponse.status }
      )
    }

    const responseData = await graphResponse.json()

    logger.info(`[${requestId}] Email marked as unread successfully`, {
      messageId: responseData.id,
      isRead: responseData.isRead,
    })

    return NextResponse.json({
      success: true,
      output: {
        message: 'Email marked as unread successfully',
        messageId: responseData.id,
        isRead: responseData.isRead,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn(`[${requestId}] Invalid request data`, { errors: error.errors })
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    logger.error(`[${requestId}] Error marking Outlook email as unread:`, error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

````
