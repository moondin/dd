---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 588
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 588 of 695)

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

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Data/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const dataHooksSlug = 'data-hooks'

export const DataHooks: CollectionConfig = {
  slug: dataHooksSlug,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  hooks: {
    beforeOperation: [
      ({ context, collection, args }) => {
        context['collection_beforeOperation_collection'] = JSON.stringify(collection)

        return args
      },
    ],
    beforeChange: [
      ({ context, data, collection }) => {
        context['collection_beforeChange_collection'] = JSON.stringify(collection)

        return data
      },
    ],
    afterChange: [
      ({ context, collection }) => {
        context['collection_afterChange_collection'] = JSON.stringify(collection)
      },
    ],
    beforeRead: [
      ({ context, collection }) => {
        context['collection_beforeRead_collection'] = JSON.stringify(collection)
      },
    ],
    afterRead: [
      ({ context, collection, doc }) => {
        context['collection_afterRead_collection'] = JSON.stringify(collection)

        return doc
      },
    ],
    afterOperation: [
      ({ args, result, collection }) => {
        if (args.req && args.req.context) {
          args.req.context['collection_afterOperation_collection'] = JSON.stringify(collection)
        }

        if (args.req && args.req.context) {
          for (const contextKey in args.req.context) {
            if (contextKey.startsWith('collection_')) {
              result[contextKey] = args.req.context[contextKey]
            }
          }
        }
        return result
      },
    ],
  },
  fields: [
    {
      name: 'field_collectionAndField',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ collection, field, context, value }) => {
            context['field_beforeChange_CollectionAndField'] =
              JSON.stringify(collection) + JSON.stringify(field)

            return value
          },
        ],
        afterRead: [
          ({ collection, field, context }) => {
            return (
              (context['field_beforeChange_CollectionAndField'] as string) +
              JSON.stringify(collection) +
              JSON.stringify(field)
            )
          },
        ],
      },
    },
    {
      name: 'collection_beforeOperation_collection',
      type: 'text',
    },
    {
      name: 'collection_beforeChange_collection',
      type: 'text',
    },
    {
      name: 'collection_afterChange_collection',
      type: 'text',
    },
    {
      name: 'collection_beforeRead_collection',
      type: 'text',
    },
    {
      name: 'collection_afterRead_collection',
      type: 'text',
    },
    {
      name: 'collection_afterOperation_collection',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/FieldPaths/index.ts

```typescript
import type { CollectionConfig, Field, FieldHook, FieldHookArgs } from 'payload'

import { fieldPathsSlug } from '../../shared.js'

const attachPathsToDoc = (
  label: string,
  { value, path, schemaPath, indexPath, data }: FieldHookArgs,
): any => {
  if (!data) {
    data = {}
  }

  // attach values to data for `beforeRead` and `beforeChange` hooks
  data[`${label}_FieldPaths`] = {
    path,
    schemaPath,
    indexPath,
  }

  return value
}

const attachHooks = (
  fieldIdentifier: string,
): {
  afterRead: FieldHook[]
  beforeChange: FieldHook[]
  beforeDuplicate: FieldHook[]
  beforeValidate: FieldHook[]
} => ({
  beforeValidate: [(args) => attachPathsToDoc(`${fieldIdentifier}_beforeValidate`, args)],
  beforeChange: [(args) => attachPathsToDoc(`${fieldIdentifier}_beforeChange`, args)],
  afterRead: [(args) => attachPathsToDoc(`${fieldIdentifier}_afterRead`, args)],
  beforeDuplicate: [(args) => attachPathsToDoc(`${fieldIdentifier}_beforeDuplicate`, args)],
})

const createFields = (fieldIdentifiers: string[]): Field[] =>
  fieldIdentifiers.reduce((acc, fieldIdentifier) => {
    return [
      ...acc,
      {
        name: `${fieldIdentifier}_beforeValidate_FieldPaths`,
        type: 'json',
      },
      {
        name: `${fieldIdentifier}_beforeChange_FieldPaths`,
        type: 'json',
      },
      {
        name: `${fieldIdentifier}_afterRead_FieldPaths`,
        type: 'json',
      },
      {
        name: `${fieldIdentifier}_beforeDuplicate_FieldPaths`,
        type: 'json',
      },
    ]
  }, [] as Field[])

export const FieldPaths: CollectionConfig = {
  slug: fieldPathsSlug,
  fields: [
    {
      // path: 'topLevelNamedField'
      // schemaPath: 'topLevelNamedField'
      // indexPath: ''
      name: 'topLevelNamedField',
      type: 'text',
      hooks: attachHooks('topLevelNamedField'),
    },
    {
      // path: 'array'
      // schemaPath: 'array'
      // indexPath: ''
      name: 'array',
      type: 'array',
      fields: [
        {
          // path: 'array.[n].fieldWithinArray'
          // schemaPath: 'array.fieldWithinArray'
          // indexPath: ''
          name: 'fieldWithinArray',
          type: 'text',
          hooks: attachHooks('fieldWithinArray'),
        },
        {
          // path: 'array.[n].nestedArray'
          // schemaPath: 'array.nestedArray'
          // indexPath: ''
          name: 'nestedArray',
          type: 'array',
          fields: [
            {
              // path: 'array.[n].nestedArray.[n].fieldWithinNestedArray'
              // schemaPath: 'array.nestedArray.fieldWithinNestedArray'
              // indexPath: ''
              name: 'fieldWithinNestedArray',
              type: 'text',
              hooks: attachHooks('fieldWithinNestedArray'),
            },
          ],
        },
        {
          // path: 'array.[n]._index-2'
          // schemaPath: 'array._index-2'
          // indexPath: ''
          type: 'row',
          fields: [
            {
              // path: 'array.[n].fieldWithinRowWithinArray'
              // schemaPath: 'array._index-2.fieldWithinRowWithinArray'
              // indexPath: ''
              name: 'fieldWithinRowWithinArray',
              type: 'text',
              hooks: attachHooks('fieldWithinRowWithinArray'),
            },
          ],
        },
      ],
    },
    {
      // path: '_index-2'
      // schemaPath: '_index-2'
      // indexPath: '2'
      type: 'row',
      fields: [
        {
          // path: 'fieldWithinRow'
          // schemaPath: '_index-2.fieldWithinRow'
          // indexPath: ''
          name: 'fieldWithinRow',
          type: 'text',
          hooks: attachHooks('fieldWithinRow'),
        },
      ],
    },
    {
      // path: '_index-3'
      // schemaPath: '_index-3'
      // indexPath: '3'
      type: 'tabs',
      tabs: [
        {
          // path: '_index-3-0'
          // schemaPath: '_index-3-0'
          // indexPath: '3-0'
          label: 'Unnamed Tab',
          fields: [
            {
              // path: 'fieldWithinUnnamedTab'
              // schemaPath: '_index-3-0.fieldWithinUnnamedTab'
              // indexPath: ''
              name: 'fieldWithinUnnamedTab',
              type: 'text',
              hooks: attachHooks('fieldWithinUnnamedTab'),
            },
            {
              // path: '_index-3-0-1'
              // schemaPath: '_index-3-0-1'
              // indexPath: '3-0-1'
              type: 'tabs',
              tabs: [
                {
                  // path: '_index-3-0-1-0'
                  // schemaPath: '_index-3-0-1-0'
                  // indexPath: '3-0-1-0'
                  label: 'Nested Unnamed Tab',
                  fields: [
                    {
                      // path: 'fieldWithinNestedUnnamedTab'
                      // schemaPath: '_index-3-0-1-0.fieldWithinNestedUnnamedTab'
                      // indexPath: ''
                      name: 'fieldWithinNestedUnnamedTab',
                      type: 'text',
                      hooks: attachHooks('fieldWithinNestedUnnamedTab'),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // path: 'namedTab'
          // schemaPath: '_index-3.namedTab'
          // indexPath: ''
          label: 'Named Tab',
          name: 'namedTab',
          fields: [
            {
              // path: 'namedTab.fieldWithinNamedTab'
              // schemaPath: '_index-3.namedTab.fieldWithinNamedTab'
              // indexPath: ''
              name: 'fieldWithinNamedTab',
              type: 'text',
              hooks: attachHooks('fieldWithinNamedTab'),
            },
          ],
        },
      ],
    },
    // create fields for the hooks to save data to
    ...createFields([
      'topLevelNamedField',
      'fieldWithinArray',
      'fieldWithinNestedArray',
      'fieldWithinRowWithinArray',
      'fieldWithinRow',
      'fieldWithinUnnamedTab',
      'fieldWithinNestedUnnamedTab',
      'fieldWithinNamedTab',
    ]),
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Hook/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const hooksSlug = 'hooks'
const Hooks: CollectionConfig = {
  slug: hooksSlug,
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  hooks: {
    beforeOperation: [
      ({ operation, req }) => {
        if (
          typeof req.payload.db.beginTransaction === 'function' &&
          !req.transactionID &&
          ['create', 'delete', 'update'].includes(operation)
        ) {
          throw new Error('transactionID is missing in beforeOperation hook')
        }
      },
    ],
    beforeValidate: [({ data }) => validateHookOrder('collectionBeforeValidate', data)],
    beforeChange: [({ data }) => validateHookOrder('collectionBeforeChange', data)],
    afterChange: [
      ({ doc, previousDoc }) => {
        if (!previousDoc) {
          throw new Error('previousDoc is missing in afterChange hook')
        }
        return validateHookOrder('collectionAfterChange', doc)
      },
    ],
    beforeRead: [({ doc }) => validateHookOrder('collectionBeforeRead', doc)],
    afterRead: [({ doc }) => validateHookOrder('collectionAfterRead', doc)],
  },
  fields: [
    {
      name: 'fieldBeforeValidate',
      type: 'checkbox',
      hooks: {
        beforeValidate: [
          ({ data }) => {
            data.fieldBeforeValidate = true
            validateHookOrder('fieldBeforeValidate', data)
            return true
          },
        ],
      },
    },
    {
      name: 'fieldBeforeChange',
      type: 'checkbox',
      hooks: {
        beforeChange: [
          ({ data, operation, previousSiblingDoc, previousValue }) => {
            if (operation === 'update') {
              if (typeof previousValue === 'undefined') {
                throw new Error('previousValue is missing in beforeChange hook')
              }
              if (!previousSiblingDoc) {
                throw new Error('previousSiblingDoc is missing in beforeChange hook')
              }
            }
            data.fieldBeforeChange = true
            validateHookOrder('fieldBeforeChange', data)
            return true
          },
        ],
      },
    },
    {
      name: 'fieldAfterChange',
      type: 'checkbox',
      hooks: {
        afterChange: [
          ({ data, previousDoc, previousSiblingDoc }) => {
            data.fieldAfterChange = true
            if (!previousDoc) {
              throw new Error('previousDoc is missing in afterChange hook')
            }
            if (!previousSiblingDoc) {
              throw new Error('previousSiblingDoc is missing in afterChange hook')
            }
            validateHookOrder('fieldAfterChange', data)
            return true
          },
        ],
      },
    },
    {
      name: 'fieldAfterRead',
      type: 'checkbox',
      hooks: {
        afterRead: [
          ({ data }) => {
            data.fieldAfterRead = true
            validateHookOrder('fieldAfterRead', data)
            return true
          },
        ],
      },
    },
    {
      name: 'collectionBeforeValidate',
      type: 'checkbox',
    },
    {
      name: 'collectionBeforeChange',
      type: 'checkbox',
    },
    {
      name: 'collectionAfterChange',
      type: 'checkbox',
    },
    {
      name: 'collectionBeforeRead',
      type: 'checkbox',
    },
    {
      name: 'collectionAfterRead',
      type: 'checkbox',
    },
  ],
}

const writeHooksOrder = [
  'fieldBeforeValidate',
  'collectionBeforeValidate',
  'collectionBeforeChange',
  'fieldBeforeChange',
  'fieldAfterRead',
  'collectionAfterRead',
  'fieldAfterChange',
  'collectionAfterChange',
]

const validateHookOrder = (check: string, data) => {
  let hasMatched
  if (check === 'collectionBeforeRead') {
    data.collectionBeforeRead = true
  }
  writeHooksOrder.forEach((hook) => {
    if (hook === check) {
      data[check] = true
      hasMatched = true
    } else if ((!hasMatched && !data[hook]) || (hasMatched && data[hook])) {
      // throw new Error(`${check} called before ${hook}`);
    }
  })
  return data
}

export default Hooks
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/NestedAfterChangeHook/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
export const nestedAfterChangeHooksSlug = 'nested-after-change-hooks'

const NestedAfterChangeHooks: CollectionConfig = {
  slug: nestedAfterChangeHooksSlug,
  fields: [
    {
      type: 'text',
      name: 'text',
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          type: 'array',
          name: 'array',
          fields: [
            {
              type: 'text',
              name: 'nestedAfterChange',
              hooks: {
                afterChange: [
                  ({ previousValue, operation }) => {
                    if (operation === 'update' && typeof previousValue === 'undefined') {
                      throw new Error('previousValue is missing in nested beforeChange hook')
                    }
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'lexical',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: 'nestedBlock',
                fields: [
                  {
                    type: 'text',
                    name: 'nestedAfterChange',
                    hooks: {
                      afterChange: [
                        ({ previousValue, operation }) => {
                          if (operation === 'update' && typeof previousValue === 'undefined') {
                            throw new Error('previousValue is missing in nested beforeChange hook')
                          }
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          }),
          LinkFeature({
            fields: [
              {
                type: 'blocks',
                name: 'linkBlocks',
                blocks: [
                  {
                    slug: 'nestedLinkBlock',
                    fields: [
                      {
                        name: 'nestedRelationship',
                        type: 'relationship',
                        relationTo: 'relations',
                        hooks: {
                          afterChange: [
                            ({ previousValue, operation }) => {
                              if (operation === 'update' && typeof previousValue === 'undefined') {
                                throw new Error(
                                  'previousValue is missing in nested beforeChange hook',
                                )
                              }
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
}

export default NestedAfterChangeHooks
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/NestedAfterReadHooks/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { relationsSlug } from '../Relations/index.js'

export const nestedAfterReadHooksSlug = 'nested-after-read-hooks'

export const generatedAfterReadText = 'hello'

const NestedAfterReadHooks: CollectionConfig = {
  slug: nestedAfterReadHooksSlug,
  fields: [
    {
      type: 'text',
      name: 'text',
    },
    {
      type: 'group',
      name: 'group',
      fields: [
        {
          type: 'array',
          name: 'array',
          fields: [
            {
              type: 'text',
              name: 'input',
            },
            {
              type: 'text',
              name: 'afterRead',
              hooks: {
                afterRead: [
                  (): string => {
                    return generatedAfterReadText
                  },
                ],
              },
            },
            {
              name: 'shouldPopulate',
              type: 'relationship',
              relationTo: relationsSlug,
            },
          ],
        },
        {
          type: 'group',
          name: 'subGroup',
          fields: [
            {
              name: 'afterRead',
              type: 'text',
              hooks: {
                afterRead: [
                  (): string => {
                    return generatedAfterReadText
                  },
                ],
              },
            },
            {
              name: 'shouldPopulate',
              type: 'relationship',
              relationTo: relationsSlug,
            },
          ],
        },
      ],
    },
  ],
}

export default NestedAfterReadHooks
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Relations/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const relationsSlug = 'relations'

const Relations: CollectionConfig = {
  slug: relationsSlug,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default Relations
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Transform/index.ts

```typescript
import type { CollectionConfig } from 'payload'

const validateFieldTransformAction = (hook: string, value) => {
  if (value !== undefined && value !== null && !Array.isArray(value)) {
    console.error(hook, value)
    throw new Error(
      'Field transformAction should convert value to array [x, y] and not { coordinates: [x, y] }',
    )
  }
  return value
}
export const transformSlug = 'transforms'
const TransformHooks: CollectionConfig = {
  slug: transformSlug,
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'transform',
      type: 'point',
      hooks: {
        beforeValidate: [({ value }) => validateFieldTransformAction('beforeValidate', value)],
        beforeChange: [({ value }) => validateFieldTransformAction('beforeChange', value)],
        afterChange: [({ value }) => validateFieldTransformAction('afterChange', value)],
        afterRead: [({ value }) => validateFieldTransformAction('afterRead', value)],
      },
    },
    {
      name: 'localizedTransform',
      type: 'point',
      localized: true,
      hooks: {
        beforeValidate: [({ value }) => validateFieldTransformAction('beforeValidate', value)],
        beforeChange: [({ value }) => validateFieldTransformAction('beforeChange', value)],
        afterChange: [({ value }) => validateFieldTransformAction('afterChange', value)],
        afterRead: [({ value }) => validateFieldTransformAction('afterRead', value)],
      },
    },
  ],
  hooks: {
    beforeRead: [(operation) => operation.doc],
    beforeChange: [
      (operation) => {
        operation.data.beforeChange = !operation.data.location?.coordinates
        return operation.data
      },
    ],
    afterRead: [
      (operation) => {
        const { doc } = operation
        doc.afterReadHook = !doc.location?.coordinates
        return doc
      },
    ],
    afterChange: [
      (operation) => {
        const { doc } = operation
        doc.afterChangeHook = !doc.location?.coordinates
        return doc
      },
    ],
    afterDelete: [
      (operation) => {
        const { doc } = operation
        operation.doc.afterDeleteHook = !doc.location?.coordinates
        return doc
      },
    ],
  },
}

export default TransformHooks
```

--------------------------------------------------------------------------------

---[FILE: afterLoginHook.ts]---
Location: payload-main/test/hooks/collections/Users/afterLoginHook.ts

```typescript
import type { CollectionAfterLoginHook } from 'payload'

export const afterLoginHook: CollectionAfterLoginHook = async ({ req, user }) => {
  return req.payload.update({
    id: user.id,
    collection: 'hooks-users',
    data: {
      afterLoginHook: true,
    },
    req,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Users/index.ts

```typescript
import type { BeforeLoginHook, CollectionConfig, Payload } from 'payload'

import { AuthenticationError } from 'payload'

import { devUser, regularUser } from '../../../credentials.js'
import { afterLoginHook } from './afterLoginHook.js'
import { meHook } from './meHook.js'
import { refreshHook } from './refreshHook.js'

const beforeLoginHook: BeforeLoginHook = ({ req, user }) => {
  const isAdmin = user.roles.includes('admin') ? user : undefined
  if (!isAdmin) {
    throw new AuthenticationError(req.t)
  }
  return user
}

export const seedHooksUsers = async (payload: Payload) => {
  await payload.create({
    collection: hooksUsersSlug,
    data: devUser,
  })
  await payload.create({
    collection: hooksUsersSlug,
    data: regularUser,
  })
}

export const hooksUsersSlug = 'hooks-users'
const Users: CollectionConfig = {
  slug: hooksUsersSlug,
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      label: 'Role',
      options: ['admin', 'user'],
      required: true,
      saveToJWT: true,
    },
    {
      name: 'afterLoginHook',
      type: 'checkbox',
    },
  ],
  hooks: {
    me: [meHook],
    refresh: [refreshHook],
    afterLogin: [afterLoginHook],
    beforeLogin: [beforeLoginHook],
  },
}

export default Users
```

--------------------------------------------------------------------------------

---[FILE: meHook.ts]---
Location: payload-main/test/hooks/collections/Users/meHook.ts

```typescript
import type { MeHook } from 'node_modules/payload/src/collections/config/types.js'

export const meHook: MeHook = ({ user }) => {
  if (user.email === 'dontrefresh@payloadcms.com') {
    return {
      exp: 10000,
      user,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: refreshHook.ts]---
Location: payload-main/test/hooks/collections/Users/refreshHook.ts

```typescript
import type { RefreshHook } from 'node_modules/payload/src/collections/config/types.js'

export const refreshHook: RefreshHook = ({ user }) => {
  if (user.email === 'dontrefresh@payloadcms.com') {
    return {
      exp: 1,
      refreshedToken: 'fake',
      strategy: 'local-jwt',
      user,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/collections/Value/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const valueHooksSlug = 'value-hooks'
export const ValueCollection: CollectionConfig = {
  slug: valueHooksSlug,
  fields: [
    {
      name: 'slug',
      type: 'text',
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            siblingData.beforeValidate_value = String(value)
            return value
          },
        ],
        beforeChange: [
          ({ value, siblingData }) => {
            siblingData.beforeChange_value = String(value)
            return value
          },
        ],
      },
    },
    {
      name: 'beforeValidate_value',
      type: 'text',
    },
    {
      name: 'beforeChange_value',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/hooks/globals/Data/index.ts

```typescript
import type { GlobalConfig } from 'payload'

export const dataHooksGlobalSlug = 'data-hooks-global'

export const DataHooksGlobal: GlobalConfig = {
  slug: dataHooksGlobalSlug,
  access: {
    read: () => true,
    update: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, global, context }) => {
        context['global_beforeChange_global'] = JSON.stringify(global)

        return data
      },
    ],
    beforeRead: [
      ({ context, global }) => {
        context['global_beforeRead_global'] = JSON.stringify(global)
      },
    ],
    afterRead: [
      ({ context, global, doc }) => {
        context['global_afterRead_global'] = JSON.stringify(global)

        // Needs to be done for both afterRead (for findOne test) and afterChange (for update test)
        for (const contextKey in context) {
          if (contextKey.startsWith('global_')) {
            doc[contextKey] = context[contextKey]
          }
        }
        return doc
      },
    ],
    afterChange: [
      ({ context, global, doc }) => {
        context['global_afterChange_global'] = JSON.stringify(global)

        // Needs to be done for both afterRead (for findOne test) and afterChange (for update test), as afterChange is called after afterRead
        for (const contextKey in context) {
          if (contextKey.startsWith('global_')) {
            doc[contextKey] = context[contextKey]
          }
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'field_globalAndField',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ global, field, context, value }) => {
            context['field_beforeChange_GlobalAndField'] =
              JSON.stringify(global) + JSON.stringify(field)

            return value
          },
        ],

        afterRead: [
          ({ global, field, context }) => {
            if (context['field_beforeChange_GlobalAndField_override']) {
              return context['field_beforeChange_GlobalAndField_override']
            }

            return (
              (context['field_beforeChange_GlobalAndField'] as string) +
              JSON.stringify(global) +
              JSON.stringify(field)
            )
          },
        ],
      },
    },

    {
      name: 'global_beforeChange_global',
      type: 'text',
    },
    {
      name: 'global_afterChange_global',
      type: 'text',
    },
    {
      name: 'global_beforeRead_global',
      type: 'text',
    },
    {
      name: 'global_afterRead_global',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: emptyModule.js]---
Location: payload-main/test/hooks/mocks/emptyModule.js

```javascript
export default {}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWithCustomI18n.tsx]---
Location: payload-main/test/i18n/ComponentWithCustomI18n.tsx
Signals: React

```typescript
'use client'
import { useTranslation } from '@payloadcms/ui'
import React from 'react'

import type { CustomTranslationsKeys, CustomTranslationsObject } from './config.js'

export const ComponentWithCustomI18n = () => {
  const { i18n, t } = useTranslation<CustomTranslationsObject, CustomTranslationsKeys>()

  const componentWithCustomI18nDefaultValidT = t('fields:addLink')
  // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
  const componentWithCustomI18nDefaultInvalidT = t('fields:addLink2')

  const componentWithCustomI18nDefaultValidI18nT = i18n.t('fields:addLink')
  // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
  const componentWithCustomI18nDefaultInvalidI18nT = i18n.t('fields:addLink2')

  const componentWithCustomI18nCustomValidT = t('general:test')
  const componentWithCustomI18nCustomValidI18nT = i18n.t('general:test')

  return (
    <div className="componentWithCustomI18n">
      <p>ComponentWithCustomI18n Default :</p>
      ComponentWithCustomI18n Default Valid t:{' '}
      <span className="componentWithCustomI18nDefaultValidT">
        {componentWithCustomI18nDefaultValidT}
      </span>
      <br />
      ComponentWithCustomI18n Default Valid i18n.t:{' '}
      <span className="componentWithCustomI18nDefaultValidI18nT">
        {componentWithCustomI18nDefaultValidI18nT}
      </span>
      <br />
      ComponentWithCustomI18n Default Invalid t:{' '}
      <span className="componentWithCustomI18nDefaultInvalidT">
        {componentWithCustomI18nDefaultInvalidT}
      </span>
      <br />
      ComponentWithCustomI18n Default Invalid i18n.t:
      <span className="componentWithCustomI18nDefaultInvalidI18nT">
        {' '}
        {componentWithCustomI18nDefaultInvalidI18nT}
      </span>
      <br />
      <br />
      <p>ComponentWithCustomI18n Custom:</p>
      <br />
      ComponentWithCustomI18n Custom Valid t:{' '}
      <span className="componentWithCustomI18nCustomValidT">
        {componentWithCustomI18nCustomValidT}
      </span>
      <br />
      ComponentWithCustomI18n Custom Valid i18n.t:{' '}
      <span className="componentWithCustomI18nCustomValidI18nT">
        {componentWithCustomI18nCustomValidI18nT}
      </span>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ComponentWithDefaultI18n.tsx]---
Location: payload-main/test/i18n/ComponentWithDefaultI18n.tsx
Signals: React

```typescript
'use client'
import { useTranslation } from '@payloadcms/ui'
import React from 'react'

export const ComponentWithDefaultI18n = () => {
  const { i18n, t } = useTranslation()

  const componentWithDefaultI18nValidT = t('fields:addLink')
  // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
  const componentWithDefaultI18nInvalidT = t('fields:addLink2')

  const componentWithDefaultI18nValidI18nT = i18n.t('fields:addLink')
  // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
  const componentWithDefaultI18nInvalidI18nT = i18n.t('fields:addLink2')

  return (
    <div className="componentWithDefaultI18n">
      <p>ComponentWithDefaultI18n </p>
      ComponentWithDefaultI18n Valid t:{' '}
      <span className="componentWithDefaultI18nValidT">{componentWithDefaultI18nValidT}</span>
      <br />
      ComponentWithDefaultI18n Valid i18n.t:{' '}
      <span className="componentWithDefaultI18nValidI18nT">
        {componentWithDefaultI18nValidI18nT}
      </span>
      <br />
      ComponentWithDefaultI18n Invalid t:{' '}
      <span className="componentWithDefaultI18nInvalidT">{componentWithDefaultI18nInvalidT}</span>
      <br />
      ComponentWithDefaultI18n Invalid i18n.t:{' '}
      <span className="componentWithDefaultI18nInvalidI18nT">
        {componentWithDefaultI18nInvalidI18nT}
      </span>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/i18n/config.ts

```typescript
/**
 * This test suites primarily tests the i18n types (in this config.ts, the ComponentWithCustomI18n.tsx and ComponentWithDefaultI18n.tsx) and the i18n functionality in the admin UI.
 *
 * Thus, please do not remove any ts-expect-error comments in this test suite. This test suite will eventually have to be compiled to ensure there are no type errors.
 */

import type {
  DefaultTranslationKeys,
  NestedKeysStripped,
  TFunction,
} from '@payloadcms/translations'

import { fileURLToPath } from 'node:url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

const customTranslationsObject = {
  en: {
    general: {
      test: 'My custom translation',
    },
  },
}

export type CustomTranslationsObject = typeof customTranslationsObject.en
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterDashboard: [
        '/ComponentWithDefaultI18n.js#ComponentWithDefaultI18n',
        '/ComponentWithCustomI18n.js#ComponentWithCustomI18n',
      ],
    },
  },
  collections: [
    {
      slug: 'collection1',
      labels: {
        singular: {
          en: 'EN Collection 1',
          es: 'ES Collection 1',
        },
        plural: {
          en: 'EN Collection 1s',
          es: 'ES Collection 1s',
        },
      },
      fields: [
        {
          name: 'i18nFieldLabel',
          type: 'text',
          label: {
            en: 'en-label',
            es: 'es-label',
          },
        },
        {
          name: 'fieldDefaultI18nValid',
          type: 'text',
          label: ({ t }) => t('fields:addLabel'),
        },
        {
          name: 'fieldDefaultI18nInvalid',
          type: 'text',
          // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
          label: ({ t }) => t('fields:addLabel2'),
        },
        {
          name: 'fieldCustomI18nValidDefault',
          type: 'text',
          label: ({ t }: { t: TFunction<CustomTranslationsKeys | DefaultTranslationKeys> }) =>
            t('fields:addLabel'),
        },
        {
          name: 'fieldCustomI18nValidCustom',
          type: 'text',
          label: ({ t }: { t: TFunction<CustomTranslationsKeys | DefaultTranslationKeys> }) =>
            t('general:test'),
        },
        {
          name: 'fieldCustomI18nInvalid',
          type: 'text',
          label: ({ t }: { t: TFunction<CustomTranslationsKeys | DefaultTranslationKeys> }) =>
            // @ts-expect-error // Keep the ts-expect-error comment. This NEEDS to throw an error
            t('fields:addLabel2'),
        },
      ],
    },
  ],
  globals: [
    {
      slug: 'global',
      label: {
        en: 'EN Global',
        es: 'ES Global',
      },
      fields: [{ name: 'text', type: 'text' }],
    },
  ],
  i18n: {
    translations: customTranslationsObject,
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

````
