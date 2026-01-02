---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 257
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 257 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/plugin-search/src/types.ts

```typescript
import type {
  CollectionAfterChangeHook,
  CollectionBeforeDeleteHook,
  CollectionConfig,
  Field,
  Locale,
  Payload,
  PayloadRequest,
  StaticLabel,
} from 'payload'

export type DocToSync = {
  [key: string]: any
  doc: {
    relationTo: string
    value: string
  }
  title: string
}

export type BeforeSync = (args: {
  originalDoc: {
    [key: string]: any
  }
  payload: Payload
  req: PayloadRequest
  searchDoc: DocToSync
}) => DocToSync | Promise<DocToSync>

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export type SearchPluginConfig = {
  /**
   * @deprecated
   * This plugin gets the api route from the config directly and does not need to be passed in.
   * As long as you have `routes.api` set in your Payload config, the plugin will use that.
   * This property will be removed in the next major version.
   */
  apiBasePath?: string
  beforeSync?: BeforeSync
  collections?: string[]
  defaultPriorities?: {
    [collection: string]: ((doc: any) => number | Promise<number>) | number
  }
  /**
   * Controls whether drafts are deleted from the search index
   *
   * @default true
   */
  deleteDrafts?: boolean
  localize?: boolean
  /**
   * We use batching when re-indexing large collections. You can control the amount of items per batch, lower numbers should help with memory.
   *
   * @default 50
   */
  reindexBatchSize?: number
  searchOverrides?: { fields?: FieldsOverride } & Partial<Omit<CollectionConfig, 'fields'>>
  /**
   * Controls whether drafts are synced to the search index
   *
   * @default false
   */
  syncDrafts?: boolean
}

export type CollectionLabels = {
  [collection: string]: CollectionConfig['labels']
}

export type ResolvedCollectionLabels = {
  [collection: string]: StaticLabel
}

export type SearchPluginConfigWithLocales = {
  labels?: CollectionLabels
  locales?: string[]
} & SearchPluginConfig

export type SanitizedSearchPluginConfig = {
  reindexBatchSize: number
  syncDrafts: boolean
} & SearchPluginConfigWithLocales

export type SyncWithSearchArgs = {
  collection: string
  pluginConfig: SanitizedSearchPluginConfig
} & Omit<Parameters<CollectionAfterChangeHook>[0], 'collection'>

export type SyncDocArgs = {
  locale?: Locale['code']
  onSyncError?: () => void
} & Omit<SyncWithSearchArgs, 'context' | 'previousDoc'>

// Extend the `CollectionAfterChangeHook` with more function args
// Convert the `collection` arg from `SanitizedCollectionConfig` to a string
export type SyncWithSearch = (Args: SyncWithSearchArgs) => ReturnType<CollectionAfterChangeHook>

export type DeleteFromSearch = (args: SearchPluginConfig) => CollectionBeforeDeleteHook
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-search/src/exports/client.ts

```typescript
export { LinkToDoc } from '../Search/ui/LinkToDoc/index.js'
export { ReindexButton } from '../Search/ui/ReindexButton/index.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-search/src/exports/types.ts

```typescript
export type { BeforeSync, DocToSync, SearchPluginConfig, SyncWithSearch } from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-search/src/Search/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { SanitizedSearchPluginConfig } from '../types.js'
import type { ReindexButtonServerProps } from './ui/ReindexButton/types.js'

import { generateReindexHandler } from '../utilities/generateReindexHandler.js'

// all settings can be overridden by the config
export const generateSearchCollection = (
  pluginConfig: SanitizedSearchPluginConfig,
): CollectionConfig => {
  const searchSlug = pluginConfig?.searchOverrides?.slug || 'search'
  const searchCollections = pluginConfig?.collections || []
  const collectionLabels = pluginConfig?.labels

  const defaultFields: Field[] = [
    {
      name: 'title',
      type: 'text',
      admin: {
        readOnly: true,
      },
      localized: pluginConfig.localize,
    },
    {
      name: 'priority',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'doc',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      maxDepth: 0,
      relationTo: searchCollections,
      required: true,
    },
    {
      name: 'docUrl',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '@payloadcms/plugin-search/client#LinkToDoc',
          },
        },
        position: 'sidebar',
      },
    },
  ]

  if (!collectionLabels) {
    throw new Error('collectionLabels is required')
  }

  const newConfig: CollectionConfig = {
    ...(pluginConfig?.searchOverrides || {}),
    slug: searchSlug,
    access: {
      create: (): boolean => false,
      read: (): boolean => true,
      ...(pluginConfig?.searchOverrides?.access || {}),
    },
    admin: {
      components: {
        views: {
          list: {
            actions: [
              {
                path: '@payloadcms/plugin-search/client#ReindexButton',
                serverProps: {
                  collectionLabels,
                  searchCollections,
                  searchSlug,
                } satisfies ReindexButtonServerProps,
              },
            ],
          },
        },
      },
      defaultColumns: ['title'],
      description:
        'This is a collection of automatically created search results. These results are used by the global site search and will be updated automatically as documents in the CMS are created or updated.',
      enableRichTextRelationship: false,
      useAsTitle: 'title',
      ...(pluginConfig?.searchOverrides?.admin || {}),
    },
    endpoints: [
      ...(pluginConfig?.searchOverrides?.endpoints || []),
      {
        handler: generateReindexHandler(pluginConfig),
        method: 'post',
        path: '/reindex',
      },
    ],
    fields:
      pluginConfig?.searchOverrides?.fields &&
      typeof pluginConfig?.searchOverrides?.fields === 'function'
        ? pluginConfig?.searchOverrides.fields({ defaultFields })
        : defaultFields,
    labels: {
      ...(pluginConfig?.searchOverrides?.labels || {
        plural: 'Search Results',
        singular: 'Search Result',
      }),
    },
  }

  return newConfig
}
```

--------------------------------------------------------------------------------

---[FILE: deleteFromSearch.ts]---
Location: payload-main/packages/plugin-search/src/Search/hooks/deleteFromSearch.ts

```typescript
import type { DeleteFromSearch } from '../../types.js'

export const deleteFromSearch: DeleteFromSearch =
  (pluginConfig) =>
  async ({ id, collection, req: { payload }, req }) => {
    const searchSlug = pluginConfig?.searchOverrides?.slug || 'search'

    try {
      await payload.delete({
        collection: searchSlug,
        depth: 0,
        req,
        where: {
          'doc.relationTo': {
            equals: collection.slug,
          },
          'doc.value': {
            equals: id,
          },
        },
      })
    } catch (err: unknown) {
      payload.logger.error({
        err,
        msg: `Error deleting ${searchSlug} doc.`,
      })
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: syncWithSearch.ts]---
Location: payload-main/packages/plugin-search/src/Search/hooks/syncWithSearch.ts

```typescript
import type { SyncWithSearch } from '../../types.js'

import { syncDocAsSearchIndex } from '../../utilities/syncDocAsSearchIndex.js'

export const syncWithSearch: SyncWithSearch = (args) => {
  return syncDocAsSearchIndex(args)
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-search/src/Search/ui/LinkToDoc/index.client.tsx
Signals: React

```typescript
'use client'

import { CopyToClipboard, Link, useConfig, useField } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

export const LinkToDocClient: React.FC = () => {
  const { config } = useConfig()

  const {
    routes: {
      admin: adminRoute, // already includes leading slash
    },
    serverURL,
  } = config

  const { value } = useField<{ relationTo?: string; value?: string }>({ path: 'doc' })

  if (!value?.relationTo || !value?.value) {
    return null
  }

  const href = `${serverURL}${formatAdminURL({
    adminRoute,
    path: `/collections/${value.relationTo || ''}/${value.value || ''}`,
    serverURL,
  })}`

  const hrefToDisplay = `${process.env.NEXT_BASE_PATH || ''}${href}`

  return (
    <div style={{ marginBottom: 'var(--spacing-field, 1rem)' }}>
      <div>
        <span
          className="label"
          style={{
            color: '#9A9A9A',
          }}
        >
          Doc URL
        </span>
        <CopyToClipboard value={hrefToDisplay} />
      </div>
      <div
        style={{
          fontWeight: '600',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <Link href={href} passHref {...{ rel: 'noopener noreferrer', target: '_blank' }}>
          {hrefToDisplay}
        </Link>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-search/src/Search/ui/LinkToDoc/index.tsx
Signals: React

```typescript
import type { UIField } from 'payload'

import React from 'react'

import { LinkToDocClient } from './index.client.js'

export const LinkToDoc: React.FC<UIField> = () => {
  return <LinkToDocClient />
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-search/src/Search/ui/ReindexButton/index.client.tsx
Signals: React, Next.js

```typescript
'use client'

import {
  ConfirmationModal,
  Popup,
  PopupList,
  toast,
  useConfig,
  useLocale,
  useModal,
  useTranslation,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import React, { useCallback, useMemo, useState } from 'react'

import type { ReindexButtonProps } from './types.js'

import { ReindexButtonLabel } from './ReindexButtonLabel/index.js'

const confirmReindexModalSlug = 'confirm-reindex-modal'

export const ReindexButtonClient: React.FC<ReindexButtonProps> = ({
  collectionLabels,
  searchCollections,
  searchSlug,
}) => {
  const { openModal } = useModal()

  const { config } = useConfig()

  const {
    i18n: { t },
  } = useTranslation()

  const locale = useLocale()
  const router = useRouter()

  const [reindexCollections, setReindexCollections] = useState<string[]>([])

  const openConfirmModal = useCallback(() => openModal(confirmReindexModalSlug), [openModal])

  const handleReindexSubmit = useCallback(async () => {
    if (!reindexCollections.length) {
      return
    }

    try {
      const res = await fetch(`${config.routes.api}/${searchSlug}/reindex?locale=${locale.code}`, {
        body: JSON.stringify({
          collections: reindexCollections,
        }),
        method: 'POST',
      })

      const { message } = (await res.json()) as { message: string }

      if (!res.ok) {
        toast.error(message)
      } else {
        toast.success(message)
        return router.refresh()
      }
    } catch (_err: unknown) {
      // swallow error, toast shown above
    } finally {
      setReindexCollections([])
    }
  }, [reindexCollections, router, searchSlug, locale, config])

  const handleShowConfirmModal = useCallback(
    (collections: string | string[] = searchCollections) => {
      setReindexCollections(typeof collections === 'string' ? [collections] : collections)
      openConfirmModal()
    },
    [openConfirmModal, searchCollections],
  )

  const handlePopupButtonClick = useCallback(
    (closePopup: () => void, slug?: string) => {
      closePopup()
      handleShowConfirmModal(slug)
    },
    [handleShowConfirmModal],
  )

  const getPluralizedLabel = useCallback(
    (slug: string) => {
      const label = collectionLabels[slug]
      if (typeof label === 'string') {
        return label
      } else {
        return label && Object.hasOwn(label, locale.code) ? label[locale.code] : slug
      }
    },
    [collectionLabels, locale.code],
  )

  const pluralizedLabels = useMemo(() => {
    return searchCollections.reduce<Record<string, string>>((acc, slug) => {
      const label = getPluralizedLabel(slug)
      if (label) {
        acc[slug] = label
      }
      return acc
    }, {})
  }, [searchCollections, getPluralizedLabel])

  const selectedAll = reindexCollections.length === searchCollections.length
  const selectedLabels = reindexCollections.map((slug) => pluralizedLabels[slug]).join(', ')

  const modalTitle = selectedAll
    ? t('general:confirmReindexAll')
    : t('general:confirmReindex', { collections: selectedLabels })
  const modalDescription = selectedAll
    ? t('general:confirmReindexDescriptionAll')
    : t('general:confirmReindexDescription', { collections: selectedLabels })

  return (
    <div>
      <Popup
        button={<ReindexButtonLabel />}
        render={({ close }) => (
          <PopupList.ButtonGroup>
            {searchCollections.map((collectionSlug) => (
              <PopupList.Button
                key={collectionSlug}
                onClick={() => handlePopupButtonClick(close, collectionSlug)}
              >
                {pluralizedLabels[collectionSlug]}
              </PopupList.Button>
            ))}
            <PopupList.Button onClick={() => handlePopupButtonClick(close)}>
              {t('general:allCollections')}
            </PopupList.Button>
          </PopupList.ButtonGroup>
        )}
        showScrollbar
        size="large"
        verticalAlign="bottom"
      />
      <ConfirmationModal
        body={modalDescription}
        heading={modalTitle}
        modalSlug={confirmReindexModalSlug}
        onConfirm={handleReindexSubmit}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-search/src/Search/ui/ReindexButton/index.tsx

```typescript
import type { ResolvedCollectionLabels } from '../../../types.js'
import type { SearchReindexButtonServerComponent } from './types.js'

import { ReindexButtonClient } from './index.client.js'

export const ReindexButton: SearchReindexButtonServerComponent = (props) => {
  const { collectionLabels, i18n, searchCollections, searchSlug } = props

  const resolvedCollectionLabels: ResolvedCollectionLabels = Object.fromEntries(
    searchCollections.map((collection) => {
      const labels = collectionLabels[collection]
      const pluralLabel = labels?.plural

      if (typeof pluralLabel === 'function') {
        // @ts-expect-error - I don't know why it gives an error. pluralLabel and i18n.t should both resolve to TFunction<DefaultTranslationKeys>
        return [collection, pluralLabel({ t: i18n.t })]
      }

      if (pluralLabel) {
        return [collection, pluralLabel]
      }

      return [collection, collection]
    }),
  )

  return (
    <ReindexButtonClient
      collectionLabels={resolvedCollectionLabels}
      searchCollections={searchCollections}
      searchSlug={searchSlug}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-search/src/Search/ui/ReindexButton/types.ts

```typescript
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import type { CollectionLabels, ResolvedCollectionLabels } from '../../../types.js'

export type ReindexButtonProps = {
  collectionLabels: ResolvedCollectionLabels
  searchCollections: string[]
  searchSlug: string
}

export type ReindexButtonServerProps = {
  collectionLabels: CollectionLabels
} & Omit<ReindexButtonProps, 'collectionLabels'>

export type SearchReindexButtonClientComponent = ReindexButtonProps

export type SearchReindexButtonServerComponent = PayloadServerReactComponent<
  CustomComponent<ReindexButtonServerProps>
>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-search/src/Search/ui/ReindexButton/ReindexButtonLabel/index.tsx

```typescript
import { ChevronIcon, Pill, useTranslation } from '@payloadcms/ui'

export const ReindexButtonLabel = () => {
  const {
    i18n: { t },
  } = useTranslation()
  return (
    <Pill className="pill--has-action" icon={<ChevronIcon />} pillStyle="light" size="small">
      {t('general:reindex')}
    </Pill>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: generateReindexHandler.ts]---
Location: payload-main/packages/plugin-search/src/utilities/generateReindexHandler.ts

```typescript
import type { PayloadHandler, Where } from 'payload'

import {
  addLocalesToRequestFromData,
  commitTransaction,
  getAccessResults,
  headersWithCors,
  initTransaction,
  killTransaction,
} from 'payload'

import type { SanitizedSearchPluginConfig } from '../types.js'

import { syncDocAsSearchIndex } from './syncDocAsSearchIndex.js'

type ValidationResult = {
  isValid: boolean
  message?: string
}

export const generateReindexHandler =
  (pluginConfig: SanitizedSearchPluginConfig): PayloadHandler =>
  async (req) => {
    addLocalesToRequestFromData(req)
    if (!req.json) {
      return new Response('Req.json is undefined', { status: 400 })
    }
    const { collections = [] } = (await req.json()) as { collections: string[] }
    const t = req.t

    const searchSlug = pluginConfig?.searchOverrides?.slug || 'search'
    const searchCollections = pluginConfig?.collections || []
    const reindexLocales = pluginConfig?.locales?.length
      ? pluginConfig.locales
      : req.locale
        ? [req.locale]
        : []

    const validatePermissions = async (): Promise<ValidationResult> => {
      const accessResults = await getAccessResults({ req })
      const searchAccessResults = accessResults.collections?.[searchSlug]
      if (!searchAccessResults) {
        return { isValid: false, message: t('error:notAllowedToPerformAction') }
      }

      const permissions = [searchAccessResults.delete, searchAccessResults.update]
      // plugin doesn't allow create by default:
      // if user provided, then add it to check
      if (pluginConfig.searchOverrides?.access?.create) {
        permissions.push(searchAccessResults.create)
      }
      // plugin allows reads by anyone by default:
      // so if user provided, then add to check
      if (pluginConfig.searchOverrides?.access?.read) {
        permissions.push(searchAccessResults.read)
      }
      return permissions.every(Boolean)
        ? { isValid: true }
        : { isValid: false, message: t('error:notAllowedToPerformAction') }
    }

    const validateCollections = (): ValidationResult => {
      const collectionsAreValid = collections.every((col) => searchCollections.includes(col))
      return collections.length && collectionsAreValid
        ? { isValid: true }
        : { isValid: false, message: t('error:invalidRequestArgs', { args: `'collections'` }) }
    }

    const headers = headersWithCors({
      headers: new Headers(),
      req,
    })

    const { isValid: hasPermissions, message: permissionError } = await validatePermissions()
    if (!hasPermissions) {
      return Response.json({ message: permissionError }, { headers, status: 401 })
    }

    const { isValid: validCollections, message: collectionError } = validateCollections()
    if (!validCollections) {
      return Response.json({ message: collectionError }, { headers, status: 400 })
    }

    const payload = req.payload
    const { reindexBatchSize: batchSize, syncDrafts } = pluginConfig

    const defaultLocalApiProps = {
      overrideAccess: false,
      req,
      user: req.user,
    }
    const whereStatusPublished: Where = {
      _status: {
        equals: 'published',
      },
    }
    let aggregateDocsWithDrafts = 0
    let aggregateErrors = 0
    let aggregateDocs = 0

    const countDocuments = async (collection: string, drafts?: boolean): Promise<number> => {
      const { totalDocs } = await payload.count({
        collection,
        ...defaultLocalApiProps,
        req: undefined,
        where: drafts ? undefined : whereStatusPublished,
      })
      return totalDocs
    }

    const deleteIndexes = async (collection: string) => {
      await payload.delete({
        collection: searchSlug,
        depth: 0,
        select: { id: true },
        where: { 'doc.relationTo': { equals: collection } },
        ...defaultLocalApiProps,
      })
    }

    const reindexCollection = async (collection: string) => {
      const draftsEnabled = Boolean(payload.collections[collection]?.config.versions?.drafts)

      const totalDocsWithDrafts = await countDocuments(collection, true)
      const totalDocs =
        syncDrafts || !draftsEnabled
          ? totalDocsWithDrafts
          : await countDocuments(collection, !draftsEnabled)
      const totalBatches = Math.ceil(totalDocs / batchSize)

      aggregateDocsWithDrafts += totalDocsWithDrafts
      aggregateDocs += totalDocs

      for (let j = 0; j < reindexLocales.length; j++) {
        // create first index, then we update with other locales accordingly
        const operation = j === 0 ? 'create' : 'update'
        const localeToSync = reindexLocales[j]

        for (let i = 0; i < totalBatches; i++) {
          const { docs } = await payload.find({
            collection,
            depth: 0,
            limit: batchSize,
            locale: localeToSync,
            page: i + 1,
            where: syncDrafts || !draftsEnabled ? undefined : whereStatusPublished,
            ...defaultLocalApiProps,
          })

          for (const doc of docs) {
            await syncDocAsSearchIndex({
              collection,
              data: doc,
              doc,
              locale: localeToSync,
              onSyncError: () => operation === 'create' && aggregateErrors++,
              operation,
              pluginConfig,
              req,
            })
          }
        }
      }
    }

    const shouldCommit = await initTransaction(req)

    try {
      const promises = collections.map(async (collection) => {
        try {
          await deleteIndexes(collection)
          await reindexCollection(collection)
        } catch (err) {
          const message = t('error:unableToReindexCollection', { collection })
          payload.logger.error({ err, msg: message })
        }
      })

      await Promise.all(promises)
    } catch (err: any) {
      if (shouldCommit) {
        await killTransaction(req)
      }
      return Response.json({ message: err.message }, { headers, status: 500 })
    }

    const message = t('general:successfullyReindexed', {
      collections: collections.join(', '),
      count: aggregateDocs - aggregateErrors,
      skips: syncDrafts ? 0 : aggregateDocsWithDrafts - aggregateDocs,
      total: aggregateDocsWithDrafts,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return Response.json({ message }, { headers, status: 200 })
  }
```

--------------------------------------------------------------------------------

---[FILE: syncDocAsSearchIndex.ts]---
Location: payload-main/packages/plugin-search/src/utilities/syncDocAsSearchIndex.ts

```typescript
import type { DocToSync, SyncDocArgs } from '../types.js'

export const syncDocAsSearchIndex = async ({
  collection,
  doc,
  locale,
  onSyncError,
  operation,
  pluginConfig,
  req: { payload },
  req,
}: SyncDocArgs) => {
  const { id, _status: status, title } = doc || {}

  const { beforeSync, defaultPriorities, deleteDrafts, searchOverrides, syncDrafts } = pluginConfig

  const searchSlug = searchOverrides?.slug || 'search'
  const syncLocale = locale || req.locale

  let dataToSave: DocToSync = {
    doc: {
      relationTo: collection,
      value: id,
    },
    title,
  }
  const docKeyPrefix = `${collection}:${id}`
  const docKey = pluginConfig.locales?.length ? `${docKeyPrefix}:${syncLocale}` : docKeyPrefix
  const syncedDocsSet = (req.context?.syncedDocsSet as Set<string>) || new Set<string>()

  if (syncedDocsSet.has(docKey)) {
    /*
     * prevents duplicate syncing of documents in the same request
     * this can happen when hooks call `payload.update` within the create lifecycle
     * like the nested-docs plugin does
     */
    return doc
  } else {
    syncedDocsSet.add(docKey)
  }

  req.context.syncedDocsSet = syncedDocsSet

  if (typeof beforeSync === 'function') {
    let docToSyncWith = doc
    if (payload.config?.localization) {
      // Check if document is trashed (has deletedAt field)
      const isTrashDocument = doc && 'deletedAt' in doc && doc.deletedAt

      docToSyncWith = await payload.findByID({
        id,
        collection,
        locale: syncLocale,
        req,
        // Include trashed documents when the document being synced is trashed
        trash: isTrashDocument,
      })
    }
    dataToSave = await beforeSync({
      originalDoc: docToSyncWith,
      payload,
      req,
      searchDoc: dataToSave,
    })
  }

  let defaultPriority = 0
  if (defaultPriorities) {
    const { [collection]: priority } = defaultPriorities

    if (typeof priority === 'function') {
      try {
        defaultPriority = await priority(doc)
      } catch (err: unknown) {
        payload.logger.error(err)
        payload.logger.error(
          `Error gathering default priority for ${searchSlug} documents related to ${collection}`,
        )
      }
    } else if (priority !== undefined) {
      defaultPriority = priority
    }
  }

  const doSync = syncDrafts || (!syncDrafts && status !== 'draft')

  try {
    if (operation === 'create' && doSync) {
      await payload.create({
        collection: searchSlug,
        data: {
          ...dataToSave,
          priority: defaultPriority,
        },
        depth: 0,
        locale: syncLocale,
        req,
      })
    }

    if (operation === 'update') {
      try {
        // find the correct doc to sync with
        const searchDocQuery = await payload.find({
          collection: searchSlug,
          depth: 0,
          locale: syncLocale,
          req,
          where: {
            'doc.relationTo': {
              equals: collection,
            },
            'doc.value': {
              equals: id,
            },
          },
        })

        const docs: Array<{
          id: number | string
          priority?: number
        }> = searchDocQuery?.docs || []

        const [foundDoc, ...duplicativeDocs] = docs

        // delete all duplicative search docs (docs that reference the same page)
        // to ensure the same, out-of-date result does not appear twice (where only syncing the first found doc)
        if (duplicativeDocs.length > 0) {
          try {
            const duplicativeDocIDs = duplicativeDocs.map(({ id }) => id)
            await payload.delete({
              collection: searchSlug,
              depth: 0,
              req,
              where: { id: { in: duplicativeDocIDs } },
            })
          } catch (err: unknown) {
            payload.logger.error({
              err,
              msg: `Error deleting duplicative ${searchSlug} documents.`,
            })
          }
        }

        if (foundDoc) {
          const { id: searchDocID } = foundDoc

          if (doSync) {
            // update the doc normally
            try {
              await payload.update({
                id: searchDocID,
                collection: searchSlug,
                data: {
                  ...dataToSave,
                  priority: foundDoc.priority || defaultPriority,
                },
                depth: 0,
                locale: syncLocale,
                req,
              })
            } catch (err: unknown) {
              payload.logger.error({ err, msg: `Error updating ${searchSlug} document.` })
            }
          }

          // Check if document is trashed and delete from search
          const isTrashDocument = doc && 'deletedAt' in doc && doc.deletedAt

          if (isTrashDocument) {
            try {
              await payload.delete({
                id: searchDocID,
                collection: searchSlug,
                depth: 0,
                req,
              })
            } catch (err: unknown) {
              payload.logger.error({
                err,
                msg: `Error deleting ${searchSlug} document for trashed doc.`,
              })
            }
          }

          if (deleteDrafts && status === 'draft') {
            // Check to see if there's a published version of the doc
            // We don't want to remove the search doc if there is a published version but a new draft has been created
            const {
              docs: [docWithPublish],
            } = await payload.find({
              collection,
              depth: 0,
              draft: false,
              limit: 1,
              locale: syncLocale,
              pagination: false,
              req,
              where: {
                and: [
                  {
                    _status: {
                      equals: 'published',
                    },
                  },
                  {
                    id: {
                      equals: id,
                    },
                  },
                ],
              },
            })

            if (!docWithPublish && !isTrashDocument) {
              // do not include draft docs in search results, so delete the record
              try {
                await payload.delete({
                  id: searchDocID,
                  collection: searchSlug,
                  depth: 0,
                  req,
                })
              } catch (err: unknown) {
                payload.logger.error({ err, msg: `Error deleting ${searchSlug} document.` })
              }
            }
          }
        } else if (doSync) {
          try {
            await payload.create({
              collection: searchSlug,
              data: {
                ...dataToSave,
                priority: defaultPriority,
              },
              depth: 0,
              locale: syncLocale,
              req,
            })
          } catch (err: unknown) {
            payload.logger.error({ err, msg: `Error creating ${searchSlug} document.` })
          }
        }
      } catch (err: unknown) {
        payload.logger.error({ err, msg: `Error finding ${searchSlug} document.` })
      }
    }
  } catch (err: unknown) {
    payload.logger.error({
      err,
      msg: `Error syncing ${searchSlug} document related to ${collection} with id: '${id}'.`,
    })

    if (onSyncError) {
      onSyncError()
    }
  }

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-sentry/.gitignore

```text
dev/yarn.lock

# Created by https://www.gitignore.io/api/node,macos,windows,webstorm,sublimetext,visualstudiocode

### macOS ###
*.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*

# Files that might appear in the root of a volume
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent

# Directories potentially created on remote AFP share
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

### Node ###
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Typescript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# Yarn Berry
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
.pnp.*

# dotenv environment variables file
.env


### SublimeText ###
# cache files for sublime text
*.tmlanguage.cache
*.tmPreferences.cache
*.stTheme.cache

# workspace files are user-specific
*.sublime-workspace

# project files should be checked into the repository, unless a significant
# proportion of contributors will probably not be using SublimeText
# *.sublime-project

# sftp configuration file
sftp-config.json

# Package control specific files
Package Control.last-run
Package Control.ca-list
Package Control.ca-bundle
Package Control.system-ca-bundle
Package Control.cache/
Package Control.ca-certs/
Package Control.merged-ca-bundle
Package Control.user-ca-bundle
oscrypto-ca-bundle.crt
bh_unicode_properties.cache

# Sublime-github package stores a github token in this file
# https://packagecontrol.io/packages/sublime-github
GitHub.sublime-settings

### VisualStudioCode ###
.vscode/*
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history

### WebStorm ###
# Covers JetBrains IDEs: IntelliJ, RubyMine, PhpStorm, AppCode, PyCharm, CLion, Android Studio and Webstorm
# Reference: https://intellij-support.jetbrains.com/hc/en-us/articles/206544839

.idea/*
# User-specific stuff:
.idea/**/workspace.xml
.idea/**/tasks.xml
.idea/dictionaries

# Sensitive or high-churn files:
.idea/**/dataSources/
.idea/**/dataSources.ids
.idea/**/dataSources.xml
.idea/**/dataSources.local.xml
.idea/**/sqlDataSources.xml
.idea/**/dynamic.xml
.idea/**/uiDesigner.xml

# Gradle:
.idea/**/gradle.xml
.idea/**/libraries

# CMake
cmake-build-debug/

# Mongo Explorer plugin:
.idea/**/mongoSettings.xml

## File-based project format:
*.iws

## Plugin-specific files:

# IntelliJ
/out/

# mpeltonen/sbt-idea plugin
.idea_modules/

# JIRA plugin
atlassian-ide-plugin.xml

# Cursive Clojure plugin
.idea/replstate.xml

# Ruby plugin and RubyMine
/.rakeTasks

# Crashlytics plugin (for Android Studio and IntelliJ)
com_crashlytics_export_strings.xml
crashlytics.properties
crashlytics-build.properties
fabric.properties

### WebStorm Patch ###
# Comment Reason: https://github.com/joeblau/gitignore.io/issues/186#issuecomment-215987721

# *.iml
# modules.xml
# .idea/misc.xml
# *.ipr

# Sonarlint plugin
.idea/sonarlint

### Windows ###
# Windows thumbnail cache files
Thumbs.db
ehthumbs.db
ehthumbs_vista.db

# Folder config file
Desktop.ini

# Recycle Bin used on file shares
$RECYCLE.BIN/

# Windows Installer files
*.cab
*.msi
*.msm
*.msp

# Windows shortcuts
*.lnk

# End of https://www.gitignore.io/api/node,macos,windows,webstorm,sublimetext,visualstudiocode

# Ignore all uploads
demo/upload
demo/media
demo/files

# Ignore build folder
build

# Ignore built components
components/index.js
components/styles.css

# Ignore generated
demo/generated-types.ts
demo/generated-schema.graphql

# Ignore dist, no need for git
dist

# Ignore emulator volumes
src/adapters/s3/emulator/.localstack/
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-sentry/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-build]---
Location: payload-main/packages/plugin-sentry/.swcrc-build

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "exclude": ["/**/mocks", "/**/*.spec.ts"],
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: jest.config.js]---
Location: payload-main/packages/plugin-sentry/jest.config.js

```javascript
import baseConfig from '../../jest.config.js'

/** @type {import('jest').Config} */
const customJestConfig = {
  ...baseConfig,
  setupFilesAfterEnv: null,
  testMatch: ['**/src/**/?(*.)+(spec|test|it-test).[tj]s?(x)'],
  testTimeout: 20000,
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        $schema: 'https://json.schemastore.org/swcrc',
        sourceMaps: true,
        exclude: ['/**/mocks'],
        jsc: {
          target: 'esnext',
          parser: {
            syntax: 'typescript',
            tsx: true,
            dts: true,
          },
        },
        module: {
          type: 'es6',
        },
      },
    ],
  },
}

export default customJestConfig
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-sentry/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

````
