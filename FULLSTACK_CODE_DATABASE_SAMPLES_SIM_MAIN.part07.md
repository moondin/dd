---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 7
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 7 of 933)

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

---[FILE: proxy.ts]---
Location: sim-main/apps/docs/proxy.ts
Signals: Next.js

```typescript
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation'
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server'
import { i18n } from '@/lib/i18n'

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path')
const i18nProxy = createI18nMiddleware(i18n)

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname)

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl))
    }
  }

  return i18nProxy(request, event)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|static|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)',
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: sim-main/apps/docs/README.md

```text
# docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
bun run dev
```

Open http://localhost:3000 with your browser to see the result.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
- [Bun Documentation](https://bun.sh/docs) - learn about Bun features and API
```

--------------------------------------------------------------------------------

---[FILE: source.config.ts]---
Location: sim-main/apps/docs/source.config.ts

```typescript
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
})

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
})
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: sim-main/apps/docs/tsconfig.json
Signals: React, Next.js

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "target": "ESNext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "paths": {
      "@/.source/*": ["./.source/*"],
      "@/*": ["./*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "content/docs/execution/index.mdx",
    "content/docs/connections/index.mdx",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: global.css]---
Location: sim-main/apps/docs/app/global.css

```text
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

/* Prevent overscroll bounce effect on the page */
html,
body {
  overscroll-behavior: none;
}

@theme {
  --color-fd-primary: #802fff; /* Purple from control-bar component */
  --font-geist-sans: var(--font-geist-sans);
  --font-geist-mono: var(--font-geist-mono);
}

/* Font family utilities */
.font-sans {
  font-family: var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.font-mono {
  font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

/* Target any potential border classes */
* {
  --fd-border-sidebar: transparent !important;
}

/* Override any CSS custom properties for borders */
:root {
  --fd-border: transparent !important;
  --fd-border-sidebar: transparent !important;
  --fd-nav-height: 64px; /* Custom navbar height (h-16 = 4rem = 64px) */
  /* Content container width used to center main content */
  --spacing-fd-container: 1400px;
  /* Edge gutter = leftover space on each side of centered container */
  --edge-gutter: max(1rem, calc((100vw - var(--spacing-fd-container)) / 2));
  /* Shift the sidebar slightly left from the content edge for extra breathing room */
  --sidebar-shift: 90px;
  --sidebar-offset: max(0px, calc(var(--edge-gutter) - var(--sidebar-shift)));
  /* Shift TOC slightly right to match sidebar spacing for symmetry */
  --toc-shift: 90px;
  --toc-offset: max(0px, calc(var(--edge-gutter) - var(--toc-shift)));
  /* Sidebar and TOC have 20px internal padding - navbar accounts for this directly */
  /* Extra gap between sidebar/TOC and the main text content */
  --content-gap: 1.75rem;
}

/* Remove custom layout variable overrides to fallback to fumadocs defaults */

/* ============================================
   Navbar Light Mode Styling
   ============================================ */

/* Light mode navbar and search styling */
:root:not(.dark) nav {
  background-color: hsla(0, 0%, 96%, 0.85) !important;
}

:root:not(.dark) nav button[type="button"] {
  background-color: hsla(0, 0%, 93%, 0.85) !important;
  backdrop-filter: blur(33px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(33px) saturate(180%) !important;
  color: rgba(0, 0, 0, 0.6) !important;
}

:root:not(.dark) nav button[type="button"] kbd {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Dark mode navbar and search styling */
:root.dark nav {
  background-color: hsla(0, 0%, 7.04%, 0.92) !important;
  backdrop-filter: blur(25px) saturate(180%) brightness(0.6) !important;
  -webkit-backdrop-filter: blur(25px) saturate(180%) brightness(0.6) !important;
}

/* ============================================
   Custom Sidebar Styling (Turborepo-inspired)
   ============================================ */

/* Floating sidebar appearance - remove background */
[data-sidebar-container],
#nd-sidebar {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  --color-fd-muted: transparent !important;
  --color-fd-card: transparent !important;
  --color-fd-secondary: transparent !important;
}

aside[data-sidebar],
aside#nd-sidebar {
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  border-right: none !important;
}

/* Fumadocs v16: Add sidebar placeholder styling for grid area */
[data-sidebar-placeholder] {
  background: transparent !important;
}

/* Fumadocs v16: Hide sidebar panel (floating collapse button) */
[data-sidebar-panel] {
  display: none !important;
}

/* Mobile only: Reduce gap between navbar and content */
@media (max-width: 1023px) {
  #nd-docs-layout {
    margin-top: -25px;
  }
}

/* Desktop only: Apply custom navbar offset, sidebar width and margin offsets */
/* On mobile, let fumadocs handle the layout natively */
@media (min-width: 1024px) {
  :root {
    --fd-banner-height: 64px !important;
  }

  #nd-docs-layout {
    --fd-docs-height: calc(100dvh - 64px) !important;
    --fd-sidebar-width: 300px !important;
    margin-left: var(--sidebar-offset) !important;
    margin-right: var(--toc-offset) !important;
  }

  /* Hide fumadocs nav on desktop - we use custom navbar there */
  #nd-docs-layout > header {
    display: none !important;
  }
}

/* Sidebar spacing - compact like turborepo */
/* Fumadocs v16: [data-sidebar-viewport] doesn't exist, target #nd-sidebar > div instead */
[data-sidebar-viewport],
#nd-sidebar > div {
  padding: 0.5rem 12px 12px;
  background: transparent !important;
  background-color: transparent !important;
}

/* Override sidebar item styling to match Raindrop */
/* Target Link and button elements in sidebar - override Fumadocs itemVariants */
/* Exclude the small chevron-only toggle buttons */
/* Using html prefix for higher specificity over Tailwind v4 utilities */
html #nd-sidebar a,
html #nd-sidebar button:not([aria-label*="ollapse"]):not([aria-label*="xpand"]) {
  font-size: 0.9375rem !important; /* 15px to match Raindrop */
  line-height: 1.4 !important;
  padding: 0.5rem 0.75rem !important; /* More compact like Raindrop */
  font-weight: 400 !important;
  border-radius: 0.75rem !important; /* More rounded like Raindrop */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif !important;
}

/* Dark mode sidebar text */
html.dark #nd-sidebar a,
html.dark #nd-sidebar button:not([aria-label*="ollapse"]):not([aria-label*="xpand"]) {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Light mode sidebar text */
html:not(.dark) #nd-sidebar a,
html:not(.dark) #nd-sidebar button:not([aria-label*="ollapse"]):not([aria-label*="xpand"]) {
  color: rgba(0, 0, 0, 0.6) !important;
}

/* Make sure chevron icons are visible and properly styled */
#nd-sidebar svg {
  display: inline-block !important;
  opacity: 0.6 !important;
  flex-shrink: 0 !important;
  width: 0.75rem !important;
  height: 0.75rem !important;
}

/* Ensure the small chevron toggle buttons are visible */
#nd-sidebar button[aria-label*="ollapse"],
#nd-sidebar button[aria-label*="xpand"] {
  display: flex !important;
  opacity: 1 !important;
  padding: 0.25rem !important;
}

/* Root-level spacing now handled by [data-sidebar-viewport] > * rule below */

/* Add tiny gap between nested items */
#nd-sidebar ul li {
  margin-bottom: 0.0625rem !important;
}

#nd-sidebar ul li:last-child {
  margin-bottom: 0 !important;
}

/* Section headers should be slightly larger */
/* Fumadocs v16: Also target #nd-sidebar for compatibility */
[data-sidebar-viewport] [data-separator],
#nd-sidebar [data-separator],
#nd-sidebar p {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
}

/* Override active state (NO PURPLE) */
#nd-sidebar a[data-active="true"],
#nd-sidebar button[data-active="true"],
#nd-sidebar a.bg-fd-primary\/10,
#nd-sidebar a.text-fd-primary,
#nd-sidebar a[class*="bg-fd-primary"],
#nd-sidebar a[class*="text-fd-primary"],
/* Override custom sidebar purple classes */
  #nd-sidebar
  a.bg-purple-50\/80,
#nd-sidebar a.text-purple-600,
#nd-sidebar a[class*="bg-purple"],
#nd-sidebar a[class*="text-purple"] {
  background-image: none !important;
}

/* Dark mode active state */
html.dark #nd-sidebar a[data-active="true"],
html.dark #nd-sidebar button[data-active="true"],
html.dark #nd-sidebar a.bg-fd-primary\/10,
html.dark #nd-sidebar a.text-fd-primary,
html.dark #nd-sidebar a[class*="bg-fd-primary"],
html.dark #nd-sidebar a[class*="text-fd-primary"],
html.dark #nd-sidebar a.bg-purple-50\/80,
html.dark #nd-sidebar a.text-purple-600,
html.dark #nd-sidebar a[class*="bg-purple"],
html.dark #nd-sidebar a[class*="text-purple"] {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* Light mode active state */
html:not(.dark) #nd-sidebar a[data-active="true"],
html:not(.dark) #nd-sidebar button[data-active="true"],
html:not(.dark) #nd-sidebar a.bg-fd-primary\/10,
html:not(.dark) #nd-sidebar a.text-fd-primary,
html:not(.dark) #nd-sidebar a[class*="bg-fd-primary"],
html:not(.dark) #nd-sidebar a[class*="text-fd-primary"],
html:not(.dark) #nd-sidebar a.bg-purple-50\/80,
html:not(.dark) #nd-sidebar a.text-purple-600,
html:not(.dark) #nd-sidebar a[class*="bg-purple"],
html:not(.dark) #nd-sidebar a[class*="text-purple"] {
  background-color: rgba(0, 0, 0, 0.07) !important;
  color: rgba(0, 0, 0, 0.9) !important;
}

/* Dark mode hover state */
html.dark #nd-sidebar a:hover:not([data-active="true"]),
html.dark #nd-sidebar button:hover:not([data-active="true"]) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* Light mode hover state */
html:not(.dark) #nd-sidebar a:hover:not([data-active="true"]),
html:not(.dark) #nd-sidebar button:hover:not([data-active="true"]) {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Dark mode - ensure active/selected items don't change on hover */
html.dark #nd-sidebar a.bg-purple-50\/80:hover,
html.dark #nd-sidebar a[class*="bg-purple"]:hover,
html.dark #nd-sidebar a[data-active="true"]:hover,
html.dark #nd-sidebar button[data-active="true"]:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* Light mode - ensure active/selected items don't change on hover */
html:not(.dark) #nd-sidebar a.bg-purple-50\/80:hover,
html:not(.dark) #nd-sidebar a[class*="bg-purple"]:hover,
html:not(.dark) #nd-sidebar a[data-active="true"]:hover,
html:not(.dark) #nd-sidebar button[data-active="true"]:hover {
  background-color: rgba(0, 0, 0, 0.07) !important;
  color: rgba(0, 0, 0, 0.9) !important;
}

/* Hide search, platform, and collapse button from sidebar completely */
[data-sidebar] [data-search],
[data-sidebar] .search-toggle,
#nd-sidebar [data-search],
#nd-sidebar .search-toggle,
[data-sidebar-viewport] [data-search],
[data-sidebar-viewport] button[data-search],
aside[data-sidebar] [role="button"]:has([data-search]),
aside[data-sidebar] > div > button:first-child,
#nd-sidebar > div > button:first-child,
[data-sidebar] a[href*="sim.ai"],
#nd-sidebar a[href*="sim.ai"],
[data-sidebar-viewport] a[href*="sim.ai"],
/* Hide search buttons (but NOT folder chevron buttons) */
  aside[data-sidebar] > div:first-child
  > button:not([aria-label="Collapse"]):not([aria-label="Expand"]),
#nd-sidebar > div:first-child > button:not([aria-label="Collapse"]):not([aria-label="Expand"]),
/* Hide sidebar collapse button (panel icon) - direct children only */
aside[data-sidebar] > button:first-of-type:not([aria-label="Collapse"]):not([aria-label="Expand"]),
[data-sidebar]
  > button[type="button"]:first-of-type:not([aria-label="Collapse"]):not([aria-label="Expand"]),
button[data-collapse]:not([aria-label="Collapse"]):not([aria-label="Expand"]),
[data-sidebar-header] button,
/* Hide theme toggle from sidebar footer */
aside[data-sidebar] [data-theme-toggle],
[data-sidebar-footer],
[data-sidebar] footer,
footer button[aria-label*="heme"],
aside[data-sidebar] > div:last-child:has(button[aria-label*="heme"]),
aside[data-sidebar] button[aria-label*="heme"],
[data-sidebar] button[aria-label*="Theme"],
/* Additional theme toggle selectors */
  aside[data-sidebar] > *:last-child
  button,
[data-sidebar-viewport] ~ *,
aside[data-sidebar] > div:not([data-sidebar-viewport]),
/* Aggressive theme toggle hiding */
aside[data-sidebar] svg[class*="sun"],
aside[data-sidebar] svg[class*="moon"],
aside[data-sidebar] button[type="button"]:last-child,
aside button:has(svg:only-child),
[data-sidebar] div:has(> button[type="button"]:only-child:last-child),
/* Hide theme toggle and other non-content elements */
aside[data-sidebar] > *:not([data-sidebar-viewport]) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  position: absolute !important;
  left: -9999px !important;
}

/* Desktop only: Hide sidebar toggle buttons and nav title/logo (keep visible on mobile) */
@media (min-width: 1025px) {
  [data-sidebar-container] > button,
  [data-sidebar-container] [data-toggle],
  aside[data-sidebar] [data-sidebar-toggle],
  button[data-sidebar-toggle],
  nav button[data-sidebar-toggle],
  button[aria-label="Toggle Sidebar"],
  button[aria-label="Collapse Sidebar"],
  /* Hide nav title/logo in sidebar on desktop - target all possible locations */
  aside[data-sidebar] a[href="/"],
  aside[data-sidebar] a[href="/"] img,
  aside[data-sidebar] > a:first-child,
  aside[data-sidebar] > div > a:first-child,
  aside[data-sidebar] img[alt="Sim"],
  [data-sidebar-header],
  [data-sidebar] [data-title],
  #nd-sidebar > a:first-child,
  #nd-sidebar > div:first-child > a:first-child,
  #nd-sidebar img[alt="Sim"],
  /* Hide theme toggle at bottom of sidebar on desktop */
    #nd-sidebar
    > footer,
  #nd-sidebar footer,
  aside#nd-sidebar > *:last-child:not(div),
  #nd-sidebar > button:last-child,
  #nd-sidebar button[aria-label*="theme" i],
  #nd-sidebar button[aria-label*="Theme"],
  #nd-sidebar > div:last-child > button {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    max-height: 0 !important;
    overflow: hidden !important;
  }
}

/* Extra aggressive - hide everything after the viewport */
aside[data-sidebar] [data-sidebar-viewport] ~ * {
  display: none !important;
}

/* Tighter spacing for sidebar content */
[data-sidebar-viewport] > * {
  margin-bottom: 0.0625rem;
}

[data-sidebar-viewport] > *:last-child {
  margin-bottom: 0;
}

[data-sidebar-viewport] ul {
  margin: 0;
  padding: 0;
}

/* Ensure sidebar starts with content immediately */
aside[data-sidebar] > div:first-child {
  padding-top: 0;
}

/* Remove all sidebar borders and backgrounds */
[data-sidebar-container],
aside[data-sidebar],
[data-sidebar],
[data-sidebar] *,
#nd-sidebar,
#nd-sidebar * {
  border: none !important;
  border-right: none !important;
  border-left: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

/* Override fumadocs background colors for sidebar */
.dark #nd-sidebar,
.dark [data-sidebar-container],
.dark aside[data-sidebar] {
  --color-fd-muted: transparent !important;
  --color-fd-secondary: transparent !important;
  background: transparent !important;
  background-color: transparent !important;
}

/* Force normal text flow in sidebar */
[data-sidebar],
[data-sidebar] *,
[data-sidebar-viewport],
[data-sidebar-viewport] * {
  writing-mode: horizontal-tb !important;
}

/* ============================================
   Code Block Styling (Improved)
   ============================================ */

/* Apply Geist Mono to code elements */
code,
pre,
pre code {
  font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

/* Inline code */
:not(pre) > code {
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-weight: 500;
}

/* Light mode inline code */
:root:not(.dark) :not(pre) > code {
  background-color: rgb(243 244 246);
  color: rgb(220 38 38);
  border: 1px solid rgb(229 231 235);
}

/* Dark mode inline code */
.dark :not(pre) > code {
  background-color: rgb(31 41 55);
  color: rgb(248 113 113);
  border: 1px solid rgb(55 65 81);
}

/* Code block container improvements */
pre {
  font-size: 0.875rem;
  line-height: 1.7;
  tab-size: 2;
  -webkit-overflow-scrolling: touch;
}

pre code {
  display: block;
  width: fit-content;
  min-width: 100%;
}

/* Syntax highlighting adjustments for better readability */
pre code .line {
  padding-left: 0;
  padding-right: 0;
}

/* Custom text highlighting styles */
.text-highlight {
  color: var(--color-fd-primary);
}

/* Override marker color for highlighted lists */
.highlight-markers li::marker {
  color: var(--color-fd-primary);
}

/* Add bottom spacing to prevent abrupt page endings */
[data-content] {
  padding-top: 1.5rem !important;
  padding-bottom: 4rem;
}

/* Alternative fallback for different Fumadocs versions */
main article,
.docs-page main {
  padding-top: 1.5rem !important;
  padding-bottom: 4rem;
}

/* ============================================
   Center and Constrain Main Content Width
   ============================================ */

/* Main content area - center and constrain like turborepo/raindrop */
/* Note: --sidebar-offset and --toc-offset are now applied at #nd-docs-layout level */
main[data-main] {
  max-width: var(--spacing-fd-container, 1400px);
  margin-left: auto;
  margin-right: auto;
  padding-top: 1rem;
  padding-left: var(--content-gap);
  padding-right: var(--content-gap);
  order: 1 !important;
}

/* Adjust for smaller screens */
@media (max-width: 768px) {
  main[data-main] {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Ensure docs page content is properly constrained */
[data-docs-page] {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 1.5rem !important;
}

/* Override Fumadocs default content padding */
article[data-content],
div[data-content] {
  padding-top: 1.5rem !important;
}

/* Remove any unwanted borders/outlines from video elements */
video {
  outline: none !important;
  border-style: solid !important;
}

/* Tailwind v4 content sources */
@source '../app/**/*.{js,ts,jsx,tsx,mdx}';
@source '../components/**/*.{js,ts,jsx,tsx,mdx}';
@source '../content/**/*.{js,ts,jsx,tsx,mdx}';
@source '../mdx-components.tsx';
@source '../node_modules/fumadocs-ui/dist/**/*.js';
```

--------------------------------------------------------------------------------

---[FILE: layout.config.tsx]---
Location: sim-main/apps/docs/app/layout.config.tsx

```typescript
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg width='24' height='24' xmlns='http://www.w3.org/2000/svg' aria-label='Logo'>
          <circle cx={12} cy={12} r={12} fill='currentColor' />
        </svg>
        My App
      </>
    ),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/docs/app/layout.tsx
Signals: React

```typescript
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}

export const metadata = {
  metadataBase: new URL('https://docs.sim.ai'),
  title: {
    default: 'Sim Documentation - Visual Workflow Builder for AI Applications',
    template: '%s',
  },
  description:
    'Comprehensive documentation for Sim - the visual workflow builder for AI applications. Create powerful AI agents, automation workflows, and data processing pipelines by connecting blocks on a canvas—no coding required.',
  keywords: [
    'AI workflow builder',
    'visual workflow editor',
    'AI automation',
    'workflow automation',
    'AI agents',
    'no-code AI',
    'drag and drop workflows',
    'AI integrations',
    'workflow canvas',
    'AI Agent Workflow Builder',
    'workflow orchestration',
    'agent builder',
    'AI workflow automation',
    'visual programming',
  ],
  authors: [{ name: 'Sim Team', url: 'https://sim.ai' }],
  creator: 'Sim',
  publisher: 'Sim',
  category: 'Developer Tools',
  classification: 'Developer Documentation',
  manifest: '/favicon/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sim Docs',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'fr_FR', 'de_DE', 'ja_JP', 'zh_CN'],
    url: 'https://docs.sim.ai',
    siteName: 'Sim Documentation',
    title: 'Sim Documentation - Visual Workflow Builder for AI Applications',
    description:
      'Comprehensive documentation for Sim - the visual workflow builder for AI applications. Create powerful AI agents, automation workflows, and data processing pipelines.',
    images: [
      {
        url: 'https://docs.sim.ai/api/og?title=Sim%20Documentation&category=DOCUMENTATION',
        width: 1200,
        height: 630,
        alt: 'Sim Documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sim Documentation - Visual Workflow Builder for AI Applications',
    description:
      'Comprehensive documentation for Sim - the visual workflow builder for AI applications.',
    creator: '@simdotai',
    site: '@simdotai',
    images: ['https://docs.sim.ai/api/og?title=Sim%20Documentation&category=DOCUMENTATION'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://docs.sim.ai',
    languages: {
      'x-default': 'https://docs.sim.ai',
      en: 'https://docs.sim.ai',
      es: 'https://docs.sim.ai/es',
      fr: 'https://docs.sim.ai/fr',
      de: 'https://docs.sim.ai/de',
      ja: 'https://docs.sim.ai/ja',
      zh: 'https://docs.sim.ai/zh',
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: route.tsx]---
Location: sim-main/apps/docs/app/api/og/route.tsx
Signals: Next.js

```typescript
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const TITLE_FONT_SIZE = {
  large: 64,
  medium: 56,
  small: 48,
} as const

function getTitleFontSize(title: string): number {
  if (title.length > 45) return TITLE_FONT_SIZE.small
  if (title.length > 30) return TITLE_FONT_SIZE.medium
  return TITLE_FONT_SIZE.large
}

/**
 * Loads a Google Font dynamically by fetching the CSS and extracting the font URL.
 */
async function loadGoogleFont(font: string, weights: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weights}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status === 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('Failed to load font data')
}

/**
 * Generates dynamic Open Graph images for documentation pages.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Documentation'
  const category = searchParams.get('category') || 'DOCUMENTATION'
  const description = searchParams.get('description') || ''

  const baseUrl = new URL(request.url).origin

  const allText = `${title}${category}${description}docs.sim.ai`
  const fontData = await loadGoogleFont('Geist', '400;500;600', allText)

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0c0c0c',
        position: 'relative',
        fontFamily: 'Geist',
      }}
    >
      {/* Base gradient layer - very subtle purple tint across the entire image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse 150% 100% at 50% 100%, rgba(88, 28, 135, 0.15) 0%, rgba(88, 28, 135, 0.08) 25%, rgba(88, 28, 135, 0.03) 50%, transparent 80%)',
          display: 'flex',
        }}
      />

      {/* Secondary glow - adds depth without harsh edges */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse 100% 80% at 80% 90%, rgba(112, 31, 252, 0.12) 0%, rgba(112, 31, 252, 0.04) 40%, transparent 70%)',
          display: 'flex',
        }}
      />

      {/* Top darkening - creates natural vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 40%, transparent 100%)',
          display: 'flex',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <img src={`${baseUrl}/static/logo.png`} alt='sim' height={32} />

        {/* Category + Title + Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#802fff',
              letterSpacing: '0.02em',
            }}
          >
            {category}
          </span>
          <span
            style={{
              fontSize: getTitleFontSize(title),
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </span>
          {description && (
            <span
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: '#a1a1aa',
                lineHeight: 1.4,
                marginTop: 4,
              }}
            >
              {description.length > 100 ? `${description.slice(0, 100)}...` : description}
            </span>
          )}
        </div>

        {/* Footer */}
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: '#52525b',
          }}
        >
          docs.sim.ai
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/api/search/route.ts

```typescript
import { createFromSource } from 'fumadocs-core/search/server'
import { source } from '@/lib/source'

export const revalidate = 3600 // Revalidate every hour

export const { GET } = createFromSource(source, {
  localeMap: {
    en: { language: 'english' },
    es: { language: 'spanish' },
    fr: { language: 'french' },
    de: { language: 'german' },
    // ja and zh are not supported by the stemmer library, so we'll skip language config for them
    ja: {},
    zh: {},
  },
})
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/llms-full.txt/route.ts

```typescript
import { getLLMText } from '@/lib/llms'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  try {
    const pages = source.getPages().filter((page) => {
      if (!page || !page.data || !page.url) return false

      const pathParts = page.url.split('/').filter(Boolean)
      const hasLangPrefix = pathParts[0] && ['es', 'fr', 'de', 'ja', 'zh'].includes(pathParts[0])

      return !hasLangPrefix
    })

    const scan = pages.map((page) => getLLMText(page))
    const scanned = await Promise.all(scan)

    const filtered = scanned.filter((text) => text && text.length > 0)

    return new Response(filtered.join('\n\n---\n\n'), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating LLM full text:', error)
    return new Response('Error generating full documentation text', { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/llms.mdx/[[...slug]]/route.ts
Signals: Next.js

```typescript
import { notFound } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'
import { i18n } from '@/lib/i18n'
import { getLLMText } from '@/lib/llms'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params

  let lang: (typeof i18n.languages)[number] = i18n.defaultLanguage
  let pageSlug = slug

  if (slug && slug.length > 0 && i18n.languages.includes(slug[0] as typeof lang)) {
    lang = slug[0] as typeof lang
    pageSlug = slug.slice(1)
  }

  const page = source.getPage(pageSlug, lang)
  if (!page) notFound()

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/llms.txt/route.ts

```typescript
import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  const baseUrl = 'https://docs.sim.ai'

  try {
    const pages = source.getPages().filter((page) => {
      if (!page || !page.data || !page.url) return false

      const pathParts = page.url.split('/').filter(Boolean)
      const hasLangPrefix = pathParts[0] && ['es', 'fr', 'de', 'ja', 'zh'].includes(pathParts[0])

      return !hasLangPrefix
    })

    const sections: Record<string, Array<{ title: string; url: string; description?: string }>> = {}

    pages.forEach((page) => {
      const pathParts = page.url.split('/').filter(Boolean)
      const section =
        pathParts[0] && ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(pathParts[0])
          ? pathParts[1] || 'root'
          : pathParts[0] || 'root'

      if (!sections[section]) {
        sections[section] = []
      }

      sections[section].push({
        title: page.data.title || 'Untitled',
        url: `${baseUrl}${page.url}`,
        description: page.data.description,
      })
    })

    const manifest = `# Sim Documentation

> Visual Workflow Builder for AI Applications

Sim is a visual workflow builder for AI applications that lets you build AI agent workflows visually. Create powerful AI agents, automation workflows, and data processing pipelines by connecting blocks on a canvas—no coding required.

## Documentation Overview

This file provides an overview of our documentation. For full content of all pages, see ${baseUrl}/llms-full.txt

## Main Sections

${Object.entries(sections)
  .map(([section, items]) => {
    const sectionTitle = section
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return `### ${sectionTitle}\n\n${items.map((item) => `- ${item.title}: ${item.url}${item.description ? `\n  ${item.description}` : ''}`).join('\n')}`
  })
  .join('\n\n')}

## Additional Resources

- Full documentation content: ${baseUrl}/llms-full.txt
- Individual page content: ${baseUrl}/llms.mdx/[page-path]
- API documentation: ${baseUrl}/sdks/
- Tool integrations: ${baseUrl}/tools/

## Statistics

- Total pages: ${pages.length} (English only)
- Other languages available at: ${baseUrl}/[lang]/ (es, fr, de, ja, zh)

---

Generated: ${new Date().toISOString()}
Format: llms.txt v0.1.0
See: https://llmstxt.org for specification`

    return new Response(manifest, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating LLM manifest:', error)
    return new Response('Error generating documentation manifest', { status: 500 })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/robots.txt/route.ts

```typescript
export const revalidate = false

export async function GET() {
  const baseUrl = 'https://docs.sim.ai'

  const robotsTxt = `# Robots.txt for Sim Documentation
# Generated on ${new Date().toISOString()}

User-agent: *
Allow: /

# Search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# AI and LLM crawlers - explicitly allowed for documentation indexing
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Applebot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Diffbot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: cohere-ai
Allow: /

# Disallow admin and internal paths (if any exist)
Disallow: /.next/
Disallow: /api/internal/
Disallow: /_next/static/
Disallow: /admin/

# Allow but don't prioritize these
Allow: /api/search
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /llms.mdx/

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for aggressive bots (optional)
# Crawl-delay: 1

# Additional resources for AI indexing
# See https://github.com/AnswerDotAI/llms-txt for more info
# LLM-friendly content:
#   Manifest: ${baseUrl}/llms.txt
#   Full content: ${baseUrl}/llms-full.txt
#   Individual pages: ${baseUrl}/llms.mdx/[page-path]

# Multi-language documentation available at:
# ${baseUrl}/en - English
# ${baseUrl}/es - Español
# ${baseUrl}/fr - Français
# ${baseUrl}/de - Deutsch
# ${baseUrl}/ja - 日本語
# ${baseUrl}/zh - 简体中文`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: sim-main/apps/docs/app/sitemap.xml/route.ts

```typescript
import { i18n } from '@/lib/i18n'
import { source } from '@/lib/source'

export const revalidate = false

export async function GET() {
  const baseUrl = 'https://docs.sim.ai'

  const allPages = source.getPages()

  const getPriority = (url: string): string => {
    if (url === '/introduction' || url === '/') return '1.0'
    if (url === '/getting-started') return '0.9'
    if (url.match(/^\/[^/]+$/)) return '0.8'
    if (url.includes('/sdks/') || url.includes('/tools/')) return '0.7'
    return '0.6'
  }

  const urls = allPages
    .flatMap((page) => {
      const urlWithoutLang = page.url.replace(/^\/[a-z]{2}\//, '/')

      return i18n.languages.map((lang) => {
        const url =
          lang === i18n.defaultLanguage
            ? `${baseUrl}${urlWithoutLang}`
            : `${baseUrl}/${lang}${urlWithoutLang}`

        return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${getPriority(urlWithoutLang)}</priority>
    ${i18n.languages.length > 1 ? generateAlternateLinks(baseUrl, urlWithoutLang) : ''}
  </url>`
      })
    })
    .join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function generateAlternateLinks(baseUrl: string, urlWithoutLang: string): string {
  return i18n.languages
    .map((lang) => {
      const url =
        lang === i18n.defaultLanguage
          ? `${baseUrl}${urlWithoutLang}`
          : `${baseUrl}/${lang}${urlWithoutLang}`
      return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`
    })
    .join('\n')
}
```

--------------------------------------------------------------------------------

````
