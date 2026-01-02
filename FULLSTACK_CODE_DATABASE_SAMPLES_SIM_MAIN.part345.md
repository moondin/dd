---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 345
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 345 of 933)

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
Location: sim-main/apps/sim/app/resume/[workflowId]/[executionId]/[contextId]/page.tsx
Signals: Next.js

```typescript
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface PageParams {
  workflowId: string
  executionId: string
  contextId: string
}

export default async function ResumePage({ params }: { params: Promise<PageParams> }) {
  const { workflowId, executionId, contextId } = await params
  redirect(`/resume/${workflowId}/${executionId}?contextId=${contextId}`)
}
```

--------------------------------------------------------------------------------

---[FILE: layout-client.tsx]---
Location: sim-main/apps/sim/app/templates/layout-client.tsx

```typescript
'use client'

import { Tooltip } from '@/components/emcn'
import { season } from '@/app/_styles/fonts/season/season'

export default function TemplatesLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={600} skipDelayDuration={0}>
      <div className={`${season.variable} flex min-h-screen flex-col font-season`}>{children}</div>
    </Tooltip.Provider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/templates/layout.tsx

```typescript
import TemplatesLayoutClient from '@/app/templates/layout-client'

/**
 * Templates layout - server component wrapper for client layout.
 * Redirect logic is handled by individual pages to preserve paths.
 */
export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <TemplatesLayoutClient>{children}</TemplatesLayoutClient>
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/templates/page.tsx
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { permissions, templateCreators, templates, workspace } from '@sim/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import type { Template } from '@/app/templates/templates'
import Templates from '@/app/templates/templates'

/**
 * Public templates list page.
 * Redirects authenticated users to their workspace-scoped templates page.
 * Allows unauthenticated users to view templates for SEO and discovery.
 */
export default async function TemplatesPage() {
  const session = await getSession()

  // Authenticated users: redirect to workspace-scoped templates
  if (session?.user?.id) {
    const userWorkspaces = await db
      .select({
        workspace: workspace,
      })
      .from(permissions)
      .innerJoin(workspace, eq(permissions.entityId, workspace.id))
      .where(and(eq(permissions.userId, session.user.id), eq(permissions.entityType, 'workspace')))
      .orderBy(desc(workspace.createdAt))
      .limit(1)

    if (userWorkspaces.length > 0) {
      const firstWorkspace = userWorkspaces[0].workspace
      redirect(`/workspace/${firstWorkspace.id}/templates`)
    }
  }

  // Unauthenticated users: show public templates
  const templatesData = await db
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
    .then((rows) => rows.map((row) => ({ ...row, isStarred: false })))

  return (
    <Templates
      initialTemplates={templatesData as unknown as Template[]}
      currentUserId={null}
      isSuperUser={false}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: templates.tsx]---
Location: sim-main/apps/sim/app/templates/templates.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Layout, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/emcn'
import { Input } from '@/components/ui/input'
import { createLogger } from '@/lib/logs/console/logger'
import type { CredentialRequirement } from '@/lib/workflows/credentials/credential-extractor'
import type { CreatorProfileDetails } from '@/app/_types/creator-profile'
import { TemplateCard, TemplateCardSkeleton } from '@/app/templates/components/template-card'
import { useDebounce } from '@/hooks/use-debounce'
import type { WorkflowState } from '@/stores/workflows/workflow/types'

const logger = createLogger('TemplatesPage')

export interface Template {
  id: string
  workflowId: string | null
  name: string
  details?: {
    tagline?: string
    about?: string
  } | null
  creatorId: string | null
  creator?: {
    id: string
    name: string
    profileImageUrl?: string | null
    details?: CreatorProfileDetails | null
    referenceType: 'user' | 'organization'
    referenceId: string
    verified?: boolean
  } | null
  views: number
  stars: number
  status: 'pending' | 'approved' | 'rejected'
  tags: string[]
  requiredCredentials: CredentialRequirement[]
  state: WorkflowState
  createdAt: Date | string
  updatedAt: Date | string
  isStarred: boolean
  isSuperUser?: boolean
}

interface TemplatesProps {
  initialTemplates: Template[]
  currentUserId: string | null
  isSuperUser: boolean
}

export default function Templates({
  initialTemplates,
  currentUserId,
  isSuperUser,
}: TemplatesProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [activeTab, setActiveTab] = useState('gallery')
  const [templates, setTemplates] = useState<Template[]>(initialTemplates)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUserId) {
      const redirectToWorkspace = async () => {
        try {
          const response = await fetch('/api/workspaces')
          if (response.ok) {
            const data = await response.json()
            const defaultWorkspace = data.workspaces?.[0]
            if (defaultWorkspace) {
              router.push(`/workspace/${defaultWorkspace.id}/templates`)
            }
          }
        } catch (error) {
          logger.error('Error redirecting to workspace:', error)
        }
      }
      redirectToWorkspace()
    }
  }, [currentUserId, router])

  /**
   * Filter templates based on active tab and search query
   * Memoized to prevent unnecessary recalculations on render
   */
  const filteredTemplates = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase()

    return templates.filter((template) => {
      const tabMatch =
        activeTab === 'gallery' ? template.status === 'approved' : template.status === 'pending'

      if (!tabMatch) return false

      if (!query) return true

      const searchableText = [template.name, template.details?.tagline, template.creator?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [templates, activeTab, debouncedSearchQuery])

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
      gallery: {
        title: 'No templates available',
        description: 'Templates will appear once approved',
      },
    }

    return messages[activeTab as keyof typeof messages] || messages.gallery
  }, [debouncedSearchQuery, activeTab])

  return (
    <div className='flex h-[100vh] flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        <div className='flex flex-1 flex-col overflow-auto px-[24px] pt-[28px] pb-[24px]'>
          <div>
            <div className='flex items-start gap-[12px]'>
              <div className='flex h-[26px] w-[26px] items-center justify-center rounded-[6px] border border-[#1E3A5A] bg-[#0F2A3D]'>
                <Layout className='h-[14px] w-[14px] text-[#60A5FA]' />
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
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  id={template.id}
                  title={template.name}
                  author={template.creator?.name || 'Unknown'}
                  authorImageUrl={template.creator?.profileImageUrl || null}
                  usageCount={template.views.toString()}
                  stars={template.stars}
                  state={template.state}
                  isStarred={template.isStarred}
                  isVerified={template.creator?.verified || false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: template-card.tsx]---
Location: sim-main/apps/sim/app/templates/components/template-card.tsx
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
    <div className={cn('h-[268px] w-full rounded-[8px] bg-[#202020] p-[8px]', className)}>
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
      className={cn('w-full cursor-pointer rounded-[8px] bg-[#202020] p-[8px]', className)}
    >
      <div
        ref={previewRef}
        className='pointer-events-none h-[180px] w-full cursor-pointer overflow-hidden rounded-[6px]'
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
                className='flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[4px] bg-[#4A4A4A]'
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
        <div className='flex min-w-0 items-center gap-[8px]'>
          {authorImageUrl ? (
            <div className='h-[20px] w-[20px] flex-shrink-0 overflow-hidden rounded-full'>
              <img src={authorImageUrl} alt={author} className='h-full w-full object-cover' />
            </div>
          ) : (
            <div className='flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[#4A4A4A]'>
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

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/templates/[id]/layout.tsx
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { permissions, workspace } from '@sim/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface TemplateLayoutProps {
  children: React.ReactNode
  params: Promise<{
    id: string
  }>
}

/**
 * Template detail layout (public scope).
 * - If user is authenticated, redirect to workspace-scoped template detail.
 * - Otherwise render the public template detail children.
 */
export default async function TemplateDetailLayout({ children, params }: TemplateLayoutProps) {
  const { id } = await params
  const session = await getSession()

  if (session?.user?.id) {
    const userWorkspaces = await db
      .select({
        workspace: workspace,
      })
      .from(permissions)
      .innerJoin(workspace, eq(permissions.entityId, workspace.id))
      .where(and(eq(permissions.userId, session.user.id), eq(permissions.entityType, 'workspace')))
      .orderBy(desc(workspace.createdAt))
      .limit(1)

    if (userWorkspaces.length > 0) {
      const firstWorkspace = userWorkspaces[0].workspace
      redirect(`/workspace/${firstWorkspace.id}/templates/${id}`)
    }
  }

  return children
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/templates/[id]/page.tsx

```typescript
import TemplateDetails from '@/app/templates/[id]/template'

/**
 * Public template detail page for unauthenticated users.
 * Authenticated-user redirect is handled in templates/[id]/layout.tsx.
 */
export default function TemplatePage() {
  return <TemplateDetails />
}
```

--------------------------------------------------------------------------------

````
