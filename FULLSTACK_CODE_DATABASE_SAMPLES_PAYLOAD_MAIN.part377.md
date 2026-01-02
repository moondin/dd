---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 377
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 377 of 695)

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
Location: payload-main/packages/ui/src/elements/Popup/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .popup {
    position: relative;

    &__trigger-wrap {
      display: flex;
      align-items: stretch;
      height: 100%;
      cursor: pointer;
    }

    &__on-hover-watch {
      display: contents;
    }
  }

  .popup__hidden-content {
    display: none;
  }

  .popup__content {
    --popup-caret-size: 8px;
    --popup-button-highlight: var(--theme-elevation-150);

    position: absolute;
    z-index: var(--z-popup);
    background: var(--theme-input-bg);
    color: var(--theme-text);
    border-radius: 4px;
    padding: calc(var(--base) * 0.5);
    min-width: 150px;
    max-width: calc(100vw - var(--base));
    @include shadow-lg;

    &.popup--size-xsmall {
      min-width: 80px;
    }
    &.popup--size-small {
      min-width: 100px;
    }
    &.popup--size-large {
      min-width: 200px;
    }
    &.popup--size-fit-content {
      min-width: fit-content;
    }
  }

  .popup__scroll-container {
    overflow-y: auto;
    max-height: calc(var(--base) * 10);

    &:not(.popup__scroll-container--show-scrollbar) {
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE/Edge

      &::-webkit-scrollbar {
        display: none; // Chrome/Safari/Opera
      }
    }
  }

  .popup__caret {
    position: absolute;
    width: 0;
    height: 0;
    border: var(--popup-caret-size) solid transparent;
    left: var(--caret-left, 16px);
    transform: translateX(-50%);

    .popup--v-bottom & {
      top: calc(var(--popup-caret-size) * -2);
      border-bottom-color: var(--theme-input-bg);
    }

    .popup--v-top & {
      bottom: calc(var(--popup-caret-size) * -2);
      border-top-color: var(--theme-input-bg);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Popup/index.tsx
Signals: React

```typescript
'use client'
import type { CSSProperties } from 'react'

export * as PopupList from './PopupButtonList/index.js'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useEffectEvent } from '../../hooks/useEffectEvent.js'
import './index.scss'
import { PopupTrigger } from './PopupTrigger/index.js'

const baseClass = 'popup'

/**
 * Selector for all elements the browser considers tabbable.
 */
const TABBABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled):not([type="hidden"])',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]',
  '[contenteditable]:not([contenteditable="false"])',
  'audio[controls]',
  'video[controls]',
  'summary',
]
  .map((s) => `${s}:not([tabindex="-1"])`)
  .join(', ')

export type PopupProps = {
  backgroundColor?: CSSProperties['backgroundColor']
  boundingRef?: React.RefObject<HTMLElement>
  button?: React.ReactNode
  buttonClassName?: string
  buttonSize?: 'large' | 'medium' | 'small' | 'xsmall'
  buttonType?: 'custom' | 'default' | 'none'
  caret?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  /**
   * Force control the open state of the popup, regardless of the trigger.
   */
  forceOpen?: boolean
  /**
   * Preferred horizontal alignment of the popup, if there is enough space available.
   *
   * @default 'left'
   */
  horizontalAlign?: 'center' | 'left' | 'right'
  id?: string
  initActive?: boolean
  noBackground?: boolean
  onToggleClose?: () => void
  onToggleOpen?: (active: boolean) => void
  render?: (args: { close: () => void }) => React.ReactNode
  showOnHover?: boolean
  /**
   * By default, the scrollbar is hidden. If you want to show it, set this to true.
   * In both cases, the container is still scrollable.
   *
   * @default false
   */
  showScrollbar?: boolean
  size?: 'fit-content' | 'large' | 'medium' | 'small'
  /**
   * Preferred vertical alignment of the popup (position below or above the trigger),
   * if there is enough space available.
   *
   * If the popup is too close to the edge of the viewport, it will flip to the opposite side
   * regardless of the preferred vertical alignment.
   *
   * @default 'bottom'
   */
  verticalAlign?: 'bottom' | 'top'
}

/**
 * Component that renders a popup, as well as a button that triggers the popup.
 *
 * The popup is rendered in a portal, and is automatically positioned above / below the trigger,
 * depending on the verticalAlign prop and the space available.
 */
export const Popup: React.FC<PopupProps> = (props) => {
  const {
    id,
    button,
    buttonClassName,
    buttonSize,
    buttonType = 'default',
    caret = true,
    children,
    className,
    disabled,
    forceOpen,
    horizontalAlign = 'left',
    initActive = false,
    noBackground,
    onToggleClose,
    onToggleOpen,
    render,
    showOnHover = false,
    showScrollbar = false,
    size = 'medium',
    verticalAlign = 'bottom',
  } = props

  const popupRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  /**
   * Keeps track of whether the popup was opened via keyboard.
   * This is used to determine whether to autofocus the first element in the popup.
   * If the popup was opened via mouse, we do not want to autofocus the first element.
   */
  const openedViaKeyboardRef = useRef(false)

  const [mounted, setMounted] = useState(false)
  const [active, setActiveInternal] = useState(initActive)
  const [isOnTop, setIsOnTop] = useState(verticalAlign === 'top')

  // Track when component is mounted to avoid SSR/client hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const setActive = useCallback(
    (isActive: boolean, viaKeyboard = false) => {
      if (isActive) {
        openedViaKeyboardRef.current = viaKeyboard
        onToggleOpen?.(true)
      } else {
        onToggleClose?.()
      }
      setActiveInternal(isActive)
    },
    [onToggleClose, onToggleOpen],
  )

  // /////////////////////////////////////
  // Position Calculation
  //
  // Calculates and applies popup position relative to trigger.
  // Always checks viewport bounds (for flipping), but only updates
  // styles if the calculated position differs from current position.
  // /////////////////////////////////////

  const updatePosition = useEffectEvent(() => {
    const trigger = triggerRef.current
    const popup = popupRef.current
    if (!trigger || !popup) {
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const popupRect = popup.getBoundingClientRect()

    // Gap between the popup and the trigger/viewport edges (in pixels)
    const offset = 10

    // /////////////////////////////////////
    // Vertical Positioning
    // Calculates the `top` position in absolute page coordinates.
    // Uses `verticalAlign` prop as the preferred direction, but flips
    // to the opposite side if there's not enough viewport space.
    // /////////////////////////////////////

    let top: number
    let onTop = verticalAlign === 'top'

    if (verticalAlign === 'bottom') {
      top = triggerRect.bottom + window.scrollY + offset

      if (triggerRect.bottom + popupRect.height + offset > window.innerHeight) {
        top = triggerRect.top + window.scrollY - popupRect.height - offset
        onTop = true
      }
    } else {
      top = triggerRect.top + window.scrollY - popupRect.height - offset

      if (triggerRect.top - popupRect.height - offset < 0) {
        top = triggerRect.bottom + window.scrollY + offset
        onTop = false
      }
    }

    setIsOnTop(onTop)

    // /////////////////////////////////////
    // Horizontal Positioning
    // Calculates the `left` position based on `horizontalAlign` prop:
    // - 'left': aligns popup's left edge with trigger's left edge
    // - 'right': aligns popup's right edge with trigger's right edge
    // - 'center': centers popup horizontally relative to trigger
    // Then clamps to keep the popup within viewport bounds.
    // /////////////////////////////////////

    let left =
      horizontalAlign === 'right'
        ? triggerRect.right - popupRect.width
        : horizontalAlign === 'center'
          ? triggerRect.left + triggerRect.width / 2 - popupRect.width / 2
          : triggerRect.left

    left = Math.max(offset, Math.min(left, window.innerWidth - popupRect.width - offset))

    // /////////////////////////////////////
    // Caret Positioning
    // Positions the caret arrow to point at the trigger's horizontal center.
    // Clamps between 12px from edges to prevent caret from overflowing the popup.
    // /////////////////////////////////////

    const triggerCenter = triggerRect.left + triggerRect.width / 2
    const caretLeft = Math.max(12, Math.min(triggerCenter - left, popupRect.width - 12))

    // /////////////////////////////////////
    // Apply Styles (only if changed)
    // Compares calculated position with current styles to avoid unnecessary
    // DOM updates during scroll. This prevents visual lag by relying on the absolute
    // positioning where possible (popup slightly lags behind when scrolling really fast),
    // while still allowing position changes when needed (e.g., sticky parent, viewport flip).
    // Values are rounded to match browser's CSS precision and avoid false updates.
    // /////////////////////////////////////

    const newTop = `${Math.round(top)}px`
    const newLeft = `${Math.round(left + window.scrollX)}px`
    const newCaretLeft = `${Math.round(caretLeft)}px`

    if (popup.style.top !== newTop) {
      popup.style.top = newTop
    }
    if (popup.style.left !== newLeft) {
      popup.style.left = newLeft
    }
    if (popup.style.getPropertyValue('--caret-left') !== newCaretLeft) {
      popup.style.setProperty('--caret-left', newCaretLeft)
    }
  })

  // /////////////////////////////////////
  // Click Outside Handler
  // Closes popup when clicking outside both the popup and trigger.
  // /////////////////////////////////////

  const handleClickOutside = useEffectEvent((e: MouseEvent) => {
    const isOutsidePopup = !popupRef.current?.contains(e.target as Node)
    const isOutsideTrigger = !triggerRef.current?.contains(e.target as Node)

    if (isOutsidePopup && isOutsideTrigger) {
      setActive(false)
    }
  })

  // /////////////////////////////////////
  // Keyboard Navigation
  // Handles keyboard interactions when popup is open:
  // - Escape: closes popup and returns focus to trigger
  // - Tab/Shift+Tab: cycles through focusable items with wrapping
  // - ArrowUp/ArrowDown: same as Shift+Tab/Tab for menu-style navigation
  // Focus is managed manually to support elements the browser might skip.
  // /////////////////////////////////////

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const popup = popupRef.current
    if (!popup || !active) {
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setActive(false)
      triggerRef.current?.querySelector<HTMLElement>('button, [tabindex="0"]')?.focus()
      return
    }

    if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const focusable = Array.from(popup.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR))
      if (focusable.length === 0) {
        return
      }

      e.preventDefault()

      const currentIndex = focusable.findIndex((el) => el === document.activeElement)
      const goBackward = e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)

      let nextIndex: number
      if (currentIndex === -1) {
        nextIndex = goBackward ? focusable.length - 1 : 0
      } else if (goBackward) {
        nextIndex = currentIndex === 0 ? focusable.length - 1 : currentIndex - 1
      } else {
        nextIndex = currentIndex === focusable.length - 1 ? 0 : currentIndex + 1
      }

      focusable[nextIndex].focus()
    }
  })

  // /////////////////////////////////////
  // Click Handler for Actionable Elements
  // Closes popup when buttons/links inside are clicked (includes Enter/Space activation).
  // /////////////////////////////////////

  const handleActionableClick = useEffectEvent((e: MouseEvent) => {
    const target = e.target as HTMLElement
    // Check if the clicked element or any ancestor is an actionable element
    const actionable = target.closest('button, a[href], [role="button"], [role="menuitem"]')
    if (actionable && popupRef.current?.contains(actionable)) {
      setActive(false)
    }
  })

  // /////////////////////////////////////
  // Effect: Setup/Teardown position and focus management
  // /////////////////////////////////////

  useEffect(() => {
    if (!active) {
      return
    }

    const popup = popupRef.current
    if (!popup) {
      return
    }

    // /////////////////////////////////////
    // Initial Position
    // Calculate and apply popup position immediately on open.
    // /////////////////////////////////////

    updatePosition()

    // /////////////////////////////////////
    // Focus Management
    // When opened via keyboard, autofocus the first focusable button.
    // When opened via mouse, skip autofocus to avoid unwanted highlights.
    // /////////////////////////////////////

    if (openedViaKeyboardRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready.
      requestAnimationFrame(() => {
        const firstFocusable = popup.querySelector<HTMLElement>(TABBABLE_SELECTOR)
        firstFocusable?.focus()
      })
    }

    // /////////////////////////////////////
    // Event Listeners
    // - resize/scroll: recalculate position (only applies styles if changed)
    // - mousedown: detect clicks outside to close
    // - keydown: handle keyboard navigation
    // /////////////////////////////////////

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { capture: true, passive: true })
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    popup.addEventListener('click', handleActionableClick)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, { capture: true })
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      popup.removeEventListener('click', handleActionableClick)
    }
  }, [active])

  useEffect(() => {
    if (forceOpen !== undefined) {
      setActive(forceOpen)
    }
  }, [forceOpen, setActive])

  const Trigger = (
    <PopupTrigger
      active={active}
      button={button}
      buttonType={buttonType}
      className={buttonClassName}
      disabled={disabled}
      noBackground={noBackground}
      setActive={setActive}
      size={buttonSize}
    />
  )

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')} id={id}>
      <div className={`${baseClass}__trigger-wrap`} ref={triggerRef}>
        {showOnHover ? (
          <div
            className={`${baseClass}__on-hover-watch`}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            role="button"
            tabIndex={0}
          >
            {Trigger}
          </div>
        ) : (
          Trigger
        )}
      </div>

      {mounted
        ? // We need to make sure the popup is part of the DOM (although invisible), even if it's not active.
          // This ensures that components within the popup, like modals, do not unmount when the popup closes.
          // Otherwise, modals opened from the popup will close unexpectedly when clicking within the modal, since
          // that closes the popup due to the click outside handler.
          createPortal(
            <div
              className={
                active
                  ? [
                      `${baseClass}__content`,
                      `${baseClass}--size-${size}`,
                      isOnTop ? `${baseClass}--v-top` : `${baseClass}--v-bottom`,
                    ]
                      .filter(Boolean)
                      .join(' ')
                  : // Do not share any class names between active and disabled popups, to make sure
                    // tests do not accidentally target inactive popups.
                    `${baseClass}__hidden-content`
              }
              data-popup-id={id || undefined}
              ref={popupRef}
            >
              <div
                className={`${baseClass}__scroll-container${showScrollbar ? ` ${baseClass}__scroll-container--show-scrollbar` : ''}`}
              >
                {render?.({ close: () => setActive(false) })}
                {children}
              </div>
              {caret && <div className={`${baseClass}__caret`} />}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Popup/PopupButtonList/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .popup-button-list {
    --list-button-padding: calc(var(--base) * 0.5);
    --popup-button-list-gap: 3px;
    display: flex;
    flex-direction: column;
    text-align: left;
    [dir='rtl'] &__text-align--left {
      text-align: right;
    }
    &__text-align--left {
      text-align: left;
    }

    &__text-align--center {
      text-align: center;
    }
    [dir='rtl'] &__text-align--right {
      text-align: left;
    }
    &__text-align--right {
      text-align: right;
    }

    &__button {
      @extend %btn-reset;
      padding-left: var(--list-button-padding);
      padding-right: var(--list-button-padding);
      padding-top: calc(2px + var(--popup-button-list-gap) / 2);
      padding-bottom: calc(2px + var(--popup-button-list-gap) / 2);
      cursor: pointer;
      text-align: inherit;
      line-height: var(--base);
      text-decoration: none;
      border-radius: 3px;
      width: 100%;
      button {
        @extend %btn-reset;

        &:focus-visible {
          outline: none;
        }
      }

      &:hover,
      &:focus-visible,
      &:focus-within {
        outline: none;
        background-color: var(--popup-button-highlight);
      }
    }

    &__button--selected {
      background-color: var(--theme-elevation-150);
    }

    &__disabled {
      cursor: not-allowed;
      --popup-button-highlight: transparent;
      background-color: var(--popup-button-highlight);
      color: var(--theme-elevation-350);
      &:hover {
        --popup-button-highlight: var(--theme-elevation-50);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Popup/PopupButtonList/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { LinkProps } from 'next/link.js'

import * as React from 'react'

import { Link } from '../../Link/index.js'
import './index.scss'

const baseClass = 'popup-button-list'

export { PopupListDivider as Divider } from '../PopupDivider/index.js'
export { PopupListGroupLabel as GroupLabel } from '../PopupGroupLabel/index.js'

export const ButtonGroup: React.FC<{
  buttonSize?: 'default' | 'small'
  children: React.ReactNode
  className?: string
  textAlign?: 'center' | 'left' | 'right'
}> = ({ buttonSize = 'default', children, className, textAlign = 'left' }) => {
  const classes = [
    baseClass,
    className,
    `${baseClass}__text-align--${textAlign}`,
    `${baseClass}__button-size--${buttonSize}`,
  ]
    .filter(Boolean)
    .join(' ')
  return <div className={classes}>{children}</div>
}

type MenuButtonProps = {
  active?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  href?: LinkProps['href']
  id?: string
  onClick?: (e?: React.MouseEvent) => void
}

export const Button: React.FC<MenuButtonProps> = ({
  id,
  active,
  children,
  className,
  disabled,
  href,
  onClick,
}) => {
  const classes = [
    `${baseClass}__button`,
    disabled && `${baseClass}__disabled`,
    active && `${baseClass}__button--selected`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (!disabled) {
    if (href) {
      return (
        <Link
          className={classes}
          href={href}
          id={id}
          onClick={(e) => {
            if (onClick) {
              onClick(e)
            }
          }}
          prefetch={false}
        >
          {children}
        </Link>
      )
    }

    if (onClick) {
      return (
        <button
          className={classes}
          id={id}
          onClick={(e) => {
            if (onClick) {
              onClick(e)
            }
          }}
          type="button"
        >
          {children}
        </button>
      )
    }
  }

  return (
    <div className={classes} id={id}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Popup/PopupDivider/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .popup-divider {
    width: 100%;
    height: 1px;
    background-color: var(--theme-elevation-150);
    border: none;
    margin: calc(var(--base) * 0.75) 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Popup/PopupDivider/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'popup-divider'

export const PopupListDivider: React.FC = () => {
  return <hr className={baseClass} />
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Popup/PopupGroupLabel/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .popup-list-group-label {
    color: var(--theme-elevation-500);
    font-weight: 500;
    line-height: 1;
    margin-top: calc(var(--base) * 0.25);
    margin-bottom: calc(var(--base) * 0.5);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Popup/PopupGroupLabel/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'popup-list-group-label'

export const PopupListGroupLabel: React.FC<{
  label: string
}> = ({ label }) => {
  return <p className={baseClass}>{label}</p>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Popup/PopupTrigger/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .popup-button {
    height: 100%;
    color: currentColor;
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    border: 0;
    cursor: pointer;
    display: inline-flex;

    &--background {
      background: transparent;
    }

    &--size-xsmall {
      padding: base(0.1);
    }

    &--size-small {
      padding: base(0.2);
    }

    &--size-medium {
      padding: base(0.3);
    }

    &--size-large {
      padding: base(0.4);
    }

    &--disabled {
      cursor: not-allowed;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Popup/PopupTrigger/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import './index.scss'

const baseClass = 'popup-button'

export type PopupTriggerProps = {
  active: boolean
  button: React.ReactNode
  buttonType: 'custom' | 'default' | 'none'
  className?: string
  disabled?: boolean
  noBackground?: boolean
  setActive: (active: boolean, viaKeyboard?: boolean) => void
  size?: 'large' | 'medium' | 'small' | 'xsmall'
}

export const PopupTrigger: React.FC<PopupTriggerProps> = (props) => {
  const { active, button, buttonType, className, disabled, noBackground, setActive, size } = props

  const classes = [
    baseClass,
    className,
    `${baseClass}--${buttonType}`,
    !noBackground && `${baseClass}--background`,
    size && `${baseClass}--size-${size}`,
    disabled && `${baseClass}--disabled`,
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    setActive(!active, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActive(!active, true)
    }
  }

  if (buttonType === 'none') {
    return null
  }

  if (buttonType === 'custom') {
    return (
      <div
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        {button}
      </div>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      type="button"
    >
      {button}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PreviewButton/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .preview-btn {
    background: none;
    border: none;
    border: 1px solid;
    border-color: var(--theme-elevation-100);
    border-radius: var(--style-radius-s);
    line-height: var(--btn-line-height);
    font-size: var(--base-body-size);
    padding: calc(var(--base) * 0.2) calc(var(--base) * 0.4);
    cursor: pointer;
    transition-property: border, color, background;
    transition-duration: 100ms;
    transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
    height: calc(var(--base) * 1.6);
    width: calc(var(--base) * 1.6);
    position: relative;

    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .stroke {
        transition-property: stroke;
        transition-duration: 100ms;
        transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
      }
    }

    &:hover {
      border-color: var(--theme-elevation-300);
      background-color: var(--theme-elevation-100);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PreviewButton/index.tsx
Signals: React

```typescript
'use client'
import type { PreviewButtonClientProps } from 'payload'

import React from 'react'

import { ExternalLinkIcon } from '../../icons/ExternalLink/index.js'
import './index.scss'
import { usePreviewURL } from '../../providers/LivePreview/context.js'
import { useTranslation } from '../../providers/Translation/index.js'

const baseClass = 'preview-btn'

export function PreviewButton(props: PreviewButtonClientProps) {
  const { previewURL } = usePreviewURL()
  const { t } = useTranslation()

  if (!previewURL) {
    return null
  }

  return (
    <a
      aria-label={t('version:preview')}
      className={baseClass}
      href={previewURL}
      id="preview-button"
      target="_blank"
      title={t('version:preview')}
    >
      <ExternalLinkIcon />
    </a>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PreviewSizes/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .preview-sizes {
    margin: base(2) calc(var(--gutter-h) * -1) 0 calc(var(--gutter-h) * -1);
    border-top: 1px solid var(--theme-elevation-150);
    max-height: calc(100vh - base(6));
    height: 100%;
    display: flex;
    flex-direction: row;

    &__imageWrap {
      min-width: 60%;
      border-right: 1px solid var(--theme-elevation-150);
    }

    &__preview {
      max-height: calc(100% - base(6));
      padding: base(1.5) base(1.5) base(1.5) var(--gutter-h);
      object-fit: contain;
    }

    &__meta {
      border-bottom: 1px solid var(--theme-elevation-150);
      padding: base(1) var(--gutter-h);
      display: flex;
      flex-wrap: wrap;
      column-gap: base(1);

      .file-meta {
        display: flex;
        flex-wrap: wrap;
        column-gap: base(1);
        text-wrap: wrap;
        width: 100%;
      }

      .file-meta__url {
        width: 100%;
      }
    }

    &__sizeName,
    .file-meta__size-type {
      color: var(--theme-elevation-600);
    }

    &__listWrap {
      padding-right: var(--gutter-h);
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 0;
      }

      &::after {
        content: '';
        display: block;
        position: sticky;
        bottom: 0;
        left: 0;
        height: base(4);
        width: 100%;
        background: linear-gradient(180deg, transparent 0, var(--theme-bg) 100%);
        pointer-events: none;
      }
    }

    &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: base(0.5);
      margin: 0;
      padding: base(1.5) 0 base(1.5) base(1.5);
    }

    &__sizeOption {
      padding: base(0.5);
      display: flex;
      gap: base(1);
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: var(--theme-elevation-100);
      }
    }

    &--selected {
      background-color: var(--theme-elevation-100);
    }

    &__image {
      display: flex;
      width: 30%;
      min-width: 30%;
      align-items: center;
      justify-content: center;
    }

    &__sizeMeta {
      padding: base(0.5) 0;
    }

    &__sizeName,
    &__sizeMeta {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @include mid-break {
      margin-top: base(1);
      max-height: calc(100vh - base(4));
    }

    @include small-break {
      margin-top: 0;
      max-height: calc(100vh - base(3.5));
      flex-direction: column;
      justify-content: space-between;

      &__imageWrap {
        height: 60%;
        border: none;
      }

      &__list,
      &__preview {
        padding: calc(var(--gutter-h) * 2) var(--gutter-h);
      }

      &__preview {
        max-height: calc(100% - base(4));
      }

      &__sizeOption {
        padding: base(0.25);
      }

      &__listWrap {
        border-top: 1px solid var(--theme-elevation-150);
        height: 40%;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PreviewSizes/index.tsx
Signals: React

```typescript
'use client'
import type { Data, FileSize, SanitizedCollectionConfig, SanitizedUploadConfig } from 'payload'

import React, { useEffect, useMemo, useState } from 'react'

import { FileMeta } from '../FileDetails/FileMeta/index.js'
import './index.scss'

const baseClass = 'preview-sizes'

type FileInfo = {
  url: string
} & FileSize
type FilesSizesWithUrl = {
  [key: string]: FileInfo
}

const sortSizes = (sizes: FilesSizesWithUrl, imageSizes: SanitizedUploadConfig['imageSizes']) => {
  if (!imageSizes || imageSizes.length === 0) {
    return sizes
  }

  const orderedSizes: FilesSizesWithUrl = {}

  imageSizes.forEach(({ name }) => {
    if (sizes[name]) {
      orderedSizes[name] = sizes[name]
    }
  })

  return orderedSizes
}

type PreviewSizeCardProps = {
  active: boolean
  meta: FileInfo
  name: string
  onClick?: () => void
  previewSrc: string
}
const PreviewSizeCard: React.FC<PreviewSizeCardProps> = ({
  name,
  active,
  meta,
  onClick,
  previewSrc,
}) => {
  return (
    <div
      className={[`${baseClass}__sizeOption`, active && `${baseClass}--selected`]
        .filter(Boolean)
        .join(' ')}
      onClick={typeof onClick === 'function' ? onClick : undefined}
      onKeyDown={(e) => {
        if (typeof onClick !== 'function') {
          return
        }
        if (e.key === 'Enter') {
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={`${baseClass}__image`}>
        <img alt={meta.filename} src={previewSrc} />
      </div>
      <div className={`${baseClass}__sizeMeta`}>
        <div className={`${baseClass}__sizeName`}>{name}</div>
        <FileMeta {...meta} />
      </div>
    </div>
  )
}

export type PreviewSizesProps = {
  doc: {
    sizes?: FilesSizesWithUrl
  } & Data
  imageCacheTag?: string
  uploadConfig: SanitizedCollectionConfig['upload']
}

export const PreviewSizes: React.FC<PreviewSizesProps> = ({ doc, imageCacheTag, uploadConfig }) => {
  const { imageSizes } = uploadConfig
  const { sizes } = doc

  const [orderedSizes, setOrderedSizes] = useState<FilesSizesWithUrl>(() =>
    sortSizes(sizes, imageSizes),
  )
  const [selectedSize, setSelectedSize] = useState<null | string>(null)

  const generateImageUrl = (doc) => {
    if (!doc.filename) {
      return null
    }
    if (doc.url) {
      return `${doc.url}${imageCacheTag ? `?${encodeURIComponent(imageCacheTag)}` : ''}`
    }
  }
  useEffect(() => {
    setOrderedSizes(sortSizes(sizes, imageSizes))
  }, [sizes, imageSizes, imageCacheTag])

  const mainPreviewSrc = selectedSize
    ? generateImageUrl(doc.sizes[selectedSize])
    : generateImageUrl(doc)

  const originalImage = useMemo(
    (): FileInfo => ({
      filename: doc.filename,
      filesize: doc.filesize,
      height: doc.height,
      mimeType: doc.mimeType,
      url: doc.url,
      width: doc.width,
    }),
    [doc],
  )
  const originalFilename = 'Original'

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__imageWrap`}>
        <div className={`${baseClass}__meta`}>
          <div className={`${baseClass}__sizeName`}>{selectedSize || originalFilename}</div>
          <FileMeta {...(selectedSize ? orderedSizes[selectedSize] : originalImage)} />
        </div>
        <img alt={doc.filename} className={`${baseClass}__preview`} src={mainPreviewSrc} />
      </div>
      <div className={`${baseClass}__listWrap`}>
        <div className={`${baseClass}__list`}>
          <PreviewSizeCard
            active={!selectedSize}
            meta={originalImage}
            name={originalFilename}
            onClick={() => setSelectedSize(null)}
            previewSrc={generateImageUrl(doc)}
          />

          {Object.entries(orderedSizes).map(([key, val]) => {
            const selected = selectedSize === key
            const previewSrc = generateImageUrl(val)

            if (previewSrc) {
              return (
                <PreviewSizeCard
                  active={selected}
                  key={key}
                  meta={val}
                  name={key}
                  onClick={() => setSelectedSize(key)}
                  previewSrc={previewSrc}
                />
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
