---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 503
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 503 of 933)

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

---[FILE: popover.tsx]---
Location: sim-main/apps/sim/components/emcn/components/popover/popover.tsx
Signals: React

```typescript
/**
 * Popover component system with built-in folder navigation and automatic viewport positioning.
 * Uses Radix UI primitives for collision detection and smart placement.
 *
 * @example
 * Basic usage with folders:
 * ```tsx
 * import { Popover, PopoverAnchor, PopoverBackButton, PopoverContent, PopoverFolder, PopoverItem } from '@/components/emcn'
 * import { Workflow, Bot } from 'lucide-react'
 *
 * function MyMenu() {
 *   const [workflows, setWorkflows] = useState([])
 *   const [open, setOpen] = useState(false)
 *
 *   return (
 *     <Popover open={open} onOpenChange={setOpen}>
 *       <PopoverAnchor>
 *         <button>Open Menu</button>
 *       </PopoverAnchor>
 *       <PopoverContent>
 *         <PopoverBackButton />
 *         <PopoverItem rootOnly onClick={() => console.log('Docs')}>
 *           <BookOpen className="h-3 w-3" />
 *           <span>Docs</span>
 *         </PopoverItem>
 *
 *         <PopoverFolder
 *           id="workflows"
 *           title="All workflows"
 *           icon={<Workflow className="h-3 w-3" />}
 *           onOpen={async () => {
 *             const data = await fetchWorkflows()
 *             setWorkflows(data)
 *           }}
 *         >
 *           {workflows.map(wf => (
 *             <PopoverItem key={wf.id} onClick={() => selectWorkflow(wf)}>
 *               <div className="h-3 w-3 rounded" style={{ backgroundColor: wf.color }} />
 *               <span>{wf.name}</span>
 *             </PopoverItem>
 *           ))}
 *         </PopoverFolder>
 *       </PopoverContent>
 *     </Popover>
 *   )
 * }
 * ```
 */

'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/core/utils/cn'

/**
 * Shared base styles for all popover interactive items.
 * Ensures consistent height and styling across items, folders, and back button.
 * Uses fast transitions (duration-75) to prevent hover state "jumping" during rapid mouse movement.
 */
const POPOVER_ITEM_BASE_CLASSES =
  'flex h-[25px] min-w-0 cursor-pointer items-center gap-[8px] rounded-[6px] px-[6px] font-base text-[var(--text-primary)] text-[12px] transition-colors duration-75 dark:text-[var(--text-primary)] [&_svg]:transition-colors [&_svg]:duration-75 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'

/**
 * Variant-specific active state styles for popover items.
 */
const POPOVER_ITEM_ACTIVE_CLASSES = {
  primary:
    'bg-[var(--brand-secondary)] text-[var(--bg)] dark:bg-[var(--brand-secondary)] dark:text-[var(--bg)] [&_svg]:text-[var(--bg)] dark:[&_svg]:text-[var(--bg)]',
  default:
    'bg-[var(--surface-9)] text-[var(--text-primary)] dark:bg-[var(--surface-9)] dark:text-[var(--text-primary)] [&_svg]:text-[var(--text-primary)] dark:[&_svg]:text-[var(--text-primary)]',
}

/**
 * Variant-specific hover state styles for popover items.
 */
const POPOVER_ITEM_HOVER_CLASSES = {
  primary:
    'hover:bg-[var(--brand-secondary)] hover:text-[var(--bg)] dark:hover:bg-[var(--brand-secondary)] dark:hover:text-[var(--bg)] hover:[&_svg]:text-[var(--bg)] dark:hover:[&_svg]:text-[var(--bg)]',
  default:
    'hover:bg-[var(--surface-9)] hover:text-[var(--text-primary)] dark:hover:bg-[var(--surface-9)] dark:hover:text-[var(--text-primary)] hover:[&_svg]:text-[var(--text-primary)] dark:hover:[&_svg]:text-[var(--text-primary)]',
}

type PopoverVariant = 'default' | 'primary'

interface PopoverContextValue {
  openFolder: (
    id: string,
    title: string,
    onLoad?: () => void | Promise<void>,
    onSelect?: () => void
  ) => void
  closeFolder: () => void
  currentFolder: string | null
  isInFolder: boolean
  folderTitle: string | null
  onFolderSelect: (() => void) | null
  variant: PopoverVariant
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

const usePopoverContext = () => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within a Popover')
  }
  return context
}

export interface PopoverProps extends PopoverPrimitive.PopoverProps {
  /**
   * Visual variant of the popover
   * @default 'default'
   */
  variant?: PopoverVariant
}

/**
 * Root popover component. Manages open state and folder navigation context.
 *
 * @example
 * ```tsx
 * <Popover open={open} onOpenChange={setOpen} variant="default">
 *   <PopoverAnchor>...</PopoverAnchor>
 *   <PopoverContent>...</PopoverContent>
 * </Popover>
 * ```
 */
const Popover: React.FC<PopoverProps> = ({ children, variant = 'default', ...props }) => {
  const [currentFolder, setCurrentFolder] = React.useState<string | null>(null)
  const [folderTitle, setFolderTitle] = React.useState<string | null>(null)
  const [onFolderSelect, setOnFolderSelect] = React.useState<(() => void) | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const openFolder = React.useCallback(
    (id: string, title: string, onLoad?: () => void | Promise<void>, onSelect?: () => void) => {
      setCurrentFolder(id)
      setFolderTitle(title)
      setOnFolderSelect(() => onSelect ?? null)
      if (onLoad) {
        void Promise.resolve(onLoad())
      }
    },
    []
  )

  const closeFolder = React.useCallback(() => {
    setCurrentFolder(null)
    setFolderTitle(null)
    setOnFolderSelect(null)
  }, [])

  const contextValue: PopoverContextValue = React.useMemo(
    () => ({
      openFolder,
      closeFolder,
      currentFolder,
      isInFolder: currentFolder !== null,
      folderTitle,
      onFolderSelect,
      variant,
      searchQuery,
      setSearchQuery,
    }),
    [openFolder, closeFolder, currentFolder, folderTitle, onFolderSelect, variant, searchQuery]
  )

  return (
    <PopoverContext.Provider value={contextValue}>
      <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
    </PopoverContext.Provider>
  )
}

Popover.displayName = 'Popover'

/**
 * Trigger element that opens/closes the popover when clicked.
 * Use asChild to render as a custom component.
 *
 * @example
 * ```tsx
 * <PopoverTrigger asChild>
 *   <Button>Open Menu</Button>
 * </PopoverTrigger>
 * ```
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * Anchor element for the popover. Can be a virtual element or React element.
 * For positioning popovers relative to cursor/caret, use asChild with a positioned element.
 */
const PopoverAnchor = PopoverPrimitive.Anchor

export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'collisionPadding'
  > {
  /**
   * When true, renders the popover content inline instead of in a portal.
   * Useful when used inside other portalled components (e.g. dialogs)
   * where additional portals can interfere with scroll locking behavior.
   * @default false
   */
  disablePortal?: boolean
  /**
   * Maximum height for the popover content in pixels
   */
  maxHeight?: number
  /**
   * Maximum width for the popover content in pixels.
   * When provided, Popover will also enable default truncation for inner text and section headers.
   */
  maxWidth?: number
  /**
   * Minimum width for the popover content in pixels
   */
  minWidth?: number
  /**
   * Preferred side to display the popover
   * @default 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * Alignment of the popover relative to anchor
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * Offset from the anchor in pixels.
   * Defaults to 22px for top side (to avoid covering cursor) and 10px for other sides.
   */
  sideOffset?: number
  /**
   * Padding from viewport edges in pixels
   * @default 8
   */
  collisionPadding?: number
  /**
   * When true, adds a border to the popover content
   * @default false
   */
  border?: boolean
}

/**
 * Popover content component with automatic positioning and collision detection.
 * Wraps children in a styled container with scrollable area.
 *
 * @example
 * ```tsx
 * <PopoverContent maxHeight={300}>
 *   <PopoverItem>Item 1</PopoverItem>
 *   <PopoverItem>Item 2</PopoverItem>
 * </PopoverContent>
 * ```
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      disablePortal = false,
      style,
      children,
      maxHeight,
      maxWidth,
      minWidth,
      side = 'bottom',
      align = 'start',
      sideOffset,
      collisionPadding = 8,
      border = false,
      ...restProps
    },
    ref
  ) => {
    // Smart default offset: larger offset when rendering above to avoid covering cursor
    const effectiveSideOffset = sideOffset ?? (side === 'top' ? 20 : 14)

    // Detect explicit width constraints provided by the consumer.
    // When present, we enable default text truncation behavior for inner flexible items,
    // so callers don't need to manually pass 'truncate' to every label.
    const hasUserWidthConstraint =
      maxWidth !== undefined ||
      minWidth !== undefined ||
      style?.minWidth !== undefined ||
      style?.maxWidth !== undefined ||
      style?.width !== undefined

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
      const container = event.currentTarget
      if (!container) return

      const { scrollHeight, clientHeight, scrollTop } = container
      if (scrollHeight <= clientHeight) {
        return
      }

      const deltaY = event.deltaY
      const isScrollingDown = deltaY > 0
      const isAtTop = scrollTop === 0
      const isAtBottom = scrollTop + clientHeight >= scrollHeight

      // If we're at the boundary and user keeps scrolling in that direction,
      // let the event bubble so parent scroll containers can handle it.
      if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
        return
      }

      // Otherwise, consume the wheel event and manually scroll the popover content.
      event.preventDefault()
      container.scrollTop += deltaY
    }

    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        side={side}
        align={align}
        sideOffset={effectiveSideOffset}
        collisionPadding={collisionPadding}
        avoidCollisions={true}
        sticky='partial'
        onWheel={handleWheel}
        {...restProps}
        className={cn(
          'z-[10000200] flex flex-col overflow-auto rounded-[8px] bg-[var(--surface-3)] px-[5.5px] py-[5px] text-foreground outline-none dark:bg-[var(--surface-3)]',
          // If width is constrained by the caller (prop or style), ensure inner flexible text truncates by default,
          // and also truncate section headers.
          hasUserWidthConstraint && '[&_.flex-1]:truncate [&_[data-popover-section]]:truncate',
          border && 'border border-[var(--surface-11)]',
          className
        )}
        style={{
          maxHeight: `${maxHeight || 400}px`,
          maxWidth: maxWidth !== undefined ? `${maxWidth}px` : 'calc(100vw - 16px)',
          // Only enforce default min width when the user hasn't set width constraints
          minWidth:
            minWidth !== undefined ? `${minWidth}px` : hasUserWidthConstraint ? undefined : '160px',
          ...style,
        }}
      >
        {children}
      </PopoverPrimitive.Content>
    )

    if (disablePortal) {
      return content
    }

    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
  }
)

PopoverContent.displayName = 'PopoverContent'

export interface PopoverScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Scrollable area container for popover items.
 * Use this to wrap items that should scroll within the popover.
 *
 * @example
 * ```tsx
 * <PopoverContent>
 *   <PopoverScrollArea>
 *     <PopoverItem>Item 1</PopoverItem>
 *     <PopoverItem>Item 2</PopoverItem>
 *   </PopoverScrollArea>
 * </PopoverContent>
 * ```
 */
const PopoverScrollArea = React.forwardRef<HTMLDivElement, PopoverScrollAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('min-h-0 overflow-auto overscroll-contain', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

PopoverScrollArea.displayName = 'PopoverScrollArea'

export interface PopoverItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether this item is currently active/selected
   */
  active?: boolean
  /**
   * If true, this item will only show when not inside any folder
   */
  rootOnly?: boolean
  /**
   * Whether this item is disabled
   */
  disabled?: boolean
  /**
   * Whether to show a checkmark when active
   * @default false
   */
  showCheck?: boolean
}

/**
 * Popover item component for individual items within a popover.
 *
 * @example
 * ```tsx
 * <PopoverItem active={isActive} disabled={isDisabled} onClick={() => handleClick()}>
 *   <Icon className="h-4 w-4" />
 *   <span>Item label</span>
 * </PopoverItem>
 * ```
 */
const PopoverItem = React.forwardRef<HTMLDivElement, PopoverItemProps>(
  ({ className, active, rootOnly, disabled, showCheck = false, children, ...props }, ref) => {
    // Try to get context - if not available, we're outside Popover (shouldn't happen)
    const context = React.useContext(PopoverContext)
    const variant = context?.variant || 'default'

    // If rootOnly is true and we're in a folder, don't render
    if (rootOnly && context?.isInFolder) {
      return null
    }

    return (
      <div
        className={cn(
          POPOVER_ITEM_BASE_CLASSES,
          active ? POPOVER_ITEM_ACTIVE_CLASSES[variant] : POPOVER_ITEM_HOVER_CLASSES[variant],
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          className
        )}
        ref={ref}
        role='menuitem'
        aria-selected={active}
        aria-disabled={disabled}
        {...props}
      >
        {children}
        {showCheck && active && <Check className='ml-auto h-[12px] w-[12px]' />}
      </div>
    )
  }
)

PopoverItem.displayName = 'PopoverItem'

export interface PopoverSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * If true, this section will only show when not inside any folder
   */
  rootOnly?: boolean
}

/**
 * Popover section header component for grouping items with a title.
 *
 * @example
 * ```tsx
 * <PopoverSection>
 *   Section Title
 * </PopoverSection>
 * ```
 */
const PopoverSection = React.forwardRef<HTMLDivElement, PopoverSectionProps>(
  ({ className, rootOnly, ...props }, ref) => {
    const context = React.useContext(PopoverContext)

    // If rootOnly is true and we're in a folder, don't render
    if (rootOnly && context?.isInFolder) {
      return null
    }

    return (
      <div
        className={cn(
          'min-w-0 px-[6px] py-[4px] font-base text-[12px] text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]',
          className
        )}
        data-popover-section=''
        ref={ref}
        {...props}
      />
    )
  }
)

PopoverSection.displayName = 'PopoverSection'

export interface PopoverFolderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Unique identifier for the folder
   */
  id: string
  /**
   * Display title for the folder
   */
  title: string
  /**
   * Icon to display before the title
   */
  icon?: React.ReactNode
  /**
   * Function to call when folder is opened (for lazy loading)
   */
  onOpen?: () => void | Promise<void>
  /**
   * Function to call when the folder title is selected (from within the folder view)
   */
  onSelect?: () => void
  /**
   * Children to render when folder is open
   */
  children?: React.ReactNode
  /**
   * Whether this item is currently active/selected
   */
  active?: boolean
}

/**
 * Popover folder component that expands to show nested content.
 * Automatically handles navigation and back button rendering.
 *
 * @example
 * ```tsx
 * <PopoverFolder id="workflows" title="Workflows" icon={<Icon />}>
 *   <PopoverItem>Workflow 1</PopoverItem>
 *   <PopoverItem>Workflow 2</PopoverItem>
 * </PopoverFolder>
 * ```
 */
const PopoverFolder = React.forwardRef<HTMLDivElement, PopoverFolderProps>(
  ({ className, id, title, icon, onOpen, onSelect, children, active, ...props }, ref) => {
    const { openFolder, currentFolder, isInFolder, variant } = usePopoverContext()

    // Don't render if we're in a different folder
    if (isInFolder && currentFolder !== id) {
      return null
    }

    // If we're in this folder, render its children
    if (currentFolder === id) {
      return <>{children}</>
    }

    // Handle click anywhere on folder item
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      openFolder(id, title, onOpen, onSelect)
    }

    // Otherwise, render as a clickable folder item
    return (
      <div
        ref={ref}
        className={cn(
          POPOVER_ITEM_BASE_CLASSES,
          active ? POPOVER_ITEM_ACTIVE_CLASSES[variant] : POPOVER_ITEM_HOVER_CLASSES[variant],
          className
        )}
        role='menuitem'
        aria-haspopup='true'
        aria-expanded={false}
        onClick={handleClick}
        {...props}
      >
        {icon}
        <span className='flex-1'>{title}</span>
        <ChevronRight className='h-3 w-3' />
      </div>
    )
  }
)

PopoverFolder.displayName = 'PopoverFolder'

export interface PopoverBackButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Ref callback for the folder title element (when selectable)
   */
  folderTitleRef?: (el: HTMLElement | null) => void
  /**
   * Whether the folder title is currently active/selected
   */
  folderTitleActive?: boolean
  /**
   * Callback when mouse enters the folder title
   */
  onFolderTitleMouseEnter?: () => void
}

/**
 * Back button component that appears when inside a folder.
 * Automatically hidden when at root level.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverBackButton />
 *   <PopoverContent>
 *     // content
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const PopoverBackButton = React.forwardRef<HTMLDivElement, PopoverBackButtonProps>(
  ({ className, folderTitleRef, folderTitleActive, onFolderTitleMouseEnter, ...props }, ref) => {
    const { isInFolder, closeFolder, folderTitle, onFolderSelect, variant } = usePopoverContext()

    if (!isInFolder) {
      return null
    }

    return (
      <div className='flex flex-col'>
        <div
          ref={ref}
          className={cn(POPOVER_ITEM_BASE_CLASSES, POPOVER_ITEM_HOVER_CLASSES[variant], className)}
          role='button'
          onClick={closeFolder}
          {...props}
        >
          <ChevronLeft className='h-3 w-3' />
          <span>Back</span>
        </div>
        {folderTitle && onFolderSelect && (
          <div
            ref={folderTitleRef}
            className={cn(
              POPOVER_ITEM_BASE_CLASSES,
              folderTitleActive
                ? POPOVER_ITEM_ACTIVE_CLASSES[variant]
                : POPOVER_ITEM_HOVER_CLASSES[variant]
            )}
            role='button'
            onClick={(e) => {
              e.stopPropagation()
              onFolderSelect()
            }}
            onMouseEnter={onFolderTitleMouseEnter}
          >
            <span>{folderTitle}</span>
          </div>
        )}
        {folderTitle && !onFolderSelect && (
          <div className='px-[6px] py-[4px] font-base text-[12px] text-[var(--text-tertiary)] dark:text-[var(--text-tertiary)]'>
            {folderTitle}
          </div>
        )}
      </div>
    )
  }
)

PopoverBackButton.displayName = 'PopoverBackButton'

export interface PopoverSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Placeholder text for the search input
   * @default 'Search...'
   */
  placeholder?: string
  /**
   * Callback when search query changes
   */
  onValueChange?: (value: string) => void
}

/**
 * Search input component for filtering popover items.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverContent>
 *     <PopoverSearch placeholder="Search tools..." />
 *     <PopoverScrollArea>
 *       // items
 *     </PopoverScrollArea>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
const PopoverSearch = React.forwardRef<HTMLDivElement, PopoverSearchProps>(
  ({ className, placeholder = 'Search...', onValueChange, ...props }, ref) => {
    const { searchQuery, setSearchQuery } = usePopoverContext()
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      onValueChange?.(value)
    }

    React.useEffect(() => {
      inputRef.current?.focus()
    }, [])

    return (
      <div ref={ref} className={cn('flex items-center px-[8px] py-[6px]', className)} {...props}>
        <Search className='mr-2 h-[12px] w-[12px] shrink-0 text-[var(--text-muted)]' />
        <input
          ref={inputRef}
          className='w-full bg-transparent font-base text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none'
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
    )
  }
)

PopoverSearch.displayName = 'PopoverSearch'

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
  PopoverScrollArea,
  PopoverItem,
  PopoverSection,
  PopoverFolder,
  PopoverBackButton,
  PopoverSearch,
  usePopoverContext,
}
```

--------------------------------------------------------------------------------

---[FILE: s-modal.tsx]---
Location: sim-main/apps/sim/components/emcn/components/s-modal/s-modal.tsx
Signals: React

```typescript
/**
 * Sidebar modal variant with navigation sidebar and main content area.
 *
 * @example
 * ```tsx
 * <SModal>
 *   <SModalContent>
 *     <SModalSidebar>
 *       <SModalSidebarHeader>Settings</SModalSidebarHeader>
 *       <SModalSidebarSection>
 *         <SModalSidebarSectionTitle>Account</SModalSidebarSectionTitle>
 *         <SModalSidebarItem icon={<User />} active>Profile</SModalSidebarItem>
 *         <SModalSidebarItem icon={<Key />}>Security</SModalSidebarItem>
 *       </SModalSidebarSection>
 *     </SModalSidebar>
 *     <SModalMain>
 *       <SModalMainHeader>Profile</SModalMainHeader>
 *       <SModalMainBody>Content here</SModalMainBody>
 *     </SModalMain>
 *   </SModalContent>
 * </SModal>
 * ```
 */

'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/core/utils/cn'
import { Button } from '../button/button'
import { Modal, type ModalContentProps, ModalOverlay, ModalPortal } from '../modal/modal'

const ANIMATION_CLASSES =
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in'

const CONTENT_ANIMATION_CLASSES =
  'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[50%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[50%]'

/**
 * Root sidebar modal component.
 */
const SModal = Modal

/**
 * Trigger element that opens the modal.
 */
const SModalTrigger = DialogPrimitive.Trigger

/**
 * Close element that closes the modal.
 */
const SModalClose = DialogPrimitive.Close

/**
 * Modal content with horizontal flex layout.
 */
const SModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, style, ...props }, ref) => {
  const [isInteractionReady, setIsInteractionReady] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsInteractionReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          ANIMATION_CLASSES,
          CONTENT_ANIMATION_CLASSES,
          'fixed top-[50%] left-[50%] z-[500] flex h-[min(70vh,720px)] max-h-[800px] min-h-[520px] w-[min(60vw,900px)] min-w-[680px] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] flex-row rounded-[8px] border bg-[var(--bg)] shadow-sm duration-200',
          className
        )}
        style={style}
        onEscapeKeyDown={(e) => {
          if (!isInteractionReady) {
            e.preventDefault()
            return
          }
          e.stopPropagation()
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
        }}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </ModalPortal>
  )
})

SModalContent.displayName = 'SModalContent'

/**
 * Sidebar container with scrollable content.
 */
const SModalSidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex min-h-0 w-[166px] flex-col overflow-y-auto py-[12px]', className)}
      {...props}
    />
  )
)

SModalSidebar.displayName = 'SModalSidebar'

/**
 * Sidebar header with title.
 */
const SModalSidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-[16px] px-[12px] font-medium text-[16px] text-[var(--text-primary)]',
        className
      )}
      {...props}
    />
  )
)

SModalSidebarHeader.displayName = 'SModalSidebarHeader'

/**
 * Sidebar section container. Groups related items.
 */
const SModalSidebarSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-[4px] px-[12px] [&+&]:mt-[12px]', className)}
      {...props}
    />
  )
)

SModalSidebarSection.displayName = 'SModalSidebarSection'

/**
 * Sidebar section title.
 */
const SModalSidebarSectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-[2px] font-medium text-[12px] text-[var(--text-muted)]', className)}
    {...props}
  />
))

SModalSidebarSectionTitle.displayName = 'SModalSidebarSectionTitle'

export interface SModalSidebarItemProps extends React.ComponentPropsWithoutRef<typeof Button> {
  /** Whether the item is currently active/selected */
  active?: boolean
  /** Icon element to display */
  icon?: React.ReactNode
}

/**
 * Sidebar item with icon and text. Uses Button component with ghost variant.
 */
function SModalSidebarItem({
  className,
  active,
  icon,
  children,
  ...props
}: SModalSidebarItemProps) {
  return (
    <Button
      variant={active ? 'active' : 'ghost'}
      className={cn(
        'w-full justify-start gap-[8px] rounded-[6px] text-[13px]',
        !active &&
          'text-[var(--text-tertiary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]',
        className
      )}
      {...props}
    >
      {icon && (
        <span className='h-[14px] w-[14px] flex-shrink-0 [&>svg]:h-full [&>svg]:w-full'>
          {icon}
        </span>
      )}
      {children}
    </Button>
  )
}

/**
 * Main content container.
 */
const SModalMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-[16px] rounded-[8px] border-l bg-[var(--surface-2)] p-[14px]',
        className
      )}
      {...props}
    />
  )
)

SModalMain.displayName = 'SModalMain'

/**
 * Main header with title and close button.
 */
const SModalMainHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between', className)} {...props}>
      <span className='font-base text-[14px] text-[var(--text-muted)]'>{children}</span>
      <DialogPrimitive.Close asChild>
        <Button variant='ghost' className='h-[16px] w-[16px] p-0'>
          <X className='h-[16px] w-[16px]' />
          <span className='sr-only'>Close</span>
        </Button>
      </DialogPrimitive.Close>
    </div>
  )
)

SModalMainHeader.displayName = 'SModalMainHeader'

/**
 * Main body content area.
 */
const SModalMainBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('min-w-0 flex-1 overflow-y-auto', className)} {...props} />
  )
)

SModalMainBody.displayName = 'SModalMainBody'

export {
  SModal,
  SModalTrigger,
  SModalClose,
  SModalContent,
  SModalSidebar,
  SModalSidebarHeader,
  SModalSidebarSection,
  SModalSidebarSectionTitle,
  SModalSidebarItem,
  SModalMain,
  SModalMainHeader,
  SModalMainBody,
}
```

--------------------------------------------------------------------------------

---[FILE: switch.tsx]---
Location: sim-main/apps/sim/components/emcn/components/switch/switch.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/lib/core/utils/cn'

/**
 * Custom switch component with thin track design.
 * Track: 28px width, 6px height, 20px border-radius
 * Thumb: 14px diameter circle that overlaps the track
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[17px] w-[30px] shrink-0 cursor-pointer items-center rounded-[20px] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      'bg-[var(--surface-12)] data-[state=checked]:bg-[var(--surface-14)]',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-[14px] w-[14px] rounded-full shadow-sm ring-0 transition-transform',
        'bg-[var(--text-primary)] data-[state=checked]:bg-[var(--white)]',
        'data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-[2px]'
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = 'Switch'

export { Switch }
```

--------------------------------------------------------------------------------

---[FILE: textarea.tsx]---
Location: sim-main/apps/sim/components/emcn/components/textarea/textarea.tsx
Signals: React

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/core/utils/cn'

const textareaVariants = cva(
  'flex w-full rounded-[4px] border border-[var(--surface-11)] bg-[var(--surface-6)] dark:bg-[var(--surface-9)] px-[8px] py-[8px] font-medium font-sans text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-muted)] dark:placeholder:text-[var(--text-muted)] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

/**
 * Minimal textarea component matching the user-input styling.
 * Features a resize handle in the bottom right corner.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea className={cn(textareaVariants({ variant }), className)} ref={ref} {...props} />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
```

--------------------------------------------------------------------------------

---[FILE: tooltip.tsx]---
Location: sim-main/apps/sim/components/emcn/components/tooltip/tooltip.tsx
Signals: React

```typescript
'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/core/utils/cn'

/**
 * Tooltip provider component that must wrap your app or tooltip usage area.
 */
const Provider = TooltipPrimitive.Provider

/**
 * Root tooltip component that wraps trigger and content.
 */
const Root = TooltipPrimitive.Root

/**
 * Trigger element that activates the tooltip on hover.
 */
const Trigger = TooltipPrimitive.Trigger

/**
 * Tooltip content component with consistent styling.
 *
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger asChild>
 *     <Button>Hover me</Button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Content>
 *     <p>Tooltip text</p>
 *   </Tooltip.Content>
 * </Tooltip.Root>
 * ```
 */
const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      collisionPadding={8}
      avoidCollisions={true}
      className={cn(
        'z-[10000300] rounded-[3px] bg-black px-[7.5px] py-[6px] font-base text-white text-xs shadow-md dark:bg-white dark:text-black',
        className
      )}
      {...props}
    >
      {props.children}
      <TooltipPrimitive.Arrow className='fill-black dark:fill-white' />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
Content.displayName = TooltipPrimitive.Content.displayName

export const Tooltip = {
  Root,
  Trigger,
  Content,
  Provider,
}
```

--------------------------------------------------------------------------------

---[FILE: bubble-chat-preview.tsx]---
Location: sim-main/apps/sim/components/emcn/icons/bubble-chat-preview.tsx
Signals: React

```typescript
import type { SVGProps } from 'react'

/**
 * BubbleChatPreview icon component
 * @param props - SVG properties including className, fill, etc.
 */
export function BubbleChatPreview(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.208 0.729126C9.46715 0.729126 8.8405 1.03967 8.3672 1.39158C7.89351 1.74377 7.54598 2.15728 7.35252 2.41564C7.28999 2.49672 7.14551 2.68425 7.14551 2.91663C7.14551 3.149 7.28999 3.33653 7.35252 3.41761C7.54598 3.67598 7.89351 4.08948 8.3672 4.44168C8.8405 4.79358 9.46715 5.10413 10.208 5.10413C10.9489 5.10413 11.5755 4.79358 12.0488 4.44168C12.5225 4.08948 12.87 3.67597 13.0635 3.41761C13.126 3.33653 13.2705 3.149 13.2705 2.91663C13.2705 2.68425 13.126 2.49672 13.0635 2.41564C12.87 2.15728 12.5225 1.74377 12.0488 1.39158C11.5755 1.03967 10.9489 0.729126 10.208 0.729126ZM10.2041 2.04163C9.72301 2.04163 9.33301 2.43338 9.33301 2.91663C9.33301 3.39988 9.72301 3.79163 10.2041 3.79163H10.2119C10.693 3.79163 11.083 3.39988 11.083 2.91663C11.083 2.43338 10.693 2.04163 10.2119 2.04163H10.2041Z'
        fill='currentColor'
      />
      <path
        d='M7 0.729431C7.25201 0.729431 7.37829 0.728973 7.43066 0.789978C7.45461 0.817872 7.46841 0.85201 7.47168 0.888611C7.47864 0.968713 7.38194 1.06792 7.18848 1.26556C6.95871 1.50031 6.7804 1.72067 6.65723 1.8847L6.65137 1.89154C6.58026 1.98206 6.27051 2.37696 6.27051 2.91693C6.27061 3.45637 6.57996 3.85045 6.65137 3.94135L6.65723 3.94818C6.88003 4.24495 7.28385 4.72574 7.8457 5.14349C8.41007 5.56311 9.21632 5.97934 10.208 5.97943C11.1998 5.97943 12.0069 5.56316 12.5713 5.14349C12.7408 5.01748 12.8259 4.95516 12.9023 4.97064C12.9183 4.9739 12.9338 4.97875 12.9482 4.98627C13.0174 5.02234 13.0412 5.1157 13.0889 5.3017C13.2075 5.76414 13.2705 6.24824 13.2705 6.74701C13.2705 10.0885 10.4444 12.7656 7 12.7656C6.59416 12.766 6.18957 12.7281 5.79102 12.6533C5.65266 12.6273 5.56443 12.6115 5.49902 12.6025C5.45024 12.595 5.40122 12.613 5.38281 12.623C5.31602 12.6547 5.22698 12.7019 5.09082 12.7744C4.25576 13.2184 3.28146 13.3758 2.3418 13.2011C2.19004 13.1729 2.06398 13.0667 2.01074 12.9218C1.95752 12.777 1.98471 12.6148 2.08203 12.4951C2.35492 12.1594 2.543 11.7545 2.62598 11.3193C2.64818 11.1997 2.59719 11.0372 2.44141 10.8788C1.38277 9.80387 0.729492 8.34981 0.729492 6.74701C0.729632 3.4056 3.55564 0.729431 7 0.729431ZM4.66699 6.41693C4.34485 6.41693 4.08305 6.67781 4.08301 6.99994C4.08301 7.32211 4.34483 7.58295 4.66699 7.58295H4.67188C4.99404 7.58295 5.25488 7.32211 5.25488 6.99994C5.25484 6.67781 4.99401 6.41693 4.67188 6.41693H4.66699ZM6.99707 6.41693C6.67508 6.4171 6.41411 6.67792 6.41406 6.99994C6.41406 7.322 6.67505 7.58278 6.99707 7.58295H7.00293C7.32495 7.58278 7.58594 7.322 7.58594 6.99994C7.58589 6.67792 7.32492 6.4171 7.00293 6.41693H6.99707ZM9.33105 6.41693C9.00892 6.41693 8.74712 6.67781 8.74707 6.99994C8.74707 7.32211 9.00889 7.58295 9.33105 7.58295H9.33594C9.6581 7.58295 9.91895 7.32211 9.91895 6.99994C9.9189 6.67781 9.65808 6.41693 9.33594 6.41693H9.33105Z'
        fill='currentColor'
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

````
