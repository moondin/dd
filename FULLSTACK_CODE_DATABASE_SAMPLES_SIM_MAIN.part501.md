---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 501
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 501 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.ts]---
Location: sim-main/apps/sim/components/emcn/components/index.ts

```typescript
export { Badge } from './badge/badge'
export { Breadcrumb, type BreadcrumbItem, type BreadcrumbProps } from './breadcrumb/breadcrumb'
export { Button, buttonVariants } from './button/button'
export {
  CODE_LINE_HEIGHT_PX,
  Code,
  calculateGutterWidth,
  getCodeEditorProps,
  highlight,
  languages,
} from './code/code'
export { Combobox, type ComboboxOption } from './combobox/combobox'
export { Input } from './input/input'
export { Label } from './label/label'
export {
  MODAL_SIZES,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  type ModalContentProps,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTabs,
  ModalTabsContent,
  ModalTabsList,
  ModalTabsTrigger,
  ModalTitle,
  ModalTrigger,
} from './modal/modal'
export {
  Popover,
  PopoverAnchor,
  PopoverBackButton,
  type PopoverBackButtonProps,
  PopoverContent,
  type PopoverContentProps,
  PopoverFolder,
  type PopoverFolderProps,
  PopoverItem,
  type PopoverItemProps,
  PopoverScrollArea,
  type PopoverScrollAreaProps,
  PopoverSearch,
  type PopoverSearchProps,
  PopoverSection,
  type PopoverSectionProps,
  PopoverTrigger,
  usePopoverContext,
} from './popover/popover'
export {
  SModal,
  SModalClose,
  SModalContent,
  SModalMain,
  SModalMainBody,
  SModalMainHeader,
  SModalSidebar,
  SModalSidebarHeader,
  SModalSidebarItem,
  type SModalSidebarItemProps,
  SModalSidebarSection,
  SModalSidebarSectionTitle,
  SModalTrigger,
} from './s-modal/s-modal'
export { Switch } from './switch/switch'
export { Textarea } from './textarea/textarea'
export { Tooltip } from './tooltip/tooltip'
```

--------------------------------------------------------------------------------

---[FILE: badge.tsx]---
Location: sim-main/apps/sim/components/emcn/components/badge/badge.tsx
Signals: React

```typescript
import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/core/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center px-[9px] py-[2.25px] text-[13px] font-medium gap-[4px] rounded-[40px] focus:outline-none transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--surface-5)] text-[var(--text-secondary)] dark:bg-[var(--surface-5)] dark:text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary)]',
        outline:
          'border border-[#575757] bg-transparent text-[var(--text-secondary)] dark:border-[#575757] dark:bg-transparent dark:text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

--------------------------------------------------------------------------------

---[FILE: breadcrumb.tsx]---
Location: sim-main/apps/sim/components/emcn/components/breadcrumb/breadcrumb.tsx
Signals: React, Next.js

```typescript
'use client'

import type * as React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/core/utils/cn'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

/**
 * Breadcrumb navigation component following emcn design patterns
 */
function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label='Breadcrumb'
      className={cn('flex items-center gap-[6px]', className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={`${item.label}-${index}`} className='flex items-center gap-[6px]'>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className='block max-w-[200px] truncate font-medium text-[14px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]'
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'block max-w-[200px] truncate font-medium text-[14px]',
                  isLast ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                )}
              >
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className='h-[14px] w-[14px] text-[var(--text-muted)]' />}
          </div>
        )
      })}
    </nav>
  )
}

export { Breadcrumb }
```

--------------------------------------------------------------------------------

---[FILE: button.tsx]---
Location: sim-main/apps/sim/components/emcn/components/button/button.tsx
Signals: React

```typescript
import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/core/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] dark:hover:text-[var(--text-primary)] dark:text-[var(--text-secondary)] justify-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus:outline-none focus-visible:outline-none rounded-[4px] px-[8px] py-[6px] text-[12px]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--surface-5)] dark:bg-[var(--surface-5)] hover:bg-[var(--surface-9)] dark:hover:bg-[var(--surface-9)]',
        active:
          'bg-[var(--surface-9)] dark:bg-[var(--surface-9)] hover:bg-[var(--surface-11)] dark:hover:bg-[var(--surface-11)] dark:text-[var(--text-primary)] text-[var(--text-primary)]',
        '3d': 'text-[var(--text-tertiary)] border-t border-l border-r border-[var(--border-strong)] shadow-[0_2px_0_0_var(--border-strong)] hover:shadow-[0_4px_0_0_var(--border-strong)] transition-all hover:-translate-y-0.5 hover:text-[var(--text-primary)]',
        outline:
          'border border-[var(--text-muted)] bg-[var(--border-strong)] hover:bg-[var(--surface-11)]',
        primary:
          'bg-[var(--brand-400)] dark:bg-[var(--brand-400)] dark:text-[var(--text-primary)] text-[var(--text-primary)] hover:brightness-110 hover:text-[var(--text-primary)] hover:dark:text-[var(--text-primary)]',
        secondary:
          'bg-[var(--brand-secondary)] dark:bg-[var(--brand-secondary)] dark:text-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--brand-secondary)] hover:dark:bg-[var(--brand-secondary)] hover:text-[var(--text-primary)] hover:dark:text-[var(--text-primary)]',
        tertiary:
          'bg-[var(--brand-tertiary)] dark:bg-[var(--brand-tertiary)] dark:text-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--brand-tertiary)] hover:dark:bg-[var(--brand-tertiary)] hover:text-[var(--text-primary)] hover:dark:text-[var(--text-primary)]',
        ghost: '',
        'ghost-secondary': 'text-[var(--text-muted)] dark:text-[var(--text-muted)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

export { Button, buttonVariants }
```

--------------------------------------------------------------------------------

---[FILE: code.css]---
Location: sim-main/apps/sim/components/emcn/components/code/code.css

```text
/**
 * Code editor syntax token theme.
 * Light mode: Vibrant colors matching dark mode's aesthetic quality.
 * Dark mode: VSCode Dark+ inspired colors with deep, vibrant palette.
 * Applied to elements with .code-editor-theme class.
 */

/**
 * Light mode token colors (default) - vibrant palette
 */
.code-editor-theme .token.comment,
.code-editor-theme .token.block-comment,
.code-editor-theme .token.prolog,
.code-editor-theme .token.doctype,
.code-editor-theme .token.cdata {
  color: #2e7d32 !important;
}

.code-editor-theme .token.punctuation {
  color: #383838 !important;
}

.code-editor-theme .token.property,
.code-editor-theme .token.attr-name,
.code-editor-theme .token.variable {
  color: #0891b2 !important;
}

.code-editor-theme .token.tag,
.code-editor-theme .token.boolean,
.code-editor-theme .token.number,
.code-editor-theme .token.constant {
  color: #b45309 !important;
}

.code-editor-theme .token.string,
.code-editor-theme .token.char,
.code-editor-theme .token.builtin,
.code-editor-theme .token.inserted {
  color: #dc2626 !important;
}

.code-editor-theme .token.operator,
.code-editor-theme .token.entity,
.code-editor-theme .token.url {
  color: #383838 !important;
}

.code-editor-theme .token.atrule,
.code-editor-theme .token.attr-value,
.code-editor-theme .token.keyword {
  color: #9333ea !important;
}

.code-editor-theme .token.function,
.code-editor-theme .token.class-name {
  color: #ca8a04 !important;
}

.code-editor-theme .token.regex,
.code-editor-theme .token.important {
  color: #e11d48 !important;
}

.code-editor-theme .token.symbol {
  color: #383838 !important;
}

.code-editor-theme .token.deleted {
  color: #dc2626 !important;
}

/* Blue accents for <var> and {{ENV}} placeholders - light mode */
.code-editor-theme .text-blue-500 {
  color: #1d4ed8 !important;
}

/**
 * Dark mode token colors
 */
.dark .code-editor-theme .token.comment,
.dark .code-editor-theme .token.block-comment,
.dark .code-editor-theme .token.prolog,
.dark .code-editor-theme .token.doctype,
.dark .code-editor-theme .token.cdata {
  color: #8bc985 !important;
}

.dark .code-editor-theme .token.punctuation {
  color: #eeeeee !important;
}

.dark .code-editor-theme .token.property,
.dark .code-editor-theme .token.attr-name,
.dark .code-editor-theme .token.variable {
  color: #5fc9cb !important;
}

.dark .code-editor-theme .token.tag,
.dark .code-editor-theme .token.boolean,
.dark .code-editor-theme .token.number,
.dark .code-editor-theme .token.constant {
  color: #ffc857 !important;
}

.dark .code-editor-theme .token.string,
.dark .code-editor-theme .token.char,
.dark .code-editor-theme .token.builtin,
.dark .code-editor-theme .token.inserted {
  color: #ff6b6b !important;
}

.dark .code-editor-theme .token.operator,
.dark .code-editor-theme .token.entity,
.dark .code-editor-theme .token.url {
  color: #eeeeee !important;
}

.dark .code-editor-theme .token.atrule,
.dark .code-editor-theme .token.attr-value,
.dark .code-editor-theme .token.keyword {
  color: #d896d8 !important;
}

.dark .code-editor-theme .token.function,
.dark .code-editor-theme .token.class-name {
  color: #ffc857 !important;
}

.dark .code-editor-theme .token.regex,
.dark .code-editor-theme .token.important {
  color: #ff6b6b !important;
}

.dark .code-editor-theme .token.symbol {
  color: #eeeeee !important;
}

.dark .code-editor-theme .token.deleted {
  color: #ff6b6b !important;
}

/* Blue accents for <var> and {{ENV}} placeholders - dark mode */
.dark .code-editor-theme .text-blue-500 {
  color: #35b6ff !important;
}

/* Ensure transparent backgrounds */
.code-editor-theme .token {
  background: transparent !important;
}
```

--------------------------------------------------------------------------------

---[FILE: code.tsx]---
Location: sim-main/apps/sim/components/emcn/components/code/code.tsx
Signals: React

```typescript
'use client'

import {
  Fragment,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { highlight, languages } from 'prismjs'
import { List, type RowComponentProps, useDynamicRowHeight, useListRef } from 'react-window'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import { cn } from '@/lib/core/utils/cn'
import './code.css'

/**
 * Re-export Prism.js highlighting utilities for use across the app.
 * Components can import these instead of importing from prismjs directly.
 */
export { highlight, languages }

/**
 * Code editor configuration and constants.
 * All code editors in the app should use these values for consistency.
 */
export const CODE_LINE_HEIGHT_PX = 21

/**
 * Gutter width values based on the number of digits in line numbers.
 * Provides consistent spacing across all code editors.
 */
const GUTTER_WIDTHS = [20, 20, 30, 38, 46, 54] as const

/**
 * Calculates the dynamic gutter width based on the number of lines.
 * @param lineCount - The total number of lines in the code
 * @returns The gutter width in pixels
 */
export function calculateGutterWidth(lineCount: number): number {
  const digits = String(lineCount).length
  return GUTTER_WIDTHS[Math.min(digits - 1, GUTTER_WIDTHS.length - 1)]
}

/**
 * Props for the Code.Container component.
 */
interface CodeContainerProps {
  /** Editor content wrapped by this container */
  children: ReactNode
  /** Additional CSS classes for the container */
  className?: string
  /** Inline styles for the container */
  style?: React.CSSProperties
  /** Whether editor is in streaming/AI generation state */
  isStreaming?: boolean
  /** Drag and drop handler */
  onDragOver?: (e: React.DragEvent) => void
  /** Drop handler */
  onDrop?: (e: React.DragEvent) => void
}

/**
 * Code editor container that provides consistent styling across all editors.
 * Handles container chrome (border, radius, bg, font) with Tailwind.
 *
 * @example
 * ```tsx
 * <Code.Container>
 *   <Code.Content>
 *     <Editor {...props} />
 *   </Code.Content>
 * </Code.Container>
 * ```
 */
function Container({
  children,
  className,
  style,
  isStreaming = false,
  onDragOver,
  onDrop,
}: CodeContainerProps) {
  return (
    <div
      className={cn(
        // Base container styling
        'group relative min-h-[100px] rounded-[4px] border border-[var(--border-strong)]',
        'bg-[var(--surface-1)] font-medium font-mono text-sm transition-colors',
        'dark:bg-[#1F1F1F]',
        // Overflow handling for long content
        'overflow-x-auto overflow-y-auto',
        // Streaming state
        isStreaming && 'streaming-effect',
        className
      )}
      style={style}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  )
}

/**
 * Props for Code.Content wrapper.
 */
interface CodeContentProps {
  /** Editor and related elements */
  children: ReactNode
  /** Padding left (e.g., for gutter offset) */
  paddingLeft?: string | number
  /** Additional CSS classes */
  className?: string
  /** Ref for the wrapper element */
  editorRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Wrapper for the editor content area that applies the code theme.
 * This enables VSCode-like token syntax highlighting via CSS.
 */
function Content({ children, paddingLeft, className, editorRef }: CodeContentProps) {
  return (
    <div
      ref={editorRef}
      className={cn('code-editor-theme relative mt-0 pt-0', className)}
      style={paddingLeft ? { paddingLeft } : undefined}
    >
      {children}
    </div>
  )
}

/**
 * Get standard Editor component props for react-simple-code-editor.
 * Returns the className and textareaClassName props (no style prop).
 *
 * @param options - Optional overrides
 * @returns Props object to spread onto Editor component
 */
export function getCodeEditorProps(options?: {
  isStreaming?: boolean
  isPreview?: boolean
  disabled?: boolean
}) {
  const { isStreaming = false, isPreview = false, disabled = false } = options || {}

  return {
    padding: 8,
    className: cn(
      // Base editor classes
      'bg-transparent font-[inherit] text-[inherit] font-medium',
      'text-[var(--text-primary)] dark:text-[#eeeeee]',
      'leading-[21px] outline-none focus:outline-none',
      'min-h-[106px]',
      // Streaming/disabled states
      (isStreaming || disabled) && 'cursor-not-allowed opacity-50'
    ),
    textareaClassName: cn(
      // Reset browser defaults
      'border-none bg-transparent outline-none resize-none',
      'focus:outline-none focus:ring-0',
      // Selection styling - light and dark modes
      'selection:bg-[#add6ff] selection:text-[#1b1b1b]',
      'dark:selection:bg-[#264f78] dark:selection:text-white',
      // Caret color - adapts to mode
      'caret-[var(--text-primary)] dark:caret-white',
      // Font smoothing
      '[-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]',
      // Disable interaction for streaming/preview
      (isStreaming || isPreview) && 'pointer-events-none'
    ),
  }
}

/**
 * Props for the Code.Gutter (line numbers) component.
 */
interface CodeGutterProps {
  /** Line number elements to render */
  children: ReactNode
  /** Width of the gutter in pixels */
  width: number
  /** Additional CSS classes */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

/**
 * Code editor gutter for line numbers.
 * Provides consistent styling for the line number column.
 */
function Gutter({ children, width, className, style }: CodeGutterProps) {
  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 left-0',
        'flex select-none flex-col items-end overflow-hidden',
        'rounded-l-[4px] bg-[var(--surface-1)] dark:bg-[#1F1F1F]',
        'pr-0.5',
        className
      )}
      style={{ width: `${width}px`, paddingTop: '8.5px', ...style }}
      aria-hidden='true'
    >
      {children}
    </div>
  )
}

/**
 * Props for the Code.Placeholder component.
 */
interface CodePlaceholderProps {
  /** Placeholder text to display */
  children: ReactNode
  /** Width of the gutter (for proper left positioning) */
  gutterWidth: string | number
  /** Whether code editor has content */
  show: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Code editor placeholder that appears when the editor is empty.
 * Automatically positioned to match the editor's text position.
 *
 * @example
 * ```tsx
 * <Code.Content paddingLeft={gutterWidth}>
 *   <Code.Placeholder gutterWidth={gutterWidth} show={code.length === 0}>
 *     Write your code here...
 *   </Code.Placeholder>
 *   <Editor {...props} />
 * </Code.Content>
 * ```
 */
function Placeholder({ children, gutterWidth, show, className }: CodePlaceholderProps) {
  if (!show) return null

  return (
    <pre
      className={cn(
        'pointer-events-none absolute select-none overflow-visible',
        'whitespace-pre-wrap text-muted-foreground/50',
        className
      )}
      style={{
        top: '8.5px',
        left: `calc(${typeof gutterWidth === 'number' ? `${gutterWidth}px` : gutterWidth} + 8px)`,
        fontFamily: 'inherit',
        margin: 0,
        lineHeight: `${CODE_LINE_HEIGHT_PX}px`,
      }}
    >
      {children}
    </pre>
  )
}

/**
 * Props for virtualized row rendering.
 */
interface HighlightedLine {
  lineNumber: number
  html: string
}

interface CodeRowProps {
  lines: HighlightedLine[]
  gutterWidth: number
  showGutter: boolean
  gutterStyle?: React.CSSProperties
  leftOffset: number
  wrapText: boolean
}

/**
 * Row component for virtualized code viewer.
 */
function CodeRow({ index, style, ...props }: RowComponentProps<CodeRowProps>) {
  const { lines, gutterWidth, showGutter, gutterStyle, leftOffset, wrapText } = props
  const line = lines[index]

  return (
    <div style={style} className={cn('flex', wrapText && 'overflow-hidden')} data-row-index={index}>
      {showGutter && (
        <div
          className='flex-shrink-0 select-none pr-0.5 text-right text-[var(--text-muted)] text-xs tabular-nums leading-[21px] dark:text-[#a8a8a8]'
          style={{ width: gutterWidth, marginLeft: leftOffset, ...gutterStyle }}
        >
          {line.lineNumber}
        </div>
      )}
      <pre
        className={cn(
          'm-0 flex-1 pr-2 pl-2 font-mono text-[13px] text-[var(--text-primary)] leading-[21px] dark:text-[#eeeeee]',
          wrapText ? 'min-w-0 whitespace-pre-wrap break-words' : 'whitespace-pre'
        )}
        dangerouslySetInnerHTML={{ __html: line.html || '&nbsp;' }}
      />
    </div>
  )
}

/**
 * Applies search highlighting to a single line for virtualized rendering.
 */
function applySearchHighlightingToLine(
  html: string,
  searchQuery: string,
  currentMatchIndex: number,
  globalMatchOffset: number
): { html: string; matchesInLine: number } {
  if (!searchQuery.trim()) return { html, matchesInLine: 0 }

  const escaped = escapeRegex(searchQuery)
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = html.split(/(<[^>]+>)/g)
  let matchesInLine = 0

  const result = parts
    .map((part) => {
      if (part.startsWith('<') && part.endsWith('>')) {
        return part
      }
      return part.replace(regex, (match) => {
        const globalIndex = globalMatchOffset + matchesInLine
        const isCurrentMatch = globalIndex === currentMatchIndex
        matchesInLine++

        const bgClass = isCurrentMatch
          ? 'bg-[#F6AD55] text-[#1a1a1a] dark:bg-[#F6AD55] dark:text-[#1a1a1a]'
          : 'bg-[#FCD34D]/40 dark:bg-[#FCD34D]/30'

        return `<mark class="${bgClass} rounded-[2px]" data-search-match>${match}</mark>`
      })
    })
    .join('')

  return { html: result, matchesInLine }
}

/**
 * Props for the Code.Viewer component (readonly code display).
 */
interface CodeViewerProps {
  /** Code content to display */
  code: string
  /** Whether to show line numbers gutter */
  showGutter?: boolean
  /** Language for syntax highlighting (default: 'json') */
  language?: 'javascript' | 'json' | 'python'
  /** Additional CSS classes for the container */
  className?: string
  /** Left padding offset (useful for terminal alignment) */
  paddingLeft?: number
  /** Inline styles for the gutter (e.g., to override background) */
  gutterStyle?: React.CSSProperties
  /** Whether to wrap text instead of using horizontal scroll */
  wrapText?: boolean
  /** Search query to highlight in the code */
  searchQuery?: string
  /** Index of the currently active match (for distinct highlighting) */
  currentMatchIndex?: number
  /** Callback when match count changes */
  onMatchCountChange?: (count: number) => void
  /** Ref for the content container (for scrolling to matches) */
  contentRef?: React.RefObject<HTMLDivElement | null>
  /** Enable virtualized rendering for large outputs (uses react-window) */
  virtualized?: boolean
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Applies search highlighting to already syntax-highlighted HTML.
 * Wraps matches in spans with appropriate highlighting classes.
 *
 * @param html - The syntax-highlighted HTML string
 * @param searchQuery - The search query to highlight
 * @param currentMatchIndex - Index of the current match (for distinct highlighting)
 * @param matchCounter - Mutable counter object to track match indices across calls
 * @returns The HTML with search highlighting applied
 */
function applySearchHighlighting(
  html: string,
  searchQuery: string,
  currentMatchIndex: number,
  matchCounter: { count: number }
): string {
  if (!searchQuery.trim()) return html

  const escaped = escapeRegex(searchQuery)
  const regex = new RegExp(`(${escaped})`, 'gi')

  // We need to be careful not to match inside HTML tags
  // Split by HTML tags and only process text parts
  const parts = html.split(/(<[^>]+>)/g)

  return parts
    .map((part) => {
      // If it's an HTML tag, don't modify it
      if (part.startsWith('<') && part.endsWith('>')) {
        return part
      }

      // Process text content
      return part.replace(regex, (match) => {
        const isCurrentMatch = matchCounter.count === currentMatchIndex
        matchCounter.count++

        const bgClass = isCurrentMatch
          ? 'bg-[#F6AD55] text-[#1a1a1a] dark:bg-[#F6AD55] dark:text-[#1a1a1a]'
          : 'bg-[#FCD34D]/40 dark:bg-[#FCD34D]/30'

        return `<mark class="${bgClass} rounded-[2px]" data-search-match>${match}</mark>`
      })
    })
    .join('')
}

/**
 * Counts all matches for a search query in the given code.
 *
 * @param code - The raw code string
 * @param searchQuery - The search query
 * @returns Number of matches found
 */
function countSearchMatches(code: string, searchQuery: string): number {
  if (!searchQuery.trim()) return 0

  const escaped = escapeRegex(searchQuery)
  const regex = new RegExp(escaped, 'gi')
  const matches = code.match(regex)

  return matches?.length ?? 0
}

/**
 * Props for inner viewer components (with defaults already applied).
 */
type ViewerInnerProps = {
  code: string
  showGutter: boolean
  language: 'javascript' | 'json' | 'python'
  className?: string
  paddingLeft: number
  gutterStyle?: React.CSSProperties
  wrapText: boolean
  searchQuery?: string
  currentMatchIndex: number
  onMatchCountChange?: (count: number) => void
  contentRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Virtualized code viewer implementation using react-window.
 */
const VirtualizedViewerInner = memo(function VirtualizedViewerInner({
  code,
  showGutter,
  language,
  className,
  paddingLeft,
  gutterStyle,
  wrapText,
  searchQuery,
  currentMatchIndex,
  onMatchCountChange,
  contentRef,
}: ViewerInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useListRef(null)
  const [containerHeight, setContainerHeight] = useState(400)

  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: CODE_LINE_HEIGHT_PX,
    key: wrapText ? 'wrap' : 'nowrap',
  })

  const matchCount = useMemo(() => countSearchMatches(code, searchQuery || ''), [code, searchQuery])

  useEffect(() => {
    onMatchCountChange?.(matchCount)
  }, [matchCount, onMatchCountChange])

  const lines = useMemo(() => code.split('\n'), [code])
  const lineCount = lines.length
  const gutterWidth = useMemo(() => calculateGutterWidth(lineCount), [lineCount])

  const highlightedLines = useMemo(() => {
    const lang = languages[language] || languages.javascript
    return lines.map((line, idx) => ({
      lineNumber: idx + 1,
      html: highlight(line, lang, language),
    }))
  }, [lines, language])

  const matchOffsets = useMemo(() => {
    if (!searchQuery?.trim()) return []
    const offsets: number[] = []
    let cumulative = 0
    const escaped = escapeRegex(searchQuery)
    const regex = new RegExp(escaped, 'gi')

    for (const line of lines) {
      offsets.push(cumulative)
      const matches = line.match(regex)
      cumulative += matches?.length ?? 0
    }
    return offsets
  }, [lines, searchQuery])

  const linesWithSearch = useMemo(() => {
    if (!searchQuery?.trim()) return highlightedLines

    return highlightedLines.map((line, idx) => {
      const { html } = applySearchHighlightingToLine(
        line.html,
        searchQuery,
        currentMatchIndex,
        matchOffsets[idx]
      )
      return { ...line, html }
    })
  }, [highlightedLines, searchQuery, currentMatchIndex, matchOffsets])

  useEffect(() => {
    if (!searchQuery?.trim() || matchCount === 0 || !listRef.current) return

    let accumulated = 0
    for (let i = 0; i < matchOffsets.length; i++) {
      const matchesInThisLine = (matchOffsets[i + 1] ?? matchCount) - matchOffsets[i]
      if (currentMatchIndex >= accumulated && currentMatchIndex < accumulated + matchesInThisLine) {
        listRef.current.scrollToRow({ index: i, align: 'center' })
        break
      }
      accumulated += matchesInThisLine
    }
  }, [currentMatchIndex, searchQuery, matchCount, matchOffsets, listRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const parent = container.parentElement
    if (!parent) return

    const updateHeight = () => {
      setContainerHeight(parent.clientHeight)
    }

    updateHeight()

    const resizeObserver = new ResizeObserver(updateHeight)
    resizeObserver.observe(parent)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!wrapText) return

    const container = containerRef.current
    if (!container) return

    const rows = container.querySelectorAll('[data-row-index]')
    if (rows.length === 0) return

    return dynamicRowHeight.observeRowElements(rows)
  }, [wrapText, dynamicRowHeight, linesWithSearch])

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el
      if (contentRef && 'current' in contentRef) {
        contentRef.current = el
      }
    },
    [contentRef]
  )

  const rowProps = useMemo(
    () => ({
      lines: linesWithSearch,
      gutterWidth,
      showGutter,
      gutterStyle,
      leftOffset: paddingLeft,
      wrapText,
    }),
    [linesWithSearch, gutterWidth, showGutter, gutterStyle, paddingLeft, wrapText]
  )

  return (
    <div
      ref={setRefs}
      className={cn(
        'code-editor-theme relative rounded-[4px] border border-[var(--border-strong)]',
        'bg-[var(--surface-1)] font-medium font-mono text-sm',
        'dark:bg-[#1F1F1F]',
        className
      )}
      style={{ height: containerHeight }}
    >
      <List
        listRef={listRef}
        defaultHeight={containerHeight}
        rowCount={lineCount}
        rowHeight={wrapText ? dynamicRowHeight : CODE_LINE_HEIGHT_PX}
        rowComponent={CodeRow}
        rowProps={rowProps}
        overscanCount={5}
        className={wrapText ? 'overflow-x-hidden' : 'overflow-x-auto'}
      />
    </div>
  )
})

/**
 * Readonly code viewer with optional gutter and syntax highlighting.
 * Handles all complexity internally - line numbers, gutter width calculation, and highlighting.
 * Supports optional search highlighting with navigation.
 *
 * @example
 * ```tsx
 * // Standard rendering
 * <Code.Viewer
 *   code={JSON.stringify(data, null, 2)}
 *   showGutter
 *   language="json"
 *   searchQuery="error"
 *   currentMatchIndex={0}
 * />
 *
 * // Virtualized rendering for large outputs
 * <Code.Viewer
 *   code={largeOutput}
 *   showGutter
 *   language="json"
 *   virtualized
 * />
 * ```
 */
/**
 * Non-virtualized code viewer implementation.
 */
function ViewerInner({
  code,
  showGutter,
  language,
  className,
  paddingLeft,
  gutterStyle,
  wrapText,
  searchQuery,
  currentMatchIndex,
  onMatchCountChange,
  contentRef,
}: ViewerInnerProps) {
  // Compute match count and notify parent
  const matchCount = useMemo(() => countSearchMatches(code, searchQuery || ''), [code, searchQuery])

  useEffect(() => {
    onMatchCountChange?.(matchCount)
  }, [matchCount, onMatchCountChange])

  // Determine whitespace class based on wrap setting
  const whitespaceClass = wrapText ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'

  // Special rendering path: when wrapping with gutter, render per-line rows so gutter stays aligned.
  if (showGutter && wrapText) {
    const lines = code.split('\n')
    const gutterWidth = calculateGutterWidth(lines.length)
    const matchCounter = { count: 0 }

    return (
      <Container className={className}>
        <Content className='code-editor-theme' editorRef={contentRef}>
          <div
            style={{
              paddingLeft,
              paddingTop: '8px',
              paddingBottom: '8px',
              display: 'grid',
              gridTemplateColumns: `${gutterWidth}px 1fr`,
            }}
          >
            {lines.map((line, idx) => {
              let perLineHighlighted = highlight(
                line,
                languages[language] || languages.javascript,
                language
              )

              // Apply search highlighting if query exists
              if (searchQuery?.trim()) {
                perLineHighlighted = applySearchHighlighting(
                  perLineHighlighted,
                  searchQuery,
                  currentMatchIndex,
                  matchCounter
                )
              }

              return (
                <Fragment key={idx}>
                  <div
                    className='select-none pr-0.5 text-right text-[var(--text-muted)] text-xs tabular-nums leading-[21px] dark:text-[#a8a8a8]'
                    style={{ transform: 'translateY(0.25px)', ...gutterStyle }}
                  >
                    {idx + 1}
                  </div>
                  <pre
                    className='m-0 min-w-0 whitespace-pre-wrap break-words pr-2 pl-2 font-mono text-[13px] text-[var(--text-primary)] leading-[21px] dark:text-[#eeeeee]'
                    dangerouslySetInnerHTML={{ __html: perLineHighlighted || '&nbsp;' }}
                  />
                </Fragment>
              )
            })}
          </div>
        </Content>
      </Container>
    )
  }

  // Apply syntax highlighting
  let highlightedCode = highlight(code, languages[language] || languages.javascript, language)

  // Apply search highlighting if query exists
  if (searchQuery?.trim()) {
    const matchCounter = { count: 0 }
    highlightedCode = applySearchHighlighting(
      highlightedCode,
      searchQuery,
      currentMatchIndex,
      matchCounter
    )
  }

  if (!showGutter) {
    // Simple display without gutter
    return (
      <Container className={className}>
        <Content className='code-editor-theme' editorRef={contentRef}>
          <pre
            className={cn(
              whitespaceClass,
              'p-2 font-mono text-[13px] text-[var(--text-primary)] leading-[21px] dark:text-[#eeeeee]'
            )}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </Content>
      </Container>
    )
  }

  // Calculate line numbers
  const lineCount = code.split('\n').length
  const gutterWidth = calculateGutterWidth(lineCount)

  // Render line numbers
  const lineNumbers = []
  for (let i = 1; i <= lineCount; i++) {
    lineNumbers.push(
      <div
        key={i}
        className='text-right text-[var(--text-muted)] text-xs tabular-nums leading-[21px] dark:text-[#a8a8a8]'
      >
        {i}
      </div>
    )
  }

  return (
    <Container className={className}>
      <Gutter width={gutterWidth} style={{ left: `${paddingLeft}px`, ...gutterStyle }}>
        {lineNumbers}
      </Gutter>
      <Content
        className='code-editor-theme'
        paddingLeft={`${gutterWidth + paddingLeft}px`}
        editorRef={contentRef}
      >
        <pre
          className={cn(
            whitespaceClass,
            'p-2 font-mono text-[13px] text-[var(--text-primary)] leading-[21px] dark:text-[#eeeeee]'
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </Content>
    </Container>
  )
}

/**
 * Readonly code viewer with optional gutter and syntax highlighting.
 * Routes to either standard or virtualized implementation based on the `virtualized` prop.
 */
function Viewer({
  code,
  showGutter = false,
  language = 'json',
  className,
  paddingLeft = 0,
  gutterStyle,
  wrapText = false,
  searchQuery,
  currentMatchIndex = 0,
  onMatchCountChange,
  contentRef,
  virtualized = false,
}: CodeViewerProps) {
  const innerProps: ViewerInnerProps = {
    code,
    showGutter,
    language,
    className,
    paddingLeft,
    gutterStyle,
    wrapText,
    searchQuery,
    currentMatchIndex,
    onMatchCountChange,
    contentRef,
  }

  return virtualized ? <VirtualizedViewerInner {...innerProps} /> : <ViewerInner {...innerProps} />
}

export const Code = {
  Container,
  Content,
  Gutter,
  Placeholder,
  Viewer,
}
```

--------------------------------------------------------------------------------

````
