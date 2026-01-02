---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 423
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 423 of 933)

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

---[FILE: types.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/types.ts

```typescript
/**
 * Block tag group for organizing tags by block
 */
export interface BlockTagGroup {
  blockName: string
  blockId: string
  blockType: string
  tags: string[]
  distance: number
}

/**
 * Nested tag structure for hierarchical display
 */
export interface NestedTag {
  key: string
  display: string
  fullTag?: string
  parentTag?: string // Tag for the parent object when it has children
  children?: Array<{ key: string; display: string; fullTag: string }>
}

/**
 * Block tag group with nested tag structure
 */
export interface NestedBlockTagGroup extends BlockTagGroup {
  nestedTags: NestedTag[]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/components/index.ts

```typescript
export { KeyboardNavigationHandler } from './keyboard-navigation-handler'
```

--------------------------------------------------------------------------------

---[FILE: keyboard-navigation-handler.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/tag-dropdown/components/keyboard-navigation-handler.tsx
Signals: React

```typescript
import { useEffect, useMemo } from 'react'
import { usePopoverContext } from '@/components/emcn'
import type { BlockTagGroup, NestedBlockTagGroup } from '../types'

/**
 * Keyboard navigation handler component that uses popover context
 * to enable folder navigation with arrow keys
 */
interface KeyboardNavigationHandlerProps {
  visible: boolean
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  flatTagList: Array<{ tag: string; group?: BlockTagGroup }>
  nestedBlockTagGroups: NestedBlockTagGroup[]
  handleTagSelect: (tag: string, group?: BlockTagGroup) => void
}

export const KeyboardNavigationHandler: React.FC<KeyboardNavigationHandlerProps> = ({
  visible,
  selectedIndex,
  setSelectedIndex,
  flatTagList,
  nestedBlockTagGroups,
  handleTagSelect,
}) => {
  const { openFolder, closeFolder, isInFolder, currentFolder } = usePopoverContext()

  const visibleIndices = useMemo(() => {
    const indices: number[] = []

    if (isInFolder && currentFolder) {
      for (const group of nestedBlockTagGroups) {
        for (const nestedTag of group.nestedTags) {
          const folderId = `${group.blockId}-${nestedTag.key}`
          if (folderId === currentFolder && nestedTag.children) {
            // First, add the parent tag itself (so it's navigable as the first item)
            if (nestedTag.parentTag) {
              const parentIdx = flatTagList.findIndex((item) => item.tag === nestedTag.parentTag)
              if (parentIdx >= 0) {
                indices.push(parentIdx)
              }
            }
            // Then add all children
            for (const child of nestedTag.children) {
              const idx = flatTagList.findIndex((item) => item.tag === child.fullTag)
              if (idx >= 0) {
                indices.push(idx)
              }
            }
            break
          }
        }
      }
    } else {
      // We're at root level, show all non-child items
      // (variables and parent tags, but not their children)
      for (let i = 0; i < flatTagList.length; i++) {
        const tag = flatTagList[i].tag

        // Check if this is a child of a parent folder
        let isChild = false
        for (const group of nestedBlockTagGroups) {
          for (const nestedTag of group.nestedTags) {
            if (nestedTag.children) {
              for (const child of nestedTag.children) {
                if (child.fullTag === tag) {
                  isChild = true
                  break
                }
              }
            }
            if (isChild) break
          }
          if (isChild) break
        }

        if (!isChild) {
          indices.push(i)
        }
      }
    }

    return indices
  }, [isInFolder, currentFolder, flatTagList, nestedBlockTagGroups])

  // Auto-select first visible item when entering/exiting folders
  useEffect(() => {
    if (!visible || visibleIndices.length === 0) return

    if (!visibleIndices.includes(selectedIndex)) {
      setSelectedIndex(visibleIndices[0])
    }
  }, [visible, isInFolder, currentFolder, visibleIndices, selectedIndex, setSelectedIndex])

  useEffect(() => {
    if (!visible || !flatTagList.length) return

    const openFolderWithSelection = (
      folderId: string,
      folderTitle: string,
      parentTag: string,
      group: BlockTagGroup
    ) => {
      const parentIdx = flatTagList.findIndex((item) => item.tag === parentTag)
      const selectionCallback = () => handleTagSelect(parentTag, group)
      openFolder(folderId, folderTitle, undefined, selectionCallback)
      if (parentIdx >= 0) {
        setSelectedIndex(parentIdx)
      }
    }

    const handleKeyboardEvent = (e: KeyboardEvent) => {
      const selected = flatTagList[selectedIndex]
      if (!selected && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      let currentFolderInfo: {
        id: string
        title: string
        parentTag: string
        group: BlockTagGroup
      } | null = null

      if (selected) {
        for (const group of nestedBlockTagGroups) {
          for (const nestedTag of group.nestedTags) {
            if (
              nestedTag.parentTag === selected.tag &&
              nestedTag.children &&
              nestedTag.children.length > 0
            ) {
              currentFolderInfo = {
                id: `${selected.group?.blockId}-${nestedTag.key}`,
                title: nestedTag.display,
                parentTag: nestedTag.parentTag,
                group,
              }
              break
            }
          }
          if (currentFolderInfo) break
        }
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          e.stopPropagation()
          if (visibleIndices.length > 0) {
            const currentVisibleIndex = visibleIndices.indexOf(selectedIndex)
            if (currentVisibleIndex === -1) {
              setSelectedIndex(visibleIndices[0])
            } else if (currentVisibleIndex < visibleIndices.length - 1) {
              setSelectedIndex(visibleIndices[currentVisibleIndex + 1])
            }
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          e.stopPropagation()
          if (visibleIndices.length > 0) {
            const currentVisibleIndex = visibleIndices.indexOf(selectedIndex)
            if (currentVisibleIndex === -1) {
              setSelectedIndex(visibleIndices[0])
            } else if (currentVisibleIndex > 0) {
              setSelectedIndex(visibleIndices[currentVisibleIndex - 1])
            }
          }
          break
        case 'Enter':
          e.preventDefault()
          e.stopPropagation()
          if (selected && selectedIndex >= 0 && selectedIndex < flatTagList.length) {
            if (currentFolderInfo && !isInFolder) {
              // It's a folder, open it
              openFolderWithSelection(
                currentFolderInfo.id,
                currentFolderInfo.title,
                currentFolderInfo.parentTag,
                currentFolderInfo.group
              )
            } else {
              // Not a folder, select it
              handleTagSelect(selected.tag, selected.group)
            }
          }
          break
        case 'ArrowRight':
          if (currentFolderInfo && !isInFolder) {
            e.preventDefault()
            e.stopPropagation()
            openFolderWithSelection(
              currentFolderInfo.id,
              currentFolderInfo.title,
              currentFolderInfo.parentTag,
              currentFolderInfo.group
            )
          }
          break
        case 'ArrowLeft':
          if (isInFolder) {
            e.preventDefault()
            e.stopPropagation()
            closeFolder()
            let firstRootIndex = 0
            for (let i = 0; i < flatTagList.length; i++) {
              const tag = flatTagList[i].tag
              const isVariable = !tag.includes('.')
              let isParent = false
              for (const group of nestedBlockTagGroups) {
                for (const nestedTag of group.nestedTags) {
                  if (nestedTag.parentTag === tag) {
                    isParent = true
                    break
                  }
                }
                if (isParent) break
              }
              if (isVariable || isParent) {
                firstRootIndex = i
                break
              }
            }
            setSelectedIndex(firstRootIndex)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyboardEvent, true)
    return () => window.removeEventListener('keydown', handleKeyboardEvent, true)
  }, [
    visible,
    selectedIndex,
    visibleIndices,
    flatTagList,
    nestedBlockTagGroups,
    openFolder,
    closeFolder,
    isInFolder,
    setSelectedIndex,
    handleTagSelect,
  ])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: text.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/text/text.tsx

```typescript
/**
 * Props for the Text component
 */
interface TextProps {
  /** Unique identifier for the block */
  blockId: string
  /** Unique identifier for the sub-block */
  subBlockId: string
  /** Text or HTML content to display */
  content: string
  /** Additional CSS classes to apply */
  className?: string
}

/**
 * Text display component with HTML rendering support
 *
 * @remarks
 * - Automatically detects and renders HTML content safely
 * - Applies prose styling for HTML content (links, code, lists, etc.)
 * - Falls back to plain text rendering for non-HTML content
 */
export function Text({ blockId, subBlockId, content, className }: TextProps) {
  const containsHtml = /<[^>]+>/.test(content)

  if (containsHtml) {
    return (
      <div
        id={`${blockId}-${subBlockId}`}
        className={`rounded-md border bg-[var(--surface-2)] p-4 shadow-sm ${className || ''}`}
      >
        <div
          className='prose prose-sm dark:prose-invert max-w-none break-words text-sm [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 [&_a]:dark:text-blue-400 [&_a]:dark:hover:text-blue-300 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc'
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    )
  }

  return (
    <div
      id={`${blockId}-${subBlockId}`}
      className={`whitespace-pre-wrap break-words rounded-md border bg-[var(--surface-2)] p-4 text-muted-foreground text-sm shadow-sm ${className || ''}`}
    >
      {content}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: time-input.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/components/time-input/time-input.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { useSubBlockValue } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/editor/components/sub-block/hooks/use-sub-block-value'

interface TimeInputProps {
  blockId: string
  subBlockId: string
  placeholder?: string
  isPreview?: boolean
  previewValue?: string | null
  className?: string
  disabled?: boolean
}

export function TimeInput({
  blockId,
  subBlockId,
  placeholder,
  isPreview = false,
  previewValue,
  className,
  disabled = false,
}: TimeInputProps) {
  const [storeValue, setStoreValue] = useSubBlockValue<string>(blockId, subBlockId)

  // Use preview value when in preview mode, otherwise use store value
  const value = isPreview ? previewValue : storeValue
  const [isOpen, setIsOpen] = React.useState(false)

  // Convert 24h time string to display format (12h with AM/PM)
  const formatDisplayTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  // Convert display time to 24h format for storage
  const formatStorageTime = (hour: number, minute: number, ampm: string) => {
    const hours24 = ampm === 'PM' ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour
    return `${hours24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
  }

  const [hour, setHour] = React.useState<string>('12')
  const [minute, setMinute] = React.useState<string>('00')
  const [ampm, setAmpm] = React.useState<'AM' | 'PM'>('AM')

  // Update the time when any component changes
  const updateTime = (newHour?: string, newMinute?: string, newAmpm?: 'AM' | 'PM') => {
    if (isPreview || disabled) return
    const h = Number.parseInt(newHour ?? hour) || 12
    const m = Number.parseInt(newMinute ?? minute) || 0
    const p = newAmpm ?? ampm
    setStoreValue(formatStorageTime(h, m, p))
  }

  // Initialize from existing value
  React.useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':')
      const hour24 = Number.parseInt(hours, 10)
      const _minute = Number.parseInt(minutes, 10)
      const isAM = hour24 < 12
      setHour((hour24 % 12 || 12).toString())
      setMinute(minutes)
      setAmpm(isAM ? 'AM' : 'PM')
    }
  }, [value])

  const handleBlur = () => {
    updateTime()
    setIsOpen(false)
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          handleBlur()
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className='relative w-full cursor-pointer'>
          <Input
            readOnly
            disabled={isPreview || disabled}
            value={value ? formatDisplayTime(value) : ''}
            placeholder={placeholder || 'Select time'}
            autoComplete='off'
            className={cn('cursor-pointer', !value && 'text-muted-foreground', className)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-4'>
        <div className='flex items-center space-x-2'>
          <Input
            className='w-[4rem]'
            value={hour}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '')
              if (val === '') {
                setHour('')
                return
              }
              const numVal = Number.parseInt(val)
              if (!Number.isNaN(numVal)) {
                const newHour = Math.min(12, Math.max(1, numVal)).toString()
                setHour(newHour)
                updateTime(newHour)
              }
            }}
            onBlur={() => {
              const numVal = Number.parseInt(hour) || 12
              setHour(numVal.toString())
              updateTime(numVal.toString())
            }}
            type='text'
            autoComplete='off'
          />
          <span className='text-[var(--text-primary)]'>:</span>
          <Input
            className='w-[4rem]'
            value={minute}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, '')
              if (val === '') {
                setMinute('')
                return
              }
              const numVal = Number.parseInt(val)
              if (!Number.isNaN(numVal)) {
                const newMinute = Math.min(59, Math.max(0, numVal)).toString().padStart(2, '0')
                setMinute(newMinute)
                updateTime(undefined, newMinute)
              }
            }}
            onBlur={() => {
              const numVal = Number.parseInt(minute) || 0
              setMinute(numVal.toString().padStart(2, '0'))
              updateTime(undefined, numVal.toString())
            }}
            type='text'
            autoComplete='off'
          />
          <Button
            variant='outline'
            className='w-[4rem]'
            onClick={() => {
              const newAmpm = ampm === 'AM' ? 'PM' : 'AM'
              setAmpm(newAmpm)
              updateTime(undefined, undefined, newAmpm)
            }}
          >
            {ampm}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

--------------------------------------------------------------------------------

````
