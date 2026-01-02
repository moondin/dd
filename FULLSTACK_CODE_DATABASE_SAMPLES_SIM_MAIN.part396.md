---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 396
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 396 of 933)

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

---[FILE: markdown-renderer.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/markdown-renderer.tsx
Signals: React

```typescript
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Code, Tooltip } from '@/components/emcn'

/**
 * Recursively extracts text content from React elements
 * @param element - React node to extract text from
 * @returns Concatenated text content
 */
const getTextContent = (element: React.ReactNode): string => {
  if (typeof element === 'string') {
    return element
  }
  if (typeof element === 'number') {
    return String(element)
  }
  if (React.isValidElement(element)) {
    const elementProps = element.props as { children?: React.ReactNode }
    return getTextContent(elementProps.children)
  }
  if (Array.isArray(element)) {
    return element.map(getTextContent).join('')
  }
  return ''
}

// Global layout fixes for markdown content inside the copilot panel
if (typeof document !== 'undefined') {
  const styleId = 'copilot-markdown-fix'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* Prevent any markdown content from expanding beyond the panel */
      .copilot-markdown-wrapper,
      .copilot-markdown-wrapper * {
        max-width: 100% !important;
      }

      .copilot-markdown-wrapper p,
      .copilot-markdown-wrapper li {
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }

      .copilot-markdown-wrapper a {
        overflow-wrap: anywhere !important;
        word-break: break-all !important;
      }

      .copilot-markdown-wrapper code:not(pre code) {
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
      }

      /* Reduce top margin for first heading (e.g., right after thinking block) */
      .copilot-markdown-wrapper > h1:first-child,
      .copilot-markdown-wrapper > h2:first-child,
      .copilot-markdown-wrapper > h3:first-child,
      .copilot-markdown-wrapper > h4:first-child {
        margin-top: 0.25rem !important;
      }
    `
    document.head.appendChild(style)
  }
}

/**
 * Link component with hover preview tooltip
 * Displays full URL on hover for better UX
 * @param props - Component props with href and children
 * @returns Link element with tooltip preview
 */
function LinkWithPreview({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger asChild>
        <a
          href={href}
          className='inline break-all text-blue-600 hover:underline dark:text-blue-400'
          target='_blank'
          rel='noopener noreferrer'
        >
          {children}
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content side='top' align='center' sideOffset={5} className='max-w-sm p-3'>
        <span className='text-sm'>{href}</span>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

/**
 * Props for the CopilotMarkdownRenderer component
 */
interface CopilotMarkdownRendererProps {
  /** Markdown content to render */
  content: string
}

/**
 * CopilotMarkdownRenderer renders markdown content with custom styling
 * Supports GitHub-flavored markdown, code blocks with syntax highlighting,
 * tables, links with preview, and more
 *
 * @param props - Component props
 * @returns Rendered markdown content
 */
export default function CopilotMarkdownRenderer({ content }: CopilotMarkdownRendererProps) {
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({})

  // Reset copy success state after 2 seconds
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {}

    Object.keys(copiedCodeBlocks).forEach((key) => {
      if (copiedCodeBlocks[key]) {
        timers[key] = setTimeout(() => {
          setCopiedCodeBlocks((prev) => ({ ...prev, [key]: false }))
        }, 2000)
      }
    })

    return () => {
      Object.values(timers).forEach(clearTimeout)
    }
  }, [copiedCodeBlocks])

  // Custom components for react-markdown with current styling - memoized to prevent re-renders
  const markdownComponents = useMemo(
    () => ({
      // Paragraph
      p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className='mb-1 font-base font-season text-[#1f2124] text-sm leading-[1.25rem] last:mb-0 dark:font-[470] dark:text-[#E8E8E8]'>
          {children}
        </p>
      ),

      // Headings
      h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1 className='mt-3 mb-3 font-season font-semibold text-2xl text-[var(--text-primary)] dark:text-[#F0F0F0]'>
          {children}
        </h1>
      ),
      h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2 className='mt-2.5 mb-2.5 font-season font-semibold text-[var(--text-primary)] text-xl dark:text-[#F0F0F0]'>
          {children}
        </h2>
      ),
      h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h3 className='mt-2 mb-2 font-season font-semibold text-[var(--text-primary)] text-lg dark:text-[#F0F0F0]'>
          {children}
        </h3>
      ),
      h4: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h4 className='mt-5 mb-2 font-season font-semibold text-[var(--text-primary)] text-base dark:text-[#F0F0F0]'>
          {children}
        </h4>
      ),

      // Lists
      ul: ({ children }: React.HTMLAttributes<HTMLUListElement>) => (
        <ul
          className='mt-1 mb-1 space-y-1 pl-6 font-base font-season text-[#1f2124] dark:font-[470] dark:text-[#E8E8E8]'
          style={{ listStyleType: 'disc' }}
        >
          {children}
        </ul>
      ),
      ol: ({ children }: React.HTMLAttributes<HTMLOListElement>) => (
        <ol
          className='mt-1 mb-1 space-y-1 pl-6 font-base font-season text-[#1f2124] dark:font-[470] dark:text-[#E8E8E8]'
          style={{ listStyleType: 'decimal' }}
        >
          {children}
        </ol>
      ),
      li: ({
        children,
        ordered,
      }: React.LiHTMLAttributes<HTMLLIElement> & { ordered?: boolean }) => (
        <li
          className='font-base font-season text-[#1f2124] dark:font-[470] dark:text-[#E8E8E8]'
          style={{ display: 'list-item' }}
        >
          {children}
        </li>
      ),

      // Code blocks - render using shared Code.Viewer for consistent styling
      pre: ({ children }: React.HTMLAttributes<HTMLPreElement>) => {
        let codeContent: React.ReactNode = children
        let language = 'code'

        if (
          React.isValidElement<{ className?: string; children?: React.ReactNode }>(children) &&
          children.type === 'code'
        ) {
          const childElement = children as React.ReactElement<{
            className?: string
            children?: React.ReactNode
          }>
          codeContent = childElement.props.children
          language = childElement.props.className?.replace('language-', '') || 'code'
        }

        // Extract actual text content
        let actualCodeText = ''
        if (typeof codeContent === 'string') {
          actualCodeText = codeContent
        } else if (React.isValidElement(codeContent)) {
          // If it's a React element, try to get its text content
          actualCodeText = getTextContent(codeContent)
        } else if (Array.isArray(codeContent)) {
          // If it's an array of elements, join their text content
          actualCodeText = codeContent
            .map((child) =>
              typeof child === 'string'
                ? child
                : React.isValidElement(child)
                  ? getTextContent(child)
                  : ''
            )
            .join('')
        } else {
          actualCodeText = String(codeContent || '')
        }

        // Create a unique key for this code block based on content
        const codeText = actualCodeText || 'code'
        const codeBlockKey = `${language}-${codeText.substring(0, 30).replace(/\s/g, '-')}-${codeText.length}`

        const showCopySuccess = copiedCodeBlocks[codeBlockKey] || false

        const handleCopy = () => {
          const textToCopy = actualCodeText
          if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
            setCopiedCodeBlocks((prev) => ({ ...prev, [codeBlockKey]: true }))
          }
        }

        // Map markdown language tag to Code.Viewer supported languages
        const normalizedLanguage = (language || '').toLowerCase()
        const viewerLanguage: 'javascript' | 'json' | 'python' =
          normalizedLanguage === 'json'
            ? 'json'
            : normalizedLanguage === 'python' || normalizedLanguage === 'py'
              ? 'python'
              : 'javascript'

        return (
          <div className='my-6 w-0 min-w-full overflow-hidden rounded-md border border-[var(--border-strong)] bg-[#1F1F1F] text-sm'>
            <div className='flex items-center justify-between border-[var(--border-strong)] border-b px-4 py-1.5'>
              <span className='font-season text-[#A3A3A3] text-xs'>
                {language === 'code' ? viewerLanguage : language}
              </span>
              <button
                onClick={handleCopy}
                className='text-[#A3A3A3] transition-colors hover:text-gray-300'
                title='Copy'
              >
                {showCopySuccess ? (
                  <Check className='h-3 w-3' strokeWidth={2} />
                ) : (
                  <Copy className='h-3 w-3' strokeWidth={2} />
                )}
              </button>
            </div>
            <Code.Viewer
              code={actualCodeText}
              showGutter
              language={viewerLanguage}
              className='[&_pre]:!pb-0 m-0 rounded-none border-0 bg-transparent'
            />
          </div>
        )
      },

      // Inline code
      code: ({
        inline,
        className,
        children,
        ...props
      }: React.HTMLAttributes<HTMLElement> & { className?: string; inline?: boolean }) => {
        if (inline) {
          return (
            <code
              className='whitespace-normal break-all rounded border border-[var(--border-strong)] bg-[#1F1F1F] px-1 py-0.5 font-mono text-[#eeeeee] text-[0.9em]'
              {...props}
            >
              {children}
            </code>
          )
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      },

      // Bold text
      strong: ({ children }: React.HTMLAttributes<HTMLElement>) => (
        <strong className='font-semibold text-[var(--text-primary)] dark:text-[#F0F0F0]'>
          {children}
        </strong>
      ),

      // Bold text (alternative)
      b: ({ children }: React.HTMLAttributes<HTMLElement>) => (
        <b className='font-semibold text-[var(--text-primary)] dark:text-[#F0F0F0]'>{children}</b>
      ),

      // Italic text
      em: ({ children }: React.HTMLAttributes<HTMLElement>) => (
        <em className='text-[#1f2124] italic dark:text-[#E8E8E8]'>{children}</em>
      ),

      // Italic text (alternative)
      i: ({ children }: React.HTMLAttributes<HTMLElement>) => (
        <i className='text-[#1f2124] italic dark:text-[#E8E8E8]'>{children}</i>
      ),

      // Blockquotes
      blockquote: ({ children }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote className='my-4 border-[var(--border-strong)] border-l-4 py-1 pl-4 font-season text-[#3a3d41] italic dark:border-gray-600 dark:text-[#E0E0E0]'>
          {children}
        </blockquote>
      ),

      // Horizontal rule
      hr: () => <hr className='my-8 border-[var(--divider)] border-t dark:border-gray-400/[.07]' />,

      // Links
      a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <LinkWithPreview href={href || '#'} {...props}>
          {children}
        </LinkWithPreview>
      ),

      // Tables
      table: ({ children }: React.TableHTMLAttributes<HTMLTableElement>) => (
        <div className='my-4 max-w-full overflow-x-auto'>
          <table className='min-w-full table-auto border border-[var(--border)] font-season text-sm dark:border-gray-600'>
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead className='bg-[var(--surface-9)] text-left dark:bg-[#2A2A2A]'>{children}</thead>
      ),
      tbody: ({ children }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody className='divide-y divide-[var(--border)] dark:divide-gray-600'>{children}</tbody>
      ),
      tr: ({ children }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr className='border-[var(--border)] border-b transition-colors hover:bg-[var(--surface-9)] dark:border-gray-600 dark:hover:bg-[#2A2A2A]/60'>
          {children}
        </tr>
      ),
      th: ({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
        <th className='border-[var(--border)] border-r px-4 py-2 align-top font-base text-[#3a3d41] last:border-r-0 dark:border-gray-600 dark:font-[470] dark:text-[#E0E0E0]'>
          {children}
        </th>
      ),
      td: ({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
        <td className='break-words border-[var(--border)] border-r px-4 py-2 align-top font-base text-[#1f2124] last:border-r-0 dark:border-gray-600 dark:font-[470] dark:text-[#E8E8E8]'>
          {children}
        </td>
      ),

      // Images
      img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img
          src={src}
          alt={alt || 'Image'}
          className='my-3 h-auto max-w-full rounded-md'
          {...props}
        />
      ),
    }),
    [copiedCodeBlocks]
  )

  return (
    <div className='copilot-markdown-wrapper max-w-full space-y-3 break-words font-base font-season text-[#1f2124] text-sm leading-[1.25rem] dark:font-[470] dark:text-[#E8E8E8]'>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: smooth-streaming.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/smooth-streaming.tsx
Signals: React

```typescript
import { memo, useEffect, useRef, useState } from 'react'
import CopilotMarkdownRenderer from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/markdown-renderer'

/**
 * Character animation delay in milliseconds
 */
const CHARACTER_DELAY = 3

/**
 * StreamingIndicator shows animated dots during message streaming
 * Uses CSS classes for animations to follow best practices
 *
 * @returns Animated loading indicator
 */
export const StreamingIndicator = memo(() => (
  <div className='flex items-center py-1 text-muted-foreground transition-opacity duration-200 ease-in-out'>
    <div className='flex space-x-0.5'>
      <div className='h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms] [animation-duration:1.2s]' />
      <div className='h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms] [animation-duration:1.2s]' />
      <div className='h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms] [animation-duration:1.2s]' />
    </div>
  </div>
))

StreamingIndicator.displayName = 'StreamingIndicator'

/**
 * Props for the SmoothStreamingText component
 */
interface SmoothStreamingTextProps {
  /** Content to display with streaming animation */
  content: string
  /** Whether the content is actively streaming */
  isStreaming: boolean
}

/**
 * SmoothStreamingText component displays text with character-by-character animation
 * Creates a smooth streaming effect for AI responses
 *
 * @param props - Component props
 * @returns Streaming text with smooth animation
 */
export const SmoothStreamingText = memo(
  ({ content, isStreaming }: SmoothStreamingTextProps) => {
    const [displayedContent, setDisplayedContent] = useState('')
    const contentRef = useRef(content)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const indexRef = useRef(0)
    const streamingStartTimeRef = useRef<number | null>(null)
    const isAnimatingRef = useRef(false)

    /**
     * Handles content streaming animation
     * Updates displayed content character by character during streaming
     */
    useEffect(() => {
      contentRef.current = content

      if (content.length === 0) {
        setDisplayedContent('')
        indexRef.current = 0
        streamingStartTimeRef.current = null
        return
      }

      if (isStreaming) {
        if (streamingStartTimeRef.current === null) {
          streamingStartTimeRef.current = Date.now()
        }

        if (indexRef.current < content.length) {
          const animateText = () => {
            const currentContent = contentRef.current
            const currentIndex = indexRef.current

            if (currentIndex < currentContent.length) {
              const chunkSize = 1
              const newDisplayed = currentContent.slice(0, currentIndex + chunkSize)

              setDisplayedContent(newDisplayed)
              indexRef.current = currentIndex + chunkSize

              timeoutRef.current = setTimeout(animateText, CHARACTER_DELAY)
            } else {
              isAnimatingRef.current = false
            }
          }

          if (!isAnimatingRef.current) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            isAnimatingRef.current = true
            animateText()
          }
        }
      } else {
        setDisplayedContent(content)
        indexRef.current = content.length
        isAnimatingRef.current = false
        streamingStartTimeRef.current = null
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        isAnimatingRef.current = false
      }
    }, [content, isStreaming])

    return (
      <div className='relative min-h-[1.25rem] max-w-full overflow-hidden'>
        <CopilotMarkdownRenderer content={displayedContent} />
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Prevent re-renders during streaming unless content actually changed
    return (
      prevProps.content === nextProps.content && prevProps.isStreaming === nextProps.isStreaming
      // markdownComponents is now memoized so no need to compare
    )
  }
)

SmoothStreamingText.displayName = 'SmoothStreamingText'
```

--------------------------------------------------------------------------------

---[FILE: thinking-block.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/components/thinking-block.tsx
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ChevronUp } from 'lucide-react'

/**
 * Timer update interval in milliseconds
 */
const TIMER_UPDATE_INTERVAL = 100

/**
 * Milliseconds threshold for displaying as seconds
 */
const SECONDS_THRESHOLD = 1000

/**
 * Props for the ShimmerOverlayText component
 */
interface ShimmerOverlayTextProps {
  /** Label text to display */
  label: string
  /** Value text to display */
  value: string
  /** Whether the shimmer animation is active */
  active?: boolean
}

/**
 * ShimmerOverlayText component for thinking block
 * Applies shimmer effect to the "Thought for X.Xs" text during streaming
 *
 * @param props - Component props
 * @returns Text with optional shimmer overlay effect
 */
function ShimmerOverlayText({ label, value, active = false }: ShimmerOverlayTextProps) {
  return (
    <span className='relative inline-block'>
      <span style={{ color: '#B8B8B8' }}>{label}</span>
      <span style={{ color: 'var(--text-muted)' }}>{value}</span>
      {active ? (
        <span
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 select-none overflow-hidden'
        >
          <span
            className='block text-transparent'
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)',
              backgroundSize: '200% 100%',
              backgroundRepeat: 'no-repeat',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              animation: 'thinking-shimmer 1.4s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          >
            {label}
            {value}
          </span>
        </span>
      ) : null}
      <style>{`
        @keyframes thinking-shimmer {
          0% { background-position: 150% 0; }
          50% { background-position: 0% 0; }
          100% { background-position: -150% 0; }
        }
      `}</style>
    </span>
  )
}

/**
 * Props for the ThinkingBlock component
 */
interface ThinkingBlockProps {
  /** Content of the thinking block */
  content: string
  /** Whether the block is currently streaming */
  isStreaming?: boolean
  /** Persisted duration from content block */
  duration?: number
  /** Persisted start time from content block */
  startTime?: number
}

/**
 * ThinkingBlock component displays AI reasoning/thinking process
 * Shows collapsible content with duration timer
 * Auto-expands during streaming and collapses when complete
 *
 * @param props - Component props
 * @returns Thinking block with expandable content and timer
 */
export function ThinkingBlock({
  content,
  isStreaming = false,
  duration: persistedDuration,
  startTime: persistedStartTime,
}: ThinkingBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [duration, setDuration] = useState(persistedDuration ?? 0)
  const userCollapsedRef = useRef<boolean>(false)
  const startTimeRef = useRef<number>(persistedStartTime ?? Date.now())

  /**
   * Updates start time reference when persisted start time changes
   */
  useEffect(() => {
    if (typeof persistedStartTime === 'number') {
      startTimeRef.current = persistedStartTime
    }
  }, [persistedStartTime])

  /**
   * Auto-expands block when streaming with content
   * Auto-collapses when streaming ends
   */
  useEffect(() => {
    if (!isStreaming) {
      setIsExpanded(false)
      userCollapsedRef.current = false
      return
    }

    if (!userCollapsedRef.current && content && content.trim().length > 0) {
      setIsExpanded(true)
    }
  }, [isStreaming, content])

  /**
   * Updates duration timer during streaming
   * Uses persisted duration when available
   */
  useEffect(() => {
    if (typeof persistedDuration === 'number') {
      setDuration(persistedDuration)
      return
    }

    if (isStreaming) {
      const interval = setInterval(() => {
        setDuration(Date.now() - startTimeRef.current)
      }, TIMER_UPDATE_INTERVAL)
      return () => clearInterval(interval)
    }

    setDuration(Date.now() - startTimeRef.current)
  }, [isStreaming, persistedDuration])

  /**
   * Formats duration in milliseconds to human-readable format
   * @param ms - Duration in milliseconds
   * @returns Formatted string (e.g., "150ms" or "2.5s")
   */
  const formatDuration = (ms: number) => {
    if (ms < SECONDS_THRESHOLD) {
      return `${ms}ms`
    }
    const seconds = (ms / SECONDS_THRESHOLD).toFixed(1)
    return `${seconds}s`
  }

  const hasContent = content && content.trim().length > 0

  return (
    <div className='mt-1 mb-0'>
      <button
        onClick={() => {
          setIsExpanded((v) => {
            const next = !v
            // If user collapses during streaming, remember to not auto-expand again
            if (!next && isStreaming) userCollapsedRef.current = true
            return next
          })
        }}
        className='mb-1 inline-flex items-center gap-1 text-left font-[470] font-season text-[var(--text-secondary)] text-sm transition-colors hover:text-[var(--text-primary)]'
        type='button'
        disabled={!hasContent}
      >
        <ShimmerOverlayText
          label='Thought'
          value={` for ${formatDuration(duration)}`}
          active={isStreaming}
        />
        {hasContent && (
          <ChevronUp
            className={clsx('h-3 w-3 transition-transform', isExpanded && 'rotate-180')}
            aria-hidden='true'
          />
        )}
      </button>

      {isExpanded && (
        <div className='ml-1 border-[var(--border-strong)] border-l-2 pl-2'>
          <pre
            className='whitespace-pre-wrap font-[470] font-season text-[12px] leading-[1.15rem]'
            style={{ color: '#B8B8B8' }}
          >
            {content}
            {isStreaming && (
              <span className='ml-1 inline-block h-2 w-1 animate-pulse bg-[#B8B8B8]' />
            )}
          </pre>
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/hooks/index.ts

```typescript
export { useCheckpointManagement } from './use-checkpoint-management'
export { useMessageEditing } from './use-message-editing'
export { useMessageFeedback } from './use-message-feedback'
export { useSuccessTimers } from './use-success-timers'
```

--------------------------------------------------------------------------------

---[FILE: use-checkpoint-management.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/copilot-message/hooks/use-checkpoint-management.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import { useCopilotStore } from '@/stores/panel/copilot/store'
import type { CopilotMessage } from '@/stores/panel/copilot/types'

const logger = createLogger('useCheckpointManagement')

/**
 * Custom hook to handle checkpoint-related operations for messages
 *
 * @param message - The copilot message
 * @param messages - Array of all messages in the chat
 * @param messageCheckpoints - Checkpoints for this message
 * @param onRevertModeChange - Callback for revert mode changes
 * @param onEditModeChange - Callback for edit mode changes
 * @returns Checkpoint management utilities
 */
export function useCheckpointManagement(
  message: CopilotMessage,
  messages: CopilotMessage[],
  messageCheckpoints: any[],
  onRevertModeChange?: (isReverting: boolean) => void,
  onEditModeChange?: (isEditing: boolean) => void
) {
  const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(false)
  const [showCheckpointDiscardModal, setShowCheckpointDiscardModal] = useState(false)
  const pendingEditRef = useRef<{
    message: string
    fileAttachments?: any[]
    contexts?: any[]
  } | null>(null)

  const { revertToCheckpoint, currentChat } = useCopilotStore()

  /**
   * Handles initiating checkpoint revert
   */
  const handleRevertToCheckpoint = useCallback(() => {
    setShowRestoreConfirmation(true)
    onRevertModeChange?.(true)
  }, [onRevertModeChange])

  /**
   * Confirms checkpoint revert and updates state
   */
  const handleConfirmRevert = useCallback(async () => {
    if (messageCheckpoints.length > 0) {
      const latestCheckpoint = messageCheckpoints[0]
      try {
        await revertToCheckpoint(latestCheckpoint.id)

        const { messageCheckpoints: currentCheckpoints } = useCopilotStore.getState()
        const updatedCheckpoints = {
          ...currentCheckpoints,
          [message.id]: messageCheckpoints.slice(1),
        }
        useCopilotStore.setState({ messageCheckpoints: updatedCheckpoints })

        const currentMessages = messages
        const revertIndex = currentMessages.findIndex((m) => m.id === message.id)
        if (revertIndex !== -1) {
          const truncatedMessages = currentMessages.slice(0, revertIndex + 1)
          useCopilotStore.setState({ messages: truncatedMessages })

          if (currentChat?.id) {
            try {
              await fetch('/api/copilot/chat/update-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chatId: currentChat.id,
                  messages: truncatedMessages.map((m) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp,
                    ...(m.contentBlocks && { contentBlocks: m.contentBlocks }),
                    ...(m.fileAttachments && { fileAttachments: m.fileAttachments }),
                    ...((m as any).contexts && { contexts: (m as any).contexts }),
                  })),
                }),
              })
            } catch (error) {
              logger.error('Failed to update messages in DB after revert:', error)
            }
          }
        }

        setShowRestoreConfirmation(false)
        onRevertModeChange?.(false)
        onEditModeChange?.(true)

        logger.info('Checkpoint reverted and removed from message', {
          messageId: message.id,
          checkpointId: latestCheckpoint.id,
        })
      } catch (error) {
        logger.error('Failed to revert to checkpoint:', error)
        setShowRestoreConfirmation(false)
        onRevertModeChange?.(false)
      }
    }
  }, [
    messageCheckpoints,
    revertToCheckpoint,
    message.id,
    messages,
    currentChat,
    onRevertModeChange,
    onEditModeChange,
  ])

  /**
   * Cancels checkpoint revert
   */
  const handleCancelRevert = useCallback(() => {
    setShowRestoreConfirmation(false)
    onRevertModeChange?.(false)
  }, [onRevertModeChange])

  /**
   * Handles "Continue and revert" action for checkpoint discard modal
   * Reverts to checkpoint then proceeds with pending edit
   */
  const handleContinueAndRevert = useCallback(async () => {
    if (messageCheckpoints.length > 0) {
      const latestCheckpoint = messageCheckpoints[0]
      try {
        await revertToCheckpoint(latestCheckpoint.id)

        const { messageCheckpoints: currentCheckpoints } = useCopilotStore.getState()
        const updatedCheckpoints = {
          ...currentCheckpoints,
          [message.id]: messageCheckpoints.slice(1),
        }
        useCopilotStore.setState({ messageCheckpoints: updatedCheckpoints })

        logger.info('Reverted to checkpoint before editing message', {
          messageId: message.id,
          checkpointId: latestCheckpoint.id,
        })
      } catch (error) {
        logger.error('Failed to revert to checkpoint:', error)
      }
    }

    setShowCheckpointDiscardModal(false)

    const { sendMessage } = useCopilotStore.getState()
    if (pendingEditRef.current) {
      const { message: msg, fileAttachments, contexts } = pendingEditRef.current
      const editIndex = messages.findIndex((m) => m.id === message.id)
      if (editIndex !== -1) {
        const truncatedMessages = messages.slice(0, editIndex)
        const updatedMessage = {
          ...message,
          content: msg,
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
        }
        useCopilotStore.setState({ messages: [...truncatedMessages, updatedMessage] })

        await sendMessage(msg, {
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
          messageId: message.id,
        })
      }
      pendingEditRef.current = null
    }
  }, [messageCheckpoints, revertToCheckpoint, message, messages])

  /**
   * Cancels checkpoint discard and clears pending edit
   */
  const handleCancelCheckpointDiscard = useCallback(() => {
    setShowCheckpointDiscardModal(false)
    pendingEditRef.current = null
  }, [])

  /**
   * Continues with edit WITHOUT reverting checkpoint
   */
  const handleContinueWithoutRevert = useCallback(async () => {
    setShowCheckpointDiscardModal(false)

    if (pendingEditRef.current) {
      const { message: msg, fileAttachments, contexts } = pendingEditRef.current
      const { sendMessage } = useCopilotStore.getState()
      const editIndex = messages.findIndex((m) => m.id === message.id)
      if (editIndex !== -1) {
        const truncatedMessages = messages.slice(0, editIndex)
        const updatedMessage = {
          ...message,
          content: msg,
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
        }
        useCopilotStore.setState({ messages: [...truncatedMessages, updatedMessage] })

        await sendMessage(msg, {
          fileAttachments: fileAttachments || message.fileAttachments,
          contexts: contexts || (message as any).contexts,
          messageId: message.id,
        })
      }
      pendingEditRef.current = null
    }
  }, [message, messages])

  /**
   * Handles keyboard events for restore confirmation (Escape/Enter)
   */
  useEffect(() => {
    if (!showRestoreConfirmation) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelRevert()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        handleConfirmRevert()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showRestoreConfirmation, handleCancelRevert, handleConfirmRevert])

  /**
   * Handles keyboard events for checkpoint discard modal (Escape/Enter)
   */
  useEffect(() => {
    if (!showCheckpointDiscardModal) return

    const handleCheckpointDiscardKeyDown = async (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelCheckpointDiscard()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        await handleContinueAndRevert()
      }
    }

    document.addEventListener('keydown', handleCheckpointDiscardKeyDown)
    return () => document.removeEventListener('keydown', handleCheckpointDiscardKeyDown)
  }, [showCheckpointDiscardModal, handleCancelCheckpointDiscard, handleContinueAndRevert])

  return {
    // State
    showRestoreConfirmation,
    showCheckpointDiscardModal,
    pendingEditRef,

    // Operations
    setShowCheckpointDiscardModal,
    handleRevertToCheckpoint,
    handleConfirmRevert,
    handleCancelRevert,
    handleCancelCheckpointDiscard,
    handleContinueWithoutRevert,
    handleContinueAndRevert,
  }
}
```

--------------------------------------------------------------------------------

````
