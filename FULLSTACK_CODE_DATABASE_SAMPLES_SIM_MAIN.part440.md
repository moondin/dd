---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 440
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 440 of 933)

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

---[FILE: use-node-utilities.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-node-utilities.ts
Signals: React

```typescript
import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { createLogger } from '@/lib/logs/console/logger'
import { BLOCK_DIMENSIONS, CONTAINER_DIMENSIONS } from '@/lib/workflows/blocks/block-dimensions'
import { getBlock } from '@/blocks/registry'

const logger = createLogger('NodeUtilities')

/**
 * Hook providing utilities for node position, hierarchy, and dimension calculations
 */
export function useNodeUtilities(blocks: Record<string, any>) {
  const { getNodes } = useReactFlow()

  /**
   * Check if a block is a container type (loop, parallel, or subflow)
   */
  const isContainerType = useCallback((blockType: string): boolean => {
    return blockType === 'loop' || blockType === 'parallel' || blockType === 'subflowNode'
  }, [])

  /**
   * Get the dimensions of a block.
   * For regular blocks, estimates height based on block config if not yet measured.
   */
  const getBlockDimensions = useCallback(
    (blockId: string): { width: number; height: number } => {
      const block = blocks[blockId]
      if (!block) {
        return { width: BLOCK_DIMENSIONS.FIXED_WIDTH, height: BLOCK_DIMENSIONS.MIN_HEIGHT }
      }

      if (isContainerType(block.type)) {
        return {
          width: block.data?.width
            ? Math.max(block.data.width, CONTAINER_DIMENSIONS.MIN_WIDTH)
            : CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
          height: block.data?.height
            ? Math.max(block.data.height, CONTAINER_DIMENSIONS.MIN_HEIGHT)
            : CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
        }
      }

      // Workflow block nodes have fixed visual width
      const width = BLOCK_DIMENSIONS.FIXED_WIDTH

      // Prefer deterministic height published by the block component; fallback to estimate
      let height = block.height

      if (!height) {
        // Estimate height based on block config's subblock count for more accurate initial sizing
        // This is critical for subflow containers to size correctly before child blocks are measured
        const blockConfig = getBlock(block.type)
        const subBlockCount = blockConfig?.subBlocks?.length ?? 3
        // Many subblocks are conditionally rendered (advanced mode, provider-specific, etc.)
        // Use roughly half the config count as a reasonable estimate, capped between 3-7 rows
        const estimatedRows = Math.max(3, Math.min(Math.ceil(subBlockCount / 2), 7))
        const hasErrorRow = block.type !== 'starter' && block.type !== 'response' ? 1 : 0

        height =
          BLOCK_DIMENSIONS.HEADER_HEIGHT +
          BLOCK_DIMENSIONS.WORKFLOW_CONTENT_PADDING +
          (estimatedRows + hasErrorRow) * BLOCK_DIMENSIONS.WORKFLOW_ROW_HEIGHT
      }

      return {
        width,
        height: Math.max(height, BLOCK_DIMENSIONS.MIN_HEIGHT),
      }
    },
    [blocks, isContainerType]
  )

  /**
   * Calculates the depth of a node in the hierarchy tree
   * @param nodeId ID of the node to check
   * @param maxDepth Maximum depth to prevent stack overflow
   * @returns Depth level (0 for root nodes, increasing for nested nodes)
   */
  const getNodeDepth = useCallback(
    (nodeId: string, maxDepth = 100): number => {
      const node = getNodes().find((n) => n.id === nodeId)
      if (!node || maxDepth <= 0) return 0
      const parentId = blocks?.[nodeId]?.data?.parentId
      if (!parentId) return 0
      return 1 + getNodeDepth(parentId, maxDepth - 1)
    },
    [getNodes, blocks]
  )

  /**
   * Gets the full hierarchy path of a node (its parent chain)
   * @param nodeId ID of the node to check
   * @returns Array of node IDs representing the hierarchy path
   */
  const getNodeHierarchy = useCallback(
    (nodeId: string): string[] => {
      const node = getNodes().find((n) => n.id === nodeId)
      if (!node) return [nodeId]
      const parentId = blocks?.[nodeId]?.data?.parentId
      if (!parentId) return [nodeId]
      return [...getNodeHierarchy(parentId), nodeId]
    },
    [getNodes, blocks]
  )

  /**
   * Gets the absolute position of a node (accounting for nested parents).
   * For nodes inside containers, accounts for header and padding offsets.
   * @param nodeId ID of the node to check
   * @returns Absolute position coordinates {x, y}
   */
  const getNodeAbsolutePosition = useCallback(
    (nodeId: string): { x: number; y: number } => {
      const node = getNodes().find((n) => n.id === nodeId)
      if (!node) {
        logger.warn('Attempted to get position of non-existent node', { nodeId })
        return { x: 0, y: 0 }
      }

      const parentId = blocks?.[nodeId]?.data?.parentId
      if (!parentId) {
        return node.position
      }

      const parentNode = getNodes().find((n) => n.id === parentId)
      if (!parentNode) {
        logger.warn('Node references non-existent parent', {
          nodeId,
          invalidParentId: parentId,
        })
        return node.position
      }

      const visited = new Set<string>()
      let currentId = nodeId
      while (currentId && blocks?.[currentId]?.data?.parentId) {
        const currentParentId = blocks[currentId].data.parentId
        if (visited.has(currentParentId)) {
          logger.error('Circular parent reference detected', {
            nodeId,
            parentChain: Array.from(visited),
          })
          return node.position
        }
        visited.add(currentId)
        currentId = currentParentId
      }

      const parentPos = getNodeAbsolutePosition(parentId)

      // Child positions are stored relative to the content area (after header and padding)
      // Add these offsets when calculating absolute position
      const headerHeight = 50
      const leftPadding = 16
      const topPadding = 16

      return {
        x: parentPos.x + leftPadding + node.position.x,
        y: parentPos.y + headerHeight + topPadding + node.position.y,
      }
    },
    [getNodes, blocks]
  )

  /**
   * Calculates the relative position of a node to a new parent's content area.
   * Accounts for header height and padding offsets in container nodes.
   * @param nodeId ID of the node being repositioned
   * @param newParentId ID of the new parent
   * @returns Relative position coordinates {x, y} within the parent's content area
   */
  const calculateRelativePosition = useCallback(
    (nodeId: string, newParentId: string): { x: number; y: number } => {
      const nodeAbsPos = getNodeAbsolutePosition(nodeId)
      const parentAbsPos = getNodeAbsolutePosition(newParentId)

      // Account for container's header and padding
      // Children are positioned relative to content area, not container origin
      const headerHeight = 50
      const leftPadding = 16
      const topPadding = 16

      return {
        x: nodeAbsPos.x - parentAbsPos.x - leftPadding,
        y: nodeAbsPos.y - parentAbsPos.y - headerHeight - topPadding,
      }
    },
    [getNodeAbsolutePosition]
  )

  /**
   * Checks if a point is inside a loop or parallel node
   * @param position Position coordinates to check
   * @returns The smallest container node containing the point, or null if none
   */
  const isPointInLoopNode = useCallback(
    (position: {
      x: number
      y: number
    }): {
      loopId: string
      loopPosition: { x: number; y: number }
      dimensions: { width: number; height: number }
    } | null => {
      const containingNodes = getNodes()
        .filter((n) => n.type && isContainerType(n.type))
        .filter((n) => {
          // Use absolute coordinates for nested containers
          const absolutePos = getNodeAbsolutePosition(n.id)
          const rect = {
            left: absolutePos.x,
            right: absolutePos.x + (n.data?.width || CONTAINER_DIMENSIONS.DEFAULT_WIDTH),
            top: absolutePos.y,
            bottom: absolutePos.y + (n.data?.height || CONTAINER_DIMENSIONS.DEFAULT_HEIGHT),
          }

          return (
            position.x >= rect.left &&
            position.x <= rect.right &&
            position.y >= rect.top &&
            position.y <= rect.bottom
          )
        })
        .map((n) => ({
          loopId: n.id,
          // Return absolute position so callers can compute relative placement correctly
          loopPosition: getNodeAbsolutePosition(n.id),
          dimensions: {
            width: n.data?.width || CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
            height: n.data?.height || CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
          },
        }))

      if (containingNodes.length > 0) {
        return containingNodes.sort((a, b) => {
          const aArea = a.dimensions.width * a.dimensions.height
          const bArea = b.dimensions.width * b.dimensions.height
          return aArea - bArea
        })[0]
      }

      return null
    },
    [getNodes, isContainerType, getNodeAbsolutePosition]
  )

  /**
   * Calculates appropriate dimensions for a loop or parallel node based on its children
   * @param nodeId ID of the container node
   * @returns Calculated width and height for the container
   */
  const calculateLoopDimensions = useCallback(
    (nodeId: string): { width: number; height: number } => {
      const childNodes = getNodes().filter((node) => node.parentId === nodeId)
      if (childNodes.length === 0) {
        return {
          width: CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
          height: CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
        }
      }

      let maxRight = 0
      let maxBottom = 0

      childNodes.forEach((node) => {
        const { width: nodeWidth, height: nodeHeight } = getBlockDimensions(node.id)
        maxRight = Math.max(maxRight, node.position.x + nodeWidth)
        maxBottom = Math.max(maxBottom, node.position.y + nodeHeight)
      })

      const width = Math.max(
        CONTAINER_DIMENSIONS.DEFAULT_WIDTH,
        CONTAINER_DIMENSIONS.LEFT_PADDING + maxRight + CONTAINER_DIMENSIONS.RIGHT_PADDING
      )
      const height = Math.max(
        CONTAINER_DIMENSIONS.DEFAULT_HEIGHT,
        CONTAINER_DIMENSIONS.HEADER_HEIGHT +
          CONTAINER_DIMENSIONS.TOP_PADDING +
          maxBottom +
          CONTAINER_DIMENSIONS.BOTTOM_PADDING
      )

      return { width, height }
    },
    [getNodes, getBlockDimensions]
  )

  /**
   * Resizes all loop and parallel nodes based on their children
   * @param updateNodeDimensions Function to update the dimensions of a node
   */
  const resizeLoopNodes = useCallback(
    (updateNodeDimensions: (id: string, dimensions: { width: number; height: number }) => void) => {
      const containerNodes = getNodes()
        .filter((node) => node.type && isContainerType(node.type))
        .map((node) => ({
          ...node,
          depth: getNodeDepth(node.id),
        }))
        // Sort by depth descending - process innermost containers first
        // so their dimensions are correct when outer containers calculate sizes
        .sort((a, b) => b.depth - a.depth)

      containerNodes.forEach((node) => {
        const dimensions = calculateLoopDimensions(node.id)
        // Get current dimensions from the blocks store rather than React Flow's potentially stale state
        const currentWidth = blocks[node.id]?.data?.width
        const currentHeight = blocks[node.id]?.data?.height

        // Only update if dimensions actually changed to avoid unnecessary re-renders
        if (dimensions.width !== currentWidth || dimensions.height !== currentHeight) {
          updateNodeDimensions(node.id, dimensions)
        }
      })
    },
    [getNodes, isContainerType, getNodeDepth, calculateLoopDimensions, blocks]
  )

  /**
   * Updates a node's parent with proper position calculation
   * @param nodeId ID of the node being reparented
   * @param newParentId ID of the new parent (or null to remove parent)
   * @param updateBlockPosition Function to update the position of a block
   * @param updateParentId Function to update the parent ID of a block
   * @param resizeCallback Function to resize loop nodes after parent update
   */
  const updateNodeParent = useCallback(
    (
      nodeId: string,
      newParentId: string | null,
      updateBlockPosition: (id: string, position: { x: number; y: number }) => void,
      updateParentId: (id: string, parentId: string, extent: 'parent') => void,
      resizeCallback: () => void
    ) => {
      const node = getNodes().find((n) => n.id === nodeId)
      if (!node) return

      const currentParentId = blocks[nodeId]?.data?.parentId || null
      if (newParentId === currentParentId) return

      if (newParentId) {
        const relativePosition = calculateRelativePosition(nodeId, newParentId)

        updateBlockPosition(nodeId, relativePosition)
        updateParentId(nodeId, newParentId, 'parent')
      } else if (currentParentId) {
        const absolutePosition = getNodeAbsolutePosition(nodeId)

        // First set the absolute position so the node visually stays in place
        updateBlockPosition(nodeId, absolutePosition)
        // Then clear the parent relationship in the store (empty string removes parentId/extent)
        updateParentId(nodeId, '', 'parent')
      }

      resizeCallback()
    },
    [getNodes, blocks, calculateRelativePosition, getNodeAbsolutePosition]
  )

  /**
   * Compute the absolute position of a node's source anchor (right-middle)
   * @param nodeId ID of the node
   * @returns Absolute position of the source anchor
   */
  const getNodeAnchorPosition = useCallback(
    (nodeId: string): { x: number; y: number } => {
      const node = getNodes().find((n) => n.id === nodeId)
      const absPos = getNodeAbsolutePosition(nodeId)

      if (!node) {
        return absPos
      }

      // Use known defaults per node type without type casting
      const isSubflow = node.type === 'subflowNode'
      const width = isSubflow
        ? typeof node.data?.width === 'number'
          ? node.data.width
          : 500
        : typeof node.width === 'number'
          ? node.width
          : 250
      const height = isSubflow
        ? typeof node.data?.height === 'number'
          ? node.data.height
          : 300
        : typeof node.height === 'number'
          ? node.height
          : 100

      return {
        x: absPos.x + width,
        y: absPos.y + height / 2,
      }
    },
    [getNodes, getNodeAbsolutePosition]
  )

  return {
    getNodeDepth,
    getNodeHierarchy,
    getNodeAbsolutePosition,
    calculateRelativePosition,
    isPointInLoopNode,
    calculateLoopDimensions,
    resizeLoopNodes,
    updateNodeParent,
    getNodeAnchorPosition,
    isContainerType,
    getBlockDimensions,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-scroll-management.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-scroll-management.ts
Signals: React

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Options for configuring scroll behavior.
 */
interface UseScrollManagementOptions {
  /**
   * Scroll behavior for programmatic scrolls.
   * - `smooth`: animated scroll (default, used by Copilot).
   * - `auto`: immediate scroll to bottom (used by floating chat to avoid jitter).
   */
  behavior?: 'auto' | 'smooth'
}

/**
 * Custom hook to manage scroll behavior in scrollable message panels.
 * Handles auto-scrolling during message streaming and user-initiated scrolling.
 *
 * @param messages - Array of messages to track for scroll behavior
 * @param isSendingMessage - Whether a message is currently being sent/streamed
 * @param options - Optional configuration for scroll behavior
 * @returns Scroll management utilities
 */
export function useScrollManagement(
  messages: any[],
  isSendingMessage: boolean,
  options?: UseScrollManagementOptions
) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [userHasScrolledDuringStream, setUserHasScrolledDuringStream] = useState(false)
  const programmaticScrollInProgressRef = useRef(false)
  const lastScrollTopRef = useRef(0)
  const scrollBehavior: 'auto' | 'smooth' = options?.behavior ?? 'smooth'

  /**
   * Scrolls the container to the bottom with smooth animation
   */
  const getScrollContainer = useCallback((): HTMLElement | null => {
    // Prefer the element with the ref (our scrollable div)
    if (scrollAreaRef.current) return scrollAreaRef.current
    return null
  }, [])

  const scrollToBottom = useCallback(() => {
    const scrollContainer = getScrollContainer()
    if (!scrollContainer) return

    programmaticScrollInProgressRef.current = true
    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: scrollBehavior,
    })
    // Best-effort reset; not all browsers fire scrollend reliably
    window.setTimeout(() => {
      programmaticScrollInProgressRef.current = false
    }, 200)
  }, [getScrollContainer, scrollBehavior])

  /**
   * Handles scroll events to track user position and show/hide scroll button
   */
  const handleScroll = useCallback(() => {
    const scrollContainer = getScrollContainer()
    if (!scrollContainer) return

    if (programmaticScrollInProgressRef.current) {
      // Ignore scrolls we initiated
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    const nearBottom = distanceFromBottom <= 100
    setIsNearBottom(nearBottom)

    if (isSendingMessage) {
      const delta = scrollTop - lastScrollTopRef.current
      const movedUp = delta < -2 // small hysteresis to avoid noise
      const movedDown = delta > 2

      if (movedUp) {
        // Any upward movement breaks away from sticky during streaming
        setUserHasScrolledDuringStream(true)
      }

      // If the user has broken away and scrolls back down to the bottom, re-stick
      if (userHasScrolledDuringStream && movedDown && nearBottom) {
        setUserHasScrolledDuringStream(false)
      }
    }

    // Track last scrollTop for direction detection
    lastScrollTopRef.current = scrollTop
  }, [getScrollContainer, isSendingMessage, userHasScrolledDuringStream])

  // Attach scroll listener
  useEffect(() => {
    const scrollContainer = getScrollContainer()
    if (!scrollContainer) return

    const handleUserScroll = () => {
      handleScroll()
    }

    scrollContainer.addEventListener('scroll', handleUserScroll, { passive: true })

    if ('onscrollend' in scrollContainer) {
      scrollContainer.addEventListener('scrollend', handleScroll, { passive: true })
    }

    // Initialize state
    window.setTimeout(handleScroll, 100)
    // Initialize last scroll position
    lastScrollTopRef.current = scrollContainer.scrollTop

    return () => {
      scrollContainer.removeEventListener('scroll', handleUserScroll)
      if ('onscrollend' in scrollContainer) {
        scrollContainer.removeEventListener('scrollend', handleScroll)
      }
    }
  }, [getScrollContainer, handleScroll])

  // Smart auto-scroll: only scroll if user hasn't intentionally scrolled up during streaming
  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    const isNewUserMessage = lastMessage?.role === 'user'

    const shouldAutoScroll =
      isNewUserMessage ||
      (isSendingMessage && !userHasScrolledDuringStream) ||
      (!isSendingMessage && isNearBottom)

    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [messages, isNearBottom, isSendingMessage, userHasScrolledDuringStream, scrollToBottom])

  // Reset user scroll state when streaming starts or when user sends a message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user') {
      setUserHasScrolledDuringStream(false)
      programmaticScrollInProgressRef.current = false
      const scrollContainer = getScrollContainer()
      if (scrollContainer) {
        lastScrollTopRef.current = scrollContainer.scrollTop
      }
    }
  }, [messages, getScrollContainer])

  // Reset user scroll state when streaming completes
  const prevIsSendingRef = useRef(false)
  useEffect(() => {
    if (prevIsSendingRef.current && !isSendingMessage) {
      setUserHasScrolledDuringStream(false)
    }
    prevIsSendingRef.current = isSendingMessage
  }, [isSendingMessage])

  // While streaming and not broken away, keep pinned to bottom
  useEffect(() => {
    if (!isSendingMessage || userHasScrolledDuringStream) return

    const intervalId = window.setInterval(() => {
      const scrollContainer = getScrollContainer()
      if (!scrollContainer) return

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      const nearBottom = distanceFromBottom <= 120
      if (nearBottom) {
        scrollToBottom()
      }
    }, 100)

    return () => window.clearInterval(intervalId)
  }, [isSendingMessage, userHasScrolledDuringStream, getScrollContainer, scrollToBottom])

  return {
    scrollAreaRef,
    scrollToBottom,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: use-wand.ts]---
Location: sim-main/apps/sim/app/workspace/[workspaceId]/w/[workflowId]/hooks/use-wand.ts
Signals: React

```typescript
import { useCallback, useRef, useState } from 'react'
import { createLogger } from '@/lib/logs/console/logger'
import type { GenerationType } from '@/blocks/types'

const logger = createLogger('useWand')

/**
 * Builds rich context information based on current content and generation type
 */
function buildContextInfo(currentValue?: string, generationType?: string): string {
  if (!currentValue || currentValue.trim() === '') {
    return 'no current content'
  }

  const contentLength = currentValue.length
  const lineCount = currentValue.split('\n').length

  let contextInfo = `Current content (${contentLength} characters, ${lineCount} lines):\n${currentValue}`

  // Add type-specific context analysis
  if (generationType) {
    switch (generationType) {
      case 'javascript-function-body':
      case 'typescript-function-body': {
        // Analyze code structure
        const hasFunction = /function\s+\w+/.test(currentValue)
        const hasArrowFunction = /=>\s*{/.test(currentValue)
        const hasReturn = /return\s+/.test(currentValue)
        contextInfo += `\n\nCode analysis: ${hasFunction ? 'Contains function declaration. ' : ''}${hasArrowFunction ? 'Contains arrow function. ' : ''}${hasReturn ? 'Has return statement.' : 'No return statement.'}`
        break
      }

      case 'json-schema':
      case 'json-object':
        // Analyze JSON structure
        try {
          const parsed = JSON.parse(currentValue)
          const keys = Object.keys(parsed)
          contextInfo += `\n\nJSON analysis: Valid JSON with ${keys.length} top-level keys: ${keys.join(', ')}`
        } catch {
          contextInfo += `\n\nJSON analysis: Invalid JSON - needs fixing`
        }
        break
    }
  }

  return contextInfo
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface WandConfig {
  enabled: boolean
  prompt: string
  generationType?: GenerationType
  placeholder?: string
  maintainHistory?: boolean // Whether to keep conversation history
}

interface UseWandProps {
  wandConfig?: WandConfig
  currentValue?: string
  onGeneratedContent: (content: string) => void
  onStreamChunk?: (chunk: string) => void
  onStreamStart?: () => void
  onGenerationComplete?: (prompt: string, generatedContent: string) => void
}

export function useWand({
  wandConfig,
  currentValue,
  onGeneratedContent,
  onStreamChunk,
  onStreamStart,
  onGenerationComplete,
}: UseWandProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPromptVisible, setIsPromptVisible] = useState(false)
  const [promptInputValue, setPromptInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  // Conversation history state
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([])

  const abortControllerRef = useRef<AbortController | null>(null)

  const showPromptInline = useCallback(() => {
    setIsPromptVisible(true)
    setError(null)
  }, [])

  const hidePromptInline = useCallback(() => {
    setIsPromptVisible(false)
    setPromptInputValue('')
    setError(null)
  }, [])

  const updatePromptValue = useCallback((value: string) => {
    setPromptInputValue(value)
  }, [])

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
    setIsLoading(false)
    setError(null)
  }, [])

  const openPrompt = useCallback(() => {
    setIsPromptVisible(true)
    setPromptInputValue('')
  }, [])

  const closePrompt = useCallback(() => {
    if (isLoading) return
    setIsPromptVisible(false)
    setPromptInputValue('')
  }, [isLoading])

  const generateStream = useCallback(
    async ({ prompt }: { prompt: string }) => {
      if (!prompt) {
        setError('Prompt cannot be empty.')
        return
      }

      if (!wandConfig?.enabled) {
        setError('Wand is not enabled.')
        return
      }

      setIsLoading(true)
      setIsStreaming(true)
      setError(null)
      setPromptInputValue('')

      abortControllerRef.current = new AbortController()

      // Signal the start of streaming to clear previous content
      if (onStreamStart) {
        onStreamStart()
      }

      try {
        // Build context-aware message
        const contextInfo = buildContextInfo(currentValue, wandConfig?.generationType)

        // Build the system prompt with context information
        let systemPrompt = wandConfig?.prompt || ''
        if (systemPrompt.includes('{context}')) {
          systemPrompt = systemPrompt.replace('{context}', contextInfo)
        }

        // User message is just the user's specific request
        const userMessage = prompt

        // Keep track of the current prompt for history
        const currentPrompt = prompt

        const response = await fetch('/api/wand', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-transform',
          },
          body: JSON.stringify({
            prompt: userMessage,
            systemPrompt: systemPrompt, // Send the processed system prompt with context
            stream: true,
            history: wandConfig?.maintainHistory ? conversationHistory : [], // Include history if enabled
          }),
          signal: abortControllerRef.current.signal,
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || `HTTP error! status: ${response.status}`)
        }

        if (!response.body) {
          throw new Error('Response body is null')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedContent = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const lineData = line.substring(6)

                if (lineData === '[DONE]') {
                  continue
                }

                try {
                  const data = JSON.parse(lineData)

                  if (data.error) {
                    throw new Error(data.error)
                  }

                  if (data.chunk) {
                    accumulatedContent += data.chunk
                    if (onStreamChunk) {
                      onStreamChunk(data.chunk)
                    }
                  }

                  if (data.done) {
                    break
                  }
                } catch (parseError) {
                  logger.debug('Failed to parse SSE line', { line, parseError })
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

        if (accumulatedContent) {
          onGeneratedContent(accumulatedContent)

          if (wandConfig?.maintainHistory) {
            setConversationHistory((prev) => [
              ...prev,
              { role: 'user', content: currentPrompt },
              { role: 'assistant', content: accumulatedContent },
            ])
          }

          if (onGenerationComplete) {
            onGenerationComplete(currentPrompt, accumulatedContent)
          }
        }

        logger.debug('Wand generation completed', {
          prompt,
          contentLength: accumulatedContent.length,
        })
      } catch (error: any) {
        if (error.name === 'AbortError') {
          logger.debug('Wand generation cancelled')
        } else {
          logger.error('Wand generation failed', { error })
          setError(error.message || 'Generation failed')
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [
      wandConfig,
      currentValue,
      onGeneratedContent,
      onStreamChunk,
      onStreamStart,
      onGenerationComplete,
    ]
  )

  return {
    isLoading,
    isStreaming,
    isPromptVisible,
    promptInputValue,
    error,
    conversationHistory,
    generateStream,
    showPromptInline,
    hidePromptInline,
    openPrompt,
    closePrompt,
    updatePromptValue,
    cancelGeneration,
  }
}
```

--------------------------------------------------------------------------------

````
