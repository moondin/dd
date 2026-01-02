---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 372
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 372 of 695)

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
Location: payload-main/packages/ui/src/elements/Gutter/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import './index.scss'

export type GutterProps = {
  children: React.ReactNode
  className?: string
  left?: boolean
  negativeLeft?: boolean
  negativeRight?: boolean
  ref?: React.RefObject<HTMLDivElement>
  right?: boolean
}

const baseClass = 'gutter'

export const Gutter: React.FC<GutterProps> = (props) => {
  const {
    children,
    className,
    left = true,
    negativeLeft = false,
    negativeRight = false,
    ref,
    right = true,
  } = props

  const shouldPadLeft = left && !negativeLeft
  const shouldPadRight = right && !negativeRight

  return (
    <div
      className={[
        baseClass,
        shouldPadLeft && `${baseClass}--left`,
        shouldPadRight && `${baseClass}--right`,
        negativeLeft && `${baseClass}--negative-left`,
        negativeRight && `${baseClass}--negative-right`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Hamburger/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .hamburger {
    padding: 0;
    border: 0;
    cursor: pointer;
    background-color: var(--theme-bg);
    outline: none;
    position: relative;
    color: var(--theme-text);
    box-shadow: 0px 0px 0px 1px var(--theme-elevation-150);
    padding: base(0.1);
    border-radius: 3px;
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    transition-property: box-shadow, background-color;
    transition-duration: 100ms;
    transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
    --hamburger-size: var(--base);

    &:hover {
      background-color: var(--theme-elevation-100);
      box-shadow: 0px 0px 0px 1px var(--theme-elevation-500);
    }

    &:focus {
      outline: none;
    }

    &::after {
      z-index: -1;
    }

    &__open-icon,
    &__close-icon {
      width: var(--hamburger-size);
      height: var(--hamburger-size);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Hamburger/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import { ChevronIcon } from '../../icons/Chevron/index.js'
import { CloseMenuIcon } from '../../icons/CloseMenu/index.js'
import { MenuIcon } from '../../icons/Menu/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import './index.scss'

const baseClass = 'hamburger'

export const Hamburger: React.FC<{
  readonly closeIcon?: 'collapse' | 'x'
  readonly isActive?: boolean
}> = (props) => {
  const { t } = useTranslation()
  const { closeIcon = 'x', isActive = false } = props

  return (
    <div className={baseClass}>
      {!isActive && (
        <div
          aria-label={t('general:open')}
          className={`${baseClass}__open-icon`}
          title={t('general:open')}
        >
          <MenuIcon />
        </div>
      )}
      {isActive && (
        <div
          aria-label={closeIcon === 'collapse' ? t('general:collapse') : t('general:close')}
          className={`${baseClass}__close-icon`}
          title={closeIcon === 'collapse' ? t('general:collapse') : t('general:close')}
        >
          {closeIcon === 'x' && <CloseMenuIcon />}
          {closeIcon === 'collapse' && <ChevronIcon direction="left" />}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: colors.scss]---
Location: payload-main/packages/ui/src/elements/HTMLDiff/colors.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  :root {
    --diff-delete-pill-bg: var(--theme-error-200);
    --diff-delete-pill-color: var(--theme-error-600);
    --diff-delete-pill-border: var(--theme-error-400);
    --diff-delete-parent-bg: var(--theme-error-100);
    --diff-delete-parent-color: var(--theme-error-800);
    --diff-delete-link-color: var(--theme-error-600);

    --diff-create-pill-bg: var(--theme-success-200);
    --diff-create-pill-color: var(--theme-success-600);
    --diff-create-pill-border: var(--theme-success-400);
    --diff-create-parent-bg: var(--theme-success-100);
    --diff-create-parent-color: var(--theme-success-800);
    --diff-create-link-color: var(--theme-success-600);
  }

  html[data-theme='dark'] {
    --diff-delete-pill-bg: var(--theme-error-200);
    --diff-delete-pill-color: var(--theme-error-650);
    --diff-delete-pill-border: var(--theme-error-400);
    --diff-delete-parent-bg: var(--theme-error-100);
    --diff-delete-parent-color: var(--theme-error-900);
    --diff-delete-link-color: var(--theme-error-750);

    --diff-create-pill-bg: var(--theme-success-200);
    --diff-create-pill-color: var(--theme-success-650);
    --diff-create-pill-border: var(--theme-success-400);
    --diff-create-parent-bg: var(--theme-success-100);
    --diff-create-parent-color: var(--theme-success-900);
    --diff-create-link-color: var(--theme-success-750);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/HTMLDiff/index.scss

```text
@import '../../scss/styles.scss';
@import './colors.scss';

@layer payload-default {
  .html-diff {
    font-size: base(0.7);
    letter-spacing: 0.02em;

    &-no-value {
      color: var(--theme-elevation-400);
    }

    pre {
      margin-top: 0;
      margin-bottom: 0;
    }

    // Apply background color to parents that have children with diffs
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    blockquote,
    pre,
    h6 {
      &:not([data-enable-match='false']) {
        &:has([data-match-type='create']) {
          position: relative;
          z-index: 1;
          &::before {
            content: '';
            position: absolute;
            top: -(base(0.5));
            bottom: -(base(0.5));
            left: -10px;
            right: -(base(0.5));
            display: block;
            background-color: var(--diff-create-parent-bg);
            color: var(--diff-create-parent-color);
            z-index: -1; /* Place behind the text */
          }
        }

        &:has([data-match-type='delete']) {
          position: relative;
          z-index: 1;
          &::before {
            content: '';
            position: absolute;
            top: -(base(0.5));
            bottom: -(base(0.5));
            left: -(base(0.5));
            right: -10px;
            display: block;
            background-color: var(--diff-delete-parent-bg);
            color: var(--diff-delete-parent-color);
            z-index: -1; /* Place behind the text */
          }
        }
      }
    }

    li {
      &:not([data-enable-match='false']) {
        &:has([data-match-type='create']) {
          position: relative;
          z-index: 1;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: -10px;
            right: -(base(0.5));
            display: block;
            background-color: var(--diff-create-parent-bg);
            color: var(--diff-create-parent-color);
            z-index: -1; /* Place behind the text */
          }
        }

        &:has([data-match-type='delete']) {
          position: relative;
          z-index: 1;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: -(base(0.5));
            right: -10px;
            display: block;
            background-color: var(--diff-delete-parent-bg);
            color: var(--diff-delete-parent-color);
            z-index: -1; /* Place behind the text */
          }
        }
      }
    }

    li::marker {
      color: var(--theme-text);
    }

    [data-match-type='delete']:not([data-enable-match='false']):not(
        :is([data-enable-match='false'] *)
      ) {
      color: var(--diff-delete-pill-color);
      text-decoration-color: var(--diff-delete-pill-color);
      text-decoration-line: line-through;
      background-color: var(--diff-delete-pill-bg);
      border-radius: 4px;
      text-decoration-thickness: 1px;
    }

    a[data-match-type='delete']
      :not([data-enable-match='false'])
      :not(:is([data-enable-match='false'] *)) {
      color: var(--diff-delete-link-color);
    }

    // :not(img) required to increase specificity
    a[data-match-type='create']:not(img)
      :not([data-enable-match='false'])
      :not(:is([data-enable-match='false'] *)) {
      color: var(--diff-create-link-color);
    }

    [data-match-type='create']:not(img):not([data-enable-match='false']):not(
        :is([data-enable-match='false'] *)
      ) {
      background-color: var(--diff-create-pill-bg);
      color: var(--diff-create-pill-color);
      border-radius: 4px;
    }

    .html-diff {
      &-create-inline-wrapper,
      &-delete-inline-wrapper {
        display: inline-flex;
      }

      &-create-block-wrapper,
      &-delete-block-wrapper {
        display: flex;
      }

      &-create-inline-wrapper,
      &-delete-inline-wrapper,
      &-create-block-wrapper,
      &-delete-block-wrapper {
        position: relative;
        align-items: center;
        flex-direction: row;

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 100%;
          content: '';
        }
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/HTMLDiff/index.tsx
Signals: React

```typescript
import React from 'react'

import { HtmlDiff } from './diff/index.js'
import './index.scss'

const baseClass = 'html-diff'

export const getHTMLDiffComponents = ({
  fromHTML,
  toHTML,
  tokenizeByCharacter,
}: {
  fromHTML: string
  toHTML: string
  tokenizeByCharacter?: boolean
}): {
  From: React.ReactNode
  To: React.ReactNode
} => {
  const diffHTML = new HtmlDiff(fromHTML, toHTML, {
    tokenizeByCharacter,
  })

  const [oldHTML, newHTML] = diffHTML.getSideBySideContents()

  const From = oldHTML ? (
    <div
      className={`${baseClass}__diff-old html-diff`}
      dangerouslySetInnerHTML={{ __html: oldHTML }}
    />
  ) : null

  const To = newHTML ? (
    <div
      className={`${baseClass}__diff-new html-diff`}
      dangerouslySetInnerHTML={{ __html: newHTML }}
    />
  ) : null

  return { From, To }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/elements/HTMLDiff/diff/index.ts

```typescript
// Taken and modified from https://github.com/Arman19941113/html-diff/blob/master/packages/html-diff/src/index.ts

interface MatchedBlock {
  newEnd: number
  newStart: number
  oldEnd: number
  oldStart: number
  size: number
}

interface Operation {
  /**
   * Index of entry in tokenized token list
   */
  newEnd: number
  newStart: number
  oldEnd: number
  oldStart: number
  type: 'create' | 'delete' | 'equal' | 'replace'
}

type BaseOpType = 'create' | 'delete'

interface HtmlDiffConfig {
  classNames: {
    createBlock: string
    createInline: string
    deleteBlock: string
    deleteInline: string
  }
  greedyBoundary: number
  greedyMatch: boolean
  minMatchedSize: number
}

export interface HtmlDiffOptions {
  /**
   * The classNames for wrapper DOM.
   * Use this to configure your own styles without importing the built-in CSS file
   */
  classNames?: Partial<{
    createBlock?: string
    createInline?: string
    deleteBlock?: string
    deleteInline?: string
  }>
  /**
   * @defaultValue 1000
   */
  greedyBoundary?: number
  /**
   * When greedyMatch is enabled, if the length of the sub-tokens exceeds greedyBoundary,
   * we will use the matched sub-tokens that are sufficiently good, even if they are not optimal, to enhance performance.
   * @defaultValue true
   */
  greedyMatch?: boolean
  /**
   * Determine the minimum threshold for calculating common sub-tokens.
   * You may adjust it to a value larger than 2, but not lower, due to the potential inclusion of HTML tags in the count.
   * @defaultValue 2
   */
  minMatchedSize?: number
  /**
   * Whether to tokenize by character or by word.
   * @defaultValue false
   */
  tokenizeByCharacter?: boolean
}

// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
const htmlStartTagReg = /^<(?<name>[^\s/>]+)[^>]*>$/
// eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
const htmlTagWithNameReg = /^<(?<isEnd>\/)?(?<name>[^\s>]+)[^>]*>$/

const htmlTagReg = /^<[^>]+>/
const htmlImgTagReg = /^<img[^>]*>$/
const htmlVideoTagReg = /^<video[^>]*>.*?<\/video>$/ms

export class HtmlDiff {
  private readonly config: HtmlDiffConfig
  private leastCommonLength: number = Infinity
  private readonly matchedBlockList: MatchedBlock[] = []
  private readonly newTokens: string[] = []
  private readonly oldTokens: string[] = []
  private readonly operationList: Operation[] = []
  private sideBySideContents?: [string, string]
  private unifiedContent?: string

  constructor(
    oldHtml: string,
    newHtml: string,
    {
      classNames = {
        createBlock: 'html-diff-create-block-wrapper',
        createInline: 'html-diff-create-inline-wrapper',
        deleteBlock: 'html-diff-delete-block-wrapper',
        deleteInline: 'html-diff-delete-inline-wrapper',
      },
      greedyBoundary = 1000,
      greedyMatch = true,
      minMatchedSize = 2,
      tokenizeByCharacter = false,
    }: HtmlDiffOptions = {},
  ) {
    // init config
    this.config = {
      classNames: {
        createBlock: 'html-diff-create-block-wrapper',
        createInline: 'html-diff-create-inline-wrapper',
        deleteBlock: 'html-diff-delete-block-wrapper',
        deleteInline: 'html-diff-delete-inline-wrapper',
        ...classNames,
      },
      greedyBoundary,
      greedyMatch,
      minMatchedSize,
    }
    // white space is junk
    oldHtml = oldHtml.trim()
    newHtml = newHtml.trim()

    // no need to diff
    if (oldHtml === newHtml) {
      this.unifiedContent = oldHtml
      let equalSequence = 0
      // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
      const content = oldHtml.replace(/<([^\s/>]+)[^>]*>/g, (match: string, name: string) => {
        const tagNameLength = name.length + 1
        return `${match.slice(0, tagNameLength)} data-seq="${++equalSequence}"${match.slice(tagNameLength)}`
      })
      this.sideBySideContents = [content, content]
      return
    }

    // step1: split HTML to tokens(atomic tokens)
    const tokenizeFn = tokenizeByCharacter ? this.tokenizeByCharacter : this.tokenizeByWord
    this.oldTokens = tokenizeFn(oldHtml)
    this.newTokens = tokenizeFn(newHtml)
    // step2: find matched blocks
    this.matchedBlockList = this.getMatchedBlockList()

    // step3: generate operation list
    this.operationList = this.getOperationList()
  }

  // Find the longest matched block between tokens
  private computeBestMatchedBlock(
    oldStart: number,
    oldEnd: number,
    newStart: number,
    newEnd: number,
  ): MatchedBlock | null {
    let bestMatchedBlock = null
    for (let i = oldStart; i < oldEnd; i++) {
      const len = Math.min(oldEnd - i, newEnd - newStart)
      const ret = this.slideBestMatchedBlock(i, newStart, len)
      if (ret && (!bestMatchedBlock || ret.size > bestMatchedBlock.size)) {
        bestMatchedBlock = ret
        if (ret.size > this.leastCommonLength) {
          return bestMatchedBlock
        }
      }
    }
    for (let j = newStart; j < newEnd; j++) {
      const len = Math.min(oldEnd - oldStart, newEnd - j)
      const ret = this.slideBestMatchedBlock(oldStart, j, len)
      if (ret && (!bestMatchedBlock || ret.size > bestMatchedBlock.size)) {
        bestMatchedBlock = ret
        if (ret.size > this.leastCommonLength) {
          return bestMatchedBlock
        }
      }
    }
    return bestMatchedBlock
  }

  private computeMatchedBlockList(
    oldStart: number,
    oldEnd: number,
    newStart: number,
    newEnd: number,
    matchedBlockList: MatchedBlock[] = [],
  ): MatchedBlock[] {
    const matchBlock = this.computeBestMatchedBlock(oldStart, oldEnd, newStart, newEnd)

    if (!matchBlock) {
      return []
    }

    if (oldStart < matchBlock.oldStart && newStart < matchBlock.newStart) {
      this.computeMatchedBlockList(
        oldStart,
        matchBlock.oldStart,
        newStart,
        matchBlock.newStart,
        matchedBlockList,
      )
    }
    matchedBlockList.push(matchBlock)
    if (oldEnd > matchBlock.oldEnd && newEnd > matchBlock.newEnd) {
      this.computeMatchedBlockList(
        matchBlock.oldEnd,
        oldEnd,
        matchBlock.newEnd,
        newEnd,
        matchedBlockList,
      )
    }
    return matchedBlockList
  }

  private dressUpBlockTag(type: BaseOpType, token: string): string {
    if (type === 'create') {
      return `<div class="${this.config.classNames.createBlock}">${token}</div>`
    }
    if (type === 'delete') {
      return `<div class="${this.config.classNames.deleteBlock}">${token}</div>`
    }
    return ''
  }

  private dressUpDiffContent(type: BaseOpType, tokens: string[]): string {
    const tokensLength = tokens.length
    if (!tokensLength) {
      return ''
    }

    let result = ''
    let textStartIndex = 0
    let i = -1
    for (const token of tokens) {
      i++

      // If this is true, this HTML should be diffed as well - not just its children
      const isMatchElement = token.includes('data-enable-match="true"')
      const isMatchExplicitlyDisabled = token.includes('data-enable-match="false"')
      const isHtmlTag = !!token.match(htmlTagReg)?.length

      if (isMatchExplicitlyDisabled) {
        textStartIndex = i + 1
        result += token
      }
      // this token is html tag
      else if (!isMatchElement && isHtmlTag) {
        // handle text tokens before
        if (i > textStartIndex) {
          result += this.dressUpText(type, tokens.slice(textStartIndex, i))
        }
        // handle this tag
        textStartIndex = i + 1
        if (token.match(htmlVideoTagReg)) {
          result += this.dressUpBlockTag(type, token)
        } /* else if ([htmlImgTagReg].some((item) => token.match(item))) {
          result += this.dressUpInlineTag(type, token)
        }*/ else {
          result += token
        }
      } else if (isMatchElement && isHtmlTag) {
        // handle text tokens before
        if (i > textStartIndex) {
          result += this.dressUpText(type, tokens.slice(textStartIndex, i))
        }

        // handle this tag
        textStartIndex = i + 1
        // Add data-match-type to the tag that can be styled
        const newToken = this.dressupMatchEnabledHtmlTag(type, token)

        result += newToken
      }
    }
    if (textStartIndex < tokensLength) {
      result += this.dressUpText(type, tokens.slice(textStartIndex))
    }
    return result
  }

  private dressUpInlineTag(type: BaseOpType, token: string): string {
    if (type === 'create') {
      return `<span class="${this.config.classNames.createInline}">${token}</span>`
    }
    if (type === 'delete') {
      return `<span class="${this.config.classNames.deleteInline}">${token}</span>`
    }
    return ''
  }

  private dressupMatchEnabledHtmlTag(type: BaseOpType, token: string): string {
    // token is a single html tag, e.g. <a data-enable-match="true" href="https://2" rel=undefined target=undefined>
    // add data-match-type to the tag
    const tagName = token.match(htmlStartTagReg)?.groups?.name
    if (!tagName) {
      return token
    }
    const tagNameLength = tagName.length + 1
    const matchType = type === 'create' ? 'create' : 'delete'
    return `${token.slice(0, tagNameLength)} data-match-type="${matchType}"${token.slice(
      tagNameLength,
      token.length,
    )}`
  }

  private dressUpText(type: BaseOpType, tokens: string[]): string {
    const text = tokens.join('')
    if (!text.trim()) {
      return ''
    }
    if (type === 'create') {
      return `<span data-match-type="create">${text}</span>`
    }
    if (type === 'delete') {
      return `<span data-match-type="delete">${text}</span>`
    }
    return ''
  }

  /**
   * Generates a list of token entries that are matched between the old and new HTML. This list will not
   * include token ranges that differ.
   */
  private getMatchedBlockList(): MatchedBlock[] {
    const n1 = this.oldTokens.length
    const n2 = this.newTokens.length

    // 1. sync from start
    let start: MatchedBlock | null = null
    let i = 0
    while (i < n1 && i < n2 && this.oldTokens[i] === this.newTokens[i]) {
      i++
    }
    if (i >= this.config.minMatchedSize) {
      start = {
        newEnd: i,
        newStart: 0,
        oldEnd: i,
        oldStart: 0,
        size: i,
      }
    }

    // 2. sync from end
    let end: MatchedBlock | null = null
    let e1 = n1 - 1
    let e2 = n2 - 1
    while (i <= e1 && i <= e2 && this.oldTokens[e1] === this.newTokens[e2]) {
      e1--
      e2--
    }
    const size = n1 - 1 - e1
    if (size >= this.config.minMatchedSize) {
      end = {
        newEnd: n2,
        newStart: e2 + 1,
        oldEnd: n1,
        oldStart: e1 + 1,
        size,
      }
    }

    // 3. handle rest
    const oldStart = start ? i : 0
    const oldEnd = end ? e1 + 1 : n1
    const newStart = start ? i : 0
    const newEnd = end ? e2 + 1 : n2
    // optimize for large tokens
    if (this.config.greedyMatch) {
      const commonLength = Math.min(oldEnd - oldStart, newEnd - newStart)
      if (commonLength > this.config.greedyBoundary) {
        this.leastCommonLength = Math.floor(commonLength / 3)
      }
    }
    const ret = this.computeMatchedBlockList(oldStart, oldEnd, newStart, newEnd)
    if (start) {
      ret.unshift(start)
    }
    if (end) {
      ret.push(end)
    }

    return ret
  }

  // Generate operation list by matchedBlockList
  private getOperationList(): Operation[] {
    const operationList: Operation[] = []
    let walkIndexOld = 0
    let walkIndexNew = 0
    for (const matchedBlock of this.matchedBlockList) {
      const isOldStartIndexMatched = walkIndexOld === matchedBlock.oldStart
      const isNewStartIndexMatched = walkIndexNew === matchedBlock.newStart
      const operationBase = {
        newEnd: matchedBlock.newStart,
        newStart: walkIndexNew,
        oldEnd: matchedBlock.oldStart,
        oldStart: walkIndexOld,
      }
      if (!isOldStartIndexMatched && !isNewStartIndexMatched) {
        operationList.push(Object.assign(operationBase, { type: 'replace' as const }))
      } else if (isOldStartIndexMatched && !isNewStartIndexMatched) {
        operationList.push(Object.assign(operationBase, { type: 'create' as const }))
      } else if (!isOldStartIndexMatched && isNewStartIndexMatched) {
        operationList.push(Object.assign(operationBase, { type: 'delete' as const }))
      }

      operationList.push({
        type: 'equal',
        newEnd: matchedBlock.newEnd,
        newStart: matchedBlock.newStart,
        oldEnd: matchedBlock.oldEnd,
        oldStart: matchedBlock.oldStart,
      })
      walkIndexOld = matchedBlock.oldEnd
      walkIndexNew = matchedBlock.newEnd
    }
    // handle the tail content
    const maxIndexOld = this.oldTokens.length
    const maxIndexNew = this.newTokens.length
    const tailOperationBase = {
      newEnd: maxIndexNew,
      newStart: walkIndexNew,
      oldEnd: maxIndexOld,
      oldStart: walkIndexOld,
    }
    const isOldFinished = walkIndexOld === maxIndexOld
    const isNewFinished = walkIndexNew === maxIndexNew
    if (!isOldFinished && !isNewFinished) {
      operationList.push(Object.assign(tailOperationBase, { type: 'replace' as const }))
    } else if (isOldFinished && !isNewFinished) {
      operationList.push(Object.assign(tailOperationBase, { type: 'create' as const }))
    } else if (!isOldFinished && isNewFinished) {
      operationList.push(Object.assign(tailOperationBase, { type: 'delete' as const }))
    }
    return operationList
  }

  private slideBestMatchedBlock(addA: number, addB: number, len: number): MatchedBlock | null {
    let maxSize = 0
    let bestMatchedBlock: MatchedBlock | null = null

    let continuousSize = 0
    for (let i = 0; i < len; i++) {
      if (this.oldTokens[addA + i] === this.newTokens[addB + i]) {
        continuousSize++
      } else {
        continuousSize = 0
      }
      if (continuousSize > maxSize) {
        maxSize = continuousSize
        bestMatchedBlock = {
          newEnd: addB + i + 1,
          newStart: addB + i - continuousSize + 1,
          oldEnd: addA + i + 1,
          oldStart: addA + i - continuousSize + 1,
          size: continuousSize,
        }
      }
    }

    return maxSize >= this.config.minMatchedSize ? bestMatchedBlock : null
  }

  /**
   * Convert HTML to tokens at character level, preserving HTML tags as complete tokens
   * @example
   * tokenize("<a> Hello World </a>")
   * ["<a>", " ", "H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d", " ", "</a>"]
   */
  private tokenizeByCharacter(html: string): string[] {
    // First, identify HTML tags and preserve them as complete tokens
    const tokens: string[] = []
    let currentPos = 0

    // Regular expression to match HTML tags (including picture and video tags with content)
    const tagRegex = /<picture[^>]*>.*?<\/picture>|<video[^>]*>.*?<\/video>|<[^>]+>/gs
    let match: null | RegExpExecArray

    while ((match = tagRegex.exec(html)) !== null) {
      // Add characters before the tag
      const beforeTag = html.substring(currentPos, match.index)
      if (beforeTag) {
        // Split non-tag content into individual characters
        for (const char of beforeTag) {
          tokens.push(char)
        }
      }

      // Add the complete tag as a single token
      tokens.push(match[0])
      currentPos = match.index + match[0].length
    }

    // Add any remaining characters after the last tag
    const remaining = html.substring(currentPos)
    for (const char of remaining) {
      tokens.push(char)
    }

    return tokens
  }

  /**
   * convert HTML to tokens
   * @example
   * tokenize("<a> Hello World </a>")
   * ["<a>"," ", "Hello", " ", "World", " ", "</a>"]
   */
  private tokenizeByWord(html: string): string[] {
    // atomic token: html tag、continuous numbers or letters、blank spaces、other symbol
    return (
      html.match(
        /<picture[^>]*>.*?<\/picture>|<video[^>]*>.*?<\/video>|<[^>]+>|\w+\b|\s+|[^<>\w]/gs,
      ) || []
    )
  }

  public getSideBySideContents(): string[] {
    if (this.sideBySideContents !== undefined) {
      return this.sideBySideContents
    }

    let oldHtml = ''
    let newHtml = ''
    let equalSequence = 0
    this.operationList.forEach((operation) => {
      switch (operation.type) {
        case 'create': {
          newHtml += this.dressUpDiffContent(
            'create',
            this.newTokens.slice(operation.newStart, operation.newEnd),
          )
          break
        }

        case 'delete': {
          const deletedTokens = this.oldTokens.slice(operation.oldStart, operation.oldEnd)
          oldHtml += this.dressUpDiffContent('delete', deletedTokens)
          break
        }
        case 'equal': {
          const equalTokens = this.newTokens.slice(operation.newStart, operation.newEnd)
          let equalString = ''
          for (const token of equalTokens) {
            // find start tags and add data-seq to enable sync scroll
            const startTagMatch = token.match(htmlStartTagReg)
            if (startTagMatch) {
              equalSequence += 1
              const tagNameLength = (startTagMatch?.groups?.name?.length ?? 0) + 1
              equalString += `${token.slice(0, tagNameLength)} data-seq="${equalSequence}"${token.slice(tagNameLength)}`
            } else {
              equalString += token
            }
          }
          oldHtml += equalString
          newHtml += equalString
          break
        }

        case 'replace': {
          oldHtml += this.dressUpDiffContent(
            'delete',
            this.oldTokens.slice(operation.oldStart, operation.oldEnd),
          )
          newHtml += this.dressUpDiffContent(
            'create',
            this.newTokens.slice(operation.newStart, operation.newEnd),
          )
          break
        }

        default: {
          console.error('Richtext diff error - invalid operation: ' + String(operation.type))
        }
      }
    })

    const result: [string, string] = [oldHtml, newHtml]
    this.sideBySideContents = result
    return result
  }

  public getUnifiedContent(): string {
    if (this.unifiedContent !== undefined) {
      return this.unifiedContent
    }

    let result = ''
    this.operationList.forEach((operation) => {
      switch (operation.type) {
        case 'create': {
          result += this.dressUpDiffContent(
            'create',
            this.newTokens.slice(operation.newStart, operation.newEnd),
          )
          break
        }

        case 'delete': {
          result += this.dressUpDiffContent(
            'delete',
            this.oldTokens.slice(operation.oldStart, operation.oldEnd),
          )
          break
        }

        case 'equal': {
          for (const token of this.newTokens.slice(operation.newStart, operation.newEnd)) {
            result += token
          }
          break
        }

        case 'replace': {
          // handle specially tag replace
          const olds = this.oldTokens.slice(operation.oldStart, operation.oldEnd)
          const news = this.newTokens.slice(operation.newStart, operation.newEnd)
          if (
            olds.length === 1 &&
            news.length === 1 &&
            olds[0]?.match(htmlTagReg) &&
            news[0]?.match(htmlTagReg)
          ) {
            result += news[0]
            break
          }

          const deletedTokens: string[] = []
          const createdTokens: string[] = []
          let createIndex = operation.newStart
          for (
            let deleteIndex = operation.oldStart;
            deleteIndex < operation.oldEnd;
            deleteIndex++
          ) {
            const deletedToken = this.oldTokens[deleteIndex]

            if (!deletedToken) {
              continue
            }

            const matchTagResultD = deletedToken?.match(htmlTagWithNameReg)
            if (matchTagResultD) {
              // handle replaced tag token

              // skip special tag
              if ([htmlImgTagReg, htmlVideoTagReg].some((item) => deletedToken?.match(item))) {
                deletedTokens.push(deletedToken)
                continue
              }

              // handle normal tag
              result += this.dressUpDiffContent('delete', deletedTokens)
              deletedTokens.splice(0)
              let isTagInNewFind = false
              for (
                let tempCreateIndex = createIndex;
                tempCreateIndex < operation.newEnd;
                tempCreateIndex++
              ) {
                const createdToken = this.newTokens[tempCreateIndex]
                if (!createdToken) {
                  continue
                }
                const matchTagResultC = createdToken?.match(htmlTagWithNameReg)
                if (
                  matchTagResultC &&
                  matchTagResultC.groups?.name === matchTagResultD.groups?.name &&
                  matchTagResultC.groups?.isEnd === matchTagResultD.groups?.isEnd
                ) {
                  // find first matched tag, but not maybe the expected tag(to optimize)
                  isTagInNewFind = true
                  result += this.dressUpDiffContent('create', createdTokens)
                  result += createdToken
                  createdTokens.splice(0)
                  createIndex = tempCreateIndex + 1
                  break
                } else {
                  createdTokens.push(createdToken)
                }
              }
              if (!isTagInNewFind) {
                result += deletedToken
                createdTokens.splice(0)
              }
            } else {
              // token is not a tag
              deletedTokens.push(deletedToken)
            }
          }
          if (createIndex < operation.newEnd) {
            createdTokens.push(...this.newTokens.slice(createIndex, operation.newEnd))
          }
          result += this.dressUpDiffContent('delete', deletedTokens)
          result += this.dressUpDiffContent('create', createdTokens)
          break
        }

        default: {
          console.error('Richtext diff error - invalid operation: ' + String(operation.type))
        }
      }
    })
    this.unifiedContent = result
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.MD]---
Location: payload-main/packages/ui/src/elements/HTMLDiff/diff/LICENSE.MD

```text
MIT License

Copyright (c) 2022 Arman Tang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/HydrateAuthProvider/index.tsx
Signals: React

```typescript
'use client'

import type { SanitizedPermissions } from 'payload'

import { useEffect } from 'react'

import { useAuth } from '../../providers/Auth/index.js'

/**
 * The Auth Provider wraps the entire app
 * but each page has specific permissions
 *
 * i.e. access control on documents/fields on a document
 */

type Props = {
  permissions: SanitizedPermissions
}

export function HydrateAuthProvider({ permissions }: Props) {
  const { setPermissions } = useAuth()

  useEffect(() => {
    setPermissions(permissions)
  }, [permissions, setPermissions])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/IDLabel/index.scss

```text
@import '../../scss/styles';

@layer payload-default {
  .id-label {
    font-size: base(0.8);
    line-height: base(1.2);
    font-weight: normal;
    color: var(--theme-elevation-600);
    background: var(--theme-elevation-100);
    padding: base(0.2) base(0.4);
    border-radius: $style-radius-m;
    display: inline-flex;
    width: fit-content;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/IDLabel/index.tsx
Signals: React

```typescript
'use client'
import React from 'react'

import './index.scss'
import { Link } from '../../elements/Link/index.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { formatAdminURL } from '../../utilities/formatAdminURL.js'
import { sanitizeID } from '../../utilities/sanitizeID.js'
import { useDrawerDepth } from '../Drawer/index.js'

const baseClass = 'id-label'

export const IDLabel: React.FC<{ className?: string; id: string; prefix?: string }> = ({
  id,
  className,
  prefix = 'ID:',
}) => {
  const {
    config: {
      routes: { admin: adminRoute },
      serverURL,
    },
  } = useConfig()

  const { collectionSlug, globalSlug } = useDocumentInfo()
  const drawerDepth = useDrawerDepth()

  const docPath = formatAdminURL({
    adminRoute,
    path: `/${collectionSlug ? `collections/${collectionSlug}` : `globals/${globalSlug}`}/${id}`,
    serverURL,
  })

  return (
    <div className={[baseClass, className].filter(Boolean).join(' ')} title={id}>
      {prefix}
      &nbsp;
      {drawerDepth > 1 ? <Link href={docPath}>{sanitizeID(id)}</Link> : sanitizeID(id)}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/LeaveWithoutSaving/index.tsx
Signals: React

```typescript
'use client'
import React, { useCallback } from 'react'

import type { OnCancel } from '../ConfirmationModal/index.js'

import { useForm, useFormModified } from '../../forms/Form/index.js'
import { useAuth } from '../../providers/Auth/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'
import { useModal } from '../Modal/index.js'
import { usePreventLeave } from './usePreventLeave.js'

type LeaveWithoutSavingProps = {
  disablePreventLeave?: boolean
  modalSlug?: string
  onConfirm?: () => Promise<void> | void
  onPrevent?: (nextHref: null | string) => void
}

const leaveWithoutSavingModalSlug = 'leave-without-saving'

export const LeaveWithoutSaving: React.FC<LeaveWithoutSavingProps> = ({
  disablePreventLeave = false,
  onConfirm,
  onPrevent,
}) => {
  const modalSlug = leaveWithoutSavingModalSlug
  const { closeModal, openModal } = useModal()
  const modified = useFormModified()
  const { isValid } = useForm()
  const { user } = useAuth()
  const [hasAccepted, setHasAccepted] = React.useState(false)

  const prevent = !disablePreventLeave && Boolean((modified || !isValid) && user)

  const handlePrevent = useCallback(() => {
    const activeHref = (document.activeElement as HTMLAnchorElement)?.href || null
    if (onPrevent) {
      onPrevent(activeHref)
    }
    openModal(modalSlug)
  }, [openModal, onPrevent, modalSlug])

  const handleAccept = useCallback(() => {
    closeModal(modalSlug)
  }, [closeModal, modalSlug])

  usePreventLeave({ hasAccepted, onAccept: handleAccept, onPrevent: handlePrevent, prevent })

  const onCancel: OnCancel = useCallback(() => {
    closeModal(modalSlug)
  }, [closeModal, modalSlug])

  const handleConfirm = useCallback(async () => {
    if (onConfirm) {
      try {
        await onConfirm()
      } catch (err) {
        console.error('Error in LeaveWithoutSaving onConfirm:', err)
      }
    }
    setHasAccepted(true)
  }, [onConfirm])

  return (
    <LeaveWithoutSavingModal modalSlug={modalSlug} onCancel={onCancel} onConfirm={handleConfirm} />
  )
}

export const LeaveWithoutSavingModal = ({
  modalSlug,
  onCancel,
  onConfirm,
}: {
  modalSlug: string
  onCancel?: OnCancel
  onConfirm: () => Promise<void> | void
}) => {
  const { t } = useTranslation()

  return (
    <ConfirmationModal
      body={t('general:changesNotSaved')}
      cancelLabel={t('general:stayOnThisPage')}
      confirmLabel={t('general:leaveAnyway')}
      heading={t('general:leaveWithoutSaving')}
      modalSlug={modalSlug}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
```

--------------------------------------------------------------------------------

````
