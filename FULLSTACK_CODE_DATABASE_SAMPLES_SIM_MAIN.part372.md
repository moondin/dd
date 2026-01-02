---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 372
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 372 of 933)

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

---[FILE: files.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/files/files.tsx
Signals: React, Next.js

```typescript
'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowDown, Loader2, Plus, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Button, Tooltip, Trash } from '@/components/emcn'
import { Input, Progress, Skeleton } from '@/components/ui'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import type { WorkspaceFileRecord } from '@/lib/uploads/contexts/workspace'
import { getFileExtension } from '@/lib/uploads/utils/file-utils'
import { getDocumentIcon } from '@/app/workspace/[workspaceId]/knowledge/components'
import {
  useDeleteWorkspaceFile,
  useStorageInfo,
  useUploadWorkspaceFile,
  useWorkspaceFiles,
} from '@/hooks/queries/workspace-files'
import { useUserPermissions } from '@/hooks/use-user-permissions'
import { useWorkspacePermissions } from '@/hooks/use-workspace-permissions'

const logger = createLogger('FileUploadsSettings')
const isBillingEnabled = isTruthy(getEnv('NEXT_PUBLIC_BILLING_ENABLED'))

const PRIMARY_BUTTON_STYLES =
  '!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'

const SUPPORTED_EXTENSIONS = [
  // Documents
  'pdf',
  'csv',
  'doc',
  'docx',
  'txt',
  'md',
  'xlsx',
  'xls',
  'html',
  'htm',
  'pptx',
  'ppt',
  'json',
  'yaml',
  'yml',
  // Audio formats
  'mp3',
  'm4a',
  'wav',
  'webm',
  'ogg',
  'flac',
  'aac',
  'opus',
  // Video formats
  'mp4',
  'mov',
  'avi',
  'mkv',
] as const
const ACCEPT_ATTR =
  '.pdf,.csv,.doc,.docx,.txt,.md,.xlsx,.xls,.html,.htm,.pptx,.ppt,.json,.yaml,.yml,.mp3,.m4a,.wav,.webm,.ogg,.flac,.aac,.opus,.mp4,.mov,.avi,.mkv'

const PLAN_NAMES = {
  enterprise: 'Enterprise',
  team: 'Team',
  pro: 'Pro',
  free: 'Free',
} as const

const GRADIENT_TEXT_STYLES =
  'gradient-text bg-gradient-to-b from-gradient-primary via-gradient-secondary to-gradient-primary'

export function Files() {
  const params = useParams()
  const workspaceId = params?.workspaceId as string

  // React Query hooks - with placeholderData to show cached data immediately
  const { data: files = [] } = useWorkspaceFiles(workspaceId)
  const { data: storageInfo } = useStorageInfo(isBillingEnabled)
  const uploadFile = useUploadWorkspaceFile()
  const deleteFile = useDeleteWorkspaceFile()

  // Local UI state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 })
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { permissions: workspacePermissions, loading: permissionsLoading } =
    useWorkspacePermissions(workspaceId)
  const userPermissions = useUserPermissions(workspacePermissions, permissionsLoading)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list || list.length === 0 || !workspaceId) return

    try {
      setUploading(true)
      setUploadError(null)

      const filesToUpload = Array.from(list)
      const unsupported: string[] = []
      const allowedFiles = filesToUpload.filter((f) => {
        const ext = getFileExtension(f.name)
        const ok = SUPPORTED_EXTENSIONS.includes(ext as (typeof SUPPORTED_EXTENSIONS)[number])
        if (!ok) unsupported.push(f.name)
        return ok
      })

      setUploadProgress({ completed: 0, total: allowedFiles.length })
      let lastError: string | null = null

      for (let i = 0; i < allowedFiles.length; i++) {
        const selectedFile = allowedFiles[i]
        try {
          await uploadFile.mutateAsync({ workspaceId, file: selectedFile })
          setUploadProgress({ completed: i + 1, total: allowedFiles.length })
        } catch (err) {
          logger.error('Error uploading file:', err)
          lastError = 'Upload failed'
        }
      }

      if (unsupported.length) {
        lastError = `Unsupported file type: ${unsupported.join(', ')}`
      }
      if (lastError) setUploadError(lastError)
    } catch (error) {
      logger.error('Error uploading file:', error)
      setUploadError('Upload failed')
      setTimeout(() => setUploadError(null), 5000)
    } finally {
      setUploading(false)
      setUploadProgress({ completed: 0, total: 0 })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDownload = async (file: WorkspaceFileRecord) => {
    if (!workspaceId || downloadingFileId === file.id) return

    setDownloadingFileId(file.id)
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/files/${file.id}/download`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to get download URL')
      }

      const data = await response.json()

      if (!data.success || !data.downloadUrl) {
        throw new Error('Invalid download response')
      }

      const link = document.createElement('a')
      link.href = data.downloadUrl
      link.download = data.fileName || file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      logger.error('Error downloading file:', error)
    } finally {
      setDownloadingFileId(null)
    }
  }

  const handleDelete = async (file: WorkspaceFileRecord) => {
    if (!workspaceId) return

    try {
      await deleteFile.mutateAsync({
        workspaceId,
        fileId: file.id,
        fileSize: file.size,
      })
    } catch (error) {
      logger.error('Error deleting file:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date | string): string => {
    const d = new Date(date)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const yy = String(d.getFullYear()).slice(2)
    return `${mm}/${dd}/${yy}`
  }

  const filteredFiles = useMemo(() => {
    if (!search) return files
    const q = search.toLowerCase()
    return files.filter((f) => f.name.toLowerCase().includes(q))
  }, [files, search])

  const truncateMiddle = (text: string, start = 24, end = 12) => {
    if (!text) return ''
    if (text.length <= start + end + 3) return text
    return `${text.slice(0, start)}...${text.slice(-end)}`
  }

  const formatStorageSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const planName = storageInfo?.plan || 'free'
  const displayPlanName = PLAN_NAMES[planName as keyof typeof PLAN_NAMES] || 'Free'

  const renderTableSkeleton = () => (
    <Table className='table-auto text-[13px]'>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead className='w-[56%] px-[12px] py-[6px] text-[12px] text-[var(--text-secondary)]'>
            <Skeleton className='h-[12px] w-[40px]' />
          </TableHead>
          <TableHead className='w-[14%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
            <Skeleton className='h-[12px] w-[28px]' />
          </TableHead>
          <TableHead className='w-[15%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
            <Skeleton className='h-[12px] w-[56px]' />
          </TableHead>
          <TableHead className='w-[15%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
            <Skeleton className='h-[12px] w-[48px]' />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 3 }, (_, i) => (
          <TableRow key={i} className='hover:bg-transparent'>
            <TableCell className='px-[12px] py-[6px]'>
              <div className='flex min-w-0 items-center gap-[8px]'>
                <Skeleton className='h-[14px] w-[14px] rounded-[2px]' />
                <Skeleton className='h-[14px] w-[180px]' />
              </div>
            </TableCell>
            <TableCell className='whitespace-nowrap px-[12px] py-[6px] text-[12px]'>
              <Skeleton className='h-[12px] w-[48px]' />
            </TableCell>
            <TableCell className='whitespace-nowrap px-[12px] py-[6px] text-[12px]'>
              <Skeleton className='h-[12px] w-[56px]' />
            </TableCell>
            <TableCell className='px-[12px] py-[6px]'>
              <div className='flex items-center gap-[4px]'>
                <Skeleton className='h-[28px] w-[28px] rounded-[4px]' />
                <Skeleton className='h-[28px] w-[28px] rounded-[4px]' />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className='flex h-full flex-col gap-[2px]'>
      {/* Search Input and Upload Button */}
      <div className='flex items-center gap-[8px]'>
        <div
          className={cn(
            'flex flex-1 items-center gap-[8px] rounded-[8px] border bg-[var(--surface-6)] px-[8px] py-[5px]',
            permissionsLoading && 'opacity-50'
          )}
        >
          <Search
            className='h-[14px] w-[14px] flex-shrink-0 text-[var(--text-tertiary)]'
            strokeWidth={2}
          />
          <Input
            placeholder='Search files...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={permissionsLoading}
            className='h-auto flex-1 border-0 bg-transparent p-0 font-base leading-none placeholder:text-[var(--text-tertiary)] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-100'
          />
        </div>
        {!permissionsLoading && isBillingEnabled && storageInfo && (
          <div className='flex flex-col items-end gap-[4px]'>
            <div className='flex items-center gap-[8px] text-[13px]'>
              <span
                className={cn(
                  'font-medium',
                  planName === 'free' ? 'text-[var(--text-primary)]' : GRADIENT_TEXT_STYLES
                )}
              >
                {displayPlanName}
              </span>
              <span className='text-[var(--text-muted)] tabular-nums'>
                {formatStorageSize(storageInfo.usedBytes)} /{' '}
                {formatStorageSize(storageInfo.limitBytes)}
              </span>
            </div>
            <Progress
              value={Math.min(storageInfo.percentUsed, 100)}
              className='h-1 w-full'
              indicatorClassName='bg-black dark:bg-white'
            />
          </div>
        )}
        {(permissionsLoading || userPermissions.canEdit) && (
          <>
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={handleFileChange}
              disabled={uploading || permissionsLoading}
              accept={ACCEPT_ATTR}
              multiple
            />
            <Button
              onClick={handleUploadClick}
              disabled={uploading || permissionsLoading}
              variant='primary'
              className={PRIMARY_BUTTON_STYLES}
            >
              <Plus className='mr-[6px] h-[13px] w-[13px]' />
              {uploading && uploadProgress.total > 0
                ? `${uploadProgress.completed}/${uploadProgress.total}`
                : uploading
                  ? 'Uploading...'
                  : 'Upload'}
            </Button>
          </>
        )}
      </div>

      {/* Error message */}
      {uploadError && (
        <p className='text-[11px] text-[var(--text-error)] leading-tight'>{uploadError}</p>
      )}

      {/* Scrollable Content */}
      <div ref={scrollContainerRef} className='min-h-0 flex-1 overflow-y-auto'>
        {permissionsLoading ? (
          renderTableSkeleton()
        ) : files.length === 0 ? (
          <div className='flex h-full items-center justify-center text-[13px] text-[var(--text-muted)]'>
            No files uploaded yet
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className='py-[16px] text-center text-[13px] text-[var(--text-muted)]'>
            No files found matching "{search}"
          </div>
        ) : (
          <Table className='table-auto text-[13px]'>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-[56%] px-[12px] py-[6px] text-[12px] text-[var(--text-secondary)]'>
                  Name
                </TableHead>
                <TableHead className='w-[14%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
                  Size
                </TableHead>
                <TableHead className='w-[15%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
                  Uploaded
                </TableHead>
                <TableHead className='w-[15%] px-[12px] py-[6px] text-left text-[12px] text-[var(--text-secondary)]'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => {
                const Icon = getDocumentIcon(file.type || '', file.name)
                return (
                  <TableRow key={file.id} className='hover:bg-[var(--surface-2)]'>
                    <TableCell className='px-[12px] py-[6px]'>
                      <div className='flex min-w-0 items-center gap-[8px]'>
                        <Icon className='h-[14px] w-[14px] shrink-0 text-[var(--text-muted)]' />
                        <button
                          onClick={() => handleDownload(file)}
                          disabled={downloadingFileId === file.id}
                          className='min-w-0 truncate text-left font-normal text-[14px] text-[var(--text-primary)] hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50'
                          title={file.name}
                        >
                          {truncateMiddle(file.name)}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className='whitespace-nowrap px-[12px] py-[6px] text-[12px] text-[var(--text-muted)]'>
                      {formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className='whitespace-nowrap px-[12px] py-[6px] text-[12px] text-[var(--text-muted)]'>
                      {formatDate(file.uploadedAt)}
                    </TableCell>
                    <TableCell className='px-[12px] py-[6px]'>
                      <div className='flex items-center gap-[4px]'>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <Button
                              variant='ghost'
                              onClick={() => handleDownload(file)}
                              className='h-[28px] w-[28px] p-0'
                              disabled={downloadingFileId === file.id}
                              aria-label={`Download ${file.name}`}
                            >
                              {downloadingFileId === file.id ? (
                                <Loader2 className='h-[14px] w-[14px] animate-spin' />
                              ) : (
                                <ArrowDown className='h-[14px] w-[14px]' />
                              )}
                            </Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content>Download file</Tooltip.Content>
                        </Tooltip.Root>
                        {userPermissions.canEdit && (
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button
                                variant='ghost'
                                onClick={() => handleDelete(file)}
                                className='h-[28px] w-[28px] p-0'
                                disabled={deleteFile.isPending}
                                aria-label={`Delete ${file.name}`}
                              >
                                <Trash className='h-[14px] w-[14px]' />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>Delete file</Tooltip.Content>
                          </Tooltip.Root>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: general.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/general/general.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Check, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from '@/components/emcn'
import { Input, Skeleton } from '@/components/ui'
import { signOut, useSession } from '@/lib/auth/auth-client'
import { ANONYMOUS_USER_ID } from '@/lib/auth/constants'
import { useBrandConfig } from '@/lib/branding/branding'
import { getEnv, isTruthy } from '@/lib/core/config/env'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { createLogger } from '@/lib/logs/console/logger'
import { useProfilePictureUpload } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/hooks/use-profile-picture-upload'
import { useGeneralSettings, useUpdateGeneralSetting } from '@/hooks/queries/general-settings'
import { useUpdateUserProfile, useUserProfile } from '@/hooks/queries/user-profile'
import { clearUserData } from '@/stores'

const logger = createLogger('General')

/**
 * Extracts initials from a user's name.
 * @param name - The user's full name
 * @returns Up to 2 characters: first letters of first and last name, or just the first letter
 */
function getInitials(name: string | undefined | null): string {
  if (!name?.trim()) return ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return parts[0][0].toUpperCase()
}

interface GeneralProps {
  onOpenChange?: (open: boolean) => void
}

export function General({ onOpenChange }: GeneralProps) {
  const router = useRouter()
  const brandConfig = useBrandConfig()
  const { data: session } = useSession()

  const { data: profile, isLoading: isProfileLoading } = useUserProfile()
  const updateProfile = useUpdateUserProfile()

  const { data: settings, isLoading: isSettingsLoading } = useGeneralSettings()
  const updateSetting = useUpdateGeneralSetting()

  const isLoading = isProfileLoading || isSettingsLoading

  const isTrainingEnabled = isTruthy(getEnv('NEXT_PUBLIC_COPILOT_TRAINING_ENABLED'))
  const isAuthDisabled = session?.user?.id === ANONYMOUS_USER_ID

  const [isSuperUser, setIsSuperUser] = useState(false)
  const [loadingSuperUser, setLoadingSuperUser] = useState(true)

  const [name, setName] = useState(profile?.name || '')
  const [isEditingName, setIsEditingName] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false)
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null)

  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    }
  }, [profile?.name])

  useEffect(() => {
    const fetchSuperUserStatus = async () => {
      try {
        const response = await fetch('/api/user/super-user')
        if (response.ok) {
          const data = await response.json()
          setIsSuperUser(data.isSuperUser)
        }
      } catch (error) {
        logger.error('Failed to fetch super user status:', error)
      } finally {
        setLoadingSuperUser(false)
      }
    }

    if (session?.user?.id) {
      fetchSuperUserStatus()
    }
  }, [session?.user?.id])

  const {
    previewUrl: profilePictureUrl,
    fileInputRef: profilePictureInputRef,
    handleThumbnailClick: handleProfilePictureClick,
    handleFileChange: handleProfilePictureChange,
    isUploading: isUploadingProfilePicture,
  } = useProfilePictureUpload({
    currentImage: profile?.image || null,
    onUpload: (url: string | null) => {
      updateProfile
        .mutateAsync({ image: url })
        .then(() => {
          setUploadError(null)
        })
        .catch(() => {
          setUploadError(
            url ? 'Failed to update profile picture' : 'Failed to remove profile picture'
          )
        })
    },
    onError: (error: string) => {
      setUploadError(error)
      setTimeout(() => setUploadError(null), 5000)
    },
  })

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingName])

  const handleUpdateName = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return
    }

    if (trimmedName === profile?.name) {
      setIsEditingName(false)
      return
    }

    try {
      await updateProfile.mutateAsync({ name: trimmedName })
      setIsEditingName(false)
    } catch (error) {
      logger.error('Error updating name:', error)
      setName(profile?.name || '')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleUpdateName()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setName(profile?.name || '')
  }

  const handleInputBlur = () => {
    handleUpdateName()
  }

  const handleSignOut = async () => {
    try {
      await Promise.all([signOut(), clearUserData()])
      router.push('/login?fromLogout=true')
    } catch (error) {
      logger.error('Error signing out:', { error })
      router.push('/login?fromLogout=true')
    }
  }

  const handleResetPasswordConfirm = async () => {
    if (!profile?.email) return

    setIsResettingPassword(true)
    setResetPasswordError(null)

    try {
      const response = await fetch('/api/auth/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          redirectTo: `${getBaseUrl()}/reset-password`,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send reset password email')
      }

      setResetPasswordSuccess(true)

      setTimeout(() => {
        setShowResetPasswordModal(false)
        setResetPasswordSuccess(false)
      }, 1500)
    } catch (error) {
      logger.error('Error resetting password:', error)
      setResetPasswordError('Failed to send email')

      setTimeout(() => {
        setResetPasswordError(null)
      }, 5000)
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleThemeChange = async (value: string) => {
    await updateSetting.mutateAsync({ key: 'theme', value: value as 'system' | 'light' | 'dark' })
  }

  const handleAutoConnectChange = async (checked: boolean) => {
    if (checked !== settings?.autoConnect && !updateSetting.isPending) {
      await updateSetting.mutateAsync({ key: 'autoConnect', value: checked })
    }
  }

  const handleTrainingControlsChange = async (checked: boolean) => {
    if (checked !== settings?.showTrainingControls && !updateSetting.isPending) {
      await updateSetting.mutateAsync({ key: 'showTrainingControls', value: checked })
    }
  }

  const handleErrorNotificationsChange = async (checked: boolean) => {
    if (checked !== settings?.errorNotificationsEnabled && !updateSetting.isPending) {
      await updateSetting.mutateAsync({ key: 'errorNotificationsEnabled', value: checked })
    }
  }

  const handleSuperUserModeToggle = async (checked: boolean) => {
    if (checked !== settings?.superUserModeEnabled && !updateSetting.isPending) {
      await updateSetting.mutateAsync({ key: 'superUserModeEnabled', value: checked })
    }
  }

  const handleTelemetryToggle = async (checked: boolean) => {
    if (checked !== settings?.telemetryEnabled && !updateSetting.isPending) {
      await updateSetting.mutateAsync({ key: 'telemetryEnabled', value: checked })

      if (checked) {
        if (typeof window !== 'undefined') {
          fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: 'consent',
              action: 'enable_from_settings',
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {})
        }
      }
    }
  }

  const imageUrl = profilePictureUrl || profile?.image || brandConfig.logoUrl

  if (isLoading) {
    return <GeneralSkeleton />
  }

  return (
    <div className='flex h-full flex-col gap-[16px]'>
      {/* User Info Section */}
      <div className='flex items-center gap-[12px]'>
        <div className='relative'>
          <div
            className={`group relative flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-all hover:bg-[var(--bg)] ${!imageUrl ? 'border border-[var(--border)]' : ''}`}
            onClick={handleProfilePictureClick}
          >
            {(() => {
              if (imageUrl) {
                return (
                  <Image
                    src={imageUrl}
                    alt={profile?.name || 'User'}
                    width={36}
                    height={36}
                    unoptimized
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                      isUploadingProfilePicture ? 'opacity-50' : 'opacity-100'
                    }`}
                  />
                )
              }
              return (
                <span className='font-medium text-[14px] text-[var(--text-primary)]'>
                  {getInitials(profile?.name) || ''}
                </span>
              )
            })()}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                isUploadingProfilePicture ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {isUploadingProfilePicture ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <Camera className='h-4 w-4 text-white' />
              )}
            </div>
          </div>
          <Input
            type='file'
            accept='image/png,image/jpeg,image/jpg'
            className='hidden'
            ref={profilePictureInputRef}
            onChange={handleProfilePictureChange}
            disabled={isUploadingProfilePicture}
          />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-[1px]'>
          <div className='flex items-center gap-[8px]'>
            {isEditingName ? (
              <>
                <div className='relative inline-flex'>
                  <span
                    className='invisible whitespace-pre font-medium text-[14px]'
                    aria-hidden='true'
                  >
                    {name || '\u00A0'}
                  </span>
                  <input
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    className='absolute top-0 left-0 h-full w-full border-0 bg-transparent p-0 font-medium text-[14px] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
                    maxLength={100}
                    disabled={updateProfile.isPending}
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                    spellCheck='false'
                  />
                </div>
                <Button
                  variant='ghost'
                  className='h-[12px] w-[12px] flex-shrink-0 p-0'
                  onClick={handleUpdateName}
                  disabled={updateProfile.isPending}
                  aria-label='Save name'
                >
                  <Check className='h-[12px] w-[12px]' />
                </Button>
              </>
            ) : (
              <>
                <h3 className='font-medium text-[14px]'>{profile?.name || ''}</h3>
                <Button
                  variant='ghost'
                  className='h-[10.5px] w-[10.5px] flex-shrink-0 p-0'
                  onClick={() => setIsEditingName(true)}
                  aria-label='Edit name'
                >
                  <Pencil className='h-[10.5px] w-[10.5px]' />
                </Button>
              </>
            )}
          </div>
          <p className='text-[13px] text-[var(--text-tertiary)]'>{profile?.email || ''}</p>
        </div>
      </div>
      {uploadError && <p className='text-[13px] text-[var(--text-error)]'>{uploadError}</p>}

      {/* <div className='flex items-center justify-between border-b pb-[12px]'>
        <Label htmlFor='theme-select'>Theme</Label>
        <div className='w-[100px]'>
          <Combobox
            size='sm'
            align='end'
            dropdownWidth={140}
            value={settings?.theme}
            onChange={handleThemeChange}
            disabled={updateSetting.isPending}
            placeholder='Select theme'
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
          />
        </div>
      </div> */}

      <div className='flex items-center justify-between pt-[12px]'>
        <Label htmlFor='auto-connect'>Auto-connect on drop</Label>
        <Switch
          id='auto-connect'
          checked={settings?.autoConnect ?? true}
          onCheckedChange={handleAutoConnectChange}
          disabled={updateSetting.isPending}
        />
      </div>

      <div className='flex items-center justify-between'>
        <Label htmlFor='error-notifications'>Run error notifications</Label>
        <Switch
          id='error-notifications'
          checked={settings?.errorNotificationsEnabled ?? true}
          onCheckedChange={handleErrorNotificationsChange}
          disabled={updateSetting.isPending}
        />
      </div>

      <div className='flex items-center justify-between border-t pt-[12px]'>
        <Label htmlFor='telemetry'>Allow anonymous telemetry</Label>
        <Switch
          id='telemetry'
          checked={settings?.telemetryEnabled ?? true}
          onCheckedChange={handleTelemetryToggle}
          disabled={updateSetting.isPending}
        />
      </div>

      <p className='text-[12px] text-[var(--text-muted)]'>
        We use OpenTelemetry to collect anonymous usage data to improve Sim. All data is collected
        in accordance with our privacy policy, and you can opt-out at any time.
      </p>

      {isTrainingEnabled && (
        <div className='flex items-center justify-between'>
          <Label htmlFor='training-controls'>Training controls</Label>
          <Switch
            id='training-controls'
            checked={settings?.showTrainingControls ?? false}
            onCheckedChange={handleTrainingControlsChange}
            disabled={updateSetting.isPending}
          />
        </div>
      )}

      {!loadingSuperUser && isSuperUser && (
        <div className='flex items-center justify-between'>
          <Label htmlFor='super-user-mode'>Super admin mode</Label>
          <Switch
            id='super-user-mode'
            checked={settings?.superUserModeEnabled ?? true}
            onCheckedChange={handleSuperUserModeToggle}
            disabled={updateSetting.isPending}
          />
        </div>
      )}

      {!isAuthDisabled && (
        <div className='mt-auto flex items-center gap-[8px]'>
          <Button onClick={handleSignOut}>Sign out</Button>
          <Button onClick={() => setShowResetPasswordModal(true)}>Reset password</Button>
        </div>
      )}

      {/* Password Reset Confirmation Modal */}
      <Modal open={showResetPasswordModal} onOpenChange={setShowResetPasswordModal}>
        <ModalContent size='sm'>
          <ModalHeader>Reset Password</ModalHeader>
          <ModalBody>
            <p className='text-[12px] text-[var(--text-tertiary)]'>
              A password reset link will be sent to{' '}
              <span className='font-medium text-[var(--text-primary)]'>{profile?.email}</span>.
              Click the link in the email to create a new password.
            </p>
            {resetPasswordError && (
              <p className='mt-[8px] text-[12px] text-[var(--text-error)]'>{resetPasswordError}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setShowResetPasswordModal(false)}
              disabled={isResettingPassword || resetPasswordSuccess}
            >
              Cancel
            </Button>
            <Button
              variant='primary'
              onClick={handleResetPasswordConfirm}
              disabled={isResettingPassword || resetPasswordSuccess}
            >
              {isResettingPassword
                ? 'Sending...'
                : resetPasswordSuccess
                  ? 'Sent'
                  : 'Send Reset Email'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

/**
 * Skeleton component for general settings loading state.
 * Matches the exact layout structure of the General component.
 */
function GeneralSkeleton() {
  return (
    <div className='flex h-full flex-col gap-[16px]'>
      {/* User Info Section */}
      <div className='flex items-center gap-[12px]'>
        <Skeleton className='h-9 w-9 rounded-full' />
        <div className='flex flex-1 flex-col justify-center gap-[1px]'>
          <div className='flex items-center gap-[8px]'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-[10.5px] w-[10.5px]' />
          </div>
          <Skeleton className='h-5 w-40' />
        </div>
      </div>

      {/* Auto-connect row */}
      <div className='flex items-center justify-between pt-[12px]'>
        <Skeleton className='h-4 w-36' />
        <Skeleton className='h-[17px] w-[30px] rounded-full' />
      </div>

      {/* Error notifications row */}
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-[17px] w-[30px] rounded-full' />
      </div>

      {/* Telemetry row */}
      <div className='flex items-center justify-between border-t pt-[12px]'>
        <Skeleton className='h-4 w-44' />
        <Skeleton className='h-[17px] w-[30px] rounded-full' />
      </div>

      {/* Telemetry description */}
      <Skeleton className='h-[12px] w-full' />
      <Skeleton className='-mt-2 h-[12px] w-4/5' />

      {/* Action buttons */}
      <div className='mt-auto flex items-center gap-[8px]'>
        <Skeleton className='h-8 w-20 rounded-[4px]' />
        <Skeleton className='h-8 w-28 rounded-[4px]' />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
