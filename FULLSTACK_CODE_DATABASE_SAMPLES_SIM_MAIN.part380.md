---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 380
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 380 of 933)

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

---[FILE: team-usage.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/team-usage/team-usage.tsx
Signals: React

```typescript
import { useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useActiveOrganization } from '@/lib/auth/auth-client'
import { getSubscriptionStatus } from '@/lib/billing/client/utils'
import { getBaseUrl } from '@/lib/core/utils/urls'
import { UsageHeader } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/shared/usage-header'
import {
  UsageLimit,
  type UsageLimitRef,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components'
import { useOrganizationBilling } from '@/hooks/queries/organization'
import { useSubscriptionData } from '@/hooks/queries/subscription'

interface TeamUsageProps {
  hasAdminAccess: boolean
}

export function TeamUsage({ hasAdminAccess }: TeamUsageProps) {
  const { data: activeOrg } = useActiveOrganization()
  const { data: subscriptionData } = useSubscriptionData()
  const subscriptionStatus = getSubscriptionStatus(subscriptionData?.data)

  const {
    data: billingData,
    isLoading: isLoadingOrgBilling,
    error,
  } = useOrganizationBilling(activeOrg?.id || '')

  const usageLimitRef = useRef<UsageLimitRef | null>(null)

  if (isLoadingOrgBilling) {
    return (
      <div className='rounded-[8px] border bg-[var(--surface-3)] p-3 shadow-xs'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
            <div className='flex items-center gap-1 text-xs'>
              <Skeleton className='h-4 w-8' />
              <span className='text-[var(--text-muted)]'>/</span>
              <Skeleton className='h-4 w-8' />
            </div>
          </div>
          <Skeleton className='h-2 w-full rounded' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-[8px] border bg-[var(--surface-3)] p-3 shadow-xs'>
        <p className='text-center text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
          {error instanceof Error ? error.message : 'Failed to load billing data'}
        </p>
      </div>
    )
  }

  if (!billingData) {
    return null
  }

  const currentUsage = billingData.totalCurrentUsage ?? 0
  const currentCap = billingData.totalUsageLimit ?? billingData.minimumBillingAmount ?? 0
  const minimumBilling = billingData.minimumBillingAmount ?? 0
  const seatsCount = billingData.seatsCount ?? 0
  const percentUsed =
    currentCap > 0 ? Math.round(Math.min((currentUsage / currentCap) * 100, 100)) : 0
  const status: 'ok' | 'warning' | 'exceeded' =
    percentUsed >= 100 ? 'exceeded' : percentUsed >= 80 ? 'warning' : 'ok'

  const subscription = subscriptionStatus
  const title = subscription.isEnterprise
    ? 'Enterprise'
    : subscription.isTeam
      ? 'Team'
      : (subscription.plan || 'Free').charAt(0).toUpperCase() +
        (subscription.plan || 'Free').slice(1)

  return (
    <UsageHeader
      title={title}
      gradientTitle={!subscription.isFree}
      showBadge={!!(hasAdminAccess && activeOrg?.id && !subscription.isEnterprise)}
      badgeText={subscription.isEnterprise ? undefined : 'Increase Limit'}
      onBadgeClick={() => {
        if (!subscription.isEnterprise) usageLimitRef.current?.startEdit()
      }}
      seatsText={`${seatsCount} seats`}
      current={currentUsage}
      limit={currentCap}
      isBlocked={Boolean(billingData?.billingBlocked)}
      status={status}
      percentUsed={percentUsed}
      onResolvePayment={async () => {
        try {
          const res = await fetch('/api/billing/portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              context: 'organization',
              organizationId: activeOrg?.id,
              returnUrl: `${getBaseUrl()}/workspace?billing=updated`,
            }),
          })
          const data = await res.json()
          if (!res.ok || !data?.url)
            throw new Error(data?.error || 'Failed to start billing portal')
          window.location.href = data.url
        } catch (e) {
          alert(e instanceof Error ? e.message : 'Failed to open billing portal')
        }
      }}
      rightContent={
        hasAdminAccess && activeOrg?.id && !subscription.isEnterprise ? (
          <UsageLimit
            ref={usageLimitRef}
            currentLimit={currentCap}
            currentUsage={currentUsage}
            canEdit={hasAdminAccess && !subscription.isEnterprise}
            minimumLimit={minimumBilling}
            context='organization'
            organizationId={activeOrg.id}
          />
        ) : (
          <span className='font-medium text-[12px] text-[var(--text-secondary)] tabular-nums'>
            ${currentCap.toFixed(0)}
          </span>
        )
      }
      progressValue={percentUsed}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: template-profile.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/template-profile/template-profile.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Camera, Globe, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'
import { Button, Combobox, Input, Textarea } from '@/components/emcn'
import { AgentIcon, xIcon as XIcon } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import type { CreatorProfileDetails } from '@/app/_types/creator-profile'
import { useProfilePictureUpload } from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/hooks/use-profile-picture-upload'
import {
  useCreatorProfile,
  useOrganizations,
  useSaveCreatorProfile,
} from '@/hooks/queries/creator-profile'

const logger = createLogger('TemplateProfile')

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface FormData {
  referenceType: 'user' | 'organization'
  referenceId: string
  name: string
  profileImageUrl: string
  about: string
  xUrl: string
  linkedinUrl: string
  websiteUrl: string
  contactEmail: string
}

/**
 * Extracts initials from a name string.
 * @param name - The name to extract initials from
 * @returns Up to 2 uppercase characters representing the initials
 */
function getInitials(name: string | undefined | null): string {
  if (!name?.trim()) return ''
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return parts[0][0].toUpperCase()
}

/**
 * Strips the protocol (http:// or https://) from a URL for display purposes.
 * @param url - The URL to strip the protocol from
 * @returns The URL without the protocol prefix
 */
function stripProtocol(url: string): string {
  if (!url) return ''
  return url.replace(/^https?:\/\//, '')
}

/**
 * Normalizes a URL by adding https:// protocol if not present.
 * @param url - The URL to normalize (may or may not have protocol)
 * @returns The URL with https:// protocol, or empty string if input is empty
 */
function normalizeUrl(url: string): string {
  if (!url?.trim()) return ''
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

/**
 * Template Profile settings component for managing user/organization profiles
 */
export function TemplateProfile() {
  const { data: session, isPending: isSessionLoading } = useSession()
  const userId = session?.user?.id || ''

  const { data: organizations = [], isLoading: isOrganizationsLoading } = useOrganizations()
  const { data: existingProfile, isLoading: isProfileLoading } = useCreatorProfile(userId)
  const saveProfile = useSaveCreatorProfile()

  const isLoading = isSessionLoading || isOrganizationsLoading || (!!userId && isProfileLoading)

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [imageLoadError, setImageLoadError] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    referenceType: 'user',
    referenceId: session?.user?.id || '',
    name: session?.user?.name || session?.user?.email || '',
    profileImageUrl: '',
    about: '',
    xUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    contactEmail: '',
  })

  const [initialFormData, setInitialFormData] = useState<FormData | null>(null)

  const {
    previewUrl: profilePictureUrl,
    fileInputRef: profilePictureInputRef,
    handleThumbnailClick: handleProfilePictureClick,
    handleFileChange: handleProfilePictureChange,
    isUploading: isUploadingProfilePicture,
  } = useProfilePictureUpload({
    currentImage: formData.profileImageUrl,
    onUpload: async (url) => {
      setFormData((prev) => ({ ...prev, profileImageUrl: url || '' }))
      setUploadError(null)
      setImageLoadError(false)
    },
    onError: (error) => {
      setUploadError(error)
      setTimeout(() => setUploadError(null), 5000)
    },
  })

  // Reset image load error when the URL changes
  useEffect(() => {
    setImageLoadError(false)
  }, [profilePictureUrl])

  // Initialize referenceId and initial form data when session loads (for new profiles)
  useEffect(() => {
    if (userId && !existingProfile && !isProfileLoading) {
      setFormData((prev) => {
        const newData = {
          ...prev,
          referenceId: prev.referenceType === 'user' ? userId : prev.referenceId,
        }
        // Set initial form data for new profiles to track changes
        if (initialFormData === null) {
          setInitialFormData(newData)
        }
        return newData
      })
    }
  }, [userId, existingProfile, isProfileLoading, initialFormData])

  // Load existing profile data
  useEffect(() => {
    if (existingProfile) {
      const details = existingProfile.details as CreatorProfileDetails | null
      const loadedData: FormData = {
        referenceType: existingProfile.referenceType,
        referenceId: existingProfile.referenceId,
        name: existingProfile.name || '',
        profileImageUrl: existingProfile.profileImageUrl || '',
        about: details?.about || '',
        // Strip protocol from URLs for display
        xUrl: stripProtocol(details?.xUrl || ''),
        linkedinUrl: stripProtocol(details?.linkedinUrl || ''),
        websiteUrl: stripProtocol(details?.websiteUrl || ''),
        contactEmail: details?.contactEmail || '',
      }
      setFormData(loadedData)
      setInitialFormData(loadedData)
    }
  }, [existingProfile])

  const handleSubmit = async () => {
    if (!userId) return
    if (!formData.name.trim() || !formData.profileImageUrl) return

    setSaveStatus('saving')
    setSaveError(null)

    try {
      const details: CreatorProfileDetails = {}
      if (formData.about) details.about = formData.about
      // Normalize URLs by adding https:// protocol before saving
      if (formData.xUrl) details.xUrl = normalizeUrl(formData.xUrl)
      if (formData.linkedinUrl) details.linkedinUrl = normalizeUrl(formData.linkedinUrl)
      if (formData.websiteUrl) details.websiteUrl = normalizeUrl(formData.websiteUrl)
      if (formData.contactEmail) details.contactEmail = formData.contactEmail

      await saveProfile.mutateAsync({
        referenceType: formData.referenceType,
        referenceId: formData.referenceId,
        name: formData.name,
        profileImageUrl: formData.profileImageUrl,
        details: Object.keys(details).length > 0 ? details : undefined,
        existingProfileId: existingProfile?.id,
      })

      setInitialFormData({ ...formData })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      logger.error('Error saving creator profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save creator profile'
      setSaveError(errorMessage)
      setSaveStatus('idle')
    }
  }

  /**
   * Validates a URL by normalizing it first (adding protocol if needed).
   * @param value - The URL value to validate (with or without protocol)
   * @returns Error message if invalid, null if valid
   */
  const validateUrl = (value: string): string | null => {
    if (!value) return null
    try {
      new URL(normalizeUrl(value))
      return null
    } catch {
      return 'Please enter a valid URL'
    }
  }

  const validateEmail = (value: string): string | null => {
    if (!value) return null
    const validation = quickValidateEmail(value)
    return validation.isValid ? null : 'Please enter a valid email'
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    // For URL fields, strip the protocol for display
    const isUrlField = field === 'xUrl' || field === 'linkedinUrl' || field === 'websiteUrl'
    const processedValue = isUrlField ? (stripProtocol(value as string) as FormData[K]) : value

    setFormData((prev) => ({ ...prev, [field]: processedValue }))

    // Validate URL fields on change
    if (isUrlField) {
      const error = validateUrl(processedValue as string)
      setFieldErrors((prev) => ({ ...prev, [field]: error || undefined }))
    } else if (field === 'contactEmail') {
      const error = validateEmail(value as string)
      setFieldErrors((prev) => ({ ...prev, [field]: error || undefined }))
    }
  }

  const hasFieldErrors = Object.values(fieldErrors).some(Boolean)
  const hasChanges =
    initialFormData !== null &&
    (formData.referenceType !== initialFormData.referenceType ||
      formData.referenceId !== initialFormData.referenceId ||
      formData.name !== initialFormData.name ||
      formData.profileImageUrl !== initialFormData.profileImageUrl ||
      formData.about !== initialFormData.about ||
      formData.xUrl !== initialFormData.xUrl ||
      formData.linkedinUrl !== initialFormData.linkedinUrl ||
      formData.websiteUrl !== initialFormData.websiteUrl ||
      formData.contactEmail !== initialFormData.contactEmail)
  const isFormValid =
    formData.name.trim() && formData.profileImageUrl && !hasFieldErrors && hasChanges

  if (isLoading) {
    return (
      <div className='flex h-full flex-col gap-[16px]'>
        <div className='min-h-0 flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-[16px]'>
            {/* Display Skeleton */}
            <div className='flex flex-col gap-[8px]'>
              <Skeleton className='h-5 w-[50px]' />
              <div className='flex items-center gap-[10px]'>
                <Skeleton className='h-9 w-9 flex-shrink-0 rounded-full' />
                <Skeleton className='h-9 flex-1' />
              </div>
            </div>

            {/* About Skeleton */}
            <div className='flex flex-col gap-[8px]'>
              <Skeleton className='h-5 w-[35px]' />
              <Skeleton className='min-h-[100px] w-full' />
            </div>

            {/* Socials Skeleton */}
            <div className='flex flex-col gap-[8px]'>
              <Skeleton className='h-5 w-[45px]' />
              <Skeleton className='h-9 w-full' />
              <Skeleton className='h-9 w-full' />
              <Skeleton className='h-9 w-full' />
              <Skeleton className='h-9 w-full' />
            </div>
          </div>
        </div>

        {/* Save Button Skeleton */}
        <div className='mt-auto flex items-center justify-end gap-[8px]'>
          <Skeleton className='h-9 w-[60px]' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col gap-[16px]'>
      {/* Scrollable Content */}
      <div className='min-h-0 flex-1 overflow-y-auto'>
        <div className='flex flex-col gap-[16px]'>
          {/* Profile Selection - only show if user has organizations */}
          {organizations.length > 0 && (
            <div className='flex flex-col gap-[8px]'>
              <span className='font-medium text-[13px] text-[var(--text-secondary)]'>Profile</span>
              <Combobox
                options={[
                  { label: 'Personal', value: userId },
                  ...organizations.map((org) => ({
                    label: org.name,
                    value: org.id,
                  })),
                ]}
                value={formData.referenceId}
                onChange={(value) => {
                  const isPersonal = value === userId
                  setFormData((prev) => ({
                    ...prev,
                    referenceType: isPersonal ? 'user' : 'organization',
                    referenceId: value,
                  }))
                }}
                placeholder='Select profile'
                editable={false}
              />
            </div>
          )}

          {/* Display */}
          <div className='flex flex-col gap-[8px]'>
            <span className='font-medium text-[13px] text-[var(--text-secondary)]'>
              Display<span className='ml-[6px] text-[var(--text-secondary)]'>*</span>
            </span>
            <div className='flex items-center gap-[10px]'>
              <div className='relative'>
                <div
                  className={`group relative flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition-all hover:bg-[var(--bg)] ${
                    profilePictureUrl && !imageLoadError
                      ? 'border-transparent'
                      : 'border-[var(--border)]'
                  }`}
                  onClick={handleProfilePictureClick}
                >
                  {(() => {
                    if (profilePictureUrl && !imageLoadError) {
                      return (
                        <Image
                          src={profilePictureUrl}
                          alt={formData.name || 'Profile picture'}
                          width={36}
                          height={36}
                          unoptimized
                          className={`h-full w-full object-cover transition-opacity duration-300 ${
                            isUploadingProfilePicture ? 'opacity-50' : 'opacity-100'
                          }`}
                          onError={() => setImageLoadError(true)}
                        />
                      )
                    }
                    const initials = getInitials(formData.name)
                    if (initials) {
                      return (
                        <span className='font-medium text-[14px] text-[var(--text-primary)]'>
                          {initials}
                        </span>
                      )
                    }
                    return <AgentIcon className='h-4 w-4 text-[var(--text-muted)]' />
                  })()}
                  <div
                    className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                      isUploadingProfilePicture
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isUploadingProfilePicture ? (
                      <div className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    ) : (
                      <Camera className='h-3 w-3 text-white' />
                    )}
                  </div>
                </div>
                <input
                  type='file'
                  accept='image/png,image/jpeg,image/jpg'
                  className='hidden'
                  ref={profilePictureInputRef}
                  onChange={handleProfilePictureChange}
                  disabled={isUploadingProfilePicture}
                />
              </div>
              <Input
                placeholder='Name'
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className='h-9 flex-1'
              />
            </div>
            {uploadError && <p className='text-[12px] text-[var(--text-error)]'>{uploadError}</p>}
          </div>

          {/* About */}
          <div className='flex flex-col gap-[8px]'>
            <span className='font-medium text-[13px] text-[var(--text-secondary)]'>About</span>
            <Textarea
              placeholder='Tell people about yourself or your organization'
              value={formData.about}
              onChange={(e) => updateField('about', e.target.value)}
              className='min-h-[100px] w-full resize-none'
            />
          </div>

          {/* Social Links */}
          <div className='flex flex-col gap-[8px]'>
            <span className='font-medium text-[13px] text-[var(--text-secondary)]'>Socials</span>

            <div>
              <div className='relative'>
                <XIcon className='-translate-y-1/2 absolute top-1/2 left-[10px] h-[14px] w-[14px] text-[var(--text-muted)]' />
                <Input
                  placeholder='x.com/username'
                  value={formData.xUrl}
                  onChange={(e) => updateField('xUrl', e.target.value)}
                  className='h-9 w-full pl-[32px]'
                />
              </div>
              {fieldErrors.xUrl && (
                <p className='mt-[4px] text-[12px] text-[var(--text-error)]'>{fieldErrors.xUrl}</p>
              )}
            </div>

            <div>
              <div className='relative'>
                <Linkedin className='-translate-y-1/2 absolute top-1/2 left-[10px] h-[14px] w-[14px] text-[var(--text-muted)]' />
                <Input
                  placeholder='linkedin.com/in/username'
                  value={formData.linkedinUrl}
                  onChange={(e) => updateField('linkedinUrl', e.target.value)}
                  className='h-9 w-full pl-[32px]'
                />
              </div>
              {fieldErrors.linkedinUrl && (
                <p className='mt-[4px] text-[12px] text-[var(--text-error)]'>
                  {fieldErrors.linkedinUrl}
                </p>
              )}
            </div>

            <div>
              <div className='relative'>
                <Globe className='-translate-y-1/2 absolute top-1/2 left-[10px] h-[14px] w-[14px] text-[var(--text-muted)]' />
                <Input
                  placeholder='yourwebsite.com'
                  value={formData.websiteUrl}
                  onChange={(e) => updateField('websiteUrl', e.target.value)}
                  className='h-9 w-full pl-[32px]'
                />
              </div>
              {fieldErrors.websiteUrl && (
                <p className='mt-[4px] text-[12px] text-[var(--text-error)]'>
                  {fieldErrors.websiteUrl}
                </p>
              )}
            </div>

            <div>
              <div className='relative'>
                <Mail className='-translate-y-1/2 absolute top-1/2 left-[10px] h-[14px] w-[14px] text-[var(--text-muted)]' />
                <Input
                  placeholder='contact@example.com'
                  type='email'
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className='h-9 w-full pl-[32px]'
                />
              </div>
              {fieldErrors.contactEmail && (
                <p className='mt-[4px] text-[12px] text-[var(--text-error)]'>
                  {fieldErrors.contactEmail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-auto flex items-center justify-end gap-[8px]'>
        {saveError && <p className='mr-auto text-[12px] text-[var(--text-error)]'>{saveError}</p>}
        <Button
          onClick={handleSubmit}
          disabled={saveStatus === 'saving' || !isFormValid}
          variant='primary'
          className='!bg-[var(--brand-tertiary-2)] !text-[var(--text-inverse)] hover:!bg-[var(--brand-tertiary-2)]/90'
        >
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: use-profile-picture-upload.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/hooks/use-profile-picture-upload.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('ProfilePictureUpload')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

interface UseProfilePictureUploadProps {
  onUpload?: (url: string | null) => void
  onError?: (error: string) => void
  currentImage?: string | null
}

/**
 * Hook for handling profile picture upload functionality.
 * Manages file validation, preview generation, and server upload.
 */
export function useProfilePictureUpload({
  onUpload,
  onError,
  currentImage,
}: UseProfilePictureUploadProps = {}) {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (currentImage !== previewUrl) {
      if (previewRef.current && previewRef.current !== currentImage) {
        URL.revokeObjectURL(previewRef.current)
        previewRef.current = null
      }
      setPreviewUrl(currentImage || null)
    }
  }, [currentImage, previewUrl])

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 5MB.`
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return `File "${file.name}" is not a supported image format. Please use PNG or JPEG.`
    }
    return null
  }, [])

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const uploadFileToServer = useCallback(async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('context', 'profile-pictures')

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || `Failed to upload file: ${response.status}`)
      }

      const data = await response.json()
      const publicUrl = data.fileInfo?.path || data.path || data.url
      logger.info(`Profile picture uploaded successfully via server upload: ${publicUrl}`)
      return publicUrl
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload profile picture')
    }
  }, [])

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const validationError = validateFile(file)
        if (validationError) {
          onError?.(validationError)
          return
        }

        setFileName(file.name)

        const newPreviewUrl = URL.createObjectURL(file)

        if (previewRef.current) {
          URL.revokeObjectURL(previewRef.current)
        }

        setPreviewUrl(newPreviewUrl)
        previewRef.current = newPreviewUrl

        setIsUploading(true)
        try {
          const serverUrl = await uploadFileToServer(file)

          URL.revokeObjectURL(newPreviewUrl)
          previewRef.current = null
          setPreviewUrl(serverUrl)

          onUpload?.(serverUrl)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to upload profile picture'
          onError?.(errorMessage)

          URL.revokeObjectURL(newPreviewUrl)
          previewRef.current = null
          setPreviewUrl(currentImage || null)
        } finally {
          setIsUploading(false)
        }
      }
    },
    [onUpload, onError, uploadFileToServer, validateFile, currentImage]
  )

  const handleRemove = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
    }
    setPreviewUrl(null)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onUpload?.(null)
  }, [onUpload])

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    isUploading,
  }
}
```

--------------------------------------------------------------------------------

````
