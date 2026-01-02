---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 179
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 179 of 695)

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

---[FILE: auth.ts]---
Location: payload-main/packages/payload/src/auth/operations/auth.ts

```typescript
import type { SanitizedPermissions, TypedUser } from '../../index.js'
import type { PayloadRequest } from '../../types/index.js'

import { killTransaction } from '../../utilities/killTransaction.js'
import { executeAuthStrategies } from '../executeAuthStrategies.js'
import { getAccessResults } from '../getAccessResults.js'

export type AuthArgs = {
  /**
   * Specify if it's possible for auth strategies to set headers within this operation.
   */
  canSetHeaders?: boolean
  headers: Request['headers']
  req?: Omit<PayloadRequest, 'user'>
}

export type AuthResult = {
  permissions: SanitizedPermissions
  responseHeaders?: Headers
  user: null | TypedUser
}

export const auth = async (args: Required<AuthArgs>): Promise<AuthResult> => {
  const { canSetHeaders, headers } = args
  const req = args.req as PayloadRequest
  const { payload } = req

  try {
    const { responseHeaders, user } = await executeAuthStrategies({
      canSetHeaders,
      headers,
      payload,
    })

    req.user = user
    req.responseHeaders = responseHeaders

    const permissions = await getAccessResults({
      req,
    })

    return {
      permissions,
      responseHeaders,
      user,
    }
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: forgotPassword.ts]---
Location: payload-main/packages/payload/src/auth/operations/forgotPassword.ts

```typescript
import crypto from 'crypto'
import { status as httpStatus } from 'http-status'
import { URL } from 'url'

import type {
  AuthOperationsFromCollectionSlug,
  Collection,
} from '../../collections/config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, Where } from '../../types/index.js'

import { buildAfterOperation } from '../../collections/operations/utilities/buildAfterOperation.js'
import { buildBeforeOperation } from '../../collections/operations/utilities/buildBeforeOperation.js'
import { APIError } from '../../errors/index.js'
import { Forbidden } from '../../index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { formatAdminURL } from '../../utilities/formatAdminURL.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getLoginOptions } from '../getLoginOptions.js'

export type Arguments<TSlug extends CollectionSlug> = {
  collection: Collection
  data: {
    [key: string]: unknown
  } & AuthOperationsFromCollectionSlug<TSlug>['forgotPassword']
  disableEmail?: boolean
  expiration?: number
  req: PayloadRequest
}

export type Result = string

export const forgotPasswordOperation = async <TSlug extends CollectionSlug>(
  incomingArgs: Arguments<TSlug>,
): Promise<null | string> => {
  const loginWithUsername = incomingArgs.collection.config.auth.loginWithUsername
  const { data } = incomingArgs

  const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername)

  const sanitizedEmail =
    (canLoginWithEmail && (incomingArgs.data.email || '').toLowerCase().trim()) || null
  const sanitizedUsername =
    'username' in data && typeof data?.username === 'string'
      ? data.username.toLowerCase().trim()
      : null

  let args = incomingArgs

  if (incomingArgs.collection.config.auth.disableLocalStrategy) {
    throw new Forbidden(incomingArgs.req.t)
  }
  if (!sanitizedEmail && !sanitizedUsername) {
    throw new APIError(
      `Missing ${loginWithUsername ? 'username' : 'email'}.`,
      httpStatus.BAD_REQUEST,
    )
  }

  try {
    const shouldCommit = await initTransaction(args.req)

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////
    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'forgotPassword',
    })

    const {
      collection: { config: collectionConfig },
      disableEmail,
      expiration,
      req: {
        payload: { config, email },
        payload,
      },
      req,
    } = args

    // /////////////////////////////////////
    // Forget password
    // /////////////////////////////////////

    let token: string = crypto.randomBytes(20).toString('hex')
    type UserDoc = {
      email?: string
      id: number | string
      resetPasswordExpiration?: string
      resetPasswordToken?: string
    }

    if (!sanitizedEmail && !sanitizedUsername) {
      throw new APIError(
        `Missing ${loginWithUsername ? 'username' : 'email'}.`,
        httpStatus.BAD_REQUEST,
      )
    }

    let whereConstraint: Where = {}

    if (canLoginWithEmail && sanitizedEmail) {
      whereConstraint = {
        email: {
          equals: sanitizedEmail,
        },
      }
    } else if (canLoginWithUsername && sanitizedUsername) {
      whereConstraint = {
        username: {
          equals: sanitizedUsername,
        },
      }
    }

    // Exclude trashed users unless `trash: true`
    whereConstraint = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash: false,
      where: whereConstraint,
    })

    let user = await payload.db.findOne<UserDoc>({
      collection: collectionConfig.slug,
      req,
      where: whereConstraint,
    })

    // We don't want to indicate specifically that an email was not found,
    // as doing so could lead to the exposure of registered emails.
    // Therefore, we prefer to fail silently.
    if (!user) {
      await commitTransaction(args.req)
      return null
    }

    const resetPasswordExpiration = new Date(
      Date.now() + (collectionConfig.auth?.forgotPassword?.expiration ?? expiration ?? 3600000),
    ).toISOString()

    user = await payload.update({
      id: user.id,
      collection: collectionConfig.slug,
      data: {
        resetPasswordExpiration,
        resetPasswordToken: token,
      },
      req,
    })

    if (!disableEmail && user.email) {
      const protocol = new URL(req.url!).protocol // includes the final :
      const serverURL =
        config.serverURL !== null && config.serverURL !== ''
          ? config.serverURL
          : `${protocol}//${req.headers.get('host')}`
      const forgotURL = formatAdminURL({
        adminRoute: config.routes.admin,
        path: `${config.admin.routes.reset}/${token}`,
        serverURL,
      })
      let html = `${req.t('authentication:youAreReceivingResetPassword')}
    <a href="${forgotURL}">${forgotURL}</a>
    ${req.t('authentication:youDidNotRequestPassword')}`

      if (typeof collectionConfig.auth.forgotPassword?.generateEmailHTML === 'function') {
        html = await collectionConfig.auth.forgotPassword.generateEmailHTML({
          req,
          token,
          user,
        })
      }

      let subject = req.t('authentication:resetYourPassword')

      if (typeof collectionConfig.auth.forgotPassword?.generateEmailSubject === 'function') {
        subject = await collectionConfig.auth.forgotPassword.generateEmailSubject({
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

    // /////////////////////////////////////
    // afterForgotPassword - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterForgotPassword?.length) {
      for (const hook of collectionConfig.hooks.afterForgotPassword) {
        await hook({ args, collection: args.collection?.config, context: req.context })
      }
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    token = await buildAfterOperation({
      args,
      collection: args.collection?.config,
      operation: 'forgotPassword',
      result: token,
    })

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return token
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: payload-main/packages/payload/src/auth/operations/init.ts

```typescript
import type { PayloadRequest, Where } from '../../types/index.js'

import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'

export const initOperation = async (args: {
  collection: string
  req: PayloadRequest
}): Promise<boolean> => {
  const { collection: slug, req } = args

  const collectionConfig = req.payload.config.collections?.find((c) => c.slug === slug)

  // Exclude trashed documents unless `trash: true`
  const where: Where = appendNonTrashedFilter({
    enableTrash: Boolean(collectionConfig?.trash),
    trash: false,
    where: {},
  })

  const doc = await req.payload.db.findOne({
    collection: slug,
    req,
    where,
  })

  return !!doc
}
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/payload/src/auth/operations/login.ts

```typescript
import type {
  AuthOperationsFromCollectionSlug,
  Collection,
  DataFromCollectionSlug,
} from '../../collections/config/types.js'
import type { CollectionSlug, TypedUser } from '../../index.js'
import type { PayloadRequest, Where } from '../../types/index.js'

import { buildAfterOperation } from '../../collections/operations/utilities/buildAfterOperation.js'
import { buildBeforeOperation } from '../../collections/operations/utilities/buildBeforeOperation.js'
import {
  AuthenticationError,
  LockedAuth,
  UnverifiedEmail,
  ValidationError,
} from '../../errors/index.js'
import { afterRead } from '../../fields/hooks/afterRead/index.js'
import { Forbidden } from '../../index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { sanitizeInternalFields } from '../../utilities/sanitizeInternalFields.js'
import { getFieldsToSign } from '../getFieldsToSign.js'
import { getLoginOptions } from '../getLoginOptions.js'
import { isUserLocked } from '../isUserLocked.js'
import { jwtSign } from '../jwt.js'
import { addSessionToUser } from '../sessions.js'
import { authenticateLocalStrategy } from '../strategies/local/authenticate.js'
import { incrementLoginAttempts } from '../strategies/local/incrementLoginAttempts.js'
import { resetLoginAttempts } from '../strategies/local/resetLoginAttempts.js'

export type Result = {
  exp?: number
  token?: string
  user?: TypedUser
}

export type Arguments<TSlug extends CollectionSlug> = {
  collection: Collection
  data: AuthOperationsFromCollectionSlug<TSlug>['login']
  depth?: number
  overrideAccess?: boolean
  req: PayloadRequest
  showHiddenFields?: boolean
}

type CheckLoginPermissionArgs = {
  loggingInWithUsername?: boolean
  req: PayloadRequest
  user: any
}

/**
 * Throws an error if the user is locked or does not exist.
 * This does not check the login attempts, only the lock status. Whoever increments login attempts
 * is responsible for locking the user properly, not whoever checks the login permission.
 */
export const checkLoginPermission = ({
  loggingInWithUsername,
  req,
  user,
}: CheckLoginPermissionArgs) => {
  if (!user) {
    throw new AuthenticationError(req.t, Boolean(loggingInWithUsername))
  }

  if (isUserLocked(new Date(user.lockUntil))) {
    throw new LockedAuth(req.t)
  }
}

export const loginOperation = async <TSlug extends CollectionSlug>(
  incomingArgs: Arguments<TSlug>,
): Promise<{ user: DataFromCollectionSlug<TSlug> } & Result> => {
  let args = incomingArgs

  if (args.collection.config.auth.disableLocalStrategy) {
    throw new Forbidden(args.req.t)
  }

  try {
    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'login',
    })

    const {
      collection: { config: collectionConfig },
      data,
      depth,
      overrideAccess,
      req,
      req: {
        fallbackLocale,
        locale,
        payload,
        payload: { secret },
      },
      showHiddenFields,
    } = args

    // /////////////////////////////////////
    // Login
    // /////////////////////////////////////

    const { email: unsanitizedEmail, password } = data
    const loginWithUsername = collectionConfig.auth.loginWithUsername

    const sanitizedEmail =
      typeof unsanitizedEmail === 'string' ? unsanitizedEmail.toLowerCase().trim() : null
    const sanitizedUsername =
      'username' in data && typeof data?.username === 'string'
        ? data.username.toLowerCase().trim()
        : null

    const { canLoginWithEmail, canLoginWithUsername } = getLoginOptions(loginWithUsername)

    // cannot login with email, did not provide username
    if (!canLoginWithEmail && !sanitizedUsername) {
      throw new ValidationError({
        collection: collectionConfig.slug,
        errors: [{ message: req.i18n.t('validation:required'), path: 'username' }],
      })
    }

    // cannot login with username, did not provide email
    if (!canLoginWithUsername && !sanitizedEmail) {
      throw new ValidationError({
        collection: collectionConfig.slug,
        errors: [{ message: req.i18n.t('validation:required'), path: 'email' }],
      })
    }

    // can login with either email or username, did not provide either
    if (!sanitizedUsername && !sanitizedEmail) {
      throw new ValidationError({
        collection: collectionConfig.slug,
        errors: [
          { message: req.i18n.t('validation:required'), path: 'email' },
          { message: req.i18n.t('validation:required'), path: 'username' },
        ],
      })
    }

    // did not provide password for login
    if (typeof password !== 'string' || password.trim() === '') {
      throw new ValidationError({
        collection: collectionConfig.slug,
        errors: [{ message: req.i18n.t('validation:required'), path: 'password' }],
      })
    }

    let whereConstraint: Where = {}
    const emailConstraint: Where = {
      email: {
        equals: sanitizedEmail,
      },
    }
    const usernameConstraint: Where = {
      username: {
        equals: sanitizedUsername,
      },
    }

    if (canLoginWithEmail && canLoginWithUsername && (sanitizedUsername || sanitizedEmail)) {
      if (sanitizedUsername) {
        whereConstraint = {
          or: [
            usernameConstraint,
            {
              email: {
                equals: sanitizedUsername,
              },
            },
          ],
        }
      } else {
        whereConstraint = {
          or: [
            emailConstraint,
            {
              username: {
                equals: sanitizedEmail,
              },
            },
          ],
        }
      }
    } else if (canLoginWithEmail && sanitizedEmail) {
      whereConstraint = emailConstraint
    } else if (canLoginWithUsername && sanitizedUsername) {
      whereConstraint = usernameConstraint
    }

    // Exclude trashed users
    whereConstraint = appendNonTrashedFilter({
      enableTrash: collectionConfig.trash,
      trash: false,
      where: whereConstraint,
    })

    let user = (await payload.db.findOne<TypedUser>({
      collection: collectionConfig.slug,
      req,
      where: whereConstraint,
    })) as TypedUser

    checkLoginPermission({
      loggingInWithUsername: Boolean(canLoginWithUsername && sanitizedUsername),
      req,
      user,
    })

    user.collection = collectionConfig.slug
    user._strategy = 'local-jwt'

    const authResult = await authenticateLocalStrategy({ doc: user, password })
    user = sanitizeInternalFields(user)

    const maxLoginAttemptsEnabled = args.collection.config.auth.maxLoginAttempts > 0

    if (!authResult) {
      if (maxLoginAttemptsEnabled) {
        await incrementLoginAttempts({
          collection: collectionConfig,
          payload: req.payload,
          req,
          user,
        })

        // Re-check login permissions and max attempts after incrementing attempts, in case parallel updates occurred
        checkLoginPermission({
          loggingInWithUsername: Boolean(canLoginWithUsername && sanitizedUsername),
          req,
          user,
        })
      }

      throw new AuthenticationError(req.t)
    }

    if (collectionConfig.auth.verify && user._verified === false) {
      throw new UnverifiedEmail({ t: req.t })
    }

    /*
     * Correct password accepted - re‑check that the account didn't
     * get locked by parallel bad attempts in the meantime.
     */
    if (maxLoginAttemptsEnabled) {
      const { lockUntil, loginAttempts } = (await payload.db.findOne<TypedUser>({
        collection: collectionConfig.slug,
        req,
        select: {
          lockUntil: true,
          loginAttempts: true,
        },
        where: { id: { equals: user.id } },
      }))!

      user.lockUntil = lockUntil
      user.loginAttempts = loginAttempts

      checkLoginPermission({
        req,
        user,
      })
    }

    const fieldsToSignArgs: Parameters<typeof getFieldsToSign>[0] = {
      collectionConfig,
      email: sanitizedEmail!,
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

    if (maxLoginAttemptsEnabled) {
      await resetLoginAttempts({
        collection: collectionConfig,
        doc: user,
        payload: req.payload,
        req,
      })
    }

    // /////////////////////////////////////
    // beforeLogin - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.beforeLogin?.length) {
      for (const hook of collectionConfig.hooks.beforeLogin) {
        user =
          (await hook({
            collection: args.collection?.config,
            context: args.req.context,
            req: args.req,
            user,
          })) || user
      }
    }

    const { exp, token } = await jwtSign({
      fieldsToSign,
      secret,
      tokenExpiration: collectionConfig.auth.tokenExpiration,
    })

    req.user = user

    // /////////////////////////////////////
    // afterLogin - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterLogin?.length) {
      for (const hook of collectionConfig.hooks.afterLogin) {
        user =
          (await hook({
            collection: args.collection?.config,
            context: args.req.context,
            req: args.req,
            token,
            user,
          })) || user
      }
    }

    // /////////////////////////////////////
    // afterRead - Fields
    // /////////////////////////////////////

    user = await afterRead({
      collection: collectionConfig,
      context: req.context,
      depth: depth!,
      doc: user,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      draft: undefined,
      fallbackLocale: fallbackLocale!,
      global: null,
      locale: locale!,
      overrideAccess: overrideAccess!,
      req,
      showHiddenFields: showHiddenFields!,
    })

    // /////////////////////////////////////
    // afterRead - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterRead?.length) {
      for (const hook of collectionConfig.hooks.afterRead) {
        user =
          (await hook({
            collection: args.collection?.config,
            context: req.context,
            doc: user,
            req,
          })) || user
      }
    }

    let result: { user: DataFromCollectionSlug<TSlug> } & Result = {
      exp,
      token,
      user,
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: args.collection?.config,
      operation: 'login',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    return result
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: logout.ts]---
Location: payload-main/packages/payload/src/auth/operations/logout.ts

```typescript
import { status as httpStatus } from 'http-status'

import type { Collection } from '../../collections/config/types.js'
import type { PayloadRequest } from '../../types/index.js'

import { APIError } from '../../errors/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'

export type Arguments = {
  allSessions?: boolean
  collection: Collection
  req: PayloadRequest
}

export const logoutOperation = async (incomingArgs: Arguments): Promise<boolean> => {
  let args = incomingArgs
  const {
    allSessions,
    collection: { config: collectionConfig },
    req: { user },
    req,
  } = incomingArgs

  if (!user) {
    throw new APIError('No User', httpStatus.BAD_REQUEST)
  }
  if (user.collection !== collectionConfig.slug) {
    throw new APIError('Incorrect collection', httpStatus.FORBIDDEN)
  }

  if (collectionConfig.hooks?.afterLogout?.length) {
    for (const hook of collectionConfig.hooks.afterLogout) {
      args =
        (await hook({
          collection: args.collection?.config,
          context: req.context,
          req,
        })) || args
    }
  }

  if (collectionConfig.auth.disableLocalStrategy !== true && collectionConfig.auth.useSessions) {
    const where = appendNonTrashedFilter({
      enableTrash: Boolean(collectionConfig.trash),
      trash: false,
      where: {
        id: {
          equals: user.id,
        },
      },
    })

    const userWithSessions = await req.payload.db.findOne<{
      id: number | string
      sessions: { id: string }[]
    }>({
      collection: collectionConfig.slug,
      req,
      where,
    })

    if (!userWithSessions) {
      throw new APIError('No User', httpStatus.BAD_REQUEST)
    }

    if (allSessions) {
      userWithSessions.sessions = []
    } else {
      const sessionsAfterLogout = (userWithSessions?.sessions || []).filter(
        (s) => s.id !== req?.user?._sid,
      )

      userWithSessions.sessions = sessionsAfterLogout
    }

    // Prevent updatedAt from being updated when only removing a session
    ;(userWithSessions as any).updatedAt = null

    await req.payload.db.updateOne({
      id: user.id,
      collection: collectionConfig.slug,
      data: userWithSessions,
      returning: false,
    })
  }

  return true
}
```

--------------------------------------------------------------------------------

---[FILE: me.ts]---
Location: payload-main/packages/payload/src/auth/operations/me.ts

```typescript
import { decodeJwt } from 'jose'

import type { Collection } from '../../collections/config/types.js'
import type { TypedUser } from '../../index.js'
import type { JoinQuery, PayloadRequest, PopulateType, SelectType } from '../../types/index.js'
import type { ClientUser } from '../types.js'

export type MeOperationResult = {
  collection?: string
  exp?: number
  /** @deprecated
   * use:
   * ```ts
   * user._strategy
   * ```
   */
  strategy?: string
  token?: string
  user?: ClientUser
}

export type Arguments = {
  collection: Collection
  currentToken?: string
  depth?: number
  draft?: boolean
  joins?: JoinQuery
  populate?: PopulateType
  req: PayloadRequest
  select?: SelectType
}

export const meOperation = async (args: Arguments): Promise<MeOperationResult> => {
  const { collection, currentToken, depth, draft, joins, populate, req, select } = args

  let result: MeOperationResult = {
    user: null!,
  }

  if (req.user) {
    const { pathname } = req
    const isGraphQL = pathname === `/api${req.payload.config.routes.graphQL}`

    const user = (await req.payload.findByID({
      id: req.user.id,
      collection: collection.config.slug,
      depth: isGraphQL ? 0 : (depth ?? collection.config.auth.depth),
      draft,
      joins,
      overrideAccess: false,
      populate,
      req,
      select,
      showHiddenFields: false,
    })) as TypedUser

    if (user) {
      user.collection = collection.config.slug
      user._strategy = req.user._strategy
    }

    if (req.user.collection !== collection.config.slug) {
      return {
        user: null!,
      }
    }

    // /////////////////////////////////////
    // me hook - Collection
    // /////////////////////////////////////

    for (const meHook of collection.config.hooks.me) {
      const hookResult = await meHook({ args, user })

      if (hookResult) {
        result.user = hookResult.user
        result.exp = hookResult.exp

        break
      }
    }

    result.collection = req.user.collection
    /** @deprecated
     * use:
     * ```ts
     * user._strategy
     * ```
     */
    result.strategy = req.user._strategy

    if (!result.user) {
      result.user = user

      if (currentToken) {
        const decoded = decodeJwt(currentToken)
        if (decoded) {
          result.exp = decoded.exp
        }
        if (!collection.config.auth.removeTokenFromResponses) {
          result.token = currentToken
        }
      }
    }
  }

  // /////////////////////////////////////
  // After Me - Collection
  // /////////////////////////////////////

  if (collection.config.hooks?.afterMe?.length) {
    for (const hook of collection.config.hooks.afterMe) {
      result =
        (await hook({
          collection: collection?.config,
          context: req.context,
          req,
          response: result,
        })) || result
    }
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: refresh.ts]---
Location: payload-main/packages/payload/src/auth/operations/refresh.ts

```typescript
import url from 'url'

import type { Collection } from '../../collections/config/types.js'
import type { Document, PayloadRequest } from '../../types/index.js'

import { buildAfterOperation } from '../../collections/operations/utilities/buildAfterOperation.js'
import { buildBeforeOperation } from '../../collections/operations/utilities/buildBeforeOperation.js'
import { Forbidden } from '../../errors/index.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { getFieldsToSign } from '../getFieldsToSign.js'
import { jwtSign } from '../jwt.js'
import { removeExpiredSessions } from '../sessions.js'

export type Result = {
  exp: number
  refreshedToken: string
  setCookie?: boolean
  /** @deprecated
   * use:
   * ```ts
   * user._strategy
   * ```
   */
  strategy?: string
  user: Document
}

export type Arguments = {
  collection: Collection
  req: PayloadRequest
}

export const refreshOperation = async (incomingArgs: Arguments): Promise<Result> => {
  let args = incomingArgs

  try {
    const shouldCommit = await initTransaction(args.req)

    // /////////////////////////////////////
    // beforeOperation - Collection
    // /////////////////////////////////////

    args = await buildBeforeOperation({
      args,
      collection: args.collection.config,
      operation: 'refresh',
    })

    // /////////////////////////////////////
    // Refresh
    // /////////////////////////////////////

    const {
      collection: { config: collectionConfig },
      req,
      req: {
        payload: { config, secret },
      },
    } = args

    if (!args.req.user) {
      throw new Forbidden(args.req.t)
    }

    const parsedURL = url.parse(args.req.url!)
    const isGraphQL = parsedURL.pathname === config.routes.graphQL

    let user = await req.payload.db.findOne<any>({
      collection: collectionConfig.slug,
      req,
      where: { id: { equals: args.req.user.id } },
    })

    const sid = args.req.user._sid

    if (collectionConfig.auth.useSessions && !collectionConfig.auth.disableLocalStrategy) {
      if (!Array.isArray(user.sessions) || !sid) {
        throw new Forbidden(args.req.t)
      }

      const existingSession = user.sessions.find(({ id }: { id: number }) => id === sid)

      const now = new Date()
      const tokenExpInMs = collectionConfig.auth.tokenExpiration * 1000
      existingSession.expiresAt = new Date(now.getTime() + tokenExpInMs)

      // Prevent updatedAt from being updated when only refreshing a session
      user.updatedAt = null

      await req.payload.db.updateOne({
        id: user.id,
        collection: collectionConfig.slug,
        data: {
          ...user,
          sessions: removeExpiredSessions(user.sessions),
        },
        req,
        returning: false,
      })
    }

    user = await req.payload.findByID({
      id: user.id,
      collection: collectionConfig.slug,
      depth: isGraphQL ? 0 : args.collection.config.auth.depth,
      req: args.req,
    })

    if (user) {
      user.collection = args.req.user.collection
      user._strategy = args.req.user._strategy
    }

    let result!: Result

    // /////////////////////////////////////
    // refresh hook - Collection
    // /////////////////////////////////////

    for (const refreshHook of args.collection.config.hooks.refresh) {
      const hookResult = await refreshHook({ args, user })

      if (hookResult) {
        result = hookResult
        break
      }
    }

    if (!result) {
      const fieldsToSign = getFieldsToSign({
        collectionConfig,
        email: user?.email as string,
        sid,
        user: args?.req?.user,
      })

      const { exp, token: refreshedToken } = await jwtSign({
        fieldsToSign,
        secret,
        tokenExpiration: collectionConfig.auth.tokenExpiration,
      })

      result = {
        exp,
        refreshedToken,
        setCookie: true,
        /** @deprecated
         * use:
         * ```ts
         * user._strategy
         * ```
         */
        strategy: args.req.user._strategy,
        user,
      }
    }

    // /////////////////////////////////////
    // After Refresh - Collection
    // /////////////////////////////////////

    if (collectionConfig.hooks?.afterRefresh?.length) {
      for (const hook of collectionConfig.hooks.afterRefresh) {
        result =
          (await hook({
            collection: args.collection?.config,
            context: args.req.context,
            exp: result.exp,
            req: args.req,
            token: result.refreshedToken,
          })) || result
      }
    }

    // /////////////////////////////////////
    // afterOperation - Collection
    // /////////////////////////////////////

    result = await buildAfterOperation({
      args,
      collection: args.collection?.config,
      operation: 'refresh',
      result,
    })

    // /////////////////////////////////////
    // Return results
    // /////////////////////////////////////

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return result
  } catch (error: unknown) {
    await killTransaction(args.req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: registerFirstUser.ts]---
Location: payload-main/packages/payload/src/auth/operations/registerFirstUser.ts

```typescript
import type {
  AuthOperationsFromCollectionSlug,
  Collection,
  DataFromCollectionSlug,
  RequiredDataFromCollectionSlug,
} from '../../collections/config/types.js'
import type { CollectionSlug } from '../../index.js'
import type { PayloadRequest, SelectType } from '../../types/index.js'

import { Forbidden } from '../../errors/index.js'
import { appendNonTrashedFilter } from '../../utilities/appendNonTrashedFilter.js'
import { commitTransaction } from '../../utilities/commitTransaction.js'
import { initTransaction } from '../../utilities/initTransaction.js'
import { killTransaction } from '../../utilities/killTransaction.js'
import { ensureUsernameOrEmail } from '../ensureUsernameOrEmail.js'

export type Arguments<TSlug extends CollectionSlug> = {
  collection: Collection
  data: AuthOperationsFromCollectionSlug<TSlug>['registerFirstUser'] &
    RequiredDataFromCollectionSlug<TSlug>
  req: PayloadRequest
}

export type Result<TData> = {
  exp?: number
  token?: string
  user?: TData
}

export const registerFirstUserOperation = async <TSlug extends CollectionSlug>(
  args: Arguments<TSlug>,
): Promise<Result<DataFromCollectionSlug<TSlug>>> => {
  const {
    collection: {
      config,
      config: {
        slug,
        auth: { verify },
      },
    },
    data,
    req,
    req: { payload },
  } = args

  if (config.auth.disableLocalStrategy) {
    throw new Forbidden(req.t)
  }

  try {
    const shouldCommit = await initTransaction(req)

    ensureUsernameOrEmail<TSlug>({
      authOptions: config.auth,
      collectionSlug: slug,
      data,
      operation: 'create',
      req,
    })

    const where = appendNonTrashedFilter({
      enableTrash: Boolean(config.trash),
      trash: false,
      where: {}, // no initial filter; just exclude trashed docs
    })

    const doc = await payload.db.findOne({
      collection: config.slug,
      req,
      where,
    })

    if (doc) {
      throw new Forbidden(req.t)
    }

    // /////////////////////////////////////
    // Register first user
    // /////////////////////////////////////

    const result = await payload.create<TSlug, SelectType>({
      collection: slug as TSlug,
      data,
      overrideAccess: true,
      req,
    })

    // auto-verify (if applicable)
    if (verify) {
      await payload.update({
        id: result.id,
        collection: slug,
        data: {
          _verified: true,
        },
        req,
      })
    }

    // /////////////////////////////////////
    // Log in new user
    // /////////////////////////////////////

    const { exp, token } = await payload.login({
      ...args,
      collection: slug,
      req,
    })

    result.collection = slug
    result._strategy = 'local-jwt'

    if (shouldCommit) {
      await commitTransaction(req)
    }

    return {
      exp,
      token,
      user: result,
    }
  } catch (error: unknown) {
    await killTransaction(req)
    throw error
  }
}
```

--------------------------------------------------------------------------------

````
