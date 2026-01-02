---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 171
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 171 of 695)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - payload-main
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/payload-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: withPayload.ts]---
Location: payload-main/packages/next/src/withPayload/withPayload.ts
Signals: Next.js

```typescript
/* eslint-disable no-console */
/* eslint-disable no-restricted-exports */
import type { NextConfig } from 'next'

import {
  getNextjsVersion,
  supportsTurbopackExternalizeTransitiveDependencies,
} from './withPayload.utils.js'
import { withPayloadLegacy } from './withPayloadLegacy.js'

const poweredByHeader = {
  key: 'X-Powered-By',
  value: 'Next.js, Payload',
}

/**
 * @param {import('next').NextConfig} nextConfig
 * @param {Object} [options] - Optional configuration options
 * @param {boolean} [options.devBundleServerPackages] - Whether to bundle server packages in development mode. @default false
 * */
export const withPayload = (
  nextConfig: NextConfig = {},
  options: { devBundleServerPackages?: boolean } = {},
): NextConfig => {
  const nextjsVersion = getNextjsVersion()

  const supportsTurbopackBuild = supportsTurbopackExternalizeTransitiveDependencies(nextjsVersion)

  const env = nextConfig.env || {}

  if (nextConfig.experimental?.staleTimes?.dynamic) {
    console.warn(
      'Payload detected a non-zero value for the `staleTimes.dynamic` option in your Next.js config. This will slow down page transitions and may cause stale data to load within the Admin panel. To clear this warning, remove the `staleTimes.dynamic` option from your Next.js config or set it to 0. In the future, Next.js may support scoping this option to specific routes.',
    )
    env.NEXT_PUBLIC_ENABLE_ROUTER_CACHE_REFRESH = 'true'
  }

  const baseConfig: NextConfig = {
    ...nextConfig,
    env,
    outputFileTracingExcludes: {
      ...(nextConfig.outputFileTracingExcludes || {}),
      '**/*': [
        ...(nextConfig.outputFileTracingExcludes?.['**/*'] || []),
        'drizzle-kit',
        'drizzle-kit/api',
      ],
    },
    outputFileTracingIncludes: {
      ...(nextConfig.outputFileTracingIncludes || {}),
      '**/*': [...(nextConfig.outputFileTracingIncludes?.['**/*'] || []), '@libsql/client'],
    },
    turbopack: {
      ...(nextConfig.turbopack || {}),
    },
    // We disable the poweredByHeader here because we add it manually in the headers function below
    ...(nextConfig.poweredByHeader !== false ? { poweredByHeader: false } : {}),
    headers: async () => {
      const headersFromConfig = 'headers' in nextConfig ? await nextConfig.headers() : []

      return [
        ...(headersFromConfig || []),
        {
          headers: [
            {
              key: 'Accept-CH',
              value: 'Sec-CH-Prefers-Color-Scheme',
            },
            {
              key: 'Vary',
              value: 'Sec-CH-Prefers-Color-Scheme',
            },
            {
              key: 'Critical-CH',
              value: 'Sec-CH-Prefers-Color-Scheme',
            },
            ...(nextConfig.poweredByHeader !== false ? [poweredByHeader] : []),
          ],
          source: '/:path*',
        },
      ]
    },
    serverExternalPackages: [
      ...(nextConfig.serverExternalPackages || []),
      // WHY: without externalizing graphql, a graphql version error will be thrown
      // during runtime ("Ensure that there is only one instance of \"graphql\" in the node_modules\ndirectory.")
      'graphql',
      ...(process.env.NODE_ENV === 'development' && options.devBundleServerPackages !== true
        ? /**
           * Unless explicitly disabled by the user, by passing `devBundleServerPackages: true` to withPayload, we
           * do not bundle server-only packages during dev for two reasons:
           *
           * 1. Performance: Fewer files to compile means faster compilation speeds.
           * 2. Turbopack support: Webpack's externals are not supported by Turbopack.
           *
           * Regarding Turbopack support: Unlike webpack.externals, we cannot use serverExternalPackages to
           * externalized packages that are not resolvable from the project root. So including a package like
           * "drizzle-kit" in here would do nothing - Next.js will ignore the rule and still bundle the package -
           * because it detects that the package is not resolvable from the project root (= not directly installed
           * by the user in their own package.json).
           *
           * Instead, we can use serverExternalPackages for the entry-point packages that *are* installed directly
           * by the user (e.g. db-postgres, which then installs drizzle-kit as a dependency).
           *
           *
           *
           * We should only do this during development, not build, because externalizing these packages can hurt
           * the bundle size. Not only does it disable tree-shaking, it also risks installing duplicate copies of the
           * same package.
           *
           * Example:
           * - @payloadcms/richtext-lexical (in bundle) -> installs qs-esm (bundled because of importer)
           * - payload (not in bundle, external) -> installs qs-esm (external because of importer)
           * Result: we have two copies of qs-esm installed - one in the bundle, and one in node_modules.
           *
           * During development, these bundle size difference do not matter much, and development speed /
           * turbopack support are more important.
           */
          [
            'payload',
            '@payloadcms/db-mongodb',
            '@payloadcms/db-postgres',
            '@payloadcms/db-sqlite',
            '@payloadcms/db-vercel-postgres',
            '@payloadcms/db-d1-sqlite',
            '@payloadcms/drizzle',
            '@payloadcms/email-nodemailer',
            '@payloadcms/email-resend',
            '@payloadcms/graphql',
            '@payloadcms/payload-cloud',
            '@payloadcms/plugin-redirects',
            // TODO: Add the following packages, excluding their /client subpath exports, once Next.js supports it
            // see: https://github.com/vercel/next.js/discussions/76991
            //'@payloadcms/plugin-cloud-storage',
            //'@payloadcms/plugin-sentry',
            //'@payloadcms/plugin-stripe',
            // @payloadcms/richtext-lexical
            //'@payloadcms/storage-azure',
            //'@payloadcms/storage-gcs',
            //'@payloadcms/storage-s3',
            //'@payloadcms/storage-uploadthing',
            //'@payloadcms/storage-vercel-blob',
          ]
        : []),
    ],
    webpack: (webpackConfig, webpackOptions) => {
      const incomingWebpackConfig =
        typeof nextConfig.webpack === 'function'
          ? nextConfig.webpack(webpackConfig, webpackOptions)
          : webpackConfig

      return {
        ...incomingWebpackConfig,
        externals: [
          ...(incomingWebpackConfig?.externals || []),
          /**
           * See the explanation in the serverExternalPackages section above.
           * We need to force Webpack to emit require() calls for these packages, even though they are not
           * resolvable from the project root. You would expect this to error during runtime, but Next.js seems to be able to require these just fine.
           *
           * This is the only way to get Webpack Build to work, without the bundle size caveats of externalizing the
           * entry point packages, as explained in the serverExternalPackages section above.
           */
          'drizzle-kit',
          'drizzle-kit/api',
          'sharp',
          'libsql',
          'require-in-the-middle',
        ],
        plugins: [
          ...(incomingWebpackConfig?.plugins || []),
          // Fix cloudflare:sockets error: https://github.com/vercel/next.js/discussions/50177
          new webpackOptions.webpack.IgnorePlugin({
            resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
          }),
        ],
        resolve: {
          ...(incomingWebpackConfig?.resolve || {}),
          alias: {
            ...(incomingWebpackConfig?.resolve?.alias || {}),
          },
          fallback: {
            ...(incomingWebpackConfig?.resolve?.fallback || {}),
            /*
             * This fixes the following warning when running next build with webpack (tested on Next.js 16.0.3 with Payload 3.64.0):
             *
             * ⚠ Compiled with warnings in 8.7s
             *
             * ./node_modules/.pnpm/mongodb@6.16.0/node_modules/mongodb/lib/deps.js
             * Module not found: Can't resolve 'aws4' in '/Users/alessio/Documents/temp/next16p/node_modules/.pnpm/mongodb@6.16.0/node_modules/mongodb/lib'
             *
             * Import trace for requested module:
             * ./node_modules/.pnpm/mongodb@6.16.0/node_modules/mongodb/lib/deps.js
             * ./node_modules/.pnpm/mongodb@6.16.0/node_modules/mongodb/lib/client-side-encryption/client_encryption.js
             * ./node_modules/.pnpm/mongodb@6.16.0/node_modules/mongodb/lib/index.js
             * ./node_modules/.pnpm/mongoose@8.15.1/node_modules/mongoose/lib/index.js
             * ./node_modules/.pnpm/mongoose@8.15.1/node_modules/mongoose/index.js
             * ./node_modules/.pnpm/@payloadcms+db-mongodb@3.64.0_payload@3.64.0_graphql@16.12.0_typescript@5.7.3_/node_modules/@payloadcms/db-mongodb/dist/index.js
             * ./src/payload.config.ts
             * ./src/app/my-route/route.ts
             *
             **/
            aws4: false,
          },
        },
      }
    },
  }

  if (nextConfig.basePath) {
    baseConfig.env.NEXT_BASE_PATH = nextConfig.basePath
  }

  if (!supportsTurbopackBuild) {
    return withPayloadLegacy(baseConfig)
  } else {
    return {
      ...baseConfig,
      serverExternalPackages: [
        ...(baseConfig.serverExternalPackages || []),
        'drizzle-kit',
        'drizzle-kit/api',
        'sharp',
        'libsql',
        'require-in-the-middle',
        // Prevents turbopack build errors by the thread-stream package which is installed by pino
        'pino',
      ],
    }
  }
}

export default withPayload
```

--------------------------------------------------------------------------------

---[FILE: withPayload.utils.ts]---
Location: payload-main/packages/next/src/withPayload/withPayload.utils.ts

```typescript
/* eslint-disable no-console */
/**
 * This was taken and modified from https://github.com/getsentry/sentry-javascript/blob/15256034ee8150a5b7dcb97d23eca1a5486f0cae/packages/nextjs/src/config/util.ts
 *
 * MIT License
 *
 * Copyright (c) 2012 Functional Software, Inc. dba Sentry
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

function _parseInt(input: string | undefined): number {
  return parseInt(input || '', 10)
}

/**
 * Represents Semantic Versioning object
 */
type SemVer = {
  buildmetadata?: string
  /**
   * undefined if not a canary version
   */
  canaryVersion?: number
  major?: number
  minor?: number
  patch?: number
  prerelease?: string
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER_REGEXP =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*))*))?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i

/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */
export function parseSemver(input: string): SemVer {
  const match = input.match(SEMVER_REGEXP) || []
  const major = _parseInt(match[1])
  const minor = _parseInt(match[2])
  const patch = _parseInt(match[3])

  const prerelease = match[4]
  const canaryVersion = prerelease?.startsWith('canary.')
    ? parseInt(prerelease.split('.')[1] || '0', 10)
    : undefined

  return {
    buildmetadata: match[5],
    canaryVersion,
    major: isNaN(major) ? undefined : major,
    minor: isNaN(minor) ? undefined : minor,
    patch: isNaN(patch) ? undefined : patch,
    prerelease: match[4],
  }
}

/**
 * Returns the version of Next.js installed in the project, or undefined if it cannot be determined.
 */
export function getNextjsVersion(): SemVer | undefined {
  try {
    let pkgPath: string

    // Check if we're in ESM or CJS environment
    if (typeof import.meta?.resolve === 'function') {
      // ESM environment - use import.meta.resolve
      const pkgUrl = import.meta.resolve('next/package.json')
      // Use fileURLToPath for proper cross-platform path handling (Windows, macOS, Linux)
      // new URL().pathname returns '/C:/path' on Windows which causes path resolution issues
      pkgPath = fileURLToPath(pkgUrl)
    } else {
      // CJS environment - use require.resolve
      pkgPath = require.resolve('next/package.json')
    }

    const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8'))
    return parseSemver(pkgJson.version)
  } catch (e) {
    console.error('Payload: Error getting Next.js version', e)
    return undefined
  }
}

/**
 * Checks if the current Next.js version supports Turbopack externalize transitive dependencies.
 * This was introduced in Next.js v16.1.0-canary.3
 */
export function supportsTurbopackExternalizeTransitiveDependencies(
  version: SemVer | undefined,
): boolean {
  if (!version) {
    return false
  }

  const { canaryVersion, major, minor } = version

  if (major === undefined || minor === undefined) {
    return false
  }

  if (major > 16) {
    return true
  }

  if (major === 16) {
    if (minor > 1) {
      return true
    }
    if (minor === 1) {
      if (canaryVersion !== undefined) {
        // 16.1.0-canary.3+
        return canaryVersion >= 3
      } else {
        // Assume that Next.js 16.1 inherits support for this feature from the canary release
        return true
      }
    }
  }

  return false
}
```

--------------------------------------------------------------------------------

---[FILE: withPayloadLegacy.ts]---
Location: payload-main/packages/next/src/withPayload/withPayloadLegacy.ts
Signals: Next.js

```typescript
/* eslint-disable no-console */
import type { NextConfig } from 'next'

/**
 * Applies config options required to support Next.js versions before 16.1.0 and 16.1.0-canary.3.
 */
export const withPayloadLegacy = (nextConfig: NextConfig = {}): NextConfig => {
  if (process.env.PAYLOAD_PATCH_TURBOPACK_WARNINGS !== 'false') {
    // TODO: This warning is thrown because we cannot externalize the entry-point package for client-s3, so we patch the warning to not show it.
    // We can remove this once Next.js implements https://github.com/vercel/next.js/discussions/76991
    const turbopackWarningText =
      'Packages that should be external need to be installed in the project directory, so they can be resolved from the output files.\nTry to install it into the project directory by running'

    // TODO 4.0: Remove this once we drop support for Next.js 15.2.x
    const turbopackConfigWarningText = "Unrecognized key(s) in object: 'turbopack'"

    const consoleWarn = console.warn
    console.warn = (...args) => {
      // Force to disable serverExternalPackages warnings: https://github.com/vercel/next.js/issues/68805
      if (
        (typeof args[1] === 'string' && args[1].includes(turbopackWarningText)) ||
        (typeof args[0] === 'string' && args[0].includes(turbopackWarningText))
      ) {
        return
      }

      // Add Payload-specific message after turbopack config warning in Next.js 15.2.x or lower.
      // TODO 4.0: Remove this once we drop support for Next.js 15.2.x
      const hasTurbopackConfigWarning =
        (typeof args[1] === 'string' && args[1].includes(turbopackConfigWarningText)) ||
        (typeof args[0] === 'string' && args[0].includes(turbopackConfigWarningText))

      if (hasTurbopackConfigWarning) {
        consoleWarn(...args)
        consoleWarn(
          'Payload: You can safely ignore the "Invalid next.config" warning above. This only occurs on Next.js 15.2.x or lower. We recommend upgrading to the latest supported Next.js version to resolve this warning.',
        )
        return
      }

      consoleWarn(...args)
    }
  }

  const isBuild = process.env.NODE_ENV === 'production'
  const isTurbopackNextjs15 = process.env.TURBOPACK === '1'
  const isTurbopackNextjs16 = process.env.TURBOPACK === 'auto'

  if (isBuild && (isTurbopackNextjs15 || isTurbopackNextjs16)) {
    throw new Error(
      'Your Next.js and Payload versions do not support using Turbopack for production builds. Please upgrade to Next.js 16.1.0 or, if not yet released, the latest canary release.',
    )
  }

  const toReturn: NextConfig = {
    ...nextConfig,
    serverExternalPackages: [
      // serverExternalPackages = webpack.externals, but with turbopack support and an additional check
      // for whether the package is resolvable from the project root
      ...(nextConfig.serverExternalPackages || []),
      // External, because it installs import-in-the-middle and require-in-the-middle - both in the default serverExternalPackages list.
      '@sentry/nextjs',
    ],
  }

  return toReturn
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/payload/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/payload/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bin.js]---
Location: payload-main/packages/payload/bin.js

```javascript
#!/usr/bin/env node

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const useSwc = process.argv.includes('--use-swc')
const disableTranspile = process.argv.includes('--disable-transpile')

if (disableTranspile) {
  // Remove --disable-transpile from arguments
  process.argv = process.argv.filter((arg) => arg !== '--disable-transpile')

  const start = async () => {
    const { bin } = await import('./dist/bin/index.js')
    await bin()
  }

  void start()
} else {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  const url = pathToFileURL(dirname).toString() + '/'

  if (!useSwc) {
    const start = async () => {
      // Use tsx
      let tsImport = (await import('tsx/esm/api')).tsImport

      const { bin } = await tsImport('./dist/bin/index.js', url)
      await bin()
    }

    void start()
  } else if (useSwc) {
    const { register } = await import('node:module')
    // Remove --use-swc from arguments
    process.argv = process.argv.filter((arg) => arg !== '--use-swc')

    try {
      register('@swc-node/register/esm', url)
    } catch (_) {
      console.error(
        '@swc-node/register is not installed. Please install @swc-node/register in your project, if you want to use swc in payload run.',
      )
    }

    const start = async () => {
      const { bin } = await import('./dist/bin/index.js')
      await bin()
    }

    void start()
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bundle.js]---
Location: payload-main/packages/payload/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const directoryArg = process.argv[2] || 'dist'


async function build() {
  const resultIndex = await esbuild.build({
    entryPoints: ['dist/index.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: `${directoryArg}/index.js`,
    splitting: false,
    external: [
      'lodash',
      '*.scss',
      '*.css',
      '@payloadcms/translations',
      'memoizee',
      'pino-pretty',
      'pino',
      //'ajv',
      //'image-size',
    ],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    // plugins: [commonjs()],
    sourcemap: true,
  })
  console.log('payload server bundled successfully')

  const resultShared = await esbuild.build({
    entryPoints: ['dist/exports/shared.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: `${directoryArg}/exports/shared.js`,
    splitting: false,
    external: [
      'lodash',
      '*.scss',
      '*.css',
      '@payloadcms/translations',
      'memoizee',
      'pino-pretty',
      'pino',
      //'ajv',
      //'image-size',
    ],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    // plugins: [commonjs()],
    sourcemap: true,
  })
  console.log('payload shared bundled successfully')

  fs.writeFileSync('meta_index.json', JSON.stringify(resultIndex.metafile))
  fs.writeFileSync('meta_shared.json', JSON.stringify(resultShared.metafile))
}

await build()
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/packages/payload/eslint.config.js

```javascript
import { rootEslintConfig, rootParserOptions } from '../../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */


/**
 * We've removed all eslint.config.js from the packages, but we have to leave this one as an exception.
 * The payload package is so large that without its own eslint.config, an M3 Pro (18GB) runs out of
 * memory when linting. Interestingly, two days ago when I started this PR, this didn't happen, but it
 * started happening when I did a merge from main to update the PR.
 * tsc also takes a long time to run. It's likely that at some point we'll need to split the package
 * (into payload1, payload2, etc.) and re-export them in payload.
 */
/** @type {Config[]} */
export const index = [
  ...rootEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        ...rootParserOptions,
        tsconfigRootDir: import.meta.dirname,
        projectService: {
            // See comment in packages/eslint-config/index.mjs
            allowDefaultProject: ['bin.js', 'bundle.js', 'rollup.dts.config.mjs'],
          },
      },
    },
  },
]

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/payload/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/packages/payload/package.json
Signals: React, Next.js

```json
{
  "name": "payload",
  "version": "3.68.5",
  "description": "Node, React, Headless CMS and Application Framework built on Next.js",
  "keywords": [
    "admin panel",
    "api",
    "cms",
    "content management",
    "dashboard",
    "framework",
    "graphQL",
    "headless",
    "javascript",
    "next.js",
    "node",
    "payload",
    "react",
    "self hosted",
    "typescript"
  ],
  "homepage": "https://payloadcms.com",
  "bugs": {
    "url": "https://github.com/payloadcms/payload"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/payload"
  },
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "maintainers": [
    {
      "name": "Payload",
      "email": "info@payloadcms.com",
      "url": "https://payloadcms.com"
    }
  ],
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./internal": {
      "import": "./src/exports/internal.ts",
      "types": "./src/exports/internal.ts",
      "default": "./src/exports/internal.ts"
    },
    "./shared": {
      "import": "./src/exports/shared.ts",
      "types": "./src/exports/shared.ts",
      "default": "./src/exports/shared.ts"
    },
    "./node": {
      "import": "./src/exports/node.ts",
      "types": "./src/exports/node.ts",
      "default": "./src/exports/node.ts"
    },
    "./i18n/*": {
      "import": "./src/exports/i18n/*.ts",
      "types": "./src/exports/i18n/*.ts",
      "default": "./src/exports/i18n/*.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "bin": {
    "payload": "bin.js"
  },
  "files": [
    "dist",
    "bin.js"
  ],
  "scripts": {
    "build": "rimraf .dist && rimraf tsconfig.tsbuildinfo && pnpm copyfiles && pnpm build:types && pnpm build:swc && pnpm bundle:types && echo skipping esbuild",
    "build:bundle-for-analysis": "node ./bundle.js esbuild",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "bundle:types": "rollup -c rollup.dts.config.mjs",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "clean:cache": "rimraf node_modules/.cache",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "pretest": "pnpm build"
  },
  "dependencies": {
    "@next/env": "^15.1.5",
    "@payloadcms/translations": "workspace:*",
    "@types/busboy": "1.5.4",
    "ajv": "8.17.1",
    "bson-objectid": "2.0.4",
    "busboy": "^1.6.0",
    "ci-info": "^4.1.0",
    "console-table-printer": "2.12.1",
    "croner": "9.1.0",
    "dataloader": "2.2.3",
    "deepmerge": "4.3.1",
    "file-type": "19.3.0",
    "get-tsconfig": "4.8.1",
    "http-status": "2.1.0",
    "image-size": "2.0.2",
    "ipaddr.js": "2.2.0",
    "jose": "5.9.6",
    "json-schema-to-typescript": "15.0.3",
    "minimist": "1.2.8",
    "path-to-regexp": "6.3.0",
    "pino": "9.14.0",
    "pino-pretty": "13.1.2",
    "pluralize": "8.0.0",
    "qs-esm": "7.0.2",
    "range-parser": "1.2.1",
    "sanitize-filename": "1.6.3",
    "scmp": "2.1.0",
    "ts-essentials": "10.0.3",
    "tsx": "4.20.3",
    "undici": "7.10.0",
    "uuid": "10.0.0",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@hyrious/esbuild-plugin-commonjs": "0.2.6",
    "@monaco-editor/react": "4.7.0",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/json-schema": "7.0.15",
    "@types/minimist": "1.2.2",
    "@types/nodemailer": "7.0.2",
    "@types/pluralize": "0.0.33",
    "@types/range-parser": "1.2.7",
    "@types/uuid": "10.0.0",
    "@types/ws": "^8.5.10",
    "copyfiles": "2.4.1",
    "cross-env": "7.0.3",
    "esbuild": "0.25.5",
    "graphql-http": "^1.22.0",
    "react-datepicker": "7.6.0",
    "rimraf": "6.0.1",
    "rollup": "4.52.3",
    "rollup-plugin-dts": "6.2.3",
    "sharp": "0.32.6"
  },
  "peerDependencies": {
    "graphql": "^16.8.1"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./internal": {
        "import": "./dist/exports/internal.js",
        "types": "./dist/exports/internal.d.ts",
        "default": "./dist/exports/internal.js"
      },
      "./node": {
        "import": "./dist/exports/node.js",
        "types": "./dist/exports/node.d.ts",
        "default": "./dist/exports/node.js"
      },
      "./shared": {
        "import": "./dist/exports/shared.js",
        "types": "./dist/exports/shared.d.ts",
        "default": "./dist/exports/shared.js"
      },
      "./i18n/*": {
        "import": "./dist/exports/i18n/*.js",
        "types": "./dist/exports/i18n/*.d.ts",
        "default": "./dist/exports/i18n/*.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/payload/README.md

```text
<a href="https://payloadcms.com"><img width="100%" src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/github-banner-new-logo.jpg" alt="Payload headless CMS Admin panel built with React" /></a>
<br />
<br />

<p align="left">
  <a href="https://github.com/payloadcms/payload/actions"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/payloadcms/payload/main.yml?style=flat-square"></a>
  &nbsp;
  <a href="https://discord.gg/payload"><img alt="Discord" src="https://img.shields.io/discord/967097582721572934?label=Discord&color=7289da&style=flat-square" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/payload"><img alt="npm" src="https://img.shields.io/npm/dw/payload?style=flat-square" /></a>
  &nbsp;
  <a href="https://github.com/payloadcms/payload/graphs/contributors"><img alt="npm" src="https://img.shields.io/github/contributors-anon/payloadcms/payload?color=yellow&style=flat-square" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/payload"><img alt="npm" src="https://img.shields.io/npm/v/payload?style=flat-square" /></a>
  &nbsp;
  <a href="https://twitter.com/payloadcms"><img src="https://img.shields.io/badge/follow-payloadcms-1DA1F2?logo=twitter&style=flat-square" alt="Payload Twitter" /></a>
</p>
<hr/>
<h4>
<a target="_blank" href="https://payloadcms.com/docs/getting-started/what-is-payload" rel="dofollow"><strong>Explore the Docs</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://payloadcms.com/community-help" rel="dofollow"><strong>Community Help</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://github.com/payloadcms/payload/discussions/1539" rel="dofollow"><strong>Roadmap</strong></a>&nbsp;·&nbsp;<a target="_blank" href="https://www.g2.com/products/payload-cms/reviews#reviews" rel="dofollow"><strong>View G2 Reviews</strong></a>
</h4>
<hr/>

> [!IMPORTANT]
> Star this repo or keep an eye on it to follow along.

Payload is the first-ever Next.js native CMS that can install directly in your existing `/app` folder. It's the start of a new era for headless CMS.

<h3>Benefits over a regular CMS</h3>
<ul>
   <li>It's both an app framework & headless CMS</li>
  <li>Deploy anywhere, including serverless on Vercel for free</li>
  <li>Combine your front+backend in the same <code>/app</code> folder if you want</li>
  <li>Don't sign up for yet another SaaS - Payload is open source</li>
  <li>Query your database in React Server Components</li>
  <li>Both admin and backend are 100% extensible</li>
  <li>No vendor lock-in</li>
  <li>Never touch ancient WP code again</li>
  <li>Build faster, never hit a roadblock</li>
</ul>

## Quickstart

Before beginning to work with Payload, make sure you have all of the [required software](https://payloadcms.com/docs/getting-started/installation).

```text
pnpx create-payload-app@latest
```

**If you're new to Payload, you should start with the website template** (`pnpx create-payload-app@latest -t website`). It shows how to do _everything_ - including custom Rich Text blocks, on-demand revalidation, live preview, and more. It comes with a frontend built with Tailwind all in one `/app` folder.

## One-click deployment options

You can deploy Payload serverlessly in one-click via Vercel and Cloudflare—giving everything you need without the hassle of the plumbing.

### Deploy on Cloudflare

Fully self-contained — one click to deploy Payload with **Workers**, **R2** for uploads, and **D1** for a globally replicated database.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://dub.sh/payload-cloudflare)

### Deploy on Vercel

All-in-one on Vercel — one click to deploy Payload with a **Next.js** front end, **Neon** database, and **Vercel Blob** for media storage.

[![Deploy with Vercel](https://vercel.com/button)](https://dub.sh/payload-vercel)

## One-click templates

Jumpstart your next project with a ready-to-go template. These are **production-ready, end-to-end solutions** designed to get you to market fast. Build any kind of **website**, **ecommerce store**, **blog**, or **portfolio** — complete with a modern front end built using **React Server Components** and **Tailwind**.

#### 🌐 [Website](https://github.com/payloadcms/payload/tree/main/templates/website)

#### 🛍️ [Ecommerce](https://github.com/payloadcms/payload/tree/main/templates/ecommerce) 🎉 _**NEW**_ 🎉

We're constantly adding more templates to our [**Templates Directory**](https://github.com/payloadcms/payload/tree/main/templates).
If you maintain your own, add the `payload-template` topic to your GitHub repo so others can discover it.

**🔗 Explore more:**

- [Official Templates](https://github.com/payloadcms/payload/tree/main/templates)
- [Community Templates](https://github.com/topics/payload-template)

## ✨ Payload Features

- Completely free and open-source
- Next.js native, built to run inside _your_ `/app` folder
- Use server components to extend Payload UI
- Query your database directly in server components, no need for REST / GraphQL
- Fully TypeScript with automatic types for your data
- [Auth out of the box](https://payloadcms.com/docs/authentication/overview)
- [Versions and drafts](https://payloadcms.com/docs/versions/overview)
- [Localization](https://payloadcms.com/docs/configuration/localization)
- [Block-based layout builder](https://payloadcms.com/docs/fields/blocks)
- [Customizable React admin](https://payloadcms.com/docs/admin/overview)
- [Lexical rich text editor](https://payloadcms.com/docs/fields/rich-text)
- [Conditional field logic](https://payloadcms.com/docs/fields/overview#conditional-logic)
- Extremely granular [Access Control](https://payloadcms.com/docs/access-control/overview)
- [Document and field-level hooks](https://payloadcms.com/docs/hooks/overview) for every action Payload provides
- Intensely fast API
- Highly secure thanks to HTTP-only cookies, CSRF protection, and more

<a target="_blank" href="https://github.com/payloadcms/payload/discussions"><strong>Request Feature</strong></a>

## 🗒️ Documentation

Check out the [Payload website](https://payloadcms.com/docs/getting-started/what-is-payload) to find in-depth documentation for everything that Payload offers.

Migrating from v2 to v3? Check out the [3.0 Migration Guide](https://github.com/payloadcms/payload/blob/main/docs/migration-guide/overview.mdx) on how to do it.

## 🙋 Contributing

If you want to add contributions to this repository, please follow the instructions in [contributing.md](./CONTRIBUTING.md).

## 📚 Examples

The [Examples Directory](./examples) is a great resource for learning how to setup Payload in a variety of different ways, but you can also find great examples in our blog and throughout our social media.

If you'd like to run the examples, you can use `create-payload-app` to create a project from one:

```sh
npx create-payload-app --example example_name
```

You can see more examples at:

- [Examples Directory](./examples)
- [Payload Blog](https://payloadcms.com/blog)
- [Payload YouTube](https://www.youtube.com/@payloadcms)

## 🔌 Plugins

Payload is highly extensible and allows you to install or distribute plugins that add or remove functionality. There are both officially-supported and community-supported plugins available. If you maintain your own plugin, consider adding the `payload-plugin` topic to your GitHub repository for others to find.

- [Official Plugins](https://github.com/orgs/payloadcms/repositories?q=topic%3Apayload-plugin)
- [Community Plugins](https://github.com/topics/payload-plugin)

## 🚨 Need help?

There are lots of good conversations and resources in our Github Discussions board and our Discord Server. If you're struggling with something, chances are, someone's already solved what you're up against. :point_down:

- [GitHub Discussions](https://github.com/payloadcms/payload/discussions)
- [GitHub Issues](https://github.com/payloadcms/payload/issues)
- [Discord](https://t.co/30APlsQUPB)
- [Community Help](https://payloadcms.com/community-help)

## ⭐ Like what we're doing? Give us a star

## 👏 Thanks to all our contributors

<img align="left" src="https://contributors-img.web.app/image?repo=payloadcms/payload"/>
```

--------------------------------------------------------------------------------

---[FILE: rollup.dts.config.mjs]---
Location: payload-main/packages/payload/rollup.dts.config.mjs

```text
import dts from 'rollup-plugin-dts'
import path from 'node:path'

import { builtinModules } from 'node:module'

const WHITELIST = ['ts-essentials', 'croner', '@payloadcms/translations'] // <-- only these get bundled

/**
 * One-step DTS bundle:
 * - Input from your TS source entry
 * - Output to a single dist/index.bundled.d.ts
 * - respectExternal: true -> aggressively inline third-party .d.ts (helps with ts-essentials)
 */
export default [
  {
    input: 'src/index.ts',
    output: { file: 'dist/index.bundled.d.ts', format: 'es' },
    plugins: [
      dts({
        tsconfig: './tsconfig.bundletypes.json',
        respectExternal: true,
        compilerOptions: {},
      }),
    ],

    /**
     * Externalize all non-whitelisted packages and Node builtins.
     * If we bundle all packages, this script runs out of memory.
     */
    external: (id) => {
      // 1) Always keep Node builtins external
      if (builtinModules.includes(id) || builtinModules.includes(id.replace(/^node:/, '')))
        return true

      // 2) Keep virtual/internal rollup ids external just in case
      if (id.startsWith('\0')) return true

      // 3) Never externalize *local* files (we want our own .d.ts bundled)
      if (id.startsWith('.') || path.isAbsolute(id)) return false

      // 4) Bundle only whitelisted packages (opt-in)
      const isWhitelisted = WHITELIST.some((p) => id === p || id.startsWith(`${p}/`))
      return !isWhitelisted // everything else is external
    },
  },
]
```

--------------------------------------------------------------------------------

````
