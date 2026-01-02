---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 225
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 225 of 695)

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

---[FILE: sanitizePermissions.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizePermissions.ts

```typescript
import type { MarkOptional } from 'ts-essentials'

import type {
  CollectionPermission,
  FieldPermissions,
  FieldsPermissions,
  GlobalPermission,
  Permissions,
  SanitizedBlocksPermissions,
  SanitizedFieldPermissions,
  SanitizedFieldsPermissions,
  SanitizedPermissions,
} from '../auth/types.js'

function checkAndSanitizeFieldsPermssions(data: FieldsPermissions): boolean {
  let allFieldPermissionsTrue = true
  for (const key in data) {
    if (typeof data[key] === 'object') {
      if (!checkAndSanitizePermissions(data[key])) {
        allFieldPermissionsTrue = false
      } else {
        ;(data[key] as unknown as SanitizedFieldPermissions) = true
      }
    } else if (data[key] !== true) {
      allFieldPermissionsTrue = false
    }
  }

  // If all values are true or it's an empty object, return true
  return allFieldPermissionsTrue
}

/**
 * Check if all permissions in a FieldPermissions, CollectionPermission or GlobalPermission object are true.
 * If nested fields or blocks are present, the function will recursively check those as well.
 */
function checkAndSanitizePermissions(
  _data: CollectionPermission | FieldPermissions | GlobalPermission,
): boolean {
  const data = _data as Record<string, any>
  /**
   * Check blocks permissions
   */
  let blocksPermissions = true
  if ('blocks' in data && data.blocks) {
    for (const blockSlug in data.blocks) {
      if (typeof data.blocks[blockSlug] === 'object') {
        for (const key in data.blocks[blockSlug]) {
          /**
           * Check fields in nested blocks
           */
          if (key === 'fields') {
            if (data.blocks[blockSlug].fields) {
              if (!checkAndSanitizeFieldsPermssions(data.blocks[blockSlug].fields)) {
                blocksPermissions = false
              } else {
                ;(data.blocks[blockSlug].fields as unknown as SanitizedFieldsPermissions) = true
              }
            }
          } else {
            if (typeof data.blocks[blockSlug][key] === 'object') {
              /**
               * Check Permissions in nested blocks
               */
              if (isPermissionObject(data.blocks[blockSlug][key])) {
                if (
                  data.blocks[blockSlug][key]['permission'] === true &&
                  !('where' in data.blocks[blockSlug][key])
                ) {
                  // If the permission is true and there is no where clause, set the key to true
                  data.blocks[blockSlug][key] = true
                  continue
                } else if (
                  data.blocks[blockSlug][key]['permission'] === true &&
                  'where' in data.blocks[blockSlug][key]
                ) {
                  // otherwise do nothing so we can keep the where clause
                  blocksPermissions = false
                } else {
                  blocksPermissions = false
                  data.blocks[blockSlug][key] = false
                  delete data.blocks[blockSlug][key]
                  continue
                }
              } else {
                throw new Error('Unexpected object in block permissions')
              }
            }
          }
        }
      } else if (data.blocks[blockSlug] !== true) {
        // If any value is not true, return false
        blocksPermissions = false
        delete data.blocks[blockSlug]
      }
    }
    if (blocksPermissions) {
      ;(data.blocks as unknown as SanitizedBlocksPermissions) = true
    }
  }

  /**
   * Check nested Fields permissions
   */
  let fieldsPermissions = true
  if (data.fields) {
    if (!checkAndSanitizeFieldsPermssions(data.fields)) {
      fieldsPermissions = false
    } else {
      ;(data.fields as unknown as SanitizedFieldsPermissions) = true
    }
  }

  /**
   * Check other Permissions objects (e.g. read, write)
   */
  let otherPermissions = true
  for (const key in data) {
    if (key === 'fields' || key === 'blocks') {
      continue
    }
    if (typeof data[key] === 'object') {
      if (isPermissionObject(data[key])) {
        if (data[key]['permission'] === true && !('where' in data[key])) {
          // If the permission is true and there is no where clause, set the key to true
          data[key] = true
          continue
        } else if (data[key]['permission'] === true && 'where' in data[key]) {
          // otherwise do nothing so we can keep the where clause
          otherPermissions = false
        } else {
          otherPermissions = false
          data[key] = false
          delete data[key]
          continue
        }
      } else {
        // eslint-disable-next-line no-console
        console.error('Unexpected object in fields permissions', data, 'key:', key)
        throw new Error('Unexpected object in fields permissions')
      }
    } else if (data[key] !== true) {
      // If any value is not true, return false
      otherPermissions = false
    }
  }

  // If all values are true or it's an empty object, return true
  return fieldsPermissions && blocksPermissions && otherPermissions
}

/**
 * Check if an object is a permission object.
 */
function isPermissionObject(data: unknown): boolean {
  return (
    typeof data === 'object' && 'permission' in data! && typeof data['permission'] === 'boolean'
  )
}

/**
 * Recursively remove empty objects from an object.
 */
function cleanEmptyObjects(obj: any): void {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursive call
      cleanEmptyObjects(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        // Delete the key if the object is empty
        delete obj[key]
      }
    } else if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  })
}

export function recursivelySanitizeCollections(obj: Permissions['collections']): void {
  if (typeof obj !== 'object') {
    return
  }

  const collectionPermissions = Object.values(obj)

  for (const collectionPermission of collectionPermissions) {
    checkAndSanitizePermissions(collectionPermission)
  }
}

export function recursivelySanitizeGlobals(obj: Permissions['globals']): void {
  if (typeof obj !== 'object') {
    return
  }

  const globalPermissions = Object.values(obj)

  for (const globalPermission of globalPermissions) {
    checkAndSanitizePermissions(globalPermission)
  }
}

/**
 * Recursively remove empty objects and false values from an object.
 *
 * @internal
 */
export function sanitizePermissions(
  data: MarkOptional<Permissions, 'canAccessAdmin'>,
): SanitizedPermissions {
  if (data.canAccessAdmin === false) {
    delete data.canAccessAdmin
  }

  if (data.collections) {
    recursivelySanitizeCollections(data.collections)
  }

  if (data.globals) {
    recursivelySanitizeGlobals(data.globals)
  }

  // Run clean up of empty objects at the end
  cleanEmptyObjects(data)

  return data as unknown as SanitizedPermissions
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizePopulateParam.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizePopulateParam.ts

```typescript
import type { PopulateType } from '../types/index.js'

import { sanitizeSelectParam } from './sanitizeSelectParam.js'

/**
 * Sanitizes REST populate query to PopulateType
 */
export const sanitizePopulateParam = (unsanitizedPopulate: unknown): PopulateType | undefined => {
  if (!unsanitizedPopulate || typeof unsanitizedPopulate !== 'object') {
    return
  }

  for (const k in unsanitizedPopulate) {
    ;(unsanitizedPopulate as Record<string, any>)[k] = sanitizeSelectParam(
      unsanitizedPopulate[k as keyof typeof unsanitizedPopulate],
    )
  }

  return unsanitizedPopulate as PopulateType
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeSelect.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeSelect.ts

```typescript
import { deepMergeSimple } from '@payloadcms/translations/utilities'

import type { FlattenedField } from '../fields/config/types.js'
import type { SelectIncludeType, SelectType } from '../types/index.js'

import { getSelectMode } from './getSelectMode.js'

// Transform post.title -> post, post.category.title -> post
const stripVirtualPathToCurrentCollection = ({
  fields,
  path,
  versions,
}: {
  fields: FlattenedField[]
  path: string
  versions: boolean
}) => {
  const resultSegments: string[] = []

  if (versions) {
    resultSegments.push('version')
    const versionField = fields.find((each) => each.name === 'version')

    if (versionField && versionField.type === 'group') {
      fields = versionField.flattenedFields
    }
  }

  for (const segment of path.split('.')) {
    const field = fields.find((each) => each.name === segment)

    if (!field) {
      continue
    }

    resultSegments.push(segment)

    if (field.type === 'relationship' || field.type === 'upload') {
      return resultSegments.join('.')
    }
  }

  return resultSegments.join('.')
}

const getAllVirtualRelations = ({ fields }: { fields: FlattenedField[] }) => {
  const result: string[] = []

  for (const field of fields) {
    if ('virtual' in field && typeof field.virtual === 'string') {
      result.push(field.virtual)
    } else if (field.type === 'group' || field.type === 'tab') {
      const nestedResult = getAllVirtualRelations({ fields: field.flattenedFields })

      for (const nestedItem of nestedResult) {
        result.push(nestedItem)
      }
    }
  }

  return result
}

const resolveVirtualRelationsToSelect = ({
  fields,
  selectValue,
  topLevelFields,
  versions,
}: {
  fields: FlattenedField[]
  selectValue: SelectIncludeType | true
  topLevelFields: FlattenedField[]
  versions: boolean
}) => {
  const result: string[] = []
  if (selectValue === true) {
    for (const item of getAllVirtualRelations({ fields })) {
      result.push(
        stripVirtualPathToCurrentCollection({ fields: topLevelFields, path: item, versions }),
      )
    }
  } else {
    for (const fieldName in selectValue) {
      const field = fields.find((each) => each.name === fieldName)
      if (!field) {
        continue
      }

      if ('virtual' in field && typeof field.virtual === 'string') {
        result.push(
          stripVirtualPathToCurrentCollection({
            fields: topLevelFields,
            path: field.virtual,
            versions,
          }),
        )
      } else if (field.type === 'group' || field.type === 'tab') {
        for (const item of resolveVirtualRelationsToSelect({
          fields: field.flattenedFields,
          selectValue: selectValue[fieldName]!,
          topLevelFields,
          versions,
        })) {
          result.push(
            stripVirtualPathToCurrentCollection({ fields: topLevelFields, path: item, versions }),
          )
        }
      }
    }
  }

  return result
}

export const sanitizeSelect = ({
  fields,
  forceSelect,
  select,
  versions,
}: {
  fields: FlattenedField[]
  forceSelect?: SelectType
  select?: SelectType
  versions?: boolean
}): SelectType | undefined => {
  if (!select) {
    return select
  }

  const selectMode = getSelectMode(select)

  if (selectMode === 'exclude') {
    return select
  }

  if (forceSelect) {
    select = deepMergeSimple(select, forceSelect)
  }

  if (select) {
    const virtualRelations = resolveVirtualRelationsToSelect({
      fields,
      selectValue: select as SelectIncludeType,
      topLevelFields: fields,
      versions: versions ?? false,
    })

    for (const path of virtualRelations) {
      let currentRef = select
      const segments = path.split('.')
      for (let i = 0; i < segments.length; i++) {
        const isLast = segments.length - 1 === i
        const segment = segments[i]!

        if (isLast) {
          currentRef[segment] = true
        } else {
          if (!(segment in currentRef)) {
            currentRef[segment] = {}
            currentRef = currentRef[segment]
          }
        }
      }
    }
  }

  return select
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeSelectParam.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeSelectParam.ts

```typescript
import type { SelectType } from '../types/index.js'

/**
 * Sanitizes REST select query to SelectType
 */
export const sanitizeSelectParam = (unsanitizedSelect: unknown): SelectType | undefined => {
  if (unsanitizedSelect && typeof unsanitizedSelect === 'object') {
    for (const _k in unsanitizedSelect) {
      const k = _k as keyof typeof unsanitizedSelect
      if (unsanitizedSelect[k] === 'true') {
        ;(unsanitizedSelect as Record<string, any>)[k] = true
      } else if (unsanitizedSelect[k] === 'false') {
        ;(unsanitizedSelect as Record<string, any>)[k] = false
      } else if (typeof unsanitizedSelect[k] === 'object') {
        sanitizeSelectParam(unsanitizedSelect[k])
      }
    }
  }

  return unsanitizedSelect as SelectType
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizeUserDataForEmail.spec.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeUserDataForEmail.spec.ts

```typescript
import { sanitizeUserDataForEmail } from './sanitizeUserDataForEmail'

describe('sanitizeUserDataForEmail', () => {
  it('should remove anchor tags', () => {
    const input = '<a href="https://example.com">Click me</a>'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Click me')
  })

  it('should remove script tags', () => {
    const unsanitizedData = '<script>alert</script>'
    const sanitizedData = sanitizeUserDataForEmail(unsanitizedData)
    expect(sanitizedData).toBe('alert')
  })

  it('should remove mixed-case script tags', () => {
    const input = '<ScRipT>alert(1)</sCrIpT>'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('alert1')
  })

  it('should remove embedded base64-encoded scripts', () => {
    const input = '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('')
  })

  it('should remove iframe elements', () => {
    const input = '<iframe src="malicious.com"></iframe>Frame'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Frame')
  })

  it('should remove javascript: links in attributes', () => {
    const input = '<a href="javascript:alert(1)">click</a>'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('click')
  })

  it('should remove mismatched script input', () => {
    const input = '<script>console.log("test")'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('console.log\"test\"')
  })

  it('should remove encoded scripts via HTML entities', () => {
    const input = '&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('alert1')
  })

  it('should remove template injection syntax', () => {
    const input = '{{7*7}}'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('77')
  })

  it('should remove invisible zero-width characters', () => {
    const input = 'a\u200Bler\u200Bt("XSS")'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('alert\"XSS\"')
  })

  it('should remove CSS expressions within style attributes', () => {
    const input = '<div style="width: expression(alert(\'XSS\'));">Hello</div>'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Hello')
  })

  it('should not render SVG with onload event', () => {
    const input = '<svg onload="alert(\'XSS\')">Graphic</svg>'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Graphic')
  })

  it('should not allow backtick-based patterns', () => {
    const input = '`alert("XSS")`'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('alert\"XSS\"')
  })

  it('should preserve allowed punctuation', () => {
    const input = `Hello "world" - it's safe!`
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe(`Hello "world" - it's safe!`)
  })

  it('should return empty string for non-string input', () => {
    expect(sanitizeUserDataForEmail(null)).toBe('')
    expect(sanitizeUserDataForEmail(undefined)).toBe('')
    expect(sanitizeUserDataForEmail(123)).toBe('')
    expect(sanitizeUserDataForEmail({})).toBe('')
  })

  it('should return empty string for an empty string', () => {
    expect(sanitizeUserDataForEmail('')).toBe('')
  })

  it('should collapse excessive whitespace', () => {
    const input = 'This    is \n\n a    test'
    expect(sanitizeUserDataForEmail(input)).toBe('This is a test')
  })

  it('should truncate to maxLength characters', () => {
    const input = 'a'.repeat(200)
    const result = sanitizeUserDataForEmail(input, 50)
    expect(result.length).toBe(50)
  })

  it('should remove characters outside allowed punctuation', () => {
    const input = 'Hello @#$%^*()_+=[]{}|\\~`'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Hello')
  })
  it('should sanitize syntax in regex-like input', () => {
    const input = '(?=XSS)(?:abc)'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('XSSabc')
  })

  it('should handle string of only control characters', () => {
    const input = '\x01\x02\x03\x04'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('')
  })

  it('should sanitize complex script attempt with mixed encoding', () => {
    const input = '&#x3C;script&#x3E;alert(String.fromCharCode(88,83,83))&#x3C;/script&#x3E;'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('alertString.fromCharCode88,83,83')
  })

  it('should handle deeply nested HTML tags correctly', () => {
    const input = `<div><section><article><p>Hello <strong>world <em>from <span>deep <a href="#">tags</a></span></em></strong></p></article></section></div>`
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('Hello world from deep tags')
  })

  it('should preserve accented Spanish characters', () => {
    const input = '¡Hola! ¿Cómo estás? ÁÉÍÓÚ ÜÑ ñáéíóú ü'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('¡Hola! ¿Cómo estás? ÁÉÍÓÚ ÜÑ ñáéíóú ü')
  })

  it('should preserve Arabic characters with diacritics', () => {
    const input = 'مَرْحَبًا بِكَ فِي الْمَوْقِعِ'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('مَرْحَبًا بِكَ فِي الْمَوْقِعِ')
  })

  it('should preserve Japanese characters', () => {
    const input = 'こんにちゎ、世界！！〆'
    const result = sanitizeUserDataForEmail(input)
    expect(result).toBe('こんにちゎ、世界！！〆')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: sanitizeUserDataForEmail.ts]---
Location: payload-main/packages/payload/src/utilities/sanitizeUserDataForEmail.ts

```typescript
/**
 * Sanitizes user data for emails to prevent injection of HTML, executable code, or other malicious content.
 * This function ensures the content is safe by:
 * - Removing HTML tags
 * - Removing control characters
 * - Normalizing whitespace
 * - Escaping special HTML characters
 * - Allowing only letters, numbers, spaces, and basic punctuation
 * - Limiting length (default 100 characters)
 *
 * @param data - data to sanitize
 * @param maxLength - maximum allowed length (default is 100)
 * @returns a sanitized string safe to include in email content
 */
export function sanitizeUserDataForEmail(data: unknown, maxLength = 100): string {
  if (typeof data !== 'string') {
    return ''
  }

  // Decode HTML numeric entities like &#x3C; or &#60;
  const decodedEntities = data
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))

  // Remove HTML tags
  const noTags = decodedEntities.replace(/<[^>]+>/g, '')

  const noInvisible = noTags.replace(/[\u200B-\u200F\u2028-\u202F\u2060-\u206F\uFEFF]/g, '')

  // Remove control characters except common whitespace
  const noControls = [...noInvisible]
    .filter((char) => {
      const code = char.charCodeAt(0)
      return (
        code >= 32 || // printable and above
        code === 9 || // tab
        code === 10 || // new line
        code === 13 // return
      )
    })
    .join('')

  // Remove '(?' and backticks `
  let noInjectionSyntax = noControls.replace(/\(\?/g, '').replace(/`/g, '')

  // {{...}} remove braces but keep inner content
  noInjectionSyntax = noInjectionSyntax.replace(/\{\{(.*?)\}\}/g, '$1')

  // Escape special HTML characters
  const escaped = noInjectionSyntax
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Normalize whitespace to single space
  const normalizedWhitespace = escaped.replace(/\s+/g, ' ')

  // Allow:
  // - Unicode letters (\p{L})
  // - Unicode numbers (\p{N})
  // - Unicode marks (\p{M}, e.g. accents)
  // - Unicode spaces (\p{Zs})
  // - Punctuation: common ascii + inverted ! and ?
  const allowedPunctuation = " .,!?'" + '"¡¿、！（）〆-'

  // Escape regex special characters
  const escapedPunct = allowedPunctuation.replace(/[[\]\\^$*+?.()|{}]/g, '\\$&')

  const pattern = `[^\\p{L}\\p{N}\\p{M}\\p{Zs}${escapedPunct}]`

  const cleaned = normalizedWhitespace.replace(new RegExp(pattern, 'gu'), '')

  // Trim and limit length, trim again to remove trailing spaces
  return cleaned.slice(0, maxLength).trim()
}
```

--------------------------------------------------------------------------------

---[FILE: setsAreEqual.ts]---
Location: payload-main/packages/payload/src/utilities/setsAreEqual.ts

```typescript
export const setsAreEqual = (xs: Set<unknown>, ys: Set<unknown>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x))
```

--------------------------------------------------------------------------------

---[FILE: slugify.ts]---
Location: payload-main/packages/payload/src/utilities/slugify.ts

```typescript
export const slugify = (val?: string): string | undefined =>
  val
    ?.replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()
```

--------------------------------------------------------------------------------

---[FILE: stripUnselectedFields.ts]---
Location: payload-main/packages/payload/src/utilities/stripUnselectedFields.ts

```typescript
import type { Data } from '../admin/types.js'
import type { Field, TabAsField } from '../fields/config/types.js'
import type { SelectMode, SelectType } from '../types/index.js'

import { fieldAffectsData } from '../fields/config/types.js'

/**
 * This is used for the Select API to strip out fields that are not selected.
 * It will mutate the given data object and determine if your recursive function should continue to run.
 * It is used within the `afterRead` hook as well as `getFormState`.
 * @returns boolean - whether or not the recursive function should continue
 */
export const stripUnselectedFields = ({
  field,
  select,
  selectMode,
  siblingDoc,
}: {
  field: Field | TabAsField
  select: SelectType
  selectMode: SelectMode
  siblingDoc: Data
}): boolean => {
  let shouldContinue = true

  if (fieldAffectsData(field) && select && selectMode && field.name) {
    if (selectMode === 'include') {
      if (!select[field.name]) {
        delete siblingDoc[field.name]
        shouldContinue = false
      }
    }

    if (selectMode === 'exclude') {
      if (select[field.name] === false) {
        delete siblingDoc[field.name]
        shouldContinue = false
      }
    }
  }

  return shouldContinue
}
```

--------------------------------------------------------------------------------

---[FILE: timestamp.ts]---
Location: payload-main/packages/payload/src/utilities/timestamp.ts

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

---[FILE: toKebabCase.ts]---
Location: payload-main/packages/payload/src/utilities/toKebabCase.ts

```typescript
export const toKebabCase = (string?: string) =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
```

--------------------------------------------------------------------------------

---[FILE: transformColumnPreferences.ts]---
Location: payload-main/packages/payload/src/utilities/transformColumnPreferences.ts

```typescript
import type { Column } from '../admin/types.js'
import type { ColumnPreference } from '../preferences/types.js'

export type ColumnsFromURL = string[]

/**
 * Transforms various forms of columns into `ColumnPreference[]` which is what is stored in the user's preferences table
 * In React state, for example, columns are stored in in their entirety, including React components: `[{ accessor: 'title', active: true, Label: React.ReactNode, ... }]`
 * In the URL, they are stored as an array of strings: `['title', '-slug']`, where the `-` prefix is used to indicate that the column is inactive
 * However in the database, columns must be in this exact shape: `[{ accessor: 'title', active: true }, { accessor: 'slug', active: false }]`
 * This means that when handling columns, they need to be consistently transformed back and forth
 */
export const transformColumnsToPreferences = (
  columns: Column[] | ColumnPreference[] | ColumnsFromURL | string | undefined,
): ColumnPreference[] | undefined => {
  if (!columns) {
    return undefined
  }

  let columnsToTransform = columns

  // Columns that originate from the URL are a stringified JSON array and need to be parsed first
  if (typeof columns === 'string') {
    try {
      columnsToTransform = JSON.parse(columns)
    } catch (e) {
      console.error('Error parsing columns', columns, e) // eslint-disable-line no-console
    }
  }

  if (columnsToTransform && Array.isArray(columnsToTransform)) {
    return columnsToTransform.map((col) => {
      if (typeof col === 'string') {
        const active = col[0] !== '-'
        return { accessor: active ? col : col.slice(1), active }
      }

      return { accessor: col.accessor, active: col.active }
    })
  }
}

/**
 * Does the opposite of `transformColumnsToPreferences`, where `ColumnPreference[]` and `Column[]` are transformed into `ColumnsFromURL`
 * This is useful for storing the columns in the URL, where it appears as a simple comma delimited array of strings
 * The `-` prefix is used to indicate that the column is inactive
 */
export const transformColumnsToSearchParams = (
  columns: Column[] | ColumnPreference[],
): ColumnsFromURL => {
  return columns?.map((col) => (col.active ? col.accessor : `-${col.accessor}`))
}
```

--------------------------------------------------------------------------------

---[FILE: transformWhereQuery.ts]---
Location: payload-main/packages/payload/src/utilities/transformWhereQuery.ts

```typescript
import type { Where } from '../types/index.js'

/**
 * Transforms a basic "where" query into a format in which the "where builder" can understand.
 * Even though basic queries are valid, we need to hoist them into the "and" / "or" format.
 * Use this function alongside `validateWhereQuery` to check that for valid queries before transforming.
 * @example
 * Inaccurate: [text][equals]=example%20post
 * Accurate: [or][0][and][0][text][equals]=example%20post
 */
export const transformWhereQuery = (whereQuery: Where): Where => {
  if (!whereQuery) {
    return {}
  }

  // Check if 'whereQuery' has 'or' field but no 'and'. This is the case for "correct" queries
  if (whereQuery.or && !whereQuery.and) {
    return {
      or: whereQuery.or.map((query) => {
        // ...but if the or query does not have an and, we need to add it
        if (!query.and) {
          return {
            and: [query],
          }
        }
        return query
      }),
    }
  }

  // Check if 'whereQuery' has 'and' field but no 'or'.
  if (whereQuery.and && !whereQuery.or) {
    return {
      or: [
        {
          and: whereQuery.and,
        },
      ],
    }
  }

  // Check if 'whereQuery' has neither 'or' nor 'and'.
  if (!whereQuery.or && !whereQuery.and) {
    return {
      or: [
        {
          and: [whereQuery], // top-level siblings are considered 'and'
        },
      ],
    }
  }

  // If 'whereQuery' has 'or' and 'and', just return it as it is.
  return whereQuery
}
```

--------------------------------------------------------------------------------

````
