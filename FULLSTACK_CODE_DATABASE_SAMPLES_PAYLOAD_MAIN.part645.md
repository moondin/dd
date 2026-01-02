---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 645
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 645 of 695)

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

---[FILE: Customers.ts]---
Location: payload-main/test/plugin-stripe/collections/Customers.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customersSlug } from '../shared.js'

export const Customers: CollectionConfig = {
  slug: customersSlug,
  admin: {
    defaultColumns: ['email', 'name'],
    useAsTitle: 'email',
  },
  auth: {
    useAPIKey: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'subscriptions',
      type: 'array',
      admin: {
        description:
          'All subscriptions are managed in Stripe and will be reflected here. Use the link in the sidebar to go directly to this customer in Stripe to begin managing their subscriptions.',
      },
      fields: [
        {
          name: 'link',
          type: 'ui',
          admin: {
            components: {
              Field: '@payloadcms/plugin-stripe/client#LinkToDoc',
            },
            custom: {
              isTestKey: process.env.PAYLOAD_PUBLIC_IS_STRIPE_TEST_KEY === 'true',
              nameOfIDField: `stripeSubscriptionID`,
              stripeResourceType: 'subscriptions',
            },
          },
          label: 'Link',
        },
        {
          name: 'stripeSubscriptionID',
          type: 'text',
          admin: {
            readOnly: true,
          },
          label: 'Stripe ID',
        },
        {
          name: 'stripeProductID',
          type: 'text',
          admin: {
            readOnly: true,
          },
          label: 'Product ID',
        },
        {
          name: 'product',
          type: 'relationship',
          admin: {
            readOnly: true,
          },
          relationTo: 'products',
        },
        {
          name: 'status',
          type: 'select',
          admin: {
            readOnly: true,
          },
          label: 'Status',
          options: [
            {
              label: 'Active',
              value: 'active',
            },
            {
              label: 'Canceled',
              value: 'canceled',
            },
            {
              label: 'Incomplete',
              value: 'incomplete',
            },
            {
              label: 'Incomplete Expired',
              value: 'incomplete_expired',
            },
            {
              label: 'Past Due',
              value: 'past_due',
            },
            {
              label: 'Trialing',
              value: 'trialing',
            },
            {
              label: 'Unpaid',
              value: 'unpaid',
            },
          ],
        },
      ],
      label: 'Subscriptions',
    },
  ],
  timestamps: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Products.ts]---
Location: payload-main/test/plugin-stripe/collections/Products.ts

```typescript
import type { CollectionConfig } from 'payload'

import { productsSlug } from '../shared.js'

export const Products: CollectionConfig = {
  slug: productsSlug,
  admin: {
    defaultColumns: ['name'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'price',
      type: 'group',
      admin: {
        description: 'All pricing information is managed in Stripe and will be reflected here.',
        readOnly: true,
      },
      fields: [
        {
          name: 'stripePriceID',
          type: 'text',
          label: 'Stripe Price ID',
        },
        {
          name: 'stripeJSON',
          type: 'textarea',
          label: 'Stripe JSON',
        },
      ],
      label: 'Price',
    },
  ],
  timestamps: true,
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/plugin-stripe/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/plugin-stripe/seed/index.ts

```typescript
import type { Payload, PayloadRequest } from 'payload'

export const seed = async (payload: Payload): Promise<boolean> => {
  payload.logger.info('Seeding data...')
  const req = {} as PayloadRequest

  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'demo@payloadcms.com',
        password: 'demo',
      },
      req,
    })

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: subscriptionCreatedOrUpdated.ts]---
Location: payload-main/test/plugin-stripe/webhooks/subscriptionCreatedOrUpdated.ts

```typescript
import { APIError } from 'payload'

export const subscriptionCreatedOrUpdated = async (args) => {
  const {
    event,
    payload,
    // stripe,
    // stripeConfig
  } = args

  const customerStripeID = event.data.object.customer

  payload.logger.info(
    `🪝 A new subscription was created or updated in Stripe on customer ID: ${customerStripeID}, syncing to Payload...`,
  )

  const { id: eventID, plan, status: subscriptionStatus } = event.data.object

  let payloadProductID

  // First lookup the product in Payload
  try {
    payload.logger.info(`- Looking up existing Payload product with Stripe ID: ${plan.product}...`)

    const productQuery = await payload.find({
      collection: 'products',
      depth: 0,
      where: {
        stripeID: {
          equals: plan.product,
        },
      },
    })

    payloadProductID = productQuery.docs?.[0]?.id

    if (payloadProductID) {
      payload.logger.info(
        `- Found existing product with Stripe ID: ${plan.product}. Creating relationship...`,
      )
    }
  } catch (error: any) {
    payload.logger.error(`Error finding product ${error?.message}`)
  }

  // Now look up the customer in Payload
  try {
    payload.logger.info(
      `- Looking up existing Payload customer with Stripe ID: ${customerStripeID}.`,
    )

    const customerReq: any = await payload.find({
      collection: 'customers',
      depth: 0,
      where: {
        stripeID: customerStripeID,
      },
    })

    const foundCustomer = customerReq.docs[0]

    if (foundCustomer) {
      payload.logger.info(`- Found existing customer, now updating.`)

      const subscriptions = foundCustomer.subscriptions || []

      const indexOfSubscription = subscriptions.findIndex(
        ({ stripeSubscriptionID }) => stripeSubscriptionID === eventID,
      )

      if (indexOfSubscription > -1) {
        payload.logger.info(`- Subscription already exists, now updating.`)
        // update existing subscription
        subscriptions[indexOfSubscription] = {
          product: payloadProductID,
          status: subscriptionStatus,
          stripeProductID: plan.product,
        }
      } else {
        payload.logger.info(`- This is a new subscription, now adding.`)
        // create new subscription
        subscriptions.push({
          product: payloadProductID,
          status: subscriptionStatus,
          stripeProductID: plan.product,
          stripeSubscriptionID: eventID,
        })
      }

      try {
        await payload.update({
          id: foundCustomer.id,
          collection: 'customers',
          data: {
            skipSync: true,
            subscriptions,
          },
        })

        payload.logger.info(`✅ Successfully updated subscription.`)
      } catch (error) {
        payload.logger.error(`- Error updating subscription: ${error}`)
      }
    } else {
      payload.logger.info(`- No existing customer found, cannot update subscription.`)
    }
  } catch (error) {
    new APIError(
      `Error looking up customer with Stripe ID: '${customerStripeID}': ${error?.message}`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: subscriptionDeleted.ts]---
Location: payload-main/test/plugin-stripe/webhooks/subscriptionDeleted.ts

```typescript
import { APIError } from 'payload'

export const subscriptionDeleted = async (args) => {
  const {
    event,
    payload,
    // stripe,
    // stripeConfig
  } = args

  const customerStripeID = event.data.object.customer

  payload.logger.info(
    `🪝 A new subscription was deleted in Stripe on customer ID: ${customerStripeID}, deleting from Payload...`,
  )

  const {
    id: eventID,
    // plan
  } = event.data.object

  // Now look up the customer in Payload
  try {
    payload.logger.info(
      `- Looking up existing Payload customer with Stripe ID: ${customerStripeID}.`,
    )

    const customerReq: any = await payload.find({
      collection: 'customers',
      depth: 0,
      where: {
        stripeID: customerStripeID,
      },
    })

    const foundCustomer = customerReq.docs[0]

    if (foundCustomer) {
      payload.logger.info(`- Found existing customer, now updating.`)

      const subscriptions = foundCustomer.subscriptions || []
      const indexOfSubscription = subscriptions.findIndex(
        ({ stripeSubscriptionID }) => stripeSubscriptionID === eventID,
      )

      if (indexOfSubscription > -1) {
        delete subscriptions[indexOfSubscription]
      }

      try {
        await payload.update({
          id: foundCustomer.id,
          collection: 'customers',
          data: {
            skipSync: true,
            subscriptions,
          },
        })

        payload.logger.info(`✅ Successfully deleted subscription.`)
      } catch (error) {
        payload.logger.error(`- Error deleting subscription: ${error}`)
      }
    } else {
      payload.logger.info(`- No existing customer found, cannot update subscription.`)
    }
  } catch (error) {
    new APIError(
      `Error looking up customer with Stripe ID: '${customerStripeID}': ${error?.message}`,
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: syncPriceJSON.ts]---
Location: payload-main/test/plugin-stripe/webhooks/syncPriceJSON.ts

```typescript
export const syncPriceJSON = async (args) => {
  const { event, payload, stripe } = args

  const customerStripeID = event.data.object.customer

  payload.logger.info(
    `🪝 A price was created or updated in Stripe on customer ID: ${customerStripeID}, syncing price JSON to Payload...`,
  )

  const { id: eventID, default_price } = event.data.object

  let payloadProductID

  // First lookup the product in Payload
  try {
    payload.logger.info(`- Looking up existing Payload product with Stripe ID: ${eventID}...`)

    const productQuery = await payload.find({
      collection: 'products',
      where: {
        stripeID: {
          equals: eventID,
        },
      },
    })

    payloadProductID = productQuery.docs?.[0]?.id

    if (payloadProductID) {
      payload.logger.info(
        `- Found existing product with Stripe ID: ${eventID}, saving price JSON...`,
      )
    }
  } catch (error: any) {
    payload.logger.error(`Error finding product ${error?.message}`)
  }

  try {
    const stripePrice = await stripe.prices.retrieve(default_price)

    await payload.update({
      id: payloadProductID,
      collection: 'products',
      data: {
        price: {
          stripeJSON: JSON.stringify(stripePrice),
        },
        skipSync: true,
      },
    })

    payload.logger.info(`✅ Successfully updated product price.`)
  } catch (error) {
    payload.logger.error(`- Error updating product price: ${error}`)
  }
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/plugins/.gitignore

```text
media
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/plugins/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const pagesSlug = 'pages'

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
  ],
  plugins: [
    (config) => ({
      ...config,
      collections: [
        ...(config.collections || []),
        {
          slug: pagesSlug,
          fields: [
            {
              name: 'title',
              type: 'text',
            },
          ],
        },
      ],
    }),
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: int.spec.ts]---
Location: payload-main/test/plugins/int.spec.ts

```typescript
import type { Payload } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { initPayloadInt } from '../helpers/initPayloadInt.js'
import { pagesSlug } from './config.js'

let payload: Payload

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Collections - Plugins', () => {
  beforeAll(async () => {
    ;({ payload } = await initPayloadInt(dirname))
  })

  afterAll(async () => {
    await payload.destroy()
  })

  it('created pages collection', async () => {
    const { id } = await payload.create({
      collection: pagesSlug,
      data: {
        title: 'Test Page',
      },
    })

    expect(id).toBeDefined()
  })
})
```

--------------------------------------------------------------------------------

---[FILE: payload-types.ts]---
Location: payload-main/test/plugins/payload-types.ts

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
    users: User;
    pages: Page;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    pages: PagesSelect<false> | PagesSelect<true>;
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
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'users';
        value: string | User;
      } | null)
    | ({
        relationTo: 'pages';
        value: string | Page;
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
 * via the `definition` "pages_select".
 */
export interface PagesSelect<T extends boolean = true> {
  title?: T;
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
Location: payload-main/test/plugins/tsconfig.eslint.json

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
Location: payload-main/test/plugins/tsconfig.json

```json
{
  "extends": "../tsconfig.json"
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/test/query-presets/.gitignore

```text
/media
/media-gif
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/query-presets/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { Pages } from './collections/Pages/index.js'
import { Posts } from './collections/Posts/index.js'
import { Users } from './collections/Users/index.js'
import { roles } from './fields/roles.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// eslint-disable-next-line no-restricted-exports
export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  queryPresets: {
    // labels: {
    //   singular: 'Report',
    //   plural: 'Reports',
    // },
    access: {
      read: ({ req: { user } }) => Boolean(user?.roles?.length && !user?.roles?.includes('user')),
      update: ({ req: { user } }) => Boolean(user?.roles?.length && !user?.roles?.includes('user')),
    },
    filterConstraints: ({ req, options }) =>
      !req.user?.roles?.includes('admin')
        ? options.filter(
            (option) => (typeof option === 'string' ? option : option.value) !== 'onlyAdmins',
          )
        : options,
    constraints: {
      read: [
        {
          label: 'Specific Roles',
          value: 'specificRoles',
          fields: [roles],
          access: ({ req: { user } }) => ({
            'access.read.roles': {
              in: user?.roles || [],
            },
          }),
        },
        {
          label: 'Noone',
          value: 'noone',
          access: () => false,
        },
        {
          label: 'Only Admins',
          value: 'onlyAdmins',
          access: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
        },
      ],
      update: [
        {
          label: 'Specific Roles',
          value: 'specificRoles',
          fields: [roles],
          access: ({ req: { user } }) => ({
            'access.update.roles': {
              in: user?.roles || [],
            },
          }),
        },
        {
          label: 'Only Admins',
          value: 'onlyAdmins',
          access: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
        },
      ],
    },
  },
  collections: [Pages, Posts, Users],
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
