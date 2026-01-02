---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 647
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 647 of 695)

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
Location: payload-main/test/query-presets/int.spec.ts

```typescript
import type { Payload, User } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { devUser, regularUser } from '../credentials.js'
import { initPayloadInt } from '../helpers/initPayloadInt.js'

const queryPresetsCollectionSlug = 'payload-query-presets'

let payload: Payload
let adminUser: User
let editorUser: User
let publicUser: User

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Query Presets', () => {
  beforeAll(async () => {
    // @ts-expect-error: initPayloadInt does not have a proper type definition
    ;({ payload } = await initPayloadInt(dirname))

    adminUser = await payload
      .login({
        collection: 'users',
        data: {
          email: devUser.email,
          password: devUser.password,
        },
      })
      ?.then((result) => result.user)

    editorUser = await payload
      .login({
        collection: 'users',
        data: {
          email: regularUser.email,
          password: regularUser.password,
        },
      })
      ?.then((result) => result.user)

    publicUser = await payload
      .login({
        collection: 'users',
        data: {
          email: 'public@email.com',
          password: regularUser.password,
        },
      })
      ?.then((result) => result.user)
  })

  afterAll(async () => {
    await payload.destroy()
  })

  describe('default access control', () => {
    it('should only allow logged in users to perform actions', async () => {
      // create
      try {
        const result = await payload.create({
          collection: queryPresetsCollectionSlug,
          user: undefined,
          overrideAccess: false,
          data: {
            title: 'Only Logged In Users',
            relatedCollection: 'pages',
          },
        })

        expect(result).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }

      const { id } = await payload.create({
        collection: queryPresetsCollectionSlug,
        data: {
          title: 'Only Logged In Users',
          relatedCollection: 'pages',
        },
      })

      // read
      try {
        const result = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: undefined,
          overrideAccess: false,
          id,
        })

        expect(result).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }

      // update
      try {
        const result = await payload.update({
          collection: queryPresetsCollectionSlug,
          id,
          user: undefined,
          overrideAccess: false,
          data: {
            title: 'Only Logged In Users (Updated)',
          },
        })

        expect(result).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')

        // make sure the update didn't go through
        const preset = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          id,
        })

        expect(preset.title).toBe('Only Logged In Users')
      }

      // delete
      try {
        const result = await payload.delete({
          collection: queryPresetsCollectionSlug,
          id: 'some-id',
          user: undefined,
          overrideAccess: false,
        })

        expect(result).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')

        // make sure the delete didn't go through
        const preset = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          id,
        })

        expect(preset.title).toBe('Only Logged In Users')
      }
    })

    it('should respect access when set to "specificUsers"', async () => {
      const presetForSpecificUsers = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Specific Users',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'specificUsers',
              users: [adminUser.id],
            },
            update: {
              constraint: 'specificUsers',
              users: [adminUser.id],
            },
          },
          relatedCollection: 'pages',
        },
      })

      const foundPresetWithUser1 = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: presetForSpecificUsers.id,
      })

      expect(foundPresetWithUser1.id).toBe(presetForSpecificUsers.id)

      try {
        const foundPresetWithEditorUser = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: editorUser,
          overrideAccess: false,
          id: presetForSpecificUsers.id,
        })

        expect(foundPresetWithEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('Not Found')
      }

      const presetUpdatedByAdminUser = await payload.update({
        collection: queryPresetsCollectionSlug,
        id: presetForSpecificUsers.id,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Specific Users (Updated)',
        },
      })

      expect(presetUpdatedByAdminUser.title).toBe('Specific Users (Updated)')

      try {
        const presetUpdatedByEditorUser = await payload.update({
          collection: queryPresetsCollectionSlug,
          id: presetForSpecificUsers.id,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'Specific Users (Updated)',
          },
        })

        expect(presetUpdatedByEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }
    })

    it('should respect access when set to "onlyMe"', async () => {
      const presetForOnlyMe = await payload.create({
        collection: queryPresetsCollectionSlug,
        overrideAccess: false,
        user: adminUser,
        data: {
          title: 'Only Me',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'onlyMe',
            },
            update: {
              constraint: 'onlyMe',
            },
          },
          relatedCollection: 'pages',
        },
      })

      const foundPresetWithUser1 = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: presetForOnlyMe.id,
      })

      expect(foundPresetWithUser1.id).toBe(presetForOnlyMe.id)

      try {
        const foundPresetWithEditorUser = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: editorUser,
          overrideAccess: false,
          id: presetForOnlyMe.id,
        })

        expect(foundPresetWithEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('Not Found')
      }

      const presetUpdatedByUser1 = await payload.update({
        collection: queryPresetsCollectionSlug,
        id: presetForOnlyMe.id,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Only Me (Updated)',
        },
      })

      expect(presetUpdatedByUser1.title).toBe('Only Me (Updated)')

      try {
        const presetUpdatedByEditorUser = await payload.update({
          collection: queryPresetsCollectionSlug,
          id: presetForOnlyMe.id,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'Only Me (Updated)',
          },
        })

        expect(presetUpdatedByEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }
    })

    it('should respect access when set to "everyone"', async () => {
      const presetForEveryone = await payload.create({
        collection: queryPresetsCollectionSlug,
        overrideAccess: false,
        user: adminUser,
        data: {
          title: 'Everyone',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'everyone',
            },
            update: {
              constraint: 'everyone',
            },
            delete: {
              constraint: 'everyone',
            },
          },
          relatedCollection: 'pages',
        },
      })

      const foundPresetWithUser1 = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: presetForEveryone.id,
      })

      expect(foundPresetWithUser1.id).toBe(presetForEveryone.id)

      const foundPresetWithEditorUser = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: editorUser,
        overrideAccess: false,
        id: presetForEveryone.id,
      })

      expect(foundPresetWithEditorUser.id).toBe(presetForEveryone.id)

      const presetUpdatedByUser1 = await payload.update({
        collection: queryPresetsCollectionSlug,
        id: presetForEveryone.id,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Everyone (Update 1)',
        },
      })

      expect(presetUpdatedByUser1.title).toBe('Everyone (Update 1)')

      const presetUpdatedByEditorUser = await payload.update({
        collection: queryPresetsCollectionSlug,
        id: presetForEveryone.id,
        user: editorUser,
        overrideAccess: false,
        data: {
          title: 'Everyone (Update 2)',
        },
      })

      expect(presetUpdatedByEditorUser.title).toBe('Everyone (Update 2)')
    })

    it('should prevent accidental lockout', async () => {
      try {
        // create a preset using "specificRoles"
        // this will ensure the user on the request is _NOT_ automatically added to the `users` list
        // and will throw a validation error instead
        const presetWithoutAccess = await payload.create({
          collection: queryPresetsCollectionSlug,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'Prevent Lockout',
            relatedCollection: 'pages',
            access: {
              read: {
                constraint: 'specificRoles',
                roles: ['admin'],
              },
              update: {
                constraint: 'specificRoles',
                roles: ['admin'],
              },
            },
          },
        })

        expect(presetWithoutAccess).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('This action will lock you out of this preset.')
      }

      // create a preset using "specificUsers"
      // this will ensure the user on the request _IS_ automatically added to the `users` list
      // this will avoid a validation error
      const presetWithoutAccess = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Prevent Lockout',
          relatedCollection: 'pages',
          access: {
            read: {
              constraint: 'specificUsers',
              users: [],
            },
            update: {
              constraint: 'specificUsers',
              users: [],
            },
            delete: {
              constraint: 'specificUsers',
              users: [],
            },
          },
        },
      })

      // the user on the request is automatically added to the `users` array
      expect(
        presetWithoutAccess.access?.read?.users?.find(
          (user) => (typeof user === 'string' ? user : user.id) === adminUser.id,
        ),
      ).toBeTruthy()

      expect(
        presetWithoutAccess.access?.update?.users?.find(
          (user) => (typeof user === 'string' ? user : user.id) === adminUser.id,
        ),
      ).toBeTruthy()

      const presetWithUser1 = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Prevent Lockout',
          relatedCollection: 'pages',
          access: {
            read: {
              constraint: 'specificRoles',
              roles: ['admin'],
            },
            update: {
              constraint: 'specificRoles',
              roles: ['admin'],
            },
          },
        },
      })

      // attempt to update the preset to lock the user out of access
      try {
        const presetUpdatedByUser1 = await payload.update({
          collection: queryPresetsCollectionSlug,
          id: presetWithUser1.id,
          user: adminUser,
          overrideAccess: false,
          data: {
            title: 'Prevent Lockout (Updated)',
            access: {
              read: {
                constraint: 'specificRoles',
                roles: ['user'],
              },
              update: {
                constraint: 'specificRoles',
                roles: ['user'],
              },
            },
          },
        })

        expect(presetUpdatedByUser1).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('This action will lock you out of this preset.')
      }
    })
  })

  describe('user-defined access control', () => {
    it('should respect top-level access control overrides', async () => {
      const preset = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Top-Level Access Control Override',
          relatedCollection: 'pages',
          access: {
            read: {
              constraint: 'everyone',
            },
            update: {
              constraint: 'everyone',
            },
            delete: {
              constraint: 'everyone',
            },
          },
        },
      })

      const foundPresetWithUser1 = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: preset.id,
      })

      expect(foundPresetWithUser1.id).toBe(preset.id)

      try {
        const foundPresetWithPublicUser = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: publicUser,
          overrideAccess: false,
          id: preset.id,
        })

        expect(foundPresetWithPublicUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }
    })

    it('should only allow admins to select the "onlyAdmins" preset (via `filterOptions`)', async () => {
      try {
        const presetForAdminsCreatedByEditor = await payload.create({
          collection: queryPresetsCollectionSlug,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'Admins (Created by Editor)',
            where: {
              text: {
                equals: 'example page',
              },
            },
            access: {
              read: {
                constraint: 'onlyAdmins',
              },
              update: {
                constraint: 'onlyAdmins',
              },
            },
            relatedCollection: 'pages',
          },
        })

        expect(presetForAdminsCreatedByEditor).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe(
          'The following fields are invalid: Sharing settings > Read > Specify who can read this Preset, Sharing settings > Update > Specify who can update this Preset',
        )
      }

      const presetForAdminsCreatedByAdmin = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Admins (Created by Admin)',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'onlyAdmins',
            },
            update: {
              constraint: 'onlyAdmins',
            },
          },
          relatedCollection: 'pages',
        },
      })

      expect(presetForAdminsCreatedByAdmin).toBeDefined()

      // attempt to update the preset using an editor user
      try {
        const presetUpdatedByEditorUser = await payload.update({
          collection: queryPresetsCollectionSlug,
          id: presetForAdminsCreatedByAdmin.id,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'From `onlyAdmins` to `onlyMe` (Updated by Editor)',
            access: {
              read: {
                constraint: 'onlyMe',
              },
              update: {
                constraint: 'onlyMe',
              },
            },
          },
        })

        expect(presetUpdatedByEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }
    })

    it('should respect access when set to "specificRoles"', async () => {
      const presetForSpecificRoles = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Specific Roles',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'specificRoles',
              roles: ['admin'],
            },
            update: {
              constraint: 'specificRoles',
              roles: ['admin'],
            },
          },
          relatedCollection: 'pages',
        },
      })

      const foundPresetWithUser1 = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: presetForSpecificRoles.id,
      })

      expect(foundPresetWithUser1.id).toBe(presetForSpecificRoles.id)

      try {
        const foundPresetWithEditorUser = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: editorUser,
          overrideAccess: false,
          id: presetForSpecificRoles.id,
        })

        expect(foundPresetWithEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('Not Found')
      }

      const presetUpdatedByUser1 = await payload.update({
        collection: queryPresetsCollectionSlug,
        id: presetForSpecificRoles.id,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Specific Roles (Updated)',
        },
      })

      expect(presetUpdatedByUser1.title).toBe('Specific Roles (Updated)')

      try {
        const presetUpdatedByEditorUser = await payload.update({
          collection: queryPresetsCollectionSlug,
          id: presetForSpecificRoles.id,
          user: editorUser,
          overrideAccess: false,
          data: {
            title: 'Specific Roles (Updated)',
          },
        })

        expect(presetUpdatedByEditorUser).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('You are not allowed to perform this action.')
      }
    })

    it('should respect boolean access control results', async () => {
      // create a preset with the read constraint set to "noone"
      const presetForNoone = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        data: {
          relatedCollection: 'pages',
          title: 'Noone',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'noone',
            },
          },
        },
      })

      try {
        const foundPresetWithUser1 = await payload.findByID({
          collection: queryPresetsCollectionSlug,
          depth: 0,
          user: adminUser,
          overrideAccess: false,
          id: presetForNoone.id,
        })

        expect(foundPresetWithUser1).toBeFalsy()
      } catch (error: unknown) {
        expect((error as Error).message).toBe('Not Found')
      }
    })
  })

  it.skip('should disable query presets when "enabledQueryPresets" is not true on the collection', async () => {
    try {
      const result = await payload.create({
        collection: 'payload-query-presets',
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Disabled Query Presets',
          relatedCollection: 'pages',
        },
      })

      // TODO: this test always passes because this expect throws an error which is caught and passes the 'catch' block
      expect(result).toBeFalsy()
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  describe('Where object formatting', () => {
    it('transforms "where" query objects into the "and" / "or" format', async () => {
      const result = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Where Object Formatting',
          where: {
            text: {
              equals: 'example page',
            },
          },
          access: {
            read: {
              constraint: 'everyone',
            },
            update: {
              constraint: 'everyone',
            },
            delete: {
              constraint: 'everyone',
            },
          },
          relatedCollection: 'pages',
        },
      })

      expect(result.where).toMatchObject({
        or: [
          {
            and: [
              {
                text: {
                  equals: 'example page',
                },
              },
            ],
          },
        ],
      })
    })

    it('should handle empty where and columns fields', async () => {
      const result = await payload.create({
        collection: queryPresetsCollectionSlug,
        user: adminUser,
        overrideAccess: false,
        data: {
          title: 'Empty Where and Columns',
          // Not including where or columns at all
          access: {
            read: {
              constraint: 'everyone',
            },
            update: {
              constraint: 'everyone',
            },
            delete: {
              constraint: 'everyone',
            },
          },
          relatedCollection: 'pages',
        },
      })

      expect(result.where == null).toBe(true)
      expect(result.columns == null).toBe(true)

      const fetched = await payload.findByID({
        collection: queryPresetsCollectionSlug,
        depth: 0,
        user: adminUser,
        overrideAccess: false,
        id: result.id,
      })

      expect(fetched.where == null).toBe(true)
      expect(fetched.columns == null).toBe(true)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/query-presets/payload-types.ts

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
    users: User;
    'payload-kv': PayloadKv;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
    'payload-query-presets': PayloadQueryPreset;
  };
  collectionsJoins: {};
  collectionsSelect: {
    pages: PagesSelect<false> | PagesSelect<true>;
    posts: PostsSelect<false> | PostsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-kv': PayloadKvSelect<false> | PayloadKvSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
    'payload-query-presets': PayloadQueryPresetsSelect<false> | PayloadQueryPresetsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  fallbackLocale: null;
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
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  text?: string | null;
  postsRelationship?: (string | Post)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: string;
  text?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name?: string | null;
  roles?: ('admin' | 'editor' | 'user')[] | null;
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
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?: {
    relationTo: 'users';
    value: string | User;
  } | null;
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
 * via the `definition` "payload-query-presets".
 */
export interface PayloadQueryPreset {
  id: string;
  title: string;
  isShared?: boolean | null;
  access?: {
    read?: {
      constraint?: ('everyone' | 'onlyMe' | 'specificUsers' | 'specificRoles' | 'noone' | 'onlyAdmins') | null;
      users?: (string | User)[] | null;
      roles?: ('admin' | 'editor' | 'user')[] | null;
    };
    update?: {
      constraint?: ('everyone' | 'onlyMe' | 'specificUsers' | 'specificRoles' | 'onlyAdmins') | null;
      users?: (string | User)[] | null;
      roles?: ('admin' | 'editor' | 'user')[] | null;
    };
    delete?: {
      constraint?: ('everyone' | 'onlyMe' | 'specificUsers') | null;
      users?: (string | User)[] | null;
    };
  };
  where?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  columns?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  groupBy?: string | null;
  relatedCollection: 'pages' | 'posts';
  /**
   * This is a temporary field used to determine if updating the preset would remove the user's access to it. When `true`, this record will be deleted after running the preset's `validate` function.
   */
  isTemp?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  text?: T;
  postsRelationship?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  text?: T;
  updatedAt?: T;
  createdAt?: T;
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
 * via the `definition` "payload-kv_select".
 */
export interface PayloadKvSelect<T extends boolean = true> {
  key?: T;
  data?: T;
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
 * via the `definition` "payload-query-presets_select".
 */
export interface PayloadQueryPresetsSelect<T extends boolean = true> {
  title?: T;
  isShared?: T;
  access?:
    | T
    | {
        read?:
          | T
          | {
              constraint?: T;
              users?: T;
              roles?: T;
            };
        update?:
          | T
          | {
              constraint?: T;
              users?: T;
              roles?: T;
            };
        delete?:
          | T
          | {
              constraint?: T;
              users?: T;
            };
      };
  where?: T;
  columns?: T;
  groupBy?: T;
  relatedCollection?: T;
  isTemp?: T;
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
