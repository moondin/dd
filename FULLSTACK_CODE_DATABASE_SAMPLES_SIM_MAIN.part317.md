---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 317
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 317 of 933)

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

---[FILE: utils.ts]---
Location: sim-main/apps/sim/app/api/tools/stagehand/utils.ts
Signals: Zod

```typescript
import { z } from 'zod'
import type { Logger } from '@/lib/logs/console/logger'

function jsonSchemaToZod(logger: Logger, jsonSchema: Record<string, any>): z.ZodTypeAny {
  if (!jsonSchema) {
    logger.error('Invalid schema: Schema is null or undefined')
    throw new Error('Invalid schema: Schema is required')
  }

  // Handle non-object schemas (strings, numbers, etc.)
  if (typeof jsonSchema !== 'object' || jsonSchema === null) {
    logger.warn('Schema is not an object, defaulting to any', { type: typeof jsonSchema })
    return z.any()
  }

  // Handle different schema types
  if (jsonSchema.type === 'object' && jsonSchema.properties) {
    const shape: Record<string, z.ZodTypeAny> = {}

    // Create a zod object for each property
    for (const [key, propSchema] of Object.entries(jsonSchema.properties)) {
      shape[key] = jsonSchemaToZod(logger, propSchema as Record<string, any>)

      // Add description if available
      if ((propSchema as Record<string, any>).description) {
        shape[key] = shape[key].describe((propSchema as Record<string, any>).description)
      }
    }

    // Create the base object
    let zodObject = z.object(shape)

    // Handle required fields if specified
    if (jsonSchema.required && Array.isArray(jsonSchema.required)) {
      // For each property that's not in required, make it optional
      for (const key of Object.keys(jsonSchema.properties)) {
        if (!jsonSchema.required.includes(key)) {
          shape[key] = shape[key].optional()
        }
      }

      // Recreate the object with the updated shape
      zodObject = z.object(shape)
    }

    return zodObject
  }
  if (jsonSchema.type === 'array' && jsonSchema.items) {
    const itemSchema = jsonSchemaToZod(logger, jsonSchema.items as Record<string, any>)
    let arraySchema = z.array(itemSchema)

    // Add description if available
    if (jsonSchema.description) {
      arraySchema = arraySchema.describe(jsonSchema.description)
    }

    return arraySchema
  }
  if (jsonSchema.type === 'string') {
    let stringSchema = z.string()

    // Add description if available
    if (jsonSchema.description) {
      stringSchema = stringSchema.describe(jsonSchema.description)
    }

    return stringSchema
  }
  if (jsonSchema.type === 'number') {
    let numberSchema = z.number()

    // Add description if available
    if (jsonSchema.description) {
      numberSchema = numberSchema.describe(jsonSchema.description)
    }

    return numberSchema
  }
  if (jsonSchema.type === 'boolean') {
    let boolSchema = z.boolean()

    // Add description if available
    if (jsonSchema.description) {
      boolSchema = boolSchema.describe(jsonSchema.description)
    }

    return boolSchema
  }
  if (jsonSchema.type === 'null') {
    return z.null()
  }
  if (jsonSchema.type === 'integer') {
    let intSchema = z.number().int()

    // Add description if available
    if (jsonSchema.description) {
      intSchema = intSchema.describe(jsonSchema.description)
    }

    return intSchema
  }
  // For unknown types, return any
  logger.warn('Unknown schema type, defaulting to any', { type: jsonSchema.type })
  return z.any()
}

// Helper function to ensure we have a ZodObject
export function ensureZodObject(logger: Logger, schema: Record<string, any>): z.ZodObject<any> {
  const zodSchema = jsonSchemaToZod(logger, schema)

  // If not already an object type, wrap it in an object
  if (schema.type !== 'object') {
    logger.warn('Schema is not an object type, wrapping in an object', {
      type: schema.type,
    })
    return z.object({ value: zodSchema })
  }

  // Safe cast since we know it's a ZodObject if type is 'object'
  return zodSchema as z.ZodObject<any>
}

export function normalizeUrl(url: string): string {
  // Normalize the URL - only add https:// if needed
  let normalizedUrl = url

  // Add https:// if no protocol is specified
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  return normalizedUrl
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/stagehand/agent/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { ensureZodObject, normalizeUrl } from '@/app/api/tools/stagehand/utils'

const logger = createLogger('StagehandAgentAPI')

type StagehandType = import('@browserbasehq/stagehand').Stagehand

const BROWSERBASE_API_KEY = env.BROWSERBASE_API_KEY
const BROWSERBASE_PROJECT_ID = env.BROWSERBASE_PROJECT_ID

const requestSchema = z.object({
  task: z.string().min(1),
  startUrl: z.string().url(),
  outputSchema: z.any(),
  variables: z.any(),
  provider: z.enum(['openai', 'anthropic']).optional().default('openai'),
  apiKey: z.string(),
})

/**
 * Extracts the inner schema object from a potentially nested schema structure
 */
function getSchemaObject(outputSchema: Record<string, any>): Record<string, any> {
  if (outputSchema.schema && typeof outputSchema.schema === 'object') {
    return outputSchema.schema
  }
  return outputSchema
}

/**
 * Formats a schema object as a string for inclusion in agent instructions
 */
function formatSchemaForInstructions(schema: Record<string, any>): string {
  try {
    return JSON.stringify(schema, null, 2)
  } catch (error) {
    logger.error('Error formatting schema for instructions', { error })
    return JSON.stringify(schema)
  }
}

/**
 * Processes variables from various input formats into a standardized key-value object
 */
function processVariables(variables: any): Record<string, string> | undefined {
  if (!variables) return undefined

  let variablesObject: Record<string, string> = {}

  if (Array.isArray(variables)) {
    variables.forEach((item: any) => {
      if (item?.cells?.Key && typeof item.cells.Key === 'string') {
        variablesObject[item.cells.Key] = item.cells.Value || ''
      }
    })
  } else if (typeof variables === 'object' && variables !== null) {
    variablesObject = { ...variables }
  } else if (typeof variables === 'string') {
    try {
      variablesObject = JSON.parse(variables)
    } catch (_e) {
      logger.warn('Failed to parse variables string as JSON', { variables })
      return undefined
    }
  }

  if (Object.keys(variablesObject).length === 0) {
    return undefined
  }

  return variablesObject
}

/**
 * Substitutes variable placeholders in text with their actual values
 * Variables are referenced using %key% syntax
 */
function substituteVariables(text: string, variables: Record<string, string> | undefined): string {
  if (!variables) return text

  let result = text
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `%${key}%`
    result = result.split(placeholder).join(value)
  }
  return result
}

export async function POST(request: NextRequest) {
  let stagehand: StagehandType | null = null

  try {
    const body = await request.json()
    logger.info('Received Stagehand agent request', {
      startUrl: body.startUrl,
      hasTask: !!body.task,
      hasVariables: !!body.variables,
      hasSchema: !!body.outputSchema,
    })

    const validationResult = requestSchema.safeParse(body)

    if (!validationResult.success) {
      logger.error('Invalid request body', { errors: validationResult.error.errors })
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const params = validationResult.data
    const { task, startUrl: rawStartUrl, outputSchema, provider, apiKey } = params
    const variablesObject = processVariables(params.variables)

    const startUrl = normalizeUrl(rawStartUrl)

    logger.info('Starting Stagehand agent process', {
      rawStartUrl,
      startUrl,
      hasTask: !!task,
      hasVariables: !!variablesObject,
      provider,
    })

    if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
      logger.error('Missing required environment variables', {
        hasBrowserbaseApiKey: !!BROWSERBASE_API_KEY,
        hasBrowserbaseProjectId: !!BROWSERBASE_PROJECT_ID,
      })

      return NextResponse.json(
        { error: 'Server configuration error: Missing required environment variables' },
        { status: 500 }
      )
    }

    if (!apiKey || typeof apiKey !== 'string') {
      logger.error('API key is required')
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    if (provider === 'openai' && !apiKey.startsWith('sk-')) {
      logger.error('Invalid OpenAI API key format')
      return NextResponse.json({ error: 'Invalid OpenAI API key format' }, { status: 400 })
    }

    if (provider === 'anthropic' && !apiKey.startsWith('sk-ant-')) {
      logger.error('Invalid Anthropic API key format')
      return NextResponse.json({ error: 'Invalid Anthropic API key format' }, { status: 400 })
    }

    const modelName =
      provider === 'anthropic' ? 'anthropic/claude-3-7-sonnet-latest' : 'openai/gpt-4.1'

    try {
      logger.info('Initializing Stagehand with Browserbase (v3)', { provider, modelName })

      const { Stagehand } = await import('@browserbasehq/stagehand')

      stagehand = new Stagehand({
        env: 'BROWSERBASE',
        apiKey: BROWSERBASE_API_KEY,
        projectId: BROWSERBASE_PROJECT_ID,
        verbose: 1,
        disableAPI: true, // Use local agent handler instead of Browserbase API
        logger: (msg) => logger.info(typeof msg === 'string' ? msg : JSON.stringify(msg)),
        model: {
          modelName,
          apiKey: apiKey,
        },
      })

      logger.info('Starting stagehand.init()')
      await stagehand.init()
      logger.info('Stagehand initialized successfully')

      const page = stagehand.context.pages()[0]
      logger.info(`Navigating to ${startUrl}`)
      await page.goto(startUrl, { waitUntil: 'networkidle' })
      logger.info('Navigation complete')

      const taskWithVariables = substituteVariables(task, variablesObject)

      let agentInstructions = `You are a helpful web browsing assistant. Complete the following task: ${taskWithVariables}`

      if (variablesObject && Object.keys(variablesObject).length > 0) {
        const safeVarKeys = Object.keys(variablesObject).map((key) => {
          return key.toLowerCase().includes('password') ? `${key}: [REDACTED]` : key
        })
        logger.info('Variables available for task', { variables: safeVarKeys })
      }

      if (outputSchema && typeof outputSchema === 'object' && outputSchema !== null) {
        const schemaObj = getSchemaObject(outputSchema)
        agentInstructions += `\n\nIMPORTANT: You MUST return your final result in the following JSON format exactly:\n${formatSchemaForInstructions(schemaObj)}\n\nYour response should consist of valid JSON only, with no additional text.`
      }

      logger.info('Creating Stagehand agent')

      const agent = stagehand.agent({
        model: {
          modelName,
          apiKey: apiKey,
        },
        executionModel: {
          modelName,
          apiKey: apiKey,
        },
        systemPrompt: agentInstructions,
      })

      logger.info('Executing agent task', { task: taskWithVariables })

      const agentExecutionResult = await agent.execute({
        instruction: taskWithVariables,
        maxSteps: 20,
      })

      const agentResult = {
        success: agentExecutionResult.success,
        completed: agentExecutionResult.completed,
        message: agentExecutionResult.message,
        actions: agentExecutionResult.actions,
      }

      logger.info('Agent execution complete', {
        success: agentResult.success,
        completed: agentResult.completed,
        actionCount: agentResult.actions?.length || 0,
      })

      let structuredOutput = null
      const hasOutputSchema =
        outputSchema && typeof outputSchema === 'object' && outputSchema !== null

      if (agentResult.message) {
        try {
          let jsonContent = agentResult.message

          const jsonBlockMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (jsonBlockMatch?.[1]) {
            jsonContent = jsonBlockMatch[1]
          }

          structuredOutput = JSON.parse(jsonContent)
          logger.info('Successfully parsed structured output from agent response')
        } catch (parseError) {
          if (hasOutputSchema) {
            logger.warn('Failed to parse JSON from agent message, attempting fallback extraction', {
              error: parseError,
            })

            if (stagehand) {
              try {
                logger.info('Attempting to extract structured data using Stagehand extract')
                const schemaObj = getSchemaObject(outputSchema)
                const zodSchema = ensureZodObject(logger, schemaObj)

                structuredOutput = await stagehand.extract(
                  'Extract the requested information from this page according to the schema',
                  zodSchema
                )

                logger.info('Successfully extracted structured data as fallback', {
                  keys: structuredOutput ? Object.keys(structuredOutput) : [],
                })
              } catch (extractError) {
                logger.error('Fallback extraction also failed', { error: extractError })
              }
            }
          } else {
            logger.info('Agent returned plain text response (no schema provided)')
          }
        }
      }

      return NextResponse.json({
        agentResult,
        structuredOutput,
      })
    } catch (error) {
      logger.error('Stagehand agent execution error', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })

      let errorMessage = 'Unknown error during agent execution'
      let errorDetails: Record<string, any> = {}

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails = {
          name: error.name,
          stack: error.stack,
        }

        const errorObj = error as any
        if (typeof errorObj.code !== 'undefined') {
          errorDetails.code = errorObj.code
        }
        if (typeof errorObj.statusCode !== 'undefined') {
          errorDetails.statusCode = errorObj.statusCode
        }
        if (typeof errorObj.response !== 'undefined') {
          errorDetails.response = errorObj.response
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error('Unexpected error in agent API route', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    if (stagehand) {
      try {
        logger.info('Closing Stagehand instance')
        await stagehand.close()
      } catch (closeError) {
        logger.error('Error closing Stagehand instance', { error: closeError })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/stagehand/extract/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { ensureZodObject, normalizeUrl } from '@/app/api/tools/stagehand/utils'

const logger = createLogger('StagehandExtractAPI')

type StagehandType = import('@browserbasehq/stagehand').Stagehand

const BROWSERBASE_API_KEY = env.BROWSERBASE_API_KEY
const BROWSERBASE_PROJECT_ID = env.BROWSERBASE_PROJECT_ID

const requestSchema = z.object({
  instruction: z.string(),
  schema: z.record(z.any()),
  useTextExtract: z.boolean().optional().default(false),
  selector: z.string().nullable().optional(),
  provider: z.enum(['openai', 'anthropic']).optional().default('openai'),
  apiKey: z.string(),
  url: z.string().url(),
})

export async function POST(request: NextRequest) {
  let stagehand: StagehandType | null = null

  try {
    const body = await request.json()
    logger.info('Received extraction request', {
      url: body.url,
      hasInstruction: !!body.instruction,
      schema: body.schema ? typeof body.schema : 'none',
    })

    const validationResult = requestSchema.safeParse(body)

    if (!validationResult.success) {
      logger.error('Invalid request body', { errors: validationResult.error.errors })
      return NextResponse.json(
        { error: 'Invalid request parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const params = validationResult.data
    const { url: rawUrl, instruction, selector, provider, apiKey, schema } = params
    const url = normalizeUrl(rawUrl)

    logger.info('Starting Stagehand extraction process', {
      rawUrl,
      url,
      hasInstruction: !!instruction,
      schemaType: typeof schema,
    })

    if (!schema || typeof schema !== 'object') {
      logger.error('Invalid schema format', { schema })
      return NextResponse.json(
        { error: 'Invalid schema format. Schema must be a valid JSON object.' },
        { status: 400 }
      )
    }

    if (!BROWSERBASE_API_KEY || !BROWSERBASE_PROJECT_ID) {
      logger.error('Missing required environment variables', {
        hasBrowserbaseApiKey: !!BROWSERBASE_API_KEY,
        hasBrowserbaseProjectId: !!BROWSERBASE_PROJECT_ID,
      })

      return NextResponse.json(
        { error: 'Server configuration error: Missing required environment variables' },
        { status: 500 }
      )
    }

    if (!apiKey || typeof apiKey !== 'string') {
      logger.error('API key is required')
      return NextResponse.json({ error: 'API key is required' }, { status: 400 })
    }

    if (provider === 'openai' && !apiKey.startsWith('sk-')) {
      logger.error('Invalid OpenAI API key format')
      return NextResponse.json({ error: 'Invalid OpenAI API key format' }, { status: 400 })
    }

    if (provider === 'anthropic' && !apiKey.startsWith('sk-ant-')) {
      logger.error('Invalid Anthropic API key format')
      return NextResponse.json({ error: 'Invalid Anthropic API key format' }, { status: 400 })
    }

    try {
      const modelName =
        provider === 'anthropic' ? 'anthropic/claude-3-7-sonnet-latest' : 'openai/gpt-4.1'

      logger.info('Initializing Stagehand with Browserbase (v3)', { provider, modelName })

      const { Stagehand } = await import('@browserbasehq/stagehand')

      stagehand = new Stagehand({
        env: 'BROWSERBASE',
        apiKey: BROWSERBASE_API_KEY,
        projectId: BROWSERBASE_PROJECT_ID,
        verbose: 1,
        logger: (msg) => logger.info(typeof msg === 'string' ? msg : JSON.stringify(msg)),
        model: {
          modelName,
          apiKey: apiKey,
        },
      })

      logger.info('Starting stagehand.init()')
      await stagehand.init()
      logger.info('Stagehand initialized successfully')

      const page = stagehand.context.pages()[0]

      logger.info(`Navigating to ${url}`)
      await page.goto(url, { waitUntil: 'networkidle' })
      logger.info('Navigation complete')

      logger.info('Preparing extraction schema', {
        schema: `${JSON.stringify(schema).substring(0, 100)}...`,
      })

      logger.info('Extracting data with Stagehand')

      try {
        const schemaToConvert = schema.schema || schema

        let zodSchema
        try {
          logger.info('Creating Zod schema from JSON schema', {
            schemaType: typeof schemaToConvert,
            hasNestedSchema: !!schema.schema,
          })

          zodSchema = ensureZodObject(logger, schemaToConvert)

          logger.info('Successfully created Zod schema')
        } catch (schemaError) {
          logger.error('Failed to convert JSON schema to Zod schema', {
            error: schemaError,
            message: schemaError instanceof Error ? schemaError.message : 'Unknown schema error',
          })

          logger.info('Falling back to simple extraction without schema')
          zodSchema = undefined
        }

        logger.info('Calling stagehand.extract with options', {
          hasInstruction: !!instruction,
          hasSchema: !!zodSchema,
          hasSelector: !!selector,
        })

        let extractedData
        if (zodSchema) {
          extractedData = await stagehand.extract(instruction, zodSchema, {
            selector: selector || undefined,
          })
        } else {
          extractedData = await stagehand.extract(instruction)
        }

        logger.info('Extraction successful', {
          hasData: !!extractedData,
          dataType: typeof extractedData,
          dataKeys: extractedData ? Object.keys(extractedData) : [],
        })

        return NextResponse.json({
          data: extractedData,
          schema,
        })
      } catch (extractError) {
        logger.error('Error during extraction operation', {
          error: extractError,
          message:
            extractError instanceof Error ? extractError.message : 'Unknown extraction error',
        })
        throw extractError
      }
    } catch (error) {
      logger.error('Stagehand extraction error', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })

      let errorMessage = 'Unknown error during extraction'
      let errorDetails: Record<string, any> = {}

      if (error instanceof Error) {
        errorMessage = error.message
        errorDetails = {
          name: error.name,
          stack: error.stack,
        }

        const errorObj = error as any
        if (typeof errorObj.code !== 'undefined') {
          errorDetails.code = errorObj.code
        }
        if (typeof errorObj.statusCode !== 'undefined') {
          errorDetails.statusCode = errorObj.statusCode
        }
        if (typeof errorObj.response !== 'undefined') {
          errorDetails.response = errorObj.response
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    logger.error('Unexpected error in extraction API route', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    if (stagehand) {
      try {
        logger.info('Closing Stagehand instance')
        await stagehand.close()
      } catch (closeError) {
        logger.error('Error closing Stagehand instance', { error: closeError })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/telegram/send-document/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processFilesToUserFiles } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'
import { convertMarkdownToHTML } from '@/tools/telegram/utils'

export const dynamic = 'force-dynamic'

const logger = createLogger('TelegramSendDocumentAPI')

const TelegramSendDocumentSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  files: z.array(z.any()).optional().nullable(),
  caption: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, {
      requireWorkflowId: false,
    })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Telegram send attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Telegram send request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = TelegramSendDocumentSchema.parse(body)

    logger.info(`[${requestId}] Sending Telegram document`, {
      chatId: validatedData.chatId,
      hasFiles: !!(validatedData.files && validatedData.files.length > 0),
      fileCount: validatedData.files?.length || 0,
    })

    if (!validatedData.files || validatedData.files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one document file is required for sendDocument operation',
        },
        { status: 400 }
      )
    }

    const userFiles = processFilesToUserFiles(validatedData.files, requestId, logger)

    if (userFiles.length === 0) {
      logger.warn(`[${requestId}] No valid files to upload`)
      return NextResponse.json(
        {
          success: false,
          error: 'No valid files provided for upload',
        },
        { status: 400 }
      )
    }

    const maxSize = 50 * 1024 * 1024 // 50MB
    const tooLargeFiles = userFiles.filter((file) => file.size > maxSize)

    if (tooLargeFiles.length > 0) {
      const filesInfo = tooLargeFiles
        .map((f) => `${f.name} (${(f.size / (1024 * 1024)).toFixed(2)}MB)`)
        .join(', ')
      return NextResponse.json(
        {
          success: false,
          error: `The following files exceed Telegram's 50MB limit: ${filesInfo}`,
        },
        { status: 400 }
      )
    }

    const userFile = userFiles[0]
    logger.info(`[${requestId}] Uploading document: ${userFile.name}`)

    const buffer = await downloadFileFromStorage(userFile, requestId, logger)

    logger.info(`[${requestId}] Downloaded file: ${buffer.length} bytes`)

    const formData = new FormData()
    formData.append('chat_id', validatedData.chatId)

    const blob = new Blob([new Uint8Array(buffer)], { type: userFile.type })
    formData.append('document', blob, userFile.name)

    if (validatedData.caption) {
      formData.append('caption', convertMarkdownToHTML(validatedData.caption))
      formData.append('parse_mode', 'HTML')
    }

    const telegramApiUrl = `https://api.telegram.org/bot${validatedData.botToken}/sendDocument`
    logger.info(`[${requestId}] Sending request to Telegram API`)

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!data.ok) {
      logger.error(`[${requestId}] Telegram API error:`, data)
      return NextResponse.json(
        {
          success: false,
          error: data.description || 'Failed to send document to Telegram',
        },
        { status: response.status }
      )
    }

    logger.info(`[${requestId}] Document sent successfully`)

    return NextResponse.json({
      success: true,
      output: {
        message: 'Document sent successfully',
        data: data.result,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error sending Telegram document:`, error)
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
Location: sim-main/apps/sim/app/api/tools/thinking/route.ts
Signals: Next.js

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import type { ThinkingToolParams, ThinkingToolResponse } from '@/tools/thinking/types'

const logger = createLogger('ThinkingToolAPI')

export const dynamic = 'force-dynamic'

/**
 * POST - Process a thinking tool request
 * Simply acknowledges the thought by returning it in the output
 */
export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const body: ThinkingToolParams = await request.json()

    logger.info(`[${requestId}] Processing thinking tool request`)

    // Validate the required parameter
    if (!body.thought || typeof body.thought !== 'string') {
      logger.warn(`[${requestId}] Missing or invalid 'thought' parameter`)
      return NextResponse.json(
        {
          success: false,
          error: 'The thought parameter is required and must be a string',
        },
        { status: 400 }
      )
    }

    // Simply acknowledge the thought by returning it in the output
    const response: ThinkingToolResponse = {
      success: true,
      output: {
        acknowledgedThought: body.thought,
      },
    }

    logger.info(`[${requestId}] Thinking tool processed successfully`)
    return NextResponse.json(response)
  } catch (error) {
    logger.error(`[${requestId}] Error processing thinking tool:`, error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process thinking tool request',
      },
      { status: 500 }
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/tools/vision/analyze/route.ts
Signals: Next.js, Zod

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkHybridAuth } from '@/lib/auth/hybrid'
import { generateRequestId } from '@/lib/core/utils/request'
import { createLogger } from '@/lib/logs/console/logger'
import { processSingleFileToUserFile } from '@/lib/uploads/utils/file-utils'
import { downloadFileFromStorage } from '@/lib/uploads/utils/file-utils.server'

export const dynamic = 'force-dynamic'

const logger = createLogger('VisionAnalyzeAPI')

const VisionAnalyzeSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  imageUrl: z.string().optional().nullable(),
  imageFile: z.any().optional().nullable(),
  model: z.string().optional().default('gpt-4o'),
  prompt: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  const requestId = generateRequestId()

  try {
    const authResult = await checkHybridAuth(request, { requireWorkflowId: false })

    if (!authResult.success) {
      logger.warn(`[${requestId}] Unauthorized Vision analyze attempt: ${authResult.error}`)
      return NextResponse.json(
        {
          success: false,
          error: authResult.error || 'Authentication required',
        },
        { status: 401 }
      )
    }

    logger.info(`[${requestId}] Authenticated Vision analyze request via ${authResult.authType}`, {
      userId: authResult.userId,
    })

    const body = await request.json()
    const validatedData = VisionAnalyzeSchema.parse(body)

    if (!validatedData.imageUrl && !validatedData.imageFile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either imageUrl or imageFile is required',
        },
        { status: 400 }
      )
    }

    logger.info(`[${requestId}] Analyzing image`, {
      hasFile: !!validatedData.imageFile,
      hasUrl: !!validatedData.imageUrl,
      model: validatedData.model,
    })

    let imageSource: string = validatedData.imageUrl || ''

    if (validatedData.imageFile) {
      const rawFile = validatedData.imageFile
      logger.info(`[${requestId}] Processing image file: ${rawFile.name}`)

      let userFile
      try {
        userFile = processSingleFileToUserFile(rawFile, requestId, logger)
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process image file',
          },
          { status: 400 }
        )
      }

      const buffer = await downloadFileFromStorage(userFile, requestId, logger)

      const base64 = buffer.toString('base64')
      const mimeType = userFile.type || 'image/jpeg'
      imageSource = `data:${mimeType};base64,${base64}`
      logger.info(`[${requestId}] Converted image to base64 (${buffer.length} bytes)`)
    }

    const defaultPrompt = 'Please analyze this image and describe what you see in detail.'
    const prompt = validatedData.prompt || defaultPrompt

    const isClaude = validatedData.model.startsWith('claude-3')
    const apiUrl = isClaude
      ? 'https://api.anthropic.com/v1/messages'
      : 'https://api.openai.com/v1/chat/completions'

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (isClaude) {
      headers['x-api-key'] = validatedData.apiKey
      headers['anthropic-version'] = '2023-06-01'
    } else {
      headers.Authorization = `Bearer ${validatedData.apiKey}`
    }

    let requestBody: any

    if (isClaude) {
      if (imageSource.startsWith('data:')) {
        const base64Match = imageSource.match(/^data:([^;]+);base64,(.+)$/)
        if (!base64Match) {
          return NextResponse.json(
            { success: false, error: 'Invalid base64 image format' },
            { status: 400 }
          )
        }
        const [, mediaType, base64Data] = base64Match

        requestBody = {
          model: validatedData.model,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: mediaType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }
      } else {
        requestBody = {
          model: validatedData.model,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image',
                  source: { type: 'url', url: imageSource },
                },
              ],
            },
          ],
        }
      }
    } else {
      requestBody = {
        model: validatedData.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: imageSource,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }
    }

    logger.info(`[${requestId}] Sending request to ${isClaude ? 'Anthropic' : 'OpenAI'} API`)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error(`[${requestId}] Vision API error:`, errorData)
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || errorData.message || 'Failed to analyze image',
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    const result = data.content?.[0]?.text || data.choices?.[0]?.message?.content

    logger.info(`[${requestId}] Image analyzed successfully`)

    return NextResponse.json({
      success: true,
      output: {
        content: result,
        model: data.model,
        tokens: data.content
          ? (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
          : data.usage?.total_tokens,
        usage: data.usage
          ? {
              input_tokens: data.usage.input_tokens,
              output_tokens: data.usage.output_tokens,
              total_tokens:
                data.usage.total_tokens ||
                (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
            }
          : undefined,
      },
    })
  } catch (error) {
    logger.error(`[${requestId}] Error analyzing image:`, error)
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
