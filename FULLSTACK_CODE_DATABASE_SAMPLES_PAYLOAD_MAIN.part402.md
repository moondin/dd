---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 402
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 402 of 695)

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

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/forms/useField/types.ts

```typescript
import type { FieldState, Validate } from 'payload'

export type Options = {
  disableFormData?: boolean
  hasRows?: boolean
  /**
   * If `path` is provided to this hook, it will be used outright. This is useful when calling this hook directly within a custom component.
   * Otherwise, the field will attempt to get the path from the `FieldPathContext` via the `useFieldPath` hook.
   * If still not found, the `potentiallyStalePath` arg will be used. See the note below about why this is important.
   */
  path?: string
  /**
   * Custom server components receive a static `path` prop at render-time, leading to temporarily stale paths when re-ordering rows in form state.
   * This is because when manipulating rows, field paths change in form state, but the prop remains the same until the component is re-rendered on the server.
   * This causes the component to temporarily point to the wrong field in form state until the server responds with a freshly rendered component.
   * To prevent this, fields are wrapped with a `FieldPathContext` which is guaranteed to be up-to-date.
   * The `path` prop that Payload's default fields receive, then, are sent into this hook as the `potentiallyStalePath` arg.
   * This ensures that:
   *   1. Custom components that use this hook directly will still respect the `path` prop as top priority.
   *   2. Custom server components that blindly spread their props into default Payload fields still prefer the dynamic path from context.
   *   3. Components that render default Payload fields directly do not require a `FieldPathProvider`, e.g. the email field in the account view.
   */
  potentiallyStalePath?: string
  /**
   * Client-side validation function fired when the form is submitted.
   */
  validate?: Validate
}

export type FieldType<T> = {
  disabled: boolean
  formInitializing: boolean
  formProcessing: boolean
  formSubmitted: boolean
  initialValue?: T
  path: string
  /**
   * @deprecated - readOnly is no longer returned from useField. Remove this in 4.0.
   */
  readOnly?: boolean
  setValue: (val: unknown, disableModifyingForm?: boolean) => void
  showError: boolean
  value: T
} & Pick<
  FieldState,
  | 'blocksFilterOptions'
  | 'customComponents'
  | 'errorMessage'
  | 'errorPaths'
  | 'filterOptions'
  | 'rows'
  | 'selectFilterOptions'
  | 'valid'
>
```

--------------------------------------------------------------------------------

---[FILE: buildPathSegments.ts]---
Location: payload-main/packages/ui/src/forms/WatchChildErrors/buildPathSegments.ts

```typescript
'use client'
import type { ClientField } from 'payload'

import { fieldAffectsData } from 'payload/shared'

export const buildPathSegments = (fields: ClientField[]): (`${string}.` | string)[] => {
  return fields.reduce((acc: (`${string}.` | string)[], field) => {
    const fields: ClientField[] = 'fields' in field ? field.fields : undefined

    if (fields) {
      if (fieldAffectsData(field)) {
        // group, block, array
        acc.push(`${field.name}.`)
      } else {
        // rows, collapsibles, unnamed-tab
        acc.push(...buildPathSegments(fields))
      }
    } else if (field.type === 'tabs') {
      // tabs
      if ('tabs' in field) {
        field.tabs?.forEach((tab) => {
          if ('name' in tab) {
            acc.push(`${tab.name}.`)
          } else {
            acc.push(...buildPathSegments(tab.fields))
          }
        })
      }
    } else if (fieldAffectsData(field)) {
      // text, number, date, etc.
      acc.push(field.name)
    }

    return acc
  }, [])
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/WatchChildErrors/index.tsx
Signals: React

```typescript
'use client'
import type { ClientField } from 'payload'
import type React from 'react'

import { useThrottledEffect } from '../../hooks/useThrottledEffect.js'
import { useAllFormFields, useFormSubmitted } from '../Form/context.js'
import { buildPathSegments } from './buildPathSegments.js'

type TrackSubSchemaErrorCountProps = {
  fields?: ClientField[]
  /**
   * This path should only include path segments that affect data
   * i.e. it should not include _index-0 type segments
   *
   * For collapsibles and tabs you can simply pass their parent path
   */
  path: (number | string)[]
  setErrorCount: (count: number) => void
}
export const WatchChildErrors: React.FC<TrackSubSchemaErrorCountProps> = ({
  fields,
  path: parentPath,
  setErrorCount,
}) => {
  const [formState] = useAllFormFields()
  const hasSubmitted = useFormSubmitted()

  const segmentsToMatch = buildPathSegments(fields)

  useThrottledEffect(
    () => {
      if (hasSubmitted) {
        let errorCount = 0
        Object.entries(formState).forEach(([key]) => {
          const matchingSegment = segmentsToMatch?.some((segment) => {
            const segmentToMatch = [...parentPath, segment].join('.')
            // match fields with same parent path
            if (segmentToMatch.endsWith('.')) {
              return key.startsWith(segmentToMatch)
            }
            // match fields with same path
            return key === segmentToMatch
          })

          if (matchingSegment) {
            const pathState = formState[key]
            if ('valid' in pathState && !pathState.valid) {
              errorCount += 1
            }
          }
        })
        setErrorCount(errorCount)
      }
    },
    250,
    [formState, hasSubmitted, fields],
  )

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/forms/withCondition/index.tsx
Signals: React

```typescript
'use client'
import type { FieldPaths } from 'payload'
import type { MarkOptional } from 'ts-essentials'

import React from 'react'

import { WatchCondition } from './WatchCondition.js'

export const withCondition = <P extends MarkOptional<FieldPaths, 'indexPath' | 'path'>>(
  Field: React.ComponentType<P>,
): React.FC<P> => {
  const CheckForCondition: React.FC<P> = (props) => {
    const { path } = props

    return (
      <WatchCondition path={path}>
        <Field {...props} />
      </WatchCondition>
    )
  }

  return CheckForCondition
}
```

--------------------------------------------------------------------------------

---[FILE: WatchCondition.tsx]---
Location: payload-main/packages/ui/src/forms/withCondition/WatchCondition.tsx
Signals: React

```typescript
'use client'

import type React from 'react'

import { useFormFields } from '../Form/context.js'

export const WatchCondition: React.FC<{
  children: React.ReactNode
  path: string
}> = (props) => {
  const { children, path } = props

  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)

  const { passesCondition } = field || {}

  if (passesCondition === false) {
    return null
  }

  return children
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/Account/index.tsx
Signals: React, Next.js

```typescript
'use client'
import { usePathname } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { useAuth } from '../../providers/Auth/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { DefaultAccountIcon } from './Default/index.js'
import { GravatarAccountIcon } from './Gravatar/index.js'

export const Account = () => {
  const {
    config: {
      admin: {
        avatar,
        routes: { account: accountRoute },
      },
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  const { user } = useAuth()
  const pathname = usePathname()
  const isOnAccountPage = pathname === formatAdminURL({ adminRoute, path: accountRoute, serverURL })

  if (!user?.email || avatar === 'default') {
    return <DefaultAccountIcon active={isOnAccountPage} />
  }
  if (avatar === 'gravatar') {
    return <GravatarAccountIcon />
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/graphics/Account/Default/index.scss

```text
@layer payload-default {
  .graphic-account {
    vector-effect: non-scaling-stroke;
    overflow: visible;
    position: relative;

    &__bg {
      fill: var(--theme-elevation-50);
      stroke: var(--theme-elevation-200);
      stroke-width: 1px;
    }

    &__head,
    &__body {
      fill: var(--theme-elevation-200);
    }

    &--active {
      .graphic-account {
        &__bg {
          fill: var(--theme-elevation-500);
          stroke: var(--theme-text);
        }

        &__head,
        &__body {
          fill: var(--theme-text);
        }
      }
    }

    &:hover:not(.graphic-account--active) {
      .graphic-account {
        &__bg {
          fill: var(--theme-elevation-200);
          stroke: var(--theme-elevation-600);
        }

        &__head,
        &__body {
          fill: var(--theme-elevation-600);
        }
      }
    }
  }

  [data-theme='light'] {
    .graphic-account {
      &--active {
        .graphic-account {
          &__bg {
            fill: var(--theme-elevation-300);
            stroke: var(--theme-elevation-600);
          }

          &__head,
          &__body {
            fill: var(--theme-elevation-600);
          }
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/Account/Default/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'graphic-account'

export const DefaultAccountIcon: React.FC<{
  active: boolean
}> = (props) => (
  <svg
    className={[baseClass, props?.active && `${baseClass}--active`].filter(Boolean).join(' ')}
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle className={`${baseClass}__bg`} cx="12.5" cy="12.5" r="11.5" />
    <circle className={`${baseClass}__head`} cx="12.5" cy="10.73" r="3.98" />
    <path
      className={`${baseClass}__body`}
      d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/Account/Gravatar/index.tsx
Signals: React

```typescript
'use client'
import md5 from 'md5'
import React from 'react'

import { useAuth } from '../../../providers/Auth/index.js'

export const GravatarAccountIcon: React.FC = () => {
  const { user } = useAuth()

  const hash = md5(user.email.trim().toLowerCase())

  const params = new URLSearchParams({
    default: 'mp',
    r: 'g',
    s: '50',
  }).toString()

  const query = `?${params}`

  return (
    <img
      alt="yas"
      className="gravatar-account"
      height={25}
      src={`https://www.gravatar.com/avatar/${hash}${query}`}
      style={{ borderRadius: '50%' }}
      width={25}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/DefaultBlockImage/index.tsx
Signals: React

```typescript
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid'

export const DefaultBlockImage: React.FC = () => {
  const [patternID] = useState(() => `pattern${uuid()}`)

  return (
    <svg
      fill="none"
      height="151"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 231 151"
      width="231"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${patternID})`}>
        <rect fill="#D9D9D9" height="100%" rx="2" width="100%" />
        <rect
          fill="#BCBCBC"
          height="116.063"
          transform="rotate(52.0687 33.7051 79.3051)"
          width="85.8593"
          x="33.7051"
          y="79.3051"
        />
        <rect
          fill="#BCBCBC"
          height="116.063"
          transform="rotate(52.0687 86.1219 92.6272)"
          width="85.8593"
          x="86.1219"
          y="92.6272"
        />
        <circle cx="189" cy="45" fill="#BCBCBC" r="19" />
        <rect fill="#B8B8B8" height="5" rx="2.5" width="98" x="66" y="70" />
        <rect fill="#B8B8B8" height="5" rx="2.5" width="76" x="77" y="82" />
      </g>
      <defs>
        <clipPath id={`${patternID}`}>
          <rect fill="white" height="151" width="231" />
        </clipPath>
      </defs>
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/File/index.tsx
Signals: React

```typescript
import React from 'react'

export const File: React.FC = () => (
  <svg
    height="150"
    style={{ backgroundColor: '#333333' }}
    viewBox="0 0 150 150"
    width="150"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M82.8876 50.5H55.5555V100.5H94.4444V61.9818H82.8876V50.5Z" fill="white" />
    <path d="M82.8876 61.9818H94.4444L82.8876 50.5V61.9818Z" fill="#9A9A9A" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/Icon/index.tsx
Signals: React

```typescript
import React from 'react'

export const PayloadIcon: React.FC<{
  fill?: string
}> = ({ fill: fillFromProps }) => {
  const fill = fillFromProps || 'var(--theme-elevation-1000)'

  return (
    <svg
      className="graphic-icon"
      height="100%"
      viewBox="0 0 25 25"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.8673 21.2336L4.40922 16.9845C4.31871 16.9309 4.25837 16.8355 4.25837 16.7282V10.1609C4.25837 10.0477 4.38508 9.97616 4.48162 10.0298L13.1404 14.9642C13.2611 15.0358 13.412 14.9464 13.412 14.8093V11.6091C13.412 11.4839 13.3456 11.3647 13.2309 11.2992L2.81624 5.36353C2.72573 5.30989 2.60505 5.30989 2.51454 5.36353L1.15085 6.14422C1.06034 6.19786 1 6.29321 1 6.40048V18.5995C1 18.7068 1.06034 18.8021 1.15085 18.8558L11.8491 24.9583C11.9397 25.0119 12.0603 25.0119 12.1509 24.9583L21.1355 19.8331C21.2562 19.7616 21.2562 19.5948 21.1355 19.5232L18.3357 17.9261C18.2211 17.8605 18.0883 17.8605 17.9737 17.9261L12.175 21.2336C12.0845 21.2872 11.9638 21.2872 11.8733 21.2336H11.8673Z"
        fill={fill}
      />
      <path
        d="M22.8491 6.13827L12.1508 0.0417218C12.0603 -0.0119135 11.9397 -0.0119135 11.8491 0.0417218L6.19528 3.2658C6.0746 3.33731 6.0746 3.50418 6.19528 3.57569L8.97092 5.16091C9.08557 5.22647 9.21832 5.22647 9.33296 5.16091L11.8672 3.71872C11.9578 3.66508 12.0784 3.66508 12.1689 3.71872L19.627 7.96782C19.7175 8.02146 19.7778 8.11681 19.7778 8.22408V14.8212C19.7778 14.9464 19.8442 15.0656 19.9589 15.1311L22.7345 16.7104C22.8552 16.7819 23.006 16.6925 23.006 16.5554V6.40048C23.006 6.29321 22.9457 6.19786 22.8552 6.14423L22.8491 6.13827Z"
        fill={fill}
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/graphics/Logo/index.tsx
Signals: React

```typescript
import React from 'react'

const css = `
  .graphic-logo path {
    fill: var(--theme-elevation-1000);
  }
`

export const PayloadLogo: React.FC = () => (
  <svg
    className="graphic-logo"
    fill="none"
    height="43.5"
    id="b"
    viewBox="0 0 193.38 43.5"
    width="193.38"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{css}</style>
    <g id="c">
      <path d="M18.01,35.63l-12.36-7.13c-.15-.09-.25-.25-.25-.43v-11.02c0-.19.21-.31.37-.22l14.35,8.28c.2.12.45-.03.45-.26v-5.37c0-.21-.11-.41-.3-.52L3.01,9c-.15-.09-.35-.09-.5,0l-2.26,1.31c-.15.09-.25.25-.25.43v20.47c0,.18.1.34.25.43l17.73,10.24c.15.09.35.09.5,0l14.89-8.6c.2-.12.2-.4,0-.52l-4.64-2.68c-.19-.11-.41-.11-.6,0l-9.61,5.55c-.15.09-.35.09-.5,0Z" />
      <path d="M36.21,10.3L18.48.07c-.15-.09-.35-.09-.5,0l-9.37,5.41c-.2.12-.2.4,0,.52l4.6,2.66c.19.11.41.11.6,0l4.2-2.42c.15-.09.35-.09.5,0l12.36,7.13c.15.09.25.25.25.43v11.07c0,.21.11.41.3.52l4.6,2.65c.2.12.45-.03.45-.26V10.74c0-.18-.1-.34-.25-.43Z" />
      <g id="d">
        <path d="M193.38,9.47c0,1.94-1.48,3.32-3.3,3.32s-3.31-1.39-3.31-3.32,1.49-3.31,3.31-3.31,3.3,1.39,3.3,3.31ZM192.92,9.47c0-1.68-1.26-2.88-2.84-2.88s-2.84,1.2-2.84,2.88,1.26,2.89,2.84,2.89,2.84-1.2,2.84-2.89ZM188.69,11.17v-3.51h1.61c.85,0,1.35.39,1.35,1.15,0,.53-.3.86-.67,1.02l.79,1.35h-.89l-.72-1.22h-.64v1.22h-.82ZM190.18,9.31c.46,0,.64-.16.64-.5s-.19-.49-.64-.49h-.67v.99h.67Z" />
        <path d="M54.72,24.84v10.93h-5.4V6.1h12.26c7.02,0,11.1,3.2,11.1,9.39s-4.07,9.35-11.06,9.35h-6.9,0ZM61.12,20.52c4.07,0,6.11-1.66,6.11-5.03s-2.04-5.03-6.11-5.03h-6.4v10.06h6.4Z" />
        <path d="M85.94,32.45c-1,2.41-3.66,3.78-7.02,3.78-4.11,0-7.11-2.29-7.11-6.11,0-4.24,3.32-5.98,7.61-6.48l6.32-.71v-1c0-2.58-1.58-3.82-3.99-3.82s-3.74,1.29-3.91,3.24h-5.11c.46-4.53,3.99-7.19,9.18-7.19,5.74,0,9.02,2.7,9.02,8.19v8.15c0,1.95.08,3.58.42,5.28h-5.11c-.21-1.16-.29-2.29-.29-3.32h0ZM85.73,27.58v-1.29l-4.7.54c-2.24.29-3.95.79-3.95,2.99,0,1.66,1.16,2.7,3.28,2.7,2.74,0,5.36-1.62,5.36-4.95h0Z" />
        <path d="M90.39,14.66h5.4l5.86,15.92h.08l5.57-15.92h5.28l-8.23,21.49c-2,5.28-4.45,7.32-8.89,7.36-.71,0-1.7-.08-2.45-.21v-4.03c.62.13.96.13,1.41.13,2.16,0,3.07-.75,4.2-3.66l-8.23-21.07h0Z" />
        <path d="M113.46,35.77V6.1h5.32v29.67h-5.32Z" />
        <path d="M130.79,36.27c-6.23,0-10.68-4.2-10.68-11.05s4.45-11.05,10.68-11.05,10.68,4.24,10.68,11.05-4.45,11.05-10.68,11.05ZM130.79,32.32c3.41,0,5.36-2.66,5.36-7.11s-1.95-7.11-5.36-7.11-5.36,2.7-5.36,7.11,1.91,7.11,5.36,7.11Z" />
        <path d="M156.19,32.45c-1,2.41-3.66,3.78-7.02,3.78-4.11,0-7.11-2.29-7.11-6.11,0-4.24,3.32-5.98,7.61-6.48l6.32-.71v-1c0-2.58-1.58-3.82-3.99-3.82s-3.74,1.29-3.91,3.24h-5.11c.46-4.53,3.99-7.19,9.19-7.19,5.74,0,9.02,2.7,9.02,8.19v8.15c0,1.95.08,3.58.42,5.28h-5.11c-.21-1.16-.29-2.29-.29-3.32h0ZM155.98,27.58v-1.29l-4.7.54c-2.24.29-3.95.79-3.95,2.99,0,1.66,1.16,2.7,3.28,2.7,2.74,0,5.36-1.62,5.36-4.95h0Z" />
        <path d="M178.5,32.41c-1.04,2.12-3.58,3.87-6.78,3.87-5.53,0-9.31-4.49-9.31-11.05s3.78-11.05,9.31-11.05c3.28,0,5.69,1.83,6.69,3.95V6.1h5.32v29.67h-5.24v-3.37h0ZM178.55,24.84c0-4.11-1.95-6.78-5.32-6.78s-5.45,2.83-5.45,7.15,2,7.15,5.45,7.15,5.32-2.66,5.32-6.78v-.75h0Z" />
      </g>
    </g>
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: useClickOutside.ts]---
Location: payload-main/packages/ui/src/hooks/useClickOutside.ts
Signals: React

```typescript
import { useEffect } from 'react'

import { useClickOutsideContext } from '../providers/ClickOutside/index.js'

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
  enabled = true,
) {
  const { register, unregister } = useClickOutsideContext()

  useEffect(() => {
    if (!enabled || !ref.current) {
      return
    }

    const listener = { handler, ref }
    register(listener)
    return () => unregister(listener)
  }, [ref, handler, enabled, register, unregister])
}
```

--------------------------------------------------------------------------------

---[FILE: useControllableState.ts]---
Location: payload-main/packages/ui/src/hooks/useControllableState.ts
Signals: React

```typescript
'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * A hook for managing state that can be controlled by props but also overridden locally.
 * Props always take precedence if they change, but local state can override them temporarily.
 *
 * @param propValue - The controlled value from props
 * @param fallbackValue - Value to use when propValue is null or undefined
 *
 * @internal - may change or be removed without a major version bump
 */
export function useControllableState<T, D>(
  propValue: T,
  fallbackValue: D,
): [T extends NonNullable<T> ? T : D | NonNullable<T>, (value: ((prev: T) => T) | T) => void]

export function useControllableState<T>(propValue: T): [T, (value: ((prev: T) => T) | T) => void]

export function useControllableState<T, D>(
  propValue: T,
  fallbackValue?: D,
): [T extends NonNullable<T> ? T : D | NonNullable<T>, (value: ((prev: T) => T) | T) => void] {
  const [localValue, setLocalValue] = useState<T>(propValue)
  const initialRenderRef = useRef(true)

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    setLocalValue(propValue)
  }, [propValue])

  return [localValue ?? fallbackValue, setLocalValue] as [
    T extends NonNullable<T> ? T : D | NonNullable<T>,
    (value: ((prev: T) => T) | T) => void,
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: useDebounce.ts]---
Location: payload-main/packages/ui/src/hooks/useDebounce.ts
Signals: React

```typescript
'use client'
import { useEffect, useState } from 'react'

export function useDebounce<T = unknown>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

--------------------------------------------------------------------------------

---[FILE: useDebouncedCallback.ts]---
Location: payload-main/packages/ui/src/hooks/useDebouncedCallback.ts
Signals: React

```typescript
'use client'
import { useCallback, useRef } from 'react'

/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export const useDebouncedCallback = <TFunctionArgs = any>(func, wait) => {
  // Use a ref to store the timeout between renders
  // and prevent changes to it from causing re-renders
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  return useCallback(
    (...args: TFunctionArgs[]) => {
      const later = () => {
        clearTimeout(timeout.current)
        func(...args)
      }

      clearTimeout(timeout.current)
      timeout.current = setTimeout(later, wait)
    },
    [func, wait],
  )
}
```

--------------------------------------------------------------------------------

---[FILE: useDebouncedEffect.ts]---
Location: payload-main/packages/ui/src/hooks/useDebouncedEffect.ts
Signals: React

```typescript
'use client'
import type { DependencyList } from 'react'

import { useEffect, useState } from 'react'

export function useDebouncedEffect(effect: () => void, deps: DependencyList, delay: number): void {
  const [debouncedEffect, setDebouncedEffect] = useState<() => void>(() => effect)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEffect(() => effect)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [...deps, delay])

  useEffect(() => {
    debouncedEffect()
  }, [debouncedEffect])
}
```

--------------------------------------------------------------------------------

---[FILE: useDelay.ts]---
Location: payload-main/packages/ui/src/hooks/useDelay.ts
Signals: React

```typescript
'use client'
import * as React from 'react'

type Result = [boolean, () => void]
export const useDelay = (delay: number, triggerOnMount = false): Result => {
  const [hasDelayed, setHasDelayed] = React.useState(false)
  const triggerTimeoutRef = React.useRef<NodeJS.Timeout>(undefined)

  const triggerDelay = React.useCallback(() => {
    setHasDelayed(false)
    clearTimeout(triggerTimeoutRef.current)
    triggerTimeoutRef.current = setTimeout(() => {
      setHasDelayed(true)
    }, delay)

    return () => {
      clearTimeout(triggerTimeoutRef.current)
    }
  }, [delay])

  React.useEffect(() => {
    if (triggerOnMount) {
      triggerDelay()
    }
  }, [triggerDelay, triggerOnMount])

  return [hasDelayed, triggerDelay]
}
```

--------------------------------------------------------------------------------

---[FILE: useDelayedRender.ts]---
Location: payload-main/packages/ui/src/hooks/useDelayedRender.ts
Signals: React

```typescript
'use client'
import * as React from 'react'

import { useDelay } from './useDelay.js'

type DelayedRenderProps = {
  /** Time in ms to wait before "mounting" the component. */
  delayBeforeShow: number
  /** Time in ms for the "enter" phase of the transition, after delay completes. */
  inTimeout: number
  /** Min time in ms for the "entered" phase of the transition. */
  minShowTime: number
  /** Time in ms for the exit phase of the transition. */
  outTimeout: number
  /** `true` starts the mount process.
   * `false` starts the unmount process.
   * */
  show: boolean
}
type useDelayedRenderT = (props: DelayedRenderProps) => {
  /** `true` if the component has mounted after the timeout. */
  isMounted: boolean
  /** `true` if the component is unmounting. */
  isUnmounting: boolean
  /** Call this function to trigger the timeout delay before rendering. */
  triggerDelayedRender: () => void
}
export const useDelayedRender: useDelayedRenderT = ({
  delayBeforeShow,
  inTimeout,
  minShowTime,
  outTimeout,
  show,
}) => {
  const totalMountTime = inTimeout + minShowTime + outTimeout
  const [hasDelayed, triggerDelay] = useDelay(delayBeforeShow)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isUnmounting, setIsUnmounting] = React.useState(false)
  const onMountTimestampRef = React.useRef(0)
  const unmountTimeoutRef: React.RefObject<NodeJS.Timeout | undefined> = React.useRef(undefined)

  const unmount = React.useCallback(() => {
    setIsUnmounting(true)
    unmountTimeoutRef.current = setTimeout(() => {
      setIsMounted(false)
      setIsUnmounting(false)
    }, outTimeout)
  }, [setIsUnmounting, outTimeout])

  React.useEffect(() => {
    const shouldMount = hasDelayed && !isMounted && show
    const shouldUnmount = isMounted && !show

    if (shouldMount) {
      onMountTimestampRef.current = Date.now()
      setIsMounted(true)
    } else if (shouldUnmount) {
      const totalTimeMounted = Date.now() - onMountTimestampRef.current
      const remainingTime = totalMountTime - totalTimeMounted
      clearTimeout(unmountTimeoutRef.current)
      unmountTimeoutRef.current = setTimeout(unmount, Math.max(0, remainingTime))
    }
  }, [isMounted, show, unmount, totalMountTime, hasDelayed])

  return {
    isMounted,
    isUnmounting,
    triggerDelayedRender: triggerDelay,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useEffectEvent.ts]---
Location: payload-main/packages/ui/src/hooks/useEffectEvent.ts
Signals: React

```typescript
'use client'

/**

Taken and modified from https://github.com/bluesky-social/social-app/blob/ce0bf867ff3b50a495d8db242a7f55371bffeadc/src/lib/hooks/useNonReactiveCallback.ts

Copyright 2023–2025 Bluesky PBC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { useCallback, useInsertionEffect, useRef } from 'react'

// This should be used sparingly. It erases reactivity, i.e. when the inputs
// change, the function itself will remain the same. This means that if you
// use this at a higher level of your tree, and then some state you read in it
// changes, there is no mechanism for anything below in the tree to "react"
// to this change (e.g. by knowing to call your function again).
//
// Also, you should avoid calling the returned function during rendering
// since the values captured by it are going to lag behind.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useEffectEvent<T extends Function>(fn: T): T {
  const ref = useRef(fn)
  useInsertionEffect(() => {
    ref.current = fn
  }, [fn])
  return useCallback((...args: any) => {
    const latestFn = ref.current
    return latestFn(...args)
  }, []) as unknown as T
}
```

--------------------------------------------------------------------------------

---[FILE: useHotkey.ts]---
Location: payload-main/packages/ui/src/hooks/useHotkey.ts
Signals: React

```typescript
'use client'

import { useModal } from '@faceless-ui/modal'
import { setsAreEqual } from 'payload/shared'
import { useCallback, useEffect } from 'react'

// Required to be outside of hook, else debounce would be necessary
// and then one could not prevent the default behaviour.

// It maps the pressed keys with the time they were pressed, in order to implement a maximum time
// for the user to press the next key in the sequence

// This is necessary to prevent a bug where the keyup event, which unsets the key as pressed
// is not fired when the window is not focused.
// When the user then comes back to the window, the key is still registered as pressed, even though it's not.
const pressedKeys = new Map<string, number>([])

const map = {
  altleft: 'alt',
  altright: 'alt',
  controlleft: 'ctrl',
  controlright: 'ctrl',
  ctrlleft: 'ctrl',
  ctrlright: 'ctrl',
  escape: 'esc',
  metaleft: 'meta',
  metaright: 'meta',
  osleft: 'meta',
  osright: 'meta',
  shiftleft: 'shift',
  shiftright: 'shift',
}

const stripKey = (key: string) => {
  return (map[key.toLowerCase()] || key).trim().toLowerCase().replace('key', '')
}

const pushToKeys = (code: string) => {
  const key = stripKey(code)

  // There is a weird bug with macos that if the keys are not cleared they remain in the
  // pressed keys set.
  if (key === 'meta') {
    pressedKeys.forEach(
      (time, pressedKey) => pressedKey !== 'meta' && pressedKeys.delete(pressedKey),
    )
  }

  pressedKeys.set(key, Date.now())
}

const removeFromKeys = (code: string) => {
  const key = stripKey(code)
  // There is a weird bug with macos that if the keys are not cleared they remain in the
  // pressed keys set.
  if (key === 'meta') {
    pressedKeys.clear()
  }
  pressedKeys.delete(key)
}

/**
 * Hook function to work with hotkeys.
 * @param param0.keyCode {string[]} The keys to listen for (`Event.code` without `'Key'` and lowercased)
 * @param param0.cmdCtrlKey {boolean} Whether Ctrl on windows or Cmd on mac must be pressed
 * @param param0.editDepth {boolean} This ensures that the hotkey is only triggered for the most top-level drawer in case there are nested drawers
 * @param func The callback function
 */
export const useHotkey = (
  options: {
    cmdCtrlKey: boolean
    editDepth: number
    keyCodes: string[]
  },
  func: (e: KeyboardEvent) => void,
): void => {
  const { cmdCtrlKey, editDepth, keyCodes } = options

  const { modalState } = useModal()

  const keydown = useCallback(
    (event: CustomEvent | KeyboardEvent) => {
      const e: KeyboardEvent = event.detail?.key ? event.detail : event
      if (e.key === undefined) {
        // Autofill events, or other synthetic events, can be ignored
        return
      }

      // Filter out pressed keys which have been pressed > 3 seconds ago
      pressedKeys.forEach((time, key) => {
        if (Date.now() - time > 3000) {
          pressedKeys.delete(key)
        }
      })

      if (e.code) {
        pushToKeys(e.code)
      }

      // Check for Mac and iPad
      const hasCmd = window.navigator.userAgent.includes('Mac OS X')
      const pressedWithoutModifier = [...pressedKeys.keys()].filter(
        (key) => !['alt', 'ctrl', 'meta', 'shift'].includes(key),
      )

      // Check whether arrays contain the same values (regardless of number of occurrences)
      if (
        setsAreEqual(new Set(pressedWithoutModifier), new Set(keyCodes)) &&
        (!cmdCtrlKey || (hasCmd && pressedKeys.has('meta')) || (!hasCmd && e.ctrlKey))
      ) {
        // get the maximum edit depth by counting the number of open drawers. modalState is and object which contains the state of all drawers.
        const maxEditDepth =
          Object.keys(modalState).filter((key) => modalState[key]?.isOpen)?.length + 1 || 1

        if (maxEditDepth !== editDepth) {
          // We only want to execute the hotkey from the most top-level drawer / edit depth.
          return
        }
        // execute the function associated with the maximum edit depth
        func(e)
      }
    },
    [keyCodes, cmdCtrlKey, editDepth, modalState, func],
  )

  const keyup = useCallback((e: KeyboardEvent) => {
    if (e.code) {
      removeFromKeys(e.code)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', keydown, false)
    document.addEventListener('bypassKeyDown', keydown, false) // this is called if the keydown event's propagation is stopped by react-select
    document.addEventListener('keyup', keyup, false)

    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('bypassKeyDown', keydown)
      document.removeEventListener('keyup', keyup)
    }
  }, [keydown, keyup])
}
```

--------------------------------------------------------------------------------

---[FILE: useIntersect.ts]---
Location: payload-main/packages/ui/src/hooks/useIntersect.ts
Signals: React

```typescript
'use client'

import type React from 'react'

import { useEffect, useRef, useState } from 'react'

type Intersect = [
  setNode: React.Dispatch<HTMLElement>,
  entry: IntersectionObserverEntry,
  node: HTMLElement,
]

export const useIntersect = (
  { root = null, rootMargin = '0px', threshold = 0 } = {},
  disable?: boolean,
): Intersect => {
  const [entry, updateEntry] = useState<IntersectionObserverEntry>()
  const [node, setNode] = useState(null)

  const observer = useRef(
    typeof window !== 'undefined' && 'IntersectionObserver' in window && !disable
      ? new window.IntersectionObserver(([ent]) => updateEntry(ent), {
          root,
          rootMargin,
          threshold,
        })
      : null,
  )

  useEffect(() => {
    if (disable) {
      return
    }
    const { current: currentObserver } = observer
    currentObserver.disconnect()

    if (node) {
      currentObserver.observe(node)
    }

    return () => currentObserver.disconnect()
  }, [node, disable])

  return [setNode, entry, node]
}
```

--------------------------------------------------------------------------------

---[FILE: usePayloadAPI.ts]---
Location: payload-main/packages/ui/src/hooks/usePayloadAPI.ts
Signals: React

```typescript
'use client'
import type React from 'react'

import * as qs from 'qs-esm'
import { useEffect, useRef, useState } from 'react'

import { useLocale } from '../providers/Locale/index.js'
import { useTranslation } from '../providers/Translation/index.js'
import { requests } from '../utilities/api.js'

type Result = [
  {
    data: any
    isError: boolean
    isLoading: boolean
  },
  {
    setParams: React.Dispatch<unknown>
  },
]

type Options = {
  initialData?: any
  initialParams?: unknown
}

type UsePayloadAPI = (url: string, options?: Options) => Result

export const usePayloadAPI: UsePayloadAPI = (url, options = {}) => {
  const { initialData, initialParams = {} } = options

  const { i18n } = useTranslation()
  const [data, setData] = useState(initialData || {})
  const [params, setParams] = useState(initialParams)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [isError, setIsError] = useState(false)
  const { code: locale } = useLocale()
  const hasInitialized = useRef(false)

  const search = qs.stringify(
    {
      locale,
      ...(typeof params === 'object' ? params : {}),
    },
    {
      addQueryPrefix: true,
    },
  )

  // If `initialData`, no need to make a request
  useEffect(() => {
    if (initialData && !hasInitialized.current) {
      hasInitialized.current = true
      return
    }

    const abortController = new AbortController()

    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const response = await requests.get(`${url}${search}`, {
          headers: {
            'Accept-Language': i18n.language,
          },
          signal: abortController.signal,
        })

        if (response.status > 201) {
          setIsError(true)
        }

        const json = await response.json()

        setData(json)
        setIsLoading(false)
      } catch (error) {
        if (!abortController.signal.aborted) {
          setIsError(true)
          setIsLoading(false)
        }
      }
    }

    if (url) {
      void fetchData()
    } else {
      setIsError(false)
      setIsLoading(false)
    }

    return () => {
      try {
        abortController.abort()
      } catch (_err) {
        // swallow error
      }
    }
  }, [url, locale, search, i18n.language, initialData])

  // If `initialData` changes, reset the state
  useEffect(() => {
    if (initialData && hasInitialized.current) {
      setData(initialData)
    }
  }, [initialData])

  return [{ data, isError, isLoading }, { setParams }]
}
```

--------------------------------------------------------------------------------

````
