---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 255
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 255 of 695)

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

---[FILE: addFilterOptionsToFields.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/addFilterOptionsToFields.ts

```typescript
import type { Block, Config, Field, RelationshipField, SanitizedConfig } from 'payload'

import type { MultiTenantPluginConfig } from '../types.js'

import { defaults } from '../defaults.js'
import { filterDocumentsByTenants } from '../filters/filterDocumentsByTenants.js'

type AddFilterOptionsToFieldsArgs<ConfigType = unknown> = {
  blockReferencesWithFilters: string[]
  config: Config | SanitizedConfig
  fields: Field[]
  tenantEnabledCollectionSlugs: string[]
  tenantEnabledGlobalSlugs: string[]
  tenantFieldName: string
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}

export function addFilterOptionsToFields<ConfigType = unknown>({
  blockReferencesWithFilters,
  config,
  fields,
  tenantEnabledCollectionSlugs,
  tenantEnabledGlobalSlugs,
  tenantFieldName,
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  userHasAccessToAllTenants,
}: AddFilterOptionsToFieldsArgs<ConfigType>): Field[] {
  const newFields = []
  for (const field of fields) {
    let newField: Field = { ...field }
    if (newField.type === 'relationship') {
      let hasTenantRelationsips = false
      /**
       * Adjusts relationship fields to filter by tenant
       * and ensures relationTo cannot be a tenant global collection
       */
      if (typeof newField.relationTo === 'string') {
        if (tenantEnabledGlobalSlugs.includes(newField.relationTo)) {
          throw new Error(
            `The collection ${newField.relationTo} is a global collection and cannot be related to a tenant enabled collection.`,
          )
        }
        if (tenantEnabledCollectionSlugs.includes(newField.relationTo)) {
          hasTenantRelationsips = true
        }
      } else {
        for (const relationTo of newField.relationTo) {
          if (tenantEnabledGlobalSlugs.includes(relationTo)) {
            throw new Error(
              `The collection ${relationTo} is a global collection and cannot be related to a tenant enabled collection.`,
            )
          }
          if (tenantEnabledCollectionSlugs.includes(relationTo)) {
            hasTenantRelationsips = true
          }
        }
      }

      if (hasTenantRelationsips) {
        newField = addRelationshipFilter({
          field: newField as RelationshipField,
          tenantEnabledCollectionSlugs,
          tenantFieldName,
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
          userHasAccessToAllTenants,
        })
      }
    }

    if (
      newField.type === 'row' ||
      newField.type === 'array' ||
      newField.type === 'collapsible' ||
      newField.type === 'group'
    ) {
      newField.fields = addFilterOptionsToFields({
        blockReferencesWithFilters,
        config,
        fields: newField.fields,
        tenantEnabledCollectionSlugs,
        tenantEnabledGlobalSlugs,
        tenantFieldName,
        tenantsArrayFieldName,
        tenantsArrayTenantFieldName,
        tenantsCollectionSlug,
        userHasAccessToAllTenants,
      })
    }

    if (newField.type === 'blocks') {
      const newBlocks: Block[] = []
      ;(newField.blockReferences ?? newField.blocks).forEach((_block) => {
        let block: Block | undefined
        let isReference = false

        if (typeof _block === 'string') {
          if (blockReferencesWithFilters.includes(_block)) {
            return
          }
          isReference = true
          block = config?.blocks?.find((b) => b.slug === _block)
          blockReferencesWithFilters.push(_block)
        } else {
          // Create a shallow copy to avoid mutating the original block reference
          block = { ..._block }
        }

        if (block?.fields) {
          block.fields = addFilterOptionsToFields({
            blockReferencesWithFilters,
            config,
            fields: block.fields,
            tenantEnabledCollectionSlugs,
            tenantEnabledGlobalSlugs,
            tenantFieldName,
            tenantsArrayFieldName,
            tenantsArrayTenantFieldName,
            tenantsCollectionSlug,
            userHasAccessToAllTenants,
          })
        }

        if (block && !isReference) {
          newBlocks.push(block)
        }
      })
      newField.blocks = newBlocks
    }

    if (newField.type === 'tabs') {
      newField.tabs = newField.tabs.map((tab) => {
        const newTab = { ...tab }
        newTab.fields = addFilterOptionsToFields({
          blockReferencesWithFilters,
          config,
          fields: tab.fields,
          tenantEnabledCollectionSlugs,
          tenantEnabledGlobalSlugs,
          tenantFieldName,
          tenantsArrayFieldName,
          tenantsArrayTenantFieldName,
          tenantsCollectionSlug,
          userHasAccessToAllTenants,
        })
        return newTab
      })
    }

    newFields.push(newField)
  }

  return newFields
}

type AddFilterArgs<ConfigType = unknown> = {
  field: RelationshipField
  tenantEnabledCollectionSlugs: string[]
  tenantFieldName: string
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}
function addRelationshipFilter<ConfigType = unknown>({
  field,
  tenantEnabledCollectionSlugs,
  tenantFieldName,
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  userHasAccessToAllTenants,
}: AddFilterArgs<ConfigType>): Field {
  // User specified filter
  const originalFilter = field.filterOptions
  field.filterOptions = async (args) => {
    const originalFilterResult =
      typeof originalFilter === 'function' ? await originalFilter(args) : (originalFilter ?? true)

    // If the relationTo is not a tenant enabled collection, return early
    if (args.relationTo && !tenantEnabledCollectionSlugs.includes(args.relationTo)) {
      return originalFilterResult
    }

    // If the original filtr returns false, return early
    if (originalFilterResult === false) {
      return false
    }

    // Custom tenant filter
    const tenantFilterResults = filterDocumentsByTenants({
      docTenantID: args.data?.[tenantFieldName],
      filterFieldName: tenantFieldName,
      req: args.req,
      tenantsArrayFieldName,
      tenantsArrayTenantFieldName,
      tenantsCollectionSlug,
      userHasAccessToAllTenants,
    })

    // If the tenant filter returns null, meaning no tenant filter, just use the original filter
    if (tenantFilterResults === null) {
      return originalFilterResult
    }

    // If the original filter returns true, just use the tenant filter
    if (originalFilterResult === true) {
      return tenantFilterResults
    }

    return {
      and: [originalFilterResult, tenantFilterResults],
    }
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: combineFilters.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/combineFilters.ts

```typescript
import type { BaseFilter, Where } from 'payload'

type Args = {
  baseFilter?: BaseFilter
  customFilter: BaseFilter
}
/**
 * Combines a base filter with a tenant list filter
 *
 * Combines where constraints inside of an AND operator
 */
export const combineFilters =
  ({ baseFilter, customFilter }: Args): BaseFilter =>
  async (args) => {
    const filterConstraints = []

    if (typeof baseFilter === 'function') {
      const baseFilterResult = await baseFilter(args)

      if (baseFilterResult) {
        filterConstraints.push(baseFilterResult)
      }
    }

    const customFilterResult = await customFilter(args)

    if (customFilterResult) {
      filterConstraints.push(customFilterResult)
    }

    if (filterConstraints.length) {
      const combinedWhere: Where = { and: [] }
      filterConstraints.forEach((constraint) => {
        if (combinedWhere.and && constraint && typeof constraint === 'object') {
          combinedWhere.and.push(constraint)
        }
      })
      return combinedWhere
    }

    // Access control will take it from here
    return null
  }
```

--------------------------------------------------------------------------------

---[FILE: combineWhereConstraints.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/combineWhereConstraints.ts

```typescript
import type { Where } from 'payload'

export function combineWhereConstraints(constraints: Array<Where>): Where {
  if (constraints.length === 0) {
    return {}
  }
  if (constraints.length === 1 && constraints[0]) {
    return constraints[0]
  }
  const andConstraint: Where = {
    and: [],
  }
  constraints.forEach((constraint) => {
    if (andConstraint.and && constraint && typeof constraint === 'object') {
      andConstraint.and.push(constraint)
    }
  })
  return andConstraint
}
```

--------------------------------------------------------------------------------

---[FILE: extractID.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/extractID.ts

```typescript
import type { Tenant } from '../types.js'

export const extractID = <IDType extends number | string>(
  objectOrID: IDType | Tenant<IDType>,
): IDType => {
  if (typeof objectOrID === 'string' || typeof objectOrID === 'number') {
    return objectOrID
  }

  return objectOrID.id
}
```

--------------------------------------------------------------------------------

---[FILE: generateCookie.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/generateCookie.ts

```typescript
type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  returnCookieAsObject: boolean
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
  value?: string
}

type CookieObject = {
  domain?: string
  expires?: string
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
  value: string | undefined
}

export const generateCookie = <ReturnCookieAsObject = boolean>(
  args: CookieOptions,
): ReturnCookieAsObject extends true ? CookieObject : string => {
  const {
    name,
    domain,
    expires,
    httpOnly,
    maxAge,
    path,
    returnCookieAsObject,
    sameSite,
    secure: secureArg,
    value,
  } = args
  let cookieString = `${name}=${value || ''}`
  const cookieObject: CookieObject = {
    name,
    value,
  }
  const secure = secureArg || sameSite === 'None'

  if (expires) {
    if (returnCookieAsObject) {
      cookieObject.expires = expires.toUTCString()
    } else {
      cookieString += `; Expires=${expires.toUTCString()}`
    }
  }

  if (maxAge) {
    if (returnCookieAsObject) {
      cookieObject.maxAge = maxAge
    } else {
      cookieString += `; Max-Age=${maxAge.toString()}`
    }
  }

  if (domain) {
    if (returnCookieAsObject) {
      cookieObject.domain = domain
    } else {
      cookieString += `; Domain=${domain}`
    }
  }

  if (path) {
    if (returnCookieAsObject) {
      cookieObject.path = path
    } else {
      cookieString += `; Path=${path}`
    }
  }

  if (secure) {
    if (returnCookieAsObject) {
      cookieObject.secure = secure
    } else {
      cookieString += `; Secure`
    }
  }

  if (httpOnly) {
    if (returnCookieAsObject) {
      cookieObject.httpOnly = httpOnly
    } else {
      cookieString += `; HttpOnly`
    }
  }

  if (sameSite) {
    if (returnCookieAsObject) {
      cookieObject.sameSite = sameSite
    } else {
      cookieString += `; SameSite=${sameSite}`
    }
  }

  return returnCookieAsObject ? (cookieObject as any) : (cookieString as any)
}
```

--------------------------------------------------------------------------------

---[FILE: getCollectionIDType.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getCollectionIDType.ts

```typescript
import type { CollectionSlug, Payload } from 'payload'

type Args = {
  collectionSlug: CollectionSlug
  payload: Payload
}
export const getCollectionIDType = ({ collectionSlug, payload }: Args): 'number' | 'text' => {
  return payload.collections[collectionSlug]?.customIDType ?? payload.db.defaultIDType
}
```

--------------------------------------------------------------------------------

---[FILE: getGlobalViewRedirect.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getGlobalViewRedirect.ts
Signals: Next.js

```typescript
import type { Payload, TypedUser, ViewTypes } from 'payload'

import { unauthorized } from 'next/navigation.js'
import { formatAdminURL, hasAutosaveEnabled } from 'payload/shared'

import type { MultiTenantPluginConfig } from '../types.js'

import { getCollectionIDType } from './getCollectionIDType.js'
import { getTenantFromCookie } from './getTenantFromCookie.js'
import { getTenantOptions } from './getTenantOptions.js'

type Args = {
  basePath?: string
  docID?: number | string
  headers: Headers
  payload: Payload
  slug: string
  tenantFieldName: string
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  useAsTitle: string
  user?: TypedUser
  userHasAccessToAllTenants: Required<MultiTenantPluginConfig<any>>['userHasAccessToAllTenants']
  view: ViewTypes
}
export async function getGlobalViewRedirect({
  slug: collectionSlug,
  basePath,
  docID,
  headers,
  payload,
  tenantFieldName,
  tenantsArrayFieldName,
  tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  useAsTitle,
  user,
  userHasAccessToAllTenants,
  view,
}: Args): Promise<string | void> {
  const idType = getCollectionIDType({
    collectionSlug: tenantsCollectionSlug,
    payload,
  })
  let tenant = getTenantFromCookie(headers, idType)
  let redirectRoute: `/${string}` | void = undefined

  if (!user) {
    return unauthorized()
  }

  if (!tenant) {
    const tenantOptions = await getTenantOptions({
      payload,
      tenantsArrayFieldName,
      tenantsArrayTenantFieldName,
      tenantsCollectionSlug,
      useAsTitle,
      user,
      userHasAccessToAllTenants,
    })

    tenant = tenantOptions[0]?.value || null
  }

  if (tenant) {
    try {
      const globalTenantDocQuery = await payload.find({
        collection: collectionSlug,
        depth: 0,
        limit: 1,
        pagination: false,
        select: {
          id: true,
        },
        where: {
          [tenantFieldName]: {
            in: [tenant],
          },
        },
      })

      const globalTenantDocID = globalTenantDocQuery?.docs?.[0]?.id

      if (view === 'document') {
        // global tenant document edit view
        if (globalTenantDocID && docID !== globalTenantDocID) {
          // tenant document already exists but does not match current route docID
          // redirect to matching tenant docID from query
          redirectRoute = `/collections/${collectionSlug}/${globalTenantDocID}`
        } else if (docID && !globalTenantDocID) {
          // a docID was found in the route but no global document with this tenant exists
          // so we need to generate a redirect to the create route
          redirectRoute = await generateCreateRedirect({
            collectionSlug,
            payload,
            tenantID: tenant,
          })
        }
      } else if (view === 'list') {
        // global tenant document list view
        if (globalTenantDocID) {
          // tenant document exists, redirect from list view to the document edit view
          redirectRoute = `/collections/${collectionSlug}/${globalTenantDocID}`
        } else {
          // no matching document was found for the current tenant
          // so we need to generate a redirect to the create route
          redirectRoute = await generateCreateRedirect({
            collectionSlug,
            payload,
            tenantID: tenant,
          })
        }
      }
    } catch (e: unknown) {
      const prefix = `${e && typeof e === 'object' && 'message' in e && typeof e.message === 'string' ? `${e.message} - ` : ''}`
      payload.logger.error(e, `${prefix}Multi Tenant Redirect Error`)
    }
  } else {
    // no tenants were found, redirect to the admin view
    return formatAdminURL({
      adminRoute: payload.config.routes.admin,
      basePath,
      path: '',
      serverURL: payload.config.serverURL,
    })
  }

  if (redirectRoute) {
    return formatAdminURL({
      adminRoute: payload.config.routes.admin,
      basePath,
      path: redirectRoute,
      serverURL: payload.config.serverURL,
    })
  }

  // no redirect is needed
  // the current route is valid
  return undefined
}

type GenerateCreateArgs = {
  collectionSlug: string
  payload: Payload
  tenantID: number | string
}
/**
 * Generate a redirect URL for creating a new document in a multi-tenant collection.
 *
 * If autosave is enabled on the collection, we need to create the document and then redirect to it.
 * Otherwise we can redirect to the default create route.
 */
async function generateCreateRedirect({
  collectionSlug,
  payload,
  tenantID,
}: GenerateCreateArgs): Promise<`/${string}` | undefined> {
  const collectionConfig = payload.collections[collectionSlug]?.config
  if (hasAutosaveEnabled(collectionConfig!)) {
    // Autosave is enabled, create a document first
    try {
      const doc = await payload.create({
        collection: collectionSlug,
        data: {
          tenant: tenantID,
        },
        depth: 0,
        draft: true,
        select: {
          id: true,
        },
      })
      return `/collections/${collectionSlug}/${doc.id}`
    } catch (error) {
      payload.logger.error(
        error,
        `Error creating autosave global multi tenant document for ${collectionSlug}`,
      )
    }

    return '/'
  }

  // Autosave is not enabled, redirect to default create route
  return `/collections/${collectionSlug}/create`
}
```

--------------------------------------------------------------------------------

---[FILE: getTenantAccess.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getTenantAccess.ts

```typescript
import type { Where } from 'payload'

import type { UserWithTenantsField } from '../types.js'

import { defaults } from '../defaults.js'
import { getUserTenantIDs } from './getUserTenantIDs.js'

type Args = {
  fieldName: string
  tenantsArrayFieldName?: string
  tenantsArrayTenantFieldName?: string
  user: UserWithTenantsField
}
export function getTenantAccess({
  fieldName,
  tenantsArrayFieldName = defaults.tenantsArrayFieldName,
  tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName,
  user,
}: Args): Where {
  const userAssignedTenantIDs = getUserTenantIDs(user, {
    tenantsArrayFieldName,
    tenantsArrayTenantFieldName,
  })

  return {
    [fieldName]: {
      in: userAssignedTenantIDs || [],
    },
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getTenantFromCookie.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getTenantFromCookie.ts

```typescript
import { parseCookies } from 'payload'
import { isNumber } from 'payload/shared'

/**
 * A function that takes request headers and an idType and returns the current tenant ID from the cookie
 *
 * @param headers Headers, usually derived from req.headers or next/headers
 * @param idType can be 'number' | 'text', usually derived from payload.db.defaultIDType
 * @returns string | number | null
 */
export function getTenantFromCookie(
  headers: Headers,
  idType: 'number' | 'text',
): null | number | string {
  const cookies = parseCookies(headers)
  const selectedTenant = cookies.get('payload-tenant') || null
  return selectedTenant
    ? idType === 'number' && isNumber(selectedTenant)
      ? parseFloat(selectedTenant)
      : selectedTenant
    : null
}
```

--------------------------------------------------------------------------------

---[FILE: getTenantOptions.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getTenantOptions.ts

```typescript
import type { OptionObject, Payload, TypedUser } from 'payload'

import type { MultiTenantPluginConfig } from '../types.js'

export const getTenantOptions = async ({
  payload,
  tenantsArrayFieldName,
  tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  useAsTitle,
  user,
  userHasAccessToAllTenants,
}: {
  payload: Payload
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  useAsTitle: string
  user: TypedUser
  userHasAccessToAllTenants: Required<MultiTenantPluginConfig<any>>['userHasAccessToAllTenants']
}): Promise<OptionObject[]> => {
  let tenantOptions: OptionObject[] = []

  if (!user) {
    return tenantOptions
  }

  const isOrderable = payload.collections[tenantsCollectionSlug]?.config?.orderable || false

  const userTenantIds = !userHasAccessToAllTenants(user)
    ? ((user[tenantsArrayFieldName] as { [key: string]: unknown }[]) || []).map((tenantRow) => {
        const tenantField = tenantRow[tenantsArrayTenantFieldName]
        if (typeof tenantField === 'string' || typeof tenantField === 'number') {
          return tenantField
        }
        if (tenantField && typeof tenantField === 'object' && 'id' in tenantField) {
          return tenantField.id as number | string
        }
      })
    : undefined

  const tenants = await payload.find({
    collection: tenantsCollectionSlug,
    depth: 0,
    limit: 0,
    overrideAccess: false,
    select: {
      [useAsTitle]: true,
      ...(isOrderable && { _order: true }),
    },
    sort: isOrderable ? '_order' : useAsTitle,
    user,
    ...(userTenantIds && {
      where: {
        id: {
          in: userTenantIds,
        },
      },
    }),
  })

  tenantOptions = tenants.docs.map((doc) => ({
    label: String(doc[useAsTitle as 'id']),
    value: doc.id as string,
  }))

  return tenantOptions
}
```

--------------------------------------------------------------------------------

---[FILE: getUserTenantIDs.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/getUserTenantIDs.ts

```typescript
import type { Tenant, UserWithTenantsField } from '../types.js'

import { defaults } from '../defaults.js'
import { extractID } from './extractID.js'

/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 */
export const getUserTenantIDs = <IDType extends number | string>(
  user: null | UserWithTenantsField,
  options?: {
    tenantsArrayFieldName?: string
    tenantsArrayTenantFieldName?: string
  },
): IDType[] => {
  if (!user) {
    return []
  }

  const tenantsArrayFieldName = options?.tenantsArrayFieldName || defaults.tenantsArrayFieldName
  const tenantsArrayTenantFieldName =
    options?.tenantsArrayTenantFieldName || defaults.tenantsArrayTenantFieldName

  return (
    (Array.isArray(user[tenantsArrayFieldName]) ? user[tenantsArrayFieldName] : [])?.reduce<
      IDType[]
    >((acc, row) => {
      if (row[tenantsArrayTenantFieldName]) {
        acc.push(extractID<IDType>(row[tenantsArrayTenantFieldName] as Tenant<IDType>))
      }

      return acc
    }, []) || []
  )
}
```

--------------------------------------------------------------------------------

---[FILE: miniChalk.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/miniChalk.ts

```typescript
const codes = {
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  underline: '\x1b[4m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
}

function colorize(str: string, ...styles: (keyof typeof codes)[]) {
  const start = styles.map((s) => codes[s] || '').join('')
  return `${start}${str}${codes.reset}`
}

export const miniChalk = {
  blue: (str: string) => colorize(str, 'blue'),
  bold: (str: string) => colorize(str, 'bold'),
  cyan: (str: string) => colorize(str, 'cyan'),
  dim: (str: string) => colorize(str, 'dim'),
  green: (str: string) => colorize(str, 'green'),
  magenta: (str: string) => colorize(str, 'magenta'),
  red: (str: string) => colorize(str, 'red'),
  underline: (str: string) => colorize(str, 'underline'),
  white: (str: string) => colorize(str, 'white'),
  yellow: (str: string) => colorize(str, 'yellow'),

  // combos
  redBold: (str: string) => colorize(str, 'red', 'bold'),
  yellowBold: (str: string) => colorize(str, 'yellow', 'bold'),
}
```

--------------------------------------------------------------------------------

---[FILE: withTenantAccess.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/withTenantAccess.ts

```typescript
import type { Access, AccessArgs, AccessResult, CollectionConfig, TypedUser, Where } from 'payload'

import type { AllAccessKeys, MultiTenantPluginConfig, UserWithTenantsField } from '../types.js'

import { combineWhereConstraints } from './combineWhereConstraints.js'
import { getTenantAccess } from './getTenantAccess.js'

type Args<ConfigType> = {
  accessFunction?: Access
  accessKey: AllAccessKeys[number]
  accessResultCallback?: MultiTenantPluginConfig<ConfigType>['usersAccessResultOverride']
  adminUsersSlug: string
  collection: CollectionConfig
  fieldName: string
  tenantsArrayFieldName?: string
  tenantsArrayTenantFieldName?: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}
export const withTenantAccess =
  <ConfigType>({
    accessFunction,
    accessKey,
    accessResultCallback,
    adminUsersSlug,
    collection,
    fieldName,
    tenantsArrayFieldName,
    tenantsArrayTenantFieldName,
    userHasAccessToAllTenants,
  }: Args<ConfigType>) =>
  async (args: AccessArgs): Promise<AccessResult> => {
    const constraints: Where[] = []
    const accessFn =
      typeof accessFunction === 'function'
        ? accessFunction
        : ({ req }: AccessArgs): AccessResult => Boolean(req.user)
    const accessResult: AccessResult = await accessFn(args)

    if (accessResult === false) {
      if (accessResultCallback) {
        return accessResultCallback({
          accessKey,
          accessResult: false,
          ...args,
        })
      } else {
        return false
      }
    } else if (accessResult && typeof accessResult === 'object') {
      constraints.push(accessResult)
    }

    if (
      args.req.user &&
      args.req.user.collection === adminUsersSlug &&
      !userHasAccessToAllTenants(
        args.req.user as ConfigType extends { user: unknown } ? ConfigType['user'] : TypedUser,
      )
    ) {
      const tenantConstraint = getTenantAccess({
        fieldName,
        tenantsArrayFieldName,
        tenantsArrayTenantFieldName,
        user: args.req.user as UserWithTenantsField,
      })
      if (collection.slug === args.req.user.collection) {
        constraints.push({
          or: [
            {
              id: {
                equals: args.req.user.id,
              },
            },
            tenantConstraint,
          ],
        })
      } else {
        constraints.push(tenantConstraint)
      }

      if (accessResultCallback) {
        return accessResultCallback({
          accessKey,
          accessResult: combineWhereConstraints(constraints),
          ...args,
        })
      } else {
        return combineWhereConstraints(constraints)
      }
    }

    if (accessResultCallback) {
      return accessResultCallback({
        accessKey,
        accessResult,
        ...args,
      })
    } else {
      return accessResult
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-nested-docs/.gitignore

```text
node_modules
.env
dist
build
.DS_Store
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-nested-docs/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/plugin-nested-docs/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-nested-docs/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/plugin-nested-docs/package.json

```json
{
  "name": "@payloadcms/plugin-nested-docs",
  "version": "3.68.5",
  "description": "The official Nested Docs plugin for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-nested-docs"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-nested-docs/README.md

```text
# Payload Nested Docs Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to easily nest the documents of your application inside of one another.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-nested-docs)
- [Documentation](https://payloadcms.com/docs/plugins/nested-docs)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/nested-docs.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-nested-docs/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-nested-docs/src/index.ts

```typescript
import type { Plugin, SingleRelationshipField } from 'payload'

import type { NestedDocsPluginConfig } from './types.js'

import { createBreadcrumbsField } from './fields/breadcrumbs.js'
import { createParentField } from './fields/parent.js'
import { parentFilterOptions } from './fields/parentFilterOptions.js'
import { populateBreadcrumbsBeforeChange } from './hooks/populateBreadcrumbsBeforeChange.js'
import { resaveChildren } from './hooks/resaveChildren.js'
import { resaveSelfAfterCreate } from './hooks/resaveSelfAfterCreate.js'
import { getParents } from './utilities/getParents.js'

export { createBreadcrumbsField, createParentField, getParents }

export const nestedDocsPlugin =
  (pluginConfig: NestedDocsPluginConfig): Plugin =>
  (config) => ({
    ...config,
    collections: (config.collections || []).map((collection) => {
      if (pluginConfig.collections.indexOf(collection.slug) > -1) {
        const fields = [...(collection?.fields || [])]

        const existingBreadcrumbField = collection.fields.find(
          (field) =>
            'name' in field && field.name === (pluginConfig?.breadcrumbsFieldSlug || 'breadcrumbs'),
        )

        const existingParentField = collection.fields.find(
          (field) => 'name' in field && field.name === (pluginConfig?.parentFieldSlug || 'parent'),
        ) as SingleRelationshipField

        const defaultFilterOptions = parentFilterOptions(pluginConfig?.breadcrumbsFieldSlug)

        if (existingParentField) {
          if (!existingParentField.filterOptions) {
            existingParentField.filterOptions = defaultFilterOptions
          }
        }

        if (!existingParentField && !pluginConfig.parentFieldSlug) {
          const defaultParentField = createParentField(collection.slug)
          defaultParentField.filterOptions = defaultFilterOptions
          fields.push(defaultParentField)
        }

        if (!existingBreadcrumbField && !pluginConfig.breadcrumbsFieldSlug) {
          fields.push(createBreadcrumbsField(collection.slug))
        }

        return {
          ...collection,
          fields,
          hooks: {
            ...(collection.hooks || {}),
            afterChange: [
              resaveChildren(pluginConfig),
              resaveSelfAfterCreate(pluginConfig),
              ...(collection?.hooks?.afterChange || []),
            ],
            beforeChange: [
              populateBreadcrumbsBeforeChange(pluginConfig),
              ...(collection?.hooks?.beforeChange || []),
            ],
          },
        }
      }

      return collection
    }),
  })
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-nested-docs/src/types.ts

```typescript
import type { CollectionSlug, SanitizedCollectionConfig } from 'payload'

export type Breadcrumb = {
  doc: string
  label: string
  url?: string
}

export type GenerateURL = (
  docs: Array<Record<string, unknown>>,
  currentDoc: Record<string, unknown>,
  collection: SanitizedCollectionConfig,
) => string

export type GenerateLabel = (
  docs: Array<Record<string, unknown>>,
  currentDoc: Record<string, unknown>,
  collection: SanitizedCollectionConfig,
) => string

export type NestedDocsPluginConfig = {
  /**
   * Should be supplied if using an alternative field name for the 'breadcrumbs' field in collections
   */
  breadcrumbsFieldSlug?: string
  /**
   * The slugs of the collections this plugin should extend. If you need different configs for different collections, this plugin can be added to your config more than once having different collections.
   */
  collections: CollectionSlug[]
  generateLabel?: GenerateLabel
  generateURL?: GenerateURL
  /**
   * Should be supplied if using an alternative field name for the 'parent' field in collections
   */
  parentFieldSlug?: string
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-nested-docs/src/exports/types.ts

```typescript
export type { Breadcrumb, GenerateLabel, GenerateURL, NestedDocsPluginConfig } from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: breadcrumbs.ts]---
Location: payload-main/packages/plugin-nested-docs/src/fields/breadcrumbs.ts

```typescript
import type { ArrayField, Field } from 'payload'

export const createBreadcrumbsField = (
  relationTo: string,
  overrides: Partial<ArrayField> = {},
): Field => ({
  name: 'breadcrumbs',
  type: 'array',
  localized: true,
  ...(overrides || {}),
  admin: {
    readOnly: true,
    ...(overrides?.admin || {}),
  },
  fields: [
    {
      name: 'doc',
      type: 'relationship',
      admin: {
        disabled: true,
      },
      maxDepth: 0,
      relationTo,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'URL',
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    ...(overrides?.fields || []),
  ],
})
```

--------------------------------------------------------------------------------

---[FILE: parent.ts]---
Location: payload-main/packages/plugin-nested-docs/src/fields/parent.ts

```typescript
import type { SingleRelationshipField } from 'payload'

export const createParentField = (
  relationTo: string,
  overrides?: Partial<
    {
      hasMany: false
    } & SingleRelationshipField
  >,
): SingleRelationshipField => ({
  name: 'parent',
  admin: {
    position: 'sidebar',
    ...(overrides?.admin || {}),
  },
  // filterOptions are assigned dynamically based on the pluginConfig
  // filterOptions: parentFilterOptions(),
  type: 'relationship',
  maxDepth: 1,
  relationTo,
  ...(overrides || {}),
})
```

--------------------------------------------------------------------------------

---[FILE: parentFilterOptions.ts]---
Location: payload-main/packages/plugin-nested-docs/src/fields/parentFilterOptions.ts

```typescript
import type { FilterOptions } from 'payload'

export const parentFilterOptions: (breadcrumbsFieldSlug?: string) => FilterOptions =
  (breadcrumbsFieldSlug = 'breadcrumbs') =>
  ({ id }) => {
    if (id) {
      return {
        id: { not_equals: id },
        [`${breadcrumbsFieldSlug}.doc`]: { not_in: [id] },
      }
    }

    return true
  }
```

--------------------------------------------------------------------------------

````
