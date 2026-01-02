---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 130
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 130 of 695)

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

---[FILE: transform.ts]---
Location: payload-main/packages/db-mongodb/src/utilities/transform.ts

```typescript
import type {
  CollectionConfig,
  DateField,
  Field,
  FlattenedBlock,
  FlattenedField,
  JoinField,
  RelationshipField,
  SanitizedConfig,
  TraverseFieldsCallback,
  UploadField,
} from 'payload'

import { Types } from 'mongoose'
import { flattenAllFields, traverseFields } from 'payload'
import { fieldAffectsData, fieldShouldBeLocalized } from 'payload/shared'

import type { MongooseAdapter } from '../index.js'

import { isObjectID } from './isObjectID.js'

interface RelationObject {
  relationTo: string
  value: number | string
}

function isValidRelationObject(value: unknown): value is RelationObject {
  return typeof value === 'object' && value !== null && 'relationTo' in value && 'value' in value
}

/**
 * Process relationship values for polymorphic and simple relationships
 * Used by both $push and $remove operations
 */
const processRelationshipValues = (
  items: unknown[],
  field: RelationshipField | UploadField,
  config: SanitizedConfig,
  operation: 'read' | 'write',
  validateRelationships: boolean,
  adapter: MongooseAdapter,
) => {
  return items.map((item) => {
    // Handle polymorphic relationships
    if (Array.isArray(field.relationTo) && isValidRelationObject(item)) {
      const relatedCollection = config.collections?.find(({ slug }) => slug === item.relationTo)
      if (relatedCollection) {
        return {
          relationTo: item.relationTo,
          value: convertRelationshipValue({
            adapter,
            operation,
            relatedCollection,
            validateRelationships,
            value: item.value,
          }),
        }
      }
      return item
    }

    // Handle simple relationships
    if (typeof field.relationTo === 'string') {
      const relatedCollection = config.collections?.find(({ slug }) => slug === field.relationTo)
      if (relatedCollection) {
        return convertRelationshipValue({
          adapter,
          operation,
          relatedCollection,
          validateRelationships,
          value: item,
        })
      }
    }

    return item
  })
}

const convertRelationshipValue = ({
  adapter,
  operation,
  relatedCollection,
  validateRelationships,
  value,
}: {
  adapter: MongooseAdapter
  operation: Args['operation']
  relatedCollection: CollectionConfig
  validateRelationships?: boolean
  value: unknown
}) => {
  const customIDField = relatedCollection.fields.find(
    (field) => fieldAffectsData(field) && field.name === 'id',
  )

  if (operation === 'read') {
    if (isObjectID(value)) {
      return value.toHexString()
    }

    if (
      customIDField?.type === 'number' &&
      typeof value === 'bigint' &&
      adapter.useBigIntForNumberIDs
    ) {
      return Number(value)
    }

    return value
  }

  if (customIDField) {
    return value
  }

  if (typeof value === 'string') {
    try {
      return new Types.ObjectId(value)
    } catch (e) {
      if (validateRelationships) {
        throw e
      }
      return value
    }
  }

  return value
}

const sanitizeRelationship = ({
  adapter,
  config,
  field,
  locale,
  operation,
  ref,
  validateRelationships,
  value,
}: {
  adapter: MongooseAdapter
  config: SanitizedConfig
  field: JoinField | RelationshipField | UploadField
  locale?: string
  operation: Args['operation']
  ref: Record<string, unknown>
  validateRelationships?: boolean
  value?: unknown
}) => {
  if (field.type === 'join') {
    if (
      operation === 'read' &&
      value &&
      typeof value === 'object' &&
      'docs' in value &&
      Array.isArray(value.docs)
    ) {
      for (let i = 0; i < value.docs.length; i++) {
        const item = value.docs[i]

        if (isObjectID(item)) {
          value.docs[i] = item.toHexString()
        } else if (Array.isArray(field.collection) && item) {
          // Fields here for polymorphic joins cannot be determinted, JSON.parse needed
          value.docs[i] = JSON.parse(JSON.stringify(value.docs[i]))
        }
      }
    }

    return value
  }
  let relatedCollection: CollectionConfig | undefined
  let result = value

  const hasManyRelations = typeof field.relationTo !== 'string'

  if (!hasManyRelations) {
    relatedCollection = config.collections?.find(({ slug }) => slug === field.relationTo)
  }

  if (Array.isArray(value)) {
    result = value.map((val) => {
      // Handle has many - polymorphic
      if (isValidRelationObject(val)) {
        const relatedCollectionForSingleValue = config.collections?.find(
          ({ slug }) => slug === val.relationTo,
        )

        if (relatedCollectionForSingleValue) {
          return {
            relationTo: val.relationTo,
            value: convertRelationshipValue({
              adapter,
              operation,
              relatedCollection: relatedCollectionForSingleValue,
              validateRelationships,
              value: val.value,
            }),
          }
        }
      }

      if (relatedCollection) {
        return convertRelationshipValue({
          adapter,
          operation,
          relatedCollection,
          validateRelationships,
          value: val,
        })
      }

      return val
    })
  }
  // Handle has one - polymorphic
  else if (isValidRelationObject(value)) {
    relatedCollection = config.collections?.find(({ slug }) => slug === value.relationTo)

    if (relatedCollection) {
      result = {
        relationTo: value.relationTo,
        value: convertRelationshipValue({
          adapter,
          operation,
          relatedCollection,
          validateRelationships,
          value: value.value,
        }),
      }
    }
  }
  // Handle has one
  else if (relatedCollection) {
    result = convertRelationshipValue({
      adapter,
      operation,
      relatedCollection,
      validateRelationships,
      value,
    })
  }

  if (locale) {
    ref[locale] = result
  } else {
    ref[field.name] = result
  }
}

const sanitizeDate = ({
  field,
  locale,
  ref,
  value,
}: {
  field: DateField
  locale?: string
  ref: Record<string, unknown>
  value: unknown
}) => {
  if (!value) {
    return
  }

  if (value instanceof Date) {
    value = value.toISOString()
  }

  if (locale) {
    ref[locale] = value
  } else {
    ref[field.name] = value
  }
}

type Args = {
  $addToSet?: Record<string, { $each: any[] } | any>
  $inc?: Record<string, number>
  $pull?: Record<string, { $in: any[] } | any>
  $push?: Record<string, { $each: any[] } | any>
  /** instance of the adapter */
  adapter: MongooseAdapter
  /** data to transform, can be an array of documents or a single document */
  data: Record<string, unknown> | Record<string, unknown>[]
  /** fields accossiated with the data */
  fields: Field[]
  /** slug of the global, pass only when the operation is `write` */
  globalSlug?: string
  /**
   * Type of the operation
   * read - sanitizes ObjectIDs, Date to strings.
   * write - sanitizes string relationships to ObjectIDs.
   */
  operation: 'read' | 'write'
  parentIsLocalized?: boolean
  /**
   * Throw errors on invalid relationships
   * @default true
   */
  validateRelationships?: boolean
}

const stripFields = ({
  config,
  data,
  fields,
  parentIsLocalized = false,
  reservedKeys = [],
}: {
  config: SanitizedConfig
  data: any
  fields: FlattenedField[]
  parentIsLocalized?: boolean
  reservedKeys?: string[]
}) => {
  for (const k in data) {
    if (!fields.some((field) => field.name === k) && !reservedKeys.includes(k)) {
      delete data[k]
    }
  }

  for (const field of fields) {
    reservedKeys = []
    const fieldData = data[field.name]
    if (!fieldData || typeof fieldData !== 'object') {
      continue
    }

    const shouldLocalizeField = fieldShouldBeLocalized({ field, parentIsLocalized })

    if (field.type === 'blocks') {
      reservedKeys.push('blockType')
    }

    if ('flattenedFields' in field || 'blocks' in field) {
      if (shouldLocalizeField && config.localization) {
        for (const localeKey in fieldData) {
          if (!config.localization.localeCodes.some((code) => code === localeKey)) {
            delete fieldData[localeKey]
            continue
          }

          const localeData = fieldData[localeKey]

          if (!localeData || typeof localeData !== 'object') {
            continue
          }

          if (field.type === 'array' || field.type === 'blocks') {
            if (!Array.isArray(localeData)) {
              continue
            }

            let hasNull = false
            for (let i = 0; i < localeData.length; i++) {
              const data = localeData[i]
              let fields: FlattenedField[] | null = null

              if (field.type === 'array') {
                fields = field.flattenedFields
              } else {
                let maybeBlock: FlattenedBlock | undefined = undefined

                if (field.blockReferences) {
                  const maybeBlockReference = field.blockReferences.find((each) => {
                    const slug = typeof each === 'string' ? each : each.slug
                    return slug === data.blockType
                  })

                  if (maybeBlockReference) {
                    if (typeof maybeBlockReference === 'object') {
                      maybeBlock = maybeBlockReference
                    } else {
                      maybeBlock = config.blocks?.find((each) => each.slug === maybeBlockReference)
                    }
                  }
                }

                if (!maybeBlock) {
                  maybeBlock = field.blocks.find((each) => each.slug === data.blockType)
                }

                if (maybeBlock) {
                  fields = maybeBlock.flattenedFields
                } else {
                  localeData[i] = null
                  hasNull = true
                }
              }

              if (!fields) {
                continue
              }

              stripFields({
                config,
                data,
                fields,
                parentIsLocalized: parentIsLocalized || field.localized,
                reservedKeys,
              })
            }

            if (hasNull) {
              fieldData[localeKey] = localeData.filter(Boolean)
            }

            continue
          } else {
            stripFields({
              config,
              data: localeData,
              fields: field.flattenedFields,
              parentIsLocalized: parentIsLocalized || field.localized,
              reservedKeys,
            })
          }
        }
        continue
      }

      if (field.type === 'array' || field.type === 'blocks') {
        if (!Array.isArray(fieldData)) {
          continue
        }

        let hasNull = false

        for (let i = 0; i < fieldData.length; i++) {
          const data = fieldData[i]
          let fields: FlattenedField[] | null = null

          if (field.type === 'array') {
            fields = field.flattenedFields
          } else {
            let maybeBlock: FlattenedBlock | undefined = undefined

            if (field.blockReferences) {
              const maybeBlockReference = field.blockReferences.find((each) => {
                const slug = typeof each === 'string' ? each : each.slug
                return slug === data.blockType
              })

              if (maybeBlockReference) {
                if (typeof maybeBlockReference === 'object') {
                  maybeBlock = maybeBlockReference
                } else {
                  maybeBlock = config.blocks?.find((each) => each.slug === maybeBlockReference)
                }
              }
            }

            if (!maybeBlock) {
              maybeBlock = field.blocks.find((each) => each.slug === data.blockType)
            }

            if (maybeBlock) {
              fields = maybeBlock.flattenedFields
            } else {
              fieldData[i] = null
              hasNull = true
            }
          }

          if (!fields) {
            continue
          }

          stripFields({
            config,
            data,
            fields,
            parentIsLocalized: parentIsLocalized || field.localized,
            reservedKeys,
          })
        }

        if (hasNull) {
          data[field.name] = fieldData.filter(Boolean)
        }

        continue
      } else {
        stripFields({
          config,
          data: fieldData,
          fields: field.flattenedFields,
          parentIsLocalized: parentIsLocalized || field.localized,
          reservedKeys,
        })
      }
    }
  }
}

/**
 * A function that transforms Payload <-> MongoDB data.
 * @internal - this function may be removed or receive breaking changes in minor releases.
 */
export const transform = ({
  $addToSet,
  $inc,
  $pull,
  $push,
  adapter,
  data,
  fields,
  globalSlug,
  operation,
  parentIsLocalized = false,
  validateRelationships = true,
}: Args) => {
  if (!data) {
    return null
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      transform({
        $addToSet,
        $inc,
        $pull,
        $push,
        adapter,
        data: item,
        fields,
        globalSlug,
        operation,
        validateRelationships,
      })
    }
    return
  }

  const {
    payload: { config },
  } = adapter

  if (operation === 'read') {
    delete data['__v']
    data.id = data._id || data.id
    delete data['_id']

    if (isObjectID(data.id)) {
      data.id = data.id.toHexString()
    }

    // Handle BigInt conversion for custom ID fields of type 'number'
    if (adapter.useBigIntForNumberIDs && typeof data.id === 'bigint') {
      data.id = Number(data.id)
    }

    if (!adapter.allowAdditionalKeys) {
      stripFields({
        config,
        data,
        fields: flattenAllFields({ cache: true, fields }),
        parentIsLocalized: false,
        reservedKeys: ['id', 'globalType'],
      })
    }
  }

  if (operation === 'write' && globalSlug) {
    data.globalType = globalSlug
  }

  const sanitize: TraverseFieldsCallback = ({
    field,
    parentIsLocalized,
    parentPath,
    parentRef: incomingParentRef,
    ref: incomingRef,
  }) => {
    if (!incomingRef || typeof incomingRef !== 'object') {
      return
    }

    const ref = incomingRef as Record<string, unknown>
    const parentRef = (incomingParentRef || {}) as Record<string, unknown>

    // Clear empty parent containers by setting them to undefined.
    const clearEmptyContainer = () => {
      if (!parentRef || typeof parentRef !== 'object') {
        return
      }
      if (!ref || typeof ref !== 'object') {
        return
      }
      if (Object.keys(ref).length > 0) {
        return
      }
      const containerKey = Object.keys(parentRef).find((k) => parentRef[k] === ref)
      if (containerKey) {
        parentRef[containerKey] = undefined
      }
    }

    if (
      $inc &&
      field.type === 'number' &&
      operation === 'write' &&
      field.name in ref &&
      ref[field.name]
    ) {
      const value = ref[field.name]
      if (value && typeof value === 'object' && '$inc' in value && typeof value.$inc === 'number') {
        $inc[`${parentPath}${field.name}`] = value.$inc
        delete ref[field.name]
        clearEmptyContainer()
      }
    }

    if (
      $push &&
      field.type === 'array' &&
      operation === 'write' &&
      field.name in ref &&
      ref[field.name]
    ) {
      const value = ref[field.name]

      if (
        value &&
        typeof value === 'object' &&
        ('$push' in value ||
          (config.localization &&
            fieldShouldBeLocalized({ field, parentIsLocalized }) &&
            Object.values(value).some(
              (localeValue) =>
                localeValue && typeof localeValue === 'object' && '$push' in localeValue,
            )))
      ) {
        if (config.localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
          // Handle localized fields: { field: { locale: { $push: data } } }
          let hasLocaleOperations = false
          Object.entries(value).forEach(([localeKey, localeValue]) => {
            if (localeValue && typeof localeValue === 'object' && '$push' in localeValue) {
              hasLocaleOperations = true
              const push = localeValue.$push
              if (Array.isArray(push)) {
                $push[`${parentPath}${field.name}.${localeKey}`] = { $each: push }
              } else if (typeof push === 'object') {
                $push[`${parentPath}${field.name}.${localeKey}`] = push
              }
            }
          })

          if (hasLocaleOperations) {
            delete ref[field.name]
            clearEmptyContainer()
          }
        } else if (value && typeof value === 'object' && '$push' in value) {
          // Handle non-localized fields: { field: { $push: data } }
          const push = value.$push
          if (Array.isArray(push)) {
            $push[`${parentPath}${field.name}`] = { $each: push }
          } else if (typeof push === 'object') {
            $push[`${parentPath}${field.name}`] = push
          }
          delete ref[field.name]
          clearEmptyContainer()
        }
      }
    }

    // Handle $push operation for relationship fields (converts to $addToSet)

    // Handle $push operation for relationship fields (converts to $addToSet) - unified approach
    if (
      $addToSet &&
      (field.type === 'relationship' || field.type === 'upload') &&
      'hasMany' in field &&
      field.hasMany &&
      operation === 'write' &&
      field.name in ref &&
      ref[field.name]
    ) {
      const value = ref[field.name]

      if (
        value &&
        typeof value === 'object' &&
        ('$push' in value ||
          (config.localization &&
            fieldShouldBeLocalized({ field, parentIsLocalized }) &&
            Object.values(value).some(
              (localeValue) =>
                localeValue &&
                typeof localeValue === 'object' &&
                '$push' in (localeValue as Record<string, unknown>),
            )))
      ) {
        if (config.localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
          // Handle localized fields: { field: { locale: { $push: data } } }
          let hasLocaleOperations = false
          Object.entries(value).forEach(([localeKey, localeValue]) => {
            if (localeValue && typeof localeValue === 'object' && '$push' in localeValue) {
              hasLocaleOperations = true
              const push = localeValue.$push
              const localeItems = Array.isArray(push) ? push : [push]
              const processedLocaleItems = processRelationshipValues(
                localeItems,
                field,
                config,
                operation,
                validateRelationships,
                adapter,
              )
              $addToSet[`${parentPath}${field.name}.${localeKey}`] = { $each: processedLocaleItems }
            }
          })

          if (hasLocaleOperations) {
            delete ref[field.name]
            clearEmptyContainer()
          }
        } else if (value && typeof value === 'object' && '$push' in value) {
          // Handle non-localized fields: { field: { $push: data } }
          const itemsToAppend = Array.isArray(value.$push) ? value.$push : [value.$push]
          const processedItems = processRelationshipValues(
            itemsToAppend,
            field,
            config,
            operation,
            validateRelationships,
            adapter,
          )
          $addToSet[`${parentPath}${field.name}`] = { $each: processedItems }
          delete ref[field.name]
          clearEmptyContainer()
        }
      }
    }

    // Handle $remove operation for relationship fields (converts to $pull)
    if (
      $pull &&
      (field.type === 'relationship' || field.type === 'upload') &&
      'hasMany' in field &&
      field.hasMany &&
      operation === 'write' &&
      field.name in ref &&
      ref[field.name]
    ) {
      const value = ref[field.name]
      if (
        value &&
        typeof value === 'object' &&
        ('$remove' in value ||
          (config.localization &&
            fieldShouldBeLocalized({ field, parentIsLocalized }) &&
            Object.values(value).some(
              (localeValue) =>
                localeValue &&
                typeof localeValue === 'object' &&
                '$remove' in (localeValue as Record<string, unknown>),
            )))
      ) {
        if (config.localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
          // Handle localized fields: { field: { locale: { $remove: data } } }
          let hasLocaleOperations = false
          Object.entries(value).forEach(([localeKey, localeValue]) => {
            if (localeValue && typeof localeValue === 'object' && '$remove' in localeValue) {
              hasLocaleOperations = true
              const remove = localeValue.$remove
              const localeItems = Array.isArray(remove) ? remove : [remove]
              const processedLocaleItems = processRelationshipValues(
                localeItems,
                field,
                config,
                operation,
                validateRelationships,
                adapter,
              )
              $pull[`${parentPath}${field.name}.${localeKey}`] = { $in: processedLocaleItems }
            }
          })

          if (hasLocaleOperations) {
            delete ref[field.name]
            clearEmptyContainer()
          }
        } else if (value && typeof value === 'object' && '$remove' in value) {
          // Handle non-localized fields: { field: { $remove: data } }
          const itemsToRemove = Array.isArray(value.$remove) ? value.$remove : [value.$remove]
          const processedItems = processRelationshipValues(
            itemsToRemove,
            field,
            config,
            operation,
            validateRelationships,
            adapter,
          )
          $pull[`${parentPath}${field.name}`] = { $in: processedItems }
          delete ref[field.name]
          clearEmptyContainer()
        }
      }
    }

    if (field.type === 'date' && operation === 'read' && field.name in ref && ref[field.name]) {
      if (config.localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
        const fieldRef = ref[field.name] as Record<string, unknown>
        if (!fieldRef || typeof fieldRef !== 'object') {
          return
        }

        for (const locale of config.localization.localeCodes) {
          sanitizeDate({
            field,
            locale,
            ref: fieldRef,
            value: fieldRef[locale],
          })
        }
      } else {
        sanitizeDate({
          field,
          ref,
          value: ref[field.name],
        })
      }
    }

    if (
      field.type === 'relationship' ||
      field.type === 'upload' ||
      (operation === 'read' && field.type === 'join')
    ) {
      if (!ref[field.name]) {
        return
      }

      // handle localized relationships
      if (config.localization && fieldShouldBeLocalized({ field, parentIsLocalized })) {
        const locales = config.localization.locales
        const fieldRef = ref[field.name] as Record<string, unknown>
        if (typeof fieldRef !== 'object') {
          return
        }

        for (const { code } of locales) {
          const value = fieldRef[code]
          if (value) {
            sanitizeRelationship({
              adapter,
              config,
              field,
              locale: code,
              operation,
              ref: fieldRef,
              validateRelationships,
              value,
            })
          }
        }
      } else {
        // handle non-localized relationships
        sanitizeRelationship({
          adapter,
          config,
          field,
          locale: undefined,
          operation,
          ref,
          validateRelationships,
          value: ref[field.name],
        })
      }
    }
  }

  traverseFields({
    callback: sanitize,
    config,
    fields,
    fillEmpty: false,
    parentIsLocalized,
    ref: data,
  })

  if (operation === 'write') {
    if (typeof data.updatedAt === 'undefined') {
      // If data.updatedAt is explicitly set to `null` we should not set it - this means we don't want to change the value of updatedAt.
      data.updatedAt = new Date().toISOString()
    } else if (data.updatedAt === null) {
      // `updatedAt` may be explicitly set to null to disable updating it - if that is the case, we need to delete the property. Keeping it as null will
      // cause the database to think we want to set it to null, which we don't.
      delete data.updatedAt
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/db-postgres/.gitignore

```text
/migrations
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/db-postgres/.prettierignore

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
Location: payload-main/packages/db-postgres/.swcrc

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
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bundle.js]---
Location: payload-main/packages/db-postgres/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { commonjs } from '@hyrious/esbuild-plugin-commonjs'
throw new Error('asfdadsf')
async function build() {
  const resultServer = await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    splitting: false,
    external: [
      '*.scss',
      '*.css',
      'drizzle-kit',
      'pg',
      '@payloadcms/translations',
      '@payloadcms/drizzle',
      'payload',
      'payload/*',
    ],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [commonjs()],
    sourcemap: true,
  })
  console.log('db-postgres bundled successfully')

  fs.writeFileSync('meta_server.json', JSON.stringify(resultServer.metafile))
}
await build()
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/db-postgres/LICENSE.md

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
Location: payload-main/packages/db-postgres/package.json

```json
{
  "name": "@payloadcms/db-postgres",
  "version": "3.68.5",
  "description": "The officially supported Postgres database adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/db-postgres"
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
      "import": "./src/exports/types-deprecated.ts",
      "types": "./src/exports/types-deprecated.ts",
      "default": "./src/exports/types-deprecated.ts"
    },
    "./migration-utils": {
      "import": "./src/exports/migration-utils.ts",
      "types": "./src/exports/migration-utils.ts",
      "default": "./src/exports/migration-utils.ts"
    },
    "./drizzle": {
      "import": "./src/drizzle-proxy/index.ts",
      "types": "./src/drizzle-proxy/index.ts",
      "default": "./src/drizzle-proxy/index.ts"
    },
    "./drizzle/pg-core": {
      "import": "./src/drizzle-proxy/pg-core.ts",
      "types": "./src/drizzle-proxy/pg-core.ts",
      "default": "./src/drizzle-proxy/pg-core.ts"
    },
    "./drizzle/node-postgres": {
      "import": "./src/drizzle-proxy/node-postgres.ts",
      "types": "./src/drizzle-proxy/node-postgres.ts",
      "default": "./src/drizzle-proxy/node-postgres.ts"
    },
    "./drizzle/relations": {
      "import": "./src/drizzle-proxy/relations.ts",
      "types": "./src/drizzle-proxy/relations.ts",
      "default": "./src/drizzle-proxy/relations.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist",
    "mock.js"
  ],
  "scripts": {
    "build": "rimraf .dist && rimraf tsconfig.tsbuildinfo  && pnpm build:types && pnpm build:swc && pnpm build:esbuild && pnpm renamePredefinedMigrations",
    "build:debug": "pnpm build",
    "build:esbuild": "echo skipping esbuild",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "renamePredefinedMigrations": "node --no-deprecation --import @swc-node/register/esm-register ./scripts/renamePredefinedMigrations.ts"
  },
  "dependencies": {
    "@payloadcms/drizzle": "workspace:*",
    "@types/pg": "8.10.2",
    "console-table-printer": "2.12.1",
    "drizzle-kit": "0.31.7",
    "drizzle-orm": "0.44.7",
    "pg": "8.16.3",
    "prompts": "2.4.2",
    "to-snake-case": "1.0.0",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@hyrious/esbuild-plugin-commonjs": "0.2.6",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/to-snake-case": "1.0.0",
    "esbuild": "0.25.5",
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
        "import": "./dist/exports/types-deprecated.js",
        "types": "./dist/exports/types-deprecated.d.ts",
        "default": "./dist/exports/types-deprecated.js"
      },
      "./migration-utils": {
        "import": "./dist/exports/migration-utils.js",
        "types": "./dist/exports/migration-utils.d.ts",
        "default": "./dist/exports/migration-utils.js"
      },
      "./drizzle": {
        "import": "./dist/drizzle-proxy/index.js",
        "types": "./dist/drizzle-proxy/index.d.ts",
        "default": "./dist/drizzle-proxy/index.js"
      },
      "./drizzle/pg-core": {
        "import": "./dist/drizzle-proxy/pg-core.js",
        "types": "./dist/drizzle-proxy/pg-core.d.ts",
        "default": "./dist/drizzle-proxy/pg-core.js"
      },
      "./drizzle/node-postgres": {
        "import": "./dist/drizzle-proxy/node-postgres.js",
        "types": "./dist/drizzle-proxy/node-postgres.d.ts",
        "default": "./dist/drizzle-proxy/node-postgres.js"
      },
      "./drizzle/relations": {
        "import": "./dist/drizzle-proxy/relations.js",
        "types": "./dist/drizzle-proxy/relations.d.ts",
        "default": "./dist/drizzle-proxy/relations.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/db-postgres/README.md

```text
# Payload Postgres Adapter

Official Postgres adapter for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-postgres
```

## Usage

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // ...rest of config
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/configuration/overview).
```

--------------------------------------------------------------------------------

---[FILE: relationships-v2-v3.mjs]---
Location: payload-main/packages/db-postgres/relationships-v2-v3.mjs

```text
const imports = `import { migratePostgresV2toV3 } from '@payloadcms/migratePostgresV2toV3'`
const up = `   await migratePostgresV2toV3({
        // enables logging of changes that will be made to the database
        debug: false,
        // skips calls that modify schema or data
        dryRun: false,
        payload,
        req,
        })
`
export { imports, up }

//# sourceMappingURL=relationships-v2-v3.js.map
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/db-postgres/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [
    {
      "path": "../payload"
    },
    {
      "path": "../translations"
    },
    {
      "path": "../drizzle"
    }
  ],
  "compilerOptions": {
    // Do not include DOM and DOM.Iterable as this is a server-only package.
    "lib": ["ES2022"],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: renamePredefinedMigrations.ts]---
Location: payload-main/packages/db-postgres/scripts/renamePredefinedMigrations.ts

```typescript
import fs from 'fs'
import path from 'path'

/**
 * Changes built .js files to .mjs to for ESM imports
 */
const rename = () => {
  fs.readdirSync(path.resolve('./dist/predefinedMigrations'))
    .filter((f) => {
      return f.endsWith('.js')
    })
    .forEach((file) => {
      const newPath = path.join('./dist/predefinedMigrations', file)
      fs.renameSync(newPath, newPath.replace('.js', '.mjs'))
    })
  console.log('done')
}

rename()
```

--------------------------------------------------------------------------------

---[FILE: connect.ts]---
Location: payload-main/packages/db-postgres/src/connect.ts

```typescript
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { Connect, Migration } from 'payload'

import { pushDevSchema } from '@payloadcms/drizzle'
import { drizzle } from 'drizzle-orm/node-postgres'
import { withReplicas } from 'drizzle-orm/pg-core'

import type { PostgresAdapter } from './types.js'

const connectWithReconnect = async function ({
  adapter,
  pool,
  reconnect = false,
}: {
  adapter: PostgresAdapter
  pool: PostgresAdapter['pool']
  reconnect?: boolean
}) {
  let result

  if (!reconnect) {
    result = await pool.connect()
  } else {
    try {
      result = await pool.connect()
    } catch (ignore) {
      setTimeout(() => {
        adapter.payload.logger.info('Reconnecting to postgres')
        void connectWithReconnect({ adapter, pool, reconnect: true })
      }, 1000)
    }
  }
  if (!result) {
    return
  }
  result.prependListener('error', (err) => {
    try {
      if (err.code === 'ECONNRESET') {
        void connectWithReconnect({ adapter, pool, reconnect: true })
      }
    } catch (ignore) {
      // swallow error
    }
  })
}

export const connect: Connect = async function connect(
  this: PostgresAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  try {
    if (!this.pool) {
      this.pool = new this.pg.Pool(this.poolOptions)
      await connectWithReconnect({ adapter: this, pool: this.pool })
    }

    const logger = this.logger || false
    this.drizzle = drizzle({ client: this.pool, logger, schema: this.schema })

    if (this.readReplicaOptions) {
      const readReplicas = this.readReplicaOptions.map((connectionString) => {
        const options = {
          ...this.poolOptions,
          connectionString,
        }
        const pool = new this.pg.Pool(options)
        void connectWithReconnect({
          adapter: this,
          pool,
        })
        return drizzle({ client: pool, logger, schema: this.schema })
      })
      const myReplicas = withReplicas(this.drizzle, readReplicas as any)
      this.drizzle = myReplicas
    }

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info(`---- DROPPING TABLES SCHEMA(${this.schemaName || 'public'}) ----`)
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    if (err.message?.match(/database .* does not exist/i) && !this.disableCreateDatabase) {
      // capitalize first char of the err msg
      this.payload.logger.info(
        `${err.message.charAt(0).toUpperCase() + err.message.slice(1)}, creating...`,
      )
      const isCreated = await this.createDatabase()

      if (isCreated && this.connect) {
        await this.connect(options)
        return
      }
    } else {
      this.payload.logger.error({
        err,
        msg: `Error: cannot connect to Postgres. Details: ${err.message}`,
      })
    }

    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    throw new Error(`Error: cannot connect to Postgres: ${err.message}`)
  }

  await this.createExtensions()

  // Only push schema if not in production
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_MIGRATING !== 'true' &&
    this.push !== false
  ) {
    await pushDevSchema(this as unknown as DrizzleAdapter)
  }

  if (typeof this.resolveInitializing === 'function') {
    this.resolveInitializing()
  }

  if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
    await this.migrate({ migrations: this.prodMigrations as unknown as Migration[] })
  }
}
```

--------------------------------------------------------------------------------

````
