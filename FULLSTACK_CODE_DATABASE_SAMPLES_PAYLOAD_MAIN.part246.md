---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 246
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 246 of 695)

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

---[FILE: createApiKeysCollection.ts]---
Location: payload-main/packages/plugin-mcp/src/collections/createApiKeysCollection.ts

```typescript
import type { CollectionConfig } from 'payload'

import type { PluginMCPServerConfig } from '../types.js'

import { toCamelCase } from '../utils/camelCase.js'

const addEnabledCollectionTools = (collections: PluginMCPServerConfig['collections']) => {
  const enabledCollectionSlugs = Object.keys(collections || {}).filter((collection) => {
    const fullyEnabled =
      typeof collections?.[collection]?.enabled === 'boolean' && collections?.[collection]?.enabled

    if (fullyEnabled) {
      return true
    }

    const partiallyEnabled =
      typeof collections?.[collection]?.enabled !== 'boolean' &&
      ((typeof collections?.[collection]?.enabled?.find === 'boolean' &&
        collections?.[collection]?.enabled?.find === true) ||
        (typeof collections?.[collection]?.enabled?.create === 'boolean' &&
          collections?.[collection]?.enabled?.create === true) ||
        (typeof collections?.[collection]?.enabled?.update === 'boolean' &&
          collections?.[collection]?.enabled?.update === true) ||
        (typeof collections?.[collection]?.enabled?.delete === 'boolean' &&
          collections?.[collection]?.enabled?.delete === true))

    if (partiallyEnabled) {
      return true
    }
  })
  return enabledCollectionSlugs.map((enabledCollectionSlug) => ({
    type: 'collapsible' as const,
    admin: {
      description: `Manage client access to ${enabledCollectionSlug}`,
      position: 'sidebar' as const,
    },
    fields: [
      {
        name: `${toCamelCase(enabledCollectionSlug)}`,
        type: 'group' as const,
        fields: [
          ...(collections?.[enabledCollectionSlug]?.enabled === true ||
          (typeof collections?.[enabledCollectionSlug]?.enabled !== 'boolean' &&
            typeof collections?.[enabledCollectionSlug]?.enabled?.find === 'boolean' &&
            collections?.[enabledCollectionSlug]?.enabled?.find === true)
            ? [
                {
                  name: `find`,
                  type: 'checkbox' as const,
                  admin: {
                    description: `Allow clients to find ${enabledCollectionSlug}.`,
                  },
                  defaultValue: false,
                  label: 'Find',
                },
              ]
            : []),

          ...(collections?.[enabledCollectionSlug]?.enabled === true ||
          (typeof collections?.[enabledCollectionSlug]?.enabled !== 'boolean' &&
            typeof collections?.[enabledCollectionSlug]?.enabled?.create === 'boolean' &&
            collections?.[enabledCollectionSlug]?.enabled?.create === true)
            ? [
                {
                  name: `create`,
                  type: 'checkbox' as const,
                  admin: {
                    description: `Allow clients to create ${enabledCollectionSlug}.`,
                  },
                  defaultValue: false,
                  label: 'Create',
                },
              ]
            : []),

          ...(collections?.[enabledCollectionSlug]?.enabled === true ||
          (typeof collections?.[enabledCollectionSlug]?.enabled !== 'boolean' &&
            typeof collections?.[enabledCollectionSlug]?.enabled?.update === 'boolean' &&
            collections?.[enabledCollectionSlug]?.enabled?.update === true)
            ? [
                {
                  name: `update`,
                  type: 'checkbox' as const,
                  admin: {
                    description: `Allow clients to update ${enabledCollectionSlug}.`,
                  },
                  defaultValue: false,
                  label: 'Update',
                },
              ]
            : []),

          ...(collections?.[enabledCollectionSlug]?.enabled === true ||
          (typeof collections?.[enabledCollectionSlug]?.enabled !== 'boolean' &&
            typeof collections?.[enabledCollectionSlug]?.enabled?.delete === 'boolean' &&
            collections?.[enabledCollectionSlug]?.enabled?.delete === true)
            ? [
                {
                  name: `delete`,
                  type: 'checkbox' as const,
                  admin: {
                    description: `Allow clients to delete ${enabledCollectionSlug}.`,
                  },
                  defaultValue: false,
                  label: 'Delete',
                },
              ]
            : []),
        ],
        label: false as const,
      },
    ],
    label: `${enabledCollectionSlug.charAt(0).toUpperCase() + toCamelCase(enabledCollectionSlug).slice(1)}`,
  }))
}

export const createAPIKeysCollection = (
  collections: PluginMCPServerConfig['collections'],
  customTools: Array<{ description: string; name: string }> = [],
  experimentalTools: NonNullable<PluginMCPServerConfig['experimental']>['tools'] = {},
  pluginOptions: PluginMCPServerConfig,
): CollectionConfig => {
  const customToolsFields = customTools.map((tool) => {
    const camelCasedName = toCamelCase(tool.name)
    return {
      name: camelCasedName,
      type: 'checkbox' as const,
      admin: {
        description: tool.description,
      },
      defaultValue: true,
      label: camelCasedName,
    }
  })

  const customResourceFields =
    pluginOptions.mcp?.resources?.map((resource) => {
      const camelCasedName = toCamelCase(resource.name)
      return {
        name: camelCasedName,
        type: 'checkbox' as const,
        admin: {
          description: resource.description,
        },
        defaultValue: true,
        label: camelCasedName,
      }
    }) || []

  const customPromptFields =
    pluginOptions.mcp?.prompts?.map((prompt) => {
      const camelCasedName = toCamelCase(prompt.name)
      return {
        name: camelCasedName,
        type: 'checkbox' as const,
        admin: {
          description: prompt.description,
        },
        defaultValue: true,
        label: camelCasedName,
      }
    }) || []

  const userCollection = pluginOptions.userCollection
    ? typeof pluginOptions.userCollection === 'string'
      ? pluginOptions.userCollection
      : pluginOptions.userCollection.slug
    : 'users'

  return {
    slug: 'payload-mcp-api-keys',
    admin: {
      description:
        'API keys control which collections, resources, tools, and prompts MCP clients can access',
      group: 'MCP',
      useAsTitle: 'label',
    },
    auth: {
      disableLocalStrategy: true,
      useAPIKey: true,
    },
    fields: [
      {
        name: 'user',
        type: 'relationship',
        admin: {
          description: 'The user that the API key is associated with.',
        },
        relationTo: userCollection,
        required: true,
      },
      {
        name: 'label',
        type: 'text',
        admin: {
          description: 'A useful label for the API key.',
        },
      },
      {
        name: 'description',
        type: 'text',
        admin: {
          description: 'The purpose of the API key.',
        },
      },

      ...addEnabledCollectionTools(collections),

      ...(customTools.length > 0
        ? [
            {
              type: 'collapsible' as const,
              admin: {
                description: 'Manage client access to tools',
                position: 'sidebar' as const,
              },
              fields: [
                {
                  name: 'payload-mcp-tool',
                  type: 'group' as const,
                  fields: customToolsFields,
                  label: false as const,
                },
              ],
              label: 'Tools',
            },
          ]
        : []),

      ...(pluginOptions.mcp?.resources && pluginOptions.mcp?.resources.length > 0
        ? [
            {
              type: 'collapsible' as const,
              admin: {
                description: 'Manage client access to resources',
                position: 'sidebar' as const,
              },
              fields: [
                {
                  name: 'payload-mcp-resource',
                  type: 'group' as const,
                  fields: customResourceFields,
                  label: false as const,
                },
              ],
              label: 'Resources',
            },
          ]
        : []),

      ...(pluginOptions.mcp?.prompts && pluginOptions.mcp?.prompts.length > 0
        ? [
            {
              type: 'collapsible' as const,
              admin: {
                description: 'Manage client access to prompts',
                position: 'sidebar' as const,
              },
              fields: [
                {
                  name: 'payload-mcp-prompt',
                  type: 'group' as const,
                  fields: customPromptFields,
                  label: false as const,
                },
              ],
              label: 'Prompts',
            },
          ]
        : []),

      // Experimental Tools
      ...(process.env.NODE_ENV === 'development' &&
      (experimentalTools?.collections?.enabled ||
        experimentalTools?.jobs?.enabled ||
        experimentalTools?.config?.enabled ||
        experimentalTools?.auth?.enabled)
        ? [
            {
              type: 'collapsible' as const,
              admin: {
                description: 'Manage client access to experimental tools',
                position: 'sidebar' as const,
              },
              fields: [
                ...(experimentalTools?.collections?.enabled
                  ? [
                      {
                        name: 'collections',
                        type: 'group' as const,
                        fields: [
                          {
                            name: 'find',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to find and list Payload collections with optional content and document counts.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'create',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to create new Payload collections with specified fields and configuration.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'update',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to update existing Payload collections with new fields, modifications, or configuration changes.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'delete',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to delete Payload collections and optionally update the configuration.',
                            },
                            defaultValue: false,
                          },
                        ],
                      },
                    ]
                  : []),
                ...(experimentalTools?.jobs?.enabled
                  ? [
                      {
                        name: 'jobs',
                        type: 'group' as const,
                        fields: [
                          {
                            name: 'create',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to create new Payload jobs (tasks and workflows) with custom schemas and configuration.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'run',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to execute Payload jobs with custom input data and queue options.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'update',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to update existing Payload jobs with new schemas, configuration, or handler code.',
                            },
                            defaultValue: false,
                          },
                        ],
                      },
                    ]
                  : []),
                ...(experimentalTools?.config?.enabled
                  ? [
                      {
                        name: 'config',
                        type: 'group' as const,
                        fields: [
                          {
                            name: 'find',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to read and display a Payload configuration file.',
                            },
                            defaultValue: false,
                          },
                          {
                            name: 'update',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to update a Payload configuration file with various modifications.',
                            },
                            defaultValue: false,
                          },
                        ],
                      },
                    ]
                  : []),
                ...(experimentalTools?.auth?.enabled
                  ? [
                      {
                        name: 'auth',
                        type: 'group' as const,
                        fields: [
                          {
                            name: 'auth',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to check authentication status for a user by setting custom headers. (e.g. {"Authorization": "Bearer <token>"})',
                            },
                            defaultValue: false,
                            label: 'Check Auth Status',
                          },
                          {
                            name: 'login',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to authenticate a user with email and password.',
                            },
                            defaultValue: false,
                            label: 'User Login',
                          },
                          {
                            name: 'verify',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to verify a user email with a verification token.',
                            },
                            defaultValue: false,
                            label: 'Email Verification',
                          },
                          {
                            name: 'resetPassword',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to reset a user password with a reset token.',
                            },
                            defaultValue: false,
                            label: 'Reset Password',
                          },
                          {
                            name: 'forgotPassword',
                            type: 'checkbox' as const,
                            admin: {
                              description: 'Allow LLMs to send a password reset email to a user.',
                            },
                            defaultValue: false,
                            label: 'Forgot Password',
                          },
                          {
                            name: 'unlock',
                            type: 'checkbox' as const,
                            admin: {
                              description:
                                'Allow LLMs to unlock a user account that has been locked due to failed login attempts.',
                            },
                            defaultValue: false,
                            label: 'Unlock Account',
                          },
                        ],
                      },
                    ]
                  : []),
              ],
              label: 'Experimental Tools',
            },
          ]
        : []),
    ],
    labels: {
      plural: 'API Keys',
      singular: 'API Key',
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mcp.ts]---
Location: payload-main/packages/plugin-mcp/src/endpoints/mcp.ts

```typescript
import crypto from 'crypto'
import { type PayloadHandler, UnauthorizedError, type Where } from 'payload'

import type { MCPAccessSettings, PluginMCPServerConfig } from '../types.js'

import { createRequestFromPayloadRequest } from '../mcp/createRequest.js'
import { getMCPHandler } from '../mcp/getMcpHandler.js'

export const initializeMCPHandler = (pluginOptions: PluginMCPServerConfig) => {
  const mcpHandler: PayloadHandler = async (req) => {
    const { payload } = req
    const MCPOptions = pluginOptions.mcp || {}
    const MCPHandlerOptions = MCPOptions.handlerOptions || {}
    const useVerboseLogs = MCPHandlerOptions.verboseLogs ?? false

    req.payloadAPI = 'MCP' as const

    const getDefaultMcpAccessSettings = async (overrideApiKey?: null | string) => {
      const apiKey =
        (overrideApiKey ?? req.headers.get('Authorization')?.startsWith('Bearer '))
          ? req.headers.get('Authorization')?.replace('Bearer ', '').trim()
          : null

      if (apiKey === null) {
        throw new UnauthorizedError()
      }

      const sha256APIKeyIndex = crypto
        .createHmac('sha256', payload.secret)
        .update(apiKey || '')
        .digest('hex')

      const apiKeyConstraints = [
        {
          apiKeyIndex: {
            equals: sha256APIKeyIndex,
          },
        },
      ]

      const where: Where = {
        or: apiKeyConstraints,
      }

      const { docs } = await payload.find({
        collection: 'payload-mcp-api-keys',
        limit: 1,
        pagination: false,
        where,
      })

      if (docs.length === 0) {
        throw new UnauthorizedError()
      }

      if (useVerboseLogs) {
        payload.logger.info('[payload-mcp] API Key is valid')
      }

      return docs[0] as unknown as MCPAccessSettings
    }

    const mcpAccessSettings = pluginOptions.overrideAuth
      ? await pluginOptions.overrideAuth(req, getDefaultMcpAccessSettings)
      : await getDefaultMcpAccessSettings()

    const handler = getMCPHandler(pluginOptions, mcpAccessSettings, req)
    const request = createRequestFromPayloadRequest(req)
    return await handler(request)
  }
  return mcpHandler
}
```

--------------------------------------------------------------------------------

---[FILE: createRequest.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/createRequest.ts

```typescript
import { AuthenticationError, type PayloadRequest } from 'payload'

export const createRequestFromPayloadRequest = (req: PayloadRequest) => {
  if (!req.url) {
    throw new AuthenticationError()
  }
  return new Request(req.url, {
    body: req.body,
    duplex: 'half',
    headers: req.headers,
    method: req.method,
  } as { duplex: 'half' } & RequestInit)
}
```

--------------------------------------------------------------------------------

---[FILE: getMcpHandler.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/getMcpHandler.ts

```typescript
import type { JSONSchema4 } from 'json-schema'

import { createMcpHandler } from '@vercel/mcp-adapter'
import { join } from 'path'
import { APIError, configToJSONSchema, type PayloadRequest, type TypedUser } from 'payload'

import type { MCPAccessSettings, PluginMCPServerConfig } from '../types.js'

import { toCamelCase } from '../utils/camelCase.js'
import { registerTool } from './registerTool.js'

// Tools
import { createResourceTool } from './tools/resource/create.js'
import { deleteResourceTool } from './tools/resource/delete.js'
import { findResourceTool } from './tools/resource/find.js'
import { updateResourceTool } from './tools/resource/update.js'

// Experimental Tools
/**
 * @experimental This tools are experimental and may change or be removed in the future.
 */
import { authTool } from './tools/auth/auth.js'
import { forgotPasswordTool } from './tools/auth/forgotPassword.js'
import { loginTool } from './tools/auth/login.js'
import { resetPasswordTool } from './tools/auth/resetPassword.js'
import { unlockTool } from './tools/auth/unlock.js'
import { verifyTool } from './tools/auth/verify.js'
import { createCollectionTool } from './tools/collection/create.js'
import { deleteCollectionTool } from './tools/collection/delete.js'
import { findCollectionTool } from './tools/collection/find.js'
import { updateCollectionTool } from './tools/collection/update.js'
import { findConfigTool } from './tools/config/find.js'
import { updateConfigTool } from './tools/config/update.js'
import { createJobTool } from './tools/job/create.js'
import { runJobTool } from './tools/job/run.js'
import { updateJobTool } from './tools/job/update.js'

export const getMCPHandler = (
  pluginOptions: PluginMCPServerConfig,
  mcpAccessSettings: MCPAccessSettings,
  req: PayloadRequest,
) => {
  const { payload } = req
  const configSchema = configToJSONSchema(payload.config)

  // Handler wrapper that injects req before the _extra argument
  const wrapHandler = (handler: (...args: any[]) => any) => {
    return async (...args: any[]) => {
      const _extra = args[args.length - 1]
      const handlerArgs = args.slice(0, -1)
      return await handler(...handlerArgs, req, _extra)
    }
  }

  const payloadToolHandler = (
    handler: NonNullable<NonNullable<PluginMCPServerConfig['mcp']>['tools']>[number]['handler'],
  ) => wrapHandler(handler)

  const payloadPromptHandler = (
    handler: NonNullable<NonNullable<PluginMCPServerConfig['mcp']>['prompts']>[number]['handler'],
  ) => wrapHandler(handler)

  const payloadResourceHandler = (
    handler: NonNullable<NonNullable<PluginMCPServerConfig['mcp']>['resources']>[number]['handler'],
  ) => wrapHandler(handler)

  // User
  const user = mcpAccessSettings.user

  // MCP Server and Handler Options
  const MCPOptions = pluginOptions.mcp || {}
  const customMCPTools = MCPOptions.tools || []
  const customMCPPrompts = MCPOptions.prompts || []
  const customMCPResources = MCPOptions.resources || []
  const MCPHandlerOptions = MCPOptions.handlerOptions || {}
  const serverOptions = MCPOptions.serverOptions || {}
  const useVerboseLogs = MCPHandlerOptions.verboseLogs ?? false

  // Experimental MCP Tool Requirements
  const isDevelopment = process.env.NODE_ENV === 'development'
  const experimentalTools: NonNullable<PluginMCPServerConfig['experimental']>['tools'] =
    pluginOptions?.experimental?.tools || {}
  const collectionsPluginConfig = pluginOptions.collections || {}
  const collectionsDirPath =
    experimentalTools && experimentalTools.collections?.collectionsDirPath
      ? experimentalTools.collections.collectionsDirPath
      : join(process.cwd(), 'src/collections')
  const configFilePath =
    experimentalTools && experimentalTools.config?.configFilePath
      ? experimentalTools.config.configFilePath
      : join(process.cwd(), 'src/payload.config.ts')
  const jobsDirPath =
    experimentalTools && experimentalTools.jobs?.jobsDirPath
      ? experimentalTools.jobs.jobsDirPath
      : join(process.cwd(), 'src/jobs')

  try {
    return createMcpHandler(
      (server) => {
        const enabledCollectionSlugs = Object.keys(collectionsPluginConfig || {}).filter(
          (collection) => {
            const fullyEnabled =
              typeof collectionsPluginConfig?.[collection]?.enabled === 'boolean' &&
              collectionsPluginConfig?.[collection]?.enabled

            if (fullyEnabled) {
              return true
            }

            const partiallyEnabled =
              typeof collectionsPluginConfig?.[collection]?.enabled !== 'boolean' &&
              ((typeof collectionsPluginConfig?.[collection]?.enabled?.find === 'boolean' &&
                collectionsPluginConfig?.[collection]?.enabled?.find === true) ||
                (typeof collectionsPluginConfig?.[collection]?.enabled?.create === 'boolean' &&
                  collectionsPluginConfig?.[collection]?.enabled?.create === true) ||
                (typeof collectionsPluginConfig?.[collection]?.enabled?.update === 'boolean' &&
                  collectionsPluginConfig?.[collection]?.enabled?.update === true) ||
                (typeof collectionsPluginConfig?.[collection]?.enabled?.delete === 'boolean' &&
                  collectionsPluginConfig?.[collection]?.enabled?.delete === true))

            if (partiallyEnabled) {
              return true
            }
          },
        )

        // Collection Operation Tools
        enabledCollectionSlugs.forEach((enabledCollectionSlug) => {
          try {
            const schema = configSchema.definitions?.[enabledCollectionSlug] as JSONSchema4

            const toolCapabilities = mcpAccessSettings?.[
              `${toCamelCase(enabledCollectionSlug)}`
            ] as Record<string, unknown>
            const allowCreate: boolean | undefined = toolCapabilities?.create as boolean
            const allowUpdate: boolean | undefined = toolCapabilities?.update as boolean
            const allowFind: boolean | undefined = toolCapabilities?.find as boolean
            const allowDelete: boolean | undefined = toolCapabilities?.delete as boolean

            if (allowCreate) {
              registerTool(
                allowCreate,
                `Create ${enabledCollectionSlug}`,
                () =>
                  createResourceTool(
                    server,
                    req,
                    user,
                    useVerboseLogs,
                    enabledCollectionSlug,
                    collectionsPluginConfig,
                    schema,
                  ),
                payload,
                useVerboseLogs,
              )
            }
            if (allowUpdate) {
              registerTool(
                allowUpdate,
                `Update ${enabledCollectionSlug}`,
                () =>
                  updateResourceTool(
                    server,
                    req,
                    user,
                    useVerboseLogs,
                    enabledCollectionSlug,
                    collectionsPluginConfig,
                    schema,
                  ),
                payload,
                useVerboseLogs,
              )
            }
            if (allowFind) {
              registerTool(
                allowFind,
                `Find ${enabledCollectionSlug}`,
                () =>
                  findResourceTool(
                    server,
                    req,
                    user,
                    useVerboseLogs,
                    enabledCollectionSlug,
                    collectionsPluginConfig,
                  ),
                payload,
                useVerboseLogs,
              )
            }
            if (allowDelete) {
              registerTool(
                allowDelete,
                `Delete ${enabledCollectionSlug}`,
                () =>
                  deleteResourceTool(
                    server,
                    req,
                    user,
                    useVerboseLogs,
                    enabledCollectionSlug,
                    collectionsPluginConfig,
                  ),
                payload,
                useVerboseLogs,
              )
            }
          } catch (error) {
            throw new APIError(
              `Error registering tools for collection ${enabledCollectionSlug}: ${String(error)}`,
              500,
            )
          }
        })

        // Custom tools
        customMCPTools.forEach((tool) => {
          const camelCasedToolName = toCamelCase(tool.name)
          const isToolEnabled = mcpAccessSettings['payload-mcp-tool']?.[camelCasedToolName] ?? false

          registerTool(
            isToolEnabled,
            tool.name,
            () =>
              server.tool(
                tool.name,
                tool.description,
                tool.parameters,
                payloadToolHandler(tool.handler),
              ),
            payload,
            useVerboseLogs,
          )
        })

        // Custom prompts
        customMCPPrompts.forEach((prompt) => {
          const camelCasedPromptName = toCamelCase(prompt.name)
          const isPromptEnabled =
            mcpAccessSettings['payload-mcp-prompt']?.[camelCasedPromptName] ?? false

          if (isPromptEnabled) {
            server.registerPrompt(
              prompt.name,
              {
                argsSchema: prompt.argsSchema,
                description: prompt.description,
                title: prompt.title,
              },
              payloadPromptHandler(prompt.handler),
            )
            if (useVerboseLogs) {
              payload.logger.info(`[payload-mcp] ✅ Prompt: ${prompt.title} Registered.`)
            }
          } else if (useVerboseLogs) {
            payload.logger.info(`[payload-mcp] ⏭️ Prompt: ${prompt.title} Skipped.`)
          }
        })

        // Custom resources
        customMCPResources.forEach((resource) => {
          const camelCasedResourceName = toCamelCase(resource.name)
          const isResourceEnabled =
            mcpAccessSettings['payload-mcp-resource']?.[camelCasedResourceName] ?? false

          if (isResourceEnabled) {
            server.registerResource(
              resource.name,
              // @ts-expect-error - Overload type is not working however -- ResourceTemplate OR String is a valid type
              resource.uri,
              {
                description: resource.description,
                mimeType: resource.mimeType,
                title: resource.title,
              },
              payloadResourceHandler(resource.handler),
            )

            if (useVerboseLogs) {
              payload.logger.info(`[payload-mcp] ✅ Resource: ${resource.title} Registered.`)
            }
          } else if (useVerboseLogs) {
            payload.logger.info(`[payload-mcp] ⏭️ Resource: ${resource.title} Skipped.`)
          }
        })

        // Experimental - Collection Schema Modfication Tools
        if (
          mcpAccessSettings.collections?.create &&
          experimentalTools.collections?.enabled &&
          isDevelopment
        ) {
          registerTool(
            mcpAccessSettings.collections.create,
            'Create Collection',
            () =>
              createCollectionTool(server, req, useVerboseLogs, collectionsDirPath, configFilePath),
            payload,
            useVerboseLogs,
          )
        }
        if (
          mcpAccessSettings.collections?.delete &&
          experimentalTools.collections?.enabled &&
          isDevelopment
        ) {
          registerTool(
            mcpAccessSettings.collections.delete,
            'Delete Collection',
            () =>
              deleteCollectionTool(server, req, useVerboseLogs, collectionsDirPath, configFilePath),
            payload,
            useVerboseLogs,
          )
        }

        if (
          mcpAccessSettings.collections?.find &&
          experimentalTools.collections?.enabled &&
          isDevelopment
        ) {
          registerTool(
            mcpAccessSettings.collections.find,
            'Find Collection',
            () => findCollectionTool(server, req, useVerboseLogs, collectionsDirPath),
            payload,
            useVerboseLogs,
          )
        }

        if (
          mcpAccessSettings.collections?.update &&
          experimentalTools.collections?.enabled &&
          isDevelopment
        ) {
          registerTool(
            mcpAccessSettings.collections.update,
            'Update Collection',
            () =>
              updateCollectionTool(server, req, useVerboseLogs, collectionsDirPath, configFilePath),
            payload,
            useVerboseLogs,
          )
        }

        // Experimental - Payload Config Modification Tools
        if (mcpAccessSettings.config?.find && experimentalTools.config?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.config.find,
            'Find Config',
            () => findConfigTool(server, req, useVerboseLogs, configFilePath),
            payload,
            useVerboseLogs,
          )
        }

        if (
          mcpAccessSettings.config?.update &&
          experimentalTools.config?.enabled &&
          isDevelopment
        ) {
          registerTool(
            mcpAccessSettings.config.update,
            'Update Config',
            () => updateConfigTool(server, req, useVerboseLogs, configFilePath),
            payload,
            useVerboseLogs,
          )
        }

        // Experimental - Job Modification Tools
        if (mcpAccessSettings.jobs?.create && experimentalTools.jobs?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.jobs.create,
            'Create Job',
            () => createJobTool(server, req, useVerboseLogs, jobsDirPath),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.jobs?.update && experimentalTools.jobs?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.jobs.update,
            'Update Job',
            () => updateJobTool(server, req, useVerboseLogs, jobsDirPath),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.jobs?.run && experimentalTools.jobs?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.jobs.run,
            'Run Job',
            () => runJobTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        // Experimental - Auth Modification Tools
        if (mcpAccessSettings.auth?.auth && experimentalTools.auth?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.auth.auth,
            'Auth',
            () => authTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.auth?.login && experimentalTools.auth?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.auth.login,
            'Login',
            () => loginTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.auth?.verify && experimentalTools.auth?.enabled && isDevelopment) {
          registerTool(
            mcpAccessSettings.auth.verify,
            'Verify',
            () => verifyTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.auth?.resetPassword && experimentalTools.auth?.enabled) {
          registerTool(
            mcpAccessSettings.auth.resetPassword,
            'Reset Password',
            () => resetPasswordTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.auth?.forgotPassword && experimentalTools.auth?.enabled) {
          registerTool(
            mcpAccessSettings.auth.forgotPassword,
            'Forgot Password',
            () => forgotPasswordTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (mcpAccessSettings.auth?.unlock && experimentalTools.auth?.enabled) {
          registerTool(
            mcpAccessSettings.auth.unlock,
            'Unlock',
            () => unlockTool(server, req, useVerboseLogs),
            payload,
            useVerboseLogs,
          )
        }

        if (useVerboseLogs) {
          payload.logger.info('[payload-mcp] 🚀 MCP Server Ready.')
        }
      },
      {
        serverInfo: serverOptions.serverInfo,
      },
      {
        basePath: MCPHandlerOptions.basePath || '/api',
        maxDuration: MCPHandlerOptions.maxDuration || 60,
        // INFO: Disabled until developer clarity is reached for server side streaming and we have an auth pattern for all SSE patterns
        // redisUrl: MCPHandlerOptions.redisUrl || process.env.REDIS_URL,
        verboseLogs: useVerboseLogs,
      },
    )
  } catch (error) {
    throw new APIError(`Error initializing MCP handler: ${String(error)}`, 500)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: registerTool.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/registerTool.ts

```typescript
export const registerTool = (
  isEnabled: boolean | undefined,
  toolType: string,
  registrationFn: () => void,
  payload: { logger: { info: (message: string) => void } },
  useVerboseLogs: boolean,
) => {
  if (isEnabled) {
    try {
      registrationFn()
      if (useVerboseLogs) {
        payload.logger.info(`[payload-mcp] ✅ Tool: ${toolType} Registered.`)
      }
    } catch (error) {
      // Log the error and re-throw
      payload.logger.info(`[payload-mcp] ❌ Tool: ${toolType} Failed to register.`)
      throw error
    }
  } else if (useVerboseLogs) {
    payload.logger.info(`[payload-mcp] ⏭️ Tool: ${toolType} Skipped.`)
  }
}
```

--------------------------------------------------------------------------------

````
