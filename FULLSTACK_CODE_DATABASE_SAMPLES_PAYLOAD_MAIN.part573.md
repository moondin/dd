---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 573
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 573 of 695)

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

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/form-state/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/form-state/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: types.d.ts]---
Location: payload-main/test/form-state/types.d.ts

```typescript
import type { RequestContext as OriginalRequestContext } from 'payload'

declare module 'payload' {
  // Create a new interface that merges your additional fields with the original one
  export interface RequestContext extends OriginalRequestContext {
    myObject?: string
    // ...
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/form-state/collections/Autosave/index.tsx

```typescript
import type { CollectionConfig } from 'payload'

export const autosavePostsSlug = 'autosave-posts'

export const AutosavePostsCollection: CollectionConfig = {
  slug: autosavePostsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'computedTitle',
      type: 'text',
      hooks: {
        beforeChange: [({ data }) => data?.title],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ArrayRowLabel.tsx]---
Location: payload-main/test/form-state/collections/Posts/ArrayRowLabel.tsx
Signals: React

```typescript
import React from 'react'

export const ArrayRowLabel = (props) => {
  return (
    <p data-id={props.value[props?.rowNumber - 1]?.id} id="custom-array-row-label">
      This is a custom component
    </p>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/form-state/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'computedTitle',
      type: 'text',
      hooks: {
        beforeChange: [({ data }) => data?.title],
      },
      label: 'Computed Title',
    },
    {
      name: 'renderTracker',
      type: 'text',
      admin: {
        components: {
          Field: './collections/Posts/RenderTracker.js#RenderTracker',
        },
      },
    },
    {
      name: 'validateUsingEvent',
      type: 'text',
      admin: {
        description:
          'This field should only validate on submit. Try typing "Not allowed" and submitting the form.',
      },
      validate: (value, { event }) => {
        if (event === 'onChange') {
          return true
        }

        if (value === 'Not allowed') {
          return 'This field has been validated only on submit'
        }

        return true
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'text',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
        },
        {
          slug: 'number',
          fields: [
            {
              name: 'number',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      admin: {
        components: {
          RowLabel: './collections/Posts/ArrayRowLabel.js#ArrayRowLabel',
        },
      },
      fields: [
        {
          name: 'customTextField',
          type: 'text',
          defaultValue: 'This is a default value',
          admin: {
            components: {
              Field: './collections/Posts/TextField.js#CustomTextField',
            },
          },
        },
        {
          name: 'defaultTextField',
          type: 'text',
        },
      ],
    },
    {
      name: 'computedArray',
      type: 'array',
      admin: {
        description:
          'If there is no value, a default row will be added by a beforeChange hook. Otherwise, modifies the rows on save.',
      },
      hooks: {
        beforeChange: [
          ({ value }) =>
            !value?.length
              ? [
                  {
                    text: 'This is a computed value.',
                  },
                ]
              : value,
        ],
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: RenderTracker.tsx]---
Location: payload-main/test/form-state/collections/Posts/RenderTracker.tsx

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { useField } from '@payloadcms/ui'

export const RenderTracker: TextFieldClientComponent = ({ path }) => {
  useField({ path })
  console.count('Renders') // eslint-disable-line no-console
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: TextField.tsx]---
Location: payload-main/test/form-state/collections/Posts/TextField.tsx

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { TextField } from '@payloadcms/ui'

export const CustomTextField: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/globals/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

export const slug = 'global'
export const arraySlug = 'array'

export const accessControlSlug = 'access-control'

export const defaultValueSlug = 'default-value'

export const englishLocale = 'en'
export const spanishLocale = 'es'

export const globalsEndpoint = 'hello-world'

const access = {
  read: () => true,
  update: () => true,
}

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  globals: [
    {
      access,
      fields: [
        {
          name: 'json',
          type: 'json',
        },
        {
          name: 'title',
          type: 'text',
        },
      ],
      slug,
    },
    {
      access,
      fields: [
        {
          name: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
            },
          ],
          localized: true,
          type: 'array',
        },
      ],
      slug: arraySlug,
    },
    {
      fields: [
        {
          name: 'text',
          defaultValue: 'test',
          type: 'text',
        },
        {
          name: 'group',
          fields: [
            {
              name: 'text',
              defaultValue: 'test',
              type: 'text',
            },
          ],
          type: 'group',
        },
      ],
      slug: defaultValueSlug,
    },
    {
      access: {
        read: ({ req: { user } }) => {
          if (user) {
            return true
          }

          return {
            enabled: {
              equals: true,
            },
          }
        },
      },
      fields: [
        {
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          name: 'enabled',
          type: 'checkbox',
        },
      ],
      slug: accessControlSlug,
    },
    {
      access,
      fields: [],
      graphQL: false,
      slug: 'without-graphql',
    },
  ],
  localization: {
    defaultLocale: englishLocale,
    locales: [englishLocale, spanishLocale],
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.updateGlobal({
      data: {
        title: 'hello',
      },
      slug: accessControlSlug,
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/globals/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import {
  accessControlSlug,
  arraySlug,
  defaultValueSlug,
  englishLocale,
  slug,
  spanishLocale,
} from './config.js'

let payload: Payload
let restClient: NextRESTClient

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('globals', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  describe('REST', () => {
    it('should create', async () => {
      const title = 'update'
      const data = {
        title,
      }
      const response = await restClient.POST(`/globals/${slug}`, {
        body: JSON.stringify(data),
      })
      const { result } = await response.json()

      expect(response.status).toEqual(200)
      expect(result).toMatchObject(data)
    })

    it('should read', async () => {
      const title = 'read'
      const data = {
        title,
      }
      await restClient.POST(`/globals/${slug}`, {
        body: JSON.stringify(data),
      })
      const response = await restClient.GET(`/globals/${slug}`)
      const globalDoc = await response.json()

      expect(response.status).toEqual(200)
      expect(globalDoc.globalType).toEqual(slug)
      expect(globalDoc).toMatchObject(data)
    })

    it('should update with localization', async () => {
      const array = [
        {
          text: 'one',
        },
      ]

      const response = await restClient.POST(`/globals/${arraySlug}`, {
        body: JSON.stringify({
          array,
        }),
      })
      const { result } = await response.json()

      expect(response.status).toBe(200)
      expect(result.array).toHaveLength(1)
      expect(result.array).toMatchObject(array)
      expect(result.id).toBeDefined()
    })
  })

  describe('local', () => {
    it('should save empty json objects', async () => {
      const createdJSON: any = await payload.updateGlobal({
        data: {
          json: {
            state: {},
          },
        },
        slug,
      })

      expect(createdJSON.json.state).toEqual({})
    })

    it('should create', async () => {
      const data = {
        title: 'title',
      }
      const doc = await payload.updateGlobal({
        data,
        slug,
      })
      expect(doc).toMatchObject(data)
    })

    it('should read', async () => {
      const title = 'read'
      const data = {
        title,
      }
      await payload.updateGlobal({
        data,
        slug,
      })
      const doc = await payload.findGlobal({
        slug,
      })

      expect(doc.globalType).toEqual(slug)
      expect(doc).toMatchObject(data)
    })

    it('should update with localization', async () => {
      const localized = {
        en: {
          array: [
            {
              text: 'one',
            },
          ],
        },
        es: {
          array: [
            {
              text: 'uno',
            },
          ],
        },
      }

      await payload.updateGlobal({
        data: {
          array: localized.en.array,
        },
        locale: englishLocale,
        slug: arraySlug,
      })

      await payload.updateGlobal({
        data: {
          array: localized.es.array,
        },
        locale: spanishLocale,
        slug: arraySlug,
      })

      const en = await payload.findGlobal({
        locale: englishLocale,
        slug: arraySlug,
      })

      const es = await payload.findGlobal({
        locale: spanishLocale,
        slug: arraySlug,
      })

      expect(en).toMatchObject(localized.en)
      expect(es).toMatchObject(localized.es)
    })

    it('should respect valid access query constraint', async () => {
      const emptyGlobal = await payload.findGlobal({
        overrideAccess: false,
        slug: accessControlSlug,
      })

      expect(Object.keys(emptyGlobal)).toHaveLength(0)

      await payload.updateGlobal({
        data: {
          enabled: true,
        },
        slug: accessControlSlug,
      })

      const hasAccess = await payload.findGlobal({
        overrideAccess: false,
        slug: accessControlSlug,
      })

      expect(hasAccess.title).toBeDefined()
    })

    it('should get globals with defaultValues populated before first creation', async () => {
      const defaultValueGlobal = await payload.findGlobal({
        slug: defaultValueSlug,
      })

      expect(defaultValueGlobal.text).toStrictEqual('test')
      // @ts-expect-error
      expect(defaultValueGlobal.group.text).toStrictEqual('test')
    })
  })

  describe('graphql', () => {
    it('should create', async () => {
      const title = 'graphql-title'
      const query = `mutation {
          updateGlobal(data: {title: "${title}"}) {
          title
        }
      }`

      const { data } = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(data.updateGlobal).toMatchObject({ title })
    })

    it('should read', async () => {
      const data = {
        title: 'updated graphql',
      }
      await payload.updateGlobal({
        data,
        slug,
      })

      const query = `query {
        Global {
          title
        }
      }`

      const { data: queryResult } = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(queryResult.Global).toMatchObject(data)
    })

    it('should not show globals with disabled graphql', async () => {
      const query = `query {
        WithoutGraphql { __typename }
      }`
      const response = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(response.errors[0].message).toMatch(
        'Cannot query field "WithoutGraphql" on type "Query".',
      )
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/globals/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    global: Global;
    array: Array;
    'default-value': DefaultValue;
    'access-control': AccessControl;
    'without-graphql': WithoutGraphql;
  };
  globalsSelect: {
    global: GlobalSelect<false> | GlobalSelect<true>;
    array: ArraySelect<false> | ArraySelect<true>;
    'default-value': DefaultValueSelect<false> | DefaultValueSelect<true>;
    'access-control': AccessControlSelect<false> | AccessControlSelect<true>;
    'without-graphql': WithoutGraphqlSelect<false> | WithoutGraphqlSelect<true>;
  };
  locale: 'en' | 'es';
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?: {
    relationTo: 'users';
    value: string | User;
  } | null;
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "global".
 */
export interface Global {
  id: string;
  json?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  title?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "array".
 */
export interface Array {
  id: string;
  array?:
    | {
        text?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "default-value".
 */
export interface DefaultValue {
  id: string;
  text?: string | null;
  group?: {
    text?: string | null;
  };
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "access-control".
 */
export interface AccessControl {
  id: string;
  title: string;
  enabled?: boolean | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "without-graphql".
 */
export interface WithoutGraphql {
  id: string;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "global_select".
 */
export interface GlobalSelect<T extends boolean = true> {
  json?: T;
  title?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "array_select".
 */
export interface ArraySelect<T extends boolean = true> {
  array?:
    | T
    | {
        text?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "default-value_select".
 */
export interface DefaultValueSelect<T extends boolean = true> {
  text?: T;
  group?:
    | T
    | {
        text?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "access-control_select".
 */
export interface AccessControlSelect<T extends boolean = true> {
  title?: T;
  enabled?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "without-graphql_select".
 */
export interface WithoutGraphqlSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/globals/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/globals/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/graphql/config.ts

```typescript
import { GraphQL } from '@payloadcms/graphql/types'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [
    {
      slug: 'posts',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
        },
        {
          name: 'hyphenated-name',
          type: 'text',
        },
        {
          type: 'relationship',
          relationTo: 'posts',
          name: 'relationToSelf',
          graphQL: {
            complexity: 801,
          },
        },
      ],
    },
  ],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
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
  graphQL: {
    maxComplexity: 800,
    validationRules: () => [NoIntrospection],
  },
})

const NoIntrospection: GraphQL.ValidationRule = (context) => ({
  Field(node) {
    if (node.name.value === '__schema' || node.name.value === '__type') {
      context.reportError(
        new GraphQL.GraphQLError(
          'GraphQL introspection is not allowed, but the query contained __schema or __type',
          { nodes: [node] },
        ),
      )
    }
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/graphql/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { idToString } from '../helpers/idToString.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload
let restClient: NextRESTClient

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('graphql', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  describe('graphql', () => {
    it('should not be able to query introspection', async () => {
      const query = `query {
        __schema {
          queryType {
            name
          }
        }
      }`

      const response = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(response.errors[0].message).toMatch(
        'GraphQL introspection is not allowed, but the query contained __schema or __type',
      )
    })

    it('should respect maxComplexity', async () => {
      const post = await payload.create({
        collection: 'posts',
        data: {
          title: 'example post',
        },
      })
      await payload.update({
        collection: 'posts',
        id: post.id,
        data: {
          relationToSelf: post.id,
        },
      })

      const query = `query {
        Post(id: ${idToString(post.id, payload)}) {
          title
          relationToSelf {
            id
          }
        }
      }`

      const response = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({ query }),
        })
        .then((res) => res.json())

      expect(response.errors[0].message).toMatch(
        'The query exceeds the maximum complexity of 800. Actual complexity is 804',
      )
    })

    it('should sanitize hyphenated field names to snake case', async () => {
      const post = await payload.create({
        collection: 'posts',
        data: {
          title: 'example post',
          'hyphenated-name': 'example-hyphenated-name',
        },
      })

      const query = `query {
        Post(id: ${idToString(post.id, payload)}) {
          title
          hyphenated_name
        }
      }`

      const { data } = await restClient
        .GRAPHQL_POST({ body: JSON.stringify({ query }) })
        .then((res) => res.json())
      const res = data.Post

      expect(res.hyphenated_name).toStrictEqual('example-hyphenated-name')
    })

    it('should not error because of non nullable fields', async () => {
      await payload.delete({ collection: 'posts', where: {} })

      // this is an array if any errors
      const res_1 = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({
            query: `
query {
  Posts {
    docs {
      title
    }
    prevPage
  }
}
        `,
          }),
        })
        .then((res) => res.json())
      expect(res_1.errors).toBeFalsy()

      await payload.create({
        collection: 'posts',
        data: { title: 'any-title' },
      })

      const res_2 = await restClient
        .GRAPHQL_POST({
          body: JSON.stringify({
            query: `
query {
  Posts(limit: 1) {
    docs {
      title
    }
  }
}
        `,
          }),
        })
        .then((res) => res.json())
      expect(res_2.errors).toBeFalsy()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/graphql/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    posts: Post;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title?: string | null;
  'hyphenated-name'?: string | null;
  relationToSelf?: (string | null) | Post;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  title?: T;
  'hyphenated-name'?: T;
  relationToSelf?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

````
