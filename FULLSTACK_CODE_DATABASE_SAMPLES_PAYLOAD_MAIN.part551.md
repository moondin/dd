---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 551
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 551 of 695)

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

---[FILE: shared.ts]---
Location: payload-main/test/field-error-states/shared.ts

```typescript
import type { CollectionSlug, GlobalSlug } from 'payload'

export const collectionSlugs: {
  [key: string]: CollectionSlug
} = {
  validateDraftsOff: 'validate-drafts-off',
  validateDraftsOn: 'validate-drafts-on',
  validateDraftsOnAutosave: 'validate-drafts-on-autosave',
  prevValue: 'prev-value',
  prevValueRelation: 'prev-value-relation',
  errorFields: 'error-fields',
}

export const globalSlugs: {
  [key: string]: GlobalSlug
} = {
  globalValidateDraftsOn: 'global-validate-drafts-on',
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/field-error-states/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.json]---
Location: payload-main/test/field-error-states/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/ErrorFields/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

export const errorFieldsSlug = 'error-fields'

const errorFields: Field[] = [
  {
    name: 'tabText',
    type: 'text',
    required: true,
  },
  {
    type: 'collapsible',
    fields: [
      {
        name: 'text',
        type: 'text',
        required: true,
      },
    ],
    label: 'Collapse me',
  },
  {
    name: 'array',
    type: 'array',
    fields: [
      {
        name: 'requiredArrayText',
        type: 'text',
        required: true,
      },
      {
        name: 'arrayText',
        type: 'text',
      },
      {
        type: 'collapsible',
        fields: [
          {
            name: 'group',
            type: 'group',
            fields: [
              {
                name: 'text',
                type: 'text',
                required: true,
              },
              {
                name: 'number',
                type: 'number',
                required: true,
              },
              {
                name: 'date',
                type: 'date',
                required: true,
              },
              {
                name: 'checkbox',
                type: 'checkbox',
                required: true,
                validate: (value) => {
                  if (!value) {
                    return 'This field is required'
                  }
                  return true
                },
              },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'code',
                type: 'code',
                required: true,
              },
              {
                name: 'json',
                type: 'json',
                required: true,
              },
            ],
          },
          {
            name: 'email',
            type: 'email',
            required: true,
          },
          {
            name: 'point',
            type: 'point',
            required: true,
          },
          {
            name: 'radio',
            type: 'radio',
            options: [
              {
                label: 'Mint',
                value: 'mint',
              },
              {
                label: 'Dark Gray',
                value: 'dark_gray',
              },
            ],
            required: true,
          },
          {
            name: 'relationship',
            type: 'relationship',
            relationTo: 'users',
            required: true,
          },
          {
            name: 'richtext',
            type: 'richText',
            required: true,
          },
          {
            name: 'select',
            type: 'select',
            options: [
              {
                label: 'Mint',
                value: 'mint',
              },
              {
                label: 'Dark Gray',
                value: 'dark_gray',
              },
            ],
            required: true,
          },
          {
            name: 'upload',
            type: 'upload',
            relationTo: 'uploads',
            required: true,
          },
          {
            name: 'text',
            type: 'text',
            required: true,
          },
          {
            name: 'textarea',
            type: 'textarea',
            required: true,
          },
        ],
        label: 'Collapse me',
      },
    ],
  },
]

export const ErrorFieldsCollection: CollectionConfig = {
  slug: errorFieldsSlug,
  fields: [
    {
      name: 'parentArray',
      type: 'array',
      fields: [
        {
          name: 'childArray',
          type: 'array',
          fields: [
            {
              name: 'childArrayText',
              type: 'text',
              required: true,
            },
          ],
          minRows: 2,
          required: true,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'home',
          fields: errorFields,
          label: 'Home',
        },
        {
          fields: errorFields,
          label: 'Hero',
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        {
          slug: 'block1',
          fields: errorFields,
        },
      ],
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
      label: 'Group Field',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/PrevValue/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import * as QueryString from 'qs-esm'

import { collectionSlugs } from '../../shared.js'

export const PrevValue: CollectionConfig = {
  slug: collectionSlugs.prevValue,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      validate: async (value, options) => {
        if (options.operation === 'create') return true

        const query = QueryString.stringify(
          {
            where: {
              previousValueRelation: {
                in: [options.id],
              },
            },
          },
          {
            addQueryPrefix: true,
          },
        )

        try {
          const relatedDocs = await fetch(
            `http://localhost:3000/api/${collectionSlugs.prevValueRelation}${query}`,
            {
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          ).then((res) => res.json())
          if (relatedDocs.docs.length > 0 && value !== options.previousValue) {
            console.log({
              value,
              prev: options.previousValue,
            })
            return 'Doc is being referenced, cannot change title'
          }
        } catch (e) {
          console.log(e)
        }

        return true
      },
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/PrevValueRelation/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { collectionSlugs } from '../../shared.js'

export const PrevValueRelation: CollectionConfig = {
  slug: collectionSlugs.prevValueRelation,
  fields: [
    {
      relationTo: collectionSlugs.prevValue,
      name: 'previousValueRelation',
      type: 'relationship',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/field-error-states/collections/Upload/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/Upload/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import path from 'path'

const Uploads: CollectionConfig = {
  slug: 'uploads',
  fields: [
    {
      name: 'text',
      type: 'text',
    },
    {
      name: 'media',
      type: 'upload',
      filterOptions: {
        mimeType: {
          equals: 'image/png',
        },
      },
      relationTo: 'uploads',
    },
    {
      name: 'richText',
      type: 'richText',
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'test/field-error-states/collections/Upload/uploads'),
  },
}

export const uploadsDoc = {
  text: 'An upload here',
}

export default Uploads
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/ValidateDraftsOff/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { collectionSlugs } from '../../shared.js'
import { ValidateDraftsOn } from '../ValidateDraftsOn/index.js'

export const ValidateDraftsOff: CollectionConfig = {
  ...ValidateDraftsOn,
  slug: collectionSlugs.validateDraftsOff,
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/ValidateDraftsOn/index.ts

```typescript
import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

import { collectionSlugs } from '../../shared.js'

export const ValidateDraftsOn: CollectionConfig = {
  slug: collectionSlugs.validateDraftsOn as 'validate-drafts-on',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'failValidation',
      type: 'checkbox',
      admin: {
        description:
          'Check this box to simulate a validation failure. The save button should remain enabled after the failure.',
      },
      defaultValue: false,
    },
    {
      name: 'validatedField',
      type: 'text',
      admin: {
        description:
          'This field will fail validation if "Fail Validation" checkbox is checked. This simulates validation failures from business logic, network errors, or third-party validation.',
      },
      validate: ((value, { data }) => {
        if ((data as any)?.failValidation) {
          return 'Validation failed: simulated validation error to test save button behavior.'
        }
        return true
      }) as TextFieldSingleValidation,
    },
  ],
  versions: {
    drafts: {
      validate: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/collections/ValidateDraftsOnAutosave/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { collectionSlugs } from '../../shared.js'
import { ValidateDraftsOn } from '../ValidateDraftsOn/index.js'

export const ValidateDraftsOnAndAutosave: CollectionConfig = {
  ...ValidateDraftsOn,
  slug: collectionSlugs.validateDraftsOnAutosave,
  versions: {
    drafts: {
      autosave: true,
      validate: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/field-error-states/globals/ValidateDraftsOn/index.ts

```typescript
import type { GlobalConfig } from 'payload'

import { globalSlugs } from '../../shared.js'

export const GlobalValidateDraftsOn: GlobalConfig = {
  slug: globalSlugs.globalValidateDraftsOn,
  fields: [
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  versions: {
    drafts: {
      autosave: true,
      validate: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/field-perf/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'blocks-collection',
      fields: [
        {
          name: 'layout',
          type: 'blocks',
          blocks: [
            {
              slug: 'content',
              fields: [
                {
                  name: 'richText',
                  type: 'richText',
                },
                {
                  name: 'field1',
                  type: 'text',
                },
                {
                  name: 'field2',
                  type: 'text',
                },
                {
                  name: 'field3',
                  type: 'text',
                },
                {
                  name: 'field4',
                  type: 'text',
                },
                {
                  name: 'field5',
                  type: 'text',
                },
                {
                  name: 'field6',
                  type: 'text',
                },
                {
                  name: 'field7',
                  type: 'text',
                },
                {
                  name: 'field8',
                  type: 'text',
                },
                {
                  name: 'field9',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await payload.create({
      collection: 'blocks-collection',
      data: {
        layout: [...Array(100)].map((row, i) => ({
          blockName: `Block ${i}`,
          blockType: 'content',
          richText: [
            {
              children: [{ text: '' }],
            },
          ],
          field1: 'text field 1',
          field2: 'text field 2',
          field3: 'text field 3',
          field4: 'text field 4',
          field5: 'text field 5',
          field6: 'text field 6',
          field7: 'text field 7',
          field8: 'text field 8',
          field9: 'text field 9',
        })),
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/field-perf/payload-types.ts

```typescript
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    'blocks-collection': BlocksCollection;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    'blocks-collection': BlocksCollectionSelect<false> | BlocksCollectionSelect<true>;
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
 * via the `definition` "blocks-collection".
 */
export interface BlocksCollection {
  id: string;
  layout?:
    | {
        richText?: {
          root: {
            type: string;
            children: {
              type: string;
              version: number;
              [k: string]: unknown;
            }[];
            direction: ('ltr' | 'rtl') | null;
            format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
            indent: number;
            version: number;
          };
          [k: string]: unknown;
        } | null;
        field1?: string | null;
        field2?: string | null;
        field3?: string | null;
        field4?: string | null;
        field5?: string | null;
        field6?: string | null;
        field7?: string | null;
        field8?: string | null;
        field9?: string | null;
        id?: string | null;
        blockName?: string | null;
        blockType: 'content';
      }[]
    | null;
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
        relationTo: 'blocks-collection';
        value: string | BlocksCollection;
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
 * via the `definition` "blocks-collection_select".
 */
export interface BlocksCollectionSelect<T extends boolean = true> {
  layout?:
    | T
    | {
        content?:
          | T
          | {
              richText?: T;
              field1?: T;
              field2?: T;
              field3?: T;
              field4?: T;
              field5?: T;
              field6?: T;
              field7?: T;
              field8?: T;
              field9?: T;
              id?: T;
              blockName?: T;
            };
      };
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
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/field-perf/tsconfig.eslint.json

```json
{
  // extend your base config to share compilerOptions, etc
  //"extends": "./tsconfig.json",
  "compilerOptions": {
    // ensure that nobody can accidentally use this config for a build
    "noEmit": true
  },
  "include": [
    // whatever paths you intend to lint
    "./**/*.ts",
    "./**/*.tsx"
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: baseConfig.ts]---
Location: payload-main/test/fields/baseConfig.ts

```typescript
import type { CollectionConfig, Config } from 'payload'

import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import ArrayFields from './collections/Array/index.js'
import { BlockFields } from './collections/Blocks/index.js'
import CheckboxFields from './collections/Checkbox/index.js'
import CodeFields from './collections/Code/index.js'
import CollapsibleFields from './collections/Collapsible/index.js'
import ConditionalLogic from './collections/ConditionalLogic/index.js'
import { CustomRowID } from './collections/CustomID/CustomRowID.js'
import { CustomTabID } from './collections/CustomID/CustomTabID.js'
import { CustomID } from './collections/CustomID/index.js'
import DateFields from './collections/Date/index.js'
import EmailFields from './collections/Email/index.js'
import GroupFields from './collections/Group/index.js'
import IndexedFields from './collections/Indexed/index.js'
import JSONFields from './collections/JSON/index.js'
import NumberFields from './collections/Number/index.js'
import PointFields from './collections/Point/index.js'
import RadioFields from './collections/Radio/index.js'
import RelationshipFields from './collections/Relationship/index.js'
import RowFields from './collections/Row/index.js'
import SelectFields from './collections/Select/index.js'
import SelectVersionsFields from './collections/SelectVersions/index.js'
import SlugField from './collections/SlugField/index.js'
import TabsFields from './collections/Tabs/index.js'
import { TabsFields2 } from './collections/Tabs2/index.js'
import TextFields from './collections/Text/index.js'
import TextareaFields from './collections/Textarea/index.js'
import UIFields from './collections/UI/index.js'
import Uploads from './collections/Upload/index.js'
import Uploads2 from './collections/Upload2/index.js'
import UploadsMulti from './collections/UploadMulti/index.js'
import UploadsMultiPoly from './collections/UploadMultiPoly/index.js'
import UploadsPoly from './collections/UploadPoly/index.js'
import UploadRestricted from './collections/UploadRestricted/index.js'
import Uploads3 from './collections/Uploads3/index.js'
import { seed } from './seed.js'

export const collections: CollectionConfig[] = [
  {
    slug: 'users',
    admin: {
      useAsTitle: 'email',
    },
    auth: true,
    fields: [
      {
        name: 'canViewConditionalField',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },
  SelectVersionsFields,
  ArrayFields,
  BlockFields,
  CheckboxFields,
  CodeFields,
  CollapsibleFields,
  ConditionalLogic,
  CustomID,
  CustomTabID,
  CustomRowID,
  DateFields,
  EmailFields,
  RadioFields,
  GroupFields,
  RowFields,
  IndexedFields,
  JSONFields,
  NumberFields,
  PointFields,
  RelationshipFields,
  SelectFields,
  SlugField,
  TabsFields2,
  TabsFields,
  TextFields,
  TextareaFields,
  Uploads,
  Uploads2,
  Uploads3,
  UploadsMulti,
  UploadsPoly,
  UploadsMultiPoly,
  UploadRestricted,
  UIFields,
]

export const baseConfig: Partial<Config> = {
  collections,
  blocks: [
    {
      slug: 'ConfigBlockTest',
      fields: [
        {
          name: 'deduplicatedText',
          type: 'text',
        },
      ],
    },
    {
      slug: 'localizedTextReference',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      slug: 'localizedTextReference2',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
  custom: {
    client: {
      'new-value': 'client available',
    },
    server: {
      'new-server-value': 'only available on server',
    },
  },
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/AfterNavLinks.js#AfterNavLinks'],
    },
    custom: {
      client: {
        'new-value': 'client available',
      },
    },
    timezones: {
      supportedTimezones: ({ defaultTimezones }) => [
        ...defaultTimezones,
        { label: '(GMT-6) Monterrey, Nuevo Leon', value: 'America/Monterrey' },
        { label: 'Custom UTC', value: 'UTC' },
      ],
      defaultTimezone: 'America/Monterrey',
    },
  },
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: ['en', 'es'],
  },
  onInit: async (payload) => {
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
}
```

--------------------------------------------------------------------------------

---[FILE: config.blockreferences.ts]---
Location: payload-main/test/fields/config.blockreferences.ts

```typescript
/* eslint-disable no-restricted-exports */

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { autoDedupeBlocksPlugin } from '../helpers/autoDedupeBlocksPlugin/index.js'
import { baseConfig } from './baseConfig.js'

export default buildConfigWithDefaults({
  ...baseConfig,
  plugins: [autoDedupeBlocksPlugin({ silent: true })],
})
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/fields/config.ts

```typescript
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { baseConfig } from './baseConfig.js'

export default buildConfigWithDefaults(baseConfig)

export { collections } from './baseConfig.js'
```

--------------------------------------------------------------------------------

````
