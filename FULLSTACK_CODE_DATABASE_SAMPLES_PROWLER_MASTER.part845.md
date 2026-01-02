---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:16Z
part: 845
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 845 of 867)

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

---[FILE: CODE_REVIEW_SETUP.md]---
Location: prowler-master/ui/docs/code-review/CODE_REVIEW_SETUP.md

```text
# Code Review Setup - Prowler UI

Guide to set up automatic code validation with Claude Code in the pre-commit hook.

## Overview

The code review system works like this:

1. **When you enable `CODE_REVIEW_ENABLED=true` in `.env`**
   - When you `git commit`, the pre-commit hook runs
   - Only validates TypeScript/JavaScript files you're committing
   - Uses Claude Code to check if they comply with AGENTS.md
   - If there are violations → **BLOCKS the commit**
   - If everything is fine → Continues normally

2. **When `CODE_REVIEW_ENABLED=false` (default)**
   - The pre-commit hook does not run validation
   - No standards validation
   - Developers can commit without restrictions

## Installation

### 1. Ensure Claude Code is in your PATH

```bash
# Verify that claude is available in terminal
which claude

# If it doesn't appear, check your Claude Code CLI installation
```

### 2. Enable validation in `.env`

In `/ui/.env`, find the "Code Review Configuration" section:

```bash
#### Code Review Configuration ####
# Enable Claude Code standards validation on pre-commit hook
# Set to 'true' to validate changes against AGENTS.md standards via Claude Code
# Set to 'false' to skip validation
CODE_REVIEW_ENABLED=false  # ← Change this to 'true'
```

**Options:**
- `CODE_REVIEW_ENABLED=true` → Enables validation
- `CODE_REVIEW_ENABLED=false` → Disables validation (default)

### 3. The hook is ready

The `.husky/pre-commit` file already contains the logic. You don't need to install anything else.

## How It Works

### Normal Flow (with validation enabled)

```bash
$ git commit -m "feat: add new component"

# Pre-commit hook executes automatically
🚀 Prowler UI - Pre-Commit Hook
 ℹ️  Code Review Status: true

📋 Files to validate:
  - components/new-feature.tsx
  - types/new-feature.ts

📤 Sending to Claude Code for validation...

# Claude analyzes the files...

=== VALIDATION REPORT ===
STATUS: PASSED
All files comply with AGENTS.md standards.

✅ VALIDATION PASSED
# Commit continues ✅
```

### If There Are Violations

```bash
$ git commit -m "feat: add new component"

# Claude detects issues...

=== VALIDATION REPORT ===
STATUS: FAILED

- File: components/new-feature.tsx:15
  Rule: React Imports
  Issue: Using 'import * as React' instead of named imports
  Expected: import { useState } from "react"

❌ VALIDATION FAILED

Please fix the violations before committing:
  1. Review the violations listed above
  2. Fix the code according to AGENTS.md standards
  3. Commit your changes
  4. Try again

# Commit is BLOCKED ❌
```

## What Gets Validated

The system verifies that files comply with:

### 1. React Imports
```typescript
// ❌ WRONG
import * as React from "react"
import React, { useState } from "react"

// ✅ CORRECT
import { useState } from "react"
```

### 2. TypeScript Type Patterns
```typescript
// ❌ WRONG
type SortOption = "high-low" | "low-high"

// ✅ CORRECT
const SORT_OPTIONS = {
  HIGH_LOW: "high-low",
  LOW_HIGH: "low-high",
} as const
type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS]
```

### 3. Tailwind CSS
```typescript
// ❌ WRONG
className="bg-[var(--color)]"
className="text-[#ffffff]"

// ✅ CORRECT
className="bg-card-bg text-white"
```

### 4. cn() Utility
```typescript
// ❌ WRONG
className={cn("flex items-center")}

// ✅ CORRECT
className={cn("h-3 w-3", isCircle ? "rounded-full" : "rounded-sm")}
```

### 5. React 19 Hooks
```typescript
// ❌ WRONG
const memoized = useMemo(() => value, [])

// ✅ CORRECT
// Don't use useMemo (React Compiler handles it)
const value = expensiveCalculation()
```

### 6. Zod v4 Syntax
```typescript
// ❌ WRONG
z.string().email()
z.string().nonempty()

// ✅ CORRECT
z.email()
z.string().min(1)
```

### 7. File Organization
```
// ❌ WRONG
Code used by 2+ features in feature-specific folder

// ✅ CORRECT
Code used by 1 feature → local in that feature
Code used by 2+ features → in shared/global
```

### 8. Use Directives
```typescript
// ❌ WRONG
export async function updateUser() { } // Missing "use server"

// ✅ CORRECT
"use server"
export async function updateUser() { }
```

## Disable Temporarily

If you need to commit without validation temporarily:

```bash
# Option 1: Change in .env
CODE_REVIEW_ENABLED=false
git commit

# Option 2: Use git hook bypass
git commit --no-verify

# Option 3: Disable the hook
chmod -x .husky/pre-commit
git commit
chmod +x .husky/pre-commit
```

**⚠️ Note:** `--no-verify` skips ALL hooks.

## Troubleshooting

### "Claude Code CLI not found"

```
⚠️ Claude Code CLI not found in PATH
To enable: ensure Claude Code is in PATH and CODE_REVIEW_ENABLED=true
```

**Solution:**
```bash
# Check where claude-code is installed
which claude-code

# If not found, add to your ~/.zshrc:
export PATH="$HOME/.local/bin:$PATH"  # or where it's installed

# Reload the terminal
source ~/.zshrc
```

### "Validation inconclusive"

If Claude Code cannot determine the status:

```
⚠️ Could not determine validation status
Allowing commit (validation inconclusive)
```

The commit is allowed automatically. If you want to be stricter, you can:

1. Manually review files against AGENTS.md
2. Report the analysis problem to Claude

### Build fails after validation

```
❌ Build failed
```

If validation passes but build fails:

1. Check the build error
2. Fix it locally
3. Commit and try again

## View the Full Report

Reports are saved in temporary files that are deleted afterward. To see the detailed report in real-time, watch the hook output:

```bash
git commit 2>&1 | tee commit-report.txt
```

This will save everything to `commit-report.txt`.

## For the Team

### Enable on your machine

```bash
cd ui
# Edit .env locally and set:
CODE_REVIEW_ENABLED=true
```

### Recommended Flow

1. **During development**: `CODE_REVIEW_ENABLED=false`
   - Iterate faster
   - Build check still runs

2. **Before final commit**: `CODE_REVIEW_ENABLED=true`
   - Verify you meet standards
   - Prevent PRs rejected for violations

3. **In CI/CD**: You could add additional validation
   - (future) Server-side validation in GitHub Actions

## Questions?

If you have questions about the standards being validated, check:
- `AGENTS.md` - Complete architecture guide
- `CLAUDE.md` - Project-specific instructions
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/ui/docs/code-review/README.md

```text
# Code Review System Documentation

Complete documentation for the Claude Code-powered pre-commit validation system.

## Quick Navigation

**Want to get started in 3 steps?**
→ Read: [`CODE_REVIEW_QUICK_START.md`](./CODE_REVIEW_QUICK_START.md)

**Want complete technical details?**
→ Read: [`CODE_REVIEW_SETUP.md`](./CODE_REVIEW_SETUP.md)

---

## What This System Does

Automatically validates code against AGENTS.md standards when you commit using Claude Code.

```
git commit
  ↓
(Optional) Claude Code validation
  ↓
If violations found → Commit is BLOCKED ❌
If code complies → Commit continues ✅
```

**Key Feature:** Configurable with a single variable in `.env`
- `CODE_REVIEW_ENABLED=true` → Validates (recommended before commits)
- `CODE_REVIEW_ENABLED=false` → Skip validation (default, for iteration)

---

## File Guide

| File | Purpose | Read Time |
|------|---------|-----------|
| [`CODE_REVIEW_QUICK_START.md`](./CODE_REVIEW_QUICK_START.md) | 3-step setup & examples | 5 min |
| [`CODE_REVIEW_SETUP.md`](./CODE_REVIEW_SETUP.md) | Complete technical guide | 15 min |

---

## What Gets Validated

When validation is enabled, the system checks:

✅ **React Imports**
- Must use: `import { useState } from "react"`
- Not: `import * as React` or `import React, {`

✅ **TypeScript Types**
- Must use: `const STATUS = {...} as const; type Status = typeof STATUS[...]`
- Not: `type Status = "a" | "b"`

✅ **Tailwind CSS**
- Must use: `className="bg-card-bg text-white"`
- Not: `className="bg-[var(...)]"` or `className="text-[#fff]"`

✅ **cn() Utility**
- Must use for: `cn("h-3", isActive && "bg-blue")`
- Not for: `cn("static-class")`

✅ **React 19 Hooks**
- No: `useMemo()` / `useCallback()` without documented reason
- Use: Nothing (React Compiler handles optimization)

✅ **Zod v4 Syntax**
- Must use: `z.email()`, `.min(1)`
- Not: `z.string().email()`, `.nonempty()`

✅ **File Organization**
- 1 feature uses → Keep local in feature folder
- 2+ features use → Move to shared/global

✅ **Directives**
- Server Actions must have: `"use server"`
- Client Components must have: `"use client"`

---

## Installation (For Your Team)

### Step 1: Decide if you want validation
- **Optional:** Each developer decides
- **Team policy:** Consider making it standard before commits

### Step 2: Enable in your environment
```bash
# Edit ui/.env
CODE_REVIEW_ENABLED=true
```

### Step 3: Done!
Your next `git commit` will validate automatically.

---

## Support

| Question | Answer |
|----------|--------|
| How do I enable it? | Change `CODE_REVIEW_ENABLED=true` in `.env` |
| How do I disable it? | Change `CODE_REVIEW_ENABLED=false` in `.env` |
| How do I bypass? | Use `git commit --no-verify` (emergency only) |
| What if Claude Code isn't found? | Check PATH: `which claude` |
| What if hook doesn't run? | Check executable: `chmod +x .husky/pre-commit` |
| How do I test it? | Enable validation and commit code with violations to test |
| What if I don't have Claude Code? | Validation is skipped gracefully |

---

## Key Features

✅ **No Setup Required**
- Uses Claude Code already in your PATH
- No API keys needed
- Works offline (if Claude Code supports it)

✅ **Smart Validation**
- Only checks files being committed
- Not the entire codebase
- Fast: ~10-30 seconds with validation enabled

✅ **Flexible**
- Can be enabled/disabled per developer
- Can be disabled temporarily with `git commit --no-verify`
- Default is disabled (doesn't interrupt workflow)

✅ **Clear Feedback**
- Shows exactly what violates standards
- Shows file:line references
- Explains how to fix each issue

✅ **Well Documented**
- 5 different documentation files
- For different needs and levels
- Examples and troubleshooting included

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Developer commits code                 │
└────────────────┬────────────────────────┘
                 ↓
        ┌─────────────────┐
        │ Pre-Commit Hook │
        │ (.husky/pre-commit)
        └────────┬────────┘
                 ↓
        Read CODE_REVIEW_ENABLED from .env
                 ↓
        ┌──────────────────────────┐
        │ If false (disabled)      │
        └────────┬─────────────────┘
                 ↓
            exit 0 (OK)
                 ↓
            Commit continues ✅

        ┌──────────────────────────┐
        │ If true (enabled)        │
        └────────┬─────────────────┘
                 ↓
        Extract staged files
        (git diff --cached)
                 ↓
        Build prompt with git diff
                 ↓
        Send to: claude < prompt
                 ↓
        Analyze against AGENTS.md
                 ↓
        Return: STATUS: PASSED or FAILED
                 ↓
        Parse with: grep "^STATUS:"
                 ↓
        ┌──────────────────┐
        │ PASSED detected  │
        └────────┬─────────┘
                 ↓
            exit 0 (OK)
                 ↓
            Commit continues ✅

        ┌──────────────────┐
        │ FAILED detected  │
        └────────┬─────────┘
                 ↓
        Show violations
                 ↓
            exit 1 (FAIL)
                 ↓
        Commit is BLOCKED ❌
                 ↓
        Developer fixes code
        Developer commits again
```

---

## Getting Started

1. **Read:** [`CODE_REVIEW_QUICK_START.md`](./CODE_REVIEW_QUICK_START.md) (5 minutes)
2. **Enable:** Set `CODE_REVIEW_ENABLED=true` in your `ui/.env`
3. **Test:** Commit some code and see validation in action
4. **For help:** See the troubleshooting section in [`CODE_REVIEW_SETUP.md`](./CODE_REVIEW_SETUP.md)

---

## Implementation Details

- **Files Modified:** 1 (`.husky/pre-commit`)
- **Files Created:** 3 (documentation)
- **Hook Size:** ~120 lines of bash
- **Dependencies:** Claude Code CLI (already available)
- **Setup Time:** 1 minute
- **Default:** Disabled (no workflow interruption)

---

## Questions?

- **How to enable?** → `CODE_REVIEW_QUICK_START.md`
- **How does it work?** → `CODE_REVIEW_SETUP.md`
- **Troubleshooting?** → See troubleshooting section in `CODE_REVIEW_SETUP.md`

---

## Status

✅ **Ready to Use**

The system is fully implemented, documented, and tested. You can enable it immediately with a single variable change.

---

**Last Updated:** November 6, 2024
**Status:** Complete Implementation
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/hooks/index.ts

```typescript
export * from "./use-auth";
export * from "./use-credentials-form";
export * from "./use-form-server-errors";
export * from "./use-local-storage";
export * from "./use-related-filters";
export * from "./use-sidebar";
export * from "./use-store";
export * from "./use-url-filters";
```

--------------------------------------------------------------------------------

---[FILE: use-auth.ts]---
Location: prowler-master/ui/hooks/use-auth.ts

```typescript
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const permissions = session?.user?.permissions || {
    manage_users: false,
    manage_account: false,
    manage_providers: false,
    manage_scans: false,
    manage_integrations: false,
    manage_billing: false,
    unlimited_visibility: false,
  };

  const hasPermission = (permission: keyof typeof permissions) => {
    return permissions[permission] === true;
  };

  return {
    session,
    isLoading,
    isAuthenticated,
    user: session?.user,
    permissions,
    hasPermission,
  };
}
```

--------------------------------------------------------------------------------

---[FILE: use-credentials-form.ts]---
Location: prowler-master/ui/hooks/use-credentials-form.ts
Signals: Next.js, Zod

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { useFormServerErrors } from "@/hooks/use-form-server-errors";
import { filterEmptyValues } from "@/lib";
import { PROVIDER_CREDENTIALS_ERROR_MAPPING } from "@/lib/error-mappings";
import { ProviderCredentialFields } from "@/lib/provider-credentials/provider-credential-fields";
import {
  addCredentialsFormSchema,
  addCredentialsRoleFormSchema,
  addCredentialsServiceAccountFormSchema,
  ProviderType,
} from "@/types";

type UseCredentialsFormProps = {
  providerType: ProviderType;
  providerId: string;
  providerUid?: string;
  onSubmit: (formData: FormData) => Promise<any>;
  successNavigationUrl: string;
};

export const useCredentialsForm = ({
  providerType,
  providerId,
  providerUid,
  onSubmit,
  successNavigationUrl,
}: UseCredentialsFormProps) => {
  const router = useRouter();
  const searchParamsObj = useSearchParams();
  const { data: session } = useSession();
  const via = searchParamsObj.get("via");

  // Select the appropriate schema based on provider type and via parameter
  const getFormSchema = () => {
    if (providerType === "aws" && via === "role") {
      return addCredentialsRoleFormSchema(providerType);
    }
    if (providerType === "gcp" && via === "service-account") {
      return addCredentialsServiceAccountFormSchema(providerType);
    }
    // For GitHub and M365, we need to pass the via parameter to determine which fields are required
    if (providerType === "github" || providerType === "m365") {
      return addCredentialsFormSchema(providerType, via);
    }
    return addCredentialsFormSchema(providerType);
  };

  const formSchema = getFormSchema();

  // Get default values based on provider type and via parameter
  const getDefaultValues = () => {
    const baseDefaults = {
      [ProviderCredentialFields.PROVIDER_ID]: providerId,
      [ProviderCredentialFields.PROVIDER_TYPE]: providerType,
    };

    // AWS Role credentials
    if (providerType === "aws" && via === "role") {
      const isCloudEnv = process.env.NEXT_PUBLIC_IS_CLOUD_ENV === "true";
      const defaultCredentialsType = isCloudEnv
        ? "aws-sdk-default"
        : "access-secret-key";
      return {
        ...baseDefaults,
        [ProviderCredentialFields.CREDENTIALS_TYPE]: defaultCredentialsType,
        [ProviderCredentialFields.ROLE_ARN]: "",
        [ProviderCredentialFields.EXTERNAL_ID]: session?.tenantId || "",
        [ProviderCredentialFields.AWS_ACCESS_KEY_ID]: "",
        [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]: "",
        [ProviderCredentialFields.AWS_SESSION_TOKEN]: "",
        [ProviderCredentialFields.ROLE_SESSION_NAME]: "",
        [ProviderCredentialFields.SESSION_DURATION]: "3600",
      };
    }

    // GCP Service Account
    if (providerType === "gcp" && via === "service-account") {
      return {
        ...baseDefaults,
        [ProviderCredentialFields.SERVICE_ACCOUNT_KEY]: "",
      };
    }

    switch (providerType) {
      case "aws":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.AWS_ACCESS_KEY_ID]: "",
          [ProviderCredentialFields.AWS_SECRET_ACCESS_KEY]: "",
          [ProviderCredentialFields.AWS_SESSION_TOKEN]: "",
        };
      case "azure":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.CLIENT_ID]: "",
          [ProviderCredentialFields.CLIENT_SECRET]: "",
          [ProviderCredentialFields.TENANT_ID]: "",
        };
      case "m365":
        // M365 credentials based on via parameter
        if (via === "app_client_secret") {
          return {
            ...baseDefaults,
            [ProviderCredentialFields.CLIENT_ID]: "",
            [ProviderCredentialFields.CLIENT_SECRET]: "",
            [ProviderCredentialFields.TENANT_ID]: "",
          };
        }
        if (via === "app_certificate") {
          return {
            ...baseDefaults,
            [ProviderCredentialFields.CLIENT_ID]: "",
            [ProviderCredentialFields.CERTIFICATE_CONTENT]: "",
            [ProviderCredentialFields.TENANT_ID]: "",
          };
        }
        return {
          ...baseDefaults,
          [ProviderCredentialFields.CLIENT_ID]: "",
          [ProviderCredentialFields.TENANT_ID]: "",
        };
      case "gcp":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.CLIENT_ID]: "",
          [ProviderCredentialFields.CLIENT_SECRET]: "",
          [ProviderCredentialFields.REFRESH_TOKEN]: "",
        };
      case "kubernetes":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.KUBECONFIG_CONTENT]: "",
        };
      case "github":
        // GitHub credentials based on via parameter
        if (via === "personal_access_token") {
          return {
            ...baseDefaults,
            [ProviderCredentialFields.PERSONAL_ACCESS_TOKEN]: "",
          };
        }
        if (via === "oauth_app") {
          return {
            ...baseDefaults,
            [ProviderCredentialFields.OAUTH_APP_TOKEN]: "",
          };
        }
        if (via === "github_app") {
          return {
            ...baseDefaults,
            [ProviderCredentialFields.GITHUB_APP_ID]: "",
            [ProviderCredentialFields.GITHUB_APP_KEY]: "",
          };
        }
        return baseDefaults;
      case "oraclecloud":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.OCI_USER]: "",
          [ProviderCredentialFields.OCI_FINGERPRINT]: "",
          [ProviderCredentialFields.OCI_KEY_CONTENT]: "",
          [ProviderCredentialFields.OCI_TENANCY]: providerUid || "",
          [ProviderCredentialFields.OCI_REGION]: "",
          [ProviderCredentialFields.OCI_PASS_PHRASE]: "",
        };
      case "mongodbatlas":
        return {
          ...baseDefaults,
          [ProviderCredentialFields.ATLAS_PUBLIC_KEY]: "",
          [ProviderCredentialFields.ATLAS_PRIVATE_KEY]: "",
        };
      default:
        return baseDefaults;
    }
  };

  const defaultValues = getDefaultValues();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "all", // Show all errors for each field
  });

  const { handleServerResponse } = useFormServerErrors(
    form,
    PROVIDER_CREDENTIALS_ERROR_MAPPING,
  );

  // Handler for back button
  const handleBackStep = () => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete("via");
    router.push(`?${currentParams.toString()}`);
  };

  // Form submit handler
  const handleSubmit = async (values: Record<string, unknown>) => {
    const formData = new FormData();

    // Filter out empty values first, then append all remaining values
    const filteredValues = filterEmptyValues(values);

    Object.entries(filteredValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const data = await onSubmit(formData);

    const isSuccess = handleServerResponse(data);
    if (isSuccess) {
      router.push(successNavigationUrl);
    }
  };

  const { isSubmitting, errors } = form.formState;

  return {
    form,
    isLoading: isSubmitting,
    errors,
    handleSubmit,
    handleBackStep,
    searchParamsObj,
    externalId: session?.tenantId || "",
  };
};
```

--------------------------------------------------------------------------------

---[FILE: use-form-server-errors.ts]---
Location: prowler-master/ui/hooks/use-form-server-errors.ts

```typescript
import { UseFormReturn } from "react-hook-form";

import { useToast } from "@/components/ui";
import { ApiError } from "@/types";

/**
 * Generic hook for handling server errors in forms
 * Can be used across different types of forms, not just credential forms
 */
export const useFormServerErrors = <T extends Record<string, any>>(
  form: UseFormReturn<T>,
  customErrorMapping?: Record<string, string>,
) => {
  const { toast } = useToast();

  const handleServerErrors = (
    errors: ApiError[],
    errorMapping?: Record<string, string>,
  ) => {
    errors.forEach((error: ApiError) => {
      const errorMessage = error.detail;
      const pointer = error.source?.pointer;
      const fieldName = pointer ? errorMapping?.[pointer] : undefined;

      if (fieldName && fieldName in form.formState.defaultValues!) {
        form.setError(fieldName as any, {
          type: "server",
          message: errorMessage,
        });
      } else {
        // Handle unknown error pointers with toast
        toast({
          variant: "destructive",
          title: "Oops! Something went wrong",
          description: errorMessage,
        });
      }
    });
  };

  const handleServerResponse = (
    data: any,
    errorMapping?: Record<string, string>,
  ) => {
    // Check for both error (singular) and errors (plural) from server responses
    if (data?.error) {
      // Handle single error from server
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: data.error,
      });
      return false; // Indicates error occurred
    } else if (data?.errors && data.errors.length > 0) {
      handleServerErrors(data.errors, errorMapping || customErrorMapping);
      return false; // Indicates error occurred
    }
    return true; // Indicates success
  };

  return { handleServerResponse, handleServerErrors };
};
```

--------------------------------------------------------------------------------

---[FILE: use-local-storage.ts]---
Location: prowler-master/ui/hooks/use-local-storage.ts
Signals: React

```typescript
"use client";

import { useEffect, useState } from "react";

export const useLocalStorage = (
  key: string,
  initialValue: string | boolean,
): [
  string | boolean,
  (
    value: string | boolean | ((val: string | boolean) => string | boolean),
  ) => void,
] => {
  const [state, setState] = useState<string | boolean>(initialValue);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(key);

      if (value) {
        setState(JSON.parse(value));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [key]);

  const setValue = (
    value: string | boolean | ((val: string | boolean) => string | boolean),
  ) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore =
        typeof value === "function"
          ? (value as (val: string | boolean) => string | boolean)(state)
          : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(valueToStore);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return [state, setValue];
};
```

--------------------------------------------------------------------------------

---[FILE: use-related-filters.ts]---
Location: prowler-master/ui/hooks/use-related-filters.ts
Signals: React, Next.js

```typescript
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useUrlFilters } from "@/hooks/use-url-filters";
import { isScanEntity } from "@/lib/helper-filters";
import {
  FilterEntity,
  FilterType,
  ProviderEntity,
  ProviderType,
  ScanEntity,
} from "@/types";

interface UseRelatedFiltersProps {
  providerIds?: string[];
  providerUIDs?: string[];
  providerDetails: { [key: string]: FilterEntity }[];
  completedScanIds?: string[];
  scanDetails?: { [key: string]: ScanEntity }[];
  enableScanRelation?: boolean;
  providerFilterType?: FilterType.PROVIDER | FilterType.PROVIDER_UID;
}

export const useRelatedFilters = ({
  providerIds = [],
  providerUIDs = [],
  providerDetails,
  completedScanIds = [],
  scanDetails = [],
  enableScanRelation = false,
  providerFilterType = FilterType.PROVIDER,
}: UseRelatedFiltersProps) => {
  const searchParams = useSearchParams();
  const { updateFilter } = useUrlFilters();
  const [availableScans, setAvailableScans] =
    useState<string[]>(completedScanIds);

  // Use providerIds if provided (for findings), otherwise use providerUIDs (for scans)
  const providers = providerIds.length > 0 ? providerIds : providerUIDs;
  const [availableProviders, setAvailableProviders] =
    useState<string[]>(providers);
  const previousProviders = useRef<string[]>([]);
  const previousProviderTypes = useRef<ProviderType[]>([]);
  const isManualDeselection = useRef(false);

  const getScanProvider = (scanId: string) => {
    if (!enableScanRelation) return null;
    const scanDetail = scanDetails.find(
      (detail) => Object.keys(detail)[0] === scanId,
    );
    return scanDetail ? scanDetail[scanId]?.providerInfo?.uid : null;
  };

  const getScanProviderType = (scanId: string): ProviderType | null => {
    if (!enableScanRelation) return null;
    const scanDetail = scanDetails.find(
      (detail) => Object.keys(detail)[0] === scanId,
    );
    return scanDetail ? scanDetail[scanId]?.providerInfo?.provider : null;
  };

  const getProviderType = (providerKey: string): ProviderType | null => {
    const providerDetail = providerDetails.find(
      (detail) => Object.keys(detail)[0] === providerKey,
    );
    if (!providerDetail) return null;

    const entity = providerDetail[providerKey];
    if (!isScanEntity(entity as ScanEntity)) {
      return (entity as ProviderEntity).provider;
    }
    return null;
  };

  useEffect(() => {
    const scanParam = enableScanRelation
      ? searchParams.get(`filter[${FilterType.SCAN}]`)
      : null;
    const providerParam = searchParams.get(`filter[${providerFilterType}]`);
    const providerTypeParam = searchParams.get(
      `filter[${FilterType.PROVIDER_TYPE}]`,
    );

    const currentProviders = providerParam ? providerParam.split(",") : [];
    const currentProviderTypes = providerTypeParam
      ? (providerTypeParam.split(",") as ProviderType[])
      : [];

    // Detect deselected items
    const deselectedProviders = previousProviders.current.filter(
      (provider) => !currentProviders.includes(provider),
    );
    const deselectedProviderTypes = previousProviderTypes.current.filter(
      (type) => !currentProviderTypes.includes(type),
    );

    // Check if it's a manual deselection
    if (deselectedProviderTypes.length > 0) {
      isManualDeselection.current = true;
    } else if (
      currentProviderTypes.length === 0 &&
      previousProviderTypes.current.length === 0
    ) {
      isManualDeselection.current = false;
    }

    // Update references
    previousProviders.current = currentProviders;
    previousProviderTypes.current = currentProviderTypes;

    // Handle scan selection logic
    if (enableScanRelation && scanParam) {
      const scanProviderId = getScanProvider(scanParam);
      const scanProviderType = getScanProviderType(scanParam);

      const shouldDeselectScan =
        (scanProviderId &&
          (deselectedProviders.includes(scanProviderId) ||
            (currentProviders.length > 0 &&
              !currentProviders.includes(scanProviderId)))) ||
        (scanProviderType &&
          !isManualDeselection.current &&
          (deselectedProviderTypes.includes(scanProviderType) ||
            (currentProviderTypes.length > 0 &&
              !currentProviderTypes.includes(scanProviderType))));

      if (shouldDeselectScan) {
        updateFilter(FilterType.SCAN, null);
        // } else {
        //   // Add provider if not already selected
        //   if (scanProviderId && !currentProviders.includes(scanProviderId)) {
        //     updateFilter(FilterType.PROVIDER_UID, [
        //       ...currentProviders,
        //       scanProviderId,
        //     ]);
        //   }

        //   // Only add provider type if there are none selected
        //   if (
        //     scanProviderType &&
        //     currentProviderTypes.length === 0 &&
        //     !isManualDeselection.current
        //   ) {
        //     updateFilter(FilterType.PROVIDER_TYPE, [scanProviderType]);
        //   }
      }
    }

    // // Handle provider selection logic
    // if (
    //   currentProviders.length > 0 &&
    //   deselectedProviders.length === 0 &&
    //   !isManualDeselection.current
    // ) {
    //   const providerTypes = currentProviders
    //     .map(getProviderType)
    //     .filter((type): type is ProviderType => type !== null);
    //   const selectedProviderTypes = Array.from(new Set(providerTypes));

    //   if (
    //     selectedProviderTypes.length > 0 &&
    //     currentProviderTypes.length === 0
    //   ) {
    //     updateFilter(FilterType.PROVIDER_TYPE, selectedProviderTypes);
    //   }
    // }

    // Update available providers
    if (currentProviderTypes.length > 0) {
      const filteredProviders = providers.filter((key) => {
        const providerType = getProviderType(key);
        return providerType && currentProviderTypes.includes(providerType);
      });
      setAvailableProviders(filteredProviders);

      const validProviders = currentProviders.filter((key) => {
        const providerType = getProviderType(key);
        return providerType && currentProviderTypes.includes(providerType);
      });

      if (validProviders.length !== currentProviders.length) {
        updateFilter(
          providerFilterType,
          validProviders.length > 0 ? validProviders : null,
        );
      }
    } else {
      setAvailableProviders(providers);
    }

    // Update available scans
    if (enableScanRelation) {
      if (currentProviders.length > 0 || currentProviderTypes.length > 0) {
        const filteredScans = completedScanIds.filter((scanId) => {
          const scanProviderId = getScanProvider(scanId);
          const scanProviderType = getScanProviderType(scanId);

          return (
            (currentProviders.length === 0 ||
              (scanProviderId && currentProviders.includes(scanProviderId))) &&
            (currentProviderTypes.length === 0 ||
              (scanProviderType &&
                currentProviderTypes.includes(scanProviderType)))
          );
        });
        setAvailableScans(filteredScans);
      } else {
        setAvailableScans(completedScanIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return {
    availableProviderIds: providerIds.length > 0 ? availableProviders : [],
    availableProviderUIDs: providerUIDs.length > 0 ? availableProviders : [],
    availableScans,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: use-sidebar.ts]---
Location: prowler-master/ui/hooks/use-sidebar.ts

```typescript
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarSettings = { disabled: boolean; isHoverOpen: boolean };
type SidebarStore = {
  isOpen: boolean;
  isHover: boolean;
  settings: SidebarSettings;
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsHover: (isHover: boolean) => void;
  getOpenState: () => boolean;
};

export const useSidebar = create(
  persist<SidebarStore>(
    (set, get) => ({
      isOpen: true,
      isHover: false,
      settings: { disabled: false, isHoverOpen: false },
      toggleOpen: () => {
        set({ isOpen: !get().isOpen });
      },
      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },
      setIsHover: (isHover: boolean) => {
        set({ isHover });
      },
      getOpenState: () => {
        const state = get();
        return state.isOpen || (state.settings.isHoverOpen && state.isHover);
      },
    }),
    {
      name: "sidebar",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
```

--------------------------------------------------------------------------------

---[FILE: use-store.ts]---
Location: prowler-master/ui/hooks/use-store.ts
Signals: React

```typescript
import { useEffect, useState } from "react";
/**
 * This hook fix hydration when use persist to save hook data to localStorage
 */
export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
```

--------------------------------------------------------------------------------

---[FILE: use-url-filters.ts]---
Location: prowler-master/ui/hooks/use-url-filters.ts
Signals: React, Next.js

```typescript
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook to handle URL filters and automatically reset
 * pagination when filters change.
 */
export const useUrlFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateFilter = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString());

      const filterKey = key.startsWith("filter[") ? key : `filter[${key}]`;

      const currentValue = params.get(filterKey);
      const nextValue = Array.isArray(value)
        ? value.length > 0
          ? value.join(",")
          : null
        : value === null
          ? null
          : value;

      // If effective value is unchanged, do nothing (avoids redundant fetches)
      if (currentValue === nextValue) return;

      // Only reset page to 1 if page parameter already exists
      if (params.has("page")) {
        params.set("page", "1");
      }

      if (nextValue === null) {
        params.delete(filterKey);
      } else {
        params.set(filterKey, nextValue);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  const clearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const filterKey = key.startsWith("filter[") ? key : `filter[${key}]`;

      params.delete(filterKey);

      // Only reset page to 1 if page parameter already exists
      if (params.has("page")) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, pathname],
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith("filter[") || key === "sort") {
        params.delete(key);
      }
    });

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const hasFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    return Array.from(params.keys()).some(
      (key) => key.startsWith("filter[") || key === "sort",
    );
  }, [searchParams]);

  return {
    updateFilter,
    clearFilter,
    clearAllFilters,
    hasFilters,
  };
};
```

--------------------------------------------------------------------------------

---[FILE: categories.ts]---
Location: prowler-master/ui/lib/categories.ts

```typescript
/**
 * Special cases that don't follow standard capitalization rules.
 * Add entries here for edge cases that heuristics can't handle.
 */
const SPECIAL_CASES: Record<string, string> = {
  // Add special cases here if needed, e.g.:
  // "someweirdcase": "SomeWeirdCase",
};

/**
 * Converts a category ID to a human-readable label.
 *
 * Capitalization rules (in order of priority):
 * 1. Special cases dictionary - for edge cases that don't follow patterns
 * 2. Acronym + version pattern (e.g., imdsv1 -> IMDSv1, apiv2 -> APIv2)
 * 3. Short words (≤3 chars) - fully capitalized (e.g., iam -> IAM, ec2 -> EC2)
 * 4. Default - capitalize first letter (e.g., internet -> Internet)
 *
 * Examples:
 * - "internet-exposed" -> "Internet Exposed"
 * - "iam" -> "IAM"
 * - "ec2-imdsv1" -> "EC2 IMDSv1"
 * - "forensics-ready" -> "Forensics Ready"
 */
export function getCategoryLabel(id: string): string {
  return id
    .split("-")
    .map((word) => formatWord(word))
    .join(" ");
}

function formatWord(word: string): string {
  const lowerWord = word.toLowerCase();

  // 1. Check special cases dictionary
  if (lowerWord in SPECIAL_CASES) {
    return SPECIAL_CASES[lowerWord];
  }

  // 2. Acronym + version pattern (e.g., imdsv1 -> IMDSv1)
  const versionMatch = lowerWord.match(/^([a-z]+)(v\d+)$/);
  if (versionMatch) {
    const [, acronym, version] = versionMatch;
    return acronym.toUpperCase() + version.toLowerCase();
  }

  // 3. Short words are likely acronyms (IAM, EC2, S3, API, VPC, etc.)
  if (word.length <= 3) {
    return word.toUpperCase();
  }

  // 4. Default: capitalize first letter
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
```

--------------------------------------------------------------------------------

````
