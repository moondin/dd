---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 837
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 837 of 867)

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

---[FILE: resource-stats-card.tsx]---
Location: prowler-master/ui/components/shadcn/card/resource-stats-card/resource-stats-card.tsx

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

import { Card, CardVariant } from "@/components/shadcn/card/card";
import { cn } from "@/lib/utils";

import type { StatItem } from "./resource-stats-card-content";
import { ResourceStatsCardContent } from "./resource-stats-card-content";
import { ResourceStatsCardHeader } from "./resource-stats-card-header";

export type { StatItem };
const cardVariants = cva("", {
  variants: {
    variant: {
      [CardVariant.default]: "",
      // Fail variant - rgba(67,34,50) from Figma
      [CardVariant.fail]:
        "border-[rgba(67,34,50,0.5)] bg-[rgba(67,34,50,0.2)] dark:border-[rgba(67,34,50,0.7)] dark:bg-[rgba(67,34,50,0.3)]",
      // Pass variant - rgba(32,66,55) from Figma
      [CardVariant.pass]:
        "border-[rgba(32,66,55,0.5)] bg-[rgba(32,66,55,0.2)] dark:border-[rgba(32,66,55,0.7)] dark:bg-[rgba(32,66,55,0.3)]",
      // Warning variant - rgba(61,53,32) from Figma
      [CardVariant.warning]:
        "border-[rgba(61,53,32,0.5)] bg-[rgba(61,53,32,0.2)] dark:border-[rgba(61,53,32,0.7)] dark:bg-[rgba(61,53,32,0.3)]",
      // Info variant - rgba(30,58,95) from Figma
      [CardVariant.info]:
        "border-[rgba(30,58,95,0.5)] bg-[rgba(30,58,95,0.2)] dark:border-[rgba(30,58,95,0.7)] dark:bg-[rgba(30,58,95,0.3)]",
    },
    size: {
      sm: "px-2 py-1.5 gap-1",
      md: "px-3 py-2 gap-2",
      lg: "px-4 py-3 gap-3",
    },
  },
  defaultVariants: {
    variant: CardVariant.default,
    size: "md",
  },
});

export interface ResourceStatsCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof cardVariants> {
  // Optional header (icon + title + resource count)
  header?: {
    icon: LucideIcon;
    title: string;
    resourceCount?: number | string;
  };

  // Empty state message (when there's no data to display)
  emptyState?: {
    message: string;
  };

  // Main badge (top section) - optional when using empty state
  badge?: {
    icon: LucideIcon;
    count: number | string;
    variant?: CardVariant;
  };

  // Main label - optional when using empty state
  label?: string;

  // Vertical accent line color (optional, auto-determined from variant)
  accentColor?: string;

  // Sub-statistics array (flexible items)
  stats?: StatItem[];

  // Render without container (no border, background, padding) - useful for composing multiple cards in a custom container
  containerless?: boolean;

  // Ref for the root element
  ref?: React.Ref<HTMLDivElement>;
}

export const ResourceStatsCard = ({
  header,
  emptyState,
  badge,
  label,
  accentColor,
  stats = [],
  variant = CardVariant.default,
  size = "md",
  containerless = false,
  className,
  ref,
  ...props
}: ResourceStatsCardProps) => {
  // Resolve size to ensure it's not null (CVA can return null but we need a defined value)
  const resolvedSize = size || "md";

  // If containerless, render without outer wrapper
  if (containerless) {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-[5px]", className)}
        {...props}
      >
        {header && <ResourceStatsCardHeader {...header} size={resolvedSize} />}
        {emptyState ? (
          <div className="flex h-[51px] w-full flex-col items-start justify-center md:items-center">
            <p className="text-text-neutral-secondary text-center text-sm leading-5 font-medium">
              {emptyState.message}
            </p>
          </div>
        ) : (
          badge &&
          label && (
            <ResourceStatsCardContent
              badge={badge}
              label={label}
              stats={stats}
              accentColor={accentColor}
              size={resolvedSize}
            />
          )
        )}
      </div>
    );
  }

  // Otherwise, render with container
  return (
    <Card
      ref={ref}
      variant="inner"
      className={cn(cardVariants({ variant, size }), "flex-col", className)}
      {...props}
    >
      {header && <ResourceStatsCardHeader {...header} size={resolvedSize} />}
      {emptyState ? (
        <div className="flex h-[51px] w-full flex-col items-center justify-center">
          <p className="text-text-neutral-secondary text-center text-sm leading-5 font-medium">
            {emptyState.message}
          </p>
        </div>
      ) : (
        badge &&
        label && (
          <ResourceStatsCardContent
            badge={badge}
            label={label}
            stats={stats}
            accentColor={accentColor}
            size={resolvedSize}
          />
        )
      )}
    </Card>
  );
};

ResourceStatsCard.displayName = "ResourceStatsCard";
```

--------------------------------------------------------------------------------

---[FILE: combobox.tsx]---
Location: prowler-master/ui/components/shadcn/combobox/combobox.tsx
Signals: React

```typescript
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/shadcn/button/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";

const comboboxTriggerVariants = cva("", {
  variants: {
    variant: {
      default:
        "w-full justify-between rounded-xl border border-border-neutral-secondary bg-bg-neutral-secondary hover:bg-bg-neutral-tertiary",
      ghost:
        "border-none bg-transparent shadow-none hover:bg-accent hover:text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const comboboxContentVariants = cva("p-0", {
  variants: {
    variant: {
      default:
        "w-[calc(100vw-2rem)] max-w-md rounded-xl border border-border-neutral-secondary bg-bg-neutral-secondary shadow-md sm:w-full",
      ghost:
        "w-[calc(100vw-2rem)] max-w-md rounded-lg border border-slate-400 bg-white sm:w-full dark:border-[#262626] dark:bg-[#171717]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxGroup {
  heading: string;
  options: ComboboxOption[];
}

export interface ComboboxProps
  extends VariantProps<typeof comboboxTriggerVariants> {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: ComboboxOption[];
  groups?: ComboboxGroup[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  showSelectedFirst?: boolean;
  loading?: boolean;
  loadingMessage?: string;
}

export function Combobox({
  value,
  onValueChange,
  options = [],
  groups = [],
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  triggerClassName,
  contentClassName,
  variant = "default",
  disabled = false,
  showSelectedFirst = true,
  loading = false,
  loadingMessage = "Loading...",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    options.find((option) => option.value === value) ||
    groups
      .flatMap((group) => group.options)
      .find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue === value ? "" : selectedValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            comboboxTriggerVariants({ variant }),
            triggerClassName,
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(comboboxContentVariants({ variant }), contentClassName)}
        align="start"
      >
        <Command>
          {!loading && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandList className="minimal-scrollbar max-h-[400px]">
            {loading && (
              <div className="text-text-neutral-tertiary flex items-center gap-2 px-3 py-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingMessage}</span>
              </div>
            )}
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            {/* Show selected option first if enabled */}
            {showSelectedFirst && selectedOption && (
              <CommandGroup heading="Current Selection">
                <CommandItem
                  value={selectedOption.value}
                  onSelect={handleSelect}
                >
                  <Check className="mr-2 h-4 w-4 opacity-100" />
                  {selectedOption.label}
                </CommandItem>
              </CommandGroup>
            )}

            {/* Render grouped options */}
            {groups.length > 0 &&
              groups.map((group) => {
                const availableOptions = showSelectedFirst
                  ? group.options.filter((option) => option.value !== value)
                  : group.options;

                if (availableOptions.length === 0) return null;

                return (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {availableOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={handleSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}

            {/* Render flat options if no groups */}
            {groups.length === 0 && options.length > 0 && (
              <CommandGroup>
                {options
                  .filter(
                    (option) => !showSelectedFirst || option.value !== value,
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/shadcn/combobox/index.ts

```typescript
export type { ComboboxGroup, ComboboxOption, ComboboxProps } from "./combobox";
export { Combobox } from "./combobox";
```

--------------------------------------------------------------------------------

---[FILE: dropdown.tsx]---
Location: prowler-master/ui/components/shadcn/dropdown/dropdown.tsx
Signals: React

```typescript
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function DropdownMenu({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

function DropdownMenuTrigger({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
    />
  );
}

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

---[FILE: multiselect.tsx]---
Location: prowler-master/ui/components/shadcn/select/multiselect.tsx
Signals: React

```typescript
"use client";

import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { Badge } from "@/components/shadcn/badge/badge";
import { Button } from "@/components/shadcn/button/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";

type MultiSelectContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedValues: Set<string>;
  toggleValue: (value: string) => void;
  items: Map<string, ReactNode>;
  onItemAdded: (value: string, label: ReactNode) => void;
  onValuesChange?: (values: string[]) => void;
};
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
}: {
  children: ReactNode;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState(
    new Set<string>(values ?? defaultValues),
  );
  const selectedValues = values ? new Set(values) : internalValues;
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    };
    setInternalValues(getNewSet);
    onValuesChange?.(Array.from(getNewSet(selectedValues)));
  }

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev;
      return new Map(prev).set(value, label);
    });
  }, []);

  return (
    <MultiSelectContext
      value={{
        open,
        setOpen,
        selectedValues,
        toggleValue,
        items,
        onItemAdded,
        onValuesChange,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
      </Popover>
    </MultiSelectContext>
  );
}

export function MultiSelectTrigger({
  className,
  children,
  size = "default",
  ...props
}: {
  className?: string;
  children?: ReactNode;
  size?: "sm" | "default";
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext();

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        variant={props.variant ?? "outline"}
        role={props.role ?? "combobox"}
        aria-expanded={props["aria-expanded"] ?? open}
        data-slot="multiselect-trigger"
        data-size={size}
        className={cn(
          "border-border-input-primary bg-bg-input-primary text-bg-button-secondary data-[placeholder]:text-bg-button-secondary [&_svg:not([class*='text-'])]:text-bg-button-secondary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-border-input-primary-press focus-visible:ring-border-input-primary-press flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[52px] data-[size=sm]:h-10 *:data-[slot=multiselect-value]:line-clamp-1 *:data-[slot=multiselect-value]:flex *:data-[slot=multiselect-value]:items-center *:data-[slot=multiselect-value]:gap-2 dark:focus-visible:ring-slate-400 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
          className,
        )}
      >
        {children}
        <ChevronDown
          className={cn(
            "text-bg-button-secondary size-6 shrink-0 opacity-70 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff";
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext();
  const [overflowAmount, setOverflowAmount] = useState(0);
  const valueRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open);

  const checkOverflow = useCallback(() => {
    if (valueRef.current === null) return;

    const containerElement = valueRef.current;
    const overflowElement = overflowRef.current;
    const items = containerElement.querySelectorAll<HTMLElement>(
      "[data-selected-item]",
    );

    if (overflowElement !== null) overflowElement.style.display = "none";
    items.forEach((child) => child.style.removeProperty("display"));
    let amount = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const child = items[i]!;
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = items.length - i;
      child.style.display = "none";
      overflowElement?.style.removeProperty("display");
    }
    setOverflowAmount(amount);
  }, []);

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node;

      const mutationObserver = new MutationObserver(checkOverflow);
      const observer = new ResizeObserver(debounce(checkOverflow, 100));

      mutationObserver.observe(node, {
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      observer.observe(node);

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
        valueRef.current = null;
      };
    },
    [checkOverflow],
  );

  return (
    <div
      {...props}
      ref={handleResize}
      data-slot="multiselect-value"
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        className,
      )}
    >
      {placeholder && (
        <span className="text-bg-button-secondary shrink-0 font-normal">
          {placeholder}
        </span>
      )}
      {Array.from(selectedValues)
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant="outline"
            data-selected-item
            className="text-bg-button-secondary group flex items-center gap-1.5 border-slate-300 bg-slate-100 px-2 py-1 text-xs font-medium dark:border-slate-600 dark:bg-slate-800"
            key={value}
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation();
                    toggleValue(value);
                  }
                : undefined
            }
          >
            {items.get(value)}
            {clickToRemove && (
              <XIcon className="text-bg-button-secondary group-hover:text-destructive size-3 transition-colors" />
            )}
          </Badge>
        ))}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
        }}
        variant="outline"
        ref={overflowRef}
        className="text-bg-button-secondary border-slate-300 bg-slate-100 px-2 py-1 text-xs font-medium dark:border-slate-600 dark:bg-slate-800"
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

export function MultiSelectContent({
  search = true,
  children,
  width = "default",
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string };
  children: ReactNode;
  width?: "default" | "wide";
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search;

  const widthClasses =
    width === "wide" ? "w-auto min-w-[400px] max-w-[600px]" : "w-auto";

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent
        align="start"
        data-slot="multiselect-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-border-input-primary bg-bg-input-primary relative z-50 rounded-lg border p-0",
          widthClasses,
        )}
      >
        <Command {...props} className="rounded-lg">
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              }
              className="text-bg-button-secondary placeholder:text-bg-button-secondary"
            />
          ) : (
            <button className="sr-only" />
          )}
          <CommandList className="minimal-scrollbar max-h-[300px] overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col gap-1 p-3">
              {canSearch && (
                <CommandEmpty className="text-bg-button-secondary py-6 text-center text-sm">
                  {typeof search === "object" ? search.emptyMessage : undefined}
                </CommandEmpty>
              )}
              {children}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  className,
  ...props
}: {
  badgeLabel?: ReactNode;
  value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children);
  }, [value, children, onItemAdded, badgeLabel]);

  return (
    <CommandItem
      {...props}
      value={value}
      data-slot="multiselect-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-bg-button-secondary text-bg-button-secondary flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm outline-hidden select-none hover:bg-slate-200 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 dark:hover:bg-slate-700/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        isSelected && "bg-slate-100 dark:bg-slate-800/50",
        className,
      )}
      onSelect={() => {
        toggleValue(value);
        onSelect?.(value);
      }}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
      <CheckIcon
        className={cn(
          "text-bg-button-secondary size-5 shrink-0",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}

export function MultiSelectGroup(
  props: ComponentPropsWithoutRef<typeof CommandGroup>,
) {
  return <CommandGroup data-slot="multiselect-group" {...props} />;
}

export function MultiSelectSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CommandSeparator>) {
  return (
    <CommandSeparator
      data-slot="multiselect-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

export function MultiSelectSelectAll({
  className,
  children = "Select All",
  ...props
}: Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  children?: ReactNode;
}) {
  const { selectedValues, onValuesChange } = useMultiSelectContext();

  if (!onValuesChange) {
    return null;
  }

  const hasSelections = selectedValues.size > 0;

  const handleClearAll = () => {
    // Clear all selections
    onValuesChange?.([]);
  };

  return (
    <button
      type="button"
      data-slot="multiselect-select-all"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-bg-button-secondary text-bg-button-secondary flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm outline-hidden select-none hover:bg-slate-200 dark:hover:bg-slate-700/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        hasSelections && "text-destructive hover:text-destructive",
        "font-semibold",
        className,
      )}
      onClick={handleClearAll}
      {...props}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
    </button>
  );
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (context === null) {
    throw new Error(
      "useMultiSelectContext must be used within a MultiSelectContext",
    );
  }
  return context;
}

function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```

--------------------------------------------------------------------------------

````
