---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 178
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 178 of 695)

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

---[FILE: getLoginOptions.ts]---
Location: payload-main/packages/payload/src/auth/getLoginOptions.ts

```typescript
import type { Auth } from './types.js'

export const getLoginOptions = (
  loginWithUsername: Auth['loginWithUsername'],
): {
  canLoginWithEmail: boolean
  canLoginWithUsername: boolean
} => {
  return {
    canLoginWithEmail: !loginWithUsername || loginWithUsername.allowEmailLogin!,
    canLoginWithUsername: Boolean(loginWithUsername),
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/auth/index.ts

```typescript
export * from './cookies.js'

export { extractJWT } from './extractJWT.js'
export * from './types.js'
```

--------------------------------------------------------------------------------

---[FILE: isUserLocked.ts]---
Location: payload-main/packages/payload/src/auth/isUserLocked.ts

```typescript
export const isUserLocked = (date: Date): boolean => {
  if (!date) {
    return false
  }
  return date.getTime() > Date.now()
}
```

--------------------------------------------------------------------------------

---[FILE: jwt.ts]---
Location: payload-main/packages/payload/src/auth/jwt.ts

```typescript
import { SignJWT } from 'jose'

export const jwtSign = async ({
  fieldsToSign,
  secret,
  tokenExpiration,
}: {
  fieldsToSign: Record<string, unknown>
  secret: string
  tokenExpiration: number
}) => {
  const secretKey = new TextEncoder().encode(secret)
  const issuedAt = Math.floor(Date.now() / 1000)
  const exp = issuedAt + tokenExpiration
  const token = await new SignJWT(fieldsToSign)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(secretKey)
  return { exp, token }
}
```

--------------------------------------------------------------------------------

---[FILE: sendVerificationEmail.ts]---
Location: payload-main/packages/payload/src/auth/sendVerificationEmail.ts

```typescript
import { URL } from 'url'

import type { Collection } from '../collections/config/types.js'
import type { SanitizedConfig } from '../config/types.js'
import type { InitializedEmailAdapter } from '../email/types.js'
import type { TypedUser } from '../index.js'
import type { PayloadRequest } from '../types/index.js'
import type { VerifyConfig } from './types.js'

type Args = {
  collection: Collection
  config: SanitizedConfig
  disableEmail: boolean
  email: InitializedEmailAdapter
  req: PayloadRequest
  token: string
  user: TypedUser
}

export async function sendVerificationEmail(args: Args): Promise<void> {
  // Verify token from e-mail
  const {
    collection: { config: collectionConfig },
    config,
    disableEmail,
    email,
    req,
    token,
    user,
  } = args

  if (!disableEmail) {
    const protocol = new URL(req.url!).protocol // includes the final :
    const serverURL =
      config.serverURL !== null && config.serverURL !== ''
        ? config.serverURL
        : `${protocol}//${req.headers.get('host')}`

    const verificationURL = `${serverURL}${config.routes.admin}/${collectionConfig.slug}/verify/${token}`

    let html = `${req.t('authentication:newAccountCreated', {
      serverURL: config.serverURL,
      verificationURL,
    })}`

    const verify = collectionConfig.auth.verify as VerifyConfig

    // Allow config to override email content
    if (typeof verify.generateEmailHTML === 'function') {
      html = await verify.generateEmailHTML({
        req,
        token,
        user,
      })
    }

    let subject = req.t('authentication:verifyYourEmail')

    // Allow config to override email subject
    if (typeof verify.generateEmailSubject === 'function') {
      subject = await verify.generateEmailSubject({
        req,
        token,
        user,
      })
    }

    await email.sendEmail({
      from: `"${email.defaultFromName}" <${email.defaultFromAddress}>`,
      html,
      subject,
      to: user.email,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: sessions.ts]---
Location: payload-main/packages/payload/src/auth/sessions.ts

```typescript
import { v4 as uuid } from 'uuid'

import type { SanitizedCollectionConfig } from '../collections/config/types.js'
import type { TypedUser } from '../index.js'
import type { Payload, PayloadRequest } from '../types/index.js'
import type { UserSession } from './types.js'

/**
 * Removes expired sessions from an array of sessions
 */
export const removeExpiredSessions = (sessions: UserSession[]) => {
  const now = new Date()

  return sessions.filter(({ expiresAt }) => {
    const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)
    return expiry > now
  })
}

/**
 * Adds a session to the user and removes expired sessions
 * @returns The session ID (sid) if sessions are used
 */
export const addSessionToUser = async ({
  collectionConfig,
  payload,
  req,
  user,
}: {
  collectionConfig: SanitizedCollectionConfig
  payload: Payload
  req: PayloadRequest
  user: TypedUser
}): Promise<{ sid?: string }> => {
  let sid: string | undefined
  if (collectionConfig.auth.useSessions) {
    // Add session to user
    sid = uuid()
    const now = new Date()
    const tokenExpInMs = collectionConfig.auth.tokenExpiration * 1000
    const expiresAt = new Date(now.getTime() + tokenExpInMs)

    const session = { id: sid, createdAt: now, expiresAt }

    if (!user.sessions?.length) {
      user.sessions = [session]
    } else {
      user.sessions = removeExpiredSessions(user.sessions)
      user.sessions.push(session)
    }

    // Prevent updatedAt from being updated when only adding a session
    user.updatedAt = null

    await payload.db.updateOne({
      id: user.id,
      collection: collectionConfig.slug,
      data: user,
      req,
      returning: false,
    })

    user.collection = collectionConfig.slug
    user._strategy = 'local-jwt'
  }

  return {
    sid,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/payload/src/auth/types.ts

```typescript
import type { DeepRequired } from 'ts-essentials'

import type { CollectionSlug, GlobalSlug, Payload, TypedUser } from '../index.js'
import type { PayloadRequest, Where } from '../types/index.js'

/**
 * A permission object that can be used to determine if a user has access to a specific operation.
 */
export type Permission = {
  permission: boolean
  where?: Where
}

export type FieldsPermissions = {
  [fieldName: string]: FieldPermissions
}

export type BlockPermissions = {
  create: Permission
  fields: FieldsPermissions
  read: Permission
  update: Permission
}

export type SanitizedBlockPermissions =
  | {
      fields: SanitizedFieldsPermissions
    }
  | true

export type BlocksPermissions = {
  [blockSlug: string]: BlockPermissions
}

export type SanitizedBlocksPermissions =
  | {
      [blockSlug: string]: SanitizedBlockPermissions
    }
  | true

export type FieldPermissions = {
  blocks?: BlocksPermissions
  create?: Permission
  fields?: FieldsPermissions
  read?: Permission
  update?: Permission
}

export type SanitizedFieldPermissions =
  | {
      blocks?: SanitizedBlocksPermissions
      create: true
      fields?: SanitizedFieldsPermissions
      read: true
      update: true
    }
  | true

export type SanitizedFieldsPermissions =
  | {
      [fieldName: string]: SanitizedFieldPermissions
    }
  | true

export type CollectionPermission = {
  create?: Permission
  delete?: Permission
  fields: FieldsPermissions
  read?: Permission
  readVersions?: Permission
  // Auth-enabled Collections only
  unlock?: Permission
  update?: Permission
}

export type SanitizedCollectionPermission = {
  create?: true
  delete?: true
  fields: SanitizedFieldsPermissions
  read?: true
  readVersions?: true
  // Auth-enabled Collections only
  unlock?: true
  update?: true
}

export type GlobalPermission = {
  fields: FieldsPermissions
  read?: Permission
  readVersions?: Permission
  update?: Permission
}

export type SanitizedGlobalPermission = {
  fields: SanitizedFieldsPermissions
  read?: true
  readVersions?: true
  update?: true
}

export type DocumentPermissions = CollectionPermission | GlobalPermission

export type SanitizedDocumentPermissions = SanitizedCollectionPermission | SanitizedGlobalPermission

export type Permissions = {
  canAccessAdmin: boolean
  collections?: Record<CollectionSlug, CollectionPermission>
  globals?: Record<GlobalSlug, GlobalPermission>
}

export type SanitizedPermissions = {
  canAccessAdmin?: boolean
  collections?: {
    [collectionSlug: string]: SanitizedCollectionPermission
  }
  globals?: {
    [globalSlug: string]: SanitizedGlobalPermission
  }
}

type BaseUser = {
  collection: string
  email?: string
  id: number | string
  sessions?: Array<UserSession>
  username?: string
}

/**
 * @deprecated Use `TypedUser` instead. This will be removed in 4.0.
 */
export type UntypedUser = {
  [key: string]: any
} & BaseUser

/**
 * `collection` is not available one the client. It's only available on the server (req.user)
 * On the client, you can access the collection via config.admin.user. Config can be accessed using the useConfig() hook
 */
export type ClientUser = {
  [key: string]: any
} & BaseUser

export type UserSession = { createdAt: Date | string; expiresAt: Date | string; id: string }
type GenerateVerifyEmailHTML<TUser = any> = (args: {
  req: PayloadRequest
  token: string
  user: TUser
}) => Promise<string> | string

type GenerateVerifyEmailSubject<TUser = any> = (args: {
  req: PayloadRequest
  token: string
  user: TUser
}) => Promise<string> | string

type GenerateForgotPasswordEmailHTML<TUser = any> = (args?: {
  req?: PayloadRequest
  token?: string
  user?: TUser
}) => Promise<string> | string

type GenerateForgotPasswordEmailSubject<TUser = any> = (args?: {
  req?: PayloadRequest
  token?: string
  user?: TUser
}) => Promise<string> | string

export type AuthStrategyFunctionArgs = {
  /**
   * Specifies whether or not response headers can be set from this strategy.
   */
  canSetHeaders?: boolean
  headers: Request['headers']
  isGraphQL?: boolean
  payload: Payload
  /**
   * The AuthStrategy name property from the payload config.
   */
  strategyName?: string
}

export type AuthStrategyResult = {
  responseHeaders?: Headers
  user:
    | ({
        _strategy?: string
        collection?: string
      } & TypedUser)
    | null
}

export type AuthStrategyFunction = (
  args: AuthStrategyFunctionArgs,
) => AuthStrategyResult | Promise<AuthStrategyResult>
export type AuthStrategy = {
  authenticate: AuthStrategyFunction
  name: string
}

export type LoginWithUsernameOptions =
  | {
      allowEmailLogin?: false
      requireEmail?: boolean
      // If `allowEmailLogin` is false, `requireUsername` must be true (default: true)
      requireUsername?: true
    }
  | {
      allowEmailLogin?: true
      requireEmail?: boolean
      requireUsername?: boolean
    }

export interface IncomingAuthType {
  /**
   * Set cookie options, including secure, sameSite, and domain. For advanced users.
   */
  cookies?: {
    domain?: string
    sameSite?: 'Lax' | 'None' | 'Strict' | boolean
    secure?: boolean
  }
  /**
   * How many levels deep a user document should be populated when creating the JWT and binding the user to the req. Defaults to 0 and should only be modified if absolutely necessary, as this will affect performance.
   * @default 0
   */
  depth?: number
  /**
   * Advanced - disable Payload's built-in local auth strategy. Only use this property if you have replaced Payload's auth mechanisms with your own.
   */
  disableLocalStrategy?:
    | {
        /**
         * Include auth fields on the collection even though the local strategy is disabled.
         * Useful when you do not want the database or types to vary depending on the auth configuration.
         */
        enableFields?: true
        optionalPassword?: true
      }
    | true
  /**
   * Customize the way that the forgotPassword operation functions.
   * @link https://payloadcms.com/docs/authentication/email#forgot-password
   */
  forgotPassword?: {
    /**
     * The number of milliseconds that the forgot password token should be valid for.
     * @default 3600000 // 1 hour
     */
    expiration?: number
    generateEmailHTML?: GenerateForgotPasswordEmailHTML
    generateEmailSubject?: GenerateForgotPasswordEmailSubject
  }
  /**
   * Set the time (in milliseconds) that a user should be locked out if they fail authentication more times than maxLoginAttempts allows for.
   */
  lockTime?: number
  /**
   * Ability to allow users to login with username/password.
   *
   * @link https://payloadcms.com/docs/authentication/overview#login-with-username
   */
  loginWithUsername?: boolean | LoginWithUsernameOptions
  /**
   * Only allow a user to attempt logging in X amount of times. Automatically locks out a user from authenticating if this limit is passed. Set to 0 to disable.
   */
  maxLoginAttempts?: number
  /***
   * Set to true if you want to remove the token from the returned authentication API responses such as login or refresh.
   */
  removeTokenFromResponses?: true
  /**
   * Advanced - an array of custom authentification strategies to extend this collection's authentication with.
   * @link https://payloadcms.com/docs/authentication/custom-strategies
   */
  strategies?: AuthStrategy[]
  /**
   * Controls how many seconds the token will be valid for. Default is 2 hours.
   * @default 7200
   * @link https://payloadcms.com/docs/authentication/overview#config-options
   */
  tokenExpiration?: number
  /**
   * Payload Authentication provides for API keys to be set on each user within an Authentication-enabled Collection.
   * @default false
   * @link https://payloadcms.com/docs/authentication/api-keys
   */
  useAPIKey?: boolean

  /**
   * Use sessions for authentication. Enabled by default.
   * @default true
   */
  useSessions?: boolean

  /**
   * Set to true or pass an object with verification options to require users to verify by email before they are allowed to log into your app.
   * @link https://payloadcms.com/docs/authentication/email#email-verification
   */
  verify?:
    | {
        generateEmailHTML?: GenerateVerifyEmailHTML
        generateEmailSubject?: GenerateVerifyEmailSubject
      }
    | boolean
}

export type VerifyConfig = {
  generateEmailHTML?: GenerateVerifyEmailHTML
  generateEmailSubject?: GenerateVerifyEmailSubject
}

export interface Auth
  extends Omit<DeepRequired<IncomingAuthType>, 'forgotPassword' | 'loginWithUsername' | 'verify'> {
  forgotPassword?: {
    expiration?: number
    generateEmailHTML?: GenerateForgotPasswordEmailHTML
    generateEmailSubject?: GenerateForgotPasswordEmailSubject
  }
  loginWithUsername: false | LoginWithUsernameOptions
  verify?: boolean | VerifyConfig
}

export function hasWhereAccessResult(result: boolean | Where): result is Where {
  return result && typeof result === 'object'
}
```

--------------------------------------------------------------------------------

---[FILE: accountLock.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/accountLock.ts

```typescript
import type { Field } from '../../fields/config/types.js'

export const accountLockFields: Field[] = [
  {
    name: 'loginAttempts',
    type: 'number',
    defaultValue: 0,
    hidden: true,
  },
  {
    name: 'lockUntil',
    type: 'date',
    hidden: true,
  },
] as Field[]
```

--------------------------------------------------------------------------------

---[FILE: apiKey.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/apiKey.ts

```typescript
import crypto from 'crypto'

import type { Field, FieldHook } from '../../fields/config/types.js'

const encryptKey: FieldHook = ({ req, value }) =>
  value ? req.payload.encrypt(value as string) : null
const decryptKey: FieldHook = ({ req, value }) =>
  value ? req.payload.decrypt(value as string) : undefined

export const apiKeyFields = [
  {
    name: 'enableAPIKey',
    type: 'checkbox',
    admin: {
      components: {
        Field: false,
      },
    },
    label: ({ t }) => t('authentication:enableAPIKey'),
  },
  {
    name: 'apiKey',
    type: 'text',
    admin: {
      components: {
        Field: false,
      },
    },
    hooks: {
      afterRead: [decryptKey],
      beforeChange: [encryptKey],
    },
    label: ({ t }) => t('authentication:apiKey'),
  },
  {
    name: 'apiKeyIndex',
    type: 'text',
    admin: {
      disabled: true,
    },
    hidden: true,
    hooks: {
      beforeValidate: [
        ({ data, req, value }) => {
          if (data?.apiKey === false || data?.apiKey === null) {
            return null
          }
          if (data?.enableAPIKey === false || data?.enableAPIKey === null) {
            return null
          }
          if (data?.apiKey) {
            return crypto
              .createHmac('sha256', req.payload.secret)
              .update(data.apiKey as string)
              .digest('hex')
          }
          return value
        },
      ],
    },
  },
] as Field[]
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/auth.ts

```typescript
import type { Field } from '../../fields/config/types.js'

export const baseAuthFields: Field[] = [
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
    name: 'salt',
    type: 'text',
    hidden: true,
  },
  {
    name: 'hash',
    type: 'text',
    hidden: true,
  },
]
```

--------------------------------------------------------------------------------

---[FILE: email.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/email.ts

```typescript
import type { EmailField } from '../../fields/config/types.js'

import { email } from '../../fields/validations.js'

export const emailFieldConfig: EmailField = {
  name: 'email',
  type: 'email',
  admin: {
    components: {
      Field: false,
    },
  },
  hooks: {
    beforeChange: [
      ({ value }) => {
        if (value) {
          return value.toLowerCase().trim()
        }
      },
    ],
  },
  label: ({ t }) => t('general:email'),
  required: true,
  unique: true,
  validate: email,
}
```

--------------------------------------------------------------------------------

---[FILE: sessions.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/sessions.ts

```typescript
import type { ArrayField } from '../../fields/config/types.js'

export const sessionsFieldConfig: ArrayField = {
  name: 'sessions',
  type: 'array',
  access: {
    read: ({ doc, req: { user } }) => {
      return user?.id === doc?.id
    },
    update: () => false,
  },
  admin: {
    disabled: true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: username.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/username.ts

```typescript
import type { TextField } from '../../fields/config/types.js'

import { username } from '../../fields/validations.js'

export const usernameFieldConfig: TextField = {
  name: 'username',
  type: 'text',
  admin: {
    components: {
      Field: false,
    },
  },
  hooks: {
    beforeChange: [
      ({ value }) => {
        if (value) {
          return value.toLowerCase().trim()
        }
      },
    ],
  },
  label: ({ t }) => t('authentication:username'),
  required: true,
  unique: true,
  validate: username,
}
```

--------------------------------------------------------------------------------

---[FILE: verification.ts]---
Location: payload-main/packages/payload/src/auth/baseFields/verification.ts

```typescript
import type { Field, FieldHook } from '../../fields/config/types.js'

const autoRemoveVerificationToken: FieldHook = ({ data, operation, originalDoc, value }) => {
  // If a user manually sets `_verified` to true,
  // and it was `false`, set _verificationToken to `null`.
  // This is useful because the admin panel
  // allows users to set `_verified` to true manually

  if (operation === 'update') {
    if (data?._verified === true && originalDoc?._verified === false) {
      return null
    }
  }

  return value
}

export const verificationFields: Field[] = [
  {
    name: '_verified',
    type: 'checkbox',
    access: {
      create: ({ req: { user } }) => Boolean(user),
      read: ({ req: { user } }) => Boolean(user),
      update: ({ req: { user } }) => Boolean(user),
    },
    admin: {
      components: {
        Field: false,
      },
    },
    label: ({ t }) => t('authentication:verified'),
  },
  {
    name: '_verificationToken',
    type: 'text',
    hidden: true,
    hooks: {
      beforeChange: [autoRemoveVerificationToken],
    },
  },
] as Field[]
```

--------------------------------------------------------------------------------

---[FILE: access.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/access.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { headersWithCors } from '../../utilities/headersWithCors.js'
import { accessOperation } from '../operations/access.js'

export const accessHandler: PayloadHandler = async (req) => {
  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  try {
    const results = await accessOperation({
      req,
    })

    return Response.json(results, {
      headers,
      status: httpStatus.OK,
    })
  } catch (e: unknown) {
    return Response.json(
      {
        error: e,
      },
      {
        headers,
        status: httpStatus.INTERNAL_SERVER_ERROR,
      },
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/forgotPassword.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { forgotPasswordOperation } from '../operations/forgotPassword.js'

export const forgotPasswordHandler: PayloadHandler = async (req) => {
  const { t } = req

  const collection = getRequestCollection(req)

  const authData = collection.config.auth?.loginWithUsername
    ? {
        email: typeof req.data?.email === 'string' ? req.data.email : '',
        username: typeof req.data?.username === 'string' ? req.data.username : '',
      }
    : {
        email: typeof req.data?.email === 'string' ? req.data.email : '',
      }

  await forgotPasswordOperation({
    collection,
    data: authData,
    disableEmail: Boolean(req.data?.disableEmail),
    expiration: typeof req.data?.expiration === 'number' ? req.data.expiration : undefined,
    req,
  })

  return Response.json(
    {
      message: t('general:success'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/index.ts

```typescript
import type { Endpoint } from '../../config/types.js'

import { wrapInternalEndpoints } from '../../utilities/wrapInternalEndpoints.js'
import { accessHandler } from './access.js'
import { forgotPasswordHandler } from './forgotPassword.js'
import { initHandler } from './init.js'
import { loginHandler } from './login.js'
import { logoutHandler } from './logout.js'
import { meHandler } from './me.js'
import { refreshHandler } from './refresh.js'
import { registerFirstUserHandler } from './registerFirstUser.js'
import { resetPasswordHandler } from './resetPassword.js'
import { unlockHandler } from './unlock.js'
import { verifyEmailHandler } from './verifyEmail.js'

export const authRootEndpoints: Endpoint[] = wrapInternalEndpoints([
  {
    handler: accessHandler,
    method: 'get',
    path: '/access',
  },
])

export const authCollectionEndpoints: Endpoint[] = wrapInternalEndpoints([
  {
    handler: forgotPasswordHandler,
    method: 'post',
    path: '/forgot-password',
  },
  {
    handler: initHandler,
    method: 'get',
    path: '/init',
  },
  {
    handler: loginHandler,
    method: 'post',
    path: '/login',
  },
  {
    handler: logoutHandler,
    method: 'post',
    path: '/logout',
  },
  {
    handler: meHandler,
    method: 'get',
    path: '/me',
  },
  {
    handler: refreshHandler,
    method: 'post',
    path: '/refresh-token',
  },
  {
    handler: registerFirstUserHandler,
    method: 'post',
    path: '/first-register',
  },
  {
    handler: resetPasswordHandler,
    method: 'post',
    path: '/reset-password',
  },
  {
    handler: unlockHandler,
    method: 'post',
    path: '/unlock',
  },
  {
    handler: verifyEmailHandler,
    method: 'post',
    path: '/verify/:id',
  },
])
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/init.ts

```typescript
import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { initOperation } from '../operations/init.js'

export const initHandler: PayloadHandler = async (req) => {
  const initialized = await initOperation({
    collection: getRequestCollection(req).config.slug,
    req,
  })

  return Response.json(
    { initialized },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/login.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { generatePayloadCookie } from '../cookies.js'
import { loginOperation } from '../operations/login.js'

export const loginHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { searchParams, t } = req
  const depth = searchParams.get('depth')
  const authData =
    collection.config.auth?.loginWithUsername !== false
      ? {
          email: typeof req.data?.email === 'string' ? req.data.email : '',
          password: typeof req.data?.password === 'string' ? req.data.password : '',
          username: typeof req.data?.username === 'string' ? req.data.username : '',
        }
      : {
          email: typeof req.data?.email === 'string' ? req.data.email : '',
          password: typeof req.data?.password === 'string' ? req.data.password : '',
        }

  const result = await loginOperation({
    collection,
    data: authData,
    depth: isNumber(depth) ? Number(depth) : undefined,
    req,
  })

  const cookie = generatePayloadCookie({
    collectionAuthConfig: collection.config.auth,
    cookiePrefix: req.payload.config.cookiePrefix,
    token: result.token!,
  })

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  return Response.json(
    {
      message: t('authentication:passed'),
      ...result,
    },
    {
      headers: headersWithCors({
        headers: new Headers({
          'Set-Cookie': cookie,
        }),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: logout.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/logout.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { generateExpiredPayloadCookie } from '../cookies.js'
import { logoutOperation } from '../operations/logout.js'

export const logoutHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { searchParams, t } = req

  const result = await logoutOperation({
    allSessions: searchParams.get('allSessions') === 'true',
    collection,
    req,
  })

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  if (!result) {
    return Response.json(
      {
        message: t('error:logoutFailed'),
      },
      {
        headers,
        status: httpStatus.BAD_REQUEST,
      },
    )
  }

  const expiredCookie = generateExpiredPayloadCookie({
    collectionAuthConfig: collection.config.auth,
    config: req.payload.config,
    cookiePrefix: req.payload.config.cookiePrefix,
  })

  headers.set('Set-Cookie', expiredCookie)

  return Response.json(
    {
      message: t('authentication:logoutSuccessful'),
    },
    {
      headers,
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: me.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/me.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'
import type { JoinParams } from '../../utilities/sanitizeJoinParams.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { isNumber } from '../../utilities/isNumber.js'
import { sanitizeJoinParams } from '../../utilities/sanitizeJoinParams.js'
import { sanitizePopulateParam } from '../../utilities/sanitizePopulateParam.js'
import { sanitizeSelectParam } from '../../utilities/sanitizeSelectParam.js'
import { extractJWT } from '../extractJWT.js'
import { meOperation } from '../operations/me.js'

export const meHandler: PayloadHandler = async (req) => {
  const { searchParams } = req
  const collection = getRequestCollection(req)
  const currentToken = extractJWT(req)
  const depthFromSearchParams = searchParams.get('depth')
  const draftFromSearchParams = searchParams.get('depth')

  const {
    depth: depthFromQuery,
    draft: draftFromQuery,
    joins,
    populate,
    select,
  } = req.query as {
    depth?: string
    draft?: string
    joins?: JoinParams
    populate?: Record<string, unknown>
    select?: Record<string, unknown>
  }

  const depth = depthFromQuery || depthFromSearchParams
  const draft = draftFromQuery || draftFromSearchParams

  const result = await meOperation({
    collection,
    currentToken: currentToken!,
    depth: isNumber(depth) ? Number(depth) : undefined,
    draft: draft === 'true',
    joins: sanitizeJoinParams(joins),
    populate: sanitizePopulateParam(populate),
    req,
    select: sanitizeSelectParam(select),
  })

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  return Response.json(
    {
      ...result,
      message: req.t('authentication:account'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: refresh.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/refresh.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { generatePayloadCookie } from '../cookies.js'
import { refreshOperation } from '../operations/refresh.js'

export const refreshHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { t } = req

  const headers = headersWithCors({
    headers: new Headers(),
    req,
  })

  const result = await refreshOperation({
    collection,
    req,
  })

  if (result.setCookie) {
    const cookie = generatePayloadCookie({
      collectionAuthConfig: collection.config.auth,
      cookiePrefix: req.payload.config.cookiePrefix,
      token: result.refreshedToken,
    })

    if (collection.config.auth.removeTokenFromResponses) {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      delete result.refreshedToken
    }

    headers.set('Set-Cookie', cookie)
  }

  return Response.json(
    {
      message: t('authentication:tokenRefreshSuccessful'),
      ...result,
    },
    {
      headers,
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: registerFirstUser.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/registerFirstUser.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { generatePayloadCookie } from '../cookies.js'
import { registerFirstUserOperation } from '../operations/registerFirstUser.js'

export const registerFirstUserHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { data, t } = req
  const authData = collection.config.auth?.loginWithUsername
    ? {
        email: typeof req.data?.email === 'string' ? req.data.email : '',
        password: typeof req.data?.password === 'string' ? req.data.password : '',
        username: typeof req.data?.username === 'string' ? req.data.username : '',
      }
    : {
        email: typeof req.data?.email === 'string' ? req.data.email : '',
        password: typeof req.data?.password === 'string' ? req.data.password : '',
      }

  const result = await registerFirstUserOperation({
    collection,
    data: {
      ...data,
      ...authData,
    },
    req,
  })

  const cookie = generatePayloadCookie({
    collectionAuthConfig: collection.config.auth,
    cookiePrefix: req.payload.config.cookiePrefix,
    token: result.token!,
  })

  return Response.json(
    {
      exp: result.exp,
      message: t('authentication:successfullyRegisteredFirstUser'),
      token: result.token,
      user: result.user,
    },
    {
      headers: headersWithCors({
        headers: new Headers({
          'Set-Cookie': cookie,
        }),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: resetPassword.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/resetPassword.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { generatePayloadCookie } from '../cookies.js'
import { resetPasswordOperation } from '../operations/resetPassword.js'

export const resetPasswordHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { searchParams, t } = req
  const depth = searchParams.get('depth')

  const result = await resetPasswordOperation({
    collection,
    data: {
      password: typeof req.data?.password === 'string' ? req.data.password : '',
      token: typeof req.data?.token === 'string' ? req.data.token : '',
    },
    depth: depth ? Number(depth) : undefined,
    req,
  })

  const cookie = generatePayloadCookie({
    collectionAuthConfig: collection.config.auth,
    cookiePrefix: req.payload.config.cookiePrefix,
    token: result.token!,
  })

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  return Response.json(
    {
      message: t('authentication:passwordResetSuccessfully'),
      ...result,
    },
    {
      headers: headersWithCors({
        headers: new Headers({
          'Set-Cookie': cookie,
        }),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: unlock.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/unlock.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollection } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { unlockOperation } from '../operations/unlock.js'

export const unlockHandler: PayloadHandler = async (req) => {
  const collection = getRequestCollection(req)
  const { t } = req

  const authData =
    collection.config.auth?.loginWithUsername !== false
      ? {
          email: typeof req.data?.email === 'string' ? req.data.email : '',
          username: typeof req.data?.username === 'string' ? req.data.username : '',
        }
      : {
          email: typeof req.data?.email === 'string' ? req.data.email : '',
        }

  await unlockOperation({
    collection,
    data: authData,
    req,
  })

  return Response.json(
    {
      message: t('general:success'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: verifyEmail.ts]---
Location: payload-main/packages/payload/src/auth/endpoints/verifyEmail.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { PayloadHandler } from '../../config/types.js'

import { getRequestCollectionWithID } from '../../utilities/getRequestEntity.js'
import { headersWithCors } from '../../utilities/headersWithCors.js'
import { verifyEmailOperation } from '../operations/verifyEmail.js'

export const verifyEmailHandler: PayloadHandler = async (req) => {
  const { id, collection } = getRequestCollectionWithID(req, { disableSanitize: true })
  const { t } = req
  await verifyEmailOperation({
    collection,
    req,
    token: id,
  })

  return Response.json(
    {
      message: t('authentication:accountVerified'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}
```

--------------------------------------------------------------------------------

---[FILE: access.ts]---
Location: payload-main/packages/payload/src/auth/operations/access.ts

```typescript
import type { PayloadRequest } from '../../types/index.js'
import type { SanitizedPermissions } from '../types.js'

import { killTransaction } from '../../utilities/killTransaction.js'
import { adminInit as adminInitTelemetry } from '../../utilities/telemetry/events/adminInit.js'
import { getAccessResults } from '../getAccessResults.js'

type Arguments = {
  req: PayloadRequest
}

export const accessOperation = async (args: Arguments): Promise<SanitizedPermissions> => {
  const { req } = args

  adminInitTelemetry(req)

  try {
    return getAccessResults({ req })
  } catch (e: unknown) {
    await killTransaction(req)
    throw e
  }
}
```

--------------------------------------------------------------------------------

````
