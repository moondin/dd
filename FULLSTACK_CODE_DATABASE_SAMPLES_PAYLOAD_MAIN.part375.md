---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 375
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 375 of 695)

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
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/Controls/index.tsx
Signals: React

```typescript
'use client'

import type { EditViewProps } from 'payload'

import React from 'react'

import { ChevronIcon } from '../../../../icons/Chevron/index.js'
import { ExternalLinkIcon } from '../../../../icons/ExternalLink/index.js'
import { XIcon } from '../../../../icons/X/index.js'
import { useLivePreviewContext } from '../../../../providers/LivePreview/context.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { Popup, PopupList } from '../../../Popup/index.js'
import { PreviewFrameSizeInput } from '../SizeInput/index.js'
import './index.scss'

const baseClass = 'live-preview-toolbar-controls'
const zoomOptions = [50, 75, 100, 125, 150, 200]

export const ToolbarControls: React.FC<EditViewProps> = () => {
  const { breakpoint, breakpoints, setBreakpoint, setPreviewWindowType, setZoom, url, zoom } =
    useLivePreviewContext()

  const { t } = useTranslation()

  const customOption = {
    label: t('general:custom'),
    value: 'custom',
  }

  return (
    <div className={baseClass}>
      {breakpoints?.length > 0 && (
        <Popup
          button={
            <React.Fragment>
              <span>
                {breakpoints.find((bp) => bp.name == breakpoint)?.label ?? customOption.label}
              </span>
              <ChevronIcon className={`${baseClass}__chevron`} />
            </React.Fragment>
          }
          className={`${baseClass}__breakpoint`}
          horizontalAlign="right"
          render={({ close }) => (
            <PopupList.ButtonGroup>
              <React.Fragment>
                {breakpoints.map((bp) => (
                  <PopupList.Button
                    active={bp.name == breakpoint}
                    key={bp.name}
                    onClick={() => {
                      setBreakpoint(bp.name)
                      close()
                    }}
                  >
                    {bp.label}
                  </PopupList.Button>
                ))}
                {/* Dynamically add this option so that it only appears when the width and height inputs are explicitly changed */}
                {breakpoint === 'custom' && (
                  <PopupList.Button
                    active={breakpoint == customOption.value}
                    onClick={() => {
                      setBreakpoint(customOption.value)
                      close()
                    }}
                  >
                    {customOption.label}
                  </PopupList.Button>
                )}
              </React.Fragment>
            </PopupList.ButtonGroup>
          )}
          showScrollbar
          verticalAlign="bottom"
        />
      )}
      <div className={`${baseClass}__device-size`}>
        <PreviewFrameSizeInput axis="x" />
        <span className={`${baseClass}__size-divider`}>
          <XIcon />
        </span>
        <PreviewFrameSizeInput axis="y" />
      </div>
      <Popup
        button={
          <React.Fragment>
            <span>{zoom * 100}%</span>
            <ChevronIcon className={`${baseClass}__chevron`} />
          </React.Fragment>
        }
        className={`${baseClass}__zoom`}
        horizontalAlign="right"
        render={({ close }) => (
          <PopupList.ButtonGroup>
            <React.Fragment>
              {zoomOptions.map((zoomValue) => (
                <PopupList.Button
                  active={zoom * 100 == zoomValue}
                  key={zoomValue}
                  onClick={() => {
                    setZoom(zoomValue / 100)
                    close()
                  }}
                >
                  {zoomValue}%
                </PopupList.Button>
              ))}
            </React.Fragment>
          </PopupList.ButtonGroup>
        )}
        showScrollbar
        verticalAlign="bottom"
      />
      <a
        className={`${baseClass}__external`}
        href={url}
        onClick={(e) => {
          e.preventDefault()
          setPreviewWindowType('popup')
        }}
        target="_blank"
        title="Open in new window"
        type="button"
      >
        <ExternalLinkIcon />
      </a>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/SizeInput/index.scss

```text
@layer payload-default {
  .toolbar-input {
    width: 50px;
    height: var(--base);
    display: flex;
    align-items: center;
    border: 1px solid var(--theme-elevation-200);
    background: var(--theme-elevation-100);
    border-radius: 2px;
    font-size: small;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/Toolbar/SizeInput/index.tsx
Signals: React

```typescript
'use client'
import React, { useCallback, useEffect } from 'react'

import { useLivePreviewContext } from '../../../../providers/LivePreview/context.js'
import './index.scss'

const baseClass = 'toolbar-input'

export const PreviewFrameSizeInput: React.FC<{
  axis?: 'x' | 'y'
}> = (props) => {
  const { axis } = props

  const { breakpoint, measuredDeviceSize, setBreakpoint, setSize, size, zoom } =
    useLivePreviewContext()

  const [internalState, setInternalState] = React.useState<number>(
    (axis === 'x' ? measuredDeviceSize?.width : measuredDeviceSize?.height) || 0,
  )

  // when the input is changed manually, we need to set the breakpoint as `custom`
  // this will then allow us to set an explicit width and height
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = Number(e.target.value)

      if (newValue < 0) {
        newValue = 0
      }

      setInternalState(newValue)
      setBreakpoint('custom')

      // be sure to set _both_ axis values to so that the other axis doesn't fallback to 0 on initial change
      // this is because the `responsive` size is '100%' in CSS, and `0` in initial state
      setSize({
        type: 'reset',
        value: {
          height: axis === 'y' ? newValue : Number(measuredDeviceSize?.height.toFixed(0)) * zoom,
          width: axis === 'x' ? newValue : Number(measuredDeviceSize?.width.toFixed(0)) * zoom,
        },
      })
    },
    [axis, setBreakpoint, measuredDeviceSize, setSize, zoom],
  )

  // if the breakpoint is `responsive` then the device's div will have `100%` width and height
  // so we need to take the measurements provided by `actualDeviceSize` and sync internal state
  useEffect(() => {
    if (breakpoint === 'responsive' && measuredDeviceSize) {
      if (axis === 'x') {
        setInternalState(Number(measuredDeviceSize.width.toFixed(0)) * zoom)
      } else {
        setInternalState(Number(measuredDeviceSize.height.toFixed(0)) * zoom)
      }
    }

    if (breakpoint !== 'responsive' && size) {
      setInternalState(axis === 'x' ? size.width : size.height)
    }
  }, [breakpoint, axis, measuredDeviceSize, size, zoom])

  return (
    <input
      className={baseClass}
      min={0}
      name={axis === 'x' ? 'live-preview-width' : 'live-preview-height'}
      onChange={handleChange}
      step={1}
      type="number"
      value={internalState || 0}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/ToolbarArea/index.scss

```text
@layer payload-default {
  .toolbar-area {
    width: 100%;
    height: 100%;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/ToolbarArea/index.tsx
Signals: React

```typescript
'use client'
import { useDroppable } from '@dnd-kit/core'
import React from 'react'

import './index.scss'

const baseClass = 'toolbar-area'

export const ToolbarArea: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props

  const { setNodeRef } = useDroppable({
    id: 'live-preview-area',
  })

  return (
    <div className={baseClass} ref={setNodeRef}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/LivePreview/Window/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .live-preview-window {
    background-color: var(--theme-bg);
    display: none;
    width: 60%;
    flex-shrink: 0;
    flex-grow: 0;
    position: sticky;
    top: var(--doc-controls-height);
    height: calc(100vh - var(--doc-controls-height));
    overflow: hidden;

    &--is-live-previewing {
      display: block;
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: flex-start;
    }

    &__main {
      flex-grow: 1;
      height: 100%;
      width: 100%;
    }

    &--has-breakpoint {
      .live-preview-iframe {
        border: 1px solid var(--theme-elevation-100);
      }

      .live-preview-window {
        &__main {
          padding: var(--base);
        }
      }
    }

    @include mid-break {
      width: 100%;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LivePreview/Window/index.tsx
Signals: React

```typescript
'use client'

import type { EditViewProps } from 'payload'

import { reduceFieldsToValues } from 'payload/shared'
import React, { useEffect } from 'react'

import { useAllFormFields } from '../../../forms/Form/context.js'
import { useDocumentEvents } from '../../../providers/DocumentEvents/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useLivePreviewContext } from '../../../providers/LivePreview/context.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { ShimmerEffect } from '../../ShimmerEffect/index.js'
import { DeviceContainer } from '../Device/index.js'
import { IFrame } from '../IFrame/index.js'
import { LivePreviewToolbar } from '../Toolbar/index.js'
import './index.scss'

const baseClass = 'live-preview-window'

export const LivePreviewWindow: React.FC<EditViewProps> = (props) => {
  const {
    appIsReady,
    breakpoint,
    iframeRef,
    isLivePreviewing,
    loadedURL,
    popupRef,
    previewWindowType,
    url,
  } = useLivePreviewContext()

  const locale = useLocale()

  const { mostRecentUpdate } = useDocumentEvents()

  const [formState] = useAllFormFields()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()

  /**
   * For client-side apps, send data through `window.postMessage`
   * The preview could either be an iframe embedded on the page
   * Or it could be a separate popup window
   * We need to transmit data to both accordingly
   */
  useEffect(() => {
    if (!isLivePreviewing || !appIsReady) {
      return
    }

    // For performance, do not reduce fields to values until after the iframe or popup has loaded
    if (formState) {
      const values = reduceFieldsToValues(formState, true)

      if (!values.id) {
        values.id = id
      }

      const message = {
        type: 'payload-live-preview',
        collectionSlug,
        data: values,
        externallyUpdatedRelationship: mostRecentUpdate,
        globalSlug,
        locale: locale.code,
      }

      // Post message to external popup window
      if (previewWindowType === 'popup' && popupRef.current) {
        popupRef.current.postMessage(message, url)
      }

      // Post message to embedded iframe
      if (previewWindowType === 'iframe' && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(message, url)
      }
    }
  }, [
    formState,
    url,
    collectionSlug,
    globalSlug,
    id,
    previewWindowType,
    popupRef,
    appIsReady,
    iframeRef,
    mostRecentUpdate,
    locale,
    isLivePreviewing,
    loadedURL,
  ])

  /**
   * To support SSR, we transmit a `window.postMessage` event without a payload
   * This is because the event will ultimately trigger a server-side roundtrip
   * i.e., save, save draft, autosave, etc. will fire `router.refresh()`
   */
  useEffect(() => {
    if (!isLivePreviewing || !appIsReady) {
      return
    }

    const message = {
      type: 'payload-document-event',
    }

    // Post message to external popup window
    if (previewWindowType === 'popup' && popupRef.current) {
      popupRef.current.postMessage(message, url)
    }

    // Post message to embedded iframe
    if (previewWindowType === 'iframe' && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(message, url)
    }
  }, [mostRecentUpdate, iframeRef, popupRef, previewWindowType, url, isLivePreviewing, appIsReady])

  if (previewWindowType !== 'iframe') {
    return null
  }

  return (
    <div
      className={[
        baseClass,
        isLivePreviewing && `${baseClass}--is-live-previewing`,
        breakpoint && breakpoint !== 'responsive' && `${baseClass}--has-breakpoint`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__wrapper`}>
        <LivePreviewToolbar {...props} />
        <div className={`${baseClass}__main`}>
          <DeviceContainer>{url ? <IFrame /> : <ShimmerEffect height="100%" />}</DeviceContainer>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Loading/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .loading-overlay {
    isolation: isolate;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;
    z-index: calc(var(--z-status) + 1);
    transition-property: left, width;
    transition: 250ms ease;

    &.loading-overlay--entering {
      opacity: 1;
      animation: fade-in ease;
      pointer-events: all;
    }

    &.loading-overlay--exiting {
      opacity: 0;
      animation: fade-out ease;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--theme-elevation-0);
      opacity: 0.85;
      z-index: -1;
    }

    &__bars {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      gap: 7px;
      align-items: center;
    }

    &__bar {
      width: 2px;
      background-color: currentColor;
      height: 15px;

      &:nth-child(1) {
        transform: translateY(0);
        animation: animate-bar--odd 1.25s infinite;
      }

      &:nth-child(2) {
        transform: translateY(-2px);
        animation: animate-bar--even 1.25s infinite;
      }

      &:nth-child(3) {
        transform: translateY(0);
        animation: animate-bar--odd 1.25s infinite;
      }

      &:nth-child(4) {
        transform: translateY(-2px);
        animation: animate-bar--even 1.25s infinite;
      }

      &:nth-child(5) {
        transform: translateY(0);
        animation: animate-bar--odd 1.25s infinite;
      }
    }

    &__text {
      margin-top: base(0.75);
      text-transform: uppercase;
      font-family: var(--font-body);
      font-size: base(0.65);
      letter-spacing: 3px;
    }
  }

  @keyframes animate-bar--even {
    0% {
      transform: translateY(2px);
    }

    50% {
      transform: translateY(-2px);
    }

    100% {
      transform: translateY(2px);
    }
  }

  @keyframes animate-bar--odd {
    0% {
      transform: translateY(-2px);
    }

    50% {
      transform: translateY(2px);
    }

    100% {
      transform: translateY(-2px);
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Loading/index.tsx
Signals: React

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import type { LoadingOverlayTypes } from '../../elements/LoadingOverlay/types.js'

import { useLoadingOverlay } from '../../elements/LoadingOverlay/index.js'
import { useFormProcessing } from '../../forms/Form/context.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'loading-overlay'

type LoadingOverlayProps = {
  animationDuration?: string
  loadingText?: string
  overlayType?: string
  show?: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  animationDuration,
  loadingText,
  overlayType,
  show = true,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={[
        baseClass,
        show ? `${baseClass}--entering` : `${baseClass}--exiting`,
        overlayType ? `${baseClass}--${overlayType}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        animationDuration: animationDuration || '500ms',
      }}
    >
      <div className={`${baseClass}__bars`}>
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
      </div>

      <span className={`${baseClass}__text`}>{loadingText || t('general:loading')}</span>
    </div>
  )
}

export type UseLoadingOverlayToggleProps = {
  loadingText?: string
  name: string
  show: boolean
  type?: LoadingOverlayTypes
}
export const LoadingOverlayToggle: React.FC<UseLoadingOverlayToggleProps> = ({
  name: key,
  type = 'fullscreen',
  loadingText,
  show,
}) => {
  const { toggleLoadingOverlay } = useLoadingOverlay()

  React.useEffect(() => {
    toggleLoadingOverlay({
      type,
      isLoading: show,
      key,
      loadingText: loadingText || undefined,
    })

    return () => {
      toggleLoadingOverlay({
        type,
        isLoading: false,
        key,
      })
    }
  }, [show, toggleLoadingOverlay, key, type, loadingText])

  return null
}

export type FormLoadingOverlayToggleProps = {
  action: 'create' | 'loading' | 'update'
  formIsLoading?: boolean
  loadingSuffix?: string
  name: string
  type?: LoadingOverlayTypes
}

export const FormLoadingOverlayToggle: React.FC<FormLoadingOverlayToggleProps> = ({
  name,
  type = 'fullscreen',
  action,
  formIsLoading = false,
  loadingSuffix,
}) => {
  const isProcessing = useFormProcessing()
  const { i18n, t } = useTranslation()

  const labels = {
    create: t('general:creating'),
    loading: t('general:loading'),
    update: t('general:updating'),
  }

  return (
    <LoadingOverlayToggle
      loadingText={`${labels[action]} ${
        loadingSuffix ? getTranslation(loadingSuffix, i18n) : ''
      }`.trim()}
      name={name}
      show={formIsLoading || isProcessing}
      type={type}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LoadingOverlay/index.tsx
Signals: React

```typescript
'use client'
import React, { createContext } from 'react'

import type { LoadingOverlayContext, ToggleLoadingOverlay } from './types.js'

import { LoadingOverlay } from '../../elements/Loading/index.js'
import { useDelayedRender } from '../../hooks/useDelayedRender.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { defaultLoadingOverlayState, reducer } from './reducer.js'

const animatedDuration = 250

const Context = createContext({
  isOnScreen: false,
  toggleLoadingOverlay: undefined,
})

export const LoadingOverlayProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation()
  const fallbackText = t('general:loading')
  const [overlays, dispatchOverlay] = React.useReducer(reducer, defaultLoadingOverlayState)

  const { isMounted, isUnmounting, triggerDelayedRender } = useDelayedRender({
    delayBeforeShow: 1000,
    inTimeout: animatedDuration,
    minShowTime: 500,
    outTimeout: animatedDuration,
    show: overlays.isLoading,
  })

  const toggleLoadingOverlay = React.useCallback<ToggleLoadingOverlay>(
    ({ type, isLoading, key, loadingText = fallbackText }) => {
      if (isLoading) {
        triggerDelayedRender()
        dispatchOverlay({
          type: 'add',
          payload: {
            type,
            key,
            loadingText,
          },
        })
      } else {
        dispatchOverlay({
          type: 'remove',
          payload: {
            type,
            key,
          },
        })
      }
    },
    [triggerDelayedRender, fallbackText],
  )

  return (
    <Context
      value={{
        isOnScreen: isMounted,
        toggleLoadingOverlay,
      }}
    >
      {isMounted && (
        <LoadingOverlay
          animationDuration={`${animatedDuration}ms`}
          loadingText={overlays.loadingText || fallbackText}
          overlayType={overlays.overlayType}
          show={!isUnmounting}
        />
      )}
      {children}
    </Context>
  )
}

export const useLoadingOverlay = (): LoadingOverlayContext => {
  const contextHook = React.use(Context)
  if (contextHook === undefined) {
    throw new Error('useLoadingOverlay must be used within a LoadingOverlayProvider')
  }

  return contextHook
}
```

--------------------------------------------------------------------------------

---[FILE: reducer.ts]---
Location: payload-main/packages/ui/src/elements/LoadingOverlay/reducer.ts

```typescript
'use client'
import type { Action, State } from './types.js'

export const defaultLoadingOverlayState = {
  isLoading: false,
  loaders: [],
  loadingText: '',
  overlayType: null,
}

export const reducer = (state: State, action: Action): State => {
  const loadersCopy = [...state.loaders]
  const { type = 'fullscreen', key = 'user', loadingText } = action.payload

  if (action.type === 'add') {
    loadersCopy.push({ type, key, loadingText })
  } else if (action.type === 'remove') {
    const index = loadersCopy.findIndex((item) => item.key === key && item.type === type)
    loadersCopy.splice(index, 1)
  }

  const nextLoader = loadersCopy?.length > 0 ? loadersCopy[loadersCopy.length - 1] : null

  return {
    isLoading: Boolean(nextLoader),
    loaders: loadersCopy,
    loadingText: nextLoader?.loadingText || state?.loadingText,
    overlayType: nextLoader?.type || state?.overlayType,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/LoadingOverlay/types.ts

```typescript
export type LoadingOverlayTypes = 'fullscreen' | 'withoutNav'

type ToggleLoadingOverlayOptions = {
  isLoading?: boolean
  key: string
  loadingText?: string
  type?: LoadingOverlayTypes
}
export type ToggleLoadingOverlay = (options: ToggleLoadingOverlayOptions) => void

type Add = {
  payload: {
    key: string
    loadingText?: string
    type: LoadingOverlayTypes
  }
  type: 'add'
}
type Remove = {
  payload: {
    key: string
    loadingText?: never
    type: LoadingOverlayTypes
  }
  type: 'remove'
}
export type Action = Add | Remove
export type State = {
  isLoading: boolean
  loaders: {
    key: string
    loadingText: string
    type: LoadingOverlayTypes
  }[]
  loadingText: string
  overlayType: LoadingOverlayTypes | null
}

export type LoadingOverlayContext = {
  isOnScreen: boolean
  toggleLoadingOverlay: ToggleLoadingOverlay
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Localizer/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .localizer {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Localizer/index.tsx
Signals: React, Next.js

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import { useRouter } from 'next/navigation.js'
import * as qs from 'qs-esm'
import React, { Fragment } from 'react'

import { useConfig } from '../../providers/Config/index.js'
import { useLocale, useLocaleLoading } from '../../providers/Locale/index.js'
import { useRouteTransition } from '../../providers/RouteTransition/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Popup, PopupList } from '../Popup/index.js'
import './index.scss'
import { LocalizerLabel } from './LocalizerLabel/index.js'

const baseClass = 'localizer'

export const Localizer: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  const {
    config: { localization },
  } = useConfig()

  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  const { setLocaleIsLoading } = useLocaleLoading()

  const { i18n } = useTranslation()
  const locale = useLocale()

  if (localization) {
    const { locales } = localization

    return (
      <div className={[baseClass, className].filter(Boolean).join(' ')}>
        <Popup
          button={<LocalizerLabel />}
          horizontalAlign="right"
          render={({ close }) => (
            <PopupList.ButtonGroup>
              {locales.map((localeOption) => {
                const localeOptionLabel = getTranslation(localeOption.label, i18n)

                return (
                  <PopupList.Button
                    active={locale.code === localeOption.code}
                    disabled={locale.code === localeOption.code}
                    key={localeOption.code}
                    onClick={() => {
                      setLocaleIsLoading(true)
                      close()

                      // can't use `useSearchParams` here because it is stale due to `window.history.pushState` in `ListQueryProvider`
                      const searchParams = new URLSearchParams(window.location.search)

                      const url = qs.stringify(
                        {
                          ...qs.parse(searchParams.toString(), {
                            depth: 10,
                            ignoreQueryPrefix: true,
                          }),
                          locale: localeOption.code,
                        },
                        { addQueryPrefix: true },
                      )

                      startRouteTransition(() => {
                        router.push(url)
                      })
                    }}
                  >
                    {localeOptionLabel !== localeOption.code ? (
                      <Fragment>
                        {localeOptionLabel}
                        &nbsp;
                        <span
                          className={`${baseClass}__locale-code`}
                          data-locale={localeOption.code}
                        >
                          {`(${localeOption.code})`}
                        </span>
                      </Fragment>
                    ) : (
                      <span className={`${baseClass}__locale-code`} data-locale={localeOption.code}>
                        {localeOptionLabel}
                      </span>
                    )}
                  </PopupList.Button>
                )
              })}
            </PopupList.ButtonGroup>
          )}
          showScrollbar
          size="large"
        />
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Localizer/LocalizerLabel/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .localizer-button {
    display: flex;
    align-items: center;
    white-space: nowrap;
    display: flex;
    padding-inline-start: base(0.4);
    padding-inline-end: base(0.2);
    background-color: var(--theme-elevation-100);
    border-radius: var(--style-radius-s);

    &__label {
      color: var(--theme-elevation-500);
    }

    &__chevron {
      .stroke {
        stroke: currentColor;
      }
    }

    &__current {
      display: flex;
      align-items: center;
    }

    button {
      color: currentColor;
      padding: 0;
      font-size: 1rem;
      line-height: base(1);
      background: transparent;
      border: 0;
      font-weight: 600;
      cursor: pointer;

      &:hover,
      &:focus-visible {
        text-decoration: underline;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }

    @include small-break {
      &__label {
        display: none;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Localizer/LocalizerLabel/index.tsx
Signals: React

```typescript
'use client'
import { getTranslation } from '@payloadcms/translations'
import React from 'react'

import { ChevronIcon } from '../../../icons/Chevron/index.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'localizer-button'

export const LocalizerLabel: React.FC<{
  ariaLabel?: string
  className?: string
}> = (props) => {
  const { ariaLabel, className } = props
  const locale = useLocale()
  const { i18n, t } = useTranslation()

  return (
    <div
      aria-label={ariaLabel || t('general:locale')}
      className={[baseClass, className].filter(Boolean).join(' ')}
      data-locale={locale ? locale.code : undefined}
    >
      <div className={`${baseClass}__label`}>{`${t('general:locale')}:`}&nbsp;</div>
      <div className={`${baseClass}__current`}>
        <span className={`${baseClass}__current-label`}>
          {`${getTranslation(locale.label, i18n)}`}
        </span>
        <ChevronIcon className={`${baseClass}__chevron`} />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Locked/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .locked {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;

    &__tooltip {
      left: 0;
      transform: translate3d(-0%, calc(var(--caret-size) * -1), 0);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Locked/index.tsx
Signals: React

```typescript
'use client'
import type { ClientUser } from 'payload'

import React, { useState } from 'react'

import { LockIcon } from '../../icons/Lock/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { isClientUserObject } from '../../utilities/isClientUserObject.js'
import { Tooltip } from '../Tooltip/index.js'
import './index.scss'

const baseClass = 'locked'

export const Locked: React.FC<{
  className?: string
  user: ClientUser
}> = ({ className, user }) => {
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()

  const userToUse = isClientUserObject(user) ? (user.email ?? user.id) : t('general:anotherUser')

  return (
    <div
      className={[baseClass, className].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
    >
      <Tooltip
        alignCaret="left"
        className={`${baseClass}__tooltip`}
        position="top"
        show={hovered}
      >{`${userToUse} ${t('general:isEditing')}`}</Tooltip>
      <LockIcon />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Logout/index.tsx
Signals: React

```typescript
'use client'
import { formatAdminURL } from 'payload/shared'
import React from 'react'

import { LogOutIcon } from '../../icons/LogOut/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Link } from '../Link/index.js'

const baseClass = 'nav'

export const Logout: React.FC<{
  /**
   * @deprecated
   * This prop is deprecated and will be removed in the next major version.
   * Components now import their own `Link` directly from `next/link`.
   */
  Link?: React.ComponentType
  tabIndex?: number
}> = ({ tabIndex = 0 }) => {
  const { t } = useTranslation()
  const { config } = useConfig()

  const {
    admin: {
      routes: { logout: logoutRoute },
    },
    routes: { admin: adminRoute },
    serverURL,
  } = config

  return (
    <Link
      aria-label={t('authentication:logOut')}
      className={`${baseClass}__log-out`}
      href={formatAdminURL({
        adminRoute,
        path: logoutRoute,
        serverURL,
      })}
      prefetch={false}
      tabIndex={tabIndex}
      title={t('authentication:logOut')}
    >
      <LogOutIcon />
    </Link>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Modal/index.tsx

```typescript
'use client'
import { Modal, useModal } from '@faceless-ui/modal'
export { Modal, useModal }
```

--------------------------------------------------------------------------------

---[FILE: context.tsx]---
Location: payload-main/packages/ui/src/elements/Nav/context.tsx
Signals: React, Next.js

```typescript
'use client'
import { useWindowInfo } from '@faceless-ui/window-info'
import { usePathname } from 'next/navigation.js'
import React, { useEffect, useRef } from 'react'

import { usePreferences } from '../../providers/Preferences/index.js'

type NavContextType = {
  hydrated: boolean
  navOpen: boolean
  navRef: React.RefObject<HTMLDivElement | null>
  setNavOpen: (value: boolean) => void
  shouldAnimate: boolean
}

/**
 * @internal
 */
export const NavContext = React.createContext<NavContextType>({
  hydrated: false,
  navOpen: true,
  navRef: null,
  setNavOpen: () => {},
  shouldAnimate: false,
})

export const useNav = () => React.use(NavContext)

const getNavPreference = async (getPreference): Promise<boolean> => {
  const navPrefs = await getPreference('nav')
  const preferredState = navPrefs?.open
  if (typeof preferredState === 'boolean') {
    return preferredState
  } else {
    return true
  }
}

/**
 * @internal
 */
export const NavProvider: React.FC<{
  children: React.ReactNode
  initialIsOpen?: boolean
}> = ({ children, initialIsOpen }) => {
  const {
    breakpoints: { l: largeBreak, m: midBreak, s: smallBreak },
  } = useWindowInfo()

  const pathname = usePathname()

  const { getPreference } = usePreferences()
  const navRef = useRef(null)

  // initialize the nav to be closed
  // this is because getting the preference is async
  // so instead of closing it after the preference is loaded
  // we will open it after the preference is loaded
  const [navOpen, setNavOpen] = React.useState(initialIsOpen)

  const [shouldAnimate, setShouldAnimate] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)

  // on load check the user's preference and set "initial" state
  useEffect(() => {
    if (largeBreak === false) {
      const setNavFromPreferences = async () => {
        const preferredState = await getNavPreference(getPreference)
        setNavOpen(preferredState)
      }

      void setNavFromPreferences()
    }
  }, [largeBreak, getPreference, setNavOpen])

  // on smaller screens where the nav is a modal
  // close the nav when the user navigates away
  useEffect(() => {
    if (smallBreak === true) {
      setNavOpen(false)
    }
  }, [pathname])

  // on open and close, lock the body scroll
  // do not do this on desktop, the sidebar is not a modal
  useEffect(() => {
    if (navRef.current) {
      if (navOpen && midBreak) {
        navRef.current.style.overscrollBehavior = 'contain'
      } else {
        navRef.current.style.overscrollBehavior = 'auto'
      }
    }
  }, [navOpen, midBreak])

  // on smaller screens where the nav is a modal
  // close the nav when the user resizes down to mobile
  // the sidebar is a modal on mobile
  useEffect(() => {
    if (largeBreak === true || midBreak === true || smallBreak === true) {
      setNavOpen(false)
    }
    setHydrated(true)

    const timeout = setTimeout(() => {
      setShouldAnimate(true)
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [largeBreak, midBreak, smallBreak])

  // when the component unmounts, clear all body scroll locks
  useEffect(() => {
    return () => {
      if (navRef.current) {
        navRef.current.style.overscrollBehavior = 'auto'
      }
    }
  }, [])

  return (
    <NavContext value={{ hydrated, navOpen, navRef, setNavOpen, shouldAnimate }}>
      {children}
    </NavContext>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Nav/NavToggler/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .nav-toggler {
    position: relative;
    background: transparent;
    padding: 0;
    margin: 0;
    border: 0;
    cursor: pointer;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Nav/NavToggler/index.tsx
Signals: React

```typescript
'use client'
import { useWindowInfo } from '@faceless-ui/window-info'
import React from 'react'

import { usePreferences } from '../../../providers/Preferences/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { useNav } from '../context.js'
import './index.scss'

const baseClass = 'nav-toggler'

export const NavToggler: React.FC<{
  children?: React.ReactNode
  className?: string
  id?: string
  tabIndex?: number
}> = (props) => {
  const { id, children, className, tabIndex = 0 } = props

  const { t } = useTranslation()

  const { setPreference } = usePreferences()

  const { navOpen, setNavOpen } = useNav()

  const {
    breakpoints: { l: largeBreak },
  } = useWindowInfo()

  return (
    <button
      aria-label={`${navOpen ? t('general:close') : t('general:open')} ${t('general:menu')}`}
      className={[baseClass, navOpen && `${baseClass}--is-open`, className]
        .filter(Boolean)
        .join(' ')}
      id={id}
      onClick={async () => {
        setNavOpen(!navOpen)

        // only when the user explicitly toggles the nav on desktop do we want to set the preference
        // this is because the js may open or close the nav based on the window size, routing, etc
        if (!largeBreak) {
          await setPreference(
            'nav',
            {
              open: !navOpen,
            },
            true,
          )
        }
      }}
      tabIndex={tabIndex}
      type="button"
    >
      {children}
    </button>
  )
}
```

--------------------------------------------------------------------------------

````
