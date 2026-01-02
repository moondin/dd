---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 365
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 365 of 933)

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
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/notifications/components/slack-channel-selector/index.ts

```typescript
export { default, SlackChannelSelector } from './slack-channel-selector'
```

--------------------------------------------------------------------------------

---[FILE: slack-channel-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/notifications/components/slack-channel-selector/slack-channel-selector.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Hash, Lock } from 'lucide-react'
import { Combobox, type ComboboxOption } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('SlackChannelSelector')

interface SlackChannel {
  id: string
  name: string
  isPrivate: boolean
}

interface SlackChannelSelectorProps {
  accountId: string
  value: string
  onChange: (channelId: string, channelName: string) => void
  disabled?: boolean
  error?: string
}

/**
 * Standalone Slack channel selector that fetches channels for a given account.
 */
export function SlackChannelSelector({
  accountId,
  value,
  onChange,
  disabled = false,
  error,
}: SlackChannelSelectorProps) {
  const [channels, setChannels] = useState<SlackChannel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchChannels = useCallback(async () => {
    if (!accountId) {
      setChannels([])
      return
    }

    setIsLoading(true)
    setFetchError(null)

    try {
      const response = await fetch('/api/tools/slack/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: accountId }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch channels')
      }

      const data = await response.json()
      setChannels(data.channels || [])
    } catch (err) {
      logger.error('Failed to fetch Slack channels', { error: err })
      setFetchError(err instanceof Error ? err.message : 'Failed to fetch channels')
      setChannels([])
    } finally {
      setIsLoading(false)
    }
  }, [accountId])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  const options: ComboboxOption[] = channels.map((channel) => ({
    label: channel.name,
    value: channel.id,
    icon: channel.isPrivate ? Lock : Hash,
  }))

  const selectedChannel = channels.find((c) => c.id === value)

  if (!accountId) {
    return (
      <div className='rounded-[6px] border bg-[var(--surface-3)] p-[10px] text-center'>
        <p className='text-[12px] text-[var(--text-muted)]'>Select a Slack account first</p>
      </div>
    )
  }

  const handleChange = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId)
    onChange(channelId, channel?.name || '')
  }

  return (
    <div className='flex flex-col gap-[4px]'>
      <Combobox
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={
          channels.length === 0 && !isLoading ? 'No channels available' : 'Select channel...'
        }
        disabled={disabled || channels.length === 0}
        isLoading={isLoading}
        error={fetchError}
      />
      {selectedChannel && !fetchError && (
        <p className='text-[12px] text-[var(--text-muted)]'>
          {selectedChannel.isPrivate ? 'Private' : 'Public'} channel: #{selectedChannel.name}
        </p>
      )}
      {error && <p className='text-[11px] text-[var(--text-error)]'>{error}</p>}
    </div>
  )
}

export default SlackChannelSelector
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/notifications/components/workflow-selector/index.ts

```typescript
export { default, WorkflowSelector } from './workflow-selector'
```

--------------------------------------------------------------------------------

---[FILE: workflow-selector.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/notifications/components/workflow-selector/workflow-selector.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { Badge, Combobox, type ComboboxOption } from '@/components/emcn'
import { Skeleton } from '@/components/ui'

interface WorkflowSelectorProps {
  workspaceId: string
  selectedIds: string[]
  allWorkflows: boolean
  onChange: (ids: string[], allWorkflows: boolean) => void
  error?: string
}

/**
 * Multi-select workflow selector with "All Workflows" option.
 * Uses Combobox's built-in showAllOption for the "All Workflows" selection.
 * When allWorkflows is true, the array is empty and "All Workflows" is selected.
 */
export function WorkflowSelector({
  workspaceId,
  selectedIds,
  allWorkflows,
  onChange,
  error,
}: WorkflowSelectorProps) {
  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workflows?workspaceId=${workspaceId}`)
        if (response.ok) {
          const data = await response.json()
          setWorkflows(data.data || [])
        }
      } catch {
        setWorkflows([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [workspaceId])

  const options: ComboboxOption[] = useMemo(() => {
    return workflows.map((w) => ({
      label: w.name,
      value: w.id,
    }))
  }, [workflows])

  /**
   * When allWorkflows is true, pass empty array so the "All" option is selected.
   * Otherwise, pass the selected workflow IDs.
   */
  const currentValues = useMemo(() => {
    return allWorkflows ? [] : selectedIds
  }, [allWorkflows, selectedIds])

  /**
   * Handle multi-select changes from Combobox.
   * Empty array from showAllOption = all workflows selected.
   */
  const handleMultiSelectChange = (values: string[]) => {
    if (values.length === 0) {
      onChange([], true)
    } else {
      onChange(values, false)
    }
  }

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(
      selectedIds.filter((i) => i !== id),
      false
    )
  }

  const selectedWorkflows = useMemo(() => {
    return workflows.filter((w) => selectedIds.includes(w.id))
  }, [workflows, selectedIds])

  const overlayContent = useMemo(() => {
    if (allWorkflows) {
      return <span className='truncate text-[var(--text-primary)]'>All Workflows</span>
    }

    if (selectedWorkflows.length === 0) {
      return null
    }

    return (
      <div className='flex items-center gap-[4px] overflow-hidden'>
        {selectedWorkflows.slice(0, 2).map((w) => (
          <Badge
            key={w.id}
            variant='outline'
            className='pointer-events-auto cursor-pointer gap-[4px] rounded-[6px] px-[8px] py-[2px] text-[11px]'
            onMouseDown={(e) => handleRemove(e, w.id)}
          >
            {w.name}
            <X className='h-3 w-3' />
          </Badge>
        ))}
        {selectedWorkflows.length > 2 && (
          <Badge variant='outline' className='rounded-[6px] px-[8px] py-[2px] text-[11px]'>
            +{selectedWorkflows.length - 2}
          </Badge>
        )}
      </div>
    )
  }, [allWorkflows, selectedWorkflows, selectedIds])

  if (isLoading) {
    return (
      <div className='flex flex-col gap-[4px]'>
        <span className='font-medium text-[13px] text-[var(--text-secondary)]'>Workflows</span>
        <Skeleton className='h-[34px] w-full rounded-[6px]' />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-[4px]'>
      <span className='font-medium text-[13px] text-[var(--text-secondary)]'>Workflows</span>
      <Combobox
        options={options}
        multiSelect
        multiSelectValues={currentValues}
        onMultiSelectChange={handleMultiSelectChange}
        placeholder='Select workflows...'
        error={error}
        overlayContent={overlayContent}
        searchable
        searchPlaceholder='Search workflows...'
        showAllOption
        allOptionLabel='All Workflows'
      />
    </div>
  )
}

export default WorkflowSelector
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/search/index.ts

```typescript
export { AutocompleteSearch } from './search'
```

--------------------------------------------------------------------------------

---[FILE: search.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/search/search.tsx
Signals: React

```typescript
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Badge, Popover, PopoverAnchor, PopoverContent } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { getTriggerOptions } from '@/lib/logs/get-trigger-options'
import { type ParsedFilter, parseQuery } from '@/lib/logs/query-parser'
import {
  type FolderData,
  SearchSuggestions,
  type TriggerData,
  type WorkflowData,
} from '@/lib/logs/search-suggestions'
import { useSearchState } from '@/app/workspace/[workspaceId]/logs/hooks/use-search-state'
import { useFolderStore } from '@/stores/folders/store'
import { useWorkflowRegistry } from '@/stores/workflows/registry/store'

function truncateFilterValue(field: string, value: string): string {
  if ((field === 'executionId' || field === 'workflowId') && value.length > 12) {
    return `...${value.slice(-6)}`
  }
  if (value.length > 20) {
    return `${value.slice(0, 17)}...`
  }
  return value
}

interface AutocompleteSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onOpenChange?: (open: boolean) => void
}

export function AutocompleteSearch({
  value,
  onChange,
  placeholder = 'Search',
  className,
  onOpenChange,
}: AutocompleteSearchProps) {
  const workflows = useWorkflowRegistry((state) => state.workflows)
  const folders = useFolderStore((state) => state.folders)

  const workflowsData = useMemo<WorkflowData[]>(() => {
    return Object.values(workflows).map((w) => ({
      id: w.id,
      name: w.name,
      description: w.description,
    }))
  }, [workflows])

  const foldersData = useMemo<FolderData[]>(() => {
    return Object.values(folders).map((f) => ({
      id: f.id,
      name: f.name,
    }))
  }, [folders])

  const triggersData = useMemo<TriggerData[]>(() => {
    return getTriggerOptions().map((t) => ({
      value: t.value,
      label: t.label,
      color: t.color,
    }))
  }, [])

  const suggestionEngine = useMemo(() => {
    return new SearchSuggestions(workflowsData, foldersData, triggersData)
  }, [workflowsData, foldersData, triggersData])

  const handleFiltersChange = (filters: ParsedFilter[], textSearch: string) => {
    const filterStrings = filters.map(
      (f) => `${f.field}:${f.operator !== '=' ? f.operator : ''}${f.originalValue}`
    )
    const fullQuery = [...filterStrings, textSearch].filter(Boolean).join(' ')
    onChange(fullQuery)
  }

  const {
    appliedFilters,
    currentInput,
    textSearch,
    isOpen,
    suggestions,
    sections,
    highlightedIndex,
    inputRef,
    dropdownRef,
    handleInputChange,
    handleSuggestionSelect,
    handleKeyDown,
    handleFocus,
    handleBlur,
    removeBadge,
    clearAll,
    setHighlightedIndex,
    initializeFromQuery,
  } = useSearchState({
    onFiltersChange: handleFiltersChange,
    getSuggestions: (input) => suggestionEngine.getSuggestions(input),
  })

  const lastExternalValue = useRef(value)
  useEffect(() => {
    if (value !== lastExternalValue.current) {
      lastExternalValue.current = value
      const parsed = parseQuery(value)
      initializeFromQuery(parsed.textSearch, parsed.filters)
    }
  }, [value, initializeFromQuery])

  useEffect(() => {
    if (value) {
      const parsed = parseQuery(value)
      initializeFromQuery(parsed.textSearch, parsed.filters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [dropdownWidth, setDropdownWidth] = useState(400)
  useEffect(() => {
    const measure = () => {
      if (inputRef.current) {
        setDropdownWidth(inputRef.current.parentElement?.offsetWidth || 400)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    onOpenChange?.(isOpen)
  }, [isOpen, onOpenChange])

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return
    const container = dropdownRef.current
    const optionEl = container?.querySelector(`[data-index="${highlightedIndex}"]`)
    if (container && optionEl) {
      optionEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isOpen, highlightedIndex])

  const hasFilters = appliedFilters.length > 0
  const hasTextSearch = textSearch.length > 0
  const suggestionType =
    sections.length > 0 ? 'multi-section' : suggestions.length > 0 ? suggestions[0]?.category : null

  return (
    <div className={cn('relative', className)}>
      {/* Search Input with Inline Badges */}
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setHighlightedIndex(-1)
          }
        }}
      >
        <PopoverAnchor asChild>
          <div className='relative flex h-[32px] w-[400px] items-center rounded-[8px] bg-[var(--surface-5)]'>
            {/* Search Icon */}
            <Search className='mr-[6px] ml-[8px] h-[14px] w-[14px] flex-shrink-0 text-[var(--text-subtle)]' />

            {/* Scrollable container for badges */}
            <div className='flex flex-1 items-center gap-[6px] overflow-x-auto pr-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              {/* Applied Filter Badges */}
              {appliedFilters.map((filter, index) => (
                <Badge
                  key={`${filter.field}-${filter.value}-${index}`}
                  variant='outline'
                  role='button'
                  tabIndex={0}
                  className='h-6 shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2 text-[11px]'
                  onClick={() => removeBadge(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      removeBadge(index)
                    }
                  }}
                >
                  <span className='text-[var(--text-muted)]'>{filter.field}:</span>
                  <span className='text-[var(--text-primary)]'>
                    {filter.operator !== '=' && filter.operator}
                    {truncateFilterValue(filter.field, filter.originalValue)}
                  </span>
                  <X className='h-3 w-3 shrink-0' />
                </Badge>
              ))}

              {/* Text Search Badge (if present) */}
              {hasTextSearch && (
                <Badge
                  variant='outline'
                  role='button'
                  tabIndex={0}
                  className='h-6 shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2 text-[11px]'
                  onClick={() => handleFiltersChange(appliedFilters, '')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleFiltersChange(appliedFilters, '')
                    }
                  }}
                >
                  <span className='max-w-[150px] truncate text-[var(--text-primary)]'>
                    "{textSearch}"
                  </span>
                  <X className='h-3 w-3 shrink-0' />
                </Badge>
              )}

              {/* Input - only current typing */}
              <input
                ref={inputRef}
                type='text'
                placeholder={hasFilters || hasTextSearch ? '' : placeholder}
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className='min-w-[80px] flex-1 border-0 bg-transparent px-0 font-medium text-[var(--text-secondary)] text-small leading-none outline-none placeholder:text-[var(--text-subtle)] focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm'
              />
            </div>

            {/* Clear All Button */}
            {(hasFilters || hasTextSearch) && (
              <button
                type='button'
                className='mr-[8px] ml-[6px] flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center text-[var(--text-subtle)] transition-colors hover:text-[var(--text-secondary)]'
                onClick={clearAll}
              >
                <X className='h-[14px] w-[14px]' />
              </button>
            )}
          </div>
        </PopoverAnchor>

        {/* Dropdown */}
        <PopoverContent
          ref={dropdownRef}
          className='p-0'
          style={{ width: dropdownWidth }}
          align='start'
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className='max-h-96 overflow-y-auto px-1'>
            {sections.length > 0 ? (
              <div className='py-1'>
                {/* Show all results (no header) */}
                {suggestions[0]?.category === 'show-all' && (
                  <button
                    key={suggestions[0].id}
                    data-index={0}
                    className={cn(
                      'w-full rounded-[6px] px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]',
                      'hover:bg-[var(--surface-9)]',
                      highlightedIndex === 0 && 'bg-[var(--surface-9)]'
                    )}
                    onMouseEnter={() => setHighlightedIndex(0)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSuggestionSelect(suggestions[0])
                    }}
                  >
                    <div className='text-[13px]'>{suggestions[0].label}</div>
                  </button>
                )}

                {sections.map((section) => (
                  <div key={section.title}>
                    <div className='px-3 py-1.5 font-medium text-[12px] text-[var(--text-tertiary)] uppercase tracking-wide'>
                      {section.title}
                    </div>
                    {section.suggestions.map((suggestion) => {
                      if (suggestion.category === 'show-all') return null

                      const index = suggestions.indexOf(suggestion)
                      const isHighlighted = index === highlightedIndex

                      return (
                        <button
                          key={suggestion.id}
                          data-index={index}
                          className={cn(
                            'w-full rounded-[6px] px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]',
                            'hover:bg-[var(--surface-9)]',
                            isHighlighted && 'bg-[var(--surface-9)]'
                          )}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            handleSuggestionSelect(suggestion)
                          }}
                        >
                          <div className='flex items-center justify-between gap-3'>
                            <div className='min-w-0 flex-1 truncate text-[13px]'>
                              {suggestion.label}
                            </div>
                            {suggestion.value !== suggestion.label && (
                              <div className='shrink-0 font-mono text-[11px] text-[var(--text-muted)]'>
                                {suggestion.category === 'workflow' ||
                                suggestion.category === 'folder'
                                  ? `${suggestion.category}:`
                                  : ''}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              // Single section layout
              <div className='py-1'>
                {suggestionType === 'filters' && (
                  <div className='px-3 py-1.5 font-medium text-[12px] text-[var(--text-tertiary)] uppercase tracking-wide'>
                    SUGGESTED FILTERS
                  </div>
                )}

                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    data-index={index}
                    className={cn(
                      'w-full rounded-[6px] px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)]',
                      'hover:bg-[var(--surface-9)]',
                      index === highlightedIndex && 'bg-[var(--surface-9)]'
                    )}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSuggestionSelect(suggestion)
                    }}
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <div className='min-w-0 flex-1 text-[13px]'>{suggestion.label}</div>
                      {suggestion.description && (
                        <div className='shrink-0 text-[11px] text-[var(--text-muted)]'>
                          {suggestion.value}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/hooks/index.ts

```typescript
export { useLogDetailsResize } from './use-log-details-resize'
export { useSearchState } from './use-search-state'
```

--------------------------------------------------------------------------------

---[FILE: use-log-details-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/hooks/use-log-details-resize.ts
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { MIN_LOG_DETAILS_WIDTH, useLogDetailsUIStore } from '@/stores/logs/store'

/**
 * Hook for handling log details panel resize via mouse drag.
 * @returns Resize state and mouse event handler.
 */
export function useLogDetailsResize() {
  const setPanelWidth = useLogDetailsUIStore((state) => state.setPanelWidth)
  const setIsResizing = useLogDetailsUIStore((state) => state.setIsResizing)
  const [isResizing, setLocalIsResizing] = useState(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setLocalIsResizing(true)
      setIsResizing(true)
    },
    [setIsResizing]
  )

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new width from right edge of window
      const newWidth = window.innerWidth - e.clientX
      const maxWidth = window.innerWidth * 0.5 // 50vw
      const clampedWidth = Math.max(MIN_LOG_DETAILS_WIDTH, Math.min(newWidth, maxWidth))

      setPanelWidth(clampedWidth)
    }

    const handleMouseUp = () => {
      setLocalIsResizing(false)
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, setPanelWidth, setIsResizing])

  return {
    isResizing,
    handleMouseDown,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-search-state.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/hooks/use-search-state.ts
Signals: React

```typescript
import { useCallback, useRef, useState } from 'react'
import type { ParsedFilter } from '@/lib/logs/query-parser'
import type {
  Suggestion,
  SuggestionGroup,
  SuggestionSection,
} from '@/app/workspace/[workspaceId]/logs/types'

interface UseSearchStateOptions {
  onFiltersChange: (filters: ParsedFilter[], textSearch: string) => void
  getSuggestions: (input: string) => SuggestionGroup | null
  debounceMs?: number
}

export function useSearchState({
  onFiltersChange,
  getSuggestions,
  debounceMs = 100,
}: UseSearchStateOptions) {
  const [appliedFilters, setAppliedFilters] = useState<ParsedFilter[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [textSearch, setTextSearch] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [sections, setSections] = useState<SuggestionSection[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const updateSuggestions = useCallback(
    (input: string) => {
      const suggestionGroup = getSuggestions(input)

      if (suggestionGroup && suggestionGroup.suggestions.length > 0) {
        setSuggestions(suggestionGroup.suggestions)
        setSections(suggestionGroup.sections || [])
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setIsOpen(false)
        setSuggestions([])
        setSections([])
        setHighlightedIndex(-1)
      }
    },
    [getSuggestions]
  )

  const handleInputChange = useCallback(
    (value: string) => {
      setCurrentInput(value)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        updateSuggestions(value)
      }, debounceMs)
    },
    [updateSuggestions, debounceMs]
  )

  const handleSuggestionSelect = useCallback(
    (suggestion: Suggestion) => {
      if (suggestion.category === 'show-all') {
        setTextSearch(suggestion.value)
        setCurrentInput('')
        setIsOpen(false)
        onFiltersChange(appliedFilters, suggestion.value)
        return
      }

      if (suggestion.category === 'filters' && suggestion.value.endsWith(':')) {
        setCurrentInput(suggestion.value)
        updateSuggestions(suggestion.value)
        return
      }

      const newFilter: ParsedFilter = {
        field: suggestion.value.split(':')[0] as any,
        operator: '=',
        value: suggestion.value.includes(':')
          ? suggestion.value.split(':').slice(1).join(':').replace(/"/g, '')
          : suggestion.value.replace(/"/g, ''),
        originalValue: suggestion.value.includes(':')
          ? suggestion.value.split(':').slice(1).join(':')
          : suggestion.value,
      }

      const updatedFilters = [...appliedFilters, newFilter]
      setAppliedFilters(updatedFilters)
      setCurrentInput('')
      setTextSearch('')

      onFiltersChange(updatedFilters, '')

      if (inputRef.current) {
        inputRef.current.focus()
      }

      setTimeout(() => {
        updateSuggestions('')
      }, 50)
    },
    [appliedFilters, onFiltersChange, updateSuggestions]
  )

  const removeBadge = useCallback(
    (index: number) => {
      const updatedFilters = appliedFilters.filter((_, i) => i !== index)
      setAppliedFilters(updatedFilters)
      onFiltersChange(updatedFilters, textSearch)

      if (inputRef.current) {
        inputRef.current.focus()
      }
    },
    [appliedFilters, textSearch, onFiltersChange]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Backspace' && currentInput === '') {
        if (appliedFilters.length > 0) {
          event.preventDefault()
          removeBadge(appliedFilters.length - 1)
        }
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()

        if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionSelect(suggestions[highlightedIndex])
        } else if (currentInput.trim()) {
          setTextSearch(currentInput.trim())
          setCurrentInput('')
          setIsOpen(false)
          onFiltersChange(appliedFilters, currentInput.trim())
        }
        return
      }

      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault()
          setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
          break
        }

        case 'ArrowUp': {
          event.preventDefault()
          setHighlightedIndex((prev) => Math.max(prev - 1, 0))
          break
        }

        case 'Escape': {
          event.preventDefault()
          setIsOpen(false)
          setHighlightedIndex(-1)
          break
        }

        case 'Tab': {
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            event.preventDefault()
            handleSuggestionSelect(suggestions[highlightedIndex])
          }
          break
        }
      }
    },
    [
      currentInput,
      appliedFilters,
      isOpen,
      highlightedIndex,
      suggestions,
      handleSuggestionSelect,
      removeBadge,
      onFiltersChange,
    ]
  )

  const handleFocus = useCallback(() => {
    updateSuggestions(currentInput)
  }, [currentInput, updateSuggestions])

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }, 150)
  }, [])

  const clearAll = useCallback(() => {
    setAppliedFilters([])
    setCurrentInput('')
    setTextSearch('')
    setIsOpen(false)
    onFiltersChange([], '')

    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [onFiltersChange])

  const initializeFromQuery = useCallback((query: string, filters: ParsedFilter[]) => {
    setAppliedFilters(filters)
    setTextSearch(query)
    setCurrentInput('')
  }, [])

  return {
    appliedFilters,
    currentInput,
    textSearch,
    isOpen,
    suggestions,
    sections,
    highlightedIndex,

    inputRef,
    dropdownRef,

    handleInputChange,
    handleSuggestionSelect,
    handleKeyDown,
    handleFocus,
    handleBlur,
    removeBadge,
    clearAll,
    initializeFromQuery,

    setHighlightedIndex,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: global-commands-provider.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/providers/global-commands-provider.tsx
Signals: React, Next.js

```typescript
'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('GlobalCommands')

/**
 * Detects if the current platform is macOS.
 *
 * @returns True if running on macOS, false otherwise
 */
function isMacPlatform(): boolean {
  if (typeof window === 'undefined') return false
  return (
    /Mac|iPhone|iPod|iPad/i.test(navigator.platform) ||
    /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
  )
}

/**
 * Represents a parsed keyboard shortcut.
 *
 * We support the following modifiers:
 * - Mod: maps to Meta on macOS, Ctrl on other platforms
 * - Ctrl, Meta, Shift, Alt
 *
 * Examples:
 * - "Mod+A"
 * - "Mod+Shift+T"
 * - "Meta+K"
 */
export interface ParsedShortcut {
  key: string
  mod?: boolean
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
}

/**
 * Declarative command registration.
 */
export interface GlobalCommand {
  /** Unique id for the command. If omitted, one is generated. */
  id?: string
  /** Shortcut string in the form "Mod+Shift+T", "Mod+A", "Meta+K", etc. */
  shortcut: string
  /**
   * Whether to allow the command to run inside editable elements like inputs,
   * textareas or contenteditable. Defaults to true to ensure browser defaults
   * are overridden when desired.
   */
  allowInEditable?: boolean
  /**
   * Handler invoked when the shortcut is matched. Use this to trigger actions
   * like navigation or dispatching application events.
   */
  handler: (event: KeyboardEvent) => void
}

interface RegistryCommand extends GlobalCommand {
  id: string
  parsed: ParsedShortcut
}

interface GlobalCommandsContextValue {
  register: (commands: GlobalCommand[]) => () => void
}

const GlobalCommandsContext = createContext<GlobalCommandsContextValue | null>(null)

/**
 * Parses a human-readable shortcut into a structured representation.
 */
function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.split('+').map((p) => p.trim())
  const modifiers = new Set(parts.slice(0, -1).map((p) => p.toLowerCase()))
  const last = parts[parts.length - 1]

  return {
    key: last.length === 1 ? last.toLowerCase() : last, // keep non-letter keys verbatim
    mod: modifiers.has('mod'),
    ctrl: modifiers.has('ctrl'),
    meta: modifiers.has('meta') || modifiers.has('cmd') || modifiers.has('command'),
    shift: modifiers.has('shift'),
    alt: modifiers.has('alt') || modifiers.has('option'),
  }
}

/**
 * Checks if a KeyboardEvent matches a parsed shortcut, honoring platform-specific
 * interpretation of "Mod" (Meta on macOS, Ctrl elsewhere).
 */
function matchesShortcut(e: KeyboardEvent, parsed: ParsedShortcut): boolean {
  const isMac = isMacPlatform()
  const expectedCtrl = parsed.ctrl || (parsed.mod ? !isMac : false)
  const expectedMeta = parsed.meta || (parsed.mod ? isMac : false)

  // Normalize key for comparison: for letters compare lowercase
  const eventKey = e.key.length === 1 ? e.key.toLowerCase() : e.key

  return (
    eventKey === parsed.key &&
    !!e.ctrlKey === !!expectedCtrl &&
    !!e.metaKey === !!expectedMeta &&
    !!e.shiftKey === !!parsed.shift &&
    !!e.altKey === !!parsed.alt
  )
}

/**
 * Provider that captures global keyboard shortcuts and routes them to
 * registered commands. Commands can be registered from any descendant component.
 */
export function GlobalCommandsProvider({ children }: { children: ReactNode }) {
  const registryRef = useRef<Map<string, RegistryCommand>>(new Map())
  const isMac = useMemo(() => isMacPlatform(), [])
  const router = useRouter()

  const register = useCallback((commands: GlobalCommand[]) => {
    const createdIds: string[] = []
    for (const cmd of commands) {
      const id = cmd.id ?? crypto.randomUUID()
      const parsed = parseShortcut(cmd.shortcut)
      registryRef.current.set(id, {
        ...cmd,
        id,
        parsed,
        allowInEditable: cmd.allowInEditable ?? true,
      })
      createdIds.push(id)
      logger.info('Registered global command', { id, shortcut: cmd.shortcut })
    }

    return () => {
      for (const id of createdIds) {
        registryRef.current.delete(id)
        logger.info('Unregistered global command', { id })
      }
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return

      // Evaluate matches in registration order (latest registration wins naturally
      // due to replacement on same id). Break on first match.
      for (const [, cmd] of registryRef.current) {
        if (!cmd.allowInEditable) {
          const ae = document.activeElement
          const isEditable =
            ae instanceof HTMLInputElement ||
            ae instanceof HTMLTextAreaElement ||
            ae?.hasAttribute('contenteditable')
          if (isEditable) continue
        }

        if (matchesShortcut(e, cmd.parsed)) {
          // Always override default browser behavior for matched commands.
          e.preventDefault()
          e.stopPropagation()
          logger.info('Executing global command', {
            id: cmd.id,
            shortcut: cmd.shortcut,
            key: e.key,
            isMac,
            path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          })
          try {
            cmd.handler(e)
          } catch (err) {
            logger.error('Global command handler threw', { id: cmd.id, err })
          }
          return
        }
      }
    }

    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [isMac, router])

  const value = useMemo<GlobalCommandsContextValue>(() => ({ register }), [register])

  return <GlobalCommandsContext.Provider value={value}>{children}</GlobalCommandsContext.Provider>
}

/**
 * Registers a set of global commands for the lifetime of the component.
 *
 * Returns nothing; cleanup is automatic on unmount.
 */
export function useRegisterGlobalCommands(commands: GlobalCommand[] | (() => GlobalCommand[])) {
  const ctx = useContext(GlobalCommandsContext)
  if (!ctx) {
    throw new Error('useRegisterGlobalCommands must be used within GlobalCommandsProvider')
  }

  useEffect(() => {
    const list = typeof commands === 'function' ? commands() : commands
    const unregister = ctx.register(list)
    return unregister
    // We intentionally want to register once for the given commands
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
```

--------------------------------------------------------------------------------

````
