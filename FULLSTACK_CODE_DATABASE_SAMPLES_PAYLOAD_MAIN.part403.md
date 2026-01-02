---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 403
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 403 of 695)

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

---[FILE: usePopupWindow.ts]---
Location: payload-main/packages/ui/src/hooks/usePopupWindow.ts
Signals: React

```typescript
'use client'
import type React from 'react'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useConfig } from '../providers/Config/index.js'

export interface PopupMessage {
  searchParams: {
    [key: string]: string | undefined
    code: string
    installation_id: string
    state: string
  }
  type: string
}

export const usePopupWindow = (props: {
  eventType?: string

  onMessage?: (searchParams: PopupMessage['searchParams']) => Promise<void>
  url: string
}): {
  isPopupOpen: boolean
  openPopupWindow: () => void
  popupRef?: React.RefObject<null | Window>
} => {
  const { eventType, onMessage, url } = props
  const isReceivingMessage = useRef(false)
  const [isOpen, setIsOpen] = useState(false)

  const {
    config: { serverURL },
  } = useConfig()

  const popupRef = useRef<null | Window>(null)

  // Optionally broadcast messages back out to the parent component
  useEffect(() => {
    const receiveMessage = async (event: MessageEvent): Promise<void> => {
      if (
        event.origin !== window.location.origin ||
        event.origin !== url ||
        event.origin !== serverURL
      ) {
        // console.warn(`Message received by ${event.origin}; IGNORED.`) // eslint-disable-line no-console
        return
      }

      if (
        typeof onMessage === 'function' &&
        event.data?.type === eventType &&
        !isReceivingMessage.current
      ) {
        isReceivingMessage.current = true
        await onMessage(event.data?.searchParams)
        isReceivingMessage.current = false
      }
    }

    if (isOpen && popupRef.current) {
      window.addEventListener('message', receiveMessage, false)
    }

    return () => {
      window.removeEventListener('message', receiveMessage)
    }
  }, [onMessage, eventType, url, serverURL, isOpen])

  // Customize the size, position, and style of the popup window
  const openPopupWindow = useCallback(
    (e?: MouseEvent) => {
      if (e) {
        e.preventDefault()
      }

      const features = {
        height: 700,
        left: 'auto',
        menubar: 'no',
        popup: 'yes',
        toolbar: 'no',
        top: 'auto',
        width: 800,
      }

      const popupOptions = Object.entries(features)
        .reduce((str, [key, value]) => {
          let strCopy = str
          if (value === 'auto') {
            if (key === 'top') {
              const v = Math.round(window.innerHeight / 2 - features.height / 2)
              strCopy += `top=${v},`
            } else if (key === 'left') {
              const v = Math.round(window.innerWidth / 2 - features.width / 2)
              strCopy += `left=${v},`
            }
            return strCopy
          }

          strCopy += `${key}=${value},`
          return strCopy
        }, '')
        .slice(0, -1) // remove last ',' (comma)

      const newWindow = window.open(url, '_blank', popupOptions)

      popupRef.current = newWindow

      setIsOpen(true)
    },
    [url],
  )

  // this is the most stable and widely supported way to check if a popup window is no longer open
  // we poll its ref every x ms and use the popup window's `closed` property
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isOpen) {
      timer = setInterval(function () {
        if (popupRef.current.closed) {
          clearInterval(timer)
          setIsOpen(false)
        }
      }, 1000)
    } else {
      clearInterval(timer)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isOpen, popupRef])

  return {
    isPopupOpen: isOpen,
    openPopupWindow,
    popupRef,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useQueue.ts]---
Location: payload-main/packages/ui/src/hooks/useQueue.ts
Signals: React

```typescript
import { useCallback, useRef } from 'react'

type QueuedFunction = () => Promise<void>

type QueuedTaskOptions = {
  /**
   * A function that is called after the queue has processed a function
   * Used to perform side effects after processing the queue
   * @returns {void}
   */
  afterProcess?: () => void
  /**
   * A function that can be used to prevent the queue from processing under certain conditions
   * Can also be used to perform side effects before processing the queue
   * @returns {boolean} If `false`, the queue will not process
   */
  beforeProcess?: () => boolean | void
}

type QueueTask = (fn: QueuedFunction, options?: QueuedTaskOptions) => void

/**
 * A React hook that allows you to queue up functions to be executed in order.
 * This is useful when you need to ensure long running networks requests are processed sequentially.
 * Builds up a "queue" of functions to be executed in order, only ever processing the last function in the queue.
 * This ensures that a long queue of tasks doesn't cause a backlog of tasks to be processed.
 * E.g. if you queue a task and it begins running, then you queue 9 more tasks:
 *   1. The currently task will finish
 *   2. The next task in the queue will run
 *   3. All remaining tasks will be discarded
 * @returns {queueTask} A function used to queue a function.
 * @example
 * const { queueTask } = useQueue()
 * queueTask(async () => {
 *   await fetch('https://api.example.com')
 * })
 */
export function useQueue(): {
  queueTask: QueueTask
} {
  const queue = useRef<QueuedFunction[]>([])

  const isProcessing = useRef(false)

  const queueTask = useCallback<QueueTask>((fn, options) => {
    queue.current.push(fn)

    async function processQueue() {
      if (isProcessing.current) {
        return
      }

      // Allow the consumer to prevent the queue from processing under certain conditions
      if (typeof options?.beforeProcess === 'function') {
        const shouldContinue = options.beforeProcess()

        if (shouldContinue === false) {
          return
        }
      }

      while (queue.current.length > 0) {
        const latestTask = queue.current.pop() // Only process the last task in the queue
        queue.current = [] // Discard all other tasks

        isProcessing.current = true

        try {
          await latestTask()
        } catch (err) {
          console.error('Error in queued function:', err) // eslint-disable-line no-console
        } finally {
          isProcessing.current = false

          if (typeof options?.afterProcess === 'function') {
            options.afterProcess()
          }
        }
      }
    }

    void processQueue()
  }, [])

  return { queueTask }
}
```

--------------------------------------------------------------------------------

---[FILE: useRelatedCollections.ts]---
Location: payload-main/packages/ui/src/hooks/useRelatedCollections.ts
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig } from 'payload'

import { useState } from 'react'

import { useConfig } from '../providers/Config/index.js'

/**
 * Gets the corresponding client collection config(s) for the given collection slug.
 */
export const useRelatedCollections = (relationTo: string | string[]): ClientCollectionConfig[] => {
  const { getEntityConfig } = useConfig()

  const [relatedCollections] = useState(() => {
    if (relationTo) {
      const relations = typeof relationTo === 'string' ? [relationTo] : relationTo
      return relations.map((relation) => getEntityConfig({ collectionSlug: relation }))
    }
    return []
  })

  return relatedCollections
}
```

--------------------------------------------------------------------------------

---[FILE: useResize.ts]---
Location: payload-main/packages/ui/src/hooks/useResize.ts
Signals: React

```typescript
'use client'

import { useEffect, useState } from 'react'

interface Size {
  height: number
  width: number
}

interface Resize {
  size?: Size
}

export const useResize = (element: HTMLElement): Resize => {
  const [size, setSize] = useState<Size>()

  useEffect(() => {
    let observer: any // eslint-disable-line

    if (element) {
      observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const {
            contentBoxSize,
            contentRect, // for Safari iOS compatibility, will be deprecated eventually (see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentRect)
          } = entry

          let newWidth = 0
          let newHeight = 0

          if (contentBoxSize) {
            const newSize = Array.isArray(contentBoxSize) ? contentBoxSize[0] : contentBoxSize

            if (newSize) {
              const { blockSize, inlineSize } = newSize
              newWidth = inlineSize
              newHeight = blockSize
            }
          } else if (contentRect) {
            // see note above for why this block is needed
            const { height, width } = contentRect
            newWidth = width
            newHeight = height
          }

          setSize({
            height: newHeight,
            width: newWidth,
          })
        })
      })

      observer.observe(element)
    }

    return () => {
      if (observer) {
        observer.unobserve(element)
      }
    }
  }, [element])

  return {
    size,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: useThrottledEffect.ts]---
Location: payload-main/packages/ui/src/hooks/useThrottledEffect.ts
Signals: React

```typescript
'use client'
import type React from 'react'

import { useEffect, useRef } from 'react'

type useThrottledEffect = (
  callback: React.EffectCallback,
  delay: number,
  deps: React.DependencyList,
) => void

/**
 * A hook that will throttle the execution of a callback function inside a useEffect.
 * This is useful for things like throttling loading states or other UI updates.
 * @param callback The callback function to be executed.
 * @param delay The delay in milliseconds to throttle the callback.
 * @param deps The dependencies to watch for changes.
 */
export const useThrottledEffect: useThrottledEffect = (callback, delay, deps = []) => {
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= delay) {
          callback()
          lastRan.current = Date.now()
        }
      },
      delay - (Date.now() - lastRan.current),
    )

    return () => {
      clearTimeout(handler)
    }
  }, [delay, ...deps])
}
```

--------------------------------------------------------------------------------

---[FILE: useThrottledValue.ts]---
Location: payload-main/packages/ui/src/hooks/useThrottledValue.ts
Signals: React

```typescript
import { useEffect, useState } from 'react'

/**
 * A custom React hook to throttle a value so that it updates no more than once every `delay` milliseconds.
 * @param {any} value - The value to be throttled.
 * @param {number} delay - The minimum delay (in milliseconds) between updates.
 * @returns {any} - The throttled value.
 */
export function useThrottledValue(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value)
    }, delay)

    // Cleanup the timeout if the value changes before the delay is completed
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return throttledValue
}
```

--------------------------------------------------------------------------------

---[FILE: useUseAsTitle.ts]---
Location: payload-main/packages/ui/src/hooks/useUseAsTitle.ts

```typescript
'use client'
import type { ClientCollectionConfig, ClientField } from 'payload'

import { flattenTopLevelFields } from 'payload/shared'

import { useTranslation } from '../providers/Translation/index.js'

export const useUseTitleField = (collection: ClientCollectionConfig): ClientField => {
  const {
    admin: { useAsTitle },
    fields,
  } = collection

  const { i18n } = useTranslation()

  const topLevelFields = flattenTopLevelFields(fields, {
    i18n,
    moveSubFieldsToTop: true,
  }) as ClientField[]

  return topLevelFields?.find((field) => 'name' in field && field.name === useAsTitle)
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Calendar/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--calendar {
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
Location: payload-main/packages/ui/src/icons/Calendar/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const CalendarIcon: React.FC = () => (
  <svg className="icon icon--calendar" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke"
      d="M7.33333 3.33334V6M12.6667 3.33334V6M4 8.66667H16M5.33333 4.66667H14.6667C15.403 4.66667 16 5.26362 16 6V15.3333C16 16.0697 15.403 16.6667 14.6667 16.6667H5.33333C4.59695 16.6667 4 16.0697 4 15.3333V6C4 5.26362 4.59695 4.66667 5.33333 4.66667Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Check/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--check {
    height: $baseline;
    width: $baseline;

    .stroke {
      fill: none;
      stroke: currentColor;
      stroke-width: $style-stroke-width-m;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Check/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const CheckIcon: React.FC = () => (
  <svg className="icon icon--check" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke"
      d="M15.3333 6.00001L8.00001 13.3333L4.66667 10"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Chevron/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--chevron {
    height: var(--base);
    width: var(--base);

    .stroke {
      fill: none;
      stroke: currentColor;
      stroke-width: $style-stroke-width-s;
      vector-effect: non-scaling-stroke;
    }

    &.icon--size-large {
      height: var(--base);
      width: var(--base);
    }

    &.icon--size-small {
      height: 12px;
      width: 12px;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Chevron/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const ChevronIcon: React.FC<{
  readonly ariaLabel?: string
  readonly className?: string
  readonly direction?: 'down' | 'left' | 'right' | 'up'
  readonly size?: 'large' | 'small'
}> = ({ ariaLabel, className, direction, size }) => (
  <svg
    aria-label={ariaLabel}
    className={['icon icon--chevron', className, size && `icon--size-${size}`]
      .filter(Boolean)
      .join(' ')}
    height="100%"
    style={{
      transform:
        direction === 'left'
          ? 'rotate(90deg)'
          : direction === 'right'
            ? 'rotate(-90deg)'
            : direction === 'up'
              ? 'rotate(180deg)'
              : undefined,
    }}
    viewBox="0 0 20 20"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="stroke" d="M14 8L10 12L6 8" strokeLinecap="square" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/CloseMenu/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .icon--close-menu {
    height: $baseline;
    width: $baseline;

    .stroke {
      stroke: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/CloseMenu/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const CloseMenuIcon: React.FC = () => (
  <svg className="icon icon--close-menu" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path className="stroke" d="M14 6L6 14M6 6L14 14" strokeLinecap="square" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/CodeBlock/index.tsx
Signals: React

```typescript
import React from 'react'

export const CodeBlockIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic code-block-icon"
    focusable="false"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M14 12.6667L16.6667 9.99999L14 7.33332M5.99999 7.33332L3.33333 9.99999L5.99999 12.6667M11.6667 4.66666L8.33333 15.3333"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Copy/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--copy {
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
Location: payload-main/packages/ui/src/icons/Copy/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const CopyIcon: React.FC = () => (
  // <svg className="icon icon--copy" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
  //   <rect className="stroke" height="8" width="8" x="6.5" y="10" />
  //   <path className="stroke" d="M10 9.98438V6.5H18V14.5H14" />
  // </svg>
  <svg className="icon icon--copy" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      className="stroke"
      d="M4.66666 12.6667C3.93333 12.6667 3.33333 12.0667 3.33333 11.3333V4.66668C3.33333 3.93334 3.93333 3.33334 4.66666 3.33334H11.3333C12.0667 3.33334 12.6667 3.93334 12.6667 4.66668M8.66666 7.33334H15.3333C16.0697 7.33334 16.6667 7.9303 16.6667 8.66668V15.3333C16.6667 16.0697 16.0697 16.6667 15.3333 16.6667H8.66666C7.93028 16.6667 7.33333 16.0697 7.33333 15.3333V8.66668C7.33333 7.9303 7.93028 7.33334 8.66666 7.33334Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Document/index.scss

```text
@layer payload-default {
  .icon--document {
    height: var(--base);
    width: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Document/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const DocumentIcon = () => {
  return (
    <svg
      className="icon icon--document"
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M3.5 1C2.94772 1 2.5 1.44772 2.5 2V14C2.5 14.5523 2.94771 15 3.5 15H12.5C13.0523 15 13.5 14.5523 13.5 14V4.41421C13.5 4.149 13.3946 3.89464 13.2071 3.70711L10.7929 1.29289C10.6054 1.10536 10.351 1 10.0858 1H3.5ZM5 5.5C5 5.22386 5.22386 5 5.5 5H10.5C10.7761 5 11 5.22386 11 5.5C11 5.77614 10.7761 6 10.5 6H5.5C5.22386 6 5 5.77614 5 5.5ZM5 8.5C5 8.22386 5.22386 8 5.5 8H10.5C10.7761 8 11 8.22386 11 8.5C11 8.77614 10.7761 9 10.5 9H5.5C5.22386 9 5 8.77614 5 8.5ZM5 11.5C5 11.2239 5.22386 11 5.5 11H10.5C10.7761 11 11 11.2239 11 11.5C11 11.7761 10.7761 12 10.5 12H5.5C5.22386 12 5 11.7761 5 11.5Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Dots/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .dots {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2px;
    background-color: var(--theme-elevation-150);
    border-radius: $style-radius-m;
    height: calc(var(--base) * 1.2);
    width: calc(var(--base) * 1.2);

    &:hover {
      background-color: var(--theme-elevation-250);
    }

    &--no-background {
      background-color: transparent;
      width: auto;
      height: auto;

      &:hover {
        background-color: transparent;
      }
    }

    &--horizontal {
      flex-direction: row;
    }

    > div {
      width: 2px;
      height: 2px;
      border-radius: 100%;
      background-color: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Dots/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'dots'

export const Dots: React.FC<{
  ariaLabel?: string
  className?: string
  noBackground?: boolean
  orientation?: 'horizontal' | 'vertical'
}> = ({ ariaLabel, className, noBackground, orientation = 'vertical' }) => (
  <div
    aria-label={ariaLabel}
    className={[
      className,
      baseClass,
      noBackground && `${baseClass}--no-background`,
      orientation && `${baseClass}--${orientation}`,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    <div />
    <div />
    <div />
  </div>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/DragHandle/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--drag-handle {
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
Location: payload-main/packages/ui/src/icons/DragHandle/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={['icon icon--drag-handle', className].filter(Boolean).join(' ')}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="fill"
      d="M7.99999 10.6667C8.36818 10.6667 8.66666 10.3682 8.66666 9.99999C8.66666 9.6318 8.36818 9.33332 7.99999 9.33332C7.63181 9.33332 7.33333 9.6318 7.33333 9.99999C7.33333 10.3682 7.63181 10.6667 7.99999 10.6667Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M7.99999 5.99999C8.36818 5.99999 8.66666 5.70151 8.66666 5.33332C8.66666 4.96513 8.36818 4.66666 7.99999 4.66666C7.63181 4.66666 7.33333 4.96513 7.33333 5.33332C7.33333 5.70151 7.63181 5.99999 7.99999 5.99999Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M7.99999 15.3333C8.36818 15.3333 8.66666 15.0348 8.66666 14.6667C8.66666 14.2985 8.36818 14 7.99999 14C7.63181 14 7.33333 14.2985 7.33333 14.6667C7.33333 15.0348 7.63181 15.3333 7.99999 15.3333Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M12 10.6667C12.3682 10.6667 12.6667 10.3682 12.6667 9.99999C12.6667 9.6318 12.3682 9.33332 12 9.33332C11.6318 9.33332 11.3333 9.6318 11.3333 9.99999C11.3333 10.3682 11.6318 10.6667 12 10.6667Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M12 5.99999C12.3682 5.99999 12.6667 5.70151 12.6667 5.33332C12.6667 4.96513 12.3682 4.66666 12 4.66666C11.6318 4.66666 11.3333 4.96513 11.3333 5.33332C11.3333 5.70151 11.6318 5.99999 12 5.99999Z"
      strokeLinecap="square"
    />
    <path
      className="fill"
      d="M12 15.3333C12.3682 15.3333 12.6667 15.0348 12.6667 14.6667C12.6667 14.2985 12.3682 14 12 14C11.6318 14 11.3333 14.2985 11.3333 14.6667C11.3333 15.0348 11.6318 15.3333 12 15.3333Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Edit/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--edit {
    height: $baseline;
    width: $baseline;
    shape-rendering: auto;

    .stroke {
      fill: none;
      stroke: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Edit/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={[className, 'icon icon--edit'].filter(Boolean).join(' ')}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M9.68531 4.62938H5.2634C4.92833 4.62938 4.60698 4.76248 4.37004 4.99942C4.13311 5.23635 4 5.5577 4 5.89278V14.7366C4 15.0717 4.13311 15.393 4.37004 15.63C4.60698 15.8669 4.92833 16 5.2634 16H14.1072C14.4423 16 14.7636 15.8669 15.0006 15.63C15.2375 15.393 15.3706 15.0717 15.3706 14.7366V10.3147M13.7124 4.39249C13.9637 4.14118 14.3046 4 14.66 4C15.0154 4 15.3562 4.14118 15.6075 4.39249C15.8588 4.6438 16 4.98464 16 5.34004C16 5.69544 15.8588 6.03629 15.6075 6.28759L9.91399 11.9817C9.76399 12.1316 9.57868 12.2413 9.37515 12.3008L7.56027 12.8314C7.50591 12.8472 7.44829 12.8482 7.39344 12.8341C7.33859 12.8201 7.28853 12.7915 7.24849 12.7515C7.20845 12.7115 7.17991 12.6614 7.16586 12.6066C7.15181 12.5517 7.15276 12.4941 7.16861 12.4397L7.69924 10.6249C7.75896 10.4215 7.86888 10.2364 8.01888 10.0866L13.7124 4.39249Z"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/ExternalLink/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--externalLink {
    height: $baseline;
    width: $baseline;
    shape-rendering: auto;

    .stroke {
      fill: none;
      stroke: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/ExternalLink/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const ExternalLinkIcon: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  return (
    <svg
      className={[className, 'icon icon--externalLink'].filter(Boolean).join(' ')}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="stroke"
        d="M16 10.6667V14.6667C16 15.0203 15.8595 15.3594 15.6095 15.6095C15.3594 15.8595 15.0203 16 14.6667 16H5.33333C4.97971 16 4.64057 15.8595 4.39052 15.6095C4.14048 15.3594 4 15.0203 4 14.6667V5.33333C4 4.97971 4.14048 4.64057 4.39052 4.39052C4.64057 4.14048 4.97971 4 5.33333 4H9.33333M16 4L10 10M16 4H12M16 4V8"
        strokeLinecap="square"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Eye/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--eye {
    height: $baseline;
    width: $baseline;
    shape-rendering: auto;
    vector-effect: non-scaling-stroke;

    .stroke {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.75;
    }

    .fill {
      fill: currentColor;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Eye/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import './index.scss'

export const EyeIcon: React.FC<{ active?: boolean; className?: string }> = ({
  active = true,
  className,
}) => (
  <svg
    className={[className, 'icon icon--eye'].filter(Boolean).join(' ')}
    viewBox="0 0 16 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    {!active ? (
      <Fragment>
        <circle className="stroke" cx="8.5" cy="6" r="2.5" />
        <path
          className="stroke"
          d="M8.5 1C3.83333 1 1.5 6 1.5 6C1.5 6 3.83333 11 8.5 11C13.1667 11 15.5 6 15.5 6C15.5 6 13.1667 1 8.5 1Z"
        />
      </Fragment>
    ) : (
      <Fragment>
        <path
          className="stroke"
          d="M2 11.5L4.35141 9.51035M15 0.5L12.6486 2.48965M10.915 6.64887C10.6493 7.64011 9.78959 8.38832 8.7408 8.48855M10.4085 4.38511C9.94992 3.84369 9.2651 3.5 8.5 3.5C7.11929 3.5 6 4.61929 6 6C6 6.61561 6.22251 7.17926 6.59149 7.61489M10.4085 4.38511L6.59149 7.61489M10.4085 4.38511L12.6486 2.48965M6.59149 7.61489L4.35141 9.51035M14.1292 3.92915C15.0431 5.02085 15.5 6 15.5 6C15.5 6 13.1667 11 8.5 11C7.67995 11 6.93195 10.8456 6.256 10.5911M4.35141 9.51035C2.45047 8.03672 1.5 6 1.5 6C1.5 6 3.83333 1 8.5 1C10.1882 1 11.5711 1.65437 12.6486 2.48965"
        />
      </Fragment>
    )}
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Folder/index.scss

```text
@layer payload-default {
  .icon--folder {
    height: var(--base);
    width: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Folder/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={[className, 'icon icon--folder'].filter(Boolean).join(' ')}
      fill="none"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3333 13.3333C13.6869 13.3333 14.026 13.1929 14.2761 12.9428C14.5261 12.6928 14.6666 12.3536 14.6666 12V5.33333C14.6666 4.97971 14.5261 4.64057 14.2761 4.39052C14.026 4.14048 13.6869 4 13.3333 4H8.06659C7.84359 4.00219 7.62362 3.94841 7.42679 3.84359C7.22996 3.73877 7.06256 3.58625 6.93992 3.4L6.39992 2.6C6.27851 2.41565 6.11323 2.26432 5.91892 2.1596C5.7246 2.05488 5.50732 2.00004 5.28659 2H2.66659C2.31296 2 1.97382 2.14048 1.72378 2.39052C1.47373 2.64057 1.33325 2.97971 1.33325 3.33333V12C1.33325 12.3536 1.47373 12.6928 1.72378 12.9428C1.97382 13.1929 2.31296 13.3333 2.66659 13.3333H13.3333Z"
        fill="currentColor"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Gear/index.scss

```text
@layer payload-default {
  .gear {
    // Additional styling can be added here if needed
  }

  .icon--gear {
    height: var(--base);
    width: var(--base);

    path {
      stroke: currentColor;
      stroke-width: 1px;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Gear/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'gear'

export const GearIcon: React.FC<{
  ariaLabel?: string
  className?: string
}> = ({ ariaLabel, className }) => (
  <div aria-label={ariaLabel} className={[className, baseClass].filter(Boolean).join(' ')}>
    <svg
      className="icon icon--gear"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.33337 8.84671L6.66671 4.22671M9.33337 11.1534L6.66671 15.7734M10 16.6667V15.3334M10 15.3334C12.9456 15.3334 15.3334 12.9456 15.3334 10C15.3334 7.05452 12.9456 4.66671 10 4.66671M10 15.3334C7.05452 15.3334 4.66671 12.9456 4.66671 10M10 3.33337V4.66671M10 4.66671C7.05452 4.66671 4.66671 7.05452 4.66671 10M11.3334 10H16.6667M11.3334 10C11.3334 10.7364 10.7364 11.3334 10 11.3334C9.26366 11.3334 8.66671 10.7364 8.66671 10C8.66671 9.26366 9.26366 8.66671 10 8.66671C10.7364 8.66671 11.3334 9.26366 11.3334 10ZM13.3334 15.7734L12.6667 14.62M13.3334 4.22671L12.6667 5.38004M3.33337 10H4.66671M15.7734 13.3334L14.62 12.6667M15.7734 6.66671L14.62 7.33337M4.22671 13.3334L5.38004 12.6667M4.22671 6.66671L5.38004 7.33337"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/GridView/index.scss

```text
.icon.icon--grid-view {
  stroke: currentColor;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/GridView/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const GridViewIcon = () => {
  return (
    <svg
      className="icon icon--grid-view"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4H4.66667C4.29848 4 4 4.29848 4 4.66667V8C4 8.36819 4.29848 8.66667 4.66667 8.66667H8C8.36819 8.66667 8.66667 8.36819 8.66667 8V4.66667C8.66667 4.29848 8.36819 4 8 4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3333 4H12C11.6318 4 11.3333 4.29848 11.3333 4.66667V8C11.3333 8.36819 11.6318 8.66667 12 8.66667H15.3333C15.7015 8.66667 16 8.36819 16 8V4.66667C16 4.29848 15.7015 4 15.3333 4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.3333 11.3333H12C11.6318 11.3333 11.3333 11.6318 11.3333 12V15.3333C11.3333 15.7015 11.6318 16 12 16H15.3333C15.7015 16 16 15.7015 16 15.3333V12C16 11.6318 15.7015 11.3333 15.3333 11.3333Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.3333H4.66667C4.29848 11.3333 4 11.6318 4 12V15.3333C4 15.7015 4.29848 16 4.66667 16H8C8.36819 16 8.66667 15.7015 8.66667 15.3333V12C8.66667 11.6318 8.36819 11.3333 8 11.3333Z"
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
Location: payload-main/packages/ui/src/icons/Line/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--line {
    width: $baseline;
    height: $baseline;

    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Line/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const LineIcon: React.FC = () => (
  <svg
    className="icon icon--line"
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="stroke" d="M5.33333 10H14.6667" strokeLinecap="square" />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/Link/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--link {
    width: $baseline;
    height: $baseline;

    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Link/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const LinkIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    className="graphic link icon icon--link"
    fill="none"
    focusable="false"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M7.99999 13.3333H6.66666C5.78261 13.3333 4.93476 12.9821 4.30964 12.357C3.68452 11.7319 3.33333 10.884 3.33333 9.99999C3.33333 9.11593 3.68452 8.26809 4.30964 7.64297C4.93476 7.01785 5.78261 6.66666 6.66666 6.66666H7.99999M12 6.66666H13.3333C14.2174 6.66666 15.0652 7.01785 15.6904 7.64297C16.3155 8.26809 16.6667 9.11593 16.6667 9.99999C16.6667 10.884 16.3155 11.7319 15.6904 12.357C15.0652 12.9821 14.2174 13.3333 13.3333 13.3333H12M7.33333 9.99999H12.6667"
      strokeLinecap="square"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/icons/ListView/index.scss

```text
.icon.icon--list-view {
  stroke: currentColor;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/ListView/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const ListViewIcon = () => {
  return (
    <svg
      className="icon icon--list-view"
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10H16M4 14H16M4 6H16"
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
Location: payload-main/packages/ui/src/icons/Lock/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .icon--lock {
    .stroke {
      stroke: currentColor;
      stroke-width: $style-stroke-width;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/icons/Lock/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

export const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={['icon icon--lock', className].filter(Boolean).join(' ')}
    fill="none"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="stroke"
      d="M7.5 9.5V7.5C7.5 6.83696 7.76339 6.20107 8.23223 5.73223C8.70107 5.26339 9.33696 5 10 5C10.663 5 11.2989 5.26339 11.7678 5.73223C12.2366 6.20107 12.5 6.83696 12.5 7.5V9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="1"
    />
    <path
      className="stroke"
      d="M13.5 9.5H6.5C5.94772 9.5 5.5 9.94772 5.5 10.5V14C5.5 14.5523 5.94772 15 6.5 15H13.5C14.0523 15 14.5 14.5523 14.5 14V10.5C14.5 9.94772 14.0523 9.5 13.5 9.5Z"
      stopOpacity="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
```

--------------------------------------------------------------------------------

````
