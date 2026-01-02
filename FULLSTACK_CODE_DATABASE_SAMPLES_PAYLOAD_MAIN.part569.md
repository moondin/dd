---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 569
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 569 of 695)

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
Location: payload-main/test/folders/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('folders', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  beforeEach(async () => {
    await payload.delete({
      collection: 'payload-folders',
      depth: 0,
      where: {
        id: {
          exists: true,
        },
      },
    })
    await payload.delete({
      collection: 'payload-folders',
      depth: 0,
      where: {
        id: {
          exists: true,
        },
      },
    })
  })

  describe('folder > subfolder querying', () => {
    it('should populate subfolders for folder by ID', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
          folderType: ['posts'],
        },
      })
      const folderIDFromParams = parentFolder.id

      await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Nested 1',
          folder: folderIDFromParams,
          folderType: ['posts'],
        },
      })

      await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Nested 2',
          folder: folderIDFromParams,
          folderType: ['posts'],
        },
      })

      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: folderIDFromParams,
      })

      expect(parentFolderQuery.documentsAndFolders?.docs).toHaveLength(2)
    })

    it('should populate subfolders and documents for folder by ID', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: { name: 'Parent Folder' },
      })
      const childFolder = await payload.create({
        collection: 'payload-folders',
        data: { name: 'Child Folder', folder: parentFolder.id, folderType: ['posts'] },
      })
      const childDocument = await payload.create({
        collection: 'posts',
        data: { title: 'Child Document', folder: parentFolder.id },
      })
      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: parentFolder.id,
        joins: {
          documentsAndFolders: {
            limit: 100000000,
            sort: 'name',
            where: {
              or: [
                {
                  and: [
                    { relationTo: { equals: 'payload-folders' } },
                    {
                      or: [{ folderType: { in: ['posts'] } }, { folderType: { exists: false } }],
                    },
                  ],
                },
                {
                  and: [{ relationTo: { equals: 'posts' } }],
                },
              ],
            },
          },
        },
      })
      expect(parentFolderQuery.documentsAndFolders?.docs).toHaveLength(2)
    })
  })

  describe('folder > file querying', () => {
    it('should populate files for folder by ID', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Parent Folder',
        },
      })
      const folderIDFromParams = parentFolder.id

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 1',
          folder: folderIDFromParams,
        },
      })

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 2',
          folder: folderIDFromParams,
        },
      })

      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: folderIDFromParams,
      })

      expect(parentFolderQuery.documentsAndFolders?.docs).toHaveLength(2)
    })

    it('should populate non-trashed documents when collection has both folders and trash enabled', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Posts Folder',
        },
      })

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 1',
          folder: parentFolder.id,
        },
      })

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 2',
          folder: parentFolder.id,
        },
      })

      // Create a post that will be trashed
      const post3 = await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 3 (to be trashed)',
          folder: parentFolder.id,
        },
      })

      // Trash post3
      await payload.delete({
        collection: 'posts',
        id: post3.id,
      })

      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: parentFolder.id,
        joins: {
          documentsAndFolders: {
            where: {
              or: [
                {
                  deletedAt: {
                    exists: false,
                  },
                },
              ],
            },
          },
        },
      })

      // Should only see 2 non-trashed posts, not the trashed one
      expect(parentFolderQuery.documentsAndFolders?.docs).toHaveLength(2)

      // Verify the correct posts are returned
      const returnedDocs = parentFolderQuery.documentsAndFolders?.docs
      expect(returnedDocs).toHaveLength(2)

      expect(returnedDocs?.some((doc) => (doc.value as any).title === 'Post 1')).toBe(true)
      expect(returnedDocs?.some((doc) => (doc.value as any).title === 'Post 2')).toBe(true)
    })
  })

  describe('hooks', () => {
    it('reparentChildFolder should change the child after updating the parent', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Parent Folder',
        },
      })

      const childFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Child Folder',
          folder: parentFolder,
        },
      })

      await payload.update({
        collection: 'payload-folders',
        data: { folder: childFolder },
        id: parentFolder.id,
      })

      const parentAfter = await payload.findByID({
        collection: 'payload-folders',
        id: parentFolder.id,
        depth: 0,
      })
      const childAfter = await payload.findByID({
        collection: 'payload-folders',
        id: childFolder.id,
        depth: 0,
      })
      expect(childAfter.folder).toBeFalsy()
      expect(parentAfter.folder).toBe(childFolder.id)
    })

    it('dissasociateAfterDelete should delete _folder value in children after deleting the folder', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Parent Folder',
        },
      })

      const post = await payload.create({ collection: 'posts', data: { folder: parentFolder } })

      await payload.delete({ collection: 'payload-folders', id: parentFolder.id })
      const postAfter = await payload.findByID({ collection: 'posts', id: post.id })
      expect(postAfter.folder).toBeFalsy()
    })

    it('deleteSubfoldersBeforeDelete deletes subfolders after deleting the parent folder', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          folderType: ['posts'],
          name: 'Parent Folder',
        },
      })
      const childFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Child Folder',
          folder: parentFolder,
          folderType: ['posts'],
        },
      })

      await payload.delete({ collection: 'payload-folders', id: parentFolder.id })

      await expect(
        payload.findByID({
          collection: 'payload-folders',
          id: childFolder.id,
          disableErrors: true,
        }),
      ).resolves.toBeNull()
    })

    describe('ensureSafeCollectionsChange', () => {
      it('should prevent narrowing scope of a folder if it contains documents of a removed type', async () => {
        const sharedFolder = await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Posts and Drafts Folder',
            folderType: ['posts', 'drafts'],
          },
        })

        await payload.create({
          collection: 'posts',
          data: {
            title: 'Post 1',
            folder: sharedFolder.id,
          },
        })

        await payload.create({
          collection: 'drafts',
          data: {
            title: 'Post 1',
            folder: sharedFolder.id,
          },
        })

        try {
          const updatedFolder = await payload.update({
            collection: 'payload-folders',
            id: sharedFolder.id,
            data: {
              folderType: ['posts'],
            },
          })

          expect(updatedFolder).not.toBeDefined()
        } catch (e: any) {
          expect(e.message).toBe(
            'The folder "Posts and Drafts Folder" contains documents that still belong to the following collections: Drafts',
          )
        }
      })

      it('should prevent adding scope to a folder if it contains documents outside of the new scope', async () => {
        const folderAcceptsAnything = await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Anything Goes',
            folderType: [],
          },
        })

        await payload.create({
          collection: 'posts',
          data: {
            title: 'Post 1',
            folder: folderAcceptsAnything.id,
          },
        })

        try {
          const scopedFolder = await payload.update({
            collection: 'payload-folders',
            id: folderAcceptsAnything.id,
            data: {
              folderType: ['posts'],
            },
          })

          expect(scopedFolder).not.toBeDefined()
        } catch (e: any) {
          expect(e.message).toBe(
            'The folder "Anything Goes" contains documents that still belong to the following collections: Posts',
          )
        }
      })

      it('should prevent narrowing scope of a folder if subfolders are assigned to any of the removed types', async () => {
        const parentFolder = await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Parent Folder',
            folderType: ['posts', 'drafts'],
          },
        })

        await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Parent Folder',
            folderType: ['posts', 'drafts'],
            folder: parentFolder.id,
          },
        })

        try {
          const updatedParent = await payload.update({
            collection: 'payload-folders',
            id: parentFolder.id,
            data: {
              folderType: ['posts'],
            },
          })

          expect(updatedParent).not.toBeDefined()
        } catch (e: any) {
          expect(e.message).toBe(
            'The folder "Parent Folder" contains folders that still belong to the following collections: Drafts',
          )
        }
      })

      it('should prevent widening scope on a scoped subfolder', async () => {
        const unscopedFolder = await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Parent Folder',
            folderType: [],
          },
        })

        const level1Folder = await payload.create({
          collection: 'payload-folders',
          data: {
            name: 'Level 1 Folder',
            folderType: ['posts', 'drafts'],
            folder: unscopedFolder.id,
          },
        })

        try {
          const level2UnscopedFolder = await payload.create({
            collection: 'payload-folders',
            data: {
              name: 'Level 2 Folder',
              folder: level1Folder.id,
              folderType: [],
            },
          })

          expect(level2UnscopedFolder).not.toBeDefined()
        } catch (e: any) {
          expect(e.message).toBe(
            'The folder "Level 2 Folder" must have folder-type set since its parent folder "Level 1 Folder" has a folder-type set.',
          )
        }
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/folders/payload-types.ts

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
    media: Media;
    drafts: Draft;
    autosave: Autosave;
    'omitted-from-browse-by': OmittedFromBrowseBy;
    users: User;
    'payload-folders': FolderInterface;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {
    'payload-folders': {
      documentsAndFolders: 'payload-folders' | 'posts' | 'media' | 'drafts' | 'autosave' | 'omitted-from-browse-by';
    };
  };
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    drafts: DraftsSelect<false> | DraftsSelect<true>;
    autosave: AutosaveSelect<false> | AutosaveSelect<true>;
    'omitted-from-browse-by': OmittedFromBrowseBySelect<false> | OmittedFromBrowseBySelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-folders': PayloadFoldersSelect<false> | PayloadFoldersSelect<true>;
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
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  title?: string | null;
  heroImage?: (string | null) | Media;
  relatedAutosave?: (string | null) | Autosave;
  folder?: (string | null) | FolderInterface;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  folder?: (string | null) | FolderInterface;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-folders".
 */
export interface FolderInterface {
  id: string;
  name: string;
  folder?: (string | null) | FolderInterface;
  documentsAndFolders?: {
    docs?: (
      | {
          relationTo?: 'payload-folders';
          value: string | FolderInterface;
        }
      | {
          relationTo?: 'posts';
          value: string | Post;
        }
      | {
          relationTo?: 'media';
          value: string | Media;
        }
      | {
          relationTo?: 'drafts';
          value: string | Draft;
        }
      | {
          relationTo?: 'autosave';
          value: string | Autosave;
        }
      | {
          relationTo?: 'omitted-from-browse-by';
          value: string | OmittedFromBrowseBy;
        }
    )[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  folderType?: ('posts' | 'media' | 'drafts' | 'autosave' | 'omitted-from-browse-by')[] | null;
  folderSlug?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "drafts".
 */
export interface Draft {
  id: string;
  title?: string | null;
  folder?: (string | null) | FolderInterface;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "autosave".
 */
export interface Autosave {
  id: string;
  title?: string | null;
  folder?: (string | null) | FolderInterface;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "omitted-from-browse-by".
 */
export interface OmittedFromBrowseBy {
  id: string;
  title?: string | null;
  folder?: (string | null) | FolderInterface;
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
        relationTo: 'posts';
        value: string | Post;
      } | null)
    | ({
        relationTo: 'media';
        value: string | Media;
      } | null)
    | ({
        relationTo: 'drafts';
        value: string | Draft;
      } | null)
    | ({
        relationTo: 'autosave';
        value: string | Autosave;
      } | null)
    | ({
        relationTo: 'omitted-from-browse-by';
        value: string | OmittedFromBrowseBy;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'payload-folders';
        value: string | FolderInterface;
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
  heroImage?: T;
  relatedAutosave?: T;
  folder?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  folder?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "drafts_select".
 */
export interface DraftsSelect<T extends boolean = true> {
  title?: T;
  folder?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "autosave_select".
 */
export interface AutosaveSelect<T extends boolean = true> {
  title?: T;
  folder?: T;
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "omitted-from-browse-by_select".
 */
export interface OmittedFromBrowseBySelect<T extends boolean = true> {
  title?: T;
  folder?: T;
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
 * via the `definition` "payload-folders_select".
 */
export interface PayloadFoldersSelect<T extends boolean = true> {
  name?: T;
  folder?: T;
  documentsAndFolders?: T;
  folderType?: T;
  folderSlug?: T;
  updatedAt?: T;
  createdAt?: T;
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
  title?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "global_select".
 */
export interface GlobalSelect<T extends boolean = true> {
  title?: T;
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

---[FILE: shared.ts]---
Location: payload-main/test/folders/shared.ts

```typescript
export const postSlug = 'posts'
export const omittedFromBrowseBySlug = 'omitted-from-browse-by'
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/folders/tsconfig.eslint.json

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
Location: payload-main/test/folders/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/collections/Autosave/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Autosave: CollectionConfig = {
  slug: 'autosave',
  admin: {
    useAsTitle: 'title',
  },
  folders: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: {
    drafts: {
      autosave: true,
    },
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/collections/Drafts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Drafts: CollectionConfig = {
  slug: 'drafts',
  admin: {
    useAsTitle: 'title',
  },
  folders: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/collections/Media/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    adminThumbnail: ({ doc }) => {
      if (doc.testAdminThumbnail && typeof doc.testAdminThumbnail === 'string') {
        return doc.testAdminThumbnail
      }
      return null
    },
  },
  folders: true,
  fields: [
    {
      name: 'testAdminThumbnail',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/collections/OmittedFromBrowseBy/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { omittedFromBrowseBySlug } from '../../shared.js'

export const OmittedFromBrowseBy: CollectionConfig = {
  slug: omittedFromBrowseBySlug,
  labels: {
    singular: 'Omitted From Browse By',
    plural: 'Omitted From Browse By',
  },
  admin: {
    useAsTitle: 'title',
  },
  folders: {
    browseByFolder: false,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/collections/Posts/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { postSlug } from '../../shared.js'

export const Posts: CollectionConfig = {
  slug: postSlug,
  admin: {
    useAsTitle: 'title',
  },
  folders: true,
  trash: true,
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'relatedAutosave',
      type: 'relationship',
      relationTo: 'autosave',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/folders/seed/index.ts

```typescript
import type { Config, Payload } from 'payload'

import type { FolderInterface, Post } from '../payload-types.js'

import { devUser } from '../../credentials.js'

async function createPost(payload: Payload, { title, folder }: any): Promise<Post> {
  return payload.create({
    collection: 'posts',
    data: {
      title,
      folder,
    },
  })
}

async function createFolder(
  payload: Payload,
  { name, folder }: Pick<FolderInterface, 'folder' | 'name'>,
): Promise<FolderInterface> {
  return payload.create({
    collection: 'payload-folders',
    data: {
      name,
      folder,
    },
  })
}

export const seed: NonNullable<Config['onInit']> = async (payload) => {
  await payload.create({
    collection: 'users',
    data: {
      email: devUser.email,
      password: devUser.password,
    },
  })

  for (let i = 0; i < 12; i++) {
    await createPost(payload, {
      title: `Post ${i}`,
      folder: undefined,
    })
  }

  for (let i = 0; i < 12; i++) {
    await createFolder(payload, {
      name: `Folder ${i}`,
      folder: undefined,
    })
  }
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/folders-browse-by-disabled/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { Posts } from './collections/Posts/index.js'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  folders: {
    // debug: true,
    collectionOverrides: [
      ({ collection }) => {
        return collection
      },
    ],
    browseByFolder: false,
  },
  collections: [Posts],
  globals: [
    {
      slug: 'global',
      fields: [
        {
          name: 'title',
          type: 'text',
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
    // await seed(payload)
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/folders-browse-by-disabled/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { reInitializeDB } from 'helpers/reInitializeDB.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch } from '../helpers.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Browse By Folders Disabled', () => {
  let page: Page
  let serverURL: string

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    const { serverURL: serverFromInit } = await initPayloadE2ENoConfig({ dirname })
    serverURL = serverFromInit

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)
    await ensureCompilationIsDone({ page, serverURL })
  })

  test.beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'BrowseByFoldersDisabledTest',
    })
  })

  test('should not show the browse-by-folder button in the nav', async () => {
    await page.goto(`${serverURL}/admin`)
    await page.locator('#nav-toggler button.nav-toggler').click()
    await expect(page.locator('#nav-toggler button.nav-toggler--is-open')).toBeVisible()
    await expect(page.locator('.browse-by-folder-button')).toBeHidden()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/folders-browse-by-disabled/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import type { NextRESTClient } from '../helpers/NextRESTClient.js'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
let payload: Payload
let restClient: NextRESTClient

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('folders', () => {
  beforeAll(async () => {
    ;({ payload, restClient } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  beforeEach(async () => {
    await payload.delete({
      collection: 'posts',
      depth: 0,
      where: {
        id: {
          exists: true,
        },
      },
    })
    await payload.delete({
      collection: 'payload-folders',
      depth: 0,
      where: {
        id: {
          exists: true,
        },
      },
    })
  })

  describe('folder > subfolder querying', () => {
    it('should populate subfolders for folder by ID', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
        },
      })
      const folderIDFromParams = parentFolder.id

      await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Nested 1',
          folder: folderIDFromParams,
        },
      })

      await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Nested 2',
          folder: folderIDFromParams,
        },
      })

      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: folderIDFromParams,
      })

      expect(parentFolderQuery.documentsAndFolders.docs).toHaveLength(2)
    })
  })

  describe('folder > file querying', () => {
    it('should populate files for folder by ID', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
        },
      })
      const folderIDFromParams = parentFolder.id

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 1',
          folder: folderIDFromParams,
        },
      })

      await payload.create({
        collection: 'posts',
        data: {
          title: 'Post 2',
          folder: folderIDFromParams,
        },
      })

      const parentFolderQuery = await payload.findByID({
        collection: 'payload-folders',
        id: folderIDFromParams,
      })

      expect(parentFolderQuery.documentsAndFolders.docs).toHaveLength(2)
    })
  })

  describe('hooks', () => {
    it('reparentChildFolder should change the child after updating the parent', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
        },
      })

      const childFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Child Folder',
          folder: parentFolder,
        },
      })

      await payload.update({
        collection: 'payload-folders',
        data: { folder: childFolder },
        id: parentFolder.id,
      })

      const parentAfter = await payload.findByID({
        collection: 'payload-folders',
        id: parentFolder.id,
        depth: 0,
      })
      const childAfter = await payload.findByID({
        collection: 'payload-folders',
        id: childFolder.id,
        depth: 0,
      })
      expect(childAfter.folder).toBeFalsy()
      expect(parentAfter.folder).toBe(childFolder.id)
    })

    it('dissasociateAfterDelete should delete _folder value in children after deleting the folder', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
        },
      })

      const post = await payload.create({ collection: 'posts', data: { folder: parentFolder } })

      await payload.delete({ collection: 'payload-folders', id: parentFolder.id })
      const postAfter = await payload.findByID({ collection: 'posts', id: post.id })
      expect(postAfter.folder).toBeFalsy()
    })

    it('deleteSubfoldersBeforeDelete deletes subfolders after deleting the parent folder', async () => {
      const parentFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Parent Folder',
        },
      })
      const childFolder = await payload.create({
        collection: 'payload-folders',
        data: {
          name: 'Child Folder',
          folder: parentFolder,
        },
      })

      await payload.delete({ collection: 'payload-folders', id: parentFolder.id })

      await expect(
        payload.findByID({
          collection: 'payload-folders',
          id: childFolder.id,
          disableErrors: true,
        }),
      ).resolves.toBeNull()
    })
  })
})
```

--------------------------------------------------------------------------------

````
