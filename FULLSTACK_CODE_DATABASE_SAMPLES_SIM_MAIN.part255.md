---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 255
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 255 of 933)

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
Location: sim-main/apps/sim/app/(landing)/components/hero/components/index.ts

```typescript
export { IconButton } from './icon-button'
export { DotPattern } from './landing-canvas/dot-pattern'
export type {
  LandingBlockProps,
  LandingCardData,
} from './landing-canvas/landing-block/landing-block'
export { LandingBlock } from './landing-canvas/landing-block/landing-block'
export type { LoopNodeData } from './landing-canvas/landing-block/landing-loop-node'
export { LandingLoopNode } from './landing-canvas/landing-block/landing-loop-node'
export { LandingNode } from './landing-canvas/landing-block/landing-node'
export type { LoopBlockProps } from './landing-canvas/landing-block/loop-block'
export { LoopBlock } from './landing-canvas/landing-block/loop-block'
export type { TagProps } from './landing-canvas/landing-block/tag'
export { Tag } from './landing-canvas/landing-block/tag'
export type {
  LandingBlockNode,
  LandingCanvasProps,
  LandingEdgeData,
  LandingGroupData,
  LandingManualBlock,
  LandingViewportApi,
} from './landing-canvas/landing-canvas'
export { CARD_HEIGHT, CARD_WIDTH, LandingCanvas } from './landing-canvas/landing-canvas'
export { LandingEdge } from './landing-canvas/landing-edge/landing-edge'
export type { LandingFlowProps } from './landing-canvas/landing-flow'
export { LandingFlow } from './landing-canvas/landing-flow'
```

--------------------------------------------------------------------------------

---[FILE: dot-pattern.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/dot-pattern.tsx
Signals: React

```typescript
'use client'

import type React from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/core/utils/cn'

/**
 *  DotPattern Component Props
 *
 * @param {number} [width=16] - The horizontal spacing between dots
 * @param {number} [height=16] - The vertical spacing between dots
 * @param {number} [x=0] - The x-offset of the entire pattern
 * @param {number} [y=0] - The y-offset of the entire pattern
 * @param {number} [cx=1] - The x-offset of individual dots
 * @param {number} [cy=1] - The y-offset of individual dots
 * @param {number} [cr=1] - The radius of each dot
 * @param {string} [className] - Additional CSS classes to apply to the SVG container
 * @param {boolean} [glow=false] - Whether dots should have a glowing animation effect
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  glow?: boolean
  [key: string]: unknown
}

/**
 * DotPattern Component
 *
 * A React component that creates an animated or static dot pattern background using SVG.
 * The pattern automatically adjusts to fill its container and can optionally display glowing dots.
 *
 * @component
 *
 * @see DotPatternProps for the props interface.
 *
 * @example
 * // Basic usage
 * <DotPattern />
 *
 * // With glowing effect and custom spacing
 * <DotPattern
 *   width={20}
 *   height={20}
 *   glow={true}
 *   className="opacity-50"
 * />
 *
 * @notes
 * - The component is client-side only ("use client")
 * - Automatically responds to container size changes
 * - When glow is enabled, dots will animate with random delays and durations
 * - Uses Motion for animations
 * - Dots color can be controlled via the text color utility classes
 */

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const dots = Array.from(
    {
      length: Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height),
    },
    (_, i) => {
      const col = i % Math.ceil(dimensions.width / width)
      const row = Math.floor(i / Math.ceil(dimensions.width / width))
      return {
        x: col * width + cx,
        y: row * height + cy,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      }
    }
  )

  return (
    <svg
      ref={containerRef}
      aria-hidden='true'
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      {...props}
    >
      <defs>
        <radialGradient id={`${id}-gradient`}>
          <stop offset='0%' stopColor='currentColor' stopOpacity='1' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </radialGradient>
      </defs>
      {dots.map((dot, index) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={cr}
          fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
          className='text-neutral-400/80'
        />
      ))}
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing-canvas.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-canvas.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import type { Edge, Node } from 'reactflow'
import { ReactFlowProvider } from 'reactflow'
import { DotPattern } from '@/app/(landing)/components/hero/components/landing-canvas/dot-pattern'
import type { LandingCardData } from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-block'
import { LandingFlow } from '@/app/(landing)/components/hero/components/landing-canvas/landing-flow'

/**
 * Visual constants for landing node dimensions
 */
export const CARD_WIDTH = 256
export const CARD_HEIGHT = 92

/**
 * Landing block node with positioning information
 */
export interface LandingBlockNode extends LandingCardData {
  /** Unique identifier for the node */
  id: string
  /** X coordinate position */
  x: number
  /** Y coordinate position */
  y: number
}

/**
 * Data structure for edges connecting nodes
 */
export interface LandingEdgeData {
  /** Unique identifier for the edge */
  id: string
  /** Source node ID */
  from: string
  /** Target node ID */
  to: string
}

/**
 * Data structure for grouping visual elements
 */
export interface LandingGroupData {
  /** X coordinate of the group */
  x: number
  /** Y coordinate of the group */
  y: number
  /** Width of the group */
  w: number
  /** Height of the group */
  h: number
  /** Labels associated with the group */
  labels: string[]
}

/**
 * Manual block with responsive positioning
 */
export interface LandingManualBlock extends Omit<LandingCardData, 'x' | 'y'> {
  /** Unique identifier */
  id: string
  /** Responsive position configurations */
  positions: {
    /** Position for mobile devices */
    mobile: { x: number; y: number }
    /** Position for tablet devices */
    tablet: { x: number; y: number }
    /** Position for desktop devices */
    desktop: { x: number; y: number }
  }
}

/**
 * Public API for controlling the viewport
 */
export interface LandingViewportApi {
  /**
   * Pan the viewport to specific coordinates
   * @param x - X coordinate to pan to
   * @param y - Y coordinate to pan to
   * @param options - Optional configuration for the pan animation
   */
  panTo: (x: number, y: number, options?: { duration?: number }) => void
  /**
   * Get the current viewport state
   * @returns Current viewport position and zoom level
   */
  getViewport: () => { x: number; y: number; zoom: number }
}

/**
 * Props for the LandingCanvas component
 */
export interface LandingCanvasProps {
  /** Array of nodes to render */
  nodes: Node[]
  /** Array of edges connecting nodes */
  edges: Edge[]
  /** Optional group box for visual grouping */
  groupBox: LandingGroupData | null
  /** Total width of the world/canvas */
  worldWidth: number
  /** Ref to expose viewport control API */
  viewportApiRef: React.MutableRefObject<LandingViewportApi | null>
}

/**
 * Main landing canvas component that provides the container and background
 * for the React Flow visualization
 * @param props - Component properties including nodes, edges, and viewport control
 * @returns A canvas component with dot pattern background and React Flow content
 */
export function LandingCanvas({
  nodes,
  edges,
  groupBox,
  worldWidth,
  viewportApiRef,
}: LandingCanvasProps) {
  const flowWrapRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className='relative mx-auto flex h-[612px] w-full max-w-[1285px] border-none bg-background/80'>
      <DotPattern className='pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20' />

      {/* Use template button overlay */}
      {/* <button
        type='button'
        aria-label='Use template'
        className='absolute top-[24px] left-[50px] z-20 inline-flex items-center justify-center rounded-[10px] border border-[#343434] bg-gradient-to-b from-[#060606] to-[#323232] px-3 py-1.5 text-sm text-white shadow-[inset_0_1.25px_2.5px_0_#9B77FF] transition-all duration-200'
        onClick={() => {
          // Template usage logic will be implemented here
        }}
      >
        Use template
      </button> */}

      <div ref={flowWrapRef} className='relative z-10 h-full w-full'>
        <ReactFlowProvider>
          <LandingFlow
            nodes={nodes}
            edges={edges}
            groupBox={groupBox}
            worldWidth={worldWidth}
            wrapperRef={flowWrapRef}
            viewportApiRef={viewportApiRef}
          />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing-flow.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-flow.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import ReactFlow, { applyNodeChanges, type NodeChange, useReactFlow } from 'reactflow'
import 'reactflow/dist/style.css'
import { LandingLoopNode } from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-loop-node'
import { LandingNode } from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-node'
import {
  CARD_WIDTH,
  type LandingCanvasProps,
} from '@/app/(landing)/components/hero/components/landing-canvas/landing-canvas'
import { LandingEdge } from '@/app/(landing)/components/hero/components/landing-canvas/landing-edge/landing-edge'

/**
 * Props for the LandingFlow component
 */
export interface LandingFlowProps extends LandingCanvasProps {
  /** Reference to the wrapper element */
  wrapperRef: React.RefObject<HTMLDivElement | null>
}

/**
 * React Flow wrapper component for the landing canvas
 * Handles viewport control, auto-panning, and node/edge rendering
 * @param props - Component properties including nodes, edges, and viewport control
 * @returns A configured React Flow instance
 */
export function LandingFlow({
  nodes,
  edges,
  groupBox,
  worldWidth,
  wrapperRef,
  viewportApiRef,
}: LandingFlowProps) {
  const { setViewport, getViewport } = useReactFlow()
  const [rfReady, setRfReady] = React.useState(false)
  const [localNodes, setLocalNodes] = React.useState(nodes)

  // Update local nodes when props change
  React.useEffect(() => {
    setLocalNodes(nodes)
  }, [nodes])

  // Handle node changes (dragging)
  const onNodesChange = React.useCallback((changes: NodeChange[]) => {
    setLocalNodes((nds) => applyNodeChanges(changes, nds))
  }, [])

  // Node and edge types map
  const nodeTypes = React.useMemo(
    () => ({
      landing: LandingNode,
      landingLoop: LandingLoopNode,
      group: LandingLoopNode, // Use our custom loop node for group type
    }),
    []
  )
  const edgeTypes = React.useMemo(() => ({ landingEdge: LandingEdge }), [])

  // Compose nodes with optional group overlay
  const flowNodes = localNodes

  // Auto-pan to the right only if content overflows the wrapper
  React.useEffect(() => {
    const el = wrapperRef.current as HTMLDivElement | null
    if (!el || !rfReady || localNodes.length === 0) return

    const containerWidth = el.clientWidth
    // Derive overflow from actual node positions for accuracy
    const PAD = 16
    const maxRight = localNodes.reduce((m, n) => Math.max(m, (n.position?.x ?? 0) + CARD_WIDTH), 0)
    const contentWidth = Math.max(worldWidth, maxRight + PAD)
    const overflow = Math.max(0, contentWidth - containerWidth)

    // Delay pan so initial nodes are visible briefly
    const timer = window.setTimeout(() => {
      if (overflow > 12) {
        setViewport({ x: -overflow, y: 0, zoom: 1 }, { duration: 900 })
      }
    }, 1400)

    return () => window.clearTimeout(timer)
  }, [worldWidth, wrapperRef, setViewport, rfReady, localNodes])

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{ type: 'smoothstep' }}
      elementsSelectable={true}
      selectNodesOnDrag={false}
      nodesDraggable={true}
      nodesConnectable={false}
      zoomOnScroll={false}
      zoomOnDoubleClick={false}
      panOnScroll={false}
      zoomOnPinch={false}
      panOnDrag={false}
      draggable={false}
      preventScrolling={false}
      autoPanOnNodeDrag={false}
      proOptions={{ hideAttribution: true }}
      fitView={false}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      onInit={(instance) => {
        setRfReady(true)
        // Expose limited viewport API for outer timeline to pan smoothly
        viewportApiRef.current = {
          panTo: (x: number, y: number, options?: { duration?: number }) => {
            setViewport({ x, y, zoom: 1 }, { duration: options?.duration ?? 0 })
          },
          getViewport: () => getViewport(),
        }
      }}
      className='h-full w-full'
      style={{
        // Override React Flow's default cursor styles
        cursor: 'default',
      }}
    >
      <style>
        {`
          /* Force default cursor on the canvas/pane */
          .react-flow__pane {
            cursor: default !important;
          }
          
          /* Force grab cursor on nodes */
          .react-flow__node {
            cursor: grab !important;
          }
          
          /* Force grabbing cursor when dragging nodes */
          .react-flow__node.dragging {
            cursor: grabbing !important;
          }
          
          /* Ensure viewport also has default cursor */
          .react-flow__viewport {
            cursor: default !important;
          }
        `}
      </style>
      {null}
    </ReactFlow>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: landing-block.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-block.tsx
Signals: React

```typescript
import React from 'react'
import { BookIcon } from 'lucide-react'
import {
  Tag,
  type TagProps,
} from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/tag'

/**
 * Data structure for a landing card component
 */
export interface LandingCardData {
  /** Icon element to display in the card header */
  icon: React.ReactNode
  /** Background color for the icon container */
  color: string | '#f6f6f6'
  /** Name/title of the card */
  name: string
  /** Optional tags to display at the bottom of the card */
  tags?: TagProps[]
}

/**
 * Props for the LandingBlock component
 */
export interface LandingBlockProps extends LandingCardData {
  /** Optional CSS class names */
  className?: string
}

/**
 * Landing block component that displays a card with icon, name, and optional tags
 * @param props - Component properties including icon, color, name, tags, and className
 * @returns A styled block card component
 */
export const LandingBlock = React.memo(function LandingBlock({
  icon,
  color,
  name,
  tags,
  className,
}: LandingBlockProps) {
  return (
    <div
      className={`z-10 flex w-64 flex-col items-start gap-3 rounded-[14px] border border-[#E5E5E5] bg-[#FEFEFE] p-3 ${className ?? ''}`}
      style={{
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          <div
            className='flex h-6 w-6 items-center justify-center rounded-[8px] text-white'
            style={{ backgroundColor: color as string }}
          >
            {icon}
          </div>
          <p className='text-base text-card-foreground'>{name}</p>
        </div>
        <BookIcon className='h-4 w-4 text-muted-foreground' />
      </div>

      {tags && tags.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <Tag key={tag.label} icon={tag.icon} label={tag.label} />
          ))}
        </div>
      ) : null}
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: landing-loop-node.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-loop-node.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import { LoopBlock } from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/loop-block'

/**
 * Data structure for the loop node
 */
export interface LoopNodeData {
  /** Label for the loop block */
  label?: string
  /** Child content to render inside */
  children?: React.ReactNode
}

/**
 * React Flow node component for the loop block
 * Acts as a group node for subflow functionality
 * @param props - Component properties containing node data
 * @returns A React Flow compatible loop node component
 */
export const LandingLoopNode = React.memo(function LandingLoopNode({
  data,
  style,
}: {
  data: LoopNodeData
  style?: React.CSSProperties
}) {
  return (
    <div
      className='nodrag nopan nowheel relative cursor-grab active:cursor-grabbing'
      style={{
        width: style?.width || 1198,
        height: style?.height || 528,
        backgroundColor: 'transparent',
        outline: 'none !important',
        boxShadow: 'none !important',
        border: 'none !important',
      }}
    >
      <LoopBlock style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div className='flex items-start gap-3 px-6 py-4'>
          <span className='font-medium text-base text-blue-500'>Loop</span>
        </div>
        {data.children}
      </LoopBlock>
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: landing-node.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-node.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import { Handle, Position } from 'reactflow'
import {
  LandingBlock,
  type LandingCardData,
} from '@/app/(landing)/components/hero/components/landing-canvas/landing-block/landing-block'

/**
 * React Flow node component for the landing canvas
 * Includes CSS animations and connection handles
 * @param props - Component properties containing node data
 * @returns A React Flow compatible node component
 */
export const LandingNode = React.memo(function LandingNode({ data }: { data: LandingCardData }) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const innerRef = React.useRef<HTMLDivElement | null>(null)
  const [isAnimated, setIsAnimated] = React.useState(false)

  React.useEffect(() => {
    const delay = (data as any)?.delay ?? 0
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [data])

  // Check if this node should have a target handle (schedule node shouldn't)
  const hideTargetHandle = (data as any)?.hideTargetHandle || false
  // Check if this node should have a source handle (agent and function nodes shouldn't)
  const hideSourceHandle = (data as any)?.hideSourceHandle || false

  return (
    <div ref={wrapperRef} className='relative cursor-grab active:cursor-grabbing'>
      {!hideTargetHandle && (
        <Handle
          type='target'
          position={Position.Left}
          style={{
            width: '12px',
            height: '12px',
            background: '#FEFEFE',
            border: '1px solid #E5E5E5',
            borderRadius: '50%',
            top: '50%',
            left: '-20px',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
          isConnectable={false}
        />
      )}
      {!hideSourceHandle && (
        <Handle
          type='source'
          position={Position.Right}
          style={{
            width: '12px',
            height: '12px',
            background: '#FEFEFE',
            border: '1px solid #E5E5E5',
            borderRadius: '50%',
            top: '50%',
            right: '-20px',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
          isConnectable={false}
        />
      )}
      <div
        ref={innerRef}
        className={isAnimated ? 'landing-node-animated' : 'landing-node-initial'}
        style={{
          opacity: isAnimated ? 1 : 0,
          transform: isAnimated ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
          transition:
            'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform, opacity',
        }}
      >
        <LandingBlock icon={data.icon} color={data.color} name={data.name} tags={data.tags} />
      </div>
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: loop-block.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-block/loop-block.tsx
Signals: React

```typescript
import React from 'react'

/**
 * Props for the LoopBlock component
 */
export interface LoopBlockProps {
  /** Child elements to render inside the loop block */
  children?: React.ReactNode
  /** Optional CSS class names */
  className?: string
  /** Optional inline styles */
  style?: React.CSSProperties
}

/**
 * Loop block container component that provides a styled container
 * for grouping related elements with a dashed border
 * @param props - Component properties including children and styling
 * @returns A styled loop container component
 */
export const LoopBlock = React.memo(function LoopBlock({
  children,
  className,
  style,
}: LoopBlockProps) {
  return (
    <div
      className={`flex flex-shrink-0 ${className ?? ''}`}
      style={{
        width: '1198px',
        height: '528px',
        borderRadius: '14px',
        background: 'rgba(59, 130, 246, 0.10)',
        position: 'relative',
        ...style,
      }}
    >
      {/* Custom dashed border with SVG */}
      <svg
        className='pointer-events-none absolute inset-0 h-full w-full'
        style={{ borderRadius: '14px' }}
        preserveAspectRatio='none'
      >
        <path
          className='landing-loop-animated-dash'
          d='M 1183.5 527.5 
             L 14 527.5 
             A 13.5 13.5 0 0 1 0.5 514 
             L 0.5 14 
             A 13.5 13.5 0 0 1 14 0.5 
             L 1183.5 0.5 
             A 13.5 13.5 0 0 1 1197 14 
             L 1197 514 
             A 13.5 13.5 0 0 1 1183.5 527.5 Z'
          fill='none'
          stroke='#3B82F6'
          strokeWidth='1'
          strokeDasharray='12 12'
          strokeLinecap='round'
        />
      </svg>
      {children}
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: tag.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-block/tag.tsx
Signals: React

```typescript
import React from 'react'

/**
 * Properties for a tag component
 */
export interface TagProps {
  /** Icon element to display in the tag */
  icon: React.ReactNode
  /** Text label for the tag */
  label: string
}

/**
 * Tag component for displaying labeled icons in a compact format
 * @param props - Tag properties including icon and label
 * @returns A styled tag component
 */
export const Tag = React.memo(function Tag({ icon, label }: TagProps) {
  return (
    <div className='flex w-fit items-center gap-1 rounded-[8px] border border-gray-300 bg-white px-2 py-0.5'>
      <div className='h-3 w-3 text-muted-foreground'>{icon}</div>
      <p className='text-muted-foreground text-xs leading-normal'>{label}</p>
    </div>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: landing-edge.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/hero/components/landing-canvas/landing-edge/landing-edge.tsx
Signals: React

```typescript
'use client'

import React from 'react'
import { type EdgeProps, getSmoothStepPath, Position } from 'reactflow'

/**
 * Custom edge component with animated dotted line that floats between handles
 * @param props - React Flow edge properties
 * @returns An animated dotted edge component
 */
export const LandingEdge = React.memo(function LandingEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data } =
    props

  // Adjust the connection points to create floating effect
  // Account for handle size (12px) and additional spacing
  const handleRadius = 6 // Half of handle width (12px)
  const floatingGap = 1 // Additional gap for floating effect

  // Calculate adjusted positions based on edge direction
  let adjustedSourceX = sourceX
  let adjustedTargetX = targetX

  if (sourcePosition === Position.Right) {
    adjustedSourceX = sourceX + handleRadius + floatingGap
  } else if (sourcePosition === Position.Left) {
    adjustedSourceX = sourceX - handleRadius - floatingGap
  }

  if (targetPosition === Position.Left) {
    adjustedTargetX = targetX - handleRadius - floatingGap
  } else if (targetPosition === Position.Right) {
    adjustedTargetX = targetX + handleRadius + floatingGap
  }

  const [path] = getSmoothStepPath({
    sourceX: adjustedSourceX,
    sourceY,
    targetX: adjustedTargetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 20,
    offset: 10,
  })

  return (
    <g style={{ zIndex: 1 }}>
      <style>
        {`
          @keyframes landing-edge-dash-${id} {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: -12;
            }
          }
        `}
      </style>
      <path
        id={id}
        d={path}
        fill='none'
        className='react-flow__edge-path'
        style={{
          stroke: '#D1D1D1',
          strokeWidth: 2,
          strokeDasharray: '6 6',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          pointerEvents: 'none',
          animation: `landing-edge-dash-${id} 1s linear infinite`,
          willChange: 'stroke-dashoffset',
          ...style,
        }}
      />
    </g>
  )
})
```

--------------------------------------------------------------------------------

---[FILE: integrations.tsx]---
Location: sim-main/apps/sim/app/(landing)/components/integrations/integrations.tsx

```typescript
import * as Icons from '@/components/icons'
import { inter } from '@/app/_styles/fonts/inter/inter'

const modelProviderIcons = [
  { icon: Icons.OpenAIIcon, label: 'OpenAI' },
  { icon: Icons.AnthropicIcon, label: 'Anthropic' },
  { icon: Icons.GeminiIcon, label: 'Gemini' },
  { icon: Icons.MistralIcon, label: 'Mistral' },
  { icon: Icons.PerplexityIcon, label: 'Perplexity' },
  { icon: Icons.xAIIcon, label: 'xAI' },
  { icon: Icons.GroqIcon, label: 'Groq' },
  { icon: Icons.HuggingFaceIcon, label: 'HuggingFace' },
  { icon: Icons.OllamaIcon, label: 'Ollama' },
  { icon: Icons.DeepseekIcon, label: 'Deepseek' },
  { icon: Icons.ElevenLabsIcon, label: 'ElevenLabs' },
  { icon: Icons.VllmIcon, label: 'vLLM' },
]

const communicationIcons = [
  { icon: Icons.SlackIcon, label: 'Slack' },
  { icon: Icons.GmailIcon, label: 'Gmail' },
  { icon: Icons.OutlookIcon, label: 'Outlook' },
  { icon: Icons.DiscordIcon, label: 'Discord', style: { color: '#5765F2' } },
  { icon: Icons.LinearIcon, label: 'Linear', style: { color: '#5E6AD2' } },
  { icon: Icons.NotionIcon, label: 'Notion' },
  { icon: Icons.JiraIcon, label: 'Jira' },
  { icon: Icons.ConfluenceIcon, label: 'Confluence' },
  { icon: Icons.TelegramIcon, label: 'Telegram' },
  { icon: Icons.GoogleCalendarIcon, label: 'Google Calendar' },
  { icon: Icons.CalendlyIcon, label: 'Calendly' },
  { icon: Icons.GoogleDocsIcon, label: 'Google Docs' },
  { icon: Icons.BrowserUseIcon, label: 'BrowserUse' },
  { icon: Icons.TypeformIcon, label: 'Typeform' },
  { icon: Icons.GithubIcon, label: 'GitHub' },
  { icon: Icons.GoogleSheetsIcon, label: 'Google Sheets' },
  { icon: Icons.GoogleDriveIcon, label: 'Google Drive' },
  { icon: Icons.AirtableIcon, label: 'Airtable' },
]

const dataStorageIcons = [
  { icon: Icons.PineconeIcon, label: 'Pinecone' },
  { icon: Icons.SupabaseIcon, label: 'Supabase' },
  { icon: Icons.PostgresIcon, label: 'PostgreSQL' },
  { icon: Icons.MySQLIcon, label: 'MySQL' },
  { icon: Icons.QdrantIcon, label: 'Qdrant' },
  { icon: Icons.MicrosoftOneDriveIcon, label: 'OneDrive' },
  { icon: Icons.MicrosoftSharepointIcon, label: 'SharePoint' },
  { icon: Icons.SerperIcon, label: 'Serper' },
  { icon: Icons.FirecrawlIcon, label: 'Firecrawl' },
  { icon: Icons.StripeIcon, label: 'Stripe' },
]

interface IntegrationBoxProps {
  icon?: React.ComponentType<{ className?: string }>
  style?: React.CSSProperties
  isVisible: boolean
}

function IntegrationBox({ icon: Icon, style, isVisible }: IntegrationBoxProps) {
  return (
    <div
      className='flex h-[72px] w-[72px] items-center justify-center transition-all duration-300'
      style={{
        borderRadius: '12px',
        border: '1px solid var(--base-border, #E5E5E5)',
        background: 'var(--base-card, #FEFEFE)',
        opacity: isVisible ? 1 : 0.75,
        boxShadow: isVisible ? '0 2px 4px 0 rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      {Icon && isVisible && (
        <div style={style}>
          <Icon className='h-8 w-8' />
        </div>
      )}
    </div>
  )
}

interface TickerRowProps {
  direction: 'left' | 'right'
  offset: number
  showOdd: boolean
  icons: Array<{
    icon: React.ComponentType<{ className?: string }>
    label: string
    style?: React.CSSProperties
  }>
}

function TickerRow({ direction, offset, showOdd, icons }: TickerRowProps) {
  const extendedIcons = [...icons, ...icons, ...icons, ...icons]

  return (
    <div className='relative h-[88px] w-full overflow-hidden'>
      <div
        className={`absolute flex items-center gap-[16px] ${
          direction === 'left' ? 'animate-slide-left' : 'animate-slide-right'
        }`}
        style={{
          animationDelay: `${offset}s`,
        }}
      >
        {extendedIcons.map((service, index) => {
          const isOdd = index % 2 === 1
          const shouldShow = showOdd ? isOdd : !isOdd
          return (
            <IntegrationBox
              key={`${service.label}-${index}`}
              icon={service.icon}
              style={service.style}
              isVisible={shouldShow}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function Integrations() {
  return (
    <section
      id='integrations'
      className={`${inter.className} flex flex-col pt-[40px] pb-[27px] sm:pt-[24px]`}
      aria-labelledby='integrations-heading'
    >
      <h2
        id='integrations-heading'
        className='mb-[4px] px-4 font-medium text-[28px] text-foreground tracking-tight sm:pl-[50px]'
      >
        Integrations
      </h2>
      <p className='mb-[24px] px-4 text-[#515151] text-[18px] sm:pl-[50px]'>
        Immediately connect to 100+ models and apps
      </p>

      {/* Sliding tickers */}
      <div className='flex w-full flex-col sm:px-[12px]'>
        <TickerRow direction='left' offset={0} showOdd={false} icons={modelProviderIcons} />
        <TickerRow direction='right' offset={0.5} showOdd={true} icons={communicationIcons} />
        <TickerRow direction='left' offset={1} showOdd={false} icons={dataStorageIcons} />
      </div>
    </section>
  )
}
```

--------------------------------------------------------------------------------

````
