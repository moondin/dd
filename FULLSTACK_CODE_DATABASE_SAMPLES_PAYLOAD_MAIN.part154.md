---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 154
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 154 of 695)

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

---[FILE: fieldToWhereInputSchemaMap.ts]---
Location: payload-main/packages/graphql/src/schema/fieldToWhereInputSchemaMap.ts

```typescript
import type {
  ArrayField,
  CheckboxField,
  CodeField,
  CollapsibleField,
  DateField,
  EmailField,
  GroupField,
  JSONField,
  NumberField,
  PointField,
  RadioField,
  RelationshipField,
  RichTextField,
  RowField,
  SelectField,
  TabsField,
  TextareaField,
  TextField,
  UploadField,
} from 'payload'

import { GraphQLEnumType, GraphQLInputObjectType } from 'graphql'

import { GraphQLJSON } from '../packages/graphql-type-json/index.js'
import { combineParentName } from '../utilities/combineParentName.js'
import { formatName } from '../utilities/formatName.js'
import { recursivelyBuildNestedPaths } from './recursivelyBuildNestedPaths.js'
import { withOperators } from './withOperators.js'

type Args = {
  collectionSlug?: string
  nestedFieldName?: string
  parentName: string
}

export const fieldToSchemaMap = ({ nestedFieldName, parentName }: Args): any => ({
  array: (field: ArrayField) =>
    recursivelyBuildNestedPaths({
      field,
      nestedFieldName2: nestedFieldName,
      parentName,
    }),
  checkbox: (field: CheckboxField) => ({
    type: withOperators(field, parentName),
  }),
  code: (field: CodeField) => ({
    type: withOperators(field, parentName),
  }),
  collapsible: (field: CollapsibleField) =>
    recursivelyBuildNestedPaths({
      field,
      nestedFieldName2: nestedFieldName,
      parentName,
    }),
  date: (field: DateField) => ({
    type: withOperators(field, parentName),
  }),
  email: (field: EmailField) => ({
    type: withOperators(field, parentName),
  }),
  group: (field: GroupField) =>
    recursivelyBuildNestedPaths({
      field,
      nestedFieldName2: nestedFieldName,
      parentName,
    }),
  json: (field: JSONField) => ({
    type: withOperators(field, parentName),
  }),
  number: (field: NumberField) => ({
    type: withOperators(field, parentName),
  }),
  point: (field: PointField) => ({
    type: withOperators(field, parentName),
  }),
  radio: (field: RadioField) => ({
    type: withOperators(field, parentName),
  }),
  relationship: (field: RelationshipField) => {
    if (Array.isArray(field.relationTo)) {
      return {
        type: new GraphQLInputObjectType({
          name: `${combineParentName(parentName, field.name)}_Relation`,
          fields: {
            relationTo: {
              type: new GraphQLEnumType({
                name: `${combineParentName(parentName, field.name)}_Relation_RelationTo`,
                values: field.relationTo.reduce(
                  (values, relation) => ({
                    ...values,
                    [formatName(relation)]: {
                      value: relation,
                    },
                  }),
                  {},
                ),
              }),
            },
            value: { type: GraphQLJSON },
          },
        }),
      }
    }

    return {
      type: withOperators(field, parentName),
    }
  },
  richText: (field: RichTextField) => ({
    type: withOperators(field, parentName),
  }),
  row: (field: RowField) =>
    recursivelyBuildNestedPaths({
      field,
      nestedFieldName2: nestedFieldName,
      parentName,
    }),
  select: (field: SelectField) => ({
    type: withOperators(field, parentName),
  }),
  tabs: (field: TabsField) =>
    recursivelyBuildNestedPaths({
      field,
      nestedFieldName2: nestedFieldName,
      parentName,
    }),
  text: (field: TextField) => ({
    type: withOperators(field, parentName),
  }),
  textarea: (field: TextareaField) => ({
    type: withOperators(field, parentName),
  }),
  upload: (field: UploadField) => {
    if (Array.isArray(field.relationTo)) {
      return {
        type: new GraphQLInputObjectType({
          name: `${combineParentName(parentName, field.name)}_Relation`,
          fields: {
            relationTo: {
              type: new GraphQLEnumType({
                name: `${combineParentName(parentName, field.name)}_Relation_RelationTo`,
                values: field.relationTo.reduce(
                  (values, relation) => ({
                    ...values,
                    [formatName(relation)]: {
                      value: relation,
                    },
                  }),
                  {},
                ),
              }),
            },
            value: { type: GraphQLJSON },
          },
        }),
      }
    }

    return {
      type: withOperators(field, parentName),
    }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: initCollections.ts]---
Location: payload-main/packages/graphql/src/schema/initCollections.ts

```typescript
import type {
  Collection,
  Field,
  GraphQLInfo,
  SanitizedCollectionConfig,
  SanitizedConfig,
} from 'payload'

import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { buildVersionCollectionFields, flattenTopLevelFields, formatNames, toWords } from 'payload'
import { fieldAffectsData, getLoginOptions } from 'payload/shared'

import type { ObjectTypeConfig } from './buildObjectType.js'

import { forgotPassword } from '../resolvers/auth/forgotPassword.js'
import { init } from '../resolvers/auth/init.js'
import { login } from '../resolvers/auth/login.js'
import { logout } from '../resolvers/auth/logout.js'
import { me } from '../resolvers/auth/me.js'
import { refresh } from '../resolvers/auth/refresh.js'
import { resetPassword } from '../resolvers/auth/resetPassword.js'
import { unlock } from '../resolvers/auth/unlock.js'
import { verifyEmail } from '../resolvers/auth/verifyEmail.js'
import { countResolver } from '../resolvers/collections/count.js'
import { createResolver } from '../resolvers/collections/create.js'
import { getDeleteResolver } from '../resolvers/collections/delete.js'
import { docAccessResolver } from '../resolvers/collections/docAccess.js'
import { duplicateResolver } from '../resolvers/collections/duplicate.js'
import { findResolver } from '../resolvers/collections/find.js'
import { findByIDResolver } from '../resolvers/collections/findByID.js'
import { findVersionByIDResolver } from '../resolvers/collections/findVersionByID.js'
import { findVersionsResolver } from '../resolvers/collections/findVersions.js'
import { restoreVersionResolver } from '../resolvers/collections/restoreVersion.js'
import { updateResolver } from '../resolvers/collections/update.js'
import { formatName } from '../utilities/formatName.js'
import { buildMutationInputType, getCollectionIDType } from './buildMutationInputType.js'
import { buildObjectType } from './buildObjectType.js'
import { buildPaginatedListType } from './buildPaginatedListType.js'
import { buildPolicyType } from './buildPoliciesType.js'
import { buildWhereInputType } from './buildWhereInputType.js'

type InitCollectionsGraphQLArgs = {
  config: SanitizedConfig
  graphqlResult: GraphQLInfo
}
export function initCollections({ config, graphqlResult }: InitCollectionsGraphQLArgs): void {
  Object.keys(graphqlResult.collections).forEach((slug) => {
    const collection: Collection = graphqlResult.collections[slug]
    const {
      config: collectionConfig,
      config: { fields, graphQL = {} as SanitizedCollectionConfig['graphQL'], versions },
    } = collection

    if (!graphQL) {
      return
    }

    let singularName
    let pluralName

    const fromSlug = formatNames(collection.config.slug)

    if (graphQL.singularName) {
      singularName = toWords(graphQL.singularName, true)
    } else {
      singularName = fromSlug.singular
    }
    if (graphQL.pluralName) {
      pluralName = toWords(graphQL.pluralName, true)
    } else {
      pluralName = fromSlug.plural
    }

    // For collections named 'Media' or similar,
    // there is a possibility that the singular name
    // will equal the plural name. Append `all` to the beginning
    // of potential conflicts
    if (singularName === pluralName) {
      pluralName = `all${singularName}`
    }

    collection.graphQL = {} as Collection['graphQL']

    const hasIDField =
      flattenTopLevelFields(fields).findIndex(
        (field) => fieldAffectsData(field) && field.name === 'id',
      ) > -1

    const idType = getCollectionIDType(config.db.defaultIDType, collectionConfig)

    const baseFields: ObjectTypeConfig = {}

    const whereInputFields = [...fields]

    if (!hasIDField) {
      baseFields.id = { type: new GraphQLNonNull(idType) }
      whereInputFields.push({
        name: 'id',
        type: config.db.defaultIDType as 'text',
      })
    }

    const forceNullableObjectType = Boolean(versions?.drafts)

    collection.graphQL.type = buildObjectType({
      name: singularName,
      baseFields,
      collectionSlug: collectionConfig.slug,
      config,
      fields,
      forceNullable: forceNullableObjectType,
      graphqlResult,
      parentName: singularName,
    })

    collection.graphQL.paginatedType = buildPaginatedListType(pluralName, collection.graphQL.type)

    collection.graphQL.whereInputType = buildWhereInputType({
      name: singularName,
      fields: whereInputFields,
      parentName: singularName,
    })

    const mutationInputFields = [...fields]

    if (
      collectionConfig.auth &&
      (!collectionConfig.auth.disableLocalStrategy ||
        (typeof collectionConfig.auth.disableLocalStrategy === 'object' &&
          collectionConfig.auth.disableLocalStrategy.optionalPassword))
    ) {
      mutationInputFields.push({
        name: 'password',
        type: 'text',
        label: 'Password',
        required: !(
          typeof collectionConfig.auth.disableLocalStrategy === 'object' &&
          collectionConfig.auth.disableLocalStrategy.optionalPassword
        ),
      })
    }

    let mutationCreateInputFields = mutationInputFields

    if (
      config.db.allowIDOnCreate &&
      !collectionConfig.flattenedFields.some((field) => field.name === 'id')
    ) {
      mutationCreateInputFields = [
        ...mutationCreateInputFields,
        {
          name: 'id',
          type: config.db.defaultIDType,
        } as Field,
      ]
    }

    const createMutationInputType = buildMutationInputType({
      name: singularName,
      config,
      fields: mutationCreateInputFields,
      graphqlResult,
      parentIsLocalized: false,
      parentName: singularName,
    })
    if (createMutationInputType) {
      collection.graphQL.mutationInputType = new GraphQLNonNull(createMutationInputType)
    }

    const updateMutationInputType = buildMutationInputType({
      name: `${singularName}Update`,
      config,
      fields: mutationInputFields.filter(
        (field) => !(fieldAffectsData(field) && field.name === 'id'),
      ),
      forceNullable: true,
      graphqlResult,
      parentIsLocalized: false,
      parentName: `${singularName}Update`,
    })
    if (updateMutationInputType) {
      collection.graphQL.updateMutationInputType = new GraphQLNonNull(updateMutationInputType)
    }

    const queriesEnabled =
      typeof collectionConfig.graphQL !== 'object' || !collectionConfig.graphQL.disableQueries
    const mutationsEnabled =
      typeof collectionConfig.graphQL !== 'object' || !collectionConfig.graphQL.disableMutations

    if (queriesEnabled) {
      graphqlResult.Query.fields[singularName] = {
        type: collection.graphQL.type,
        args: {
          id: { type: new GraphQLNonNull(idType) },
          draft: { type: GraphQLBoolean },
          ...(config.localization
            ? {
                fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
          select: { type: GraphQLBoolean },
          trash: { type: GraphQLBoolean },
        },
        resolve: findByIDResolver(collection),
      }

      graphqlResult.Query.fields[pluralName] = {
        type: buildPaginatedListType(pluralName, collection.graphQL.type),
        args: {
          draft: { type: GraphQLBoolean },
          where: { type: collection.graphQL.whereInputType },
          ...(config.localization
            ? {
                fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
          limit: { type: GraphQLInt },
          page: { type: GraphQLInt },
          pagination: { type: GraphQLBoolean },
          select: { type: GraphQLBoolean },
          sort: { type: GraphQLString },
          trash: { type: GraphQLBoolean },
        },
        resolve: findResolver(collection),
      }

      graphqlResult.Query.fields[`count${pluralName}`] = {
        type: new GraphQLObjectType({
          name: `count${pluralName}`,
          fields: {
            totalDocs: { type: GraphQLInt },
          },
        }),
        args: {
          draft: { type: GraphQLBoolean },
          trash: { type: GraphQLBoolean },
          where: { type: collection.graphQL.whereInputType },
          ...(config.localization
            ? {
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
        },
        resolve: countResolver(collection),
      }

      graphqlResult.Query.fields[`docAccess${singularName}`] = {
        type: buildPolicyType({
          type: 'collection',
          entity: collectionConfig,
          scope: 'docAccess',
          typeSuffix: 'DocAccess',
        }),
        args: {
          id: { type: new GraphQLNonNull(idType) },
        },
        resolve: docAccessResolver(collection),
      }
    }

    if (mutationsEnabled) {
      graphqlResult.Mutation.fields[`create${singularName}`] = {
        type: collection.graphQL.type,
        args: {
          ...(createMutationInputType
            ? { data: { type: collection.graphQL.mutationInputType } }
            : {}),
          draft: { type: GraphQLBoolean },
          ...(config.localization
            ? {
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
        },
        resolve: createResolver(collection),
      }

      graphqlResult.Mutation.fields[`update${singularName}`] = {
        type: collection.graphQL.type,
        args: {
          id: { type: new GraphQLNonNull(idType) },
          autosave: { type: GraphQLBoolean },
          ...(updateMutationInputType
            ? { data: { type: collection.graphQL.updateMutationInputType } }
            : {}),
          draft: { type: GraphQLBoolean },
          ...(config.localization
            ? {
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
          trash: { type: GraphQLBoolean },
        },
        resolve: updateResolver(collection),
      }

      graphqlResult.Mutation.fields[`delete${singularName}`] = {
        type: collection.graphQL.type,
        args: {
          id: { type: new GraphQLNonNull(idType) },
          trash: { type: GraphQLBoolean },
        },
        resolve: getDeleteResolver(collection),
      }

      if (collectionConfig.disableDuplicate !== true) {
        graphqlResult.Mutation.fields[`duplicate${singularName}`] = {
          type: collection.graphQL.type,
          args: {
            id: { type: new GraphQLNonNull(idType) },
            ...(createMutationInputType
              ? { data: { type: collection.graphQL.mutationInputType } }
              : {}),
          },
          resolve: duplicateResolver(collection),
        }
      }
    }

    if (collectionConfig.versions) {
      const versionIDType = config.db.defaultIDType === 'text' ? GraphQLString : GraphQLInt
      const versionCollectionFields: Field[] = [
        ...buildVersionCollectionFields(config, collectionConfig),
        {
          name: 'id',
          type: config.db.defaultIDType as 'text',
        },
        {
          name: 'createdAt',
          type: 'date',
          label: ({ t }) => t('general:createdAt'),
        },
        {
          name: 'updatedAt',
          type: 'date',
          label: ({ t }) => t('general:updatedAt'),
        },
      ]

      collection.graphQL.versionType = buildObjectType({
        name: `${singularName}Version`,
        collectionSlug: collectionConfig.slug,
        config,
        fields: versionCollectionFields,
        forceNullable: forceNullableObjectType,
        graphqlResult,
        parentName: `${singularName}Version`,
      })

      if (queriesEnabled) {
        graphqlResult.Query.fields[`version${formatName(singularName)}`] = {
          type: collection.graphQL.versionType,
          args: {
            id: { type: versionIDType },
            ...(config.localization
              ? {
                  fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                  locale: { type: graphqlResult.types.localeInputType },
                }
              : {}),
            trash: { type: GraphQLBoolean },
          },
          resolve: findVersionByIDResolver(collection),
        }
        graphqlResult.Query.fields[`versions${pluralName}`] = {
          type: buildPaginatedListType(
            `versions${formatName(pluralName)}`,
            collection.graphQL.versionType,
          ),
          args: {
            where: {
              type: buildWhereInputType({
                name: `versions${singularName}`,
                fields: versionCollectionFields,
                parentName: `versions${singularName}`,
              }),
            },
            ...(config.localization
              ? {
                  fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                  locale: { type: graphqlResult.types.localeInputType },
                }
              : {}),
            limit: { type: GraphQLInt },
            page: { type: GraphQLInt },
            pagination: { type: GraphQLBoolean },
            select: { type: GraphQLBoolean },
            sort: { type: GraphQLString },
            trash: { type: GraphQLBoolean },
          },
          resolve: findVersionsResolver(collection),
        }
      }

      if (mutationsEnabled) {
        graphqlResult.Mutation.fields[`restoreVersion${formatName(singularName)}`] = {
          type: collection.graphQL.type,
          args: {
            id: { type: versionIDType },
            draft: { type: GraphQLBoolean },
          },
          resolve: restoreVersionResolver(collection),
        }
      }
    }

    if (collectionConfig.auth) {
      const authFields: Field[] =
        collectionConfig.auth.disableLocalStrategy ||
        (collectionConfig.auth.loginWithUsername &&
          !collectionConfig.auth.loginWithUsername.allowEmailLogin &&
          !collectionConfig.auth.loginWithUsername.requireEmail)
          ? []
          : [
              {
                name: 'email',
                type: 'email',
                required: true,
              },
            ]
      collection.graphQL.JWT = buildObjectType({
        name: formatName(`${slug}JWT`),
        config,
        fields: [
          ...collectionConfig.fields.filter((field) => fieldAffectsData(field) && field.saveToJWT),
          ...authFields,
          {
            name: 'collection',
            type: 'text',
            required: true,
          },
        ],
        graphqlResult,
        parentName: formatName(`${slug}JWT`),
      })

      if (queriesEnabled) {
        graphqlResult.Query.fields[`me${singularName}`] = {
          type: new GraphQLObjectType({
            name: formatName(`${slug}Me`),
            fields: {
              collection: {
                type: GraphQLString,
              },
              exp: {
                type: GraphQLInt,
              },
              strategy: {
                type: GraphQLString,
              },
              token: {
                type: GraphQLString,
              },
              user: {
                type: collection.graphQL.type,
              },
            },
          }),
          resolve: me(collection),
        }

        graphqlResult.Query.fields[`initialized${singularName}`] = {
          type: GraphQLBoolean,
          resolve: init(collection.config.slug),
        }
      }

      if (mutationsEnabled) {
        graphqlResult.Mutation.fields[`refreshToken${singularName}`] = {
          type: new GraphQLObjectType({
            name: formatName(`${slug}Refreshed${singularName}`),
            fields: {
              exp: {
                type: GraphQLInt,
              },
              refreshedToken: {
                type: GraphQLString,
              },
              strategy: {
                type: GraphQLString,
              },
              user: {
                type: collection.graphQL.JWT,
              },
            },
          }),
          resolve: refresh(collection),
        }

        graphqlResult.Mutation.fields[`logout${singularName}`] = {
          type: GraphQLString,
          args: {
            allSessions: { type: GraphQLBoolean },
          },
          resolve: logout(collection),
        }

        if (!collectionConfig.auth.disableLocalStrategy) {
          const authArgs = {}

          const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(
            collectionConfig.auth.loginWithUsername,
          )

          if (canLoginWithEmail) {
            authArgs['email'] = { type: new GraphQLNonNull(GraphQLString) }
          }
          if (canLoginWithUsername) {
            authArgs['username'] = { type: new GraphQLNonNull(GraphQLString) }
          }

          if (collectionConfig.auth.maxLoginAttempts > 0) {
            graphqlResult.Mutation.fields[`unlock${singularName}`] = {
              type: new GraphQLNonNull(GraphQLBoolean),
              args: authArgs,
              resolve: unlock(collection),
            }
          }

          graphqlResult.Mutation.fields[`login${singularName}`] = {
            type: new GraphQLObjectType({
              name: formatName(`${slug}LoginResult`),
              fields: {
                exp: {
                  type: GraphQLInt,
                },
                token: {
                  type: GraphQLString,
                },
                user: {
                  type: collection.graphQL.type,
                },
              },
            }),
            args: {
              ...authArgs,
              password: { type: GraphQLString },
            },
            resolve: login(collection),
          }

          graphqlResult.Mutation.fields[`forgotPassword${singularName}`] = {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
              disableEmail: { type: GraphQLBoolean },
              expiration: { type: GraphQLInt },
              ...authArgs,
            },
            resolve: forgotPassword(collection),
          }

          graphqlResult.Mutation.fields[`resetPassword${singularName}`] = {
            type: new GraphQLObjectType({
              name: formatName(`${slug}ResetPassword`),
              fields: {
                token: { type: GraphQLString },
                user: { type: collection.graphQL.type },
              },
            }),
            args: {
              password: { type: GraphQLString },
              token: { type: GraphQLString },
            },
            resolve: resetPassword(collection),
          }

          graphqlResult.Mutation.fields[`verifyEmail${singularName}`] = {
            type: GraphQLBoolean,
            args: {
              token: { type: GraphQLString },
            },
            resolve: verifyEmail(collection),
          }
        }
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: initGlobals.ts]---
Location: payload-main/packages/graphql/src/schema/initGlobals.ts

```typescript
import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql'
import pluralize from 'pluralize'
const { singular } = pluralize

import type { Field, GraphQLInfo, SanitizedConfig, SanitizedGlobalConfig } from 'payload'

import { buildVersionGlobalFields, toWords } from 'payload'
import { hasDraftsEnabled } from 'payload/shared'

import { docAccessResolver } from '../resolvers/globals/docAccess.js'
import { findOne } from '../resolvers/globals/findOne.js'
import { findVersionByID } from '../resolvers/globals/findVersionByID.js'
import { findVersions } from '../resolvers/globals/findVersions.js'
import { restoreVersion } from '../resolvers/globals/restoreVersion.js'
import { update } from '../resolvers/globals/update.js'
import { formatName } from '../utilities/formatName.js'
import { buildMutationInputType } from './buildMutationInputType.js'
import { buildObjectType } from './buildObjectType.js'
import { buildPaginatedListType } from './buildPaginatedListType.js'
import { buildPolicyType } from './buildPoliciesType.js'
import { buildWhereInputType } from './buildWhereInputType.js'

type InitGlobalsGraphQLArgs = {
  config: SanitizedConfig
  graphqlResult: GraphQLInfo
}
export function initGlobals({ config, graphqlResult }: InitGlobalsGraphQLArgs): void {
  Object.keys(graphqlResult.globals.config).forEach((slug) => {
    const global: SanitizedGlobalConfig = graphqlResult.globals.config[slug]
    const { fields, graphQL } = global

    if (graphQL === false) {
      return
    }

    const formattedName = graphQL?.name ? graphQL.name : singular(toWords(global.slug, true))

    const forceNullableObjectType = hasDraftsEnabled(global)

    if (!graphqlResult.globals.graphQL) {
      graphqlResult.globals.graphQL = {}
    }

    const updateMutationInputType = buildMutationInputType({
      name: formattedName,
      config,
      fields,
      graphqlResult,
      parentIsLocalized: false,
      parentName: formattedName,
    })
    graphqlResult.globals.graphQL[slug] = {
      type: buildObjectType({
        name: formattedName,
        config,
        fields,
        forceNullable: forceNullableObjectType,
        graphqlResult,
        parentName: formattedName,
      }),
      mutationInputType: updateMutationInputType
        ? new GraphQLNonNull(updateMutationInputType)
        : null,
    }

    const queriesEnabled = typeof global.graphQL !== 'object' || !global.graphQL.disableQueries
    const mutationsEnabled = typeof global.graphQL !== 'object' || !global.graphQL.disableMutations

    if (queriesEnabled) {
      graphqlResult.Query.fields[formattedName] = {
        type: graphqlResult.globals.graphQL[slug].type,
        args: {
          draft: { type: GraphQLBoolean },
          ...(config.localization
            ? {
                fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
          select: { type: GraphQLBoolean },
        },
        resolve: findOne(global),
      }

      graphqlResult.Query.fields[`docAccess${formattedName}`] = {
        type: buildPolicyType({
          type: 'global',
          entity: global,
          scope: 'docAccess',
          typeSuffix: 'DocAccess',
        }),
        resolve: docAccessResolver(global),
      }
    }

    if (mutationsEnabled) {
      graphqlResult.Mutation.fields[`update${formattedName}`] = {
        type: graphqlResult.globals.graphQL[slug].type,
        args: {
          ...(updateMutationInputType
            ? { data: { type: graphqlResult.globals.graphQL[slug].mutationInputType } }
            : {}),
          draft: { type: GraphQLBoolean },
          ...(config.localization
            ? {
                locale: { type: graphqlResult.types.localeInputType },
              }
            : {}),
        },
        resolve: update(global),
      }
    }

    if (global.versions) {
      const idType = config.db.defaultIDType === 'number' ? GraphQLInt : GraphQLString

      const versionGlobalFields: Field[] = [
        ...buildVersionGlobalFields(config, global),
        {
          name: 'id',
          type: config.db.defaultIDType as 'text',
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Created At',
        },
        {
          name: 'updatedAt',
          type: 'date',
          label: 'Updated At',
        },
      ]

      graphqlResult.globals.graphQL[slug].versionType = buildObjectType({
        name: `${formattedName}Version`,
        config,
        fields: versionGlobalFields,
        forceNullable: forceNullableObjectType,
        graphqlResult,
        parentName: `${formattedName}Version`,
      })

      if (queriesEnabled) {
        graphqlResult.Query.fields[`version${formatName(formattedName)}`] = {
          type: graphqlResult.globals.graphQL[slug].versionType,
          args: {
            id: { type: idType },
            draft: { type: GraphQLBoolean },
            ...(config.localization
              ? {
                  fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                  locale: { type: graphqlResult.types.localeInputType },
                }
              : {}),
            select: { type: GraphQLBoolean },
          },
          resolve: findVersionByID(global),
        }
        graphqlResult.Query.fields[`versions${formattedName}`] = {
          type: buildPaginatedListType(
            `versions${formatName(formattedName)}`,
            graphqlResult.globals.graphQL[slug].versionType,
          ),
          args: {
            where: {
              type: buildWhereInputType({
                name: `versions${formattedName}`,
                fields: versionGlobalFields,
                parentName: `versions${formattedName}`,
              }),
            },
            ...(config.localization
              ? {
                  fallbackLocale: { type: graphqlResult.types.fallbackLocaleInputType },
                  locale: { type: graphqlResult.types.localeInputType },
                }
              : {}),
            limit: { type: GraphQLInt },
            page: { type: GraphQLInt },
            pagination: { type: GraphQLBoolean },
            select: { type: GraphQLBoolean },
            sort: { type: GraphQLString },
          },
          resolve: findVersions(global),
        }
      }

      if (mutationsEnabled) {
        graphqlResult.Mutation.fields[`restoreVersion${formatName(formattedName)}`] = {
          type: graphqlResult.globals.graphQL[slug].type,
          args: {
            id: { type: idType },
            draft: { type: GraphQLBoolean },
          },
          resolve: restoreVersion(global),
        }
      }
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: isFieldNullable.ts]---
Location: payload-main/packages/graphql/src/schema/isFieldNullable.ts

```typescript
import type { FieldAffectingData } from 'payload'

import { fieldAffectsData } from 'payload/shared'

export const isFieldNullable = ({
  field,
  forceNullable,
  parentIsLocalized,
}: {
  field: FieldAffectingData
  forceNullable: boolean
  parentIsLocalized: boolean
}): boolean => {
  const hasReadAccessControl = field.access && field.access.read
  const condition = field.admin && field.admin.condition
  return !(
    forceNullable &&
    fieldAffectsData(field) &&
    'required' in field &&
    field.required &&
    (!field.localized || parentIsLocalized) &&
    !condition &&
    !hasReadAccessControl
  )
}
```

--------------------------------------------------------------------------------

---[FILE: operators.ts]---
Location: payload-main/packages/graphql/src/schema/operators.ts

```typescript
export const operators = {
  comparison: ['greater_than_equal', 'greater_than', 'less_than_equal', 'less_than'],
  contains: ['in', 'not_in', 'all'],
  equality: ['equals', 'not_equals'],
  geo: ['near'],
  geojson: ['within', 'intersects'],
  partial: ['like', 'contains'],
}
```

--------------------------------------------------------------------------------

---[FILE: recursivelyBuildNestedPaths.ts]---
Location: payload-main/packages/graphql/src/schema/recursivelyBuildNestedPaths.ts

```typescript
import type { FieldWithSubFields, Tab, TabsField } from 'payload'

import { fieldAffectsData, fieldIsPresentationalOnly } from 'payload/shared'

import { fieldToSchemaMap } from './fieldToWhereInputSchemaMap.js'

type Args = {
  field: FieldWithSubFields | TabsField
  nestedFieldName2: string
  parentName: string
}

export const recursivelyBuildNestedPaths = ({ field, nestedFieldName2, parentName }: Args) => {
  const fieldName = fieldAffectsData(field) ? field.name : undefined
  const nestedFieldName = fieldName || nestedFieldName2

  if (field.type === 'tabs') {
    // if the tab has a name, treat it as a group
    // otherwise, treat it as a row
    return field.tabs.reduce((tabSchema, tab: any) => {
      tabSchema.push(
        ...recursivelyBuildNestedPaths({
          field: {
            ...tab,
            ...('name' in tab
              ? {
                  name: `${nestedFieldName ? `${nestedFieldName}__` : ''}${tab.name}`,
                  type: 'group',
                }
              : {
                  type: 'row',
                }),
          },
          nestedFieldName2: nestedFieldName,
          parentName,
        }),
      )
      return tabSchema
    }, [])
  }

  const nestedPaths = field.fields.reduce((nestedFields, nestedField) => {
    if (!fieldIsPresentationalOnly(nestedField)) {
      if (!fieldAffectsData(nestedField)) {
        return [
          ...nestedFields,
          ...recursivelyBuildNestedPaths({
            field: nestedField,
            nestedFieldName2: nestedFieldName,
            parentName,
          }),
        ]
      }

      const nestedPathName = fieldAffectsData(nestedField)
        ? `${nestedFieldName ? `${nestedFieldName}__` : ''}${nestedField.name}`
        : undefined
      const getFieldSchema = fieldToSchemaMap({
        nestedFieldName,
        parentName,
      })[nestedField.type]

      if (getFieldSchema) {
        const fieldSchema = getFieldSchema({
          ...nestedField,
          name: nestedPathName,
        })

        if (Array.isArray(fieldSchema)) {
          return [...nestedFields, ...fieldSchema]
        }

        return [
          ...nestedFields,
          {
            type: fieldSchema,
            key: nestedPathName,
          },
        ]
      }
    }

    return nestedFields
  }, [])

  return nestedPaths
}
```

--------------------------------------------------------------------------------

---[FILE: withNullableType.ts]---
Location: payload-main/packages/graphql/src/schema/withNullableType.ts

```typescript
import type { GraphQLType } from 'graphql'
import type { FieldAffectingData } from 'payload'

import { GraphQLNonNull } from 'graphql'

export const withNullableType = ({
  type,
  field,
  forceNullable,
  parentIsLocalized,
}: {
  field: FieldAffectingData
  forceNullable?: boolean
  parentIsLocalized: boolean
  type: GraphQLType
}): GraphQLType => {
  const hasReadAccessControl = field.access && field.access.read
  const condition = field.admin && field.admin.condition
  const isTimestamp = field.name === 'createdAt' || field.name === 'updatedAt'

  if (
    !forceNullable &&
    'required' in field &&
    field.required &&
    (!field.localized || parentIsLocalized) &&
    !condition &&
    !hasReadAccessControl &&
    !isTimestamp
  ) {
    return new GraphQLNonNull(type)
  }

  return type
}
```

--------------------------------------------------------------------------------

````
