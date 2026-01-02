---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 405
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 405 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/DocumentInfo/index.tsx
Signals: React

```typescript
'use client'
import type { ClientUser, DocumentPreferences } from 'payload'

import * as qs from 'qs-esm'
import React, { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useControllableState } from '../../hooks/useControllableState.js'
import { useAuth } from '../../providers/Auth/index.js'
import { requests } from '../../utilities/api.js'
import { formatDocTitle } from '../../utilities/formatDocTitle/index.js'
import { useConfig } from '../Config/index.js'
import { DocumentTitleProvider } from '../DocumentTitle/index.js'
import { useLocale, useLocaleLoading } from '../Locale/index.js'
import { usePreferences } from '../Preferences/index.js'
import { useTranslation } from '../Translation/index.js'
import { UploadEditsProvider, useUploadEdits } from '../UploadEdits/index.js'
import { type DocumentInfoContext, type DocumentInfoProps } from './types.js'
import { useGetDocPermissions } from './useGetDocPermissions.js'

const Context = createContext({} as DocumentInfoContext)

export type * from './types.js'

export const useDocumentInfo = (): DocumentInfoContext => use(Context)

const DocumentInfo: React.FC<
  {
    readonly children: React.ReactNode
  } & DocumentInfoProps
> = ({ children, ...props }) => {
  const {
    id,
    collectionSlug,
    currentEditor: currentEditorFromProps,
    docPermissions: docPermissionsFromProps,
    globalSlug,
    hasPublishedDoc: hasPublishedDocFromProps,
    hasPublishPermission: hasPublishPermissionFromProps,
    hasSavePermission: hasSavePermissionFromProps,
    initialData,
    initialState,
    isLocked: isLockedFromProps,
    lastUpdateTime: lastUpdateTimeFromProps,
    mostRecentVersionIsAutosaved: mostRecentVersionIsAutosavedFromProps,
    unpublishedVersionCount: unpublishedVersionCountFromProps,
    versionCount: versionCountFromProps,
  } = props

  const [docPermissions, setDocPermissions] = useControllableState(docPermissionsFromProps)

  const [hasSavePermission, setHasSavePermission] = useControllableState(hasSavePermissionFromProps)

  const [hasPublishPermission, setHasPublishPermission] = useControllableState(
    hasPublishPermissionFromProps,
  )

  const { permissions } = useAuth()

  const {
    config: {
      admin: { dateFormat },
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const globalConfig = getEntityConfig({ globalSlug })

  const abortControllerRef = useRef(new AbortController())
  const docConfig = collectionConfig || globalConfig

  const { i18n } = useTranslation()

  const { uploadEdits } = useUploadEdits()

  /**
   * @deprecated This state will be removed in v4.
   * This is for performance reasons. Use the `DocumentTitleContext` instead.
   */
  const [title, setDocumentTitle] = useState(() =>
    formatDocTitle({
      collectionConfig,
      data: { ...(initialData || {}), id },
      dateFormat,
      fallback: id?.toString(),
      globalConfig,
      i18n,
    }),
  )

  const [mostRecentVersionIsAutosaved, setMostRecentVersionIsAutosaved] = useState(
    mostRecentVersionIsAutosavedFromProps,
  )

  const [versionCount, setVersionCount] = useState(versionCountFromProps)

  const [hasPublishedDoc, setHasPublishedDoc] = useState(hasPublishedDocFromProps)

  const [unpublishedVersionCount, setUnpublishedVersionCount] = useState(
    unpublishedVersionCountFromProps,
  )

  const [documentIsLocked, setDocumentIsLocked] = useControllableState<boolean | undefined>(
    isLockedFromProps,
  )

  const [currentEditor, setCurrentEditor] = useControllableState<ClientUser | null>(
    currentEditorFromProps,
  )
  const [lastUpdateTime, setLastUpdateTime] = useControllableState<number>(lastUpdateTimeFromProps)

  const [data, setData] = useControllableState(initialData)

  const [uploadStatus, setUploadStatus] = useControllableState<'failed' | 'idle' | 'uploading'>(
    'idle',
  )

  const documentLockState = useRef<{
    hasShownLockedModal: boolean
    isLocked: boolean
    user: ClientUser | number | string
  } | null>({
    hasShownLockedModal: false,
    isLocked: false,
    user: null,
  })

  const updateUploadStatus = useCallback(
    (status: 'failed' | 'idle' | 'uploading') => {
      setUploadStatus(status)
    },
    [setUploadStatus],
  )

  const { getPreference, setPreference } = usePreferences()
  const { code: locale } = useLocale()
  const { localeIsLoading } = useLocaleLoading()

  const isInitializing = useMemo(
    () => initialState === undefined || initialData === undefined || localeIsLoading,
    [initialData, initialState, localeIsLoading],
  )

  const baseURL = `${serverURL}${api}`
  let slug: string
  let pluralType: 'collections' | 'globals'
  let preferencesKey: string

  if (globalSlug) {
    slug = globalSlug
    pluralType = 'globals'
    preferencesKey = `global-${slug}`
  }

  if (collectionSlug) {
    slug = collectionSlug
    pluralType = 'collections'

    if (id) {
      preferencesKey = `collection-${slug}-${id}`
    }
  }

  const unlockDocument = useCallback(
    async (docID: number | string, slug: string) => {
      try {
        const isGlobal = slug === globalSlug

        const request = await requests.get(`${serverURL}${api}/payload-locked-documents`, {
          credentials: 'include',
          params: isGlobal
            ? {
                'where[globalSlug][equals]': slug,
              }
            : {
                'where[document.relationTo][equals]': slug,
                'where[document.value][equals]': docID,
              },
        })

        const { docs } = await request.json()

        if (docs?.length > 0) {
          const lockID = docs[0].id
          await requests.delete(`${serverURL}${api}/payload-locked-documents/${lockID}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          setDocumentIsLocked(false)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to unlock the document', error)
      }
    },
    [serverURL, api, globalSlug, setDocumentIsLocked],
  )

  const updateDocumentEditor = useCallback(
    async (docID: number | string, slug: string, user: ClientUser | number | string) => {
      try {
        const isGlobal = slug === globalSlug

        // Check if the document is already locked
        const request = await requests.get(`${serverURL}${api}/payload-locked-documents`, {
          credentials: 'include',
          params: isGlobal
            ? {
                'where[globalSlug][equals]': slug,
              }
            : {
                'where[document.relationTo][equals]': slug,
                'where[document.value][equals]': docID,
              },
        })

        const { docs } = await request.json()

        if (docs?.length > 0) {
          const lockID = docs[0].id

          const userData =
            typeof user === 'object'
              ? { relationTo: user.collection, value: user.id }
              : { relationTo: 'users', value: user }

          // Send a patch request to update the _lastEdited info
          await requests.patch(`${serverURL}${api}/payload-locked-documents/${lockID}`, {
            body: JSON.stringify({
              user: userData,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update the document editor', error)
      }
    },
    [serverURL, api, globalSlug],
  )

  const getDocPermissions = useGetDocPermissions({
    id: id as string,
    api,
    collectionSlug,
    globalSlug,
    i18n,
    locale,
    permissions,
    serverURL,
    setDocPermissions,
    setHasPublishPermission,
    setHasSavePermission,
  })

  const getDocPreferences = useCallback(() => {
    return getPreference<DocumentPreferences>(preferencesKey)
  }, [getPreference, preferencesKey])

  const setDocFieldPreferences = useCallback<DocumentInfoContext['setDocFieldPreferences']>(
    async (path, fieldPreferences) => {
      const allPreferences = await getDocPreferences()

      if (preferencesKey) {
        try {
          await setPreference(preferencesKey, {
            ...allPreferences,
            fields: {
              ...(allPreferences?.fields || {}),
              [path]: {
                ...allPreferences?.fields?.[path],
                ...fieldPreferences,
              },
            },
          })
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }
    },
    [setPreference, preferencesKey, getDocPreferences],
  )

  const incrementVersionCount = useCallback(() => {
    const newCount = versionCount + 1
    if (collectionConfig && collectionConfig.versions) {
      if (collectionConfig.versions.maxPerDoc > 0) {
        setVersionCount(Math.min(newCount, collectionConfig.versions.maxPerDoc))
      } else {
        setVersionCount(newCount)
      }
    } else if (globalConfig && globalConfig.versions) {
      if (globalConfig.versions.max > 0) {
        setVersionCount(Math.min(newCount, globalConfig.versions.max))
      } else {
        setVersionCount(newCount)
      }
    }
  }, [collectionConfig, globalConfig, versionCount])

  /**
   * @todo: Remove this in v4
   * Users should use the `DocumentTitleContext` instead.
   */
  useEffect(() => {
    setDocumentTitle(
      formatDocTitle({
        collectionConfig,
        data: { ...data, id },
        dateFormat,
        fallback: id?.toString(),
        globalConfig,
        i18n,
      }),
    )
  }, [collectionConfig, globalConfig, data, dateFormat, i18n, id])

  // clean on unmount
  useEffect(() => {
    const re1 = abortControllerRef.current

    return () => {
      if (re1) {
        try {
          re1.abort()
        } catch (_err) {
          // swallow error
        }
      }
    }
  }, [])

  const action: string = React.useMemo(() => {
    const docURL = `${baseURL}${pluralType === 'globals' ? `/globals` : ''}/${slug}${id ? `/${id}` : ''}`
    const params = {
      depth: 0,
      'fallback-locale': 'null',
      locale,
      uploadEdits: uploadEdits || undefined,
    }

    return `${docURL}${qs.stringify(params, {
      addQueryPrefix: true,
    })}`
  }, [baseURL, locale, pluralType, id, slug, uploadEdits])

  const value: DocumentInfoContext = {
    ...props,
    action,
    currentEditor,
    data,
    docConfig,
    docPermissions,
    documentIsLocked,
    documentLockState,
    getDocPermissions,
    getDocPreferences,
    hasPublishedDoc,
    hasPublishPermission,
    hasSavePermission,
    incrementVersionCount,
    initialData,
    initialState,
    isInitializing,
    lastUpdateTime,
    mostRecentVersionIsAutosaved,
    preferencesKey,
    savedDocumentData: data,
    setCurrentEditor,
    setData,
    setDocFieldPreferences,
    setDocumentIsLocked,
    setDocumentTitle,
    setHasPublishedDoc,
    setLastUpdateTime,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
    setUploadStatus: updateUploadStatus,
    title,
    unlockDocument,
    unpublishedVersionCount,
    updateDocumentEditor,
    updateSavedDocumentData: setData,
    uploadStatus,
    versionCount,
  }

  return (
    <Context value={value}>
      <DocumentTitleProvider>{children}</DocumentTitleProvider>
    </Context>
  )
}

export const DocumentInfoProvider: React.FC<
  {
    readonly children: React.ReactNode
  } & DocumentInfoProps
> = (props) => {
  return (
    <UploadEditsProvider>
      <DocumentInfo {...props} />
    </UploadEditsProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/providers/DocumentInfo/types.ts
Signals: React

```typescript
import type {
  ClientCollectionConfig,
  ClientGlobalConfig,
  ClientUser,
  Data,
  DocumentPreferences,
  FormState,
  InsideFieldsPreferences,
  SanitizedCollectionConfig,
  SanitizedDocumentPermissions,
  SanitizedGlobalConfig,
  TypedUser,
} from 'payload'

import React from 'react'

import type { GetDocPermissions } from './useGetDocPermissions.js'

export type DocumentInfoProps = {
  readonly action?: string
  readonly AfterDocument?: React.ReactNode
  readonly AfterFields?: React.ReactNode
  readonly apiURL?: string
  readonly BeforeFields?: React.ReactNode
  readonly collectionSlug?: SanitizedCollectionConfig['slug']
  readonly currentEditor: TypedUser
  readonly disableActions?: boolean
  readonly disableCreate?: boolean
  readonly disableLeaveWithoutSaving?: boolean
  readonly docPermissions?: SanitizedDocumentPermissions
  readonly globalSlug?: SanitizedGlobalConfig['slug']
  readonly hasPublishedDoc: boolean
  readonly hasPublishPermission?: boolean
  readonly hasSavePermission?: boolean
  readonly id?: number | string
  readonly initialData?: Data
  readonly initialState?: FormState
  readonly isEditing?: boolean
  readonly isLocked: boolean
  readonly isTrashed?: boolean
  readonly lastUpdateTime: number
  readonly mostRecentVersionIsAutosaved: boolean
  readonly redirectAfterCreate?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
  readonly unpublishedVersionCount: number
  readonly Upload?: React.ReactNode
  readonly versionCount: number
}

export type DocumentInfoContext = {
  currentEditor?: ClientUser | null | number | string
  data?: Data
  docConfig?: ClientCollectionConfig | ClientGlobalConfig
  documentIsLocked?: boolean
  documentLockState: React.RefObject<{
    hasShownLockedModal: boolean
    isLocked: boolean
    user: ClientUser | number | string
  } | null>
  getDocPermissions: GetDocPermissions
  getDocPreferences: () => Promise<DocumentPreferences>
  incrementVersionCount: () => void
  isInitializing: boolean
  preferencesKey?: string
  /**
   * @deprecated This property is deprecated and will be removed in v4.
   * Use `data` instead.
   */
  savedDocumentData?: Data
  setCurrentEditor?: React.Dispatch<React.SetStateAction<ClientUser>>
  setData: (data: Data) => void
  setDocFieldPreferences: (
    field: string,
    fieldPreferences: { [key: string]: unknown } & Partial<InsideFieldsPreferences>,
  ) => void
  setDocumentIsLocked?: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * @deprecated This property is deprecated and will be removed in v4.
   * This is for performance reasons. Use the `DocumentTitleContext` instead
   * via the `useDocumentTitle` hook.
   * @example
   * ```tsx
   * import { useDocumentTitle } from '@payloadcms/ui'
   * const { setDocumentTitle } = useDocumentTitle()
   * ```
   */
  setDocumentTitle: React.Dispatch<React.SetStateAction<string>>
  setHasPublishedDoc: React.Dispatch<React.SetStateAction<boolean>>
  setLastUpdateTime: React.Dispatch<React.SetStateAction<number>>
  setMostRecentVersionIsAutosaved: React.Dispatch<React.SetStateAction<boolean>>
  setUnpublishedVersionCount: React.Dispatch<React.SetStateAction<number>>
  setUploadStatus?: (status: 'failed' | 'idle' | 'uploading') => void
  /**
   * @deprecated This property is deprecated and will be removed in v4.
   * This is for performance reasons. Use the `DocumentTitleContext` instead
   * via the `useDocumentTitle` hook.
   * @example
   * ```tsx
   * import { useDocumentTitle } from '@payloadcms/ui'
   * const { title } = useDocumentTitle()
   * ```
   */
  title: string
  unlockDocument: (docID: number | string, slug: string) => Promise<void>
  unpublishedVersionCount: number
  updateDocumentEditor: (docID: number | string, slug: string, user: ClientUser) => Promise<void>
  /**
   * @deprecated This property is deprecated and will be removed in v4.
   * Use `setData` instead.
   */
  updateSavedDocumentData: (data: Data) => void
  uploadStatus?: 'failed' | 'idle' | 'uploading'
  versionCount: number
} & DocumentInfoProps

export const DocumentTitleContext = React.createContext<string>('')
```

--------------------------------------------------------------------------------

---[FILE: useGetDocPermissions.tsx]---
Location: payload-main/packages/ui/src/providers/DocumentInfo/useGetDocPermissions.tsx
Signals: React

```typescript
import type { Data, SanitizedDocumentPermissions, SanitizedPermissions } from 'payload'

import * as qs from 'qs-esm'
import React from 'react'

import { hasSavePermission as getHasSavePermission } from '../../utilities/hasSavePermission.js'
import { isEditing as getIsEditing } from '../../utilities/isEditing.js'

export type GetDocPermissions = (data?: Data) => Promise<void>

export const useGetDocPermissions = ({
  id,
  api,
  collectionSlug,
  globalSlug,
  i18n,
  locale,
  permissions,
  serverURL,
  setDocPermissions,
  setHasPublishPermission,
  setHasSavePermission,
}: {
  api: string
  collectionSlug: string
  globalSlug: string
  i18n: any
  id: string
  locale: string
  permissions: SanitizedPermissions
  serverURL: string
  setDocPermissions: React.Dispatch<React.SetStateAction<SanitizedDocumentPermissions>>
  setHasPublishPermission: React.Dispatch<React.SetStateAction<boolean>>
  setHasSavePermission: React.Dispatch<React.SetStateAction<boolean>>
}): GetDocPermissions =>
  React.useCallback(
    async (data: Data) => {
      const params = {
        locale: locale || undefined,
      }

      const idToUse = data?.id || id
      const newIsEditing = getIsEditing({ id: idToUse, collectionSlug, globalSlug })

      if (newIsEditing) {
        const docAccessURL = collectionSlug
          ? `/${collectionSlug}/access/${idToUse}`
          : globalSlug
            ? `/globals/${globalSlug}/access`
            : null

        if (docAccessURL) {
          const res = await fetch(`${serverURL}${api}${docAccessURL}?${qs.stringify(params)}`, {
            body: JSON.stringify({
              ...(data || {}),
              _status: 'draft',
            }),
            credentials: 'include',
            headers: {
              'Accept-Language': i18n.language,
              'Content-Type': 'application/json',
            },
            method: 'post',
          })

          const json: SanitizedDocumentPermissions = await res.json()

          const publishedAccessJSON = await fetch(
            `${serverURL}${api}${docAccessURL}?${qs.stringify(params)}`,
            {
              body: JSON.stringify({
                ...(data || {}),
                _status: 'published',
              }),
              credentials: 'include',
              headers: {
                'Accept-Language': i18n.language,
                'Content-Type': 'application/json',
              },
              method: 'POST',
            },
          ).then((res) => res.json())

          setDocPermissions(json)

          setHasSavePermission(
            getHasSavePermission({
              collectionSlug,
              docPermissions: json,
              globalSlug,
              isEditing: newIsEditing,
            }),
          )

          setHasPublishPermission(publishedAccessJSON?.update)
        }
      } else {
        // when creating new documents, there is no permissions saved for this document yet
        // use the generic entity permissions instead
        const newDocPermissions = collectionSlug
          ? permissions?.collections?.[collectionSlug]
          : permissions?.globals?.[globalSlug]

        setDocPermissions(newDocPermissions)

        setHasSavePermission(
          getHasSavePermission({
            collectionSlug,
            docPermissions: newDocPermissions,
            globalSlug,
            isEditing: newIsEditing,
          }),
        )
      }
    },
    [
      locale,
      id,
      collectionSlug,
      globalSlug,
      serverURL,
      api,
      i18n.language,
      setDocPermissions,
      setHasSavePermission,
      setHasPublishPermission,
      permissions?.collections,
      permissions?.globals,
    ],
  )
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/DocumentTitle/index.tsx
Signals: React

```typescript
import type { ClientCollectionConfig, ClientGlobalConfig } from 'payload'

import { createContext, use, useEffect, useState } from 'react'

import { formatDocTitle } from '../../utilities/formatDocTitle/index.js'
import { useConfig } from '../Config/index.js'
import { useDocumentInfo } from '../DocumentInfo/index.js'
import { useTranslation } from '../Translation/index.js'

type IDocumentTitleContext = {
  setDocumentTitle: (title: string) => void
  title: string
}

const DocumentTitleContext = createContext({} as IDocumentTitleContext)

export const useDocumentTitle = (): IDocumentTitleContext => use(DocumentTitleContext)

export const DocumentTitleProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { id, collectionSlug, data, docConfig, globalSlug, initialData } = useDocumentInfo()

  const {
    config: {
      admin: { dateFormat },
    },
  } = useConfig()

  const { i18n } = useTranslation()

  const [title, setDocumentTitle] = useState(() =>
    formatDocTitle({
      collectionConfig: collectionSlug ? (docConfig as ClientCollectionConfig) : undefined,
      data: { ...(initialData || {}), id },
      dateFormat,
      fallback: id?.toString(),
      globalConfig: globalSlug ? (docConfig as ClientGlobalConfig) : undefined,
      i18n,
    }),
  )

  useEffect(() => {
    setDocumentTitle(
      formatDocTitle({
        collectionConfig: collectionSlug ? (docConfig as ClientCollectionConfig) : undefined,
        data: { ...data, id },
        dateFormat,
        fallback: id?.toString(),
        globalConfig: globalSlug ? (docConfig as ClientGlobalConfig) : undefined,
        i18n,
      }),
    )
  }, [data, dateFormat, i18n, id, collectionSlug, docConfig, globalSlug])

  return <DocumentTitleContext value={{ setDocumentTitle, title }}>{children}</DocumentTitleContext>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/EditDepth/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

export const EditDepthContext = createContext(0)

export const EditDepthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const parentDepth = useEditDepth()
  const depth = parentDepth + 1

  return <EditDepthContext value={depth}>{children}</EditDepthContext>
}

export const useEditDepth = (): number => use(EditDepthContext)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/EntityVisibility/index.tsx
Signals: React

```typescript
'use client'
import type { SanitizedCollectionConfig, SanitizedGlobalConfig, VisibleEntities } from 'payload'

import React, { createContext, use, useCallback } from 'react'

export type VisibleEntitiesContextType = {
  isEntityVisible: ({
    collectionSlug,
    globalSlug,
  }: {
    collectionSlug?: SanitizedCollectionConfig['slug']
    globalSlug?: SanitizedGlobalConfig['slug']
  }) => boolean
  visibleEntities: VisibleEntities
}

export const EntityVisibilityContext = createContext({} as VisibleEntitiesContextType)

export const EntityVisibilityProvider: React.FC<{
  children: React.ReactNode
  visibleEntities?: VisibleEntities
}> = ({ children, visibleEntities }) => {
  const isEntityVisible = useCallback(
    ({
      collectionSlug,
      globalSlug,
    }: {
      collectionSlug: SanitizedCollectionConfig['slug']
      globalSlug: SanitizedGlobalConfig['slug']
    }) => {
      if (collectionSlug) {
        return visibleEntities.collections.includes(collectionSlug)
      }

      if (globalSlug) {
        return visibleEntities.globals.includes(globalSlug)
      }

      return false
    },
    [visibleEntities],
  )

  return (
    <EntityVisibilityContext value={{ isEntityVisible, visibleEntities }}>
      {children}
    </EntityVisibilityContext>
  )
}

export const useEntityVisibility = (): VisibleEntitiesContextType => use(EntityVisibilityContext)
```

--------------------------------------------------------------------------------

---[FILE: groupItemIDsByRelation.ts]---
Location: payload-main/packages/ui/src/providers/Folders/groupItemIDsByRelation.ts

```typescript
import type { FolderOrDocument } from 'payload/shared'

export function groupItemIDsByRelation(items: FolderOrDocument[]) {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.relationTo]) {
        acc[item.relationTo] = []
      }
      acc[item.relationTo].push(item.value.id)

      return acc
    },
    {} as Record<string, (number | string)[]>,
  )
}
```

--------------------------------------------------------------------------------

````
