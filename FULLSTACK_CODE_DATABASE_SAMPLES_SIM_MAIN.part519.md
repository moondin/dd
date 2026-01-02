---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 519
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 519 of 933)

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

---[FILE: generic-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/generic/generic-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getBlock } from '@/blocks/index'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'
import { executeTool } from '@/tools'
import { getTool } from '@/tools/utils'

const logger = createLogger('GenericBlockHandler')

export class GenericBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return true
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<any> {
    const isMcpTool = block.config.tool?.startsWith('mcp-')
    let tool = null

    if (!isMcpTool) {
      tool = getTool(block.config.tool)
      if (!tool) {
        throw new Error(`Tool not found: ${block.config.tool}`)
      }
    }

    let finalInputs = { ...inputs }

    const blockType = block.metadata?.id
    if (blockType) {
      const blockConfig = getBlock(blockType)
      if (blockConfig?.tools?.config?.params) {
        try {
          const transformedParams = blockConfig.tools.config.params(inputs)
          finalInputs = { ...inputs, ...transformedParams }
        } catch (error) {
          logger.warn(`Failed to apply parameter transformation for block type ${blockType}:`, {
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

      if (blockConfig?.inputs) {
        for (const [key, inputSchema] of Object.entries(blockConfig.inputs)) {
          const value = finalInputs[key]
          if (typeof value === 'string' && value.trim().length > 0) {
            const inputType = typeof inputSchema === 'object' ? inputSchema.type : inputSchema
            if (inputType === 'json' || inputType === 'array') {
              try {
                finalInputs[key] = JSON.parse(value.trim())
              } catch (error) {
                logger.warn(`Failed to parse ${inputType} field "${key}":`, {
                  error: error instanceof Error ? error.message : String(error),
                })
              }
            }
          }
        }
      }
    }

    try {
      const result = await executeTool(
        block.config.tool,
        {
          ...finalInputs,
          _context: {
            workflowId: ctx.workflowId,
            workspaceId: ctx.workspaceId,
            executionId: ctx.executionId,
          },
        },
        false,
        false,
        ctx
      )

      if (!result.success) {
        const errorDetails = []
        if (result.error) errorDetails.push(result.error)

        const errorMessage =
          errorDetails.length > 0
            ? errorDetails.join(' - ')
            : `Block execution of ${tool?.name || block.config.tool} failed with no error message`

        const error = new Error(errorMessage)

        Object.assign(error, {
          toolId: block.config.tool,
          toolName: tool?.name || 'Unknown tool',
          blockId: block.id,
          blockName: block.metadata?.name || 'Unnamed Block',
          output: result.output || {},
          timestamp: new Date().toISOString(),
        })

        throw error
      }

      const output = result.output
      let cost = null

      if (output?.cost) {
        cost = output.cost
      }

      if (cost) {
        return {
          ...output,
          cost: {
            input: cost.input,
            output: cost.output,
            total: cost.total,
          },
          tokens: cost.tokens,
          model: cost.model,
        }
      }

      return output
    } catch (error: any) {
      if (!error.message || error.message === 'undefined (undefined)') {
        let errorMessage = `Block execution of ${tool?.name || block.config.tool} failed`

        if (block.metadata?.name) {
          errorMessage += `: ${block.metadata.name}`
        }

        if (error.status) {
          errorMessage += ` (Status: ${error.status})`
        }

        error.message = errorMessage
      }

      if (typeof error === 'object' && error !== null) {
        if (!error.toolId) error.toolId = block.config.tool
        if (!error.blockName) error.blockName = block.metadata?.name || 'Unnamed Block'
      }

      throw error
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: human-in-the-loop-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/human-in-the-loop/human-in-the-loop-handler.ts

```typescript
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockOutput } from '@/blocks/types'
import {
  BlockType,
  buildResumeApiUrl,
  buildResumeUiUrl,
  type FieldType,
  HTTP,
  PAUSE_RESUME,
} from '@/executor/constants'
import {
  generatePauseContextId,
  mapNodeMetadataToPauseScopes,
} from '@/executor/human-in-the-loop/utils'
import type { BlockHandler, ExecutionContext, PauseMetadata } from '@/executor/types'
import { collectBlockData } from '@/executor/utils/block-data'
import type { SerializedBlock } from '@/serializer/types'
import { normalizeBlockName } from '@/stores/workflows/utils'
import { executeTool } from '@/tools'

const logger = createLogger('HumanInTheLoopBlockHandler')

interface JSONProperty {
  id: string
  name: string
  type: FieldType
  value: any
  collapsed?: boolean
}

interface ResponseStructureEntry {
  name: string
  type: string
  value: any
}

interface NormalizedInputField {
  id: string
  name: string
  label: string
  type: string
  description?: string
  placeholder?: string
  value?: any
  required?: boolean
  options?: any[]
}

interface NotificationToolResult {
  toolId: string
  title?: string
  operation?: string
  success: boolean
  durationMs?: number
}

export class HumanInTheLoopBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.HUMAN_IN_THE_LOOP
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    return this.executeWithNode(ctx, block, inputs, {
      nodeId: block.id,
    })
  }

  async executeWithNode(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>,
    nodeMetadata: {
      nodeId: string
      loopId?: string
      parallelId?: string
      branchIndex?: number
      branchTotal?: number
    }
  ): Promise<BlockOutput> {
    try {
      const operation = inputs.operation ?? PAUSE_RESUME.OPERATION.HUMAN

      const { parallelScope, loopScope } = mapNodeMetadataToPauseScopes(ctx, nodeMetadata)
      const contextId = generatePauseContextId(block.id, nodeMetadata, loopScope)
      const timestamp = new Date().toISOString()

      const executionId = ctx.executionId ?? ctx.metadata?.executionId
      const workflowId = ctx.workflowId

      let resumeLinks: typeof pauseMetadata.resumeLinks | undefined
      if (executionId && workflowId) {
        try {
          const baseUrl = getBaseUrl()
          resumeLinks = {
            apiUrl: buildResumeApiUrl(baseUrl, workflowId, executionId, contextId),
            uiUrl: buildResumeUiUrl(baseUrl, workflowId, executionId),
            contextId,
            executionId,
            workflowId,
          }
        } catch (error) {
          logger.warn('Failed to get base URL, using relative paths', { error })
          resumeLinks = {
            apiUrl: buildResumeApiUrl(undefined, workflowId, executionId, contextId),
            uiUrl: buildResumeUiUrl(undefined, workflowId, executionId),
            contextId,
            executionId,
            workflowId,
          }
        }
      }

      const normalizedInputFormat = this.normalizeInputFormat(inputs.inputFormat)
      const responseStructure = this.normalizeResponseStructure(inputs.builderData)

      let responseData: any
      let statusCode: number
      let responseHeaders: Record<string, string>

      if (operation === PAUSE_RESUME.OPERATION.API) {
        const parsed = this.parseResponseData(inputs)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          responseData = {
            ...parsed,
            operation,
            responseStructure:
              parsed.responseStructure && Array.isArray(parsed.responseStructure)
                ? parsed.responseStructure
                : responseStructure,
          }
        } else {
          responseData = parsed
        }
        statusCode = this.parseStatus(inputs.status)
        responseHeaders = this.parseHeaders(inputs.headers)
      } else {
        responseData = {
          operation,
          responseStructure,
          inputFormat: normalizedInputFormat,
          submission: null,
        }
        statusCode = HTTP.STATUS.OK
        responseHeaders = { 'Content-Type': HTTP.CONTENT_TYPE.JSON }
      }

      let notificationResults: NotificationToolResult[] | undefined

      if (
        operation === PAUSE_RESUME.OPERATION.HUMAN &&
        inputs.notification &&
        Array.isArray(inputs.notification)
      ) {
        notificationResults = await this.executeNotificationTools(ctx, block, inputs.notification, {
          resumeLinks,
          executionId,
          workflowId,
          inputFormat: normalizedInputFormat,
          responseStructure,
          operation,
        })
      }

      const responseDataWithResume =
        resumeLinks &&
        responseData &&
        typeof responseData === 'object' &&
        !Array.isArray(responseData)
          ? { ...responseData, _resume: resumeLinks }
          : responseData

      const pauseMetadata: PauseMetadata = {
        contextId,
        blockId: nodeMetadata.nodeId,
        response: {
          data: responseDataWithResume,
          status: statusCode,
          headers: responseHeaders,
        },
        timestamp,
        parallelScope,
        loopScope,
        resumeLinks,
      }

      const responseOutput: Record<string, any> = {
        data: responseDataWithResume,
        status: statusCode,
        headers: responseHeaders,
        operation,
      }

      if (operation === PAUSE_RESUME.OPERATION.HUMAN) {
        responseOutput.responseStructure = responseStructure
        responseOutput.inputFormat = normalizedInputFormat
        responseOutput.submission = null
      }

      if (resumeLinks) {
        responseOutput.resume = resumeLinks
      }

      const structuredFields: Record<string, any> = {}
      if (operation === PAUSE_RESUME.OPERATION.HUMAN) {
        for (const field of normalizedInputFormat) {
          if (field.name) {
            structuredFields[field.name] = field.value !== undefined ? field.value : null
          }
        }
      }

      const output: Record<string, any> = {
        ...structuredFields,
        response: responseOutput,
        _pauseMetadata: pauseMetadata,
      }

      if (notificationResults && notificationResults.length > 0) {
        output.notificationResults = notificationResults
      }

      if (resumeLinks) {
        output.url = resumeLinks.uiUrl
        // output.apiUrl = resumeLinks.apiUrl // Hidden from output
      }

      return output
    } catch (error: any) {
      logger.error('Pause resume block execution failed:', error)
      return {
        response: {
          data: {
            error: 'Pause resume block execution failed',
            message: error.message || 'Unknown error',
          },
          status: HTTP.STATUS.SERVER_ERROR,
          headers: { 'Content-Type': HTTP.CONTENT_TYPE.JSON },
        },
      }
    }
  }

  private parseResponseData(inputs: Record<string, any>): any {
    const dataMode = inputs.dataMode || 'structured'

    if (dataMode === 'json' && inputs.data) {
      if (typeof inputs.data === 'string') {
        try {
          return JSON.parse(inputs.data)
        } catch (error) {
          logger.warn('Failed to parse JSON data, returning as string:', error)
          return inputs.data
        }
      } else if (typeof inputs.data === 'object' && inputs.data !== null) {
        return inputs.data
      }
      return inputs.data
    }

    if (dataMode === 'structured' && inputs.builderData) {
      const convertedData = this.convertBuilderDataToJson(inputs.builderData)
      return this.parseObjectStrings(convertedData)
    }

    return inputs.data || {}
  }

  private normalizeResponseStructure(
    builderData?: JSONProperty[],
    prefix = ''
  ): ResponseStructureEntry[] {
    if (!Array.isArray(builderData)) {
      return []
    }

    const entries: ResponseStructureEntry[] = []

    for (const prop of builderData) {
      const fieldName = typeof prop.name === 'string' ? prop.name.trim() : ''
      if (!fieldName) continue

      const path = prefix ? `${prefix}.${fieldName}` : fieldName

      if (prop.type === 'object' && Array.isArray(prop.value)) {
        const nested = this.normalizeResponseStructure(prop.value, path)
        if (nested.length > 0) {
          entries.push(...nested)
          continue
        }
      }

      const value = this.convertPropertyValue(prop)

      entries.push({
        name: path,
        type: prop.type,
        value,
      })
    }

    return entries
  }

  private normalizeInputFormat(inputFormat: any): NormalizedInputField[] {
    if (!Array.isArray(inputFormat)) {
      return []
    }

    return inputFormat
      .map((field: any, index: number) => {
        const name = typeof field?.name === 'string' ? field.name.trim() : ''
        if (!name) return null

        const id =
          typeof field?.id === 'string' && field.id.length > 0 ? field.id : `field_${index}`
        const label =
          typeof field?.label === 'string' && field.label.trim().length > 0
            ? field.label.trim()
            : name
        const type =
          typeof field?.type === 'string' && field.type.trim().length > 0 ? field.type : 'string'
        const description =
          typeof field?.description === 'string' && field.description.trim().length > 0
            ? field.description.trim()
            : undefined
        const placeholder =
          typeof field?.placeholder === 'string' && field.placeholder.trim().length > 0
            ? field.placeholder.trim()
            : undefined
        const required = field?.required === true
        const options = Array.isArray(field?.options) ? field.options : undefined

        return {
          id,
          name,
          label,
          type,
          description,
          placeholder,
          value: field?.value,
          required,
          options,
        } as NormalizedInputField
      })
      .filter((field): field is NormalizedInputField => field !== null)
  }

  private convertBuilderDataToJson(builderData: JSONProperty[]): any {
    if (!Array.isArray(builderData)) {
      return {}
    }

    const result: any = {}

    for (const prop of builderData) {
      if (!prop.name || !prop.name.trim()) {
        continue
      }

      const value = this.convertPropertyValue(prop)
      result[prop.name] = value
    }

    return result
  }

  static convertBuilderDataToJsonString(builderData: JSONProperty[]): string {
    if (!Array.isArray(builderData) || builderData.length === 0) {
      return '{\n  \n}'
    }

    const result: any = {}

    for (const prop of builderData) {
      if (!prop.name || !prop.name.trim()) {
        continue
      }

      result[prop.name] = prop.value
    }

    let jsonString = JSON.stringify(result, null, 2)

    jsonString = jsonString.replace(/"(<[^>]+>)"/g, '$1')

    return jsonString
  }

  private convertPropertyValue(prop: JSONProperty): any {
    switch (prop.type) {
      case 'object':
        return this.convertObjectValue(prop.value)
      case 'array':
        return this.convertArrayValue(prop.value)
      case 'number':
        return this.convertNumberValue(prop.value)
      case 'boolean':
        return this.convertBooleanValue(prop.value)
      case 'files':
        return prop.value
      default:
        return prop.value
    }
  }

  private convertObjectValue(value: any): any {
    if (Array.isArray(value)) {
      return this.convertBuilderDataToJson(value)
    }

    if (typeof value === 'string' && !this.isVariableReference(value)) {
      return this.tryParseJson(value, value)
    }

    return value
  }

  private convertArrayValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item: any) => this.convertArrayItem(item))
    }

    if (typeof value === 'string' && !this.isVariableReference(value)) {
      const parsed = this.tryParseJson(value, value)
      return Array.isArray(parsed) ? parsed : value
    }

    return value
  }

  private convertArrayItem(item: any): any {
    if (typeof item !== 'object' || !item.type) {
      return item
    }

    if (item.type === 'object' && Array.isArray(item.value)) {
      return this.convertBuilderDataToJson(item.value)
    }

    if (item.type === 'array' && Array.isArray(item.value)) {
      return item.value.map((subItem: any) =>
        typeof subItem === 'object' && subItem.type ? subItem.value : subItem
      )
    }

    return item.value
  }

  private convertNumberValue(value: any): any {
    if (this.isVariableReference(value)) {
      return value
    }

    const numValue = Number(value)
    return Number.isNaN(numValue) ? value : numValue
  }

  private convertBooleanValue(value: any): any {
    if (this.isVariableReference(value)) {
      return value
    }

    return value === 'true' || value === true
  }

  private tryParseJson(jsonString: string, fallback: any): any {
    try {
      return JSON.parse(jsonString)
    } catch {
      return fallback
    }
  }

  private isVariableReference(value: any): boolean {
    return typeof value === 'string' && value.trim().startsWith('<') && value.trim().includes('>')
  }

  private parseObjectStrings(data: any): any {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (typeof parsed === 'object' && parsed !== null) {
          return this.parseObjectStrings(parsed)
        }
        return parsed
      } catch {
        return data
      }
    } else if (Array.isArray(data)) {
      return data.map((item) => this.parseObjectStrings(item))
    } else if (typeof data === 'object' && data !== null) {
      const result: any = {}
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.parseObjectStrings(value)
      }
      return result
    }
    return data
  }

  private parseStatus(status?: string): number {
    if (!status) return HTTP.STATUS.OK
    const parsed = Number(status)
    if (Number.isNaN(parsed) || parsed < 100 || parsed > 599) {
      return HTTP.STATUS.OK
    }
    return parsed
  }

  private parseHeaders(
    headers: {
      id: string
      cells: { Key: string; Value: string }
    }[]
  ): Record<string, string> {
    const defaultHeaders = { 'Content-Type': HTTP.CONTENT_TYPE.JSON }
    if (!headers) return defaultHeaders

    const headerObj = headers.reduce((acc: Record<string, string>, header) => {
      if (header?.cells?.Key && header?.cells?.Value) {
        acc[header.cells.Key] = header.cells.Value
      }
      return acc
    }, {})

    return { ...defaultHeaders, ...headerObj }
  }

  private async executeNotificationTools(
    ctx: ExecutionContext,
    block: SerializedBlock,
    tools: any[],
    context: {
      resumeLinks?: {
        apiUrl: string
        uiUrl: string
        contextId: string
        executionId: string
        workflowId: string
      }
      executionId?: string
      workflowId?: string
      inputFormat?: NormalizedInputField[]
      responseStructure?: ResponseStructureEntry[]
      operation?: string
    }
  ): Promise<NotificationToolResult[]> {
    if (!tools || tools.length === 0) {
      return []
    }

    const { blockData: collectedBlockData, blockNameMapping: collectedBlockNameMapping } =
      collectBlockData(ctx)

    const blockDataWithPause: Record<string, any> = { ...collectedBlockData }
    const blockNameMappingWithPause: Record<string, string> = { ...collectedBlockNameMapping }

    const pauseBlockId = block.id
    const pauseBlockName = block.metadata?.name

    const pauseOutput: Record<string, any> = {
      ...(blockDataWithPause[pauseBlockId] || {}),
    }

    if (context.resumeLinks) {
      if (context.resumeLinks.uiUrl) {
        pauseOutput.url = context.resumeLinks.uiUrl
      }
      // if (context.resumeLinks.apiUrl) {
      //   pauseOutput.apiUrl = context.resumeLinks.apiUrl
      // } // Hidden from output
    }

    if (Array.isArray(context.inputFormat)) {
      for (const field of context.inputFormat) {
        if (field?.name) {
          const fieldName = field.name.trim()
          if (fieldName.length > 0 && !(fieldName in pauseOutput)) {
            pauseOutput[fieldName] = field.value !== undefined ? field.value : null
          }
        }
      }
    }

    blockDataWithPause[pauseBlockId] = pauseOutput

    if (pauseBlockName) {
      blockNameMappingWithPause[pauseBlockName] = pauseBlockId
      blockNameMappingWithPause[normalizeBlockName(pauseBlockName)] = pauseBlockId
    }

    const notificationPromises = tools.map<Promise<NotificationToolResult>>(async (toolConfig) => {
      const startTime = Date.now()
      try {
        const toolId = toolConfig.toolId
        if (!toolId) {
          logger.warn('Notification tool missing toolId', { toolConfig })
          return {
            toolId: 'unknown',
            title: toolConfig.title,
            operation: toolConfig.operation,
            success: false,
          }
        }

        const toolParams = {
          ...toolConfig.params,
          _pauseContext: {
            resumeApiUrl: context.resumeLinks?.apiUrl,
            resumeUiUrl: context.resumeLinks?.uiUrl,
            executionId: context.executionId,
            workflowId: context.workflowId,
            contextId: context.resumeLinks?.contextId,
            inputFormat: context.inputFormat,
            responseStructure: context.responseStructure,
            operation: context.operation,
          },
          _context: {
            workflowId: ctx.workflowId,
            workspaceId: ctx.workspaceId,
          },
          blockData: blockDataWithPause,
          blockNameMapping: blockNameMappingWithPause,
        }

        const result = await executeTool(toolId, toolParams, false, false, ctx)
        const durationMs = Date.now() - startTime

        if (!result.success) {
          logger.warn('Notification tool execution failed', {
            toolId,
            error: result.error,
          })
          return {
            toolId,
            title: toolConfig.title,
            operation: toolConfig.operation,
            success: false,
            durationMs,
          }
        }

        return {
          toolId,
          title: toolConfig.title,
          operation: toolConfig.operation,
          success: true,
          durationMs,
        }
      } catch (error) {
        logger.error('Error executing notification tool', { error, toolConfig })
        return {
          toolId: toolConfig.toolId || 'unknown',
          title: toolConfig.title,
          operation: toolConfig.operation,
          success: false,
        }
      }
    })

    return Promise.all(notificationPromises)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: response-handler.ts]---
Location: sim-main/apps/sim/executor/handlers/response/response-handler.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import type { BlockOutput } from '@/blocks/types'
import { BlockType, HTTP } from '@/executor/constants'
import type { BlockHandler, ExecutionContext } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('ResponseBlockHandler')

interface JSONProperty {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'files'
  value: any
  collapsed?: boolean
}

export class ResponseBlockHandler implements BlockHandler {
  canHandle(block: SerializedBlock): boolean {
    return block.metadata?.id === BlockType.RESPONSE
  }

  async execute(
    ctx: ExecutionContext,
    block: SerializedBlock,
    inputs: Record<string, any>
  ): Promise<BlockOutput> {
    logger.info(`Executing response block: ${block.id}`)

    try {
      const responseData = this.parseResponseData(inputs)
      const statusCode = this.parseStatus(inputs.status)
      const responseHeaders = this.parseHeaders(inputs.headers)

      logger.info('Response prepared', {
        status: statusCode,
        dataKeys: Object.keys(responseData),
        headerKeys: Object.keys(responseHeaders),
      })

      return {
        response: {
          data: responseData,
          status: statusCode,
          headers: responseHeaders,
        },
      }
    } catch (error: any) {
      logger.error('Response block execution failed:', error)
      return {
        response: {
          data: {
            error: 'Response block execution failed',
            message: error.message || 'Unknown error',
          },
          status: HTTP.STATUS.SERVER_ERROR,
          headers: { 'Content-Type': HTTP.CONTENT_TYPE.JSON },
        },
      }
    }
  }

  private parseResponseData(inputs: Record<string, any>): any {
    const dataMode = inputs.dataMode || 'structured'

    if (dataMode === 'json' && inputs.data) {
      if (typeof inputs.data === 'string') {
        try {
          return JSON.parse(inputs.data)
        } catch (error) {
          logger.warn('Failed to parse JSON data, returning as string:', error)
          return inputs.data
        }
      } else if (typeof inputs.data === 'object' && inputs.data !== null) {
        return inputs.data
      }
      return inputs.data
    }

    if (dataMode === 'structured' && inputs.builderData) {
      const convertedData = this.convertBuilderDataToJson(inputs.builderData)
      return this.parseObjectStrings(convertedData)
    }

    return inputs.data || {}
  }

  private convertBuilderDataToJson(builderData: JSONProperty[]): any {
    if (!Array.isArray(builderData)) {
      return {}
    }

    const result: any = {}

    for (const prop of builderData) {
      if (!prop.name || !prop.name.trim()) {
        continue
      }

      const value = this.convertPropertyValue(prop)
      result[prop.name] = value
    }

    return result
  }

  static convertBuilderDataToJsonString(builderData: JSONProperty[]): string {
    if (!Array.isArray(builderData) || builderData.length === 0) {
      return '{\n  \n}'
    }

    const result: any = {}

    for (const prop of builderData) {
      if (!prop.name || !prop.name.trim()) {
        continue
      }

      result[prop.name] = prop.value
    }

    let jsonString = JSON.stringify(result, null, 2)

    jsonString = jsonString.replace(/"(<[^>]+>)"/g, '$1')

    return jsonString
  }

  private convertPropertyValue(prop: JSONProperty): any {
    switch (prop.type) {
      case 'object':
        return this.convertObjectValue(prop.value)
      case 'array':
        return this.convertArrayValue(prop.value)
      case 'number':
        return this.convertNumberValue(prop.value)
      case 'boolean':
        return this.convertBooleanValue(prop.value)
      case 'files':
        return prop.value
      default:
        return prop.value
    }
  }

  private convertObjectValue(value: any): any {
    if (Array.isArray(value)) {
      return this.convertBuilderDataToJson(value)
    }

    if (typeof value === 'string' && !this.isVariableReference(value)) {
      return this.tryParseJson(value, value)
    }

    return value
  }

  private convertArrayValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item: any) => this.convertArrayItem(item))
    }

    if (typeof value === 'string' && !this.isVariableReference(value)) {
      const parsed = this.tryParseJson(value, value)
      if (Array.isArray(parsed)) {
        return parsed
      }
      return value
    }

    return value
  }

  private convertArrayItem(item: any): any {
    if (typeof item !== 'object' || !item.type) {
      return item
    }

    if (item.type === 'object' && Array.isArray(item.value)) {
      return this.convertBuilderDataToJson(item.value)
    }

    if (item.type === 'array' && Array.isArray(item.value)) {
      return item.value.map((subItem: any) => {
        if (typeof subItem === 'object' && subItem.type) {
          return subItem.value
        }
        return subItem
      })
    }

    return item.value
  }

  private convertNumberValue(value: any): any {
    if (this.isVariableReference(value)) {
      return value
    }

    const numValue = Number(value)
    if (Number.isNaN(numValue)) {
      return value
    }
    return numValue
  }

  private convertBooleanValue(value: any): any {
    if (this.isVariableReference(value)) {
      return value
    }

    return value === 'true' || value === true
  }

  private tryParseJson(jsonString: string, fallback: any): any {
    try {
      return JSON.parse(jsonString)
    } catch {
      return fallback
    }
  }

  private isVariableReference(value: any): boolean {
    return typeof value === 'string' && value.trim().startsWith('<') && value.trim().includes('>')
  }

  private parseObjectStrings(data: any): any {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data)
        if (typeof parsed === 'object' && parsed !== null) {
          return this.parseObjectStrings(parsed)
        }
        return parsed
      } catch {
        return data
      }
    } else if (Array.isArray(data)) {
      return data.map((item) => this.parseObjectStrings(item))
    } else if (typeof data === 'object' && data !== null) {
      const result: any = {}
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.parseObjectStrings(value)
      }
      return result
    }
    return data
  }

  private parseStatus(status?: string): number {
    if (!status) return HTTP.STATUS.OK
    const parsed = Number(status)
    if (Number.isNaN(parsed) || parsed < 100 || parsed > 599) {
      return HTTP.STATUS.OK
    }
    return parsed
  }

  private parseHeaders(
    headers: {
      id: string
      cells: { Key: string; Value: string }
    }[]
  ): Record<string, string> {
    const defaultHeaders = { 'Content-Type': HTTP.CONTENT_TYPE.JSON }
    if (!headers) return defaultHeaders

    const headerObj = headers.reduce((acc: Record<string, string>, header) => {
      if (header?.cells?.Key && header?.cells?.Value) {
        acc[header.cells.Key] = header.cells.Value
      }
      return acc
    }, {})

    return { ...defaultHeaders, ...headerObj }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: router-handler.test.ts]---
Location: sim-main/apps/sim/executor/handlers/router/router-handler.test.ts

```typescript
import '@/executor/__test-utils__/mock-dependencies'

import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { generateRouterPrompt } from '@/blocks/blocks/router'
import { BlockType } from '@/executor/constants'
import { RouterBlockHandler } from '@/executor/handlers/router/router-handler'
import type { ExecutionContext } from '@/executor/types'
import { getProviderFromModel } from '@/providers/utils'
import type { SerializedBlock, SerializedWorkflow } from '@/serializer/types'

const mockGenerateRouterPrompt = generateRouterPrompt as Mock
const mockGetProviderFromModel = getProviderFromModel as Mock
const mockFetch = global.fetch as unknown as Mock

describe('RouterBlockHandler', () => {
  let handler: RouterBlockHandler
  let mockBlock: SerializedBlock
  let mockContext: ExecutionContext
  let mockWorkflow: Partial<SerializedWorkflow>
  let mockTargetBlock1: SerializedBlock
  let mockTargetBlock2: SerializedBlock

  beforeEach(() => {
    mockTargetBlock1 = {
      id: 'target-block-1',
      metadata: { id: 'target', name: 'Option A', description: 'Choose A' },
      position: { x: 100, y: 100 },
      config: { tool: 'tool_a', params: { p: 'a' } },
      inputs: {},
      outputs: {},
      enabled: true,
    }
    mockTargetBlock2 = {
      id: 'target-block-2',
      metadata: { id: 'target', name: 'Option B', description: 'Choose B' },
      position: { x: 100, y: 150 },
      config: { tool: 'tool_b', params: { p: 'b' } },
      inputs: {},
      outputs: {},
      enabled: true,
    }
    mockBlock = {
      id: 'router-block-1',
      metadata: { id: BlockType.ROUTER, name: 'Test Router' },
      position: { x: 50, y: 50 },
      config: { tool: BlockType.ROUTER, params: {} },
      inputs: { prompt: 'string', model: 'string' }, // Using ParamType strings
      outputs: {},
      enabled: true,
    }
    mockWorkflow = {
      blocks: [mockBlock, mockTargetBlock1, mockTargetBlock2],
      connections: [
        { source: mockBlock.id, target: mockTargetBlock1.id, sourceHandle: 'condition-then1' },
        { source: mockBlock.id, target: mockTargetBlock2.id, sourceHandle: 'condition-else1' },
      ],
    }

    handler = new RouterBlockHandler({})

    mockContext = {
      workflowId: 'test-workflow-id',
      blockStates: new Map(),
      blockLogs: [],
      metadata: { duration: 0 },
      environmentVariables: {},
      decisions: { router: new Map(), condition: new Map() },
      loopExecutions: new Map(),
      completedLoops: new Set(),
      executedBlocks: new Set(),
      activeExecutionPath: new Set(),
      workflow: mockWorkflow as SerializedWorkflow,
    }

    // Reset mocks using vi
    vi.clearAllMocks()

    // Default mock implementations
    mockGetProviderFromModel.mockReturnValue('openai')
    mockGenerateRouterPrompt.mockReturnValue('Generated System Prompt')

    // Set up fetch mock to return a successful response
    mockFetch.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: 'target-block-1',
            model: 'mock-model',
            tokens: { prompt: 100, completion: 5, total: 105 },
            cost: 0.003,
            timing: { total: 300 },
          }),
      })
    })
  })

  it('should handle router blocks', () => {
    expect(handler.canHandle(mockBlock)).toBe(true)
    const nonRouterBlock: SerializedBlock = { ...mockBlock, metadata: { id: 'other' } }
    expect(handler.canHandle(nonRouterBlock)).toBe(false)
  })

  it('should execute router block correctly and select a path', async () => {
    const inputs = {
      prompt: 'Choose the best option.',
      model: 'gpt-4o',
      temperature: 0.1,
    }

    const expectedTargetBlocks = [
      {
        id: 'target-block-1',
        type: 'target',
        title: 'Option A',
        description: 'Choose A',
        subBlocks: {
          p: 'a',
          systemPrompt: '',
        },
        currentState: undefined,
      },
      {
        id: 'target-block-2',
        type: 'target',
        title: 'Option B',
        description: 'Choose B',
        subBlocks: {
          p: 'b',
          systemPrompt: '',
        },
        currentState: undefined,
      },
    ]

    const result = await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGenerateRouterPrompt).toHaveBeenCalledWith(inputs.prompt, expectedTargetBlocks)
    expect(mockGetProviderFromModel).toHaveBeenCalledWith('gpt-4o')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
        body: expect.any(String),
      })
    )

    // Verify the request body contains the expected data
    const fetchCallArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCallArgs[1].body)
    expect(requestBody).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o',
      systemPrompt: 'Generated System Prompt',
      context: JSON.stringify([{ role: 'user', content: 'Choose the best option.' }]),
      temperature: 0.1,
    })

    expect(result).toEqual({
      prompt: 'Choose the best option.',
      model: 'mock-model',
      tokens: { prompt: 100, completion: 5, total: 105 },
      cost: {
        input: 0,
        output: 0,
        total: 0,
      },
      selectedPath: {
        blockId: 'target-block-1',
        blockType: 'target',
        blockTitle: 'Option A',
      },
      selectedRoute: 'target-block-1',
    })
  })

  it('should throw error if target block is missing', async () => {
    const inputs = { prompt: 'Test' }
    mockContext.workflow!.blocks = [mockBlock, mockTargetBlock2]

    // Expect execute to throw because getTargetBlocks (called internally) will throw
    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Target block target-block-1 not found'
    )
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should throw error if LLM response is not a valid target block ID', async () => {
    const inputs = { prompt: 'Test' }

    // Override fetch mock to return an invalid block ID
    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            content: 'invalid-block-id',
            model: 'mock-model',
            tokens: {},
            cost: 0,
            timing: {},
          }),
      })
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow(
      'Invalid routing decision: invalid-block-id'
    )
  })

  it('should use default model and temperature if not provided', async () => {
    const inputs = { prompt: 'Choose.' }

    await handler.execute(mockContext, mockBlock, inputs)

    expect(mockGetProviderFromModel).toHaveBeenCalledWith('gpt-4o')

    const fetchCallArgs = mockFetch.mock.calls[0]
    const requestBody = JSON.parse(fetchCallArgs[1].body)
    expect(requestBody).toMatchObject({
      model: 'gpt-4o',
      temperature: 0.1,
    })
  })

  it('should handle server error responses', async () => {
    const inputs = { prompt: 'Test error handling.' }

    // Override fetch mock to return an error
    mockFetch.mockImplementationOnce(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      })
    })

    await expect(handler.execute(mockContext, mockBlock, inputs)).rejects.toThrow('Server error')
  })
})
```

--------------------------------------------------------------------------------

````
