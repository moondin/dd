---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 127
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 127 of 695)

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

---[FILE: buildSearchParams.ts]---
Location: payload-main/packages/db-mongodb/src/queries/buildSearchParams.ts

```typescript
import type { FilterQuery } from 'mongoose'
import type { FlattenedField, Operator, PathToQuery, Payload } from 'payload'

import { Types } from 'mongoose'
import { APIError, getFieldByPath, getLocalizedPaths } from 'payload'
import { validOperatorSet } from 'payload/shared'

import type { MongooseAdapter } from '../index.js'
import type { OperatorMapKey } from './operatorMap.js'

import { getCollection } from '../utilities/getEntity.js'
import { isObjectID } from '../utilities/isObjectID.js'
import { operatorMap } from './operatorMap.js'
import { sanitizeQueryValue } from './sanitizeQueryValue.js'

type SearchParam = {
  path?: string
  rawQuery?: unknown
  value?: unknown
}

const subQueryOptions = {
  lean: true,
}

/**
 * Convert the Payload key / value / operator into a MongoDB query
 */
export async function buildSearchParam({
  collectionSlug,
  fields,
  globalSlug,
  incomingPath,
  locale,
  operator,
  parentIsLocalized,
  payload,
  val,
}: {
  collectionSlug?: string
  fields: FlattenedField[]
  globalSlug?: string
  incomingPath: string
  locale?: string
  operator: Operator
  parentIsLocalized: boolean
  payload: Payload
  val: unknown
}): Promise<SearchParam | undefined> {
  // Replace GraphQL nested field double underscore formatting
  let sanitizedPath = incomingPath.replace(/__/g, '.')
  if (sanitizedPath === 'id') {
    sanitizedPath = '_id'
  }

  let paths: PathToQuery[] = []

  let hasCustomID = false

  if (sanitizedPath === '_id') {
    const customIDFieldType = collectionSlug
      ? payload.collections[collectionSlug]?.customIDType
      : undefined

    let idFieldType: 'number' | 'text' = 'text'

    if (customIDFieldType) {
      idFieldType = customIDFieldType
      hasCustomID = true
    }

    paths.push({
      collectionSlug,
      complete: true,
      field: {
        name: 'id',
        type: idFieldType,
      } as FlattenedField,
      parentIsLocalized: parentIsLocalized ?? false,
      path: '_id',
    })
  } else {
    paths = getLocalizedPaths({
      collectionSlug,
      fields,
      globalSlug,
      incomingPath: sanitizedPath,
      locale,
      parentIsLocalized,
      payload,
    })
  }

  if (!paths[0]) {
    return undefined
  }

  const [{ field, path }] = paths
  if (path) {
    const sanitizedQueryValue = sanitizeQueryValue({
      field,
      hasCustomID,
      locale,
      operator,
      parentIsLocalized,
      path,
      payload,
      val,
    })

    if (!sanitizedQueryValue) {
      return undefined
    }

    const { operator: formattedOperator, rawQuery, val: formattedValue } = sanitizedQueryValue

    if (rawQuery && paths.length === 1) {
      return { value: rawQuery }
    }

    if (!formattedOperator) {
      return undefined
    }

    // If there are multiple collections to search through,
    // Recursively build up a list of query constraints
    if (paths.length > 1) {
      // Remove top collection and reverse array
      // to work backwards from top
      const pathsToQuery = paths.slice(1).reverse()

      let relationshipQuery: SearchParam = {
        value: {},
      }

      for (const [i, { collectionSlug, path: subPath }] of pathsToQuery.entries()) {
        if (!collectionSlug) {
          throw new APIError(`Collection with the slug ${collectionSlug} was not found.`)
        }

        const { collectionConfig, Model: SubModel } = getCollection({
          adapter: payload.db as MongooseAdapter,
          collectionSlug,
        })

        if (i === 0) {
          const subQuery = await SubModel.buildQuery({
            locale,
            payload,
            where: {
              [subPath]: {
                [formattedOperator]: val,
              },
            },
          })

          const field = paths[0].field

          const select: Record<string, boolean> = {
            _id: true,
          }

          let joinPath: null | string = null

          if (field.type === 'join') {
            const relationshipField = getFieldByPath({
              fields: collectionConfig.flattenedFields,
              path: field.on,
            })
            if (!relationshipField) {
              throw new APIError('Relationship field was not found')
            }

            let path = relationshipField.localizedPath
            if (relationshipField.pathHasLocalized && payload.config.localization) {
              path = path.replace('<locale>', locale || payload.config.localization.defaultLocale)
            }
            select[path] = true

            joinPath = path
          }

          if (joinPath) {
            select[joinPath] = true
          }

          const result = await SubModel.find(subQuery).lean().select(select)

          const $in: unknown[] = []

          result.forEach((doc: any) => {
            if (joinPath) {
              let ref = doc

              for (const segment of joinPath.split('.')) {
                if (typeof ref === 'object' && ref) {
                  ref = ref[segment]
                }
              }

              if (Array.isArray(ref)) {
                for (const item of ref) {
                  if (isObjectID(item)) {
                    $in.push(item)
                  }
                }
              } else if (isObjectID(ref)) {
                $in.push(ref)
              }
            } else {
              const stringID = doc._id.toString()
              $in.push(stringID)

              if (Types.ObjectId.isValid(stringID)) {
                $in.push(doc._id)
              }
            }
          })

          if (pathsToQuery.length === 1) {
            return {
              path: joinPath ? '_id' : path,
              value: { $in },
            }
          }

          const nextSubPath = pathsToQuery[i + 1]?.path

          if (nextSubPath) {
            relationshipQuery = { value: { [nextSubPath]: $in } }
          }

          continue
        }

        const subQuery = relationshipQuery.value as FilterQuery<any>
        const result = await SubModel.find(subQuery, subQueryOptions)

        const $in = result.map((doc) => doc._id)

        // If it is the last recursion
        // then pass through the search param
        if (i + 1 === pathsToQuery.length) {
          relationshipQuery = {
            path,
            value: { $in },
          }
        } else {
          const nextSubPath = pathsToQuery[i + 1]?.path
          if (nextSubPath) {
            relationshipQuery = {
              value: {
                [nextSubPath]: { $in },
              },
            }
          }
        }
      }

      return relationshipQuery
    }

    if (formattedOperator && validOperatorSet.has(formattedOperator as Operator)) {
      const operatorKey = operatorMap[formattedOperator as OperatorMapKey]

      if (field.type === 'relationship' || field.type === 'upload') {
        let hasNumberIDRelation
        let multiIDCondition = '$or'
        if (operatorKey === '$ne') {
          multiIDCondition = '$and'
        }

        const result = {
          value: {
            [multiIDCondition]: [{ [path]: { [operatorKey]: formattedValue } }],
          },
        }

        if (typeof formattedValue === 'string') {
          if (Types.ObjectId.isValid(formattedValue)) {
            result.value[multiIDCondition]?.push({
              [path]: { [operatorKey]: new Types.ObjectId(formattedValue) },
            })
          } else {
            ;(Array.isArray(field.relationTo) ? field.relationTo : [field.relationTo]).forEach(
              (relationTo) => {
                const isRelatedToCustomNumberID =
                  payload.collections[relationTo]?.customIDType === 'number'

                if (isRelatedToCustomNumberID) {
                  hasNumberIDRelation = true
                }
              },
            )

            if (hasNumberIDRelation) {
              result.value[multiIDCondition]?.push({
                [path]: { [operatorKey]: parseFloat(formattedValue) },
              })
            }
          }
        }

        const length = result.value[multiIDCondition]?.length

        if (typeof length === 'number' && length > 1) {
          return result
        }
      }

      if (formattedOperator === 'like' && typeof formattedValue === 'string') {
        const words = formattedValue.split(' ')

        const result = {
          value: {
            $and: words.map((word) => ({
              [path]: {
                $options: 'i',
                $regex: word.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'),
              },
            })),
          },
        }

        return result
      }

      if (formattedOperator === 'not_like' && typeof formattedValue === 'string') {
        const words = formattedValue.split(' ')

        const result = {
          value: {
            $and: words.map((word) => ({
              [path]: {
                $not: {
                  $options: 'i',
                  $regex: word.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'),
                },
              },
            })),
          },
        }

        return result
      }

      // Some operators like 'near' need to define a full query
      // so if there is no operator key, just return the value
      if (!operatorKey) {
        return {
          path,
          value: formattedValue,
        }
      }

      return {
        path,
        value: { [operatorKey]: formattedValue },
      }
    }
  }
  return undefined
}
```

--------------------------------------------------------------------------------

---[FILE: buildSortParam.spec.ts]---
Location: payload-main/packages/db-mongodb/src/queries/buildSortParam.spec.ts

```typescript
import type { Config, SanitizedConfig } from 'payload'

import { sanitizeConfig } from 'payload'

import { buildSortParam } from './buildSortParam.js'
import { MongooseAdapter } from '../index.js'

let config: SanitizedConfig

describe('builds sort params', () => {
  beforeAll(async () => {
    config = await sanitizeConfig({
      localization: {
        defaultLocale: 'en',
        fallback: true,
        locales: ['en', 'es'],
      },
    } as Config)
  })
  it('adds a fallback on non-unique field', () => {
    const result = buildSortParam({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
        },
      ],
      locale: 'en',
      sort: 'order',
      timestamps: true,
      adapter: {
        disableFallbackSort: false,
      } as MongooseAdapter,
    })

    expect(result).toStrictEqual({ order: 'asc', createdAt: 'desc' })
  })

  it('adds a fallback when sort isnt provided', () => {
    const result = buildSortParam({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
        },
      ],
      locale: 'en',
      sort: undefined,
      timestamps: true,
      adapter: {
        disableFallbackSort: false,
      } as MongooseAdapter,
    })

    expect(result).toStrictEqual({ createdAt: 'desc' })
  })

  it('does not add a fallback on non-unique field when disableFallbackSort is true', () => {
    const result = buildSortParam({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
        },
      ],
      locale: 'en',
      sort: 'order',
      timestamps: true,
      adapter: {
        disableFallbackSort: true,
      } as MongooseAdapter,
    })

    expect(result).toStrictEqual({ order: 'asc' })
  })

  // This test should be true even when disableFallbackSort is false
  it('does not add a fallback on unique field', () => {
    const result = buildSortParam({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'order',
          type: 'number',
          unique: true, // Marking this field as unique
        },
      ],
      locale: 'en',
      sort: 'order',
      timestamps: true,
      adapter: {
        disableFallbackSort: false,
      } as MongooseAdapter,
    })

    expect(result).toStrictEqual({ order: 'asc' })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: buildSortParam.ts]---
Location: payload-main/packages/db-mongodb/src/queries/buildSortParam.ts

```typescript
import type { PipelineStage } from 'mongoose'

import {
  APIError,
  type FlattenedField,
  getFieldByPath,
  type SanitizedConfig,
  type Sort,
} from 'payload'

import type { MongooseAdapter } from '../index.js'

import { getCollection } from '../utilities/getEntity.js'
import { getLocalizedSortProperty } from './getLocalizedSortProperty.js'

type Args = {
  adapter: MongooseAdapter
  config: SanitizedConfig
  fields: FlattenedField[]
  locale?: string
  parentIsLocalized?: boolean
  sort?: Sort
  sortAggregation?: PipelineStage[]
  timestamps: boolean
  versions?: boolean
}

export type SortArgs = {
  direction: SortDirection
  property: string
}[]

export type SortDirection = 'asc' | 'desc'

const relationshipSort = ({
  adapter,
  fields,
  locale,
  path,
  previousField = '',
  sortAggregation,
}: {
  adapter: MongooseAdapter
  fields: FlattenedField[]
  locale?: string
  path: string
  previousField?: string
  sortAggregation: PipelineStage[]
  versions?: boolean
}): null | string => {
  let currentFields = fields
  const segments = path.split('.')
  if (segments.length < 2) {
    return null
  }

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const field = currentFields.find((each) => each.name === segment)

    if (!field) {
      return null
    }

    if ('fields' in field) {
      currentFields = field.flattenedFields
    } else if (
      (field.type === 'relationship' || field.type === 'upload') &&
      i !== segments.length - 1
    ) {
      const relationshipPath = segments.slice(0, i + 1).join('.')
      const nextPath = segments.slice(i + 1, segments.length)
      const relationshipFieldResult = getFieldByPath({ fields, path: relationshipPath })

      if (
        !relationshipFieldResult ||
        !('relationTo' in relationshipFieldResult.field) ||
        typeof relationshipFieldResult.field.relationTo !== 'string'
      ) {
        return null
      }

      const { collectionConfig, Model } = getCollection({
        adapter,
        collectionSlug: relationshipFieldResult.field.relationTo,
      })

      let localizedRelationshipPath: string = relationshipFieldResult.localizedPath

      if (locale && relationshipFieldResult.pathHasLocalized) {
        localizedRelationshipPath = relationshipFieldResult.localizedPath.replace(
          '<locale>',
          locale,
        )
      }

      if (nextPath.join('.') === 'id') {
        return `${previousField}${localizedRelationshipPath}`
      }

      const as = `__${previousField}${localizedRelationshipPath}`

      sortAggregation.push({
        $lookup: {
          as: `__${previousField}${localizedRelationshipPath}`,
          foreignField: '_id',
          from: Model.collection.name,
          localField: `${previousField}${localizedRelationshipPath}`,
        },
      })

      if (nextPath.length > 1) {
        const nextRes = relationshipSort({
          adapter,
          fields: collectionConfig.flattenedFields,
          locale,
          path: nextPath.join('.'),
          previousField: `${as}.`,
          sortAggregation,
        })

        if (nextRes) {
          return nextRes
        }

        return `${as}.${nextPath.join('.')}`
      }

      const nextField = getFieldByPath({
        fields: collectionConfig.flattenedFields,
        path: nextPath[0]!,
      })

      if (nextField && nextField.pathHasLocalized && locale) {
        return `${as}.${nextField.localizedPath.replace('<locale>', locale)}`
      }

      return `${as}.${nextPath[0]}`
    }
  }

  return null
}

export const buildSortParam = ({
  adapter,
  config,
  fields,
  locale,
  parentIsLocalized = false,
  sort,
  sortAggregation,
  timestamps,
  versions,
}: Args): Record<string, string> => {
  if (!sort) {
    if (timestamps) {
      sort = '-createdAt'
    } else {
      sort = '-id'
    }
  }

  if (typeof sort === 'string') {
    sort = [sort]
  }

  // We use this flag to determine if the sort is unique or not to decide whether to add a fallback sort.
  const isUniqueSort = sort.some((item) => {
    const field = getFieldByPath({ fields, path: item })
    return field?.field?.unique
  })

  // In the case of Mongo, when sorting by a field that is not unique, the results are not guaranteed to be in the same order each time.
  // So we add a fallback sort to ensure that the results are always in the same order.
  let fallbackSort = '-id'

  if (timestamps) {
    fallbackSort = '-createdAt'
  }

  const includeFallbackSort =
    !adapter.disableFallbackSort &&
    !isUniqueSort &&
    !(sort.includes(fallbackSort) || sort.includes(fallbackSort.replace('-', '')))

  if (includeFallbackSort) {
    sort.push(fallbackSort)
  }

  const sorting = sort.reduce<Record<string, string>>((acc, item) => {
    let sortProperty: string
    let sortDirection: SortDirection
    if (item.indexOf('-') === 0) {
      sortProperty = item.substring(1)
      sortDirection = 'desc'
    } else {
      sortProperty = item
      sortDirection = 'asc'
    }
    if (sortProperty === 'id') {
      acc['_id'] = sortDirection
      return acc
    }

    if (sortAggregation) {
      const sortRelProperty = relationshipSort({
        adapter,
        fields,
        locale,
        path: sortProperty,
        sortAggregation,
        versions,
      })

      if (sortRelProperty) {
        acc[sortRelProperty] = sortDirection
        return acc
      }
    }

    const localizedProperty = getLocalizedSortProperty({
      config,
      fields,
      locale,
      parentIsLocalized,
      segments: sortProperty.split('.'),
    })
    acc[localizedProperty] = sortDirection

    return acc
  }, {})

  return sorting
}
```

--------------------------------------------------------------------------------

---[FILE: getBuildQueryPlugin.ts]---
Location: payload-main/packages/db-mongodb/src/queries/getBuildQueryPlugin.ts

```typescript
import type { FlattenedField, Payload, Where } from 'payload'

import { APIError } from 'payload'

import { parseParams } from './parseParams.js'

type GetBuildQueryPluginArgs = {
  collectionSlug?: string
  versionsFields?: FlattenedField[]
}

export type BuildQueryArgs = {
  globalSlug?: string
  locale?: string
  payload: Payload
  where: Where
}

// This plugin asynchronously builds a list of Mongoose query constraints
// which can then be used in subsequent Mongoose queries.
// Deprecated in favor of using simpler buildQuery directly
export const getBuildQueryPlugin = ({
  collectionSlug,
  versionsFields,
}: GetBuildQueryPluginArgs = {}) => {
  return function buildQueryPlugin(schema: any) {
    const modifiedSchema = schema
    async function schemaBuildQuery({
      globalSlug,
      locale,
      payload,
      where,
    }: BuildQueryArgs): Promise<Record<string, unknown>> {
      let fields: FlattenedField[] | null = null

      if (versionsFields) {
        fields = versionsFields
      } else {
        if (globalSlug) {
          const globalConfig = payload.globals.config.find(({ slug }) => slug === globalSlug)

          if (!globalConfig) {
            throw new APIError(`Global with the slug ${globalSlug} was not found`)
          }

          fields = globalConfig.flattenedFields
        }
        if (collectionSlug) {
          const collectionConfig = payload.collections[collectionSlug]?.config

          if (!collectionConfig) {
            throw new APIError(`Collection with the slug ${globalSlug} was not found`)
          }

          fields = collectionConfig.flattenedFields
        }
      }

      if (fields === null) {
        throw new APIError('Fields are not initialized.')
      }

      const result = await parseParams({
        collectionSlug,
        fields,
        globalSlug,
        locale,
        parentIsLocalized: false,
        payload,
        where,
      })

      return result
    }
    modifiedSchema.statics.buildQuery = schemaBuildQuery
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getLocalizedSortProperty.spec.ts]---
Location: payload-main/packages/db-mongodb/src/queries/getLocalizedSortProperty.spec.ts

```typescript
import type { Config, SanitizedConfig } from 'payload'

import { flattenAllFields, sanitizeConfig } from 'payload'

import { getLocalizedSortProperty } from './getLocalizedSortProperty.js'

let config: SanitizedConfig

describe('get localized sort property', () => {
  beforeAll(async () => {
    config = await sanitizeConfig({
      localization: {
        defaultLocale: 'en',
        fallback: true,
        locales: ['en', 'es'],
      },
    } as Config)
  })
  it('passes through a non-localized sort property', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
      locale: 'en',
      segments: ['title'],
    })

    expect(result).toStrictEqual('title')
  })

  it('properly localizes an un-localized sort property', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
      ],
      locale: 'en',
      segments: ['title'],
    })

    expect(result).toStrictEqual('title.en')
  })

  it('keeps specifically asked-for localized sort properties', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
      ],
      locale: 'en',
      segments: ['title', 'es'],
    })

    expect(result).toStrictEqual('title.es')
  })

  it('properly localizes nested sort properties', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: flattenAllFields({
        fields: [
          {
            name: 'group',
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
                localized: true,
              },
            ],
          },
        ],
      }),
      locale: 'en',
      segments: ['group', 'title'],
    })

    expect(result).toStrictEqual('group.title.en')
  })

  it('keeps requested locale with nested sort properties', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: flattenAllFields({
        fields: [
          {
            name: 'group',
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
                localized: true,
              },
            ],
          },
        ],
      }),
      locale: 'en',
      segments: ['group', 'title', 'es'],
    })

    expect(result).toStrictEqual('group.title.es')
  })

  it('properly localizes field within row', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: flattenAllFields({
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'title',
                type: 'text',
                localized: true,
              },
            ],
          },
        ],
      }),
      locale: 'en',
      segments: ['title'],
    })

    expect(result).toStrictEqual('title.en')
  })

  it('properly localizes field within named tab', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: flattenAllFields({
        fields: [
          {
            type: 'tabs',
            tabs: [
              {
                name: 'tab',
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    localized: true,
                  },
                ],
              },
            ],
          },
        ],
      }),
      locale: 'en',
      segments: ['tab', 'title'],
    })

    expect(result).toStrictEqual('tab.title.en')
  })

  it('properly localizes field within unnamed tab', () => {
    const result = getLocalizedSortProperty({
      config,
      parentIsLocalized: false,
      fields: flattenAllFields({
        fields: [
          {
            type: 'tabs',
            tabs: [
              {
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    localized: true,
                  },
                ],
                label: 'Tab',
              },
            ],
          },
        ],
      }),
      locale: 'en',
      segments: ['title'],
    })

    expect(result).toStrictEqual('title.en')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getLocalizedSortProperty.ts]---
Location: payload-main/packages/db-mongodb/src/queries/getLocalizedSortProperty.ts

```typescript
import type { FlattenedField, SanitizedConfig } from 'payload'

import { fieldAffectsData, fieldIsPresentationalOnly, fieldShouldBeLocalized } from 'payload/shared'

type Args = {
  config: SanitizedConfig
  fields: FlattenedField[]
  locale?: string
  parentIsLocalized: boolean
  result?: string
  segments: string[]
}

export const getLocalizedSortProperty = ({
  config,
  fields,
  locale,
  parentIsLocalized,
  result: incomingResult,
  segments: incomingSegments,
}: Args): string => {
  // If localization is not enabled, accept exactly
  // what is sent in
  if (!config.localization) {
    return incomingSegments.join('.')
  }

  const segments = [...incomingSegments]

  // Retrieve first segment, and remove from segments
  const firstSegment = segments.shift()

  // Attempt to find a matched field
  const matchedField = fields.find(
    (field) => fieldAffectsData(field) && field.name === firstSegment,
  )

  if (matchedField && !fieldIsPresentationalOnly(matchedField)) {
    let nextFields: FlattenedField[] | null = null
    let nextParentIsLocalized = parentIsLocalized
    const remainingSegments = [...segments]
    let localizedSegment = matchedField.name

    if (
      fieldShouldBeLocalized({ field: matchedField, parentIsLocalized: parentIsLocalized ?? false })
    ) {
      // Check to see if next segment is a locale
      if (segments.length > 0 && remainingSegments[0]) {
        const nextSegmentIsLocale = config.localization.localeCodes.includes(remainingSegments[0])

        // If next segment is locale, remove it from remaining segments
        // and use it to localize the current segment
        if (nextSegmentIsLocale) {
          const nextSegment = remainingSegments.shift()
          localizedSegment = `${matchedField.name}.${nextSegment}`
        }
      } else {
        // If no more segments, but field is localized, use default locale
        localizedSegment = `${matchedField.name}.${locale}`
      }
    }

    // If there are subfields, pass them through
    if (
      matchedField.type === 'tab' ||
      matchedField.type === 'group' ||
      matchedField.type === 'array'
    ) {
      nextFields = matchedField.flattenedFields
      if (!nextParentIsLocalized) {
        nextParentIsLocalized = matchedField.localized ?? false
      }
    }

    if (matchedField.type === 'blocks') {
      nextFields = (matchedField.blockReferences ?? matchedField.blocks).reduce<FlattenedField[]>(
        (flattenedBlockFields, _block) => {
          // TODO: iterate over blocks mapped to block slug in v4, or pass through payload.blocks
          const block =
            typeof _block === 'string' ? config.blocks?.find((b) => b.slug === _block) : _block

          if (!block) {
            return [...flattenedBlockFields]
          }

          return [
            ...flattenedBlockFields,
            ...block.flattenedFields.filter(
              (blockField) =>
                (fieldAffectsData(blockField) &&
                  blockField.name !== 'blockType' &&
                  blockField.name !== 'blockName') ||
                !fieldAffectsData(blockField),
            ),
          ]
        },
        [],
      )
    }

    const result = incomingResult ? `${incomingResult}.${localizedSegment}` : localizedSegment

    if (nextFields !== null) {
      return getLocalizedSortProperty({
        config,
        fields: nextFields,
        locale,
        parentIsLocalized: nextParentIsLocalized,
        result,
        segments: remainingSegments,
      })
    }

    return result
  }

  return incomingSegments.join('.')
}
```

--------------------------------------------------------------------------------

---[FILE: operatorMap.ts]---
Location: payload-main/packages/db-mongodb/src/queries/operatorMap.ts

```typescript
export type OperatorMapKey = keyof typeof operatorMap

export const operatorMap = {
  all: '$all',
  equals: '$eq',
  exists: '$exists',
  greater_than: '$gt',
  greater_than_equal: '$gte',
  in: '$in',
  intersects: '$geoIntersects',
  less_than: '$lt',
  less_than_equal: '$lte',
  near: '$near',
  not_equals: '$ne',
  not_in: '$nin',
  within: '$geoWithin',
}
```

--------------------------------------------------------------------------------

---[FILE: parseParams.ts]---
Location: payload-main/packages/db-mongodb/src/queries/parseParams.ts

```typescript
import type { FilterQuery } from 'mongoose'
import type { FlattenedField, Operator, Payload, Where } from 'payload'

import { deepMergeWithCombinedArrays } from 'payload'
import { validOperatorSet } from 'payload/shared'

import { buildAndOrConditions } from './buildAndOrConditions.js'
import { buildSearchParam } from './buildSearchParams.js'

export async function parseParams({
  collectionSlug,
  fields,
  globalSlug,
  locale,
  parentIsLocalized,
  payload,
  where,
}: {
  collectionSlug?: string
  fields: FlattenedField[]
  globalSlug?: string
  locale?: string
  parentIsLocalized: boolean
  payload: Payload
  where: Where
}): Promise<Record<string, unknown>> {
  let result = {} as FilterQuery<any>

  if (typeof where === 'object') {
    // We need to determine if the whereKey is an AND, OR, or a schema path
    for (const relationOrPath of Object.keys(where)) {
      const condition = where[relationOrPath]
      let conditionOperator: '$and' | '$or' | null = null
      if (relationOrPath.toLowerCase() === 'and') {
        conditionOperator = '$and'
      } else if (relationOrPath.toLowerCase() === 'or') {
        conditionOperator = '$or'
      }
      if (Array.isArray(condition)) {
        const builtConditions = await buildAndOrConditions({
          collectionSlug,
          fields,
          globalSlug,
          locale,
          parentIsLocalized,
          payload,
          where: condition,
        })
        if (builtConditions.length > 0 && conditionOperator !== null) {
          result[conditionOperator] = builtConditions
        }
      } else {
        // It's a path - and there can be multiple comparisons on a single path.
        // For example - title like 'test' and title not equal to 'tester'
        // So we need to loop on keys again here to handle each operator independently
        const pathOperators = where[relationOrPath]
        if (typeof pathOperators === 'object') {
          const validOperators: Operator[] = Object.keys(pathOperators).filter((operator) =>
            validOperatorSet.has(operator as Operator),
          ) as Operator[]

          for (const operator of validOperators) {
            const searchParam = await buildSearchParam({
              collectionSlug,
              fields,
              globalSlug,
              incomingPath: relationOrPath,
              locale,
              operator,
              parentIsLocalized,
              payload,
              val: (pathOperators as Record<string, Where>)[operator],
            })

            if (searchParam?.value && searchParam?.path) {
              if (validOperators.length > 1) {
                if (!result.$and) {
                  result.$and = []
                }
                result.$and.push({
                  [searchParam.path]: searchParam.value,
                })
              } else {
                if (result[searchParam.path]) {
                  if (!result.$and) {
                    result.$and = []
                  }

                  result.$and.push({ [searchParam.path]: result[searchParam.path] })
                  result.$and.push({
                    [searchParam.path]: searchParam.value,
                  })
                  delete result[searchParam.path]
                } else {
                  result[searchParam.path] = searchParam.value
                }
              }
            } else if (typeof searchParam?.value === 'object') {
              result = deepMergeWithCombinedArrays(result, searchParam.value ?? {}, {
                // dont clone Types.ObjectIDs
                clone: false,
              })
            }
          }
        }
      }
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

````
