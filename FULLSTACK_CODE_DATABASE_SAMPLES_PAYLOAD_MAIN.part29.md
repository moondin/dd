---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 29
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 29 of 695)

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

---[FILE: advanced.mdx]---
Location: payload-main/docs/ecommerce/advanced.mdx

```text
---
title: Advanced uses and examples
label: Advanced
order: 60
desc: Add ecommerce functionality to your Payload CMS application with this plugin.
keywords: plugins, ecommerce, stripe, plugin, payload, cms, shop, payments
---

The plugin also exposes its internal utilities so that you can use only the parts that you need without using the entire plugin. This is useful if you want to build your own ecommerce solution on top of Payload.

## Using only the collections

You can import the collections directly from the plugin and add them to your Payload configuration. This way, you can use the collections without using the entire plugin:

| Name                             | Collection       | Description                                                                                                                                     |
| -------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `createAddressesCollection`      | `addresses`      | Used for customer addresses (like shipping and billing). [More](#createAddressesCollection)                                                     |
| `createCartsCollection`          | `carts`          | Carts can be used by customers, guests and once purchased are kept for records and analytics. [More](#createCartsCollection)                    |
| `createOrdersCollection`         | `orders`         | Orders are used to store customer-side information and are related to at least one transaction. [More](#createOrdersCollection)                 |
| `createTransactionsCollection`   | `transactions`   | Handles payment information accessible by admins only, related to Orders. [More](#createTransactionsCollection)                                 |
| `createProductsCollection`       | `products`       | All the product information lives here, contains prices, relations to Variant Types and joins to Variants. [More](#createProductsCollection)    |
| `createVariantsCollection`       | `variants`       | Product variants, unique purchasable items that are linked to a product and Variant Options. [More](#createVariantsCollection)                  |
| `createVariantTypesCollection`   | `variantTypes`   | A taxonomy used by Products to relate Variant Options together. An example of a Variant Type is "size". [More](#createVariantTypesCollection)   |
| `createVariantOptionsCollection` | `variantOptions` | Related to a Variant Type to handle a unique property of it. An example of a Variant Option is "small". [More](#createVariantOptionsCollection) |

### createAddressesCollection

Use this to create the `addresses` collection. This collection is used to store customer addresses. It takes the following properties:

| Property             | Type            | Description                                                           |
| -------------------- | --------------- | --------------------------------------------------------------------- |
| `access`             | `object`        | Access control for the collection.                                    |
| `addressFields`      | `Field[]`       | Custom fields to add to the address.                                  |
| `customersSlug`      | `string`        | (Optional) Slug of the customers collection. Defaults to `customers`. |
| `supportedCountries` | `CountryType[]` | (Optional) List of supported countries. Defaults to all countries.    |

The access object can contain the following properties:

| Property                  | Type          | Description                                                                                                                                                       |
| ------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAdmin`                 | `Access`      | Access control to check if the user has `admin` permissions.                                                                                                      |
| `isAuthenticated`         | `Access`      | Access control to check if the user is authenticated. Use on the `create` access to allow any customer to create a new address.                                   |
| `isDocumentOwner`         | `Access`      | Access control to check if the user owns the document via the `customer` field. Used to limit read, update or delete to only the customers that own this address. |
| `customerOnlyFieldAccess` | `FieldAccess` | Field level access control to check if the user has `customer` permissions.                                                                                       |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createAddressesCollection } from 'payload-plugin-ecommerce'

const Addresses = createAddressesCollection({
  access: {
    isAdmin,
    isAuthenticated,
    isDocumentOwner,
    customerOnlyFieldAccess,
  },
  addressFields: [
    {
      name: 'company',
      type: 'text',
      label: 'Company',
    },
  ],
})
```

### createCartsCollection

Use this to create the `carts` collection to store customer carts. It takes the following properties:

| Property           | Type               | Description                                                             |
| ------------------ | ------------------ | ----------------------------------------------------------------------- |
| `access`           | `object`           | Access control for the collection.                                      |
| `customersSlug`    | `string`           | (Optional) Slug of the customers collection. Defaults to `customers`.   |
| `productsSlug`     | `string`           | (Optional) Slug of the products collection. Defaults to `products`.     |
| `variantsSlug`     | `string`           | (Optional) Slug of the variants collection. Defaults to `variants`.     |
| `enableVariants`   | `boolean`          | (Optional) Whether to enable variants in the cart. Defaults to `true`.  |
| `currenciesConfig` | `CurrenciesConfig` | (Optional) Currencies configuration to enable a subtotal to be tracked. |

The access object can contain the following properties:

| Property          | Type     | Description                                                                                                                                                    |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAdmin`         | `Access` | Access control to check if the user has `admin` permissions.                                                                                                   |
| `isAuthenticated` | `Access` | Access control to check if the user is authenticated.                                                                                                          |
| `isDocumentOwner` | `Access` | Access control to check if the user owns the document via the `customer` field. Used to limit read, update or delete to only the customers that own this cart. |
| `publicAccess`    | `Access` | (Optional) Allow anyone to create a new cart, useful for guests.                                                                                               |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createCartsCollection } from 'payload-plugin-ecommerce'

const Carts = createCartsCollection({
  access: {
    isAdmin,
    isAuthenticated,
    isDocumentOwner,
  },
  enableVariants: true,
  currenciesConfig: {
    defaultCurrency: 'usd',
    currencies: [
      {
        code: 'usd',
        symbol: '$',
      },
      {
        code: 'eur',
        symbol: '€',
      },
    ],
  },
})
```

### createOrdersCollection

Use this to create the `orders` collection to store customer orders. It takes the following properties:

| Property           | Type               | Description                                                                 |
| ------------------ | ------------------ | --------------------------------------------------------------------------- |
| `access`           | `object`           | Access control for the collection.                                          |
| `customersSlug`    | `string`           | (Optional) Slug of the customers collection. Defaults to `customers`.       |
| `transactionsSlug` | `string`           | (Optional) Slug of the transactions collection. Defaults to `transactions`. |
| `productsSlug`     | `string`           | (Optional) Slug of the products collection. Defaults to `products`.         |
| `variantsSlug`     | `string`           | (Optional) Slug of the variants collection. Defaults to `variants`.         |
| `enableVariants`   | `boolean`          | (Optional) Whether to enable variants in the order. Defaults to `true`.     |
| `currenciesConfig` | `CurrenciesConfig` | (Optional) Currencies configuration to enable the amount to be tracked.     |
| `addressFields`    | `Field[]`          | (Optional) The fields to be used for the shipping address.                  |

The access object can contain the following properties:

| Property               | Type          | Description                                                                                                                                   |
| ---------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAdmin`              | `Access`      | Access control to check if the user has `admin` permissions. Used to limit create, update and delete access to only admins.                   |
| `isDocumentOwner`      | `Access`      | Access control to check if the user owns the document via the `customer` field. Used to limit read to only the customers that own this order. |
| `adminOnlyFieldAccess` | `FieldAccess` | Field level access control to check if the user has `admin` permissions. Limits the transaction ID field to admins only.                      |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createOrdersCollection } from 'payload-plugin-ecommerce'

const Orders = createOrdersCollection({
  access: {
    isAdmin,
    isDocumentOwner,
    adminOnlyFieldAccess,
  },
  enableVariants: true,
  currenciesConfig: {
    defaultCurrency: 'usd',
    currencies: [
      {
        code: 'usd',
        symbol: '$',
      },
      {
        code: 'eur',
        symbol: '€',
      },
    ],
  },
  addressFields: [
    {
      name: 'deliveryInstructions',
      type: 'text',
      label: 'Delivery Instructions',
    },
  ],
})
```

### createTransactionsCollection

Use this to create the `transactions` collection to store payment transactions. It takes the following properties:

| Property           | Type               | Description                                                                   |
| ------------------ | ------------------ | ----------------------------------------------------------------------------- |
| `access`           | `object`           | Access control for the collection.                                            |
| `customersSlug`    | `string`           | (Optional) Slug of the customers collection. Defaults to `customers`.         |
| `cartsSlug`        | `string`           | (Optional) Slug of the carts collection. Defaults to `carts`.                 |
| `ordersSlug`       | `string`           | (Optional) Slug of the orders collection. Defaults to `orders`.               |
| `productsSlug`     | `string`           | (Optional) Slug of the products collection. Defaults to `products`.           |
| `variantsSlug`     | `string`           | (Optional) Slug of the variants collection. Defaults to `variants`.           |
| `enableVariants`   | `boolean`          | (Optional) Whether to enable variants in the transaction. Defaults to `true`. |
| `currenciesConfig` | `CurrenciesConfig` | (Optional) Currencies configuration to enable the amount to be tracked.       |
| `addressFields`    | `Field[]`          | (Optional) The fields to be used for the billing address.                     |
| `paymentMethods`   | `PaymentAdapter[]` | (Optional) The payment methods to be used for the transaction.                |

The access object can contain the following properties:

| Property  | Type     | Description                                                                                           |
| --------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `isAdmin` | `Access` | Access control to check if the user has `admin` permissions. Used to limit all access to only admins. |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createTransactionsCollection } from 'payload-plugin-ecommerce'

const Transactions = createTransactionsCollection({
  access: {
    isAdmin,
  },
  enableVariants: true,
  currenciesConfig: {
    defaultCurrency: 'usd',
    currencies: [
      {
        code: 'usd',
        symbol: '$',
      },
      {
        code: 'eur',
        symbol: '€',
      },
    ],
  },
  addressFields: [
    {
      name: 'billingInstructions',
      type: 'text',
      label: 'Billing Instructions',
    },
  ],
  paymentMethods: [
    // Add your payment adapters here
  ],
})
```

### createProductsCollection

Use this to create the `products` collection to store products. It takes the following properties:

| Property           | Type                        | Description                                                                      |
| ------------------ | --------------------------- | -------------------------------------------------------------------------------- |
| `access`           | `object`                    | Access control for the collection.                                               |
| `variantsSlug`     | `string`                    | (Optional) Slug of the variants collection. Defaults to `variants`.              |
| `variantTypesSlug` | `string`                    | (Optional) Slug of the variant types collection. Defaults to `variantTypes`.     |
| `enableVariants`   | `boolean`                   | (Optional) Whether to enable variants on products. Defaults to `true`.           |
| `currenciesConfig` | `CurrenciesConfig`          | (Optional) Currencies configuration to enable price fields.                      |
| `inventory`        | `boolean` `InventoryConfig` | (Optional) Inventory configuration to enable stock tracking. Defaults to `true`. |

The access object can contain the following properties:

| Property                 | Type     | Description                                                                                                                                                             |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAdmin`                | `Access` | Access control to check if the user has `admin` permissions. Used to limit create, update or delete to only admins.                                                     |
| `adminOrPublishedStatus` | `Access` | Access control to check if the user has `admin` permissions or if the product has a `published` status. Used to limit read access to published products for non-admins. |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createProductsCollection } from 'payload-plugin-ecommerce'

const Products = createProductsCollection({
  access: {
    isAdmin,
    adminOrPublishedStatus,
  },
  enableVariants: true,
  currenciesConfig: {
    defaultCurrency: 'usd',
    currencies: [
      {
        code: 'usd',
        symbol: '$',
      },
      {
        code: 'eur',
        symbol: '€',
      },
    ],
  },
  inventory: {
    enabled: true,
    trackByVariant: true,
    lowStockThreshold: 5,
  },
})
```

### createVariantsCollection

Use this to create the `variants` collection to store product variants. It takes the following properties:

| Property             | Type                        | Description                                                                      |
| -------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `access`             | `object`                    | Access control for the collection.                                               |
| `productsSlug`       | `string`                    | (Optional) Slug of the products collection. Defaults to `products`.              |
| `variantOptionsSlug` | `string`                    | (Optional) Slug of the variant options collection. Defaults to `variantOptions`. |
| `currenciesConfig`   | `CurrenciesConfig`          | (Optional) Currencies configuration to enable price fields.                      |
| `inventory`          | `boolean` `InventoryConfig` | (Optional) Inventory configuration to enable stock tracking. Defaults to `true`. |

The access object can contain the following properties:

| Property                 | Type     | Description                                                                                                                                                                                 |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAdmin`                | `Access` | Access control to check if the user has `admin` permissions. Used to limit all access to only admins.                                                                                       |
| `adminOrPublishedStatus` | `Access` | Access control to check if the user has `admin` permissions or if the related product has a `published` status. Used to limit read access to variants of published products for non-admins. |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createVariantsCollection } from 'payload-plugin-ecommerce'

const Variants = createVariantsCollection({
  access: {
    isAdmin,
    adminOrPublishedStatus,
  },
  currenciesConfig: {
    defaultCurrency: 'usd',
    currencies: [
      {
        code: 'usd',
        symbol: '$',
      },
      {
        code: 'eur',
        symbol: '€',
      },
    ],
  },
  inventory: {
    enabled: true,
    lowStockThreshold: 5,
  },
})
```

### createVariantTypesCollection

Use this to create the `variantTypes` collection to store variant types. It takes the following properties:

| Property             | Type     | Description                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------- |
| `access`             | `object` | Access control for the collection.                                               |
| `variantOptionsSlug` | `string` | (Optional) Slug of the variant options collection. Defaults to `variantOptions`. |

The access object can contain the following properties:

| Property       | Type     | Description                                                                                           |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `isAdmin`      | `Access` | Access control to check if the user has `admin` permissions. Used to limit all access to only admins. |
| `publicAccess` | `Access` | (Optional) Allow anyone to read variant types.                                                        |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createVariantTypesCollection } from 'payload-plugin-ecommerce'

const VariantTypes = createVariantTypesCollection({
  access: {
    isAdmin,
    publicAccess,
  },
})
```

### createVariantOptionsCollection

Use this to create the `variantOptions` collection to store variant options. It takes the following properties:

| Property           | Type     | Description                                                                  |
| ------------------ | -------- | ---------------------------------------------------------------------------- |
| `access`           | `object` | Access control for the collection.                                           |
| `variantTypesSlug` | `string` | (Optional) Slug of the variant types collection. Defaults to `variantTypes`. |

The access object can contain the following properties:

| Property       | Type     | Description                                                                                           |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `isAdmin`      | `Access` | Access control to check if the user has `admin` permissions. Used to limit all access to only admins. |
| `publicAccess` | `Access` | (Optional) Allow anyone to read variant options.                                                      |

See the [access control section](./plugin#access) for more details on each of these functions.

Example usage:

```ts
import { createVariantOptionsCollection } from 'payload-plugin-ecommerce'

const VariantOptions = createVariantOptionsCollection({
  access: {
    isAdmin,
    publicAccess,
  },
})
```

## Typescript

There are several common types that you'll come across when working with this package. These are export from the package as well and are used across individual utilities as well.

### CurrenciesConfig

Defines the supported currencies in Payload and the frontend. It has the following properties:

| Property          | Type             | Description                                                                       |
| ----------------- | ---------------- | --------------------------------------------------------------------------------- |
| `defaultCurrency` | `string`         | The default currency code. Must match one of the codes in the `currencies` array. |
| `currencies`      | `CurrencyType[]` | An array of supported currencies. Each currency must have a unique code.          |

### Currency

Defines a currency to be used in the application. It has the following properties:

| Property   | Type     | Description                                      |
| ---------- | -------- | ------------------------------------------------ |
| `code`     | `string` | The ISO 4217 currency code. Example `'usd'`.     |
| `symbol`   | `string` | The symbol of the currency. Example `'$'`        |
| `label`    | `string` | The name of the currency. Example `'USD'`        |
| `decimals` | `number` | The number of decimal places to use. Example `2` |

The decimals is very important to provide as we store all prices as integers to avoid floating point issues. For example, if you're using USD, you would store a price of $10.00 as `1000` (10 \* 10^2), so when formatting the price for display we need to know how many decimal places the currency supports.

### CountryType

Used to define a country in address fields and supported countries lists. It has the following properties:

| Property | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `value`  | `string` | The ISO 3166-1 alpha-2 code. |
| `label`  | `string` | The name of the country.     |

### InventoryConfig

It's used to customise the inventory tracking settings on products and variants. It has the following properties:

| Property    | Type     | Description                                                                          |
| ----------- | -------- | ------------------------------------------------------------------------------------ |
| `fieldName` | `string` | (Optional) The name of the field to use for tracking stock. Defaults to `inventory`. |
```

--------------------------------------------------------------------------------

---[FILE: frontend.mdx]---
Location: payload-main/docs/ecommerce/frontend.mdx

```text
---
title: Ecommerce Frontend
label: Frontend
order: 30
desc: Add ecommerce functionality to your Payload CMS application with this plugin.
keywords: plugins, ecommerce, stripe, plugin, payload, cms, shop, payments
---

The package provides a set of React utilities to help you manage your ecommerce frontend. These include context providers, hooks, and components to handle carts, products, and payments.

The following hooks and components are available:

| Hook / Component    | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `EcommerceProvider` | A context provider to wrap your application and provide the ecommerce context. |
| `useCart`           | A hook to manage the cart state and actions.                                   |
| `useAddresses`      | A hook to fetch and manage addresses.                                          |
| `usePayments`       | A hook to manage the checkout process.                                         |
| `useCurrency`       | A hook to format prices based on the selected currency.                        |
| `useEcommerce`      | A hook that encompasses all of the above in one.                               |

### EcommerceProvider

The `EcommerceProvider` component is used to wrap your application and provide the ecommerce context. It takes the following props:

| Prop               | Type               | Description                                                                                                 |
| ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `addressesSlug`    | `string`           | The slug of the addresses collection. Defaults to `addresses`.                                              |
| `api`              | `object`           | API configuration for the internal fetches of the provider. [More](#api)                                    |
| `cartsSlug`        | `string`           | The slug of the carts collection. Defaults to `carts`.                                                      |
| `children`         | `ReactNode`        | The child components that will have access to the ecommerce context.                                        |
| `currenciesConfig` | `CurrenciesConfig` | Configuration for supported currencies. See [Currencies](./plugin#currencies).                              |
| `customersSlug`    | `string`           | The slug of the customers collection. Defaults to `users`.                                                  |
| `debug`            | `boolean`          | Enable or disable debug mode. This will send more information to the console.                               |
| `enableVariants`   | `boolean`          | Enable or disable product variants support. Defaults to `true`.                                             |
| `paymentMethods`   | `PaymentMethod[]`  | An array of payment method adapters for the client side. See [Payment adapters](./plugin#payment-adapters). |
| `syncLocalStorage` | `boolean` `object` | Whether to sync the cart ID to local storage. Defaults to `true`. Takes an object for configuration         |

Example usage:

```tsx
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
// Import any payment adapters you want to use on the client side
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { USD, EUR } from '@payloadcms/plugin-ecommerce'

export const Providers = () => (
  <EcommerceProvider
    enableVariants={true}
    currenciesConfig={{
      supportedCurrencies: [USD, EUR],
      defaultCurrency: 'USD',
    }}
  >
    {children}
  </EcommerceProvider>
)
```

#### api

The `api` prop is used to configure the API settings for the internal fetches of the provider. It takes an object with the following properties:

| Property          | Type     | Description                                                       |
| ----------------- | -------- | ----------------------------------------------------------------- |
| `apiRoute`        | `string` | The base route for accessing the Payload API. Defaults to `/api`. |
| `serverURL`       | `string` | The full URL of your Payload server.                              |
| `cartsFetchQuery` | `object` | Additional query parameters to include when fetching the cart.    |

#### cartsFetchQuery

The `cartsFetchQuery` property allows you to specify additional query parameters to include when fetching the cart. This can be useful for including related data or customizing the response. This accepts:

| Property   | Type           | Description                                                     |
| ---------- | -------------- | --------------------------------------------------------------- |
| `depth`    | `string`       | Defaults to 0. [See Depth](../queries/depth)                    |
| `select`   | `SelectType`   | Select parameters. [See Select](../queries/select)              |
| `populate` | `PopulateType` | Populate parameters. [See Populate](../queries/select#populate) |

Example usage:

```tsx
<EcommerceProvider
  api={{
    cartsFetchQuery: {
      depth: 2, // Include related data up to 2 levels deep
    },
  }}
>
  {children}
</EcommerceProvider>
```

#### syncLocalStorage

The `syncLocalStorage` prop is used to enable or disable syncing the cart ID to local storage. This allows the cart to persist across page reloads and sessions. It defaults to `true`.

You can also provide an object with the following properties for more configuration:

| Property | Type     | Description                                                                  |
| -------- | -------- | ---------------------------------------------------------------------------- |
| `key`    | `string` | The key to use for storing the cart ID in local storage. Defaults to `cart`. |

### useCart

The `useCart` hook is used to manage the cart state and actions. It provides methods to add, remove, and update items in the cart, as well as to fetch the current cart state. It has the following properties:

| Property        | Type                                               | Description                                                                               |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `addItem`       | `(item: CartItemInput, quantity?: number) => void` | Method to add an item to the cart, optionally accepts a quantity to add multiple at once. |
| `cart`          | `Cart` `null`                                      | The current cart state. Null or undefined if it doesn't exist.                            |
| `clearCart`     | `() => void`                                       | Method to clear the cart.                                                                 |
| `decrementItem` | `(item: IDType) => void`                           | Method to decrement the quantity of an item. Will remove it entirely if it reaches 0.     |
| `incrementItem` | `(item: IDType) => void`                           | Method to increment the quantity of an item.                                              |
| `isLoading`     | `boolean`                                          | Boolean indicating if any async operation is in progress (e.g., adding/removing items).   |
| `removeItem`    | `(item: IDType) => void`                           | Method to remove an item from the cart.                                                   |

Example usage:

```tsx
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

const CartComponent = () => {
  const {
    addItem,
    cart,
    clearCart,
    decrementItem,
    incrementItem,
    isLoading,
    removeItem,
  } = useCart()

  // Your component logic here
  // Use isLoading to show loading states in your UI
}
```

### useAddresses

The `useAddresses` hook is used to fetch and manage addresses. It provides methods to create, update, and delete addresses, as well as to fetch the list of addresses. It has the following properties:

| Property        | Type                                                              | Description                                                                                 |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `addresses`     | `Address[]`                                                       | The list of addresses, if any are available for the current user.                           |
| `createAddress` | `(data: Address) => Promise<Address>`                             | Method to create a new address.                                                             |
| `isLoading`     | `boolean`                                                         | Boolean indicating if any async operation is in progress (e.g., creating/updating address). |
| `updateAddress` | `(addressID: IDType, data: Partial<Address>) => Promise<Address>` | Method to update an existing address by ID.                                                 |

Example usage:

```tsx
import { useAddresses } from '@payloadcms/plugin-ecommerce/client/react'

const AddressesComponent = () => {
  const { addresses, createAddress, isLoading, updateAddress } = useAddresses()

  // Your component logic here
  // Use isLoading to show loading states while creating or updating addresses
}
```

### usePayments

The `usePayments` hook is used to manage the checkout process. It provides methods to initiate payments, confirm orders, and handle payment status. It has the following properties:

| Property                | Type                       | Description                                                                                   |
| ----------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| `confirmOrder`          | `(args) => Promise<Order>` | Method to confirm an order by ID. [More](#confirmOrder)                                       |
| `initiatePayment`       | `(args) => Promise<void>`  | Method to initiate a payment for an order. [More](#initiatePayment)                           |
| `isLoading`             | `boolean`                  | Boolean indicating if any async operation is in progress (e.g., initiating/confirming order). |
| `paymentMethods`        | `PaymentMethod[]`          | The list of available payment methods.                                                        |
| `selectedPaymentMethod` | `PaymentMethod`            | The currently selected payment method, if any.                                                |

Example usage:

```tsx
import { usePayments } from '@payloadcms/plugin-ecommerce/client/react'

const CheckoutComponent = () => {
  const {
    confirmOrder,
    initiatePayment,
    isLoading,
    paymentMethods,
    selectedPaymentMethod,
  } = usePayments()

  // Your component logic here
  // Use isLoading to show loading states during payment initiation or order confirmation
}
```

#### confirmOrder

Use this method to confirm an order by its ID. It requires the payment method ID and will return the order ID.

```ts
try {
  const data = await confirmOrder('stripe', {
    additionalData: {
      paymentIntentID: paymentIntent.id,
      customerEmail,
    },
  })
  // Return type will contain `orderID`
  // use data to redirect to your order page
} catch (error) {
  // handle error
}
```

If the payment gateway requires additional confirmations offsite then you will need another landing page to handle that. For example with Stripe you may need to use a callback URL, just make sure the relevant information is routed back.

<Banner type="info">
  This will mark the transaction as complete in the backend and create the order
  for the user.
</Banner>

#### initiatePayment

Use this method to initiate a payment for an order. It requires the cart ID and the payment method ID. Depending on the payment method, additional data may be required. Depending on the payment method used you may need to provide additional data, for example with Stripe:

```ts
try {
  const data = await initiatePayment('stripe', {
    additionalData: {
      customerEmail,
      billingAddress,
      shippingAddress,
    },
  })
} catch (error) {
  // handle error
}
```

This function will hit the Payload API endpoint for `/stripe/initiate` and return the payment data required to complete the payment on the client side, which by default will include a `client_secret` to complete the payment with Stripe.js. The next step is to call the `confirmOrder` once payment is confirmed on the client side by Stripe.

<Banner type="info">
  At this step the cart is verified and a transaction is created in the backend
  with the address details provided. No order is created yet until you call
  `confirmOrder`, which should be done after payment is confirmed on the client
  side or via webhooks if you opt for that approach instead.
</Banner>

### useCurrency

The `useCurrency` hook is used to format prices based on the selected currency. It provides methods to format prices and to get the current currency. It has the following properties:

| Property           | Type                             | Description                                                                                                                           |
| ------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `currenciesConfig` | `CurrenciesConfig`               | The configuration for supported currencies. Directly matching the config provided to the Context Provider. [More](#ecommerceprovider) |
| `currency`         | `Currency`                       | The currently selected currency.                                                                                                      |
| `formatPrice`      | `(amount: number) => string`     | Method to format a price based on the selected currency.                                                                              |
| `setCurrency`      | `(currencyCode: string) => void` | Method to set the current currency by code. It will update all price formats when used in conjunction with the `formatPrice` utility. |

`formatPrice` in particular is very helpful as all prices are stored as integers to avoid any potential issues with decimal calculations, therefore on the frontend you can use this utility to format your price accounting for the currency and decimals. Example usage:

```tsx
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'

const PriceComponent = ({ amount }) => {
  const { currenciesConfig, currency, setCurrency } = useCurrency()

  return <div>{formatPrice(amount)}</div>
}
```

### useEcommerce

The `useEcommerce` hook encompasses all of the above hooks in one. It provides access to the cart, addresses, and payments hooks, along with a unified `isLoading` state that tracks any async operations across all these features.

Example usage:

```tsx
import { useEcommerce } from '@payloadcms/plugin-ecommerce/client/react'

const EcommerceComponent = () => {
  const { cart, addresses, isLoading, selectedPaymentMethod } = useEcommerce()

  // Your component logic here
  // isLoading tracks loading states for cart, addresses, and payment operations
}
```
```

--------------------------------------------------------------------------------

````
