---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 166
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 166 of 695)

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
Location: payload-main/packages/next/src/views/Verify/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { Logo } from '../../elements/Logo/index.js'
import { ToastAndRedirect } from './index.client.js'
import './index.scss'

export const verifyBaseClass = 'verify'

export async function Verify({ initPageResult, params, searchParams }: AdminViewServerProps) {
  // /:collectionSlug/verify/:token

  const [collectionSlug, verify, token] = params.segments
  const { locale, permissions, req } = initPageResult

  const {
    i18n,
    payload: { config },
    payload,
    user,
  } = req

  const {
    routes: { admin: adminRoute },
    serverURL,
  } = config

  let textToRender
  let isVerified = false

  try {
    await req.payload.verifyEmail({
      collection: collectionSlug,
      token,
    })

    isVerified = true
    textToRender = req.t('authentication:emailVerified')
  } catch (e) {
    textToRender = req.t('authentication:unableToVerify')
  }

  if (isVerified) {
    return (
      <ToastAndRedirect
        message={req.t('authentication:emailVerified')}
        redirectTo={formatAdminURL({ adminRoute, path: '/login', serverURL })}
      />
    )
  }

  return (
    <React.Fragment>
      <div className={`${verifyBaseClass}__brand`}>
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
      <h2>{textToRender}</h2>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Verify/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateVerifyViewMetadata: GenerateViewMetadata = async ({ config, i18n: { t } }) =>
  generateMetadata({
    description: t('authentication:verifyUser'),
    keywords: t('authentication:verify'),
    serverURL: config.serverURL,
    title: t('authentication:verify'),
    ...(config.admin.meta || {}),
  })
```

--------------------------------------------------------------------------------

---[FILE: fetchVersions.ts]---
Location: payload-main/packages/next/src/views/Version/fetchVersions.ts

```typescript
import {
  logError,
  type PaginatedDocs,
  type PayloadRequest,
  type SelectType,
  type Sort,
  type TypedUser,
  type TypeWithVersion,
  type Where,
} from 'payload'

export const fetchVersion = async <TVersionData extends object = object>({
  id,
  collectionSlug,
  depth,
  globalSlug,
  locale,
  overrideAccess,
  req,
  select,
  user,
}: {
  collectionSlug?: string
  depth?: number
  globalSlug?: string
  id: number | string
  locale?: 'all' | ({} & string)
  overrideAccess?: boolean
  req: PayloadRequest
  select?: SelectType
  user?: TypedUser
}): Promise<null | TypeWithVersion<TVersionData>> => {
  try {
    if (collectionSlug) {
      return (await req.payload.findVersionByID({
        id: String(id),
        collection: collectionSlug,
        depth,
        locale,
        overrideAccess,
        req,
        select,
        user,
      })) as TypeWithVersion<TVersionData>
    } else if (globalSlug) {
      return (await req.payload.findGlobalVersionByID({
        id: String(id),
        slug: globalSlug,
        depth,
        locale,
        overrideAccess,
        req,
        select,
        user,
      })) as TypeWithVersion<TVersionData>
    }
  } catch (err) {
    logError({ err, payload: req.payload })
    return null
  }
}

export const fetchVersions = async <TVersionData extends object = object>({
  collectionSlug,
  depth,
  draft,
  globalSlug,
  limit,
  locale,
  overrideAccess,
  page,
  parentID,
  req,
  select,
  sort,
  user,
  where: whereFromArgs,
}: {
  collectionSlug?: string
  depth?: number
  draft?: boolean
  globalSlug?: string
  limit?: number
  locale?: 'all' | ({} & string)
  overrideAccess?: boolean
  page?: number
  parentID?: number | string
  req: PayloadRequest
  select?: SelectType
  sort?: Sort
  user?: TypedUser
  where?: Where
}): Promise<null | PaginatedDocs<TypeWithVersion<TVersionData>>> => {
  const where: Where = { and: [...(whereFromArgs ? [whereFromArgs] : [])] }

  try {
    if (collectionSlug) {
      if (parentID) {
        where.and.push({
          parent: {
            equals: parentID,
          },
        })
      }
      return (await req.payload.findVersions({
        collection: collectionSlug,
        depth,
        draft,
        limit,
        locale,
        overrideAccess,
        page,
        req,
        select,
        sort,
        user,
        where,
      })) as PaginatedDocs<TypeWithVersion<TVersionData>>
    } else if (globalSlug) {
      return (await req.payload.findGlobalVersions({
        slug: globalSlug,
        depth,
        limit,
        locale,
        overrideAccess,
        page,
        req,
        select,
        sort,
        user,
        where,
      })) as PaginatedDocs<TypeWithVersion<TVersionData>>
    }
  } catch (err) {
    logError({ err, payload: req.payload })

    return null
  }
}

export const fetchLatestVersion = async <TVersionData extends object = object>({
  collectionSlug,
  depth,
  globalSlug,
  locale,
  overrideAccess,
  parentID,
  req,
  select,
  status,
  user,
  where,
}: {
  collectionSlug?: string
  depth?: number
  globalSlug?: string
  locale?: 'all' | ({} & string)
  overrideAccess?: boolean
  parentID?: number | string
  req: PayloadRequest
  select?: SelectType
  status: 'draft' | 'published'
  user?: TypedUser
  where?: Where
}): Promise<null | TypeWithVersion<TVersionData>> => {
  // Get the entity config to check if drafts are enabled
  const entityConfig = collectionSlug
    ? req.payload.collections[collectionSlug]?.config
    : globalSlug
      ? req.payload.globals[globalSlug]?.config
      : undefined

  // Only query by _status if drafts are enabled (since _status field only exists with drafts)
  const draftsEnabled = entityConfig?.versions?.drafts

  const and: Where[] = [
    ...(draftsEnabled
      ? [
          {
            'version._status': {
              equals: status,
            },
          },
        ]
      : []),
    ...(where ? [where] : []),
  ]

  const latest = await fetchVersions({
    collectionSlug,
    depth,
    draft: true,
    globalSlug,
    limit: 1,
    locale,
    overrideAccess,
    parentID,
    req,
    select,
    sort: '-updatedAt',
    user,
    where: { and },
  })

  return latest?.docs?.length ? (latest.docs[0] as TypeWithVersion<TVersionData>) : null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/index.tsx
Signals: React, Next.js

```typescript
import type {
  DocumentViewServerProps,
  Locale,
  SanitizedCollectionPermission,
  SanitizedGlobalPermission,
  TypeWithVersion,
} from 'payload'

import { formatDate } from '@payloadcms/ui/shared'
import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import { getClientSchemaMap } from '@payloadcms/ui/utilities/getClientSchemaMap'
import { getSchemaMap } from '@payloadcms/ui/utilities/getSchemaMap'
import { notFound } from 'next/navigation.js'
import { hasDraftsEnabled } from 'payload/shared'
import React from 'react'

import type { CompareOption } from './Default/types.js'

import { DefaultVersionView } from './Default/index.js'
import { fetchLatestVersion, fetchVersion, fetchVersions } from './fetchVersions.js'
import { RenderDiff } from './RenderFieldsToDiff/index.js'
import { getVersionLabel } from './VersionPillLabel/getVersionLabel.js'
import { VersionPillLabel } from './VersionPillLabel/VersionPillLabel.js'

export async function VersionView(props: DocumentViewServerProps) {
  const { hasPublishedDoc, i18n, initPageResult, routeSegments, searchParams } = props

  const {
    collectionConfig,
    docID: id,
    globalConfig,
    permissions,
    req,
    req: { payload, payload: { config, config: { localization } } = {}, user } = {},
  } = initPageResult

  const versionToID = routeSegments[routeSegments.length - 1]

  const collectionSlug = collectionConfig?.slug
  const globalSlug = globalConfig?.slug

  const draftsEnabled = hasDraftsEnabled(collectionConfig || globalConfig)

  const localeCodesFromParams = searchParams.localeCodes
    ? JSON.parse(searchParams.localeCodes as string)
    : null

  const versionFromIDFromParams = searchParams.versionFrom as string

  const modifiedOnly: boolean = searchParams.modifiedOnly === 'false' ? false : true

  const docPermissions: SanitizedCollectionPermission | SanitizedGlobalPermission = collectionSlug
    ? permissions.collections[collectionSlug]
    : permissions.globals[globalSlug]

  const versionTo = await fetchVersion<{
    _status?: string
  }>({
    id: versionToID,
    collectionSlug,
    depth: 1,
    globalSlug,
    locale: 'all',
    overrideAccess: false,
    req,
    user,
  })

  if (!versionTo) {
    return notFound()
  }

  const [
    previousVersionResult,
    versionFromResult,
    currentlyPublishedVersion,
    latestDraftVersion,
    previousPublishedVersionResult,
  ] = await Promise.all([
    // Previous version (the one before the versionTo)
    fetchVersions({
      collectionSlug,
      // If versionFromIDFromParams is provided, the previous version is only used in the version comparison dropdown => depth 0 is enough.
      // If it's not provided, this is used as `versionFrom` in the comparison, which expects populated data => depth 1 is needed.
      depth: versionFromIDFromParams ? 0 : 1,
      draft: true,
      globalSlug,
      limit: 1,
      locale: 'all',
      overrideAccess: false,
      parentID: id,
      req,
      sort: '-updatedAt',
      user,
      where: {
        and: [
          {
            updatedAt: {
              less_than: versionTo.updatedAt,
            },
          },
        ],
      },
    }),
    // Version from ID from params
    (versionFromIDFromParams
      ? fetchVersion({
          id: versionFromIDFromParams,
          collectionSlug,
          depth: 1,
          globalSlug,
          locale: 'all',
          overrideAccess: false,
          req,
          user,
        })
      : Promise.resolve(null)) as Promise<null | TypeWithVersion<object>>,
    // Currently published version - do note: currently published != latest published, as an unpublished version can be the latest published
    hasPublishedDoc
      ? fetchLatestVersion({
          collectionSlug,
          depth: 0,
          globalSlug,
          locale: 'all',
          overrideAccess: false,
          parentID: id,
          req,
          status: 'published',
          user,
        })
      : Promise.resolve(null),
    // Latest draft version
    draftsEnabled
      ? fetchLatestVersion({
          collectionSlug,
          depth: 0,
          globalSlug,
          locale: 'all',
          overrideAccess: false,
          parentID: id,
          req,
          status: 'draft',
          user,
        })
      : Promise.resolve(null),
    // Previous published version
    // Only query for published versions if drafts are enabled (since _status field only exists with drafts)
    draftsEnabled
      ? fetchVersions({
          collectionSlug,
          depth: 0,
          draft: true,
          globalSlug,
          limit: 1,
          locale: 'all',
          overrideAccess: false,
          parentID: id,
          req,
          sort: '-updatedAt',
          user,
          where: {
            and: [
              {
                updatedAt: {
                  less_than: versionTo.updatedAt,
                },
              },
              {
                'version._status': {
                  equals: 'published',
                },
              },
            ],
          },
        })
      : Promise.resolve(null),
  ])

  const previousVersion: null | TypeWithVersion<object> = previousVersionResult?.docs?.[0] ?? null

  const versionFrom =
    versionFromResult ||
    // By default, we'll compare the previous version. => versionFrom = version previous to versionTo
    previousVersion

  // Previous published version before the versionTo
  const previousPublishedVersion = previousPublishedVersionResult?.docs?.[0] ?? null

  let selectedLocales: string[] = []
  if (localization) {
    let locales: Locale[] = []
    if (localeCodesFromParams) {
      for (const code of localeCodesFromParams) {
        const locale = localization.locales.find((locale) => locale.code === code)
        if (!locale) {
          continue
        }
        locales.push(locale)
      }
    } else {
      locales = localization.locales
    }

    if (localization.filterAvailableLocales) {
      locales = (await localization.filterAvailableLocales({ locales, req })) || []
    }

    selectedLocales = locales.map((locale) => locale.code)
  }

  const schemaMap = getSchemaMap({
    collectionSlug,
    config,
    globalSlug,
    i18n,
  })

  const clientSchemaMap = getClientSchemaMap({
    collectionSlug,
    config: getClientConfig({
      config: payload.config,
      i18n,
      importMap: payload.importMap,
      user,
    }),
    globalSlug,
    i18n,
    payload,
    schemaMap,
  })
  const RenderedDiff = RenderDiff({
    clientSchemaMap,
    customDiffComponents: {},
    entitySlug: collectionSlug || globalSlug,
    fields: (collectionConfig || globalConfig)?.fields,
    fieldsPermissions: docPermissions?.fields,
    i18n,
    modifiedOnly,
    parentIndexPath: '',
    parentIsLocalized: false,
    parentPath: '',
    parentSchemaPath: '',
    req,
    selectedLocales,
    versionFromSiblingData: {
      ...versionFrom?.version,
      updatedAt: versionFrom?.updatedAt,
    },
    versionToSiblingData: {
      ...versionTo.version,
      updatedAt: versionTo.updatedAt,
    },
  })

  const versionToCreatedAtFormatted = versionTo.updatedAt
    ? formatDate({
        date:
          typeof versionTo.updatedAt === 'string'
            ? new Date(versionTo.updatedAt)
            : (versionTo.updatedAt as Date),
        i18n,
        pattern: config.admin.dateFormat,
      })
    : ''

  const formatPill = ({
    doc,
    labelOverride,
    labelStyle,
    labelSuffix,
  }: {
    doc: TypeWithVersion<any>
    labelOverride?: string
    labelStyle?: 'pill' | 'text'
    labelSuffix?: React.ReactNode
  }): React.ReactNode => {
    return (
      <VersionPillLabel
        currentlyPublishedVersion={currentlyPublishedVersion}
        doc={doc}
        key={doc.id}
        labelFirst={true}
        labelOverride={labelOverride}
        labelStyle={labelStyle ?? 'text'}
        labelSuffix={labelSuffix}
        latestDraftVersion={latestDraftVersion}
      />
    )
  }

  // SelectComparison Options:
  //
  // Previous version: always, unless doesn't exist. Can be the same as previously published
  // Latest draft: only if no newer published exists (latestDraftVersion)
  // Currently published: always, if exists
  // Previously published: if there is a prior published version older than versionTo
  // Specific Version: only if not already present under other label (= versionFrom)

  let versionFromOptions: {
    doc: TypeWithVersion<any>
    labelOverride?: string
    updatedAt: Date
    value: string
  }[] = []

  // Previous version
  if (previousVersion?.id) {
    versionFromOptions.push({
      doc: previousVersion,
      labelOverride: i18n.t('version:previousVersion'),
      updatedAt: new Date(previousVersion.updatedAt),
      value: previousVersion.id,
    })
  }

  // Latest Draft
  const publishedNewerThanDraft =
    currentlyPublishedVersion?.updatedAt > latestDraftVersion?.updatedAt
  if (latestDraftVersion && !publishedNewerThanDraft) {
    versionFromOptions.push({
      doc: latestDraftVersion,
      updatedAt: new Date(latestDraftVersion.updatedAt),
      value: latestDraftVersion.id,
    })
  }

  // Currently Published
  if (currentlyPublishedVersion) {
    versionFromOptions.push({
      doc: currentlyPublishedVersion,
      updatedAt: new Date(currentlyPublishedVersion.updatedAt),
      value: currentlyPublishedVersion.id,
    })
  }

  // Previous Published
  if (previousPublishedVersion && currentlyPublishedVersion?.id !== previousPublishedVersion.id) {
    versionFromOptions.push({
      doc: previousPublishedVersion,
      labelOverride: i18n.t('version:previouslyPublished'),
      updatedAt: new Date(previousPublishedVersion.updatedAt),
      value: previousPublishedVersion.id,
    })
  }

  // Specific Version
  if (versionFrom?.id && !versionFromOptions.some((option) => option.value === versionFrom.id)) {
    // Only add "specific version" if it is not already in the options
    versionFromOptions.push({
      doc: versionFrom,
      labelOverride: i18n.t('version:specificVersion'),
      updatedAt: new Date(versionFrom.updatedAt),
      value: versionFrom.id,
    })
  }

  versionFromOptions = versionFromOptions.sort((a, b) => {
    // Sort by updatedAt, newest first
    if (a && b) {
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    }
    return 0
  })

  const versionToIsVersionFrom = versionFrom?.id === versionTo.id

  const versionFromComparisonOptions: CompareOption[] = []

  for (const option of versionFromOptions) {
    const isVersionTo = option.value === versionTo.id

    if (isVersionTo && !versionToIsVersionFrom) {
      // Don't offer selecting a versionFrom that is the same as versionTo, unless it's already selected
      continue
    }

    const alreadyAdded = versionFromComparisonOptions.some(
      (existingOption) => existingOption.value === option.value,
    )
    if (alreadyAdded) {
      continue
    }

    const otherOptionsWithSameID = versionFromOptions.filter(
      (existingOption) => existingOption.value === option.value && existingOption !== option,
    )

    // Merge options with same ID to the same option
    const labelSuffix = otherOptionsWithSameID?.length ? (
      <span key={`${option.value}-suffix`}>
        {' ('}
        {otherOptionsWithSameID.map((optionWithSameID, index) => {
          const label =
            optionWithSameID.labelOverride ||
            getVersionLabel({
              currentlyPublishedVersion,
              latestDraftVersion,
              t: i18n.t,
              version: optionWithSameID.doc,
            }).label

          return (
            <React.Fragment key={`${optionWithSameID.value}-${index}`}>
              {index > 0 ? ', ' : ''}
              {label}
            </React.Fragment>
          )
        })}
        {')'}
      </span>
    ) : undefined

    versionFromComparisonOptions.push({
      label: formatPill({
        doc: option.doc,
        labelOverride: option.labelOverride,
        labelSuffix,
      }),
      value: option.value,
    })
  }

  return (
    <DefaultVersionView
      canUpdate={docPermissions?.update}
      modifiedOnly={modifiedOnly}
      RenderedDiff={RenderedDiff}
      selectedLocales={selectedLocales}
      versionFromCreatedAt={versionFrom?.createdAt}
      versionFromID={versionFrom?.id}
      versionFromOptions={versionFromComparisonOptions}
      versionToCreatedAt={versionTo.createdAt}
      versionToCreatedAtFormatted={versionToCreatedAtFormatted}
      VersionToCreatedAtLabel={formatPill({ doc: versionTo, labelStyle: 'pill' })}
      versionToID={versionTo.id}
      versionToStatus={versionTo.version?._status}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/Version/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { MetaConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { formatDate } from '@payloadcms/ui/shared'

import type { GenerateEditViewMetadata } from '../Document/getMetaBySegment.js'

import { generateMetadata } from '../../utilities/meta.js'

/**
 * @todo Remove the `MetaConfig` type assertions. They are currently required because of how the `Metadata` type from `next` consumes the `URL` type.
 */
export const generateVersionViewMetadata: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  i18n,
}): Promise<Metadata> => {
  const { t } = i18n

  let metaToUse: MetaConfig = {
    ...(config.admin.meta || {}),
  }

  const doc: any = {} // TODO: figure this out

  const formattedCreatedAt = doc?.createdAt
    ? formatDate({ date: doc.createdAt, i18n, pattern: config?.admin?.dateFormat })
    : ''

  if (collectionConfig) {
    const useAsTitle = collectionConfig?.admin?.useAsTitle || 'id'
    const entityLabel = getTranslation(collectionConfig.labels.singular, i18n)
    const titleFromData = doc?.[useAsTitle]

    metaToUse = {
      ...(config.admin.meta || {}),
      description: t('version:viewingVersion', { documentTitle: titleFromData, entityLabel }),
      title: `${t('version:version')}${formattedCreatedAt ? ` - ${formattedCreatedAt}` : ''}${titleFromData ? ` - ${titleFromData}` : ''} - ${entityLabel}`,
      ...(collectionConfig?.admin?.meta || {}),
      ...(collectionConfig?.admin?.components?.views?.edit?.version?.meta || {}),
    }
  }

  if (globalConfig) {
    const entityLabel = getTranslation(globalConfig.label, i18n)

    metaToUse = {
      ...(config.admin.meta || {}),
      description: t('version:viewingVersionGlobal', { entityLabel }),
      title: `${t('version:version')}${formattedCreatedAt ? ` - ${formattedCreatedAt}` : ''}${entityLabel}`,
      ...((globalConfig?.admin?.meta || {}) as MetaConfig),
      ...((globalConfig?.admin?.components?.views?.edit?.version?.meta || {}) as MetaConfig),
    }
  }

  return generateMetadata({
    ...metaToUse,
    serverURL: config.serverURL,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/Default/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .view-version {
    width: 100%;
    padding-bottom: var(--spacing-view-bottom);

    &__toggle-locales-label {
      color: var(--theme-elevation-500);
    }

    &-controls-top {
      border-bottom: 1px solid var(--theme-elevation-100);
      padding: 16px var(--gutter-h) 16px var(--gutter-h);

      &__wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        &-actions {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--base);
        }
      }

      h2 {
        font-size: 18px;
      }
    }

    &-controls-bottom {
      border-bottom: 1px solid var(--theme-elevation-100);
      padding: 16px var(--gutter-h) 16px var(--gutter-h);
      position: relative;

      // Vertical separator line
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background-color: var(--theme-elevation-100);
        transform: translateX(-50%); // Center the line
      }

      &__wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: var(--base);
        gap: var(--base);
      }
    }

    &__time-elapsed {
      color: var(--theme-elevation-500);
    }

    &__version-from {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &-labels {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    }

    &__version-to {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &-labels {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      &-version {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: var(--theme-elevation-50);
        padding: 8px 12px;
        gap: calc(var(--base) / 2);

        h2 {
          font-size: 13px;
          font-weight: 400;
        }
      }
    }

    &__restore {
      div {
        margin-block: 0;
      }
    }

    &__modifiedCheckBox {
      margin: 0 0 0 var(--base);
      display: flex;
      align-items: center;
    }

    &__diff-wrap {
      padding-top: var(--base);
      display: flex;
      flex-direction: column;
      gap: var(--base);
      position: relative;

      // Vertical separator line
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background-color: var(--theme-elevation-100);
        transform: translateX(-50%); // Center the line
        z-index: 2;
      }
    }

    @include mid-break {
      &__version-to {
        &-version {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }

    @include small-break {
      &__diff-wrap {
        padding-top: calc(var(--base) / 2);
      }

      &__version-to,
      &__version-from {
        &-labels {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      &-controls-top {
        &__wrapper {
          flex-direction: column;
          align-items: flex-start;

          .view-version__modifiedCheckBox {
            margin-left: 0;
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/Default/index.tsx
Signals: React, Next.js

```typescript
'use client'

import {
  CheckboxInput,
  ChevronIcon,
  formatTimeToNow,
  Gutter,
  Pill,
  type SelectablePill,
  useConfig,
  useDocumentInfo,
  useLocale,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation.js'
import React, { type FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

import type { CompareOption, DefaultVersionsViewProps } from './types.js'

import { Restore } from '../Restore/index.js'
import './index.scss'
import { SelectComparison } from '../SelectComparison/index.js'
import { type SelectedLocaleOnChange, SelectLocales } from '../SelectLocales/index.js'
import { SelectedLocalesContext } from './SelectedLocalesContext.js'
import { SetStepNav } from './SetStepNav.js'

const baseClass = 'view-version'

export const DefaultVersionView: React.FC<DefaultVersionsViewProps> = ({
  canUpdate,
  modifiedOnly: modifiedOnlyProp,
  RenderedDiff,
  selectedLocales: selectedLocalesFromProps,
  versionFromCreatedAt,
  versionFromID,
  versionFromOptions,
  versionToCreatedAt,
  versionToCreatedAtFormatted,
  VersionToCreatedAtLabel,
  versionToID,
  versionToStatus,
}) => {
  const { config, getEntityConfig } = useConfig()
  const { code } = useLocale()
  const { i18n, t } = useTranslation()

  const [locales, setLocales] = useState<SelectablePill[]>([])
  const [localeSelectorOpen, setLocaleSelectorOpen] = React.useState(false)

  useEffect(() => {
    if (config.localization) {
      const updatedLocales = config.localization.locales.map((locale) => {
        let label = locale.label
        if (typeof locale.label !== 'string' && locale.label[code]) {
          label = locale.label[code]
        }

        return {
          name: locale.code,
          Label: label,
          selected: selectedLocalesFromProps.includes(locale.code),
        } as SelectablePill
      })
      setLocales(updatedLocales)
    }
  }, [code, config.localization, selectedLocalesFromProps])

  const { id: originalDocID, collectionSlug, globalSlug, isTrashed } = useDocumentInfo()
  const { startRouteTransition } = useRouteTransition()

  const { collectionConfig, globalConfig } = useMemo(() => {
    return {
      collectionConfig: getEntityConfig({ collectionSlug }),
      globalConfig: getEntityConfig({ globalSlug }),
    }
  }, [collectionSlug, globalSlug, getEntityConfig])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [modifiedOnly, setModifiedOnly] = useState(modifiedOnlyProp)

  const updateSearchParams = useCallback(
    (args: {
      modifiedOnly?: boolean
      selectedLocales?: SelectablePill[]
      versionFromID?: string
    }) => {
      // If the selected comparison doc or locales change, update URL params so that version page
      // This is so that RSC can update the version comparison state
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (args?.versionFromID) {
        current.set('versionFrom', args?.versionFromID)
      }

      if (args?.selectedLocales) {
        if (!args.selectedLocales.length) {
          current.delete('localeCodes')
        } else {
          const selectedLocaleCodes: string[] = []
          for (const locale of args.selectedLocales) {
            if (locale.selected) {
              selectedLocaleCodes.push(locale.name)
            }
          }
          current.set('localeCodes', JSON.stringify(selectedLocaleCodes))
        }
      }

      if (args?.modifiedOnly === false) {
        current.set('modifiedOnly', 'false')
      } else if (args?.modifiedOnly === true) {
        current.delete('modifiedOnly')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      startRouteTransition(() => router.push(`${pathname}${query}`))
    },
    [pathname, router, searchParams, startRouteTransition],
  )

  const onToggleModifiedOnly: FormEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const newModified = (event.target as HTMLInputElement).checked
      setModifiedOnly(newModified)
      updateSearchParams({
        modifiedOnly: newModified,
      })
    },
    [updateSearchParams],
  )

  const onChangeSelectedLocales: SelectedLocaleOnChange = useCallback(
    ({ locales }) => {
      setLocales(locales)
      updateSearchParams({
        selectedLocales: locales,
      })
    },
    [updateSearchParams],
  )

  const onChangeVersionFrom: (val: CompareOption) => void = useCallback(
    (val) => {
      updateSearchParams({
        versionFromID: val.value,
      })
    },
    [updateSearchParams],
  )

  const { localization } = config

  const versionToTimeAgo = useMemo(
    () =>
      t('version:versionAgo', {
        distance: formatTimeToNow({
          date: versionToCreatedAt,
          i18n,
        }),
      }),
    [versionToCreatedAt, i18n, t],
  )

  const versionFromTimeAgo = useMemo(
    () =>
      versionFromCreatedAt
        ? t('version:versionAgo', {
            distance: formatTimeToNow({
              date: versionFromCreatedAt,
              i18n,
            }),
          })
        : undefined,
    [versionFromCreatedAt, i18n, t],
  )

  return (
    <main className={baseClass}>
      <Gutter className={`${baseClass}-controls-top`}>
        <div className={`${baseClass}-controls-top__wrapper`}>
          <h2>{i18n.t('version:compareVersions')}</h2>
          <div className={`${baseClass}-controls-top__wrapper-actions`}>
            <span className={`${baseClass}__modifiedCheckBox`}>
              <CheckboxInput
                checked={modifiedOnly}
                id={'modifiedOnly'}
                label={i18n.t('version:modifiedOnly')}
                onToggle={onToggleModifiedOnly}
              />
            </span>
            {localization && (
              <Pill
                aria-controls={`${baseClass}-locales`}
                aria-expanded={localeSelectorOpen}
                className={`${baseClass}__toggle-locales`}
                icon={<ChevronIcon direction={localeSelectorOpen ? 'up' : 'down'} />}
                onClick={() => setLocaleSelectorOpen((localeSelectorOpen) => !localeSelectorOpen)}
                pillStyle="light"
                size="small"
              >
                <span className={`${baseClass}__toggle-locales-label`}>
                  {t('general:locales')}:{' '}
                </span>
                <span className={`${baseClass}__toggle-locales-list`}>
                  {locales
                    .filter((locale) => locale.selected)
                    .map((locale) => locale.name)
                    .join(', ')}
                </span>
              </Pill>
            )}
          </div>
        </div>

        {localization && (
          <SelectLocales
            locales={locales}
            localeSelectorOpen={localeSelectorOpen}
            onChange={onChangeSelectedLocales}
          />
        )}
      </Gutter>
      <Gutter className={`${baseClass}-controls-bottom`}>
        <div className={`${baseClass}-controls-bottom__wrapper`}>
          <div className={`${baseClass}__version-from`}>
            <div className={`${baseClass}__version-from-labels`}>
              <span>{t('version:comparingAgainst')}</span>
              {versionFromTimeAgo && (
                <span className={`${baseClass}__time-elapsed`}>{versionFromTimeAgo}</span>
              )}
            </div>
            <SelectComparison
              collectionSlug={collectionSlug}
              docID={originalDocID}
              globalSlug={globalSlug}
              onChange={onChangeVersionFrom}
              versionFromID={versionFromID}
              versionFromOptions={versionFromOptions}
            />
          </div>

          <div className={`${baseClass}__version-to`}>
            <div className={`${baseClass}__version-to-labels`}>
              <span>{t('version:currentlyViewing')}</span>
              <span className={`${baseClass}__time-elapsed`}>{versionToTimeAgo}</span>
            </div>
            <div className={`${baseClass}__version-to-version`}>
              {VersionToCreatedAtLabel}
              {canUpdate && !isTrashed && (
                <Restore
                  className={`${baseClass}__restore`}
                  collectionConfig={collectionConfig}
                  globalConfig={globalConfig}
                  label={collectionConfig?.labels.singular || globalConfig?.label}
                  originalDocID={originalDocID}
                  status={versionToStatus}
                  versionDateFormatted={versionToCreatedAtFormatted}
                  versionID={versionToID}
                />
              )}
            </div>
          </div>
        </div>
      </Gutter>
      <SetStepNav
        collectionConfig={collectionConfig}
        globalConfig={globalConfig}
        id={originalDocID}
        isTrashed={isTrashed}
        versionToCreatedAtFormatted={versionToCreatedAtFormatted}
        versionToID={versionToID}
      />
      <Gutter className={`${baseClass}__diff-wrap`}>
        <SelectedLocalesContext value={{ selectedLocales: locales.map((locale) => locale.name) }}>
          {versionToCreatedAt && RenderedDiff}
        </SelectedLocalesContext>
      </Gutter>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: SelectedLocalesContext.tsx]---
Location: payload-main/packages/next/src/views/Version/Default/SelectedLocalesContext.tsx
Signals: React

```typescript
'use client'

import { createContext, use } from 'react'

type SelectedLocalesContextType = {
  selectedLocales: string[]
}

export const SelectedLocalesContext = createContext<SelectedLocalesContextType>({
  selectedLocales: [],
})

export const useSelectedLocales = () => use(SelectedLocalesContext)
```

--------------------------------------------------------------------------------

---[FILE: SetStepNav.tsx]---
Location: payload-main/packages/next/src/views/Version/Default/SetStepNav.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig, ClientGlobalConfig } from 'payload'
import type React from 'react'

import { getTranslation } from '@payloadcms/translations'
import { useConfig, useDocumentTitle, useLocale, useStepNav, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useEffect } from 'react'

export const SetStepNav: React.FC<{
  readonly collectionConfig?: ClientCollectionConfig
  readonly globalConfig?: ClientGlobalConfig
  readonly id?: number | string
  readonly isTrashed?: boolean
  versionToCreatedAtFormatted?: string
  versionToID?: string
}> = ({
  id,
  collectionConfig,
  globalConfig,
  isTrashed,
  versionToCreatedAtFormatted,
  versionToID,
}) => {
  const { config } = useConfig()
  const { setStepNav } = useStepNav()
  const { i18n, t } = useTranslation()
  const locale = useLocale()
  const { title } = useDocumentTitle()

  useEffect(() => {
    const {
      routes: { admin: adminRoute },
      serverURL,
    } = config

    if (collectionConfig) {
      const collectionSlug = collectionConfig.slug

      const pluralLabel = collectionConfig.labels?.plural

      const docBasePath: `/${string}` = isTrashed
        ? `/collections/${collectionSlug}/trash/${id}`
        : `/collections/${collectionSlug}/${id}`

      const nav = [
        {
          label: getTranslation(pluralLabel, i18n),
          url: formatAdminURL({
            adminRoute,
            path: `/collections/${collectionSlug}`,
            serverURL,
          }),
        },
      ]

      if (isTrashed) {
        nav.push({
          label: t('general:trash'),
          url: formatAdminURL({
            adminRoute,
            path: `/collections/${collectionSlug}/trash`,
            serverURL,
          }),
        })
      }

      nav.push(
        {
          label: title,
          url: formatAdminURL({
            adminRoute,
            path: docBasePath,
            serverURL,
          }),
        },
        {
          label: t('version:versions'),
          url: formatAdminURL({
            adminRoute,
            path: `${docBasePath}/versions`,
            serverURL,
          }),
        },
        {
          label: versionToCreatedAtFormatted,
          url: undefined,
        },
      )

      setStepNav(nav)
      return
    }

    if (globalConfig) {
      const globalSlug = globalConfig.slug

      setStepNav([
        {
          label: globalConfig.label,
          url: formatAdminURL({
            adminRoute,
            path: `/globals/${globalSlug}`,
            serverURL,
          }),
        },
        {
          label: t('version:versions'),
          url: formatAdminURL({
            adminRoute,
            path: `/globals/${globalSlug}/versions`,
            serverURL,
          }),
        },
        {
          label: versionToCreatedAtFormatted,
        },
      ])
    }
  }, [
    config,
    setStepNav,
    id,
    isTrashed,
    locale,
    t,
    i18n,
    collectionConfig,
    globalConfig,
    title,
    versionToCreatedAtFormatted,
    versionToID,
  ])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/next/src/views/Version/Default/types.ts

```typescript
export type CompareOption = {
  label: React.ReactNode | string
  value: string
}

export type VersionPill = {
  id: string
  Label: React.ReactNode
}

export type DefaultVersionsViewProps = {
  canUpdate: boolean
  modifiedOnly: boolean
  RenderedDiff: React.ReactNode
  selectedLocales: string[]
  versionFromCreatedAt?: string
  versionFromID?: string
  versionFromOptions: CompareOption[]
  versionToCreatedAt?: string
  versionToCreatedAtFormatted: string
  VersionToCreatedAtLabel: React.ReactNode
  versionToID?: string
  versionToStatus?: string
}
```

--------------------------------------------------------------------------------

````
