---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 271
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 271 of 695)

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

---[FILE: Code.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/Code.tsx
Signals: React

```typescript
'use client'

import type { CodeFieldClient, CodeFieldClientProps } from 'payload'

import { CodeField, useFormFields } from '@payloadcms/ui'
import React, { useId, useMemo } from 'react'

import { defaultLanguages } from './defaultLanguages.js'

export type AdditionalCodeComponentProps = {
  /**
   * @default first key of the `languages` prop
   */
  defaultLanguage?: string
  /**
   * @default all languages supported by Monaco Editor
   */
  languages?: Record<string, string>
  /**
   * Override the name of the block.
   *
   * @default 'Code'
   */
  slug?: string
  /**
   * Configure typescript settings for the editor
   */
  typescript?: {
    /**
     * By default, the editor will not perform semantic validation. This means that
     * while syntax errors will be highlighted, other issues like missing imports or incorrect
     * types will not be.
     *
     * @default false
     */
    enableSemanticValidation?: boolean
    /**
     * Additional types to fetch and include in the editor for autocompletion.
     *
     * For example, to include types for payload, you would set this to
     *
     * [{ url: 'https://unpkg.com/payload@latest/dist/index.d.ts', filePath: 'file:///node_modules/payload/index.d.ts' }]
     */
    fetchTypes?: Array<{
      filePath: string
      url: string
    }>
    /**
     * @default undefined
     */
    paths?: Record<string, string[]>
    /**
     * @default "ESNext"
     */
    target?: string
    /**
     * @default ['node_modules/@types']
     */
    typeRoots?: string[]
  }
}

export const CodeComponent: React.FC<AdditionalCodeComponentProps & CodeFieldClientProps> = ({
  autoComplete,
  field,
  forceRender,
  languages = defaultLanguages,
  path,
  permissions,
  readOnly,
  renderedBlocks,
  schemaPath,
  typescript,
  validate,
}) => {
  const languageField = useFormFields(([fields]) => fields['language'])

  const language: string =
    (languageField?.value as string) || (languageField?.initialValue as string) || 'typescript'

  // unique id per component instance to ensure Monaco creates a distinct model
  // for each TypeScript code block. Using React's useId is SSR-safe and builtin.
  const instanceId = useId()

  const label = languages[language]

  const props: CodeFieldClient = useMemo<CodeFieldClient>(
    () => ({
      ...field,
      type: 'code',
      admin: {
        ...field.admin,
        editorOptions: {},
        editorProps: {
          // If typescript is set, @monaco-editor/react needs to set the URI to a .ts or .tsx file when it calls createModel().
          // Provide a unique defaultPath per instance so Monaco doesn't reuse the same model
          // across multiple code block instances. We use field.name + instanceId for debugability.
          defaultPath: language === 'ts' ? `file-${field.name}-${instanceId}.tsx` : undefined,
        },
        language,
      },
    }),
    [field, language, instanceId],
  )

  const key = `${field.name}-${language}-${label}`

  return (
    props && (
      <CodeField
        autoComplete={autoComplete}
        field={props}
        forceRender={forceRender}
        key={key}
        onMount={(_editor, monaco) => {
          monaco.editor.defineTheme('vs-dark', {
            base: 'vs-dark',
            colors: {
              'editor.background': '#222222',
            },
            inherit: true,
            rules: [],
          })

          monaco.editor.defineTheme('vs', {
            base: 'vs',
            colors: {
              'editor.background': '#f5f5f5',
            },
            inherit: true,
            rules: [],
          })
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            // Set module resolution to NodeJs to enable autocompletion
            allowJs: true,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            jsx: monaco.languages.typescript.JsxEmit.React,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            noEmit: true,
            paths: typescript?.paths,
            reactNamespace: 'React',
            target: monaco.languages.typescript.ScriptTarget[
              typescript?.target ?? ('ESNext' as any)
            ] as any,
            typeRoots: typescript?.typeRoots ?? ['node_modules/@types'],
          })

          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: typescript?.enableSemanticValidation ? false : true,
            noSyntaxValidation: false,
          })

          const run = async () => {
            if (
              typescript?.fetchTypes &&
              Array.isArray(typescript.fetchTypes) &&
              typescript.fetchTypes.length > 0
            ) {
              await Promise.all(
                typescript.fetchTypes.map(async (type) => {
                  const types = await fetch(type.url)
                  const typesText = await types.text()
                  monaco.languages.typescript.typescriptDefaults.addExtraLib(
                    typesText,
                    type.filePath,
                  )
                }),
              )
            }
          }
          void run()
        }}
        path={path}
        permissions={permissions}
        readOnly={readOnly}
        renderedBlocks={renderedBlocks}
        schemaPath={schemaPath}
        validate={validate}
      />
    )
  )
}
```

--------------------------------------------------------------------------------

---[FILE: defaultLanguages.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/defaultLanguages.ts

```typescript
/**
 * Source: https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages
 */
export const defaultLanguages: Record<string, string> = {
  abap: 'ABAP',
  apex: 'Apex',
  azcli: 'Azure CLI',
  bat: 'Batch',
  bicep: 'Bicep',
  cameligo: 'CameLIGO',
  clojure: 'Clojure',
  coffee: 'CoffeeScript',
  cpp: 'C++',
  csharp: 'C#',
  csp: 'CSP',
  css: 'CSS',
  cypher: 'Cypher',
  dart: 'Dart',
  dockerfile: 'Dockerfile',
  ecl: 'ECL',
  elixir: 'Elixir',
  flow9: 'Flow9',
  freemarker2: 'FreeMarker 2',
  fsharp: 'F#',
  go: 'Go',
  graphql: 'GraphQL',
  handlebars: 'Handlebars',
  hcl: 'HCL',
  html: 'HTML',
  ini: 'INI',
  java: 'Java',
  javascript: 'JavaScript',
  julia: 'Julia',
  kotlin: 'Kotlin',
  less: 'Less',
  lexon: 'Lexon',
  liquid: 'Liquid',
  lua: 'Lua',
  m3: 'M3',
  markdown: 'Markdown',
  mdx: 'MDX',
  mips: 'MIPS',
  msdax: 'DAX',
  mysql: 'MySQL',
  'objective-c': 'Objective-C',
  pascal: 'Pascal',
  pascaligo: 'PascaLIGO',
  perl: 'Perl',
  pgsql: 'PostgreSQL',
  php: 'PHP',
  pla: 'PLA',
  plaintext: 'Plain Text',
  postiats: 'Postiats',
  powerquery: 'Power Query',
  powershell: 'PowerShell',
  protobuf: 'Protobuf',
  pug: 'Pug',
  python: 'Python',
  qsharp: 'Q#',
  r: 'R',
  razor: 'Razor',
  redis: 'Redis',
  redshift: 'Amazon Redshift',
  restructuredtext: 'reStructuredText',
  ruby: 'Ruby',
  rust: 'Rust',
  sb: 'Small Basic',
  scala: 'Scala',
  scheme: 'Scheme',
  scss: 'SCSS',
  shell: 'Shell',
  solidity: 'Solidity',
  sophia: 'Sophia',
  sparql: 'SPARQL',
  sql: 'SQL',
  st: 'Structured Text',
  swift: 'Swift',
  systemverilog: 'SystemVerilog',
  tcl: 'Tcl',
  twig: 'Twig',
  typescript: 'TypeScript',
  typespec: 'TypeSpec',
  vb: 'Visual Basic',
  wgsl: 'WGSL',
  xml: 'XML',
  yaml: 'YAML',
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/index.scss

```text
@import '~@payloadcms/ui/scss';

.payload-richtext-code-block.collapsible--collapsed {
  .rah-static {
    height: unset !important;
    max-height: 150px !important;
    position: relative;

    &::after {
      content: '';
      pointer-events: none;
      background: linear-gradient(
        to bottom,
        rgb(0 0 0 / 0%) 0%,
        var(--theme-elevation-50) 90%,
        var(--theme-elevation-50) 100%
      );
      position: absolute;
      height: 100px;
      top: 50px;
      left: 0;
      right: 0;
    }

    > div {
      display: unset !important;
    }
  }
}

.payload-richtext-code-block {
  &__pill {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: base(0.4);
    margin-left: base(0.4);
    color: var(--theme-elevation-500);
  }

  .collapsible__header-wrap {
    overflow: visible;
  }
  .collapsible__content {
    padding: 0;
  }

  .LexicalEditorTheme__block {
    &__block-header {
      overflow: visible;
    }
  }

  .code-editor,
  .monaco-editor,
  .overflow-guard {
    border-width: 0;
    border-radius: 0 0 $style-radius-s $style-radius-s;
  }

  &__actions {
    display: flex;
    flex-direction: row;
    gap: calc(var(--base) * 0.4);
  }

  .popup-button {
    padding: 0 0 0 calc(var(--base) * 0.2);
  }

  .copy-to-clipboard,
  .code-block-collapse-button,
  .popup-button {
    border-radius: $style-radius-s;
    color: var(--theme-elevation-500);
    min-width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--theme-elevation-800);
      background-color: var(--theme-elevation-200);
    }
  }

  &__language-selector {
    pointer-events: all;

    &-button {
      display: flex;
      flex-direction: row;
      width: max-content;
      align-items: center;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/Collapse/index.scss

```text
@import '~@payloadcms/ui/scss';

.code-block-collapse-button {
  all: unset;
  cursor: pointer;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/Collapse/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'code-block-collapse-button'
import { useCollapsible } from '@payloadcms/ui'

import { CollapseIcon } from '../../../../../../lexical/ui/icons/Collapse/index.js'

export const Collapse: React.FC = () => {
  const { toggle } = useCollapsible()
  return (
    <button className={baseClass} onClick={toggle} type="button">
      <CollapseIcon />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/FloatingCollapse/index.scss

```text
@import '~@payloadcms/ui/scss';

.code-block-floating-collapse-button {
  all: unset;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: base(0.5);

  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 24px;
  bottom: -12px;

  padding: base(0.2) base(0.4);
  border-radius: $style-radius-s;

  background: var(--theme-elevation-150);
  color: var(--theme-elevation-600);

  &:hover {
    background: var(--theme-elevation-200);
    color: var(--theme-elevation-800);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/premade/CodeBlock/Component/FloatingCollapse/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'code-block-floating-collapse-button'
import { useCollapsible, useTranslation } from '@payloadcms/ui'

import { CollapseIcon } from '../../../../../../lexical/ui/icons/Collapse/index.js'

export const FloatingCollapse: React.FC = () => {
  const { isCollapsed, toggle } = useCollapsible()
  const { t } = useTranslation()

  if (!isCollapsed) {
    return null
  }

  return (
    <button className={baseClass} onClick={toggle} type="button">
      <span>{t('general:collapse')}</span>
      <CollapseIcon />
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: graphQLPopulationPromise.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/graphQLPopulationPromise.ts

```typescript
import type { Block } from 'payload'

import type { PopulationPromise } from '../../typesServer.js'
import type { SerializedInlineBlockNode } from '../server/nodes/InlineBlocksNode.js'
import type { SerializedBlockNode } from './nodes/BlocksNode.js'

import { recursivelyPopulateFieldsForGraphQL } from '../../../populateGraphQL/recursivelyPopulateFieldsForGraphQL.js'

export const blockPopulationPromiseHOC = (
  blocks: Block[],
): PopulationPromise<SerializedBlockNode | SerializedInlineBlockNode> => {
  const blockPopulationPromise: PopulationPromise<
    SerializedBlockNode | SerializedInlineBlockNode
  > = ({
    context,
    currentDepth,
    depth,
    draft,
    editorPopulationPromises,
    field,
    fieldPromises,
    findMany,
    flattenLocales,
    node,
    overrideAccess,
    parentIsLocalized,
    populationPromises,
    req,
    showHiddenFields,
  }) => {
    const blockFieldData = node.fields

    // find block used in this node
    const block = blocks.find((block) => block.slug === blockFieldData.blockType)
    if (!block || !block?.fields?.length || !blockFieldData) {
      return
    }

    recursivelyPopulateFieldsForGraphQL({
      context,
      currentDepth,
      data: blockFieldData,
      depth,
      draft,
      editorPopulationPromises,
      fieldPromises,
      fields: block.fields,
      findMany,
      flattenLocales,
      overrideAccess,
      parentIsLocalized: parentIsLocalized || field.localized || false,
      populationPromises,
      req,
      showHiddenFields,
      siblingDoc: blockFieldData,
    })
  }

  return blockPopulationPromise
}
```

--------------------------------------------------------------------------------

---[FILE: i18n.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/i18n.ts

```typescript
import type { GenericLanguages } from '@payloadcms/translations'

export const i18n: Partial<GenericLanguages> = {
  ar: {
    inlineBlocks: {
      create: 'أنشئ {{label}}',
      edit: 'تحرير {{label}}',
      label: 'الكتل الداخلية',
      remove: 'إزالة {{label}}',
    },
    label: 'كتل',
  },
  az: {
    inlineBlocks: {
      create: 'Yarat {{label}}',
      edit: '{{label}} redaktə et',
      label: 'Sıralı Bloklar',
      remove: '{{label}} silin',
    },
    label: 'Bloklar',
  },
  bg: {
    inlineBlocks: {
      create: 'Създайте {{label}}',
      edit: 'Редактирай {{label}}',
      label: 'Вградени блокове',
      remove: 'Премахнете {{label}}',
    },
    label: 'Блокове',
  },
  cs: {
    inlineBlocks: {
      create: 'Vytvořte {{label}}',
      edit: 'Upravit {{label}}',
      label: 'Inline bloky',
      remove: 'Odstraňte {{label}}',
    },
    label: 'Bloky',
  },
  da: {
    inlineBlocks: {
      create: 'Opret {{label}}',
      edit: 'Rediger {{label}}',
      label: 'Indlejrede blokke',
      remove: 'Fjern {{label}}',
    },
    label: 'Blokke',
  },
  de: {
    inlineBlocks: {
      create: 'Erstelle {{label}}',
      edit: 'Bearbeite {{label}}',
      label: 'Inline-Blöcke',
      remove: 'Entferne {{label}}',
    },
    label: 'Blöcke',
  },
  en: {
    inlineBlocks: {
      create: 'Create {{label}}',
      edit: 'Edit {{label}}',
      label: 'Inline Blocks',
      remove: 'Remove {{label}}',
    },
    label: 'Blocks',
  },
  es: {
    inlineBlocks: {
      create: 'Crear {{label}}',
      edit: 'Editar {{label}}',
      label: 'Bloques en línea',
      remove: 'Eliminar {{label}}',
    },
    label: 'Bloques',
  },
  et: {
    inlineBlocks: {
      create: 'Loo {{label}}',
      edit: 'Muuda {{label}}',
      label: 'Sisseehitatud plokid',
      remove: 'Eemalda {{label}}',
    },
    label: 'Plokk',
  },
  fa: {
    inlineBlocks: {
      create: 'ایجاد {{label}}',
      edit: 'ویرایش {{label}}',
      label: 'بلوک‌های درون خطی',
      remove: 'حذف {{label}}',
    },
    label: 'بلوک ها',
  },
  fr: {
    inlineBlocks: {
      create: 'Créer {{label}}',
      edit: 'Modifier {{label}}',
      label: 'Blocs en ligne',
      remove: 'Supprimer {{label}}',
    },
    label: 'Blocs',
  },
  he: {
    inlineBlocks: {
      create: 'צור {{label}}',
      edit: 'ערוך {{label}}',
      label: 'בלוקים משורשרים',
      remove: 'הסר {{label}}',
    },
    label: 'חסימות',
  },
  hr: {
    inlineBlocks: {
      create: 'Stvori {{label}}',
      edit: 'Uredi {{label}}',
      label: 'Unutrašnji blokovi',
      remove: 'Ukloni {{label}}',
    },
    label: 'Blokovi',
  },
  hu: {
    inlineBlocks: {
      create: 'Hozzon létre {{label}}',
      edit: 'Szerkesztés {{label}}',
      label: 'Beágyazott blokkok',
      remove: 'Távolítsa el a {{label}}',
    },
    label: 'Blokkok',
  },
  is: {
    inlineBlocks: {
      create: 'Skrá {{label}}',
      edit: 'Breyta {{label}}',
      label: 'Línublokkir',
      remove: 'Fjarlægja {{label}}',
    },
    label: 'Blokkir',
  },
  it: {
    inlineBlocks: {
      create: 'Crea {{label}}',
      edit: 'Modifica {{label}}',
      label: 'Blocchi in linea',
      remove: 'Rimuovi {{label}}',
    },
    label: 'Blocchi',
  },
  ja: {
    inlineBlocks: {
      create: '{{label}}を作成する',
      edit: '{{label}}を編集する',
      label: 'インラインブロック',
      remove: '{{label}}を削除します',
    },
    label: 'ブロック',
  },
  ko: {
    inlineBlocks: {
      create: '{{label}} 생성하기',
      edit: '{{label}} 수정하기',
      label: '인라인 블록',
      remove: '{{label}} 제거하세요',
    },
    label: '블록',
  },
  my: {
    inlineBlocks: {
      create: 'Cipta {{label}}',
      edit: 'Sunting {{label}}',
      label: 'Inline Blocks [SKIPPED]',
      remove: 'Buang {{label}}',
    },
    label: 'တံတားများ',
  },
  nb: {
    inlineBlocks: {
      create: 'Opprett {{label}}',
      edit: 'Rediger {{label}}',
      label: 'In-line blokker',
      remove: 'Fjern {{label}}',
    },
    label: 'Blokker',
  },
  nl: {
    inlineBlocks: {
      create: 'Maak {{label}}',
      edit: 'Bewerk {{label}}',
      label: 'Inline Blocks',
      remove: 'Verwijder {{label}}',
    },
    label: 'Blokken',
  },
  pl: {
    inlineBlocks: {
      create: 'Utwórz {{label}}',
      edit: 'Edytuj {{label}}',
      label: 'Blokowanie w linii',
      remove: 'Usuń {{label}}',
    },
    label: 'Bloki',
  },
  pt: {
    inlineBlocks: {
      create: 'Crie {{label}}',
      edit: 'Editar {{label}}',
      label: 'Blocos em linha',
      remove: 'Remova {{label}}',
    },
    label: 'Blocos',
  },
  ro: {
    inlineBlocks: {
      create: 'Creează {{label}}',
      edit: 'Editați {{label}}',
      label: 'Blocuri in linie',
      remove: 'Ștergeți {{label}}',
    },
    label: 'Blocuri',
  },
  rs: {
    inlineBlocks: {
      create: 'Креирај {{label}}',
      edit: 'Измени {{label}}',
      label: 'Уметнути блокови',
      remove: 'Уклони {{label}}',
    },
    label: 'Блокови',
  },
  'rs-latin': {
    inlineBlocks: {
      create: 'Kreiraj {{label}}',
      edit: 'Izmeni {{label}}',
      label: 'Umetnuti blokovi',
      remove: 'Ukloni {{label}}',
    },
    label: 'Blokovi',
  },
  ru: {
    inlineBlocks: {
      create: 'Создать {{label}}',
      edit: 'Изменить {{label}}',
      label: 'Встроенные блоки',
      remove: 'Удалить {{label}}',
    },
    label: 'Блоки',
  },
  sk: {
    inlineBlocks: {
      create: 'Vytvorte {{label}}',
      edit: 'Upraviť {{label}}',
      label: 'Inline bloky',
      remove: 'Odstráňte {{label}}',
    },
    label: 'Bloky',
  },
  sl: {
    inlineBlocks: {
      create: 'Ustvari {{label}}',
      edit: 'Uredi {{label}}',
      label: 'Vrstični bloki',
      remove: 'Odstrani {{label}}',
    },
    label: 'Bloki',
  },
  sv: {
    inlineBlocks: {
      create: 'Skapa {{label}}',
      edit: 'Redigera {{label}}',
      label: 'Inline-blockar',
      remove: 'Ta bort {{label}}',
    },
    label: 'Block',
  },
  ta: {
    inlineBlocks: {
      create: '{{label}} உருவாக்கவும்',
      edit: '{{label}} திருத்தவும்',
      label: 'இன்லைன் தொகுதிகள்',
      remove: '{{label}} நீக்கவும்',
    },
    label: 'தொகுதிகள்',
  },
  th: {
    inlineBlocks: {
      create: 'สร้าง {{label}}',
      edit: 'แก้ไข {{label}}',
      label: 'บล็อกแบบอินไลน์',
      remove: 'ลบ {{label}}',
    },
    label: 'บล็อค',
  },
  tr: {
    inlineBlocks: {
      create: '{{label}} oluşturun',
      edit: "{{label}}'i düzenleyin",
      label: 'Satır İçi Bloklar',
      remove: '{{label}} kaldırın',
    },
    label: 'Bloklar',
  },
  uk: {
    inlineBlocks: {
      create: 'Створити {{label}}',
      edit: 'Редагувати {{label}}',
      label: 'Вбудовані блоки',
      remove: 'Видалити {{label}}',
    },
    label: 'Блоки',
  },
  vi: {
    inlineBlocks: {
      create: 'Tạo {{label}}',
      edit: 'Chỉnh sửa {{label}}',
      label: 'Khối nội tuyến',
      remove: 'Xóa {{label}}',
    },
    label: 'Khối',
  },
  zh: {
    inlineBlocks: {
      create: '创建{{label}}',
      edit: '编辑 {{label}}',
      label: '内联块',
      remove: '删除{{label}}',
    },
    label: '区块',
  },
  'zh-TW': {
    inlineBlocks: {
      create: '創建 {{label}}',
      edit: '編輯 {{label}}',
      label: '內聯區塊',
      remove: '移除 {{label}}',
    },
    label: '區塊',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/index.ts

```typescript
import type {
  Block,
  BlocksField,
  BlockSlug,
  Config,
  FieldSchemaMap,
  FlattenedBlocksField,
} from 'payload'

import { fieldsToJSONSchema, flattenAllFields, sanitizeFields } from 'payload'

import { createServerFeature } from '../../../utilities/createServerFeature.js'
import { createNode } from '../../typeUtilities.js'
import { blockPopulationPromiseHOC } from './graphQLPopulationPromise.js'
import { i18n } from './i18n.js'
import { getBlockMarkdownTransformers } from './markdown/markdownTransformer.js'
import { ServerBlockNode } from './nodes/BlocksNode.js'
import { ServerInlineBlockNode } from './nodes/InlineBlocksNode.js'
import { blockValidationHOC } from './validate.js'

export type BlocksFeatureProps = {
  blocks?: (Block | BlockSlug)[] | Block[]
  inlineBlocks?: (Block | BlockSlug)[] | Block[]
}

export const BlocksFeature = createServerFeature<BlocksFeatureProps, BlocksFeatureProps>({
  feature: async ({ config: _config, isRoot, parentIsLocalized, props: _props }) => {
    const validRelationships = _config.collections.map((c) => c.slug) || []

    const sanitized = await sanitizeFields({
      config: _config as unknown as Config,
      fields: [
        {
          name: 'lexical_blocks',
          type: 'blocks',
          blockReferences: _props.blocks ?? [],
          blocks: [],
        },
        {
          name: 'lexical_inline_blocks',
          type: 'blocks',
          blockReferences: _props.inlineBlocks ?? [],
          blocks: [],
        },
      ],
      parentIsLocalized,
      requireFieldLevelRichTextEditor: isRoot,
      validRelationships,
    })

    const blockConfigs: Block[] = []
    for (const _block of (sanitized[0] as BlocksField).blockReferences ??
      (sanitized[0] as BlocksField).blocks) {
      const block =
        typeof _block === 'string' ? _config?.blocks?.find((b) => b.slug === _block) : _block
      if (!block) {
        throw new Error(
          `Block not found for slug: ${typeof _block === 'string' ? _block : _block?.slug}`,
        )
      }
      blockConfigs.push(block)
    }

    const inlineBlockConfigs: Block[] = []
    for (const _block of (sanitized[1] as BlocksField).blockReferences ??
      (sanitized[1] as BlocksField).blocks) {
      const block =
        typeof _block === 'string' ? _config?.blocks?.find((b) => b.slug === _block) : _block
      if (!block) {
        throw new Error(
          `Block not found for slug: ${typeof _block === 'string' ? _block : _block?.slug}`,
        )
      }
      inlineBlockConfigs.push(block)
    }

    return {
      ClientFeature: '@payloadcms/richtext-lexical/client#BlocksFeatureClient',
      generatedTypes: {
        modifyOutputSchema: ({
          collectionIDFieldTypes,
          config,
          currentSchema,
          field,
          i18n,
          interfaceNameDefinitions,
        }) => {
          if (!blockConfigs?.length && !inlineBlockConfigs?.length) {
            return currentSchema
          }

          const fields: FlattenedBlocksField[] = []

          if (blockConfigs?.length) {
            fields.push({
              name: field?.name + '_lexical_blocks',
              type: 'blocks',
              blocks: blockConfigs.map((block) => {
                return {
                  ...block,
                  flattenedFields: flattenAllFields({ fields: block.fields }),
                }
              }),
            })
          }
          if (inlineBlockConfigs?.length) {
            fields.push({
              name: field?.name + '_lexical_inline_blocks',
              type: 'blocks',
              blocks: inlineBlockConfigs.map((block) => {
                return {
                  ...block,
                  flattenedFields: flattenAllFields({ fields: block.fields }),
                }
              }),
            })
          }

          if (fields.length) {
            // This is only done so that interfaceNameDefinitions sets those block's interfaceNames.
            // we don't actually use the JSON Schema itself in the generated types yet.
            fieldsToJSONSchema(
              collectionIDFieldTypes,
              fields,
              interfaceNameDefinitions,
              config,
              i18n,
            )
          }

          return currentSchema
        },
      },
      generateSchemaMap: ({ config }) => {
        /**
         * Add sub-fields to the schemaMap. E.g. if you have an array field as part of the block, and it runs addRow, it will request these
         * sub-fields from the component map. Thus, we need to put them in the component map here.
         */
        const schemaMap: FieldSchemaMap = new Map()

        if (blockConfigs?.length) {
          for (const block of blockConfigs) {
            const blockFields = [...block.fields]

            if (block?.admin?.components) {
              blockFields.unshift({
                name: `_components`,
                type: 'ui',
                admin: {
                  components: {
                    Block: block.admin?.components?.Block,
                    BlockLabel: block.admin?.components?.Label,
                  },
                },
              })
            }
            schemaMap.set(`lexical_blocks.${block.slug}.fields`, {
              fields: blockFields,
            })
            schemaMap.set(`lexical_blocks.${block.slug}`, {
              name: `lexical_blocks_${block.slug}`,
              type: 'blocks',
              blocks: [block],
            })
          }
        }

        if (inlineBlockConfigs?.length) {
          // To generate block schemaMap which generates things like the componentMap for admin.Label
          for (const block of inlineBlockConfigs) {
            const blockFields = [...block.fields]

            if (block?.admin?.components) {
              blockFields.unshift({
                name: `_components`,
                type: 'ui',
                admin: {
                  components: {
                    Block: block.admin?.components?.Block,
                    BlockLabel: block.admin?.components?.Label,
                  },
                },
              })
            }

            schemaMap.set(`lexical_inline_blocks.${block.slug}.fields`, {
              fields: blockFields,
            })

            schemaMap.set(`lexical_inline_blocks.${block.slug}`, {
              name: `lexical_inline_blocks_${block.slug}`,
              type: 'blocks',
              blocks: [block],
            })
          }
        }

        return schemaMap
      },
      i18n,
      markdownTransformers: getBlockMarkdownTransformers({
        blocks: blockConfigs,
        inlineBlocks: inlineBlockConfigs,
      }),

      nodes: [
        createNode({
          // @ts-expect-error - TODO: fix this
          getSubFields: ({ node }) => {
            if (!node) {
              if (blockConfigs?.length) {
                return [
                  {
                    name: 'lexical_blocks',
                    type: 'blocks',
                    blocks: blockConfigs,
                  },
                ]
              }
              return []
            }

            const blockType = node.fields.blockType

            const block = blockConfigs?.find((block) => block.slug === blockType)
            return block?.fields
          },
          getSubFieldsData: ({ node }) => {
            return node?.fields
          },
          graphQLPopulationPromises: [blockPopulationPromiseHOC(blockConfigs)],
          node: ServerBlockNode,
          validations: [blockValidationHOC(blockConfigs)],
        }),
        createNode({
          // @ts-expect-error - TODO: fix this
          getSubFields: ({ node }) => {
            if (!node) {
              if (inlineBlockConfigs?.length) {
                return [
                  {
                    name: 'lexical_inline_blocks',
                    type: 'blocks',
                    blocks: inlineBlockConfigs,
                  },
                ]
              }
              return []
            }

            const blockType = node.fields.blockType

            const block = inlineBlockConfigs?.find((block) => block.slug === blockType)
            return block?.fields
          },
          getSubFieldsData: ({ node }) => {
            return node?.fields
          },
          graphQLPopulationPromises: [blockPopulationPromiseHOC(inlineBlockConfigs)],
          node: ServerInlineBlockNode,
          validations: [blockValidationHOC(inlineBlockConfigs)],
        }),
      ],
      sanitizedServerFeatureProps: _props,
    }
  },
  key: 'blocks',
})
```

--------------------------------------------------------------------------------

---[FILE: validate.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/validate.ts

```typescript
import type { Block } from 'payload'

import { fieldSchemasToFormState } from '@payloadcms/ui/forms/fieldSchemasToFormState'

import type { NodeValidation } from '../../typesServer.js'
import type { BlockFields, SerializedBlockNode } from './nodes/BlocksNode.js'
import type { SerializedInlineBlockNode } from './nodes/InlineBlocksNode.js'

/**
 * Runs validation for blocks. This function will determine if the rich text field itself is valid. It does not handle
 * block field error paths - this is done by the `beforeChangeTraverseFields` call in the `beforeChange` hook, called from the
 * rich text adapter.
 */
export const blockValidationHOC = (
  blocks: Block[],
): NodeValidation<SerializedBlockNode | SerializedInlineBlockNode> => {
  return async ({ node, validation }) => {
    const blockFieldData = node.fields ?? ({} as BlockFields)

    const {
      options: { id, collectionSlug, data, operation, preferences, req },
    } = validation

    // find block
    const block = blocks.find((block) => block.slug === blockFieldData.blockType)

    // validate block
    if (!block) {
      return `Block ${blockFieldData.blockType} not found`
    }

    /**
     * Run fieldSchemasToFormState as that properly validates block and block sub-fields
     */

    const result = await fieldSchemasToFormState({
      id,
      collectionSlug,
      data: blockFieldData,
      documentData: data,
      fields: block.fields,
      fieldSchemaMap: undefined,
      initialBlockData: blockFieldData,
      operation: operation === 'create' || operation === 'update' ? operation : 'update',
      permissions: {},
      preferences,
      renderAllFields: false,
      req,
      schemaPath: '',
    })

    const errorPathsSet = new Set<string>()
    for (const fieldKey in result) {
      const fieldState = result[fieldKey]
      if (fieldState?.errorPaths?.length) {
        for (const errorPath of fieldState.errorPaths) {
          errorPathsSet.add(errorPath)
        }
      }
    }
    const errorPaths = Array.from(errorPathsSet)

    if (errorPaths.length) {
      return 'The following fields are invalid: ' + errorPaths.join(', ')
    }

    return true
  }
}
```

--------------------------------------------------------------------------------

---[FILE: linesFromMatchToContentAndPropsString.ts]---
Location: payload-main/packages/richtext-lexical/src/features/blocks/server/markdown/linesFromMatchToContentAndPropsString.ts

```typescript
export function linesFromStartToContentAndPropsString({
  isEndOptional,
  lines,
  regexpEndRegex,
  startLineIndex,
  startMatch,
  trimChildren,
}: {
  isEndOptional?: boolean
  lines: string[]
  regexpEndRegex?: RegExp
  startLineIndex: number
  startMatch: RegExpMatchArray
  trimChildren?: boolean
}): {
  /**
   * The matched string after the end match, in the same line as the end match. Useful for inline matches.
   */
  afterEndLine: string
  /**
   * The matched string before the start match, in the same line as the start match. Useful for inline matches.
   */
  beforeStartLine: string
  content: string
  endLineIndex: number
  endlineLastCharIndex: number
  propsString: string
} {
  let propsString = ''
  let content = ''
  const linesCopy = lines.slice(startLineIndex)

  let isWithinContent = false // If false => is within prop
  let contentSubTagStartAmount = 0

  let bracketCount = 0
  let quoteChar: null | string = null
  let isSelfClosing = false
  let isWithinCodeBlockAmount = 0

  const beforeStartLine = linesCopy[0]!.slice(0, startMatch.index)
  let endlineLastCharIndex = 0

  let endLineIndex = startLineIndex

  mainLoop: for (const [lineIndex, lineCopy] of linesCopy.entries()) {
    const line = trimChildren ? lineCopy.trim() : lineCopy
    let amountOfBeginningSpacesRemoved = 0
    if (trimChildren) {
      for (let i = 0; i < lineCopy.length; i++) {
        if (lineCopy[i] === ' ') {
          amountOfBeginningSpacesRemoved++
        } else {
          break
        }
      }
    }

    let charIndex = 0

    if (lineIndex === 0) {
      charIndex = (startMatch.index ?? 0) + startMatch[0].length - amountOfBeginningSpacesRemoved // We need to also loop over the ">" in something like "<InlineCode>" in order to later set isWithinContent to true
    }

    while (charIndex < line.length) {
      const char = line[charIndex]
      const nextChar = line[charIndex + 1]

      if (!isWithinContent) {
        if (char === '{' && !quoteChar) {
          bracketCount++
        } else if (char === '}' && !quoteChar) {
          bracketCount--
        } else if ((char === '"' || char === "'") && !quoteChar) {
          quoteChar = char
        } else if (char === quoteChar) {
          quoteChar = null
        }

        if (char === '/' && nextChar === '>' && bracketCount === 0 && !quoteChar) {
          isSelfClosing = true
          endLineIndex = lineIndex
          endlineLastCharIndex = charIndex + 2

          break mainLoop
        } else if (char === '>' && bracketCount === 0 && !quoteChar) {
          isWithinContent = true
          charIndex++
          continue
        }

        propsString += char
      } else {
        if (char === '`') {
          isWithinCodeBlockAmount++
        }

        if (isWithinCodeBlockAmount % 2 === 0) {
          if (char === '<' && nextChar === '/') {
            contentSubTagStartAmount--

            if (contentSubTagStartAmount < 0) {
              if (content[content.length - 1] === '\n') {
                content = content.slice(0, -1) // Remove the last newline
              }
              endLineIndex = lineIndex
              // Calculate endlineLastCharIndex by finding ">" in line
              for (let i = charIndex; i < line.length; i++) {
                if (line[i] === '>') {
                  endlineLastCharIndex = i + 1

                  break
                }
              }
              break mainLoop
            }
          } else if (char === '/' && nextChar === '>') {
            contentSubTagStartAmount--

            if (contentSubTagStartAmount < 0) {
              if (content[content.length - 1] === '\n') {
                content = content.slice(0, -1) // Remove the last newline
              }
              endLineIndex = lineIndex
              endlineLastCharIndex = charIndex + 2
              break mainLoop
            }
          } else if (char === '<' && nextChar !== '/') {
            contentSubTagStartAmount++
          }
        }

        content += char
      }

      charIndex++
    }

    if (isWithinContent) {
      if (content?.length > 0 && lineIndex > 0) {
        content += '\n'
      }
    } else {
      propsString += '\n'
    }

    if (regexpEndRegex && contentSubTagStartAmount < 0) {
      // If 0 and in same line where it got lowered to 0 then this is not the match we are looking for
      const match = line.match(regexpEndRegex)
      if (match?.index !== undefined) {
        endLineIndex = lineIndex
        endlineLastCharIndex = match.index + match[0].length - 1
        break
      }
    }

    if (lineIndex === linesCopy.length - 1 && !isEndOptional && !isSelfClosing) {
      throw new Error(
        'End match not found for lines ' +
          lines.join('\n') +
          '\n\n. Start match: ' +
          JSON.stringify(startMatch),
      )
    }
  }

  const afterEndLine = linesCopy[endLineIndex]!.trim().slice(endlineLastCharIndex)

  return {
    afterEndLine,
    beforeStartLine,
    content,
    endLineIndex: startLineIndex + endLineIndex,
    endlineLastCharIndex,
    propsString,
  }
}
```

--------------------------------------------------------------------------------

````
