---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 512
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 512 of 695)

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

---[FILE: postgres-logs.int.spec.ts]---
Location: payload-main/test/access-control/postgres-logs.int.spec.ts

```typescript
import type { CollectionPermission, Payload, PayloadRequest } from 'payload'

/* eslint-disable jest/require-top-level-describe */
import assert from 'assert'
import path from 'path'
import { createLocalReq } from 'payload'
import { getEntityPermissions } from 'payload/internal'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { whereCacheSameSlug, whereCacheUniqueSlug } from './shared.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const describePostgres = process.env.PAYLOAD_DATABASE?.startsWith('postgres')
  ? describe
  : describe.skip

let payload: Payload
let req: PayloadRequest

describePostgres('Access Control - postgres logs', () => {
  beforeAll(async () => {
    const initialized = await initPayloadInt(
      dirname,
      undefined,
      undefined,
      'config.postgreslogs.ts',
    )
    assert(initialized.payload)
    assert(initialized.restClient)
    ;({ payload } = initialized)

    req = await createLocalReq(
      {
        user: {
          id: 123 as any,
          collection: 'users',
          roles: ['admin'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          email: 'test@test.com',
        },
      },
      payload,
    )
  })

  afterAll(async () => {
    if (payload) {
      await payload.destroy()
    }
  })

  describe('Tests', () => {
    describe('where query cache - same where queries', () => {
      it('should cache identical where queries across operations, without passing data (2 DB calls total)', async () => {
        const doc = await payload.create({
          collection: whereCacheSameSlug,
          data: {
            title: 'Test Document',
            userRole: 'admin',
          },
        })

        const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Get permissions - all operations return same where query
        const permissions = await getEntityPermissions({
          id: doc.id,
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheSameSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: true,
          req,
        })

        // 1 db call across all operations due to cache, + 1 for the document fetch
        expect(consoleCount).toHaveBeenCalledTimes(2)

        consoleCount.mockRestore()

        expect(permissions).toEqual({
          fields: {
            title: { read: { permission: true }, update: { permission: true } },
            userRole: { read: { permission: true }, update: { permission: true } },
            updatedAt: { read: { permission: true }, update: { permission: true } },
            createdAt: { read: { permission: true }, update: { permission: true } },
          },
          read: { permission: true, where: { userRole: { equals: 'admin' } } },
          update: { permission: true, where: { userRole: { equals: 'admin' } } },
          delete: { permission: true, where: { userRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })

      it('should cache identical where queries across operations, with passing data (1 DB call total)', async () => {
        const doc = await payload.create({
          collection: whereCacheSameSlug,
          data: {
            title: 'Test Document',
            userRole: 'noAccess',
          },
        })

        const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Get permissions - all operations return same where query
        const permissions = await getEntityPermissions({
          id: doc.id,
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheSameSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: true,
          req,
          data: doc,
        })

        // 1 db call across all operations due to cache
        expect(consoleCount).toHaveBeenCalledTimes(1)

        consoleCount.mockRestore()

        expect(permissions).toEqual({
          fields: {
            title: { read: { permission: false }, update: { permission: false } },
            userRole: { read: { permission: false }, update: { permission: false } },
            updatedAt: { read: { permission: false }, update: { permission: false } },
            createdAt: { read: { permission: false }, update: { permission: false } },
          },
          read: { permission: false, where: { userRole: { equals: 'admin' } } },
          update: { permission: false, where: { userRole: { equals: 'admin' } } },
          delete: { permission: false, where: { userRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })
    })

    describe('where query cache - unique where queries', () => {
      it('should handle unique where queries per operation (1 DB call per operation)', async () => {
        const doc = await payload.create({
          collection: whereCacheUniqueSlug,
          data: {
            title: 'Test Document',
            readRole: 'admin',
            updateRole: 'noAccess',
            deleteRole: 'admin',
          },
        })

        const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Get permissions - each operation returns unique where query
        const permissions = await getEntityPermissions({
          id: doc.id,
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheUniqueSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: true,
          req,
        })

        // 3 access control operations with unique where + 1 for the document fetch, since we're not passing data.
        expect(consoleCount).toHaveBeenCalledTimes(4)
        consoleCount.mockRestore()

        expect(permissions).toEqual({
          fields: {
            title: { read: { permission: true }, update: { permission: false } },
            readRole: { read: { permission: true }, update: { permission: false } },
            updateRole: { read: { permission: true }, update: { permission: false } },
            deleteRole: { read: { permission: true }, update: { permission: false } },
            updatedAt: { read: { permission: true }, update: { permission: false } },
            createdAt: { read: { permission: true }, update: { permission: false } },
          },
          read: { permission: true, where: { readRole: { equals: 'admin' } } },
          update: { permission: false, where: { updateRole: { equals: 'admin' } } },
          delete: { permission: true, where: { deleteRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })

      it('should handle unique where queries per operation (1 DB call per operation), no data fetch when passing data', async () => {
        const doc = await payload.create({
          collection: whereCacheUniqueSlug,
          data: {
            title: 'Test Document',
            readRole: 'admin',
            updateRole: 'noAccess',
            deleteRole: 'admin',
          },
        })

        const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Get permissions - each operation returns unique where query
        const permissions = await getEntityPermissions({
          id: doc.id,
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheUniqueSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: true,
          req,
          data: doc,
        })

        // 3 access control operations with unique where, no data fetch since we're passing data
        expect(consoleCount).toHaveBeenCalledTimes(3)
        consoleCount.mockRestore()

        expect(permissions).toEqual({
          fields: {
            title: { read: { permission: true }, update: { permission: false } },
            readRole: { read: { permission: true }, update: { permission: false } },
            updateRole: { read: { permission: true }, update: { permission: false } },
            deleteRole: { read: { permission: true }, update: { permission: false } },
            updatedAt: { read: { permission: true }, update: { permission: false } },
            createdAt: { read: { permission: true }, update: { permission: false } },
          },
          read: { permission: true, where: { readRole: { equals: 'admin' } } },
          update: { permission: false, where: { updateRole: { equals: 'admin' } } },
          delete: { permission: true, where: { deleteRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })

      it('should return correct permissions with mixed results', async () => {
        const doc = await payload.create({
          collection: whereCacheUniqueSlug,
          data: {
            title: 'Test Document 2',
            readRole: 'noAccess',
            updateRole: 'admin',
            deleteRole: 'noAccess',
          },
        })

        const permissions = await getEntityPermissions({
          id: doc.id,
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheUniqueSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: true,
          req,
        })

        expect(permissions).toEqual({
          fields: {
            title: { read: { permission: false }, update: { permission: true } },
            readRole: { read: { permission: false }, update: { permission: true } },
            updateRole: { read: { permission: false }, update: { permission: true } },
            deleteRole: { read: { permission: false }, update: { permission: true } },
            updatedAt: { read: { permission: false }, update: { permission: true } },
            createdAt: { read: { permission: false }, update: { permission: true } },
          },
          read: { permission: false, where: { readRole: { equals: 'admin' } } },
          delete: { permission: false, where: { deleteRole: { equals: 'admin' } } },
          update: { permission: true, where: { updateRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })

      it('ensure no db calls when fetchData is false', async () => {
        const _doc = await payload.create({
          collection: whereCacheUniqueSlug,
          data: {
            title: 'Test Document',
            readRole: 'admin',
            updateRole: 'noAccess',
            deleteRole: 'admin',
          },
        })

        const consoleCount = jest.spyOn(console, 'log').mockImplementation(() => {})

        // Get permissions - each operation returns unique where query
        const permissions = await getEntityPermissions({
          blockReferencesPermissions: {} as any,
          entity: payload.collections[whereCacheUniqueSlug].config,
          entityType: 'collection',
          operations: ['read', 'update', 'delete'],
          fetchData: false,
          req,
        })

        expect(consoleCount).toHaveBeenCalledTimes(0)
        consoleCount.mockRestore()

        expect(permissions).toEqual({
          // TODO: Permissions currently default to true when fetchData is false, this should be changed to false in 4.0.
          fields: {
            title: { read: { permission: true }, update: { permission: true } },
            readRole: { read: { permission: true }, update: { permission: true } },
            updateRole: { read: { permission: true }, update: { permission: true } },
            deleteRole: { read: { permission: true }, update: { permission: true } },
            updatedAt: { read: { permission: true }, update: { permission: true } },
            createdAt: { read: { permission: true }, update: { permission: true } },
          },
          read: { permission: true, where: { readRole: { equals: 'admin' } } },
          update: { permission: true, where: { updateRole: { equals: 'admin' } } },
          delete: { permission: true, where: { deleteRole: { equals: 'admin' } } },
        } satisfies CollectionPermission)
      })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: shared.ts]---
Location: payload-main/test/access-control/shared.ts

```typescript
export const firstArrayText = 'first-array-text'
export const secondArrayText = 'second-array-text'

export const slug = 'posts'
export const unrestrictedSlug = 'unrestricted'
export const readOnlySlug = 'read-only-collection'
export const readOnlyGlobalSlug = 'read-only-global'
export const hooksSlug = 'hooks'
export const blocksFieldAccessSlug = 'blocks-field-access'

export const userRestrictedCollectionSlug = 'user-restricted-collection'
export const fullyRestrictedSlug = 'fully-restricted'
export const createNotUpdateCollectionSlug = 'create-not-update-collection'
export const userRestrictedGlobalSlug = 'user-restricted-global'
export const readNotUpdateGlobalSlug = 'read-not-update-global'
export const restrictedVersionsSlug = 'restricted-versions'
export const restrictedVersionsAdminPanelSlug = 'restricted-versions-admin-panel'
export const siblingDataSlug = 'sibling-data'
export const relyOnRequestHeadersSlug = 'rely-on-request-headers'
export const docLevelAccessSlug = 'doc-level-access'
export const hiddenFieldsSlug = 'hidden-fields'
export const hiddenAccessSlug = 'hidden-access'
export const hiddenAccessCountSlug = 'hidden-access-count'
export const disabledSlug = 'disabled'

export const nonAdminEmail = 'no-admin-access@payloadcms.com'
export const publicUserEmail = 'public-user@payloadcms.com'
export const publicUsersSlug = 'public-users'

export const authSlug = 'auth-collection'

export const whereCacheSameSlug = 'where-cache-same'
export const whereCacheUniqueSlug = 'where-cache-unique'
export const asyncParentSlug = 'async-parent'
```

--------------------------------------------------------------------------------

---[FILE: TestButton.tsx]---
Location: payload-main/test/access-control/TestButton.tsx
Signals: React

```typescript
'use client'

import { useAuth, useForm, useTranslation } from '@payloadcms/ui'
import React from 'react'

export const TestButton: React.FC = () => {
  const { refreshPermissions } = useAuth()
  const { submit } = useForm()
  const { t } = useTranslation()
  const label = t('general:save')

  return (
    <button
      id="action-save"
      onClick={(e) => {
        e.preventDefault()

        void refreshPermissions()
        void submit()
      }}
      type="submit"
    >
      Custom: {label}
    </button>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: tsconfig.eslint.json]---
Location: payload-main/test/access-control/tsconfig.eslint.json

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
Location: payload-main/test/access-control/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/Auth/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { authSlug } from '../../shared.js'

export const Auth: CollectionConfig = {
  slug: authSlug,
  auth: {
    verify: true,
    // loginWithUsername: {
    //   requireEmail: true,
    //   allowEmailLogin: true,
    // },
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      access: {
        update: ({ req: { user }, data }) => {
          const isUserOrSelf =
            (user && 'roles' in user && user?.roles?.includes('admin')) ||
            (user?.id === data?.id && user?.collection === 'auth-collection')
          return isUserOrSelf
        },
      },
    },
    // {
    //   name: 'username',
    //   type: 'text',
    //   access: {
    //     update: () => false,
    //   },
    // },
    {
      name: 'password',
      type: 'text',
      hidden: true,
      access: {
        update: ({ req: { user }, data }) => {
          const isUserOrSelf =
            (user && 'roles' in user && user?.roles?.includes('admin')) || user?.id === data?.id
          return isUserOrSelf
        },
      },
    },
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['admin', 'user'],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/BlocksFieldAccess/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { blocksFieldAccessSlug } from '../../shared.js'

export const BlocksFieldAccess: CollectionConfig = {
  slug: blocksFieldAccessSlug,
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // Block field with normal blocks - NO access control (should be fully editable)
    {
      type: 'blocks',
      name: 'editableBlocks',
      blocks: [
        {
          slug: 'testBlock',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'content',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    // Block field with normal blocks - WITH access control (should be read-only)
    {
      type: 'blocks',
      name: 'readOnlyBlocks',
      access: {
        read: () => true,
        create: () => false,
        update: () => false,
      },
      blocks: [
        {
          slug: 'testBlock2',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'content',
              type: 'textarea',
            },
          ],
        },
      ],
    },
    // Block field with block references - NO access control (should be fully editable)
    {
      type: 'blocks',
      name: 'editableBlockRefs',
      blocks: [],
      blockReferences: ['titleblock'],
    },
    // Block field with block references - WITH access control (should be read-only)
    {
      type: 'blocks',
      name: 'readOnlyBlockRefs',
      access: {
        read: () => true,
        create: () => false,
        update: () => false,
      },
      blocks: [],
      blockReferences: ['titleblock'],
    },
    // Test tab with read-only blocks fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Tab Read-Only Test',
          name: 'tabReadOnlyTest',
          fields: [
            // Block field with normal blocks - WITH access control (should be read-only) - IN TAB
            {
              type: 'blocks',
              name: 'tabReadOnlyBlocks',
              access: {
                read: () => true,
                create: () => false,
                update: () => false,
              },
              blocks: [
                {
                  slug: 'testBlock3',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                    },
                    {
                      name: 'content',
                      type: 'textarea',
                    },
                  ],
                },
              ],
            },
            // Block field with block references - WITH access control (should be read-only) - IN TAB
            {
              type: 'blocks',
              name: 'tabReadOnlyBlockRefs',
              access: {
                read: () => true,
                create: () => false,
                update: () => false,
              },
              blocks: [],
              blockReferences: ['titleblock'],
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/Disabled/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import { disabledSlug } from '../../shared.js'

const disabledFromUpdateAccessControl = (fieldName = 'text'): Field => ({
  name: fieldName,
  type: 'text',
  access: {
    update: () => {
      return false
    },
  },
})

export const Disabled: CollectionConfig = {
  slug: disabledSlug,
  fields: [
    {
      name: 'group',
      type: 'group',
      fields: [disabledFromUpdateAccessControl()],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'namedTab',
          fields: [disabledFromUpdateAccessControl()],
        },
        {
          fields: [disabledFromUpdateAccessControl('unnamedTab')],
          label: 'unnamedTab',
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      fields: [disabledFromUpdateAccessControl()],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/hooks/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { hooksSlug } from '../../shared.js'

export const Hooks: CollectionConfig = {
  slug: hooksSlug,
  access: {
    update: () => true,
  },
  fields: [
    {
      name: 'cannotMutateRequired',
      type: 'text',
      access: {
        update: () => false,
      },
      required: true,
    },
    {
      name: 'cannotMutateNotRequired',
      type: 'text',
      access: {
        update: () => false,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) {
              return 'no value found'
            }
            return value
          },
        ],
      },
    },
    {
      name: 'canMutate',
      type: 'text',
      access: {
        update: () => true,
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/ReadRestricted/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { unrestrictedSlug } from '../../shared.js'

export const readRestrictedSlug = 'read-restricted'

export const ReadRestricted: CollectionConfig = {
  slug: readRestrictedSlug,
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    groupBy: true,
    defaultColumns: [
      'restrictedTopLevel',
      'visibleTopLevel',
      'contactInfo.secretPhone',
      'contactInfo.publicPhone',
      'settings.restrictedSetting',
    ],
  },
  fields: [
    // Top-level restricted field
    {
      name: 'restrictedTopLevel',
      type: 'text',
      access: {
        read: () => false,
      },
    },
    // Top-level visible field
    {
      name: 'visibleTopLevel',
      type: 'text',
    },
    // Group with restricted nested field
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'secretPhone',
          type: 'text',
          access: {
            read: () => false,
          },
        },
        {
          name: 'publicPhone',
          type: 'text',
        },
        {
          name: 'virtualContactName',
          type: 'text',
          virtual: 'unrestricted.name',
        },
        {
          name: 'restrictedVirtualContactInfo',
          type: 'text',
          virtual: 'unrestricted.name',
          access: {
            read: () => false,
          },
        },
      ],
    },
    // Row with restricted field
    {
      type: 'row',
      fields: [
        {
          name: 'visibleInRow',
          type: 'text',
        },
        {
          name: 'restrictedInRow',
          type: 'text',
          access: {
            read: () => false,
          },
        },
      ],
    },
    // Collapsible with restricted field
    {
      type: 'collapsible',
      label: 'Additional Info',
      fields: [
        {
          name: 'visibleInCollapsible',
          type: 'text',
        },
        {
          name: 'restrictedInCollapsible',
          type: 'text',
          access: {
            read: () => false,
          },
        },
      ],
    },
    // Array with restricted fields
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'secretDescription',
          type: 'textarea',
          access: {
            read: () => false,
          },
        },
        {
          name: 'publicDescription',
          type: 'textarea',
        },
      ],
    },
    // Tabs with restricted fields
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Public Tab',
          fields: [
            {
              name: 'publicData',
              type: 'text',
            },
            {
              name: 'secretInPublicTab',
              type: 'text',
              access: {
                read: () => false,
              },
            },
          ],
        },
        {
          label: 'Settings',
          name: 'settings',
          fields: [
            {
              name: 'visibleSetting',
              type: 'checkbox',
            },
            {
              name: 'restrictedSetting',
              type: 'checkbox',
              access: {
                read: () => false,
              },
            },
          ],
        },
      ],
    },
    // Deeply nested: Group > Group with restricted field
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'analytics',
          type: 'group',
          fields: [
            {
              name: 'visibleMetric',
              type: 'number',
            },
            {
              name: 'restrictedMetric',
              type: 'number',
              access: {
                read: () => false,
              },
            },
          ],
        },
      ],
    },
    // Group with row inside with restricted field
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
            },
            {
              name: 'secretPostalCode',
              type: 'text',
              access: {
                read: () => false,
              },
            },
          ],
        },
      ],
    },
    // Collapsible with group inside with restricted field
    {
      type: 'collapsible',
      label: 'Advanced Settings',
      fields: [
        {
          name: 'advanced',
          type: 'group',
          fields: [
            {
              name: 'visibleAdvanced',
              type: 'text',
            },
            {
              name: 'restrictedAdvanced',
              type: 'text',
              access: {
                read: () => false,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'unrestricted',
      type: 'relationship',
      relationTo: unrestrictedSlug,
    },
    {
      name: 'unrestrictedVirtualFieldName',
      type: 'text',
      virtual: 'unrestricted.name',
    },
    {
      name: 'unrestrictedVirtualGroupInfo',
      type: 'group',
      virtual: 'unrestricted.info',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'restrictedVirtualField',
      type: 'text',
      virtual: 'unrestricted.name',
      access: {
        read: () => false,
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/test/access-control/collections/ReadRestricted/seed.ts

```typescript
import type { Payload } from 'payload'

import { readRestrictedSlug } from './index.js'

export const seedReadRestricted = async (payload: Payload): Promise<void> => {
  await payload.create({
    collection: readRestrictedSlug,
    data: {
      // Top-level fields
      restrictedTopLevel: 'This should be hidden',
      visibleTopLevel: 'This is visible to everyone',

      // Group fields
      contactInfo: {
        email: 'contact@example.com',
        secretPhone: '+1-555-SECRET',
        publicPhone: '+1-555-PUBLIC',
      },

      // Row fields
      visibleInRow: 'Visible row data',
      restrictedInRow: 'Hidden row data',

      // Collapsible fields
      visibleInCollapsible: 'Visible collapsible data',
      restrictedInCollapsible: 'Hidden collapsible data',

      // Array fields
      items: [
        {
          title: 'Item 1',
          secretDescription: 'Secret details about item 1',
          publicDescription: 'Public details about item 1',
        },
        {
          title: 'Item 2',
          secretDescription: 'Secret details about item 2',
          publicDescription: 'Public details about item 2',
        },
        {
          title: 'Item 3',
          secretDescription: 'Secret details about item 3',
          publicDescription: 'Public details about item 3',
        },
      ],

      // Tab fields
      publicData: 'Public tab information',
      secretInPublicTab: 'Secret in public tab',
      settings: {
        visibleSetting: true,
        restrictedSetting: true,
      },

      // Deeply nested group fields
      metadata: {
        analytics: {
          visibleMetric: 1000,
          restrictedMetric: 9999,
        },
      },

      // Group with row inside
      address: {
        street: '123 Main Street',
        city: 'Springfield',
        secretPostalCode: '12345-SECRET',
      },

      // Collapsible with group inside
      advanced: {
        visibleAdvanced: 'Visible advanced setting',
        restrictedAdvanced: 'Hidden advanced setting',
      },
    },
  })

  await payload.create({
    collection: readRestrictedSlug,
    data: {
      restrictedTopLevel: 'Another hidden top level',
      visibleTopLevel: 'Another visible field',
      contactInfo: {
        email: 'info@example.com',
        secretPhone: '+1-555-HIDDEN',
        publicPhone: '+1-555-VISIBLE',
      },
      visibleInRow: 'Row visible text',
      restrictedInRow: 'Row hidden text',
      visibleInCollapsible: 'Collapsible visible',
      restrictedInCollapsible: 'Collapsible hidden',
      items: [
        {
          title: 'Product A',
          secretDescription: 'Confidential product info',
          publicDescription: 'Public product description',
        },
      ],
      publicData: 'More public data',
      secretInPublicTab: 'More secret data',
      settings: {
        visibleSetting: false,
        restrictedSetting: false,
      },
      metadata: {
        analytics: {
          visibleMetric: 2500,
          restrictedMetric: 8888,
        },
      },
      address: {
        street: '456 Oak Avenue',
        city: 'Portland',
        secretPostalCode: '67890-SECRET',
      },
      advanced: {
        visibleAdvanced: 'Public advanced config',
        restrictedAdvanced: 'Private advanced config',
      },
    },
  })

  await payload.create({
    collection: readRestrictedSlug,
    data: {
      restrictedTopLevel: 'Third hidden value',
      visibleTopLevel: 'Third visible value',
      contactInfo: {
        email: 'support@example.com',
        secretPhone: '+1-555-PRIVATE',
        publicPhone: '+1-555-SUPPORT',
      },
      visibleInRow: 'Third row visible',
      restrictedInRow: 'Third row hidden',
      visibleInCollapsible: 'Third collapsible visible',
      restrictedInCollapsible: 'Third collapsible hidden',
      items: [],
      publicData: 'Third public data',
      secretInPublicTab: 'Third secret data',
      settings: {
        visibleSetting: true,
        restrictedSetting: false,
      },
      metadata: {
        analytics: {
          visibleMetric: 750,
          restrictedMetric: 5555,
        },
      },
      address: {
        street: '789 Pine Road',
        city: 'Seattle',
        secretPostalCode: '54321-SECRET',
      },
      advanced: {
        visibleAdvanced: 'Third advanced visible',
        restrictedAdvanced: 'Third advanced hidden',
      },
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/Regression-1/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Regression1: CollectionConfig = {
  slug: 'regression1',
  access: {
    create: () => false,
    read: () => true,
  },
  fields: [
    {
      name: 'group1',
      type: 'group',
      fields: [
        {
          name: 'richText1',
          type: 'richText',
          editor: lexicalEditor(),
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'tab1',
          fields: [
            {
              name: 'richText2',
              type: 'richText',
              editor: lexicalEditor(),
            },
            {
              name: 'blocks2',
              type: 'blocks',
              blocks: [
                {
                  slug: 'myBlock',
                  fields: [
                    {
                      name: 'richText3',
                      type: 'richText',
                      editor: lexicalEditor(),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'tab2',
          fields: [
            {
              name: 'richText4',
              type: 'richText',
              editor: lexicalEditor(),
            },
            {
              name: 'blocks3',
              type: 'blocks',
              blocks: [
                {
                  slug: 'myBlock2',
                  fields: [
                    {
                      name: 'richText5',
                      type: 'richText',
                      editor: lexicalEditor(),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      fields: [
        {
          name: 'art',
          type: 'richText',
          editor: lexicalEditor(),
        },
      ],
    },
    {
      name: 'arrayWithAccessFalse',
      type: 'array',
      access: {
        update: () => false,
      },
      fields: [
        {
          name: 'richText6',
          type: 'richText',
          editor: lexicalEditor(),
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'myBlock3',
          fields: [
            {
              name: 'richText7',
              type: 'richText',
              editor: lexicalEditor(),
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/Regression-2/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Regression2: CollectionConfig = {
  slug: 'regression2',
  fields: [
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'richText1',
          type: 'richText',
          editor: lexicalEditor(),
        },
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'array',
      type: 'array',
      access: {
        update: () => false,
      },
      fields: [
        {
          name: 'richText2',
          type: 'richText',
          editor: lexicalEditor(),
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/access-control/collections/RichText/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const RichText: CollectionConfig = {
  slug: 'rich-text',
  fields: [
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'richText',
          fields: [
            {
              name: 'richText',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

````
