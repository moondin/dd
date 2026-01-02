---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 349
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 349 of 933)

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

---[FILE: knowledge.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/knowledge.tsx
Signals: React, Next.js

```typescript
'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, Database, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
  Tooltip,
} from '@/components/emcn'
import { Input } from '@/components/ui/input'
import {
  BaseCard,
  BaseCardSkeletonGrid,
  CreateBaseModal,
} from '@/app/workspace/[workspaceId]/knowledge/components'
import {
  SORT_OPTIONS,
  type SortOption,
  type SortOrder,
} from '@/app/workspace/[workspaceId]/knowledge/components/constants'
import {
  filterKnowledgeBases,
  sortKnowledgeBases,
} from '@/app/workspace/[workspaceId]/knowledge/utils/sort'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'
import { useDebounce } from '@/hooks/use-debounce'
import { useKnowledgeBasesList } from '@/hooks/use-knowledge'
import type { KnowledgeBaseData } from '@/stores/knowledge/store'

/**
 * Extended knowledge base data with document count
 */
interface KnowledgeBaseWithDocCount extends KnowledgeBaseData {
  docCount?: number
}

/**
 * Knowledge base list component displaying all knowledge bases in a workspace
 * Supports filtering by search query and sorting options
 */
export function Knowledge() {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const { knowledgeBases, isLoading, error, addKnowledgeBase, refreshList } =
    useKnowledgeBasesList(workspaceId)
  const userPermissions = useUserPermissionsContext()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const currentSortValue = `${sortBy}-${sortOrder}`
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSortValue)?.label || 'Last Updated'

  /**
   * Handles sort option change from dropdown
   */
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-') as [SortOption, SortOrder]
    setSortBy(field)
    setSortOrder(order)
    setIsSortPopoverOpen(false)
  }

  /**
   * Callback when a new knowledge base is created
   */
  const handleKnowledgeBaseCreated = (newKnowledgeBase: KnowledgeBaseData) => {
    addKnowledgeBase(newKnowledgeBase)
  }

  /**
   * Retry loading knowledge bases after an error
   */
  const handleRetry = () => {
    refreshList()
  }

  /**
   * Filter and sort knowledge bases based on search query and sort options
   * Memoized to prevent unnecessary recalculations on render
   */
  const filteredAndSortedKnowledgeBases = useMemo(() => {
    const filtered = filterKnowledgeBases(knowledgeBases, debouncedSearchQuery)
    return sortKnowledgeBases(filtered, sortBy, sortOrder)
  }, [knowledgeBases, debouncedSearchQuery, sortBy, sortOrder])

  /**
   * Format knowledge base data for display in the card
   */
  const formatKnowledgeBaseForDisplay = (kb: KnowledgeBaseWithDocCount) => ({
    id: kb.id,
    title: kb.name,
    docCount: kb.docCount || 0,
    description: kb.description || 'No description provided',
    createdAt: kb.createdAt,
    updatedAt: kb.updatedAt,
  })

  /**
   * Get empty state content based on current filters
   * Memoized to prevent unnecessary recalculations on render
   */
  const emptyState = useMemo(() => {
    if (debouncedSearchQuery) {
      return {
        title: 'No knowledge bases found',
        description: 'Try a different search term',
      }
    }

    return {
      title: 'No knowledge bases yet',
      description:
        userPermissions.canEdit === true
          ? 'Create a knowledge base to get started'
          : 'Knowledge bases will appear here once created',
    }
  }, [debouncedSearchQuery, userPermissions.canEdit])

  return (
    <>
      <div className='flex h-full flex-1 flex-col'>
        <div className='flex flex-1 overflow-hidden'>
          <div className='flex flex-1 flex-col overflow-auto px-[24px] pt-[28px] pb-[24px]'>
            <div>
              <div className='flex items-start gap-[12px]'>
                <div className='flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#1E5A3E] bg-[#0F3D2C]'>
                  <Database className='h-[14px] w-[14px] text-[#34D399]' />
                </div>
                <h1 className='font-medium text-[18px]'>Knowledge Base</h1>
              </div>
              <p className='mt-[10px] text-[14px] text-[var(--text-tertiary)]'>
                Create and manage knowledge bases with custom files.
              </p>
            </div>

            <div className='mt-[14px] flex items-center justify-between'>
              <div className='flex h-[32px] w-[400px] items-center gap-[6px] rounded-[8px] bg-[var(--surface-5)] px-[8px]'>
                <Search className='h-[14px] w-[14px] text-[var(--text-subtle)]' />
                <Input
                  placeholder='Search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 border-0 bg-transparent px-0 font-medium text-[var(--text-secondary)] text-small leading-none placeholder:text-[var(--text-subtle)] focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>
              <div className='flex items-center gap-[8px]'>
                {knowledgeBases.length > 0 && (
                  <Popover open={isSortPopoverOpen} onOpenChange={setIsSortPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button variant='default' className='h-[32px] rounded-[6px]'>
                        {currentSortLabel}
                        <ChevronDown className='ml-2 h-4 w-4 text-muted-foreground' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='end' side='bottom' sideOffset={4}>
                      <div className='flex flex-col gap-[2px]'>
                        {SORT_OPTIONS.map((option) => (
                          <PopoverItem
                            key={option.value}
                            active={currentSortValue === option.value}
                            onClick={() => handleSortChange(option.value)}
                          >
                            {option.label}
                          </PopoverItem>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      disabled={userPermissions.canEdit !== true}
                      variant='primary'
                      className='h-[32px] rounded-[6px]'
                    >
                      Create
                    </Button>
                  </Tooltip.Trigger>
                  {userPermissions.canEdit !== true && (
                    <Tooltip.Content>
                      Write permission required to create knowledge bases
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              </div>
            </div>

            <div className='mt-[24px] grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {isLoading ? (
                <BaseCardSkeletonGrid count={8} />
              ) : filteredAndSortedKnowledgeBases.length === 0 ? (
                <div className='col-span-full flex h-64 items-center justify-center rounded-lg border border-muted-foreground/25 bg-muted/20'>
                  <div className='text-center'>
                    <p className='font-medium text-[var(--text-secondary)] text-sm'>
                      {emptyState.title}
                    </p>
                    <p className='mt-1 text-[var(--text-muted)] text-xs'>
                      {emptyState.description}
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className='col-span-full flex h-64 items-center justify-center rounded-lg border border-muted-foreground/25 bg-muted/20'>
                  <div className='text-center'>
                    <p className='font-medium text-[var(--text-secondary)] text-sm'>
                      Error loading knowledge bases
                    </p>
                    <p className='mt-1 text-[var(--text-muted)] text-xs'>{error}</p>
                  </div>
                </div>
              ) : (
                filteredAndSortedKnowledgeBases.map((kb) => {
                  const displayData = formatKnowledgeBaseForDisplay(kb as KnowledgeBaseWithDocCount)
                  return (
                    <BaseCard
                      key={kb.id}
                      id={displayData.id}
                      title={displayData.title}
                      docCount={displayData.docCount}
                      description={displayData.description}
                      createdAt={displayData.createdAt}
                      updatedAt={displayData.updatedAt}
                    />
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateBaseModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onKnowledgeBaseCreated={handleKnowledgeBaseCreated}
      />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/layout.tsx

```typescript
/**
 * Knowledge Base layout - applies sidebar padding for all knowledge routes.
 */
export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <div className='flex h-full flex-1 flex-col overflow-hidden pl-60'>{children}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/page.tsx

```typescript
export { Knowledge as default } from './knowledge'
```

--------------------------------------------------------------------------------

---[FILE: constants.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/constants.ts

```typescript
export const filterButtonClass =
  'w-full justify-between rounded-[10px] border-[#E5E5E5] bg-[var(--white)] font-normal text-sm dark:border-[#414141] dark:bg-[var(--surface-elevated)]'

export const dropdownContentClass =
  'w-[220px] rounded-lg border-[#E5E5E5] bg-[var(--white)] p-0 shadow-xs dark:border-[#414141] dark:bg-[var(--surface-elevated)]'

export const commandListClass = 'overflow-y-auto overflow-x-hidden'

export type SortOption = 'name' | 'createdAt' | 'updatedAt' | 'docCount'
export type SortOrder = 'asc' | 'desc'

export const SORT_OPTIONS = [
  { value: 'updatedAt-desc', label: 'Last Updated' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'docCount-desc', label: 'Most Documents' },
  { value: 'docCount-asc', label: 'Least Documents' },
] as const
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/index.ts

```typescript
export { BaseCard, BaseCardSkeleton, BaseCardSkeletonGrid } from './base-card/base-card'
export { CreateBaseModal } from './create-base-modal/create-base-modal'
export { getDocumentIcon } from './icons/document-icons'
export { KnowledgeHeader } from './knowledge-header/knowledge-header'
```

--------------------------------------------------------------------------------

---[FILE: base-card.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/base-card/base-card.tsx
Signals: Next.js

```typescript
'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Badge, DocumentAttachment, Tooltip } from '@/components/emcn'

interface BaseCardProps {
  id?: string
  title: string
  docCount: number
  description: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Formats a date string to relative time (e.g., "2h ago", "3d ago")
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks}w ago`
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months}mo ago`
  }
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years}y ago`
}

/**
 * Formats a date string to absolute format for tooltip display
 */
function formatAbsoluteDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Skeleton placeholder for a knowledge base card
 */
export function BaseCardSkeleton() {
  return (
    <div className='group flex h-full cursor-pointer flex-col gap-[12px] rounded-[4px] bg-[var(--surface-elevated)] px-[8px] py-[6px] transition-colors hover:bg-[var(--surface-5)]'>
      <div className='flex items-center justify-between gap-[8px]'>
        <div className='h-[17px] w-[120px] animate-pulse rounded-[4px] bg-[var(--surface-9)]' />
        <div className='h-[22px] w-[90px] animate-pulse rounded-[4px] bg-[var(--surface-5)]' />
      </div>

      <div className='flex flex-1 flex-col gap-[8px]'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-[6px]'>
            <div className='h-[12px] w-[12px] animate-pulse rounded-[2px] bg-[var(--surface-9)]' />
            <div className='h-[15px] w-[45px] animate-pulse rounded-[4px] bg-[var(--surface-9)]' />
          </div>
          <div className='h-[15px] w-[120px] animate-pulse rounded-[4px] bg-[var(--surface-5)]' />
        </div>

        <div className='h-0 w-full border-[var(--divider)] border-t' />

        <div className='flex h-[36px] flex-col gap-[6px]'>
          <div className='h-[15px] w-full animate-pulse rounded-[4px] bg-[var(--surface-5)]' />
          <div className='h-[15px] w-[75%] animate-pulse rounded-[4px] bg-[var(--surface-5)]' />
        </div>
      </div>
    </div>
  )
}

/**
 * Renders multiple knowledge base card skeletons as a fragment
 */
export function BaseCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <BaseCardSkeleton key={i} />
      ))}
    </>
  )
}

/**
 * Knowledge base card component displaying overview information
 */
export function BaseCard({ id, title, docCount, description, updatedAt }: BaseCardProps) {
  const params = useParams()
  const workspaceId = params?.workspaceId as string

  const searchParams = new URLSearchParams({
    kbName: title,
  })
  const href = `/workspace/${workspaceId}/knowledge/${id || title.toLowerCase().replace(/\s+/g, '-')}?${searchParams.toString()}`

  const shortId = id ? `kb-${id.slice(0, 8)}` : ''

  return (
    <Link href={href} prefetch={true} className='h-full'>
      <div className='group flex h-full cursor-pointer flex-col gap-[12px] rounded-[4px] bg-[var(--surface-elevated)] px-[8px] py-[6px] transition-colors hover:bg-[var(--surface-5)]'>
        <div className='flex items-center justify-between gap-[8px]'>
          <h3 className='min-w-0 flex-1 truncate text-[14px] text-[var(--text-primary)]'>
            {title}
          </h3>
          {shortId && <Badge className='flex-shrink-0 rounded-[4px] text-[12px]'>{shortId}</Badge>}
        </div>

        <div className='flex flex-1 flex-col gap-[8px]'>
          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-[6px] text-[12px] text-[var(--text-tertiary)]'>
              <DocumentAttachment className='h-[12px] w-[12px]' />
              {docCount} {docCount === 1 ? 'doc' : 'docs'}
            </span>
            {updatedAt && (
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className='text-[12px] text-[var(--text-muted)]'>
                    last updated: {formatRelativeTime(updatedAt)}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content>{formatAbsoluteDate(updatedAt)}</Tooltip.Content>
              </Tooltip.Root>
            )}
          </div>

          <div className='h-0 w-full border-[var(--divider)] border-t' />

          <p className='line-clamp-2 h-[36px] text-[12px] text-[var(--text-tertiary)] leading-[18px]'>
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: create-base-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/components/create-base-modal/create-base-modal.tsx
Signals: React, Next.js, Zod

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RotateCcw, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { formatFileSize, validateKnowledgeBaseFile } from '@/lib/uploads/utils/file-utils'
import { ACCEPT_ATTRIBUTE } from '@/lib/uploads/utils/validation'
import { useKnowledgeUpload } from '@/app/workspace/[workspaceId]/knowledge/hooks/use-knowledge-upload'
import type { KnowledgeBaseData } from '@/stores/knowledge/store'

const logger = createLogger('CreateBaseModal')

interface FileWithPreview extends File {
  preview: string
}

interface CreateBaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onKnowledgeBaseCreated?: (knowledgeBase: KnowledgeBaseData) => void
}

const FormSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters')
      .refine((value) => value.trim().length > 0, 'Name cannot be empty'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    minChunkSize: z
      .number()
      .min(1, 'Min chunk size must be at least 1')
      .max(2000, 'Min chunk size must be less than 2000'),
    maxChunkSize: z
      .number()
      .min(100, 'Max chunk size must be at least 100')
      .max(4000, 'Max chunk size must be less than 4000'),
    overlapSize: z
      .number()
      .min(0, 'Overlap size must be non-negative')
      .max(500, 'Overlap size must be less than 500'),
  })
  .refine((data) => data.minChunkSize < data.maxChunkSize, {
    message: 'Min chunk size must be less than max chunk size',
    path: ['minChunkSize'],
  })

type FormValues = z.infer<typeof FormSchema>

interface SubmitStatus {
  type: 'success' | 'error'
  message: string
}

export function CreateBaseModal({
  open,
  onOpenChange,
  onKnowledgeBaseCreated,
}: CreateBaseModalProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [retryingIndexes, setRetryingIndexes] = useState<Set<number>>(new Set())

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { uploadFiles, isUploading, uploadProgress, uploadError, clearError } = useKnowledgeUpload({
    workspaceId,
    onUploadComplete: (uploadedFiles) => {
      logger.info(`Successfully uploaded ${uploadedFiles.length} files`)
    },
  })

  const handleClose = (open: boolean) => {
    if (!open) {
      clearError()
    }
    onOpenChange(open)
  }

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      minChunkSize: 1,
      maxChunkSize: 1024,
      overlapSize: 200,
    },
    mode: 'onSubmit',
  })

  const nameValue = watch('name')

  useEffect(() => {
    if (open) {
      setSubmitStatus(null)
      setFileError(null)
      setFiles([])
      setIsDragging(false)
      setDragCounter(0)
      setRetryingIndexes(new Set())
      reset({
        name: '',
        description: '',
        minChunkSize: 1,
        maxChunkSize: 1024,
        overlapSize: 200,
      })
    }
  }, [open, reset])

  const processFiles = async (fileList: FileList | File[]) => {
    setFileError(null)

    if (!fileList || fileList.length === 0) return

    try {
      const newFiles: FileWithPreview[] = []
      let hasError = false

      for (const file of Array.from(fileList)) {
        const validationError = validateKnowledgeBaseFile(file)
        if (validationError) {
          setFileError(validationError)
          hasError = true
          continue
        }

        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview

        newFiles.push(fileWithPreview)
      }

      if (!hasError && newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles])
      }
    } catch (error) {
      logger.error('Error processing files:', error)
      setFileError('An error occurred while processing files. Please try again.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(e.target.files)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev + 1
      if (newCount === 1) {
        setIsDragging(true)
      }
      return newCount
    })
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev - 1
      if (newCount === 0) {
        setIsDragging(false)
      }
      return newCount
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setDragCounter(0)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const knowledgeBasePayload = {
        name: data.name,
        description: data.description || undefined,
        workspaceId: workspaceId,
        chunkingConfig: {
          maxSize: data.maxChunkSize,
          minSize: data.minChunkSize,
          overlap: data.overlapSize,
        },
      }

      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(knowledgeBasePayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create knowledge base')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create knowledge base')
      }

      const newKnowledgeBase = result.data

      if (files.length > 0) {
        try {
          const uploadedFiles = await uploadFiles(files, newKnowledgeBase.id, {
            chunkSize: data.maxChunkSize,
            minCharactersPerChunk: data.minChunkSize,
            chunkOverlap: data.overlapSize,
            recipe: 'default',
          })

          logger.info(`Successfully uploaded ${uploadedFiles.length} files`)
          logger.info(`Started processing ${uploadedFiles.length} documents in the background`)

          newKnowledgeBase.docCount = uploadedFiles.length

          if (onKnowledgeBaseCreated) {
            onKnowledgeBaseCreated(newKnowledgeBase)
          }
        } catch (uploadError) {
          // If file upload fails completely, delete the knowledge base to avoid orphaned empty KB
          logger.error('File upload failed, deleting knowledge base:', uploadError)
          try {
            await fetch(`/api/knowledge/${newKnowledgeBase.id}`, {
              method: 'DELETE',
            })
            logger.info(`Deleted orphaned knowledge base: ${newKnowledgeBase.id}`)
          } catch (deleteError) {
            logger.error('Failed to delete orphaned knowledge base:', deleteError)
          }
          throw uploadError
        }
      } else {
        if (onKnowledgeBaseCreated) {
          onKnowledgeBaseCreated(newKnowledgeBase)
        }
      }

      files.forEach((file) => URL.revokeObjectURL(file.preview))
      setFiles([])

      handleClose(false)
    } catch (error) {
      logger.error('Error creating knowledge base:', error)
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>Create Knowledge Base</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex min-h-0 flex-1 flex-col'>
          <ModalBody className='!pb-[16px]'>
            <div ref={scrollContainerRef} className='min-h-0 flex-1 overflow-y-auto'>
              <div className='space-y-[12px]'>
                <div className='flex flex-col gap-[8px]'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    placeholder='Enter knowledge base name'
                    {...register('name')}
                    className={cn(errors.name && 'border-[var(--text-error)]')}
                  />
                </div>

                <div className='flex flex-col gap-[8px]'>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    placeholder='Describe this knowledge base (optional)'
                    rows={3}
                    {...register('description')}
                    className={cn(errors.description && 'border-[var(--text-error)]')}
                  />
                </div>

                <div className='space-y-[12px] rounded-[6px] bg-[var(--surface-6)] px-[12px] py-[14px]'>
                  <div className='grid grid-cols-2 gap-[12px]'>
                    <div className='flex flex-col gap-[8px]'>
                      <Label htmlFor='minChunkSize'>Min Chunk Size</Label>
                      <Input
                        id='minChunkSize'
                        placeholder='1'
                        {...register('minChunkSize', { valueAsNumber: true })}
                        className={cn(errors.minChunkSize && 'border-[var(--text-error)]')}
                        autoComplete='off'
                        data-form-type='other'
                        name='min-chunk-size'
                      />
                    </div>

                    <div className='flex flex-col gap-[8px]'>
                      <Label htmlFor='maxChunkSize'>Max Chunk Size</Label>
                      <Input
                        id='maxChunkSize'
                        placeholder='1024'
                        {...register('maxChunkSize', { valueAsNumber: true })}
                        className={cn(errors.maxChunkSize && 'border-[var(--text-error)]')}
                        autoComplete='off'
                        data-form-type='other'
                        name='max-chunk-size'
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-[8px]'>
                    <Label htmlFor='overlapSize'>Overlap Size</Label>
                    <Input
                      id='overlapSize'
                      placeholder='200'
                      {...register('overlapSize', { valueAsNumber: true })}
                      className={cn(errors.overlapSize && 'border-[var(--text-error)]')}
                      autoComplete='off'
                      data-form-type='other'
                      name='overlap-size'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-[8px]'>
                  <Label>Upload Documents</Label>
                  <Button
                    type='button'
                    variant='default'
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      '!bg-[var(--surface-1)] hover:!bg-[var(--surface-4)] w-full justify-center border border-[var(--c-575757)] border-dashed py-[10px]',
                      isDragging && 'border-[var(--brand-primary-hex)]'
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept={ACCEPT_ATTRIBUTE}
                      onChange={handleFileChange}
                      className='hidden'
                      multiple
                    />
                    <div className='flex flex-col gap-[2px] text-center'>
                      <span className='text-[var(--text-primary)]'>
                        {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
                      </span>
                      <span className='text-[11px] text-[var(--text-tertiary)]'>
                        PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, MD, PPT, PPTX, HTML (max 100MB each)
                      </span>
                    </div>
                  </Button>
                </div>

                {files.length > 0 && (
                  <div className='space-y-2'>
                    <Label>Selected Files</Label>
                    <div className='space-y-2'>
                      {files.map((file, index) => {
                        const fileStatus = uploadProgress.fileStatuses?.[index]
                        const isFailed = fileStatus?.status === 'failed'
                        const isRetrying = retryingIndexes.has(index)
                        const isProcessing = fileStatus?.status === 'uploading' || isRetrying

                        return (
                          <div
                            key={index}
                            className={cn(
                              'flex items-center gap-2 rounded-[4px] border p-[8px]',
                              isFailed && !isRetrying && 'border-[var(--text-error)]'
                            )}
                          >
                            <span
                              className={cn(
                                'min-w-0 flex-1 truncate text-[12px]',
                                isFailed && !isRetrying && 'text-[var(--text-error)]'
                              )}
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <span className='flex-shrink-0 text-[11px] text-[var(--text-muted)]'>
                              {formatFileSize(file.size)}
                            </span>
                            <div className='flex flex-shrink-0 items-center gap-1'>
                              {isProcessing ? (
                                <Loader2 className='h-4 w-4 animate-spin text-[var(--text-muted)]' />
                              ) : (
                                <>
                                  {isFailed && (
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      className='h-4 w-4 p-0'
                                      onClick={() => {
                                        setRetryingIndexes((prev) => new Set(prev).add(index))
                                        removeFile(index)
                                      }}
                                      disabled={isUploading}
                                    >
                                      <RotateCcw className='h-3 w-3' />
                                    </Button>
                                  )}
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    className='h-4 w-4 p-0'
                                    onClick={() => removeFile(index)}
                                    disabled={isUploading}
                                  >
                                    <X className='h-3.5 w-3.5' />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {fileError && (
                  <p className='text-[11px] text-[var(--text-error)] leading-tight'>{fileError}</p>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className='flex w-full items-center justify-between gap-[12px]'>
              {submitStatus?.type === 'error' || uploadError ? (
                <p className='min-w-0 flex-1 truncate text-[11px] text-[var(--text-error)] leading-tight'>
                  {uploadError?.message || submitStatus?.message}
                </p>
              ) : (
                <div />
              )}
              <div className='flex flex-shrink-0 gap-[8px]'>
                <Button
                  variant='default'
                  onClick={() => handleClose(false)}
                  type='button'
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  type='submit'
                  disabled={isSubmitting || !nameValue?.trim()}
                >
                  {isSubmitting
                    ? isUploading
                      ? uploadProgress.stage === 'uploading'
                        ? `Uploading ${uploadProgress.filesCompleted}/${uploadProgress.totalFiles}...`
                        : uploadProgress.stage === 'processing'
                          ? 'Processing...'
                          : 'Creating...'
                      : 'Creating...'
                    : 'Create'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

````
