---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 629
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 629 of 695)

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

---[FILE: seed.ts]---
Location: payload-main/test/locked-documents/seed.ts

```typescript
import type { Payload } from 'payload'

import { devUser, regularUser } from '../credentials.js'
import { executePromises } from '../helpers/executePromises.js'
import { pagesSlug, postsSlug } from './slugs.js'

export const seed = async (_payload: Payload) => {
  await executePromises(
    [
      () =>
        _payload.create({
          collection: 'users',
          data: {
            email: devUser.email,
            password: devUser.password,
            name: 'Admin',
            roles: ['is_admin', 'is_user'],
          },
        }),
      () =>
        _payload.create({
          collection: 'users',
          data: {
            email: regularUser.email,
            password: regularUser.password,
            name: 'Dev',
            roles: ['is_user'],
          },
        }),
      () =>
        _payload.create({
          collection: pagesSlug,
          data: {
            text: 'example page',
          },
        }),
      () =>
        _payload.create({
          collection: postsSlug,
          data: {
            text: 'example post',
          },
        }),
    ],
    false,
  )
}
```

--------------------------------------------------------------------------------

---[FILE: slugs.ts]---
Location: payload-main/test/locked-documents/slugs.ts

```typescript
export const pagesSlug = 'pages'

export const postsSlug = 'posts'

export const usersSlug = 'users'

export const collectionSlugs = [pagesSlug, postsSlug, usersSlug]
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/locked-documents/tsconfig.eslint.json

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
Location: payload-main/test/locked-documents/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/collections/Pages/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { pagesSlug } from '../../slugs.js'

export const PagesCollection: CollectionConfig = {
  slug: pagesSlug,
  admin: {
    useAsTitle: 'text',
  },
  lockDocuments: false,
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { postsSlug } from '../../slugs.js'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'createdAt', 'updatedAt', '_status'],
  },
  lockDocuments: {
    duration: 180,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'richText',
      type: 'richText',
    },
    {
      name: 'documentLoaded',
      label: 'Document loaded',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
        readOnly: true,
        components: {
          Field: '/collections/Posts/fields/DocumentLoaded.tsx#DocumentLoaded',
        },
      },
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: CustomTextFieldServer.tsx]---
Location: payload-main/test/locked-documents/collections/Posts/fields/CustomTextFieldServer.tsx
Signals: React

```typescript
import type { TextFieldServerComponent } from 'payload'
import type React from 'react'

import { TextField } from '@payloadcms/ui'

export const CustomTextFieldServer: TextFieldServerComponent = ({
  clientField,
  path,
  permissions,
  readOnly,
  schemaPath,
}) => {
  return (
    <TextField
      field={clientField}
      path={path}
      permissions={permissions}
      readOnly={readOnly}
      schemaPath={schemaPath}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DocumentLoaded.tsx]---
Location: payload-main/test/locked-documents/collections/Posts/fields/DocumentLoaded.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientProps } from 'payload'

import { DatePicker, FieldLabel, useField } from '@payloadcms/ui'
import { type FunctionComponent, useEffect, useRef } from 'react'

export const DocumentLoaded: FunctionComponent<TextFieldClientProps> = ({ field: label }) => {
  const field = useField<Date>({
    path: 'documentLoaded',
  })
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current || field.formInitializing) {
      return
    }
    hasRun.current = true

    field.setValue(new Date().toISOString())
  }, [field])

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <FieldLabel field={label} />
      <DatePicker displayFormat="yyyy-MM-dd hh:mm:ss" readOnly={true} value={field.value} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/collections/ServerComponents/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const serverComponentsSlug = 'server-components'

export const ServerComponentsCollection: CollectionConfig = {
  slug: serverComponentsSlug,
  admin: {
    useAsTitle: 'customTextServer',
  },
  fields: [
    {
      name: 'customTextServer',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/Posts/fields/CustomTextFieldServer.tsx#CustomTextFieldServer',
        },
      },
    },
    {
      name: 'richText',
      type: 'richText',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/collections/Tests/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const testsSlug = 'tests'

export const TestsCollection: CollectionConfig = {
  slug: testsSlug,
  admin: {
    useAsTitle: 'text',
  },
  lockDocuments: {
    duration: 5,
  },
  fields: [
    {
      name: 'text',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/collections/Users/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { usersSlug } from '../../slugs.js'

export const Users: CollectionConfig = {
  slug: usersSlug,
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    read: ({ req: { user }, id }) => {
      // Allow access if the user has the 'is_admin' role or if they are reading their own record
      return Boolean(user?.roles?.includes('is_admin') || user?.id === id)
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      // required: true,
      options: [
        { label: 'User', value: 'is_user' },
        { label: 'Admin', value: 'is_admin' },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/globals/Admin/index.ts

```typescript
import type { GlobalConfig } from 'payload'

export const adminSlug = 'admin'

export const AdminGlobal: GlobalConfig = {
  slug: adminSlug,
  lockDocuments: {
    duration: 10,
  },
  fields: [
    {
      name: 'adminText',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/locked-documents/globals/Menu/index.ts

```typescript
import type { GlobalConfig } from 'payload'

export const menuSlug = 'menu'

export const MenuGlobal: GlobalConfig = {
  slug: menuSlug,
  fields: [
    {
      name: 'globalText',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/login-with-username/config.ts

```typescript
import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const LoginWithUsernameConfig = buildConfigWithDefaults({
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  collections: [
    {
      slug: 'users',
      auth: {
        loginWithUsername: {
          requireEmail: false,
          allowEmailLogin: false,
        },
      },
      fields: [],
    },
    {
      slug: 'login-with-either',
      auth: {
        loginWithUsername: {
          requireEmail: false,
          allowEmailLogin: true,
          requireUsername: false,
        },
      },
      fields: [],
    },
    {
      slug: 'require-email',
      auth: {
        loginWithUsername: {
          requireEmail: true,
          allowEmailLogin: false,
        },
      },
      fields: [],
      admin: {
        useAsTitle: 'email',
      },
    },
  ],
})

export default LoginWithUsernameConfig
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/login-with-username/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Login With Username Feature', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should not allow creation with neither email nor username', async () => {
    let errors = []
    try {
      await payload.create({
        collection: 'login-with-either',
        data: {
          email: null,
          username: null,
        },
      })
    } catch (error) {
      errors = error.data.errors
    }
    expect(errors).toHaveLength(2)
  })

  it('should not allow removing both username and email fields', async () => {
    const emailToUse = 'example@email.com'
    const usernameToUse = 'exampleUser'

    const exampleUser = await payload.create({
      collection: 'login-with-either',
      data: {
        email: emailToUse,
        username: usernameToUse,
        password: 'test',
      },
    })

    let errors = []
    try {
      await payload.update({
        collection: 'login-with-either',
        id: exampleUser.id,
        data: {
          email: null,
          username: null,
        },
      })
    } catch (error) {
      errors = error.data.errors
    }
    expect(errors).toHaveLength(2)

    errors = []
    await payload.update({
      collection: 'login-with-either',
      id: exampleUser.id,
      data: {
        username: null,
      },
    })
    expect(errors).toHaveLength(0)

    try {
      await payload.update({
        collection: 'login-with-either',
        id: exampleUser.id,
        data: {
          email: null,
        },
      })
    } catch (error) {
      errors = error.data.errors
    }
    expect(errors).toHaveLength(2)
  })

  it('should allow login with either username or email', async () => {
    await payload.create({
      collection: 'login-with-either',
      data: {
        email: devUser.email,
        username: 'dev',
        password: devUser.password,
      },
    })

    const loginWithEmail = await payload.login({
      collection: 'login-with-either',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
    expect(loginWithEmail).toHaveProperty('token')

    const loginWithUsername = await payload.login({
      collection: 'login-with-either',
      data: {
        username: 'dev',
        password: devUser.password,
      },
    })
    expect(loginWithUsername).toHaveProperty('token')
  })

  it('should allow mutliple creates with optional email and username', async () => {
    // create a user with just email
    await payload.create({
      collection: 'login-with-either',
      data: {
        email: 'email1@mail.com',
        password: 'test',
      },
    })

    // create second user with just email
    const emailUser2 = await payload.create({
      collection: 'login-with-either',
      data: {
        email: 'email2@mail.com',
        password: 'test',
      },
    })
    expect(emailUser2).toHaveProperty('id')

    // create user with just username
    await payload.create({
      collection: 'login-with-either',
      data: {
        username: 'username1',
        password: 'test',
      },
    })

    // create second user with just username
    const usernameUser2 = await payload.create({
      collection: 'login-with-either',
      data: {
        username: 'username2',
        password: 'test',
      },
    })
    expect(usernameUser2).toHaveProperty('id')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/login-with-username/payload-types.ts

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
    'login-with-either': LoginWithEitherAuthOperations;
    'require-email': RequireEmailAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    'login-with-either': LoginWithEither;
    'require-email': RequireEmail;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    'login-with-either': LoginWithEitherSelect<false> | LoginWithEitherSelect<true>;
    'require-email': RequireEmailSelect<false> | RequireEmailSelect<true>;
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
  user:
    | (User & {
        collection: 'users';
      })
    | (LoginWithEither & {
        collection: 'login-with-either';
      })
    | (RequireEmail & {
        collection: 'require-email';
      });
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    username: string;
  };
  login: {
    password: string;
    username: string;
  };
  registerFirstUser: {
    password: string;
    username: string;
  };
  unlock: {
    username: string;
  };
}
export interface LoginWithEitherAuthOperations {
  forgotPassword:
    | {
        email: string;
      }
    | {
        username: string;
      };
  login:
    | {
        email: string;
        password: string;
      }
    | {
        password: string;
        username: string;
      };
  registerFirstUser: {
    password: string;
    username?: string;
    email?: string;
  };
  unlock:
    | {
        email: string;
      }
    | {
        username: string;
      };
}
export interface RequireEmailAuthOperations {
  forgotPassword: {
    username: string;
  };
  login: {
    password: string;
    username: string;
  };
  registerFirstUser: {
    password: string;
    username: string;
    email: string;
  };
  unlock: {
    username: string;
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
  email?: string | null;
  username: string;
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
 * via the `definition` "login-with-either".
 */
export interface LoginWithEither {
  id: string;
  updatedAt: string;
  createdAt: string;
  email?: string | null;
  username?: string | null;
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
 * via the `definition` "require-email".
 */
export interface RequireEmail {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  username: string;
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
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'login-with-either';
        value: string | LoginWithEither;
      } | null)
    | ({
        relationTo: 'require-email';
        value: string | RequireEmail;
      } | null);
  globalSlug?: string | null;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'login-with-either';
        value: string | LoginWithEither;
      }
    | {
        relationTo: 'require-email';
        value: string | RequireEmail;
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
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'login-with-either';
        value: string | LoginWithEither;
      }
    | {
        relationTo: 'require-email';
        value: string | RequireEmail;
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
  username?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "login-with-either_select".
 */
export interface LoginWithEitherSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  username?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "require-email_select".
 */
export interface RequireEmailSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  username?: T;
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

---[FILE: tsconfig.json]---
Location: payload-main/test/login-with-username/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/migrations-cli/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/migrations-cli/payload-types.ts

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
Location: payload-main/test/migrations-cli/tsconfig.eslint.json

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
Location: payload-main/test/migrations-cli/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/nested-fields/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

// fields with fields
// - array -> fields
// - blocks -> blocks
// - row -> fields
// - collapsible -> fields
// - group -> fields
// - tabs -> tab -> fields
// - tabs -> named-tab -> fields

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'nested-fields',
      fields: [
        {
          name: 'array',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  label: 'Collapsible',
                  type: 'collapsible',
                  fields: [
                    {
                      type: 'group',
                      name: 'group',
                      fields: [
                        {
                          type: 'tabs',
                          tabs: [
                            {
                              name: 'namedTab',
                              label: 'Named Tab',
                              fields: [
                                {
                                  type: 'tabs',
                                  tabs: [
                                    {
                                      label: 'Unnamed Tab',
                                      fields: [
                                        {
                                          name: 'blocks',
                                          type: 'blocks',
                                          blocks: [
                                            {
                                              slug: 'blockWithFields',
                                              fields: [
                                                {
                                                  type: 'text',
                                                  name: 'text',
                                                },
                                                {
                                                  type: 'array',
                                                  name: 'blockArray',
                                                  fields: [
                                                    {
                                                      type: 'text',
                                                      name: 'arrayText',
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          type: 'tabs',
          label: 'Tabs',
          tabs: [
            {
              label: 'Tab 1',
              name: 'tab1',
              fields: [
                {
                  type: 'blocks',
                  name: 'layout',
                  blocks: [
                    {
                      slug: 'block-1',
                      fields: [
                        {
                          type: 'array',
                          name: 'items',
                          fields: [
                            {
                              type: 'text',
                              name: 'title',
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      slug: 'block-2',
                      fields: [
                        {
                          type: 'array',
                          name: 'items',
                          fields: [
                            {
                              type: 'text',
                              name: 'title2',
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'blocks',
          name: 'blocksWithSimilarConfigs',
          blocks: [
            {
              slug: 'block-1',
              fields: [
                {
                  type: 'array',
                  name: 'items',
                  fields: [
                    {
                      type: 'text',
                      name: 'title',
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              slug: 'block-2',
              fields: [
                {
                  type: 'array',
                  name: 'items',
                  fields: [
                    {
                      type: 'text',
                      name: 'title2',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
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
