---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 622
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 622 of 933)

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

---[FILE: index.ts]---
Location: sim-main/apps/sim/providers/xai/index.ts

```typescript
import OpenAI from 'openai'
import { createLogger } from '@/lib/logs/console/logger'
import type { StreamingExecution } from '@/executor/types'
import { MAX_TOOL_ITERATIONS } from '@/providers'
import { getProviderDefaultModel, getProviderModels } from '@/providers/models'
import type {
  ProviderConfig,
  ProviderRequest,
  ProviderResponse,
  TimeSegment,
} from '@/providers/types'
import { prepareToolExecution, prepareToolsWithUsageControl } from '@/providers/utils'
import {
  checkForForcedToolUsage,
  createReadableStreamFromXAIStream,
  createResponseFormatPayload,
} from '@/providers/xai/utils'
import { executeTool } from '@/tools'

const logger = createLogger('XAIProvider')

export const xAIProvider: ProviderConfig = {
  id: 'xai',
  name: 'xAI',
  description: "xAI's Grok models",
  version: '1.0.0',
  models: getProviderModels('xai'),
  defaultModel: getProviderDefaultModel('xai'),

  executeRequest: async (
    request: ProviderRequest
  ): Promise<ProviderResponse | StreamingExecution> => {
    if (!request.apiKey) {
      throw new Error('API key is required for xAI')
    }

    const xai = new OpenAI({
      apiKey: request.apiKey,
      baseURL: 'https://api.x.ai/v1',
    })

    logger.info('XAI Provider - Initial request configuration:', {
      hasTools: !!request.tools?.length,
      toolCount: request.tools?.length || 0,
      hasResponseFormat: !!request.responseFormat,
      model: request.model || 'grok-3-latest',
      streaming: !!request.stream,
    })

    const allMessages: any[] = []

    if (request.systemPrompt) {
      allMessages.push({
        role: 'system',
        content: request.systemPrompt,
      })
    }

    if (request.context) {
      allMessages.push({
        role: 'user',
        content: request.context,
      })
    }

    if (request.messages) {
      allMessages.push(...request.messages)
    }

    // Set up tools
    const tools = request.tools?.length
      ? request.tools.map((tool) => ({
          type: 'function',
          function: {
            name: tool.id,
            description: tool.description,
            parameters: tool.parameters,
          },
        }))
      : undefined

    // Log tools and response format conflict detection
    if (tools?.length && request.responseFormat) {
      logger.warn(
        'XAI Provider - Detected both tools and response format. Using tools first, then response format for final response.'
      )
    }

    // Build the base request payload
    const basePayload: any = {
      model: request.model || 'grok-3-latest',
      messages: allMessages,
    }

    if (request.temperature !== undefined) basePayload.temperature = request.temperature
    if (request.maxTokens !== undefined) basePayload.max_tokens = request.maxTokens

    // Handle tools and tool usage control
    let preparedTools: ReturnType<typeof prepareToolsWithUsageControl> | null = null

    if (tools?.length) {
      preparedTools = prepareToolsWithUsageControl(tools, request.tools, logger, 'xai')
    }

    // EARLY STREAMING: if caller requested streaming and there are no tools to execute,
    // we can directly stream the completion with response format if needed
    if (request.stream && (!tools || tools.length === 0)) {
      logger.info('XAI Provider - Using direct streaming (no tools)')

      // Start execution timer for the entire provider execution
      const providerStartTime = Date.now()
      const providerStartTimeISO = new Date(providerStartTime).toISOString()

      // Use response format payload if needed, otherwise use base payload
      const streamingPayload = request.responseFormat
        ? createResponseFormatPayload(basePayload, allMessages, request.responseFormat)
        : { ...basePayload, stream: true }

      if (!request.responseFormat) {
        streamingPayload.stream = true
      } else {
        streamingPayload.stream = true
      }

      const streamResponse = await xai.chat.completions.create(streamingPayload)

      // Start collecting token usage
      const tokenUsage = {
        prompt: 0,
        completion: 0,
        total: 0,
      }

      // Create a StreamingExecution response with a readable stream
      const streamingResult = {
        stream: createReadableStreamFromXAIStream(streamResponse),
        execution: {
          success: true,
          output: {
            content: '', // Will be filled by streaming content in chat component
            model: request.model || 'grok-3-latest',
            tokens: tokenUsage,
            toolCalls: undefined,
            providerTiming: {
              startTime: providerStartTimeISO,
              endTime: new Date().toISOString(),
              duration: Date.now() - providerStartTime,
              timeSegments: [
                {
                  type: 'model',
                  name: 'Streaming response',
                  startTime: providerStartTime,
                  endTime: Date.now(),
                  duration: Date.now() - providerStartTime,
                },
              ],
            },
            // Estimate token cost
            cost: {
              total: 0.0,
              input: 0.0,
              output: 0.0,
            },
          },
          logs: [], // No block logs for direct streaming
          metadata: {
            startTime: providerStartTimeISO,
            endTime: new Date().toISOString(),
            duration: Date.now() - providerStartTime,
          },
          isStreaming: true,
        },
      }

      // Return the streaming execution object
      return streamingResult as StreamingExecution
    }

    // Start execution timer for the entire provider execution
    const providerStartTime = Date.now()
    const providerStartTimeISO = new Date(providerStartTime).toISOString()

    try {
      // Make the initial API request
      const initialCallTime = Date.now()

      // For the initial request with tools, we NEVER include response_format
      // This is the key fix: tools and response_format cannot be used together with xAI
      const initialPayload = { ...basePayload }

      // Track the original tool_choice for forced tool tracking
      let originalToolChoice: any

      // Track forced tools and their usage
      const forcedTools = preparedTools?.forcedTools || []
      let usedForcedTools: string[] = []

      if (preparedTools?.tools?.length && preparedTools.toolChoice) {
        const { tools: filteredTools, toolChoice } = preparedTools
        initialPayload.tools = filteredTools
        initialPayload.tool_choice = toolChoice
        originalToolChoice = toolChoice
      } else if (request.responseFormat) {
        // Only add response format if there are no tools
        const responseFormatPayload = createResponseFormatPayload(
          basePayload,
          allMessages,
          request.responseFormat
        )
        Object.assign(initialPayload, responseFormatPayload)
      }

      let currentResponse = await xai.chat.completions.create(initialPayload)
      const firstResponseTime = Date.now() - initialCallTime

      let content = currentResponse.choices[0]?.message?.content || ''
      const tokens = {
        prompt: currentResponse.usage?.prompt_tokens || 0,
        completion: currentResponse.usage?.completion_tokens || 0,
        total: currentResponse.usage?.total_tokens || 0,
      }
      const toolCalls = []
      const toolResults = []
      const currentMessages = [...allMessages]
      let iterationCount = 0

      // Track if a forced tool has been used
      let hasUsedForcedTool = false

      // Track time spent in model vs tools
      let modelTime = firstResponseTime
      let toolsTime = 0

      // Track each model and tool call segment with timestamps
      const timeSegments: TimeSegment[] = [
        {
          type: 'model',
          name: 'Initial response',
          startTime: initialCallTime,
          endTime: initialCallTime + firstResponseTime,
          duration: firstResponseTime,
        },
      ]

      // Check if a forced tool was used in the first response
      if (originalToolChoice) {
        const result = checkForForcedToolUsage(
          currentResponse,
          originalToolChoice,
          forcedTools,
          usedForcedTools
        )
        hasUsedForcedTool = result.hasUsedForcedTool
        usedForcedTools = result.usedForcedTools
      }

      try {
        while (iterationCount < MAX_TOOL_ITERATIONS) {
          // Check for tool calls
          const toolCallsInResponse = currentResponse.choices[0]?.message?.tool_calls
          if (!toolCallsInResponse || toolCallsInResponse.length === 0) {
            break
          }

          // Track time for tool calls in this batch
          const toolsStartTime = Date.now()

          for (const toolCall of toolCallsInResponse) {
            try {
              const toolName = toolCall.function.name
              const toolArgs = JSON.parse(toolCall.function.arguments)

              const tool = request.tools?.find((t) => t.id === toolName)
              if (!tool) {
                logger.warn('XAI Provider - Tool not found:', { toolName })
                continue
              }

              const toolCallStartTime = Date.now()

              const { toolParams, executionParams } = prepareToolExecution(tool, toolArgs, request)

              const result = await executeTool(toolName, executionParams, true)
              const toolCallEndTime = Date.now()
              const toolCallDuration = toolCallEndTime - toolCallStartTime

              // Add to time segments for both success and failure
              timeSegments.push({
                type: 'tool',
                name: toolName,
                startTime: toolCallStartTime,
                endTime: toolCallEndTime,
                duration: toolCallDuration,
              })

              // Prepare result content for the LLM
              let resultContent: any
              if (result.success) {
                toolResults.push(result.output)
                resultContent = result.output
              } else {
                // Include error information so LLM can respond appropriately
                resultContent = {
                  error: true,
                  message: result.error || 'Tool execution failed',
                  tool: toolName,
                }

                logger.warn('XAI Provider - Tool execution failed:', {
                  toolName,
                  error: result.error,
                })
              }

              toolCalls.push({
                name: toolName,
                arguments: toolParams,
                startTime: new Date(toolCallStartTime).toISOString(),
                endTime: new Date(toolCallEndTime).toISOString(),
                duration: toolCallDuration,
                result: resultContent,
                success: result.success,
              })

              // Add the tool call and result to messages (both success and failure)
              currentMessages.push({
                role: 'assistant',
                content: null,
                tool_calls: [
                  {
                    id: toolCall.id,
                    type: 'function',
                    function: {
                      name: toolName,
                      arguments: toolCall.function.arguments,
                    },
                  },
                ],
              })

              currentMessages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify(resultContent),
              })
            } catch (error) {
              logger.error('XAI Provider - Error processing tool call:', {
                error: error instanceof Error ? error.message : String(error),
                toolCall: toolCall.function.name,
              })
            }
          }

          // Calculate tool call time for this iteration
          const thisToolsTime = Date.now() - toolsStartTime
          toolsTime += thisToolsTime

          // After tool calls, create next payload based on whether we need more tools or final response
          let nextPayload: any

          // Update tool_choice based on which forced tools have been used
          if (
            typeof originalToolChoice === 'object' &&
            hasUsedForcedTool &&
            forcedTools.length > 0
          ) {
            // If we have remaining forced tools, get the next one to force
            const remainingTools = forcedTools.filter((tool) => !usedForcedTools.includes(tool))

            if (remainingTools.length > 0) {
              // Force the next tool - continue with tools, no response format
              nextPayload = {
                ...basePayload,
                messages: currentMessages,
                tools: preparedTools?.tools,
                tool_choice: {
                  type: 'function',
                  function: { name: remainingTools[0] },
                },
              }
            } else {
              // All forced tools have been used, check if we need response format for final response
              if (request.responseFormat) {
                nextPayload = createResponseFormatPayload(
                  basePayload,
                  allMessages,
                  request.responseFormat,
                  currentMessages
                )
              } else {
                nextPayload = {
                  ...basePayload,
                  messages: currentMessages,
                  tool_choice: 'auto',
                  tools: preparedTools?.tools,
                }
              }
            }
          } else {
            // Normal tool processing - check if this might be the final response
            if (request.responseFormat) {
              // Use response format for what might be the final response
              nextPayload = createResponseFormatPayload(
                basePayload,
                allMessages,
                request.responseFormat,
                currentMessages
              )
            } else {
              nextPayload = {
                ...basePayload,
                messages: currentMessages,
                tools: preparedTools?.tools,
                tool_choice: 'auto',
              }
            }
          }

          // Time the next model call
          const nextModelStartTime = Date.now()

          currentResponse = await xai.chat.completions.create(nextPayload)

          // Check if any forced tools were used in this response
          if (nextPayload.tool_choice && typeof nextPayload.tool_choice === 'object') {
            const result = checkForForcedToolUsage(
              currentResponse,
              nextPayload.tool_choice,
              forcedTools,
              usedForcedTools
            )
            hasUsedForcedTool = result.hasUsedForcedTool
            usedForcedTools = result.usedForcedTools
          }

          const nextModelEndTime = Date.now()
          const thisModelTime = nextModelEndTime - nextModelStartTime

          // Add to time segments
          timeSegments.push({
            type: 'model',
            name: `Model response (iteration ${iterationCount + 1})`,
            startTime: nextModelStartTime,
            endTime: nextModelEndTime,
            duration: thisModelTime,
          })

          // Add to model time
          modelTime += thisModelTime

          if (currentResponse.choices[0]?.message?.content) {
            content = currentResponse.choices[0].message.content
          }

          if (currentResponse.usage) {
            tokens.prompt += currentResponse.usage.prompt_tokens || 0
            tokens.completion += currentResponse.usage.completion_tokens || 0
            tokens.total += currentResponse.usage.total_tokens || 0
          }

          iterationCount++
        }
      } catch (error) {
        logger.error('XAI Provider - Error in tool processing loop:', {
          error: error instanceof Error ? error.message : String(error),
          iterationCount,
        })
      }

      // After all tool processing complete, if streaming was requested, use streaming for the final response
      if (request.stream) {
        // For final streaming response, choose between tools (auto) or response_format (never both)
        let finalStreamingPayload: any

        if (request.responseFormat) {
          // Use response format, no tools
          finalStreamingPayload = {
            ...createResponseFormatPayload(
              basePayload,
              allMessages,
              request.responseFormat,
              currentMessages
            ),
            stream: true,
          }
        } else {
          // Use tools with auto choice
          finalStreamingPayload = {
            ...basePayload,
            messages: currentMessages,
            tool_choice: 'auto',
            tools: preparedTools?.tools,
            stream: true,
          }
        }

        const streamResponse = await xai.chat.completions.create(finalStreamingPayload)

        // Create a StreamingExecution response with all collected data
        const streamingResult = {
          stream: createReadableStreamFromXAIStream(streamResponse),
          execution: {
            success: true,
            output: {
              content: '', // Will be filled by the callback
              model: request.model || 'grok-3-latest',
              tokens: {
                prompt: tokens.prompt,
                completion: tokens.completion,
                total: tokens.total,
              },
              toolCalls:
                toolCalls.length > 0
                  ? {
                      list: toolCalls,
                      count: toolCalls.length,
                    }
                  : undefined,
              providerTiming: {
                startTime: providerStartTimeISO,
                endTime: new Date().toISOString(),
                duration: Date.now() - providerStartTime,
                modelTime: modelTime,
                toolsTime: toolsTime,
                firstResponseTime: firstResponseTime,
                iterations: iterationCount + 1,
                timeSegments: timeSegments,
              },
              cost: {
                total: (tokens.total || 0) * 0.0001,
                input: (tokens.prompt || 0) * 0.0001,
                output: (tokens.completion || 0) * 0.0001,
              },
            },
            logs: [], // No block logs at provider level
            metadata: {
              startTime: providerStartTimeISO,
              endTime: new Date().toISOString(),
              duration: Date.now() - providerStartTime,
            },
            isStreaming: true,
          },
        }

        // Return the streaming execution object
        return streamingResult as StreamingExecution
      }

      // Calculate overall timing
      const providerEndTime = Date.now()
      const providerEndTimeISO = new Date(providerEndTime).toISOString()
      const totalDuration = providerEndTime - providerStartTime

      logger.info('XAI Provider - Request completed:', {
        totalDuration,
        iterationCount: iterationCount + 1,
        toolCallCount: toolCalls.length,
        hasContent: !!content,
        contentLength: content?.length || 0,
      })

      return {
        content,
        model: request.model,
        tokens,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        toolResults: toolResults.length > 0 ? toolResults : undefined,
        timing: {
          startTime: providerStartTimeISO,
          endTime: providerEndTimeISO,
          duration: totalDuration,
          modelTime: modelTime,
          toolsTime: toolsTime,
          firstResponseTime: firstResponseTime,
          iterations: iterationCount + 1,
          timeSegments: timeSegments,
        },
      }
    } catch (error) {
      // Include timing information even for errors
      const providerEndTime = Date.now()
      const providerEndTimeISO = new Date(providerEndTime).toISOString()
      const totalDuration = providerEndTime - providerStartTime

      logger.error('XAI Provider - Request failed:', {
        error: error instanceof Error ? error.message : String(error),
        duration: totalDuration,
        hasTools: !!tools?.length,
        hasResponseFormat: !!request.responseFormat,
      })

      // Create a new error with timing information
      const enhancedError = new Error(error instanceof Error ? error.message : String(error))
      // @ts-ignore - Adding timing property to the error
      enhancedError.timing = {
        startTime: providerStartTimeISO,
        endTime: providerEndTimeISO,
        duration: totalDuration,
      }

      throw enhancedError
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/providers/xai/utils.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { trackForcedToolUsage } from '@/providers/utils'

const logger = createLogger('XAIProvider')

/**
 * Helper to wrap XAI (OpenAI-compatible) streaming into a browser-friendly
 * ReadableStream of raw assistant text chunks.
 */
export function createReadableStreamFromXAIStream(xaiStream: any): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of xaiStream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            controller.enqueue(new TextEncoder().encode(content))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}

/**
 * Creates a response format payload for XAI API requests.
 */
export function createResponseFormatPayload(
  basePayload: any,
  allMessages: any[],
  responseFormat: any,
  currentMessages?: any[]
) {
  const payload = {
    ...basePayload,
    messages: currentMessages || allMessages,
  }

  if (responseFormat) {
    payload.response_format = {
      type: 'json_schema',
      json_schema: {
        name: responseFormat.name || 'structured_response',
        schema: responseFormat.schema || responseFormat,
        strict: responseFormat.strict !== false,
      },
    }
  }

  return payload
}

/**
 * Helper function to check for forced tool usage in responses.
 */
export function checkForForcedToolUsage(
  response: any,
  toolChoice: string | { type: string; function?: { name: string }; name?: string; any?: any },
  forcedTools: string[],
  usedForcedTools: string[]
): { hasUsedForcedTool: boolean; usedForcedTools: string[] } {
  let hasUsedForcedTool = false
  let updatedUsedForcedTools = usedForcedTools

  if (typeof toolChoice === 'object' && response.choices[0]?.message?.tool_calls) {
    const toolCallsResponse = response.choices[0].message.tool_calls
    const result = trackForcedToolUsage(
      toolCallsResponse,
      toolChoice,
      logger,
      'xai',
      forcedTools,
      updatedUsedForcedTools
    )
    hasUsedForcedTool = result.hasUsedForcedTool
    updatedUsedForcedTools = result.usedForcedTools
  }

  return { hasUsedForcedTool, usedForcedTools: updatedUsedForcedTools }
}
```

--------------------------------------------------------------------------------

---[FILE: icon.svg]---
Location: sim-main/apps/sim/public/icon.svg

```text
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" fill="#701FFC"/>
<path d="M34.1455 20.0728H16.0364C12.7026 20.0728 10 22.7753 10 26.1091V35.1637C10 38.4975 12.7026 41.2 16.0364 41.2H34.1455C37.4792 41.2 40.1818 38.4975 40.1818 35.1637V26.1091C40.1818 22.7753 37.4792 20.0728 34.1455 20.0728Z" fill="#701FFC" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.0919 14.0364C26.7588 14.0364 28.1101 12.6851 28.1101 11.0182C28.1101 9.35129 26.7588 8 25.0919 8C23.425 8 22.0737 9.35129 22.0737 11.0182C22.0737 12.6851 23.425 14.0364 25.0919 14.0364Z" fill="#701FFC" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.0915 14.856V19.0277V14.856ZM20.5645 32.1398V29.1216V32.1398ZM29.619 29.1216V32.1398V29.1216Z" fill="#701FFC"/>
<path d="M25.0915 14.856V19.0277M20.5645 32.1398V29.1216M29.619 29.1216V32.1398" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="25" cy="11" r="2" fill="#701FFC"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: logo-sim.svg]---
Location: sim-main/apps/sim/public/logo-sim.svg

```text
<svg width="119" height="67" viewBox="0 0 119 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="119" height="67" rx="6" fill="#701FFC"/>
<path d="M40.8 27.4023H25.2C22.3281 27.4023 20 29.7305 20 32.6023V40.4023C20 43.2742 22.3281 45.6023 25.2 45.6023H40.8C43.6719 45.6023 46 43.2742 46 40.4023V32.6023C46 29.7305 43.6719 27.4023 40.8 27.4023Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.9994 22.2C34.4354 22.2 35.5994 21.0359 35.5994 19.6C35.5994 18.1641 34.4354 17 32.9994 17C31.5635 17 30.3994 18.1641 30.3994 19.6C30.3994 21.0359 31.5635 22.2 32.9994 22.2Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M33.0004 22.9062V26.5M29.1006 37.7953V35.1953M36.9006 35.1953V37.7953" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M71.4034 31.6314L68.5163 32.1428C68.3956 31.7734 68.2038 31.4219 67.9411 31.0881C67.6854 30.7543 67.3374 30.4808 66.897 30.2678C66.4567 30.0547 65.9063 29.9482 65.2457 29.9482C64.3438 29.9482 63.5909 30.1506 62.9872 30.5554C62.3835 30.9531 62.0817 31.468 62.0817 32.1001C62.0817 32.647 62.2841 33.0874 62.6889 33.4212C63.0938 33.755 63.7472 34.0284 64.6491 34.2415L67.2486 34.8381C68.7543 35.1861 69.8764 35.7223 70.6151 36.4467C71.3537 37.1712 71.723 38.1122 71.723 39.2699C71.723 40.25 71.4389 41.1236 70.8707 41.8906C70.3097 42.6506 69.5249 43.2472 68.5163 43.6804C67.5149 44.1136 66.3537 44.3303 65.0327 44.3303C63.2003 44.3303 61.7053 43.9396 60.5476 43.1584C59.3899 42.37 58.6797 41.2514 58.4169 39.8026L61.4957 39.3338C61.6875 40.1364 62.0817 40.7436 62.6783 41.1555C63.2749 41.5604 64.0526 41.7628 65.0114 41.7628C66.0554 41.7628 66.8899 41.5462 67.5149 41.1129C68.1399 40.6726 68.4524 40.1364 68.4524 39.5043C68.4524 38.9929 68.2607 38.5632 67.8771 38.2152C67.5007 37.8672 66.9219 37.6044 66.1406 37.4268L63.3707 36.8196C61.8438 36.4716 60.7145 35.9176 59.983 35.1577C59.2585 34.3977 58.8963 33.4354 58.8963 32.2706C58.8963 31.3047 59.1662 30.4595 59.706 29.7351C60.2457 29.0107 60.9915 28.446 61.9432 28.0412C62.8949 27.6293 63.9851 27.4233 65.2138 27.4233C66.9822 27.4233 68.3743 27.8068 69.3899 28.5739C70.4055 29.3338 71.0767 30.353 71.4034 31.6314ZM75.2253 44V27.6364H78.4107V44H75.2253ZM76.834 25.1115C76.28 25.1115 75.8042 24.9268 75.4064 24.5575C75.0158 24.1811 74.8205 23.7337 74.8205 23.2152C74.8205 22.6896 75.0158 22.2422 75.4064 21.8729C75.8042 21.4964 76.28 21.3082 76.834 21.3082C77.388 21.3082 77.8603 21.4964 78.2509 21.8729C78.6486 22.2422 78.8475 22.6896 78.8475 23.2152C78.8475 23.7337 78.6486 24.1811 78.2509 24.5575C77.8603 24.9268 77.388 25.1115 76.834 25.1115ZM82.696 44V27.6364H85.7536V30.2997H85.956C86.2969 29.3977 86.8544 28.6946 87.6286 28.1903C88.4027 27.679 89.3295 27.4233 90.4091 27.4233C91.5028 27.4233 92.419 27.679 93.1577 28.1903C93.9034 28.7017 94.4538 29.4048 94.8089 30.2997H94.9794C95.37 29.4261 95.9915 28.7301 96.8438 28.2116C97.696 27.6861 98.7116 27.4233 99.8906 27.4233C101.375 27.4233 102.586 27.8885 103.523 28.8189C104.468 29.7493 104.94 31.152 104.94 33.027V44H101.755V33.3253C101.755 32.2173 101.453 31.4148 100.849 30.9176C100.246 30.4205 99.5249 30.1719 98.6868 30.1719C97.6499 30.1719 96.8438 30.4915 96.2685 31.1307C95.6932 31.7628 95.4055 32.576 95.4055 33.5703V44H92.2308V33.1229C92.2308 32.2351 91.9538 31.5213 91.3999 30.9815C90.8459 30.4418 90.125 30.1719 89.2372 30.1719C88.6335 30.1719 88.076 30.3317 87.5646 30.6513C87.0604 30.9638 86.652 31.4006 86.3395 31.9616C86.0341 32.5227 85.8814 33.1726 85.8814 33.9112V44H82.696Z" fill="white"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: robots.txt]---
Location: sim-main/apps/sim/public/robots.txt

```text
# robots.txt for https://sim.ai

# Allow all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /workspace/
Disallow: /_next/
Disallow: /private/
Disallow: /*.json$

# Specific crawler rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# AI/LLM crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# Sitemap location
Sitemap: https://sim.ai/sitemap.xml

# Host
Host: https://sim.ai
```

--------------------------------------------------------------------------------

---[FILE: sim.svg]---
Location: sim-main/apps/sim/public/sim.svg

```text
<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="50" height="50" rx="6" fill="#701FFC"/>
<path d="M34.1455 20.073H16.0364C12.7026 20.073 10 22.7756 10 26.1094V35.1639C10 38.4977 12.7026 41.2003 16.0364 41.2003H34.1455C37.4792 41.2003 40.1818 38.4977 40.1818 35.1639V26.1094C40.1818 22.7756 37.4792 20.073 34.1455 20.073Z" fill="#701FFC" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.0924 14.0364C26.7593 14.0364 28.1106 12.6851 28.1106 11.0182C28.1106 9.35129 26.7593 8 25.0924 8C23.4255 8 22.0742 9.35129 22.0742 11.0182C22.0742 12.6851 23.4255 14.0364 25.0924 14.0364Z" fill="#701FFC" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M25.0915 14.856V19.0277V14.856ZM20.5645 32.1398V29.1216V32.1398ZM29.619 29.1216V32.1398V29.1216Z" fill="#701FFC"/>
<path d="M25.0915 14.856V19.0277M20.5645 32.1398V29.1216M29.619 29.1216V32.1398" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="25" cy="11" r="2" fill="#701FFC"/>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: microsoft-identity-association]---
Location: sim-main/apps/sim/public/.well-known/microsoft-identity-association

```text
{
  "associatedApplications": [
    {
      "applicationId": "5c832c21-eb8e-466c-b5d3-a329d78cf911"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: b&w.svg]---
Location: sim-main/apps/sim/public/logo/426-240/b&w/b&w.svg

```text
<svg width="2130" height="1200" viewBox="0 0 2130 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1184_347)">
<path d="M2130 0H0V1200H2130V0Z" fill="white"/>
<path d="M628 712.826H686.359C686.359 728.87 692.195 741.663 703.868 751.205C715.539 760.311 731.318 764.864 751.203 764.864C772.818 764.864 789.461 760.745 801.132 752.504C812.804 743.832 818.641 732.34 818.641 718.029C818.641 707.622 815.398 698.948 808.914 692.01C802.862 685.072 791.622 679.433 775.195 675.097L719.43 662.088C691.331 655.15 670.365 644.524 656.531 630.213C643.13 615.903 636.43 597.039 636.43 573.622C636.43 554.107 641.401 537.195 651.343 522.884C661.719 508.574 675.768 497.515 693.492 489.71C711.648 481.903 732.399 478 755.742 478C779.086 478 799.187 482.12 816.047 490.36C833.338 498.599 846.739 510.092 856.249 524.835C866.193 539.58 871.379 557.142 871.812 577.524H813.453C813.02 561.046 807.617 548.253 797.241 539.145C786.867 530.039 772.385 525.486 753.797 525.486C734.776 525.486 720.078 529.605 709.704 537.844C699.327 546.085 694.141 557.359 694.141 571.67C694.141 592.919 709.704 607.446 740.829 615.253L796.593 628.912C823.396 634.983 843.497 644.958 856.899 658.836C870.298 672.278 877 690.709 877 714.126C877 734.075 871.595 751.637 860.788 766.815C849.981 781.56 835.068 793.052 816.047 801.292C797.458 809.097 775.412 813 749.906 813C712.729 813 683.117 803.894 661.07 785.68C639.024 767.466 628 743.181 628 712.826Z" fill="black"/>
<path d="M918.324 805V488.257C942.504 497.069 953.168 497.069 978.968 488.257V805H918.324ZM948.001 467.32C937.248 467.32 927.786 463.433 919.614 455.661C911.871 447.455 908 437.955 908 427.159C908 415.933 911.871 406.432 919.614 398.659C927.786 390.887 937.248 387 948.001 387C959.183 387 968.645 390.887 976.388 398.659C984.129 406.432 988 415.933 988 427.159C988 437.955 984.129 447.455 976.388 455.661C968.645 463.433 959.183 467.32 948.001 467.32Z" fill="black"/>
<path d="M1087 805H1026V487.102H1080.51V540.74C1087 522.971 1099.54 507.904 1116.85 496.203C1134.58 484.068 1156 478 1181.09 478C1209.21 478 1232.57 485.585 1251.17 500.753C1269.77 515.923 1281.89 536.076 1287.51 561.213H1276.48C1280.8 536.076 1292.7 515.923 1312.17 500.753C1331.64 485.585 1355.65 478 1384.2 478C1420.54 478 1449.09 488.618 1469.85 509.856C1490.62 531.092 1501 560.13 1501 596.968V805H1441.3V611.921C1441.3 586.784 1434.81 567.498 1421.83 554.062C1409.29 540.192 1392.2 533.258 1370.57 533.258C1355.43 533.258 1342.02 536.725 1330.34 543.661C1319.09 550.161 1310.22 559.696 1303.73 572.265C1297.24 584.833 1294 599.569 1294 616.471V805H1233.65V611.27C1233.65 586.133 1227.38 567.064 1214.83 554.062C1202.29 540.626 1185.2 533.909 1163.57 533.909C1148.43 533.909 1135.02 537.376 1123.34 544.31C1112.09 550.812 1103.22 560.347 1096.73 572.914C1090.24 585.05 1087 599.569 1087 616.471V805Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_1184_347">
<rect width="2130" height="1200" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: primary.svg]---
Location: sim-main/apps/sim/public/logo/426-240/primary/primary.svg

```text
<svg width="2130" height="1200" viewBox="0 0 2130 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1184_318)">
<path d="M2130 0H0V1200H2130V0Z" fill="#6F3DFA"/>
<path d="M628 712.826H686.359C686.359 728.87 692.195 741.663 703.868 751.205C715.539 760.311 731.318 764.864 751.203 764.864C772.818 764.864 789.461 760.745 801.132 752.504C812.804 743.832 818.641 732.34 818.641 718.029C818.641 707.622 815.398 698.948 808.914 692.01C802.862 685.072 791.622 679.433 775.195 675.097L719.43 662.088C691.331 655.15 670.365 644.524 656.531 630.213C643.13 615.903 636.43 597.039 636.43 573.622C636.43 554.107 641.401 537.195 651.343 522.884C661.719 508.574 675.768 497.515 693.492 489.71C711.648 481.903 732.399 478 755.742 478C779.086 478 799.187 482.12 816.047 490.36C833.338 498.599 846.739 510.092 856.249 524.835C866.193 539.58 871.379 557.142 871.812 577.524H813.453C813.02 561.046 807.617 548.253 797.241 539.145C786.867 530.039 772.385 525.486 753.797 525.486C734.776 525.486 720.078 529.605 709.704 537.844C699.327 546.085 694.141 557.359 694.141 571.67C694.141 592.919 709.704 607.446 740.829 615.253L796.593 628.912C823.396 634.983 843.497 644.958 856.899 658.836C870.298 672.278 877 690.709 877 714.126C877 734.075 871.595 751.637 860.788 766.815C849.981 781.56 835.068 793.052 816.047 801.292C797.458 809.097 775.412 813 749.906 813C712.729 813 683.117 803.894 661.07 785.68C639.024 767.466 628 743.181 628 712.826Z" fill="white"/>
<path d="M918.324 805V488.257C942.504 497.069 953.168 497.069 978.968 488.257V805H918.324ZM948.001 467.32C937.248 467.32 927.786 463.433 919.614 455.661C911.871 447.455 908 437.955 908 427.159C908 415.933 911.871 406.432 919.614 398.659C927.786 390.887 937.248 387 948.001 387C959.183 387 968.645 390.887 976.388 398.659C984.129 406.432 988 415.933 988 427.159C988 437.955 984.129 447.455 976.388 455.661C968.645 463.433 959.183 467.32 948.001 467.32Z" fill="white"/>
<path d="M1087 805H1026V487.102H1080.51V540.74C1087 522.971 1099.54 507.904 1116.85 496.203C1134.58 484.068 1156 478 1181.09 478C1209.21 478 1232.57 485.585 1251.17 500.753C1269.77 515.923 1281.89 536.076 1287.51 561.213H1276.48C1280.8 536.076 1292.7 515.923 1312.17 500.753C1331.64 485.585 1355.65 478 1384.2 478C1420.54 478 1449.09 488.618 1469.85 509.856C1490.62 531.092 1501 560.13 1501 596.968V805H1441.3V611.921C1441.3 586.784 1434.81 567.498 1421.83 554.062C1409.29 540.192 1392.2 533.258 1370.57 533.258C1355.43 533.258 1342.02 536.725 1330.34 543.661C1319.09 550.161 1310.22 559.696 1303.73 572.265C1297.24 584.833 1294 599.569 1294 616.471V805H1233.65V611.27C1233.65 586.133 1227.38 567.064 1214.83 554.062C1202.29 540.626 1185.2 533.909 1163.57 533.909C1148.43 533.909 1135.02 537.376 1123.34 544.31C1112.09 550.812 1103.22 560.347 1096.73 572.914C1090.24 585.05 1087 599.569 1087 616.471V805Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_1184_318">
<rect width="2130" height="1200" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

---[FILE: reverse.svg]---
Location: sim-main/apps/sim/public/logo/426-240/reverse/reverse.svg

```text
<svg width="2130" height="1200" viewBox="0 0 2130 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1184_325)">
<path d="M2130 0H0V1200H2130V0Z" fill="white"/>
<path d="M628 712.826H686.359C686.359 728.87 692.195 741.663 703.868 751.205C715.539 760.311 731.318 764.864 751.203 764.864C772.818 764.864 789.461 760.745 801.132 752.504C812.804 743.832 818.641 732.34 818.641 718.029C818.641 707.622 815.398 698.948 808.914 692.01C802.862 685.072 791.622 679.433 775.195 675.097L719.43 662.088C691.331 655.15 670.365 644.524 656.531 630.213C643.13 615.903 636.43 597.039 636.43 573.622C636.43 554.107 641.401 537.195 651.343 522.884C661.719 508.574 675.768 497.515 693.492 489.71C711.648 481.903 732.399 478 755.742 478C779.086 478 799.187 482.12 816.047 490.36C833.338 498.599 846.739 510.092 856.249 524.835C866.193 539.58 871.379 557.142 871.812 577.524H813.453C813.02 561.046 807.617 548.253 797.241 539.145C786.867 530.039 772.385 525.486 753.797 525.486C734.776 525.486 720.078 529.605 709.704 537.844C699.327 546.085 694.141 557.359 694.141 571.67C694.141 592.919 709.704 607.446 740.829 615.253L796.593 628.912C823.396 634.983 843.497 644.958 856.899 658.836C870.298 672.278 877 690.709 877 714.126C877 734.075 871.595 751.637 860.788 766.815C849.981 781.56 835.068 793.052 816.047 801.292C797.458 809.097 775.412 813 749.906 813C712.729 813 683.117 803.894 661.07 785.68C639.024 767.466 628 743.181 628 712.826Z" fill="#6F3DFA"/>
<path d="M918.324 805V488.257C942.504 497.069 953.168 497.069 978.968 488.257V805H918.324ZM948.001 467.32C937.248 467.32 927.786 463.433 919.614 455.661C911.871 447.455 908 437.955 908 427.159C908 415.933 911.871 406.432 919.614 398.659C927.786 390.887 937.248 387 948.001 387C959.183 387 968.645 390.887 976.388 398.659C984.129 406.432 988 415.933 988 427.159C988 437.955 984.129 447.455 976.388 455.661C968.645 463.433 959.183 467.32 948.001 467.32Z" fill="#6F3DFA"/>
<path d="M1087 805H1026V487.102H1080.51V540.74C1087 522.971 1099.54 507.904 1116.85 496.203C1134.58 484.068 1156 478 1181.09 478C1209.21 478 1232.57 485.585 1251.17 500.753C1269.77 515.923 1281.89 536.076 1287.51 561.213H1276.48C1280.8 536.076 1292.7 515.923 1312.17 500.753C1331.64 485.585 1355.65 478 1384.2 478C1420.54 478 1449.09 488.618 1469.85 509.856C1490.62 531.092 1501 560.13 1501 596.968V805H1441.3V611.921C1441.3 586.784 1434.81 567.498 1421.83 554.062C1409.29 540.192 1392.2 533.258 1370.57 533.258C1355.43 533.258 1342.02 536.725 1330.34 543.661C1319.09 550.161 1310.22 559.696 1303.73 572.265C1297.24 584.833 1294 599.569 1294 616.471V805H1233.65V611.27C1233.65 586.133 1227.38 567.064 1214.83 554.062C1202.29 540.626 1185.2 533.909 1163.57 533.909C1148.43 533.909 1135.02 537.376 1123.34 544.31C1112.09 550.812 1103.22 560.347 1096.73 572.914C1090.24 585.05 1087 599.569 1087 616.471V805Z" fill="#6F3DFA"/>
</g>
<defs>
<clipPath id="clip0_1184_325">
<rect width="2130" height="1200" fill="white"/>
</clipPath>
</defs>
</svg>
```

--------------------------------------------------------------------------------

````
