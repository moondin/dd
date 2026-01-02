---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 126
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 126 of 695)

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

---[FILE: buildSchema.ts]---
Location: payload-main/packages/db-mongodb/src/models/buildSchema.ts

```typescript
import type { IndexOptions, Schema, SchemaOptions, SchemaTypeOptions } from 'mongoose'

import mongoose from 'mongoose'
import {
  type ArrayField,
  type BlocksField,
  type CheckboxField,
  type CodeField,
  type CollapsibleField,
  type DateField,
  type EmailField,
  type Field,
  type FieldAffectingData,
  type GroupField,
  type JSONField,
  type NonPresentationalField,
  type NumberField,
  type Payload,
  type PointField,
  type RadioField,
  type RelationshipField,
  type RichTextField,
  type RowField,
  type SanitizedCompoundIndex,
  type SanitizedLocalizationConfig,
  type SelectField,
  type Tab,
  type TabsField,
  type TextareaField,
  type TextField,
  type UploadField,
} from 'payload'
import {
  fieldAffectsData,
  fieldIsPresentationalOnly,
  fieldIsVirtual,
  fieldShouldBeLocalized,
  tabHasName,
} from 'payload/shared'

export type BuildSchemaOptions = {
  allowIDField?: boolean
  disableUnique?: boolean
  draftsEnabled?: boolean
  indexSortableFields?: boolean
  options?: SchemaOptions
}

type FieldSchemaGenerator<T extends Field = Field> = (
  field: T,
  schema: Schema,
  config: Payload,
  buildSchemaOptions: BuildSchemaOptions,
  parentIsLocalized: boolean,
) => void

/**
 * get a field's defaultValue only if defined and not dynamic so that it can be set on the field schema
 * @param field
 */
const formatDefaultValue = (field: FieldAffectingData) =>
  typeof field.defaultValue !== 'undefined' && typeof field.defaultValue !== 'function'
    ? field.defaultValue
    : undefined

const formatBaseSchema = ({
  buildSchemaOptions,
  field,
  parentIsLocalized,
}: {
  buildSchemaOptions: BuildSchemaOptions
  field: FieldAffectingData
  parentIsLocalized: boolean
}) => {
  const { disableUnique, draftsEnabled, indexSortableFields } = buildSchemaOptions
  const schema: SchemaTypeOptions<unknown> = {
    default: formatDefaultValue(field),
    index: field.index || (!disableUnique && field.unique) || indexSortableFields || false,
    required: false,
    unique: (!disableUnique && field.unique) || false,
  }

  if (
    schema.unique &&
    (fieldShouldBeLocalized({ field, parentIsLocalized }) ||
      draftsEnabled ||
      (fieldAffectsData(field) &&
        field.type !== 'group' &&
        field.type !== 'tab' &&
        field.required !== true))
  ) {
    schema.sparse = true
  }

  if (field.hidden) {
    schema.hidden = true
  }

  return schema
}

const localizeSchema = (
  entity: NonPresentationalField | Tab,
  schema: SchemaTypeOptions<any>,
  localization: false | SanitizedLocalizationConfig,
  parentIsLocalized: boolean,
) => {
  if (
    fieldShouldBeLocalized({ field: entity, parentIsLocalized }) &&
    localization &&
    Array.isArray(localization.locales)
  ) {
    return {
      type: localization.localeCodes.reduce(
        (localeSchema, locale) => ({
          ...localeSchema,
          [locale]: schema,
        }),
        {
          _id: false,
        },
      ),
      localized: true,
    }
  }
  return schema
}

export const buildSchema = (args: {
  buildSchemaOptions: BuildSchemaOptions
  compoundIndexes?: SanitizedCompoundIndex[]
  configFields: Field[]
  parentIsLocalized?: boolean
  payload: Payload
}): Schema => {
  const { buildSchemaOptions = {}, configFields, parentIsLocalized, payload } = args
  const { allowIDField, options } = buildSchemaOptions
  let fields = {}

  let schemaFields = configFields

  if (!allowIDField) {
    const idField = schemaFields.find((field) => fieldAffectsData(field) && field.name === 'id')
    if (idField) {
      fields = {
        _id:
          idField.type === 'number'
            ? payload.db.useBigIntForNumberIDs
              ? mongoose.Schema.Types.BigInt
              : Number
            : String,
      }
      schemaFields = schemaFields.filter(
        (field) => !(fieldAffectsData(field) && field.name === 'id'),
      )
    }
  }

  const schema = new mongoose.Schema(fields, options as any)

  schemaFields.forEach((field) => {
    if (fieldIsVirtual(field)) {
      return
    }

    if (!fieldIsPresentationalOnly(field)) {
      const addFieldSchema = getSchemaGenerator(field.type)

      if (addFieldSchema) {
        addFieldSchema(field, schema, payload, buildSchemaOptions, parentIsLocalized ?? false)
      }
    }
  })

  if (args.compoundIndexes) {
    for (const index of args.compoundIndexes) {
      const indexDefinition: Record<string, 1> = {}

      for (const field of index.fields) {
        if (field.pathHasLocalized && payload.config.localization) {
          for (const locale of payload.config.localization.locales) {
            indexDefinition[field.localizedPath.replace('<locale>', locale.code)] = 1
          }
        } else {
          indexDefinition[field.path] = 1
        }
      }

      schema.index(indexDefinition, {
        unique: args.buildSchemaOptions.disableUnique ? false : index.unique,
      })
    }
  }

  return schema
}

const array: FieldSchemaGenerator<ArrayField> = (
  field: ArrayField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
) => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: [
      buildSchema({
        buildSchemaOptions: {
          allowIDField: true,
          disableUnique: buildSchemaOptions.disableUnique,
          draftsEnabled: buildSchemaOptions.draftsEnabled,
          options: {
            _id: false,
            id: false,
            minimize: false,
          },
        },
        configFields: field.fields,
        parentIsLocalized: parentIsLocalized || field.localized,
        payload,
      }),
    ],
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const blocks: FieldSchemaGenerator<BlocksField> = (
  field: BlocksField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const fieldSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: [new mongoose.Schema({}, { _id: false, discriminatorKey: 'blockType' })],
  }

  schema.add({
    [field.name]: localizeSchema(
      field,
      fieldSchema,
      payload.config.localization,
      parentIsLocalized,
    ),
  })
  ;(field.blockReferences ?? field.blocks).forEach((blockItem) => {
    const blockSchema = new mongoose.Schema({}, { _id: false, id: false })

    const block = typeof blockItem === 'string' ? payload.blocks[blockItem] : blockItem

    if (!block) {
      return
    }

    block.fields.forEach((blockField) => {
      const addFieldSchema = getSchemaGenerator(blockField.type)

      if (addFieldSchema) {
        addFieldSchema(
          blockField,
          blockSchema,
          payload,
          buildSchemaOptions,
          (parentIsLocalized || field.localized) ?? false,
        )
      }
    })

    if (fieldShouldBeLocalized({ field, parentIsLocalized }) && payload.config.localization) {
      payload.config.localization.localeCodes.forEach((localeCode) => {
        // @ts-expect-error Possible incorrect typing in mongoose types, this works
        schema.path(`${field.name}.${localeCode}`).discriminator(block.slug, blockSchema)
      })
    } else {
      // @ts-expect-error Possible incorrect typing in mongoose types, this works
      schema.path(field.name).discriminator(block.slug, blockSchema)
    }
  })
}

const checkbox: FieldSchemaGenerator<CheckboxField> = (
  field: CheckboxField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: Boolean,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const code: FieldSchemaGenerator<CodeField> = (
  field: CodeField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: String,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const collapsible: FieldSchemaGenerator<CollapsibleField> = (
  field: CollapsibleField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  field.fields.forEach((subField: Field) => {
    if (fieldIsVirtual(subField)) {
      return
    }

    const addFieldSchema = getSchemaGenerator(subField.type)

    if (addFieldSchema) {
      addFieldSchema(subField, schema, payload, buildSchemaOptions, parentIsLocalized)
    }
  })
}

const date: FieldSchemaGenerator<DateField> = (
  field: DateField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: Date,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const email: FieldSchemaGenerator<EmailField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: String,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const group: FieldSchemaGenerator<GroupField> = (
  field: GroupField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  if (fieldAffectsData(field)) {
    const formattedBaseSchema = formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized })

    // carry indexSortableFields through to versions if drafts enabled
    const indexSortableFields =
      buildSchemaOptions.indexSortableFields &&
      field.name === 'version' &&
      buildSchemaOptions.draftsEnabled

    const baseSchema: SchemaTypeOptions<any> = {
      ...formattedBaseSchema,
      type: buildSchema({
        buildSchemaOptions: {
          disableUnique: buildSchemaOptions.disableUnique,
          draftsEnabled: buildSchemaOptions.draftsEnabled,
          indexSortableFields,
          options: {
            _id: false,
            id: false,
            minimize: false,
          },
        },
        configFields: field.fields,
        parentIsLocalized: parentIsLocalized || field.localized,
        payload,
      }),
    }

    schema.add({
      [field.name]: localizeSchema(
        field,
        baseSchema,
        payload.config.localization,
        parentIsLocalized,
      ),
    })
  } else {
    field.fields.forEach((subField) => {
      if (fieldIsVirtual(subField)) {
        return
      }

      const addFieldSchema = getSchemaGenerator(subField.type)

      if (addFieldSchema) {
        addFieldSchema(
          subField,
          schema,
          payload,
          buildSchemaOptions,
          (parentIsLocalized || field.localized) ?? false,
        )
      }
    })
  }
}

const json: FieldSchemaGenerator<JSONField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: mongoose.Schema.Types.Mixed,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const number: FieldSchemaGenerator<NumberField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: field.hasMany ? [Number] : Number,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const point: FieldSchemaGenerator<PointField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<unknown> = {
    type: {
      type: String,
      enum: ['Point'],
      ...(typeof field.defaultValue !== 'undefined' && {
        default: 'Point',
      }),
    },
    coordinates: {
      type: [Number],
      default: formatDefaultValue(field),
      required: false,
    },
  }

  if (
    buildSchemaOptions.disableUnique &&
    field.unique &&
    fieldShouldBeLocalized({ field, parentIsLocalized })
  ) {
    baseSchema.coordinates.sparse = true
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })

  if (field.index === true || field.index === undefined) {
    const indexOptions: IndexOptions = {}
    if (!buildSchemaOptions.disableUnique && field.unique) {
      indexOptions.sparse = true
      indexOptions.unique = true
    }
    if (fieldShouldBeLocalized({ field, parentIsLocalized }) && payload.config.localization) {
      payload.config.localization.locales.forEach((locale) => {
        schema.index({ [`${field.name}.${locale.code}`]: '2dsphere' }, indexOptions)
      })
    } else {
      schema.index({ [field.name]: '2dsphere' }, indexOptions)
    }
  }
}

const radio: FieldSchemaGenerator<RadioField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: String,
    enum: field.options.map((option) => {
      if (typeof option === 'object') {
        return option.value
      }
      return option
    }),
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const relationship: FieldSchemaGenerator<RelationshipField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
) => {
  const hasManyRelations = Array.isArray(field.relationTo)
  let schemaToReturn: { [key: string]: any } = {}

  const valueType = getRelationshipValueType(field, payload)

  if (fieldShouldBeLocalized({ field, parentIsLocalized }) && payload.config.localization) {
    schemaToReturn = {
      _id: false,
      type: payload.config.localization.localeCodes.reduce((locales, locale) => {
        let localeSchema: { [key: string]: any } = {}

        if (hasManyRelations) {
          localeSchema = {
            ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
            _id: false,
            type: mongoose.Schema.Types.Mixed,
            relationTo: { type: String, enum: field.relationTo },
            value: {
              type: valueType,
              refPath: `${field.name}.${locale}.relationTo`,
            },
          }
        } else {
          localeSchema = {
            ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
            type: valueType,
            ref: field.relationTo,
          }
        }

        return {
          ...locales,
          [locale]: field.hasMany
            ? { type: [localeSchema], default: formatDefaultValue(field) }
            : localeSchema,
        }
      }, {}),
      localized: true,
    }
  } else if (hasManyRelations) {
    schemaToReturn = {
      ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
      _id: false,
      type: mongoose.Schema.Types.Mixed,
      relationTo: { type: String, enum: field.relationTo },
      value: {
        type: valueType,
        refPath: `${field.name}.relationTo`,
      },
    }

    if (field.hasMany) {
      schemaToReturn = {
        type: [schemaToReturn],
        default: formatDefaultValue(field),
      }
    }
  } else {
    schemaToReturn = {
      ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
      type: valueType,
      ref: field.relationTo,
    }

    if (field.hasMany) {
      schemaToReturn = {
        type: [schemaToReturn],
        default: formatDefaultValue(field),
      }
    }
  }

  schema.add({
    [field.name]: schemaToReturn,
  })
}

const richText: FieldSchemaGenerator<RichTextField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: mongoose.Schema.Types.Mixed,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const row: FieldSchemaGenerator<RowField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  field.fields.forEach((subField: Field) => {
    if (fieldIsVirtual(subField)) {
      return
    }

    const addFieldSchema = getSchemaGenerator(subField.type)

    if (addFieldSchema) {
      addFieldSchema(subField, schema, payload, buildSchemaOptions, parentIsLocalized)
    }
  })
}

const select: FieldSchemaGenerator<SelectField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema: SchemaTypeOptions<any> = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: String,
    enum: field.options.map((option) => {
      if (typeof option === 'object') {
        return option.value
      }
      return option
    }),
  }

  if (buildSchemaOptions.draftsEnabled || !field.required) {
    ;(baseSchema.enum as unknown[]).push(null)
  }

  schema.add({
    [field.name]: localizeSchema(
      field,
      field.hasMany ? [baseSchema] : baseSchema,
      payload.config.localization,
      parentIsLocalized,
    ),
  })
}

const tabs: FieldSchemaGenerator<TabsField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  field.tabs.forEach((tab) => {
    if (tabHasName(tab)) {
      if (fieldIsVirtual(tab)) {
        return
      }
      const baseSchema = {
        type: buildSchema({
          buildSchemaOptions: {
            disableUnique: buildSchemaOptions.disableUnique,
            draftsEnabled: buildSchemaOptions.draftsEnabled,
            options: {
              _id: false,
              id: false,
              minimize: false,
            },
          },
          configFields: tab.fields,
          parentIsLocalized: parentIsLocalized || tab.localized,
          payload,
        }),
      }

      schema.add({
        [tab.name]: localizeSchema(tab, baseSchema, payload.config.localization, parentIsLocalized),
      })
    } else {
      tab.fields.forEach((subField: Field) => {
        if (fieldIsVirtual(subField)) {
          return
        }
        const addFieldSchema = getSchemaGenerator(subField.type)

        if (addFieldSchema) {
          addFieldSchema(
            subField,
            schema,
            payload,
            buildSchemaOptions,
            (parentIsLocalized || tab.localized) ?? false,
          )
        }
      })
    }
  })
}

const text: FieldSchemaGenerator<TextField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: field.hasMany ? [String] : String,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const textarea: FieldSchemaGenerator<TextareaField> = (
  field: TextareaField,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const baseSchema = {
    ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
    type: String,
  }

  schema.add({
    [field.name]: localizeSchema(field, baseSchema, payload.config.localization, parentIsLocalized),
  })
}

const upload: FieldSchemaGenerator<UploadField> = (
  field,
  schema,
  payload,
  buildSchemaOptions,
  parentIsLocalized,
): void => {
  const hasManyRelations = Array.isArray(field.relationTo)
  let schemaToReturn: { [key: string]: any } = {}

  const valueType = getRelationshipValueType(field, payload)

  if (fieldShouldBeLocalized({ field, parentIsLocalized }) && payload.config.localization) {
    schemaToReturn = {
      _id: false,
      type: payload.config.localization.localeCodes.reduce((locales, locale) => {
        let localeSchema: { [key: string]: any } = {}

        if (hasManyRelations) {
          localeSchema = {
            ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
            _id: false,
            type: mongoose.Schema.Types.Mixed,
            relationTo: { type: String, enum: field.relationTo },
            value: {
              type: valueType,
              refPath: `${field.name}.${locale}.relationTo`,
            },
          }
        } else {
          localeSchema = {
            ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
            type: valueType,
            ref: field.relationTo,
          }
        }

        return {
          ...locales,
          [locale]: field.hasMany
            ? { type: [localeSchema], default: formatDefaultValue(field) }
            : localeSchema,
        }
      }, {}),
      localized: true,
    }
  } else if (hasManyRelations) {
    schemaToReturn = {
      ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
      _id: false,
      type: mongoose.Schema.Types.Mixed,
      relationTo: { type: String, enum: field.relationTo },
      value: {
        type: valueType,
        refPath: `${field.name}.relationTo`,
      },
    }

    if (field.hasMany) {
      schemaToReturn = {
        type: [schemaToReturn],
        default: formatDefaultValue(field),
      }
    }
  } else {
    schemaToReturn = {
      ...formatBaseSchema({ buildSchemaOptions, field, parentIsLocalized }),
      type: valueType,
      ref: field.relationTo,
    }

    if (field.hasMany) {
      schemaToReturn = {
        type: [schemaToReturn],
        default: formatDefaultValue(field),
      }
    }
  }

  schema.add({
    [field.name]: schemaToReturn,
  })
}

const getSchemaGenerator = (fieldType: string): FieldSchemaGenerator | null => {
  if (fieldType in fieldToSchemaMap) {
    return fieldToSchemaMap[fieldType as keyof typeof fieldToSchemaMap] as FieldSchemaGenerator
  }

  return null
}

const fieldToSchemaMap = {
  array,
  blocks,
  checkbox,
  code,
  collapsible,
  date,
  email,
  group,
  json,
  number,
  point,
  radio,
  relationship,
  richText,
  row,
  select,
  tabs,
  text,
  textarea,
  upload,
}

const getRelationshipValueType = (field: RelationshipField | UploadField, payload: Payload) => {
  if (typeof field.relationTo === 'string') {
    const customIDType = payload.collections[field.relationTo]?.customIDType

    if (!customIDType) {
      return mongoose.Schema.Types.ObjectId
    }

    if (customIDType === 'number') {
      if (payload.db.useBigIntForNumberIDs) {
        return mongoose.Schema.Types.BigInt
      } else {
        return mongoose.Schema.Types.Number
      }
    }

    return mongoose.Schema.Types.String
  }

  // has custom id relationTo
  if (
    field.relationTo.some((relationTo) => {
      return !!payload.collections[relationTo]?.customIDType
    })
  ) {
    return mongoose.Schema.Types.Mixed
  }

  return mongoose.Schema.Types.ObjectId
}
```

--------------------------------------------------------------------------------

---[FILE: migrateRelationshipsV2_V3.ts]---
Location: payload-main/packages/db-mongodb/src/predefinedMigrations/migrateRelationshipsV2_V3.ts

```typescript
import type { ClientSession, Model } from 'mongoose'
import type { Field, PayloadRequest } from 'payload'

import { buildVersionCollectionFields, buildVersionGlobalFields } from 'payload'

import type { MongooseAdapter } from '../index.js'

import { getCollection, getGlobal } from '../utilities/getEntity.js'
import { getSession } from '../utilities/getSession.js'
import { transform } from '../utilities/transform.js'

const migrateModelWithBatching = async ({
  batchSize,
  db,
  fields,
  Model,
  parentIsLocalized,
  session,
}: {
  batchSize: number
  db: MongooseAdapter
  fields: Field[]
  Model: Model<any>
  parentIsLocalized: boolean
  session?: ClientSession
}): Promise<void> => {
  let hasNext = true
  let skip = 0

  while (hasNext) {
    const docs = await Model.find(
      {},
      {},
      {
        lean: true,
        limit: batchSize + 1,
        session,
        skip,
      },
    )

    if (docs.length === 0) {
      break
    }

    hasNext = docs.length > batchSize

    if (hasNext) {
      docs.pop()
    }

    for (const doc of docs) {
      transform({ adapter: db, data: doc, fields, operation: 'write', parentIsLocalized })
    }

    await Model.collection.bulkWrite(
      // @ts-expect-error bulkWrite has a weird type, insertOne, updateMany etc are required here as well.
      docs.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: doc,
          },
        },
      })),
      {
        session, // Timestamps are manually added by the write transform
        timestamps: false,
      },
    )

    skip += batchSize
  }
}

const hasRelationshipOrUploadField = ({ fields }: { fields: Field[] }): boolean => {
  for (const field of fields) {
    if (field.type === 'relationship' || field.type === 'upload') {
      return true
    }

    if ('fields' in field) {
      if (hasRelationshipOrUploadField({ fields: field.fields })) {
        return true
      }
    }

    if ('blocks' in field) {
      for (const block of field.blocks) {
        if (typeof block === 'string') {
          // Skip - string blocks have been added in v3 and thus don't need to be migrated
          continue
        }
        if (hasRelationshipOrUploadField({ fields: block.fields })) {
          return true
        }
      }
    }

    if ('tabs' in field) {
      for (const tab of field.tabs) {
        if (hasRelationshipOrUploadField({ fields: tab.fields })) {
          return true
        }
      }
    }
  }

  return false
}

export async function migrateRelationshipsV2_V3({
  batchSize,
  req,
}: {
  batchSize: number
  req: PayloadRequest
}): Promise<void> {
  const { payload } = req
  const db = payload.db as MongooseAdapter
  const config = payload.config

  const session = await getSession(db, req)

  for (const collection of payload.config.collections) {
    if (hasRelationshipOrUploadField(collection)) {
      payload.logger.info(`Migrating collection "${collection.slug}"`)

      const { Model } = getCollection({ adapter: db, collectionSlug: collection.slug })

      await migrateModelWithBatching({
        batchSize,
        db,
        fields: collection.fields,
        Model,
        parentIsLocalized: false,
        session,
      })

      payload.logger.info(`Migrated collection "${collection.slug}"`)
    }

    if (collection.versions) {
      payload.logger.info(`Migrating collection versions "${collection.slug}"`)

      const { Model } = getCollection({
        adapter: db,
        collectionSlug: collection.slug,
        versions: true,
      })

      await migrateModelWithBatching({
        batchSize,
        db,
        fields: buildVersionCollectionFields(config, collection),
        Model,
        parentIsLocalized: false,
        session,
      })

      payload.logger.info(`Migrated collection versions "${collection.slug}"`)
    }
  }

  const { globals: GlobalsModel } = db

  for (const global of payload.config.globals) {
    if (hasRelationshipOrUploadField(global)) {
      payload.logger.info(`Migrating global "${global.slug}"`)

      const doc = await GlobalsModel.findOne<Record<string, unknown>>(
        {
          globalType: {
            $eq: global.slug,
          },
        },
        {},
        { lean: true, session },
      )

      // in case if the global doesn't exist in the database yet  (not saved)
      if (doc) {
        transform({
          adapter: db,
          data: doc,
          fields: global.fields,
          operation: 'write',
        })

        await GlobalsModel.collection.updateOne(
          {
            globalType: global.slug,
          },
          { $set: doc },
          { session },
        )
      }

      payload.logger.info(`Migrated global "${global.slug}"`)
    }

    if (global.versions) {
      payload.logger.info(`Migrating global versions "${global.slug}"`)

      const { Model } = getGlobal({ adapter: db, globalSlug: global.slug, versions: true })

      await migrateModelWithBatching({
        batchSize,
        db,
        fields: buildVersionGlobalFields(config, global),
        Model,
        parentIsLocalized: false,
        session,
      })

      payload.logger.info(`Migrated global versions "${global.slug}"`)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: migrateVersionsV1_V2.ts]---
Location: payload-main/packages/db-mongodb/src/predefinedMigrations/migrateVersionsV1_V2.ts

```typescript
import type { ClientSession } from 'mongoose'
import type { Payload, PayloadRequest } from 'payload'

import type { MongooseAdapter } from '../index.js'

import { getCollection, getGlobal } from '../utilities/getEntity.js'
import { getSession } from '../utilities/getSession.js'

export async function migrateVersionsV1_V2({ req }: { req: PayloadRequest }) {
  const { payload } = req

  const adapter = payload.db as MongooseAdapter
  const session = await getSession(adapter, req)

  // For each collection

  for (const { slug, versions } of payload.config.collections) {
    if (versions?.drafts) {
      await migrateCollectionDocs({ slug, adapter, payload, session })

      payload.logger.info(`Migrated the "${slug}" collection.`)
    }
  }

  // For each global
  for (const { slug, versions } of payload.config.globals) {
    if (versions) {
      const { Model } = getGlobal({
        adapter,
        globalSlug: slug,
        versions: true,
      })

      await Model.findOneAndUpdate(
        {},
        { latest: true },
        {
          session,
          sort: { updatedAt: -1 },
        },
      ).exec()

      payload.logger.info(`Migrated the "${slug}" global.`)
    }
  }
}

async function migrateCollectionDocs({
  slug,
  adapter,
  docsAtATime = 100,
  payload,
  session,
}: {
  adapter: MongooseAdapter
  docsAtATime?: number
  payload: Payload
  session?: ClientSession
  slug: string
}) {
  const { Model } = getCollection({
    adapter,
    collectionSlug: slug,
    versions: true,
  })
  const remainingDocs = await Model.aggregate(
    [
      // Sort so that newest are first
      {
        $sort: {
          updatedAt: -1,
        },
      },
      // Group by parent ID
      // take the $first of each
      {
        $group: {
          _id: '$parent',
          _versionID: { $first: '$_id' },
          createdAt: { $first: '$createdAt' },
          latest: { $first: '$latest' },
          updatedAt: { $first: '$updatedAt' },
          version: { $first: '$version' },
        },
      },
      {
        $match: {
          latest: { $eq: null },
        },
      },
      {
        $limit: docsAtATime,
      },
    ],
    {
      allowDiskUse: true,
      session,
    },
  ).exec()

  if (!remainingDocs || remainingDocs.length === 0) {
    const newVersions = await Model.find(
      {
        latest: {
          $eq: true,
        },
      },
      undefined,
      { session },
    )

    if (newVersions?.length) {
      payload.logger.info(
        `Migrated ${newVersions.length} documents in the "${slug}" versions collection.`,
      )
    }

    return
  }

  const remainingDocIDs = remainingDocs.map((doc) => doc._versionID)

  await Model.updateMany(
    {
      _id: {
        $in: remainingDocIDs,
      },
    },
    {
      latest: true,
    },
    {
      session,
    },
  )

  await migrateCollectionDocs({ slug, adapter, payload, session })
}
```

--------------------------------------------------------------------------------

---[FILE: relationships-v2-v3.ts]---
Location: payload-main/packages/db-mongodb/src/predefinedMigrations/relationships-v2-v3.ts

```typescript
const imports = `import { migrateRelationshipsV2_V3 } from '@payloadcms/db-mongodb/migration-utils'`
const upSQL = `   await migrateRelationshipsV2_V3({
        batchSize: 100,
        req,
        })
`
export { imports, upSQL }
```

--------------------------------------------------------------------------------

---[FILE: versions-v1-v2.ts]---
Location: payload-main/packages/db-mongodb/src/predefinedMigrations/versions-v1-v2.ts

```typescript
const imports = `import { migrateVersionsV1_V2 } from '@payloadcms/db-mongodb/migration-utils'`
const upSQL = `   await migrateVersionsV1_V2({
        req,
        })
`
export { imports, upSQL }
```

--------------------------------------------------------------------------------

---[FILE: buildAndOrConditions.ts]---
Location: payload-main/packages/db-mongodb/src/queries/buildAndOrConditions.ts

```typescript
import type { FlattenedField, Payload, Where } from 'payload'

import { parseParams } from './parseParams.js'

export async function buildAndOrConditions({
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
  where: Where[]
}): Promise<Record<string, unknown>[]> {
  const completedConditions = []
  // Loop over all AND / OR operations and add them to the AND / OR query param
  // Operations should come through as an array

  for (const condition of where) {
    // If the operation is properly formatted as an object
    if (typeof condition === 'object') {
      const result = await parseParams({
        collectionSlug,
        fields,
        globalSlug,
        locale,
        parentIsLocalized,
        payload,
        where: condition,
      })
      if (Object.keys(result).length > 0) {
        completedConditions.push(result)
      }
    }
  }
  return completedConditions
}
```

--------------------------------------------------------------------------------

---[FILE: buildQuery.ts]---
Location: payload-main/packages/db-mongodb/src/queries/buildQuery.ts

```typescript
import type { FlattenedField, Where } from 'payload'

import type { MongooseAdapter } from '../index.js'

import { parseParams } from './parseParams.js'

export const buildQuery = async ({
  adapter,
  collectionSlug,
  fields,
  globalSlug,
  locale,
  where,
}: {
  adapter: MongooseAdapter
  collectionSlug?: string
  fields: FlattenedField[]
  globalSlug?: string
  locale?: string
  where: Where
}) => {
  const result = await parseParams({
    collectionSlug,
    fields,
    globalSlug,
    locale,
    parentIsLocalized: false,
    payload: adapter.payload,
    where,
  })

  return result
}
```

--------------------------------------------------------------------------------

````
