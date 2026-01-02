---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 156
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 156 of 695)

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

---[FILE: package.json]---
Location: payload-main/packages/live-preview-react/package.json
Signals: React

```json
{
  "name": "@payloadcms/live-preview-react",
  "version": "3.68.5",
  "description": "The official React SDK for Payload Live Preview",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/live-preview-react"
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
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/live-preview": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.1 || ^19.1.2 || ^19.2.1"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/live-preview-react/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/live-preview-react/src/index.ts

```typescript
export { RefreshRouteOnSave } from './RefreshRouteOnSave.js'
export { useLivePreview } from './useLivePreview.js'
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/packages/live-preview-react/src/RefreshRouteOnSave.tsx
Signals: React

```typescript
'use client'

import type React from 'react'

import { isDocumentEvent, ready } from '@payloadcms/live-preview'
import { useCallback, useEffect, useRef } from 'react'

export const RefreshRouteOnSave: React.FC<{
  apiRoute?: string
  depth?: number
  refresh: () => void
  serverURL: string
}> = (props) => {
  const { apiRoute, depth, refresh, serverURL } = props
  const hasSentReadyMessage = useRef<boolean>(false)

  const onMessage = useCallback(
    (event: MessageEvent) => {
      if (isDocumentEvent(event, serverURL)) {
        if (typeof refresh === 'function') {
          refresh()
        } else {
          // eslint-disable-next-line no-console
          console.error('You must provide a refresh function to `RefreshRouteOnSave`')
        }
      }
    },
    [refresh, serverURL],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)
    }

    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })

      // refresh after the ready message is sent to get the latest data
      refresh()
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [serverURL, onMessage, depth, apiRoute, refresh])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: useLivePreview.ts]---
Location: payload-main/packages/live-preview-react/src/useLivePreview.ts
Signals: React

```typescript
'use client'
import { ready, subscribe, unsubscribe } from '@payloadcms/live-preview'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * This is a React hook to implement {@link https://payloadcms.com/docs/live-preview/overview Payload Live Preview}.
 *
 * @link https://payloadcms.com/docs/live-preview/frontend
 */
// NOTE: cannot use Record<string, unknown> here bc generated interfaces will not satisfy the type constraint
export const useLivePreview = <T extends Record<string, any>>(props: {
  apiRoute?: string
  depth?: number
  /**
   * To prevent the flicker of missing data on initial load,
   * you can pass in the initial page data from the server.
   */
  initialData: T
  serverURL: string
}): {
  data: T
  /**
   * To prevent the flicker of stale data while the post message is being sent,
   * you can conditionally render loading UI based on the `isLoading` state.
   */
  isLoading: boolean
} => {
  const { apiRoute, depth, initialData, serverURL } = props
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const hasSentReadyMessage = useRef<boolean>(false)

  const onChange = useCallback((mergedData: T) => {
    setData(mergedData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const subscription = subscribe({
      apiRoute,
      callback: onChange,
      depth,
      initialData,
      serverURL,
    })

    if (!hasSentReadyMessage.current) {
      hasSentReadyMessage.current = true

      ready({
        serverURL,
      })
    }

    return () => {
      unsubscribe(subscription)
    }
  }, [serverURL, onChange, depth, initialData, apiRoute])

  return {
    data,
    isLoading,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/live-preview-vue/.prettierignore

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
Location: payload-main/packages/live-preview-vue/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": "inline",
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    }
  },
  "module": {
    "type": "commonjs"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/live-preview-vue/LICENSE.md

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
Location: payload-main/packages/live-preview-vue/package.json

```json
{
  "name": "@payloadcms/live-preview-vue",
  "version": "3.68.5",
  "description": "The official Vue SDK for Payload Live Preview",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/live-preview-vue"
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
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/live-preview": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "payload": "workspace:*",
    "vue": "^3.0.0"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "default": "./dist/index.js",
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/live-preview-vue/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }] // db-mongodb depends on payload
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/live-preview-vue/src/index.ts

```typescript
import type { Ref } from 'vue'

import { ready, subscribe, unsubscribe } from '@payloadcms/live-preview'
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * This is a Vue composable to implement {@link https://payloadcms.com/docs/live-preview/overview Payload Live Preview}.
 *
 * @link https://payloadcms.com/docs/live-preview/frontend
 */
export const useLivePreview = <T extends Record<string, any>>(props: {
  apiRoute?: string
  depth?: number
  /**
   * To prevent the flicker of missing data on initial load,
   * you can pass in the initial page data from the server.
   */
  initialData: T
  serverURL: string
}): {
  data: Ref<T>
  /**
   * To prevent the flicker of stale data while the post message is being sent,
   * you can conditionally render loading UI based on the `isLoading` state.
   */
  isLoading: Ref<boolean>
} => {
  const { apiRoute, depth, initialData, serverURL } = props
  const data = ref(initialData) as Ref<T>
  const isLoading = ref(true)
  const hasSentReadyMessage = ref(false)

  const onChange = (mergedData: T) => {
    data.value = mergedData
    isLoading.value = false
  }

  let subscription: (event: MessageEvent) => Promise<void> | void

  onMounted(() => {
    subscription = subscribe({
      apiRoute,
      callback: onChange,
      depth,
      initialData,
      serverURL,
    })

    if (!hasSentReadyMessage.value) {
      hasSentReadyMessage.value = true

      ready({
        serverURL,
      })
    }
  })

  onUnmounted(() => {
    unsubscribe(subscription)
  })

  return {
    data,
    isLoading,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/next/.prettierignore

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
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/next/.swcrc

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
    },
    "experimental": {
      "plugins": [
        [
          "swc-plugin-transform-remove-imports",
          {
            "test": "\\.(scss|css)$"
          }
        ]
      ]
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-cjs]---
Location: payload-main/packages/next/.swcrc-cjs

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
    "type": "commonjs"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .swcrc-debug]---
Location: payload-main/packages/next/.swcrc-debug

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
        "development": true,
        "useBuiltins": true
      }
    },
    "keepClassNames": true,
    "preserveAllComments": true
  },
  "module": {
    "type": "es6"
  },
  "minify": false
}
```

--------------------------------------------------------------------------------

---[FILE: babel.config.cjs]---
Location: payload-main/packages/next/babel.config.cjs

```text
const fs = require('fs')

// Plugin options can be found here: https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L38
const ReactCompilerConfig = {
  sources: (filename) => {
    const isInNodeModules = filename.includes('node_modules')
    if (
      isInNodeModules ||
      (!filename.endsWith('.tsx') && !filename.endsWith('.jsx') && !filename.endsWith('.js'))
    ) {
      return false
    }

    // Only compile files with 'use client' directives. We do not want to
    // accidentally compile React Server Components
    const file = fs.readFileSync(filename, 'utf8')
    if (file.includes("'use client'")) {
      return true
    }
    console.log('React compiler - skipping file: ' + filename)
    return false
  },
}

module.exports = function (api) {
  api.cache(false)

  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
      /* [
         'babel-plugin-transform-remove-imports',
         {
           test: '\\.(scss|css)$',
         },
       ],*/
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bundle.js]---
Location: payload-main/packages/next/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import { sassPlugin } from 'esbuild-sass-plugin'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const directoryArg = process.argv[2] || 'dist'

async function build() {
  const resultIndex = await esbuild.build({
    entryPoints: ['dist/esbuildEntry.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: `${directoryArg}/index.js`,
    splitting: false,
    external: ['@payloadcms/ui', 'payload', '@payloadcms/translations', '@payloadcms/graphql'],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    // plugins: [commonjs()],
    sourcemap: true,
    plugins: [sassPlugin({ css: 'external' })],
  })
  console.log('payload server bundled successfully')

  fs.writeFileSync('meta_index.json', JSON.stringify(resultIndex.metafile))
}

await build()
```

--------------------------------------------------------------------------------

---[FILE: bundleScss.js]---
Location: payload-main/packages/next/bundleScss.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'

import { sassPlugin } from 'esbuild-sass-plugin'

async function build() {
  // Bundle only the .scss files into a single css file
  await esbuild.build({
    entryPoints: ['src/esbuildEntry.ts'],
    bundle: true,
    minify: true,
    outdir: 'dist/prod',
    packages: 'external',
    plugins: [sassPlugin({ css: 'external' })],
  })

  try {
    fs.renameSync('dist/prod/esbuildEntry.css', 'dist/prod/styles.css')
  } catch (err) {
    console.error(`Error while renaming index.css: ${err}`)
    throw err
  }

  console.log('styles.css bundled successfully')

  const filesToDelete = [
    'dist/esbuildEntry.js',
    'dist/prod/esbuildEntry.js',
    'dist/esbuildEntry.d.ts',
    'dist/esbuildEntry.d.ts.map',
    'dist/esbuildEntry.js.map',
  ]

  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(file)
    } catch (err) {
      console.error(`Error while deleting ${file}: ${err}`)
      throw err
    }
  }

  console.log('Files renamed and deleted successfully')
}

await build()
```

--------------------------------------------------------------------------------

---[FILE: bundleWithPayload.js]---
Location: payload-main/packages/next/bundleWithPayload.js

```javascript
/**
 * This file creates a cjs-compatible bundle of the withPayload function.
 */

import * as esbuild from 'esbuild'
import path from 'path'

await esbuild.build({
  entryPoints: ['dist/withPayload/withPayload.js'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: `dist/cjs/withPayload.cjs`,
  splitting: false,
  minify: true,
  metafile: true,
  tsconfig: path.resolve(import.meta.dirname, 'tsconfig.json'),
  sourcemap: true,
  minify: false,
  // 18.20.2 is the lowest version of node supported by Payload
  target: 'node18.20.2',
})
console.log('withPayload cjs bundle created successfully')
```

--------------------------------------------------------------------------------

---[FILE: createStubScss.js]---
Location: payload-main/packages/next/createStubScss.js

```javascript
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const distProdDir = join(__dirname, 'dist', 'prod')
const stylesPath = join(distProdDir, 'styles.css')

const comment = `/*
 * This file is a stub for debug builds.
 * Direct SCSS imports are preserved for debug builds, so this file is not needed.
 * For production builds, the actual bundled styles are generated by the build:esbuild script.
 */
`

// Create the dist/prod directory if it doesn't exist
mkdirSync(distProdDir, { recursive: true })

// Write the stub CSS file with comment
writeFileSync(stylesPath, comment, 'utf8')

console.log('Created stub styles.css for debug build')
```

--------------------------------------------------------------------------------

---[FILE: eslint.config.js]---
Location: payload-main/packages/next/eslint.config.js

```javascript
import { rootEslintConfig, rootParserOptions } from '../../eslint.config.js'

/** @typedef {import('eslint').Linter.Config} Config */

/** @type {Config[]} */
export const index = [
  ...rootEslintConfig,
  {
    settings: {
      next: {
        rootDir: '../../app/',
      },
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ...rootParserOptions,
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          // See comment in packages/eslint-config/index.mjs
          allowDefaultProject: [
            'bundleScss.js',
            'bundle.js',
            'babel.config.cjs',
            'bundleWithPayload.js',
            'createStubScss.js',
          ],
        },
      },
    },
  },
]

export default index
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/next/LICENSE.md

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
Location: payload-main/packages/next/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/next",
  "version": "3.68.5",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/next"
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
  "sideEffects": [
    "*.scss",
    "*.css"
  ],
  "type": "module",
  "exports": {
    "./css": {
      "import": "./src/dummy.css",
      "default": "./src/dummy.css"
    },
    ".": {
      "import": "./src/index.js",
      "types": "./src/index.js",
      "default": "./src/index.js"
    },
    "./withPayload": {
      "import": "./src/withPayload/withPayload.ts",
      "default": "./src/withPayload/withPayload.ts"
    },
    "./layouts": {
      "import": "./src/exports/layouts.ts",
      "types": "./src/exports/layouts.ts",
      "default": "./src/exports/layouts.ts"
    },
    "./routes": {
      "import": "./src/exports/routes.ts",
      "types": "./src/exports/routes.ts",
      "default": "./src/exports/routes.ts"
    },
    "./auth": {
      "import": "./src/exports/auth.ts",
      "types": "./src/exports/auth.ts",
      "default": "./src/exports/auth.ts"
    },
    "./templates": {
      "import": "./src/exports/templates.ts",
      "types": "./src/exports/templates.ts",
      "default": "./src/exports/templates.ts"
    },
    "./utilities": {
      "import": "./src/exports/utilities.ts",
      "types": "./src/exports/utilities.ts",
      "default": "./src/exports/utilities.ts"
    },
    "./views": {
      "import": "./src/exports/views.ts",
      "types": "./src/exports/views.ts",
      "default": "./src/exports/views.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    },
    "./rsc": {
      "import": "./src/exports/rsc.ts",
      "types": "./src/exports/rsc.ts",
      "default": "./src/exports/rsc.ts"
    }
  },
  "main": "./src/index.js",
  "types": "./src/index.js",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:reactcompiler",
    "build:babel": "rm -rf dist_optimized && babel dist --out-dir dist_optimized --source-maps --extensions .ts,.js,.tsx,.jsx,.cjs,.mjs && rm -rf dist && mv dist_optimized dist",
    "build:bundle-for-analysis": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm build:swc && pnpm build:babel && pnpm copyfiles && node ./bundle.js esbuild",
    "build:cjs": "node ./bundleWithPayload.js",
    "build:debug": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm build:swc:debug && pnpm copyfiles:debug && pnpm build:types && pnpm build:cjs && node createStubScss.js",
    "build:esbuild": "node bundleScss.js",
    "build:reactcompiler": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm build:swc && pnpm build:babel && pnpm copyfiles && pnpm build:types && pnpm build:esbuild  && pnpm build:cjs",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:swc:debug": "swc ./src -d ./dist --config-file .swcrc-debug --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "build:without_reactcompiler": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm copyfiles && pnpm build:types && pnpm build:swc && pnpm build:cjs && pnpm build:esbuild",
    "clean": "rimraf -g {dist,*.tsbuildinfo,esbuild}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "copyfiles:debug": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "lint-staged": {
    "**/package.json": "sort-package-json",
    "*.{md,mdx,yml,json}": "prettier --write",
    "*.{js,jsx,ts,tsx}": [
      "prettier --write",
      "eslint --cache --fix"
    ]
  },
  "dependencies": {
    "@dnd-kit/core": "6.0.8",
    "@payloadcms/graphql": "workspace:*",
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "busboy": "^1.6.0",
    "dequal": "2.0.3",
    "file-type": "19.3.0",
    "graphql-http": "^1.22.0",
    "graphql-playground-html": "1.6.30",
    "http-status": "2.1.0",
    "path-to-regexp": "6.3.0",
    "qs-esm": "7.0.2",
    "sass": "1.77.4",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@babel/cli": "7.27.2",
    "@babel/core": "7.27.3",
    "@babel/preset-env": "7.27.2",
    "@babel/preset-react": "7.27.1",
    "@babel/preset-typescript": "7.27.1",
    "@next/eslint-plugin-next": "15.4.7",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/busboy": "1.5.4",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "@types/uuid": "10.0.0",
    "babel-plugin-react-compiler": "19.1.0-rc.3",
    "esbuild": "0.25.5",
    "esbuild-sass-plugin": "3.3.1",
    "payload": "workspace:*",
    "swc-plugin-transform-remove-imports": "8.3.0"
  },
  "peerDependencies": {
    "graphql": "^16.8.1",
    "next": "^15.4.10",
    "payload": "workspace:*"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      "./css": {
        "import": "./dist/prod/styles.css",
        "default": "./dist/prod/styles.css"
      },
      "./withPayload": {
        "import": "./dist/withPayload/withPayload.js",
        "require": "./dist/cjs/withPayload.cjs",
        "default": "./dist/withPayload/withPayload.js"
      },
      "./layouts": {
        "import": "./dist/exports/layouts.js",
        "types": "./dist/exports/layouts.d.ts",
        "default": "./dist/exports/layouts.js"
      },
      "./routes": {
        "import": "./dist/exports/routes.js",
        "types": "./dist/exports/routes.d.ts",
        "default": "./dist/exports/routes.js"
      },
      "./templates": {
        "import": "./dist/exports/templates.js",
        "types": "./dist/exports/templates.d.ts",
        "default": "./dist/exports/templates.js"
      },
      "./auth": {
        "import": "./dist/exports/auth.js",
        "types": "./dist/exports/auth.d.ts",
        "default": "./dist/exports/auth.js"
      },
      "./utilities": {
        "import": "./dist/exports/utilities.js",
        "types": "./dist/exports/utilities.d.ts",
        "default": "./dist/exports/utilities.js"
      },
      "./views": {
        "import": "./dist/exports/views.js",
        "types": "./dist/exports/views.d.ts",
        "default": "./dist/exports/views.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      },
      "./rsc": {
        "import": "./dist/exports/rsc.js",
        "types": "./dist/exports/rsc.d.ts",
        "default": "./dist/exports/rsc.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.js"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/next/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    /* TODO: remove the following lines */
    "strict": false,
    "noUncheckedIndexedAccess": false,
  },
  "references": [
    { "path": "../payload" },
    { "path": "../ui" },
    { "path": "../translations" },
    { "path": "../graphql" }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/packages/next/src/config.ts

```typescript
import type { SanitizedConfig } from 'payload'

export default {} as Promise<SanitizedConfig>
```

--------------------------------------------------------------------------------

---[FILE: esbuildEntry.ts]---
Location: payload-main/packages/next/src/esbuildEntry.ts

```typescript
export { RootLayout } from './layouts/Root/index.js'
export { DashboardView } from './views/Dashboard/index.js'
export { LoginView } from './views/Login/index.js'
export { RootPage } from './views/Root/index.js'
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: payload-main/packages/next/src/index.js

```javascript
export { default as withPayload } from './withPayload/withPayload.js'
```

--------------------------------------------------------------------------------

---[FILE: login.ts]---
Location: payload-main/packages/next/src/auth/login.ts

```typescript
'use server'

import type { CollectionSlug } from 'payload'

import { getPayload } from 'payload'

import { setPayloadAuthCookie } from '../utilities/setPayloadAuthCookie.js'

type LoginWithEmail = {
  collection: CollectionSlug
  config: any
  email: string
  password: string
  username?: never
}

type LoginWithUsername = {
  collection: CollectionSlug
  config: any
  email?: never
  password: string
  username: string
}
type LoginArgs = LoginWithEmail | LoginWithUsername

export async function login({ collection, config, email, password, username }: LoginArgs): Promise<{
  token?: string
  user: any
}> {
  const payload = await getPayload({ config, cron: true })

  const authConfig = payload.collections[collection]?.config.auth

  if (!authConfig) {
    throw new Error(`No auth config found for collection: ${collection}`)
  }

  const loginWithUsername = authConfig?.loginWithUsername ?? false

  if (loginWithUsername) {
    if (loginWithUsername.allowEmailLogin) {
      if (!email && !username) {
        throw new Error('Email or username is required.')
      }
    } else {
      if (!username) {
        throw new Error('Username is required.')
      }
    }
  } else {
    if (!email) {
      throw new Error('Email is required.')
    }
  }

  let loginData

  if (loginWithUsername) {
    loginData = username ? { password, username } : { email, password }
  } else {
    loginData = { email, password }
  }

  const result = await payload.login({
    collection,
    data: loginData,
  })

  if (result.token) {
    await setPayloadAuthCookie({
      authConfig,
      cookiePrefix: payload.config.cookiePrefix,
      token: result.token,
    })
  }

  if ('removeTokenFromResponses' in config && config.removeTokenFromResponses) {
    delete result.token
  }

  return result
}
```

--------------------------------------------------------------------------------

---[FILE: logout.ts]---
Location: payload-main/packages/next/src/auth/logout.ts
Signals: Next.js

```typescript
'use server'

import type { SanitizedConfig } from 'payload'

import { cookies as getCookies, headers as nextHeaders } from 'next/headers.js'
import { createLocalReq, getPayload, logoutOperation } from 'payload'

import { getExistingAuthToken } from '../utilities/getExistingAuthToken.js'

export async function logout({
  allSessions = false,
  config,
}: {
  allSessions?: boolean
  config: Promise<SanitizedConfig> | SanitizedConfig
}) {
  const payload = await getPayload({ config, cron: true })
  const headers = await nextHeaders()
  const authResult = await payload.auth({ headers })

  if (!authResult.user) {
    return { message: 'User already logged out', success: true }
  }

  const { user } = authResult
  const req = await createLocalReq({ user }, payload)
  const collection = payload.collections[user.collection]

  const logoutResult = await logoutOperation({
    allSessions,
    collection,
    req,
  })

  if (!logoutResult) {
    return { message: 'Logout failed', success: false }
  }

  const existingCookie = await getExistingAuthToken(payload.config.cookiePrefix)
  if (existingCookie) {
    const cookies = await getCookies()
    cookies.delete(existingCookie.name)
  }

  return { message: 'User logged out successfully', success: true }
}
```

--------------------------------------------------------------------------------

---[FILE: refresh.ts]---
Location: payload-main/packages/next/src/auth/refresh.ts
Signals: Next.js

```typescript
'use server'

import type { CollectionSlug } from 'payload'

import { headers as nextHeaders } from 'next/headers.js'
import { createLocalReq, getPayload, refreshOperation } from 'payload'

import { getExistingAuthToken } from '../utilities/getExistingAuthToken.js'
import { setPayloadAuthCookie } from '../utilities/setPayloadAuthCookie.js'

export async function refresh({ config }: { config: any }) {
  const payload = await getPayload({ config, cron: true })
  const headers = await nextHeaders()
  const result = await payload.auth({ headers })

  if (!result.user) {
    throw new Error('Cannot refresh token: user not authenticated')
  }

  const existingCookie = await getExistingAuthToken(payload.config.cookiePrefix)
  if (!existingCookie) {
    return { message: 'No valid token found to refresh', success: false }
  }

  const collection: CollectionSlug | undefined = result.user.collection
  const collectionConfig = payload.collections[collection]

  if (!collectionConfig?.config.auth) {
    throw new Error(`No auth config found for collection: ${collection}`)
  }

  const req = await createLocalReq({ user: result.user }, payload)

  const refreshResult = await refreshOperation({
    collection: collectionConfig,
    req,
  })

  if (!refreshResult) {
    return { message: 'Token refresh failed', success: false }
  }

  await setPayloadAuthCookie({
    authConfig: collectionConfig.config.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token: refreshResult.refreshedToken,
  })

  return { message: 'Token refreshed successfully', success: true }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/DocumentHeader/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .doc-header {
    width: 100%;
    margin-top: calc(var(--base) * 0.4);
    padding-bottom: calc(var(--base) * 1.2);
    position: relative;

    &::after {
      content: '';
      display: block;
      position: absolute;
      height: 1px;
      background: var(--theme-elevation-100);
      width: 100%;
      left: 0;
      top: calc(100% - 1px);
    }

    &__header {
      display: flex;
      align-items: center;
      gap: calc(var(--base) / 2);
    }

    &__title {
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      padding-bottom: calc(var(--base) * 0.4);
      vertical-align: top;
      padding-bottom: 0;
    }

    &__after-header {
      padding-top: calc(var(--base) * 0.8);
    }

    @include mid-break {
      margin-top: calc(var(--base) * 0.25);
      padding-bottom: calc(var(--base) / 1.5);

      &__header {
        flex-direction: column;
        gap: calc(var(--base) / 2);
      }

      &__title {
        width: 100%;
      }

      &__after-header {
        padding-top: calc(var(--base) / 4);
      }
    }

    @include small-break {
      margin-top: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/elements/DocumentHeader/index.tsx
Signals: React

```typescript
import type {
  PayloadRequest,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SanitizedPermissions,
} from 'payload'

import { Gutter, RenderTitle } from '@payloadcms/ui'
import React from 'react'

import { DocumentTabs } from './Tabs/index.js'
import './index.scss'

const baseClass = `doc-header`

/**
 * @internal
 */
export const DocumentHeader: React.FC<{
  AfterHeader?: React.ReactNode
  collectionConfig?: SanitizedCollectionConfig
  globalConfig?: SanitizedGlobalConfig
  hideTabs?: boolean
  permissions: SanitizedPermissions
  req: PayloadRequest
}> = (props) => {
  const { AfterHeader, collectionConfig, globalConfig, hideTabs, permissions, req } = props

  return (
    <Gutter className={baseClass}>
      <div className={`${baseClass}__header`}>
        <RenderTitle className={`${baseClass}__title`} />
        {!hideTabs && (
          <DocumentTabs
            collectionConfig={collectionConfig}
            globalConfig={globalConfig}
            permissions={permissions}
            req={req}
          />
        )}
      </div>
      {AfterHeader ? <div className={`${baseClass}__after-header`}>{AfterHeader}</div> : null}
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/elements/DocumentHeader/Tabs/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .doc-tabs {
    display: flex;

    &__tabs {
      display: flex;
      gap: calc(var(--base) / 2);
      list-style: none;
      align-items: center;
      margin: 0;
      padding-left: 0;
    }

    @include mid-break {
      width: 100%;
      padding: 0;
      overflow: auto;

      // this container has a gradient overlay as visual indication of `overflow: scroll`
      &::-webkit-scrollbar {
        display: none;
      }

      &::after {
        content: '';
        display: block;
        position: sticky;
        right: 0;
        width: calc(var(--base) * 2);
        height: calc(var(--base) * 2);
        background: linear-gradient(to right, transparent, var(--theme-bg));
        flex-shrink: 0;
        z-index: 1111;
        pointer-events: none;
      }

      &__tabs {
        padding: 0;
      }
    }

    @include small-break {
      &__tabs-container {
        margin-right: var(--gutter-h);
      }

      &__tabs {
        gap: var(--gutter-h);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

````
