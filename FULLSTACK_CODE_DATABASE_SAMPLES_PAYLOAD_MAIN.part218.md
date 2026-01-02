---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 218
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 218 of 695)

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

---[FILE: checkDocumentLockStatus.ts]---
Location: payload-main/packages/payload/src/utilities/checkDocumentLockStatus.ts

```typescript
import type { TypeWithID } from '../collections/config/types.js'
import type { PaginatedDocs } from '../database/types.js'
import type { JsonObject, PayloadRequest } from '../types/index.js'

import { Locked } from '../errors/index.js'
import { lockedDocumentsCollectionSlug } from '../locked-documents/config.js'

type CheckDocumentLockStatusArgs = {
  collectionSlug?: string
  globalSlug?: string
  id?: number | string
  lockDurationDefault?: number
  lockErrorMessage?: string
  overrideLock?: boolean
  req: PayloadRequest
}

export const checkDocumentLockStatus = async ({
  id,
  collectionSlug,
  globalSlug,
  lockDurationDefault = 300, // Default 5 minutes in seconds
  lockErrorMessage,
  overrideLock = true,
  req,
}: CheckDocumentLockStatusArgs): Promise<void> => {
  const { payload } = req

  // Retrieve the lockDocuments property for either collection or global
  const lockDocumentsProp = collectionSlug
    ? payload.collections?.[collectionSlug]?.config?.lockDocuments
    : payload.config?.globals?.find((g) => g.slug === globalSlug)?.lockDocuments

  const isLockingEnabled = lockDocumentsProp !== false

  let lockedDocumentQuery = {}

  if (collectionSlug) {
    lockedDocumentQuery = {
      and: [
        { 'document.relationTo': { equals: collectionSlug } },
        { 'document.value': { equals: id } },
      ],
    }
  } else if (globalSlug) {
    lockedDocumentQuery = { globalSlug: { equals: globalSlug } }
  } else {
    throw new Error('Either collectionSlug or globalSlug must be provided.')
  }

  if (!isLockingEnabled) {
    return
  }

  // Only perform lock checks if overrideLock is false and locking is enabled
  if (!overrideLock) {
    const defaultLockErrorMessage = collectionSlug
      ? `Document with ID ${id} is currently locked by another user and cannot be modified.`
      : `Global document with slug "${globalSlug}" is currently locked by another user and cannot be modified.`

    const finalLockErrorMessage = lockErrorMessage || defaultLockErrorMessage

    const lockedDocumentResult: PaginatedDocs<JsonObject & TypeWithID> = await payload.db.find({
      collection: lockedDocumentsCollectionSlug,
      limit: 1,
      pagination: false,
      sort: '-updatedAt',
      where: lockedDocumentQuery,
    })

    // If there's a locked document, check lock conditions
    const lockedDoc = lockedDocumentResult?.docs[0]
    if (lockedDoc) {
      const lastEditedAt = new Date(lockedDoc?.updatedAt).getTime()
      const now = new Date().getTime()

      const lockDuration =
        typeof lockDocumentsProp === 'object' ? lockDocumentsProp.duration : lockDurationDefault

      const lockDurationInMilliseconds = lockDuration * 1000
      const currentUserId = req.user?.id

      // document is locked by another user and the lock hasn't expired
      if (
        lockedDoc.user?.value !== currentUserId &&
        now - lastEditedAt <= lockDurationInMilliseconds
      ) {
        throw new Locked(finalLockErrorMessage)
      }
    }
  }

  // Perform the delete operation regardless of overrideLock status
  await payload.db.deleteMany({
    collection: lockedDocumentsCollectionSlug,
    // Not passing req fails on postgres
    req: payload.db.name === 'mongoose' ? undefined : req,
    where: lockedDocumentQuery,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: combineWhereConstraints.spec.ts]---
Location: payload-main/packages/payload/src/utilities/combineWhereConstraints.spec.ts

```typescript
import { Where } from '../types/index.js'
import { combineWhereConstraints } from './combineWhereConstraints.js'

describe('combineWhereConstraints', () => {
  it('should merge matching constraint keys', async () => {
    const constraint: Where = {
      test: {
        equals: 'value',
      },
    }

    // should merge and queries
    const andConstraint: Where = {
      and: [constraint],
    }
    expect(combineWhereConstraints([andConstraint], 'and')).toEqual(andConstraint)
    // should merge multiple and queries
    expect(combineWhereConstraints([andConstraint, andConstraint], 'and')).toEqual({
      and: [constraint, constraint],
    })

    // should merge or queries
    const orConstraint: Where = {
      or: [constraint],
    }
    expect(combineWhereConstraints([orConstraint], 'or')).toEqual(orConstraint)
    // should merge multiple or queries
    expect(combineWhereConstraints([orConstraint, orConstraint], 'or')).toEqual({
      or: [constraint, constraint],
    })
  })

  it('should push mismatching constraints keys into `as` key', async () => {
    const constraint: Where = {
      test: {
        equals: 'value',
      },
    }

    // should push `and` into `or` key
    const andConstraint: Where = {
      and: [constraint],
    }
    expect(combineWhereConstraints([andConstraint], 'or')).toEqual({
      or: [andConstraint],
    })

    // should push `or` into `and` key
    const orConstraint: Where = {
      or: [constraint],
    }
    expect(combineWhereConstraints([orConstraint], 'and')).toEqual({
      and: [orConstraint],
    })

    // should merge `and` but push `or` into `and` key
    expect(combineWhereConstraints([andConstraint, orConstraint], 'and')).toEqual({
      and: [constraint, orConstraint],
    })
  })

  it('should push non and/or constraint key into `as` key', async () => {
    const basicConstraint: Where = {
      test: {
        equals: 'value',
      },
    }

    expect(combineWhereConstraints([basicConstraint], 'and')).toEqual({
      and: [basicConstraint],
    })
    expect(combineWhereConstraints([basicConstraint], 'or')).toEqual({
      or: [basicConstraint],
    })
  })

  it('should return an empty object when no constraints are provided', async () => {
    expect(combineWhereConstraints([], 'and')).toEqual({})
    expect(combineWhereConstraints([], 'or')).toEqual({})
  })

  it('should return an empty object when all constraints are empty', async () => {
    expect(combineWhereConstraints([{}, {}, undefined], 'and')).toEqual({})
    expect(combineWhereConstraints([{}, {}, undefined], 'or')).toEqual({})
  })
})
```

--------------------------------------------------------------------------------

---[FILE: combineWhereConstraints.ts]---
Location: payload-main/packages/payload/src/utilities/combineWhereConstraints.ts

```typescript
import type { Where } from '../types/index.js'

export function combineWhereConstraints(
  constraints: Array<undefined | Where>,
  as: 'and' | 'or' = 'and',
): Where {
  if (constraints.length === 0) {
    return {}
  }

  const reducedConstraints = constraints.reduce<Partial<Where>>(
    (acc: Partial<Where>, constraint) => {
      if (constraint && typeof constraint === 'object' && Object.keys(constraint).length > 0) {
        if (as in constraint) {
          // merge the objects under the shared key
          acc[as] = [...(acc[as] as Where[]), ...(constraint[as] as Where[])]
        } else {
          // the constraint does not share the key
          acc[as]?.push(constraint)
        }
      }

      return acc
    },
    { [as]: [] } satisfies Where,
  )

  if (reducedConstraints[as]?.length === 0) {
    // If there are no constraints, return an empty object
    return {}
  }

  return reducedConstraints as Where
}
```

--------------------------------------------------------------------------------

---[FILE: commitTransaction.ts]---
Location: payload-main/packages/payload/src/utilities/commitTransaction.ts

```typescript
import type { MarkRequired } from 'ts-essentials'

import type { PayloadRequest } from '../types/index.js'

/**
 * complete a transaction calling adapter db.commitTransaction and delete the transactionID from req
 */
export async function commitTransaction(
  req: MarkRequired<Partial<PayloadRequest>, 'payload'>,
): Promise<void> {
  const { payload, transactionID } = req

  await payload.db.commitTransaction(transactionID!)
  delete req.transactionID
}
```

--------------------------------------------------------------------------------

---[FILE: configToJSONSchema.spec.ts]---
Location: payload-main/packages/payload/src/utilities/configToJSONSchema.spec.ts

```typescript
import type { JSONSchema4 } from 'json-schema'

import type { Config } from '../config/types.js'

import { sanitizeConfig } from '../config/sanitize.js'
import { configToJSONSchema } from './configToJSONSchema.js'
import type { Block, BlocksField, RichTextField } from '../fields/config/types.js'

describe('configToJSONSchema', () => {
  it('should handle optional arrays with required fields', async () => {
    // @ts-expect-error
    const config: Config = {
      collections: [
        {
          slug: 'test',
          fields: [
            {
              name: 'someRequiredField',
              type: 'array',
              fields: [
                {
                  name: 'someRequiredField',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
          timestamps: false,
        },
      ],
    }

    const sanitizedConfig = await sanitizeConfig(config)
    const schema = configToJSONSchema(sanitizedConfig, 'text')

    expect(schema?.definitions?.test).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
        },
        someRequiredField: {
          type: ['array', 'null'],
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              id: {
                type: ['string', 'null'],
              },
              someRequiredField: {
                type: 'string',
              },
            },
            required: ['someRequiredField'],
          },
        },
      },
      required: ['id'],
      title: 'Test',
    })
  })

  it('should handle block fields with no blocks', async () => {
    // @ts-expect-error
    const config: Config = {
      collections: [
        {
          slug: 'test',
          fields: [
            {
              name: 'blockField',
              type: 'blocks',
              blocks: [],
            },
            {
              name: 'blockFieldRequired',
              type: 'blocks',
              blocks: [],
              required: true,
            },
            {
              name: 'blockFieldWithFields',
              type: 'blocks',
              blocks: [
                {
                  slug: 'test',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
            {
              name: 'blockFieldWithFieldsRequired',
              type: 'blocks',
              blocks: [
                {
                  slug: 'test',
                  fields: [
                    {
                      name: 'field',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
          timestamps: false,
        },
      ],
    }

    const sanitizedConfig = await sanitizeConfig(config)
    const schema = configToJSONSchema(sanitizedConfig, 'text')

    expect(schema?.definitions?.test).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
        },
        blockField: {
          type: ['array', 'null'],
          items: {},
        },
        blockFieldRequired: {
          type: 'array',
          items: {},
        },
        blockFieldWithFields: {
          type: ['array', 'null'],
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: {
                    type: ['string', 'null'],
                  },
                  blockName: {
                    type: ['string', 'null'],
                  },
                  blockType: {
                    const: 'test',
                  },
                  field: {
                    type: ['string', 'null'],
                  },
                },
                required: ['blockType'],
              },
            ],
          },
        },
        blockFieldWithFieldsRequired: {
          type: ['array', 'null'],
          items: {
            oneOf: [
              {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: {
                    type: ['string', 'null'],
                  },
                  blockName: {
                    type: ['string', 'null'],
                  },
                  blockType: {
                    const: 'test',
                  },
                  field: {
                    type: 'string',
                  },
                },
                required: ['blockType', 'field'],
              },
            ],
          },
        },
      },
      required: ['id', 'blockFieldRequired'],
      title: 'Test',
    })
  })

  it('should handle tabs and named tabs with required fields', async () => {
    // @ts-expect-error
    const config: Config = {
      collections: [
        {
          slug: 'test',
          fields: [
            {
              type: 'tabs',
              tabs: [
                {
                  fields: [
                    {
                      name: 'fieldInUnnamedTab',
                      type: 'text',
                    },
                  ],
                  label: 'unnamedTab',
                },
                {
                  name: 'namedTab',
                  fields: [
                    {
                      name: 'fieldInNamedTab',
                      type: 'text',
                    },
                  ],
                  label: 'namedTab',
                },
                {
                  name: 'namedTabWithRequired',
                  fields: [
                    {
                      name: 'fieldInNamedTab',
                      type: 'text',
                      required: true,
                    },
                  ],
                  label: 'namedTabWithRequired',
                },
              ],
            },
          ],
          timestamps: false,
        },
      ],
    }

    const sanitizedConfig = await sanitizeConfig(config)
    const schema = configToJSONSchema(sanitizedConfig, 'text')

    expect(schema?.definitions?.test).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
        },
        fieldInUnnamedTab: {
          type: ['string', 'null'],
        },
        namedTab: {
          type: 'object',
          additionalProperties: false,
          properties: {
            fieldInNamedTab: {
              type: ['string', 'null'],
            },
          },
          required: [],
        },
        namedTabWithRequired: {
          type: 'object',
          additionalProperties: false,
          properties: {
            fieldInNamedTab: {
              type: 'string',
            },
          },
          required: ['fieldInNamedTab'],
        },
      },
      required: ['id', 'namedTabWithRequired'],
      title: 'Test',
    })
  })

  it('should handle custom typescript schema and JSON field schema', async () => {
    const customSchema: JSONSchema4 = {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
        required: ['id'],
      },
    }

    const config: Partial<Config> = {
      collections: [
        {
          slug: 'test',
          fields: [
            {
              name: 'withCustom',
              type: 'text',
              typescriptSchema: [() => customSchema],
            },
            {
              name: 'jsonWithSchema',
              type: 'json',
              jsonSchema: {
                fileMatch: ['a://b/foo.json'],
                schema: customSchema,
                uri: 'a://b/foo.json',
              },
            },
          ],
          timestamps: false,
        },
      ],
    }

    const sanitizedConfig = await sanitizeConfig(config as Config)
    const schema = configToJSONSchema(sanitizedConfig, 'text')

    expect(schema?.definitions?.test).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
        },
        jsonWithSchema: customSchema,
        withCustom: customSchema,
      },
      required: ['id'],
      title: 'Test',
    })
  })

  it('should handle same block object being referenced in both collection and config.blocks', async () => {
    const sharedBlock: Block = {
      slug: 'sharedBlock',
      interfaceName: 'SharedBlock',
      fields: [
        {
          name: 'richText',
          type: 'richText',
          editor: () => {
            // stub rich text editor
            return {
              CellComponent: '',
              FieldComponent: '',
              validate: () => true,
            }
          },
        },
      ],
    }

    // @ts-expect-error
    const config: Config = {
      blocks: [sharedBlock],
      collections: [
        {
          slug: 'test',
          fields: [
            {
              name: 'someBlockField',
              type: 'blocks',
              blocks: [sharedBlock],
            },
          ],
          timestamps: false,
        },
      ],
    }

    // Ensure both rich text editor are sanitized
    const sanitizedConfig = await sanitizeConfig(config)
    expect(typeof (sanitizedConfig?.blocks?.[0]?.fields?.[0] as RichTextField)?.editor).toBe(
      'object',
    )
    expect(
      typeof (
        (sanitizedConfig.collections[0].fields[0] as BlocksField)?.blocks?.[0]
          ?.fields?.[0] as RichTextField
      )?.editor,
    ).toBe('object')

    const schema = configToJSONSchema(sanitizedConfig, 'text')

    expect(schema?.definitions?.test).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      title: 'Test',
      properties: {
        id: {
          type: 'string',
        },
        someBlockField: {
          type: ['array', 'null'],
          items: {
            oneOf: [
              {
                $ref: '#/definitions/SharedBlock',
              },
            ],
          },
        },
      },
      required: ['id'],
    })

    expect(schema?.definitions?.SharedBlock).toBeDefined()
  })

  it('should allow overriding required to false', async () => {
    // @ts-expect-error
    const config: Config = {
      collections: [
        {
          slug: 'test',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'test',
              typescriptSchema: [
                () => ({
                  type: 'string',
                  required: false,
                }),
              ],
            },
          ],
          timestamps: false,
        },
      ],
    }

    const sanitizedConfig = await sanitizeConfig(config)
    const schema = configToJSONSchema(sanitizedConfig, 'text')

    // @ts-expect-error
    expect(schema.definitions.test.properties.title.required).toStrictEqual(false)
  })
})
```

--------------------------------------------------------------------------------

````
