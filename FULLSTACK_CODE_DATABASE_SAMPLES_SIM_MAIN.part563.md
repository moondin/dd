---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 563
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 563 of 933)

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

---[FILE: formatting.ts]---
Location: sim-main/apps/sim/lib/core/utils/formatting.ts

```typescript
/**
 * Get a user-friendly timezone abbreviation
 * @param timezone - IANA timezone string
 * @param date - Date to check for DST
 * @returns A simplified timezone string (e.g., "PST" instead of "America/Los_Angeles")
 */
export function getTimezoneAbbreviation(timezone: string, date: Date = new Date()): string {
  if (timezone === 'UTC') return 'UTC'

  // Common timezone mappings
  const timezoneMap: Record<string, { standard: string; daylight: string }> = {
    'America/Los_Angeles': { standard: 'PST', daylight: 'PDT' },
    'America/Denver': { standard: 'MST', daylight: 'MDT' },
    'America/Chicago': { standard: 'CST', daylight: 'CDT' },
    'America/New_York': { standard: 'EST', daylight: 'EDT' },
    'Europe/London': { standard: 'GMT', daylight: 'BST' },
    'Europe/Paris': { standard: 'CET', daylight: 'CEST' },
    'Asia/Tokyo': { standard: 'JST', daylight: 'JST' }, // Japan doesn't use DST
    'Australia/Sydney': { standard: 'AEST', daylight: 'AEDT' },
    'Asia/Singapore': { standard: 'SGT', daylight: 'SGT' }, // Singapore doesn't use DST
  }

  // If we have a mapping for this timezone
  if (timezone in timezoneMap) {
    // January 1 is guaranteed to be standard time in northern hemisphere
    // July 1 is guaranteed to be daylight time in northern hemisphere (if observed)
    const januaryDate = new Date(date.getFullYear(), 0, 1)
    const julyDate = new Date(date.getFullYear(), 6, 1)

    // Get offset in January (standard time)
    const januaryFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    })

    // Get offset in July (likely daylight time)
    const julyFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    })

    // If offsets are different, timezone observes DST
    const isDSTObserved = januaryFormatter.format(januaryDate) !== julyFormatter.format(julyDate)

    // If DST is observed, check if current date is in DST by comparing its offset
    // with January's offset (standard time)
    if (isDSTObserved) {
      const currentFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      })

      const isDST = currentFormatter.format(date) !== januaryFormatter.format(januaryDate)
      return isDST ? timezoneMap[timezone].daylight : timezoneMap[timezone].standard
    }

    // If DST is not observed, always use standard
    return timezoneMap[timezone].standard
  }

  // For unknown timezones, use full IANA name
  return timezone
}

/**
 * Format a date into a human-readable format
 * @param date - The date to format
 * @param timezone - Optional IANA timezone string (e.g., 'America/Los_Angeles', 'UTC')
 * @returns A formatted date string in the format "MMM D, YYYY h:mm A"
 */
export function formatDateTime(date: Date, timezone?: string): string {
  const formattedDate = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone || undefined,
  })

  // If timezone is provided, add a friendly timezone abbreviation
  if (timezone) {
    const tzAbbr = getTimezoneAbbreviation(timezone, date)
    return `${formattedDate} ${tzAbbr}`
  }

  return formattedDate
}

/**
 * Format a date into a short format
 * @param date - The date to format
 * @returns A formatted date string in the format "MMM D, YYYY"
 */
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a time into a short format
 * @param date - The date to format
 * @returns A formatted time string in the format "h:mm A"
 */
export function formatTime(date: Date): string {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format a duration in milliseconds to a human-readable format
 * @param durationMs - The duration in milliseconds
 * @returns A formatted duration string
 */
export function formatDuration(durationMs: number): string {
  if (durationMs < 1000) {
    return `${durationMs}ms`
  }

  const seconds = Math.floor(durationMs / 1000)
  if (seconds < 60) {
    return `${seconds}s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}
```

--------------------------------------------------------------------------------

---[FILE: optimistic-update.ts]---
Location: sim-main/apps/sim/lib/core/utils/optimistic-update.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OptimisticUpdate')

/**
 * Options for performing an optimistic update with automatic rollback on error
 */
export interface OptimisticUpdateOptions<T> {
  /**
   * Function that returns the current state value (for rollback purposes)
   */
  getCurrentState: () => T
  /**
   * Function that performs the optimistic update to the UI state
   */
  optimisticUpdate: () => void
  /**
   * Async function that performs the actual API call
   */
  apiCall: () => Promise<void>
  /**
   * Function that rolls back the state to the original value
   * @param originalValue - The value returned by getCurrentState before the update
   */
  rollback: (originalValue: T) => void
  /**
   * Optional error message to log if the operation fails
   */
  errorMessage?: string
  /**
   * Optional callback to execute on error (e.g., show toast notification)
   */
  onError?: (error: Error, originalValue: T) => void
  /**
   * Optional callback that always runs regardless of success or error (e.g., to clear loading states)
   */
  onComplete?: () => void
}

/**
 * Performs an optimistic update with automatic rollback on error.
 * This utility standardizes the pattern of:
 * 1. Save current state
 * 2. Update UI optimistically
 * 3. Make API call
 * 4. Rollback on error
 *
 * @example
 * ```typescript
 * await withOptimisticUpdate({
 *   getCurrentState: () => get().folders[id],
 *   optimisticUpdate: () => set(state => ({
 *     folders: { ...state.folders, [id]: { ...folder, name: newName } }
 *   })),
 *   apiCall: async () => {
 *     await fetch(`/api/folders/${id}`, {
 *       method: 'PUT',
 *       body: JSON.stringify({ name: newName })
 *     })
 *   },
 *   rollback: (originalFolder) => set(state => ({
 *     folders: { ...state.folders, [id]: originalFolder }
 *   })),
 *   errorMessage: 'Failed to rename folder',
 *   onError: (error) => toast.error('Could not rename folder')
 * })
 * ```
 */
export async function withOptimisticUpdate<T>(options: OptimisticUpdateOptions<T>): Promise<void> {
  const {
    getCurrentState,
    optimisticUpdate,
    apiCall,
    rollback,
    errorMessage,
    onError,
    onComplete,
  } = options

  const originalValue = getCurrentState()

  optimisticUpdate()

  try {
    await apiCall()
  } catch (error) {
    rollback(originalValue)

    if (errorMessage) {
      logger.error(errorMessage, { error })
    }

    if (onError && error instanceof Error) {
      onError(error, originalValue)
    }

    throw error
  } finally {
    if (onComplete) {
      onComplete()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: request.ts]---
Location: sim-main/apps/sim/lib/core/utils/request.ts

```typescript
/**
 * Generate a short request ID for correlation
 */
export function generateRequestId(): string {
  return crypto.randomUUID().slice(0, 8)
}

/**
 * No-operation function for use as default callback
 */
export const noop = () => {}
```

--------------------------------------------------------------------------------

---[FILE: response-format.ts]---
Location: sim-main/apps/sim/lib/core/utils/response-format.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ResponseFormatUtils')

// Type definitions for component data structures
export interface Field {
  name: string
  type: string
  description?: string
}

/**
 * Helper function to extract fields from JSON Schema
 * Handles both legacy format with fields array and new JSON Schema format
 */
export function extractFieldsFromSchema(schema: any): Field[] {
  if (!schema || typeof schema !== 'object') {
    return []
  }

  // Handle legacy format with fields array
  if (Array.isArray(schema.fields)) {
    return schema.fields
  }

  // Handle new JSON Schema format
  const schemaObj = schema.schema || schema
  if (!schemaObj || !schemaObj.properties || typeof schemaObj.properties !== 'object') {
    return []
  }

  // Extract fields from schema properties
  return Object.entries(schemaObj.properties).map(([name, prop]: [string, any]) => {
    // Handle array format like ['string', 'array']
    if (Array.isArray(prop)) {
      return {
        name,
        type: prop.includes('array') ? 'array' : prop[0] || 'string',
        description: undefined,
      }
    }

    // Handle object format like { type: 'string', description: '...' }
    return {
      name,
      type: prop.type || 'string',
      description: prop.description,
    }
  })
}

/**
 * Helper function to safely parse response format
 * Handles both string and object formats
 */
export function parseResponseFormatSafely(responseFormatValue: any, blockId: string): any {
  if (!responseFormatValue) {
    return null
  }

  try {
    if (typeof responseFormatValue === 'string') {
      return JSON.parse(responseFormatValue)
    }
    return responseFormatValue
  } catch (error) {
    logger.warn(`Failed to parse response format for block ${blockId}:`, error)
    return null
  }
}

/**
 * Extract field values from a parsed JSON object based on selected output paths
 * Used for both workspace and chat client field extraction
 */
export function extractFieldValues(
  parsedContent: any,
  selectedOutputs: string[],
  blockId: string
): Record<string, any> {
  const extractedValues: Record<string, any> = {}

  for (const outputId of selectedOutputs) {
    const blockIdForOutput = extractBlockIdFromOutputId(outputId)

    if (blockIdForOutput !== blockId) {
      continue
    }

    const path = extractPathFromOutputId(outputId, blockIdForOutput)

    if (path) {
      const current = traverseObjectPathInternal(parsedContent, path)
      if (current !== undefined) {
        extractedValues[path] = current
      }
    }
  }

  return extractedValues
}

/**
 * Format extracted field values for display
 * Returns formatted string representation of field values
 */
export function formatFieldValues(extractedValues: Record<string, any>): string {
  const formattedValues: string[] = []

  for (const [fieldName, value] of Object.entries(extractedValues)) {
    const formattedValue = typeof value === 'string' ? value : JSON.stringify(value)
    formattedValues.push(formattedValue)
  }

  return formattedValues.join('\n')
}

/**
 * Extract block ID from output ID
 * Handles both formats: "blockId" and "blockId_path" or "blockId.path"
 */
export function extractBlockIdFromOutputId(outputId: string): string {
  return outputId.includes('_') ? outputId.split('_')[0] : outputId.split('.')[0]
}

/**
 * Extract path from output ID after the block ID
 */
export function extractPathFromOutputId(outputId: string, blockId: string): string {
  return outputId.substring(blockId.length + 1)
}

/**
 * Parse JSON content from output safely
 * Handles both string and object formats with proper error handling
 */
export function parseOutputContentSafely(output: any): any {
  if (!output?.content) {
    return output
  }

  if (typeof output.content === 'string') {
    try {
      return JSON.parse(output.content)
    } catch (e) {
      // Fallback to original structure if parsing fails
      return output
    }
  }

  return output
}

/**
 * Check if a set of output IDs contains response format selections for a specific block
 */
export function hasResponseFormatSelection(selectedOutputs: string[], blockId: string): boolean {
  return selectedOutputs.some((outputId) => {
    const blockIdForOutput = extractBlockIdFromOutputId(outputId)
    return blockIdForOutput === blockId && outputId.includes('_')
  })
}

/**
 * Get selected field names for a specific block from output IDs
 */
export function getSelectedFieldNames(selectedOutputs: string[], blockId: string): string[] {
  return selectedOutputs
    .filter((outputId) => {
      const blockIdForOutput = extractBlockIdFromOutputId(outputId)
      return blockIdForOutput === blockId && outputId.includes('_')
    })
    .map((outputId) => extractPathFromOutputId(outputId, blockId))
}

/**
 * Internal helper to traverse an object path without parsing
 * @param obj The object to traverse
 * @param path The dot-separated path (e.g., "result.data.value")
 * @returns The value at the path, or undefined if path doesn't exist
 */
function traverseObjectPathInternal(obj: any, path: string): any {
  if (!path) return obj

  let current = obj
  const parts = path.split('.')

  for (const part of parts) {
    if (current?.[part] !== undefined) {
      current = current[part]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Traverses an object path safely, returning undefined if any part doesn't exist
 * Automatically handles parsing of output content if needed
 * @param obj The object to traverse (may contain unparsed content)
 * @param path The dot-separated path (e.g., "result.data.value")
 * @returns The value at the path, or undefined if path doesn't exist
 */
export function traverseObjectPath(obj: any, path: string): any {
  const parsed = parseOutputContentSafely(obj)
  return traverseObjectPathInternal(parsed, path)
}
```

--------------------------------------------------------------------------------

---[FILE: scheduling.ts]---
Location: sim-main/apps/sim/lib/core/utils/scheduling.ts

```typescript
/**
 * Converts schedule options to a cron expression
 */
export function convertScheduleOptionsToCron(
  scheduleType: string,
  options: Record<string, string>
): string {
  switch (scheduleType) {
    case 'minutes': {
      const interval = options.minutesInterval || '15'
      // For example, if options.minutesStartingAt is provided, use that as the start minute.
      return `*/${interval} * * * *`
    }
    case 'hourly': {
      // When scheduling hourly, take the specified minute offset
      return `${options.hourlyMinute || '00'} * * * *`
    }
    case 'daily': {
      // Expected dailyTime in HH:MM
      const [minute, hour] = (options.dailyTime || '00:09').split(':')
      return `${minute || '00'} ${hour || '09'} * * *`
    }
    case 'weekly': {
      // Expected weeklyDay as MON, TUE, etc. and weeklyDayTime in HH:MM
      const dayMap: Record<string, number> = {
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
        SUN: 0,
      }
      const day = dayMap[options.weeklyDay || 'MON']
      const [minute, hour] = (options.weeklyDayTime || '00:09').split(':')
      return `${minute || '00'} ${hour || '09'} * * ${day}`
    }
    case 'monthly': {
      // Expected monthlyDay and monthlyTime in HH:MM
      const day = options.monthlyDay || '1'
      const [minute, hour] = (options.monthlyTime || '00:09').split(':')
      return `${minute || '00'} ${hour || '09'} ${day} * *`
    }
    case 'custom': {
      // Use the provided cron expression directly
      return options.cronExpression
    }
    default:
      throw new Error('Unsupported schedule type')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sse.ts]---
Location: sim-main/apps/sim/lib/core/utils/sse.ts

```typescript
/**
 * Standard headers for Server-Sent Events responses
 */
export const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
} as const

/**
 * Encodes data as a Server-Sent Events (SSE) message.
 * Formats the data as a JSON string prefixed with "data:" and suffixed with two newlines,
 * then encodes it as a Uint8Array for streaming.
 *
 * @param data - The data to encode and send via SSE
 * @returns The encoded SSE message as a Uint8Array
 */
export function encodeSSE(data: any): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
}
```

--------------------------------------------------------------------------------

---[FILE: theme.ts]---
Location: sim-main/apps/sim/lib/core/utils/theme.ts

```typescript
/**
 * Theme synchronization utilities for managing theme across next-themes and database
 */

/**
 * Updates the theme in next-themes by dispatching a storage event.
 * This works by updating localStorage and notifying next-themes of the change.
 * NOTE: Light mode is temporarily disabled - this function always forces dark mode.
 * @param _theme - The theme parameter (currently ignored, dark mode is forced)
 */
export function syncThemeToNextThemes(_theme: 'system' | 'light' | 'dark') {
  if (typeof window === 'undefined') return

  // Force dark mode - light mode is temporarily disabled
  const forcedTheme = 'dark'

  localStorage.setItem('sim-theme', forcedTheme)

  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'sim-theme',
      newValue: forcedTheme,
      oldValue: localStorage.getItem('sim-theme'),
      storageArea: localStorage,
      url: window.location.href,
    })
  )

  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add('dark')
}

/**
 * Gets the current theme from next-themes localStorage
 */
export function getThemeFromNextThemes(): 'system' | 'light' | 'dark' {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('sim-theme') as 'system' | 'light' | 'dark') || 'system'
}
```

--------------------------------------------------------------------------------

---[FILE: urls.ts]---
Location: sim-main/apps/sim/lib/core/utils/urls.ts

```typescript
import { getEnv } from '@/lib/core/config/env'
import { isProd } from '@/lib/core/config/feature-flags'

/**
 * Returns the base URL of the application from NEXT_PUBLIC_APP_URL
 * This ensures webhooks, callbacks, and other integrations always use the correct public URL
 * @returns The base URL string (e.g., 'http://localhost:3000' or 'https://example.com')
 * @throws Error if NEXT_PUBLIC_APP_URL is not configured
 */
export function getBaseUrl(): string {
  const baseUrl = getEnv('NEXT_PUBLIC_APP_URL')

  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL must be configured for webhooks and callbacks to work correctly'
    )
  }

  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    return baseUrl
  }

  const protocol = isProd ? 'https://' : 'http://'
  return `${protocol}${baseUrl}`
}

/**
 * Returns just the domain and port part of the application URL
 * @returns The domain with port if applicable (e.g., 'localhost:3000' or 'sim.ai')
 */
export function getBaseDomain(): string {
  try {
    const url = new URL(getBaseUrl())
    return url.host // host includes port if specified
  } catch (_e) {
    const fallbackUrl = getEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000'
    try {
      return new URL(fallbackUrl).host
    } catch {
      return isProd ? 'sim.ai' : 'localhost:3000'
    }
  }
}

/**
 * Returns the domain for email addresses, stripping www subdomain for Resend compatibility
 * @returns The email domain (e.g., 'sim.ai' instead of 'www.sim.ai')
 */
export function getEmailDomain(): string {
  try {
    const baseDomain = getBaseDomain()
    return baseDomain.startsWith('www.') ? baseDomain.substring(4) : baseDomain
  } catch (_e) {
    return isProd ? 'sim.ai' : 'localhost:3000'
  }
}
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: sim-main/apps/sim/lib/core/utils/validation.ts

```typescript
/**
 * Validates a name by removing any characters that could cause issues
 * with variable references or node naming.
 *
 * @param name - The name to validate
 * @returns The validated name with invalid characters removed, trimmed, and collapsed whitespace
 */
export function validateName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\s]/g, '') // Remove invalid characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces into single spaces
}

/**
 * Checks if a name contains invalid characters
 *
 * @param name - The name to check
 * @returns True if the name is valid, false otherwise
 */
export function isValidName(name: string): boolean {
  return /^[a-zA-Z0-9_\s]*$/.test(name)
}

/**
 * Gets a list of invalid characters in a name
 *
 * @param name - The name to check
 * @returns Array of invalid characters found
 */
export function getInvalidCharacters(name: string): string[] {
  const invalidChars = name.match(/[^a-zA-Z0-9_\s]/g)
  return invalidChars ? [...new Set(invalidChars)] : []
}
```

--------------------------------------------------------------------------------

---[FILE: api.ts]---
Location: sim-main/apps/sim/lib/environment/api.ts

```typescript
import { API_ENDPOINTS } from '@/stores/constants'
import type { EnvironmentVariable } from '@/stores/settings/environment/types'

export interface WorkspaceEnvironmentData {
  workspace: Record<string, string>
  personal: Record<string, string>
  conflicts: string[]
}

export async function fetchPersonalEnvironment(): Promise<Record<string, EnvironmentVariable>> {
  const response = await fetch(API_ENDPOINTS.ENVIRONMENT)

  if (!response.ok) {
    throw new Error(`Failed to load environment variables: ${response.statusText}`)
  }

  const { data } = await response.json()

  if (data && typeof data === 'object') {
    return data
  }

  return {}
}

export async function fetchWorkspaceEnvironment(
  workspaceId: string
): Promise<WorkspaceEnvironmentData> {
  const response = await fetch(API_ENDPOINTS.WORKSPACE_ENVIRONMENT(workspaceId))

  if (!response.ok) {
    throw new Error(`Failed to load workspace environment: ${response.statusText}`)
  }

  const { data } = await response.json()

  return {
    workspace: data.workspace || {},
    personal: data.personal || {},
    conflicts: data.conflicts || [],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/environment/utils.ts

```typescript
import { db } from '@sim/db'
import { environment, workspaceEnvironment } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { decryptSecret } from '@/lib/core/security/encryption'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('EnvironmentUtils')

/**
 * Get environment variable keys for a user
 * Returns only the variable names, not their values
 */
export async function getEnvironmentVariableKeys(userId: string): Promise<{
  variableNames: string[]
  count: number
}> {
  try {
    const result = await db
      .select()
      .from(environment)
      .where(eq(environment.userId, userId))
      .limit(1)

    if (!result.length || !result[0].variables) {
      return {
        variableNames: [],
        count: 0,
      }
    }

    // Get the keys (variable names) without decrypting values
    const encryptedVariables = result[0].variables as Record<string, string>
    const variableNames = Object.keys(encryptedVariables)

    return {
      variableNames,
      count: variableNames.length,
    }
  } catch (error) {
    logger.error('Error getting environment variable keys:', error)
    throw new Error('Failed to get environment variables')
  }
}

export async function getPersonalAndWorkspaceEnv(
  userId: string,
  workspaceId?: string
): Promise<{
  personalEncrypted: Record<string, string>
  workspaceEncrypted: Record<string, string>
  personalDecrypted: Record<string, string>
  workspaceDecrypted: Record<string, string>
  conflicts: string[]
}> {
  const [personalRows, workspaceRows] = await Promise.all([
    db.select().from(environment).where(eq(environment.userId, userId)).limit(1),
    workspaceId
      ? db
          .select()
          .from(workspaceEnvironment)
          .where(eq(workspaceEnvironment.workspaceId, workspaceId))
          .limit(1)
      : Promise.resolve([] as any[]),
  ])

  const personalEncrypted: Record<string, string> = (personalRows[0]?.variables as any) || {}
  const workspaceEncrypted: Record<string, string> = (workspaceRows[0]?.variables as any) || {}

  const decryptAll = async (src: Record<string, string>) => {
    const entries = Object.entries(src)
    const results = await Promise.all(
      entries.map(async ([k, v]) => {
        try {
          const { decrypted } = await decryptSecret(v)
          return [k, decrypted] as const
        } catch {
          return [k, ''] as const
        }
      })
    )
    return Object.fromEntries(results)
  }

  const [personalDecrypted, workspaceDecrypted] = await Promise.all([
    decryptAll(personalEncrypted),
    decryptAll(workspaceEncrypted),
  ])

  const conflicts = Object.keys(personalEncrypted).filter((k) => k in workspaceEncrypted)

  return {
    personalEncrypted,
    workspaceEncrypted,
    personalDecrypted,
    workspaceDecrypted,
    conflicts,
  }
}

export async function getEffectiveDecryptedEnv(
  userId: string,
  workspaceId?: string
): Promise<Record<string, string>> {
  const { personalDecrypted, workspaceDecrypted } = await getPersonalAndWorkspaceEnv(
    userId,
    workspaceId
  )
  return { ...personalDecrypted, ...workspaceDecrypted }
}
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/lib/execution/constants.ts

```typescript
/**
 * Execution timeout constants
 *
 * DEFAULT_EXECUTION_TIMEOUT_MS: The default timeout for executing user code (10 minutes)
 */

export const DEFAULT_EXECUTION_TIMEOUT_MS = 600000 // 10 minutes (600 seconds)
```

--------------------------------------------------------------------------------

---[FILE: e2b.ts]---
Location: sim-main/apps/sim/lib/execution/e2b.ts

```typescript
import { Sandbox } from '@e2b/code-interpreter'
import { env } from '@/lib/core/config/env'
import { CodeLanguage } from '@/lib/execution/languages'
import { createLogger } from '@/lib/logs/console/logger'

export interface E2BExecutionRequest {
  code: string
  language: CodeLanguage
  timeoutMs: number
}

export interface E2BExecutionResult {
  result: unknown
  stdout: string
  sandboxId?: string
  error?: string
}

const logger = createLogger('E2BExecution')

export async function executeInE2B(req: E2BExecutionRequest): Promise<E2BExecutionResult> {
  const { code, language, timeoutMs } = req

  const apiKey = env.E2B_API_KEY
  if (!apiKey) {
    throw new Error('E2B_API_KEY is required when E2B is enabled')
  }

  const sandbox = await Sandbox.create({ apiKey })
  const sandboxId = sandbox.sandboxId

  const stdoutChunks = []

  try {
    const execution = await sandbox.runCode(code, {
      language: language === CodeLanguage.Python ? 'python' : 'javascript',
      timeoutMs,
    })

    if (execution.error) {
      const errorMessage = `${execution.error.name}: ${execution.error.value}`
      logger.error(`E2B execution error`, {
        sandboxId,
        error: execution.error,
        errorMessage,
      })

      const errorOutput = execution.error.traceback || errorMessage
      return {
        result: null,
        stdout: errorOutput,
        error: errorMessage,
        sandboxId,
      }
    }

    if (execution.text) {
      stdoutChunks.push(execution.text)
    }
    if (execution.logs?.stdout) {
      stdoutChunks.push(...execution.logs.stdout)
    }
    if (execution.logs?.stderr) {
      stdoutChunks.push(...execution.logs.stderr)
    }

    const stdout = stdoutChunks.join('\n')

    let result: unknown = null
    const prefix = '__SIM_RESULT__='
    const lines = stdout.split('\n')
    const marker = lines.find((l) => l.startsWith(prefix))
    let cleanedStdout = stdout
    if (marker) {
      const jsonPart = marker.slice(prefix.length)
      try {
        result = JSON.parse(jsonPart)
      } catch {
        result = jsonPart
      }
      const filteredLines = lines.filter((l) => !l.startsWith(prefix))
      if (filteredLines.length > 0 && filteredLines[filteredLines.length - 1] === '') {
        filteredLines.pop()
      }
      cleanedStdout = filteredLines.join('\n')
    }

    return { result, stdout: cleanedStdout, sandboxId }
  } finally {
    try {
      await sandbox.kill()
    } catch {}
  }
}
```

--------------------------------------------------------------------------------

---[FILE: files.ts]---
Location: sim-main/apps/sim/lib/execution/files.ts

```typescript
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '@/lib/logs/console/logger'
import { uploadExecutionFile } from '@/lib/uploads/contexts/execution'
import { TRIGGER_TYPES } from '@/lib/workflows/triggers/triggers'
import type { InputFormatField } from '@/lib/workflows/types'
import type { UserFile } from '@/executor/types'
import type { SerializedBlock } from '@/serializer/types'

const logger = createLogger('ExecutionFiles')

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

/**
 * Process a single file for workflow execution - handles both base64 ('file' type) and URL pass-through ('url' type)
 */
export async function processExecutionFile(
  file: { type: string; data: string; name: string; mime?: string },
  executionContext: { workspaceId: string; workflowId: string; executionId: string },
  requestId: string,
  userId?: string
): Promise<UserFile | null> {
  if (file.type === 'file' && file.data && file.name) {
    const dataUrlPrefix = 'data:'
    const base64Prefix = ';base64,'

    if (!file.data.startsWith(dataUrlPrefix)) {
      logger.warn(`[${requestId}] Invalid data format for file: ${file.name}`)
      return null
    }

    const base64Index = file.data.indexOf(base64Prefix)
    if (base64Index === -1) {
      logger.warn(`[${requestId}] Invalid data format (no base64 marker) for file: ${file.name}`)
      return null
    }

    const mimeType = file.data.substring(dataUrlPrefix.length, base64Index)
    const base64Data = file.data.substring(base64Index + base64Prefix.length)
    const buffer = Buffer.from(base64Data, 'base64')

    if (buffer.length > MAX_FILE_SIZE) {
      const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2)
      throw new Error(
        `File "${file.name}" exceeds the maximum size limit of 20MB (actual size: ${fileSizeMB}MB)`
      )
    }

    logger.debug(`[${requestId}] Uploading file: ${file.name} (${buffer.length} bytes)`)

    const userFile = await uploadExecutionFile(
      executionContext,
      buffer,
      file.name,
      mimeType || file.mime || 'application/octet-stream',
      userId
    )

    logger.debug(`[${requestId}] Successfully uploaded ${file.name}`)
    return userFile
  }

  if (file.type === 'url' && file.data) {
    return {
      id: uuidv4(),
      url: file.data,
      name: file.name,
      size: 0,
      type: file.mime || 'application/octet-stream',
      key: `url/${file.name}`,
    }
  }

  return null
}

/**
 * Process all files for a given field in workflow execution input
 */
export async function processExecutionFiles(
  fieldValue: any,
  executionContext: { workspaceId: string; workflowId: string; executionId: string },
  requestId: string,
  userId?: string
): Promise<UserFile[]> {
  if (!fieldValue || typeof fieldValue !== 'object') {
    return []
  }

  const files = Array.isArray(fieldValue) ? fieldValue : [fieldValue]
  const uploadedFiles: UserFile[] = []
  const fullContext = { ...executionContext }

  for (const file of files) {
    try {
      const userFile = await processExecutionFile(file, fullContext, requestId, userId)

      if (userFile) {
        uploadedFiles.push(userFile)
      }
    } catch (error) {
      logger.error(`[${requestId}] Failed to process file ${file.name}:`, error)
      throw new Error(`Failed to upload file: ${file.name}`)
    }
  }

  return uploadedFiles
}

/**
 * Extract inputFormat fields from a start block or trigger block
 */
type ValidatedInputFormatField = Required<Pick<InputFormatField, 'name' | 'type'>>

function extractInputFormatFromBlock(block: SerializedBlock): ValidatedInputFormatField[] {
  const inputFormatValue = block.config?.params?.inputFormat

  if (!Array.isArray(inputFormatValue) || inputFormatValue.length === 0) {
    return []
  }

  return inputFormatValue.filter(
    (field): field is ValidatedInputFormatField =>
      field &&
      typeof field === 'object' &&
      'name' in field &&
      'type' in field &&
      typeof field.name === 'string' &&
      typeof field.type === 'string'
  )
}

/**
 * Process file fields in workflow input based on the start block's inputFormat
 * This handles base64 and URL file inputs from API calls
 */
export async function processInputFileFields(
  input: unknown,
  blocks: SerializedBlock[],
  executionContext: { workspaceId: string; workflowId: string; executionId: string },
  requestId: string,
  userId?: string
): Promise<unknown> {
  if (!input || typeof input !== 'object' || blocks.length === 0) {
    return input
  }

  const startBlock = blocks.find((block) => {
    const blockType = block.metadata?.id
    return (
      blockType === TRIGGER_TYPES.START ||
      blockType === TRIGGER_TYPES.API ||
      blockType === TRIGGER_TYPES.INPUT ||
      blockType === TRIGGER_TYPES.GENERIC_WEBHOOK ||
      blockType === TRIGGER_TYPES.STARTER
    )
  })

  if (!startBlock) {
    return input
  }

  const inputFormat = extractInputFormatFromBlock(startBlock)
  const fileFields = inputFormat.filter((field) => field.type === 'files')

  if (fileFields.length === 0) {
    return input
  }

  const processedInput = { ...input } as Record<string, unknown>

  for (const fileField of fileFields) {
    const fieldValue = processedInput[fileField.name]

    if (fieldValue && typeof fieldValue === 'object') {
      const uploadedFiles = await processExecutionFiles(
        fieldValue,
        executionContext,
        requestId,
        userId
      )

      if (uploadedFiles.length > 0) {
        processedInput[fileField.name] = uploadedFiles
        logger.info(
          `[${requestId}] Successfully processed ${uploadedFiles.length} file(s) for field: ${fileField.name}`
        )
      }
    }
  }

  return processedInput
}
```

--------------------------------------------------------------------------------

````
