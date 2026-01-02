---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 789
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 789 of 867)

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

---[FILE: auth-form.tsx]---
Location: prowler-master/ui/components/auth/oss/auth-form.tsx

```typescript
import { SignInForm } from "@/components/auth/oss/sign-in-form";
import { SignUpForm } from "@/components/auth/oss/sign-up-form";

export const AuthForm = ({
  type,
  invitationToken,
  googleAuthUrl,
  githubAuthUrl,
  isGoogleOAuthEnabled,
  isGithubOAuthEnabled,
}: {
  type: string;
  invitationToken?: string | null;
  googleAuthUrl?: string;
  githubAuthUrl?: string;
  isGoogleOAuthEnabled?: boolean;
  isGithubOAuthEnabled?: boolean;
}) => {
  if (type === "sign-in") {
    return (
      <SignInForm
        googleAuthUrl={googleAuthUrl}
        githubAuthUrl={githubAuthUrl}
        isGoogleOAuthEnabled={isGoogleOAuthEnabled}
        isGithubOAuthEnabled={isGithubOAuthEnabled}
      />
    );
  }

  return (
    <SignUpForm
      invitationToken={invitationToken}
      googleAuthUrl={googleAuthUrl}
      githubAuthUrl={githubAuthUrl}
      isGoogleOAuthEnabled={isGoogleOAuthEnabled}
      isGithubOAuthEnabled={isGithubOAuthEnabled}
    />
  );
};
```

--------------------------------------------------------------------------------

---[FILE: auth-layout.tsx]---
Location: prowler-master/ui/components/auth/oss/auth-layout.tsx
Signals: React

```typescript
import { ReactNode } from "react";

import { ProwlerExtended } from "@/components/icons";
import { ThemeSwitch } from "@/components/ThemeSwitch";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden overflow-y-auto">
      <div className="relative flex w-full flex-col items-center justify-center px-4 py-32">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_80%)] bg-size-[16px_16px]"
          style={{
            backgroundImage:
              "radial-gradient(var(--bg-button-primary) 1px, transparent 1px)",
          }}
        ></div>

        {/* Prowler Logo */}
        <div className="relative z-10 mb-8 flex w-full max-w-[300px]">
          <ProwlerExtended width={300} className="h-auto w-full" />
        </div>

        {/* Auth Form Container */}
        <div className="rounded-large border-divider shadow-small dark:bg-background/85 relative z-10 flex w-full max-w-sm flex-col gap-4 border bg-white/90 px-8 py-10 md:max-w-md">
          {/* Header with Title and Theme Toggle */}
          <div className="flex items-center justify-between">
            <p className="pb-2 text-xl font-medium">{title}</p>
            <ThemeSwitch aria-label="Toggle theme" />
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/auth/oss/index.ts

```typescript
export * from "./auth-form";
export * from "./social-buttons";
```

--------------------------------------------------------------------------------

---[FILE: password-validator.tsx]---
Location: prowler-master/ui/components/auth/oss/password-validator.tsx

```typescript
"use client";

import { AlertCircle, CheckCircle } from "lucide-react";

import {
  PASSWORD_REQUIREMENTS,
  passwordRequirementCheckers,
} from "@/types/authFormSchema";

interface PasswordRequirementsMessageProps {
  password: string;
  className?: string;
}

const REQUIREMENTS = [
  {
    key: "minLength",
    checker: passwordRequirementCheckers.minLength,
    label: `At least ${PASSWORD_REQUIREMENTS.minLength} characters`,
  },
  {
    key: "specialChars",
    checker: passwordRequirementCheckers.specialChars,
    label: "Special characters",
  },
  {
    key: "uppercase",
    checker: passwordRequirementCheckers.uppercase,
    label: "Uppercase letters",
  },
  {
    key: "lowercase",
    checker: passwordRequirementCheckers.lowercase,
    label: "Lowercase letters",
  },
  {
    key: "numbers",
    checker: passwordRequirementCheckers.numbers,
    label: "Numbers",
  },
];

export const PasswordRequirementsMessage = ({
  password,
  className = "",
}: PasswordRequirementsMessageProps) => {
  const hasPasswordInput = password.length > 0;
  if (!hasPasswordInput) {
    return null;
  }
  const results = REQUIREMENTS.map((req) => ({
    ...req,
    isMet: req.checker(password),
  }));
  const metCount = results.filter((r) => r.isMet).length;
  const allRequirementsMet = metCount === REQUIREMENTS.length;

  return (
    <div className={className}>
      <div
        className={`bg-bg-neutral-primary rounded-xl border p-3 ${allRequirementsMet ? "border-bg-pass" : "border-bg-fail"}`}
        role="region"
        aria-label="Password requirements status"
      >
        {allRequirementsMet ? (
          <div className="flex items-center gap-2">
            <CheckCircle
              className="text-text-success-primary h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <p className="text-text-neutral-primary text-xs leading-tight font-medium">
              Password meets all requirements
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <AlertCircle
                className="text-text-error-primary h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <p className="text-text-neutral-primary text-xs leading-tight font-medium">
                Password must include:
              </p>
            </div>
            <ul
              className="ml-6 flex flex-col gap-0.5"
              aria-label="Password requirements"
            >
              {results.map((req) => (
                <li
                  key={req.key}
                  className="flex items-center gap-2 text-xs leading-tight"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        req.isMet ? "bg-bg-pass" : "bg-bg-fail"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className="text-text-neutral-secondary"
                      aria-label={`${req.label} ${req.isMet ? "satisfied" : "required"}`}
                    >
                      {req.label}
                    </span>
                  </div>
                  <span className="sr-only">
                    {req.isMet ? "Requirement met" : "Requirement not met"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: sign-in-form.tsx]---
Location: prowler-master/ui/components/auth/oss/sign-in-form.tsx
Signals: React, Next.js, Zod

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { authenticate } from "@/actions/auth";
import { initiateSamlAuth } from "@/actions/integrations/saml";
import { AuthDivider } from "@/components/auth/oss/auth-divider";
import { AuthFooterLink } from "@/components/auth/oss/auth-footer-link";
import { AuthLayout } from "@/components/auth/oss/auth-layout";
import { SocialButtons } from "@/components/auth/oss/social-buttons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { Form } from "@/components/ui/form";
import { SignInFormData, signInSchema } from "@/types";

export const SignInForm = ({
  googleAuthUrl,
  githubAuthUrl,
  isGoogleOAuthEnabled,
  isGithubOAuthEnabled,
}: {
  googleAuthUrl?: string;
  githubAuthUrl?: string;
  isGoogleOAuthEnabled?: boolean;
  isGithubOAuthEnabled?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const samlError = searchParams.get("sso_saml_failed");
    const sessionError = searchParams.get("error");

    if (samlError) {
      setTimeout(() => {
        toast({
          variant: "destructive",
          title: "SAML Authentication Error",
          description:
            "An error occurred while attempting to login via your Identity Provider (IdP). Please check your IdP configuration.",
        });
      }, 100);
    }

    if (sessionError) {
      setTimeout(() => {
        const errorMessages: Record<
          string,
          { title: string; description: string }
        > = {
          RefreshAccessTokenError: {
            title: "Session Expired",
            description:
              "Your session has expired. Please sign in again to continue.",
          },
          MissingRefreshToken: {
            title: "Session Error",
            description:
              "There was a problem with your session. Please sign in again.",
          },
        };

        const errorConfig = errorMessages[sessionError] || {
          title: "Authentication Error",
          description: "Please sign in again to continue.",
        };

        toast({
          variant: "destructive",
          title: errorConfig.title,
          description: errorConfig.description,
        });
      }, 100);
    }
  }, [searchParams, toast]);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      isSamlMode: false,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const isSamlMode = form.watch("isSamlMode");

  const onSubmit = async (data: SignInFormData) => {
    if (data.isSamlMode) {
      const email = data.email.toLowerCase();
      if (isSamlMode) {
        form.setValue("password", "");
      }

      const result = await initiateSamlAuth(email);

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        toast({
          variant: "destructive",
          title: "SAML Authentication Error",
          description:
            result.error || "An error occurred during SAML authentication.",
        });
      }
      return;
    }

    const result = await authenticate(null, {
      email: data.email.toLowerCase(),
      password: data.password,
    });

    if (result?.message === "Success") {
      router.push("/");
    } else if (result?.errors && "credentials" in result.errors) {
      const message = result.errors.credentials ?? "Invalid email or password";

      form.setError("email", { type: "server", message });
      form.setError("password", { type: "server", message });
    } else if (result?.message === "User email is not verified") {
      router.push("/email-verification");
    } else {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const title = isSamlMode ? "Sign in with SAML SSO" : "Sign in";

  return (
    <AuthLayout title={title}>
      <Form {...form}>
        <form
          noValidate
          method="post"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomInput
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
          />
          {!isSamlMode && (
            <CustomInput control={form.control} name="password" password />
          )}

          <Button
            type="submit"
            aria-label="Log in"
            aria-disabled={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Log in"}
          </Button>
        </form>
      </Form>

      <AuthDivider />

      <div className="flex flex-col gap-2">
        {!isSamlMode && (
          <SocialButtons
            googleAuthUrl={googleAuthUrl}
            githubAuthUrl={githubAuthUrl}
            isGoogleOAuthEnabled={isGoogleOAuthEnabled}
            isGithubOAuthEnabled={isGithubOAuthEnabled}
          />
        )}
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            form.setValue("isSamlMode", !isSamlMode);
          }}
        >
          {!isSamlMode && (
            <Icon
              className="text-default-500"
              icon="mdi:shield-key"
              width={24}
            />
          )}
          {isSamlMode ? "Back" : "Continue with SAML SSO"}
        </Button>
      </div>

      <AuthFooterLink
        text="Need to create an account?"
        linkText="Sign up"
        href="/sign-up"
      />
    </AuthLayout>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: sign-up-form.tsx]---
Location: prowler-master/ui/components/auth/oss/sign-up-form.tsx
Signals: Next.js, Zod

```typescript
"use client";

import { Checkbox } from "@heroui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { createNewUser } from "@/actions/auth";
import { AuthDivider } from "@/components/auth/oss/auth-divider";
import { AuthFooterLink } from "@/components/auth/oss/auth-footer-link";
import { AuthLayout } from "@/components/auth/oss/auth-layout";
import { PasswordRequirementsMessage } from "@/components/auth/oss/password-validator";
import { SocialButtons } from "@/components/auth/oss/social-buttons";
import { Button } from "@/components/shadcn";
import { useToast } from "@/components/ui";
import { CustomInput } from "@/components/ui/custom";
import { CustomLink } from "@/components/ui/custom/custom-link";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { ApiError, SignUpFormData, signUpSchema } from "@/types";

const AUTH_ERROR_PATHS = {
  NAME: "/data/attributes/name",
  EMAIL: "/data/attributes/email",
  PASSWORD: "/data/attributes/password",
  COMPANY_NAME: "/data/attributes/company_name",
  INVITATION_TOKEN: "/data",
} as const;

export const SignUpForm = ({
  invitationToken,
  googleAuthUrl,
  githubAuthUrl,
  isGoogleOAuthEnabled,
  isGithubOAuthEnabled,
}: {
  invitationToken?: string | null;
  googleAuthUrl?: string;
  githubAuthUrl?: string;
  isGoogleOAuthEnabled?: boolean;
  isGithubOAuthEnabled?: boolean;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      isSamlMode: false,
      name: "",
      company: "",
      confirmPassword: "",
      ...(invitationToken && { invitationToken }),
    },
  });

  const passwordValue = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: SignUpFormData) => {
    const newUser = await createNewUser(data);

    if (!newUser.errors) {
      toast({
        title: "Success!",
        description: "The user was registered successfully.",
      });
      form.reset();

      if (process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true") {
        router.push("/email-verification");
      } else {
        router.push("/sign-in");
      }
    } else {
      newUser.errors.forEach((error: ApiError) => {
        const errorMessage = error.detail;
        const pointer = error.source?.pointer;
        switch (pointer) {
          case AUTH_ERROR_PATHS.NAME:
            form.setError("name", { type: "server", message: errorMessage });
            break;
          case AUTH_ERROR_PATHS.EMAIL:
            form.setError("email", { type: "server", message: errorMessage });
            break;
          case AUTH_ERROR_PATHS.COMPANY_NAME:
            form.setError("company", {
              type: "server",
              message: errorMessage,
            });
            break;
          case AUTH_ERROR_PATHS.PASSWORD:
            form.setError("password", {
              type: "server",
              message: errorMessage,
            });
            break;
          case AUTH_ERROR_PATHS.INVITATION_TOKEN:
            form.setError("invitationToken", {
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
    }
  };

  return (
    <AuthLayout title="Sign up">
      <Form {...form}>
        <form
          noValidate
          method="post"
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomInput
            control={form.control}
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
          />
          <CustomInput
            control={form.control}
            name="company"
            type="text"
            label="Company name"
            placeholder="Enter your company name"
            isRequired={false}
          />
          <CustomInput
            control={form.control}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
          />
          <CustomInput control={form.control} name="password" password />
          <PasswordRequirementsMessage password={passwordValue || ""} />
          <CustomInput
            control={form.control}
            name="confirmPassword"
            confirmPassword
          />
          {invitationToken && (
            <CustomInput
              control={form.control}
              name="invitationToken"
              type="text"
              label="Invitation Token"
              placeholder={invitationToken}
              defaultValue={invitationToken}
              isRequired={false}
              isDisabled={invitationToken !== null && true}
            />
          )}

          {process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true" && (
            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <>
                  <FormControl>
                    <Checkbox
                      isRequired
                      className="py-4"
                      size="sm"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="default"
                    >
                      I agree with the&nbsp;
                      <CustomLink
                        href="https://prowler.com/terms-of-service/"
                        size="sm"
                      >
                        Terms of Service
                      </CustomLink>
                      &nbsp;of Prowler
                    </Checkbox>
                  </FormControl>
                  <FormMessage className="text-text-error" />
                </>
              )}
            />
          )}

          <Button
            type="submit"
            aria-label="Sign up"
            aria-disabled={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign up"}
          </Button>
        </form>
      </Form>

      {!invitationToken && (
        <>
          <AuthDivider />
          <div className="flex flex-col gap-2">
            <SocialButtons
              googleAuthUrl={googleAuthUrl}
              githubAuthUrl={githubAuthUrl}
              isGoogleOAuthEnabled={isGoogleOAuthEnabled}
              isGithubOAuthEnabled={isGithubOAuthEnabled}
            />
          </div>
        </>
      )}

      <AuthFooterLink
        text="Already have an account?"
        linkText="Log in"
        href="/sign-in"
      />
    </AuthLayout>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: social-buttons.tsx]---
Location: prowler-master/ui/components/auth/oss/social-buttons.tsx

```typescript
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";

import { Button } from "@/components/shadcn";
import { CustomLink } from "@/components/ui/custom/custom-link";

export const SocialButtons = ({
  googleAuthUrl,
  githubAuthUrl,
  isGoogleOAuthEnabled,
  isGithubOAuthEnabled,
}: {
  googleAuthUrl?: string;
  githubAuthUrl?: string;
  isGoogleOAuthEnabled?: boolean;
  isGithubOAuthEnabled?: boolean;
}) => (
  <>
    <Tooltip
      content={
        <div className="flex-inline text-small">
          Social Login with Google is not enabled.{" "}
          <CustomLink href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-social-login/#google-oauth-configuration">
            Read the docs
          </CustomLink>
        </div>
      }
      placement="top"
      shadow="sm"
      isDisabled={isGoogleOAuthEnabled}
      className="w-96"
    >
      <span>
        <Button
          variant="outline"
          className="w-full"
          asChild={isGoogleOAuthEnabled}
          disabled={!isGoogleOAuthEnabled}
        >
          <a href={googleAuthUrl} className="flex items-center gap-2">
            <Icon
              icon={
                isGoogleOAuthEnabled
                  ? "flat-color-icons:google"
                  : "simple-icons:google"
              }
              width={24}
            />
            Continue with Google
          </a>
        </Button>
      </span>
    </Tooltip>
    <Tooltip
      content={
        <div className="flex-inline text-small">
          Social Login with Github is not enabled.{" "}
          <CustomLink href="https://docs.prowler.com/projects/prowler-open-source/en/latest/tutorials/prowler-app-social-login/#github-oauth-configuration">
            Read the docs
          </CustomLink>
        </div>
      }
      placement="top"
      shadow="sm"
      isDisabled={isGithubOAuthEnabled}
      className="w-96"
    >
      <span>
        <Button
          variant="outline"
          className="w-full"
          asChild={isGithubOAuthEnabled}
          disabled={!isGithubOAuthEnabled}
        >
          <a href={githubAuthUrl} className="flex items-center gap-2">
            <Icon icon="simple-icons:github" width={24} />
            Continue with Github
          </a>
        </Button>
      </span>
    </Tooltip>
  </>
);
```

--------------------------------------------------------------------------------

---[FILE: compliance-card.tsx]---
Location: prowler-master/ui/components/compliance/compliance-card.tsx
Signals: React, Next.js

```typescript
"use client";

import { Progress } from "@heroui/progress";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Card, CardContent } from "@/components/shadcn/card/card";
import { DownloadIconButton, toast } from "@/components/ui";
import { downloadComplianceCsv } from "@/lib/helper";
import { ScanEntity } from "@/types/scans";

import { getComplianceIcon } from "../icons";

interface ComplianceCardProps {
  title: string;
  version: string;
  passingRequirements: number;
  totalRequirements: number;
  prevPassingRequirements: number;
  prevTotalRequirements: number;
  scanId: string;
  complianceId: string;
  id: string;
  selectedScan?: ScanEntity;
}

export const ComplianceCard: React.FC<ComplianceCardProps> = ({
  title,
  version,
  passingRequirements,
  totalRequirements,
  scanId,
  complianceId,
  id,
  selectedScan,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasRegionFilter = searchParams.has("filter[region__in]");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const formatTitle = (title: string) => {
    return title.split("-").join(" ");
  };

  const ratingPercentage = Math.floor(
    (passingRequirements / totalRequirements) * 100,
  );

  const getRatingColor = (ratingPercentage: number) => {
    if (ratingPercentage <= 10) {
      return "danger";
    }
    if (ratingPercentage <= 40) {
      return "warning";
    }
    return "success";
  };

  const navigateToDetail = () => {
    const formattedTitleForUrl = encodeURIComponent(title);
    const path = `/compliance/${formattedTitleForUrl}`;
    const params = new URLSearchParams();

    params.set("complianceId", id);
    params.set("version", version);
    params.set("scanId", scanId);

    if (selectedScan) {
      params.set(
        "scanData",
        JSON.stringify({
          id: selectedScan.id,
          providerInfo: selectedScan.providerInfo,
          attributes: selectedScan.attributes,
        }),
      );
    }

    const regionFilter = searchParams.get("filter[region__in]");
    if (regionFilter) {
      params.set("filter[region__in]", regionFilter);
    }

    router.push(`${path}?${params.toString()}`);
  };
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadComplianceCsv(scanId, complianceId, toast);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      variant="base"
      padding="md"
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={navigateToDetail}
    >
      <CardContent className="p-0">
        <div className="flex w-full items-center gap-4">
          {getComplianceIcon(title) && (
            <Image
              src={getComplianceIcon(title)}
              alt={`${title} logo`}
              className="h-10 w-10 min-w-10 rounded-md border border-gray-300 bg-white object-contain p-1"
            />
          )}
          <div className="flex w-full flex-col">
            <h4 className="text-small mb-1 leading-5 font-bold">
              {formatTitle(title)}
              {version ? ` - ${version}` : ""}
            </h4>
            <Progress
              label="Score:"
              size="sm"
              aria-label="Compliance score"
              value={ratingPercentage}
              showValueLabel={true}
              classNames={{
                track: "drop-shadow-sm border border-default",
                label: "tracking-wider font-medium text-default-600 text-xs",
                value: "text-foreground/60 -mb-2",
              }}
              color={getRatingColor(ratingPercentage)}
            />
            <div className="mt-2 flex items-center justify-between">
              <small>
                <span className="mr-1 text-xs font-semibold">
                  {passingRequirements} / {totalRequirements}
                </span>
                Passing Requirements
              </small>

              <div
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <DownloadIconButton
                  paramId={complianceId}
                  onDownload={handleDownload}
                  textTooltip="Download compliance CSV report"
                  isDisabled={hasRegionFilter}
                  isDownloading={isDownloading}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: compliance-download-button.tsx]---
Location: prowler-master/ui/components/compliance/compliance-download-button.tsx
Signals: React

```typescript
"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/shadcn/button/button";
import { toast } from "@/components/ui";
import {
  COMPLIANCE_REPORT_BUTTON_LABELS,
  type ComplianceReportType,
} from "@/lib/compliance/compliance-report-types";
import { downloadComplianceReportPdf } from "@/lib/helper";

interface ComplianceDownloadButtonProps {
  scanId: string;
  reportType: ComplianceReportType;
  label?: string;
}

export const ComplianceDownloadButton = ({
  scanId,
  reportType,
  label,
}: ComplianceDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadComplianceReportPdf(scanId, reportType, toast);
    } finally {
      setIsDownloading(false);
    }
  };

  const defaultLabel = COMPLIANCE_REPORT_BUTTON_LABELS[reportType];

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <DownloadIcon
        className={isDownloading ? "animate-download-icon" : ""}
        size={16}
      />
      {label || defaultLabel}
    </Button>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/components/compliance/index.ts

```typescript
export * from "./compliance-accordion/client-accordion-content";
export * from "./compliance-accordion/client-accordion-wrapper";
export * from "./compliance-accordion/compliance-accordion-requeriment-title";
export * from "./compliance-accordion/compliance-accordion-title";
export * from "./compliance-card";
export * from "./compliance-charts/chart-skeletons";
export * from "./compliance-charts/heatmap-chart";
export * from "./compliance-charts/requirements-status-card";
export * from "./compliance-charts/sections-failure-rate-card";
export * from "./compliance-charts/top-failed-sections-card";
export * from "./compliance-custom-details/cis-details";
export * from "./compliance-custom-details/ens-details";
export * from "./compliance-custom-details/iso-details";
export * from "./compliance-download-button";
export * from "./compliance-header/compliance-header";
export * from "./compliance-header/compliance-scan-info";
export * from "./compliance-header/data-compliance";
export * from "./compliance-header/scan-selector";
export * from "./no-scans-available";
export * from "./skeletons/bar-chart-skeleton";
export * from "./skeletons/compliance-accordion-skeleton";
export * from "./skeletons/compliance-grid-skeleton";
export * from "./skeletons/heatmap-chart-skeleton";
export * from "./skeletons/pie-chart-skeleton";
export * from "./threatscore-badge";
export * from "./threatscore-logo";
```

--------------------------------------------------------------------------------

---[FILE: no-scans-available.tsx]---
Location: prowler-master/ui/components/compliance/no-scans-available.tsx
Signals: React, Next.js

```typescript
"use client";

import Link from "next/link";
import React from "react";

import { Button } from "@/components/shadcn/button/button";
import { Card, CardContent } from "@/components/shadcn/card/card";

import { InfoIcon } from "../icons/Icons";

export const NoScansAvailable = () => {
  return (
    <div className="flex h-full min-h-[calc(100vh-56px)] items-center justify-center">
      <div className="mx-auto w-full max-w-2xl">
        <Card variant="base" padding="lg">
          <CardContent>
            <div className="flex w-full items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <InfoIcon className="mt-1 h-5 w-5 text-gray-400 dark:text-gray-300" />
                <div>
                  <h2 className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                    No Scans available
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    A scan must be completed before generating a compliance
                    report.
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="shrink-0"
              >
                <Link href="/scans" aria-label="Go to Scans page">
                  Go to Scans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

--------------------------------------------------------------------------------

---[FILE: threatscore-badge.tsx]---
Location: prowler-master/ui/components/compliance/threatscore-badge.tsx
Signals: React, Next.js

```typescript
"use client";

import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { DownloadIcon, FileTextIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ThreatScoreLogo } from "@/components/compliance/threatscore-logo";
import { Button } from "@/components/shadcn/button/button";
import { toast } from "@/components/ui";
import { COMPLIANCE_REPORT_TYPES } from "@/lib/compliance/compliance-report-types";
import {
  downloadComplianceCsv,
  downloadComplianceReportPdf,
} from "@/lib/helper";
import type { ScanEntity } from "@/types/scans";

interface ThreatScoreBadgeProps {
  score: number;
  scanId: string;
  provider: string;
  selectedScan?: ScanEntity;
}

export const ThreatScoreBadge = ({
  score,
  scanId,
  provider,
  selectedScan,
}: ThreatScoreBadgeProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);

  const complianceId = `prowler_threatscore_${provider.toLowerCase()}`;

  const getScoreColor = (): "success" | "warning" | "danger" => {
    if (score >= 80) return "success";
    if (score >= 40) return "warning";
    return "danger";
  };

  const getTextColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-text-error";
  };

  const handleCardClick = () => {
    const title = "ProwlerThreatScore";
    const version = "1.0";
    const formattedTitleForUrl = encodeURIComponent(title);
    const path = `/compliance/${formattedTitleForUrl}`;
    const params = new URLSearchParams();

    params.set("complianceId", complianceId);
    params.set("version", version);
    params.set("scanId", scanId);

    if (selectedScan) {
      params.set(
        "scanData",
        JSON.stringify({
          id: selectedScan.id,
          providerInfo: selectedScan.providerInfo,
          attributes: selectedScan.attributes,
        }),
      );
    }

    const regionFilter = searchParams.get("filter[region__in]");
    if (regionFilter) {
      params.set("filter[region__in]", regionFilter);
    }

    router.push(`${path}?${params.toString()}`);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadComplianceReportPdf(
        scanId,
        COMPLIANCE_REPORT_TYPES.THREATSCORE,
        toast,
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setIsDownloadingCsv(true);
    try {
      await downloadComplianceCsv(scanId, complianceId, toast);
    } finally {
      setIsDownloadingCsv(false);
    }
  };

  return (
    <Card
      shadow="sm"
      className="border-default-200 h-full border bg-transparent"
    >
      <CardBody className="flex flex-col gap-3 p-4">
        <button
          className="border-default-200 hover:border-default-300 hover:bg-default-50/50 flex cursor-pointer flex-row items-center gap-4 rounded-lg border bg-transparent p-3 transition-all"
          onClick={handleCardClick}
          type="button"
        >
          <ThreatScoreLogo />

          <div className="flex flex-col items-end gap-1">
            <span className={`text-2xl font-bold ${getTextColor()}`}>
              {score}%
            </span>
            <Progress
              aria-label="ThreatScore progress"
              value={score}
              color={getScoreColor()}
              size="sm"
              className="w-24"
            />
          </div>
        </button>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf || isDownloadingCsv}
          >
            <DownloadIcon
              size={14}
              className={isDownloadingPdf ? "animate-download-icon" : ""}
            />
            PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={handleDownloadCsv}
            disabled={isDownloadingCsv || isDownloadingPdf}
          >
            <FileTextIcon size={14} />
            CSV
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
```

--------------------------------------------------------------------------------

````
