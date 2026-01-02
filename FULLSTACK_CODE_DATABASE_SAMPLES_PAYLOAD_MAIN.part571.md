---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 571
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 571 of 695)

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

---[FILE: int.spec.ts]---
Location: payload-main/test/form-state/int.spec.ts
Signals: React

```typescript
import type { FieldState, FormState, Payload, User } from 'payload'
import type React from 'react'

import { buildFormState } from '@payloadcms/ui/utilities/buildFormState'
import path from 'path'
import { createLocalReq } from 'payload'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { postsSlug } from './collections/Posts/index.js'

// eslint-disable-next-line payload/no-relative-monorepo-imports
import { mergeServerFormState } from '../../packages/ui/src/forms/Form/mergeServerFormState.js'

let payload: Payload
let restClient: NextRESTClient
let user: User

const { email, password } = devUser
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DummyReactComponent: React.ReactNode = {
  // @ts-expect-error - can ignore, needs to satisfy `typeof value.$$typeof === 'symbol'`
  $$typeof: Symbol.for('react.element'),
  type: 'div',
  props: {},
  key: null,
}

describe('Form State', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname, undefined, true))

    const data = await restClient
      .POST('/users/login', {
        body: JSON.stringify({
          email,
          password,
        }),
      })
      .then((res) => res.json())

    user = data.user
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('should build entire form state', async () => {
    const req = await createLocalReq({ user }, payload)

    const postData = await payload.create({
      collection: postsSlug,
      data: {
        title: 'Test Post',
      },
    })

    const { state } = await buildFormState({
      mockRSCs: true,
      id: postData.id,
      collectionSlug: postsSlug,
      data: postData,
      docPermissions: {
        create: true,
        delete: true,
        fields: true,
        read: true,
        readVersions: true,
        update: true,
      },
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      req,
      schemaPath: postsSlug,
    })

    expect(state).toMatchObject({
      title: {
        value: postData.title,
        initialValue: postData.title,
      },
      updatedAt: {
        value: postData.updatedAt,
        initialValue: postData.updatedAt,
      },
      createdAt: {
        value: postData.createdAt,
        initialValue: postData.createdAt,
      },
      renderTracker: {},
      validateUsingEvent: {},
      blocks: {
        initialValue: 0,
        rows: [],
        value: 0,
      },
    })
  })

  it('should use `select` to build partial form state with only specified fields', async () => {
    const req = await createLocalReq({ user }, payload)

    const postData = await payload.create({
      collection: postsSlug,
      data: {
        title: 'Test Post',
      },
    })

    const { state } = await buildFormState({
      mockRSCs: true,
      id: postData.id,
      collectionSlug: postsSlug,
      data: postData,
      docPermissions: undefined,
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      req,
      schemaPath: postsSlug,
      select: {
        title: true,
      },
    })

    expect(state).toStrictEqual({
      title: {
        value: postData.title,
        initialValue: postData.title,
        lastRenderedPath: 'title',
        addedByServer: true,
      },
    })
  })

  it('should not render custom components when `lastRenderedPath` exists', async () => {
    const req = await createLocalReq({ user }, payload)

    const { state: stateWithRow } = await buildFormState({
      mockRSCs: true,
      collectionSlug: postsSlug,
      formState: {
        array: {
          rows: [
            {
              id: '123',
            },
          ],
        },
        'array.0.id': {
          value: '123',
          initialValue: '123',
        },
      },
      docPermissions: undefined,
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      req,
      schemaPath: postsSlug,
    })

    // Ensure that row 1 _DOES_ return with rendered components
    expect(stateWithRow?.['array.0.customTextField']?.lastRenderedPath).toStrictEqual(
      'array.0.customTextField',
    )
    expect(stateWithRow?.['array.0.customTextField']?.customComponents?.Field).toBeDefined()

    const { state: stateWithTitle } = await buildFormState({
      mockRSCs: true,
      collectionSlug: postsSlug,
      formState: {
        array: {
          rows: [
            {
              id: '123',
            },
            {
              id: '456',
            },
          ],
        },
        'array.0.id': {
          value: '123',
          initialValue: '123',
        },
        'array.0.customTextField': {
          lastRenderedPath: 'array.0.customTextField',
        },
        'array.1.id': {
          value: '456',
          initialValue: '456',
        },
      },
      docPermissions: undefined,
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      schemaPath: postsSlug,
      req,
    })

    // Ensure that row 1 _DOES NOT_ return with rendered components
    expect(stateWithTitle?.['array.0.customTextField']).toHaveProperty('lastRenderedPath')
    expect(stateWithTitle?.['array.0.customTextField']).not.toHaveProperty('customComponents')

    // Ensure that row 2 _DOES_ return with rendered components
    expect(stateWithTitle?.['array.1.customTextField']).toHaveProperty('lastRenderedPath')
    expect(stateWithTitle?.['array.1.customTextField']).toHaveProperty('customComponents')
    expect(stateWithTitle?.['array.1.customTextField']?.customComponents?.Field).toBeDefined()
  })

  it('should add `addedByServer` flag to fields that originate on the server', async () => {
    const req = await createLocalReq({ user }, payload)

    const postData = await payload.create({
      collection: postsSlug,
      data: {
        title: 'Test Post',
        blocks: [
          {
            blockType: 'text',
            text: 'Test block',
          },
        ],
      },
    })

    const { state } = await buildFormState({
      mockRSCs: true,
      id: postData.id,
      collectionSlug: postsSlug,
      data: postData,
      docPermissions: undefined,
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      req,
      schemaPath: postsSlug,
    })

    expect(state.title?.addedByServer).toBe(true)
    expect(state['blocks.0.blockType']?.addedByServer).toBe(true)

    // Ensure that `addedByServer` is removed after being received by the client
    const newState = mergeServerFormState({
      currentState: state,
      incomingState: state,
    })

    expect(newState.title?.addedByServer).toBeUndefined()
  })

  it('should not omit value and initialValue from fields added by the server', () => {
    const currentState: FormState = {
      array: {
        rows: [
          {
            id: '1',
          },
        ],
      },
    }

    const serverState: FormState = {
      array: {
        rows: [
          {
            id: '1',
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        addedByServer: true,
      },
    }

    const newState = mergeServerFormState({
      currentState,
      incomingState: serverState,
    })

    expect(newState['array.0.customTextField']).toStrictEqual({
      passesCondition: true,
      valid: true,
      value: 'Test',
      initialValue: 'Test',
    })
  })

  it('should merge array rows without losing rows added to local state', () => {
    const currentState: FormState = {
      array: {
        errorPaths: [],
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
          {
            id: '2',
            isLoading: true,
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
      'array.1.id': {
        value: '2',
        initialValue: '2',
      },
    }

    const serverState: FormState = {
      array: {
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        addedByServer: true,
      },
    }

    const newState = mergeServerFormState({
      currentState,
      incomingState: serverState,
    })

    // Row 2 should still exist
    expect(newState).toStrictEqual({
      array: {
        errorPaths: [],
        passesCondition: true,
        valid: true,
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
          {
            id: '2',
            isLoading: true,
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
        passesCondition: true,
        valid: true,
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        passesCondition: true,
        valid: true,
      },
      'array.1.id': {
        value: '2',
        initialValue: '2',
      },
    })
  })

  it('should merge array rows without bringing back rows deleted from local state', () => {
    const currentState: FormState = {
      array: {
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
    }

    const serverState: FormState = {
      array: {
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
          {
            id: '2',
            lastRenderedPath: 'array.1.customTextField',
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        addedByServer: true,
      },
      'array.1.id': {
        value: '2',
        initialValue: '2',
      },
      'array.1.customTextField': {
        value: 'Test',
        initialValue: 'Test',
      },
    }

    const newState = mergeServerFormState({
      currentState,
      incomingState: serverState,
    })

    // Row 2 should not exist
    expect(newState).toStrictEqual({
      array: {
        passesCondition: true,
        valid: true,
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
        passesCondition: true,
        valid: true,
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        passesCondition: true,
        valid: true,
      },
    })
  })

  it('should merge new fields returned from the server that do not yet exist in local state', () => {
    const currentState: FormState = {
      array: {
        rows: [
          {
            id: '1',
            isLoading: true,
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
    }

    const serverState: FormState = {
      array: {
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
            isLoading: false,
          },
        ],
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
      },
      'array.0.customTextField': {
        value: 'Test',
        initialValue: 'Test',
        addedByServer: true,
      },
    }

    const newState = mergeServerFormState({
      currentState,
      incomingState: serverState,
    })

    expect(newState).toStrictEqual({
      array: {
        passesCondition: true,
        valid: true,
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
            isLoading: false,
          },
        ],
      },
      'array.0.id': {
        passesCondition: true,
        valid: true,
        value: '1',
        initialValue: '1',
      },
      'array.0.customTextField': {
        passesCondition: true,
        valid: true,
        value: 'Test',
        initialValue: 'Test',
      },
    })
  })

  it('should return the same object reference when only modifying a value', () => {
    const currentState = {
      title: {
        value: 'Test Post',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
    }

    const newState = mergeServerFormState({
      currentState,
      incomingState: {
        title: {
          value: 'Test Post (modified)',
          initialValue: 'Test Post',
          valid: true,
          passesCondition: true,
        },
      },
    })

    expect(newState === currentState).toBe(true)
  })

  it('should accept all values from the server regardless of local modifications, e.g. `acceptAllValues` on submit', () => {
    const title: FieldState = {
      value: 'Test Post (modified on the client)',
      initialValue: 'Test Post',
      valid: true,
      passesCondition: true,
    }

    const currentState: Record<string, FieldState> = {
      title: {
        ...title,
        isModified: true, // This is critical, this is what we're testing
      },
      computedTitle: {
        value: 'Test Post (computed on the client)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
      array: {
        rows: [
          {
            id: '1',
            customComponents: {
              RowLabel: DummyReactComponent,
            },
            lastRenderedPath: 'array.0.customTextField',
          },
        ],
        valid: true,
        passesCondition: true,
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
        valid: true,
        passesCondition: true,
      },
      'array.0.customTextField': {
        value: 'Test Post (modified on the client)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
    }

    const incomingStateFromServer: Record<string, FieldState> = {
      title: {
        value: 'Test Post (modified on the server)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
      computedTitle: {
        value: 'Test Post (computed on the server)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
      array: {
        rows: [
          {
            id: '1',
            lastRenderedPath: 'array.0.customTextField',
            // Omit `customComponents` because the server did not re-render this row
          },
        ],
        passesCondition: true,
        valid: true,
      },
      'array.0.id': {
        value: '1',
        initialValue: '1',
        valid: true,
        passesCondition: true,
      },
      'array.0.customTextField': {
        value: 'Test Post (modified on the client)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
    }

    const newState = mergeServerFormState({
      acceptValues: true,
      currentState,
      incomingState: incomingStateFromServer,
    })

    expect(newState).toStrictEqual({
      ...incomingStateFromServer,
      title: {
        ...incomingStateFromServer.title,
        isModified: true,
      },
      array: {
        ...incomingStateFromServer.array,
        rows: currentState?.array?.rows,
      },
    })
  })

  it('should not accept values from the server if they have been modified locally since the request was made, e.g. `overrideLocalChanges: false` on autosave', () => {
    const title: FieldState = {
      value: 'Test Post (modified on the client 1)',
      initialValue: 'Test Post',
      valid: true,
      passesCondition: true,
    }

    const currentState: Record<string, FieldState> = {
      title: {
        ...title,
        isModified: true,
      },
      computedTitle: {
        value: 'Test Post',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
    }

    const incomingStateFromServer: Record<string, FieldState> = {
      title: {
        value: 'Test Post (modified on the server)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
      computedTitle: {
        value: 'Test Post (modified on the server)',
        initialValue: 'Test Post',
        valid: true,
        passesCondition: true,
      },
    }

    const newState = mergeServerFormState({
      acceptValues: { overrideLocalChanges: false },
      currentState,
      incomingState: incomingStateFromServer,
    })

    expect(newState).toStrictEqual({
      ...currentState,
      title: {
        ...currentState.title,
        isModified: true,
      },
      computedTitle: incomingStateFromServer.computedTitle, // This field was not modified locally, so should be updated from the server
    })
  })

  it('should set rows to empty array for empty array fields', async () => {
    const req = await createLocalReq({ user }, payload)

    // Create a document with an empty array
    const postData = await payload.create({
      collection: postsSlug,
      data: {
        title: 'Test Post',
        array: [], // Empty array - this should result in rows: [] in form state
      },
    })

    const { state } = await buildFormState({
      mockRSCs: true,
      id: postData.id,
      collectionSlug: postsSlug,
      data: postData,
      docPermissions: {
        create: true,
        delete: true,
        fields: true,
        read: true,
        readVersions: true,
        update: true,
      },
      docPreferences: {
        fields: {},
      },
      documentFormState: undefined,
      operation: 'update',
      renderAllFields: false,
      req,
      schemaPath: postsSlug,
    })

    expect(state.array).toBeDefined()
    expect(state?.array?.rows).toEqual([]) // should be [] not undefined
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/form-state/payload-types.ts

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
    posts: Post;
    'autosave-posts': AutosavePost;
    'payload-kv': PayloadKv;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    'autosave-posts': AutosavePostsSelect<false> | AutosavePostsSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
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
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title?: string | null;
  computedTitle?: string | null;
  renderTracker?: string | null;
  /**
   * This field should only validate on submit. Try typing "Not allowed" and submitting the form.
   */
  validateUsingEvent?: string | null;
  blocks?:
    | (
        | {
            text?: string | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
          }
        | {
            number?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'number';
          }
      )[]
    | null;
  array?:
    | {
        customTextField?: string | null;
        defaultTextField?: string | null;
        id?: string | null;
      }[]
    | null;
  /**
   * If there is no value, a default row will be added by a beforeChange hook. Otherwise, modifies the rows on save.
   */
  computedArray?:
    | {
        text?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "autosave-posts".
 */
export interface AutosavePost {
  id: string;
  title?: string | null;
  computedTitle?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv".
 */
export interface PayloadKv {
  id: string;
  key: string;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
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
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'autosave-posts';
        value: string | AutosavePost;
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
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  title?: T;
  computedTitle?: T;
  renderTracker?: T;
  validateUsingEvent?: T;
  blocks?:
    | T
    | {
        text?:
          | T
          | {
              text?: T;
              id?: T;
              blockName?: T;
            };
        number?:
          | T
          | {
              number?: T;
              id?: T;
              blockName?: T;
            };
      };
  array?:
    | T
    | {
        customTextField?: T;
        defaultTextField?: T;
        id?: T;
      };
  computedArray?:
    | T
    | {
        text?: T;
        id?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "autosave-posts_select".
 */
export interface AutosavePostsSelect<T extends boolean = true> {
  title?: T;
  computedTitle?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-kv_select".
 */
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
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

````
