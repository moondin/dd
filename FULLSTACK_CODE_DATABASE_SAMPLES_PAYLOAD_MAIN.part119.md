---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 119
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 119 of 695)

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

---[FILE: manage-env-files.spec.ts]---
Location: payload-main/packages/create-payload-app/src/lib/manage-env-files.spec.ts

```typescript
import { jest } from '@jest/globals'
import fs from 'fs'
import fse from 'fs-extra'
import * as os from 'node:os'
import path from 'path'

import type { CliArgs } from '../types.js'

import { manageEnvFiles } from './manage-env-files.js'

describe('createProject', () => {
  let projectDir: string
  let envFilePath = ''
  let envExampleFilePath = ''

  beforeAll(() => {
    // eslint-disable-next-line no-console
    console.log = jest.fn()
  })

  beforeEach(() => {
    const tempDirectory = fs.realpathSync(os.tmpdir())
    projectDir = `${tempDirectory}/${Math.random().toString(36).substring(7)}`

    envFilePath = path.join(projectDir, '.env')
    envExampleFilePath = path.join(projectDir, '.env.example')

    if (fse.existsSync(envFilePath)) {
      fse.removeSync(envFilePath)
    }

    fse.ensureDirSync(projectDir)
  })

  afterEach(() => {
    if (fse.existsSync(projectDir)) {
      fse.rmSync(projectDir, { recursive: true })
    }
  })

  it('generates .env using defaults (not from .env.example)', async () => {
    // ensure no .env.example exists so that the default values are used
    // the `manageEnvFiles` function will look for .env.example in the file system
    if (fse.existsSync(envExampleFilePath)) {
      fse.removeSync(envExampleFilePath)
    }

    await manageEnvFiles({
      cliArgs: {
        '--debug': true,
      } as CliArgs,
      databaseUri: '', // omitting this will ensure the default vars are used
      payloadSecret: '', // omitting this will ensure the default vars are used
      projectDir,
      template: undefined,
    })

    expect(fse.existsSync(envFilePath)).toBe(true)

    const updatedEnvContent = fse.readFileSync(envFilePath, 'utf-8')

    expect(updatedEnvContent).toBe(
      `# Added by Payload\nPAYLOAD_SECRET=YOUR_SECRET_HERE\nDATABASE_URI=your-connection-string-here`,
    )
  })

  it('generates .env from .env.example', async () => {
    // create or override the .env.example file with a connection string that will NOT be overridden
    fse.ensureFileSync(envExampleFilePath)
    fse.writeFileSync(
      envExampleFilePath,
      `DATABASE_URI=example-connection-string\nCUSTOM_VAR=custom-value\n`,
    )

    await manageEnvFiles({
      cliArgs: {
        '--debug': true,
      } as CliArgs,
      databaseUri: '', // omitting this will ensure the `.env.example` vars are used
      payloadSecret: '', // omitting this will ensure the `.env.example` vars are used
      projectDir,
      template: undefined,
    })

    expect(fse.existsSync(envFilePath)).toBe(true)

    const updatedEnvContent = fse.readFileSync(envFilePath, 'utf-8')

    expect(updatedEnvContent).toBe(
      `DATABASE_URI=example-connection-string\nCUSTOM_VAR=custom-value\nPAYLOAD_SECRET=YOUR_SECRET_HERE\n# Added by Payload`,
    )
  })

  it('updates existing .env without overriding vars', async () => {
    // create an existing .env file with some custom variables that should NOT be overridden
    fse.ensureFileSync(envFilePath)
    fse.writeFileSync(
      envFilePath,
      `CUSTOM_VAR=custom-value\nDATABASE_URI=example-connection-string\n`,
    )

    // create an .env.example file to ensure that its contents DO NOT override existing .env vars
    fse.ensureFileSync(envExampleFilePath)
    fse.writeFileSync(
      envExampleFilePath,
      `CUSTOM_VAR=custom-value-2\nDATABASE_URI=example-connection-string-2\n`,
    )

    await manageEnvFiles({
      cliArgs: {
        '--debug': true,
      } as CliArgs,
      databaseUri: '', // omitting this will ensure the `.env` vars are kept
      payloadSecret: '', // omitting this will ensure the `.env` vars are kept
      projectDir,
      template: undefined,
    })

    expect(fse.existsSync(envFilePath)).toBe(true)

    const updatedEnvContent = fse.readFileSync(envFilePath, 'utf-8')

    expect(updatedEnvContent).toBe(
      `# Added by Payload\nPAYLOAD_SECRET=YOUR_SECRET_HERE\nDATABASE_URI=example-connection-string\nCUSTOM_VAR=custom-value`,
    )
  })

  it('sanitizes .env based on selected database type', async () => {
    await manageEnvFiles({
      cliArgs: {
        '--debug': true,
      } as CliArgs,
      databaseType: 'mongodb', // this mimics the CLI selection and will be used as the DATABASE_URI
      databaseUri: 'mongodb://localhost:27017/test', // this mimics the CLI selection and will be used as the DATABASE_URI
      payloadSecret: 'test-secret', // this mimics the CLI selection and will be used as the PAYLOAD_SECRET
      projectDir,
      template: undefined,
    })

    const updatedEnvContent = fse.readFileSync(envFilePath, 'utf-8')

    expect(updatedEnvContent).toBe(
      `# Added by Payload\nPAYLOAD_SECRET=test-secret\nDATABASE_URI=mongodb://localhost:27017/test`,
    )

    // delete the generated .env file and do it again, but this time, omit the databaseUri to ensure the default is generated
    fse.removeSync(envFilePath)

    await manageEnvFiles({
      cliArgs: {
        '--debug': true,
      } as CliArgs,
      databaseType: 'mongodb', // this mimics the CLI selection and will be used as the DATABASE_URI
      databaseUri: '', // omit this to ensure the default is generated based on the selected database type
      payloadSecret: 'test-secret',
      projectDir,
      template: undefined,
    })

    const updatedEnvContentWithDefault = fse.readFileSync(envFilePath, 'utf-8')
    expect(updatedEnvContentWithDefault).toBe(
      `# Added by Payload\nPAYLOAD_SECRET=test-secret\nDATABASE_URI=mongodb://127.0.0.1/your-database-name`,
    )
  })
})
```

--------------------------------------------------------------------------------

---[FILE: manage-env-files.ts]---
Location: payload-main/packages/create-payload-app/src/lib/manage-env-files.ts

```typescript
import fs from 'fs-extra'
import path from 'path'

import type { CliArgs, DbType, ProjectTemplate } from '../types.js'

import { debug, error } from '../utils/log.js'
import { dbChoiceRecord } from './select-db.js'

const sanitizeEnv = ({
  contents,
  databaseType,
  databaseUri,
  payloadSecret,
}: {
  contents: string
  databaseType: DbType | undefined
  databaseUri?: string
  payloadSecret?: string
}): string => {
  const seenKeys = new Set<string>()

  // add defaults
  let withDefaults = contents

  if (
    !contents.includes('DATABASE_URI') &&
    !contents.includes('POSTGRES_URL') &&
    !contents.includes('MONGODB_URI') &&
    databaseType !== 'd1-sqlite'
  ) {
    withDefaults += '\nDATABASE_URI=your-connection-string-here'
  }

  if (!contents.includes('PAYLOAD_SECRET')) {
    withDefaults += '\nPAYLOAD_SECRET=YOUR_SECRET_HERE'
  }

  let updatedEnv = withDefaults
    .split('\n')
    .map((line) => {
      if (line.startsWith('#') || !line.includes('=')) {
        return line
      }

      const [key, value] = line.split('=')

      if (!key) {
        return
      }

      if (key === 'DATABASE_URI' || key === 'POSTGRES_URL' || key === 'MONGODB_URI') {
        const dbChoice = databaseType ? dbChoiceRecord[databaseType] : null

        if (dbChoice) {
          const placeholderUri = databaseUri
            ? databaseUri
            : `${dbChoice.dbConnectionPrefix}your-database-name${dbChoice.dbConnectionSuffix || ''}`
          line =
            databaseType === 'vercel-postgres'
              ? `POSTGRES_URL=${placeholderUri}`
              : `DATABASE_URI=${placeholderUri}`
        } else {
          line = `${key}=${value}`
        }
      }

      if (key === 'PAYLOAD_SECRET' || key === 'PAYLOAD_SECRET_KEY') {
        line = `PAYLOAD_SECRET=${payloadSecret || 'YOUR_SECRET_HERE'}`
      }

      // handles dupes
      if (seenKeys.has(key)) {
        return null
      }

      seenKeys.add(key)

      return line
    })
    .filter(Boolean)
    .reverse()
    .join('\n')

  if (!updatedEnv.includes('# Added by Payload')) {
    updatedEnv = `# Added by Payload\n${updatedEnv}`
  }

  return updatedEnv
}

/** Parse and swap .env.example values and write .env */
export async function manageEnvFiles(args: {
  cliArgs: CliArgs
  databaseType?: DbType
  databaseUri?: string
  payloadSecret: string
  projectDir: string
  template?: ProjectTemplate
}): Promise<void> {
  const { cliArgs, databaseType, databaseUri, payloadSecret, projectDir, template } = args

  const debugFlag = cliArgs['--debug']

  if (cliArgs['--dry-run']) {
    debug(`DRY RUN: Environment files managed`)
    return
  }

  const pathToEnvExample = path.join(projectDir, '.env.example')
  const envPath = path.join(projectDir, '.env')

  let exampleEnv: null | string = ''

  try {
    if (template?.type === 'plugin') {
      if (debugFlag) {
        debug(`plugin template detected - no .env added .env.example added`)
      }

      return
    }

    // If there's a .env.example file, use it to create or update the .env file
    if (fs.existsSync(pathToEnvExample)) {
      const envExampleContents = await fs.readFile(pathToEnvExample, 'utf8')

      exampleEnv = sanitizeEnv({
        contents: envExampleContents,
        databaseType,
        databaseUri,
        payloadSecret,
      })

      if (debugFlag) {
        debug(`.env.example file successfully read`)
      }
    }

    // If there's no .env file, create it using the .env.example content (if it exists)
    if (!fs.existsSync(envPath)) {
      const envContent = sanitizeEnv({
        contents: exampleEnv,
        databaseType,
        databaseUri,
        payloadSecret,
      })

      await fs.writeFile(envPath, envContent)

      if (debugFlag) {
        debug(`.env file successfully created`)
      }
    } else {
      // If the .env file already exists, sanitize it as-is
      const envContents = await fs.readFile(envPath, 'utf8')

      const updatedEnvContents = sanitizeEnv({
        contents: envContents,
        databaseType,
        databaseUri,
        payloadSecret,
      })

      await fs.writeFile(envPath, updatedEnvContents)

      if (debugFlag) {
        debug(`.env file successfully updated`)
      }
    }
  } catch (err: unknown) {
    error('Unable to manage environment files')
    if (err instanceof Error) {
      error(err.message)
    }
    process.exit(1)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: parse-project-name.ts]---
Location: payload-main/packages/create-payload-app/src/lib/parse-project-name.ts

```typescript
import * as p from '@clack/prompts'
import slugify from '@sindresorhus/slugify'

import type { CliArgs } from '../types.js'

export async function parseProjectName(args: CliArgs): Promise<string> {
  if (args['--name']) {
    return slugify(args['--name'])
  }
  if (args._[0]) {
    return slugify(args._[0])
  }

  const projectName = await p.text({
    message: 'Project name?',
    validate: (value) => {
      if (!value) {
        return 'Please enter a project name.'
      }
    },
  })
  if (p.isCancel(projectName)) {
    process.exit(0)
  }
  return slugify(projectName)
}
```

--------------------------------------------------------------------------------

---[FILE: parse-template.ts]---
Location: payload-main/packages/create-payload-app/src/lib/parse-template.ts

```typescript
import * as p from '@clack/prompts'

import type { CliArgs, ProjectTemplate } from '../types.js'

export async function parseTemplate(
  args: CliArgs,
  validTemplates: ProjectTemplate[],
): Promise<ProjectTemplate | undefined> {
  if (args['--template']) {
    const templateName = args['--template']
    const template = validTemplates.find((t) => t.name === templateName)
    if (!template) {
      throw new Error('Invalid template given')
    }
    return template
  }

  const response = await p.select<{ label: string; value: string }[], string>({
    message: 'Choose project template',
    options: validTemplates.map((p) => {
      return {
        label: p.name,
        value: p.name,
      }
    }),
  })
  if (p.isCancel(response)) {
    process.exit(0)
  }

  const template = validTemplates.find((t) => t.name === response)

  return template
}
```

--------------------------------------------------------------------------------

---[FILE: select-db.ts]---
Location: payload-main/packages/create-payload-app/src/lib/select-db.ts

```typescript
import * as p from '@clack/prompts'
import slugify from '@sindresorhus/slugify'

import type { CliArgs, DbDetails, DbType, ProjectTemplate } from '../types.js'

type DbChoice = {
  dbConnectionPrefix?: `${string}/`
  dbConnectionSuffix?: string
  title: string
  value: DbType
}

export const dbChoiceRecord: Record<DbType, DbChoice> = {
  'd1-sqlite': {
    title: 'Cloudflare D1 SQlite',
    value: 'd1-sqlite',
  },
  mongodb: {
    dbConnectionPrefix: 'mongodb://127.0.0.1/',
    title: 'MongoDB',
    value: 'mongodb',
  },
  postgres: {
    dbConnectionPrefix: 'postgres://postgres:<password>@127.0.0.1:5432/',
    title: 'PostgreSQL',
    value: 'postgres',
  },
  sqlite: {
    dbConnectionPrefix: 'file:./',
    dbConnectionSuffix: '.db',
    title: 'SQLite',
    value: 'sqlite',
  },
  'vercel-postgres': {
    dbConnectionPrefix: 'postgres://postgres:<password>@127.0.0.1:5432/',
    title: 'Vercel Postgres',
    value: 'vercel-postgres',
  },
}

export async function selectDb(
  args: CliArgs,
  projectName: string,
  template?: ProjectTemplate,
): Promise<DbDetails> {
  let dbType: DbType | symbol | undefined = undefined
  if (args['--db']) {
    if (!Object.values(dbChoiceRecord).some((dbChoice) => dbChoice.value === args['--db'])) {
      throw new Error(
        `Invalid database type given. Valid types are: ${Object.values(dbChoiceRecord)
          .map((dbChoice) => dbChoice.value)
          .join(', ')}`,
      )
    }
    dbType = args['--db'] as DbType
  } else if (template?.dbType) {
    // If the template has a pre-defined database type, use that
    dbType = template.dbType
  } else {
    dbType = await p.select<{ label: string; value: DbType }[], DbType>({
      initialValue: 'mongodb',
      message: `Select a database`,
      options: Object.values(dbChoiceRecord).map((dbChoice) => ({
        label: dbChoice.title,
        value: dbChoice.value,
      })),
    })
    if (p.isCancel(dbType)) {
      process.exit(0)
    }
  }

  const dbChoice = dbChoiceRecord[dbType]

  let dbUri: string | symbol | undefined = undefined
  const initialDbUri = `${dbChoice.dbConnectionPrefix}${
    projectName === '.' ? `payload-${getRandomDigitSuffix()}` : slugify(projectName)
  }${dbChoice.dbConnectionSuffix || ''}`

  if (args['--db-accept-recommended']) {
    dbUri = initialDbUri
  } else if (args['--db-connection-string']) {
    dbUri = args['--db-connection-string']
    // D1 Sqlite does not use a connection string so skip this prompt for this database
  } else if (dbType !== 'd1-sqlite') {
    dbUri = await p.text({
      initialValue: initialDbUri,
      message: `Enter ${dbChoice.title.split(' ')[0]} connection string`, // strip beta from title
    })
    if (p.isCancel(dbUri)) {
      process.exit(0)
    }
  }

  return {
    type: dbChoice.value,
    dbUri,
  }
}

function getRandomDigitSuffix(): string {
  return (Math.random() * Math.pow(10, 6)).toFixed(0)
}
```

--------------------------------------------------------------------------------

---[FILE: templates.ts]---
Location: payload-main/packages/create-payload-app/src/lib/templates.ts

```typescript
import type { ProjectTemplate } from '../types.js'

import { error, info } from '../utils/log.js'

export function validateTemplate({ templateName }: { templateName: string }): boolean {
  const validTemplates = getValidTemplates()
  if (!validTemplates.map((t) => t.name).includes(templateName)) {
    error(`'${templateName}' is not a valid template.`)
    info(`Valid templates: ${validTemplates.map((t) => t.name).join(', ')}`)
    return false
  }
  return true
}

export function getValidTemplates(): ProjectTemplate[] {
  // Starters _must_ be a valid template name from the templates/ directory
  return [
    {
      name: 'blank',
      type: 'starter',
      description: 'Blank 3.0 Template',
      url: `https://github.com/payloadcms/payload/templates/blank#main`,
    },
    {
      name: 'website',
      type: 'starter',
      description: 'Website Template',
      url: `https://github.com/payloadcms/payload/templates/website#main`,
    },
    {
      name: 'ecommerce',
      type: 'starter',
      description: 'Ecommerce template',
      url: 'https://github.com/payloadcms/payload/templates/ecommerce#main',
    },
    {
      name: 'with-cloudflare-d1',
      type: 'starter',
      dbType: 'd1-sqlite',
      description: 'Blank template with Cloudflare D1 and Workers integration',
      url: 'https://github.com/payloadcms/payload/templates/with-cloudflare-d1#main',
    },
    {
      name: 'plugin',
      type: 'plugin',
      description: 'Template for creating a Payload plugin',
      url: 'https://github.com/payloadcms/payload/templates/plugin#main',
    },
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: update-payload-in-project.ts]---
Location: payload-main/packages/create-payload-app/src/lib/update-payload-in-project.ts

```typescript
import fse from 'fs-extra'
import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import type { NextAppDetails } from '../types.js'

import { copyRecursiveSync } from '../utils/copy-recursive-sync.js'
import { getLatestPackageVersion } from '../utils/getLatestPackageVersion.js'
import { info } from '../utils/log.js'
import { getPackageManager } from './get-package-manager.js'
import { installPackages } from './install-packages.js'

export async function updatePayloadInProject(
  appDetails: NextAppDetails,
): Promise<{ message: string; success: boolean }> {
  if (!appDetails.nextConfigPath) {
    return { message: 'No Next.js config found', success: false }
  }

  const projectDir = path.dirname(appDetails.nextConfigPath)

  const packageObj = (await fse.readJson(path.resolve(projectDir, 'package.json'))) as {
    dependencies?: Record<string, string>
  }
  if (!packageObj?.dependencies) {
    throw new Error('No package.json found in this project')
  }

  const payloadVersion = packageObj.dependencies?.payload
  if (!payloadVersion) {
    throw new Error('Payload is not installed in this project')
  }

  const packageManager = await getPackageManager({ projectDir })

  // Fetch latest Payload version
  const latestPayloadVersion = await getLatestPackageVersion({ packageName: 'payload' })

  if (payloadVersion === latestPayloadVersion) {
    return { message: `Payload v${payloadVersion} is already up to date.`, success: true }
  }

  // Update all existing Payload packages
  const payloadPackages = Object.keys(packageObj.dependencies).filter((dep) =>
    dep.startsWith('@payloadcms/'),
  )

  const packageNames = ['payload', ...payloadPackages]

  const packagesToUpdate = packageNames.map((pkg) => `${pkg}@${latestPayloadVersion}`)

  info(`Using ${packageManager}.\n`)
  info(
    `Updating ${packagesToUpdate.length} Payload packages to v${latestPayloadVersion}...\n\n${packageNames.map((p) => `  - ${p}`).join('\n')}`,
  )

  const { success: updateSuccess } = await installPackages({
    packageManager,
    packagesToInstall: packagesToUpdate,
    projectDir,
  })

  if (!updateSuccess) {
    throw new Error('Failed to update Payload packages')
  }
  info('Payload packages updated successfully.')

  info(`Updating Payload Next.js files...`)

  const templateFilesPath =
    process.env.JEST_WORKER_ID !== undefined
      ? path.resolve(dirname, '../../../../templates/blank')
      : path.resolve(dirname, '../..', 'dist/template')

  const templateSrcDir = path.resolve(templateFilesPath, 'src/app/(payload)')

  copyRecursiveSync(
    templateSrcDir,
    path.resolve(projectDir, appDetails.isSrcDir ? 'src/app' : 'app', '(payload)'),
    ['custom.scss$'], // Do not overwrite user's custom.scss
  )

  return { message: 'Payload updated successfully.', success: true }
}
```

--------------------------------------------------------------------------------

---[FILE: wrap-next-config.spec.ts]---
Location: payload-main/packages/create-payload-app/src/lib/wrap-next-config.spec.ts
Signals: Next.js

```typescript
import * as p from '@clack/prompts'
import { jest } from '@jest/globals'

import { parseAndModifyConfigContent, withPayloadStatement } from './wrap-next-config.js'

const tsConfigs = {
  defaultNextConfig: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
export default nextConfig;`,

  nextConfigExportNamedDefault: `import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
const wrapped = someFunc(asdf);
export { wrapped as default };
`,
  nextConfigWithFunc: `import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default someFunc(nextConfig);
`,
  nextConfigWithFuncMultiline: `import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default someFunc(
  nextConfig
);
`,
  nextConfigWithSpread: `import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  ...someConfig,
};
export default nextConfig;
`,
}

const esmConfigs = {
  defaultNextConfig: `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
`,
  nextConfigExportNamedDefault: `const nextConfig = {};
const wrapped = someFunc(asdf);
export { wrapped as default };
`,
  nextConfigWithFunc: `const nextConfig = {};
export default someFunc(nextConfig);
`,
  nextConfigWithFuncMultiline: `const nextConfig = {};;
export default someFunc(
  nextConfig
);
`,
  nextConfigWithSpread: `const nextConfig = {
  ...someConfig,
};
export default nextConfig;
`,
}

const cjsConfigs = {
  anonConfig: `module.exports = {};`,
  defaultNextConfig: `
  /** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`,
  nextConfigExportNamedDefault: `const nextConfig = {};
const wrapped = someFunc(asdf);
module.exports = wrapped;
`,
  nextConfigWithFunc: `const nextConfig = {};
module.exports = someFunc(nextConfig);
`,
  nextConfigWithFuncMultiline: `const nextConfig = {};
module.exports = someFunc(
  nextConfig
);
`,
  nextConfigWithSpread: `const nextConfig = { ...someConfig };
module.exports = nextConfig;
`,
}

describe('parseAndInsertWithPayload', () => {
  describe('ts', () => {
    const configType = 'ts'
    const importStatement = withPayloadStatement[configType]

    it('should parse the default next config', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        tsConfigs.defaultNextConfig,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })

    it('should parse the config with a function', async () => {
      const { modifiedConfigContent: modifiedConfigContent2 } = await parseAndModifyConfigContent(
        tsConfigs.nextConfigWithFunc,
        configType,
      )
      expect(modifiedConfigContent2).toContain('withPayload(someFunc(nextConfig))')
    })

    it('should parse the config with a multi-lined function', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        tsConfigs.nextConfigWithFuncMultiline,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toMatch(/withPayload\(someFunc\(\n {2}nextConfig\n\)\)/)
    })

    it('should parse the config with a spread', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        tsConfigs.nextConfigWithSpread,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })
  })
  describe('esm', () => {
    const configType = 'esm'
    const importStatement = withPayloadStatement[configType]
    it('should parse the default next config', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        esmConfigs.defaultNextConfig,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })
    it('should parse the config with a function', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        esmConfigs.nextConfigWithFunc,
        configType,
      )
      expect(modifiedConfigContent).toContain('withPayload(someFunc(nextConfig))')
    })

    it('should parse the config with a multi-lined function', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        esmConfigs.nextConfigWithFuncMultiline,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toMatch(/withPayload\(someFunc\(\n {2}nextConfig\n\)\)/)
    })

    it('should parse the config with a spread', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        esmConfigs.nextConfigWithSpread,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })

    // Unsupported: export { wrapped as default }
    it('should give warning with a named export as default', async () => {
      const warnLogSpy = jest.spyOn(p.log, 'warn').mockImplementation(() => {})

      const { modifiedConfigContent, success } = await parseAndModifyConfigContent(
        esmConfigs.nextConfigExportNamedDefault,
        configType,
      )
      expect(modifiedConfigContent).toContain(importStatement)
      expect(success).toBe(false)

      expect(warnLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Could not automatically wrap'),
      )
    })
  })

  describe('cjs', () => {
    const configType = 'cjs'
    const requireStatement = withPayloadStatement[configType]
    it('should parse the default next config', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.defaultNextConfig,
        configType,
      )
      expect(modifiedConfigContent).toContain(requireStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })
    it('should parse anonymous default config', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.anonConfig,
        configType,
      )
      expect(modifiedConfigContent).toContain(requireStatement)
      expect(modifiedConfigContent).toContain('withPayload({})')
    })
    it('should parse the config with a function', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.nextConfigWithFunc,
        configType,
      )
      expect(modifiedConfigContent).toContain('withPayload(someFunc(nextConfig))')
    })
    it('should parse the config with a multi-lined function', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.nextConfigWithFuncMultiline,
        configType,
      )
      expect(modifiedConfigContent).toContain(requireStatement)
      expect(modifiedConfigContent).toMatch(/withPayload\(someFunc\(\n {2}nextConfig\n\)\)/)
    })
    it('should parse the config with a named export as default', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.nextConfigExportNamedDefault,
        configType,
      )
      expect(modifiedConfigContent).toContain(requireStatement)
      expect(modifiedConfigContent).toContain('withPayload(wrapped)')
    })

    it('should parse the config with a spread', async () => {
      const { modifiedConfigContent } = await parseAndModifyConfigContent(
        cjsConfigs.nextConfigWithSpread,
        configType,
      )
      expect(modifiedConfigContent).toContain(requireStatement)
      expect(modifiedConfigContent).toContain('withPayload(nextConfig)')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: wrap-next-config.ts]---
Location: payload-main/packages/create-payload-app/src/lib/wrap-next-config.ts

```typescript
import type { ExportDefaultExpression, ModuleItem } from '@swc/core'

import { parse } from '@swc/core'
import chalk from 'chalk'
import { parseModule, Syntax } from 'esprima-next'
import fs from 'fs'

import type { NextConfigType } from '../types.js'

import { log, warning } from '../utils/log.js'

export const withPayloadStatement = {
  cjs: `const { withPayload } = require("@payloadcms/next/withPayload");`,
  esm: `import { withPayload } from "@payloadcms/next/withPayload";`,
  ts: `import { withPayload } from "@payloadcms/next/withPayload";`,
}

export const wrapNextConfig = async (args: {
  nextConfigPath: string
  nextConfigType: NextConfigType
}) => {
  const { nextConfigPath, nextConfigType: configType } = args
  const configContent = fs.readFileSync(nextConfigPath, 'utf8')
  const { modifiedConfigContent: newConfig, success } = await parseAndModifyConfigContent(
    configContent,
    configType,
  )

  if (!success) {
    return
  }

  fs.writeFileSync(nextConfigPath, newConfig)
}

/**
 * Parses config content with AST and wraps it with withPayload function
 */
export async function parseAndModifyConfigContent(
  content: string,
  configType: NextConfigType,
): Promise<{ modifiedConfigContent: string; success: boolean }> {
  content = withPayloadStatement[configType] + '\n' + content

  if (configType === 'cjs' || configType === 'esm') {
    try {
      const ast = parseModule(content, { loc: true })

      if (configType === 'cjs') {
        // Find `module.exports = X`
        const moduleExports = ast.body.find(
          (p) =>
            p.type === Syntax.ExpressionStatement &&
            p.expression?.type === Syntax.AssignmentExpression &&
            p.expression.left?.type === Syntax.MemberExpression &&
            p.expression.left.object?.type === Syntax.Identifier &&
            p.expression.left.object.name === 'module' &&
            p.expression.left.property?.type === Syntax.Identifier &&
            p.expression.left.property.name === 'exports',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any

        if (moduleExports && moduleExports.expression.right?.loc) {
          const modifiedConfigContent = insertBeforeAndAfter(
            content,
            moduleExports.expression.right.loc,
          )
          return { modifiedConfigContent, success: true }
        }

        return Promise.resolve({
          modifiedConfigContent: content,
          success: false,
        })
      } else if (configType === 'esm') {
        const exportDefaultDeclaration = ast.body.find(
          (p) => p.type === Syntax.ExportDefaultDeclaration,
        ) as Directive | undefined

        const exportNamedDeclaration = ast.body.find(
          (p) => p.type === Syntax.ExportNamedDeclaration,
        ) as ExportNamedDeclaration | undefined

        if (!exportDefaultDeclaration && !exportNamedDeclaration) {
          throw new Error('Could not find ExportDefaultDeclaration in next.config.js')
        }

        if (exportDefaultDeclaration && exportDefaultDeclaration.declaration?.loc) {
          const modifiedConfigContent = insertBeforeAndAfter(
            content,
            exportDefaultDeclaration.declaration.loc,
          )
          return { modifiedConfigContent, success: true }
        } else if (exportNamedDeclaration) {
          const exportSpecifier = exportNamedDeclaration.specifiers.find(
            (s) =>
              s.type === 'ExportSpecifier' &&
              s.exported?.name === 'default' &&
              s.local?.type === 'Identifier' &&
              s.local?.name,
          )

          if (exportSpecifier) {
            warning('Could not automatically wrap next.config.js with withPayload.')
            warning('Automatic wrapping of named exports as default not supported yet.')

            warnUserWrapNotSuccessful(configType)
            return {
              modifiedConfigContent: content,
              success: false,
            }
          }
        }

        warning('Could not automatically wrap Next config with withPayload.')
        warnUserWrapNotSuccessful(configType)
        return Promise.resolve({
          modifiedConfigContent: content,
          success: false,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        warning(`Unable to parse Next config. Error: ${error.message} `)
        warnUserWrapNotSuccessful(configType)
      }
      return {
        modifiedConfigContent: content,
        success: false,
      }
    }
  } else if (configType === 'ts') {
    const { moduleItems, parseOffset } = await compileTypeScriptFileToAST(content)

    const exportDefaultDeclaration = moduleItems.find(
      (m) =>
        m.type === 'ExportDefaultExpression' &&
        (m.expression.type === 'Identifier' || m.expression.type === 'CallExpression'),
    ) as ExportDefaultExpression | undefined

    if (exportDefaultDeclaration) {
      if (!('span' in exportDefaultDeclaration.expression)) {
        warning('Could not automatically wrap Next config with withPayload.')
        warnUserWrapNotSuccessful(configType)
        return Promise.resolve({
          modifiedConfigContent: content,
          success: false,
        })
      }

      const modifiedConfigContent = insertBeforeAndAfterSWC(
        content,
        exportDefaultDeclaration.expression.span,
        parseOffset,
      )
      return { modifiedConfigContent, success: true }
    }
  }

  warning('Could not automatically wrap Next config with withPayload.')
  warnUserWrapNotSuccessful(configType)
  return Promise.resolve({
    modifiedConfigContent: content,
    success: false,
  })
}

function warnUserWrapNotSuccessful(configType: NextConfigType) {
  // Output directions for user to update next.config.js
  const withPayloadMessage = `

  ${chalk.bold(`Please manually wrap your existing Next config with the withPayload function. Here is an example:`)}

  ${withPayloadStatement[configType]}

  const nextConfig = {
    // Your Next.js config here
  }

  ${configType === 'cjs' ? 'module.exports = withPayload(nextConfig)' : 'export default withPayload(nextConfig)'}

`

  log(withPayloadMessage)
}

type Directive = {
  declaration?: {
    loc: Loc
  }
}

type ExportNamedDeclaration = {
  declaration: null
  loc: Loc
  specifiers: {
    exported: {
      loc: Loc
      name: string
      type: string
    }
    loc: Loc
    local: {
      loc: Loc
      name: string
      type: string
    }
    type: string
  }[]
  type: string
}

type Loc = {
  end: { column: number; line: number }
  start: { column: number; line: number }
}

function insertBeforeAndAfter(content: string, loc: Loc): string {
  const { end, start } = loc
  const lines = content.split('\n')

  const insert = (line: string, column: number, text: string) => {
    return line.slice(0, column) + text + line.slice(column)
  }

  // insert ) after end
  lines[end.line - 1] = insert(lines[end.line - 1]!, end.column, ')')
  // insert withPayload before start
  if (start.line === end.line) {
    lines[end.line - 1] = insert(lines[end.line - 1]!, start.column, 'withPayload(')
  } else {
    lines[start.line - 1] = insert(lines[start.line - 1]!, start.column, 'withPayload(')
  }

  return lines.join('\n')
}

function insertBeforeAndAfterSWC(
  content: string,
  span: ModuleItem['span'],
  /**
   * WARNING: This is ONLY for unit tests. Defaults to 0 otherwise.
   *
   * @see compileTypeScriptFileToAST
   */
  parseOffset: number,
): string {
  const { end: preOffsetEnd, start: preOffsetStart } = span

  const start = preOffsetStart - parseOffset
  const end = preOffsetEnd - parseOffset

  const insert = (pos: number, text: string): string => {
    return content.slice(0, pos) + text + content.slice(pos)
  }

  // insert ) after end
  content = insert(end - 1, ')')
  // insert withPayload before start
  content = insert(start - 1, 'withPayload(')

  return content
}

/**
 * Compile typescript to AST using the swc compiler
 */
async function compileTypeScriptFileToAST(
  fileContent: string,
): Promise<{ moduleItems: ModuleItem[]; parseOffset: number }> {
  let parseOffset = 0

  /**
   * WARNING: This is ONLY for unit tests.
   *
   * Multiple instances of swc DO NOT reset the .span.end value.
   * During unit tests, the .spawn.end value is read and accounted for.
   *
   * https://github.com/swc-project/swc/issues/1366
   */
  if (process.env.NODE_ENV === 'test') {
    parseOffset = (await parse('')).span.end
  }

  const module = await parse(fileContent, {
    syntax: 'typescript',
  })

  return { moduleItems: module.body, parseOffset }
}
```

--------------------------------------------------------------------------------

````
