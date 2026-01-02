---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 357
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 357 of 695)

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

---[FILE: deepMergeSimple.ts]---
Location: payload-main/packages/translations/src/utilities/deepMergeSimple.ts

```typescript
/**
 * Very simple, but fast deepMerge implementation. Only deepMerges objects, not arrays and clones everything.
 * Do not use this if your object contains any complex objects like React Components, or if you would like to combine Arrays.
 * If you only have simple objects and need a fast deepMerge, this is the function for you.
 *
 * obj2 takes precedence over obj1 - thus if obj2 has a key that obj1 also has, obj2's value will be used.
 *
 * @param obj1 base object
 * @param obj2 object to merge "into" obj1
 */
export function deepMergeSimple<T = object>(obj1: object, obj2: object): T {
  const output = { ...obj1 }

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        output[key] = deepMergeSimple(obj1[key], obj2[key])
      } else {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        output[key] = obj2[key]
      }
    }
  }

  return output as T
}
```

--------------------------------------------------------------------------------

---[FILE: ensureDirExists.ts]---
Location: payload-main/packages/translations/src/utilities/ensureDirExists.ts

```typescript
import fs from 'fs'

export function ensureDirectoryExists(directory: string) {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    // eslint-disable-next-line no-console
    console.error(`Error creating directory '${directory}': ${msg}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getTranslation.ts]---
Location: payload-main/packages/translations/src/utilities/getTranslation.ts
Signals: React

```typescript
import type { JSX } from 'react'

import type { I18n, I18nClient, TFunction } from '../types.js'

type LabelType =
  | (() => JSX.Element)
  | ((args: { i18n: I18nClient; t: TFunction }) => string)
  | JSX.Element
  | Record<string, string>
  | string

export const getTranslation = <T extends LabelType>(
  label: T,
  /**
   * @todo type as I18nClient in 4.0
   */
  i18n: Pick<I18n<any, any>, 'fallbackLanguage' | 'language' | 't'>,
): T extends JSX.Element ? JSX.Element : string => {
  // If it's a Record, look for translation. If string or React Element, pass through
  if (typeof label === 'object' && !Object.prototype.hasOwnProperty.call(label, '$$typeof')) {
    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    if (label[i18n.language]) {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      return label[i18n.language]
    }

    let fallbacks: string[] = []
    if (typeof i18n.fallbackLanguage === 'string') {
      fallbacks = [i18n.fallbackLanguage]
    } else if (Array.isArray(i18n.fallbackLanguage)) {
      fallbacks = i18n.fallbackLanguage
    }

    const fallbackLang = fallbacks.find((language) => label[language as keyof typeof label])

    // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
    return fallbackLang && label[fallbackLang] ? label[fallbackLang] : label[Object.keys(label)[0]]
  }

  if (typeof label === 'function') {
    return label({ i18n: i18n as I18nClient, t: i18n.t }) as unknown as T extends JSX.Element
      ? JSX.Element
      : string
  }

  // If it's a React Element or string, then we should just pass it through
  return label as unknown as T extends JSX.Element ? JSX.Element : string
}
```

--------------------------------------------------------------------------------

---[FILE: getTranslationsByContext.ts]---
Location: payload-main/packages/translations/src/utilities/getTranslationsByContext.ts

```typescript
import type { Language } from '../types.js'

import { clientTranslationKeys } from '../clientKeys.js'

function filterKeys(obj: Record<string, unknown>, parentGroupKey = '', keys: string[]) {
  const result: Record<string, unknown> = {}

  for (const [namespaceKey, value] of Object.entries(obj)) {
    // Skip $schema key
    if (namespaceKey === '$schema') {
      result[namespaceKey] = value
      continue
    }

    if (typeof value === 'object') {
      const filteredObject = filterKeys(value as Record<string, unknown>, namespaceKey, keys)
      if (Object.keys(filteredObject).length > 0) {
        result[namespaceKey] = filteredObject
      }
    } else {
      for (const key of keys) {
        const [groupKey, selector] = key.split(':')

        if (parentGroupKey === groupKey) {
          if (namespaceKey === selector) {
            result[selector] = value
          } else {
            const pluralKeys = ['zero', 'one', 'two', 'few', 'many', 'other']
            pluralKeys.forEach((pluralKey) => {
              if (namespaceKey === `${selector}_${pluralKey}`) {
                result[`${selector}_${pluralKey}`] = value
              }
            })
          }
        }
      }
    }
  }

  return result
}

function sortObject(obj: Record<string, unknown>) {
  const sortedObject: Record<string, unknown> = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (typeof obj[key] === 'object') {
        sortedObject[key] = sortObject(obj[key] as Record<string, unknown>)
      } else {
        sortedObject[key] = obj[key]
      }
    })
  return sortedObject
}

export const getTranslationsByContext = (selectedLanguage: Language, context: 'api' | 'client') => {
  if (context === 'client') {
    return sortObject(filterKeys(selectedLanguage.translations, '', clientTranslationKeys))
  } else {
    return selectedLanguage.translations
  }
}
```

--------------------------------------------------------------------------------

---[FILE: init.ts]---
Location: payload-main/packages/translations/src/utilities/init.ts

```typescript
import type {
  DefaultTranslationKeys,
  DefaultTranslationsObject,
  I18n,
  InitI18n,
  InitTFunction,
  Language,
} from '../types.js'

import { importDateFNSLocale } from '../importDateFNSLocale.js'
import { deepMergeSimple } from './deepMergeSimple.js'
import { getTranslationsByContext } from './getTranslationsByContext.js'

/**
 * @function getTranslationString
 *
 * Gets a translation string from a translations object
 *
 * @returns string
 */
export const getTranslationString = <
  TTranslations = DefaultTranslationsObject,
  TTranslationKeys = DefaultTranslationKeys,
>({
  count,
  key,
  translations,
}: {
  count?: number
  key: TTranslationKeys
  translations: Language<TTranslations>['translations']
}): string => {
  const keys = (key as DefaultTranslationKeys).split(':')
  let keySuffix = ''

  const translation: string = keys.reduce((acc: any, key, index) => {
    if (typeof acc === 'string') {
      return acc
    }

    if (typeof count === 'number') {
      if (count === 0 && `${key}_zero` in acc) {
        keySuffix = '_zero'
      } else if (count === 1 && `${key}_one` in acc) {
        keySuffix = '_one'
      } else if (count === 2 && `${key}_two` in acc) {
        keySuffix = '_two'
      } else if (count > 5 && `${key}_many` in acc) {
        keySuffix = '_many'
      } else if (count > 2 && count <= 5 && `${key}_few` in acc) {
        keySuffix = '_few'
      } else if (`${key}_other` in acc) {
        keySuffix = '_other'
      }
    }
    let keyToUse = key
    if (index === keys.length - 1 && keySuffix) {
      keyToUse = `${key}${keySuffix}`
    }

    if (acc && keyToUse in acc) {
      return acc[keyToUse]
    }

    return undefined
  }, translations)

  if (!translation) {
    console.log('key not found:', key)
  }

  return translation || (key as string)
}

/**
 * @function replaceVars
 *
 * Replaces variables in a translation string with values from an object
 *
 * @returns string
 */
const replaceVars = ({
  translationString,
  vars,
}: {
  translationString: string
  vars: {
    [key: string]: any
  }
}) => {
  const parts = translationString.split(/(\{\{.*?\}\})/)

  return parts
    .map((part) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const placeholder = part.substring(2, part.length - 2).trim()
        const value = vars[placeholder]
        return value !== undefined && value !== null ? value : part
      } else {
        return part
      }
    })
    .join('')
}

/**
 * @function t
 *
 * Merges config defined translations with translations passed in as an argument
 * returns a function that can be used to translate a string
 *
 * @returns string
 */
export function t<
  TTranslations = DefaultTranslationsObject,
  TTranslationKeys = DefaultTranslationKeys,
>({
  key,
  translations,
  vars,
}: {
  key: TTranslationKeys
  translations?: Language<TTranslations>['translations']
  vars?: Record<string, any>
}): string {
  let translationString = getTranslationString({
    count: typeof vars?.count === 'number' ? vars.count : undefined,
    key,
    translations,
  })

  if (vars) {
    translationString = replaceVars({
      translationString,
      vars,
    })
  }

  if (!translationString) {
    translationString = key as string
  }

  return translationString
}

const initTFunction: InitTFunction = (args) => {
  const { config, language, translations } = args
  const mergedTranslations =
    language && config?.translations?.[language as keyof typeof config.translations]
      ? deepMergeSimple<DefaultTranslationsObject>(
          translations,
          config.translations[language as keyof typeof config.translations]!,
        )
      : translations

  return {
    t: (key, vars) => {
      return t({
        key,
        translations: mergedTranslations,
        vars,
      })
    },
    translations: mergedTranslations,
  }
}

function memoize<T extends Parameters<InitI18n>[0], K extends keyof T>(
  fn: (args: T) => Promise<I18n>,
  keys: K[],
): (args: T) => Promise<I18n> {
  const cacheMap = new Map<string, I18n>()

  const memoized = async (args: T) => {
    const cacheKey = keys.reduce((acc, key) => acc + String(args[key]), '')

    if (!cacheMap.has(cacheKey)) {
      const result = await fn(args)
      cacheMap.set(cacheKey, result)
    }

    return cacheMap.get(cacheKey)!
  }

  return memoized
}

export const initI18n = memoize(
  async ({ config, context, language = config.fallbackLanguage }) => {
    if (!language || !config.supportedLanguages?.[language]) {
      throw new Error(`Language ${language} not supported`)
    }

    const translations = getTranslationsByContext(config.supportedLanguages?.[language], context)

    const { t, translations: mergedTranslations } = initTFunction({
      config: config as any,
      language: language || config.fallbackLanguage,
      translations: translations as any,
    })

    const dateFNSKey = config.supportedLanguages[language]?.dateFNSKey || 'en-US'

    const dateFNS = await importDateFNSLocale(dateFNSKey)

    const i18n: I18n = {
      dateFNS,
      dateFNSKey,
      fallbackLanguage: config.fallbackLanguage!,
      language: language || config.fallbackLanguage,
      t,
      translations: mergedTranslations,
    }

    return i18n
  },
  ['language', 'context'] satisfies Array<keyof Parameters<InitI18n>[0]>,
)
```

--------------------------------------------------------------------------------

---[FILE: languages.ts]---
Location: payload-main/packages/translations/src/utilities/languages.ts

```typescript
import type { AcceptedLanguages, LanguagePreference } from '../types.js'

export const rtlLanguages = ['ar', 'fa', 'he'] as const

export const acceptedLanguages = [
  'ar',
  'az',
  'bg',
  'bn-BD',
  'bn-IN',
  'ca',
  'cs',
  'bn-BD',
  'bn-IN',
  'da',
  'de',
  'en',
  'es',
  'et',
  'fa',
  'fr',
  'he',
  'hr',
  'hu',
  'hy',
  'id',
  'is',
  'it',
  'ja',
  'ko',
  'lt',
  'lv',
  'my',
  'nb',
  'nl',
  'pl',
  'pt',
  'ro',
  'rs',
  'rs-latin',
  'ru',
  'sk',
  'sl',
  'sv',
  'ta',
  'th',
  'tr',
  'uk',
  'vi',
  'zh',
  'zh-TW',

  /**
   * Languages not implemented:
   *
   * 'af',
   * 'am',
   * 'ar-sa',
   * 'as',
   * 'az-latin',
   * 'be',
   * 'bs',
   * 'ca-ES-valencia',
   * 'cy',
   * 'el',
   * 'en-GB',
   * 'en-US',
   * 'es-ES',
   * 'es-US',
   * 'es-MX',
   * 'eu',
   * 'fi',
   * 'fil-Latn',
   * 'fr-FR',
   * 'fr-CA',
   * 'ga',
   * 'gd-Latn',
   * 'gl',
   * 'gu',
   * 'ha-Latn',
   * 'hi',
   * 'ig-Latn',
   * 'it-it',
   * 'ka',
   * 'kk',
   * 'km',
   * 'kn',
   * 'kok',
   * 'ku-Arab',
   * 'ky-Cyrl',
   * 'lb',
   * 'mi-Latn',
   * 'mk',
   * 'ml',
   * 'mn-Cyrl',
   * 'mr',
   * 'ms',
   * 'mt',
   * 'ne',
   * 'nl-BE',
   * 'nn',
   * 'nso',
   * 'or',
   * 'pa',
   * 'pa-Arab',
   * 'prs-Arab',
   * 'pt-BR',
   * 'pt-PT',
   * 'qut-Latn',
   * 'quz',
   * 'rw',
   * 'sd-Arab',
   * 'si',
   * 'sq',
   * 'sr-Cyrl-BA',
   * 'sr-Cyrl-RS',
   * 'sr-Latn-RS',
   * 'sw',
   * 'ta',
   * 'te',
   * 'tg-Cyrl',
   * 'ti',
   * 'tk-Latn',
   * 'tn',
   * 'tt-Cyrl',
   * 'ug-Arab',
   * 'ur',
   * 'uz-Latn',
   * 'wo',
   * 'xh',
   * 'yo-Latn',
   * 'zh-Hans',
   * 'zh-Hant',
   * 'zu',
   */
] as const

function parseAcceptLanguage(acceptLanguageHeader: string): LanguagePreference[] {
  return acceptLanguageHeader
    .split(',')
    .map((lang) => {
      const [language, quality] = lang.trim().split(';q=') as [
        AcceptedLanguages,
        string | undefined,
      ]
      return {
        language,
        quality: quality ? parseFloat(quality) : 1,
      }
    })
    .sort((a, b) => b.quality - a.quality) // Sort by quality, highest to lowest
}

export function extractHeaderLanguage(acceptLanguageHeader: string): AcceptedLanguages | undefined {
  const parsedHeader = parseAcceptLanguage(acceptLanguageHeader)

  let matchedLanguage: AcceptedLanguages | undefined

  for (const { language } of parsedHeader) {
    if (!matchedLanguage && acceptedLanguages.includes(language)) {
      matchedLanguage = language
    }
  }

  return matchedLanguage
}
```

--------------------------------------------------------------------------------

---[FILE: .browserslistrc]---
Location: payload-main/packages/ui/.browserslistrc

```text
> 1%
not dead
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/ui/.prettierignore

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
Location: payload-main/packages/ui/.swcrc

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

---[FILE: .swcrc-debug]---
Location: payload-main/packages/ui/.swcrc-debug

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
Location: payload-main/packages/ui/babel.config.cjs

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
Location: payload-main/packages/ui/bundle.js
Signals: React

```javascript
import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { sassPlugin } from 'esbuild-sass-plugin'
import { commonjs } from '@hyrious/esbuild-plugin-commonjs'

const directoryArg = process.argv[2] || 'dist'

const shouldSplit = process.argv.includes('--no-split') ? false : true

const removeCSSImports = {
  name: 'remove-css-imports',
  setup(build) {
    build.onLoad({ filter: /.*/ }, async (args) => {
      if (args.path.includes('node_modules') || !args.path.includes(dirname)) return
      const contents = await fs.promises.readFile(args.path, 'utf8')
      const withRemovedImports = contents.replace(/import\s+.*\.scss';?[\r\n\s]*/g, '')
      return { contents: withRemovedImports, loader: 'default' }
    })
  },
}

// This plugin ensures there is only one "use client" directive at the top of the file
// and removes any existing directives which are not at the top, for example due to banner inserting
// itself before the directive.
const useClientPlugin = {
  name: 'use-client',
  setup(build) {
    // Temporarily disable file writing
    const originalWrite = build.initialOptions.write
    build.initialOptions.write = false

    build.onEnd((result) => {
      if (result.outputFiles && result.outputFiles.length > 0) {
        const directive = `"use client";`
        const directiveRegex = /"use client";/g

        result.outputFiles.forEach((file) => {
          let contents = file.text

          if (!file.path.endsWith('.map')) {
            contents = contents.replace(directiveRegex, '') // Remove existing use client directives
            contents = directive + '\n' + contents // Prepend our use client directive
          }

          if (originalWrite) {
            const filePath = path.join(build.initialOptions.outdir, path.basename(file.path))

            const dirPath = path.dirname(filePath)
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true })
            }

            // Write the modified contents to file manually instead of using esbuild's write option
            fs.writeFileSync(filePath, contents, 'utf8')
          }
        })
      } else {
        console.error('No output files are available to process in useClientPlugin.')
      }
    })
  },
}

async function build() {
  // Create directoryArg if it doesn't exist
  if (!fs.existsSync(directoryArg)) {
    await fs.promises.mkdir(directoryArg, { recursive: true })
  }

  // Bundle only the .scss files into a single css file
  await esbuild.build({
    entryPoints: ['src/exports/client/index.ts'],
    bundle: true,
    minify: true,
    outdir: 'dist-styles',
    packages: 'external',
    plugins: [sassPlugin({ css: 'external' })],
  })

  try {
    fs.renameSync('dist-styles/index.css', `${directoryArg}/styles.css`)
    fs.rmdirSync('dist-styles', { recursive: true })
  } catch (err) {
    console.error(`Error while renaming index.css and dist-styles: ${err}`)
    throw err
  }

  console.log('styles.css bundled successfully')
  // Bundle `client.ts`
  const resultClient = await esbuild.build({
    entryPoints: ['dist/exports/client/index.js'],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    outdir: `${directoryArg}/exports/client_optimized`,
    //outfile: 'index.js',
    // IMPORTANT: splitting the client bundle means that the `use client` directive will be lost for every chunk
    splitting: shouldSplit,
    write: true, // required for useClientPlugin
    banner: {
      js: `// Workaround for react-datepicker and other cjs dependencies potentially inserting require("react") statements
import * as requireReact from 'react';
import * as requireReactDom from 'react-dom';

function require(m) {
 if (m === 'react') return requireReact;
 if (m === 'react-dom') return requireReactDom;
 throw new Error(\`Unknown module \${m}\`);
}
// Workaround end
`, // react-datepicker fails due to require("react") statements making it to the browser, which is not supported.
      // This is a workaround to get it to work, without having to mark react-dateopicker as external
      // See https://stackoverflow.com/questions/68423950/when-using-esbuild-with-external-react-i-get-dynamic-require-of-react-is-not-s
    },
    external: [
      '*.scss',
      '*.css',
      'qs-esm',
      '@dnd-kit/core',
      '@payloadcms/graphql',
      '@payloadcms/translations',
      'dequal',

      //'side-channel',
      'payload',
      'payload/*',
      'react',
      'react-dom',
      'next',
      'crypto',
    ],
    //packages: 'external',
    minify: true,
    metafile: true,
    treeShaking: true,

    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [
      removeCSSImports,
      useClientPlugin, // required for banner to work
      /*commonjs({
          ignore: ['date-fns', '@floating-ui/react'],
        }),*/
    ],
    sourcemap: true,
  })
  console.log('client.ts bundled successfully')

  const resultShared = await esbuild.build({
    entryPoints: ['dist/exports/shared/index.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: `${directoryArg}/exports/shared_optimized`,
    //outfile: 'index.js',
    // IMPORTANT: splitting the client bundle means that the `use client` directive will be lost for every chunk
    splitting: false,
    treeShaking: true,
    external: [
      '*.scss',
      '*.css',
      'qs-esm',
      '@dnd-kit/core',
      '@payloadcms/graphql',
      '@payloadcms/translations',
      'dequal',
      'payload',
      'payload/*',
      'react',
      'react-dom',
      'next',
      'crypto',
      '@floating-ui/react',
      'date-fns',
      'react-datepicker',
    ],
    //packages: 'external',
    minify: true,
    metafile: true,
    tsconfig: path.resolve(dirname, './tsconfig.json'),
    plugins: [removeCSSImports, commonjs()],
    sourcemap: true,
  })
  console.log('shared.ts bundled successfully')

  fs.writeFileSync('meta_client.json', JSON.stringify(resultClient.metafile))
  fs.writeFileSync('meta_shared.json', JSON.stringify(resultShared.metafile))
}

await build()
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/ui/LICENSE.md

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
Location: payload-main/packages/ui/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/ui",
  "version": "3.68.5",
  "homepage": "https://payloadcms.com",
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/ui"
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
    ".": {
      "import": "./src/exports/client/index.ts",
      "types": "./src/exports/client/index.ts",
      "default": "./src/exports/client/index.ts"
    },
    "./shared": {
      "import": "./src/exports/shared/index.ts",
      "types": "./src/exports/shared/index.ts",
      "default": "./src/exports/shared/index.ts"
    },
    "./scss": {
      "import": "./src/scss/styles.scss",
      "default": "./src/scss/styles.scss"
    },
    "./icons/*": {
      "import": "./src/icons/*/index.tsx",
      "types": "./src/icons/*/index.tsx",
      "default": "./src/icons/*/index.tsx"
    },
    "./elements/*": {
      "import": "./src/elements/*/index.tsx",
      "types": "./src/elements/*/index.tsx",
      "default": "./src/elements/*/index.tsx"
    },
    "./elements/RenderServerComponent": {
      "import": "./src/elements/RenderServerComponent/index.tsx",
      "types": "./src/elements/RenderServerComponent/index.tsx",
      "default": "./src/elements/RenderServerComponent/index.tsx"
    },
    "./rsc": {
      "import": "./src/exports/rsc/index.ts",
      "types": "./src/exports/rsc/index.ts",
      "default": "./src/exports/rsc/index.ts"
    },
    "./utilities/buildFormState": {
      "import": "./src/utilities/buildFormState.ts",
      "types": "./src/utilities/buildFormState.ts",
      "default": "./src/utilities/buildFormState.ts"
    },
    "./utilities/buildTableState": {
      "import": "./src/utilities/buildTableState.ts",
      "types": "./src/utilities/buildTableState.ts",
      "default": "./src/utilities/buildTableState.ts"
    },
    "./utilities/getFolderResultsComponentAndData": {
      "import": "./src/utilities/getFolderResultsComponentAndData.tsx",
      "types": "./src/utilities/getFolderResultsComponentAndData.tsx",
      "default": "./src/utilities/getFolderResultsComponentAndData.tsx"
    },
    "./utilities/getClientSchemaMap": {
      "import": "./src/utilities/getClientSchemaMap.ts",
      "types": "./src/utilities/getClientSchemaMap.ts",
      "default": "./src/utilities/getClientSchemaMap.ts"
    },
    "./utilities/getSchemaMap": {
      "import": "./src/utilities/getSchemaMap.ts",
      "types": "./src/utilities/getSchemaMap.ts",
      "default": "./src/utilities/getSchemaMap.ts"
    },
    "./utilities/schedulePublishHandler": {
      "import": "./src/utilities/schedulePublishHandler.ts",
      "types": "./src/utilities/schedulePublishHandler.ts",
      "default": "./src/utilities/schedulePublishHandler.ts"
    },
    "./utilities/getClientConfig": {
      "import": "./src/utilities/getClientConfig.ts",
      "types": "./src/utilities/getClientConfig.ts",
      "default": "./src/utilities/getClientConfig.ts"
    },
    "./utilities/buildFieldSchemaMap/traverseFields": {
      "import": "./src/utilities/buildFieldSchemaMap/traverseFields.ts",
      "types": "./src/utilities/buildFieldSchemaMap/traverseFields.ts",
      "default": "./src/utilities/buildFieldSchemaMap/traverseFields.ts"
    },
    "./forms/fieldSchemasToFormState": {
      "import": "./src/forms/fieldSchemasToFormState/index.tsx",
      "types": "./src/forms/fieldSchemasToFormState/index.tsx",
      "default": "./src/forms/fieldSchemasToFormState/index.tsx"
    },
    "./forms/renderField": {
      "import": "./src/forms/fieldSchemasToFormState/renderField.tsx",
      "types": "./src/forms/fieldSchemasToFormState/renderField.tsx",
      "default": "./src/forms/fieldSchemasToFormState/renderField.tsx"
    },
    "./scss/app.scss": "./src/scss/app.scss",
    "./assets": {
      "import": "./src/assets/index.ts",
      "types": "./src/assets/index.ts",
      "default": "./src/assets/index.ts"
    }
  },
  "main": "./src/exports/client/index.ts",
  "types": "./src/exports/client/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm build:reactcompiler",
    "build:babel": "rm -rf dist_optimized && babel dist --out-dir dist_optimized --source-maps --extensions .ts,.js,.tsx,.jsx,.cjs,.mjs && rm -rf dist && mv dist_optimized dist",
    "build:bundle-for-analysis": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm build:swc && pnpm build:babel && pnpm copyfiles && pnpm build:esbuild esbuild --no-split",
    "build:debug": "rm -rf dist esbuild && rm -rf tsconfig.tsbuildinfo && pnpm build:swc:debug && pnpm copyfiles && pnpm build:types",
    "build:esbuild": "node bundle.js",
    "build:esbuild:postprocess": "rm -rf dist/exports/client && mv dist/exports/client_optimized dist/exports/client && rm -rf dist/exports/shared && mv dist/exports/shared_optimized dist/exports/shared",
    "build:reactcompiler": "rm -rf dist esbuild && rm -rf tsconfig.tsbuildinfo && pnpm build:swc && pnpm build:babel && pnpm copyfiles && pnpm build:esbuild && pnpm build:esbuild:postprocess && pnpm build:types",
    "build:remove-artifact": "rm dist/prod/index.js",
    "build:swc": "swc ./src -d dist --config-file .swcrc --strip-leading-paths",
    "build:swc:debug": "swc ./src -d ./dist --config-file .swcrc-debug --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "build:without_reactcompiler": "rm -rf dist && rm -rf tsconfig.tsbuildinfo && pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "clean": "rimraf -g {dist,*.tsbuildinfo,esbuild}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@date-fns/tz": "1.2.0",
    "@dnd-kit/core": "6.0.8",
    "@dnd-kit/sortable": "7.0.2",
    "@dnd-kit/utilities": "3.2.2",
    "@faceless-ui/modal": "3.0.0",
    "@faceless-ui/scroll-info": "2.0.0",
    "@faceless-ui/window-info": "3.0.1",
    "@monaco-editor/react": "4.7.0",
    "@payloadcms/translations": "workspace:*",
    "bson-objectid": "2.0.4",
    "date-fns": "4.1.0",
    "dequal": "2.0.3",
    "md5": "2.3.0",
    "object-to-formdata": "4.5.1",
    "qs-esm": "7.0.2",
    "react-datepicker": "7.6.0",
    "react-image-crop": "10.1.8",
    "react-select": "5.9.0",
    "scheduler": "0.25.0",
    "sonner": "^1.7.2",
    "ts-essentials": "10.0.3",
    "use-context-selector": "2.0.0",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@babel/cli": "7.27.2",
    "@babel/core": "7.27.3",
    "@babel/preset-env": "7.27.2",
    "@babel/preset-react": "7.27.1",
    "@babel/preset-typescript": "7.27.1",
    "@hyrious/esbuild-plugin-commonjs": "0.2.6",
    "@payloadcms/eslint-config": "workspace:*",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "@types/uuid": "10.0.0",
    "babel-plugin-react-compiler": "19.1.0-rc.3",
    "esbuild": "0.25.5",
    "esbuild-sass-plugin": "3.3.1",
    "payload": "workspace:*"
  },
  "peerDependencies": {
    "next": "^15.2.8 || ^15.3.8 || ^15.4.10 || ^15.5.9",
    "payload": "workspace:*",
    "react": "^19.0.1 || ^19.1.2 || ^19.2.1",
    "react-dom": "^19.0.1 || ^19.1.2 || ^19.2.1"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/exports/client/index.js",
        "types": "./dist/exports/client/index.d.ts",
        "default": "./dist/exports/client/index.js"
      },
      "./shared": {
        "import": "./dist/exports/shared/index.js",
        "types": "./dist/exports/shared/index.d.ts",
        "default": "./dist/exports/shared/index.js"
      },
      "./css": {
        "import": "./dist/styles.css",
        "default": "./dist/styles.css"
      },
      "./scss": {
        "import": "./dist/scss/styles.scss",
        "default": "./dist/scss/styles.scss"
      },
      "./rsc": {
        "import": "./dist/exports/rsc/index.js",
        "types": "./dist/exports/rsc/index.d.ts",
        "default": "./dist/exports/rsc/index.js"
      },
      "./scss/app.scss": "./dist/scss/app.scss",
      "./styles.css": "./dist/styles.css",
      "./assets": {
        "import": "./dist/assets/index.js",
        "types": "./dist/assets/index.d.ts",
        "default": "./dist/assets/index.js"
      },
      "./elements/RenderServerComponent": {
        "import": "./dist/elements/RenderServerComponent/index.js",
        "types": "./dist/elements/RenderServerComponent/index.d.ts",
        "default": "./dist/elements/RenderServerComponent/index.js"
      },
      "./elements/*": {
        "import": "./dist/elements/*/index.js",
        "types": "./dist/elements/*/index.d.ts",
        "default": "./dist/elements/*/index.js"
      },
      "./fields/*": {
        "import": "./dist/fields/*/index.js",
        "types": "./dist/fields/*/index.d.ts",
        "default": "./dist/fields/*/index.js"
      },
      "./forms/fieldSchemasToFormState": {
        "import": "./dist/forms/fieldSchemasToFormState/index.js",
        "types": "./dist/forms/fieldSchemasToFormState/index.d.ts",
        "default": "./dist/forms/fieldSchemasToFormState/index.js"
      },
      "./forms/renderField": {
        "import": "./dist/forms/fieldSchemasToFormState/renderField.js",
        "types": "./dist/forms/fieldSchemasToFormState/renderField.d.ts",
        "default": "./dist/forms/fieldSchemasToFormState/renderField.js"
      },
      "./forms/*": {
        "import": "./dist/forms/*/index.js",
        "types": "./dist/forms/*/index.d.ts",
        "default": "./dist/forms/*/index.js"
      },
      "./graphics/*": {
        "import": "./dist/graphics/*/index.js",
        "types": "./dist/graphics/*/index.d.ts",
        "default": "./dist/graphics/*/index.js"
      },
      "./hooks/*": {
        "import": "./dist/hooks/*.js",
        "types": "./dist/hooks/*.d.ts",
        "default": "./dist/hooks/*.js"
      },
      "./icons/*": {
        "import": "./dist/icons/*/index.js",
        "types": "./dist/icons/*/index.d.ts",
        "default": "./dist/icons/*/index.js"
      },
      "./providers/*": {
        "import": "./dist/providers/*/index.js",
        "types": "./dist/providers/*/index.d.ts",
        "default": "./dist/providers/*/index.js"
      },
      "./utilities/*": {
        "import": "./dist/utilities/*.js",
        "types": "./dist/utilities/*.d.ts",
        "default": "./dist/utilities/*.js"
      }
    },
    "main": "./dist/exports/client/index.js",
    "types": "./dist/exports/client/index.d.ts"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/ui/tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    /* TODO: remove the following lines */
    "strict": false,
  },
  "references": [{ "path": "../payload" }, { "path": "../translations" }]
}
```

--------------------------------------------------------------------------------

---[FILE: assets.d.ts]---
Location: payload-main/packages/ui/src/@types/assets.d.ts
Signals: React

```typescript
declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  import React = require('react')

  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const content: string
  export default content
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/ui/src/assets/index.ts

```typescript
export { default as payloadFavicon } from './payload-favicon.svg'
export { default as payloadFaviconDark } from './payload-favicon-dark.png'
export { default as payloadFaviconLight } from './payload-favicon-light.png'
export { default as staticOGImage } from './static-og-image.png'
```

--------------------------------------------------------------------------------

---[FILE: payload-favicon.svg]---
Location: payload-main/packages/ui/src/assets/payload-favicon.svg

```text
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 102.4 102.4">
 <style>
    path {
      fill: #333333;
    }

    @media (prefers-color-scheme: dark) {
      path {
        fill: white;
      }
    }
  </style>
  <path d="M50.67,86.55l-29.8-17.2c-.37-.22-.6-.61-.6-1.04v-26.56c0-.46.5-.75.9-.52l34.6,19.98c.48.28,1.09-.07,1.09-.63v-12.96c0-.52-.28-.99-.72-1.25L14.5,22.32c-.37-.22-.83-.22-1.21,0l-5.45,3.15c-.37.22-.6.61-.6,1.04v49.37c0,.43.23.83.6,1.04l42.75,24.68c.37.22.83.22,1.21,0l35.9-20.73c.48-.28.48-.97,0-1.25l-11.2-6.47c-.45-.26-1-.26-1.45,0l-23.18,13.38c-.37.22-.83.22-1.21,0Z" />
  <path d="M94.56,25.47L51.8.79c-.37-.22-.83-.22-1.21,0l-22.6,13.05c-.48.28-.48.97,0,1.25l11.1,6.41c.45.26,1,.26,1.45,0l10.12-5.84c.37-.22.83-.22,1.21,0l29.8,17.2c.37.22.6.61.6,1.04v26.7c0,.52.28.99.72,1.25l11.08,6.4c.48.28,1.09-.07,1.09-.63V26.52c0-.43-.23-.83-.6-1.04Z" />
</svg>
```

--------------------------------------------------------------------------------

````
