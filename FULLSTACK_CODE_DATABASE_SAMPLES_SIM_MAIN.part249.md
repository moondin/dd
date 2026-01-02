---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 249
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 249 of 933)

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

---[FILE: telemetry.config.ts]---
Location: sim-main/apps/sim/telemetry.config.ts

```typescript
/**
 * Sim OpenTelemetry Configuration
 *
 * PRIVACY NOTICE:
 * - Telemetry is enabled by default to help us improve the product
 * - You can disable telemetry via:
 *   1. Settings UI > Privacy tab > Toggle off "Allow anonymous telemetry"
 *   2. Setting NEXT_TELEMETRY_DISABLED=1 environment variable
 *
 * This file allows you to configure OpenTelemetry collection for your
 * Sim instance. If you've forked the repository, you can modify
 * this file to send telemetry to your own collector.
 *
 * We only collect anonymous usage data to improve the product:
 * - Feature usage statistics
 * - Error rates (always captured)
 * - Performance metrics (sampled at 10%)
 * - AI/LLM operation traces (always captured for workflows)
 *
 * We NEVER collect:
 * - Personal information
 * - Workflow content or outputs
 * - API keys or tokens
 * - IP addresses or geolocation data
 */
import { env } from './lib/core/config/env'

const config = {
  /**
   * OTLP Endpoint URL where telemetry data is sent
   * Change this if you want to send telemetry to your own collector
   * Supports any OTLP-compatible backend (Jaeger, Grafana Tempo, etc.)
   */
  endpoint: env.TELEMETRY_ENDPOINT || 'https://telemetry.simstudio.ai/v1/traces',

  /**
   * Service name used to identify this instance
   * You can change this for your fork
   */
  serviceName: 'sim-studio',

  /**
   * Version of the service, defaults to the app version
   */
  serviceVersion: '0.1.0',

  /**
   * Batch settings for OpenTelemetry BatchSpanProcessor
   * Optimized for production use with minimal overhead
   *
   * - maxQueueSize: Max number of spans to buffer (increased from 100 to 2048)
   * - maxExportBatchSize: Max number of spans per batch (increased from 10 to 512)
   * - scheduledDelayMillis: Delay between batches (5 seconds)
   * - exportTimeoutMillis: Timeout for exporting data (30 seconds)
   */
  batchSettings: {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
  },

  /**
   * Sampling configuration
   * - Errors: Always sampled (100%)
   * - AI/LLM operations: Always sampled (100%)
   * - Other operations: Sampled at 10%
   */
  sampling: {
    defaultRate: 0.1, // 10% sampling for regular operations
    alwaysSampleErrors: true,
    alwaysSampleAI: true,
  },

  /**
   * Categories of events that can be collected
   * This is used for validation when events are sent
   */
  allowedCategories: [
    'page_view',
    'feature_usage',
    'performance',
    'error',
    'workflow',
    'consent',
    'batch', // Added for batched events
  ],

  /**
   * Client-side instrumentation settings
   * Set enabled: false to disable client-side telemetry entirely
   *
   * Client-side telemetry now uses:
   * - Event batching (send every 10s or 50 events)
   * - Only critical Web Vitals (LCP, FID, CLS)
   * - Unhandled errors only
   */
  clientSide: {
    enabled: true,
    batchIntervalMs: 10000, // 10 seconds
    maxBatchSize: 50,
  },

  /**
   * Server-side instrumentation settings
   * Set enabled: false to disable server-side telemetry entirely
   *
   * Server-side telemetry uses:
   * - OpenTelemetry SDK with BatchSpanProcessor
   * - Intelligent sampling (errors and AI ops always captured)
   * - Semantic conventions for AI/LLM operations
   */
  serverSide: {
    enabled: true,
  },
}

export default config
```

--------------------------------------------------------------------------------

---[FILE: trigger.config.ts]---
Location: sim-main/apps/sim/trigger.config.ts

```typescript
import { additionalPackages } from '@trigger.dev/build/extensions/core'
import { defineConfig } from '@trigger.dev/sdk'
import { env } from './lib/core/config/env'

export default defineConfig({
  project: env.TRIGGER_PROJECT_ID!,
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 600,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 1,
    },
  },
  dirs: ['./background'],
  build: {
    extensions: [
      additionalPackages({
        packages: ['unpdf'],
      }),
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: sim-main/apps/sim/tsconfig.json
Signals: React, Next.js

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2022", "dom", "dom.iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["./lib/*"],
      "@/stores": ["./stores"],
      "@/stores/*": ["./stores/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/blocks": ["./blocks"],
      "@/blocks/*": ["./blocks/*"],
      "@/providers/*": ["./providers/*"],
      "@/providers": ["./providers"],
      "@/tools": ["./tools"],
      "@/tools/*": ["./tools/*"],
      "@/serializer": ["./serializer"],
      "@/serializer/*": ["./serializer/*"],
      "@sim/db": ["../../packages/db"],
      "@sim/db/*": ["../../packages/db/*"],
      "@/executor": ["./executor"],
      "@/executor/*": ["./executor/*"]
    },
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "../next-env.d.ts",
    "telemetry.config.js",
    "trigger.config.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: vitest.config.ts]---
Location: sim-main/apps/sim/vitest.config.ts

```typescript
import path from 'path'
/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

const nextEnv = require('@next/env')
const { loadEnvConfig } = nextEnv.default || nextEnv

const projectDir = process.cwd()
loadEnvConfig(projectDir)

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.{ts,tsx}'],
    exclude: [...configDefaults.exclude, '**/node_modules/**', '**/dist/**'],
    setupFiles: ['./vitest.setup.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        useAtomics: true,
        isolate: true,
      },
    },
    fileParallelism: true,
    maxConcurrency: 20,
    testTimeout: 10000,
    deps: {
      optimizer: {
        web: {
          enabled: true,
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@sim/db',
        replacement: path.resolve(__dirname, '../../packages/db'),
      },
      {
        find: '@/lib/logs/console/logger',
        replacement: path.resolve(__dirname, 'lib/logs/console/logger.ts'),
      },
      {
        find: '@/stores/console/store',
        replacement: path.resolve(__dirname, 'stores/console/store.ts'),
      },
      {
        find: '@/stores/execution/store',
        replacement: path.resolve(__dirname, 'stores/execution/store.ts'),
      },
      {
        find: '@/blocks/types',
        replacement: path.resolve(__dirname, 'blocks/types.ts'),
      },
      {
        find: '@/serializer/types',
        replacement: path.resolve(__dirname, 'serializer/types.ts'),
      },
      { find: '@/lib', replacement: path.resolve(__dirname, 'lib') },
      { find: '@/stores', replacement: path.resolve(__dirname, 'stores') },
      {
        find: '@/components',
        replacement: path.resolve(__dirname, 'components'),
      },
      { find: '@/app', replacement: path.resolve(__dirname, 'app') },
      { find: '@/api', replacement: path.resolve(__dirname, 'app/api') },
      {
        find: '@/executor',
        replacement: path.resolve(__dirname, 'executor'),
      },
      {
        find: '@/providers',
        replacement: path.resolve(__dirname, 'providers'),
      },
      { find: '@/tools', replacement: path.resolve(__dirname, 'tools') },
      { find: '@/blocks', replacement: path.resolve(__dirname, 'blocks') },
      {
        find: '@/serializer',
        replacement: path.resolve(__dirname, 'serializer'),
      },
      { find: '@', replacement: path.resolve(__dirname) },
    ],
  },
})
```

--------------------------------------------------------------------------------

---[FILE: vitest.setup.ts]---
Location: sim-main/apps/sim/vitest.setup.ts

```typescript
import { afterAll, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as any

// Mock localStorage and sessionStorage for Zustand persist middleware
const storageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

global.localStorage = storageMock as any
global.sessionStorage = storageMock as any

// Mock drizzle-orm sql template literal globally for tests
vi.mock('drizzle-orm', () => ({
  sql: vi.fn((strings, ...values) => ({
    strings,
    values,
    type: 'sql',
    _: { brand: 'SQL' },
  })),
  eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
  and: vi.fn((...conditions) => ({ type: 'and', conditions })),
  desc: vi.fn((field) => ({ field, type: 'desc' })),
  or: vi.fn((...conditions) => ({ type: 'or', conditions })),
  InferSelectModel: {},
  InferInsertModel: {},
}))

vi.mock('@/lib/logs/console/logger', () => {
  const createLogger = vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  }))

  return { createLogger }
})

vi.mock('@/stores/console/store', () => ({
  useConsoleStore: {
    getState: vi.fn().mockReturnValue({
      addConsole: vi.fn(),
    }),
  },
}))

vi.mock('@/stores/terminal', () => ({
  useTerminalConsoleStore: {
    getState: vi.fn().mockReturnValue({
      addConsole: vi.fn(),
      updateConsole: vi.fn(),
    }),
  },
}))

vi.mock('@/stores/execution/store', () => ({
  useExecutionStore: {
    getState: vi.fn().mockReturnValue({
      setIsExecuting: vi.fn(),
      setIsDebugging: vi.fn(),
      setPendingBlocks: vi.fn(),
      reset: vi.fn(),
      setActiveBlocks: vi.fn(),
    }),
  },
}))

vi.mock('@/blocks/registry', () => ({
  getBlock: vi.fn(() => ({
    name: 'Mock Block',
    description: 'Mock block description',
    icon: () => null,
    subBlocks: [],
    outputs: {},
  })),
  getAllBlocks: vi.fn(() => ({})),
}))

vi.mock('@trigger.dev/sdk', () => ({
  task: vi.fn(() => ({ trigger: vi.fn() })),
  tasks: {
    trigger: vi.fn().mockResolvedValue({ id: 'mock-task-id' }),
    batchTrigger: vi.fn().mockResolvedValue([{ id: 'mock-task-id' }]),
  },
  runs: {
    retrieve: vi.fn().mockResolvedValue({ id: 'mock-run-id', status: 'COMPLETED' }),
  },
  configure: vi.fn(),
}))

const originalConsoleError = console.error
const originalConsoleWarn = console.warn

console.error = (...args: any[]) => {
  if (args[0] === 'Workflow execution failed:' && args[1]?.message === 'Test error') {
    return
  }
  if (typeof args[0] === 'string' && args[0].includes('[zustand persist middleware]')) {
    return
  }
  originalConsoleError(...args)
}

console.warn = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('[zustand persist middleware]')) {
    return
  }
  originalConsoleWarn(...args)
}

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})
```

--------------------------------------------------------------------------------

---[FILE: global-error.tsx]---
Location: sim-main/apps/sim/app/global-error.tsx
Signals: Next.js

```typescript
'use client'

import NextError from 'next/error'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang='en'>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/layout.tsx
Signals: Next.js

```typescript
import type { Metadata, Viewport } from 'next'
import { PublicEnvScript } from 'next-runtime-env'
import { BrandedLayout } from '@/components/branded-layout'
import { generateThemeCSS } from '@/lib/branding/inject-theme'
import { generateBrandedMetadata, generateStructuredData } from '@/lib/branding/metadata'
import { PostHogProvider } from '@/app/_shell/providers/posthog-provider'
import '@/app/_styles/globals.css'

import { OneDollarStats } from '@/components/analytics/onedollarstats'
import { HydrationErrorHandler } from '@/app/_shell/hydration-error-handler'
import { QueryProvider } from '@/app/_shell/providers/query-provider'
import { SessionProvider } from '@/app/_shell/providers/session-provider'
import { ThemeProvider } from '@/app/_shell/providers/theme-provider'
import { ZoomPrevention } from '@/app/_shell/zoom-prevention'
import { season } from '@/app/_styles/fonts/season/season'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0c' },
  ],
}

export const metadata: Metadata = generateBrandedMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = generateStructuredData()
  const themeCSS = generateThemeCSS()

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Structured Data for SEO */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Workspace layout dimensions: set CSS vars before hydration to avoid layout jump */}
        <script
          id='workspace-layout-dimensions'
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var path = window.location.pathname;
                  if (path.indexOf('/workspace/') === -1) {
                    return;
                  }
                } catch (e) {
                  return;
                }

                // Sidebar width
                try {
                  var stored = localStorage.getItem('sidebar-state');
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    var state = parsed && parsed.state;
                    var width = state && state.sidebarWidth;
                    var maxSidebarWidth = window.innerWidth * 0.3;

                    if (width >= 232 && width <= maxSidebarWidth) {
                      document.documentElement.style.setProperty('--sidebar-width', width + 'px');
                    } else if (width > maxSidebarWidth) {
                      document.documentElement.style.setProperty('--sidebar-width', maxSidebarWidth + 'px');
                    }
                  }
                } catch (e) {
                  // Fallback handled by CSS defaults
                }

                // Panel width and active tab
                try {
                  var panelStored = localStorage.getItem('panel-state');
                  if (panelStored) {
                    var panelParsed = JSON.parse(panelStored);
                    var panelState = panelParsed && panelParsed.state;
                    var panelWidth = panelState && panelState.panelWidth;
                    var maxPanelWidth = window.innerWidth * 0.4;

                    if (panelWidth >= 244 && panelWidth <= maxPanelWidth) {
                      document.documentElement.style.setProperty('--panel-width', panelWidth + 'px');
                    } else if (panelWidth > maxPanelWidth) {
                      document.documentElement.style.setProperty('--panel-width', maxPanelWidth + 'px');
                    }

                    var activeTab = panelState && panelState.activeTab;
                    if (activeTab) {
                      document.documentElement.setAttribute('data-panel-active-tab', activeTab);
                    }
                  }
                } catch (e) {
                  // Fallback handled by CSS defaults
                }

                // Toolbar triggers height
                try {
                  var toolbarStored = localStorage.getItem('toolbar-state');
                  if (toolbarStored) {
                    var toolbarParsed = JSON.parse(toolbarStored);
                    var toolbarState = toolbarParsed && toolbarParsed.state;
                    var toolbarTriggersHeight = toolbarState && toolbarState.toolbarTriggersHeight;
                    if (
                      toolbarTriggersHeight !== undefined &&
                      toolbarTriggersHeight >= 30 &&
                      toolbarTriggersHeight <= 800
                    ) {
                      document.documentElement.style.setProperty(
                        '--toolbar-triggers-height',
                        toolbarTriggersHeight + 'px'
                      );
                    }
                  }
                } catch (e) {
                  // Fallback handled by CSS defaults
                }

                // Editor connections height
                try {
                  var editorStored = localStorage.getItem('panel-editor-state');
                  if (editorStored) {
                    var editorParsed = JSON.parse(editorStored);
                    var editorState = editorParsed && editorParsed.state;
                    var connectionsHeight = editorState && editorState.connectionsHeight;
                    if (connectionsHeight !== undefined && connectionsHeight >= 30 && connectionsHeight <= 300) {
                      document.documentElement.style.setProperty(
                        '--editor-connections-height',
                        connectionsHeight + 'px'
                      );
                    }
                  }
                } catch (e) {
                  // Fallback handled by CSS defaults
                }

                // Terminal height
                try {
                  var terminalStored = localStorage.getItem('terminal-state');
                  if (terminalStored) {
                    var terminalParsed = JSON.parse(terminalStored);
                    var terminalState = terminalParsed && terminalParsed.state;
                    var terminalHeight = terminalState && terminalState.terminalHeight;
                    var maxTerminalHeight = window.innerHeight * 0.7;

                    if (terminalHeight >= 30 && terminalHeight <= maxTerminalHeight) {
                      document.documentElement.style.setProperty('--terminal-height', terminalHeight + 'px');
                    } else if (terminalHeight > maxTerminalHeight) {
                      document.documentElement.style.setProperty('--terminal-height', maxTerminalHeight + 'px');
                    }
                  }
                } catch (e) {
                  // Fallback handled by CSS defaults
                }
              })();
            `,
          }}
        />

        {/* Theme CSS Override */}
        {themeCSS && (
          <style
            id='theme-override'
            dangerouslySetInnerHTML={{
              __html: themeCSS,
            }}
          />
        )}

        {/* Basic head hints that are not covered by the Metadata API */}
        <meta name='color-scheme' content='light dark' />
        <meta name='format-detection' content='telephone=no' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />

        {/* OneDollarStats Analytics */}
        <script defer src='https://assets.onedollarstats.com/stonks.js' />

        <PublicEnvScript />
      </head>
      <body className={`${season.variable} font-season`} suppressHydrationWarning>
        <HydrationErrorHandler />
        <OneDollarStats />
        <PostHogProvider>
          <ThemeProvider>
            <QueryProvider>
              <SessionProvider>
                <BrandedLayout>
                  <ZoomPrevention />
                  {children}
                </BrandedLayout>
              </SessionProvider>
            </QueryProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: manifest.ts]---
Location: sim-main/apps/sim/app/manifest.ts
Signals: Next.js

```typescript
import type { MetadataRoute } from 'next'
import { getBrandConfig } from '@/lib/branding/branding'

export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandConfig()

  return {
    name: brand.name === 'Sim' ? 'Sim - AI Agent Workflow Builder' : brand.name,
    short_name: brand.name,
    description:
      'Open-source AI agent workflow builder. 30,000+ developers build and deploy agentic workflows on Sim. Visual drag-and-drop interface for creating AI automations. SOC2 and HIPAA compliant.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: brand.theme?.primaryColor || '#6F3DFA',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'developer', 'business'],
    shortcuts: [
      {
        name: 'Create Workflow',
        short_name: 'New',
        description: 'Create a new AI workflow',
        url: '/workspace',
      },
    ],
    lang: 'en-US',
    dir: 'ltr',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: sim-main/apps/sim/app/not-found.tsx
Signals: React, Next.js

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBrandConfig } from '@/lib/branding/branding'
import { inter } from '@/app/_styles/fonts/inter/inter'
import { soehne } from '@/app/_styles/fonts/soehne/soehne'
import Nav from '@/app/(landing)/components/nav/nav'

export default function NotFound() {
  const [buttonClass, setButtonClass] = useState('auth-button-gradient')
  const brandConfig = useBrandConfig()
  const router = useRouter()

  useEffect(() => {
    const root = document.documentElement
    const hadDark = root.classList.contains('dark')
    const hadLight = root.classList.contains('light')
    root.classList.add('light')
    root.classList.remove('dark')
    return () => {
      if (!hadLight) root.classList.remove('light')
      if (hadDark) root.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    const checkCustomBrand = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      const brandAccent = computedStyle.getPropertyValue('--brand-accent-hex').trim()
      if (brandAccent && brandAccent !== '#6f3dfa') {
        setButtonClass('auth-button-custom')
      } else {
        setButtonClass('auth-button-gradient')
      }
    }
    checkCustomBrand()
    window.addEventListener('resize', checkCustomBrand)
    const observer = new MutationObserver(checkCustomBrand)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => {
      window.removeEventListener('resize', checkCustomBrand)
      observer.disconnect()
    }
  }, [])

  return (
    <div className='min-h-screen bg-white'>
      <Nav variant='auth' />
      <div className='flex min-h-[calc(100vh-120px)] items-center justify-center px-4'>
        <div className='w-full max-w-[410px]'>
          <div className='flex flex-col items-center justify-center'>
            <div className='space-y-1 text-center'>
              <h1
                className={`${soehne.className} font-medium text-[32px] text-black tracking-tight`}
              >
                Page Not Found
              </h1>
              <p className={`${inter.className} font-[380] text-[16px] text-muted-foreground`}>
                The page you’re looking for doesn’t exist or has been moved.
              </p>
            </div>

            <div className='mt-8 w-full space-y-3'>
              <Button
                type='button'
                onClick={() => router.push('/')}
                className={`${buttonClass} flex w-full items-center justify-center gap-2 rounded-[10px] border font-medium text-[15px] text-white transition-all duration-200`}
              >
                Return to Home
              </Button>
            </div>

            <div
              className={`${inter.className} auth-text-muted fixed right-0 bottom-0 left-0 z-50 pb-8 text-center font-[340] text-[13px] leading-relaxed`}
            >
              Need help?{' '}
              <a
                href={`mailto:${brandConfig.supportEmail}`}
                className='auth-link underline-offset-4 transition hover:underline'
              >
                Contact support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: sim-main/apps/sim/app/page.tsx
Signals: Next.js

```typescript
import type { Metadata } from 'next'
import { getBaseUrl } from '@/lib/core/utils/urls'
import Landing from '@/app/(landing)/landing'

const baseUrl = getBaseUrl()

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Sim - AI Agent Workflow Builder | Open Source Platform',
  description:
    'Open-source AI agent workflow builder used by 60,000+ developers. Build and deploy agentic workflows with a visual drag-and-drop canvas. Connect 100+ apps and ship SOC2 & HIPAA-ready AI automations from startups to Fortune 500.',
  keywords:
    'AI agent workflow builder, agentic workflows, open source AI, visual workflow builder, AI automation, LLM workflows, AI agents, workflow automation, no-code AI, SOC2 compliant, HIPAA compliant, enterprise AI',
  authors: [{ name: 'Sim Studio' }],
  creator: 'Sim Studio',
  publisher: 'Sim Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Sim - AI Agent Workflow Builder | Open Source',
    description:
      'Open-source platform used by 60,000+ developers. Design, deploy, and monitor agentic workflows with a visual drag-and-drop interface, 100+ integrations, and enterprise-grade security.',
    type: 'website',
    url: baseUrl,
    siteName: 'Sim',
    locale: 'en_US',
    images: [
      {
        url: '/social/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sim - Visual AI Workflow Builder',
        type: 'image/png',
      },
      {
        url: '/social/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Sim Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@simdotai',
    creator: '@simdotai',
    title: 'Sim - AI Agent Workflow Builder | Open Source',
    description:
      'Open-source platform for agentic workflows. 60,000+ developers. Visual builder. 100+ integrations. SOC2 & HIPAA compliant.',
    images: {
      url: '/social/twitter-image.png',
      alt: 'Sim - Visual AI Workflow Builder',
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  classification: 'AI Development Tools',
  referrer: 'origin-when-cross-origin',
  // LLM SEO optimizations
  other: {
    'llm:content-type': 'AI workflow builder, visual programming, no-code AI development',
    'llm:use-cases':
      'email automation, Slack bots, Discord moderation, data analysis, customer support, content generation, agentic automations',
    'llm:integrations':
      'OpenAI, Anthropic, Google AI, Slack, Gmail, Discord, Notion, Airtable, Supabase',
    'llm:pricing': 'free tier available, pro $20/month, team $40/month, enterprise custom',
    'llm:region': 'global',
    'llm:languages': 'en',
  },
}

export default function Page() {
  return <Landing />
}
```

--------------------------------------------------------------------------------

---[FILE: sitemap.ts]---
Location: sim-main/apps/sim/app/sitemap.ts
Signals: Next.js

```typescript
import type { MetadataRoute } from 'next'
import { getAllPostMeta } from '@/lib/blog/registry'
import { getBaseUrl } from '@/lib/core/utils/urls'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: now,
      priority: 0.9, // Blog index - high value content
    },
    {
      url: `${baseUrl}/studio/tags`,
      lastModified: now,
      priority: 0.7, // Tags page - discovery/navigation
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: now,
      priority: 0.8, // Templates - important discovery page
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: now,
      priority: 0.8, // Changelog - important for users
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: new Date('2024-10-06'),
      priority: 0.6, // Careers - important but not core content
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2024-10-14'),
      priority: 0.5, // Terms - utility page
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2024-10-14'),
      priority: 0.5, // Privacy - utility page
    },
  ]

  const posts = await getAllPostMeta()
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: p.canonical,
    lastModified: new Date(p.updated ?? p.date),
    priority: 0.9, // Blog posts - high value content
  }))

  return [...staticPages, ...blogPages]
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: sim-main/apps/sim/app/(auth)/layout.tsx
Signals: React

```typescript
'use client'

import { useEffect } from 'react'
import AuthBackground from '@/app/(auth)/components/auth-background'
import Nav from '@/app/(landing)/components/nav/nav'

// Helper to detect if a color is dark
function isColorDark(hexColor: string): boolean {
  const hex = hexColor.replace('#', '')
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if brand background is dark and add class accordingly
    const rootStyle = getComputedStyle(document.documentElement)
    const brandBackground = rootStyle.getPropertyValue('--brand-background-hex').trim()

    if (brandBackground && isColorDark(brandBackground)) {
      document.body.classList.add('auth-dark-bg')
    } else {
      document.body.classList.remove('auth-dark-bg')
    }
  }, [])
  return (
    <AuthBackground>
      <main className='relative flex min-h-screen flex-col text-foreground'>
        {/* Header - Nav handles all conditional logic */}
        <Nav hideAuthButtons={true} variant='auth' />

        {/* Content */}
        <div className='relative z-30 flex flex-1 items-center justify-center px-4 pb-24'>
          <div className='w-full max-w-lg px-4'>{children}</div>
        </div>
      </main>
    </AuthBackground>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: auth-background-svg.tsx]---
Location: sim-main/apps/sim/app/(auth)/components/auth-background-svg.tsx

```typescript
export default function AuthBackgroundSVG() {
  return (
    <svg
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 h-full w-full'
      style={{ zIndex: 5 }}
      viewBox='0 0 1880 960'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      preserveAspectRatio='xMidYMid slice'
    >
      {/* Right side paths - extended to connect */}
      <path
        d='M1393.53 42.8889C1545.99 173.087 1688.28 339.75 1878.44 817.6'
        stroke='#E7E4EF'
        strokeWidth='2'
      />
      <path d='M1624.21 960L1625.78 0' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1832.67 715.81L1880 716.031' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M1393.4 40V0' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1393.03' cy='40.0186' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1625.28' cy='303.147' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='1837.37' cy='715.81' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />

      {/* Left side paths - extended to connect */}
      <path
        d='M160 157.764C319.811 136.451 417.278 102.619 552.39 0'
        stroke='#E7E4EF'
        strokeWidth='2'
      />
      <path d='M310.22 803.025V0' stroke='#E7E4EF' strokeWidth='2' />
      <path
        d='M160 530.184C256.142 655.353 308.338 749.141 348.382 960'
        stroke='#E7E4EF'
        strokeWidth='2'
      />
      <path d='M160 157.764V960' stroke='#E7E4EF' strokeWidth='2' />
      <path d='M-50 157.764L160 157.764' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='160' cy='157.764' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='310.22' cy='803.025' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
      <circle cx='160' cy='530.184' r='8.07846' fill='white' stroke='#E7E4EF' strokeWidth='2' />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: auth-background.tsx]---
Location: sim-main/apps/sim/app/(auth)/components/auth-background.tsx

```typescript
import { cn } from '@/lib/core/utils/cn'
import AuthBackgroundSVG from '@/app/(auth)/components/auth-background-svg'

type AuthBackgroundProps = {
  className?: string
  children?: React.ReactNode
}

export default function AuthBackground({ className, children }: AuthBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden', className)}>
      <AuthBackgroundSVG />
      <div className='relative z-20'>{children}</div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: oauth-provider-checker.tsx]---
Location: sim-main/apps/sim/app/(auth)/components/oauth-provider-checker.tsx

```typescript
'use server'

import { env } from '@/lib/core/config/env'
import { isProd } from '@/lib/core/config/feature-flags'

export async function getOAuthProviderStatus() {
  const githubAvailable = !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)

  const googleAvailable = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)

  return { githubAvailable, googleAvailable, isProduction: isProd }
}
```

--------------------------------------------------------------------------------

---[FILE: social-login-buttons.tsx]---
Location: sim-main/apps/sim/app/(auth)/components/social-login-buttons.tsx
Signals: React

```typescript
'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { GithubIcon, GoogleIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { client } from '@/lib/auth/auth-client'
import { inter } from '@/app/_styles/fonts/inter/inter'

interface SocialLoginButtonsProps {
  githubAvailable: boolean
  googleAvailable: boolean
  callbackURL?: string
  isProduction: boolean
  children?: ReactNode
}

export function SocialLoginButtons({
  githubAvailable,
  googleAvailable,
  callbackURL = '/workspace',
  isProduction,
  children,
}: SocialLoginButtonsProps) {
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render on the client side to avoid hydration errors
  if (!mounted) return null

  async function signInWithGithub() {
    if (!githubAvailable) return

    setIsGithubLoading(true)
    try {
      await client.signIn.social({ provider: 'github', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with GitHub'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'GitHub sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsGithubLoading(false)
    }
  }

  async function signInWithGoogle() {
    if (!googleAvailable) return

    setIsGoogleLoading(true)
    try {
      await client.signIn.social({ provider: 'google', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Google'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'Google sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const githubButton = (
    <Button
      variant='outline'
      className='w-full rounded-[10px] shadow-sm hover:bg-gray-50'
      disabled={!githubAvailable || isGithubLoading}
      onClick={signInWithGithub}
    >
      <GithubIcon className='!h-[18px] !w-[18px] mr-1' />
      {isGithubLoading ? 'Connecting...' : 'GitHub'}
    </Button>
  )

  const googleButton = (
    <Button
      variant='outline'
      className='w-full rounded-[10px] shadow-sm hover:bg-gray-50'
      disabled={!googleAvailable || isGoogleLoading}
      onClick={signInWithGoogle}
    >
      <GoogleIcon className='!h-[18px] !w-[18px] mr-1' />
      {isGoogleLoading ? 'Connecting...' : 'Google'}
    </Button>
  )

  const hasAnyOAuthProvider = githubAvailable || googleAvailable

  if (!hasAnyOAuthProvider && !children) {
    return null
  }

  return (
    <div className={`${inter.className} grid gap-3 font-light`}>
      {googleAvailable && googleButton}
      {githubAvailable && githubButton}
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
