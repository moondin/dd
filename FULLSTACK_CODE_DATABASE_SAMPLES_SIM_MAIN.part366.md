---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 366
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 366 of 933)

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

---[FILE: provider-models-loader.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/providers/provider-models-loader.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useProviderModels } from '@/hooks/queries/providers'
import {
  updateOllamaProviderModels,
  updateOpenRouterProviderModels,
  updateVLLMProviderModels,
} from '@/providers/utils'
import { useProvidersStore } from '@/stores/providers/store'
import type { ProviderName } from '@/stores/providers/types'

const logger = createLogger('ProviderModelsLoader')

function useSyncProvider(provider: ProviderName) {
  const setProviderModels = useProvidersStore((state) => state.setProviderModels)
  const setProviderLoading = useProvidersStore((state) => state.setProviderLoading)
  const { data, isLoading, isFetching, error } = useProviderModels(provider)

  useEffect(() => {
    setProviderLoading(provider, isLoading || isFetching)
  }, [provider, isLoading, isFetching, setProviderLoading])

  useEffect(() => {
    if (!data) return

    try {
      if (provider === 'ollama') {
        updateOllamaProviderModels(data)
      } else if (provider === 'vllm') {
        updateVLLMProviderModels(data)
      } else if (provider === 'openrouter') {
        void updateOpenRouterProviderModels(data)
      }
    } catch (syncError) {
      logger.warn(`Failed to sync provider definitions for ${provider}`, syncError as Error)
    }

    setProviderModels(provider, data)
  }, [provider, data, setProviderModels])

  useEffect(() => {
    if (error) {
      logger.error(`Failed to load ${provider} models`, error)
    }
  }, [provider, error])
}

export function ProviderModelsLoader() {
  useSyncProvider('base')
  useSyncProvider('ollama')
  useSyncProvider('vllm')
  useSyncProvider('openrouter')
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: settings-loader.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/providers/settings-loader.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { useSession } from '@/lib/auth/auth-client'
import { useGeneralSettings } from '@/hooks/queries/general-settings'

/**
 * Loads user settings from database once per workspace session.
 * React Query handles the fetching and automatically syncs to Zustand store.
 * This ensures settings are available throughout the app.
 */
export function SettingsLoader() {
  const { data: session, isPending: isSessionPending } = useSession()
  const hasLoadedRef = useRef(false)

  // Use React Query hook which automatically syncs to Zustand
  // This replaces the old Zustand loadSettings() call
  const { refetch } = useGeneralSettings()

  useEffect(() => {
    // Only load settings once per session for authenticated users
    if (!isSessionPending && session?.user && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      // Force refetch from DB on initial workspace entry
      refetch()
    }
  }, [isSessionPending, session?.user, refetch])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: workspace-permissions-provider.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/providers/workspace-permissions-provider.tsx
Signals: React, Next.js

```typescript
'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createLogger } from '@/lib/logs/console/logger'
import { useCollaborativeWorkflow } from '@/hooks/use-collaborative-workflow'
import { useUserPermissions, type WorkspaceUserPermissions } from '@/hooks/use-user-permissions'
import {
  useWorkspacePermissions,
  type WorkspacePermissions,
} from '@/hooks/use-workspace-permissions'
import { useNotificationStore } from '@/stores/notifications'

const logger = createLogger('WorkspacePermissionsProvider')

interface WorkspacePermissionsContextType {
  // Raw workspace permissions data
  workspacePermissions: WorkspacePermissions | null
  permissionsLoading: boolean
  permissionsError: string | null
  updatePermissions: (newPermissions: WorkspacePermissions) => void
  refetchPermissions: () => Promise<void>

  // Computed user permissions (connection-aware)
  userPermissions: WorkspaceUserPermissions & { isOfflineMode?: boolean }

  // Connection state management
  setOfflineMode: (isOffline: boolean) => void
}

const WorkspacePermissionsContext = createContext<WorkspacePermissionsContextType>({
  workspacePermissions: null,
  permissionsLoading: false,
  permissionsError: null,
  updatePermissions: () => {},
  refetchPermissions: async () => {},
  userPermissions: {
    canRead: false,
    canEdit: false,
    canAdmin: false,
    userPermissions: 'read',
    isLoading: false,
    error: null,
  },
  setOfflineMode: () => {},
})

interface WorkspacePermissionsProviderProps {
  children: React.ReactNode
}

/**
 * Provider that manages workspace permissions and user access
 * Also provides connection-aware permissions that enforce read-only mode when offline
 */
export function WorkspacePermissionsProvider({ children }: WorkspacePermissionsProviderProps) {
  const params = useParams()
  const workspaceId = params?.workspaceId as string

  // Manage offline mode state locally
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  // Track whether we've already surfaced an offline notification to avoid duplicates
  const [hasShownOfflineNotification, setHasShownOfflineNotification] = useState(false)

  // Get operation error state from collaborative workflow
  const { hasOperationError } = useCollaborativeWorkflow()

  const addNotification = useNotificationStore((state) => state.addNotification)

  // Set offline mode when there are operation errors
  useEffect(() => {
    if (hasOperationError) {
      setIsOfflineMode(true)
    }
  }, [hasOperationError])

  /**
   * Surface a global notification when entering offline mode.
   * Uses the shared notifications system instead of bespoke UI in individual components.
   */
  useEffect(() => {
    if (!isOfflineMode || hasShownOfflineNotification) {
      return
    }

    try {
      addNotification({
        level: 'error',
        message: 'Connection unavailable',
        // Global notification (no workflowId) so it is visible regardless of the active workflow
        action: {
          type: 'refresh',
          message: '',
        },
      })
      setHasShownOfflineNotification(true)
    } catch (error) {
      logger.error('Failed to add offline notification', { error })
    }
  }, [addNotification, hasShownOfflineNotification, isOfflineMode])

  // Fetch workspace permissions and loading state
  const {
    permissions: workspacePermissions,
    loading: permissionsLoading,
    error: permissionsError,
    updatePermissions,
    refetch: refetchPermissions,
  } = useWorkspacePermissions(workspaceId)

  // Get base user permissions from workspace permissions
  const baseUserPermissions = useUserPermissions(
    workspacePermissions,
    permissionsLoading,
    permissionsError
  )

  // Note: Connection-based error detection removed - only rely on operation timeouts
  // The 5-second operation timeout system will handle all error cases

  // Create connection-aware permissions that override user permissions when offline
  const userPermissions = useMemo((): WorkspaceUserPermissions & { isOfflineMode?: boolean } => {
    if (isOfflineMode) {
      // In offline mode, force read-only permissions regardless of actual user permissions
      return {
        ...baseUserPermissions,
        canEdit: false,
        canAdmin: false,
        // Keep canRead true so users can still view content
        canRead: baseUserPermissions.canRead,
        isOfflineMode: true,
      }
    }

    // When online, use normal permissions
    return {
      ...baseUserPermissions,
      isOfflineMode: false,
    }
  }, [baseUserPermissions, isOfflineMode])

  const contextValue = useMemo(
    () => ({
      workspacePermissions,
      permissionsLoading,
      permissionsError,
      updatePermissions,
      refetchPermissions,
      userPermissions,
      setOfflineMode: setIsOfflineMode,
    }),
    [
      workspacePermissions,
      permissionsLoading,
      permissionsError,
      updatePermissions,
      refetchPermissions,
      userPermissions,
    ]
  )

  return (
    <WorkspacePermissionsContext.Provider value={contextValue}>
      {children}
    </WorkspacePermissionsContext.Provider>
  )
}

/**
 * Hook to access workspace permissions and data from context
 * This provides both raw workspace permissions and computed user permissions
 */
export function useWorkspacePermissionsContext(): WorkspacePermissionsContextType {
  const context = useContext(WorkspacePermissionsContext)
  if (!context) {
    throw new Error(
      'useWorkspacePermissionsContext must be used within a WorkspacePermissionsProvider'
    )
  }
  return context
}

/**
 * Hook to access user permissions from context
 * This replaces individual useUserPermissions calls and includes connection-aware permissions
 */
export function useUserPermissionsContext(): WorkspaceUserPermissions & {
  isOfflineMode?: boolean
} {
  const { userPermissions } = useWorkspacePermissionsContext()
  return userPermissions
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/layout.tsx

```typescript
/**
 * Templates layout - applies sidebar padding for all template routes.
 */
export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <main className='flex h-full flex-1 flex-col overflow-hidden pl-60'>{children}</main>
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/page.tsx
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { settings, templateCreators, templateStars, templates, user } from '@sim/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { verifyWorkspaceMembership } from '@/app/api/workflows/utils'
import type { Template as WorkspaceTemplate } from '@/app/workspace/[workspaceId]/templates/templates'
import Templates from '@/app/workspace/[workspaceId]/templates/templates'

interface TemplatesPageProps {
  params: Promise<{
    workspaceId: string
  }>
}

/**
 * Workspace-scoped Templates page.
 * Requires authentication and workspace membership to access.
 */
export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { workspaceId } = await params
  const session = await getSession()

  // Redirect unauthenticated users to public templates page
  if (!session?.user?.id) {
    redirect('/templates')
  }

  // Verify workspace membership
  const hasPermission = await verifyWorkspaceMembership(session.user.id, workspaceId)
  if (!hasPermission) {
    redirect('/')
  }

  // Determine effective super user (DB flag AND UI mode enabled)
  const currentUser = await db
    .select({ isSuperUser: user.isSuperUser })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
  const userSettings = await db
    .select({ superUserModeEnabled: settings.superUserModeEnabled })
    .from(settings)
    .where(eq(settings.userId, session.user.id))
    .limit(1)

  const isSuperUser = currentUser[0]?.isSuperUser || false
  const superUserModeEnabled = userSettings[0]?.superUserModeEnabled ?? true
  const effectiveSuperUser = isSuperUser && superUserModeEnabled

  // Load templates from database
  let rows:
    | Array<{
        id: string
        workflowId: string | null
        name: string
        details?: unknown
        creatorId: string | null
        creator: {
          id: string
          referenceType: 'user' | 'organization'
          referenceId: string
          name: string
          profileImageUrl?: string | null
          details?: unknown
          verified: boolean
        } | null
        views: number
        stars: number
        status: 'pending' | 'approved' | 'rejected'
        tags: string[]
        requiredCredentials: unknown
        state: unknown
        createdAt: Date | string
        updatedAt: Date | string
        isStarred?: boolean
      }>
    | undefined

  if (session?.user?.id) {
    const whereCondition = effectiveSuperUser ? undefined : eq(templates.status, 'approved')
    rows = await db
      .select({
        id: templates.id,
        workflowId: templates.workflowId,
        name: templates.name,
        details: templates.details,
        creatorId: templates.creatorId,
        creator: templateCreators,
        views: templates.views,
        stars: templates.stars,
        status: templates.status,
        tags: templates.tags,
        requiredCredentials: templates.requiredCredentials,
        state: templates.state,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt,
        isStarred: sql<boolean>`CASE WHEN ${templateStars.id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(templates)
      .leftJoin(
        templateStars,
        and(eq(templateStars.templateId, templates.id), eq(templateStars.userId, session.user.id))
      )
      .leftJoin(templateCreators, eq(templates.creatorId, templateCreators.id))
      .where(whereCondition)
      .orderBy(desc(templates.views), desc(templates.createdAt))
  } else {
    rows = await db
      .select({
        id: templates.id,
        workflowId: templates.workflowId,
        name: templates.name,
        details: templates.details,
        creatorId: templates.creatorId,
        creator: templateCreators,
        views: templates.views,
        stars: templates.stars,
        status: templates.status,
        tags: templates.tags,
        requiredCredentials: templates.requiredCredentials,
        state: templates.state,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt,
      })
      .from(templates)
      .leftJoin(templateCreators, eq(templates.creatorId, templateCreators.id))
      .where(eq(templates.status, 'approved'))
      .orderBy(desc(templates.views), desc(templates.createdAt))
      .then((r) => r.map((row) => ({ ...row, isStarred: false })))
  }

  const initialTemplates: WorkspaceTemplate[] =
    rows?.map((row) => {
      const authorType = (row.creator?.referenceType as 'user' | 'organization') ?? 'user'
      const organizationId =
        row.creator?.referenceType === 'organization' ? row.creator.referenceId : null
      const userId =
        row.creator?.referenceType === 'user' ? row.creator.referenceId : '' /* no owner context */

      return {
        // New structure fields
        id: row.id,
        workflowId: row.workflowId,
        name: row.name,
        details: row.details as { tagline?: string; about?: string } | null,
        creatorId: row.creatorId,
        creator: row.creator
          ? {
              id: row.creator.id,
              name: row.creator.name,
              profileImageUrl: row.creator.profileImageUrl,
              details: row.creator.details as {
                about?: string
                xUrl?: string
                linkedinUrl?: string
                websiteUrl?: string
                contactEmail?: string
              } | null,
              referenceType: row.creator.referenceType,
              referenceId: row.creator.referenceId,
              verified: row.creator.verified,
            }
          : null,
        views: row.views,
        stars: row.stars,
        status: row.status,
        tags: row.tags,
        requiredCredentials: row.requiredCredentials,
        state: row.state as WorkspaceTemplate['state'],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        isStarred: row.isStarred ?? false,
        isSuperUser: effectiveSuperUser,
        // Legacy fields for backward compatibility
        userId,
        description: (row.details as any)?.tagline ?? null,
        author: row.creator?.name ?? 'Unknown',
        authorType,
        organizationId,
        color: '#3972F6', // default color for workspace cards
        icon: 'Workflow', // default icon for workspace cards
      }
    }) ?? []

  return (
    <Templates
      initialTemplates={initialTemplates}
      currentUserId={session?.user?.id || ''}
      isSuperUser={effectiveSuperUser}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: templates.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/templates.tsx
Signals: React

```typescript
'use client'

import { useMemo, useState } from 'react'
import { Layout, Search } from 'lucide-react'
import { Button } from '@/components/emcn'
import { Input } from '@/components/ui/input'
import type { CreatorProfileDetails } from '@/app/_types/creator-profile'
import {
  TemplateCard,
  TemplateCardSkeleton,
} from '@/app/workspace/[workspaceId]/templates/components/template-card'
import { useDebounce } from '@/hooks/use-debounce'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

/**
 * Template data structure with support for both new and legacy fields
 */
export interface Template {
  /** Unique identifier for the template */
  id: string
  /** Associated workflow ID if linked to a workflow */
  workflowId: string | null
  /** Display name of the template */
  name: string
  /** Additional template details */
  details?: {
    tagline?: string
    about?: string
  } | null
  /** ID of the template creator profile */
  creatorId: string | null
  /** Creator profile information */
  creator?: {
    id: string
    name: string
    profileImageUrl?: string | null
    details?: CreatorProfileDetails | null
    referenceType: 'user' | 'organization'
    referenceId: string
    verified?: boolean
  } | null
  /** Number of views */
  views: number
  /** Number of stars */
  stars: number
  /** Approval status */
  status: 'pending' | 'approved' | 'rejected'
  /** Categorization tags */
  tags: string[]
  /** Required credential types */
  requiredCredentials: unknown
  /** Workflow state data */
  state: WorkflowState
  /** Creation timestamp */
  createdAt: Date | string
  /** Last update timestamp */
  updatedAt: Date | string
  /** Whether the current user has starred this template */
  isStarred: boolean
  /** Whether the current user is a super user */
  isSuperUser?: boolean
  /** @deprecated Legacy field - use creator.referenceId instead */
  userId?: string
  /** @deprecated Legacy field - use details.tagline instead */
  description?: string | null
  /** @deprecated Legacy field - use creator.name instead */
  author?: string
  /** @deprecated Legacy field - use creator.referenceType instead */
  authorType?: 'user' | 'organization'
  /** @deprecated Legacy field - use creator.referenceId when referenceType is 'organization' */
  organizationId?: string | null
  /** Display color for the template card */
  color?: string
  /** Display icon for the template card */
  icon?: string
}

/**
 * Props for the Templates component
 */
interface TemplatesProps {
  /** Initial list of templates to display */
  initialTemplates: Template[]
  /** Current authenticated user ID */
  currentUserId: string
  /** Whether current user has super user privileges */
  isSuperUser: boolean
}

/**
 * Templates list component displaying workflow templates
 * Supports filtering by tab (gallery/your/pending) and search
 *
 * @param props - Component props
 * @returns Templates page component
 */
export default function Templates({
  initialTemplates,
  currentUserId,
  isSuperUser,
}: TemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [activeTab, setActiveTab] = useState('gallery')
  const [templates] = useState<Template[]>(initialTemplates)
  const [loading] = useState(false)

  /**
   * Filter templates based on active tab and search query
   * Memoized to prevent unnecessary recalculations on render
   */
  const filteredTemplates = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase()

    return templates.filter((template) => {
      const tabMatch =
        activeTab === 'your'
          ? template.userId === currentUserId || template.isStarred
          : activeTab === 'gallery'
            ? template.status === 'approved'
            : template.status === 'pending'

      if (!tabMatch) return false

      if (!query) return true

      const searchableText = [
        template.name,
        template.description,
        template.details?.tagline,
        template.author,
        template.creator?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [templates, activeTab, debouncedSearchQuery, currentUserId])

  /**
   * Get empty state message based on current filters
   * Memoized to prevent unnecessary recalculations on render
   */
  const emptyState = useMemo(() => {
    if (debouncedSearchQuery) {
      return {
        title: 'No templates found',
        description: 'Try a different search term',
      }
    }

    const messages = {
      pending: {
        title: 'No pending templates',
        description: 'New submissions will appear here',
      },
      your: {
        title: 'No templates yet',
        description: 'Create or star templates to see them here',
      },
      gallery: {
        title: 'No templates available',
        description: 'Templates will appear once approved',
      },
    }

    return messages[activeTab as keyof typeof messages] || messages.gallery
  }, [debouncedSearchQuery, activeTab])

  return (
    <div className='flex h-full flex-1 flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-auto px-[24px] pt-[28px] pb-[24px]'>
          <div>
            <div className='flex items-start gap-[12px]'>
              <div className='flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#1A5070] bg-[#153347]'>
                <Layout className='h-[14px] w-[14px] text-[#33b4ff]' />
              </div>
              <h1 className='font-medium text-[18px]'>Templates</h1>
            </div>
            <p className='mt-[10px] text-[14px] text-[var(--text-tertiary)]'>
              Grab a template and start building, or make one from scratch.
            </p>
          </div>

          <div className='mt-[14px] flex items-center justify-between'>
            <div className='flex h-[32px] w-[400px] items-center gap-[6px] rounded-[8px] bg-[var(--surface-5)] px-[8px]'>
              <Search className='h-[14px] w-[14px] text-[var(--text-subtle)]' />
              <Input
                placeholder='Search'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='flex-1 border-0 bg-transparent px-0 font-medium text-[var(--text-secondary)] text-small leading-none placeholder:text-[var(--text-subtle)] focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </div>
            <div className='flex items-center gap-[8px]'>
              <Button
                variant={activeTab === 'gallery' ? 'active' : 'default'}
                className='h-[32px] rounded-[6px]'
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </Button>
              <Button
                variant={activeTab === 'your' ? 'active' : 'default'}
                className='h-[32px] rounded-[6px]'
                onClick={() => setActiveTab('your')}
              >
                Your Templates
              </Button>
              {isSuperUser && (
                <Button
                  variant={activeTab === 'pending' ? 'active' : 'default'}
                  className='h-[32px] rounded-[6px]'
                  onClick={() => setActiveTab('pending')}
                >
                  Pending
                </Button>
              )}
            </div>
          </div>

          <div className='mt-[24px] grid grid-cols-1 gap-x-[20px] gap-y-[40px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TemplateCardSkeleton key={`skeleton-${index}`} />
              ))
            ) : filteredTemplates.length === 0 ? (
              <div className='col-span-full flex h-64 items-center justify-center rounded-lg border border-muted-foreground/25 bg-muted/20'>
                <div className='text-center'>
                  <p className='font-medium text-muted-foreground text-sm'>{emptyState.title}</p>
                  <p className='mt-1 text-muted-foreground/70 text-xs'>{emptyState.description}</p>
                </div>
              </div>
            ) : (
              filteredTemplates.map((template) => {
                const author = template.author || template.creator?.name || 'Unknown'
                const authorImageUrl = template.creator?.profileImageUrl || null

                return (
                  <TemplateCard
                    key={template.id}
                    id={template.id}
                    title={template.name}
                    author={author}
                    authorImageUrl={authorImageUrl}
                    usageCount={template.views.toString()}
                    stars={template.stars}
                    state={template.state}
                    isStarred={template.isStarred}
                    isVerified={template.creator?.verified || false}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: navigation-tabs.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/components/navigation-tabs.tsx

```typescript
import { cn } from '@/lib/core/utils/cn'

interface NavigationTab {
  id: string
  label: string
  count?: number
}

interface NavigationTabsProps {
  tabs: NavigationTab[]
  activeTab?: string
  onTabClick?: (tabId: string) => void
  className?: string
}

export function NavigationTabs({ tabs, activeTab, onTabClick, className }: NavigationTabsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabClick?.(tab.id)}
          className={cn(
            'flex h-[38px] items-center gap-1 rounded-[14px] px-3 font-[440] font-sans text-muted-foreground text-sm transition-all duration-200',
            activeTab === tab.id ? 'bg-secondary' : 'bg-transparent hover:bg-secondary/50'
          )}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: template-card.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/components/template-card.tsx
Signals: React, Next.js

```typescript
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Star, User } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import { cn } from '@/lib/core/utils/cn'
import { createLogger } from '@/lib/logs/console/logger'
import { WorkflowPreview } from '@/app/workspace/[workspaceId]/w/components/workflow-preview/workflow-preview'
import { getBlock } from '@/blocks/registry'
import { useStarTemplate } from '@/hooks/queries/templates'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('TemplateCard')

interface TemplateCardProps {
  id: string
  title: string
  author: string
  authorImageUrl?: string | null
  usageCount: string
  stars?: number
  blocks?: string[]
  className?: string
  state?: WorkflowState
  isStarred?: boolean
  isVerified?: boolean
}

export function TemplateCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-[268px] w-full rounded-[8px] bg-[var(--surface-elevated)] p-[8px] transition-colors hover:bg-[var(--surface-5)]',
        className
      )}
    >
      <div className='h-[180px] w-full animate-pulse rounded-[6px] bg-gray-700' />

      <div className='mt-[14px] flex items-center justify-between'>
        <div className='h-4 w-32 animate-pulse rounded bg-gray-700' />
        <div className='flex items-center gap-[-4px]'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='h-[18px] w-[18px] animate-pulse rounded-[4px] bg-gray-700'
            />
          ))}
        </div>
      </div>

      <div className='mt-[14px] flex items-center justify-between'>
        <div className='flex items-center gap-[6px]'>
          <div className='h-[20px] w-[20px] animate-pulse rounded-full bg-gray-700' />
          <div className='h-3 w-20 animate-pulse rounded bg-gray-700' />
        </div>
        <div className='flex items-center gap-[6px]'>
          <div className='h-3 w-3 animate-pulse rounded bg-gray-700' />
          <div className='h-3 w-6 animate-pulse rounded bg-gray-700' />
          <div className='h-3 w-3 animate-pulse rounded bg-gray-700' />
          <div className='h-3 w-6 animate-pulse rounded bg-gray-700' />
        </div>
      </div>
    </div>
  )
}

const extractBlockTypesFromState = (state?: {
  blocks?: Record<string, { type: string; name?: string }>
}): string[] => {
  if (!state?.blocks) return []

  const blockTypes = Object.keys(state.blocks)
    .sort()
    .map((key) => state.blocks![key].type)
    .filter((type) => type !== 'starter')
  return [...new Set(blockTypes)]
}

const getBlockConfig = (blockType: string) => {
  const block = getBlock(blockType)
  return block
}

function normalizeWorkflowState(input?: any): WorkflowState | null {
  if (!input || !input.blocks) return null

  const normalizedBlocks: WorkflowState['blocks'] = {}
  for (const [id, raw] of Object.entries<any>(input.blocks || {})) {
    if (!raw || !raw.type) continue
    normalizedBlocks[id] = {
      id: raw.id ?? id,
      type: raw.type,
      name: raw.name ?? raw.type,
      position: raw.position ?? { x: 0, y: 0 },
      subBlocks: raw.subBlocks ?? {},
      outputs: raw.outputs ?? {},
      enabled: typeof raw.enabled === 'boolean' ? raw.enabled : true,
      horizontalHandles: raw.horizontalHandles,
      height: raw.height,
      advancedMode: raw.advancedMode,
      triggerMode: raw.triggerMode,
      data: raw.data ?? {},
      layout: raw.layout,
    }
  }

  const normalized: WorkflowState = {
    blocks: normalizedBlocks,
    edges: Array.isArray(input.edges) ? input.edges : [],
    loops: input.loops ?? {},
    parallels: input.parallels ?? {},
    lastSaved: input.lastSaved,
    lastUpdate: input.lastUpdate,
    metadata: input.metadata,
    variables: input.variables,
    isDeployed: input.isDeployed,
    deployedAt: input.deployedAt,
    deploymentStatuses: input.deploymentStatuses,
    needsRedeployment: input.needsRedeployment,
    dragStartPosition: input.dragStartPosition ?? null,
  }

  return normalized
}

function TemplateCardInner({
  id,
  title,
  author,
  authorImageUrl,
  usageCount,
  stars = 0,
  blocks = [],
  className,
  state,
  isStarred = false,
  isVerified = false,
}: TemplateCardProps) {
  const router = useRouter()
  const params = useParams()

  const { mutate: toggleStar, isPending: isStarLoading } = useStarTemplate()

  const normalizedState = useMemo(() => normalizeWorkflowState(state), [state])

  const previewRef = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!previewRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    )
    observer.observe(previewRef.current)
    return () => observer.disconnect()
  }, [])

  const blockTypes = useMemo(
    () =>
      state
        ? extractBlockTypesFromState(state)
        : blocks.filter((blockType) => blockType !== 'starter').sort(),
    [state, blocks]
  )

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isStarLoading) return

    toggleStar({
      templateId: id,
      action: isStarred ? 'remove' : 'add',
    })
  }

  const templateUrl = useMemo(() => {
    const workspaceId = params?.workspaceId as string | undefined
    if (workspaceId) {
      return `/workspace/${workspaceId}/templates/${id}`
    }
    return `/templates/${id}`
  }, [params?.workspaceId, id])

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button') || target.closest('[data-action]')) {
        return
      }

      router.push(templateUrl)
    },
    [router, templateUrl]
  )

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'w-full cursor-pointer rounded-[8px] bg-[var(--surface-elevated)] p-[8px] transition-colors hover:bg-[var(--surface-5)]',
        className
      )}
    >
      <div
        ref={previewRef}
        className='pointer-events-none h-[180px] w-full overflow-hidden rounded-[6px]'
      >
        {normalizedState && isInView ? (
          <WorkflowPreview
            workflowState={normalizedState}
            showSubBlocks={false}
            height={180}
            width='100%'
            isPannable={false}
            defaultZoom={0.8}
            fitPadding={0.2}
            lightweight
            cursorStyle='pointer'
          />
        ) : (
          <div className='h-full w-full bg-[#2A2A2A]' />
        )}
      </div>

      <div className='mt-[10px] flex items-center justify-between'>
        <h3 className='truncate pr-[8px] pl-[2px] font-medium text-[16px] text-white'>{title}</h3>

        <div className='flex flex-shrink-0'>
          {blockTypes.length > 4 ? (
            <>
              {blockTypes.slice(0, 3).map((blockType, index) => {
                const blockConfig = getBlockConfig(blockType)
                if (!blockConfig) return null

                return (
                  <div
                    key={index}
                    className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[4px]'
                    style={{
                      background: blockConfig.bgColor || 'gray',
                      marginLeft: index > 0 ? '-4px' : '0',
                    }}
                  >
                    <blockConfig.icon className='h-[10px] w-[10px] text-white' />
                  </div>
                )
              })}
              <div
                className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[4px] bg-[var(--surface-14)]'
                style={{ marginLeft: '-4px' }}
              >
                <span className='font-medium text-[10px] text-white'>+{blockTypes.length - 3}</span>
              </div>
            </>
          ) : (
            blockTypes.map((blockType, index) => {
              const blockConfig = getBlockConfig(blockType)
              if (!blockConfig) return null

              return (
                <div
                  key={index}
                  className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[4px]'
                  style={{
                    background: blockConfig.bgColor || 'gray',
                    marginLeft: index > 0 ? '-4px' : '0',
                  }}
                >
                  <blockConfig.icon className='h-[10px] w-[10px] text-white' />
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className='mt-[10px] flex items-center justify-between'>
        <div className='flex min-w-0 flex-1 items-center gap-[6px]'>
          {authorImageUrl ? (
            <div className='h-[20px] w-[20px] flex-shrink-0 overflow-hidden rounded-full'>
              <img src={authorImageUrl} alt={author} className='h-full w-full object-cover' />
            </div>
          ) : (
            <div className='flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-14)]'>
              <User className='h-[12px] w-[12px] text-[#888888]' />
            </div>
          )}
          <div className='flex min-w-0 items-center gap-[4px]'>
            <span className='truncate font-medium text-[#888888] text-[12px]'>{author}</span>
            {isVerified && <VerifiedBadge size='sm' />}
          </div>
        </div>

        <div className='flex flex-shrink-0 items-center gap-[6px] font-medium text-[#888888] text-[12px]'>
          <User className='h-[12px] w-[12px]' />
          <span>{usageCount}</span>
          <Star
            onClick={handleStarClick}
            className={cn(
              'h-[12px] w-[12px] cursor-pointer transition-colors',
              isStarred ? 'fill-yellow-500 text-yellow-500' : 'text-[#888888]',
              isStarLoading && 'opacity-50'
            )}
          />
          <span>{stars}</span>
        </div>
      </div>
    </div>
  )
}

export const TemplateCard = memo(TemplateCardInner)
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/templates/[id]/page.tsx
Signals: Next.js

```typescript
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { verifyWorkspaceMembership } from '@/app/api/workflows/utils'
import TemplateDetails from '@/app/templates/[id]/template'

interface TemplatePageProps {
  params: Promise<{
    workspaceId: string
    id: string
  }>
}

/**
 * Workspace-scoped template detail page.
 * Requires authentication and workspace membership to access.
 * Uses the shared TemplateDetails component with workspace context.
 */
export default async function TemplatePage({ params }: TemplatePageProps) {
  const { workspaceId, id } = await params
  const session = await getSession()

  // Redirect unauthenticated users to public template detail page
  if (!session?.user?.id) {
    redirect(`/templates/${id}`)
  }

  // Verify workspace membership
  const hasPermission = await verifyWorkspaceMembership(session.user.id, workspaceId)
  if (!hasPermission) {
    redirect('/')
  }

  return <TemplateDetails isWorkspaceContext={true} />
}
```

--------------------------------------------------------------------------------

````
