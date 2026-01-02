---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 164
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 164 of 695)

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

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/List/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { SanitizedCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateListViewMetadata = async (
  args: {
    collectionConfig: SanitizedCollectionConfig
  } & Parameters<GenerateViewMetadata>[0],
): Promise<Metadata> => {
  const { collectionConfig, config, i18n } = args

  let title: string = ''
  const description: string = ''
  const keywords: string = ''

  if (collectionConfig) {
    title = getTranslation(collectionConfig.labels.plural, i18n)
  }

  return generateMetadata({
    ...(config.admin.meta || {}),
    description,
    keywords,
    serverURL: config.serverURL,
    title,
    ...(collectionConfig?.admin?.meta || {}),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: renderListViewSlots.tsx]---
Location: payload-main/packages/next/src/views/List/renderListViewSlots.tsx
Signals: React

```typescript
import type {
  AfterListClientProps,
  AfterListTableClientProps,
  AfterListTableServerPropsOnly,
  BeforeListClientProps,
  BeforeListServerPropsOnly,
  BeforeListTableClientProps,
  BeforeListTableServerPropsOnly,
  ListViewServerPropsOnly,
  ListViewSlots,
  ListViewSlotSharedClientProps,
  Payload,
  SanitizedCollectionConfig,
  StaticDescription,
  ViewDescriptionClientProps,
  ViewDescriptionServerPropsOnly,
} from 'payload'

import { Banner } from '@payloadcms/ui/elements/Banner'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import React from 'react'

type Args = {
  clientProps: ListViewSlotSharedClientProps
  collectionConfig: SanitizedCollectionConfig
  description?: StaticDescription
  notFoundDocId?: null | string
  payload: Payload
  serverProps: ListViewServerPropsOnly
}

export const renderListViewSlots = ({
  clientProps,
  collectionConfig,
  description,
  notFoundDocId,
  payload,
  serverProps,
}: Args): ListViewSlots => {
  const result: ListViewSlots = {} as ListViewSlots

  if (collectionConfig.admin.components?.afterList) {
    result.AfterList = RenderServerComponent({
      clientProps: clientProps satisfies AfterListClientProps,
      Component: collectionConfig.admin.components.afterList,
      importMap: payload.importMap,
      serverProps: serverProps satisfies AfterListTableServerPropsOnly,
    })
  }

  const listMenuItems = collectionConfig.admin.components?.listMenuItems

  if (Array.isArray(listMenuItems)) {
    result.listMenuItems = [
      RenderServerComponent({
        clientProps,
        Component: listMenuItems,
        importMap: payload.importMap,
        serverProps,
      }),
    ]
  }

  if (collectionConfig.admin.components?.afterListTable) {
    result.AfterListTable = RenderServerComponent({
      clientProps: clientProps satisfies AfterListTableClientProps,
      Component: collectionConfig.admin.components.afterListTable,
      importMap: payload.importMap,
      serverProps: serverProps satisfies AfterListTableServerPropsOnly,
    })
  }

  if (collectionConfig.admin.components?.beforeList) {
    result.BeforeList = RenderServerComponent({
      clientProps: clientProps satisfies BeforeListClientProps,
      Component: collectionConfig.admin.components.beforeList,
      importMap: payload.importMap,
      serverProps: serverProps satisfies BeforeListServerPropsOnly,
    })
  }

  // Handle beforeListTable with optional banner
  const existingBeforeListTable = collectionConfig.admin.components?.beforeListTable
    ? RenderServerComponent({
        clientProps: clientProps satisfies BeforeListTableClientProps,
        Component: collectionConfig.admin.components.beforeListTable,
        importMap: payload.importMap,
        serverProps: serverProps satisfies BeforeListTableServerPropsOnly,
      })
    : null

  // Create banner for document not found
  const notFoundBanner = notFoundDocId ? (
    <Banner type="error">
      {serverProps.i18n.t('error:documentNotFound', { id: notFoundDocId })}
    </Banner>
  ) : null

  // Combine banner and existing component
  if (notFoundBanner || existingBeforeListTable) {
    result.BeforeListTable = (
      <React.Fragment>
        {notFoundBanner}
        {existingBeforeListTable}
      </React.Fragment>
    )
  }

  if (collectionConfig.admin.components?.Description) {
    result.Description = RenderServerComponent({
      clientProps: {
        collectionSlug: collectionConfig.slug,
        description,
      } satisfies ViewDescriptionClientProps,
      Component: collectionConfig.admin.components.Description,
      importMap: payload.importMap,
      serverProps: serverProps satisfies ViewDescriptionServerPropsOnly,
    })
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: resolveAllFilterOptions.ts]---
Location: payload-main/packages/next/src/views/List/resolveAllFilterOptions.ts

```typescript
import type { Field, PayloadRequest, ResolvedFilterOptions } from 'payload'

import { resolveFilterOptions } from '@payloadcms/ui/rsc'
import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsHiddenOrDisabled,
  tabHasName,
} from 'payload/shared'

export const resolveAllFilterOptions = async ({
  fields,
  pathPrefix,
  req,
  result,
}: {
  fields: Field[]
  pathPrefix?: string
  req: PayloadRequest
  result?: Map<string, ResolvedFilterOptions>
}): Promise<Map<string, ResolvedFilterOptions>> => {
  const resolvedFilterOptions = !result ? new Map<string, ResolvedFilterOptions>() : result

  await Promise.all(
    fields.map(async (field) => {
      if (fieldIsHiddenOrDisabled(field)) {
        return
      }

      const fieldPath = fieldAffectsData(field)
        ? pathPrefix
          ? `${pathPrefix}.${field.name}`
          : field.name
        : pathPrefix

      if (
        (field.type === 'relationship' || field.type === 'upload') &&
        'filterOptions' in field &&
        field.filterOptions
      ) {
        const options = await resolveFilterOptions(field.filterOptions, {
          id: undefined,
          blockData: undefined,
          data: {}, // use empty object to prevent breaking queries when accessing properties of `data`
          relationTo: field.relationTo,
          req,
          siblingData: {}, // use empty object to prevent breaking queries when accessing properties of `siblingData`
          user: req.user,
        })

        resolvedFilterOptions.set(fieldPath, options)
      }

      if (fieldHasSubFields(field)) {
        await resolveAllFilterOptions({
          fields: field.fields,
          pathPrefix: fieldPath,
          req,
          result: resolvedFilterOptions,
        })
      }

      if (field.type === 'tabs') {
        await Promise.all(
          field.tabs.map(async (tab) => {
            const tabPath = tabHasName(tab)
              ? fieldPath
                ? `${fieldPath}.${tab.name}`
                : tab.name
              : fieldPath

            await resolveAllFilterOptions({
              fields: tab.fields,
              pathPrefix: tabPath,
              req,
              result: resolvedFilterOptions,
            })
          }),
        )
      }
    }),
  )

  return resolvedFilterOptions
}
```

--------------------------------------------------------------------------------

---[FILE: transformColumnsToSelect.ts]---
Location: payload-main/packages/next/src/views/List/transformColumnsToSelect.ts

```typescript
import type { ColumnPreference, SelectType } from 'payload'

import { unflatten } from 'payload/shared'

export const transformColumnsToSelect = (columns: ColumnPreference[]): SelectType => {
  const columnsSelect = columns.reduce((acc, column) => {
    if (column.active) {
      acc[column.accessor] = true
    }
    return acc
  }, {} as SelectType)

  return unflatten(columnsSelect)
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Login/index.scss

```text
@layer payload-default {
  .login {
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

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Login/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps, ServerProps } from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { redirect } from 'next/navigation.js'
import { getSafeRedirect } from 'payload/shared'
import React, { Fragment } from 'react'

import { Logo } from '../../elements/Logo/index.js'
import { LoginForm } from './LoginForm/index.js'
import './index.scss'
export const loginBaseClass = 'login'

export function LoginView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { locale, permissions, req } = initPageResult

  const {
    i18n,
    payload: { config },
    payload,
    user,
  } = req

  const {
    admin: { components: { afterLogin, beforeLogin } = {}, user: userSlug },
    routes: { admin },
  } = config

  const redirectUrl = getSafeRedirect({ fallbackTo: admin, redirectTo: searchParams.redirect })

  if (user) {
    redirect(redirectUrl)
  }

  const collectionConfig = payload?.collections?.[userSlug]?.config

  const prefillAutoLogin =
    typeof config.admin?.autoLogin === 'object' && config.admin?.autoLogin.prefillOnly

  const prefillUsername =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.username
      : undefined

  const prefillEmail =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.email
      : undefined

  const prefillPassword =
    prefillAutoLogin && typeof config.admin?.autoLogin === 'object'
      ? config.admin?.autoLogin.password
      : undefined

  return (
    <Fragment>
      <div className={`${loginBaseClass}__brand`}>
        <Logo
          i18n={i18n}
          locale={locale}
          params={params}
          payload={payload}
          permissions={permissions}
          searchParams={searchParams}
          user={user}
        />
      </div>
      {RenderServerComponent({
        Component: beforeLogin,
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
      {!collectionConfig?.auth?.disableLocalStrategy && (
        <LoginForm
          prefillEmail={prefillEmail}
          prefillPassword={prefillPassword}
          prefillUsername={prefillUsername}
          searchParams={searchParams}
        />
      )}
      {RenderServerComponent({
        Component: afterLogin,
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
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Login/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateLoginViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: `${t('authentication:login')}`,
    keywords: `${t('authentication:login')}`,
    serverURL: config.serverURL,
    title: t('authentication:login'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Login/LoginField/index.tsx
Signals: React

```typescript
'use client'
import type { Validate, ValidateOptions } from 'payload'

import { EmailField, TextField, useTranslation } from '@payloadcms/ui'
import { email, username } from 'payload/shared'
import React from 'react'

export type LoginFieldProps = {
  readonly required?: boolean
  readonly type: 'email' | 'emailOrUsername' | 'username'
  readonly validate?: Validate
}

export const LoginField: React.FC<LoginFieldProps> = ({ type, required = true }) => {
  const { t } = useTranslation()

  if (type === 'email') {
    return (
      <EmailField
        field={{
          name: 'email',
          admin: {
            autoComplete: 'email',
          },
          label: t('general:email'),
          required,
        }}
        path="email"
        validate={email}
      />
    )
  }

  if (type === 'username') {
    return (
      <TextField
        field={{
          name: 'username',
          label: t('authentication:username'),
          required,
        }}
        path="username"
        validate={username}
      />
    )
  }

  if (type === 'emailOrUsername') {
    return (
      <TextField
        field={{
          name: 'username',
          label: t('authentication:emailOrUsername'),
          required,
        }}
        path="username"
        validate={(value, options) => {
          const passesUsername = username(value, options)
          const passesEmail = email(
            value,
            options as ValidateOptions<any, { username?: string }, any, any>,
          )

          if (!passesEmail && !passesUsername) {
            return `${t('general:email')}: ${passesEmail} ${t('general:username')}: ${passesUsername}`
          }

          return true
        }}
      />
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Login/LoginForm/index.scss

```text
@layer payload-default {
  .login__form {
    &__inputWrap {
      display: flex;
      flex-direction: column;
      gap: var(--base);
      margin-bottom: calc(var(--base) / 4);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Login/LoginForm/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

const baseClass = 'login__form'

import type { UserWithToken } from '@payloadcms/ui'
import type { FormState } from 'payload'

import {
  Form,
  FormSubmit,
  Link,
  PasswordField,
  useAuth,
  useConfig,
  useTranslation,
} from '@payloadcms/ui'
import { formatAdminURL, formatApiURL, getLoginOptions, getSafeRedirect } from 'payload/shared'

import type { LoginFieldProps } from '../LoginField/index.js'

import { LoginField } from '../LoginField/index.js'
import './index.scss'

export const LoginForm: React.FC<{
  prefillEmail?: string
  prefillPassword?: string
  prefillUsername?: string
  searchParams: { [key: string]: string | string[] | undefined }
}> = ({ prefillEmail, prefillPassword, prefillUsername, searchParams }) => {
  const { config, getEntityConfig } = useConfig()

  const {
    admin: {
      routes: { forgot: forgotRoute },
      user: userSlug,
    },
    routes: { admin: adminRoute, api: apiRoute },
    serverURL,
  } = config

  const collectionConfig = getEntityConfig({ collectionSlug: userSlug })
  const { auth: authOptions } = collectionConfig
  const loginWithUsername = authOptions.loginWithUsername
  const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername)

  const [loginType] = React.useState<LoginFieldProps['type']>(() => {
    if (canLoginWithEmail && canLoginWithUsername) {
      return 'emailOrUsername'
    }
    if (canLoginWithUsername) {
      return 'username'
    }
    return 'email'
  })

  const { t } = useTranslation()
  const { setUser } = useAuth()

  const initialState: FormState = {
    password: {
      initialValue: prefillPassword ?? undefined,
      valid: true,
      value: prefillPassword ?? undefined,
    },
  }

  if (loginWithUsername) {
    initialState.username = {
      initialValue: prefillUsername ?? undefined,
      valid: true,
      value: prefillUsername ?? undefined,
    }
  } else {
    initialState.email = {
      initialValue: prefillEmail ?? undefined,
      valid: true,
      value: prefillEmail ?? undefined,
    }
  }

  const handleLogin = (data: UserWithToken) => {
    setUser(data)
  }

  return (
    <Form
      action={formatApiURL({
        apiRoute,
        path: `/${userSlug}/login`,
        serverURL,
      })}
      className={baseClass}
      disableSuccessStatus
      initialState={initialState}
      method="POST"
      onSuccess={handleLogin}
      redirect={getSafeRedirect({ fallbackTo: adminRoute, redirectTo: searchParams?.redirect })}
      waitForAutocomplete
    >
      <div className={`${baseClass}__inputWrap`}>
        <LoginField type={loginType} />
        <PasswordField
          field={{
            name: 'password',
            label: t('general:password'),
            required: true,
          }}
          path="password"
        />
      </div>
      <Link
        href={formatAdminURL({
          adminRoute,
          path: forgotRoute,
          serverURL,
        })}
        prefetch={false}
      >
        {t('authentication:forgotPasswordQuestion')}
      </Link>
      <FormSubmit size="large">{t('authentication:login')}</FormSubmit>
    </Form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Logout/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .logout {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;

    &__wrap {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: base(0.8);
      width: 100%;
      max-width: base(36);

      & > * {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Logout/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import React from 'react'

import { LogoutClient } from './LogoutClient.js'
import './index.scss'

const baseClass = 'logout'

export const LogoutView: React.FC<
  {
    inactivity?: boolean
  } & AdminViewServerProps
> = ({ inactivity, initPageResult, searchParams }) => {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return (
    <div className={`${baseClass}`}>
      <LogoutClient
        adminRoute={adminRoute}
        inactivity={inactivity}
        redirect={searchParams.redirect as string}
      />
    </div>
  )
}

export function LogoutInactivity(props: AdminViewServerProps) {
  return <LogoutView inactivity {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: LogoutClient.tsx]---
Location: payload-main/packages/next/src/views/Logout/LogoutClient.tsx
Signals: React, Next.js

```typescript
'use client'
import {
  Button,
  LoadingOverlay,
  toast,
  useAuth,
  useConfig,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { useEffect } from 'react'

import './index.scss'

const baseClass = 'logout'

/**
 * This component should **just** be the inactivity route and do nothing with logging the user out.
 *
 * It currently handles too much, the auth provider should just log the user out and then
 * we could remove the useEffect in this file. So instead of the logout button
 * being an anchor link, it should be a button that calls `logOut` in the provider.
 *
 * This view is still useful if cookies attempt to refresh and fail, i.e. the user
 * is logged out due to inactivity.
 */
export const LogoutClient: React.FC<{
  adminRoute: string
  inactivity?: boolean
  redirect: string
}> = (props) => {
  const { adminRoute, inactivity, redirect } = props

  const { logOut, user } = useAuth()
  const { config } = useConfig()

  const { startRouteTransition } = useRouteTransition()

  const isLoggedIn = React.useMemo(() => {
    return Boolean(user?.id)
  }, [user?.id])

  const navigatingToLoginRef = React.useRef(false)

  const [loginRoute] = React.useState(() =>
    formatAdminURL({
      adminRoute,
      path: `/login${
        inactivity && redirect && redirect.length > 0
          ? `?redirect=${encodeURIComponent(redirect)}`
          : ''
      }`,
      serverURL: config.serverURL,
    }),
  )

  const { t } = useTranslation()
  const router = useRouter()

  const handleLogOut = React.useCallback(async () => {
    if (!navigatingToLoginRef.current) {
      navigatingToLoginRef.current = true
      await logOut()
      toast.success(t('authentication:loggedOutSuccessfully'))
      startRouteTransition(() => router.push(loginRoute))
      return
    }
  }, [logOut, loginRoute, router, startRouteTransition, t])

  useEffect(() => {
    if (isLoggedIn && !inactivity) {
      void handleLogOut()
    } else if (!navigatingToLoginRef.current) {
      navigatingToLoginRef.current = true
      startRouteTransition(() => router.push(loginRoute))
    }
  }, [handleLogOut, isLoggedIn, loginRoute, router, startRouteTransition, inactivity])

  if (!isLoggedIn && inactivity) {
    return (
      <div className={`${baseClass}__wrap`}>
        <h2>{t('authentication:loggedOutInactivity')}</h2>
        <Button buttonStyle="secondary" el="link" size="large" url={loginRoute}>
          {t('authentication:logBackIn')}
        </Button>
      </div>
    )
  }

  return <LoadingOverlay animationDuration={'0ms'} loadingText={t('authentication:loggingOut')} />
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Logout/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateLogoutViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: `${t('authentication:logoutUser')}`,
    keywords: `${t('authentication:logout')}`,
    serverURL: config.serverURL,
    title: t('authentication:logout'),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/views/NotFound/index.client.tsx
Signals: React

```typescript
'use client'
import { Button, Gutter, useConfig, useStepNav, useTranslation } from '@payloadcms/ui'
import React, { useEffect } from 'react'

import './index.scss'

const baseClass = 'not-found'

export const NotFoundClient: React.FC<{
  marginTop?: 'large'
}> = (props) => {
  const { marginTop = 'large' } = props

  const { setStepNav } = useStepNav()
  const { t } = useTranslation()

  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  useEffect(() => {
    setStepNav([
      {
        label: t('general:notFound'),
      },
    ])
  }, [setStepNav, t])

  return (
    <div
      className={[baseClass, marginTop && `${baseClass}--margin-top-${marginTop}`]
        .filter(Boolean)
        .join(' ')}
    >
      <Gutter className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__content`}>
          <h1>{t('general:nothingFound')}</h1>
          <p>{t('general:sorryNotFound')}</p>
        </div>
        <Button className={`${baseClass}__button`} el="link" size="large" to={adminRoute}>
          {t('general:backToDashboard')}
        </Button>
      </Gutter>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/NotFound/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .not-found {
    margin-top: var(--base);
    display: flex;

    & > * {
      &:first-child {
        margin-top: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }

    &__wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: base(0.8);
      max-width: base(36);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: base(0.4);

      > * {
        margin: 0;
      }
    }

    &__button {
      margin: 0;
    }

    &--margin-top-large {
      margin-top: calc(var(--base) * 2);
    }

    @include large-break {
      &--margin-top-large {
        margin-top: var(--base);
      }
    }

    @include small-break {
      margin-top: calc(var(--base) / 2);

      &--margin-top-large {
        margin-top: calc(var(--base) / 2);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/NotFound/index.tsx
Signals: React, Next.js

```typescript
import type { Metadata } from 'next'
import type { AdminViewServerProps, ImportMap, SanitizedConfig } from 'payload'

import { formatAdminURL } from 'payload/shared'
import * as qs from 'qs-esm'
import React from 'react'

import { DefaultTemplate } from '../../templates/Default/index.js'
import { getNextRequestI18n } from '../../utilities/getNextRequestI18n.js'
import { getVisibleEntities } from '../../utilities/getVisibleEntities.js'
import { initReq } from '../../utilities/initReq.js'
import { NotFoundClient } from './index.client.js'

export const generateNotFoundViewMetadata = async ({
  config: configPromise,
}: {
  config: Promise<SanitizedConfig> | SanitizedConfig
  params?: { [key: string]: string | string[] }
}): Promise<Metadata> => {
  const config = await configPromise

  const i18n = await getNextRequestI18n({
    config,
  })

  return {
    title: i18n.t('general:notFound'),
  }
}

export const NotFoundPage = async ({
  config: configPromise,
  importMap,
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  config: Promise<SanitizedConfig>
  importMap: ImportMap
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}) => {
  const config = await configPromise
  const { routes: { admin: adminRoute } = {} } = config

  const searchParams = await searchParamsPromise
  const queryString = `${qs.stringify(searchParams ?? {}, { addQueryPrefix: true })}`

  const {
    locale,
    permissions,
    req,
    req: { payload },
  } = await initReq({
    configPromise: config,
    importMap,
    key: 'RootLayout',
    overrides: {
      fallbackLocale: false,
      req: {
        query: qs.parse(queryString, {
          depth: 10,
          ignoreQueryPrefix: true,
        }),
      },
      // intentionally omit `serverURL` to keep URL relative
      urlSuffix: `${formatAdminURL({ adminRoute, path: '/not-found' })}${searchParams ? queryString : ''}`,
    },
  })

  if (!req.user || !permissions.canAccessAdmin) {
    return <NotFoundClient />
  }

  const params = await paramsPromise
  const visibleEntities = getVisibleEntities({ req })

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <NotFoundClient />
    </DefaultTemplate>
  )
}

export function NotFoundView(props: AdminViewServerProps) {
  return <NotFoundClient marginTop="large" />
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/NotFound/metadata.ts
Signals: Next.js

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { Metadata } from 'next'
import type { SanitizedConfig } from 'payload'

import { generateMetadata } from '../../utilities/meta.js'

export const generateNotFoundViewMetadata = async ({
  config,
  i18n,
}: {
  config: SanitizedConfig
  i18n: I18nClient
}): Promise<Metadata> =>
  generateMetadata({
    description: i18n.t('general:pageNotFound'),
    keywords: `404 ${i18n.t('general:notFound')}`,
    serverURL: config.serverURL,
    title: i18n.t('general:notFound'),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/ResetPassword/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .reset-password__wrap {
    .inputWrap {
      display: flex;
      flex-direction: column;
      gap: base(0.8);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/ResetPassword/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import { Button, Link } from '@payloadcms/ui'
import { Translation } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { FormHeader } from '../../elements/FormHeader/index.js'
import { ResetPasswordForm } from './ResetPasswordForm/index.js'
import './index.scss'

export const resetPasswordBaseClass = 'reset-password'

export function ResetPassword({ initPageResult, params }: AdminViewServerProps) {
  const { req } = initPageResult

  const {
    segments: [_, token],
  } = params

  const {
    i18n,
    payload: { config },
    user,
  } = req

  const {
    admin: {
      routes: { account: accountRoute, login: loginRoute },
    },
    routes: { admin: adminRoute },
  } = config

  if (user) {
    return (
      <div className={`${resetPasswordBaseClass}__wrap`}>
        <FormHeader
          description={
            <Translation
              elements={{
                '0': ({ children }) => (
                  <Link
                    href={formatAdminURL({
                      adminRoute,
                      path: accountRoute,
                      serverURL: config.serverURL,
                    })}
                    prefetch={false}
                  >
                    {children}
                  </Link>
                ),
              }}
              i18nKey="authentication:loggedInChangePassword"
              t={i18n.t}
            />
          }
          heading={i18n.t('authentication:alreadyLoggedIn')}
        />
        <Button buttonStyle="secondary" el="link" size="large" to={adminRoute}>
          {i18n.t('general:backToDashboard')}
        </Button>
      </div>
    )
  }

  return (
    <div className={`${resetPasswordBaseClass}__wrap`}>
      <FormHeader heading={i18n.t('authentication:resetPassword')} />
      <ResetPasswordForm token={token} />
      <Link
        href={formatAdminURL({
          adminRoute,
          path: loginRoute,
          serverURL: config.serverURL,
        })}
        prefetch={false}
      >
        {i18n.t('authentication:backToLogin')}
      </Link>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/ResetPassword/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'

import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateResetPasswordViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}): Promise<Metadata> =>
  generateMetadata({
    description: t('authentication:resetPassword'),
    keywords: t('authentication:resetPassword'),
    serverURL: config.serverURL,
    title: t('authentication:resetPassword'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/ResetPassword/ResetPasswordForm/index.tsx
Signals: React, Next.js

```typescript
'use client'
import {
  ConfirmPasswordField,
  Form,
  FormSubmit,
  HiddenField,
  PasswordField,
  useAuth,
  useConfig,
  useTranslation,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import { type FormState } from 'payload'
import { formatAdminURL, formatApiURL } from 'payload/shared'
import React from 'react'

type Args = {
  readonly token: string
}

export const ResetPasswordForm: React.FC<Args> = ({ token }) => {
  const i18n = useTranslation()
  const {
    config: {
      admin: {
        routes: { login: loginRoute },
        user: userSlug,
      },
      routes: { admin: adminRoute, api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const history = useRouter()
  const { fetchFullUser } = useAuth()

  const onSuccess = React.useCallback(async () => {
    const user = await fetchFullUser()
    if (user) {
      history.push(adminRoute)
    } else {
      history.push(
        formatAdminURL({
          adminRoute,
          path: loginRoute,
          serverURL,
        }),
      )
    }
  }, [adminRoute, fetchFullUser, history, loginRoute, serverURL])

  const initialState: FormState = {
    'confirm-password': {
      initialValue: '',
      valid: false,
      value: '',
    },
    password: {
      initialValue: '',
      valid: false,
      value: '',
    },
    token: {
      initialValue: token,
      valid: true,
      value: token,
    },
  }

  return (
    <Form
      action={formatApiURL({
        apiRoute,
        path: `/${userSlug}/reset-password`,
        serverURL,
      })}
      initialState={initialState}
      method="POST"
      onSuccess={onSuccess}
    >
      <div className="inputWrap">
        <PasswordField
          field={{
            name: 'password',
            label: i18n.t('authentication:newPassword'),
            required: true,
          }}
          path="password"
          schemaPath={`${userSlug}.password`}
        />
        <ConfirmPasswordField />
        <HiddenField path="token" schemaPath={`${userSlug}.token`} value={token} />
      </div>
      <FormSubmit size="large">{i18n.t('authentication:resetPassword')}</FormSubmit>
    </Form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: attachViewActions.ts]---
Location: payload-main/packages/next/src/views/Root/attachViewActions.ts

```typescript
import type {
  CustomComponent,
  EditConfig,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
} from 'payload'

export function getViewActions({
  editConfig,
  viewKey,
}: {
  editConfig: EditConfig
  viewKey: keyof EditConfig
}): CustomComponent[] {
  if (editConfig && viewKey in editConfig && 'actions' in editConfig[viewKey]) {
    return editConfig[viewKey].actions ?? []
  }

  return []
}

export function getSubViewActions({
  collectionOrGlobal,
  viewKeyArg,
}: {
  collectionOrGlobal: SanitizedCollectionConfig | SanitizedGlobalConfig
  viewKeyArg?: keyof EditConfig
}): CustomComponent[] {
  if (collectionOrGlobal?.admin?.components?.views?.edit) {
    let viewKey = viewKeyArg || 'default'
    if ('root' in collectionOrGlobal.admin.components.views.edit) {
      viewKey = 'root'
    }

    const actions = getViewActions({
      editConfig: collectionOrGlobal.admin?.components?.views?.edit,
      viewKey,
    })

    return actions
  }

  return []
}
```

--------------------------------------------------------------------------------

---[FILE: generateCustomViewMetadata.ts]---
Location: payload-main/packages/next/src/views/Root/generateCustomViewMetadata.ts
Signals: Next.js

```typescript
import type { I18nClient } from '@payloadcms/translations'
import type { Metadata } from 'next'
import type {
  AdminViewConfig,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SanitizedGlobalConfig,
} from 'payload'

import { generateMetadata } from '../../utilities/meta.js'

export const generateCustomViewMetadata = async (args: {
  collectionConfig?: SanitizedCollectionConfig
  config: SanitizedConfig
  globalConfig?: SanitizedGlobalConfig
  i18n: I18nClient
  viewConfig: AdminViewConfig
}): Promise<Metadata> => {
  const {
    config,
    // i18n: { t },
    viewConfig,
  } = args

  if (!viewConfig) {
    return null
  }

  return generateMetadata({
    description: `Payload`,
    keywords: `Payload`,
    serverURL: config.serverURL,
    title: 'Payload',
    ...(config.admin.meta || {}),
    ...(viewConfig.meta || {}),
    openGraph: {
      title: 'Payload',
      ...(config.admin.meta?.openGraph || {}),
      ...(viewConfig.meta?.openGraph || {}),
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomViewByKey.ts]---
Location: payload-main/packages/next/src/views/Root/getCustomViewByKey.ts

```typescript
import type { AdminViewServerProps, PayloadComponent, SanitizedConfig } from 'payload'

import type { ViewFromConfig } from './getRouteData.js'

export const getCustomViewByKey = ({
  config,
  viewKey,
}: {
  config: SanitizedConfig
  viewKey: string
}): {
  view: ViewFromConfig
  viewKey: string
} | null => {
  const customViewComponent = config.admin.components?.views?.[viewKey]

  if (!customViewComponent) {
    return null
  }

  return {
    view: {
      payloadComponent: customViewComponent.Component as PayloadComponent<AdminViewServerProps>,
    },
    viewKey,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getCustomViewByRoute.ts]---
Location: payload-main/packages/next/src/views/Root/getCustomViewByRoute.ts

```typescript
import type { AdminViewConfig, SanitizedConfig } from 'payload'

import type { ViewFromConfig } from './getRouteData.js'

import { isPathMatchingRoute } from './isPathMatchingRoute.js'

export const getCustomViewByRoute = ({
  config,
  currentRoute: currentRouteWithAdmin,
}: {
  config: SanitizedConfig
  currentRoute: string
}): {
  view: ViewFromConfig
  viewConfig: AdminViewConfig
  viewKey: string
} => {
  const {
    admin: {
      components: { views },
    },
    routes: { admin: adminRoute },
  } = config

  let viewKey: string

  const currentRoute =
    adminRoute === '/' ? currentRouteWithAdmin : currentRouteWithAdmin.replace(adminRoute, '')

  const foundViewConfig =
    (views &&
      typeof views === 'object' &&
      Object.entries(views).find(([key, view]) => {
        const isMatching = isPathMatchingRoute({
          currentRoute,
          exact: view.exact,
          path: view.path,
          sensitive: view.sensitive,
          strict: view.strict,
        })

        if (isMatching) {
          viewKey = key
        }

        return isMatching
      })?.[1]) ||
    undefined

  if (!foundViewConfig) {
    return {
      view: {
        Component: null,
      },
      viewConfig: null,
      viewKey: null,
    }
  }

  return {
    view: {
      payloadComponent: foundViewConfig.Component,
    },
    viewConfig: foundViewConfig,
    viewKey,
  }
}
```

--------------------------------------------------------------------------------

````
