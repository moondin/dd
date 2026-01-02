---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 261
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 261 of 695)

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

---[FILE: tr.ts]---
Location: payload-main/packages/plugin-seo/src/translations/tr.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const tr: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Neredeyse tamam',
    autoGenerate: 'Otomatik oluştur',
    bestPractices: 'en iyi uygulamalar',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} karakter, ',
    charactersLeftOver: '{{characters}} karakter kaldı',
    charactersToGo: '{{characters}} karakter kaldı',
    charactersTooMany: '{{characters}} karakter fazla',
    checksPassing: '{{current}}/{{max}} kontrol başarılı',
    good: 'İyi',
    imageAutoGenerationTip: 'Otomatik oluşturma, seçilen ana görseli alacaktır.',
    lengthTipDescription:
      '{{minLength}} ile {{maxLength}} karakter arasında olmalıdır. Kaliteli meta açıklamaları yazmak için yardım almak için bkz. ',
    lengthTipTitle:
      '{{minLength}} ile {{maxLength}} karakter arasında olmalıdır. Kaliteli meta başlıkları yazmak için yardım almak için bkz. ',
    missing: 'Eksik',
    noImage: 'Görsel yok',
    preview: 'Önizleme',
    previewDescription: 'Kesin sonuç listeleri içeriğe ve arama alâkasına göre değişebilir.',
    tooLong: 'Çok uzun',
    tooShort: 'Çok kısa',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: translation-schema.json]---
Location: payload-main/packages/plugin-seo/src/translations/translation-schema.json

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "plugin-seo": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "missing": {
          "type": "string"
        },
        "almostThere": {
          "type": "string"
        },
        "autoGenerate": {
          "type": "string"
        },
        "bestPractices": {
          "type": "string"
        },
        "characterCount": {
          "type": "string"
        },
        "charactersLeftOver": {
          "type": "string"
        },
        "charactersToGo": {
          "type": "string"
        },
        "charactersTooMany": {
          "type": "string"
        },
        "checksPassing": {
          "type": "string"
        },
        "good": {
          "type": "string"
        },
        "imageAutoGenerationTip": {
          "type": "string"
        },
        "lengthTipDescription": {
          "type": "string"
        },
        "lengthTipTitle": {
          "type": "string"
        },
        "noImage": {
          "type": "string"
        },
        "preview": {
          "type": "string"
        },
        "previewDescription": {
          "type": "string"
        },
        "tooLong": {
          "type": "string"
        },
        "tooShort": {
          "type": "string"
        }
      },
      "required": [
        "autoGenerate",
        "imageAutoGenerationTip",
        "bestPractices",
        "lengthTipTitle",
        "lengthTipDescription",
        "good",
        "tooLong",
        "tooShort",
        "almostThere",
        "characterCount",
        "charactersToGo",
        "charactersLeftOver",
        "charactersTooMany",
        "noImage",
        "checksPassing",
        "preview",
        "previewDescription",
        "missing"
      ]
    }
  },
  "required": ["plugin-seo"]
}
```

--------------------------------------------------------------------------------

---[FILE: uk.ts]---
Location: payload-main/packages/plugin-seo/src/translations/uk.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const uk: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Ще трошки',
    autoGenerate: 'Згенерувати',
    bestPractices: 'найкращі практики',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} символів, ',
    charactersLeftOver: 'залишилось {{characters}} символів',
    charactersToGo: ' на {{characters}} символів коротше',
    charactersTooMany: 'на {{characters}} символів довше',
    checksPassing: '{{current}}/{{max}} перевірок пройдено',
    good: 'Чудово',
    imageAutoGenerationTip: 'Автоматична генерація використає зображення з головного блоку',
    lengthTipDescription:
      'Має бути від {{minLength}} до {{maxLength}} символів. Щоб дізнатися, як писати якісні метаописи — перегляньте ',
    lengthTipTitle:
      'Має бути від {{minLength}} до {{maxLength}} символів. Щоб дізнатися, як писати якісні метазаголовки — перегляньте ',
    missing: 'Відсутнє',
    noImage: 'Немає зображення',
    preview: 'Попередній перегляд',
    previewDescription:
      'Реальне відображення може відрізнятися в залежності від вмісту та релевантності пошуку.',
    tooLong: 'Задовгий',
    tooShort: 'Закороткий',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: vi.ts]---
Location: payload-main/packages/plugin-seo/src/translations/vi.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const vi: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Gần đạt',
    autoGenerate: 'Tự động tạo',
    bestPractices: 'các phương pháp hay nhất',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} kí tự, ',
    charactersLeftOver: 'còn lại {{characters}}',
    charactersToGo: 'Còn {{characters}} ký tự nữa',
    charactersTooMany: 'vượt quá {{characters}} ký tự',
    checksPassing: '{{current}}/{{max}} đã đạt',
    good: 'Tốt',
    imageAutoGenerationTip: 'Tính năng tự động tạo sẽ lấy ảnh đầu tiên được chọn.',
    lengthTipDescription:
      'Độ dài nên từ {{minLength}}-{{maxLength}} kí tự. Để được hướng dẫn viết mô tả meta chất lượng, hãy xem ',
    lengthTipTitle:
      'Độ dài nên từ {{minLength}}-{{maxLength}} kí tự. Để được hướng dẫn viết mô tả meta chất lượng, hãy xem ',
    missing: 'Không đạt',
    noImage: 'Chưa có ảnh',
    preview: 'Xem trước',
    previewDescription: 'Kết quả hiển thị có thể thay đổi tuỳ theo nội dung và công cụ tìm kiếm.',
    tooLong: 'Quá dài',
    tooShort: 'Quá ngắn',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: zh.ts]---
Location: payload-main/packages/plugin-seo/src/translations/zh.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const zh: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: '快完成了',
    autoGenerate: '自动生成',
    bestPractices: '最佳实践',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} 字符, ',
    charactersLeftOver: '{{characters}} 字符剩余',
    charactersToGo: '{{characters}} 字符待输入',
    charactersTooMany: '{{characters}} 字符太多',
    checksPassing: '{{current}}/{{max}} 检查通过',
    good: '好',
    imageAutoGenerationTip: '自动生成将获取选定的主图像。',
    lengthTipDescription:
      '此文本应介于 {{minLength}} 和 {{maxLength}} 个字符之间。如需有关编写高质量 meta 描述的帮助，请参见 ',
    lengthTipTitle:
      '此文本应介于 {{minLength}} 和 {{maxLength}} 个字符之间。如需有关编写高质量 meta 标题的帮助，请参见 ',
    missing: '缺失',
    noImage: '没有图片',
    preview: '预览',
    previewDescription: '实际搜索结果可能会根据内容和搜索相关性有所不同。',
    tooLong: '太长',
    tooShort: '太短',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: zhTw.ts]---
Location: payload-main/packages/plugin-seo/src/translations/zhTw.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const zhTw: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: '快完成了',
    autoGenerate: '自動產生',
    bestPractices: '最佳做法',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} 字元，',
    charactersLeftOver: '多出 {{characters}} 個字元',
    charactersToGo: '還差 {{characters}} 個字元',
    charactersTooMany: '超出 {{characters}} 個字元',
    checksPassing: '{{current}} 項檢查通過，共 {{max}} 項',
    good: '良好',
    imageAutoGenerationTip: '系統會自動擷取選取的主圖。',
    lengthTipDescription:
      '長度應介於 {{minLength}} 到 {{maxLength}} 個字元。若需撰寫高品質後設資料描述的協助，請參閱',
    lengthTipTitle:
      '長度應介於 {{minLength}} 到 {{maxLength}} 個字元。若需撰寫高品質後設資料標題的協助，請參閱',
    missing: '尚未設定',
    noImage: '沒有圖片',
    preview: '預覽',
    previewDescription: '實際搜尋結果可能會因內容與關聯性而有所不同。',
    tooLong: '過長',
    tooShort: '過短',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: LengthIndicator.tsx]---
Location: payload-main/packages/plugin-seo/src/ui/LengthIndicator.tsx
Signals: React

```typescript
'use client'

import { useTranslation } from '@payloadcms/ui'
import React, { Fragment, useEffect, useState } from 'react'

import type { PluginSEOTranslationKeys, PluginSEOTranslations } from '../translations/index.js'

import { Pill } from './Pill.js'

export const LengthIndicator: React.FC<{
  maxLength?: number
  minLength?: number
  text?: string
}> = (props) => {
  const { maxLength = 0, minLength = 0, text } = props

  const [labelStyle, setLabelStyle] = useState({
    backgroundColor: '',
    color: '',
  })

  const [label, setLabel] = useState('')
  const [barWidth, setBarWidth] = useState<number>(0)
  const { t } = useTranslation<PluginSEOTranslations, PluginSEOTranslationKeys>()

  useEffect(() => {
    const textLength = text?.length || 0

    if (textLength === 0) {
      setLabel(t('plugin-seo:missing'))
      setLabelStyle({
        backgroundColor: 'red',
        color: 'white',
      })
      setBarWidth(0)
    } else {
      const progress = (textLength - minLength) / (maxLength - minLength)

      if (progress < 0) {
        const ratioUntilMin = textLength / minLength

        if (ratioUntilMin > 0.9) {
          setLabel(t('plugin-seo:almostThere'))
          setLabelStyle({
            backgroundColor: 'orange',
            color: 'white',
          })
        } else {
          setLabel(t('plugin-seo:tooShort'))
          setLabelStyle({
            backgroundColor: 'orangered',
            color: 'white',
          })
        }

        setBarWidth(ratioUntilMin)
      }

      if (progress >= 0 && progress <= 1) {
        setLabel(t('plugin-seo:good'))
        setLabelStyle({
          backgroundColor: 'green',
          color: 'white',
        })
        setBarWidth(progress)
      }

      if (progress > 1) {
        setLabel(t('plugin-seo:tooLong'))
        setLabelStyle({
          backgroundColor: 'red',
          color: 'white',
        })
        setBarWidth(1)
      }
    }
  }, [minLength, maxLength, text, t])

  const textLength = text?.length || 0

  const charsUntilMax = maxLength - textLength
  const charsUntilMin = minLength - textLength

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        width: '100%',
      }}
    >
      <Pill backgroundColor={labelStyle.backgroundColor} color={labelStyle.color} label={label} />
      <div
        style={{
          flexShrink: 0,
          lineHeight: 1,
          marginRight: '10px',
          whiteSpace: 'nowrap',
        }}
      >
        <small>
          {t('plugin-seo:characterCount', { current: text?.length || 0, maxLength, minLength })}
          {(textLength === 0 || charsUntilMin > 0) && (
            <Fragment>{t('plugin-seo:charactersToGo', { characters: charsUntilMin })}</Fragment>
          )}
          {charsUntilMin <= 0 && charsUntilMax >= 0 && (
            <Fragment>{t('plugin-seo:charactersLeftOver', { characters: charsUntilMax })}</Fragment>
          )}
          {charsUntilMax < 0 && (
            <Fragment>
              {t('plugin-seo:charactersTooMany', { characters: charsUntilMax * -1 })}
            </Fragment>
          )}
        </small>
      </div>
      <div
        style={{
          backgroundColor: '#F3F3F3',
          height: '2px',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: labelStyle.backgroundColor,
            height: '100%',
            left: 0,
            position: 'absolute',
            top: 0,
            width: `${barWidth * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Pill.tsx]---
Location: payload-main/packages/plugin-seo/src/ui/Pill.tsx
Signals: React

```typescript
'use client'

import React from 'react'

export const Pill: React.FC<{
  backgroundColor: string
  color: string
  label: string
}> = (props) => {
  const { backgroundColor, color, label } = props

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: '2px',
        color,
        flexShrink: 0,
        lineHeight: 1,
        marginRight: '10px',
        padding: '4px 6px',
        whiteSpace: 'nowrap',
      }}
    >
      <small>{label}</small>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-stripe/.gitignore

```text
node_modules
.env
dist
demo/uploads
build
.DS_Store
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-stripe/.prettierignore

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
Location: payload-main/packages/plugin-stripe/.swcrc

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

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-stripe/LICENSE.md

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
Location: payload-main/packages/plugin-stripe/package.json
Signals: React, Next.js

```json
{
  "name": "@payloadcms/plugin-stripe",
  "version": "3.68.5",
  "description": "Stripe plugin for Payload",
  "keywords": [
    "payload",
    "stripe",
    "cms",
    "plugin",
    "typescript",
    "payments",
    "saas",
    "subscriptions",
    "licensing"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/payloadcms/payload.git",
    "directory": "packages/plugin-stripe"
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
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./types": {
      "import": "./src/exports/types.ts",
      "types": "./src/exports/types.ts",
      "default": "./src/exports/types.ts"
    },
    "./client": {
      "import": "./src/exports/client.ts",
      "types": "./src/exports/client.ts",
      "default": "./src/exports/client.ts"
    }
  },
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "pnpm copyfiles && pnpm build:types && pnpm build:swc",
    "build:debug": "pnpm build",
    "build:swc": "swc ./src -d ./dist --config-file .swcrc --strip-leading-paths",
    "build:types": "tsc --emitDeclarationOnly --outDir dist",
    "clean": "rimraf -g {dist,*.tsbuildinfo}",
    "copyfiles": "copyfiles -u 1 \"src/**/*.{html,css,scss,ttf,woff,woff2,eot,svg,jpg,png,json}\" dist/",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "@payloadcms/translations": "workspace:*",
    "@payloadcms/ui": "workspace:*",
    "lodash.get": "^4.4.2",
    "stripe": "^10.2.0",
    "uuid": "10.0.0"
  },
  "devDependencies": {
    "@payloadcms/eslint-config": "workspace:*",
    "@payloadcms/next": "workspace:*",
    "@types/lodash.get": "^4.4.7",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
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
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "./types": {
        "import": "./dist/exports/types.js",
        "types": "./dist/exports/types.d.ts",
        "default": "./dist/exports/types.js"
      },
      "./client": {
        "import": "./dist/exports/client.js",
        "types": "./dist/exports/client.d.ts",
        "default": "./dist/exports/client.js"
      }
    },
    "main": "./dist/index.js",
    "registry": "https://registry.npmjs.org/",
    "types": "./dist/index.d.ts"
  },
  "homepage:": "https://payloadcms.com"
}
```

--------------------------------------------------------------------------------

---[FILE: payload-stripe-plugin.postman_collection.json]---
Location: payload-main/packages/plugin-stripe/payload-stripe-plugin.postman_collection.json

```json
{
  "info": {
    "name": "Payload Stripe Plugin",
    "_exporter_id": "4309346",
    "_postman_id": "130686e1-ddd9-40f1-b031-68ec1a6413ee",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Subscriptions",
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n    \"stripeMethod\": \"subscriptions.list\",\n    \"stripeArgs\": {\n        \"customer\": \"cus_MGgt3Tuj3D66f2\"\n    }\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "stripe", "rest"],
          "port": "3000",
          "raw": "localhost:3000/api/stripe/rest"
        }
      },
      "response": []
    },
    {
      "name": "Get All Products",
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n    \"stripeMethod\": \"products.list\",\n    \"stripeArgs\": [{\n        \"limit\": 100\n    }]\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "stripe", "rest"],
          "port": "3000",
          "raw": "localhost:3000/api/stripe/rest"
        }
      },
      "response": []
    },
    {
      "name": "Get Product",
      "protocolProfileBehavior": {
        "disableBodyPruning": true
      },
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n    \"stripeMethod\": \"subscriptions.list\",\n    \"stripeArgs\": {\n        \"customer\": \"cus_MGgt3Tuj3D66f2\"\n    }\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "GET",
        "url": {
          "host": ["localhost"],
          "path": ["api", "products", "6344664c003348299a226249"],
          "port": "3000",
          "raw": "localhost:3000/api/products/6344664c003348299a226249"
        }
      },
      "response": []
    },
    {
      "name": "Update Product",
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n   \"name\": \"Reactions\",\n    \"price\": {\n        \"stripePriceID\": \"price_1LXXU9H77M76aDnomGU5iIZu\"\n    },\n    \"stripeID\": \"prod_MG3bPl2yQGQK4x\",\n    \"skipSync\": true\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "PATCH",
        "url": {
          "host": ["localhost"],
          "path": ["api", "products", "6344664c003348299a226249"],
          "port": "3000",
          "raw": "localhost:3000/api/products/6344664c003348299a226249"
        }
      },
      "response": []
    },
    {
      "name": "Create Product",
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n   \"name\": \"Test\",\n    \"price\": {\n        \"stripePriceID\": \"price_1LXXU9H77M76aDnomGU5iIZu\"\n    },\n    \"stripeID\": \"prod_MG3bPl2yQGQK4x\",\n    \"skipSync\": true\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "products"],
          "port": "3000",
          "raw": "localhost:3000/api/products"
        }
      },
      "response": []
    },
    {
      "name": "Create Stripe Customer",
      "request": {
        "body": {
          "mode": "raw",
          "raw": "{\n    \"stripeMethod\": \"customers.create\",\n    \"stripeArgs\": {\n        \"email\": \"cta@hulu.com\",\n        \"name\": \"Hulu\"\n    }\n}"
        },
        "header": [
          {
            "key": "Content-Type",
            "type": "text",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "type": "text",
            "value": "JWT {{PAYLOAD_API_TOKEN}}"
          }
        ],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "stripe", "rest"],
          "port": "3000",
          "raw": "localhost:3000/api/stripe/rest"
        }
      },
      "response": []
    },
    {
      "name": "Login",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "let jsonData = pm.response.json();",
              "pm.environment.set(\"PAYLOAD_API_TOKEN\", jsonData.token);"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "request": {
        "body": {
          "mode": "raw",
          "options": {
            "raw": {
              "language": "json"
            }
          },
          "raw": "{\n\t\"email\": \"jacob@trbl.design\",\n\t\"password\": \"test\"\n}"
        },
        "description": "\t",
        "header": [
          {
            "disabled": true,
            "key": "Authorization",
            "value": ""
          }
        ],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "users", "login"],
          "port": "3000",
          "raw": "localhost:3000/api/users/login"
        }
      },
      "response": []
    },
    {
      "name": "Refresh Token",
      "protocolProfileBehavior": {
        "disabledSystemHeaders": {}
      },
      "request": {
        "body": {
          "mode": "raw",
          "options": {
            "raw": {
              "language": "json"
            }
          },
          "raw": "{\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphY29ic2ZsZXRjaEBnbWFpbC5jb20iLCJpZCI6IjYwODJlZjUxMzg5ZmM2MmYzNWI2MmM2ZiIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImZpcnN0TmFtZSI6IkphY29iIiwibGFzdE5hbWUiOiJGbGV0Y2hlciIsIm9yZ2FuaXphdGlvbiI6IjYwN2RiNGNmYjYzMGIyNWI5YzkzNmMzNSIsImlhdCI6MTYzMTExMDk3NSwiZXhwIjoxNjMyOTI1Mzc1fQ.OL9l8jFNaCZCU-ZDQpH-EJauaRM-5JT4_Y3J_-aC-aY\"\n}"
        },
        "header": [],
        "method": "POST",
        "url": {
          "host": ["localhost"],
          "path": ["api", "users", "refresh-token"],
          "port": "3000",
          "raw": "localhost:3000/api/users/refresh-token"
        }
      },
      "response": []
    },
    {
      "name": "Me",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "let jsonData = pm.response.json();",
              "pm.environment.set(\"PAYLOAD_API_TOKEN\", jsonData.token);"
            ],
            "type": "text/javascript"
          }
        }
      ],
      "protocolProfileBehavior": {
        "disableBodyPruning": true
      },
      "request": {
        "body": {
          "mode": "raw",
          "raw": ""
        },
        "description": "\t",
        "header": [
          {
            "disabled": true,
            "key": "Authorization",
            "value": ""
          }
        ],
        "method": "GET",
        "url": {
          "host": ["localhost"],
          "path": ["api", "users", "me"],
          "port": "3000",
          "query": [
            {
              "key": "depth",
              "value": "1"
            }
          ],
          "raw": "localhost:3000/api/users/me?depth=1"
        }
      },
      "response": []
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: README.md]---
Location: payload-main/packages/plugin-stripe/README.md

```text
# Payload Stripe Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to connect [Stripe](https://stripe.com) and Payload.

- [Source code](https://github.com/payloadcms/payload/tree/main/packages/plugin-stripe)
- [Documentation](https://payloadcms.com/docs/plugins/stripe)
- [Documentation source](https://github.com/payloadcms/payload/tree/main/docs/plugins/stripe.mdx)
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/packages/plugin-stripe/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../../tsconfig.base.json",
  "references": [{ "path": "../payload" }, { "path": "../ui" }, { "path": "../next" }]
}
```

--------------------------------------------------------------------------------

---[FILE: admin.ts]---
Location: payload-main/packages/plugin-stripe/src/admin.ts

```typescript
import type { Config } from 'payload'

import type { SanitizedStripePluginConfig, StripePluginConfig } from './types.js'

import { getFields } from './fields/getFields.js'

export const stripePlugin =
  (incomingPluginConfig: StripePluginConfig) =>
  (config: Config): Config => {
    const { collections } = config

    // set config defaults here
    const pluginConfig: SanitizedStripePluginConfig = {
      ...incomingPluginConfig,
      // TODO: in the next major version, default this to `false`
      rest: incomingPluginConfig?.rest ?? true,
      sync: incomingPluginConfig?.sync || [],
    }

    // NOTE: env variables are never passed to the client, but we need to know if `stripeSecretKey` is a test key
    // unfortunately we must set the 'isTestKey' property on the config instead of using the following code:
    // const isTestKey = stripeConfig.stripeSecretKey?.startsWith('sk_test_');

    return {
      ...config,
      collections: collections?.map((collection) => {
        const syncConfig = pluginConfig.sync?.find((sync) => sync.collection === collection.slug)

        if (syncConfig) {
          const fields = getFields({
            collection,
            pluginConfig,
            syncConfig,
          })
          return {
            ...collection,
            fields,
          }
        }

        return collection
      }),
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-stripe/src/index.ts

```typescript
import type { Config, Endpoint } from 'payload'

import type { SanitizedStripePluginConfig, StripePluginConfig } from './types.js'

import { getFields } from './fields/getFields.js'
import { createNewInStripe } from './hooks/createNewInStripe.js'
import { deleteFromStripe } from './hooks/deleteFromStripe.js'
import { syncExistingWithStripe } from './hooks/syncExistingWithStripe.js'
import { stripeREST } from './routes/rest.js'
import { stripeWebhooks } from './routes/webhooks.js'

export { stripeProxy } from './utilities/stripeProxy.js'

export const stripePlugin =
  (incomingStripeConfig: StripePluginConfig) =>
  (config: Config): Config => {
    const { collections } = config

    // set config defaults here
    const pluginConfig: SanitizedStripePluginConfig = {
      ...incomingStripeConfig,
      rest: incomingStripeConfig?.rest ?? false,
      sync: incomingStripeConfig?.sync || [],
    }

    // NOTE: env variables are never passed to the client, but we need to know if `stripeSecretKey` is a test key
    // unfortunately we must set the 'isTestKey' property on the config instead of using the following code:
    // const isTestKey = stripeConfig.stripeSecretKey?.startsWith('sk_test_');

    const endpoints: Endpoint[] = [
      ...(config?.endpoints || []),
      {
        handler: async (req) => {
          const res = await stripeWebhooks({
            config,
            pluginConfig,
            req,
          })

          return res
        },
        method: 'post',
        path: '/stripe/webhooks',
      },
    ]

    if (incomingStripeConfig?.rest) {
      endpoints.push({
        handler: async (req) => {
          const res = await stripeREST({
            pluginConfig,
            req,
          })

          return res
        },
        method: 'post' as Endpoint['method'],
        path: '/stripe/rest',
      })
    }

    for (const collection of collections!) {
      const { hooks: existingHooks } = collection

      const syncConfig = pluginConfig.sync?.find((sync) => sync.collection === collection.slug)

      if (!syncConfig) {
        continue
      }
      const fields = getFields({
        collection,
        pluginConfig,
        syncConfig,
      })
      collection.fields = fields

      if (!collection.hooks) {
        collection.hooks = {}
      }

      collection.hooks.afterDelete = [
        ...(existingHooks?.afterDelete || []),
        (args) =>
          deleteFromStripe({
            ...args,
            collection,
            pluginConfig,
          }),
      ]
      collection.hooks.beforeChange = [
        ...(existingHooks?.beforeChange || []),
        (args) =>
          syncExistingWithStripe({
            ...args,
            collection,
            pluginConfig,
          }),
      ]
      collection.hooks.beforeValidate = [
        ...(existingHooks?.beforeValidate || []),
        (args) =>
          createNewInStripe({
            ...args,
            collection,
            pluginConfig,
          }),
      ]
    }

    config.endpoints = endpoints

    return config
  }
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-stripe/src/types.ts

```typescript
import type { CollectionSlug, Payload, Config as PayloadConfig, PayloadRequest } from 'payload'
import type Stripe from 'stripe'

export type StripeWebhookHandler<T = any> = (args: {
  config: PayloadConfig
  event: T
  payload: Payload
  pluginConfig?: StripePluginConfig
  req: PayloadRequest
  stripe: Stripe
}) => Promise<void> | void

export type StripeWebhookHandlers = {
  [webhookName: string]: StripeWebhookHandler
}

export type FieldSyncConfig = {
  fieldPath: string
  stripeProperty: string
}

export type SyncConfig = {
  collection: CollectionSlug
  fields: FieldSyncConfig[]
  stripeResourceType: 'customers' | 'products' // TODO: get this from Stripe types
  stripeResourceTypeSingular: 'customer' | 'product' // TODO: there must be a better way to do this
}

export type StripePluginConfig = {
  isTestKey?: boolean
  logs?: boolean
  /** @default false */
  rest?: boolean
  stripeSecretKey: string
  stripeWebhooksEndpointSecret?: string
  sync?: SyncConfig[]
  webhooks?: StripeWebhookHandler | StripeWebhookHandlers
}

export type SanitizedStripePluginConfig = {
  sync: SyncConfig[] // convert to required
} & StripePluginConfig

export type StripeProxy = (args: {
  stripeArgs: any[]
  stripeMethod: string
  stripeSecretKey: string
}) => Promise<{
  data?: any
  message?: string
  status: number
}>
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/plugin-stripe/src/exports/client.ts

```typescript
'use client'

export { LinkToDoc } from '../ui/LinkToDoc.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-stripe/src/exports/types.ts

```typescript
export type {
  FieldSyncConfig,
  SanitizedStripePluginConfig,
  StripePluginConfig,
  StripeProxy,
  StripeWebhookHandler,
  StripeWebhookHandlers,
  SyncConfig,
} from '../types.js'
```

--------------------------------------------------------------------------------

---[FILE: getFields.ts]---
Location: payload-main/packages/plugin-stripe/src/fields/getFields.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { SanitizedStripePluginConfig } from '../types.js'

interface Args {
  collection: CollectionConfig
  pluginConfig: SanitizedStripePluginConfig
  syncConfig: {
    stripeResourceType: string
  }
}

export const getFields = ({ collection, pluginConfig, syncConfig }: Args): Field[] => {
  const stripeIDField: Field = {
    name: 'stripeID',
    type: 'text',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    label: 'Stripe ID',
    saveToJWT: true,
  }

  const skipSyncField: Field = {
    name: 'skipSync',
    type: 'checkbox',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    label: 'Skip Sync',
  }

  const docUrlField: Field = {
    name: 'docUrl',
    type: 'ui',
    admin: {
      components: {
        Field: '@payloadcms/plugin-stripe/client#LinkToDoc',
      },
      custom: {
        isTestKey: pluginConfig.isTestKey,
        nameOfIDField: 'stripeID',
        stripeResourceType: syncConfig.stripeResourceType,
      },
      position: 'sidebar',
    },
  }

  const fields = [...collection.fields, stripeIDField, skipSyncField, docUrlField]

  return fields
}
```

--------------------------------------------------------------------------------

````
