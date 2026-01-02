---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 571
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 571 of 933)

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

---[FILE: query-parser.ts]---
Location: sim-main/apps/sim/lib/logs/query-parser.ts

```typescript
/**
 * Query language parser for logs search
 *
 * Supports syntax like:
 * level:error workflow:"my-workflow" trigger:api cost:>0.005 date:today
 */

export interface ParsedFilter {
  field: string
  operator: '=' | '>' | '<' | '>=' | '<=' | '!='
  value: string | number | boolean
  originalValue: string
}

export interface ParsedQuery {
  filters: ParsedFilter[]
  textSearch: string // Any remaining text not in field:value format
}

const FILTER_FIELDS = {
  level: 'string',
  status: 'string', // alias for level
  workflow: 'string',
  trigger: 'string',
  execution: 'string',
  executionId: 'string',
  workflowId: 'string',
  id: 'string',
  cost: 'number',
  duration: 'number',
  date: 'date',
  folder: 'string',
} as const

type FilterField = keyof typeof FILTER_FIELDS

/**
 * Parse a search query string into structured filters and text search
 */
export function parseQuery(query: string): ParsedQuery {
  const filters: ParsedFilter[] = []
  const tokens: string[] = []

  const filterRegex = /(\w+):((?:[><!]=?|=)?(?:"[^"]*"|[^\s]+))/g

  let lastIndex = 0
  let match

  while ((match = filterRegex.exec(query)) !== null) {
    const [fullMatch, field, valueWithOperator] = match

    const beforeText = query.slice(lastIndex, match.index).trim()
    if (beforeText) {
      tokens.push(beforeText)
    }

    const parsedFilter = parseFilter(field, valueWithOperator)
    if (parsedFilter) {
      filters.push(parsedFilter)
    } else {
      tokens.push(fullMatch)
    }

    lastIndex = match.index + fullMatch.length
  }

  const remainingText = query.slice(lastIndex).trim()
  if (remainingText) {
    tokens.push(remainingText)
  }

  return {
    filters,
    textSearch: tokens.join(' ').trim(),
  }
}

/**
 * Parse a single field:value filter
 */
function parseFilter(field: string, valueWithOperator: string): ParsedFilter | null {
  if (!(field in FILTER_FIELDS)) {
    return null
  }

  const filterField = field as FilterField
  const fieldType = FILTER_FIELDS[filterField]

  let operator: ParsedFilter['operator'] = '='
  let value = valueWithOperator

  if (value.startsWith('>=')) {
    operator = '>='
    value = value.slice(2)
  } else if (value.startsWith('<=')) {
    operator = '<='
    value = value.slice(2)
  } else if (value.startsWith('!=')) {
    operator = '!='
    value = value.slice(2)
  } else if (value.startsWith('>')) {
    operator = '>'
    value = value.slice(1)
  } else if (value.startsWith('<')) {
    operator = '<'
    value = value.slice(1)
  } else if (value.startsWith('=')) {
    operator = '='
    value = value.slice(1)
  }

  const originalValue = value
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1)
  }

  let parsedValue: string | number | boolean = value

  if (fieldType === 'number') {
    if (field === 'duration' && value.endsWith('ms')) {
      parsedValue = Number.parseFloat(value.slice(0, -2))
    } else if (field === 'duration' && value.endsWith('s')) {
      parsedValue = Number.parseFloat(value.slice(0, -1)) * 1000 // Convert to ms
    } else {
      parsedValue = Number.parseFloat(value)
    }

    if (Number.isNaN(parsedValue)) {
      return null
    }
  }

  return {
    field: filterField,
    operator,
    value: parsedValue,
    originalValue,
  }
}

/**
 * Convert parsed query back to URL parameters for the logs API
 */
export function queryToApiParams(parsedQuery: ParsedQuery): Record<string, string> {
  const params: Record<string, string> = {}

  if (parsedQuery.textSearch) {
    params.search = parsedQuery.textSearch
  }

  for (const filter of parsedQuery.filters) {
    switch (filter.field) {
      case 'level':
      case 'status':
        if (filter.operator === '=') {
          const existing = params.level ? params.level.split(',') : []
          existing.push(filter.value as string)
          params.level = existing.join(',')
        }
        break

      case 'trigger':
        if (filter.operator === '=') {
          const existing = params.triggers ? params.triggers.split(',') : []
          existing.push(filter.value as string)
          params.triggers = existing.join(',')
        }
        break

      case 'workflow':
        if (filter.operator === '=') {
          params.workflowName = filter.value as string
        }
        break

      case 'folder':
        if (filter.operator === '=') {
          params.folderName = filter.value as string
        }
        break

      case 'execution':
        if (filter.operator === '=' && parsedQuery.textSearch) {
          params.search = `${parsedQuery.textSearch} ${filter.value}`.trim()
        } else if (filter.operator === '=') {
          params.search = filter.value as string
        }
        break

      case 'workflowId':
        if (filter.operator === '=') {
          params.workflowIds = String(filter.value)
        }
        break

      case 'executionId':
        if (filter.operator === '=') {
          params.executionId = String(filter.value)
        }
        break

      case 'date':
        if (filter.operator === '=' && filter.value === 'today') {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          params.startDate = today.toISOString()
        } else if (filter.operator === '=' && filter.value === 'yesterday') {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          yesterday.setHours(0, 0, 0, 0)
          params.startDate = yesterday.toISOString()

          const endOfYesterday = new Date(yesterday)
          endOfYesterday.setHours(23, 59, 59, 999)
          params.endDate = endOfYesterday.toISOString()
        }
        break

      case 'cost':
        params.costOperator = filter.operator
        params.costValue = String(filter.value)
        break

      case 'duration':
        params.durationOperator = filter.operator
        params.durationValue = String(filter.value)
        break
    }
  }

  return params
}
```

--------------------------------------------------------------------------------

---[FILE: search-suggestions.ts]---
Location: sim-main/apps/sim/lib/logs/search-suggestions.ts

```typescript
import type { Suggestion, SuggestionGroup } from '@/app/workspace/[workspaceId]/logs/types'

export interface FilterDefinition {
  key: string
  label: string
  description: string
  options: Array<{
    value: string
    label: string
    description?: string
  }>
}

export interface WorkflowData {
  id: string
  name: string
  description?: string
}

export interface FolderData {
  id: string
  name: string
}

export interface TriggerData {
  value: string
  label: string
  color: string
}

export const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    key: 'level',
    label: 'Status',
    description: 'Filter by log level',
    options: [
      { value: 'error', label: 'Error', description: 'Error logs only' },
      { value: 'info', label: 'Info', description: 'Info logs only' },
    ],
  },
  {
    key: 'cost',
    label: 'Cost',
    description: 'Filter by execution cost',
    options: [
      { value: '>0.01', label: 'Over $0.01', description: 'Executions costing more than $0.01' },
      {
        value: '<0.005',
        label: 'Under $0.005',
        description: 'Executions costing less than $0.005',
      },
      { value: '>0.05', label: 'Over $0.05', description: 'Executions costing more than $0.05' },
      { value: '=0', label: 'Free', description: 'Free executions' },
      { value: '>0', label: 'Paid', description: 'Executions with cost' },
    ],
  },
  {
    key: 'date',
    label: 'Date',
    description: 'Filter by date range',
    options: [
      { value: 'today', label: 'Today', description: "Today's logs" },
      { value: 'yesterday', label: 'Yesterday', description: "Yesterday's logs" },
      { value: 'this-week', label: 'This week', description: "This week's logs" },
      { value: 'last-week', label: 'Last week', description: "Last week's logs" },
      { value: 'this-month', label: 'This month', description: "This month's logs" },
    ],
  },
  {
    key: 'duration',
    label: 'Duration',
    description: 'Filter by execution duration',
    options: [
      { value: '>5s', label: 'Over 5s', description: 'Executions longer than 5 seconds' },
      { value: '<1s', label: 'Under 1s', description: 'Executions shorter than 1 second' },
      { value: '>10s', label: 'Over 10s', description: 'Executions longer than 10 seconds' },
      { value: '>30s', label: 'Over 30s', description: 'Executions longer than 30 seconds' },
      { value: '<500ms', label: 'Under 0.5s', description: 'Very fast executions' },
    ],
  },
]

export class SearchSuggestions {
  private workflowsData: WorkflowData[]
  private foldersData: FolderData[]
  private triggersData: TriggerData[]

  constructor(
    workflowsData: WorkflowData[] = [],
    foldersData: FolderData[] = [],
    triggersData: TriggerData[] = []
  ) {
    this.workflowsData = workflowsData
    this.foldersData = foldersData
    this.triggersData = triggersData
  }

  updateData(
    workflowsData: WorkflowData[] = [],
    foldersData: FolderData[] = [],
    triggersData: TriggerData[] = []
  ) {
    this.workflowsData = workflowsData
    this.foldersData = foldersData
    this.triggersData = triggersData
  }

  /**
   * Get all triggers from registry data
   */
  private getAllTriggers(): TriggerData[] {
    return this.triggersData
  }

  /**
   * Get suggestions based ONLY on current input (no cursor position!)
   */
  getSuggestions(input: string): SuggestionGroup | null {
    const trimmed = input.trim()

    if (!trimmed) {
      return this.getFilterKeysList()
    }

    if (trimmed.endsWith(':')) {
      const key = trimmed.slice(0, -1)
      return this.getFilterValues(key)
    }

    if (trimmed.includes(':')) {
      const [key, partial] = trimmed.split(':')
      return this.getFilterValues(key, partial)
    }

    return this.getMultiSectionResults(trimmed)
  }

  /**
   * Get filter keys list (empty input state)
   */
  private getFilterKeysList(): SuggestionGroup {
    const suggestions: Suggestion[] = []

    for (const filter of FILTER_DEFINITIONS) {
      suggestions.push({
        id: `filter-key-${filter.key}`,
        value: `${filter.key}:`,
        label: filter.label,
        description: filter.description,
        category: 'filters',
      })
    }

    suggestions.push({
      id: 'filter-key-trigger',
      value: 'trigger:',
      label: 'Trigger',
      description: 'Filter by trigger type',
      category: 'filters',
    })

    if (this.workflowsData.length > 0) {
      suggestions.push({
        id: 'filter-key-workflow',
        value: 'workflow:',
        label: 'Workflow',
        description: 'Filter by workflow name',
        category: 'filters',
      })
    }

    if (this.foldersData.length > 0) {
      suggestions.push({
        id: 'filter-key-folder',
        value: 'folder:',
        label: 'Folder',
        description: 'Filter by folder name',
        category: 'filters',
      })
    }

    suggestions.push({
      id: 'filter-key-workflowId',
      value: 'workflowId:',
      label: 'Workflow ID',
      description: 'Filter by workflow ID',
      category: 'filters',
    })

    suggestions.push({
      id: 'filter-key-executionId',
      value: 'executionId:',
      label: 'Execution ID',
      description: 'Filter by execution ID',
      category: 'filters',
    })

    return {
      type: 'filter-keys',
      suggestions,
    }
  }

  /**
   * Get filter values for a specific key
   */
  private getFilterValues(key: string, partial = ''): SuggestionGroup | null {
    const filterDef = FILTER_DEFINITIONS.find((f) => f.key === key)

    if (filterDef) {
      const suggestions = filterDef.options
        .filter(
          (opt) =>
            !partial ||
            opt.value.toLowerCase().includes(partial.toLowerCase()) ||
            opt.label.toLowerCase().includes(partial.toLowerCase())
        )
        .map((opt) => ({
          id: `filter-value-${key}-${opt.value}`,
          value: `${key}:${opt.value}`,
          label: opt.label,
          description: opt.description,
          category: key as any,
        }))

      return suggestions.length > 0
        ? {
            type: 'filter-values',
            filterKey: key,
            suggestions,
          }
        : null
    }

    if (key === 'trigger') {
      const allTriggers = this.getAllTriggers()
      const suggestions = allTriggers
        .filter((t) => !partial || t.label.toLowerCase().includes(partial.toLowerCase()))
        .map((t) => ({
          id: `filter-value-trigger-${t.value}`,
          value: `trigger:${t.value}`,
          label: t.label,
          description: `${t.label}-triggered executions`,
          category: 'trigger' as const,
          color: t.color,
        }))

      return suggestions.length > 0
        ? {
            type: 'filter-values',
            filterKey: 'trigger',
            suggestions,
          }
        : null
    }

    if (key === 'workflow') {
      const suggestions = this.workflowsData
        .filter((w) => !partial || w.name.toLowerCase().includes(partial.toLowerCase()))
        .map((w) => ({
          id: `filter-value-workflow-${w.id}`,
          value: `workflow:"${w.name}"`,
          label: w.name,
          description: w.description,
          category: 'workflow' as const,
        }))

      return suggestions.length > 0
        ? {
            type: 'filter-values',
            filterKey: 'workflow',
            suggestions,
          }
        : null
    }

    if (key === 'folder') {
      const suggestions = this.foldersData
        .filter((f) => !partial || f.name.toLowerCase().includes(partial.toLowerCase()))
        .map((f) => ({
          id: `filter-value-folder-${f.id}`,
          value: `folder:"${f.name}"`,
          label: f.name,
          category: 'folder' as const,
        }))

      return suggestions.length > 0
        ? {
            type: 'filter-values',
            filterKey: 'folder',
            suggestions,
          }
        : null
    }

    return null
  }

  /**
   * Get multi-section results for plain text
   */
  private getMultiSectionResults(query: string): SuggestionGroup | null {
    const sections: Array<{ title: string; suggestions: Suggestion[] }> = []
    const allSuggestions: Suggestion[] = []

    const showAllSuggestion: Suggestion = {
      id: 'show-all',
      value: query,
      label: `Show all results for "${query}"`,
      category: 'show-all',
    }
    allSuggestions.push(showAllSuggestion)

    const matchingFilterValues = this.getMatchingFilterValues(query)
    if (matchingFilterValues.length > 0) {
      sections.push({
        title: 'SUGGESTED FILTERS',
        suggestions: matchingFilterValues,
      })
      allSuggestions.push(...matchingFilterValues)
    }

    const matchingTriggers = this.getMatchingTriggers(query)
    if (matchingTriggers.length > 0) {
      sections.push({
        title: 'TRIGGERS',
        suggestions: matchingTriggers,
      })
      allSuggestions.push(...matchingTriggers)
    }

    const matchingWorkflows = this.getMatchingWorkflows(query)
    if (matchingWorkflows.length > 0) {
      sections.push({
        title: 'WORKFLOWS',
        suggestions: matchingWorkflows,
      })
      allSuggestions.push(...matchingWorkflows)
    }

    const matchingFolders = this.getMatchingFolders(query)
    if (matchingFolders.length > 0) {
      sections.push({
        title: 'FOLDERS',
        suggestions: matchingFolders,
      })
      allSuggestions.push(...matchingFolders)
    }

    if (
      matchingFilterValues.length === 0 &&
      matchingTriggers.length === 0 &&
      matchingWorkflows.length === 0 &&
      matchingFolders.length === 0
    ) {
      const filterKeys = this.getFilterKeysList()
      if (filterKeys.suggestions.length > 0) {
        sections.push({
          title: 'SUGGESTED FILTERS',
          suggestions: filterKeys.suggestions.slice(0, 5),
        })
        allSuggestions.push(...filterKeys.suggestions.slice(0, 5))
      }
    }

    return allSuggestions.length > 0
      ? {
          type: 'multi-section',
          suggestions: allSuggestions,
          sections,
        }
      : null
  }

  /**
   * Match filter values across all definitions
   */
  private getMatchingFilterValues(query: string): Suggestion[] {
    if (!query.trim()) return []

    const matches: Suggestion[] = []
    const lowerQuery = query.toLowerCase()

    for (const filterDef of FILTER_DEFINITIONS) {
      for (const option of filterDef.options) {
        if (
          option.value.toLowerCase().includes(lowerQuery) ||
          option.label.toLowerCase().includes(lowerQuery)
        ) {
          matches.push({
            id: `filter-match-${filterDef.key}-${option.value}`,
            value: `${filterDef.key}:${option.value}`,
            label: `${filterDef.label}: ${option.label}`,
            description: option.description,
            category: filterDef.key as any,
          })
        }
      }
    }

    return matches.slice(0, 5)
  }

  /**
   * Match triggers by label (core + integrations)
   */
  private getMatchingTriggers(query: string): Suggestion[] {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const allTriggers = this.getAllTriggers()

    const matches = allTriggers
      .filter((trigger) => trigger.label.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase()
        const bLabel = b.label.toLowerCase()

        if (aLabel === lowerQuery) return -1
        if (bLabel === lowerQuery) return 1
        if (aLabel.startsWith(lowerQuery) && !bLabel.startsWith(lowerQuery)) return -1
        if (bLabel.startsWith(lowerQuery) && !aLabel.startsWith(lowerQuery)) return 1
        return aLabel.localeCompare(bLabel)
      })
      .slice(0, 8)
      .map((trigger) => ({
        id: `trigger-match-${trigger.value}`,
        value: `trigger:${trigger.value}`,
        label: trigger.label,
        description: `${trigger.label}-triggered executions`,
        category: 'trigger' as const,
        color: trigger.color,
      }))

    return matches
  }

  /**
   * Match workflows by name/description
   */
  private getMatchingWorkflows(query: string): Suggestion[] {
    if (!query.trim() || this.workflowsData.length === 0) return []

    const lowerQuery = query.toLowerCase()

    const matches = this.workflowsData
      .filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(lowerQuery) ||
          workflow.description?.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()

        if (aName === lowerQuery) return -1
        if (bName === lowerQuery) return 1
        if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1
        if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1
        return aName.localeCompare(bName)
      })
      .slice(0, 8)
      .map((workflow) => ({
        id: `workflow-match-${workflow.id}`,
        value: `workflow:"${workflow.name}"`,
        label: workflow.name,
        description: workflow.description,
        category: 'workflow' as const,
      }))

    return matches
  }

  /**
   * Match folders by name
   */
  private getMatchingFolders(query: string): Suggestion[] {
    if (!query.trim() || this.foldersData.length === 0) return []

    const lowerQuery = query.toLowerCase()

    const matches = this.foldersData
      .filter((folder) => folder.name.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()

        if (aName === lowerQuery) return -1
        if (bName === lowerQuery) return 1
        if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1
        if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1
        return aName.localeCompare(bName)
      })
      .slice(0, 8)
      .map((folder) => ({
        id: `folder-match-${folder.id}`,
        value: `folder:"${folder.name}"`,
        label: folder.name,
        category: 'folder' as const,
      }))

    return matches
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/logs/types.ts

```typescript
import type { Edge } from 'reactflow'
import type { BlockLog, NormalizedBlockOutput } from '@/executor/types'
import type { DeploymentStatus } from '@/stores/workflows/registry/types'
import type { Loop, Parallel, WorkflowState } from '@/stores/workflows/workflow/types'

export type { WorkflowState, Loop, Parallel, DeploymentStatus }
export type WorkflowEdge = Edge
export type { NormalizedBlockOutput, BlockLog }

export interface PricingInfo {
  input: number
  output: number
  cachedInput?: number
  updatedAt: string
}

export interface TokenUsage {
  prompt: number
  completion: number
  total: number
}

export interface CostBreakdown {
  input: number
  output: number
  total: number
  tokens: TokenUsage
  model: string
  pricing: PricingInfo
}

export interface ToolCall {
  name: string
  duration: number
  startTime: string
  endTime: string
  status: 'success' | 'error'
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  error?: string
}

export type BlockInputData = Record<string, any>
export type BlockOutputData = NormalizedBlockOutput | null

export interface ExecutionEnvironment {
  variables: Record<string, string>
  workflowId: string
  executionId: string
  userId: string
  workspaceId: string
}

export interface ExecutionTrigger {
  type: 'api' | 'webhook' | 'schedule' | 'manual' | 'chat' | string
  source: string
  data?: Record<string, unknown>
  timestamp: string
}

export interface ExecutionStatus {
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: string
  endedAt?: string
  durationMs?: number
}

export interface WorkflowExecutionSnapshot {
  id: string
  workflowId: string
  stateHash: string
  stateData: WorkflowState
  createdAt: string
}

export type WorkflowExecutionSnapshotInsert = Omit<WorkflowExecutionSnapshot, 'createdAt'>
export type WorkflowExecutionSnapshotSelect = WorkflowExecutionSnapshot

export interface WorkflowExecutionLog {
  id: string
  workflowId: string
  executionId: string
  stateSnapshotId: string
  level: 'info' | 'error'
  trigger: ExecutionTrigger['type']
  startedAt: string
  endedAt: string
  totalDurationMs: number
  files?: Array<{
    id: string
    name: string
    size: number
    type: string
    url: string
    key: string
  }>
  // Execution details
  executionData: {
    environment?: ExecutionEnvironment
    trigger?: ExecutionTrigger
    traceSpans?: TraceSpan[]
    errorDetails?: {
      blockId: string
      blockName: string
      error: string
      stackTrace?: string
    }
  }
  // Top-level cost information
  cost?: {
    input?: number
    output?: number
    total?: number
    tokens?: { prompt?: number; completion?: number; total?: number }
    models?: Record<
      string,
      {
        input?: number
        output?: number
        total?: number
        tokens?: { prompt?: number; completion?: number; total?: number }
      }
    >
  }
  duration?: string
  createdAt: string
}

export type WorkflowExecutionLogInsert = Omit<WorkflowExecutionLog, 'id' | 'createdAt'>
export type WorkflowExecutionLogSelect = WorkflowExecutionLog

export interface TokenInfo {
  input?: number
  output?: number
  total?: number
  prompt?: number
  completion?: number
}

export interface ProviderTiming {
  duration: number
  startTime: string
  endTime: string
  segments: Array<{
    type: string
    name?: string
    startTime: string | number
    endTime: string | number
    duration: number
  }>
}

export interface TraceSpan {
  id: string
  name: string
  type: string
  duration: number
  startTime: string
  endTime: string
  children?: TraceSpan[]
  toolCalls?: ToolCall[]
  status?: 'success' | 'error'
  tokens?: number | TokenInfo
  relativeStartMs?: number
  blockId?: string
  input?: Record<string, unknown>
  output?: Record<string, unknown>
  model?: string
  cost?: {
    input?: number
    output?: number
    total?: number
  }
  providerTiming?: ProviderTiming
  loopId?: string
  parallelId?: string
  iterationIndex?: number
}

export interface WorkflowExecutionSummary {
  id: string
  workflowId: string
  workflowName: string
  executionId: string
  trigger: ExecutionTrigger['type']
  status: ExecutionStatus['status']
  startedAt: string
  endedAt: string
  durationMs: number

  costSummary: {
    total: number
    inputCost: number
    outputCost: number
    tokens: number
  }
  stateSnapshotId: string
  errorSummary?: {
    blockId: string
    blockName: string
    message: string
  }
}

export interface WorkflowExecutionDetail extends WorkflowExecutionSummary {
  environment: ExecutionEnvironment
  triggerData: ExecutionTrigger
  blockExecutions: BlockExecutionSummary[]
  traceSpans: TraceSpan[]
  workflowState: WorkflowState
}

export interface BlockExecutionSummary {
  id: string
  blockId: string
  blockName: string
  blockType: string
  startedAt: string
  endedAt: string
  durationMs: number
  status: 'success' | 'error' | 'skipped'
  errorMessage?: string
  cost?: CostBreakdown
  inputSummary: {
    parameterCount: number
    hasComplexData: boolean
  }
  outputSummary: {
    hasOutput: boolean
    outputType: string
    hasError: boolean
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export type WorkflowExecutionsResponse = PaginatedResponse<WorkflowExecutionSummary>
export type BlockExecutionsResponse = PaginatedResponse<BlockExecutionSummary>

export interface WorkflowExecutionFilters {
  workflowIds?: string[]
  folderIds?: string[]
  triggers?: ExecutionTrigger['type'][]
  status?: ExecutionStatus['status'][]
  startDate?: string
  endDate?: string
  search?: string
  minDuration?: number
  maxDuration?: number
  minCost?: number
  maxCost?: number
  hasErrors?: boolean
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: 'startedAt' | 'durationMs' | 'totalCost' | 'blockCount'
  sortOrder?: 'asc' | 'desc'
}

export interface LogsQueryParams extends WorkflowExecutionFilters, PaginationParams {
  includeBlockSummary?: boolean
  includeWorkflowState?: boolean
}

export interface LogsError {
  code: 'EXECUTION_NOT_FOUND' | 'SNAPSHOT_NOT_FOUND' | 'INVALID_WORKFLOW_STATE' | 'STORAGE_ERROR'
  message: string
  details?: Record<string, unknown>
}

export interface ValidationError {
  field: string
  message: string
  value: unknown
}

export class LogsServiceError extends Error {
  public code: LogsError['code']
  public details?: Record<string, unknown>

  constructor(message: string, code: LogsError['code'], details?: Record<string, unknown>) {
    super(message)
    this.name = 'LogsServiceError'
    this.code = code
    this.details = details
  }
}

export interface DatabaseOperationResult<T> {
  success: boolean
  data?: T
  error?: LogsServiceError
}

export interface BatchInsertResult<T> {
  inserted: T[]
  failed: Array<{
    item: T
    error: string
  }>
  totalAttempted: number
  totalSucceeded: number
  totalFailed: number
}

export interface SnapshotService {
  createSnapshot(workflowId: string, state: WorkflowState): Promise<WorkflowExecutionSnapshot>
  getSnapshot(id: string): Promise<WorkflowExecutionSnapshot | null>
  getSnapshotByHash(workflowId: string, hash: string): Promise<WorkflowExecutionSnapshot | null>
  computeStateHash(state: WorkflowState): string
  cleanupOrphanedSnapshots(olderThanDays: number): Promise<number>
}

export interface SnapshotCreationResult {
  snapshot: WorkflowExecutionSnapshot
  isNew: boolean
}

export interface ExecutionLoggerService {
  startWorkflowExecution(params: {
    workflowId: string
    executionId: string
    trigger: ExecutionTrigger
    environment: ExecutionEnvironment
    workflowState: WorkflowState
  }): Promise<{
    workflowLog: WorkflowExecutionLog
    snapshot: WorkflowExecutionSnapshot
  }>

  completeWorkflowExecution(params: {
    executionId: string
    endedAt: string
    totalDurationMs: number

    costSummary: {
      totalCost: number
      totalInputCost: number
      totalOutputCost: number
      totalTokens: number
    }
    finalOutput: BlockOutputData
    traceSpans?: TraceSpan[]
  }): Promise<WorkflowExecutionLog>
}
```

--------------------------------------------------------------------------------

---[FILE: logger.ts]---
Location: sim-main/apps/sim/lib/logs/console/logger.ts

```typescript
/**
 * logger.ts
 *
 * This module provides standardized console logging utilities for internal application logging.
 * It is separate from the user-facing logging system in logging.ts.
 */
import chalk from 'chalk'
import { env } from '@/lib/core/config/env'

/**
 * LogLevel enum defines the severity levels for logging
 *
 * DEBUG: Detailed information, typically useful only for diagnosing problems
 *        These logs are only shown in development environment
 *
 * INFO: Confirmation that things are working as expected
 *       These logs are shown in both development and production environments
 *
 * WARN: Indication that something unexpected happened, or may happen in the near future
 *       The application can still continue working as expected
 *
 * ERROR: Error events that might still allow the application to continue running
 *        These should be investigated and fixed
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Get the minimum log level from environment variable or use defaults
 * - Development: DEBUG (show all logs)
 * - Production: ERROR (only show errors, but can be overridden by LOG_LEVEL env var)
 * - Test: ERROR (only show errors in tests)
 */
const getMinLogLevel = (): LogLevel => {
  if (env.LOG_LEVEL) {
    return env.LOG_LEVEL as LogLevel
  }

  const ENV = (env.NODE_ENV || 'development') as string
  switch (ENV) {
    case 'development':
      return LogLevel.DEBUG
    case 'production':
      return LogLevel.ERROR
    case 'test':
      return LogLevel.ERROR
    default:
      return LogLevel.DEBUG
  }
}

/**
 * Configuration for different environments
 *
 * enabled: Whether logging is enabled at all
 * minLevel: The minimum log level that will be displayed
 *          (e.g., INFO will show INFO, WARN, and ERROR, but not DEBUG)
 * colorize: Whether to apply color formatting to logs
 */
const LOG_CONFIG = {
  development: {
    enabled: true,
    minLevel: getMinLogLevel(),
    colorize: true,
  },
  production: {
    enabled: true, // Will be checked at runtime
    minLevel: getMinLogLevel(),
    colorize: false,
  },
  test: {
    enabled: false, // Disable logs in test environment
    minLevel: getMinLogLevel(),
    colorize: false,
  },
}

// Get current environment
const ENV = (env.NODE_ENV || 'development') as keyof typeof LOG_CONFIG
const config = LOG_CONFIG[ENV] || LOG_CONFIG.development

// Format objects for logging
const formatObject = (obj: any): string => {
  try {
    if (obj instanceof Error) {
      return JSON.stringify(
        {
          message: obj.message,
          stack: ENV === 'development' ? obj.stack : undefined,
          ...(obj as any),
        },
        null,
        ENV === 'development' ? 2 : 0
      )
    }
    return JSON.stringify(obj, null, ENV === 'development' ? 2 : 0)
  } catch (_error) {
    return '[Circular or Non-Serializable Object]'
  }
}

/**
 * Logger class for standardized console logging
 *
 * This class provides methods for logging at different severity levels
 * and handles formatting, colorization, and environment-specific behavior.
 */
export class Logger {
  private module: string

  /**
   * Create a new logger for a specific module
   * @param module The name of the module (e.g., 'OpenAIProvider', 'AgentBlockHandler')
   */
  constructor(module: string) {
    this.module = module
  }

  /**
   * Determines if a log at the given level should be displayed
   * based on the current environment configuration
   *
   * @param level The log level to check
   * @returns boolean indicating whether the log should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    if (!config.enabled) return false

    // In production, only log on server-side (where window is undefined)
    if (ENV === 'production' && typeof window !== 'undefined') {
      return false
    }

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const minLevelIndex = levels.indexOf(config.minLevel)
    const currentLevelIndex = levels.indexOf(level)

    return currentLevelIndex >= minLevelIndex
  }

  /**
   * Format arguments for logging, converting objects to JSON strings
   *
   * @param args Arguments to format
   * @returns Formatted arguments
   */
  private formatArgs(args: any[]): any[] {
    return args.map((arg) => {
      if (arg === null || arg === undefined) return arg
      if (typeof arg === 'object') return formatObject(arg)
      return arg
    })
  }

  /**
   * Internal method to log a message with the specified level
   *
   * @param level The severity level of the log
   * @param message The main log message
   * @param args Additional arguments to log
   */
  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const formattedArgs = this.formatArgs(args)

    // Color configuration
    if (config.colorize) {
      let levelColor
      const moduleColor = chalk.cyan
      const timestampColor = chalk.gray

      switch (level) {
        case LogLevel.DEBUG:
          levelColor = chalk.blue
          break
        case LogLevel.INFO:
          levelColor = chalk.green
          break
        case LogLevel.WARN:
          levelColor = chalk.yellow
          break
        case LogLevel.ERROR:
          levelColor = chalk.red
          break
      }

      const coloredPrefix = `${timestampColor(`[${timestamp}]`)} ${levelColor(`[${level}]`)} ${moduleColor(`[${this.module}]`)}`

      if (level === LogLevel.ERROR) {
        console.error(coloredPrefix, message, ...formattedArgs)
      } else {
        console.log(coloredPrefix, message, ...formattedArgs)
      }
    } else {
      // No colors in production
      const prefix = `[${timestamp}] [${level}] [${this.module}]`

      if (level === LogLevel.ERROR) {
        console.error(prefix, message, ...formattedArgs)
      } else {
        console.log(prefix, message, ...formattedArgs)
      }
    }
  }

  /**
   * Log a debug message
   *
   * Use for detailed information useful during development and debugging.
   * These logs are only shown in development environment.
   *
   * Examples:
   * - Variable values during execution
   * - Function entry/exit points
   * - Detailed request/response data
   *
   * @param message The message to log
   * @param args Additional arguments to log
   */
  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  /**
   * Log an info message
   *
   * Use for general information about application operation.
   * These logs are shown in both development and production environments.
   *
   * Examples:
   * - Application startup/shutdown
   * - Configuration information
   * - Successful operations
   *
   * @param message The message to log
   * @param args Additional arguments to log
   */
  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args)
  }

  /**
   * Log a warning message
   *
   * Use for potentially problematic situations that don't cause operation failure.
   *
   * Examples:
   * - Deprecated feature usage
   * - Suboptimal configurations
   * - Recoverable errors
   *
   * @param message The message to log
   * @param args Additional arguments to log
   */
  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args)
  }

  /**
   * Log an error message
   *
   * Use for error events that might still allow the application to continue.
   *
   * Examples:
   * - API call failures
   * - Operation failures
   * - Unexpected exceptions
   *
   * @param message The message to log
   * @param args Additional arguments to log
   */
  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args)
  }
}

/**
 * Create a logger for a specific module
 *
 * Usage example:
 * ```
 * import { createLogger } from '@/lib/logger'
 *
 * const logger = createLogger('MyComponent')
 *
 * logger.debug('Initializing component', { props })
 * logger.info('Component mounted')
 * logger.warn('Deprecated prop used', { propName })
 * logger.error('Failed to fetch data', error)
 * ```
 *
 * @param module The name of the module (e.g., 'OpenAIProvider', 'AgentBlockHandler')
 * @returns A Logger instance
 */
export function createLogger(module: string): Logger {
  return new Logger(module)
}
```

--------------------------------------------------------------------------------

---[FILE: logger.test.ts]---
Location: sim-main/apps/sim/lib/logs/execution/logger.test.ts

```typescript
import { beforeEach, describe, expect, test } from 'vitest'
import { ExecutionLogger } from '@/lib/logs/execution/logger'

describe('ExecutionLogger', () => {
  let logger: ExecutionLogger

  beforeEach(() => {
    logger = new ExecutionLogger()
  })

  describe('class instantiation', () => {
    test('should create logger instance', () => {
      expect(logger).toBeDefined()
      expect(logger).toBeInstanceOf(ExecutionLogger)
    })
  })
})
```

--------------------------------------------------------------------------------

````
