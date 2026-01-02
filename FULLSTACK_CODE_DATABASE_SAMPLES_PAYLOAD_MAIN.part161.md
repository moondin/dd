---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 161
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 161 of 695)

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
Location: payload-main/packages/next/src/views/CreateFirstUser/index.tsx
Signals: React

```typescript
import type {
  AdminViewServerProps,
  SanitizedDocumentPermissions,
  SanitizedFieldsPermissions,
} from 'payload'

import { buildFormState } from '@payloadcms/ui/utilities/buildFormState'
import React from 'react'

import { getDocPreferences } from '../Document/getDocPreferences.js'
import { getDocumentData } from '../Document/getDocumentData.js'
import { CreateFirstUserClient } from './index.client.js'
import './index.scss'

export async function CreateFirstUserView({ initPageResult }: AdminViewServerProps) {
  const {
    locale,
    req,
    req: {
      payload: {
        collections,
        config: {
          admin: { user: userSlug },
        },
      },
    },
  } = initPageResult

  const collectionConfig = collections?.[userSlug]?.config
  const { auth: authOptions } = collectionConfig
  const loginWithUsername = authOptions.loginWithUsername

  // Fetch the data required for the view
  const data = await getDocumentData({
    collectionSlug: collectionConfig.slug,
    locale,
    payload: req.payload,
    req,
    user: req.user,
  })

  // Get document preferences
  const docPreferences = await getDocPreferences({
    collectionSlug: collectionConfig.slug,
    payload: req.payload,
    user: req.user,
  })

  const baseFields: SanitizedFieldsPermissions = Object.fromEntries(
    collectionConfig.fields
      .filter((f): f is { name: string } & typeof f => 'name' in f && typeof f.name === 'string')
      .map((f) => [f.name, { create: true, read: true, update: true }]),
  )

  // In create-first-user we should always allow all fields
  const docPermissionsForForm: SanitizedDocumentPermissions = {
    create: true,
    delete: true,
    fields: baseFields,
    read: true,
    readVersions: true,
    update: true,
  }

  // Build initial form state from data
  const { state: formState } = await buildFormState({
    collectionSlug: collectionConfig.slug,
    data,
    docPermissions: docPermissionsForForm,
    docPreferences,
    locale: locale?.code,
    operation: 'create',
    renderAllFields: true,
    req,
    schemaPath: collectionConfig.slug,
    skipClientConfigAuth: true,
    skipValidation: true,
  })

  return (
    <div className="create-first-user">
      <h1>{req.t('general:welcome')}</h1>
      <p>{req.t('authentication:beginCreateFirstUser')}</p>
      <CreateFirstUserClient
        docPermissions={docPermissionsForForm}
        docPreferences={docPreferences}
        initialState={formState}
        loginWithUsername={loginWithUsername}
        userSlug={userSlug}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/CreateFirstUser/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateCreateFirstUserViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    description: t('authentication:createFirstUser'),
    keywords: t('general:create'),
    serverURL: config.serverURL,
    title: t('authentication:createFirstUser'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Dashboard/index.tsx
Signals: React

```typescript
import type { EntityToGroup } from '@payloadcms/ui/shared'
import type { AdminViewServerProps, TypedUser } from 'payload'

import { HydrateAuthProvider, SetStepNav } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import React, { Fragment } from 'react'

import type { DashboardViewClientProps, DashboardViewServerPropsOnly } from './Default/index.js'

import { DefaultDashboard } from './Default/index.js'

const globalLockDurationDefault = 300

export async function DashboardView(props: AdminViewServerProps) {
  const {
    locale,
    permissions,
    req: {
      i18n,
      payload: { config },
      payload,
      user,
    },
    req,
    visibleEntities,
  } = props.initPageResult
  const collections = config.collections.filter(
    (collection) =>
      permissions?.collections?.[collection.slug]?.read &&
      visibleEntities.collections.includes(collection.slug),
  )

  const globals = config.globals.filter(
    (global) =>
      permissions?.globals?.[global.slug]?.read && visibleEntities.globals.includes(global.slug),
  )

  // Query locked global documents only if there are globals in the config
  let globalData: DashboardViewServerPropsOnly['globalData'] = []

  if (config.globals.length > 0) {
    const lockedDocuments = await payload.find({
      collection: 'payload-locked-documents',
      depth: 1,
      overrideAccess: false,
      pagination: false,
      req,
      select: {
        globalSlug: true,
        updatedAt: true,
        user: true,
      },
      where: {
        globalSlug: {
          exists: true,
        },
      },
    })

    // Map over globals to include `lockDuration` and lock data for each global slug
    globalData = config.globals.map((global) => {
      const lockDuration =
        typeof global.lockDocuments === 'object'
          ? global.lockDocuments.duration
          : globalLockDurationDefault

      const lockedDoc = lockedDocuments.docs.find((doc) => doc.globalSlug === global.slug)

      return {
        slug: global.slug,
        data: {
          _isLocked: !!lockedDoc,
          _lastEditedAt: (lockedDoc?.updatedAt as string) ?? null,
          _userEditing: (lockedDoc?.user as { value?: TypedUser })?.value ?? null,
        },
        lockDuration,
      }
    })
  }

  const navGroups = groupNavItems(
    [
      ...(collections.map((collection) => {
        const entityToGroup: EntityToGroup = {
          type: EntityType.collection,
          entity: collection,
        }

        return entityToGroup
      }) ?? []),
      ...(globals.map((global) => {
        const entityToGroup: EntityToGroup = {
          type: EntityType.global,
          entity: global,
        }

        return entityToGroup
      }) ?? []),
    ],
    permissions,
    i18n,
  )

  return (
    <Fragment>
      <HydrateAuthProvider permissions={permissions} />
      <SetStepNav nav={[]} />
      {RenderServerComponent({
        clientProps: {
          locale,
        } satisfies DashboardViewClientProps,
        Component: config.admin?.components?.views?.dashboard?.Component,
        Fallback: DefaultDashboard,
        importMap: payload.importMap,
        serverProps: {
          ...props,
          globalData,
          i18n,
          locale,
          navGroups,
          payload,
          permissions,
          user,
          visibleEntities,
        } satisfies DashboardViewServerPropsOnly,
      })}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Dashboard/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateDashboardViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    serverURL: config.serverURL,
    title: t('general:dashboard'),
    ...config.admin.meta,
    openGraph: {
      title: t('general:dashboard'),
      ...(config.admin.meta?.openGraph || {}),
    },
  })
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Dashboard/Default/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .dashboard {
    width: 100%;
    --gap: var(--base);
    --cols: 5;

    &__wrap {
      padding-bottom: var(--spacing-view-bottom);
      display: flex;
      flex-direction: column;
      gap: var(--base);
    }

    &__group {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
    }

    &__label {
      margin: 0;
    }

    &__card-list {
      padding: 0;
      margin: 0;
      list-style: none;
      gap: var(--gap);
      display: grid;
      grid-template-columns: repeat(var(--cols), 1fr);

      .card {
        height: 100%;
      }
    }

    &__locked.locked {
      align-items: unset;
      justify-content: unset;
    }

    @include large-break {
      --cols: 4;
    }

    @include mid-break {
      --gap: var(--base);
      --cols: 2;
    }

    @include small-break {
      --cols: 2;

      &__wrap {
        gap: var(--base);
      }

      &__card-list {
        gap: base(0.4);
      }
    }

    @include extra-small-break {
      --cols: 1;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Dashboard/Default/index.tsx
Signals: React

```typescript
import type { groupNavItems } from '@payloadcms/ui/shared'
import type { AdminViewServerPropsOnly, ClientUser, Locale, ServerProps } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { Button, Card, Gutter, Locked } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'

import './index.scss'

const baseClass = 'dashboard'

export type DashboardViewClientProps = {
  locale: Locale
}

export type DashboardViewServerPropsOnly = {
  globalData: Array<{
    data: { _isLocked: boolean; _lastEditedAt: string; _userEditing: ClientUser | number | string }
    lockDuration?: number
    slug: string
  }>
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ComponentType
  navGroups?: ReturnType<typeof groupNavItems>
} & AdminViewServerPropsOnly

export type DashboardViewServerProps = DashboardViewClientProps & DashboardViewServerPropsOnly

export function DefaultDashboard(props: DashboardViewServerProps) {
  const {
    globalData,
    i18n,
    i18n: { t },
    locale,
    navGroups,
    params,
    payload: {
      config: {
        admin: {
          components: { afterDashboard, beforeDashboard },
        },
        routes: { admin: adminRoute },
        serverURL,
      },
    },
    payload,
    permissions,
    searchParams,
    user,
  } = props

  return (
    <div className={baseClass}>
      <Gutter className={`${baseClass}__wrap`}>
        {beforeDashboard &&
          RenderServerComponent({
            Component: beforeDashboard,
            importMap: payload.importMap,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            } satisfies ServerProps,
          })}

        <Fragment>
          {!navGroups || navGroups?.length === 0 ? (
            <p>no nav groups....</p>
          ) : (
            navGroups.map(({ entities, label }, groupIndex) => {
              return (
                <div className={`${baseClass}__group`} key={groupIndex}>
                  <h2 className={`${baseClass}__label`}>{label}</h2>
                  <ul className={`${baseClass}__card-list`}>
                    {entities.map(({ slug, type, label }, entityIndex) => {
                      let title: string
                      let buttonAriaLabel: string
                      let createHREF: string
                      let href: string
                      let hasCreatePermission: boolean
                      let isLocked = null
                      let userEditing = null

                      if (type === EntityType.collection) {
                        title = getTranslation(label, i18n)

                        buttonAriaLabel = t('general:showAllLabel', { label: title })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/collections/${slug}`,
                          serverURL,
                        })

                        createHREF = formatAdminURL({
                          adminRoute,
                          path: `/collections/${slug}/create`,
                          serverURL,
                        })

                        hasCreatePermission = permissions?.collections?.[slug]?.create
                      }

                      if (type === EntityType.global) {
                        title = getTranslation(label, i18n)

                        buttonAriaLabel = t('general:editLabel', {
                          label: getTranslation(label, i18n),
                        })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/globals/${slug}`,
                          serverURL,
                        })

                        // Find the lock status for the global
                        const globalLockData = globalData.find((global) => global.slug === slug)
                        if (globalLockData) {
                          isLocked = globalLockData.data._isLocked
                          userEditing = globalLockData.data._userEditing

                          // Check if the lock is expired
                          const lockDuration = globalLockData?.lockDuration
                          const lastEditedAt = new Date(
                            globalLockData.data?._lastEditedAt,
                          ).getTime()

                          const lockDurationInMilliseconds = lockDuration * 1000
                          const lockExpirationTime = lastEditedAt + lockDurationInMilliseconds

                          if (new Date().getTime() > lockExpirationTime) {
                            isLocked = false
                            userEditing = null
                          }
                        }
                      }

                      return (
                        <li key={entityIndex}>
                          <Card
                            actions={
                              isLocked && user?.id !== userEditing?.id ? (
                                <Locked className={`${baseClass}__locked`} user={userEditing} />
                              ) : hasCreatePermission && type === EntityType.collection ? (
                                <Button
                                  aria-label={t('general:createNewLabel', {
                                    label,
                                  })}
                                  buttonStyle="icon-label"
                                  el="link"
                                  icon="plus"
                                  iconStyle="with-border"
                                  round
                                  to={createHREF}
                                />
                              ) : undefined
                            }
                            buttonAriaLabel={buttonAriaLabel}
                            href={href}
                            id={`card-${slug}`}
                            title={getTranslation(label, i18n)}
                            titleAs="h3"
                          />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          )}
        </Fragment>
        {afterDashboard &&
          RenderServerComponent({
            Component: afterDashboard,
            importMap: payload.importMap,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            } satisfies ServerProps,
          })}
      </Gutter>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomDocumentViewByKey.tsx]---
Location: payload-main/packages/next/src/views/Document/getCustomDocumentViewByKey.tsx

```typescript
import type { EditViewComponent, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

export const getCustomDocumentViewByKey = (
  views:
    | SanitizedCollectionConfig['admin']['components']['views']
    | SanitizedGlobalConfig['admin']['components']['views'],
  customViewKey: string,
): EditViewComponent => {
  return typeof views?.edit?.[customViewKey] === 'object' &&
    'Component' in views.edit[customViewKey]
    ? views?.edit?.[customViewKey].Component
    : null
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomViewByRoute.tsx]---
Location: payload-main/packages/next/src/views/Document/getCustomViewByRoute.tsx

```typescript
import type { EditViewComponent, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import { isPathMatchingRoute } from '../Root/isPathMatchingRoute.js'

export const getCustomViewByRoute = ({
  baseRoute,
  currentRoute,
  views,
}: {
  baseRoute: string
  currentRoute: string
  views:
    | SanitizedCollectionConfig['admin']['components']['views']
    | SanitizedGlobalConfig['admin']['components']['views']
}): {
  Component: EditViewComponent
  viewKey?: string
} => {
  if (typeof views?.edit === 'object') {
    let viewKey: string

    const foundViewConfig = Object.entries(views.edit).find(([key, view]) => {
      if (typeof view === 'object' && 'path' in view) {
        const viewPath = `${baseRoute}${view.path}`

        const isMatching = isPathMatchingRoute({
          currentRoute,
          exact: true,
          path: viewPath,
        })

        if (isMatching) {
          viewKey = key
        }

        return isMatching
      }

      return false
    })?.[1]

    if (foundViewConfig && 'Component' in foundViewConfig) {
      return {
        Component: foundViewConfig.Component,
        viewKey,
      }
    }
  }

  return {
    Component: null,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getDocPreferences.ts]---
Location: payload-main/packages/next/src/views/Document/getDocPreferences.ts

```typescript
import type { DocumentPreferences, Payload, TypedUser } from 'payload'

import { sanitizeID } from '@payloadcms/ui/shared'

type Args = {
  collectionSlug?: string
  globalSlug?: string
  id?: number | string
  payload: Payload
  user: TypedUser
}

export const getDocPreferences = async ({
  id,
  collectionSlug,
  globalSlug,
  payload,
  user,
}: Args): Promise<DocumentPreferences> => {
  let preferencesKey

  if (collectionSlug && id) {
    preferencesKey = `collection-${collectionSlug}-${id}`
  }

  if (globalSlug) {
    preferencesKey = `global-${globalSlug}`
  }

  if (preferencesKey) {
    const preferencesResult = (await payload.find({
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
              equals: sanitizeID(user.id),
            },
          },
        ],
      },
    })) as unknown as { docs: { value: DocumentPreferences }[] }

    if (preferencesResult?.docs?.[0]?.value) {
      return preferencesResult.docs[0].value
    }
  }

  return { fields: {} }
}
```

--------------------------------------------------------------------------------

---[FILE: getDocumentData.ts]---
Location: payload-main/packages/next/src/views/Document/getDocumentData.ts

```typescript
import { sanitizeID } from '@payloadcms/ui/shared'
import {
  type Locale,
  logError,
  type Payload,
  type PayloadRequest,
  type TypedUser,
  type TypeWithID,
} from 'payload'

type Args = {
  collectionSlug?: string
  globalSlug?: string
  id?: number | string
  locale?: Locale
  payload: Payload
  req?: PayloadRequest
  segments?: string[]
  user?: TypedUser
}

export const getDocumentData = async ({
  id: idArg,
  collectionSlug,
  globalSlug,
  locale,
  payload,
  req,
  segments,
  user,
}: Args): Promise<null | Record<string, unknown> | TypeWithID> => {
  const id = sanitizeID(idArg)
  let resolvedData: Record<string, unknown> | TypeWithID = null
  const { transactionID, ...rest } = req

  const isTrashedDoc = segments?.[2] === 'trash' && typeof segments?.[3] === 'string' // id exists at segment 3

  try {
    if (collectionSlug && id) {
      resolvedData = await payload.findByID({
        id,
        collection: collectionSlug,
        depth: 0,
        draft: true,
        fallbackLocale: false,
        locale: locale?.code,
        overrideAccess: false,
        req: {
          ...rest,
        },
        trash: isTrashedDoc ? true : false,
        user,
      })
    }

    if (globalSlug) {
      resolvedData = await payload.findGlobal({
        slug: globalSlug,
        depth: 0,
        draft: true,
        fallbackLocale: false,
        locale: locale?.code,
        overrideAccess: false,
        req: {
          ...rest,
        },
        user,
      })
    }
  } catch (err) {
    logError({ err, payload })
  }

  return resolvedData
}
```

--------------------------------------------------------------------------------

---[FILE: getDocumentPermissions.tsx]---
Location: payload-main/packages/next/src/views/Document/getDocumentPermissions.tsx

```typescript
import type {
  Data,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedDocumentPermissions,
  SanitizedGlobalConfig,
} from 'payload'

import {
  hasSavePermission as getHasSavePermission,
  isEditing as getIsEditing,
} from '@payloadcms/ui/shared'
import { docAccessOperation, docAccessOperationGlobal, logError } from 'payload'
import { hasDraftsEnabled } from 'payload/shared'

export const getDocumentPermissions = async (args: {
  collectionConfig?: SanitizedCollectionConfig
  data: Data
  globalConfig?: SanitizedGlobalConfig
  /**
   * When called for creating a new document, id is not provided.
   */
  id?: number | string
  req: PayloadRequest
}): Promise<{
  docPermissions: SanitizedDocumentPermissions
  hasPublishPermission: boolean
  hasSavePermission: boolean
}> => {
  const { id, collectionConfig, data = {}, globalConfig, req } = args

  let docPermissions: SanitizedDocumentPermissions
  let hasPublishPermission = false

  if (collectionConfig) {
    try {
      docPermissions = await docAccessOperation({
        id,
        collection: {
          config: collectionConfig,
        },
        data: {
          ...data,
          _status: 'draft',
        },
        req,
      })

      if (hasDraftsEnabled(collectionConfig)) {
        hasPublishPermission = (
          await docAccessOperation({
            id,
            collection: {
              config: collectionConfig,
            },
            data: {
              ...data,
              _status: 'published',
            },
            req,
          })
        ).update
      }
    } catch (err) {
      logError({ err, payload: req.payload })
    }
  }

  if (globalConfig) {
    try {
      docPermissions = await docAccessOperationGlobal({
        data,
        globalConfig,
        req,
      })

      if (hasDraftsEnabled(globalConfig)) {
        hasPublishPermission = (
          await docAccessOperationGlobal({
            data: {
              ...data,
              _status: 'published',
            },
            globalConfig,
            req,
          })
        ).update
      }
    } catch (err) {
      logError({ err, payload: req.payload })
    }
  }

  const hasSavePermission = getHasSavePermission({
    collectionSlug: collectionConfig?.slug,
    docPermissions,
    globalSlug: globalConfig?.slug,
    isEditing: getIsEditing({
      id,
      collectionSlug: collectionConfig?.slug,
      globalSlug: globalConfig?.slug,
    }),
  })

  return {
    docPermissions,
    hasPublishPermission,
    hasSavePermission,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getDocumentView.tsx]---
Location: payload-main/packages/next/src/views/Document/getDocumentView.tsx
Signals: React

```typescript
import type {
  PayloadComponent,
  SanitizedCollectionConfig,
  SanitizedCollectionPermission,
  SanitizedConfig,
  SanitizedGlobalConfig,
  SanitizedGlobalPermission,
} from 'payload'
import type React from 'react'

import type { ViewToRender } from './index.js'

import { APIView as DefaultAPIView } from '../API/index.js'
import { EditView as DefaultEditView } from '../Edit/index.js'
import { UnauthorizedViewWithGutter } from '../Unauthorized/index.js'
import { VersionView as DefaultVersionView } from '../Version/index.js'
import { VersionsView as DefaultVersionsView } from '../Versions/index.js'
import { getCustomDocumentViewByKey } from './getCustomDocumentViewByKey.js'
import { getCustomViewByRoute } from './getCustomViewByRoute.js'

export type ViewFromConfig<TProps extends object> = {
  Component?: React.FC<TProps>
  ComponentConfig?: PayloadComponent<TProps>
}

export const getDocumentView = ({
  collectionConfig,
  config,
  docPermissions,
  globalConfig,
  routeSegments,
}: {
  collectionConfig?: SanitizedCollectionConfig
  config: SanitizedConfig
  docPermissions: SanitizedCollectionPermission | SanitizedGlobalPermission
  globalConfig?: SanitizedGlobalConfig
  routeSegments: string[]
}): {
  View: ViewToRender
  viewKey: string
} | null => {
  // Conditionally import and lazy load the default view
  let View: ViewToRender = null
  let viewKey: string

  const {
    routes: { admin: adminRoute },
  } = config

  const views =
    (collectionConfig && collectionConfig?.admin?.components?.views) ||
    (globalConfig && globalConfig?.admin?.components?.views)

  if (!docPermissions?.read) {
    throw new Error('not-found')
  }

  if (collectionConfig) {
    const [collectionEntity, collectionSlug, segment3, segment4, segment5, ...remainingSegments] =
      routeSegments

    // --> /collections/:collectionSlug/:id
    // --> /collections/:collectionSlug/create
    switch (routeSegments.length) {
      case 3: {
        switch (segment3) {
          // --> /collections/:collectionSlug/create
          case 'create': {
            if ('create' in docPermissions && docPermissions.create) {
              View = getCustomDocumentViewByKey(views, 'default') || DefaultEditView
            } else {
              View = UnauthorizedViewWithGutter
            }
            break
          }

          // --> /collections/:collectionSlug/:id
          default: {
            const baseRoute = [
              adminRoute !== '/' && adminRoute,
              'collections',
              collectionSlug,
              segment3,
            ]
              .filter(Boolean)
              .join('/')

            const currentRoute = [baseRoute, segment4, segment5, ...remainingSegments]
              .filter(Boolean)
              .join('/')

            const { Component: CustomViewComponent, viewKey: customViewKey } = getCustomViewByRoute(
              {
                baseRoute,
                currentRoute,
                views,
              },
            )

            if (customViewKey) {
              viewKey = customViewKey
              View = CustomViewComponent
            } else {
              View = getCustomDocumentViewByKey(views, 'default') || DefaultEditView
            }

            break
          }
        }
        break
      }

      // --> /collections/:collectionSlug/:id/api
      // --> /collections/:collectionSlug/:id/versions
      // --> /collections/:collectionSlug/:id/<custom-segment>
      // --> /collections/:collectionSlug/trash/:id
      case 4: {
        // --> /collections/:collectionSlug/trash/:id
        if (segment3 === 'trash' && segment4) {
          View = getCustomDocumentViewByKey(views, 'default') || DefaultEditView
          break
        }
        switch (segment4) {
          // --> /collections/:collectionSlug/:id/api
          case 'api': {
            if (collectionConfig?.admin?.hideAPIURL !== true) {
              View = getCustomDocumentViewByKey(views, 'api') || DefaultAPIView
            }
            break
          }

          case 'versions': {
            // --> /collections/:collectionSlug/:id/versions
            if (docPermissions?.readVersions) {
              View = getCustomDocumentViewByKey(views, 'versions') || DefaultVersionsView
            } else {
              View = UnauthorizedViewWithGutter
            }
            break
          }

          // --> /collections/:collectionSlug/:id/<custom-segment>
          default: {
            const baseRoute = [
              adminRoute !== '/' && adminRoute,
              'collections',
              collectionSlug,
              segment3,
            ]
              .filter(Boolean)
              .join('/')

            const currentRoute = [baseRoute, segment4, segment5, ...remainingSegments]
              .filter(Boolean)
              .join('/')

            const { Component: CustomViewComponent, viewKey: customViewKey } = getCustomViewByRoute(
              {
                baseRoute,
                currentRoute,
                views,
              },
            )

            if (customViewKey) {
              viewKey = customViewKey
              View = CustomViewComponent
            }

            break
          }
        }
        break
      }

      // --> /collections/:collectionSlug/trash/:id/api
      // --> /collections/:collectionSlug/trash/:id/versions
      // --> /collections/:collectionSlug/trash/:id/<custom-segment>
      // --> /collections/:collectionSlug/:id/versions/:version
      case 5: {
        // --> /collections/:slug/trash/:id/api
        if (segment3 === 'trash') {
          switch (segment5) {
            case 'api': {
              if (collectionConfig?.admin?.hideAPIURL !== true) {
                View = getCustomDocumentViewByKey(views, 'api') || DefaultAPIView
              }
              break
            }
            // --> /collections/:slug/trash/:id/versions
            case 'versions': {
              if (docPermissions?.readVersions) {
                View = getCustomDocumentViewByKey(views, 'versions') || DefaultVersionsView
              } else {
                View = UnauthorizedViewWithGutter
              }
              break
            }

            default: {
              View = getCustomDocumentViewByKey(views, 'default') || DefaultEditView
              break
            }
          }
          // --> /collections/:collectionSlug/:id/versions/:version
        } else if (segment4 === 'versions') {
          if (docPermissions?.readVersions) {
            View = getCustomDocumentViewByKey(views, 'version') || DefaultVersionView
          } else {
            View = UnauthorizedViewWithGutter
          }
        } else {
          // --> /collections/:collectionSlug/:id/<custom>/<custom>
          const baseRoute = [
            adminRoute !== '/' && adminRoute,
            collectionEntity,
            collectionSlug,
            segment3,
          ]
            .filter(Boolean)
            .join('/')

          const currentRoute = [baseRoute, segment4, segment5, ...remainingSegments]
            .filter(Boolean)
            .join('/')

          const { Component: CustomViewComponent, viewKey: customViewKey } = getCustomViewByRoute({
            baseRoute,
            currentRoute,
            views,
          })

          if (customViewKey) {
            viewKey = customViewKey
            View = CustomViewComponent
          }
        }

        break
      }

      // --> /collections/:collectionSlug/trash/:id/versions/:version
      // --> /collections/:collectionSlug/:id/<custom>/<custom>/<custom...>
      default: {
        // --> /collections/:collectionSlug/trash/:id/versions/:version
        const isTrashedVersionView = segment3 === 'trash' && segment5 === 'versions'

        if (isTrashedVersionView) {
          if (docPermissions?.readVersions) {
            View = getCustomDocumentViewByKey(views, 'version') || DefaultVersionView
          } else {
            View = UnauthorizedViewWithGutter
          }
        } else {
          // --> /collections/:collectionSlug/:id/<custom>/<custom>/<custom...>
          const baseRoute = [
            adminRoute !== '/' && adminRoute,
            collectionEntity,
            collectionSlug,
            segment3,
          ]
            .filter(Boolean)
            .join('/')

          const currentRoute = [baseRoute, segment4, segment5, ...remainingSegments]
            .filter(Boolean)
            .join('/')

          const { Component: CustomViewComponent, viewKey: customViewKey } = getCustomViewByRoute({
            baseRoute,
            currentRoute,
            views,
          })

          if (customViewKey) {
            viewKey = customViewKey
            View = CustomViewComponent
          }
        }

        break
      }
    }
  }

  if (globalConfig) {
    const [globalEntity, globalSlug, segment3, ...remainingSegments] = routeSegments

    switch (routeSegments.length) {
      // --> /globals/:globalSlug
      case 2: {
        View = getCustomDocumentViewByKey(views, 'default') || DefaultEditView
        break
      }

      case 3: {
        // --> /globals/:globalSlug/api
        // --> /globals/:globalSlug/versions
        // --> /globals/:globalSlug/<custom-segment>
        switch (segment3) {
          // --> /globals/:globalSlug/api
          case 'api': {
            if (globalConfig?.admin?.hideAPIURL !== true) {
              View = getCustomDocumentViewByKey(views, 'api') || DefaultAPIView
            }

            break
          }

          case 'versions': {
            // --> /globals/:globalSlug/versions
            if (docPermissions?.readVersions) {
              View = getCustomDocumentViewByKey(views, 'versions') || DefaultVersionsView
            } else {
              View = UnauthorizedViewWithGutter
            }
            break
          }

          // --> /globals/:globalSlug/<custom-segment>
          default: {
            if (docPermissions?.read) {
              const baseRoute = [adminRoute, globalEntity, globalSlug, segment3]
                .filter(Boolean)
                .join('/')

              const currentRoute = [baseRoute, segment3, ...remainingSegments]
                .filter(Boolean)
                .join('/')

              const { Component: CustomViewComponent, viewKey: customViewKey } =
                getCustomViewByRoute({
                  baseRoute,
                  currentRoute,
                  views,
                })

              if (customViewKey) {
                viewKey = customViewKey

                View = CustomViewComponent
              } else {
                View = DefaultEditView
              }
            } else {
              View = UnauthorizedViewWithGutter
            }
            break
          }
        }
        break
      }

      // --> /globals/:globalSlug/versions/:version
      // --> /globals/:globalSlug/<custom-segment>/<custom-segment>
      default: {
        // --> /globals/:globalSlug/versions/:version
        if (segment3 === 'versions') {
          if (docPermissions?.readVersions) {
            View = getCustomDocumentViewByKey(views, 'version') || DefaultVersionView
          } else {
            View = UnauthorizedViewWithGutter
          }
        } else {
          // --> /globals/:globalSlug/<custom-segment>/<custom-segment>
          const baseRoute = [adminRoute !== '/' && adminRoute, 'globals', globalSlug]
            .filter(Boolean)
            .join('/')

          const currentRoute = [baseRoute, segment3, ...remainingSegments].filter(Boolean).join('/')

          const { Component: CustomViewComponent, viewKey: customViewKey } = getCustomViewByRoute({
            baseRoute,
            currentRoute,
            views,
          })

          if (customViewKey) {
            viewKey = customViewKey
            View = CustomViewComponent
          }
        }

        break
      }
    }
  }

  return {
    View,
    viewKey,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getIsLocked.ts]---
Location: payload-main/packages/next/src/views/Document/getIsLocked.ts

```typescript
import type {
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  TypedUser,
  Where,
} from 'payload'

import { sanitizeID } from '@payloadcms/ui/shared'
import { extractID } from 'payload/shared'

type Args = {
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  id?: number | string
  isEditing: boolean
  req: PayloadRequest
}

type Result = Promise<{
  currentEditor?: TypedUser
  isLocked: boolean
  lastUpdateTime?: number
}>

export const getIsLocked = async ({
  id,
  collectionConfig,
  globalConfig,
  isEditing,
  req,
}: Args): Result => {
  const entityConfig = collectionConfig || globalConfig

  const entityHasLockingEnabled =
    entityConfig?.lockDocuments !== undefined ? entityConfig?.lockDocuments : true

  if (!entityHasLockingEnabled || !isEditing) {
    return {
      isLocked: false,
    }
  }

  const where: Where = {}

  const lockDurationDefault = 300 // Default 5 minutes in seconds
  const lockDuration =
    typeof entityConfig.lockDocuments === 'object'
      ? entityConfig.lockDocuments.duration
      : lockDurationDefault
  const lockDurationInMilliseconds = lockDuration * 1000

  const now = new Date().getTime()

  if (globalConfig) {
    where.and = [
      {
        globalSlug: {
          equals: globalConfig.slug,
        },
      },
      {
        updatedAt: {
          greater_than: new Date(now - lockDurationInMilliseconds),
        },
      },
    ]
  } else {
    where.and = [
      {
        'document.value': {
          equals: sanitizeID(id),
        },
      },
      {
        'document.relationTo': {
          equals: collectionConfig.slug,
        },
      },
      {
        updatedAt: {
          greater_than: new Date(now - lockDurationInMilliseconds),
        },
      },
    ]
  }

  const { docs } = await req.payload.find({
    collection: 'payload-locked-documents',
    depth: 1,
    overrideAccess: false,
    req,
    where,
  })

  if (docs.length > 0) {
    const currentEditor = docs[0].user?.value
    const lastUpdateTime = new Date(docs[0].updatedAt).getTime()

    if (extractID(currentEditor) !== req.user.id) {
      return {
        currentEditor,
        isLocked: true,
        lastUpdateTime,
      }
    }
  }

  return {
    isLocked: false,
  }
}
```

--------------------------------------------------------------------------------

````
