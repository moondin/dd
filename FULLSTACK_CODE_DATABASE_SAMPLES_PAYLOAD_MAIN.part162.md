---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 162
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 162 of 695)

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

---[FILE: getMetaBySegment.tsx]---
Location: payload-main/packages/next/src/views/Document/getMetaBySegment.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { EditConfig, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import type { GenerateViewMetadata } from '../Root/index.js'

import { getNextRequestI18n } from '../../utilities/getNextRequestI18n.js'
import { generateAPIViewMetadata } from '../API/metadata.js'
import { generateEditViewMetadata } from '../Edit/metadata.js'
import { generateNotFoundViewMetadata } from '../NotFound/metadata.js'
import { generateVersionViewMetadata } from '../Version/metadata.js'
import { generateVersionsViewMetadata } from '../Versions/metadata.js'
import { getDocumentView } from './getDocumentView.js'

export type GenerateEditViewMetadata = (
  args: {
    collectionConfig?: null | SanitizedCollectionConfig
    globalConfig?: null | SanitizedGlobalConfig
    isReadOnly?: boolean
    view?: keyof EditConfig
  } & Parameters<GenerateViewMetadata>[0],
) => Promise<Metadata>

export const getMetaBySegment: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  params,
}) => {
  const { segments } = params

  let fn: GenerateEditViewMetadata | null = null

  const [segmentOne] = segments
  const isCollection = segmentOne === 'collections'
  const isGlobal = segmentOne === 'globals'

  const isEditing =
    isGlobal || Boolean(isCollection && segments?.length > 2 && segments[2] !== 'create')

  if (isCollection) {
    // `/:collection/:id`
    if (params.segments.length === 3) {
      fn = generateEditViewMetadata
    }

    // `/collections/:collection/trash/:id`
    if (segments.length === 4 && segments[2] === 'trash') {
      fn = (args) => generateEditViewMetadata({ ...args, isReadOnly: true })
    }

    // `/:collection/:id/:view`
    if (params.segments.length === 4) {
      switch (params.segments[3]) {
        case 'api':
          // `/:collection/:id/api`
          fn = generateAPIViewMetadata
          break
        case 'versions':
          // `/:collection/:id/versions`
          fn = generateVersionsViewMetadata
          break
        default:
          break
      }
    }

    // `/:collection/:id/:slug-1/:slug-2`
    if (params.segments.length === 5) {
      switch (params.segments[3]) {
        case 'versions':
          // `/:collection/:id/versions/:version`
          fn = generateVersionViewMetadata
          break
        default:
          break
      }
    }

    // `/collections/:collection/trash/:id/:view`
    if (segments.length === 5 && segments[2] === 'trash') {
      switch (segments[4]) {
        case 'api':
          fn = generateAPIViewMetadata
          break
        case 'versions':
          fn = generateVersionsViewMetadata
          break
        default:
          break
      }
    }

    // `/collections/:collection/trash/:id/versions/:versionID`
    if (segments.length === 6 && segments[2] === 'trash' && segments[4] === 'versions') {
      fn = generateVersionViewMetadata
    }
  }

  if (isGlobal) {
    // `/:global`
    if (params.segments?.length === 2) {
      fn = generateEditViewMetadata
    }

    // `/:global/:view`
    if (params.segments?.length === 3) {
      switch (params.segments[2]) {
        case 'api':
          // `/:global/api`
          fn = generateAPIViewMetadata
          break
        case 'versions':
          // `/:global/versions`
          fn = generateVersionsViewMetadata
          break
        default:
          break
      }
    }

    // `/:global/versions/:version`
    if (params.segments?.length === 4 && params.segments[2] === 'versions') {
      fn = generateVersionViewMetadata
    }
  }

  const i18n = await getNextRequestI18n({
    config,
  })

  if (typeof fn === 'function') {
    return fn({
      collectionConfig,
      config,
      globalConfig,
      i18n,
      isEditing,
    })
  } else {
    const { viewKey } = getDocumentView({
      collectionConfig,
      config,
      docPermissions: {
        create: true,
        delete: true,
        fields: true,
        read: true,
        readVersions: true,
        update: true,
      },
      globalConfig,
      routeSegments: typeof segments === 'string' ? [segments] : segments,
    })

    if (viewKey) {
      const customViewConfig =
        collectionConfig?.admin?.components?.views?.edit?.[viewKey] ||
        globalConfig?.admin?.components?.views?.edit?.[viewKey]

      if (customViewConfig) {
        return generateEditViewMetadata({
          collectionConfig,
          config,
          globalConfig,
          i18n,
          isEditing,
          view: viewKey as keyof EditConfig,
        })
      }
    }
  }

  return generateNotFoundViewMetadata({ config, i18n })
}
```

--------------------------------------------------------------------------------

---[FILE: getVersions.ts]---
Location: payload-main/packages/next/src/views/Document/getVersions.ts

```typescript
import { sanitizeID } from '@payloadcms/ui/shared'
import {
  combineQueries,
  extractAccessFromPermission,
  type Payload,
  type SanitizedCollectionConfig,
  type SanitizedDocumentPermissions,
  type SanitizedGlobalConfig,
  type TypedUser,
} from 'payload'
import { hasAutosaveEnabled, hasDraftsEnabled } from 'payload/shared'

type Args = {
  collectionConfig?: SanitizedCollectionConfig
  /**
   * Optional - performance optimization.
   * If a document has been fetched before fetching versions, pass it here.
   * If this document is set to published, we can skip the query to find out if a published document exists,
   * as the passed in document is proof of its existence.
   */
  doc?: Record<string, any>
  docPermissions: SanitizedDocumentPermissions
  globalConfig?: SanitizedGlobalConfig
  id?: number | string
  locale?: string
  payload: Payload
  user: TypedUser
}

type Result = Promise<{
  hasPublishedDoc: boolean
  mostRecentVersionIsAutosaved: boolean
  unpublishedVersionCount: number
  versionCount: number
}>

// TODO: in the future, we can parallelize some of these queries
// this will speed up the API by ~30-100ms or so
// Note from the future: I have attempted parallelizing these queries, but it made this function almost 2x slower.
export const getVersions = async ({
  id: idArg,
  collectionConfig,
  doc,
  docPermissions,
  globalConfig,
  locale,
  payload,
  user,
}: Args): Result => {
  const id = sanitizeID(idArg)
  let publishedDoc
  let hasPublishedDoc = false
  let mostRecentVersionIsAutosaved = false
  let unpublishedVersionCount = 0
  let versionCount = 0

  const entityConfig = collectionConfig || globalConfig
  const versionsConfig = entityConfig?.versions

  const shouldFetchVersions = Boolean(versionsConfig && docPermissions?.readVersions)

  if (!shouldFetchVersions) {
    // Without readVersions permission, determine published status from the _status field
    const hasPublishedDoc = doc?._status !== 'draft'

    return {
      hasPublishedDoc,
      mostRecentVersionIsAutosaved,
      unpublishedVersionCount,
      versionCount,
    }
  }

  if (collectionConfig) {
    if (!id) {
      return {
        hasPublishedDoc,
        mostRecentVersionIsAutosaved,
        unpublishedVersionCount,
        versionCount,
      }
    }

    if (hasDraftsEnabled(collectionConfig)) {
      // Find out if a published document exists
      if (doc?._status === 'published') {
        publishedDoc = doc
      } else {
        publishedDoc = (
          await payload.find({
            collection: collectionConfig.slug,
            depth: 0,
            limit: 1,
            locale: locale || undefined,
            pagination: false,
            select: {
              updatedAt: true,
            },
            user,
            where: {
              and: [
                {
                  or: [
                    {
                      _status: {
                        equals: 'published',
                      },
                    },
                    {
                      _status: {
                        exists: false,
                      },
                    },
                  ],
                },
                {
                  id: {
                    equals: id,
                  },
                },
              ],
            },
          })
        )?.docs?.[0]
      }

      if (publishedDoc) {
        hasPublishedDoc = true
      }

      if (hasAutosaveEnabled(collectionConfig)) {
        const mostRecentVersion = await payload.findVersions({
          collection: collectionConfig.slug,
          depth: 0,
          limit: 1,
          select: {
            autosave: true,
          },
          user,
          where: combineQueries(
            {
              and: [
                {
                  parent: {
                    equals: id,
                  },
                },
              ],
            },
            extractAccessFromPermission(docPermissions.readVersions),
          ),
        })

        if (
          mostRecentVersion.docs[0] &&
          'autosave' in mostRecentVersion.docs[0] &&
          mostRecentVersion.docs[0].autosave
        ) {
          mostRecentVersionIsAutosaved = true
        }
      }

      if (publishedDoc?.updatedAt) {
        ;({ totalDocs: unpublishedVersionCount } = await payload.countVersions({
          collection: collectionConfig.slug,
          user,
          where: combineQueries(
            {
              and: [
                {
                  parent: {
                    equals: id,
                  },
                },
                {
                  'version._status': {
                    equals: 'draft',
                  },
                },
                {
                  updatedAt: {
                    greater_than: publishedDoc.updatedAt,
                  },
                },
              ],
            },
            extractAccessFromPermission(docPermissions.readVersions),
          ),
        }))
      }
    }

    ;({ totalDocs: versionCount } = await payload.countVersions({
      collection: collectionConfig.slug,
      depth: 0,
      user,
      where: combineQueries(
        {
          and: [
            {
              parent: {
                equals: id,
              },
            },
          ],
        },
        extractAccessFromPermission(docPermissions.readVersions),
      ),
    }))
  }

  if (globalConfig) {
    // Find out if a published document exists
    if (hasDraftsEnabled(globalConfig)) {
      if (doc?._status === 'published') {
        publishedDoc = doc
      } else {
        publishedDoc = await payload.findGlobal({
          slug: globalConfig.slug,
          depth: 0,
          locale,
          select: {
            updatedAt: true,
          },
          user,
        })
      }

      if (publishedDoc?._status === 'published') {
        hasPublishedDoc = true
      }

      if (hasAutosaveEnabled(globalConfig)) {
        const mostRecentVersion = await payload.findGlobalVersions({
          slug: globalConfig.slug,
          limit: 1,
          select: {
            autosave: true,
          },
          user,
        })

        if (
          mostRecentVersion.docs[0] &&
          'autosave' in mostRecentVersion.docs[0] &&
          mostRecentVersion.docs[0].autosave
        ) {
          mostRecentVersionIsAutosaved = true
        }
      }

      if (publishedDoc?.updatedAt) {
        ;({ totalDocs: unpublishedVersionCount } = await payload.countGlobalVersions({
          depth: 0,
          global: globalConfig.slug,
          user,
          where: combineQueries(
            {
              and: [
                {
                  'version._status': {
                    equals: 'draft',
                  },
                },
                {
                  updatedAt: {
                    greater_than: publishedDoc.updatedAt,
                  },
                },
              ],
            },
            extractAccessFromPermission(docPermissions.readVersions),
          ),
        }))
      }
    }

    ;({ totalDocs: versionCount } = await payload.countGlobalVersions({
      depth: 0,
      global: globalConfig.slug,
      user,
    }))
  }

  return {
    hasPublishedDoc,
    mostRecentVersionIsAutosaved,
    unpublishedVersionCount,
    versionCount,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleServerFunction.tsx]---
Location: payload-main/packages/next/src/views/Document/handleServerFunction.tsx
Signals: Next.js

```typescript
import type { RenderDocumentServerFunction } from '@payloadcms/ui'
import type { DocumentPreferences, VisibleEntities } from 'payload'

import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import { headers as getHeaders } from 'next/headers.js'
import { canAccessAdmin, getAccessResults, isEntityHidden, parseCookies } from 'payload'
import { applyLocaleFiltering } from 'payload/shared'

import { renderDocument } from './index.js'

export const renderDocumentHandler: RenderDocumentServerFunction = async (args) => {
  const {
    collectionSlug,
    disableActions,
    docID,
    drawerSlug,
    initialData,
    locale,
    overrideEntityVisibility,
    paramsOverride,
    redirectAfterCreate,
    redirectAfterDelete,
    redirectAfterDuplicate,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      user,
    },
    searchParams = {},
    versions,
  } = args

  const headers = await getHeaders()

  const cookies = parseCookies(headers)

  await canAccessAdmin({ req })

  const clientConfig = getClientConfig({
    config,
    i18n,
    importMap: req.payload.importMap,
    user,
  })
  await applyLocaleFiltering({ clientConfig, config, req })

  let preferences: DocumentPreferences

  if (docID) {
    const preferencesKey = `${collectionSlug}-edit-${docID}`

    preferences = await payload
      .find({
        collection: 'payload-preferences',
        depth: 0,
        limit: 1,
        where: {
          and: [
            {
              key: {
                equals: preferencesKey,
              },
            },
            {
              'user.relationTo': {
                equals: user.collection,
              },
            },
            {
              'user.value': {
                equals: user.id,
              },
            },
          ],
        },
      })
      .then((res) => res.docs[0]?.value as DocumentPreferences)
  }

  const visibleEntities: VisibleEntities = {
    collections: payload.config.collections
      .map(({ slug, admin: { hidden } }) => (!isEntityHidden({ hidden, user }) ? slug : null))
      .filter(Boolean),
    globals: payload.config.globals
      .map(({ slug, admin: { hidden } }) => (!isEntityHidden({ hidden, user }) ? slug : null))
      .filter(Boolean),
  }

  const permissions = await getAccessResults({
    req,
  })

  const { data, Document } = await renderDocument({
    clientConfig,
    disableActions,
    documentSubViewType: 'default',
    drawerSlug,
    i18n,
    importMap: payload.importMap,
    initialData,
    initPageResult: {
      collectionConfig: payload?.collections?.[collectionSlug]?.config,
      cookies,
      docID,
      globalConfig: payload.config.globals.find((global) => global.slug === collectionSlug),
      languageOptions: undefined, // TODO
      locale,
      permissions,
      req,
      translations: undefined, // TODO
      visibleEntities,
    },
    overrideEntityVisibility,
    params: paramsOverride ?? {
      segments: ['collections', collectionSlug, String(docID)],
    },
    payload,
    redirectAfterCreate,
    redirectAfterDelete,
    redirectAfterDuplicate,
    searchParams,
    versions,
    viewType: 'document',
  })

  return {
    data,
    Document,
    preferences,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Document/index.tsx
Signals: React, Next.js

```typescript
import type {
  AdminViewServerProps,
  CollectionPreferences,
  Data,
  DocumentViewClientProps,
  DocumentViewServerProps,
  DocumentViewServerPropsOnly,
  EditViewComponent,
  PayloadComponent,
  RenderDocumentVersionsProperties,
} from 'payload'

import {
  DocumentInfoProvider,
  EditDepthProvider,
  HydrateAuthProvider,
  LivePreviewProvider,
} from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { handleLivePreview, handlePreview } from '@payloadcms/ui/rsc'
import { isEditing as getIsEditing } from '@payloadcms/ui/shared'
import { buildFormState } from '@payloadcms/ui/utilities/buildFormState'
import { notFound, redirect } from 'next/navigation.js'
import { isolateObjectProperty, logError } from 'payload'
import { formatAdminURL, formatApiURL, hasAutosaveEnabled, hasDraftsEnabled } from 'payload/shared'
import React from 'react'

import type { GenerateEditViewMetadata } from './getMetaBySegment.js'

import { DocumentHeader } from '../../elements/DocumentHeader/index.js'
import { getPreferences } from '../../utilities/getPreferences.js'
import { NotFoundView } from '../NotFound/index.js'
import { getDocPreferences } from './getDocPreferences.js'
import { getDocumentData } from './getDocumentData.js'
import { getDocumentPermissions } from './getDocumentPermissions.js'
import { getDocumentView } from './getDocumentView.js'
import { getIsLocked } from './getIsLocked.js'
import { getMetaBySegment } from './getMetaBySegment.js'
import { getVersions } from './getVersions.js'
import { renderDocumentSlots } from './renderDocumentSlots.js'

export const generateMetadata: GenerateEditViewMetadata = async (args) => getMetaBySegment(args)

export type ViewToRender =
  | EditViewComponent
  | PayloadComponent<DocumentViewServerProps>
  | React.FC
  | React.FC<DocumentViewClientProps>

/**
 * This function is responsible for rendering
 * an Edit Document view on the server for both:
 *  - default document edit views
 *  - on-demand edit views within drawers
 */
export const renderDocument = async ({
  disableActions,
  documentSubViewType,
  drawerSlug,
  importMap,
  initialData,
  initPageResult,
  overrideEntityVisibility,
  params,
  redirectAfterCreate,
  redirectAfterDelete,
  redirectAfterDuplicate,
  redirectAfterRestore,
  searchParams,
  versions,
  viewType,
}: {
  drawerSlug?: string
  overrideEntityVisibility?: boolean
  readonly redirectAfterCreate?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
  versions?: RenderDocumentVersionsProperties
} & AdminViewServerProps): Promise<{
  data: Data
  Document: React.ReactNode
}> => {
  const {
    collectionConfig,
    docID: idFromArgs,
    globalConfig,
    locale,
    permissions,
    req,
    req: {
      i18n,
      payload,
      payload: {
        config,
        config: {
          routes: { admin: adminRoute, api: apiRoute },
          serverURL,
        },
      },
      user,
    },
    visibleEntities,
  } = initPageResult

  const segments = Array.isArray(params?.segments) ? params.segments : []
  const collectionSlug = collectionConfig?.slug || undefined
  const globalSlug = globalConfig?.slug || undefined
  let isEditing = getIsEditing({ id: idFromArgs, collectionSlug, globalSlug })

  // Fetch the doc required for the view
  let doc =
    !idFromArgs && !globalSlug
      ? initialData || null
      : await getDocumentData({
          id: idFromArgs,
          collectionSlug,
          globalSlug,
          locale,
          payload,
          req,
          segments,
          user,
        })

  if (isEditing && !doc) {
    // If it's a collection document that doesn't exist, redirect to collection list
    if (collectionSlug) {
      const redirectURL = formatAdminURL({
        adminRoute,
        path: `/collections/${collectionSlug}?notFound=${encodeURIComponent(idFromArgs)}`,
        serverURL,
      })
      redirect(redirectURL)
    } else {
      // For globals or other cases, keep the 404 behavior
      throw new Error('not-found')
    }
  }

  const isTrashedDoc = Boolean(doc && 'deletedAt' in doc && typeof doc?.deletedAt === 'string')

  // CRITICAL FIX FOR TRANSACTION RACE CONDITION:
  // When running parallel operations with Promise.all, if they share the same req object
  // and one operation calls initTransaction() which MUTATES req.transactionID, that mutation
  // is visible to all parallel operations. This causes:
  // 1. Operation A (e.g., getDocumentPermissions → docAccessOperation) calls initTransaction()
  //    which sets req.transactionID = Promise, then resolves it to a UUID
  // 2. Operation B (e.g., getIsLocked) running in parallel receives the SAME req with the mutated transactionID
  // 3. Operation A (does not even know that Operation B even exists and is stil using the transactionID) commits/ends its transaction
  // 4. Operation B tries to use the now-expired session → MongoExpiredSessionError!
  //
  // Solution: Use isolateObjectProperty to create a Proxy that isolates the 'transactionID' property.
  // This allows each operation to have its own transactionID without affecting the parent req.
  // If parent req already has a transaction, preserve it (don't isolate), since this
  // issue only arises when one of the operations calls initTransaction() themselves -
  // because then, that operation will also try to commit/end the transaction itself.

  // If the transactionID is already set, the parallel operations will not try to
  // commit/end the transaction themselves, so we don't need to isolate the
  // transactionID property.
  const reqForPermissions = req.transactionID ? req : isolateObjectProperty(req, 'transactionID')
  const reqForLockCheck = req.transactionID ? req : isolateObjectProperty(req, 'transactionID')

  const [
    docPreferences,
    { docPermissions, hasPublishPermission, hasSavePermission },
    { currentEditor, isLocked, lastUpdateTime },
    entityPreferences,
  ] = await Promise.all([
    // Get document preferences
    getDocPreferences({
      id: idFromArgs,
      collectionSlug,
      globalSlug,
      payload,
      user,
    }),

    // Get permissions - isolated transactionID prevents cross-contamination
    getDocumentPermissions({
      id: idFromArgs,
      collectionConfig,
      data: doc,
      globalConfig,
      req: reqForPermissions,
    }),

    // Fetch document lock state - isolated transactionID prevents cross-contamination
    getIsLocked({
      id: idFromArgs,
      collectionConfig,
      globalConfig,
      isEditing,
      req: reqForLockCheck,
    }),

    // get entity preferences
    getPreferences<CollectionPreferences>(
      collectionSlug ? `collection-${collectionSlug}` : `global-${globalSlug}`,
      payload,
      req.user.id,
      req.user.collection,
    ),
  ])

  const operation = (collectionSlug && idFromArgs) || globalSlug ? 'update' : 'create'

  const [
    { hasPublishedDoc, mostRecentVersionIsAutosaved, unpublishedVersionCount, versionCount },
    { state: formState },
  ] = await Promise.all([
    getVersions({
      id: idFromArgs,
      collectionConfig,
      doc,
      docPermissions,
      globalConfig,
      locale: locale?.code,
      payload,
      user,
    }),
    buildFormState({
      id: idFromArgs,
      collectionSlug,
      data: doc,
      docPermissions,
      docPreferences,
      fallbackLocale: false,
      globalSlug,
      locale: locale?.code,
      operation,
      readOnly: isTrashedDoc || isLocked,
      renderAllFields: true,
      req,
      schemaPath: collectionSlug || globalSlug,
      skipValidation: true,
    }),
  ])

  const documentViewServerProps: DocumentViewServerPropsOnly = {
    doc,
    hasPublishedDoc,
    i18n,
    initPageResult,
    locale,
    params,
    payload,
    permissions,
    routeSegments: segments,
    searchParams,
    user,
    versions,
  }

  if (
    !overrideEntityVisibility &&
    ((collectionSlug &&
      !visibleEntities?.collections?.find((visibleSlug) => visibleSlug === collectionSlug)) ||
      (globalSlug && !visibleEntities?.globals?.find((visibleSlug) => visibleSlug === globalSlug)))
  ) {
    throw new Error('not-found')
  }

  const formattedParams = new URLSearchParams()

  if (hasDraftsEnabled(collectionConfig || globalConfig)) {
    formattedParams.append('draft', 'true')
  }

  if (locale?.code) {
    formattedParams.append('locale', locale.code)
  }

  const apiQueryParams = `?${formattedParams.toString()}`

  const apiURL = formatApiURL({
    apiRoute,
    path: collectionSlug
      ? `/${collectionSlug}/${idFromArgs}${apiQueryParams}`
      : globalSlug
        ? `/${globalSlug}${apiQueryParams}`
        : '',
    serverURL,
  })

  let View: ViewToRender = null

  let showHeader = true

  const RootViewOverride =
    collectionConfig?.admin?.components?.views?.edit?.root &&
    'Component' in collectionConfig.admin.components.views.edit.root
      ? collectionConfig?.admin?.components?.views?.edit?.root?.Component
      : globalConfig?.admin?.components?.views?.edit?.root &&
          'Component' in globalConfig.admin.components.views.edit.root
        ? globalConfig?.admin?.components?.views?.edit?.root?.Component
        : null

  if (RootViewOverride) {
    View = RootViewOverride
    showHeader = false
  } else {
    ;({ View } = getDocumentView({
      collectionConfig,
      config,
      docPermissions,
      globalConfig,
      routeSegments: segments,
    }))
  }

  if (!View) {
    View = NotFoundView
  }

  /**
   * Handle case where autoSave is enabled and the document is being created
   * => create document and redirect
   */
  const shouldAutosave = hasSavePermission && hasAutosaveEnabled(collectionConfig || globalConfig)

  const validateDraftData =
    collectionConfig?.versions?.drafts && collectionConfig?.versions?.drafts?.validate

  let id = idFromArgs

  if (shouldAutosave && !validateDraftData && !idFromArgs && collectionSlug) {
    doc = await payload.create({
      collection: collectionSlug,
      data: initialData || {},
      depth: 0,
      draft: true,
      fallbackLocale: false,
      locale: locale?.code,
      req,
      user,
    })

    if (doc?.id) {
      id = doc.id
      isEditing = getIsEditing({ id: doc.id, collectionSlug, globalSlug })

      if (!drawerSlug && redirectAfterCreate !== false) {
        const redirectURL = formatAdminURL({
          adminRoute,
          path: `/collections/${collectionSlug}/${doc.id}`,
          serverURL,
        })

        redirect(redirectURL)
      }
    } else {
      throw new Error('not-found')
    }
  }

  const documentSlots = renderDocumentSlots({
    id,
    collectionConfig,
    globalConfig,
    hasSavePermission,
    permissions: docPermissions,
    req,
  })

  // Extract Description from documentSlots to pass to DocumentHeader
  const { Description } = documentSlots

  const clientProps: DocumentViewClientProps = {
    formState,
    ...documentSlots,
    documentSubViewType,
    viewType,
  }

  const { isLivePreviewEnabled, livePreviewConfig, livePreviewURL } = await handleLivePreview({
    collectionSlug,
    config,
    data: doc,
    globalSlug,
    operation,
    req,
  })

  const { isPreviewEnabled, previewURL } = await handlePreview({
    collectionSlug,
    config,
    data: doc,
    globalSlug,
    operation,
    req,
  })

  return {
    data: doc,
    Document: (
      <DocumentInfoProvider
        apiURL={apiURL}
        collectionSlug={collectionConfig?.slug}
        currentEditor={currentEditor}
        disableActions={disableActions ?? false}
        docPermissions={docPermissions}
        globalSlug={globalConfig?.slug}
        hasPublishedDoc={hasPublishedDoc}
        hasPublishPermission={hasPublishPermission}
        hasSavePermission={hasSavePermission}
        id={id}
        initialData={doc}
        initialState={formState}
        isEditing={isEditing}
        isLocked={isLocked}
        isTrashed={isTrashedDoc}
        key={locale?.code}
        lastUpdateTime={lastUpdateTime}
        mostRecentVersionIsAutosaved={mostRecentVersionIsAutosaved}
        redirectAfterCreate={redirectAfterCreate}
        redirectAfterDelete={redirectAfterDelete}
        redirectAfterDuplicate={redirectAfterDuplicate}
        redirectAfterRestore={redirectAfterRestore}
        unpublishedVersionCount={unpublishedVersionCount}
        versionCount={versionCount}
      >
        <LivePreviewProvider
          breakpoints={livePreviewConfig?.breakpoints}
          isLivePreviewEnabled={isLivePreviewEnabled && operation !== 'create'}
          isLivePreviewing={Boolean(
            entityPreferences?.value?.editViewType === 'live-preview' && livePreviewURL,
          )}
          isPreviewEnabled={Boolean(isPreviewEnabled)}
          previewURL={previewURL}
          typeofLivePreviewURL={typeof livePreviewConfig?.url as 'function' | 'string' | undefined}
          url={livePreviewURL}
        >
          {showHeader && !drawerSlug && (
            <DocumentHeader
              AfterHeader={Description}
              collectionConfig={collectionConfig}
              globalConfig={globalConfig}
              permissions={permissions}
              req={req}
            />
          )}
          <HydrateAuthProvider permissions={permissions} />
          <EditDepthProvider>
            {RenderServerComponent({
              clientProps,
              Component: View,
              importMap,
              serverProps: documentViewServerProps,
            })}
          </EditDepthProvider>
        </LivePreviewProvider>
      </DocumentInfoProvider>
    ),
  }
}

export async function DocumentView(props: AdminViewServerProps) {
  try {
    const { Document: RenderedDocument } = await renderDocument(props)
    return RenderedDocument
  } catch (error) {
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }

    logError({ err: error, payload: props.initPageResult.req.payload })

    if (error.message === 'not-found') {
      notFound()
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Document/metadata.ts

```typescript
import type { GenerateEditViewMetadata } from './getMetaBySegment.js'

import { getMetaBySegment } from './getMetaBySegment.js'

export const generateDocumentViewMetadata: GenerateEditViewMetadata = async (args) =>
  getMetaBySegment(args)
```

--------------------------------------------------------------------------------

---[FILE: renderDocumentSlots.tsx]---
Location: payload-main/packages/next/src/views/Document/renderDocumentSlots.tsx

```typescript
import type {
  BeforeDocumentControlsServerPropsOnly,
  DocumentSlots,
  EditMenuItemsServerPropsOnly,
  PayloadRequest,
  PreviewButtonServerPropsOnly,
  PublishButtonServerPropsOnly,
  SanitizedCollectionConfig,
  SanitizedDocumentPermissions,
  SanitizedGlobalConfig,
  SaveButtonServerPropsOnly,
  SaveDraftButtonServerPropsOnly,
  ServerFunction,
  ServerProps,
  StaticDescription,
  ViewDescriptionClientProps,
  ViewDescriptionServerPropsOnly,
} from 'payload'

import { ViewDescription } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { hasDraftsEnabled } from 'payload/shared'

import { getDocumentPermissions } from './getDocumentPermissions.js'

export const renderDocumentSlots: (args: {
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  hasSavePermission: boolean
  id?: number | string
  permissions: SanitizedDocumentPermissions
  req: PayloadRequest
}) => DocumentSlots = (args) => {
  const { id, collectionConfig, globalConfig, hasSavePermission, req } = args

  const components: DocumentSlots = {} as DocumentSlots

  const unsavedDraftWithValidations = undefined

  const isPreviewEnabled = collectionConfig?.admin?.preview || globalConfig?.admin?.preview

  const serverProps: ServerProps = {
    id,
    i18n: req.i18n,
    payload: req.payload,
    user: req.user,
    // TODO: Add remaining serverProps
  }

  const BeforeDocumentControls =
    collectionConfig?.admin?.components?.edit?.beforeDocumentControls ||
    globalConfig?.admin?.components?.elements?.beforeDocumentControls

  if (BeforeDocumentControls) {
    components.BeforeDocumentControls = RenderServerComponent({
      Component: BeforeDocumentControls,
      importMap: req.payload.importMap,
      serverProps: serverProps satisfies BeforeDocumentControlsServerPropsOnly,
    })
  }

  const EditMenuItems = collectionConfig?.admin?.components?.edit?.editMenuItems

  if (EditMenuItems) {
    components.EditMenuItems = RenderServerComponent({
      Component: EditMenuItems,
      importMap: req.payload.importMap,
      serverProps: serverProps satisfies EditMenuItemsServerPropsOnly,
    })
  }

  const CustomPreviewButton =
    collectionConfig?.admin?.components?.edit?.PreviewButton ||
    globalConfig?.admin?.components?.elements?.PreviewButton

  if (isPreviewEnabled && CustomPreviewButton) {
    components.PreviewButton = RenderServerComponent({
      Component: CustomPreviewButton,
      importMap: req.payload.importMap,
      serverProps: serverProps satisfies PreviewButtonServerPropsOnly,
    })
  }

  const LivePreview =
    collectionConfig?.admin?.components?.views?.edit?.livePreview ||
    globalConfig?.admin?.components?.views?.edit?.livePreview

  if (LivePreview?.Component) {
    components.LivePreview = RenderServerComponent({
      Component: LivePreview.Component,
      importMap: req.payload.importMap,
      serverProps,
    })
  }

  const descriptionFromConfig =
    collectionConfig?.admin?.description || globalConfig?.admin?.description

  const staticDescription: StaticDescription =
    typeof descriptionFromConfig === 'function'
      ? descriptionFromConfig({ t: req.i18n.t })
      : descriptionFromConfig

  const CustomDescription =
    collectionConfig?.admin?.components?.Description ||
    globalConfig?.admin?.components?.elements?.Description

  const hasDescription = CustomDescription || staticDescription

  if (hasDescription) {
    components.Description = RenderServerComponent({
      clientProps: {
        collectionSlug: collectionConfig?.slug,
        description: staticDescription,
      } satisfies ViewDescriptionClientProps,
      Component: CustomDescription,
      Fallback: ViewDescription,
      importMap: req.payload.importMap,
      serverProps: serverProps satisfies ViewDescriptionServerPropsOnly,
    })
  }

  if (hasSavePermission) {
    if (hasDraftsEnabled(collectionConfig || globalConfig)) {
      const CustomPublishButton =
        collectionConfig?.admin?.components?.edit?.PublishButton ||
        globalConfig?.admin?.components?.elements?.PublishButton

      if (CustomPublishButton) {
        components.PublishButton = RenderServerComponent({
          Component: CustomPublishButton,
          importMap: req.payload.importMap,
          serverProps: serverProps satisfies PublishButtonServerPropsOnly,
        })
      }

      const CustomSaveDraftButton =
        collectionConfig?.admin?.components?.edit?.SaveDraftButton ||
        globalConfig?.admin?.components?.elements?.SaveDraftButton

      const draftsEnabled = hasDraftsEnabled(collectionConfig || globalConfig)

      if ((draftsEnabled || unsavedDraftWithValidations) && CustomSaveDraftButton) {
        components.SaveDraftButton = RenderServerComponent({
          Component: CustomSaveDraftButton,
          importMap: req.payload.importMap,
          serverProps: serverProps satisfies SaveDraftButtonServerPropsOnly,
        })
      }
    } else {
      const CustomSaveButton =
        collectionConfig?.admin?.components?.edit?.SaveButton ||
        globalConfig?.admin?.components?.elements?.SaveButton

      if (CustomSaveButton) {
        components.SaveButton = RenderServerComponent({
          Component: CustomSaveButton,
          importMap: req.payload.importMap,
          serverProps: serverProps satisfies SaveButtonServerPropsOnly,
        })
      }
    }
  }

  if (collectionConfig?.upload && collectionConfig?.admin?.components?.edit?.Upload) {
    components.Upload = RenderServerComponent({
      Component: collectionConfig.admin.components.edit.Upload,
      importMap: req.payload.importMap,
      serverProps,
    })
  }

  if (collectionConfig?.upload && collectionConfig.upload.admin?.components?.controls) {
    components.UploadControls = RenderServerComponent({
      Component: collectionConfig.upload.admin.components.controls,
      importMap: req.payload.importMap,
      serverProps,
    })
  }

  return components
}

export const renderDocumentSlotsHandler: ServerFunction<{
  collectionSlug: string
  id?: number | string
}> = async (args) => {
  const { id, collectionSlug, req } = args

  const collectionConfig = req.payload.collections[collectionSlug]?.config

  if (!collectionConfig) {
    throw new Error(req.t('error:incorrectCollection'))
  }

  const { docPermissions, hasSavePermission } = await getDocumentPermissions({
    collectionConfig,
    data: {},
    req,
  })

  return renderDocumentSlots({
    id,
    collectionConfig,
    hasSavePermission,
    permissions: docPermissions,
    req,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Edit/index.tsx
Signals: React

```typescript
'use client'

import type { DocumentViewClientProps } from 'payload'

import { DefaultEditView } from '@payloadcms/ui'
import React from 'react'

export const EditView: React.FC<DocumentViewClientProps> = (props) => {
  return <DefaultEditView {...props} />
}
```

--------------------------------------------------------------------------------

````
