---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 152
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 152 of 695)

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

---[FILE: buildMutationInputType.ts]---
Location: payload-main/packages/graphql/src/schema/buildMutationInputType.ts

```typescript
import type { GraphQLInputFieldConfig, GraphQLScalarType, GraphQLType } from 'graphql'
import type {
  ArrayField,
  BlocksField,
  CheckboxField,
  CodeField,
  CollapsibleField,
  DateField,
  EmailField,
  Field,
  GraphQLInfo,
  GroupField,
  JSONField,
  NumberField,
  PointField,
  RadioField,
  RelationshipField,
  RichTextField,
  RowField,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SelectField,
  TabsField,
  TextareaField,
  TextField,
  UploadField,
} from 'payload'

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import { flattenTopLevelFields, toWords } from 'payload'
import { fieldAffectsData, optionIsObject, tabHasName } from 'payload/shared'

import { GraphQLJSON } from '../packages/graphql-type-json/index.js'
import { combineParentName } from '../utilities/combineParentName.js'
import { formatName } from '../utilities/formatName.js'
import { groupOrTabHasRequiredSubfield } from '../utilities/groupOrTabHasRequiredSubfield.js'
import { withNullableType } from './withNullableType.js'

const idFieldTypes = {
  number: GraphQLInt,
  text: GraphQLString,
}

export const getCollectionIDType = (
  type: keyof typeof idFieldTypes,
  collection: SanitizedCollectionConfig,
): GraphQLScalarType => {
  const idField = flattenTopLevelFields(collection.fields).find(
    (field) => fieldAffectsData(field) && field.name === 'id',
  )

  if (!idField) {
    return idFieldTypes[type]
  }

  return idFieldTypes[idField.type]
}

export type InputObjectTypeConfig = {
  [path: string]: GraphQLInputFieldConfig
}

type BuildMutationInputTypeArgs = {
  config: SanitizedConfig
  fields: Field[]
  forceNullable?: boolean
  graphqlResult: GraphQLInfo
  name: string
  parentIsLocalized: boolean
  parentName: string
}

export function buildMutationInputType({
  name,
  config,
  fields,
  forceNullable = false,
  graphqlResult,
  parentIsLocalized,
  parentName,
}: BuildMutationInputTypeArgs): GraphQLInputObjectType | null {
  const fieldToSchemaMap = {
    array: (inputObjectTypeConfig: InputObjectTypeConfig, field: ArrayField) => {
      const fullName = combineParentName(parentName, toWords(field.name, true))
      let type: GraphQLList<GraphQLType> | GraphQLType = buildMutationInputType({
        name: fullName,
        config,
        fields: field.fields,
        graphqlResult,
        parentIsLocalized: parentIsLocalized || field.localized,
        parentName: fullName,
      })

      if (!type) {
        return inputObjectTypeConfig
      }

      type = new GraphQLList(withNullableType({ type, field, forceNullable, parentIsLocalized }))
      return {
        ...inputObjectTypeConfig,
        [formatName(field.name)]: { type },
      }
    },
    blocks: (inputObjectTypeConfig: InputObjectTypeConfig, field: BlocksField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: { type: GraphQLJSON },
    }),
    checkbox: (inputObjectTypeConfig: InputObjectTypeConfig, field: CheckboxField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: { type: GraphQLBoolean },
    }),
    code: (inputObjectTypeConfig: InputObjectTypeConfig, field: CodeField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLString, field, forceNullable, parentIsLocalized }),
      },
    }),
    collapsible: (inputObjectTypeConfig: InputObjectTypeConfig, field: CollapsibleField) =>
      field.fields.reduce((acc, subField: CollapsibleField) => {
        const addSubField = fieldToSchemaMap[subField.type]
        if (addSubField) {
          return addSubField(acc, subField)
        }
        return acc
      }, inputObjectTypeConfig),
    date: (inputObjectTypeConfig: InputObjectTypeConfig, field: DateField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLString, field, forceNullable, parentIsLocalized }),
      },
    }),
    email: (inputObjectTypeConfig: InputObjectTypeConfig, field: EmailField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLString, field, forceNullable, parentIsLocalized }),
      },
    }),
    group: (inputObjectTypeConfig: InputObjectTypeConfig, field: GroupField) => {
      if (fieldAffectsData(field)) {
        const requiresAtLeastOneField = groupOrTabHasRequiredSubfield(field)
        const fullName = combineParentName(parentName, toWords(field.name, true))
        let type: GraphQLType = buildMutationInputType({
          name: fullName,
          config,
          fields: field.fields,
          graphqlResult,
          parentIsLocalized: parentIsLocalized || field.localized,
          parentName: fullName,
        })

        if (!type) {
          return inputObjectTypeConfig
        }

        if (requiresAtLeastOneField) {
          type = new GraphQLNonNull(type)
        }
        return {
          ...inputObjectTypeConfig,
          [formatName(field.name)]: { type },
        }
      } else {
        return field.fields.reduce((acc, subField: CollapsibleField) => {
          const addSubField = fieldToSchemaMap[subField.type]
          if (addSubField) {
            return addSubField(acc, subField)
          }
          return acc
        }, inputObjectTypeConfig)
      }
    },
    json: (inputObjectTypeConfig: InputObjectTypeConfig, field: JSONField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLJSON, field, forceNullable, parentIsLocalized }),
      },
    }),
    number: (inputObjectTypeConfig: InputObjectTypeConfig, field: NumberField) => {
      const type = field.name === 'id' ? GraphQLInt : GraphQLFloat
      return {
        ...inputObjectTypeConfig,
        [formatName(field.name)]: {
          type: withNullableType({
            type: field.hasMany === true ? new GraphQLList(type) : type,
            field,
            forceNullable,
            parentIsLocalized,
          }),
        },
      }
    },
    point: (inputObjectTypeConfig: InputObjectTypeConfig, field: PointField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({
          type: new GraphQLList(GraphQLFloat),
          field,
          forceNullable,
          parentIsLocalized,
        }),
      },
    }),
    radio: (inputObjectTypeConfig: InputObjectTypeConfig, field: RadioField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLString, field, forceNullable, parentIsLocalized }),
      },
    }),
    relationship: (inputObjectTypeConfig: InputObjectTypeConfig, field: RelationshipField) => {
      const { relationTo } = field
      type PayloadGraphQLRelationshipType =
        | GraphQLInputObjectType
        | GraphQLList<GraphQLScalarType>
        | GraphQLScalarType
      let type: PayloadGraphQLRelationshipType

      if (Array.isArray(relationTo)) {
        const fullName = `${combineParentName(
          parentName,
          toWords(field.name, true),
        )}RelationshipInput`
        type = new GraphQLInputObjectType({
          name: fullName,
          fields: {
            relationTo: {
              type: new GraphQLEnumType({
                name: `${fullName}RelationTo`,
                values: relationTo.reduce(
                  (values, option) => ({
                    ...values,
                    [formatName(option)]: {
                      value: option,
                    },
                  }),
                  {},
                ),
              }),
            },
            value: { type: GraphQLJSON },
          },
        })
      } else {
        type = getCollectionIDType(
          config.db.defaultIDType,
          graphqlResult.collections[relationTo].config,
        )
      }

      return {
        ...inputObjectTypeConfig,
        [formatName(field.name)]: { type: field.hasMany ? new GraphQLList(type) : type },
      }
    },
    richText: (inputObjectTypeConfig: InputObjectTypeConfig, field: RichTextField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLJSON, field, forceNullable, parentIsLocalized }),
      },
    }),
    row: (inputObjectTypeConfig: InputObjectTypeConfig, field: RowField) =>
      field.fields.reduce((acc, subField: Field) => {
        const addSubField = fieldToSchemaMap[subField.type]
        if (addSubField) {
          return addSubField(acc, subField)
        }
        return acc
      }, inputObjectTypeConfig),
    select: (inputObjectTypeConfig: InputObjectTypeConfig, field: SelectField) => {
      const formattedName = `${combineParentName(parentName, field.name)}_MutationInput`
      let type: GraphQLType = new GraphQLEnumType({
        name: formattedName,
        values: field.options.reduce((values, option) => {
          if (optionIsObject(option)) {
            return {
              ...values,
              [formatName(option.value)]: {
                value: option.value,
              },
            }
          }

          return {
            ...values,
            [formatName(option)]: {
              value: option,
            },
          }
        }, {}),
      })

      type = field.hasMany ? new GraphQLList(type) : type
      type = withNullableType({ type, field, forceNullable, parentIsLocalized })

      return {
        ...inputObjectTypeConfig,
        [formatName(field.name)]: { type },
      }
    },
    tabs: (inputObjectTypeConfig: InputObjectTypeConfig, field: TabsField) => {
      return field.tabs.reduce((acc, tab) => {
        if (tabHasName(tab)) {
          const fullName = combineParentName(parentName, toWords(tab.name, true))
          const requiresAtLeastOneField = groupOrTabHasRequiredSubfield(field)
          let type: GraphQLType = buildMutationInputType({
            name: fullName,
            config,
            fields: tab.fields,
            graphqlResult,
            parentIsLocalized: parentIsLocalized || tab.localized,
            parentName: fullName,
          })

          if (!type) {
            return acc
          }

          if (requiresAtLeastOneField) {
            type = new GraphQLNonNull(type)
          }
          return {
            ...acc,
            [tab.name]: { type },
          }
        }

        return {
          ...acc,
          ...tab.fields.reduce((subFieldSchema, subField) => {
            const addSubField = fieldToSchemaMap[subField.type]
            if (addSubField) {
              return addSubField(subFieldSchema, subField)
            }
            return subFieldSchema
          }, acc),
        }
      }, inputObjectTypeConfig)
    },
    text: (inputObjectTypeConfig: InputObjectTypeConfig, field: TextField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({
          type: field.hasMany === true ? new GraphQLList(GraphQLString) : GraphQLString,
          field,
          forceNullable,
          parentIsLocalized,
        }),
      },
    }),
    textarea: (inputObjectTypeConfig: InputObjectTypeConfig, field: TextareaField) => ({
      ...inputObjectTypeConfig,
      [formatName(field.name)]: {
        type: withNullableType({ type: GraphQLString, field, forceNullable, parentIsLocalized }),
      },
    }),
    upload: (inputObjectTypeConfig: InputObjectTypeConfig, field: UploadField) => {
      const { relationTo } = field
      type PayloadGraphQLRelationshipType =
        | GraphQLInputObjectType
        | GraphQLList<GraphQLScalarType>
        | GraphQLScalarType
      let type: PayloadGraphQLRelationshipType

      if (Array.isArray(relationTo)) {
        const fullName = `${combineParentName(
          parentName,
          toWords(field.name, true),
        )}RelationshipInput`
        type = new GraphQLInputObjectType({
          name: fullName,
          fields: {
            relationTo: {
              type: new GraphQLEnumType({
                name: `${fullName}RelationTo`,
                values: relationTo.reduce(
                  (values, option) => ({
                    ...values,
                    [formatName(option)]: {
                      value: option,
                    },
                  }),
                  {},
                ),
              }),
            },
            value: { type: GraphQLJSON },
          },
        })
      } else {
        type = getCollectionIDType(
          config.db.defaultIDType,
          graphqlResult.collections[relationTo].config,
        )
      }

      return {
        ...inputObjectTypeConfig,
        [formatName(field.name)]: { type: field.hasMany ? new GraphQLList(type) : type },
      }
    },
  }

  const fieldName = formatName(name)

  const fieldSchemas = fields.reduce((inputObjectTypeConfig, field) => {
    const fieldSchema = fieldToSchemaMap[field.type]

    if (typeof fieldSchema !== 'function') {
      return inputObjectTypeConfig
    }

    const schema = fieldSchema(inputObjectTypeConfig, field)
    if (Object.keys(schema).length === 0) {
      return inputObjectTypeConfig
    }

    return {
      ...inputObjectTypeConfig,
      ...fieldSchema(inputObjectTypeConfig, field),
    }
  }, {})

  if (Object.keys(fieldSchemas).length === 0) {
    return null
  }

  return new GraphQLInputObjectType({
    name: `mutation${fieldName}Input`,
    fields: fieldSchemas,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildObjectType.ts]---
Location: payload-main/packages/graphql/src/schema/buildObjectType.ts

```typescript
import type { GraphQLFieldConfig } from 'graphql'
import type { Field, GraphQLInfo, SanitizedConfig } from 'payload'

import { GraphQLObjectType } from 'graphql'

import { fieldToSchemaMap } from './fieldToSchemaMap.js'

export type ObjectTypeConfig = {
  [path: string]: GraphQLFieldConfig<any, any, any>
}

type Args = {
  baseFields?: ObjectTypeConfig
  collectionSlug?: string
  config: SanitizedConfig
  fields: Field[]
  forceNullable?: boolean
  graphqlResult: GraphQLInfo
  name: string
  parentIsLocalized?: boolean
  parentName: string
}

export function buildObjectType({
  name,
  baseFields = {},
  collectionSlug,
  config,
  fields,
  forceNullable,
  graphqlResult,
  parentIsLocalized,
  parentName,
}: Args): GraphQLObjectType {
  const objectSchema = {
    name,
    fields: () =>
      fields.reduce((objectTypeConfig, field) => {
        const fieldSchema = fieldToSchemaMap[field.type]

        if (typeof fieldSchema !== 'function') {
          return objectTypeConfig
        }

        return {
          ...objectTypeConfig,
          ...fieldSchema({
            collectionSlug,
            config,
            field,
            forceNullable,
            graphqlResult,
            newlyCreatedBlockType,
            objectTypeConfig,
            parentIsLocalized,
            parentName,
          }),
        }
      }, baseFields),
  }

  const newlyCreatedBlockType = new GraphQLObjectType(objectSchema)

  return newlyCreatedBlockType
}
```

--------------------------------------------------------------------------------

---[FILE: buildPaginatedListType.ts]---
Location: payload-main/packages/graphql/src/schema/buildPaginatedListType.ts

```typescript
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql'

export const buildPaginatedListType = (name, docType) =>
  new GraphQLObjectType({
    name,
    fields: {
      docs: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(docType))),
      },
      hasNextPage: { type: new GraphQLNonNull(GraphQLBoolean) },
      hasPrevPage: { type: new GraphQLNonNull(GraphQLBoolean) },
      limit: { type: new GraphQLNonNull(GraphQLInt) },
      nextPage: { type: GraphQLInt },
      offset: { type: GraphQLInt },
      page: { type: new GraphQLNonNull(GraphQLInt) },
      pagingCounter: { type: new GraphQLNonNull(GraphQLInt) },
      prevPage: { type: GraphQLInt },
      totalDocs: { type: new GraphQLNonNull(GraphQLInt) },
      totalPages: { type: new GraphQLNonNull(GraphQLInt) },
    },
  })
```

--------------------------------------------------------------------------------

---[FILE: buildPoliciesType.ts]---
Location: payload-main/packages/graphql/src/schema/buildPoliciesType.ts

```typescript
import type {
  CollectionConfig,
  Field,
  GlobalConfig,
  SanitizedCollectionConfig,
  SanitizedConfig,
  SanitizedGlobalConfig,
} from 'payload'

import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { toWords } from 'payload'

import { GraphQLJSONObject } from '../packages/graphql-type-json/index.js'
import { formatName } from '../utilities/formatName.js'

type OperationType = 'create' | 'delete' | 'read' | 'readVersions' | 'unlock' | 'update'

type AccessScopes = 'docAccess' | undefined

type ObjectTypeFields = {
  [key in 'fields' | OperationType]?: { type: GraphQLObjectType }
}

const buildFields = (label, fieldsToBuild) =>
  fieldsToBuild.reduce((builtFields, field) => {
    const includeField = !field.hidden && field.type !== 'ui'
    if (includeField) {
      if (field.name) {
        const fieldName = formatName(field.name)

        const objectTypeFields: ObjectTypeFields = ['create', 'read', 'update', 'delete'].reduce(
          (operations, operation) => {
            const capitalizedOperation = operation.charAt(0).toUpperCase() + operation.slice(1)

            return {
              ...operations,
              [operation]: {
                type: new GraphQLObjectType({
                  name: `${label}_${fieldName}_${capitalizedOperation}`,
                  fields: {
                    permission: {
                      type: new GraphQLNonNull(GraphQLBoolean),
                    },
                  },
                }),
              },
            }
          },
          {},
        )

        if (field.fields) {
          objectTypeFields.fields = {
            type: new GraphQLObjectType({
              name: `${label}_${fieldName}_Fields`,
              fields: buildFields(`${label}_${fieldName}`, field.fields),
            }),
          }
        }

        return {
          ...builtFields,
          [formatName(field.name)]: {
            type: new GraphQLObjectType({
              name: `${label}_${fieldName}`,
              fields: objectTypeFields,
            }),
          },
        }
      }

      if (!field.name && field.fields && field.fields.length) {
        const subFields = buildFields(label, field.fields)

        return {
          ...builtFields,
          ...subFields,
        }
      }

      if (field.type === 'tabs') {
        return field.tabs.reduce(
          (fieldsWithTabFields, tab) => {
            if ('name' in tab) {
              if (tab.fields.length) {
                const tabName = formatName(tab.name)
                fieldsWithTabFields[tabName] = {
                  type: new GraphQLObjectType({
                    name: `${label}_${tabName}`,
                    fields: buildFields(`${label}_${tabName}`, tab.fields),
                  }),
                }
              }
              return fieldsWithTabFields
            }
            return {
              ...fieldsWithTabFields,
              ...buildFields(label, tab.fields),
            }
          },
          { ...builtFields },
        )
      }
    }
    return builtFields
  }, {})

type BuildEntityPolicy = {
  entityFields: Field[]
  name: string
  operations: OperationType[]
  scope: AccessScopes
}
export const buildEntityPolicy = (args: BuildEntityPolicy) => {
  const { name, entityFields, operations, scope } = args

  const fieldsTypeName = toWords(`${name}-${scope || ''}-Fields`, true)
  const fields = {
    fields: {
      type: new GraphQLObjectType({
        name: fieldsTypeName,
        fields: buildFields(fieldsTypeName, entityFields),
      }),
    },
  }

  operations.forEach((operation) => {
    const operationTypeName = toWords(`${name}-${operation}-${scope || 'Access'}`, true)

    fields[operation] = {
      type: new GraphQLObjectType({
        name: operationTypeName,
        fields: {
          permission: { type: new GraphQLNonNull(GraphQLBoolean) },
          where: { type: GraphQLJSONObject },
        },
      }),
    }
  })

  return fields
}

type BuildPolicyType = {
  scope?: AccessScopes
  typeSuffix?: string
} & (
  | {
      entity: CollectionConfig
      type: 'collection'
    }
  | {
      entity: GlobalConfig
      type: 'global'
    }
)
export function buildPolicyType(args: BuildPolicyType): GraphQLObjectType {
  const { type, entity, scope, typeSuffix } = args
  const { slug, fields, graphQL, versions } = entity

  let operations = []

  if (graphQL === false) {
    return null
  }

  if (type === 'collection') {
    operations = ['create', 'read', 'update', 'delete']

    if (
      entity.auth &&
      typeof entity.auth === 'object' &&
      typeof entity.auth.maxLoginAttempts !== 'undefined' &&
      entity.auth.maxLoginAttempts !== 0
    ) {
      operations.push('unlock')
    }

    if (versions) {
      operations.push('readVersions')
    }

    const collectionTypeName = formatName(`${slug}${typeSuffix || ''}`)

    return new GraphQLObjectType({
      name: collectionTypeName,
      fields: buildEntityPolicy({
        name: slug,
        entityFields: fields,
        operations,
        scope,
      }),
    })
  }

  // else create global type
  operations = ['read', 'update']

  if (entity.versions) {
    operations.push('readVersions')
  }

  const globalTypeName = formatName(`${global?.graphQL?.name || slug}${typeSuffix || ''}`)

  return new GraphQLObjectType({
    name: globalTypeName,
    fields: buildEntityPolicy({
      name: entity.graphQL ? entity?.graphQL?.name || slug : slug,
      entityFields: entity.fields,
      operations,
      scope,
    }),
  })
}

export function buildPoliciesType(config: SanitizedConfig): GraphQLObjectType {
  const fields = {
    canAccessAdmin: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  }

  Object.values(config.collections).forEach((collection: SanitizedCollectionConfig) => {
    if (collection.graphQL === false) {
      return
    }
    const collectionPolicyType = buildPolicyType({
      type: 'collection',
      entity: collection,
      typeSuffix: 'Access',
    })

    fields[formatName(collection.slug)] = {
      type: collectionPolicyType,
    }
  })

  Object.values(config.globals).forEach((global: SanitizedGlobalConfig) => {
    if (global.graphQL === false) {
      return
    }
    const globalPolicyType = buildPolicyType({
      type: 'global',
      entity: global,
      typeSuffix: 'Access',
    })

    fields[formatName(global.slug)] = {
      type: globalPolicyType,
    }
  })

  return new GraphQLObjectType({
    name: 'Access',
    fields,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: buildWhereInputType.ts]---
Location: payload-main/packages/graphql/src/schema/buildWhereInputType.ts

```typescript
import type { Field, FieldAffectingData } from 'payload'

import { GraphQLInputObjectType, GraphQLList } from 'graphql'
import { flattenTopLevelFields } from 'payload'
import { fieldAffectsData, fieldHasSubFields, fieldIsPresentationalOnly } from 'payload/shared'

import { formatName } from '../utilities/formatName.js'
import { fieldToSchemaMap } from './fieldToWhereInputSchemaMap.js'
import { withOperators } from './withOperators.js'

type Args = {
  fields: Field[]
  name: string
  parentName: string
}

/** This does as the function name suggests. It builds a where GraphQL input type
 * for all the fields which are passed to the function.
 * Each field has different operators which may be valid for a where input type.
 * For example, a text field may have a "contains" operator, but a number field
 * may not.
 *
 * buildWhereInputType is similar to buildObjectType and operates
 * on a field basis with a few distinct differences.
 *
 * 1. Everything needs to be a GraphQLInputObjectType or scalar / enum
 * 2. Relationships, groups, repeaters and flex content are not
 *    directly searchable. Instead, we need to build a chained pathname
 *    using dot notation so MongoDB can properly search nested paths.
 */
export const buildWhereInputType = ({ name, fields, parentName }: Args): GraphQLInputObjectType => {
  // This is the function that builds nested paths for all
  // field types with nested paths.

  const idField = flattenTopLevelFields(fields).find(
    (field) => fieldAffectsData(field) && field.name === 'id',
  )

  const fieldTypes = fields.reduce((schema, field) => {
    if (!fieldIsPresentationalOnly(field) && !field.hidden) {
      const getFieldSchema = fieldToSchemaMap({
        parentName,
      })[field.type]

      if (getFieldSchema) {
        const fieldSchema = getFieldSchema(field)

        if (fieldHasSubFields(field) || field.type === 'tabs') {
          return {
            ...schema,
            ...fieldSchema.reduce(
              (subFields, subField) => ({
                ...subFields,
                [formatName(subField.key)]: subField.type,
              }),
              {},
            ),
          }
        }

        return {
          ...schema,
          [formatName(field.name)]: fieldSchema,
        }
      }
    }

    return schema
  }, {})

  if (!idField) {
    fieldTypes.id = {
      type: withOperators({ name: 'id', type: 'text' } as FieldAffectingData, parentName),
    }
  }

  const fieldName = formatName(name)

  const recursiveFields = {
    AND: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: `${fieldName}_where_and`,
          fields: () => ({
            ...fieldTypes,
            ...recursiveFields,
          }),
        }),
      ),
    },
    OR: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: `${fieldName}_where_or`,
          fields: () => ({
            ...fieldTypes,
            ...recursiveFields,
          }),
        }),
      ),
    },
  }

  return new GraphQLInputObjectType({
    name: `${fieldName}_where`,
    fields: {
      ...fieldTypes,
      ...recursiveFields,
    },
  })
}
```

--------------------------------------------------------------------------------

````
