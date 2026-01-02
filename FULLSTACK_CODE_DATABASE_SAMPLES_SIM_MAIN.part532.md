---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 532
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 532 of 933)

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

---[FILE: oauth-credentials.ts]---
Location: sim-main/apps/sim/hooks/queries/oauth-credentials.ts

```typescript
import { useQuery } from '@tanstack/react-query'
import type { Credential } from '@/lib/oauth'
import { fetchJson } from '@/hooks/selectors/helpers'

interface CredentialListResponse {
  credentials?: Credential[]
}

interface CredentialDetailResponse {
  credentials?: Credential[]
}

export const oauthCredentialKeys = {
  list: (providerId?: string) => ['oauthCredentials', providerId ?? 'none'] as const,
  detail: (credentialId?: string, workflowId?: string) =>
    ['oauthCredentialDetail', credentialId ?? 'none', workflowId ?? 'none'] as const,
}

export async function fetchOAuthCredentials(providerId: string): Promise<Credential[]> {
  if (!providerId) return []
  const data = await fetchJson<CredentialListResponse>('/api/auth/oauth/credentials', {
    searchParams: { provider: providerId },
  })
  return data.credentials ?? []
}

export async function fetchOAuthCredentialDetail(
  credentialId: string,
  workflowId?: string
): Promise<Credential[]> {
  if (!credentialId) return []
  const data = await fetchJson<CredentialDetailResponse>('/api/auth/oauth/credentials', {
    searchParams: {
      credentialId,
      workflowId,
    },
  })
  return data.credentials ?? []
}

export function useOAuthCredentials(providerId?: string, enabled = true) {
  return useQuery<Credential[]>({
    queryKey: oauthCredentialKeys.list(providerId),
    queryFn: () => fetchOAuthCredentials(providerId ?? ''),
    enabled: Boolean(providerId) && enabled,
    staleTime: 60 * 1000,
  })
}

export function useOAuthCredentialDetail(
  credentialId?: string,
  workflowId?: string,
  enabled = true
) {
  return useQuery<Credential[]>({
    queryKey: oauthCredentialKeys.detail(credentialId, workflowId),
    queryFn: () => fetchOAuthCredentialDetail(credentialId ?? '', workflowId),
    enabled: Boolean(credentialId) && enabled,
    staleTime: 60 * 1000,
  })
}

export function useCredentialName(credentialId?: string, providerId?: string, workflowId?: string) {
  const { data: credentials = [], isFetching: credentialsLoading } = useOAuthCredentials(
    providerId,
    Boolean(providerId)
  )

  const selectedCredential = credentials.find((cred) => cred.id === credentialId)

  const shouldFetchDetail = Boolean(credentialId && !selectedCredential && providerId && workflowId)

  const { data: foreignCredentials = [], isFetching: foreignLoading } = useOAuthCredentialDetail(
    shouldFetchDetail ? credentialId : undefined,
    workflowId,
    shouldFetchDetail
  )

  const hasForeignMeta = foreignCredentials.length > 0

  const displayName = selectedCredential?.name ?? (hasForeignMeta ? 'Saved by collaborator' : null)

  return {
    displayName,
    isLoading: credentialsLoading || foreignLoading,
    hasForeignMeta,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: organization.ts]---
Location: sim-main/apps/sim/hooks/queries/organization.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/lib/auth/auth-client'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('OrganizationQueries')

/**
 * Query key factories for organization-related queries
 * This ensures consistent cache invalidation across the app
 */
export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  subscription: (id: string) => [...organizationKeys.detail(id), 'subscription'] as const,
  billing: (id: string) => [...organizationKeys.detail(id), 'billing'] as const,
  members: (id: string) => [...organizationKeys.detail(id), 'members'] as const,
  memberUsage: (id: string) => [...organizationKeys.detail(id), 'member-usage'] as const,
}

/**
 * Fetch all organizations for the current user
 * Note: Billing data is fetched separately via useSubscriptionData() to avoid duplicate calls
 */
async function fetchOrganizations() {
  const [orgsResponse, activeOrgResponse] = await Promise.all([
    client.organization.list(),
    client.organization.getFullOrganization(),
  ])

  return {
    organizations: orgsResponse.data || [],
    activeOrganization: activeOrgResponse.data,
  }
}

/**
 * Hook to fetch all organizations
 */
export function useOrganizations() {
  return useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: fetchOrganizations,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch a specific organization by ID
 */
async function fetchOrganization() {
  const response = await client.organization.getFullOrganization()
  return response.data
}

/**
 * Hook to fetch a specific organization
 */
export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: organizationKeys.detail(orgId),
    queryFn: fetchOrganization,
    enabled: !!orgId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch organization subscription data
 */
async function fetchOrganizationSubscription(orgId: string) {
  if (!orgId) {
    return null
  }

  const response = await client.subscription.list({
    query: { referenceId: orgId },
  })

  if (response.error) {
    logger.error('Error fetching organization subscription', { error: response.error })
    return null
  }

  const teamSubscription = response.data?.find(
    (sub: any) => sub.status === 'active' && sub.plan === 'team'
  )
  const enterpriseSubscription = response.data?.find(
    (sub: any) => sub.plan === 'enterprise' || sub.plan === 'enterprise-plus'
  )
  const activeSubscription = enterpriseSubscription || teamSubscription

  return activeSubscription || null
}

/**
 * Hook to fetch organization subscription
 */
export function useOrganizationSubscription(orgId: string) {
  return useQuery({
    queryKey: organizationKeys.subscription(orgId),
    queryFn: () => fetchOrganizationSubscription(orgId),
    enabled: !!orgId,
    retry: false,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch organization billing data
 */
async function fetchOrganizationBilling(orgId: string) {
  const response = await fetch(`/api/billing?context=organization&id=${orgId}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch organization billing data')
  }
  return response.json()
}

/**
 * Hook to fetch organization billing data
 */
export function useOrganizationBilling(orgId: string) {
  return useQuery({
    queryKey: organizationKeys.billing(orgId),
    queryFn: () => fetchOrganizationBilling(orgId),
    enabled: !!orgId,
    retry: false,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch organization member usage data
 */
async function fetchOrganizationMembers(orgId: string) {
  const response = await fetch(`/api/organizations/${orgId}/members?include=usage`)

  if (response.status === 404) {
    return { members: [] }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch organization members')
  }
  return response.json()
}

/**
 * Hook to fetch organization members with usage data
 */
export function useOrganizationMembers(orgId: string) {
  return useQuery({
    queryKey: organizationKeys.memberUsage(orgId),
    queryFn: () => fetchOrganizationMembers(orgId),
    enabled: !!orgId,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Update organization usage limit mutation with optimistic updates
 */
interface UpdateOrganizationUsageLimitParams {
  organizationId: string
  limit: number
}

export function useUpdateOrganizationUsageLimit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, limit }: UpdateOrganizationUsageLimitParams) => {
      const response = await fetch('/api/usage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: 'organization', organizationId, limit }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || 'Failed to update usage limit')
      }

      return response.json()
    },
    onMutate: async ({ organizationId, limit }) => {
      await queryClient.cancelQueries({ queryKey: organizationKeys.billing(organizationId) })
      await queryClient.cancelQueries({ queryKey: organizationKeys.subscription(organizationId) })

      const previousBillingData = queryClient.getQueryData(organizationKeys.billing(organizationId))
      const previousSubscriptionData = queryClient.getQueryData(
        organizationKeys.subscription(organizationId)
      )

      queryClient.setQueryData(organizationKeys.billing(organizationId), (old: any) => {
        if (!old) return old
        const currentUsage = old.data?.currentUsage || old.data?.usage?.current || 0
        const newPercentUsed = limit > 0 ? (currentUsage / limit) * 100 : 0

        return {
          ...old,
          data: {
            ...old.data,
            totalUsageLimit: limit,
            usage: {
              ...old.data?.usage,
              limit,
              percentUsed: newPercentUsed,
            },
            percentUsed: newPercentUsed,
          },
        }
      })

      return { previousBillingData, previousSubscriptionData, organizationId }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBillingData && context?.organizationId) {
        queryClient.setQueryData(
          organizationKeys.billing(context.organizationId),
          context.previousBillingData
        )
      }
      if (context?.previousSubscriptionData && context?.organizationId) {
        queryClient.setQueryData(
          organizationKeys.subscription(context.organizationId),
          context.previousSubscriptionData
        )
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.billing(variables.organizationId),
      })
      queryClient.invalidateQueries({
        queryKey: organizationKeys.subscription(variables.organizationId),
      })
    },
  })
}

/**
 * Invite member mutation
 */
interface InviteMemberParams {
  email: string
  workspaceInvitations?: Array<{ workspaceId: string; permission: 'admin' | 'write' | 'read' }>
  orgId: string
}

export function useInviteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, workspaceInvitations, orgId }: InviteMemberParams) => {
      const response = await fetch(`/api/organizations/${orgId}/invitations?batch=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: [email],
          workspaceInvitations,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || error.message || 'Failed to invite member')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.billing(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.memberUsage(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
    },
  })
}

/**
 * Remove member mutation
 */
interface RemoveMemberParams {
  memberId: string
  orgId: string
  shouldReduceSeats?: boolean
}

export function useRemoveMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ memberId, orgId, shouldReduceSeats }: RemoveMemberParams) => {
      const response = await fetch(
        `/api/organizations/${orgId}/members/${memberId}?shouldReduceSeats=${shouldReduceSeats}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to remove member')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.billing(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.memberUsage(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.subscription(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
    },
  })
}

/**
 * Cancel invitation mutation
 */
interface CancelInvitationParams {
  invitationId: string
  orgId: string
}

export function useCancelInvitation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ invitationId, orgId }: CancelInvitationParams) => {
      const response = await fetch(
        `/api/organizations/${orgId}/invitations?invitationId=${invitationId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to cancel invitation')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
    },
  })
}

/**
 * Update seats mutation (handles both add and reduce)
 */
interface UpdateSeatsParams {
  orgId: string
  seats: number
}

export function useUpdateSeats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ seats, orgId }: UpdateSeatsParams) => {
      const response = await fetch(`/api/organizations/${orgId}/seats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update seats')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.subscription(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.billing(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
    },
  })
}

/**
 * Update organization settings mutation
 */
interface UpdateOrganizationParams {
  orgId: string
  name?: string
  slug?: string
  logo?: string | null
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orgId, ...updates }: UpdateOrganizationParams) => {
      const response = await fetch(`/api/organizations/${orgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update organization')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(variables.orgId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() })
    },
  })
}

/**
 * Create organization mutation
 */
interface CreateOrganizationParams {
  name: string
  slug?: string
}

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, slug }: CreateOrganizationParams) => {
      const response = await client.organization.create({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      })

      if (!response.data) {
        throw new Error('Failed to create organization')
      }

      await client.organization.setActive({
        organizationId: response.data.id,
      })

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.all })
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: providers.ts]---
Location: sim-main/apps/sim/hooks/queries/providers.ts

```typescript
import { useQuery } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'
import type { ProviderName } from '@/stores/providers/types'

const logger = createLogger('ProviderModelsQuery')

const providerEndpoints: Record<ProviderName, string> = {
  base: '/api/providers/base/models',
  ollama: '/api/providers/ollama/models',
  vllm: '/api/providers/vllm/models',
  openrouter: '/api/providers/openrouter/models',
}

async function fetchProviderModels(provider: ProviderName): Promise<string[]> {
  const response = await fetch(providerEndpoints[provider])

  if (!response.ok) {
    logger.warn(`Failed to fetch ${provider} models`, {
      status: response.status,
      statusText: response.statusText,
    })
    throw new Error(`Failed to fetch ${provider} models`)
  }

  const data = await response.json()
  const models: string[] = Array.isArray(data.models) ? data.models : []

  return provider === 'openrouter' ? Array.from(new Set(models)) : models
}

export function useProviderModels(provider: ProviderName) {
  return useQuery({
    queryKey: ['provider-models', provider],
    queryFn: () => fetchProviderModels(provider),
    staleTime: 5 * 60 * 1000,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: sso.ts]---
Location: sim-main/apps/sim/hooks/queries/sso.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { organizationKeys } from '@/hooks/queries/organization'

/**
 * Query key factories for SSO-related queries
 */
export const ssoKeys = {
  all: ['sso'] as const,
  providers: () => [...ssoKeys.all, 'providers'] as const,
}

/**
 * Fetch SSO providers
 */
async function fetchSSOProviders() {
  const response = await fetch('/api/auth/sso/providers')
  if (!response.ok) {
    throw new Error('Failed to fetch SSO providers')
  }
  return response.json()
}

/**
 * Hook to fetch SSO providers
 */
export function useSSOProviders() {
  return useQuery({
    queryKey: ssoKeys.providers(),
    queryFn: fetchSSOProviders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  })
}

/**
 * Configure SSO provider mutation
 */
interface ConfigureSSOParams {
  provider: string
  domain: string
  clientId: string
  clientSecret: string
  orgId?: string
}

export function useConfigureSSO() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (config: ConfigureSSOParams) => {
      const response = await fetch('/api/auth/sso/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to configure SSO')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ssoKeys.providers() })

      if (variables.orgId) {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(variables.orgId),
        })
        queryClient.invalidateQueries({
          queryKey: organizationKeys.lists(),
        })
      }
    },
  })
}

/**
 * Delete SSO provider mutation
 */
interface DeleteSSOParams {
  providerId: string
  orgId?: string
}

export function useDeleteSSO() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ providerId }: DeleteSSOParams) => {
      const response = await fetch(`/api/auth/sso/providers/${providerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete SSO provider')
      }

      return response.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ssoKeys.providers() })

      if (variables.orgId) {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(variables.orgId),
        })
      }
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: status.ts]---
Location: sim-main/apps/sim/hooks/queries/status.ts

```typescript
import { useQuery } from '@tanstack/react-query'
import type { StatusResponse } from '@/app/api/status/types'

/**
 * Query key factories for status-related queries
 * This ensures consistent cache invalidation across the app
 */
export const statusKeys = {
  all: ['status'] as const,
  current: () => [...statusKeys.all, 'current'] as const,
}

/**
 * Fetch current system status from the API
 * The API proxies incident.io and caches for 2 minutes server-side
 */
async function fetchStatus(): Promise<StatusResponse> {
  const response = await fetch('/api/status')

  if (!response.ok) {
    throw new Error('Failed to fetch status')
  }

  return response.json()
}

/**
 * Hook to fetch current system status
 * - Polls every 60 seconds to keep status up-to-date
 * - Refetches when user returns to tab for immediate updates
 * - Caches for 1 minute to reduce unnecessary requests
 */
export function useStatus() {
  return useQuery({
    queryKey: statusKeys.current(),
    queryFn: fetchStatus,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Poll every 60 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: subscription.ts]---
Location: sim-main/apps/sim/hooks/queries/subscription.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { organizationKeys } from '@/hooks/queries/organization'

/**
 * Query key factories for subscription-related queries
 */
export const subscriptionKeys = {
  all: ['subscription'] as const,
  user: () => [...subscriptionKeys.all, 'user'] as const,
  usage: () => [...subscriptionKeys.all, 'usage'] as const,
}

/**
 * Fetch user subscription data
 */
async function fetchSubscriptionData() {
  const response = await fetch('/api/billing?context=user')
  if (!response.ok) {
    throw new Error('Failed to fetch subscription data')
  }
  return response.json()
}

/**
 * Hook to fetch user subscription data
 */
export function useSubscriptionData() {
  return useQuery({
    queryKey: subscriptionKeys.user(),
    queryFn: fetchSubscriptionData,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Fetch user usage limit metadata
 * Note: This endpoint returns limit information (currentLimit, minimumLimit, canEdit, etc.)
 * For actual usage data (current, limit, percentUsed), use useSubscriptionData() instead
 */
async function fetchUsageLimitData() {
  const response = await fetch('/api/usage?context=user')
  if (!response.ok) {
    throw new Error('Failed to fetch usage limit data')
  }
  return response.json()
}

/**
 * Hook to fetch usage limit metadata
 * Returns: currentLimit, minimumLimit, canEdit, plan, updatedAt
 * Use this for editing usage limits, not for displaying current usage
 */
export function useUsageLimitData() {
  return useQuery({
    queryKey: subscriptionKeys.usage(),
    queryFn: fetchUsageLimitData,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  })
}

/**
 * Update usage limit mutation
 */
interface UpdateUsageLimitParams {
  limit: number
}

export function useUpdateUsageLimit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ limit }: UpdateUsageLimitParams) => {
      const response = await fetch('/api/usage?context=user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update usage limit')
      }

      return response.json()
    },
    onMutate: async ({ limit }) => {
      await queryClient.cancelQueries({ queryKey: subscriptionKeys.user() })
      await queryClient.cancelQueries({ queryKey: subscriptionKeys.usage() })

      const previousSubscriptionData = queryClient.getQueryData(subscriptionKeys.user())
      const previousUsageData = queryClient.getQueryData(subscriptionKeys.usage())

      queryClient.setQueryData(subscriptionKeys.user(), (old: any) => {
        if (!old) return old
        const currentUsage = old.data?.usage?.current || 0
        const newPercentUsed = limit > 0 ? (currentUsage / limit) * 100 : 0

        return {
          ...old,
          data: {
            ...old.data,
            usage: {
              ...old.data?.usage,
              limit,
              percentUsed: newPercentUsed,
            },
          },
        }
      })

      queryClient.setQueryData(subscriptionKeys.usage(), (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: {
            ...old.data,
            currentLimit: limit,
          },
        }
      })

      return { previousSubscriptionData, previousUsageData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSubscriptionData) {
        queryClient.setQueryData(subscriptionKeys.user(), context.previousSubscriptionData)
      }
      if (context?.previousUsageData) {
        queryClient.setQueryData(subscriptionKeys.usage(), context.previousUsageData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.user() })
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.usage() })
    },
  })
}

/**
 * Upgrade subscription mutation
 */
interface UpgradeSubscriptionParams {
  plan: string
  orgId?: string
}

export function useUpgradeSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ plan }: UpgradeSubscriptionParams) => {
      return { plan }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })

      if (variables.orgId) {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.billing(variables.orgId),
        })
        queryClient.invalidateQueries({
          queryKey: organizationKeys.subscription(variables.orgId),
        })
      }
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: sim-main/apps/sim/hooks/queries/templates.ts

```typescript
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TemplateQueries')

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: TemplateListFilters) => [...templateKeys.lists(), filters ?? {}] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (templateId?: string) => [...templateKeys.details(), templateId ?? ''] as const,
  byWorkflow: (workflowId?: string) =>
    [...templateKeys.all, 'byWorkflow', workflowId ?? ''] as const,
}

export interface TemplateListFilters {
  search?: string
  status?: 'pending' | 'approved' | 'rejected'
  workflowId?: string
  limit?: number
  offset?: number
  includeAllStatuses?: boolean
}

export interface TemplateCreator {
  id: string
  name: string
  referenceType: 'user' | 'organization'
  referenceId: string
  email?: string
  website?: string
  profileImageUrl?: string | null
  verified?: boolean
  details?: {
    about?: string
    xUrl?: string
    linkedinUrl?: string
    websiteUrl?: string
    contactEmail?: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  workflowId: string
  name: string
  details?: {
    tagline?: string
    about?: string
  }
  creatorId?: string
  creator?: TemplateCreator
  views: number
  stars: number
  status: 'pending' | 'approved' | 'rejected'
  tags: string[]
  requiredCredentials: Record<string, any>
  state: any
  createdAt: string
  updatedAt: string
  isStarred?: boolean
  isSuperUser?: boolean
}

export interface TemplatesResponse {
  data: Template[]
  pagination: {
    total: number
    limit: number
    offset: number
    page: number
    totalPages: number
  }
}

export interface TemplateDetailResponse {
  data: Template
}

export interface CreateTemplateInput {
  workflowId: string
  name: string
  details?: {
    tagline?: string
    about?: string
  }
  creatorId?: string
  tags?: string[]
}

export interface UpdateTemplateInput {
  name?: string
  details?: {
    tagline?: string
    about?: string
  }
  creatorId?: string
  tags?: string[]
  updateState?: boolean
}

async function fetchTemplates(filters?: TemplateListFilters): Promise<TemplatesResponse> {
  const params = new URLSearchParams()

  if (filters?.search) params.set('search', filters.search)
  if (filters?.status) params.set('status', filters.status)
  if (filters?.workflowId) params.set('workflowId', filters.workflowId)
  if (filters?.includeAllStatuses) params.set('includeAllStatuses', 'true')
  params.set('limit', (filters?.limit ?? 50).toString())
  params.set('offset', (filters?.offset ?? 0).toString())

  const response = await fetch(`/api/templates?${params.toString()}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch templates')
  }

  return response.json()
}

async function fetchTemplate(templateId: string): Promise<TemplateDetailResponse> {
  const response = await fetch(`/api/templates/${templateId}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch template')
  }

  return response.json()
}

async function fetchTemplateByWorkflow(workflowId: string): Promise<Template | null> {
  const response = await fetch(`/api/templates?workflowId=${workflowId}&limit=1`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch template')
  }

  const result: TemplatesResponse = await response.json()
  return result.data?.[0] || null
}

export function useTemplates(
  filters?: TemplateListFilters,
  options?: {
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => fetchTemplates(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes - templates don't change frequently
    placeholderData: keepPreviousData,
  })
}

export function useTemplate(
  templateId?: string,
  options?: {
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: templateKeys.detail(templateId),
    queryFn: () => fetchTemplate(templateId as string),
    enabled: (options?.enabled ?? true) && Boolean(templateId),
    staleTime: 10 * 60 * 1000, // 10 minutes - individual templates are fairly static
    select: (data) => data.data,
  })
}

export function useTemplateByWorkflow(
  workflowId?: string,
  options?: {
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: templateKeys.byWorkflow(workflowId),
    queryFn: () => fetchTemplateByWorkflow(workflowId as string),
    enabled: (options?.enabled ?? true) && Boolean(workflowId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTemplateInput) => {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create template')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.byWorkflow(variables.workflowId) })
      logger.info('Template created successfully')
    },
    onError: (error) => {
      logger.error('Failed to create template', error)
    },
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTemplateInput }) => {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update template')
      }

      return response.json()
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: templateKeys.detail(id) })

      const previousTemplate = queryClient.getQueryData<TemplateDetailResponse>(
        templateKeys.detail(id)
      )

      if (previousTemplate) {
        queryClient.setQueryData<TemplateDetailResponse>(templateKeys.detail(id), {
          ...previousTemplate,
          data: {
            ...previousTemplate.data,
            ...data,
            updatedAt: new Date().toISOString(),
          },
        })
      }

      return { previousTemplate }
    },
    onError: (error, { id }, context) => {
      if (context?.previousTemplate) {
        queryClient.setQueryData(templateKeys.detail(id), context.previousTemplate)
      }
      logger.error('Failed to update template', error)
    },
    onSuccess: (result, { id }) => {
      queryClient.setQueryData<TemplateDetailResponse>(templateKeys.detail(id), result)

      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })

      if (result.data?.workflowId) {
        queryClient.invalidateQueries({
          queryKey: templateKeys.byWorkflow(result.data.workflowId),
        })
      }

      logger.info('Template updated successfully')
    },
  })
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to delete template')
      }

      return response.json()
    },
    onSuccess: (_, templateId) => {
      queryClient.removeQueries({ queryKey: templateKeys.detail(templateId) })

      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })

      queryClient.invalidateQueries({
        queryKey: [...templateKeys.all, 'byWorkflow'],
        exact: false,
      })

      logger.info('Template deleted successfully')
    },
    onError: (error) => {
      logger.error('Failed to delete template', error)
    },
  })
}

export function useStarTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      templateId,
      action,
    }: {
      templateId: string
      action: 'add' | 'remove'
    }) => {
      const method = action === 'add' ? 'POST' : 'DELETE'
      const response = await fetch(`/api/templates/${templateId}/star`, { method })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to toggle star')
      }

      return response.json()
    },
    onMutate: async ({ templateId, action }) => {
      await queryClient.cancelQueries({ queryKey: templateKeys.detail(templateId) })

      const previousTemplate = queryClient.getQueryData<TemplateDetailResponse>(
        templateKeys.detail(templateId)
      )

      if (previousTemplate) {
        const newStarCount =
          action === 'add'
            ? previousTemplate.data.stars + 1
            : Math.max(0, previousTemplate.data.stars - 1)

        queryClient.setQueryData<TemplateDetailResponse>(templateKeys.detail(templateId), {
          ...previousTemplate,
          data: {
            ...previousTemplate.data,
            stars: newStarCount,
            isStarred: action === 'add',
          },
        })
      }

      const listQueries = queryClient.getQueriesData<TemplatesResponse>({
        queryKey: templateKeys.lists(),
      })

      listQueries.forEach(([key, data]) => {
        if (!data) return
        queryClient.setQueryData<TemplatesResponse>(key, {
          ...data,
          data: data.data.map((template) => {
            if (template.id === templateId) {
              const newStarCount =
                action === 'add' ? template.stars + 1 : Math.max(0, template.stars - 1)
              return {
                ...template,
                stars: newStarCount,
                isStarred: action === 'add',
              }
            }
            return template
          }),
        })
      })

      return { previousTemplate }
    },
    onError: (error, { templateId }, context) => {
      if (context?.previousTemplate) {
        queryClient.setQueryData(templateKeys.detail(templateId), context.previousTemplate)
      }

      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })

      logger.error('Failed to toggle star', error)
    },
    onSettled: (_, __, { templateId }) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) })
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
    },
  })
}
```

--------------------------------------------------------------------------------

````
