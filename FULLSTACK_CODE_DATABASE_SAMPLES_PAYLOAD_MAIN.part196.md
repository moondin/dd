---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 196
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 196 of 695)

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

---[FILE: README.md]---
Location: payload-main/packages/payload/src/exports/README.md

```text
Important:

When you export anything with a scss or svg, or any component with a hook, it should be exported from a file within payload/components
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/packages/payload/src/exports/shared.ts

```typescript
export {
  generateCookie,
  generateExpiredPayloadCookie,
  generatePayloadCookie,
  getCookieExpiration,
  parseCookies,
} from '../auth/cookies.js'
export { getLoginOptions } from '../auth/getLoginOptions.js'
export { addSessionToUser, removeExpiredSessions } from '../auth/sessions.js'
export { getFromImportMap } from '../bin/generateImportMap/utilities/getFromImportMap.js'
export { parsePayloadComponent } from '../bin/generateImportMap/utilities/parsePayloadComponent.js'
export { defaults as collectionDefaults } from '../collections/config/defaults.js'

export { serverProps } from '../config/types.js'

export { type Slugify } from '../fields/baseFields/slug/index.js'

export { defaultTimezones } from '../fields/baseFields/timezone/defaultTimezones.js'

export {
  fieldAffectsData,
  fieldHasMaxDepth,
  fieldHasSubFields,
  fieldIsArrayType,
  fieldIsBlockType,
  fieldIsGroupType,
  fieldIsHiddenOrDisabled,
  fieldIsID,
  fieldIsLocalized,
  fieldIsPresentationalOnly,
  fieldIsSidebar,
  fieldIsVirtual,
  fieldShouldBeLocalized,
  fieldSupportsMany,
  groupHasName,
  optionIsObject,
  optionIsValue,
  optionsAreObjects,
  tabHasName,
  valueIsValueWithRelation,
} from '../fields/config/types.js'

export { getFieldPaths } from '../fields/getFieldPaths.js'
export * from '../fields/validations.js'

export type {
  FolderBreadcrumb,
  FolderDocumentItemKey,
  FolderEnabledColection,
  FolderInterface,
  FolderOrDocument,
  GetFolderDataResult,
  Subfolder,
} from '../folders/types.js'

export { buildFolderWhereConstraints } from '../folders/utils/buildFolderWhereConstraints.js'
export { formatFolderOrDocumentItem } from '../folders/utils/formatFolderOrDocumentItem.js'
export { validOperators, validOperatorSet } from '../types/constants.js'

export { formatFilesize } from '../uploads/formatFilesize.js'

export { isImage } from '../uploads/isImage.js'
export { appendUploadSelectFields } from '../utilities/appendUploadSelectFields.js'
export { applyLocaleFiltering } from '../utilities/applyLocaleFiltering.js'
export { combineWhereConstraints } from '../utilities/combineWhereConstraints.js'

export {
  deepCopyObject,
  deepCopyObjectComplex,
  deepCopyObjectSimple,
  deepCopyObjectSimpleWithoutReactComponents,
} from '../utilities/deepCopyObject.js'

export {
  deepMerge,
  deepMergeWithCombinedArrays,
  deepMergeWithReactComponents,
  deepMergeWithSourceArrays,
} from '../utilities/deepMerge.js'
export { extractID } from '../utilities/extractID.js'

export { flattenAllFields } from '../utilities/flattenAllFields.js'

export { flattenTopLevelFields } from '../utilities/flattenTopLevelFields.js'
export { formatAdminURL } from '../utilities/formatAdminURL.js'
export { formatApiURL } from '../utilities/formatApiURL.js'
export { formatLabels, toWords } from '../utilities/formatLabels.js'
export { getBestFitFromSizes } from '../utilities/getBestFitFromSizes.js'

export { getDataByPath } from '../utilities/getDataByPath.js'
export { getFieldPermissions } from '../utilities/getFieldPermissions.js'
export { getObjectDotNotation } from '../utilities/getObjectDotNotation.js'
export { getSafeRedirect } from '../utilities/getSafeRedirect.js'

export { getSelectMode } from '../utilities/getSelectMode.js'

export { getSiblingData } from '../utilities/getSiblingData.js'

export { getUniqueListBy } from '../utilities/getUniqueListBy.js'

export {
  getAutosaveInterval,
  getVersionsMax,
  hasAutosaveEnabled,
  hasDraftsEnabled,
  hasDraftValidationEnabled,
  hasScheduledPublishEnabled,
} from '../utilities/getVersionsConfig.js'

export { isNextBuild } from '../utilities/isNextBuild.js'

export { isNumber } from '../utilities/isNumber.js'

export { isPlainObject } from '../utilities/isPlainObject.js'

export {
  isReactClientComponent,
  isReactComponentOrFunction,
  isReactServerComponentOrFunction,
} from '../utilities/isReactComponent.js'

export {
  hoistQueryParamsToAnd,
  mergeListSearchAndWhere,
} from '../utilities/mergeListSearchAndWhere.js'

export { reduceFieldsToValues } from '../utilities/reduceFieldsToValues.js'

export { sanitizeUserDataForEmail } from '../utilities/sanitizeUserDataForEmail.js'

export { setsAreEqual } from '../utilities/setsAreEqual.js'

export { slugify } from '../utilities/slugify.js'

export { toKebabCase } from '../utilities/toKebabCase.js'

export {
  transformColumnsToPreferences,
  transformColumnsToSearchParams,
} from '../utilities/transformColumnPreferences.js'

export { transformWhereQuery } from '../utilities/transformWhereQuery.js'

export { unflatten } from '../utilities/unflatten.js'
export { validateMimeType } from '../utilities/validateMimeType.js'
export { validateWhereQuery } from '../utilities/validateWhereQuery.js'
export { wait } from '../utilities/wait.js'
export { wordBoundariesRegex } from '../utilities/wordBoundariesRegex.js'
export { versionDefaults } from '../versions/defaults.js'

export { deepMergeSimple } from '@payloadcms/translations/utilities'
```

--------------------------------------------------------------------------------

---[FILE: ar.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ar.ts

```typescript
export { ar } from '@payloadcms/translations/languages/ar'
```

--------------------------------------------------------------------------------

---[FILE: az.ts]---
Location: payload-main/packages/payload/src/exports/i18n/az.ts

```typescript
export { az } from '@payloadcms/translations/languages/az'
```

--------------------------------------------------------------------------------

---[FILE: bg.ts]---
Location: payload-main/packages/payload/src/exports/i18n/bg.ts

```typescript
export { bg } from '@payloadcms/translations/languages/bg'
```

--------------------------------------------------------------------------------

---[FILE: ca.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ca.ts

```typescript
export { ca } from '@payloadcms/translations/languages/ca'
```

--------------------------------------------------------------------------------

---[FILE: cs.ts]---
Location: payload-main/packages/payload/src/exports/i18n/cs.ts

```typescript
export { cs } from '@payloadcms/translations/languages/cs'
```

--------------------------------------------------------------------------------

---[FILE: da.ts]---
Location: payload-main/packages/payload/src/exports/i18n/da.ts

```typescript
export { da } from '@payloadcms/translations/languages/da'
```

--------------------------------------------------------------------------------

---[FILE: de.ts]---
Location: payload-main/packages/payload/src/exports/i18n/de.ts

```typescript
export { de } from '@payloadcms/translations/languages/de'
```

--------------------------------------------------------------------------------

---[FILE: en.ts]---
Location: payload-main/packages/payload/src/exports/i18n/en.ts

```typescript
export { en } from '@payloadcms/translations/languages/en'
```

--------------------------------------------------------------------------------

---[FILE: es.ts]---
Location: payload-main/packages/payload/src/exports/i18n/es.ts

```typescript
export { es } from '@payloadcms/translations/languages/es'
```

--------------------------------------------------------------------------------

---[FILE: et.ts]---
Location: payload-main/packages/payload/src/exports/i18n/et.ts

```typescript
export { et } from '@payloadcms/translations/languages/et'
```

--------------------------------------------------------------------------------

---[FILE: fa.ts]---
Location: payload-main/packages/payload/src/exports/i18n/fa.ts

```typescript
export { fa } from '@payloadcms/translations/languages/fa'
```

--------------------------------------------------------------------------------

---[FILE: fr.ts]---
Location: payload-main/packages/payload/src/exports/i18n/fr.ts

```typescript
export { fr } from '@payloadcms/translations/languages/fr'
```

--------------------------------------------------------------------------------

---[FILE: he.ts]---
Location: payload-main/packages/payload/src/exports/i18n/he.ts

```typescript
export { he } from '@payloadcms/translations/languages/he'
```

--------------------------------------------------------------------------------

---[FILE: hr.ts]---
Location: payload-main/packages/payload/src/exports/i18n/hr.ts

```typescript
export { hr } from '@payloadcms/translations/languages/hr'
```

--------------------------------------------------------------------------------

---[FILE: hu.ts]---
Location: payload-main/packages/payload/src/exports/i18n/hu.ts

```typescript
export { hu } from '@payloadcms/translations/languages/hu'
```

--------------------------------------------------------------------------------

---[FILE: hy.ts]---
Location: payload-main/packages/payload/src/exports/i18n/hy.ts

```typescript
export { hy } from '@payloadcms/translations/languages/hy'
```

--------------------------------------------------------------------------------

---[FILE: id.ts]---
Location: payload-main/packages/payload/src/exports/i18n/id.ts

```typescript
export { id } from '@payloadcms/translations/languages/id'
```

--------------------------------------------------------------------------------

---[FILE: is.ts]---
Location: payload-main/packages/payload/src/exports/i18n/is.ts

```typescript
export { is } from '@payloadcms/translations/languages/is'
```

--------------------------------------------------------------------------------

---[FILE: it.ts]---
Location: payload-main/packages/payload/src/exports/i18n/it.ts

```typescript
export { it } from '@payloadcms/translations/languages/it'
```

--------------------------------------------------------------------------------

---[FILE: ja.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ja.ts

```typescript
export { ja } from '@payloadcms/translations/languages/ja'
```

--------------------------------------------------------------------------------

---[FILE: ko.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ko.ts

```typescript
export { ko } from '@payloadcms/translations/languages/ko'
```

--------------------------------------------------------------------------------

---[FILE: lt.ts]---
Location: payload-main/packages/payload/src/exports/i18n/lt.ts

```typescript
export { lt } from '@payloadcms/translations/languages/lt'
```

--------------------------------------------------------------------------------

---[FILE: lv.ts]---
Location: payload-main/packages/payload/src/exports/i18n/lv.ts

```typescript
export { lv } from '@payloadcms/translations/languages/lv'
```

--------------------------------------------------------------------------------

---[FILE: my.ts]---
Location: payload-main/packages/payload/src/exports/i18n/my.ts

```typescript
export { my } from '@payloadcms/translations/languages/my'
```

--------------------------------------------------------------------------------

---[FILE: nb.ts]---
Location: payload-main/packages/payload/src/exports/i18n/nb.ts

```typescript
export { nb } from '@payloadcms/translations/languages/nb'
```

--------------------------------------------------------------------------------

---[FILE: nl.ts]---
Location: payload-main/packages/payload/src/exports/i18n/nl.ts

```typescript
export { nl } from '@payloadcms/translations/languages/nl'
```

--------------------------------------------------------------------------------

---[FILE: pl.ts]---
Location: payload-main/packages/payload/src/exports/i18n/pl.ts

```typescript
export { pl } from '@payloadcms/translations/languages/pl'
```

--------------------------------------------------------------------------------

---[FILE: pt.ts]---
Location: payload-main/packages/payload/src/exports/i18n/pt.ts

```typescript
export { pt } from '@payloadcms/translations/languages/pt'
```

--------------------------------------------------------------------------------

---[FILE: ro.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ro.ts

```typescript
export { ro } from '@payloadcms/translations/languages/ro'
```

--------------------------------------------------------------------------------

---[FILE: rs.ts]---
Location: payload-main/packages/payload/src/exports/i18n/rs.ts

```typescript
export { rs } from '@payloadcms/translations/languages/rs'
```

--------------------------------------------------------------------------------

---[FILE: rsLatin.ts]---
Location: payload-main/packages/payload/src/exports/i18n/rsLatin.ts

```typescript
export { rsLatin } from '@payloadcms/translations/languages/rsLatin'
```

--------------------------------------------------------------------------------

---[FILE: ru.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ru.ts

```typescript
export { ru } from '@payloadcms/translations/languages/ru'
```

--------------------------------------------------------------------------------

---[FILE: sl.ts]---
Location: payload-main/packages/payload/src/exports/i18n/sl.ts

```typescript
export { sl } from '@payloadcms/translations/languages/sl'
```

--------------------------------------------------------------------------------

---[FILE: sv.ts]---
Location: payload-main/packages/payload/src/exports/i18n/sv.ts

```typescript
export { sv } from '@payloadcms/translations/languages/sv'
```

--------------------------------------------------------------------------------

---[FILE: ta.ts]---
Location: payload-main/packages/payload/src/exports/i18n/ta.ts

```typescript
export { ta } from '@payloadcms/translations/languages/ta'
```

--------------------------------------------------------------------------------

---[FILE: th.ts]---
Location: payload-main/packages/payload/src/exports/i18n/th.ts

```typescript
export { th } from '@payloadcms/translations/languages/th'
```

--------------------------------------------------------------------------------

---[FILE: tr.ts]---
Location: payload-main/packages/payload/src/exports/i18n/tr.ts

```typescript
export { tr } from '@payloadcms/translations/languages/tr'
```

--------------------------------------------------------------------------------

---[FILE: uk.ts]---
Location: payload-main/packages/payload/src/exports/i18n/uk.ts

```typescript
export { uk } from '@payloadcms/translations/languages/uk'
```

--------------------------------------------------------------------------------

---[FILE: vi.ts]---
Location: payload-main/packages/payload/src/exports/i18n/vi.ts

```typescript
export { vi } from '@payloadcms/translations/languages/vi'
```

--------------------------------------------------------------------------------

---[FILE: zh.ts]---
Location: payload-main/packages/payload/src/exports/i18n/zh.ts

```typescript
export { zh } from '@payloadcms/translations/languages/zh'
```

--------------------------------------------------------------------------------

---[FILE: zhTw.ts]---
Location: payload-main/packages/payload/src/exports/i18n/zhTw.ts

```typescript
export { zhTw } from '@payloadcms/translations/languages/zhTw'
```

--------------------------------------------------------------------------------

---[FILE: getDefaultValue.ts]---
Location: payload-main/packages/payload/src/fields/getDefaultValue.ts

```typescript
import type { DefaultValue, JsonValue, PayloadRequest } from '../types/index.js'

import { deepCopyObjectSimple } from '../utilities/deepCopyObject.js'

type Args = {
  defaultValue: DefaultValue
  locale: string | undefined
  req: PayloadRequest
  user: PayloadRequest['user']
  value?: JsonValue
}

export const getDefaultValue = async ({
  defaultValue,
  locale,
  req,
  user,
  value,
}: Args): Promise<JsonValue> => {
  if (typeof value !== 'undefined') {
    return value
  }

  if (defaultValue && typeof defaultValue === 'function') {
    return await defaultValue({ locale, req, user })
  }

  if (typeof defaultValue === 'object') {
    return deepCopyObjectSimple(defaultValue)
  }

  return defaultValue
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldPaths.ts]---
Location: payload-main/packages/payload/src/fields/getFieldPaths.ts

```typescript
import type { ClientField, Field, Tab, TabAsFieldClient } from './config/types.js'

type Args = {
  field: ClientField | Field | Tab | TabAsFieldClient
  index: number
  parentIndexPath: string
  parentPath: string
  parentSchemaPath: string
}

type FieldPaths = {
  /**
   * A string of '-' separated indexes representing where
   * to find this field in a given field schema array.
   * It will always be complete and accurate.
   */
  indexPath: string
  /**
   * Path for this field relative to its position in the data.
   */
  path: string
  /**
   * Path for this field relative to its position in the schema.
   */
  schemaPath: string
}

export function getFieldPaths({
  field,
  index,
  parentIndexPath,
  parentPath,
  parentSchemaPath,
}: Args): FieldPaths {
  if ('name' in field) {
    return {
      indexPath: `${parentIndexPath ? parentIndexPath + '-' : ''}${index}`,
      path: `${parentPath ? parentPath + '.' : ''}${field.name}`,
      schemaPath: `${parentSchemaPath ? parentSchemaPath + '.' : ''}${field.name}`,
    }
  }

  const indexSuffix = `_index-${`${parentIndexPath ? parentIndexPath + '-' : ''}${index}`}`

  return {
    indexPath: `${parentIndexPath ? parentIndexPath + '-' : ''}${index}`,
    path: `${parentPath ? parentPath + '.' : ''}${indexSuffix}`,
    schemaPath: `${parentSchemaPath ? parentSchemaPath + '.' : ''}${indexSuffix}`,
  }
}

/**
 * @deprecated - will be removed in 4.0. Use `getFieldPaths` instead.
 */
export function getFieldPathsModified({
  field,
  index,
  parentIndexPath,
  parentPath,
  parentSchemaPath,
}: Args): FieldPaths {
  const parentPathSegments = parentPath.split('.')

  const parentIsUnnamed = parentPathSegments[parentPathSegments.length - 1]!.startsWith('_index-')

  const parentWithoutIndex = parentIsUnnamed
    ? parentPathSegments.slice(0, -1).join('.')
    : parentPath

  const parentPathToUse = parentIsUnnamed ? parentWithoutIndex : parentPath

  if ('name' in field) {
    return {
      indexPath: '',
      path: `${parentPathToUse ? parentPathToUse + '.' : ''}${field.name}`,
      schemaPath: `${parentSchemaPath ? parentSchemaPath + '.' : ''}${field.name}`,
    }
  }

  const indexSuffix = `_index-${`${parentIndexPath ? parentIndexPath + '-' : ''}${index}`}`

  return {
    indexPath: `${parentIndexPath ? parentIndexPath + '-' : ''}${index}`,
    path: `${parentPathToUse ? parentPathToUse + '.' : ''}${indexSuffix}`,
    schemaPath: `${!parentIsUnnamed && parentSchemaPath ? parentSchemaPath + '.' : ''}${indexSuffix}`,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: mergeBaseFields.ts]---
Location: payload-main/packages/payload/src/fields/mergeBaseFields.ts

```typescript
import type { Field, FieldWithSubFields } from './config/types.js'

import { deepMergeWithReactComponents } from '../utilities/deepMerge.js'
import { fieldAffectsData, fieldHasSubFields } from './config/types.js'

export const mergeBaseFields = (fields: Field[], baseFields: Field[]): Field[] => {
  const mergedFields = [...(fields || [])]

  baseFields.forEach((baseField) => {
    let matchedIndex: null | number = null

    if (fieldAffectsData(baseField)) {
      const match = mergedFields.find((field, i) => {
        if (fieldAffectsData(field) && field.name === baseField.name) {
          matchedIndex = i
          return true
        }

        return false
      })

      if (match) {
        const matchCopy: Field = { ...match }
        mergedFields.splice(matchedIndex!, 1)

        const mergedField = deepMergeWithReactComponents<Field>(baseField, matchCopy)

        if (fieldHasSubFields(baseField) && fieldHasSubFields(matchCopy)) {
          ;(mergedField as FieldWithSubFields).fields = mergeBaseFields(
            matchCopy.fields,
            baseField.fields,
          )
        }

        mergedFields.push(mergedField)
      } else {
        mergedFields.push(baseField)
      }
    }
  })

  return mergedFields
}
```

--------------------------------------------------------------------------------

---[FILE: setDefaultBeforeDuplicate.ts]---
Location: payload-main/packages/payload/src/fields/setDefaultBeforeDuplicate.ts

```typescript
// @ts-strict-ignore
// default beforeDuplicate hook for required and unique fields
import { type FieldAffectingData, type FieldHook, fieldShouldBeLocalized } from './config/types.js'

const isStringValue = (value: unknown) => typeof value === 'string' && value.trim() !== ''
const unique: FieldHook = ({ value }) => (isStringValue(value) ? `${value} - Copy` : undefined)
const localizedUnique: FieldHook = ({ req, value }) =>
  isStringValue(value) ? `${value} - ${req?.t('general:copy') ?? 'Copy'}` : undefined

export const setDefaultBeforeDuplicate = (
  field: FieldAffectingData,
  parentIsLocalized: boolean,
) => {
  if (
    (('required' in field && field.required) || field.unique) &&
    'hooks' in field &&
    (!field.hooks?.beforeDuplicate ||
      (Array.isArray(field.hooks.beforeDuplicate) && field.hooks.beforeDuplicate.length === 0))
  ) {
    if (field.unique) {
      if (['email', 'number', 'point', 'relationship', 'select', 'upload'].includes(field.type)) {
        field.hooks!.beforeDuplicate = [() => undefined]
      } else if (['code', 'json', 'text', 'textarea'].includes(field.type)) {
        field.hooks!.beforeDuplicate = fieldShouldBeLocalized({ field, parentIsLocalized })
          ? [localizedUnique]
          : [unique]
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sortableFieldTypes.ts]---
Location: payload-main/packages/payload/src/fields/sortableFieldTypes.ts

```typescript
export const sortableFieldTypes = [
  'text',
  'textarea',
  'code',
  'json',
  'number',
  'email',
  'radio',
  'select',
  'date',
]
```

--------------------------------------------------------------------------------

````
