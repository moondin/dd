---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 278
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 278 of 933)

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

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/folders/route.test.ts

```typescript
/**
 * Tests for folders API route
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type CapturedFolderValues,
  createMockRequest,
  createMockTransaction,
  mockAuth,
  mockLogger,
  setupCommonApiMocks,
} from '@/app/api/__test-utils__/utils'

describe('Folders API Route', () => {
  const mockFolders = [
    {
      id: 'folder-1',
      name: 'Test Folder 1',
      userId: 'user-123',
      workspaceId: 'workspace-123',
      parentId: null,
      color: '#6B7280',
      isExpanded: true,
      sortOrder: 0,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    },
    {
      id: 'folder-2',
      name: 'Test Folder 2',
      userId: 'user-123',
      workspaceId: 'workspace-123',
      parentId: 'folder-1',
      color: '#EF4444',
      isExpanded: false,
      sortOrder: 1,
      createdAt: new Date('2023-01-02T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
    },
  ]

  const { mockAuthenticatedUser, mockUnauthenticated } = mockAuth()
  const mockUUID = 'mock-uuid-12345678-90ab-cdef-1234-567890abcdef'

  const mockSelect = vi.fn()
  const mockFrom = vi.fn()
  const mockWhere = vi.fn()
  const mockOrderBy = vi.fn()
  const mockInsert = vi.fn()
  const mockValues = vi.fn()
  const mockReturning = vi.fn()
  const mockTransaction = vi.fn()
  const mockGetUserEntityPermissions = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValue(mockUUID),
    })

    setupCommonApiMocks()

    mockSelect.mockReturnValue({ from: mockFrom })
    mockFrom.mockReturnValue({ where: mockWhere })
    mockWhere.mockReturnValue({ orderBy: mockOrderBy })
    mockOrderBy.mockReturnValue(mockFolders)

    mockInsert.mockReturnValue({ values: mockValues })
    mockValues.mockReturnValue({ returning: mockReturning })
    mockReturning.mockReturnValue([mockFolders[0]])

    mockGetUserEntityPermissions.mockResolvedValue('admin')

    vi.doMock('@sim/db', () => ({
      db: {
        select: mockSelect,
        insert: mockInsert,
        transaction: mockTransaction,
      },
    }))

    vi.doMock('@/lib/workspaces/permissions/utils', () => ({
      getUserEntityPermissions: mockGetUserEntityPermissions,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/folders', () => {
    it('should return folders for a valid workspace', async () => {
      mockAuthenticatedUser()

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders?workspaceId=workspace-123',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folders')
      expect(data.folders).toHaveLength(2)
      expect(data.folders[0]).toMatchObject({
        id: 'folder-1',
        name: 'Test Folder 1',
        workspaceId: 'workspace-123',
      })
    })

    it('should return 401 for unauthenticated requests', async () => {
      mockUnauthenticated()

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders?workspaceId=workspace-123',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should return 400 when workspaceId is missing', async () => {
      mockAuthenticatedUser()

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Workspace ID is required')
    })

    it('should return 403 when user has no workspace permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue(null) // No permissions

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders?workspaceId=workspace-123',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Access denied to this workspace')
    })

    it('should return 403 when user has only read permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('read') // Read-only permissions

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders?workspaceId=workspace-123',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(200) // Should work for read permissions

      const data = await response.json()
      expect(data).toHaveProperty('folders')
    })

    it('should handle database errors gracefully', async () => {
      mockAuthenticatedUser()

      mockSelect.mockImplementationOnce(() => {
        throw new Error('Database connection failed')
      })

      const mockRequest = createMockRequest('GET')
      Object.defineProperty(mockRequest, 'url', {
        value: 'http://localhost:3000/api/folders?workspaceId=workspace-123',
      })

      const { GET } = await import('@/app/api/folders/route')
      const response = await GET(mockRequest)

      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Internal server error')
      expect(mockLogger.error).toHaveBeenCalledWith('Error fetching folders:', {
        error: expect.any(Error),
      })
    })
  })

  describe('POST /api/folders', () => {
    it('should create a new folder successfully', async () => {
      mockAuthenticatedUser()

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([]), // No existing folders
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockReturnValue([mockFolders[0]]),
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: 'New Test Folder',
        workspaceId: 'workspace-123',
        color: '#6B7280',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
      expect(data.folder).toMatchObject({
        id: 'folder-1',
        name: 'Test Folder 1',
        workspaceId: 'workspace-123',
      })
    })

    it('should create folder with correct sort order', async () => {
      mockAuthenticatedUser()

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([{ sortOrder: 5 }]), // Existing folder with sort order 5
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockReturnValue([{ ...mockFolders[0], sortOrder: 6 }]),
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: 'New Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.folder).toMatchObject({
        sortOrder: 6,
      })
    })

    it('should create subfolder with parent reference', async () => {
      mockAuthenticatedUser()

      mockTransaction.mockImplementationOnce(
        createMockTransaction({
          selectData: [], // No existing folders
          insertResult: [{ ...mockFolders[1] }],
        })
      )

      const req = createMockRequest('POST', {
        name: 'Subfolder',
        workspaceId: 'workspace-123',
        parentId: 'folder-1',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.folder).toMatchObject({
        parentId: 'folder-1',
      })
    })

    it('should return 401 for unauthenticated requests', async () => {
      mockUnauthenticated()

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should return 403 when user has only read permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('read') // Read-only permissions

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Write or Admin access required to create folders')
    })

    it('should allow folder creation for write permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('write') // Write permissions

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([]), // No existing folders
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockReturnValue([mockFolders[0]]),
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
    })

    it('should allow folder creation for admin permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('admin') // Admin permissions

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([]), // No existing folders
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockReturnValue({
              returning: vi.fn().mockReturnValue([mockFolders[0]]),
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
    })

    it('should return 400 when required fields are missing', async () => {
      const testCases = [
        { name: '', workspaceId: 'workspace-123' }, // Missing name
        { name: 'Test Folder', workspaceId: '' }, // Missing workspaceId
        { workspaceId: 'workspace-123' }, // Missing name entirely
        { name: 'Test Folder' }, // Missing workspaceId entirely
      ]

      for (const body of testCases) {
        mockAuthenticatedUser()

        const req = createMockRequest('POST', body)

        const { POST } = await import('@/app/api/folders/route')
        const response = await POST(req)

        expect(response.status).toBe(400)

        const data = await response.json()
        expect(data).toHaveProperty('error', 'Name and workspace ID are required')
      }
    })

    it('should handle database errors gracefully', async () => {
      mockAuthenticatedUser()

      // Make transaction throw an error
      mockTransaction.mockImplementationOnce(() => {
        throw new Error('Database transaction failed')
      })

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      const response = await POST(req)

      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Internal server error')
      expect(mockLogger.error).toHaveBeenCalledWith('Error creating folder:', {
        error: expect.any(Error),
      })
    })

    it('should trim folder name when creating', async () => {
      mockAuthenticatedUser()

      let capturedValues: CapturedFolderValues | null = null

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([]),
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockImplementation((values) => {
              capturedValues = values
              return {
                returning: vi.fn().mockReturnValue([mockFolders[0]]),
              }
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: '  Test Folder With Spaces  ',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      await POST(req)

      expect(capturedValues).not.toBeNull()
      expect(capturedValues!.name).toBe('Test Folder With Spaces')
    })

    it('should use default color when not provided', async () => {
      mockAuthenticatedUser()

      let capturedValues: CapturedFolderValues | null = null

      mockTransaction.mockImplementationOnce(async (callback: any) => {
        const tx = {
          select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue([]),
                }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            values: vi.fn().mockImplementation((values) => {
              capturedValues = values
              return {
                returning: vi.fn().mockReturnValue([mockFolders[0]]),
              }
            }),
          }),
        }
        return await callback(tx)
      })

      const req = createMockRequest('POST', {
        name: 'Test Folder',
        workspaceId: 'workspace-123',
      })

      const { POST } = await import('@/app/api/folders/route')
      await POST(req)

      expect(capturedValues).not.toBeNull()
      expect(capturedValues!.color).toBe('#6B7280')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/sim/app/api/folders/route.ts
Signals: Next.js

```typescript
import { db } from '@sim/db'
import { workflowFolder } from '@sim/db/schema'
import { and, asc, desc, eq, isNull } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createLogger } from '@/lib/logs/console/logger'
import { getUserEntityPermissions } from '@/lib/workspaces/permissions/utils'

const logger = createLogger('FoldersAPI')

// GET - Fetch folders for a workspace
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 })
    }

    // Check if user has workspace permissions
    const workspacePermission = await getUserEntityPermissions(
      session.user.id,
      'workspace',
      workspaceId
    )

    if (!workspacePermission) {
      return NextResponse.json({ error: 'Access denied to this workspace' }, { status: 403 })
    }

    // If user has workspace permissions, fetch ALL folders in the workspace
    // This allows shared workspace members to see folders created by other users
    const folders = await db
      .select()
      .from(workflowFolder)
      .where(eq(workflowFolder.workspaceId, workspaceId))
      .orderBy(asc(workflowFolder.sortOrder), asc(workflowFolder.createdAt))

    return NextResponse.json({ folders })
  } catch (error) {
    logger.error('Error fetching folders:', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new folder
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, workspaceId, parentId, color } = body

    if (!name || !workspaceId) {
      return NextResponse.json({ error: 'Name and workspace ID are required' }, { status: 400 })
    }

    // Check if user has workspace permissions (at least 'write' access to create folders)
    const workspacePermission = await getUserEntityPermissions(
      session.user.id,
      'workspace',
      workspaceId
    )

    if (!workspacePermission || workspacePermission === 'read') {
      return NextResponse.json(
        { error: 'Write or Admin access required to create folders' },
        { status: 403 }
      )
    }

    // Generate a new ID
    const id = crypto.randomUUID()

    // Use transaction to ensure sortOrder consistency
    const newFolder = await db.transaction(async (tx) => {
      // Get the next sort order for the parent (or root level)
      // Consider all folders in the workspace, not just those created by current user
      const existingFolders = await tx
        .select({ sortOrder: workflowFolder.sortOrder })
        .from(workflowFolder)
        .where(
          and(
            eq(workflowFolder.workspaceId, workspaceId),
            parentId ? eq(workflowFolder.parentId, parentId) : isNull(workflowFolder.parentId)
          )
        )
        .orderBy(desc(workflowFolder.sortOrder))
        .limit(1)

      const nextSortOrder = existingFolders.length > 0 ? existingFolders[0].sortOrder + 1 : 0

      // Insert the new folder within the same transaction
      const [folder] = await tx
        .insert(workflowFolder)
        .values({
          id,
          name: name.trim(),
          userId: session.user.id,
          workspaceId,
          parentId: parentId || null,
          color: color || '#6B7280',
          sortOrder: nextSortOrder,
        })
        .returning()

      return folder
    })

    logger.info('Created new folder:', { id, name, workspaceId, parentId })

    return NextResponse.json({ folder: newFolder })
  } catch (error) {
    logger.error('Error creating folder:', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.test.ts]---
Location: sim-main/apps/sim/app/api/folders/[id]/route.test.ts

```typescript
/**
 * Tests for individual folder API route (/api/folders/[id])
 *
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  type CapturedFolderValues,
  createMockRequest,
  type MockUser,
  mockAuth,
  mockLogger,
  setupCommonApiMocks,
} from '@/app/api/__test-utils__/utils'

interface FolderDbMockOptions {
  folderLookupResult?: any
  updateResult?: any[]
  throwError?: boolean
  circularCheckResults?: any[]
}

describe('Individual Folder API Route', () => {
  const TEST_USER: MockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  }

  const mockFolder = {
    id: 'folder-1',
    name: 'Test Folder',
    userId: TEST_USER.id,
    workspaceId: 'workspace-123',
    parentId: null,
    color: '#6B7280',
    sortOrder: 1,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  }

  const { mockAuthenticatedUser, mockUnauthenticated } = mockAuth(TEST_USER)
  const mockGetUserEntityPermissions = vi.fn()

  function createFolderDbMock(options: FolderDbMockOptions = {}) {
    const {
      folderLookupResult = mockFolder,
      updateResult = [{ ...mockFolder, name: 'Updated Folder' }],
      throwError = false,
      circularCheckResults = [],
    } = options

    let callCount = 0

    const mockSelect = vi.fn().mockImplementation(() => ({
      from: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          then: vi.fn().mockImplementation((callback) => {
            if (throwError) {
              throw new Error('Database error')
            }

            callCount++
            // First call: folder lookup
            if (callCount === 1) {
              // The route code does .then((rows) => rows[0])
              // So we need to return an array for folderLookupResult
              const result = folderLookupResult === undefined ? [] : [folderLookupResult]
              return Promise.resolve(callback(result))
            }
            // Subsequent calls: circular reference checks
            if (callCount > 1 && circularCheckResults.length > 0) {
              const index = callCount - 2
              const result = circularCheckResults[index] ? [circularCheckResults[index]] : []
              return Promise.resolve(callback(result))
            }
            return Promise.resolve(callback([]))
          }),
        })),
      })),
    }))

    const mockUpdate = vi.fn().mockImplementation(() => ({
      set: vi.fn().mockImplementation(() => ({
        where: vi.fn().mockImplementation(() => ({
          returning: vi.fn().mockReturnValue(updateResult),
        })),
      })),
    }))

    const mockDelete = vi.fn().mockImplementation(() => ({
      where: vi.fn().mockImplementation(() => Promise.resolve()),
    }))

    return {
      db: {
        select: mockSelect,
        update: mockUpdate,
        delete: mockDelete,
      },
      mocks: {
        select: mockSelect,
        update: mockUpdate,
        delete: mockDelete,
      },
    }
  }

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    setupCommonApiMocks()

    mockGetUserEntityPermissions.mockResolvedValue('admin')

    vi.doMock('@/lib/workspaces/permissions/utils', () => ({
      getUserEntityPermissions: mockGetUserEntityPermissions,
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('PUT /api/folders/[id]', () => {
    it('should update folder successfully', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder Name',
        color: '#FF0000',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
      expect(data.folder).toMatchObject({
        name: 'Updated Folder',
      })
    })

    it('should update parent folder successfully', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
        parentId: 'parent-folder-1',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(200)
    })

    it('should return 401 for unauthenticated requests', async () => {
      mockUnauthenticated()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should return 403 when user has only read permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('read') // Read-only permissions

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Write access required to update folders')
    })

    it('should allow folder update for write permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('write') // Write permissions

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
    })

    it('should allow folder update for admin permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('admin') // Admin permissions

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('folder')
    })

    it('should return 400 when trying to set folder as its own parent', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
        parentId: 'folder-1', // Same as the folder ID
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Folder cannot be its own parent')
    })

    it('should trim folder name when updating', async () => {
      mockAuthenticatedUser()

      let capturedUpdates: CapturedFolderValues | null = null
      const dbMock = createFolderDbMock({
        updateResult: [{ ...mockFolder, name: 'Folder With Spaces' }],
      })

      // Override the set implementation to capture updates
      const originalSet = dbMock.mocks.update().set
      dbMock.mocks.update.mockReturnValue({
        set: vi.fn().mockImplementation((updates) => {
          capturedUpdates = updates
          return originalSet(updates)
        }),
      })

      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: '  Folder With Spaces  ',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      await PUT(req, { params })

      expect(capturedUpdates).not.toBeNull()
      expect(capturedUpdates!.name).toBe('Folder With Spaces')
    })

    it('should handle database errors gracefully', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock({
        throwError: true,
      })
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder',
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Internal server error')
      expect(mockLogger.error).toHaveBeenCalledWith('Error updating folder:', {
        error: expect.any(Error),
      })
    })
  })

  describe('Input Validation', () => {
    it('should handle empty folder name', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: '', // Empty name
      })
      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      // Should still work as the API doesn't validate empty names
      expect(response.status).toBe(200)
    })

    it('should handle invalid JSON payload', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      // Create a request with invalid JSON
      const req = new Request('http://localhost:3000/api/folders/folder-1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json',
      }) as any

      const params = Promise.resolve({ id: 'folder-1' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      expect(response.status).toBe(500) // Should handle JSON parse error gracefully
    })
  })

  describe('Circular Reference Prevention', () => {
    it('should prevent circular references when updating parent', async () => {
      mockAuthenticatedUser()

      // Mock the circular reference scenario
      // folder-3 trying to set folder-1 as parent,
      // but folder-1 -> folder-2 -> folder-3 (would create cycle)
      const circularCheckResults = [
        { parentId: 'folder-2' }, // folder-1 has parent folder-2
        { parentId: 'folder-3' }, // folder-2 has parent folder-3 (creates cycle!)
      ]

      const dbMock = createFolderDbMock({
        folderLookupResult: { id: 'folder-3', parentId: null, name: 'Folder 3' },
        circularCheckResults,
      })
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('PUT', {
        name: 'Updated Folder 3',
        parentId: 'folder-1', // This would create a circular reference
      })
      const params = Promise.resolve({ id: 'folder-3' })

      const { PUT } = await import('@/app/api/folders/[id]/route')

      const response = await PUT(req, { params })

      // Should return 400 due to circular reference
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Cannot create circular folder reference')
    })
  })

  describe('DELETE /api/folders/[id]', () => {
    it('should delete folder and all contents successfully', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock({
        folderLookupResult: mockFolder,
      })

      // Mock the recursive deletion function
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('deletedItems')
    })

    it('should return 401 for unauthenticated delete requests', async () => {
      mockUnauthenticated()

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Unauthorized')
    })

    it('should return 403 when user has only read permissions for delete', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('read') // Read-only permissions

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Admin access required to delete folders')
    })

    it('should return 403 when user has only write permissions for delete', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('write') // Write permissions (not enough for delete)

      const dbMock = createFolderDbMock()
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Admin access required to delete folders')
    })

    it('should allow folder deletion for admin permissions', async () => {
      mockAuthenticatedUser()
      mockGetUserEntityPermissions.mockResolvedValue('admin') // Admin permissions

      const dbMock = createFolderDbMock({
        folderLookupResult: mockFolder,
      })
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('success', true)
    })

    it('should handle database errors during deletion', async () => {
      mockAuthenticatedUser()

      const dbMock = createFolderDbMock({
        throwError: true,
      })
      vi.doMock('@sim/db', () => dbMock)

      const req = createMockRequest('DELETE')
      const params = Promise.resolve({ id: 'folder-1' })

      const { DELETE } = await import('@/app/api/folders/[id]/route')

      const response = await DELETE(req, { params })

      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data).toHaveProperty('error', 'Internal server error')
      expect(mockLogger.error).toHaveBeenCalledWith('Error deleting folder:', {
        error: expect.any(Error),
      })
    })
  })
})
```

--------------------------------------------------------------------------------

````
