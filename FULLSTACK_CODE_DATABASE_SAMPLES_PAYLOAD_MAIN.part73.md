---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 73
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 73 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_providers/Auth/index.tsx
Signals: React

```typescript
'use client'

import type { Permissions } from 'payload/auth'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { User } from '../../../../payload-types'
import type { AuthContext, Create, ForgotPassword, Login, Logout, ResetPassword } from './types'

import { gql, USER } from './gql'
import { rest } from './rest'

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ api?: 'gql' | 'rest'; children: React.ReactNode }> = ({
  api = 'rest',
  children,
}) => {
  const [user, setUser] = useState<null | User>()
  const [permissions, setPermissions] = useState<null | Permissions>(null)

  const create = useCallback<Create>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, args)
        setUser(user)
        return user
      }

      if (api === 'gql') {
        const { createUser: user } = await gql(`mutation {
        createUser(data: { email: "${args.email}", password: "${args.password}", firstName: "${args.firstName}", lastName: "${args.lastName}" }) {
          ${USER}
        }
      }`)

        setUser(user)
        return user
      }
    },
    [api],
  )

  const login = useCallback<Login>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, args)
        setUser(user)
        return user
      }

      if (api === 'gql') {
        const { loginUser } = await gql(`mutation {
        loginUser(email: "${args.email}", password: "${args.password}") {
          user {
            ${USER}
          }
          exp
        }
      }`)

        setUser(loginUser?.user)
        return loginUser?.user
      }
    },
    [api],
  )

  const logout = useCallback<Logout>(async () => {
    if (api === 'rest') {
      await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`)
      setUser(null)
      return
    }

    if (api === 'gql') {
      await gql(`mutation {
        logoutUser
      }`)

      setUser(null)
    }
  }, [api])

  // On mount, get user and set
  useEffect(() => {
    const fetchMe = async () => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
          {},
          {
            method: 'GET',
          },
        )
        setUser(user)
      }

      if (api === 'gql') {
        const { meUser } = await gql(`query {
          meUser {
            user {
              ${USER}
            }
            exp
          }
        }`)

        setUser(meUser.user)
      }
    }

    void fetchMe()
  }, [api])

  const forgotPassword = useCallback<ForgotPassword>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
          args,
        )
        setUser(user)
        return user
      }

      if (api === 'gql') {
        const { forgotPasswordUser } = await gql(`mutation {
        forgotPasswordUser(email: "${args.email}")
      }`)

        return forgotPasswordUser
      }
    },
    [api],
  )

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
          args,
        )
        setUser(user)
        return user
      }

      if (api === 'gql') {
        const { resetPasswordUser } = await gql(`mutation {
        resetPasswordUser(password: "${args.password}", token: "${args.token}") {
          user {
            ${USER}
          }
        }
      }`)

        setUser(resetPasswordUser.user)
        return resetPasswordUser.user
      }
    },
    [api],
  )

  return (
    <Context
      value={{
        create,
        forgotPassword,
        login,
        logout,
        permissions,
        resetPassword,
        setPermissions,
        setUser,
        user,
      }}
    >
      {children}
    </Context>
  )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: rest.ts]---
Location: payload-main/examples/auth/src/app/(app)/_providers/Auth/rest.ts

```typescript
import type { User } from '../../../../payload-types'

export const rest = async (
  url: string,
  args?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: RequestInit,
): Promise<null | undefined | User> => {
  const method = options?.method || 'POST'

  try {
    const res = await fetch(url, {
      method,
      ...(method === 'POST' ? { body: JSON.stringify(args) } : {}),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    const { errors, user } = await res.json()

    if (errors) {
      throw new Error(errors[0].message)
    }

    if (res.ok) {
      return user
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/examples/auth/src/app/(app)/_providers/Auth/types.ts

```typescript
import type { Permissions } from 'payload/auth'

import type { User } from '../../../../payload-types'

 
export type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<User>

export type ForgotPassword = (args: { email: string }) => Promise<User>  

export type Create = (args: {
  email: string
  firstName: string
  lastName: string
  password: string
}) => Promise<User>  

export type Login = (args: { email: string; password: string }) => Promise<User>  

export type Logout = () => Promise<void>

export interface AuthContext {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  permissions?: null | Permissions
  resetPassword: ResetPassword
  setPermissions: (permissions: null | Permissions) => void
  setUser: (user: null | User) => void  
  user?: null | User
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/auth/src/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import '@payloadcms/next/css'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: importMap.js]---
Location: payload-main/examples/auth/src/app/(payload)/admin/importMap.js

```javascript
import { BeforeLogin as BeforeLogin_8a7ab0eb7ab5c511aba12e68480bfe5e } from '@/components/BeforeLogin'

export const importMap = {
  '@/components/BeforeLogin#BeforeLogin': BeforeLogin_8a7ab0eb7ab5c511aba12e68480bfe5e,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/auth/src/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/auth/src/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/auth/src/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/auth/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/auth/src/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/examples/auth/src/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload/types'

import { admins } from './access/admins'
import { adminsAndUser } from './access/adminsAndUser'
import { anyone } from './access/anyone'
import { checkRole } from './access/checkRole'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { protectRoles } from './hooks/protectRoles'
import { access } from 'fs'
import { create } from 'domain'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 28800, // 8 hours
    cookies: {
      sameSite: 'none',
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    unlock: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      access: {
        read: adminsAndUser,
        update: adminsAndUser,
      },
    },
    {
      name: 'password',
      type: 'password',
      required: true,
      admin: {
        description: 'Leave blank to keep the current password.',
      },
    },
    {
      name: 'resetPasswordToken',
      type: 'text',
      hidden: true,
    },
    {
      name: 'resetPasswordExpiration',
      type: 'date',
      hidden: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      access: {
        read: admins,
        update: admins,
        create: admins,
      },
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: admins.ts]---
Location: payload-main/examples/auth/src/collections/access/admins.ts

```typescript
import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const admins: Access = ({ req: { user } }) => checkRole(['admin'], user)
```

--------------------------------------------------------------------------------

---[FILE: adminsAndUser.ts]---
Location: payload-main/examples/auth/src/collections/access/adminsAndUser.ts

```typescript
import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const adminsAndUser: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    return {
      id: { equals: user.id },
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: anyone.ts]---
Location: payload-main/examples/auth/src/collections/access/anyone.ts

```typescript
import type { Access } from 'payload'

export const anyone: Access = () => true
```

--------------------------------------------------------------------------------

---[FILE: checkRole.ts]---
Location: payload-main/examples/auth/src/collections/access/checkRole.ts

```typescript
import type { User } from '../../payload-types'

export const checkRole = (allRoles: User['roles'] = [], user: User | null = null): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    ) {
      return true
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: loginAfterCreate.ts]---
Location: payload-main/examples/auth/src/collections/hooks/loginAfterCreate.ts

```typescript
import type { AfterChangeHook } from 'payload/dist/collections/config/types'

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  operation,
  req,
  req: { body = {}, payload, res },
}) => {
  if (operation === 'create') {
    const { email, password } = body

    if (email && password) {
      const { token, user } = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
        res,
      })

      return {
        ...doc,
        token,
        user,
      }
    }
  }

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: protectRoles.ts]---
Location: payload-main/examples/auth/src/collections/hooks/protectRoles.ts

```typescript
import type { FieldHook } from 'payload'

import type { User } from '../../payload-types'

// ensure there is always a `user` role
// do not let non-admins change roles
export const protectRoles: FieldHook<{ id: string } & User> = ({ data, req }) => {
  const isAdmin = req.user?.roles.includes('admin') || data.email === 'demo@payloadcms.com' // for the seed script

  if (!isAdmin) {
    return ['user']
  }

  const userRoles = new Set(data?.roles || [])
  userRoles.add('user')
  return [...userRoles]
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/components/BeforeLogin/index.tsx
Signals: React

```typescript
import React from 'react'

export const BeforeLogin: React.FC = () => {
  if (process.env.PAYLOAD_PUBLIC_SEED === 'true') {
    return (
      <p>
        {'Log in with the email '}
        <strong>demo@payloadcms.com</strong>
        {' and the password '}
        <strong>demo</strong>.
      </p>
    )
  }
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/examples/auth/src/migrations/seed.ts

```typescript
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
      roles: ['admin'],
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/examples/custom-components/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-example-custom-fields
PAYLOAD_SECRET=PAYLOAD_CUSTOM_FIELDS_EXAMPLE_SECRET_KEY
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: payload-main/examples/custom-components/.eslintrc.cjs

```text
module.exports = {
  root: true,
  extends: ['@payloadcms'],
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/custom-components/.gitignore

```text
build
dist
node_modules
package-lock.json
.env
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/examples/custom-components/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/examples/custom-components/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/examples/custom-components/next.config.mjs

```text
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/custom-components/package.json
Signals: React, Next.js

```json
{
  "name": "payload-example-custom-fields",
  "version": "1.0.0",
  "description": "An example of custom fields in Payload.",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "_dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation pnpm seed && next dev",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:schema": "payload-graphql generate:schema",
    "generate:types": "payload generate:types",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "seed": "npm run payload migrate:fresh",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/graphql": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "@payloadcms/ui": "latest",
    "cross-env": "^7.0.3",
    "dotenv": "^8.2.0",
    "graphql": "^16.9.0",
    "install": "^0.13.0",
    "next": "^15.4.10",
    "payload": "latest",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  },
  "devDependencies": {
    "@swc/core": "^1.6.13",
    "@types/ejs": "^3.1.5",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "tsx": "^4.16.2",
    "typescript": "5.5.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
