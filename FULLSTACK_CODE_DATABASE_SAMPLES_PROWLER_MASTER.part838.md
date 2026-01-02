---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 838
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 838 of 867)

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

---[FILE: select.tsx]---
Location: prowler-master/ui/components/shadcn/select/select.tsx
Signals: React

```typescript
"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Select({
  allowDeselect = false,
  ...props
}: ComponentProps<typeof SelectPrimitive.Root> & {
  allowDeselect?: boolean;
}) {
  const handleValueChange = (nextValue: string) => {
    if (allowDeselect && props.value === nextValue) {
      // Single-select with deselect
      props.onValueChange?.("");
    } else {
      // Single-select
      props.onValueChange?.(nextValue);
    }
  };

  return (
    <SelectPrimitive.Root
      data-slot="select"
      {...props}
      onValueChange={handleValueChange}
    />
  );
}

function SelectGroup({
  ...props
}: ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-border-input-primary bg-bg-input-primary text-bg-button-secondary data-[placeholder]:text-bg-button-secondary [&_svg:not([class*='text-'])]:text-bg-button-secondary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-border-input-primary-press focus-visible:ring-border-input-primary-press flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[52px] data-[size=sm]:h-10 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:focus-visible:ring-slate-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className="text-bg-button-secondary size-6"
          aria-hidden="true"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-border-input-primary bg-bg-input-primary relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "flex flex-col gap-1 p-3",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-bg-button-secondary px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-bg-button-secondary text-bg-button-secondary relative flex w-full cursor-pointer items-center gap-2 rounded-lg py-3 pr-12 pl-4 text-sm outline-hidden select-none hover:bg-slate-200 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 dark:hover:bg-slate-700/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText asChild>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {children}
        </span>
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator asChild>
        <CheckIcon className="text-bg-button-secondary absolute right-4 size-5" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="text-bg-button-secondary size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="text-bg-button-secondary size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

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

---[FILE: separator.tsx]---
Location: prowler-master/ui/components/shadcn/separator/separator.tsx
Signals: React

```typescript
"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
```

--------------------------------------------------------------------------------

---[FILE: skeleton.tsx]---
Location: prowler-master/ui/components/shadcn/skeleton/skeleton.tsx

```typescript
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-border-neutral-tertiary animate-pulse rounded-md",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
```

--------------------------------------------------------------------------------

---[FILE: generic-tabs.tsx]---
Location: prowler-master/ui/components/shadcn/tabs/generic-tabs.tsx
Signals: React

```typescript
"use client";

import type { ComponentType, ReactNode } from "react";
import { Suspense, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ComponentType<{ isActive: boolean }>;
  contentProps?: Record<string, unknown>;
}

interface GenericTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * A generic tabs component that accepts an array of tab objects with lazy-loaded content.
 *
 * @example
 * const tabs: TabItem[] = [
 *   {
 *     id: "tab-1",
 *     label: "Tab 1",
 *     content: lazy(() => import("./Tab1Content")),
 *     contentProps: { key: "value" }
 *   },
 *   {
 *     id: "tab-2",
 *     label: "Tab 2",
 *     content: lazy(() => import("./Tab2Content"))
 *   }
 * ];
 *
 * <GenericTabs tabs={tabs} defaultTabId="tab-1" onTabChange={(id) => console.log(id)} />
 */
export function GenericTabs({
  tabs,
  defaultTabId,
  className,
  listClassName,
  triggerClassName,
  contentClassName,
  onTabChange,
}: GenericTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTabId || tabs[0]?.id || "",
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className={triggerClassName}>
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => {
        const ContentComponent = tab.content;
        const isActive = activeTab === tab.id;

        return (
          <TabsContent key={tab.id} value={tab.id} className={contentClassName}>
            {isActive && (
              <Suspense fallback={<div>Loading...</div>}>
                <ContentComponent
                  isActive={isActive}
                  {...(tab.contentProps || {})}
                />
              </Suspense>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: tabs.constants.ts]---
Location: prowler-master/ui/components/shadcn/tabs/tabs.constants.ts

```typescript
/**
 * Trigger component style parts using semantic class names
 */
const TRIGGER_STYLES = {
  base: "relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  border: "border-r border-[#E9E9F0] last:border-r-0 dark:border-[#171D30]",
  text: "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
  active:
    "data-[state=active]:text-slate-900 dark:data-[state=active]:text-white",
  underline:
    "after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-emerald-400 after:transition-all data-[state=active]:after:w-[calc(100%-theme(spacing.5))]",
  focus:
    "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-offset-slate-950",
  icon: "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
} as const;

/**
 * Content component styles
 */
export const CONTENT_STYLES =
  "mt-2 focus-visible:rounded-md focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:border-ring focus-visible:outline-ring focus-visible:ring-ring/50" as const;

/**
 * Build trigger className by combining style parts
 */
export function buildTriggerClassName(): string {
  return [
    TRIGGER_STYLES.base,
    TRIGGER_STYLES.border,
    TRIGGER_STYLES.text,
    TRIGGER_STYLES.active,
    TRIGGER_STYLES.underline,
    TRIGGER_STYLES.focus,
    TRIGGER_STYLES.icon,
  ].join(" ");
}

/**
 * Build list className
 */
export function buildListClassName(): string {
  return "inline-flex w-full items-center border-[#E9E9F0] dark:border-[#171D30]";
}
```

--------------------------------------------------------------------------------

---[FILE: tabs.tsx]---
Location: prowler-master/ui/components/shadcn/tabs/tabs.tsx
Signals: React

```typescript
"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import {
  buildListClassName,
  buildTriggerClassName,
  CONTENT_STYLES,
} from "./tabs.constants";

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(buildListClassName(), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(buildTriggerClassName(), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(CONTENT_STYLES, className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/index.ts

```typescript
export * from "./accordion/Accordion";
export * from "./action-card/ActionCard";
export * from "./alert/Alert";
export * from "./alert-dialog/AlertDialog";
export * from "./breadcrumbs";
export * from "./collapsible/collapsible";
export * from "./content-layout/content-layout";
export * from "./dialog/dialog";
export * from "./download-icon-button/download-icon-button";
export * from "./dropdown/Dropdown";
export * from "./feedback-banner/feedback-banner";
export * from "./headers/navigation-header";
export * from "./label/Label";
export * from "./main-layout/main-layout";
export * from "./navigation-progress";
export * from "./select";
export * from "./sidebar";
export * from "./toast";
```

--------------------------------------------------------------------------------

---[FILE: Accordion.tsx]---
Location: prowler-master/ui/components/ui/accordion/Accordion.tsx
Signals: React

```typescript
"use client";

import { Accordion as NextUIAccordion, AccordionItem } from "@heroui/accordion";
import type { Selection } from "@react-types/shared";
import { ChevronDown } from "lucide-react";
import React, { ReactNode, useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  key: string;
  title: ReactNode;
  subtitle?: ReactNode;
  content: ReactNode;
  items?: AccordionItemProps[];
  isDisabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  variant?: "light" | "shadow" | "bordered" | "splitted";
  className?: string;
  defaultExpandedKeys?: string[];
  selectedKeys?: string[];
  selectionMode?: "single" | "multiple";
  isCompact?: boolean;
  showDivider?: boolean;
  onItemExpand?: (key: string) => void;
  onSelectionChange?: (keys: string[]) => void;
}

const AccordionContent = ({
  content,
  items,
  selectedKeys,
  onSelectionChange,
}: {
  content: ReactNode;
  items?: AccordionItemProps[];
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
}) => {
  // Normalize possible array content to automatically assign stable keys
  const normalizedContent = Array.isArray(content)
    ? React.Children.toArray(content)
    : content;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      {normalizedContent}
      {items && items.length > 0 && (
        <div className="mt-4 ml-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
          <Accordion
            items={items}
            variant="light"
            isCompact
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          />
        </div>
      )}
    </div>
  );
};

export const Accordion = ({
  items,
  variant = "light",
  className,
  defaultExpandedKeys = [],
  selectedKeys,
  selectionMode = "single",
  isCompact = false,
  showDivider = true,
  onItemExpand,
  onSelectionChange,
}: AccordionProps) => {
  // Determine if component is in controlled or uncontrolled mode
  const isControlled = selectedKeys !== undefined;

  const [internalExpandedKeys, setInternalExpandedKeys] = useState<Selection>(
    new Set(defaultExpandedKeys),
  );

  // Use selectedKeys if controlled, otherwise use internal state
  const expandedKeys = useMemo(
    () => (isControlled ? new Set(selectedKeys) : internalExpandedKeys),
    [isControlled, selectedKeys, internalExpandedKeys],
  );

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      const keysArray = Array.from(keys as Set<string>);

      // If controlled mode, call parent callback
      if (isControlled && onSelectionChange) {
        onSelectionChange(keysArray);
      } else {
        // If uncontrolled, update internal state
        setInternalExpandedKeys(keys);
      }

      // Handle onItemExpand for backward compatibility
      if (onItemExpand && keys !== expandedKeys) {
        const currentKeys = Array.from(expandedKeys as Set<string>);
        const newKeys = keysArray;

        const newlyExpandedKeys = newKeys.filter(
          (key) => !currentKeys.includes(key),
        );

        newlyExpandedKeys.forEach((key) => {
          onItemExpand(key);
        });
      }
    },
    [expandedKeys, onItemExpand, isControlled, onSelectionChange],
  );

  return (
    <NextUIAccordion
      className={cn(
        "bg-bg-neutral-primary border-border-neutral-secondary w-full rounded-lg border",
        className,
      )}
      variant={variant}
      selectionMode={selectionMode}
      selectedKeys={expandedKeys}
      onSelectionChange={handleSelectionChange}
      isCompact={isCompact}
      showDivider={showDivider}
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.key}
          aria-label={
            typeof item.title === "string" ? item.title : `Item ${item.key}`
          }
          title={item.title}
          subtitle={item.subtitle}
          isDisabled={item.isDisabled}
          indicator={<ChevronDown className="text-gray-500" />}
          classNames={{
            base: index === 0 || index === 1 ? "my-2" : "my-2",
            title: "text-sm",
            subtitle: "text-xs text-gray-500",
            trigger:
              "py-2 px-2 rounded-lg data-[hover=true]:bg-bg-neutral-tertiary data-[open=true]:bg-bg-neutral-tertiary w-full flex items-center transition-colors",
            content: "px-0 py-1",
          }}
        >
          <AccordionContent
            key={`${item.key}-content`}
            content={item.content}
            items={item.items}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          />
        </AccordionItem>
      ))}
    </NextUIAccordion>
  );
};

Accordion.displayName = "Accordion";
```

--------------------------------------------------------------------------------

---[FILE: ActionCard.tsx]---
Location: prowler-master/ui/components/ui/action-card/ActionCard.tsx
Signals: React

```typescript
"use client";

import type { CardProps } from "@heroui/card";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import React from "react";

import { cn } from "@/lib";

export type ActionCardProps = CardProps & {
  icon: string;
  title: string;
  color?: "success" | "secondary" | "warning" | "fail";
  description: string;
};

export const ActionCard = React.forwardRef<HTMLDivElement, ActionCardProps>(
  ({ color, title, icon, description, children, className, ...props }, ref) => {
    const colors = React.useMemo(() => {
      switch (color) {
        case "success":
          return {
            card: "border-system-success-medium",
            iconWrapper: "bg-system-success-lighter border-system-success",
            icon: "text-system-success",
          };
        case "secondary":
          return {
            card: "border-secondary-100",
            iconWrapper: "bg-secondary-50 border-secondary-100",
            icon: "text-secondary",
          };
        case "warning":
          return {
            card: "border-warning-500",
            iconWrapper: "bg-warning-50 border-warning-100",
            icon: "text-warning-600",
          };
        case "fail":
          return {
            card: "border-danger-300",
            iconWrapper: "bg-danger-50 border-danger-100",
            icon: "text-text-error",
          };

        default:
          return {
            card: "border-default-200",
            iconWrapper: "bg-default-50 border-default-100",
            icon: "text-default-500",
          };
      }
    }, [color]);

    return (
      <Card
        ref={ref}
        isPressable
        className={cn("border-small", colors?.card, className)}
        shadow="sm"
        {...props}
      >
        <CardBody className="flex h-full flex-row items-center gap-2 p-2">
          <div
            className={cn(
              "item-center rounded-medium flex border p-1",
              colors?.iconWrapper,
            )}
          >
            <Icon className={colors?.icon} icon={icon} width={24} />
          </div>
          <div className="flex flex-col">
            <p className="text-md">{title}</p>
            <p className="text-default-400 text-sm">
              {description || children}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  },
);

ActionCard.displayName = "ActionCard";
```

--------------------------------------------------------------------------------

---[FILE: Alert.tsx]---
Location: prowler-master/ui/components/ui/alert/Alert.tsx
Signals: React

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border border-slate-200 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 [&>svg~*]:pl-7 dark:border-slate-800 dark:[&>svg]:text-slate-50",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        destructive:
          "bg-danger-50 border-red-500/50 text-red-700 dark:border-red-500  dark:border-red-900/50 dark:text-red-700 dark:dark:border-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 leading-none font-medium tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
```

--------------------------------------------------------------------------------

---[FILE: AlertDialog.tsx]---
Location: prowler-master/ui/components/ui/alert-dialog/AlertDialog.tsx
Signals: React

```typescript
"use client";

import { cn } from "@heroui/theme";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
    {...props}
  />
));
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(className)} {...props} />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn("mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
```

--------------------------------------------------------------------------------

---[FILE: avatar.tsx]---
Location: prowler-master/ui/components/ui/avatar/avatar.tsx
Signals: React

```typescript
"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-muted flex h-full w-full items-center justify-center rounded-full",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
```

--------------------------------------------------------------------------------

---[FILE: breadcrumb-navigation.tsx]---
Location: prowler-master/ui/components/ui/breadcrumbs/breadcrumb-navigation.tsx
Signals: React, Next.js

```typescript
"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

import { LighthouseIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

export interface CustomBreadcrumbItem {
  name: string;
  path?: string;
  icon?: string | ReactNode;
  isLast?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}

interface BreadcrumbNavigationProps {
  mode?: "auto" | "custom" | "hybrid";
  title?: string;
  icon?: string | ReactNode;
  customItems?: CustomBreadcrumbItem[];
  className?: string;
  paramToPreserve?: string;
  showTitle?: boolean;
}

export function BreadcrumbNavigation({
  mode = "auto",
  title,
  icon,
  customItems = [],
  className = "",
  paramToPreserve = "scanId",
  showTitle = true,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const generateAutoBreadcrumbs = (): CustomBreadcrumbItem[] => {
    const pathIconMapping: Record<string, string | ReactNode> = {
      "/integrations": "lucide:puzzle",
      "/providers": "lucide:cloud",
      "/users": "lucide:users",
      "/compliance": "lucide:shield-check",
      "/findings": "lucide:search",
      "/scans": "lucide:activity",
      "/roles": "lucide:key",
      "/resources": "lucide:database",
      "/lighthouse": <LighthouseIcon />,
      "/manage-groups": "lucide:users-2",
      "/services": "lucide:server",
      "/workloads": "lucide:layers",
    };

    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    if (pathSegments.length === 0) {
      return [{ name: "Home", path: "/", isLast: true }];
    }

    const breadcrumbs: CustomBreadcrumbItem[] = [];
    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      let displayName = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Special cases:
      if (segment.includes("-")) {
        displayName = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
      if (segment === "lighthouse") {
        displayName = "Lighthouse AI";
      }

      const segmentIcon = !isLast ? pathIconMapping[currentPath] : undefined;

      breadcrumbs.push({
        name: displayName,
        path: currentPath,
        icon: segmentIcon,
        isLast,
        isClickable: !isLast,
      });
    });

    return breadcrumbs;
  };

  const buildNavigationUrl = (path: string) => {
    const paramValue = searchParams.get(paramToPreserve);
    if (path === "/compliance" && paramValue) {
      return `/compliance?${paramToPreserve}=${paramValue}`;
    }
    return path;
  };

  const renderTitleWithIcon = (titleText: string, isLink: boolean = false) => (
    <>
      {typeof icon === "string" ? (
        <Icon
          className="text-text-neutral-primary"
          height={24}
          icon={icon}
          width={24}
        />
      ) : icon ? (
        <div className="flex h-8 w-8 items-center justify-center *:h-full *:w-full">
          {icon}
        </div>
      ) : null}
      <h1
        className={`text-text-neutral-primary max-w-[200px] truncate text-sm font-bold sm:max-w-none ${isLink ? "hover:text-primary transition-colors" : ""}`}
      >
        {titleText}
      </h1>
    </>
  );

  // Determine which breadcrumbs to use
  let breadcrumbItems: CustomBreadcrumbItem[] = [];

  switch (mode) {
    case "auto":
      breadcrumbItems = generateAutoBreadcrumbs();
      break;
    case "custom":
      breadcrumbItems = customItems;
      break;
    case "hybrid":
      breadcrumbItems = [...generateAutoBreadcrumbs(), ...customItems];
      break;
  }

  return (
    <div className={cn(className, "w-fit md:w-full")}>
      <Breadcrumbs separator="/">
        {breadcrumbItems.map((breadcrumb, index) => (
          <BreadcrumbItem key={breadcrumb.path || index}>
            {breadcrumb.isLast && showTitle && title ? (
              renderTitleWithIcon(title)
            ) : breadcrumb.isClickable && breadcrumb.path ? (
              <Link
                href={buildNavigationUrl(breadcrumb.path)}
                className="flex cursor-pointer items-center gap-2"
              >
                {breadcrumb.icon && typeof breadcrumb.icon === "string" ? (
                  <Icon
                    className="text-text-neutral-primary"
                    height={24}
                    icon={breadcrumb.icon}
                    width={24}
                  />
                ) : breadcrumb.icon ? (
                  <div className="flex h-6 w-6 items-center justify-center *:h-full *:w-full">
                    {breadcrumb.icon}
                  </div>
                ) : null}
                <span className="text-text-neutral-primary hover:text-primary max-w-[150px] truncate text-sm font-bold transition-colors sm:max-w-none">
                  {breadcrumb.name}
                </span>
              </Link>
            ) : breadcrumb.isClickable && breadcrumb.onClick ? (
              <button
                onClick={breadcrumb.onClick}
                className="text-text-neutral-primary hover:text-text-neutral-primary-hover flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors"
              >
                {breadcrumb.icon && typeof breadcrumb.icon === "string" ? (
                  <Icon
                    className="text-text-neutral-primary"
                    height={24}
                    icon={breadcrumb.icon}
                    width={24}
                  />
                ) : breadcrumb.icon ? (
                  <div className="flex h-6 w-6 items-center justify-center *:h-full *:w-full">
                    {breadcrumb.icon}
                  </div>
                ) : null}
                <span className="max-w-[150px] truncate sm:max-w-none">
                  {breadcrumb.name}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {breadcrumb.icon && typeof breadcrumb.icon === "string" ? (
                  <Icon
                    className="text-default-500"
                    height={24}
                    icon={breadcrumb.icon}
                    width={24}
                  />
                ) : breadcrumb.icon ? (
                  <div className="flex h-6 w-6 items-center justify-center *:h-full *:w-full">
                    {breadcrumb.icon}
                  </div>
                ) : null}
                <span className="max-w-[150px] truncate text-sm font-medium text-gray-900 sm:max-w-none dark:text-gray-100">
                  {breadcrumb.name}
                </span>
              </div>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/breadcrumbs/index.ts

```typescript
export * from "./breadcrumb-navigation";
```

--------------------------------------------------------------------------------

````
