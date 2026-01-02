---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 177
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 177 of 695)

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

---[FILE: document.ts]---
Location: payload-main/packages/payload/src/admin/views/document.ts

```typescript
import type { SanitizedPermissions } from '../../auth/types.js'
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { PayloadComponent, SanitizedConfig, ServerProps } from '../../config/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { PayloadRequest } from '../../types/index.js'
import type { Data, DocumentSlots, FormState } from '../types.js'
import type { InitPageResult, ViewTypes } from './index.js'

export type EditViewProps = {
  readonly collectionSlug?: string
  readonly globalSlug?: string
}
/**
 * Properties specific to the versions view
 */
export type RenderDocumentVersionsProperties = {
  /**
   * @default false
   */
  disableGutter?: boolean
  /**
   * Use createdAt cell that appends params to the url on version selection instead of redirecting user
   * @default false
   */
  useVersionDrawerCreatedAtCell?: boolean
}

export type DocumentViewServerPropsOnly = {
  doc: Data
  hasPublishedDoc: boolean
  initPageResult: InitPageResult
  routeSegments: string[]
  versions?: RenderDocumentVersionsProperties
} & ServerProps

export type DocumentViewServerProps = DocumentViewClientProps & DocumentViewServerPropsOnly

export type DocumentViewClientProps = {
  documentSubViewType: DocumentSubViewTypes
  formState: FormState
  viewType: ViewTypes
} & DocumentSlots

/**
 * @todo: This should be renamed to `DocumentSubViewType` (singular)
 */
export type DocumentSubViewTypes = 'api' | 'default' | 'version' | 'versions'

export type DocumentTabServerPropsOnly = {
  readonly apiURL?: string
  readonly collectionConfig?: SanitizedCollectionConfig
  readonly globalConfig?: SanitizedGlobalConfig
  readonly permissions: SanitizedPermissions
  readonly req: PayloadRequest
} & ServerProps

export type DocumentTabClientProps = {
  path: string
}

export type DocumentTabServerProps = DocumentTabClientProps & DocumentTabServerPropsOnly

export type DocumentTabCondition = (args: {
  collectionConfig: SanitizedCollectionConfig
  /**
   * @deprecated: Use `req.payload.config` instead. This will be removed in v4.
   */
  config: SanitizedConfig
  globalConfig: SanitizedGlobalConfig
  permissions: SanitizedPermissions
  req: PayloadRequest
}) => boolean

// Everything is optional because we merge in the defaults
// i.e. the config may override the `Default` view with a `label` but not an `href`
export type DocumentTabConfig = {
  readonly Component?: DocumentTabComponent
  readonly condition?: DocumentTabCondition
  readonly href?:
    | ((args: {
        apiURL: string
        collection: SanitizedCollectionConfig
        global: SanitizedGlobalConfig
        id?: string
        routes: SanitizedConfig['routes']
      }) => string)
    | string
  readonly isActive?: ((args: { href: string }) => boolean) | boolean
  readonly label?: ((args: { t: (key: string) => string }) => string) | string
  readonly newTab?: boolean
  /**
   * Sets the order to render the tab in the admin panel
   * Recommended to use increments of 100 (e.g. 0, 100, 200)
   */
  readonly order?: number
  readonly Pill?: PayloadComponent
}

/**
 * @todo: Remove this type as it's only used internally for the config (above)
 */
export type DocumentTabComponent = PayloadComponent<{
  path: string
}>

// BeforeDocumentControls

export type BeforeDocumentControlsClientProps = {}
export type BeforeDocumentControlsServerPropsOnly = {} & ServerProps
export type BeforeDocumentControlsServerProps = BeforeDocumentControlsClientProps &
  BeforeDocumentControlsServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: folderList.ts]---
Location: payload-main/packages/payload/src/admin/views/folderList.ts

```typescript
import type { ServerProps } from '../../config/types.js'
import type { FolderBreadcrumb, FolderOrDocument, FolderSortKeys } from '../../folders/types.js'
import type { SanitizedCollectionConfig } from '../../index.js'
export type FolderListViewSlots = {
  AfterFolderList?: React.ReactNode
  AfterFolderListTable?: React.ReactNode
  BeforeFolderList?: React.ReactNode
  BeforeFolderListTable?: React.ReactNode
  Description?: React.ReactNode
  listMenuItems?: React.ReactNode[]
}

export type FolderListViewServerPropsOnly = {
  collectionConfig: SanitizedCollectionConfig
  documents: FolderOrDocument[]
  subfolders: FolderOrDocument[]
} & ServerProps

export type FolderListViewServerProps = FolderListViewClientProps & FolderListViewServerPropsOnly

export type FolderListViewClientProps = {
  activeCollectionFolderSlugs?: SanitizedCollectionConfig['slug'][]
  allCollectionFolderSlugs: SanitizedCollectionConfig['slug'][]
  allowCreateCollectionSlugs: SanitizedCollectionConfig['slug'][]
  baseFolderPath: `/${string}`
  beforeActions?: React.ReactNode[]
  breadcrumbs: FolderBreadcrumb[]
  collectionSlug?: SanitizedCollectionConfig['slug']
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  documents: FolderOrDocument[]
  enableRowSelections?: boolean
  folderAssignedCollections?: SanitizedCollectionConfig['slug'][]
  folderFieldName: string
  folderID: null | number | string
  FolderResultsComponent: React.ReactNode
  search?: string
  sort?: FolderSortKeys
  subfolders: FolderOrDocument[]
  viewPreference: 'grid' | 'list'
} & FolderListViewSlots

export type FolderListViewSlotSharedClientProps = {
  collectionSlug: SanitizedCollectionConfig['slug']
  hasCreatePermission: boolean
  newDocumentURL: string
}

// BeforeFolderList
export type BeforeFolderListClientProps = FolderListViewSlotSharedClientProps
export type BeforeFolderListServerPropsOnly = {} & FolderListViewServerPropsOnly
export type BeforeFolderListServerProps = BeforeFolderListClientProps &
  BeforeFolderListServerPropsOnly

// BeforeFolderListTable
export type BeforeFolderListTableClientProps = FolderListViewSlotSharedClientProps
export type BeforeFolderListTableServerPropsOnly = {} & FolderListViewServerPropsOnly
export type BeforeFolderListTableServerProps = BeforeFolderListTableClientProps &
  BeforeFolderListTableServerPropsOnly

// AfterFolderList
export type AfterFolderListClientProps = FolderListViewSlotSharedClientProps
export type AfterFolderListServerPropsOnly = {} & FolderListViewServerPropsOnly
export type AfterFolderListServerProps = AfterFolderListClientProps & AfterFolderListServerPropsOnly

// AfterFolderListTable
export type AfterFolderListTableClientProps = FolderListViewSlotSharedClientProps
export type AfterFolderListTableServerPropsOnly = {} & FolderListViewServerPropsOnly
export type AfterFolderListTableServerProps = AfterFolderListTableClientProps &
  AfterFolderListTableServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/payload/src/admin/views/index.ts

```typescript
import type { ClientTranslationsObject } from '@payloadcms/translations'

import type { SanitizedPermissions } from '../../auth/index.js'
import type { ImportMap } from '../../bin/generateImportMap/index.js'
import type { SanitizedCollectionConfig } from '../../collections/config/types.js'
import type { ClientConfig } from '../../config/client.js'
import type {
  CustomComponent,
  Locale,
  MetaConfig,
  PayloadComponent,
  SanitizedConfig,
  ServerProps,
} from '../../config/types.js'
import type { SanitizedGlobalConfig } from '../../globals/config/types.js'
import type { PayloadRequest } from '../../types/index.js'
import type { LanguageOptions } from '../LanguageOptions.js'
import type { Data, StaticDescription } from '../types.js'
import type { DocumentSubViewTypes } from './document.js'

export type AdminViewConfig = {
  Component: PayloadComponent
  /** Whether the path should be matched exactly or as a prefix */
  exact?: boolean
  meta?: MetaConfig
  /**
   * Any valid URL path or array of paths that [`path-to-regexp`](https://www.npmjs.com/package/path-to-regex) understands. Must begin with a forward slash (`/`).
   */
  path?: `/${string}`
  sensitive?: boolean
  strict?: boolean
}

export type AdminViewClientProps = {
  browseByFolderSlugs?: SanitizedCollectionConfig['slug'][]
  clientConfig: ClientConfig
  documentSubViewType?: DocumentSubViewTypes
  viewType: ViewTypes
}

export type AdminViewServerPropsOnly = {
  readonly clientConfig: ClientConfig
  readonly collectionConfig?: SanitizedCollectionConfig
  readonly disableActions?: boolean
  /**
   * @todo remove `docID` here as it is already contained in `initPageResult`
   */
  readonly docID?: number | string
  readonly folderID?: number | string
  readonly globalConfig?: SanitizedGlobalConfig
  readonly importMap: ImportMap
  readonly initialData?: Data
  readonly initPageResult: InitPageResult
  readonly params?: { [key: string]: string | string[] | undefined }
  readonly redirectAfterCreate?: boolean
  readonly redirectAfterDelete?: boolean
  readonly redirectAfterDuplicate?: boolean
  readonly redirectAfterRestore?: boolean
  readonly viewActions?: CustomComponent[]
} & ServerProps

export type AdminViewServerProps = AdminViewClientProps & AdminViewServerPropsOnly

/**
 * @deprecated This should be removed in favor of direct props
 */
export type AdminViewComponent = PayloadComponent<AdminViewServerProps>

export type VisibleEntities = {
  collections: SanitizedCollectionConfig['slug'][]
  globals: SanitizedGlobalConfig['slug'][]
}

export type InitPageResult = {
  collectionConfig?: SanitizedCollectionConfig
  cookies: Map<string, string>
  docID?: number | string
  globalConfig?: SanitizedGlobalConfig
  languageOptions: LanguageOptions
  locale?: Locale
  permissions: SanitizedPermissions
  redirectTo?: string
  req: PayloadRequest
  translations: ClientTranslationsObject
  visibleEntities: VisibleEntities
}

/**
 * @todo This should be renamed to `ViewType` (singular)
 */
export type ViewTypes =
  | 'account'
  | 'collection-folders'
  | 'createFirstUser'
  | 'dashboard'
  | 'document'
  | 'folders'
  | 'list'
  | 'reset'
  | 'trash'
  | 'verify'
  | 'version'

export type ServerPropsFromView = {
  collectionConfig?: SanitizedConfig['collections'][number]
  globalConfig?: SanitizedConfig['globals'][number]
  viewActions: CustomComponent[]
}

// Description
export type ViewDescriptionClientProps = {
  collectionSlug?: SanitizedCollectionConfig['slug']
  description: StaticDescription
}

export type ViewDescriptionServerPropsOnly = {} & ServerProps

export type ViewDescriptionServerProps = ViewDescriptionClientProps & ViewDescriptionServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: list.ts]---
Location: payload-main/packages/payload/src/admin/views/list.ts

```typescript
import type { SanitizedCollectionPermission } from '../../auth/types.js'
import type {
  CollectionAdminOptions,
  SanitizedCollectionConfig,
} from '../../collections/config/types.js'
import type { ServerProps } from '../../config/types.js'
import type { CollectionPreferences } from '../../preferences/types.js'
import type { QueryPreset } from '../../query-presets/types.js'
import type { ResolvedFilterOptions } from '../../types/index.js'
import type { Column } from '../elements/Table.js'
import type { Data, ViewTypes } from '../types.js'

export type ListViewSlots = {
  AfterList?: React.ReactNode
  AfterListTable?: React.ReactNode
  BeforeList?: React.ReactNode
  BeforeListTable?: React.ReactNode
  Description?: React.ReactNode
  listMenuItems?: React.ReactNode[]
  Table: React.ReactNode | React.ReactNode[]
}

/**
 * The `ListViewServerPropsOnly` approach is needed to ensure type strictness when injecting component props
 * There is no way to do something like `Omit<ListViewServerProps, keyof ListViewClientProps>`
 * This is because `ListViewClientProps` is a union which is impossible to exclude from
 * Exporting explicitly defined `ListViewServerPropsOnly`, etc. allows for the strictest typing
 */
export type ListViewServerPropsOnly = {
  collectionConfig: SanitizedCollectionConfig
  data: Data
  limit: number
  listPreferences: CollectionPreferences
  listSearchableFields: CollectionAdminOptions['listSearchableFields']
} & ServerProps

export type ListViewServerProps = ListViewClientProps & ListViewServerPropsOnly

export type ListViewClientProps = {
  beforeActions?: React.ReactNode[]
  collectionSlug: SanitizedCollectionConfig['slug']
  columnState: Column[]
  disableBulkDelete?: boolean
  disableBulkEdit?: boolean
  disableQueryPresets?: boolean
  enableRowSelections?: boolean
  hasCreatePermission: boolean
  hasDeletePermission?: boolean
  /**
   * @deprecated
   */
  listPreferences?: CollectionPreferences
  newDocumentURL: string
  /**
   * @deprecated
   */
  preferenceKey?: string
  queryPreset?: QueryPreset
  queryPresetPermissions?: SanitizedCollectionPermission
  renderedFilters?: Map<string, React.ReactNode>
  resolvedFilterOptions?: Map<string, ResolvedFilterOptions>
  viewType: ViewTypes
} & ListViewSlots

export type ListViewSlotSharedClientProps = {
  collectionSlug: SanitizedCollectionConfig['slug']
  hasCreatePermission: boolean
  hasDeletePermission?: boolean
  newDocumentURL: string
}

// BeforeList
export type BeforeListClientProps = ListViewSlotSharedClientProps
export type BeforeListServerPropsOnly = {} & ListViewServerPropsOnly
export type BeforeListServerProps = BeforeListClientProps & BeforeListServerPropsOnly

// BeforeListTable
export type BeforeListTableClientProps = ListViewSlotSharedClientProps
export type BeforeListTableServerPropsOnly = {} & ListViewServerPropsOnly
export type BeforeListTableServerProps = BeforeListTableClientProps & BeforeListTableServerPropsOnly

// AfterList
export type AfterListClientProps = ListViewSlotSharedClientProps
export type AfterListServerPropsOnly = {} & ListViewServerPropsOnly
export type AfterListServerProps = AfterListClientProps & AfterListServerPropsOnly

// AfterListTable
export type AfterListTableClientProps = ListViewSlotSharedClientProps
export type AfterListTableServerPropsOnly = {} & ListViewServerPropsOnly
export type AfterListTableServerProps = AfterListTableClientProps & AfterListTableServerPropsOnly
```

--------------------------------------------------------------------------------

---[FILE: cookies.spec.ts]---
Location: payload-main/packages/payload/src/auth/cookies.spec.ts

```typescript
import { parseCookies } from './cookies.js'

describe('parseCookies', () => {
  it('parses cookie attributes without values', () => {
    const fakeHeaders = new Map()
    fakeHeaders.set('Cookie', 'my_value=true; Secure; HttpOnly')

    const parsed = parseCookies(fakeHeaders as unknown as Request['headers'])

    expect(parsed.get('my_value')).toBe('true')
    expect(parsed.get('Secure')).toBe('true')
    expect(parsed.get('HttpOnly')).toBe('true')
    expect(parsed.size).toBe(3)
  })
  it('strips whitespace', () => {
    const fakeHeaders = new Map()
    fakeHeaders.set('Cookie', 'my_value=true; ')

    const parsed = parseCookies(fakeHeaders as unknown as Request['headers'])

    expect(parsed.get('my_value')).toBe('true')
    expect(parsed.size).toBe(1)
  })

  it('ensure invalid cookies are ignored', () => {
    const fakeHeaders = new Map()
    fakeHeaders.set('Cookie', 'my_value=true; invalid_cookie=%E0%A4%A')

    const parsed = parseCookies(fakeHeaders as unknown as Request['headers'])

    expect(parsed.get('my_value')).toBe('true')
    expect(parsed.size).toBe(1)
  })

  it('ensure empty map is returned if there are no cookies', () => {
    const fakeHeaders = new Map()

    const parsed = parseCookies(fakeHeaders as unknown as Request['headers'])

    expect(parsed.size).toBe(0)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: cookies.ts]---
Location: payload-main/packages/payload/src/auth/cookies.ts

```typescript
import type { SanitizedCollectionConfig } from './../collections/config/types.js'

type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  returnCookieAsObject: boolean
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
  value?: string
}

type CookieObject = {
  domain?: string
  expires?: string
  httpOnly?: boolean
  maxAge?: number
  name: string
  path?: string
  sameSite?: 'Lax' | 'None' | 'Strict'
  secure?: boolean
  value: string | undefined
}

export const generateCookie = <ReturnCookieAsObject = boolean>(
  args: CookieOptions,
): ReturnCookieAsObject extends true ? CookieObject : string => {
  const {
    name,
    domain,
    expires,
    httpOnly,
    maxAge,
    path,
    returnCookieAsObject,
    sameSite,
    secure: secureArg,
    value,
  } = args

  let cookieString = `${name}=${value || ''}`
  const cookieObject: CookieObject = {
    name,
    value,
  }

  const secure = secureArg || sameSite === 'None'

  if (expires) {
    if (returnCookieAsObject) {
      cookieObject.expires = expires.toUTCString()
    } else {
      cookieString += `; Expires=${expires.toUTCString()}`
    }
  }

  if (maxAge) {
    if (returnCookieAsObject) {
      cookieObject.maxAge = maxAge
    } else {
      cookieString += `; Max-Age=${maxAge.toString()}`
    }
  }

  if (domain) {
    if (returnCookieAsObject) {
      cookieObject.domain = domain
    } else {
      cookieString += `; Domain=${domain}`
    }
  }

  if (path) {
    if (returnCookieAsObject) {
      cookieObject.path = path
    } else {
      cookieString += `; Path=${path}`
    }
  }

  if (secure) {
    if (returnCookieAsObject) {
      cookieObject.secure = secure
    } else {
      cookieString += `; Secure=${secure}`
    }
  }

  if (httpOnly) {
    if (returnCookieAsObject) {
      cookieObject.httpOnly = httpOnly
    } else {
      cookieString += `; HttpOnly=${httpOnly}`
    }
  }

  if (sameSite) {
    if (returnCookieAsObject) {
      cookieObject.sameSite = sameSite
    } else {
      cookieString += `; SameSite=${sameSite}`
    }
  }

  return (returnCookieAsObject ? cookieObject : cookieString) as ReturnCookieAsObject extends true
    ? CookieObject
    : string
}
type GetCookieExpirationArgs = {
  /*
    The number of seconds until the cookie expires
    @default 7200 seconds (2 hours)
  */
  seconds: number
}
export const getCookieExpiration = ({ seconds = 7200 }: GetCookieExpirationArgs) => {
  const currentTime = new Date()
  currentTime.setSeconds(currentTime.getSeconds() + seconds)
  return currentTime
}

type GeneratePayloadCookieArgs = {
  /* The auth collection config */
  collectionAuthConfig: SanitizedCollectionConfig['auth']
  /* Prefix to scope the cookie */
  cookiePrefix: string
  /* The returnAs value */
  returnCookieAsObject?: boolean
  /* The token to be stored in the cookie */
  token: string
}
export const generatePayloadCookie = <T extends GeneratePayloadCookieArgs>({
  collectionAuthConfig,
  cookiePrefix,
  returnCookieAsObject = false,
  token,
}: T): T['returnCookieAsObject'] extends true ? CookieObject : string => {
  const sameSite =
    typeof collectionAuthConfig.cookies.sameSite === 'string'
      ? collectionAuthConfig.cookies.sameSite
      : collectionAuthConfig.cookies.sameSite
        ? 'Strict'
        : undefined

  return generateCookie<T['returnCookieAsObject']>({
    name: `${cookiePrefix}-token`,
    domain: collectionAuthConfig.cookies.domain ?? undefined,
    expires: getCookieExpiration({ seconds: collectionAuthConfig.tokenExpiration }),
    httpOnly: true,
    path: '/',
    returnCookieAsObject,
    sameSite,
    secure: collectionAuthConfig.cookies.secure,
    value: token,
  })
}

export const generateExpiredPayloadCookie = <T extends Omit<GeneratePayloadCookieArgs, 'token'>>({
  collectionAuthConfig,
  cookiePrefix,
  returnCookieAsObject = false,
}: T): T['returnCookieAsObject'] extends true ? CookieObject : string => {
  const sameSite =
    typeof collectionAuthConfig.cookies.sameSite === 'string'
      ? collectionAuthConfig.cookies.sameSite
      : collectionAuthConfig.cookies.sameSite
        ? 'Strict'
        : undefined

  const expires = new Date(Date.now() - 1000)

  return generateCookie<T['returnCookieAsObject']>({
    name: `${cookiePrefix}-token`,
    domain: collectionAuthConfig.cookies.domain ?? undefined,
    expires,
    httpOnly: true,
    path: '/',
    returnCookieAsObject,
    sameSite,
    secure: collectionAuthConfig.cookies.secure,
  })
}

export function parseCookies(headers: Request['headers']) {
  // Taken from https://github.com/vercel/edge-runtime/blob/main/packages/cookies/src/serialize.ts

  /*
  The MIT License (MIT)

  Copyright (c) 2024 Vercel, Inc.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  const map = new Map<string, string>()

  const cookie = headers.get('Cookie')

  if (!cookie) {
    return map
  }

  for (const pair of cookie.split(/; */)) {
    if (!pair) {
      continue
    }

    const splitAt = pair.indexOf('=')

    // If the attribute doesn't have a value, set it to 'true'.
    if (splitAt === -1) {
      map.set(pair, 'true')
      continue
    }

    // Otherwise split it into key and value and trim the whitespace on the
    // value.
    const [key, value] = [pair.slice(0, splitAt), pair.slice(splitAt + 1)]
    try {
      map.set(key, decodeURIComponent(value ?? 'true'))
    } catch {
      // ignore invalid encoded values
    }
  }

  return map
}
```

--------------------------------------------------------------------------------

---[FILE: crypto.ts]---
Location: payload-main/packages/payload/src/auth/crypto.ts

```typescript
import crypto from 'crypto'

const algorithm = 'aes-256-ctr'

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  const secret = this.secret
  const cipher = crypto.createCipheriv(algorithm, secret, iv)

  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
  const ivString = iv.toString('hex')

  return `${ivString}${encrypted}`
}

export function decrypt(hash: string): string {
  const iv = hash.slice(0, 32)
  const content = hash.slice(32)

  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  const secret = this.secret
  const decipher = crypto.createDecipheriv(algorithm, secret, Buffer.from(iv, 'hex'))

  return decipher.update(content, 'hex', 'utf8') + decipher.final('utf8')
}
```

--------------------------------------------------------------------------------

---[FILE: defaultAccess.ts]---
Location: payload-main/packages/payload/src/auth/defaultAccess.ts

```typescript
import type { PayloadRequest } from '../types/index.js'

export const defaultAccess = ({ req: { user } }: { req: PayloadRequest }): boolean => Boolean(user)
```

--------------------------------------------------------------------------------

---[FILE: defaultUser.ts]---
Location: payload-main/packages/payload/src/auth/defaultUser.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'

export const defaultUserCollection: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
  },
  fields: [],
  labels: {
    plural: ({ t }) => t('general:users'),
    singular: ({ t }) => t('general:user'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ensureUsernameOrEmail.ts]---
Location: payload-main/packages/payload/src/auth/ensureUsernameOrEmail.ts

```typescript
import type { RequiredDataFromCollectionSlug } from '../collections/config/types.js'
import type { AuthCollection, CollectionSlug, PayloadRequest } from '../index.js'

import { ValidationError } from '../errors/index.js'

type ValidateUsernameOrEmailArgs<TSlug extends CollectionSlug> = {
  authOptions: AuthCollection['config']['auth']
  collectionSlug: string
  data: RequiredDataFromCollectionSlug<TSlug>
  req: PayloadRequest
} & (
  | {
      operation: 'create'
      originalDoc?: never
    }
  | {
      operation: 'update'
      originalDoc: RequiredDataFromCollectionSlug<TSlug>
    }
)
export const ensureUsernameOrEmail = <TSlug extends CollectionSlug>({
  authOptions: { disableLocalStrategy, loginWithUsername },
  collectionSlug,
  data,
  operation,
  originalDoc,
  req,
}: ValidateUsernameOrEmailArgs<TSlug>) => {
  // neither username or email are required
  // and neither are provided
  // so we need to manually validate
  if (
    !disableLocalStrategy &&
    loginWithUsername &&
    !loginWithUsername.requireEmail &&
    !loginWithUsername.requireUsername
  ) {
    let missingFields = false
    if (operation === 'create' && !data.email && !data.username) {
      missingFields = true
    } else if (operation === 'update') {
      // prevent clearing both email and username
      if ('email' in data && !data.email && 'username' in data && !data.username) {
        missingFields = true
      }
      // prevent clearing email if no username
      if ('email' in data && !data.email && !originalDoc.username && !data?.username) {
        missingFields = true
      }
      // prevent clearing username if no email
      if ('username' in data && !data.username && !originalDoc.email && !data?.email) {
        missingFields = true
      }
    }

    if (missingFields) {
      throw new ValidationError(
        {
          collection: collectionSlug,
          errors: [
            {
              message: 'Username or email is required',
              path: 'username',
            },
            {
              message: 'Username or email is required',
              path: 'email',
            },
          ],
        },
        req.t,
      )
    }
  }

  return
}
```

--------------------------------------------------------------------------------

---[FILE: executeAccess.ts]---
Location: payload-main/packages/payload/src/auth/executeAccess.ts

```typescript
import type { Access, AccessResult } from '../config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { Forbidden } from '../errors/index.js'

type OperationArgs = {
  data?: any
  disableErrors?: boolean
  id?: number | string
  isReadingStaticFile?: boolean
  req: PayloadRequest
}
export const executeAccess = async (
  { id, data, disableErrors, isReadingStaticFile = false, req }: OperationArgs,
  access: Access,
): Promise<AccessResult> => {
  if (access) {
    const resolvedConstraint = await access({
      id,
      data,
      isReadingStaticFile,
      req,
    })

    if (!resolvedConstraint) {
      if (!disableErrors) {
        throw new Forbidden(req.t)
      }
    }

    return resolvedConstraint
  }

  if (req.user) {
    return true
  }

  if (!disableErrors) {
    throw new Forbidden(req.t)
  }
  return false
}
```

--------------------------------------------------------------------------------

---[FILE: executeAuthStrategies.ts]---
Location: payload-main/packages/payload/src/auth/executeAuthStrategies.ts

```typescript
import type { AuthStrategyFunctionArgs, AuthStrategyResult } from './index.js'

import { logError } from '../utilities/logError.js'
import { mergeHeaders } from '../utilities/mergeHeaders.js'
export const executeAuthStrategies = async (
  args: AuthStrategyFunctionArgs,
): Promise<AuthStrategyResult> => {
  let result: AuthStrategyResult = { user: null }

  if (!args.payload.authStrategies?.length) {
    return result
  }

  for (const strategy of args.payload.authStrategies) {
    // add the configured AuthStrategy `name` to the strategy function args
    args.strategyName = strategy.name
    args.isGraphQL = Boolean(args.isGraphQL)
    args.canSetHeaders = Boolean(args.canSetHeaders)

    try {
      const authResult = await strategy.authenticate(args)
      if (authResult.responseHeaders) {
        authResult.responseHeaders = mergeHeaders(
          result.responseHeaders || new Headers(),
          authResult.responseHeaders || new Headers(),
        )
      }
      result = authResult
    } catch (err) {
      logError({ err, payload: args.payload })
    }

    if (result.user) {
      return result
    }
  }
  return result
}
```

--------------------------------------------------------------------------------

---[FILE: extractAccessFromPermission.ts]---
Location: payload-main/packages/payload/src/auth/extractAccessFromPermission.ts

```typescript
import type { AccessResult } from '../config/types.js'
import type { Permission } from './index.js'

export const extractAccessFromPermission = (hasPermission: boolean | Permission): AccessResult => {
  if (typeof hasPermission === 'boolean') {
    return hasPermission
  }

  const { permission, where } = hasPermission
  if (!permission) {
    return false
  }
  if (where && typeof where === 'object') {
    return where
  }
  return true
}
```

--------------------------------------------------------------------------------

---[FILE: extractJWT.ts]---
Location: payload-main/packages/payload/src/auth/extractJWT.ts

```typescript
import type { BasePayload } from '../index.js'
import type { AuthStrategyFunctionArgs } from './index.js'

import { parseCookies } from '../utilities/parseCookies.js'

type ExtractionMethod = (args: { headers: Headers; payload: BasePayload }) => null | string

const extractionMethods: Record<string, ExtractionMethod> = {
  Bearer: ({ headers }) => {
    const jwtFromHeader = headers.get('Authorization')

    // allow RFC6750 OAuth 2.0 compliant Bearer tokens
    // in addition to the payload default JWT format
    if (jwtFromHeader?.startsWith('Bearer ')) {
      return jwtFromHeader.replace('Bearer ', '')
    }

    return null
  },
  cookie: ({ headers, payload }) => {
    const origin = headers.get('Origin')
    const cookies = parseCookies(headers)
    const tokenCookieName = `${payload.config.cookiePrefix}-token`
    const cookieToken = cookies.get(tokenCookieName)

    if (!cookieToken) {
      return null
    }

    if (!origin || payload.config.csrf.length === 0 || payload.config.csrf.indexOf(origin) > -1) {
      return cookieToken
    }

    return null
  },
  JWT: ({ headers }) => {
    const jwtFromHeader = headers.get('Authorization')

    if (jwtFromHeader?.startsWith('JWT ')) {
      return jwtFromHeader.replace('JWT ', '')
    }

    return null
  },
}

export const extractJWT = (args: Omit<AuthStrategyFunctionArgs, 'strategyName'>): null | string => {
  const { headers, payload } = args

  const extractionOrder = payload.config.auth.jwtOrder

  for (const extractionStrategy of extractionOrder) {
    const result = extractionMethods[extractionStrategy]!({ headers, payload })

    if (result) {
      return result
    }
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: getAccessResults.ts]---
Location: payload-main/packages/payload/src/auth/getAccessResults.ts

```typescript
import type { AllOperations, PayloadRequest } from '../types/index.js'
import type { Permissions, SanitizedPermissions } from './types.js'

import { getEntityPermissions } from '../utilities/getEntityPermissions/getEntityPermissions.js'
import { sanitizePermissions } from '../utilities/sanitizePermissions.js'

type GetAccessResultsArgs = {
  req: PayloadRequest
}
export async function getAccessResults({
  req,
}: GetAccessResultsArgs): Promise<SanitizedPermissions> {
  const results = {
    collections: {},
    globals: {},
  } as Permissions
  const { payload, user } = req

  const isLoggedIn = !!user
  const userCollectionConfig =
    user && user.collection ? payload?.collections?.[user.collection]?.config : null

  if (userCollectionConfig && payload.config.admin.user === user?.collection) {
    results.canAccessAdmin = userCollectionConfig.access.admin
      ? await userCollectionConfig.access.admin({ req })
      : isLoggedIn
  } else {
    results.canAccessAdmin = false
  }
  const blockReferencesPermissions = {}

  await Promise.all(
    payload.config.collections.map(async (collection) => {
      const collectionOperations: AllOperations[] = ['create', 'read', 'update', 'delete']

      if (
        collection.auth &&
        typeof collection.auth.maxLoginAttempts !== 'undefined' &&
        collection.auth.maxLoginAttempts !== 0
      ) {
        collectionOperations.push('unlock')
      }

      if (collection.versions) {
        collectionOperations.push('readVersions')
      }

      const collectionPermissions = await getEntityPermissions({
        blockReferencesPermissions,
        entity: collection,
        entityType: 'collection',
        fetchData: false,
        operations: collectionOperations,
        req,
      })
      results.collections![collection.slug] = collectionPermissions
    }),
  )

  await Promise.all(
    payload.config.globals.map(async (global) => {
      const globalOperations: AllOperations[] = ['read', 'update']

      if (global.versions) {
        globalOperations.push('readVersions')
      }

      const globalPermissions = await getEntityPermissions({
        blockReferencesPermissions,
        entity: global,
        entityType: 'global',
        fetchData: false,
        operations: globalOperations,
        req,
      })
      results.globals![global.slug] = globalPermissions
    }),
  )

  return sanitizePermissions(results)
}
```

--------------------------------------------------------------------------------

---[FILE: getAuthFields.ts]---
Location: payload-main/packages/payload/src/auth/getAuthFields.ts

```typescript
import type { Field, TextField } from '../fields/config/types.js'
import type { IncomingAuthType } from './types.js'

import { accountLockFields } from './baseFields/accountLock.js'
import { apiKeyFields } from './baseFields/apiKey.js'
import { baseAuthFields } from './baseFields/auth.js'
import { emailFieldConfig } from './baseFields/email.js'
import { sessionsFieldConfig } from './baseFields/sessions.js'
import { usernameFieldConfig } from './baseFields/username.js'
import { verificationFields } from './baseFields/verification.js'

export const getBaseAuthFields = (authConfig: IncomingAuthType): Field[] => {
  const authFields: Field[] = []

  if (authConfig.useAPIKey) {
    authFields.push(...apiKeyFields)
  }

  if (
    !authConfig.disableLocalStrategy ||
    (typeof authConfig.disableLocalStrategy === 'object' &&
      authConfig.disableLocalStrategy.enableFields)
  ) {
    const emailField = { ...emailFieldConfig }
    let usernameField: TextField | undefined

    if (authConfig.loginWithUsername) {
      usernameField = { ...usernameFieldConfig }
      if (typeof authConfig.loginWithUsername === 'object') {
        if (authConfig.loginWithUsername.requireEmail === false) {
          emailField.required = false
        }
        if (authConfig.loginWithUsername.requireUsername === false) {
          usernameField.required = false
        }
        if (authConfig.loginWithUsername.allowEmailLogin === false) {
          emailField.unique = false
        }
      }
    }

    authFields.push(emailField)
    if (usernameField) {
      authFields.push(usernameField)
    }

    authFields.push(...baseAuthFields)

    if (authConfig.verify) {
      authFields.push(...verificationFields)
    }

    if (authConfig?.maxLoginAttempts && authConfig.maxLoginAttempts > 0) {
      authFields.push(...accountLockFields)
    }

    if (authConfig.useSessions) {
      authFields.push(sessionsFieldConfig)
    }
  }

  return authFields
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldsToSign.ts]---
Location: payload-main/packages/payload/src/auth/getFieldsToSign.ts

```typescript
import type { CollectionConfig } from '../collections/config/types.js'
import type { Field, TabAsField } from '../fields/config/types.js'
import type { PayloadRequest } from '../types/index.js'

import { fieldAffectsData, tabHasName } from '../fields/config/types.js'

type TraverseFieldsArgs = {
  data: Record<string, unknown>
  fields: (Field | TabAsField)[]
  result: Record<string, unknown>
}
const traverseFields = ({
  data,
  // parent,
  fields,
  result,
}: TraverseFieldsArgs) => {
  fields.forEach((field) => {
    switch (field.type) {
      case 'collapsible':
      case 'row': {
        traverseFields({
          data,
          fields: field.fields,
          result,
        })
        break
      }
      case 'group': {
        if (fieldAffectsData(field)) {
          let targetResult
          if (typeof field.saveToJWT === 'string') {
            targetResult = field.saveToJWT
            result[field.saveToJWT] = data[field.name]
          } else if (field.saveToJWT) {
            targetResult = field.name
            result[field.name] = data[field.name]
          }
          const groupData: Record<string, unknown> = data[field.name] as Record<string, unknown>
          const groupResult = (targetResult ? result[targetResult] : result) as Record<
            string,
            unknown
          >
          traverseFields({
            data: groupData,
            fields: field.fields,
            result: groupResult,
          })
          break
        } else {
          traverseFields({
            data,
            fields: field.fields,
            result,
          })

          break
        }
      }
      case 'tab': {
        if (tabHasName(field)) {
          let targetResult
          if (typeof field.saveToJWT === 'string') {
            targetResult = field.saveToJWT
            result[field.saveToJWT] = data[field.name]
          } else if (field.saveToJWT) {
            targetResult = field.name
            result[field.name] = data[field.name]
          }
          const tabData: Record<string, unknown> = data[field.name] as Record<string, unknown>
          const tabResult = (targetResult ? result[targetResult] : result) as Record<
            string,
            unknown
          >
          traverseFields({
            data: tabData,
            fields: field.fields,
            result: tabResult,
          })
        } else {
          traverseFields({
            data,
            fields: field.fields,
            result,
          })
        }
        break
      }
      case 'tabs': {
        traverseFields({
          data,
          fields: field.tabs.map((tab) => ({ ...tab, type: 'tab' })),
          result,
        })
        break
      }
      default:
        if (fieldAffectsData(field)) {
          if (field.saveToJWT) {
            if (typeof field.saveToJWT === 'string') {
              result[field.saveToJWT] = data[field.name]
              delete result[field.name]
            } else {
              result[field.name] = data[field.name] as Record<string, unknown>
            }
          } else if (field.saveToJWT === false) {
            delete result[field.name]
          }
        }
    }
  })
  return result
}
export const getFieldsToSign = (args: {
  collectionConfig: CollectionConfig
  email: string
  sid?: string
  user: PayloadRequest['user']
}): Record<string, unknown> => {
  const { collectionConfig, email, sid, user } = args

  const result: Record<string, unknown> = {
    id: user?.id,
    collection: collectionConfig.slug,
    email,
  }

  if (sid) {
    result.sid = sid
  }

  traverseFields({
    data: user!,
    fields: collectionConfig.fields,
    result,
  })

  return result
}
```

--------------------------------------------------------------------------------

````
