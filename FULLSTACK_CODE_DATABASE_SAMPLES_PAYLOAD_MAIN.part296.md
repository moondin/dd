---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 296
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 296 of 695)

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

---[FILE: getSelectedNode.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/getSelectedNode.ts

```typescript
'use client'
import type { ElementNode, RangeSelection, TextNode } from 'lexical'

import { $isAtNodeEnd } from '@lexical/selection'

export function getSelectedNode(selection: RangeSelection): ElementNode | TextNode {
  const { anchor } = selection
  const { focus } = selection
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  }
  return $isAtNodeEnd(anchor) ? anchorNode : focusNode
}
```

--------------------------------------------------------------------------------

---[FILE: guard.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/guard.ts

```typescript
'use client'

/**
 * @deprecated - remove in 4.0. lexical already exports an isHTMLElement utility
 */
export function isHTMLElement(x: unknown): x is HTMLElement {
  return x instanceof HTMLElement
}
```

--------------------------------------------------------------------------------

---[FILE: joinClasses.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/joinClasses.ts

```typescript
'use client'
export function joinClasses(...args: Array<boolean | null | string | undefined>): string {
  return args.filter(Boolean).join(' ')
}
```

--------------------------------------------------------------------------------

---[FILE: nodeFormat.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/nodeFormat.ts

```typescript
/* eslint-disable perfectionist/sort-objects */
/* eslint-disable regexp/no-obscure-range */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable regexp/no-misleading-unicode-character */
//This copy-and-pasted from lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts

import type { ElementFormatType, TextFormatType, TextModeType } from 'lexical'
export type TextDetailType = 'directionless' | 'unmergable'

// DOM
export const NodeFormat = {
  DOM_ELEMENT_TYPE: 1,
  DOM_TEXT_TYPE: 3,
  // Reconciling
  NO_DIRTY_NODES: 0,
  HAS_DIRTY_NODES: 1,
  FULL_RECONCILE: 2,
  // Text node modes
  IS_NORMAL: 0,
  IS_TOKEN: 1,
  IS_SEGMENTED: 2,
  IS_INERT: 3,
  // Text node formatting
  IS_BOLD: 1,
  IS_ITALIC: 1 << 1,
  IS_STRIKETHROUGH: 1 << 2,
  IS_UNDERLINE: 1 << 3,
  IS_CODE: 1 << 4,
  IS_SUBSCRIPT: 1 << 5,
  IS_SUPERSCRIPT: 1 << 6,
  IS_HIGHLIGHT: 1 << 7,
  // Text node details
  IS_DIRECTIONLESS: 1,
  IS_UNMERGEABLE: 1 << 1,
  // Element node formatting
  IS_ALIGN_LEFT: 1,
  IS_ALIGN_CENTER: 2,
  IS_ALIGN_RIGHT: 3,
  IS_ALIGN_JUSTIFY: 4,
  IS_ALIGN_START: 5,
  IS_ALIGN_END: 6,
} as const

export const IS_ALL_FORMATTING =
  NodeFormat.IS_BOLD |
  NodeFormat.IS_ITALIC |
  NodeFormat.IS_STRIKETHROUGH |
  NodeFormat.IS_UNDERLINE |
  NodeFormat.IS_CODE |
  NodeFormat.IS_SUBSCRIPT |
  NodeFormat.IS_SUPERSCRIPT |
  NodeFormat.IS_HIGHLIGHT

// Reconciliation
export const NON_BREAKING_SPACE = '\u00A0'

export const DOUBLE_LINE_BREAK = '\n\n'

// For FF, we need to use a non-breaking space, or it gets composition
// in a stuck state.

const RTL = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
const LTR =
  'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
  '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
  '\uFE00-\uFE6F\uFEFD-\uFFFF'

// eslint-disable-next-line no-misleading-character-class
export const RTL_REGEX = new RegExp('^[^' + LTR + ']*[' + RTL + ']')
// eslint-disable-next-line no-misleading-character-class
export const LTR_REGEX = new RegExp('^[^' + RTL + ']*[' + LTR + ']')

export const TEXT_TYPE_TO_FORMAT: Record<string | TextFormatType, number> = {
  bold: NodeFormat.IS_BOLD,
  code: NodeFormat.IS_CODE,
  highlight: NodeFormat.IS_HIGHLIGHT,
  italic: NodeFormat.IS_ITALIC,
  strikethrough: NodeFormat.IS_STRIKETHROUGH,
  subscript: NodeFormat.IS_SUBSCRIPT,
  superscript: NodeFormat.IS_SUPERSCRIPT,
  underline: NodeFormat.IS_UNDERLINE,
}

export const DETAIL_TYPE_TO_DETAIL: Record<string | TextDetailType, number> = {
  directionless: NodeFormat.IS_DIRECTIONLESS,
  unmergeable: NodeFormat.IS_UNMERGEABLE,
}

export const ELEMENT_TYPE_TO_FORMAT: Record<Exclude<ElementFormatType, ''>, number> = {
  center: NodeFormat.IS_ALIGN_CENTER,
  end: NodeFormat.IS_ALIGN_END,
  justify: NodeFormat.IS_ALIGN_JUSTIFY,
  left: NodeFormat.IS_ALIGN_LEFT,
  right: NodeFormat.IS_ALIGN_RIGHT,
  start: NodeFormat.IS_ALIGN_START,
}

export const ELEMENT_FORMAT_TO_TYPE: Record<number, ElementFormatType> = {
  [NodeFormat.IS_ALIGN_CENTER]: 'center',
  [NodeFormat.IS_ALIGN_END]: 'end',
  [NodeFormat.IS_ALIGN_JUSTIFY]: 'justify',
  [NodeFormat.IS_ALIGN_LEFT]: 'left',
  [NodeFormat.IS_ALIGN_RIGHT]: 'right',
  [NodeFormat.IS_ALIGN_START]: 'start',
}

export const TEXT_MODE_TO_TYPE: Record<TextModeType, 0 | 1 | 2> = {
  normal: NodeFormat.IS_NORMAL,
  segmented: NodeFormat.IS_SEGMENTED,
  token: NodeFormat.IS_TOKEN,
}

export const TEXT_TYPE_TO_MODE: Record<number, TextModeType> = {
  [NodeFormat.IS_NORMAL]: 'normal',
  [NodeFormat.IS_SEGMENTED]: 'segmented',
  [NodeFormat.IS_TOKEN]: 'token',
}
```

--------------------------------------------------------------------------------

---[FILE: point.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/point.ts

```typescript
'use client'
export class Point {
  private readonly _x: number

  private readonly _y: number

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }

  public calcDeltaXTo({ x }: Point): number {
    return this.x - x
  }

  public calcDeltaYTo({ y }: Point): number {
    return this.y - y
  }

  public calcDistanceTo(point: Point): number {
    return Math.sqrt(Math.pow(this.calcDeltaXTo(point), 2) + Math.pow(this.calcDeltaYTo(point), 2))
  }

  public calcHorizontalDistanceTo(point: Point): number {
    return Math.abs(this.calcDeltaXTo(point))
  }

  public calcVerticalDistance(point: Point): number {
    return Math.abs(this.calcDeltaYTo(point))
  }

  public equals({ x, y }: Point): boolean {
    return this.x === x && this.y === y
  }

  get x(): number {
    return this._x
  }

  get y(): number {
    return this._y
  }
}

export function isPoint(x: unknown): x is Point {
  return x instanceof Point
}
```

--------------------------------------------------------------------------------

---[FILE: rect.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/rect.ts

```typescript
'use client'
import { isPoint, type Point } from './point.js'

interface ContainsPointReturn {
  reason: {
    isOnBottomSide: boolean
    isOnLeftSide: boolean
    isOnRightSide: boolean
    isOnTopSide: boolean
  }
  result: boolean
}

export class Rect {
  private readonly _bottom: number

  private readonly _left: number

  private readonly _right: number

  private readonly _top: number

  constructor(left: number, top: number, right: number, bottom: number) {
    const [physicTop, physicBottom] = top <= bottom ? [top, bottom] : [bottom, top]

    const [physicLeft, physicRight] = left <= right ? [left, right] : [right, left]

    this._top = physicTop
    this._right = physicRight
    this._left = physicLeft
    this._bottom = physicBottom
  }

  static fromDOM(dom: HTMLElement): Rect {
    const { height, left, top, width } = dom.getBoundingClientRect()
    return Rect.fromLWTH(left, width, top, height)
  }

  static fromDOMRect(domRect: DOMRect): Rect {
    const { height, left, top, width } = domRect
    return Rect.fromLWTH(left, width, top, height)
  }

  static fromLTRB(left: number, top: number, right: number, bottom: number): Rect {
    return new Rect(left, top, right, bottom)
  }

  static fromLWTH(left: number, width: number, top: number, height: number): Rect {
    return new Rect(left, top, left + width, top + height)
  }

  static fromPoints(startPoint: Point, endPoint: Point): Rect {
    const { x: left, y: top } = startPoint
    const { x: right, y: bottom } = endPoint
    return Rect.fromLTRB(left, top, right, bottom)
  }

  public contains({ x, y }: Point): ContainsPointReturn

  public contains({ bottom, left, right, top }: Rect): boolean

  public contains(target: Point | Rect): boolean | ContainsPointReturn {
    if (isPoint(target)) {
      const { x, y } = target

      const isOnTopSide = y < this._top
      const isOnBottomSide = y > this._bottom
      const isOnLeftSide = x < this._left
      const isOnRightSide = x > this._right

      const result = !isOnTopSide && !isOnBottomSide && !isOnLeftSide && !isOnRightSide

      return {
        reason: {
          isOnBottomSide,
          isOnLeftSide,
          isOnRightSide,
          isOnTopSide,
        },
        result,
      }
    }
    const { bottom, left, right, top } = target

    return (
      top >= this._top &&
      top <= this._bottom &&
      bottom >= this._top &&
      bottom <= this._bottom &&
      left >= this._left &&
      left <= this._right &&
      right >= this._left &&
      right <= this._right
    )
  }

  public distanceFromPoint(point: Point): {
    distance: number
    isOnBottomSide: boolean
    isOnLeftSide: boolean
    isOnRightSide: boolean
    isOnTopSide: boolean
  } {
    const containsResult = this.contains(point)
    if (containsResult.result) {
      return {
        distance: 0,
        isOnBottomSide: containsResult.reason.isOnBottomSide,
        isOnLeftSide: containsResult.reason.isOnLeftSide,
        isOnRightSide: containsResult.reason.isOnRightSide,
        isOnTopSide: containsResult.reason.isOnTopSide,
      }
    }

    let dx = 0 // Horizontal distance to the closest edge
    let dy = 0 // Vertical distance to the closest edge

    // If the point is to the left of the rectangle
    if (point.x < this._left) {
      dx = this._left - point.x
    }
    // If the point is to the right of the rectangle
    else if (point.x > this._right) {
      dx = point.x - this._right
    }

    // If the point is above the rectangle
    if (point.y < this._top) {
      dy = this._top - point.y
    }
    // If the point is below the rectangle
    else if (point.y > this._bottom) {
      dy = point.y - this._bottom
    }

    // Use the Pythagorean theorem to calculate the distance
    return {
      distance: Math.sqrt(dx * dx + dy * dy),
      isOnBottomSide: point.y > this._bottom,
      isOnLeftSide: point.x < this._left,
      isOnRightSide: point.x > this._right,
      isOnTopSide: point.y < this._top,
    }
  }

  public equals({ bottom, left, right, top }: Rect): boolean {
    return (
      top === this._top && bottom === this._bottom && left === this._left && right === this._right
    )
  }

  public generateNewRect({
    bottom = this.bottom,
    left = this.left,
    right = this.right,
    top = this.top,
  }): Rect {
    return new Rect(left, top, right, bottom)
  }

  public intersectsWith(rect: Rect): boolean {
    const { height: h1, left: x1, top: y1, width: w1 } = rect
    const { height: h2, left: x2, top: y2, width: w2 } = this
    const maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2
    const maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2
    const minX = x1 <= x2 ? x1 : x2
    const minY = y1 <= y2 ? y1 : y2
    return maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2
  }

  get bottom(): number {
    return this._bottom
  }

  get height(): number {
    return Math.abs(this._bottom - this._top)
  }

  get left(): number {
    return this._left
  }

  get right(): number {
    return this._right
  }

  get top(): number {
    return this._top
  }

  get width(): number {
    return Math.abs(this._left - this._right)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: setFloatingElemPosition.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/setFloatingElemPosition.ts

```typescript
'use client'
const VERTICAL_GAP = 10
const HORIZONTAL_OFFSET = 32

// TODO: needs refactoring
// This is supposed to position the floatingElem based on the parent (anchorElem) and the target (targetRect) which is usually the selected text.
// So basically, it positions the floatingElem either below or above the target (targetRect) and aligns it to the left or center of the target (targetRect).
// This is used for positioning the floating toolbar (anchor: richtext editor) and its caret (anchor: floating toolbar)
export function setFloatingElemPosition(args: {
  alwaysDisplayOnTop?: boolean
  anchorElem: HTMLElement
  anchorFlippedOffset?: number // Offset which was added to the anchor (for caret, floating toolbar) if it was flipped
  floatingElem: HTMLElement
  horizontalOffset?: number
  horizontalPosition?: 'center' | 'left'
  specialHandlingForCaret?: boolean
  targetRect: ClientRect | null
  verticalGap?: number
}): number | undefined {
  const {
    alwaysDisplayOnTop = false,
    anchorElem,
    anchorFlippedOffset = 0, // Offset which was added to the anchor (for caret, floating toolbar) if it was flipped
    floatingElem,
    horizontalOffset = HORIZONTAL_OFFSET,
    horizontalPosition = 'left',
    specialHandlingForCaret = false,
    targetRect,
    verticalGap = VERTICAL_GAP,
  } = args
  // Returns the top offset if the target was flipped
  const scrollerElem = anchorElem.parentElement

  if (targetRect === null || scrollerElem == null) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  const anchorElementRect = anchorElem.getBoundingClientRect()
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  let top = targetRect.top - floatingElemRect.height - verticalGap
  let left = targetRect.left - horizontalOffset

  if (horizontalPosition === 'center') {
    // Calculate left to position floatingElem to the horizontal middle of targetRect
    left = targetRect.left + targetRect.width / 2 - floatingElemRect.width / 2
  }

  let addedToTop = 0
  if (!alwaysDisplayOnTop && top < editorScrollerRect.top && !specialHandlingForCaret) {
    addedToTop = floatingElemRect.height + targetRect.height + verticalGap * 2

    top += addedToTop
  }

  if (horizontalPosition === 'center') {
    if (left + floatingElemRect.width > editorScrollerRect.right) {
      left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
    } else if (left < editorScrollerRect.left) {
      left = editorScrollerRect.left + horizontalOffset
    }
  } else {
    if (left + floatingElemRect.width > editorScrollerRect.right) {
      left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
    }
  }

  left -= anchorElementRect.left

  floatingElem.style.opacity = '1'

  if (specialHandlingForCaret && anchorFlippedOffset !== 0) {
    // Floating select toolbar was flipped (positioned below text rather than above). Thus, the caret now needs to be positioned
    // on the other side and rotated.
    top -= anchorElementRect.bottom - anchorFlippedOffset + floatingElemRect.height - 3
    // top += anchorFlippedOffset - anchorElementRect.height - floatingElemRect.height + 2
    floatingElem.style.transform = `translate(${left}px, ${top}px) rotate(180deg)`
  } else {
    top -= anchorElementRect.top

    floatingElem.style.transform = `translate(${left}px, ${top}px)`
  }

  return addedToTop
}
```

--------------------------------------------------------------------------------

---[FILE: setFloatingElemPositionForLinkEditor.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/setFloatingElemPositionForLinkEditor.ts

```typescript
'use client'
const VERTICAL_GAP = 10
const HORIZONTAL_OFFSET = 5

export function setFloatingElemPositionForLinkEditor(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET,
): void {
  const scrollerElem = anchorElem.parentElement

  if (targetRect === null || scrollerElem == null) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  const anchorElementRect = anchorElem.getBoundingClientRect()
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  let top = targetRect.top - verticalGap
  let left = targetRect.left - horizontalOffset

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
  }

  top -= anchorElementRect.top
  left -= anchorElementRect.left

  floatingElem.style.opacity = '1'
  floatingElem.style.transform = `translate(${left}px, ${top}px)`
}
```

--------------------------------------------------------------------------------

---[FILE: swipe.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/swipe.ts

```typescript
'use client'
type Force = [number, number]
type Listener = (force: Force, e: TouchEvent) => void
interface ElementValues {
  handleTouchend: (e: TouchEvent) => void
  handleTouchstart: (e: TouchEvent) => void
  listeners: Set<Listener>
  start: Force | null
}

const elements = new WeakMap<HTMLElement, ElementValues>()

function readTouch(e: TouchEvent): [number, number] | null {
  const touch = e.changedTouches[0]
  if (touch === undefined) {
    return null
  }
  return [touch.clientX, touch.clientY]
}

function addListener(element: HTMLElement, cb: Listener): () => void {
  let elementValues = elements.get(element)
  if (elementValues === undefined) {
    const listeners = new Set<Listener>()
    const handleTouchstart = (e: TouchEvent): void => {
      if (elementValues !== undefined) {
        elementValues.start = readTouch(e)
      }
    }
    const handleTouchend = (e: TouchEvent): void => {
      if (elementValues === undefined) {
        return
      }
      const { start } = elementValues
      if (start === null) {
        return
      }
      const end = readTouch(e)
      for (const listener of listeners) {
        if (end !== null) {
          listener([end[0] - start[0], end[1] - start[1]], e)
        }
      }
    }
    element.addEventListener('touchstart', handleTouchstart)
    element.addEventListener('touchend', handleTouchend)

    elementValues = {
      handleTouchend,
      handleTouchstart,
      listeners,
      start: null,
    }
    elements.set(element, elementValues)
  }
  elementValues.listeners.add(cb)
  return () => {
    deleteListener(element, cb)
  }
}

function deleteListener(element: HTMLElement, cb: Listener): void {
  const elementValues = elements.get(element)
  if (elementValues === undefined) {
    return
  }
  const { listeners } = elementValues
  listeners.delete(cb)
  if (listeners.size === 0) {
    elements.delete(element)
    element.removeEventListener('touchstart', elementValues.handleTouchstart)
    element.removeEventListener('touchend', elementValues.handleTouchend)
  }
}

export function addSwipeLeftListener(
  element: HTMLElement,
  cb: (_force: number, e: TouchEvent) => void,
): () => void {
  return addListener(element, (force, e) => {
    const [x, y] = force
    if (x < 0 && -x > Math.abs(y)) {
      cb(x, e)
    }
  })
}

export function addSwipeRightListener(
  element: HTMLElement,
  cb: (_force: number, e: TouchEvent) => void,
): () => void {
  return addListener(element, (force, e) => {
    const [x, y] = force
    if (x > 0 && x > Math.abs(y)) {
      cb(x, e)
    }
  })
}

export function addSwipeUpListener(
  element: HTMLElement,
  cb: (_force: number, e: TouchEvent) => void,
): () => void {
  return addListener(element, (force, e) => {
    const [x, y] = force
    if (y < 0 && -y > Math.abs(x)) {
      cb(x, e)
    }
  })
}

export function addSwipeDownListener(
  element: HTMLElement,
  cb: (_force: number, e: TouchEvent) => void,
): () => void {
  return addListener(element, (force, e) => {
    const [x, y] = force
    if (y > 0 && y > Math.abs(x)) {
      cb(x, e)
    }
  })
}
```

--------------------------------------------------------------------------------

---[FILE: url.spec.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/url.spec.ts

```typescript
import { jest } from '@jest/globals'
import { absoluteRegExp, relativeOrAnchorRegExp, validateUrl } from './url.js'

describe('Lexical URL Regex Matchers', () => {
  describe('relativeOrAnchorRegExp', () => {
    it('validation for links it should match', async () => {
      const shouldMatch = [
        '/path/to/resource',
        '/file-name.html',
        '/',
        '/dir/',
        '/path.with.dots/',
        '#anchor',
        '#section-title',
        '/path#fragment',
        '/page?id=123',
        '/page?id=123#section',
        '/search?q=test',
        '/?global=true',
      ]

      shouldMatch.forEach((testCase) => {
        expect(relativeOrAnchorRegExp.test(testCase)).toBe(true)
      })
    })

    it('validation for links it should not match', async () => {
      const shouldNotMatch = [
        'match',
        'http://example.com',
        'relative/path',
        'file.html',
        'some#fragment',
        '#',
        '/#',
        '/path/with spaces',
        '',
        'ftp://example.com',
      ]

      shouldNotMatch.forEach((testCase) => {
        expect(relativeOrAnchorRegExp.test(testCase)).not.toBe(true)
      })
    })
  })

  describe('absoluteRegExp', () => {
    it('validation for links it should match', async () => {
      const shouldMatch = [
        'http://example.com',
        'https://example.com',
        'ftp://files.example.com',
        'http://example.com/resource',
        'https://example.com/resource?key=value',
        'http://example.com/resource#anchor',
        'http://www.example.com',
        'https://sub.example.com/path/file',
        'mailto:email@example.com',
        'tel:+1234567890',
        'http://user:pass@example.com',
        'www.example.com',
        'www.example.com/resource',
        'www.example.com/resource?query=1',
        'www.example.com#fragment',
      ]

      shouldMatch.forEach((testCase) => {
        expect(absoluteRegExp.test(testCase)).toBe(true)
      })
    })

    it('validation for links it should not match', async () => {
      const shouldNotMatch = [
        '/relative/path',
        '#anchor',
        'example.com',
        '://missing.scheme',
        'http://',
        'http:/example.com',
        'ftp://example .com',
        'http://example',
        'not-a-url',
        'http//example.com',
        'https://example.com/ spaces',
      ]

      shouldNotMatch.forEach((testCase) => {
        expect(absoluteRegExp.test(testCase)).not.toBe(true)
      })
    })
  })

  describe('validateUrl', () => {
    describe('absolute URLs', () => {
      it('should validate http and https URLs', () => {
        const validUrls = [
          'http://example.com',
          'https://example.com',
          'http://www.example.com',
          'https://sub.example.com/path/file',
          'http://example.com/resource',
          'https://example.com/resource?key=value',
          'http://example.com/resource#anchor',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })

      it('should validate other protocol URLs', () => {
        const validUrls = ['ftp://files.example.com', 'mailto:email@example.com', 'tel:+1234567890']

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })

      it('should validate www URLs without protocol', () => {
        const validUrls = [
          'www.example.com',
          'www.example.com/resource',
          'www.example.com/resource?query=1',
          'www.example.com#fragment',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })
    })

    describe('relative URLs', () => {
      it('should validate relative paths', () => {
        const validUrls = [
          '/path/to/resource',
          '/file-name.html',
          '/',
          '/dir/',
          '/path.with.dots/',
          '/path#fragment',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })
    })

    describe('anchor links', () => {
      it('should validate anchor links', () => {
        const validUrls = ['#anchor', '#section-title']

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })
    })

    describe('with query params', () => {
      it('should validate relative URLs with query parameters', () => {
        const validUrls = [
          '/page?id=123',
          '/search?q=test',
          '/products?category=electronics&sort=price',
          '/path?key=value&another=param',
          '/page?id=123&filter=active',
          '/?global=true',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })

      it('should validate absolute URLs with query parameters', () => {
        const validUrls = [
          'https://example.com?id=123',
          'http://example.com/page?key=value',
          'www.example.com?search=query',
          'https://example.com/path?a=1&b=2&c=3',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })

      it('should validate URLs with query parameters and anchors', () => {
        const validUrls = [
          '/page?id=123#section',
          'https://example.com?key=value#anchor',
          '/search?q=test#results',
        ]

        validUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(true)
        })
      })
    })

    describe('edge cases', () => {
      it('should handle the default https:// case', () => {
        expect(validateUrl('https://')).toBe(true)
      })

      it('should return false for empty or invalid URLs', () => {
        const invalidUrls = [
          '',
          'not-a-url',
          'example.com',
          'relative/path',
          'file.html',
          'some#fragment',
          'http://',
          'http:/example.com',
          'http//example.com',
        ]

        invalidUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(false)
        })
      })

      it('should return false for URLs with spaces', () => {
        const invalidUrls = [
          '/path/with spaces',
          'http://example.com/ spaces',
          'https://example.com/path with spaces',
        ]

        invalidUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(false)
        })
      })

      it('should return false for malformed URLs', () => {
        const invalidUrls = ['://missing.scheme', 'ftp://example .com', 'http://example', '#', '/#']

        invalidUrls.forEach((url) => {
          expect(validateUrl(url)).toBe(false)
        })
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: url.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/url.ts

```typescript
export function sanitizeUrl(url: string): string {
  /** A pattern that matches safe  URLs. */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi

  /** A pattern that matches safe data URLs. */
  const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z\d+/]+=*$/i

  url = String(url).trim()

  if (url.match(SAFE_URL_PATTERN) != null || url.match(DATA_URL_PATTERN) != null) {
    return url
  }

  return 'https://'
}

/**
 * This regex checks for absolute URLs in a string. Tested for the following use cases:
 * - http://example.com
 * - https://example.com
 * - ftp://files.example.com
 * - http://example.com/resource
 * - https://example.com/resource?key=value
 * - http://example.com/resource#anchor
 * - http://www.example.com
 * - https://sub.example.com/path/file
 * - mailto:
 */
export const absoluteRegExp =
  /^(?:[a-zA-Z][a-zA-Z\d+.-]*:(?:\/\/)?(?:[-;:&=+$,\w]+@)?[A-Za-z\d]+(?:\.[A-Za-z\d]+)+|www\.[A-Za-z\d]+(?:\.[A-Za-z\d]+)+|(?:tel|mailto):[\w+.-]+)(?:\/[+~%/\w-]*)?(?:\?[-;&=%\w]*)?(?:#\w+)?$/

/**
 * This regex checks for relative URLs starting with / or anchor links starting with # in a string. Tested for the following use cases:
 * - /privacy-policy
 * - /privacy-policy#primary-terms
 * - #primary-terms
 * - /page?id=123
 * - /page?id=123#section
 *  */
export const relativeOrAnchorRegExp = /^(?:\/[\w\-./]*(?:\?[-;&=%\w]*)?(?:#[\w-]+)?|#[\w\-]+)$/

/**
 * Prevents unreasonable URLs from being inserted into the editor.
 * @param url
 */
export function validateUrlMinimal(url: string): boolean {
  if (!url) {
    return false
  }

  return !url.includes(' ')
}

// Do not keep validateUrl function too loose. This is run when pasting in text, to determine if links are in that text and if it should create AutoLinkNodes.
// This is why we do not allow stuff like anchors here, as we don't want copied anchors to be turned into AutoLinkNodes.
export function validateUrl(url: string): boolean {
  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  if (!url) {
    return false
  }

  // Reject URLs with spaces
  if (url.includes(' ')) {
    return false
  }

  // Reject malformed protocol URLs (e.g., http:/example.com instead of http://example.com)
  if (/^[a-z][a-z\d+.-]*:\/[^/]/i.test(url)) {
    return false
  }

  if (url === 'https://') {
    return true
  }

  // This makes sure URLs starting with www. instead of https are valid too
  if (absoluteRegExp.test(url)) {
    return true
  }

  // Check relative or anchor links
  if (relativeOrAnchorRegExp.test(url)) {
    return true
  }

  // While this doesn't allow URLs starting with www (which is why we use the regex above), it does properly handle tel: URLs
  try {
    const urlObj = new URL(url)
    // For http/https/ftp protocols, require a proper domain with at least one dot (for TLD)
    if (['ftp:', 'http:', 'https:'].includes(urlObj.protocol)) {
      if (!urlObj.hostname.includes('.')) {
        return false
      }
    }
    return true
  } catch {
    /* empty */
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: createBlockNode.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical/utils/markdown/createBlockNode.ts

```typescript
import type { ElementNode } from 'lexical'

import type { ElementTransformer } from '../../../packages/@lexical/markdown/MarkdownTransformers.js'

export const createBlockNode = (
  createNode: (match: Array<string>) => ElementNode,
): ElementTransformer['replace'] => {
  return (parentNode, children, match) => {
    const node = createNode(match)
    if (node) {
      node.append(...children)
      parentNode.replace(node)
      node.select(0, 0)
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: @lexical-headless.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-headless.ts

```typescript
export * from '@lexical/headless'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-html.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-html.ts

```typescript
export * from '@lexical/html'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-link.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-link.ts

```typescript
export * from '@lexical/link'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-list.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-list.ts

```typescript
export * from '@lexical/list'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-mark.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-mark.ts

```typescript
export * from '@lexical/mark'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-markdown.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-markdown.ts

```typescript
export * from '../packages/@lexical/markdown/index.js'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-rich-text.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-rich-text.ts

```typescript
export * from '@lexical/rich-text'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-selection.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-selection.ts

```typescript
export * from '@lexical/selection'
```

--------------------------------------------------------------------------------

---[FILE: @lexical-utils.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-utils.ts

```typescript
export * from '@lexical/utils'
```

--------------------------------------------------------------------------------

---[FILE: lexical.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/lexical.ts

```typescript
export * from 'lexical'
```

--------------------------------------------------------------------------------

---[FILE: LexicalAutoEmbedPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalAutoEmbedPlugin.tsx

```typescript
export * from '@lexical/react/LexicalAutoEmbedPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalAutoFocusPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalAutoFocusPlugin.ts

```typescript
export * from '@lexical/react/LexicalAutoFocusPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalAutoLinkPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalAutoLinkPlugin.ts

```typescript
export * from '@lexical/react/LexicalAutoLinkPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalBlockWithAlignableContents.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalBlockWithAlignableContents.tsx

```typescript
export * from '@lexical/react/LexicalBlockWithAlignableContents'
```

--------------------------------------------------------------------------------

---[FILE: LexicalCharacterLimitPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalCharacterLimitPlugin.tsx

```typescript
export * from '@lexical/react/LexicalCharacterLimitPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalCheckListPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalCheckListPlugin.tsx

```typescript
export * from '@lexical/react/LexicalCheckListPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalClearEditorPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalClearEditorPlugin.ts

```typescript
export * from '@lexical/react/LexicalClearEditorPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalClickableLinkPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalClickableLinkPlugin.tsx

```typescript
export * from '@lexical/react/LexicalClickableLinkPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalCollaborationContext.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalCollaborationContext.ts

```typescript
export * from '@lexical/react/LexicalCollaborationContext'
```

--------------------------------------------------------------------------------

---[FILE: LexicalCollaborationPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalCollaborationPlugin.tsx

```typescript
export * from '@lexical/react/LexicalCollaborationPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalComposer.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalComposer.tsx

```typescript
export * from '@lexical/react/LexicalComposer'
```

--------------------------------------------------------------------------------

---[FILE: LexicalComposerContext.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalComposerContext.ts

```typescript
export * from '@lexical/react/LexicalComposerContext'
```

--------------------------------------------------------------------------------

---[FILE: LexicalContentEditable.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalContentEditable.tsx

```typescript
export * from '@lexical/react/LexicalContentEditable'
```

--------------------------------------------------------------------------------

---[FILE: LexicalContextMenuPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalContextMenuPlugin.tsx

```typescript
export * from '@lexical/react/LexicalContextMenuPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalDecoratorBlockNode.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalDecoratorBlockNode.ts

```typescript
export * from '@lexical/react/LexicalDecoratorBlockNode'
```

--------------------------------------------------------------------------------

---[FILE: LexicalDraggableBlockPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalDraggableBlockPlugin.tsx

```typescript
export * from '@lexical/react/LexicalDraggableBlockPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalEditorRefPlugin.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalEditorRefPlugin.tsx

```typescript
export * from '@lexical/react/LexicalEditorRefPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalErrorBoundary.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalErrorBoundary.tsx

```typescript
export * from '@lexical/react/LexicalErrorBoundary'
```

--------------------------------------------------------------------------------

---[FILE: LexicalHashtagPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalHashtagPlugin.ts

```typescript
export * from '@lexical/react/LexicalHashtagPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalHistoryPlugin.ts]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalHistoryPlugin.ts

```typescript
export * from '@lexical/react/LexicalHistoryPlugin'
```

--------------------------------------------------------------------------------

---[FILE: LexicalHorizontalRuleNode.tsx]---
Location: payload-main/packages/richtext-lexical/src/lexical-proxy/@lexical-react/LexicalHorizontalRuleNode.tsx

```typescript
export * from '@lexical/react/LexicalHorizontalRuleNode'
```

--------------------------------------------------------------------------------

````
