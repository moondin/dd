---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 355
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 355 of 933)

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
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/page.tsx

```typescript
import { Document } from '@/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/document'

interface DocumentPageProps {
  params: Promise<{
    id: string
    documentId: string
  }>
  searchParams: Promise<{
    kbName?: string
    docName?: string
  }>
}

export default async function DocumentChunksPage({ params, searchParams }: DocumentPageProps) {
  const { id, documentId } = await params
  const { kbName, docName } = await searchParams

  return (
    <Document
      knowledgeBaseId={id}
      documentId={documentId}
      knowledgeBaseName={kbName || 'Knowledge Base'}
      documentName={docName || 'Document'}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/components/index.ts

```typescript
export { CreateChunkModal } from './create-chunk-modal/create-chunk-modal'
export { DeleteChunkModal } from './delete-chunk-modal/delete-chunk-modal'
export { DocumentTagsModal } from './document-tags-modal/document-tags-modal'
export { EditChunkModal } from './edit-chunk-modal/edit-chunk-modal'
```

--------------------------------------------------------------------------------

---[FILE: create-chunk-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/components/create-chunk-modal/create-chunk-modal.tsx
Signals: React

```typescript
'use client'

import { useRef, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import type { ChunkData, DocumentData } from '@/stores/knowledge/store'

const logger = createLogger('CreateChunkModal')

interface CreateChunkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: DocumentData | null
  knowledgeBaseId: string
  onChunkCreated?: (chunk: ChunkData) => void
}

export function CreateChunkModal({
  open,
  onOpenChange,
  document,
  knowledgeBaseId,
  onChunkCreated,
}: CreateChunkModalProps) {
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false)
  const isProcessingRef = useRef(false)

  const hasUnsavedChanges = content.trim().length > 0

  const handleCreateChunk = async () => {
    if (!document || content.trim().length === 0 || isProcessingRef.current) {
      if (isProcessingRef.current) {
        logger.warn('Chunk creation already in progress, ignoring duplicate request')
      }
      return
    }

    try {
      isProcessingRef.current = true
      setIsCreating(true)
      setError(null)

      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${document.id}/chunks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: content.trim(),
            enabled: true,
          }),
        }
      )

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create chunk')
      }

      const result = await response.json()

      if (result.success && result.data) {
        logger.info('Chunk created successfully:', result.data.id)

        if (onChunkCreated) {
          onChunkCreated(result.data)
        }

        onClose()
      } else {
        throw new Error(result.error || 'Failed to create chunk')
      }
    } catch (err) {
      logger.error('Error creating chunk:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      isProcessingRef.current = false
      setIsCreating(false)
    }
  }

  const onClose = () => {
    onOpenChange(false)
    // Reset form state when modal closes
    setContent('')
    setError(null)
    setShowUnsavedChangesAlert(false)
  }

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && !isCreating) {
      setShowUnsavedChangesAlert(true)
    } else {
      onClose()
    }
  }

  const handleConfirmDiscard = () => {
    setShowUnsavedChangesAlert(false)
    onClose()
  }

  const isFormValid = content.trim().length > 0 && content.trim().length <= 10000

  return (
    <>
      <Modal open={open} onOpenChange={handleCloseAttempt}>
        <ModalContent size='lg'>
          <ModalHeader>Create Chunk</ModalHeader>

          <form>
            <ModalBody className='!pb-[16px]'>
              <div className='flex flex-col gap-[8px]'>
                {/* Error Display */}
                {error && (
                  <div className='flex items-center gap-2 rounded-md border border-[var(--text-error)]/50 bg-[var(--text-error)]/10 p-3'>
                    <AlertCircle className='h-4 w-4 text-[var(--text-error)]' />
                    <p className='text-[var(--text-error)] text-sm'>{error}</p>
                  </div>
                )}

                {/* Content Input Section */}
                <Label htmlFor='content'>Chunk</Label>
                <Textarea
                  id='content'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='Enter the content for this chunk...'
                  rows={12}
                  disabled={isCreating}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant='default'
                onClick={handleCloseAttempt}
                type='button'
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                onClick={handleCreateChunk}
                type='button'
                disabled={!isFormValid || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Chunk'
                )}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Unsaved Changes Alert */}
      <Modal open={showUnsavedChangesAlert} onOpenChange={setShowUnsavedChangesAlert}>
        <ModalContent size='sm'>
          <ModalHeader>Discard Changes</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              You have unsaved changes. Are you sure you want to close without saving?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='default'
              onClick={() => setShowUnsavedChangesAlert(false)}
              type='button'
            >
              Keep Editing
            </Button>
            <Button
              variant='primary'
              onClick={handleConfirmDiscard}
              type='button'
              className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
            >
              Discard Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: delete-chunk-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/components/delete-chunk-modal/delete-chunk-modal.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'
import type { ChunkData } from '@/stores/knowledge/store'

const logger = createLogger('DeleteChunkModal')

interface DeleteChunkModalProps {
  chunk: ChunkData | null
  knowledgeBaseId: string
  documentId: string
  isOpen: boolean
  onClose: () => void
  onChunkDeleted?: () => void
}

export function DeleteChunkModal({
  chunk,
  knowledgeBaseId,
  documentId,
  isOpen,
  onClose,
  onChunkDeleted,
}: DeleteChunkModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteChunk = async () => {
    if (!chunk || isDeleting) return

    try {
      setIsDeleting(true)

      const response = await fetch(
        `/api/knowledge/${knowledgeBaseId}/documents/${documentId}/chunks/${chunk.id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete chunk')
      }

      const result = await response.json()

      if (result.success) {
        logger.info('Chunk deleted successfully:', chunk.id)
        if (onChunkDeleted) {
          onChunkDeleted()
        }
        onClose()
      } else {
        throw new Error(result.error || 'Failed to delete chunk')
      }
    } catch (err) {
      logger.error('Error deleting chunk:', err)
      // You might want to show an error state here
    } finally {
      setIsDeleting(false)
    }
  }

  if (!chunk) return null

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size='sm'>
        <ModalHeader>Delete Chunk</ModalHeader>
        <ModalBody>
          <p className='text-[12px] text-[var(--text-tertiary)]'>
            Are you sure you want to delete this chunk?{' '}
            <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant='active' disabled={isDeleting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={handleDeleteChunk}
            disabled={isDeleting}
            className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
          >
            {isDeleting ? <>Deleting...</> : <>Delete</>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: document-tags-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/knowledge/[id]/[documentId]/components/document-tags-modal/document-tags-modal.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Button,
  Combobox,
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
import { MAX_TAG_SLOTS, TAG_SLOTS, type TagSlot } from '@/lib/knowledge/constants'
import type { DocumentTag } from '@/lib/knowledge/tags/types'
import { createLogger } from '@/lib/logs/console/logger'
import {
  type TagDefinition,
  useKnowledgeBaseTagDefinitions,
} from '@/hooks/use-knowledge-base-tag-definitions'
import { useNextAvailableSlot } from '@/hooks/use-next-available-slot'
import { type TagDefinitionInput, useTagDefinitions } from '@/hooks/use-tag-definitions'
import { type DocumentData, useKnowledgeStore } from '@/stores/knowledge/store'

const logger = createLogger('DocumentTagsModal')

interface DocumentTagsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  knowledgeBaseId: string
  documentId: string
  documentData: DocumentData | null
  onDocumentUpdate?: (updates: Record<string, string>) => void
}

export function DocumentTagsModal({
  open,
  onOpenChange,
  knowledgeBaseId,
  documentId,
  documentData,
  onDocumentUpdate,
}: DocumentTagsModalProps) {
  const { updateDocument: updateDocumentInStore } = useKnowledgeStore()

  const documentTagHook = useTagDefinitions(knowledgeBaseId, documentId)
  const kbTagHook = useKnowledgeBaseTagDefinitions(knowledgeBaseId)
  const { getNextAvailableSlot: getServerNextSlot } = useNextAvailableSlot(knowledgeBaseId)

  const { saveTagDefinitions, tagDefinitions, fetchTagDefinitions } = documentTagHook
  const { tagDefinitions: kbTagDefinitions, fetchTagDefinitions: refreshTagDefinitions } = kbTagHook

  const [documentTags, setDocumentTags] = useState<DocumentTag[]>([])
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null)
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [isSavingTag, setIsSavingTag] = useState(false)
  const [editTagForm, setEditTagForm] = useState({
    displayName: '',
    fieldType: 'text',
    value: '',
  })

  const buildDocumentTags = useCallback((docData: DocumentData, definitions: TagDefinition[]) => {
    const tags: DocumentTag[] = []

    TAG_SLOTS.forEach((slot) => {
      const value = docData[slot] as string | null | undefined
      const definition = definitions.find((def) => def.tagSlot === slot)

      if (value?.trim() && definition) {
        tags.push({
          slot,
          displayName: definition.displayName,
          fieldType: definition.fieldType,
          value: value.trim(),
        })
      }
    })

    return tags
  }, [])

  const handleTagsChange = useCallback((newTags: DocumentTag[]) => {
    setDocumentTags(newTags)
  }, [])

  const handleSaveDocumentTags = useCallback(
    async (tagsToSave: DocumentTag[]) => {
      if (!documentData) return

      try {
        const tagData: Record<string, string> = {}

        TAG_SLOTS.forEach((slot) => {
          tagData[slot] = ''
        })

        tagsToSave.forEach((tag) => {
          if (tag.value.trim()) {
            tagData[tag.slot] = tag.value.trim()
          }
        })

        const response = await fetch(`/api/knowledge/${knowledgeBaseId}/documents/${documentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tagData),
        })

        if (!response.ok) {
          throw new Error('Failed to update document tags')
        }

        updateDocumentInStore(knowledgeBaseId, documentId, tagData)
        onDocumentUpdate?.(tagData)

        await fetchTagDefinitions()
      } catch (error) {
        logger.error('Error updating document tags:', error)
        throw error
      }
    },
    [
      documentData,
      knowledgeBaseId,
      documentId,
      updateDocumentInStore,
      fetchTagDefinitions,
      onDocumentUpdate,
    ]
  )

  const handleRemoveTag = async (index: number) => {
    const updatedTags = documentTags.filter((_, i) => i !== index)
    handleTagsChange(updatedTags)

    try {
      await handleSaveDocumentTags(updatedTags)
    } catch (error) {
      logger.error('Error removing tag:', error)
    }
  }

  const startEditingTag = (index: number) => {
    const tag = documentTags[index]
    setEditingTagIndex(index)
    setEditTagForm({
      displayName: tag.displayName,
      fieldType: tag.fieldType,
      value: tag.value,
    })
    setIsCreatingTag(false)
  }

  const openTagCreator = () => {
    setEditingTagIndex(null)
    setEditTagForm({
      displayName: '',
      fieldType: 'text',
      value: '',
    })
    setIsCreatingTag(true)
  }

  const cancelEditingTag = () => {
    setEditTagForm({
      displayName: '',
      fieldType: 'text',
      value: '',
    })
    setEditingTagIndex(null)
    setIsCreatingTag(false)
  }

  const hasTagNameConflict = (name: string) => {
    if (!name.trim()) return false

    return documentTags.some((tag, index) => {
      if (editingTagIndex !== null && index === editingTagIndex) {
        return false
      }
      return tag.displayName.toLowerCase() === name.trim().toLowerCase()
    })
  }

  const availableDefinitions = kbTagDefinitions.filter((def) => {
    return !documentTags.some(
      (tag) => tag.displayName.toLowerCase() === def.displayName.toLowerCase()
    )
  })

  const tagNameOptions = availableDefinitions.map((def) => ({
    label: def.displayName,
    value: def.displayName,
  }))

  const saveDocumentTag = async () => {
    if (!editTagForm.displayName.trim() || !editTagForm.value.trim()) return

    const formData = { ...editTagForm }
    const currentEditingIndex = editingTagIndex
    const originalTag = currentEditingIndex !== null ? documentTags[currentEditingIndex] : null
    setEditingTagIndex(null)
    setIsCreatingTag(false)
    setIsSavingTag(true)

    try {
      let targetSlot: string

      if (currentEditingIndex !== null && originalTag) {
        targetSlot = originalTag.slot
      } else {
        const existingDefinition = kbTagDefinitions.find(
          (def) => def.displayName.toLowerCase() === formData.displayName.toLowerCase()
        )

        if (existingDefinition) {
          targetSlot = existingDefinition.tagSlot
        } else {
          const serverSlot = await getServerNextSlot(formData.fieldType)
          if (!serverSlot) {
            throw new Error(`No available slots for new tag of type '${formData.fieldType}'`)
          }
          targetSlot = serverSlot
        }
      }

      let updatedTags: DocumentTag[]
      if (currentEditingIndex !== null) {
        updatedTags = [...documentTags]
        updatedTags[currentEditingIndex] = {
          ...updatedTags[currentEditingIndex],
          displayName: formData.displayName,
          fieldType: formData.fieldType,
          value: formData.value,
        }
      } else {
        const newTag: DocumentTag = {
          slot: targetSlot,
          displayName: formData.displayName,
          fieldType: formData.fieldType,
          value: formData.value,
        }
        updatedTags = [...documentTags, newTag]
      }

      handleTagsChange(updatedTags)

      if (currentEditingIndex !== null && originalTag) {
        const currentDefinition = kbTagDefinitions.find(
          (def) => def.displayName.toLowerCase() === originalTag.displayName.toLowerCase()
        )

        if (currentDefinition) {
          const updatedDefinition: TagDefinitionInput = {
            displayName: formData.displayName,
            fieldType: currentDefinition.fieldType,
            tagSlot: currentDefinition.tagSlot,
            _originalDisplayName: originalTag.displayName,
          }

          if (saveTagDefinitions) {
            await saveTagDefinitions([updatedDefinition])
          }
          await refreshTagDefinitions()
        }
      } else {
        const existingDefinition = kbTagDefinitions.find(
          (def) => def.displayName.toLowerCase() === formData.displayName.toLowerCase()
        )

        if (!existingDefinition) {
          const newDefinition: TagDefinitionInput = {
            displayName: formData.displayName,
            fieldType: formData.fieldType,
            tagSlot: targetSlot as TagSlot,
          }

          if (saveTagDefinitions) {
            await saveTagDefinitions([newDefinition])
          }
          await refreshTagDefinitions()
        }
      }

      await handleSaveDocumentTags(updatedTags)

      setEditTagForm({
        displayName: '',
        fieldType: 'text',
        value: '',
      })
    } catch (error) {
      logger.error('Error saving tag:', error)
    } finally {
      setIsSavingTag(false)
    }
  }

  const isTagEditing = editingTagIndex !== null || isCreatingTag
  const tagNameConflict = hasTagNameConflict(editTagForm.displayName)

  const hasTagChanges = () => {
    if (editingTagIndex === null) return true

    const originalTag = documentTags[editingTagIndex]
    if (!originalTag) return true

    return (
      originalTag.displayName !== editTagForm.displayName ||
      originalTag.value !== editTagForm.value ||
      originalTag.fieldType !== editTagForm.fieldType
    )
  }

  const canSaveTag =
    editTagForm.displayName.trim() &&
    editTagForm.value.trim() &&
    !tagNameConflict &&
    hasTagChanges()

  const canAddNewTag = kbTagDefinitions.length < MAX_TAG_SLOTS || availableDefinitions.length > 0

  useEffect(() => {
    if (documentData && tagDefinitions && !isSavingTag) {
      const rebuiltTags = buildDocumentTags(documentData, tagDefinitions)
      setDocumentTags(rebuiltTags)
    }
  }, [documentData, tagDefinitions, buildDocumentTags, isSavingTag])

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setIsCreatingTag(false)
      setEditingTagIndex(null)
      setEditTagForm({
        displayName: '',
        fieldType: 'text',
        value: '',
      })
    }
    onOpenChange(openState)
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>
          <div className='flex items-center justify-between'>
            <span>Document Tags</span>
          </div>
        </ModalHeader>

        <ModalBody className='!pb-[16px]'>
          <div className='min-h-0 flex-1 overflow-y-auto'>
            <div className='space-y-[8px]'>
              <Label>
                Tags{' '}
                <span className='pl-[6px] text-[var(--text-tertiary)]'>
                  {documentTags.length}/{MAX_TAG_SLOTS} slots used
                </span>
              </Label>

              {documentTags.length === 0 && !isCreatingTag && (
                <div className='rounded-[6px] border p-[16px] text-center'>
                  <p className='text-[12px] text-[var(--text-tertiary)]'>
                    No tags added yet. Add tags to help organize this document.
                  </p>
                </div>
              )}

              {documentTags.map((tag, index) => (
                <div key={index} className='space-y-[8px]'>
                  <div
                    className='flex cursor-pointer items-center gap-2 rounded-[4px] border p-[8px] hover:bg-[var(--surface-2)]'
                    onClick={() => startEditingTag(index)}
                  >
                    <span className='min-w-0 truncate text-[12px] text-[var(--text-primary)]'>
                      {tag.displayName}
                    </span>
                    <div className='mb-[-1.5px] h-[14px] w-[1.25px] flex-shrink-0 rounded-full bg-[#3A3A3A]' />
                    <span className='min-w-0 flex-1 truncate text-[11px] text-[var(--text-muted)]'>
                      {tag.value}
                    </span>
                    <div className='flex flex-shrink-0 items-center gap-1'>
                      <Button
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveTag(index)
                        }}
                        className='h-4 w-4 p-0 text-[var(--text-muted)] hover:text-[var(--text-error)]'
                      >
                        <Trash className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>

                  {editingTagIndex === index && (
                    <div className='space-y-[8px] rounded-[6px] border p-[12px]'>
                      <div className='flex flex-col gap-[8px]'>
                        <Label htmlFor={`tagName-${index}`}>Tag Name</Label>
                        {availableDefinitions.length > 0 ? (
                          <Combobox
                            id={`tagName-${index}`}
                            options={tagNameOptions}
                            value={editTagForm.displayName}
                            selectedValue={editTagForm.displayName}
                            onChange={(value) => {
                              const def = kbTagDefinitions.find(
                                (d) => d.displayName.toLowerCase() === value.toLowerCase()
                              )
                              setEditTagForm({
                                ...editTagForm,
                                displayName: value,
                                fieldType: def?.fieldType || 'text',
                              })
                            }}
                            placeholder='Enter or select tag name'
                            editable={true}
                            className={cn(tagNameConflict && 'border-[var(--text-error)]')}
                          />
                        ) : (
                          <Input
                            id={`tagName-${index}`}
                            value={editTagForm.displayName}
                            onChange={(e) =>
                              setEditTagForm({ ...editTagForm, displayName: e.target.value })
                            }
                            placeholder='Enter tag name'
                            className={cn(tagNameConflict && 'border-[var(--text-error)]')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && canSaveTag) {
                                e.preventDefault()
                                saveDocumentTag()
                              }
                              if (e.key === 'Escape') {
                                e.preventDefault()
                                cancelEditingTag()
                              }
                            }}
                          />
                        )}
                        {tagNameConflict && (
                          <span className='text-[11px] text-[var(--text-error)]'>
                            A tag with this name already exists
                          </span>
                        )}
                      </div>

                      {/* Type selector commented out - only "text" type is currently supported
                      <div className='flex flex-col gap-[8px]'>
                        <Label htmlFor={`tagType-${index}`}>Type</Label>
                        <Input id={`tagType-${index}`} value='Text' disabled className='capitalize' />
                      </div>
                      */}

                      <div className='flex flex-col gap-[8px]'>
                        <Label htmlFor={`tagValue-${index}`}>Value</Label>
                        <Input
                          id={`tagValue-${index}`}
                          value={editTagForm.value}
                          onChange={(e) =>
                            setEditTagForm({ ...editTagForm, value: e.target.value })
                          }
                          placeholder='Enter tag value'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && canSaveTag) {
                              e.preventDefault()
                              saveDocumentTag()
                            }
                            if (e.key === 'Escape') {
                              e.preventDefault()
                              cancelEditingTag()
                            }
                          }}
                        />
                      </div>

                      <div className='flex gap-[8px]'>
                        <Button variant='default' onClick={cancelEditingTag} className='flex-1'>
                          Cancel
                        </Button>
                        <Button
                          variant='primary'
                          onClick={saveDocumentTag}
                          className='flex-1'
                          disabled={!canSaveTag}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {!isTagEditing && (
                <Button
                  variant='default'
                  onClick={openTagCreator}
                  disabled={!canAddNewTag}
                  className='w-full'
                >
                  Add Tag
                </Button>
              )}

              {isCreatingTag && (
                <div className='space-y-[8px] rounded-[6px] border p-[12px]'>
                  <div className='flex flex-col gap-[8px]'>
                    <Label htmlFor='newTagName'>Tag Name</Label>
                    {tagNameOptions.length > 0 ? (
                      <Combobox
                        id='newTagName'
                        options={tagNameOptions}
                        value={editTagForm.displayName}
                        selectedValue={editTagForm.displayName}
                        onChange={(value) => {
                          const def = kbTagDefinitions.find(
                            (d) => d.displayName.toLowerCase() === value.toLowerCase()
                          )
                          setEditTagForm({
                            ...editTagForm,
                            displayName: value,
                            fieldType: def?.fieldType || 'text',
                          })
                        }}
                        placeholder='Enter or select tag name'
                        editable={true}
                        className={cn(tagNameConflict && 'border-[var(--text-error)]')}
                      />
                    ) : (
                      <Input
                        id='newTagName'
                        value={editTagForm.displayName}
                        onChange={(e) =>
                          setEditTagForm({ ...editTagForm, displayName: e.target.value })
                        }
                        placeholder='Enter tag name'
                        className={cn(tagNameConflict && 'border-[var(--text-error)]')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && canSaveTag) {
                            e.preventDefault()
                            saveDocumentTag()
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            cancelEditingTag()
                          }
                        }}
                      />
                    )}
                    {tagNameConflict && (
                      <span className='text-[11px] text-[var(--text-error)]'>
                        A tag with this name already exists
                      </span>
                    )}
                  </div>

                  {/* Type selector commented out - only "text" type is currently supported
                  <div className='flex flex-col gap-[8px]'>
                    <Label htmlFor='newTagType'>Type</Label>
                    <Input id='newTagType' value='Text' disabled className='capitalize' />
                  </div>
                  */}

                  <div className='flex flex-col gap-[8px]'>
                    <Label htmlFor='newTagValue'>Value</Label>
                    <Input
                      id='newTagValue'
                      value={editTagForm.value}
                      onChange={(e) => setEditTagForm({ ...editTagForm, value: e.target.value })}
                      placeholder='Enter tag value'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && canSaveTag) {
                          e.preventDefault()
                          saveDocumentTag()
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          cancelEditingTag()
                        }
                      }}
                    />
                  </div>

                  {kbTagDefinitions.length >= MAX_TAG_SLOTS &&
                    !kbTagDefinitions.find(
                      (def) =>
                        def.displayName.toLowerCase() === editTagForm.displayName.toLowerCase()
                    ) && (
                      <div className='rounded-[4px] border border-amber-500/50 bg-amber-500/10 p-[8px]'>
                        <p className='text-[11px] text-amber-600 dark:text-amber-400'>
                          Maximum tag definitions reached. You can still use existing tag
                          definitions, but cannot create new ones.
                        </p>
                      </div>
                    )}

                  <div className='flex gap-[8px]'>
                    <Button variant='default' onClick={cancelEditingTag} className='flex-1'>
                      Cancel
                    </Button>
                    <Button
                      variant='primary'
                      onClick={saveDocumentTag}
                      className='flex-1'
                      disabled={
                        !canSaveTag ||
                        isSavingTag ||
                        (kbTagDefinitions.length >= MAX_TAG_SLOTS &&
                          !kbTagDefinitions.find(
                            (def) =>
                              def.displayName.toLowerCase() ===
                              editTagForm.displayName.toLowerCase()
                          ))
                      }
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
  )
}
```

--------------------------------------------------------------------------------

````
