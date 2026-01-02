---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 368
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 368 of 933)

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

---[FILE: help-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/help-modal/help-modal.tsx
Signals: React, Next.js, Zod

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import imageCompression from 'browser-image-compression'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
  Textarea,
} from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('HelpModal')

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB maximum upload size
const TARGET_SIZE_MB = 2 // Target size after compression
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

const SCROLL_DELAY_MS = 100
const SUCCESS_RESET_DELAY_MS = 2000

const DEFAULT_REQUEST_TYPE = 'bug'

const REQUEST_TYPE_OPTIONS = [
  { label: 'Bug Report', value: 'bug' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Feature Request', value: 'feature_request' },
  { label: 'Other', value: 'other' },
]

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['bug', 'feedback', 'feature_request', 'other'], {
    required_error: 'Please select a request type',
  }),
})

type FormValues = z.infer<typeof formSchema>

interface ImageWithPreview extends File {
  preview: string
}

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [images, setImages] = useState<ImageWithPreview[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      message: '',
      type: DEFAULT_REQUEST_TYPE,
    },
    mode: 'onSubmit',
  })

  /**
   * Reset all state when modal opens/closes
   */
  useEffect(() => {
    if (open) {
      setSubmitStatus(null)
      setImages([])
      setIsDragging(false)
      setIsProcessing(false)
      reset({
        subject: '',
        message: '',
        type: DEFAULT_REQUEST_TYPE,
      })
    }
  }, [open, reset])

  /**
   * Fix z-index for popover/dropdown when inside modal
   */
  useEffect(() => {
    if (!open) return

    const updatePopoverZIndex = () => {
      const allDivs = document.querySelectorAll('div')
      allDivs.forEach((div) => {
        const element = div as HTMLElement
        const computedZIndex = window.getComputedStyle(element).zIndex
        const zIndexNum = Number.parseInt(computedZIndex) || 0

        if (zIndexNum === 10000001 || (zIndexNum > 0 && zIndexNum <= 10000100)) {
          const hasPopoverStructure =
            element.hasAttribute('data-radix-popover-content') ||
            (element.hasAttribute('role') && element.getAttribute('role') === 'dialog') ||
            element.querySelector('[role="listbox"]') !== null ||
            element.classList.contains('rounded-[8px]') ||
            element.classList.contains('rounded-[4px]')

          if (hasPopoverStructure && element.offsetParent !== null) {
            element.style.zIndex = '10000101'
          }
        }
      })
    }

    // Create a style element to override popover z-index
    const styleId = 'help-modal-popover-z-index'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = `
      [data-radix-popover-content] {
        z-index: 10000101 !important;
      }
      div[style*="z-index: 10000001"],
      div[style*="z-index:10000001"] {
        z-index: 10000101 !important;
      }
    `

    const observer = new MutationObserver(() => {
      updatePopoverZIndex()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    updatePopoverZIndex()

    const intervalId = setInterval(updatePopoverZIndex, 100)

    return () => {
      const element = document.getElementById(styleId)
      if (element) {
        element.remove()
      }
      observer.disconnect()
      clearInterval(intervalId)
    }
  }, [open])

  /**
   * Set default form value for request type
   */
  useEffect(() => {
    setValue('type', DEFAULT_REQUEST_TYPE)
  }, [setValue])

  /**
   * Clean up image preview URLs to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  /**
   * Reset submit status back to normal after showing success for 2 seconds
   */
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus(null)
      }, SUCCESS_RESET_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  /**
   * Smooth scroll to bottom when new images are added
   */
  useEffect(() => {
    if (images.length > 0 && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        })
      }, SCROLL_DELAY_MS)
    }
  }, [images.length])

  /**
   * Compress image files to reduce upload size while maintaining quality
   * @param file - The image file to compress
   * @returns The compressed file or original if compression fails/is unnecessary
   */
  const compressImage = useCallback(async (file: File): Promise<File> => {
    // Skip compression for small files or GIFs (which don't compress well)
    if (file.size < TARGET_SIZE_MB * 1024 * 1024 || file.type === 'image/gif') {
      return file
    }

    const options = {
      maxSizeMB: TARGET_SIZE_MB,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.8,
      alwaysKeepResolution: true,
    }

    try {
      const compressedFile = await imageCompression(file, options)

      // Preserve original file metadata for compatibility
      return new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now(),
      })
    } catch (error) {
      logger.warn('Image compression failed, using original file:', { error })
      return file
    }
  }, [])

  /**
   * Process uploaded files: validate, compress, and prepare for preview
   * @param files - FileList or array of files to process
   */
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!files || files.length === 0) return

      setIsProcessing(true)

      try {
        const newImages: ImageWithPreview[] = []
        let hasError = false

        for (const file of Array.from(files)) {
          // Validate file size
          if (file.size > MAX_FILE_SIZE) {
            hasError = true
            continue
          }

          // Validate file type
          if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            hasError = true
            continue
          }

          // Compress and prepare image
          const compressedFile = await compressImage(file)
          const imageWithPreview = Object.assign(compressedFile, {
            preview: URL.createObjectURL(compressedFile),
          }) as ImageWithPreview

          newImages.push(imageWithPreview)
        }

        if (!hasError && newImages.length > 0) {
          setImages((prev) => [...prev, ...newImages])
        }
      } catch (error) {
        logger.error('Error processing images:', { error })
      } finally {
        setIsProcessing(false)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [compressImage]
  )

  /**
   * Handle file input change event
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        await processFiles(e.target.files)
      }
    },
    [processFiles]
  )

  /**
   * Drag and drop event handlers
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  /**
   * Remove an uploaded image and clean up its preview URL
   */
  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }, [])

  /**
   * Handle form submission with image attachments
   */
  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsSubmitting(true)
      setSubmitStatus(null)

      try {
        // Prepare form data with images
        const formData = new FormData()
        formData.append('subject', data.subject)
        formData.append('message', data.message)
        formData.append('type', data.type)

        // Attach all images to form data
        images.forEach((image, index) => {
          formData.append(`image_${index}`, image)
        })

        // Submit to API
        const response = await fetch('/api/help', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to submit help request')
        }

        // Handle success
        setSubmitStatus('success')
        reset()

        // Clean up resources
        images.forEach((image) => URL.revokeObjectURL(image.preview))
        setImages([])
      } catch (error) {
        logger.error('Error submitting help request:', { error })
        setSubmitStatus('error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [images, reset]
  )

  /**
   * Handle modal close action
   */
  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Help &amp; Support</ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='flex min-h-0 flex-1 flex-col'>
          <ModalBody className='!pb-[16px]'>
            <div ref={scrollContainerRef} className='min-h-0 flex-1 overflow-y-auto'>
              <div className='space-y-[12px]'>
                <div className='flex flex-col gap-[8px]'>
                  <Label htmlFor='type'>Request</Label>
                  <Combobox
                    id='type'
                    options={REQUEST_TYPE_OPTIONS}
                    value={watch('type') || DEFAULT_REQUEST_TYPE}
                    selectedValue={watch('type') || DEFAULT_REQUEST_TYPE}
                    onChange={(value) => setValue('type', value as FormValues['type'])}
                    placeholder='Select a request type'
                    editable={false}
                    filterOptions={false}
                    className={cn(errors.type && 'border-[var(--text-error)]')}
                  />
                </div>

                <div className='flex flex-col gap-[8px]'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input
                    id='subject'
                    placeholder='Brief description of your request'
                    {...register('subject')}
                    className={cn(errors.subject && 'border-[var(--text-error)]')}
                  />
                </div>

                <div className='flex flex-col gap-[8px]'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    placeholder='Please provide details about your request...'
                    rows={6}
                    {...register('message')}
                    className={cn(errors.message && 'border-[var(--text-error)]')}
                  />
                </div>

                <div className='flex flex-col gap-[8px]'>
                  <Label>Attach Images (Optional)</Label>
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
                      {
                        'border-[var(--brand-primary-hex)]': isDragging,
                      }
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      onChange={handleFileChange}
                      className='hidden'
                      multiple
                    />
                    <div className='flex flex-col gap-[2px] text-center'>
                      <span className='text-[var(--text-primary)]'>
                        {isDragging ? 'Drop images here' : 'Drop images here or click to browse'}
                      </span>
                      <span className='text-[11px] text-[var(--text-tertiary)]'>
                        PNG, JPEG, WebP, GIF (max 20MB each)
                      </span>
                    </div>
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className='space-y-2'>
                    <Label>Uploaded Images</Label>
                    <div className='grid grid-cols-2 gap-3'>
                      {images.map((image, index) => (
                        <div
                          className='group relative overflow-hidden rounded-[4px] border'
                          key={index}
                        >
                          <div className='relative flex max-h-[120px] min-h-[80px] w-full items-center justify-center'>
                            <Image
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              unoptimized
                              className='object-contain'
                            />
                            <button
                              type='button'
                              className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'
                              onClick={() => removeImage(index)}
                            >
                              <X className='h-[18px] w-[18px] text-white' />
                            </button>
                          </div>
                          <div className='truncate p-[6px] text-[12px]'>{image.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant='default' onClick={handleClose} type='button' disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={isSubmitting || isProcessing}>
              {isSubmitting
                ? 'Submitting...'
                : submitStatus === 'error'
                  ? 'Error'
                  : submitStatus === 'success'
                    ? 'Success'
                    : 'Submit'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: search-modal.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/search-modal/search-modal.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { BookOpen, Layout, RepeatIcon, ScrollText, Search, SplitIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Dialog, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import { useBrandConfig } from '@/lib/branding/branding'
import { cn } from '@/lib/core/utils/cn'
import { getTriggersForSidebar, hasTriggerCapability } from '@/lib/workflows/triggers/trigger-utils'
import { searchItems } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/search-modal/search-utils'
import { SIDEBAR_SCROLL_EVENT } from '@/app/workspace/[workspaceId]/w/components/sidebar/sidebar'
import { getAllBlocks } from '@/blocks'

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflows?: WorkflowItem[]
  workspaces?: WorkspaceItem[]
  isOnWorkflowPage?: boolean
}

interface WorkflowItem {
  id: string
  name: string
  href: string
  color: string
  isCurrent?: boolean
}

interface WorkspaceItem {
  id: string
  name: string
  href: string
  isCurrent?: boolean
}

interface BlockItem {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  bgColor: string
  type: string
  config?: any
}

interface ToolItem {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  bgColor: string
  type: string
}

interface PageItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  href: string
  shortcut?: string
}

interface DocItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  href: string
  type: 'main' | 'block' | 'tool'
}

type SearchItem = {
  id: string
  name: string
  description?: string
  icon?: React.ComponentType<any>
  bgColor?: string
  color?: string
  href?: string
  shortcut?: string
  type: 'block' | 'trigger' | 'tool' | 'workflow' | 'workspace' | 'page' | 'doc'
  isCurrent?: boolean
  blockType?: string
  config?: any
}

export function SearchModal({
  open,
  onOpenChange,
  workflows = [],
  workspaces = [],
  isOnWorkflowPage = false,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  const brand = useBrandConfig()

  const blocks = useMemo(() => {
    if (!isOnWorkflowPage) return []

    const allBlocks = getAllBlocks()
    const regularBlocks = allBlocks
      .filter(
        (block) => block.type !== 'starter' && !block.hideFromToolbar && block.category === 'blocks'
      )
      .map(
        (block): BlockItem => ({
          id: block.type,
          name: block.name,
          description: block.description || '',
          icon: block.icon,
          bgColor: block.bgColor || '#6B7280',
          type: block.type,
        })
      )

    const specialBlocks: BlockItem[] = [
      {
        id: 'loop',
        name: 'Loop',
        description: 'Create a Loop',
        icon: RepeatIcon,
        bgColor: '#2FB3FF',
        type: 'loop',
      },
      {
        id: 'parallel',
        name: 'Parallel',
        description: 'Parallel Execution',
        icon: SplitIcon,
        bgColor: '#FEE12B',
        type: 'parallel',
      },
    ]

    return [...regularBlocks, ...specialBlocks]
  }, [isOnWorkflowPage])

  const triggers = useMemo(() => {
    if (!isOnWorkflowPage) return []

    const allTriggers = getTriggersForSidebar()
    const priorityOrder = ['Start', 'Schedule', 'Webhook']

    const sortedTriggers = allTriggers.sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.name)
      const bIndex = priorityOrder.indexOf(b.name)
      const aHasPriority = aIndex !== -1
      const bHasPriority = bIndex !== -1

      if (aHasPriority && bHasPriority) return aIndex - bIndex
      if (aHasPriority) return -1
      if (bHasPriority) return 1
      return a.name.localeCompare(b.name)
    })

    return sortedTriggers.map(
      (block): BlockItem => ({
        id: block.type,
        name: block.name,
        description: block.description || '',
        icon: block.icon,
        bgColor: block.bgColor || '#6B7280',
        type: block.type,
        config: block,
      })
    )
  }, [isOnWorkflowPage])

  const tools = useMemo(() => {
    if (!isOnWorkflowPage) return []

    const allBlocks = getAllBlocks()
    return allBlocks
      .filter((block) => block.category === 'tools')
      .map(
        (block): ToolItem => ({
          id: block.type,
          name: block.name,
          description: block.description || '',
          icon: block.icon,
          bgColor: block.bgColor || '#6B7280',
          type: block.type,
        })
      )
  }, [isOnWorkflowPage])

  const pages = useMemo(
    (): PageItem[] => [
      {
        id: 'logs',
        name: 'Logs',
        icon: ScrollText,
        href: `/workspace/${workspaceId}/logs`,
        shortcut: '⌘⇧L',
      },
      {
        id: 'templates',
        name: 'Templates',
        icon: Layout,
        href: `/workspace/${workspaceId}/templates`,
      },
      {
        id: 'docs',
        name: 'Docs',
        icon: BookOpen,
        href: brand.documentationUrl || 'https://docs.sim.ai/',
      },
    ],
    [workspaceId, brand.documentationUrl]
  )

  const docs = useMemo((): DocItem[] => {
    const allBlocks = getAllBlocks()
    const docsItems: DocItem[] = []

    allBlocks.forEach((block) => {
      if (block.docsLink) {
        docsItems.push({
          id: `docs-${block.type}`,
          name: block.name,
          icon: block.icon,
          href: block.docsLink,
          type: block.category === 'blocks' || block.category === 'triggers' ? 'block' : 'tool',
        })
      }
    })

    return docsItems
  }, [])

  const allItems = useMemo((): SearchItem[] => {
    const items: SearchItem[] = []

    workspaces.forEach((workspace) => {
      items.push({
        id: workspace.id,
        name: workspace.name,
        href: workspace.href,
        type: 'workspace',
        isCurrent: workspace.isCurrent,
      })
    })

    workflows.forEach((workflow) => {
      items.push({
        id: workflow.id,
        name: workflow.name,
        href: workflow.href,
        type: 'workflow',
        color: workflow.color,
        isCurrent: workflow.isCurrent,
      })
    })

    pages.forEach((page) => {
      items.push({
        id: page.id,
        name: page.name,
        icon: page.icon,
        href: page.href,
        shortcut: page.shortcut,
        type: 'page',
      })
    })

    blocks.forEach((block) => {
      items.push({
        id: block.id,
        name: block.name,
        description: block.description,
        icon: block.icon,
        bgColor: block.bgColor,
        type: 'block',
        blockType: block.type,
      })
    })

    triggers.forEach((trigger) => {
      items.push({
        id: trigger.id,
        name: trigger.name,
        description: trigger.description,
        icon: trigger.icon,
        bgColor: trigger.bgColor,
        type: 'trigger',
        blockType: trigger.type,
        config: trigger.config,
      })
    })

    tools.forEach((tool) => {
      items.push({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        icon: tool.icon,
        bgColor: tool.bgColor,
        type: 'tool',
        blockType: tool.type,
      })
    })

    docs.forEach((doc) => {
      items.push({
        id: doc.id,
        name: doc.name,
        icon: doc.icon,
        href: doc.href,
        type: 'doc',
      })
    })

    return items
  }, [workspaces, workflows, pages, blocks, triggers, tools, docs])

  const sectionOrder = useMemo<SearchItem['type'][]>(
    () => ['block', 'tool', 'trigger', 'workflow', 'workspace', 'page', 'doc'],
    []
  )

  const filteredItems = useMemo(() => {
    const orderMap = sectionOrder.reduce<Record<SearchItem['type'], number>>(
      (acc, type, index) => {
        acc[type] = index
        return acc
      },
      {} as Record<SearchItem['type'], number>
    )

    if (!searchQuery.trim()) {
      return [...allItems].sort((a, b) => {
        const aOrder = orderMap[a.type] ?? Number.MAX_SAFE_INTEGER
        const bOrder = orderMap[b.type] ?? Number.MAX_SAFE_INTEGER
        return aOrder - bOrder
      })
    }

    const searchResults = searchItems(searchQuery, allItems)

    return searchResults
      .sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score
        }

        const aOrder = orderMap[a.item.type] ?? Number.MAX_SAFE_INTEGER
        const bOrder = orderMap[b.item.type] ?? Number.MAX_SAFE_INTEGER
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }

        return a.item.name.localeCompare(b.item.name)
      })
      .map((result) => result.item)
  }, [allItems, searchQuery, sectionOrder])

  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {
      workspace: [],
      workflow: [],
      page: [],
      trigger: [],
      block: [],
      tool: [],
      doc: [],
    }

    filteredItems.forEach((item) => {
      if (groups[item.type]) {
        groups[item.type].push(item)
      }
    })

    return groups
  }, [filteredItems])

  const displayedItemsInVisualOrder = useMemo(() => {
    const visualOrder: SearchItem[] = []

    sectionOrder.forEach((type) => {
      const items = groupedItems[type] || []
      items.forEach((item) => {
        visualOrder.push(item)
      })
    })

    return visualOrder
  }, [groupedItems, sectionOrder])

  useEffect(() => {
    setSelectedIndex(0)
  }, [displayedItemsInVisualOrder])

  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const handleItemClick = useCallback(
    (item: SearchItem) => {
      switch (item.type) {
        case 'block':
        case 'trigger':
        case 'tool':
          if (item.blockType) {
            const enableTriggerMode =
              item.type === 'trigger' && item.config ? hasTriggerCapability(item.config) : false
            const event = new CustomEvent('add-block-from-toolbar', {
              detail: {
                type: item.blockType,
                enableTriggerMode,
              },
            })
            window.dispatchEvent(event)
          }
          break
        case 'workspace':
          if (item.isCurrent) {
            break
          }
          if (item.href) {
            router.push(item.href)
          }
          break
        case 'workflow':
          if (!item.isCurrent && item.href) {
            router.push(item.href)
            window.dispatchEvent(
              new CustomEvent(SIDEBAR_SCROLL_EVENT, { detail: { itemId: item.id } })
            )
          }
          break
        case 'page':
        case 'doc':
          if (item.href) {
            if (item.href.startsWith('http')) {
              window.open(item.href, '_blank', 'noopener,noreferrer')
            } else {
              router.push(item.href)
            }
          }
          break
      }
      onOpenChange(false)
    },
    [router, onOpenChange]
  )

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, displayedItemsInVisualOrder.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (displayedItemsInVisualOrder[selectedIndex]) {
            handleItemClick(displayedItemsInVisualOrder[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onOpenChange(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, displayedItemsInVisualOrder, handleItemClick, onOpenChange])

  useEffect(() => {
    if (open && selectedIndex >= 0) {
      const element = document.querySelector(`[data-search-item-index="${selectedIndex}"]`)
      if (element) {
        element.scrollIntoView({
          block: 'nearest',
          behavior: 'auto',
        })
      }
    }
  }, [selectedIndex, open])

  const sectionTitles: Record<string, string> = {
    workspace: 'Workspaces',
    workflow: 'Workflows',
    page: 'Pages',
    trigger: 'Triggers',
    block: 'Blocks',
    tool: 'Tools',
    doc: 'Docs',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-40 backdrop-blur-md' />
        <DialogPrimitive.Content className='fixed top-[15%] left-[50%] z-50 flex w-[500px] translate-x-[-50%] flex-col gap-[12px] p-0 focus:outline-none focus-visible:outline-none'>
          <VisuallyHidden.Root>
            <DialogTitle>Search</DialogTitle>
          </VisuallyHidden.Root>

          {/* Search input container */}
          <div className='flex items-center gap-[8px] rounded-[10px] border border-[var(--border)] bg-[var(--surface-5)] px-[12px] py-[8px] shadow-sm'>
            <Search className='h-[15px] w-[15px] flex-shrink-0 text-[var(--text-subtle)]' />
            <input
              type='text'
              placeholder='Search anything...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full border-0 bg-transparent font-base text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none'
              autoFocus
            />
          </div>

          {/* Floating results container */}
          {displayedItemsInVisualOrder.length > 0 ? (
            <div className='scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent max-h-[400px] overflow-y-auto rounded-[10px] py-[10px] shadow-sm'>
              {sectionOrder.map((type) => {
                const items = groupedItems[type] || []
                if (items.length === 0) return null

                return (
                  <div key={type} className='mb-[10px] last:mb-0'>
                    {/* Section header */}
                    <div className='pt-[2px] pb-[4px] font-medium text-[13px] text-[var(--text-subtle)] uppercase tracking-wide'>
                      {sectionTitles[type]}
                    </div>

                    {/* Section items */}
                    <div className='space-y-[2px]'>
                      {items.map((item, itemIndex) => {
                        const Icon = item.icon
                        const visualIndex = displayedItemsInVisualOrder.indexOf(item)
                        const isSelected = visualIndex === selectedIndex
                        const showColoredIcon =
                          item.type === 'block' || item.type === 'trigger' || item.type === 'tool'
                        const isWorkflow = item.type === 'workflow'
                        const isWorkspace = item.type === 'workspace'

                        return (
                          <button
                            key={`${item.type}-${item.id}`}
                            data-search-item-index={visualIndex}
                            onClick={() => handleItemClick(item)}
                            onMouseDown={(e) => e.preventDefault()}
                            className={cn(
                              'group flex h-[28px] w-full items-center gap-[8px] rounded-[6px] bg-[var(--surface-4)]/60 px-[10px] text-left text-[15px] transition-all focus:outline-none',
                              isSelected
                                ? 'bg-[var(--border)] shadow-sm'
                                : 'hover:bg-[var(--border)]'
                            )}
                          >
                            {/* Icon - different rendering for workflows vs others */}
                            {!isWorkspace && (
                              <>
                                {isWorkflow ? (
                                  <div
                                    className='h-[14px] w-[14px] flex-shrink-0 rounded-[3px]'
                                    style={{ backgroundColor: item.color }}
                                  />
                                ) : (
                                  Icon && (
                                    <div
                                      className='relative flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[4px]'
                                      style={{
                                        background: showColoredIcon ? item.bgColor : 'transparent',
                                      }}
                                    >
                                      <Icon
                                        className={cn(
                                          'transition-transform duration-100 group-hover:scale-110',
                                          showColoredIcon
                                            ? '!h-[10px] !w-[10px] text-white'
                                            : 'h-[14px] w-[14px] text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
                                        )}
                                      />
                                    </div>
                                  )
                                )}
                              </>
                            )}

                            {/* Content */}
                            <span
                              className={cn(
                                'truncate font-medium',
                                isSelected
                                  ? 'text-[var(--text-primary)]'
                                  : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]'
                              )}
                            >
                              {item.name}
                              {item.isCurrent && ' (current)'}
                            </span>

                            {/* Shortcut */}
                            {item.shortcut && (
                              <span className='ml-auto flex-shrink-0 font-medium text-[13px] text-[var(--text-subtle)]'>
                                {item.shortcut}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : searchQuery ? (
            <div className='flex items-center justify-center rounded-[10px] bg-[var(--surface-5)] px-[16px] py-[24px] shadow-sm'>
              <p className='text-[15px] text-[var(--text-subtle)]'>
                No results found for "{searchQuery}"
              </p>
            </div>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}
```

--------------------------------------------------------------------------------

````
