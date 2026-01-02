---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 404
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 404 of 695)

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

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/LogOut/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .icon--logout {
    height: $baseline;
    width: $baseline;

    .stroke {
      stroke: currentColor;
      stroke-width: 2px;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/LogOut/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const LogOutIcon: React.FC = () => (
  <svg
    className="icon icon--logout"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M12 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12M7.33333 13.3333L4 10M4 10L7.33333 6.66667M4 10H12"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Menu/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .icon--menu {
    .stroke {
      stroke-width: $style-stroke-width-s;
      stroke: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Menu/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const MenuIcon: React.FC = () => (
  <svg
    className="icon icon--menu"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M4.66667 10H15.3333M4.66667 6H15.3333M4.66667 14H15.3333"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/MinimizeMaximize/index.tsx
Signals: React

```typescript
import * as React from 'react'

const baseClass = 'minimize-maximize'

type Props = {
  className?: string
  isMinimized?: boolean
}
export const MinimizeMaximizeIcon: React.FC<Props> = ({ className, isMinimized }) => {
  const classes = [
    baseClass,
    isMinimized ? `${baseClass}--minimized` : `${baseClass}--maximized`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      className={classes}
      height="20"
      stroke="currentColor"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isMinimized ? (
        <path d="M7.33333 4H5.33333C4.97971 4 4.64057 4.14048 4.39052 4.39052C4.14048 4.64057 4 4.97971 4 5.33333V7.33333M16 7.33333V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12.6667M4 12.6667V14.6667C4 15.0203 4.14048 15.3594 4.39052 15.6095C4.64057 15.8595 4.97971 16 5.33333 16H7.33333M12.6667 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V12.6667" />
      ) : (
        <path d="M7.33333 4V6C7.33333 6.35362 7.19286 6.69276 6.94281 6.94281C6.69276 7.19286 6.35362 7.33333 6 7.33333H4M16 7.33333H14C13.6464 7.33333 13.3072 7.19286 13.0572 6.94281C12.8071 6.69276 12.6667 6.35362 12.6667 6V4M4 12.6667H6C6.35362 12.6667 6.69276 12.8071 6.94281 13.0572C7.19286 13.3072 7.33333 13.6464 7.33333 14V16M12.6667 16V14C12.6667 13.6464 12.8071 13.3072 13.0572 13.0572C13.3072 12.8071 13.6464 12.6667 14 12.6667H16" />
      )}
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/More/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--more {
    height: $baseline;
    width: $baseline;

    .fill {
      fill: var(--theme-elevation-800);
      stroke: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/More/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const MoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={['icon icon--more', className].filter(Boolean).join(' ')}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M10 10.6666C10.3682 10.6666 10.6667 10.3682 10.6667 9.99998C10.6667 9.63179 10.3682 9.33331 10 9.33331C9.63182 9.33331 9.33334 9.63179 9.33334 9.99998C9.33334 10.3682 9.63182 10.6666 10 10.6666Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M14.6667 10.6666C15.0349 10.6666 15.3333 10.3682 15.3333 9.99998C15.3333 9.63179 15.0349 9.33331 14.6667 9.33331C14.2985 9.33331 14 9.63179 14 9.99998C14 10.3682 14.2985 10.6666 14.6667 10.6666Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M5.33334 10.6666C5.70153 10.6666 6.00001 10.3682 6.00001 9.99998C6.00001 9.63179 5.70153 9.33331 5.33334 9.33331C4.96515 9.33331 4.66667 9.63179 4.66667 9.99998C4.66667 10.3682 4.96515 10.6666 5.33334 10.6666Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/MoveFolder/index.scss

```text
@layer payload-default {
  .icon--move-folder {
    height: var(--base);
    width: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/MoveFolder/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export function MoveFolderIcon() {
  return (
    <svg
      className="icon icon--move-folder"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_278_1086)">
        <path
          d="M5.33334 10V7.33334C5.33334 6.97971 5.47382 6.64058 5.72387 6.39053C5.97392 6.14048 6.31305 6 6.66668 6H9.26668C9.48967 5.99782 9.70965 6.0516 9.90648 6.15642C10.1033 6.26124 10.2707 6.41375 10.3933 6.6L10.9333 7.4C11.0547 7.58436 11.22 7.73568 11.4143 7.84041C11.6087 7.94513 11.8259 7.99997 12.0467 8H17.3333C17.687 8 18.0261 8.14048 18.2762 8.39053C18.5262 8.64058 18.6667 8.97971 18.6667 9.33334V16C18.6667 16.3536 18.5262 16.6928 18.2762 16.9428C18.0261 17.1929 17.687 17.3333 17.3333 17.3333H6.66668C6.31305 17.3333 5.97392 17.1929 5.72387 16.9428C5.47382 16.6928 5.33334 16.3536 5.33334 16V15.3333M5.33334 12.6667H12M12 12.6667L10 14.6667M12 12.6667L10 10.6667"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="26"
          id="filter0_d_278_1086"
          width="26"
          x="-1"
          y="-1"
        >
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_278_1086"
            mode="normal"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/People/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--people {
    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width;
      fill: none;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/People/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const PeopleIcon: React.FC<{
  className: string
}> = ({ className }) => (
  <svg
    className={['icon', 'icon--people', className].filter(Boolean).join(' ')}
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M14 16C14 14.5855 13.4381 13.229 12.4379 12.2288C11.4377 11.2286 10.0812 10.6667 8.66668 10.6667M8.66668 10.6667C7.25219 10.6667 5.89563 11.2286 4.89544 12.2288C3.89525 13.229 3.33334 14.5855 3.33334 16M8.66668 10.6667C10.5076 10.6667 12 9.17428 12 7.33333C12 5.49238 10.5076 4 8.66668 4C6.82573 4 5.33334 5.49238 5.33334 7.33333C5.33334 9.17428 6.82573 10.6667 8.66668 10.6667ZM16.6667 15.3333C16.6667 13.0867 15.3333 11 14 10C14.4383 9.67118 14.7888 9.23939 15.0204 8.74285C15.252 8.2463 15.3577 7.70031 15.328 7.1532C15.2984 6.60609 15.1343 6.07472 14.8503 5.60613C14.5664 5.13754 14.1713 4.74617 13.7 4.46667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Plus/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--plus {
    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Plus/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const PlusIcon: React.FC = () => (
  <svg
    className="icon icon--plus"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M5.33333 9.99998H14.6667M9.99999 5.33331V14.6666"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Search/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--search {
    height: $baseline;
    width: $baseline;

    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width-s;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Search/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const SearchIcon: React.FC = () => (
  <svg
    className="icon icon--search"
    fill="none"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M16 16L13.1333 13.1333M14.6667 9.33333C14.6667 12.2789 12.2789 14.6667 9.33333 14.6667C6.38781 14.6667 4 12.2789 4 9.33333C4 6.38781 6.38781 4 9.33333 4C12.2789 4 14.6667 6.38781 14.6667 9.33333Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Sort/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--sort {
    height: $baseline;
    width: $baseline;

    .fill {
      stroke: currentColor;
      stroke-width: $style-stroke-width-s;
      fill: var(--theme-elevation-800);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Sort/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const SortDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className="icon icon--sort"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M2.5 13.3333L5.83333 16.6667M5.83333 16.6667L9.16667 13.3333M5.83333 16.6667V3.33333M9.16667 7.08333H17.5M9.16667 10.4167H15M11.6667 13.75H12.5"
      stroke="#2F2F2F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const SortUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className="icon icon--sort"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M2.5 6.66668L5.83333 3.33334M5.83333 3.33334L9.16667 6.66668M5.83333 3.33334V16.6667M11.6667 7.08354H17.5M9.16667 10.4169H15M9.16667 13.7502H12.5"
      stroke="#2F2F2F"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Swap/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--swap {
    height: $baseline;
    width: $baseline;

    .stroke {
      fill: none;
      stroke: currentColor;
      stroke-width: $style-stroke-width-s;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Swap/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const SwapIcon: React.FC = () => (
  <svg className="icon icon--swap" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke"
      d="M7.33334 4L4.66667 6.66667M4.66667 6.66667L7.33334 9.33333M4.66667 6.66667H15.3333M12.6667 16L15.3333 13.3333M15.3333 13.3333L12.6667 10.6667M15.3333 13.3333H4.66667"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/ThreeDots/index.scss

```text
.icon--dots {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  height: 2rem;
  width: 2rem;

  > div {
    width: 3px;
    height: 3px;
    border-radius: 100%;
    background-color: currentColor;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/ThreeDots/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export function ThreeDotsIcon({ className = '' }) {
  return (
    <div className={`icon icon--dots ${className}`.trim()}>
      <div />
      <div />
      <div />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Trash/index.scss

```text
@layer payload-default {
  .icon--trash {
    height: var(--base);
    width: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Trash/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={[className, 'icon icon--trash'].filter(Boolean).join(' ')}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.1499 6.1H15.8499M14.5499 6.1V15.2C14.5499 15.85 13.8999 16.5 13.2499 16.5H6.7499C6.0999 16.5 5.4499 15.85 5.4499 15.2V6.1M7.3999 6.1V4.8C7.3999 4.15 8.0499 3.5 8.6999 3.5H11.2999C11.9499 3.5 12.5999 4.15 12.5999 4.8V6.1M8.6999 9.35V13.25M11.2999 9.35V13.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/X/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--x {
    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width-s;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/X/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={[className, 'icon icon--x'].filter(Boolean).join(' ')}
    height={20}
    viewBox="0 0 20 20"
    width={20}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="stroke" d="M14 6L6 14M6 6L14 14" strokeLinecap="square" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Actions/index.tsx
Signals: React

```typescript
'use client'

import React, { createContext, use, useState } from 'react'

type ActionsContextType = {
  Actions: {
    [key: string]: React.ReactNode
  }
  setViewActions: (actions: ActionsContextType['Actions']) => void
}

const ActionsContext = createContext<ActionsContextType>({
  Actions: {},
  setViewActions: () => {},
})

export const useActions = () => use(ActionsContext)

export const ActionsProvider: React.FC<{
  readonly Actions?: {
    [key: string]: React.ReactNode
  }
  readonly children: React.ReactNode
}> = ({ Actions, children }) => {
  const [viewActions, setViewActions] = useState(Actions)

  return (
    <ActionsContext
      value={{
        Actions: {
          ...viewActions,
          ...Actions,
        },
        setViewActions,
      }}
    >
      {children}
    </ActionsContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Auth/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { ClientUser, SanitizedPermissions, TypedUser } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { usePathname, useRouter } from 'next/navigation.js'
import { formatAdminURL, formatApiURL } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { createContext, use, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { stayLoggedInModalSlug } from '../../elements/StayLoggedIn/index.js'
import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { useConfig } from '../Config/index.js'
import { useRouteTransition } from '../RouteTransition/index.js'

export type UserWithToken<T = ClientUser> = {
  /** seconds until expiration */
  exp: number
  token: string
  user: T
}

export type AuthContext<T = ClientUser> = {
  fetchFullUser: () => Promise<null | TypedUser>
  logOut: () => Promise<boolean>
  /**
   * These are the permissions for the current user from a global scope.
   *
   * When checking for permissions on document specific level, use the `useDocumentInfo` hook instead.
   *
   * @example
   *
   * ```tsx
   * import { useAuth } from 'payload/ui'
   *
   * const MyComponent: React.FC = () => {
   *   const { permissions } = useAuth()
   *
   *   if (permissions?.collections?.myCollection?.create) {
   *     // user can create documents in 'myCollection'
   *   }
   *
   *   return null
   * }
   * ```
   *
   * with useDocumentInfo:
   *
   * ```tsx
   * import { useDocumentInfo } from 'payload/ui'
   *
   * const MyComponent: React.FC = () => {
   *  const { docPermissions } = useDocumentInfo()
   *  if (docPermissions?.create) {
   *   // user can create this document
   *  }
   *  return null
   * } ```
   */
  permissions?: SanitizedPermissions
  refreshCookie: (forceRefresh?: boolean) => void
  refreshCookieAsync: () => Promise<ClientUser>
  refreshPermissions: () => Promise<void>
  setPermissions: (permissions: SanitizedPermissions) => void
  setUser: (user: null | UserWithToken<T>) => void
  strategy?: string
  token?: string
  tokenExpirationMs?: number
  user?: null | T
}

const Context = createContext({} as AuthContext)

const maxTimeoutMs = 2147483647

type Props = {
  children: React.ReactNode
  permissions?: SanitizedPermissions
  user?: ClientUser | null
}

export function AuthProvider({
  children,
  permissions: initialPermissions,
  user: initialUser,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const { config } = useConfig()

  const {
    admin: {
      autoLogin,
      autoRefresh,
      routes: { inactivity: logoutInactivityRoute },
      user: userSlug,
    },
    routes: { admin: adminRoute, api: apiRoute },
    serverURL,
  } = config

  const { i18n } = useTranslation()
  const { closeAllModals, openModal } = useModal()
  const { startRouteTransition } = useRouteTransition()

  const [user, setUserInMemory] = useState<ClientUser | null>(initialUser)
  const [tokenInMemory, setTokenInMemory] = useState<string>()
  const [tokenExpirationMs, setTokenExpirationMs] = useState<number>()
  const [permissions, setPermissions] = useState<SanitizedPermissions>(initialPermissions)
  const [forceLogoutBufferMs, setForceLogoutBufferMs] = useState<number>(120_000)
  const [fetchedUserOnMount, setFetchedUserOnMount] = useState(false)

  const refreshTokenTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)
  const reminderTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)
  const forceLogOutTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  const id = user?.id

  const redirectToInactivityRoute = useCallback(() => {
    startRouteTransition(() =>
      router.replace(
        formatAdminURL({
          adminRoute,
          path: `${logoutInactivityRoute}${window.location.pathname.startsWith(adminRoute) ? `?redirect=${encodeURIComponent(window.location.pathname)}` : ''}`,
          serverURL,
        }),
      ),
    )

    closeAllModals()
  }, [router, adminRoute, logoutInactivityRoute, closeAllModals, startRouteTransition, serverURL])

  const revokeTokenAndExpire = useCallback(() => {
    setUserInMemory(null)
    setTokenInMemory(undefined)
    setTokenExpirationMs(undefined)
    clearTimeout(refreshTokenTimeoutRef.current)
  }, [])

  // Handler for reminder timeout - uses useEffectEvent to capture latest autoRefresh value
  const handleReminderTimeout = useEffectEvent(() => {
    if (autoRefresh) {
      refreshCookieEvent()
    } else {
      openModal(stayLoggedInModalSlug)
    }
  })

  const setNewUser = useCallback(
    (userResponse: null | UserWithToken) => {
      clearTimeout(reminderTimeoutRef.current)
      clearTimeout(forceLogOutTimeoutRef.current)

      if (userResponse?.user) {
        setUserInMemory(userResponse.user)
        setTokenInMemory(userResponse.token)
        setTokenExpirationMs(userResponse.exp * 1000)

        const expiresInMs = Math.max(
          0,
          Math.min((userResponse.exp ?? 0) * 1000 - Date.now(), maxTimeoutMs),
        )

        if (expiresInMs) {
          const nextForceLogoutBufferMs = Math.min(60_000, expiresInMs / 2)
          setForceLogoutBufferMs(nextForceLogoutBufferMs)

          reminderTimeoutRef.current = setTimeout(
            handleReminderTimeout,
            Math.max(expiresInMs - nextForceLogoutBufferMs, 0),
          )

          forceLogOutTimeoutRef.current = setTimeout(() => {
            revokeTokenAndExpire()
            redirectToInactivityRoute()
          }, expiresInMs)
        }
      } else {
        revokeTokenAndExpire()
      }
    },
    [redirectToInactivityRoute, revokeTokenAndExpire],
  )

  const refreshCookie = useCallback(
    (forceRefresh?: boolean) => {
      if (!id) {
        return
      }

      const expiresInMs = Math.max(0, (tokenExpirationMs ?? 0) - Date.now())

      if (forceRefresh || (tokenExpirationMs && expiresInMs < forceLogoutBufferMs * 2)) {
        clearTimeout(refreshTokenTimeoutRef.current)
        refreshTokenTimeoutRef.current = setTimeout(async () => {
          try {
            const request = await requests.post(
              formatApiURL({
                apiRoute,
                path: `/${userSlug}/refresh-token?refresh`,
                serverURL,
              }),
              {
                headers: {
                  'Accept-Language': i18n.language,
                },
              },
            )

            if (request.status === 200) {
              const json: UserWithToken = await request.json()
              setNewUser(json)
            } else {
              setNewUser(null)
              redirectToInactivityRoute()
            }
          } catch (e) {
            toast.error(e.message)
          }
        }, 1000)
      }
    },
    [
      apiRoute,
      i18n.language,
      redirectToInactivityRoute,
      serverURL,
      setNewUser,
      tokenExpirationMs,
      userSlug,
      forceLogoutBufferMs,
      id,
    ],
  )

  const refreshCookieAsync = useCallback(
    async (skipSetUser?: boolean): Promise<ClientUser> => {
      try {
        const request = await requests.post(
          formatApiURL({
            apiRoute,
            path: `/${userSlug}/refresh-token`,
            serverURL,
          }),
          {
            headers: {
              'Accept-Language': i18n.language,
            },
          },
        )

        if (request.status === 200) {
          const json: UserWithToken = await request.json()
          if (!skipSetUser) {
            setNewUser(json)
          }
          return json.user
        }

        if (user) {
          setNewUser(null)
          redirectToInactivityRoute()
        }
      } catch (e) {
        toast.error(`Refreshing token failed: ${e.message}`)
      }
      return null
    },
    [apiRoute, i18n.language, redirectToInactivityRoute, serverURL, setNewUser, userSlug, user],
  )

  const logOut = useCallback(async () => {
    try {
      if (user && user.collection) {
        setNewUser(null)
        await requests.post(
          formatApiURL({
            apiRoute,
            path: `/${user.collection}/logout`,
            serverURL,
          }),
        )
      }
    } catch (_) {
      // fail silently and log the user out in state
    }

    return true
  }, [apiRoute, serverURL, setNewUser, user])

  const refreshPermissions = useCallback(
    async ({ locale }: { locale?: string } = {}) => {
      const params = qs.stringify(
        {
          locale,
        },
        {
          addQueryPrefix: true,
        },
      )

      try {
        const request = await requests.get(
          formatApiURL({
            apiRoute,
            path: `/access${params}`,
            serverURL,
          }),
          {
            headers: {
              'Accept-Language': i18n.language,
            },
          },
        )

        if (request.status === 200) {
          const json: SanitizedPermissions = await request.json()
          setPermissions(json)
        } else {
          throw new Error(`Fetching permissions failed with status code ${request.status}`)
        }
      } catch (e) {
        toast.error(`Refreshing permissions failed: ${e.message}`)
      }
    },
    [serverURL, apiRoute, i18n],
  )

  const fetchFullUser = React.useCallback(async () => {
    try {
      const request = await requests.get(
        formatApiURL({
          apiRoute,
          path: `/${userSlug}/me`,
          serverURL,
        }),
        {
          credentials: 'include',
          headers: {
            'Accept-Language': i18n.language,
          },
        },
      )

      if (request.status === 200) {
        const json: UserWithToken = await request.json()
        setNewUser(json)
        return json?.user || null
      }
    } catch (e) {
      toast.error(`Fetching user failed: ${e.message}`)
    }

    return null
  }, [serverURL, apiRoute, userSlug, i18n.language, setNewUser])

  const refreshCookieEvent = useEffectEvent(refreshCookie)
  useEffect(() => {
    // when location changes, refresh cookie
    refreshCookieEvent()
  }, [pathname])

  const fetchFullUserEvent = useEffectEvent(fetchFullUser)
  useEffect(() => {
    async function fetchUserOnMount() {
      await fetchFullUserEvent()
      setFetchedUserOnMount(true)
    }

    void fetchUserOnMount()
  }, [])

  useEffect(() => {
    if (!user && autoLogin && !autoLogin.prefillOnly) {
      void fetchFullUserEvent()
    }
  }, [user, autoLogin])

  useEffect(
    () => () => {
      // remove all timeouts on unmount
      clearTimeout(refreshTokenTimeoutRef.current)
      clearTimeout(reminderTimeoutRef.current)
      clearTimeout(forceLogOutTimeoutRef.current)
    },
    [],
  )

  if (!user && !fetchedUserOnMount) {
    return null
  }

  return (
    <Context
      value={{
        fetchFullUser,
        logOut,
        permissions,
        refreshCookie,
        refreshCookieAsync,
        refreshPermissions,
        setPermissions,
        setUser: setNewUser,
        token: tokenInMemory,
        tokenExpirationMs,
        user,
      }}
    >
      {children}
    </Context>
  )
}

export const useAuth = <T = ClientUser,>(): AuthContext<T> => use(Context) as AuthContext<T>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/ClickOutside/index.tsx
Signals: React

```typescript
import React, { createContext, use, useEffect, useRef } from 'react'

type Listener = {
  handler: () => void
  ref: React.RefObject<HTMLElement>
}

const ClickOutsideContext = createContext<{
  register: (listener: Listener) => void
  unregister: (listener: Listener) => void
} | null>(null)

export const ClickOutsideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listeners = useRef<Set<Listener>>(new Set())

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      listeners.current.forEach(({ handler, ref }) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          handler()
        }
      })
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const register = (listener: Listener) => listeners.current.add(listener)
  const unregister = (listener: Listener) => listeners.current.delete(listener)

  return <ClickOutsideContext value={{ register, unregister }}>{children}</ClickOutsideContext>
}

export const useClickOutsideContext = () => {
  const context = use(ClickOutsideContext)
  if (!context) {
    throw new Error('useClickOutside must be used within a ClickOutsideProvider')
  }
  return context
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/ClientFunction/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

type ModifyClientFunctionContextType = {
  addClientFunction: (args: ModifyFunctionArgs) => void
  removeClientFunction: (args: ModifyFunctionArgs) => void
}
type ClientFunctionsContextType = Record<string, any>

const ModifyClientFunctionContext = React.createContext<ModifyClientFunctionContextType>({
  addClientFunction: () => null,
  removeClientFunction: () => null,
})
const ClientFunctionsContext = React.createContext<ClientFunctionsContextType>({})

type ModifyFunctionArgs = { func: any; key: string }

export const ClientFunctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientFunctions, setClientFunctions] = React.useState({})

  const addClientFunction = React.useCallback((args: ModifyFunctionArgs) => {
    setClientFunctions((state) => {
      const newState = { ...state }
      newState[args.key] = args.func
      return newState
    })
  }, [])

  const removeClientFunction = React.useCallback((args: ModifyFunctionArgs) => {
    setClientFunctions((state) => {
      const newState = { ...state }
      delete newState[args.key]
      return newState
    })
  }, [])

  return (
    <ModifyClientFunctionContext
      value={{
        addClientFunction,
        removeClientFunction,
      }}
    >
      <ClientFunctionsContext value={clientFunctions}>{children}</ClientFunctionsContext>
    </ModifyClientFunctionContext>
  )
}

export const useAddClientFunction = (key: string, func: any) => {
  const { addClientFunction, removeClientFunction } = React.use(ModifyClientFunctionContext)

  React.useEffect(() => {
    addClientFunction({
      func,
      key,
    })

    return () => {
      removeClientFunction({
        func,
        key,
      })
    }
  }, [func, key, addClientFunction, removeClientFunction])
}

export const useClientFunctions = () => {
  return React.use(ClientFunctionsContext)
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Config/index.tsx
Signals: React

```typescript
/* eslint-disable perfectionist/sort-object-types  */ // Need to disable this rule because the order of the overloads is important
'use client'
import type {
  ClientCollectionConfig,
  ClientConfig,
  ClientGlobalConfig,
  CollectionSlug,
  GlobalSlug,
} from 'payload'

import React, { createContext, use, useCallback, useEffect, useMemo } from 'react'

import { useControllableState } from '../../hooks/useControllableState.js'

type GetEntityConfigFn = {
  // Overload #1: collectionSlug only
  // @todo remove "{} |" in 4.0, which would be a breaking change
  (args: { collectionSlug: {} | CollectionSlug; globalSlug?: never }): ClientCollectionConfig

  // Overload #2: globalSlug only
  // @todo remove "{} |" in 4.0, which would be a breaking change
  (args: { collectionSlug?: never; globalSlug: {} | GlobalSlug }): ClientGlobalConfig

  // Overload #3: both/none (fall back to union | null)
  (args: {
    collectionSlug?: {} | CollectionSlug
    globalSlug?: {} | GlobalSlug
  }): ClientCollectionConfig | ClientGlobalConfig | null
}

export type ClientConfigContext = {
  config: ClientConfig
  /**
   * Get a collection or global config by its slug. This is preferred over
   * using `config.collections.find` or `config.globals.find`, because
   * getEntityConfig uses a lookup map for O(1) lookups.
   */
  getEntityConfig: GetEntityConfigFn
  setConfig: (config: ClientConfig) => void
}

const RootConfigContext = createContext<ClientConfigContext | undefined>(undefined)

export const ConfigProvider: React.FC<{
  readonly children: React.ReactNode
  readonly config: ClientConfig
}> = ({ children, config: configFromProps }) => {
  // Need to update local config state if config from props changes, for HMR.
  // That way, config changes will be updated in the UI immediately without needing a refresh.
  // useControllableState handles this for us.
  const [config, setConfig] = useControllableState<ClientConfig>(configFromProps)

  // Build lookup maps for collections and globals so we can do O(1) lookups by slug
  const { collectionsBySlug, globalsBySlug } = useMemo(() => {
    const collectionsBySlug: Record<string, ClientCollectionConfig> = {}
    const globalsBySlug: Record<string, ClientGlobalConfig> = {}

    for (const collection of config.collections) {
      collectionsBySlug[collection.slug] = collection
    }

    for (const global of config.globals) {
      globalsBySlug[global.slug] = global
    }

    return { collectionsBySlug, globalsBySlug }
  }, [config])

  const getEntityConfig = useCallback<GetEntityConfigFn>(
    (args) => {
      if ('collectionSlug' in args) {
        return collectionsBySlug[args.collectionSlug] ?? null
      }

      if ('globalSlug' in args) {
        return globalsBySlug[args.globalSlug] ?? null
      }

      return null as any
    },
    [collectionsBySlug, globalsBySlug],
  )

  const value = useMemo(
    () => ({ config, getEntityConfig, setConfig }),
    [config, getEntityConfig, setConfig],
  )

  return <RootConfigContext value={value}>{children}</RootConfigContext>
}

export const useConfig = (): ClientConfigContext => use(RootConfigContext)

/**
 * This provider shadows the `ConfigProvider` on the _page_ level, allowing us to
 * update the config when needed, e.g. after authentication.
 * The layout `ConfigProvider` is not updated on page navigation / authentication,
 * as the layout does not re-render in those cases.
 *
 * If the config here has the same reference as the config from the layout, we
 * simply reuse the context from the layout to avoid unnecessary re-renders.
 *
 * @experimental This component is experimental and may change or be removed in future releases. Use at your own risk.
 */
export const PageConfigProvider: React.FC<{
  readonly children: React.ReactNode
  readonly config: ClientConfig
}> = ({ children, config: configFromProps }) => {
  const { config: rootConfig, setConfig: setRootConfig } = useConfig()

  /**
   * This `useEffect` is required in order for the _page_ to be able to refresh the client config,
   * which may have been cached on the _layout_ level, where the `ConfigProvider` is managed.
   * Since the layout does not re-render on page navigation / authentication, we need to manually
   * update the config, as the user may have been authenticated in the process, which affects the client config.
   */
  useEffect(() => {
    setRootConfig(configFromProps)
  }, [configFromProps, setRootConfig])

  // If this component receives a different config than what is in context from the layout, it is stale.
  // While stale, we instantiate a new context provider that provides the new config until the root context is updated.
  // Unfortunately, referential equality alone does not work bc the reference is lost during server/client serialization,
  // so we need to also compare the `unauthenticated` property.
  if (
    rootConfig !== configFromProps &&
    rootConfig.unauthenticated !== configFromProps.unauthenticated
  ) {
    return <ConfigProvider config={configFromProps}>{children}</ConfigProvider>
  }

  return children
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/DocumentEvents/index.tsx
Signals: React

```typescript
'use client'
import type { DocumentEvent } from 'payload'

import React, { createContext, use, useState } from 'react'

const Context = createContext<{
  mostRecentUpdate: DocumentEvent | null
  reportUpdate: (event: DocumentEvent) => void
}>({
  mostRecentUpdate: null,
  reportUpdate: () => null,
})

export const DocumentEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mostRecentUpdate, reportUpdate] = useState<DocumentEvent>(null)

  return <Context value={{ mostRecentUpdate, reportUpdate }}>{children}</Context>
}

/**
 * The useDocumentEvents hook provides a way of subscribing to cross-document events,
 * such as updates made to nested documents within a drawer.
 * This hook will report document events that are outside the scope of the document currently being edited.
 *
 * @link https://payloadcms.com/docs/admin/react-hooks#usedocumentevents
 */
export const useDocumentEvents = () => use(Context)
```

--------------------------------------------------------------------------------

````
