---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 407
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 407 of 933)

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

---[FILE: general.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/general/general.tsx
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/emcn'
import { Skeleton } from '@/components/ui'
import { createLogger } from '@/lib/logs/console/logger'
import type { WorkflowDeploymentVersionResponse } from '@/lib/workflows/persistence/utils'
import { WorkflowPreview } from '@/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview'
import type { WorkflowState } from '@/stores/workflows/workflow/types'
import { Versions } from './components'

const logger = createLogger('GeneralDeploy')

interface GeneralDeployProps {
  workflowId: string | null
  deployedState: WorkflowState
  isLoadingDeployedState: boolean
  versions: WorkflowDeploymentVersionResponse[]
  versionsLoading: boolean
  onPromoteToLive: (version: number) => Promise<void>
  onLoadDeploymentComplete: () => void
  fetchVersions: () => Promise<void>
}

type PreviewMode = 'active' | 'selected'

/**
 * General deployment tab content displaying live workflow preview and version history.
 */
export function GeneralDeploy({
  workflowId,
  deployedState,
  isLoadingDeployedState,
  versions,
  versionsLoading,
  onPromoteToLive,
  onLoadDeploymentComplete,
  fetchVersions,
}: GeneralDeployProps) {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('active')
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [showPromoteDialog, setShowPromoteDialog] = useState(false)
  const [versionToLoad, setVersionToLoad] = useState<number | null>(null)
  const [versionToPromote, setVersionToPromote] = useState<number | null>(null)

  const versionCacheRef = useRef<Map<number, WorkflowState>>(new Map())
  const [, forceUpdate] = useState({})

  const selectedVersionInfo = versions.find((v) => v.version === selectedVersion)
  const versionToPromoteInfo = versions.find((v) => v.version === versionToPromote)
  const versionToLoadInfo = versions.find((v) => v.version === versionToLoad)

  const cachedSelectedState =
    selectedVersion !== null ? versionCacheRef.current.get(selectedVersion) : null

  const fetchSelectedVersionState = useCallback(
    async (version: number) => {
      if (!workflowId) return
      if (versionCacheRef.current.has(version)) return

      try {
        const res = await fetch(`/api/workflows/${workflowId}/deployments/${version}`)
        if (res.ok) {
          const data = await res.json()
          if (data.deployedState) {
            versionCacheRef.current.set(version, data.deployedState)
            forceUpdate({})
          }
        }
      } catch (error) {
        logger.error('Error fetching version state:', error)
      }
    },
    [workflowId]
  )

  useEffect(() => {
    if (selectedVersion !== null) {
      fetchSelectedVersionState(selectedVersion)
      setPreviewMode('selected')
    } else {
      setPreviewMode('active')
    }
  }, [selectedVersion, fetchSelectedVersionState])

  const handleSelectVersion = useCallback((version: number | null) => {
    setSelectedVersion(version)
  }, [])

  const handleLoadDeployment = useCallback((version: number) => {
    setVersionToLoad(version)
    setShowLoadDialog(true)
  }, [])

  const handlePromoteToLive = useCallback((version: number) => {
    setVersionToPromote(version)
    setShowPromoteDialog(true)
  }, [])

  const confirmLoadDeployment = async () => {
    if (!workflowId || versionToLoad === null) return

    // Close modal immediately for snappy UX
    setShowLoadDialog(false)
    const version = versionToLoad
    setVersionToLoad(null)

    try {
      const response = await fetch(`/api/workflows/${workflowId}/deployments/${version}/revert`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to load deployment')
      }

      onLoadDeploymentComplete()
    } catch (error) {
      logger.error('Failed to load deployment:', error)
    }
  }

  const confirmPromoteToLive = async () => {
    if (versionToPromote === null) return

    // Close modal immediately for snappy UX
    setShowPromoteDialog(false)
    const version = versionToPromote
    setVersionToPromote(null)

    try {
      await onPromoteToLive(version)
    } catch (error) {
      logger.error('Failed to promote version:', error)
    }
  }

  const workflowToShow = useMemo(() => {
    if (previewMode === 'selected' && cachedSelectedState) {
      return cachedSelectedState
    }
    return deployedState
  }, [previewMode, cachedSelectedState, deployedState])

  const showToggle = selectedVersion !== null && deployedState

  // Only show skeleton on initial load when we have no deployed data
  const hasDeployedData = deployedState && Object.keys(deployedState.blocks || {}).length > 0
  const showLoadingSkeleton = isLoadingDeployedState && !hasDeployedData

  if (showLoadingSkeleton) {
    return (
      <div className='space-y-[12px]'>
        <div>
          <div className='relative mb-[6.5px]'>
            <Skeleton className='h-[16px] w-[90px]' />
          </div>
          <div className='h-[260px] w-full overflow-hidden rounded-[4px] border border-[var(--border)]'>
            <Skeleton className='h-full w-full rounded-none' />
          </div>
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[60px]' />
          <div className='h-[120px] w-full overflow-hidden rounded-[4px] border border-[var(--border)]'>
            <Skeleton className='h-full w-full rounded-none' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-[12px]'>
        <div>
          <div className='relative mb-[6.5px]'>
            <Label className='block truncate pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
              {previewMode === 'selected' && selectedVersionInfo
                ? selectedVersionInfo.name || `v${selectedVersion}`
                : 'Live Workflow'}
            </Label>
            <div
              className='absolute top-[-5px] right-0 inline-flex gap-[2px]'
              style={{ visibility: showToggle ? 'visible' : 'hidden' }}
            >
              <Button
                type='button'
                variant={previewMode === 'active' ? 'active' : 'default'}
                onClick={() => setPreviewMode('active')}
                className='rounded-r-none px-[8px] py-[4px] text-[12px]'
              >
                Live
              </Button>
              <Button
                type='button'
                variant={previewMode === 'selected' ? 'active' : 'default'}
                onClick={() => setPreviewMode('selected')}
                className='truncate rounded-l-none px-[8px] py-[4px] text-[12px]'
              >
                {selectedVersionInfo?.name || `v${selectedVersion}`}
              </Button>
            </div>
          </div>

          <div
            className='[&_*]:!cursor-default relative h-[260px] w-full cursor-default overflow-hidden rounded-[4px] border border-[var(--border)]'
            onWheelCapture={(e) => {
              if (e.ctrlKey || e.metaKey) return
              e.stopPropagation()
            }}
          >
            {workflowToShow ? (
              <WorkflowPreview
                workflowState={workflowToShow}
                showSubBlocks={true}
                height='100%'
                width='100%'
                isPannable={true}
                defaultPosition={{ x: 0, y: 0 }}
                defaultZoom={0.6}
              />
            ) : (
              <div className='flex h-full items-center justify-center text-[#8D8D8D] text-[13px]'>
                Deploy your workflow to see a preview
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Versions
          </Label>
          <Versions
            workflowId={workflowId}
            versions={versions}
            versionsLoading={versionsLoading}
            selectedVersion={selectedVersion}
            onSelectVersion={handleSelectVersion}
            onPromoteToLive={handlePromoteToLive}
            onLoadDeployment={handleLoadDeployment}
            fetchVersions={fetchVersions}
          />
        </div>
      </div>

      <Modal open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <ModalContent size='sm'>
          <ModalHeader>Load Deployment</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to load{' '}
              <span className='font-medium text-[var(--text-primary)]'>
                {versionToLoadInfo?.name || `v${versionToLoad}`}
              </span>
              ?{' '}
              <span className='text-[var(--text-error)]'>
                This will replace your current workflow with the deployed version.
              </span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='default' onClick={() => setShowLoadDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={confirmLoadDeployment}
              className='bg-[var(--text-error)] text-white hover:bg-[var(--text-error)]'
            >
              Load deployment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={showPromoteDialog} onOpenChange={setShowPromoteDialog}>
        <ModalContent size='sm'>
          <ModalHeader>Promote to live</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to promote{' '}
              <span className='font-medium text-[var(--text-primary)]'>
                {versionToPromoteInfo?.name || `v${versionToPromote}`}
              </span>{' '}
              to live?{' '}
              <span className='text-[var(--text-primary)]'>
                This version will become the active deployment and serve all API requests.
              </span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='default' onClick={() => setShowPromoteDialog(false)}>
              Cancel
            </Button>
            <Button variant='primary' onClick={confirmPromoteToLive}>
              Promote to live
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/general/components/index.ts

```typescript
export { Versions } from './versions'
```

--------------------------------------------------------------------------------

---[FILE: versions.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/general/components/versions.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { MoreVertical, Pencil, RotateCcw, SendToBack } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverItem, PopoverTrigger } from '@/components/emcn'
import { Skeleton } from '@/components/ui'
import { createLogger } from '@/lib/logs/console/logger'
import type { WorkflowDeploymentVersionResponse } from '@/lib/workflows/persistence/utils'

const logger = createLogger('Versions')

/** Shared styling constants aligned with terminal component */
const HEADER_TEXT_CLASS = 'font-medium text-[var(--text-tertiary)] text-[12px]'
const ROW_TEXT_CLASS = 'font-medium text-[#D2D2D2] text-[12px]'
const COLUMN_BASE_CLASS = 'flex-shrink-0'

/** Column width configuration */
const COLUMN_WIDTHS = {
  VERSION: 'w-[180px]',
  DEPLOYED_BY: 'w-[140px]',
  TIMESTAMP: 'flex-1',
  ACTIONS: 'w-[32px]',
} as const

interface VersionsProps {
  workflowId: string | null
  versions: WorkflowDeploymentVersionResponse[]
  versionsLoading: boolean
  selectedVersion: number | null
  onSelectVersion: (version: number | null) => void
  onPromoteToLive: (version: number) => void
  onLoadDeployment: (version: number) => void
  fetchVersions: () => Promise<void>
}

/**
 * Formats a timestamp into a readable string.
 * @param value - The date string or Date object to format
 * @returns Formatted string like "8:36 PM PT on Oct 11, 2025"
 */
const formatDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  })

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${timePart} on ${datePart}`
}

/**
 * Displays a list of workflow deployment versions with actions
 * for viewing, promoting to live, renaming, and loading deployments.
 */
export function Versions({
  workflowId,
  versions,
  versionsLoading,
  selectedVersion,
  onSelectVersion,
  onPromoteToLive,
  onLoadDeployment,
  fetchVersions,
}: VersionsProps) {
  const [editingVersion, setEditingVersion] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingVersion !== null && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingVersion])

  const handleStartRename = (version: number, currentName: string | null | undefined) => {
    setOpenDropdown(null)
    setEditingVersion(version)
    setEditValue(currentName || `v${version}`)
  }

  const handleSaveRename = async (version: number) => {
    if (!workflowId || !editValue.trim()) {
      setEditingVersion(null)
      return
    }

    const currentVersion = versions.find((v) => v.version === version)
    const currentName = currentVersion?.name || `v${version}`

    if (editValue.trim() === currentName) {
      setEditingVersion(null)
      return
    }

    setIsRenaming(true)
    try {
      const res = await fetch(`/api/workflows/${workflowId}/deployments/${version}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }),
      })

      if (res.ok) {
        await fetchVersions()
        setEditingVersion(null)
      } else {
        logger.error('Failed to rename version')
      }
    } catch (error) {
      logger.error('Error renaming version:', error)
    } finally {
      setIsRenaming(false)
    }
  }

  const handleCancelRename = () => {
    setEditingVersion(null)
    setEditValue('')
  }

  const handleRowClick = (version: number) => {
    if (editingVersion === version) return
    onSelectVersion(selectedVersion === version ? null : version)
  }

  const handlePromote = (version: number) => {
    setOpenDropdown(null)
    onPromoteToLive(version)
  }

  const handleLoadDeployment = (version: number) => {
    setOpenDropdown(null)
    onLoadDeployment(version)
  }

  if (versionsLoading && versions.length === 0) {
    return (
      <div className='overflow-hidden rounded-[4px] border border-[var(--border)]'>
        <div className='flex h-[30px] items-center bg-[var(--surface-1)] px-[16px]'>
          <div className={clsx(COLUMN_WIDTHS.VERSION, COLUMN_BASE_CLASS)}>
            <Skeleton className='h-[12px] w-[50px]' />
          </div>
          <div className={clsx(COLUMN_WIDTHS.DEPLOYED_BY, COLUMN_BASE_CLASS)}>
            <Skeleton className='h-[12px] w-[76px]' />
          </div>
          <div className={clsx(COLUMN_WIDTHS.TIMESTAMP, 'min-w-0')}>
            <Skeleton className='h-[12px] w-[68px]' />
          </div>
          <div className={clsx(COLUMN_WIDTHS.ACTIONS, COLUMN_BASE_CLASS)} />
        </div>
        <div className='bg-[var(--surface-2)]'>
          {[0, 1].map((i) => (
            <div key={i} className='flex h-[36px] items-center px-[16px]'>
              <div className={clsx(COLUMN_WIDTHS.VERSION, COLUMN_BASE_CLASS, 'min-w-0 pr-[8px]')}>
                <div className='flex items-center gap-[16px]'>
                  <Skeleton className='h-[6px] w-[6px] rounded-[2px]' />
                  <Skeleton className='h-[12px] w-[60px]' />
                </div>
              </div>
              <div className={clsx(COLUMN_WIDTHS.DEPLOYED_BY, COLUMN_BASE_CLASS, 'min-w-0')}>
                <Skeleton className='h-[12px] w-[80px]' />
              </div>
              <div className={clsx(COLUMN_WIDTHS.TIMESTAMP, 'min-w-0')}>
                <Skeleton className='h-[12px] w-[160px]' />
              </div>
              <div className={clsx(COLUMN_WIDTHS.ACTIONS, COLUMN_BASE_CLASS, 'flex justify-end')}>
                <Skeleton className='h-[20px] w-[20px] rounded-[4px]' />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className='flex h-[120px] items-center justify-center rounded-[4px] border border-[var(--border)] text-[#8D8D8D] text-[13px]'>
        No deployments yet
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-[4px] border border-[var(--border)]'>
      <div className='flex h-[30px] items-center bg-[var(--surface-1)] px-[16px]'>
        <div className={clsx(COLUMN_WIDTHS.VERSION, COLUMN_BASE_CLASS)}>
          <span className={HEADER_TEXT_CLASS}>Version</span>
        </div>
        <div className={clsx(COLUMN_WIDTHS.DEPLOYED_BY, COLUMN_BASE_CLASS)}>
          <span className={HEADER_TEXT_CLASS}>Deployed by</span>
        </div>
        <div className={clsx(COLUMN_WIDTHS.TIMESTAMP, 'min-w-0')}>
          <span className={HEADER_TEXT_CLASS}>Timestamp</span>
        </div>
        <div className={clsx(COLUMN_WIDTHS.ACTIONS, COLUMN_BASE_CLASS)} />
      </div>

      <div className='bg-[var(--surface-2)]'>
        {versions.map((v) => {
          const isSelected = selectedVersion === v.version

          return (
            <div
              key={v.id}
              className={clsx(
                'flex h-[36px] cursor-pointer items-center px-[16px] transition-colors',
                isSelected
                  ? 'bg-[var(--accent)]/10 hover:bg-[var(--accent)]/15'
                  : 'hover:bg-[var(--border)]'
              )}
              onClick={() => handleRowClick(v.version)}
            >
              <div className={clsx(COLUMN_WIDTHS.VERSION, COLUMN_BASE_CLASS, 'min-w-0 pr-[8px]')}>
                <div className='flex items-center gap-[16px]'>
                  <div
                    className={clsx(
                      'h-[6px] w-[6px] shrink-0 rounded-[2px]',
                      v.isActive ? 'bg-[#4ADE80]' : 'bg-[#B7B7B7]'
                    )}
                    title={v.isActive ? 'Live' : 'Inactive'}
                  />
                  {editingVersion === v.version ? (
                    <input
                      ref={inputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSaveRename(v.version)
                        } else if (e.key === 'Escape') {
                          e.preventDefault()
                          handleCancelRename()
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={() => handleSaveRename(v.version)}
                      className={clsx(
                        'w-full border-0 bg-transparent p-0 font-medium text-[12px] leading-5 outline-none',
                        'text-[var(--text-primary)] focus:outline-none focus:ring-0'
                      )}
                      maxLength={100}
                      disabled={isRenaming}
                      autoComplete='off'
                      autoCorrect='off'
                      autoCapitalize='off'
                      spellCheck='false'
                    />
                  ) : (
                    <span
                      className={clsx('block flex items-center gap-[4px] truncate', ROW_TEXT_CLASS)}
                    >
                      <span className='truncate'>{v.name || `v${v.version}`}</span>
                      {v.isActive && <span className='text-[var(--text-tertiary)]'> (live)</span>}
                      {isSelected && (
                        <span className='text-[var(--text-tertiary)]'> (selected)</span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              <div className={clsx(COLUMN_WIDTHS.DEPLOYED_BY, COLUMN_BASE_CLASS, 'min-w-0')}>
                <span
                  className={clsx('block truncate text-[var(--text-tertiary)]', ROW_TEXT_CLASS)}
                >
                  {v.deployedBy || 'Unknown'}
                </span>
              </div>

              <div className={clsx(COLUMN_WIDTHS.TIMESTAMP, 'min-w-0')}>
                <span
                  className={clsx('block truncate text-[var(--text-tertiary)]', ROW_TEXT_CLASS)}
                >
                  {formatDate(v.createdAt)}
                </span>
              </div>

              <div
                className={clsx(COLUMN_WIDTHS.ACTIONS, COLUMN_BASE_CLASS, 'flex justify-end')}
                onClick={(e) => e.stopPropagation()}
              >
                <Popover
                  open={openDropdown === v.version}
                  onOpenChange={(open) => setOpenDropdown(open ? v.version : null)}
                >
                  <PopoverTrigger asChild>
                    <Button variant='ghost' className='!p-1'>
                      <MoreVertical className='h-3.5 w-3.5' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='end' sideOffset={4} minWidth={160} maxWidth={200} border>
                    <PopoverItem onClick={() => handleStartRename(v.version, v.name)}>
                      <Pencil className='h-3 w-3' />
                      <span>Rename</span>
                    </PopoverItem>
                    {!v.isActive && (
                      <PopoverItem onClick={() => handlePromote(v.version)}>
                        <RotateCcw className='h-3 w-3' />
                        <span>Promote to live</span>
                      </PopoverItem>
                    )}
                    <PopoverItem onClick={() => handleLoadDeployment(v.version)}>
                      <SendToBack className='h-3 w-3' />
                      <span>Load deployment</span>
                    </PopoverItem>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: template.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/components/deploy-modal/components/template/template.tsx
Signals: React

```typescript
'use client'

import { useEffect, useState } from 'react'
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
  Textarea,
} from '@/components/emcn'
import { Skeleton, TagInput } from '@/components/ui'
import { useSession } from '@/lib/auth/auth-client'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { WorkflowPreview } from '@/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview'
import {
  useCreateTemplate,
  useDeleteTemplate,
  useTemplateByWorkflow,
  useUpdateTemplate,
} from '@/hooks/queries/templates'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('TemplateDeploy')

interface TemplateFormData {
  name: string
  tagline: string
  about: string
  creatorId: string
  tags: string[]
}

const initialFormData: TemplateFormData = {
  name: '',
  tagline: '',
  about: '',
  creatorId: '',
  tags: [],
}

interface CreatorOption {
  id: string
  name: string
  referenceType: 'user' | 'organization'
  referenceId: string
}

interface TemplateStatus {
  status: 'pending' | 'approved' | 'rejected' | null
  views?: number
  stars?: number
}

interface TemplateDeployProps {
  workflowId: string
  onDeploymentComplete?: () => void
  onValidationChange?: (isValid: boolean) => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onExistingTemplateChange?: (exists: boolean) => void
  onTemplateStatusChange?: (status: TemplateStatus | null) => void
}

export function TemplateDeploy({
  workflowId,
  onDeploymentComplete,
  onValidationChange,
  onSubmittingChange,
  onExistingTemplateChange,
  onTemplateStatusChange,
}: TemplateDeployProps) {
  const { data: session } = useSession()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [creatorOptions, setCreatorOptions] = useState<CreatorOption[]>([])
  const [loadingCreators, setLoadingCreators] = useState(false)

  const [formData, setFormData] = useState<TemplateFormData>(initialFormData)

  const { data: existingTemplate, isLoading: isLoadingTemplate } = useTemplateByWorkflow(workflowId)
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate()
  const deleteMutation = useDeleteTemplate()

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.name.length <= 100 &&
    formData.tagline.length <= 200 &&
    formData.creatorId.length > 0

  const updateField = <K extends keyof TemplateFormData>(field: K, value: TemplateFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    onValidationChange?.(isFormValid)
  }, [isFormValid, onValidationChange])

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
  }, [isSubmitting, onSubmittingChange])

  useEffect(() => {
    onExistingTemplateChange?.(!!existingTemplate)
  }, [existingTemplate, onExistingTemplateChange])

  useEffect(() => {
    if (existingTemplate) {
      onTemplateStatusChange?.({
        status: existingTemplate.status as 'pending' | 'approved' | 'rejected',
        views: existingTemplate.views,
        stars: existingTemplate.stars,
      })
    } else {
      onTemplateStatusChange?.(null)
    }
  }, [existingTemplate, onTemplateStatusChange])

  const fetchCreatorOptions = async () => {
    if (!session?.user?.id) return

    setLoadingCreators(true)
    try {
      const response = await fetch('/api/creators')
      if (response.ok) {
        const data = await response.json()
        const profiles = (data.profiles || []).map((profile: any) => ({
          id: profile.id,
          name: profile.name,
          referenceType: profile.referenceType,
          referenceId: profile.referenceId,
        }))
        setCreatorOptions(profiles)
        return profiles
      }
    } catch (error) {
      logger.error('Error fetching creator profiles:', error)
    } finally {
      setLoadingCreators(false)
    }
    return []
  }

  useEffect(() => {
    fetchCreatorOptions()
  }, [session?.user?.id])

  useEffect(() => {
    if (creatorOptions.length === 1 && !formData.creatorId) {
      updateField('creatorId', creatorOptions[0].id)
      logger.info('Auto-selected single creator profile:', creatorOptions[0].name)
    }
  }, [creatorOptions, formData.creatorId])

  useEffect(() => {
    const handleCreatorProfileSaved = async () => {
      logger.info('Creator profile saved, refreshing profiles...')

      await fetchCreatorOptions()

      window.dispatchEvent(new CustomEvent('close-settings'))
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-deploy-modal', { detail: { tab: 'template' } }))
      }, 100)
    }

    window.addEventListener('creator-profile-saved', handleCreatorProfileSaved)

    return () => {
      window.removeEventListener('creator-profile-saved', handleCreatorProfileSaved)
    }
  }, [])

  useEffect(() => {
    if (existingTemplate) {
      setFormData({
        name: existingTemplate.name,
        tagline: existingTemplate.details?.tagline || '',
        about: existingTemplate.details?.about || '',
        creatorId: existingTemplate.creatorId || '',
        tags: existingTemplate.tags || [],
      })
    }
  }, [existingTemplate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user || !isFormValid) {
      logger.error('User not authenticated or form invalid')
      return
    }

    try {
      const templateData = {
        name: formData.name.trim(),
        details: {
          tagline: formData.tagline.trim(),
          about: formData.about.trim(),
        },
        creatorId: formData.creatorId,
        tags: formData.tags,
      }

      if (existingTemplate) {
        await updateMutation.mutateAsync({
          id: existingTemplate.id,
          data: {
            ...templateData,
            updateState: true,
          },
        })
      } else {
        await createMutation.mutateAsync({ ...templateData, workflowId })
      }

      logger.info(`Template ${existingTemplate ? 'updated' : 'created'} successfully`)
      onDeploymentComplete?.()
    } catch (error) {
      logger.error('Failed to save template:', error)
    }
  }

  const handleDelete = async () => {
    if (!existingTemplate) return

    try {
      await deleteMutation.mutateAsync(existingTemplate.id)
      setShowDeleteDialog(false)
      setFormData(initialFormData)
    } catch (error) {
      logger.error('Error deleting template:', error)
    }
  }

  if (isLoadingTemplate) {
    return (
      <div className='space-y-[12px]'>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[40px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[50px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[76px]' />
          <Skeleton className='h-[160px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[50px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
        <div>
          <Skeleton className='mb-[6.5px] h-[16px] w-[32px]' />
          <Skeleton className='h-[34px] w-full rounded-[4px]' />
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <form id='template-deploy-form' onSubmit={handleSubmit} className='space-y-[12px]'>
        {existingTemplate?.state && (
          <div>
            <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
              Live Template
            </Label>
            <div
              className='[&_*]:!cursor-default relative h-[260px] w-full cursor-default overflow-hidden rounded-[4px] border border-[var(--border)]'
              onWheelCapture={(e) => {
                if (e.ctrlKey || e.metaKey) return
                e.stopPropagation()
              }}
            >
              <TemplatePreviewContent existingTemplate={existingTemplate} />
            </div>
          </div>
        )}

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Name <span className='text-[var(--text-error)]'>*</span>
          </Label>
          <Input
            placeholder='Deep Research Agent'
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Tagline
          </Label>
          <Input
            placeholder='A deep research agent that can find information on any topic'
            value={formData.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
            disabled={isSubmitting}
            className={cn(formData.tagline.length > 200 && 'border-[var(--text-error)]')}
          />
        </div>

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Description
          </Label>
          <Textarea
            placeholder='Optional description that supports Markdown'
            className='min-h-[160px] resize-none'
            value={formData.about}
            onChange={(e) => updateField('about', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Creator <span className='text-[var(--text-error)]'>*</span>
          </Label>
          {creatorOptions.length === 0 && !loadingCreators ? (
            <div className='space-y-[8px]'>
              <p className='text-[12px] text-[var(--text-tertiary)]'>
                A creator profile is required to publish templates.
              </p>
              <Button
                type='button'
                variant='primary'
                onClick={() => {
                  try {
                    const event = new CustomEvent('open-settings', {
                      detail: { tab: 'template-profile' },
                    })
                    window.dispatchEvent(event)
                    logger.info('Opened Settings modal at template-profile section')
                  } catch (error) {
                    logger.error('Failed to open Settings modal for template profile', {
                      error,
                    })
                  }
                }}
                className='gap-[8px]'
              >
                <span>Create Template Profile</span>
              </Button>
            </div>
          ) : (
            <Combobox
              options={creatorOptions.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
              value={formData.creatorId}
              selectedValue={formData.creatorId}
              onChange={(value) => updateField('creatorId', value)}
              placeholder={loadingCreators ? 'Loading...' : 'Select creator profile'}
              editable={false}
              filterOptions={false}
              disabled={loadingCreators || isSubmitting}
            />
          )}
        </div>

        <div>
          <Label className='mb-[6.5px] block pl-[2px] font-medium text-[13px] text-[var(--text-primary)]'>
            Tags
          </Label>
          <TagInput
            value={formData.tags}
            onChange={(tags) => updateField('tags', tags)}
            placeholder='Dev, Agents, Research, etc.'
            maxTags={10}
            disabled={isSubmitting}
          />
        </div>

        <button
          type='button'
          data-template-delete-trigger
          onClick={() => setShowDeleteDialog(true)}
          style={{ display: 'none' }}
        />
      </form>

      <Modal open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <ModalContent size='sm'>
          <ModalHeader>Delete Template</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              Are you sure you want to delete this template?{' '}
              <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant='default' onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className='bg-[var(--text-error)] text-[13px] text-white hover:bg-[var(--text-error)]'
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

interface TemplatePreviewContentProps {
  existingTemplate:
    | {
        id: string
        state?: Partial<WorkflowState>
      }
    | null
    | undefined
}

function TemplatePreviewContent({ existingTemplate }: TemplatePreviewContentProps) {
  if (!existingTemplate?.state || !existingTemplate.state.blocks) {
    return null
  }

  const workflowState: WorkflowState = {
    blocks: existingTemplate.state.blocks,
    edges: existingTemplate.state.edges ?? [],
    loops: existingTemplate.state.loops ?? {},
    parallels: existingTemplate.state.parallels ?? {},
    lastSaved: existingTemplate.state.lastSaved ?? Date.now(),
  }

  return (
    <WorkflowPreview
      key={`template-preview-${existingTemplate.id}`}
      workflowState={workflowState}
      showSubBlocks={true}
      height='100%'
      width='100%'
      isPannable={true}
      defaultPosition={{ x: 0, y: 0 }}
      defaultZoom={0.6}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/deploy/hooks/index.ts

```typescript
export { useChangeDetection } from './use-change-detection'
export { useDeployedState } from './use-deployed-state'
export { useDeployment } from './use-deployment'
```

--------------------------------------------------------------------------------

````
