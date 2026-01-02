---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 627
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 627 of 695)

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
Location: payload-main/test/locked-documents/int.spec.ts

```typescript
import type { Payload, SanitizedCollectionConfig, SanitizedGlobalConfig } from 'payload'

import path from 'path'
import { Locked, NotFound } from 'payload'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { Post, User } from './payload-types.js'

import { devUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { menuSlug } from './globals/Menu/index.js'
import { pagesSlug, postsSlug } from './slugs.js'

const lockedDocumentCollection = 'payload-locked-documents'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Locked documents', () => {
  let post: Post
  let user: any
  let user2: any
  let postConfig: SanitizedCollectionConfig

  beforeAll(async () => {
    // @ts-expect-error: initPayloadInt does not have a proper type definition
    ;({ payload } = await initPayloadInt(dirname))

    postConfig = payload.config.collections.find(
      ({ slug }) => slug === postsSlug,
    ) as SanitizedCollectionConfig

    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    user = loginResult.user

    user2 = await payload.create({
      collection: 'users',
      data: {
        email: 'test@payloadcms.com',
        password: 'test',
      },
    })

    post = await payload.create({
      collection: postsSlug,
      data: {
        text: 'some post',
      },
    })

    await payload.create({
      collection: pagesSlug,
      data: {
        text: 'some page',
      },
    })

    await payload.updateGlobal({
      slug: menuSlug,
      data: {
        globalText: 'global text',
      },
    })
  })

  afterAll(async () => {
    await payload.destroy()
  })

  afterEach(() => {
    postConfig.lockDocuments = { duration: 300 }
  })

  it('should update unlocked document - collection', async () => {
    const updatedPost = await payload.update({
      collection: postsSlug,
      data: {
        text: 'updated post',
      },
      id: post.id,
    })

    expect(updatedPost.text).toEqual('updated post')
  })

  it('should update unlocked document - global', async () => {
    const updatedGlobalMenu = await payload.updateGlobal({
      slug: menuSlug,
      data: {
        globalText: 'updated global text',
      },
    })

    expect(updatedGlobalMenu.globalText).toEqual('updated global text')
  })

  it('should delete unlocked document - collection', async () => {
    const { docs } = await payload.find({
      collection: postsSlug,
      depth: 0,
    })

    expect(docs).toHaveLength(2)

    await payload.delete({
      collection: postsSlug,
      id: post.id,
    })

    const { docs: deletedResults } = await payload.find({
      collection: postsSlug,
      depth: 0,
    })

    expect(deletedResults).toHaveLength(1)
  })

  it('should allow update of stale locked document - collection', async () => {
    const newPost2 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 2',
      },
    })

    // Set lock duration to 1 second for testing purposes
    postConfig.lockDocuments = { duration: 1 }

    // Give locking ownership to another user
    const lockedDocInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: {
          relationTo: 'posts',
          value: newPost2.id,
        },
        globalSlug: undefined,
      },
    })

    await wait(1100)

    const updateLockedDoc = await payload.update({
      collection: postsSlug,
      data: {
        text: 'updated post 2',
      },
      overrideLock: false,
      id: newPost2.id,
    })
    postConfig.lockDocuments = { duration: 300 }

    // Should allow update since editedAt date is past expiration duration.
    // Therefore the document is considered stale
    expect(updateLockedDoc.text).toEqual('updated post 2')

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedDocInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedDocInstance.id },
      },
    })

    // Updating a document with the local API should not keep a stored doc
    // in the payload-locked-documents collection
    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should allow update of stale locked document - global', async () => {
    // Set lock duration to 1 second for testing purposes
    const globalConfig = payload.config.globals.find(
      ({ slug }) => slug === menuSlug,
    ) as SanitizedGlobalConfig
    globalConfig.lockDocuments = { duration: 1 }
    // Give locking ownership to another user
    const lockedGlobalInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: undefined,
        globalSlug: menuSlug,
      },
    })

    await wait(1100)

    const updateGlobalLockedDoc = await payload.updateGlobal({
      data: {
        globalText: 'global text 2',
      },
      overrideLock: false,
      slug: menuSlug,
    })
    globalConfig.lockDocuments = { duration: 300 }

    // Should allow update since editedAt date is past expiration duration.
    // Therefore the document is considered stale
    expect(updateGlobalLockedDoc.globalText).toEqual('global text 2')

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedGlobalInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedGlobalInstance.id },
      },
    })

    // Updating a document with the local API should not keep a stored doc
    // in the payload-locked-documents collection
    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should not allow update of locked document - collection', async () => {
    const newPost = await payload.create({
      collection: postsSlug,
      data: {
        text: 'some post',
      },
    })

    // Give locking ownership to another user
    await payload.create({
      collection: lockedDocumentCollection,
      data: {
        document: {
          relationTo: 'posts',
          value: newPost.id,
        },
        globalSlug: undefined,
        user: {
          relationTo: 'users',
          value: user2.id,
        },
      },
    })

    try {
      await payload.update({
        collection: postsSlug,
        data: {
          text: 'updated post',
        },
        overrideLock: false, // necessary to trigger the lock check
        id: newPost.id,
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(Locked)
      expect(error.message).toMatch(/currently locked by another user and cannot be updated/)
    }

    const updatedPost = await payload.findByID({
      collection: postsSlug,
      id: newPost.id,
    })

    // Should not allow update - expect data not to change
    expect(updatedPost.text).toEqual('some post')
  })

  it('should not allow update of locked document - global', async () => {
    // Give locking ownership to another user
    await payload.create({
      collection: lockedDocumentCollection,
      data: {
        document: undefined,
        globalSlug: menuSlug,
        user: {
          relationTo: 'users',
          value: user2.id,
        },
      },
    })

    try {
      await payload.updateGlobal({
        data: {
          globalText: 'updated global text',
        },
        overrideLock: false, // necessary to trigger the lock check
        slug: menuSlug,
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(Locked)
      expect(error.message).toMatch(/currently locked by another user and cannot be updated/)
    }

    const updatedGlobalMenu = await payload.findGlobal({
      slug: menuSlug,
    })

    // Should not allow update - expect data not to change
    expect(updatedGlobalMenu.globalText).toEqual('global text 2')
  })

  // Try to delete locked document (collection)
  it('should not allow delete of locked document - collection', async () => {
    const newPost3 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 3',
      },
    })

    // Give locking ownership to another user
    await payload.create({
      collection: lockedDocumentCollection,
      data: {
        document: {
          relationTo: 'posts',
          value: newPost3.id,
        },
        globalSlug: undefined,
        user: {
          relationTo: 'users',
          value: user2.id,
        },
      },
    })

    try {
      await payload.delete({
        collection: postsSlug,
        id: newPost3.id,
        overrideLock: false, // necessary to trigger the lock check
      })
    } catch (error: any) {
      expect(error).toBeInstanceOf(Locked)
      expect(error.message).toMatch(/currently locked and cannot be deleted/)
    }

    const findPostDocs = await payload.find({
      collection: postsSlug,
      where: {
        id: { equals: newPost3.id },
      },
    })

    expect(findPostDocs.docs).toHaveLength(1)
  })

  it('should allow delete of stale locked document - collection', async () => {
    const newPost4 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 4',
      },
    })

    // Set lock duration to 1 second for testing purposes
    postConfig.lockDocuments = { duration: 1 }

    // Give locking ownership to another user
    const lockedDocInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: {
          relationTo: 'posts',
          value: newPost4.id,
        },
        globalSlug: undefined,
      },
    })

    await wait(1100)

    await payload.delete({
      collection: postsSlug,
      id: newPost4.id,
      overrideLock: false,
    })

    const findPostDocs = await payload.find({
      collection: postsSlug,
      where: {
        id: { equals: newPost4.id },
      },
    })

    expect(findPostDocs.docs).toHaveLength(0)

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedDocInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedDocInstance.id },
      },
    })

    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should allow update of locked document w/ overrideLock flag - collection', async () => {
    const newPost5 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 5',
      },
    })

    // Give locking ownership to another user
    const lockedDocInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: {
          relationTo: 'posts',
          value: newPost5.id,
        },
        globalSlug: undefined,
      },
    })

    const updateLockedDoc = await payload.update({
      collection: postsSlug,
      data: {
        text: 'updated post 5',
      },
      id: newPost5.id,
      overrideLock: true,
    })

    // Should allow update since using overrideLock flag
    expect(updateLockedDoc.text).toEqual('updated post 5')

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedDocInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedDocInstance.id },
      },
    })

    // Updating a document with the local API should not keep a stored doc
    // in the payload-locked-documents collection
    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should allow update of locked document w/ overrideLock flag - global', async () => {
    // Give locking ownership to another user
    const lockedGlobalInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        globalSlug: menuSlug,
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: undefined,
      },
    })

    const updateGlobalLockedDoc = await payload.updateGlobal({
      data: {
        globalText: 'updated global text 2',
      },
      slug: menuSlug,
      overrideLock: true,
    })

    // Should allow update since using overrideLock flag
    expect(updateGlobalLockedDoc.globalText).toEqual('updated global text 2')

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedGlobalInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedGlobalInstance.id },
      },
    })

    // Updating a document with the local API should not keep a stored doc
    // in the payload-locked-documents collection
    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should allow delete of locked document w/ overrideLock flag - collection', async () => {
    const newPost6 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 6',
      },
    })

    // Give locking ownership to another user
    const lockedDocInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: {
          relationTo: 'posts',
          value: newPost6.id,
        },
        globalSlug: undefined,
      },
    })

    await payload.delete({
      collection: postsSlug,
      id: newPost6.id,
      overrideLock: true,
    })

    const findPostDocs = await payload.find({
      collection: postsSlug,
      where: {
        id: { equals: newPost6.id },
      },
    })

    expect(findPostDocs.docs).toHaveLength(0)

    // Check to make sure the document does not exist in payload-locked-documents anymore
    try {
      await payload.findByID({
        collection: lockedDocumentCollection,
        id: lockedDocInstance.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFound)
    }

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        id: { equals: lockedDocInstance.id },
      },
    })

    expect(docsFromLocksCollection.docs).toHaveLength(0)
  })

  it('should allow take over on locked doc (simulates take over modal from admin ui)', async () => {
    const newPost7 = await payload.create({
      collection: postsSlug,
      data: {
        text: 'new post 7',
      },
    })

    const lockedDocInstance = await payload.create({
      collection: lockedDocumentCollection,
      data: {
        user: {
          relationTo: 'users',
          value: user2.id,
        },
        document: {
          relationTo: 'posts',
          value: newPost7.id,
        },
        globalSlug: undefined,
      },
    })

    // This is the take over action - changing the user to the current user
    await payload.update({
      collection: 'payload-locked-documents',
      data: {
        user: { relationTo: 'users', value: user?.id },
      },
      id: lockedDocInstance.id,
    })

    const docsFromLocksCollection = await payload.find({
      collection: lockedDocumentCollection,
      where: {
        'user.value': { equals: user.id },
      },
    })

    expect(docsFromLocksCollection.docs).toHaveLength(1)
    expect((docsFromLocksCollection.docs[0]?.user.value as User)?.id).toEqual(user.id)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/locked-documents/payload-types.ts

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
    pages: Page;
    posts: Post;
    'server-components': ServerComponent;
    tests: Test;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    pages: PagesSelect<false> | PagesSelect<true>;
    posts: PostsSelect<false> | PostsSelect<true>;
    'server-components': ServerComponentsSelect<false> | ServerComponentsSelect<true>;
    tests: TestsSelect<false> | TestsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {
    admin: Admin;
    menu: Menu;
  };
  globalsSelect: {
    admin: AdminSelect<false> | AdminSelect<true>;
    menu: MenuSelect<false> | MenuSelect<true>;
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
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  text?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  text?: string | null;
  richText?: {
    root: {
      type: string;
      children: {
        type: any;
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
  documentLoaded?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "server-components".
 */
export interface ServerComponent {
  id: string;
  customTextServer?: string | null;
  richText?: {
    root: {
      type: string;
      children: {
        type: any;
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
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tests".
 */
export interface Test {
  id: string;
  text?: string | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name?: string | null;
  roles?: ('is_user' | 'is_admin')[] | null;
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
        relationTo: 'pages';
        value: string | Page;
      } | null)
    | ({
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'server-components';
        value: string | ServerComponent;
      } | null)
    | ({
        relationTo: 'tests';
        value: string | Test;
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
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  text?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  text?: T;
  richText?: T;
  documentLoaded?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "server-components_select".
 */
export interface ServerComponentsSelect<T extends boolean = true> {
  customTextServer?: T;
  richText?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "tests_select".
 */
export interface TestsSelect<T extends boolean = true> {
  text?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  roles?: T;
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
 * via the `definition` "admin".
 */
export interface Admin {
  id: string;
  adminText?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "menu".
 */
export interface Menu {
  id: string;
  globalText?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admin_select".
 */
export interface AdminSelect<T extends boolean = true> {
  adminText?: T;
  updatedAt?: T;
  createdAt?: T;
  globalType?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "menu_select".
 */
export interface MenuSelect<T extends boolean = true> {
  globalText?: T;
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

````
