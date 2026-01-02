---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 823
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 823 of 867)

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

---[FILE: vertical-steps.tsx]---
Location: prowler-master/ui/components/invitations/workflow/vertical-steps.tsx
Signals: React

```typescript
"use client";

import { cn } from "@heroui/theme";
import { useControlledState } from "@react-stately/utils";
import { domAnimation, LazyMotion, m } from "framer-motion";
import type { ComponentProps } from "react";
import React from "react";

export type VerticalStepProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export interface VerticalStepsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * An array of steps.
   *
   * @default []
   */
  steps?: VerticalStepProps[];
  /**
   * The color of the steps.
   *
   * @default "primary"
   */
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default";
  /**
   * The current step index.
   */
  currentStep?: number;
  /**
   * The default step index.
   *
   * @default 0
   */
  defaultStep?: number;
  /**
   * Whether to hide the progress bars.
   *
   * @default false
   */
  hideProgressBars?: boolean;
  /**
   * The custom class for the steps wrapper.
   */
  className?: string;
  /**
   * The custom class for the step.
   */
  stepClassName?: string;
  /**
   * Callback function when the step index changes.
   */
  onStepChange?: (stepIndex: number) => void;
}

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
      />
    </svg>
  );
}

export const VerticalSteps = React.forwardRef<
  HTMLButtonElement,
  VerticalStepsProps
>(
  (
    {
      color = "primary",
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange,
    );

    const colors = React.useMemo(() => {
      let userColor;
      let fgColor;

      const colorsVars = [
        "[--active-fg-color:var(--step-fg-color)]",
        "[--active-border-color:var(--step-color)]",
        "[--active-color:var(--step-color)]",
        "[--complete-background-color:var(--step-color)]",
        "[--complete-border-color:var(--step-color)]",
        "[--inactive-border-color:hsl(var(--heroui-default-300))]",
        "[--inactive-color:hsl(var(--heroui-default-300))]",
      ];

      switch (color) {
        case "primary":
          userColor = "[--step-color:var(--bg-button-primary)]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
        case "secondary":
          userColor = "[--step-color:hsl(var(--heroui-secondary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-secondary-foreground))]";
          break;
        case "success":
          userColor = "[--step-color:hsl(var(--heroui-success))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-success-foreground))]";
          break;
        case "warning":
          userColor = "[--step-color:hsl(var(--heroui-warning))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-warning-foreground))]";
          break;
        case "danger":
          userColor = "[--step-color:hsl(var(--heroui-error))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-error-foreground))]";
          break;
        case "default":
          userColor = "[--step-color:hsl(var(--heroui-default))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-default-foreground))]";
          break;
        default:
          userColor = "[--step-color:hsl(var(--heroui-primary))]";
          fgColor = "[--step-fg-color:hsl(var(--heroui-primary-foreground))]";
          break;
      }

      if (!className?.includes("--step-fg-color")) colorsVars.unshift(fgColor);
      if (!className?.includes("--step-color")) colorsVars.unshift(userColor);
      if (!className?.includes("--inactive-bar-color"))
        colorsVars.push(
          "[--inactive-bar-color:hsl(var(--heroui-default-300))]",
        );

      return colorsVars;
    }, [color, className]);

    return (
      <nav aria-label="Progress" className="max-w-fit">
        <ol className={cn("flex flex-col gap-y-3", colors, className)}>
          {steps?.map((step, stepIdx) => {
            const status =
              currentStep === stepIdx
                ? "active"
                : currentStep < stepIdx
                  ? "inactive"
                  : "complete";

            return (
              <li key={stepIdx} className="relative">
                <div className="flex w-full max-w-full items-center">
                  <button
                    key={stepIdx}
                    ref={ref}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "group rounded-large flex w-full cursor-pointer items-center justify-center gap-4 px-3 py-2.5",
                      stepClassName,
                    )}
                    onClick={() => setCurrentStep(stepIdx)}
                    {...props}
                  >
                    <div className="flex h-full items-center">
                      <LazyMotion features={domAnimation}>
                        <div className="relative">
                          <m.div
                            animate={status}
                            className={cn(
                              "border-medium text-large text-default-foreground relative flex h-[34px] w-[34px] items-center justify-center rounded-full font-semibold",
                              {
                                "shadow-lg": status === "complete",
                              },
                            )}
                            data-status={status}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                backgroundColor: "transparent",
                                borderColor: "var(--inactive-border-color)",
                                color: "var(--inactive-color)",
                              },
                              active: {
                                backgroundColor: "transparent",
                                borderColor: "var(--active-border-color)",
                                color: "var(--active-color)",
                              },
                              complete: {
                                backgroundColor:
                                  "var(--complete-background-color)",
                                borderColor: "var(--complete-border-color)",
                              },
                            }}
                          >
                            <div className="flex items-center justify-center">
                              {status === "complete" ? (
                                <CheckIcon className="h-6 w-6 text-(--active-fg-color)" />
                              ) : (
                                <span>{stepIdx + 1}</span>
                              )}
                            </div>
                          </m.div>
                        </div>
                      </LazyMotion>
                    </div>
                    <div className="flex-1 text-left">
                      <div>
                        <div
                          className={cn(
                            "text-medium text-default-foreground font-medium transition-[color,opacity] duration-300 group-active:opacity-70",
                            {
                              "text-default-500": status === "inactive",
                            },
                          )}
                        >
                          {step.title}
                        </div>
                        <div
                          className={cn(
                            "text-tiny text-default-600 lg:text-small transition-[color,opacity] duration-300 group-active:opacity-70",
                            {
                              "text-default-500": status === "inactive",
                            },
                          )}
                        >
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                {stepIdx < steps.length - 1 && !hideProgressBars && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-[calc(64px*var(--idx)+1)] left-3 flex h-1/2 -translate-y-1/3 items-center px-4",
                    )}
                    style={{
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      "--idx": stepIdx,
                    }}
                  >
                    <div
                      className={cn(
                        "relative h-full w-0.5 bg-(--inactive-bar-color) transition-colors duration-300",
                        "after:absolute after:block after:h-0 after:w-full after:bg-(--active-border-color) after:transition-[height] after:duration-300 after:content-['']",
                        {
                          "after:h-full": stepIdx < currentStep,
                        },
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

VerticalSteps.displayName = "VerticalSteps";
```

--------------------------------------------------------------------------------

---[FILE: workflow-send-invite.tsx]---
Location: prowler-master/ui/components/invitations/workflow/workflow-send-invite.tsx
Signals: React, Next.js

```typescript
"use client";

import { Progress } from "@heroui/progress";
import { Spacer } from "@heroui/spacer";
import { usePathname } from "next/navigation";
import React from "react";

import { VerticalSteps } from "./vertical-steps";

const steps = [
  {
    title: "Send Invitation",
    description:
      "Enter the email address of the person you want to invite and send the invitation.",
    href: "/invitations/new",
  },
  {
    title: "Review Invitation Details",
    description:
      "Review the invitation details and share the information required for the person to accept the invitation.",
    href: "/invitations/check-details",
  },
];

export const WorkflowSendInvite = () => {
  const pathname = usePathname();

  // Calculate current step based on pathname
  const currentStepIndex = steps.findIndex((step) =>
    pathname.endsWith(step.href),
  );
  const currentStep = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <section className="w-full max-w-none p-3 sm:max-w-sm sm:p-0">
      <h1 className="mb-2 text-lg font-medium sm:text-xl" id="getting-started">
        Send invitation
      </h1>
      <p className="sm:text-small text-default-500 mb-3 text-xs sm:mb-5">
        Follow the steps to send an invitation to the users.
      </p>
      <Progress
        classNames={{
          base: "px-0.5 mb-3 sm:mb-5",
          label: "text-xs sm:text-small",
          value: "text-xs sm:text-small text-default-400",
          indicator: "bg-button-primary",
        }}
        label="Steps"
        maxValue={steps.length}
        minValue={0}
        showValueLabel={true}
        size="sm"
        value={currentStep + 1}
        valueLabel={`${currentStep + 1} of ${steps.length}`}
      />

      {/* Desktop: Full vertical steps */}
      <div className="hidden sm:block">
        <VerticalSteps
          hideProgressBars
          currentStep={currentStep}
          stepClassName="border border-border-neutral-primary aria-[current]:border-button-primary aria-[current]:text-text-neutral-primary cursor-default"
          steps={steps}
        />
      </div>

      {/* Mobile: Compact current step indicator */}
      <div className="sm:hidden">
        <div className="text-text-neutral-secondary border-button-primary border-l-2 py-1 pl-3 text-xs">
          <div className="font-medium">
            Current: {steps[currentStep]?.title}
          </div>
          <div className="text-default-300 mt-1 text-xs">
            {steps[currentStep]?.description}
          </div>
        </div>
      </div>

      <Spacer y={2} />
    </section>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/invitations/workflow/forms/index.ts

```typescript
export * from "./send-invitation-form";
```

--------------------------------------------------------------------------------

---[FILE: send-invitation-form.tsx]---
Location: prowler-master/ui/components/invitations/workflow/forms/send-invitation-form.tsx
Signals: Next.js, Zod

```typescript
"use client";

import { Select, SelectItem } from "@heroui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { sendInvite } from "@/actions/invitations/invitation";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { ApiError } from "@/types";

const sendInvitationFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  roleId: z.string().min(1, "Role is required"),
});

export type FormValues = z.infer<typeof sendInvitationFormSchema>;

export const SendInvitationForm = ({
  roles = [],
  defaultRole = "admin",
  isSelectorDisabled = false,
}: {
  roles: Array<{ id: string; name: string }>;
  defaultRole?: string;
  isSelectorDisabled: boolean;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(sendInvitationFormSchema),
    defaultValues: {
      email: "",
      roleId: isSelectorDisabled ? defaultRole : "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmitClient = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("role", values.roleId);

    try {
      const data = await sendInvite(formData);

      if (data?.errors && data.errors.length > 0) {
        data.errors.forEach((error: ApiError) => {
          const errorMessage = error.detail;
          const pointer = error.source?.pointer;
          switch (pointer) {
            case "/data/attributes/email":
              form.setError("email", {
                type: "server",
                message: errorMessage,
              });
              break;
            case "/data/relationships/roles":
              form.setError("roleId", {
                type: "server",
                message: errorMessage,
              });
              break;
            default:
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: errorMessage,
              });
          }
        });
      } else {
        const invitationId = data?.data?.id || "";
        router.push(`/invitations/check-details/?id=${invitationId}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitClient)}
        className="flex flex-col gap-4"
      >
        {/* Email Field */}
        <CustomInput
          control={form.control}
          name="email"
          type="email"
          label="Email"
          labelPlacement="inside"
          placeholder="Enter the email address"
          variant="flat"
          isRequired
        />

        <Controller
          name="roleId"
          control={form.control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                label="Role"
                placeholder="Select a role"
                classNames={{
                  selectorIcon: "right-2",
                }}
                variant="flat"
                isDisabled={isSelectorDisabled}
                selectedKeys={[field.value]}
                onSelectionChange={(selected) =>
                  field.onChange(selected?.currentKey || "")
                }
              >
                {isSelectorDisabled ? (
                  <SelectItem key={defaultRole}>{defaultRole}</SelectItem>
                ) : (
                  roles.map((role) => (
                    <SelectItem key={role.id}>{role.name}</SelectItem>
                  ))
                )}
              </Select>
              {form.formState.errors.roleId && (
                <p className="text-text-error mt-2 text-sm">
                  {form.formState.errors.roleId.message}
                </p>
              )}
            </>
          )}
        />

        {/* Submit Button */}
        <div className="flex w-full justify-end sm:gap-6">
          <Button
            type="submit"
            className="w-1/2"
            variant="default"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Loading</>
            ) : (
              <>
                <SaveIcon size={20} />
                <span>Send Invitation</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: banner-client.tsx]---
Location: prowler-master/ui/components/lighthouse/banner-client.tsx
Signals: React, Next.js

```typescript
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Card, CardContent } from "@/components/shadcn/card/card";
import { cn } from "@/lib/utils";

import { LighthouseIcon } from "../icons";

const AnimatedGradientCard = ({
  message,
  href,
}: {
  message: string;
  href: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curXRef = useRef(0);
  const curYRef = useRef(0);
  const tgXRef = useRef(0);
  const tgYRef = useRef(0);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const move = () => {
      if (!interactiveRef.current) return;

      curXRef.current += (tgXRef.current - curXRef.current) / 20;
      curYRef.current += (tgYRef.current - curYRef.current) / 20;

      interactiveRef.current.style.transform = `translate(${Math.round(curXRef.current)}px, ${Math.round(curYRef.current)}px)`;

      animationFrameId = requestAnimationFrame(move);
    };

    animationFrameId = requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      tgXRef.current = event.clientX - rect.left;
      tgYRef.current = event.clientY - rect.top;
    }
  };

  return (
    <Link href={href} className="mb-8 block w-full">
      <Card
        variant="base"
        className="group relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <svg className="hidden">
          <defs>
            <filter id="blurMe">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 blur-lg",
            isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]",
          )}
        >
          <div className="animate-first absolute [top:calc(50%-60%)] [left:calc(50%-60%)] h-[120%] w-[120%] [transform-origin:center_center] opacity-100 [mix-blend-mode:hard-light] [background:radial-gradient(circle_at_center,_var(--bg-neutral-tertiary)_0,_transparent_50%)_no-repeat]" />

          <div className="animate-second absolute [top:calc(50%-60%)] [left:calc(50%-60%)] h-[120%] w-[120%] [transform-origin:calc(50%-200px)] opacity-80 [mix-blend-mode:hard-light] [background:radial-gradient(circle_at_center,_var(--bg-button-primary)_0,_transparent_50%)_no-repeat]" />

          <div className="animate-third absolute [top:calc(50%-60%)] [left:calc(50%-60%)] h-[120%] w-[120%] [transform-origin:calc(50%+200px)] opacity-70 [mix-blend-mode:hard-light] [background:radial-gradient(circle_at_center,_var(--bg-button-primary-hover)_0,_transparent_50%)_no-repeat]" />

          <div
            ref={interactiveRef}
            className="absolute -top-1/2 -left-1/2 h-full w-full opacity-60 [mix-blend-mode:hard-light] [background:radial-gradient(circle_at_center,_var(--bg-button-primary-press)_0,_transparent_50%)_no-repeat]"
          />
        </div>

        <CardContent className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center">
              <LighthouseIcon size={24} />
            </div>
            <p className="text-text-neutral-primary text-base font-semibold">
              {message}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export const LighthouseBannerClient = ({
  isConfigured,
}: {
  isConfigured: boolean;
}) => {
  const message = isConfigured
    ? "Use Lighthouse to review your findings and gain insights"
    : "Enable Lighthouse to secure your cloud with AI insights";
  const href = isConfigured ? "/lighthouse" : "/lighthouse/config";

  return <AnimatedGradientCard message={message} href={href} />;
};
```

--------------------------------------------------------------------------------

---[FILE: banner.tsx]---
Location: prowler-master/ui/components/lighthouse/banner.tsx

```typescript
import { isLighthouseConfigured } from "@/actions/lighthouse/lighthouse";

import { LighthouseBannerClient } from "./banner-client";

export const LighthouseBanner = async () => {
  try {
    const isConfigured = await isLighthouseConfigured();

    return <LighthouseBannerClient isConfigured={isConfigured} />;
  } catch (error) {
    return null;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: chain-of-thought-display.tsx]---
Location: prowler-master/ui/components/lighthouse/chain-of-thought-display.tsx

```typescript
/**
 * ChainOfThoughtDisplay component
 * Displays tool execution progress for Lighthouse assistant messages
 */

import { CheckCircle2 } from "lucide-react";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought";
import {
  CHAIN_OF_THOUGHT_ACTIONS,
  type ChainOfThoughtEvent,
  getChainOfThoughtHeaderText,
  getChainOfThoughtStepLabel,
  isMetaTool,
} from "@/components/lighthouse/chat-utils";

interface ChainOfThoughtDisplayProps {
  events: ChainOfThoughtEvent[];
  isStreaming: boolean;
  messageKey: string;
}

export function ChainOfThoughtDisplay({
  events,
  isStreaming,
  messageKey,
}: ChainOfThoughtDisplayProps) {
  if (events.length === 0) {
    return null;
  }

  const headerText = getChainOfThoughtHeaderText(isStreaming, events);

  return (
    <div className="mb-4">
      <ChainOfThought defaultOpen={false}>
        <ChainOfThoughtHeader>{headerText}</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {events.map((event, eventIdx) => {
            const { action, metaTool, tool } = event;

            // Only show tool_complete events (skip planning and start)
            if (action !== CHAIN_OF_THOUGHT_ACTIONS.COMPLETE) {
              return null;
            }

            // Skip actual tool execution events (only show meta-tools)
            if (!isMetaTool(metaTool)) {
              return null;
            }

            const label = getChainOfThoughtStepLabel(metaTool, tool);

            return (
              <ChainOfThoughtStep
                key={`${messageKey}-cot-${eventIdx}`}
                icon={CheckCircle2}
                label={label}
                status="complete"
              />
            );
          })}
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  );
}
```

--------------------------------------------------------------------------------

---[FILE: chat-utils.ts]---
Location: prowler-master/ui/components/lighthouse/chat-utils.ts

```typescript
/**
 * Utilities for Lighthouse chat message processing
 * Client-side utilities for chat.tsx
 */

import {
  CHAIN_OF_THOUGHT_ACTIONS,
  ERROR_PREFIX,
  MESSAGE_ROLES,
  MESSAGE_STATUS,
  META_TOOLS,
} from "@/lib/lighthouse/constants";
import type { ChainOfThoughtData, Message } from "@/lib/lighthouse/types";

// Re-export constants for convenience
export {
  CHAIN_OF_THOUGHT_ACTIONS,
  ERROR_PREFIX,
  MESSAGE_ROLES,
  MESSAGE_STATUS,
  META_TOOLS,
};

// Re-export types
export type { ChainOfThoughtData as ChainOfThoughtEvent, Message };

/**
 * Extracts text content from a message by filtering and joining text parts
 *
 * @param message - The message to extract text from
 * @returns The concatenated text content
 */
export function extractMessageText(message: Message): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.text ? p.text : ""))
    .join("");
}

/**
 * Extracts chain-of-thought events from a message
 *
 * @param message - The message to extract events from
 * @returns Array of chain-of-thought events
 */
export function extractChainOfThoughtEvents(
  message: Message,
): ChainOfThoughtData[] {
  return message.parts
    .filter((part) => part.type === "data-chain-of-thought")
    .map((part) => part.data as ChainOfThoughtData);
}

/**
 * Gets the label for a chain-of-thought step based on meta-tool and tool name
 *
 * @param metaTool - The meta-tool name
 * @param tool - The actual tool name
 * @returns A human-readable label for the step
 */
export function getChainOfThoughtStepLabel(
  metaTool: string,
  tool: string | null,
): string {
  if (metaTool === META_TOOLS.DESCRIBE && tool) {
    return `Retrieving ${tool} tool info`;
  }

  if (metaTool === META_TOOLS.EXECUTE && tool) {
    return `Executing ${tool}`;
  }

  return tool || "Completed";
}

/**
 * Determines if a meta-tool is a wrapper tool (describe_tool or execute_tool)
 *
 * @param metaTool - The meta-tool name to check
 * @returns True if it's a meta-tool, false otherwise
 */
export function isMetaTool(metaTool: string): boolean {
  return metaTool === META_TOOLS.DESCRIBE || metaTool === META_TOOLS.EXECUTE;
}

/**
 * Gets the header text for chain-of-thought display
 *
 * @param isStreaming - Whether the message is currently streaming
 * @param events - The chain-of-thought events
 * @returns The header text to display
 */
export function getChainOfThoughtHeaderText(
  isStreaming: boolean,
  events: ChainOfThoughtData[],
): string {
  if (!isStreaming) {
    return "Thought process";
  }

  // Find the last completed tool to show current status
  const lastCompletedEvent = events
    .slice()
    .reverse()
    .find((e) => e.action === CHAIN_OF_THOUGHT_ACTIONS.COMPLETE && e.tool);

  if (lastCompletedEvent?.tool) {
    return `Executing ${lastCompletedEvent.tool}...`;
  }

  return "Processing...";
}
```

--------------------------------------------------------------------------------

````
