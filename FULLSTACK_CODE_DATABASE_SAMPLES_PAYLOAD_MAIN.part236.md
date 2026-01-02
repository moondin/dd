---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 236
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 236 of 695)

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

---[FILE: en.ts]---
Location: payload-main/packages/plugin-ecommerce/src/translations/en.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const en: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-ecommerce': {
    abandoned: 'Abandoned',
    active: 'Active',
    address: 'Address',
    addressCity: 'City',
    addressCompany: 'Company',
    addressCountry: 'Country',
    addresses: 'Addresses',
    addressesCollectionDescription:
      'Addresses are associated with customers are used to prefill shipping and billing when placing orders.',
    addressFirstName: 'First name',
    addressLastName: 'Last name',
    addressLine1: 'Address 1',
    addressLine2: 'Address 2',
    addressPhone: 'Phone',
    addressPostalCode: 'Postal code',
    addressState: 'State',
    addressTitle: 'Title',
    amount: 'Amount',
    availableVariants: 'Available variants',
    billing: 'Billing',
    billingAddress: 'Billing address',
    cancelled: 'Cancelled',
    cart: 'Cart',
    carts: 'Carts',
    cartsCollectionDescription:
      "Carts represent a customer's selection of products they intend to purchase. They are related to a customer where possible and guest users do not have a customer attached.",
    cartSecret: 'Cart Secret',
    completed: 'Completed',
    currency: 'Currency',
    currencyNotSet: 'Currency not set.',
    customer: 'Customer',
    customerEmail: 'Customer email',
    customers: 'Customers',
    enableCurrencyPrice: `Enable {{currency}} price`,
    enableVariants: 'Enable variants',
    expired: 'Expired',
    failed: 'Failed',
    inventory: 'Inventory',
    item: 'Item',
    items: 'Items',
    open: 'Open',
    order: 'Order',
    orderDetails: 'Order Details',
    orders: 'Orders',
    ordersCollectionDescription:
      "Orders represent a customer's intent to purchase products from your store. They include details such as the products ordered, quantities, prices, customer information, and order status.",
    paymentMethod: 'Payment method',
    paymentMethods: 'Payment methods',
    pending: 'Pending',
    price: 'Price',
    priceIn: 'Price ({{currency}})',
    priceNotSet: 'Price not set.',
    prices: 'Prices',
    priceSetInVariants: 'Price set in variants.',
    processing: 'Processing',
    product: 'Product',
    productPriceDescription:
      'This price will also be used for sorting and filtering products. If you have variants enabled then you can enter the lowest or average price to help with search and filtering, but this price will not be used for checkout.',
    productRequired: 'A product is required.',
    products: 'Products',
    purchased: 'Purchased',
    purchasedAt: 'Purchased at',
    quantity: 'Quantity',
    refunded: 'Refunded',
    shipping: 'Shipping',
    shippingAddress: 'Shipping address',
    status: 'Status',
    subtotal: 'Subtotal',
    succeeded: 'Succeeded',
    transaction: 'Transaction',
    transactionDetails: 'Transaction Details',
    transactions: 'Transactions',
    transactionsCollectionDescription:
      'Transactions represent payment attempts made for an order. An order can have multiple transactions associated with it, such as an initial payment attempt and subsequent refunds or adjustments.',
    variant: 'Variant',
    variantOption: 'Variant Option',
    variantOptions: 'Variant Options',
    variantOptionsAlreadyExists:
      'This variant combo is already in use by another variant. Please select different options.',
    variantOptionsCollectionDescription:
      'Variant options define the options a variant type can have, such as red or white for colors.',
    variantOptionsRequired: 'Variant options are required.',
    variantOptionsRequiredAll: 'All variant options are required.',
    variants: 'Variants',
    variantsCollectionDescription:
      "Product variants allow you to offer different versions of a product, such as size or color variations. They refrence a product's variant options based on the variant types approved.",
    variantType: 'Variant Type',
    variantTypes: 'Variant Types',
    variantTypesCollectionDescription:
      'Variant types are used to define the different types of variants your products can have, such as size or color. Each variant type can have multiple options associated with it.',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/translations/index.ts

```typescript
import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations'

import { en } from './en.js'

export const translations = {
  en,
}

export type EcommerceTranslations = GenericTranslationsObject

export type EcommerceTranslationKeys = NestedKeysStripped<EcommerceTranslations>
```

--------------------------------------------------------------------------------

---[FILE: translation-schema.json]---
Location: payload-main/packages/plugin-ecommerce/src/translations/translation-schema.json

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "ecommerce": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "variantOptionsAlreadyExists": {
          "type": "string"
        },
        "productRquired": {
          "type": "string"
        },
        "variantOptionsRequired": {
          "type": "string"
        },
        "variantOptionsRequiredAll": {
          "type": "string"
        }
      },
      "required": [
        "variantOptionsAlreadyExists",
        "productRquired",
        "variantOptionsRequired",
        "variantOptionsRequiredAll"
      ]
    }
  },
  "required": ["ecommerce"]
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/types/index.ts
Signals: React

```typescript
import type {
  Access,
  CollectionConfig,
  DefaultDocumentIDType,
  Endpoint,
  Field,
  FieldAccess,
  GroupField,
  PayloadRequest,
  PopulateType,
  SelectType,
  TypedCollection,
  Where,
} from 'payload'
import type React from 'react'

import type { TypedEcommerce } from './utilities.js'

export type FieldsOverride = (args: { defaultFields: Field[] }) => Field[]

export type CollectionOverride = (args: {
  defaultCollection: CollectionConfig
}) => CollectionConfig | Promise<CollectionConfig>

export type CartItem = {
  id: DefaultDocumentIDType
  product: DefaultDocumentIDType | TypedCollection['products']
  quantity: number
  variant?: DefaultDocumentIDType | TypedCollection['variants']
}

type DefaultCartType = {
  currency?: string
  customer?: DefaultDocumentIDType | TypedCollection['customers']
  id: DefaultDocumentIDType
  items: CartItem[]
  subtotal?: number
}

export type Cart = DefaultCartType

type InitiatePaymentReturnType = {
  /**
   * Allows for additional data to be returned, such as payment method specific data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  message: string
}

type InitiatePayment = (args: {
  /**
   * The slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  data: {
    /**
     * Billing address for the payment.
     */
    billingAddress: TypedCollection['addresses']
    /**
     * Cart items.
     */
    cart: Cart
    /**
     * Currency code to use for the payment.
     */
    currency: string
    customerEmail: string
    /**
     * Shipping address for the payment.
     */
    shippingAddress?: TypedCollection['addresses']
  }
  req: PayloadRequest
  /**
   * The slug of the transactions collection, defaults to 'transactions'.
   * For example, this is used to create a record of the payment intent in the transactions collection.
   */
  transactionsSlug: string
}) => InitiatePaymentReturnType | Promise<InitiatePaymentReturnType>

type ConfirmOrderReturnType = {
  /**
   * Allows for additional data to be returned, such as payment method specific data
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  message: string
  orderID: DefaultDocumentIDType
  transactionID: DefaultDocumentIDType
}

type ConfirmOrder = (args: {
  /**
   * The slug of the carts collection, defaults to 'carts'.
   * For example, this is used to retrieve the cart for the order.
   */
  cartsSlug?: string
  /**
   * The slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  /**
   * Data made available to the payment method when confirming an order. You should get the cart items from the transaction.
   */
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any // Allows for additional data to be passed through, such as payment method specific data
    customerEmail?: string
  }
  /**
   * The slug of the orders collection, defaults to 'orders'.
   */
  ordersSlug?: string
  req: PayloadRequest
  /**
   * The slug of the transactions collection, defaults to 'transactions'.
   * For example, this is used to create a record of the payment intent in the transactions collection.
   */
  transactionsSlug?: string
}) => ConfirmOrderReturnType | Promise<ConfirmOrderReturnType>

/**
 * The full payment adapter config expected as part of the config for the Ecommerce plugin.
 *
 * You can insert this type directly or return it from a function constructing it.
 */
export type PaymentAdapter = {
  /**
   * The function that is called via the `/api/payments/{provider_name}/confirm-order` endpoint to confirm an order after a payment has been made.
   *
   * You should handle the order confirmation logic here.
   *
   * @example
   *
   * ```ts
   * const confirmOrder: ConfirmOrder = async ({ data: { customerEmail }, ordersSlug, req, transactionsSlug }) => {
      // Confirm the payment with Stripe or another payment provider here
      // Create an order in the orders collection here
      // Update the record of the payment intent in the transactions collection here
      return {
        message: 'Order confirmed successfully',
        orderID: 'order_123',
        transactionID: 'txn_123',
        // Include any additional data required for the payment method here
      }
    }
   * ```
   */
  confirmOrder: ConfirmOrder
  /**
   * An array of endpoints to be bootstrapped to Payload's API in order to support the payment method. All API paths are relative to `/api/payments/{provider_name}`.
   *
   * So for example, path `/webhooks` in the Stripe adapter becomes `/api/payments/stripe/webhooks`.
   *
   * @example '/webhooks'
   */
  endpoints?: Endpoint[]
  /**
   * A group configuration to be used in the admin interface to display the payment method.
   *
   * @example
   *
   * ```ts
   * const groupField: GroupField = {
      name: 'stripe',
      type: 'group',
      admin: {
        condition: (data) => data?.paymentMethod === 'stripe',
      },
      fields: [
        {
          name: 'stripeCustomerID',
          type: 'text',
          label: 'Stripe Customer ID',
          required: true,
        },
        {
          name: 'stripePaymentIntentID',
          type: 'text',
          label: 'Stripe PaymentIntent ID',
          required: true,
        },
      ],
    }
   * ```
   */
  group: GroupField
  /**
   * The function that is called via the `/api/payments/{provider_name}/initiate` endpoint to initiate a payment for an order.
   *
   * You should handle the payment initiation logic here.
   *
   * @example
   *
   * ```ts
   * const initiatePayment: InitiatePayment = async ({ data: { cart, currency, customerEmail, billingAddress, shippingAddress }, req, transactionsSlug }) => {
      // Create a payment intent with Stripe or another payment provider here
      // Create a record of the payment intent in the transactions collection here
      return {
        message: 'Payment initiated successfully',
        // Include any additional data required for the payment method here
      }
    }
   * ```
   */
  initiatePayment: InitiatePayment
  /**
   * The label of the payment method
   * @example
   * 'Bank Transfer'
   */
  label?: string
  /**
   * The name of the payment method
   * @example 'stripe'
   */
  name: string
}

export type PaymentAdapterClient = {
  confirmOrder: boolean
  initiatePayment: boolean
} & Pick<PaymentAdapter, 'label' | 'name'>

export type Currency = {
  /**
   * The ISO 4217 currency code
   * @example 'usd'
   */
  code: string
  /**
   * The number of decimal places the currency uses
   * @example 2
   */
  decimals: number
  /**
   * A user friendly name for the currency.
   *
   * @example 'US Dollar'
   */
  label: string
  /**
   * The symbol of the currency
   * @example '$'
   */
  symbol: string
}

/**
 * Commonly used arguments for a Payment Adapter function, it's use is entirely optional.
 */
export type PaymentAdapterArgs = {
  /**
   * Overrides the default fields of the collection. Affects the payment fields on collections such as transactions.
   */
  groupOverrides?: { fields?: FieldsOverride } & Partial<Omit<GroupField, 'fields'>>
  /**
   * The visually readable label for the payment method.
   * @example 'Bank Transfer'
   */
  label?: string
}

/**
 * Commonly used arguments for a Payment Adapter function, it's use is entirely optional.
 */
export type PaymentAdapterClientArgs = {
  /**
   * The visually readable label for the payment method.
   * @example 'Bank Transfer'
   */
  label?: string
}

export type VariantsConfig = {
  /**
   * Override the default variants collection. If you override the collection, you should ensure it has the required fields for variants or re-use the default fields.
   *
   * @example
   *
   * ```ts
   * variants: {
      variantOptionsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'customField',
            label: 'Custom Field',
            type: 'text',
          },
        ],
      })
    }
  ```
   */
  variantOptionsCollectionOverride?: CollectionOverride
  /**
   * Override the default variants collection. If you override the collection, you should ensure it has the required fields for variants or re-use the default fields.
   *
   * @example
   *
   * ```ts
   * variants: {
      variantsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'customField',
            label: 'Custom Field',
            type: 'text',
          },
        ],
      })
    }
  ```
   */
  variantsCollectionOverride?: CollectionOverride
  /**
   * Override the default variants collection. If you override the collection, you should ensure it has the required fields for variants or re-use the default fields.
   *
   * @example
   *
   * ```ts
   * variants: {
      variantTypesCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'customField',
            label: 'Custom Field',
            type: 'text',
          },
        ],
      })
    }
  ```
   */
  variantTypesCollectionOverride?: CollectionOverride
}

export type ProductsConfig = {
  /**
   * Override the default products collection. If you override the collection, you should ensure it has the required fields for products or re-use the default fields.
   *
   * @example
   *
   * ```ts
    products: {
      productsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
          },
        ],
      })
    }
    ```
   */
  productsCollectionOverride?: CollectionOverride
  /**
   * Customise the validation used for checking products or variants before a transaction is created or a payment can be confirmed.
   */
  validation?: ProductsValidation
  /**
   * Enable variants and provide configuration for the variant collections.
   *
   * Defaults to true.
   */
  variants?: boolean | VariantsConfig
}

export type OrdersConfig = {
  /**
   * Override the default orders collection. If you override the collection, you should ensure it has the required fields for orders or re-use the default fields.
   *
   * @example
   *
   * ```ts
      orders: {
        ordersCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          fields: [
            ...defaultCollection.fields,
            {
              name: 'notes',
              label: 'Notes',
              type: 'textarea',
            },
          ],
        })
      }
    ```
   */
  ordersCollectionOverride?: CollectionOverride
}

export type TransactionsConfig = {
  /**
   * Override the default transactions collection. If you override the collection, you should ensure it has the required fields for transactions or re-use the default fields.
   *
   * @example
   *
   * ```ts
    transactions: {
      transactionsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
          },
        ],
      })
    }
    ```
   */
  transactionsCollectionOverride?: CollectionOverride
}

export type CustomQuery = {
  depth?: number
  select?: SelectType
  where?: Where
}

export type PaymentsConfig = {
  paymentMethods?: PaymentAdapter[]
  productsQuery?: CustomQuery
  variantsQuery?: CustomQuery
}

export type CountryType = {
  /**
   * A user friendly name for the country.
   */
  label: string
  /**
   * The ISO 3166-1 alpha-2 country code.
   * @example 'US'
   */
  value: string
}

/**
 * Configuration for the addresses used by the Ecommerce plugin. Use this to override the default collection or fields used throughout
 */
type AddressesConfig = {
  /**
   * Override the default addresses collection. If you override the collection, you should ensure it has the required fields for addresses or re-use the default fields.
   *
   * @example
   * ```ts
   * addressesCollectionOverride: (defaultCollection) => {
   *  return {
   *    ...defaultCollection,
   *    fields: [
   *      ...defaultCollection.fields,
   *      // add custom fields here
   *    ],
   *  }
   * }
   * ```
   */
  addressesCollectionOverride?: CollectionOverride
  /**
   * These fields will be applied to all locations where addresses are used, such as Orders and Transactions. Preferred use over the collectionOverride config.
   */
  addressFields?: FieldsOverride
  /**
   * Provide an array of countries to support for addresses. This will be used in the admin interface to provide a select field of countries.
   *
   * Defaults to a set of commonly used countries.
   *
   * @example
   * ```
   * [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
    ]
   */
  supportedCountries?: CountryType[]
}

export type CustomersConfig = {
  /**
   * Slug of the customers collection, defaults to 'users'.
   * This is used to link carts and orders to customers.
   */
  slug: string
}

export type CartsConfig = {
  /**
   * Allow guest (unauthenticated) users to create carts.
   * When enabled, guests can create carts without being logged in.
   * Defaults to true.
   */
  allowGuestCarts?: boolean
  cartsCollectionOverride?: CollectionOverride
}

export type InventoryConfig = {
  /**
   * Override the default field used to track inventory levels. Defaults to 'inventory'.
   */
  fieldName?: string
}

export type CurrenciesConfig = {
  /**
   * Defaults to the first supported currency.
   *
   * @example 'USD'
   */
  defaultCurrency: string
  /**
   *
   */
  supportedCurrencies: Currency[]
}

/**
 * A function that validates a product or variant before a transaction is created or completed.
 * This should throw an error if validation fails as it will be caught by the function calling it.
 */
export type ProductsValidation = (args: {
  /**
   * The full currencies config, allowing you to check against supported currencies and their settings.
   */
  currenciesConfig?: CurrenciesConfig
  /**
   * The ISO 4217 currency code being usen in this transaction.
   */
  currency?: string
  /**
   * The full product data.
   */
  product: TypedCollection['products']
  /**
   * Quantity to check the inventory amount against.
   */
  quantity: number
  /**
   * The full variant data, if a variant was selected for the product otherwise it will be undefined.
   */
  variant?: TypedCollection['variants']
}) => Promise<void> | void

/**
 * A map of collection slugs used by the Ecommerce plugin.
 * Provides an easy way to track the slugs of collections even when they are overridden.
 */
export type CollectionSlugMap = {
  addresses: string
  carts: string
  customers: string
  orders: string
  products: string
  transactions: string
  variantOptions: string
  variants: string
  variantTypes: string
}

/**
 * Access control functions used throughout the Ecommerce plugin.
 * Provide atomic access functions that can be composed using or, and, conditional utilities.
 *
 * @example
 * ```ts
 *  access: {
 *    isAdmin: ({ req }) => checkRole(['admin'], req.user),
 *    isAuthenticated: ({ req }) => !!req.user,
 *    isDocumentOwner: ({ req }) => {
 *      if (!req.user) return false
 *      return { customer: { equals: req.user.id } }
 *    },
 *    adminOnlyFieldAccess: ({ req }) => checkRole(['admin'], req.user),
 *    customerOnlyFieldAccess: ({ req }) => !!req.user,
 *    adminOrPublishedStatus: ({ req }) => {
 *      if (checkRole(['admin'], req.user)) return true
 *      return { _status: { equals: 'published' } }
 *    },
 *  }
 * ```
 */
export type AccessConfig = {
  /**
   * Limited to only admin users, specifically for Field level access control.
   */
  adminOnlyFieldAccess: FieldAccess
  /**
   * The document status is published or user is admin.
   */
  adminOrPublishedStatus: Access
  /**
   * Limited to customers only, specifically for Field level access control.
   */
  customerOnlyFieldAccess: FieldAccess
  /**
   * Checks if the user is an admin.
   * @returns true if admin, false otherwise
   */
  isAdmin: Access
  /**
   * Checks if the user is authenticated (any role).
   * @returns true if authenticated, false otherwise
   */
  isAuthenticated?: Access
  /**
   * Checks if the user owns the document being accessed.
   * Typically returns a Where query to filter by customer field.
   * @returns true for full access, false for no access, or Where query for conditional access
   */
  isDocumentOwner: Access
  /**
   * Entirely public access. Defaults to returning true.
   *
   * @example
   * publicAccess: () => true
   */
  publicAccess?: Access
}

export type EcommercePluginConfig = {
  /**
   * Customise the access control for the plugin.
   *
   * @example
   * ```ts
   * ```
   */
  access: AccessConfig
  /**
   * Enable the addresses collection to allow customers, transactions and orders to have multiple addresses for shipping and billing. Accepts an override to customise the addresses collection.
   * Defaults to supporting a default set of countries.
   */
  addresses?: AddressesConfig | boolean
  /**
   * Configure the target collection used for carts.
   *
   * Defaults to true.
   */
  carts?: boolean | CartsConfig
  /**
   * Configure supported currencies and default settings.
   *
   * Defaults to supporting USD.
   */
  currencies?: CurrenciesConfig
  /**
   * Configure the target collection used for customers.
   *
   * @example
   * ```ts
   * customers: {
   *  slug: 'users', // default
   * }
   *
   */
  customers: CustomersConfig
  /**
   * Enable tracking of inventory for products and variants. Accepts a config object to override the default collection settings.
   *
   * Defaults to true.
   */
  inventory?: boolean | InventoryConfig
  /**
   * Enables orders and accepts a config object to override the default collection settings.
   *
   * Defaults to true.
   */
  orders?: boolean | OrdersConfig
  /**
   * Enable tracking of payments. Accepts a config object to override the default collection settings.
   *
   * Defaults to true when the paymentMethods array is provided.
   */
  payments?: PaymentsConfig
  /**
   * Enables products and variants. Accepts a config object to override the product collection and each variant collection type.
   *
   * Defaults to true.
   */
  products?: boolean | ProductsConfig
  /**
   * Override the default slugs used across the plugin. This lets the plugin know which slugs to use for various internal operations and fields.
   */
  slugMap?: Partial<CollectionSlugMap>
  /**
   * Enable tracking of transactions. Accepts a config object to override the default collection settings.
   *
   * Defaults to true when the paymentMethods array is provided.
   */
  transactions?: boolean | TransactionsConfig
}

export type SanitizedEcommercePluginConfig = {
  access: Required<AccessConfig>
  addresses: { addressFields: Field[] } & Omit<AddressesConfig, 'addressFields'>
  currencies: Required<CurrenciesConfig>
  inventory?: InventoryConfig
  payments: {
    paymentMethods: [] | PaymentAdapter[]
  }
} & Omit<
  Required<EcommercePluginConfig>,
  'access' | 'addresses' | 'currencies' | 'inventory' | 'payments'
>

export type EcommerceCollections = TypedEcommerce['collections']

export type AddressesCollection = EcommerceCollections['addresses']
export type CartsCollection = EcommerceCollections['carts']

export type SyncLocalStorageConfig = {
  /**
   * Key to use for localStorage.
   * Defaults to 'cart'.
   */
  key?: string
}

type APIProps = {
  /**
   * The route for the Payload API, defaults to `/api`.
   */
  apiRoute?: string
  /**
   * Customise the query used to fetch carts. Use this when you need to fetch additional data and optimise queries using depth, select and populate.
   *
   * Defaults to `{ depth: 0 }`.
   */
  cartsFetchQuery?: {
    depth?: number
    populate?: PopulateType
    select?: SelectType
  }
  /**
   * The route for the Payload API, defaults to ``. Eg for a Payload app running on `http://localhost:3000`, the default serverURL would be `http://localhost:3000`.
   */
  serverURL?: string
}

export type ContextProps = {
  /**
   * The slug for the addresses collection.
   *
   * Defaults to 'addresses'.
   */
  addressesSlug?: string
  api?: APIProps
  /**
   * The slug for the carts collection.
   *
   * Defaults to 'carts'.
   */
  cartsSlug?: string
  children?: React.ReactNode
  /**
   * The configuration for currencies used in the ecommerce context.
   * This is used to handle currency formatting and calculations, defaults to USD.
   */
  currenciesConfig?: CurrenciesConfig
  /**
   * The slug for the customers collection.
   *
   * Defaults to 'users'.
   */
  customersSlug?: string
  /**
   * Enable debug mode for the ecommerce context. This will log additional information to the console.
   * Defaults to false.
   */
  debug?: boolean
  /**
   * Whether to enable support for variants in the cart.
   * This allows adding products with specific variants to the cart.
   * Defaults to false.
   */
  enableVariants?: boolean
  /**
   * Supported payment methods for the ecommerce context.
   */
  paymentMethods?: PaymentAdapterClient[]
  /**
   * Whether to enable localStorage for cart persistence.
   * Defaults to true.
   */
  syncLocalStorage?: boolean | SyncLocalStorageConfig
}

/**
 * Type used internally to represent the cart item to be added.
 */
type CartItemArgument = {
  /**
   * The ID of the product to add to the cart. Always required.
   */
  product: DefaultDocumentIDType
  /**
   * The ID of the variant to add to the cart. Optional, if not provided, the product will be added without a variant.
   */
  variant?: DefaultDocumentIDType
}

export type EcommerceContextType<T extends EcommerceCollections = EcommerceCollections> = {
  /**
   * Add an item to the cart.
   */
  addItem: (item: CartItemArgument, quantity?: number) => Promise<void>
  /**
   * All current addresses for the current user.
   * This is used to manage shipping and billing addresses.
   */
  addresses?: T['addresses'][]
  /**
   * The current data of the cart.
   */
  cart?: T['addresses']
  /**
   * The ID of the current cart corresponding to the cart in the database or local storage.
   */
  cartID?: DefaultDocumentIDType
  /**
   * Clear the cart, removing all items.
   */
  clearCart: () => Promise<void>
  /**
   * Initiate a payment using the selected payment method.
   * This method should be called after the cart is ready for checkout.
   * It requires the payment method ID and any necessary payment data.
   */
  confirmOrder: (
    paymentMethodID: string,
    options?: { additionalData: Record<string, unknown> },
  ) => Promise<unknown>
  /**
   * Create a new address by providing the data.
   */
  createAddress: (data: Partial<T['addresses']>) => Promise<void>
  /**
   * The configuration for the currencies used in the ecommerce context.
   */
  currenciesConfig: CurrenciesConfig
  /**
   * The currently selected currency used for the cart and price formatting automatically.
   */
  currency: Currency
  /**
   * Decrement an item in the cart by its index ID.
   * If quantity reaches 0, the item will be removed from the cart.
   */
  decrementItem: (item: DefaultDocumentIDType) => Promise<void>
  /**
   * Increment an item in the cart by its index ID.
   */
  incrementItem: (item: DefaultDocumentIDType) => Promise<void>
  /**
   * Initiate a payment using the selected payment method.
   * This method should be called after the cart is ready for checkout.
   * It requires the payment method ID and any necessary payment data.
   */
  initiatePayment: (
    paymentMethodID: string,
    options?: { additionalData: Record<string, unknown> },
  ) => Promise<unknown>
  /**
   * Indicates whether any cart operation is currently in progress.
   * Useful for disabling buttons and preventing race conditions.
   */
  isLoading: boolean
  paymentMethods: PaymentAdapterClient[]
  /**
   * Remove an item from the cart by its index ID.
   */
  removeItem: (item: DefaultDocumentIDType) => Promise<void>
  /**
   * The name of the currently selected payment method.
   * This is used to determine which payment method to use when initiating a payment.
   */
  selectedPaymentMethod?: null | string
  /**
   * Change the currency for the cart, it defaults to the configured currency.
   * This will update the currency used for pricing and calculations.
   */
  setCurrency: (currency: string) => void
  /**
   * Update an address by providing the data and the ID.
   */
  updateAddress: (addressID: DefaultDocumentIDType, data: Partial<T['addresses']>) => Promise<void>
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/plugin-ecommerce/src/types/utilities.ts

```typescript
import type { DefaultDocumentIDType, GeneratedTypes } from 'payload'

/**
 * THIS FILE IS EXTREMELY SENSITIVE PLEASE BE CAREFUL AS THERE IS EVIL AT PLAY
 *
 * This file is used to extract the types for the ecommerce plugin
 * from the user's generated types. It must be kept as a .ts file
 * and not a .tsx file, and it must not import any other files
 * that are not strictly types. This is to prevent circular
 * dependencies and to ensure that the types are always available.
 *
 * Do not add any runtime code to this file.
 */

type CartsUntyped = {
  [key: string]: any
  id: DefaultDocumentIDType
  items?: any[]
  subtotal?: number
}

type AddressesUntyped = {
  [key: string]: any
  id: DefaultDocumentIDType
}

type ResolveEcommerceType<T> = 'ecommerce' extends keyof T
  ? T['ecommerce']
  : // @ts-expect-error - typescript doesnt play nice here
    T['ecommerceUntyped']

export type TypedEcommerce = ResolveEcommerceType<GeneratedTypes>

declare module 'payload' {
  export interface GeneratedTypes {
    ecommerceUntyped: {
      collections: {
        addresses: AddressesUntyped
        carts: CartsUntyped
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/plugin-ecommerce/src/ui/utilities.ts

```typescript
import type { Currency } from '../types/index.js'

/**
 * Convert display value with decimal point to base value (e.g., $25.00 to 2500)
 */
export const convertToBaseValue = ({
  currency,
  displayValue,
}: {
  currency: Currency
  displayValue: string
}): number => {
  if (!currency) {
    return parseFloat(displayValue)
  }

  // Remove currency symbol and any non-numeric characters except decimal
  const cleanValue = displayValue.replace(currency.symbol, '').replace(/[^0-9.]/g, '')

  // Parse the clean value to a float
  const floatValue = parseFloat(cleanValue || '0')

  // Convert to the base value (e.g., cents for USD)
  return Math.round(floatValue * Math.pow(10, currency.decimals))
}

/**
 * Convert base value to display value with decimal point (e.g., 2500 to $25.00)
 */
export const convertFromBaseValue = ({
  baseValue,
  currency,
}: {
  baseValue: number
  currency: Currency
}): string => {
  if (!currency) {
    return baseValue.toString()
  }

  // Convert from base value (e.g., cents) to decimal value (e.g., dollars)
  const decimalValue = baseValue / Math.pow(10, currency.decimals)

  // Format with the correct number of decimal places
  return decimalValue.toFixed(currency.decimals)
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceCell/index.tsx

```typescript
'use client'
import type { DefaultCellComponentProps, TypedCollection } from 'payload'

import { useTranslation } from '@payloadcms/ui'

import type { CurrenciesConfig, Currency } from '../../types/index.js'

import { convertFromBaseValue } from '../utilities.js'

type Props = {
  cellData?: number
  currenciesConfig: CurrenciesConfig
  currency?: Currency
  path: string
  rowData: Partial<TypedCollection['products']>
} & DefaultCellComponentProps

export const PriceCell: React.FC<Props> = (args) => {
  const { t } = useTranslation()
  const { cellData, currenciesConfig, currency: currencyFromProps, rowData } = args

  const currency = currencyFromProps || currenciesConfig.supportedCurrencies[0]

  if (!currency) {
    // @ts-expect-error - plugin translations are not typed yet
    return <span>{t('plugin-ecommerce:currencyNotSet')}</span>
  }

  if (
    (!cellData || typeof cellData !== 'number') &&
    'enableVariants' in rowData &&
    rowData.enableVariants
  ) {
    // @ts-expect-error - plugin translations are not typed yet
    return <span>{t('plugin-ecommerce:priceSetInVariants')}</span>
  }

  if (!cellData) {
    // @ts-expect-error - plugin translations are not typed yet
    return <span>{t('plugin-ecommerce:priceNotSet')}</span>
  }

  return (
    <span>
      {currency.symbol}
      {convertFromBaseValue({ baseValue: cellData, currency })}
    </span>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: FormattedInput.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceInput/FormattedInput.tsx
Signals: React

```typescript
'use client'

import type { StaticDescription, StaticLabel } from 'payload'

import { FieldDescription, FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Currency } from '../../types/index.js'

import { USD } from '../../currencies/index.js'
import { convertFromBaseValue, convertToBaseValue } from '../utilities.js'

interface Props {
  currency?: Currency
  description?: StaticDescription
  disabled?: boolean
  error?: string
  id?: string
  label?: StaticLabel
  path: string
  placeholder?: string
  readOnly?: boolean
  supportedCurrencies: Currency[]
}

const baseClass = 'formattedPrice'

export const FormattedInput: React.FC<Props> = ({
  id: idFromProps,
  currency: currencyFromProps,
  description,
  disabled = false,
  label,
  path,
  placeholder = '0.00',
  readOnly,
  supportedCurrencies,
}) => {
  const { setValue, value } = useField<number>({ path })
  const [displayValue, setDisplayValue] = useState<string>('')

  const inputRef = useRef<HTMLInputElement>(null)
  const isFirstRender = useRef(true)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const parentPath = path.split('.').slice(0, -1).join('.')
  const currencyPath = parentPath ? `${parentPath}.currency` : 'currency'

  const currencyFromSelectField = useFormFields(([fields, _]) => fields[currencyPath])

  const currencyCode = currencyFromProps?.code ?? (currencyFromSelectField?.value as string)
  const id = idFromProps || path

  const currency = useMemo<Currency>(() => {
    if (currencyCode && supportedCurrencies) {
      const foundCurrency = supportedCurrencies.find(
        (supportedCurrency) => supportedCurrency.code === currencyCode,
      )

      return foundCurrency ?? supportedCurrencies[0] ?? USD
    }

    return supportedCurrencies[0] ?? USD
  }, [currencyCode, supportedCurrencies])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      if (value === undefined || value === null) {
        setDisplayValue('')
      } else {
        setDisplayValue(convertFromBaseValue({ baseValue: value, currency }))
      }
    }
  }, [currency, value, currencyFromProps])

  const updateValue = useCallback(
    (inputValue: string) => {
      if (inputValue === '') {
        setValue(null)

        return
      }

      const baseValue = convertToBaseValue({ currency, displayValue: inputValue })

      setValue(baseValue)
    },
    [currency, setValue],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      if (!/^\d*(?:\.\d*)?$/.test(inputValue) && inputValue !== '') {
        return
      }

      setDisplayValue(inputValue)

      // Clear any existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Only update the base value after a delay to avoid formatting while typing
      debounceTimer.current = setTimeout(() => {
        updateValue(inputValue)
      }, 500)
    },
    [updateValue, setDisplayValue],
  )

  const handleInputBlur = useCallback(() => {
    if (displayValue === '') {
      return
    }

    // Clear any pending debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }

    const baseValue = convertToBaseValue({ currency, displayValue })
    const formattedValue = convertFromBaseValue({ baseValue, currency })

    if (value != baseValue) {
      setValue(baseValue)
    }

    setDisplayValue(formattedValue)
  }, [currency, displayValue, setValue, value])

  return (
    <div className={`field-type number ${baseClass}`}>
      {label && <FieldLabel as="label" htmlFor={id} label={label} />}

      <div className={`${baseClass}Container`}>
        <div className={`${baseClass}CurrencySymbol`}>
          <span>{currency.symbol}</span>
        </div>

        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <input
          className={`${baseClass}Input`}
          disabled={disabled || readOnly}
          id={id}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          placeholder={placeholder}
          ref={inputRef}
          type="text"
          value={displayValue}
        />
      </div>
      <FieldDescription
        className={`${baseClass}Description`}
        description={description}
        path={path}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
