---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 165
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 165 of 695)

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

---[FILE: getDocumentViewInfo.ts]---
Location: payload-main/packages/next/src/views/Root/getDocumentViewInfo.ts

```typescript
import type { DocumentSubViewTypes, ViewTypes } from 'payload'

export function getDocumentViewInfo(segments: string[]): {
  documentSubViewType?: DocumentSubViewTypes
  viewType: ViewTypes
} {
  const [tabSegment, versionSegment] = segments

  if (versionSegment) {
    if (tabSegment === 'versions') {
      return {
        documentSubViewType: 'version',
        viewType: 'version',
      }
    }
  } else {
    if (tabSegment === 'versions') {
      return {
        documentSubViewType: 'versions',
        viewType: 'document',
      }
    } else if (tabSegment === 'api') {
      return {
        documentSubViewType: 'api',
        viewType: 'document',
      }
    }
  }

  return {
    documentSubViewType: 'default',
    viewType: 'document',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getRouteData.ts]---
Location: payload-main/packages/next/src/views/Root/getRouteData.ts
Signals: React

```typescript
import type {
  AdminViewServerProps,
  CollectionPreferences,
  CollectionSlug,
  CustomComponent,
  DocumentSubViewTypes,
  Payload,
  PayloadComponent,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SanitizedGlobalConfig,
  ViewTypes,
} from 'payload'
import type React from 'react'

import { parseDocumentID } from 'payload'
import { formatAdminURL, isNumber } from 'payload/shared'

import { AccountView } from '../Account/index.js'
import { BrowseByFolder } from '../BrowseByFolder/index.js'
import { CollectionFolderView } from '../CollectionFolders/index.js'
import { TrashView } from '../CollectionTrash/index.js'
import { CreateFirstUserView } from '../CreateFirstUser/index.js'
import { DashboardView } from '../Dashboard/index.js'
import { DocumentView } from '../Document/index.js'
import { forgotPasswordBaseClass, ForgotPasswordView } from '../ForgotPassword/index.js'
import { ListView } from '../List/index.js'
import { loginBaseClass, LoginView } from '../Login/index.js'
import { LogoutInactivity, LogoutView } from '../Logout/index.js'
import { ResetPassword, resetPasswordBaseClass } from '../ResetPassword/index.js'
import { UnauthorizedView } from '../Unauthorized/index.js'
import { Verify, verifyBaseClass } from '../Verify/index.js'
import { getSubViewActions, getViewActions } from './attachViewActions.js'
import { getCustomViewByKey } from './getCustomViewByKey.js'
import { getCustomViewByRoute } from './getCustomViewByRoute.js'
import { getDocumentViewInfo } from './getDocumentViewInfo.js'
import { isPathMatchingRoute } from './isPathMatchingRoute.js'

const baseClasses = {
  account: 'account',
  folders: 'folders',
  forgot: forgotPasswordBaseClass,
  login: loginBaseClass,
  reset: resetPasswordBaseClass,
  verify: verifyBaseClass,
}

type OneSegmentViews = {
  [K in Exclude<keyof SanitizedConfig['admin']['routes'], 'reset'>]: React.FC<AdminViewServerProps>
}

export type ViewFromConfig = {
  Component?: React.FC<AdminViewServerProps>
  payloadComponent?: PayloadComponent<AdminViewServerProps>
}

const oneSegmentViews: OneSegmentViews = {
  account: AccountView,
  browseByFolder: BrowseByFolder,
  createFirstUser: CreateFirstUserView,
  forgot: ForgotPasswordView,
  inactivity: LogoutInactivity,
  login: LoginView,
  logout: LogoutView,
  unauthorized: UnauthorizedView,
}

type GetRouteDataResult = {
  browseByFolderSlugs: CollectionSlug[]
  collectionConfig?: SanitizedCollectionConfig
  DefaultView: ViewFromConfig
  documentSubViewType?: DocumentSubViewTypes
  globalConfig?: SanitizedGlobalConfig
  routeParams: {
    collection?: string
    folderCollection?: string
    folderID?: number | string
    global?: string
    id?: number | string
    token?: string
    versionID?: number | string
  }
  templateClassName: string
  templateType: 'default' | 'minimal'
  viewActions?: CustomComponent[]
  viewType?: ViewTypes
}

type GetRouteDataArgs = {
  adminRoute: string
  collectionConfig?: SanitizedCollectionConfig
  /**
   * User preferences for a collection.
   *
   * These preferences are normally undefined
   * unless the user is on the list view and the
   * collection is folder enabled.
   */
  collectionPreferences?: CollectionPreferences
  currentRoute: string
  globalConfig?: SanitizedGlobalConfig
  payload: Payload
  searchParams: {
    [key: string]: string | string[]
  }
  segments: string[]
}

export const getRouteData = ({
  adminRoute,
  collectionConfig,
  collectionPreferences = undefined,
  currentRoute,
  globalConfig,
  payload,
  segments,
}: GetRouteDataArgs): GetRouteDataResult => {
  const { config } = payload
  let ViewToRender: ViewFromConfig = null
  let templateClassName: string
  let templateType: 'default' | 'minimal' | undefined
  let documentSubViewType: DocumentSubViewTypes
  let viewType: ViewTypes
  const routeParams: GetRouteDataResult['routeParams'] = {}

  const [segmentOne, segmentTwo, segmentThree, segmentFour, segmentFive, segmentSix] = segments

  const isBrowseByFolderEnabled = config.folders && config.folders.browseByFolder
  const browseByFolderSlugs =
    (isBrowseByFolderEnabled &&
      config.collections.reduce((acc, { slug, folders }) => {
        if (folders && folders.browseByFolder) {
          return [...acc, slug]
        }
        return acc
      }, [])) ||
    []

  const viewActions: CustomComponent[] = [...(config?.admin?.components?.actions || [])]

  switch (segments.length) {
    case 0: {
      if (currentRoute === adminRoute) {
        ViewToRender = {
          Component: DashboardView,
        }
        templateClassName = 'dashboard'
        templateType = 'default'
        viewType = 'dashboard'
      }
      break
    }
    case 1: {
      // users can override the default routes via `admin.routes` config
      // i.e.{ admin: { routes: { logout: '/sign-out', inactivity: '/idle' }}}
      let viewKey: keyof typeof oneSegmentViews

      if (config.admin.routes) {
        const matchedRoute = Object.entries(config.admin.routes).find(([, route]) => {
          return isPathMatchingRoute({
            currentRoute,
            exact: true,
            path: formatAdminURL({
              adminRoute,
              path: route,
              relative: true,
              serverURL: config.serverURL,
            }),
          })
        })

        if (matchedRoute) {
          viewKey = matchedRoute[0] as keyof typeof oneSegmentViews
        }
      }

      // Check if a custom view is configured for this viewKey
      // First try to get custom view by the known viewKey, then fallback to route matching
      const customView =
        (viewKey && getCustomViewByKey({ config, viewKey })) ||
        getCustomViewByRoute({ config, currentRoute })

      if (customView?.view?.payloadComponent || customView?.view?.Component) {
        // User has configured a custom view (either overriding a built-in or a new custom view)
        ViewToRender = customView.view

        // If this custom view is overriding a built-in view (viewKey matches a built-in),
        // use the built-in's template settings and viewType
        if (viewKey && oneSegmentViews[viewKey]) {
          viewType = viewKey as ViewTypes
          templateClassName = baseClasses[viewKey] || viewKey
          templateType = 'minimal'

          if (viewKey === 'account') {
            templateType = 'default'
          }

          if (isBrowseByFolderEnabled && viewKey === 'browseByFolder') {
            templateType = 'default'
            viewType = 'folders'
          }
        }
      } else if (oneSegmentViews[viewKey]) {
        // --> /account
        // --> /create-first-user
        // --> /browse-by-folder
        // --> /forgot
        // --> /login
        // --> /logout
        // --> /logout-inactivity
        // --> /unauthorized

        ViewToRender = {
          Component: oneSegmentViews[viewKey],
        }

        viewType = viewKey as ViewTypes

        templateClassName = baseClasses[viewKey]
        templateType = 'minimal'

        if (viewKey === 'account') {
          templateType = 'default'
        }

        if (isBrowseByFolderEnabled && viewKey === 'browseByFolder') {
          templateType = 'default'
          viewType = 'folders'
        }
      }
      break
    }
    case 2: {
      if (`/${segmentOne}` === config.admin.routes.reset) {
        // --> /reset/:token
        ViewToRender = {
          Component: ResetPassword,
        }
        templateClassName = baseClasses[segmentTwo]
        templateType = 'minimal'
        viewType = 'reset'
      } else if (
        isBrowseByFolderEnabled &&
        `/${segmentOne}` === config.admin.routes.browseByFolder
      ) {
        // --> /browse-by-folder/:folderID
        routeParams.folderID = segmentTwo

        ViewToRender = {
          Component: oneSegmentViews.browseByFolder,
        }
        templateClassName = baseClasses.folders
        templateType = 'default'
        viewType = 'folders'
      } else if (collectionConfig) {
        // --> /collections/:collectionSlug'
        routeParams.collection = collectionConfig.slug

        if (
          collectionPreferences?.listViewType &&
          collectionPreferences.listViewType === 'folders'
        ) {
          // Render folder view by default if set in preferences
          ViewToRender = {
            Component: CollectionFolderView,
          }

          templateClassName = `collection-folders`
          templateType = 'default'
          viewType = 'collection-folders'
        } else {
          ViewToRender = {
            Component: ListView,
          }

          templateClassName = `${segmentTwo}-list`
          templateType = 'default'
          viewType = 'list'
        }

        viewActions.push(...(collectionConfig.admin.components?.views?.list?.actions || []))
      } else if (globalConfig) {
        // --> /globals/:globalSlug
        routeParams.global = globalConfig.slug

        ViewToRender = {
          Component: DocumentView,
        }

        templateClassName = 'global-edit'
        templateType = 'default'
        viewType = 'document'

        // add default view actions
        viewActions.push(
          ...getViewActions({
            editConfig: globalConfig.admin?.components?.views?.edit,
            viewKey: 'default',
          }),
        )
      }
      break
    }
    default:
      if (segmentTwo === 'verify') {
        // --> /:collectionSlug/verify/:token
        routeParams.collection = segmentOne
        routeParams.token = segmentThree

        ViewToRender = {
          Component: Verify,
        }

        templateClassName = 'verify'
        templateType = 'minimal'
        viewType = 'verify'
      } else if (collectionConfig) {
        routeParams.collection = collectionConfig.slug

        if (segmentThree === 'trash' && typeof segmentFour === 'string') {
          // --> /collections/:collectionSlug/trash/:id (read-only)
          // --> /collections/:collectionSlug/trash/:id/api
          // --> /collections/:collectionSlug/trash/:id/preview
          // --> /collections/:collectionSlug/trash/:id/versions
          // --> /collections/:collectionSlug/trash/:id/versions/:versionID
          routeParams.id = segmentFour
          routeParams.versionID = segmentSix

          ViewToRender = {
            Component: DocumentView,
          }

          templateClassName = `collection-default-edit`
          templateType = 'default'

          const viewInfo = getDocumentViewInfo([segmentFive, segmentSix])
          viewType = viewInfo.viewType
          documentSubViewType = viewInfo.documentSubViewType

          viewActions.push(
            ...getSubViewActions({
              collectionOrGlobal: collectionConfig,
              viewKeyArg: documentSubViewType,
            }),
          )
        } else if (segmentThree === 'trash') {
          // --> /collections/:collectionSlug/trash
          ViewToRender = {
            Component: TrashView,
          }

          templateClassName = `${segmentTwo}-trash`
          templateType = 'default'
          viewType = 'trash'

          viewActions.push(...(collectionConfig.admin.components?.views?.list?.actions || []))
        } else {
          if (config.folders && segmentThree === config.folders.slug && collectionConfig.folders) {
            // Collection Folder Views
            // --> /collections/:collectionSlug/:folderCollectionSlug
            // --> /collections/:collectionSlug/:folderCollectionSlug/:folderID
            routeParams.folderCollection = segmentThree
            routeParams.folderID = segmentFour

            ViewToRender = {
              Component: CollectionFolderView,
            }

            templateClassName = `collection-folders`
            templateType = 'default'
            viewType = 'collection-folders'

            viewActions.push(...(collectionConfig.admin.components?.views?.list?.actions || []))
          } else {
            // Collection Edit Views
            // --> /collections/:collectionSlug/create
            // --> /collections/:collectionSlug/:id
            // --> /collections/:collectionSlug/:id/api
            // --> /collections/:collectionSlug/:id/versions
            // --> /collections/:collectionSlug/:id/versions/:versionID
            routeParams.id = segmentThree === 'create' ? undefined : segmentThree
            routeParams.versionID = segmentFive

            ViewToRender = {
              Component: DocumentView,
            }

            templateClassName = `collection-default-edit`
            templateType = 'default'

            const viewInfo = getDocumentViewInfo([segmentFour, segmentFive])
            viewType = viewInfo.viewType
            documentSubViewType = viewInfo.documentSubViewType

            viewActions.push(
              ...getSubViewActions({
                collectionOrGlobal: collectionConfig,
                viewKeyArg: documentSubViewType,
              }),
            )
          }
        }
      } else if (globalConfig) {
        // Global Edit Views
        // --> /globals/:globalSlug/versions
        // --> /globals/:globalSlug/versions/:versionID
        // --> /globals/:globalSlug/api
        routeParams.global = globalConfig.slug
        routeParams.versionID = segmentFour

        ViewToRender = {
          Component: DocumentView,
        }

        templateClassName = `global-edit`
        templateType = 'default'

        const viewInfo = getDocumentViewInfo([segmentThree, segmentFour])
        viewType = viewInfo.viewType
        documentSubViewType = viewInfo.documentSubViewType

        viewActions.push(
          ...getSubViewActions({
            collectionOrGlobal: globalConfig,
            viewKeyArg: documentSubViewType,
          }),
        )
      }
      break
  }

  if (!ViewToRender) {
    ViewToRender = getCustomViewByRoute({ config, currentRoute })?.view
  }

  if (collectionConfig) {
    if (routeParams.id) {
      routeParams.id = parseDocumentID({
        id: routeParams.id,
        collectionSlug: collectionConfig.slug,
        payload,
      })
    }

    if (routeParams.versionID) {
      routeParams.versionID = parseDocumentID({
        id: routeParams.versionID,
        collectionSlug: collectionConfig.slug,
        payload,
      })
    }
  }

  if (config.folders && routeParams.folderID) {
    routeParams.folderID = parseDocumentID({
      id: routeParams.folderID,
      collectionSlug: config.folders.slug,
      payload,
    })
  }

  if (globalConfig && routeParams.versionID) {
    routeParams.versionID =
      payload.db.defaultIDType === 'number' && isNumber(routeParams.versionID)
        ? Number(routeParams.versionID)
        : routeParams.versionID
  }

  if (viewActions.length) {
    viewActions.reverse()
  }

  return {
    browseByFolderSlugs,
    collectionConfig,
    DefaultView: ViewToRender,
    documentSubViewType,
    globalConfig,
    routeParams,
    templateClassName,
    templateType,
    viewActions: viewActions.length ? viewActions : undefined,
    viewType,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Root/index.tsx
Signals: React, Next.js

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { Metadata } from 'next'
import type {
  AdminViewClientProps,
  AdminViewServerPropsOnly,
  CollectionPreferences,
  ImportMap,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SanitizedGlobalConfig,
} from 'payload'

import { PageConfigProvider } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import { notFound, redirect } from 'next/navigation.js'
import { applyLocaleFiltering, formatAdminURL } from 'payload/shared'
import * as qs from 'qs-esm'
import React from 'react'

import { DefaultTemplate } from '../../templates/Default/index.js'
import { MinimalTemplate } from '../../templates/Minimal/index.js'
import { getPreferences } from '../../utilities/getPreferences.js'
import { getVisibleEntities } from '../../utilities/getVisibleEntities.js'
import { handleAuthRedirect } from '../../utilities/handleAuthRedirect.js'
import { initReq } from '../../utilities/initReq.js'
import { isCustomAdminView } from '../../utilities/isCustomAdminView.js'
import { isPublicAdminRoute } from '../../utilities/isPublicAdminRoute.js'
import { getCustomViewByRoute } from './getCustomViewByRoute.js'
import { getRouteData } from './getRouteData.js'

export type GenerateViewMetadata = (args: {
  config: SanitizedConfig
  i18n: I18nClient
  isEditing?: boolean
  params?: { [key: string]: string | string[] }
}) => Promise<Metadata>

export const RootPage = async ({
  config: configPromise,
  importMap,
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  readonly config: Promise<SanitizedConfig>
  readonly importMap: ImportMap
  readonly params: Promise<{
    segments: string[]
  }>
  readonly searchParams: Promise<{
    [key: string]: string | string[]
  }>
}) => {
  const config = await configPromise

  const {
    admin: {
      routes: { createFirstUser: _createFirstUserRoute },
      user: userSlug,
    },
    routes: { admin: adminRoute },
  } = config

  const params = await paramsPromise

  // Intentionally omit `serverURL` to ensure relative path
  const currentRoute = formatAdminURL({
    adminRoute,
    path: Array.isArray(params.segments) ? `/${params.segments.join('/')}` : null,
    relative: true,
    serverURL: config.serverURL,
  })

  const segments = Array.isArray(params.segments) ? params.segments : []
  const isCollectionRoute = segments[0] === 'collections'
  const isGlobalRoute = segments[0] === 'globals'
  let collectionConfig: SanitizedCollectionConfig = undefined
  let globalConfig: SanitizedGlobalConfig = undefined

  const searchParams = await searchParamsPromise

  // Redirect `${adminRoute}/collections` to `${adminRoute}`
  if (isCollectionRoute) {
    if (segments.length === 1) {
      const { viewKey } = getCustomViewByRoute({
        config,
        currentRoute: '/collections',
      })

      // Only redirect if there's NO custom view configured for /collections
      if (!viewKey) {
        redirect(adminRoute)
      }
    }

    if (segments[1]) {
      collectionConfig = config.collections.find(({ slug }) => slug === segments[1])
    }
  }

  // Redirect `${adminRoute}/globals` to `${adminRoute}`
  if (isGlobalRoute) {
    if (segments.length === 1) {
      const { viewKey } = getCustomViewByRoute({
        config,
        currentRoute: '/globals',
      })

      // Only redirect if there's NO custom view configured for /globals
      if (!viewKey) {
        redirect(adminRoute)
      }
    }

    if (segments[1]) {
      globalConfig = config.globals.find(({ slug }) => slug === segments[1])
    }
  }

  if ((isCollectionRoute && !collectionConfig) || (isGlobalRoute && !globalConfig)) {
    return notFound()
  }

  const queryString = `${qs.stringify(searchParams ?? {}, { addQueryPrefix: true })}`

  const {
    cookies,
    locale,
    permissions,
    req,
    req: { payload },
  } = await initReq({
    configPromise: config,
    importMap,
    key: 'initPage',
    overrides: {
      fallbackLocale: false,
      req: {
        query: qs.parse(queryString, {
          depth: 10,
          ignoreQueryPrefix: true,
        }),
      },
      // intentionally omit `serverURL` to keep URL relative
      urlSuffix: `${currentRoute}${searchParams ? queryString : ''}`,
    },
  })

  if (
    !permissions.canAccessAdmin &&
    !isPublicAdminRoute({ adminRoute, config: payload.config, route: currentRoute }) &&
    !isCustomAdminView({ adminRoute, config: payload.config, route: currentRoute })
  ) {
    redirect(
      handleAuthRedirect({
        config: payload.config,
        route: currentRoute,
        searchParams,
        user: req.user,
      }),
    )
  }

  let collectionPreferences: CollectionPreferences = undefined

  if (collectionConfig && segments.length === 2) {
    if (config.folders && collectionConfig.folders && segments[1] !== config.folders.slug) {
      await getPreferences<CollectionPreferences>(
        `collection-${collectionConfig.slug}`,
        req.payload,
        req.user.id,
        config.admin.user,
      ).then((res) => {
        if (res && res.value) {
          collectionPreferences = res.value
        }
      })
    }
  }

  const {
    browseByFolderSlugs,
    DefaultView,
    documentSubViewType,
    routeParams,
    templateClassName,
    templateType,
    viewActions,
    viewType,
  } = getRouteData({
    adminRoute,
    collectionConfig,
    collectionPreferences,
    currentRoute,
    globalConfig,
    payload,
    searchParams,
    segments,
  })

  req.routeParams = routeParams

  const dbHasUser =
    req.user ||
    (await req.payload.db
      .findOne({
        collection: userSlug,
        req,
      })
      ?.then((doc) => !!doc))

  /**
   * This function is responsible for handling the case where the view is not found.
   * The current route did not match any default views or custom route views.
   */
  if (!DefaultView?.Component && !DefaultView?.payloadComponent) {
    if (req?.user) {
      notFound()
    }

    if (dbHasUser) {
      redirect(adminRoute)
    }
  }

  const usersCollection = config.collections.find(({ slug }) => slug === userSlug)
  const disableLocalStrategy = usersCollection?.auth?.disableLocalStrategy

  const createFirstUserRoute = formatAdminURL({
    adminRoute,
    path: _createFirstUserRoute,
    relative: true,
    serverURL: config.serverURL,
  })

  if (disableLocalStrategy && currentRoute === createFirstUserRoute) {
    redirect(adminRoute)
  }

  if (!dbHasUser && currentRoute !== createFirstUserRoute && !disableLocalStrategy) {
    redirect(createFirstUserRoute)
  }

  if (dbHasUser && currentRoute === createFirstUserRoute) {
    redirect(adminRoute)
  }

  if (!DefaultView?.Component && !DefaultView?.payloadComponent && !dbHasUser) {
    redirect(adminRoute)
  }

  const clientConfig = getClientConfig({
    config,
    i18n: req.i18n,
    importMap,
    user: viewType === 'createFirstUser' ? true : req.user,
  })
  await applyLocaleFiltering({ clientConfig, config, req })

  // Ensure locale on req is still valid after filtering locales
  if (
    clientConfig.localization &&
    req.locale &&
    !clientConfig.localization.localeCodes.includes(req.locale)
  ) {
    redirect(
      `${currentRoute}${qs.stringify(
        {
          ...searchParams,
          locale: clientConfig.localization.localeCodes.includes(
            clientConfig.localization.defaultLocale,
          )
            ? clientConfig.localization.defaultLocale
            : clientConfig.localization.localeCodes[0],
        },
        { addQueryPrefix: true },
      )}`,
    )
  }

  const visibleEntities = getVisibleEntities({ req })

  const folderID = routeParams.folderID

  const RenderedView = RenderServerComponent({
    clientProps: {
      browseByFolderSlugs,
      clientConfig,
      documentSubViewType,
      viewType,
    } satisfies AdminViewClientProps,
    Component: DefaultView.payloadComponent,
    Fallback: DefaultView.Component,
    importMap,
    serverProps: {
      clientConfig,
      collectionConfig,
      docID: routeParams.id,
      folderID,
      globalConfig,
      i18n: req.i18n,
      importMap,
      initPageResult: {
        collectionConfig,
        cookies,
        docID: routeParams.id,
        globalConfig,
        languageOptions: Object.entries(req.payload.config.i18n.supportedLanguages || {}).reduce(
          (acc, [language, languageConfig]) => {
            if (Object.keys(req.payload.config.i18n.supportedLanguages).includes(language)) {
              acc.push({
                label: languageConfig.translations.general.thisLanguage,
                value: language,
              })
            }

            return acc
          },
          [],
        ),
        locale,
        permissions,
        req,
        translations: req.i18n.translations,
        visibleEntities,
      },
      params,
      payload: req.payload,
      searchParams,
      viewActions,
    } satisfies AdminViewServerPropsOnly,
  })

  return (
    <PageConfigProvider config={clientConfig}>
      {!templateType && <React.Fragment>{RenderedView}</React.Fragment>}
      {templateType === 'minimal' && (
        <MinimalTemplate className={templateClassName}>{RenderedView}</MinimalTemplate>
      )}
      {templateType === 'default' && (
        <DefaultTemplate
          collectionSlug={collectionConfig?.slug}
          docID={routeParams.id}
          documentSubViewType={documentSubViewType}
          globalSlug={globalConfig?.slug}
          i18n={req.i18n}
          locale={locale}
          params={params}
          payload={req.payload}
          permissions={permissions}
          req={req}
          searchParams={searchParams}
          user={req.user}
          viewActions={viewActions}
          viewType={viewType}
          visibleEntities={{
            // The reason we are not passing in initPageResult.visibleEntities directly is due to a "Cannot assign to read only property of object '#<Object>" error introduced in React 19
            // which this caused as soon as initPageResult.visibleEntities is passed in
            collections: visibleEntities?.collections,
            globals: visibleEntities?.globals,
          }}
        >
          {RenderedView}
        </DefaultTemplate>
      )}
    </PageConfigProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: isPathMatchingRoute.ts]---
Location: payload-main/packages/next/src/views/Root/isPathMatchingRoute.ts

```typescript
import { pathToRegexp } from 'path-to-regexp'

export const isPathMatchingRoute = ({
  currentRoute,
  exact,
  path: viewPath,
  sensitive,
  strict,
}: {
  currentRoute: string
  exact?: boolean
  path?: string
  sensitive?: boolean
  strict?: boolean
}) => {
  // if no path is defined, we cannot match it so return false early
  if (!viewPath) {
    return false
  }

  const keys = []

  // run the view path through `pathToRegexp` to resolve any dynamic segments
  // i.e. `/admin/custom-view/:id` -> `/admin/custom-view/123`
  const regex = pathToRegexp(viewPath, keys, {
    sensitive,
    strict,
  })

  const match = regex.exec(currentRoute)
  const viewRoute = match?.[0] || viewPath

  if (exact) {
    return currentRoute === viewRoute
  }

  if (!exact) {
    return viewRoute.startsWith(currentRoute)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Root/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { SanitizedConfig } from 'payload'

import { getNextRequestI18n } from '../../utilities/getNextRequestI18n.js'
import { generateAccountViewMetadata } from '../Account/metadata.js'
import { generateBrowseByFolderMetadata } from '../BrowseByFolder/metadata.js'
import { generateCollectionFolderMetadata } from '../CollectionFolders/metadata.js'
import { generateCollectionTrashMetadata } from '../CollectionTrash/metadata.js'
import { generateCreateFirstUserViewMetadata } from '../CreateFirstUser/metadata.js'
import { generateDashboardViewMetadata } from '../Dashboard/metadata.js'
import { generateDocumentViewMetadata } from '../Document/metadata.js'
import { generateForgotPasswordViewMetadata } from '../ForgotPassword/metadata.js'
import { generateListViewMetadata } from '../List/metadata.js'
import { generateLoginViewMetadata } from '../Login/metadata.js'
import { generateNotFoundViewMetadata } from '../NotFound/metadata.js'
import { generateResetPasswordViewMetadata } from '../ResetPassword/metadata.js'
import { generateUnauthorizedViewMetadata } from '../Unauthorized/metadata.js'
import { generateVerifyViewMetadata } from '../Verify/metadata.js'
import { generateCustomViewMetadata } from './generateCustomViewMetadata.js'
import { getCustomViewByRoute } from './getCustomViewByRoute.js'

const oneSegmentMeta = {
  'create-first-user': generateCreateFirstUserViewMetadata,
  folders: generateBrowseByFolderMetadata,
  forgot: generateForgotPasswordViewMetadata,
  login: generateLoginViewMetadata,
  logout: generateUnauthorizedViewMetadata,
  'logout-inactivity': generateUnauthorizedViewMetadata,
  unauthorized: generateUnauthorizedViewMetadata,
}

type Args = {
  config: Promise<SanitizedConfig>
  params: Promise<{
    [key: string]: string | string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generatePageMetadata = async ({
  config: configPromise,
  params: paramsPromise,
}: Args) => {
  const config = await configPromise
  const params = await paramsPromise

  const folderCollectionSlugs = config.collections.reduce((acc, { slug, folders }) => {
    if (folders) {
      return [...acc, slug]
    }
    return acc
  }, [])
  const segments = Array.isArray(params.segments) ? params.segments : []

  const currentRoute = `/${segments.join('/')}`
  const [segmentOne, segmentTwo, segmentThree] = segments

  const isGlobal = segmentOne === 'globals'
  const isCollection = segmentOne === 'collections'

  const i18n = await getNextRequestI18n({
    config,
  })

  let meta: Metadata

  // TODO: handle custom routes

  const collectionConfig =
    isCollection &&
    segments.length > 1 &&
    config?.collections?.find((collection) => collection.slug === segmentTwo)

  const globalConfig =
    isGlobal && segments.length > 1 && config?.globals?.find((global) => global.slug === segmentTwo)

  switch (segments.length) {
    case 0: {
      meta = await generateDashboardViewMetadata({ config, i18n })
      break
    }
    case 1: {
      if (folderCollectionSlugs.length && `/${segmentOne}` === config.admin.routes.browseByFolder) {
        // --> /:folderCollectionSlug
        meta = await oneSegmentMeta.folders({ config, i18n })
      } else if (segmentOne === 'account') {
        // --> /account
        meta = await generateAccountViewMetadata({ config, i18n })
        break
      } else if (oneSegmentMeta[segmentOne]) {
        // --> /create-first-user
        // --> /forgot
        // --> /login
        // --> /logout
        // --> /logout-inactivity
        // --> /unauthorized
        meta = await oneSegmentMeta[segmentOne]({ config, i18n })
        break
      }
      break
    }
    case 2: {
      if (`/${segmentOne}` === config.admin.routes.reset) {
        // --> /reset/:token
        meta = await generateResetPasswordViewMetadata({ config, i18n })
      } else if (
        folderCollectionSlugs.length &&
        `/${segmentOne}` === config.admin.routes.browseByFolder
      ) {
        // --> /browse-by-folder/:folderID
        meta = await generateBrowseByFolderMetadata({ config, i18n })
      } else if (isCollection) {
        // --> /collections/:collectionSlug
        meta = await generateListViewMetadata({ collectionConfig, config, i18n })
      } else if (isGlobal) {
        // --> /globals/:globalSlug
        meta = await generateDocumentViewMetadata({
          config,
          globalConfig,
          i18n,
          params,
        })
      }
      break
    }
    default: {
      if (segmentTwo === 'verify') {
        // --> /:collectionSlug/verify/:token
        meta = await generateVerifyViewMetadata({ config, i18n })
      } else if (isCollection) {
        if (segmentThree === 'trash' && segments.length === 3 && collectionConfig) {
          // Collection Trash Views
          // --> /collections/:collectionSlug/trash
          meta = await generateCollectionTrashMetadata({
            collectionConfig,
            config,
            i18n,
            params,
          })
        } else if (config.folders && segmentThree === config.folders.slug) {
          if (folderCollectionSlugs.includes(collectionConfig.slug)) {
            // Collection Folder Views
            // --> /collections/:collectionSlug/:folderCollectionSlug
            // --> /collections/:collectionSlug/:folderCollectionSlug/:id
            meta = await generateCollectionFolderMetadata({
              collectionConfig,
              config,
              i18n,
              params,
            })
          }
        } else {
          // Collection Document Views
          // --> /collections/:collectionSlug/:id
          // --> /collections/:collectionSlug/:id/versions
          // --> /collections/:collectionSlug/:id/versions/:version
          // --> /collections/:collectionSlug/:id/api
          // --> /collections/:collectionSlug/trash/:id
          meta = await generateDocumentViewMetadata({ collectionConfig, config, i18n, params })
        }
      } else if (isGlobal) {
        // Global Document Views
        // --> /globals/:globalSlug/versions
        // --> /globals/:globalSlug/versions/:version
        // --> /globals/:globalSlug/api
        meta = await generateDocumentViewMetadata({
          config,
          globalConfig,
          i18n,
          params,
        })
      }
      break
    }
  }

  if (!meta) {
    const { viewConfig, viewKey } = getCustomViewByRoute({
      config,
      currentRoute,
    })

    if (viewKey) {
      // Custom Views
      // --> /:path
      meta = await generateCustomViewMetadata({
        config,
        i18n,
        viewConfig,
      })
    } else {
      meta = await generateNotFoundViewMetadata({ config, i18n })
    }
  }

  return meta
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Unauthorized/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .unauthorized {
    &__button.btn {
      margin: 0;
      margin-block: 0;
    }

    &--with-gutter {
      margin-top: var(--base);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Unauthorized/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import { Button, Gutter } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { FormHeader } from '../../elements/FormHeader/index.js'
import './index.scss'

const baseClass = 'unauthorized'

export function UnauthorizedView({ initPageResult }: AdminViewServerProps) {
  const {
    permissions,
    req: {
      i18n,
      payload: {
        config: {
          admin: {
            routes: { logout: logoutRoute },
          },
          routes: { admin: adminRoute },
          serverURL,
        },
      },
      user,
    },
  } = initPageResult

  return (
    <div className={baseClass}>
      <FormHeader
        description={i18n.t('error:notAllowedToAccessPage')}
        heading={i18n.t(
          user && !permissions.canAccessAdmin ? 'error:unauthorizedAdmin' : 'error:unauthorized',
        )}
      />
      <Button
        className={`${baseClass}__button`}
        el="link"
        size="large"
        to={formatAdminURL({
          adminRoute,
          path: logoutRoute,
          serverURL,
        })}
      >
        {i18n.t('authentication:logOut')}
      </Button>
    </div>
  )
}

export const UnauthorizedViewWithGutter = (props: AdminViewServerProps) => {
  return (
    <Gutter className={[baseClass, `${baseClass}--with-gutter`].join(' ')}>
      <UnauthorizedView {...props} />
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Unauthorized/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateUnauthorizedViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    description: t('error:unauthorized'),
    keywords: t('error:unauthorized'),
    serverURL: config.serverURL,
    title: t('error:unauthorized'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/Verify/index.client.tsx
Signals: React, Next.js

```typescript
'use client'
import { toast, useRouteTransition } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import React, { useEffect } from 'react'

type Props = {
  message: string
  redirectTo: string
}
export function ToastAndRedirect({ message, redirectTo }: Props) {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const hasToastedRef = React.useRef(false)

  useEffect(() => {
    let timeoutID

    if (toast) {
      timeoutID = setTimeout(() => {
        toast.success(message)
        hasToastedRef.current = true
        startRouteTransition(() => router.push(redirectTo))
      }, 100)
    }

    return () => {
      if (timeoutID) {
        clearTimeout(timeoutID)
      }
    }
  }, [router, redirectTo, message, startRouteTransition])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Verify/index.scss

```text
@layer payload-default {
  .verify {
    display: flex;
    align-items: center;
    text-align: center;
    flex-wrap: wrap;
    min-height: 100vh;

    &__brand {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-bottom: calc(var(--base) * 2);
    }
  }
}
```

--------------------------------------------------------------------------------

````
