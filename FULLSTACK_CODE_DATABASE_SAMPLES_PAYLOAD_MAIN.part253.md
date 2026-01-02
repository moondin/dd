---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 253
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 253 of 695)

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

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/components/TenantField/index.client.tsx
Signals: React

```typescript
'use client'

import type { RelationshipFieldClientProps } from 'payload'

import {
  Pill,
  RelationshipField,
  useDocumentInfo,
  useField,
  useForm,
  useFormModified,
  useModal,
} from '@payloadcms/ui'
import React from 'react'

import { useTenantSelection } from '../../providers/TenantSelectionProvider/index.client.js'
import {
  AssignTenantFieldModal,
  assignTenantModalSlug,
} from '../AssignTenantFieldModal/index.client.js'
import './index.scss'

const baseClass = 'tenantField'

type Props = {
  debug?: boolean
  unique?: boolean
} & RelationshipFieldClientProps

export const TenantField = ({ debug, unique, ...fieldArgs }: Props) => {
  const { entityType, options, selectedTenantID, setEntityType, setTenant } = useTenantSelection()
  const { setValue, showError, value } = useField<(number | string)[] | (number | string)>()
  const modified = useFormModified()
  const { isValid: isFormValid, setModified } = useForm()
  const { id: docID } = useDocumentInfo()
  const { openModal } = useModal()
  const isConfirmingRef = React.useRef<boolean>(false)
  const prevModified = React.useRef(modified)
  const prevValue = React.useRef<typeof value>(value)
  const showField =
    (options.length > 1 && !fieldArgs.field.admin?.hidden && !fieldArgs.field.hidden) || debug

  const onConfirm = React.useCallback(() => {
    isConfirmingRef.current = true
  }, [])

  const afterModalOpen = React.useCallback(() => {
    prevModified.current = modified
    prevValue.current = value
  }, [modified, value])

  const afterModalClose = React.useCallback(() => {
    let didChange = true
    if (isConfirmingRef.current) {
      // did the values actually change?
      if (fieldArgs.field.hasMany) {
        const prev = (prevValue.current || []) as (number | string)[]
        const newValue = (value || []) as (number | string)[]
        if (prev.length !== newValue.length) {
          didChange = true
        } else {
          const allMatch = newValue.every((val) => prev.includes(val))
          if (allMatch) {
            didChange = false
          }
        }
      } else if (value === prevValue.current) {
        didChange = false
      }

      if (didChange) {
        prevModified.current = true
        prevValue.current = value
      }
    }

    setValue(prevValue.current, true)
    setModified(prevModified.current)

    isConfirmingRef.current = false
  }, [setValue, setModified, value, fieldArgs.field.hasMany])

  React.useEffect(() => {
    if (!entityType) {
      setEntityType(unique ? 'global' : 'document')
    } else {
      // unique documents are controlled from the global TenantSelector
      if (!unique && value) {
        if (Array.isArray(value)) {
          if (value.length) {
            if (!selectedTenantID) {
              setTenant({ id: value[0], refresh: false })
            } else if (!value.includes(selectedTenantID)) {
              setTenant({ id: value[0], refresh: false })
            }
          }
        } else if (selectedTenantID !== value) {
          setTenant({ id: value, refresh: false })
        }
      }
    }

    return () => {
      if (entityType) {
        setEntityType(undefined)
      }
    }
  }, [unique, options, selectedTenantID, setTenant, value, setEntityType, entityType])

  React.useEffect(() => {
    if (unique) {
      return
    }
    if ((!isFormValid && showError && showField) || (!value && !selectedTenantID)) {
      openModal(assignTenantModalSlug)
    }
  }, [isFormValid, showError, showField, openModal, value, docID, selectedTenantID, unique])

  if (showField) {
    if (debug) {
      return <TenantFieldInModal debug={debug} fieldArgs={fieldArgs} unique={unique} />
    }

    if (!unique) {
      /** Editing a non-global tenant document */
      return (
        <AssignTenantFieldModal
          afterModalClose={afterModalClose}
          afterModalOpen={afterModalOpen}
          onConfirm={onConfirm}
        >
          <TenantFieldInModal
            debug={debug}
            fieldArgs={{
              ...fieldArgs,
              field: {
                ...fieldArgs.field,
              },
            }}
            unique={unique}
          />
        </AssignTenantFieldModal>
      )
    }

    return <SyncFormModified />
  }

  return null
}

const TenantFieldInModal: React.FC<{
  debug?: boolean
  fieldArgs: RelationshipFieldClientProps
  unique?: boolean
}> = ({ debug, fieldArgs, unique }) => {
  return (
    <div className={baseClass}>
      <div className={`${baseClass}__wrapper`}>
        {debug && (
          <Pill className={`${baseClass}__debug-pill`} pillStyle="success" size="small">
            Multi-Tenant Debug Enabled
          </Pill>
        )}
        <RelationshipField
          {...fieldArgs}
          field={{
            ...fieldArgs.field,
            required: true,
          }}
          readOnly={fieldArgs.readOnly || fieldArgs.field.admin?.readOnly || unique}
        />
      </div>
    </div>
  )
}

/**
 * Tells the global selector when the form has been modified
 * so it can display the "Leave without saving" confirmation modal
 * if modified and attempting to change the tenant
 */
const SyncFormModified = () => {
  const modified = useFormModified()
  const { setModified } = useTenantSelection()

  React.useEffect(() => {
    setModified(modified)
  }, [modified, setModified])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-multi-tenant/src/components/TenantField/index.scss

```text
.document-fields__main {
  --tenant-gutter-h-right: var(--main-gutter-h-right);
  --tenant-gutter-h-left: var(--main-gutter-h-left);
}
.document-fields__sidebar-fields {
  --tenant-gutter-h-right: var(--sidebar-gutter-h-right);
  --tenant-gutter-h-left: var(--sidebar-gutter-h-left);
}
.document-fields__sidebar-fields,
.document-fields__main {
  .render-fields {
    .tenantField {
      width: calc(100% + var(--tenant-gutter-h-right) + var(--tenant-gutter-h-left));
      margin-left: calc(-1 * var(--tenant-gutter-h-left));
      border-bottom: 1px solid var(--theme-elevation-100);
      padding-top: calc(var(--base) * 1);
      padding-bottom: calc(var(--base) * 1.75);

      &__wrapper {
        padding-left: var(--tenant-gutter-h-left);
        padding-right: var(--tenant-gutter-h-right);
      }

      [dir='rtl'] & {
        margin-right: calc(-1 * var(--tenant-gutter-h-right));
        background-image: repeating-linear-gradient(
          -120deg,
          var(--theme-elevation-50) 0px,
          var(--theme-elevation-50) 1px,
          transparent 1px,
          transparent 5px
        );
      }

      &:not(:first-child) {
        border-top: 1px solid var(--theme-elevation-100);
        margin-top: calc(var(--base) * 1.25);
      }
      &:not(:last-child) {
        margin-bottom: var(--spacing-field);
      }
      &:first-child {
        margin-top: calc(var(--base) * -1.5);
        padding-top: calc(var(--base) * 1.5);
      }

      &__debug-pill {
        margin-bottom: calc(var(--base) * 0.5);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/components/TenantSelector/index.client.tsx
Signals: React

```typescript
'use client'
import type { ReactSelectOption } from '@payloadcms/ui'
import type { ViewTypes } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { ConfirmationModal, SelectInput, useModal, useTranslation } from '@payloadcms/ui'
import React from 'react'

import type {
  PluginMultiTenantTranslationKeys,
  PluginMultiTenantTranslations,
} from '../../translations/index.js'
import type { MultiTenantPluginConfig } from '../../types.js'

import { useTenantSelection } from '../../providers/TenantSelectionProvider/index.client.js'
import './index.scss'

const confirmLeaveWithoutSavingSlug = 'confirm-leave-without-saving'

export const TenantSelectorClient = ({
  disabled: disabledFromProps,
  label,
  viewType,
}: {
  disabled?: boolean
  label?: MultiTenantPluginConfig['tenantSelectorLabel']
  viewType?: ViewTypes
}) => {
  const { entityType, modified, options, selectedTenantID, setTenant } = useTenantSelection()
  const { closeModal, openModal } = useModal()
  const { i18n, t } = useTranslation<
    PluginMultiTenantTranslations,
    PluginMultiTenantTranslationKeys
  >()
  const [tenantSelection, setTenantSelection] = React.useState<
    ReactSelectOption | ReactSelectOption[]
  >()

  const switchTenant = React.useCallback(
    (option: ReactSelectOption | ReactSelectOption[] | undefined) => {
      if (option && 'value' in option) {
        setTenant({ id: option.value as string, refresh: true })
      } else {
        setTenant({ id: undefined, refresh: true })
      }
    },
    [setTenant],
  )

  const onChange = React.useCallback(
    (option: ReactSelectOption | ReactSelectOption[]) => {
      if (option && 'value' in option && option.value === selectedTenantID) {
        // If the selected option is the same as the current tenant, do nothing
        return
      }

      if (entityType === 'global' && modified) {
        // If the entityType is 'global' and there are unsaved changes, prompt for confirmation
        setTenantSelection(option)
        openModal(confirmLeaveWithoutSavingSlug)
      } else {
        // If the entityType is not 'document', switch tenant without confirmation
        switchTenant(option)
      }
    },
    [selectedTenantID, entityType, modified, switchTenant, openModal],
  )

  if (options.length <= 1) {
    return null
  }

  return (
    <div className="tenant-selector">
      <SelectInput
        isClearable={viewType === 'list'}
        label={
          label ? getTranslation(label, i18n) : t('plugin-multi-tenant:nav-tenantSelector-label')
        }
        name="setTenant"
        onChange={onChange}
        options={options}
        path="setTenant"
        readOnly={
          disabledFromProps ||
          (entityType !== 'global' &&
            viewType &&
            (['document', 'version'] satisfies ViewTypes[] as ViewTypes[]).includes(viewType))
        }
        value={selectedTenantID as string | undefined}
      />

      <ConfirmationModal
        body={t('general:changesNotSaved')}
        cancelLabel={t('general:stayOnThisPage')}
        confirmLabel={t('general:leaveAnyway')}
        heading={t('general:leaveWithoutSaving')}
        modalSlug={confirmLeaveWithoutSavingSlug}
        onCancel={() => {
          closeModal(confirmLeaveWithoutSavingSlug)
        }}
        onConfirm={() => {
          switchTenant(tenantSelection)
        }}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/plugin-multi-tenant/src/components/TenantSelector/index.scss

```text
.tenant-selector {
  width: 100%;
  margin-bottom: 2rem;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/components/TenantSelector/index.tsx

```typescript
import type { ServerProps } from 'payload'

import type { MultiTenantPluginConfig } from '../../types.js'

import { TenantSelectorClient } from './index.client.js'

type Props = {
  enabledSlugs: string[]
  label: MultiTenantPluginConfig['tenantSelectorLabel']
} & ServerProps
export const TenantSelector = (props: Props) => {
  const { label, viewType } = props

  return <TenantSelectorClient label={label} viewType={viewType} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/components/WatchTenantCollection/index.tsx
Signals: React

```typescript
'use client'

import type { ClientCollectionConfig } from 'payload'

import {
  useConfig,
  useDocumentInfo,
  useDocumentTitle,
  useEffectEvent,
  useFormFields,
  useFormSubmitted,
  useOperation,
} from '@payloadcms/ui'
import React from 'react'

import { useTenantSelection } from '../../providers/TenantSelectionProvider/index.client.js'

export const WatchTenantCollection = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const operation = useOperation()
  const submitted = useFormSubmitted()
  const { title } = useDocumentTitle()

  const { getEntityConfig } = useConfig()
  const [useAsTitleName] = React.useState(
    () => (getEntityConfig({ collectionSlug }) as ClientCollectionConfig).admin.useAsTitle,
  )
  const titleField = useFormFields(([fields]) => (useAsTitleName ? fields[useAsTitleName] : {}))

  const { syncTenants, updateTenants } = useTenantSelection()

  const syncTenantTitle = useEffectEvent(() => {
    if (id) {
      updateTenants({ id, label: title })
    }
  })

  React.useEffect(() => {
    // only update the tenant selector when the document saves
    // → aka when initial value changes
    if (id && titleField?.initialValue) {
      void syncTenantTitle()
    }
  }, [id, titleField?.initialValue])

  React.useEffect(() => {
    if (operation === 'create' && submitted) {
      void syncTenants()
    }
  }, [operation, submitted, syncTenants, id])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: getTenantOptionsEndpoint.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/endpoints/getTenantOptionsEndpoint.ts

```typescript
import type { Endpoint } from 'payload'

import { APIError } from 'payload'

import type { MultiTenantPluginConfig } from '../types.js'

import { getTenantOptions } from '../utilities/getTenantOptions.js'

export const getTenantOptionsEndpoint = <ConfigType>({
  tenantsArrayFieldName,
  tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  useAsTitle,
  userHasAccessToAllTenants,
}: {
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  useAsTitle: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}): Endpoint => ({
  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      throw new APIError('Unauthorized', 401)
    }

    const tenantOptions = await getTenantOptions({
      payload,
      tenantsArrayFieldName,
      tenantsArrayTenantFieldName,
      tenantsCollectionSlug,
      useAsTitle,
      user,
      userHasAccessToAllTenants,
    })

    return new Response(JSON.stringify({ tenantOptions }))
  },
  method: 'get',
  path: '/populate-tenant-options',
})
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/exports/client.ts

```typescript
export { AssignTenantFieldTrigger } from '../components/AssignTenantFieldModal/index.client.js'
export { TenantField } from '../components/TenantField/index.client.js'
export { WatchTenantCollection } from '../components/WatchTenantCollection/index.js'
export { useTenantSelection } from '../providers/TenantSelectionProvider/index.client.js'
```

--------------------------------------------------------------------------------

---[FILE: fields.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/exports/fields.ts

```typescript
export { tenantField } from '../fields/tenantField/index.js'
export { tenantsArrayField } from '../fields/tenantsArrayField/index.js'
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/exports/rsc.ts

```typescript
export { GlobalViewRedirect } from '../components/GlobalViewRedirect/index.js'
export { TenantSelector } from '../components/TenantSelector/index.js'
export { TenantSelectionProvider } from '../providers/TenantSelectionProvider/index.js'
export { getGlobalViewRedirect } from '../utilities/getGlobalViewRedirect.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/exports/types.ts

```typescript
export type { MultiTenantPluginConfig } from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/exports/utilities.ts

```typescript
export { defaults } from '../defaults.js'
export { filterDocumentsByTenants as getTenantListFilter } from '../filters/filterDocumentsByTenants.js'
export { getTenantAccess } from '../utilities/getTenantAccess.js'
export { getTenantFromCookie } from '../utilities/getTenantFromCookie.js'
export { getUserTenantIDs } from '../utilities/getUserTenantIDs.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/fields/tenantField/index.ts

```typescript
import type { RelationshipFieldValidation, SingleRelationshipField } from 'payload'

import type { RootTenantFieldConfigOverrides } from '../../types.js'

import { defaults } from '../../defaults.js'
import { getCollectionIDType } from '../../utilities/getCollectionIDType.js'
import { getTenantFromCookie } from '../../utilities/getTenantFromCookie.js'
import { getUserTenantIDs } from '../../utilities/getUserTenantIDs.js'

const fieldValidation =
  (validateFunction?: RelationshipFieldValidation): RelationshipFieldValidation =>
  (value, options) => {
    if (validateFunction) {
      const result = validateFunction(value, options)
      if (result !== true) {
        return result
      }
    }

    if (options.hasMany) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return options.req.t('validation:required')
      }
    } else {
      if (!value) {
        return options.req.t('validation:required')
      }
    }

    return true
  }

type Args = {
  debug?: boolean
  isAutosaveEnabled?: boolean
  name: string
  overrides?: RootTenantFieldConfigOverrides
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  unique: boolean
}
export const tenantField = ({
  name = defaults.tenantFieldName,
  debug,
  isAutosaveEnabled,
  overrides: _overrides = {},
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  tenantsCollectionSlug = defaults.tenantCollectionSlug,
  unique,
}: Args): SingleRelationshipField => {
  const { hasMany = false, validate, ...overrides } = _overrides || {}
  return {
    ...(overrides || {}),
    name,
    type: 'relationship',
    access: overrides.access || {},
    admin: {
      allowCreate: false,
      allowEdit: false,
      disableGroupBy: true,
      disableListColumn: true,
      disableListFilter: true,
      position: 'sidebar',
      ...(overrides.admin || {}),
      components: {
        ...(overrides.admin?.components || {}),
        Field: {
          path: '@payloadcms/plugin-multi-tenant/client#TenantField',
          ...(typeof overrides.admin?.components?.Field !== 'string'
            ? overrides.admin?.components?.Field || {}
            : {}),
          clientProps: {
            ...(typeof overrides.admin?.components?.Field !== 'string'
              ? (overrides.admin?.components?.Field || {})?.clientProps
              : {}),
            debug,
            unique,
          },
        },
      },
    },
    defaultValue:
      overrides.defaultValue ||
      (async ({ req }) => {
        const idType = getCollectionIDType({
          collectionSlug: tenantsCollectionSlug,
          payload: req.payload,
        })
        const tenantFromCookie = getTenantFromCookie(req.headers, idType)
        if (tenantFromCookie) {
          const isValidTenant = await req.payload.count({
            collection: tenantsCollectionSlug,
            depth: 0,
            overrideAccess: false,
            req,
            user: req.user,
            where: {
              id: {
                in: [tenantFromCookie],
              },
            },
          })
          return isValidTenant ? tenantFromCookie : null
        }
        if (req.user && isAutosaveEnabled) {
          const userTenants = getUserTenantIDs(req.user, {
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
          })
          if (userTenants.length > 0) {
            return userTenants[0]
          }
        }
        return null
      }),
    filterOptions:
      overrides.filterOptions ||
      (({ req }) => {
        const userAssignedTenants = getUserTenantIDs(req.user, {
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
        })
        if (userAssignedTenants.length > 0) {
          return {
            id: {
              in: userAssignedTenants,
            },
          }
        }

        return true
      }),
    index: true,
    relationTo: tenantsCollectionSlug,
    unique,
    ...(hasMany
      ? {
          hasMany: true,
          // TODO: V4 - replace validation with required: true
          validate: fieldValidation(validate as RelationshipFieldValidation),
        }
      : {
          hasMany: false,
          // TODO: V4 - replace validation with required: true
          validate: fieldValidation(validate as RelationshipFieldValidation),
        }),
    // @ts-expect-error translations are not typed for this plugin
    label: overrides.label || (({ t }) => t('plugin-multi-tenant:field-assignedTenant-label')),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/fields/tenantsArrayField/index.ts

```typescript
import type { ArrayField, RelationshipField } from 'payload'

import { defaults } from '../../defaults.js'

type Args = {
  /**
   * Access configuration for the array field
   */
  arrayFieldAccess?: ArrayField['access']
  /**
   * Additional fields to include on the tenant array rows
   */
  rowFields?: ArrayField['fields']
  /**
   * Access configuration for the tenant field
   */
  tenantFieldAccess?: RelationshipField['access']
  /**
   * The name of the array field that holds the tenants
   *
   * @default 'tenants'
   */
  tenantsArrayFieldName?: ArrayField['name']
  /**
   * The name of the field that will be used to store the tenant relationship in the array
   *
   * @default 'tenant'
   */
  tenantsArrayTenantFieldName?: RelationshipField['name']
  /**
   * The slug for the tenant collection
   *
   * @default 'tenants'
   */
  tenantsCollectionSlug?: string
}
export const tenantsArrayField = ({
  arrayFieldAccess,
  rowFields,
  tenantFieldAccess,
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  tenantsCollectionSlug = defaults.tenantCollectionSlug,
}: Args): ArrayField => ({
  name: tenantsArrayFieldName,
  type: 'array',
  access: arrayFieldAccess,
  fields: [
    {
      name: tenantsArrayTenantFieldName,
      type: 'relationship',
      access: tenantFieldAccess,
      index: true,
      relationTo: tenantsCollectionSlug,
      required: true,
      saveToJWT: true,
    },
    ...(rowFields || []),
  ],
  saveToJWT: true,
})
```

--------------------------------------------------------------------------------

---[FILE: filterDocumentsByTenants.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/filters/filterDocumentsByTenants.ts

```typescript
import type { PayloadRequest, TypedUser, Where } from 'payload'

import type { MultiTenantPluginConfig } from '../types.js'

import { defaults } from '../defaults.js'
import { getCollectionIDType } from '../utilities/getCollectionIDType.js'
import { getTenantFromCookie } from '../utilities/getTenantFromCookie.js'
import { getUserTenantIDs } from '../utilities/getUserTenantIDs.js'

type Args<ConfigType = unknown> = {
  /**
   * If the document this filter is run belongs to a tenant, the tenant ID should be passed here.
   * If set, this will be used instead of the tenant cookie
   */
  docTenantID?: number | string
  filterFieldName: string
  req: PayloadRequest
  tenantsArrayFieldName?: string
  tenantsArrayTenantFieldName?: string
  tenantsCollectionSlug: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}
export const filterDocumentsByTenants = <ConfigType = unknown>({
  docTenantID,
  filterFieldName,
  req,
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  userHasAccessToAllTenants,
}: Args<ConfigType>): null | Where => {
  const idType = getCollectionIDType({
    collectionSlug: tenantsCollectionSlug,
    payload: req.payload,
  })

  // scope results to selected tenant
  const selectedTenant = docTenantID ?? getTenantFromCookie(req.headers, idType)
  if (selectedTenant) {
    return {
      [filterFieldName]: {
        in: [selectedTenant],
      },
    }
  }

  if (
    req.user &&
    userHasAccessToAllTenants(
      req?.user as ConfigType extends { user: unknown } ? ConfigType['user'] : TypedUser,
    )
  ) {
    return null
  }

  // scope to user assigned tenants
  const userAssignedTenants = getUserTenantIDs(req.user, {
    tenantsArrayFieldName,
    tenantsArrayTenantFieldName,
  })
  if (userAssignedTenants.length > 0) {
    return {
      [filterFieldName]: {
        in: userAssignedTenants,
      },
    }
  }

  // no tenant selected and no user tenants, return null to allow access control to handle it
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: afterTenantDelete.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/hooks/afterTenantDelete.ts

```typescript
import type {
  CollectionAfterDeleteHook,
  CollectionConfig,
  JsonObject,
  PaginatedDocs,
} from 'payload'

import { generateCookie, mergeHeaders } from 'payload'

import type { UserWithTenantsField } from '../types.js'

import { getCollectionIDType } from '../utilities/getCollectionIDType.js'
import { getTenantFromCookie } from '../utilities/getTenantFromCookie.js'

type Args = {
  collection: CollectionConfig
  enabledSlugs: string[]
  tenantFieldName: string
  tenantsCollectionSlug: string
  usersSlug: string
  usersTenantsArrayFieldName: string
  usersTenantsArrayTenantFieldName: string
}
/**
 * Add cleanup logic when tenant is deleted
 * - delete documents related to tenant
 * - remove tenant from users
 */
export const addTenantCleanup = ({
  collection,
  enabledSlugs,
  tenantFieldName,
  tenantsCollectionSlug,
  usersSlug,
  usersTenantsArrayFieldName,
  usersTenantsArrayTenantFieldName,
}: Args) => {
  if (!collection.hooks) {
    collection.hooks = {}
  }
  if (!collection.hooks?.afterDelete) {
    collection.hooks.afterDelete = []
  }
  collection.hooks.afterDelete.push(
    afterTenantDelete({
      enabledSlugs,
      tenantFieldName,
      tenantsCollectionSlug,
      usersSlug,
      usersTenantsArrayFieldName,
      usersTenantsArrayTenantFieldName,
    }),
  )
}

export const afterTenantDelete =
  ({
    enabledSlugs,
    tenantFieldName,
    tenantsCollectionSlug,
    usersSlug,
    usersTenantsArrayFieldName,
    usersTenantsArrayTenantFieldName,
  }: Omit<Args, 'collection'>): CollectionAfterDeleteHook =>
  async ({ id, req }) => {
    const idType = getCollectionIDType({
      collectionSlug: tenantsCollectionSlug,
      payload: req.payload,
    })
    const currentTenantCookieID = getTenantFromCookie(req.headers, idType)
    if (currentTenantCookieID === id) {
      const newHeaders = new Headers({
        'Set-Cookie': generateCookie<string>({
          name: 'payload-tenant',
          expires: new Date(Date.now() - 1000),
          path: '/',
          returnCookieAsObject: false,
          value: '',
        }),
      })

      req.responseHeaders = req.responseHeaders
        ? mergeHeaders(req.responseHeaders, newHeaders)
        : newHeaders
    }
    const cleanupPromises: Promise<JsonObject>[] = []
    enabledSlugs.forEach((slug) => {
      cleanupPromises.push(
        req.payload.delete({
          collection: slug,
          where: {
            [tenantFieldName]: {
              in: [id],
            },
          },
        }),
      )
    })

    try {
      const usersWithTenant = (await req.payload.find({
        collection: usersSlug,
        depth: 0,
        limit: 0,
        where: {
          [`${usersTenantsArrayFieldName}.${usersTenantsArrayTenantFieldName}`]: {
            in: [id],
          },
        },
      })) as PaginatedDocs<UserWithTenantsField>

      usersWithTenant?.docs?.forEach((user) => {
        cleanupPromises.push(
          req.payload.update({
            id: user.id,
            collection: usersSlug,
            data: {
              [usersTenantsArrayFieldName]: (user[usersTenantsArrayFieldName] || []).filter(
                (row: Record<string, string>) => {
                  if (row[usersTenantsArrayTenantFieldName]) {
                    return row[usersTenantsArrayTenantFieldName] !== id
                  }
                },
              ),
            },
          }),
        )
      })
    } catch (e) {
      console.error('Error deleting tenants from users:', e)
    }

    await Promise.all(cleanupPromises)
  }
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/packages/plugin-multi-tenant/src/providers/TenantSelectionProvider/index.client.tsx
Signals: React, Next.js

```typescript
'use client'

import type { OptionObject } from 'payload'

import { toast, useAuth, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import React, { createContext } from 'react'

import { generateCookie } from '../../utilities/generateCookie.js'

type ContextType = {
  /**
   * What is the context of the selector? It is either 'document' | 'global' | undefined.
   *
   * - 'document' means you are viewing a document in the context of a tenant
   * - 'global' means you are viewing a "global" (globals are collection documents but prevent you from viewing the list view) document in the context of a tenant
   * - undefined means you are not viewing a document at all
   */
  entityType?: 'document' | 'global'
  /**
   * Hoists the forms modified state
   */
  modified?: boolean
  /**
   * Array of options to select from
   */
  options: OptionObject[]
  /**
   * The currently selected tenant ID
   */
  selectedTenantID: number | string | undefined
  /**
   * Sets the entityType when a document is loaded and sets it to undefined when the document unmounts.
   */
  setEntityType: React.Dispatch<React.SetStateAction<'document' | 'global' | undefined>>
  /**
   * Sets the modified state
   */
  setModified: React.Dispatch<React.SetStateAction<boolean>>
  /**
   * Sets the selected tenant ID
   *
   * @param args.id - The ID of the tenant to select
   * @param args.refresh - Whether to refresh the page after changing the tenant
   */
  setTenant: (args: { id: number | string | undefined; refresh?: boolean }) => void
  /**
   * Used to sync tenants displayed in the tenant selector when updates are made to the tenants collection.
   */
  syncTenants: () => Promise<void>
  /**
   *
   */
  updateTenants: (args: { id: number | string; label: string }) => void
}

const Context = createContext<ContextType>({
  entityType: undefined,
  options: [],
  selectedTenantID: undefined,
  setEntityType: () => undefined,
  setModified: () => undefined,
  setTenant: () => null,
  syncTenants: () => Promise.resolve(),
  updateTenants: () => null,
})

const DEFAULT_COOKIE_NAME = 'payload-tenant'

const setTenantCookie = (args: { cookieName?: string; value: string }) => {
  const { cookieName = DEFAULT_COOKIE_NAME, value } = args
  document.cookie = generateCookie<string>({
    name: cookieName,
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    path: '/',
    returnCookieAsObject: false,
    value: value || '',
  })
}

const deleteTenantCookie = (args: { cookieName?: string } = {}) => {
  const { cookieName = DEFAULT_COOKIE_NAME } = args
  document.cookie = generateCookie<string>({
    name: cookieName,
    maxAge: -1,
    path: '/',
    returnCookieAsObject: false,
    value: '',
  })
}

const getTenantCookie = (args: { cookieName?: string } = {}): string | undefined => {
  const { cookieName = DEFAULT_COOKIE_NAME } = args
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
  return undefined
}

export const TenantSelectionProviderClient = ({
  children,
  initialTenantOptions,
  initialValue,
  tenantsCollectionSlug,
}: {
  children: React.ReactNode
  initialTenantOptions: OptionObject[]
  initialValue?: number | string
  tenantsCollectionSlug: string
}) => {
  const [selectedTenantID, setSelectedTenantID] = React.useState<number | string | undefined>(
    initialValue,
  )
  const [modified, setModified] = React.useState<boolean>(false)
  const [entityType, setEntityType] = React.useState<'document' | 'global' | undefined>(undefined)
  const { user } = useAuth()
  const { config } = useConfig()
  const router = useRouter()
  const userID = React.useMemo(() => user?.id, [user?.id])
  const prevUserID = React.useRef(userID)
  const userChanged = userID !== prevUserID.current
  const [tenantOptions, setTenantOptions] = React.useState<OptionObject[]>(
    () => initialTenantOptions,
  )
  const selectedTenantLabel = React.useMemo(
    () => tenantOptions.find((option) => option.value === selectedTenantID)?.label,
    [selectedTenantID, tenantOptions],
  )

  const setTenantAndCookie = React.useCallback(
    ({ id, refresh }: { id: number | string | undefined; refresh?: boolean }) => {
      setSelectedTenantID(id)
      if (id !== undefined) {
        setTenantCookie({ value: String(id) })
      } else {
        deleteTenantCookie()
      }
      if (refresh) {
        router.refresh()
      }
    },
    [router],
  )

  const setTenant = React.useCallback<ContextType['setTenant']>(
    ({ id, refresh }) => {
      if (id === undefined) {
        if (tenantOptions.length > 1 || tenantOptions.length === 0) {
          // users with multiple tenants can clear the tenant selection
          setTenantAndCookie({ id: undefined, refresh })
        } else if (tenantOptions[0]) {
          // if there is only one tenant, auto-select that tenant
          setTenantAndCookie({ id: tenantOptions[0].value, refresh: true })
        }
      } else if (!tenantOptions.find((option) => option.value === id)) {
        // if the tenant is invalid, set the first tenant as selected
        setTenantAndCookie({
          id: tenantOptions[0]?.value,
          refresh,
        })
      } else {
        // if the tenant is in the options, set it as selected
        setTenantAndCookie({ id, refresh })
      }
    },
    [tenantOptions, setTenantAndCookie],
  )

  const syncTenants = React.useCallback(async () => {
    try {
      const req = await fetch(
        `${config.serverURL}${config.routes.api}/${tenantsCollectionSlug}/populate-tenant-options`,
        {
          credentials: 'include',
          method: 'GET',
        },
      )

      const result = await req.json()

      if (result.tenantOptions && userID) {
        setTenantOptions(result.tenantOptions)

        if (result.tenantOptions.length === 1) {
          setSelectedTenantID(result.tenantOptions[0].value)
          setTenantCookie({ value: String(result.tenantOptions[0].value) })
        }
      }
    } catch (e) {
      toast.error(`Error fetching tenants`)
    }
  }, [config.serverURL, config.routes.api, tenantsCollectionSlug, userID])

  const updateTenants = React.useCallback<ContextType['updateTenants']>(
    ({ id, label }) => {
      setTenantOptions((prev) => {
        return prev.map((currentTenant) => {
          if (id === currentTenant.value) {
            return {
              label,
              value: id,
            }
          }
          return currentTenant
        })
      })

      void syncTenants()
    },
    [syncTenants],
  )

  React.useEffect(() => {
    if (userChanged || (initialValue && String(initialValue) !== getTenantCookie())) {
      if (userID) {
        // user logging in
        void syncTenants()
      } else {
        // user logging out
        setSelectedTenantID(undefined)
        deleteTenantCookie()
        if (tenantOptions.length > 0) {
          setTenantOptions([])
        }
        router.refresh()
      }
      prevUserID.current = userID
    }
  }, [userID, userChanged, syncTenants, tenantOptions, initialValue, router])

  /**
   * If there is no initial value, clear the tenant and refresh the router.
   * Needed for stale tenantIDs set as a cookie.
   */
  React.useEffect(() => {
    if (!initialValue) {
      setTenant({ id: undefined, refresh: true })
    }
  }, [initialValue, setTenant])

  /**
   * If there is no selected tenant ID and the entity type is 'global', set the first tenant as selected.
   * This ensures that the global tenant is always set when the component mounts.
   */
  React.useEffect(() => {
    if (!selectedTenantID && tenantOptions.length > 0 && entityType === 'global') {
      setTenant({
        id: tenantOptions[0]?.value,
        refresh: true,
      })
    }
  }, [selectedTenantID, tenantOptions, entityType, setTenant])

  return (
    <span
      data-selected-tenant-id={selectedTenantID}
      data-selected-tenant-title={selectedTenantLabel}
    >
      <Context
        value={{
          entityType,
          modified,
          options: tenantOptions,
          selectedTenantID,
          setEntityType,
          setModified,
          setTenant,
          syncTenants,
          updateTenants,
        }}
      >
        {children}
      </Context>
    </span>
  )
}

export const useTenantSelection = () => React.use(Context)
```

--------------------------------------------------------------------------------

````
