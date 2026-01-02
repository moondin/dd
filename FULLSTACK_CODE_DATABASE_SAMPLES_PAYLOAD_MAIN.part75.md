---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 75
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 75 of 695)

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

---[FILE: README.md]---
Location: payload-main/examples/custom-components/README.md

```text
# Payload Custom Components Example

This example demonstrates how to use Custom Components in the [Payload](https://github.com/payloadcms/payload) Admin Panel. Custom components allow you to extend Payload by providing custom UI elements for fields, collections, and views. This example covers custom components for every field type available in Payload, including both server and client components.

## Quick Start

To spin up this example locally, follow the steps below:

1. Run the following command to create a project from the example:

- `npx create-payload-app --example custom-components`

2. Start the server:
   - Depending on your package manager, run `pnpm dev`, `yarn dev` or `npm run dev`
   - When prompted, type `y` then `enter` to seed the database with sample data
3. Access the application:
   - Open your browser and navigate to `http://localhost:3000` to access the homepage.
   - Open `http://localhost:3000/admin` to access the admin panel.
4. Login:

- Use the following credentials to log into the admin panel:
  > `Email: demo@payloadcms.com` > `Password: demo`

## How it works

### Collections

[Collections](https://payloadcms.com/docs/configuration/collections) in Payload allow you to define structured content types. This example includes multiple collections, with a focus on:

- #### Users

  The `users` collection is **auth-enabled**, providing access to the admin panel and enabling user authentication. This collection shows how to implement a basic user collection with authentication.

  - For more details on setting up authentication, checkout the [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) and the [Authentication Overview](https://payloadcms.com/docs/authentication/overview#authentication-overview).

- #### Fields

  The `fields` collection demonstrates all the **field types** available in Payload, each one configured with custom components. This includes every available "slot" for custom components (e.g., `admin.components.Field`, `admin.components.Label`, `admin.components.Input`, etc.). For each field type, two examples are provided: one using **server-side components** and the other using **client-side components**. This pattern illustrates how to customize both types of components across different field types.

  - **Custom Field Components**: Custom components allow you to tailor the UI and behavior of the admin panel fields. This can be useful for implementing complex interactions, custom validation, or UI enhancements. For example, you might use a custom component to replace a simple text input with a date picker or a rich text editor.

- #### Views

  The `views` collection demonstrates how to create **collection-level views**, such as custom tabs or layout configurations. This is where you can modify how data is displayed in the admin panel beyond the default list and edit views. Custom views give you full control over how content is presented to users.

- #### Root Views

  The `root-views` collection shows how to implement **root-level views** in the admin panel. These views can be used to modify the global admin interface, adding custom sections or settings that appear outside of collections.

## Troubleshooting

If you encounter any issues during setup or while running the example, here are a few things to try:

- **Missing dependencies**: If you see errors related to missing packages, try deleting the `node_modules` folder and the lockfile (`package-lock.json` or `pnpm-lock.yaml`), then rerun `npm install` or `pnpm i`.

- **Port conflicts**: If the development server isn't starting, ensure that port `3000` isn't being used by another process. You can change the port by modifying the `package.json` file or setting the `PORT` environment variable.

- **Seed data issues**: If the database seeding fails, try clearing the database and then rerun the seeding process.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

For more detailed documentation on how to extend and customize Payload, check out the full [Payload documentation](https://payloadcms.com/docs).
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/examples/custom-components/tsconfig.json
Signals: Next.js

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2022"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@payload-config": [
        "src/payload.config.ts"
      ],
      "@payload-types": [
        "src/payload-types.ts"
      ]
    },
    "target": "ES2022",
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/examples/custom-components/src/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    'custom-fields': CustomField;
    'custom-views': CustomView;
    'custom-root-views': CustomRootView;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    'custom-fields': CustomFieldsSelect<false> | CustomFieldsSelect<true>;
    'custom-views': CustomViewsSelect<false> | CustomViewsSelect<true>;
    'custom-root-views': CustomRootViewsSelect<false> | CustomRootViewsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-fields".
 */
export interface CustomField {
  id: string;
  title?: string | null;
  arrayFieldServerComponent?:
    | {
        title?: string | null;
        id?: string | null;
      }[]
    | null;
  arrayFieldClientComponent?:
    | {
        title?: string | null;
        id?: string | null;
      }[]
    | null;
  blocksFieldServerComponent?:
    | {
        content?: string | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'text';
      }[]
    | null;
  blocksFieldClientComponent?:
    | {
        content?: string | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'text';
      }[]
    | null;
  checkboxFieldServerComponent?: boolean | null;
  checkboxFieldClientComponent?: boolean | null;
  codeFieldServerComponent?: string | null;
  codeFieldClientComponent?: string | null;
  dateFieldServerComponent?: string | null;
  dateFieldClientComponent?: string | null;
  emailFieldServerComponent?: string | null;
  emailFieldClientComponent?: string | null;
  jsonFieldServerComponent?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  jsonFieldClientComponent?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  numberFieldServerComponent?: number | null;
  numberFieldClientComponent?: number | null;
  /**
   * @minItems 2
   * @maxItems 2
   */
  pointFieldServerComponent?: [number, number] | null;
  /**
   * @minItems 2
   * @maxItems 2
   */
  pointFieldClientComponent?: [number, number] | null;
  radioFieldServerComponent?: ('option-1' | 'option-2') | null;
  radioFieldClientComponent?: ('option-1' | 'option-2') | null;
  relationshipFieldServerComponent?: (string | null) | CustomField;
  relationshipFieldClientComponent?: (string | null) | CustomField;
  selectFieldServerComponent?: ('option-1' | 'option-2' | 'option-3') | null;
  selectFieldClientComponent?: ('option-1' | 'option-2' | 'option-3') | null;
  textFieldServerComponent?: string | null;
  textFieldClientComponent?: string | null;
  textareaFieldServerComponent?: string | null;
  textareaFieldClientComponent?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-views".
 */
export interface CustomView {
  id: string;
  title?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-root-views".
 */
export interface CustomRootView {
  id: string;
  title?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'custom-fields';
        value: string | CustomField;
      } | null)
    | ({
        relationTo: 'custom-views';
        value: string | CustomView;
      } | null)
    | ({
        relationTo: 'custom-root-views';
        value: string | CustomRootView;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-fields_select".
 */
export interface CustomFieldsSelect<T extends boolean = true> {
  title?: T;
  arrayFieldServerComponent?:
    | T
    | {
        title?: T;
        id?: T;
      };
  arrayFieldClientComponent?:
    | T
    | {
        title?: T;
        id?: T;
      };
  blocksFieldServerComponent?:
    | T
    | {
        text?:
          | T
          | {
              content?: T;
              id?: T;
              blockName?: T;
            };
      };
  blocksFieldClientComponent?:
    | T
    | {
        text?:
          | T
          | {
              content?: T;
              id?: T;
              blockName?: T;
            };
      };
  checkboxFieldServerComponent?: T;
  checkboxFieldClientComponent?: T;
  codeFieldServerComponent?: T;
  codeFieldClientComponent?: T;
  dateFieldServerComponent?: T;
  dateFieldClientComponent?: T;
  emailFieldServerComponent?: T;
  emailFieldClientComponent?: T;
  jsonFieldServerComponent?: T;
  jsonFieldClientComponent?: T;
  numberFieldServerComponent?: T;
  numberFieldClientComponent?: T;
  pointFieldServerComponent?: T;
  pointFieldClientComponent?: T;
  radioFieldServerComponent?: T;
  radioFieldClientComponent?: T;
  relationshipFieldServerComponent?: T;
  relationshipFieldClientComponent?: T;
  selectFieldServerComponent?: T;
  selectFieldClientComponent?: T;
  textFieldServerComponent?: T;
  textFieldClientComponent?: T;
  textareaFieldServerComponent?: T;
  textareaFieldClientComponent?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-views_select".
 */
export interface CustomViewsSelect<T extends boolean = true> {
  title?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "custom-root-views_select".
 */
export interface CustomRootViewsSelect<T extends boolean = true> {
  title?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: payload.config.ts]---
Location: payload-main/examples/custom-components/src/payload.config.ts

```typescript
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { CustomFields } from './collections/Fields'
import { CustomRootViews } from './collections/RootViews'
import { CustomViews } from './collections/Views'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfig({
  admin: {
    components: {
      afterNavLinks: [
        '@/components/afterNavLinks/LinkToCustomView#LinkToCustomView',
        '@/components/afterNavLinks/LinkToCustomMinimalView#LinkToCustomMinimalView',
        '@/components/afterNavLinks/LinkToCustomDefaultView#LinkToCustomDefaultView',
      ],
      views: {
        CustomRootView: {
          Component: '@/components/views/CustomRootView#CustomRootView',
          path: '/custom',
        },
        DefaultCustomView: {
          Component: '@/components/views/CustomDefaultRootView#CustomDefaultRootView',
          path: '/custom-default',
        },
        MinimalCustomView: {
          Component: '@/components/views/CustomMinimalRootView#CustomMinimalRootView',
          path: '/custom-minimal',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [CustomFields, CustomViews, CustomRootViews],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  editor: lexicalEditor({}),
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/examples/custom-components/src/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import '@payloadcms/next/css'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: importMap.js]---
Location: payload-main/examples/custom-components/src/app/(payload)/admin/importMap.js

```javascript
import { CustomArrayFieldLabelServer as CustomArrayFieldLabelServer_f8d063e9b7f25c350451c1865199c947 } from '@/collections/Fields/array/components/server/Label'
import { CustomArrayFieldServer as CustomArrayFieldServer_4c3c139a9b1a198103c8a2ec2869c837 } from '@/collections/Fields/array/components/server/Field'
import { CustomArrayFieldLabelClient as CustomArrayFieldLabelClient_c07dc2c547c47aca8e9f471795279e9d } from '@/collections/Fields/array/components/client/Label'
import { CustomArrayFieldClient as CustomArrayFieldClient_60ede271f2b85983daf36710010ad8ab } from '@/collections/Fields/array/components/client/Field'
import { CustomBlocksFieldServer as CustomBlocksFieldServer_61732537ad2c492ac9938959902f6954 } from '@/collections/Fields/blocks/components/server/Field'
import { CustomBlocksFieldClient as CustomBlocksFieldClient_2ef3a03de3974b6f18f07623af0cd515 } from '@/collections/Fields/blocks/components/client/Field'
import { CustomCheckboxFieldLabelServer as CustomCheckboxFieldLabelServer_48cd2d9639f54745ad4cdb6905c825d9 } from '@/collections/Fields/checkbox/components/server/Label'
import { CustomCheckboxFieldServer as CustomCheckboxFieldServer_85023d60242dd4cca7c406a728ec37a8 } from '@/collections/Fields/checkbox/components/server/Field'
import { CustomCheckboxFieldLabelClient as CustomCheckboxFieldLabelClient_f2b214145c1cbe98957573cf62455194 } from '@/collections/Fields/checkbox/components/client/Label'
import { CustomCheckboxFieldClient as CustomCheckboxFieldClient_a13e6003bc89da826df764d7234782de } from '@/collections/Fields/checkbox/components/client/Field'
import { CustomCodeFieldLabelServer as CustomCodeFieldLabelServer_566aaa8491895af5900235f95e62c2cf } from '@/collections/Fields/code/components/server/Label'
import { CustomCodeFieldServer as CustomCodeFieldServer_e76f292770f788ad4ec46a180ab3c174 } from '@/collections/Fields/code/components/server/Field'
import { CustomCodeFieldLabelClient as CustomCodeFieldLabelClient_823b02f23d594204cfa7fcfc30aeed46 } from '@/collections/Fields/code/components/client/Label'
import { CustomCodeFieldClient as CustomCodeFieldClient_2ef913b825e7bb326ec86b0f6ea4dd3c } from '@/collections/Fields/code/components/client/Field'
import { CustomDateFieldLabelServer as CustomDateFieldLabelServer_ae9eb459b79a1363a40d62b1e463aa6b } from '@/collections/Fields/date/components/server/Label'
import { CustomDateFieldServer as CustomDateFieldServer_9d448604d99b3b06826ea95986ffd27b } from '@/collections/Fields/date/components/server/Field'
import { CustomDateFieldLabelClient as CustomDateFieldLabelClient_0b6c1439c63aadfd306cf432713a52d8 } from '@/collections/Fields/date/components/client/Label'
import { CustomDateFieldClient as CustomDateFieldClient_4ef537c727f5de7c26aaea94024a0b2c } from '@/collections/Fields/date/components/client/Field'
import { CustomEmailFieldLabelServer as CustomEmailFieldLabelServer_a5097abb06efbe71fc6ba1636f7194ab } from '@/collections/Fields/email/components/server/Label'
import { CustomEmailFieldServer as CustomEmailFieldServer_457ae84519701bf0b287c30a994ddab1 } from '@/collections/Fields/email/components/server/Field'
import { CustomEmailFieldLabelClient as CustomEmailFieldLabelClient_147edabdb378c855b9c8c06b8c627e50 } from '@/collections/Fields/email/components/client/Label'
import { CustomEmailFieldClient as CustomEmailFieldClient_e22bcec891915f255e5ac6e1850aeb97 } from '@/collections/Fields/email/components/client/Field'
import { CustomJSONFieldLabelServer as CustomJSONFieldLabelServer_94d8c8f7c699cb282fb912bead88f8b6 } from '@/collections/Fields/json/components/server/Label'
import { CustomJSONFieldServer as CustomJSONFieldServer_6034ebd8b071080c9e06e4abab7a6fd2 } from '@/collections/Fields/json/components/server/Field'
import { CustomJSONFieldLabelClient as CustomJSONFieldLabelClient_16798ccfd3eb2cb009c4f0ea34c3c31e } from '@/collections/Fields/json/components/client/Label'
import { CustomJSONFieldClient as CustomJSONFieldClient_077b2498f1ebe1df34940ffc4ce4f8e6 } from '@/collections/Fields/json/components/client/Field'
import { CustomNumberFieldLabelServer as CustomNumberFieldLabelServer_1b47d0cd70ad88e23dcf9c4f91bf319f } from '@/collections/Fields/number/components/server/Label'
import { CustomNumberFieldServer as CustomNumberFieldServer_54fc6ad95d89a3b66b59136e84d20b86 } from '@/collections/Fields/number/components/server/Field'
import { CustomNumberFieldLabelClient as CustomNumberFieldLabelClient_dd3e3dcfc7b07c3a02f947ac81718a51 } from '@/collections/Fields/number/components/client/Label'
import { CustomNumberFieldClient as CustomNumberFieldClient_5d5605680426c77470fd74d010fe051f } from '@/collections/Fields/number/components/client/Field'
import { CustomPointFieldLabelServer as CustomPointFieldLabelServer_c5fb0c717f353a8c6149238dd7d92ec9 } from '@/collections/Fields/point/components/server/Label'
import { CustomPointFieldServer as CustomPointFieldServer_a23d13971ed0ff10615e3248bb1ee55d } from '@/collections/Fields/point/components/server/Field'
import { CustomPointFieldLabelClient as CustomPointFieldLabelClient_3c6c8c891bc098021e618d5cf4dc3150 } from '@/collections/Fields/point/components/client/Label'
import { CustomPointFieldClient as CustomPointFieldClient_abb4ee1633cbc83b4cec9b8abb95f132 } from '@/collections/Fields/point/components/client/Field'
import { CustomRadioFieldLabelServer as CustomRadioFieldLabelServer_5c732ac2af72bb41657cc9a1a22bc67b } from '@/collections/Fields/radio/components/server/Label'
import { CustomRadioFieldServer as CustomRadioFieldServer_b7edb363e225e2976a994da8e8803e60 } from '@/collections/Fields/radio/components/server/Field'
import { CustomRadioFieldLabelClient as CustomRadioFieldLabelClient_d46d0583023d87065f05972901727bbf } from '@/collections/Fields/radio/components/client/Label'
import { CustomRadioFieldClient as CustomRadioFieldClient_42845db96f999817cb9f0a590413d669 } from '@/collections/Fields/radio/components/client/Field'
import { CustomRelationshipFieldLabelServer as CustomRelationshipFieldLabelServer_7c45510caabe204587b638c40f0d0a70 } from '@/collections/Fields/relationship/components/server/Label'
import { CustomRelationshipFieldServer as CustomRelationshipFieldServer_d2e0b17d4b1c00b1fc726f0ea55ddc16 } from '@/collections/Fields/relationship/components/server/Field'
import { CustomRelationshipFieldLabelClient as CustomRelationshipFieldLabelClient_37b268226ded7dd38d5cb8f2952f4b3a } from '@/collections/Fields/relationship/components/client/Label'
import { CustomRelationshipFieldClient as CustomRelationshipFieldClient_eb1bc838beb92b05ba1bb9c1fdfd7869 } from '@/collections/Fields/relationship/components/client/Field'
import { CustomSelectFieldLabelServer as CustomSelectFieldLabelServer_653acab80b672fd4ebeeed757e09d4c9 } from '@/collections/Fields/select/components/server/Label'
import { CustomSelectFieldServer as CustomSelectFieldServer_ee886c859ef756c29ae7383a2be0a08a } from '@/collections/Fields/select/components/server/Field'
import { CustomSelectFieldLabelClient as CustomSelectFieldLabelClient_2db542ef2e0a664acaa5679fc14aa54b } from '@/collections/Fields/select/components/client/Label'
import { CustomSelectFieldClient as CustomSelectFieldClient_c8b4c7f3e98b5887ca262dd841bffa2f } from '@/collections/Fields/select/components/client/Field'
import { CustomTextFieldLabelServer as CustomTextFieldLabelServer_64a4b68861269d69d4c16a0f651b7ac9 } from '@/collections/Fields/text/components/server/Label'
import { CustomTextFieldServer as CustomTextFieldServer_e0caaef49c00003336b08d834c0c9fe9 } from '@/collections/Fields/text/components/server/Field'
import { CustomTextFieldLabelClient as CustomTextFieldLabelClient_9af2b9e4733a9fc79fb9dfb1578c18bf } from '@/collections/Fields/text/components/client/Label'
import { CustomTextFieldClient as CustomTextFieldClient_c7c0687b5204b201f8b1af831f34fd98 } from '@/collections/Fields/text/components/client/Field'
import { CustomTextareaFieldLabelServer as CustomTextareaFieldLabelServer_5c8f706a3452bccefa9f5044e2cd250c } from '@/collections/Fields/textarea/components/server/Label'
import { CustomTextareaFieldServer as CustomTextareaFieldServer_3f7b621f5c4c42971fc099a1fa492d99 } from '@/collections/Fields/textarea/components/server/Field'
import { CustomTextareaFieldLabelClient as CustomTextareaFieldLabelClient_9959ee64353edb5f2606b52187275823 } from '@/collections/Fields/textarea/components/client/Label'
import { CustomTextareaFieldClient as CustomTextareaFieldClient_4fd3331c38982e86768c64dcc9a10691 } from '@/collections/Fields/textarea/components/client/Field'
import { CustomTabEditView as CustomTabEditView_0a7acb05a3192ecfa7e07f8b42e7a193 } from '@/collections/Views/components/CustomTabEditView'
import { CustomDefaultEditView as CustomDefaultEditView_2d3c652c5909d3a3dc3464f0547d5424 } from '@/collections/Views/components/CustomDefaultEditView'
import { CustomRootEditView as CustomRootEditView_ba37229da543ad3c8dc40f7a48771f99 } from '@/collections/RootViews/components/CustomRootEditView'
import { LinkToCustomView as LinkToCustomView_6f16fe358985478a2ead2354ef2cc9a0 } from '@/components/afterNavLinks/LinkToCustomView'
import { LinkToCustomMinimalView as LinkToCustomMinimalView_fd2cefb054695a5b60b860a69d67d15d } from '@/components/afterNavLinks/LinkToCustomMinimalView'
import { LinkToCustomDefaultView as LinkToCustomDefaultView_4c5f581c8bfa951ce2f83c24c4f36b3b } from '@/components/afterNavLinks/LinkToCustomDefaultView'
import { CustomRootView as CustomRootView_1ebb91ef5ff1ea4dc9a27ceb8e9ee0ab } from '@/components/views/CustomRootView'
import { CustomDefaultRootView as CustomDefaultRootView_a2f8ce99b3a1692f7ec03a907e1ea4ce } from '@/components/views/CustomDefaultRootView'
import { CustomMinimalRootView as CustomMinimalRootView_9211f699dea5524a957f33011b786586 } from '@/components/views/CustomMinimalRootView'

export const importMap = {
  '@/collections/Fields/array/components/server/Label#CustomArrayFieldLabelServer':
    CustomArrayFieldLabelServer_f8d063e9b7f25c350451c1865199c947,
  '@/collections/Fields/array/components/server/Field#CustomArrayFieldServer':
    CustomArrayFieldServer_4c3c139a9b1a198103c8a2ec2869c837,
  '@/collections/Fields/array/components/client/Label#CustomArrayFieldLabelClient':
    CustomArrayFieldLabelClient_c07dc2c547c47aca8e9f471795279e9d,
  '@/collections/Fields/array/components/client/Field#CustomArrayFieldClient':
    CustomArrayFieldClient_60ede271f2b85983daf36710010ad8ab,
  '@/collections/Fields/blocks/components/server/Field#CustomBlocksFieldServer':
    CustomBlocksFieldServer_61732537ad2c492ac9938959902f6954,
  '@/collections/Fields/blocks/components/client/Field#CustomBlocksFieldClient':
    CustomBlocksFieldClient_2ef3a03de3974b6f18f07623af0cd515,
  '@/collections/Fields/checkbox/components/server/Label#CustomCheckboxFieldLabelServer':
    CustomCheckboxFieldLabelServer_48cd2d9639f54745ad4cdb6905c825d9,
  '@/collections/Fields/checkbox/components/server/Field#CustomCheckboxFieldServer':
    CustomCheckboxFieldServer_85023d60242dd4cca7c406a728ec37a8,
  '@/collections/Fields/checkbox/components/client/Label#CustomCheckboxFieldLabelClient':
    CustomCheckboxFieldLabelClient_f2b214145c1cbe98957573cf62455194,
  '@/collections/Fields/checkbox/components/client/Field#CustomCheckboxFieldClient':
    CustomCheckboxFieldClient_a13e6003bc89da826df764d7234782de,
  '@/collections/Fields/code/components/server/Label#CustomCodeFieldLabelServer':
    CustomCodeFieldLabelServer_566aaa8491895af5900235f95e62c2cf,
  '@/collections/Fields/code/components/server/Field#CustomCodeFieldServer':
    CustomCodeFieldServer_e76f292770f788ad4ec46a180ab3c174,
  '@/collections/Fields/code/components/client/Label#CustomCodeFieldLabelClient':
    CustomCodeFieldLabelClient_823b02f23d594204cfa7fcfc30aeed46,
  '@/collections/Fields/code/components/client/Field#CustomCodeFieldClient':
    CustomCodeFieldClient_2ef913b825e7bb326ec86b0f6ea4dd3c,
  '@/collections/Fields/date/components/server/Label#CustomDateFieldLabelServer':
    CustomDateFieldLabelServer_ae9eb459b79a1363a40d62b1e463aa6b,
  '@/collections/Fields/date/components/server/Field#CustomDateFieldServer':
    CustomDateFieldServer_9d448604d99b3b06826ea95986ffd27b,
  '@/collections/Fields/date/components/client/Label#CustomDateFieldLabelClient':
    CustomDateFieldLabelClient_0b6c1439c63aadfd306cf432713a52d8,
  '@/collections/Fields/date/components/client/Field#CustomDateFieldClient':
    CustomDateFieldClient_4ef537c727f5de7c26aaea94024a0b2c,
  '@/collections/Fields/email/components/server/Label#CustomEmailFieldLabelServer':
    CustomEmailFieldLabelServer_a5097abb06efbe71fc6ba1636f7194ab,
  '@/collections/Fields/email/components/server/Field#CustomEmailFieldServer':
    CustomEmailFieldServer_457ae84519701bf0b287c30a994ddab1,
  '@/collections/Fields/email/components/client/Label#CustomEmailFieldLabelClient':
    CustomEmailFieldLabelClient_147edabdb378c855b9c8c06b8c627e50,
  '@/collections/Fields/email/components/client/Field#CustomEmailFieldClient':
    CustomEmailFieldClient_e22bcec891915f255e5ac6e1850aeb97,
  '@/collections/Fields/json/components/server/Label#CustomJSONFieldLabelServer':
    CustomJSONFieldLabelServer_94d8c8f7c699cb282fb912bead88f8b6,
  '@/collections/Fields/json/components/server/Field#CustomJSONFieldServer':
    CustomJSONFieldServer_6034ebd8b071080c9e06e4abab7a6fd2,
  '@/collections/Fields/json/components/client/Label#CustomJSONFieldLabelClient':
    CustomJSONFieldLabelClient_16798ccfd3eb2cb009c4f0ea34c3c31e,
  '@/collections/Fields/json/components/client/Field#CustomJSONFieldClient':
    CustomJSONFieldClient_077b2498f1ebe1df34940ffc4ce4f8e6,
  '@/collections/Fields/number/components/server/Label#CustomNumberFieldLabelServer':
    CustomNumberFieldLabelServer_1b47d0cd70ad88e23dcf9c4f91bf319f,
  '@/collections/Fields/number/components/server/Field#CustomNumberFieldServer':
    CustomNumberFieldServer_54fc6ad95d89a3b66b59136e84d20b86,
  '@/collections/Fields/number/components/client/Label#CustomNumberFieldLabelClient':
    CustomNumberFieldLabelClient_dd3e3dcfc7b07c3a02f947ac81718a51,
  '@/collections/Fields/number/components/client/Field#CustomNumberFieldClient':
    CustomNumberFieldClient_5d5605680426c77470fd74d010fe051f,
  '@/collections/Fields/point/components/server/Label#CustomPointFieldLabelServer':
    CustomPointFieldLabelServer_c5fb0c717f353a8c6149238dd7d92ec9,
  '@/collections/Fields/point/components/server/Field#CustomPointFieldServer':
    CustomPointFieldServer_a23d13971ed0ff10615e3248bb1ee55d,
  '@/collections/Fields/point/components/client/Label#CustomPointFieldLabelClient':
    CustomPointFieldLabelClient_3c6c8c891bc098021e618d5cf4dc3150,
  '@/collections/Fields/point/components/client/Field#CustomPointFieldClient':
    CustomPointFieldClient_abb4ee1633cbc83b4cec9b8abb95f132,
  '@/collections/Fields/radio/components/server/Label#CustomRadioFieldLabelServer':
    CustomRadioFieldLabelServer_5c732ac2af72bb41657cc9a1a22bc67b,
  '@/collections/Fields/radio/components/server/Field#CustomRadioFieldServer':
    CustomRadioFieldServer_b7edb363e225e2976a994da8e8803e60,
  '@/collections/Fields/radio/components/client/Label#CustomRadioFieldLabelClient':
    CustomRadioFieldLabelClient_d46d0583023d87065f05972901727bbf,
  '@/collections/Fields/radio/components/client/Field#CustomRadioFieldClient':
    CustomRadioFieldClient_42845db96f999817cb9f0a590413d669,
  '@/collections/Fields/relationship/components/server/Label#CustomRelationshipFieldLabelServer':
    CustomRelationshipFieldLabelServer_7c45510caabe204587b638c40f0d0a70,
  '@/collections/Fields/relationship/components/server/Field#CustomRelationshipFieldServer':
    CustomRelationshipFieldServer_d2e0b17d4b1c00b1fc726f0ea55ddc16,
  '@/collections/Fields/relationship/components/client/Label#CustomRelationshipFieldLabelClient':
    CustomRelationshipFieldLabelClient_37b268226ded7dd38d5cb8f2952f4b3a,
  '@/collections/Fields/relationship/components/client/Field#CustomRelationshipFieldClient':
    CustomRelationshipFieldClient_eb1bc838beb92b05ba1bb9c1fdfd7869,
  '@/collections/Fields/select/components/server/Label#CustomSelectFieldLabelServer':
    CustomSelectFieldLabelServer_653acab80b672fd4ebeeed757e09d4c9,
  '@/collections/Fields/select/components/server/Field#CustomSelectFieldServer':
    CustomSelectFieldServer_ee886c859ef756c29ae7383a2be0a08a,
  '@/collections/Fields/select/components/client/Label#CustomSelectFieldLabelClient':
    CustomSelectFieldLabelClient_2db542ef2e0a664acaa5679fc14aa54b,
  '@/collections/Fields/select/components/client/Field#CustomSelectFieldClient':
    CustomSelectFieldClient_c8b4c7f3e98b5887ca262dd841bffa2f,
  '@/collections/Fields/text/components/server/Label#CustomTextFieldLabelServer':
    CustomTextFieldLabelServer_64a4b68861269d69d4c16a0f651b7ac9,
  '@/collections/Fields/text/components/server/Field#CustomTextFieldServer':
    CustomTextFieldServer_e0caaef49c00003336b08d834c0c9fe9,
  '@/collections/Fields/text/components/client/Label#CustomTextFieldLabelClient':
    CustomTextFieldLabelClient_9af2b9e4733a9fc79fb9dfb1578c18bf,
  '@/collections/Fields/text/components/client/Field#CustomTextFieldClient':
    CustomTextFieldClient_c7c0687b5204b201f8b1af831f34fd98,
  '@/collections/Fields/textarea/components/server/Label#CustomTextareaFieldLabelServer':
    CustomTextareaFieldLabelServer_5c8f706a3452bccefa9f5044e2cd250c,
  '@/collections/Fields/textarea/components/server/Field#CustomTextareaFieldServer':
    CustomTextareaFieldServer_3f7b621f5c4c42971fc099a1fa492d99,
  '@/collections/Fields/textarea/components/client/Label#CustomTextareaFieldLabelClient':
    CustomTextareaFieldLabelClient_9959ee64353edb5f2606b52187275823,
  '@/collections/Fields/textarea/components/client/Field#CustomTextareaFieldClient':
    CustomTextareaFieldClient_4fd3331c38982e86768c64dcc9a10691,
  '@/collections/Views/components/CustomTabEditView#CustomTabEditView':
    CustomTabEditView_0a7acb05a3192ecfa7e07f8b42e7a193,
  '@/collections/Views/components/CustomDefaultEditView#CustomDefaultEditView':
    CustomDefaultEditView_2d3c652c5909d3a3dc3464f0547d5424,
  '@/collections/RootViews/components/CustomRootEditView#CustomRootEditView':
    CustomRootEditView_ba37229da543ad3c8dc40f7a48771f99,
  '@/components/afterNavLinks/LinkToCustomView#LinkToCustomView':
    LinkToCustomView_6f16fe358985478a2ead2354ef2cc9a0,
  '@/components/afterNavLinks/LinkToCustomMinimalView#LinkToCustomMinimalView':
    LinkToCustomMinimalView_fd2cefb054695a5b60b860a69d67d15d,
  '@/components/afterNavLinks/LinkToCustomDefaultView#LinkToCustomDefaultView':
    LinkToCustomDefaultView_4c5f581c8bfa951ce2f83c24c4f36b3b,
  '@/components/views/CustomRootView#CustomRootView':
    CustomRootView_1ebb91ef5ff1ea4dc9a27ceb8e9ee0ab,
  '@/components/views/CustomDefaultRootView#CustomDefaultRootView':
    CustomDefaultRootView_a2f8ce99b3a1692f7ec03a907e1ea4ce,
  '@/components/views/CustomMinimalRootView#CustomMinimalRootView':
    CustomMinimalRootView_9211f699dea5524a957f33011b786586,
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/examples/custom-components/src/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/custom-components/src/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}
export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/custom-components/src/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/examples/custom-components/src/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

````
