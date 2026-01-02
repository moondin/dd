---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 163
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 163 of 695)

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
Location: payload-main/packages/next/src/views/Edit/metadata.ts
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import type { MetaConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'

import type { GenerateEditViewMetadata } from '../Document/getMetaBySegment.js'

import { generateMetadata } from '../../utilities/meta.js'

/**
 * @todo Remove the type assertion. This is currently required because of how the `Metadata` type from `next` consumes the `URL` type.
 */
export const generateEditViewMetadata: GenerateEditViewMetadata = async ({
  collectionConfig,
  config,
  globalConfig,
  i18n,
  isEditing,
  isReadOnly = false,
  view = 'default',
}): Promise<Metadata> => {
  const { t } = i18n

  const entityLabel = collectionConfig
    ? getTranslation(collectionConfig.labels.singular, i18n)
    : globalConfig
      ? getTranslation(globalConfig.label, i18n)
      : ''

  const verb = isReadOnly
    ? t('general:viewing')
    : isEditing
      ? t('general:editing')
      : t('general:creating')

  const metaToUse: MetaConfig = {
    ...(config.admin.meta || {}),
    description: `${verb} - ${entityLabel}`,
    keywords: `${entityLabel}, Payload, CMS`,
    title: `${verb} - ${entityLabel}`,
  }

  const ogToUse: MetaConfig['openGraph'] = {
    title: `${isEditing ? t('general:edit') : t('general:edit')} - ${entityLabel}`,
    ...(config.admin.meta.openGraph || {}),
    ...((collectionConfig
      ? {
          ...(collectionConfig?.admin.meta?.openGraph || {}),
          ...(collectionConfig?.admin?.components?.views?.edit?.[view]?.meta?.openGraph || {}),
        }
      : {}) as MetaConfig['openGraph']),
    ...((globalConfig
      ? {
          ...(globalConfig?.admin.meta?.openGraph || {}),
          ...(globalConfig?.admin?.components?.views?.edit?.[view]?.meta?.openGraph || {}),
        }
      : {}) as MetaConfig['openGraph']),
  }

  return generateMetadata({
    ...metaToUse,
    openGraph: ogToUse,
    ...((collectionConfig
      ? {
          ...(collectionConfig?.admin.meta || {}),
          ...(collectionConfig?.admin?.components?.views?.edit?.[view]?.meta || {}),
        }
      : {}) as MetaConfig),
    ...((globalConfig
      ? {
          ...(globalConfig?.admin.meta || {}),
          ...(globalConfig?.admin?.components?.views?.edit?.[view]?.meta || {}),
        }
      : {}) as MetaConfig),
    serverURL: config.serverURL,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/ForgotPassword/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import { Button, Link } from '@payloadcms/ui'
import { Translation } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'
import React, { Fragment } from 'react'

import { FormHeader } from '../../elements/FormHeader/index.js'
import { ForgotPasswordForm } from './ForgotPasswordForm/index.js'

export const forgotPasswordBaseClass = 'forgot-password'

export function ForgotPasswordView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      i18n,
      payload: { config },
      user,
    },
  } = initPageResult

  const {
    admin: {
      routes: { account: accountRoute, login: loginRoute },
    },
    routes: { admin: adminRoute },
    serverURL,
  } = config

  if (user) {
    return (
      <Fragment>
        <FormHeader
          description={
            <Translation
              elements={{
                '0': ({ children }) => (
                  <Link
                    href={formatAdminURL({
                      adminRoute,
                      path: accountRoute,
                      serverURL,
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
      </Fragment>
    )
  }

  return (
    <Fragment>
      <ForgotPasswordForm />
      <Link
        href={formatAdminURL({
          adminRoute,
          path: loginRoute,
          serverURL,
        })}
        prefetch={false}
      >
        {i18n.t('authentication:backToLogin')}
      </Link>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: metadata.ts]---
Location: payload-main/packages/next/src/views/ForgotPassword/metadata.ts

```typescript
import type { GenerateViewMetadata } from '../Root/index.js'

import { generateMetadata } from '../../utilities/meta.js'

export const generateForgotPasswordViewMetadata: GenerateViewMetadata = async ({
  config,
  i18n: { t },
}) =>
  generateMetadata({
    description: t('authentication:forgotPassword'),
    keywords: t('authentication:forgotPassword'),
    title: t('authentication:forgotPassword'),
    ...(config.admin.meta || {}),
    serverURL: config.serverURL,
  })
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/ForgotPassword/ForgotPasswordForm/index.tsx
Signals: React

```typescript
'use client'

import type { FormProps } from '@payloadcms/ui'
import type { FormState, PayloadRequest } from 'payload'

import { EmailField, Form, FormSubmit, TextField, useConfig, useTranslation } from '@payloadcms/ui'
import { email, text } from 'payload/shared'
import React, { useState } from 'react'

import { FormHeader } from '../../../elements/FormHeader/index.js'

export const ForgotPasswordForm: React.FC = () => {
  const { config, getEntityConfig } = useConfig()

  const {
    admin: { user: userSlug },
    routes: { api },
  } = config

  const { t } = useTranslation()
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const collectionConfig = getEntityConfig({ collectionSlug: userSlug })
  const loginWithUsername = collectionConfig?.auth?.loginWithUsername

  const handleResponse: FormProps['handleResponse'] = (res, successToast, errorToast) => {
    res
      .json()
      .then(() => {
        setHasSubmitted(true)
        successToast(t('general:submissionSuccessful'))
      })
      .catch(() => {
        errorToast(
          loginWithUsername
            ? t('authentication:usernameNotValid')
            : t('authentication:emailNotValid'),
        )
      })
  }

  const initialState: FormState = loginWithUsername
    ? {
        username: {
          initialValue: '',
          valid: true,
          value: undefined,
        },
      }
    : {
        email: {
          initialValue: '',
          valid: true,
          value: undefined,
        },
      }

  if (hasSubmitted) {
    return (
      <FormHeader
        description={t('authentication:checkYourEmailForPasswordReset')}
        heading={t('authentication:emailSent')}
      />
    )
  }

  return (
    <Form
      action={`${api}/${userSlug}/forgot-password`}
      handleResponse={handleResponse}
      initialState={initialState}
      method="POST"
    >
      <FormHeader
        description={
          loginWithUsername
            ? t('authentication:forgotPasswordUsernameInstructions')
            : t('authentication:forgotPasswordEmailInstructions')
        }
        heading={t('authentication:forgotPassword')}
      />

      {loginWithUsername ? (
        <TextField
          field={{
            name: 'username',
            label: t('authentication:username'),
            required: true,
          }}
          path="username"
          validate={(value) =>
            text(value, {
              name: 'username',
              type: 'text',
              blockData: {},
              data: {},
              event: 'onChange',
              path: ['username'],
              preferences: { fields: {} },
              req: {
                payload: {
                  config,
                },
                t,
              } as unknown as PayloadRequest,
              required: true,
              siblingData: {},
            })
          }
        />
      ) : (
        <EmailField
          field={{
            name: 'email',
            admin: {
              autoComplete: 'email',
            },
            label: t('general:email'),
            required: true,
          }}
          path="email"
          validate={(value) =>
            email(value, {
              name: 'email',
              type: 'email',
              blockData: {},
              data: {},
              event: 'onChange',
              path: ['email'],
              preferences: { fields: {} },
              req: { payload: { config }, t } as unknown as PayloadRequest,
              required: true,
              siblingData: {},
            })
          }
        />
      )}
      <FormSubmit size="large">{t('general:submit')}</FormSubmit>
    </Form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: createSerializableValue.ts]---
Location: payload-main/packages/next/src/views/List/createSerializableValue.ts

```typescript
// Helper function to create serializable value for client components
export const createSerializableValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'null'
  }
  if (typeof value === 'object' && value?.relationTo && value?.value) {
    return `${value.relationTo}:${value.value}`
  }
  if (typeof value === 'object' && value?.id) {
    return String(value.id)
  }
  return String(value)
}
```

--------------------------------------------------------------------------------

---[FILE: enrichDocsWithVersionStatus.ts]---
Location: payload-main/packages/next/src/views/List/enrichDocsWithVersionStatus.ts

```typescript
import type { PaginatedDocs, PayloadRequest, SanitizedCollectionConfig } from 'payload'

/**
 * Enriches list view documents with correct draft status display.
 * When draft=true is used in the query, Payload returns the latest draft version if it exists.
 * This function checks if draft documents also have a published version to determine "changed" status.
 *
 * Performance: Uses a single query to find all documents with "changed" status instead of N queries.
 */
export async function enrichDocsWithVersionStatus({
  collectionConfig,
  data,
  req,
}: {
  collectionConfig: SanitizedCollectionConfig
  data: PaginatedDocs
  req: PayloadRequest
}): Promise<PaginatedDocs> {
  const draftsEnabled = collectionConfig?.versions?.drafts

  if (!draftsEnabled || !data?.docs?.length) {
    return data
  }

  // Find all draft documents
  // When querying with draft:true, we get the latest draft if it exists
  // We need to check if these drafts have a published version
  const draftDocs = data.docs.filter((doc) => doc._status === 'draft')

  if (draftDocs.length === 0) {
    return data
  }

  const draftDocIds = draftDocs.map((doc) => doc.id).filter(Boolean)

  if (draftDocIds.length === 0) {
    return data
  }

  // OPTIMIZATION: Single query to find all document IDs that have BOTH:
  // 1. A draft version (latest=true, _status='draft')
  // 2. A published version (_status='published')
  // These are the documents with "changed" status
  try {
    // TODO: This could be more efficient with a findDistinctVersions() API:
    // const { values } = await req.payload.findDistinctVersions({
    //   collection: collectionConfig.slug,
    //   field: 'parent',
    //   where: {
    //     and: [
    //       { parent: { in: draftDocIds } },
    //       { 'version._status': { equals: 'published' } },
    //     ],
    //   },
    // })
    // const hasPublishedVersionSet = new Set(values)
    //
    // For now, we query all published versions but only select the 'parent' field
    // to minimize data transfer, then deduplicate with a Set
    const publishedVersions = await req.payload.findVersions({
      collection: collectionConfig.slug,
      depth: 0,
      limit: 0,
      pagination: false,
      select: {
        parent: true,
      },
      where: {
        and: [
          {
            parent: {
              in: draftDocIds,
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

    // Create a Set of document IDs that have published versions
    const hasPublishedVersionSet = new Set(
      publishedVersions.docs.map((version) => version.parent).filter(Boolean),
    )

    // Enrich documents with display status
    const enrichedDocs = data.docs.map((doc) => {
      // If it's a draft and has a published version, show "changed"
      if (doc._status === 'draft' && hasPublishedVersionSet.has(doc.id)) {
        return {
          ...doc,
          _displayStatus: 'changed' as const,
        }
      }

      return {
        ...doc,
        _displayStatus: doc._status as 'draft' | 'published',
      }
    })

    return {
      ...data,
      docs: enrichedDocs,
    }
  } catch (error) {
    // If there's an error querying versions, just return the original data
    req.payload.logger.error({
      err: error,
      msg: `Error checking version status for collection ${collectionConfig.slug}`,
    })
    return data
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extractRelationshipDisplayValue.ts]---
Location: payload-main/packages/next/src/views/List/extractRelationshipDisplayValue.ts

```typescript
import type { ClientCollectionConfig, ClientConfig } from 'payload'

// Helper function to extract display value from relationship
export const extractRelationshipDisplayValue = (
  relationship: any,
  clientConfig: ClientConfig,
  relationshipConfig?: ClientCollectionConfig,
): string => {
  if (!relationship) {
    return ''
  }

  // Handle polymorphic relationships
  if (typeof relationship === 'object' && relationship?.relationTo && relationship?.value) {
    const config = clientConfig.collections.find((c) => c.slug === relationship.relationTo)
    return relationship.value?.[config?.admin?.useAsTitle || 'id'] || ''
  }

  // Handle regular relationships
  if (typeof relationship === 'object' && relationship?.id) {
    return relationship[relationshipConfig?.admin?.useAsTitle || 'id'] || ''
  }

  return String(relationship)
}
```

--------------------------------------------------------------------------------

---[FILE: extractValueOrRelationshipID.ts]---
Location: payload-main/packages/next/src/views/List/extractValueOrRelationshipID.ts

```typescript
// Helper function to extract value or relationship ID for database queries
export const extractValueOrRelationshipID = (relationship: any): any => {
  if (!relationship || typeof relationship !== 'object') {
    return relationship
  }

  // For polymorphic relationships, preserve structure but ensure IDs are strings
  if (relationship?.relationTo && relationship?.value) {
    return {
      relationTo: relationship.relationTo,
      value: String(relationship.value?.id || relationship.value),
    }
  }

  // For regular relationships, extract ID
  if (relationship?.id) {
    return String(relationship.id)
  }

  return relationship
}
```

--------------------------------------------------------------------------------

---[FILE: handleGroupBy.ts]---
Location: payload-main/packages/next/src/views/List/handleGroupBy.ts

```typescript
import type {
  ClientCollectionConfig,
  ClientConfig,
  Column,
  ListQuery,
  PaginatedDocs,
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedFieldsPermissions,
  SelectType,
  ViewTypes,
  Where,
} from 'payload'

import { renderTable } from '@payloadcms/ui/rsc'
import { formatDate } from '@payloadcms/ui/shared'
import { flattenAllFields } from 'payload'

import { createSerializableValue } from './createSerializableValue.js'
import { extractRelationshipDisplayValue } from './extractRelationshipDisplayValue.js'
import { extractValueOrRelationshipID } from './extractValueOrRelationshipID.js'

export const handleGroupBy = async ({
  clientCollectionConfig,
  clientConfig,
  collectionConfig,
  collectionSlug,
  columns,
  customCellProps,
  drawerSlug,
  enableRowSelections,
  fieldPermissions,
  query,
  req,
  select,
  trash = false,
  user,
  viewType,
  where: whereWithMergedSearch,
}: {
  clientCollectionConfig: ClientCollectionConfig
  clientConfig: ClientConfig
  collectionConfig: SanitizedCollectionConfig
  collectionSlug: string
  columns: any[]
  customCellProps?: Record<string, any>
  drawerSlug?: string
  enableRowSelections?: boolean
  fieldPermissions?: SanitizedFieldsPermissions
  query?: ListQuery
  req: PayloadRequest
  select?: SelectType
  trash?: boolean
  user: any
  viewType?: ViewTypes
  where: Where
}): Promise<{
  columnState: Column[]
  data: PaginatedDocs
  Table: null | React.ReactNode | React.ReactNode[]
}> => {
  let Table: React.ReactNode | React.ReactNode[] = null
  let columnState: Column[]

  const dataByGroup: Record<string, PaginatedDocs> = {}

  // NOTE: is there a faster/better way to do this?
  const flattenedFields = flattenAllFields({ fields: collectionConfig.fields })

  const groupByFieldPath = query.groupBy.replace(/^-/, '')

  const groupByField = flattenedFields.find((f) => f.name === groupByFieldPath)

  // Set up population for relationships
  let populate

  if (groupByField?.type === 'relationship' && groupByField.relationTo) {
    const relationTo = Array.isArray(groupByField.relationTo)
      ? groupByField.relationTo
      : [groupByField.relationTo]

    populate = {}
    relationTo.forEach((rel) => {
      const config = clientConfig.collections.find((c) => c.slug === rel)
      populate[rel] = { [config?.admin?.useAsTitle || 'id']: true }
    })
  }

  const distinct = await req.payload.findDistinct({
    collection: collectionSlug,
    depth: 1,
    field: groupByFieldPath,
    limit: query?.limit ? Number(query.limit) : undefined,
    locale: req.locale,
    overrideAccess: false,
    page: query?.page ? Number(query.page) : undefined,
    populate,
    req,
    sort: query?.groupBy,
    trash,
    where: whereWithMergedSearch,
  })

  const data = {
    ...distinct,
    docs: distinct.values?.map(() => ({})) || [],
    values: undefined,
  }

  await Promise.all(
    (distinct.values || []).map(async (distinctValue, i) => {
      const potentiallyPopulatedRelationship = distinctValue[groupByFieldPath]

      // Extract value or relationship ID for database query
      const valueOrRelationshipID = extractValueOrRelationshipID(potentiallyPopulatedRelationship)

      const groupData = await req.payload.find({
        collection: collectionSlug,
        depth: 0,
        draft: true,
        fallbackLocale: false,
        includeLockStatus: true,
        limit: query?.queryByGroup?.[valueOrRelationshipID]?.limit
          ? Number(query.queryByGroup[valueOrRelationshipID].limit)
          : undefined,
        locale: req.locale,
        overrideAccess: false,
        page: query?.queryByGroup?.[valueOrRelationshipID]?.page
          ? Number(query.queryByGroup[valueOrRelationshipID].page)
          : undefined,
        req,
        // Note: if we wanted to enable table-by-table sorting, we could use this:
        // sort: query?.queryByGroup?.[valueOrRelationshipID]?.sort,
        select,
        sort: query?.sort,
        trash,
        user,
        where: {
          ...(whereWithMergedSearch || {}),
          [groupByFieldPath]: {
            equals: valueOrRelationshipID,
          },
        },
      })

      // Extract heading
      let heading: string

      if (potentiallyPopulatedRelationship === null) {
        heading = req.i18n.t('general:noValue')
      } else if (groupByField?.type === 'relationship') {
        const relationshipConfig = Array.isArray(groupByField.relationTo)
          ? undefined
          : clientConfig.collections.find((c) => c.slug === groupByField.relationTo)
        heading = extractRelationshipDisplayValue(
          potentiallyPopulatedRelationship,
          clientConfig,
          relationshipConfig,
        )
      } else if (groupByField?.type === 'date') {
        heading = formatDate({
          date: String(valueOrRelationshipID),
          i18n: req.i18n,
          pattern: clientConfig.admin.dateFormat,
        })
      } else if (groupByField?.type === 'checkbox') {
        if (valueOrRelationshipID === true) {
          heading = req.i18n.t('general:true')
        }
        if (valueOrRelationshipID === false) {
          heading = req.i18n.t('general:false')
        }
      } else {
        heading = String(valueOrRelationshipID)
      }

      // Create serializable value for client
      const serializableValue = createSerializableValue(valueOrRelationshipID)

      if (groupData.docs && groupData.docs.length > 0) {
        const { columnState: newColumnState, Table: NewTable } = renderTable({
          clientCollectionConfig,
          collectionConfig,
          columns,
          customCellProps,
          data: groupData,
          drawerSlug,
          enableRowSelections,
          fieldPermissions,
          groupByFieldPath,
          groupByValue: serializableValue,
          heading: heading || req.i18n.t('general:noValue'),
          i18n: req.i18n,
          key: `table-${serializableValue}`,
          orderableFieldName: collectionConfig.orderable === true ? '_order' : undefined,
          payload: req.payload,
          query,
          useAsTitle: collectionConfig.admin.useAsTitle,
          viewType,
        })

        // Only need to set `columnState` once, using the first table's column state
        // This will avoid needing to generate column state explicitly for root context that wraps all tables
        if (!columnState) {
          columnState = newColumnState
        }

        if (!Table) {
          Table = []
        }

        dataByGroup[serializableValue] = groupData
        ;(Table as Array<React.ReactNode>)[i] = NewTable
      }
    }),
  )

  return {
    columnState,
    data,
    Table,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: handleServerFunction.tsx]---
Location: payload-main/packages/next/src/views/List/handleServerFunction.tsx
Signals: Next.js

```typescript
import type { RenderListServerFnArgs, RenderListServerFnReturnType } from '@payloadcms/ui'
import type { CollectionPreferences, ServerFunction, VisibleEntities } from 'payload'

import { getClientConfig } from '@payloadcms/ui/utilities/getClientConfig'
import { headers as getHeaders } from 'next/headers.js'
import {
  canAccessAdmin,
  getAccessResults,
  isEntityHidden,
  parseCookies,
  UnauthorizedError,
} from 'payload'
import { applyLocaleFiltering } from 'payload/shared'

import { renderListView } from './index.js'

export const renderListHandler: ServerFunction<
  RenderListServerFnArgs,
  Promise<RenderListServerFnReturnType>
> = async (args) => {
  const {
    collectionSlug,
    disableActions,
    disableBulkDelete,
    disableBulkEdit,
    disableQueryPresets,
    drawerSlug,
    enableRowSelections,
    overrideEntityVisibility,
    query,
    redirectAfterDelete,
    redirectAfterDuplicate,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      user,
    },
  } = args

  if (!req.user) {
    throw new UnauthorizedError()
  }

  const headers = await getHeaders()

  const cookies = parseCookies(headers)

  await canAccessAdmin({ req })

  const clientConfig = getClientConfig({
    config,
    i18n,
    importMap: payload.importMap,
    user,
  })
  await applyLocaleFiltering({ clientConfig, config, req })

  const preferencesKey = `collection-${collectionSlug}`

  const preferences = await payload
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
    .then((res) => res.docs[0]?.value as CollectionPreferences)

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

  const { List } = await renderListView({
    clientConfig,
    disableActions,
    disableBulkDelete,
    disableBulkEdit,
    disableQueryPresets,
    drawerSlug,
    enableRowSelections,
    i18n,
    importMap: payload.importMap,
    initPageResult: {
      collectionConfig: payload?.collections?.[collectionSlug]?.config,
      cookies,
      globalConfig: payload.config.globals.find((global) => global.slug === collectionSlug),
      languageOptions: undefined, // TODO
      permissions,
      req,
      translations: undefined, // TODO
      visibleEntities,
    },
    overrideEntityVisibility,
    params: {
      segments: ['collections', collectionSlug],
    },
    payload,
    query,
    redirectAfterDelete,
    redirectAfterDuplicate,
    searchParams: {},
    viewType: 'list',
  })

  return {
    List,
    preferences,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/List/index.tsx
Signals: React, Next.js

```typescript
import type {
  AdminViewServerProps,
  CollectionPreferences,
  Column,
  ColumnPreference,
  ListQuery,
  ListViewClientProps,
  ListViewServerPropsOnly,
  PaginatedDocs,
  PayloadComponent,
  QueryPreset,
  SanitizedCollectionPermission,
} from 'payload'

import { DefaultListView, HydrateAuthProvider, ListQueryProvider } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { getColumns, renderFilters, renderTable, upsertPreferences } from '@payloadcms/ui/rsc'
import { notFound } from 'next/navigation.js'
import {
  appendUploadSelectFields,
  combineWhereConstraints,
  formatAdminURL,
  isNumber,
  mergeListSearchAndWhere,
  transformColumnsToPreferences,
  transformColumnsToSearchParams,
} from 'payload/shared'
import React, { Fragment } from 'react'

import { getDocumentPermissions } from '../Document/getDocumentPermissions.js'
import { enrichDocsWithVersionStatus } from './enrichDocsWithVersionStatus.js'
import { handleGroupBy } from './handleGroupBy.js'
import { renderListViewSlots } from './renderListViewSlots.js'
import { resolveAllFilterOptions } from './resolveAllFilterOptions.js'
import { transformColumnsToSelect } from './transformColumnsToSelect.js'

/**
 * @internal
 */
export type RenderListViewArgs = {
  /**
   * Allows providing your own list view component. This will override the default list view component and
   * the collection's configured list view component (if any).
   */
  ComponentOverride?:
    | PayloadComponent
    | React.ComponentType<ListViewClientProps | (ListViewClientProps & ListViewServerPropsOnly)>
  customCellProps?: Record<string, any>
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  disableQueryPresets?: boolean
  drawerSlug?: string
  enableRowSelections: boolean
  overrideEntityVisibility?: boolean
  /**
   * If not ListQuery is provided, `req.query` will be used.
   */
  query?: ListQuery
  redirectAfterDelete?: boolean
  redirectAfterDuplicate?: boolean
  /**
   * @experimental This prop is subject to change in future releases.
   */
  trash?: boolean
} & AdminViewServerProps

/**
 * This function is responsible for rendering
 * the list view on the server for both:
 *  - default list view
 *  - list view within drawers
 *
 * @internal
 */
export const renderListView = async (
  args: RenderListViewArgs,
): Promise<{
  List: React.ReactNode
}> => {
  const {
    clientConfig,
    ComponentOverride,
    customCellProps,
    disableBulkDelete,
    disableBulkEdit,
    disableQueryPresets,
    drawerSlug,
    enableRowSelections,
    initPageResult,
    overrideEntityVisibility,
    params,
    query: queryFromArgs,
    searchParams,
    trash,
    viewType,
  } = args

  const {
    collectionConfig,
    collectionConfig: { slug: collectionSlug },
    locale: fullLocale,
    permissions,
    req,
    req: {
      i18n,
      payload,
      payload: { config },
      query: queryFromReq,
      user,
    },
    visibleEntities,
  } = initPageResult

  if (!permissions?.collections?.[collectionSlug]?.read) {
    throw new Error('not-found')
  }

  const query: ListQuery = queryFromArgs || queryFromReq

  const columnsFromQuery: ColumnPreference[] = transformColumnsToPreferences(query?.columns)

  query.queryByGroup =
    query?.queryByGroup && typeof query.queryByGroup === 'string'
      ? JSON.parse(query.queryByGroup)
      : query?.queryByGroup

  const collectionPreferences = await upsertPreferences<CollectionPreferences>({
    key: `collection-${collectionSlug}`,
    req,
    value: {
      columns: columnsFromQuery,
      groupBy: query?.groupBy,
      limit: isNumber(query?.limit) ? Number(query.limit) : undefined,
      preset: query?.preset,
      sort: query?.sort as string,
    },
  })

  query.preset = collectionPreferences?.preset

  query.page = isNumber(query?.page) ? Number(query.page) : 0

  query.limit = collectionPreferences?.limit || collectionConfig.admin.pagination.defaultLimit

  query.sort =
    collectionPreferences?.sort ||
    (typeof collectionConfig.defaultSort === 'string' ? collectionConfig.defaultSort : undefined)

  query.groupBy = collectionPreferences?.groupBy

  query.columns = transformColumnsToSearchParams(collectionPreferences?.columns || [])

  const {
    routes: { admin: adminRoute },
  } = config

  if (collectionConfig) {
    if (!visibleEntities.collections.includes(collectionSlug) && !overrideEntityVisibility) {
      throw new Error('not-found')
    }

    const baseFilterConstraint = await (
      collectionConfig.admin?.baseFilter ?? collectionConfig.admin?.baseListFilter
    )?.({
      limit: query.limit,
      page: query.page,
      req,
      sort: query.sort,
    })

    let queryPreset: QueryPreset | undefined
    let queryPresetPermissions: SanitizedCollectionPermission | undefined

    let whereWithMergedSearch = mergeListSearchAndWhere({
      collectionConfig,
      search: typeof query?.search === 'string' ? query.search : undefined,
      where: combineWhereConstraints([query?.where, baseFilterConstraint]),
    })

    if (trash === true) {
      whereWithMergedSearch = {
        and: [
          whereWithMergedSearch,
          {
            deletedAt: {
              exists: true,
            },
          },
        ],
      }
    }

    if (collectionPreferences?.preset) {
      try {
        queryPreset = (await payload.findByID({
          id: collectionPreferences?.preset,
          collection: 'payload-query-presets',
          depth: 0,
          overrideAccess: false,
          user,
        })) as QueryPreset

        if (queryPreset) {
          queryPresetPermissions = await getDocumentPermissions({
            id: queryPreset.id,
            collectionConfig: config.collections.find((c) => c.slug === 'payload-query-presets'),
            data: queryPreset,
            req,
          })?.then(({ docPermissions }) => docPermissions)
        }
      } catch (err) {
        req.payload.logger.error(`Error fetching query preset or preset permissions: ${err}`)
      }
    }

    let Table: React.ReactNode | React.ReactNode[] = null
    let columnState: Column[] = []
    let data: PaginatedDocs = {
      // no results default
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: query.limit,
      nextPage: null,
      page: 1,
      pagingCounter: 0,
      prevPage: null,
      totalDocs: 0,
      totalPages: 0,
    }

    const clientCollectionConfig = clientConfig.collections.find((c) => c.slug === collectionSlug)

    const columns = getColumns({
      clientConfig,
      collectionConfig: clientCollectionConfig,
      collectionSlug,
      columns: collectionPreferences?.columns,
      i18n,
      permissions,
    })

    const select = collectionConfig.admin.enableListViewSelectAPI
      ? transformColumnsToSelect(columns)
      : undefined

    /** Force select image fields for list view thumbnails */
    appendUploadSelectFields({
      collectionConfig,
      select,
    })

    try {
      if (collectionConfig.admin.groupBy && query.groupBy) {
        ;({ columnState, data, Table } = await handleGroupBy({
          clientCollectionConfig,
          clientConfig,
          collectionConfig,
          collectionSlug,
          columns,
          customCellProps,
          drawerSlug,
          enableRowSelections,
          fieldPermissions: permissions?.collections?.[collectionSlug]?.fields,
          query,
          req,
          select,
          trash,
          user,
          viewType,
          where: whereWithMergedSearch,
        }))

        // Enrich documents with correct display status for drafts
        data = await enrichDocsWithVersionStatus({
          collectionConfig,
          data,
          req,
        })
      } else {
        data = await req.payload.find({
          collection: collectionSlug,
          depth: 0,
          draft: true,
          fallbackLocale: false,
          includeLockStatus: true,
          limit: query?.limit ? Number(query.limit) : undefined,
          locale: req.locale,
          overrideAccess: false,
          page: query?.page ? Number(query.page) : undefined,
          req,
          select,
          sort: query?.sort,
          trash,
          user,
          where: whereWithMergedSearch,
        })

        // Enrich documents with correct display status for drafts
        data = await enrichDocsWithVersionStatus({
          collectionConfig,
          data,
          req,
        })
        ;({ columnState, Table } = renderTable({
          clientCollectionConfig,
          collectionConfig,
          columns,
          customCellProps,
          data,
          drawerSlug,
          enableRowSelections,
          fieldPermissions: permissions?.collections?.[collectionSlug]?.fields,
          i18n: req.i18n,
          orderableFieldName: collectionConfig.orderable === true ? '_order' : undefined,
          payload: req.payload,
          query,
          req,
          useAsTitle: collectionConfig.admin.useAsTitle,
          viewType,
        }))
      }
    } catch (err) {
      if (err.name !== 'QueryError') {
        // QueryErrors are expected when a user filters by a field they do not have access to
        req.payload.logger.error({
          err,
          msg: `There was an error fetching the list view data for collection ${collectionSlug}`,
        })
        throw err
      }
    }

    const renderedFilters = renderFilters(collectionConfig.fields, req.payload.importMap)

    const resolvedFilterOptions = await resolveAllFilterOptions({
      fields: collectionConfig.fields,
      req,
    })

    const staticDescription =
      typeof collectionConfig.admin.description === 'function'
        ? collectionConfig.admin.description({ t: i18n.t })
        : collectionConfig.admin.description

    const newDocumentURL = formatAdminURL({
      adminRoute,
      path: `/collections/${collectionSlug}/create`,
      serverURL: config.serverURL,
    })

    const hasCreatePermission = permissions?.collections?.[collectionSlug]?.create
    const hasDeletePermission = permissions?.collections?.[collectionSlug]?.delete

    // Check if there's a notFound query parameter (document ID that wasn't found)
    const notFoundDocId = typeof searchParams?.notFound === 'string' ? searchParams.notFound : null

    const serverProps: ListViewServerPropsOnly = {
      collectionConfig,
      data,
      i18n,
      limit: query.limit,
      listPreferences: collectionPreferences,
      listSearchableFields: collectionConfig.admin.listSearchableFields,
      locale: fullLocale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    }

    const listViewSlots = renderListViewSlots({
      clientProps: {
        collectionSlug,
        hasCreatePermission,
        hasDeletePermission,
        newDocumentURL,
      },
      collectionConfig,
      description: staticDescription,
      notFoundDocId,
      payload,
      serverProps,
    })

    const isInDrawer = Boolean(drawerSlug)

    // Needed to prevent: Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.
    // Is there a way to avoid this? The `where` object is already seemingly plain, but is not bc it originates from the params.
    query.where = query?.where ? JSON.parse(JSON.stringify(query?.where || {})) : undefined

    return {
      List: (
        <Fragment>
          <HydrateAuthProvider permissions={permissions} />
          <ListQueryProvider
            collectionSlug={collectionSlug}
            data={data}
            modifySearchParams={!isInDrawer}
            orderableFieldName={collectionConfig.orderable === true ? '_order' : undefined}
            query={query}
          >
            {RenderServerComponent({
              clientProps: {
                ...listViewSlots,
                collectionSlug,
                columnState,
                disableBulkDelete,
                disableBulkEdit: collectionConfig.disableBulkEdit ?? disableBulkEdit,
                disableQueryPresets,
                enableRowSelections,
                hasCreatePermission,
                hasDeletePermission,
                listPreferences: collectionPreferences,
                newDocumentURL,
                queryPreset,
                queryPresetPermissions,
                renderedFilters,
                resolvedFilterOptions,
                Table,
                viewType,
              } satisfies ListViewClientProps,
              Component:
                ComponentOverride ?? collectionConfig?.admin?.components?.views?.list?.Component,
              Fallback: DefaultListView,
              importMap: payload.importMap,
              serverProps,
            })}
          </ListQueryProvider>
        </Fragment>
      ),
    }
  }

  throw new Error('not-found')
}

export const ListView: React.FC<RenderListViewArgs> = async (args) => {
  try {
    const { List: RenderedList } = await renderListView({ ...args, enableRowSelections: true })
    return RenderedList
  } catch (error) {
    if (error.message === 'not-found') {
      notFound()
    } else {
      console.error(error) // eslint-disable-line no-console
    }
  }
}
```

--------------------------------------------------------------------------------

````
