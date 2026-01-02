---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 222
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 222 of 695)

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

---[FILE: formatLabels.ts]---
Location: payload-main/packages/payload/src/utilities/formatLabels.ts

```typescript
import pluralize from 'pluralize'
const { isPlural, singular } = pluralize

const capitalizeFirstLetter = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const toWords = (inputString: string, joinWords = false): string => {
  const notNullString = inputString || ''
  const trimmedString = notNullString.trim()
  const arrayOfStrings = trimmedString.split(/[\s-]/)

  const splitStringsArray: string[] = []
  arrayOfStrings.forEach((tempString) => {
    if (tempString !== '') {
      const splitWords = tempString.split(/(?=[A-Z])/).join(' ')
      splitStringsArray.push(capitalizeFirstLetter(splitWords))
    }
  })

  return joinWords ? splitStringsArray.join('').replace(/\s/g, '') : splitStringsArray.join(' ')
}

const formatLabels = (slug: string): { plural: string; singular: string } => {
  const words = toWords(slug)

  return isPlural(slug)
    ? {
        plural: words,
        singular: singular(words),
      }
    : {
        plural: pluralize(words),
        singular: words,
      }
}

const formatNames = (slug: string): { plural: string; singular: string } => {
  const words = toWords(slug, true)
  return isPlural(slug)
    ? {
        plural: words,
        singular: singular(words),
      }
    : {
        plural: pluralize(words),
        singular: words,
      }
}

export { formatLabels, formatNames, toWords }
```

--------------------------------------------------------------------------------

---[FILE: getBestFitFromSizes.ts]---
Location: payload-main/packages/payload/src/utilities/getBestFitFromSizes.ts

```typescript
/**
 * Takes image sizes and a target range and returns the url of the image within that range.
 * If no images fit within the range, it selects the next smallest adequate image, the original,
 * or the largest smaller image if no better fit exists.
 *
 * @param sizes The given FileSizes.
 * @param targetSizeMax The ideal image maximum width. Defaults to 180.
 * @param targetSizeMin The ideal image minimum width. Defaults to 40.
 * @param thumbnailURL The thumbnail url set in config. If passed a url, will return early with it.
 * @param url The url of the original file.
 * @param width The width of the original file.
 * @returns A url of the best fit file.
 */
export const getBestFitFromSizes = ({
  sizes,
  targetSizeMax = 180,
  targetSizeMin = 40,
  thumbnailURL,
  url,
  width,
}: {
  sizes?: Record<string, { url?: string; width?: number }>
  targetSizeMax?: number
  targetSizeMin?: number
  thumbnailURL?: string
  url: string
  width?: number
}) => {
  if (thumbnailURL) {
    return thumbnailURL
  }

  if (!sizes) {
    return url
  }

  const bestFit = Object.values(sizes).reduce<{
    original?: boolean
    url?: string
    width?: number
  }>(
    (closest, current) => {
      if (!current.width || current.width < targetSizeMin) {
        return closest
      }

      if (current.width >= targetSizeMin && current.width <= targetSizeMax) {
        return !closest.width ||
          current.width < closest.width ||
          closest.width < targetSizeMin ||
          closest.width > targetSizeMax
          ? current
          : closest
      }

      if (
        !closest.width ||
        (!closest.original && closest.width < targetSizeMin && current.width > closest.width) ||
        (closest.width > targetSizeMax && current.width < closest.width)
      ) {
        return current
      }

      return closest
    },
    { original: true, url, width },
  )

  return bestFit.url || url
}
```

--------------------------------------------------------------------------------

---[FILE: getBlockSelect.ts]---
Location: payload-main/packages/payload/src/utilities/getBlockSelect.ts

```typescript
import type { Block } from '../fields/config/types.js'
import type { SelectMode, SelectType } from '../types/index.js'

/**
 * This is used for the Select API to determine the select level of a block.
 * It will ensure that `id` and `blockType` are always included in the select object.
 * @returns { blockSelect: boolean | SelectType, blockSelectMode: SelectMode }
 */
export const getBlockSelect = ({
  block,
  select,
  selectMode,
}: {
  block: Block
  select: SelectType[string]
  selectMode: SelectMode
}): { blockSelect: boolean | SelectType; blockSelectMode: SelectMode } => {
  if (typeof select === 'object') {
    let blockSelectMode = selectMode

    const blocksSelect = {
      ...select,
    }

    let blockSelect = blocksSelect[block.slug]

    // sanitize `{ blocks: { cta: false }}` to `{ blocks: { cta: { id: true, blockType: true }}}`
    if (selectMode === 'exclude' && blockSelect === false) {
      blockSelectMode = 'include'

      blockSelect = {
        id: true,
        blockType: true,
      }
    } else if (selectMode === 'include') {
      if (!blockSelect) {
        blockSelect = {}
      }

      if (typeof blockSelect === 'object') {
        blockSelect = {
          ...blockSelect,
        }

        blockSelect['id'] = true
        blockSelect['blockType'] = true
      }
    }

    return { blockSelect: blockSelect!, blockSelectMode }
  }

  return { blockSelect: select, blockSelectMode: selectMode }
}
```

--------------------------------------------------------------------------------

---[FILE: getCollectionIDFieldTypes.ts]---
Location: payload-main/packages/payload/src/utilities/getCollectionIDFieldTypes.ts

```typescript
import type { SanitizedConfig } from '../config/types.js'

/**
 *  While the default ID is determined by the db adapter, it can still differ for a collection if they
 *  define a custom ID field. This builds a map of collection slugs to their ID field type.
 * @param defaultIDType as defined by the database adapter
 */
export function getCollectionIDFieldTypes({
  config,
  defaultIDType,
}: {
  config: SanitizedConfig
  defaultIDType: 'number' | 'text'
}): { [key: string]: 'number' | 'string' } {
  return config.collections.reduce(
    (acc, collection) => {
      const customCollectionIdField = collection.fields.find(
        (field) => 'name' in field && field.name === 'id',
      )

      acc[collection.slug] = defaultIDType === 'text' ? 'string' : 'number'

      if (customCollectionIdField) {
        acc[collection.slug] = customCollectionIdField.type === 'number' ? 'number' : 'string'
      }

      return acc
    },
    {} as Record<string, 'number' | 'string'>,
  )
}
```

--------------------------------------------------------------------------------

---[FILE: getDataByPath.ts]---
Location: payload-main/packages/payload/src/utilities/getDataByPath.ts

```typescript
import type { FormState } from '../admin/types.js'

import { unflatten } from './unflatten.js'

export const getDataByPath = <T = unknown>(fields: FormState, path: string): T => {
  const pathPrefixToRemove = path.substring(0, path.lastIndexOf('.') + 1)
  const name = path.split('.').pop()

  const data: Record<string, any> = {}
  Object.keys(fields).forEach((key) => {
    if (!fields[key]?.disableFormData && (key.indexOf(`${path}.`) === 0 || key === path)) {
      data[key.replace(pathPrefixToRemove, '')] = fields[key]?.value

      if (fields[key]?.rows && fields[key].rows.length === 0) {
        data[key.replace(pathPrefixToRemove, '')] = []
      }
    }
  })

  const unflattenedData = unflatten(data)

  return unflattenedData?.[name!]
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldByPath.spec.ts]---
Location: payload-main/packages/payload/src/utilities/getFieldByPath.spec.ts

```typescript
import { assert } from 'ts-essentials'
import { flattenAllFields } from './flattenAllFields.js'
import { getFieldByPath } from './getFieldByPath.js'
import type { FlattenedArrayField, FlattenedGroupField } from '../fields/config/types.js'

const fields = flattenAllFields({
  fields: [
    {
      type: 'text',
      name: 'text',
    },
    {
      type: 'text',
      name: 'textLocalized',
      localized: true,
    },
    {
      type: 'array',
      name: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
        },
        {
          name: 'textLocalized',
          localized: true,
          type: 'text',
        },
        {
          name: 'group',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'tab',
          fields: [
            {
              type: 'array',
              name: 'localizedArray',
              localized: true,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

describe('getFieldByPath', () => {
  it('asserts getFieldByPath', () => {
    const assert_1 = getFieldByPath({ fields, path: 'text' })
    assert(assert_1)
    expect(assert_1.field).toBe(fields[0])
    expect(assert_1.pathHasLocalized).toBe(false)

    const assert_2 = getFieldByPath({ fields, path: 'textLocalized' })
    assert(assert_2)
    expect(assert_2.field).toBe(fields[1])
    expect(assert_2.pathHasLocalized).toBe(true)
    expect(assert_2.localizedPath).toBe('textLocalized.<locale>')

    const arrayField = fields[2] as FlattenedArrayField
    const assert_3 = getFieldByPath({ fields, path: 'array' })
    assert(assert_3)
    expect(assert_3.field).toBe(arrayField)
    expect(assert_3.pathHasLocalized).toBe(false)

    const assert_4 = getFieldByPath({ fields, path: 'array.text' })
    assert(assert_4)
    expect(assert_4.field).toBe(arrayField.flattenedFields[0])
    expect(assert_4.pathHasLocalized).toBe(false)

    const assert_5 = getFieldByPath({ fields, path: 'array.textLocalized' })
    assert(assert_5)
    expect(assert_5.field).toBe(arrayField.flattenedFields[1])
    expect(assert_5.pathHasLocalized).toBe(true)
    expect(assert_5.localizedPath).toBe('array.textLocalized.<locale>')

    const groupWithinArray = arrayField.flattenedFields[2] as FlattenedGroupField
    const assert_6 = getFieldByPath({ fields, path: 'array.group.text' })
    assert(assert_6)
    expect(assert_6.field).toBe(groupWithinArray.flattenedFields[0])
    expect(assert_6.pathHasLocalized).toBe(false)

    const assert_7 = getFieldByPath({ fields, path: 'tab.localizedArray.text' })
    assert(assert_7)
    expect(assert_7.field).toBe((fields[3] as any).flattenedFields[0].flattenedFields[0])
    expect(assert_7.pathHasLocalized).toBe(true)
    expect(assert_7.localizedPath).toBe('tab.localizedArray.<locale>.text')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getFieldByPath.ts]---
Location: payload-main/packages/payload/src/utilities/getFieldByPath.ts

```typescript
import type { SanitizedConfig } from '../config/types.js'
import type { FlattenedField } from '../fields/config/types.js'

/**
 * Get the field from by its path.
 * Can accept nested paths, e.g: group.title, array.group.title
 * If there were any localized on the path, pathHasLocalized will be true and localizedPath will look like:
 * group.<locale>.title // group is localized here
 */
export const getFieldByPath = ({
  config,
  fields,
  includeRelationships = false,
  localizedPath = '',
  path,
}: {
  config?: SanitizedConfig
  fields: FlattenedField[]
  includeRelationships?: boolean
  localizedPath?: string
  path: string
}): {
  field: FlattenedField
  localizedPath: string
  pathHasLocalized: boolean
} | null => {
  let currentFields: FlattenedField[] = fields

  let currentField: FlattenedField | null = null

  const segments = path.split('.')

  let pathHasLocalized = false

  while (segments.length > 0) {
    const segment = segments.shift()
    localizedPath = `${localizedPath ? `${localizedPath}.` : ''}${segment}`
    const field = currentFields.find((each) => each.name === segment)

    if (!field) {
      return null
    }

    if (field.localized) {
      pathHasLocalized = true
      localizedPath = `${localizedPath}.<locale>`
    }

    if ('flattenedFields' in field) {
      currentFields = field.flattenedFields
    }

    if (
      config &&
      includeRelationships &&
      (field.type === 'relationship' || field.type === 'upload') &&
      !Array.isArray(field.relationTo)
    ) {
      const flattenedFields = config.collections.find(
        (e) => e.slug === field.relationTo,
      )?.flattenedFields
      if (flattenedFields) {
        currentFields = flattenedFields
      }

      if (segments.length === 1 && segments[0] === 'id') {
        return { field, localizedPath, pathHasLocalized }
      }
    }

    if ('blocks' in field) {
      for (const block of field.blocks) {
        const maybeField = getFieldByPath({
          config,
          fields: block.flattenedFields,
          includeRelationships,
          localizedPath,
          path: [...segments].join('.'),
        })

        if (maybeField) {
          return maybeField
        }
      }
    }

    currentField = field
  }

  if (!currentField) {
    return null
  }

  return { field: currentField, localizedPath, pathHasLocalized }
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldPermissions.spec.ts]---
Location: payload-main/packages/payload/src/utilities/getFieldPermissions.spec.ts

```typescript
import type { SanitizedDocumentPermissions } from '../auth/types.js'

import { getFieldPermissions } from './getFieldPermissions.js'

describe('getFieldPermissions with collection fallback', () => {
  const mockField = {
    name: 'testField',
    type: 'text' as const,
  }

  describe('fallback to collection permissions', () => {
    it('should enable read-only mode when field permissions are missing but collection has read access', () => {
      const fieldPermissions = {} // Empty/sanitized field permissions
      const collectionPermissions: SanitizedDocumentPermissions = {
        read: true,
        fields: {},
      }

      const result = getFieldPermissions({
        field: mockField,
        operation: 'update',
        parentName: '',
        permissions: fieldPermissions,
        collectionPermissions,
      })

      expect(result.read).toBe(true)
      expect(result.operation).toBe(false) // Should be read-only
      expect(result.permissions).toEqual({ read: true })
    })

    it('should respect existing field permissions when they exist', () => {
      const fieldPermissions = true // All permissions are true
      const collectionPermissions: SanitizedDocumentPermissions = {
        read: true,
        fields: {},
      }

      const result = getFieldPermissions({
        field: mockField,
        operation: 'update',
        parentName: '',
        permissions: fieldPermissions,
      })

      expect(result.read).toBe(true)
      expect(result.operation).toBe(true) // Should have operation permission
      expect(result.permissions).toBe(true)
    })

    it('should not provide access when neither field nor collection has read permission', () => {
      const fieldPermissions = {}
      const collectionPermissions: SanitizedDocumentPermissions = {
        // No read permission at collection level
        fields: {},
      }

      const result = getFieldPermissions({
        field: mockField,
        operation: 'update',
        parentName: '',
        permissions: fieldPermissions,
        collectionPermissions,
      })

      expect(result.read).toBe(false)
      expect(result.operation).toBe(false)
    })

    it('should work without collection permissions (backward compatibility)', () => {
      const fieldPermissions = true // All permissions

      const result = getFieldPermissions({
        field: mockField,
        operation: 'update',
        parentName: '',
        permissions: fieldPermissions,
        // No collectionPermissions provided
      })

      expect(result.read).toBe(true)
      expect(result.operation).toBe(true)
      expect(result.permissions).toBe(true)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getFieldPermissions.ts]---
Location: payload-main/packages/payload/src/utilities/getFieldPermissions.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  SanitizedDocumentPermissions,
  SanitizedFieldPermissions,
  SanitizedFieldsPermissions,
} from '../auth/types.js'
import type { ClientField, Field } from '../fields/config/types.js'
import type { Operation } from '../types/index.js'

/**
 * Gets read and operation-level permissions for a given field based on cascading field permissions.
 * @returns An object with the following properties:
 * - `operation`: Whether the user has permission to perform the operation on the field (`create` or `update`).
 * - `permissions`: The field-level permissions.
 * - `read`: Whether the user has permission to read the field.
 */
export const getFieldPermissions = ({
  collectionPermissions,
  field,
  operation,
  parentName,
  permissions,
}: {
  readonly collectionPermissions?: SanitizedDocumentPermissions
  readonly field: ClientField | Field
  readonly operation: Operation
  readonly parentName: string
  readonly permissions: SanitizedFieldPermissions | SanitizedFieldsPermissions
}): {
  operation: boolean
  /**
   * The field-level permissions. This can be equal to the permissions passed to the
   * `getFieldPermissions` function if the field has no name.
   */
  permissions: SanitizedFieldPermissions | SanitizedFieldsPermissions
  read: boolean
} => {
  // First, calculate permissions using the existing logic
  const fieldOperation =
    permissions === true ||
    permissions?.[operation as keyof typeof permissions] === true ||
    permissions?.[parentName as keyof typeof permissions] === true ||
    ('name' in field &&
      typeof permissions === 'object' &&
      permissions?.[field.name as keyof typeof permissions] &&
      (permissions[field.name as keyof typeof permissions] === true ||
        (operation in (permissions as any)[field.name] &&
          (permissions as any)[field.name][operation])))

  const fieldPermissions =
    permissions === undefined || permissions === null || permissions === true
      ? true
      : 'name' in field
        ? (permissions as any)[field.name]
        : permissions

  const fieldRead =
    permissions === true ||
    permissions?.read === true ||
    permissions?.[parentName as keyof typeof permissions] === true ||
    ('name' in field &&
      typeof permissions === 'object' &&
      permissions?.[field.name as keyof typeof permissions] &&
      ((permissions as any)[field.name] === true ||
        ('read' in (permissions as any)[field.name] && (permissions as any)[field.name].read)))

  // Check if field permissions are effectively empty/missing
  const hasFieldPermissions =
    permissions === true ||
    (typeof permissions === 'object' && permissions !== null && Object.keys(permissions).length > 0)

  // If no field permissions are defined, fallback to collection permissions
  if (!hasFieldPermissions && collectionPermissions) {
    const collectionRead = Boolean(collectionPermissions.read)
    let collectionOperation = false

    // Check operation-specific permission on collection
    if (operation === 'create' && 'create' in collectionPermissions) {
      collectionOperation = Boolean(collectionPermissions.create)
    } else if (operation === 'update') {
      collectionOperation = Boolean(collectionPermissions.update)
    }

    return {
      operation: collectionOperation,
      permissions: { read: collectionRead } as SanitizedFieldPermissions,
      read: collectionRead,
    }
  }

  // Return the calculated permissions
  return {
    operation: Boolean(fieldOperation),
    permissions: fieldPermissions,
    read: Boolean(fieldRead),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getObjectDotNotation.ts]---
Location: payload-main/packages/payload/src/utilities/getObjectDotNotation.ts

```typescript
/**
 *
 * @deprecated use getObjectDotNotation from `'payload/shared'` instead of `'payload'`
 *
 * @example
 *
 * ```ts
 * import { getObjectDotNotation } from 'payload/shared'
 *
 * const obj = { a: { b: { c: 42 } } }
 * const value = getObjectDotNotation<number>(obj, 'a.b.c', 0) // value is 42
 * const defaultValue = getObjectDotNotation<number>(obj, 'a.b.x', 0) // defaultValue is 0
 * ```
 */
export const getObjectDotNotation = <T>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T,
): T => {
  if (!path || !obj) {
    return defaultValue!
  }
  const result = path.split('.').reduce((o, i) => o?.[i] as Record<string, unknown>, obj)
  return result === undefined ? defaultValue! : (result as T)
}
```

--------------------------------------------------------------------------------

---[FILE: getRequestEntity.ts]---
Location: payload-main/packages/payload/src/utilities/getRequestEntity.ts

```typescript
import type { Collection } from '../collections/config/types.js'
import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { APIError } from '../errors/APIError.js'

export const getRequestCollection = (req: PayloadRequest): Collection => {
  const collectionSlug = req.routeParams?.collection

  if (typeof collectionSlug !== 'string') {
    throw new APIError(`No collection was specified`, 400)
  }

  const collection = req.payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(`Collection with the slug ${collectionSlug} was not found`, 404)
  }

  return collection
}

export const getRequestCollectionWithID = <T extends boolean>(
  req: PayloadRequest,
  {
    disableSanitize,
    optionalID,
  }: {
    disableSanitize?: T
    optionalID?: boolean
  } = {},
): {
  collection: Collection
  id: T extends true ? string : number | string
} => {
  const collection = getRequestCollection(req)
  const id = req.routeParams?.id

  if (typeof id !== 'string') {
    if (optionalID) {
      return {
        id: undefined!,
        collection,
      }
    }

    throw new APIError(`ID was not specified`, 400)
  }

  if (disableSanitize === true) {
    return {
      id,
      collection,
    }
  }

  let sanitizedID: number | string = id

  // If default db ID type is a number, we should sanitize
  let shouldSanitize = Boolean(req.payload.db.defaultIDType === 'number')

  // UNLESS the customIDType for this collection is text.... then we leave it
  if (shouldSanitize && collection.customIDType === 'text') {
    shouldSanitize = false
  }

  // If we still should sanitize, parse float
  if (shouldSanitize) {
    sanitizedID = parseFloat(sanitizedID)
  }

  return {
    // @ts-expect-error generic return
    id: sanitizedID,
    collection,
  }
}

export const getRequestGlobal = (req: PayloadRequest): SanitizedGlobalConfig => {
  const globalSlug = req.routeParams?.global

  if (typeof globalSlug !== 'string') {
    throw new APIError(`No global was specified`, 400)
  }

  const globalConfig = req.payload.globals.config.find((each) => each.slug === globalSlug)

  if (!globalConfig) {
    throw new APIError(`Global with the slug ${globalSlug} was not found`, 404)
  }

  return globalConfig
}
```

--------------------------------------------------------------------------------

---[FILE: getRequestLanguage.ts]---
Location: payload-main/packages/payload/src/utilities/getRequestLanguage.ts
Signals: Next.js

```typescript
import type { AcceptedLanguages } from '@payloadcms/translations'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies.js'

import { extractHeaderLanguage } from '@payloadcms/translations'

import type { SanitizedConfig } from '../config/types.js'

type GetRequestLanguageArgs = {
  config: SanitizedConfig
  cookies: Map<string, string> | ReadonlyRequestCookies
  defaultLanguage?: AcceptedLanguages
  headers: Request['headers']
}

export const getRequestLanguage = ({
  config,
  cookies,
  headers,
}: GetRequestLanguageArgs): AcceptedLanguages => {
  const supportedLanguageKeys = Object.keys(config.i18n.supportedLanguages) as AcceptedLanguages[]
  const langCookie = cookies.get(`${config.cookiePrefix || 'payload'}-lng`)

  const languageFromCookie: AcceptedLanguages = (
    typeof langCookie === 'string' ? langCookie : langCookie?.value
  ) as AcceptedLanguages

  if (languageFromCookie && supportedLanguageKeys.includes(languageFromCookie)) {
    return languageFromCookie
  }

  const languageFromHeader = headers.get('Accept-Language')
    ? extractHeaderLanguage(headers.get('Accept-Language')!)
    : undefined

  if (languageFromHeader && supportedLanguageKeys.includes(languageFromHeader)) {
    return languageFromHeader
  }

  return config.i18n.fallbackLanguage
}
```

--------------------------------------------------------------------------------

---[FILE: getSafeRedirect.spec.ts]---
Location: payload-main/packages/payload/src/utilities/getSafeRedirect.spec.ts

```typescript
import { getSafeRedirect } from './getSafeRedirect'

const fallback = '/admin' // default fallback if the input is unsafe or invalid

describe('getSafeRedirect', () => {
  // Valid - safe redirect paths
  it.each([['/dashboard'], ['/admin/settings'], ['/projects?id=123'], ['/hello-world']])(
    'should allow safe relative path: %s',
    (input) => {
      // If the input is a clean relative path, it should be returned as-is
      expect(getSafeRedirect({ redirectTo: input, fallbackTo: fallback })).toBe(input)
    },
  )

  // Invalid types or empty inputs
  it.each(['', null, undefined, 123, {}, []])(
    'should fallback on invalid or non-string input: %s',
    (input) => {
      // If the input is not a valid string, it should return the fallback
      expect(getSafeRedirect({ redirectTo: input as any, fallbackTo: fallback })).toBe(fallback)
    },
  )

  // Unsafe redirect patterns
  it.each([
    '//example.com', // protocol-relative URL
    '/javascript:alert(1)', // JavaScript scheme
    '/JavaScript:alert(1)', // case-insensitive JavaScript
    '/http://unknown.com', // disguised external redirect
    '/https://unknown.com', // disguised external redirect
    '/%2Funknown.com', // encoded slash — could resolve to //
    '/\\/unknown.com', // escaped slash
    '/\\\\unknown.com', // double escaped slashes
    '/\\unknown.com', // single escaped slash
    '%2F%2Funknown.com', // fully encoded protocol-relative path
    '%2Fjavascript:alert(1)', // encoded JavaScript scheme
  ])('should block unsafe redirect: %s', (input) => {
    // All of these should return the fallback because they’re unsafe
    expect(getSafeRedirect({ redirectTo: input, fallbackTo: fallback })).toBe(fallback)
  })

  // Input with extra spaces should still be properly handled
  it('should trim whitespace before evaluating', () => {
    // A valid path with surrounding spaces should still be accepted
    expect(getSafeRedirect({ redirectTo: '   /dashboard   ', fallbackTo: fallback })).toBe(
      '/dashboard',
    )

    // An unsafe path with spaces should still be rejected
    expect(getSafeRedirect({ redirectTo: '   //example.com   ', fallbackTo: fallback })).toBe(
      fallback,
    )
  })

  // If decoding the input fails (e.g., invalid percent encoding), it should not crash
  it('should return fallback on invalid encoding', () => {
    expect(getSafeRedirect({ redirectTo: '%E0%A4%A', fallbackTo: fallback })).toBe(fallback)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getSafeRedirect.ts]---
Location: payload-main/packages/payload/src/utilities/getSafeRedirect.ts

```typescript
export const getSafeRedirect = ({
  allowAbsoluteUrls = false,
  fallbackTo = '/',
  redirectTo,
}: {
  allowAbsoluteUrls?: boolean
  fallbackTo?: string
  redirectTo: string | string[]
}): string => {
  if (typeof redirectTo !== 'string') {
    return fallbackTo
  }

  // Normalize and decode the path
  let redirectPath: string
  try {
    redirectPath = decodeURIComponent(redirectTo.trim())
  } catch {
    return fallbackTo // invalid encoding
  }

  const isSafeRedirect =
    // Must start with a single forward slash (e.g., "/admin")
    redirectPath.startsWith('/') &&
    // Prevent protocol-relative URLs (e.g., "//example.com")
    !redirectPath.startsWith('//') &&
    // Prevent encoded slashes that could resolve to protocol-relative
    !redirectPath.startsWith('/%2F') &&
    // Prevent backslash-based escape attempts (e.g., "/\\/example.com", "/\\\\example.com", "/\\example.com")
    !redirectPath.startsWith('/\\/') &&
    !redirectPath.startsWith('/\\\\') &&
    !redirectPath.startsWith('/\\') &&
    // Prevent javascript-based schemes (e.g., "/javascript:alert(1)")
    !redirectPath.toLowerCase().startsWith('/javascript:') &&
    // Prevent attempts to redirect to full URLs using "/http:" or "/https:"
    !redirectPath.toLowerCase().startsWith('/http')

  const isAbsoluteSafeRedirect =
    allowAbsoluteUrls &&
    // Must be a valid absolute URL with http or https
    /^https?:\/\/\S+$/i.test(redirectPath)

  return isSafeRedirect || isAbsoluteSafeRedirect ? redirectPath : fallbackTo
}
```

--------------------------------------------------------------------------------

---[FILE: getSelectMode.ts]---
Location: payload-main/packages/payload/src/utilities/getSelectMode.ts

```typescript
import type { SelectMode, SelectType } from '../types/index.js'

export const getSelectMode = (select: SelectType): SelectMode => {
  for (const key in select) {
    const selectValue = select[key]
    if (selectValue === false) {
      return 'exclude'
    }

    if (typeof selectValue === 'object') {
      return getSelectMode(selectValue)
    }
  }

  return 'include'
}
```

--------------------------------------------------------------------------------

---[FILE: getSiblingData.ts]---
Location: payload-main/packages/payload/src/utilities/getSiblingData.ts

```typescript
import type { Data, FormState } from '../admin/types.js'

import { reduceFieldsToValues } from './reduceFieldsToValues.js'
import { unflatten } from './unflatten.js'

export const getSiblingData = (fields: FormState, path: string): Data => {
  if (!fields) {
    return null!
  }

  if (path.indexOf('.') === -1) {
    return reduceFieldsToValues(fields, true)
  }

  const siblingFields: Record<string, any> = {}

  // Determine if the last segment of the path is an array-based row
  const pathSegments = path.split('.')
  const lastSegment = pathSegments[pathSegments.length - 1]
  const lastSegmentIsRowIndex = !Number.isNaN(Number(lastSegment))

  let parentFieldPath: string

  if (lastSegmentIsRowIndex) {
    // If the last segment is a row index,
    // the sibling data is that row's contents
    // so create a parent field path that will
    // retrieve all contents of that row index only
    parentFieldPath = `${path}.`
  } else {
    // Otherwise, the last path segment is a field name
    // and it should be removed
    parentFieldPath = path.substring(0, path.lastIndexOf('.') + 1)
  }

  Object.keys(fields).forEach((fieldKey) => {
    if (!fields[fieldKey]?.disableFormData && fieldKey.indexOf(parentFieldPath) === 0) {
      siblingFields[fieldKey.replace(parentFieldPath, '')] = fields[fieldKey]?.value
    }
  })

  return unflatten(siblingFields)
}
```

--------------------------------------------------------------------------------

---[FILE: getTranslatedLabel.ts]---
Location: payload-main/packages/payload/src/utilities/getTranslatedLabel.ts

```typescript
import { getTranslation, type I18n } from '@payloadcms/translations'

import type { LabelFunction, StaticLabel } from '../config/types.js'

export const getTranslatedLabel = (
  label: LabelFunction | StaticLabel | undefined,
  i18n?: I18n,
): string | undefined => {
  if (typeof label === 'function') {
    return label({ i18n: i18n!, t: i18n!.t })
  }

  if (typeof label === 'object') {
    return getTranslation(label, i18n!)
  }

  return label
}
```

--------------------------------------------------------------------------------

---[FILE: getUniqueListBy.ts]---
Location: payload-main/packages/payload/src/utilities/getUniqueListBy.ts

```typescript
export function getUniqueListBy<T>(arr: T[], key: string): T[] {
  return [...new Map(arr.map((item) => [item[key as keyof T], item])).values()]
}
```

--------------------------------------------------------------------------------

---[FILE: getVersionsConfig.ts]---
Location: payload-main/packages/payload/src/utilities/getVersionsConfig.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { GlobalConfig } from '../globals/config/types.js'
import type { Autosave, SanitizedDrafts } from '../versions/types.js'

import { versionDefaults } from '../versions/defaults.js'

type EntityConfig = Pick<CollectionConfig | GlobalConfig, 'versions'>

/**
 * Check if an entity has drafts enabled
 */
export const hasDraftsEnabled = (config: EntityConfig): boolean => {
  return Boolean(config?.versions && typeof config.versions === 'object' && config.versions.drafts)
}

/**
 * Check if an entity has autosave enabled
 */
export const hasAutosaveEnabled = (
  config: EntityConfig,
): config is {
  versions: {
    drafts: { autosave: Autosave | false }
  }
} & EntityConfig => {
  return Boolean(
    config?.versions &&
      typeof config.versions === 'object' &&
      config.versions.drafts &&
      typeof config.versions.drafts === 'object' &&
      config.versions.drafts.autosave,
  )
}

/**
 * Check if an entity has validate drafts enabled
 */
export const hasDraftValidationEnabled = (config: EntityConfig): boolean => {
  return Boolean(
    config?.versions &&
      typeof config.versions === 'object' &&
      config.versions.drafts &&
      typeof config.versions.drafts === 'object' &&
      config.versions.drafts.validate,
  )
}

export const hasScheduledPublishEnabled = (
  config: EntityConfig,
): config is {
  versions: {
    drafts: { schedulePublish: SanitizedDrafts['schedulePublish'] }
  }
} & EntityConfig => {
  return Boolean(
    config?.versions &&
      typeof config.versions === 'object' &&
      config.versions.drafts &&
      typeof config.versions.drafts === 'object' &&
      config.versions.drafts.schedulePublish,
  )
}

/**
 * Get the maximum number of versions to keep for an entity
 * Returns maxPerDoc for collections or max for globals
 */
export const getVersionsMax = (config: EntityConfig): number => {
  if (!config?.versions || typeof config.versions !== 'object') {
    return 0
  }
  // Collections have maxPerDoc, globals have max
  if ('maxPerDoc' in config.versions) {
    return config.versions.maxPerDoc ?? 0
  }
  if ('max' in config.versions) {
    return config.versions.max ?? 0
  }
  return 0
}

export const getAutosaveInterval = (config: EntityConfig): number => {
  let interval = versionDefaults.autosaveInterval
  if (
    config?.versions &&
    typeof config.versions === 'object' &&
    config.versions.drafts &&
    typeof config.versions.drafts === 'object' &&
    config.versions.drafts.autosave &&
    typeof config.versions.drafts.autosave === 'object'
  ) {
    interval = config.versions.drafts.autosave.interval ?? versionDefaults.autosaveInterval
  }
  return interval
}
```

--------------------------------------------------------------------------------

````
