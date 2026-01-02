---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 403
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 403 of 933)

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

---[FILE: use-mention-menu.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-mention-menu.ts
Signals: React

```typescript
import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import type { ChatContext } from '@/stores/panel/copilot/types'
import { SCROLL_TOLERANCE } from '../constants'

const logger = createLogger('useMentionMenu')

interface UseMentionMenuProps {
  /** Current message text */
  message: string
  /** Currently selected contexts */
  selectedContexts: ChatContext[]
  /** Callback when a context is selected */
  onContextSelect: (context: ChatContext) => void
  /** Callback when message changes */
  onMessageChange: (message: string) => void
}

/**
 * Custom hook to manage mention menu state and navigation.
 * Handles showing/hiding the menu, tracking active items, and keyboard navigation.
 *
 * @param props - Configuration object
 * @returns Mention menu state and operations
 */
export function useMentionMenu({
  message,
  selectedContexts,
  onContextSelect,
  onMessageChange,
}: UseMentionMenuProps) {
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mentionMenuRef = useRef<HTMLDivElement>(null)
  const mentionPortalRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)
  const menuListRef = useRef<HTMLDivElement>(null)

  // State
  const [showMentionMenu, setShowMentionMenu] = useState(false)
  const [openSubmenuFor, setOpenSubmenuFor] = useState<string | null>(null)
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0)
  const [submenuActiveIndex, setSubmenuActiveIndex] = useState(0)
  const [submenuQueryStart, setSubmenuQueryStart] = useState<number | null>(null)
  const [inAggregated, setInAggregated] = useState(false)

  /**
   * Gets the current caret position in the textarea
   *
   * @returns Current caret position in the message
   */
  const getCaretPos = useCallback(() => {
    return textareaRef.current?.selectionStart ?? message.length
  }, [message.length])

  /**
   * Finds active mention query at the given position
   *
   * @param pos - Position in the text to check
   * @param textOverride - Optional text override (for checking during input)
   * @returns Active mention query object or null if no active mention
   */
  const getActiveMentionQueryAtPosition = useCallback(
    (pos: number, textOverride?: string) => {
      const text = textOverride ?? message
      const before = text.slice(0, pos)
      const atIndex = before.lastIndexOf('@')
      if (atIndex === -1) return null

      // Ensure '@' starts a token (start or whitespace before)
      if (atIndex > 0 && !/\s/.test(before.charAt(atIndex - 1))) return null

      // Check if this '@' is part of a completed mention token ( @label )
      if (selectedContexts.length > 0) {
        const labels = selectedContexts.map((c) => c.label).filter(Boolean) as string[]
        for (const label of labels) {
          // Space-wrapped token: " @label "
          const token = ` @${label} `
          let fromIndex = 0
          while (fromIndex <= text.length) {
            const idx = text.indexOf(token, fromIndex)
            if (idx === -1) break

            const tokenStart = idx
            const tokenEnd = idx + token.length
            const atPositionInToken = idx + 1 // position of @ in " @label "

            // Check if the @ we found is the @ of this completed token
            if (atIndex === atPositionInToken) {
              // The @ we found is part of a completed mention
              // Don't show menu - user is typing after the completed mention
              return null
            }

            // Also check if cursor is inside the completed token (including spaces)
            if (pos > tokenStart && pos < tokenEnd) {
              return null
            }

            fromIndex = tokenEnd
          }
        }
      }

      const segment = before.slice(atIndex + 1)
      // Close the popup if user types space immediately after @
      if (segment.length > 0 && /^\s/.test(segment)) {
        return null
      }

      return { query: segment, start: atIndex, end: pos }
    },
    [message, selectedContexts]
  )

  /**
   * Gets the submenu query text
   *
   * @returns Text typed after entering a submenu
   */
  const getSubmenuQuery = useCallback(() => {
    const pos = getCaretPos()
    if (submenuQueryStart == null) return ''
    return message.slice(submenuQueryStart, pos)
  }, [getCaretPos, message, submenuQueryStart])

  /**
   * Resets active mention query keeping only the '@'
   */
  const resetActiveMentionQuery = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    const pos = textarea.selectionStart ?? message.length
    const active = getActiveMentionQueryAtPosition(pos)
    if (!active) return

    const before = message.slice(0, active.start + 1)
    const after = message.slice(active.end)
    const next = `${before}${after}`
    onMessageChange(next)

    setTimeout(() => {
      const caretPos = before.length
      textarea.setSelectionRange(caretPos, caretPos)
      textarea.focus()
    }, 0)
  }, [message, getActiveMentionQueryAtPosition, onMessageChange])

  /**
   * Inserts text at the current cursor position
   *
   * @param text - Text to insert (e.g., " @Docs ")
   */
  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart ?? message.length
      const end = textarea.selectionEnd ?? message.length
      let before = message.slice(0, start)
      const after = message.slice(end)

      // Avoid duplicate '@' if user typed trigger
      if (before.endsWith('@') && text.startsWith('@')) {
        before = before.slice(0, -1)
      }

      // Avoid duplicate leading space
      let insertText = text
      if (before.length > 0 && before.endsWith(' ') && text.startsWith(' ')) {
        insertText = text.slice(1)
      }

      const next = `${before}${insertText}${after}`
      onMessageChange(next)
      // Move cursor to after inserted text
      setTimeout(() => {
        const pos = before.length + insertText.length
        textarea.setSelectionRange(pos, pos)
        textarea.focus()
      }, 0)
    },
    [message, onMessageChange]
  )

  /**
   * Replaces active mention with a label
   *
   * @param label - Label to replace the mention with
   * @returns True if replacement was successful, false if no active mention found
   */
  const replaceActiveMentionWith = useCallback(
    (label: string) => {
      const textarea = textareaRef.current
      if (!textarea) return false
      const pos = textarea.selectionStart ?? message.length
      const active = getActiveMentionQueryAtPosition(pos)
      if (!active) return false

      const before = message.slice(0, active.start)
      const after = message.slice(active.end)

      // Always include leading space, avoid duplicate if one exists
      const needsLeadingSpace = !before.endsWith(' ')
      const insertion = `${needsLeadingSpace ? ' ' : ''}@${label} `

      const next = `${before}${insertion}${after}`
      onMessageChange(next)

      setTimeout(() => {
        const cursorPos = before.length + insertion.length
        textarea.setSelectionRange(cursorPos, cursorPos)
        textarea.focus()
      }, 0)
      return true
    },
    [message, getActiveMentionQueryAtPosition, onMessageChange]
  )

  /**
   * Scrolls active item into view in the menu
   *
   * @param index - Index of the item to scroll into view
   */
  const scrollActiveItemIntoView = useCallback((index: number) => {
    const container = menuListRef.current
    if (!container) return
    const item = container.querySelector(`[data-idx="${index}"]`) as HTMLElement | null
    if (!item) return

    const tolerance = SCROLL_TOLERANCE
    const itemTop = item.offsetTop
    const itemBottom = itemTop + item.offsetHeight
    const viewTop = container.scrollTop
    const viewBottom = viewTop + container.clientHeight
    const needsScrollUp = itemTop < viewTop + tolerance
    const needsScrollDown = itemBottom > viewBottom - tolerance

    if (needsScrollUp || needsScrollDown) {
      if (needsScrollUp) {
        container.scrollTop = Math.max(0, itemTop - tolerance)
      } else {
        container.scrollTop = itemBottom + tolerance - container.clientHeight
      }
    }
  }, [])

  /**
   * Closes mention menu
   */
  const closeMentionMenu = useCallback(() => {
    setShowMentionMenu(false)
    setOpenSubmenuFor(null)
    setSubmenuQueryStart(null)
    setMentionActiveIndex(0)
    setSubmenuActiveIndex(0)
    setInAggregated(false)
  }, [])

  // Close mention menu on outside click
  useEffect(() => {
    if (!showMentionMenu) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (
        mentionMenuRef.current &&
        !mentionMenuRef.current.contains(target) &&
        (!mentionPortalRef.current || !mentionPortalRef.current.contains(target)) &&
        (!submenuRef.current || !submenuRef.current.contains(target)) &&
        textareaRef.current &&
        !textareaRef.current.contains(target as Node)
      ) {
        closeMentionMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMentionMenu, closeMentionMenu])

  return {
    // Refs
    textareaRef,
    mentionMenuRef,
    menuListRef,

    // State
    showMentionMenu,
    openSubmenuFor,
    mentionActiveIndex,
    submenuActiveIndex,
    submenuQueryStart,
    inAggregated,

    // Setters
    setShowMentionMenu,
    setOpenSubmenuFor,
    setMentionActiveIndex,
    setSubmenuActiveIndex,
    setSubmenuQueryStart,
    setInAggregated,

    // Operations
    getCaretPos,
    getActiveMentionQueryAtPosition,
    getSubmenuQuery,
    resetActiveMentionQuery,
    insertAtCursor,
    replaceActiveMentionWith,
    scrollActiveItemIntoView,
    closeMentionMenu,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-mention-tokens.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-mention-tokens.ts
Signals: React

```typescript
import { useCallback } from 'react'
import type { useMentionMenu } from '@/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-mention-menu'
import type { ChatContext } from '@/stores/panel/copilot/types'

interface UseMentionTokensProps {
  /** Current message text */
  message: string
  /** Currently selected contexts */
  selectedContexts: ChatContext[]
  /** Mention menu hook instance */
  mentionMenu: ReturnType<typeof useMentionMenu>
  /** Callback to update message */
  setMessage: (message: string) => void
  /** Callback to update selected contexts */
  setSelectedContexts: React.Dispatch<React.SetStateAction<ChatContext[]>>
}

/**
 * Represents a mention token range in the message text
 */
export interface MentionRange {
  start: number
  end: number
  label: string
}

/**
 * Custom hook to manage mention token ranges and manipulation.
 * Handles computing mention ranges, deleting tokens, and preventing editing inside tokens.
 *
 * @param props - Configuration object
 * @returns Mention token utilities
 */
export function useMentionTokens({
  message,
  selectedContexts,
  mentionMenu,
  setMessage,
  setSelectedContexts,
}: UseMentionTokensProps) {
  /**
   * Computes all mention ranges in the message
   *
   * @returns Array of mention ranges sorted by start position
   */
  const computeMentionRanges = useCallback((): MentionRange[] => {
    const ranges: MentionRange[] = []
    if (!message || selectedContexts.length === 0) return ranges

    const labels = selectedContexts.map((c) => c.label).filter(Boolean)
    if (labels.length === 0) return ranges

    // Deduplicate labels to avoid finding the same token multiple times
    // when multiple contexts share the same label
    const uniqueLabels = Array.from(new Set(labels))

    for (const label of uniqueLabels) {
      // Space-wrapped token: " @label " (search from start)
      const token = ` @${label} `
      let fromIndex = 0
      while (fromIndex <= message.length) {
        const idx = message.indexOf(token, fromIndex)
        if (idx === -1) break
        // Include both leading and trailing spaces in the range
        ranges.push({ start: idx, end: idx + token.length, label })
        fromIndex = idx + token.length
      }
    }

    ranges.sort((a, b) => a.start - b.start)
    return ranges
  }, [message, selectedContexts])

  /**
   * Finds a mention range containing the given position
   *
   * @param pos - Position to check
   * @returns Mention range if found, undefined otherwise
   */
  const findRangeContaining = useCallback(
    (pos: number): MentionRange | undefined => {
      const ranges = computeMentionRanges()
      return ranges.find((r) => pos > r.start && pos < r.end)
    },
    [computeMentionRanges]
  )

  /**
   * Removes contexts for mention tokens that overlap with a text selection
   *
   * @param selStart - Selection start position
   * @param selEnd - Selection end position
   */
  const removeContextsInSelection = useCallback(
    (selStart: number, selEnd: number) => {
      const ranges = computeMentionRanges()
      const overlappingRanges = ranges.filter((r) => !(selEnd <= r.start || selStart >= r.end))

      if (overlappingRanges.length > 0) {
        const labelsToRemove = new Set(overlappingRanges.map((r) => r.label))
        setSelectedContexts((prev) => prev.filter((c) => !c.label || !labelsToRemove.has(c.label)))
      }
    },
    [computeMentionRanges, setSelectedContexts]
  )

  /**
   * Deletes a single mention range and its context (for atomic token deletion)
   *
   * @param range - The range to delete
   */
  const deleteRange = useCallback(
    (range: MentionRange) => {
      const textarea = mentionMenu.textareaRef.current
      if (!textarea) return

      const before = message.slice(0, range.start)
      const after = message.slice(range.end)
      const next = `${before}${after}`.replace(/\s{2,}/g, ' ')
      setMessage(next)

      setSelectedContexts((prev) => prev.filter((c) => c.label !== range.label))

      // Set cursor position immediately after state update
      setTimeout(() => {
        textarea.setSelectionRange(range.start, range.start)
        textarea.focus()
      }, 0)
    },
    [message, setMessage, mentionMenu.textareaRef, setSelectedContexts]
  )

  /**
   * Handles cut operations to remove contexts for cut mention tokens
   *
   * @param e - Clipboard event
   */
  const handleCut = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const textarea = mentionMenu.textareaRef.current
      if (!textarea) return

      const selStart = textarea.selectionStart ?? 0
      const selEnd = textarea.selectionEnd ?? selStart
      const selectionLength = Math.abs(selEnd - selStart)

      if (selectionLength > 0) {
        removeContextsInSelection(selStart, selEnd)
      }
    },
    [mentionMenu.textareaRef, removeContextsInSelection]
  )

  return {
    computeMentionRanges,
    findRangeContaining,
    removeContextsInSelection,
    deleteRange,
    handleCut,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-textarea-auto-resize.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/user-input/hooks/use-textarea-auto-resize.ts
Signals: React

```typescript
'use client'

import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Maximum textarea height in pixels
 */
const MAX_TEXTAREA_HEIGHT = 120

interface UseTextareaAutoResizeProps {
  /** Current message content */
  message: string
  /** Width of the panel */
  panelWidth: number
  /** Selected mention contexts */
  selectedContexts: any[]
  /** External textarea ref to sync with */
  textareaRef: RefObject<HTMLTextAreaElement | null>
  /** Container ref for observing layout shifts */
  containerRef: HTMLDivElement | null
}

/**
 * Custom hook to auto-resize textarea and sync with overlay.
 * Uses ResizeObserver for accurate, event-driven synchronization without arbitrary timeouts.
 *
 * @param props - Configuration object
 * @returns Overlay ref for highlight rendering
 */
export function useTextareaAutoResize({
  message,
  panelWidth,
  selectedContexts,
  textareaRef,
  containerRef,
}: UseTextareaAutoResizeProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const containerResizeObserverRef = useRef<ResizeObserver | null>(null)
  const textareaResizeObserverRef = useRef<ResizeObserver | null>(null)

  /**
   * Syncs all styles and dimensions between textarea and overlay.
   * Called immediately when DOM changes are detected.
   */
  const syncOverlayStyles = useRef(() => {
    const textarea = textareaRef.current
    const overlay = overlayRef.current
    if (!textarea || !overlay || typeof window === 'undefined') return

    const styles = window.getComputedStyle(textarea)

    // Copy all text rendering properties exactly (but NOT color - overlay needs visible text)
    overlay.style.font = styles.font
    overlay.style.fontSize = styles.fontSize
    overlay.style.fontFamily = styles.fontFamily
    overlay.style.fontWeight = styles.fontWeight
    overlay.style.fontStyle = styles.fontStyle
    overlay.style.fontVariant = styles.fontVariant
    overlay.style.letterSpacing = styles.letterSpacing
    overlay.style.lineHeight = styles.lineHeight
    overlay.style.fontKerning = (styles as any).fontKerning ?? ''
    overlay.style.fontFeatureSettings = (styles as any).fontFeatureSettings ?? ''
    overlay.style.textRendering = (styles as any).textRendering ?? ''
    ;(overlay.style as any).tabSize = (styles as any).tabSize ?? ''
    ;(overlay.style as any).MozTabSize = (styles as any).MozTabSize ?? ''
    overlay.style.textTransform = styles.textTransform
    overlay.style.textIndent = styles.textIndent

    // Copy box model properties exactly to ensure identical text flow
    overlay.style.padding = styles.padding
    overlay.style.paddingTop = styles.paddingTop
    overlay.style.paddingRight = styles.paddingRight
    overlay.style.paddingBottom = styles.paddingBottom
    overlay.style.paddingLeft = styles.paddingLeft
    overlay.style.margin = styles.margin
    overlay.style.marginTop = styles.marginTop
    overlay.style.marginRight = styles.marginRight
    overlay.style.marginBottom = styles.marginBottom
    overlay.style.marginLeft = styles.marginLeft
    overlay.style.border = styles.border
    overlay.style.borderWidth = styles.borderWidth

    // Copy text wrapping and breaking properties
    overlay.style.whiteSpace = styles.whiteSpace
    overlay.style.wordBreak = styles.wordBreak
    overlay.style.wordWrap = styles.wordWrap
    overlay.style.overflowWrap = styles.overflowWrap
    overlay.style.textAlign = styles.textAlign
    overlay.style.boxSizing = styles.boxSizing
    overlay.style.borderRadius = styles.borderRadius
    overlay.style.direction = styles.direction
    overlay.style.hyphens = (styles as any).hyphens ?? ''

    // Critical: Match dimensions exactly
    const textareaWidth = textarea.clientWidth
    const textareaHeight = textarea.clientHeight

    overlay.style.width = `${textareaWidth}px`
    overlay.style.height = `${textareaHeight}px`

    // Match max-height behavior
    const computedMaxHeight = styles.maxHeight
    if (computedMaxHeight && computedMaxHeight !== 'none') {
      overlay.style.maxHeight = computedMaxHeight
    }

    // Ensure scroll positions are perfectly synced
    overlay.scrollTop = textarea.scrollTop
    overlay.scrollLeft = textarea.scrollLeft
  })

  /**
   * Auto-resize textarea based on content.
   * Uses useLayoutEffect to run synchronously AFTER DOM mutations but BEFORE browser paint.
   * This ensures we sync after React commits changes to the DOM.
   */
  useLayoutEffect(() => {
    const textarea = textareaRef.current
    const overlay = overlayRef.current
    if (!textarea || !overlay) return

    // Store current cursor position to determine if user is typing at the end
    const cursorPos = textarea.selectionStart ?? 0
    const isAtEnd = cursorPos === message.length
    const wasScrolledToBottom =
      textarea.scrollHeight - textarea.scrollTop - textarea.clientHeight < 5

    // Reset height to auto to get proper scrollHeight
    textarea.style.height = 'auto'
    overlay.style.height = 'auto'

    // Force a reflow to ensure accurate scrollHeight
    void textarea.offsetHeight
    void overlay.offsetHeight

    // Get the scroll height (this includes all content, including trailing newlines)
    const scrollHeight = textarea.scrollHeight
    const nextHeight = Math.min(scrollHeight, MAX_TEXTAREA_HEIGHT)

    // Apply height to BOTH elements simultaneously
    const heightString = `${nextHeight}px`
    const overflowString = scrollHeight > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden'

    textarea.style.height = heightString
    textarea.style.overflowY = overflowString
    overlay.style.height = heightString
    overlay.style.overflowY = overflowString

    // Force another reflow after height change
    void textarea.offsetHeight
    void overlay.offsetHeight

    // Maintain scroll behavior: if user was at bottom or typing at end, keep them at bottom
    if ((isAtEnd || wasScrolledToBottom) && scrollHeight > nextHeight) {
      const scrollValue = scrollHeight
      textarea.scrollTop = scrollValue
      overlay.scrollTop = scrollValue
    } else {
      // Otherwise, sync scroll positions
      overlay.scrollTop = textarea.scrollTop
      overlay.scrollLeft = textarea.scrollLeft
    }

    // Sync all other styles after height change
    syncOverlayStyles.current()
  }, [message, selectedContexts, textareaRef])

  /**
   * Sync scroll position between textarea and overlay
   */
  useEffect(() => {
    const textarea = textareaRef.current
    const overlay = overlayRef.current

    if (!textarea || !overlay) return

    const handleScroll = () => {
      overlay.scrollTop = textarea.scrollTop
      overlay.scrollLeft = textarea.scrollLeft
    }

    textarea.addEventListener('scroll', handleScroll, { passive: true })
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [textareaRef])

  /**
   * Setup ResizeObserver on the CONTAINER to catch layout shifts when pills wrap.
   * This is critical because when pills wrap, the textarea moves but doesn't resize.
   */
  useLayoutEffect(() => {
    const textarea = textareaRef.current
    const overlay = overlayRef.current
    if (!textarea || !overlay || !containerRef || typeof window === 'undefined') return

    // Initial sync
    syncOverlayStyles.current()

    // Observe the CONTAINER - when pills wrap, container height changes
    if (typeof ResizeObserver !== 'undefined' && !containerResizeObserverRef.current) {
      containerResizeObserverRef.current = new ResizeObserver(() => {
        // Container size changed (pills wrapped) - sync immediately
        syncOverlayStyles.current()
      })
      containerResizeObserverRef.current.observe(containerRef)
    }

    // ALSO observe the textarea for its own size changes
    if (typeof ResizeObserver !== 'undefined' && !textareaResizeObserverRef.current) {
      textareaResizeObserverRef.current = new ResizeObserver(() => {
        syncOverlayStyles.current()
      })
      textareaResizeObserverRef.current.observe(textarea)
    }

    // Setup MutationObserver to detect style changes
    const mutationObserver = new MutationObserver(() => {
      syncOverlayStyles.current()
    })
    mutationObserver.observe(textarea, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })

    // Listen to window resize events (for browser window resizing)
    const handleResize = () => syncOverlayStyles.current()
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      mutationObserver.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [panelWidth, textareaRef, containerRef])

  /**
   * Cleanup ResizeObservers on unmount
   */
  useEffect(() => {
    return () => {
      if (containerResizeObserverRef.current) {
        containerResizeObserverRef.current.disconnect()
        containerResizeObserverRef.current = null
      }
      if (textareaResizeObserverRef.current) {
        textareaResizeObserverRef.current.disconnect()
        textareaResizeObserverRef.current = null
      }
    }
  }, [])

  return {
    overlayRef,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: welcome.tsx]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/components/welcome/welcome.tsx

```typescript
'use client'

import { Button } from '@/components/emcn'

/**
 * Props for the CopilotWelcome component
 */
interface WelcomeProps {
  /** Callback when a suggested question is clicked */
  onQuestionClick?: (question: string) => void
  /** Current copilot mode ('ask' for Q&A, 'plan' for planning, 'build' for workflow building) */
  mode?: 'ask' | 'build' | 'plan'
}

/**
 * Welcome screen component for the copilot
 * Displays suggested questions and capabilities based on current mode
 *
 * @param props - Component props
 * @returns Welcome screen UI
 */
export function Welcome({ onQuestionClick, mode = 'ask' }: WelcomeProps) {
  const capabilities =
    mode === 'build'
      ? [
          {
            title: 'Build',
            question: 'Help me build a workflow',
          },
          {
            title: 'Debug',
            question: 'Help debug my workflow',
          },
          {
            title: 'Optimize',
            question: 'Create a fast workflow',
          },
        ]
      : [
          {
            title: 'Get started',
            question: 'Help me get started',
          },
          {
            title: 'Discover tools',
            question: 'What tools are available?',
          },
          {
            title: 'Create workflow',
            question: 'How do I create a workflow?',
          },
        ]

  return (
    <div className='flex w-full flex-col items-center'>
      {/* Unified capability cards */}
      <div className='flex w-full flex-col items-center gap-[8px]'>
        {capabilities.map(({ title, question }, idx) => (
          <Button
            key={idx}
            variant='active'
            onClick={() => onQuestionClick?.(question)}
            className='w-full justify-start'
          >
            <div className='flex flex-col items-start'>
              <p className='font-medium'>{title}</p>
              <p className='text-[var(--text-secondary)]'>{question}</p>
            </div>
          </Button>
        ))}
      </div>

      {/* Tips */}
      <p className='pt-[12px] text-center text-[13px] text-[var(--text-secondary)]'>
        Tip: Use <span className='font-medium'>@</span> to reference chats, workflows, knowledge,
        blocks, or templates
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/hooks/index.ts

```typescript
export { useChatHistory } from './use-chat-history'
export { useCopilotInitialization } from './use-copilot-initialization'
export { useLandingPrompt } from './use-landing-prompt'
export { useTodoManagement } from './use-todo-management'
```

--------------------------------------------------------------------------------

---[FILE: use-chat-history.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/hooks/use-chat-history.ts
Signals: React

```typescript
'use client'

import { useCallback, useMemo } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useChatHistory')

interface UseChatHistoryProps {
  chats: any[]
  activeWorkflowId: string | null
  copilotWorkflowId: string | null
  loadChats: (forceRefresh: boolean) => Promise<void>
  areChatsFresh: (workflowId: string) => boolean
  isSendingMessage: boolean
}

/**
 * Custom hook to manage chat history grouping and loading
 *
 * @param props - Chat history configuration
 * @returns Chat history utilities
 */
export function useChatHistory(props: UseChatHistoryProps) {
  const { chats, activeWorkflowId, copilotWorkflowId, loadChats, areChatsFresh, isSendingMessage } =
    props

  /**
   * Groups chats by time period (Today, Yesterday, This Week, etc.)
   */
  const groupedChats = useMemo(() => {
    if (!activeWorkflowId || copilotWorkflowId !== activeWorkflowId || chats.length === 0) {
      return []
    }

    const filteredChats = chats
    if (filteredChats.length === 0) {
      return []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups: Record<string, typeof filteredChats> = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      'Last Week': [],
      Older: [],
    }

    filteredChats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt)
      const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

      if (chatDay.getTime() === today.getTime()) {
        groups.Today.push(chat)
      } else if (chatDay.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(chat)
      } else if (chatDay.getTime() >= thisWeekStart.getTime()) {
        groups['This Week'].push(chat)
      } else if (chatDay.getTime() >= lastWeekStart.getTime()) {
        groups['Last Week'].push(chat)
      } else {
        groups.Older.push(chat)
      }
    })

    return Object.entries(groups).filter(([, chats]) => chats.length > 0)
  }, [chats, activeWorkflowId, copilotWorkflowId])

  /**
   * Handles history dropdown opening and loads chats if needed
   * Does not await loading - fires in background to avoid blocking UI
   */
  const handleHistoryDropdownOpen = useCallback(
    (open: boolean) => {
      // Only load if opening dropdown AND we don't have fresh chats AND not streaming
      if (open && activeWorkflowId && !isSendingMessage && !areChatsFresh(activeWorkflowId)) {
        // Fire in background, don't await - same pattern as old panel
        loadChats(false).catch((error) => {
          logger.error('Failed to load chat history:', error)
        })
      }

      if (open && isSendingMessage) {
        logger.info('Chat history opened during stream - showing cached data only')
      }
    },
    [activeWorkflowId, areChatsFresh, isSendingMessage, loadChats]
  )

  return {
    groupedChats,
    handleHistoryDropdownOpen,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-copilot-initialization.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/hooks/use-copilot-initialization.ts
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useCopilotInitialization')

interface UseCopilotInitializationProps {
  activeWorkflowId: string | null
  isLoadingChats: boolean
  chatsLoadedForWorkflow: string | null
  setCopilotWorkflowId: (workflowId: string | null) => Promise<void>
  loadChats: (forceRefresh?: boolean) => Promise<void>
  fetchContextUsage: () => Promise<void>
  loadAutoAllowedTools: () => Promise<void>
  currentChat: any
  isSendingMessage: boolean
}

/**
 * Custom hook to handle copilot initialization and workflow setup
 *
 * @param props - Configuration for copilot initialization
 * @returns Initialization state
 */
export function useCopilotInitialization(props: UseCopilotInitializationProps) {
  const {
    activeWorkflowId,
    isLoadingChats,
    chatsLoadedForWorkflow,
    setCopilotWorkflowId,
    loadChats,
    fetchContextUsage,
    loadAutoAllowedTools,
    currentChat,
    isSendingMessage,
  } = props

  const [isInitialized, setIsInitialized] = useState(false)
  const lastWorkflowIdRef = useRef<string | null>(null)
  const hasMountedRef = useRef(false)

  /**
   * Initialize on mount - only load chats if needed, don't force refresh
   * This prevents unnecessary reloads when the component remounts (e.g., hot reload)
   * Never loads during message streaming to prevent interrupting active conversations
   */
  useEffect(() => {
    if (activeWorkflowId && !hasMountedRef.current && !isSendingMessage) {
      hasMountedRef.current = true
      setIsInitialized(false)
      lastWorkflowIdRef.current = null

      setCopilotWorkflowId(activeWorkflowId)
      // Use false to let the store decide if a reload is needed based on cache
      loadChats(false)
    }
  }, [activeWorkflowId, setCopilotWorkflowId, loadChats, isSendingMessage])

  /**
   * Initialize the component - only on mount and genuine workflow changes
   * Prevents re-initialization on every render or tab switch
   * Never reloads during message streaming to preserve active conversations
   */
  useEffect(() => {
    // Handle genuine workflow changes (not initial mount, not same workflow)
    // Only reload if not currently streaming to avoid interrupting conversations
    if (
      activeWorkflowId &&
      activeWorkflowId !== lastWorkflowIdRef.current &&
      hasMountedRef.current &&
      lastWorkflowIdRef.current !== null && // Only if we've tracked a workflow before
      !isSendingMessage // Don't reload during active streaming
    ) {
      logger.info('Workflow changed, resetting initialization', {
        from: lastWorkflowIdRef.current,
        to: activeWorkflowId,
      })
      setIsInitialized(false)
      lastWorkflowIdRef.current = activeWorkflowId
      setCopilotWorkflowId(activeWorkflowId)
      loadChats(false)
    }

    // Mark as initialized when chats are loaded for the active workflow
    if (
      activeWorkflowId &&
      !isLoadingChats &&
      chatsLoadedForWorkflow === activeWorkflowId &&
      !isInitialized
    ) {
      setIsInitialized(true)
      lastWorkflowIdRef.current = activeWorkflowId
    }
  }, [
    activeWorkflowId,
    isLoadingChats,
    chatsLoadedForWorkflow,
    isInitialized,
    setCopilotWorkflowId,
    loadChats,
    isSendingMessage,
  ])

  /**
   * Fetch context usage when component is initialized and has a current chat
   */
  useEffect(() => {
    if (isInitialized && currentChat?.id && activeWorkflowId) {
      logger.info('[Copilot] Component initialized, fetching context usage')
      fetchContextUsage().catch((err) => {
        logger.warn('[Copilot] Failed to fetch context usage on mount', err)
      })
    }
  }, [isInitialized, currentChat?.id, activeWorkflowId, fetchContextUsage])

  /**
   * Load auto-allowed tools once on mount
   */
  const hasLoadedAutoAllowedToolsRef = useRef(false)
  useEffect(() => {
    if (hasMountedRef.current && !hasLoadedAutoAllowedToolsRef.current) {
      hasLoadedAutoAllowedToolsRef.current = true
      loadAutoAllowedTools().catch((err) => {
        logger.warn('[Copilot] Failed to load auto-allowed tools', err)
      })
    }
  }, [loadAutoAllowedTools])

  return {
    isInitialized,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-landing-prompt.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/hooks/use-landing-prompt.ts
Signals: React

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { LandingPromptStorage } from '@/lib/core/utils/browser-storage'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('useLandingPrompt')

interface UseLandingPromptProps {
  /**
   * Whether the copilot is fully initialized and ready to receive input
   */
  isInitialized: boolean

  /**
   * Callback to set the input value in the copilot
   */
  setInputValue: (value: string) => void

  /**
   * Callback to focus the copilot input
   */
  focusInput: () => void

  /**
   * Whether a message is currently being sent (prevents overwriting during active chat)
   */
  isSendingMessage: boolean

  /**
   * Current input value (to avoid overwriting if user has already typed)
   */
  currentInputValue: string
}

/**
 * Custom hook to handle landing page prompt retrieval and population
 *
 * When a user enters a prompt on the landing page and signs up/logs in,
 * this hook retrieves that prompt from localStorage and populates it
 * in the copilot input once the copilot is initialized.
 *
 * @param props - Configuration for landing prompt handling
 */
export function useLandingPrompt(props: UseLandingPromptProps) {
  const { isInitialized, setInputValue, focusInput, isSendingMessage, currentInputValue } = props

  const hasCheckedRef = useRef(false)

  useEffect(() => {
    // Only check once when copilot is first initialized
    if (!isInitialized || hasCheckedRef.current || isSendingMessage) {
      return
    }

    // If user has already started typing, don't override
    if (currentInputValue && currentInputValue.trim().length > 0) {
      hasCheckedRef.current = true
      return
    }

    // Try to retrieve the stored prompt (max age: 24 hours)
    const prompt = LandingPromptStorage.consume()

    if (prompt) {
      logger.info('Retrieved landing page prompt, populating copilot input')
      setInputValue(prompt)

      // Focus the input after a brief delay to ensure DOM is ready
      setTimeout(() => {
        focusInput()
      }, 150)
    }

    hasCheckedRef.current = true
  }, [isInitialized, setInputValue, focusInput, isSendingMessage, currentInputValue])
}
```

--------------------------------------------------------------------------------

---[FILE: use-todo-management.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/components/copilot/hooks/use-todo-management.ts
Signals: React

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

interface UseTodoManagementProps {
  isSendingMessage: boolean
  showPlanTodos: boolean
  planTodos: Array<{ id: string; content: string; completed?: boolean }>
  setPlanTodos: (todos: any[]) => void
}

/**
 * Custom hook to manage todo list visibility and state
 *
 * @param props - Todo management configuration
 * @returns Todo management utilities
 */
export function useTodoManagement(props: UseTodoManagementProps) {
  const { isSendingMessage, showPlanTodos, planTodos, setPlanTodos } = props

  const [todosCollapsed, setTodosCollapsed] = useState(false)
  const wasSendingRef = useRef(false)

  /**
   * Auto-collapse todos when stream completes. Do not prune items.
   */
  useEffect(() => {
    if (wasSendingRef.current && !isSendingMessage && showPlanTodos) {
      setTodosCollapsed(true)
    }
    wasSendingRef.current = isSendingMessage
  }, [isSendingMessage, showPlanTodos])

  /**
   * Reset collapsed state when todos first appear
   */
  useEffect(() => {
    if (showPlanTodos && planTodos.length > 0) {
      if (isSendingMessage) {
        setTodosCollapsed(false)
      }
    }
  }, [showPlanTodos, planTodos.length, isSendingMessage])

  return {
    todosCollapsed,
    setTodosCollapsed,
  }
}
```

--------------------------------------------------------------------------------

````
