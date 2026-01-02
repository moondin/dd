---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 252
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 252 of 695)

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

---[FILE: index.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/index.ts

```typescript
import type { AcceptedLanguages } from '@payloadcms/translations'
import type { CollectionConfig, Config } from 'payload'

import chalk from 'chalk'
import { hasAutosaveEnabled } from 'payload/shared'

import type { PluginDefaultTranslationsObject } from './translations/types.js'
import type { MultiTenantPluginConfig } from './types.js'

import { defaults } from './defaults.js'
import { getTenantOptionsEndpoint } from './endpoints/getTenantOptionsEndpoint.js'
import { tenantField } from './fields/tenantField/index.js'
import { tenantsArrayField } from './fields/tenantsArrayField/index.js'
import { filterDocumentsByTenants } from './filters/filterDocumentsByTenants.js'
import { addTenantCleanup } from './hooks/afterTenantDelete.js'
import { translations } from './translations/index.js'
import { addCollectionAccess } from './utilities/addCollectionAccess.js'
import { addFilterOptionsToFields } from './utilities/addFilterOptionsToFields.js'
import { combineFilters } from './utilities/combineFilters.js'
import { miniChalk } from './utilities/miniChalk.js'

export const multiTenantPlugin =
  <ConfigType>(pluginConfig: MultiTenantPluginConfig<ConfigType>) =>
  (incomingConfig: Config): Config => {
    if (pluginConfig.enabled === false) {
      return incomingConfig
    }

    /**
     * Set defaults
     */
    const userHasAccessToAllTenants: Required<
      MultiTenantPluginConfig<ConfigType>
    >['userHasAccessToAllTenants'] =
      typeof pluginConfig.userHasAccessToAllTenants === 'function'
        ? pluginConfig.userHasAccessToAllTenants
        : () => false
    const tenantsCollectionSlug = (pluginConfig.tenantsSlug =
      pluginConfig.tenantsSlug || defaults.tenantCollectionSlug)
    const tenantFieldName = pluginConfig?.tenantField?.name || defaults.tenantFieldName
    const tenantsArrayFieldName =
      pluginConfig?.tenantsArrayField?.arrayFieldName || defaults.tenantsArrayFieldName
    const tenantsArrayTenantFieldName =
      pluginConfig?.tenantsArrayField?.arrayTenantFieldName || defaults.tenantsArrayTenantFieldName
    const basePath = pluginConfig.basePath || defaults.basePath

    /**
     * Add defaults for admin properties
     */
    if (!incomingConfig.admin) {
      incomingConfig.admin = {}
    }
    if (!incomingConfig.admin?.components) {
      incomingConfig.admin.components = {
        actions: [],
        beforeNavLinks: [],
        providers: [],
      }
    }
    if (!incomingConfig.admin.components?.providers) {
      incomingConfig.admin.components.providers = []
    }
    if (!incomingConfig.admin.components?.actions) {
      incomingConfig.admin.components.actions = []
    }
    if (!incomingConfig.admin.components?.beforeNavLinks) {
      incomingConfig.admin.components.beforeNavLinks = []
    }
    if (!incomingConfig.collections) {
      incomingConfig.collections = []
    }

    /**
     * Add tenants array field to users collection
     */
    const adminUsersCollection = incomingConfig.collections.find(({ slug, auth }) => {
      if (incomingConfig.admin?.user) {
        return slug === incomingConfig.admin.user
      } else if (auth) {
        return true
      }
    })

    if (!adminUsersCollection) {
      throw Error('An auth enabled collection was not found')
    }

    /**
     * Add tenants array field to users collection
     */
    if (pluginConfig?.tenantsArrayField?.includeDefaultField !== false) {
      adminUsersCollection.fields.push(
        tenantsArrayField({
          ...(pluginConfig?.tenantsArrayField || {}),
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
        }),
      )
    }

    addCollectionAccess({
      accessResultCallback: pluginConfig.usersAccessResultOverride,
      adminUsersSlug: adminUsersCollection.slug,
      collection: adminUsersCollection,
      fieldName: `${tenantsArrayFieldName}.${tenantsArrayTenantFieldName}`,
      tenantsArrayFieldName,
      tenantsArrayTenantFieldName,
      userHasAccessToAllTenants,
    })

    if (pluginConfig.useUsersTenantFilter !== false) {
      if (!adminUsersCollection.admin) {
        adminUsersCollection.admin = {}
      }

      const baseFilter =
        adminUsersCollection.admin?.baseFilter ?? adminUsersCollection.admin?.baseListFilter
      adminUsersCollection.admin.baseFilter = combineFilters({
        baseFilter,
        customFilter: (args) =>
          filterDocumentsByTenants<ConfigType>({
            filterFieldName: `${tenantsArrayFieldName}.${tenantsArrayTenantFieldName}`,
            req: args.req,
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            tenantsCollectionSlug,
            userHasAccessToAllTenants,
          }),
      })
    }

    let tenantCollection: CollectionConfig | undefined

    const [collectionSlugs, globalCollectionSlugs] = Object.keys(pluginConfig.collections).reduce<
      [string[], string[]]
    >(
      (acc, slug) => {
        if (pluginConfig?.collections?.[slug]?.isGlobal) {
          acc[1].push(slug)
        } else {
          acc[0].push(slug)
        }

        return acc
      },
      [[], []],
    )

    // used to track and not duplicate filterOptions on referenced blocks
    const blockReferencesWithFilters: string[] = []

    // used to validate enabled collection slugs
    const multiTenantCollectionsFound: string[] = []

    /**
     * The folders collection is added AFTER the plugin is initialized
     * so if they added the folder slug to the plugin collections,
     * we can assume that they have folders enabled
     */
    const foldersSlug = incomingConfig.folders
      ? incomingConfig.folders.slug || 'payload-folders'
      : 'payload-folders'

    if (collectionSlugs.includes(foldersSlug)) {
      multiTenantCollectionsFound.push(foldersSlug)
      incomingConfig.folders = incomingConfig.folders || {}
      incomingConfig.folders.collectionOverrides = incomingConfig.folders.collectionOverrides || []
      incomingConfig.folders.collectionOverrides.push(({ collection }) => {
        /**
         * Add filter options to all relationship fields
         */
        collection.fields = addFilterOptionsToFields({
          blockReferencesWithFilters,
          config: incomingConfig,
          fields: collection.fields,
          tenantEnabledCollectionSlugs: collectionSlugs,
          tenantEnabledGlobalSlugs: globalCollectionSlugs,
          tenantFieldName,
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
          userHasAccessToAllTenants,
        })

        if (pluginConfig.collections[foldersSlug]?.customTenantField !== true) {
          /**
           * Add tenant field to enabled collections
           */
          collection.fields.unshift(
            tenantField({
              name: tenantFieldName,
              debug: pluginConfig.debug,
              isAutosaveEnabled: hasAutosaveEnabled(collection),
              overrides: pluginConfig.collections[collection.slug]?.tenantFieldOverrides
                ? pluginConfig.collections[collection.slug]?.tenantFieldOverrides
                : pluginConfig.tenantField || {},
              tenantsArrayFieldName,
              tenantsArrayTenantFieldName,
              tenantsCollectionSlug,
              unique: false,
            }),
          )
        }

        const { useBaseFilter, useBaseListFilter } = pluginConfig.collections[collection.slug] || {}
        if (useBaseFilter ?? useBaseListFilter ?? true) {
          /**
           * Add list filter to enabled collections
           * - filters results by selected tenant
           */
          collection.admin = collection.admin || {}
          collection.admin.baseFilter = combineFilters({
            baseFilter: collection.admin?.baseFilter ?? collection.admin?.baseListFilter,
            customFilter: (args) =>
              filterDocumentsByTenants<ConfigType>({
                filterFieldName: tenantFieldName,
                req: args.req,
                tenantsArrayFieldName,
                tenantsArrayTenantFieldName,
                tenantsCollectionSlug,
                userHasAccessToAllTenants,
              }),
          })
        }

        if (pluginConfig.collections[foldersSlug]?.useTenantAccess !== false) {
          /**
           * Add access control constraint to tenant enabled folders collection
           */
          addCollectionAccess({
            accessResultCallback: pluginConfig.collections[foldersSlug]?.accessResultOverride,
            adminUsersSlug: adminUsersCollection.slug,
            collection,
            fieldName: tenantFieldName,
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            userHasAccessToAllTenants,
          })
        }

        return collection
      })
    }

    /**
     * Modify collections
     */
    incomingConfig.collections.forEach((collection) => {
      /**
       * Modify tenants collection
       */
      if (collection.slug === tenantsCollectionSlug) {
        tenantCollection = collection

        if (pluginConfig.useTenantsCollectionAccess !== false) {
          /**
           * Add access control constraint to tenants collection
           * - constrains access a users assigned tenants
           */
          addCollectionAccess({
            adminUsersSlug: adminUsersCollection.slug,
            collection,
            fieldName: 'id',
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            userHasAccessToAllTenants,
          })
        }

        if (pluginConfig.useTenantsListFilter !== false) {
          /**
           * Add list filter to tenants collection
           * - filter by selected tenant
           */
          if (!collection.admin) {
            collection.admin = {}
          }

          const baseFilter = collection.admin?.baseFilter ?? collection.admin?.baseListFilter
          collection.admin.baseFilter = combineFilters({
            baseFilter,
            customFilter: (args) =>
              filterDocumentsByTenants({
                filterFieldName: 'id',
                req: args.req,
                tenantsArrayFieldName,
                tenantsArrayTenantFieldName,
                tenantsCollectionSlug,
                userHasAccessToAllTenants,
              }),
          })
        }

        if (pluginConfig.cleanupAfterTenantDelete !== false) {
          /**
           * Add cleanup logic when tenant is deleted
           * - delete documents related to tenant
           * - remove tenant from users
           */
          addTenantCleanup({
            collection,
            enabledSlugs: [...collectionSlugs, ...globalCollectionSlugs],
            tenantFieldName,
            tenantsCollectionSlug,
            usersSlug: adminUsersCollection.slug,
            usersTenantsArrayFieldName: tenantsArrayFieldName,
            usersTenantsArrayTenantFieldName: tenantsArrayTenantFieldName,
          })
        }

        /**
         * Add custom tenant field that watches and dispatches updates to the selector
         */
        collection.fields.push({
          name: '_watchTenant',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: '@payloadcms/plugin-multi-tenant/client#WatchTenantCollection',
              },
            },
            disableBulkEdit: true,
            disableListColumn: true,
          },
        })

        collection.endpoints = [
          ...(collection.endpoints || []),
          getTenantOptionsEndpoint({
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            tenantsCollectionSlug,
            useAsTitle: tenantCollection.admin?.useAsTitle || 'id',
            userHasAccessToAllTenants,
          }),
        ]
      } else if (pluginConfig.collections?.[collection.slug]) {
        multiTenantCollectionsFound.push(collection.slug)
        const isGlobal = Boolean(pluginConfig.collections[collection.slug]?.isGlobal)

        if (isGlobal) {
          collection.disableDuplicate = true
        }

        if (!pluginConfig.debug && !isGlobal) {
          collection.admin ??= {}
          collection.admin.components ??= {}
          collection.admin.components.edit ??= {}
          collection.admin.components.edit.editMenuItems ??= []
          collection.admin.components.edit.editMenuItems.push({
            path: '@payloadcms/plugin-multi-tenant/client#AssignTenantFieldTrigger',
          })
        }

        /**
         * Add filter options to all relationship fields
         */
        collection.fields = addFilterOptionsToFields({
          blockReferencesWithFilters,
          config: incomingConfig,
          fields: collection.fields,
          tenantEnabledCollectionSlugs: collectionSlugs,
          tenantEnabledGlobalSlugs: globalCollectionSlugs,
          tenantFieldName,
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
          userHasAccessToAllTenants,
        })

        if (pluginConfig.collections[collection.slug]?.customTenantField !== true) {
          /**
           * Add tenant field to enabled collections
           */
          collection.fields.unshift(
            tenantField({
              name: tenantFieldName,
              debug: pluginConfig.debug,
              isAutosaveEnabled: hasAutosaveEnabled(collection),
              overrides: pluginConfig.collections[collection.slug]?.tenantFieldOverrides
                ? pluginConfig.collections[collection.slug]?.tenantFieldOverrides
                : pluginConfig.tenantField || {},
              tenantsArrayFieldName,
              tenantsArrayTenantFieldName,
              tenantsCollectionSlug,
              unique: isGlobal,
            }),
          )
        }

        const { useBaseFilter, useBaseListFilter } = pluginConfig.collections[collection.slug] || {}
        if (useBaseFilter ?? useBaseListFilter ?? true) {
          /**
           * Add list filter to enabled collections
           * - filters results by selected tenant
           */
          collection.admin = collection.admin || {}
          collection.admin.baseFilter = combineFilters({
            baseFilter: collection.admin?.baseFilter ?? collection.admin?.baseListFilter,
            customFilter: (args) =>
              filterDocumentsByTenants({
                filterFieldName: tenantFieldName,
                req: args.req,
                tenantsArrayFieldName,
                tenantsArrayTenantFieldName,
                tenantsCollectionSlug,
                userHasAccessToAllTenants,
              }),
          })
        }

        if (pluginConfig.collections[collection.slug]?.useTenantAccess !== false) {
          /**
           * Add access control constraint to tenant enabled collection
           */
          addCollectionAccess({
            accessResultCallback: pluginConfig.collections[collection.slug]?.accessResultOverride,
            adminUsersSlug: adminUsersCollection.slug,
            collection,
            fieldName: tenantFieldName,
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            userHasAccessToAllTenants,
          })
        }
      }
    })

    if (!tenantCollection) {
      throw new Error(`Tenants collection not found with slug: ${tenantsCollectionSlug}`)
    }

    if (
      multiTenantCollectionsFound.length !==
      collectionSlugs.length + globalCollectionSlugs.length
    ) {
      const missingSlugs = [...collectionSlugs, ...globalCollectionSlugs].filter(
        (slug) => !multiTenantCollectionsFound.includes(slug),
      )
      // eslint-disable-next-line no-console
      console.error(
        miniChalk.yellowBold('WARNING (plugin-multi-tenant)'),
        'missing collections',
        missingSlugs,
        'try placing the multi-tenant plugin after other plugins.',
      )
    }

    /**
     * Add TenantSelectionProvider to admin providers
     */
    incomingConfig.admin.components.providers.push({
      clientProps: {
        tenantsArrayFieldName,
        tenantsArrayTenantFieldName,
        tenantsCollectionSlug: tenantCollection.slug,
        useAsTitle: tenantCollection.admin?.useAsTitle || 'id',
        userHasAccessToAllTenants,
      },
      path: '@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider',
    })

    /**
     * Add global redirect action
     */
    if (globalCollectionSlugs.length) {
      incomingConfig.admin.components.actions.push({
        path: '@payloadcms/plugin-multi-tenant/rsc#GlobalViewRedirect',
        serverProps: {
          basePath,
          globalSlugs: globalCollectionSlugs,
          tenantFieldName,
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
          useAsTitle: tenantCollection.admin?.useAsTitle || 'id',
          userHasAccessToAllTenants,
        },
      })
    }

    /**
     * Add tenant selector to admin UI
     */
    incomingConfig.admin.components.beforeNavLinks.push({
      clientProps: {
        enabledSlugs: [
          ...collectionSlugs,
          ...globalCollectionSlugs,
          adminUsersCollection.slug,
          tenantCollection.slug,
        ],
        label: pluginConfig.tenantSelectorLabel || undefined,
      },
      path: '@payloadcms/plugin-multi-tenant/rsc#TenantSelector',
    })

    /**
     * Merge plugin translations
     */
    if (!incomingConfig.i18n) {
      incomingConfig.i18n = {}
    }
    Object.entries(translations).forEach(([locale, pluginI18nObject]) => {
      const typedLocale = locale as AcceptedLanguages
      if (!incomingConfig.i18n!.translations) {
        incomingConfig.i18n!.translations = {}
      }
      if (!(typedLocale in incomingConfig.i18n!.translations)) {
        incomingConfig.i18n!.translations[typedLocale] = {}
      }
      if (!('plugin-multi-tenant' in incomingConfig.i18n!.translations[typedLocale]!)) {
        ;(incomingConfig.i18n!.translations[typedLocale] as PluginDefaultTranslationsObject)[
          'plugin-multi-tenant'
        ] = {} as PluginDefaultTranslationsObject['plugin-multi-tenant']
      }

      ;(incomingConfig.i18n!.translations[typedLocale] as PluginDefaultTranslationsObject)[
        'plugin-multi-tenant'
      ] = {
        ...pluginI18nObject.translations['plugin-multi-tenant'],
        ...(pluginConfig.i18n?.translations?.[typedLocale] || {}),
      }
    })

    return incomingConfig
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/types.ts

```typescript
import type { AcceptedLanguages } from '@payloadcms/translations'
import type {
  AccessArgs,
  AccessResult,
  ArrayField,
  CollectionConfig,
  CollectionSlug,
  Field,
  RelationshipField,
  SingleRelationshipField,
  TypedUser,
} from 'payload'

export type MultiTenantPluginConfig<ConfigTypes = unknown> = {
  /**
   * Base path for your application
   *
   * https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
   *
   * @default undefined
   */
  basePath?: string
  /**
   * After a tenant is deleted, the plugin will attempt to clean up related documents
   * - removing documents with the tenant ID
   * - removing the tenant from users
   *
   * @default true
   */
  cleanupAfterTenantDelete?: boolean
  /**
   * Automatically
   */
  collections: {
    [key in CollectionSlug]?: {
      /**
       * Override the access result from the collection access control functions
       *
       * The function receives:
       *  - accessResult: the original result from the access control function
       *  - accessKey: 'read', 'create', 'update', 'delete', 'readVersions', or 'unlock'
       *  - ...restOfAccessArgs: the original arguments passed to the access control function
       */
      accessResultOverride?: CollectionAccessResultOverride
      /**
       * Opt out of adding the tenant field and place
       * it manually using the `tenantField` export from the plugin
       */
      customTenantField?: boolean
      /**
       * Set to `true` if you want the collection to behave as a global
       *
       * @default false
       */
      isGlobal?: boolean
      /**
       * Overrides for the tenant field, will override the entire tenantField configuration
       */
      tenantFieldOverrides?: CollectionTenantFieldConfigOverrides
      /**
       * Set to `false` if you want to manually apply the baseListFilter
       * Set to `false` if you want to manually apply the baseFilter
       *
       * @default true
       */
      useBaseFilter?: boolean
      /**
       * @deprecated Use `useBaseFilter` instead. If both are defined,
       * `useBaseFilter` will take precedence. This property remains only
       * for backward compatibility and may be removed in a future version.
       *
       * Originally, `baseListFilter` was intended to filter only the List View
       * in the admin panel. However, base filtering is often required in other areas
       * such as internal link relationships in the Lexical editor.
       *
       * @default true
       */
      useBaseListFilter?: boolean
      /**
       * Set to `false` if you want to handle collection access manually without the multi-tenant constraints applied
       *
       * @default true
       */
      useTenantAccess?: boolean
    }
  }
  /**
   * Enables debug mode
   * - Makes the tenant field visible in the admin UI within applicable collections
   *
   * @default false
   */
  debug?: boolean
  /**
   * Enables the multi-tenant plugin
   *
   * @default true
   */
  enabled?: boolean
  /**
   * Localization for the plugin
   */
  i18n?: {
    translations: {
      [key in AcceptedLanguages]?: {
        /**
         * Shown inside 3 dot menu on edit document view
         *
         * @default 'Assign Tenant'
         */
        'assign-tenant-button-label'?: string
        /**
         * Shown as the title of the assign tenant modal
         *
         * @default 'Assign "{{title}}"'
         */
        'assign-tenant-modal-title'?: string
        /**
         * Shown as the label for the assigned tenant field in the assign tenant modal
         *
         * @default 'Assigned Tenant'
         */
        'field-assignedTenant-label'?: string
        /**
         * Shown as the label for the global tenant selector in the admin UI
         *
         * @default 'Filter by Tenant'
         */
        'nav-tenantSelector-label'?: string
      }
    }
  }
  /**
   * Field configuration for the field added to all tenant enabled collections
   */
  tenantField?: RootTenantFieldConfigOverrides
  /**
   * Field configuration for the field added to the users collection
   *
   * If `includeDefaultField` is `false`, you must include the field on your users collection manually
   * This is useful if you want to customize the field or place the field in a specific location
   */
  tenantsArrayField?:
    | {
        /**
         * Access configuration for the array field
         */
        arrayFieldAccess?: ArrayField['access']
        /**
         * Name of the array field
         *
         * @default 'tenants'
         */
        arrayFieldName?: string
        /**
         * Name of the tenant field
         *
         * @default 'tenant'
         */
        arrayTenantFieldName?: string
        /**
         * When `includeDefaultField` is `true`, the field will be added to the users collection automatically
         */
        includeDefaultField?: true
        /**
         * Additional fields to include on the tenants array field
         */
        rowFields?: Field[]
        /**
         * Access configuration for the tenant field
         */
        tenantFieldAccess?: RelationshipField['access']
      }
    | {
        arrayFieldAccess?: never
        arrayFieldName?: string
        arrayTenantFieldName?: string
        /**
         * When `includeDefaultField` is `false`, you must include the field on your users collection manually
         */
        includeDefaultField?: false
        rowFields?: never
        tenantFieldAccess?: never
      }
  /**
   * Customize tenant selector label
   *
   * Either a string or an object where the keys are i18n codes and the values are the string labels
   *
   * @deprecated Use `i18n.translations` instead.
   */
  tenantSelectorLabel?:
    | Partial<{
        [key in AcceptedLanguages]?: string
      }>
    | string
  /**
   * The slug for the tenant collection
   *
   * @default 'tenants'
   */
  tenantsSlug?: string
  /**
   * Function that determines if a user has access to _all_ tenants
   *
   * Useful for super-admin type users
   */
  userHasAccessToAllTenants?: (
    user: ConfigTypes extends { user: unknown } ? ConfigTypes['user'] : TypedUser,
  ) => boolean
  /**
   * Override the access result on the users collection access control functions
   *
   * The function receives:
   *  - accessResult: the original result from the access control function
   *  - accessKey: 'read', 'create', 'update', 'delete', 'readVersions', or 'unlock'
   *  - ...restOfAccessArgs: the original arguments passed to the access control function
   */
  usersAccessResultOverride?: CollectionAccessResultOverride
  /**
   * Opt out of adding access constraints to the tenants collection
   */
  useTenantsCollectionAccess?: boolean
  /**
   * Opt out including the baseListFilter to filter tenants by selected tenant
   */
  useTenantsListFilter?: boolean

  /**
   * Opt out including the baseListFilter to filter users by selected tenant
   */
  useUsersTenantFilter?: boolean
}

export type RootTenantFieldConfigOverrides = Partial<
  Omit<
    SingleRelationshipField,
    | '_sanitized'
    | 'hidden'
    | 'index'
    | 'localized'
    | 'max'
    | 'maxRows'
    | 'min'
    | 'minRows'
    | 'relationTo'
    | 'required'
    | 'type'
    | 'unique'
    | 'virtual'
  >
>

export type CollectionTenantFieldConfigOverrides = Partial<
  Omit<RootTenantFieldConfigOverrides, 'name'>
>

export type Tenant<IDType = number | string> = {
  id: IDType
  name: string
}

export type UserWithTenantsField = {
  tenants?:
    | {
        tenant: number | string | Tenant
      }[]
    | null
} & TypedUser

type AllAccessKeysT<T extends readonly string[]> = T[number] extends keyof Omit<
  Required<CollectionConfig>['access'],
  'admin'
>
  ? keyof Omit<Required<CollectionConfig>['access'], 'admin'> extends T[number]
    ? T
    : never
  : never

export type AllAccessKeys = AllAccessKeysT<
  ['create', 'read', 'update', 'delete', 'readVersions', 'unlock']
>

export type CollectionAccessResultOverride = ({
  accessKey,
  accessResult,
}: {
  accessKey: AllAccessKeys[number]
  accessResult: AccessResult
} & AccessArgs) => AccessResult | Promise<AccessResult>
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/components/AssignTenantFieldModal/index.client.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  Modal,
  Pill,
  PopupList,
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useModal,
  useTranslation,
} from '@payloadcms/ui'
import { drawerZBase, useDrawerDepth } from '@payloadcms/ui/elements/Drawer'
import React from 'react'

import type {
  PluginMultiTenantTranslationKeys,
  PluginMultiTenantTranslations,
} from '../../translations/index.js'

import { useTenantSelection } from '../../providers/TenantSelectionProvider/index.client.js'
import './index.scss'

export const assignTenantModalSlug = 'assign-tenant-field-modal'
const baseClass = 'assign-tenant-field-modal'

export const AssignTenantFieldTrigger: React.FC = () => {
  const { openModal } = useModal()
  const { t } = useTranslation<PluginMultiTenantTranslations, PluginMultiTenantTranslationKeys>()
  const { options } = useTenantSelection()

  if (options.length <= 1) {
    return null
  }

  return (
    <>
      <PopupList.Button onClick={() => openModal(assignTenantModalSlug)}>
        {t('plugin-multi-tenant:assign-tenant-button-label')}
      </PopupList.Button>
    </>
  )
}

export const AssignTenantFieldModal: React.FC<{
  afterModalClose: () => void
  afterModalOpen: () => void
  children: React.ReactNode
  onCancel?: () => void
  onConfirm?: () => void
}> = ({ afterModalClose, afterModalOpen, children, onCancel, onConfirm }) => {
  const editDepth = useDrawerDepth()
  const { i18n, t } = useTranslation<
    PluginMultiTenantTranslations,
    PluginMultiTenantTranslationKeys
  >()
  const { collectionSlug } = useDocumentInfo()
  const { title } = useDocumentTitle()
  const { getEntityConfig } = useConfig()
  const collectionConfig = getEntityConfig({ collectionSlug }) as ClientCollectionConfig
  const { closeModal, isModalOpen: isModalOpenFn } = useModal()
  const isModalOpen = isModalOpenFn(assignTenantModalSlug)
  const wasModalOpenRef = React.useRef<boolean>(isModalOpen)

  const onModalConfirm = React.useCallback(() => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal(assignTenantModalSlug)
  }, [onConfirm, closeModal])

  const onModalCancel = React.useCallback(() => {
    if (typeof onCancel === 'function') {
      onCancel()
    }
    closeModal(assignTenantModalSlug)
  }, [onCancel, closeModal])

  React.useEffect(() => {
    if (wasModalOpenRef.current && !isModalOpen) {
      // modal was open, and now is closed
      if (typeof afterModalClose === 'function') {
        afterModalClose()
      }
    }

    if (!wasModalOpenRef.current && isModalOpen) {
      // modal was closed, and now is open
      if (typeof afterModalOpen === 'function') {
        afterModalOpen()
      }
    }
    wasModalOpenRef.current = isModalOpen
  }, [isModalOpen, onCancel, afterModalClose, afterModalOpen])

  if (!collectionConfig) {
    return null
  }

  return (
    <Modal
      className={baseClass}
      slug={assignTenantModalSlug}
      style={{
        zIndex: drawerZBase + editDepth,
      }}
    >
      <div className={`${baseClass}__bg`} />
      <div className={`${baseClass}__wrapper`}>
        <div className={`${baseClass}__header`}>
          <h3>
            {t('plugin-multi-tenant:assign-tenant-modal-title', {
              title,
            })}
          </h3>
          <Pill className={`${baseClass}__collection-pill`} size="small">
            {getTranslation(collectionConfig.labels.singular, i18n)}
          </Pill>
        </div>
        <div className={`${baseClass}__content`}>{children}</div>
        <div className={`${baseClass}__actions`}>
          <Button buttonStyle="secondary" margin={false} onClick={onModalCancel}>
            {t('general:cancel')}
          </Button>
          <Button margin={false} onClick={onModalConfirm}>
            {t('general:confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-multi-tenant/src/components/AssignTenantFieldModal/index.scss

```text
@layer payload-default {
  .assign-tenant-field-modal {
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &[open] {
      pointer-events: auto;

      .assign-tenant-field-modal__wrapper {
        display: flex;
      }
    }

    &__bg {
      z-index: -1;

      &:before {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: var(--theme-bg);
        opacity: 0.8;
      }
    }

    &__wrapper {
      z-index: 1;
      position: relative;
      display: none;
      flex-direction: column;
      max-width: calc(var(--base) * 30);
      min-width: min(500px, calc(100% - (var(--base) * 2)));
      border-radius: var(--style-radius-m);
      border: 1px solid var(--theme-elevation-100);
      background-color: var(--theme-bg);
      justify-content: center;
    }

    &__header {
      padding: calc(var(--base) * 0.75) var(--base);
      border-bottom: 1px solid var(--theme-elevation-100);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: calc(var(--base) * 2);
    }

    &__collection-pill {
      align-self: flex-start;
      flex-shrink: 0;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: calc(var(--base) * 0.5);
      padding: var(--base) var(--base) 0 var(--base);
    }

    &__controls {
      display: flex;
      gap: calc(var(--base) * 0.5);
    }

    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: calc(var(--base) * 0.4);
      padding: var(--base);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/components/GlobalViewRedirect/index.ts
Signals: Next.js

```typescript
import type { CollectionSlug, ServerProps, ViewTypes } from 'payload'

import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

import type { MultiTenantPluginConfig } from '../../types.js'

import { getGlobalViewRedirect } from '../../utilities/getGlobalViewRedirect.js'

type Args = {
  basePath?: string
  collectionSlug: CollectionSlug
  docID?: number | string
  globalSlugs: string[]
  tenantArrayFieldName: string
  tenantArrayTenantFieldName: string
  tenantFieldName: string
  tenantsCollectionSlug: string
  useAsTitle: string
  userHasAccessToAllTenants: Required<MultiTenantPluginConfig<any>>['userHasAccessToAllTenants']
  viewType: ViewTypes
} & ServerProps

export const GlobalViewRedirect = async (args: Args) => {
  const collectionSlug = args?.collectionSlug
  if (collectionSlug && args.globalSlugs?.includes(collectionSlug)) {
    const headers = await getHeaders()
    const redirectRoute = await getGlobalViewRedirect({
      slug: collectionSlug,
      basePath: args.basePath,
      docID: args.docID,
      headers,
      payload: args.payload,
      tenantFieldName: args.tenantFieldName,
      tenantsArrayFieldName: args.tenantArrayFieldName,
      tenantsArrayTenantFieldName: args.tenantArrayTenantFieldName,
      tenantsCollectionSlug: args.tenantsCollectionSlug,
      useAsTitle: args.useAsTitle,
      user: args.user,
      userHasAccessToAllTenants: args.userHasAccessToAllTenants,
      view: args.viewType,
    })

    if (redirectRoute) {
      redirect(redirectRoute)
    }
  }
}
```

--------------------------------------------------------------------------------

````
