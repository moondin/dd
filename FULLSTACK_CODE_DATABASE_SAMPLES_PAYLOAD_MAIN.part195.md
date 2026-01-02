---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 195
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 195 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/database/queryValidation/types.ts

```typescript
import type { CollectionPermission, GlobalPermission } from '../../auth/index.js'
import type { FlattenedField } from '../../fields/config/types.js'

// TODO: Rename to EntityPermissions in 4.0
export type EntityPolicies = {
  collections?: {
    [collectionSlug: string]: CollectionPermission
  }
  globals?: {
    [globalSlug: string]: GlobalPermission
  }
}

export type PathToQuery = {
  collectionSlug?: string
  complete: boolean
  field: FlattenedField
  fields?: FlattenedField[]
  globalSlug?: string
  invalid?: boolean
  /**
   * @todo make required in v4.0
   */
  parentIsLocalized: boolean
  path: string
}
```

--------------------------------------------------------------------------------

---[FILE: validateQueryPaths.ts]---
Location: payload-main/packages/payload/src/database/queryValidation/validateQueryPaths.ts

```typescript
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { FlattenedField } from '../../fields/config/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { Operator, PayloadRequest, Where, WhereField } from '../../types/index.js'
import type { EntityPolicies } from './types.js'

import { QueryError } from '../../errors/QueryError.js'
import { validOperatorSet } from '../../types/constants.js'
import { validateSearchParam } from './validateSearchParams.js'

type Args = {
  errors?: { path: string }[]
  overrideAccess: boolean
  // TODO: Rename to permissions or entityPermissions in 4.0
  policies?: EntityPolicies
  polymorphicJoin?: boolean
  req: PayloadRequest
  versionFields?: FlattenedField[]
  where: Where
} & (
  | {
      collectionConfig: SanitizedCollectionConfig
      globalConfig?: never | undefined
    }
  | {
      collectionConfig?: never | undefined
      globalConfig: SanitizedGlobalConfig
    }
)

export async function validateQueryPaths({
  collectionConfig,
  errors = [],
  globalConfig,
  overrideAccess,
  policies = {
    collections: {},
    globals: {},
  },
  polymorphicJoin,
  req,
  versionFields,
  where,
}: Args): Promise<void> {
  const fields = versionFields || (globalConfig || collectionConfig).flattenedFields

  if (typeof where === 'object') {
    // We need to determine if the whereKey is an AND, OR, or a schema path
    const promises: Promise<void>[] = []
    for (const path in where) {
      const constraint = where[path]

      if ((path === 'and' || path === 'or') && Array.isArray(constraint)) {
        for (const item of constraint) {
          if (collectionConfig) {
            promises.push(
              validateQueryPaths({
                collectionConfig,
                errors,
                overrideAccess,
                policies,
                polymorphicJoin,
                req,
                versionFields,
                where: item,
              }),
            )
          } else {
            promises.push(
              validateQueryPaths({
                errors,
                globalConfig,
                overrideAccess,
                policies,
                polymorphicJoin,
                req,
                versionFields,
                where: item,
              }),
            )
          }
        }
      } else if (!Array.isArray(constraint)) {
        for (const operator in constraint) {
          const val = constraint[operator as keyof typeof constraint]
          if (validOperatorSet.has(operator as Operator)) {
            promises.push(
              validateSearchParam({
                collectionConfig,
                constraint: where as WhereField,
                errors,
                fields,
                globalConfig,
                operator,
                overrideAccess,
                path,
                policies,
                polymorphicJoin,
                req,
                val,
                versionFields,
              }),
            )
          }
        }
      }
    }

    await Promise.all(promises)
    if (errors.length > 0) {
      throw new QueryError(errors)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: validateSearchParams.ts]---
Location: payload-main/packages/payload/src/database/queryValidation/validateSearchParams.ts

```typescript
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { FlattenedField } from '../../fields/config/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { PayloadRequest, WhereField } from '../../types/index.js'
import type { EntityPolicies, PathToQuery } from './types.js'

import { fieldAffectsData } from '../../fields/config/types.js'
import { getEntityPermissions } from '../../utilities/getEntityPermissions/getEntityPermissions.js'
import { isolateObjectProperty } from '../../utilities/isolateObjectProperty.js'
import { getLocalizedPaths } from '../getLocalizedPaths.js'
import { validateQueryPaths } from './validateQueryPaths.js'

type Args = {
  collectionConfig?: SanitizedCollectionConfig
  constraint: WhereField
  errors: { path: string }[]
  fields: FlattenedField[]
  globalConfig?: SanitizedGlobalConfig
  operator: string
  overrideAccess: boolean
  parentIsLocalized?: boolean
  path: string
  // TODO: Rename to permissions or entityPermissions in 4.0
  policies: EntityPolicies
  polymorphicJoin?: boolean
  req: PayloadRequest
  val: unknown
  versionFields?: FlattenedField[]
}

/**
 * Validate the Payload key / value / operator
 */
export async function validateSearchParam({
  collectionConfig,
  constraint,
  errors,
  fields,
  globalConfig,
  operator,
  overrideAccess,
  parentIsLocalized,
  path: incomingPath,
  policies,
  polymorphicJoin,
  req,
  val,
  versionFields,
}: Args): Promise<void> {
  // Replace GraphQL nested field double underscore formatting
  let sanitizedPath
  if (incomingPath === '_id') {
    sanitizedPath = 'id'
  } else {
    sanitizedPath = incomingPath.replace(/__/g, '.')
  }
  let paths: PathToQuery[] = []
  const { slug } = (collectionConfig || globalConfig)!

  const blockReferencesPermissions = {}

  if (globalConfig && !policies.globals![slug]) {
    policies.globals![slug] = await getEntityPermissions({
      blockReferencesPermissions,
      entity: globalConfig,
      entityType: 'global',
      fetchData: false,
      operations: ['read'],
      req,
    })
  }

  if (sanitizedPath !== 'id') {
    paths = getLocalizedPaths({
      collectionSlug: collectionConfig?.slug,
      fields,
      globalSlug: globalConfig?.slug,
      incomingPath: sanitizedPath,
      locale: req.locale!,
      overrideAccess,
      parentIsLocalized,
      payload: req.payload,
    })
  }
  const promises: Promise<void>[] = []

  // Sanitize relation.otherRelation.id to relation.otherRelation
  if (paths.at(-1)?.path === 'id') {
    const previousField = paths.at(-2)?.field
    if (
      previousField &&
      (previousField.type === 'relationship' || previousField.type === 'upload') &&
      typeof previousField.relationTo === 'string'
    ) {
      paths.pop()
    }
  }

  promises.push(
    ...paths.map(async ({ collectionSlug, field, invalid, path }, i) => {
      if (invalid) {
        if (!polymorphicJoin) {
          errors.push({ path })
        }

        return
      }

      // where: { relatedPosts: { equals: 1}} -> { 'relatedPosts.id': { equals: 1}}
      if (field.type === 'join' && path === incomingPath) {
        constraint[`${path}.id` as keyof WhereField] = constraint[path as keyof WhereField]
        delete constraint[path as keyof WhereField]
      }

      if ('virtual' in field && field.virtual) {
        if (field.virtual === true) {
          errors.push({ path })
        }
      }

      if (polymorphicJoin && path === 'relationTo') {
        return
      }

      if (!overrideAccess && fieldAffectsData(field)) {
        if (collectionSlug) {
          if (!policies.collections![collectionSlug]) {
            policies.collections![collectionSlug] = await getEntityPermissions({
              blockReferencesPermissions,
              entity: req.payload.collections[collectionSlug]!.config,
              entityType: 'collection',
              fetchData: false,
              operations: ['read'],
              req: isolateObjectProperty(req, 'transactionID'),
            })
          }

          if (
            ['hash', 'salt'].includes(incomingPath) &&
            collectionConfig!.auth &&
            !collectionConfig!.auth?.disableLocalStrategy
          ) {
            errors.push({ path: incomingPath })
          }
        }
        let fieldPath = path
        // remove locale from end of path
        if (path.endsWith(`.${req.locale}`)) {
          fieldPath = path.slice(0, -(req.locale!.length + 1))
        }
        // remove ".value" from ends of polymorphic relationship paths
        if (
          (field.type === 'relationship' || field.type === 'upload') &&
          Array.isArray(field.relationTo)
        ) {
          fieldPath = fieldPath.replace('.value', '')
        }

        const entityType: 'collections' | 'globals' = globalConfig ? 'globals' : 'collections'
        const entitySlug = collectionSlug || globalConfig!.slug
        const segments = fieldPath.split('.')

        let fieldAccess: any

        if (versionFields) {
          fieldAccess = policies[entityType]![entitySlug]!.fields

          if (
            segments[0] === 'parent' ||
            segments[0] === 'version' ||
            segments[0] === 'snapshot' ||
            segments[0] === 'latest'
          ) {
            segments.shift()
          }
        } else {
          fieldAccess = policies[entityType]![entitySlug]!.fields
        }

        if (segments.length) {
          segments.forEach((segment) => {
            if (fieldAccess[segment]) {
              if ('fields' in fieldAccess[segment]) {
                fieldAccess = fieldAccess[segment].fields
              } else {
                fieldAccess = fieldAccess[segment]
              }
            }
          })

          if (!fieldAccess?.read?.permission) {
            errors.push({ path: fieldPath })
          }
        }
      }

      if (i > 1) {
        // Remove top collection and reverse array
        // to work backwards from top
        const pathsToQuery = paths.slice(1).reverse()

        pathsToQuery.forEach(
          ({ collectionSlug: pathCollectionSlug, path: subPath }, pathToQueryIndex) => {
            // On the "deepest" collection,
            // validate query of the relationship
            if (pathToQueryIndex === 0) {
              promises.push(
                validateQueryPaths({
                  collectionConfig: req.payload.collections[pathCollectionSlug!]!.config,
                  errors,
                  globalConfig: undefined,
                  overrideAccess,
                  policies,
                  req,
                  where: {
                    [subPath]: {
                      [operator]: val,
                    },
                  },
                }),
              )
            }
          },
        )
      }
    }),
  )
  await Promise.all(promises)
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/duplicateDocument/index.ts

```typescript
import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { FindOneArgs } from '../database/types.js'
import type { JsonObject, PayloadRequest } from '../types/index.js'

import { executeAccess } from '../auth/executeAccess.js'
import { hasWhereAccessResult } from '../auth/types.js'
import { combineQueries } from '../database/combineQueries.js'
import { Forbidden } from '../errors/Forbidden.js'
import { NotFound } from '../errors/NotFound.js'
import { afterRead } from '../fields/hooks/afterRead/index.js'
import { beforeDuplicate } from '../fields/hooks/beforeDuplicate/index.js'
import { deepCopyObjectSimple } from '../utilities/deepCopyObject.js'
import { filterDataToSelectedLocales } from '../utilities/filterDataToSelectedLocales.js'
import { getLatestCollectionVersion } from '../versions/getLatestCollectionVersion.js'

type GetDuplicateDocumentArgs = {
  collectionConfig: SanitizedCollectionConfig
  draftArg?: boolean
  id: number | string
  overrideAccess?: boolean
  req: PayloadRequest
  selectedLocales?: string[]
}
export const getDuplicateDocumentData = async ({
  id,
  collectionConfig,
  draftArg,
  overrideAccess,
  req,
  selectedLocales,
}: GetDuplicateDocumentArgs): Promise<{
  duplicatedFromDoc: JsonObject
  duplicatedFromDocWithLocales: JsonObject
}> => {
  const { payload } = req
  // /////////////////////////////////////
  // Read Access
  // /////////////////////////////////////

  const accessResults = !overrideAccess
    ? await executeAccess({ id, req }, collectionConfig.access.read)
    : true
  const hasWherePolicy = hasWhereAccessResult(accessResults)

  // /////////////////////////////////////
  // Retrieve document
  // /////////////////////////////////////
  const findOneArgs: FindOneArgs = {
    collection: collectionConfig.slug,
    locale: req.locale!,
    req,
    where: combineQueries({ id: { equals: id } }, accessResults),
  }

  let duplicatedFromDocWithLocales = await getLatestCollectionVersion({
    id,
    config: collectionConfig,
    payload,
    query: findOneArgs,
    req,
  })

  if (selectedLocales && selectedLocales.length > 0 && duplicatedFromDocWithLocales) {
    duplicatedFromDocWithLocales = filterDataToSelectedLocales({
      configBlockReferences: payload.config.blocks,
      docWithLocales: duplicatedFromDocWithLocales,
      fields: collectionConfig.fields,
      selectedLocales,
    })
  }

  if (!duplicatedFromDocWithLocales && !hasWherePolicy) {
    throw new NotFound(req.t)
  }
  if (!duplicatedFromDocWithLocales && hasWherePolicy) {
    throw new Forbidden(req.t)
  }

  // remove the createdAt timestamp and rely on the db to set it
  if ('createdAt' in duplicatedFromDocWithLocales) {
    delete duplicatedFromDocWithLocales.createdAt
  }
  // remove the id and rely on the db to set it
  if ('id' in duplicatedFromDocWithLocales) {
    delete duplicatedFromDocWithLocales.id
  }

  duplicatedFromDocWithLocales = await beforeDuplicate({
    id,
    collection: collectionConfig,
    context: req.context,
    doc: duplicatedFromDocWithLocales,
    overrideAccess: overrideAccess!,
    req,
  })

  const duplicatedFromDoc = await afterRead({
    collection: collectionConfig,
    context: req.context,
    depth: 0,
    doc: deepCopyObjectSimple(duplicatedFromDocWithLocales),
    draft: draftArg!,
    fallbackLocale: null,
    global: null,
    locale: req.locale!,
    overrideAccess: true,
    req,
    showHiddenFields: true,
  })

  return { duplicatedFromDoc, duplicatedFromDocWithLocales }
}
```

--------------------------------------------------------------------------------

---[FILE: consoleEmailAdapter.ts]---
Location: payload-main/packages/payload/src/email/consoleEmailAdapter.ts

```typescript
import type { EmailAdapter } from './types.js'

import { emailDefaults } from './defaults.js'
import { getStringifiedToAddress } from './getStringifiedToAddress.js'

export const consoleEmailAdapter: EmailAdapter<void> = ({ payload }) => ({
  name: 'console',
  defaultFromAddress: emailDefaults.defaultFromAddress,
  defaultFromName: emailDefaults.defaultFromName,
  sendEmail: async (message) => {
    const stringifiedTo = getStringifiedToAddress(message)
    const res = `Email attempted without being configured. To: '${stringifiedTo}', Subject: '${message.subject}'`
    payload.logger.info({ msg: res })
    return Promise.resolve()
  },
})
```

--------------------------------------------------------------------------------

---[FILE: defaults.ts]---
Location: payload-main/packages/payload/src/email/defaults.ts

```typescript
import type { InitializedEmailAdapter } from './types.js'

export const emailDefaults: Pick<
  InitializedEmailAdapter,
  'defaultFromAddress' | 'defaultFromName'
> = {
  defaultFromAddress: 'info@payloadcms.com',
  defaultFromName: 'Payload',
}
```

--------------------------------------------------------------------------------

---[FILE: getStringifiedToAddress.ts]---
Location: payload-main/packages/payload/src/email/getStringifiedToAddress.ts

```typescript
import type { SendEmailOptions } from './types.js'

export const getStringifiedToAddress = (message: SendEmailOptions): string | undefined => {
  let stringifiedTo: string | undefined

  if (typeof message.to === 'string') {
    stringifiedTo = message.to
  } else if (Array.isArray(message.to)) {
    stringifiedTo = message.to
      .map((to) => {
        if (typeof to === 'string') {
          return to
        } else if (to.address) {
          return to.address
        }
        return ''
      })
      .join(', ')
  } else if (message.to?.address) {
    stringifiedTo = message.to.address
  }
  return stringifiedTo
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/email/types.ts

```typescript
import type { SendMailOptions as NodemailerSendMailOptions } from 'nodemailer'

import type { Payload } from '../types/index.js'

type Prettify<T> = {
  [K in keyof T]: T[K]
} & NonNullable<unknown>

/**
 * Options for sending an email. Allows access to the PayloadRequest object
 */
export type SendEmailOptions = Prettify<NodemailerSendMailOptions>

/**
 * Email adapter after it has been initialized. This is used internally by Payload.
 */
export type InitializedEmailAdapter<TSendEmailResponse = unknown> = ReturnType<
  EmailAdapter<TSendEmailResponse>
>

/**
 * Email adapter interface. Allows a generic type for the response of the sendEmail method.
 *
 * This is the interface to use if you are creating a new email adapter.
 */

export type EmailAdapter<TSendEmailResponse = unknown> = ({ payload }: { payload: Payload }) => {
  defaultFromAddress: string
  defaultFromName: string
  name: string
  sendEmail: (message: SendEmailOptions) => Promise<TSendEmailResponse>
}
```

--------------------------------------------------------------------------------

---[FILE: APIError.ts]---
Location: payload-main/packages/payload/src/errors/APIError.ts

```typescript
import { status as httpStatus } from 'http-status'

// This gets dynamically reassigned during compilation
export let APIErrorName = 'APIError'

class ExtendableError<TData extends object = { [key: string]: unknown }> extends Error {
  data: TData

  isOperational: boolean

  isPublic: boolean

  status: number

  constructor(message: string, status: number, data: TData, isPublic: boolean) {
    super(message, {
      // show data in cause
      cause: data,
    })
    APIErrorName = this.constructor.name
    this.name = this.constructor.name
    this.message = message
    this.status = status
    this.data = data
    this.isPublic = isPublic
    this.isOperational = true // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class APIError<
  TData extends null | object = { [key: string]: unknown } | null,
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
> extends ExtendableError<TData> {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {object} data - response data to be returned.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    data: TData = null!,
    isPublic?: boolean,
  ) {
    super(
      message,
      status,
      data,
      typeof isPublic === 'boolean' ? isPublic : status !== httpStatus.INTERNAL_SERVER_ERROR,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: AuthenticationError.ts]---
Location: payload-main/packages/payload/src/errors/AuthenticationError.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class AuthenticationError extends APIError {
  constructor(t?: TFunction, loginWithUsername?: boolean) {
    super(
      t
        ? `${loginWithUsername ? t('error:usernameOrPasswordIncorrect') : t('error:emailOrPasswordIncorrect')}`
        : en.translations.error.emailOrPasswordIncorrect,
      httpStatus.UNAUTHORIZED,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DuplicateCollection.ts]---
Location: payload-main/packages/payload/src/errors/DuplicateCollection.ts

```typescript
import { APIError } from './APIError.js'

export class DuplicateCollection extends APIError {
  constructor(propertyName: string, duplicate: string) {
    super(`Collection ${propertyName} already in use: "${duplicate}"`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DuplicateFieldName.ts]---
Location: payload-main/packages/payload/src/errors/DuplicateFieldName.ts

```typescript
import { APIError } from './APIError.js'

export class DuplicateFieldName extends APIError {
  constructor(fieldName: string) {
    super(
      `A field with the name '${fieldName}' was found multiple times on the same level. Field names must be unique.`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: DuplicateGlobal.ts]---
Location: payload-main/packages/payload/src/errors/DuplicateGlobal.ts

```typescript
import type { GlobalConfig } from '../globals/config/types.js'

import { APIError } from './APIError.js'

export class DuplicateGlobal extends APIError {
  constructor(config: GlobalConfig) {
    super(`Global label "${config.label}" is already in use`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ErrorDeletingFile.ts]---
Location: payload-main/packages/payload/src/errors/ErrorDeletingFile.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class ErrorDeletingFile extends APIError {
  constructor(t?: TFunction) {
    super(
      t ? t('error:deletingFile') : en.translations.error.deletingFile,
      httpStatus.INTERNAL_SERVER_ERROR,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: FileRetrievalError.ts]---
Location: payload-main/packages/payload/src/errors/FileRetrievalError.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class FileRetrievalError extends APIError {
  constructor(t?: TFunction, message?: string) {
    let msg = t ? t('error:problemUploadingFile') : 'There was a problem while retrieving the file.'

    if (message) {
      msg += ` ${message}`
    }
    super(msg, httpStatus.INTERNAL_SERVER_ERROR)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: FileUploadError.ts]---
Location: payload-main/packages/payload/src/errors/FileUploadError.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class FileUploadError extends APIError {
  constructor(t?: TFunction) {
    super(
      t ? t('error:problemUploadingFile') : en.translations.error.problemUploadingFile,
      httpStatus.BAD_REQUEST,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Forbidden.ts]---
Location: payload-main/packages/payload/src/errors/Forbidden.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class Forbidden extends APIError {
  constructor(t?: TFunction) {
    super(
      t ? t('error:notAllowedToPerformAction') : en.translations.error.notAllowedToPerformAction,
      httpStatus.FORBIDDEN,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/errors/index.ts

```typescript
export { APIError, APIErrorName } from './APIError.js'
export { AuthenticationError } from './AuthenticationError.js'
export { DuplicateCollection } from './DuplicateCollection.js'
export { DuplicateFieldName } from './DuplicateFieldName.js'
export { DuplicateGlobal } from './DuplicateGlobal.js'
export { ErrorDeletingFile } from './ErrorDeletingFile.js'
export { FileRetrievalError } from './FileRetrievalError.js'
export { FileUploadError } from './FileUploadError.js'
export { Forbidden } from './Forbidden.js'
export { InvalidConfiguration } from './InvalidConfiguration.js'
export { InvalidFieldName } from './InvalidFieldName.js'
export { InvalidFieldRelationship } from './InvalidFieldRelationship.js'
export { Locked } from './Locked.js'
export { LockedAuth } from './LockedAuth.js'
export { MissingCollectionLabel } from './MissingCollectionLabel.js'
export { MissingEditorProp } from './MissingEditorProp.js'
export { MissingFieldInputOptions } from './MissingFieldInputOptions.js'
export { MissingFieldType } from './MissingFieldType.js'
export { MissingFile } from './MissingFile.js'
export { NotFound } from './NotFound.js'
export { QueryError } from './QueryError.js'
export { ReservedFieldName } from './ReservedFieldName.js'
export { UnauthorizedError } from './UnauthorizedError.js'
export { UnverifiedEmail } from './UnverifiedEmail.js'
export { ValidationError, ValidationErrorName } from './ValidationError.js'
export type { ValidationFieldError } from './ValidationError.js'
```

--------------------------------------------------------------------------------

---[FILE: InvalidConfiguration.ts]---
Location: payload-main/packages/payload/src/errors/InvalidConfiguration.ts

```typescript
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class InvalidConfiguration extends APIError {
  constructor(message: string) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InvalidFieldJoin.ts]---
Location: payload-main/packages/payload/src/errors/InvalidFieldJoin.ts

```typescript
import type { JoinField } from '../fields/config/types.js'

import { APIError } from './APIError.js'

export class InvalidFieldJoin extends APIError {
  constructor(field: JoinField) {
    super(
      `Invalid join field ${field.name}. The config does not have a field '${field.on}' in collection '${field.collection}'.`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InvalidFieldName.ts]---
Location: payload-main/packages/payload/src/errors/InvalidFieldName.ts

```typescript
import type { FieldAffectingData } from '../fields/config/types.js'

import { APIError } from './APIError.js'

export class InvalidFieldName extends APIError {
  constructor(field: FieldAffectingData, fieldName: string) {
    super(
      `Field ${field.label} has invalid name '${fieldName}'. Field names can not include periods (.) and must be alphanumeric.`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InvalidFieldRelationship.ts]---
Location: payload-main/packages/payload/src/errors/InvalidFieldRelationship.ts

```typescript
import type { RelationshipField, UploadField } from '../fields/config/types.js'

import { APIError } from './APIError.js'

export class InvalidFieldRelationship extends APIError {
  constructor(field: RelationshipField | UploadField, relationship: string) {
    super(`Field ${field.label} has invalid relationship '${relationship}'.`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: InvalidSchema.ts]---
Location: payload-main/packages/payload/src/errors/InvalidSchema.ts

```typescript
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class InvalidSchema extends APIError {
  constructor(message: string, results: any) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, results)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: Locked.ts]---
Location: payload-main/packages/payload/src/errors/Locked.ts

```typescript
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class Locked extends APIError {
  constructor(message: string) {
    super(message, httpStatus.LOCKED)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LockedAuth.ts]---
Location: payload-main/packages/payload/src/errors/LockedAuth.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class LockedAuth extends APIError {
  constructor(t?: TFunction) {
    super(t ? t('error:userLocked') : en.translations.error.userLocked, httpStatus.UNAUTHORIZED)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MissingCollectionLabel.ts]---
Location: payload-main/packages/payload/src/errors/MissingCollectionLabel.ts

```typescript
import { APIError } from './APIError.js'

export class MissingCollectionLabel extends APIError {
  constructor() {
    super('payload.config.collection object is missing label')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MissingEditorProp.ts]---
Location: payload-main/packages/payload/src/errors/MissingEditorProp.ts

```typescript
import type { Field } from '../fields/config/types.js'

import { fieldAffectsData } from '../fields/config/types.js'
import { APIError } from './APIError.js'

export class MissingEditorProp extends APIError {
  constructor(field: Field) {
    super(
      `RichText field${fieldAffectsData(field) ? ` "${field.name}"` : ''} is missing the editor prop. For sub-richText fields, the editor props is required, as it would otherwise create infinite recursion.`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MissingFieldInputOptions.ts]---
Location: payload-main/packages/payload/src/errors/MissingFieldInputOptions.ts

```typescript
import type { RadioField, SelectField } from '../fields/config/types.js'

import { APIError } from './APIError.js'

export class MissingFieldInputOptions extends APIError {
  constructor(field: RadioField | SelectField) {
    super(`Field ${field.label} is missing options.`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MissingFieldType.ts]---
Location: payload-main/packages/payload/src/errors/MissingFieldType.ts

```typescript
import type { Field } from '../fields/config/types.js'

import { fieldAffectsData } from '../fields/config/types.js'
import { APIError } from './APIError.js'

export class MissingFieldType extends APIError {
  constructor(field: Field) {
    super(
      `Field${
        fieldAffectsData(field) ? ` "${field.name}"` : ''
      } is either missing a field type or it does not match an available field type`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: MissingFile.ts]---
Location: payload-main/packages/payload/src/errors/MissingFile.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class MissingFile extends APIError {
  constructor(t?: TFunction) {
    super(
      t ? t('error:noFilesUploaded') : en.translations.error.noFilesUploaded,
      httpStatus.BAD_REQUEST,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: NotFound.ts]---
Location: payload-main/packages/payload/src/errors/NotFound.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class NotFound extends APIError {
  constructor(t?: TFunction) {
    super(t ? t('general:notFound') : en.translations.general.notFound, httpStatus.NOT_FOUND)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: QueryError.ts]---
Location: payload-main/packages/payload/src/errors/QueryError.ts

```typescript
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class QueryError extends APIError<{ path: string }[]> {
  constructor(results: { path: string }[]) {
    const message = `The following path${results.length === 1 ? '' : 's'} cannot be queried:`

    super(
      `${message} ${results.map((err) => err.path).join(', ')}`,
      httpStatus.BAD_REQUEST,
      results,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ReservedFieldName.ts]---
Location: payload-main/packages/payload/src/errors/ReservedFieldName.ts

```typescript
import type { FieldAffectingData } from '../fields/config/types.js'

import { APIError } from './APIError.js'

export class ReservedFieldName extends APIError {
  constructor(field: FieldAffectingData, fieldName: string) {
    super(`Field ${field.label} has reserved name '${fieldName}'.`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: TimestampsRequired.ts]---
Location: payload-main/packages/payload/src/errors/TimestampsRequired.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'

import { APIError } from './APIError.js'

export class TimestampsRequired extends APIError {
  constructor(collection: CollectionConfig) {
    super(
      `Timestamps are required in the collection ${collection.slug} because you have opted in to Versions.`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/errors/types.ts

```typescript
export * from './index.js'

/**
 * Error names that can be thrown by Payload during runtime
 */
export type ErrorName =
  | 'APIError'
  | 'AuthenticationError'
  | 'ErrorDeletingFile'
  | 'FileRetrievalError'
  | 'FileUploadError'
  | 'Forbidden'
  | 'Locked'
  | 'LockedAuth'
  | 'MissingFile'
  | 'NotFound'
  | 'QueryError'
  | 'UnverifiedEmail'
  | 'ValidationError'
```

--------------------------------------------------------------------------------

---[FILE: UnauthorizedError.ts]---
Location: payload-main/packages/payload/src/errors/UnauthorizedError.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class UnauthorizedError extends APIError {
  constructor(t?: TFunction) {
    super(t ? t('error:unauthorized') : en.translations.error.unauthorized, httpStatus.UNAUTHORIZED)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: UnverifiedEmail.ts]---
Location: payload-main/packages/payload/src/errors/UnverifiedEmail.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import { APIError } from './APIError.js'

export class UnverifiedEmail extends APIError {
  constructor({ t }: { t?: TFunction }) {
    super(
      t ? t('error:unverifiedEmail') : en.translations.error.unverifiedEmail,
      httpStatus.FORBIDDEN,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: ValidationError.ts]---
Location: payload-main/packages/payload/src/errors/ValidationError.ts

```typescript
import type { TFunction } from '@payloadcms/translations'

import { en } from '@payloadcms/translations/languages/en'
import { status as httpStatus } from 'http-status'

import type { LabelFunction, StaticLabel } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { APIError } from './APIError.js'

// This gets dynamically reassigned during compilation
export let ValidationErrorName = 'ValidationError'

export type ValidationFieldError = {
  label?: LabelFunction | StaticLabel
  // The error message to display for this field
  message: string
  path: string
}

export class ValidationError extends APIError<{
  collection?: string
  errors: ValidationFieldError[]
  global?: string
}> {
  constructor(
    results: {
      collection?: string
      errors: ValidationFieldError[]
      global?: string
      id?: number | string
      /**
       *  req needs to be passed through (if you have one) in order to resolve label functions that may be part of the errors array
       */
      req?: Partial<PayloadRequest>
    },
    t?: TFunction,
  ) {
    const message = t
      ? t('error:followingFieldsInvalid', { count: results.errors.length })
      : results.errors.length === 1
        ? en.translations.error.followingFieldsInvalid_one
        : en.translations.error.followingFieldsInvalid_other

    const req = results.req
    // delete to avoid logging the whole req
    delete results['req']

    super(
      `${message} ${results.errors
        .map((f) => {
          if (f.label) {
            if (typeof f.label === 'function') {
              if (!req || !req.i18n || !req.t) {
                return f.path
              }

              return f.label({ i18n: req.i18n, t: req.t })
            }

            if (typeof f.label === 'object') {
              if (req?.i18n?.language) {
                return f.label[req.i18n.language]
              }

              return f.label[Object.keys(f.label)[0]!]
            }

            return f.label
          }

          return f.path
        })
        .join(', ')}`,
      httpStatus.BAD_REQUEST,
      results,
    )

    ValidationErrorName = this.constructor.name
  }
}
```

--------------------------------------------------------------------------------

---[FILE: internal.ts]---
Location: payload-main/packages/payload/src/exports/internal.ts

```typescript
/**
 * Modules exported here are not part of the public API and are subject to change without notice and without a major version bump.
 */

export { getEntityPermissions } from '../utilities/getEntityPermissions/getEntityPermissions.js'
export { sanitizePermissions } from '../utilities/sanitizePermissions.js'
```

--------------------------------------------------------------------------------

---[FILE: node.ts]---
Location: payload-main/packages/payload/src/exports/node.ts

```typescript
/**
 * WARNING: This file contains exports that can only be safely used in Node environments.
 */

export { generateTypes } from '../bin/generateTypes.js'
export { loadEnv } from '../bin/loadEnv.js'
export { findConfig } from '../config/find.js'
```

--------------------------------------------------------------------------------

````
