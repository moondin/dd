---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 412
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 412 of 695)

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

---[FILE: groupNavItems.ts]---
Location: payload-main/packages/ui/src/utilities/groupNavItems.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type {
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
  StaticLabel,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'

export enum EntityType {
  collection = 'collections',
  global = 'globals',
}

export type EntityToGroup =
  | {
      entity: SanitizedCollectionConfig
      type: EntityType.collection
    }
  | {
      entity: SanitizedGlobalConfig
      type: EntityType.global
    }

export type NavGroupType = {
  entities: {
    label: StaticLabel
    slug: string
    type: EntityType
  }[]
  label: string
}

export function groupNavItems(
  entities: EntityToGroup[],
  permissions: SanitizedPermissions,
  i18n: I18nClient,
): NavGroupType[] {
  const result = entities.reduce(
    (groups, entityToGroup) => {
      // Skip entities where admin.group is explicitly false
      if (entityToGroup.entity?.admin?.group === false) {
        return groups
      }

      if (permissions?.[entityToGroup.type.toLowerCase()]?.[entityToGroup.entity.slug]?.read) {
        const translatedGroup = getTranslation(entityToGroup.entity.admin.group, i18n)

        const labelOrFunction =
          'labels' in entityToGroup.entity
            ? entityToGroup.entity.labels.plural
            : entityToGroup.entity.label

        const label =
          typeof labelOrFunction === 'function'
            ? labelOrFunction({ i18n, t: i18n.t })
            : labelOrFunction

        if (entityToGroup.entity.admin.group) {
          const existingGroup = groups.find(
            (group) => getTranslation(group.label, i18n) === translatedGroup,
          ) as NavGroupType

          let matchedGroup: NavGroupType = existingGroup

          if (!existingGroup) {
            matchedGroup = { entities: [], label: translatedGroup }
            groups.push(matchedGroup)
          }

          matchedGroup.entities.push({
            slug: entityToGroup.entity.slug,
            type: entityToGroup.type,
            label,
          })
        } else {
          const defaultGroup = groups.find((group) => {
            return getTranslation(group.label, i18n) === i18n.t(`general:${entityToGroup.type}`)
          }) as NavGroupType
          defaultGroup.entities.push({
            slug: entityToGroup.entity.slug,
            type: entityToGroup.type,
            label,
          })
        }
      }

      return groups
    },
    [
      {
        entities: [],
        label: i18n.t('general:collections'),
      },
      {
        entities: [],
        label: i18n.t('general:globals'),
      },
    ],
  )

  return result.filter((group) => group.entities.length > 0)
}
```

--------------------------------------------------------------------------------

---[FILE: handleBackToDashboard.tsx]---
Location: payload-main/packages/ui/src/utilities/handleBackToDashboard.tsx
Signals: Next.js

```typescript
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'

import { formatAdminURL } from 'payload/shared'

type BackToDashboardProps = {
  adminRoute: string
  router: AppRouterInstance
  serverURL?: string
}

export const handleBackToDashboard = ({ adminRoute, router, serverURL }: BackToDashboardProps) => {
  const redirectRoute = formatAdminURL({
    adminRoute,
    path: '/',
    serverURL,
  })
  router.push(redirectRoute)
}
```

--------------------------------------------------------------------------------

---[FILE: handleFormStateLocking.ts]---
Location: payload-main/packages/ui/src/utilities/handleFormStateLocking.ts

```typescript
import type { PayloadRequest, TypedUser } from 'payload'

type Args = {
  collectionSlug?: string
  globalSlug?: string
  id?: number | string
  req: PayloadRequest
  updateLastEdited?: boolean
}

type Result = {
  isLocked: boolean
  lastEditedAt: string
  user: TypedUser
}

const lockDurationDefault = 300 // Default 5 minutes in seconds

export const handleFormStateLocking = async ({
  id,
  collectionSlug,
  globalSlug,
  req,
  updateLastEdited,
}: Args): Promise<Result> => {
  let result: Result

  if (id || globalSlug) {
    let lockedDocumentQuery

    if (collectionSlug) {
      lockedDocumentQuery = {
        and: [
          { 'document.relationTo': { equals: collectionSlug } },
          { 'document.value': { equals: id } },
        ],
      }
    } else if (globalSlug) {
      lockedDocumentQuery = {
        and: [{ globalSlug: { equals: globalSlug } }],
      }
    }

    const lockDocumentsProp = collectionSlug
      ? req.payload.collections?.[collectionSlug]?.config.lockDocuments
      : req.payload.config.globals.find((g) => g.slug === globalSlug)?.lockDocuments

    const lockDuration =
      typeof lockDocumentsProp === 'object' ? lockDocumentsProp.duration : lockDurationDefault
    const lockDurationInMilliseconds = lockDuration * 1000
    const now = new Date().getTime()

    if (lockedDocumentQuery) {
      // Query where the lock is newer than the current time minus the lock duration
      lockedDocumentQuery.and.push({
        updatedAt: {
          greater_than: new Date(now - lockDurationInMilliseconds).toISOString(),
        },
      })

      const lockedDocument = await req.payload.find({
        collection: 'payload-locked-documents',
        depth: 1,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        user: req.user,
        where: lockedDocumentQuery,
      })

      if (lockedDocument.docs && lockedDocument.docs.length > 0) {
        result = {
          isLocked: true,
          lastEditedAt: lockedDocument.docs[0]?.updatedAt,
          user: lockedDocument.docs[0]?.user?.value,
        }

        const lockOwnerID =
          typeof lockedDocument.docs[0]?.user?.value === 'object'
            ? lockedDocument.docs[0]?.user?.value?.id
            : lockedDocument.docs[0]?.user?.value
        // Should only update doc if the incoming / current user is also the owner of the locked doc
        if (updateLastEdited && req.user && lockOwnerID === req.user.id) {
          await req.payload.db.updateOne({
            id: lockedDocument.docs[0].id,
            collection: 'payload-locked-documents',
            data: {},
            returning: false,
          })
        }
      } else {
        // If NO ACTIVE lock document exists, first delete any expired locks and then create a fresh lock
        // Where updatedAt is older than the duration that is specified in the config
        let deleteExpiredLocksQuery

        if (collectionSlug) {
          deleteExpiredLocksQuery = {
            and: [
              { 'document.relationTo': { equals: collectionSlug } },
              {
                updatedAt: {
                  less_than: new Date(now - lockDurationInMilliseconds).toISOString(),
                },
              },
            ],
          }
        } else if (globalSlug) {
          deleteExpiredLocksQuery = {
            and: [
              { globalSlug: { equals: globalSlug } },
              {
                updatedAt: {
                  less_than: new Date(now - lockDurationInMilliseconds).toISOString(),
                },
              },
            ],
          }
        }

        await req.payload.db.deleteMany({
          collection: 'payload-locked-documents',
          where: deleteExpiredLocksQuery,
        })

        await req.payload.db.create({
          collection: 'payload-locked-documents',
          data: {
            document: collectionSlug
              ? {
                  relationTo: collectionSlug,
                  value: id,
                }
              : undefined,
            globalSlug: globalSlug ? globalSlug : undefined,
            user: {
              relationTo: req.user.collection,
              value: req.user.id,
            },
          },
          returning: false,
        })

        result = {
          isLocked: true,
          lastEditedAt: new Date().toISOString(),
          user: req.user,
        }
      }
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: handleGoBack.tsx]---
Location: payload-main/packages/ui/src/utilities/handleGoBack.tsx
Signals: Next.js

```typescript
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'

import { formatAdminURL } from 'payload/shared'

type GoBackProps = {
  adminRoute: string
  collectionSlug: string
  router: AppRouterInstance
  serverURL?: string
}

export const handleGoBack = ({ adminRoute, collectionSlug, router, serverURL }: GoBackProps) => {
  const redirectRoute = formatAdminURL({
    adminRoute,
    path: collectionSlug ? `/collections/${collectionSlug}` : '/',
    serverURL,
  })
  router.push(redirectRoute)
}
```

--------------------------------------------------------------------------------

---[FILE: handleLivePreview.ts]---
Location: payload-main/packages/ui/src/utilities/handleLivePreview.ts

```typescript
import type {
  CollectionConfig,
  GlobalConfig,
  LivePreviewConfig,
  LivePreviewURLType,
  Operation,
  PayloadRequest,
  SanitizedConfig,
} from 'payload'

export const getLivePreviewConfig = ({
  collectionConfig,
  config,
  globalConfig,
  isLivePreviewEnabled,
}: {
  collectionConfig?: CollectionConfig
  config: SanitizedConfig
  globalConfig?: GlobalConfig
  isLivePreviewEnabled: boolean
}) => ({
  ...(isLivePreviewEnabled ? config.admin.livePreview : {}),
  ...(collectionConfig?.admin?.livePreview || {}),
  ...(globalConfig?.admin?.livePreview || {}),
})

/**
 * Multi-level check to determine whether live preview is enabled on a collection or global.
 * For example, live preview can be enabled at both the root config level, or on the entity's config.
 * If a collectionConfig/globalConfig is provided, checks if it is enabled at the root level,
 * or on the entity's own config.
 */
export const isLivePreviewEnabled = ({
  collectionConfig,
  config,
  globalConfig,
}: {
  collectionConfig?: CollectionConfig
  config: SanitizedConfig
  globalConfig?: GlobalConfig
}): boolean => {
  if (globalConfig) {
    return Boolean(
      config.admin?.livePreview?.globals?.includes(globalConfig.slug) ||
        globalConfig.admin?.livePreview,
    )
  }

  if (collectionConfig) {
    return Boolean(
      config.admin?.livePreview?.collections?.includes(collectionConfig.slug) ||
        collectionConfig.admin?.livePreview,
    )
  }
}

/**
 * 1. Looks up the relevant live preview config, which could have been enabled:
 *   a. At the root level, e.g. `collections: ['posts']`
 *   b. On the collection or global config, e.g. `admin: { livePreview: { ... } }`
 * 2. Determines if live preview is enabled, and if not, early returns.
 * 3. Merges the config with the root config, if necessary.
 * 4. Executes the `url` function, if necessary.
 *
 * Notice: internal function only. Subject to change at any time. Use at your own risk.
 */
export const handleLivePreview = async ({
  collectionSlug,
  config,
  data,
  globalSlug,
  operation,
  req,
}: {
  collectionSlug?: string
  config: SanitizedConfig
  data: Record<string, unknown>
  globalSlug?: string
  operation?: Operation
  req: PayloadRequest
}): Promise<{
  isLivePreviewEnabled?: boolean
  livePreviewConfig?: LivePreviewConfig
  livePreviewURL?: LivePreviewURLType
}> => {
  const collectionConfig = collectionSlug
    ? req.payload.collections[collectionSlug]?.config
    : undefined

  const globalConfig = globalSlug ? config.globals.find((g) => g.slug === globalSlug) : undefined

  const enabled = isLivePreviewEnabled({
    collectionConfig,
    config,
    globalConfig,
  })

  if (!enabled) {
    return {}
  }

  const livePreviewConfig = getLivePreviewConfig({
    collectionConfig,
    config,
    globalConfig,
    isLivePreviewEnabled: enabled,
  })

  let livePreviewURL: string | undefined

  if (typeof livePreviewConfig?.url === 'string') {
    livePreviewURL = livePreviewConfig.url
  }

  if (typeof livePreviewConfig?.url === 'function' && operation !== 'create') {
    try {
      const result = await livePreviewConfig.url({
        collectionConfig,
        data,
        globalConfig,
        locale: { code: req.locale, label: '' },
        payload: req.payload,
        req,
      })

      if (typeof result === 'string') {
        livePreviewURL = result
      }
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `There was an error executing the live preview URL function for ${collectionSlug || globalSlug}`,
      })
    }
  }

  return { isLivePreviewEnabled: enabled, livePreviewConfig, livePreviewURL }
}
```

--------------------------------------------------------------------------------

---[FILE: handlePreview.ts]---
Location: payload-main/packages/ui/src/utilities/handlePreview.ts

```typescript
import {
  type CollectionConfig,
  extractJWT,
  type GlobalConfig,
  type Operation,
  type PayloadRequest,
  type SanitizedConfig,
} from 'payload'

/**
 * Multi-level check to determine whether live preview is enabled on a collection or global.
 * For example, live preview can be enabled at both the root config level, or on the entity's config.
 * If a collectionConfig/globalConfig is provided, checks if it is enabled at the root level,
 * or on the entity's own config.
 */
export const isPreviewEnabled = ({
  collectionConfig,
  globalConfig,
}: {
  collectionConfig?: CollectionConfig
  globalConfig?: GlobalConfig
}): boolean => {
  if (globalConfig) {
    return Boolean(globalConfig.admin?.preview)
  }

  if (collectionConfig) {
    return Boolean(collectionConfig.admin?.preview)
  }
}

/**
 * 1. Looks up the relevant live preview config, which could have been enabled:
 *   a. At the root level, e.g. `collections: ['posts']`
 *   b. On the collection or global config, e.g. `admin: { livePreview: { ... } }`
 * 2. Determines if live preview is enabled, and if not, early returns.
 * 3. Merges the config with the root config, if necessary.
 * 4. Executes the `url` function, if necessary.
 *
 * Notice: internal function only. Subject to change at any time. Use at your own risk.
 */
export const handlePreview = async ({
  collectionSlug,
  config,
  data,
  globalSlug,
  operation,
  req,
}: {
  collectionSlug?: string
  config: SanitizedConfig
  data: Record<string, unknown>
  globalSlug?: string
  operation?: Operation
  req: PayloadRequest
}): Promise<{
  isPreviewEnabled?: boolean
  previewURL?: string
}> => {
  const collectionConfig = collectionSlug
    ? req.payload.collections[collectionSlug]?.config
    : undefined

  const globalConfig = globalSlug ? config.globals.find((g) => g.slug === globalSlug) : undefined

  const enabled = isPreviewEnabled({
    collectionConfig,
    globalConfig,
  })

  if (!enabled) {
    return {}
  }

  const generatePreviewURL = collectionConfig?.admin?.preview || globalConfig?.admin?.preview
  const token = extractJWT(req)
  let previewURL: string | undefined

  if (typeof generatePreviewURL === 'function' && operation !== 'create') {
    try {
      const result = await generatePreviewURL(data, { locale: req.locale, req, token })

      if (typeof result === 'string') {
        previewURL = result
      }
    } catch (err) {
      req.payload.logger.error({
        err,
        msg: `There was an error executing the live preview URL function for ${collectionSlug || globalSlug}`,
      })
    }
  }

  return { isPreviewEnabled: enabled, previewURL }
}
```

--------------------------------------------------------------------------------

---[FILE: handleTakeOver.tsx]---
Location: payload-main/packages/ui/src/utilities/handleTakeOver.tsx

```typescript
import type { ClientUser } from 'payload'

export interface HandleTakeOverParams {
  clearRouteCache?: () => void
  collectionSlug?: string
  documentLockStateRef: React.RefObject<{
    hasShownLockedModal: boolean
    isLocked: boolean
    user: ClientUser | number | string
  }>
  globalSlug?: string
  id: number | string
  isLockingEnabled: boolean
  isWithinDoc: boolean
  setCurrentEditor: (value: React.SetStateAction<ClientUser | number | string>) => void
  setIsReadOnlyForIncomingUser?: (value: React.SetStateAction<boolean>) => void
  updateDocumentEditor: (
    docID: number | string,
    slug: string,
    user: ClientUser | number | string,
  ) => Promise<void>
  user: ClientUser | number | string
}

export const handleTakeOver = async ({
  id,
  clearRouteCache,
  collectionSlug,
  documentLockStateRef,
  globalSlug,
  isLockingEnabled,
  isWithinDoc,
  setCurrentEditor,
  setIsReadOnlyForIncomingUser,
  updateDocumentEditor,
  user,
}: HandleTakeOverParams): Promise<void> => {
  if (!isLockingEnabled) {
    return
  }

  try {
    // Call updateDocumentEditor to update the document's owner to the current user
    await updateDocumentEditor(id, collectionSlug ?? globalSlug, user)

    if (!isWithinDoc) {
      documentLockStateRef.current.hasShownLockedModal = true
    }

    // Update the locked state to reflect the current user as the owner
    documentLockStateRef.current = {
      hasShownLockedModal: documentLockStateRef.current?.hasShownLockedModal,
      isLocked: true,
      user,
    }
    setCurrentEditor(user)

    // If this is a takeover within the document, ensure the document is editable
    if (isWithinDoc && setIsReadOnlyForIncomingUser) {
      setIsReadOnlyForIncomingUser(false)
    }

    // Need to clear the route cache to refresh the page and update readOnly state for server rendered components
    if (clearRouteCache) {
      clearRouteCache()
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during document takeover:', error)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: hasOptionLabelJSXElement.ts]---
Location: payload-main/packages/ui/src/utilities/hasOptionLabelJSXElement.ts

```typescript
import type { DefaultCellComponentProps } from 'payload'

import { isValidReactElement } from './isValidReactElement.js'

export const hasOptionLabelJSXElement = (cellClientProps: DefaultCellComponentProps) => {
  const { cellData, field } = cellClientProps

  if ((field?.type === 'select' || field?.type == 'radio') && Array.isArray(field?.options)) {
    const matchingOption = field.options.find(
      (option) => typeof option === 'object' && option.value === cellData,
    )

    if (
      matchingOption &&
      typeof matchingOption === 'object' &&
      isValidReactElement(matchingOption.label)
    ) {
      return true
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: hasSavePermission.ts]---
Location: payload-main/packages/ui/src/utilities/hasSavePermission.ts

```typescript
import type {
  SanitizedCollectionPermission,
  SanitizedDocumentPermissions,
  SanitizedGlobalPermission,
} from 'payload'

export const hasSavePermission = (args: {
  /*
   * Pass either `collectionSlug` or `globalSlug`
   */
  collectionSlug?: string
  docPermissions: SanitizedDocumentPermissions
  /*
   * Pass either `collectionSlug` or `globalSlug`
   */
  globalSlug?: string
  isEditing: boolean
}) => {
  const { collectionSlug, docPermissions, globalSlug, isEditing } = args

  if (collectionSlug) {
    return Boolean(
      (isEditing && docPermissions?.update) ||
        (!isEditing && (docPermissions as SanitizedCollectionPermission)?.create),
    )
  }

  if (globalSlug) {
    return Boolean((docPermissions as SanitizedGlobalPermission)?.update)
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: isClientUserObject.ts]---
Location: payload-main/packages/ui/src/utilities/isClientUserObject.ts

```typescript
import type { ClientUser } from 'payload'

export const isClientUserObject = (user): user is ClientUser => {
  return user && typeof user === 'object'
}
```

--------------------------------------------------------------------------------

---[FILE: isEditing.ts]---
Location: payload-main/packages/ui/src/utilities/isEditing.ts

```typescript
export const isEditing = ({
  id,
  collectionSlug,
  globalSlug,
}: {
  collectionSlug?: string
  globalSlug?: string
  id?: number | string
}): boolean => Boolean(globalSlug || (collectionSlug && !!id))
```

--------------------------------------------------------------------------------

---[FILE: isURLAllowed.ts]---
Location: payload-main/packages/ui/src/utilities/isURLAllowed.ts

```typescript
import type { AllowList } from 'payload'

export const isURLAllowed = (url: string, allowList: AllowList): boolean => {
  try {
    const parsedUrl = new URL(url)

    return allowList.some((allowItem) => {
      return Object.entries(allowItem).every(([key, value]) => {
        // Skip undefined or null values
        if (!value) {
          return true
        }
        // Compare protocol with colon
        if (key === 'protocol') {
          return typeof value === 'string' && parsedUrl.protocol === `${value}:`
        }

        if (key === 'pathname') {
          // Convert wildcards to a regex
          const regexPattern = value
            .replace(/\*\*/g, '.*') // Match any path
            .replace(/\*/g, '[^/]*') // Match any part of a path segment
          const regex = new RegExp(`^${regexPattern}$`)
          return regex.test(parsedUrl.pathname)
        }

        // Default comparison for all other properties (hostname, port, search)
        return parsedUrl[key as keyof URL] === value
      })
    })
  } catch {
    return false // If the URL is invalid, deny by default
  }
}
```

--------------------------------------------------------------------------------

---[FILE: isValidReactElement.ts]---
Location: payload-main/packages/ui/src/utilities/isValidReactElement.ts
Signals: React

```typescript
import React, { type ReactElement } from 'react'

const LazyReactComponentSymbol = Symbol.for('react.lazy')

/**
 * Since Next.js 15.4, `React.isValidElement()` returns `false` for components that cross the server-client boundary.
 * This utility expands on that check so that it returns true for valid React elements.
 */
export function isValidReactElement<P>(object: {} | null | undefined): object is ReactElement<P> {
  return React.isValidElement(object) || object?.['$$typeof'] === LazyReactComponentSymbol
}
```

--------------------------------------------------------------------------------

---[FILE: normalizeRelationshipValue.spec.ts]---
Location: payload-main/packages/ui/src/utilities/normalizeRelationshipValue.spec.ts

```typescript
import { describe, expect, it } from '@jest/globals'

import { normalizeRelationshipValue } from './normalizeRelationshipValue.js'

describe('normalizeRelationshipValue', () => {
  describe('Monomorphic relationships (string relationTo)', () => {
    const relationTo = 'users'

    it('should return simple string ID as-is', () => {
      const result = normalizeRelationshipValue('user123', relationTo)
      expect(result).toBe('user123')
    })

    it('should return simple number ID as-is', () => {
      const result = normalizeRelationshipValue(123, relationTo)
      expect(result).toBe(123)
    })

    it('should extract ID from object with relationTo and value', () => {
      const value = { relationTo: 'users', value: 'user456' }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('user456')
    })

    it('should extract ID from nested value structure', () => {
      const value = {
        relationTo: 'users',
        value: {
          value: 'user789',
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('user789')
    })

    it('should extract ID from deeply nested value structure', () => {
      const value = {
        relationTo: 'users',
        value: {
          value: {
            value: 'user999',
          },
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('user999')
    })

    it('should extract ID from populated document', () => {
      const value = {
        relationTo: 'users',
        value: {
          id: 'user111',
          name: 'John Doe',
          email: 'john@example.com',
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('user111')
    })

    it('should extract ID from populated document without relationTo wrapper', () => {
      const value = {
        id: 'user222',
        name: 'Jane Doe',
        email: 'jane@example.com',
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('user222')
    })

    it('should handle null values', () => {
      const result = normalizeRelationshipValue(null, relationTo)
      expect(result).toBeNull()
    })

    it('should handle undefined values', () => {
      const result = normalizeRelationshipValue(undefined, relationTo)
      expect(result).toBeUndefined()
    })

    it('should handle empty object', () => {
      const result = normalizeRelationshipValue({}, relationTo)
      expect(result).toEqual({})
    })
  })

  describe('Polymorphic relationships (array relationTo)', () => {
    const relationTo = ['users', 'posts', 'pages']

    it('should return simple string ID as-is', () => {
      const result = normalizeRelationshipValue('user123', relationTo)
      expect(result).toBe('user123')
    })

    it('should return simple number ID as-is', () => {
      const result = normalizeRelationshipValue(456, relationTo)
      expect(result).toBe(456)
    })

    it('should preserve relationTo structure with string value', () => {
      const value = { relationTo: 'users', value: 'user789' }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'users', value: 'user789' })
    })

    it('should preserve relationTo structure with number value', () => {
      const value = { relationTo: 'posts', value: 123 }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'posts', value: 123 })
    })

    it('should extract ID from nested value structure', () => {
      const value = {
        relationTo: 'posts',
        value: {
          value: 'post456',
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'posts', value: 'post456' })
    })

    it('should extract ID from deeply nested value structure', () => {
      const value = {
        relationTo: 'pages',
        value: {
          value: {
            value: 'page789',
          },
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'pages', value: 'page789' })
    })

    it('should extract ID from populated document', () => {
      const value = {
        relationTo: 'users',
        value: {
          id: 'user999',
          name: 'John Smith',
          email: 'john.smith@example.com',
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'users', value: 'user999' })
    })

    it('should extract ID from complex populated document', () => {
      const value = {
        relationTo: 'posts',
        value: {
          id: 'post123',
          title: 'My Post',
          author: {
            id: 'author456',
            name: 'Author Name',
          },
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toEqual({ relationTo: 'posts', value: 'post123' })
    })

    it('should handle different relationTo values', () => {
      const values = [
        { relationTo: 'users', value: 'user1' },
        { relationTo: 'posts', value: 'post2' },
        { relationTo: 'pages', value: 'page3' },
      ]

      const results = values.map((v) => normalizeRelationshipValue(v, relationTo))

      expect(results).toEqual([
        { relationTo: 'users', value: 'user1' },
        { relationTo: 'posts', value: 'post2' },
        { relationTo: 'pages', value: 'page3' },
      ])
    })

    it('should handle null values', () => {
      const result = normalizeRelationshipValue(null, relationTo)
      expect(result).toBeNull()
    })

    it('should handle undefined values', () => {
      const result = normalizeRelationshipValue(undefined, relationTo)
      expect(result).toBeUndefined()
    })

    it('should extract ID from populated document without relationTo wrapper', () => {
      const value = {
        id: 'doc123',
        title: 'Document Title',
      }
      const result = normalizeRelationshipValue(value, relationTo)
      expect(result).toBe('doc123')
    })
  })

  describe('Edge cases', () => {
    it('should handle object with only value property (no relationTo)', () => {
      const value = { value: 'someValue' }
      const result = normalizeRelationshipValue(value, 'users')
      // Since there's no 'id' field and no relationTo, it should return the value as-is
      expect(result).toEqual({ value: 'someValue' })
    })

    it('should handle object with relationTo but no value', () => {
      const value = { relationTo: 'users' }
      const result = normalizeRelationshipValue(value, ['users', 'posts'])
      expect(result).toEqual({ relationTo: 'users' })
    })

    it('should handle empty array relationTo', () => {
      const result = normalizeRelationshipValue('user123', [])
      expect(result).toBe('user123')
    })

    it('should handle single-item array relationTo as polymorphic', () => {
      const value = { relationTo: 'users', value: 'user123' }
      const result = normalizeRelationshipValue(value, ['users'])
      expect(result).toEqual({ relationTo: 'users', value: 'user123' })
    })

    it('should handle numeric IDs in populated documents', () => {
      const value = {
        relationTo: 'users',
        value: {
          id: 12345,
          name: 'User with numeric ID',
        },
      }
      const result = normalizeRelationshipValue(value, ['users', 'posts'])
      expect(result).toEqual({ relationTo: 'users', value: 12345 })
    })

    it('should handle nested null values', () => {
      const value = {
        relationTo: 'users',
        value: null,
      }
      const result = normalizeRelationshipValue(value, 'users')
      expect(result).toBeNull()
    })

    it('should handle zero as a valid ID', () => {
      const result = normalizeRelationshipValue(0, 'users')
      expect(result).toBe(0)
    })

    it('should handle empty string as a valid ID', () => {
      const result = normalizeRelationshipValue('', 'users')
      expect(result).toBe('')
    })

    it('should handle false as a value', () => {
      const result = normalizeRelationshipValue(false, 'users')
      expect(result).toBe(false)
    })

    it('should handle array values (return as-is)', () => {
      const result = normalizeRelationshipValue(['user1', 'user2'], 'users')
      expect(result).toEqual(['user1', 'user2'])
    })
  })

  describe('Real-world scenarios', () => {
    it('should normalize upload field value for monomorphic upload', () => {
      // Upload field with populated media document
      const value = {
        id: 'media123',
        filename: 'image.jpg',
        mimeType: 'image/jpeg',
        filesize: 12345,
        url: '/media/image.jpg',
      }
      const result = normalizeRelationshipValue(value, 'media')
      expect(result).toBe('media123')
    })

    it('should normalize upload field value for polymorphic upload', () => {
      // Upload field with relationTo structure
      const value = {
        relationTo: 'images',
        value: {
          id: 'image456',
          filename: 'photo.png',
          url: '/media/photo.png',
        },
      }
      const result = normalizeRelationshipValue(value, ['images', 'videos'])
      expect(result).toEqual({ relationTo: 'images', value: 'image456' })
    })

    it('should normalize form submission data', () => {
      // Data coming from form with populated relationship
      const value = {
        relationTo: 'posts',
        value: {
          id: 'post789',
          title: 'Blog Post Title',
          author: { id: 'author123', name: 'Author' },
          publishedDate: '2023-12-01',
        },
      }
      const result = normalizeRelationshipValue(value, ['posts', 'pages'])
      expect(result).toEqual({ relationTo: 'posts', value: 'post789' })
    })

    it('should normalize API response with nested relationships', () => {
      // Complex nested structure from API
      const value = {
        relationTo: 'categories',
        value: {
          value: {
            id: 'cat123',
            name: 'Category Name',
          },
        },
      }
      const result = normalizeRelationshipValue(value, ['categories', 'tags'])
      expect(result).toEqual({ relationTo: 'categories', value: 'cat123' })
    })

    it('should handle table cell data normalization', () => {
      // Cell data from table that might be just an ID
      const simpleValue = 'user123'
      const result = normalizeRelationshipValue(simpleValue, 'users')
      expect(result).toBe('user123')

      // Cell data with full structure
      const complexValue = {
        relationTo: 'users',
        value: {
          id: 'user456',
          name: 'John Doe',
        },
      }
      const result2 = normalizeRelationshipValue(complexValue, ['users', 'admins'])
      expect(result2).toEqual({ relationTo: 'users', value: 'user456' })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: normalizeRelationshipValue.ts]---
Location: payload-main/packages/ui/src/utilities/normalizeRelationshipValue.ts

```typescript
/**
 * Normalizes relationship/upload field values by extracting IDs from nested objects
 * and returning them in the appropriate format based on whether the field is polymorphic.
 *
 * @param value - The value to normalize (can be a simple ID, or an object with relationTo and value)
 * @param relationTo - The relationTo config (string for monomorphic, array for polymorphic)
 * @returns The normalized value (simple ID for monomorphic, {relationTo, value} for polymorphic)
 *
 * @example
 * // Monomorphic field - returns simple ID
 * normalizeRelationshipValue('123', 'users') // '123'
 * normalizeRelationshipValue({ relationTo: 'users', value: '123' }, 'users') // '123'
 *
 * @example
 * // Polymorphic field - returns {relationTo, value}
 * normalizeRelationshipValue('123', ['users', 'posts']) // '123' (kept as-is, no relationTo to infer)
 * normalizeRelationshipValue({ relationTo: 'users', value: '123' }, ['users', 'posts'])
 * // { relationTo: 'users', value: '123' }
 *
 * @example
 * // Handles nested value objects (populated documents)
 * normalizeRelationshipValue(
 *   { relationTo: 'users', value: { id: '123', name: 'John' } },
 *   ['users', 'posts']
 * )
 * // { relationTo: 'users', value: '123' }
 */
export function normalizeRelationshipValue(value: any, relationTo: string | string[]): any {
  const isPoly = Array.isArray(relationTo)

  // If it's already a simple ID (string or number), return as-is for non-poly or wrap for poly
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  // If it's an object with relationTo and value
  if (value && typeof value === 'object' && 'relationTo' in value && 'value' in value) {
    // Extract the actual ID value, handling nested objects
    let idValue: any = value.value
    while (idValue && typeof idValue === 'object' && idValue !== null && 'value' in idValue) {
      idValue = idValue.value
    }

    // If the nested value is a populated document with an ID, extract it
    if (idValue && typeof idValue === 'object' && idValue !== null && 'id' in idValue) {
      idValue = idValue.id
    }

    // Return the normalized structure
    if (isPoly) {
      return { relationTo: value.relationTo, value: idValue }
    }
    return idValue
  }

  // If it's a populated document object (has id but no relationTo/value structure)
  if (value && typeof value === 'object' && 'id' in value) {
    return value.id
  }

  return value
}
```

--------------------------------------------------------------------------------

---[FILE: parseSearchParams.ts]---
Location: payload-main/packages/ui/src/utilities/parseSearchParams.ts
Signals: Next.js

```typescript
import type { ReadonlyURLSearchParams } from 'next/navigation.js'

import * as qs from 'qs-esm'

/**
 * A utility function to parse URLSearchParams into a ParsedQs object.
 * This function is a wrapper around the `qs` library.
 * In Next.js, the `useSearchParams()` hook from `next/navigation` returns a `URLSearchParams` object.
 * This function can be used to parse that object into a more usable format.
 * @param {ReadonlyURLSearchParams} searchParams - The URLSearchParams object to parse.
 * @returns {qs.ParsedQs} - The parsed query string object.
 */
export function parseSearchParams(searchParams: ReadonlyURLSearchParams): qs.ParsedQs {
  const search = searchParams.toString()

  return qs.parse(search, {
    depth: 10,
    ignoreQueryPrefix: true,
  })
}
```

--------------------------------------------------------------------------------

````
