---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:36Z
part: 443
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 443 of 933)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - sim-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/sim-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: session-provider.tsx]---
Location: sim-main/apps/sim/app/_shell/providers/session-provider.tsx
Signals: React

```typescript
'use client'

import type React from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import posthog from 'posthog-js'
import { client } from '@/lib/auth/auth-client'

export type AppSession = {
  user: {
    id: string
    email: string
    emailVerified?: boolean
    name?: string | null
    image?: string | null
    createdAt?: Date
    updatedAt?: Date
  } | null
  session?: {
    id?: string
    userId?: string
    activeOrganizationId?: string
  }
} | null

export type SessionHookResult = {
  data: AppSession
  isPending: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const SessionContext = createContext<SessionHookResult | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppSession>(null)
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const loadSession = useCallback(async () => {
    try {
      setIsPending(true)
      setError(null)
      const res = await client.getSession()
      setData(res?.data ?? null)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch session'))
    } finally {
      setIsPending(false)
    }
  }, [])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  useEffect(() => {
    if (isPending || typeof posthog.identify !== 'function') {
      return
    }

    try {
      if (data?.user) {
        posthog.identify(data.user.id, {
          email: data.user.email,
          name: data.user.name,
          email_verified: data.user.emailVerified,
          created_at: data.user.createdAt,
        })
      } else {
        posthog.reset()
      }
    } catch {}
  }, [data, isPending])

  const value = useMemo<SessionHookResult>(
    () => ({ data, isPending, error, refetch: loadSession }),
    [data, isPending, error, loadSession]
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
```

--------------------------------------------------------------------------------

---[FILE: theme-provider.tsx]---
Location: sim-main/apps/sim/app/_shell/providers/theme-provider.tsx
Signals: Next.js

```typescript
'use client'

import { usePathname } from 'next/navigation'
import type { ThemeProviderProps } from 'next-themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()

  // Force light mode on public/marketing pages, dark mode everywhere else
  const isLightModePage =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/sso') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/invite') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/careers') ||
    pathname.startsWith('/changelog') ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/studio')

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={false}
      disableTransitionOnChange
      storageKey='sim-theme'
      forcedTheme={isLightModePage ? 'light' : 'dark'}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: globals.css]---
Location: sim-main/apps/sim/app/_styles/globals.css

```text
@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * CSS-based sidebar and panel widths to prevent SSR hydration mismatches.
 * Default widths are set here and updated via blocking script before React hydrates.
 */
:root {
  --sidebar-width: 232px;
  --panel-width: 244px;
  --toolbar-triggers-height: 300px;
  --editor-connections-height: 200px;
  --terminal-height: 196px;
}

.sidebar-container {
  width: var(--sidebar-width);
}

.panel-container {
  width: var(--panel-width);
}

.terminal-container {
  height: var(--terminal-height);
}

/**
 * Workflow component z-index fixes and background colors
 */
.workflow-container .react-flow__edges {
  z-index: 0 !important;
}

.workflow-container .react-flow__node {
  z-index: 21 !important;
}

.workflow-container .react-flow__handle {
  z-index: 30 !important;
}

.workflow-container .react-flow__edge [data-testid="workflow-edge"] {
  z-index: 0 !important;
}

.workflow-container .react-flow__edge-labels {
  z-index: 60 !important;
}

.workflow-container,
.workflow-container .react-flow__pane,
.workflow-container .react-flow__renderer {
  background-color: var(--bg) !important;
}

.dark .workflow-container,
.dark .workflow-container .react-flow__pane,
.dark .workflow-container .react-flow__renderer {
  background-color: var(--bg) !important;
}

/**
 * Landing loop animation styles (keyframes defined in tailwind.config.ts)
 */
.landing-loop-animated-dash {
  animation: dash-animation 1.5s linear infinite;
  will-change: stroke-dashoffset;
  transform: translateZ(0);
}

.react-flow__node-landingLoop svg rect.landing-loop-animated-dash {
  animation: dash-animation 1.5s linear infinite !important;
}

/**
 * Dark color tokens - single source of truth for all colors (dark-only)
 */
@layer base {
  :root,
  .light {
    /* Neutrals (surfaces) - shadcn stone palette */
    --bg: #ffffff; /* pure white for landing/auth pages */
    --surface-1: #fafaf9; /* stone-50 */
    --surface-2: #ffffff; /* white */
    --surface-3: #f5f5f4; /* stone-100 */
    --surface-4: #f5f5f4; /* stone-100 */
    --surface-5: #eeedec; /* stone-150 */
    --surface-6: #f5f5f4; /* stone-100 */
    --surface-9: #f5f5f4; /* stone-100 */
    --surface-11: #e7e5e4; /* stone-200 */
    --surface-12: #d6d3d1; /* stone-300 */
    --surface-13: #a8a29e; /* stone-400 */
    --surface-14: #78716c; /* stone-500 */
    --surface-15: #57534e; /* stone-600 */
    --surface-elevated: #ffffff; /* white */
    --bg-strong: #e7e5e4; /* stone-200 */

    /* Text - shadcn stone palette for proper contrast */
    --text-primary: #1c1917; /* stone-900 */
    --text-secondary: #292524; /* stone-800 */
    --text-tertiary: #57534e; /* stone-600 */
    --text-muted: #78716c; /* stone-500 */
    --text-subtle: #a8a29e; /* stone-400 */
    --text-inverse: #fafaf9; /* stone-50 */
    --text-error: #dc2626;

    /* Borders / dividers - shadcn stone palette */
    --border: #d6d3d1; /* stone-300 */
    --border-strong: #d6d3d1; /* stone-300 */
    --divider: #e7e5e4; /* stone-200 */
    --border-muted: #e7e5e4; /* stone-200 */
    --border-success: #d6d3d1; /* stone-300 */

    /* Brand & state */
    --brand-400: #8e4cfb;
    --brand-500: #6f3dfa;
    --brand-secondary: #33b4ff;
    --brand-tertiary: #22c55e;
    --brand-tertiary-2: #33c481;
    --warning: #ea580c;

    /* Utility */
    --white: #ffffff;

    /* Font weights - lighter for light mode (-20 from dark) */
    --font-weight-base: 430;
    --font-weight-medium: 450;
    --font-weight-semibold: 500;

    /* RGB for opacity usage - stone palette */
    --surface-4-rgb: 245 245 244; /* stone-100 */
    --surface-5-rgb: 238 237 236; /* stone-150 */
    --surface-7-rgb: 245 245 244; /* stone-100 */
    --surface-9-rgb: 245 245 244; /* stone-100 */
    --divider-rgb: 231 229 228; /* stone-200 */
    --white-rgb: 255 255 255;
    --black-rgb: 0 0 0;

    /* Extended palette - mapped to shadcn stone palette */
    --c-0D0D0D: #0c0a09; /* stone-950 */
    --c-1A1A1A: #1c1917; /* stone-900 */
    --c-1F1F1F: #1c1917; /* stone-900 */
    --c-2A2A2A: #292524; /* stone-800 */
    --c-383838: #44403c; /* stone-700 */
    --c-414141: #57534e; /* stone-600 */
    --c-442929: #442929;
    --c-491515: #491515;
    --c-575757: #78716c; /* stone-500 */
    --c-686868: #78716c; /* stone-500 */
    --c-707070: #78716c; /* stone-500 */
    --c-727272: #78716c; /* stone-500 */
    --c-737373: #78716c; /* stone-500 */
    --c-808080: #a8a29e; /* stone-400 */
    --c-858585: #a8a29e; /* stone-400 */
    --c-868686: #a8a29e; /* stone-400 */
    --c-8D8D8D: #a8a29e; /* stone-400 */
    --c-939393: #a8a29e; /* stone-400 */
    --c-A8A8A8: #a8a29e; /* stone-400 */
    --c-B8B8B8: #d6d3d1; /* stone-300 */
    --c-C0C0C0: #d6d3d1; /* stone-300 */
    --c-CDCDCD: #d6d3d1; /* stone-300 */
    --c-D0D0D0: #d6d3d1; /* stone-300 */
    --c-D2D2D2: #d6d3d1; /* stone-300 */
    --c-E0E0E0: #e7e5e4; /* stone-200 */
    --c-E5E5E5: #e7e5e4; /* stone-200 */
    --c-E8E8E8: #e7e5e4; /* stone-200 */
    --c-EEEEEE: #f5f5f4; /* stone-100 */
    --c-F0F0F0: #f5f5f4; /* stone-100 */
    --c-F4F4F4: #fafaf9; /* stone-50 */
    --c-F5F5F5: #fafaf9; /* stone-50 */

    /* Blues and cyans */
    --c-00B0B0: #00b0b0;
    --c-264F78: #264f78;
    --c-2F55FF: #2f55ff;
    --c-2FA1FF: #2fa1ff;
    --c-336699: #336699;
    --c-34B5FF: #34b5ff;
    --c-601EE0: #601ee0;
    --c-611F69: #611f69;
    --c-802FFF: #802fff;
    --c-8357FF: #8357ff;
    --c-8C10FF: #8c10ff;

    /* Greens */
    --c-4CAF50: #22c55e;

    /* Oranges / Ambers */
    --c-F59E0B: #f59e0b;
    --c-F97316: #ea580c;
    --c-FF972F: #f97316;

    /* Reds */
    --c-DC2626: #dc2626;
    --c-F6D2D2: #fecaca;
    --c-F87171: #f87171;
    --c-FF402F: #ef4444;
    --c-B91C1C: #b91c1c;
    --c-883827: #7c2d12;

    /* Terminal status badges */
    --terminal-status-error-bg: #feeeee;
    --terminal-status-error-border: #f87171;
    --terminal-status-info-bg: #f5f5f4; /* stone-100 */
    --terminal-status-info-border: #a8a29e; /* stone-400 */
    --terminal-status-info-color: #57534e; /* stone-600 */
    --terminal-status-warning-bg: #fef9e7;
    --terminal-status-warning-border: #f5c842;
    --terminal-status-warning-color: #a16207;
  }
  .dark {
    /* Neutrals (surfaces) */
    --bg: #1b1b1b;
    --surface-1: #1e1e1e;
    --surface-2: #232323;
    --surface-3: #242424;
    --surface-4: #252525;
    --surface-5: #272727;
    --surface-6: #282828;
    --surface-9: #363636;
    --surface-11: #3d3d3d;
    --surface-12: #434343;
    --surface-13: #454545;
    --surface-14: #4a4a4a;
    --surface-15: #5a5a5a;
    --surface-elevated: #202020;
    --bg-strong: #0c0c0c;

    /* Text */
    --text-primary: #e6e6e6;
    --text-secondary: #cccccc;
    --text-tertiary: #b3b3b3;
    --text-muted: #787878;
    --text-subtle: #7d7d7d;
    --text-inverse: #1b1b1b;
    --text-error: #ef4444;

    /* Borders / dividers */
    --border: #2c2c2c;
    --border-strong: #303030;
    --divider: #393939;
    --border-muted: #424242;
    --border-success: #575757;

    /* Brand & state */
    --brand-400: #8e4cfb;
    --brand-secondary: #33b4ff;
    --brand-tertiary: #22c55e;
    --brand-tertiary-2: #33c481;
    --warning: #ff6600;

    /* Utility */
    --white: #ffffff;

    /* Font weights - standard weights for dark mode */
    --font-weight-base: 440;
    --font-weight-medium: 480;
    --font-weight-semibold: 550;

    /* RGB for opacity usage */
    --surface-4-rgb: 37 37 37;
    --surface-5-rgb: 39 39 39;
    --surface-7-rgb: 44 44 44;
    --surface-9-rgb: 54 54 54;
    --divider-rgb: 57 57 57;
    --white-rgb: 255 255 255;
    --black-rgb: 0 0 0;

    /* Extended palette (exhaustive from code usage via -[#...]) */
    /* Neutral deep shades */
    --c-0D0D0D: #0d0d0d;
    --c-1A1A1A: #1a1a1a;
    --c-1F1F1F: #1f1f1f;
    --c-2A2A2A: #2a2a2a;
    --c-383838: #383838;
    --c-414141: #414141;
    --c-442929: #442929;
    --c-491515: #491515;
    --c-575757: #575757;
    --c-686868: #686868;
    --c-707070: #707070;
    --c-727272: #727272;
    --c-737373: #737373;
    --c-808080: #808080;
    --c-858585: #858585;
    --c-868686: #868686;
    --c-8D8D8D: #8d8d8d;
    --c-939393: #939393;
    --c-A8A8A8: #a8a8a8;
    --c-B8B8B8: #b8b8b8;
    --c-C0C0C0: #c0c0c0;
    --c-CDCDCD: #cdcdcd;
    --c-D0D0D0: #d0d0d0;
    --c-D2D2D2: #d2d2d2;
    --c-E0E0E0: #e0e0e0;
    --c-E5E5E5: #e5e5e5;
    --c-E8E8E8: #e8e8e8;
    --c-EEEEEE: #eeeeee;
    --c-F0F0F0: #f0f0f0;
    --c-F4F4F4: #f4f4f4;
    --c-F5F5F5: #f5f5f5;

    --c-CFCFCF: #cfcfcf;

    /* Blues and cyans */
    --c-00B0B0: #00b0b0;
    --c-264F78: #264f78;
    --c-2F55FF: #2f55ff;
    --c-2FA1FF: #2fa1ff;
    --c-336699: #336699;
    --c-34B5FF: #34b5ff;
    --c-601EE0: #601ee0;
    --c-611F69: #611f69;
    --c-802FFF: #802fff;
    --c-8357FF: #8357ff;
    --c-8C10FF: #8c10ff;

    /* Greens */
    --c-4CAF50: #4caf50;

    /* Oranges / Ambers */
    --c-F59E0B: #f59e0b;
    --c-F97316: #f97316;
    --c-FF972F: #ff972f;

    /* Reds */
    --c-DC2626: #dc2626;
    --c-F6D2D2: #f6d2d2;
    --c-F87171: #f87171;
    --c-FF402F: #ff402f;
    --c-B91C1C: #b91c1c;
    --c-883827: #883827;

    /* Terminal status badges */
    --terminal-status-error-bg: #491515;
    --terminal-status-error-border: #883827;
    --terminal-status-info-bg: #383838;
    --terminal-status-info-border: #686868;
    --terminal-status-info-color: #b7b7b7;
    --terminal-status-warning-bg: #3d3520;
    --terminal-status-warning-border: #5c4d1f;
    --terminal-status-warning-color: #d4a72c;
  }
}

/**
 * Base styles for body, scrollbars, and global elements
 */
@layer base {
  * {
    border-color: var(--border);
    overscroll-behavior-x: none;
  }

  *:focus {
    outline: none;
  }

  body {
    background-color: var(--bg);
    color: var(--text-primary);
    overscroll-behavior-x: none;
    overscroll-behavior-y: none;
    min-height: 100vh;
    scrollbar-gutter: stable;
    text-rendering: optimizeSpeed;
    letter-spacing: 0.28px;
  }

  /* Ensure visible text caret across inputs and editors */
  input,
  textarea,
  [contenteditable="true"] {
    caret-color: var(--text-primary);
  }

  .dark input,
  .dark textarea,
  .dark [contenteditable="true"] {
    caret-color: var(--text-primary);
  }

  .dark body {
    @apply antialiased;
  }
  ::-webkit-scrollbar {
    width: var(--scrollbar-size);
    height: var(--scrollbar-size);
  }

  ::-webkit-scrollbar-track {
    background: var(--surface-1);
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--surface-12);
    border-radius: var(--radius);
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--surface-13);
  }

  /* Dark Mode Global Scrollbar */
  .dark ::-webkit-scrollbar-track {
    background: var(--surface-5);
  }

  .dark ::-webkit-scrollbar-thumb {
    background-color: var(--surface-12);
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background-color: var(--surface-13);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--surface-12) var(--surface-1);
  }

  .dark * {
    scrollbar-color: var(--surface-12) var(--surface-5);
  }

  .copilot-scrollable {
    scrollbar-gutter: stable;
  }
}

/**
 * Panel tab styles
 */
.panel-tab-base {
  color: var(--base-muted-foreground);
}

.panel-tab-active {
  background-color: var(--white);
  color: var(--text-inverse);
  border-color: var(--border-muted);
}

.dark .panel-tab-active {
  background-color: var(--surface-1);
  color: var(--white);
  border-color: var(--border-muted);
}

.panel-tab-inactive:hover {
  background-color: var(--surface-9);
  color: var(--text-primary);
}

/**
 * Dark mode specific overrides
 */
.dark .bg-red-500 {
  @apply bg-red-700;
}

/**
 * Browser input overrides
 */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

input[type="search"]::-moz-search-cancel-button {
  display: none;
}

input[type="search"]::-ms-clear {
  display: none;
}

/**
 * Utilities and special effects
 * Animation keyframes are defined in tailwind.config.ts
 */
@layer utilities {
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -webkit-scrollbar: none;
    -webkit-scrollbar-width: none;
    -webkit-scrollbar-track: transparent;
    -webkit-scrollbar-thumb: transparent;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    -ms-overflow-style: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }

  .scrollbar-hide::-webkit-scrollbar-track {
    display: none;
    background: transparent;
  }

  .scrollbar-hide::-webkit-scrollbar-thumb {
    display: none;
    background: transparent;
  }

  .gradient-text {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bg-input-background {
    background-color: hsl(var(--input-background));
  }

  .auth-card {
    background-color: var(--white) !important;
    border-color: var(--border-muted) !important;
  }

  .dark .auth-card {
    background-color: var(--surface-1) !important;
    border-color: var(--border-muted) !important;
  }

  .auth-text-primary {
    color: var(--text-inverse) !important;
  }

  .auth-text-secondary {
    color: var(--text-secondary) !important;
  }

  .auth-text-muted {
    color: var(--text-muted) !important;
  }

  .auth-divider {
    border-color: var(--border-muted) !important;
  }

  .auth-card-shadow {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.05),
      0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }

  .auth-link {
    color: var(--text-muted) !important;
  }

  .transition-ring {
    transition-property: box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }

  .streaming-effect {
    @apply relative overflow-hidden;
  }

  .streaming-effect::after {
    content: "";
    @apply pointer-events-none absolute left-0 top-0 h-full w-full;
    background: linear-gradient(
      90deg,
      rgba(128, 128, 128, 0) 0%,
      rgba(128, 128, 128, 0.1) 50%,
      rgba(128, 128, 128, 0) 100%
    );
    animation: code-shimmer 1.5s infinite;
    z-index: 10;
  }

  .dark .streaming-effect::after {
    background: linear-gradient(
      90deg,
      rgba(180, 180, 180, 0) 0%,
      rgba(180, 180, 180, 0.1) 50%,
      rgba(180, 180, 180, 0) 100%
    );
  }

  .loading-placeholder::placeholder {
    animation: placeholder-pulse 1.5s ease-in-out infinite;
  }

  .auth-button-gradient {
    background: linear-gradient(to bottom, var(--brand-500), var(--brand-400)) !important;
    border-color: var(--brand-400) !important;
    box-shadow: inset 0 2px 4px 0 var(--brand-400) !important;
  }

  .auth-button-gradient:hover {
    background: linear-gradient(to bottom, var(--brand-500), var(--brand-400)) !important;
    opacity: 0.9;
  }

  .auth-button-custom {
    background: var(--brand-500) !important;
    border-color: var(--brand-500) !important;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  }

  .auth-button-custom:hover {
    background: var(--brand-500) !important;
    border-color: var(--brand-500) !important;
    opacity: 1;
  }

  /**
   * Panel tab visibility and styling to prevent hydration flash
   */
  html[data-panel-active-tab="copilot"] .panel-container [data-tab-content="toolbar"],
  html[data-panel-active-tab="copilot"] .panel-container [data-tab-content="editor"] {
    display: none !important;
  }

  html[data-panel-active-tab="toolbar"] .panel-container [data-tab-content="copilot"],
  html[data-panel-active-tab="toolbar"] .panel-container [data-tab-content="editor"] {
    display: none !important;
  }

  html[data-panel-active-tab="editor"] .panel-container [data-tab-content="copilot"],
  html[data-panel-active-tab="editor"] .panel-container [data-tab-content="toolbar"] {
    display: none !important;
  }

  html[data-panel-active-tab="copilot"] .panel-container [data-tab-button="copilot"] {
    background-color: var(--surface-11) !important;
    color: var(--text-primary) !important;
  }
  html[data-panel-active-tab="copilot"] .panel-container [data-tab-button="toolbar"],
  html[data-panel-active-tab="copilot"] .panel-container [data-tab-button="editor"] {
    background-color: transparent !important;
    color: var(--text-tertiary) !important;
  }

  html[data-panel-active-tab="toolbar"] .panel-container [data-tab-button="toolbar"] {
    background-color: var(--surface-11) !important;
    color: var(--text-primary) !important;
  }
  html[data-panel-active-tab="toolbar"] .panel-container [data-tab-button="copilot"],
  html[data-panel-active-tab="toolbar"] .panel-container [data-tab-button="editor"] {
    background-color: transparent !important;
    color: var(--text-tertiary) !important;
  }

  html[data-panel-active-tab="editor"] .panel-container [data-tab-button="editor"] {
    background-color: var(--surface-11) !important;
    color: var(--text-primary) !important;
  }
  html[data-panel-active-tab="editor"] .panel-container [data-tab-button="copilot"],
  html[data-panel-active-tab="editor"] .panel-container [data-tab-button="toolbar"] {
    background-color: transparent !important;
    color: var(--text-tertiary) !important;
  }
}

/**
 * @depricated
 * Legacy globals (light/dark) kept for backward-compat with old classes.
 * Do not modify; remove after migration.
 */
@layer base {
  :root,
  .light {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 99.2%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 11.2%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 11.2%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 46.9%;
    --accent: 0 0% 92.5%;
    --accent-foreground: 0 0% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --input: 0 0% 89.8%;
    --input-background: 0 0% 100%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
    --scrollbar-track: 0 0% 85%;
    --scrollbar-thumb: 0 0% 65%;
    --scrollbar-thumb-hover: 0 0% 55%;
    --scrollbar-size: 8px;
    --workflow-background: 0 0% 100%;
    --card-background: 0 0% 99.2%;
    --card-border: 0 0% 89.8%;
    --card-text: 0 0% 3.9%;
    --card-hover: 0 0% 96.1%;
    --base-muted-foreground: #737373;
    --gradient-primary: 263 85% 70%;
    --gradient-secondary: 336 95% 65%;
    --brand-primary-hex: #6f3dfa;
    --brand-primary-hover-hex: #6338d9;
    --brand-accent-hex: #6f3dfa;
    --brand-accent-hover-hex: #6f3dfa;
    --brand-background-hex: #ffffff;
    --surface-elevated: #202020;
  }

  .dark {
    --background: 0 0% 10.59%;
    --foreground: 0 0% 98%;
    --card: 0 0% 9.0%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 9.0%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 11.2%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 12.0%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 17.5%;
    /* --muted-foreground: 0 0% 65.1%; */
    --accent: 0 0% 17.5%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --input: 0 0% 16.1%;
    --input-background: 0 0% 20.78%;
    --ring: 0 0% 83.9%;
    --scrollbar-track: 0 0% 17.5%;
    --scrollbar-thumb: 0 0% 30%;
    --scrollbar-thumb-hover: 0 0% 40%;
    --workflow-background: 0 0% 10.59%;
    --card-background: 0 0% 9.0%;
    --card-border: 0 0% 22.7%;
    --card-text: 0 0% 98%;
    --card-hover: 0 0% 12.0%;
    --base-muted-foreground: #a3a3a3;
    --gradient-primary: 263 90% 75%;
    --gradient-secondary: 336 100% 72%;
    --brand-primary-hex: #701ffc;
    --brand-primary-hover-hex: #802fff;
    --brand-accent-hex: #9d54ff;
    --brand-accent-hover-hex: #a66fff;
    --brand-background-hex: #0c0c0c;
    --surface-elevated: #202020;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: inter.ts]---
Location: sim-main/apps/sim/app/_styles/fonts/inter/inter.ts
Signals: Next.js

```typescript
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Variable font supports weights from 100-900
  weight: 'variable',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'],
})
```

--------------------------------------------------------------------------------

---[FILE: season.ts]---
Location: sim-main/apps/sim/app/_styles/fonts/season/season.ts
Signals: Next.js

```typescript
import localFont from 'next/font/local'

/**
 * Season Sans variable font configuration
 * Uses variable font file to support any weight from 300-800
 */
export const season = localFont({
  src: [
    // Variable font - supports all weights from 300 to 800
    { path: './SeasonSansUprightsVF.woff2', weight: '300 800', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-season',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'],
  adjustFontFallback: 'Arial',
})
```

--------------------------------------------------------------------------------

---[FILE: soehne.ts]---
Location: sim-main/apps/sim/app/_styles/fonts/soehne/soehne.ts
Signals: Next.js

```typescript
import localFont from 'next/font/local'

export const soehne = localFont({
  src: [
    // Light (leicht)
    { path: './soehne-leicht.woff2', weight: '300', style: 'normal' },
    { path: './soehne-leicht-kursiv.woff2', weight: '300', style: 'italic' },
    // Regular (buch)
    { path: './soehne-buch.woff2', weight: '400', style: 'normal' },
    { path: './soehne-buch-kursiv.woff2', weight: '400', style: 'italic' },
    // Medium (kräftig)
    { path: './soehne-kraftig.woff2', weight: '500', style: 'normal' },
    { path: './soehne-kraftig-kursiv.woff2', weight: '500', style: 'italic' },
    // Semibold (halbfett)
    { path: './soehne-halbfett.woff2', weight: '600', style: 'normal' },
    { path: './soehne-halbfett-kursiv.woff2', weight: '600', style: 'italic' },
    // Bold (dreiviertelfett)
    { path: './soehne-dreiviertelfett.woff2', weight: '700', style: 'normal' },
    { path: './soehne-dreiviertelfett-kursiv.woff2', weight: '700', style: 'italic' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-soehne',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans'],
  adjustFontFallback: 'Arial',
})
```

--------------------------------------------------------------------------------

---[FILE: creator-profile.ts]---
Location: sim-main/apps/sim/app/_types/creator-profile.ts

```typescript
export interface CreatorProfileDetails {
  about?: string
  xUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  contactEmail?: string
}
```

--------------------------------------------------------------------------------

---[FILE: knowledge-processing.ts]---
Location: sim-main/apps/sim/background/knowledge-processing.ts

```typescript
import { task } from '@trigger.dev/sdk'
import { env } from '@/lib/core/config/env'
import { processDocumentAsync } from '@/lib/knowledge/documents/service'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('TriggerKnowledgeProcessing')

export type DocumentProcessingPayload = {
  knowledgeBaseId: string
  documentId: string
  docData: {
    filename: string
    fileUrl: string
    fileSize: number
    mimeType: string
  }
  processingOptions: {
    chunkSize?: number
    minCharactersPerChunk?: number
    recipe?: string
    lang?: string
    chunkOverlap?: number
  }
  requestId: string
}

export const processDocument = task({
  id: 'knowledge-process-document',
  maxDuration: env.KB_CONFIG_MAX_DURATION || 600,
  retry: {
    maxAttempts: env.KB_CONFIG_MAX_ATTEMPTS || 3,
    factor: env.KB_CONFIG_RETRY_FACTOR || 2,
    minTimeoutInMs: env.KB_CONFIG_MIN_TIMEOUT || 1000,
    maxTimeoutInMs: env.KB_CONFIG_MAX_TIMEOUT || 10000,
  },
  queue: {
    concurrencyLimit: env.KB_CONFIG_CONCURRENCY_LIMIT || 20,
    name: 'document-processing-queue',
  },
  run: async (payload: DocumentProcessingPayload) => {
    const { knowledgeBaseId, documentId, docData, processingOptions, requestId } = payload

    logger.info(`[${requestId}] Starting Trigger.dev processing for document: ${docData.filename}`)

    try {
      await processDocumentAsync(knowledgeBaseId, documentId, docData, processingOptions)

      logger.info(`[${requestId}] Successfully processed document: ${docData.filename}`)

      return {
        success: true,
        documentId,
        filename: docData.filename,
        processingTime: Date.now(),
      }
    } catch (error) {
      logger.error(`[${requestId}] Failed to process document: ${docData.filename}`, error)
      throw error
    }
  },
})
```

--------------------------------------------------------------------------------

````
