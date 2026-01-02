---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 120
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 120 of 695)

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

---[FILE: adapter-config.ts]---
Location: payload-main/packages/create-payload-app/src/lib/ast/adapter-config.ts

```typescript
/**
 * Centralized adapter configuration
 * Shared across all AST transformation and test files
 */

import type { DatabaseAdapter, StorageAdapter } from './types.js'

export type DatabaseAdapterConfig = {
  adapterName: string
  configTemplate: (envVar: string) => string
  packageName: string
}

export type StorageAdapterConfig = {
  adapterName: null | string
  configTemplate: () => null | string
  packageName: null | string
}

/**
 * Database adapter configurations
 */
export const DB_ADAPTER_CONFIG: Record<DatabaseAdapter, DatabaseAdapterConfig> = {
  'd1-sqlite': {
    adapterName: 'sqliteD1Adapter',
    configTemplate: () => `sqliteD1Adapter({
  binding: cloudflare.env.D1,
})`,
    packageName: '@payloadcms/db-d1-sqlite',
  },
  mongodb: {
    adapterName: 'mongooseAdapter',
    configTemplate: (envVar: string) => `mongooseAdapter({
  url: process.env.${envVar} || '',
})`,
    packageName: '@payloadcms/db-mongodb',
  },
  postgres: {
    adapterName: 'postgresAdapter',
    configTemplate: (envVar: string) => `postgresAdapter({
  pool: {
    connectionString: process.env.${envVar} || '',
  },
})`,
    packageName: '@payloadcms/db-postgres',
  },
  sqlite: {
    adapterName: 'sqliteAdapter',
    configTemplate: () => `sqliteAdapter({
  client: {
    url: process.env.DATABASE_URI || '',
  },
})`,
    packageName: '@payloadcms/db-sqlite',
  },
  'vercel-postgres': {
    adapterName: 'vercelPostgresAdapter',
    configTemplate: () => `vercelPostgresAdapter({
  pool: {
    connectionString: process.env.POSTGRES_URL || '',
  },
})`,
    packageName: '@payloadcms/db-vercel-postgres',
  },
} as const

/**
 * Storage adapter configurations
 */
export const STORAGE_ADAPTER_CONFIG: Record<StorageAdapter, StorageAdapterConfig> = {
  azureStorage: {
    adapterName: 'azureStorage',
    configTemplate: () => `azureStorage({
    collections: {
      media: true,
    },
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || '',
  })`,
    packageName: '@payloadcms/storage-azure',
  },
  gcsStorage: {
    adapterName: 'gcsStorage',
    configTemplate: () => `gcsStorage({
    collections: {
      media: true,
    },
    bucket: process.env.GCS_BUCKET || '',
  })`,
    packageName: '@payloadcms/storage-gcs',
  },
  localDisk: {
    adapterName: null,
    configTemplate: () => null,
    packageName: null,
  },
  r2Storage: {
    adapterName: 'r2Storage',
    configTemplate: () => `r2Storage({
    bucket: cloudflare.env.R2,
    collections: { media: true },
  })`,
    packageName: '@payloadcms/storage-r2',
  },
  s3Storage: {
    adapterName: 's3Storage',
    configTemplate: () => `s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.S3_BUCKET || '',
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      region: process.env.S3_REGION || '',
    },
  })`,
    packageName: '@payloadcms/storage-s3',
  },
  uploadthingStorage: {
    adapterName: 'uploadthingStorage',
    configTemplate: () => `uploadthingStorage({
    collections: {
      media: true,
    },
    token: process.env.UPLOADTHING_SECRET || '',
  })`,
    packageName: '@payloadcms/storage-uploadthing',
  },
  vercelBlobStorage: {
    adapterName: 'vercelBlobStorage',
    configTemplate: () => `vercelBlobStorage({
    collections: {
      media: true,
    },
    token: process.env.BLOB_READ_WRITE_TOKEN || '',
  })`,
    packageName: '@payloadcms/storage-vercel-blob',
  },
} as const

/**
 * Helper to get database adapter package name
 */
export function getDbPackageName(adapter: DatabaseAdapter): string {
  return DB_ADAPTER_CONFIG[adapter].packageName
}

/**
 * Helper to get database adapter name
 */
export function getDbAdapterName(adapter: DatabaseAdapter): string {
  return DB_ADAPTER_CONFIG[adapter].adapterName
}

/**
 * Helper to get storage adapter package name
 */
export function getStoragePackageName(adapter: StorageAdapter): null | string {
  return STORAGE_ADAPTER_CONFIG[adapter].packageName
}

/**
 * Helper to get storage adapter name
 */
export function getStorageAdapterName(adapter: StorageAdapter): null | string {
  return STORAGE_ADAPTER_CONFIG[adapter].adapterName
}
```

--------------------------------------------------------------------------------

---[FILE: package-json.spec.ts]---
Location: payload-main/packages/create-payload-app/src/lib/ast/package-json.spec.ts

```typescript
import { updatePackageJson } from './package-json'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

describe('updatePackageJson', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'payload-test-'))
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('updates database dependencies', () => {
    const pkgPath = path.join(tempDir, 'package.json')
    const originalPkg = {
      name: 'test-app',
      dependencies: {
        '@payloadcms/db-mongodb': '^3.0.0',
        payload: '^3.0.0',
      },
    }
    fs.writeFileSync(pkgPath, JSON.stringify(originalPkg, null, 2))

    updatePackageJson(pkgPath, {
      databaseAdapter: 'postgres',
    })

    const updated = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    expect(updated.dependencies['@payloadcms/db-postgres']).toBeDefined()
    expect(updated.dependencies['@payloadcms/db-mongodb']).toBeUndefined()
  })

  it('removes sharp when requested', () => {
    const pkgPath = path.join(tempDir, 'package.json')
    const originalPkg = {
      name: 'test-app',
      dependencies: {
        payload: '^3.0.0',
        sharp: '^0.33.0',
      },
    }
    fs.writeFileSync(pkgPath, JSON.stringify(originalPkg, null, 2))

    updatePackageJson(pkgPath, {
      removeSharp: true,
    })

    const updated = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    expect(updated.dependencies.sharp).toBeUndefined()
  })

  it('updates package name', () => {
    const pkgPath = path.join(tempDir, 'package.json')
    const originalPkg = {
      name: 'template-name',
      dependencies: {
        payload: '^3.0.0',
      },
    }
    fs.writeFileSync(pkgPath, JSON.stringify(originalPkg, null, 2))

    updatePackageJson(pkgPath, {
      packageName: 'my-new-app',
    })

    const updated = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    expect(updated.name).toBe('my-new-app')
  })
})
```

--------------------------------------------------------------------------------

---[FILE: package-json.ts]---
Location: payload-main/packages/create-payload-app/src/lib/ast/package-json.ts

```typescript
import * as fs from 'fs'

import type { DatabaseAdapter, StorageAdapter } from './types.js'

import { debug } from '../../utils/log.js'
import { getDbPackageName, getStoragePackageName } from './adapter-config.js'
import { ALL_DATABASE_ADAPTERS, ALL_STORAGE_ADAPTERS } from './types.js'

type PackageJsonTransformOptions = {
  databaseAdapter?: DatabaseAdapter
  packageName?: string
  removeSharp?: boolean
  storageAdapter?: StorageAdapter
}

type PackageJsonStructure = {
  [key: string]: unknown
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  name?: string
}

/**
 * Main orchestration function
 */
export function updatePackageJson(filePath: string, options: PackageJsonTransformOptions): void {
  debug(`[AST] Updating package.json: ${filePath}`)

  // Phase 1: Detection
  const pkg = parsePackageJson(filePath)

  // Phase 2: Transformation
  const transformed = transformPackageJson(pkg, options)

  // Phase 3: Modification
  writePackageJson(filePath, transformed)

  debug('[AST] ✓ package.json updated successfully')
}

// Helper functions

function parsePackageJson(filePath: string): PackageJsonStructure {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

/**
 *  Transforms the package.json based upon provided options
 */
function transformPackageJson(
  pkg: PackageJsonStructure,
  options: PackageJsonTransformOptions,
): PackageJsonStructure {
  const transformed = { ...pkg }

  // Update database adapter
  if (options.databaseAdapter) {
    debug(`[AST] Updating package.json database adapter to: ${options.databaseAdapter}`)

    transformed.dependencies = { ...transformed.dependencies }

    const removedAdapters: string[] = []
    ALL_DATABASE_ADAPTERS.forEach((adapter) => {
      const pkgName = getDbPackageName(adapter)
      if (transformed.dependencies![pkgName]) {
        removedAdapters.push(pkgName)
      }
      delete transformed.dependencies![pkgName]
    })

    if (removedAdapters.length > 0) {
      debug(`[AST] Removed old adapter packages: ${removedAdapters.join(', ')}`)
    }

    // Add new adapter
    const dbAdapterPackageName = getDbPackageName(options.databaseAdapter)
    const payloadVersion = transformed.dependencies?.payload || '^3.0.0'
    transformed.dependencies[dbAdapterPackageName] = payloadVersion

    debug(`[AST] Added adapter package: ${dbAdapterPackageName}`)
  }

  // Update storage adapter
  if (options.storageAdapter) {
    debug(`[AST] Updating package.json storage adapter to: ${options.storageAdapter}`)

    transformed.dependencies = { ...transformed.dependencies }

    const removedAdapters: string[] = []
    ALL_STORAGE_ADAPTERS.forEach((adapter) => {
      const pkgName = getStoragePackageName(adapter)
      if (pkgName && transformed.dependencies![pkgName]) {
        removedAdapters.push(pkgName)
      }
      if (pkgName) {
        delete transformed.dependencies![pkgName]
      }
    })

    if (removedAdapters.length > 0) {
      debug(`[AST] Removed old storage adapter packages: ${removedAdapters.join(', ')}`)
    }

    // Add new storage adapter (if not localDisk)
    const storagePackageName = getStoragePackageName(options.storageAdapter)
    if (storagePackageName) {
      const payloadVersion = transformed.dependencies?.payload || '^3.0.0'
      transformed.dependencies[storagePackageName] = payloadVersion
      debug(`[AST] Added storage adapter package: ${storagePackageName}`)
    } else {
      debug(`[AST] Storage adapter is localDisk, no package needed`)
    }
  }

  // Remove sharp
  if (options.removeSharp && transformed.dependencies) {
    transformed.dependencies = { ...transformed.dependencies }
    if (transformed.dependencies.sharp) {
      delete transformed.dependencies.sharp
      debug('[AST] Removed sharp dependency')
    } else {
      debug('[AST] Sharp dependency not found (already absent)')
    }
  }

  // Update package name
  if (options.packageName) {
    debug(`[AST] Updated package name to: ${options.packageName}`)
    transformed.name = options.packageName
  }

  return transformed
}

function writePackageJson(filePath: string, pkg: PackageJsonStructure): void {
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n')
}
```

--------------------------------------------------------------------------------

---[FILE: payload-config.spec.ts]---
Location: payload-main/packages/create-payload-app/src/lib/ast/payload-config.spec.ts

```typescript
import { Project } from 'ts-morph'
import {
  addDatabaseAdapter,
  addStorageAdapter,
  detectPayloadConfigStructure,
  removeSharp,
} from './payload-config'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

describe('detectPayloadConfigStructure', () => {
  it('successfully detects buildConfig call', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  db: mongooseAdapter({ url: '' }),
  plugins: []
})`,
    )

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(true)
    expect(result.structures?.buildConfigCall).toBeDefined()
  })

  it('fails when buildConfig call not found', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile('payload.config.ts', `export default {}`)

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(false)
    expect(result.error?.userMessage).toContain('buildConfig')
    expect(result.error?.technicalDetails).toContain('CallExpression')
  })

  it('detects buildConfig in variable declaration', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

const config = buildConfig({
  db: mongooseAdapter({ url: '' })
})

export default config`,
    )

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(true)
    expect(result.structures?.buildConfigCall).toBeDefined()
  })

  it('detects import alias edge case', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig as createConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default createConfig({
  db: mongooseAdapter({ url: '' }),
  collections: [],
})`,
    )

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(true)
    expect(result.edgeCases?.hasImportAlias).toBe(true)
    expect(result.structures?.buildConfigCall).toBeDefined()
  })

  it('detects multiple buildConfig calls', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

const helper = buildConfig({ collections: [] })

export default buildConfig({
  collections: [],
})`,
    )

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(true)
    expect(result.edgeCases?.multipleBuildConfigCalls).toBe(true)
  })

  it('detects other Payload imports', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig, CollectionConfig } from 'payload'

export default buildConfig({
  collections: [],
})`,
    )

    const result = detectPayloadConfigStructure(sourceFile)

    expect(result.success).toBe(true)
    expect(result.edgeCases?.hasOtherPayloadImports).toBe(true)
  })
})

describe('addDatabaseAdapter', () => {
  it.each([
    {
      adapter: 'mongodb' as const,
      adapterName: 'mongooseAdapter',
      packageName: '@payloadcms/db-mongodb',
    },
    {
      adapter: 'postgres' as const,
      adapterName: 'postgresAdapter',
      packageName: '@payloadcms/db-postgres',
    },
  ])('adds $adapter adapter with import and config', ({ adapter, adapterName, packageName }) => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  collections: []
})`,
    )

    const result = addDatabaseAdapter({
      sourceFile,
      adapter,
      envVarName: 'DATABASE_URI',
    })

    expect(result.success).toBe(true)
    expect(result.modified).toBe(true)
    expect(result.modifications.length).toBeGreaterThan(0)

    const text = sourceFile.getText()
    expect(text).toMatch(
      new RegExp(`import.*${adapterName}.*from.*${packageName.replace('/', '\\/')}`),
    )
    expect(text).toContain(`db: ${adapterName}`)
    expect(text).toContain('process.env.DATABASE_URI')
  })

  it('replaces existing db adapter', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({ url: '' }),
  collections: []
})`,
    )

    const result = addDatabaseAdapter({
      sourceFile,
      adapter: 'postgres',
      envVarName: 'DATABASE_URI',
    })

    expect(result.success).toBe(true)
    const text = sourceFile.getText()
    expect(text).toMatch(/import.*postgresAdapter.*from.*@payloadcms\/db-postgres/)
    expect(text).toContain('db: postgresAdapter')
    expect(text).not.toContain('mongooseAdapter')
    expect(text).not.toContain('@payloadcms/db-mongodb')
  })
})

describe('addStorageAdapter', () => {
  it('adds vercelBlobStorage adapter to plugins array', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  plugins: []
})`,
    )

    const result = addStorageAdapter({ sourceFile, adapter: 'vercelBlobStorage' })

    expect(result.success).toBe(true)
    expect(result.modified).toBe(true)
    const text = sourceFile.getText()
    expect(text).toMatch(/import.*vercelBlobStorage.*from.*@payloadcms\/storage-vercel-blob/)
    expect(text).toContain('vercelBlobStorage(')
  })

  it('creates plugins array if missing', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  collections: []
})`,
    )

    const result = addStorageAdapter({ sourceFile, adapter: 'r2Storage' })

    expect(result.success).toBe(true)
    const text = sourceFile.getText()
    expect(text).toContain('plugins: [')
    expect(text).toContain('r2Storage(')
  })

  it('adds to existing plugins array', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  plugins: [
    someOtherPlugin()
  ]
})`,
    )

    const result = addStorageAdapter({ sourceFile, adapter: 's3Storage' })

    expect(result.success).toBe(true)
    const text = sourceFile.getText()
    expect(text).toContain('someOtherPlugin()')
    expect(text).toContain('s3Storage(')
  })
})

describe('removeSharp', () => {
  it('removes sharp import and property', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'
import sharp from 'sharp'

export default buildConfig({
  sharp,
  collections: []
})`,
    )

    const result = removeSharp(sourceFile)

    expect(result.success).toBe(true)
    expect(result.modified).toBe(true)
    expect(result.modifications.length).toBeGreaterThan(0)
    const text = sourceFile.getText()
    expect(text).not.toContain("import sharp from 'sharp'")
    expect(text).not.toContain('sharp,')
  })

  it('does nothing if sharp not present', () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'payload.config.ts',
      `import { buildConfig } from 'payload'

export default buildConfig({
  collections: []
})`,
    )

    const result = removeSharp(sourceFile)

    expect(result.success).toBe(true)
    expect(result.modified).toBe(false)
  })
})

describe('configurePayloadConfig', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'payload-test-'))
  })

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true })
  })

  it('applies all transformations in one call (db + storage)', async () => {
    const filePath = path.join(tempDir, 'payload.config.ts')
    fs.writeFileSync(
      filePath,
      `import { buildConfig } from 'payload'

export default buildConfig({
  collections: []
})`,
    )

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      db: { type: 'postgres', envVarName: 'DATABASE_URL' },
      storage: 'vercelBlobStorage',
    })

    expect(result.success).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('postgresAdapter')
    expect(content).toContain('vercelBlobStorage')
    expect(content).toContain('DATABASE_URL')
  })

  it('applies db transformation only', async () => {
    const filePath = path.join(tempDir, 'payload.config.ts')
    fs.writeFileSync(
      filePath,
      `import { buildConfig } from 'payload'

export default buildConfig({
  collections: []
})`,
    )

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      db: { type: 'mongodb', envVarName: 'MONGO_URL' },
    })

    expect(result.success).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('mongooseAdapter')
    expect(content).toContain('MONGO_URL')
  })

  it('applies removeSharp transformation', async () => {
    const filePath = path.join(tempDir, 'payload.config.ts')
    fs.writeFileSync(
      filePath,
      `import { buildConfig } from 'payload'
import sharp from 'sharp'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({ url: '' }),
  sharp,
  collections: []
})`,
    )

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      removeSharp: true,
    })

    expect(result.success).toBe(true)

    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).not.toContain("import sharp from 'sharp'")
    expect(content).not.toContain('sharp,')
  })

  it('handles transformation errors gracefully', async () => {
    const filePath = path.join(tempDir, 'payload.config.ts')
    fs.writeFileSync(
      filePath,
      `export default {}`, // Invalid structure
    )

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      db: { type: 'postgres', envVarName: 'DATABASE_URL' },
    })

    expect(result.success).toBe(false)
    expect(result.error?.userMessage).toContain('buildConfig')
  })

  it('handles file not found error', async () => {
    const filePath = path.join(tempDir, 'nonexistent.ts')

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      db: { type: 'postgres', envVarName: 'DATABASE_URL' },
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('replaces adapter in config file', async () => {
    const filePath = path.join(tempDir, 'payload.config.ts')
    fs.writeFileSync(
      filePath,
      `import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  db: mongooseAdapter({ url: process.env.DATABASE_URI || '' }),
  collections: []
})`,
    )

    const { configurePayloadConfig } = await import('./payload-config')
    const result = await configurePayloadConfig(filePath, {
      db: { type: 'postgres', envVarName: 'DATABASE_URL' },
    })

    expect(result.success).toBe(true)

    // Verify config was updated
    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('postgresAdapter')
    expect(content).toContain('@payloadcms/db-postgres')
    expect(content).not.toContain('mongooseAdapter')
    expect(content).not.toContain('@payloadcms/db-mongodb')
  })
})
```

--------------------------------------------------------------------------------

````
