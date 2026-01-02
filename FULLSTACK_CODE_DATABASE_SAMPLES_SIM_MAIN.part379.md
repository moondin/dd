---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 379
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 379 of 933)

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

---[FILE: member-invitation-card.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/member-invitation-card/member-invitation-card.tsx
Signals: React

```typescript
import React, { useMemo, useState } from 'react'
import { CheckCircle, ChevronDown } from 'lucide-react'
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverItem,
  PopoverTrigger,
} from '@/components/emcn'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/core/utils/cn'
import { quickValidateEmail } from '@/lib/messaging/email/validation'

type PermissionType = 'read' | 'write' | 'admin'

interface PermissionSelectorProps {
  value: PermissionType
  onChange: (value: PermissionType) => void
  disabled?: boolean
  className?: string
}

const PermissionSelector = React.memo<PermissionSelectorProps>(
  ({ value, onChange, disabled = false, className = '' }) => {
    const permissionOptions = useMemo(
      () => [
        { value: 'read' as PermissionType, label: 'Read', description: 'View only' },
        { value: 'write' as PermissionType, label: 'Write', description: 'Edit content' },
        { value: 'admin' as PermissionType, label: 'Admin', description: 'Full access' },
      ],
      []
    )

    return (
      <div className={cn('inline-flex gap-[2px]', className)}>
        {permissionOptions.map((option) => (
          <Button
            key={option.value}
            type='button'
            variant={value === option.value ? 'active' : 'ghost'}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            title={option.description}
            className='h-[22px] min-w-[38px] px-[6px] py-0 text-[11px]'
          >
            {option.label}
          </Button>
        ))}
      </div>
    )
  }
)

PermissionSelector.displayName = 'PermissionSelector'

interface MemberInvitationCardProps {
  inviteEmail: string
  setInviteEmail: (email: string) => void
  isInviting: boolean
  showWorkspaceInvite: boolean
  setShowWorkspaceInvite: (show: boolean) => void
  selectedWorkspaces: Array<{ workspaceId: string; permission: string }>
  userWorkspaces: any[]
  onInviteMember: () => Promise<void>
  onLoadUserWorkspaces: () => Promise<void>
  onWorkspaceToggle: (workspaceId: string, permission: string) => void
  inviteSuccess: boolean
  availableSeats?: number
  maxSeats?: number
  invitationError?: Error | null
  isLoadingWorkspaces?: boolean
}

export function MemberInvitationCard({
  inviteEmail,
  setInviteEmail,
  isInviting,
  showWorkspaceInvite,
  setShowWorkspaceInvite,
  selectedWorkspaces,
  userWorkspaces,
  onInviteMember,
  onLoadUserWorkspaces,
  onWorkspaceToggle,
  inviteSuccess,
  availableSeats = 0,
  maxSeats = 0,
  invitationError = null,
  isLoadingWorkspaces = false,
}: MemberInvitationCardProps) {
  const selectedCount = selectedWorkspaces.length
  const hasAvailableSeats = availableSeats > 0
  const [emailError, setEmailError] = useState<string>('')

  const validateEmailInput = (email: string) => {
    if (!email.trim()) {
      setEmailError('')
      return
    }

    const validation = quickValidateEmail(email.trim())
    if (!validation.isValid) {
      setEmailError(validation.reason || 'Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInviteEmail(value)
    if (emailError) {
      setEmailError('')
    }
  }

  const handleInviteClick = () => {
    if (inviteEmail.trim()) {
      validateEmailInput(inviteEmail)
      const validation = quickValidateEmail(inviteEmail.trim())
      if (!validation.isValid) {
        return // Don't proceed if validation fails
      }
    }

    onInviteMember()
  }

  return (
    <div className='rounded-lg border border-[var(--border-muted)] bg-[var(--surface-3)] p-4'>
      <div className='space-y-3'>
        {/* Header */}
        <div>
          <h4 className='font-medium text-[13px]'>Invite Team Members</h4>
          <p className='text-[var(--text-muted)] text-xs'>
            Add new members to your team and optionally give them access to specific workspaces
          </p>
        </div>

        {/* Main invitation input */}
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <Input
              placeholder='Enter email address'
              value={inviteEmail}
              onChange={handleEmailChange}
              disabled={isInviting || !hasAvailableSeats}
              className={cn(emailError && 'border-red-500 focus-visible:ring-red-500')}
            />
            {emailError && (
              <p className='mt-1 text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
                {emailError}
              </p>
            )}
          </div>
          <Popover
            open={showWorkspaceInvite}
            onOpenChange={(open) => {
              setShowWorkspaceInvite(open)
              if (open) {
                onLoadUserWorkspaces()
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant='ghost'
                disabled={isInviting || !hasAvailableSeats}
                className='min-w-[110px]'
              >
                <span className='flex-1 text-left'>
                  Workspaces
                  {selectedCount > 0 && ` (${selectedCount})`}
                </span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform',
                    showWorkspaceInvite && 'rotate-180'
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side='bottom'
              align='end'
              maxHeight={320}
              sideOffset={4}
              className='w-[240px] border border-[var(--border-muted)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              style={{ minWidth: '240px', maxWidth: '240px' }}
            >
              {isLoadingWorkspaces ? (
                <div className='px-[6px] py-[16px] text-center'>
                  <p className='text-[12px] text-[var(--text-tertiary)]'>Loading...</p>
                </div>
              ) : userWorkspaces.length === 0 ? (
                <div className='px-[6px] py-[16px] text-center'>
                  <p className='text-[12px] text-[var(--text-tertiary)]'>No workspaces available</p>
                </div>
              ) : (
                <div className='flex flex-col gap-[2px]'>
                  {userWorkspaces.map((workspace) => {
                    const isSelected = selectedWorkspaces.some(
                      (w) => w.workspaceId === workspace.id
                    )
                    const selectedWorkspace = selectedWorkspaces.find(
                      (w) => w.workspaceId === workspace.id
                    )

                    return (
                      <div key={workspace.id} className='flex flex-col gap-[4px]'>
                        <PopoverItem
                          onClick={() => {
                            if (isSelected) {
                              onWorkspaceToggle(workspace.id, '')
                            } else {
                              onWorkspaceToggle(workspace.id, 'read')
                            }
                          }}
                          active={isSelected}
                          disabled={isInviting}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isInviting}
                            className='pointer-events-none'
                          />
                          <span className='flex-1 truncate'>{workspace.name}</span>
                        </PopoverItem>
                        {isSelected && (
                          <div className='ml-[31px] flex items-center gap-[6px] pb-[4px]'>
                            <span className='text-[11px] text-[var(--text-tertiary)]'>Access:</span>
                            <PermissionSelector
                              value={
                                (['read', 'write', 'admin'].includes(
                                  selectedWorkspace?.permission ?? ''
                                )
                                  ? selectedWorkspace?.permission
                                  : 'read') as PermissionType
                              }
                              onChange={(permission) => onWorkspaceToggle(workspace.id, permission)}
                              disabled={isInviting}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </PopoverContent>
          </Popover>
          <Button
            variant='secondary'
            onClick={handleInviteClick}
            disabled={!inviteEmail || isInviting || !hasAvailableSeats}
          >
            {isInviting ? 'Inviting...' : hasAvailableSeats ? 'Invite' : 'No Seats'}
          </Button>
        </div>

        {/* Invitation error - inline */}
        {invitationError && (
          <p className='text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
            {invitationError instanceof Error && invitationError.message
              ? invitationError.message
              : String(invitationError)}
          </p>
        )}

        {/* Success message */}
        {inviteSuccess && (
          <div className='flex items-start gap-2 rounded-md bg-green-500/10 p-2.5 text-green-600 dark:text-green-400'>
            <CheckCircle className='h-4 w-4 flex-shrink-0' />
            <p className='text-xs'>
              Invitation sent successfully
              {selectedCount > 0 &&
                ` with access to ${selectedCount} workspace${selectedCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: no-organization-view.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/no-organization-view/no-organization-view.tsx

```typescript
import { RefreshCw } from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/emcn'

interface NoOrganizationViewProps {
  hasTeamPlan: boolean
  hasEnterprisePlan: boolean
  orgName: string
  setOrgName: (name: string) => void
  orgSlug: string
  setOrgSlug: (slug: string) => void
  onOrgNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCreateOrganization: () => Promise<void>
  isCreatingOrg: boolean
  error: string | null
  createOrgDialogOpen: boolean
  setCreateOrgDialogOpen: (open: boolean) => void
}

export function NoOrganizationView({
  hasTeamPlan,
  hasEnterprisePlan,
  orgName,
  setOrgName,
  orgSlug,
  setOrgSlug,
  onOrgNameChange,
  onCreateOrganization,
  isCreatingOrg,
  error,
  createOrgDialogOpen,
  setCreateOrgDialogOpen,
}: NoOrganizationViewProps) {
  if (hasTeamPlan || hasEnterprisePlan) {
    return (
      <div>
        <div className='flex flex-col gap-6'>
          {/* Header - matching settings page style */}
          <div>
            <h4 className='font-medium text-[13px]'>Create Your Team Workspace</h4>
            <p className='mt-1 text-[var(--text-muted)] text-xs'>
              You're subscribed to a {hasEnterprisePlan ? 'enterprise' : 'team'} plan. Create your
              workspace to start collaborating with your team.
            </p>
          </div>

          {/* Form fields - clean layout without card */}
          <div className='space-y-4'>
            <div>
              <Label htmlFor='orgName' className='font-medium text-[13px]'>
                Team Name
              </Label>
              <Input
                id='orgName'
                value={orgName}
                onChange={onOrgNameChange}
                placeholder='My Team'
                className='mt-1'
              />
            </div>

            <div>
              <Label htmlFor='orgSlug' className='font-medium text-[13px]'>
                Team URL
              </Label>
              <div className='mt-1 flex items-center'>
                <div className='rounded-l-[8px] border border-r-0 bg-[var(--surface-3)] px-3 py-2 text-[var(--text-muted)] text-sm'>
                  sim.ai/team/
                </div>
                <Input
                  id='orgSlug'
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  placeholder='my-team'
                  className='rounded-l-none'
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              {error && (
                <p className='text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
                  {error}
                </p>
              )}
              <div className='flex justify-end'>
                <Button
                  onClick={onCreateOrganization}
                  disabled={!orgName || !orgSlug || isCreatingOrg}
                  className='h-[32px] px-[12px]'
                >
                  {isCreatingOrg && <RefreshCw className='mr-2 h-4 w-4 animate-spin' />}
                  Create Team Workspace
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Modal open={createOrgDialogOpen} onOpenChange={setCreateOrgDialogOpen}>
          <ModalContent className='sm:max-w-md'>
            <ModalHeader>
              <ModalTitle>Create Team Organization</ModalTitle>
              <ModalDescription>
                Create a new team organization to manage members and billing.
              </ModalDescription>
            </ModalHeader>

            <div className='space-y-4'>
              <div>
                <Label htmlFor='org-name' className='font-medium text-[13px]'>
                  Organization Name
                </Label>
                <Input
                  id='org-name'
                  placeholder='Enter organization name'
                  value={orgName}
                  onChange={onOrgNameChange}
                  disabled={isCreatingOrg}
                  className='mt-1'
                />
              </div>

              <div>
                <Label htmlFor='org-slug' className='font-medium text-[13px]'>
                  Organization Slug
                </Label>
                <Input
                  id='org-slug'
                  placeholder='organization-slug'
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                  disabled={isCreatingOrg}
                  className='mt-1'
                />
              </div>
            </div>

            {error && (
              <p className='text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
                {error}
              </p>
            )}

            <ModalFooter>
              <Button
                variant='outline'
                onClick={() => setCreateOrgDialogOpen(false)}
                disabled={isCreatingOrg}
                className='h-[32px] px-[12px]'
              >
                Cancel
              </Button>
              <Button
                onClick={onCreateOrganization}
                disabled={isCreatingOrg || !orgName.trim()}
                className='h-[32px] px-[12px]'
              >
                {isCreatingOrg && <RefreshCw className='mr-2 h-4 w-4 animate-spin' />}
                Create Organization
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
  }

  return (
    <div className='space-y-4 p-6'>
      <div className='space-y-6'>
        <h3 className='font-medium text-[13px]'>No Team Workspace</h3>
        <p className='text-[var(--text-muted)] text-sm'>
          You don't have a team workspace yet. To collaborate with others, first upgrade to a team
          or enterprise plan.
        </p>

        <Button
          onClick={() => {
            const event = new CustomEvent('open-settings', {
              detail: { tab: 'subscription' },
            })
            window.dispatchEvent(event)
          }}
          className='h-[32px] px-[12px]'
        >
          Upgrade to Team Plan
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: remove-member-dialog.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/remove-member-dialog/remove-member-dialog.tsx

```typescript
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/emcn'

interface RemoveMemberDialogProps {
  open: boolean
  memberName: string
  shouldReduceSeats: boolean
  isSelfRemoval?: boolean
  error?: Error | null
  onOpenChange: (open: boolean) => void
  onShouldReduceSeatsChange: (shouldReduce: boolean) => void
  onConfirmRemove: (shouldReduceSeats: boolean) => Promise<void>
  onCancel: () => void
}

export function RemoveMemberDialog({
  open,
  memberName,
  shouldReduceSeats,
  error,
  onOpenChange,
  onShouldReduceSeatsChange,
  onConfirmRemove,
  onCancel,
  isSelfRemoval = false,
}: RemoveMemberDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className='w-[400px]'>
        <ModalHeader>{isSelfRemoval ? 'Leave Organization' : 'Remove Team Member'}</ModalHeader>
        <ModalBody>
          <p className='text-[12px] text-[var(--text-tertiary)]'>
            {isSelfRemoval
              ? 'Are you sure you want to leave this organization? You will lose access to all team resources.'
              : `Are you sure you want to remove ${memberName} from the team?`}{' '}
            <span className='text-[var(--text-error)]'>This action cannot be undone.</span>
          </p>

          {!isSelfRemoval && (
            <div className='mt-4'>
              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='reduce-seats'
                  className='rounded-[4px]'
                  checked={shouldReduceSeats}
                  onChange={(e) => onShouldReduceSeatsChange(e.target.checked)}
                />
                <label htmlFor='reduce-seats' className='text-xs'>
                  Also reduce seat count in my subscription
                </label>
              </div>
              <p className='mt-1 text-[var(--text-muted)] text-xs'>
                If selected, your team seat count will be reduced by 1, lowering your monthly
                billing.
              </p>
            </div>
          )}

          {error && (
            <div className='mt-2'>
              <p className='text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
                {error instanceof Error && error.message ? error.message : String(error)}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant='active' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={() => onConfirmRemove(shouldReduceSeats)}
            className='!bg-[var(--text-error)] !text-white hover:!bg-[var(--text-error)]/90'
          >
            {isSelfRemoval ? 'Leave Organization' : 'Remove'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: team-members.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/team-members/team-members.tsx
Signals: React

```typescript
import { useState } from 'react'
import { Button } from '@/components/emcn'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { createLogger } from '@/lib/logs/console/logger'
import type { Invitation, Member, Organization } from '@/lib/workspaces/organization'
import { useCancelInvitation, useOrganizationMembers } from '@/hooks/queries/organization'

const logger = createLogger('TeamMembers')

interface TeamMembersProps {
  organization: Organization
  currentUserEmail: string
  isAdminOrOwner: boolean
  onRemoveMember: (member: Member) => void
}

interface BaseItem {
  id: string
  name: string
  email: string
  avatarInitial: string
  avatarUrl?: string | null
  userId?: string
  usage: string
}

interface MemberItem extends BaseItem {
  type: 'member'
  role: string
  member: Member
}

interface InvitationItem extends BaseItem {
  type: 'invitation'
  invitation: Invitation
}

type TeamMemberItem = MemberItem | InvitationItem

export function TeamMembers({
  organization,
  currentUserEmail,
  isAdminOrOwner,
  onRemoveMember,
}: TeamMembersProps) {
  // Fetch member usage data using React Query
  const { data: memberUsageResponse, isLoading: isLoadingUsage } = useOrganizationMembers(
    organization?.id || ''
  )

  const cancelInvitationMutation = useCancelInvitation()

  // Build usage data map from response
  const memberUsageData: Record<string, number> = {}
  if (memberUsageResponse?.data) {
    memberUsageResponse.data.forEach((member: any) => {
      if (member.currentPeriodCost !== null && member.currentPeriodCost !== undefined) {
        memberUsageData[member.userId] = Number.parseFloat(member.currentPeriodCost.toString())
      }
    })
  }

  // Combine members and pending invitations into a single list
  const teamItems: TeamMemberItem[] = []

  // Add existing members
  if (organization.members) {
    organization.members.forEach((member: Member) => {
      const userId = member.user?.id
      const usageAmount = userId ? (memberUsageData[userId] ?? 0) : 0
      const name = member.user?.name || 'Unknown'

      const memberItem: MemberItem = {
        type: 'member',
        id: member.id,
        name,
        email: member.user?.email || '',
        avatarInitial: name.charAt(0).toUpperCase(),
        avatarUrl: member.user?.image,
        userId: member.user?.id,
        usage: `$${usageAmount.toFixed(2)}`,
        role: member.role,
        member,
      }

      teamItems.push(memberItem)
    })
  }

  // Add pending invitations
  const pendingInvitations = organization.invitations?.filter(
    (invitation) => invitation.status === 'pending'
  )
  if (pendingInvitations) {
    pendingInvitations.forEach((invitation: Invitation) => {
      const emailPrefix = invitation.email.split('@')[0]

      const invitationItem: InvitationItem = {
        type: 'invitation',
        id: invitation.id,
        name: emailPrefix,
        email: invitation.email,
        avatarInitial: emailPrefix.charAt(0).toUpperCase(),
        avatarUrl: null,
        userId: invitation.email, // Use email as fallback for color generation
        usage: '-',
        invitation,
      }

      teamItems.push(invitationItem)
    })
  }

  if (teamItems.length === 0) {
    return <div className='text-center text-[var(--text-muted)] text-sm'>No team members yet.</div>
  }

  // Check if current user can leave (is a member but not owner)
  const currentUserMember = organization.members?.find((m) => m.user?.email === currentUserEmail)
  const canLeaveOrganization =
    currentUserMember && currentUserMember.role !== 'owner' && currentUserMember.user?.id

  // Track which invitations are being cancelled for individual loading states
  const [cancellingInvitations, setCancellingInvitations] = useState<Set<string>>(new Set())

  const handleCancelInvitation = async (invitationId: string) => {
    if (!organization?.id) return

    setCancellingInvitations((prev) => new Set([...prev, invitationId]))
    try {
      await cancelInvitationMutation.mutateAsync({
        invitationId,
        orgId: organization.id,
      })
    } catch (error) {
      logger.error('Failed to cancel invitation', { error })
    } finally {
      setCancellingInvitations((prev) => {
        const next = new Set(prev)
        next.delete(invitationId)
        return next
      })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Header - simple like account page */}
      <div>
        <h4 className='font-medium text-[13px]'>Team Members</h4>
      </div>

      {/* Members list - clean like account page */}
      <div className='space-y-4'>
        {teamItems.map((item) => (
          <div key={item.id} className='flex items-center justify-between'>
            {/* Member info */}
            <div className='flex flex-1 items-center gap-3'>
              {/* Avatar */}
              <UserAvatar
                userId={item.userId || item.email}
                userName={item.name}
                avatarUrl={item.avatarUrl}
                size={32}
              />

              {/* Name and email */}
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='truncate font-medium text-sm'>{item.name}</span>
                  {item.type === 'member' && (
                    <span
                      className={`inline-flex h-[1.125rem] items-center rounded-[6px] px-2 py-0 font-medium text-xs ${
                        item.role === 'owner'
                          ? 'gradient-text border-gradient-primary/20 bg-gradient-to-b from-gradient-primary via-gradient-secondary to-gradient-primary'
                          : 'bg-[var(--surface-3)] text-[var(--text-muted)]'
                      } `}
                    >
                      {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                    </span>
                  )}
                  {item.type === 'invitation' && (
                    <span className='inline-flex h-[1.125rem] items-center rounded-[6px] bg-[var(--surface-3)] px-2 py-0 font-medium text-[var(--text-muted)] text-xs'>
                      Pending
                    </span>
                  )}
                </div>
                <div className='truncate text-[var(--text-muted)] text-xs'>{item.email}</div>
              </div>

              {/* Usage stats - matching subscription layout */}
              {isAdminOrOwner && (
                <div className='hidden items-center text-xs tabular-nums sm:flex'>
                  <div className='text-center'>
                    <div className='text-[var(--text-muted)]'>Usage</div>
                    <div className='font-medium'>
                      {isLoadingUsage && item.type === 'member' ? (
                        <span className='inline-block h-3 w-12 animate-pulse rounded bg-[var(--surface-3)]' />
                      ) : (
                        item.usage
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='ml-4 flex gap-1'>
              {/* Admin/Owner can remove other members */}
              {isAdminOrOwner &&
                item.type === 'member' &&
                item.role !== 'owner' &&
                item.email !== currentUserEmail && (
                  <Button
                    variant='ghost'
                    onClick={() => onRemoveMember(item.member)}
                    className='h-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  >
                    Remove
                  </Button>
                )}

              {/* Admin can cancel invitations */}
              {isAdminOrOwner && item.type === 'invitation' && (
                <Button
                  variant='ghost'
                  onClick={() => handleCancelInvitation(item.invitation.id)}
                  disabled={cancellingInvitations.has(item.invitation.id)}
                  className='h-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                >
                  {cancellingInvitations.has(item.invitation.id) ? 'Cancelling...' : 'Cancel'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Leave Organization button */}
      {canLeaveOrganization && (
        <div className='mt-4 border-[var(--border-muted)] border-t pt-4'>
          <Button
            variant='default'
            onClick={() => {
              if (!currentUserMember?.user?.id) {
                logger.error('Cannot leave organization: missing user ID', { currentUserMember })
                return
              }
              onRemoveMember(currentUserMember)
            }}
          >
            Leave Organization
          </Button>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: team-seats.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/team-seats/team-seats.tsx
Signals: React

```typescript
import { useEffect, useState } from 'react'
import {
  Button,
  Combobox,
  type ComboboxOption,
  Label,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tooltip,
} from '@/components/emcn'
import { DEFAULT_TEAM_TIER_COST_LIMIT } from '@/lib/billing/constants'

interface TeamSeatsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  currentSeats?: number
  initialSeats?: number
  isLoading: boolean
  error?: Error | null
  onConfirm: (seats: number) => Promise<void>
  confirmButtonText: string
  showCostBreakdown?: boolean
  isCancelledAtPeriodEnd?: boolean
}

export function TeamSeats({
  open,
  onOpenChange,
  title,
  description,
  currentSeats,
  initialSeats = 1,
  isLoading,
  error,
  onConfirm,
  confirmButtonText,
  showCostBreakdown = false,
  isCancelledAtPeriodEnd = false,
}: TeamSeatsProps) {
  const [selectedSeats, setSelectedSeats] = useState(initialSeats)

  useEffect(() => {
    if (open) {
      setSelectedSeats(initialSeats)
    }
  }, [open, initialSeats])

  const costPerSeat = DEFAULT_TEAM_TIER_COST_LIMIT
  const totalMonthlyCost = selectedSeats * costPerSeat
  const costChange = currentSeats ? (selectedSeats - currentSeats) * costPerSeat : 0

  const handleConfirm = async () => {
    await onConfirm(selectedSeats)
  }

  const seatOptions: ComboboxOption[] = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50].map((num) => ({
    value: num.toString(),
    label: `${num} ${num === 1 ? 'seat' : 'seats'} ($${num * costPerSeat}/month)`,
  }))

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>

        <div className='py-4'>
          <Label htmlFor='seats'>Number of seats</Label>
          <Combobox
            options={seatOptions}
            value={selectedSeats.toString()}
            onChange={(value) => setSelectedSeats(Number.parseInt(value))}
            placeholder='Select number of seats'
          />

          <p className='mt-2 text-[var(--text-muted)] text-sm'>
            Your team will have {selectedSeats} {selectedSeats === 1 ? 'seat' : 'seats'} with a
            total of ${totalMonthlyCost} inference credits per month.
          </p>

          {showCostBreakdown && currentSeats !== undefined && (
            <div className='mt-3 rounded-[8px] bg-[var(--surface-3)] p-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-[var(--text-muted)]'>Current seats:</span>
                <span>{currentSeats}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-[var(--text-muted)]'>New seats:</span>
                <span>{selectedSeats}</span>
              </div>
              <div className='mt-2 flex justify-between border-t pt-2 font-medium text-sm'>
                <span className='text-[var(--text-muted)]'>Monthly cost change:</span>
                <span>
                  {costChange > 0 ? '+' : ''}${costChange}
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className='mt-3 text-[#DC2626] text-[11px] leading-tight dark:text-[#F87171]'>
              {error instanceof Error && error.message ? error.message : String(error)}
            </p>
          )}
        </div>

        <ModalFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className='h-[32px] px-[12px]'
          >
            Cancel
          </Button>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span>
                <Button
                  variant='primary'
                  onClick={handleConfirm}
                  disabled={
                    isLoading ||
                    (showCostBreakdown && selectedSeats === currentSeats) ||
                    isCancelledAtPeriodEnd
                  }
                  className='h-[32px] px-[12px]'
                >
                  {isLoading ? (
                    <div className='flex items-center space-x-2'>
                      <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent' />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>{confirmButtonText}</span>
                  )}
                </Button>
              </span>
            </Tooltip.Trigger>
            {isCancelledAtPeriodEnd && (
              <Tooltip.Content>
                <p>
                  To update seats, go to Subscription {'>'} Manage {'>'} Keep Subscription to
                  reactivate
                </p>
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: team-seats-overview.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/components/sidebar/components/settings-modal/components/team-management/components/team-seats-overview/team-seats-overview.tsx

```typescript
import { Badge, Button } from '@/components/emcn'
import { Skeleton } from '@/components/ui/skeleton'
import { checkEnterprisePlan } from '@/lib/billing/subscriptions/utils'
import { cn } from '@/lib/core/utils/cn'

type Subscription = {
  id: string
  plan: string
  status: string
  referenceId: string
  cancelAtPeriodEnd?: boolean
  periodEnd?: number | Date
  trialEnd?: number | Date
}

interface TeamSeatsOverviewProps {
  subscriptionData: Subscription | null
  isLoadingSubscription: boolean
  totalSeats: number
  usedSeats: number
  isLoading: boolean
  onConfirmTeamUpgrade: (seats: number) => Promise<void>
  onReduceSeats: () => Promise<void>
  onAddSeatDialog: () => void
}

function TeamSeatsSkeleton() {
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
        <div className='flex gap-2 pt-1'>
          <Skeleton className='h-8 flex-1 rounded-[8px]' />
          <Skeleton className='h-8 flex-1 rounded-[8px]' />
        </div>
      </div>
    </div>
  )
}

export function TeamSeatsOverview({
  subscriptionData,
  isLoadingSubscription,
  totalSeats,
  usedSeats,
  isLoading,
  onConfirmTeamUpgrade,
  onReduceSeats,
  onAddSeatDialog,
}: TeamSeatsOverviewProps) {
  if (isLoadingSubscription) {
    return <TeamSeatsSkeleton />
  }

  if (!subscriptionData) {
    return (
      <div className='rounded-[8px] border bg-[var(--surface-3)] p-3 shadow-xs'>
        <div className='space-y-3 text-center'>
          <div className='space-y-2'>
            <p className='font-medium text-sm'>No Team Subscription Found</p>
            <p className='text-[var(--text-muted)] text-xs'>
              Your subscription may need to be transferred to this organization.
            </p>
          </div>
          <Button
            variant='primary'
            onClick={() => {
              onConfirmTeamUpgrade(2)
            }}
            disabled={isLoading}
          >
            Set Up Team Subscription
          </Button>
        </div>
      </div>
    )
  }

  const isEnterprise = checkEnterprisePlan(subscriptionData)

  return (
    <div className='rounded-[8px] border bg-[var(--surface-3)] p-3 shadow-xs'>
      <div className='space-y-2'>
        {/* Top row - matching UsageHeader */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='font-medium text-[12px] text-[var(--text-primary)]'>Seats</span>
            {!isEnterprise && (
              <Badge
                className='gradient-text h-[1.125rem] cursor-pointer rounded-[6px] border-gradient-primary/20 bg-gradient-to-b from-gradient-primary via-gradient-secondary to-gradient-primary px-2 py-0 font-medium text-xs'
                onClick={onAddSeatDialog}
              >
                Add Seats
              </Badge>
            )}
          </div>
          <div className='flex items-center gap-[4px] text-xs tabular-nums'>
            <span className='font-medium text-[12px] text-[var(--text-secondary)] tabular-nums'>
              {usedSeats} used
            </span>
            <span className='font-medium text-[12px] text-[var(--text-secondary)]'>/</span>
            <span className='font-medium text-[12px] text-[var(--text-secondary)] tabular-nums'>
              {totalSeats} total
            </span>
          </div>
        </div>

        {/* Pills row - one pill per seat */}
        <div className='flex items-center gap-[4px]'>
          {Array.from({ length: totalSeats }).map((_, i) => {
            const isFilled = i < usedSeats
            return (
              <div
                key={i}
                className={cn(
                  'h-[6px] flex-1 rounded-full transition-colors',
                  isFilled ? 'bg-[#34B5FF]' : 'bg-[var(--border)]'
                )}
              />
            )
          })}
        </div>

        {/* Enterprise message */}
        {isEnterprise && (
          <div className='pt-1 text-center'>
            <p className='text-[var(--text-muted)] text-xs'>
              Contact support for enterprise usage limit changes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
