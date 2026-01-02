---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 693
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 693 of 695)

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

---[FILE: QUERIES.md]---
Location: payload-main/tools/claude-plugin/skills/payload/reference/QUERIES.md

```text
# Payload CMS Querying Reference

Complete reference for querying data across Local API, REST, and GraphQL.

## Query Operators

```ts
import type { Where } from 'payload'

// Equals
const equalsQuery: Where = { color: { equals: 'blue' } }

// Not equals
const notEqualsQuery: Where = { status: { not_equals: 'draft' } }

// Greater/less than
const greaterThanQuery: Where = { price: { greater_than: 100 } }
const lessThanEqualQuery: Where = { age: { less_than_equal: 65 } }

// Contains (case-insensitive)
const containsQuery: Where = { title: { contains: 'payload' } }

// Like (all words present)
const likeQuery: Where = { description: { like: 'cms headless' } }

// In/not in
const inQuery: Where = { category: { in: ['tech', 'news'] } }

// Exists
const existsQuery: Where = { image: { exists: true } }

// Near (point fields)
const nearQuery: Where = { location: { near: '-122.4194,37.7749,10000' } }
```

## AND/OR Logic

```ts
import type { Where } from 'payload'

const complexQuery: Where = {
  or: [
    { color: { equals: 'mint' } },
    {
      and: [{ color: { equals: 'white' } }, { featured: { equals: false } }],
    },
  ],
}
```

## Nested Properties

```ts
import type { Where } from 'payload'

const nestedQuery: Where = {
  'author.role': { equals: 'editor' },
  'meta.featured': { exists: true },
}
```

## Local API

```ts
// Find documents
const posts = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
    'author.name': { contains: 'john' },
  },
  depth: 2,
  limit: 10,
  page: 1,
  sort: '-createdAt',
  locale: 'en',
  select: {
    title: true,
    author: true,
  },
})

// Find by ID
const post = await payload.findByID({
  collection: 'posts',
  id: '123',
  depth: 2,
})

// Create
const post = await payload.create({
  collection: 'posts',
  data: {
    title: 'New Post',
    status: 'draft',
  },
})

// Update
await payload.update({
  collection: 'posts',
  id: '123',
  data: {
    status: 'published',
  },
})

// Delete
await payload.delete({
  collection: 'posts',
  id: '123',
})

// Count
const count = await payload.count({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
  },
})
```

### Threading req Parameter

When performing operations in hooks or nested operations, pass the `req` parameter to maintain transaction context:

```ts
// ✅ CORRECT: Pass req for transaction safety
const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await req.payload.create({
    collection: 'audit-log',
    data: { action: 'created', docId: doc.id },
    req, // Maintains transaction atomicity
  })
}

// ❌ WRONG: Missing req breaks transaction
const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await req.payload.create({
    collection: 'audit-log',
    data: { action: 'created', docId: doc.id },
    // Missing req - runs in separate transaction
  })
}
```

This is critical for MongoDB replica sets and Postgres. See [ADAPTERS.md#threading-req-through-operations](ADAPTERS.md#threading-req-through-operations) for details.

### Access Control in Local API

**Important**: Local API bypasses access control by default (`overrideAccess: true`). When passing a `user` parameter, you must explicitly set `overrideAccess: false` to respect that user's permissions.

```ts
// ❌ WRONG: User is passed but access control is bypassed
const posts = await payload.find({
  collection: 'posts',
  user: currentUser,
  // Missing: overrideAccess: false
  // Result: Operation runs with ADMIN privileges, ignoring user's permissions
})

// ✅ CORRECT: Respects user's access control permissions
const posts = await payload.find({
  collection: 'posts',
  user: currentUser,
  overrideAccess: false, // Required to enforce access control
  // Result: User only sees posts they have permission to read
})

// Administrative operation (intentionally bypass access control)
const allPosts = await payload.find({
  collection: 'posts',
  // No user parameter
  // overrideAccess defaults to true
  // Result: Returns all posts regardless of access control
})
```

**When to use `overrideAccess: false`:**

- Performing operations on behalf of a user
- Testing access control logic
- API routes that should respect user permissions
- Any operation where `user` parameter is provided

**When `overrideAccess: true` is appropriate:**

- Administrative operations (migrations, seeds, cron jobs)
- Internal system operations
- Operations explicitly intended to bypass access control

See [ACCESS-CONTROL.md#important-notes](ACCESS-CONTROL.md#important-notes) for more details.

## REST API

```ts
import { stringify } from 'qs-esm'

const query = {
  status: { equals: 'published' },
}

const queryString = stringify(
  {
    where: query,
    depth: 2,
    limit: 10,
  },
  { addQueryPrefix: true },
)

const response = await fetch(`https://api.example.com/api/posts${queryString}`)
const data = await response.json()
```

### REST Endpoints

```txt
GET    /api/{collection}           - Find documents
GET    /api/{collection}/{id}      - Find by ID
POST   /api/{collection}           - Create
PATCH  /api/{collection}/{id}      - Update
DELETE /api/{collection}/{id}      - Delete
GET    /api/{collection}/count     - Count documents

GET    /api/globals/{slug}         - Get global
POST   /api/globals/{slug}         - Update global
```

## GraphQL

```graphql
query {
  Posts(where: { status: { equals: published } }, limit: 10, sort: "-createdAt") {
    docs {
      id
      title
      author {
        name
      }
    }
    totalDocs
    hasNextPage
  }
}

mutation {
  createPost(data: { title: "New Post", status: draft }) {
    id
    title
  }
}

mutation {
  updatePost(id: "123", data: { status: published }) {
    id
    status
  }
}

mutation {
  deletePost(id: "123") {
    id
  }
}
```

## Performance Best Practices

- Set `maxDepth` on relationships to prevent over-fetching
- Use `select` to limit returned fields
- Index frequently queried fields
- Use `virtual` fields for computed data
- Cache expensive operations in hook `context`
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/tools/constants/package.json

```json
{
  "name": "@tools/constants",
  "version": "0.0.1",
  "description": "Shared constants for Payload internal tooling",
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/tools/constants/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.js]---
Location: payload-main/tools/constants/src/index.js

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATES_DIR = exports.PACKAGES_DIR = exports.ROOT_PACKAGE_JSON = exports.PROJECT_ROOT = void 0;
var node_url_1 = require("node:url");
var path_1 = require("path");
var filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var dirname = path_1.default.dirname(filename);
/**
 * Path to the project root
 */
exports.PROJECT_ROOT = path_1.default.resolve(dirname, '../../../');
exports.ROOT_PACKAGE_JSON = path_1.default.resolve(exports.PROJECT_ROOT, 'package.json');
exports.PACKAGES_DIR = path_1.default.resolve(exports.PROJECT_ROOT, 'packages');
exports.TEMPLATES_DIR = path_1.default.resolve(exports.PROJECT_ROOT, 'templates');
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/tools/constants/src/index.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Path to the project root
 */
export const PROJECT_ROOT = path.resolve(dirname, '../../../')
export const ROOT_PACKAGE_JSON = path.resolve(PROJECT_ROOT, 'package.json')
export const PACKAGES_DIR = path.resolve(PROJECT_ROOT, 'packages')
export const TEMPLATES_DIR = path.resolve(PROJECT_ROOT, 'templates')
```

--------------------------------------------------------------------------------

---[FILE: LICENSE]---
Location: payload-main/tools/releaser/LICENSE

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
Location: payload-main/tools/releaser/package.json

```json
{
  "name": "@tools/releaser",
  "version": "0.0.1",
  "description": "Release scripts for Payload",
  "keywords": [],
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./lib": {
      "import": "./src/lib/*.ts",
      "types": "./src/lib/*.ts",
      "default": "./src/lib/*.ts"
    },
    "./utils": {
      "import": "./src/utils/*.ts",
      "types": "./src/utils/*.ts",
      "default": "./src/utils/*.ts"
    }
  },
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "list-published": "tsx src/lib/getPackageRegistryVersions.ts",
    "publish-prerelease": "tsx src/publish-prerelease.ts",
    "release": "tsx src/release.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@swc-node/register": "1.11.1",
    "@tools/constants": "workspace:*",
    "chalk": "^4.1.2",
    "changelogen": "^0.5.5",
    "execa": "5.1.1",
    "minimist": "1.2.8",
    "open": "^10.1.0",
    "p-limit": "^5.0.0",
    "prompts": "2.4.2",
    "semver": "^7.5.4",
    "tsx": "^4.19.2"
  },
  "devDependencies": {
    "@types/minimist": "1.2.5",
    "@types/prompts": "^2.4.5",
    "@types/semver": "^7.5.3"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/tools/releaser/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/tools/releaser/src/index.ts

```typescript
export { getPackageDetails } from './lib/getPackageDetails.js'
export type { PackageDetails } from './lib/getPackageDetails.js'
```

--------------------------------------------------------------------------------

---[FILE: publish-prerelease.ts]---
Location: payload-main/tools/releaser/src/publish-prerelease.ts

```typescript
import chalk from 'chalk'
import minimist from 'minimist'

import { getWorkspace } from './lib/getWorkspace.js'

async function main() {
  const args = minimist(process.argv.slice(2))

  const { bump = 'minor', 'dry-run': dryRun, tag, debug } = args

  if (!tag || !['canary', 'internal', 'internal-debug'].includes(tag)) {
    abort('Tag is required. Use --tag <canary|internal|internal-debug>')
  }

  console.log(`\n  Bump: ${bump}`)
  console.log(`  Tag: ${tag}`)
  console.log(`  Debug: ${debug ? 'Enabled' : 'Disabled'}`)
  console.log(`  Dry Run: ${dryRun ? 'Enabled' : 'Disabled'}`)

  const workspace = await getWorkspace()
  await workspace.bumpVersion(tag)
  await workspace.build({ debug: debug ?? false })
  console.log('Build successful. Publishing packages...')
  await workspace.publishSync({ dryRun: dryRun ?? false, tag })

  header('🎉 Done!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

function abort(message = 'Abort', exitCode = 1) {
  console.error(chalk.bold.red(`\n${message}\n`))
  process.exit(exitCode)
}

function header(message: string, opts?: { enable?: boolean }) {
  const { enable } = opts ?? {}
  if (!enable) {
    return
  }

  console.log(chalk.bold.green(`${message}\n`))
}
```

--------------------------------------------------------------------------------

---[FILE: release.ts]---
Location: payload-main/tools/releaser/src/release.ts

```typescript
/**
 * Usage: GITHUB_TOKEN=$GITHUB_TOKEN pnpm release --bump <minor|patch>
 *
 * Ensure your GITHUB_TOKEN is set in your environment variables
 * and also has the ability to create releases in the repository.
 */

import type { ExecSyncOptions } from 'child_process'

import { PROJECT_ROOT, ROOT_PACKAGE_JSON } from '@tools/constants'
import chalk from 'chalk'
import { loadChangelogConfig } from 'changelogen'
import { execSync } from 'child_process'
import execa from 'execa'
import fse from 'fs-extra'
import minimist from 'minimist'
import path from 'path'
import prompts from 'prompts'
import semver from 'semver'

import type { PackageDetails } from './lib/getPackageDetails.js'

import { getPackageDetails } from './lib/getPackageDetails.js'
import { packagePublishList } from './lib/publishList.js'
import { createDraftGitHubRelease } from './utils/createDraftGitHubRelease.js'
import { generateReleaseNotes } from './utils/generateReleaseNotes.js'
import { getRecommendedBump } from './utils/getRecommendedBump.js'

// Always execute in project root
const cwd = PROJECT_ROOT
const execOpts: ExecSyncOptions = { stdio: 'inherit', cwd }
const execaOpts: execa.Options = { stdio: 'inherit', cwd }

const args = minimist(process.argv.slice(2))

const {
  bump, // Semver release type: major, minor, patch, premajor, preminor, prepatch, prerelease
  changelog = false, // Whether to update the changelog. WARNING: This gets throttled on too many commits
  'dry-run': dryRun,
  'git-commit': gitCommit = true, // Whether to run git commit operations
  'git-tag': gitTag = true, // Whether to run git tag and commit operations
  tag, // Tag to publish to: latest, beta, canary
} = args

const logPrefix = dryRun ? chalk.bold.magenta('[dry-run] >') : ''

const cmdRunner =
  (dryRun: boolean, gitTag: boolean) => (cmd: string, execOpts: ExecSyncOptions) => {
    const isGitCommand = cmd.startsWith('git')
    if (dryRun || (isGitCommand && !gitTag)) {
      console.log(logPrefix, cmd)
    } else {
      execSync(cmd, execOpts)
    }
  }

const cmdRunnerAsync =
  (dryRun: boolean) => async (cmd: string, args: string[], options?: execa.Options) => {
    if (dryRun) {
      console.log(logPrefix, cmd, args.join(' '))
      return { exitCode: 0 }
    } else {
      return await execa(cmd, args, options ?? { stdio: 'inherit' })
    }
  }

async function main() {
  console.log({ projectRoot: PROJECT_ROOT })

  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN env var is required')
  }

  if (dryRun) {
    console.log(chalk.bold.yellow(chalk.bold.magenta('\n  👀 Dry run mode enabled')))
  }

  console.log({ args })

  const fromVersion = execSync('git describe --match "v*" --tags --abbrev=0').toString().trim()

  const config = await loadChangelogConfig(process.cwd(), {
    repo: 'payloadcms/payload',
  })

  if (!semver.RELEASE_TYPES.includes(bump)) {
    abort(`Invalid bump type: ${bump}.\n\nMust be one of: ${semver.RELEASE_TYPES.join(', ')}`)
  }

  const recommendedBump = (await getRecommendedBump(fromVersion, 'HEAD', config)) || 'patch'

  if (bump !== recommendedBump) {
    console.log(
      chalk.bold.yellow(
        `Recommended bump type is '${recommendedBump}' based on commits since last release`,
      ),
    )
    const confirmBump = await confirm(`Do you want to continue with bump: '${bump}'?`)
    if (!confirmBump) {
      abort()
    }
  }

  const runCmd = cmdRunner(dryRun, gitTag)
  const runCmdAsync = cmdRunnerAsync(dryRun)

  if (bump.startsWith('pre') && tag === 'latest') {
    abort(`Prerelease bumps must have tag: beta or canary`)
  }

  const monorepoVersion = fse.readJSONSync(ROOT_PACKAGE_JSON)?.version

  if (!monorepoVersion) {
    throw new Error('Could not find version in package.json')
  }

  const nextReleaseVersion = semver.inc(monorepoVersion, bump, undefined, tag)

  if (!nextReleaseVersion) {
    abort(`Invalid nextReleaseVersion: ${nextReleaseVersion}`)
    return // For TS type checking
  }

  // Preview/Update changelog
  header(`${logPrefix}📝 Updating changelog...`)
  const {
    changelog: changelogContent,
    releaseNotes,
    releaseUrl: prefilledReleaseUrl,
  } = await generateReleaseNotes({
    bump,
    dryRun,
    fromVersion,
    openReleaseUrl: true,
    toVersion: 'HEAD',
  })

  console.log(chalk.green('\nFull Release Notes:\n\n'))
  console.log(chalk.gray(releaseNotes) + '\n\n')
  console.log(`\n\nRelease URL: ${chalk.dim(prefilledReleaseUrl)}`)

  let packageDetails = await getPackageDetails(packagePublishList)

  console.log(chalk.bold(`\n  Version: ${monorepoVersion} => ${chalk.green(nextReleaseVersion)}\n`))
  console.log(chalk.bold.yellow(`  Bump: ${bump}`))
  console.log(chalk.bold.yellow(`  Tag: ${tag}\n`))
  console.log(chalk.bold.green(`  Changes (${packageDetails.length} packages):\n`))
  console.log(
    `${packageDetails.map((p) => `  - ${p.name.padEnd(32)} ${p.version} => ${chalk.green(nextReleaseVersion)}`).join('\n')}\n`,
  )

  const confirmPublish = await confirm('Are you sure you want to create these versions?')

  if (!confirmPublish) {
    abort()
  }

  // Prebuild all packages
  header(`\n🔨 Prebuilding all packages...`)

  await execa('pnpm', ['install'], execaOpts)

  // Build all packages
  const buildResult = await execa('pnpm', ['build:all:force'], execaOpts)
  if (buildResult.exitCode !== 0) {
    console.error(chalk.bold.red('Build failed'))
    console.log(buildResult.stderr)
    abort('Build failed')
  }

  // Increment all package versions
  header(`${logPrefix}📦 Updating package.json versions...`)
  await Promise.all(
    packageDetails.map(async (pkg) => {
      const packageJsonPath = path.join(PROJECT_ROOT, `${pkg.packagePath}/package.json`)
      const packageJson = await fse.readJSON(packageJsonPath)
      packageJson.version = nextReleaseVersion
      if (!dryRun) {
        await fse.writeJSON(packageJsonPath, packageJson, { spaces: 2 })
      }
    }),
  )

  // Set version in root package.json
  header(`${logPrefix}📦 Updating root package.json...`)
  const rootPackageJson = await fse.readJSON(ROOT_PACKAGE_JSON)
  rootPackageJson.version = nextReleaseVersion
  if (!dryRun) {
    await fse.writeJSON(ROOT_PACKAGE_JSON, rootPackageJson, { spaces: 2 })
  }

  // Commit
  header(`🧑‍💻 Committing changes...`)

  // Commit all staged changes
  runCmd(`git add packages/**/package.json package.json`, execOpts)

  // Wait 500ms to avoid .git/index.lock errors
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (gitCommit) {
    runCmd(`git commit -m "chore(release): v${nextReleaseVersion} [skip ci]"`, execOpts)
  }

  // Tag
  header(`🏷️  Tagging release v${nextReleaseVersion}`, { enable: gitTag })
  runCmd(`git tag -a v${nextReleaseVersion} -m "v${nextReleaseVersion}"`, execOpts)

  // Publish only payload to get 5 min auth token
  packageDetails = packageDetails.filter((p) => p.name !== 'payload')
  runCmd(`pnpm publish -C packages/payload --no-git-checks --json --tag ${tag}`, execOpts)

  const results: PublishResult[] = []
  for (const pkg of packageDetails) {
    const res = await publishSinglePackage(pkg, { dryRun })
    results.push(res)
  }

  console.log(chalk.bold.green(`\n\nResults:\n`))

  console.log(
    results
      .map((result) => {
        if (!result.success) {
          console.error(result.details)
        }
        return `  ${result.success ? '✅' : '❌'} ${result.name}`
      })
      .join('\n') + '\n',
  )

  header(`🚀 Publishing complete!`)

  const pushTags = await confirm('Push commit and tags to remote?')
  if (pushTags) {
    runCmd(`git push --follow-tags`, execOpts)
    console.log(chalk.bold.green('Commit and tags pushed to remote'))
  }

  const createDraftRelease = await confirm('Create draft release on GitHub?')
  if (createDraftRelease) {
    try {
      const { releaseUrl: draftReleaseUrl } = await createDraftGitHubRelease({
        branch: 'main',
        releaseNotes,
        tag: `v${nextReleaseVersion}`,
      })
      console.log(chalk.bold.green(`Draft release created on GitHub: ${draftReleaseUrl}`))
    } catch (error: unknown) {
      console.log(chalk.bold.red('\nFull Release Notes:\n\n'))
      console.log(chalk.gray(releaseNotes) + '\n\n')
      console.log(`\n\nRelease URL: ${chalk.dim(prefilledReleaseUrl)}`)
      console.log(
        chalk.bold.red(
          `Error creating draft release on GitHub: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        ),
      )
      console.log(
        chalk.bold.red(
          `Use the above link to create the release manually and optionally add the release notes.`,
        ),
      )
    }
  }
  header('🎉 Done!')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function publishSinglePackage(pkg: PackageDetails, opts?: { dryRun?: boolean }) {
  const { dryRun = false } = opts ?? {}
  console.log(chalk.bold(`🚀 ${pkg.name} publishing...`))

  try {
    const cmdArgs = ['publish', '-C', pkg.packagePath, '--no-git-checks', '--json', '--tag', tag]
    if (dryRun) {
      cmdArgs.push('--dry-run')
      console.log(chalk.gray(`\n${logPrefix} pnpm ${cmdArgs.join(' ')}\n`))
    }
    const { exitCode, stderr } = await execa('pnpm', cmdArgs, {
      cwd,
      stdio: ['ignore', 'ignore', 'pipe'],
      // stdio: 'inherit',
    })

    if (exitCode !== 0) {
      console.log(chalk.bold.red(`\n\n❌ ${pkg.name} ERROR: pnpm publish failed\n\n${stderr}`))

      // Retry publish
      console.log(chalk.bold.yellow(`\nRetrying publish for ${pkg.name}...`))
      const { exitCode: retryExitCode, stderr: retryStdError } = await execa('pnpm', cmdArgs, {
        cwd,
        stdio: 'inherit', // log full output
      })

      if (retryExitCode !== 0) {
        console.error(
          chalk.bold.red(
            `\n\n❌ ${pkg.name} ERROR: pnpm publish failed on retry\n\n${retryStdError}`,
          ),
        )
      }

      return {
        name: pkg.name,
        details: `Exit Code: ${retryExitCode}, stderr: ${retryStdError}`,
        success: false,
      }
    }

    console.log(`${logPrefix} ${chalk.green(`✅ ${pkg.name} published`)}`)
    return { name: pkg.name, success: true }
  } catch (err: unknown) {
    console.error(err)
    return {
      name: pkg.name,
      details:
        err instanceof Error
          ? `Error publishing ${pkg.name}: ${err.message}`
          : `Unexpected error publishing ${pkg.name}: ${JSON.stringify(err)}`,
      success: false,
    }
  }
}

function abort(message = 'Abort', exitCode = 1) {
  console.error(chalk.bold.red(`\n${message}\n`))
  process.exit(exitCode)
}

async function confirm(message: string): Promise<boolean> {
  const { confirm } = await prompts(
    {
      name: 'confirm',
      type: 'confirm',
      initial: false,
      message,
    },
    {
      onCancel: () => {
        abort()
      },
    },
  )

  return confirm
}

async function question(message: string): Promise<string> {
  const { value } = await prompts(
    {
      name: 'value',
      type: 'text',
      message,
    },
    {
      onCancel: () => {
        abort()
      },
    },
  )

  return value
}

function header(message: string, opts?: { enable?: boolean }) {
  const { enable } = opts ?? {}
  if (!enable) {
    return
  }

  console.log(chalk.bold.green(`${message}\n`))
}

type PublishResult = {
  details?: string
  name: string
  success: boolean
}
```

--------------------------------------------------------------------------------

---[FILE: getPackageDetails.ts]---
Location: payload-main/tools/releaser/src/lib/getPackageDetails.ts

```typescript
import { PROJECT_ROOT } from '@tools/constants'
import fse from 'fs-extra'
import globby from 'globby'
import path, { dirname } from 'path'

export type PackageDetails = {
  /** Name in package.json / npm registry */
  name: string
  /** Full path to package relative to project root */
  packagePath: `packages/${string}`
  /**
   * Short name is the directory name of the package
   *
   * @example payload, db-mongodb, ui, etc
   * */
  shortName: string
  /** Version in package.json */
  version: string
}

/**
 * Accepts package whitelist (directory names inside packages dir) and returns details for each package
 */
export const getPackageDetails = async (packages?: null | string[]): Promise<PackageDetails[]> => {
  // Fetch all package.json files, filter out packages not in the whitelist
  const packageJsons = await globby('packages/*/package.json', {
    cwd: PROJECT_ROOT,
    absolute: true,
  })

  const packageDetails = await Promise.all(
    packageJsons.map(async (packageJsonPath) => {
      const packageJson = await fse.readJson(packageJsonPath)
      const isPublic = packageJson.private !== true
      if (!isPublic) {
        return null
      }

      const isInWhitelist = packages
        ? packages.includes(path.basename(path.dirname(packageJsonPath)))
        : true
      if (!isInWhitelist) {
        return null
      }

      return {
        name: packageJson.name as string,
        packagePath: path.relative(PROJECT_ROOT, dirname(packageJsonPath)),
        shortName: path.basename(path.dirname(packageJsonPath)),
        version: packageJson.version,
      } as PackageDetails
    }),
  )

  return packageDetails.filter((p): p is Exclude<typeof p, null> => p !== null)
}
```

--------------------------------------------------------------------------------

---[FILE: getPackageRegistryVersions.ts]---
Location: payload-main/tools/releaser/src/lib/getPackageRegistryVersions.ts

```typescript
import chalk from 'chalk'
import pLimit from 'p-limit'

import { getPackageDetails } from './getPackageDetails.js'
import { packagePublishList } from './publishList.js'

const npmRequestLimit = pLimit(40)

export const getPackageRegistryVersions = async (): Promise<void> => {
  const packageDetails = await getPackageDetails(packagePublishList)

  const results = await Promise.all(
    packageDetails.map(async (pkg) =>
      npmRequestLimit(async () => {
        // Get published version from npm
        const json = await fetch(`https://registry.npmjs.org/${pkg.name}`).then((res) => res.json())
        const { latest = 'N/A', beta = 'N/A', canary = 'N/A' } = json['dist-tags'] ?? {}
        const msg = `${pkg.name.padEnd(36)}${latest?.padEnd(16)}${beta?.padEnd(16)}${canary}`
        return msg
      }),
    ),
  )

  const header = chalk.bold.green(
    'Package Versions'.padEnd(36) + 'Latest'.padEnd(16) + 'Beta'.padEnd(16) + 'Canary',
  )
  console.log(header)
  console.log()
  console.log(results.sort().join('\n'))
}

if (import.meta.url === new URL(import.meta.url).href) {
  await getPackageRegistryVersions()
}
```

--------------------------------------------------------------------------------

---[FILE: getWorkspace.ts]---
Location: payload-main/tools/releaser/src/lib/getWorkspace.ts

```typescript
import type { ReleaseType } from 'semver'

import { PROJECT_ROOT, ROOT_PACKAGE_JSON } from '@tools/constants'
import { execSync } from 'child_process'
import execa from 'execa'
import fse from 'fs-extra'
import pLimit from 'p-limit'
import path from 'path'
import semver from 'semver'

import { getPackageDetails } from './getPackageDetails.js'
import { packagePublishList } from './publishList.js'

const npmPublishLimit = pLimit(5)
const cwd = PROJECT_ROOT

const execaOpts: execa.Options = { stdio: 'inherit', cwd }

type PackageDetails = {
  /** Name in package.json / npm registry */
  name: string
  /** Full path to package relative to project root */
  packagePath: `packages/${string}`
  /** Short name is the directory name */
  shortName: string
  /** Version in package.json */
  version: string
}

type PackageReleaseType = 'canary' | 'internal' | 'internal-debug' | ReleaseType

type PublishResult = {
  name: string
  success: boolean
  details?: string
}

type PublishOpts = {
  dryRun?: boolean
  tag?: 'beta' | 'canary' | 'internal' | 'internal-debug' | 'latest'
}

type Workspace = {
  version: () => Promise<string>
  tag: string
  packages: PackageDetails[]
  showVersions: () => Promise<void>
  bumpVersion: (type: PackageReleaseType) => Promise<void>
  build: (opts?: { debug?: boolean }) => Promise<void>
  publish: (opts: PublishOpts) => Promise<void>
  publishSync: (opts: PublishOpts) => Promise<void>
}

export const getWorkspace = async () => {
  const build = async (opts?: { debug?: boolean }) => {
    await execa('pnpm', ['install'], execaOpts)

    const buildCommand = opts?.debug ? 'build:debug' : 'build:all'
    const buildResult = await execa('pnpm', [buildCommand, '--output-logs=errors-only'], execaOpts)
    if (buildResult.exitCode !== 0) {
      console.error('Build failed')
      console.log(buildResult.stderr)
      throw new Error('Build failed')
    }
  }

  // Publish one package at a time
  const publishSync: Workspace['publishSync'] = async ({ dryRun, tag = 'canary' }) => {
    const packageDetails = await getPackageDetails(packagePublishList)
    const results: PublishResult[] = []
    for (const pkg of packageDetails) {
      const res = await publishSinglePackage(pkg, { dryRun, tag })
      results.push(res)
    }

    console.log(`\n\nResults:\n`)

    console.log(
      results
        .map((result) => {
          if (!result.success) {
            console.error(result.details)
            return `  ❌ ${result.name}`
          }
          return `  ✅ ${result.name}`
        })
        .join('\n') + '\n',
    )
  }

  const publish = async () => {
    const packageDetails = await getPackageDetails(packagePublishList)
    const results = await Promise.allSettled(
      packageDetails.map((pkg) => publishPackageThrottled(pkg, { dryRun: true })),
    )

    console.log(`\n\nResults:\n`)

    console.log(
      results
        .map((result) => {
          if (result.status === 'rejected') {
            console.error(result.reason)
            return `  ❌ ${String(result.reason)}`
          }
          const { name, success, details } = result.value
          let summary = `  ${success ? '✅' : '❌'} ${name}`
          if (details) {
            summary += `\n    ${details}\n`
          }
          return summary
        })
        .join('\n') + '\n',
    )
  }

  const showVersions = async () => {
    const { packages, version } = await getCurrentPackageState()
    console.log(`\n  Version: ${version}\n`)
    console.log(`  Changes (${packages.length} packages):\n`)
    console.log(`${packages.map((p) => `  - ${p.name.padEnd(32)} ${p.version}`).join('\n')}\n`)
  }

  const setVersion = async (version: string) => {
    const rootPackageJson = await fse.readJSON(ROOT_PACKAGE_JSON)
    rootPackageJson.version = version
    await fse.writeJSON(ROOT_PACKAGE_JSON, rootPackageJson, { spaces: 2 })

    const packageJsons = await getPackageDetails(packagePublishList)
    await Promise.all(
      packageJsons.map(async (pkg) => {
        const packageJsonPath = path.resolve(PROJECT_ROOT, `${pkg.packagePath}/package.json`)
        const packageJson = await fse.readJSON(packageJsonPath)
        packageJson.version = version
        await fse.writeJSON(packageJsonPath, packageJson, { spaces: 2 })
      }),
    )
  }

  const bumpVersion = async (bumpType: PackageReleaseType) => {
    const { version: monorepoVersion, packages: packageDetails } = await getCurrentPackageState()

    let nextReleaseVersion
    if (bumpType === 'internal') {
      const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim().slice(0, 7)
      nextReleaseVersion = semver.inc(monorepoVersion, 'minor') + `-internal.${hash}`
    } else if (bumpType === 'internal-debug') {
      const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim().slice(0, 7)
      nextReleaseVersion = semver.inc(monorepoVersion, 'minor') + `-internal-debug.${hash}`
    } else if (bumpType === 'canary') {
      const minorCandidateBaseVersion = semver.inc(monorepoVersion, 'minor')

      if (!minorCandidateBaseVersion) {
        throw new Error(`Could not determine minor candidate version from ${monorepoVersion}`)
      }

      // Get latest canary version from registry
      const json = await fetch(`https://registry.npmjs.org/payload`).then((res) => res.json())
      const { canary: latestCanaryVersion } = (json['dist-tags'] ?? {}) as {
        canary?: string | undefined
      }

      console.log(`Latest canary version: ${latestCanaryVersion}`)

      if (
        latestCanaryVersion?.startsWith(minorCandidateBaseVersion) &&
        latestCanaryVersion.includes('-canary.')
      ) {
        const canaryIteration = Number(latestCanaryVersion.split('-canary.')[1])
        if (isNaN(canaryIteration)) {
          console.log(`Latest canary version is not a valid canary version, starting from 0`)
          nextReleaseVersion = semver.inc(monorepoVersion, 'minor') + '-canary.0'
        } else {
          console.log(`Incrementing canary version from ${latestCanaryVersion}`)
          nextReleaseVersion = `${minorCandidateBaseVersion}-canary.${canaryIteration + 1}`
        }
      } else {
        console.log(`Latest canary does not match minor candidate, incrementing minor`)
        nextReleaseVersion = semver.inc(monorepoVersion, 'minor') + '-canary.0'
      }
    } else {
      throw new Error(
        `Invalid bump type: ${bumpType}. Only 'internal', 'internal-debug' and 'canary' are supported.`,
      )
    }

    if (!nextReleaseVersion) {
      throw new Error(
        `Invalid bump type: ${bumpType}. Could not determine next version from ${monorepoVersion}.`,
      )
    }

    console.log(`\n  Version: ${monorepoVersion} => ${nextReleaseVersion}\n`)
    console.log(`  Bump: ${bumpType}`)
    console.log(`  Changes (${packageDetails.length} packages):\n`)
    console.log(
      `${packageDetails.map((p) => `  - ${p.name.padEnd(32)} ${p.version} => ${nextReleaseVersion}`).join('\n')}\n`,
    )

    await setVersion(nextReleaseVersion)
  }

  const workspace: Workspace = {
    version: async () => (await fse.readJSON(ROOT_PACKAGE_JSON)).version,
    tag: 'latest',
    packages: await getPackageDetails(packagePublishList),
    showVersions,
    bumpVersion,
    build,
    publish,
    publishSync,
  }

  return workspace
}

async function getCurrentPackageState(): Promise<{
  packages: PackageDetails[]
  version: string
}> {
  const packageDetails = await getPackageDetails(packagePublishList)
  const rootPackageJson = await fse.readJSON(ROOT_PACKAGE_JSON)
  return { packages: packageDetails, version: rootPackageJson.version }
}

/** Publish with promise concurrency throttling */
async function publishPackageThrottled(pkg: PackageDetails, opts?: { dryRun?: boolean }) {
  const { dryRun = true } = opts ?? {}
  return npmPublishLimit(() => publishSinglePackage(pkg, { dryRun }))
}

async function publishSinglePackage(pkg: PackageDetails, opts: PublishOpts) {
  console.log(`🚀 ${pkg.name} publishing...`)

  const { dryRun, tag = 'canary' } = opts

  try {
    const cmdArgs = ['publish', '-C', pkg.packagePath, '--no-git-checks', '--tag', tag]
    if (dryRun) {
      cmdArgs.push('--dry-run')
    }
    const { exitCode, stderr } = await execa('pnpm', cmdArgs, {
      cwd,
      // stdio: ['ignore', 'ignore', 'pipe'],
      stdio: 'inherit',
    })

    if (exitCode !== 0) {
      console.log(`\n\n❌ ${pkg.name} ERROR: pnpm publish failed\n\n${stderr}`)

      return {
        name: pkg.name,
        success: false,
        details: `Exit Code: ${exitCode}, stderr: ${stderr}`,
      }
    }

    console.log(`✅ ${pkg.name} published`)
    return { name: pkg.name, success: true }
  } catch (err: unknown) {
    console.error(err)
    return {
      name: pkg.name,
      success: false,
      details:
        err instanceof Error
          ? `Error publishing ${pkg.name}: ${err.message}`
          : `Unexpected error publishing ${pkg.name}: ${String(err)}`,
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: publishList.ts]---
Location: payload-main/tools/releaser/src/lib/publishList.ts

```typescript
/**
 * Packages that should be published to NPM
 *
 * Note that this does not include all packages in the monorepo
 */
export const packagePublishList = [
  'payload',
  'translations',
  'ui',
  'next',
  'graphql',
  'admin-bar',
  'live-preview',
  'live-preview-react',
  'live-preview-vue',
  'richtext-slate',
  'richtext-lexical',

  'create-payload-app',

  // DB Adapters
  'drizzle',
  'db-mongodb',
  'db-postgres',
  'db-sqlite',
  'db-d1-sqlite',
  'db-vercel-postgres',

  // Adapters
  'email-nodemailer',
  'email-resend',

  // SDK
  'sdk',

  // Storage
  'storage-s3',
  'storage-r2',
  'storage-azure',
  'storage-gcs',
  'storage-vercel-blob',
  'storage-uploadthing',

  // KV
  'kv-redis',

  // Plugins
  'payload-cloud',
  'plugin-cloud-storage',
  'plugin-ecommerce',
  'plugin-form-builder',
  'plugin-import-export',
  'plugin-mcp',
  'plugin-multi-tenant',
  'plugin-nested-docs',
  'plugin-redirects',
  'plugin-search',
  'plugin-sentry',
  'plugin-seo',
  'plugin-stripe',

  // Unpublished
  // 'storage-uploadthing',
  // 'eslint-config',
  // 'eslint-plugin',
  // 'live-preview-vue',
]
```

--------------------------------------------------------------------------------

---[FILE: createDraftGitHubRelease.ts]---
Location: payload-main/tools/releaser/src/utils/createDraftGitHubRelease.ts

```typescript
type Args = {
  branch: string
  tag: string
  releaseNotes: string
}

export const createDraftGitHubRelease = async ({
  branch,
  tag,
  releaseNotes,
}: Args): Promise<{ releaseUrl: string }> => {
  // https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release
  const res = await fetch(`https://api.github.com/repos/payloadcms/payload/releases`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
    method: 'POST',
    body: JSON.stringify({
      tag_name: tag,
      target_commitish: branch,
      name: tag,
      body: releaseNotes,
      draft: true,
      prerelease: false,
      generate_release_notes: false,
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to create release: ${await res.text()}`)
  }

  const resBody = await res.json()

  return { releaseUrl: resBody.html_url }
}
```

--------------------------------------------------------------------------------

````
