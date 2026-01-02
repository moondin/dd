---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 694
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 694 of 695)

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

---[FILE: generateReleaseNotes.ts]---
Location: payload-main/tools/releaser/src/utils/generateReleaseNotes.ts

```typescript
import type { GitCommit } from 'changelogen'

import { execSync } from 'child_process'
import minimist from 'minimist'
import open from 'open'
import semver from 'semver'

import { getLatestCommits } from './getLatestCommits.js'
import { getRecommendedBump } from './getRecommendedBump.js'

type Args = {
  bump?: 'major' | 'minor' | 'patch' | 'prerelease'
  dryRun?: boolean
  fromVersion?: string
  openReleaseUrl?: boolean
  toVersion?: string
}

type ChangelogResult = {
  /**
   * The changelog content, does not include contributors
   */
  changelog: string
  /**
   * The release notes, includes contributors. This is the content used for the releaseUrl
   */
  releaseNotes: string
  /**
   * The release tag, includes prefix 'v'
   */
  releaseTag: string
  /**
   * URL to open releases/new with the changelog pre-filled
   */
  releaseUrl: string
}

export const generateReleaseNotes = async (args: Args = {}): Promise<ChangelogResult> => {
  const { bump, dryRun, openReleaseUrl, toVersion = 'HEAD' } = args

  const fromVersion =
    args.fromVersion || execSync('git describe --match "v*" --tags --abbrev=0').toString().trim()

  const tag = fromVersion.match(/-(\w+)\.\d+$/)?.[1] || 'latest'

  const recommendedBump =
    tag !== 'latest' ? 'prerelease' : await getRecommendedBump(fromVersion, toVersion)

  if (bump && bump !== recommendedBump) {
    console.log(`WARNING: Recommended bump is '${recommendedBump}', but you specified '${bump}'`)
  }

  const calculatedBump = bump || recommendedBump

  if (!calculatedBump) {
    throw new Error('Could not determine bump type')
  }

  const proposedReleaseVersion = 'v' + semver.inc(fromVersion, calculatedBump, undefined, tag)

  console.log(`Generating release notes for ${fromVersion} to ${toVersion}...`)

  console.log({
    fromVersion,
    proposedVersion: proposedReleaseVersion,
    recommendedBump,
    tag,
    toVersion,
  })

  const conventionalCommits = await getLatestCommits(fromVersion, toVersion)

  const commitTypesForChangelog = [
    'feat',
    'fix',
    'perf',
    'refactor',
    'docs',
    'style',
    'test',
    'templates',
    'examples',
    'build',
    'ci',
    'chore',
    'breaking',
  ] as const

  type Section = (typeof commitTypesForChangelog)[number]

  const emojiHeaderMap: Record<Section, string> = {
    breaking: '⚠️ BREAKING CHANGES',
    build: '🔨 Build',
    chore: '🏡 Chores',
    ci: '⚙️ CI',
    docs: '📚 Documentation',
    examples: '📓 Examples',
    feat: '🚀 Features',
    fix: '🐛 Bug Fixes',
    perf: '⚡ Performance',
    refactor: '🛠 Refactors',
    style: '🎨 Styles',
    templates: '📝 Templates',
    test: '🧪 Tests',
  }

  const sections = conventionalCommits.reduce(
    (sections, c) => {
      if (c.isBreaking) {
        if (!sections.breaking) {
          sections.breaking = []
        }
        sections.breaking.push(c)
      }

      const typedCommitType: Section = c.type as Section

      // Ignore template bump PRs formatted as "templates: bump for vX.X.X"
      if (c.description.includes('bump for v')) {
        return sections
      }

      if (commitTypesForChangelog.includes(typedCommitType)) {
        if (!sections[typedCommitType]) {
          sections[typedCommitType] = []
        }
        sections[typedCommitType].push(c)
      }

      return sections
    },
    {} as Record<Section, GitCommit[]>,
  )

  // Sort commits by scope, unscoped first
  Object.values(sections).forEach((section) => {
    section.sort((a, b) => (a.scope || '').localeCompare(b.scope || ''))
  })

  const stringifiedSections = Object.fromEntries(
    Object.entries(sections).map(([key, commits]) => [
      key,
      commits.map((commit) => formatCommitForChangelog(commit, key === 'breaking')),
    ]),
  )

  // Fetch commits for fromVersion to toVersion
  const contributors = await createContributorSection(conventionalCommits)

  const yyyyMMdd = new Date().toISOString().split('T')[0]
  // Might need to swap out HEAD for the new proposed version
  let changelog = `## [${proposedReleaseVersion}](https://github.com/payloadcms/payload/compare/${fromVersion}...${proposedReleaseVersion}) (${yyyyMMdd})\n\n\n`

  for (const section of commitTypesForChangelog) {
    if (stringifiedSections[section]?.length) {
      changelog += `### ${emojiHeaderMap[section]}\n\n${stringifiedSections[section].join('\n')}\n\n`
    }
  }

  // Add contributors after writing to file
  const releaseNotes = changelog + contributors

  let releaseUrl = `https://github.com/payloadcms/payload/releases/new?tag=${proposedReleaseVersion}&title=${proposedReleaseVersion}&body=${encodeURIComponent(releaseNotes)}`
  if (tag !== 'latest') {
    releaseUrl += `&prerelease=1`
  }
  if (!openReleaseUrl) {
    await open(releaseUrl)
  }

  return {
    changelog,
    releaseNotes,
    releaseTag: proposedReleaseVersion,
    releaseUrl,
  }
}

// Helper functions

async function createContributorSection(commits: GitCommit[]): Promise<string> {
  console.log('Fetching contributors...')
  const contributors = await getContributors(commits)
  if (!contributors.length) {
    return ''
  }

  let contributorsSection = `### 🤝 Contributors\n\n`

  for (const contributor of contributors) {
    contributorsSection += `- ${contributor.name} (@${contributor.username})\n`
  }

  return contributorsSection
}

async function getContributors(commits: GitCommit[]): Promise<Contributor[]> {
  const contributors: Contributor[] = []
  const emails = new Set<string>()

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  }

  for (const commit of commits) {
    console.log(`Fetching details for ${commit.message} - ${commit.shortHash}`)
    if (emails.has(commit.author.email) || commit.author.name.includes('[bot]')) {
      continue
    }

    const res = await fetch(
      `https://api.github.com/repos/payloadcms/payload/commits/${commit.shortHash}`,
      {
        headers,
      },
    )

    if (!res.ok) {
      console.error(await res.text())
      console.log(`Failed to fetch commit: ${res.status} ${res.statusText}`)
      continue
    }

    const { author } = (await res.json()) as { author: { email: string; login: string } }

    if (!contributors.some((c) => c.username === author.login)) {
      contributors.push({ name: commit.author.name, username: author.login })
    }
    emails.add(author.email)

    // Check git commit for 'Co-authored-by:' lines
    const coAuthorPattern = /Co-authored-by: (?<name>[^<]+) <(?<email>[^>]+)>/g
    const coAuthors = Array.from(
      commit.body.matchAll(coAuthorPattern),
      (match) => match.groups,
    ).filter((e) => !e?.email?.includes('[bot]')) as { email: string; name: string }[]

    if (!coAuthors.length) {
      continue
    }

    console.log(
      `Fetching co-author details for hash: ${commit.shortHash}. Co-authors:`,
      coAuthors.map((c) => c.email).join(', '),
    )

    // Attempt to co-authors by email
    await Promise.all(
      (coAuthors || [])
        .map(async ({ name, email }) => {
          // Check if this co-author has already been added
          if (emails.has(email)) {
            return null
          }

          // Get co-author's GitHub username by email
          try {
            const response = await fetch(
              `https://api.github.com/search/users?q=${encodeURIComponent(email)}+in:email`,
              {
                headers,
              },
            )

            if (!response.ok) {
              console.log('Bad response from GitHub API fetching co-author by email')
              console.error(response.status)
              return null
            }

            const data = (await response.json()) as { items?: { login: string }[] }
            const user = data.items?.[0]

            if (!user) {
              return null
            }

            console.log(`Found co-author by email: ${user.login}`)

            if (!contributors.some((c) => c.username === user.login)) {
              contributors.push({ name, username: user.login })
            }
            emails.add(email)
            return user.login
          } catch (error) {
            console.log(`ERROR: Failed to fetch co-author by email`)
            console.error(error)
            return null
          }
        })
        .filter(Boolean),
    )
  }
  return contributors
}

type Contributor = { name: string; username: string }

function formatCommitForChangelog(commit: GitCommit, includeBreakingNotes = false): string {
  const { description, isBreaking, references, scope } = commit

  let formatted = `* ${scope ? `**${scope}:** ` : ''}${description}`
  references.forEach((ref) => {
    if (ref.type === 'pull-request') {
      // /issues will redirect to /pulls if the issue is a PR
      formatted += ` ([${ref.value}](https://github.com/payloadcms/payload/issues/${ref.value.replace('#', '')}))`
    }

    if (ref.type === 'hash') {
      const shortHash = ref.value.slice(0, 7)
      formatted += ` ([${shortHash}](https://github.com/payloadcms/payload/commit/${shortHash}))`
    }
  })

  if (isBreaking && includeBreakingNotes) {
    // Parse breaking change notes from commit body
    const [rawNotes, _] = commit.body.split('\n\n')
    let notes =
      `  ` +
      rawNotes
        ?.split('\n')
        .map((l) => `  ${l}`) // Indent notes
        .join('\n')
        .trim()

    // Remove random trailing quotes that sometimes appear
    if (notes.endsWith('"')) {
      notes = notes.slice(0, -1)
    }

    formatted += `\n\n${notes}\n\n`
  }

  return formatted
}

// module import workaround for ejs
if (import.meta.url === `file://${process.argv[1]}`) {
  // This module is being run directly
  const { bump, fromVersion, openReleaseUrl, toVersion } = minimist(process.argv.slice(2))
  generateReleaseNotes({
    bump,
    dryRun: false,
    fromVersion,
    openReleaseUrl,
    toVersion,
  })
    .then(() => {
      console.log('Done')
    })
    .catch((err) => {
      console.error(err)
    })
}
```

--------------------------------------------------------------------------------

---[FILE: getLatestCommits.ts]---
Location: payload-main/tools/releaser/src/utils/getLatestCommits.ts

```typescript
import type { ChangelogConfig } from 'changelogen'

import { determineSemverChange, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'

export async function getLatestCommits(
  fromVersion: string,
  toVersion: string,
  config?: ChangelogConfig,
) {
  if (!config) {
    config = await loadChangelogConfig(process.cwd(), {
      repo: 'payloadcms/payload',
    })
  }
  return parseCommits(await getGitDiff(fromVersion, toVersion), config)
}
```

--------------------------------------------------------------------------------

---[FILE: getRecommendedBump.ts]---
Location: payload-main/tools/releaser/src/utils/getRecommendedBump.ts

```typescript
import type { ChangelogConfig } from 'changelogen'

import { determineSemverChange, getGitDiff, loadChangelogConfig, parseCommits } from 'changelogen'

import { getLatestCommits } from './getLatestCommits.js'

export async function getRecommendedBump(
  fromVersion: string,
  toVersion: string,
  config?: ChangelogConfig,
) {
  if (!config) {
    config = await loadChangelogConfig(process.cwd(), {
      repo: 'payloadcms/payload',
    })
  }
  const commits = await getLatestCommits(fromVersion, toVersion, config)
  const bumpType = determineSemverChange(commits, config)
  return bumpType === 'major' ? 'minor' : bumpType
}
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/tools/scripts/package.json

```json
{
  "name": "@tools/scripts",
  "version": "0.0.1",
  "description": "Shared scripts for Payload internal tooling",
  "keywords": [],
  "license": "MIT",
  "author": "Payload <dev@payloadcms.com> (https://payloadcms.com)",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts"
    }
  },
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "build-template-with-local-pkgs": "pnpm runts src/build-template-with-local-pkgs.ts",
    "gen-templates": "pnpm runts src/generate-template-variations.ts",
    "generateTranslations:core": "node --no-deprecation --import @swc-node/register/esm-register src/generateTranslations/core.ts",
    "generateTranslations:plugin-import-export": "node --no-deprecation --import @swc-node/register/esm-register src/generateTranslations/plugin-import-export.ts",
    "generateTranslations:plugin-multi-tenant": "node --no-deprecation --import @swc-node/register/esm-register src/generateTranslations/plugin-multi-tenant.ts",
    "license-check": "pnpm runts src/license-check.ts",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "pack-all-to-dest": "pnpm runts src/pack-all-to-dest.ts",
    "runts": "cross-env NODE_OPTIONS=--no-deprecation node --no-deprecation --import @swc-node/register/esm-register",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@swc-node/register": "1.11.1",
    "@tools/constants": "workspace:*",
    "@tools/releaser": "workspace:*",
    "chalk": "^4.1.2",
    "changelogen": "^0.5.5",
    "create-payload-app": "workspace:*",
    "csv-stringify": "^6.5.2",
    "license-checker": "25.0.1",
    "open": "^10.1.0",
    "payload": "workspace:*"
  },
  "devDependencies": {
    "@payloadcms/plugin-import-export": "workspace:*",
    "@payloadcms/plugin-multi-tenant": "workspace:*",
    "@payloadcms/richtext-lexical": "workspace:*",
    "@payloadcms/translations": "workspace:*"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.build.json]---
Location: payload-main/tools/scripts/tsconfig.build.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true
  },
  "references": [
    { "path": "../../packages/translations" },
    { "path": "../../packages/richtext-lexical" },
    { "path": "../../packages/plugin-multi-tenant" }
  ],
  "exclude": ["./src/generateTranslations"]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/tools/scripts/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
  },
  "references": [{ "path": "../../packages/translations" }, { "path": "../../packages/richtext-lexical"}, { "path": "../../packages/plugin-multi-tenant"}]
}
```

--------------------------------------------------------------------------------

---[FILE: build-template-with-local-pkgs.ts]---
Location: payload-main/tools/scripts/src/build-template-with-local-pkgs.ts

```typescript
import { TEMPLATES_DIR } from '@tools/constants'
import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const templateName = process.argv[2]
  if (!templateName) {
    throw new Error('Please provide a template name')
  }
  const templatePath = path.join(TEMPLATES_DIR, templateName)
  const databaseConnection = process.argv[3] || 'mongodb://127.0.0.1/your-database-name'

  console.log({
    templatePath,
    databaseConnection,
  })

  const execOpts = {
    cwd: templatePath,
    stdio: 'inherit' as const,
  }

  const allFiles = await fs.readdir(templatePath, { withFileTypes: true })
  const allTgzs = allFiles
    .filter((file) => file.isFile())
    .map((file) => file.name)
    .filter((file) => file.endsWith('.tgz'))

  console.log({
    allTgzs,
  })

  // remove node_modules
  await fs.rm(path.join(templatePath, 'node_modules'), { recursive: true, force: true })
  // replace workspace:* from package.json with a real version so that it can be installed with pnpm
  // without this step, even though the packages are built locally as tars
  // it will error as it cannot contain workspace dependencies when installing with --ignore-workspace
  const packageJsonPath = path.join(templatePath, 'package.json')
  const initialPackageJson = await fs.readFile(packageJsonPath, 'utf-8')
  const initialPackageJsonObj = JSON.parse(initialPackageJson)

  // Update the package.json dependencies to use any specific version instead of `workspace:*`, so that
  // the next pnpm add command can install the local packages correctly.
  updatePackageJSONDependencies({ latestVersion: '3.42.0', packageJson: initialPackageJsonObj })

  await fs.writeFile(packageJsonPath, JSON.stringify(initialPackageJsonObj, null, 2))

  execSync('pnpm add ./*.tgz --ignore-workspace', execOpts)
  execSync('pnpm install --ignore-workspace', execOpts)

  const packageJson = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJsonObj = JSON.parse(packageJson) as {
    dependencies: Record<string, string>
    pnpm?: { overrides: Record<string, string> }
  }

  // Get key/value pairs for any package that starts with '@payloadcms'
  const payloadValues =
    packageJsonObj.dependencies &&
    Object.entries(packageJsonObj.dependencies).filter(
      ([key, value]) => key.startsWith('@payloadcms') || key === 'payload',
    )

  // Add each package to the overrides
  const overrides = packageJsonObj.pnpm?.overrides || {}
  payloadValues.forEach(([key, value]) => {
    overrides[key] = value
  })

  // Write package.json back to disk
  packageJsonObj.pnpm = { overrides }
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJsonObj, null, 2))

  execSync('pnpm install --no-frozen-lockfile --ignore-workspace', execOpts)
  await fs.writeFile(
    path.resolve(templatePath, '.env'),
    // Populate POSTGRES_URL just in case it's needed
    `PAYLOAD_SECRET=secret
DATABASE_URI=${databaseConnection}
POSTGRES_URL=${databaseConnection}
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_TEST_asdf`,
  )
  // Important: run generate:types and generate:importmap first
  if (templateName !== 'plugin') {
    // TODO: fix in a separate PR - these commands currently fail in the plugin template
    execSync('pnpm --ignore-workspace run generate:types', execOpts)
    execSync('pnpm --ignore-workspace run generate:importmap', execOpts)
  }

  execSync('pnpm --ignore-workspace run build', execOpts)

  header(`\n🎉 Done!`)
}

function header(message: string, opts?: { enable?: boolean }) {
  console.log(chalk.bold.green(`${message}\n`))
}

/**
 * Recursively updates a JSON object to replace all instances of `workspace:` with the latest version pinned.
 *
 * Does not return and instead modifies the `packageJson` object in place.
 */
export function updatePackageJSONDependencies(args: {
  latestVersion: string
  packageJson: Record<string, unknown>
}): void {
  const { latestVersion, packageJson } = args

  const updatedDependencies = Object.entries(packageJson.dependencies || {}).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'string' && value.startsWith('workspace:')) {
        acc[key] = `${latestVersion}`
      } else {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string>,
  )
  packageJson.dependencies = updatedDependencies
}
```

--------------------------------------------------------------------------------

---[FILE: generate-template-variations.ts]---
Location: payload-main/tools/scripts/src/generate-template-variations.ts

```typescript
/**
 * This script generates variations of the templates into the `templates` directory.
 *
 * How to use:
 *
 * pnpm run script:gen-templates
 *
 * NOTE: You will likely have to commit by using the `--no-verify` flag to avoid the repo linting
 *       There is no way currently to have lint-staged ignore the templates directory.
 */

import type { DbType, StorageAdapterType } from 'create-payload-app/types'

import { PROJECT_ROOT, TEMPLATES_DIR } from '@tools/constants'
import chalk from 'chalk'
import { execSync } from 'child_process'
import { configurePayloadConfig } from 'create-payload-app/lib/configure-payload-config.js'
import { copyRecursiveSync } from 'create-payload-app/utils/copy-recursive-sync.js'
import minimist from 'minimist'
import * as fs from 'node:fs/promises'
import path from 'path'

type TemplateVariation = {
  /** Base template to copy from */
  base?: 'none' | ({} & string)
  configureConfig?: boolean
  db: DbType
  /** Directory in templates dir */
  dirname: string
  envNames?: {
    dbUri: string
  }
  /**
   * If the template is part of the workspace, then do not replace the package.json versions
   */
  workspace?: boolean
  generateLockfile?: boolean
  /** package.json name */
  name: string
  sharp: boolean
  skipConfig?: boolean
  /**
   * @default false
   */
  skipDockerCompose?: boolean
  /**
   * @default false
   */
  skipReadme?: boolean
  /**
   * @default false
   */
  skipAgents?: boolean
  storage: StorageAdapterType
  vercelDeployButtonLink?: string
  /**
   * Identify where this template is intended to be deployed.
   * Useful for making some modifications like PNPM's engines config for Vercel.
   *
   * @default 'default'
   */
  targetDeployment?: 'cloudflare' | 'default' | 'vercel'
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const args = minimist(process.argv.slice(2))
  const template = args['template'] // template directory name

  const shouldBuild = args['build']

  const templateRepoUrlBase = `https://github.com/payloadcms/payload/tree/main/templates`

  let variations: TemplateVariation[] = [
    {
      name: 'with-vercel-postgres',
      db: 'vercel-postgres',
      dirname: 'with-vercel-postgres',
      envNames: {
        // This will replace the process.env.DATABASE_URI to process.env.POSTGRES_URL
        dbUri: 'POSTGRES_URL',
      },
      sharp: false,
      skipDockerCompose: true,
      skipReadme: true,
      skipAgents: false,
      storage: 'vercelBlobStorage',
      targetDeployment: 'vercel',
      vercelDeployButtonLink:
        `https://vercel.com/new/clone?repository-url=` +
        encodeURI(
          `${templateRepoUrlBase}/with-vercel-postgres` +
            '&project-name=payload-project' +
            '&env=PAYLOAD_SECRET' +
            '&build-command=pnpm run ci' +
            '&stores=[{"type":"postgres"},{"type":"blob"}]', // Postgres and Vercel Blob Storage
        ),
    },
    {
      name: 'with-vercel-website',
      base: 'website', // This is the base template to copy from
      db: 'vercel-postgres',
      dirname: 'with-vercel-website',
      envNames: {
        // This will replace the process.env.DATABASE_URI to process.env.POSTGRES_URL
        dbUri: 'POSTGRES_URL',
      },
      sharp: true,
      skipDockerCompose: true,
      skipReadme: true,
      skipAgents: false,
      storage: 'vercelBlobStorage',
      targetDeployment: 'vercel',
      vercelDeployButtonLink:
        `https://vercel.com/new/clone?repository-url=` +
        encodeURI(
          `${templateRepoUrlBase}/with-vercel-website` +
            '&project-name=payload-project' +
            '&env=PAYLOAD_SECRET%2CCRON_SECRET' +
            '&build-command=pnpm run ci' +
            '&stores=[{"type":"postgres"},{"type":"blob"}]', // Postgres and Vercel Blob Storage
        ),
    },
    {
      name: 'with-postgres',
      db: 'postgres',
      dirname: 'with-postgres',
      sharp: true,
      skipDockerCompose: true,
      skipAgents: false,
      storage: 'localDisk',
    },
    {
      name: 'with-vercel-mongodb',
      db: 'mongodb',
      dirname: 'with-vercel-mongodb',
      envNames: {
        dbUri: 'MONGODB_URI',
      },
      sharp: false,
      storage: 'vercelBlobStorage',
      skipReadme: true,
      skipAgents: false,
      targetDeployment: 'vercel',
      vercelDeployButtonLink:
        `https://vercel.com/new/clone?repository-url=` +
        encodeURI(
          `${templateRepoUrlBase}/with-vercel-mongodb` +
            '&project-name=payload-project' +
            '&env=PAYLOAD_SECRET' +
            '&build-command=pnpm run ci' +
            '&stores=[{"type":"blob"}]' + // Vercel Blob Storage
            '&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH', // MongoDB Atlas
        ),
    },
    {
      name: 'blank',
      db: 'mongodb',
      dirname: 'blank',
      generateLockfile: true,
      sharp: true,
      skipConfig: true, // Do not copy the payload.config.ts file from the base template
      skipReadme: true, // Do not copy the README.md file from the base template
      skipAgents: false,
      storage: 'localDisk',
      // The blank template is used as a base for create-payload-app functionality,
      // so we do not configure the payload.config.ts file, which leaves the placeholder comments.
      configureConfig: false,
      workspace: true,
      base: 'none', // Do not copy from the base _template directory
    },
    {
      name: 'website',
      db: 'mongodb',
      dirname: 'website',
      generateLockfile: true,
      sharp: true,
      skipConfig: true, // Do not copy the payload.config.ts file from the base template
      skipAgents: false,
      storage: 'localDisk',
      // The blank template is used as a base for create-payload-app functionality,
      // so we do not configure the payload.config.ts file, which leaves the placeholder comments.
      configureConfig: false,
      base: 'none',
      skipDockerCompose: true,
      skipReadme: true,
      workspace: true,
    },
    {
      name: 'ecommerce',
      db: 'mongodb',
      dirname: 'ecommerce',
      generateLockfile: true,
      sharp: true,
      skipConfig: true, // Do not copy the payload.config.ts file from the base template
      skipAgents: false,
      storage: 'localDisk',
      // The blank template is used as a base for create-payload-app functionality,
      // so we do not configure the payload.config.ts file, which leaves the placeholder comments.
      configureConfig: false,
      base: 'none',
      skipDockerCompose: true,
      skipReadme: true,
      workspace: true,
    },
    {
      name: 'with-cloudflare-d1',
      db: 'd1-sqlite',
      dirname: 'with-cloudflare-d1',
      generateLockfile: false,
      sharp: false,
      skipConfig: true, // Do not copy the payload.config.ts file from the base template
      skipAgents: false,
      storage: 'r2Storage',
      // The blank template is used as a base for create-payload-app functionality,
      // so we do not configure the payload.config.ts file, which leaves the placeholder comments.
      configureConfig: false,
      base: 'none',
      skipDockerCompose: true,
      skipReadme: true,
      workspace: false,
      targetDeployment: 'cloudflare',
    },
  ]

  // If template is set, only generate that template
  if (template) {
    const variation = variations.find((v) => v.dirname === template)
    if (!variation) {
      throw new Error(`Variation not found: ${template}`)
    }
    variations = [variation]
  }

  for (const variation of variations) {
    const {
      name,
      base,
      configureConfig,
      db,
      dirname,
      envNames,
      generateLockfile,
      sharp,
      skipConfig = false,
      skipDockerCompose = false,
      skipReadme = false,
      skipAgents = false,
      storage,
      vercelDeployButtonLink,
      targetDeployment = 'default',
      workspace = false,
    } = variation

    header(`Generating ${name}...`)
    const destDir = path.join(TEMPLATES_DIR, dirname)
    if (base !== 'none') {
      copyRecursiveSync(path.join(TEMPLATES_DIR, base || '_template'), destDir, [
        'node_modules',
        '\\*\\.tgz',
        '.next',
        '.env$',
        'pnpm-lock.yaml',
        ...(skipReadme ? ['README.md'] : []),
        ...(skipDockerCompose ? ['docker-compose.yml'] : []),
        ...(skipConfig ? ['payload.config.ts'] : []),
      ])
    }

    log(`Copied to ${destDir}`)

    // Copy _agents files
    if (!skipAgents) {
      await copyAgentsFiles({ destDir })
    }

    if (configureConfig !== false) {
      log('Configuring payload.config.ts')
      const configureArgs = {
        dbType: db,
        envNames,
        packageJsonName: name,
        projectDirOrConfigPath: { projectDir: destDir },
        sharp,
        storageAdapter: storage,
      }

      await configurePayloadConfig(configureArgs)

      log('Configuring .env.example')
      // Replace DATABASE_URI with the correct env name if set
      await writeEnvExample({
        dbType: db,
        destDir,
        envNames,
      })
    }

    if (!skipReadme) {
      await generateReadme({
        data: {
          name,
          attributes: { db, storage },
          description: name, // TODO: Add descriptions
          ...(vercelDeployButtonLink && { vercelDeployButtonLink }),
        },
        destDir,
      })
    }

    // Fetch latest npm version of payload package:
    const payloadVersion = await getLatestPackageVersion({ packageName: 'payload' })

    // Bump package.json versions only in non-workspace templates such as Vercel variants
    // Workspace templates should always continue to point to `workspace:*` version of payload packages
    if (!workspace) {
      await bumpPackageJson({
        templateDir: destDir,
        latestVersion: payloadVersion,
      })
    }

    // Install packages BEFORE running any commands that load the config
    // This ensures all imports in payload.config.ts can be resolved
    if (generateLockfile) {
      log('Generating pnpm-lock.yaml')
      execSyncSafe(`pnpm install ${workspace ? '' : '--ignore-workspace'} --no-frozen-lockfile`, {
        cwd: destDir,
      })
    } else {
      log('Installing dependencies without generating lockfile')
      execSyncSafe(`pnpm install ${workspace ? '' : '--ignore-workspace'} --no-frozen-lockfile`, {
        cwd: destDir,
      })
      await fs.rm(`${destDir}/pnpm-lock.yaml`, { force: true })
    }

    // Copy in initial migration if db is postgres. This contains user and media.
    if (db === 'postgres' || db === 'vercel-postgres') {
      // Add "ci" script to package.json
      const packageJsonPath = path.join(destDir, 'package.json')
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
      packageJson.scripts = packageJson.scripts || {}
      packageJson.scripts.ci = 'payload migrate && pnpm build'
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

      const migrationDestDir = path.join(destDir, 'src/migrations')

      // Delete and recreate migrations directory
      await fs.rm(migrationDestDir, { force: true, recursive: true })
      await fs.mkdir(migrationDestDir, { recursive: true })

      log(`Generating initial migrations in ${migrationDestDir}`)

      execSyncSafe(`pnpm run payload migrate:create initial`, {
        cwd: destDir,
        env: {
          ...process.env,
          BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_TEST_asdf',
          DATABASE_URI: process.env.POSTGRES_URL || 'postgres://localhost:5432/your-database-name',
          PAYLOAD_SECRET: 'asecretsolongnotevensantacouldguessit',
        },
      })
    }

    if (targetDeployment) {
      await handleDeploymentTarget({
        targetDeployment,
        destDir,
      })
    }

    // Generate importmap
    log('Generating import map')
    execSyncSafe(`pnpm ${workspace ? '' : '--ignore-workspace '}generate:importmap`, {
      cwd: destDir,
    })

    // Generate types
    log('Generating types')
    execSyncSafe(`pnpm ${workspace ? '' : '--ignore-workspace '}generate:types`, {
      cwd: destDir,
    })

    if (shouldBuild) {
      log('Building...')
      execSyncSafe(`pnpm ${workspace ? '' : '--ignore-workspace '}build`, { cwd: destDir })
    }

    // TODO: Email?

    // TODO: Sharp?

    log(`Done configuring payload config for ${destDir}/src/payload.config.ts`)
  }
  log('Running prettier on generated files...')
  execSyncSafe(`pnpm prettier --write templates "*.{js,jsx,ts,tsx}"`, { cwd: PROJECT_ROOT })

  log('Template generation complete!')
}

async function generateReadme({
  data: { name, attributes, description, vercelDeployButtonLink },
  destDir,
}: {
  data: {
    attributes: Pick<TemplateVariation, 'db' | 'storage'>
    description: string
    name: string
    vercelDeployButtonLink?: string
  }
  destDir: string
}) {
  let header = `# ${name}\n`
  if (vercelDeployButtonLink) {
    header += `\n[![Deploy with Vercel](https://vercel.com/button)](${vercelDeployButtonLink})`
  }

  const readmeContent = `${header}

${description}

## Attributes

- **Database**: ${attributes.db}
- **Storage Adapter**: ${attributes.storage}
`

  const readmePath = path.join(destDir, 'README.md')
  await fs.writeFile(readmePath, readmeContent)
  log('Generated README.md')
}

async function copyAgentsFiles({ destDir }: { destDir: string }) {
  const agentsSourceDir = path.join(TEMPLATES_DIR, '_agents')

  if (!(await fs.stat(agentsSourceDir).catch(() => null))) {
    log(`Skipping agents copy: ${agentsSourceDir} does not exist`)
    return
  }

  log('Copying agents files')

  // Copy AGENTS.md
  const agentsMdSource = path.join(agentsSourceDir, 'AGENTS.md')
  const agentsMdDest = path.join(destDir, 'AGENTS.md')
  if (await fs.stat(agentsMdSource).catch(() => null)) {
    await fs.copyFile(agentsMdSource, agentsMdDest)
    log('Copied AGENTS.md')
  }

  // Copy .cursor directory
  const cursorSourceDir = path.join(agentsSourceDir, 'rules')
  const cursorDestDir = path.join(destDir, '.cursor', 'rules')
  if (await fs.stat(cursorSourceDir).catch(() => null)) {
    await fs.mkdir(path.dirname(cursorDestDir), { recursive: true })
    await fs.cp(cursorSourceDir, cursorDestDir, { recursive: true })
    log('Copied .cursor/rules/')
  }
}

async function handleDeploymentTarget({
  targetDeployment,
  destDir,
}: {
  targetDeployment: TemplateVariation['targetDeployment']
  destDir: string
}) {
  if (targetDeployment === 'vercel') {
    // Add Vercel specific settings to package.json
    const packageJsonPath = path.join(destDir, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))

    if (packageJson.engines?.pnpm) {
      delete packageJson.engines.pnpm
    }

    const pnpmVersion = await getLatestPackageVersion({ packageName: 'pnpm' })

    packageJson.packageManager = `pnpm@${pnpmVersion}`

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }
}

async function writeEnvExample({
  dbType,
  destDir,
  envNames,
}: {
  dbType: DbType
  destDir: string
  envNames?: TemplateVariation['envNames']
}) {
  const envExamplePath = path.join(destDir, '.env.example')
  const envFileContents = await fs.readFile(envExamplePath, 'utf8')

  const fileContents = envFileContents
    .split('\n')
    .filter((l) => {
      // Remove the unwanted PostgreSQL connection comment for "with-vercel-website"
      if (
        dbType === 'vercel-postgres' &&
        (l.startsWith('# Or use a PG connection string') ||
          l.startsWith('#DATABASE_URI=postgresql://'))
      ) {
        return false // Skip this line
      }
      return true // Keep other lines
    })
    .map((l) => {
      if (l.startsWith('DATABASE_URI')) {
        if (dbType === 'mongodb') {
          l = 'MONGODB_URI=mongodb://127.0.0.1/your-database-name'
        }
        // Use db-appropriate connection string
        if (dbType.includes('postgres')) {
          l = 'DATABASE_URI=postgresql://127.0.0.1:5432/your-database-name'
        }

        // Replace DATABASE_URI with the correct env name if set
        if (envNames?.dbUri) {
          l = l.replace('DATABASE_URI', envNames.dbUri)
        }
      }
      return l
    })
    .filter((l) => l.trim() !== '')
    .join('\n')

  console.log(`Writing to ${envExamplePath}`)
  await fs.writeFile(envExamplePath, fileContents)
}

function header(message: string) {
  console.log(chalk.bold.green(`\n${message}\n`))
}

function log(message: string) {
  console.log(chalk.dim(message))
}

function execSyncSafe(command: string, options?: Parameters<typeof execSync>[1]) {
  try {
    log(`Executing: ${command}`)
    execSync(command, { stdio: 'inherit', ...options })
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stderr = (error as any).stderr?.toString()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stdout = (error as any).stdout?.toString()

      if (stderr && stderr.trim()) {
        console.error('Standard Error:', stderr)
      } else if (stdout && stdout.trim()) {
        console.error('Standard Output (likely contains error details):', stdout)
      } else {
        console.error('An unknown error occurred with no output.')
      }
    } else {
      console.error('An unexpected error occurred:', error)
    }
    throw error
  }
}

const DO_NOT_BUMP = ['@payloadcms/eslint-config', '@payloadcms/eslint-plugin']
async function bumpPackageJson({
  templateDir,
  latestVersion,
}: {
  templateDir: string
  latestVersion: string
}) {
  const packageJsonString = await fs.readFile(path.resolve(templateDir, 'package.json'), 'utf8')
  const packageJson = JSON.parse(packageJsonString)

  for (const key of ['dependencies', 'devDependencies']) {
    const dependencies = packageJson[key]
    if (dependencies) {
      for (const [packageName, _packageVersion] of Object.entries(dependencies)) {
        if (
          (packageName === 'payload' || packageName.startsWith('@payloadcms')) &&
          !DO_NOT_BUMP.includes(packageName)
        ) {
          dependencies[packageName] = latestVersion
        }
      }
    }
  }

  // write it out
  await fs.writeFile(
    path.resolve(templateDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  )
}

/**
 * Fetches the latest version of a package from the NPM registry.
 *
 * Used in determining the latest version of Payload to use in the generated templates.
 */
async function getLatestPackageVersion({
  packageName = 'payload',
}: {
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
    const response = await fetch(`https://registry.npmjs.org/-/package/${packageName}/dist-tags`)
    const data = await response.json()

    // Monster chaining for type safety just checking for data.latest
    const latestVersion =
      data &&
      typeof data === 'object' &&
      'latest' in data &&
      data.latest &&
      typeof data.latest === 'string'
        ? data.latest
        : null

    log(`Found latest version of ${packageName}: ${latestVersion}`)

    return latestVersion
  } catch (error) {
    console.error('Error fetching Payload version:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

````
