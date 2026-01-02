---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 342
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 342 of 933)

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

---[FILE: status-card.tsx]---
Location: sim-main/apps/sim/app/invite/components/status-card.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  RotateCcw,
  ShieldX,
  UserPlus,
  Users2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBrandConfig } from '@/lib/branding/branding'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'

interface InviteStatusCardProps {
  type: 'login' | 'loading' | 'error' | 'success' | 'invitation' | 'warning'
  title: string
  description: string | React.ReactNode
  icon?: 'userPlus' | 'mail' | 'users' | 'error' | 'success' | 'warning'
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
    disabled?: boolean
    loading?: boolean
  }>
  isExpiredError?: boolean
}

const iconMap = {
  userPlus: UserPlus,
  mail: Mail,
  users: Users2,
  error: ShieldX,
  success: CheckCircle2,
  warning: AlertCircle,
}

const iconColorMap = {
  userPlus: 'text-[var(--brand-primary-hex)]',
  mail: 'text-[var(--brand-primary-hex)]',
  users: 'text-[var(--brand-primary-hex)]',
  error: 'text-red-500 dark:text-red-400',
  success: 'text-green-500 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-500',
}

const iconBgMap = {
  userPlus: 'bg-[var(--brand-primary-hex)]/10',
  mail: 'bg-[var(--brand-primary-hex)]/10',
  users: 'bg-[var(--brand-primary-hex)]/10',
  error: 'bg-red-50 dark:bg-red-950/20',
  success: 'bg-green-50 dark:bg-green-950/20',
  warning: 'bg-yellow-50 dark:bg-yellow-950/20',
}

export function InviteStatusCard({
  type,
  title,
  description,
  icon,
  actions = [],
  isExpiredError = false,
}: InviteStatusCardProps) {
  const router = useRouter()
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const brandConfig = useBrandConfig()

  useEffect(() => {
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()
      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }
    checkCustomBrand()
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  if (type === 'loading') {
    return (
      <div className={`${soehne.className} space-y-6`}>
        <div className='space-y-1 text-center'>
          <h1 className='font-medium text-[32px] text-black tracking-tight'>Loading</h1>
          <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
            {description}
          </p>
        </div>
        <div className='flex w-full items-center justify-center py-8'>
          <Loader2 className='h-8 w-8 animate-spin text-[var(--brand-primary-hex)]' />
        </div>

        <div
          className={`${inter.className} auth-text-muted fixed right-0 bottom-0 left-0 z-50 pb-8 text-center font-[340] text-[13px] leading-relaxed`}
        >
          Need help?{' '}
          <a
            href='mailto:help@sim.ai'
            className='auth-link underline-offset-4 transition hover:underline'
          >
            Contact support
          </a>
        </div>
      </div>
    )
  }

  const IconComponent = icon ? iconMap[icon] : null
  const iconColor = icon ? iconColorMap[icon] : ''
  const iconBg = icon ? iconBgMap[icon] : ''

  return (
    <div className={`${soehne.className} space-y-6`}>
      <div className='space-y-1 text-center'>
        <h1 className='font-medium text-[32px] text-black tracking-tight'>{title}</h1>
        <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
          {description}
        </p>
      </div>

      <div className={`${inter.className} mt-8 space-y-8`}>
        <div className='flex w-full flex-col gap-3'>
          {isExpiredError && (
            <Button
              variant='outline'
              className='w-full rounded-[10px] border-[var(--brand-primary-hex)] font-medium text-[15px] text-[var(--brand-primary-hex)] transition-colors duration-200 hover:bg-[var(--brand-primary-hex)] hover:text-white'
              onClick={() => router.push('/')}
            >
              <RotateCcw className='mr-2 h-4 w-4' />
              Request New Invitation
            </Button>
          )}

          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              className={
                (action.variant || 'default') === 'default'
                  ? `${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`
                  : action.variant === 'outline'
                    ? 'w-full rounded-[10px] border-[var(--brand-primary-hex)] font-medium text-[15px] text-[var(--brand-primary-hex)] transition-colors duration-200 hover:bg-[var(--brand-primary-hex)] hover:text-white'
                    : 'w-full rounded-[10px] text-muted-foreground hover:bg-secondary hover:text-foreground'
              }
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
            >
              {action.loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {action.label}...
                </>
              ) : (
                action.label
              )}
            </Button>
          ))}
        </div>
      </div>

      <div
        className={`${inter.className} auth-text-muted fixed right-0 bottom-0 left-0 z-50 pb-8 text-center font-[340] text-[13px] leading-relaxed`}
      >
        Need help?{' '}
        <a
          href={`mailto:${brandConfig.supportEmail}`}
          className='auth-link underline-offset-4 transition hover:underline'
        >
          Contact support
        </a>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: invite.tsx]---
Location: sim-main/apps/sim/app/invite/[id]/invite.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { client, useSession } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'
import { InviteLayout, InviteStatusCard } from '@/app/invite/components'

const logger = createLogger('InviteById')

function getErrorMessage(reason: string): string {
  switch (reason) {
    case 'missing-token':
      return 'The invitation link is invalid or missing a required parameter.'
    case 'invalid-token':
      return 'The invitation link is invalid or has already been used.'
    case 'expired':
      return 'This invitation has expired. Please ask for a new invitation.'
    case 'already-processed':
      return 'This invitation has already been accepted or declined.'
    case 'email-mismatch':
      return 'This invitation was sent to a different email address. Please log in with the correct account.'
    case 'workspace-not-found':
      return 'The workspace associated with this invitation could not be found.'
    case 'user-not-found':
      return 'Your user account could not be found. Please try logging out and logging back in.'
    case 'already-member':
      return 'You are already a member of this organization or workspace.'
    case 'already-in-organization':
      return 'You are already a member of an organization. Leave your current organization before accepting a new invitation.'
    case 'invalid-invitation':
      return 'This invitation is invalid or no longer exists.'
    case 'missing-invitation-id':
      return 'The invitation link is missing required information. Please use the original invitation link.'
    case 'server-error':
      return 'An unexpected error occurred while processing your invitation. Please try again later.'
    default:
      return 'An unknown error occurred while processing your invitation.'
  }
}

export default function Invite() {
  const router = useRouter()
  const params = useParams()
  const inviteId = params.id as string
  const searchParams = useSearchParams()
  const { data: session, isPending } = useSession()
  const [invitationDetails, setInvitationDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [invitationType, setInvitationType] = useState<'organization' | 'workspace'>('workspace')
  const [currentOrgName, setCurrentOrgName] = useState<string | null>(null)

  useEffect(() => {
    const errorReason = searchParams.get('error')

    if (errorReason) {
      setError(getErrorMessage(errorReason))
      setIsLoading(false)
      return
    }

    const isNew = searchParams.get('new') === 'true'
    setIsNewUser(isNew)

    const tokenFromQuery = searchParams.get('token')
    const effectiveToken = tokenFromQuery || inviteId

    if (effectiveToken) {
      setToken(effectiveToken)
      sessionStorage.setItem('inviteToken', effectiveToken)
    }
  }, [searchParams, inviteId])

  useEffect(() => {
    if (!session?.user || !token) return

    async function fetchInvitationDetails() {
      setIsLoading(true)
      try {
        // Fetch invitation details using the invitation ID from the URL path
        const workspaceInviteResponse = await fetch(`/api/workspaces/invitations/${inviteId}`, {
          method: 'GET',
        })

        if (workspaceInviteResponse.ok) {
          const data = await workspaceInviteResponse.json()
          setInvitationType('workspace')
          setInvitationDetails({
            type: 'workspace',
            data,
            name: data.workspaceName || 'a workspace',
          })
          setIsLoading(false)
          return
        }

        try {
          const { data } = await client.organization.getInvitation({
            query: { id: inviteId },
          })

          if (data) {
            setInvitationType('organization')

            // Check if user is already in an organization BEFORE showing the invitation
            const activeOrgResponse = await client.organization
              .getFullOrganization()
              .catch(() => ({ data: null }))

            if (activeOrgResponse?.data) {
              // User is already in an organization
              setCurrentOrgName(activeOrgResponse.data.name)
              setError('already-in-organization')
              setIsLoading(false)
              return
            }

            setInvitationDetails({
              type: 'organization',
              data,
              name: data.organizationName || 'an organization',
            })

            if (data.organizationId) {
              const orgResponse = await client.organization.getFullOrganization({
                query: { organizationId: data.organizationId },
              })

              if (orgResponse.data) {
                setInvitationDetails((prev: any) => ({
                  ...prev,
                  name: orgResponse.data.name || 'an organization',
                }))
              }
            }
          } else {
            throw new Error('Invitation not found or has expired')
          }
        } catch (_err) {
          throw new Error('Invitation not found or has expired')
        }
      } catch (err: any) {
        logger.error('Error fetching invitation:', err)
        setError(err.message || 'Failed to load invitation details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvitationDetails()
  }, [session?.user, inviteId, token])

  const handleAcceptInvitation = async () => {
    if (!session?.user) return

    setIsAccepting(true)

    if (invitationType === 'workspace') {
      window.location.href = `/api/workspaces/invitations/${encodeURIComponent(inviteId)}?token=${encodeURIComponent(token || '')}`
    } else {
      try {
        // Get the organizationId from invitation details
        const orgId = invitationDetails?.data?.organizationId

        if (!orgId) {
          throw new Error('Organization ID not found')
        }

        // Use our custom API endpoint that handles Pro usage snapshot
        const response = await fetch(`/api/organizations/${orgId}/invitations/${inviteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'accepted' }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: 'Failed to accept invitation' }))
          throw new Error(data.error || 'Failed to accept invitation')
        }

        // Set the organization as active
        await client.organization.setActive({
          organizationId: orgId,
        })

        setAccepted(true)

        setTimeout(() => {
          router.push('/workspace')
        }, 2000)
      } catch (err: any) {
        logger.error('Error accepting invitation:', err)

        // Reset accepted state on error
        setAccepted(false)

        // Check if it's a 409 conflict (already in an organization)
        if (err.status === 409 || err.message?.includes('already a member of an organization')) {
          setError('already-in-organization')
        } else {
          setError(err.message || 'Failed to accept invitation')
        }

        setIsAccepting(false)
      }
    }
  }

  const getCallbackUrl = () => {
    return `/invite/${inviteId}${token && token !== inviteId ? `?token=${token}` : ''}`
  }

  if (!session?.user && !isPending) {
    const callbackUrl = encodeURIComponent(getCallbackUrl())

    return (
      <InviteLayout>
        <InviteStatusCard
          type='login'
          title="You've been invited!"
          description={
            isNewUser
              ? 'Create an account to join this workspace on Sim'
              : 'Sign in to your account to accept this invitation'
          }
          icon='userPlus'
          actions={[
            ...(isNewUser
              ? [
                  {
                    label: 'Create an account',
                    onClick: () =>
                      router.push(`/signup?callbackUrl=${callbackUrl}&invite_flow=true`),
                  },
                  {
                    label: 'I already have an account',
                    onClick: () =>
                      router.push(`/login?callbackUrl=${callbackUrl}&invite_flow=true`),
                    variant: 'outline' as const,
                  },
                ]
              : [
                  {
                    label: 'Sign in',
                    onClick: () =>
                      router.push(`/login?callbackUrl=${callbackUrl}&invite_flow=true`),
                  },
                  {
                    label: 'Create an account',
                    onClick: () =>
                      router.push(`/signup?callbackUrl=${callbackUrl}&invite_flow=true&new=true`),
                    variant: 'outline' as const,
                  },
                ]),
            {
              label: 'Return to Home',
              onClick: () => router.push('/'),
            },
          ]}
        />
      </InviteLayout>
    )
  }

  if (isLoading || isPending) {
    return (
      <InviteLayout>
        <InviteStatusCard type='loading' title='' description='Loading invitation...' />
      </InviteLayout>
    )
  }

  if (error) {
    const errorReason = searchParams.get('error')
    const isExpiredError = errorReason === 'expired'
    const isAlreadyInOrg = error === 'already-in-organization'

    // Special handling for already in organization
    if (isAlreadyInOrg) {
      return (
        <InviteLayout>
          <InviteStatusCard
            type='warning'
            title='Already Part of a Team'
            description={
              currentOrgName
                ? `You are currently a member of "${currentOrgName}". You must leave your current organization before accepting a new invitation.`
                : 'You are already a member of an organization. Leave your current organization before accepting a new invitation.'
            }
            icon='users'
            actions={[
              {
                label: 'Manage Team Settings',
                onClick: () => router.push('/workspace'),
                variant: 'default' as const,
              },
              {
                label: 'Return to Home',
                onClick: () => router.push('/'),
                variant: 'ghost' as const,
              },
            ]}
          />
        </InviteLayout>
      )
    }

    // Use getErrorMessage for consistent error messages
    const errorMessage = error.startsWith('You are already') ? error : getErrorMessage(error)

    return (
      <InviteLayout>
        <InviteStatusCard
          type='error'
          title='Invitation Error'
          description={errorMessage}
          icon='error'
          isExpiredError={isExpiredError}
          actions={[
            {
              label: 'Return to Home',
              onClick: () => router.push('/'),
              variant: 'default' as const,
            },
          ]}
        />
      </InviteLayout>
    )
  }

  // Show success only if accepted AND no error
  if (accepted && !error) {
    return (
      <InviteLayout>
        <InviteStatusCard
          type='success'
          title='Welcome!'
          description={`You have successfully joined ${invitationDetails?.name || 'the workspace'}. Redirecting to your workspace...`}
          icon='success'
          actions={[
            {
              label: 'Return to Home',
              onClick: () => router.push('/'),
            },
          ]}
        />
      </InviteLayout>
    )
  }

  return (
    <InviteLayout>
      <InviteStatusCard
        type='invitation'
        title={
          invitationType === 'organization' ? 'Organization Invitation' : 'Workspace Invitation'
        }
        description={`You've been invited to join ${invitationDetails?.name || `a ${invitationType}`}. Click accept below to join.`}
        icon={invitationType === 'organization' ? 'users' : 'mail'}
        actions={[
          {
            label: 'Accept Invitation',
            onClick: handleAcceptInvitation,
            disabled: isAccepting,
            loading: isAccepting,
          },
          {
            label: 'Return to Home',
            onClick: () => router.push('/'),
            variant: 'ghost',
          },
        ]}
      />
    </InviteLayout>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/invite/[id]/page.tsx

```typescript
import Invite from '@/app/invite/[id]/invite'

export default Invite
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/llms.txt/route.ts

```typescript
export async function GET() {
  const llmsContent = `# Sim - AI Agent Workflow Builder
Sim is an open-source AI agent workflow builder for production workflows. Developers at trail-blazing startups to Fortune 500 companies deploy agentic workflows on the Sim platform. 60,000+ developers already use Sim to build and ship AI automations with 100+ integrations. Sim is SOC2 and HIPAA compliant and is designed for secure, enterprise-grade AI automation.

Website: https://sim.ai
App: https://sim.ai/workspace
Docs: https://docs.sim.ai
GitHub: https://github.com/simstudioai/sim
Region: global
Primary language: en

## Capabilities
- Visual workflow builder for multi-step AI agents and tools
- Orchestration of LLM calls, tools, webhooks, and external APIs
- Scheduled and event-driven agent executions
- First-class support for retrieval-augmented generation (RAG)
- Multi-tenant, workspace-based access model

## Ideal Use Cases
- AI agent workflow automation
- RAG agents and retrieval pipelines
- Chatbot and copilot workflows for SaaS products
- Document and email processing workflows
- Customer support, marketing, and growth automations
- Internal operations automations (ops, finance, legal, sales)

## Key Entities
- Workspace: container for workflows, data sources, and executions
- Workflow: directed graph of blocks defining an agentic process
- Block: individual step (LLM call, tool call, HTTP request, code, etc.)
- Schedule: time-based trigger for running workflows
- Execution: a single run of a workflow

## Getting Started
- Quickstart: https://docs.sim.ai/quickstart
- Product overview: https://docs.sim.ai
- Source code: https://github.com/simstudioai/sim

## Safety & Reliability
- SOC2 and HIPAA aligned security controls
- Audit-friendly execution logs and cost tracking
- Fine-grained control over external tools, APIs, and data sources
`

  return new Response(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
```

--------------------------------------------------------------------------------

````
