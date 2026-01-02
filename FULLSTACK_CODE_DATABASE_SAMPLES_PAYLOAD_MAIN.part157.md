---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 157
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 157 of 695)

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
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/index.tsx
Signals: React

```typescript
import type {
  DocumentTabClientProps,
  DocumentTabServerPropsOnly,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
} from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import React from 'react'

import { ShouldRenderTabs } from './ShouldRenderTabs.js'
import { DefaultDocumentTab } from './Tab/index.js'
import { getTabs } from './tabs/index.js'
import './index.scss'

const baseClass = 'doc-tabs'

export const DocumentTabs: React.FC<{
  collectionConfig: SanitizedCollectionConfig
  globalConfig: SanitizedGlobalConfig
  permissions: SanitizedPermissions
  req: PayloadRequest
}> = ({ collectionConfig, globalConfig, permissions, req }) => {
  const { config } = req.payload

  const tabs = getTabs({
    collectionConfig,
    globalConfig,
  })

  return (
    <ShouldRenderTabs>
      <div className={baseClass}>
        <div className={`${baseClass}__tabs-container`}>
          <ul className={`${baseClass}__tabs`}>
            {tabs?.map(({ tab: tabConfig, viewPath }, index) => {
              const { condition } = tabConfig || {}

              const meetsCondition =
                !condition ||
                condition({ collectionConfig, config, globalConfig, permissions, req })

              if (!meetsCondition) {
                return null
              }

              if (tabConfig?.Component) {
                return RenderServerComponent({
                  clientProps: {
                    path: viewPath,
                  } satisfies DocumentTabClientProps,
                  Component: tabConfig.Component,
                  importMap: req.payload.importMap,
                  key: `tab-${index}`,
                  serverProps: {
                    collectionConfig,
                    globalConfig,
                    i18n: req.i18n,
                    payload: req.payload,
                    permissions,
                    req,
                    user: req.user,
                  } satisfies DocumentTabServerPropsOnly,
                })
              }

              return (
                <DefaultDocumentTab
                  collectionConfig={collectionConfig}
                  globalConfig={globalConfig}
                  key={`tab-${index}`}
                  path={viewPath}
                  permissions={permissions}
                  req={req}
                  tabConfig={tabConfig}
                />
              )
            })}
          </ul>
        </div>
      </div>
    </ShouldRenderTabs>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ShouldRenderTabs.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/ShouldRenderTabs.tsx
Signals: React

```typescript
'use client'
import type React from 'react'

import { useDocumentInfo } from '@payloadcms/ui'

export const ShouldRenderTabs: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { id: idFromContext, collectionSlug, globalSlug } = useDocumentInfo()

  const id = idFromContext !== 'create' ? idFromContext : null

  // Don't show tabs when creating new documents
  if ((collectionSlug && id) || globalSlug) {
    return children
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/Tab/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .doc-tab {
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;

    &:hover {
      .pill-version-count {
        background-color: var(--theme-elevation-150);
      }
    }

    &--active {
      .pill-version-count {
        background-color: var(--theme-elevation-250);
      }

      &:hover {
        .pill-version-count {
          background-color: var(--theme-elevation-250);
        }
      }
    }

    &__label {
      display: flex;
      position: relative;
      align-items: center;
      gap: 4px;
      width: 100%;
      height: 100%;
      line-height: calc(var(--base) * 1.2);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/Tab/index.tsx
Signals: React

```typescript
import type {
  DocumentTabConfig,
  DocumentTabServerPropsOnly,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
} from 'payload'
import type React from 'react'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { Fragment } from 'react'

import { DocumentTabLink } from './TabLink.js'
import './index.scss'

export const baseClass = 'doc-tab'

export const DefaultDocumentTab: React.FC<{
  apiURL?: string
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  path?: string
  permissions?: SanitizedPermissions
  req: PayloadRequest
  tabConfig: { readonly Pill_Component?: React.FC } & DocumentTabConfig
}> = (props) => {
  const {
    apiURL,
    collectionConfig,
    globalConfig,
    permissions,
    req,
    tabConfig: { href: tabHref, isActive: tabIsActive, label, newTab, Pill, Pill_Component },
  } = props

  let href = typeof tabHref === 'string' ? tabHref : ''
  let isActive = typeof tabIsActive === 'boolean' ? tabIsActive : false

  if (typeof tabHref === 'function') {
    href = tabHref({
      apiURL,
      collection: collectionConfig,
      global: globalConfig,
      routes: req.payload.config.routes,
    })
  }

  if (typeof tabIsActive === 'function') {
    isActive = tabIsActive({
      href,
    })
  }

  const labelToRender =
    typeof label === 'function'
      ? label({
          t: req.i18n.t,
        })
      : label

  return (
    <DocumentTabLink
      adminRoute={req.payload.config.routes.admin}
      ariaLabel={labelToRender}
      baseClass={baseClass}
      href={href}
      isActive={isActive}
      newTab={newTab}
    >
      <span className={`${baseClass}__label`}>
        {labelToRender}
        {Pill || Pill_Component ? (
          <Fragment>
            &nbsp;
            {RenderServerComponent({
              Component: Pill,
              Fallback: Pill_Component,
              importMap: req.payload.importMap,
              serverProps: {
                i18n: req.i18n,
                payload: req.payload,
                permissions,
                req,
                user: req.user,
              } satisfies DocumentTabServerPropsOnly,
            })}
          </Fragment>
        ) : null}
      </span>
    </DocumentTabLink>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: TabLink.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/Tab/TabLink.tsx
Signals: React, Next.js

```typescript
'use client'
import type { SanitizedConfig } from 'payload'

import { Button, useConfig } from '@payloadcms/ui'
import { useParams, usePathname, useSearchParams } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

export const DocumentTabLink: React.FC<{
  adminRoute: SanitizedConfig['routes']['admin']
  ariaLabel?: string
  baseClass: string
  children?: React.ReactNode
  href: string
  isActive?: boolean
  newTab?: boolean
}> = ({
  adminRoute,
  ariaLabel,
  baseClass,
  children,
  href: hrefFromProps,
  isActive: isActiveFromProps,
  newTab,
}) => {
  const pathname = usePathname()
  const params = useParams()
  const { config } = useConfig()

  const searchParams = useSearchParams()

  const locale = searchParams.get('locale')

  const [entityType, entitySlug, segmentThree, segmentFour, ...rest] = params.segments || []
  const isCollection = entityType === 'collections'

  let docPath = formatAdminURL({
    adminRoute,
    path: `/${isCollection ? 'collections' : 'globals'}/${entitySlug}`,
    serverURL: config.serverURL,
  })

  if (isCollection) {
    if (segmentThree === 'trash' && segmentFour) {
      docPath += `/trash/${segmentFour}`
    } else if (segmentThree) {
      docPath += `/${segmentThree}`
    }
  }

  const href = `${docPath}${hrefFromProps}`
  // separated the two so it doesn't break checks against pathname
  const hrefWithLocale = `${href}${locale ? `?locale=${locale}` : ''}`

  const isActive =
    (href === docPath && pathname === docPath) ||
    (href !== docPath && pathname.startsWith(href)) ||
    isActiveFromProps

  return (
    <Button
      aria-label={ariaLabel}
      buttonStyle="tab"
      className={[baseClass, isActive && `${baseClass}--active`].filter(Boolean).join(' ')}
      disabled={isActive}
      el={!isActive || href !== pathname ? 'link' : 'div'}
      margin={false}
      newTab={newTab}
      size="medium"
      to={!isActive || href !== pathname ? hrefWithLocale : undefined}
    >
      {children}
    </Button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/tabs/index.tsx

```typescript
import type { DocumentTabConfig, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import { VersionsPill } from './VersionsPill/index.js'

export const documentViewKeys = ['api', 'default', 'livePreview', 'versions']

export type DocumentViewKey = (typeof documentViewKeys)[number]

export const getTabs = ({
  collectionConfig,
  globalConfig,
}: {
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
}): { tab: DocumentTabConfig; viewPath: string }[] => {
  const customViews =
    collectionConfig?.admin?.components?.views?.edit ||
    globalConfig?.admin?.components?.views?.edit ||
    {}

  return [
    {
      tab: {
        href: '',
        label: ({ t }) => t('general:edit'),
        order: 100,
        ...(customViews?.['default']?.tab || {}),
      },
      viewPath: '/',
    },
    {
      tab: {
        condition: ({ collectionConfig, globalConfig, permissions }) =>
          Boolean(
            (collectionConfig?.versions &&
              permissions?.collections?.[collectionConfig?.slug]?.readVersions) ||
              (globalConfig?.versions && permissions?.globals?.[globalConfig?.slug]?.readVersions),
          ),
        href: '/versions',
        label: ({ t }) => t('version:versions'),
        order: 300,
        Pill_Component: VersionsPill,
        ...(customViews?.['versions']?.tab || {}),
      },
      viewPath: '/versions',
    },
    {
      tab: {
        condition: ({ collectionConfig, globalConfig }) =>
          (collectionConfig && !collectionConfig?.admin?.hideAPIURL) ||
          (globalConfig && !globalConfig?.admin?.hideAPIURL),
        href: '/api',
        label: 'API',
        order: 400,
        ...(customViews?.['api']?.tab || {}),
      },
      viewPath: '/api',
    },
  ]
    .concat(
      Object.entries(customViews).reduce((acc, [key, value]) => {
        if (documentViewKeys.includes(key)) {
          return acc
        }

        if (value?.tab) {
          acc.push({
            tab: value.tab,
            viewPath: 'path' in value ? value.path : '',
          })
        }

        return acc
      }, []),
    )
    ?.sort(({ tab: a }, { tab: b }) => {
      if (a.order === undefined && b.order === undefined) {
        return 0
      } else if (a.order === undefined) {
        return 1
      } else if (b.order === undefined) {
        return -1
      }

      return a.order - b.order
    })
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/tabs/VersionsPill/index.scss

```text
@layer payload-default {
  .pill-version-count {
    line-height: calc(var(--base) * 0.8);
    min-width: calc(var(--base) * 0.8);
    text-align: center;
    background-color: var(--theme-elevation-100);
    border-radius: var(--style-radius-s);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/tabs/VersionsPill/index.tsx
Signals: React

```typescript
'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

const baseClass = 'pill-version-count'

export const VersionsPill: React.FC = () => {
  const { versionCount } = useDocumentInfo()

  if (!versionCount) {
    return null
  }

  return <span className={baseClass}>{versionCount}</span>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/FormHeader/index.scss

```text
@layer payload-default {
  .form-header {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) * 0.5);
    margin-bottom: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/FormHeader/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'form-header'

type Props = {
  description?: React.ReactNode | string
  heading: string
}
export function FormHeader({ description, heading }: Props) {
  if (!heading) {
    return null
  }

  return (
    <div className={baseClass}>
      <h1>{heading}</h1>
      {Boolean(description) && <p>{description}</p>}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/Logo/index.tsx
Signals: React

```typescript
import type { ServerProps } from 'payload'
import type React from 'react'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { PayloadLogo } from '@payloadcms/ui/shared'

export const Logo: React.FC<ServerProps> = (props) => {
  const { i18n, locale, params, payload, permissions, searchParams, user } = props

  const {
    admin: {
      components: {
        graphics: { Logo: CustomLogo } = {
          Logo: undefined,
        },
      } = {},
    } = {},
  } = payload.config

  return RenderServerComponent({
    Component: CustomLogo,
    Fallback: PayloadLogo,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: getNavPrefs.ts]---
Location: payload-main/packages/next/src/elements/Nav/getNavPrefs.ts
Signals: React

```typescript
import type { NavPreferences, PayloadRequest } from 'payload'

import { cache } from 'react'

export const getNavPrefs = cache(async (req: PayloadRequest): Promise<NavPreferences> => {
  return req?.user?.collection
    ? await req.payload
        .find({
          collection: 'payload-preferences',
          depth: 0,
          limit: 1,
          pagination: false,
          req,
          where: {
            and: [
              {
                key: {
                  equals: 'nav',
                },
              },
              {
                'user.relationTo': {
                  equals: req.user.collection,
                },
              },
              {
                'user.value': {
                  equals: req?.user?.id,
                },
              },
            ],
          },
        })
        ?.then((res) => res?.docs?.[0]?.value)
    : null
})
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/next/src/elements/Nav/index.client.tsx
Signals: React, Next.js

```typescript
'use client'

import type { groupNavItems } from '@payloadcms/ui/shared'
import type { NavPreferences } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { BrowseByFolderButton, Link, NavGroup, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'

const baseClass = 'nav'

/**
 * @internal
 */
export const DefaultNavClient: React.FC<{
  groups: ReturnType<typeof groupNavItems>
  navPreferences: NavPreferences
}> = ({ groups, navPreferences }) => {
  const pathname = usePathname()

  const {
    config: {
      admin: {
        routes: { browseByFolder: foldersRoute },
      },
      folders,
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  const { i18n } = useTranslation()

  const folderURL = formatAdminURL({
    adminRoute,
    path: foldersRoute,
    serverURL,
  })

  const viewingRootFolderView = pathname.startsWith(folderURL)

  return (
    <Fragment>
      {folders && folders.browseByFolder && <BrowseByFolderButton active={viewingRootFolderView} />}
      {groups.map(({ entities, label }, key) => {
        return (
          <NavGroup isOpen={navPreferences?.groups?.[label]?.open} key={key} label={label}>
            {entities.map(({ slug, type, label }, i) => {
              let href: string
              let id: string

              if (type === EntityType.collection) {
                href = formatAdminURL({ adminRoute, path: `/collections/${slug}`, serverURL })
                id = `nav-${slug}`
              }

              if (type === EntityType.global) {
                href = formatAdminURL({ adminRoute, path: `/globals/${slug}`, serverURL })
                id = `nav-global-${slug}`
              }

              const isActive =
                pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])

              const Label = (
                <>
                  {isActive && <div className={`${baseClass}__link-indicator`} />}
                  <span className={`${baseClass}__link-label`}>{getTranslation(label, i18n)}</span>
                </>
              )

              // If the URL matches the link exactly
              if (pathname === href) {
                return (
                  <div className={`${baseClass}__link`} id={id} key={i}>
                    {Label}
                  </div>
                )
              }

              return (
                <Link className={`${baseClass}__link`} href={href} id={id} key={i} prefetch={false}>
                  {Label}
                </Link>
              )
            })}
          </NavGroup>
        )
      })}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/Nav/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .nav {
    position: sticky;
    top: 0;
    left: 0;
    flex-shrink: 0;
    height: 100vh;
    width: var(--nav-width);
    border-right: 1px solid var(--theme-elevation-100);
    opacity: 0;
    overflow: hidden;
    --nav-padding-inline-start: var(--base);
    --nav-padding-inline-end: var(--base);
    --nav-padding-block-start: var(--app-header-height);
    --nav-padding-block-end: calc(var(--base) * 2);

    [dir='rtl'] & {
      border-right: none;
      border-left: 1px solid var(--theme-elevation-100);
    }

    &--nav-animate {
      transition: opacity var(--nav-trans-time) ease-in-out;
    }

    &--nav-open {
      opacity: 1;
    }

    &__header {
      position: absolute;
      top: 0;
      width: 100vw;
      height: var(--app-header-height);
    }

    &__header-content {
      z-index: 1;
      position: relative;
      height: 100%;
      width: 100%;
    }

    &__mobile-close {
      display: none;
      background: none;
      border: 0;
      outline: 0;
      padding: base(0.8) 0;
    }

    &__scroll {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: var(--nav-padding-block-start) var(--nav-padding-inline-end)
        var(--nav-padding-block-end) var(--nav-padding-inline-start);
      overflow-y: auto;

      // remove the scrollbar here to prevent layout shift as nav groups are toggled
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-grow: 1;
    }

    &__label {
      color: var(--theme-elevation-400);
    }

    &__controls {
      display: flex;
      flex-direction: column;
      gap: base(0.75);
      margin-top: auto;
      margin-bottom: 0;

      > :first-child {
        margin-top: base(1);
      }

      a:focus-visible {
        outline: var(--accessibility-outline);
      }
    }

    &__log-out {
      &:hover {
        g {
          transform: translateX(-#{base(0.125)});
        }
      }
    }

    &__link {
      display: flex;
      align-items: center;
      position: relative;
      padding-block: base(0.125);
      padding-inline-start: 0;
      padding-inline-end: base(1.5);
      text-decoration: none;

      &:focus:not(:focus-visible) {
        box-shadow: none;
        font-weight: 600;
      }

      &.active {
        font-weight: normal;
        padding-left: 0;
        font-weight: 600;
      }
    }

    a.nav__link {
      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }
    }

    &__link:has(.nav__link-indicator) {
      font-weight: 600;
      padding-left: 0;
    }

    &__link-indicator {
      position: absolute;
      display: block;
      // top: 0;
      inset-inline-start: base(-1);
      width: 2px;
      height: 16px;
      border-start-end-radius: 2px;
      border-end-end-radius: 2px;
      background: var(--theme-text);
    }

    @include mid-break {
      &__scroll {
        --nav-padding-inline-start: calc(var(--base) * 0.5);
        --nav-padding-inline-end: calc(var(--base) * 0.5);
      }
    }

    @include small-break {
      &__scroll {
        --nav-padding-inline-start: var(--gutter-h);
        --nav-padding-inline-end: var(--gutter-h);
      }

      &__link {
        font-size: base(0.875);
        line-height: base(1.5);
      }

      &__mobile-close {
        display: flex;
        align-items: center;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/Nav/index.tsx
Signals: React

```typescript
import type { EntityToGroup } from '@payloadcms/ui/shared'
import type { PayloadRequest, ServerProps } from 'payload'

import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import React from 'react'

import { NavHamburger } from './NavHamburger/index.js'
import { NavWrapper } from './NavWrapper/index.js'
import { SettingsMenuButton } from './SettingsMenuButton/index.js'
import './index.scss'

const baseClass = 'nav'

import { getNavPrefs } from './getNavPrefs.js'
import { DefaultNavClient } from './index.client.js'

export type NavProps = {
  req?: PayloadRequest
} & ServerProps

export const DefaultNav: React.FC<NavProps> = async (props) => {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    req,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config) {
    return null
  }

  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks, logout, settingsMenu },
    },
    collections,
    globals,
  } = payload.config

  const groups = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities.collections.includes(slug))
        .map(
          (collection) =>
            ({
              type: EntityType.collection,
              entity: collection,
            }) satisfies EntityToGroup,
        ),
      ...globals
        .filter(({ slug }) => visibleEntities.globals.includes(slug))
        .map(
          (global) =>
            ({
              type: EntityType.global,
              entity: global,
            }) satisfies EntityToGroup,
        ),
    ],
    permissions,
    i18n,
  )

  const navPreferences = await getNavPrefs(req)

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const renderedSettingsMenu =
    settingsMenu && Array.isArray(settingsMenu)
      ? settingsMenu.map((item, index) =>
          RenderServerComponent({
            clientProps: {
              documentSubViewType,
              viewType,
            },
            Component: item,
            importMap: payload.importMap,
            key: `settings-menu-item-${index}`,
            serverProps: {
              i18n,
              locale,
              params,
              payload,
              permissions,
              searchParams,
              user,
            },
          }),
        )
      : []

  return (
    <NavWrapper baseClass={baseClass}>
      <nav className={`${baseClass}__wrap`}>
        {RenderServerComponent({
          clientProps: {
            documentSubViewType,
            viewType,
          },
          Component: beforeNavLinks,
          importMap: payload.importMap,
          serverProps: {
            i18n,
            locale,
            params,
            payload,
            permissions,
            searchParams,
            user,
          },
        })}
        <DefaultNavClient groups={groups} navPreferences={navPreferences} />
        {RenderServerComponent({
          clientProps: {
            documentSubViewType,
            viewType,
          },
          Component: afterNavLinks,
          importMap: payload.importMap,
          serverProps: {
            i18n,
            locale,
            params,
            payload,
            permissions,
            searchParams,
            user,
          },
        })}
        <div className={`${baseClass}__controls`}>
          <SettingsMenuButton settingsMenu={renderedSettingsMenu} />
          {LogoutComponent}
        </div>
      </nav>
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-content`}>
          <NavHamburger baseClass={baseClass} />
        </div>
      </div>
    </NavWrapper>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/Nav/NavHamburger/index.tsx
Signals: React

```typescript
'use client'
import { Hamburger, useNav } from '@payloadcms/ui'
import React from 'react'

/**
 * @internal
 */
export const NavHamburger: React.FC<{
  baseClass?: string
}> = ({ baseClass }) => {
  const { navOpen, setNavOpen } = useNav()

  return (
    <button
      className={`${baseClass}__mobile-close`}
      onClick={() => {
        setNavOpen(false)
      }}
      tabIndex={!navOpen ? -1 : undefined}
      type="button"
    >
      <Hamburger isActive />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/Nav/NavWrapper/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .nav {
    position: sticky;
    top: 0;
    left: 0;
    flex-shrink: 0;
    height: 100vh;
    width: var(--nav-width);
    border-right: 1px solid var(--theme-elevation-100);
    opacity: 0;

    [dir='rtl'] & {
      border-right: none;
      border-left: 1px solid var(--theme-elevation-100);
    }

    &--nav-animate {
      transition: opacity var(--nav-trans-time) ease-in-out;
    }

    &--nav-open {
      opacity: 1;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/Nav/NavWrapper/index.tsx
Signals: React

```typescript
'use client'
import { useNav } from '@payloadcms/ui'
import React from 'react'

import './index.scss'

/**
 * @internal
 */
export const NavWrapper: React.FC<{
  baseClass?: string
  children: React.ReactNode
}> = (props) => {
  const { baseClass, children } = props

  const { hydrated, navOpen, navRef, shouldAnimate } = useNav()

  return (
    <aside
      className={[
        baseClass,
        navOpen && `${baseClass}--nav-open`,
        shouldAnimate && `${baseClass}--nav-animate`,
        hydrated && `${baseClass}--nav-hydrated`,
      ]
        .filter(Boolean)
        .join(' ')}
      inert={!navOpen ? true : undefined}
    >
      <div className={`${baseClass}__scroll`} ref={navRef}>
        {children}
      </div>
    </aside>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/Nav/SettingsMenuButton/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .settings-menu-button {
    &.popup--h-align-left {
      .popup__content {
        left: calc(var(--nav-padding-inline-start) * -0.5);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/Nav/SettingsMenuButton/index.tsx
Signals: React

```typescript
'use client'
import { GearIcon, Popup, useTranslation } from '@payloadcms/ui'
import React, { Fragment } from 'react'

import './index.scss'

const baseClass = 'settings-menu-button'

export type SettingsMenuButtonProps = {
  settingsMenu?: React.ReactNode[]
}

export const SettingsMenuButton: React.FC<SettingsMenuButtonProps> = ({ settingsMenu }) => {
  const { t } = useTranslation()

  if (!settingsMenu || settingsMenu.length === 0) {
    return null
  }

  return (
    <Popup
      button={<GearIcon ariaLabel={t('general:menu')} />}
      className={baseClass}
      horizontalAlign="left"
      id="settings-menu"
      size="small"
      verticalAlign="bottom"
    >
      {settingsMenu.map((item, i) => (
        <Fragment key={`settings-menu-item-${i}`}>{item}</Fragment>
      ))}
    </Popup>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: payload-main/packages/next/src/exports/auth.ts

```typescript
export { login } from '../auth/login.js'
export { logout } from '../auth/logout.js'
export { refresh } from '../auth/refresh.js'
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/next/src/exports/client.ts

```typescript
'use client'

export { DefaultNavClient } from '../elements/Nav/index.client.js'
export { NavHamburger } from '../elements/Nav/NavHamburger/index.js'
export { NavWrapper } from '../elements/Nav/NavWrapper/index.js'
```

--------------------------------------------------------------------------------

---[FILE: layouts.ts]---
Location: payload-main/packages/next/src/exports/layouts.ts

```typescript
export { metadata, RootLayout } from '../layouts/Root/index.js'
export { handleServerFunctions } from '../utilities/handleServerFunctions.js'
```

--------------------------------------------------------------------------------

---[FILE: routes.ts]---
Location: payload-main/packages/next/src/exports/routes.ts

```typescript
export { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } from '../routes/graphql/index.js'

export {
  DELETE as REST_DELETE,
  GET as REST_GET,
  OPTIONS as REST_OPTIONS,
  PATCH as REST_PATCH,
  POST as REST_POST,
  PUT as REST_PUT,
} from '../routes/rest/index.js'
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/next/src/exports/rsc.ts

```typescript
export { DocumentHeader } from '../elements/DocumentHeader/index.js'
export { Logo } from '../elements/Logo/index.js'
export { DefaultNav } from '../elements/Nav/index.js'
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: payload-main/packages/next/src/exports/templates.ts

```typescript
export { DefaultTemplate, type DefaultTemplateProps } from '../templates/Default/index.js'
export { MinimalTemplate, type MinimalTemplateProps } from '../templates/Minimal/index.js'
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/next/src/exports/utilities.ts

```typescript
// NOTICE: Server-only utilities, do not import anything client-side here.

export { getNextRequestI18n } from '../utilities/getNextRequestI18n.js'
export { getPayloadHMR } from '../utilities/getPayloadHMR.js'

import {
  addDataAndFileToRequest as _addDataAndFileToRequest,
  addLocalesToRequestFromData as _addLocalesToRequestFromData,
  createPayloadRequest as _createPayloadRequest,
  headersWithCors as _headersWithCors,
  mergeHeaders as _mergeHeaders,
  sanitizeLocales as _sanitizeLocales,
} from 'payload'

/**
 * Use:
 * ```ts
 * import { mergeHeaders } from 'payload'
 * ```
 * @deprecated
 */
export const mergeHeaders = _mergeHeaders

/**
 * @deprecated
 * Use:
 * ```ts
 * import { headersWithCors } from 'payload'
 * ```
 */
export const headersWithCors = _headersWithCors

/**
 * @deprecated
 * Use:
 * ```ts
 * import { createPayloadRequest } from 'payload'
 * ```
 */
export const createPayloadRequest = _createPayloadRequest

/**
 * @deprecated
 * Use:
 * ```ts
 * import { addDataAndFileToRequest } from 'payload'
 * ```
 */
export const addDataAndFileToRequest = _addDataAndFileToRequest

/**
 * @deprecated
 * Use:
 * ```ts
 * import { sanitizeLocales } from 'payload'
 * ```
 */
export const sanitizeLocales = _sanitizeLocales

/**
 * @deprecated
 * Use:
 * ```ts
 * import { addLocalesToRequestFromData } from 'payload'
 * ```
 */
export const addLocalesToRequestFromData = _addLocalesToRequestFromData
```

--------------------------------------------------------------------------------

---[FILE: views.ts]---
Location: payload-main/packages/next/src/exports/views.ts

```typescript
export { AccountView } from '../views/Account/index.js'
export { CreateFirstUserView } from '../views/CreateFirstUser/index.js'
export {
  type DashboardViewClientProps,
  type DashboardViewServerProps,
  type DashboardViewServerPropsOnly,
  DefaultDashboard,
} from '../views/Dashboard/Default/index.js'
export { DashboardView } from '../views/Dashboard/index.js'

export { ListView, renderListView, type RenderListViewArgs } from '../views/List/index.js'
export { LoginView } from '../views/Login/index.js'
export { NotFoundPage } from '../views/NotFound/index.js'

export { type GenerateViewMetadata, RootPage } from '../views/Root/index.js'
export { generatePageMetadata } from '../views/Root/metadata.js'
```

--------------------------------------------------------------------------------

---[FILE: checkDependencies.ts]---
Location: payload-main/packages/next/src/layouts/Root/checkDependencies.ts

```typescript
import { type CustomVersionParser, checkDependencies as payloadCheckDependencies } from 'payload'

const customReactVersionParser: CustomVersionParser = (version) => {
  const [mainVersion, ...preReleases] = version.split('-')

  if (preReleases?.length === 3) {
    // Needs different handling, as it's in a format like 19.0.0-rc-06d0b89e-20240801 format
    const date = preReleases[2]

    const parts = mainVersion.split('.').map(Number)
    return { parts, preReleases: [date] }
  }

  const parts = mainVersion.split('.').map(Number)
  return { parts, preReleases }
}

let checkedDependencies = false

export const checkDependencies = () => {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_DISABLE_DEPENDENCY_CHECKER !== 'true' &&
    !checkedDependencies
  ) {
    checkedDependencies = true

    // First check if there are mismatching dependency versions of next / react packages
    void payloadCheckDependencies({
      dependencyGroups: [
        {
          name: 'react',
          dependencies: ['react', 'react-dom'],
          targetVersionDependency: 'react',
        },
      ],
      dependencyVersions: {
        next: {
          required: false,
          version: '>=15.0.0',
        },
        react: {
          customVersionParser: customReactVersionParser,
          required: false,
          version: '>=19.0.0-rc-65a56d0e-20241020',
        },
        'react-dom': {
          customVersionParser: customReactVersionParser,
          required: false,
          version: '>=19.0.0-rc-65a56d0e-20241020',
        },
      },
    })
  }
}
```

--------------------------------------------------------------------------------

````
