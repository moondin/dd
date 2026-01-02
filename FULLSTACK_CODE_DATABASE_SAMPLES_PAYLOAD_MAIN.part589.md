---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 589
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 589 of 695)

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

---[FILE: e2e.spec.ts]---
Location: payload-main/test/i18n/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'

import type { Config } from './payload-types.js'

const { beforeAll, beforeEach, describe } = test

import path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { openListFilters } from '../helpers/e2e/filters/index.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { reInitializeDB } from '../helpers/reInitializeDB.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

let payload: PayloadTestSDK<Config>

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('i18n', () => {
  let page: Page

  let serverURL: string
  let collection1URL: AdminUrlUtil

  beforeAll(async ({ browser }, testInfo) => {
    const prebuild = false // Boolean(process.env.CI)

    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      prebuild,
    }))

    collection1URL = new AdminUrlUtil(serverURL, 'collection1')

    const context = await browser.newContext()
    page = await context.newPage()

    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })
  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'i18nTests',
    })

    await ensureCompilationIsDone({ page, serverURL })
  })

  async function setUserLanguage(language: 'de' | 'en' | 'es') {
    {
      const LanguageLabel = {
        de: {
          fieldLabel: 'Sprache',
          valueLabel: 'Deutsch',
        },
        en: {
          fieldLabel: 'Language',
          valueLabel: 'English',
        },
        es: {
          fieldLabel: 'Idioma',
          valueLabel: 'Español',
        },
      }[language]
      await page.goto(serverURL + '/admin/account')
      await page.locator('.payload-settings__language .react-select').click()
      await page.locator('.rs__option', { hasText: LanguageLabel.valueLabel }).click()
      await expect(
        page.locator('.payload-settings__language', { hasText: LanguageLabel.fieldLabel }),
      ).toBeVisible()
    }
  }

  test('ensure i18n labels and useTranslation hooks display correct translation', async () => {
    // set language to English
    await setUserLanguage('en')

    await page.goto(serverURL + '/admin')

    await expect(
      page.locator('.componentWithDefaultI18n .componentWithDefaultI18nValidT'),
    ).toHaveText('Add Link')
    await expect(
      page.locator('.componentWithDefaultI18n .componentWithDefaultI18nValidI18nT'),
    ).toHaveText('Add Link')
    await expect(
      page.locator('.componentWithDefaultI18n .componentWithDefaultI18nInvalidT'),
    ).toHaveText('fields:addLink2')
    await expect(
      page.locator('.componentWithDefaultI18n .componentWithDefaultI18nInvalidI18nT'),
    ).toHaveText('fields:addLink2')

    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nDefaultValidT'),
    ).toHaveText('Add Link')
    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nDefaultValidI18nT'),
    ).toHaveText('Add Link')
    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nDefaultInvalidT'),
    ).toHaveText('fields:addLink2')
    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nDefaultInvalidI18nT'),
    ).toHaveText('fields:addLink2')
    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nCustomValidT'),
    ).toHaveText('My custom translation')
    await expect(
      page.locator('.componentWithCustomI18n .componentWithCustomI18nCustomValidI18nT'),
    ).toHaveText('My custom translation')
  })

  test('ensure translations update correctly when switching language', async () => {
    // set language to English
    await setUserLanguage('en')

    await expect(page.locator('div.payload-settings h3')).toHaveText('Payload Settings')

    await page.goto(serverURL + '/admin/collections/collection1/create')
    await expect(page.locator('label[for="field-fieldDefaultI18nValid"]')).toHaveText(
      'Add {{label}}',
    )

    // set language to Spanish
    await setUserLanguage('es')
    await expect(page.locator('div.payload-settings h3')).toHaveText('Configuración de Payload')

    await page.goto(serverURL + '/admin/collections/collection1/create')
    await expect(page.locator('label[for="field-fieldDefaultI18nValid"]')).toHaveText(
      'Añadir {{label}}',
    )
  })

  describe('i18n labels', () => {
    test('should show translated document field label', async () => {
      // set language to Spanish
      await setUserLanguage('es')

      await page.goto(collection1URL.create)
      await expect(
        page.locator('label[for="field-i18nFieldLabel"]', {
          hasText: 'es-label',
        }),
      ).toBeVisible()
    })

    test('should show translated pill field label', async () => {
      // set language to Spanish
      await setUserLanguage('es')

      await page.goto(collection1URL.list)
      await page.locator('.list-controls__toggle-columns').click()

      // expecting the label to fall back to english as default fallbackLng
      await expect(
        page.locator('.pill-selector__pill', {
          hasText: 'es-label',
        }),
      ).toBeVisible()
    })

    test('should show fallback pill field label', async () => {
      // set language to German
      await setUserLanguage('de')

      await page.goto(collection1URL.list)
      await page.locator('.list-controls__toggle-columns').click()

      // expecting the label to fall back to english as default fallbackLng
      await expect(
        page.locator('.pill-selector__pill', {
          hasText: 'en-label',
        }),
      ).toBeVisible()
    })

    test('should show translated field label in where builder', async () => {
      await payload.create({
        collection: 'collection1',
        data: {
          i18nFieldLabel: 'Test',
        },
      })

      // set language to Spanish
      await setUserLanguage('es')

      await page.goto(collection1URL.list)

      await openListFilters(page, {})
      await page.locator('.where-builder__add-first-filter').click()
      await page.locator('.condition__field .rs__control').click()

      await expect(page.locator('.rs__option', { hasText: 'es-label' })).toBeVisible()

      // expect heading to be translated
      await expect(
        page.locator('#heading-i18nFieldLabel .sort-column__label', { hasText: 'es-label' }),
      ).toBeVisible()
      await expect(page.locator('.search-filter input')).toHaveAttribute(
        'placeholder',
        /(Buscar por ID)/,
      )
    })

    test('should display translated collections and globals config options', async () => {
      // set language to Spanish
      await setUserLanguage('es')

      await page.goto(collection1URL.list)
      await expect(
        page.locator('#nav-collection1', {
          hasText: 'ES Collection 1s',
        }),
      ).toBeVisible()
      await expect(page.locator('#nav-global-global')).toContainText('ES Global')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/i18n/payload-types.ts

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
    collection1: Collection1;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    collection1: Collection1Select<false> | Collection1Select<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    global: Global;
  };
  globalsSelect: {
    global: GlobalSelect<false> | GlobalSelect<true>;
  };
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
 * via the `definition` "collection1".
 */
export interface Collection1 {
  id: string;
  i18nFieldLabel?: string | null;
  fieldDefaultI18nValid?: string | null;
  fieldDefaultI18nInvalid?: string | null;
  fieldCustomI18nValidDefault?: string | null;
  fieldCustomI18nValidCustom?: string | null;
  fieldCustomI18nInvalid?: string | null;
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
  sessions?:
    | {
        id: string;
        createdAt?: string | null;
        expiresAt: string;
      }[]
    | null;
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
        relationTo: 'collection1';
        value: string | Collection1;
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
 * via the `definition` "collection1_select".
 */
export interface Collection1Select<T extends boolean = true> {
  i18nFieldLabel?: T;
  fieldDefaultI18nValid?: T;
  fieldDefaultI18nInvalid?: T;
  fieldCustomI18nValidDefault?: T;
  fieldCustomI18nValidCustom?: T;
  fieldCustomI18nInvalid?: T;
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
  sessions?:
    | T
    | {
        id?: T;
        createdAt?: T;
        expiresAt?: T;
      };
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
 * via the `definition` "global".
 */
export interface Global {
  id: string;
  text?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "global_select".
 */
export interface GlobalSelect<T extends boolean = true> {
  text?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
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

---[FILE: tsconfig.json]---
Location: payload-main/test/i18n/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: import-all-2-exports.ts]---
Location: payload-main/test/import-test/import-all-2-exports.ts

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * This is a list of all possible imports from Payload 2.x
 *
 * All of these should either resolve here
 *
 * OR
 *
 * Be documented in the migration guide and breaking changes doc
 */

import payload from 'payload'
import {
  CollectionPermission,
  FieldPermissions,
  GlobalPermission,
  IncomingAuthType,
  Permission,
  Permissions,
  User,
  VerifyConfig,
} from 'payload/auth'
import {
  Banner,
  Button,
  Check,
  Chevron,
  ErrorPill,
  Menu,
  MinimalTemplate,
  Pill,
  Popup,
  Search,
  ShimmerEffect,
  Tooltip,
  X,
} from 'payload/components'
import {
  Access,
  AccessArgs,
  AccessResult,
  AdminView,
  AdminViewComponent,
  AdminViewConfig,
  AdminViewProps,
  baseBlockFields,
  baseIDField,
  BaseLocalizationConfig,
  buildConfig,
  Config,
  defaults,
  EditView,
  EditViewConfig,
  EmailOptions,
  EmailTransport,
  EmailTransportOptions,
  Endpoint,
  EntityDescription,
  FieldTypes,
  GeneratePreviewURL,
  GraphQLExtension,
  hasTransport,
  hasTransportOptions,
  InitOptions,
  LivePreviewConfig,
  Locale,
  LocalizationConfig,
  LocalizationConfigWithLabels,
  LocalizationConfigWithNoLabels,
  PayloadHandler,
  Plugin,
  sanitizeConfig,
  SanitizedConfig,
  SanitizedLocalizationConfig,
  sanitizeFields,
} from 'payload/config'
import {
  BaseDatabaseAdapter,
  BeginTransaction,
  combineQueries,
  CommitTransaction,
  Connect,
  Count,
  CountArgs,
  Create,
  CreateArgs,
  createDatabaseAdapter,
  CreateGlobal,
  CreateGlobalArgs,
  CreateGlobalVersion,
  CreateGlobalVersionArgs,
  CreateMigration,
  createMigration,
  CreateVersion,
  CreateVersionArgs,
  DBIdentifierName,
  DeleteMany,
  DeleteManyArgs,
  DeleteOne,
  DeleteOneArgs,
  DeleteVersions,
  DeleteVersionsArgs,
  Destroy,
  EntityPolicies,
  Find,
  FindArgs,
  FindGlobal,
  FindGlobalArgs,
  FindGlobalVersions,
  FindGlobalVersionsArgs,
  FindOne,
  FindOneArgs,
  FindVersions,
  FindVersionsArgs,
  flattenWhereToOperators,
  getLocalizedPaths,
  getMigrations,
  Init,
  migrate,
  migrateDown,
  migrateRefresh,
  migrateReset,
  migrateStatus,
  Migration,
  MigrationData,
  migrationsCollection,
  migrationTemplate,
  PaginatedDocs,
  PathToQuery,
  QueryDrafts,
  QueryDraftsArgs,
  readMigrationFiles,
  RollbackTransaction,
  Transaction,
  TypeWithVersion,
  UpdateGlobal,
  UpdateGlobalArgs,
  UpdateGlobalVersion,
  UpdateGlobalVersionArgs,
  UpdateOne,
  UpdateOneArgs,
  UpdateVersion,
  UpdateVersionArgs,
  validateQueryPaths,
  validateSearchParam,
} from 'payload/database'
import {
  APIError,
  AuthenticationError,
  DuplicateCollection,
  DuplicateGlobal,
  ErrorDeletingFile,
  FileUploadError,
  Forbidden,
  InvalidConfiguration,
  InvalidFieldName,
  InvalidFieldRelationship,
  LockedAuth,
  MissingCollectionLabel,
  MissingFieldInputOptions,
  MissingFieldType,
  MissingFile,
  NotFound,
  QueryError,
  ValidationError,
} from 'payload/errors'
import { buildPaginatedListType, GraphQL } from 'payload/graphql'
import {
  AccessArgs as AccessArgsType,
  Access as AccessType,
  AllOperations,
  ArrayField,
  AuthOperations,
  BeforeDuplicate,
  Block,
  BlockField,
  CellComponentProps,
  CheckboxField,
  CodeField,
  CollapsibleField,
  Collection,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterForgotPasswordHook,
  CollectionAfterLoginHook,
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeLoginHook,
  CollectionBeforeOperationHook,
  CollectionBeforeReadHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Condition,
  CreateFormData,
  CustomPublishButtonProps,
  CustomPublishButtonType,
  CustomSaveButtonProps,
  CustomSaveDraftButtonProps,
  Data,
  DateField,
  docHasTimestamps,
  Document,
  EmailField,
  Field,
  FieldAccess,
  FieldAffectingData,
  fieldAffectsData,
  FieldBase,
  fieldHasMaxDepth,
  fieldHasSubFields,
  FieldHook,
  FieldHookArgs,
  fieldIsArrayType,
  fieldIsBlockType,
  fieldIsGroupType,
  fieldIsLocalized,
  fieldIsPresentationalOnly,
  FieldPresentationalOnly,
  Fields,
  fieldSupportsMany,
  FieldWithMany,
  FieldWithMaxDepth,
  FieldWithPath,
  FieldWithRichTextRequiredEditor,
  FieldWithSubFields,
  FileData,
  FilterOptions,
  FilterOptionsProps,
  FormField,
  FormFieldsContext,
  GlobalAfterChangeHook,
  GlobalAfterReadHook,
  GlobalBeforeChangeHook,
  GlobalBeforeReadHook,
  GlobalBeforeValidateHook,
  GlobalConfig,
  GroupField,
  HookName,
  ImageSize,
  IncomingUploadType,
  JSONField,
  Labels,
  NamedTab,
  NonPresentationalField,
  NumberField,
  Operation,
  Operator,
  Option,
  optionIsObject,
  optionIsValue,
  OptionObject,
  optionsAreObjects,
  PayloadRequest,
  PointField,
  PolymorphicRelationshipField,
  RadioField,
  RelationshipField,
  RelationshipValue,
  RichTextAdapter,
  RichTextFieldProps,
  RichTextFieldRequiredEditor,
  RichTextField as RichTextFieldType,
  RowAdmin,
  RowField,
  RowLabel,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  SelectField,
  SingleRelationshipField,
  Tab,
  TabAsField,
  tabHasName,
  TabsAdmin,
  TabsField,
  TextareaField,
  TextField,
  TypeWithID,
  UIField,
  UnnamedTab,
  UploadField,
  Validate,
  ValidateOptions,
  validOperators,
  valueIsValueWithRelation,
  ValueWithRelation,
  VersionOperations,
  Where,
  WhereField,
} from 'payload/types'
import {
  afterReadPromise,
  afterReadTraverseFields,
  combineMerge,
  configToJSONSchema,
  createArrayFromCommaDelineated,
  deepCopyObject,
  deepMerge,
  entityToJSONSchema,
  extractTranslations,
  fieldSchemaToJSON,
  fieldsToJSONSchema,
  flattenTopLevelFields,
  formatLabels,
  formatNames,
  getCollectionIDFieldTypes,
  getIDType,
  getTranslation,
  i18nInit,
  isValidID,
  toWords,
  withMergedProps,
  withNullableJSONSchemaType,
} from 'payload/utilities'
import {
  buildVersionCollectionFields,
  buildVersionGlobalFields,
  deleteCollectionVersions,
  enforceMaxVersions,
  getLatestCollectionVersion,
  getLatestGlobalVersion,
  saveVersion,
} from 'payload/versions'

/**
 * Plugins
 */

import {
  Args,
  MigrateDownArgs,
  MigrateUpArgs,
  MongooseAdapter,
  mongooseAdapter,
} from '@payloadcms/db-mongodb'
import {
  MigrateDownArgs as MigrateDownArgsPg,
  MigrateUpArgs as MigrateUpArgsPg,
  postgresAdapter,
} from '@payloadcms/db-postgres'
import { handleMessage, mergeData, ready, subscribe, unsubscribe } from '@payloadcms/live-preview'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { createKey, getStorageClient, payloadCloud } from '@payloadcms/payload-cloud'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { fields, getPaymentTotal } from '@payloadcms/plugin-form-builder'
import {
  BeforeEmail,
  BlockConfig,
  CountryField,
  Email,
  FieldConfig,
  FieldsConfig,
  FieldValues,
  Form,
  FormattedEmail,
  CheckboxField as FormBuilderCheckboxField,
  EmailField as FormBuilderEmailField,
  SelectField as FormBuilderSelectField,
  TextField as FormBuilderTextField,
  FormFieldBlock,
  FormSubmission,
  HandlePayment,
  isValidBlockConfig,
  MessageField,
  PaymentField,
  PaymentFieldConfig,
  PluginConfig,
  PriceCondition,
  Redirect,
  SelectFieldOption,
  StateField,
  SubmissionValue,
  TextAreaField,
} from '@payloadcms/plugin-form-builder/types'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs/fields'
import {
  Breadcrumb,
  GenerateLabel,
  GenerateURL,
  PluginConfig as NestedDocsPluginConfig,
} from '@payloadcms/plugin-nested-docs/types'
import redirects from '@payloadcms/plugin-redirects'
import { PluginConfig as RedirectsPluginConfig } from '@payloadcms/plugin-redirects/types'

// Skip plugin-sentry

import search from '@payloadcms/plugin-search'
import {
  BeforeSync,
  DocToSync,
  SearchConfig,
  SyncWithSearch,
} from '@payloadcms/plugin-search/types'
import seo from '@payloadcms/plugin-seo'
import {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  Meta,
  GenerateURL as seoGenerateURL,
  PluginConfig as SeoPluginConfig,
} from '@payloadcms/plugin-seo/types'
import stripePlugin from '@payloadcms/plugin-stripe'
import {
  FieldSyncConfig,
  SanitizedStripeConfig,
  StripeConfig,
  StripeProxy,
  StripeWebhookHandler,
  StripeWebhookHandlers,
  SyncConfig,
} from '@payloadcms/plugin-stripe/types'
import {
  $createAutoLinkNode,
  $createBlockNode,
  $createLinkNode,
  $createRelationshipNode,
  $createUploadNode,
  $isAutoLinkNode,
  $isBlockNode,
  $isLinkNode,
  $isRelationshipNode,
  $isUploadNode,
  AdapterProps,
  addSwipeDownListener,
  addSwipeLeftListener,
  addSwipeRightListener,
  addSwipeUpListener,
  AlignFeature,
  AutoLinkNode,
  BlockFields,
  BlockNode,
  BlockQuoteFeature,
  BlocksFeature,
  BlocksFeatureProps,
  BoldTextFeature,
  CAN_USE_DOM,
  CheckListFeature,
  cloneDeep,
  consolidateHTMLConverters,
  convertLexicalNodesToHTML,
  convertLexicalToHTML,
  convertSlateNodesToLexical,
  convertSlateToLexical,
  createBlockNode,
  defaultEditorConfig,
  defaultEditorFeatures,
  defaultHTMLConverters,
  defaultRichTextValue,
  defaultSanitizedEditorConfig,
  defaultSlateConverters,
  DETAIL_TYPE_TO_DETAIL,
  DOUBLE_LINE_BREAK,
  EditorConfig,
  EditorConfigProvider,
  ELEMENT_FORMAT_TO_TYPE,
  ELEMENT_TYPE_TO_FORMAT,
  ENABLE_SLASH_MENU_COMMAND,
  Feature,
  FeatureProvider,
  FeatureProviderMap,
  FloatingToolbarSection,
  FloatingToolbarSectionEntry,
  FormatSectionWithEntries,
  getDOMRangeRect,
  getEnabledNodes,
  getSelectedNode,
  HeadingFeature,
  HTMLConverter,
  HTMLConverterFeature,
  HTMLConverterFeatureProps,
  IndentFeature,
  InlineCodeTextFeature,
  invariant,
  IS_ALL_FORMATTING,
  isHTMLElement,
  isPoint,
  ItalicTextFeature,
  joinClasses,
  LexicalBlock,
  lexicalEditor,
  LexicalEditorProps,
  lexicalHTML,
  LexicalPluginToLexicalFeature,
  LexicalRichTextAdapter,
  LinebreakHTMLConverter,
  LinkFeature,
  LinkFeatureProps,
  LinkFields,
  LinkNode,
  loadFeatures,
  LTR_REGEX,
  NodeFormat,
  NodeValidation,
  NON_BREAKING_SPACE,
  OrderedListFeature,
  ParagraphFeature,
  ParagraphHTMLConverter,
  Point,
  PopulationPromise,
  RawUploadPayload,
  Rect,
  RelationshipData,
  RelationshipFeature,
  RelationshipNode,
  ResolvedFeature,
  ResolvedFeatureMap,
  RTL_REGEX,
  SanitizedEditorConfig,
  SanitizedFeatures,
  sanitizeEditorConfig,
  sanitizeFeatures,
  sanitizeUrl,
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedLinkNode,
  SerializedRelationshipNode,
  SerializedUploadNode,
  setFloatingElemPosition,
  setFloatingElemPositionForLinkEditor,
  SlashMenuGroup,
  SlashMenuOption,
  SlateBlockquoteConverter,
  SlateHeadingConverter,
  SlateIndentConverter,
  SlateLinkConverter,
  SlateListItemConverter,
  SlateNode,
  SlateNodeConverter,
  SlateOrderedListConverter,
  SlateRelationshipConverter,
  SlateToLexicalFeature,
  SlateUnknownConverter,
  SlateUnorderedListConverter,
  SlateUploadConverter,
  sortFeaturesForOptimalLoading,
  StrikethroughTextFeature,
  SubscriptTextFeature,
  SuperscriptTextFeature,
  TestRecorderFeature,
  TEXT_MODE_TO_TYPE,
  TEXT_TYPE_TO_FORMAT,
  TEXT_TYPE_TO_MODE,
  TextDropdownSectionWithEntries,
  TextHTMLConverter,
  TOGGLE_LINK_COMMAND,
  TreeViewFeature,
  UnderlineTextFeature,
  UnorderedListFeature,
  UploadData,
  UploadFeature,
  UploadFeatureProps,
  UploadNode,
  useEditorConfigContext,
  validateUrl,
} from '@payloadcms/richtext-lexical'
import {
  defaultEditorLexicalConfig,
  RichTextCell,
  RichTextField,
  ToolbarButton,
  ToolbarDropdown,
} from '@payloadcms/richtext-lexical/components'
import {
  AdapterArguments,
  ElementButton,
  ElementNode,
  FieldProps,
  LeafButton,
  nodeIsTextNode,
  RichTextCustomElement,
  RichTextCustomLeaf,
  RichTextElement,
  RichTextLeaf,
  slateEditor,
  TextNode,
  toggleElement,
} from '@payloadcms/richtext-slate'
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/joins/.gitignore

```text
uploads
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/joins/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { Categories } from './collections/Categories.js'
import { CategoriesVersions } from './collections/CategoriesVersions.js'
import { FolderPoly1 } from './collections/FolderPoly1.js'
import { FolderPoly2 } from './collections/FolderPoly2.js'
import { HiddenPosts } from './collections/HiddenPosts.js'
import { Posts } from './collections/Posts.js'
import { SelfJoins } from './collections/SelfJoins.js'
import { Singular } from './collections/Singular.js'
import { Uploads } from './collections/Uploads.js'
import { Versions } from './collections/Versions.js'
import { seed } from './seed.js'
import {
  categoriesJoinRestrictedSlug,
  collectionRestrictedSlug,
  localizedCategoriesSlug,
  localizedPostsSlug,
  postsSlug,
  restrictedCategoriesSlug,
  restrictedPostsSlug,
} from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          type: 'join',
          collection: 'posts',
          on: 'author',
          name: 'posts',
        },
      ],
    },
    Posts,
    Categories,
    HiddenPosts,
    Uploads,
    Versions,
    CategoriesVersions,
    Singular,
    SelfJoins,
    {
      slug: localizedPostsSlug,
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'category',
          type: 'relationship',
          localized: true,
          relationTo: localizedCategoriesSlug,
        },
      ],
    },
    {
      slug: localizedCategoriesSlug,
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'relatedPosts',
          type: 'join',
          collection: localizedPostsSlug,
          on: 'category',
          localized: true,
        },
      ],
    },
    {
      slug: restrictedCategoriesSlug,
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          // this field is misconfigured to have `where` constraint using a restricted field
          name: 'restrictedPosts',
          type: 'join',
          collection: postsSlug,
          on: 'category',
          where: {
            restrictedField: { equals: 'restricted' },
          },
        },
      ],
    },
    {
      slug: categoriesJoinRestrictedSlug,
      admin: {
        useAsTitle: 'name',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          // join collection with access.read: () => false which should not populate
          name: 'collectionRestrictedJoin',
          type: 'join',
          collection: collectionRestrictedSlug,
          on: 'category',
        },
      ],
    },
    {
      slug: restrictedPostsSlug,
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'restrictedField',
          type: 'text',
          access: {
            read: () => false,
            update: () => false,
          },
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: restrictedCategoriesSlug,
        },
      ],
    },
    {
      slug: collectionRestrictedSlug,
      admin: {
        useAsTitle: 'title',
      },
      access: {
        read: () => ({ canRead: { equals: true } }),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'canRead',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'category',
          type: 'relationship',
          relationTo: categoriesJoinRestrictedSlug,
        },
      ],
    },
    {
      slug: 'depth-joins-1',
      fields: [
        {
          name: 'rel',
          type: 'relationship',
          relationTo: 'depth-joins-2',
        },
        {
          name: 'joins',
          type: 'join',
          collection: 'depth-joins-3',
          on: 'rel',
          maxDepth: 2,
        },
      ],
    },
    {
      slug: 'depth-joins-2',
      fields: [
        {
          name: 'joins',
          type: 'join',
          collection: 'depth-joins-1',
          on: 'rel',
          maxDepth: 2,
        },
      ],
    },
    {
      slug: 'depth-joins-3',
      fields: [
        {
          name: 'rel',
          type: 'relationship',
          relationTo: 'depth-joins-1',
        },
      ],
    },
    {
      slug: 'multiple-collections-parents',
      access: { read: () => true },
      fields: [
        {
          type: 'join',
          name: 'children',
          collection: ['multiple-collections-1', 'multiple-collections-2'],
          on: 'parent',
          admin: {
            defaultColumns: ['title', 'name', 'description'],
          },
        },
      ],
    },
    {
      slug: 'multiple-collections-1',
      access: { read: () => true },
      admin: { useAsTitle: 'title' },
      fields: [
        {
          type: 'relationship',
          relationTo: 'multiple-collections-parents',
          name: 'parent',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      slug: 'multiple-collections-2',
      access: { read: () => true },
      admin: { useAsTitle: 'title' },
      fields: [
        {
          type: 'relationship',
          relationTo: 'multiple-collections-parents',
          name: 'parent',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      slug: 'folders',
      fields: [
        {
          type: 'relationship',
          relationTo: 'folders',
          name: 'folder',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          type: 'join',
          name: 'children',
          collection: ['folders', 'example-pages', 'example-posts'],
          on: 'folder',
          admin: {
            defaultColumns: ['title', 'name', 'description'],
          },
        },
      ],
    },
    {
      slug: 'example-pages',
      admin: { useAsTitle: 'title' },
      fields: [
        {
          type: 'relationship',
          relationTo: 'folders',
          name: 'folder',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      slug: 'example-posts',
      admin: { useAsTitle: 'title' },
      fields: [
        {
          type: 'relationship',
          relationTo: 'folders',
          name: 'folder',
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    FolderPoly1,
    FolderPoly2,
  ],
  localization: {
    locales: [
      { label: '(en)', code: 'en' },
      { label: '(es)', code: 'es' },
    ],
    defaultLocale: 'en',
  },
  onInit: async (payload) => {
    if (process.env.SEED_IN_CONFIG_ONINIT !== 'false') {
      await seed(payload)
    }
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

````
