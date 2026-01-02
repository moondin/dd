---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 378
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 378 of 933)

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

---[FILE: credit-balance.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/credit-balance/credit-balance.tsx
Signals: React

```typescript
'use client'

import { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
} from '@/components/emcn'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('CreditBalance')

interface CreditBalanceProps {
  balance: number
  canPurchase: boolean
  entityType: 'user' | 'organization'
  isLoading?: boolean
  onPurchaseComplete?: () => void
}

export function CreditBalance({
  balance,
  canPurchase,
  entityType,
  isLoading,
  onPurchaseComplete,
}: CreditBalanceProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    setAmount(numericValue)
    setError(null)
  }

  const handlePurchase = async () => {
    if (!requestId || isPurchasing) return

    const numAmount = Number.parseInt(amount, 10)

    if (Number.isNaN(numAmount) || numAmount < 10) {
      setError('Minimum purchase is $10')
      return
    }

    if (numAmount > 1000) {
      setError('Maximum purchase is $1,000')
      return
    }

    setIsPurchasing(true)
    setError(null)

    try {
      const response = await fetch('/api/billing/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount, requestId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to purchase credits')
      }

      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        onPurchaseComplete?.()
      }, 1500)
    } catch (err) {
      logger.error('Credit purchase failed', { error: err })
      setError(err instanceof Error ? err.message : 'Failed to purchase credits')
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // Generate new requestId when modal opens - same ID used for entire session
      setRequestId(crypto.randomUUID())
    } else {
      setAmount('')
      setError(null)
      setSuccess(false)
      setRequestId(null)
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-sm'>Credit Balance</span>
        <span className='font-medium text-sm'>{isLoading ? '...' : `$${balance.toFixed(2)}`}</span>
      </div>

      {canPurchase && (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
          <ModalTrigger asChild>
            <Button variant='outline'>Add Credits</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>Add Credits</ModalHeader>
            <div className='px-4'>
              <p className='text-[13px] text-[var(--text-secondary)]'>
                Credits are used before overage charges. Min $10, max $1,000.
              </p>
            </div>

            {success ? (
              <div className='py-4 text-center'>
                <p className='text-[14px] text-[var(--text-primary)]'>
                  Credits added successfully!
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-3 py-2'>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='credit-amount'
                    className='text-[12px] text-[var(--text-secondary)]'
                  >
                    Amount (USD)
                  </label>
                  <div className='relative'>
                    <span className='-translate-y-1/2 absolute top-1/2 left-3 text-[var(--text-secondary)]'>
                      $
                    </span>
                    <Input
                      id='credit-amount'
                      type='text'
                      inputMode='numeric'
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder='50'
                      className='pl-7'
                      disabled={isPurchasing}
                    />
                  </div>
                  {error && <span className='text-[11px] text-red-500'>{error}</span>}
                </div>

                <div className='rounded-[4px] bg-[var(--surface-5)] p-2'>
                  <p className='text-[11px] text-[var(--text-tertiary)]'>
                    Credits are non-refundable and don't expire. They'll be applied automatically to
                    your {entityType === 'organization' ? 'team' : ''} usage.
                  </p>
                </div>
              </div>
            )}

            {!success && (
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant='ghost' disabled={isPurchasing}>
                    Cancel
                  </Button>
                </ModalClose>
                <Button
                  variant='primary'
                  onClick={handlePurchase}
                  disabled={isPurchasing || !amount}
                >
                  {isPurchasing ? 'Processing...' : 'Purchase'}
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/credit-balance/index.ts

```typescript
export { CreditBalance } from './credit-balance'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/plan-card/index.ts

```typescript
export { PlanCard, type PlanCardProps, type PlanFeature } from './plan-card'
```

--------------------------------------------------------------------------------

---[FILE: plan-card.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/plan-card/plan-card.tsx
Signals: React

```typescript
'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'

export interface PlanFeature {
  icon: LucideIcon
  text: string
}

export interface PlanCardProps {
  name: string
  price: string | ReactNode
  priceSubtext?: string
  features: PlanFeature[]
  buttonText: string
  onButtonClick: () => void
  isError?: boolean
  variant?: 'default' | 'compact'
  layout?: 'vertical' | 'horizontal'
  className?: string
}

/**
 * PlanCard component for displaying subscription plan information
 * Supports both vertical and horizontal layouts with flexible pricing display
 */
export function PlanCard({
  name,
  price,
  priceSubtext,
  features,
  buttonText,
  onButtonClick,
  isError = false,
  variant = 'default',
  layout = 'vertical',
  className,
}: PlanCardProps) {
  const isHorizontal = layout === 'horizontal'

  const renderPrice = () => {
    if (typeof price === 'string') {
      return (
        <>
          <span className='font-semibold text-xl'>{price}</span>
          {priceSubtext && (
            <span className='ml-1 text-[var(--text-muted)] text-xs'>{priceSubtext}</span>
          )}
        </>
      )
    }
    return price
  }

  const renderFeatures = () => {
    if (isHorizontal) {
      return (
        <div className='mt-3 flex flex-wrap items-center gap-4'>
          {features.map((feature, index) => (
            <div key={`${feature.text}-${index}`} className='flex items-center gap-2 text-xs'>
              <feature.icon className='h-3 w-3 flex-shrink-0 text-[var(--text-muted)]' />
              <span className='text-[var(--text-muted)]'>{feature.text}</span>
              {index < features.length - 1 && (
                <div className='ml-4 h-4 w-px bg-[var(--border)]' aria-hidden='true' />
              )}
            </div>
          ))}
        </div>
      )
    }

    return (
      <ul className='mb-4 flex-1 space-y-2'>
        {features.map((feature, index) => (
          <li key={`${feature.text}-${index}`} className='flex items-start gap-2 text-xs'>
            <feature.icon
              className='mt-0.5 h-3 w-3 flex-shrink-0 text-[var(--text-muted)]'
              aria-hidden='true'
            />
            <span className='text-[var(--text-muted)]'>{feature.text}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <article
      className={cn(
        'relative flex rounded-[8px] border p-4 transition-colors hover:border-[var(--border-hover)]',
        isHorizontal ? 'flex-row items-center justify-between' : 'flex-col',
        className
      )}
    >
      <header className={isHorizontal ? undefined : 'mb-4'}>
        <h3 className='mb-2 font-semibold text-sm'>{name}</h3>
        <div className='flex items-baseline'>{renderPrice()}</div>
        {isHorizontal && renderFeatures()}
      </header>

      {!isHorizontal && renderFeatures()}

      <div className={isHorizontal ? 'ml-auto' : undefined}>
        <Button
          onClick={onButtonClick}
          className={cn(
            'h-9 rounded-[8px] text-xs',
            isHorizontal ? 'px-4' : 'w-full',
            isError && 'border-[var(--text-error)] text-[var(--text-error)]'
          )}
          variant='outline'
          aria-label={`${buttonText} ${name} plan`}
        >
          {isError ? 'Error' : buttonText}
        </Button>
      </div>
    </article>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/usage-limit/index.ts

```typescript
export type { UsageLimitRef } from './usage-limit'
export { UsageLimit } from './usage-limit'
```

--------------------------------------------------------------------------------

---[FILE: usage-limit.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/subscription/components/usage-limit/usage-limit.tsx
Signals: React

```typescript
'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { Button } from '@/components/emcn'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { useUpdateOrganizationUsageLimit } from '@/hooks/queries/organization'
import { useUpdateUsageLimit } from '@/hooks/queries/subscription'

const logger = createLogger('UsageLimit')

interface UsageLimitProps {
  currentLimit: number
  currentUsage: number
  canEdit: boolean
  minimumLimit: number
  onLimitUpdated?: (newLimit: number) => void
  context?: 'user' | 'organization'
  organizationId?: string
}

export interface UsageLimitRef {
  startEdit: () => void
}

export const UsageLimit = forwardRef<UsageLimitRef, UsageLimitProps>(
  (
    {
      currentLimit,
      currentUsage,
      canEdit,
      minimumLimit,
      onLimitUpdated,
      context = 'user',
      organizationId,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(currentLimit.toString())
    const [hasError, setHasError] = useState(false)
    const [errorType, setErrorType] = useState<'general' | 'belowUsage' | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [pendingLimit, setPendingLimit] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const updateUserLimitMutation = useUpdateUsageLimit()
    const updateOrgLimitMutation = useUpdateOrganizationUsageLimit()

    const isUpdating =
      context === 'organization'
        ? updateOrgLimitMutation.isPending
        : updateUserLimitMutation.isPending

    const handleStartEdit = () => {
      if (!canEdit) return
      setIsEditing(true)
      const displayLimit = pendingLimit !== null ? pendingLimit : currentLimit
      setInputValue(displayLimit.toString())
    }

    useImperativeHandle(
      ref,
      () => ({
        startEdit: handleStartEdit,
      }),
      [canEdit, currentLimit, pendingLimit]
    )

    useEffect(() => {
      if (pendingLimit !== null) {
        if (currentLimit === pendingLimit) {
          setPendingLimit(null)
          setInputValue(currentLimit.toString())
        }
      } else {
        setInputValue(currentLimit.toString())
      }
    }, [currentLimit, pendingLimit])

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }, [isEditing])

    useEffect(() => {
      if (hasError) {
        const timer = setTimeout(() => {
          setHasError(false)
          setErrorType(null)
        }, 2000)
        return () => clearTimeout(timer)
      }
    }, [hasError])

    const handleSubmit = async () => {
      const newLimit = Number.parseInt(inputValue, 10)

      if (Number.isNaN(newLimit) || newLimit < minimumLimit) {
        setInputValue(currentLimit.toString())
        setIsEditing(false)
        return
      }

      if (newLimit < currentUsage) {
        setHasError(true)
        setErrorType('belowUsage')
        return
      }

      if (newLimit === currentLimit) {
        setIsEditing(false)
        return
      }

      try {
        if (context === 'organization') {
          if (!organizationId) {
            logger.error('Organization ID is required for organization context')
            setErrorType('general')
            setHasError(true)
            return
          }

          await updateOrgLimitMutation.mutateAsync({ organizationId, limit: newLimit })
        } else {
          await updateUserLimitMutation.mutateAsync({ limit: newLimit })
        }

        setPendingLimit(newLimit)
        setInputValue(newLimit.toString())
        onLimitUpdated?.(newLimit)
        setIsEditing(false)
        setErrorType(null)
        setHasError(false)
      } catch (err) {
        logger.error('Failed to update usage limit', { error: err })

        const message = err instanceof Error ? err.message : String(err)
        if (message.includes('below current usage')) {
          setErrorType('belowUsage')
        } else {
          setErrorType('general')
        }

        setPendingLimit(null)
        setInputValue(currentLimit.toString())
        setHasError(true)
      }
    }

    const handleCancelEdit = () => {
      setIsEditing(false)
      const displayLimit = pendingLimit !== null ? pendingLimit : currentLimit
      setInputValue(displayLimit.toString())
      setHasError(false)
      setErrorType(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleCancelEdit()
      }
    }

    const inputWidthCh = Math.max(3, inputValue.length + 1)

    return (
      <div className='flex items-center'>
        {isEditing ? (
          <>
            <span className='text-[var(--text-muted)] text-xs tabular-nums'>$</span>
            <input
              ref={inputRef}
              type='number'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                const relatedTarget = e.relatedTarget as HTMLElement
                if (relatedTarget?.closest('button')) {
                  return
                }
                handleSubmit()
              }}
              className={cn(
                'border-0 bg-transparent p-0 text-xs tabular-nums',
                'outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                hasError && 'text-[var(--text-error)]'
              )}
              min={minimumLimit}
              step='1'
              disabled={isUpdating}
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              style={{ width: `${inputWidthCh}ch` }}
            />
          </>
        ) : (
          <span className='text-[var(--text-muted)] text-xs tabular-nums'>
            ${pendingLimit !== null ? pendingLimit : currentLimit}
          </span>
        )}
        {canEdit && (
          <Button
            variant='ghost'
            className={cn(
              'ml-1 h-4 w-4 p-0 transition-colors hover:bg-transparent',
              hasError
                ? 'text-[var(--text-error)] hover:text-[var(--text-error)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
            onClick={isEditing ? handleSubmit : handleStartEdit}
            disabled={isUpdating}
          >
            {isEditing ? (
              hasError ? (
                <X className='!h-3 !w-3' />
              ) : (
                <Check className='!h-3 !w-3' />
              )
            ) : (
              <Pencil className='!h-3 !w-3' />
            )}
            <span className='sr-only'>{isEditing ? 'Save limit' : 'Edit limit'}</span>
          </Button>
        )}
      </div>
    )
  }
)

UsageLimit.displayName = 'UsageLimit'
```

--------------------------------------------------------------------------------

---[FILE: team-management.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/team-management.tsx
Signals: React

```typescript
import { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui'
import { useSession } from '@/lib/auth/auth-client'
import { DEFAULT_TEAM_TIER_COST_LIMIT } from '@/lib/billing/constants'
import { checkEnterprisePlan } from '@/lib/billing/subscriptions/utils'
import { createLogger } from '@/lib/logs/console/logger'
import {
  generateSlug,
  getUsedSeats,
  getUserRole,
  isAdminOrOwner,
} from '@/lib/workspaces/organization'
import {
  MemberInvitationCard,
  NoOrganizationView,
  RemoveMemberDialog,
  TeamMembers,
  TeamSeats,
  TeamSeatsOverview,
} from '@/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components'
import {
  useCreateOrganization,
  useInviteMember,
  useOrganization,
  useOrganizationBilling,
  useOrganizationSubscription,
  useOrganizations,
  useRemoveMember,
  useUpdateSeats,
} from '@/hooks/queries/organization'
import { useSubscriptionData } from '@/hooks/queries/subscription'
import { useAdminWorkspaces } from '@/hooks/queries/workspace'

const logger = createLogger('TeamManagement')

export function TeamManagement() {
  const { data: session } = useSession()

  const { data: organizationsData } = useOrganizations()
  const activeOrganization = organizationsData?.activeOrganization

  const { data: userSubscriptionData } = useSubscriptionData()
  const hasTeamPlan = userSubscriptionData?.data?.isTeam ?? false
  const hasEnterprisePlan = userSubscriptionData?.data?.isEnterprise ?? false

  const {
    data: organization,
    isLoading,
    error: orgError,
  } = useOrganization(activeOrganization?.id || '')

  const {
    data: subscriptionData,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useOrganizationSubscription(activeOrganization?.id || '')

  const { data: organizationBillingData } = useOrganizationBilling(activeOrganization?.id || '')

  const inviteMutation = useInviteMember()
  const removeMemberMutation = useRemoveMember()
  const updateSeatsMutation = useUpdateSeats()
  const createOrgMutation = useCreateOrganization()

  const [inviteSuccess, setInviteSuccess] = useState(false)

  const [inviteEmail, setInviteEmail] = useState('')
  const [showWorkspaceInvite, setShowWorkspaceInvite] = useState(false)
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<
    Array<{ workspaceId: string; permission: string }>
  >([])
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false)
  const [removeMemberDialog, setRemoveMemberDialog] = useState<{
    open: boolean
    memberId: string
    memberName: string
    shouldReduceSeats: boolean
    isSelfRemoval?: boolean
  }>({ open: false, memberId: '', memberName: '', shouldReduceSeats: false })
  const [orgName, setOrgName] = useState('')
  const [orgSlug, setOrgSlug] = useState('')
  const [isAddSeatDialogOpen, setIsAddSeatDialogOpen] = useState(false)
  const [newSeatCount, setNewSeatCount] = useState(1)
  const [isUpdatingSeats, setIsUpdatingSeats] = useState(false)

  const { data: adminWorkspaces = [], isLoading: isLoadingWorkspaces } = useAdminWorkspaces(
    session?.user?.id
  )

  const userRole = getUserRole(organization, session?.user?.email)
  const adminOrOwner = isAdminOrOwner(organization, session?.user?.email)
  const usedSeats = getUsedSeats(organization)
  const totalSeats = organizationBillingData?.data?.totalSeats ?? 0

  useEffect(() => {
    if ((hasTeamPlan || hasEnterprisePlan) && session?.user?.name && !orgName) {
      const defaultName = `${session.user.name}'s Team`
      setOrgName(defaultName)
      setOrgSlug(generateSlug(defaultName))
    }
  }, [hasTeamPlan, hasEnterprisePlan, session?.user?.name, orgName])

  const handleOrgNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setOrgName(newName)
    setOrgSlug(generateSlug(newName))
  }, [])

  const handleCreateOrganization = useCallback(async () => {
    if (!session?.user || !orgName.trim()) return

    try {
      await createOrgMutation.mutateAsync({
        name: orgName.trim(),
        slug: orgSlug.trim(),
      })

      setCreateOrgDialogOpen(false)
      setOrgName('')
      setOrgSlug('')
    } catch (error) {
      logger.error('Failed to create organization', error)
    }
  }, [orgName, orgSlug, createOrgMutation])

  const handleInviteMember = useCallback(async () => {
    if (!session?.user || !activeOrganization?.id || !inviteEmail.trim()) return

    try {
      const workspaceInvitations =
        selectedWorkspaces.length > 0
          ? selectedWorkspaces.map((w) => ({
              workspaceId: w.workspaceId,
              permission: w.permission as 'admin' | 'write' | 'read',
            }))
          : undefined

      await inviteMutation.mutateAsync({
        email: inviteEmail.trim(),
        orgId: activeOrganization.id,
        workspaceInvitations,
      })

      // Show success state
      setInviteSuccess(true)
      setTimeout(() => setInviteSuccess(false), 3000)

      // Reset form
      setInviteEmail('')
      setSelectedWorkspaces([])
      setShowWorkspaceInvite(false)
    } catch (error) {
      logger.error('Failed to invite member', error)
    }
  }, [session?.user?.id, activeOrganization?.id, inviteEmail, selectedWorkspaces, inviteMutation])

  const handleWorkspaceToggle = useCallback((workspaceId: string, permission: string) => {
    setSelectedWorkspaces((prev) => {
      const exists = prev.find((w) => w.workspaceId === workspaceId)

      if (!permission || permission === '') {
        return prev.filter((w) => w.workspaceId !== workspaceId)
      }

      if (exists) {
        return prev.map((w) => (w.workspaceId === workspaceId ? { ...w, permission } : w))
      }

      return [...prev, { workspaceId, permission }]
    })
  }, [])

  const handleRemoveMember = useCallback(
    async (member: any) => {
      if (!session?.user || !activeOrganization?.id) return

      if (!member.user?.id) {
        logger.error('Member object missing user ID', { member })
        return
      }

      const isLeavingSelf = member.user?.email === session.user.email
      const displayName = isLeavingSelf
        ? 'yourself'
        : member.user?.name || member.user?.email || 'this member'

      setRemoveMemberDialog({
        open: true,
        memberId: member.user.id,
        memberName: displayName,
        shouldReduceSeats: false,
        isSelfRemoval: isLeavingSelf,
      })
    },
    [session?.user, activeOrganization?.id]
  )

  const confirmRemoveMember = useCallback(
    async (shouldReduceSeats = false) => {
      const { memberId } = removeMemberDialog
      if (!session?.user || !activeOrganization?.id || !memberId) return

      try {
        await removeMemberMutation.mutateAsync({
          memberId,
          orgId: activeOrganization?.id,
          shouldReduceSeats,
        })
        setRemoveMemberDialog({
          open: false,
          memberId: '',
          memberName: '',
          shouldReduceSeats: false,
        })
      } catch (error) {
        logger.error('Failed to remove member', error)
      }
    },
    [removeMemberDialog.memberId, session?.user?.id, activeOrganization?.id, removeMemberMutation]
  )

  const handleReduceSeats = useCallback(async () => {
    if (!session?.user || !activeOrganization?.id || !subscriptionData) return
    if (checkEnterprisePlan(subscriptionData)) return

    const currentSeats = subscriptionData.seats || 0
    if (currentSeats <= 1) return

    const { used: totalCount } = usedSeats
    if (totalCount >= currentSeats) return

    try {
      await updateSeatsMutation.mutateAsync({
        orgId: activeOrganization?.id,
        seats: currentSeats - 1,
      })
    } catch (error) {
      logger.error('Failed to reduce seats', error)
    }
  }, [session?.user?.id, activeOrganization?.id, subscriptionData, usedSeats, updateSeatsMutation])

  const handleAddSeatDialog = useCallback(() => {
    if (subscriptionData && !checkEnterprisePlan(subscriptionData)) {
      setNewSeatCount(totalSeats + 1)
      setIsAddSeatDialogOpen(true)
    }
  }, [subscriptionData, totalSeats])

  const confirmAddSeats = useCallback(
    async (selectedSeats?: number) => {
      if (!subscriptionData || !activeOrganization?.id) return

      const seatsToUse = selectedSeats || newSeatCount
      setIsUpdatingSeats(true)

      try {
        await updateSeatsMutation.mutateAsync({
          orgId: activeOrganization?.id,
          seats: seatsToUse,
        })
        setIsAddSeatDialogOpen(false)
      } catch (error) {
        logger.error('Failed to add seats', error)
      } finally {
        setIsUpdatingSeats(false)
      }
    },
    [subscriptionData, activeOrganization?.id, newSeatCount, updateSeatsMutation]
  )

  const confirmTeamUpgrade = useCallback(
    async (seats: number) => {
      if (!session?.user || !activeOrganization?.id) return
      logger.info('Team upgrade requested', { seats, organizationId: activeOrganization?.id })
      alert(`Team upgrade to ${seats} seats - integration needed`)
    },
    [session?.user?.id, activeOrganization?.id]
  )

  const queryError = orgError || subscriptionError
  const errorMessage = queryError instanceof Error ? queryError.message : null
  const displayOrganization = organization || activeOrganization

  if (isLoading && !displayOrganization && !(hasTeamPlan || hasEnterprisePlan)) {
    return (
      <div className='flex h-full flex-col gap-[16px]'>
        {/* Team Seats Overview */}
        <div>
          <div className='rounded-[8px] border bg-[var(--surface-3)] p-4 shadow-xs'>
            <div className='space-y-[12px]'>
              <div className='flex items-center justify-between'>
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-8 w-20 rounded-[6px]' />
              </div>
              <div className='flex items-center gap-[16px]'>
                <div className='flex flex-col gap-[4px]'>
                  <Skeleton className='h-3 w-16' />
                  <Skeleton className='h-6 w-8' />
                </div>
                <div className='h-8 w-px bg-[var(--border)]' />
                <div className='flex flex-col gap-[4px]'>
                  <Skeleton className='h-3 w-20' />
                  <Skeleton className='h-6 w-8' />
                </div>
                <div className='h-8 w-px bg-[var(--border)]' />
                <div className='flex flex-col gap-[4px]'>
                  <Skeleton className='h-3 w-24' />
                  <Skeleton className='h-6 w-12' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <Skeleton className='mb-[12px] h-5 w-32' />
          <div className='space-y-[8px]'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='flex items-center justify-between rounded-[8px] border p-3'>
                <div className='flex items-center gap-[12px]'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <div className='space-y-[4px]'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </div>
                <Skeleton className='h-6 w-16 rounded-full' />
              </div>
            ))}
          </div>
        </div>

        {/* Invite Member Card */}
        <div>
          <div className='rounded-[8px] border bg-[var(--surface-3)] p-4'>
            <Skeleton className='mb-[12px] h-5 w-32' />
            <div className='space-y-[12px]'>
              <Skeleton className='h-9 w-full rounded-[8px]' />
              <Skeleton className='h-9 w-full rounded-[8px]' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!displayOrganization) {
    return (
      <NoOrganizationView
        hasTeamPlan={hasTeamPlan}
        hasEnterprisePlan={hasEnterprisePlan}
        orgName={orgName}
        setOrgName={setOrgName}
        orgSlug={orgSlug}
        setOrgSlug={setOrgSlug}
        onOrgNameChange={handleOrgNameChange}
        onCreateOrganization={handleCreateOrganization}
        isCreatingOrg={createOrgMutation.isPending}
        error={errorMessage}
        createOrgDialogOpen={createOrgDialogOpen}
        setCreateOrgDialogOpen={setCreateOrgDialogOpen}
      />
    )
  }

  return (
    <div className='flex h-full flex-col gap-[16px]'>
      {/* Seats Overview - Full Width */}
      {adminOrOwner && (
        <div>
          <TeamSeatsOverview
            subscriptionData={subscriptionData || null}
            isLoadingSubscription={isLoadingSubscription}
            totalSeats={totalSeats}
            usedSeats={usedSeats.used}
            isLoading={isLoading}
            onConfirmTeamUpgrade={confirmTeamUpgrade}
            onReduceSeats={handleReduceSeats}
            onAddSeatDialog={handleAddSeatDialog}
          />
        </div>
      )}

      {/* Action: Invite New Members */}
      {adminOrOwner && (
        <div>
          <MemberInvitationCard
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            isInviting={inviteMutation.isPending}
            showWorkspaceInvite={showWorkspaceInvite}
            setShowWorkspaceInvite={setShowWorkspaceInvite}
            selectedWorkspaces={selectedWorkspaces}
            userWorkspaces={adminWorkspaces}
            onInviteMember={handleInviteMember}
            onLoadUserWorkspaces={async () => {}} // No-op: data is auto-loaded by React Query
            onWorkspaceToggle={handleWorkspaceToggle}
            inviteSuccess={inviteSuccess}
            availableSeats={Math.max(0, totalSeats - usedSeats.used)}
            maxSeats={totalSeats}
            invitationError={inviteMutation.error}
            isLoadingWorkspaces={isLoadingWorkspaces}
          />
        </div>
      )}

      {/* Main Content: Team Members */}
      <div>
        <TeamMembers
          organization={displayOrganization}
          currentUserEmail={session?.user?.email ?? ''}
          isAdminOrOwner={adminOrOwner}
          onRemoveMember={handleRemoveMember}
        />
      </div>

      {/* Additional Info - Subtle and collapsed */}
      <div className='space-y-[12px]'>
        {/* Single Organization Notice */}
        {adminOrOwner && (
          <div className='rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-3)] p-3'>
            <p className='text-[var(--text-muted)] text-xs'>
              <span className='font-medium'>Note:</span> Users can only be part of one organization
              at a time.
            </p>
          </div>
        )}

        {/* Team Information */}
        <details className='group rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-3)]'>
          <summary className='flex cursor-pointer items-center justify-between rounded-[8px] p-3 font-medium text-[13px] hover:bg-[var(--surface-4)] group-open:rounded-b-none'>
            <span>Team Information</span>
            <svg
              className='h-4 w-4 transition-transform group-open:rotate-180'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </summary>
          <div className='space-y-[8px] border-[var(--border-muted)] border-t p-3 text-xs'>
            <div className='flex justify-between'>
              <span className='text-[var(--text-muted)]'>Team ID:</span>
              <span className='font-mono text-[10px]'>{displayOrganization.id}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-[var(--text-muted)]'>Created:</span>
              <span>{new Date(displayOrganization.createdAt).toLocaleDateString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-[var(--text-muted)]'>Your Role:</span>
              <span className='font-medium capitalize'>{userRole}</span>
            </div>
          </div>
        </details>

        {/* Team Billing Information (only show for Team Plan, not Enterprise) */}
        {hasTeamPlan && !hasEnterprisePlan && (
          <details className='group rounded-[8px] border border-[var(--border-muted)] bg-[var(--surface-3)]'>
            <summary className='flex cursor-pointer items-center justify-between rounded-[8px] p-3 font-medium text-[13px] hover:bg-[var(--surface-4)] group-open:rounded-b-none'>
              <span>Billing Information</span>
              <svg
                className='h-4 w-4 transition-transform group-open:rotate-180'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </summary>
            <div className='border-[var(--border-muted)] border-t p-3'>
              <ul className='ml-4 list-disc space-y-[8px] text-[var(--text-muted)] text-xs'>
                <li>
                  Your team is billed a minimum of $
                  {(subscriptionData?.seats ?? 0) * DEFAULT_TEAM_TIER_COST_LIMIT}
                  /month for {subscriptionData?.seats ?? 0} licensed seats
                </li>
                <li>All team member usage is pooled together from a shared limit</li>
                <li>
                  When pooled usage exceeds the limit, all members are blocked from using the
                  service
                </li>
                <li>You can increase the usage limit to allow for higher usage</li>
                <li>
                  Any usage beyond the minimum seat cost is billed as overage at the end of the
                  billing period
                </li>
              </ul>
            </div>
          </details>
        )}
      </div>

      <RemoveMemberDialog
        open={removeMemberDialog.open}
        memberName={removeMemberDialog.memberName}
        shouldReduceSeats={removeMemberDialog.shouldReduceSeats}
        isSelfRemoval={removeMemberDialog.isSelfRemoval}
        error={removeMemberMutation.error}
        onOpenChange={(open: boolean) => {
          if (!open) setRemoveMemberDialog({ ...removeMemberDialog, open: false })
        }}
        onShouldReduceSeatsChange={(shouldReduce: boolean) =>
          setRemoveMemberDialog({
            ...removeMemberDialog,
            shouldReduceSeats: shouldReduce,
          })
        }
        onConfirmRemove={confirmRemoveMember}
        onCancel={() =>
          setRemoveMemberDialog({
            open: false,
            memberId: '',
            memberName: '',
            shouldReduceSeats: false,
            isSelfRemoval: false,
          })
        }
      />

      {subscriptionData && !checkEnterprisePlan(subscriptionData) && (
        <TeamSeats
          open={isAddSeatDialogOpen}
          onOpenChange={setIsAddSeatDialogOpen}
          title='Add Team Seats'
          description={`Each seat costs $${DEFAULT_TEAM_TIER_COST_LIMIT}/month and provides $${DEFAULT_TEAM_TIER_COST_LIMIT} in monthly inference credits. Adjust the number of licensed seats for your team.`}
          currentSeats={totalSeats}
          initialSeats={newSeatCount}
          isLoading={isUpdatingSeats}
          error={updateSeatsMutation.error}
          onConfirm={async (selectedSeats: number) => {
            setNewSeatCount(selectedSeats)
            await confirmAddSeats(selectedSeats)
          }}
          confirmButtonText='Update Seats'
          showCostBreakdown={true}
          isCancelledAtPeriodEnd={subscriptionData?.cancelAtPeriodEnd}
        />
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/index.ts

```typescript
export { MemberInvitationCard } from './member-invitation-card/member-invitation-card'
export { NoOrganizationView } from './no-organization-view/no-organization-view'
export { RemoveMemberDialog } from './remove-member-dialog/remove-member-dialog'
export { TeamMembers } from './team-members/team-members'
export { TeamSeats } from './team-seats/team-seats'
export { TeamSeatsOverview } from './team-seats-overview/team-seats-overview'
export { TeamUsage } from './team-usage/team-usage'
```

--------------------------------------------------------------------------------

````
