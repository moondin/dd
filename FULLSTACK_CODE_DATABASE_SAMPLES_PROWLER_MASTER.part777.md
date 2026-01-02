---
source_txt: fullstack_samples/prowler-master
converted_utc: 2025-12-18T11:26:15Z
part: 777
parts_total: 867
---

# FULLSTACK CODE DATABASE SAMPLES prowler-master

## Verbatim Content (Part 777 of 867)

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

---[FILE: postcss.config.js]---
Location: prowler-master/ui/postcss.config.js

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: prowler-master/ui/README.md

```text
# Description

This repository hosts the UI component for Prowler, providing a user-friendly web interface to interact seamlessly with Prowler's features.


## 🚀 Production deployment
### Docker deployment
#### Clone the repository
```console
# HTTPS
git clone https://github.com/prowler-cloud/ui.git

# SSH
git clone git@github.com:prowler-cloud/ui.git

```
#### Build the Docker image
```bash
docker build -t prowler-cloud/ui . --target prod
```
#### Run the Docker container
```bash
docker run -p 3000:3000 prowler-cloud/ui
```

### Local deployment
#### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/ui.git

# SSH
git clone git@github.com:prowler-cloud/ui.git

```

#### Build the project

```bash
pnpm run build
```

#### Run the production server

```bash
pnpm start
```

## 🧪 Development deployment
### Docker deployment
#### Clone the repository
```console
# HTTPS
git clone https://github.com/prowler-cloud/ui.git

# SSH
git clone git@github.com:prowler-cloud/ui.git

```
#### Build the Docker image
```bash
docker build -t prowler-cloud/ui . --target dev
```
#### Run the Docker container
```bash
docker run -p 3000:3000 prowler-cloud/ui
```

### Local deployment
#### Clone the repository

```console
# HTTPS
git clone https://github.com/prowler-cloud/ui.git

# SSH
git clone git@github.com:prowler-cloud/ui.git

```

#### Install dependencies

```bash
pnpm install
```

**Note:** The `pnpm install` command will automatically configure Git hooks for code quality checks. If you experience issues, you can manually configure them:

```bash
git config core.hooksPath "ui/.husky"
```

#### Run the development server

```bash
pnpm run dev
```

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## Git Hooks & Code Review

This project uses Git hooks to maintain code quality. When you commit changes to TypeScript/JavaScript files, the pre-commit hook can optionally validate them against our coding standards using Claude Code.

### Enabling Code Review

To enable automatic code review on commits, add this to your `.env` file in the project root:

```bash
CODE_REVIEW_ENABLED=true
```

When enabled, the hook will:
- ✅ Validate your staged changes against `AGENTS.md` standards
- ✅ Check for common issues (any types, incorrect imports, styling violations, etc.)
- ✅ Block commits that don't comply with the standards
- ✅ Provide helpful feedback on how to fix issues

### Disabling Code Review

To disable code review (faster commits, useful for quick iterations):

```bash
CODE_REVIEW_ENABLED=false
```

Or remove the variable from your `.env` file.

### Requirements

- [Claude Code CLI](https://github.com/anthropics/claude-code) installed and authenticated
- `.env` file in the project root with `CODE_REVIEW_ENABLED` set

### Troubleshooting

If hooks aren't running after commits:

```bash
# Verify hooks are configured
git config --get core.hooksPath  # Should output: ui/.husky

# Reconfigure if needed
git config core.hooksPath "ui/.husky"
```
```

--------------------------------------------------------------------------------

---[FILE: tailwind.config.js]---
Location: prowler-master/ui/tailwind.config.js

```javascript
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,jsx,tsx}",
    "./app/**/*.{ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "!./docs/**/*",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      colors: {
        prowler: {
          theme: {
            pale: "#f3fcff",
            green: "#8ce112",
            purple: "#5001d0",
            orange: "#f69000",
            yellow: "#ffdf16",
          },
          blue: {
            800: "#1e293bff",
            400: "#1A202C",
          },
          grey: {
            medium: "#353a4d",
            light: "#868994",
            600: "#64748b",
          },
          green: {
            DEFAULT: "#9FD655",
            medium: "#09BF3D",
          },
          black: {
            DEFAULT: "#000",
            900: "#18181A",
          },
          white: {
            DEFAULT: "#FFF",
            900: "#18181A",
          },
        },
        system: {
          success: {
            DEFAULT: "#09BF3D",
            medium: "#3CEC6D",
            light: "#B5FDC8",
            lighter: "#D9FFE3",
          },
          error: {
            DEFAULT: "#E11D48",
            medium: "#FB718F",
            light: "#FECDD8",
            lighter: "#FFE4EA",
          },
          info: {
            DEFAULT: "#7C3AED",
            medium: "#B48BFA",
            light: "#E5D6FE",
            lighter: "#F1E9FE",
          },
          warning: {
            DEFAULT: "#FBBF24",
            medium: "#FDDD8A",
            light: "#feefc7",
            lighter: "#FFF9EB",
          },
          severity: {
            critical: "#AC1954",
            high: "#F31260",
            medium: "#FA7315",
            low: "#fcd34d",
          },
        },
        danger: "#E11D48",
        action: "#9FD655",
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out 0s 1 normal forwards running",
        "fade-out": "fade-out 200ms ease-in 0s 1 normal forwards running",
        expand: "expand 400ms linear 0s 1 normal forwards running",
        "slide-in": "slide-in 400ms linear 0s 1 normal forwards running",
        "slide-out": "slide-out 400ms linear 0s 1 normal forwards running",
        collapse: "collapse 400ms linear 0s 1 normal forwards running",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        advance: { from: { width: 0 }, to: { width: "100%" } },
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "fade-out": { from: { opacity: 1 }, to: { opacity: 0 } },
        "slide-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        woosh: {
          "0, 10%": { left: 0, right: "100%" },
          "40%, 60%": { left: 0, right: 0 },
          "90%, 100%": { left: "100%", right: 0 },
        },
        lineAnim: {
          "0%": { left: "-40%" },
          "50%": { left: "20%", width: "80%" },
          "100%": { left: "100%", width: "100%" },
        },
        dropArrow: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        first: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        second: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        third: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "drop-arrow": "dropArrow 0.6s ease-out infinite",
        first: "first 20s linear infinite",
        second: "second 30s linear infinite",
        third: "third 25s linear infinite",
      },
      screens: {
        "3xl": "1920px", // Add breakpoint to optimize layouts for large screens.
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#6ee7b7",
              foreground: "#000000",
            },
            focus: "#6ee7b7",
            background: "#09090B",
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#6ee7b7",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: prowler-master/ui/tsconfig.json
Signals: Next.js

```json
{
  "compilerOptions": {
    "allowJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ],
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "es5"
  },
  "exclude": ["node_modules"],
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "images.d.ts"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: pre-commit]---
Location: prowler-master/ui/.husky/pre-commit

```text
#!/bin/bash

# Prowler UI - Pre-Commit Hook
# Optionally validates ONLY staged files against AGENTS.md standards using Claude Code
# Controlled by CODE_REVIEW_ENABLED in .env

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Prowler UI - Pre-Commit Hook"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Load .env file (look in git root directory)
GIT_ROOT=$(git rev-parse --show-toplevel)
if [ -f "$GIT_ROOT/ui/.env" ]; then
  CODE_REVIEW_ENABLED=$(grep "^CODE_REVIEW_ENABLED" "$GIT_ROOT/ui/.env" | cut -d'=' -f2 | tr -d ' ')
elif [ -f "$GIT_ROOT/.env" ]; then
  CODE_REVIEW_ENABLED=$(grep "^CODE_REVIEW_ENABLED" "$GIT_ROOT/.env" | cut -d'=' -f2 | tr -d ' ')
elif [ -f ".env" ]; then
  CODE_REVIEW_ENABLED=$(grep "^CODE_REVIEW_ENABLED" .env | cut -d'=' -f2 | tr -d ' ')
else
  CODE_REVIEW_ENABLED="false"
fi

# Normalize the value to lowercase
CODE_REVIEW_ENABLED=$(echo "$CODE_REVIEW_ENABLED" | tr '[:upper:]' '[:lower:]')

echo -e "${BLUE}ℹ️  Code Review Status: ${CODE_REVIEW_ENABLED}${NC}"
echo ""

# Get staged files (what will be committed)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx?|jsx?)$' || true)

if [ "$CODE_REVIEW_ENABLED" = "true" ]; then
  if [ -z "$STAGED_FILES" ]; then
    echo -e "${YELLOW}⚠️  No TypeScript/JavaScript files staged to validate${NC}"
    echo ""
  else
    echo -e "${YELLOW}🔍 Running Claude Code standards validation...${NC}"
    echo ""
    echo -e "${BLUE}📋 Files to validate:${NC}"
    echo "$STAGED_FILES" | while IFS= read -r file; do echo "  - $file"; done
    echo ""

    echo -e "${BLUE}📤 Sending to Claude Code for validation...${NC}"
    echo ""

    # Build prompt with full file contents
    VALIDATION_PROMPT=$(
      cat <<'PROMPT_EOF'
You are a code reviewer for the Prowler UI project. Analyze the full file contents of changed files below and validate they comply with AGENTS.md standards.

**RULES TO CHECK:**
1. React Imports: NO `import * as React` or `import React, {` → Use `import { useState }`
2. TypeScript: NO union types like `type X = "a" | "b"` → Use const-based: `const X = {...} as const`
3. Tailwind: NO `var()` or hex colors in className → Use Tailwind utilities and semantic color classes. Exception: `var()` is allowed when passing colors to chart/graph components that require CSS color strings (not Tailwind classes) for their APIs.
4. cn(): Use for merging multiple classes or for conditionals (handles Tailwind conflicts with twMerge) → `cn(BUTTON_STYLES.base, BUTTON_STYLES.active, isLoading && "opacity-50")`
5. React 19: NO `useMemo`/`useCallback` without reason
6. Zod v4: Use `.min(1)` not `.nonempty()`, `z.email()` not `z.string().email()`. All inputs must be validated with Zod.
7. File Org: 1 feature = local, 2+ features = shared
8. Directives: Server Actions need "use server", clients need "use client"
9. Implement DRY, KISS principles. (example: reusable components, avoid repetition)
10. Layout must work for all the responsive breakpoints (mobile, tablet, desktop)
11. ANY types cannot be used - CRITICAL: Check for `: any` in all visible lines
12. Use the components inside components/shadcn if possible
13. Check Accessibility best practices (like alt tags in images, semantic HTML, Aria labels, etc.)

=== FILES TO REVIEW ===
PROMPT_EOF
    )

    # Add full file contents for each staged file
    for file in $STAGED_FILES; do
      VALIDATION_PROMPT="$VALIDATION_PROMPT

=== FILE: $file ===
$(cat "$file" 2>/dev/null || echo "Error reading file")"
    done

    VALIDATION_PROMPT="$VALIDATION_PROMPT

=== END FILES ===

**IMPORTANT: Your response MUST start with exactly one of these lines:**
STATUS: PASSED
STATUS: FAILED

**If FAILED:** List each violation with File, Line Number, Rule Number, and Issue.
**If PASSED:** Confirm all files comply with AGENTS.md standards.

**Start your response now with STATUS:**"

    # Send to Claude Code
    if VALIDATION_OUTPUT=$(echo "$VALIDATION_PROMPT" | claude 2>&1); then
      echo "$VALIDATION_OUTPUT"
      echo ""

      # Check result - STRICT MODE: fail if status unclear
      if echo "$VALIDATION_OUTPUT" | grep -q "^STATUS: PASSED"; then
        echo ""
        echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
        echo ""
      elif echo "$VALIDATION_OUTPUT" | grep -q "^STATUS: FAILED"; then
        echo ""
        echo -e "${RED}❌ VALIDATION FAILED${NC}"
        echo -e "${RED}Fix violations before committing${NC}"
        echo ""
        exit 1
      else
        echo ""
        echo -e "${RED}❌ VALIDATION ERROR${NC}"
        echo -e "${RED}Could not determine validation status from Claude Code response${NC}"
        echo -e "${YELLOW}Response must start with 'STATUS: PASSED' or 'STATUS: FAILED'${NC}"
        echo ""
        echo -e "${YELLOW}To bypass validation temporarily, set CODE_REVIEW_ENABLED=false in .env${NC}"
        echo ""
        exit 1
      fi
    else
      echo -e "${YELLOW}⚠️  Claude Code not available${NC}"
    fi
    echo ""
  fi
else
  echo -e "${YELLOW}⏭️  Code review disabled (CODE_REVIEW_ENABLED=false)${NC}"
  echo ""
fi

# Run healthcheck (typecheck and lint check)
echo -e "${BLUE}🏥 Running healthcheck...${NC}"
echo ""

cd ui || cd .
if pnpm run healthcheck; then
  echo ""
  echo -e "${GREEN}✅ Healthcheck passed${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Healthcheck failed${NC}"
  echo -e "${RED}Fix type errors and linting issues before committing${NC}"
  echo ""
  exit 1
fi

# Run build
echo -e "${BLUE}🔨 Running build...${NC}"
echo ""

if pnpm run build; then
  echo ""
  echo -e "${GREEN}✅ Build passed${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Build failed${NC}"
  echo -e "${RED}Fix build errors before committing${NC}"
  echo ""
  exit 1
fi
```

--------------------------------------------------------------------------------

---[FILE: settings.json]---
Location: prowler-master/ui/.vscode/settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.printWidth": 80,
  "prettier.tabWidth": 2,
  "prettier.useTabs": false,
  "prettier.singleQuote": false,
  "prettier.trailingComma": "all",
  "prettier.semi": true,
  "prettier.bracketSpacing": true
}
```

--------------------------------------------------------------------------------

---[FILE: api-keys.adapter.ts]---
Location: prowler-master/ui/actions/api-keys/api-keys.adapter.ts

```typescript
import {
  ApiKeyResponse,
  EnrichedApiKey,
} from "@/components/users/profile/api-keys/types";
import { getApiKeyUserEmail } from "@/components/users/profile/api-keys/utils";
import { MetaDataProps } from "@/types";

/**
 * Adapts the raw API response to enriched API keys with metadata
 * - Resolves user email from included resources
 * - Co-locates data for better performance
 * - Preserves pagination metadata
 *
 * @param response - Raw API response with data and included resources
 * @returns Object with enriched API keys and metadata
 */
export function adaptApiKeysResponse(response: ApiKeyResponse | undefined): {
  data: EnrichedApiKey[];
  metadata?: MetaDataProps;
} {
  if (!response?.data) {
    return { data: [] };
  }

  const enrichedData = response.data.map((key) => ({
    ...key,
    userEmail: getApiKeyUserEmail(key, response.included),
  }));

  // Transform meta to MetaDataProps format if pagination exists
  const metadata: MetaDataProps | undefined = response.meta?.pagination
    ? {
        pagination: {
          page: response.meta.pagination.page,
          pages: response.meta.pagination.pages,
          count: response.meta.pagination.count,
          itemsPerPage: [10, 25, 50, 100],
        },
        version: "1.0",
      }
    : undefined;

  return { data: enrichedData, metadata };
}
```

--------------------------------------------------------------------------------

---[FILE: api-keys.ts]---
Location: prowler-master/ui/actions/api-keys/api-keys.ts
Signals: Next.js

```typescript
"use server";

import { revalidateTag } from "next/cache";

import {
  ApiKeyResponse,
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  SingleApiKeyResponse,
  UpdateApiKeyPayload,
} from "@/components/users/profile/api-keys/types";
import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiError, handleApiResponse } from "@/lib/server-actions-helper";

import { adaptApiKeysResponse } from "./api-keys.adapter";

interface GetApiKeysParams {
  page?: number;
  pageSize?: number;
  sort?: string;
}

/**
 * Fetches API keys for the current tenant with pagination support
 * Returns enriched API keys with user data already resolved and pagination metadata
 */
export const getApiKeys = async (params?: GetApiKeysParams) => {
  const { page = 1, pageSize = 10, sort } = params || {};

  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/api-keys`);
  url.searchParams.set("include", "entity.roles");
  url.searchParams.set("page[number]", page.toString());
  url.searchParams.set("page[size]", pageSize.toString());

  if (sort) {
    url.searchParams.set("sort", sort);
  }

  try {
    const response = await fetch(url.toString(), {
      headers,
      next: { tags: ["api-keys"] },
    });

    const apiResponse = (await handleApiResponse(response)) as ApiKeyResponse;

    return adaptApiKeysResponse(apiResponse);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { data: [], metadata: undefined };
  }
};

/**
 * Creates a new API key
 * IMPORTANT: The full API key is only returned in this response, it cannot be retrieved again
 */
export const createApiKey = async (
  payload: CreateApiKeyPayload,
): Promise<
  | { data: CreateApiKeyResponse; error?: never }
  | { data?: never; error: string }
> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/api-keys`);

  const body = {
    data: {
      type: "api-keys",
      attributes: {
        name: payload.name,
        ...(payload.expires_at && { expires_at: payload.expires_at }),
      },
    },
  };

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const data = (await handleApiResponse(response)) as CreateApiKeyResponse;

    // Revalidate the api-keys list
    revalidateTag("api-keys");

    return { data };
  } catch (error) {
    console.error("Error creating API key:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create API key",
    };
  }
};

/**
 * Updates an API key (only the name can be updated)
 */
export const updateApiKey = async (
  id: string,
  payload: UpdateApiKeyPayload,
): Promise<
  | { data: SingleApiKeyResponse; error?: never }
  | { data?: never; error: string }
> => {
  const headers = await getAuthHeaders({ contentType: true });
  const url = new URL(`${apiBaseUrl}/api-keys/${id}`);

  const body = {
    data: {
      type: "api-keys",
      id,
      attributes: {
        name: payload.name,
      },
    },
  };

  try {
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    const data = (await handleApiResponse(response)) as SingleApiKeyResponse;

    // Revalidate the api-keys list
    revalidateTag("api-keys");

    return { data };
  } catch (error) {
    console.error("Error updating API key:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to update API key",
    };
  }
};

/**
 * Revokes an API key (cannot be undone)
 */
export const revokeApiKey = async (
  id: string,
): Promise<{ error?: string; success?: boolean }> => {
  const headers = await getAuthHeaders({ contentType: false });
  const url = new URL(`${apiBaseUrl}/api-keys/${id}/revoke`);

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = handleApiError(response);
      return { error: errorData.error };
    }

    // Revalidate the api-keys list
    revalidateTag("api-keys");

    return { success: true };
  } catch (error) {
    console.error("Error revoking API key:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to revoke API key",
    };
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/api-keys/index.ts

```typescript
export * from "./api-keys";
export * from "./api-keys.adapter";
```

--------------------------------------------------------------------------------

---[FILE: auth.ts]---
Location: prowler-master/ui/actions/auth/auth.ts

```typescript
"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth.config";
import { apiBaseUrl } from "@/lib";
import { addAuthEvent } from "@/lib/sentry-breadcrumbs";
import type { SignInFormData, SignUpFormData } from "@/types";

export async function authenticate(
  prevState: unknown,
  formData: SignInFormData,
) {
  try {
    addAuthEvent("login", { email: formData.email });
    await signIn("credentials", {
      ...formData,
      redirect: false,
    });
    return {
      message: "Success",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      addAuthEvent("error", { type: error.type });
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Credentials error",
            errors: {
              credentials: "Invalid email or password",
            },
          };
        case "CallbackRouteError":
          return {
            message: error.cause?.err?.message,
          };
        default:
          return {
            message: "Unknown error",
            errors: {
              unknown: "Unknown error",
            },
          };
      }
    }
  }
}

export const createNewUser = async (formData: SignUpFormData) => {
  const url = new URL(`${apiBaseUrl}/users`);

  if (formData.invitationToken) {
    url.searchParams.append("invitation_token", formData.invitationToken);
  }

  const bodyData = {
    data: {
      type: "users",
      attributes: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        ...(formData.company && { company_name: formData.company }),
      },
    },
  };

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify(bodyData),
    });

    const parsedResponse = await response.json();
    if (!response.ok) {
      return parsedResponse;
    }

    return parsedResponse;
  } catch (error) {
    return {
      errors: [
        {
          source: { pointer: "" },
          detail: "Network error or server is unreachable",
        },
      ],
    };
  }
};

export const getToken = async (formData: SignInFormData) => {
  const url = new URL(`${apiBaseUrl}/tokens`);

  const bodyData = {
    data: {
      type: "tokens",
      attributes: {
        email: formData.email,
        password: formData.password,
      },
    },
  };

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) return null;

    const parsedResponse = await response.json();

    const accessToken = parsedResponse.data.attributes.access;
    const refreshToken = parsedResponse.data.attributes.refresh;
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new Error("Error in trying to get token");
  }
};

export const getUserByMe = async (accessToken: string) => {
  const url = new URL(`${apiBaseUrl}/users/me?include=roles`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/vnd.api+json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const parsedResponse = await response.json();
    if (!response.ok) {
      // Handle different HTTP error codes
      switch (response.status) {
        case 401:
          throw new Error("Invalid or expired token");
        case 403:
          throw new Error(parsedResponse.errors?.[0]?.detail);
        case 404:
          throw new Error("User not found");
        default:
          throw new Error(
            parsedResponse.errors?.[0]?.detail || "Unknown error",
          );
      }
    }

    const userRole = parsedResponse.included?.find(
      (item: any) => item.type === "roles",
    );

    const permissions = {
      manage_users: userRole.attributes.manage_users || false,
      manage_account: userRole.attributes.manage_account || false,
      manage_providers: userRole.attributes.manage_providers || false,
      manage_scans: userRole.attributes.manage_scans || false,
      manage_integrations: userRole.attributes.manage_integrations || false,
      manage_billing: userRole.attributes.manage_billing || false,
      unlimited_visibility: userRole.attributes.unlimited_visibility || false,
    };

    return {
      name: parsedResponse.data.attributes.name,
      email: parsedResponse.data.attributes.email,
      company: parsedResponse.data.attributes.company_name,
      dateJoined: parsedResponse.data.attributes.date_joined,
      permissions,
    };
  } catch (error: any) {
    throw new Error(error.message || "Network error or server unreachable");
  }
};

export async function logOut() {
  await signOut();
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/auth/index.ts

```typescript
export * from "./auth";
```

--------------------------------------------------------------------------------

---[FILE: compliances.adapter.ts]---
Location: prowler-master/ui/actions/compliances/compliances.adapter.ts

```typescript
import { getComplianceIcon } from "@/components/icons/compliance/IconCompliance";
import { MetaDataProps } from "@/types";

import {
  ComplianceOverviewsResponse,
  EnrichedComplianceOverview,
} from "./types";

export type { ComplianceOverviewsResponse, EnrichedComplianceOverview };

/**
 * Formats framework name for display by replacing hyphens with spaces
 * e.g., "FedRAMP-20x-KSI-Low" -> "FedRAMP 20x KSI Low"
 */
function formatFrameworkName(framework: string): string {
  return framework.replace(/-/g, " ");
}

/**
 * Adapts the raw API response to enriched compliance data
 * - Computes score percentage (rounded)
 * - Formats label (framework + version)
 * - Resolves framework icon
 * - Preserves pagination metadata
 *
 * @param response - Raw API response with data and optional pagination
 * @returns Object with enriched compliance data and metadata
 */
export function adaptComplianceOverviewsResponse(
  response: ComplianceOverviewsResponse | undefined,
): {
  data: EnrichedComplianceOverview[];
  metadata?: MetaDataProps;
} {
  if (!response?.data) {
    return { data: [] };
  }

  const enrichedData = response.data.map((compliance) => {
    const { id, attributes } = compliance;
    const {
      framework,
      version,
      requirements_passed,
      requirements_failed,
      requirements_manual,
      total_requirements,
    } = attributes;

    const totalRequirements = Number(total_requirements) || 0;
    const passedRequirements = Number(requirements_passed) || 0;

    const score =
      totalRequirements > 0
        ? Math.round((passedRequirements / totalRequirements) * 100)
        : 0;

    const formattedFramework = formatFrameworkName(framework);
    const label = version
      ? `${formattedFramework} - ${version}`
      : formattedFramework;
    const icon = getComplianceIcon(framework);

    return {
      id,
      framework,
      version,
      requirements_passed,
      requirements_failed,
      requirements_manual,
      total_requirements,
      score,
      label,
      icon,
    };
  });

  const metadata: MetaDataProps | undefined = response.meta?.pagination
    ? {
        pagination: {
          page: response.meta.pagination.page,
          pages: response.meta.pagination.pages,
          count: response.meta.pagination.count,
          itemsPerPage: [10, 25, 50, 100],
        },
        version: "1.0",
      }
    : undefined;

  return { data: enrichedData, metadata };
}

/**
 * Sorts compliances for watchlist display:
 * - Excludes ProwlerThreatScore
 * - Sorted by score ascending (worst/lowest scores first)
 * - Limited to specified count
 *
 * @param data - Enriched compliance data
 * @param limit - Maximum number of items to return (default: 9)
 * @returns Sorted and limited compliance data
 */
export function sortCompliancesForWatchlist(
  data: EnrichedComplianceOverview[],
  limit: number = 9,
): EnrichedComplianceOverview[] {
  return [...data]
    .filter((item) => item.framework !== "ProwlerThreatScore")
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}
```

--------------------------------------------------------------------------------

---[FILE: compliances.ts]---
Location: prowler-master/ui/actions/compliances/compliances.ts

```typescript
"use server";

import { apiBaseUrl, getAuthHeaders } from "@/lib";
import { handleApiResponse } from "@/lib/server-actions-helper";

export const getCompliancesOverview = async ({
  scanId,
  region,
  query,
  filters = {},
}: {
  scanId?: string;
  region?: string | string[];
  query?: string;
  filters?: Record<string, string | string[] | undefined>;
} = {}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/compliance-overviews`);

  const setParam = (key: string, value?: string | string[]) => {
    if (!value) return;

    const serializedValue = Array.isArray(value) ? value.join(",") : value;
    if (serializedValue.trim().length > 0) {
      url.searchParams.set(key, serializedValue);
    }
  };

  Object.entries(filters).forEach(([key, value]) => setParam(key, value));

  setParam("filter[scan_id]", scanId);
  setParam("filter[region__in]", region);
  if (query) url.searchParams.set("filter[search]", query);

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching compliances overview:", error);
    return undefined;
  }
};

export const getComplianceOverviewMetadataInfo = async ({
  query = "",
  sort = "",
  filters = {},
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  const url = new URL(`${apiBaseUrl}/compliance-overviews/metadata`);

  if (query) url.searchParams.append("filter[search]", query);
  if (sort) url.searchParams.append("sort", sort);

  Object.entries(filters).forEach(([key, value]) => {
    // Define filters to exclude and check for valid values
    if (key !== "filter[search]" && value && String(value).trim() !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching compliance overview metadata info:", error);
    return undefined;
  }
};

export const getComplianceAttributes = async (complianceId: string) => {
  const headers = await getAuthHeaders({ contentType: false });

  try {
    const url = new URL(`${apiBaseUrl}/compliance-overviews/attributes`);
    url.searchParams.append("filter[compliance_id]", complianceId);

    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching compliance attributes:", error);
    return undefined;
  }
};

export const getComplianceRequirements = async ({
  complianceId,
  scanId,
  region,
}: {
  complianceId: string;
  scanId: string;
  region?: string | string[];
}) => {
  const headers = await getAuthHeaders({ contentType: false });

  try {
    const url = new URL(`${apiBaseUrl}/compliance-overviews/requirements`);
    url.searchParams.append("filter[compliance_id]", complianceId);
    url.searchParams.append("filter[scan_id]", scanId);

    if (region) {
      const regionValue = Array.isArray(region) ? region.join(",") : region;
      url.searchParams.append("filter[region__in]", regionValue);
      //remove page param
    }
    url.searchParams.delete("page");

    const response = await fetch(url.toString(), {
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching compliance requirements:", error);
    return undefined;
  }
};
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: prowler-master/ui/actions/compliances/index.ts

```typescript
export * from "./compliances";
export * from "./compliances.adapter";
export type {
  ComplianceOverviewsResponse,
  EnrichedComplianceOverview,
} from "./types";
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: prowler-master/ui/actions/compliances/types.ts
Signals: Next.js

```typescript
import { StaticImageData } from "next/image";

import { ComplianceOverviewData } from "@/types/compliance";

/**
 * Raw API response from /compliance-overviews endpoint
 */
export interface ComplianceOverviewsResponse {
  data: ComplianceOverviewData[];
  meta?: {
    pagination?: {
      page: number;
      pages: number;
      count: number;
    };
  };
}

/**
 * Enriched compliance overview with computed fields
 */
export interface EnrichedComplianceOverview {
  id: string;
  framework: string;
  version: string;
  requirements_passed: number;
  requirements_failed: number;
  requirements_manual: number;
  total_requirements: number;
  score: number;
  label: string;
  icon: string | StaticImageData | undefined;
}
```

--------------------------------------------------------------------------------

````
