---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 353
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 353 of 933)

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

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/page.tsx

```typescript
import { KnowledgeBase } from '@/app/workspace/[workspaceId]/knowledge/[id]/base'

interface PageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    kbName?: string
  }>
}

export default async function KnowledgeBasePage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { kbName } = await searchParams

  return <KnowledgeBase id={id} knowledgeBaseName={kbName || 'Knowledge Base'} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/components/index.ts

```typescript
export { ActionBar } from './action-bar/action-bar'
export { AddDocumentsModal } from './add-documents-modal/add-documents-modal'
export { BaseTagsModal } from './base-tags-modal/base-tags-modal'
```

--------------------------------------------------------------------------------

---[FILE: action-bar.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/components/action-bar/action-bar.tsx

```typescript
import { motion } from 'framer-motion'
import { Circle, CircleOff } from 'lucide-react'
import { Button, Tooltip, Trash2 } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { useUserPermissionsContext } from '@/app/workspace/[workspaceId]/providers/workspace-permissions-provider'

interface ActionBarProps {
  selectedCount: number
  onEnable?: () => void
  onDisable?: () => void
  onDelete?: () => void
  enabledCount?: number
  disabledCount?: number
  isLoading?: boolean
  className?: string
}

export function ActionBar({
  selectedCount,
  onEnable,
  onDisable,
  onDelete,
  enabledCount = 0,
  disabledCount = 0,
  isLoading = false,
  className,
}: ActionBarProps) {
  const userPermissions = useUserPermissionsContext()

  if (selectedCount === 0) return null

  const canEdit = userPermissions.canEdit
  const showEnableButton = disabledCount > 0 && onEnable && canEdit
  const showDisableButton = enabledCount > 0 && onDisable && canEdit

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn('-translate-x-1/2 fixed bottom-6 left-1/2 z-50 transform', className)}
    >
      <div className='flex items-center gap-[8px] rounded-[10px] border border-[var(--border-strong)] bg-[var(--surface-1)] p-[8px]'>
        <span className='px-[4px] text-[13px] text-[var(--text-muted)]'>
          {selectedCount} selected
        </span>

        <div className='flex items-center gap-[5px]'>
          {showEnableButton && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  onClick={onEnable}
                  disabled={isLoading}
                  className='hover:!text-[var(--text-inverse)] h-[28px] w-[28px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
                >
                  <Circle className='h-[12px] w-[12px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                Enable {disabledCount > 1 ? `${disabledCount} items` : 'item'}
              </Tooltip.Content>
            </Tooltip.Root>
          )}

          {showDisableButton && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  onClick={onDisable}
                  disabled={isLoading}
                  className='hover:!text-[var(--text-inverse)] h-[28px] w-[28px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
                >
                  <CircleOff className='h-[12px] w-[12px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>
                Disable {enabledCount > 1 ? `${enabledCount} items` : 'item'}
              </Tooltip.Content>
            </Tooltip.Root>
          )}

          {onDelete && canEdit && (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button
                  variant='ghost'
                  onClick={onDelete}
                  disabled={isLoading}
                  className='hover:!text-[var(--text-inverse)] h-[28px] w-[28px] rounded-[8px] bg-[var(--surface-9)] p-0 text-[#868686] hover:bg-[var(--brand-secondary)]'
                >
                  <Trash2 className='h-[12px] w-[12px]' />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content side='top'>Delete items</Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      </div>
    </motion.div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: add-documents-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/components/add-documents-modal/add-documents-modal.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, RotateCcw, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { formatFileSize, validateKnowledgeBaseFile } from '@/lib/uploads/utils/file-utils'
import { ACCEPT_ATTRIBUTE } from '@/lib/uploads/utils/validation'
import { useKnowledgeUpload } from '@/app/workspace/[workspaceId]/knowledge/hooks/use-knowledge-upload'

const logger = createLogger('AddDocumentsModal')

interface FileWithPreview extends File {
  preview: string
}

interface AddDocumentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  knowledgeBaseId: string
  chunkingConfig?: {
    maxSize: number
    minSize: number
    overlap: number
  }
  onUploadComplete?: () => void
}

export function AddDocumentsModal({
  open,
  onOpenChange,
  knowledgeBaseId,
  chunkingConfig,
  onUploadComplete,
}: AddDocumentsModalProps) {
  const params = useParams()
  const workspaceId = params.workspaceId as string
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const [retryingIndexes, setRetryingIndexes] = useState<Set<number>>(new Set())

  const { isUploading, uploadProgress, uploadFiles, uploadError, clearError } = useKnowledgeUpload({
    workspaceId,
    onUploadComplete: () => {
      logger.info(`Successfully uploaded ${files.length} files`)
      onUploadComplete?.()
      handleClose()
    },
  })

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  useEffect(() => {
    if (open) {
      setFiles([])
      setFileError(null)
      setIsDragging(false)
      setDragCounter(0)
      setRetryingIndexes(new Set())
      clearError()
    }
  }, [open, clearError])

  const handleClose = () => {
    if (isUploading) return
    setFiles([])
    setFileError(null)
    clearError()
    setIsDragging(false)
    setDragCounter(0)
    setRetryingIndexes(new Set())
    onOpenChange(false)
  }

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

  const handleRetryFile = async (index: number) => {
    const fileToRetry = files[index]
    if (!fileToRetry) return

    setRetryingIndexes((prev) => new Set(prev).add(index))

    try {
      await uploadFiles([fileToRetry], knowledgeBaseId, {
        chunkSize: chunkingConfig?.maxSize || 1024,
        minCharactersPerChunk: chunkingConfig?.minSize || 1,
        chunkOverlap: chunkingConfig?.overlap || 200,
        recipe: 'default',
      })
      removeFile(index)
    } catch (error) {
      logger.error('Error retrying file upload:', error)
    } finally {
      setRetryingIndexes((prev) => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    try {
      await uploadFiles(files, knowledgeBaseId, {
        chunkSize: chunkingConfig?.maxSize || 1024,
        minCharactersPerChunk: chunkingConfig?.minSize || 1,
        chunkOverlap: chunkingConfig?.overlap || 200,
        recipe: 'default',
      })
    } catch (error) {
      logger.error('Error uploading files:', error)
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>Add Documents</ModalHeader>

        <ModalBody className='!pb-[16px]'>
          <div className='min-h-0 flex-1 overflow-y-auto'>
            <div className='space-y-[12px]'>
              {fileError && (
                <p className='text-[11px] text-[var(--text-error)] leading-tight'>{fileError}</p>
              )}

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
                                    onClick={() => handleRetryFile(index)}
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
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className='flex w-full items-center justify-between gap-[12px]'>
            {uploadError ? (
              <p className='min-w-0 flex-1 truncate text-[11px] text-[var(--text-error)] leading-tight'>
                {uploadError.message}
              </p>
            ) : (
              <div />
            )}
            <div className='flex flex-shrink-0 gap-[8px]'>
              <Button variant='default' onClick={handleClose} type='button' disabled={isUploading}>
                Cancel
              </Button>
              <Button
                variant='primary'
                type='button'
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
              >
                {isUploading
                  ? uploadProgress.stage === 'uploading'
                    ? `Uploading ${uploadProgress.filesCompleted}/${uploadProgress.totalFiles}...`
                    : uploadProgress.stage === 'processing'
                      ? 'Processing...'
                      : 'Uploading...'
                  : 'Upload'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: base-tags-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/components/base-tags-modal/base-tags-modal.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Trash,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { MAX_TAG_SLOTS } from '@/lib/knowledge/constants'
import { createLogger } from '@/lib/logs/console/logger'
import { getDocumentIcon } from '@/app/workspace/[workspaceId]/knowledge/components'
import {
  type TagDefinition,
  useKnowledgeBaseTagDefinitions,
} from '@/hooks/use-knowledge-base-tag-definitions'

const logger = createLogger('BaseTagsModal')

interface TagUsageData {
  tagName: string
  tagSlot: string
  documentCount: number
  documents: Array<{ id: string; name: string; tagValue: string }>
}

interface DocumentListProps {
  documents: Array<{ id: string; name: string; tagValue: string }>
  totalCount: number
}

/** Displays a list of documents affected by tag operations */
function DocumentList({ documents, totalCount }: DocumentListProps) {
  const displayLimit = 5
  const hasMore = totalCount > displayLimit

  return (
    <div className='rounded-[4px] border'>
      <div className='max-h-[160px] overflow-y-auto'>
        {documents.slice(0, displayLimit).map((doc) => {
          const DocumentIcon = getDocumentIcon('', doc.name)
          return (
            <div
              key={doc.id}
              className='flex items-center gap-[8px] border-b p-[8px] last:border-b-0'
            >
              <DocumentIcon className='h-4 w-4 flex-shrink-0 text-[var(--text-muted)]' />
              <span className='min-w-0 max-w-[120px] truncate text-[12px] text-[var(--text-primary)]'>
                {doc.name}
              </span>
              {doc.tagValue && (
                <>
                  <div className='mb-[-1.5px] h-[14px] w-[1.25px] flex-shrink-0 rounded-full bg-[#3A3A3A]' />
                  <span className='min-w-0 flex-1 truncate text-[11px] text-[var(--text-muted)]'>
                    {doc.tagValue}
                  </span>
                </>
              )}
            </div>
          )
        })}
        {hasMore && (
          <div className='p-[8px] text-[11px] text-[var(--text-muted)]'>
            and {totalCount - displayLimit} more documents
          </div>
        )}
      </div>
    </div>
  )
}

interface BaseTagsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  knowledgeBaseId: string
}

export function BaseTagsModal({ open, onOpenChange, knowledgeBaseId }: BaseTagsModalProps) {
  const { tagDefinitions: kbTagDefinitions, fetchTagDefinitions: refreshTagDefinitions } =
    useKnowledgeBaseTagDefinitions(knowledgeBaseId)

  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<TagDefinition | null>(null)
  const [viewDocumentsDialogOpen, setViewDocumentsDialogOpen] = useState(false)
  const [isDeletingTag, setIsDeletingTag] = useState(false)
  const [tagUsageData, setTagUsageData] = useState<TagUsageData[]>([])
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [isSavingTag, setIsSavingTag] = useState(false)
  const [createTagForm, setCreateTagForm] = useState({
    displayName: '',
    fieldType: 'text',
  })

  const fetchTagUsage = useCallback(async () => {
    if (!knowledgeBaseId) return

    try {
      const response = await fetch(`/api/knowledge/${knowledgeBaseId}/tag-usage`)
      if (!response.ok) {
        throw new Error('Failed to fetch tag usage')
      }
      const result = await response.json()
      if (result.success) {
        setTagUsageData(result.data)
      }
    } catch (error) {
      logger.error('Error fetching tag usage:', error)
    }
  }, [knowledgeBaseId])

  useEffect(() => {
    if (open) {
      fetchTagUsage()
    }
  }, [open, fetchTagUsage])

  const getTagUsage = (tagSlot: string): TagUsageData => {
    return (
      tagUsageData.find((usage) => usage.tagSlot === tagSlot) || {
        tagName: '',
        tagSlot,
        documentCount: 0,
        documents: [],
      }
    )
  }

  const handleDeleteTagClick = async (tag: TagDefinition) => {
    setSelectedTag(tag)
    await fetchTagUsage()
    setDeleteTagDialogOpen(true)
  }

  const handleViewDocuments = async (tag: TagDefinition) => {
    setSelectedTag(tag)
    await fetchTagUsage()
    setViewDocumentsDialogOpen(true)
  }

  const openTagCreator = () => {
    setCreateTagForm({
      displayName: '',
      fieldType: 'text',
    })
    setIsCreatingTag(true)
  }

  const cancelCreatingTag = () => {
    setCreateTagForm({
      displayName: '',
      fieldType: 'text',
    })
    setIsCreatingTag(false)
  }

  const hasTagNameConflict = (name: string) => {
    if (!name.trim()) return false
    return kbTagDefinitions.some(
      (tag) => tag.displayName.toLowerCase() === name.trim().toLowerCase()
    )
  }

  const tagNameConflict =
    isCreatingTag && !isSavingTag && hasTagNameConflict(createTagForm.displayName)

  const canSaveTag = () => {
    return createTagForm.displayName.trim() && !hasTagNameConflict(createTagForm.displayName)
  }

  const saveTagDefinition = async () => {
    if (!canSaveTag()) return

    setIsSavingTag(true)
    try {
      const usedSlots = new Set(kbTagDefinitions.map((def) => def.tagSlot))
      const availableSlot = (
        ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7'] as const
      ).find((slot) => !usedSlots.has(slot))

      if (!availableSlot) {
        throw new Error('No available tag slots')
      }

      const newTagDefinition = {
        tagSlot: availableSlot,
        displayName: createTagForm.displayName.trim(),
        fieldType: createTagForm.fieldType,
      }

      const response = await fetch(`/api/knowledge/${knowledgeBaseId}/tag-definitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTagDefinition),
      })

      if (!response.ok) {
        throw new Error('Failed to create tag definition')
      }

      await Promise.all([refreshTagDefinitions(), fetchTagUsage()])

      setCreateTagForm({
        displayName: '',
        fieldType: 'text',
      })
      setIsCreatingTag(false)
    } catch (error) {
      logger.error('Error creating tag definition:', error)
    } finally {
      setIsSavingTag(false)
    }
  }

  const confirmDeleteTag = async () => {
    if (!selectedTag) return

    setIsDeletingTag(true)
    try {
      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/tag-definitions/${selectedTag.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete tag definition: ${response.status} ${errorText}`)
      }

      await Promise.all([refreshTagDefinitions(), fetchTagUsage()])

      setDeleteTagDialogOpen(false)
      setSelectedTag(null)
    } catch (error) {
      logger.error('Error deleting tag definition:', error)
    } finally {
      setIsDeletingTag(false)
    }
  }

  const selectedTagUsage = selectedTag ? getTagUsage(selectedTag.tagSlot) : null

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setIsCreatingTag(false)
      setCreateTagForm({
        displayName: '',
        fieldType: 'text',
      })
    }
    onOpenChange(openState)
  }

  return (
    <>
      <Modal open={open} onOpenChange={handleClose}>
        <ModalContent>
          <ModalHeader>
            <div className='flex items-center justify-between'>
              <span>Tags</span>
            </div>
          </ModalHeader>

          <ModalBody className='!pb-[16px]'>
            <div className='min-h-0 flex-1 overflow-y-auto'>
              <div className='space-y-[8px]'>
                <Label>
                  Tags:{' '}
                  <span className='pl-[6px] text-[var(--text-tertiary)]'>
                    {kbTagDefinitions.length}/{MAX_TAG_SLOTS} slots used
                  </span>
                </Label>

                {kbTagDefinitions.length === 0 && !isCreatingTag && (
                  <div className='rounded-[6px] border p-[16px] text-center'>
                    <p className='text-[12px] text-[var(--text-tertiary)]'>
                      No tag definitions yet. Create your first tag to organize documents.
                    </p>
                  </div>
                )}

                {kbTagDefinitions.map((tag) => {
                  const usage = getTagUsage(tag.tagSlot)
                  return (
                    <div
                      key={tag.id}
                      className='flex cursor-pointer items-center gap-2 rounded-[4px] border p-[8px] hover:bg-[var(--surface-2)]'
                      onClick={() => handleViewDocuments(tag)}
                    >
                      <span className='min-w-0 truncate text-[12px] text-[var(--text-primary)]'>
                        {tag.displayName}
                      </span>
                      <div className='mb-[-1.5px] h-[14px] w-[1.25px] flex-shrink-0 rounded-full bg-[#3A3A3A]' />
                      <span className='min-w-0 flex-1 text-[11px] text-[var(--text-muted)]'>
                        {usage.documentCount} document{usage.documentCount !== 1 ? 's' : ''}
                      </span>
                      <div className='flex flex-shrink-0 items-center gap-1'>
                        <Button
                          variant='ghost'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTagClick(tag)
                          }}
                          className='h-4 w-4 p-0 text-[var(--text-muted)] hover:text-[var(--text-error)]'
                        >
                          <Trash className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {!isCreatingTag && (
                  <Button
                    variant='default'
                    onClick={openTagCreator}
                    disabled={kbTagDefinitions.length >= MAX_TAG_SLOTS}
                    className='w-full'
                  >
                    Add Tag
                  </Button>
                )}

                {isCreatingTag && (
                  <div className='space-y-[8px] rounded-[6px] border p-[12px]'>
                    <div className='flex flex-col gap-[8px]'>
                      <Label htmlFor='tagName'>Tag Name</Label>
                      <Input
                        id='tagName'
                        value={createTagForm.displayName}
                        onChange={(e) =>
                          setCreateTagForm({ ...createTagForm, displayName: e.target.value })
                        }
                        placeholder='Enter tag name'
                        className={cn(tagNameConflict && 'border-[var(--text-error)]')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && canSaveTag()) {
                            e.preventDefault()
                            saveTagDefinition()
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            cancelCreatingTag()
                          }
                        }}
                      />
                      {tagNameConflict && (
                        <span className='text-[11px] text-[var(--text-error)]'>
                          A tag with this name already exists
                        </span>
                      )}
                    </div>

                    {/* Type selector commented out - only "text" type is currently supported
                    <div className='flex flex-col gap-[8px]'>
                      <Label htmlFor='tagType'>Type</Label>
                      <Input id='tagType' value='Text' disabled className='capitalize' />
                    </div>
                    */}

                    <div className='flex gap-[8px]'>
                      <Button variant='default' onClick={cancelCreatingTag} className='flex-1'>
                        Cancel
                      </Button>
                      <Button
                        variant='primary'
                        onClick={saveTagDefinition}
                        className='flex-1'
                        disabled={!canSaveTag() || isSavingTag}
                      >
                        {isSavingTag ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Creating...
                          </>
                        ) : (
                          'Create Tag'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant='default' onClick={() => handleClose(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Tag Confirmation Dialog */}
      <Modal open={deleteTagDialogOpen} onOpenChange={setDeleteTagDialogOpen}>
        <ModalContent size='sm'>
          <ModalHeader>Delete Tag</ModalHeader>
          <ModalBody className='!pb-[16px]'>
            <div className='space-y-[8px]'>
              <p className='text-[12px] text-[var(--text-tertiary)]'>
                Are you sure you want to delete the "{selectedTag?.displayName}" tag? This will
                remove this tag from {selectedTagUsage?.documentCount || 0} document
                {selectedTagUsage?.documentCount !== 1 ? 's' : ''}.{' '}
                <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
              </p>

              {selectedTagUsage && selectedTagUsage.documentCount > 0 && (
                <div className='flex flex-col gap-[8px]'>
                  <Label>Affected documents:</Label>
                  <DocumentList
                    documents={selectedTagUsage.documents}
                    totalCount={selectedTagUsage.documentCount}
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='default'
              disabled={isDeletingTag}
              onClick={() => setDeleteTagDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={confirmDeleteTag}
              disabled={isDeletingTag}
              className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
            >
              {isDeletingTag ? <>Deleting...</> : 'Delete Tag'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Documents Dialog */}
      <Modal open={viewDocumentsDialogOpen} onOpenChange={setViewDocumentsDialogOpen}>
        <ModalContent size='sm'>
          <ModalHeader>Documents using "{selectedTag?.displayName}"</ModalHeader>
          <ModalBody className='!pb-[16px]'>
            <div className='space-y-[8px]'>
              <p className='text-[12px] text-[var(--text-tertiary)]'>
                {selectedTagUsage?.documentCount || 0} document
                {selectedTagUsage?.documentCount !== 1 ? 's are' : ' is'} currently using this tag
                definition.
              </p>

              {selectedTagUsage?.documentCount === 0 ? (
                <div className='rounded-[6px] border p-[16px] text-center'>
                  <p className='text-[12px] text-[var(--text-tertiary)]'>
                    This tag definition is not being used by any documents. You can safely delete it
                    to free up the tag slot.
                  </p>
                </div>
              ) : (
                <DocumentList
                  documents={selectedTagUsage?.documents || []}
                  totalCount={selectedTagUsage?.documentCount || 0}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant='default' onClick={() => setViewDocumentsDialogOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

--------------------------------------------------------------------------------

````
