---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 350
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 350 of 933)

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

---[FILE: document-icons.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/icons/document-icons.tsx
Signals: React

```typescript
import type React from 'react'
import {
  SUPPORTED_AUDIO_EXTENSIONS,
  SUPPORTED_VIDEO_EXTENSIONS,
} from '@/lib/uploads/utils/validation'

interface IconProps {
  className?: string
}

export const PdfIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#E53935'
    />
    <path d='M14 2V8H20' fill='#EF5350' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#C62828'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='7'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      PDF
    </text>
  </svg>
)

export const DocxIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#2196F3'
    />
    <path d='M14 2V8H20' fill='#64B5F6' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#1565C0'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='8'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      W
    </text>
  </svg>
)

export const XlsxIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#4CAF50'
    />
    <path d='M14 2V8H20' fill='#81C784' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#2E7D32'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='8'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      X
    </text>
  </svg>
)

export const CsvIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#4CAF50'
    />
    <path d='M14 2V8H20' fill='#81C784' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#2E7D32'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='6.5'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      CSV
    </text>
  </svg>
)

export const TxtIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#757575'
    />
    <path d='M14 2V8H20' fill='#9E9E9E' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='var(--border-muted)'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <text
      x='12'
      y='16'
      textAnchor='middle'
      fontSize='6'
      fontWeight='bold'
      fill='white'
      fontFamily='Arial, sans-serif'
    >
      TXT
    </text>
  </svg>
)

export const AudioIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#0288D1'
    />
    <path d='M14 2V8H20' fill='#29B6F6' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#01579B'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    {/* Speaker icon */}
    <path d='M8.5 10.5v3c0 .28.22.5.5.5h1.5l2 2V8l-2 2H9c-.28 0-.5.22-.5.5z' fill='white' />
    {/* Sound waves */}
    <path
      d='M14 10.5c.6.6.6 1.4 0 2M15.5 9c1.2 1.2 1.2 3.8 0 5'
      stroke='white'
      strokeWidth='0.8'
      strokeLinecap='round'
    />
  </svg>
)

export const VideoIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#D32F2F'
    />
    <path d='M14 2V8H20' fill='#EF5350' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#B71C1C'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    {/* Video screen */}
    <rect
      x='7.5'
      y='9.5'
      width='9'
      height='6'
      rx='0.5'
      stroke='white'
      strokeWidth='0.8'
      fill='none'
    />
    {/* Play button */}
    <path d='M10.5 11.5l3 2-3 2v-4z' fill='white' />
  </svg>
)

export const DefaultFileIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className={className}>
    <path
      d='M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z'
      fill='#607D8B'
    />
    <path d='M14 2V8H20' fill='#90A4AE' />
    <path
      d='M14 2L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2H14Z'
      stroke='#37474F'
      strokeWidth='0.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <rect x='8' y='13' width='8' height='1' fill='white' rx='0.5' />
    <rect x='8' y='15' width='8' height='1' fill='white' rx='0.5' />
    <rect x='8' y='17' width='5' height='1' fill='white' rx='0.5' />
  </svg>
)

export function getDocumentIcon(mimeType: string, filename: string): React.FC<IconProps> {
  const extension = filename.split('.').pop()?.toLowerCase()

  if (
    mimeType.startsWith('audio/') ||
    (extension &&
      SUPPORTED_AUDIO_EXTENSIONS.includes(extension as (typeof SUPPORTED_AUDIO_EXTENSIONS)[number]))
  ) {
    return AudioIcon
  }

  if (
    mimeType.startsWith('video/') ||
    (extension &&
      SUPPORTED_VIDEO_EXTENSIONS.includes(extension as (typeof SUPPORTED_VIDEO_EXTENSIONS)[number]))
  ) {
    return VideoIcon
  }

  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return PdfIcon
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword' ||
    extension === 'docx' ||
    extension === 'doc'
  ) {
    return DocxIcon
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    extension === 'xlsx' ||
    extension === 'xls'
  ) {
    return XlsxIcon
  }

  if (mimeType === 'text/csv' || extension === 'csv') {
    return CsvIcon
  }

  if (mimeType === 'text/plain' || extension === 'txt') {
    return TxtIcon
  }

  return DefaultFileIcon
}
```

--------------------------------------------------------------------------------

---[FILE: knowledge-header.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/knowledge-header/knowledge-header.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, ChevronDown, LibraryBig, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
  Tooltip,
} from '@/components/emcn'
import { Trash } from '@/components/emcn/icons/trash'
import { createLogger } from '@/lib/logs/console/logger'
import { filterButtonClass } from '@/app/workspace/[workspaceId]/knowledge/components/constants'
import { useKnowledgeStore } from '@/stores/knowledge/store'

const logger = createLogger('KnowledgeHeader')

interface BreadcrumbItem {
  label: string
  href?: string
  id?: string
}

const HEADER_STYLES = {
  container: 'flex items-center justify-between px-6 pt-[14px] pb-6',
  breadcrumbs: 'flex items-center gap-2',
  icon: 'h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-muted-foreground/70',
  link: 'group flex items-center gap-2 font-medium text-sm transition-colors hover:text-muted-foreground',
  label: 'font-medium text-sm',
  separator: 'text-muted-foreground',
  actionsContainer: 'flex items-center gap-2',
} as const

interface KnowledgeHeaderOptions {
  knowledgeBaseId?: string
  currentWorkspaceId?: string | null
  onWorkspaceChange?: (workspaceId: string | null) => void | Promise<void>
  onDeleteKnowledgeBase?: () => void
}

interface KnowledgeHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  options?: KnowledgeHeaderOptions
}

interface Workspace {
  id: string
  name: string
  permissions: 'admin' | 'write' | 'read'
}

export function KnowledgeHeader({ breadcrumbs, options }: KnowledgeHeaderProps) {
  const { updateKnowledgeBase } = useKnowledgeStore()
  const [isActionsPopoverOpen, setIsActionsPopoverOpen] = useState(false)
  const [isWorkspacePopoverOpen, setIsWorkspacePopoverOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false)
  const [isUpdatingWorkspace, setIsUpdatingWorkspace] = useState(false)

  // Fetch available workspaces
  useEffect(() => {
    if (!options?.knowledgeBaseId) return

    const fetchWorkspaces = async () => {
      try {
        setIsLoadingWorkspaces(true)

        const response = await fetch('/api/workspaces')
        if (!response.ok) {
          throw new Error('Failed to fetch workspaces')
        }

        const data = await response.json()

        // Filter workspaces where user has write/admin permissions
        const availableWorkspaces = data.workspaces
          .filter((ws: any) => ws.permissions === 'write' || ws.permissions === 'admin')
          .map((ws: any) => ({
            id: ws.id,
            name: ws.name,
            permissions: ws.permissions,
          }))

        setWorkspaces(availableWorkspaces)
      } catch (err) {
        logger.error('Error fetching workspaces:', err)
      } finally {
        setIsLoadingWorkspaces(false)
      }
    }

    fetchWorkspaces()
  }, [options?.knowledgeBaseId])

  const handleWorkspaceChange = async (workspaceId: string | null) => {
    if (isUpdatingWorkspace || !options?.knowledgeBaseId) return

    try {
      setIsUpdatingWorkspace(true)
      setIsWorkspacePopoverOpen(false)

      const response = await fetch(`/api/knowledge/${options.knowledgeBaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update workspace')
      }

      const result = await response.json()

      if (result.success) {
        logger.info(
          `Knowledge base workspace updated: ${options.knowledgeBaseId} -> ${workspaceId}`
        )

        // Notify parent component of the change to refresh data
        await options.onWorkspaceChange?.(workspaceId)

        // Update the store after refresh to ensure consistency
        updateKnowledgeBase(options.knowledgeBaseId, { workspaceId: workspaceId || undefined })
      } else {
        throw new Error(result.error || 'Failed to update workspace')
      }
    } catch (err) {
      logger.error('Error updating workspace:', err)
    } finally {
      setIsUpdatingWorkspace(false)
    }
  }

  const currentWorkspace = workspaces.find((ws) => ws.id === options?.currentWorkspaceId)
  const hasWorkspace = !!options?.currentWorkspaceId

  return (
    <div className={HEADER_STYLES.container}>
      <div className={HEADER_STYLES.breadcrumbs}>
        {breadcrumbs.map((breadcrumb, index) => {
          // Use unique identifier when available, fallback to content-based key
          const key = breadcrumb.id || `${breadcrumb.label}-${breadcrumb.href || index}`

          return (
            <div key={key} className='flex items-center gap-2'>
              {index === 0 && <LibraryBig className={HEADER_STYLES.icon} />}

              {breadcrumb.href ? (
                <Link href={breadcrumb.href} prefetch={true} className={HEADER_STYLES.link}>
                  <span>{breadcrumb.label}</span>
                </Link>
              ) : (
                <span className={HEADER_STYLES.label}>{breadcrumb.label}</span>
              )}

              {index < breadcrumbs.length - 1 && <span className={HEADER_STYLES.separator}>/</span>}
            </div>
          )
        })}
      </div>

      {/* Actions Area */}
      {options && (
        <div className={HEADER_STYLES.actionsContainer}>
          {/* Workspace Selector */}
          {options.knowledgeBaseId && (
            <div className='flex items-center gap-2'>
              {/* Warning icon for unassigned knowledge bases */}
              {!hasWorkspace && (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <AlertTriangle className='h-4 w-4 text-amber-500' />
                  </Tooltip.Trigger>
                  <Tooltip.Content side='top'>Not assigned to workspace</Tooltip.Content>
                </Tooltip.Root>
              )}

              {/* Workspace selector dropdown */}
              <Popover open={isWorkspacePopoverOpen} onOpenChange={setIsWorkspacePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    disabled={isLoadingWorkspaces || isUpdatingWorkspace}
                    className={filterButtonClass}
                  >
                    <span className='truncate'>
                      {isLoadingWorkspaces
                        ? 'Loading...'
                        : isUpdatingWorkspace
                          ? 'Updating...'
                          : currentWorkspace?.name || 'No workspace'}
                    </span>
                    <ChevronDown className='ml-2 h-4 w-4 text-muted-foreground' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='end' side='bottom' sideOffset={4}>
                  {/* No workspace option */}
                  <PopoverItem
                    active={!options.currentWorkspaceId}
                    showCheck
                    onClick={() => handleWorkspaceChange(null)}
                  >
                    <span className='text-muted-foreground'>No workspace</span>
                  </PopoverItem>

                  {/* Available workspaces */}
                  {workspaces.map((workspace) => (
                    <PopoverItem
                      key={workspace.id}
                      active={options.currentWorkspaceId === workspace.id}
                      showCheck
                      onClick={() => handleWorkspaceChange(workspace.id)}
                    >
                      {workspace.name}
                    </PopoverItem>
                  ))}

                  {workspaces.length === 0 && !isLoadingWorkspaces && (
                    <PopoverItem disabled>
                      <span className='text-muted-foreground text-xs'>
                        No workspaces with write access
                      </span>
                    </PopoverItem>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Actions Menu */}
          {options.onDeleteKnowledgeBase && (
            <Popover open={isActionsPopoverOpen} onOpenChange={setIsActionsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={filterButtonClass}
                  aria-label='Knowledge base actions menu'
                >
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent align='end' side='bottom' sideOffset={4}>
                <PopoverItem
                  onClick={() => {
                    options.onDeleteKnowledgeBase?.()
                    setIsActionsPopoverOpen(false)
                  }}
                  className='text-red-600 hover:text-red-600 focus:text-red-600'
                >
                  <Trash className='h-4 w-4' />
                  <span>Delete Knowledge Base</span>
                </PopoverItem>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
