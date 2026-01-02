---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 695
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 695 of 695)

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

---[FILE: license-check.ts]---
Location: payload-main/tools/scripts/src/license-check.ts

```typescript
/**
 * Run this script with `pnpm script:license-check` from root
 *
 * Outputs licenses.csv in the root directory
 */

import type { ExecSyncOptions } from 'child_process'

import { PROJECT_ROOT } from '@tools/constants'
import { getPackageDetails } from '@tools/releaser'
import chalk from 'chalk'
import { exec as execOrig } from 'child_process'
import { stringify } from 'csv-stringify/sync'
import fs from 'fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'path'
import util from 'util'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const execOpts: ExecSyncOptions = { stdio: 'inherit', cwd: PROJECT_ROOT }

const exec = util.promisify(execOrig)

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const packageDetails = await getPackageDetails()
  const packages = packageDetails.map((p) => p.shortName)

  header(`\n🔨 Getting all package.json licenses...`)
  const results: { component: string; package: string; license: string; repository: string }[] = []

  for (const pack of packages) {
    info(`Checking ${pack}...`)
    const prodResults = await runLicenseCheck(pack, 'production')
    const devResults = await runLicenseCheck(pack, 'development')
    results.push(...prodResults, ...devResults)
  }

  const outputPath = path.join(PROJECT_ROOT, 'licenses.csv')

  header(`\n💾 Writing to ${outputPath}...`)
  const csvString = stringify(results, { header: true })
  const buffer = Buffer.from(csvString)
  await fs.writeFile(outputPath, buffer)

  header(`🎉 Done!`)
}

function header(message: string) {
  console.log(chalk.bold.green(`${message}\n`))
}

function info(message: string) {
  console.log(chalk.dim(message))
}

async function runLicenseCheck(
  pkg: string,
  type: 'development' | 'production',
): Promise<{ component: string; package: string; license: string; repository: string }[]> {
  const result = await exec(
    `node ${path.resolve(dirname, '../node_modules/license-checker/bin/license-checker')} --summary --direct --start --json`,
    {
      ...execOpts,
      cwd: path.join(PROJECT_ROOT, 'packages', pkg),
    },
  )
  const a: Record<string, { licenses: string; repository: string }> = JSON.parse(result.stdout)
  const results: {
    component: string
    package: string
    license: string
    repository: string
    distributed: 'No' | 'Yes'
  }[] = []
  Object.entries(a).forEach(([key, value]) => {
    if (key.startsWith('@payloadcms/')) {
      return
    }
    results.push({
      component: pkg,
      package: key,
      license: value.licenses,
      repository: value.repository,
      distributed: type === 'production' ? 'Yes' : 'No',
    })
  })

  return results
}
```

--------------------------------------------------------------------------------

---[FILE: pack-all-to-dest.ts]---
Location: payload-main/tools/scripts/src/pack-all-to-dest.ts

```typescript
import type { PackageDetails } from '@tools/releaser'
import type { ExecSyncOptions } from 'child_process'

import { PROJECT_ROOT } from '@tools/constants'
import { getPackageDetails } from '@tools/releaser'
import chalk from 'chalk'
import { exec as execOrig, execSync } from 'child_process'
import minimist from 'minimist'
import path from 'path'
import util from 'util'

const execOpts: ExecSyncOptions = { stdio: 'inherit', cwd: PROJECT_ROOT }

const exec = util.promisify(execOrig)

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function main() {
  const all = process.argv.includes('--all')
  process.argv = process.argv.filter((arg) => arg !== '--all')

  const noBuild = process.argv.includes('--no-build')
  process.argv = process.argv.filter((arg) => arg !== '--no-build')

  const args = minimist(process.argv.slice(2))
  const { dest } = args
  if (!dest) {
    throw new Error('--dest is required')
  }

  const resolvedDest = path.resolve(path.isAbsolute(dest) ? dest : path.join(PROJECT_ROOT, dest))

  const packageWhitelist = all
    ? undefined
    : [
        'payload',
        'db-mongodb',
        'db-postgres',
        'db-d1-sqlite',
        'db-sqlite',
        'db-vercel-postgres',
        'drizzle',
        'graphql',
        'live-preview-react',
        'next',
        'payload-cloud',
        'plugin-form-builder',
        'plugin-ecommerce',
        'plugin-nested-docs',
        'plugin-redirects',
        'plugin-search',
        'plugin-seo',
        'richtext-lexical',
        'translations',
        'ui',
      ]

  const packageDetails = await getPackageDetails(packageWhitelist)

  // Prebuild all packages
  header(`\n🔨 Prebuilding all packages...`)

  const filtered = packageDetails.filter((p): p is Exclude<typeof p, null> => p !== null)

  if (!noBuild) {
    execSync('pnpm build:all --output-logs=errors-only', execOpts)
  }

  header(`\nOutputting ${filtered.length} packages...

${chalk.white.bold(listPackages(filtered))}`)

  header(`\n📦 Packing all packages to ${resolvedDest}...`)

  await Promise.all(
    filtered.map(async (p) => {
      await exec(`pnpm pack -C ${p.packagePath} --pack-destination ${resolvedDest}`, execOpts)
    }),
  )

  header(`\n🎉 Done!`)
}

function header(message: string, opts?: { enable?: boolean }) {
  console.log(chalk.bold.green(`${message}\n`))
}

function listPackages(packages: PackageDetails[]) {
  return packages.map((p) => `  - ${p.name}`).join('\n')
}
```

--------------------------------------------------------------------------------

---[FILE: core.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/core.ts

```typescript
import type { AcceptedLanguages, GenericTranslationsObject } from '@payloadcms/translations'

import { translations } from '@payloadcms/translations/all'
import { enTranslations } from '@payloadcms/translations/languages/en'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateObject } from './utils/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allTranslations: {
  [key in AcceptedLanguages]?: {
    dateFNSKey: string
    translations: GenericTranslationsObject
  }
} = {}

for (const key of Object.keys(translations) as AcceptedLanguages[]) {
  allTranslations[key] = {
    dateFNSKey: translations[key]?.dateFNSKey || 'unknown-date-fns-key',
    translations: translations[key]?.translations || {},
  }
}

void translateObject({
  allTranslationsObject: allTranslations,
  fromTranslationsObject: enTranslations,
  targetFolder: path.resolve(dirname, '../../../../packages/translations/src/languages'),
})
```

--------------------------------------------------------------------------------

---[FILE: plugin-import-export.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/plugin-import-export.ts

```typescript
import type { AcceptedLanguages, GenericTranslationsObject } from '@payloadcms/translations'

import { translations } from '@payloadcms/plugin-import-export/translations/languages/all'
import { enTranslations } from '@payloadcms/plugin-import-export/translations/languages/en'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateObject } from './utils/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allTranslations: {
  [key in AcceptedLanguages]?: {
    dateFNSKey: string
    translations: GenericTranslationsObject
  }
} = {}

for (const key of Object.keys(translations)) {
  allTranslations[key as AcceptedLanguages] = {
    dateFNSKey: translations[key as AcceptedLanguages]?.dateFNSKey ?? 'unknown-date-fns-key',
    translations: translations[key as AcceptedLanguages]?.translations ?? {},
  }
}

void translateObject({
  allTranslationsObject: allTranslations,
  fromTranslationsObject: enTranslations,
  targetFolder: path.resolve(
    dirname,
    '../../../../packages/plugin-import-export/src/translations/languages',
  ),
  tsFilePrefix: `import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'\n\nexport const {{locale}}Translations: PluginDefaultTranslationsObject = `,
  tsFileSuffix: `\n\nexport const {{locale}}: PluginLanguage = {
    dateFNSKey: {{dateFNSKey}},
    translations: {{locale}}Translations,
  }  `,
})
```

--------------------------------------------------------------------------------

---[FILE: plugin-multi-tenant.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/plugin-multi-tenant.ts

```typescript
import type { AcceptedLanguages, GenericTranslationsObject } from '@payloadcms/translations'

import { translations } from '@payloadcms/plugin-multi-tenant/translations/languages/all'
import { enTranslations } from '@payloadcms/plugin-multi-tenant/translations/languages/en'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateObject } from './utils/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allTranslations: {
  [key in AcceptedLanguages]?: {
    dateFNSKey: string
    translations: GenericTranslationsObject
  }
} = {}

for (const key of Object.keys(translations)) {
  allTranslations[key as AcceptedLanguages] = {
    dateFNSKey: translations[key as AcceptedLanguages]?.dateFNSKey ?? 'unknown-date-fns-key',
    translations: translations[key as AcceptedLanguages]?.translations ?? {},
  }
}

void translateObject({
  allTranslationsObject: allTranslations,
  fromTranslationsObject: enTranslations,
  targetFolder: path.resolve(
    dirname,
    '../../../../packages/plugin-multi-tenant/src/translations/languages',
  ),
  tsFilePrefix: `import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'\n\nexport const {{locale}}Translations: PluginDefaultTranslationsObject = `,
  tsFileSuffix: `\n\nexport const {{locale}}: PluginLanguage = {
    dateFNSKey: {{dateFNSKey}},
    translations: {{locale}}Translations,
  }  `,
})
```

--------------------------------------------------------------------------------

---[FILE: richtext-lexical.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/richtext-lexical.ts

```typescript
import type {
  AcceptedLanguages,
  GenericLanguages,
  GenericTranslationsObject,
} from '@payloadcms/translations'

import * as fs from 'node:fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { translateObject } from './utils/index.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Function to get all files with a specific name recursively in all subdirectories
function findFilesRecursively(startPath: string, filter: string): string[] {
  let results: string[] = []

  const entries = fs.readdirSync(startPath, { withFileTypes: true })

  entries.forEach((dirent) => {
    const fullPath = path.join(startPath, dirent.name)

    if (dirent.isDirectory()) {
      results = results.concat(findFilesRecursively(fullPath, filter))
    } else {
      if (dirent.name === filter) {
        results.push(fullPath)
      }
    }
  })

  return results
}

const i18nFilePaths = findFilesRecursively(
  path.resolve(dirname, '../../../../packages/richtext-lexical/src'),
  'i18n.ts',
)

async function translate() {
  for (const i18nFilePath of i18nFilePaths) {
    const imported = await import(i18nFilePath)
    const translationsObject = imported.i18n as Partial<GenericLanguages>
    const allTranslations: {
      [key in AcceptedLanguages]?: {
        dateFNSKey: string
        translations: GenericTranslationsObject
      }
    } = {}
    for (const lang in translationsObject) {
      allTranslations[lang as AcceptedLanguages] = {
        dateFNSKey: 'en',
        translations: translationsObject?.[lang as keyof GenericLanguages] || {},
      }
    }

    if (translationsObject.en) {
      console.log('Translating', i18nFilePath)
      await translateObject({
        allTranslationsObject: allTranslations,
        fromTranslationsObject: translationsObject.en,
        inlineFile: i18nFilePath,
        tsFilePrefix: `import { GenericLanguages } from '@payloadcms/translations'
  
  export const i18n: Partial<GenericLanguages> = `,
        tsFileSuffix: ``,
      })
    } else {
      console.error(`No English translations found in ${i18nFilePath}`)
    }
  }
}

void translate()
```

--------------------------------------------------------------------------------

---[FILE: applyEslintFixes.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/applyEslintFixes.ts

```typescript
import { ESLint } from 'eslint'

export async function applyEslintFixes(text: string, filePath: string): Promise<string> {
  const eslint = new ESLint({ fix: true })
  const results = await eslint.lintText(text, { filePath })
  const result = results[0] || { output: text }
  return result.output || text // Return the fixed content or the original if no fixes were made.
}
```

--------------------------------------------------------------------------------

---[FILE: findMissingKeys.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/findMissingKeys.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

/**
 * Returns keys which are present in baseObj but not in targetObj
 */
export function findMissingKeys(
  baseObj: GenericTranslationsObject,
  targetObj: GenericTranslationsObject,
  prefix = '',
): string[] {
  let missingKeys: string[] = []

  for (const key in baseObj) {
    const baseValue = baseObj[key]
    const targetValue = targetObj[key]
    if (typeof baseValue === 'object') {
      missingKeys = missingKeys.concat(
        findMissingKeys(
          baseValue,
          typeof targetValue === 'object' && targetValue ? targetValue : {},
          `${prefix}${key}.`,
        ),
      )
    } else if (!(key in targetObj)) {
      missingKeys.push(`${prefix}${key}`)
    }
  }

  return missingKeys
}
```

--------------------------------------------------------------------------------

---[FILE: generateTsObjectLiteral.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/generateTsObjectLiteral.ts

```typescript
import type { JsonObject } from 'payload'

export function generateTsObjectLiteral(obj: JsonObject): string {
  const lines: string[] = []
  const entries = Object.entries(obj)
  for (const [key, value] of entries) {
    const safeKey = /^[\w$]+$/.test(key) ? key : JSON.stringify(key)
    const line =
      typeof value === 'object' && value !== null
        ? `${safeKey}: ${generateTsObjectLiteral(value)}`
        : `${safeKey}: ${JSON.stringify(value)}`
    lines.push(line)
  }
  return `{\n  ${lines.join(',\n  ')}\n}`
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/index.ts

```typescript
/* eslint no-console: 0 */

import type {
  AcceptedLanguages,
  GenericLanguages,
  GenericTranslationsObject,
} from '@payloadcms/translations'

import { acceptedLanguages } from '@payloadcms/translations'
import fs from 'fs'
import path from 'path'
import { deepMergeSimple } from 'payload/shared'
import { format } from 'prettier'

import { applyEslintFixes } from './applyEslintFixes.js'
import { findMissingKeys } from './findMissingKeys.js'
import { generateTsObjectLiteral } from './generateTsObjectLiteral.js'
import { sortKeys } from './sortKeys.js'
import { translateText } from './translateText.js'

/**
 *
 * props.allTranslationsObject:
 * @Example
 * ```ts
 * {
 *   en: {
 *     lexical: {
 *       link: {
 *         editLink: 'Edit link',
 *         invalidURL: 'Invalid URL',
 *         removeLink: 'Remove link',
 *       },
 *     },
 *   },
 *   de: {
 *     lexical: {
 *       // ...
 *     }
 *   },
 *   // ...
 * }
 *```
 *
 * @param props
 */
export async function translateObject(props: {
  allTranslationsObject: {
    [key in AcceptedLanguages]?: {
      dateFNSKey: string
      translations: GenericTranslationsObject
    }
  }
  fromTranslationsObject: GenericTranslationsObject
  /**
   *
   * If set, will output the entire translations object (incl. all locales) to this file.
   *
   * @default false
   */
  inlineFile?: string
  languages?: AcceptedLanguages[]
  targetFolder?: string
  tsFilePrefix?: string
  tsFileSuffix?: string
}) {
  const {
    allTranslationsObject,
    fromTranslationsObject,
    inlineFile,
    languages = acceptedLanguages.filter((lang) => lang !== 'en'),
    targetFolder = '',
    tsFilePrefix = `import type { DefaultTranslationsObject, Language } from '../types.js'\n\nexport const {{locale}}Translations: DefaultTranslationsObject = `,
    tsFileSuffix = `\n\nexport const {{locale}}: Language = {
  dateFNSKey: {{dateFNSKey}},
  translations: {{locale}}Translations,
}  `,
  } = props

  const allTranslatedTranslationsObject: {
    [key in AcceptedLanguages]?: {
      dateFNSKey: string
      translations: GenericTranslationsObject
    }
  } = JSON.parse(JSON.stringify(allTranslationsObject))
  const allOnlyNewTranslatedTranslationsObject: GenericLanguages = {}

  const translationPromises: Promise<void>[] = []

  for (const targetLang of languages) {
    if (!allTranslatedTranslationsObject?.[targetLang]) {
      allTranslatedTranslationsObject[targetLang] = {
        dateFNSKey: targetLang,
        translations: {},
      }
    }
    const keysWhichDoNotExistInFromlang = findMissingKeys(
      allTranslatedTranslationsObject?.[targetLang].translations,
      fromTranslationsObject,
    )
    if (keysWhichDoNotExistInFromlang.length) {
      console.log(`Keys which do not exist in English:`, keysWhichDoNotExistInFromlang)
    }

    /**
     * If a key does not exist in the fromTranslationsObject, it should be deleted from the target language object
     */
    for (const key of keysWhichDoNotExistInFromlang) {
      // Delete those keys in the target language object obj[lang]
      const keys: string[] = key.split('.')
      let targetObj = allTranslatedTranslationsObject?.[targetLang].translations
      for (let i = 0; i < keys.length - 1; i += 1) {
        const nextObj = targetObj[keys[i] as string]
        if (typeof nextObj !== 'object') {
          throw new Error(`Key ${keys[i]} is not an object in ${targetLang} (1)`)
        }
        targetObj = nextObj
      }
      delete targetObj[keys[keys.length - 1] as string]
    }

    if (!allTranslatedTranslationsObject?.[targetLang].translations) {
      allTranslatedTranslationsObject[targetLang].translations = {}
    }
    const missingKeys = findMissingKeys(
      fromTranslationsObject,
      allTranslatedTranslationsObject?.[targetLang].translations,
    )

    if (missingKeys.length) {
      console.log('Missing keys for lang', targetLang, ':', missingKeys)
    }

    for (const missingKey of missingKeys) {
      const keys: string[] = missingKey.split('.')
      const sourceText = keys.reduce((acc, key) => acc[key], fromTranslationsObject)
      if (!sourceText || typeof sourceText !== 'string') {
        throw new Error(
          `Missing key ${missingKey} or key not "leaf" in fromTranslationsObject for lang ${targetLang}. (2)`,
        )
      }

      if (translationPromises.length >= 12) {
        // Wait for one of the promises to resolve before adding a new one
        await Promise.race(translationPromises)
      }

      translationPromises.push(
        translateText(sourceText, targetLang).then((translated) => {
          if (!allOnlyNewTranslatedTranslationsObject[targetLang]) {
            allOnlyNewTranslatedTranslationsObject[targetLang] = {}
          }
          let targetObj = allOnlyNewTranslatedTranslationsObject?.[targetLang]
          for (let i = 0; i < keys.length - 1; i += 1) {
            if (!targetObj[keys[i] as string]) {
              targetObj[keys[i] as string] = {}
            }
            const nextObj = targetObj[keys[i] as string]
            if (typeof nextObj !== 'object') {
              throw new Error(`Key ${keys[i]} is not an object in ${targetLang} (3)`)
            }
            targetObj = nextObj
          }
          targetObj[keys[keys.length - 1] as string] = translated

          allTranslatedTranslationsObject[targetLang]!.translations = sortKeys(
            deepMergeSimple(
              allTranslatedTranslationsObject[targetLang]!.translations,
              allOnlyNewTranslatedTranslationsObject[targetLang],
            ),
          )
        }),
      )
    }
  }

  //await Promise.all(translationPromises)
  for (const promise of translationPromises) {
    await promise
  }

  // merge with existing translations
  // console.log('Merged object:', allTranslatedTranslationsObject)

  console.log('New translations:', allOnlyNewTranslatedTranslationsObject)

  if (inlineFile?.length) {
    const simpleTranslationsObject: GenericTranslationsObject = {}
    for (const lang in allTranslatedTranslationsObject) {
      if (lang in allTranslatedTranslationsObject) {
        simpleTranslationsObject[lang as keyof typeof allTranslatedTranslationsObject] =
          allTranslatedTranslationsObject[
            lang as keyof typeof allTranslatedTranslationsObject
          ]!.translations
      }
    }

    // write allTranslatedTranslationsObject
    const filePath = path.resolve(inlineFile)
    let fileContent: string = `${tsFilePrefix}${generateTsObjectLiteral(simpleTranslationsObject)}\n`

    // suffix
    fileContent += `${tsFileSuffix}\n`

    // eslint
    fileContent = await applyEslintFixes(fileContent, filePath)

    // prettier
    fileContent = await format(fileContent, {
      parser: 'typescript',
      printWidth: 100,
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    })

    fs.writeFileSync(filePath, fileContent, 'utf8')
  } else {
    // save

    for (const key of languages) {
      if (!allTranslatedTranslationsObject?.[key]) {
        return
      }

      // e.g. sanitize rs-latin to rsLatin
      const sanitizedKey = key.replace(
        /-(\w)(\w*)/g,
        (_, firstLetter, remainingLetters) =>
          firstLetter.toUpperCase() + remainingLetters.toLowerCase(),
      )
      const filePath = path.resolve(targetFolder, `${sanitizedKey}.ts`)

      // prefix & translations
      let fileContent: string = `${tsFilePrefix.replace('{{locale}}', sanitizedKey)}${generateTsObjectLiteral(allTranslatedTranslationsObject[key]?.translations || {})}\n`

      // suffix
      fileContent += `${tsFileSuffix.replaceAll('{{locale}}', sanitizedKey).replaceAll('{{dateFNSKey}}', `'${allTranslatedTranslationsObject[key]?.dateFNSKey}'`)}\n`

      // eslint
      fileContent = await applyEslintFixes(fileContent, filePath)

      // prettier
      fileContent = await format(fileContent, {
        parser: 'typescript',
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
      })

      fs.writeFileSync(filePath, fileContent, 'utf8')
    }
  }

  return allTranslatedTranslationsObject
}
```

--------------------------------------------------------------------------------

---[FILE: sortKeys.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/sortKeys.ts

```typescript
export function sortKeys(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }

  const sortedKeys = Object.keys(obj).sort()
  const sortedObj: { [key: string]: any } = {}

  for (const key of sortedKeys) {
    sortedObj[key] = sortKeys(obj[key])
  }

  return sortedObj
}
```

--------------------------------------------------------------------------------

---[FILE: translateText.ts]---
Location: payload-main/tools/scripts/src/generateTranslations/utils/translateText.ts

```typescript
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

dotenv.config({ path: path.resolve(dirname, '../../../../', '.env') })
dotenv.config({ path: path.resolve(dirname, '../../../../../', '.env') })

type TranslationMessage = {
  role: 'system' | 'user'
  content: string
}

export async function translateText(text: string, targetLang: string) {
  const systemMessage: TranslationMessage = {
    role: 'system',
    content: `Only respond with the translation of the text you receive. The original language is English and the translation language is ${targetLang}. Use formal and professional language. Only respond with the translation - do not say anything else.

    Respect the meaning of the original text within the context of Payload. Here is a list of common Payload terms that carry very specific meanings:
    - Collection: A collection is a group of documents that share a common structure and purpose. Collections are used to organize and manage content in Payload.
    - Field: A field is a specific piece of data within a document in a collection. Fields define the structure and type of data that can be stored in a document.
    - Document: A document is an individual record within a collection. It contains data structured according to the fields defined in the collection.
    - Global: A global is a special type of collection that can only have 1 item and there cannot be multiple globals of the same type.
    - Locale: A locale is a specific language or regional setting that can be used to display content in different languages or formats.
    - Tenant: A tenant is a sub group in Payload, allowing a single instance of Payload to isolate users, data and content based on specific permissions.
    - SEO: SEO stands for Search Engine Optimization, which is the practice of optimizing content to improve its visibility and ranking in search engine results.
    - Payload: Payload is the name of the headless CMS platform that this text is related to.
    - Import and export: are terms used to describe the process of transferring data into or out of Payload, typically in a structured format like JSON or CSV.

    If a term is capitalized treat it as a proper noun and do not translate it. If a term is not capitalized, translate it normally. For example, do not translate the word "Payload" or "Field" but you can translate "payload" or "field".

    Examples of translations:
    <examples>
      <nl>
        - Locale: Taal - never locatie
        - Collection: Collectie
      <nl>

      <es>
        - Locale: Idioma - never region or ubicación
        - Collection: Colección
      <es>
    <examples>

    Apply these translations consistently so that the meaning is preserved across different languages. If you are unsure about a translation, use the examples as a guide. If there is not equivalant term in the target language, use the closes term to it. Use the same term consistently throughout the translation.

    Use formal and professional language, avoiding colloquialisms or informal expressions. The translation should be clear, concise, and suitable for a professional context.

    If you cannot translate the text, respond with "[SKIPPED]". Do not translate text inside double curly braces, i.e. "{{do_not_translate}}".
    `,
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    body: JSON.stringify({
      max_tokens: 150,
      messages: [
        systemMessage,
        {
          content: text,
          role: 'user',
        },
      ],
      model: 'gpt-4',
    }),
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  try {
    const data = await response.json()

    if (response.status > 200) {
      console.log(data.error)
    } else {
      if (data?.choices?.[0]) {
        console.log('  Old text:', text, 'New text:', data.choices[0].message.content.trim())
        return data.choices[0].message.content.trim()
      } else {
        console.log(`Could not translate: ${text} in lang: ${targetLang}`, data.error)
      }
    }
  } catch (e) {
    console.error('Error translating:', text, 'to', targetLang, 'response', response, '. Error:', e)
    throw e
  }
}
```

--------------------------------------------------------------------------------

````
