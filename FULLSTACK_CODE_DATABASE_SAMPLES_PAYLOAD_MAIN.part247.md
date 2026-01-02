---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 247
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 247 of 695)

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

---[FILE: config.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/helpers/config.ts

```typescript
import type {
  AdminConfig,
  CollectionConfigUpdates,
  DatabaseConfig,
  GeneralConfig,
  PluginUpdates,
} from '../../types.js'

/**
 * Adds a collection to the payload.config.ts file
 */
export function addCollectionToConfig(content: string, collectionName: string): string {
  const capitalizedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)

  // Add import statement
  const importRegex = /import.*from\s*['"]\.\/collections\/.*['"]/g
  const importMatches = content.match(importRegex)

  if (importMatches && importMatches.length > 0) {
    const lastImport = importMatches[importMatches.length - 1]
    const newImport = `import { ${capitalizedName} } from './collections/${capitalizedName}'`

    // Check if import already exists
    if (lastImport && !content.includes(newImport)) {
      content = content.replace(lastImport, `${lastImport}\n${newImport}`)
    }
  } else {
    // Add import after existing imports
    const importInsertPoint = content.indexOf("import sharp from 'sharp'")
    if (importInsertPoint !== -1) {
      const lineEnd = content.indexOf('\n', importInsertPoint)
      const newImport = `import { ${capitalizedName} } from './collections/${capitalizedName}'`
      content = content.slice(0, lineEnd + 1) + newImport + '\n' + content.slice(lineEnd + 1)
    }
  }

  // Add to collections array
  const collectionsRegex = /collections:\s*\[([\s\S]*?)\]/
  const collectionsMatch = content.match(collectionsRegex)

  if (collectionsMatch && collectionsMatch[1]) {
    const collectionsContent = collectionsMatch[1].trim()
    if (!collectionsContent.includes(capitalizedName)) {
      const newCollections = collectionsContent
        ? `${collectionsContent}, ${capitalizedName}`
        : capitalizedName
      content = content.replace(collectionsRegex, `collections: [${newCollections}]`)
    }
  }

  return content
}

/**
 * Removes a collection from the payload.config.ts file
 */
export function removeCollectionFromConfig(content: string, collectionName: string): string {
  const capitalizedName = collectionName.charAt(0).toUpperCase() + collectionName.slice(1)

  // Remove import statement
  const importRegex = new RegExp(
    `import\\s*{\\s*${capitalizedName}\\s*}\\s*from\\s*['"]\\./collections/${capitalizedName}['"]\\s*\\n?`,
    'g',
  )
  content = content.replace(importRegex, '')

  // Remove from collections array
  const collectionsRegex = /collections:\s*\[([\s\S]*?)\]/
  const collectionsMatch = content.match(collectionsRegex)

  if (collectionsMatch && collectionsMatch[1]) {
    let collectionsContent = collectionsMatch[1]

    // Remove the collection name and clean up commas
    collectionsContent = collectionsContent.replace(
      new RegExp(`\\s*,?\\s*${capitalizedName}\\s*,?`, 'g'),
      '',
    )
    collectionsContent = collectionsContent.replace(/,\s*,/g, ',') // Remove double commas
    collectionsContent = collectionsContent.replace(/^\s*,|,\s*$/g, '') // Remove leading/trailing commas

    content = content.replace(collectionsRegex, `collections: [${collectionsContent}]`)
  }

  // Clean up any double newlines from removed imports
  content = content.replace(/\n{3,}/g, '\n\n')

  return content
}

/**
 * Updates admin configuration in payload.config.ts
 */
export function updateAdminConfig(content: string, adminConfig: AdminConfig): string {
  const adminRegex = /admin:\s*\{([^}]*)\}/
  const adminMatch = content.match(adminRegex)

  if (adminMatch && adminMatch[1]) {
    let adminContent = adminMatch[1]

    // Update specific admin properties
    if (adminConfig.user) {
      if (adminContent.includes('user:')) {
        adminContent = adminContent.replace(/user:[^,}]*/, `user: ${adminConfig.user}.slug`)
      } else {
        adminContent = `\n    user: ${adminConfig.user}.slug,${adminContent}`
      }
    }

    if (adminConfig.meta) {
      const metaConfig = Object.entries(adminConfig.meta)
        .map(([key, value]) => `      ${key}: '${value}'`)
        .join(',\n')

      if (adminContent.includes('meta:')) {
        adminContent = adminContent.replace(/meta:\s*\{[^}]*\}/, `meta: {\n${metaConfig}\n    }`)
      } else {
        adminContent = `${adminContent}\n    meta: {\n${metaConfig}\n    },`
      }
    }

    content = content.replace(adminRegex, `admin: {${adminContent}\n  }`)
  } else {
    // Add admin config if it doesn't exist
    const adminConfigEntries = []

    if (adminConfig.user) {
      adminConfigEntries.push(`    user: ${adminConfig.user}.slug`)
    }

    if (adminConfig.meta) {
      const metaConfig = Object.entries(adminConfig.meta)
        .map(([key, value]) => `      ${key}: '${value}'`)
        .join(',\n')
      adminConfigEntries.push(`    meta: {\n${metaConfig}\n    }`)
    }

    const adminConfigString = `admin: {\n${adminConfigEntries.join(',\n')}\n  },`
    content = content.replace(
      /export default buildConfig\(\{/,
      `export default buildConfig({\n  ${adminConfigString}`,
    )
  }

  return content
}

/**
 * Updates database configuration in payload.config.ts
 */
export function updateDatabaseConfig(content: string, databaseConfig: DatabaseConfig): string {
  if (databaseConfig.type === 'mongodb') {
    // Update to MongoDB adapter
    const dbRegex = /db:[^,}]*(?:,|\})/
    const mongoImportRegex = /import.*mongooseAdapter.*from.*@payloadcms\/db-mongodb.*/

    if (!content.match(mongoImportRegex)) {
      content = content.replace(
        /(import.*from.*payload.*\n)/,
        `$1import { mongooseAdapter } from '@payloadcms/db-mongodb'\n`,
      )
    }

    const dbConfig = `db: mongooseAdapter({\n    url: process.env.DATABASE_URI || '${databaseConfig.url || ''}',\n  })`
    content = content.replace(dbRegex, `${dbConfig},`)
  }

  return content
}

/**
 * Updates plugins configuration in payload.config.ts
 */
export function updatePluginsConfig(content: string, pluginUpdates: PluginUpdates): string {
  // Add plugin imports
  if (pluginUpdates.add) {
    pluginUpdates.add.forEach((pluginImport: string) => {
      if (!content.includes(pluginImport)) {
        content = content.replace(/(import.*from.*payload.*\n)/, `$1${pluginImport}\n`)
      }
    })
  }

  // Handle plugins array
  const pluginsRegex = /plugins:\s*\[([\s\S]*?)\]/
  const pluginsMatch = content.match(pluginsRegex)

  if (pluginsMatch && pluginsMatch[1]) {
    let pluginsContent = pluginsMatch[1]

    // Remove plugins
    if (pluginUpdates.remove) {
      pluginUpdates.remove.forEach((pluginName: string) => {
        const pluginRegex = new RegExp(`\\s*${pluginName}\\(\\)\\s*,?`, 'g')
        pluginsContent = pluginsContent.replace(pluginRegex, '')
      })
    }

    // Add plugins
    if (pluginUpdates.add) {
      pluginUpdates.add.forEach((pluginImport: string) => {
        // This will match: import { PluginName } from '...';
        const match = pluginImport.match(/import\s*\{\s*(\w+)\s*\}/)
        if (match && match[1]) {
          const pluginName = match[1]
          if (!pluginsContent.includes(`${pluginName}(`)) {
            pluginsContent = pluginsContent.trim()
              ? `${pluginsContent}\n    ${pluginName}(),`
              : `\n    ${pluginName}(),`
          }
        }
      })
    }

    content = content.replace(pluginsRegex, `plugins: [${pluginsContent}\n  ]`)
  }

  return content
}

/**
 * Updates general configuration options in payload.config.ts
 */
export function updateGeneralConfig(content: string, generalConfig: GeneralConfig): string {
  // Update various general configuration options
  Object.entries(generalConfig).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const configRegex = new RegExp(`${key}:\\s*[^,}]*`, 'g')

      if (content.match(configRegex)) {
        if (typeof value === 'string') {
          content = content.replace(configRegex, `${key}: '${value}'`)
        } else if (typeof value === 'boolean') {
          content = content.replace(configRegex, `${key}: ${value}`)
        } else if (typeof value === 'object') {
          content = content.replace(configRegex, `${key}: ${JSON.stringify(value, null, 2)}`)
        }
      } else {
        // Add new config option
        const configValue =
          typeof value === 'string'
            ? `'${value}'`
            : typeof value === 'object'
              ? JSON.stringify(value, null, 2)
              : value
        content = content.replace(
          /export default buildConfig\(\{/,
          `export default buildConfig({\n  ${key}: ${configValue},`,
        )
      }
    }
  })

  return content
}

/**
 * Updates collection-level configuration in a collection file
 */
export function updateCollectionConfig(
  content: string,
  updates: CollectionConfigUpdates,
  collectionName: string,
): string {
  let updatedContent = content

  if (updates.slug) {
    updatedContent = updatedContent.replace(/slug:\s*'[^']*'/, `slug: '${updates.slug}'`)
  }

  if (updates.access) {
    const accessRegex = /access:\s*\{[^}]*\}/
    if (updatedContent.match(accessRegex)) {
      // Update existing access config
      Object.entries(updates.access).forEach(([key, value]) => {
        if (value !== undefined) {
          updatedContent = updatedContent.replace(
            new RegExp(`${key}:\\s*[^,}]*`),
            `${key}: ${value}`,
          )
        }
      })
    } else {
      // Add access config
      const accessConfig = Object.entries(updates.access)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `    ${key}: ${value}`)
        .join(',\n')

      updatedContent = updatedContent.replace(
        /slug:\s*'[^']*',/,
        `slug: '${collectionName}',\n  access: {\n${accessConfig}\n  },`,
      )
    }
  }

  if (updates.timestamps !== undefined) {
    if (updatedContent.includes('timestamps:')) {
      updatedContent = updatedContent.replace(
        /timestamps:[^,}]*/,
        `timestamps: ${updates.timestamps}`,
      )
    } else {
      updatedContent = updatedContent.replace(
        /fields:\s*\[/,
        `timestamps: ${updates.timestamps},\n  fields: [`,
      )
    }
  }

  if (updates.versioning !== undefined) {
    if (updatedContent.includes('versioning:')) {
      updatedContent = updatedContent.replace(
        /versioning:[^,}]*/,
        `versioning: ${updates.versioning}`,
      )
    } else {
      updatedContent = updatedContent.replace(
        /fields:\s*\[/,
        `versioning: ${updates.versioning},\n  fields: [`,
      )
    }
  }

  return updatedContent
}
```

--------------------------------------------------------------------------------

---[FILE: conversion.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/helpers/conversion.ts

```typescript
export const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}
```

--------------------------------------------------------------------------------

---[FILE: fields.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/helpers/fields.ts

```typescript
type FieldDefinition = {
  description?: string
  name: string
  options?: { label: string; value: string }[]
  position?: 'main' | 'sidebar'
  required?: boolean
  type: string
}

type FieldModification = {
  changes: {
    description?: string
    options?: { label: string; value: string }[]
    position?: 'main' | 'sidebar'
    required?: boolean
    type?: string
  }
  fieldName: string
}

/**
 * Adds new fields to a collection file content
 */
export function addFieldsToCollection(content: string, newFields: FieldDefinition[]): string {
  // Find the fields array closing bracket
  const fieldsRegex = /fields:\s*\[([\s\S]*?)\]\s*(?:,\s*)?\}/
  const match = content.match(fieldsRegex)

  if (!match) {
    throw new Error('Could not find fields array in collection file')
  }

  // Generate new field definitions
  const newFieldDefinitions = newFields
    .map((field) => {
      const fieldConfig = []
      fieldConfig.push(`    {`)
      fieldConfig.push(`      name: '${field.name}',`)
      fieldConfig.push(`      type: '${field.type}',`)

      if (field.required) {
        fieldConfig.push(`      required: true,`)
      }

      if (field.description || field.position) {
        fieldConfig.push(`      admin: {`)
        if (field.description) {
          fieldConfig.push(`        description: '${field.description}',`)
        }
        if (field.position) {
          fieldConfig.push(`        position: '${field.position}',`)
        }
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
    })
    .join('\n')

  // Add new fields before the closing bracket
  const existingFields = match[1] || ''
  const hasTrailingComma = existingFields.trim().endsWith(',')
  const separator = hasTrailingComma ? '\n' : ',\n'

  return content.replace(
    fieldsRegex,
    `fields: [${existingFields}${separator}${newFieldDefinitions}\n  ],
}`,
  )
}

/**
 * Removes fields from a collection file content
 */
export function removeFieldsFromCollection(content: string, fieldNames: string[]): string {
  let updatedContent = content

  fieldNames.forEach((fieldName) => {
    // Create regex to match the field definition
    const fieldRegex = new RegExp(
      `\\s*{[^}]*name:\\s*['"]${fieldName}['"][^}]*}[^}]*(?:},?|,?\\s*})`,
      'gs',
    )
    updatedContent = updatedContent.replace(fieldRegex, '')
  })

  // Clean up any double commas or trailing commas
  updatedContent = updatedContent.replace(/,\s*,/g, ',')
  updatedContent = updatedContent.replace(/,\s*\]/g, '\n  ]')

  return updatedContent
}

/**
 * Modifies existing fields in a collection file content
 */
export function modifyFieldsInCollection(
  content: string,
  modifications: FieldModification[],
): string {
  let updatedContent = content

  modifications.forEach((mod) => {
    const { changes, fieldName } = mod

    // Find the field definition
    const fieldRegex = new RegExp(`({[^}]*name:\\s*['"]${fieldName}['"][^}]*})`, 'gs')
    const fieldMatch = updatedContent.match(fieldRegex)

    if (fieldMatch) {
      let fieldDef = fieldMatch[0]

      // Apply changes
      if (changes.type) {
        fieldDef = fieldDef.replace(/type:\s*'[^']*'/, `type: '${changes.type}'`)
      }

      if (changes.required !== undefined) {
        if (fieldDef.includes('required:')) {
          fieldDef = fieldDef.replace(/required:[^,]*/, `required: ${changes.required}`)
        } else {
          fieldDef = fieldDef.replace(
            /type:\s*'[^']*',/,
            `type: '${changes.type}',\n      required: ${changes.required},`,
          )
        }
      }

      if (changes.description) {
        const adminRegex = /admin:\s*\{[^}]*\}/
        if (fieldDef.match(adminRegex)) {
          fieldDef = fieldDef.replace(
            /description:\s*'[^']*'/,
            `description: '${changes.description}'`,
          )
        } else {
          fieldDef = fieldDef.replace(
            /\},?\s*$/,
            `,\n      admin: {\n        description: '${changes.description}',\n      },\n    }`,
          )
        }
      }

      updatedContent = updatedContent.replace(fieldRegex, fieldDef)
    }
  })

  return updatedContent
}
```

--------------------------------------------------------------------------------

---[FILE: fileValidation.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/helpers/fileValidation.ts

```typescript
import type { CollectionConfig } from 'payload'

import { existsSync } from 'fs'
import { join } from 'path'

export type ValidationType = 'collection' | 'task' | 'workflow'

export interface ValidationResult<T = unknown> {
  config?: T
  error?: string
  success: boolean
}

// Custom task config interface that matches what we're creating
export interface TaskConfig {
  handler: (args: {
    input: Record<string, unknown>
    job: Record<string, unknown>
    tasks: Record<string, unknown>
  }) => Record<string, unknown>
  inputSchema?: Array<{
    label?: string
    name: string
    options?: Array<{ label: string; value: string }>
    required?: boolean
    type: string
  }>
  label?: string
  outputSchema?: Array<{
    label?: string
    name: string
    options?: Array<{ label: string; value: string }>
    required?: boolean
    type: string
  }>
  retries?: number
  slug: string
}

// Custom workflow config interface that matches what we're creating
export interface WorkflowConfig {
  handler: (args: {
    input: Record<string, unknown>
    job: Record<string, unknown>
    tasks: Record<string, unknown>
  }) => void
  inputSchema?: Array<{
    label?: string
    name: string
    options?: Array<{ label: string; value: string }>
    required?: boolean
    type: string
  }>
  label?: string
  queue?: string
  retries?: number
  slug: string
}

/**
 * Generic validation function for Payload configuration files
 * @param fileName - The name of the file (e.g., 'Users.ts', 'my-task.ts')
 * @param type - The type of validation to perform ('collection', 'task', or 'workflow')
 * @returns Object containing success status and any error messages
 */
export const validatePayloadFile = async <T = CollectionConfig | TaskConfig | WorkflowConfig>(
  fileName: string,
  type: ValidationType,
): Promise<ValidationResult<T>> => {
  try {
    const basePath = type === 'collection' ? 'collections' : type === 'task' ? 'tasks' : 'workflows'
    const fullPath = join(process.cwd(), 'src', basePath)
    const filePath = join(fullPath, fileName)

    // Check if file exists
    if (!existsSync(filePath)) {
      return {
        error: `${type} file does not exist: ${fileName}`,
        success: false,
      }
    }

    // Clear require cache to ensure fresh import
    delete require.cache[filePath]

    // Use relative path for webpack compatibility
    const moduleName = fileName.replace('.ts', '')
    const relativePath = `../${basePath}/${moduleName}`

    // Dynamic import with relative path
    const importedModule = await import(/* webpackIgnore: true */ relativePath)

    // Get the configuration based on type
    let config: T | undefined

    if (type === 'collection') {
      config = getCollectionConfig(importedModule, moduleName) as T
    } else if (type === 'task') {
      config = getTaskConfig(importedModule) as T
    } else if (type === 'workflow') {
      config = getWorkflowConfig(importedModule) as T
    }

    if (!config) {
      return {
        error: `${type} file does not export a valid ${type} config`,
        success: false,
      }
    }

    // Validate the configuration
    let validationResult: ValidationResult<unknown>
    if (type === 'collection') {
      validationResult = validateCollectionConfig(config as unknown as CollectionConfig)
    } else if (type === 'task') {
      validationResult = validateTaskConfig(config as unknown as TaskConfig)
    } else if (type === 'workflow') {
      validationResult = validateWorkflowConfig(config as unknown as WorkflowConfig)
    } else {
      return {
        error: `Unknown validation type: ${type}`,
        success: false,
      }
    }

    if (!validationResult.success) {
      return validationResult as ValidationResult<T>
    }

    return {
      config,
      success: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during validation'
    return {
      error: `Failed to validate ${type} file: ${errorMessage}`,
      success: false,
    }
  }
}

/**
 * Extract collection configuration from module exports
 */
function getCollectionConfig(
  importedModule: Record<string, unknown>,
  moduleName: string,
): CollectionConfig | undefined {
  if (importedModule.default) {
    return importedModule.default as CollectionConfig
  }

  if (importedModule[moduleName]) {
    return importedModule[moduleName] as CollectionConfig
  }

  return undefined
}

/**
 * Extract task configuration from module exports
 */
function getTaskConfig(importedModule: Record<string, unknown>): TaskConfig | undefined {
  // First check for default export
  if (importedModule.default) {
    return importedModule.default as TaskConfig
  }

  // Look for named exports ending with "Task"
  const exportNames = Object.keys(importedModule)
  const taskExport = exportNames.find((name) => name.endsWith('Task'))

  if (taskExport) {
    return importedModule[taskExport] as TaskConfig
  }

  return undefined
}

/**
 * Extract workflow configuration from module exports
 */
function getWorkflowConfig(importedModule: Record<string, unknown>): undefined | WorkflowConfig {
  // First check for default export
  if (importedModule.default) {
    return importedModule.default as WorkflowConfig
  }

  // Look for named exports ending with "Workflow"
  const exportNames = Object.keys(importedModule)
  const workflowExport = exportNames.find((name) => name.endsWith('Workflow'))

  if (workflowExport) {
    return importedModule[workflowExport] as WorkflowConfig
  }

  return undefined
}

/**
 * Validate collection configuration structure
 */
function validateCollectionConfig(config: CollectionConfig): ValidationResult<CollectionConfig> {
  if (!config) {
    return {
      error: 'Collection config is not a valid object',
      success: false,
    }
  }

  if (!config.slug) {
    return {
      error: 'Collection config must have a valid slug property',
      success: false,
    }
  }

  // Validate each field has required properties
  if (config.fields) {
    for (let i = 0; i < config.fields.length; i++) {
      const field = config.fields[i] as Record<string, unknown>
      if (!field) {
        return {
          error: `Field at index ${i} is not a valid object`,
          success: false,
        }
      }

      // Check if field has type property
      if ('type' in field && field.type) {
        return {
          error: `Field at index ${i} has invalid type property`,
          success: false,
        }
      }
    }
  }

  return { config, success: true }
}

/**
 * Validate task configuration structure
 */
function validateTaskConfig(config: TaskConfig): ValidationResult<TaskConfig> {
  if (!config) {
    return {
      error: 'Task config is not a valid object',
      success: false,
    }
  }

  if (!config.slug) {
    return {
      error: 'Task config must have a valid slug property',
      success: false,
    }
  }

  if (!config.handler) {
    return {
      error: 'Task config must have a valid handler function',
      success: false,
    }
  }

  // Validate optional properties
  if (config.retries !== undefined && config.retries < 0) {
    return {
      error: 'Task config retries must be a non-negative number',
      success: false,
    }
  }

  // Validate schemas if present
  if (config.inputSchema && Array.isArray(config.inputSchema)) {
    for (let i = 0; i < config.inputSchema.length; i++) {
      const field = config.inputSchema[i]
      if (!field) {
        return {
          error: `Input schema field at index ${i} is not a valid object`,
          success: false,
        }
      }

      if (!field.name) {
        return {
          error: `Input schema field at index ${i} must have a valid name property`,
          success: false,
        }
      }

      if (!field.type) {
        return {
          error: `Input schema field at index ${i} must have a valid type property`,
          success: false,
        }
      }
    }
  }

  if (config.outputSchema && Array.isArray(config.outputSchema)) {
    for (let i = 0; i < config.outputSchema.length; i++) {
      const field = config.outputSchema[i]
      if (!field) {
        return {
          error: `Output schema field at index ${i} is not a valid object`,
          success: false,
        }
      }

      if (!field.name) {
        return {
          error: `Output schema field at index ${i} must have a valid name property`,
          success: false,
        }
      }

      if (!field.type) {
        return {
          error: `Output schema field at index ${i} must have a valid type property`,
          success: false,
        }
      }
    }
  }

  return { config, success: true }
}

/**
 * Validate workflow configuration structure
 */
function validateWorkflowConfig(config: WorkflowConfig): ValidationResult<WorkflowConfig> {
  if (!config) {
    return {
      error: 'Workflow config is not a valid object',
      success: false,
    }
  }

  if (!config.slug) {
    return {
      error: 'Workflow config must have a valid slug property',
      success: false,
    }
  }

  if (!config.handler) {
    return {
      error: 'Workflow config must have a valid handler function',
      success: false,
    }
  }

  // Validate optional properties
  if (config.queue) {
    return {
      error: 'Workflow config queue must be a string',
      success: false,
    }
  }

  if (config.retries !== undefined && config.retries < 0) {
    return {
      error: 'Workflow config retries must be a non-negative number',
      success: false,
    }
  }

  // Validate schema if present
  if (config.inputSchema && Array.isArray(config.inputSchema)) {
    for (let i = 0; i < config.inputSchema.length; i++) {
      const field = config.inputSchema[i]
      if (!field) {
        return {
          error: `Input schema field at index ${i} is not a valid object`,
          success: false,
        }
      }

      if (!field.name) {
        return {
          error: `Input schema field at index ${i} must have a valid name property`,
          success: false,
        }
      }

      if (!field.type) {
        return {
          error: `Input schema field at index ${i} must have a valid type property`,
          success: false,
        }
      }
    }
  }

  return { config, success: true }
}

// Convenience functions for backward compatibility
export const validateCollectionFile = async (
  fileName: string,
): Promise<ValidationResult<CollectionConfig>> => {
  return validatePayloadFile<CollectionConfig>(fileName, 'collection')
}

export const validateTaskFile = async (fileName: string): Promise<ValidationResult<TaskConfig>> => {
  return validatePayloadFile<TaskConfig>(fileName, 'task')
}

export const validateWorkflowFile = async (
  fileName: string,
): Promise<ValidationResult<WorkflowConfig>> => {
  return validatePayloadFile<WorkflowConfig>(fileName, 'workflow')
}
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: payload-main/packages/plugin-mcp/src/mcp/helpers/validation.ts

```typescript
/**
 * Validates collection-specific data for resource creation
 */
export function validateCollectionData(
  collection: string,
  data: Record<string, unknown>,
  availableCollections: string[],
): null | string {
  // Check if collection exists
  if (!availableCollections.includes(collection)) {
    return `Unknown collection: ${collection}. Available collections: ${availableCollections.join(', ')}`
  }

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return `Collection "${collection}" requires data to be provided`
  }

  return null
}

/**
 * Checks if a collection slug is valid
 */
export function validateCollectionSlug(
  collection: string,
  collections: Partial<Record<string, true>>,
) {
  const collectionSlugs = Object.keys(collections)
  if (!collectionSlugs.includes(collection)) {
    return `Collection "${collection}" is not valid`
  }
}
```

--------------------------------------------------------------------------------

````
