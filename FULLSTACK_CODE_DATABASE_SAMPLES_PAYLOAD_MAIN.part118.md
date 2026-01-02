---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 118
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 118 of 695)

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

---[FILE: configure-payload-config.ts]---
Location: payload-main/packages/create-payload-app/src/lib/configure-payload-config.ts

```typescript
import fse from 'fs-extra'
import globby from 'globby'
import path from 'path'

import type { DbType, StorageAdapterType } from '../types.js'

import { warning } from '../utils/log.js'
import { updatePackageJson } from './ast/package-json.js'
import { configurePayloadConfig as configurePayloadConfigAST } from './ast/payload-config.js'

/** Get default env var name for db type */
function getEnvVarName(dbType: DbType, customEnvName?: string): string {
  if (customEnvName) {
    return customEnvName
  }
  // Default env var names per adapter type
  if (dbType === 'vercel-postgres') {
    return 'POSTGRES_URL'
  }
  return 'DATABASE_URI'
}

/** Update payload config with necessary imports and adapters */
export async function configurePayloadConfig(args: {
  dbType?: DbType
  envNames?: {
    dbUri: string
  }
  packageJsonName?: string
  projectDirOrConfigPath: { payloadConfigPath: string } | { projectDir: string }
  sharp?: boolean
  storageAdapter?: StorageAdapterType
}): Promise<void> {
  if (!args.dbType) {
    return
  }

  // Update package.json
  const packageJsonPath =
    'projectDir' in args.projectDirOrConfigPath &&
    path.resolve(args.projectDirOrConfigPath.projectDir, 'package.json')

  if (packageJsonPath && fse.existsSync(packageJsonPath)) {
    try {
      updatePackageJson(packageJsonPath, {
        databaseAdapter: args.dbType,
        packageName: args.packageJsonName,
        removeSharp: args.sharp === false,
        storageAdapter: args.storageAdapter,
      })
    } catch (err: unknown) {
      warning(`Unable to configure Payload in package.json`)
      warning(err instanceof Error ? err.message : '')
    }
  }

  // Update payload.config.ts
  try {
    let payloadConfigPath: string | undefined
    if (!('payloadConfigPath' in args.projectDirOrConfigPath)) {
      payloadConfigPath = (
        await globby('**/payload.config.ts', {
          absolute: true,
          cwd: args.projectDirOrConfigPath.projectDir,
        })
      )?.[0]
    } else {
      payloadConfigPath = args.projectDirOrConfigPath.payloadConfigPath
    }

    if (!payloadConfigPath) {
      warning('Unable to update payload.config.ts with plugins. Could not find payload.config.ts.')
      return
    }

    const envVarName = getEnvVarName(args.dbType, args.envNames?.dbUri)

    const result = await configurePayloadConfigAST(payloadConfigPath, {
      db: {
        type: args.dbType,
        envVarName,
      },
      formatWithPrettier: true,
      removeSharp: args.sharp === false,
      storage: args.storageAdapter,
      validateStructure: false,
    })

    if (!result.success && result.error) {
      warning(`Unable to update payload.config.ts: ${result.error.userMessage}`)
    }
  } catch (err: unknown) {
    warning(
      `Unable to update payload.config.ts with plugins: ${err instanceof Error ? err.message : ''}`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: configure-plugin-project.ts]---
Location: payload-main/packages/create-payload-app/src/lib/configure-plugin-project.ts

```typescript
import fse from 'fs-extra'
import path from 'path'

import { toCamelCase, toPascalCase } from '../utils/casing.js'

/**
 * Configures a plugin project by updating all package name placeholders to projectName
 */
export const configurePluginProject = ({
  projectDirPath,
  projectName,
}: {
  projectDirPath: string
  projectName: string
}) => {
  const devPayloadConfigPath = path.resolve(projectDirPath, './dev/payload.config.ts')
  const devTsConfigPath = path.resolve(projectDirPath, './dev/tsconfig.json')
  const indexTsPath = path.resolve(projectDirPath, './src/index.ts')
  const devImportMapPath = path.resolve(projectDirPath, './dev/app/(payload)/admin/importMap.js')

  const devPayloadConfig = fse.readFileSync(devPayloadConfigPath, 'utf8')
  const devTsConfig = fse.readFileSync(devTsConfigPath, 'utf8')
  const indexTs = fse.readFileSync(indexTsPath, 'utf-8')
  const devImportMap = fse.readFileSync(devImportMapPath, 'utf-8')

  const updatedTsConfig = devTsConfig.replaceAll('plugin-package-name-placeholder', projectName)
  const updatedImportMap = devImportMap.replaceAll('plugin-package-name-placeholder', projectName)
  let updatedIndexTs = indexTs.replaceAll('plugin-package-name-placeholder', projectName)

  const pluginExportVariableName = toCamelCase(projectName)

  updatedIndexTs = updatedIndexTs.replace(
    'export const myPlugin',
    `export const ${pluginExportVariableName}`,
  )

  updatedIndexTs = updatedIndexTs.replaceAll('MyPluginConfig', `${toPascalCase(projectName)}Config`)

  let updatedPayloadConfig = devPayloadConfig.replace(
    'plugin-package-name-placeholder',
    projectName,
  )

  updatedPayloadConfig = updatedPayloadConfig.replaceAll('myPlugin', pluginExportVariableName)

  fse.writeFileSync(devPayloadConfigPath, updatedPayloadConfig)
  fse.writeFileSync(devTsConfigPath, updatedTsConfig)
  fse.writeFileSync(indexTsPath, updatedIndexTs)
  fse.writeFileSync(devImportMapPath, updatedImportMap)
}
```

--------------------------------------------------------------------------------

---[FILE: create-project.spec.ts]---
Location: payload-main/packages/create-payload-app/src/lib/create-project.spec.ts

```typescript
import { jest } from '@jest/globals'
import fs from 'fs'
import fse from 'fs-extra'
import globby from 'globby'
import * as os from 'node:os'
import path from 'path'

import type { CliArgs, DbType, ProjectExample, ProjectTemplate } from '../types.js'

import { createProject, updatePackageJSONDependencies } from './create-project.js'
import { getValidTemplates } from './templates.js'

describe('createProject', () => {
  let projectDir: string

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.log = jest.fn()
  })

  beforeEach(() => {
    const tempDirectory = fs.realpathSync(os.tmpdir())
    projectDir = `${tempDirectory}/${Math.random().toString(36).substring(7)}`
  })

  afterEach(() => {
    if (fse.existsSync(projectDir)) {
      fse.rmSync(projectDir, { recursive: true })
    }
  })

  describe('#createProject', () => {
    const args = {
      _: ['project-name'],
      '--db': 'mongodb',
      '--local-template': 'blank',
      '--no-deps': true,
    } as CliArgs
    const packageManager = 'yarn'

    it('creates plugin template', async () => {
      const projectName = 'plugin'
      const template: ProjectTemplate = {
        name: 'plugin',
        type: 'plugin',
        description: 'Template for creating a Payload plugin',
        url: 'https://github.com/payloadcms/payload/templates/plugin',
      }

      await createProject({
        cliArgs: { ...args, '--local-template': 'plugin' } as CliArgs,
        packageManager,
        projectDir,
        projectName,
        template,
      })

      const packageJsonPath = path.resolve(projectDir, 'package.json')
      const packageJson = fse.readJsonSync(packageJsonPath)

      // Check package name and description
      expect(packageJson.name).toStrictEqual(projectName)
    })

    it('updates project name in plugin template importMap file', async () => {
      const projectName = 'my-custom-plugin'
      const template: ProjectTemplate = {
        name: 'plugin',
        type: 'plugin',
        description: 'Template for creating a Payload plugin',
        url: 'https://github.com/payloadcms/payload/templates/plugin',
      }

      await createProject({
        cliArgs: { ...args, '--local-template': 'plugin' } as CliArgs,
        packageManager,
        projectDir,
        projectName,
        template,
      })

      const importMapPath = path.resolve(projectDir, './dev/app/(payload)/admin/importMap.js')
      const importMapFile = fse.readFileSync(importMapPath, 'utf-8')

      expect(importMapFile).not.toContain('plugin-package-name-placeholder')
      expect(importMapFile).toContain('my-custom-plugin')
    })

    it('creates example', async () => {
      const projectName = 'custom-server-example'
      const example: ProjectExample = {
        name: 'custom-server',
        url: 'https://github.com/payloadcms/payload/examples/custom-server#main',
      }

      await createProject({
        cliArgs: {
          ...args,
          '--local-template': undefined,
          '--local-example': 'custom-server',
        } as CliArgs,
        packageManager,
        projectDir,
        projectName,
        example,
      })

      const packageJsonPath = path.resolve(projectDir, 'package.json')
      const packageJson = fse.readJsonSync(packageJsonPath)

      // Check package name and description
      expect(packageJson.name).toStrictEqual(projectName)
    })

    describe('creates project from template', () => {
      const templates = getValidTemplates()

      it.each([
        ['blank', 'mongodb'],
        ['blank', 'postgres'],

        // TODO: Re-enable these once 3.0 is stable and templates updated
        // ['website', 'mongodb'],
        // ['website', 'postgres'],
        // ['ecommerce', 'mongodb'],
        // ['ecommerce', 'postgres'],
      ])('update config and deps: %s, %s', async (templateName, db) => {
        const projectName = 'starter-project'

        const template = templates.find((t) => t.name === templateName)

        const cliArgs = {
          ...args,
          '--db': db,
          '--local-template': templateName,
        } as CliArgs

        await createProject({
          cliArgs,
          dbDetails: {
            type: db as DbType,
            dbUri: `${db}://localhost:27017/create-project-test`,
          },
          packageManager,
          projectDir,
          projectName,
          template: template as ProjectTemplate,
        })

        const packageJsonPath = path.resolve(projectDir, 'package.json')
        const packageJson = fse.readJsonSync(packageJsonPath)

        // Verify git was initialized
        expect(fse.existsSync(path.resolve(projectDir, '.git'))).toBe(true)

        // Should only have one db adapter
        expect(
          Object.keys(packageJson.dependencies).filter((n) => n.startsWith('@payloadcms/db-')),
        ).toHaveLength(1)

        const payloadConfigPath = (
          await globby('**/payload.config.ts', {
            absolute: true,
            cwd: projectDir,
          })
        )?.[0]

        const content = fse.readFileSync(payloadConfigPath, 'utf-8')

        // Check payload.config.ts doesn't have placeholder comments
        expect(content).not.toContain('// database-adapter-import')
        expect(content).not.toContain('// database-adapter-config-start')
        expect(content).not.toContain('// database-adapter-config-end')

        // Verify correct adapter import and usage based on db type
        if (db === 'mongodb') {
          expect(content).toContain("import { mongooseAdapter } from '@payloadcms/db-mongodb'")
          expect(content).toContain('mongooseAdapter')
        } else if (db === 'postgres') {
          expect(content).toContain("import { postgresAdapter } from '@payloadcms/db-postgres'")
          expect(content).toContain('postgresAdapter')
        }
      })
    })

    describe('updates package.json', () => {
      it('updates package name and bumps workspace versions', async () => {
        const latestVersion = '3.0.0'
        const initialJSON = {
          name: 'test-project',
          version: '1.0.0',
          dependencies: {
            '@payloadcms/db-mongodb': 'workspace:*',
            payload: 'workspace:*',
            '@payloadcms/ui': 'workspace:*',
          },
        }

        const correctlyModifiedJSON = {
          name: 'test-project',
          version: '1.0.0',
          dependencies: {
            '@payloadcms/db-mongodb': `${latestVersion}`,
            payload: `${latestVersion}`,
            '@payloadcms/ui': `${latestVersion}`,
          },
        }

        updatePackageJSONDependencies({
          latestVersion,
          packageJson: initialJSON,
        })

        expect(initialJSON).toEqual(correctlyModifiedJSON)
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: create-project.ts]---
Location: payload-main/packages/create-payload-app/src/lib/create-project.ts

```typescript
import * as p from '@clack/prompts'
import chalk from 'chalk'
import execa from 'execa'
import fse from 'fs-extra'
import { fileURLToPath } from 'node:url'
import path from 'path'

import type {
  CliArgs,
  DbDetails,
  PackageManager,
  ProjectExample,
  ProjectTemplate,
} from '../types.js'

import { tryInitRepoAndCommit } from '../utils/git.js'
import { debug, error, info, warning } from '../utils/log.js'
import { configurePayloadConfig } from './configure-payload-config.js'
import { configurePluginProject } from './configure-plugin-project.js'
import { downloadExample } from './download-example.js'
import { downloadTemplate } from './download-template.js'
import { generateSecret } from './generate-secret.js'
import { manageEnvFiles } from './manage-env-files.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

async function createOrFindProjectDir(projectDir: string): Promise<void> {
  const pathExists = await fse.pathExists(projectDir)
  if (!pathExists) {
    await fse.mkdir(projectDir)
  }
}

async function installDeps(args: {
  cliArgs: CliArgs
  packageManager: PackageManager
  projectDir: string
}): Promise<boolean> {
  const { cliArgs, packageManager, projectDir } = args
  if (cliArgs['--no-deps']) {
    return true
  }
  let installCmd = 'npm install --legacy-peer-deps'

  if (packageManager === 'yarn') {
    installCmd = 'yarn'
  } else if (packageManager === 'pnpm') {
    installCmd = 'pnpm install'
  } else if (packageManager === 'bun') {
    installCmd = 'bun install'
  }

  try {
    await execa.command(installCmd, {
      cwd: path.resolve(projectDir),
    })
    return true
  } catch (err: unknown) {
    error(`Error installing dependencies${err instanceof Error ? `: ${err.message}` : ''}.`)
    return false
  }
}

type TemplateOrExample =
  | {
      example: ProjectExample
    }
  | {
      template: ProjectTemplate
    }

export async function createProject(
  args: {
    cliArgs: CliArgs
    dbDetails?: DbDetails
    packageManager: PackageManager
    projectDir: string
    projectName: string
  } & TemplateOrExample,
): Promise<void> {
  const { cliArgs, dbDetails, packageManager, projectDir, projectName } = args

  if (cliArgs['--dry-run']) {
    debug(`Dry run: Creating project in ${chalk.green(projectDir)}`)
    return
  }

  await createOrFindProjectDir(projectDir)

  if (cliArgs['--local-example']) {
    // Copy example from local path. For development purposes.
    const localExample = path.resolve(dirname, '../../../../examples/', cliArgs['--local-example'])
    await fse.copy(localExample, projectDir)
  }

  if (cliArgs['--local-template']) {
    // Copy template from local path. For development purposes.
    const localTemplate = path.resolve(
      dirname,
      '../../../../templates/',
      cliArgs['--local-template'],
    )
    await fse.copy(localTemplate, projectDir)
  } else if ('template' in args && 'url' in args.template) {
    const { template } = args
    if (cliArgs['--branch']) {
      template.url = `${template.url.split('#')?.[0]}#${cliArgs['--branch']}`
    }

    await downloadTemplate({
      debug: cliArgs['--debug'],
      projectDir,
      template,
    })
  } else if ('example' in args && 'url' in args.example) {
    const { example } = args
    if (cliArgs['--branch']) {
      example.url = `${example.url.split('#')?.[0]}#${cliArgs['--branch']}`
    }

    await downloadExample({
      debug: cliArgs['--debug'],
      example,
      projectDir,
    })
  }

  const spinner = p.spinner()
  spinner.start('Checking latest Payload version...')

  // Allows overriding the installed Payload version instead of installing the latest
  const versionFromCli = cliArgs['--version']

  let payloadVersion: string

  if (versionFromCli) {
    await verifyVersionForPackage({ version: versionFromCli })

    payloadVersion = versionFromCli

    spinner.stop(`Using provided version of Payload ${payloadVersion}`)
  } else {
    payloadVersion = await getLatestPackageVersion({ packageName: 'payload' })

    spinner.stop(`Found latest version of Payload ${payloadVersion}`)
  }

  await updatePackageJSON({ latestVersion: payloadVersion, projectDir, projectName })

  if ('template' in args) {
    if (args.template.type === 'plugin') {
      spinner.message('Configuring Plugin...')
      configurePluginProject({ projectDirPath: projectDir, projectName })
    } else {
      spinner.message('Configuring Payload...')
      await configurePayloadConfig({
        dbType: dbDetails?.type,
        projectDirOrConfigPath: { projectDir },
      })
    }
  }

  await manageEnvFiles({
    cliArgs,
    databaseType: dbDetails?.type,
    databaseUri: dbDetails?.dbUri,
    payloadSecret: generateSecret(),
    projectDir,
    template: 'template' in args ? args.template : undefined,
  })

  // Remove yarn.lock file. This is only desired in Payload Cloud.
  const lockPath = path.resolve(projectDir, 'pnpm-lock.yaml')
  if (fse.existsSync(lockPath)) {
    await fse.remove(lockPath)
  }

  if (!cliArgs['--no-deps']) {
    info(`Using ${packageManager}.\n`)
    spinner.message('Installing dependencies...')
    const result = await installDeps({ cliArgs, packageManager, projectDir })
    if (result) {
      spinner.stop('Successfully installed Payload and dependencies')
    } else {
      spinner.stop('Error installing dependencies', 1)
    }
  } else {
    spinner.stop('Dependency installation skipped')
  }

  if (!cliArgs['--no-git']) {
    tryInitRepoAndCommit({ cwd: projectDir })
  }
}

/**
 * Reads the package.json file into an object and then does the following:
 * - Sets the `name` property to the provided `projectName`.
 * - Bumps the payload packages from workspace:* to the latest version.
 * - Writes the updated object back to the package.json file.
 */
export async function updatePackageJSON(args: {
  /**
   * The latest version of Payload to use in the package.json.
   */
  latestVersion: string
  projectDir: string
  /**
   * The name of the project to set in package.json.
   */
  projectName: string
}): Promise<void> {
  const { latestVersion, projectDir, projectName } = args
  const packageJsonPath = path.resolve(projectDir, 'package.json')
  try {
    const packageObj = await fse.readJson(packageJsonPath)
    packageObj.name = projectName

    updatePackageJSONDependencies({
      latestVersion,
      packageJson: packageObj,
    })

    await fse.writeJson(packageJsonPath, packageObj, { spaces: 2 })
  } catch (err: unknown) {
    warning(`Unable to update name in package.json. ${err instanceof Error ? err.message : ''}`)
  }
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
      } else if (key === 'payload' || key.startsWith('@payloadcms')) {
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
}): Promise<string> {
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

    if (!latestVersion) {
      throw new Error(`No latest version found for package: ${packageName}`)
    }

    return latestVersion
  } catch (error) {
    console.error('Error fetching Payload version:', error)
    throw error
  }
}

/**
 * Verifies that the specified version of a package exists on the NPM registry.
 *
 * Throws an error if the version does not exist.
 */
async function verifyVersionForPackage({
  packageName = 'payload',
  version,
}: {
  /**
   * Package name to fetch the latest version for based on the NPM registry URL
   *
   * Eg. for `'payload'`, it will fetch the version from `https://registry.npmjs.org/payload`
   *
   * @default 'payload'
   */
  packageName?: string
  version: string
}): Promise<void> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/${version}`)

    if (response.status !== 200) {
      throw new Error(`No ${version} version found for package: ${packageName}`)
    }
  } catch (error) {
    console.error('Error verifying Payload version:', error)
    throw error
  }
}
```

--------------------------------------------------------------------------------

---[FILE: download-example.ts]---
Location: payload-main/packages/create-payload-app/src/lib/download-example.ts

```typescript
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { x } from 'tar'

import type { ProjectExample } from '../types.js'

import { debug as debugLog } from '../utils/log.js'

export async function downloadExample({
  debug,
  example,
  projectDir,
}: {
  debug?: boolean
  example: ProjectExample
  projectDir: string
}) {
  const branchOrTag = example.url.split('#')?.[1] || 'latest'
  const url = `https://codeload.github.com/payloadcms/payload/tar.gz/${branchOrTag}`
  const filter = `payload-${branchOrTag.replace(/^v/, '')}/examples/${example.name}/`

  if (debug) {
    debugLog(`Using example url: ${example.url}`)
    debugLog(`Codeload url: ${url}`)
    debugLog(`Filter: ${filter}`)
  }

  await pipeline(
    await downloadTarStream(url),
    x({
      cwd: projectDir,
      filter: (p) => p.includes(filter),
      strip: 2 + example.name.split('/').length,
    }),
  )
}

async function downloadTarStream(url: string) {
  const res = await fetch(url)

  if (!res.body) {
    throw new Error(`Failed to download: ${url}`)
  }

  return Readable.from(res.body as unknown as NodeJS.ReadableStream)
}
```

--------------------------------------------------------------------------------

---[FILE: download-template.ts]---
Location: payload-main/packages/create-payload-app/src/lib/download-template.ts

```typescript
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { x } from 'tar'

import type { ProjectTemplate } from '../types.js'

import { debug as debugLog } from '../utils/log.js'

export async function downloadTemplate({
  debug,
  projectDir,
  template,
}: {
  debug?: boolean
  projectDir: string
  template: ProjectTemplate
}) {
  const branchOrTag = template.url.split('#')?.[1] || 'latest'
  const url = `https://codeload.github.com/payloadcms/payload/tar.gz/${branchOrTag}`
  const filter = `payload-${branchOrTag.replace(/^v/, '').replaceAll('/', '-')}/templates/${template.name}/`

  if (debug) {
    debugLog(`Using template url: ${template.url}`)
    debugLog(`Codeload url: ${url}`)
    debugLog(`Filter: ${filter}`)
  }

  await pipeline(
    await downloadTarStream(url),
    x({
      cwd: projectDir,
      filter: (p) => p.includes(filter),
      strip: 2 + template.name.split('/').length,
    }),
  )
}

async function downloadTarStream(url: string) {
  const res = await fetch(url)

  if (!res.body) {
    throw new Error(`Failed to download: ${url}`)
  }

  return Readable.from(res.body as unknown as NodeJS.ReadableStream)
}
```

--------------------------------------------------------------------------------

---[FILE: examples.ts]---
Location: payload-main/packages/create-payload-app/src/lib/examples.ts

```typescript
import type { ProjectExample } from '../types.js'

import { error, info } from '../utils/log.js'

export async function getExamples({ branch }: { branch: string }): Promise<ProjectExample[]> {
  const url = `https://api.github.com/repos/payloadcms/payload/contents/examples?ref=${branch}`

  const response = await fetch(url)

  const examplesResponseList = (await response.json()) as { name: string; path: string }[]

  const examples: ProjectExample[] = examplesResponseList.map((example) => ({
    name: example.name,
    url: `https://github.com/payloadcms/payload/examples/${example.name}#${branch}`,
  }))

  return examples
}

export async function parseExample({
  name,
  branch,
}: {
  branch: string
  name: string
}): Promise<false | ProjectExample> {
  const examples = await getExamples({ branch })

  const example = examples.find((e) => e.name === name)

  if (!example) {
    error(`'${name}' is not a valid example name.`)
    info(`Valid examples: ${examples.map((e) => e.name).join(', ')}`)
    return false
  }

  return example
}
```

--------------------------------------------------------------------------------

---[FILE: generate-secret.ts]---
Location: payload-main/packages/create-payload-app/src/lib/generate-secret.ts

```typescript
import { randomBytes } from 'crypto'

export function generateSecret(): string {
  return randomBytes(32).toString('hex').slice(0, 24)
}
```

--------------------------------------------------------------------------------

---[FILE: get-package-manager.ts]---
Location: payload-main/packages/create-payload-app/src/lib/get-package-manager.ts

```typescript
import execa from 'execa'
import fse from 'fs-extra'

import type { CliArgs, PackageManager } from '../types.js'

export async function getPackageManager(args: {
  cliArgs?: CliArgs
  projectDir: string
}): Promise<PackageManager> {
  const { cliArgs, projectDir } = args

  try {
    // Check for flag or lockfile
    let detected: PackageManager = 'npm'
    if (cliArgs?.['--use-pnpm'] || fse.existsSync(`${projectDir}/pnpm-lock.yaml`)) {
      detected = 'pnpm'
    } else if (cliArgs?.['--use-yarn'] || fse.existsSync(`${projectDir}/yarn.lock`)) {
      detected = 'yarn'
    } else if (cliArgs?.['--use-npm'] || fse.existsSync(`${projectDir}/package-lock.json`)) {
      detected = 'npm'
    } else if (cliArgs?.['--use-bun'] || fse.existsSync(`${projectDir}/bun.lockb`)) {
      detected = 'bun'
    } else if (await commandExists('pnpm')) {
      // Prefer pnpm if it's installed
      detected = 'pnpm'
    } else {
      // Otherwise check the execution environment
      detected = getEnvironmentPackageManager()
    }

    return detected
  } catch (ignore) {
    return 'npm'
  }
}

function getEnvironmentPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent || ''

  if (userAgent.startsWith('yarn')) {
    return 'yarn'
  }

  if (userAgent.startsWith('pnpm')) {
    return 'pnpm'
  }

  if (userAgent.startsWith('bun')) {
    return 'bun'
  }

  return 'npm'
}

async function commandExists(command: string): Promise<boolean> {
  try {
    await execa.command(process.platform === 'win32' ? `where ${command}` : `command -v ${command}`)
    return true
  } catch {
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: init-next.ts]---
Location: payload-main/packages/create-payload-app/src/lib/init-next.ts

```typescript
import type { CompilerOptions } from 'typescript'

import * as p from '@clack/prompts'
import { parse, stringify } from 'comment-json'
import fs from 'fs'
import fse from 'fs-extra'
import globby from 'globby'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { promisify } from 'util'

import type { CliArgs, DbType, NextAppDetails, NextConfigType, PackageManager } from '../types.js'

import { copyRecursiveSync } from '../utils/copy-recursive-sync.js'
import { debug as origDebug, warning } from '../utils/log.js'
import { moveMessage } from '../utils/messages.js'
import { installPackages } from './install-packages.js'
import { wrapNextConfig } from './wrap-next-config.js'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type InitNextArgs = {
  dbType: DbType
  nextAppDetails?: NextAppDetails
  packageManager: PackageManager
  projectDir: string
  useDistFiles?: boolean
} & Pick<CliArgs, '--debug'>

type InitNextResult =
  | { isSrcDir: boolean; nextAppDir?: string; reason: string; success: false }
  | {
      isSrcDir: boolean
      nextAppDir: string
      payloadConfigPath: string
      success: true
    }

export async function initNext(args: InitNextArgs): Promise<InitNextResult> {
  const { dbType: dbType, packageManager, projectDir } = args

  const nextAppDetails = args.nextAppDetails || (await getNextAppDetails(projectDir))

  if (!nextAppDetails.nextAppDir) {
    warning(`Could not find app directory in ${projectDir}, creating...`)
    const createdAppDir = path.resolve(projectDir, nextAppDetails.isSrcDir ? 'src/app' : 'app')
    fse.mkdirSync(createdAppDir, { recursive: true })
    nextAppDetails.nextAppDir = createdAppDir
  }

  const { hasTopLevelLayout, isSrcDir, nextAppDir, nextConfigType } = nextAppDetails

  if (!nextConfigType) {
    return {
      isSrcDir,
      nextAppDir,
      reason: `Could not determine Next Config type in ${projectDir}. Possibly try renaming next.config.js to next.config.cjs or next.config.mjs.`,
      success: false,
    }
  }

  if (hasTopLevelLayout) {
    // Output directions for user to move all files from app to top-level directory named `(app)`
    p.log.warn(moveMessage({ nextAppDir, projectDir }))
    return {
      isSrcDir,
      nextAppDir,
      reason: 'Found existing layout.tsx in app directory',
      success: false,
    }
  }

  const installSpinner = p.spinner()
  installSpinner.start('Installing Payload and dependencies...')

  const configurationResult = await installAndConfigurePayload({
    ...args,
    nextAppDetails,
    nextConfigType,
    useDistFiles: true, // Requires running 'pnpm pack-template-files' in cpa
  })

  if (configurationResult.success === false) {
    installSpinner.stop(configurationResult.reason, 1)
    return { ...configurationResult, isSrcDir, success: false }
  }

  const { success: installSuccess } = await installDeps(projectDir, packageManager, dbType)
  if (!installSuccess) {
    installSpinner.stop('Failed to install dependencies', 1)
    return {
      ...configurationResult,
      isSrcDir,
      reason: 'Failed to install dependencies',
      success: false,
    }
  }

  // Add `@payload-config` to tsconfig.json `paths`
  await addPayloadConfigToTsConfig(projectDir, isSrcDir)
  installSpinner.stop('Successfully installed Payload and dependencies')
  return { ...configurationResult, isSrcDir, nextAppDir, success: true }
}

async function addPayloadConfigToTsConfig(projectDir: string, isSrcDir: boolean) {
  const tsConfigPath = path.resolve(projectDir, 'tsconfig.json')

  // Check if tsconfig.json exists
  if (!fs.existsSync(tsConfigPath)) {
    warning(`Could not find tsconfig.json to add @payload-config path.`)
    return
  }
  const userTsConfigContent = await readFile(tsConfigPath, {
    encoding: 'utf8',
  })
  const userTsConfig = parse(userTsConfigContent) as {
    compilerOptions?: CompilerOptions
  }

  const hasBaseUrl =
    userTsConfig?.compilerOptions?.baseUrl && userTsConfig?.compilerOptions?.baseUrl !== '.'
  const baseUrl = hasBaseUrl ? userTsConfig?.compilerOptions?.baseUrl : './'

  if (!userTsConfig.compilerOptions && !('extends' in userTsConfig)) {
    userTsConfig.compilerOptions = {}
  }

  if (
    !userTsConfig.compilerOptions?.paths?.['@payload-config'] &&
    userTsConfig.compilerOptions?.paths
  ) {
    userTsConfig.compilerOptions.paths = {
      ...(userTsConfig.compilerOptions.paths || {}),
      '@payload-config': [`${baseUrl}${isSrcDir ? 'src/' : ''}payload.config.ts`],
    }
    await writeFile(tsConfigPath, stringify(userTsConfig, null, 2), { encoding: 'utf8' })
  }
}

async function installAndConfigurePayload(
  args: {
    nextAppDetails: NextAppDetails
    nextConfigType: NextConfigType
    useDistFiles?: boolean
  } & InitNextArgs,
): Promise<
  | { payloadConfigPath: string; success: true }
  | { payloadConfigPath?: string; reason: string; success: false }
> {
  const {
    '--debug': debug,
    nextAppDetails: { isSrcDir, nextAppDir, nextConfigPath } = {},
    nextConfigType,
    projectDir,
    useDistFiles,
  } = args

  if (!nextAppDir || !nextConfigPath) {
    return {
      reason: 'Could not find app directory or next.config.js',
      success: false,
    }
  }

  const logDebug = (message: string) => {
    if (debug) {
      origDebug(message)
    }
  }

  if (!fs.existsSync(projectDir)) {
    return {
      reason: `Could not find specified project directory at ${projectDir}`,
      success: false,
    }
  }

  const templateFilesPath =
    dirname.endsWith('dist') || useDistFiles
      ? path.resolve(dirname, '../..', 'dist/template')
      : path.resolve(dirname, '../../../../templates/blank')

  logDebug(`Using template files from: ${templateFilesPath}`)

  if (!fs.existsSync(templateFilesPath)) {
    return {
      reason: `Could not find template source files from ${templateFilesPath}`,
      success: false,
    }
  } else {
    logDebug('Found template source files')
  }

  logDebug(`Copying template files from ${templateFilesPath} to ${nextAppDir}`)

  const templateSrcDir = path.resolve(templateFilesPath, isSrcDir ? '' : 'src')

  logDebug(`templateSrcDir: ${templateSrcDir}`)
  logDebug(`nextAppDir: ${nextAppDir}`)
  logDebug(`projectDir: ${projectDir}`)
  logDebug(`nextConfigPath: ${nextConfigPath}`)
  logDebug(`payloadConfigPath: ${path.resolve(projectDir, 'payload.config.ts')}`)

  logDebug(
    `isSrcDir: ${isSrcDir}. source: ${templateSrcDir}. dest: ${path.dirname(nextConfigPath)}`,
  )

  // This is a little clunky and needs to account for isSrcDir
  copyRecursiveSync(templateSrcDir, path.dirname(nextConfigPath))

  // Wrap next.config.js with withPayload
  await wrapNextConfig({ nextConfigPath, nextConfigType })

  return {
    payloadConfigPath: path.resolve(nextAppDir, '../payload.config.ts'),
    success: true,
  }
}

async function installDeps(projectDir: string, packageManager: PackageManager, dbType: DbType) {
  const { getDbPackageName } = await import('./ast/adapter-config.js')

  const packagesToInstall = ['payload', '@payloadcms/next', '@payloadcms/richtext-lexical'].map(
    (pkg) => `${pkg}@latest`,
  )

  packagesToInstall.push(`${getDbPackageName(dbType)}@latest`)

  // Match graphql version of @payloadcms/next
  packagesToInstall.push('graphql@^16.8.1')

  return await installPackages({ packageManager, packagesToInstall, projectDir })
}

export async function getNextAppDetails(projectDir: string): Promise<NextAppDetails> {
  const isSrcDir = fs.existsSync(path.resolve(projectDir, 'src'))

  // Match next.config.js, next.config.ts, next.config.mjs, next.config.cjs
  const nextConfigPath: string | undefined = (
    await globby('next.config.(\\w)?(t|j)s', { absolute: true, cwd: projectDir })
  )?.[0]

  if (!nextConfigPath || nextConfigPath.length === 0) {
    return {
      hasTopLevelLayout: false,
      isSrcDir,
      isSupportedNextVersion: false,
      nextConfigPath: undefined,
      nextVersion: null,
    }
  }

  const packageObj = await fse.readJson(path.resolve(projectDir, 'package.json'))
  // Check if Next.js version is new enough
  let nextVersion = null
  if (packageObj.dependencies?.next) {
    nextVersion = packageObj.dependencies.next
    // Match versions using regex matching groups
    const versionMatch = /(?<major>\d+)/.exec(nextVersion)
    if (!versionMatch) {
      p.log.warn(`Could not determine Next.js version from ${nextVersion}`)
      return {
        hasTopLevelLayout: false,
        isSrcDir,
        isSupportedNextVersion: false,
        nextConfigPath,
        nextVersion,
      }
    }

    const { major } = versionMatch.groups as { major: string }
    const majorVersion = parseInt(major)
    if (majorVersion < 15) {
      return {
        hasTopLevelLayout: false,
        isSrcDir,
        isSupportedNextVersion: false,
        nextConfigPath,
        nextVersion,
      }
    }
  }

  const isSupportedNextVersion = true

  // Check if Payload already installed
  if (packageObj.dependencies?.payload) {
    return {
      hasTopLevelLayout: false,
      isPayloadInstalled: true,
      isSrcDir,
      isSupportedNextVersion,
      nextConfigPath,
      nextVersion,
    }
  }

  let nextAppDir: string | undefined = (
    await globby(['**/app'], {
      absolute: true,
      cwd: projectDir,
      ignore: ['**/node_modules/**'],
      onlyDirectories: true,
    })
  )?.[0]

  if (!nextAppDir || nextAppDir.length === 0) {
    nextAppDir = undefined
  }

  const configType = getProjectType({ nextConfigPath, packageObj })

  const hasTopLevelLayout = nextAppDir
    ? fs.existsSync(path.resolve(nextAppDir, 'layout.tsx'))
    : false

  return {
    hasTopLevelLayout,
    isSrcDir,
    isSupportedNextVersion,
    nextAppDir,
    nextConfigPath,
    nextConfigType: configType,
    nextVersion,
  }
}

function getProjectType(args: {
  nextConfigPath: string
  packageObj: Record<string, unknown>
}): NextConfigType {
  const { nextConfigPath, packageObj } = args

  if (nextConfigPath.endsWith('.ts')) {
    return 'ts'
  }

  if (nextConfigPath.endsWith('.mjs')) {
    return 'esm'
  }
  if (nextConfigPath.endsWith('.cjs')) {
    return 'cjs'
  }

  const packageJsonType = packageObj.type
  if (packageJsonType === 'module') {
    return 'esm'
  }
  if (packageJsonType === 'commonjs') {
    return 'cjs'
  }

  return 'cjs'
}
```

--------------------------------------------------------------------------------

---[FILE: install-packages.ts]---
Location: payload-main/packages/create-payload-app/src/lib/install-packages.ts

```typescript
import execa from 'execa'

import type { PackageManager } from '../types.js'

import { error, warning } from '../utils/log.js'

export async function installPackages(args: {
  packageManager: PackageManager
  packagesToInstall: string[]
  projectDir: string
}) {
  const { packageManager, packagesToInstall, projectDir } = args

  let exitCode = 0
  let stderr = ''

  switch (packageManager) {
    case 'bun':
    case 'pnpm':
    case 'yarn': {
      if (packageManager === 'bun') {
        warning('Bun support is untested.')
      }
      ;({ exitCode, stderr } = await execa(packageManager, ['add', ...packagesToInstall], {
        cwd: projectDir,
        env: {
          ...process.env,
          ...(packageManager === 'pnpm' && { npm_config_ignore_workspace_root_check: 'true' }),
        },
      }))
      break
    }
    case 'npm': {
      ;({ exitCode, stderr } = await execa('npm', ['install', '--save', ...packagesToInstall], {
        cwd: projectDir,
      }))
      break
    }
  }

  if (exitCode !== 0) {
    error(`Unable to install packages. Error: ${stderr}`)
  }

  return { success: exitCode === 0 }
}
```

--------------------------------------------------------------------------------

````
