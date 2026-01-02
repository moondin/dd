---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 122
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 122 of 695)

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

---[FILE: utils.ts]---
Location: payload-main/packages/create-payload-app/src/lib/ast/utils.ts

```typescript
import type { ImportDeclaration, SourceFile } from 'ts-morph'

import { existsSync } from 'fs'
import path from 'path'

import type {
  DetectionError,
  ImportCleanupResult,
  ImportRemovalResult,
  NamedImportRemovalResult,
} from './types.js'

import { debug } from '../../utils/log.js'

export function findImportDeclaration({
  moduleSpecifier,
  sourceFile,
}: {
  moduleSpecifier: string
  sourceFile: SourceFile
}): ImportDeclaration | undefined {
  return sourceFile
    .getImportDeclarations()
    .find((imp) => imp.getModuleSpecifierValue() === moduleSpecifier)
}

type FormatErrorOptions = {
  actual: string
  context: string
  debugInfo?: Record<string, unknown>
  expected: string
  technicalDetails: string
}

export function formatError(options: FormatErrorOptions): DetectionError {
  const { actual, context, debugInfo, expected, technicalDetails } = options

  const userMessage = `Your config file doesn't match the expected structure for ${context}.

Expected: ${expected}
Actual: ${actual}

Please ensure your config file follows the expected structure.`

  return {
    technicalDetails,
    userMessage,
    ...(debugInfo && { debugInfo }),
  }
}

export function addImportDeclaration({
  defaultImport,
  insertIndex,
  moduleSpecifier,
  namedImports,
  sourceFile,
}: {
  defaultImport?: string
  insertIndex?: number
  moduleSpecifier: string
  namedImports?: string[]
  sourceFile: SourceFile
}): SourceFile {
  const existingImport = findImportDeclaration({ moduleSpecifier, sourceFile })

  if (existingImport) {
    // Add named imports to existing import if they don't exist
    if (namedImports) {
      const existingNamedImports = existingImport.getNamedImports().map((ni) => ni.getName())
      const newNamedImports = namedImports.filter((ni) => !existingNamedImports.includes(ni))

      if (newNamedImports.length > 0) {
        existingImport.addNamedImports(newNamedImports)
        debug(
          `[AST] Added named imports to existing import from '${moduleSpecifier}': ${newNamedImports.join(', ')}`,
        )
      } else {
        debug(`[AST] Import from '${moduleSpecifier}' already has all required named imports`)
      }
    }
  } else {
    // Create new import at specified index or at default position
    const importDeclaration = {
      moduleSpecifier,
      ...(namedImports && { namedImports }),
      ...(defaultImport && { defaultImport }),
    }

    if (insertIndex !== undefined) {
      sourceFile.insertImportDeclaration(insertIndex, importDeclaration)
      debug(`[AST] Inserted import from '${moduleSpecifier}' at index ${insertIndex}`)
    } else {
      sourceFile.addImportDeclaration(importDeclaration)
      debug(`[AST] Added import from '${moduleSpecifier}' at default position`)
    }

    const parts = []
    if (defaultImport) {
      parts.push(`default: ${defaultImport}`)
    }
    if (namedImports) {
      parts.push(`named: ${namedImports.join(', ')}`)
    }
    debug(`[AST] Import contents: ${parts.join(', ')}`)
  }

  return sourceFile
}

export function removeImportDeclaration({
  moduleSpecifier,
  sourceFile,
}: {
  moduleSpecifier: string
  sourceFile: SourceFile
}): ImportRemovalResult {
  const importDecl = findImportDeclaration({ moduleSpecifier, sourceFile })
  if (importDecl) {
    // Get index before removing
    const allImports = sourceFile.getImportDeclarations()
    const index = allImports.indexOf(importDecl)
    importDecl.remove()
    debug(`[AST] Removed import from '${moduleSpecifier}' at index ${index}`)
    return { removedIndex: index, sourceFile }
  } else {
    debug(`[AST] Import from '${moduleSpecifier}' not found (already absent)`)
    return { removedIndex: undefined, sourceFile }
  }
}

/**
 * Remove specific named imports from an import declaration
 * If all named imports are removed, removes the entire declaration
 */
export function removeNamedImports({
  importDeclaration,
  namedImportsToRemove,
  sourceFile,
}: {
  importDeclaration: ImportDeclaration
  namedImportsToRemove: string[]
  sourceFile: SourceFile
}): NamedImportRemovalResult {
  const namedImports = importDeclaration.getNamedImports()
  const remainingImports = namedImports.filter((ni) => !namedImportsToRemove.includes(ni.getName()))

  const moduleSpecifier = importDeclaration.getModuleSpecifierValue()

  debug(
    `[AST] Removing named imports [${namedImportsToRemove.join(', ')}] from '${moduleSpecifier}'`,
  )
  debug(`[AST] Remaining imports: ${remainingImports.length}`)

  if (remainingImports.length === 0 && !importDeclaration.getDefaultImport()) {
    // No imports left, remove entire declaration
    const allImports = sourceFile.getImportDeclarations()
    const index = allImports.indexOf(importDeclaration)
    importDeclaration.remove()
    debug(`[AST] ✓ Removed entire import from '${moduleSpecifier}' (no remaining imports)`)
    return { fullyRemoved: true, index, sourceFile }
  } else {
    // Remove specific named imports
    namedImports.forEach((ni) => {
      if (namedImportsToRemove.includes(ni.getName())) {
        ni.remove()
      }
    })
    debug(
      `[AST] ✓ Removed named imports, kept ${remainingImports.length} import(s) from '${moduleSpecifier}'`,
    )
    return { fullyRemoved: false, sourceFile }
  }
}

/**
 * Check if a named import is used in the source file
 */
export function isNamedImportUsed(
  sourceFile: SourceFile,
  importName: string,
  excludeImports = true,
): boolean {
  const fullText = sourceFile.getFullText()

  if (excludeImports) {
    // Remove import declarations from consideration
    const imports = sourceFile.getImportDeclarations()
    let textWithoutImports = fullText

    imports.forEach((imp) => {
      const importText = imp.getFullText()
      textWithoutImports = textWithoutImports.replace(importText, '')
    })

    // Check if import name appears in code (not in imports)
    // Use word boundary to avoid partial matches
    const regex = new RegExp(`\\b${importName}\\b`)
    return regex.test(textWithoutImports)
  }

  // Simple check including imports
  const regex = new RegExp(`\\b${importName}\\b`)
  return regex.test(fullText)
}

/**
 * Clean up orphaned imports - remove imports that are no longer used
 */
export function cleanupOrphanedImports({
  importNames,
  moduleSpecifier,
  sourceFile: inputSourceFile,
}: {
  importNames: string[]
  moduleSpecifier: string
  sourceFile: SourceFile
}): ImportCleanupResult {
  let sourceFile = inputSourceFile
  const importDecl = findImportDeclaration({ moduleSpecifier, sourceFile })

  if (!importDecl) {
    debug(`[AST] No import found from '${moduleSpecifier}' to clean up`)
    return { kept: [], removed: [], sourceFile }
  }

  const removed: string[] = []
  const kept: string[] = []

  for (const importName of importNames) {
    const isUsed = isNamedImportUsed(sourceFile, importName)

    if (!isUsed) {
      removed.push(importName)
      debug(`[AST] Import '${importName}' from '${moduleSpecifier}' is orphaned (not used)`)
    } else {
      kept.push(importName)
      debug(`[AST] Import '${importName}' from '${moduleSpecifier}' is still used`)
    }
  }

  if (removed.length > 0) {
    ;({ sourceFile } = removeNamedImports({
      importDeclaration: importDecl,
      namedImportsToRemove: removed,
      sourceFile,
    }))
    debug(`[AST] ✓ Cleaned up ${removed.length} orphaned import(s) from '${moduleSpecifier}'`)
  }

  return { kept, removed, sourceFile }
}
```

--------------------------------------------------------------------------------

---[FILE: pack-template-files.ts]---
Location: payload-main/packages/create-payload-app/src/scripts/pack-template-files.ts

```typescript
import fs from 'fs'
import fsp from 'fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()

/**
 * Copy the necessary template files from `templates/blank` to `dist/template`
 *
 * Eventually, this should be replaced with using tar.x to stream from the git repo
 */

async function main() {
  const root = path.resolve(dirname, '../../../../')
  const outputPath = path.resolve(dirname, '../../dist/template')
  const sourceTemplatePath = path.resolve(root, 'templates/blank')

  if (!fs.existsSync(sourceTemplatePath)) {
    throw new Error(`Source path does not exist: ${sourceTemplatePath}`)
  }

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  // Copy the src directory from `templates/blank` to `dist`
  const srcPath = path.resolve(sourceTemplatePath, 'src')
  const distSrcPath = path.resolve(outputPath, 'src')
  // Copy entire file structure from src to dist
  await fsp.cp(srcPath, distSrcPath, { recursive: true })
}
```

--------------------------------------------------------------------------------

---[FILE: casing.ts]---
Location: payload-main/packages/create-payload-app/src/utils/casing.ts

```typescript
export const toCamelCase = (str: string) => {
  const s = str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
    ?.map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join('')
  return (s && s.slice(0, 1).toLowerCase() + s.slice(1)) ?? ''
}

export function toPascalCase(input: string): string {
  return input
    .replace(/[_-]+/g, ' ') // Replace underscores or hyphens with spaces
    .replace(/(?:^|\s+)(\w)/g, (_, c) => c.toUpperCase()) // Capitalize first letter of each word
    .replace(/\s+/g, '') // Remove all spaces
}
```

--------------------------------------------------------------------------------

---[FILE: copy-recursive-sync.ts]---
Location: payload-main/packages/create-payload-app/src/utils/copy-recursive-sync.ts

```typescript
import fs from 'fs'
import path from 'path'

/**
 * Recursively copy files from src to dest
 *
 * @internal
 */
export function copyRecursiveSync(src: string, dest: string, ignoreRegex?: string[]): void {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats !== false && stats.isDirectory()
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true })
    fs.readdirSync(src).forEach((childItemName) => {
      if (
        ignoreRegex &&
        ignoreRegex.some((regex) => {
          return new RegExp(regex).test(childItemName)
        })
      ) {
        console.log(`Ignoring ${childItemName} due to regex: ${ignoreRegex}`)
        return
      }
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), ignoreRegex)
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getLatestPackageVersion.ts]---
Location: payload-main/packages/create-payload-app/src/utils/getLatestPackageVersion.ts

```typescript
/**
 * Fetches the latest version of a package from the NPM registry.
 *
 * Used in determining the latest version of Payload to use in the generated templates.
 */
export async function getLatestPackageVersion({
  debug = false,
  packageName = 'payload',
}: {
  debug?: boolean
  /**
   * Package name to fetch the latest version for based on the NPM registry URL
   *
   * Eg. for `'payload'`, it will fetch the version from `https://registry.npmjs.org/payload`
   *
   * @default 'payload'
   */
  packageName?: string
}) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`)
    const data = (await response.json()) as { 'dist-tags': { latest: string } }
    const latestVersion = data['dist-tags'].latest

    if (debug) {
      console.log(`Found latest version of ${packageName}: ${latestVersion}`)
    }

    return latestVersion
  } catch (error) {
    console.error('Error fetching Payload version:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: git.ts]---
Location: payload-main/packages/create-payload-app/src/utils/git.ts

```typescript
import type { ExecSyncOptions } from 'child_process'

import { execSync } from 'child_process'

import { warning } from './log.js'

export function tryInitRepoAndCommit(args: { cwd: string }): void {
  const execOpts: ExecSyncOptions = { cwd: args.cwd, stdio: 'ignore' }
  try {
    // Check if git is available
    execSync('git -v', execOpts)

    // Do nothing if already in a git repo
    if (isGitRepo(execOpts)) {
      return
    }

    // Initialize
    execSync('git init', execOpts)
    if (!ensureHasDefaultBranch(execOpts)) {
      execSync('git checkout -b main', execOpts)
    }

    // Add and commit files
    execSync('git add -A', execOpts)
    execSync('git commit -m "feat: initial commit"', execOpts)
  } catch (_) {
    warning('Failed to initialize git repository.')
  }
}

function isGitRepo(opts: ExecSyncOptions): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', opts)
    return true
  } catch (_) {
    // Ignore errors
  }
  return false
}

function ensureHasDefaultBranch(opts: ExecSyncOptions): boolean {
  try {
    execSync(`git config init.defaultBranch`, opts)
    return true
  } catch (_) {
    // Ignore errros
  }
  return false
}
```

--------------------------------------------------------------------------------

---[FILE: log.ts]---
Location: payload-main/packages/create-payload-app/src/utils/log.ts

```typescript
import * as p from '@clack/prompts'
import chalk from 'chalk'

export const warning = (message: string): void => {
  p.log.warn(chalk.yellow('? ') + chalk.bold(message))
}

export const info = (message: string): void => {
  p.log.step(chalk.bold(message))
}

export const error = (message: string): void => {
  p.log.error(chalk.bold(message))
}

export const debug = (message: string): void => {
  if (process.env.DEBUG === 'true') {
    p.log.step(`${chalk.bgGray('[DEBUG]')} ${chalk.gray(message)}`)
  }
}

export const log = (message: string): void => {
  p.log.message(message)
}
```

--------------------------------------------------------------------------------

---[FILE: messages.ts]---
Location: payload-main/packages/create-payload-app/src/utils/messages.ts

```typescript
/* eslint-disable no-console */
import chalk from 'chalk'
import path from 'path'
import terminalLink from 'terminal-link'

import type { PackageManager, ProjectTemplate } from '../types.js'

import { getValidTemplates } from '../lib/templates.js'

const header = (message: string): string => chalk.bold(message)

export const welcomeMessage = chalk`
  {green Welcome to Payload. Let's create a project! }
`

const spacer = ' '.repeat(8)

export function helpMessage(): void {
  const validTemplates = getValidTemplates()
  console.log(chalk`
  {bold USAGE}

      {dim Inside of an existing Next.js project}

      {dim $} {bold npx create-payload-app}

      {dim Create a new project from scratch}

      {dim $} {bold npx create-payload-app}
      {dim $} {bold npx create-payload-app} my-project
      {dim $} {bold npx create-payload-app} -n my-project -t template-name

  {bold OPTIONS}

      -n     {underline my-payload-app}         Set project name
      -t     {underline template_name}          Choose specific template
      -e     {underline example_name}           Choose specific example

        {dim Available templates: ${formatTemplates(validTemplates)}}

      --use-npm                     Use npm to install dependencies
      --use-yarn                    Use yarn to install dependencies
      --use-pnpm                    Use pnpm to install dependencies
      --use-bun                     Use bun to install dependencies (experimental)
      --no-deps                     Do not install any dependencies
      -h                            Show help
`)
}

function formatTemplates(templates: ProjectTemplate[]) {
  return `\n\n${spacer}${templates
    .map((t) => `${t.name}${' '.repeat(28 - t.name.length)}${t.description}`)
    .join(`\n${spacer}`)}`
}

export function successMessage(projectDir: string, packageManager: PackageManager): string {
  const relativePath = path.relative(process.cwd(), projectDir)
  return `
${header('Launch Application:')}

  - cd ./${relativePath}
  - ${packageManager === 'npm' ? 'npm run' : packageManager} dev or follow directions in README.md

${header('Documentation:')}

  - ${createTerminalLink(
    'Getting Started',
    'https://payloadcms.com/docs/getting-started/what-is-payload',
  )}
  - ${createTerminalLink('Configuration', 'https://payloadcms.com/docs/configuration/overview')}

`
}

export function successfulNextInit(): string {
  return `- ${createTerminalLink(
    'Getting Started',
    'https://payloadcms.com/docs/getting-started/what-is-payload',
  )}
- ${createTerminalLink('Configuration', 'https://payloadcms.com/docs/configuration/overview')}
`
}

export function moveMessage(args: { nextAppDir: string; projectDir: string }): string {
  const relativeAppDir = path.relative(process.cwd(), args.nextAppDir)
  return `
${header('Next Steps:')}

Payload does not support a top-level layout.tsx file in the app directory.

${chalk.bold('To continue:')}

- Create a new directory in ./${relativeAppDir} such as ./${relativeAppDir}/${chalk.bold('(app)')}
- Move all files from ./${relativeAppDir} into that directory

It is recommended to do this from your IDE if your app has existing file references.

Once moved, rerun the create-payload-app command again.
`
}

export function feedbackOutro(): string {
  return `${chalk.bgCyan(chalk.black(' Have feedback? '))} Visit us on ${createTerminalLink('GitHub', 'https://github.com/payloadcms/payload')}.`
}

// Create terminalLink with fallback for unsupported terminals
function createTerminalLink(text: string, url: string) {
  return terminalLink(text, url, {
    fallback: (text, url) => `${text}: ${url}`,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/db-d1-sqlite/.gitignore

```text
/migrations
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/db-d1-sqlite/.prettierignore

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
Location: payload-main/packages/db-d1-sqlite/.swcrc

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
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: bundle.js]---
Location: payload-main/packages/db-d1-sqlite/bundle.js

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { commonjs } from '@hyrious/esbuild-plugin-commonjs'

async function build() {
  const resultServer = await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    splitting: false,
    external: [
      '*.scss',
      '*.css',
      'drizzle-kit',
      'libsql',
      'pg',
      '@payloadcms/translations',
      '@payloadcms/drizzle',
      'payload',
      'payload/*',
    ],
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [commonjs()],
    sourcemap: true,
  })
  console.log('db-sqlite bundled successfully')

  fs.writeFileSync('meta_server.json', JSON.stringify(resultServer.metafile))
}
await build()
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/db-d1-sqlite/LICENSE.md

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
Location: payload-main/packages/db-d1-sqlite/package.json

```json
{
  "name": "@payloadcms/db-d1-sqlite",
  "version": "3.68.5",
  "description": "The officially supported D1 SQLite database adapter for Payload",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/db-d1-sqlite"
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
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types-deprecated.ts",
      "require": "./src/exports/types-deprecated.ts",
      "types": "./src/exports/types-deprecated.ts"
    },
    "./migration-utils": {
      "import": "./src/exports/migration-utils.ts",
      "require": "./src/exports/migration-utils.ts",
      "types": "./src/exports/migration-utils.ts"
    },
    "./drizzle": {
      "import": "./src/drizzle-proxy/index.ts",
      "types": "./src/drizzle-proxy/index.ts",
      "default": "./src/drizzle-proxy/index.ts"
    },
    "./drizzle/sqlite-core": {
      "import": "./src/drizzle-proxy/sqlite-core.ts",
      "types": "./src/drizzle-proxy/sqlite-core.ts",
      "default": "./src/drizzle-proxy/sqlite-core.ts"
    },
    "./drizzle/d1": {
      "import": "./src/drizzle-proxy/d1.ts",
      "types": "./src/drizzle-proxy/d1.ts",
      "default": "./src/drizzle-proxy/d1.ts"
    },
    "./drizzle/relations": {
      "import": "./src/drizzle-proxy/relations.ts",
      "types": "./src/drizzle-proxy/relations.ts",
      "default": "./src/drizzle-proxy/relations.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist",
    "mock.js"
  ],
  "scripts": {
    "build": "pnpm build:swc && pnpm build:types",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/drizzle": "workspace:*",
    "console-table-printer": "2.12.1",
    "drizzle-kit": "0.31.7",
    "drizzle-orm": "0.44.7",
    "prompts": "2.4.2",
    "to-snake-case": "1.0.0",
    "uuid": "9.0.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@types/pg": "8.10.2",
    "@types/to-snake-case": "1.0.0",
    "@types/uuid": "10.0.0",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "payload": "workspace:*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.js",
        "require": "./dist/index.js",
        "types": "./dist/index.d.ts"
      },
      "./types": {
        "import": "./dist/exports/types-deprecated.js",
        "require": "./dist/exports/types-deprecated.js",
        "types": "./dist/exports/types-deprecated.d.ts"
      },
      "./migration-utils": {
        "import": "./dist/exports/migration-utils.js",
        "require": "./dist/exports/migration-utils.js",
        "types": "./dist/exports/migration-utils.d.ts"
      },
      "./drizzle": {
        "import": "./dist/drizzle-proxy/index.js",
        "types": "./dist/drizzle-proxy/index.d.ts",
        "default": "./dist/drizzle-proxy/index.js"
      },
      "./drizzle/sqlite-core": {
        "import": "./dist/drizzle-proxy/sqlite-core.js",
        "types": "./dist/drizzle-proxy/sqlite-core.d.ts",
        "default": "./dist/drizzle-proxy/sqlite-core.js"
      },
      "./drizzle/d1": {
        "import": "./dist/drizzle-proxy/d1.js",
        "types": "./dist/drizzle-proxy/d1.d.ts",
        "default": "./dist/drizzle-proxy/d1.js"
      },
      "./drizzle/relations": {
        "import": "./dist/drizzle-proxy/relations.js",
        "types": "./dist/drizzle-proxy/relations.d.ts",
        "default": "./dist/drizzle-proxy/relations.js"
      }
    },
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/db-d1-sqlite/README.md

```text
# Payload D1 SQLite Adapter

Official D1 SQLite adapter for [Payload](https://payloadcms.com).

- [Main Repository](https://github.com/payloadcms/payload)
- [Payload Docs](https://payloadcms.com/docs)

## Installation

```bash
npm install @payloadcms/db-d1-sqlite
```

## Usage

```ts
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'

export default buildConfig({
  // Your config goes here
  collections: [
    // Collections go here
  ],
  // Configure the D1 adapter here
  db: sqliteD1Adapter({
    // D1-specific arguments go here.
    // `binding` is required and should match the D1 database binding name in your Cloudflare Worker environment.
    binding: cloudflare.env.D1,
  }),
})
```

More detailed usage can be found in the [Payload Docs](https://payloadcms.com/docs/database/sqlite).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/db-d1-sqlite/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [
    {
      "path": "../payload"
    },
    {
      "path": "../translations"
    },
    {
      "path": "../drizzle"
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: connect.ts]---
Location: payload-main/packages/db-d1-sqlite/src/connect.ts

```typescript
import type { DrizzleAdapter } from '@payloadcms/drizzle'
import type { Connect, Migration } from 'payload'

import { pushDevSchema } from '@payloadcms/drizzle'
import { drizzle } from 'drizzle-orm/d1'

import type { SQLiteD1Adapter } from './types.js'

export const connect: Connect = async function connect(
  this: SQLiteD1Adapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  this.schema = {
    ...this.tables,
    ...this.relations,
  }

  try {
    const logger = this.logger || false
    const readReplicas = this.readReplicas

    let binding = this.binding

    if (readReplicas && readReplicas === 'first-primary') {
      // @ts-expect-error - need to have types that support withSession binding from D1
      binding = this.binding.withSession('first-primary')
    }

    this.drizzle = drizzle(binding, {
      logger,
      schema: this.schema,
    })

    this.client = this.drizzle.$client as any

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        this.payload.logger.info(`---- DROPPING TABLES ----`)
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    this.payload.logger.error({ err, msg: `Error: cannot connect to SQLite: ${message}` })
    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    console.error(err)
    throw new Error(`Error: cannot connect to SQLite: ${message}`)
  }

  // Only push schema if not in production
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_MIGRATING !== 'true' &&
    this.push !== false
  ) {
    await pushDevSchema(this as unknown as DrizzleAdapter)
  }

  if (typeof this.resolveInitializing === 'function') {
    this.resolveInitializing()
  }

  if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
    await this.migrate({ migrations: this.prodMigrations as Migration[] })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: execute.ts]---
Location: payload-main/packages/db-d1-sqlite/src/execute.ts

```typescript
import type { Execute } from '@payloadcms/drizzle'
import type { SQLiteRaw } from 'drizzle-orm/sqlite-core/query-builders/raw'

import { sql } from 'drizzle-orm'

interface D1Meta {
  changed_db: boolean
  changes: number
  duration: number
  last_row_id: number
  rows_read: number
  rows_written: number
  /**
   * True if-and-only-if the database instance that executed the query was the primary.
   */
  served_by_primary?: boolean
  /**
   * The region of the database instance that executed the query.
   */
  served_by_region?: string
  size_after: number
  timings?: {
    /**
     * The duration of the SQL query execution by the database instance. It doesn't include any network time.
     */
    sql_duration_ms: number
  }
}

interface D1Response {
  error?: never
  meta: D1Meta & Record<string, unknown>
  success: true
}

type D1Result<T = unknown> = {
  results: T[]
} & D1Response

export const execute: Execute<any> = function execute({ db, drizzle, raw, sql: statement }) {
  const executeFrom: any = (db ?? drizzle)!
  const mapToLibSql = (query: SQLiteRaw<D1Result<unknown>>): any => {
    const execute = query.execute
    query.execute = async () => {
      const result: D1Result = await execute()
      const resultLibSQL = {
        columns: undefined,
        columnTypes: undefined,
        lastInsertRowid: BigInt(result.meta.last_row_id),
        rows: result.results as any[],
        rowsAffected: result.meta.rows_written,
      }

      return Object.assign(result, resultLibSQL)
    }

    return query
  }

  if (raw) {
    const result = mapToLibSql(executeFrom.run(sql.raw(raw)))
    return result
  } else {
    const result = mapToLibSql(executeFrom.run(statement))
    return result
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/db-d1-sqlite/src/index.ts

```typescript
import type { Operators } from '@payloadcms/drizzle'
import type { DatabaseAdapterObj, Payload } from 'payload'

import {
  beginTransaction,
  buildCreateMigration,
  commitTransaction,
  count,
  countGlobalVersions,
  countVersions,
  create,
  createGlobal,
  createGlobalVersion,
  createSchemaGenerator,
  createVersion,
  deleteMany,
  deleteOne,
  deleteVersions,
  destroy,
  find,
  findGlobal,
  findGlobalVersions,
  findOne,
  findVersions,
  migrate,
  migrateDown,
  migrateFresh,
  migrateRefresh,
  migrateReset,
  migrateStatus,
  operatorMap,
  queryDrafts,
  rollbackTransaction,
  updateGlobal,
  updateGlobalVersion,
  updateJobs,
  updateMany,
  updateOne,
  updateVersion,
} from '@payloadcms/drizzle'
import {
  columnToCodeConverter,
  convertPathToJSONTraversal,
  countDistinct,
  createJSONQuery,
  defaultDrizzleSnapshot,
  deleteWhere,
  dropDatabase,
  init,
  insert,
  requireDrizzleKit,
} from '@payloadcms/drizzle/sqlite'
import { like, notLike } from 'drizzle-orm'
import { createDatabaseAdapter, defaultBeginTransaction, findMigrationDir } from 'payload'
import { fileURLToPath } from 'url'

import type { Args, SQLiteD1Adapter } from './types.js'

import { connect } from './connect.js'
import { execute } from './execute.js'

const filename = fileURLToPath(import.meta.url)

export function sqliteD1Adapter(args: Args): DatabaseAdapterObj<SQLiteD1Adapter> {
  const sqliteIDType = args.idType || 'number'
  const payloadIDType = sqliteIDType === 'uuid' ? 'text' : 'number'
  const allowIDOnCreate = args.allowIDOnCreate ?? false

  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    let resolveInitializing: () => void = () => {}
    let rejectInitializing: () => void = () => {}

    const initializing = new Promise<void>((res, rej) => {
      resolveInitializing = res
      rejectInitializing = rej
    })

    // sqlite's like operator is case-insensitive, so we overwrite the DrizzleAdapter operators to not use ilike
    const operators = {
      ...operatorMap,
      contains: like,
      like,
      not_like: notLike,
    } as unknown as Operators

    return createDatabaseAdapter<SQLiteD1Adapter>({
      name: 'sqlite',
      afterSchemaInit: args.afterSchemaInit ?? [],
      allowIDOnCreate,
      autoIncrement: args.autoIncrement ?? false,
      beforeSchemaInit: args.beforeSchemaInit ?? [],
      binding: args.binding,
      blocksAsJSON: args.blocksAsJSON ?? false,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      client: undefined,
      defaultDrizzleSnapshot,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      drizzle: undefined,
      features: {
        json: true,
      },
      fieldConstraints: {},
      foreignKeys: new Set(),
      generateSchema: createSchemaGenerator({
        columnToCodeConverter,
        corePackageSuffix: 'sqlite-core',
        defaultOutputFile: args.generateSchemaOutputFile,
        tableImport: 'sqliteTable',
      }),
      idType: sqliteIDType,
      initializing,
      limitedBoundParameters: true,
      localesSuffix: args.localesSuffix || '_locales',
      logger: args.logger,
      operators,
      prodMigrations: args.prodMigrations,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      push: args.push,
      rawRelations: {},
      rawTables: {},
      readReplicas: args.readReplicas,
      relations: {},
      relationshipsSuffix: args.relationshipsSuffix || '_rels',
      schema: {},
      schemaName: args.schemaName,
      sessions: {},
      tableNameMap: new Map<string, string>(),
      tables: {},
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      execute,
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      transactionOptions: args.transactionOptions || undefined,
      updateJobs,
      updateMany,
      versionsSuffix: args.versionsSuffix || '_v',
      // DatabaseAdapter
      beginTransaction: args.transactionOptions ? beginTransaction : defaultBeginTransaction(),
      commitTransaction,
      connect,
      convertPathToJSONTraversal,
      count,
      countDistinct,
      countGlobalVersions,
      countVersions,
      create,
      createGlobal,
      createGlobalVersion,
      createJSONQuery,
      createMigration: buildCreateMigration({
        executeMethod: 'run',
        filename,
        sanitizeStatements({ sqlExecute, statements }) {
          return statements
            .map((statement) => `${sqlExecute}${statement?.replaceAll('`', '\\`')}\`)`)
            .join('\n')
        },
      }),
      createVersion,
      defaultIDType: payloadIDType,
      deleteMany,
      deleteOne,
      deleteVersions,
      deleteWhere,
      destroy,
      dropDatabase,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      indexes: new Set<string>(),
      init,
      insert,
      migrate,
      migrateDown,
      migrateFresh,
      migrateRefresh,
      migrateReset,
      migrateStatus,
      migrationDir,
      packageName: '@payloadcms/db-d1-sqlite',
      payload,
      queryDrafts,
      rejectInitializing,
      requireDrizzleKit,
      resolveInitializing,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      upsert: updateOne,
    })
  }

  return {
    name: 'd1-sqlite',
    allowIDOnCreate,
    defaultIDType: payloadIDType,
    init: adapter,
  }
}

/**
 * @todo deprecate /types subpath export in 4.0
 */
export type {
  Args as SQLiteAdapterArgs,
  CountDistinct,
  DeleteWhere,
  DropDatabase,
  Execute,
  GeneratedDatabaseSchema,
  GenericColumns,
  GenericRelation,
  GenericTable,
  IDType,
  Insert,
  MigrateDownArgs,
  MigrateUpArgs,
  SQLiteD1Adapter as SQLiteAdapter,
  SQLiteSchemaHook,
} from './types.js'

export { sql } from 'drizzle-orm'
```

--------------------------------------------------------------------------------

````
