---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 836
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 836 of 867)

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

---[FILE: skeleton-scan-detail.tsx]---
Location: prowler-master/ui/components/scans/table/scans/skeleton-scan-detail.tsx

```typescript
import { Card, CardContent, CardHeader } from "@/components/shadcn";
import { Skeleton } from "@/components/shadcn/skeleton/skeleton";

export const SkeletonScanDetail = () => {
  return (
    <div className="flex flex-col gap-6 rounded-lg">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Scan Details Section Skeleton */}
      <Card variant="base" padding="lg">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* First grid row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`grid1-${index}`} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>

          {/* Second grid row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`grid2-${index}`} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>

          {/* Scan ID field */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Third grid row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`grid3-${index}`} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/services/index.ts

```typescript
export * from "./ServiceCard";
export * from "./ServiceSkeletonGrid";
```

--------------------------------------------------------------------------------

---[FILE: ServiceCard.tsx]---
Location: prowler-master/ui/components/services/ServiceCard.tsx

```typescript
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

import { getAWSIcon, NotificationIcon, SuccessIcon } from "../icons";

interface CardServiceProps {
  fidingsFailed: number;
  serviceAlias: string;
}
export const ServiceCard: React.FC<CardServiceProps> = ({
  fidingsFailed,
  serviceAlias,
}) => {
  return (
    <Card fullWidth isPressable isHoverable shadow="sm">
      <CardBody className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {getAWSIcon(serviceAlias)}
          <div className="flex flex-col">
            <h4 className="text-md leading-5 font-bold">{serviceAlias}</h4>
            <small className="text-default-500">
              {fidingsFailed > 0
                ? `${fidingsFailed} Failed Findings`
                : "No failed findings"}
            </small>
          </div>
        </div>

        <Chip
          className="h-10"
          variant="flat"
          startContent={
            fidingsFailed > 0 ? (
              <NotificationIcon size={18} />
            ) : (
              <SuccessIcon size={18} />
            )
          }
          color={fidingsFailed > 0 ? "danger" : "success"}
          radius="full"
          size="md"
        >
          {fidingsFailed > 0 ? fidingsFailed : ""}
        </Chip>
      </CardBody>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: ServiceSkeletonGrid.tsx]---
Location: prowler-master/ui/components/services/ServiceSkeletonGrid.tsx
Signals: React

```typescript
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import React from "react";

export const ServiceSkeletonGrid = () => {
  return (
    <Card className="h-fit w-full p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(25)].map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <Skeleton className="h-16 rounded-lg">
              <div className="bg-default-300 h-full"></div>
            </Skeleton>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: collapsible.tsx]---
Location: prowler-master/ui/components/shadcn/collapsible.tsx

```typescript
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
```

--------------------------------------------------------------------------------

---[FILE: command.tsx]---
Location: prowler-master/ui/components/shadcn/command.tsx

```typescript
"use client";

import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { cn } from "@/lib/utils";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn("overflow-hidden p-0", className)}
        showCloseButton={showCloseButton}
      >
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors select-none",
        "hover:bg-bg-neutral-tertiary hover:text-text-neutral-primary",
        "data-[selected=true]:bg-bg-neutral-tertiary data-[selected=true]:text-text-neutral-primary",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
```

--------------------------------------------------------------------------------

---[FILE: dialog.tsx]---
Location: prowler-master/ui/components/shadcn/dialog.tsx

```typescript
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/shadcn/index.ts

```typescript
export * from "./badge/badge";
export * from "./button/button";
export * from "./card/card";
export * from "./card/resource-stats-card/resource-stats-card";
export * from "./card/resource-stats-card/resource-stats-card-content";
export * from "./card/resource-stats-card/resource-stats-card-header";
export * from "./combobox";
export * from "./dropdown/dropdown";
export * from "./select/multiselect";
export * from "./select/select";
export * from "./separator/separator";
export * from "./skeleton/skeleton";
export * from "./tabs/generic-tabs";
export * from "./tabs/tabs";
export * from "./tooltip";
```

--------------------------------------------------------------------------------

---[FILE: popover.tsx]---
Location: prowler-master/ui/components/shadcn/popover.tsx

```typescript
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/ui/components/shadcn/README.md

```text
# shadcn Components

This directory contains all shadcn/ui based components for the Prowler application.

## Directory Structure

Example of a custom component:

```
shadcn/
├── card/
│   ├── base-card/
│   │   ├── base-card.tsx
│   ├── card/
│   │   ├── card.tsx
│   └── resource-stats-card/
│       ├── resource-stats-card.tsx
│       ├── resource-stats-card.example.tsx
├── tabs/
│   ├── tabs.tsx                # Base tab components
│   ├── generic-tabs.tsx        # Generic reusable tabs with lazy loading
├── index.ts                    # Barrel exports
└── README.md
```

## Usage

All shadcn components can be imported from `@/components/shadcn`:

```tsx
import { Card, CardHeader, CardContent } from "@/components/shadcn";
import { ResourceStatsCard } from "@/components/shadcn";
import { GenericTabs, type TabItem } from "@/components/shadcn";
```

### GenericTabs Component

The `GenericTabs` component provides a flexible, lazy-loaded tabs interface. Content is only rendered when the tab is active, improving performance.

**Basic Example:**

```tsx
import { lazy } from "react";
import { GenericTabs, type TabItem } from "@/components/shadcn";

const OverviewContent = lazy(() => import("./OverviewContent"));
const DetailsContent = lazy(() => import("./DetailsContent"));

const tabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: OverviewContent,
  },
  {
    id: "details",
    label: "Details",
    content: DetailsContent,
  },
];

export function MyComponent() {
  return <GenericTabs tabs={tabs} defaultTabId="overview" />;
}
```

**With Icons and Props:**

```tsx
import { Eye, Settings } from "lucide-react";
import { GenericTabs, type TabItem } from "@/components/shadcn";

const tabs: TabItem[] = [
  {
    id: "view",
    label: "View",
    icon: <Eye size={16} />,
    content: ViewContent,
    contentProps: { data: myData },
  },
  {
    id: "config",
    label: "Config",
    icon: <Settings size={16} />,
    content: ConfigContent,
  },
];

export function MyComponent() {
  return (
    <GenericTabs
      tabs={tabs}
      defaultTabId="view"
      onTabChange={(tabId) => console.log("Active tab:", tabId)}
    />
  );
}
```

**Props:**

- `tabs` - Array of `TabItem` objects
- `defaultTabId` - Initial active tab ID (defaults to first tab)
- `className` - Wrapper class
- `listClassName` - TabsList class
- `triggerClassName` - TabsTrigger class
- `contentClassName` - TabsContent class
- `onTabChange` - Callback fired when tab changes

## Adding New shadcn Components

When adding new shadcn components using the CLI:

```bash
npx shadcn@latest add [component-name]
```

The component will be automatically added to this directory due to the configuration in `components.json`:

```json
{
  "aliases": {
    "ui": "@/components/shadcn"
  }
}
```

## Component Guidelines

1. **shadcn base components** - Use as-is from shadcn/ui (e.g., `card.tsx`)
2. **Custom components built on shadcn** - Create in subdirectories (e.g., `resource-stats-card/`)
3. **CVA variants** - Use Class Variance Authority for type-safe variants
4. **Theme support** - Include `dark:` classes for dark/light theme compatibility
5. **TypeScript** - Always export types and use proper typing

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [CVA Documentation](https://cva.style/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
```

--------------------------------------------------------------------------------

---[FILE: tooltip.tsx]---
Location: prowler-master/ui/components/shadcn/tooltip.tsx

```typescript
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
```

--------------------------------------------------------------------------------

---[FILE: badge.tsx]---
Location: prowler-master/ui/components/shadcn/badge/badge.tsx
Signals: React

```typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
```

--------------------------------------------------------------------------------

---[FILE: button.tsx]---
Location: prowler-master/ui/components/shadcn/button/button.tsx
Signals: React

```typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:bg-button-disabled disabled:text-text-neutral-tertiary outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-button-primary text-black hover:bg-button-primary-hover active:bg-button-primary-press focus-visible:ring-button-primary/50",
        secondary:
          "bg-button-secondary text-white hover:bg-button-secondary/90 active:bg-button-secondary-press focus-visible:ring-button-secondary/50 dark:text-black",
        tertiary:
          "bg-button-tertiary text-white hover:bg-button-tertiary-hover active:bg-button-tertiary-active focus-visible:ring-button-tertiary/50",
        destructive:
          "bg-bg-fail text-white hover:bg-bg-fail/90 active:bg-bg-fail/80 focus-visible:ring-bg-fail/50",
        outline:
          "border border-border-neutral-secondary bg-bg-neutral-secondary hover:bg-bg-neutral-tertiary active:bg-border-neutral-tertiary text-text-neutral-primary focus-visible:ring-border-neutral-tertiary/50",
        ghost:
          "text-text-neutral-primary hover:bg-bg-neutral-tertiary active:bg-border-neutral-secondary focus-visible:ring-border-neutral-secondary/50",
        link: "text-button-tertiary underline-offset-4 hover:text-button-tertiary-hover",
        // Menu variant like secondary but more padding and the back is almost transparent
        menu: "backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 text-text-neutral-primary dark:text-white shadow-lg hover:bg-white/70 dark:hover:bg-white/10 hover:border-white/90 dark:hover:border-white/30 active:bg-white/80 dark:active:bg-white/15 active:scale-[0.98] focus-visible:ring-button-primary/50 transition-all duration-200",
        "menu-active":
          "backdrop-blur-xl bg-white/50 dark:bg-white/5 border border-black/[0.08] dark:border-white/10 text-text-neutral-primary dark:text-white shadow-sm hover:bg-white/60 dark:hover:bg-white/10 hover:border-black/[0.12] dark:hover:border-white/30 active:bg-white/70 dark:active:bg-white/15 active:scale-[0.98] focus-visible:ring-button-primary/50 transition-all duration-200",
        "menu-inactive":
          "text-text-neutral-primary border border-transparent hover:backdrop-blur-xl hover:bg-white/40 dark:hover:bg-white/5 hover:border-black/[0.08] dark:hover:border-white/10 hover:shadow-sm active:bg-white/50 dark:active:bg-white/15 active:scale-[0.98] focus-visible:ring-border-neutral-secondary/50 transition-all duration-200",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "link-sm": "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

--------------------------------------------------------------------------------

---[FILE: card.tsx]---
Location: prowler-master/ui/components/shadcn/card/card.tsx

```typescript
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const CardVariant = {
  default: "default",
  fail: "fail",
  pass: "pass",
  warning: "warning",
  info: "info",
} as const;

export type CardVariant = (typeof CardVariant)[keyof typeof CardVariant];

const cardVariants = cva("flex flex-col gap-6 rounded-xl border", {
  variants: {
    variant: {
      default: "",
      base: "border-border-neutral-secondary bg-bg-neutral-secondary px-[18px] pt-3 pb-4",
      inner:
        "rounded-[12px] backdrop-blur-[46px] border-border-neutral-tertiary bg-bg-neutral-tertiary",
    },
    padding: {
      default: "",
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-5 py-4",
      none: "p-0",
    },
  },
  compoundVariants: [
    {
      variant: "inner",
      padding: "default",
      className: "px-4 py-3", // md padding by default for inner
    },
  ],
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
});

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header mb-6 grid auto-rows-min grid-rows-[auto_auto] items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("mt-2 text-[18px] leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
export type { CardProps };
```

--------------------------------------------------------------------------------

---[FILE: resource-stats-card-content.tsx]---
Location: prowler-master/ui/components/shadcn/card/resource-stats-card/resource-stats-card-content.tsx

```typescript
import { cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { CardVariant } from "@/components/shadcn/card/card";
import { cn } from "@/lib/utils";

export interface StatItem {
  icon: LucideIcon;
  label: string;
}

const variantColors = {
  default: "var(--text-neutral-tertiary)",
  fail: "var(--bg-fail-primary)",
  pass: "var(--bg-pass-primary)",
  warning: "var(--bg-warning-primary)",
  info: "var(--bg-data-info)",
} as const;

type BadgeVariant = keyof typeof variantColors;

const badgeVariants = cva(
  ["flex", "items-center", "justify-center", "gap-0.5", "rounded-full"],
  {
    variants: {
      variant: {
        [CardVariant.default]: "bg-slate-100 dark:bg-[#535359]",
        [CardVariant.fail]: "bg-bg-fail-secondary",
        [CardVariant.pass]: "bg-bg-pass-secondary",
        [CardVariant.warning]: "bg-amber-100 dark:bg-[#3d3520]",
        [CardVariant.info]: "bg-blue-100 dark:bg-[#1e3a5f]",
      },
      size: {
        sm: "px-1 text-xs",
        md: "px-1.5 text-sm",
        lg: "px-2 text-base",
      },
    },
    defaultVariants: {
      variant: CardVariant.fail,
      size: "md",
    },
  },
);

const badgeIconVariants = cva("", {
  variants: {
    size: {
      sm: "h-2.5 w-2.5",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const labelTextVariants = cva(
  "leading-6 font-semibold text-text-neutral-secondary whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const statIconVariants = cva("text-text-neutral-secondary", {
  variants: {
    size: {
      sm: "h-2.5 w-2.5",
      md: "h-3 w-3",
      lg: "h-3.5 w-3.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const statLabelVariants = cva(
  "leading-5 font-medium text-text-neutral-secondary",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface ResourceStatsCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  badge: {
    icon: LucideIcon;
    count: number | string;
    variant?: CardVariant;
  };
  label: string;
  stats?: StatItem[];
  accentColor?: string;
  size?: "sm" | "md" | "lg";
  ref?: React.Ref<HTMLDivElement>;
}

export const ResourceStatsCardContent = ({
  badge,
  label,
  stats = [],
  accentColor,
  size = "md",
  className,
  ref,
  ...props
}: ResourceStatsCardContentProps) => {
  const BadgeIcon = badge.icon;
  const badgeVariant: BadgeVariant = badge.variant || "fail";

  // Determine accent line color
  const lineColor = accentColor || variantColors[badgeVariant] || "#d4d4d8";

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-[5px]", className)}
      {...props}
    >
      {/* Badge and Label Row */}
      <div className="flex w-full items-center gap-1">
        {/* Badge */}
        <div className={cn(badgeVariants({ variant: badgeVariant, size }))}>
          <BadgeIcon
            className={badgeIconVariants({ size })}
            strokeWidth={2.5}
            style={{ color: variantColors[badgeVariant] }}
          />
          <span
            className="leading-6 font-bold"
            style={{ color: variantColors[badgeVariant] }}
          >
            {badge.count}
          </span>
        </div>

        {/* Label */}
        <span className={labelTextVariants({ size })}>{label}</span>
      </div>

      {/* Stats Section */}
      {stats.length > 0 && (
        <div className="flex w-full items-stretch gap-0">
          {/* Vertical Accent Line */}
          <div className="flex items-stretch px-3 py-1">
            <div
              className="w-px rounded-full"
              style={{ backgroundColor: lineColor }}
            />
          </div>

          {/* Stats List */}
          <div className="flex flex-1 flex-col gap-0.5">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-1">
                  <StatIcon
                    className={statIconVariants({ size })}
                    strokeWidth={2}
                  />
                  <span className={statLabelVariants({ size })}>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

ResourceStatsCardContent.displayName = "ResourceStatsCardContent";
```

--------------------------------------------------------------------------------

---[FILE: resource-stats-card-header.tsx]---
Location: prowler-master/ui/components/shadcn/card/resource-stats-card/resource-stats-card-header.tsx

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const headerVariants = cva("flex w-full items-center gap-1", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const iconVariants = cva("text-text-neutral-secondary", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const titleVariants = cva(
  "leading-7 font-semibold text-text-neutral-secondary",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const countVariants = cva("leading-4 font-normal text-text-neutral-secondary", {
  variants: {
    size: {
      sm: "text-[9px]",
      md: "text-[10px]",
      lg: "text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ResourceStatsCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  icon: LucideIcon;
  title: string;
  resourceCount?: number | string;
  ref?: React.Ref<HTMLDivElement>;
}

export const ResourceStatsCardHeader = ({
  icon: Icon,
  title,
  resourceCount,
  size = "md",
  className,
  ref,
  ...props
}: ResourceStatsCardHeaderProps) => {
  return (
    <div
      ref={ref}
      className={cn(headerVariants({ size }), className)}
      {...props}
    >
      <div className="flex flex-1 items-center gap-1">
        <Icon className={iconVariants({ size })} strokeWidth={2} />
        <span className={titleVariants({ size })}>{title}</span>
      </div>
      {resourceCount !== undefined && (
        <span className={countVariants({ size })}>
          {typeof resourceCount === "number"
            ? `${resourceCount} Resources`
            : resourceCount}
        </span>
      )}
    </div>
  );
};

ResourceStatsCardHeader.displayName = "ResourceStatsCardHeader";
```

--------------------------------------------------------------------------------

````
