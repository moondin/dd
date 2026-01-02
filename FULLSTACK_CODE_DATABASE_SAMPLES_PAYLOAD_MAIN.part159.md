---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 159
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 159 of 695)

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

---[FILE: handleServerFunctions.ts]---
Location: payload-main/packages/next/src/utilities/handleServerFunctions.ts

```typescript
import type { ServerFunction, ServerFunctionHandler } from 'payload'

import { _internal_renderFieldHandler, copyDataFromLocaleHandler } from '@payloadcms/ui/rsc'
import { buildFormStateHandler } from '@payloadcms/ui/utilities/buildFormState'
import { buildTableStateHandler } from '@payloadcms/ui/utilities/buildTableState'
import { getFolderResultsComponentAndDataHandler } from '@payloadcms/ui/utilities/getFolderResultsComponentAndData'
import { schedulePublishHandler } from '@payloadcms/ui/utilities/schedulePublishHandler'

import { renderDocumentHandler } from '../views/Document/handleServerFunction.js'
import { renderDocumentSlotsHandler } from '../views/Document/renderDocumentSlots.js'
import { renderListHandler } from '../views/List/handleServerFunction.js'
import { initReq } from './initReq.js'
import { slugifyHandler } from './slugify.js'

const baseServerFunctions: Record<string, ServerFunction<any, any>> = {
  'copy-data-from-locale': copyDataFromLocaleHandler,
  'form-state': buildFormStateHandler,
  'get-folder-results-component-and-data': getFolderResultsComponentAndDataHandler,
  'render-document': renderDocumentHandler,
  'render-document-slots': renderDocumentSlotsHandler,
  'render-field': _internal_renderFieldHandler,
  'render-list': renderListHandler,
  'schedule-publish': schedulePublishHandler,
  slugify: slugifyHandler,
  'table-state': buildTableStateHandler,
}

export const handleServerFunctions: ServerFunctionHandler = async (args) => {
  const {
    name: fnKey,
    args: fnArgs,
    config: configPromise,
    importMap,
    serverFunctions: extraServerFunctions,
  } = args

  const { req } = await initReq({
    configPromise,
    importMap,
    key: 'RootLayout',
  })

  const augmentedArgs: Parameters<ServerFunction>[0] = {
    ...fnArgs,
    importMap,
    req,
  }

  const serverFunctions = {
    ...baseServerFunctions,
    ...(extraServerFunctions || {}),
  }

  const fn = serverFunctions[fnKey]

  if (!fn) {
    throw new Error(`Unknown Server Function: ${fnKey}`)
  }

  return fn(augmentedArgs)
}
```

--------------------------------------------------------------------------------

---[FILE: initReq.ts]---
Location: payload-main/packages/next/src/utilities/initReq.ts
Signals: Next.js

```typescript
import type { AcceptedLanguages, I18n, I18nClient } from '@payloadcms/translations'
import type {
  ImportMap,
  Locale,
  Payload,
  PayloadRequest,
  SanitizedConfig,
  SanitizedPermissions,
  TypedUser,
} from 'payload'

import { initI18n } from '@payloadcms/translations'
import { headers as getHeaders } from 'next/headers.js'
import {
  createLocalReq,
  executeAuthStrategies,
  getAccessResults,
  getPayload,
  getRequestLanguage,
  parseCookies,
} from 'payload'

import { getRequestLocale } from './getRequestLocale.js'
import { selectiveCache } from './selectiveCache.js'

type Result = {
  cookies: Map<string, string>
  headers: Awaited<ReturnType<typeof getHeaders>>
  languageCode: AcceptedLanguages
  locale?: Locale
  permissions: SanitizedPermissions
  req: PayloadRequest
}

type PartialResult = {
  i18n: I18nClient
  languageCode: AcceptedLanguages
  payload: Payload
  responseHeaders: Headers
  user: null | TypedUser
}

// Create cache instances for different parts of our application
const partialReqCache = selectiveCache<PartialResult>('partialReq')
const reqCache = selectiveCache<Result>('req')

/**
 * Initializes a full request object, including the `req` object and access control.
 * As access control and getting the request locale is dependent on the current URL and
 */
export const initReq = async function ({
  canSetHeaders,
  configPromise,
  importMap,
  key,
  overrides,
}: {
  canSetHeaders?: boolean
  configPromise: Promise<SanitizedConfig> | SanitizedConfig
  importMap: ImportMap
  key: string
  overrides?: Parameters<typeof createLocalReq>[0]
}): Promise<Result> {
  const headers = await getHeaders()
  const cookies = parseCookies(headers)

  const partialResult = await partialReqCache.get(async () => {
    const config = await configPromise
    const payload = await getPayload({ config, cron: true, importMap })
    const languageCode = getRequestLanguage({
      config,
      cookies,
      headers,
    })

    const i18n: I18nClient = await initI18n({
      config: config.i18n,
      context: 'client',
      language: languageCode,
    })

    const { responseHeaders, user } = await executeAuthStrategies({
      canSetHeaders,
      headers,
      payload,
    })

    return {
      i18n,
      languageCode,
      payload,
      responseHeaders,
      user,
    }
  }, 'global')

  return reqCache
    .get(async () => {
      const { i18n, languageCode, payload, responseHeaders, user } = partialResult

      const { req: reqOverrides, ...optionsOverrides } = overrides || {}

      const req = await createLocalReq(
        {
          req: {
            headers,
            host: headers.get('host'),
            i18n: i18n as I18n,
            responseHeaders,
            user,
            ...(reqOverrides || {}),
          },
          ...(optionsOverrides || {}),
        },
        payload,
      )

      const locale = await getRequestLocale({
        req,
      })

      req.locale = locale?.code

      const permissions = await getAccessResults({
        req,
      })

      return {
        cookies,
        headers,
        languageCode,
        locale,
        permissions,
        req,
      }
    }, key)
    .then((result) => {
      // CRITICAL: Create a shallow copy of req before returning to prevent
      // mutations from propagating to the cached req object.
      // This ensures parallel operations using the same cache key don't affect each other.
      return {
        ...result,
        req: {
          ...result.req,
          ...(result.req?.context
            ? {
                context: { ...result.req.context },
              }
            : {}),
        },
      }
    })
}
```

--------------------------------------------------------------------------------

---[FILE: isCustomAdminView.ts]---
Location: payload-main/packages/next/src/utilities/isCustomAdminView.ts

```typescript
import type { SanitizedConfig } from 'payload'

import { getRouteWithoutAdmin } from './getRouteWithoutAdmin.js'

/**
 * Returns an array of views marked with 'public: true' in the config
 */
export const isCustomAdminView = ({
  adminRoute,
  config,
  route,
}: {
  adminRoute: string
  config: SanitizedConfig
  route: string
}): boolean => {
  if (config.admin?.components?.views) {
    const isPublicAdminRoute = Object.entries(config.admin.components.views).some(([_, view]) => {
      const routeWithoutAdmin = getRouteWithoutAdmin({ adminRoute, route })

      if (view.exact) {
        if (routeWithoutAdmin === view.path) {
          return true
        }
      } else {
        if (routeWithoutAdmin.startsWith(view.path)) {
          return true
        }
      }
      return false
    })
    return isPublicAdminRoute
  }
  return false
}
```

--------------------------------------------------------------------------------

---[FILE: isPublicAdminRoute.ts]---
Location: payload-main/packages/next/src/utilities/isPublicAdminRoute.ts

```typescript
import type { SanitizedConfig } from 'payload'

import { getRouteWithoutAdmin } from './getRouteWithoutAdmin.js'

// Routes that require admin authentication
const publicAdminRoutes: (keyof Pick<
  SanitizedConfig['admin']['routes'],
  'createFirstUser' | 'forgot' | 'inactivity' | 'login' | 'logout' | 'reset' | 'unauthorized'
>)[] = [
  'createFirstUser',
  'forgot',
  'login',
  'logout',
  'forgot',
  'inactivity',
  'unauthorized',
  'reset',
]

export const isPublicAdminRoute = ({
  adminRoute,
  config,
  route,
}: {
  adminRoute: string
  config: SanitizedConfig
  route: string
}): boolean => {
  const isPublicAdminRoute = publicAdminRoutes.some((routeSegment) => {
    const segment = config.admin?.routes?.[routeSegment] || routeSegment
    const routeWithoutAdmin = getRouteWithoutAdmin({ adminRoute, route })

    if (routeWithoutAdmin.startsWith(segment)) {
      return true
    } else if (routeWithoutAdmin.includes('/verify/')) {
      return true
    } else {
      return false
    }
  })

  return isPublicAdminRoute
}
```

--------------------------------------------------------------------------------

---[FILE: meta.ts]---
Location: payload-main/packages/next/src/utilities/meta.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { Icon } from 'next/dist/lib/metadata/types/metadata-types.js'
import type { MetaConfig } from 'payload'

import { payloadFaviconDark, payloadFaviconLight, staticOGImage } from '@payloadcms/ui/assets'
import * as qs from 'qs-esm'

const defaultOpenGraph: Metadata['openGraph'] = {
  description:
    'Payload is a headless CMS and application framework built with TypeScript, Node.js, and React.',
  siteName: 'Payload App',
  title: 'Payload App',
}

export const generateMetadata = async (
  args: { serverURL: string } & MetaConfig,
): Promise<Metadata> => {
  const { defaultOGImageType, serverURL, titleSuffix, ...rest } = args

  /**
   * @todo find a way to remove the type assertion here.
   * It is a result of needing to `DeepCopy` the `MetaConfig` type from Payload.
   * This is required for the `DeepRequired` from `Config` to `SanitizedConfig`.
   */
  const incomingMetadata = rest as Metadata

  const icons: Metadata['icons'] =
    incomingMetadata.icons ||
    ([
      {
        type: 'image/png',
        rel: 'icon',
        sizes: '32x32',
        url: typeof payloadFaviconDark === 'object' ? payloadFaviconDark?.src : payloadFaviconDark,
      },
      {
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
        rel: 'icon',
        sizes: '32x32',
        url:
          typeof payloadFaviconLight === 'object' ? payloadFaviconLight?.src : payloadFaviconLight,
      },
    ] satisfies Array<Icon>)

  const metaTitle: Metadata['title'] = [incomingMetadata.title, titleSuffix]
    .filter(Boolean)
    .join(' ')

  const ogTitle = `${typeof incomingMetadata.openGraph?.title === 'string' ? incomingMetadata.openGraph.title : incomingMetadata.title} ${titleSuffix}`

  const mergedOpenGraph: Metadata['openGraph'] = {
    ...(defaultOpenGraph || {}),
    ...(defaultOGImageType === 'dynamic'
      ? {
          images: [
            {
              alt: ogTitle,
              height: 630,
              url: `/api/og${qs.stringify(
                {
                  description:
                    incomingMetadata.openGraph?.description || defaultOpenGraph.description,
                  title: ogTitle,
                },
                {
                  addQueryPrefix: true,
                },
              )}`,
              width: 1200,
            },
          ],
        }
      : {}),
    ...(defaultOGImageType === 'static'
      ? {
          images: [
            {
              alt: ogTitle,
              height: 480,
              url: typeof staticOGImage === 'object' ? staticOGImage?.src : staticOGImage,
              width: 640,
            },
          ],
        }
      : {}),
    title: ogTitle,
    ...(incomingMetadata.openGraph || {}),
  }

  return Promise.resolve({
    ...incomingMetadata,
    icons,
    metadataBase: new URL(
      serverURL ||
        process.env.PAYLOAD_PUBLIC_SERVER_URL ||
        `http://localhost:${process.env.PORT || 3000}`,
    ),
    openGraph: mergedOpenGraph,
    title: metaTitle,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: selectiveCache.ts]---
Location: payload-main/packages/next/src/utilities/selectiveCache.ts
Signals: React

```typescript
import { cache } from 'react'

type CachedValue = object

// Module-scoped cache container that holds all cached, stable containers
// - these may hold the stable value, or a promise to the stable value
const globalCacheContainer: Record<
  string,
  <TValue extends object = CachedValue>(
    ...args: unknown[]
  ) => {
    value: null | Promise<TValue> | TValue
  }
> = {}

/**
 * Creates a selective cache function that provides more control over React's request-level caching behavior.
 *
 * @param namespace - A namespace to group related cached values
 * @returns A function that manages cached values within the specified namespace
 */
export function selectiveCache<TValue extends object = CachedValue>(namespace: string) {
  // Create a stable namespace container if it doesn't exist
  if (!globalCacheContainer[namespace]) {
    globalCacheContainer[namespace] = cache((...args) => ({
      value: null,
    }))
  }

  /**
   * Gets or creates a cached value for a specific key within the namespace
   *
   * @param key - The key to identify the cached value
   * @param factory - A function that produces the value if not cached
   * @returns The cached or newly created value
   */
  const getCached = async (factory: () => Promise<TValue>, ...cacheArgs): Promise<TValue> => {
    const stableObjectFn = globalCacheContainer[namespace]
    const stableObject = stableObjectFn<TValue>(...cacheArgs)

    if (
      stableObject?.value &&
      'then' in stableObject.value &&
      typeof stableObject.value?.then === 'function'
    ) {
      return await stableObject.value
    }

    stableObject.value = factory()

    return await stableObject.value
  }

  return {
    get: getCached,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: setPayloadAuthCookie.ts]---
Location: payload-main/packages/next/src/utilities/setPayloadAuthCookie.ts
Signals: Next.js

```typescript
import type { Auth } from 'payload'

import { cookies as getCookies } from 'next/headers.js'
import { generatePayloadCookie } from 'payload'

type SetPayloadAuthCookieArgs = {
  authConfig: Auth
  cookiePrefix: string
  token: string
}

export async function setPayloadAuthCookie({
  authConfig,
  cookiePrefix,
  token,
}: SetPayloadAuthCookieArgs): Promise<void> {
  const cookies = await getCookies()

  const cookieExpiration = authConfig.tokenExpiration
    ? new Date(Date.now() + authConfig.tokenExpiration)
    : undefined

  const payloadCookie = generatePayloadCookie({
    collectionAuthConfig: authConfig,
    cookiePrefix,
    expires: cookieExpiration,
    returnCookieAsObject: true,
    token,
  })

  if (payloadCookie.value) {
    cookies.set(payloadCookie.name, payloadCookie.value, {
      domain: authConfig.cookies.domain,
      expires: payloadCookie.expires ? new Date(payloadCookie.expires) : undefined,
      httpOnly: true,
      sameSite: (typeof authConfig.cookies.sameSite === 'string'
        ? authConfig.cookies.sameSite.toLowerCase()
        : 'lax') as 'lax' | 'none' | 'strict',
      secure: authConfig.cookies.secure || false,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: slugify.ts]---
Location: payload-main/packages/next/src/utilities/slugify.ts

```typescript
import type { Slugify } from 'payload/shared'

import {
  flattenAllFields,
  getFieldByPath,
  type ServerFunction,
  type SlugifyServerFunctionArgs,
  UnauthorizedError,
} from 'payload'
import { slugify as defaultSlugify } from 'payload/shared'

/**
 * This server function is directly related to the {@link https://payloadcms.com/docs/fields/text#slug-field | Slug Field}.
 * This is a server function that is used to invoke the user's custom slugify function from the client.
 * This pattern is required, as there is no other way for us to pass their function across the client-server boundary.
 *   - Not through props
 *   - Not from a server function defined within a server component (see below)
 * When a server function contains non-serializable data within its closure, it gets passed through the boundary (and breaks).
 * The only way to pass server functions to the client (that contain non-serializable data) is if it is globally defined.
 * But we also cannot define this function alongside the server component, as we will not have access to their custom slugify function.
 * See `ServerFunctionsProvider` for more details.
 */
export const slugifyHandler: ServerFunction<
  SlugifyServerFunctionArgs,
  Promise<ReturnType<Slugify>>
> = async (args) => {
  const { collectionSlug, data, globalSlug, path, req, valueToSlugify } = args

  if (!req.user) {
    throw new UnauthorizedError()
  }

  const docConfig = collectionSlug
    ? req.payload.collections[collectionSlug]?.config
    : globalSlug
      ? req.payload.config.globals.find((g) => g.slug === globalSlug)
      : null

  if (!docConfig) {
    throw new Error()
  }

  const { field } = getFieldByPath({
    config: req.payload.config,
    fields: flattenAllFields({ fields: docConfig.fields }),
    path,
  })

  const customSlugify = (
    typeof field?.custom?.slugify === 'function' ? field.custom.slugify : undefined
  ) as Slugify

  const result = customSlugify
    ? await customSlugify({ data, req, valueToSlugify })
    : defaultSlugify(valueToSlugify)

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: timestamp.ts]---
Location: payload-main/packages/next/src/utilities/timestamp.ts

```typescript
export const timestamp = (label: string) => {
  if (!process.env.PAYLOAD_TIME) {
    process.env.PAYLOAD_TIME = String(new Date().getTime())
  }
  const now = new Date()
  console.log(`[${now.getTime() - Number(process.env.PAYLOAD_TIME)}ms] ${label}`)
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/Account/index.client.tsx
Signals: React

```typescript
'use client'
import { type StepNavItem, useStepNav, useTranslation } from '@payloadcms/ui'
import React from 'react'

export const AccountClient: React.FC = () => {
  const { setStepNav } = useStepNav()
  const { t } = useTranslation()

  React.useEffect(() => {
    const nav: StepNavItem[] = []

    nav.push({
      label: t('authentication:account'),
      url: '/account',
    })

    setStepNav(nav)
  }, [setStepNav, t])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Account/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps, DocumentViewServerPropsOnly } from 'payload'

import { DocumentInfoProvider, EditDepthProvider, HydrateAuthProvider } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { buildFormState } from '@payloadcms/ui/utilities/buildFormState'
import { notFound } from 'next/navigation.js'
import React from 'react'

import { DocumentHeader } from '../../elements/DocumentHeader/index.js'
import { getDocPreferences } from '../Document/getDocPreferences.js'
import { getDocumentData } from '../Document/getDocumentData.js'
import { getDocumentPermissions } from '../Document/getDocumentPermissions.js'
import { getIsLocked } from '../Document/getIsLocked.js'
import { getVersions } from '../Document/getVersions.js'
import { EditView } from '../Edit/index.js'
import { AccountClient } from './index.client.js'
import { Settings } from './Settings/index.js'

export async function AccountView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const {
    languageOptions,
    locale,
    permissions,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      user,
    },
  } = initPageResult

  const {
    admin: { theme, user: userSlug },
    routes: { api },
    serverURL,
  } = config

  const collectionConfig = payload?.collections?.[userSlug]?.config

  if (collectionConfig && user?.id) {
    // Fetch the data required for the view
    const data = await getDocumentData({
      id: user.id,
      collectionSlug: collectionConfig.slug,
      locale,
      payload,
      req,
      user,
    })

    if (!data) {
      throw new Error('not-found')
    }

    // Get document preferences
    const docPreferences = await getDocPreferences({
      id: user.id,
      collectionSlug: collectionConfig.slug,
      payload,
      user,
    })

    // Get permissions
    const { docPermissions, hasPublishPermission, hasSavePermission } =
      await getDocumentPermissions({
        id: user.id,
        collectionConfig,
        data,
        req,
      })

    // Build initial form state from data
    const { state: formState } = await buildFormState({
      id: user.id,
      collectionSlug: collectionConfig.slug,
      data,
      docPermissions,
      docPreferences,
      locale: locale?.code,
      operation: 'update',
      renderAllFields: true,
      req,
      schemaPath: collectionConfig.slug,
      skipValidation: true,
    })

    // Fetch document lock state
    const { currentEditor, isLocked, lastUpdateTime } = await getIsLocked({
      id: user.id,
      collectionConfig,
      isEditing: true,
      req,
    })

    // Get all versions required for UI
    const { hasPublishedDoc, mostRecentVersionIsAutosaved, unpublishedVersionCount, versionCount } =
      await getVersions({
        id: user.id,
        collectionConfig,
        doc: data,
        docPermissions,
        locale: locale?.code,
        payload,
        user,
      })

    return (
      <DocumentInfoProvider
        AfterFields={
          <Settings
            i18n={i18n}
            languageOptions={languageOptions}
            payload={payload}
            theme={theme}
            user={user}
          />
        }
        apiURL={`${serverURL}${api}/${userSlug}${user?.id ? `/${user.id}` : ''}`}
        collectionSlug={userSlug}
        currentEditor={currentEditor}
        docPermissions={docPermissions}
        hasPublishedDoc={hasPublishedDoc}
        hasPublishPermission={hasPublishPermission}
        hasSavePermission={hasSavePermission}
        id={user?.id}
        initialData={data}
        initialState={formState}
        isEditing
        isLocked={isLocked}
        lastUpdateTime={lastUpdateTime}
        mostRecentVersionIsAutosaved={mostRecentVersionIsAutosaved}
        unpublishedVersionCount={unpublishedVersionCount}
        versionCount={versionCount}
      >
        <EditDepthProvider>
          <DocumentHeader
            collectionConfig={collectionConfig}
            hideTabs
            permissions={permissions}
            req={req}
          />
          <HydrateAuthProvider permissions={permissions} />
          {RenderServerComponent({
            Component: config.admin?.components?.views?.account?.Component,
            Fallback: EditView,
            importMap: payload.importMap,
            serverProps: {
              doc: data,
              hasPublishedDoc,
              i18n,
              initPageResult,
              locale,
              params,
              payload,
              permissions,
              routeSegments: [],
              searchParams,
              user,
            } satisfies DocumentViewServerPropsOnly,
          })}
          <AccountClient />
        </EditDepthProvider>
      </DocumentInfoProvider>
    )
  }

  return notFound()
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Account/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateAccountViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: `${t('authentication:accountOfCurrentUser')}`,
    keywords: `${t('authentication:account')}`,
    serverURL: config.serverURL,
    title: t('authentication:account'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Account/ResetPreferences/index.tsx
Signals: React

```typescript
'use client'
import type { TypedUser } from 'payload'

import { Button, ConfirmationModal, toast, useModal, useTranslation } from '@payloadcms/ui'
import { formatApiURL } from 'payload/shared'
import * as qs from 'qs-esm'
import { Fragment, useCallback } from 'react'

const confirmResetModalSlug = 'confirm-reset-modal'

export const ResetPreferences: React.FC<{
  readonly apiRoute: string
  readonly user?: TypedUser
}> = ({ apiRoute, user }) => {
  const { openModal } = useModal()
  const { t } = useTranslation()

  const handleResetPreferences = useCallback(async () => {
    if (!user) {
      return
    }

    const stringifiedQuery = qs.stringify(
      {
        depth: 0,
        where: {
          user: {
            id: {
              equals: user.id,
            },
          },
        },
      },
      { addQueryPrefix: true },
    )

    try {
      const res = await fetch(
        formatApiURL({
          apiRoute,
          path: `/payload-preferences${stringifiedQuery}`,
          serverURL: undefined,
        }),
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        },
      )

      const json = await res.json()
      const message = json.message

      if (res.ok) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    } catch (_err) {
      // swallow error
    }
  }, [apiRoute, user])

  return (
    <Fragment>
      <div>
        <Button buttonStyle="secondary" onClick={() => openModal(confirmResetModalSlug)}>
          {t('general:resetPreferences')}
        </Button>
      </div>
      <ConfirmationModal
        body={t('general:resetPreferencesDescription')}
        confirmingLabel={t('general:resettingPreferences')}
        heading={t('general:resetPreferences')}
        modalSlug={confirmResetModalSlug}
        onConfirm={handleResetPreferences}
      />
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Account/Settings/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .payload-settings {
    position: relative;
    margin-bottom: calc(var(--base) * 2);

    h3 {
      margin: 0;
    }

    &::before,
    &::after {
      content: '';
      display: block;
      height: 1px;
      background: var(--theme-elevation-100);
      width: calc(100% + calc(var(--base) * 5));
      left: calc(var(--gutter-h) * -1);
      top: 0;
      position: absolute;
    }

    &::after {
      display: none;
      bottom: 0;
      top: unset;
    }

    margin-top: calc(var(--base) * 3);
    padding-top: calc(var(--base) * 3);
    padding-bottom: calc(var(--base) * 3);
    display: flex;
    flex-direction: column;
    gap: var(--base);

    @include mid-break {
      margin-bottom: var(--base);
      padding-top: calc(var(--base) * 2);
      margin-top: calc(var(--base) * 2);
      padding-bottom: calc(var(--base) * 2);

      &::after {
        display: block;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Account/Settings/index.tsx
Signals: React

```typescript
import type { I18n } from '@payloadcms/translations'
import type { BasePayload, Config, LanguageOptions, TypedUser } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

import { ResetPreferences } from '../ResetPreferences/index.js'
import './index.scss'
import { ToggleTheme } from '../ToggleTheme/index.js'
import { LanguageSelector } from './LanguageSelector.js'

const baseClass = 'payload-settings'

export const Settings: React.FC<{
  readonly className?: string
  readonly i18n: I18n
  readonly languageOptions: LanguageOptions
  readonly payload: BasePayload
  readonly theme: Config['admin']['theme']
  readonly user?: TypedUser
}> = (props) => {
  const { className, i18n, languageOptions, payload, theme, user } = props

  const apiRoute = payload.config.routes.api

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')}>
      <h3>{i18n.t('general:payloadSettings')}</h3>
      <div className={`${baseClass}__language`}>
        <FieldLabel htmlFor="language-select" label={i18n.t('general:language')} />
        <LanguageSelector languageOptions={languageOptions} />
      </div>
      {theme === 'all' && <ToggleTheme />}
      <ResetPreferences apiRoute={apiRoute} user={user} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LanguageSelector.tsx]---
Location: payload-main/packages/next/src/views/Account/Settings/LanguageSelector.tsx
Signals: React

```typescript
'use client'
import type { AcceptedLanguages } from '@payloadcms/translations'
import type { ReactSelectOption } from '@payloadcms/ui'
import type { LanguageOptions } from 'payload'

import { ReactSelect, useTranslation } from '@payloadcms/ui'
import React from 'react'

export const LanguageSelector: React.FC<{
  languageOptions: LanguageOptions
}> = (props) => {
  const { languageOptions } = props

  const { i18n, switchLanguage } = useTranslation()

  return (
    <ReactSelect
      inputId="language-select"
      isClearable={false}
      onChange={async (option: ReactSelectOption<AcceptedLanguages>) => {
        await switchLanguage(option.value)
      }}
      options={languageOptions}
      value={languageOptions.find((language) => language.value === i18n.language)}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Account/ToggleTheme/index.tsx
Signals: React

```typescript
'use client'

import { RadioGroupField, useTheme, useTranslation } from '@payloadcms/ui'
import React, { useCallback } from 'react'

export const ToggleTheme: React.FC = () => {
  const { autoMode, setTheme, theme } = useTheme()
  const { t } = useTranslation()

  const onChange = useCallback(
    (newTheme) => {
      setTheme(newTheme)
    },
    [setTheme],
  )

  return (
    <RadioGroupField
      disableModifyingForm={true}
      field={{
        name: 'theme',
        label: t('general:adminTheme'),
        options: [
          {
            label: t('general:automatic'),
            value: 'auto',
          },
          {
            label: t('general:light'),
            value: 'light',
          },
          {
            label: t('general:dark'),
            value: 'dark',
          },
        ],
      }}
      onChange={onChange}
      path="theme"
      value={autoMode ? 'auto' : theme}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/API/index.client.tsx
Signals: React, Next.js

```typescript
'use client'

import {
  CheckboxField,
  CopyToClipboard,
  Form,
  Gutter,
  MinimizeMaximizeIcon,
  NumberField,
  SetDocumentStepNav,
  toast,
  useConfig,
  useDocumentInfo,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation.js'

import './index.scss'

import { hasDraftsEnabled } from 'payload/shared'
import * as React from 'react'

import { LocaleSelector } from './LocaleSelector/index.js'
import { RenderJSON } from './RenderJSON/index.js'

const baseClass = 'query-inspector'

export const APIViewClient: React.FC = () => {
  const { id, collectionSlug, globalSlug, initialData, isTrashed } = useDocumentInfo()

  const searchParams = useSearchParams()
  const { i18n, t } = useTranslation()
  const { code } = useLocale()

  const {
    config: {
      defaultDepth,
      localization,
      routes: { api: apiRoute },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const globalConfig = getEntityConfig({ globalSlug })

  const localeOptions =
    localization &&
    localization.locales.map((locale) => ({ label: locale.label, value: locale.code }))

  let draftsEnabled: boolean = false
  let docEndpoint: string = ''

  if (collectionConfig) {
    draftsEnabled = hasDraftsEnabled(collectionConfig)
    docEndpoint = `/${collectionSlug}/${id}`
  }

  if (globalConfig) {
    draftsEnabled = hasDraftsEnabled(globalConfig)
    docEndpoint = `/globals/${globalSlug}`
  }

  const [data, setData] = React.useState<any>(initialData)
  const [draft, setDraft] = React.useState<boolean>(searchParams.get('draft') === 'true')
  const [locale, setLocale] = React.useState<string>(searchParams?.get('locale') || code)
  const [depth, setDepth] = React.useState<string>(
    searchParams.get('depth') || defaultDepth.toString(),
  )
  const [authenticated, setAuthenticated] = React.useState<boolean>(true)
  const [fullscreen, setFullscreen] = React.useState<boolean>(false)

  const trashParam = typeof initialData?.deletedAt === 'string'

  const params = new URLSearchParams({
    depth,
    draft: String(draft),
    locale,
    trash: trashParam ? 'true' : 'false',
  }).toString()

  const fetchURL = `${serverURL}${apiRoute}${docEndpoint}?${params}`

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(fetchURL, {
          credentials: authenticated ? 'include' : 'omit',
          headers: {
            'Accept-Language': i18n.language,
          },
          method: 'GET',
        })

        try {
          const json = await res.json()
          setData(json)
        } catch (error) {
          toast.error('Error parsing response')
          console.error(error) // eslint-disable-line no-console
        }
      } catch (error) {
        toast.error('Error making request')
        console.error(error) // eslint-disable-line no-console
      }
    }

    void fetchData()
  }, [i18n.language, fetchURL, authenticated])

  return (
    <Gutter
      className={[baseClass, fullscreen && `${baseClass}--fullscreen`].filter(Boolean).join(' ')}
      right={false}
    >
      <SetDocumentStepNav
        collectionSlug={collectionSlug}
        globalLabel={globalConfig?.label}
        globalSlug={globalSlug}
        id={id}
        isTrashed={isTrashed}
        pluralLabel={collectionConfig ? collectionConfig?.labels?.plural : undefined}
        useAsTitle={collectionConfig ? collectionConfig?.admin?.useAsTitle : undefined}
        view="API"
      />
      <div className={`${baseClass}__configuration`}>
        <div className={`${baseClass}__api-url`}>
          <span className={`${baseClass}__label`}>
            API URL <CopyToClipboard value={fetchURL} />
          </span>
          <a href={fetchURL} rel="noopener noreferrer" target="_blank">
            {fetchURL}
          </a>
        </div>
        <Form
          initialState={{
            authenticated: {
              initialValue: authenticated || false,
              valid: true,
              value: authenticated || false,
            },
            depth: {
              initialValue: Number(depth || 0),
              valid: true,
              value: Number(depth || 0),
            },
            draft: {
              initialValue: draft || false,
              valid: true,
              value: draft || false,
            },
            locale: {
              initialValue: locale,
              valid: true,
              value: locale,
            },
          }}
        >
          <div className={`${baseClass}__form-fields`}>
            <div className={`${baseClass}__filter-query-checkboxes`}>
              {draftsEnabled && (
                <CheckboxField
                  field={{
                    name: 'draft',
                    label: t('version:draft'),
                  }}
                  onChange={() => setDraft(!draft)}
                  path="draft"
                />
              )}
              <CheckboxField
                field={{
                  name: 'authenticated',
                  label: t('authentication:authenticated'),
                }}
                onChange={() => setAuthenticated(!authenticated)}
                path="authenticated"
              />
            </div>
            {localeOptions && <LocaleSelector localeOptions={localeOptions} onChange={setLocale} />}
            <NumberField
              field={{
                name: 'depth',
                admin: {
                  step: 1,
                },
                label: t('general:depth'),
                max: 10,
                min: 0,
              }}
              onChange={(value) => setDepth(value?.toString())}
              path="depth"
            />
          </div>
        </Form>
      </div>
      <div className={`${baseClass}__results-wrapper`}>
        <div className={`${baseClass}__toggle-fullscreen-button-container`}>
          <button
            aria-label="toggle fullscreen"
            className={`${baseClass}__toggle-fullscreen-button`}
            onClick={() => setFullscreen(!fullscreen)}
            type="button"
          >
            <MinimizeMaximizeIcon isMinimized={!fullscreen} />
          </button>
        </div>
        <div className={`${baseClass}__results`}>
          <RenderJSON object={data} />
        </div>
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/API/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .query-inspector {
    --string-color: var(--color-success-450);
    --number-color: var(--color-warning-450);
    display: flex;
    gap: calc(var(--base) * 2);
    align-items: flex-start;

    ul {
      padding-left: calc(var(--base) * 1);
    }

    &--fullscreen {
      padding-left: 0;
      .query-inspector__configuration {
        display: none;
      }
    }

    &__configuration {
      margin-top: calc(var(--base) * 2);
      width: 60%;
      position: sticky;
      top: var(--base);
    }

    &__api-url {
      margin-bottom: calc(var(--base) * 1.5);

      a {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;

        &:hover,
        &:focus-visible {
          text-decoration: underline;
        }
      }
    }

    &__form-fields {
      display: flex;
      flex-direction: column;
      gap: var(--base);
    }

    &__label {
      color: var(--theme-elevation-400);
    }

    &__filter-query-checkboxes {
      display: flex;
      gap: var(--base);
    }

    &__results-wrapper {
      font-family: var(--font-mono);
      width: 100%;
      ul {
        margin: 0;
      }
      li {
        list-style: none;
      }
    }

    &__toggle-fullscreen-button-container {
      position: sticky;
      top: 0;
      z-index: 1;

      @include mid-break {
        display: none;
      }
    }

    &__toggle-fullscreen-button {
      position: absolute;
      right: calc(var(--base) * 0.5);
      top: calc(var(--base) * 0.5);
      padding: calc(var(--base) * 0.25);
      background-color: var(--theme-elevation-0);
      cursor: pointer;
      z-index: 1;
      margin: 0;
      border: 0;
      border-radius: 3px;
      color: var(--theme-elevation-300);
      &:hover {
        color: var(--theme-elevation-700);
      }
    }

    &__results {
      padding-top: calc(var(--base) * 0.5);
      padding-left: calc(var(--base) * 0.5);
      padding-bottom: calc(var(--base) * 0.5);
      background-color: var(--theme-elevation-50);
      overflow: auto;
      min-height: 100vh;
    }

    @include mid-break {
      flex-direction: column;
      padding-left: 0;

      .query-inspector__configuration {
        position: relative;
        width: 100%;
        top: 0;
        padding-inline-end: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
