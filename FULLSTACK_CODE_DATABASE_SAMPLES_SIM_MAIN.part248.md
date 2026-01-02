---
source_txt: fullstack_samples/sim-main
converted_utc: 2025-12-18T11:26:35Z
part: 248
parts_total: 933
---

# FULLSTACK CODE DATABASE SAMPLES sim-main

## Verbatim Content (Part 248 of 933)

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

---[FILE: instrumentation-client.ts]---
Location: sim-main/apps/sim/instrumentation-client.ts

```typescript
/**
 * Sim Telemetry - Client-side Instrumentation
 */

import { env } from './lib/core/config/env'

if (typeof window !== 'undefined') {
  const TELEMETRY_STATUS_KEY = 'simstudio-telemetry-status'
  const BATCH_INTERVAL_MS = 10000 // Send batches every 10 seconds
  const MAX_BATCH_SIZE = 50 // Max events per batch
  let telemetryEnabled = true
  const eventBatch: any[] = []
  let batchTimer: NodeJS.Timeout | null = null

  try {
    if (env.NEXT_TELEMETRY_DISABLED === '1') {
      telemetryEnabled = false
    } else {
      const storedPreference = localStorage.getItem(TELEMETRY_STATUS_KEY)
      if (storedPreference) {
        const status = JSON.parse(storedPreference)
        telemetryEnabled = status.enabled
      }
    }
  } catch (_e) {
    telemetryEnabled = false
  }

  /**
   * Add event to batch and schedule flush
   */
  function addToBatch(event: any): void {
    if (!telemetryEnabled) return

    eventBatch.push(event)

    if (eventBatch.length >= MAX_BATCH_SIZE) {
      flushBatch()
    } else if (!batchTimer) {
      batchTimer = setTimeout(flushBatch, BATCH_INTERVAL_MS)
    }
  }

  /**
   * Sanitize event data to remove sensitive information
   */
  function sanitizeEvent(event: any): any {
    const patterns = ['password', 'token', 'secret', 'key', 'auth', 'credential', 'private']
    const sensitiveRe = new RegExp(patterns.join('|'), 'i')

    const scrubString = (s: string) => (s && sensitiveRe.test(s) ? '[redacted]' : s)

    if (event == null) return event
    if (typeof event === 'string') return scrubString(event)
    if (typeof event !== 'object') return event

    if (Array.isArray(event)) {
      return event.map((item) => sanitizeEvent(item))
    }

    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(event)) {
      const lowerKey = key.toLowerCase()
      if (patterns.some((p) => lowerKey.includes(p))) continue

      if (typeof value === 'string') sanitized[key] = scrubString(value)
      else if (Array.isArray(value)) sanitized[key] = value.map((v) => sanitizeEvent(v))
      else if (value && typeof value === 'object') sanitized[key] = sanitizeEvent(value)
      else sanitized[key] = value
    }

    return sanitized
  }

  /**
   * Flush batch of events to server
   */
  function flushBatch(): void {
    if (eventBatch.length === 0) return

    const batch = eventBatch.splice(0, eventBatch.length)
    if (batchTimer) {
      clearTimeout(batchTimer)
      batchTimer = null
    }

    const sanitizedBatch = batch.map(sanitizeEvent)

    const payload = JSON.stringify({
      category: 'batch',
      action: 'client_events',
      events: sanitizedBatch,
      timestamp: Date.now(),
    })

    const payloadSize = new Blob([payload]).size
    const MAX_BEACON_SIZE = 64 * 1024 // 64KB

    if (navigator.sendBeacon && payloadSize < MAX_BEACON_SIZE) {
      const sent = navigator.sendBeacon('/api/telemetry', payload)

      if (!sent) {
        fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Silently fail
        })
      }
    } else {
      fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently fail
      })
    }
  }

  window.addEventListener('beforeunload', flushBatch)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushBatch()
    }
  })

  /**
   * Global event tracking function
   */

  ;(window as any).__SIM_TELEMETRY_ENABLED = telemetryEnabled
  ;(window as any).__SIM_TRACK_EVENT = (eventName: string, properties?: any) => {
    if (!telemetryEnabled) return

    addToBatch({
      category: 'feature_usage',
      action: eventName,
      timestamp: Date.now(),
      ...(properties || {}),
    })
  }

  if (telemetryEnabled) {
    const shouldTrackVitals = Math.random() < 0.1

    if (shouldTrackVitals) {
      window.addEventListener(
        'load',
        () => {
          if (typeof PerformanceObserver !== 'undefined') {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries()
              const lastEntry = entries[entries.length - 1]

              if (lastEntry) {
                addToBatch({
                  category: 'performance',
                  action: 'web_vital',
                  label: 'LCP',
                  value: (lastEntry as any).startTime || 0,
                  entryType: 'largest-contentful-paint',
                  timestamp: Date.now(),
                })
              }

              lcpObserver.disconnect()
            })

            let clsValue = 0
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value || 0
                }
              }
            })

            const fidObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries()

              for (const entry of entries) {
                const fidValue =
                  ((entry as any).processingStart || 0) - ((entry as any).startTime || 0)

                addToBatch({
                  category: 'performance',
                  action: 'web_vital',
                  label: 'FID',
                  value: fidValue,
                  entryType: 'first-input',
                  timestamp: Date.now(),
                })
              }

              fidObserver.disconnect()
            })

            window.addEventListener('beforeunload', () => {
              if (clsValue > 0) {
                addToBatch({
                  category: 'performance',
                  action: 'web_vital',
                  label: 'CLS',
                  value: clsValue,
                  entryType: 'layout-shift',
                  timestamp: Date.now(),
                })
              }
              clsObserver.disconnect()
            })

            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
            clsObserver.observe({ type: 'layout-shift', buffered: true })
            fidObserver.observe({ type: 'first-input', buffered: true })
          }
        },
        { once: true }
      )
    }

    window.addEventListener('error', (event) => {
      if (telemetryEnabled && !event.defaultPrevented) {
        addToBatch({
          category: 'error',
          action: 'unhandled_error',
          message: event.error?.message || event.message || 'Unknown error',
          url: window.location.pathname,
          timestamp: Date.now(),
        })
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      if (telemetryEnabled) {
        addToBatch({
          category: 'error',
          action: 'unhandled_rejection',
          message: event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
          url: window.location.pathname,
          timestamp: Date.now(),
        })
      }
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: instrumentation-edge.ts]---
Location: sim-main/apps/sim/instrumentation-edge.ts

```typescript
/**
 * Sim Telemetry - Edge Runtime Instrumentation
 *
 * This file contains Edge Runtime-compatible instrumentation logic.
 * No Node.js APIs (like process.on, crypto, fs, etc.) are allowed here.
 */

import { createLogger } from './lib/logs/console/logger'

const logger = createLogger('EdgeInstrumentation')

export async function register() {
  try {
    logger.info('Edge Runtime instrumentation initialized')
  } catch (error) {
    logger.error('Failed to initialize Edge Runtime instrumentation', error)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: instrumentation-node.ts]---
Location: sim-main/apps/sim/instrumentation-node.ts

```typescript
/**
 * Sim OpenTelemetry - Server-side Instrumentation
 */

import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api'
import { env } from './lib/core/config/env'
import { createLogger } from './lib/logs/console/logger'

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)

const logger = createLogger('OTelInstrumentation')

const DEFAULT_TELEMETRY_CONFIG = {
  endpoint: env.TELEMETRY_ENDPOINT || 'https://telemetry.simstudio.ai/v1/traces',
  serviceName: 'sim-studio',
  serviceVersion: '0.1.0',
  serverSide: { enabled: true },
  batchSettings: {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
  },
}

/**
 * Initialize OpenTelemetry SDK with proper configuration
 */
async function initializeOpenTelemetry() {
  try {
    if (env.NEXT_TELEMETRY_DISABLED === '1') {
      logger.info('OpenTelemetry disabled via NEXT_TELEMETRY_DISABLED=1')
      return
    }

    let telemetryConfig
    try {
      telemetryConfig = (await import('./telemetry.config')).default
    } catch {
      telemetryConfig = DEFAULT_TELEMETRY_CONFIG
    }

    if (telemetryConfig.serverSide?.enabled === false) {
      logger.info('Server-side OpenTelemetry disabled in config')
      return
    }

    const { NodeSDK } = await import('@opentelemetry/sdk-node')
    const { defaultResource, resourceFromAttributes } = await import('@opentelemetry/resources')
    const { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION, ATTR_DEPLOYMENT_ENVIRONMENT } = await import(
      '@opentelemetry/semantic-conventions/incubating'
    )
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http')
    const { BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-node')
    const { ParentBasedSampler, TraceIdRatioBasedSampler } = await import(
      '@opentelemetry/sdk-trace-base'
    )

    const exporter = new OTLPTraceExporter({
      url: telemetryConfig.endpoint,
      headers: {},
      timeoutMillis: Math.min(telemetryConfig.batchSettings.exportTimeoutMillis, 10000), // Max 10s
      keepAlive: false,
    })

    const spanProcessor = new BatchSpanProcessor(exporter, {
      maxQueueSize: telemetryConfig.batchSettings.maxQueueSize,
      maxExportBatchSize: telemetryConfig.batchSettings.maxExportBatchSize,
      scheduledDelayMillis: telemetryConfig.batchSettings.scheduledDelayMillis,
      exportTimeoutMillis: telemetryConfig.batchSettings.exportTimeoutMillis,
    })

    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: telemetryConfig.serviceName,
        [ATTR_SERVICE_VERSION]: telemetryConfig.serviceVersion,
        [ATTR_DEPLOYMENT_ENVIRONMENT]: env.NODE_ENV || 'development',
        'service.namespace': 'sim-ai-platform',
        'telemetry.sdk.name': 'opentelemetry',
        'telemetry.sdk.language': 'nodejs',
        'telemetry.sdk.version': '1.0.0',
      })
    )

    const sampler = new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(0.1), // 10% sampling for root spans
    })

    const sdk = new NodeSDK({
      resource,
      spanProcessor,
      sampler,
      traceExporter: exporter,
    })

    sdk.start()

    const shutdownHandler = async () => {
      try {
        await sdk.shutdown()
        logger.info('OpenTelemetry SDK shut down successfully')
      } catch (err) {
        logger.error('Error shutting down OpenTelemetry SDK', err)
      }
    }

    process.on('SIGTERM', shutdownHandler)
    process.on('SIGINT', shutdownHandler)

    logger.info('OpenTelemetry instrumentation initialized')
  } catch (error) {
    logger.error('Failed to initialize OpenTelemetry instrumentation', error)
  }
}

export async function register() {
  await initializeOpenTelemetry()
}
```

--------------------------------------------------------------------------------

---[FILE: instrumentation.ts]---
Location: sim-main/apps/sim/instrumentation.ts

```typescript
/**
 * OpenTelemetry Instrumentation Entry Point
 *
 * This is the main entry point for OpenTelemetry instrumentation.
 * It delegates to runtime-specific instrumentation modules.
 */
export async function register() {
  // Load Node.js-specific instrumentation
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const nodeInstrumentation = await import('./instrumentation-node')
    if (nodeInstrumentation.register) {
      await nodeInstrumentation.register()
    }
  }

  // Load Edge Runtime-specific instrumentation
  if (process.env.NEXT_RUNTIME === 'edge') {
    const edgeInstrumentation = await import('./instrumentation-edge')
    if (edgeInstrumentation.register) {
      await edgeInstrumentation.register()
    }
  }

  // Load client instrumentation if we're on the client
  if (typeof window !== 'undefined') {
    await import('./instrumentation-client')
  }
}
```

--------------------------------------------------------------------------------

---[FILE: next.config.ts]---
Location: sim-main/apps/sim/next.config.ts
Signals: Next.js

```typescript
import type { NextConfig } from 'next'
import { env, getEnv, isTruthy } from './lib/core/config/env'
import { isDev, isHosted } from './lib/core/config/feature-flags'
import { getMainCSPPolicy, getWorkflowExecutionCSPPolicy } from './lib/core/security/csp'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'api.stability.ai',
      },
      // Azure Blob Storage
      {
        protocol: 'https',
        hostname: '*.blob.core.windows.net',
      },
      // AWS S3
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // Brand logo domain if configured
      ...(getEnv('NEXT_PUBLIC_BRAND_LOGO_URL')
        ? (() => {
            try {
              return [
                {
                  protocol: 'https' as const,
                  hostname: new URL(getEnv('NEXT_PUBLIC_BRAND_LOGO_URL')!).hostname,
                },
              ]
            } catch {
              return []
            }
          })()
        : []),
      // Brand favicon domain if configured
      ...(getEnv('NEXT_PUBLIC_BRAND_FAVICON_URL')
        ? (() => {
            try {
              return [
                {
                  protocol: 'https' as const,
                  hostname: new URL(getEnv('NEXT_PUBLIC_BRAND_FAVICON_URL')!).hostname,
                },
              ]
            } catch {
              return []
            }
          })()
        : []),
    ],
  },
  typescript: {
    ignoreBuildErrors: isTruthy(env.DOCKER_BUILD),
  },
  output: isTruthy(env.DOCKER_BUILD) ? 'standalone' : undefined,
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  serverExternalPackages: [
    'unpdf',
    'ffmpeg-static',
    'fluent-ffmpeg',
    'pino',
    'pino-pretty',
    'thread-stream',
    'ws',
    'isolated-vm',
  ],
  outputFileTracingIncludes: {
    '/api/tools/stagehand/*': ['./node_modules/ws/**/*'],
  },
  experimental: {
    optimizeCss: true,
    turbopackSourceMaps: false,
    turbopackFileSystemCacheForDev: true,
  },
  ...(isDev && {
    allowedDevOrigins: [
      ...(env.NEXT_PUBLIC_APP_URL
        ? (() => {
            try {
              return [new URL(env.NEXT_PUBLIC_APP_URL).host]
            } catch {
              return []
            }
          })()
        : []),
      'localhost:3000',
      'localhost:3001',
    ],
  }),
  transpilePackages: [
    'prettier',
    '@react-email/components',
    '@react-email/render',
    '@t3-oss/env-nextjs',
    '@t3-oss/env-core',
    '@sim/db',
  ],
  async headers() {
    return [
      {
        // API routes CORS headers
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,OPTIONS,PUT,DELETE',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key',
          },
        ],
      },
      // For workflow execution API endpoints
      {
        source: '/api/workflows/:id/execute',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,OPTIONS,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-API-Key',
          },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          {
            key: 'Content-Security-Policy',
            value: getWorkflowExecutionCSPPolicy(),
          },
        ],
      },
      {
        // Exclude Vercel internal resources and static assets from strict COEP, Google Drive Picker to prevent 'refused to connect' issue
        source: '/((?!_next|_vercel|api|favicon.ico|w/.*|workspace/.*|api/tools/drive).*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        // For main app routes, Google Drive Picker, and Vercel resources - use permissive policies
        source: '/(w/.*|workspace/.*|api/tools/drive|_next/.*|_vercel/.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      // Block access to sourcemap files (defense in depth)
      {
        source: '/(.*)\\.map$',
        headers: [
          {
            key: 'x-robots-tag',
            value: 'noindex',
          },
        ],
      },
      // Apply security headers to routes not handled by middleware runtime CSP
      // Middleware handles: /, /workspace/*, /chat/*
      {
        source: '/((?!workspace|chat$).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: getMainCSPPolicy(),
          },
        ],
      },
    ]
  },
  async redirects() {
    const redirects = []

    // Redirect /building and /blog to /studio (legacy URL support)
    redirects.push(
      {
        source: '/building/:path*',
        destination: 'https://sim.ai/studio/:path*',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: 'https://sim.ai/studio/:path*',
        permanent: true,
      }
    )

    // Move root feeds to studio namespace
    redirects.push(
      {
        source: '/rss.xml',
        destination: '/studio/rss.xml',
        permanent: true,
      },
      {
        source: '/sitemap-images.xml',
        destination: '/studio/sitemap-images.xml',
        permanent: true,
      }
    )

    // Only enable domain redirects for the hosted version
    if (isHosted) {
      redirects.push(
        {
          source: '/((?!api|_next|_vercel|favicon|static|ingest|.*\\..*).*)',
          destination: 'https://www.sim.ai/$1',
          permanent: true,
          has: [{ type: 'host' as const, value: 'simstudio.ai' }],
        },
        {
          source: '/((?!api|_next|_vercel|favicon|static|ingest|.*\\..*).*)',
          destination: 'https://www.sim.ai/$1',
          permanent: true,
          has: [{ type: 'host' as const, value: 'www.simstudio.ai' }],
        }
      )
    }

    return redirects
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
}

export default nextConfig
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: sim-main/apps/sim/package.json
Signals: React, Next.js

```json
{
  "name": "sim",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "engines": {
    "bun": ">=1.2.13",
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "next dev --port 3000",
    "dev:webpack": "next dev --webpack",
    "dev:sockets": "bun run socket-server/index.ts",
    "dev:full": "concurrently -n \"App,Realtime\" -c \"cyan,magenta\" \"bun run dev\" \"bun run dev:sockets\"",
    "build": "next build",
    "start": "next start",
    "prepare": "cd ../.. && bun husky",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "email:dev": "email dev --dir components/emails",
    "type-check": "tsc --noEmit",
    "generate-docs": "bun run ../../scripts/generate-docs.ts"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.39.0",
    "@aws-sdk/client-dynamodb": "3.940.0",
    "@aws-sdk/client-rds-data": "3.940.0",
    "@aws-sdk/client-s3": "^3.779.0",
    "@aws-sdk/client-sqs": "3.947.0",
    "@aws-sdk/lib-dynamodb": "3.940.0",
    "@aws-sdk/s3-request-presigner": "^3.779.0",
    "@azure/communication-email": "1.0.0",
    "@azure/storage-blob": "12.27.0",
    "@better-auth/sso": "1.3.12",
    "@better-auth/stripe": "1.3.12",
    "@browserbasehq/stagehand": "^3.0.5",
    "@cerebras/cerebras_cloud_sdk": "^1.23.0",
    "@e2b/code-interpreter": "^2.0.0",
    "@hookform/resolvers": "^4.1.3",
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/exporter-jaeger": "2.1.0",
    "@opentelemetry/exporter-trace-otlp-http": "^0.200.0",
    "@opentelemetry/resources": "^2.0.0",
    "@opentelemetry/sdk-node": "^0.200.0",
    "@opentelemetry/sdk-trace-base": "2.0.0",
    "@opentelemetry/sdk-trace-node": "2.0.0",
    "@opentelemetry/semantic-conventions": "^1.32.0",
    "@radix-ui/react-alert-dialog": "^1.1.5",
    "@radix-ui/react-avatar": "1.1.10",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.5",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.5",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.3.3",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "1.2.2",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-tooltip": "1.2.8",
    "@radix-ui/react-visually-hidden": "1.2.4",
    "@react-email/components": "^0.0.34",
    "@react-email/render": "2.0.0",
    "@trigger.dev/sdk": "4.1.2",
    "@types/react-window": "2.0.0",
    "@types/three": "0.177.0",
    "better-auth": "1.3.12",
    "binary-extensions": "^2.0.0",
    "browser-image-compression": "^2.0.2",
    "chalk": "5.6.2",
    "cheerio": "1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "croner": "^9.0.0",
    "csv-parse": "6.1.0",
    "date-fns": "4.1.0",
    "encoding": "0.1.13",
    "entities": "6.0.1",
    "framer-motion": "^12.5.0",
    "fuse.js": "7.1.0",
    "gray-matter": "^4.0.3",
    "groq-sdk": "^0.15.0",
    "html-to-text": "^9.0.5",
    "input-otp": "^1.4.2",
    "ioredis": "^5.6.0",
    "jose": "6.0.11",
    "js-tiktoken": "1.0.21",
    "js-yaml": "4.1.0",
    "jszip": "3.10.1",
    "jwt-decode": "^4.0.0",
    "lodash": "4.17.21",
    "lucide-react": "^0.479.0",
    "mammoth": "^1.9.0",
    "mysql2": "3.14.3",
    "nanoid": "^3.3.7",
    "next": "16.1.0-canary.21",
    "next-mdx-remote": "^5.0.0",
    "next-runtime-env": "3.3.0",
    "next-themes": "^0.4.6",
    "officeparser": "^5.2.0",
    "openai": "^4.91.1",
    "papaparse": "5.5.3",
    "posthog-js": "1.268.9",
    "posthog-node": "5.9.2",
    "prismjs": "^1.30.0",
    "react": "19.2.1",
    "react-colorful": "5.6.1",
    "react-dom": "19.2.1",
    "react-hook-form": "^7.54.2",
    "react-markdown": "^10.1.0",
    "react-simple-code-editor": "^0.14.1",
    "react-window": "2.2.3",
    "reactflow": "^11.11.4",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "4.0.1",
    "resend": "^4.1.2",
    "sharp": "0.34.3",
    "socket.io": "^4.8.1",
    "ssh2": "^1.17.0",
    "stripe": "18.5.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "thread-stream": "4.0.0",
    "three": "0.177.0",
    "unpdf": "1.4.0",
    "uuid": "^11.1.0",
    "xlsx": "0.18.5",
    "zod": "^3.24.2",
    "zustand": "^4.5.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@trigger.dev/build": "4.1.2",
    "@types/html-to-text": "9.0.4",
    "@types/js-yaml": "4.0.9",
    "@types/jsdom": "21.1.7",
    "@types/lodash": "^4.17.16",
    "@types/node": "24.2.1",
    "@types/papaparse": "5.3.16",
    "@types/prismjs": "^1.26.5",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/ssh2": "^1.15.5",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^3.0.8",
    "autoprefixer": "10.4.21",
    "concurrently": "^9.1.0",
    "critters": "0.0.25",
    "dotenv": "^16.4.7",
    "jsdom": "^26.0.0",
    "postcss": "^8",
    "react-email": "^4.0.13",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.7.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.8"
  },
  "trustedDependencies": [
    "canvas",
    "better-sqlite3",
    "sharp"
  ],
  "overrides": {
    "next": "16.1.0-canary.21",
    "@next/env": "16.1.0-canary.21",
    "drizzle-orm": "^0.44.5",
    "postgres": "^3.4.5"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: postcss.config.mjs]---
Location: sim-main/apps/sim/postcss.config.mjs

```text
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
}

export default config
```

--------------------------------------------------------------------------------

---[FILE: proxy.ts]---
Location: sim-main/apps/sim/proxy.ts
Signals: Next.js

```typescript
import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'
import { isAuthDisabled, isHosted } from './lib/core/config/feature-flags'
import { generateRuntimeCSP } from './lib/core/security/csp'
import { createLogger } from './lib/logs/console/logger'

const logger = createLogger('Proxy')

const SUSPICIOUS_UA_PATTERNS = [
  /^\s*$/, // Empty user agents
  /\.\./, // Path traversal attempt
  /<\s*script/i, // Potential XSS payloads
  /^\(\)\s*{/, // Command execution attempt
  /\b(sqlmap|nikto|gobuster|dirb|nmap)\b/i, // Known scanning tools
] as const

/**
 * Handles authentication-based redirects for root paths
 */
function handleRootPathRedirects(
  request: NextRequest,
  hasActiveSession: boolean
): NextResponse | null {
  const url = request.nextUrl

  if (url.pathname !== '/') {
    return null
  }

  if (!isHosted) {
    // Self-hosted: Always redirect based on session
    if (hasActiveSession) {
      return NextResponse.redirect(new URL('/workspace', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For root path, redirect authenticated users to workspace
  // Unless they have a 'from' query parameter (e.g., ?from=nav, ?from=settings)
  // This allows intentional navigation to the homepage from anywhere in the app
  if (hasActiveSession) {
    const from = url.searchParams.get('from')
    if (!from) {
      return NextResponse.redirect(new URL('/workspace', request.url))
    }
  }

  return null
}

/**
 * Handles invitation link redirects for unauthenticated users
 */
function handleInvitationRedirects(
  request: NextRequest,
  hasActiveSession: boolean
): NextResponse | null {
  if (!request.nextUrl.pathname.startsWith('/invite/')) {
    return null
  }

  if (
    !hasActiveSession &&
    !request.nextUrl.pathname.endsWith('/login') &&
    !request.nextUrl.pathname.endsWith('/signup') &&
    !request.nextUrl.search.includes('callbackUrl')
  ) {
    const token = request.nextUrl.searchParams.get('token')
    const inviteId = request.nextUrl.pathname.split('/').pop()
    const callbackParam = encodeURIComponent(`/invite/${inviteId}${token ? `?token=${token}` : ''}`)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackParam}&invite_flow=true`, request.url)
    )
  }
  return NextResponse.next()
}

/**
 * Handles workspace invitation API endpoint access
 */
function handleWorkspaceInvitationAPI(
  request: NextRequest,
  hasActiveSession: boolean
): NextResponse | null {
  if (!request.nextUrl.pathname.startsWith('/api/workspaces/invitations')) {
    return null
  }

  if (request.nextUrl.pathname.includes('/accept') && !hasActiveSession) {
    const token = request.nextUrl.searchParams.get('token')
    if (token) {
      return NextResponse.redirect(new URL(`/invite/${token}?token=${token}`, request.url))
    }
  }
  return NextResponse.next()
}

/**
 * Handles security filtering for suspicious user agents
 */
function handleSecurityFiltering(request: NextRequest): NextResponse | null {
  const userAgent = request.headers.get('user-agent') || ''
  const isWebhookEndpoint = request.nextUrl.pathname.startsWith('/api/webhooks/trigger/')
  const isSuspicious = SUSPICIOUS_UA_PATTERNS.some((pattern) => pattern.test(userAgent))

  // Block suspicious requests, but exempt webhook endpoints from User-Agent validation
  if (isSuspicious && !isWebhookEndpoint) {
    logger.warn('Blocked suspicious request', {
      userAgent,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      url: request.url,
      method: request.method,
      pattern: SUSPICIOUS_UA_PATTERNS.find((pattern) => pattern.test(userAgent))?.toString(),
    })

    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Content-Security-Policy': "default-src 'none'",
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  }

  return null
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl

  const sessionCookie = getSessionCookie(request)
  const hasActiveSession = isAuthDisabled || !!sessionCookie

  const redirect = handleRootPathRedirects(request, hasActiveSession)
  if (redirect) return redirect

  if (url.pathname === '/login' || url.pathname === '/signup') {
    if (hasActiveSession) {
      return NextResponse.redirect(new URL('/workspace', request.url))
    }
    const response = NextResponse.next()
    response.headers.set('Content-Security-Policy', generateRuntimeCSP())
    return response
  }

  if (url.pathname.startsWith('/chat/')) {
    return NextResponse.next()
  }

  // Allow public access to template pages for SEO
  if (url.pathname.startsWith('/templates')) {
    return NextResponse.next()
  }

  if (url.pathname.startsWith('/workspace')) {
    // Allow public access to workspace template pages - they handle their own redirects
    if (url.pathname.match(/^\/workspace\/[^/]+\/templates/)) {
      return NextResponse.next()
    }

    if (!hasActiveSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  const invitationRedirect = handleInvitationRedirects(request, hasActiveSession)
  if (invitationRedirect) return invitationRedirect

  const workspaceInvitationRedirect = handleWorkspaceInvitationAPI(request, hasActiveSession)
  if (workspaceInvitationRedirect) return workspaceInvitationRedirect

  const securityBlock = handleSecurityFiltering(request)
  if (securityBlock) return securityBlock

  const response = NextResponse.next()
  response.headers.set('Vary', 'User-Agent')

  if (
    url.pathname.startsWith('/workspace') ||
    url.pathname.startsWith('/chat') ||
    url.pathname === '/'
  ) {
    response.headers.set('Content-Security-Policy', generateRuntimeCSP())
  }

  return response
}

export const config = {
  matcher: [
    '/', // Root path for self-hosted redirect logic
    '/terms', // Whitelabel terms redirect
    '/privacy', // Whitelabel privacy redirect
    '/w', // Legacy /w redirect
    '/w/:path*', // Legacy /w/* redirects
    '/workspace/:path*', // New workspace routes
    '/login',
    '/signup',
    '/invite/:path*', // Match invitation routes
    // Catch-all for other pages, excluding static assets and public directories
    '/((?!_next/static|_next/image|favicon.ico|logo/|static/|footer/|social/|enterprise/|favicon/|twitter/|robots.txt|sitemap.xml).*)',
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: tailwind.config.ts]---
Location: sim-main/apps/sim/tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '!./app/node_modules/**',
    '!**/node_modules/**',
  ],
  theme: {
    extend: {
      fontFamily: {
        season: ['var(--font-season)'],
      },
      fontSize: {
        xs: '11px',
        small: '13px', // Override default 14px to 13px
        base: '15px', // Override default 16px to 15px
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        gradient: {
          primary: 'hsl(var(--gradient-primary))',
          secondary: 'hsl(var(--gradient-secondary))',
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontWeight: {
        base: 'var(--font-weight-base)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionProperty: {
        width: 'width',
        left: 'left',
        padding: 'padding',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'slide-left': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-50%)',
          },
        },
        'slide-right': {
          '0%': {
            transform: 'translateX(-50%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        'dash-animation': {
          from: {
            strokeDashoffset: '0',
          },
          to: {
            strokeDashoffset: '-24',
          },
        },
        'code-shimmer': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        'placeholder-pulse': {
          '0%, 100%': {
            opacity: '0.5',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        'ring-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 0 1.5px var(--border-success)',
          },
          '50%': {
            'box-shadow': '0 0 0 4px var(--border-success)',
          },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'slide-left': 'slide-left 80s linear infinite',
        'slide-right': 'slide-right 80s linear infinite',
        'dash-animation': 'dash-animation 1.5s linear infinite',
        'code-shimmer': 'code-shimmer 1.5s infinite',
        'placeholder-pulse': 'placeholder-pulse 1.5s ease-in-out infinite',
        'ring-pulse': 'ring-pulse 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config
```

--------------------------------------------------------------------------------

````
