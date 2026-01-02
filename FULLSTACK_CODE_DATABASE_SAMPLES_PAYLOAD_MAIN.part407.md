---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 407
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 407 of 695)

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

---[FILE: collisionDetection.ts]---
Location: payload-main/packages/ui/src/providers/LivePreview/collisionDetection.ts

```typescript
import type { CollisionDetection } from '@dnd-kit/core'

import { rectIntersection } from '@dnd-kit/core'

// If the toolbar exits the preview area, we need to reset its position
// This will prevent the toolbar from getting stuck outside the preview area
export const customCollisionDetection: CollisionDetection = ({
  collisionRect,
  droppableContainers,
  ...args
}) => {
  const droppableContainer = droppableContainers.find(({ id }) => id === 'live-preview-area')

  const rectIntersectionCollisions = rectIntersection({
    ...args,
    collisionRect,
    droppableContainers: [droppableContainer],
  })

  // Collision detection algorithms return an array of collisions
  if (rectIntersectionCollisions.length === 0) {
    // The preview area is not intersecting, return early
    return rectIntersectionCollisions
  }

  // Compute whether the draggable element is completely contained within the preview area
  const previewAreaRect = droppableContainer?.rect?.current

  const isContained =
    collisionRect.top >= previewAreaRect.top &&
    collisionRect.left >= previewAreaRect.left &&
    collisionRect.bottom <= previewAreaRect.bottom &&
    collisionRect.right <= previewAreaRect.right

  if (isContained) {
    return rectIntersectionCollisions
  }
}
```

--------------------------------------------------------------------------------

---[FILE: context.ts]---
Location: payload-main/packages/ui/src/providers/LivePreview/context.ts
Signals: React

```typescript
'use client'
import type { LivePreviewConfig, LivePreviewURLType } from 'payload'
import type { Dispatch } from 'react'
import type React from 'react'

import { createContext, use } from 'react'

import type { usePopupWindow } from '../../hooks/usePopupWindow.js'
import type { SizeReducerAction } from './sizeReducer.js'

export interface LivePreviewContextType {
  appIsReady: boolean
  breakpoint: LivePreviewConfig['breakpoints'][number]['name']
  breakpoints: LivePreviewConfig['breakpoints']
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  isLivePreviewEnabled: boolean
  isLivePreviewing: boolean
  isPopupOpen: boolean
  isPreviewEnabled: boolean
  listeningForMessages?: boolean
  /**
   * The URL that has finished loading in the iframe or popup.
   * For example, if you set the `url`, it will begin to load into the iframe,
   * but `loadedURL` will not be set until the iframe's `onLoad` event fires.
   */
  loadedURL?: string
  measuredDeviceSize: {
    height: number
    width: number
  }
  openPopupWindow: ReturnType<typeof usePopupWindow>['openPopupWindow']
  popupRef?: React.RefObject<null | Window>
  previewURL?: string
  previewWindowType: 'iframe' | 'popup'
  setAppIsReady: (appIsReady: boolean) => void
  setBreakpoint: (breakpoint: LivePreviewConfig['breakpoints'][number]['name']) => void
  setHeight: (height: number) => void
  setIsLivePreviewing: (isLivePreviewing: boolean) => void
  setLoadedURL: (loadedURL: string) => void
  setMeasuredDeviceSize: (size: { height: number; width: number }) => void
  setPreviewURL: (url: string) => void
  setPreviewWindowType: (previewWindowType: 'iframe' | 'popup') => void
  setSize: Dispatch<SizeReducerAction>
  setToolbarPosition: (position: { x: number; y: number }) => void

  /**
   * Sets the URL of the preview (either iframe or popup).
   * Will trigger a reload of the window.
   */
  setURL: (url: string) => void
  setWidth: (width: number) => void
  setZoom: (zoom: number) => void
  size: {
    height: number
    width: number
  }
  toolbarPosition: {
    x: number
    y: number
  }
  /**
   * The live preview url property can be either a string or a function that returns a string.
   * It is important to know which one it is, so that we can opt in/out of certain behaviors, e.g. calling the server to get the URL.
   */
  typeofLivePreviewURL?: 'function' | 'string'
  url: LivePreviewURLType
  zoom: number
}

export const LivePreviewContext = createContext<LivePreviewContextType>({
  appIsReady: false,
  breakpoint: undefined,
  breakpoints: undefined,
  iframeRef: undefined,
  isLivePreviewEnabled: undefined,
  isLivePreviewing: false,
  isPopupOpen: false,
  isPreviewEnabled: undefined,
  measuredDeviceSize: {
    height: 0,
    width: 0,
  },
  openPopupWindow: () => {},
  popupRef: undefined,
  previewURL: undefined,
  previewWindowType: 'iframe',
  setAppIsReady: () => {},
  setBreakpoint: () => {},
  setHeight: () => {},
  setIsLivePreviewing: () => {},
  setLoadedURL: () => {},
  setMeasuredDeviceSize: () => {},
  setPreviewURL: () => {},
  setPreviewWindowType: () => {},
  setSize: () => {},
  setToolbarPosition: () => {},
  setURL: () => {},
  setWidth: () => {},
  setZoom: () => {},
  size: {
    height: 0,
    width: 0,
  },
  toolbarPosition: {
    x: 0,
    y: 0,
  },
  typeofLivePreviewURL: undefined,
  url: undefined,
  zoom: 1,
})

export const useLivePreviewContext = () => use(LivePreviewContext)

/**
 * Hook to access live preview context values. Separated to prevent breaking changes. In the future this hook can be removed in favour of just using the LivePreview one.
 */
export const usePreviewURL = () => {
  const { isPreviewEnabled, previewURL, setPreviewURL } = use(LivePreviewContext)

  return { isPreviewEnabled, previewURL, setPreviewURL }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/providers/LivePreview/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .live-preview {
    width: 100%;
    display: flex;
    --gradient: linear-gradient(to left, rgba(0, 0, 0, 0.04) 0%, transparent 100%);

    [dir='rtl'] & {
      flex-direction: row-reverse;
    }

    &--popup-open {
      .live-preview {
        &__edit {
          padding-right: var(--gutter-h);
        }
      }
    }

    &__main {
      width: 40%;
      display: flex;
      flex-direction: column;
      min-height: 100%;
      position: relative;

      &--popup-open {
        width: 100%;
      }

      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        width: calc(var(--base) * 2);
        height: 100%;
        background: var(--gradient);
        pointer-events: none;
        z-index: -1;
      }
    }

    @include mid-break {
      flex-direction: column;

      &__main {
        min-height: initial;
        width: 100%;

        &::after {
          display: none;
        }
      }

      &__form {
        display: block;
      }
    }
  }

  html[data-theme='dark'] {
    .live-preview {
      --gradient: linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/LivePreview/index.tsx
Signals: React

```typescript
'use client'
import type { CollectionPreferences, LivePreviewConfig, LivePreviewURLType } from 'payload'

import { DndContext } from '@dnd-kit/core'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { LivePreviewContextType } from './context.js'

import { usePopupWindow } from '../../hooks/usePopupWindow.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { usePreferences } from '../../providers/Preferences/index.js'
import { formatAbsoluteURL } from '../../utilities/formatAbsoluteURL.js'
import { customCollisionDetection } from './collisionDetection.js'
import { LivePreviewContext } from './context.js'
import { sizeReducer } from './sizeReducer.js'

export type LivePreviewProviderProps = {
  appIsReady?: boolean
  breakpoints?: LivePreviewConfig['breakpoints']
  children: React.ReactNode
  deviceSize?: {
    height: number
    width: number
  }
  isLivePreviewEnabled?: boolean
  isLivePreviewing: boolean
  /**
   * This specifically relates to `admin.preview` function in the config instead of live preview.
   */
  isPreviewEnabled?: boolean
  /**
   * This specifically relates to `admin.preview` function in the config instead of live preview.
   */
  previewURL?: string
} & Pick<LivePreviewContextType, 'typeofLivePreviewURL' | 'url'>

export const LivePreviewProvider: React.FC<LivePreviewProviderProps> = ({
  breakpoints: incomingBreakpoints,
  children,
  isLivePreviewEnabled,
  isLivePreviewing: incomingIsLivePreviewing,
  isPreviewEnabled,
  previewURL: previewURLFromProps,
  typeofLivePreviewURL,
  url: urlFromProps,
}) => {
  const [previewWindowType, setPreviewWindowType] = useState<'iframe' | 'popup'>('iframe')
  const [isLivePreviewing, setIsLivePreviewing] = useState(incomingIsLivePreviewing)

  const breakpoints: LivePreviewConfig['breakpoints'] = useMemo(
    () => [
      ...(incomingBreakpoints || []),
      {
        name: 'responsive',
        height: '100%',
        label: 'Responsive',
        width: '100%',
      },
    ],
    [incomingBreakpoints],
  )

  const [url, setURL] = useState<string>('')
  const [previewURL, setPreviewURL] = useState<string>(previewURLFromProps)

  const { isPopupOpen, openPopupWindow, popupRef } = usePopupWindow({
    eventType: 'payload-live-preview',
    url,
  })

  const [appIsReady, setAppIsReady] = useState(false)
  const [listeningForMessages, setListeningForMessages] = useState(false)

  const { collectionSlug, globalSlug } = useDocumentInfo()

  const isFirstRender = useRef(true)

  const { setPreference } = usePreferences()

  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const [loadedURL, setLoadedURL] = useState<string>()

  const [zoom, setZoom] = useState(1)

  const [position, setPosition] = useState({ x: 0, y: 0 })

  const [size, setSize] = React.useReducer(sizeReducer, { height: 0, width: 0 })

  const [measuredDeviceSize, setMeasuredDeviceSize] = useState({
    height: 0,
    width: 0,
  })

  const [breakpoint, setBreakpoint] =
    React.useState<LivePreviewConfig['breakpoints'][0]['name']>('responsive')

  /**
   * A "middleware" callback fn that does some additional work before `setURL`.
   * This is what we provide through context, bc it:
   *  - ensures the URL is absolute
   *  - resets `appIsReady` to `false` while the new URL is loading
   */
  const setLivePreviewURL = useCallback<LivePreviewContextType['setURL']>(
    (_incomingURL) => {
      let incomingURL: LivePreviewURLType

      if (typeof _incomingURL === 'string') {
        incomingURL = formatAbsoluteURL(_incomingURL)
      }

      if (!incomingURL) {
        setIsLivePreviewing(false)
      }

      if (incomingURL !== url) {
        setAppIsReady(false)
        setURL(incomingURL)
      }
    },
    [url],
  )

  /**
   * `url` needs to be relative to the window, which cannot be done on initial render.
   */
  useEffect(() => {
    if (typeof urlFromProps === 'string') {
      setURL(formatAbsoluteURL(urlFromProps))
    }
  }, [urlFromProps])

  // The toolbar needs to freely drag and drop around the page
  const handleDragEnd = (ev) => {
    // only update position if the toolbar is completely within the preview area
    // otherwise reset it back to the previous position
    // TODO: reset to the nearest edge of the preview area
    if (ev.over && ev.over.id === 'live-preview-area') {
      const newPos = {
        x: position.x + ev.delta.x,
        y: position.y + ev.delta.y,
      }

      setPosition(newPos)
    } else {
      // reset
    }
  }

  const setWidth = useCallback(
    (width) => {
      setSize({ type: 'width', value: width })
    },
    [setSize],
  )

  const setHeight = useCallback(
    (height) => {
      setSize({ type: 'height', value: height })
    },
    [setSize],
  )

  // explicitly set new width and height when as new breakpoints are selected
  // exclude `custom` breakpoint as it is handled by the `setWidth` and `setHeight` directly
  useEffect(() => {
    const foundBreakpoint = breakpoints?.find((bp) => bp.name === breakpoint)

    if (
      foundBreakpoint &&
      breakpoint !== 'responsive' &&
      breakpoint !== 'custom' &&
      typeof foundBreakpoint?.width === 'number' &&
      typeof foundBreakpoint?.height === 'number'
    ) {
      setSize({
        type: 'reset',
        value: {
          height: foundBreakpoint.height,
          width: foundBreakpoint.width,
        },
      })
    }
  }, [breakpoint, breakpoints])

  /**
   * Receive the `ready` message from the popup window
   * This indicates that the app is ready to receive `window.postMessage` events
   * This is also the only cross-origin way of detecting when a popup window has loaded
   * Unlike iframe elements which have an `onLoad` handler, there is no way to access `window.open` on popups
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        url?.startsWith(event.origin) &&
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'payload-live-preview'
      ) {
        if (event.data.ready) {
          setAppIsReady(true)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    setListeningForMessages(true)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [url, listeningForMessages])

  const handleWindowChange = useCallback(
    (type: 'iframe' | 'popup') => {
      setAppIsReady(false)
      setPreviewWindowType(type)
      if (type === 'popup') {
        openPopupWindow()
      }
    },
    [openPopupWindow],
  )

  // when the user closes the popup window, switch back to the iframe
  // the `usePopupWindow` reports the `isPopupOpen` state for us to use here
  useEffect(() => {
    const newPreviewWindowType = isPopupOpen ? 'popup' : 'iframe'

    if (newPreviewWindowType !== previewWindowType) {
      handleWindowChange('iframe')
    }
  }, [previewWindowType, isPopupOpen, handleWindowChange])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    void setPreference<CollectionPreferences>(
      collectionSlug ? `collection-${collectionSlug}` : `global-${globalSlug}`,
      {
        editViewType: isLivePreviewing ? 'live-preview' : 'default',
      },
      true,
    )
  }, [isLivePreviewing, setPreference, collectionSlug, globalSlug])

  return (
    <LivePreviewContext
      value={{
        appIsReady,
        breakpoint,
        breakpoints,
        iframeRef,
        isLivePreviewEnabled,
        isLivePreviewing,
        isPopupOpen,
        isPreviewEnabled,
        listeningForMessages,
        loadedURL,
        measuredDeviceSize,
        openPopupWindow,
        popupRef,
        previewURL,
        previewWindowType,
        setAppIsReady,
        setBreakpoint,
        setHeight,
        setIsLivePreviewing,
        setLoadedURL,
        setMeasuredDeviceSize,
        setPreviewURL,
        setPreviewWindowType: handleWindowChange,
        setSize,
        setToolbarPosition: setPosition,
        setURL: setLivePreviewURL,
        setWidth,
        setZoom,
        size,
        toolbarPosition: position,
        typeofLivePreviewURL,
        url,
        zoom,
      }}
    >
      <DndContext collisionDetection={customCollisionDetection} onDragEnd={handleDragEnd}>
        {children}
      </DndContext>
    </LivePreviewContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: sizeReducer.ts]---
Location: payload-main/packages/ui/src/providers/LivePreview/sizeReducer.ts

```typescript
// export const sizeReducer: (state, action) => {
//   switch (action.type) {
//     case 'width':
//       return { ...state, width: action.value }
//     case 'height':
//       return { ...state, height: action.value }
//     default:
//       return { ...state, ...(action?.value || {}) }
//   }
// },

type SizeReducerState = {
  height: number
  width: number
}

export type SizeReducerAction =
  | {
      type: 'height' | 'width'
      value: number
    }
  | {
      type: 'reset'
      value: {
        height: number
        width: number
      }
    }

export const sizeReducer = (state: SizeReducerState, action: SizeReducerAction) => {
  switch (action.type) {
    case 'height':
      return { ...state, height: action.value }
    case 'width':
      return { ...state, width: action.value }
    default:
      return { ...state, ...(action?.value || {}) }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Locale/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { Locale } from 'payload'

import { useSearchParams } from 'next/navigation.js'
import React, { createContext, use, useEffect, useRef, useState } from 'react'

import { findLocaleFromCode } from '../../utilities/findLocaleFromCode.js'
import { useAuth } from '../Auth/index.js'
import { useConfig } from '../Config/index.js'

const LocaleContext = createContext({} as Locale)

export const LocaleLoadingContext = createContext({
  localeIsLoading: false,
  setLocaleIsLoading: (_: boolean) => undefined,
})

const fetchPreferences = async <T extends Record<string, unknown> | string>(
  key: string,
  baseURL: string,
): Promise<{ id: string; value: T }> =>
  await fetch(`${baseURL}/payload-preferences/${key}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })?.then((res) => res.json() as Promise<{ id: string; value: T }>)

export const LocaleProvider: React.FC<{ children?: React.ReactNode; locale?: Locale['code'] }> = ({
  children,
  /**
    The `locale` prop originates from the root layout, which does not have access to search params
    This component uses the `useSearchParams` hook to get the locale from the URL as precedence over this prop
    This prop does not update as the user navigates the site, because the root layout does not re-render
  */
  locale: initialLocaleFromPrefs,
}) => {
  const {
    config: {
      localization = false,
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const { user } = useAuth()

  const defaultLocale = localization ? localization.defaultLocale : 'en'

  const localeFromParams = useSearchParams().get('locale')

  const [locale, setLocale] = React.useState<Locale>(() => {
    if (!localization || (localization && !localization.locales.length)) {
      // TODO: return null V4
      return {} as Locale
    }

    return (
      findLocaleFromCode(localization, localeFromParams) ||
      findLocaleFromCode(localization, initialLocaleFromPrefs) ||
      findLocaleFromCode(localization, defaultLocale) ||
      findLocaleFromCode(localization, localization.locales[0].code)
    )
  })

  const [isLoading, setLocaleIsLoading] = useState(false)

  const prevLocale = useRef<Locale>(locale)

  useEffect(() => {
    /**
     * We need to set `isLoading` back to false once the locale is detected to be different
     * This happens when the user clicks an anchor link which appends the `?locale=` query param
     * This triggers a client-side navigation, which re-renders the page with the new locale
     * In Next.js, local state is persisted during this type of navigation because components are not unmounted
     */
    if (locale.code !== prevLocale.current.code) {
      setLocaleIsLoading(false)
    }

    prevLocale.current = locale
  }, [locale])

  const fetchURL = `${serverURL}${apiRoute}`

  useEffect(() => {
    /**
     * This effect should only run when `localeFromParams` changes, i.e. when the user clicks an anchor link
     * The root layout, which sends the initial locale from prefs, will not re-render as the user navigates the site
     * For this reason, we need to fetch the locale from prefs if the search params clears the `locale` query param
     */
    async function resetLocale() {
      if (localization && user?.id) {
        const localeToUse =
          localeFromParams ||
          (await fetchPreferences<Locale['code']>('locale', fetchURL)?.then((res) => res.value))

        const newLocale =
          findLocaleFromCode(localization, localeToUse) ||
          findLocaleFromCode(localization, defaultLocale) ||
          findLocaleFromCode(localization, localization?.locales?.[0]?.code)

        if (newLocale) {
          setLocale(newLocale)
        }
      }
    }

    void resetLocale()
  }, [defaultLocale, localization, fetchURL, localeFromParams, user?.id])

  return (
    <LocaleContext value={locale}>
      <LocaleLoadingContext value={{ localeIsLoading: isLoading, setLocaleIsLoading }}>
        {children}
      </LocaleLoadingContext>
    </LocaleContext>
  )
}

export const useLocaleLoading = () => use(LocaleLoadingContext)

/**
 * TODO: V4
 * The return type of the `useLocale` hook will change in v4. It will return `null | Locale` instead of `false | {} | Locale`.
 */
export const useLocale = (): Locale => use(LocaleContext)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Operation/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext, use } from 'react'

export const OperationContext = createContext('' as Operation)

export const OperationProvider: React.FC<{ children: React.ReactNode; operation: Operation }> = ({
  children,
  operation,
}) => <OperationContext value={operation}>{children}</OperationContext>

export type Operation = 'create' | 'update'

export const useOperation = (): Operation | undefined => use(OperationContext)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Params/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { useParams as useNextParams } from 'next/navigation.js'
import React, { createContext, use } from 'react'

export type Params = ReturnType<typeof useNextParams>
interface IParamsContext extends Params {}

const Context = createContext<IParamsContext>({} as IParamsContext)

/**
 * @deprecated
 * The ParamsProvider is deprecated and will be removed in the next major release. Instead, use the `useParams` hook from `next/navigation` directly. See https://github.com/payloadcms/payload/pull/9581.
 * @example
 * ```tsx
 * import { useParams } from 'next/navigation'
 * ```
 */
export const ParamsProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const params = useNextParams()
  return <Context value={params}>{children}</Context>
}

/**
 * @deprecated
 * The `useParams` hook is deprecated and will be removed in the next major release. Instead, use the `useParams` hook from `next/navigation` directly. See https://github.com/payloadcms/payload/pull/9581.
 * @example
 * ```tsx
 * import { useParams } from 'next/navigation'
 * ```
 */
export const useParams = (): IParamsContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Preferences/index.tsx
Signals: React

```typescript
'use client'
import { dequal } from 'dequal/lite' // lite: no need for Map and Set support
import React, { createContext, use, useCallback, useEffect, useRef } from 'react'

import type { Preferences } from '../../forms/Form/types.js'

import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { deepMergeSimple } from '../../utilities/deepMerge.js'
import { useAuth } from '../Auth/index.js'
import { useConfig } from '../Config/index.js'

type PreferencesContext = {
  getPreference: <T = Preferences>(key: string) => Promise<T>
  /**
   * @param key - a string identifier for the property being set
   * @param value - preference data to store
   * @param merge - when true will combine the existing preference object batch the change into one request for objects, default = false
   */
  setPreference: <T = Preferences>(key: string, value: T, merge?: boolean) => Promise<void>
}

const Context = createContext({} as PreferencesContext)

const requestOptions = (value, language) => ({
  body: JSON.stringify({ value }),
  headers: {
    'Accept-Language': language,
    'Content-Type': 'application/json',
  },
})

export const PreferencesProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const contextRef = useRef({} as PreferencesContext)
  const preferencesRef = useRef({})
  const pendingUpdate = useRef({})
  const { config } = useConfig()
  const { user } = useAuth()
  const { i18n } = useTranslation()

  const {
    routes: { api },
    serverURL,
  } = config

  useEffect(() => {
    if (!user) {
      // clear preferences between users
      preferencesRef.current = {}
    }
  }, [user])

  const getPreference = useCallback(
    async <T = unknown,>(key: string): Promise<T> => {
      const prefs = preferencesRef.current

      if (typeof prefs[key] !== 'undefined') {
        return prefs[key]
      }

      const promise = new Promise((resolve: (value: T) => void) => {
        void (async () => {
          const request = await requests.get(`${serverURL}${api}/payload-preferences/${key}`, {
            credentials: 'include',
            headers: {
              'Accept-Language': i18n.language,
            },
          })

          let value = null

          if (request.status === 200) {
            const preference = await request.json()
            value = preference.value
          }

          preferencesRef.current[key] = value

          resolve(value)
        })()
      })

      prefs[key] = promise

      return promise
    },
    [i18n.language, api, preferencesRef, serverURL],
  )

  const setPreference = useCallback(
    async (key: string, value: unknown, merge = false): Promise<void> => {
      if (merge === false) {
        preferencesRef.current[key] = value

        await requests.post(
          `${serverURL}${api}/payload-preferences/${key}`,
          requestOptions(value, i18n.language),
        )

        return
      }

      let newValue = value
      const currentPreference = await getPreference(key)

      // handle value objects where multiple values can be set under one key
      if (
        typeof value === 'object' &&
        typeof currentPreference === 'object' &&
        typeof newValue === 'object'
      ) {
        // merge the value with any existing preference for the key
        if (currentPreference) {
          newValue = deepMergeSimple(currentPreference, newValue)
        }

        if (dequal(newValue, currentPreference)) {
          return
        }

        // add the requested changes to a pendingUpdate batch for the key
        pendingUpdate.current[key] = {
          ...pendingUpdate.current[key],
          ...(newValue as Record<string, unknown>),
        }
      } else {
        if (newValue === currentPreference) {
          return
        }

        pendingUpdate.current[key] = newValue
      }

      const updatePreference = async () => {
        // compare the value stored in context before sending to eliminate duplicate requests
        if (dequal(pendingUpdate.current[key], preferencesRef.current[key])) {
          return
        }

        // preference set in context here to prevent other updatePreference at the same time
        preferencesRef.current[key] = pendingUpdate.current[key]

        await requests.post(
          `${serverURL}${api}/payload-preferences/${key}`,
          requestOptions(preferencesRef.current[key], i18n.language),
        )

        // reset any changes for this key after sending the request
        delete pendingUpdate.current[key]
      }

      // use timeout to allow multiple changes of different values using the same key in one request
      setTimeout(() => {
        void updatePreference()
      })
    },
    [api, getPreference, i18n.language, pendingUpdate, serverURL],
  )

  contextRef.current.getPreference = getPreference
  contextRef.current.setPreference = setPreference
  return <Context value={contextRef.current}>{children}</Context>
}

export const usePreferences = (): PreferencesContext => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/Root/index.tsx
Signals: React

```typescript
'use client'
import type { I18nClient, I18nOptions, Language } from '@payloadcms/translations'
import type {
  ClientConfig,
  LanguageOptions,
  Locale,
  SanitizedPermissions,
  ServerFunctionClient,
  TypedUser,
} from 'payload'

import { DndContext, pointerWithin } from '@dnd-kit/core'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import React from 'react'

import type { Theme } from '../Theme/index.js'

import { CloseModalOnRouteChange } from '../../elements/CloseModalOnRouteChange/index.js'
import { LoadingOverlayProvider } from '../../elements/LoadingOverlay/index.js'
import { NavProvider } from '../../elements/Nav/context.js'
import { StayLoggedInModal } from '../../elements/StayLoggedIn/index.js'
import { StepNavProvider } from '../../elements/StepNav/index.js'
import { ClickOutsideProvider } from '../../providers/ClickOutside/index.js'
import { WindowInfoProvider } from '../../providers/WindowInfo/index.js'
import { AuthProvider } from '../Auth/index.js'
import { ClientFunctionProvider } from '../ClientFunction/index.js'
import { ConfigProvider } from '../Config/index.js'
import { DocumentEventsProvider } from '../DocumentEvents/index.js'
import { LocaleProvider } from '../Locale/index.js'
import { ParamsProvider } from '../Params/index.js'
import { PreferencesProvider } from '../Preferences/index.js'
import { RouteCache } from '../RouteCache/index.js'
import { RouteTransitionProvider } from '../RouteTransition/index.js'
import { SearchParamsProvider } from '../SearchParams/index.js'
import { ServerFunctionsProvider } from '../ServerFunctions/index.js'
import { ThemeProvider } from '../Theme/index.js'
import { ToastContainer } from '../ToastContainer/index.js'
import { TranslationProvider } from '../Translation/index.js'
import { UploadHandlersProvider } from '../UploadHandlers/index.js'

type Props = {
  readonly children: React.ReactNode
  readonly config: ClientConfig
  readonly dateFNSKey: Language['dateFNSKey']
  readonly fallbackLang: I18nOptions['fallbackLanguage']
  readonly isNavOpen?: boolean
  readonly languageCode: string
  readonly languageOptions: LanguageOptions
  readonly locale?: Locale['code']
  readonly permissions: SanitizedPermissions
  readonly serverFunction: ServerFunctionClient
  readonly switchLanguageServerAction?: (lang: string) => Promise<void>
  readonly theme: Theme
  readonly translations: I18nClient['translations']
  readonly user: null | TypedUser
}

export const RootProvider: React.FC<Props> = ({
  children,
  config,
  dateFNSKey,
  fallbackLang,
  isNavOpen,
  languageCode,
  languageOptions,
  locale,
  permissions,
  serverFunction,
  switchLanguageServerAction,
  theme,
  translations,
  user,
}) => {
  const dndContextID = React.useId()

  return (
    <ClickOutsideProvider>
      <ServerFunctionsProvider serverFunction={serverFunction}>
        <RouteTransitionProvider>
          <RouteCache
            cachingEnabled={process.env.NEXT_PUBLIC_ENABLE_ROUTER_CACHE_REFRESH === 'true'}
          >
            <ConfigProvider config={config}>
              <ClientFunctionProvider>
                <TranslationProvider
                  dateFNSKey={dateFNSKey}
                  fallbackLang={fallbackLang}
                  language={languageCode}
                  languageOptions={languageOptions}
                  switchLanguageServerAction={switchLanguageServerAction}
                  translations={translations}
                >
                  <WindowInfoProvider
                    breakpoints={{
                      l: '(max-width: 1440px)',
                      m: '(max-width: 1024px)',
                      s: '(max-width: 768px)',
                      xs: '(max-width: 400px)',
                    }}
                  >
                    <ScrollInfoProvider>
                      <SearchParamsProvider>
                        <ModalProvider classPrefix="payload" transTime={0} zIndex="var(--z-modal)">
                          <CloseModalOnRouteChange />
                          <AuthProvider permissions={permissions} user={user}>
                            <PreferencesProvider>
                              <ThemeProvider theme={theme}>
                                <ParamsProvider>
                                  <LocaleProvider locale={locale}>
                                    <StepNavProvider>
                                      <LoadingOverlayProvider>
                                        <DocumentEventsProvider>
                                          <NavProvider initialIsOpen={isNavOpen}>
                                            <UploadHandlersProvider>
                                              <DndContext
                                                collisionDetection={pointerWithin}
                                                id={dndContextID}
                                              >
                                                {children}
                                              </DndContext>
                                            </UploadHandlersProvider>
                                          </NavProvider>
                                        </DocumentEventsProvider>
                                      </LoadingOverlayProvider>
                                    </StepNavProvider>
                                  </LocaleProvider>
                                </ParamsProvider>
                              </ThemeProvider>
                            </PreferencesProvider>
                            <ModalContainer />
                            <StayLoggedInModal />
                          </AuthProvider>
                        </ModalProvider>
                      </SearchParamsProvider>
                    </ScrollInfoProvider>
                  </WindowInfoProvider>
                </TranslationProvider>
              </ClientFunctionProvider>
            </ConfigProvider>
          </RouteCache>
        </RouteTransitionProvider>
      </ServerFunctionsProvider>
      <ToastContainer config={config} />
    </ClickOutsideProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/providers/RouteCache/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { usePathname, useRouter } from 'next/navigation.js'
import React, { createContext, use, useCallback, useEffect, useRef } from 'react'

import { useEffectEvent } from '../../hooks/useEffectEvent.js'

export type RouteCacheContext = {
  cachingEnabled: boolean
  clearRouteCache: () => void
}

const Context = createContext<RouteCacheContext>({
  cachingEnabled: true,
  clearRouteCache: () => {},
})

export const RouteCache: React.FC<{ cachingEnabled?: boolean; children: React.ReactNode }> = ({
  cachingEnabled = true,
  children,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Next.js caches pages in memory in their {@link https://nextjs.org/docs/app/guides/caching#client-side-router-cache Client-side Router Cache},
   * causing forward/back browser navigation to show stale data from a previous visit.
   * The problem is this bfcache-like behavior has no opt-out, even if the page is dynamic, requires authentication, etc.
   * The workaround is to force a refresh when navigating via the browser controls.
   * This should be removed if/when Next.js supports this natively.
   */
  const clearAfterPathnameChange = useRef(false)

  const clearRouteCache = useCallback(() => {
    router.refresh()
  }, [router])

  useEffect(() => {
    const handlePopState = () => {
      clearAfterPathnameChange.current = true
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  const handlePathnameChange = useEffectEvent((pathname: string) => {
    if (cachingEnabled || clearAfterPathnameChange.current) {
      clearAfterPathnameChange.current = false
      clearRouteCache()
    }
  })

  useEffect(() => {
    handlePathnameChange(pathname)
  }, [pathname])

  return <Context value={{ cachingEnabled, clearRouteCache }}>{children}</Context>
}

export const useRouteCache = () => use(Context)
```

--------------------------------------------------------------------------------

````
