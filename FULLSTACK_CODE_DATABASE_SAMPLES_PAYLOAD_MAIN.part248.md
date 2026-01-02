---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 248
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 248 of 695)

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

---[FILE: schemas.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/schemas.ts
Signals: Zod

```typescript
import { z } from 'zod'

export const toolSchemas = {
  findResources: {
    description: 'Find documents in a collection by ID or where clause using Find or FindByID.',
    parameters: z.object({
      id: z
        .union([z.string(), z.number()])
        .optional()
        .describe(
          'Optional: specific document ID to retrieve. If not provided, returns all documents',
        ),
      fallbackLocale: z
        .string()
        .optional()
        .describe('Optional: fallback locale code to use when requested locale is not available'),
      limit: z
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .optional()
        .default(10)
        .describe('Maximum number of documents to return (default: 10, max: 100)'),
      locale: z
        .string()
        .optional()
        .describe(
          'Optional: locale code to retrieve data in (e.g., "en", "es"). Use "all" to retrieve all locales for localized fields',
        ),
      page: z
        .number()
        .int()
        .min(1, 'Page must be at least 1')
        .optional()
        .default(1)
        .describe('Page number for pagination (default: 1)'),
      sort: z
        .string()
        .optional()
        .describe('Field to sort by (e.g., "createdAt", "-updatedAt" for descending)'),
      where: z
        .string()
        .optional()
        .describe(
          'Optional JSON string for where clause filtering (e.g., \'{"title": {"contains": "test"}}\')',
        ),
    }),
  },

  createResource: {
    description: 'Create a document in a collection.',
    parameters: z.object({
      data: z.string().describe('JSON string containing the data for the new document'),
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
    }),
  },

  updateResource: {
    description: 'Update documents in a collection by ID or where clause.',
    parameters: z.object({
      id: z
        .union([z.string(), z.number()])
        .optional()
        .describe('Optional: specific document ID to update'),
      data: z.string().describe('JSON string containing the data to update'),
      depth: z
        .number()
        .int()
        .min(0)
        .max(10)
        .optional()
        .default(0)
        .describe('Depth of population for relationships'),
      draft: z.boolean().optional().default(false).describe('Whether to update as a draft'),
      fallbackLocale: z
        .string()
        .optional()
        .describe('Optional: fallback locale code to use when requested locale is not available'),
      filePath: z.string().optional().describe('Optional: absolute file path for file uploads'),
      locale: z
        .string()
        .optional()
        .describe(
          'Optional: locale code to update the document in (e.g., "en", "es"). Defaults to the default locale',
        ),
      overrideLock: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to override document locks'),
      overwriteExistingFiles: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to overwrite existing files'),
      where: z
        .string()
        .optional()
        .describe('Optional: JSON string for where clause to update multiple documents'),
    }),
  },

  deleteResource: {
    description: 'Delete documents in a collection by ID or where clause.',
    parameters: z.object({
      id: z
        .union([z.string(), z.number()])
        .optional()
        .describe('Optional: specific document ID to delete'),
      depth: z
        .number()
        .int()
        .min(0)
        .max(10)
        .optional()
        .default(0)
        .describe('Depth of population for relationships in response'),
      fallbackLocale: z
        .string()
        .optional()
        .describe('Optional: fallback locale code to use when requested locale is not available'),
      locale: z
        .string()
        .optional()
        .describe(
          'Optional: locale code for the operation (e.g., "en", "es"). Defaults to the default locale',
        ),
      where: z
        .string()
        .optional()
        .describe('Optional: JSON string for where clause to delete multiple documents'),
    }),
  },

  // Experimental Below This Line
  createCollection: {
    description: 'Creates a new collection with specified fields and configuration.',
    parameters: z.object({
      collectionDescription: z
        .string()
        .optional()
        .describe('Optional description for the collection'),
      collectionName: z.string().describe('The name of the collection to create'),
      fields: z.array(z.any()).describe('Array of field definitions for the collection'),
      hasUpload: z
        .boolean()
        .optional()
        .describe('Whether the collection should have upload capabilities'),
    }),
  },

  findCollections: {
    description: 'Finds and lists collections with optional content and document counts.',
    parameters: z.object({
      collectionName: z
        .string()
        .optional()
        .describe('Optional: specific collection name to retrieve'),
      includeContent: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include collection file content'),
      includeCount: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include document counts for each collection'),
    }),
  },

  updateCollection: {
    description:
      'Updates an existing collection with new fields, modifications, or configuration changes.',
    parameters: z.object({
      collectionName: z.string().describe('The name of the collection to update'),
      configUpdates: z.any().optional().describe('Configuration updates (for update_config type)'),
      fieldModifications: z
        .array(z.any())
        .optional()
        .describe('Field modifications (for modify_field type)'),
      fieldNamesToRemove: z
        .array(z.string())
        .optional()
        .describe('Field names to remove (for remove_field type)'),
      newContent: z
        .string()
        .optional()
        .describe('New content to replace entire collection (for replace_content type)'),
      newFields: z.array(z.any()).optional().describe('New fields to add (for add_field type)'),
      updateType: z
        .enum(['add_field', 'remove_field', 'modify_field', 'update_config', 'replace_content'])
        .describe('Type of update to perform'),
    }),
  },

  deleteCollection: {
    description: 'Deletes a collection and optionally updates the configuration.',
    parameters: z.object({
      collectionName: z.string().describe('The name of the collection to delete'),
      confirmDeletion: z.boolean().describe('Confirmation flag to prevent accidental deletion'),
      updateConfig: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to update payload.config.ts to remove collection reference'),
    }),
  },

  findConfig: {
    description: 'Reads and displays the current configuration file.',
    parameters: z.object({
      includeMetadata: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to include file metadata (size, modified date, etc.)'),
    }),
  },

  updateConfig: {
    description: 'Updates the configuration file with various modifications.',
    parameters: z.object({
      adminConfig: z
        .any()
        .optional()
        .describe('Admin configuration updates (for update_admin type)'),
      collectionName: z
        .string()
        .optional()
        .describe('Collection name (required for add_collection and remove_collection)'),
      databaseConfig: z
        .any()
        .optional()
        .describe('Database configuration updates (for update_database type)'),
      generalConfig: z.any().optional().describe('General configuration updates'),
      newContent: z
        .string()
        .optional()
        .describe('New configuration content (for replace_content type)'),
      pluginUpdates: z
        .any()
        .optional()
        .describe('Plugin configuration updates (for update_plugins type)'),
      updateType: z
        .enum([
          'add_collection',
          'remove_collection',
          'update_admin',
          'update_database',
          'update_plugins',
          'replace_content',
        ])
        .describe('Type of configuration update to perform'),
    }),
  },

  auth: {
    description: 'Checks authentication status for the current user.',
    parameters: z.object({
      headers: z
        .string()
        .optional()
        .describe(
          'Optional JSON string containing custom headers to send with the authentication request',
        ),
    }),
  },

  login: {
    description: 'Authenticates a user with email and password.',
    parameters: z.object({
      collection: z.string().describe('The collection containing the user (e.g., "users")'),
      depth: z
        .number()
        .int()
        .min(0)
        .max(10)
        .optional()
        .default(0)
        .describe('Depth of population for relationships'),
      email: z.string().email().describe('The user email address'),
      overrideAccess: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to override access controls'),
      password: z.string().describe('The user password'),
      showHiddenFields: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to show hidden fields in the response'),
    }),
  },

  verify: {
    description: 'Verifies a user email with a verification token.',
    parameters: z.object({
      collection: z.string().describe('The collection containing the user (e.g., "users")'),
      token: z.string().describe('The verification token sent to the user email'),
    }),
  },

  resetPassword: {
    description: 'Resets a user password with a reset token.',
    parameters: z.object({
      collection: z.string().describe('The collection containing the user (e.g., "users")'),
      password: z.string().describe('The new password for the user'),
      token: z.string().describe('The password reset token sent to the user email'),
    }),
  },

  forgotPassword: {
    description: 'Sends a password reset email to a user.',
    parameters: z.object({
      collection: z.string().describe('The collection containing the user (e.g., "users")'),
      disableEmail: z
        .boolean()
        .optional()
        .default(false)
        .describe('Whether to disable sending the email (for testing)'),
      email: z.string().email().describe('The user email address'),
    }),
  },

  unlock: {
    description: 'Unlocks a user account that has been locked due to failed login attempts.',
    parameters: z.object({
      collection: z.string().describe('The collection containing the user (e.g., "users")'),
      email: z.string().email().describe('The user email address'),
    }),
  },

  createJob: {
    description: 'Creates a new job (task or workflow) with specified configuration.',
    parameters: z.object({
      description: z.string().describe('Description of what the job does'),
      inputSchema: z.record(z.any()).optional().default({}).describe('Input schema for the job'),
      jobData: z
        .record(z.any())
        .optional()
        .default({})
        .describe('Additional job configuration data'),
      jobName: z
        .string()
        .min(1, 'Job name cannot be empty')
        .regex(/^[a-z][\w-]*$/i, 'Job name must be alphanumeric and can contain underscores/dashes')
        .describe('The name of the job to create'),
      jobSlug: z
        .string()
        .min(1, 'Job slug cannot be empty')
        .regex(/^[a-z][a-z0-9-]*$/, 'Job slug must be kebab-case')
        .describe('The slug for the job (kebab-case format)'),
      jobType: z
        .enum(['task', 'workflow'])
        .describe('Whether to create a task (individual unit) or workflow (orchestrates tasks)'),
      outputSchema: z.record(z.any()).optional().default({}).describe('Output schema for the job'),
    }),
  },

  updateJob: {
    description: 'Updates an existing job with new configuration, schema, or handler code.',
    parameters: z.object({
      configUpdate: z.record(z.any()).optional().describe('New configuration for the job'),
      handlerCode: z
        .string()
        .optional()
        .describe('New handler code to replace the existing handler'),
      inputSchema: z.record(z.any()).optional().describe('New input schema for the job'),
      jobSlug: z.string().describe('The slug of the job to update'),
      outputSchema: z.record(z.any()).optional().describe('New output schema for the job'),
      taskSequence: z.array(z.any()).optional().describe('New task sequence for workflows'),
      updateType: z
        .enum(['modify_schema', 'update_tasks', 'change_config', 'replace_handler'])
        .describe('Type of update to perform on the job'),
    }),
  },

  runJob: {
    description: 'Runs a job with specified input data and queue options.',
    parameters: z.object({
      delay: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe('Delay in milliseconds before job execution'),
      input: z.record(z.any()).describe('Input data for the job execution'),
      jobSlug: z.string().describe('The slug of the job to run'),
      priority: z
        .number()
        .int()
        .min(1)
        .max(10)
        .optional()
        .describe('Job priority (1-10, higher is more important)'),
      queue: z
        .string()
        .optional()
        .describe('Queue name to use for job execution (default: "default")'),
    }),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/auth.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const authTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (headers?: string) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info('[payload-mcp] Checking authentication status')
    }

    try {
      // Parse custom headers if provided, otherwise use empty headers
      let authHeaders = new Headers()

      if (headers) {
        try {
          const parsedHeaders = JSON.parse(headers)
          authHeaders = new Headers(parsedHeaders)
          if (verboseLogs) {
            payload.logger.info(`[payload-mcp] Using custom headers: ${headers}`)
          }
        } catch (_ignore) {
          payload.logger.warn(`[payload-mcp] Invalid headers JSON: ${headers}, using empty headers`)
        }
      }

      const result = await payload.auth({
        headers: authHeaders,
      })

      if (verboseLogs) {
        payload.logger.info('[payload-mcp] Authentication check completed successfully')
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# Authentication Status\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error checking authentication: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error checking authentication**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'auth',
    toolSchemas.auth.description,
    toolSchemas.auth.parameters.shape,
    async ({ headers }) => {
      return await tool(headers)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/forgotPassword.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const forgotPasswordTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
) => {
  const tool = async (collection: string, email: string, disableEmail: boolean = false) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Sending password reset email for user: ${email} in collection: ${collection}`,
      )
    }

    try {
      const result = await payload.forgotPassword({
        collection,
        data: {
          email,
        },
        disableEmail,
      })

      if (verboseLogs) {
        payload.logger.info(
          `[payload-mcp] Password reset email sent successfully for user: ${email}`,
        )
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# Password Reset Email Sent\n\n**User:** ${email}\n**Collection:** ${collection}\n**Email Disabled:** ${disableEmail}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error sending password reset email for user ${email}: ${errorMessage}`,
      )

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error sending password reset email for user "${email}"**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'forgotPassword',
    toolSchemas.forgotPassword.description,
    toolSchemas.forgotPassword.parameters.shape,
    async ({ collection, disableEmail, email }) => {
      return await tool(collection, email, disableEmail)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/login.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const loginTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (
    collection: string,
    email: string,
    password: string,
    depth: number = 0,
    overrideAccess: boolean = false,
    showHiddenFields: boolean = false,
  ) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Attempting login for user: ${email} in collection: ${collection}`,
      )
    }

    try {
      const result = await payload.login({
        collection,
        data: {
          email,
          password,
        },
        depth,
        overrideAccess,
        showHiddenFields,
      })

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Login successful for user: ${email}`)
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# Login Successful\n\n**User:** ${email}\n**Collection:** ${collection}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Login failed for user ${email}: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Login failed for user "${email}"**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'login',
    toolSchemas.login.description,
    toolSchemas.login.parameters.shape,
    async ({ collection, depth, email, overrideAccess, password, showHiddenFields }) => {
      return await tool(collection, email, password, depth, overrideAccess, showHiddenFields)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: resetPassword.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/resetPassword.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const resetPasswordTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (collection: string, token: string, password: string) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Resetting password for user in collection: ${collection}`)
    }

    try {
      const result = await payload.resetPassword({
        collection,
        data: {
          password,
          token,
        },
        overrideAccess: true,
      })

      if (verboseLogs) {
        payload.logger.info('[payload-mcp] Password reset completed successfully')
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# Password Reset Successful\n\n**Collection:** ${collection}\n**Token:** ${token}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error resetting password: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error resetting password**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'resetPassword',
    toolSchemas.resetPassword.description,
    toolSchemas.resetPassword.parameters.shape,
    async ({ collection, password, token }) => {
      return await tool(collection, token, password)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: unlock.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/unlock.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const unlockTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (collection: string, email: string) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Unlocking user account for user: ${email} in collection: ${collection}`,
      )
    }

    try {
      const result = await payload.unlock({
        collection,
        data: {
          email,
        },
        overrideAccess: true,
      })

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] User account unlocked successfully for user: ${email}`)
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# User Account Unlocked\n\n**User:** ${email}\n**Collection:** ${collection}\n\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error unlocking user account for user ${email}: ${errorMessage}`,
      )

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error unlocking user account for user "${email}"**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'unlock',
    toolSchemas.unlock.description,
    toolSchemas.unlock.parameters.shape,
    async ({ collection, email }) => {
      return await tool(collection, email)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: verify.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/auth/verify.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { toolSchemas } from '../schemas.js'

export const verifyTool = (server: McpServer, req: PayloadRequest, verboseLogs: boolean) => {
  const tool = async (collection: string, token: string) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Verifying user account for collection: ${collection}`)
    }

    try {
      const result = await payload.verifyEmail({
        collection,
        token,
      })

      if (verboseLogs) {
        payload.logger.info('[payload-mcp] Email verification completed successfully')
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: `# Email Verification Successful\n\n**Collection:** ${collection}\n**Token:** ${token}\n**Result:** ${result ? 'Success' : 'Failed'}`,
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error verifying email: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error verifying email**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'verify',
    toolSchemas.verify.description,
    toolSchemas.verify.parameters.shape,
    async ({ collection, token }) => {
      return await tool(collection, token)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/collection/create.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { writeFileSync } from 'fs'
import { join } from 'path'

import { validateCollectionFile } from '../../helpers/fileValidation.js'
import { toolSchemas } from '../schemas.js'

export const createCollection = async (
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
  collectionName: string,
  collectionDescription: string | undefined,
  fields: any[],
  hasUpload: boolean | undefined,
) => {
  const payload = req.payload
  if (verboseLogs) {
    payload.logger.info(
      `[payload-mcp] Creating collection: ${collectionName} with ${fields.length} fields`,
    )
  }

  const capitalizedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
  const slug = collectionName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Generated slug: ${slug} for collection: ${collectionName}`)
  }

  // Generate TypeScript field definitions more systematically
  const generateFieldDefinition = (field: any) => {
    const fieldConfig = []
    fieldConfig.push(`    {`)
    fieldConfig.push(`      name: '${field.name}',`)
    fieldConfig.push(`      type: '${field.type}',`)

    if (field.required) {
      fieldConfig.push(`      required: true,`)
    }

    if (field.description) {
      fieldConfig.push(`      admin: {`)
      fieldConfig.push(`        description: '${field.description}',`)
      fieldConfig.push(`      },`)
    }

    if (field.options && field.type === 'select') {
      fieldConfig.push(`      options: [`)
      field.options.forEach((option: { label: string; value: string }) => {
        fieldConfig.push(`        { label: '${option.label}', value: '${option.value}' },`)
      })
      fieldConfig.push(`      ],`)
    }

    fieldConfig.push(`    },`)
    return fieldConfig.join('\n')
  }

  const fieldDefinitions = fields.map(generateFieldDefinition).join('\n')

  // Generate collection file content
  const collectionContent = `import type { CollectionConfig } from 'payload'

export const ${capitalizedName}: CollectionConfig = {
  slug: '${slug}',${
    collectionDescription
      ? `
  admin: {
    description: '${collectionDescription}',
  },`
      : ''
  }${
    hasUpload
      ? `
  upload: true,`
      : ''
  }
  fields: [
${fieldDefinitions}
  ],
}
`

  try {
    // Validate the collection name and path
    const fileName = `${capitalizedName}.ts`
    const filePath = join(collectionsDirPath, fileName)

    // Security check: ensure we're working with the collections directory
    if (!filePath.startsWith(collectionsDirPath)) {
      payload.logger.error(`[payload-mcp] Invalid collection path attempted: ${filePath}`)
      return {
        content: [
          {
            type: 'text' as const,
            text: '❌ **Error**: Invalid collection path',
          },
        ],
      }
    }

    // Check if file already exists
    try {
      const fs = await import('fs')
      if (fs.existsSync(filePath)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ **Error**: Collection file already exists: ${fileName}`,
            },
          ],
        }
      }
    } catch (_ignore) {
      // File doesn't exist, which is what we want
    }

    // Write the collection file
    writeFileSync(filePath, collectionContent, 'utf8')
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully created collection file: ${filePath}`)
    }

    // Validate the generated file
    const validationResult = await validateCollectionFile(fileName)
    if (validationResult.error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Generated collection has validation issues:\n\n${validationResult.error}`,
          },
        ],
      }
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `✅ **Collection created successfully!**
**File**: \`${fileName}\`
**Collection Config:**
\`\`\`typescript
${collectionContent}
\`\`\``,
        },
      ],
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error creating collection: ${errorMessage}`)

    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error creating collection**: ${errorMessage}`,
        },
      ],
    }
  }
}

export const createCollectionTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
) => {
  const tool = async (
    collectionName: string,
    collectionDescription?: string,
    fields: any[] = [],
    hasUpload?: boolean,
  ) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Creating collection: ${collectionName}, fields: ${fields.length}, upload: ${hasUpload}`,
      )
    }

    try {
      const result = await createCollection(
        req,
        verboseLogs,
        collectionsDirPath,
        configFilePath,
        collectionName,
        collectionDescription,
        fields,
        hasUpload,
      )

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Collection creation completed for: ${collectionName}`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error creating collection ${collectionName}: ${errorMessage}`,
      )

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error creating collection "${collectionName}": ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'createCollection',
    toolSchemas.createCollection.description,
    toolSchemas.createCollection.parameters.shape,
    async ({ collectionDescription, collectionName, fields, hasUpload }) => {
      return await tool(collectionName, collectionDescription, fields, hasUpload)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: delete.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/collection/delete.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { readFileSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

import { toolSchemas } from '../schemas.js'

// Helper function for removing collection from config
const removeCollectionFromConfig = (configContent: string, collectionName: string): string => {
  // Simple implementation - find and remove the collection import and reference
  let updatedContent = configContent

  // Remove import statement
  const importRegex = new RegExp(
    `import\\s*{\\s*${collectionName}\\s*}\\s*from\\s*['"]\\./collections/${collectionName}['"];?\\s*\\n?`,
    'g',
  )
  updatedContent = updatedContent.replace(importRegex, '')

  // Remove from collections array
  const collectionsRegex = new RegExp(`\\s*${collectionName},?\\s*`, 'g')
  updatedContent = updatedContent.replace(collectionsRegex, '')

  return updatedContent
}

export const deleteCollection = (
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
  collectionName: string,
  confirmDeletion: boolean,
  updateConfig: boolean,
) => {
  const payload = req.payload

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Attempting to delete collection: ${collectionName}`)
  }

  if (!confirmDeletion) {
    payload.logger.warn(`[payload-mcp] Deletion cancelled for collection: ${collectionName}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Deletion cancelled**. Set confirmDeletion to true to proceed with deleting collection "${collectionName}".`,
        },
      ],
    }
  }

  const capitalizedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
  const collectionFilePath = join(collectionsDirPath, `${capitalizedName}.ts`)

  // Security check: ensure we're working with the collections directory
  if (!collectionFilePath.startsWith(collectionsDirPath)) {
    payload.logger.error(`[payload-mcp] Invalid collection path attempted: ${collectionFilePath}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: '❌ **Error**: Invalid collection path',
        },
      ],
    }
  }

  try {
    // Check if collection file exists
    let fileExists = false
    try {
      readFileSync(collectionFilePath, 'utf8')
      fileExists = true
    } catch {
      payload.logger.warn(`[payload-mcp] Collection file does not exist: ${collectionFilePath}`)
    }

    // Read current config if we need to update it
    let configContent = ''
    let configExists = false
    if (updateConfig) {
      try {
        configContent = readFileSync(configFilePath, 'utf8')
        configExists = true
      } catch {
        payload.logger.warn(`[payload-mcp] Config file does not exist: ${configFilePath}`)
      }
    }

    let responseText = ''
    let operationsPerformed = 0

    // Delete the collection file
    if (fileExists) {
      try {
        unlinkSync(collectionFilePath)
        if (verboseLogs) {
          payload.logger.info(
            `[payload-mcp] Successfully deleted collection file: ${collectionFilePath}`,
          )
        }
        responseText += `✅ Deleted collection file: \`${capitalizedName}.ts\`\n`
        operationsPerformed++
      } catch (error) {
        const errorMessage = (error as Error).message
        payload.logger.error(`[payload-mcp] Error deleting collection file: ${errorMessage}`)
        responseText += `❌ Error deleting collection file: ${errorMessage}\n`
      }
    } else {
      responseText += `⚠️ Collection file not found: \`${capitalizedName}.ts\`\n`
    }

    // Update the config file if requested and it exists
    if (updateConfig && configExists) {
      try {
        const updatedConfigContent = removeCollectionFromConfig(configContent, capitalizedName)
        writeFileSync(configFilePath, updatedConfigContent, 'utf8')
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Successfully updated config file: ${configFilePath}`)
        }
        responseText += `✅ Updated payload.config.ts to remove collection reference\n`
        operationsPerformed++
      } catch (error) {
        const errorMessage = (error as Error).message
        payload.logger.error(`[payload-mcp] Error updating config file: ${errorMessage}`)
        responseText += `❌ Error updating config file: ${errorMessage}\n`
      }
    } else if (updateConfig && !configExists) {
      responseText += `⚠️ Config file not found: payload.config.ts\n`
    }

    // Summary
    if (operationsPerformed > 0) {
      responseText += `\n✅ **Collection deletion completed!**`
    } else {
      responseText += `\n⚠️ **No operations performed**

The collection file may not have existed or there were errors during deletion.`
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: responseText,
        },
      ],
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error during collection deletion: ${errorMessage}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error during collection deletion**: ${errorMessage}`,
        },
      ],
    }
  }
}

export const deleteCollectionTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
) => {
  const tool = (
    collectionName: string,
    confirmDeletion: boolean,
    updateConfig: boolean = false,
  ) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Deleting collection: ${collectionName}, confirmDeletion: ${confirmDeletion}, updateConfig: ${updateConfig}`,
      )
    }

    try {
      const result = deleteCollection(
        req,
        verboseLogs,
        collectionsDirPath,
        configFilePath,
        collectionName,
        confirmDeletion,
        updateConfig,
      )

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Collection deletion completed for: ${collectionName}`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error deleting collection ${collectionName}: ${errorMessage}`,
      )

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error deleting collection "${collectionName}": ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'deleteCollection',
    toolSchemas.deleteCollection.description,
    toolSchemas.deleteCollection.parameters.shape,
    ({ collectionName, confirmDeletion, updateConfig }) => {
      return tool(collectionName, confirmDeletion, updateConfig)
    },
  )
}
```

--------------------------------------------------------------------------------

````
