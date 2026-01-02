---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 227
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 227 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: versionUtils.ts]---
Location: payload-main/packages/payload/src/utilities/dependencies/versionUtils.ts

```typescript
import type { CustomVersionParser } from './dependencyChecker.js'

export function parseVersion(version: string): { parts: number[]; preReleases: string[] } {
  const [mainVersion, ...preReleases] = version.split('-')
  const parts = mainVersion!.split('.').map(Number)
  return { parts, preReleases }
}

function extractNumbers(str: string): number[] {
  const matches = str.match(/\d+/g) || []
  return matches.map(Number)
}

function comparePreRelease(v1: string, v2: string): number {
  const num1 = extractNumbers(v1)
  const num2 = extractNumbers(v2)

  for (let i = 0; i < Math.max(num1.length, num2.length); i++) {
    if ((num1[i] || 0) < (num2[i] || 0)) {
      return -1
    }
    if ((num1[i] || 0) > (num2[i] || 0)) {
      return 1
    }
  }

  // If numeric parts are equal, compare the whole string
  if (v1 < v2) {
    return -1
  }
  if (v1 > v2) {
    return 1
  }
  return 0
}

/**
 * Compares two semantic version strings, including handling pre-release identifiers.
 *
 * This function first compares the major, minor, and patch components as integers.
 * If these components are equal, it then moves on to compare pre-release versions.
 * Pre-release versions are compared first by extracting and comparing any numerical values.
 * If numerical values are equal, it compares the whole pre-release string lexicographically.
 *
 * @param {string} compare - The first version string to compare.
 * @param {string} to - The second version string to compare.
 * @param {function} [customVersionParser] - An optional function to parse version strings into parts and pre-releases.
 * @returns {string} - Returns greater if compare is greater than to, lower if compare is less than to, and equal if they are equal.
 */
export function compareVersions(
  compare: string,
  to: string,
  customVersionParser?: CustomVersionParser,
): 'equal' | 'greater' | 'lower' {
  const { parts: parts1, preReleases: preReleases1 } = customVersionParser
    ? customVersionParser(compare)
    : parseVersion(compare)
  const { parts: parts2, preReleases: preReleases2 } = customVersionParser
    ? customVersionParser(to)
    : parseVersion(to)

  // Compare main version parts
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    if ((parts1[i] || 0) > (parts2[i] || 0)) {
      return 'greater'
    }
    if ((parts1[i] || 0) < (parts2[i] || 0)) {
      return 'lower'
    }
  }

  // Compare pre-release parts if main versions are equal
  if (preReleases1?.length || preReleases2?.length) {
    for (let i = 0; i < Math.max(preReleases1.length, preReleases2.length); i++) {
      if (!preReleases1[i]) {
        return 'greater'
      }
      if (!preReleases2[i]) {
        return 'lower'
      }

      const result = comparePreRelease(preReleases1[i]!, preReleases2[i]!)
      if (result !== 0) {
        return result === 1 ? 'greater' : 'lower'
      }
      // Equal => continue for loop to check for next pre-release part
    }
  }

  return 'equal'
}
```

--------------------------------------------------------------------------------

---[FILE: entityDocExists.ts]---
Location: payload-main/packages/payload/src/utilities/getEntityPermissions/entityDocExists.ts

```typescript
import {
  type AllOperations,
  combineQueries,
  type DefaultDocumentIDType,
  type PayloadRequest,
  type Where,
} from '../../index.js'

/**
 * Returns whether or not the entity doc exists based on the where query.
 */
export async function entityDocExists({
  id,
  slug,
  entityType,
  locale,
  operation,
  req,
  where,
}: {
  entityType: 'collection' | 'global'
  id?: DefaultDocumentIDType
  locale?: string
  operation?: AllOperations
  req: PayloadRequest
  slug: string
  where: Where
}): Promise<boolean> {
  if (entityType === 'global') {
    const global = await req.payload.db.findGlobal({
      slug,
      locale,
      req,
      select: {},
      where,
    })

    const hasGlobalDoc = Boolean(global && Object.keys(global).length > 0)

    return hasGlobalDoc
  }

  if (entityType === 'collection' && id) {
    if (operation === 'readVersions') {
      const count = await req.payload.db.countVersions({
        collection: slug,
        locale,
        req,
        where: combineQueries(where, { parent: { equals: id } }),
      })
      return count.totalDocs > 0
    }

    const count = await req.payload.db.count({
      collection: slug,
      locale,
      req,
      where: combineQueries(where, { id: { equals: id } }),
    })

    return count.totalDocs > 0
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: getEntityPermissions.ts]---
Location: payload-main/packages/payload/src/utilities/getEntityPermissions/getEntityPermissions.ts
Signals: TypeORM

```typescript
import { isDeepStrictEqual } from 'util'

import type {
  BlockPermissions,
  CollectionPermission,
  FieldsPermissions,
  GlobalPermission,
  Permission,
} from '../../auth/types.js'
import type { SanitizedCollectionConfig, TypeWithID } from '../../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { BlockSlug, DefaultDocumentIDType } from '../../index.js'
import type { AllOperations, JsonObject, PayloadRequest, Where } from '../../types/index.js'

import { entityDocExists } from './entityDocExists.js'
import { populateFieldPermissions } from './populateFieldPermissions.js'

type WhereQueryCache = { result: Promise<boolean>; where: Where }[]

export type BlockReferencesPermissions = Record<
  BlockSlug,
  BlockPermissions | Promise<BlockPermissions>
>

export type EntityDoc = JsonObject | TypeWithID

type ReturnType<TEntityType extends 'collection' | 'global'> = TEntityType extends 'global'
  ? GlobalPermission
  : CollectionPermission

type Args<TEntityType extends 'collection' | 'global'> = {
  blockReferencesPermissions: BlockReferencesPermissions
  /**
   * If the document data is passed, it will be used to check access instead of fetching the document from the database.
   */
  data?: JsonObject
  entity: TEntityType extends 'collection' ? SanitizedCollectionConfig : SanitizedGlobalConfig
  entityType: TEntityType
  /**
   * Operations to check access for
   */
  operations: AllOperations[]
  req: PayloadRequest
} & (
  | {
      fetchData: false
      id?: never
    }
  | {
      fetchData: true
      id: TEntityType extends 'collection' ? DefaultDocumentIDType : undefined
    }
)

const topLevelCollectionPermissions = [
  'create',
  'delete',
  'read',
  'readVersions',
  'update',
  'unlock',
]
const topLevelGlobalPermissions = ['read', 'readVersions', 'update']

/**
 * Build up permissions object for an entity (collection or global).
 * This is not run during any update and reflects the current state of the entity data => doc and data is the same.
 *
 * When `fetchData` is false:
 * - returned `Where` are not run and evaluated as "does not have permission".
 * - If req.data is passed: `data` and `doc` is passed to access functions.
 * - If req.data is not passed: `data` and `doc` is not passed to access functions.
 *
 * When `fetchData` is true:
 * - `Where` are run and evaluated as "has permission" or "does not have permission".
 * - `data` and `doc` are always passed to access functions.
 * - Error is thrown if `entityType` is 'collection' and `id` is not passed.
 *
 * In both cases:
 * We cannot include siblingData or blockData here, as we do not have siblingData available once we reach block or array
 * rows, as we're calculating schema permissions, which do not include individual rows.
 * For consistency, it's thus better to never include the siblingData and blockData
 *
 * @internal
 */
export async function getEntityPermissions<TEntityType extends 'collection' | 'global'>(
  args: Args<TEntityType>,
): Promise<ReturnType<TEntityType>> {
  const {
    id,
    blockReferencesPermissions,
    data: _data,
    entity,
    entityType,
    fetchData,
    operations,
    req,
  } = args
  const { locale: _locale, user } = req

  const locale = _locale ? _locale : undefined

  if (fetchData && entityType === 'collection' && !id) {
    throw new Error('ID is required when fetching data for a collection')
  }

  const hasData = _data && Object.keys(_data).length > 0
  const data: JsonObject | undefined = hasData
    ? _data
    : fetchData
      ? await (async () => {
          if (entityType === 'global') {
            return req.payload.findGlobal({
              slug: entity.slug,
              depth: 0,
              fallbackLocale: null,
              locale,
              overrideAccess: true,
              req,
            })
          }

          if (entityType === 'collection') {
            return req.payload.findByID({
              id: id!,
              collection: entity.slug,
              depth: 0,
              fallbackLocale: null,
              locale,
              overrideAccess: true,
              req,
              trash: true,
            })
          }
        })()
      : undefined

  const isLoggedIn = !!user

  const fieldsPermissions: FieldsPermissions = {}

  const entityPermissions: ReturnType<TEntityType> = {
    fields: fieldsPermissions,
  } as ReturnType<TEntityType>

  const promises: Promise<void>[] = []

  // Phase 1: Resolve all access functions to get where queries
  const accessResults: {
    operation: keyof typeof entity.access
    result: Promise<boolean | Where>
  }[] = []

  for (const _operation of operations) {
    const operation = _operation as keyof typeof entity.access
    const accessFunction = entity.access[operation]

    if (
      (entityType === 'collection' && topLevelCollectionPermissions.includes(operation)) ||
      (entityType === 'global' && topLevelGlobalPermissions.includes(operation))
    ) {
      if (typeof accessFunction === 'function') {
        accessResults.push({
          operation,
          result: Promise.resolve(accessFunction({ id, data, req })) as Promise<boolean | Where>,
        })
      } else {
        entityPermissions[operation] = {
          permission: isLoggedIn,
        }
      }
    }
  }

  // Await all access functions in parallel
  const resolvedAccessResults = await Promise.all(
    accessResults.map(async (item) => ({
      operation: item.operation,
      result: await item.result,
    })),
  )

  // Phase 2: Process where queries with cache and resolve in parallel
  const whereQueryCache: WhereQueryCache = []
  const wherePromises: Promise<void>[] = []

  for (const { operation, result: accessResult } of resolvedAccessResults) {
    if (typeof accessResult === 'object') {
      processWhereQuery({
        id,
        slug: entity.slug,
        accessResult,
        entityPermissions,
        entityType,
        fetchData,
        locale,
        operation,
        req,
        wherePromises,
        whereQueryCache,
      })
    } else if (entityPermissions[operation]?.permission !== false) {
      entityPermissions[operation] = { permission: !!accessResult }
    }
  }

  // Await all where query DB calls in parallel
  await Promise.all(wherePromises)

  populateFieldPermissions({
    blockReferencesPermissions,
    data,
    fields: entity.fields,
    operations,
    parentPermissionsObject: entityPermissions,
    permissionsObject: fieldsPermissions,
    promises,
    req,
  })

  /**
   * Await all promises in parallel.
   * A promise can add more promises to the promises array (group of fields calls populateFieldPermissions again in their own promise), which will not be
   * awaited in the first run.
   * This is why we need to loop again to process the new promises, until there are no more promises left.
   */
  let iterations = 0
  while (promises.length > 0) {
    const currentPromises = promises.splice(0, promises.length)

    await Promise.all(currentPromises)

    iterations++
    if (iterations >= 100) {
      throw new Error('Infinite getEntityPermissions promise loop detected.')
    }
  }

  return entityPermissions
}

const processWhereQuery = ({
  id,
  slug,
  accessResult,
  entityPermissions,
  entityType,
  fetchData,
  locale,
  operation,
  req,
  wherePromises,
  whereQueryCache,
}: {
  accessResult: Where
  entityPermissions: CollectionPermission | GlobalPermission
  entityType: 'collection' | 'global'
  fetchData: boolean
  id?: DefaultDocumentIDType
  locale?: string
  operation: Extract<keyof (CollectionPermission | GlobalPermission), AllOperations>
  req: PayloadRequest
  slug: string
  wherePromises: Promise<void>[]
  whereQueryCache: WhereQueryCache
}): void => {
  if (fetchData) {
    // Check cache for identical where query using deep comparison
    let cached = whereQueryCache.find((entry) => isDeepStrictEqual(entry.where, accessResult))

    if (!cached) {
      // Cache miss - start DB query (don't await)
      cached = {
        result: entityDocExists({
          id,
          slug,
          entityType,
          locale,
          operation,
          req,
          where: accessResult,
        }),
        where: accessResult,
      }
      whereQueryCache.push(cached)
    }

    // Defer resolution to Promise.all (cache hits reuse same promise)
    wherePromises.push(
      cached.result.then((hasPermission) => {
        entityPermissions[operation] = {
          permission: hasPermission,
          where: accessResult,
        } as Permission
      }),
    )
  } else {
    // TODO: 4.0: Investigate defaulting to `false` here, if where query is returned but ignored as we don't
    // have the document data available. This seems more secure.
    // Alternatively, we could set permission to a third state, like 'unknown'.
    // Even after calling sanitizePermissions, the permissions will still be true if the where query is returned but ignored as we don't have the document data available.
    entityPermissions[operation] = { permission: true, where: accessResult } as Permission
  }
}
```

--------------------------------------------------------------------------------

---[FILE: populateFieldPermissions.ts]---
Location: payload-main/packages/payload/src/utilities/getEntityPermissions/populateFieldPermissions.ts

```typescript
import type {
  BlockPermissions,
  BlocksPermissions,
  CollectionPermission,
  FieldPermissions,
  FieldsPermissions,
  GlobalPermission,
  Permission,
} from '../../auth/types.js'
import type { DefaultDocumentIDType } from '../../index.js'
import type { AllOperations, JsonObject, PayloadRequest } from '../../types/index.js'
import type { BlockReferencesPermissions } from './getEntityPermissions.js'

import { type Field, tabHasName } from '../../fields/config/types.js'

const isThenable = (value: unknown): value is Promise<unknown> =>
  value != null && typeof (value as { then?: unknown }).then === 'function'

/**
 * Helper to set a permission value that might be a promise.
 * If it's a promise, creates a chained promise that resolves to update the target,
 * stores the promise temporarily, and adds it to the promises array for later resolution.
 */
const setPermission = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  operation: AllOperations,
  value: boolean | Promise<boolean> | undefined,
  promises: Promise<void>[],
): void => {
  if (isThenable(value)) {
    // Create a single permission object that will be mutated in place
    // This ensures all references (including cached blocks) see the resolved value
    const permissionObj = { permission: value as any }
    target[operation] = permissionObj

    const permissionPromise = value.then((result) => {
      // Mutate the permission property in place so all references see the update
      permissionObj.permission = result
    })

    promises.push(permissionPromise)
  } else {
    target[operation] = { permission: value }
  }
}

/**
 * Build up permissions object and run access functions for each field of an entity
 * This function is synchronous and collects all async work into the promises array
 */
export const populateFieldPermissions = ({
  id,
  blockReferencesPermissions,
  data,
  fields,
  operations,
  parentPermissionsObject,
  permissionsObject,
  promises,
  req,
}: {
  blockReferencesPermissions: BlockReferencesPermissions
  data: JsonObject | undefined
  fields: Field[]
  id?: DefaultDocumentIDType
  /**
   * Operations to check access for
   */
  operations: AllOperations[]
  parentPermissionsObject: CollectionPermission | FieldPermissions | GlobalPermission
  permissionsObject: FieldsPermissions
  promises: Promise<void>[]
  req: PayloadRequest
}): void => {
  for (const field of fields) {
    // Set up permissions for all operations
    for (const operation of operations) {
      const parentPermissionForOperation = (
        parentPermissionsObject[operation as keyof typeof parentPermissionsObject] as Permission
      )?.permission

      // Fields don't have all operations of a collection
      if (operation === 'delete' || operation === 'readVersions' || operation === 'unlock') {
        continue
      }

      if ('name' in field && field.name) {
        if (!permissionsObject[field.name]) {
          permissionsObject[field.name] = {} as FieldPermissions
        }
        const fieldPermissions: FieldPermissions = permissionsObject[field.name]!

        if ('access' in field && field.access && typeof field.access[operation] === 'function') {
          const accessResult = field.access[operation]({
            id,
            data,
            doc: data,
            req,
            // We cannot include siblingData or blockData here, as we do not have siblingData/blockData available once we reach block or array
            // rows, as we're calculating schema permissions, which do not include individual rows.
            // For consistency, it's thus better to never include the siblingData and blockData
          })

          // Handle both sync and async access results
          if (isThenable(accessResult)) {
            const booleanPromise = accessResult.then((result) => Boolean(result))
            setPermission(fieldPermissions, operation, booleanPromise, promises)
          } else {
            setPermission(fieldPermissions, operation, Boolean(accessResult), promises)
          }
        } else {
          // Inherit from parent (which might be a promise)
          setPermission(fieldPermissions, operation, parentPermissionForOperation, promises)
        }
      }
    }

    // Handle named fields with nested content
    if ('name' in field && field.name) {
      const fieldPermissions: FieldPermissions = permissionsObject[field.name]!

      if ('fields' in field && field.fields) {
        if (!fieldPermissions.fields) {
          fieldPermissions.fields = {}
        }

        populateFieldPermissions({
          id,
          blockReferencesPermissions,
          data,
          fields: field.fields,
          operations,
          parentPermissionsObject: fieldPermissions,
          permissionsObject: fieldPermissions.fields,
          promises,
          req,
        })
      }

      if (
        ('blocks' in field && field.blocks?.length) ||
        ('blockReferences' in field && field.blockReferences?.length)
      ) {
        if (!fieldPermissions.blocks) {
          fieldPermissions.blocks = {}
        }
        const blocksPermissions: BlocksPermissions = fieldPermissions.blocks

        // Set up permissions for all operations for all blocks
        for (const operation of operations) {
          // Fields don't have all operations of a collection
          if (operation === 'delete' || operation === 'readVersions' || operation === 'unlock') {
            continue
          }

          const parentPermissionForOperation = (
            parentPermissionsObject[operation as keyof typeof parentPermissionsObject] as Permission
          )?.permission

          for (const _block of field.blockReferences ?? field.blocks) {
            const block = typeof _block === 'string' ? req.payload.blocks[_block] : _block

            // Skip if block doesn't exist (invalid block reference)
            if (!block) {
              continue
            }

            // Handle block references - check if we've seen this block before
            if (typeof _block === 'string') {
              const blockReferencePermissions = blockReferencesPermissions[_block]
              if (blockReferencePermissions) {
                // Reference the cached permissions (may be a promise or resolved object)
                blocksPermissions[block.slug] = blockReferencePermissions as BlockPermissions
                continue
              }
            }

            // Initialize block permissions object if needed
            if (!blocksPermissions[block.slug]) {
              blocksPermissions[block.slug] = {} as BlockPermissions
            }

            const blockPermission = blocksPermissions[block.slug]!

            // Set permission for this operation
            if (!blockPermission[operation]) {
              const fieldPermission =
                fieldPermissions[operation]?.permission ?? parentPermissionForOperation

              // Inherit from field permission (which might be a promise)
              setPermission(blockPermission, operation, fieldPermission, promises)
            }
          }
        }

        // Process nested content for each unique block (once per block, not once per operation)
        const processedBlocks = new Set<string>()
        for (const _block of field.blockReferences ?? field.blocks) {
          const block = typeof _block === 'string' ? req.payload.blocks[_block] : _block

          // Skip if block doesn't exist (invalid block reference)
          if (!block || processedBlocks.has(block.slug)) {
            continue
          }
          processedBlocks.add(block.slug)

          const blockPermission = blocksPermissions[block.slug]
          if (!blockPermission) {
            continue
          }

          if (!blockPermission.fields) {
            blockPermission.fields = {}
          }

          // Handle block references with caching - store as promise that will be resolved later
          if (typeof _block === 'string' && !blockReferencesPermissions[_block]) {
            // Mark this block as being processed by storing a reference
            blockReferencesPermissions[_block] = blockPermission
          }

          // Recursively process block fields synchronously
          populateFieldPermissions({
            id,
            blockReferencesPermissions,
            data,
            fields: block.fields,
            operations,
            parentPermissionsObject: blockPermission,
            permissionsObject: blockPermission.fields,
            promises,
            req,
          })
        }
      }
    }

    // Handle unnamed group fields
    if ('fields' in field && field.fields && !('name' in field && field.name)) {
      // Field does not have a name => same parentPermissionsObject
      populateFieldPermissions({
        id,
        blockReferencesPermissions,
        data,
        fields: field.fields,
        operations,
        // Field does not have a name here => use parent permissions object
        parentPermissionsObject,
        permissionsObject,
        promises,
        req,
      })
    }

    // Handle tabs fields
    if (field.type === 'tabs') {
      // Process tabs for all operations
      for (const operation of operations) {
        // Fields don't have all operations of a collection
        if (operation === 'delete' || operation === 'readVersions' || operation === 'unlock') {
          continue
        }

        const parentPermissionForOperation = (
          parentPermissionsObject[operation as keyof typeof parentPermissionsObject] as Permission
        )?.permission

        for (const tab of field.tabs) {
          if (tabHasName(tab)) {
            if (!permissionsObject[tab.name]) {
              permissionsObject[tab.name] = { fields: {} } as FieldPermissions
            }

            const tabPermissions = permissionsObject[tab.name]!
            if (!tabPermissions[operation]) {
              // Inherit from parent (which might be a promise)
              setPermission(tabPermissions, operation, parentPermissionForOperation, promises)
            }
          }
        }
      }

      for (const tab of field.tabs) {
        if (tabHasName(tab)) {
          const tabPermissions: FieldPermissions = permissionsObject[tab.name]!

          if (!tabPermissions.fields) {
            tabPermissions.fields = {}
          }

          populateFieldPermissions({
            id,
            blockReferencesPermissions,
            data,
            fields: tab.fields,
            operations,
            parentPermissionsObject: tabPermissions,
            permissionsObject: tabPermissions.fields,
            promises,
            req,
          })
        } else {
          // Tab does not have a name => same parentPermissionsObject
          populateFieldPermissions({
            id,
            blockReferencesPermissions,
            data,
            fields: tab.fields,
            operations,
            // Tab does not have a name here => use parent permissions object
            parentPermissionsObject,
            permissionsObject,
            promises,
            req,
          })
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.spec.ts]---
Location: payload-main/packages/payload/src/utilities/parseParams/index.spec.ts

```typescript
import { parseParams, booleanParams, numberParams } from './index.js'

describe('parseParams', () => {
  describe('boolean parameters', () => {
    booleanParams.forEach((param) => {
      describe(param, () => {
        it('should parse string "true" to boolean true', () => {
          const result = parseParams({ [param]: 'true' })
          expect(result[param]).toBe(true)
        })

        it('should parse string "false" to boolean false', () => {
          const result = parseParams({ [param]: 'false' })
          expect(result[param]).toBe(false)
        })

        it('should parse boolean true to boolean true', () => {
          const result = parseParams({ [param]: true })
          expect(result[param]).toBe(true)
        })

        it('should parse boolean false to boolean false', () => {
          const result = parseParams({ [param]: false })
          expect(result[param]).toBe(false)
        })

        it('should return undefined for truthy strings (not exact "true")', () => {
          const result = parseParams({ [param]: '1' })
          expect(result[param]).toBeUndefined()
        })

        it('should return undefined for falsy strings (not exact "false")', () => {
          const result = parseParams({ [param]: '0' })
          expect(result[param]).toBeUndefined()
        })

        it('should return undefined for empty string', () => {
          const result = parseParams({ [param]: '' })
          expect(result[param]).toBeUndefined()
        })
      })
    })
  })

  describe('number parameters', () => {
    numberParams.forEach((param) => {
      describe(param, () => {
        it('should parse valid number string to number', () => {
          const result = parseParams({ [param]: '42' })
          expect(result[param]).toBe(42)
        })

        it('should parse zero string to zero', () => {
          const result = parseParams({ [param]: '0' })
          expect(result[param]).toBe(0)
        })

        it('should parse negative number string to negative number', () => {
          const result = parseParams({ [param]: '-5' })
          expect(result[param]).toBe(-5)
        })

        it('should parse decimal number string to decimal number', () => {
          const result = parseParams({ [param]: '3.14' })
          expect(result[param]).toBe(3.14)
        })

        it('should not parse invalid number strings', () => {
          const result = parseParams({ [param]: 'not-a-number' })
          expect(result[param]).toBe('not-a-number') // remains as string
        })

        it('should not parse empty string', () => {
          const result = parseParams({ [param]: '' })
          expect(result[param]).toBe('') // remains as string
        })

        it('should handle already numeric values', () => {
          const result = parseParams({ [param]: 123 })
          expect(result[param]).toBe(123)
        })
      })
    })
  })

  describe('sort parameter', () => {
    it('should parse comma-separated string to array', () => {
      const result = parseParams({ sort: 'name,createdAt,-updatedAt' })
      expect(result.sort).toEqual(['name', 'createdAt', '-updatedAt'])
    })

    it('should parse single value string to array with one element', () => {
      const result = parseParams({ sort: 'name' })
      expect(result.sort).toEqual(['name'])
    })

    it('should handle empty string', () => {
      const result = parseParams({ sort: '' })
      expect(result.sort).toEqual([''])
    })

    it('should handle comma-separated string with spaces', () => {
      const result = parseParams({ sort: 'name, createdAt , -updatedAt' })
      expect(result.sort).toEqual(['name', ' createdAt ', ' -updatedAt'])
    })

    it('should return undefined for non-string sort values', () => {
      const result = parseParams({ sort: 123 as any })
      expect(result.sort).toBeUndefined()
    })

    it('should return undefined for null sort values', () => {
      const result = parseParams({ sort: null as any })
      expect(result.sort).toBeUndefined()
    })
  })

  describe('data parameter', () => {
    it('should parse valid JSON string', () => {
      const data = { name: 'test', value: 42 }
      const result = parseParams({ data: JSON.stringify(data) })
      expect(result.data).toEqual(data)
    })

    it('should parse empty object JSON string', () => {
      const result = parseParams({ data: '{}' })
      expect(result.data).toEqual({})
    })

    it('should parse array JSON string', () => {
      const data = [1, 2, 3]
      const result = parseParams({ data: JSON.stringify(data) })
      expect(result.data).toEqual(data)
    })

    it('should not process empty string', () => {
      const result = parseParams({ data: '' })
      expect(result.data).toBe('') // empty string is not processed, remains as string
    })

    it('should throw error for invalid JSON', () => {
      expect(() => {
        parseParams({ data: 'invalid-json' })
      }).toThrow()
    })

    it('should not process non-string data values', () => {
      const result = parseParams({ data: { already: 'parsed' } as any })
      expect(result.data).toEqual({ already: 'parsed' })
    })
  })

  describe('special parameters', () => {
    it('should handle populate parameter', () => {
      const result = parseParams({ populate: 'field1,field2' })
      expect(result).toHaveProperty('populate')
      // Note: actual sanitization logic is tested in sanitizePopulateParam tests
    })

    it('should handle select parameter', () => {
      const result = parseParams({ select: 'field1,field2' })
      expect(result).toHaveProperty('select')
      // Note: actual sanitization logic is tested in sanitizeSelectParam tests
    })

    it('should handle joins parameter', () => {
      const joins = { collection: 'posts' }
      const result = parseParams({ joins })
      expect(result).toHaveProperty('joins')
      // Note: actual sanitization logic is tested in sanitizeJoinParams tests
    })
  })

  describe('selectedLocales parameter', () => {
    it('should pass through selectedLocales as-is', () => {
      const selectedLocales = 'en,es,fr'
      const result = parseParams({ selectedLocales })
      expect(result.selectedLocales).toBe(selectedLocales)
    })
  })

  describe('publishSpecificLocale parameter', () => {
    it('should pass through publishSpecificLocale as-is', () => {
      const publishSpecificLocale = 'en'
      const result = parseParams({ publishSpecificLocale })
      expect(result.publishSpecificLocale).toBe(publishSpecificLocale)
    })
  })

  describe('field parameter', () => {
    it('should pass through field as-is', () => {
      const field = 'myField'
      const result = parseParams({ field })
      expect(result.field).toBe(field)
    })
  })

  describe('where parameter', () => {
    it('should pass through where as-is', () => {
      const where = { name: { equals: 'test' } }
      const result = parseParams({ where })
      expect(result.where).toBe(where)
    })
  })

  describe('edge cases', () => {
    it('should handle empty params object', () => {
      const result = parseParams({})
      expect(result).toEqual({})
    })

    it('should throw error for null params (current implementation bug)', () => {
      expect(() => {
        parseParams(null as any)
      }).toThrow(TypeError)
    })

    it('should throw error for undefined params (current implementation bug)', () => {
      expect(() => {
        parseParams(undefined as any)
      }).toThrow(TypeError)
    })

    it('should preserve unknown parameters', () => {
      const result = parseParams({ customParam: 'customValue' })
      expect(result.customParam).toBe('customValue')
    })

    it('should handle mixed parameter types', () => {
      const result = parseParams({
        draft: 'true',
        depth: '5',
        sort: 'name,createdAt',
        data: '{"test": true}',
        customParam: 'custom',
      })

      expect(result.draft).toBe(true)
      expect(result.depth).toBe(5)
      expect(result.sort).toEqual(['name', 'createdAt'])
      expect(result.data).toEqual({ test: true })
      expect(result.customParam).toBe('custom')
    })
  })

  describe('parameter preservation', () => {
    it('should not modify parameters that are not in known lists', () => {
      const params = {
        unknownBoolean: 'true',
        unknownNumber: '42',
        unknownString: 'test',
      }
      const result = parseParams(params)

      expect(result.unknownBoolean).toBe('true') // should remain string
      expect(result.unknownNumber).toBe('42') // should remain string
      expect(result.unknownString).toBe('test')
    })

    it('should only process parameters that exist in the input', () => {
      const result = parseParams({ draft: 'true' })

      expect(result.draft).toBe(true)
      expect(result).not.toHaveProperty('autosave')
      expect(result).not.toHaveProperty('depth')
      expect(result).not.toHaveProperty('sort')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/utilities/parseParams/index.ts

```typescript
import type { JoinQuery, PopulateType, SelectType, Where } from '../../types/index.js'
import type { JoinParams } from '../sanitizeJoinParams.js'

import { isNumber } from '../isNumber.js'
import { parseBooleanString } from '../parseBooleanString.js'
import { sanitizeJoinParams } from '../sanitizeJoinParams.js'
import { sanitizePopulateParam } from '../sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../sanitizeSelectParam.js'

type ParsedParams = {
  autosave?: boolean
  data?: Record<string, unknown>
  depth?: number
  draft?: boolean
  field?: string
  flattenLocales?: boolean
  joins?: JoinQuery
  limit?: number
  overrideLock?: boolean
  page?: number
  pagination?: boolean
  populate?: PopulateType
  publishSpecificLocale?: string
  select?: SelectType
  selectedLocales?: string[]
  sort?: string[]
  trash?: boolean
  where?: Where
} & Record<string, unknown>

type RawParams = {
  [key: string]: unknown
  autosave?: string
  data?: string
  depth?: string
  draft?: string
  field?: string
  flattenLocales?: string
  joins?: JoinParams
  limit?: string
  overrideLock?: string
  page?: string
  pagination?: string
  populate?: unknown
  publishSpecificLocale?: string
  select?: unknown
  selectedLocales?: string
  sort?: string
  trash?: string
  where?: Where
}

export const booleanParams = [
  'autosave',
  'draft',
  'trash',
  'overrideLock',
  'pagination',
  'flattenLocales',
]

export const numberParams = ['depth', 'limit', 'page']

/**
 * Takes raw query parameters and parses them into the correct types that Payload expects.
 * Examples:
 *   a. `draft` provided as a string of "true" is converted to a boolean
 *   b. `depth` provided as a string of "0" is converted to a number
 *   c. `sort` provided as a comma-separated string is converted to an array of strings
 */
export const parseParams = (params: RawParams): ParsedParams => {
  const parsedParams = (params || {}) as ParsedParams

  // iterate through known params to make this very fast
  for (const key of booleanParams) {
    if (key in params) {
      parsedParams[key] = parseBooleanString(params[key] as boolean | string)
    }
  }

  for (const key of numberParams) {
    if (key in params) {
      if (isNumber(params[key])) {
        parsedParams[key] = Number(params[key])
      }
    }
  }

  if ('populate' in params) {
    parsedParams.populate = sanitizePopulateParam(params.populate)
  }

  if ('select' in params) {
    parsedParams.select = sanitizeSelectParam(params.select)
  }

  if ('joins' in params) {
    parsedParams.joins = sanitizeJoinParams(params.joins as JoinParams)
  }

  if ('sort' in params) {
    parsedParams.sort = typeof params.sort === 'string' ? params.sort.split(',') : undefined
  }

  if ('data' in params && typeof params.data === 'string' && params.data.length > 0) {
    parsedParams.data = JSON.parse(params.data)
  }

  return parsedParams
}
```

--------------------------------------------------------------------------------

````
