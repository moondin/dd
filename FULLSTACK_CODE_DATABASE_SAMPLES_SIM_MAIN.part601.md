---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 601
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 601 of 933)

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

---[FILE: references.ts]---
Location: sim-main/apps/sim/lib/workflows/sanitization/references.ts

```typescript
import { normalizeBlockName } from '@/stores/workflows/utils'

export const SYSTEM_REFERENCE_PREFIXES = new Set(['start', 'loop', 'parallel', 'variable'])

const INVALID_REFERENCE_CHARS = /[+*/=<>!]/

const LEADING_REFERENCE_PATTERN = /^[<>=!\s]*$/

export function splitReferenceSegment(
  segment: string
): { leading: string; reference: string } | null {
  if (!segment.startsWith('<') || !segment.endsWith('>')) {
    return null
  }

  const lastOpenBracket = segment.lastIndexOf('<')
  if (lastOpenBracket === -1) {
    return null
  }

  const leading = lastOpenBracket > 0 ? segment.slice(0, lastOpenBracket) : ''
  const reference = segment.slice(lastOpenBracket)

  if (!reference.startsWith('<') || !reference.endsWith('>')) {
    return null
  }

  return { leading, reference }
}

export function isLikelyReferenceSegment(segment: string): boolean {
  const split = splitReferenceSegment(segment)
  if (!split) {
    return false
  }

  const { leading, reference } = split

  if (leading && !LEADING_REFERENCE_PATTERN.test(leading)) {
    return false
  }

  const inner = reference.slice(1, -1)

  if (!inner) {
    return false
  }

  if (inner.startsWith(' ')) {
    return false
  }

  if (inner.match(/^\s*[<>=!]+\s*$/) || inner.match(/\s[<>=!]+\s/)) {
    return false
  }

  if (inner.match(/^[<>=!]+\s/)) {
    return false
  }

  if (inner.includes('.')) {
    const dotIndex = inner.indexOf('.')
    const beforeDot = inner.substring(0, dotIndex)
    const afterDot = inner.substring(dotIndex + 1)

    if (afterDot.includes(' ')) {
      return false
    }

    if (INVALID_REFERENCE_CHARS.test(beforeDot) || INVALID_REFERENCE_CHARS.test(afterDot)) {
      return false
    }
  } else if (INVALID_REFERENCE_CHARS.test(inner) || inner.match(/^\d/) || inner.match(/\s\d/)) {
    return false
  }

  return true
}

export function extractReferencePrefixes(value: string): Array<{ raw: string; prefix: string }> {
  if (!value || typeof value !== 'string') {
    return []
  }

  const matches = value.match(/<[^>]+>/g)
  if (!matches) {
    return []
  }

  const references: Array<{ raw: string; prefix: string }> = []

  for (const match of matches) {
    const split = splitReferenceSegment(match)
    if (!split) {
      continue
    }

    if (split.leading && !LEADING_REFERENCE_PATTERN.test(split.leading)) {
      continue
    }

    const referenceSegment = split.reference

    if (!isLikelyReferenceSegment(referenceSegment)) {
      continue
    }

    const inner = referenceSegment.slice(1, -1)
    const [rawPrefix] = inner.split('.')
    if (!rawPrefix) {
      continue
    }

    const normalized = normalizeBlockName(rawPrefix)
    references.push({ raw: referenceSegment, prefix: normalized })
  }

  return references
}
```

--------------------------------------------------------------------------------

---[FILE: validation.ts]---
Location: sim-main/apps/sim/lib/workflows/sanitization/validation.ts

```typescript
import { createLogger } from '@/lib/logs/console/logger'
import { getBlock } from '@/blocks/registry'
import type { WorkflowState } from '@/stores/workflows/workflow/types'
import { getTool } from '@/tools/utils'

const logger = createLogger('WorkflowValidation')

/**
 * Checks if a custom tool has a valid inline schema
 */
function isValidCustomToolSchema(tool: any): boolean {
  try {
    if (!tool || typeof tool !== 'object') return false
    if (tool.type !== 'custom-tool') return true // non-custom tools are validated elsewhere

    const schema = tool.schema
    if (!schema || typeof schema !== 'object') return false
    const fn = schema.function
    if (!fn || typeof fn !== 'object') return false
    if (!fn.name || typeof fn.name !== 'string') return false

    const params = fn.parameters
    if (!params || typeof params !== 'object') return false
    if (params.type !== 'object') return false
    if (!params.properties || typeof params.properties !== 'object') return false

    return true
  } catch (_err) {
    return false
  }
}

/**
 * Checks if a custom tool is a valid reference-only format (new format)
 */
function isValidCustomToolReference(tool: any): boolean {
  try {
    if (!tool || typeof tool !== 'object') return false
    if (tool.type !== 'custom-tool') return false

    // Reference format: has customToolId but no inline schema/code
    // This is valid - the tool will be loaded dynamically during execution
    if (tool.customToolId && typeof tool.customToolId === 'string') {
      return true
    }

    return false
  } catch (_err) {
    return false
  }
}

export function sanitizeAgentToolsInBlocks(blocks: Record<string, any>): {
  blocks: Record<string, any>
  warnings: string[]
} {
  const warnings: string[] = []

  // Shallow clone to avoid mutating callers
  const sanitizedBlocks: Record<string, any> = { ...blocks }

  for (const [blockId, block] of Object.entries(sanitizedBlocks)) {
    try {
      if (!block || block.type !== 'agent') continue
      const subBlocks = block.subBlocks || {}
      const toolsSubBlock = subBlocks.tools
      if (!toolsSubBlock) continue

      let value = toolsSubBlock.value

      // Parse legacy string format
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value)
        } catch (_e) {
          warnings.push(
            `Block ${block.name || blockId}: invalid tools JSON; resetting tools to empty array`
          )
          value = []
        }
      }

      if (!Array.isArray(value)) {
        // Force to array to keep client safe
        warnings.push(`Block ${block.name || blockId}: tools value is not an array; resetting`)
        toolsSubBlock.value = []
        continue
      }

      const originalLength = value.length
      const cleaned = value
        .filter((tool: any) => {
          // Allow non-custom tools to pass through as-is
          if (!tool || typeof tool !== 'object') return false
          if (tool.type !== 'custom-tool') return true

          // Check if it's a valid reference-only format (new format)
          if (isValidCustomToolReference(tool)) {
            return true
          }

          // Check if it's a valid inline schema format (legacy format)
          const ok = isValidCustomToolSchema(tool)
          if (!ok) {
            logger.warn('Removing invalid custom tool from workflow', {
              blockId,
              blockName: block.name,
              hasCustomToolId: !!tool.customToolId,
              hasSchema: !!tool.schema,
            })
          }
          return ok
        })
        .map((tool: any) => {
          if (tool.type === 'custom-tool') {
            // For reference-only tools, ensure usageControl default
            if (!tool.usageControl) {
              tool.usageControl = 'auto'
            }
            // For inline tools (legacy), also ensure code default
            if (!tool.customToolId && (!tool.code || typeof tool.code !== 'string')) {
              tool.code = ''
            }
          }
          return tool
        })

      if (cleaned.length !== originalLength) {
        warnings.push(
          `Block ${block.name || blockId}: removed ${originalLength - cleaned.length} invalid tool(s)`
        )
      }

      toolsSubBlock.value = cleaned
      // Reassign in case caller uses object identity
      sanitizedBlocks[blockId] = { ...block, subBlocks: { ...subBlocks, tools: toolsSubBlock } }
    } catch (err: any) {
      warnings.push(
        `Block ${block?.name || blockId}: tools sanitation failed: ${err?.message || String(err)}`
      )
    }
  }

  return { blocks: sanitizedBlocks, warnings }
}

export interface WorkflowValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  sanitizedState?: WorkflowState
}

/**
 * Comprehensive workflow state validation
 * Checks all tool references, block types, and required fields
 */
export function validateWorkflowState(
  workflowState: WorkflowState,
  options: { sanitize?: boolean } = {}
): WorkflowValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let sanitizedState = workflowState

  try {
    // Basic structure validation
    if (!workflowState || typeof workflowState !== 'object') {
      errors.push('Invalid workflow state: must be an object')
      return { valid: false, errors, warnings }
    }

    if (!workflowState.blocks || typeof workflowState.blocks !== 'object') {
      errors.push('Invalid workflow state: missing blocks')
      return { valid: false, errors, warnings }
    }

    // Validate each block
    const sanitizedBlocks: Record<string, any> = {}
    let hasChanges = false

    for (const [blockId, block] of Object.entries(workflowState.blocks)) {
      if (!block || typeof block !== 'object') {
        errors.push(`Block ${blockId}: invalid block structure`)
        continue
      }

      // Check if block type exists
      const blockConfig = getBlock(block.type)

      // Special handling for container blocks (loop and parallel)
      if (block.type === 'loop' || block.type === 'parallel') {
        // These are valid container types, they don't need block configs
        sanitizedBlocks[blockId] = block
        continue
      }

      if (!blockConfig) {
        errors.push(`Block ${block.name || blockId}: unknown block type '${block.type}'`)
        if (options.sanitize) {
          hasChanges = true
          continue // Skip this block in sanitized output
        }
      }

      // Validate tool references in blocks that use tools
      if (block.type === 'api' || block.type === 'generic') {
        // For API and generic blocks, the tool is determined by the block's tool configuration
        // In the workflow state, we need to check if the block type has valid tool access
        const blockConfig = getBlock(block.type)
        if (blockConfig?.tools?.access) {
          // API block has static tool access
          const toolIds = blockConfig.tools.access
          for (const toolId of toolIds) {
            const validationError = validateToolReference(toolId, block.type, block.name)
            if (validationError) {
              errors.push(validationError)
            }
          }
        }
      } else if (block.type === 'knowledge' || block.type === 'supabase' || block.type === 'mcp') {
        // These blocks have dynamic tool selection based on operation
        // The actual tool validation happens at runtime based on the operation value
        // For now, just ensure the block type is valid (already checked above)
      }

      // Special validation for agent blocks
      if (block.type === 'agent' && block.subBlocks?.tools?.value) {
        const toolsSanitization = sanitizeAgentToolsInBlocks({ [blockId]: block })
        warnings.push(...toolsSanitization.warnings)
        if (toolsSanitization.warnings.length > 0) {
          sanitizedBlocks[blockId] = toolsSanitization.blocks[blockId]
          hasChanges = true
        } else {
          sanitizedBlocks[blockId] = block
        }
      } else {
        sanitizedBlocks[blockId] = block
      }
    }

    // Validate edges reference existing blocks
    if (workflowState.edges && Array.isArray(workflowState.edges)) {
      const blockIds = new Set(Object.keys(sanitizedBlocks))
      const loopIds = new Set(Object.keys(workflowState.loops || {}))
      const parallelIds = new Set(Object.keys(workflowState.parallels || {}))

      for (const edge of workflowState.edges) {
        if (!edge || typeof edge !== 'object') {
          errors.push('Invalid edge structure')
          continue
        }

        // Check if source and target exist
        const sourceExists =
          blockIds.has(edge.source) || loopIds.has(edge.source) || parallelIds.has(edge.source)
        const targetExists =
          blockIds.has(edge.target) || loopIds.has(edge.target) || parallelIds.has(edge.target)

        if (!sourceExists) {
          errors.push(`Edge references non-existent source block '${edge.source}'`)
        }
        if (!targetExists) {
          errors.push(`Edge references non-existent target block '${edge.target}'`)
        }
      }
    }

    // If we made changes during sanitization, create a new state object
    if (hasChanges && options.sanitize) {
      sanitizedState = {
        ...workflowState,
        blocks: sanitizedBlocks,
      }
    }

    const valid = errors.length === 0
    return {
      valid,
      errors,
      warnings,
      sanitizedState: options.sanitize ? sanitizedState : undefined,
    }
  } catch (err) {
    logger.error('Workflow validation failed with exception', err)
    errors.push(`Validation failed: ${err instanceof Error ? err.message : String(err)}`)
    return { valid: false, errors, warnings }
  }
}

/**
 * Validate tool reference for a specific block
 * Returns null if valid, error message if invalid
 */
export function validateToolReference(
  toolId: string | undefined,
  blockType: string,
  blockName?: string
): string | null {
  if (!toolId) return null

  // Check if it's a custom tool or MCP tool
  const isCustomTool = toolId.startsWith('custom_')
  const isMcpTool = toolId.startsWith('mcp-')

  if (!isCustomTool && !isMcpTool) {
    // For built-in tools, verify they exist
    const tool = getTool(toolId)
    if (!tool) {
      return `Block ${blockName || 'unknown'} (${blockType}): references non-existent tool '${toolId}'`
    }
  }

  return null
}
```

--------------------------------------------------------------------------------

````
