---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 606
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 606 of 933)

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

---[FILE: duplicate.ts]---
Location: sim-main/apps/sim/lib/workspaces/duplicate.ts

```typescript
import { db } from '@sim/db'
import { permissions, workflow, workflowFolder, workspace as workspaceTable } from '@sim/db/schema'
import { eq } from 'drizzle-orm'
import { createLogger } from '@/lib/logs/console/logger'
import { duplicateWorkflow } from '@/lib/workflows/persistence/duplicate'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('WorkspaceDuplicate')

interface DuplicateWorkspaceOptions {
  sourceWorkspaceId: string
  userId: string
  name: string
  requestId?: string
}

interface DuplicateWorkspaceResult {
  id: string
  name: string
  ownerId: string
  workflowsCount: number
  foldersCount: number
}

/**
 * Duplicate a workspace with all its workflows
 * This creates a new workspace and duplicates all workflows from the source workspace
 */
export async function duplicateWorkspace(
  options: DuplicateWorkspaceOptions
): Promise<DuplicateWorkspaceResult> {
  const { sourceWorkspaceId, userId, name, requestId = 'unknown' } = options

  // Generate new workspace ID
  const newWorkspaceId = crypto.randomUUID()
  const now = new Date()

  // Verify the source workspace exists and user has permission
  const sourceWorkspace = await db
    .select()
    .from(workspaceTable)
    .where(eq(workspaceTable.id, sourceWorkspaceId))
    .limit(1)
    .then((rows) => rows[0])

  if (!sourceWorkspace) {
    throw new Error('Source workspace not found')
  }

  // Check if user has permission to access the source workspace
  const userPermission = await getUserEntityPermissions(userId, 'workspace', sourceWorkspaceId)
  if (!userPermission) {
    throw new Error('Source workspace not found or access denied')
  }

  // Create new workspace with admin permission in a transaction
  await db.transaction(async (tx) => {
    // Create the new workspace
    await tx.insert(workspaceTable).values({
      id: newWorkspaceId,
      name,
      ownerId: userId,
      billedAccountUserId: userId,
      allowPersonalApiKeys: sourceWorkspace.allowPersonalApiKeys,
      createdAt: now,
      updatedAt: now,
    })

    // Grant admin permission to the user on the new workspace
    await tx.insert(permissions).values({
      id: crypto.randomUUID(),
      userId,
      entityType: 'workspace',
      entityId: newWorkspaceId,
      permissionType: 'admin',
      createdAt: now,
      updatedAt: now,
    })
  })

  // Get all folders from the source workspace
  const sourceFolders = await db
    .select()
    .from(workflowFolder)
    .where(eq(workflowFolder.workspaceId, sourceWorkspaceId))

  // Create folder ID mapping
  const folderIdMap = new Map<string, string>()

  // Duplicate folders (need to maintain hierarchy)
  const foldersByParent = new Map<string | null, typeof sourceFolders>()
  for (const folder of sourceFolders) {
    const parentKey = folder.parentId
    if (!foldersByParent.has(parentKey)) {
      foldersByParent.set(parentKey, [])
    }
    foldersByParent.get(parentKey)!.push(folder)
  }

  // Recursive function to duplicate folders in correct order
  const duplicateFolderHierarchy = async (parentId: string | null) => {
    const foldersAtLevel = foldersByParent.get(parentId) || []

    for (const sourceFolder of foldersAtLevel) {
      const newFolderId = crypto.randomUUID()
      folderIdMap.set(sourceFolder.id, newFolderId)

      await db.insert(workflowFolder).values({
        id: newFolderId,
        userId,
        workspaceId: newWorkspaceId,
        name: sourceFolder.name,
        color: sourceFolder.color,
        parentId: parentId ? folderIdMap.get(parentId) || null : null,
        sortOrder: sourceFolder.sortOrder,
        isExpanded: false,
        createdAt: now,
        updatedAt: now,
      })

      // Recursively duplicate child folders
      await duplicateFolderHierarchy(sourceFolder.id)
    }
  }

  // Start duplication from root level (parentId = null)
  await duplicateFolderHierarchy(null)

  // Get all workflows from the source workspace
  const sourceWorkflows = await db
    .select()
    .from(workflow)
    .where(eq(workflow.workspaceId, sourceWorkspaceId))

  // Duplicate each workflow with mapped folder IDs
  let workflowsCount = 0
  for (const sourceWorkflow of sourceWorkflows) {
    try {
      const newFolderId = sourceWorkflow.folderId
        ? folderIdMap.get(sourceWorkflow.folderId) || null
        : null

      await duplicateWorkflow({
        sourceWorkflowId: sourceWorkflow.id,
        userId,
        name: sourceWorkflow.name,
        description: sourceWorkflow.description || undefined,
        color: sourceWorkflow.color || undefined,
        workspaceId: newWorkspaceId,
        folderId: newFolderId,
        requestId,
      })
      workflowsCount++
    } catch (error) {
      logger.error(`Failed to duplicate workflow ${sourceWorkflow.id}:`, error)
      // Continue with other workflows even if one fails
    }
  }

  return {
    id: newWorkspaceId,
    name,
    ownerId: userId,
    workflowsCount,
    foldersCount: folderIdMap.size,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: naming.ts]---
Location: sim-main/apps/sim/lib/workspaces/naming.ts

```typescript
/**
 * Utility functions for generating names for workspaces and folders
 */

import type { Workspace } from '@/lib/workspaces/organization/types'
import type { WorkflowFolder } from '@/stores/folders/store'

export interface NameableEntity {
  name: string
}

interface WorkspacesApiResponse {
  workspaces: Workspace[]
}

interface FoldersApiResponse {
  folders: WorkflowFolder[]
}

/**
 * Generates the next incremental name for entities following pattern: "{prefix} {number}"
 *
 * @param existingEntities - Array of entities with name property
 * @param prefix - Prefix for the name (e.g., "Workspace", "Folder", "Subfolder")
 * @returns Next available name (e.g., "Workspace 3")
 */
export function generateIncrementalName<T extends NameableEntity>(
  existingEntities: T[],
  prefix: string
): string {
  // Create regex pattern for the prefix (e.g., /^Workspace (\d+)$/)
  const pattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (\\d+)$`)

  // Extract numbers from existing entities that match the pattern
  const existingNumbers = existingEntities
    .map((entity) => entity.name.match(pattern))
    .filter((match) => match !== null)
    .map((match) => Number.parseInt(match![1], 10))

  // Find next available number (highest + 1, or 1 if none exist)
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1

  return `${prefix} ${nextNumber}`
}

/**
 * Generates the next workspace name
 */
export async function generateWorkspaceName(): Promise<string> {
  const response = await fetch('/api/workspaces')
  const data = (await response.json()) as WorkspacesApiResponse
  const workspaces = data.workspaces || []

  return generateIncrementalName(workspaces, 'Workspace')
}

/**
 * Generates the next folder name for a workspace
 */
export async function generateFolderName(workspaceId: string): Promise<string> {
  const response = await fetch(`/api/folders?workspaceId=${workspaceId}`)
  const data = (await response.json()) as FoldersApiResponse
  const folders = data.folders || []

  // Filter to only root-level folders (parentId is null)
  const rootFolders = folders.filter((folder) => folder.parentId === null)

  return generateIncrementalName(rootFolders, 'Folder')
}

/**
 * Generates the next subfolder name for a parent folder
 */
export async function generateSubfolderName(
  workspaceId: string,
  parentFolderId: string
): Promise<string> {
  const response = await fetch(`/api/folders?workspaceId=${workspaceId}`)
  const data = (await response.json()) as FoldersApiResponse
  const folders = data.folders || []

  // Filter to only subfolders of the specified parent
  const subfolders = folders.filter((folder) => folder.parentId === parentFolderId)

  return generateIncrementalName(subfolders, 'Subfolder')
}
```

--------------------------------------------------------------------------------

---[FILE: presence-colors.ts]---
Location: sim-main/apps/sim/lib/workspaces/presence-colors.ts

```typescript
const APP_COLORS = [
  { from: '#4F46E5', to: '#7C3AED' }, // indigo to purple
  { from: '#7C3AED', to: '#C026D3' }, // purple to fuchsia
  { from: '#EC4899', to: '#F97316' }, // pink to orange
  { from: '#14B8A6', to: '#10B981' }, // teal to emerald
  { from: '#6366F1', to: '#8B5CF6' }, // indigo to violet
  { from: '#F59E0B', to: '#F97316' }, // amber to orange
]

interface PresenceColorPalette {
  gradient: string
  accentColor: string
  baseColor: string
}

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

function hashIdentifier(identifier: string | number): number {
  if (typeof identifier === 'number' && Number.isFinite(identifier)) {
    return Math.abs(Math.trunc(identifier))
  }

  if (typeof identifier === 'string') {
    return Math.abs(Array.from(identifier).reduce((acc, char) => acc + char.charCodeAt(0), 0))
  }

  return 0
}

function withAlpha(hexColor: string, alpha: number): string {
  if (!HEX_COLOR_REGEX.test(hexColor)) {
    return hexColor
  }

  const normalized = hexColor.slice(1)
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized

  const r = Number.parseInt(expanded.slice(0, 2), 16)
  const g = Number.parseInt(expanded.slice(2, 4), 16)
  const b = Number.parseInt(expanded.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${Math.min(Math.max(alpha, 0), 1)})`
}

function buildGradient(fromColor: string, toColor: string, rotationSeed: number): string {
  const rotation = (rotationSeed * 25) % 360
  return `linear-gradient(${rotation}deg, ${fromColor}, ${toColor})`
}

export function getPresenceColors(
  identifier: string | number,
  explicitColor?: string
): PresenceColorPalette {
  const paletteIndex = hashIdentifier(identifier)

  if (explicitColor) {
    const normalizedColor = explicitColor.trim()
    const lighterShade = HEX_COLOR_REGEX.test(normalizedColor)
      ? withAlpha(normalizedColor, 0.85)
      : normalizedColor

    return {
      gradient: buildGradient(lighterShade, normalizedColor, paletteIndex),
      accentColor: normalizedColor,
      baseColor: lighterShade,
    }
  }

  const colorPair = APP_COLORS[paletteIndex % APP_COLORS.length]

  return {
    gradient: buildGradient(colorPair.from, colorPair.to, paletteIndex),
    accentColor: colorPair.to,
    baseColor: colorPair.from,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/workspaces/utils.ts

```typescript
import { db } from '@sim/db'
import { workspace as workspaceTable } from '@sim/db/schema'
import { eq } from 'drizzle-orm'

interface WorkspaceBillingSettings {
  billedAccountUserId: string | null
  allowPersonalApiKeys: boolean
}

export async function getWorkspaceBillingSettings(
  workspaceId: string
): Promise<WorkspaceBillingSettings | null> {
  if (!workspaceId) {
    return null
  }

  const rows = await db
    .select({
      billedAccountUserId: workspaceTable.billedAccountUserId,
      allowPersonalApiKeys: workspaceTable.allowPersonalApiKeys,
    })
    .from(workspaceTable)
    .where(eq(workspaceTable.id, workspaceId))
    .limit(1)

  if (!rows.length) {
    return null
  }

  return {
    billedAccountUserId: rows[0].billedAccountUserId ?? null,
    allowPersonalApiKeys: rows[0].allowPersonalApiKeys ?? false,
  }
}

export async function getWorkspaceBilledAccountUserId(workspaceId: string): Promise<string | null> {
  const settings = await getWorkspaceBillingSettings(workspaceId)
  return settings?.billedAccountUserId ?? null
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/lib/workspaces/organization/index.ts

```typescript
// Export types
export type {
  Invitation,
  Member,
  MemberUsageData,
  Organization,
  OrganizationBillingData,
  OrganizationFormData,
  Subscription,
  User,
  Workspace,
  WorkspaceInvitation,
} from '@/lib/workspaces/organization/types'
// Export utility functions
export {
  calculateSeatUsage,
  generateSlug,
  getUsedSeats,
  getUserRole,
  isAdminOrOwner,
  validateEmail,
  validateSlug,
} from '@/lib/workspaces/organization/utils'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: sim-main/apps/sim/lib/workspaces/organization/types.ts

```typescript
export interface User {
  name?: string
  email?: string
  id?: string
  image?: string | null
}

export interface Member {
  id: string
  role: string
  user?: User
}

export interface Invitation {
  id: string
  email: string
  status: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string | null
  members?: Member[]
  invitations?: Invitation[]
  createdAt: string | Date
  [key: string]: unknown
}

export interface Subscription {
  id: string
  plan: string
  status: string
  seats?: number
  referenceId: string
  cancelAtPeriodEnd?: boolean
  periodEnd?: number | Date
  trialEnd?: number | Date
  metadata?: any
  [key: string]: unknown
}

export interface WorkspaceInvitation {
  workspaceId: string
  permission: string
}

export interface Workspace {
  id: string
  name: string
  ownerId: string
  isOwner: boolean
  canInvite: boolean
}

export interface OrganizationFormData {
  name: string
  slug: string
  logo: string
}

export interface MemberUsageData {
  userId: string
  userName: string
  userEmail: string
  currentUsage: number
  usageLimit: number
  percentUsed: number
  isOverLimit: boolean
  role: string
  joinedAt: string
  lastActive: string | null
}

export interface OrganizationBillingData {
  organizationId: string
  organizationName: string
  subscriptionPlan: string
  subscriptionStatus: string
  totalSeats: number
  usedSeats: number
  seatsCount: number
  totalCurrentUsage: number
  totalUsageLimit: number
  minimumBillingAmount: number
  averageUsagePerMember: number
  billingPeriodStart: string | null
  billingPeriodEnd: string | null
  members?: MemberUsageData[]
  userRole?: string
  billingBlocked?: boolean
}

export interface OrganizationState {
  // Core organization data
  organizations: Organization[]
  activeOrganization: Organization | null

  // Team management
  subscriptionData: Subscription | null
  userWorkspaces: Workspace[]

  // Organization billing and usage
  organizationBillingData: OrganizationBillingData | null

  // Organization settings
  orgFormData: OrganizationFormData

  // Loading states
  isLoading: boolean
  isLoadingSubscription: boolean
  isLoadingOrgBilling: boolean
  isCreatingOrg: boolean
  isInviting: boolean
  isSavingOrgSettings: boolean

  // Error states
  error: string | null
  orgSettingsError: string | null

  // Success states
  inviteSuccess: boolean
  orgSettingsSuccess: string | null

  // Cache timestamps
  lastFetched: number | null
  lastSubscriptionFetched: number | null
  lastOrgBillingFetched: number | null

  // User permissions
  hasTeamPlan: boolean
  hasEnterprisePlan: boolean
}

export interface OrganizationStore extends OrganizationState {
  loadData: () => Promise<void>
  loadOrganizationSubscription: (orgId: string) => Promise<void>
  loadOrganizationBillingData: (organizationId: string, force?: boolean) => Promise<void>
  loadUserWorkspaces: (userId?: string) => Promise<void>
  refreshOrganization: () => Promise<void>

  // Organization management
  createOrganization: (name: string, slug: string) => Promise<void>
  setActiveOrganization: (orgId: string) => Promise<void>
  updateOrganizationSettings: () => Promise<void>

  // Team management
  inviteMember: (email: string, workspaceInvitations?: WorkspaceInvitation[]) => Promise<void>
  removeMember: (memberId: string, shouldReduceSeats?: boolean) => Promise<void>
  cancelInvitation: (invitationId: string) => Promise<void>

  // Seat management
  addSeats: (newSeatCount: number) => Promise<void>
  reduceSeats: (newSeatCount: number) => Promise<void>

  transferSubscriptionToOrganization: (orgId: string) => Promise<void>

  getUserRole: (userEmail?: string) => string
  isAdminOrOwner: (userEmail?: string) => boolean
  getUsedSeats: () => { used: number; members: number; pending: number }

  setOrgFormData: (data: Partial<OrganizationFormData>) => void

  clearError: () => void
  clearSuccessMessages: () => void
}
```

--------------------------------------------------------------------------------

---[FILE: utils.ts]---
Location: sim-main/apps/sim/lib/workspaces/organization/utils.ts

```typescript
/**
 * Utility functions for organization-related operations
 * These are pure functions that compute values from organization data
 */

import { quickValidateEmail } from '@/lib/messaging/email/validation'
import type { Organization } from '@/lib/workspaces/organization/types'

/**
 * Get the role of a user in an organization
 */
export function getUserRole(
  organization: Organization | null | undefined,
  userEmail?: string
): string {
  if (!userEmail || !organization?.members) {
    return 'member'
  }
  const currentMember = organization.members.find((m) => m.user?.email === userEmail)
  return currentMember?.role ?? 'member'
}

/**
 * Check if a user is an admin or owner in an organization
 */
export function isAdminOrOwner(
  organization: Organization | null | undefined,
  userEmail?: string
): boolean {
  const role = getUserRole(organization, userEmail)
  return role === 'owner' || role === 'admin'
}

/**
 * Calculate seat usage for an organization
 */
export function calculateSeatUsage(organization: Organization | null | undefined): {
  used: number
  members: number
  pending: number
} {
  if (!organization) {
    return { used: 0, members: 0, pending: 0 }
  }

  const membersCount = organization.members?.length || 0
  const pendingInvitationsCount =
    organization.invitations?.filter((inv) => inv.status === 'pending').length || 0

  return {
    used: membersCount + pendingInvitationsCount,
    members: membersCount,
    pending: pendingInvitationsCount,
  }
}

/**
 * Get used seats from an organization
 * Alias for calculateSeatUsage
 */
export function getUsedSeats(organization: Organization | null | undefined) {
  return calculateSeatUsage(organization)
}

/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
}

/**
 * Validate organization slug format
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-_]+$/
  return slugRegex.test(slug)
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  return quickValidateEmail(email.trim().toLowerCase()).isValid
}
```

--------------------------------------------------------------------------------

---[FILE: utils.test.ts]---
Location: sim-main/apps/sim/lib/workspaces/permissions/utils.test.ts

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@sim/db', () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    innerJoin: vi.fn(),
    leftJoin: vi.fn(),
    orderBy: vi.fn(),
  },
}))

vi.mock('@sim/db/schema', () => ({
  permissions: {
    permissionType: 'permission_type',
    userId: 'user_id',
    entityType: 'entity_type',
    entityId: 'entity_id',
    id: 'permission_id',
  },
  permissionTypeEnum: {
    enumValues: ['admin', 'write', 'read'] as const,
  },
  user: {
    id: 'user_id',
    email: 'user_email',
    name: 'user_name',
  },
  workspace: {
    id: 'workspace_id',
    name: 'workspace_name',
    ownerId: 'workspace_owner_id',
  },
}))

vi.mock('drizzle-orm', () => ({
  and: vi.fn().mockReturnValue('and-condition'),
  eq: vi.fn().mockReturnValue('eq-condition'),
  or: vi.fn().mockReturnValue('or-condition'),
}))

import { db } from '@sim/db'
import {
  getManageableWorkspaces,
  getUserEntityPermissions,
  getUsersWithPermissions,
  hasAdminPermission,
  hasWorkspaceAdminAccess,
} from '@/lib/workspaces/permissions/utils'

const mockDb = db as any
type PermissionType = 'admin' | 'write' | 'read'

function createMockChain(finalResult: any) {
  const chain: any = {}

  chain.then = vi.fn().mockImplementation((resolve: any) => resolve(finalResult))
  chain.select = vi.fn().mockReturnValue(chain)
  chain.from = vi.fn().mockReturnValue(chain)
  chain.where = vi.fn().mockReturnValue(chain)
  chain.limit = vi.fn().mockReturnValue(chain)
  chain.innerJoin = vi.fn().mockReturnValue(chain)
  chain.orderBy = vi.fn().mockReturnValue(chain)

  return chain
}

describe('Permission Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserEntityPermissions', () => {
    it('should return null when user has no permissions', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workspace', 'workspace456')

      expect(result).toBeNull()
    })

    it('should return the highest permission when user has multiple permissions', async () => {
      const mockResults = [
        { permissionType: 'read' as PermissionType },
        { permissionType: 'admin' as PermissionType },
        { permissionType: 'write' as PermissionType },
      ]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workspace', 'workspace456')

      expect(result).toBe('admin')
    })

    it('should return single permission when user has only one', async () => {
      const mockResults = [{ permissionType: 'read' as PermissionType }]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workflow', 'workflow789')

      expect(result).toBe('read')
    })

    it('should prioritize admin over other permissions', async () => {
      const mockResults = [
        { permissionType: 'write' as PermissionType },
        { permissionType: 'admin' as PermissionType },
        { permissionType: 'read' as PermissionType },
      ]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user999', 'workspace', 'workspace999')

      expect(result).toBe('admin')
    })

    it('should return write permission when user only has write access', async () => {
      const mockResults = [{ permissionType: 'write' as PermissionType }]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workspace', 'workspace456')

      expect(result).toBe('write')
    })

    it('should prioritize write over read permissions', async () => {
      const mockResults = [
        { permissionType: 'read' as PermissionType },
        { permissionType: 'write' as PermissionType },
      ]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workspace', 'workspace456')

      expect(result).toBe('write')
    })

    it('should work with workflow entity type', async () => {
      const mockResults = [{ permissionType: 'admin' as PermissionType }]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workflow', 'workflow789')

      expect(result).toBe('admin')
    })

    it('should work with organization entity type', async () => {
      const mockResults = [{ permissionType: 'read' as PermissionType }]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'organization', 'org456')

      expect(result).toBe('read')
    })

    it('should handle generic entity types', async () => {
      const mockResults = [{ permissionType: 'write' as PermissionType }]
      const chain = createMockChain(mockResults)
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'custom_entity', 'entity123')

      expect(result).toBe('write')
    })
  })

  describe('hasAdminPermission', () => {
    it('should return true when user has admin permission for workspace', async () => {
      const chain = createMockChain([{ id: 'perm1' }])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('admin-user', 'workspace123')

      expect(result).toBe(true)
    })

    it('should return false when user has no admin permission for workspace', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('regular-user', 'workspace123')

      expect(result).toBe(false)
    })

    it('should return false when user has write permission but not admin', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('write-user', 'workspace123')

      expect(result).toBe(false)
    })

    it('should return false when user has read permission but not admin', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('read-user', 'workspace123')

      expect(result).toBe(false)
    })

    it('should handle non-existent workspace', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('user123', 'non-existent-workspace')

      expect(result).toBe(false)
    })

    it('should handle empty user ID', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasAdminPermission('', 'workspace123')

      expect(result).toBe(false)
    })
  })

  describe('getUsersWithPermissions', () => {
    it('should return empty array when no users have permissions for workspace', async () => {
      const usersChain = createMockChain([])
      mockDb.select.mockReturnValue(usersChain)

      const result = await getUsersWithPermissions('workspace123')

      expect(result).toEqual([])
    })

    it('should return users with their permissions for workspace', async () => {
      const mockUsersResults = [
        {
          userId: 'user1',
          email: 'alice@example.com',
          name: 'Alice Smith',
          permissionType: 'admin' as PermissionType,
        },
      ]

      const usersChain = createMockChain(mockUsersResults)
      mockDb.select.mockReturnValue(usersChain)

      const result = await getUsersWithPermissions('workspace456')

      expect(result).toEqual([
        {
          userId: 'user1',
          email: 'alice@example.com',
          name: 'Alice Smith',
          permissionType: 'admin',
        },
      ])
    })

    it('should return multiple users with different permission levels', async () => {
      const mockUsersResults = [
        {
          userId: 'user1',
          email: 'admin@example.com',
          name: 'Admin User',
          permissionType: 'admin' as PermissionType,
        },
        {
          userId: 'user2',
          email: 'writer@example.com',
          name: 'Writer User',
          permissionType: 'write' as PermissionType,
        },
        {
          userId: 'user3',
          email: 'reader@example.com',
          name: 'Reader User',
          permissionType: 'read' as PermissionType,
        },
      ]

      const usersChain = createMockChain(mockUsersResults)
      mockDb.select.mockReturnValue(usersChain)

      const result = await getUsersWithPermissions('workspace456')

      expect(result).toHaveLength(3)
      expect(result[0].permissionType).toBe('admin')
      expect(result[1].permissionType).toBe('write')
      expect(result[2].permissionType).toBe('read')
    })

    it('should handle users with empty names', async () => {
      const mockUsersResults = [
        {
          userId: 'user1',
          email: 'test@example.com',
          name: '',
          permissionType: 'read' as PermissionType,
        },
      ]

      const usersChain = createMockChain(mockUsersResults)
      mockDb.select.mockReturnValue(usersChain)

      const result = await getUsersWithPermissions('workspace123')

      expect(result[0].name).toBe('')
    })
  })

  describe('hasWorkspaceAdminAccess', () => {
    it('should return true when user owns the workspace', async () => {
      const chain = createMockChain([{ ownerId: 'user123' }])
      mockDb.select.mockReturnValue(chain)

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(true)
    })

    it('should return true when user has direct admin permission', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: 'other-user' }])
        }
        return createMockChain([{ id: 'perm1' }])
      })

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(true)
    })

    it('should return false when workspace does not exist', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(false)
    })

    it('should return false when user has no admin access', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: 'other-user' }])
        }
        return createMockChain([])
      })

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(false)
    })

    it('should return false when user has write permission but not admin', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: 'other-user' }])
        }
        return createMockChain([])
      })

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(false)
    })

    it('should return false when user has read permission but not admin', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: 'other-user' }])
        }
        return createMockChain([])
      })

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(false)
    })

    it('should handle empty workspace ID', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasWorkspaceAdminAccess('user123', '')

      expect(result).toBe(false)
    })

    it('should handle empty user ID', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await hasWorkspaceAdminAccess('', 'workspace456')

      expect(result).toBe(false)
    })
  })

  describe('Edge Cases and Security Tests', () => {
    it('should handle SQL injection attempts in user IDs', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions(
        "'; DROP TABLE users; --",
        'workspace',
        'workspace123'
      )

      expect(result).toBeNull()
    })

    it('should handle very long entity IDs', async () => {
      const longEntityId = 'a'.repeat(1000)
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', 'workspace', longEntityId)

      expect(result).toBeNull()
    })

    it('should handle unicode characters in entity names', async () => {
      const chain = createMockChain([{ permissionType: 'read' as PermissionType }])
      mockDb.select.mockReturnValue(chain)

      const result = await getUserEntityPermissions('user123', '📝workspace', '🏢org-id')

      expect(result).toBe('read')
    })

    it('should verify permission hierarchy ordering is consistent', () => {
      const permissionOrder: Record<PermissionType, number> = { admin: 3, write: 2, read: 1 }

      expect(permissionOrder.admin).toBeGreaterThan(permissionOrder.write)
      expect(permissionOrder.write).toBeGreaterThan(permissionOrder.read)
    })

    it('should handle workspace ownership checks with null owner IDs', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: null }])
        }
        return createMockChain([])
      })

      const result = await hasWorkspaceAdminAccess('user123', 'workspace456')

      expect(result).toBe(false)
    })

    it('should handle null user ID correctly when owner ID is different', async () => {
      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([{ ownerId: 'other-user' }])
        }
        return createMockChain([])
      })

      const result = await hasWorkspaceAdminAccess(null as any, 'workspace456')

      expect(result).toBe(false)
    })
  })

  describe('getManageableWorkspaces', () => {
    it('should return empty array when user has no manageable workspaces', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await getManageableWorkspaces('user123')

      expect(result).toEqual([])
    })

    it('should return owned workspaces', async () => {
      const mockWorkspaces = [
        { id: 'ws1', name: 'My Workspace 1', ownerId: 'user123' },
        { id: 'ws2', name: 'My Workspace 2', ownerId: 'user123' },
      ]

      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain(mockWorkspaces) // Owned workspaces
        }
        return createMockChain([]) // No admin workspaces
      })

      const result = await getManageableWorkspaces('user123')

      expect(result).toEqual([
        { id: 'ws1', name: 'My Workspace 1', ownerId: 'user123', accessType: 'owner' },
        { id: 'ws2', name: 'My Workspace 2', ownerId: 'user123', accessType: 'owner' },
      ])
    })

    it('should return workspaces with direct admin permissions', async () => {
      const mockAdminWorkspaces = [{ id: 'ws1', name: 'Shared Workspace', ownerId: 'other-user' }]

      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([]) // No owned workspaces
        }
        return createMockChain(mockAdminWorkspaces) // Admin workspaces
      })

      const result = await getManageableWorkspaces('user123')

      expect(result).toEqual([
        { id: 'ws1', name: 'Shared Workspace', ownerId: 'other-user', accessType: 'direct' },
      ])
    })

    it('should combine owned and admin workspaces without duplicates', async () => {
      const mockOwnedWorkspaces = [
        { id: 'ws1', name: 'My Workspace', ownerId: 'user123' },
        { id: 'ws2', name: 'Another Workspace', ownerId: 'user123' },
      ]
      const mockAdminWorkspaces = [
        { id: 'ws1', name: 'My Workspace', ownerId: 'user123' }, // Duplicate (should be filtered)
        { id: 'ws3', name: 'Shared Workspace', ownerId: 'other-user' },
      ]

      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain(mockOwnedWorkspaces) // Owned workspaces
        }
        return createMockChain(mockAdminWorkspaces) // Admin workspaces
      })

      const result = await getManageableWorkspaces('user123')

      expect(result).toHaveLength(3)
      expect(result).toEqual([
        { id: 'ws1', name: 'My Workspace', ownerId: 'user123', accessType: 'owner' },
        { id: 'ws2', name: 'Another Workspace', ownerId: 'user123', accessType: 'owner' },
        { id: 'ws3', name: 'Shared Workspace', ownerId: 'other-user', accessType: 'direct' },
      ])
    })

    it('should handle empty workspace names', async () => {
      const mockWorkspaces = [{ id: 'ws1', name: '', ownerId: 'user123' }]

      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain(mockWorkspaces)
        }
        return createMockChain([])
      })

      const result = await getManageableWorkspaces('user123')

      expect(result[0].name).toBe('')
    })

    it('should handle multiple admin permissions for same workspace', async () => {
      const mockAdminWorkspaces = [
        { id: 'ws1', name: 'Shared Workspace', ownerId: 'other-user' },
        { id: 'ws1', name: 'Shared Workspace', ownerId: 'other-user' }, // Duplicate
      ]

      let callCount = 0
      mockDb.select.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain([]) // No owned workspaces
        }
        return createMockChain(mockAdminWorkspaces) // Admin workspaces with duplicates
      })

      const result = await getManageableWorkspaces('user123')

      expect(result).toHaveLength(2) // Should include duplicates from admin permissions
    })

    it('should handle empty user ID gracefully', async () => {
      const chain = createMockChain([])
      mockDb.select.mockReturnValue(chain)

      const result = await getManageableWorkspaces('')

      expect(result).toEqual([])
    })
  })
})
```

--------------------------------------------------------------------------------

````
