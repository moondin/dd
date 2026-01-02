---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 841
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 841 of 867)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - prowler-master
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/prowler-master
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: main-layout.tsx]---
Location: prowler-master/ui/components/ui/main-layout/main-layout.tsx

```typescript
"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import { Sidebar } from "../sidebar/sidebar";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden">
      {/* Top-left gradient halo */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-0 size-[600px] opacity-20 blur-3xl"
        style={{
          background: "linear-gradient(90deg, #31E59F 0%, #60E0EC 100%)",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Bottom-right gradient halo */}
      <div
        className="pointer-events-none fixed right-0 bottom-0 z-0 size-[600px] opacity-20 blur-3xl"
        style={{
          background: "linear-gradient(90deg, #31E59F 0%, #60E0EC 100%)",
          transform: "translate(50%, 50%)",
        }}
      />

      <Sidebar />
      <main
        className={cn(
          "no-scrollbar relative z-10 mb-auto h-full flex-1 flex-col overflow-y-auto transition-[margin-left] duration-300 ease-in-out",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
        )}
      >
        {children}
      </main>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: navbar-client.tsx]---
Location: prowler-master/ui/components/ui/nav-bar/navbar-client.tsx
Signals: React

```typescript
"use client";

import { BellRing } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/shadcn";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { BreadcrumbNavigation } from "@/components/ui";
import { useSidebar } from "@/hooks/use-sidebar";

import { SheetMenu } from "../sidebar/sheet-menu";
import { SidebarToggle } from "../sidebar/sidebar-toggle";
import { UserNav } from "../user-nav/user-nav";

interface NavbarClientProps {
  title: string;
  icon?: string | ReactNode;
  feedsSlot?: ReactNode;
}

export function NavbarClient({ title, icon, feedsSlot }: NavbarClientProps) {
  const { isOpen, toggleOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-10 w-full pt-4 backdrop-blur-sm">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center gap-2">
          <SheetMenu />
          <div className="hidden lg:block">
            <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
          </div>
          <BreadcrumbNavigation
            mode="auto"
            title={title}
            icon={icon}
            paramToPreserve="scanId"
          />
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <ThemeSwitch />
          {feedsSlot}
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export function FeedsLoadingFallback() {
  return (
    <Button
      variant="outline"
      className="border-border-input-primary-fill relative h-8 w-8 rounded-full bg-transparent p-2"
      disabled
    >
      <BellRing size={18} className="animate-pulse text-slate-400" />
    </Button>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: navbar.tsx]---
Location: prowler-master/ui/components/ui/nav-bar/navbar.tsx
Signals: React

```typescript
import { ReactNode, Suspense } from "react";

import { FeedsServer } from "@/components/feeds";

import { FeedsLoadingFallback, NavbarClient } from "./navbar-client";

interface NavbarProps {
  title: string;
  icon?: string | ReactNode;
}

export function Navbar({ title, icon }: NavbarProps) {
  return (
    <NavbarClient
      title={title}
      icon={icon}
      feedsSlot={
        <Suspense fallback={<FeedsLoadingFallback />}>
          <FeedsServer limit={15} />
        </Suspense>
      }
    />
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/navigation-progress/index.ts

```typescript
export { NavigationProgress } from "./navigation-progress";
export {
  cancelProgress,
  completeProgress,
  startProgress,
  useNavigationProgress,
} from "./use-navigation-progress";
```

--------------------------------------------------------------------------------

---[FILE: navigation-progress.tsx]---
Location: prowler-master/ui/components/ui/navigation-progress/navigation-progress.tsx
Signals: React

```typescript
"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib";

import { useNavigationProgress } from "./use-navigation-progress";

const HIDE_DELAY_MS = 200;

export function NavigationProgress() {
  const { isLoading, progress } = useNavigationProgress();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) return setVisible(true);

    const timeout = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[99999] h-[3px] w-full"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading progress"
    >
      <div
        className={cn(
          "bg-button-primary h-full transition-all duration-200 ease-out",
          isLoading && "shadow-progress-glow",
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: use-navigation-progress.ts]---
Location: prowler-master/ui/components/ui/navigation-progress/use-navigation-progress.ts
Signals: React, Next.js

```typescript
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

interface ProgressState {
  isLoading: boolean;
  progress: number;
}

// Global state
let state: ProgressState = { isLoading: false, progress: 0 };
const listeners = new Set<() => void>();
let progressInterval: ReturnType<typeof setInterval> | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;

// Cached server snapshot to avoid infinite loop with useSyncExternalStore
const SERVER_SNAPSHOT: ProgressState = { isLoading: false, progress: 0 };

function notify() {
  listeners.forEach((listener) => listener());
}

function setState(newState: ProgressState) {
  state = newState;
  notify();
}

function clearTimers() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

/**
 * Start the progress bar animation.
 * Progress increases quickly at first, then slows down as it approaches 90%.
 */
export function startProgress() {
  clearTimers();
  setState({ isLoading: true, progress: 0 });

  progressInterval = setInterval(() => {
    if (state.progress < 90) {
      const increment = (90 - state.progress) * 0.1;
      setState({
        ...state,
        progress: Math.min(90, state.progress + increment),
      });
    }
  }, 100);
}

/**
 * Complete the progress bar animation.
 * Jumps to 100% and then hides after a brief delay.
 */
export function completeProgress() {
  clearTimers();
  setState({ isLoading: false, progress: 100 });

  timeoutId = setTimeout(() => {
    setState({ isLoading: false, progress: 0 });
    timeoutId = null;
  }, 200);
}

/**
 * Cancel the progress bar immediately without animation.
 */
export function cancelProgress() {
  clearTimers();
  setState({ isLoading: false, progress: 0 });
}

/**
 * Hook to access progress bar state.
 * Automatically completes progress when URL changes.
 */
export function useNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => SERVER_SNAPSHOT,
  );

  // Complete progress when URL changes (only if currently loading)
  useEffect(() => {
    if (state.isLoading) {
      completeProgress();
    }
  }, [pathname, searchParams]);

  return currentState;
}
```

--------------------------------------------------------------------------------

---[FILE: scroll-area.tsx]---
Location: prowler-master/ui/components/ui/scroll-area/scroll-area.tsx
Signals: React

```typescript
"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none transition-colors select-none",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-px",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-px",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/select/index.ts

```typescript
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select";
```

--------------------------------------------------------------------------------

---[FILE: Select.tsx]---
Location: prowler-master/ui/components/ui/select/Select.tsx
Signals: React

```typescript
"use client";

import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm ring-offset-white placeholder:text-slate-500 focus:ring-1 focus:ring-slate-950 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref: ForwardedRef<HTMLDivElement>) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:bg-slate-100 focus:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/sheet/index.ts

```typescript
export * from "./sheet";
export * from "./trigger-sheet";
```

--------------------------------------------------------------------------------

---[FILE: sheet.tsx]---
Location: prowler-master/ui/components/ui/sheet/sheet.tsx
Signals: React

```typescript
"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 border border-border-neutral-secondary bg-bg-neutral-secondary p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 rounded-b-xl data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 rounded-r-xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 rounded-l-xl data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold text-neutral-950 dark:text-neutral-50",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
```

--------------------------------------------------------------------------------

---[FILE: trigger-sheet.tsx]---
Location: prowler-master/ui/components/ui/sheet/trigger-sheet.tsx

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

interface TriggerSheetProps {
  triggerComponent: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TriggerSheet({
  triggerComponent,
  title,
  description,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: TriggerSheetProps) {
  return (
    <Sheet open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <SheetTrigger className="flex items-center gap-2">
        {triggerComponent}
      </SheetTrigger>
      <SheetContent className="my-4 max-h-[calc(100vh-2rem)] max-w-[95vw] overflow-y-auto pt-10 md:my-8 md:max-h-[calc(100vh-4rem)] md:max-w-[55vw]">
        <SheetHeader>
          <SheetTitle className="sr-only">{title}</SheetTitle>
          <SheetDescription className="sr-only">{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: collapsible-menu.tsx]---
Location: prowler-master/ui/components/ui/sidebar/collapsible-menu.tsx
Signals: React, Next.js

```typescript
"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/shadcn/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible/collapsible";
import { SubmenuItem } from "@/components/ui/sidebar/submenu-item";
import { cn } from "@/lib/utils";
import { IconComponent, SubmenuProps } from "@/types";

interface CollapsibleMenuProps {
  icon: IconComponent;
  label: string;
  submenus: SubmenuProps[];
  defaultOpen?: boolean;
  isOpen: boolean;
}

export const CollapsibleMenu = ({
  icon: Icon,
  label,
  submenus,
  defaultOpen = false,
  isOpen: isSidebarOpen,
}: CollapsibleMenuProps) => {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active,
  );
  const [isCollapsed, setIsCollapsed] = useState(
    isSubmenuActive || defaultOpen,
  );

  // Collapse the menu when sidebar is closed
  useEffect(() => {
    if (!isSidebarOpen) {
      setIsCollapsed(false);
    }
  }, [isSidebarOpen]);

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      defaultOpen={defaultOpen}
      className="group mb-1 w-full"
    >
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <CollapsibleTrigger asChild>
            <Button
              variant={isSubmenuActive ? "menu-active" : "menu-inactive"}
              className={cn(
                isSidebarOpen ? "w-full justify-start" : "w-14 justify-center",
              )}
            >
              {isSidebarOpen ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-4">
                      <Icon size={18} />
                    </span>
                    <p className="max-w-[150px] truncate">{label}</p>
                  </div>
                  <ChevronDown
                    size={18}
                    className="transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </div>
              ) : (
                <Icon size={18} />
              )}
            </Button>
          </CollapsibleTrigger>
        </TooltipTrigger>
        {!isSidebarOpen && (
          <TooltipContent side="right">{label}</TooltipContent>
        )}
      </Tooltip>
      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down flex flex-col items-end overflow-hidden">
        {submenus.map((submenu, index) => (
          <SubmenuItem key={index} {...submenu} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/sidebar/index.ts

```typescript
export * from "./collapsible-menu";
export * from "./menu";
export * from "./menu-item";
export * from "./sheet-menu";
export * from "./sidebar";
export * from "./sidebar-toggle";
export * from "./submenu-item";
```

--------------------------------------------------------------------------------

---[FILE: menu-item.tsx]---
Location: prowler-master/ui/components/ui/sidebar/menu-item.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/shadcn/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { cn } from "@/lib/utils";
import { IconComponent } from "@/types";

interface MenuItemProps {
  href: string;
  label: string;
  icon: IconComponent;
  active?: boolean;
  target?: string;
  tooltip?: string;
  isOpen: boolean;
}

export const MenuItem = ({
  href,
  label,
  icon: Icon,
  active,
  target,
  tooltip,
  isOpen,
}: MenuItemProps) => {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname.startsWith(href);

  // Show tooltip always for Prowler Hub, or when sidebar is collapsed
  const showTooltip = label === "Prowler Hub" ? !!tooltip : !isOpen;

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "menu-active" : "menu-inactive"}
          className={cn(
            isOpen ? "w-full justify-start" : "w-14 justify-center",
          )}
          asChild
        >
          <Link href={href} target={target}>
            <div className="flex items-center">
              <span className={cn(isOpen ? "mr-4" : "")}>
                <Icon size={18} />
              </span>
              {isOpen && <p className="max-w-[200px] truncate">{label}</p>}
            </div>
          </Link>
        </Button>
      </TooltipTrigger>
      {showTooltip && (
        <TooltipContent side="right">{tooltip || label}</TooltipContent>
      )}
    </Tooltip>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: menu.tsx]---
Location: prowler-master/ui/components/ui/sidebar/menu.tsx
Signals: Next.js

```typescript
"use client";

import { Divider } from "@heroui/divider";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AddIcon, InfoIcon } from "@/components/icons";
import { Button } from "@/components/shadcn/button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area";
import { CollapsibleMenu } from "@/components/ui/sidebar/collapsible-menu";
import { MenuItem } from "@/components/ui/sidebar/menu-item";
import { useAuth } from "@/hooks";
import { getMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui/store";
import { GroupProps } from "@/types";
import { RolePermissionAttributes } from "@/types/users";

interface MenuHideRule {
  label: string;
  condition: (permissions: RolePermissionAttributes) => boolean;
}

const MENU_HIDE_RULES: MenuHideRule[] = [
  {
    label: "Billing",
    condition: (permissions) => permissions?.manage_billing === false,
  },
  {
    label: "Integrations",
    condition: (permissions) => permissions?.manage_integrations === false,
  },
];

const filterMenus = (menuGroups: GroupProps[], labelsToHide: string[]) => {
  return menuGroups
    .map((group) => ({
      ...group,
      menus: group.menus
        .filter((menu) => !labelsToHide.includes(menu.label))
        .map((menu) => ({
          ...menu,
          submenus: menu.submenus?.filter(
            (submenu) => !labelsToHide.includes(submenu.label),
          ),
        })),
    }))
    .filter((group) => group.menus.length > 0);
};

export const Menu = ({ isOpen }: { isOpen: boolean }) => {
  const pathname = usePathname();
  const { permissions } = useAuth();
  const { hasProviders, openMutelistModal, requestMutelistModalOpen } =
    useUIStore();

  const menuList = getMenuList({
    pathname,
    hasProviders,
    openMutelistModal,
    requestMutelistModalOpen,
  });

  const labelsToHide = MENU_HIDE_RULES.filter((rule) =>
    rule.condition(permissions),
  ).map((rule) => rule.label);

  const filteredMenuList = filterMenus(menuList, labelsToHide);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Launch Scan Button */}
      <div className="shrink-0 px-2">
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              asChild
              className={cn(isOpen ? "w-full" : "w-14")}
              variant="default"
              size="default"
            >
              <Link href="/scans" aria-label="Launch Scan">
                {isOpen ? "Launch Scan" : <AddIcon className="size-5" />}
              </Link>
            </Button>
          </TooltipTrigger>
          {!isOpen && <TooltipContent side="right">Launch Scan</TooltipContent>}
        </Tooltip>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full [&>div>div[style]]:block!">
          <nav className="mt-2 w-full lg:mt-6">
            <ul className="mx-2 flex flex-col items-start gap-1 pb-4">
              {filteredMenuList.map((group, groupIndex) => (
                <li key={groupIndex} className="w-full">
                  {group.menus.map((menu, menuIndex) => (
                    <div key={menuIndex} className="w-full">
                      {menu.submenus && menu.submenus.length > 0 ? (
                        <CollapsibleMenu
                          icon={menu.icon}
                          label={menu.label}
                          submenus={menu.submenus}
                          defaultOpen={menu.defaultOpen}
                          isOpen={isOpen}
                        />
                      ) : (
                        <MenuItem
                          href={menu.href}
                          label={menu.label}
                          icon={menu.icon}
                          active={menu.active}
                          target={menu.target}
                          tooltip={menu.tooltip}
                          isOpen={isOpen}
                        />
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="text-muted-foreground border-border-neutral-secondary flex shrink-0 items-center justify-center gap-2 border-t pt-4 pb-2 text-center text-xs">
        {isOpen ? (
          <>
            <span>{process.env.NEXT_PUBLIC_PROWLER_RELEASE_VERSION}</span>
            {process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true" && (
              <>
                <Divider orientation="vertical" />
                <Link
                  href="https://status.prowler.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <InfoIcon size={16} />
                  <span className="text-muted-foreground font-normal opacity-80 transition-opacity hover:font-bold hover:opacity-100">
                    Service Status
                  </span>
                </Link>
              </>
            )}
          </>
        ) : (
          process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="https://status.prowler.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <InfoIcon size={16} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Service Status</TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: sheet-menu.tsx]---
Location: prowler-master/ui/components/ui/sidebar/sheet-menu.tsx
Signals: Next.js

```typescript
import { MenuIcon } from "lucide-react";
import Link from "next/link";

import { ProwlerExtended } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "@/components/ui/sidebar/menu";

import { Button } from "../button/button";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Sidebar</SheetTitle>
          <SheetDescription className="sr-only" />
          <Button
            className="flex items-center justify-center pt-1 pb-2"
            variant="link"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <ProwlerExtended />
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: sidebar-toggle.tsx]---
Location: prowler-master/ui/components/ui/sidebar/sidebar-toggle.tsx

```typescript
import {
  SidebarCollapseIcon,
  SidebarExpandIcon,
} from "@/components/icons/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";

import { Button } from "../button/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => setIsOpen?.()}
          className="h-8 w-8 rounded-md"
          variant="outline"
          size="icon"
        >
          {isOpen === false ? (
            <SidebarCollapseIcon className="h-5 w-5" />
          ) : (
            <SidebarExpandIcon className="h-5 w-5" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      </TooltipContent>
    </Tooltip>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: sidebar.tsx]---
Location: prowler-master/ui/components/ui/sidebar/sidebar.tsx
Signals: Next.js

```typescript
"use client";

import clsx from "clsx";
import Link from "next/link";

import { ProwlerShort } from "@/components/icons";
import { ProwlerExtended } from "@/components/icons";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";

import { Button } from "../button/button";
import { Menu } from "./menu";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden",
      )}
    >
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="no-scrollbar relative flex h-full flex-col overflow-x-hidden overflow-y-auto px-3 py-6"
      >
        <Button
          className={cn(
            "mb-1 transition-transform duration-300 ease-in-out",
            !getOpenState() ? "translate-x-1" : "translate-x-0",
          )}
          variant="link"
          asChild
        >
          <Link
            href="/"
            className={clsx(
              "mb-6 flex w-full flex-col items-center justify-center px-3",
              {
                "gap-0": !isOpen,
              },
            )}
          >
            <div
              className={clsx({
                hidden: isOpen,
              })}
            >
              <ProwlerShort />
            </div>
            <div
              className={clsx({
                hidden: !isOpen,
                "mt-0!": isOpen,
              })}
            >
              <ProwlerExtended />
            </div>
          </Link>
        </Button>

        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
```

--------------------------------------------------------------------------------

````
