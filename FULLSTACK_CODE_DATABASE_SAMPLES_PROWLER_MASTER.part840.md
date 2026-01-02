---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 840
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 840 of 867)

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

---[FILE: Dropdown.tsx]---
Location: prowler-master/ui/components/ui/dropdown/Dropdown.tsx
Signals: React

```typescript
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "focus:bg-accent data-[state=open]:bg-accent flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("bg-muted -mx-1 my-1 h-px", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
```

--------------------------------------------------------------------------------

---[FILE: dropdown-menu.tsx]---
Location: prowler-master/ui/components/ui/dropdown-menu/dropdown-menu.tsx
Signals: React

```typescript
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "hover:text-accent-foreground focus:bg-accent data-[state=open]:bg-accent text-default-600 hover:bg-default-100 flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:font-bold",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "text-popover-foreground border-border-neutral-secondary bg-bg-neutral-secondary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "text-popover-foreground border-border-neutral-secondary bg-bg-neutral-secondary z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground text-default-600 hover:bg-default-100 relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm subpixel-antialiased transition-colors outline-none select-none hover:[font-variation-settings:'wght'_600] data-disabled:pointer-events-none data-disabled:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground text-default-600 hover:bg-default-100 relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none hover:font-bold data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="h-4 w-4 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "bg-default-200 dark:bg-default-700 -mx-1 my-1 h-px",
      className,
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
```

--------------------------------------------------------------------------------

---[FILE: date-with-time.tsx]---
Location: prowler-master/ui/components/ui/entities/date-with-time.tsx
Signals: React

```typescript
import { format, parseISO } from "date-fns";
import React from "react";

interface DateWithTimeProps {
  dateTime: string | null; // e.g., "2024-07-17T09:55:14.191475Z"
  showTime?: boolean;
  inline?: boolean;
}

export const DateWithTime: React.FC<DateWithTimeProps> = ({
  dateTime,
  showTime = true,
  inline = false,
}) => {
  if (!dateTime) return <span>--</span>;

  try {
    const date = parseISO(dateTime);

    // Validate if the date is valid
    if (isNaN(date.getTime())) {
      return <span>-</span>;
    }

    const formattedDate = format(date, "MMM dd, yyyy");
    const formattedTime = format(date, "p");

    return (
      <div className="mw-fit py-[2px]">
        <div
          className={`flex ${inline ? "flex-row items-center gap-2" : "flex-col"}`}
        >
          <span className="text-xs font-semibold whitespace-nowrap">
            {formattedDate}
          </span>
          {showTime && (
            <span className="text-xs whitespace-nowrap text-gray-500">
              {formattedTime}
            </span>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return <span>-</span>;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: entity-info.tsx]---
Location: prowler-master/ui/components/ui/entities/entity-info.tsx
Signals: React

```typescript
"use client";

import { Tooltip } from "@heroui/tooltip";
import { useEffect, useState } from "react";

import { CopyIcon, DoneIcon } from "@/components/icons";
import type { ProviderType } from "@/types";

import { getProviderLogo } from "./get-provider-logo";

interface EntityInfoProps {
  cloudProvider: ProviderType;
  entityAlias?: string;
  entityId?: string;
  snippetWidth?: string;
  showConnectionStatus?: boolean;
  maxWidth?: string;
  showCopyAction?: boolean;
}

export const EntityInfo = ({
  cloudProvider,
  entityAlias,
  entityId,
  showConnectionStatus = false,
  maxWidth = "w-[120px]",
  showCopyAction = true,
}: EntityInfoProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;

    const timer = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopyEntityId = async () => {
    if (!entityId) return;

    try {
      await navigator.clipboard.writeText(entityId);
      setCopied(true);
    } catch (_error) {
      setCopied(false);
    }
  };

  const canCopy = Boolean(entityId && showCopyAction);

  return (
    <div className="flex items-center gap-2">
      <div className="relative shrink-0">
        {getProviderLogo(cloudProvider)}
        {showConnectionStatus && (
          <Tooltip
            size="sm"
            content={showConnectionStatus ? "Connected" : "Not Connected"}
          >
            <span
              className={`absolute top-[-0.1rem] right-[-0.2rem] h-2 w-2 cursor-pointer rounded-full ${
                showConnectionStatus ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </Tooltip>
        )}
      </div>
      <div className={`flex ${maxWidth} flex-col gap-1`}>
        {entityAlias ? (
          <Tooltip content={entityAlias} placement="top-start" size="sm">
            <p className="text-text-neutral-primary truncate text-left text-xs font-medium">
              {entityAlias}
            </p>
          </Tooltip>
        ) : (
          <Tooltip content="No alias" placement="top-start" size="sm">
            <p className="text-text-neutral-secondary truncate text-left text-xs">
              -
            </p>
          </Tooltip>
        )}
        {entityId && (
          <div className="flex min-w-0 items-center gap-1">
            <Tooltip content={entityId} placement="top-start" size="sm">
              <p className="text-text-neutral-secondary min-w-0 truncate text-left text-xs">
                {entityId}
              </p>
            </Tooltip>
            {canCopy && (
              <Tooltip
                content={copied ? "Copied" : "Copy to clipboard"}
                placement="top"
                size="sm"
              >
                <button
                  type="button"
                  onClick={handleCopyEntityId}
                  aria-label="Copiar ID de la entidad"
                  className="hover:bg-bg-neutral-tertiary focus-visible:ring-bg-data-info text-text-neutral-secondary hover:text-text-neutral-primary rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {copied ? <DoneIcon size={14} /> : <CopyIcon size={14} />}
                </button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: get-provider-logo.tsx]---
Location: prowler-master/ui/components/ui/entities/get-provider-logo.tsx
Signals: React

```typescript
import React from "react";

import {
  AWSProviderBadge,
  AzureProviderBadge,
  GCPProviderBadge,
  GitHubProviderBadge,
  IacProviderBadge,
  KS8ProviderBadge,
  M365ProviderBadge,
  MongoDBAtlasProviderBadge,
  OracleCloudProviderBadge,
} from "@/components/icons/providers-badge";
import { ProviderType } from "@/types";

export const getProviderLogo = (provider: ProviderType) => {
  switch (provider) {
    case "aws":
      return <AWSProviderBadge width={35} height={35} />;
    case "azure":
      return <AzureProviderBadge width={35} height={35} />;
    case "gcp":
      return <GCPProviderBadge width={35} height={35} />;
    case "kubernetes":
      return <KS8ProviderBadge width={35} height={35} />;
    case "m365":
      return <M365ProviderBadge width={35} height={35} />;
    case "github":
      return <GitHubProviderBadge width={35} height={35} />;
    case "iac":
      return <IacProviderBadge width={35} height={35} />;
    case "oraclecloud":
      return <OracleCloudProviderBadge width={35} height={35} />;
    case "mongodbatlas":
      return <MongoDBAtlasProviderBadge width={35} height={35} />;
    default:
      return null;
  }
};

export const getProviderName = (provider: ProviderType): string => {
  switch (provider) {
    case "aws":
      return "Amazon Web Services";
    case "azure":
      return "Microsoft Azure";
    case "gcp":
      return "Google Cloud Platform";
    case "kubernetes":
      return "Kubernetes";
    case "m365":
      return "Microsoft 365";
    case "github":
      return "GitHub";
    case "iac":
      return "Infrastructure as Code";
    case "oraclecloud":
      return "Oracle Cloud Infrastructure";
    case "mongodbatlas":
      return "MongoDB Atlas";
    default:
      return "Unknown Provider";
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/entities/index.ts

```typescript
export * from "./date-with-time";
export * from "./entity-info";
export * from "./get-provider-logo";
export * from "./info-field";
export * from "./scan-status";
export * from "./snippet-chip";
```

--------------------------------------------------------------------------------

---[FILE: info-field.tsx]---
Location: prowler-master/ui/components/ui/entities/info-field.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";
import clsx from "clsx";
import { InfoIcon } from "lucide-react";

interface InfoFieldProps {
  label: string;
  children: React.ReactNode;
  variant?: "default" | "simple" | "transparent";
  className?: string;
  tooltipContent?: string;
  inline?: boolean;
}

<Tooltip
  className="text-xs"
  content="Download a ZIP file that includes the JSON (OCSF), CSV, and HTML scan reports, along with the compliance report."
>
  <div className="flex items-center gap-2">
    <InfoIcon className="text-primary mb-1" size={12} />
  </div>
</Tooltip>;

export const InfoField = ({
  label,
  children,
  variant = "default",
  tooltipContent,
  className,
  inline = false,
}: InfoFieldProps) => {
  if (inline) {
    return (
      <div className={clsx("flex items-center gap-2", className)}>
        <span className="text-text-neutral-tertiary text-xs font-bold">
          <span className="flex items-center gap-1">
            {label}:
            {tooltipContent && (
              <Tooltip className="text-xs" content={tooltipContent}>
                <div className="flex cursor-pointer items-center gap-2">
                  <InfoIcon className="text-bg-data-info mb-1" size={12} />
                </div>
              </Tooltip>
            )}
          </span>
        </span>
        <div className="text-text-neutral-primary text-sm">{children}</div>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <span className="text-text-neutral-tertiary text-xs font-bold">
        <span className="flex items-center gap-1">
          {label}
          {tooltipContent && (
            <Tooltip className="text-xs" content={tooltipContent}>
              <div className="flex cursor-pointer items-center gap-2">
                <InfoIcon className="text-bg-data-info mb-1" size={12} />
              </div>
            </Tooltip>
          )}
        </span>
      </span>

      {variant === "simple" ? (
        <div className="text-text-neutral-primary text-sm break-all">
          {children}
        </div>
      ) : variant === "transparent" ? (
        <div className="text-text-neutral-primary text-sm">{children}</div>
      ) : (
        <div className="border-border-neutral-tertiary bg-bg-neutral-tertiary text-text-neutral-primary rounded-lg border px-3 py-2 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: scan-status.tsx]---
Location: prowler-master/ui/components/ui/entities/scan-status.tsx
Signals: React

```typescript
import { formatDuration, intervalToDuration, parseISO } from "date-fns";
import React from "react";

interface ScanStatusProps {
  status: string;
  createdAt: string; // ISO string
}

export const ScanStatus: React.FC<ScanStatusProps> = ({
  status,
  createdAt,
}) => {
  const duration = intervalToDuration({
    start: parseISO(createdAt),
    end: new Date(),
  });

  const formattedDuration = formatDuration(duration, { delimiter: ", " });

  return (
    <div className="max-w-fit">
      <div className="flex flex-col">
        <span className="text-md font-semibold">{status}</span>
        <span className="text-sm text-gray-500">{formattedDuration}</span>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: snippet-chip.tsx]---
Location: prowler-master/ui/components/ui/entities/snippet-chip.tsx
Signals: React

```typescript
import { Snippet } from "@heroui/snippet";
import { cn } from "@heroui/theme";
import { Tooltip } from "@heroui/tooltip";
import React from "react";

import { CopyIcon, DoneIcon } from "@/components/icons";

interface SnippetChipProps {
  value: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  hideCopyButton?: boolean;
  formatter?: (value: string) => string;
  className?: string;
}
export const SnippetChip = ({
  value,
  hideCopyButton = false,
  ariaLabel = `Copy ${value} to clipboard`,
  icon,
  formatter,
  className,
  ...props
}: SnippetChipProps) => {
  return (
    <Snippet
      className={cn("h-6", className)}
      classNames={{
        content: "min-w-0 overflow-hidden",
        pre: "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
        base: "border-border-neutral-tertiary bg-bg-neutral-tertiary rounded-lg border py-1",
      }}
      size="sm"
      hideSymbol
      copyIcon={<CopyIcon size={16} />}
      checkIcon={<DoneIcon size={16} />}
      hideCopyButton={hideCopyButton}
      codeString={value}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2" aria-label={ariaLabel}>
        {icon}
        <Tooltip content={value} placement="top" size="sm">
          <span className="min-w-0 flex-1 truncate text-xs">
            {formatter ? formatter(value) : value}
          </span>
        </Tooltip>
      </div>
    </Snippet>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: feedback-banner.tsx]---
Location: prowler-master/ui/components/ui/feedback-banner/feedback-banner.tsx

```typescript
import { AlertIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

type FeedbackType = "error" | "warning" | "info" | "success";

interface FeedbackBannerProps {
  type?: FeedbackType;
  title: string;
  message: string;
  className?: string;
}

const typeStyles: Record<
  FeedbackType,
  { border: string; bg: string; text: string }
> = {
  error: {
    border: "border-danger",
    bg: "bg-system-error-light/30 dark:bg-system-error-light/80",
    text: "text-text-error",
  },
  warning: {
    border: "border-warning",
    bg: "bg-yellow-100 dark:bg-yellow-200",
    text: "text-yellow-800",
  },
  info: {
    border: "border-blue-400",
    bg: "bg-blue-50 dark:bg-blue-100",
    text: "text-blue-800",
  },
  success: {
    border: "border-green-500",
    bg: "bg-green-50 dark:bg-green-100",
    text: "text-green-800",
  },
};

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type = "info",
  title,
  message,
  className,
}) => {
  const styles = typeStyles[type];

  return (
    <div
      className={cn(
        "rounded-xl border-l-4 p-4 shadow-sm",
        styles.border,
        styles.bg,
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn("mt-1", styles.text)}>
          <AlertIcon size={20} />
        </span>
        <p className={cn("text-sm", styles.text)}>
          <strong>{title}</strong> {message}
        </p>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: form-buttons.tsx]---
Location: prowler-master/ui/components/ui/form/form-buttons.tsx
Signals: React

```typescript
"use client";

import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFormStatus } from "react-dom";

import { SaveIcon } from "@/components/icons";
import { Button } from "@/components/shadcn";

interface FormCancelButtonProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  onCancel?: () => void;
  children?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

interface FormSubmitButtonProps {
  children?: React.ReactNode;
  loadingText?: string;
  isDisabled?: boolean;
  rightIcon?: React.ReactNode;
  color?: SubmitColorsType;
}

interface FormButtonsProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  isDisabled?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  submitColor?: SubmitColorsType;
}

export const SubmitColors = {
  action: "action",
  danger: "danger",
} as const;

export type SubmitColorsType = (typeof SubmitColors)[keyof typeof SubmitColors];

const FormCancelButton = ({
  setIsOpen,
  onCancel,
  children = "Cancel",
  leftIcon,
}: FormCancelButtonProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <Button type="button" variant="ghost" size="lg" onClick={handleCancel}>
      {leftIcon}
      {children}
    </Button>
  );
};

const FormSubmitButton = ({
  children = "Save",
  loadingText = "Loading",
  isDisabled = false,
  color = "action",
  rightIcon,
}: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();
  const submitVariant = color === "danger" ? "destructive" : "default";

  return (
    <Button
      type="submit"
      variant={submitVariant}
      size="lg"
      disabled={isDisabled || pending}
    >
      {pending ? <Loader2 className="animate-spin" /> : rightIcon}
      {pending ? loadingText : children}
    </Button>
  );
};

export const FormButtons = ({
  setIsOpen,
  submitColor,
  onCancel,
  submitText = "Save",
  cancelText = "Cancel",
  loadingText = "Loading",
  isDisabled = false,
  rightIcon = <SaveIcon size={24} />,
  leftIcon,
}: FormButtonsProps) => {
  return (
    <div className="flex w-full justify-end gap-4">
      <FormCancelButton
        setIsOpen={setIsOpen}
        onCancel={onCancel}
        leftIcon={leftIcon}
      >
        {cancelText}
      </FormCancelButton>

      <FormSubmitButton
        loadingText={loadingText}
        isDisabled={isDisabled}
        rightIcon={rightIcon}
        color={submitColor}
      >
        {submitText}
      </FormSubmitButton>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Form.tsx]---
Location: prowler-master/ui/components/ui/form/Form.tsx
Signals: React

```typescript
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import { Label } from "./Label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-text-error max-w-full text-xs", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-text-neutral-tertiary max-w-full text-xs", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(
        "text-text-error max-w-full text-xs font-medium",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/form/index.ts

```typescript
export * from "./Form";
export * from "./form-buttons";
export * from "./Label";
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: prowler-master/ui/components/ui/form/Label.tsx
Signals: React

```typescript
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

--------------------------------------------------------------------------------

---[FILE: navigation-header.tsx]---
Location: prowler-master/ui/components/ui/headers/navigation-header.tsx
Signals: Next.js

```typescript
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { Button } from "@/components/shadcn";

interface NavigationHeaderProps {
  title: string;
  icon: string;
  href?: string;
}

export const NavigationHeader = ({
  title,
  icon,
  href,
}: NavigationHeaderProps) => {
  return (
    <>
      <header className="flex items-center gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <Button
          className="border-gray-200 bg-transparent p-0"
          aria-label="Navigation button"
          variant="outline"
          size="icon"
          asChild
        >
          <Link href={href || ""}>
            <Icon icon={icon} className="text-gray-600 dark:text-gray-400" />
          </Link>
        </Button>
        <Divider orientation="vertical" className="h-6" />
        <h1 className="text-default-700 text-xl font-light">{title}</h1>
      </header>
    </>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: prowler-master/ui/components/ui/label/Label.tsx
Signals: React

```typescript
"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

--------------------------------------------------------------------------------

````
