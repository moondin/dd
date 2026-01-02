---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 839
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 839 of 867)

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

---[FILE: button.tsx]---
Location: prowler-master/ui/components/ui/button/button.tsx
Signals: React

```typescript
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border-2 border-slate-950 text-neutral-primary dark:border-white dark:text-neutral-primary font-bold px-[14px]",
        ghost:
          "border-2 border-transparent text-neutral-secondary dark:text-neutral-secondary hover:border-slate-950 dark:hover:border-white hover:font-bold px-[14px]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

--------------------------------------------------------------------------------

---[FILE: Chart.tsx]---
Location: prowler-master/ui/components/ui/chart/Chart.tsx
Signals: React

```typescript
"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref,
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-32 items-start gap-1.5 rounded-lg border border-slate-200/50 bg-white px-2.5 py-1.5 text-xs shadow-xl dark:border-slate-800/50 dark:bg-slate-950",
          className,
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400",
                  indicator === "dot" && "items-center",
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            },
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center",
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-slate-500 dark:text-slate-400">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium text-slate-950 tabular-nums dark:text-slate-50">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltip";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref,
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className,
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-slate-500 dark:[&>svg]:text-slate-400",
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  },
);
ChartLegendContent.displayName = "ChartLegend";

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? // eslint-disable-next-line security/detect-object-injection
      config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
```

--------------------------------------------------------------------------------

---[FILE: code-snippet.tsx]---
Location: prowler-master/ui/components/ui/code-snippet/code-snippet.tsx

```typescript
import { Snippet } from "@heroui/snippet";

export const CodeSnippet = ({ value }: { value: string }) => (
  <Snippet
    className="bg-bg-neutral-tertiary text-text-neutral-primary border-border-neutral-tertiary w-full rounded-lg border py-1 text-xs"
    hideSymbol
    classNames={{
      pre: "w-full truncate",
    }}
  >
    {value}
  </Snippet>
);
```

--------------------------------------------------------------------------------

---[FILE: collapsible.tsx]---
Location: prowler-master/ui/components/ui/collapsible/collapsible.tsx

```typescript
"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
```

--------------------------------------------------------------------------------

---[FILE: content-layout.tsx]---
Location: prowler-master/ui/components/ui/content-layout/content-layout.tsx
Signals: React

```typescript
import { ReactNode } from "react";

import { Navbar } from "../nav-bar/navbar";

interface ContentLayoutProps {
  title: string;
  icon?: string | ReactNode;
  children: React.ReactNode;
}

export function ContentLayout({ title, icon, children }: ContentLayoutProps) {
  return (
    <>
      <Navbar title={title} icon={icon} />
      <div className="px-6 py-4 sm:px-8">{children}</div>
    </>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: skeleton-content-layout.tsx]---
Location: prowler-master/ui/components/ui/content-layout/skeleton-content-layout.tsx

```typescript
import { Skeleton } from "@heroui/skeleton";

export const SkeletonContentLayout = () => {
  return (
    <div className="flex items-center gap-4">
      {/* Theme Switch Skeleton */}
      <Skeleton className="dark:bg-prowler-blue-800 h-8 w-8 rounded-full">
        <div className="bg-default-200 h-8 w-8"></div>
      </Skeleton>

      {/* User Avatar Skeleton */}
      <Skeleton className="dark:bg-prowler-blue-800 h-10 w-10 rounded-full">
        <div className="bg-default-200 h-10 w-10"></div>
      </Skeleton>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-alert-modal.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-alert-modal.tsx
Signals: React

```typescript
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import React, { ReactNode } from "react";

interface CustomAlertModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  size = "xl",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      classNames={{
        base: "border border-border-neutral-secondary bg-bg-neutral-secondary",
        closeButton: "rounded-md",
      }}
      backdrop="blur"
      placement="center"
    >
      <ModalContent className="py-4">
        {(_onClose) => (
          <>
            <ModalHeader className="flex flex-col py-0">{title}</ModalHeader>
            <ModalBody>
              {description && (
                <p className="text-small text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
              {children}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-banner.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-banner.tsx
Signals: Next.js

```typescript
"use client";

import { InfoIcon } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent } from "@/components/shadcn";

interface CustomBannerProps {
  title: string;
  message: string;
  buttonLabel?: string;
  buttonLink?: string;
}

export const CustomBanner = ({
  title,
  message,
  buttonLabel = "Go Home",
  buttonLink = "/",
}: CustomBannerProps) => {
  return (
    <Card variant="inner">
      <CardContent className="flex items-center justify-start">
        <div className="flex w-full flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-start gap-3">
              <InfoIcon className="text-bg-data-info h-6 w-6" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {title}
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
          <div className="w-full md:w-auto md:shrink-0">
            <Button
              asChild
              className="w-full justify-center md:w-fit"
              size="default"
            >
              <Link href={buttonLink}>{buttonLabel}</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-dropdown-selection.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-dropdown-selection.tsx
Signals: React

```typescript
"use client";

import React, { useCallback } from "react";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/shadcn/select/multiselect";

interface CustomDropdownSelectionProps {
  label: string;
  name: string;
  values: { id: string; name: string }[];
  onChange: (name: string, selectedValues: string[]) => void;
  selectedKeys?: string[];
}

export const CustomDropdownSelection: React.FC<
  CustomDropdownSelectionProps
> = ({ label, name, values, onChange, selectedKeys = [] }) => {
  const handleValuesChange = useCallback(
    (newValues: string[]) => {
      onChange(name, newValues);
    },
    [name, onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">{label}</p>
      <MultiSelect values={selectedKeys} onValuesChange={handleValuesChange}>
        <MultiSelectTrigger>
          <MultiSelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </MultiSelectTrigger>
        <MultiSelectContent
          search={{
            placeholder: `Search ${label.toLowerCase()}...`,
            emptyMessage: "No results found",
          }}
        >
          {values.map((item) => (
            <MultiSelectItem key={item.id} value={item.id}>
              {item.name}
            </MultiSelectItem>
          ))}
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-input.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-input.tsx
Signals: React

```typescript
"use client";

import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormField } from "@/components/ui/form";

interface CustomInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  labelPlacement?: "inside" | "outside";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  size?: "sm" | "md" | "lg";
  type?: string;
  placeholder?: string;
  password?: boolean;
  confirmPassword?: boolean;
  defaultValue?: string;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
}

export const CustomInput = <T extends FieldValues>({
  control,
  name,
  type = "text",
  label = name,
  labelPlacement = "inside",
  placeholder,
  variant = "bordered",
  size = "md",
  confirmPassword = false,
  password = false,
  defaultValue,
  isReadOnly = false,
  isRequired = true,
  isDisabled = false,
}: CustomInputProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const inputLabel = confirmPassword
    ? "Confirm Password"
    : password
      ? "Password"
      : label;

  const inputPlaceholder = confirmPassword
    ? "Confirm Password"
    : password
      ? "Password"
      : placeholder;

  const inputType =
    password || confirmPassword
      ? isPasswordVisible || isConfirmPasswordVisible
        ? "text"
        : "password"
      : type;
  const inputIsRequired = password || confirmPassword ? true : isRequired;

  const toggleVisibility = () => {
    if (password) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (confirmPassword) {
      setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }
  };

  const endContent = (password || confirmPassword) && (
    <button type="button" onClick={toggleVisibility}>
      <Icon
        className="text-default-400 pointer-events-none text-2xl"
        icon={
          (password && isPasswordVisible) ||
          (confirmPassword && isConfirmPasswordVisible)
            ? "solar:eye-closed-linear"
            : "solar:eye-bold"
        }
      />
    </button>
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <FormControl>
            <Input
              id={name}
              classNames={{
                label:
                  "tracking-tight font-light !text-text-neutral-secondary text-xs z-0!",
                input: "text-text-neutral-secondary text-small",
              }}
              isRequired={inputIsRequired}
              label={inputLabel}
              labelPlacement={labelPlacement}
              placeholder={inputPlaceholder}
              type={inputType}
              variant={variant}
              size={size}
              defaultValue={defaultValue}
              endContent={endContent}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-link.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-link.tsx
Signals: React, Next.js

```typescript
import Link from "next/link";
import React from "react";

import { cn } from "@/lib";

interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  target?: "_self" | "_blank" | string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
  scroll?: boolean;
  size?: string;
}

export const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    {
      href,
      target = "_blank",
      ariaLabel,
      className,
      children,
      scroll = true,
      size = "xs",
      ...props
    },
    ref,
  ) => {
    return (
      <Link
        ref={ref}
        href={href}
        scroll={scroll}
        aria-label={ariaLabel}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cn(`text-${size} text-button-tertiary p-0`, className)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

CustomLink.displayName = "CustomLink";
```

--------------------------------------------------------------------------------

---[FILE: custom-modal-buttons.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-modal-buttons.tsx
Signals: React

```typescript
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

import { Button } from "@/components/shadcn";

interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
  submitText?: string;
  submitColor?: "action" | "danger";
  submitIcon?: ReactNode;
}

export const ModalButtons = ({
  onCancel,
  onSubmit,
  isLoading,
  isDisabled = false,
  submitText = "Save",
  submitColor = "action",
  submitIcon,
}: ModalButtonsProps) => {
  const submitVariant = submitColor === "danger" ? "destructive" : "default";

  return (
    <div className="flex w-full justify-end gap-4">
      <Button
        size="lg"
        variant="ghost"
        type="button"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        size="lg"
        variant={submitVariant}
        onClick={onSubmit}
        disabled={isDisabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          submitIcon && submitIcon
        )}
        {isLoading ? "Loading" : submitText}
      </Button>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-radio.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-radio.tsx
Signals: React

```typescript
import { useRadio } from "@heroui/radio";
import { cn } from "@heroui/theme";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import React from "react";

interface CustomRadioProps {
  description?: string;
  value?: string;
  children?: React.ReactNode;
}

export const CustomRadio: React.FC<CustomRadioProps> = (props) => {
  const {
    Component,
    children,
    // description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio({ ...props, value: props.value || "" });

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group tap-highlight-transparent inline-flex flex-row-reverse items-center justify-between hover:opacity-70 active:opacity-50",
        "border-default max-w-full cursor-pointer gap-4 rounded-lg border-2 p-4",
        "hover:border-button-primary data-[selected=true]:border-button-primary w-full",
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {/* {description && (
            <span className="text-small text-foreground opacity-70">
              {description}
            </span>
          )} */}
      </div>
    </Component>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-section.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-section.tsx
Signals: React

```typescript
import { type ReactNode } from "react";

interface CustomSectionProps {
  title: string | ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export const CustomSection = ({
  title,
  children,
  action,
}: CustomSectionProps) => (
  <div className="dark:bg-prowler-blue-400 flex flex-col gap-4 rounded-lg p-4 shadow">
    <div className="flex items-center justify-between">
      <h3 className="text-md dark:text-prowler-theme-pale/90 font-medium text-gray-800">
        {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
);
```

--------------------------------------------------------------------------------

---[FILE: custom-server-input.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-server-input.tsx
Signals: React

```typescript
"use client";

import { Input } from "@heroui/input";
import React from "react";

interface CustomServerInputProps {
  name: string;
  label?: string;
  labelPlacement?: "inside" | "outside";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  type?: string;
  placeholder?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom input component that is used to display a server input without useForm hook.
 */
export const CustomServerInput = ({
  name,
  type = "text",
  label,
  labelPlacement = "outside",
  placeholder,
  variant = "bordered",
  isRequired = false,
  isInvalid = false,
  errorMessage,
  value,
  onChange,
}: CustomServerInputProps) => {
  return (
    <div className="flex flex-col">
      <Input
        id={name}
        name={name}
        type={type}
        label={label}
        labelPlacement={labelPlacement}
        placeholder={placeholder}
        variant={variant}
        isRequired={isRequired}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        value={value}
        onChange={onChange}
        classNames={{
          label: "tracking-tight font-light !text-default-500 text-xs z-0!",
          input: "text-default-500 text-small",
        }}
      />
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: custom-table-link.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-table-link.tsx
Signals: Next.js

```typescript
"use client";

import Link from "next/link";

import { Button } from "@/components/shadcn";

interface TableLinkProps {
  href: string;
  label: string;
  isDisabled?: boolean;
}

export const TableLink = ({ href, label, isDisabled }: TableLinkProps) => {
  if (isDisabled) {
    return (
      <span className="text-text-neutral-tertiary inline-flex h-9 cursor-not-allowed items-center justify-center px-3 text-xs font-medium opacity-60">
        {label}
      </span>
    );
  }

  return (
    <Button asChild variant="link" size="sm" className="text-xs">
      <Link href={href}>{label}</Link>
    </Button>
  );
};

TableLink.displayName = "TableLink";
```

--------------------------------------------------------------------------------

---[FILE: custom-textarea.tsx]---
Location: prowler-master/ui/components/ui/custom/custom-textarea.tsx
Signals: React

```typescript
"use client";

import { Textarea } from "@heroui/input";
import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormField, FormMessage } from "@/components/ui/form";

interface CustomTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  defaultValue?: string;
  isRequired?: boolean;
  minRows?: number;
  maxRows?: number;
  fullWidth?: boolean;
  disableAutosize?: boolean;
  description?: React.ReactNode;
}

export const CustomTextarea = <T extends FieldValues>({
  control,
  name,
  label = name,
  labelPlacement = "inside",
  placeholder,
  variant = "flat",
  size = "md",
  defaultValue,
  isRequired = false,
  minRows = 3,
  maxRows = 8,
  fullWidth = true,
  disableAutosize = false,
  description,
}: CustomTextareaProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <FormControl>
            <Textarea
              id={name}
              label={label}
              labelPlacement={labelPlacement}
              placeholder={placeholder}
              variant={variant}
              size={size}
              isRequired={isRequired}
              defaultValue={defaultValue}
              minRows={minRows}
              maxRows={maxRows}
              fullWidth={fullWidth}
              disableAutosize={disableAutosize}
              description={description}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-text-error max-w-full text-xs" />
        </>
      )}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/ui/custom/index.ts

```typescript
export * from "./custom-alert-modal";
export * from "./custom-banner";
export * from "./custom-dropdown-selection";
export * from "./custom-input";
export * from "./custom-link";
export * from "./custom-modal-buttons";
export * from "./custom-radio";
export * from "./custom-section";
export * from "./custom-server-input";
export * from "./custom-table-link";
export * from "./custom-textarea";
```

--------------------------------------------------------------------------------

---[FILE: dialog.tsx]---
Location: prowler-master/ui/components/ui/dialog/dialog.tsx
Signals: React

```typescript
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "border-border-neutral-secondary bg-bg-neutral-secondary data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground ring-offset-background absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg leading-none font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

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

---[FILE: download-icon-button.tsx]---
Location: prowler-master/ui/components/ui/download-icon-button/download-icon-button.tsx

```typescript
"use client";

import { Tooltip } from "@heroui/tooltip";
import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/shadcn/button/button";

interface DownloadIconButtonProps {
  paramId: string;
  onDownload: (paramId: string) => void;
  ariaLabel?: string;
  isDisabled?: boolean;
  textTooltip?: string;
  isDownloading?: boolean;
}

export const DownloadIconButton = ({
  paramId,
  onDownload,
  ariaLabel = "Download report",
  isDisabled,
  textTooltip = "Download report",
  isDownloading = false,
}: DownloadIconButtonProps) => {
  return (
    <div className="flex items-center justify-end">
      <Tooltip content={textTooltip} className="text-xs">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isDisabled || isDownloading}
          onClick={() => onDownload(paramId)}
          aria-label={ariaLabel}
          className="p-0 disabled:opacity-30"
        >
          <DownloadIcon
            className={isDownloading ? "animate-download-icon" : ""}
            size={16}
          />
        </Button>
      </Tooltip>
    </div>
  );
};
```

--------------------------------------------------------------------------------

````
