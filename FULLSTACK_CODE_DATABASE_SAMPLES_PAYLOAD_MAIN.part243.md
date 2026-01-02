---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 243
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 243 of 695)

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

---[FILE: getFields.ts]---
Location: payload-main/packages/plugin-import-export/src/export/getFields.ts

```typescript
import type { TFunction } from '@payloadcms/translations'
import type { Config, Field, SelectField } from 'payload'

import type { ImportExportPluginConfig } from '../types.js'

import { validateLimitValue } from '../utilities/validateLimitValue.js'
import { getFilename } from './getFilename.js'

export const getFields = (config: Config, pluginConfig?: ImportExportPluginConfig): Field[] => {
  let localeField: SelectField | undefined
  if (config.localization) {
    localeField = {
      name: 'locale',
      type: 'select',
      admin: {
        width: '25%',
      },
      defaultValue: 'all',
      // @ts-expect-error - this is not correctly typed in plugins right now
      label: ({ t }) => t('plugin-import-export:field-locale-label'),
      options: [
        {
          label: ({ t }) => t('general:allLocales'),
          value: 'all',
        },
        ...config.localization.locales.map((locale) => ({
          label: typeof locale === 'string' ? locale : locale.label,
          value: typeof locale === 'string' ? locale : locale.code,
        })),
      ],
    }
  }

  return [
    {
      type: 'collapsible',
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: () => getFilename(),
          // @ts-expect-error - this is not correctly typed in plugins right now
          label: ({ t }) => t('plugin-import-export:field-name-label'),
        },
        {
          type: 'row',
          fields: [
            {
              name: 'format',
              type: 'select',
              admin: {
                // Hide if a forced format is set via plugin config
                condition: () => !pluginConfig?.format,
                width: '33.3333%',
              },
              defaultValue: (() => {
                // Default to plugin-defined format, otherwise 'csv'
                return pluginConfig?.format ?? 'csv'
              })(),
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-format-label'),
              options: [
                {
                  label: 'CSV',
                  value: 'csv',
                },
                {
                  label: 'JSON',
                  value: 'json',
                },
              ],
              required: true,
            },
            {
              name: 'limit',
              type: 'number',
              admin: {
                placeholder: 'No limit',
                step: 100,
                width: '33.3333%',
              },
              validate: (value: null | number | undefined, { req }: { req: { t: TFunction } }) => {
                return validateLimitValue(value, req.t) ?? true
              },
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-limit-label'),
            },
            {
              name: 'page',
              type: 'number',
              admin: {
                components: {
                  Field: '@payloadcms/plugin-import-export/rsc#Page',
                },
                condition: ({ limit }) => {
                  // Show the page field only if limit is set
                  return typeof limit === 'number' && limit !== 0
                },
                width: '33.3333%',
              },
              defaultValue: 1,
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-page-label'),
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sort',
              type: 'text',
              admin: {
                components: {
                  Field: '@payloadcms/plugin-import-export/rsc#SortBy',
                },
              },
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-sort-label'),
            },
            {
              name: 'sortOrder',
              type: 'select',
              admin: {
                components: {
                  Field: '@payloadcms/plugin-import-export/rsc#SortOrder',
                },
                // Only show when `sort` has a value
                condition: ({ sort }) => typeof sort === 'string' && sort.trim().length > 0,
              },
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-sort-order-label'),
              options: [
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ],
            },
            ...(localeField ? [localeField] : []),
            {
              name: 'drafts',
              type: 'select',
              admin: {
                condition: (data) => {
                  const collectionConfig = (config.collections ?? []).find(
                    (collection) => collection.slug === data.collectionSlug,
                  )
                  return Boolean(
                    typeof collectionConfig?.versions === 'object' &&
                      collectionConfig?.versions?.drafts,
                  )
                },
                width: '25%',
              },
              defaultValue: 'yes',
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:field-drafts-label'),
              options: [
                {
                  label: ({ t }) => t('general:yes'),
                  value: 'yes',
                },
                {
                  label: ({ t }) => t('general:no'),
                  value: 'no',
                },
              ],
            },
            // {
            //   name: 'depth',
            //   type: 'number',
            //   // @ts-expect-error - this is not correctly typed in plugins right now
            //   label: ({ t }) => t('plugin-import-export:field-depth-label'),
            //   admin: {
            //     width: '33%',
            //   },
            //   defaultValue: 1,
            //   required: true,
            // },
          ],
        },
        {
          name: 'selectionToUse',
          type: 'radio',
          admin: {
            components: {
              Field: '@payloadcms/plugin-import-export/rsc#SelectionToUseField',
            },
          },
          options: [
            {
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:selectionToUse-currentSelection'),
              value: 'currentSelection',
            },
            {
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:selectionToUse-currentFilters'),
              value: 'currentFilters',
            },
            {
              // @ts-expect-error - this is not correctly typed in plugins right now
              label: ({ t }) => t('plugin-import-export:selectionToUse-allDocuments'),
              value: 'all',
            },
          ],
          virtual: true,
        },
        {
          name: 'fields',
          type: 'text',
          admin: {
            components: {
              Field: '@payloadcms/plugin-import-export/rsc#FieldsToExport',
            },
          },
          hasMany: true,
          // @ts-expect-error - this is not correctly typed in plugins right now
          label: ({ t }) => t('plugin-import-export:field-fields-label'),
        },
        {
          name: 'collectionSlug',
          type: 'text',
          admin: {
            components: {
              Field: '@payloadcms/plugin-import-export/rsc#CollectionField',
            },
          },
          required: true,
        },
        {
          name: 'where',
          type: 'json',
          admin: {
            hidden: true,
          },
          defaultValue: {},
          hooks: {
            beforeValidate: [
              ({ value }) => {
                return value ?? {}
              },
            ],
          },
        },
      ],
      // @ts-expect-error - this is not correctly typed in plugins right now
      label: ({ t }) => t('plugin-import-export:exportOptions'),
    },
    {
      name: 'preview',
      type: 'ui',
      admin: {
        components: {
          Field: '@payloadcms/plugin-import-export/rsc#Preview',
        },
      },
    },
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: getFilename.ts]---
Location: payload-main/packages/plugin-import-export/src/export/getFilename.ts

```typescript
export const getFilename = () => {
  const now = new Date()
  const yyymmdd = now.toISOString().split('T')[0] // "YYYY-MM-DD"
  const hhmmss = now.toTimeString().split(' ')[0] // "HH:MM:SS"

  return `${yyymmdd} ${hhmmss}`
}
```

--------------------------------------------------------------------------------

---[FILE: getSelect.ts]---
Location: payload-main/packages/plugin-import-export/src/export/getSelect.ts

```typescript
import type { SelectIncludeType } from 'payload'

/**
 * Takes an input of array of string paths in dot notation and returns a select object
 * example args: ['id', 'title', 'group.value', 'createdAt', 'updatedAt']
 */
export const getSelect = (fields: string[]): SelectIncludeType => {
  const select: SelectIncludeType = {}

  fields.forEach((field) => {
    const segments = field.split('.')
    let selectRef = select

    segments.forEach((segment, i) => {
      if (i === segments.length - 1) {
        selectRef[segment] = true
      } else {
        if (!selectRef[segment]) {
          selectRef[segment] = {}
        }
        selectRef = selectRef[segment] as SelectIncludeType
      }
    })
  })

  return select
}
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/plugin-import-export/src/exports/rsc.ts

```typescript
export { CollectionField } from '../components/CollectionField/index.js'
export { ExportListMenuItem } from '../components/ExportListMenuItem/index.js'
export { ExportSaveButton } from '../components/ExportSaveButton/index.js'
export { FieldsToExport } from '../components/FieldsToExport/index.js'
export { ImportExportProvider } from '../components/ImportExportProvider/index.js'
export { Page } from '../components/Page/index.js'
export { Preview } from '../components/Preview/index.js'
export { SelectionToUseField } from '../components/SelectionToUseField/index.js'
export { SortBy } from '../components/SortBy/index.js'
export { SortOrder } from '../components/SortOrder/index.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-import-export/src/exports/types.ts

```typescript
export type { ImportExportPluginConfig, ToCSVFunction } from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/index.ts

```typescript
import type {
  GenericTranslationsObject,
  NestedKeysStripped,
  SupportedLanguages,
} from '@payloadcms/translations'

import type { PluginDefaultTranslationsObject } from './types.js'

import { ar } from './languages/ar.js'
import { az } from './languages/az.js'
import { bg } from './languages/bg.js'
import { ca } from './languages/ca.js'
import { cs } from './languages/cs.js'
import { da } from './languages/da.js'
import { de } from './languages/de.js'
import { en } from './languages/en.js'
import { es } from './languages/es.js'
import { et } from './languages/et.js'
import { fa } from './languages/fa.js'
import { fr } from './languages/fr.js'
import { he } from './languages/he.js'
import { hr } from './languages/hr.js'
import { hu } from './languages/hu.js'
import { hy } from './languages/hy.js'
import { is } from './languages/is.js'
import { it } from './languages/it.js'
import { ja } from './languages/ja.js'
import { ko } from './languages/ko.js'
import { lt } from './languages/lt.js'
import { my } from './languages/my.js'
import { nb } from './languages/nb.js'
import { nl } from './languages/nl.js'
import { pl } from './languages/pl.js'
import { pt } from './languages/pt.js'
import { ro } from './languages/ro.js'
import { rs } from './languages/rs.js'
import { rsLatin } from './languages/rsLatin.js'
import { ru } from './languages/ru.js'
import { sk } from './languages/sk.js'
import { sl } from './languages/sl.js'
import { sv } from './languages/sv.js'
import { ta } from './languages/ta.js'
import { th } from './languages/th.js'
import { tr } from './languages/tr.js'
import { uk } from './languages/uk.js'
import { vi } from './languages/vi.js'
import { zh } from './languages/zh.js'
import { zhTw } from './languages/zhTw.js'

export const translations = {
  ar,
  az,
  bg,
  ca,
  cs,
  da,
  de,
  en,
  es,
  et,
  fa,
  fr,
  he,
  hr,
  hu,
  hy,
  is,
  it,
  ja,
  ko,
  lt,
  my,
  nb,
  nl,
  pl,
  pt,
  ro,
  rs,
  'rs-latin': rsLatin,
  ru,
  sk,
  sl,
  sv,
  ta,
  th,
  tr,
  uk,
  vi,
  zh,
  'zh-TW': zhTw,
} as SupportedLanguages<PluginDefaultTranslationsObject>

export type PluginImportExportTranslations = GenericTranslationsObject

export type PluginImportExportTranslationKeys = NestedKeysStripped<PluginImportExportTranslations>
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/types.ts

```typescript
import type { Language } from '@payloadcms/translations'

import type { enTranslations } from './languages/en.js'

export type PluginLanguage = Language<{
  'plugin-import-export': {
    exportDocumentLabel: string
    exportOptions: string
    'field-depth-label': string
    'field-drafts-label': string
    'field-fields-label': string
    'field-format-label': string
    'field-limit-label': string
    'field-locale-label': string
    'field-name-label': string
    'field-page-label': string
    'field-selectionToUse-label': string
    'field-sort-label': string
    'field-sort-order-label': string
    'selectionToUse-allDocuments': string
    'selectionToUse-currentFilters': string
    'selectionToUse-currentSelection': string
    totalDocumentsCount: string
  }
}>

export type PluginDefaultTranslationsObject = typeof enTranslations
```

--------------------------------------------------------------------------------

---[FILE: ar.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ar.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const arTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'جميع المواقع',
    exportDocumentLabel: 'تصدير {{label}}',
    exportOptions: 'خيارات التصدير',
    'field-depth-label': 'عمق',
    'field-drafts-label': 'تضمن المسودات',
    'field-fields-label': 'حقول',
    'field-format-label': 'تنسيق التصدير',
    'field-limit-label': 'حد',
    'field-locale-label': 'موقع',
    'field-name-label': 'اسم الملف',
    'field-page-label': 'صفحة',
    'field-selectionToUse-label': 'اختيار للاستخدام',
    'field-sort-label': 'ترتيب حسب',
    'field-sort-order-label': 'ترتيب',
    'selectionToUse-allDocuments': 'استخدم جميع الوثائق',
    'selectionToUse-currentFilters': 'استخدم الفلاتر الحالية',
    'selectionToUse-currentSelection': 'استخدم الاختيار الحالي',
    totalDocumentsCount: '{{count}} مستنداً إجمالياً',
  },
}

export const ar: PluginLanguage = {
  dateFNSKey: 'ar',
  translations: arTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: az.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/az.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const azTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Bütün yerlər',
    exportDocumentLabel: '{{label}} ixrac edin',
    exportOptions: 'İxrac Variantları',
    'field-depth-label': 'Dərinlik',
    'field-drafts-label': 'Qaralamaları daxil etin',
    'field-fields-label': 'Sahələr',
    'field-format-label': 'İxrac Formatı',
    'field-limit-label': 'Hədd',
    'field-locale-label': 'Yerli',
    'field-name-label': 'Fayl adı',
    'field-page-label': 'Səhifə',
    'field-selectionToUse-label': 'İstifadə etmək üçün seçim',
    'field-sort-label': 'Sırala',
    'field-sort-order-label': 'Sıralama',
    'selectionToUse-allDocuments': 'Bütün sənədlərdən istifadə edin',
    'selectionToUse-currentFilters': 'Cari filtrlərdən istifadə edin',
    'selectionToUse-currentSelection': 'Cari seçimi istifadə edin',
    totalDocumentsCount: '{{count}} ümumi sənəd',
  },
}

export const az: PluginLanguage = {
  dateFNSKey: 'az',
  translations: azTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: bg.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/bg.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const bgTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Всички локации',
    exportDocumentLabel: 'Експортиране {{label}}',
    exportOptions: 'Опции за експортиране',
    'field-depth-label': 'Дълбочина',
    'field-drafts-label': 'Включете чернови',
    'field-fields-label': 'Полета',
    'field-format-label': 'Формат за експортиране',
    'field-limit-label': 'Лимит',
    'field-locale-label': 'Регион',
    'field-name-label': 'Име на файла',
    'field-page-label': 'Страница',
    'field-selectionToUse-label': 'Избор за използване',
    'field-sort-label': 'Сортирай по',
    'field-sort-order-label': 'Ред на сортиране',
    'selectionToUse-allDocuments': 'Използвайте всички документи',
    'selectionToUse-currentFilters': 'Използвайте текущите филтри',
    'selectionToUse-currentSelection': 'Използвайте текущия избор',
    totalDocumentsCount: '{{count}} общо документа',
  },
}

export const bg: PluginLanguage = {
  dateFNSKey: 'bg',
  translations: bgTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ca.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ca.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const caTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Totes les localitzacions',
    exportDocumentLabel: 'Exporta {{label}}',
    exportOptions: "Opcions d'exportació",
    'field-depth-label': 'Profunditat',
    'field-drafts-label': 'Inclou esborranys',
    'field-fields-label': 'Camps',
    'field-format-label': "Format d'exportació",
    'field-limit-label': 'Límit',
    'field-locale-label': 'Local',
    'field-name-label': 'Nom del fitxer',
    'field-page-label': 'Pàgina',
    'field-selectionToUse-label': 'Selecció per utilitzar',
    'field-sort-label': 'Ordena per',
    'field-sort-order-label': 'Ordre de classificació',
    'selectionToUse-allDocuments': 'Utilitzeu tots els documents',
    'selectionToUse-currentFilters': 'Utilitza els filtres actuals',
    'selectionToUse-currentSelection': 'Utilitza la selecció actual',
    totalDocumentsCount: '{{count}} documents totals',
  },
}

export const ca: PluginLanguage = {
  dateFNSKey: 'ca',
  translations: caTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: cs.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/cs.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const csTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Všechny lokalizace',
    exportDocumentLabel: 'Export {{label}}',
    exportOptions: 'Možnosti exportu',
    'field-depth-label': 'Hloubka',
    'field-drafts-label': 'Zahrnout návrhy',
    'field-fields-label': 'Pole',
    'field-format-label': 'Formát exportu',
    'field-limit-label': 'Limita',
    'field-locale-label': 'Místní',
    'field-name-label': 'Název souboru',
    'field-page-label': 'Stránka',
    'field-selectionToUse-label': 'Výběr k použití',
    'field-sort-label': 'Seřadit podle',
    'field-sort-order-label': 'Řazení',
    'selectionToUse-allDocuments': 'Použijte všechny dokumenty',
    'selectionToUse-currentFilters': 'Použijte aktuální filtry',
    'selectionToUse-currentSelection': 'Použijte aktuální výběr',
    totalDocumentsCount: '{{count}} celkem dokumentů',
  },
}

export const cs: PluginLanguage = {
  dateFNSKey: 'cs',
  translations: csTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: da.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/da.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const daTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Alle lokaliteter',
    exportDocumentLabel: 'Eksport {{label}}',
    exportOptions: 'Eksportmuligheder',
    'field-depth-label': 'Dybde',
    'field-drafts-label': 'Inkluder udkast',
    'field-fields-label': 'Felter',
    'field-format-label': 'Eksportformat',
    'field-limit-label': 'Begrænsning',
    'field-locale-label': 'Lokale',
    'field-name-label': 'Filnavn',
    'field-page-label': 'Side',
    'field-selectionToUse-label': 'Valg til brug',
    'field-sort-label': 'Sorter efter',
    'field-sort-order-label': 'Sorteringsrækkefølge',
    'selectionToUse-allDocuments': 'Brug alle dokumenter',
    'selectionToUse-currentFilters': 'Brug nuværende filtre',
    'selectionToUse-currentSelection': 'Brug nuværende valg',
    totalDocumentsCount: '{{count}} samlede dokumenter',
  },
}

export const da: PluginLanguage = {
  dateFNSKey: 'da',
  translations: daTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: de.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/de.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const deTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Alle Gebietsschemata',
    exportDocumentLabel: 'Export {{label}}',
    exportOptions: 'Exportoptionen',
    'field-depth-label': 'Tiefe',
    'field-drafts-label': 'Fügen Sie Entwürfe hinzu',
    'field-fields-label': 'Felder',
    'field-format-label': 'Exportformat',
    'field-limit-label': 'Grenze',
    'field-locale-label': 'Ort',
    'field-name-label': 'Dateiname',
    'field-page-label': 'Seite',
    'field-selectionToUse-label': 'Auswahl zur Verwendung',
    'field-sort-label': 'Sortieren nach',
    'field-sort-order-label': 'Sortierreihenfolge',
    'selectionToUse-allDocuments': 'Verwenden Sie alle Dokumente.',
    'selectionToUse-currentFilters': 'Verwenden Sie aktuelle Filter',
    'selectionToUse-currentSelection': 'Verwenden Sie die aktuelle Auswahl',
    totalDocumentsCount: '{{count}} gesamte Dokumente',
  },
}

export const de: PluginLanguage = {
  dateFNSKey: 'de',
  translations: deTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: en.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/en.ts

```typescript
import type { PluginLanguage } from '../types.js'
export const enTranslations = {
  'plugin-import-export': {
    allLocales: 'All locales',
    exportDocumentLabel: 'Export {{label}}',
    exportOptions: 'Export Options',
    'field-depth-label': 'Depth',
    'field-drafts-label': 'Include drafts',
    'field-fields-label': 'Fields',
    'field-format-label': 'Export Format',
    'field-limit-label': 'Limit',
    'field-locale-label': 'Locale',
    'field-name-label': 'File name',
    'field-page-label': 'Page',
    'field-selectionToUse-label': 'Selection to use',
    'field-sort-label': 'Sort by',
    'field-sort-order-label': 'Sort order',
    'selectionToUse-allDocuments': 'Use all documents',
    'selectionToUse-currentFilters': 'Use current filters',
    'selectionToUse-currentSelection': 'Use current selection',
    totalDocumentsCount: '{{count}} total documents',
  },
}

export const en: PluginLanguage = {
  dateFNSKey: 'en-US',
  translations: enTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: es.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/es.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const esTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Todas las ubicaciones',
    exportDocumentLabel: 'Exportar {{label}}',
    exportOptions: 'Opciones de Exportación',
    'field-depth-label': 'Profundidad',
    'field-drafts-label': 'Incluir borradores',
    'field-fields-label': 'Campos',
    'field-format-label': 'Formato de Exportación',
    'field-limit-label': 'Límite',
    'field-locale-label': 'Localidad',
    'field-name-label': 'Nombre del archivo',
    'field-page-label': 'Página',
    'field-selectionToUse-label': 'Selección para usar',
    'field-sort-label': 'Ordenar por',
    'field-sort-order-label': 'Orden de clasificación',
    'selectionToUse-allDocuments': 'Utilice todos los documentos',
    'selectionToUse-currentFilters': 'Utilice los filtros actuales',
    'selectionToUse-currentSelection': 'Usar selección actual',
    totalDocumentsCount: '{{count}} documentos totales',
  },
}

export const es: PluginLanguage = {
  dateFNSKey: 'es',
  translations: esTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: et.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/et.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const etTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Kõik kohalikud seaded',
    exportDocumentLabel: 'Ekspordi {{label}}',
    exportOptions: 'Ekspordi valikud',
    'field-depth-label': 'Sügavus',
    'field-drafts-label': 'Kaasa arvatud mustandid',
    'field-fields-label': 'Väljad',
    'field-format-label': 'Ekspordi formaat',
    'field-limit-label': 'Piirang',
    'field-locale-label': 'Lokaal',
    'field-name-label': 'Faili nimi',
    'field-page-label': 'Leht',
    'field-selectionToUse-label': 'Valiku kasutamine',
    'field-sort-label': 'Sorteeri järgi',
    'field-sort-order-label': 'Sorteerimise järjekord',
    'selectionToUse-allDocuments': 'Kasutage kõiki dokumente',
    'selectionToUse-currentFilters': 'Kasuta praeguseid filtreid',
    'selectionToUse-currentSelection': 'Kasuta praegust valikut',
    totalDocumentsCount: '{{count}} dokumendi koguarv',
  },
}

export const et: PluginLanguage = {
  dateFNSKey: 'et',
  translations: etTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: fa.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/fa.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const faTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'تمام مکان ها',
    exportDocumentLabel: 'صادر کردن {{label}}',
    exportOptions: 'گزینه های صادرات',
    'field-depth-label': 'عمق',
    'field-drafts-label': 'شامل پیش نویس ها',
    'field-fields-label': 'مزارع',
    'field-format-label': 'فرمت صادرات',
    'field-limit-label': 'محدودیت',
    'field-locale-label': 'محلی',
    'field-name-label': 'نام فایل',
    'field-page-label': 'صفحه',
    'field-selectionToUse-label': 'انتخاب برای استفاده',
    'field-sort-label': 'مرتب سازی بر اساس',
    'field-sort-order-label': 'ترتیب',
    'selectionToUse-allDocuments': 'از تمام مستندات استفاده کنید',
    'selectionToUse-currentFilters': 'از فیلترهای فعلی استفاده کنید',
    'selectionToUse-currentSelection': 'از انتخاب فعلی استفاده کنید',
    totalDocumentsCount: '{{count}} سند کل',
  },
}

export const fa: PluginLanguage = {
  dateFNSKey: 'fa-IR',
  translations: faTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: fr.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/fr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const frTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Tous les paramètres régionaux',
    exportDocumentLabel: 'Exporter {{label}}',
    exportOptions: "Options d'exportation",
    'field-depth-label': 'Profondeur',
    'field-drafts-label': 'Inclure les ébauches',
    'field-fields-label': 'Champs',
    'field-format-label': "Format d'exportation",
    'field-limit-label': 'Limite',
    'field-locale-label': 'Localisation',
    'field-name-label': 'Nom de fichier',
    'field-page-label': 'Page',
    'field-selectionToUse-label': 'Sélection à utiliser',
    'field-sort-label': 'Trier par',
    'field-sort-order-label': 'Ordre de tri',
    'selectionToUse-allDocuments': 'Utilisez tous les documents',
    'selectionToUse-currentFilters': 'Utilisez les filtres actuels',
    'selectionToUse-currentSelection': 'Utilisez la sélection actuelle',
    totalDocumentsCount: '{{count}} documents au total',
  },
}

export const fr: PluginLanguage = {
  dateFNSKey: 'fr',
  translations: frTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: he.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/he.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const heTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'כל המיקומים',
    exportDocumentLabel: 'ייצוא {{label}}',
    exportOptions: 'אפשרויות ייצוא',
    'field-depth-label': 'עומק',
    'field-drafts-label': 'כלול טיוטות',
    'field-fields-label': 'שדות',
    'field-format-label': 'פורמט יצוא',
    'field-limit-label': 'הגבלה',
    'field-locale-label': 'מקום',
    'field-name-label': 'שם הקובץ',
    'field-page-label': 'עמוד',
    'field-selectionToUse-label': 'בחירה לשימוש',
    'field-sort-label': 'מיין לפי',
    'field-sort-order-label': 'סדר מיון',
    'selectionToUse-allDocuments': 'השתמש בכל המסמכים',
    'selectionToUse-currentFilters': 'השתמש במסננים הנוכחיים',
    'selectionToUse-currentSelection': 'השתמש בבחירה הנוכחית',
    totalDocumentsCount: '{{count}} מסמכים כולל',
  },
}

export const he: PluginLanguage = {
  dateFNSKey: 'he',
  translations: heTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hr.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/hr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const hrTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Sve lokalne postavke',
    exportDocumentLabel: 'Izvoz {{label}}',
    exportOptions: 'Opcije izvoza',
    'field-depth-label': 'Dubina',
    'field-drafts-label': 'Uključite nacrte',
    'field-fields-label': 'Polja',
    'field-format-label': 'Format izvoza',
    'field-limit-label': 'Ograničenje',
    'field-locale-label': 'Lokalitet',
    'field-name-label': 'Naziv datoteke',
    'field-page-label': 'Stranica',
    'field-selectionToUse-label': 'Odabir za upotrebu',
    'field-sort-label': 'Sortiraj po',
    'field-sort-order-label': 'Redoslijed sortiranja',
    'selectionToUse-allDocuments': 'Koristite sve dokumente',
    'selectionToUse-currentFilters': 'Koristite trenutne filtre',
    'selectionToUse-currentSelection': 'Koristite trenutni odabir',
    totalDocumentsCount: '{{count}} ukupno dokumenata',
  },
}

export const hr: PluginLanguage = {
  dateFNSKey: 'hr',
  translations: hrTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hu.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/hu.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const huTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Minden helyszín',
    exportDocumentLabel: '{{label}} exportálása',
    exportOptions: 'Exportálási lehetőségek',
    'field-depth-label': 'Mélység',
    'field-drafts-label': 'Tartalmazza a vázlatokat',
    'field-fields-label': 'Mezők',
    'field-format-label': 'Export formátum',
    'field-limit-label': 'Korlát',
    'field-locale-label': 'Helyszín',
    'field-name-label': 'Fájlnév',
    'field-page-label': 'Oldal',
    'field-selectionToUse-label': 'Használatra kiválasztva',
    'field-sort-label': 'Rendezés szerint',
    'field-sort-order-label': 'Rendezési sorrend',
    'selectionToUse-allDocuments': 'Használjon minden dokumentumot',
    'selectionToUse-currentFilters': 'Használja az aktuális szűrőket',
    'selectionToUse-currentSelection': 'Használja a jelenlegi kiválasztást',
    totalDocumentsCount: '{{count}} összes dokumentum',
  },
}

export const hu: PluginLanguage = {
  dateFNSKey: 'hu',
  translations: huTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hy.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/hy.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const hyTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Բոլոր տեղականությունները',
    exportDocumentLabel: 'Փոխարտադրել {{label}}',
    exportOptions: 'Արտահանման տարբերակներ',
    'field-depth-label': 'Խորություն',
    'field-drafts-label': 'Ներառեք սևագրեր',
    'field-fields-label': 'Դաշտեր',
    'field-format-label': 'Արտահանման ձևաչափ',
    'field-limit-label': 'Սահմանափակում',
    'field-locale-label': 'Լոկալ',
    'field-name-label': 'Ֆայլի անվանումը',
    'field-page-label': 'Էջ',
    'field-selectionToUse-label': 'Օգտագործման ընտրություն',
    'field-sort-label': 'Դասավորել ըստ',
    'field-sort-order-label': 'Դասավորության կարգ',
    'selectionToUse-allDocuments': 'Օգտագործեք բոլոր փաստաթղթերը',
    'selectionToUse-currentFilters': 'Օգտագործեք ընթացիկ ֆիլտրերը',
    'selectionToUse-currentSelection': 'Օգտագործել ընթացիկ ընտրությունը',
    totalDocumentsCount: '{{count}} ընդհանուր փաստաթուղթեր',
  },
}

export const hy: PluginLanguage = {
  dateFNSKey: 'hy-AM',
  translations: hyTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: is.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/is.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const isTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Allar staðfærslur',
    exportDocumentLabel: 'Flytja út {{label}}',
    exportOptions: 'Útflutningsvalkostir',
    'field-depth-label': 'Dýpt',
    'field-drafts-label': 'Innihalda drög',
    'field-fields-label': 'Reitir',
    'field-format-label': 'Útflutnings snið',
    'field-limit-label': 'Takmörkun',
    'field-locale-label': 'Staðfærsla',
    'field-name-label': 'Skrár nafn',
    'field-page-label': 'Síða',
    'field-selectionToUse-label': 'Val til að nota',
    'field-sort-label': 'Raða eftir',
    'field-sort-order-label': 'Röðun',
    'selectionToUse-allDocuments': 'Nota allar færslur',
    'selectionToUse-currentFilters': 'Nota núverandi síu',
    'selectionToUse-currentSelection': 'Nota núverandi val',
    totalDocumentsCount: '{{count}} færslur',
  },
}

export const is: PluginLanguage = {
  dateFNSKey: 'is',
  translations: isTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: it.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/it.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const itTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Tutte le località',
    exportDocumentLabel: 'Esporta {{label}}',
    exportOptions: 'Opzioni di Esportazione',
    'field-depth-label': 'Profondità',
    'field-drafts-label': 'Includi bozze',
    'field-fields-label': 'Campi',
    'field-format-label': 'Formato di Esportazione',
    'field-limit-label': 'Limite',
    'field-locale-label': 'Locale',
    'field-name-label': 'Nome del file',
    'field-page-label': 'Pagina',
    'field-selectionToUse-label': 'Selezione da utilizzare',
    'field-sort-label': 'Ordina per',
    'field-sort-order-label': 'Ordine di sort',
    'selectionToUse-allDocuments': 'Utilizza tutti i documenti',
    'selectionToUse-currentFilters': 'Utilizza i filtri correnti',
    'selectionToUse-currentSelection': 'Utilizza la selezione corrente',
    totalDocumentsCount: '{{count}} documenti totali',
  },
}

export const it: PluginLanguage = {
  dateFNSKey: 'it',
  translations: itTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ja.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ja.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const jaTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'すべてのロケール',
    exportDocumentLabel: '{{label}}をエクスポートする',
    exportOptions: 'エクスポートオプション',
    'field-depth-label': '深さ',
    'field-drafts-label': 'ドラフトを含めます',
    'field-fields-label': 'フィールド',
    'field-format-label': 'エクスポート形式',
    'field-limit-label': '制限',
    'field-locale-label': 'ロケール',
    'field-name-label': 'ファイル名',
    'field-page-label': 'ページ',
    'field-selectionToUse-label': '使用する選択',
    'field-sort-label': '並び替える',
    'field-sort-order-label': '並び替えの順序',
    'selectionToUse-allDocuments': 'すべての文書を使用してください。',
    'selectionToUse-currentFilters': '現在のフィルターを使用してください',
    'selectionToUse-currentSelection': '現在の選択を使用する',
    totalDocumentsCount: '{{count}}合計の文書',
  },
}

export const ja: PluginLanguage = {
  dateFNSKey: 'ja',
  translations: jaTranslations,
}
```

--------------------------------------------------------------------------------

````
