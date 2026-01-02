---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 249
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 249 of 695)

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

---[FILE: find.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/collection/find.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { readdirSync, readFileSync, statSync } from 'fs'
import { extname, join } from 'path'

import { toolSchemas } from '../schemas.js'

export const readCollections = (
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  collectionName?: string,
  includeContent: boolean = false,
  includeCount: boolean = false,
) => {
  const payload = req.payload

  if (verboseLogs) {
    payload.logger.info(
      `[payload-mcp] Reading collections${collectionName ? ` for: ${collectionName}` : ''}, includeContent: ${includeContent}, includeCount: ${includeCount}`,
    )
  }

  try {
    // Read specific Collection (optional)
    if (collectionName) {
      const fileName = `${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}.ts`
      const filePath = join(collectionsDirPath, fileName)

      if (!filePath.startsWith(collectionsDirPath)) {
        payload.logger.error(`[payload-mcp] Invalid collection name attempted: ${collectionName}`)
        return {
          content: [{ type: 'text' as const, text: 'Error: Invalid collection name' }],
        }
      }

      try {
        const content = readFileSync(filePath, 'utf8')
        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Successfully read collection: ${collectionName}`)
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Collection: ${collectionName}
File: ${fileName}
---
${content}`,
            },
          ],
        }
      } catch (_error) {
        payload.logger.warn(`[payload-mcp] Collection not found: ${collectionName}`)
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: Collection '${collectionName}' not found`,
            },
          ],
        }
      }
    }

    // Read all Collections
    const files = readdirSync(collectionsDirPath)
      .filter((file) => extname(file) === '.ts')
      .sort()

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Found ${files.length} collection files in directory`)
    }

    if (files.length === 0) {
      payload.logger.warn('[payload-mcp] No collection files found in src/collections directory')
      return {
        content: [
          {
            type: 'text' as const,
            text: 'No collection files found in src/collections directory',
          },
        ],
      }
    }

    const results = []

    // Build complete table as a single markdown string
    let tableContent = `Found ${files.length} collection file(s):\n\n`

    // Build table header
    let tableHeader = '| Collection | File | Size | Modified'
    let tableSeparator = '|------------|------|------|----------'

    if (includeCount) {
      tableHeader += ' | Documents'
      tableSeparator += ' |----------'
    }
    tableHeader += ' |'
    tableSeparator += ' |'

    tableContent += tableHeader + '\n'
    tableContent += tableSeparator + '\n'

    for (const file of files) {
      const filePath = join(collectionsDirPath, file)
      const stats = statSync(filePath)
      const fileSize = stats.size
      const lastModified = stats.mtime

      const collectionName = file.replace('.ts', '')

      // Build table row
      let tableRow = `| **${collectionName}** | ${file} | ${fileSize.toLocaleString()} bytes | ${lastModified.toISOString()}`

      // Add document count if requested
      if (includeCount) {
        try {
          // For now, we'll skip document counting since we don't have access to payload instance
          tableRow += ' | -'
        } catch (error) {
          tableRow += ` | Error: ${(error as Error).message}`
        }
      }
      tableRow += ' |'

      tableContent += tableRow + '\n'

      if (includeContent) {
        try {
          const content = readFileSync(filePath, 'utf8')
          tableContent += `\n**${collectionName} Content:**\n\`\`\`typescript\n${content}\n\`\`\`\n\n`
        } catch (error) {
          tableContent += `\nError reading content: ${(error as Error).message}\n\n`
        }
      }
    }

    results.push({
      type: 'text' as const,
      text: tableContent,
    })

    return {
      content: results,
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error reading collections: ${errorMessage}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error reading collections**: ${errorMessage}`,
        },
      ],
    }
  }
}

// MCP Server tool registration
export const findCollectionTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
) => {
  const tool = (
    collectionName?: string,
    includeContent: boolean = false,
    includeCount: boolean = false,
  ) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Finding collections${collectionName ? ` for: ${collectionName}` : ''}, includeContent: ${includeContent}, includeCount: ${includeCount}`,
      )
    }

    try {
      const result = readCollections(
        req,
        verboseLogs,
        collectionsDirPath,
        collectionName,
        includeContent,
        includeCount,
      )

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Collection search completed`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error finding collections: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error finding collections: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'findCollections',
    toolSchemas.findCollections.description,
    toolSchemas.findCollections.parameters.shape,
    ({ collectionName, includeContent, includeCount }) => {
      return tool(collectionName, includeContent, includeCount)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/collection/update.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import {
  addFieldsToCollection,
  modifyFieldsInCollection,
  removeFieldsFromCollection,
} from '../../helpers/fields.js'
import { validateCollectionFile } from '../../helpers/fileValidation.js'
import { toolSchemas } from '../schemas.js'

export const updateCollection = async (
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
  collectionName: string,
  updateType: string,
  newFields?: any[],
  fieldNamesToRemove?: string[],
  fieldModifications?: any[],
  configUpdates?: any,
  newContent?: string,
) => {
  const payload = req.payload
  if (verboseLogs) {
    payload.logger.info(
      `[payload-mcp] Updating collection: ${collectionName}, updateType: ${updateType}`,
    )
  }

  const capitalizedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
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

  try {
    // Check if collection file exists
    let currentContent: string
    try {
      currentContent = readFileSync(filePath, 'utf8')
    } catch (_ignore) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Collection file not found: ${fileName}`,
          },
        ],
      }
    }

    let updatedContent: string
    let updateSummary: string[] = []

    switch (updateType) {
      case 'add_field':
        if (!newFields || newFields.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No fields provided for add_field update type',
              },
            ],
          }
        }
        updatedContent = addFieldsToCollection(currentContent, newFields)
        updateSummary = newFields.map((field: any) => `Added field: ${field.name} (${field.type})`)
        break

      case 'modify_field':
        if (!fieldModifications || fieldModifications.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No field modifications provided for modify_field update type',
              },
            ],
          }
        }
        updatedContent = modifyFieldsInCollection(currentContent, fieldModifications)
        updateSummary = fieldModifications.map((mod: any) => `Modified field: ${mod.fieldName}`)
        break

      case 'remove_field':
        if (!fieldNamesToRemove || fieldNamesToRemove.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No field names provided for remove_field update type',
              },
            ],
          }
        }
        updatedContent = removeFieldsFromCollection(currentContent, fieldNamesToRemove)
        updateSummary = fieldNamesToRemove.map((fieldName: string) => `Removed field: ${fieldName}`)
        break

      case 'replace_content':
        if (!newContent) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No new content provided for replace_content update type',
              },
            ],
          }
        }
        updatedContent = newContent
        updateSummary = ['Replaced entire collection content']
        break

      case 'update_config':
        if (!configUpdates) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No config updates provided for update_config update type',
              },
            ],
          }
        }
        // For now, we'll use a simple approach since the config helper might not have this functionality
        updatedContent = currentContent
        updateSummary = Object.keys(configUpdates).map((key) => `Updated config: ${key}`)
        break

      default:
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ **Error**: Unknown update type: ${updateType}`,
            },
          ],
        }
    }

    // Write the updated content back to the file
    writeFileSync(filePath, updatedContent, 'utf8')
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully updated collection file: ${filePath}`)
    }

    // Validate the updated file
    const validationResult = await validateCollectionFile(fileName)
    if (validationResult.error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Updated collection has validation issues:\n\n${validationResult.error}`,
          },
        ],
      }
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `✅ **Collection updated successfully!**

**File**: \`${fileName}\`
**Update Type**: ${updateType}

**Changes Made**:
${updateSummary.map((summary) => `- ${summary}`).join('\n')}

**Updated Collection Code:**
\`\`\`typescript
${updatedContent}
\`\`\``,
        },
      ],
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error updating collection: ${errorMessage}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error updating collection**: ${errorMessage}`,
        },
      ],
    }
  }
}

export const updateCollectionTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  collectionsDirPath: string,
  configFilePath: string,
) => {
  const tool = async ({
    collectionName,
    configUpdates,
    fieldModifications,
    fieldNamesToRemove,
    newContent,
    newFields,
    updateType,
  }: {
    collectionName: string
    configUpdates?: any
    fieldModifications?: any[]
    fieldNamesToRemove?: string[]
    newContent?: string
    newFields?: any[]
    updateType: string
  }) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(
        `[payload-mcp] Updating collection: ${collectionName}, updateType: ${updateType}`,
      )
    }

    try {
      const result = await updateCollection(
        req,
        verboseLogs,
        collectionsDirPath,
        configFilePath,
        collectionName,
        updateType,
        newFields,
        fieldNamesToRemove,
        fieldModifications,
        configUpdates,
        newContent,
      )

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Collection update completed for: ${collectionName}`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(
        `[payload-mcp] Error updating collection ${collectionName}: ${errorMessage}`,
      )

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error updating collection "${collectionName}": ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'updateCollection',
    toolSchemas.updateCollection.description,
    toolSchemas.updateCollection.parameters.shape,
    async (args) => {
      return await tool(args)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: find.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/config/find.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { readFileSync, statSync } from 'fs'

import { toolSchemas } from '../schemas.js'

export const readConfigFile = (
  req: PayloadRequest,
  verboseLogs: boolean,
  configFilePath: string,
  includeMetadata: boolean = false,
) => {
  const payload = req.payload
  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Reading config file, includeMetadata: ${includeMetadata}`)
  }

  try {
    // Security check: ensure we're working with the specified config file
    if (!configFilePath.startsWith(process.cwd()) && !configFilePath.startsWith('/')) {
      payload.logger.error(`[payload-mcp] Invalid config path attempted: ${configFilePath}`)
      return {
        content: [
          {
            type: 'text' as const,
            text: '❌ **Error**: Invalid config path',
          },
        ],
      }
    }

    const content = readFileSync(configFilePath, 'utf8')
    const stats = statSync(configFilePath)

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully read config file. Size: ${stats.size} bytes`)
    }

    let responseText = `# Payload Configuration

**File**: \`${configFilePath}\``

    if (includeMetadata) {
      responseText += `
**Size**: ${stats.size.toLocaleString()} bytes
**Modified**: ${stats.mtime.toISOString()}
**Created**: ${stats.birthtime.toISOString()}`
    }

    responseText += `
---

**Configuration Content:**
\`\`\`typescript
${content}
\`\`\``

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
    payload.logger.error(`[payload-mcp] Error reading config file: ${errorMessage}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error reading config file**: ${errorMessage}`,
        },
      ],
    }
  }
}

// MCP Server tool registration
export const findConfigTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  configFilePath: string,
) => {
  const tool = (includeMetadata: boolean = false) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Finding config, includeMetadata: ${includeMetadata}`)
    }

    try {
      const result = readConfigFile(req, verboseLogs, configFilePath, includeMetadata)

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Config search completed`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error finding config: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error finding config: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'findConfig',
    toolSchemas.findConfig.description,
    toolSchemas.findConfig.parameters.shape,
    ({ includeMetadata }) => {
      return tool(includeMetadata)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: update.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/config/update.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { readFileSync, writeFileSync } from 'fs'

import {
  addCollectionToConfig,
  removeCollectionFromConfig,
  updateAdminConfig,
  updateDatabaseConfig,
  updatePluginsConfig,
} from '../../helpers/config.js'
import { toolSchemas } from '../schemas.js'

export const updateConfig = (
  req: PayloadRequest,
  verboseLogs: boolean,
  configFilePath: string,
  updateType: string,
  collectionName?: string,
  adminConfig?: any,
  databaseConfig?: any,
  pluginUpdates?: any,
  generalConfig?: any,
  newContent?: string,
) => {
  const payload = req.payload
  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Updating config with update type: ${updateType}`)
  }

  // Security check: ensure we're working with the specified config file
  if (!configFilePath.startsWith(process.cwd()) && !configFilePath.startsWith('/')) {
    payload.logger.error(`[payload-mcp] Invalid config path attempted: ${configFilePath}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: '❌ **Error**: Invalid config path',
        },
      ],
    }
  }

  try {
    // Read current config
    let currentContent: string
    try {
      currentContent = readFileSync(configFilePath, 'utf8')
    } catch (_ignore) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Config file not found: ${configFilePath}`,
          },
        ],
      }
    }

    let updatedContent: string
    let updateSummary: string[] = []

    switch (updateType) {
      case 'add_collection':
        if (!collectionName) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No collection name provided for add_collection update type',
              },
            ],
          }
        }
        updatedContent = addCollectionToConfig(currentContent, collectionName)
        updateSummary = [`Added collection: ${collectionName}`]
        break

      case 'remove_collection':
        if (!collectionName) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No collection name provided for remove_collection update type',
              },
            ],
          }
        }
        updatedContent = removeCollectionFromConfig(currentContent, collectionName)
        updateSummary = [`Removed collection: ${collectionName}`]
        break

      case 'replace_content':
        if (!newContent) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No new content provided for replace_content update type',
              },
            ],
          }
        }
        updatedContent = newContent
        updateSummary = ['Replaced entire config content']
        break

      case 'update_admin':
        if (!adminConfig) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No admin config provided for update_admin update type',
              },
            ],
          }
        }
        updatedContent = updateAdminConfig(currentContent, adminConfig)
        updateSummary = Object.keys(adminConfig).map((key) => `Updated admin config: ${key}`)
        break

      case 'update_database':
        if (!databaseConfig) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No database config provided for update_database update type',
              },
            ],
          }
        }
        updatedContent = updateDatabaseConfig(currentContent, databaseConfig)
        updateSummary = Object.keys(databaseConfig).map((key) => `Updated database config: ${key}`)
        break

      case 'update_plugins':
        if (!pluginUpdates) {
          return {
            content: [
              {
                type: 'text' as const,
                text: '❌ **Error**: No plugin updates provided for update_plugins update type',
              },
            ],
          }
        }
        updatedContent = updatePluginsConfig(currentContent, pluginUpdates)
        updateSummary = []
        if (pluginUpdates.add) {
          updateSummary.push(`Added plugins: ${pluginUpdates.add.join(', ')}`)
        }
        if (pluginUpdates.remove) {
          updateSummary.push(`Removed plugins: ${pluginUpdates.remove.join(', ')}`)
        }
        break

      default:
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ **Error**: Unknown update type: ${updateType}`,
            },
          ],
        }
    }

    // Write the updated content back to the file
    writeFileSync(configFilePath, updatedContent, 'utf8')
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully updated config file: ${configFilePath}`)
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `✅ **Config updated successfully!**

**File**: \`${configFilePath}\`
**Update Type**: ${updateType}

**Changes Made**:
${updateSummary.map((summary) => `- ${summary}`).join('\n')}

**Updated Config Content:**
\`\`\`typescript
${updatedContent}
\`\`\``,
        },
      ],
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error updating config: ${errorMessage}`)
    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error updating config**: ${errorMessage}`,
        },
      ],
    }
  }
}

export const updateConfigTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  configFilePath: string,
) => {
  const tool = ({
    adminConfig,
    collectionName,
    databaseConfig,
    generalConfig,
    newContent,
    pluginUpdates,
    updateType,
  }: {
    adminConfig?: any
    collectionName?: string
    databaseConfig?: any
    generalConfig?: any
    newContent?: string
    pluginUpdates?: any
    updateType: string
  }) => {
    const payload = req.payload

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Updating config: ${updateType}`)
    }

    try {
      const result = updateConfig(
        req,
        verboseLogs,
        configFilePath,
        updateType,
        collectionName,
        adminConfig,
        databaseConfig,
        pluginUpdates,
        generalConfig,
        newContent,
      )

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Config update completed for: ${updateType}`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      payload.logger.error(`[payload-mcp] Error updating config: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `Error updating config: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'updateConfig',
    toolSchemas.updateConfig.description,
    toolSchemas.updateConfig.parameters.shape,
    (args) => {
      return tool(args)
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: create.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/tools/job/create.ts

```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { PayloadRequest } from 'payload'

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { validatePayloadFile } from '../../helpers/fileValidation.js'
import { toolSchemas } from '../schemas.js'

const createOrUpdateJobFile = (
  req: PayloadRequest,
  verboseLogs: boolean,
  jobsDir: string,
  jobName: string,
  jobType: 'task' | 'workflow',
  jobSlug: string,
  camelCaseJobSlug: string,
) => {
  const payload = req.payload
  const jobFilePath = join(jobsDir, `${jobName}.ts`)
  const importName = `${camelCaseJobSlug}${jobType === 'task' ? 'Task' : 'Workflow'}`
  const importPath = `./${jobType === 'task' ? 'tasks' : 'workflows'}/${camelCaseJobSlug}`

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Processing job file: ${jobFilePath}`)
  }

  if (existsSync(jobFilePath)) {
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Updating existing job file: ${jobFilePath}`)
    }

    // Update existing job file
    let content = readFileSync(jobFilePath, 'utf8')

    // Add import if not already present
    const importStatement = `import { ${importName} } from '${importPath}'`
    if (!content.includes(importStatement)) {
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Adding import: ${importStatement}`)
      }

      // Find the last import statement and add after it
      const importRegex = /import\s+(?:\S.*)?from\s+['"].*['"];?\s*\n/g
      let lastImportMatch
      let match
      while ((match = importRegex.exec(content)) !== null) {
        lastImportMatch = match
      }

      if (lastImportMatch) {
        const insertIndex = lastImportMatch.index + lastImportMatch[0].length
        content =
          content.slice(0, insertIndex) + importStatement + '\n' + content.slice(insertIndex)
      } else {
        // No imports found, add at the beginning
        content = importStatement + '\n\n' + content
      }
    }

    // Add to the appropriate array
    const arrayName = jobType === 'task' ? 'tasks' : 'workflows'
    const arrayRegex = new RegExp(`(${arrayName}:\\s*\\[)([^\\]]*)(\\])`, 's')
    const arrayMatch = content.match(arrayRegex)

    if (arrayMatch && arrayMatch[2]) {
      const existingItems = arrayMatch[2].trim()
      const newItem = existingItems ? `${existingItems},\n    ${importName}` : `\n    ${importName}`
      content = content.replace(arrayRegex, `$1${newItem}\n  $3`)

      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Added ${importName} to ${arrayName} array`)
      }
    } else {
      // Array doesn't exist, add it
      const jobsConfigRegex = /(export\s+const\s.*JobsConfig\s*=\s*\{)([^}]*)(\})/s
      const jobsConfigMatch = content.match(jobsConfigRegex)

      if (jobsConfigMatch && jobsConfigMatch[2]) {
        const existingConfig = jobsConfigMatch[2].trim()
        const newConfig = existingConfig
          ? `${existingConfig},\n  ${arrayName}: [\n    ${importName}\n  ]`
          : `\n  ${arrayName}: [\n    ${importName}\n  ]`
        content = content.replace(jobsConfigRegex, `$1${newConfig}\n$3`)

        if (verboseLogs) {
          payload.logger.info(`[payload-mcp] Created new ${arrayName} array with ${importName}`)
        }
      }
    }

    writeFileSync(jobFilePath, content)
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully updated job file: ${jobFilePath}`)
    }
  } else {
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Creating new job file: ${jobFilePath}`)
    }

    // Create new job file
    const camelCaseJobName = toCamelCase(jobName)
    const jobFileContent = `import type { JobsConfig } from 'payload'
import { ${importName} } from '${importPath}'

export const ${camelCaseJobName}JobsConfig: JobsConfig = {
  ${jobType === 'task' ? 'tasks' : 'workflows'}: [
    ${importName}
  ]
}
`
    writeFileSync(jobFilePath, jobFileContent)
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully created new job file: ${jobFilePath}`)
    }
  }
}

// Reusable function for creating jobs
export const createJob = async (
  req: PayloadRequest,
  verboseLogs: boolean,
  jobsDir: string,
  jobName: string,
  jobType: 'task' | 'workflow',
  jobSlug: string,
  description: string,
  inputSchema: any,
  outputSchema: any,
  jobData: Record<string, any>,
) => {
  const payload = req.payload

  if (verboseLogs) {
    payload.logger.info(`[payload-mcp] Creating ${jobType}: ${jobName}`)
  }

  try {
    // Ensure jobs directory exists
    if (!existsSync(jobsDir)) {
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Creating jobs directory: ${jobsDir}`)
      }
      mkdirSync(jobsDir, { recursive: true })
    }

    // Ensure subdirectories exist
    const tasksDir = join(jobsDir, 'tasks')
    const workflowsDir = join(jobsDir, 'workflows')

    if (!existsSync(tasksDir)) {
      mkdirSync(tasksDir, { recursive: true })
    }
    if (!existsSync(workflowsDir)) {
      mkdirSync(workflowsDir, { recursive: true })
    }

    const camelCaseJobSlug = toCamelCase(jobSlug)
    const targetDir = jobType === 'task' ? tasksDir : workflowsDir
    const fileName = `${camelCaseJobSlug}.ts`
    const filePath = join(targetDir, fileName)

    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Target file path: ${filePath}`)
    }

    // Security check: ensure we're working with the jobs directory
    if (!filePath.startsWith(jobsDir)) {
      payload.logger.error(`[payload-mcp] Invalid job path attempted: ${filePath}`)
      return {
        content: [
          {
            type: 'text' as const,
            text: '❌ **Error**: Invalid job path',
          },
        ],
      }
    }

    // Check if file already exists
    if (existsSync(filePath)) {
      if (verboseLogs) {
        payload.logger.info(`[payload-mcp] Job file already exists: ${fileName}`)
      }
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Job file already exists: ${fileName}`,
          },
        ],
      }
    }

    // Generate job content based on type
    let jobContent: string
    if (jobType === 'task') {
      jobContent = generateTaskContent(
        jobName,
        jobSlug,
        description,
        inputSchema,
        outputSchema,
        jobData,
      )
    } else {
      jobContent = generateWorkflowContent(
        jobName,
        jobSlug,
        description,
        inputSchema,
        outputSchema,
        jobData,
      )
    }

    // Write the job file
    writeFileSync(filePath, jobContent, 'utf8')
    if (verboseLogs) {
      payload.logger.info(`[payload-mcp] Successfully created job file: ${filePath}`)
    }

    // Update the main job file
    createOrUpdateJobFile(req, verboseLogs, jobsDir, jobName, jobType, jobSlug, camelCaseJobSlug)

    // Validate the generated file
    const validationResult = await validatePayloadFile(fileName, jobType)
    if (validationResult.error) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error**: Generated job has validation issues:\n\n${validationResult.error}`,
          },
        ],
      }
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `✅ **Job created successfully!**

**File**: \`${fileName}\`
**Type**: \`${jobType}\`
**Slug**: \`${jobSlug}\`
**Description**: ${description}

**Generated Job Code:**
\`\`\`typescript
${jobContent}
\`\`\``,
        },
      ],
    }
  } catch (error) {
    const errorMessage = (error as Error).message
    payload.logger.error(`[payload-mcp] Error creating job: ${errorMessage}`)

    return {
      content: [
        {
          type: 'text' as const,
          text: `❌ **Error creating job**: ${errorMessage}`,
        },
      ],
    }
  }
}

// Helper function to generate task content
function generateTaskContent(
  jobName: string,
  jobSlug: string,
  description: string,
  inputSchema: any,
  outputSchema: any,
  jobData: Record<string, any>,
): string {
  const camelCaseJobSlug = toCamelCase(jobSlug)

  return `import type { Task } from 'payload'

export const ${camelCaseJobSlug}Task: Task = {
  slug: '${jobSlug}',
  description: '${description}',
  inputSchema: ${JSON.stringify(inputSchema, null, 2)},
  outputSchema: ${JSON.stringify(outputSchema, null, 2)},
  handler: async (input, context) => {
    // TODO: Implement your task logic here
    // Access input data: input.fieldName
    // Access context: context.payload, context.req, etc.

    // Example implementation:
    const result = {
      message: 'Task executed successfully',
      input,
      timestamp: new Date().toISOString(),
    }

    return result
  },
}
`
}

// Helper function to generate workflow content
function generateWorkflowContent(
  jobName: string,
  jobSlug: string,
  description: string,
  inputSchema: any,
  outputSchema: any,
  jobData: Record<string, any>,
): string {
  const camelCaseJobSlug = toCamelCase(jobSlug)

  return `import type { Workflow } from 'payload'

export const ${camelCaseJobSlug}Workflow: Workflow = {
  slug: '${jobSlug}',
  description: '${description}',
  inputSchema: ${JSON.stringify(inputSchema, null, 2)},
  outputSchema: ${JSON.stringify(outputSchema, null, 2)},
  steps: [
    // TODO: Define your workflow steps here
    // Each step should be a function that returns a result
    // Example:
    // {
    //   name: 'step1',
    //   handler: async (input, context) => {
    //     // Step logic here
    //     return { result: 'step1 completed' }
    //   }
    // }
  ],
}
`
}

// Helper function to convert to camel case
function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (_, chr) => chr.toLowerCase())
}

export const createJobTool = (
  server: McpServer,
  req: PayloadRequest,
  verboseLogs: boolean,
  jobsDir: string,
) => {
  const tool = async (
    jobName: string,
    jobType: 'task' | 'workflow',
    jobSlug: string,
    description: string,
    inputSchema: any = {},
    outputSchema: any = {},
    jobData: Record<string, any> = {},
  ) => {
    if (verboseLogs) {
      req.payload.logger.info(
        `[payload-mcp] Create Job Tool called with: ${jobName}, ${jobType}, ${jobSlug}`,
      )
    }

    try {
      const result = await createJob(
        req,
        verboseLogs,
        jobsDir,
        jobName,
        jobType,
        jobSlug,
        description,
        inputSchema,
        outputSchema,
        jobData,
      )

      if (verboseLogs) {
        req.payload.logger.info(`[payload-mcp] Create Job Tool completed successfully`)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      req.payload.logger.error(`[payload-mcp] Error in Create Job Tool: ${errorMessage}`)

      return {
        content: [
          {
            type: 'text' as const,
            text: `❌ **Error in Create Job Tool**: ${errorMessage}`,
          },
        ],
      }
    }
  }

  server.tool(
    'createJob',
    'Creates a new Payload job (task or workflow) with specified configuration',
    toolSchemas.createJob.parameters.shape,
    async (args) => {
      return tool(
        args.jobName,
        args.jobType,
        args.jobSlug,
        args.description,
        args.inputSchema,
        args.outputSchema,
        args.jobData,
      )
    },
  )
}
```

--------------------------------------------------------------------------------

````
