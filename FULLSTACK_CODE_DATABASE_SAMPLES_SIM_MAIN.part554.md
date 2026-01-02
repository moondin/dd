---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 554
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 554 of 933)

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

---[FILE: knowledge-base.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/knowledge/knowledge-base.ts

```typescript
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import {
  type KnowledgeBaseArgs,
  KnowledgeBaseArgsSchema,
  type KnowledgeBaseResult,
} from '@/lib/copilot/tools/shared/schemas'
import { generateSearchEmbedding } from '@/lib/knowledge/embeddings'
import {
  createKnowledgeBase,
  getKnowledgeBaseById,
  getKnowledgeBases,
} from '@/lib/knowledge/service'
import { createLogger } from '@/lib/logs/console/logger'
import { getQueryStrategy, handleVectorOnlySearch } from '@/app/api/knowledge/search/utils'

const logger = createLogger('KnowledgeBaseServerTool')

// Re-export for backwards compatibility
export const KnowledgeBaseInput = KnowledgeBaseArgsSchema
export type KnowledgeBaseInputType = KnowledgeBaseArgs
export type KnowledgeBaseResultType = KnowledgeBaseResult

/**
 * Knowledge base tool for copilot to create, list, and get knowledge bases
 */
export const knowledgeBaseServerTool: BaseServerTool<KnowledgeBaseArgs, KnowledgeBaseResult> = {
  name: 'knowledge_base',
  async execute(
    params: KnowledgeBaseArgs,
    context?: { userId: string }
  ): Promise<KnowledgeBaseResult> {
    if (!context?.userId) {
      logger.error('Unauthorized attempt to access knowledge base - no authenticated user context')
      throw new Error('Authentication required')
    }

    const { operation, args = {} } = params

    try {
      switch (operation) {
        case 'create': {
          if (!args.name) {
            return {
              success: false,
              message: 'Name is required for creating a knowledge base',
            }
          }

          const requestId = crypto.randomUUID().slice(0, 8)
          const newKnowledgeBase = await createKnowledgeBase(
            {
              name: args.name,
              description: args.description,
              workspaceId: args.workspaceId,
              userId: context.userId,
              embeddingModel: 'text-embedding-3-small',
              embeddingDimension: 1536,
              chunkingConfig: args.chunkingConfig || {
                maxSize: 1024,
                minSize: 1,
                overlap: 200,
              },
            },
            requestId
          )

          logger.info('Knowledge base created via copilot', {
            knowledgeBaseId: newKnowledgeBase.id,
            name: newKnowledgeBase.name,
            userId: context.userId,
          })

          return {
            success: true,
            message: `Knowledge base "${newKnowledgeBase.name}" created successfully`,
            data: {
              id: newKnowledgeBase.id,
              name: newKnowledgeBase.name,
              description: newKnowledgeBase.description,
              workspaceId: newKnowledgeBase.workspaceId,
              docCount: newKnowledgeBase.docCount,
              createdAt: newKnowledgeBase.createdAt,
            },
          }
        }

        case 'list': {
          const knowledgeBases = await getKnowledgeBases(context.userId, args.workspaceId)

          logger.info('Knowledge bases listed via copilot', {
            count: knowledgeBases.length,
            userId: context.userId,
            workspaceId: args.workspaceId,
          })

          return {
            success: true,
            message: `Found ${knowledgeBases.length} knowledge base(s)`,
            data: knowledgeBases.map((kb) => ({
              id: kb.id,
              name: kb.name,
              description: kb.description,
              workspaceId: kb.workspaceId,
              docCount: kb.docCount,
              tokenCount: kb.tokenCount,
              createdAt: kb.createdAt,
              updatedAt: kb.updatedAt,
            })),
          }
        }

        case 'get': {
          if (!args.knowledgeBaseId) {
            return {
              success: false,
              message: 'Knowledge base ID is required for get operation',
            }
          }

          const knowledgeBase = await getKnowledgeBaseById(args.knowledgeBaseId)
          if (!knowledgeBase) {
            return {
              success: false,
              message: `Knowledge base with ID "${args.knowledgeBaseId}" not found`,
            }
          }

          logger.info('Knowledge base metadata retrieved via copilot', {
            knowledgeBaseId: knowledgeBase.id,
            userId: context.userId,
          })

          return {
            success: true,
            message: `Retrieved knowledge base "${knowledgeBase.name}"`,
            data: {
              id: knowledgeBase.id,
              name: knowledgeBase.name,
              description: knowledgeBase.description,
              workspaceId: knowledgeBase.workspaceId,
              docCount: knowledgeBase.docCount,
              tokenCount: knowledgeBase.tokenCount,
              embeddingModel: knowledgeBase.embeddingModel,
              chunkingConfig: knowledgeBase.chunkingConfig,
              createdAt: knowledgeBase.createdAt,
              updatedAt: knowledgeBase.updatedAt,
            },
          }
        }

        case 'query': {
          if (!args.knowledgeBaseId) {
            return {
              success: false,
              message: 'Knowledge base ID is required for query operation',
            }
          }

          if (!args.query) {
            return {
              success: false,
              message: 'Query text is required for query operation',
            }
          }

          // Verify knowledge base exists
          const kb = await getKnowledgeBaseById(args.knowledgeBaseId)
          if (!kb) {
            return {
              success: false,
              message: `Knowledge base with ID "${args.knowledgeBaseId}" not found`,
            }
          }

          const topK = args.topK || 5

          // Generate embedding for the query
          const queryEmbedding = await generateSearchEmbedding(args.query)
          const queryVector = JSON.stringify(queryEmbedding)

          // Get search strategy
          const strategy = getQueryStrategy(1, topK)

          // Perform vector search
          const results = await handleVectorOnlySearch({
            knowledgeBaseIds: [args.knowledgeBaseId],
            topK,
            queryVector,
            distanceThreshold: strategy.distanceThreshold,
          })

          logger.info('Knowledge base queried via copilot', {
            knowledgeBaseId: args.knowledgeBaseId,
            query: args.query.substring(0, 100),
            resultCount: results.length,
            userId: context.userId,
          })

          return {
            success: true,
            message: `Found ${results.length} result(s) for query "${args.query.substring(0, 50)}${args.query.length > 50 ? '...' : ''}"`,
            data: {
              knowledgeBaseId: args.knowledgeBaseId,
              knowledgeBaseName: kb.name,
              query: args.query,
              topK,
              totalResults: results.length,
              results: results.map((result) => ({
                documentId: result.documentId,
                content: result.content,
                chunkIndex: result.chunkIndex,
                similarity: 1 - result.distance,
              })),
            },
          }
        }

        default:
          return {
            success: false,
            message: `Unknown operation: ${operation}. Supported operations: create, list, get, query`,
          }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      logger.error('Error in knowledge_base tool', {
        operation,
        error: errorMessage,
        userId: context.userId,
      })

      return {
        success: false,
        message: `Failed to ${operation} knowledge base: ${errorMessage}`,
      }
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: make-api-request.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/other/make-api-request.ts

```typescript
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { createLogger } from '@/lib/logs/console/logger'
import { executeTool } from '@/tools'
import type { TableRow } from '@/tools/types'

interface MakeApiRequestParams {
  url: string
  method: 'GET' | 'POST' | 'PUT'
  queryParams?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  body?: any
}

export const makeApiRequestServerTool: BaseServerTool<MakeApiRequestParams, any> = {
  name: 'make_api_request',
  async execute(params: MakeApiRequestParams): Promise<any> {
    const logger = createLogger('MakeApiRequestServerTool')
    const { url, method, queryParams, headers, body } = params || ({} as MakeApiRequestParams)
    if (!url || !method) throw new Error('url and method are required')

    const toTableRows = (obj?: Record<string, any>): TableRow[] | null => {
      if (!obj || typeof obj !== 'object') return null
      return Object.entries(obj).map(([key, value]) => ({
        id: key,
        cells: { Key: key, Value: value },
      }))
    }
    const headersTable = toTableRows(headers)
    const queryParamsTable = toTableRows(queryParams as Record<string, any> | undefined)

    const result = await executeTool(
      'http_request',
      { url, method, params: queryParamsTable, headers: headersTable, body },
      true
    )
    if (!result.success) throw new Error(result.error || 'API request failed')
    const output = (result as any).output || result
    const data = output.output?.data ?? output.data
    const status = output.output?.status ?? output.status ?? 200
    const respHeaders = output.output?.headers ?? output.headers ?? {}

    const CAP = Number(process.env.COPILOT_TOOL_RESULT_CHAR_CAP || 20000)
    const toStringSafe = (val: any): string => {
      if (typeof val === 'string') return val
      try {
        return JSON.stringify(val)
      } catch {
        return String(val)
      }
    }

    const stripHtml = (html: string): string => {
      try {
        let text = html
        let previous: string

        do {
          previous = text
          text = text.replace(/<script[\s\S]*?<\/script\s*>/gi, '')
          text = text.replace(/<style[\s\S]*?<\/style\s*>/gi, '')
          text = text.replace(/<[^>]*>/g, ' ')
          text = text.replace(/[<>]/g, ' ')
        } while (text !== previous)

        return text.replace(/\s+/g, ' ').trim()
      } catch {
        return html
      }
    }
    let normalized = toStringSafe(data)
    const looksLikeHtml =
      /<html[\s\S]*<\/html>/i.test(normalized) || /<body[\s\S]*<\/body>/i.test(normalized)
    if (looksLikeHtml) normalized = stripHtml(normalized)
    const totalChars = normalized.length
    if (totalChars > CAP) {
      const preview = normalized.slice(0, CAP)
      logger.warn('API response truncated by character cap', {
        url,
        method,
        totalChars,
        previewChars: preview.length,
        cap: CAP,
      })
      return {
        data: preview,
        status,
        headers: respHeaders,
        truncated: true,
        totalChars,
        previewChars: preview.length,
        note: `Response truncated to ${CAP} characters to avoid large payloads`,
      }
    }
    logger.info('API request executed', { url, method, status, totalChars })
    return { data: normalized, status, headers: respHeaders }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: search-online.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/other/search-online.ts

```typescript
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { env } from '@/lib/core/config/env'
import { createLogger } from '@/lib/logs/console/logger'
import { executeTool } from '@/tools'

interface OnlineSearchParams {
  query: string
  num?: number
  type?: string
  gl?: string
  hl?: string
}

export const searchOnlineServerTool: BaseServerTool<OnlineSearchParams, any> = {
  name: 'search_online',
  async execute(params: OnlineSearchParams): Promise<any> {
    const logger = createLogger('SearchOnlineServerTool')
    const { query, num = 10, type = 'search', gl, hl } = params
    if (!query || typeof query !== 'string') throw new Error('query is required')

    // Check which API keys are available
    const hasExaApiKey = Boolean(env.EXA_API_KEY && String(env.EXA_API_KEY).length > 0)
    const hasSerperApiKey = Boolean(env.SERPER_API_KEY && String(env.SERPER_API_KEY).length > 0)

    logger.info('Performing online search', {
      queryLength: query.length,
      num,
      type,
      gl,
      hl,
      hasExaApiKey,
      hasSerperApiKey,
    })

    // Try Exa first if available
    if (hasExaApiKey) {
      try {
        logger.debug('Attempting exa_search', { num })
        const exaResult = await executeTool('exa_search', {
          query,
          numResults: num,
          type: 'auto',
          apiKey: env.EXA_API_KEY || '',
        })

        const exaResults = (exaResult as any)?.output?.results || []
        const count = Array.isArray(exaResults) ? exaResults.length : 0
        const firstTitle = count > 0 ? String(exaResults[0]?.title || '') : undefined

        logger.info('exa_search completed', {
          success: exaResult.success,
          resultsCount: count,
          firstTitlePreview: firstTitle?.slice(0, 120),
        })

        if (exaResult.success && count > 0) {
          // Transform Exa results to match expected format
          const transformedResults = exaResults.map((result: any) => ({
            title: result.title || '',
            link: result.url || '',
            snippet: result.text || result.summary || '',
            date: result.publishedDate,
            position: exaResults.indexOf(result) + 1,
          }))

          return {
            results: transformedResults,
            query,
            type,
            totalResults: count,
            source: 'exa',
          }
        }

        logger.warn('exa_search returned no results, falling back to Serper', {
          queryLength: query.length,
        })
      } catch (exaError: any) {
        logger.warn('exa_search failed, falling back to Serper', {
          error: exaError?.message,
        })
      }
    }

    // Fall back to Serper if Exa failed or wasn't available
    if (!hasSerperApiKey) {
      throw new Error('No search API keys available (EXA_API_KEY or SERPER_API_KEY required)')
    }

    const toolParams = {
      query,
      num,
      type,
      gl,
      hl,
      apiKey: env.SERPER_API_KEY || '',
    }

    try {
      logger.debug('Calling serper_search tool', { type, num, gl, hl })
      const result = await executeTool('serper_search', toolParams)
      const results = (result as any)?.output?.searchResults || []
      const count = Array.isArray(results) ? results.length : 0
      const firstTitle = count > 0 ? String(results[0]?.title || '') : undefined

      logger.info('serper_search completed', {
        success: result.success,
        resultsCount: count,
        firstTitlePreview: firstTitle?.slice(0, 120),
      })

      if (!result.success) {
        logger.error('serper_search failed', { error: (result as any)?.error })
        throw new Error((result as any)?.error || 'Search failed')
      }

      if (count === 0) {
        logger.warn('serper_search returned no results', { queryLength: query.length })
      }

      return {
        results,
        query,
        type,
        totalResults: count,
        source: 'serper',
      }
    } catch (e: any) {
      logger.error('search_online execution error', { message: e?.message })
      throw e
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: get-credentials.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/user/get-credentials.ts

```typescript
import { db } from '@sim/db'
import { account, user } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { jwtDecode } from 'jwt-decode'
import { createPermissionError, verifyWorkflowAccess } from '@/lib/copilot/auth/permissions'
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { generateRequestId } from '@/lib/core/utils/request'
import { getPersonalAndWorkspaceEnv } from '@/lib/environment/utils'
import { createLogger } from '@/lib/logs/console/logger'
import { getAllOAuthServices } from '@/lib/oauth/oauth'
import { refreshTokenIfNeeded } from '@/app/api/auth/oauth/utils'

interface GetCredentialsParams {
  workflowId?: string
}

export const getCredentialsServerTool: BaseServerTool<GetCredentialsParams, any> = {
  name: 'get_credentials',
  async execute(params: GetCredentialsParams, context?: { userId: string }): Promise<any> {
    const logger = createLogger('GetCredentialsServerTool')

    if (!context?.userId) {
      logger.error('Unauthorized attempt to access credentials - no authenticated user context')
      throw new Error('Authentication required')
    }

    const authenticatedUserId = context.userId

    let workspaceId: string | undefined

    if (params?.workflowId) {
      const { hasAccess, workspaceId: wId } = await verifyWorkflowAccess(
        authenticatedUserId,
        params.workflowId
      )

      if (!hasAccess) {
        const errorMessage = createPermissionError('access credentials in')
        logger.error('Unauthorized attempt to access credentials', {
          workflowId: params.workflowId,
          authenticatedUserId,
        })
        throw new Error(errorMessage)
      }

      workspaceId = wId
    }

    const userId = authenticatedUserId

    logger.info('Fetching credentials for authenticated user', {
      userId,
      hasWorkflowId: !!params?.workflowId,
    })

    // Fetch OAuth credentials
    const accounts = await db.select().from(account).where(eq(account.userId, userId))
    const userRecord = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)
    const userEmail = userRecord.length > 0 ? userRecord[0]?.email : null

    // Get all available OAuth services
    const allOAuthServices = getAllOAuthServices()

    // Track connected provider IDs
    const connectedProviderIds = new Set<string>()

    const connectedCredentials: Array<{
      id: string
      name: string
      provider: string
      serviceName: string
      lastUsed: string
      isDefault: boolean
      accessToken: string | null
    }> = []
    const requestId = generateRequestId()

    for (const acc of accounts) {
      const providerId = acc.providerId
      connectedProviderIds.add(providerId)

      const [baseProvider, featureType = 'default'] = providerId.split('-')
      let displayName = ''
      if (acc.idToken) {
        try {
          const decoded = jwtDecode<{ email?: string; name?: string }>(acc.idToken)
          displayName = decoded.email || decoded.name || ''
        } catch {}
      }
      if (!displayName && baseProvider === 'github') displayName = `${acc.accountId} (GitHub)`
      if (!displayName && userEmail) displayName = userEmail
      if (!displayName) displayName = `${acc.accountId} (${baseProvider})`

      // Find the service name for this provider ID
      const service = allOAuthServices.find((s) => s.providerId === providerId)
      const serviceName = service?.name ?? providerId

      let accessToken: string | null = acc.accessToken ?? null
      try {
        const { accessToken: refreshedToken } = await refreshTokenIfNeeded(
          requestId,
          acc as any,
          acc.id
        )
        accessToken = refreshedToken || accessToken
      } catch {}
      connectedCredentials.push({
        id: acc.id,
        name: displayName,
        provider: providerId,
        serviceName,
        lastUsed: acc.updatedAt.toISOString(),
        isDefault: featureType === 'default',
        accessToken,
      })
    }

    // Build list of not connected services
    const notConnectedServices = allOAuthServices
      .filter((service) => !connectedProviderIds.has(service.providerId))
      .map((service) => ({
        providerId: service.providerId,
        name: service.name,
        description: service.description,
        baseProvider: service.baseProvider,
      }))

    // Fetch environment variables from both personal and workspace
    const envResult = await getPersonalAndWorkspaceEnv(userId, workspaceId)

    // Get all unique variable names from both personal and workspace
    const personalVarNames = Object.keys(envResult.personalEncrypted)
    const workspaceVarNames = Object.keys(envResult.workspaceEncrypted)
    const allVarNames = [...new Set([...personalVarNames, ...workspaceVarNames])]

    logger.info('Fetched credentials', {
      userId,
      workspaceId,
      connectedCount: connectedCredentials.length,
      notConnectedCount: notConnectedServices.length,
      personalEnvVarCount: personalVarNames.length,
      workspaceEnvVarCount: workspaceVarNames.length,
      totalEnvVarCount: allVarNames.length,
      conflicts: envResult.conflicts,
    })

    return {
      oauth: {
        connected: {
          credentials: connectedCredentials,
          total: connectedCredentials.length,
        },
        notConnected: {
          services: notConnectedServices,
          total: notConnectedServices.length,
        },
      },
      environment: {
        variableNames: allVarNames,
        count: allVarNames.length,
        personalVariables: personalVarNames,
        workspaceVariables: workspaceVarNames,
        conflicts: envResult.conflicts,
      },
    }
  },
}
```

--------------------------------------------------------------------------------

---[FILE: set-environment-variables.ts]---
Location: sim-main/apps/sim/lib/copilot/tools/server/user/set-environment-variables.ts
Signals: Zod

```typescript
import { db } from '@sim/db'
import { workspaceEnvironment } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { createPermissionError, verifyWorkflowAccess } from '@/lib/copilot/auth/permissions'
import type { BaseServerTool } from '@/lib/copilot/tools/server/base-tool'
import { decryptSecret, encryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'

interface SetEnvironmentVariablesParams {
  variables: Record<string, any> | Array<{ name: string; value: string }>
  workflowId?: string
}

const EnvVarSchema = z.object({ variables: z.record(z.string()) })

function normalizeVariables(
  input: Record<string, any> | Array<{ name: string; value: string }>
): Record<string, string> {
  if (Array.isArray(input)) {
    return input.reduce(
      (acc, item) => {
        if (item && typeof item.name === 'string') {
          acc[item.name] = String(item.value ?? '')
        }
        return acc
      },
      {} as Record<string, string>
    )
  }
  return Object.fromEntries(
    Object.entries(input || {}).map(([k, v]) => [k, String(v ?? '')])
  ) as Record<string, string>
}

export const setEnvironmentVariablesServerTool: BaseServerTool<SetEnvironmentVariablesParams, any> =
  {
    name: 'set_environment_variables',
    async execute(
      params: SetEnvironmentVariablesParams,
      context?: { userId: string }
    ): Promise<any> {
      const logger = createLogger('SetEnvironmentVariablesServerTool')

      if (!context?.userId) {
        logger.error(
          'Unauthorized attempt to set environment variables - no authenticated user context'
        )
        throw new Error('Authentication required')
      }

      const authenticatedUserId = context.userId
      const { variables, workflowId } = params || ({} as SetEnvironmentVariablesParams)

      if (!workflowId) {
        throw new Error('workflowId is required to set workspace environment variables')
      }

      const { hasAccess, workspaceId } = await verifyWorkflowAccess(authenticatedUserId, workflowId)

      if (!hasAccess) {
        const errorMessage = createPermissionError('modify environment variables in')
        logger.error('Unauthorized attempt to set environment variables', {
          workflowId,
          authenticatedUserId,
        })
        throw new Error(errorMessage)
      }

      if (!workspaceId) {
        throw new Error('Could not determine workspace for this workflow')
      }

      const normalized = normalizeVariables(variables || {})
      const { variables: validatedVariables } = EnvVarSchema.parse({ variables: normalized })

      // Fetch existing workspace environment variables
      const existingData = await db
        .select()
        .from(workspaceEnvironment)
        .where(eq(workspaceEnvironment.workspaceId, workspaceId))
        .limit(1)
      const existingEncrypted = (existingData[0]?.variables as Record<string, string>) || {}

      const toEncrypt: Record<string, string> = {}
      const added: string[] = []
      const updated: string[] = []
      for (const [key, newVal] of Object.entries(validatedVariables)) {
        if (!(key in existingEncrypted)) {
          toEncrypt[key] = newVal
          added.push(key)
        } else {
          try {
            const { decrypted } = await decryptSecret(existingEncrypted[key])
            if (decrypted !== newVal) {
              toEncrypt[key] = newVal
              updated.push(key)
            }
          } catch {
            toEncrypt[key] = newVal
            updated.push(key)
          }
        }
      }

      const newlyEncrypted = await Object.entries(toEncrypt).reduce(
        async (accP, [key, val]) => {
          const acc = await accP
          const { encrypted } = await encryptSecret(val)
          return { ...acc, [key]: encrypted }
        },
        Promise.resolve({} as Record<string, string>)
      )

      const finalEncrypted = { ...existingEncrypted, ...newlyEncrypted }

      // Save to workspace environment variables
      await db
        .insert(workspaceEnvironment)
        .values({
          id: crypto.randomUUID(),
          workspaceId,
          variables: finalEncrypted,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [workspaceEnvironment.workspaceId],
          set: { variables: finalEncrypted, updatedAt: new Date() },
        })

      logger.info('Saved workspace environment variables', {
        workspaceId,
        workflowId,
        addedCount: added.length,
        updatedCount: updated.length,
        totalCount: Object.keys(finalEncrypted).length,
      })

      return {
        message: `Successfully processed ${Object.keys(validatedVariables).length} workspace environment variable(s): ${added.length} added, ${updated.length} updated`,
        variableCount: Object.keys(validatedVariables).length,
        variableNames: Object.keys(validatedVariables),
        totalVariableCount: Object.keys(finalEncrypted).length,
        addedVariables: added,
        updatedVariables: updated,
        workspaceId,
      }
    },
  }
```

--------------------------------------------------------------------------------

````
