---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 250
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 250 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: run.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/job/run.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

// Reusable function for running jobs
export const runJob = async (
  req: PayloadRequest,
  verboseLogs: boolean,
  jobSlug: string,
  input: Record<string, any>,
  queue?: string,
  priority?: number,
  delay?: number,
) => {
  const payload = req.payload

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Running job: ${jobSlug}`)
  }

  try {
    // Actually run the job using Payload's job queue
    const jobQueueOptions: Record<string, unknown> = {
      input,
      task: jobSlug,
    }

    if (queue && queue !== 'default') {
      jobQueueOptions.queue = queue
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Using custom queue: ${queue}`)
      }
    }

    if (priority && priority > 0) {
      jobQueueOptions.priority = priority
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Setting job priority: ${priority}`)
      }
    }

    if (delay && delay > 0) {
      jobQueueOptions.waitUntil = new Date(Date.now() + delay)
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Setting job delay: ${delay}ms`)
      }
    }

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Queuing job with options: ${JSON.stringify(jobQueueOptions)}`,
      )
    }

    const job = await payload.jobs.queue(
      jobQueueOptions as Parameters<typeof payload.jobs.queue>[0],
    )

    const jobId = (job as { id?: string })?.id || 'unknown'

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Job created successfully: ${jobId}`)
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `# Job Queued Successfully: ${jobSlug}

## Job Details
- **Job ID**: ${jobId}
- **Job Slug**: ${jobSlug}
- **Queue**: ${queue || 'default'}
- **Priority**: ${priority || 'default'}
- **Delay**: ${delay ? `${delay}ms` : 'none'}
- **Status**: Queued and Running

## Input Data
\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

## Job Status
The job has been successfully queued and will be processed according to the queue settings.

## Monitoring the Job
You can monitor the job status using:

\`\`\`typescript
// Check job status
const jobStatus = await payload.jobs.status('${jobId}')
console.log('Job status:', jobStatus)

// Wait for completion
const result = await payload.jobs.wait('${jobId}')
console.log('Job result:', result)
\`\`\`

✅ Job successfully queued with ID: ${jobId}`,
        },
      ],
    }
  } catch (error) {
    const errorMsg = (error as Error).message
    payload.logger.error(`[payload-mcp] Error running job "${jobSlug}": ${errorMsg}`)

    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ Error running job "${jobSlug}": ${errorMsg}

## Common Issues:
1. **Job not found**: The job "${jobSlug}" may not be registered in your Payload configuration
2. **Invalid input format**: Ensure the input matches the job's input schema
3. **Queue not configured**: The queue "${queue || 'default'}" may not be properly set up
4. **Permission issues**: Ensure proper access rights for job execution
5. **Job handler error**: The job implementation may have errors

## Input Data Provided:
\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

## Next Steps:
1. **Verify job exists**: Check that the job "${jobSlug}" is properly registered
2. **Check input format**: Ensure the input data matches the expected schema
3. **Review job configuration**: Verify the job is properly configured in your Payload setup
4. **Check permissions**: Ensure you have the necessary permissions to run jobs
5. **Review error logs**: Check the server logs for more detailed error information

## Troubleshooting:
- **Job not found**: Verify the job slug and check your jobs configuration
- **Schema mismatch**: Ensure input data matches the job's input schema
- **Queue issues**: Check that the specified queue is properly configured
- **Permission errors**: Verify user permissions for job execution`,
        },
      ],
    }
  }
}

export const runJobTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (
    jobSlug: string,
    input: Record<string, any>,
    queue?: string,
    priority?: number,
    delay?: number,
  ) => {
    if (verboseLogs) {
      req.payload.logger.info(`[payload-mcp] Run Job Tool called with: ${jobSlug}`)
    }

    try {
      const result = await runJob(req, verboseLogs, jobSlug, input, queue, priority, delay)

      if (verboseLogs) {
        req.payload.logger.info(`[payload-mcp] Run Job Tool completed successfully`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      req.payload.logger.error(`[payload-mcp] Error in Run Job Tool: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error in Run Job Tool**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'runJob',
    'Runs a Payload job with specified input data and queue options',
    toolSchemas.runJob.parameters.shape,
    async (args) => {
      const { delay, input, jobSlug, priority, queue } = args
      return await tool(jobSlug, input, queue, priority, delay)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/job/update.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import type { JobConfigUpdate, SchemaField, TaskSequenceItem } from '../../../types.js'

import { validatePayloadFile } from '../../helpers/fileValidation.js'
import { toolSchemas } from '../schemas.js'

// Reusable function for updating jobs
export const updateJob = async (
  req: PayloadRequest,
  verboseLogs: boolean,
  jobsDir: string,
  jobSlug: string,
  updateType: string,
  inputSchema?: SchemaField[],
  outputSchema?: SchemaField[],
  taskSequence?: TaskSequenceItem[],
  configUpdate?: JobConfigUpdate,
  handlerCode?: string,
) => {
  const payload = req.payload

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Updating job: ${jobSlug} (${updateType})`)
  }

  try {
    const camelCaseJobSlug = toCamelCase(jobSlug)

    // Find the job file - check both tasks and workflows
    let filePath: null | string = null
    let jobType: 'task' | 'workflow' | null = null

    const taskPath = join(jobsDir, 'tasks', `${camelCaseJobSlug}.ts`)
    const workflowPath = join(jobsDir, 'workflows', `${camelCaseJobSlug}.ts`)

    if (existsSync(taskPath)) {
      filePath = taskPath
      jobType = 'task'
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Found task file: ${taskPath}`)
      }
    } else if (existsSync(workflowPath)) {
      filePath = workflowPath
      jobType = 'workflow'
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Found workflow file: ${workflowPath}`)
      }
    } else {
      throw new Error(`No task or workflow file found for job slug: ${jobSlug}`)
    }

    // Read the current file content
    let content = readFileSync(filePath, 'utf8')
    const originalContent = content

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Applying update type: ${updateType}`)
    }

    // Apply updates based on type
    switch (updateType) {
      case 'change_config':
        if (!configUpdate) {
          throw new Error('config must be provided for change_config')
        }

        content = updateConfig(content, jobSlug, configUpdate)
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Configuration updated successfully`)
        }
        break

      case 'modify_schema':
        if (!inputSchema && !outputSchema) {
          throw new Error('Either inputSchema or outputSchema must be provided for modify_schema')
        }

        content = updateSchema(content, camelCaseJobSlug, inputSchema, outputSchema)
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Schema updated successfully`)
        }
        break

      case 'replace_handler':
        if (!handlerCode) {
          throw new Error('handlerCode must be provided for replace_handler')
        }

        content = updateHandler(content, handlerCode, jobType)
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Handler code replaced successfully`)
        }
        break

      case 'update_tasks':
        if (!taskSequence) {
          throw new Error('taskSequence must be provided for update_tasks')
        }

        if (jobType !== 'workflow') {
          throw new Error('update_tasks is only supported for workflow jobs')
        }

        content = updateWorkflowTasks(content, taskSequence)
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Workflow tasks updated successfully`)
        }
        break
    }

    // Only write if content changed
    if (content !== originalContent) {
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Writing updated content to file`)
      }

      // Write the updated content
      writeFileSync(filePath, content)

      // Validate the updated file
      const fileName = `${camelCaseJobSlug}.ts`
      const validationType = jobType === 'task' ? 'task' : 'workflow'

      try {
        const validationResult = await validatePayloadFile(fileName, validationType)

        if (!validationResult.success) {
          if (verboseLogs) {
            payload.logger.warn(`[payload-mcp] Validation warning: ${validationResult.error}`)
          }

          return {
            content: [
              {
                type: 'text' as const,
                text: `⚠️ **Warning**: Job updated but validation failed:\n\n${validationResult.error}\n\nPlease review the generated code for any syntax errors.`,
              },
            ],
          }
        }

        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] File validation successful`)
        }
      } catch (validationError) {
        if (verboseLogs) {
          payload.logger.warn(`[payload-mcp] Validation error: ${validationError}`)
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `⚠️ **Warning**: Job updated but validation could not be completed:\n\n${validationError}\n\nPlease review the generated code manually.`,
            },
          ],
        }
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `✅ **Job updated successfully!**\n\n**Job**: \`${jobSlug}\`\n**Type**: \`${jobType}\`\n**Update**: \`${updateType}\`\n**File**: \`${fileName}\`\n\n**Next steps**:\n1. Restart your development server to load the updated job\n2. Test the updated functionality\n3. Verify the changes meet your requirements`,
          },
        ],
      }
    } else {
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] No changes detected, file not modified`)
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `ℹ️ **No changes made**: The job file was not modified as no changes were detected.\n\n**Job**: \`${jobSlug}\`\n**Type**: \`${jobType}\`\n**Update**: \`${updateType}\``,
          },
        ],
      }
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error updating job: ${errorMessage}`)

    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error updating job**: ${errorMessage}`,
        },
      ],
    }
  }
}

// Helper function to convert to camel case
function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (_, chr) => chr.toLowerCase())
}

// Helper functions for different update types
function updateSchema(
  content: string,
  camelCaseJobSlug: string,
  inputSchema?: SchemaField[],
  outputSchema?: SchemaField[],
): string {
  // TODO: Implementation for schema updates
  // This would modify the inputSchema and outputSchema in the job file
  return content
}

function updateWorkflowTasks(content: string, taskSequence: TaskSequenceItem[]): string {
  // TODO: Implementation for updating workflow tasks
  // This would modify the steps array in the workflow
  return content
}

function updateConfig(content: string, jobSlug: string, configUpdate: JobConfigUpdate): string {
  // TODO: Implementation for updating job configuration
  // This would modify various config properties
  return content
}

function updateHandler(content: string, handlerCode: string, jobType: 'task' | 'workflow'): string {
  // TODO: Implementation for replacing handler code
  // This would replace the handler function in the job file
  return content
}

export const updateJobTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  jobsDir: string,
) => {
  const tool = async (
    jobSlug: string,
    updateType: string,
    inputSchema?: SchemaField[],
    outputSchema?: SchemaField[],
    taskSequence?: TaskSequenceItem[],
    configUpdate?: JobConfigUpdate,
    handlerCode?: string,
  ) => {
    if (verboseLogs) {
      req.payload.logger.info(
        `[payload-mcp] Update Job Tool called with: ${jobSlug}, ${updateType}`,
      )
    }

    try {
      const result = await updateJob(
        req,
        verboseLogs,
        jobsDir,
        jobSlug,
        updateType,
        inputSchema,
        outputSchema,
        taskSequence,
        configUpdate,
        handlerCode,
      )

      if (verboseLogs) {
        req.payload.logger.info(`[payload-mcp] Update Job Tool completed successfully`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      req.payload.logger.error(`[payload-mcp] Error in Update Job Tool: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error in Update Job Tool**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'updateJob',
    'Updates an existing Payload job with new configuration, schema, or handler code',
    toolSchemas.updateJob.parameters.shape,
    async (args) => {
      const {
        configUpdate,
        handlerCode,
        inputSchema,
        jobSlug,
        outputSchema,
        taskSequence,
        updateType,
      } = args
      return await tool(
        jobSlug,
        updateType,
        inputSchema as unknown as SchemaField[],
        outputSchema as unknown as SchemaField[],
        taskSequence,
        configUpdate,
        handlerCode,
      )
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/resource/create.ts
Signals: Zod

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { JSONSchema4 } from 'json-schema'
import type { PayloadRequest, TypedUser } from 'payload'

import { z } from 'zod'

import type { PluginMCPServerConfig } from '../../../types.js'

import { toCamelCase } from '../../../utils/camelCase.js'
import { convertCollectionSchemaToZod } from '../../../utils/convertCollectionSchemaToZod.js'
import { toolSchemas } from '../schemas.js'
export const createResourceTool = (
  server: McpServer,
  req: PayloadRequest,
  user: TypedUser,
  verboseLogs: boolean,
  collectionSlug: string,
  collections: PluginMCPServerConfig['collections'],
  schema: JSONSchema4,
) => {
  const tool = async (
    data: string,
    draft: boolean,
    locale?: string,
    fallbackLocale?: string,
  ): Promise<{
    content: Array<{
      text: string
      type: 'text'
    }>
  }> => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Creating resource in collection: ${collectionSlug}${locale ? ` with locale: ${locale}` : ''}`,
      )
    }

    try {
      // Parse the data JSON
      let parsedData: Record<string, unknown>
      try {
        parsedData = JSON.parse(data)
        if (verboseLogs) {
          payload.logger.info(
            `[payload-mcp] Parsed data for ${collectionSlug}: ${JSON.stringify(parsedData)}`,
          )
        }
      } catch (_parseError) {
        payload.logger.error(`[payload-mcp] Invalid JSON data provided: ${data}`)
        return {
          content: [{ type: 'text' as const, text: 'Error: Invalid JSON data provided' }],
        }
      }

      // Create the resource
      const result = await payload.create({
        collection: collectionSlug,
        data: parsedData,
        draft,
        overrideAccess: false,
        req,
        user,
        ...(locale && { locale }),
        ...(fallbackLocale && { fallbackLocale }),
      })

      if (verboseLogs) {
        payload.logger.info(
          `[payload-mcp] Successfully created resource in ${collectionSlug} with ID: ${result.id}`,
        )
      }

      const response = {
        content: [
          {
            type: 'text' as const,
            text: `Resource created successfully in collection "${collectionSlug}"!
Created resource:
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\``,
          },
        ],
      }

      return (collections?.[collectionSlug]?.overrideResponse?.(response, result, req) ||
        response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error creating resource in ${collectionSlug}: ${errorMessage}`,
      )

      const response = {
        content: [
          {
            type: 'text' as const,
            text: `Error creating resource in collection "${collectionSlug}": ${errorMessage}`,
          },
        ],
      }

      return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) || response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    }
  }

  if (collections?.[collectionSlug]?.enabled) {
    const convertedFields = convertCollectionSchemaToZod(schema)

    // Create a new schema that combines the converted fields with create-specific parameters
    const createResourceSchema = z.object({
      ...convertedFields.shape,
      draft: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to create the document as a draft'),
      fallbackLocale: z
        .string()
        .optional()
        .describe('Optional: fallback locale code to use when requested locale is not available'),
      locale: z
        .string()
        .optional()
        .describe(
          'Optional: locale code to create the document in (e.g., "en", "es"). Defaults to the default locale',
        ),
    })

    server.tool(
      `create${collectionSlug.charAt(0).toUpperCase() + toCamelCase(collectionSlug).slice(1)}`,
      `${collections?.[collectionSlug]?.description || toolSchemas.createResource.description.trim()}`,
      createResourceSchema.shape,
      async (params: Record<string, unknown>) => {
        const { draft, fallbackLocale, locale, ...fieldData } = params
        const data = JSON.stringify(fieldData)
        return await tool(
          data,
          draft as boolean,
          locale as string | undefined,
          fallbackLocale as string | undefined,
        )
      },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/resource/delete.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest, TypedUser } from 'payload'

import type { PluginMCPServerConfig } from '../../../types.js'

import { toCamelCase } from '../../../utils/camelCase.js'
import { toolSchemas } from '../schemas.js'

export const deleteResourceTool = (
  server: McpServer,
  req: PayloadRequest,
  user: TypedUser,
  verboseLogs: boolean,
  collectionSlug: string,
  collections: PluginMCPServerConfig['collections'],
) => {
  const tool = async (
    id?: number | string,
    where?: string,
    depth: number = 0,
    locale?: string,
    fallbackLocale?: string,
  ): Promise<{
    content: Array<{
      text: string
      type: 'text'
    }>
  }> => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Deleting resource from collection: ${collectionSlug}${id ? ` with ID: ${id}` : ' with where clause'}${locale ? `, locale: ${locale}` : ''}`,
      )
    }

    try {
      // Validate that either id or where is provided
      if (!id && !where) {
        payload.logger.error('[payload-mcp] Either id or where clause must be provided')
        const response = {
          content: [
            { type: 'text' as const, text: 'Error: Either id or where clause must be provided' },
          ],
        }
        return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
          response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      }

      // Parse where clause if provided
      let whereClause = {}
      if (where) {
        try {
          whereClause = JSON.parse(where)
          if (verboseLogs) {
            payload.logger.info(`[payload-mcp] Using where clause: ${where}`)
          }
        } catch (_parseError) {
          payload.logger.warn(`[payload-mcp] Invalid where clause JSON: ${where}`)
          const response = {
            content: [{ type: 'text' as const, text: 'Error: Invalid JSON in where clause' }],
          }
          return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
            response) as {
            content: Array<{
              text: string
              type: 'text'
            }>
          }
        }
      }

      // Build delete options
      const deleteOptions: Record<string, unknown> = {
        collection: collectionSlug,
        depth,
        overrideAccess: false,
        req,
        user,
        ...(locale && { locale }),
        ...(fallbackLocale && { fallbackLocale }),
      }

      // Delete by ID or where clause
      if (id) {
        deleteOptions.id = id
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Deleting single document with ID: ${id}`)
        }
      } else {
        deleteOptions.where = whereClause
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Deleting multiple documents with where clause`)
        }
      }

      const result = await payload.delete(deleteOptions as Parameters<typeof payload.delete>[0])

      // Handle different result types
      if (id) {
        // Single document deletion
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Successfully deleted document with ID: ${id}`)
        }

        const response = {
          content: [
            {
              type: 'text' as const,
              text: `Document deleted successfully from collection "${collectionSlug}"!
Deleted document:
\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\``,
            },
          ],
        }

        return (collections?.[collectionSlug]?.overrideResponse?.(response, result, req) ||
          response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      } else {
        // Multiple documents deletion
        const bulkResult = result as { docs?: unknown[]; errors?: unknown[] }
        const docs = bulkResult.docs || []
        const errors = bulkResult.errors || []

        if (verboseLogs) {
          payload.logger.info(
            `[payload-mcp] Successfully deleted ${docs.length} documents, ${errors.length} errors`,
          )
        }

        let responseText = `Document deleted successfully from collection "${collectionSlug}"!
Deleted: ${docs.length} documents
Errors: ${errors.length}
---`

        if (docs.length > 0) {
          responseText += `\n\nDeleted documents:
\`\`\`json
${JSON.stringify(docs, null, 2)}
\`\`\``
        }

        if (errors.length > 0) {
          responseText += `\n\nErrors:
\`\`\`json
${JSON.stringify(errors, null, 2)}
\`\`\``
        }

        const response = {
          content: [
            {
              type: 'text' as const,
              text: responseText,
            },
          ],
        }

        return (collections?.[collectionSlug]?.overrideResponse?.(
          response,
          { docs, errors },
          req,
        ) || response) as {
          content: Array<{
            text: string
            type: 'text'
          }>
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error deleting resource from ${collectionSlug}: ${errorMessage}`,
      )

      const response = {
        content: [
          {
            type: 'text' as const,
            text: `Error deleting resource from collection "${collectionSlug}": ${errorMessage}`,
          },
        ],
      }

      return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) || response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    }
  }

  if (collections?.[collectionSlug]?.enabled) {
    server.tool(
      `delete${collectionSlug.charAt(0).toUpperCase() + toCamelCase(collectionSlug).slice(1)}`,
      `${collections?.[collectionSlug]?.description || toolSchemas.deleteResource.description.trim()}`,
      toolSchemas.deleteResource.parameters.shape,
      async ({ id, depth, fallbackLocale, locale, where }) => {
        return await tool(id, where, depth, locale, fallbackLocale)
      },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/resource/find.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest, TypedUser } from 'payload'

import type { PluginMCPServerConfig } from '../../../types.js'

import { toCamelCase } from '../../../utils/camelCase.js'
import { toolSchemas } from '../schemas.js'

export const findResourceTool = (
  server: McpServer,
  req: PayloadRequest,
  user: TypedUser,
  verboseLogs: boolean,
  collectionSlug: string,
  collections: PluginMCPServerConfig['collections'],
) => {
  const tool = async (
    id?: number | string,
    limit: number = 10,
    page: number = 1,
    sort?: string,
    where?: string,
    locale?: string,
    fallbackLocale?: string,
  ): Promise<{
    content: Array<{
      text: string
      type: 'text'
    }>
  }> => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Reading resource from collection: ${collectionSlug}${id ? ` with ID: ${id}` : ''}, limit: ${limit}, page: ${page}${locale ? `, locale: ${locale}` : ''}`,
      )
    }

    try {
      // Parse where clause if provided
      let whereClause = {}
      if (where) {
        try {
          whereClause = JSON.parse(where)
          if (verboseLogs) {
            payload.logger.info(`[payload-mcp] Using where clause: ${where}`)
          }
        } catch (_parseError) {
          payload.logger.warn(`[payload-mcp] Invalid where clause JSON: ${where}`)
          const response = {
            content: [{ type: 'text' as const, text: 'Error: Invalid JSON in where clause' }],
          }
          return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
            response) as {
            content: Array<{
              text: string
              type: 'text'
            }>
          }
        }
      }

      // If ID is provided, use findByID
      if (id) {
        try {
          const doc = await payload.findByID({
            id,
            collection: collectionSlug,
            overrideAccess: false,
            req,
            user,
            ...(locale && { locale }),
            ...(fallbackLocale && { fallbackLocale }),
          })

          if (verboseLogs) {
            payload.logger.info(`[payload-mcp] Found document with ID: ${id}`)
          }

          const response = {
            content: [
              {
                type: 'text' as const,
                text: `Resource from collection "${collectionSlug}":
${JSON.stringify(doc, null, 2)}`,
              },
            ],
          }

          return (collections?.[collectionSlug]?.overrideResponse?.(response, doc, req) ||
            response) as {
            content: Array<{
              text: string
              type: 'text'
            }>
          }
        } catch (_findError) {
          payload.logger.warn(
            `[payload-mcp] Document not found with ID: ${id} in collection: ${collectionSlug}`,
          )
          const response = {
            content: [
              {
                type: 'text' as const,
                text: `Error: Document with ID "${id}" not found in collection "${collectionSlug}"`,
              },
            ],
          }
          return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) ||
            response) as {
            content: Array<{
              text: string
              type: 'text'
            }>
          }
        }
      }

      // Otherwise, use find to get multiple documents
      const findOptions: Parameters<typeof payload.find>[0] = {
        collection: collectionSlug,
        limit,
        overrideAccess: false,
        page,
        req,
        user,
        ...(locale && { locale }),
        ...(fallbackLocale && { fallbackLocale }),
      }

      if (sort) {
        findOptions.sort = sort
      }

      if (Object.keys(whereClause).length > 0) {
        findOptions.where = whereClause
      }

      const result = await payload.find(findOptions)

      if (verboseLogs) {
        payload.logger.info(
          `[payload-mcp] Found ${result.docs.length} documents in collection: ${collectionSlug}`,
        )
      }

      let responseText = `Collection: "${collectionSlug}"
Total: ${result.totalDocs} documents
Page: ${result.page} of ${result.totalPages}
`

      for (const doc of result.docs) {
        responseText += `\n\`\`\`json\n${JSON.stringify(doc, null, 2)}\n\`\`\``
      }

      const response = {
        content: [
          {
            type: 'text' as const,
            text: responseText,
          },
        ],
      }

      return (collections?.[collectionSlug]?.overrideResponse?.(response, result, req) ||
        response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error reading resources from collection ${collectionSlug}: ${errorMessage}`,
      )
      const response = {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error reading resources from collection "${collectionSlug}":** ${errorMessage}`,
          },
        ],
      }
      return (collections?.[collectionSlug]?.overrideResponse?.(response, {}, req) || response) as {
        content: Array<{
          text: string
          type: 'text'
        }>
      }
    }
  }

  if (collections?.[collectionSlug]?.enabled) {
    server.tool(
      `find${collectionSlug.charAt(0).toUpperCase() + toCamelCase(collectionSlug).slice(1)}`,
      `${collections?.[collectionSlug]?.description || toolSchemas.findResources.description.trim()}`,
      toolSchemas.findResources.parameters.shape,
      async ({ id, fallbackLocale, limit, locale, page, sort, where }) => {
        return await tool(id, limit, page, sort, where, locale, fallbackLocale)
      },
    )
  }
}
```

--------------------------------------------------------------------------------

````
