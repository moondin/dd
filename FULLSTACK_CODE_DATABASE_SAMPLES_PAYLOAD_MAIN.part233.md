---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 233
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 233 of 695)

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

---[FILE: beforeChange.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/carts/beforeChange.ts

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

import crypto from 'crypto'

type Props = {
  productsSlug: string
  variantsSlug: string
}

export const beforeChangeCart: (args: Props) => CollectionBeforeChangeHook =
  ({ productsSlug, variantsSlug }) =>
  async ({ data, operation, req }) => {
    // Generate a secret for guest cart access on creation
    if (operation === 'create' && !data.customer && !data.secret) {
      // Generate a cryptographically secure random string
      const secret = crypto.randomBytes(20).toString('hex')
      data.secret = secret

      // Store in context so afterRead hook can include it in the creation response
      if (!req.context) { req.context = {} }
      req.context.newCartSecret = secret
    }

    // Update subtotal based on items in the cart
    if (data.items && Array.isArray(data.items)) {
      const priceField = `priceIn${data.currency}`

      let subtotal = 0

      for (const item of data.items) {
        if (item.variant) {
          const id = typeof item.variant === 'object' ? item.variant.id : item.variant

          const variant = await req.payload.findByID({
            id,
            collection: variantsSlug,
            depth: 0,
            select: {
              [priceField]: true,
            },
          })

          subtotal += variant[priceField] * item.quantity
        } else {
          const id = typeof item.product === 'object' ? item.product.id : item.product

          const product = await req.payload.findByID({
            id,
            collection: productsSlug,
            depth: 0,
            select: {
              [priceField]: true,
            },
          })

          subtotal += product[priceField] * item.quantity
        }
      }

      data.subtotal = subtotal
    } else {
      data.subtotal = 0
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: createCartsCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/carts/createCartsCollection.ts

```typescript
import type { Access, CollectionConfig, Field } from 'payload'

import type { AccessConfig, CurrenciesConfig } from '../../types/index.js'

import { amountField } from '../../fields/amountField.js'
import { cartItemsField } from '../../fields/cartItemsField.js'
import { currencyField } from '../../fields/currencyField.js'
import { accessOR, conditional } from '../../utilities/accessComposition.js'
import { beforeChangeCart } from './beforeChange.js'
import { hasCartSecretAccess } from './hasCartSecretAccess.js'
import { statusBeforeRead } from './statusBeforeRead.js'

type Props = {
  access: Pick<Required<AccessConfig>, 'isAdmin' | 'isAuthenticated' | 'isDocumentOwner'>
  /**
   * Allow guest (unauthenticated) users to create carts.
   * Defaults to false.
   */
  allowGuestCarts?: boolean
  currenciesConfig?: CurrenciesConfig
  /**
   * Slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  /**
   * Enables support for variants in the cart.
   * Defaults to false.
   */
  enableVariants?: boolean
  /**
   * Slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

export const createCartsCollection: (props: Props) => CollectionConfig = (props) => {
  const {
    access,
    allowGuestCarts = false,
    currenciesConfig,
    customersSlug = 'users',
    enableVariants = false,
    productsSlug = 'products',
    variantsSlug = 'variants',
  } = props || {}

  const fields: Field[] = [
    cartItemsField({
      enableVariants,
      overrides: {
        label: ({ t }) =>
          // @ts-expect-error - translations are not typed in plugins yet
          t('plugin-ecommerce:items'),
        labels: {
          plural: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:items'),
          singular: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:item'),
        },
      },
      productsSlug,
      variantsSlug,
    }),
    {
      name: 'secret',
      type: 'text',
      access: {
        create: () => false, // Users can't set it manually
        read: () => false, // Never readable via field access (only through afterRead hook)
        update: () => false, // Users can't update it
      },
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
      index: true,
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:cartSecret'),
    },
    {
      name: 'customer',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customer'),
      relationTo: customersSlug,
    },
    {
      name: 'purchasedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:purchasedAt'),
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        afterRead: [statusBeforeRead],
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:status'),
      options: [
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:active'),
          value: 'active',
        },
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:purchased'),
          value: 'purchased',
        },
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:abandoned'),
          value: 'abandoned',
        },
      ],
      virtual: true,
    },
    ...(currenciesConfig
      ? [
          {
            type: 'row',
            admin: { position: 'sidebar' },
            fields: [
              amountField({
                currenciesConfig,
                overrides: {
                  name: 'subtotal',

                  label: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:subtotal'),
                },
              }),
              currencyField({
                currenciesConfig,
              }),
            ],
          } as Field,
        ]
      : []),
  ]

  // Internal access function for guest users (unauthenticated)
  const isGuest: Access = ({ req }) => !req.user

  const baseConfig: CollectionConfig = {
    slug: 'carts',
    access: {
      create: accessOR(
        access.isAdmin,
        access.isAuthenticated,
        conditional(allowGuestCarts, isGuest),
      ),
      delete: accessOR(
        access.isAdmin,
        access.isDocumentOwner,
        hasCartSecretAccess(allowGuestCarts),
      ),
      read: accessOR(access.isAdmin, access.isDocumentOwner, hasCartSecretAccess(allowGuestCarts)),
      update: accessOR(
        access.isAdmin,
        access.isDocumentOwner,
        hasCartSecretAccess(allowGuestCarts),
      ),
    },
    admin: {
      description: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:cartsCollectionDescription'),
      group: 'Ecommerce',
      useAsTitle: 'createdAt',
    },
    fields,
    hooks: {
      afterRead: [
        ({ doc, req }) => {
          // Include secret only if this was just created (stored in context by beforeChange)
          if (req.context?.newCartSecret) {
            doc.secret = req.context.newCartSecret
          }
          // Secret is otherwise never exposed (field access is locked)
          return doc
        },
      ],
      beforeChange: [
        // This hook can be used to update the subtotal before saving the cart
        beforeChangeCart({ productsSlug, variantsSlug }),
      ],
    },
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:carts'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:cart'),
    },
    timestamps: true,
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: hasCartSecretAccess.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/carts/hasCartSecretAccess.ts

```typescript
import type { Access } from 'payload'

/**
 * Internal access function for guest cart access via secret query parameter.
 * Only active when allowGuestCarts is enabled.
 *
 * @param allowGuestCarts - Whether guest cart access is enabled
 * @returns Access function that checks for valid cart secret in query params
 */
export const hasCartSecretAccess = (allowGuestCarts: boolean): Access => {
  return ({ req }) => {
    if (!allowGuestCarts) {
      return false
    }

    const cartSecret = req.query?.secret

    if (!cartSecret || typeof cartSecret !== 'string') {
      return false
    }

    return {
      secret: {
        equals: cartSecret,
      },
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: statusBeforeRead.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/carts/statusBeforeRead.ts

```typescript
import type { FieldHook } from 'payload'

export const statusBeforeRead: FieldHook = ({ data }) => {
  if (data?.purchasedAt) {
    return 'purchased'
  }

  if (data?.createdAt) {
    const timeNow = new Date().getTime()
    const createdAt = new Date(data.createdAt).getTime()
    const differenceToCheck = 7 * 24 * 60 * 60 * 1000 // 7 days

    if (timeNow - createdAt < differenceToCheck) {
      // If the cart was created within the last 7 days, it is considered 'active'
      return 'active'
    }
  }

  return 'abandoned'
}
```

--------------------------------------------------------------------------------

---[FILE: createOrdersCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/orders/createOrdersCollection.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig, CurrenciesConfig } from '../../types/index.js'

import { amountField } from '../../fields/amountField.js'
import { cartItemsField } from '../../fields/cartItemsField.js'
import { currencyField } from '../../fields/currencyField.js'
import { accessOR } from '../../utilities/accessComposition.js'

type Props = {
  access: Pick<AccessConfig, 'adminOnlyFieldAccess' | 'isAdmin' | 'isDocumentOwner'>
  /**
   * Array of fields used for capturing the shipping address data.
   */
  addressFields?: Field[]
  currenciesConfig?: CurrenciesConfig
  /**
   * Slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  enableVariants?: boolean
  /**
   * Slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Slug of the transactions collection, defaults to 'transactions'.
   */
  transactionsSlug?: string
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

export const createOrdersCollection: (props: Props) => CollectionConfig = (props) => {
  const {
    access,
    addressFields,
    currenciesConfig,
    customersSlug = 'users',
    enableVariants = false,
    productsSlug = 'products',
    transactionsSlug = 'transactions',
    variantsSlug = 'variants',
  } = props || {}

  const fields: Field[] = [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            cartItemsField({
              enableVariants,
              overrides: {
                name: 'items',
                label: ({ t }) =>
                  // @ts-expect-error - translations are not typed in plugins yet
                  t('plugin-ecommerce:items'),
                labels: {
                  plural: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:items'),
                  singular: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:item'),
                },
              },
              productsSlug,
              variantsSlug,
            }),
          ],
          label: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:orderDetails'),
        },
        {
          fields: [
            ...(addressFields
              ? [
                  {
                    name: 'shippingAddress',
                    type: 'group',
                    fields: addressFields,
                    label: ({ t }) =>
                      // @ts-expect-error - translations are not typed in plugins yet
                      t('plugin-ecommerce:shippingAddress'),
                  } as Field,
                ]
              : []),
          ],
          label: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:shipping'),
        },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customer'),
      relationTo: customersSlug,
    },
    {
      name: 'customerEmail',
      type: 'email',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customerEmail'),
    },
    {
      name: 'transactions',
      type: 'relationship',
      access: {
        create: access.adminOnlyFieldAccess,
        read: access.adminOnlyFieldAccess,
        update: access.adminOnlyFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:transactions'),
      relationTo: transactionsSlug,
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'processing',
      interfaceName: 'OrderStatus',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:status'),
      options: [
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:processing'),
          value: 'processing',
        },
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:completed'),
          value: 'completed',
        },
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:cancelled'),
          value: 'cancelled',
        },
        {
          // @ts-expect-error - translations are not typed in plugins yet
          label: ({ t }) => t('plugin-ecommerce:refunded'),
          value: 'refunded',
        },
      ],
    },

    ...(currenciesConfig
      ? [
          {
            type: 'row',
            admin: {
              position: 'sidebar',
            },
            fields: [
              amountField({
                currenciesConfig,
              }),
              currencyField({
                currenciesConfig,
              }),
            ],
          } as Field,
        ]
      : []),
  ]

  const baseConfig: CollectionConfig = {
    slug: 'orders',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: accessOR(access.isAdmin, access.isDocumentOwner),
      update: access.isAdmin,
    },
    admin: {
      description: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:ordersCollectionDescription'),
      group: 'Ecommerce',
      useAsTitle: 'createdAt',
    },
    fields,
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:orders'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:order'),
    },
    timestamps: true,
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: createProductsCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/products/createProductsCollection.ts

```typescript
import type { CollectionConfig } from 'payload'

import type { AccessConfig, CurrenciesConfig, InventoryConfig } from '../../types/index.js'

import { inventoryField } from '../../fields/inventoryField.js'
import { pricesField } from '../../fields/pricesField.js'
import { variantsFields } from '../../fields/variantsFields.js'

type Props = {
  access: Pick<AccessConfig, 'adminOrPublishedStatus' | 'isAdmin'>
  currenciesConfig: CurrenciesConfig
  enableVariants?: boolean
  /**
   * Adds in an inventory field to the product and its variants. This is useful for tracking inventory levels.
   * Defaults to true.
   */
  inventory?: boolean | InventoryConfig
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
  /**
   * Slug of the variant types collection, defaults to 'variantTypes'.
   */
  variantTypesSlug?: string
}

export const createProductsCollection: (props: Props) => CollectionConfig = (props) => {
  const {
    access,
    currenciesConfig,
    enableVariants = false,
    inventory = true,
    variantsSlug = 'variants',
    variantTypesSlug = 'variantTypes',
  } = props || {}

  const fields = [
    ...(inventory
      ? [
          inventoryField({
            overrides: {
              admin: {
                condition: ({ enableVariants }) => !enableVariants,
              },
            },
          }),
        ]
      : []),
    ...(enableVariants ? variantsFields({ variantsSlug, variantTypesSlug }) : []),
    ...(currenciesConfig ? [...pricesField({ currenciesConfig })] : []),
  ]

  const baseConfig: CollectionConfig = {
    slug: 'products',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: access.adminOrPublishedStatus,
      update: access.isAdmin,
    },
    admin: {
      defaultColumns: [
        ...(currenciesConfig ? ['prices'] : []),
        ...(enableVariants ? ['variants'] : []),
      ],
      group: 'Ecommerce',
    },
    fields,
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:products'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:product'),
    },
    trash: true,
    versions: {
      drafts: {
        autosave: true,
      },
    },
  }

  return baseConfig
}
```

--------------------------------------------------------------------------------

---[FILE: createTransactionsCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/transactions/createTransactionsCollection.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig, CurrenciesConfig, PaymentAdapter } from '../../types/index.js'

import { amountField } from '../../fields/amountField.js'
import { cartItemsField } from '../../fields/cartItemsField.js'
import { currencyField } from '../../fields/currencyField.js'
import { statusField } from '../../fields/statusField.js'

type Props = {
  access: Pick<AccessConfig, 'isAdmin'>
  /**
   * Array of fields used for capturing the billing address.
   */
  addressFields?: Field[]
  /**
   * Slug of the carts collection, defaults to 'carts'.
   */
  cartsSlug?: string
  currenciesConfig?: CurrenciesConfig
  /**
   * Slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  /**
   * Enable variants in the transactions collection.
   */
  enableVariants?: boolean
  /**
   * Slug of the orders collection, defaults to 'orders'.
   */
  ordersSlug?: string
  paymentMethods?: PaymentAdapter[]
  /**
   * Slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

export const createTransactionsCollection: (props: Props) => CollectionConfig = (props) => {
  const {
    access,
    addressFields,
    cartsSlug = 'carts',
    currenciesConfig,
    customersSlug = 'users',
    enableVariants = false,
    ordersSlug = 'orders',
    paymentMethods,
    productsSlug = 'products',
    variantsSlug = 'variants',
  } = props || {}

  const fields: Field[] = [
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            cartItemsField({
              enableVariants,
              overrides: {
                name: 'items',
                label: ({ t }) =>
                  // @ts-expect-error - translations are not typed in plugins yet
                  t('plugin-ecommerce:items'),
                labels: {
                  plural: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:items'),
                  singular: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:item'),
                },
              },
              productsSlug,
              variantsSlug,
            }),
            ...(paymentMethods?.length && paymentMethods.length > 0
              ? [
                  {
                    name: 'paymentMethod',
                    type: 'select',
                    label: ({ t }) =>
                      // @ts-expect-error - translations are not typed in plugins yet
                      t('plugin-ecommerce:paymentMethod'),
                    options: paymentMethods.map((method) => ({
                      label: method.label ?? method.name,
                      value: method.name,
                    })),
                  } as Field,
                  ...(paymentMethods.map((method) => method.group) || []),
                ]
              : []),
          ],
          label: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:transactionDetails'),
        },
        {
          fields: [
            ...(addressFields
              ? [
                  {
                    name: 'billingAddress',
                    type: 'group',
                    fields: addressFields,
                    label: ({ t }) =>
                      // @ts-expect-error - translations are not typed in plugins yet
                      t('plugin-ecommerce:billingAddress'),
                  } as Field,
                ]
              : []),
          ],
          label: ({ t }) =>
            // @ts-expect-error - translations are not typed in plugins yet
            t('plugin-ecommerce:billing'),
        },
      ],
    },
    statusField({
      overrides: {
        admin: {
          position: 'sidebar',
        },
      },
    }),
    {
      name: 'customer',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customer'),
      relationTo: customersSlug,
    },
    {
      name: 'customerEmail',
      type: 'email',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:customerEmail'),
    },
    {
      name: 'order',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:order'),
      relationTo: ordersSlug,
    },
    {
      name: 'cart',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: cartsSlug,
    },
    ...(currenciesConfig
      ? [
          {
            type: 'row',
            admin: {
              position: 'sidebar',
            },
            fields: [
              amountField({
                currenciesConfig,
              }),
              currencyField({
                currenciesConfig,
              }),
            ],
          } as Field,
        ]
      : []),
  ]

  const baseConfig: CollectionConfig = {
    slug: 'transactions',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: access.isAdmin,
      update: access.isAdmin,
    },
    admin: {
      defaultColumns: ['createdAt', 'customer', 'order', 'amount', 'status'],
      description: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:transactionsCollectionDescription'),
      group: 'Ecommerce',
    },
    fields,
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:transactions'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:transaction'),
    },
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: createVariantOptionsCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/variants/createVariantOptionsCollection.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig } from '../../types/index.js'

type Props = {
  access: Pick<AccessConfig, 'isAdmin' | 'publicAccess'>
  /**
   * Slug of the variant types collection, defaults to 'variantTypes'.
   */
  variantTypesSlug?: string
}

export const createVariantOptionsCollection: (props: Props) => CollectionConfig = (props) => {
  const { access, variantTypesSlug = 'variantTypes' } = props || {}

  const fields: Field[] = [
    {
      name: 'variantType',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: variantTypesSlug,
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      admin: {
        description: 'should be defaulted or dynamic based on label',
      },
      required: true,
    },
  ]

  const baseConfig: CollectionConfig = {
    slug: 'variantOptions',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: access.publicAccess,
      update: access.isAdmin,
    },
    admin: {
      group: false,
      useAsTitle: 'label',
    },
    fields,
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantOptions'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantOption'),
    },
    trash: true,
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: createVariantTypesCollection.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/variants/createVariantTypesCollection.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig } from '../../types/index.js'

type Props = {
  access: Pick<AccessConfig, 'isAdmin' | 'publicAccess'>
  /**
   * Slug of the variant options collection, defaults to 'variantOptions'.
   */
  variantOptionsSlug?: string
}

export const createVariantTypesCollection: (props: Props) => CollectionConfig = (props) => {
  const { access, variantOptionsSlug = 'variantOptions' } = props || {}

  const fields: Field[] = [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'options',
      type: 'join',
      collection: variantOptionsSlug,
      maxDepth: 2,
      on: 'variantType',
      orderable: true,
    },
  ]

  const baseConfig: CollectionConfig = {
    slug: 'variantTypes',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: access.publicAccess,
      update: access.isAdmin,
    },
    admin: {
      group: false,
      useAsTitle: 'label',
    },
    fields,
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantTypes'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantType'),
    },
    trash: true,
  }

  return { ...baseConfig }
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/variants/createVariantsCollection/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import type { AccessConfig, CurrenciesConfig, InventoryConfig } from '../../../types/index.js'

import { inventoryField } from '../../../fields/inventoryField.js'
import { pricesField } from '../../../fields/pricesField.js'
import { variantsCollectionBeforeChange as beforeChange } from './hooks/beforeChange.js'
import { validateOptions } from './hooks/validateOptions.js'

type Props = {
  access: Pick<AccessConfig, 'adminOrPublishedStatus' | 'isAdmin'>
  currenciesConfig?: CurrenciesConfig
  /**
   * Enables inventory tracking for variants. Defaults to true.
   */
  inventory?: boolean | InventoryConfig
  /**
   * Slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Slug of the variant options collection, defaults to 'variantOptions'.
   */
  variantOptionsSlug?: string
}

export const createVariantsCollection: (props: Props) => CollectionConfig = (props) => {
  const {
    access,
    currenciesConfig,
    inventory = true,
    productsSlug = 'products',
    variantOptionsSlug = 'variantOptions',
  } = props || {}
  const { supportedCurrencies } = currenciesConfig || {}

  const fields: Field[] = [
    {
      name: 'title',
      type: 'text',
      admin: {
        description:
          'Used for administrative purposes, not shown to customers. This is populated by default.',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      relationTo: productsSlug,
      required: true,
    },
    {
      // This might need to be a custom component, to show a selector for each variant that is
      // enabled on the parent product
      // - separate select inputs, each showing only a specific variant (w/ options)
      // - it will save data to the DB as IDs in this relationship field
      // and needs a validate function as well which enforces that the options are fully specified, and accurate
      name: 'options',
      type: 'relationship',
      admin: {
        components: {
          Field: {
            path: '@payloadcms/plugin-ecommerce/rsc#VariantOptionsSelector',
          },
        },
      },
      hasMany: true,
      label: 'Variant options',
      relationTo: variantOptionsSlug,
      required: true,
      validate: validateOptions(),
    },
    ...(inventory ? [inventoryField()] : []),
  ]

  if (supportedCurrencies?.length && supportedCurrencies.length > 0) {
    const currencyOptions: string[] = []

    supportedCurrencies.forEach((currency) => {
      currencyOptions.push(currency.code)
    })

    if (currenciesConfig) {
      fields.push(...pricesField({ currenciesConfig }))
    }
  }

  const baseConfig: CollectionConfig = {
    slug: 'variants',
    access: {
      create: access.isAdmin,
      delete: access.isAdmin,
      read: access.adminOrPublishedStatus,
      update: access.isAdmin,
    },
    admin: {
      description: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantsCollectionDescription'),
      group: false,
      useAsTitle: 'title',
    },
    fields,
    hooks: {
      beforeChange: [beforeChange({ productsSlug, variantOptionsSlug })],
    },
    labels: {
      plural: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variants'),
      singular: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variant'),
    },
    trash: true,
    versions: {
      drafts: {
        autosave: true,
      },
    },
  }

  return baseConfig
}
```

--------------------------------------------------------------------------------

---[FILE: beforeChange.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/variants/createVariantsCollection/hooks/beforeChange.ts

```typescript
import type { CollectionBeforeChangeHook } from 'payload'

type Props = {
  productsSlug: string
  variantOptionsSlug: string
}

export const variantsCollectionBeforeChange: (args: Props) => CollectionBeforeChangeHook =
  ({ productsSlug, variantOptionsSlug }) =>
  async ({ data, req }) => {
    if (data?.options?.length && data.options.length > 0) {
      const titleArray: string[] = []
      const productID = data.product
      const product = await req.payload.findByID({
        id: productID,
        collection: productsSlug,
        depth: 0,
        select: {
          title: true,
          variantTypes: true,
        },
      })

      if (product.title && typeof product.title === 'string') {
        titleArray.push(product.title)
      }

      for (const option of data.options) {
        const variantOption = await req.payload.findByID({
          id: option,
          collection: variantOptionsSlug,
          depth: 0,
          select: {
            label: true,
          },
        })

        if (!variantOption) {
          continue
        }

        if (variantOption.label && typeof variantOption.label === 'string') {
          titleArray.push(variantOption.label)
        }
      }

      data.title = titleArray.join(' — ')
    }

    return data
  }
```

--------------------------------------------------------------------------------

---[FILE: validateOptions.ts]---
Location: payload-main/packages/plugin-ecommerce/src/collections/variants/createVariantsCollection/hooks/validateOptions.ts

```typescript
import type { Validate } from 'payload'

type Props = {
  productsCollectionSlug?: string
}

export const validateOptions: (props?: Props) => Validate =
  (props) =>
  async (values, { data, req }) => {
    const { productsCollectionSlug = 'products' } = props || {}
    const { t } = req

    if (!values || values.length === 0) {
      // @ts-expect-error - TODO: Fix types
      return t('ecommerce:variantOptionsRequired')
    }

    const productID = data.product

    if (!productID) {
      // @ts-expect-error - TODO: Fix types
      return t('ecommerce:productRequired')
    }

    const product = await req.payload.findByID({
      id: productID,
      collection: productsCollectionSlug,
      depth: 1,
      joins: {
        variants: {
          where: {
            ...(data.id && {
              id: {
                not_equals: data.id, // exclude the current variant from the search
              },
            }),
          },
        },
      },
      select: {
        variants: true,
        variantTypes: true,
      },
      user: req.user,
    })

    // @ts-expect-error - TODO: Fix types
    const variants = product.variants?.docs ?? []

    // @ts-expect-error - TODO: Fix types
    if (values.length < product?.variantTypes?.length) {
      // @ts-expect-error - TODO: Fix types
      return t('ecommerce:variantOptionsRequiredAll')
    }

    if (variants.length > 0) {
      const existingOptions: (number | string)[][] = []

      variants.forEach((variant: any) => {
        existingOptions.push(variant.options)
      })

      const exists = existingOptions.some(
        (combo) => combo.length === values.length && combo.every((val) => values.includes(val)),
      )

      if (exists) {
        // @ts-expect-error - TODO: Fix types
        return t('ecommerce:variantOptionsAlreadyExists')
      }
    }

    return true
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/currencies/index.ts

```typescript
import type { Currency } from '../types/index.js'

export const EUR: Currency = {
  code: 'EUR',
  decimals: 2,
  label: 'Euro',
  symbol: '€',
}

export const USD: Currency = {
  code: 'USD',
  decimals: 2,
  label: 'US Dollar',
  symbol: '$',
}

export const GBP: Currency = {
  code: 'GBP',
  decimals: 2,
  label: 'British Pound',
  symbol: '£',
}
```

--------------------------------------------------------------------------------

````
