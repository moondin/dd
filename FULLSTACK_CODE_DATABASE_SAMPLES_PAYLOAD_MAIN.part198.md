---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 198
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 198 of 695)

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

---[FILE: validations.ts]---
Location: payload-main/packages/payload/src/fields/validations.ts

```typescript
import Ajv from 'ajv'
import ObjectIdImport from 'bson-objectid'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

import type { TFunction } from '@payloadcms/translations'
import type { JSONSchema4 } from 'json-schema'

import type { RichTextAdapter } from '../admin/types.js'
import type { CollectionSlug } from '../index.js'
import type { Where } from '../types/index.js'
import type {
  ArrayField,
  BlocksField,
  CheckboxField,
  CodeField,
  DateField,
  EmailField,
  JSONField,
  NumberField,
  PointField,
  RadioField,
  RelationshipField,
  RelationshipValue,
  RelationshipValueMany,
  RelationshipValueSingle,
  RichTextField,
  SelectField,
  TextareaField,
  TextField,
  UploadField,
  Validate,
  ValueWithRelation,
} from './config/types.js'

import { isNumber } from '../utilities/isNumber.js'
import { isValidID } from '../utilities/isValidID.js'

export type TextFieldValidation = Validate<string, unknown, unknown, TextField>

export type TextFieldManyValidation = Validate<string[], unknown, unknown, TextField>

export type TextFieldSingleValidation = Validate<string, unknown, unknown, TextField>

export const text: TextFieldValidation = (
  value,
  {
    hasMany,
    maxLength: fieldMaxLength,
    maxRows,
    minLength,
    minRows,
    req: {
      payload: { config },
      t,
    },
    required,
  },
) => {
  let maxLength!: number

  if (!required) {
    if (value === undefined || value === null) {
      return true
    }
  }

  if (hasMany === true) {
    const lengthValidationResult = validateArrayLength(value, { maxRows, minRows, required, t })
    if (typeof lengthValidationResult === 'string') {
      return lengthValidationResult
    }
  }

  if (typeof config?.defaultMaxTextLength === 'number') {
    maxLength = config.defaultMaxTextLength
  }
  if (typeof fieldMaxLength === 'number') {
    maxLength = fieldMaxLength
  }

  const stringsToValidate: string[] = Array.isArray(value) ? value : [value!]

  for (const stringValue of stringsToValidate) {
    const length = stringValue?.length || 0

    if (typeof maxLength === 'number' && length > maxLength) {
      return t('validation:shorterThanMax', { label: t('general:value'), maxLength, stringValue })
    }

    if (typeof minLength === 'number' && length < minLength) {
      return t('validation:longerThanMin', { label: t('general:value'), minLength, stringValue })
    }
  }

  if (required) {
    if (!(typeof value === 'string' || Array.isArray(value)) || value?.length === 0) {
      return t('validation:required')
    }
  }

  return true
}

export type PasswordFieldValidation = Validate<string, unknown, unknown, TextField>

export const password: PasswordFieldValidation = (
  value,
  {
    maxLength: fieldMaxLength,
    minLength = 3,
    req: {
      payload: { config },
      t,
    },
    required,
  },
) => {
  let maxLength!: number

  if (typeof config?.defaultMaxTextLength === 'number') {
    maxLength = config.defaultMaxTextLength
  }
  if (typeof fieldMaxLength === 'number') {
    maxLength = fieldMaxLength
  }

  if (value && maxLength && value.length > maxLength) {
    return t('validation:shorterThanMax', { maxLength })
  }

  if (value && minLength && value.length < minLength) {
    return t('validation:longerThanMin', { minLength })
  }

  if (required && !value) {
    return t('validation:required')
  }

  return true
}

export type ConfirmPasswordFieldValidation = Validate<
  string,
  unknown,
  { password: string },
  TextField
>

export const confirmPassword: ConfirmPasswordFieldValidation = (
  value,
  { req: { t }, required, siblingData },
) => {
  if (required && !value) {
    return t('validation:required')
  }

  if (value && value !== siblingData.password) {
    return t('fields:passwordsDoNotMatch')
  }

  return true
}

export type EmailFieldValidation = Validate<string, unknown, { username?: string }, EmailField>

export const email: EmailFieldValidation = (
  value,
  {
    collectionSlug,
    req: {
      payload: { collections, config },
      t,
    },
    required,
    siblingData,
  },
) => {
  if (collectionSlug) {
    const collection =
      collections?.[collectionSlug]?.config ??
      config.collections.find(({ slug }) => slug === collectionSlug)! // If this is run on the client, `collections` will be undefined, but `config.collections` will be available

    if (
      collection.auth.loginWithUsername &&
      !collection.auth.loginWithUsername?.requireUsername &&
      !collection.auth.loginWithUsername?.requireEmail
    ) {
      if (!value && !siblingData?.username) {
        return t('validation:required')
      }
    }
  }

  /**
   * Disallows emails with double quotes (e.g., "user"@example.com, user@"example.com", "user@example.com")
   * Rejects spaces anywhere in the email (e.g., user @example.com, user@ example.com, user name@example.com)
   * Prevents consecutive dots in the local or domain part (e.g., user..name@example.com, user@example..com)
   * Disallows domains that start or end with a hyphen (e.g., user@-example.com, user@example-.com)
   * Allows standard email formats (e.g., user@example.com, user.name+alias@example.co.uk, user-name@example.org)
   * Allows domains with consecutive hyphens as long as they are not leading/trailing (e.g., user@ex--ample.com)
   * Supports multiple subdomains (e.g., user@sub.domain.example.com)
   */
  const emailRegex =
    /^(?!.*\.\.)[\w!#$%&'*+/=?^`{|}~-](?:[\w!#$%&'*+/=?^`{|}~.-]*[\w!#$%&'*+/=?^`{|}~-])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i

  if ((value && !emailRegex.test(value)) || (!value && required)) {
    return t('validation:emailAddress')
  }

  return true
}

export type UsernameFieldValidation = Validate<string, unknown, { email?: string }, TextField>

export const username: UsernameFieldValidation = (
  value,
  {
    collectionSlug,
    req: {
      payload: { collections, config },
      t,
    },
    required,
    siblingData,
  },
) => {
  let maxLength!: number

  if (collectionSlug) {
    const collection =
      collections?.[collectionSlug]?.config ??
      config.collections.find(({ slug }) => slug === collectionSlug)! // If this is run on the client, `collections` will be undefined, but `config.collections` will be available

    if (
      collection.auth.loginWithUsername &&
      !collection.auth.loginWithUsername?.requireUsername &&
      !collection.auth.loginWithUsername?.requireEmail
    ) {
      if (!value && !siblingData?.email) {
        return t('validation:required')
      }
    }
  }

  if (typeof config?.defaultMaxTextLength === 'number') {
    maxLength = config.defaultMaxTextLength
  }

  if (value && maxLength && value.length > maxLength) {
    return t('validation:shorterThanMax', { maxLength })
  }

  if (!value && required) {
    return t('validation:required')
  }

  return true
}

export type TextareaFieldValidation = Validate<string, unknown, unknown, TextareaField>

export const textarea: TextareaFieldValidation = (
  value,
  {
    maxLength: fieldMaxLength,
    minLength,
    req: {
      payload: { config },
      t,
    },
    required,
  },
) => {
  let maxLength!: number

  if (typeof config?.defaultMaxTextLength === 'number') {
    maxLength = config.defaultMaxTextLength
  }
  if (typeof fieldMaxLength === 'number') {
    maxLength = fieldMaxLength
  }
  if (value && maxLength && value.length > maxLength) {
    return t('validation:shorterThanMax', { maxLength })
  }

  if (value && minLength && value.length < minLength) {
    return t('validation:longerThanMin', { minLength })
  }

  if (required && !value) {
    return t('validation:required')
  }

  return true
}

export type CodeFieldValidation = Validate<string, unknown, unknown, CodeField>

export const code: CodeFieldValidation = (value, { req: { t }, required }) => {
  if (required && value === undefined) {
    return t('validation:required')
  }

  return true
}

export type JSONFieldValidation = Validate<
  string,
  unknown,
  unknown,
  { jsonError?: string } & JSONField
>

export const json: JSONFieldValidation = (
  value,
  { jsonError, jsonSchema, req: { t }, required },
) => {
  const isNotEmpty = (value: null | string | undefined) => {
    if (value === undefined || value === null) {
      return false
    }

    if (Array.isArray(value) && value.length === 0) {
      return false
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false
    }

    return true
  }

  const fetchSchema = ({ schema, uri }: { schema: JSONSchema4; uri: string }) => {
    if (uri && schema) {
      return schema
    }
    return fetch(uri)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((_json) => {
        const json = _json as {
          id: string
        }
        const jsonSchemaSanitizations = {
          id: undefined,
          $id: json.id,
          $schema: 'http://json-schema.org/draft-07/schema#',
        }

        return Object.assign(json, jsonSchemaSanitizations)
      })
  }

  if (required && !value) {
    return t('validation:required')
  }

  if (jsonError !== undefined) {
    return t('validation:invalidInput')
  }

  if (jsonSchema && isNotEmpty(value)) {
    try {
      jsonSchema.schema = fetchSchema(jsonSchema)
      const { schema } = jsonSchema
      // @ts-expect-error missing types
      const ajv = new Ajv()

      if (!ajv.validate(schema, value)) {
        return ajv.errorsText()
      }
    } catch (error) {
      return error instanceof Error ? error.message : 'Unknown error'
    }
  }
  return true
}

export type CheckboxFieldValidation = Validate<boolean, unknown, unknown, CheckboxField>

export const checkbox: CheckboxFieldValidation = (value, { req: { t }, required }) => {
  if ((value && typeof value !== 'boolean') || (required && typeof value !== 'boolean')) {
    return t('validation:trueOrFalse')
  }

  return true
}

export type DateFieldValidation = Validate<Date, unknown, unknown, DateField>

export const date: DateFieldValidation = (
  value,
  { name, req: { t }, required, siblingData, timezone },
) => {
  const validDate = value && !isNaN(Date.parse(value.toString()))

  // We need to also check for the timezone data based on this field's config
  // We cannot do this inside the timezone field validation as it's visually hidden
  const hasRequiredTimezone = timezone && required
  const selectedTimezone: string = siblingData?.[`${name}_tz` as keyof typeof siblingData]
  // Always resolve to true if the field is not required, as timezone may be optional too then
  const validTimezone = hasRequiredTimezone ? Boolean(selectedTimezone) : true

  if (validDate && validTimezone) {
    return true
  }

  if (validDate && !validTimezone) {
    return t('validation:timezoneRequired')
  }

  if (value) {
    return t('validation:notValidDate', { value })
  }

  if (required) {
    return t('validation:required')
  }

  return true
}

export type RichTextFieldValidation = Validate<object, unknown, unknown, RichTextField>

export const richText: RichTextFieldValidation = async (value, options) => {
  if (!options?.editor) {
    throw new Error('richText field has no editor property.')
  }
  if (typeof options?.editor === 'function') {
    throw new Error('Attempted to access unsanitized rich text editor.')
  }

  const editor: RichTextAdapter = options?.editor

  return editor.validate(value, options)
}

const validateArrayLength = (
  value: unknown,
  options: {
    maxRows?: number
    minRows?: number
    required?: boolean
    t: TFunction
  },
) => {
  const { maxRows, minRows, required, t } = options

  const arrayLength = Array.isArray(value) ? value.length : (value as number) || 0

  if (!required && arrayLength === 0) {
    return true
  }

  if (minRows && arrayLength < minRows) {
    return t('validation:requiresAtLeast', { count: minRows, label: t('general:rows') })
  }

  if (maxRows && arrayLength > maxRows) {
    return t('validation:requiresNoMoreThan', { count: maxRows, label: t('general:rows') })
  }

  if (required && !arrayLength) {
    return t('validation:requiresAtLeast', { count: 1, label: t('general:row') })
  }

  return true
}

export type NumberFieldValidation = Validate<number | number[], unknown, unknown, NumberField>

export type NumberFieldManyValidation = Validate<number[], unknown, unknown, NumberField>

export type NumberFieldSingleValidation = Validate<number, unknown, unknown, NumberField>

export const number: NumberFieldValidation = (
  value,
  { hasMany, max, maxRows, min, minRows, req: { t }, required },
) => {
  if (hasMany === true) {
    const lengthValidationResult = validateArrayLength(value, { maxRows, minRows, required, t })
    if (typeof lengthValidationResult === 'string') {
      return lengthValidationResult
    }
  }

  if (!value && !isNumber(value)) {
    // if no value is present, validate based on required
    if (required) {
      return t('validation:required')
    }
    if (!required) {
      return true
    }
  }

  const numbersToValidate: number[] = Array.isArray(value) ? value : [value!]

  for (const number of numbersToValidate) {
    if (!isNumber(number)) {
      return t('validation:enterNumber')
    }

    const numberValue = parseFloat(number as unknown as string)

    if (typeof max === 'number' && numberValue > max) {
      return t('validation:greaterThanMax', { label: t('general:value'), max, value })
    }

    if (typeof min === 'number' && numberValue < min) {
      return t('validation:lessThanMin', { label: t('general:value'), min, value })
    }
  }

  return true
}

export type ArrayFieldValidation = Validate<unknown[], unknown, unknown, ArrayField>

export const array: ArrayFieldValidation = (value, { maxRows, minRows, req: { t }, required }) => {
  return validateArrayLength(value, { maxRows, minRows, required, t })
}

export type BlocksFieldValidation = Validate<unknown, unknown, unknown, BlocksField>

/**
 * This function validates the blocks in a blocks field against the provided filterOptions.
 * It will return a list of all block slugs found in the value, the allowed block slugs (if any),
 * and a list of invalid block slugs that are used despite being disallowed.
 *
 * @internal - this may break or be removed at any time
 */
export async function validateBlocksFilterOptions({
  id,
  data,
  filterOptions,
  req,
  siblingData,
  value,
}: { value: Parameters<BlocksFieldValidation>[0] } & Pick<
  Parameters<BlocksFieldValidation>[1],
  'data' | 'filterOptions' | 'id' | 'req' | 'siblingData'
>): Promise<{
  /**
   * All block slugs found in the value of the blocks field
   */
  allBlockSlugs: string[]
  /**
   * All block slugs that are allowed. If undefined, all blocks are allowed.
   */
  allowedBlockSlugs: string[] | undefined
  /**
   * A list of block slugs that are used despite being disallowed. If undefined, field passed validation.
   */
  invalidBlockSlugs: string[] | undefined
}> {
  const allBlockSlugs = Array.isArray(value)
    ? (value as Array<{ blockType?: string }>)
        .map((b) => b.blockType)
        .filter((s): s is string => Boolean(s))
    : []

  // if undefined => all blocks allowed
  let allowedBlockSlugs: string[] | undefined = undefined

  if (typeof filterOptions === 'function') {
    const result = await filterOptions({
      id: id!, // original code asserted presence
      data,
      req,
      siblingData,
      user: req.user,
    })
    if (result !== true && Array.isArray(result)) {
      allowedBlockSlugs = result
    }
  } else if (Array.isArray(filterOptions)) {
    allowedBlockSlugs = filterOptions
  }

  const invalidBlockSlugs: string[] = []
  if (allowedBlockSlugs) {
    for (const blockSlug of allBlockSlugs) {
      if (!allowedBlockSlugs.includes(blockSlug)) {
        invalidBlockSlugs.push(blockSlug)
      }
    }
  }

  return {
    allBlockSlugs,
    allowedBlockSlugs,
    invalidBlockSlugs,
  }
}
export const blocks: BlocksFieldValidation = async (
  value,
  { id, data, filterOptions, maxRows, minRows, req: { t }, req, required, siblingData },
) => {
  const lengthValidationResult = validateArrayLength(value, { maxRows, minRows, required, t })
  if (typeof lengthValidationResult === 'string') {
    return lengthValidationResult
  }

  if (filterOptions) {
    const { invalidBlockSlugs } = await validateBlocksFilterOptions({
      id,
      data,
      filterOptions,
      req,
      siblingData,
      value,
    })
    if (invalidBlockSlugs?.length) {
      return t('validation:invalidBlocks', { blocks: invalidBlockSlugs.join(', ') })
    }
  }

  return true
}

const validateFilterOptions: Validate<
  unknown,
  unknown,
  unknown,
  RelationshipField | UploadField
> = async (
  value,
  { id, blockData, data, filterOptions, relationTo, req, req: { t, user }, siblingData },
) => {
  if (typeof filterOptions !== 'undefined' && value) {
    const options: {
      [collection: string]: (number | string)[]
    } = {}

    const falseCollections: CollectionSlug[] = []
    const collections = !Array.isArray(relationTo) ? [relationTo] : relationTo
    const values = Array.isArray(value) ? value : [value]

    for (const collection of collections) {
      try {
        let optionFilter =
          typeof filterOptions === 'function'
            ? await filterOptions({
                id: id!,
                blockData,
                data,
                relationTo: collection,
                req,
                siblingData,
                user,
              })
            : filterOptions

        if (optionFilter === true) {
          optionFilter = null
        }

        const valueIDs: (number | string)[] = []

        values.forEach((val) => {
          if (typeof val === 'object') {
            if (val?.value) {
              valueIDs.push(val.value)
            } else if (ObjectId.isValid(val)) {
              valueIDs.push(new ObjectId(val).toHexString())
            }
          }

          if (typeof val === 'string' || typeof val === 'number') {
            valueIDs.push(val)
          }
        })

        if (valueIDs.length > 0) {
          const findWhere: Where = {
            and: [{ id: { in: valueIDs } }],
          }

          // @ts-expect-error - I don't understand why optionFilter is inferred as `false | Where | null` instead of `boolean | Where | null`
          if (optionFilter && optionFilter !== true) {
            findWhere.and?.push(optionFilter)
          }

          if (optionFilter === false) {
            falseCollections.push(collection)
          }

          const result = await req.payloadDataLoader.find({
            collection,
            depth: 0,
            limit: 0,
            pagination: false,
            req,
            where: findWhere,
          })

          options[collection] = result.docs.map((doc) => doc.id)
        } else {
          options[collection] = []
        }
      } catch (err) {
        req.payload.logger.error({
          err,
          msg: `Error validating filter options for collection ${collection}`,
        })
        options[collection] = []
      }
    }

    const invalidRelationships = values.filter((val) => {
      let collection: string
      let requestedID: number | string

      if (typeof relationTo === 'string') {
        collection = relationTo

        if (typeof val === 'string' || typeof val === 'number') {
          requestedID = val
        }

        if (typeof val === 'object' && ObjectId.isValid(val)) {
          requestedID = new ObjectId(val).toHexString()
        }
      }

      if (Array.isArray(relationTo) && typeof val === 'object' && val?.relationTo) {
        collection = val.relationTo
        requestedID = val.value
      }

      if (falseCollections.find((slug) => relationTo === slug)) {
        return true
      }

      if (!options[collection!]) {
        return true
      }

      return options[collection!]!.indexOf(requestedID!) === -1
    })

    if (invalidRelationships.length > 0) {
      return invalidRelationships.reduce((err, invalid, i) => {
        return `${err} ${JSON.stringify(invalid)}${
          invalidRelationships.length === i + 1 ? ',' : ''
        } `
      }, t('validation:invalidSelections')) as string
    }

    return true
  }

  return true
}

export type UploadFieldValidation = Validate<unknown, unknown, unknown, UploadField>

export type UploadFieldManyValidation = Validate<unknown[], unknown, unknown, UploadField>

export type UploadFieldSingleValidation = Validate<unknown, unknown, unknown, UploadField>

export const upload: UploadFieldValidation = async (value, options) => {
  const {
    event,
    maxRows,
    minRows,
    relationTo,
    req: { payload, t },
    required,
  } = options

  if (
    ((!value && typeof value !== 'number') || (Array.isArray(value) && value.length === 0)) &&
    required
  ) {
    return t('validation:required')
  }

  if (Array.isArray(value) && value.length > 0) {
    if (minRows && value.length < minRows) {
      return t('validation:lessThanMin', {
        label: t('general:rows'),
        min: minRows,
        value: value.length,
      })
    }

    if (maxRows && value.length > maxRows) {
      return t('validation:greaterThanMax', {
        label: t('general:rows'),
        max: maxRows,
        value: value.length,
      })
    }
  }

  if (typeof value !== 'undefined' && value !== null) {
    const values = Array.isArray(value) ? value : [value]

    const invalidRelationships = values.filter((val) => {
      let collectionSlug: string
      let requestedID

      if (typeof relationTo === 'string') {
        collectionSlug = relationTo

        // custom id
        if (val || typeof val === 'number') {
          requestedID = val
        }
      }

      if (Array.isArray(relationTo) && typeof val === 'object' && val?.relationTo) {
        collectionSlug = val.relationTo
        requestedID = val.value
      }

      if (requestedID === null) {
        return false
      }

      const idType =
        payload.collections[collectionSlug!]?.customIDType || payload?.db?.defaultIDType || 'text'

      return !isValidID(requestedID, idType)
    })

    if (invalidRelationships.length > 0) {
      return `This relationship field has the following invalid relationships: ${invalidRelationships
        .map((err, invalid) => {
          return `${err} ${JSON.stringify(invalid)}`
        })
        .join(', ')}`
    }
  }

  if (event === 'onChange') {
    return true
  }

  return validateFilterOptions(value, options)
}

export type RelationshipFieldValidation = Validate<
  RelationshipValue,
  unknown,
  unknown,
  RelationshipField
>

export type RelationshipFieldManyValidation = Validate<
  RelationshipValueMany,
  unknown,
  unknown,
  RelationshipField
>

export type RelationshipFieldSingleValidation = Validate<
  RelationshipValueSingle,
  unknown,
  unknown,
  RelationshipField
>

export const relationship: RelationshipFieldValidation = async (value, options) => {
  const {
    event,
    maxRows,
    minRows,
    relationTo,
    req: { payload, t },
    required,
  } = options

  if (
    ((!value && typeof value !== 'number') || (Array.isArray(value) && value.length === 0)) &&
    required
  ) {
    return t('validation:required')
  }

  if (Array.isArray(value) && value.length > 0) {
    if (minRows && value.length < minRows) {
      return t('validation:lessThanMin', {
        label: t('general:rows'),
        min: minRows,
        value: value.length,
      })
    }

    if (maxRows && value.length > maxRows) {
      return t('validation:greaterThanMax', {
        label: t('general:rows'),
        max: maxRows,
        value: value.length,
      })
    }
  }

  if (typeof value !== 'undefined' && value !== null) {
    const values = Array.isArray(value) ? value : [value]

    const invalidRelationships = values.filter((val) => {
      let collectionSlug: string
      let requestedID: number | string | undefined | ValueWithRelation

      if (typeof relationTo === 'string') {
        collectionSlug = relationTo

        // custom id
        if (val || typeof val === 'number') {
          requestedID = val
        }
      }

      if (Array.isArray(relationTo) && typeof val === 'object' && val?.relationTo) {
        collectionSlug = val.relationTo
        requestedID = val.value
      }

      if (requestedID === null) {
        return false
      }

      const idType =
        payload.collections[collectionSlug!]?.customIDType || payload?.db?.defaultIDType || 'text'

      return !isValidID(requestedID as number | string, idType)
    })

    if (invalidRelationships.length > 0) {
      return `This relationship field has the following invalid relationships: ${invalidRelationships
        .map((err, invalid) => {
          return `${err} ${JSON.stringify(invalid)}`
        })
        .join(', ')}`
    }
  }

  if (event === 'onChange') {
    return true
  }

  return validateFilterOptions(value, options)
}

export type SelectFieldValidation = Validate<string | string[], unknown, unknown, SelectField>

export type SelectFieldManyValidation = Validate<string[], unknown, unknown, SelectField>

export type SelectFieldSingleValidation = Validate<string, unknown, unknown, SelectField>

export const select: SelectFieldValidation = (
  value,
  { data, filterOptions, hasMany, options, req, req: { t }, required, siblingData },
) => {
  const filteredOptions =
    typeof filterOptions === 'function'
      ? filterOptions({
          data,
          options,
          req,
          siblingData,
        })
      : options

  if (
    Array.isArray(value) &&
    value.some(
      (input) =>
        !filteredOptions.some(
          (option) => option === input || (typeof option !== 'string' && option?.value === input),
        ),
    )
  ) {
    return t('validation:invalidSelection')
  }

  if (
    typeof value === 'string' &&
    !filteredOptions.some(
      (option) => option === value || (typeof option !== 'string' && option.value === value),
    )
  ) {
    return t('validation:invalidSelection')
  }

  if (
    required &&
    (typeof value === 'undefined' ||
      value === null ||
      (hasMany && Array.isArray(value) && (value as [])?.length === 0))
  ) {
    return t('validation:required')
  }

  return true
}

export type RadioFieldValidation = Validate<unknown, unknown, unknown, RadioField>

export const radio: RadioFieldValidation = (value, { options, req: { t }, required }) => {
  if (value) {
    const valueMatchesOption = options.some(
      (option) => option === value || (typeof option !== 'string' && option.value === value),
    )
    return valueMatchesOption || t('validation:invalidSelection')
  }

  return required ? t('validation:required') : true
}

export type PointFieldValidation = Validate<
  [number | string, number | string],
  unknown,
  unknown,
  PointField
>

export const point: PointFieldValidation = (value = ['', ''], { req: { t }, required }) => {
  if (value === null) {
    if (required) {
      return t('validation:required')
    }

    return true
  }

  const lng = parseFloat(String(value[0]))
  const lat = parseFloat(String(value[1]))
  if (
    required &&
    ((value[0] && value[1] && typeof lng !== 'number' && typeof lat !== 'number') ||
      Number.isNaN(lng) ||
      Number.isNaN(lat) ||
      (Array.isArray(value) && value.length !== 2))
  ) {
    return t('validation:requiresTwoNumbers')
  }

  if ((value[1] && Number.isNaN(lng)) || (value[0] && Number.isNaN(lat))) {
    return t('validation:invalidInput')
  }

  // Validate longitude bounds (-180 to 180)
  if (value[0] && !Number.isNaN(lng) && (lng < -180 || lng > 180)) {
    return t('validation:longitudeOutOfBounds')
  }

  // Validate latitude bounds (-90 to 90)
  if (value[1] && !Number.isNaN(lat) && (lat < -90 || lat > 90)) {
    return t('validation:latitudeOutOfBounds')
  }

  return true
}

/**
 * Built-in field validations used by Payload
 *
 * These can be re-used in custom validations
 */
export const validations = {
  array,
  blocks,
  checkbox,
  code,
  confirmPassword,
  date,
  email,
  json,
  number,
  password,
  point,
  radio,
  relationship,
  richText,
  select,
  text,
  textarea,
  upload,
}
```

--------------------------------------------------------------------------------

---[FILE: baseBlockFields.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/baseBlockFields.ts

```typescript
import type { Field } from '../config/types.js'

import { baseIDField } from './baseIDField.js'

export const baseBlockFields: Field[] = [
  baseIDField,
  {
    name: 'blockName',
    type: 'text',
    admin: {
      disabled: true,
    },
    label: 'Block Name',
    required: false,
  },
]
```

--------------------------------------------------------------------------------

---[FILE: baseIDField.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/baseIDField.ts

```typescript
import ObjectIdImport from 'bson-objectid'

import type { TextField } from '../config/types.js'

const ObjectId = 'default' in ObjectIdImport ? ObjectIdImport.default : ObjectIdImport

export const baseIDField: TextField = {
  name: 'id',
  type: 'text',
  admin: {
    hidden: true,
  },
  defaultValue: () => new ObjectId().toHexString(),
  hooks: {
    beforeChange: [({ value }) => value || new ObjectId().toHexString()],
    // ID field values for arrays and blocks need to be unique when duplicating, as on postgres they are stored on the same table as primary keys.
    beforeDuplicate: [() => new ObjectId().toHexString()],
  },
  label: 'ID',
}
```

--------------------------------------------------------------------------------

---[FILE: countVersions.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/slug/countVersions.ts

```typescript
import type {
  CollectionSlug,
  DefaultDocumentIDType,
  GlobalSlug,
  PayloadRequest,
  Where,
} from '../../../index.js'

/**
 * This is a cross-entity way to count the number of versions for any given document.
 * It will work for both collections and globals.
 * @returns number of versions
 */
export const countVersions = async (args: {
  collectionSlug?: CollectionSlug
  globalSlug?: GlobalSlug
  parentID?: DefaultDocumentIDType
  req: PayloadRequest
}): Promise<number> => {
  const { collectionSlug, globalSlug, parentID, req } = args

  let countFn

  const where: Where = {
    parent: {
      equals: parentID,
    },
  }

  if (collectionSlug) {
    countFn = () =>
      req.payload.countVersions({
        collection: collectionSlug,
        depth: 0,
        where,
      })
  }

  if (globalSlug) {
    countFn = () =>
      req.payload.countGlobalVersions({
        depth: 0,
        global: globalSlug,
        where,
      })
  }

  const res = countFn ? (await countFn()?.then((res) => res.totalDocs || 0)) || 0 : 0

  return res
}
```

--------------------------------------------------------------------------------

---[FILE: generateSlug.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/slug/generateSlug.ts

```typescript
import type { PayloadRequest } from '../../../types/index.js'
import type { FieldHook } from '../../config/types.js'
import type { SlugFieldArgs, Slugify } from './index.js'

import { hasAutosaveEnabled } from '../../../utilities/getVersionsConfig.js'
import { slugify as defaultSlugify } from '../../../utilities/slugify.js'
import { countVersions } from './countVersions.js'

type HookArgs = {
  slugFieldName: NonNullable<SlugFieldArgs['name']>
} & Pick<SlugFieldArgs, 'slugify'> &
  Required<Pick<SlugFieldArgs, 'useAsSlug'>>

const slugify = ({
  customSlugify,
  data,
  req,
  valueToSlugify,
}: {
  customSlugify?: Slugify
  data: Record<string, unknown>
  req: PayloadRequest
  valueToSlugify?: string
}) => {
  if (customSlugify) {
    return customSlugify({ data, req, valueToSlugify })
  }

  return defaultSlugify(valueToSlugify)
}

/**
 * This is a `BeforeChange` field hook used to auto-generate the `slug` field.
 * See `slugField` for more details.
 */
export const generateSlug =
  ({ slugFieldName, slugify: customSlugify, useAsSlug }: HookArgs): FieldHook =>
  async ({ collection, data, global, operation, originalDoc, req, value: isChecked }) => {
    if (operation === 'create') {
      if (data) {
        data[slugFieldName] = slugify({
          customSlugify,
          data,
          req,
          // Ensure user-defined slugs are not overwritten during create
          // Use a generic falsy check here to include empty strings
          valueToSlugify: data?.[slugFieldName] || data?.[useAsSlug],
        })
      }

      return Boolean(!data?.[slugFieldName])
    }

    if (operation === 'update') {
      // Early return to avoid additional processing
      if (!isChecked) {
        return false
      }

      if (!hasAutosaveEnabled(collection || global!)) {
        // We can generate the slug at this point
        if (data) {
          data[slugFieldName] = slugify({
            customSlugify,
            data,
            req,
            valueToSlugify: data?.[useAsSlug],
          })
        }

        return Boolean(!data?.[slugFieldName])
      } else {
        // If we're publishing, we can avoid querying as we can safely assume we've exceeded the version threshold (2)
        const isPublishing = data?._status === 'published'

        // Ensure the user can take over the generated slug themselves without it ever being overridden back
        const userOverride = data?.[slugFieldName] !== originalDoc?.[slugFieldName]

        if (!userOverride) {
          if (data) {
            // If the fallback is an empty string, we want the slug to return to `null`
            // This will ensure that live preview conditions continue to run as expected
            data[slugFieldName] = data?.[useAsSlug]
              ? slugify({
                  customSlugify,
                  data,
                  req,
                  valueToSlugify: data?.[useAsSlug],
                })
              : null
          }
        }

        if (isPublishing || userOverride) {
          return false
        }

        // Important: ensure `countVersions` is not called unnecessarily often
        // That is why this is buried beneath all these conditions
        const versionCount = await countVersions({
          collectionSlug: collection?.slug,
          globalSlug: global?.slug,
          parentID: originalDoc?.id,
          req,
        })

        if (versionCount <= 2) {
          return true
        } else {
          return false
        }
      }
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/slug/index.ts

```typescript
import type { TextFieldClientProps } from '../../../admin/types.js'
import type { TypeWithID } from '../../../collections/config/types.js'
import type { FieldAdmin, RowField, TextField } from '../../../fields/config/types.js'
import type { PayloadRequest } from '../../../types/index.js'

import { generateSlug } from './generateSlug.js'

export type Slugify<T extends TypeWithID = any> = (args: {
  data: T
  req: PayloadRequest
  valueToSlugify?: any
}) => Promise<string | undefined> | string | undefined

export type SlugFieldArgs = {
  /**
   * Override for the `generateSlug` checkbox field name.
   * @default 'generateSlug'
   */
  checkboxName?: string
  /**
   * @deprecated use `useAsSlug` instead.
   */
  fieldToUse?: string
  /**
   * Enable localization for the slug field.
   */
  localized?: TextField['localized']
  /**
   * Override for the `slug` field name.
   * @default 'slug'
   */
  name?: string
  /**
   * A function used to override the slug field(s) at a granular level.
   * Passes the row field to you to manipulate beyond the exposed options.
   * @example
   * ```ts
   * slugField({
   *   overrides: (field) => {
   *     field.fields[1].label = 'Custom Slug Label'
   *     return field
   *   }
   * })
   * ```
   */
  overrides?: (field: RowField) => RowField
  position?: FieldAdmin['position']
  /**
   * Whether or not the `slug` field is required.
   * @default true
   */
  required?: TextField['required']
  /**
   * Provide your own slugify function to override the default.
   */
  slugify?: Slugify
  /**
   * The name of the top-level field to generate the slug from, when applicable.
   * @default 'title'
   */
  useAsSlug?: string
}

export type SlugField = (args?: SlugFieldArgs) => RowField

export type SlugFieldClientPropsOnly = Pick<SlugFieldArgs, 'useAsSlug'>
/**
 * These are the props that the `SlugField` client component accepts.
 * The `SlugField` server component is responsible for passing down the `slugify` function.
 */
export type SlugFieldClientProps = SlugFieldClientPropsOnly & TextFieldClientProps

/**
 * A slug is a unique, indexed, URL-friendly string that identifies a particular document, often used to construct the URL of a webpage.
 * The `slug` field auto-generates its value based on another field, e.g. "My Title" → "my-title".
 *
 * The slug should continue to be generated through:
 * 1. The `create` operation, unless the user has modified the slug manually
 * 2. The `update` operation, if:
 *   a. Autosave is _not_ enabled and there is no slug
 *   b. Autosave _is_ enabled, the doc is unpublished, and the user has not modified the slug manually
 *
 * The slug should stabilize after all above criteria have been met, because the URL is typically derived from the slug.
 * This is to protect modifying potentially live URLs, breaking links, etc. without explicit intent.
 *
 * @experimental This field is experimental and may change or be removed in the future. Use at your own risk.
 */
export const slugField: SlugField = ({
  name: slugFieldName = 'slug',
  checkboxName = 'generateSlug',
  fieldToUse,
  localized,
  overrides,
  position = 'sidebar',
  required = true,
  slugify,
  useAsSlug: useAsSlugFromArgs = 'title',
} = {}) => {
  const useAsSlug = fieldToUse || useAsSlugFromArgs

  const baseField: RowField = {
    type: 'row',
    admin: {
      position,
    },
    fields: [
      {
        name: checkboxName,
        type: 'checkbox',
        admin: {
          description:
            'When enabled, the slug will auto-generate from the title field on save and autosave.',
          disableBulkEdit: true,
          disableGroupBy: true,
          disableListColumn: true,
          disableListFilter: true,
          hidden: true,
        },
        defaultValue: true,
        hooks: {
          beforeChange: [generateSlug({ slugFieldName, slugify, useAsSlug })],
        },
        localized,
      },
      {
        name: slugFieldName,
        type: 'text',
        admin: {
          components: {
            Field: {
              clientProps: {
                useAsSlug,
              } satisfies SlugFieldClientPropsOnly,
              path: '@payloadcms/ui#SlugField',
            },
          },
          width: '100%',
        },
        custom: {
          /**
           * This is needed so we can access it from the `slugifyHandler` server function.
           */
          slugify,
        },
        index: true,
        localized,
        required,
        unique: true,
      },
    ],
  }

  if (typeof overrides === 'function') {
    return overrides(baseField)
  }

  return baseField
}
```

--------------------------------------------------------------------------------

---[FILE: baseField.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/timezone/baseField.ts

```typescript
import type { SelectField } from '../../config/types.js'

export const baseTimezoneField: (args: Partial<SelectField>) => SelectField = ({
  name,
  defaultValue,
  options,
  required,
}) => {
  return {
    name: name!,
    type: 'select',
    admin: {
      hidden: true,
    },
    defaultValue,
    options: options!,
    required,
  }
}
```

--------------------------------------------------------------------------------

````
