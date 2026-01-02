---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 180
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 180 of 695)

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

---[FILE: resetPassword.ts]---
Location: payload-main/packages/payload/src/auth/operations/resetPassword.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { Collection, DataFromCollectionSlug } from '../../collections/config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest } from '../../types/index.js'

import { buildAfterOperation } from '../../collections/operations/utilities/buildAfterOperation.js'
import { buildBeforeOperation } from '../../collections/operations/utilities/buildBeforeOperation.js'
import { APIError, Forbidden } from '../../errors/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getFieldsToSign } from '../getFieldsToSign.js'
import { jwtSign } from '../jwt.js'
import { addSessionToUser } from '../sessions.js'
import { authenticateLocalStrategy } from '../strategies/local/authenticate.js'
import { generatePasswordSaltHash } from '../strategies/local/generatePasswordSaltHash.js'

export type Result = {
  token?: string
  user: Record<string, unknown>
}

export type Arguments = {
  collection: Collection
  data: {
    password: string
    token: string
  }
  depth?: number
  overrideAccess?: boolean
  req: PayloadRequest
}

export const resetPasswordOperation = async <TSlug extends CollectionSlug>(
  args: Arguments,
): Promise<Result> => {
  const {
    collection: { config: collectionConfig },
    data,
    depth,
    overrideAccess,
    req: {
      payload: { secret },
      payload,
    },
    req,
  } = args

  if (
    !Object.prototype.hasOwnProperty.call(data, 'token') ||
    !Object.prototype.hasOwnProperty.call(data, 'password')
  ) {
    throw new APIError('Missing required data.', httpStatus.BAD_REQUEST)
  }

  if (collectionConfig.auth.disableLocalStrategy) {
    throw new Forbidden(req.t)
  }

  try {
    const shouldCommit = await initTransaction(req)

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'resetPassword',
    })

    // /////////////////////////////////////
    // Reset Password
    // /////////////////////////////////////

    const where = appendNonTrashedFilter({
      enableTrash: Boolean(collectionConfig.trash),
      trash: false,
      where: {
        resetPasswordExpiration: { greater_than: new Date().toISOString() },
        resetPasswordToken: { equals: data.token },
      },
    })

    const user = await payload.db.findOne<any>({
      collection: collectionConfig.slug,
      req,
      where,
    })

    if (!user) {
      throw new APIError('Token is either invalid or has expired.', httpStatus.FORBIDDEN)
    }

    // TODO: replace this method
    const { hash, salt } = await generatePasswordSaltHash({
      collection: collectionConfig,
      password: data.password,
      req,
    })

    user.salt = salt
    user.hash = hash

    user.resetPasswordExpiration = new Date().toISOString()

    if (collectionConfig.auth.verify) {
      user._verified = Boolean(user._verified)
    }
    // /////////////////////////////////////
    // beforeValidate - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeValidate?.length) {
      for (const hook of collectionConfig.hooks.beforeValidate) {
        await hook({
          collection: args.collection?.config,
          context: req.context,
          data: user,
          operation: 'update',
          req,
        })
      }
    }

    // /////////////////////////////////////
    // Update new password
    // /////////////////////////////////////

    // Ensure updatedAt date is always updated
    user.updatedAt = new Date().toISOString()

    const doc = await payload.db.updateOne({
      id: user.id,
      collection: collectionConfig.slug,
      data: user,
      req,
    })

    await authenticateLocalStrategy({ doc, password: data.password })

    const fieldsToSignArgs: Parameters<typeof getFieldsToSign>[0] = {
      collectionConfig,
      email: user.email,
      user,
    }

    const { sid } = await addSessionToUser({
      collectionConfig,
      payload,
      req,
      user,
    })

    if (sid) {
      fieldsToSignArgs.sid = sid
    }

    const fieldsToSign = getFieldsToSign(fieldsToSignArgs)

    // /////////////////////////////////////
    // beforeLogin - Collection
    // /////////////////////////////////////

    let userBeforeLogin = user

    if (collectionConfig.hooks?.beforeLogin?.length) {
      for (const hook of collectionConfig.hooks.beforeLogin) {
        userBeforeLogin =
          (await hook({
            collection: args.collection?.config,
            context: args.req.context,
            req: args.req,
            user: userBeforeLogin,
          })) || userBeforeLogin
      }
    }

    const { token } = await jwtSign({
      fieldsToSign,
      secret,
      tokenExpiration: collectionConfig.auth.tokenExpiration,
    })

    req.user = userBeforeLogin

    // /////////////////////////////////////
    // afterLogin - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterLogin?.length) {
      for (const hook of collectionConfig.hooks.afterLogin) {
        userBeforeLogin =
          (await hook({
            collection: args.collection?.config,
            context: args.req.context,
            req: args.req,
            token,
            user: userBeforeLogin,
          })) || userBeforeLogin
      }
    }

    const fullUser = await payload.findByID({
      id: user.id,
      collection: collectionConfig.slug,
      depth,
      overrideAccess,
      req,
      trash: false,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    if (fullUser) {
      fullUser.collection = collectionConfig.slug
      fullUser._strategy = 'local-jwt'
    }

    let result: { user: DataFromCollectionSlug<TSlug> } & Result = {
      token,
      user: fullUser,
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: args.collection?.config,
      operation: 'resetPassword',
      result,
    })

    return result
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: unlock.ts]---
Location: payload-main/packages/payload/src/auth/operations/unlock.ts

```typescript
import { status as httpStatus } from 'http-status'

import type {
  AuthOperationsFromCollectionSlug,
  Collection,
} from '../../collections/config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, Where } from '../../types/index.js'

import { buildAfterOperation } from '../../collections/operations/utilities/buildAfterOperation.js'
import { buildBeforeOperation } from '../../collections/operations/utilities/buildBeforeOperation.js'
import { APIError } from '../../errors/index.js'
import { combineQueries, Forbidden } from '../../index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { executeAccess } from '../executeAccess.js'
import { getLoginOptions } from '../getLoginOptions.js'
import { resetLoginAttempts } from '../strategies/local/resetLoginAttempts.js'

export type Arguments<TSlug extends CollectionSlug> = {
  collection: Collection
  data: AuthOperationsFromCollectionSlug<TSlug>['unlock']
  overrideAccess?: boolean
  req: PayloadRequest
}

export const unlockOperation = async <TSlug extends CollectionSlug>(
  args: Arguments<TSlug>,
): Promise<boolean> => {
  const {
    collection: { config: collectionConfig },
    overrideAccess,
    req: { locale },
    req,
  } = args

  const loginWithUsername = collectionConfig.auth.loginWithUsername

  const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername)

  const sanitizedEmail = canLoginWithEmail && (args.data?.email || '').toLowerCase().trim()
  const sanitizedUsername =
    (canLoginWithUsername &&
      'username' in args.data &&
      typeof args.data.username === 'string' &&
      args.data.username.toLowerCase().trim()) ||
    null

  if (collectionConfig.auth.disableLocalStrategy) {
    throw new Forbidden(req.t)
  }
  if (!sanitizedEmail && !sanitizedUsername) {
    throw new APIError(
      `Missing ${collectionConfig.auth.loginWithUsername ? 'username' : 'email'}.`,
      httpStatus.BAD_REQUEST,
    )
  }

  try {
    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'unlock',
    })

    const shouldCommit = await initTransaction(req)
    let whereConstraint: Where = {}

    // /////////////////////////////////////
    // Access
    // /////////////////////////////////////

    if (!overrideAccess) {
      const accessResult = await executeAccess({ req }, collectionConfig.access.unlock)

      if (accessResult && typeof accessResult === 'object') {
        whereConstraint = accessResult
      }
    }

    // /////////////////////////////////////
    // Unlock
    // /////////////////////////////////////

    if (canLoginWithEmail && sanitizedEmail) {
      whereConstraint = combineQueries(whereConstraint, {
        email: {
          equals: sanitizedEmail,
        },
      })
    } else if (canLoginWithUsername && sanitizedUsername) {
      whereConstraint = combineQueries(whereConstraint, {
        username: {
          equals: sanitizedUsername,
        },
      })
    }

    // Exclude trashed users unless `trash: true`
    whereConstraint = appendNonTrashedFilter({
      enableTrash: Boolean(collectionConfig.trash),
      trash: false,
      where: whereConstraint,
    })

    const user = await req.payload.db.findOne({
      collection: collectionConfig.slug,
      locale: locale!,
      req,
      where: whereConstraint,
    })

    let result: boolean | null = null

    if (user) {
      await resetLoginAttempts({
        collection: collectionConfig,
        doc: user,
        payload: req.payload,
        req,
      })
      result = true
    } else {
      result = null
      throw new Forbidden(req.t)
    }

    if (shouldCommit) {
      await commitTransaction(req)
    }

    result = await buildAfterOperation({
      args,
      collection: args.collection.config,
      operation: 'unlock',
      result,
    })

    return Boolean(result)
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: verifyEmail.ts]---
Location: payload-main/packages/payload/src/auth/operations/verifyEmail.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { Collection } from '../../collections/config/types.js'
import type { PayloadRequest } from '../../types/index.js'

import { APIError, Forbidden } from '../../errors/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'

export type Args = {
  collection: Collection
  req: PayloadRequest
  token: string
}

export const verifyEmailOperation = async (args: Args): Promise<boolean> => {
  const { collection, req, token } = args

  if (collection.config.auth.disableLocalStrategy) {
    throw new Forbidden(req.t)
  }
  if (!Object.prototype.hasOwnProperty.call(args, 'token')) {
    throw new APIError('Missing required data.', httpStatus.BAD_REQUEST)
  }

  try {
    const shouldCommit = await initTransaction(req)

    const where = appendNonTrashedFilter({
      enableTrash: Boolean(collection.config.trash),
      trash: false,
      where: {
        _verificationToken: { equals: token },
      },
    })

    const user = await req.payload.db.findOne<any>({
      collection: collection.config.slug,
      req,
      where,
    })

    if (!user) {
      throw new APIError('Verification token is invalid.', httpStatus.FORBIDDEN)
    }

    // Ensure updatedAt date is always updated
    user.updatedAt = new Date().toISOString()

    await req.payload.db.updateOne({
      id: user.id,
      collection: collection.config.slug,
      data: {
        ...user,
        _verificationToken: null,
        _verified: true,
      },
      req,
      returning: false,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return true
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/auth.ts

```typescript
import type { Payload } from '../../../index.js'
import type { AuthArgs, AuthResult } from '../auth.js'

import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { auth as authOperation } from '../auth.js'

export const authLocal = async (payload: Payload, options: AuthArgs): Promise<AuthResult> => {
  const { headers, req } = options

  return await authOperation({
    canSetHeaders: Boolean(options.canSetHeaders),
    headers,
    req: await createLocalReq({ req }, payload),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/forgotPassword.ts

```typescript
import type { CollectionSlug, Payload, RequestContext } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { Result } from '../forgotPassword.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { forgotPasswordOperation } from '../forgotPassword.js'

export type Options<T extends CollectionSlug> = {
  collection: T
  context?: RequestContext
  data: {
    email: string
  }
  disableEmail?: boolean
  expiration?: number
  req?: Partial<PayloadRequest>
}

export async function forgotPasswordLocal<T extends CollectionSlug>(
  payload: Payload,
  options: Options<T>,
): Promise<Result> {
  const { collection: collectionSlug, data, disableEmail, expiration } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(
        collectionSlug,
      )} can't be found. Forgot Password Operation.`,
    )
  }

  return forgotPasswordOperation({
    collection,
    data,
    disableEmail,
    expiration,
    req: await createLocalReq(options, payload),
  }) as Promise<Result>
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/login.ts

```typescript
import type {
  AuthOperationsFromCollectionSlug,
  CollectionSlug,
  DataFromCollectionSlug,
  Payload,
  RequestContext,
} from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { Result } from '../login.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { loginOperation } from '../login.js'

export type Options<TSlug extends CollectionSlug> = {
  collection: TSlug
  context?: RequestContext
  data: AuthOperationsFromCollectionSlug<TSlug>['login']
  depth?: number
  fallbackLocale?: string
  locale?: string
  overrideAccess?: boolean
  req?: Partial<PayloadRequest>
  showHiddenFields?: boolean
  trash?: boolean
}

export async function loginLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<{ user: DataFromCollectionSlug<TSlug> } & Result> {
  const {
    collection: collectionSlug,
    data,
    depth,
    overrideAccess = true,
    showHiddenFields,
  } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Login Operation.`,
    )
  }

  const args = {
    collection,
    data,
    depth,
    overrideAccess,
    req: await createLocalReq(options, payload),
    showHiddenFields,
  }

  const result = await loginOperation<TSlug>(args)

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: resetPassword.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/resetPassword.ts

```typescript
import type { CollectionSlug, Payload, RequestContext } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'
import type { Result } from '../resetPassword.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { resetPasswordOperation } from '../resetPassword.js'

export type Options<T extends CollectionSlug> = {
  collection: T
  context?: RequestContext
  data: {
    password: string
    token: string
  }
  overrideAccess: boolean
  req?: Partial<PayloadRequest>
}

export async function resetPasswordLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<Result> {
  const { collection: collectionSlug, data, overrideAccess } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(
        collectionSlug,
      )} can't be found. Reset Password Operation.`,
    )
  }

  const result = await resetPasswordOperation<TSlug>({
    collection,
    data,
    overrideAccess,
    req: await createLocalReq(options, payload),
  })

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: unlock.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/unlock.ts

```typescript
import type {
  AuthOperationsFromCollectionSlug,
  CollectionSlug,
  Payload,
  RequestContext,
} from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { unlockOperation } from '../unlock.js'

export type Options<TSlug extends CollectionSlug> = {
  collection: TSlug
  context?: RequestContext
  data: AuthOperationsFromCollectionSlug<TSlug>['unlock']
  overrideAccess: boolean
  req?: Partial<PayloadRequest>
}

export async function unlockLocal<TSlug extends CollectionSlug>(
  payload: Payload,
  options: Options<TSlug>,
): Promise<boolean> {
  const { collection: collectionSlug, data, overrideAccess = true } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Unlock Operation.`,
    )
  }

  return unlockOperation<TSlug>({
    collection,
    data,
    overrideAccess,
    req: await createLocalReq(options, payload),
  })
}
```

--------------------------------------------------------------------------------

---[FILE: verifyEmail.ts]---
Location: payload-main/packages/payload/src/auth/operations/local/verifyEmail.ts

```typescript
import type { CollectionSlug, Payload, RequestContext } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'

import { APIError } from '../../../errors/index.js'
import { createLocalReq } from '../../../utilities/createLocalReq.js'
import { verifyEmailOperation } from '../verifyEmail.js'

export type Options<T extends CollectionSlug> = {
  collection: T
  context?: RequestContext
  req?: Partial<PayloadRequest>
  token: string
}

export async function verifyEmailLocal<T extends CollectionSlug>(
  payload: Payload,
  options: Options<T>,
): Promise<boolean> {
  const { collection: collectionSlug, token } = options

  const collection = payload.collections[collectionSlug]

  if (!collection) {
    throw new APIError(
      `The collection with slug ${String(collectionSlug)} can't be found. Verify Email Operation.`,
    )
  }

  return verifyEmailOperation({
    collection,
    req: await createLocalReq(options, payload),
    token,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: apiKey.ts]---
Location: payload-main/packages/payload/src/auth/strategies/apiKey.ts

```typescript
import crypto from 'crypto'

import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { TypedUser } from '../../index.js'
import type { Where } from '../../types/index.js'
import type { AuthStrategyFunction } from '../index.js'

export const APIKeyAuthentication =
  (collectionConfig: SanitizedCollectionConfig): AuthStrategyFunction =>
  async ({ headers, isGraphQL = false, payload }) => {
    const authHeader = headers.get('Authorization')

    if (authHeader?.startsWith(`${collectionConfig.slug} API-Key `)) {
      const apiKey = authHeader.replace(`${collectionConfig.slug} API-Key `, '')

      // TODO: V4 remove extra algorithm check
      // api keys saved prior to v3.46.0 will have sha1
      const sha1APIKeyIndex = crypto.createHmac('sha1', payload.secret).update(apiKey).digest('hex')
      const sha256APIKeyIndex = crypto
        .createHmac('sha256', payload.secret)
        .update(apiKey)
        .digest('hex')

      const apiKeyConstraints = [
        {
          apiKeyIndex: {
            equals: sha1APIKeyIndex,
          },
        },
        {
          apiKeyIndex: {
            equals: sha256APIKeyIndex,
          },
        },
      ]

      try {
        const where: Where = {}
        if (collectionConfig.auth?.verify) {
          where.and = [
            {
              or: apiKeyConstraints,
            },
            {
              _verified: {
                not_equals: false,
              },
            },
          ]
        } else {
          where.or = apiKeyConstraints
        }

        const userQuery = await payload.find({
          collection: collectionConfig.slug,
          depth: isGraphQL ? 0 : collectionConfig.auth.depth,
          limit: 1,
          overrideAccess: true,
          pagination: false,
          where,
        })

        if (userQuery.docs && userQuery.docs.length > 0) {
          const user = userQuery.docs[0]
          user!.collection = collectionConfig.slug
          user!._strategy = 'api-key'

          return {
            user: user as TypedUser,
          }
        }
      } catch (ignore) {
        return { user: null }
      }
    }

    return { user: null }
  }
```

--------------------------------------------------------------------------------

---[FILE: jwt.ts]---
Location: payload-main/packages/payload/src/auth/strategies/jwt.ts

```typescript
import { jwtVerify } from 'jose'

import type { Payload, Where } from '../../types/index.js'
import type { AuthStrategyFunction, AuthStrategyResult } from '../index.js'

import { extractJWT } from '../extractJWT.js'

type JWTToken = {
  collection: string
  id: string
  sid?: string
}

async function autoLogin({
  isGraphQL,
  payload,
  strategyName = 'local-jwt',
}: {
  isGraphQL: boolean
  payload: Payload
  strategyName?: string
}): Promise<{
  user: AuthStrategyResult['user']
}> {
  if (
    typeof payload?.config?.admin?.autoLogin !== 'object' ||
    payload.config.admin?.autoLogin.prefillOnly ||
    !payload?.config?.admin?.autoLogin ||
    (!payload.config.admin?.autoLogin.email && !payload.config.admin?.autoLogin.username)
  ) {
    return { user: null }
  }

  const collection = payload.collections[payload.config.admin.user]

  const where: Where = {
    or: [],
  }
  if (payload.config.admin?.autoLogin.email) {
    where.or?.push({
      email: {
        equals: payload.config.admin?.autoLogin.email,
      },
    })
  } else if (payload.config.admin?.autoLogin.username) {
    where.or?.push({
      username: {
        equals: payload.config.admin?.autoLogin.username,
      },
    })
  }

  const user = (
    await payload.find({
      collection: collection!.config.slug,
      depth: isGraphQL ? 0 : collection!.config.auth.depth,
      limit: 1,
      pagination: false,
      where,
    })
  ).docs[0] as AuthStrategyResult['user']

  if (!user) {
    return { user: null }
  }
  user.collection = collection!.config.slug
  user._strategy = strategyName

  return {
    user,
  }
}

/**
 * Authentication strategy function for JWT tokens
 */
export const JWTAuthentication: AuthStrategyFunction = async ({
  headers,
  isGraphQL = false,
  payload,
  strategyName = 'local-jwt',
}) => {
  try {
    const token = extractJWT({ headers, payload })

    if (!token) {
      if (headers.get('DisableAutologin') !== 'true') {
        return await autoLogin({ isGraphQL, payload, strategyName })
      }
      return { user: null }
    }

    const secretKey = new TextEncoder().encode(payload.secret)
    const { payload: decodedPayload } = await jwtVerify<JWTToken>(token, secretKey)
    const collection = payload.collections[decodedPayload.collection]

    const user = (await payload.findByID({
      id: decodedPayload.id,
      collection: decodedPayload.collection,
      depth: isGraphQL ? 0 : collection!.config.auth.depth,
    })) as AuthStrategyResult['user']

    if (user && (!collection!.config.auth.verify || user._verified)) {
      if (collection!.config.auth.useSessions) {
        const existingSession = (user.sessions || []).find(({ id }) => id === decodedPayload.sid)

        if (!existingSession || !decodedPayload.sid) {
          return {
            user: null,
          }
        }

        user._sid = decodedPayload.sid
      }

      user.collection = collection!.config.slug
      user._strategy = strategyName
      return {
        user,
      }
    } else {
      if (headers.get('DisableAutologin') !== 'true') {
        return await autoLogin({ isGraphQL, payload, strategyName })
      }
      return { user: null }
    }
  } catch (ignore) {
    if (headers.get('DisableAutologin') !== 'true') {
      return await autoLogin({ isGraphQL, payload, strategyName })
    }
    return { user: null }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: authenticate.ts]---
Location: payload-main/packages/payload/src/auth/strategies/local/authenticate.ts

```typescript
// @ts-strict-ignore
import crypto from 'crypto'
// @ts-expect-error - no types available
import scmp from 'scmp'

import type { TypeWithID } from '../../../collections/config/types.js'

type Doc = Record<string, unknown> & TypeWithID

type Args = {
  doc: Doc
  password: string
}

export const authenticateLocalStrategy = async ({ doc, password }: Args): Promise<Doc | null> => {
  try {
    const { hash, salt } = doc

    if (typeof salt === 'string' && typeof hash === 'string') {
      const res = await new Promise<Doc | null>((resolve, reject) => {
        crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (e, hashBuffer) => {
          if (e) {
            reject(e)
          }

          if (scmp(hashBuffer, Buffer.from(hash, 'hex'))) {
            resolve(doc)
          } else {
            reject(new Error('Invalid password'))
          }
        })
      })

      return res
    }

    return null
  } catch (ignore) {
    return null
  }
}
```

--------------------------------------------------------------------------------

---[FILE: generatePasswordSaltHash.ts]---
Location: payload-main/packages/payload/src/auth/strategies/local/generatePasswordSaltHash.ts

```typescript
import crypto from 'crypto'

import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { PayloadRequest } from '../../../types/index.js'

import { ValidationError } from '../../../errors/index.js'
import { password } from '../../../fields/validations.js'

function randomBytes(): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    crypto.randomBytes(32, (err, saltBuffer) => (err ? reject(err) : resolve(saltBuffer))),
  )
}

function pbkdf2Promisified(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hashRaw) =>
      err ? reject(err) : resolve(hashRaw),
    ),
  )
}

type Args = {
  collection: SanitizedCollectionConfig
  password: string
  req: PayloadRequest
}

export const generatePasswordSaltHash = async ({
  collection,
  password: passwordToSet,
  req,
}: Args): Promise<{ hash: string; salt: string }> => {
  const validationResult = password(passwordToSet, {
    name: 'password',
    type: 'text',
    blockData: {},
    data: {},
    event: 'submit',
    path: ['password'],
    preferences: { fields: {} },
    req,
    required: true,
    siblingData: {},
  })

  if (typeof validationResult === 'string') {
    throw new ValidationError({
      collection: collection?.slug,
      errors: [{ message: validationResult, path: 'password' }],
    })
  }

  const saltBuffer = await randomBytes()
  const salt = saltBuffer.toString('hex')

  const hashRaw = await pbkdf2Promisified(passwordToSet, salt)
  const hash = hashRaw.toString('hex')

  return { hash, salt }
}
```

--------------------------------------------------------------------------------

---[FILE: incrementLoginAttempts.ts]---
Location: payload-main/packages/payload/src/auth/strategies/local/incrementLoginAttempts.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { PayloadRequest } from '../../../types/index.js'

import { type JsonObject, type Payload, type TypedUser } from '../../../index.js'
import { isUserLocked } from '../../isUserLocked.js'

type Args = {
  collection: SanitizedCollectionConfig
  payload: Payload
  req: PayloadRequest
  user: TypedUser
}

// Note: this function does not use req in most updates, as we want those to be visible in parallel requests that are on a different
// transaction. At the same time, we want updates from parallel requests to be visible here.
export const incrementLoginAttempts = async ({
  collection,
  payload,
  req,
  user,
}: Args): Promise<void> => {
  const {
    auth: { lockTime, maxLoginAttempts },
  } = collection

  const currentTime = Date.now()

  let updatedLockUntil: null | string = null
  let updatedLoginAttempts: null | number = null

  if (user.lockUntil && !isUserLocked(new Date(user.lockUntil))) {
    // Expired lock, restart count at 1
    const updatedUser = await payload.db.updateOne({
      id: user.id,
      collection: collection.slug,
      data: {
        lockUntil: null,
        loginAttempts: 1,
      },
      req,
      select: {
        lockUntil: true,
        loginAttempts: true,
      },
    })
    updatedLockUntil = updatedUser.lockUntil
    updatedLoginAttempts = updatedUser.loginAttempts
    user.lockUntil = updatedLockUntil
  } else {
    const data: JsonObject = {
      loginAttempts: {
        $inc: 1,
      },
    }

    const willReachMaxAttempts =
      typeof user.loginAttempts === 'number' && user.loginAttempts + 1 >= maxLoginAttempts
    // Lock the account if at max attempts and not already locked
    if (willReachMaxAttempts) {
      const lockUntil = new Date(currentTime + lockTime).toISOString()
      data.lockUntil = lockUntil
    }

    const updatedUser = await payload.db.updateOne({
      id: user.id,
      collection: collection.slug,
      data,
      select: {
        lockUntil: true,
        loginAttempts: true,
      },
    })

    updatedLockUntil = updatedUser.lockUntil
    updatedLoginAttempts = updatedUser.loginAttempts
  }

  if (updatedLoginAttempts === null) {
    throw new Error('Failed to update login attempts or lockUntil for user')
  }

  // Check updated latest lockUntil and loginAttempts in case there were parallel updates
  const reachedMaxAttemptsForCurrentUser =
    typeof updatedLoginAttempts === 'number' && updatedLoginAttempts - 1 >= maxLoginAttempts

  const reachedMaxAttemptsForNextUser =
    typeof updatedLoginAttempts === 'number' && updatedLoginAttempts >= maxLoginAttempts

  if (reachedMaxAttemptsForCurrentUser) {
    user.lockUntil = updatedLockUntil
  }
  user.loginAttempts = updatedLoginAttempts - 1 // -1, as the updated increment is applied for the *next* login attempt, not the current one

  if (
    reachedMaxAttemptsForNextUser &&
    (!updatedLockUntil || !isUserLocked(new Date(updatedLockUntil)))
  ) {
    // If lockUntil reached max login attempts due to multiple parallel attempts but user was not locked yet,
    const newLockUntil = new Date(currentTime + lockTime).toISOString()

    await payload.db.updateOne({
      id: user.id,
      collection: collection.slug,
      data: {
        lockUntil: newLockUntil,
      },
      returning: false,
    })

    if (reachedMaxAttemptsForCurrentUser) {
      user.lockUntil = newLockUntil
    }

    if (collection.auth.useSessions) {
      // Remove all active sessions that have been created in a 20 second window. This protects
      // against brute force attacks - example: 99 incorrect, 1 correct parallel login attempts.
      // The correct login attempt will be finished first, as it's faster due to not having to perform
      // an additional db update here.
      // However, this request (the incorrect login attempt request) can kill the successful login attempt here.

      // Fetch user sessions separately (do not do this in the updateOne select in order to preserve the returning: true db call optimization)
      const currentUser = await payload.db.findOne<TypedUser>({
        collection: collection.slug,
        select: {
          sessions: true,
        },
        where: {
          id: {
            equals: user.id,
          },
        },
      })
      if (currentUser?.sessions?.length) {
        // Does not hurt also removing expired sessions
        currentUser.sessions = currentUser.sessions.filter((session) => {
          const sessionCreatedAt = new Date(session.createdAt)
          const twentySecondsAgo = new Date(currentTime - 20000)

          // Remove sessions created within the last 20 seconds
          return sessionCreatedAt <= twentySecondsAgo
        })

        user.sessions = currentUser.sessions

        // Ensure updatedAt date is always updated
        user.updatedAt = new Date().toISOString()

        await payload.db.updateOne({
          id: user.id,
          collection: collection.slug,
          data: user,
          returning: false,
        })
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: register.ts]---
Location: payload-main/packages/payload/src/auth/strategies/local/register.ts

```typescript
import type { SanitizedCollectionConfig } from '../../../collections/config/types.js'
import type { JsonObject, Payload } from '../../../index.js'
import type { PayloadRequest, SelectType, Where } from '../../../types/index.js'

import { ValidationError } from '../../../errors/index.js'
import { getLoginOptions } from '../../getLoginOptions.js'
import { generatePasswordSaltHash } from './generatePasswordSaltHash.js'

type Args = {
  collection: SanitizedCollectionConfig
  doc: JsonObject
  password: string
  payload: Payload
  req: PayloadRequest
}

export const registerLocalStrategy = async ({
  collection,
  doc,
  password,
  payload,
  req,
}: Args): Promise<Record<string, unknown>> => {
  const loginWithUsername = collection?.auth?.loginWithUsername

  const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername)

  let whereConstraint: Where

  if (!canLoginWithUsername) {
    whereConstraint = {
      email: {
        equals: doc.email,
      },
    }
  } else {
    whereConstraint = {
      or: [],
    }

    if (canLoginWithEmail && doc.email) {
      whereConstraint.or?.push({
        email: {
          equals: doc.email,
        },
      })
    }

    if (doc.username) {
      whereConstraint.or?.push({
        username: {
          equals: doc.username,
        },
      })
    }
  }

  const existingUser = await payload.find({
    collection: collection.slug,
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: whereConstraint,
  })

  if (existingUser.docs.length > 0) {
    throw new ValidationError({
      collection: collection.slug,
      errors: [
        canLoginWithUsername
          ? {
              message: req.t('error:usernameAlreadyRegistered'),
              path: 'username',
            }
          : { message: req.t('error:userEmailAlreadyRegistered'), path: 'email' },
      ],
    })
  }

  const { hash, salt } = await generatePasswordSaltHash({ collection, password, req })

  const sanitizedDoc = { ...doc }
  if (sanitizedDoc.password) {
    delete sanitizedDoc.password
  }

  return payload.db.create({
    collection: collection.slug,
    data: {
      ...sanitizedDoc,
      hash,
      salt,
    },
    req,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: resetLoginAttempts.ts]---
Location: payload-main/packages/payload/src/auth/strategies/local/resetLoginAttempts.ts

```typescript
import type { SanitizedCollectionConfig, TypeWithID } from '../../../collections/config/types.js'
import type { Payload } from '../../../index.js'
import type { PayloadRequest } from '../../../types/index.js'

type Args = {
  collection: SanitizedCollectionConfig
  doc: Record<string, unknown> & TypeWithID
  payload: Payload
  req: PayloadRequest
}

export const resetLoginAttempts = async ({
  collection,
  doc,
  payload,
  req,
}: Args): Promise<void> => {
  if (
    !('lockUntil' in doc && typeof doc.lockUntil === 'string') &&
    (!('loginAttempts' in doc) || doc.loginAttempts === 0)
  ) {
    return
  }
  await payload.db.updateOne({
    id: doc.id,
    collection: collection.slug,
    data: {
      lockUntil: null,
      loginAttempts: 0,
    },
    req,
    returning: false,
  })
}
```

--------------------------------------------------------------------------------

````
