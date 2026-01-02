---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 363
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 363 of 933)

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

---[FILE: logs-toolbar.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/logs-toolbar.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUp, Bell, Library, Loader2, MoreHorizontal, RefreshCw } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Button,
  Combobox,
  type ComboboxOption,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverScrollArea,
  PopoverTrigger,
  Tooltip,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { getTriggerOptions } from '@/lib/logs/get-trigger-options'
import { getBlock } from '@/blocks/registry'
import { useFolderStore } from '@/stores/folders/store'
import { useFilterStore } from '@/stores/logs/filters/store'
import { AutocompleteSearch } from './components/search'

const CORE_TRIGGER_TYPES = ['manual', 'api', 'schedule', 'chat', 'webhook'] as const

const TIME_RANGE_OPTIONS: ComboboxOption[] = [
  { value: 'All time', label: 'All time' },
  { value: 'Past 30 minutes', label: 'Past 30 minutes' },
  { value: 'Past hour', label: 'Past hour' },
  { value: 'Past 6 hours', label: 'Past 6 hours' },
  { value: 'Past 12 hours', label: 'Past 12 hours' },
  { value: 'Past 24 hours', label: 'Past 24 hours' },
  { value: 'Past 3 days', label: 'Past 3 days' },
  { value: 'Past 7 days', label: 'Past 7 days' },
  { value: 'Past 14 days', label: 'Past 14 days' },
  { value: 'Past 30 days', label: 'Past 30 days' },
] as const

type ViewMode = 'logs' | 'dashboard'

interface LogsToolbarProps {
  /** Current view mode */
  viewMode: ViewMode
  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void
  /** Whether the refresh spinner is visible */
  isRefreshing: boolean
  /** Callback when refresh button is clicked */
  onRefresh: () => void
  /** Whether live mode is enabled */
  isLive: boolean
  /** Callback when live toggle is clicked */
  onToggleLive: () => void
  /** Whether export is in progress */
  isExporting: boolean
  /** Callback when export is triggered */
  onExport: () => void
  /** Whether user can edit (for export permissions) */
  canEdit: boolean
  /** Whether there are logs to export */
  hasLogs: boolean
  /** Callback when notification settings is clicked */
  onOpenNotificationSettings: () => void
  /** Search query value */
  searchQuery: string
  /** Callback when search query changes */
  onSearchQueryChange: (query: string) => void
  /** Callback when search open state changes */
  onSearchOpenChange: (open: boolean) => void
}

/** Cache for color icon components to ensure stable references across renders */
const colorIconCache = new Map<string, React.ComponentType<{ className?: string }>>()

/**
 * Returns a memoized icon component for a given color.
 * Uses a cache to ensure the same color always returns the same component reference,
 * which prevents unnecessary React reconciliation.
 * @param color - CSS color value for the icon background
 * @returns A React component that renders a colored square icon
 */
function getColorIcon(color: string): React.ComponentType<{ className?: string }> {
  const cached = colorIconCache.get(color)
  if (cached) return cached

  const ColorIcon = ({ className }: { className?: string }) => (
    <div
      className={cn(className, 'flex-shrink-0 rounded-[3px]')}
      style={{ backgroundColor: color, width: 10, height: 10 }}
    />
  )
  ColorIcon.displayName = `ColorIcon(${color})`
  colorIconCache.set(color, ColorIcon)
  return ColorIcon
}

/**
 * Returns a memoized trigger icon component for integration blocks.
 * Core trigger types (manual, api, schedule, chat, webhook) return undefined.
 * @param triggerType - The trigger type identifier
 * @returns A React component that renders the trigger icon, or undefined for core types
 */
function getTriggerIcon(
  triggerType: string
): React.ComponentType<{ className?: string }> | undefined {
  if ((CORE_TRIGGER_TYPES as readonly string[]).includes(triggerType)) return undefined

  const block = getBlock(triggerType)
  if (!block?.icon) return undefined

  const BlockIcon = block.icon
  const TriggerIcon = ({ className }: { className?: string }) => (
    <BlockIcon className={cn(className, 'flex-shrink-0')} style={{ width: 12, height: 12 }} />
  )
  TriggerIcon.displayName = `TriggerIcon(${triggerType})`
  return TriggerIcon
}

/**
 * Consolidated logs toolbar component that combines header, search, and filters.
 * Contains title, icon, view mode toggle, refresh/live controls, search bar, and filter controls.
 * @param props - The component props
 * @returns The complete logs toolbar
 */
export function LogsToolbar({
  viewMode,
  onViewModeChange,
  isRefreshing,
  onRefresh,
  isLive,
  onToggleLive,
  isExporting,
  onExport,
  canEdit,
  hasLogs,
  onOpenNotificationSettings,
  searchQuery,
  onSearchQueryChange,
  onSearchOpenChange,
}: LogsToolbarProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const {
    level,
    setLevel,
    workflowIds,
    setWorkflowIds,
    folderIds,
    setFolderIds,
    triggers,
    setTriggers,
    timeRange,
    setTimeRange,
  } = useFilterStore()
  const folders = useFolderStore((state) => state.folders)

  const [workflows, setWorkflows] = useState<Array<{ id: string; name: string; color: string }>>([])

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await fetch(`/api/workflows?workspaceId=${encodeURIComponent(workspaceId)}`)
        if (res.ok) {
          const body = await res.json()
          setWorkflows(Array.isArray(body?.data) ? body.data : [])
        }
      } catch {
        setWorkflows([])
      }
    }
    if (workspaceId) fetchWorkflows()
  }, [workspaceId])

  const folderList = useMemo(() => {
    return Object.values(folders).filter((f) => f.workspaceId === workspaceId)
  }, [folders, workspaceId])

  const isDashboardView = viewMode === 'dashboard'

  // Status filter
  const selectedStatuses = useMemo((): string[] => {
    if (level === 'all' || !level) return []
    return level.split(',').filter(Boolean)
  }, [level])

  const statusOptions: ComboboxOption[] = useMemo(
    () => [
      { value: 'error', label: 'Error', icon: getColorIcon('var(--text-error)') },
      { value: 'info', label: 'Info', icon: getColorIcon('var(--terminal-status-info-color)') },
      { value: 'running', label: 'Running', icon: getColorIcon('#22c55e') },
      { value: 'pending', label: 'Pending', icon: getColorIcon('#f59e0b') },
    ],
    []
  )

  const handleStatusChange = useCallback(
    (values: string[]) => {
      if (values.length === 0) {
        setLevel('all')
      } else {
        setLevel(values.join(',') as any)
      }
    },
    [setLevel]
  )

  const statusDisplayLabel = useMemo(() => {
    if (selectedStatuses.length === 0) return 'Status'
    if (selectedStatuses.length === 1) {
      const status = statusOptions.find((s) => s.value === selectedStatuses[0])
      return status?.label || '1 selected'
    }
    return `${selectedStatuses.length} selected`
  }, [selectedStatuses, statusOptions])

  const selectedStatusColor = useMemo(() => {
    if (selectedStatuses.length !== 1) return null
    const status = selectedStatuses[0]
    if (status === 'error') return 'var(--text-error)'
    if (status === 'info') return 'var(--terminal-status-info-color)'
    if (status === 'running') return '#22c55e'
    if (status === 'pending') return '#f59e0b'
    return null
  }, [selectedStatuses])

  // Workflow filter
  const workflowOptions: ComboboxOption[] = useMemo(
    () => workflows.map((w) => ({ value: w.id, label: w.name, icon: getColorIcon(w.color) })),
    [workflows]
  )

  const workflowDisplayLabel = useMemo(() => {
    if (workflowIds.length === 0) return 'Workflow'
    if (workflowIds.length === 1) {
      const workflow = workflows.find((w) => w.id === workflowIds[0])
      return workflow?.name || '1 selected'
    }
    return `${workflowIds.length} workflows`
  }, [workflowIds, workflows])

  const selectedWorkflow =
    workflowIds.length === 1 ? workflows.find((w) => w.id === workflowIds[0]) : null

  // Folder filter
  const folderOptions: ComboboxOption[] = useMemo(
    () => folderList.map((f) => ({ value: f.id, label: f.name })),
    [folderList]
  )

  const folderDisplayLabel = useMemo(() => {
    if (folderIds.length === 0) return 'Folder'
    if (folderIds.length === 1) {
      const folder = folderList.find((f) => f.id === folderIds[0])
      return folder?.name || '1 selected'
    }
    return `${folderIds.length} folders`
  }, [folderIds, folderList])

  // Trigger filter
  const triggerOptions: ComboboxOption[] = useMemo(
    () =>
      getTriggerOptions().map((t) => ({
        value: t.value,
        label: t.label,
        icon: getTriggerIcon(t.value),
      })),
    []
  )

  const triggerDisplayLabel = useMemo(() => {
    if (triggers.length === 0) return 'Trigger'
    if (triggers.length === 1) {
      const trigger = triggerOptions.find((t) => t.value === triggers[0])
      return trigger?.label || '1 selected'
    }
    return `${triggers.length} triggers`
  }, [triggers, triggerOptions])

  const timeDisplayLabel = useMemo(() => {
    if (timeRange === 'All time') return 'Time'
    return timeRange
  }, [timeRange])

  return (
    <div className='flex flex-col gap-[19px]'>
      {/* Header Section */}
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-[12px]'>
          <div className='flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#7A5F11] bg-[#514215]'>
            <Library className='h-[14px] w-[14px] text-[#FBBC04]' />
          </div>
          <h1 className='font-medium text-[18px]'>Logs</h1>
        </div>
        <div className='flex items-center gap-[8px]'>
          {/* More options popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='default' className='h-[32px] w-[32px] rounded-[6px] p-0'>
                <MoreHorizontal className='h-[14px] w-[14px]' />
                <span className='sr-only'>More options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' sideOffset={4}>
              <PopoverScrollArea>
                <PopoverItem onClick={onExport} disabled={!canEdit || isExporting || !hasLogs}>
                  <ArrowUp className='h-3 w-3' />
                  <span>Export as CSV</span>
                </PopoverItem>
                <PopoverItem onClick={onOpenNotificationSettings}>
                  <Bell className='h-3 w-3' />
                  <span>Configure Notifications</span>
                </PopoverItem>
              </PopoverScrollArea>
            </PopoverContent>
          </Popover>

          {/* Refresh button */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Button
                variant='default'
                className={cn('h-[32px] w-[32px] rounded-[6px] p-0', isRefreshing && 'opacity-50')}
                onClick={isRefreshing ? undefined : onRefresh}
              >
                {isRefreshing ? (
                  <Loader2 className='h-[14px] w-[14px] animate-spin' />
                ) : (
                  <RefreshCw className='h-[14px] w-[14px]' />
                )}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>{isRefreshing ? 'Refreshing...' : 'Refresh'}</Tooltip.Content>
          </Tooltip.Root>

          {/* Live button */}
          <Button
            variant={isLive ? 'primary' : 'default'}
            onClick={onToggleLive}
            className='h-[32px] rounded-[6px] px-[10px]'
          >
            Live
          </Button>

          {/* View mode toggle */}
          <div
            className='flex h-[32px] cursor-pointer items-center rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] p-[2px]'
            onClick={() => onViewModeChange(isDashboardView ? 'logs' : 'dashboard')}
          >
            <Button
              variant={!isDashboardView ? 'active' : 'ghost'}
              className='h-[26px] rounded-[4px] px-[10px]'
            >
              Logs
            </Button>
            <Button
              variant={isDashboardView ? 'active' : 'ghost'}
              className='h-[26px] rounded-[4px] px-[10px]'
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar Section */}
      <div className='flex w-full items-center gap-[12px]'>
        <div className='min-w-0 flex-1'>
          <AutocompleteSearch
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder='Search'
            onOpenChange={onSearchOpenChange}
          />
        </div>
        <div className='flex items-center gap-[8px]'>
          {/* Status Filter */}
          <Combobox
            options={statusOptions}
            multiSelect
            multiSelectValues={selectedStatuses}
            onMultiSelectChange={handleStatusChange}
            placeholder='Status'
            overlayContent={
              <span className='flex items-center gap-[6px] truncate text-[var(--text-primary)]'>
                {selectedStatusColor && (
                  <div
                    className='flex-shrink-0 rounded-[3px]'
                    style={{ backgroundColor: selectedStatusColor, width: 8, height: 8 }}
                  />
                )}
                <span className='truncate'>{statusDisplayLabel}</span>
              </span>
            }
            showAllOption
            allOptionLabel='All statuses'
            size='sm'
            align='end'
            className='h-[32px] w-[100px] rounded-[6px]'
          />

          {/* Workflow Filter */}
          <Combobox
            options={workflowOptions}
            multiSelect
            multiSelectValues={workflowIds}
            onMultiSelectChange={setWorkflowIds}
            placeholder='Workflow'
            overlayContent={
              <span className='flex items-center gap-[6px] truncate text-[var(--text-primary)]'>
                {selectedWorkflow && (
                  <div
                    className='h-[8px] w-[8px] flex-shrink-0 rounded-[2px]'
                    style={{ backgroundColor: selectedWorkflow.color }}
                  />
                )}
                <span className='truncate'>{workflowDisplayLabel}</span>
              </span>
            }
            searchable
            searchPlaceholder='Search workflows...'
            showAllOption
            allOptionLabel='All workflows'
            size='sm'
            align='end'
            className='h-[32px] w-[120px] rounded-[6px]'
          />

          {/* Folder Filter */}
          <Combobox
            options={folderOptions}
            multiSelect
            multiSelectValues={folderIds}
            onMultiSelectChange={setFolderIds}
            placeholder='Folder'
            overlayContent={
              <span className='truncate text-[var(--text-primary)]'>{folderDisplayLabel}</span>
            }
            searchable
            searchPlaceholder='Search folders...'
            showAllOption
            allOptionLabel='All folders'
            size='sm'
            align='end'
            className='h-[32px] w-[100px] rounded-[6px]'
          />

          {/* Trigger Filter */}
          <Combobox
            options={triggerOptions}
            multiSelect
            multiSelectValues={triggers}
            onMultiSelectChange={setTriggers}
            placeholder='Trigger'
            overlayContent={
              <span className='truncate text-[var(--text-primary)]'>{triggerDisplayLabel}</span>
            }
            searchable
            searchPlaceholder='Search triggers...'
            showAllOption
            allOptionLabel='All triggers'
            size='sm'
            align='end'
            className='h-[32px] w-[100px] rounded-[6px]'
          />

          {/* Timeline Filter */}
          <Combobox
            options={TIME_RANGE_OPTIONS as unknown as ComboboxOption[]}
            value={timeRange}
            onChange={(val) => setTimeRange(val as typeof timeRange)}
            placeholder='Time'
            overlayContent={
              <span className='truncate text-[var(--text-primary)]'>{timeDisplayLabel}</span>
            }
            size='sm'
            align='end'
            className='h-[32px] w-[140px] rounded-[6px]'
          />
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: controls.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/controls/controls.tsx
Signals: React

```typescript
import { type ReactNode, useState } from 'react'
import { ArrowUp, Bell, ChevronDown, Loader2, RefreshCw, Search } from 'lucide-react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverScrollArea,
  PopoverTrigger,
  Tooltip,
} from '@/components/emcn'
import { MoreHorizontal } from '@/components/emcn/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/core/utils/cn'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import { useFilterStore } from '@/stores/logs/filters/store'
import type { TimeRange } from '@/stores/logs/filters/types'

const FILTER_BUTTON_CLASS =
  'w-full justify-between rounded-[10px] border-[#E5E5E5] bg-[var(--white)] font-normal text-sm dark:border-[#414141] dark:bg-[var(--surface-elevated)]'

type TimelineProps = {
  variant?: 'default' | 'header'
}

/**
 * Timeline component for time range selection.
 * Displays a dropdown with predefined time ranges.
 * @param props - The component props
 * @returns Time range selector dropdown
 */
function Timeline({ variant = 'default' }: TimelineProps = {}) {
  const { timeRange, setTimeRange } = useFilterStore()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const specificTimeRanges: TimeRange[] = [
    'Past 30 minutes',
    'Past hour',
    'Past 6 hours',
    'Past 12 hours',
    'Past 24 hours',
    'Past 3 days',
    'Past 7 days',
    'Past 14 days',
    'Past 30 days',
  ]

  const handleTimeRangeSelect = (range: TimeRange) => {
    setTimeRange(range)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className={FILTER_BUTTON_CLASS}>
          {timeRange}
          <ChevronDown className='ml-2 h-4 w-4 text-muted-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={variant === 'header' ? 'end' : 'start'}
        side='bottom'
        sideOffset={4}
        maxHeight={144}
      >
        <PopoverScrollArea>
          <PopoverItem
            active={timeRange === 'All time'}
            showCheck
            onClick={() => handleTimeRangeSelect('All time')}
          >
            All time
          </PopoverItem>

          <div className='my-[2px] h-px bg-[var(--surface-11)]' />

          {specificTimeRanges.map((range) => (
            <PopoverItem
              key={range}
              active={timeRange === range}
              showCheck
              onClick={() => handleTimeRangeSelect(range)}
            >
              {range}
            </PopoverItem>
          ))}
        </PopoverScrollArea>
      </PopoverContent>
    </Popover>
  )
}

interface ControlsProps {
  searchQuery?: string
  setSearchQuery?: (v: string) => void
  isRefetching: boolean
  resetToNow: () => void
  live: boolean
  setLive: (v: (prev: boolean) => boolean) => void
  viewMode: string
  setViewMode: (mode: 'logs' | 'dashboard') => void
  searchComponent?: ReactNode
  showExport?: boolean
  onExport?: () => void
  canConfigureNotifications?: boolean
  onConfigureNotifications?: () => void
}

export function Controls({
  searchQuery,
  setSearchQuery,
  isRefetching,
  resetToNow,
  live,
  setLive,
  viewMode,
  setViewMode,
  searchComponent,
  onExport,
  canConfigureNotifications,
  onConfigureNotifications,
}: ControlsProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-start',
        soehne.className
      )}
    >
      {searchComponent ? (
        searchComponent
      ) : (
        <div className='relative w-full max-w-md'>
          <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-[18px] w-[18px] text-muted-foreground' />
          <Input
            type='text'
            placeholder='Search workflows...'
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            className='h-9 w-full border-[#E5E5E5] bg-[var(--white)] pr-10 pl-9 dark:border-[#414141] dark:bg-[var(--surface-elevated)]'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery?.('')}
              className='-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground hover:text-foreground'
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 16 16'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              >
                <path d='M12 4L4 12M4 4l8 8' />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className='ml-auto flex flex-shrink-0 items-center gap-3'>
        {viewMode !== 'dashboard' && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='ghost' className='h-9 w-9 p-0 hover:bg-secondary'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>More options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' sideOffset={4}>
              <PopoverScrollArea>
                <PopoverItem onClick={onExport}>
                  <ArrowUp className='h-3 w-3' />
                  <span>Export as CSV</span>
                </PopoverItem>
                <PopoverItem
                  onClick={canConfigureNotifications ? onConfigureNotifications : undefined}
                  disabled={!canConfigureNotifications}
                >
                  <Bell className='h-3 w-3' />
                  <span>Configure Notifications</span>
                </PopoverItem>
              </PopoverScrollArea>
            </PopoverContent>
          </Popover>
        )}

        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button
              variant='ghost'
              onClick={resetToNow}
              className='h-9 w-9 p-0 hover:bg-secondary'
              disabled={isRefetching}
            >
              {isRefetching ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='h-4 w-4' />
              )}
              <span className='sr-only'>Refresh</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>{isRefetching ? 'Refreshing...' : 'Refresh'}</Tooltip.Content>
        </Tooltip.Root>

        <div className='inline-flex h-9 items-center rounded-[11px] border bg-card p-1 shadow-sm'>
          <Button
            variant='ghost'
            onClick={() => setLive((v) => !v)}
            className={cn(
              'h-7 rounded-[8px] px-3 font-normal text-xs',
              live
                ? 'bg-[var(--brand-primary-hex)] text-white shadow-[0_0_0_0_var(--brand-primary-hex)] hover:bg-[var(--brand-primary-hover-hex)] hover:text-white hover:shadow-[0_0_0_4px_rgba(127,47,255,0.15)]'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={live}
          >
            Live
          </Button>
        </div>

        <div className='inline-flex h-9 items-center rounded-[11px] border bg-card p-1 shadow-sm'>
          <Button
            variant='ghost'
            onClick={() => setViewMode('logs')}
            className={cn(
              'h-7 rounded-[8px] px-3 font-normal text-xs',
              (viewMode as string) !== 'dashboard'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={(viewMode as string) !== 'dashboard'}
          >
            Logs
          </Button>
          <Button
            variant='ghost'
            onClick={() => setViewMode('dashboard')}
            className={cn(
              'h-7 rounded-[8px] px-3 font-normal text-xs',
              (viewMode as string) === 'dashboard'
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={(viewMode as string) === 'dashboard'}
          >
            Dashboard
          </Button>
        </div>
      </div>

      <div className='sm:hidden'>
        <Timeline />
      </div>
    </div>
  )
}

export default Controls
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/controls/index.ts

```typescript
export { Controls, default } from './controls'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/logs/components/logs-toolbar/components/notifications/index.ts

```typescript
export { NotificationSettings } from './notifications'
```

--------------------------------------------------------------------------------

````
