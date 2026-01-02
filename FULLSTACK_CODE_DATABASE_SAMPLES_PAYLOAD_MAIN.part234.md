---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 234
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 234 of 695)

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

---[FILE: confirmOrder.ts]---
Location: payload-main/packages/plugin-ecommerce/src/endpoints/confirmOrder.ts

```typescript
import { addDataAndFileToRequest, type DefaultDocumentIDType, type Endpoint } from 'payload'

import type { CurrenciesConfig, PaymentAdapter, ProductsValidation } from '../types/index.js'

type Args = {
  /**
   * The slug of the carts collection, defaults to 'carts'.
   */
  cartsSlug?: string
  currenciesConfig: CurrenciesConfig
  /**
   * The slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  /**
   * The slug of the orders collection, defaults to 'orders'.
   */
  ordersSlug?: string
  paymentMethod: PaymentAdapter
  /**
   * The slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Customise the validation used for checking products or variants before a transaction is created.
   */
  productsValidation?: ProductsValidation
  /**
   * The slug of the transactions collection, defaults to 'transactions'.
   */
  transactionsSlug?: string
  /**
   * The slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

type ConfirmOrderHandler = (args: Args) => Endpoint['handler']

/**
 * Handles the endpoint for initiating payments. We will handle checking the amount and product and variant prices here before it is sent to the payment provider.
 * This is the first step in the payment process.
 */
export const confirmOrderHandler: ConfirmOrderHandler =
  ({
    cartsSlug = 'carts',
    currenciesConfig,
    customersSlug = 'users',
    ordersSlug = 'orders',
    paymentMethod,
    productsSlug = 'products',
    productsValidation,
    transactionsSlug = 'transactions',
    variantsSlug = 'variants',
  }) =>
  async (req) => {
    await addDataAndFileToRequest(req)

    const data = req.data
    const payload = req.payload
    const user = req.user

    let currency: string = currenciesConfig.defaultCurrency
    let cartID: DefaultDocumentIDType = data?.cartID
    let cart = undefined
    let customerEmail: string = user?.email ?? ''

    if (user) {
      if (user.cart?.docs && Array.isArray(user.cart.docs) && user.cart.docs.length > 0) {
        if (!cartID && user.cart.docs[0]) {
          // Use the user's cart instead
          if (typeof user.cart.docs[0] === 'object') {
            cartID = user.cart.docs[0].id
            cart = user.cart.docs[0]
          } else {
            cartID = user.cart.docs[0]
          }
        }
      }
    } else {
      // Get the email from the data if user is not available
      if (data?.customerEmail && typeof data.customerEmail === 'string') {
        customerEmail = data.customerEmail
      } else {
        return Response.json(
          {
            message: 'A customer email is required to make a purchase.',
          },
          {
            status: 400,
          },
        )
      }
    }

    if (!cart) {
      if (cartID) {
        cart = await payload.findByID({
          id: cartID,
          collection: cartsSlug,
          depth: 2,
          overrideAccess: false,
          select: {
            id: true,
            currency: true,
            customerEmail: true,
            items: true,
            subtotal: true,
          },
          user,
        })

        if (!cart) {
          return Response.json(
            {
              message: `Cart with ID ${cartID} not found.`,
            },
            {
              status: 404,
            },
          )
        }
      } else {
        return Response.json(
          {
            message: 'Cart ID is required.',
          },
          {
            status: 400,
          },
        )
      }
    }

    if (cart.currency && typeof cart.currency === 'string') {
      currency = cart.currency
    }

    // Ensure the currency is provided or inferred in some way
    if (!currency) {
      return Response.json(
        {
          message: 'Currency is required.',
        },
        {
          status: 400,
        },
      )
    }

    try {
      const paymentResponse = await paymentMethod.confirmOrder({
        customersSlug,
        data: {
          ...data,
          customerEmail,
        },
        ordersSlug,
        req,
        transactionsSlug,
      })

      if (paymentResponse.transactionID) {
        const transaction = await payload.findByID({
          id: paymentResponse.transactionID,
          collection: transactionsSlug,
          depth: 0,
          select: {
            id: true,
            items: true,
          },
        })

        if (transaction && Array.isArray(transaction.items) && transaction.items.length > 0) {
          for (const item of transaction.items) {
            if (item.variant) {
              const id = typeof item.variant === 'object' ? item.variant.id : item.variant

              await payload.db.updateOne({
                id,
                collection: variantsSlug,
                data: {
                  inventory: {
                    $inc: item.quantity * -1,
                  },
                },
              })
            } else if (item.product) {
              const id = typeof item.product === 'object' ? item.product.id : item.product

              await payload.db.updateOne({
                id,
                collection: productsSlug,
                data: {
                  inventory: {
                    $inc: item.quantity * -1,
                  },
                },
              })
            }
          }
        }
      }

      if ('paymentResponse.transactionID' in paymentResponse && paymentResponse.transactionID) {
        delete (paymentResponse as Partial<typeof paymentResponse>).transactionID
      }

      return Response.json(paymentResponse)
    } catch (error) {
      payload.logger.error(error, 'Error confirming order.')

      return Response.json(
        {
          message: 'Error confirming order.',
        },
        {
          status: 500,
        },
      )
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: initiatePayment.ts]---
Location: payload-main/packages/plugin-ecommerce/src/endpoints/initiatePayment.ts

```typescript
import { addDataAndFileToRequest, type DefaultDocumentIDType, type Endpoint } from 'payload'

import type {
  CurrenciesConfig,
  PaymentAdapter,
  ProductsValidation,
  SanitizedEcommercePluginConfig,
} from '../types/index.js'

import { defaultProductsValidation } from '../utilities/defaultProductsValidation.js'

type Args = {
  /**
   * The slug of the carts collection, defaults to 'carts'.
   */
  cartsSlug?: string
  currenciesConfig: CurrenciesConfig
  /**
   * The slug of the customers collection, defaults to 'users'.
   */
  customersSlug?: string
  /**
   * Track inventory stock for the products and variants.
   * Accepts an object to override the default field name.
   */
  inventory?: SanitizedEcommercePluginConfig['inventory']
  paymentMethod: PaymentAdapter
  /**
   * The slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Customise the validation used for checking products or variants before a transaction is created.
   */
  productsValidation?: ProductsValidation
  /**
   * The slug of the transactions collection, defaults to 'transactions'.
   */
  transactionsSlug?: string
  /**
   * The slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

type InitiatePayment = (args: Args) => Endpoint['handler']

/**
 * Handles the endpoint for initiating payments. We will handle checking the amount and product and variant prices here before it is sent to the payment provider.
 * This is the first step in the payment process.
 */
export const initiatePaymentHandler: InitiatePayment =
  ({
    cartsSlug = 'carts',
    currenciesConfig,
    customersSlug = 'users',
    paymentMethod,
    productsSlug = 'products',
    productsValidation,
    transactionsSlug = 'transactions',
    variantsSlug = 'variants',
  }) =>
  async (req) => {
    await addDataAndFileToRequest(req)
    const data = req.data
    const payload = req.payload
    const user = req.user

    let currency: string = currenciesConfig.defaultCurrency
    let cartID: DefaultDocumentIDType = data?.cartID
    let cart = undefined
    const billingAddress = data?.billingAddress
    const shippingAddress = data?.shippingAddress

    let customerEmail: string = user?.email ?? ''

    if (user) {
      if (user.cart?.docs && Array.isArray(user.cart.docs) && user.cart.docs.length > 0) {
        if (!cartID && user.cart.docs[0]) {
          // Use the user's cart instead
          if (typeof user.cart.docs[0] === 'object') {
            cartID = user.cart.docs[0].id
            cart = user.cart.docs[0]
          } else {
            cartID = user.cart.docs[0]
          }
        }
      }
    } else {
      // Get the email from the data if user is not available
      if (data?.customerEmail && typeof data.customerEmail === 'string') {
        customerEmail = data.customerEmail
      } else {
        return Response.json(
          {
            message: 'A customer email is required to make a purchase.',
          },
          {
            status: 400,
          },
        )
      }
    }

    if (!cart) {
      if (cartID) {
        cart = await payload.findByID({
          id: cartID,
          collection: cartsSlug,
          depth: 2,
          overrideAccess: false,
          select: {
            id: true,
            currency: true,
            customerEmail: true,
            items: true,
            subtotal: true,
          },
          user,
        })

        if (!cart) {
          return Response.json(
            {
              message: `Cart with ID ${cartID} not found.`,
            },
            {
              status: 404,
            },
          )
        }
      } else {
        return Response.json(
          {
            message: 'Cart ID is required.',
          },
          {
            status: 400,
          },
        )
      }
    }

    if (cart.currency && typeof cart.currency === 'string') {
      currency = cart.currency
    }

    // Ensure the currency is provided or inferred in some way
    if (!currency) {
      return Response.json(
        {
          message: 'Currency is required.',
        },
        {
          status: 400,
        },
      )
    }

    // Ensure the selected currency is supported
    if (
      !currenciesConfig.supportedCurrencies.find(
        (c) => c.code.toLocaleLowerCase() === currency.toLocaleLowerCase(),
      )
    ) {
      return Response.json(
        {
          message: `Currency ${currency} is not supported.`,
        },
        {
          status: 400,
        },
      )
    }

    // Verify the cart is available and items are present in an array
    if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
      return Response.json(
        {
          message: 'Cart is required and must contain at least one item.',
        },
        {
          status: 400,
        },
      )
    }

    for (const item of cart.items) {
      // Target field to check the price based on the currency so we can validate the total
      const priceField = `priceIn${currency.toUpperCase()}`
      const quantity = item.quantity || 1

      // If the item has a product but no variant, we assume the product has a price in the specified currency
      if (item.product && !item.variant) {
        const id = typeof item.product === 'object' ? item.product.id : item.product

        const product = await payload.findByID({
          id,
          collection: productsSlug,
          depth: 0,
          select: {
            inventory: true,
            [priceField]: true,
          },
        })

        if (!product) {
          return Response.json(
            {
              message: `Product with ID ${item.product} not found.`,
            },
            {
              status: 404,
            },
          )
        }

        try {
          if (productsValidation) {
            await productsValidation({ currenciesConfig, currency, product, quantity })
          } else {
            await defaultProductsValidation({
              currenciesConfig,
              currency,
              product,
              quantity,
            })
          }
        } catch (error) {
          payload.logger.error(
            error,
            'Error validating product or variant during payment initiation.',
          )

          return Response.json(
            {
              message: error,
              ...(error instanceof Error ? { cause: error.cause } : {}),
            },
            {
              status: 400,
            },
          )
        }

        if (item.variant) {
          const id = typeof item.variant === 'object' ? item.variant.id : item.variant

          const variant = await payload.findByID({
            id,
            collection: variantsSlug,
            depth: 0,
            select: {
              inventory: true,
              [priceField]: true,
            },
          })

          if (!variant) {
            return Response.json(
              {
                message: `Variant with ID ${item.variant} not found.`,
              },
              {
                status: 404,
              },
            )
          }

          try {
            if (productsValidation) {
              await productsValidation({
                currenciesConfig,
                currency,
                product: item.product,
                quantity,
                variant,
              })
            } else {
              await defaultProductsValidation({
                currenciesConfig,
                currency,
                product: item.product,
                quantity,
                variant,
              })
            }
          } catch (error) {
            payload.logger.error(
              error,
              'Error validating product or variant during payment initiation.',
            )

            return Response.json(
              {
                message: error,
              },
              {
                status: 400,
              },
            )
          }
        }
      }
    }

    try {
      const paymentResponse = await paymentMethod.initiatePayment({
        customersSlug,
        data: {
          billingAddress,
          cart,
          currency,
          customerEmail,
          shippingAddress,
        },
        req,
        transactionsSlug,
      })

      return Response.json(paymentResponse)
    } catch (error) {
      payload.logger.error(error, 'Error initiating payment.')

      return Response.json(
        {
          message: 'Error initiating payment.',
        },
        {
          status: 500,
        },
      )
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: rsc.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/rsc.ts

```typescript
export { PriceInput } from '../ui/PriceInput/index.js'
export { VariantOptionsSelector } from '../ui/VariantOptionsSelector/index.js'
```

--------------------------------------------------------------------------------

---[FILE: translations.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/translations.ts

```typescript
export { en } from '../translations/en.js'
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/types.ts

```typescript
export type {
  CollectionOverride,
  CollectionSlugMap,
  CountryType,
  CurrenciesConfig,
  Currency,
  EcommerceCollections,
  EcommerceContextType,
  EcommercePluginConfig,
  PaymentAdapter,
  PaymentAdapterArgs,
  PaymentAdapterClient,
  PaymentAdapterClientArgs,
  ProductsValidation,
  SanitizedEcommercePluginConfig,
} from '../types/index.js'

export type { TypedEcommerce } from '../types/utilities.js'
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/client/index.ts

```typescript
export { PriceCell } from '../../ui/PriceCell/index.js'
export { PriceRowLabel } from '../../ui/PriceRowLabel/index.js'
```

--------------------------------------------------------------------------------

---[FILE: react.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/client/react.ts

```typescript
export { defaultCountries } from '../../collections/addresses/defaultCountries.js'
export { EUR, GBP, USD } from '../../currencies/index.js'

export {
  EcommerceProvider,
  useAddresses,
  useCart,
  useCurrency,
  useEcommerce,
  usePayments,
} from '../../react/provider/index.js'
```

--------------------------------------------------------------------------------

---[FILE: stripe.ts]---
Location: payload-main/packages/plugin-ecommerce/src/exports/payments/stripe.ts

```typescript
export { stripeAdapter, stripeAdapterClient } from '../../payments/adapters/stripe/index.js'
```

--------------------------------------------------------------------------------

---[FILE: amountField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/amountField.ts

```typescript
import type { NumberField } from 'payload'

import type { CurrenciesConfig, Currency } from '../types/index.js'

type Props = {
  currenciesConfig: CurrenciesConfig
  /**
   * Use this specific currency for the field.
   */
  currency?: Currency
  overrides?: Partial<NumberField>
}

export const amountField: (props: Props) => NumberField = ({
  currenciesConfig,
  currency,
  overrides,
}) => {
  // @ts-expect-error - issue with payload types
  const field: NumberField = {
    name: 'amount',
    type: 'number',
    label: ({ t }) =>
      // @ts-expect-error - translations are not typed in plugins yet
      t('plugin-ecommerce:amount'),
    ...overrides,
    admin: {
      components: {
        Cell: {
          clientProps: {
            currenciesConfig,
            currency,
          },
          path: '@payloadcms/plugin-ecommerce/client#PriceCell',
        },
        Field: {
          clientProps: {
            currenciesConfig,
            currency,
          },
          path: '@payloadcms/plugin-ecommerce/rsc#PriceInput',
        },
        ...overrides?.admin?.components,
      },
      ...overrides?.admin,
    },
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: cartItemsField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/cartItemsField.ts

```typescript
import type { ArrayField, Field } from 'payload'

import type { CurrenciesConfig } from '../types/index.js'

import { amountField } from './amountField.js'
import { currencyField } from './currencyField.js'

type Props = {
  /**
   * Include this in order to enable support for currencies per item in the cart.
   */
  currenciesConfig?: CurrenciesConfig
  enableVariants?: boolean
  /**
   * Enables individual prices for each item in the cart.
   * Defaults to false.
   */
  individualPrices?: boolean
  overrides?: Partial<ArrayField>
  /**
   * Slug of the products collection, defaults to 'products'.
   */
  productsSlug?: string
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
}

export const cartItemsField: (props?: Props) => ArrayField = (props) => {
  const {
    currenciesConfig,
    enableVariants = false,
    individualPrices,
    overrides,
    productsSlug = 'products',
    variantsSlug = 'variants',
  } = props || {}

  const field: ArrayField = {
    name: 'items',
    type: 'array',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'product',
        type: 'relationship',
        label: ({ t }) =>
          // @ts-expect-error - translations are not typed in plugins yet
          t('plugin-ecommerce:product'),
        relationTo: productsSlug,
      },
      ...(enableVariants
        ? [
            {
              name: 'variant',
              type: 'relationship',
              label: ({ t }) =>
                // @ts-expect-error - translations are not typed in plugins yet
                t('plugin-ecommerce:variant'),
              relationTo: variantsSlug,
            } as Field,
          ]
        : []),
      {
        name: 'quantity',
        type: 'number',
        defaultValue: 1,
        label: ({ t }) =>
          // @ts-expect-error - translations are not typed in plugins yet
          t('plugin-ecommerce:quantity'),
        min: 1,
        required: true,
      },
      ...(currenciesConfig && individualPrices ? [amountField({ currenciesConfig })] : []),
      ...(currenciesConfig ? [currencyField({ currenciesConfig })] : []),
    ],
    label: ({ t }) =>
      // @ts-expect-error - translations are not typed in plugins yet
      t('plugin-ecommerce:cart'),
    ...overrides,
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: currencyField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/currencyField.ts

```typescript
import type { SelectField } from 'payload'

import type { CurrenciesConfig } from '../types/index.js'

type Props = {
  currenciesConfig: CurrenciesConfig
  overrides?: Partial<SelectField>
}

export const currencyField: (props: Props) => SelectField = ({ currenciesConfig, overrides }) => {
  const options = currenciesConfig.supportedCurrencies.map((currency) => {
    const label = currency.label ? `${currency.label} (${currency.code})` : currency.code

    return {
      label,
      value: currency.code,
    }
  })

  const defaultValue =
    (currenciesConfig.defaultCurrency ?? currenciesConfig.supportedCurrencies.length === 1)
      ? currenciesConfig.supportedCurrencies[0]?.code
      : undefined

  // @ts-expect-error - issue with payload types
  const field: SelectField = {
    name: 'currency',
    type: 'select',
    label: ({ t }) =>
      // @ts-expect-error - translations are not typed in plugins yet
      t('plugin-ecommerce:currency'),
    ...(defaultValue && { defaultValue }),
    options,
    ...overrides,
    admin: { readOnly: currenciesConfig.supportedCurrencies.length === 1, ...overrides?.admin },
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: inventoryField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/inventoryField.ts

```typescript
import type { NumberField } from 'payload'

type Props = {
  overrides?: Partial<NumberField>
}

export const inventoryField: (props?: Props) => NumberField = (props) => {
  const { overrides } = props || {}

  // @ts-expect-error - issue with payload types
  const field: NumberField = {
    name: 'inventory',
    type: 'number',
    defaultValue: 0,
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:inventory'),
    min: 0,
    ...(overrides || {}),
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: pricesField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/pricesField.ts

```typescript
import type { GroupField } from 'payload'

import type { CurrenciesConfig } from '../types/index.js'

import { amountField } from './amountField.js'

type Props = {
  /**
   * Use this to specify a path for the condition.
   */
  conditionalPath?: string
  currenciesConfig: CurrenciesConfig
}

export const pricesField: (props: Props) => GroupField[] = ({
  conditionalPath,
  currenciesConfig,
}) => {
  const currencies = currenciesConfig.supportedCurrencies

  const fields: GroupField[] = currencies.map((currency) => {
    const name = `priceIn${currency.code}`

    const path = conditionalPath ? `${conditionalPath}.${name}Enabled` : `${name}Enabled`

    return {
      type: 'group',
      admin: {
        description: 'Prices for this product in different currencies.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: `${name}Enabled`,
              type: 'checkbox',
              admin: {
                style: {
                  alignSelf: 'baseline',
                  flex: '0 0 auto',
                },
              },
              label: ({ t }) =>
                // @ts-expect-error - translations are not typed in plugins yet
                t('plugin-ecommerce:enableCurrencyPrice', { currency: currency.code }),
            },
            amountField({
              currenciesConfig,
              currency,
              overrides: {
                name,
                admin: {
                  condition: (_, siblingData) => Boolean(siblingData?.[path]),
                  description: ({ t }) =>
                    // @ts-expect-error - translations are not typed in plugins yet
                    t('plugin-ecommerce:productPriceDescription'),
                },
                // @ts-expect-error - translations are not typed in plugins yet
                label: ({ t }) => t('plugin-ecommerce:priceIn', { currency: currency.code }),
              },
            }),
          ],
        },
      ],
    }
  })

  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: statusField.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/statusField.ts

```typescript
import type { SelectField } from 'payload'

export const statusOptions: SelectField['options'] = [
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:pending'),
    value: 'pending',
  },
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:succeeded'),
    value: 'succeeded',
  },
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:failed'),
    value: 'failed',
  },
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:cancelled'),
    value: 'cancelled',
  },
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:expired'),
    value: 'expired',
  },
  {
    // @ts-expect-error - translations are not typed in plugins yet
    label: ({ t }) => t('plugin-ecommerce:refunded'),
    value: 'refunded',
  },
]

type Props = {
  overrides?: Partial<SelectField>
}

export const statusField: (props?: Props) => SelectField = (props) => {
  const { overrides } = props || {}

  // @ts-expect-error - issue with payload types
  const field: SelectField = {
    name: 'status',
    type: 'select',
    defaultValue: 'pending',
    label: ({ t }) =>
      // @ts-expect-error - translations are not typed in plugins yet
      t('plugin-ecommerce:status'),
    options: statusOptions,
    required: true,
    ...overrides,
  }

  return field
}
```

--------------------------------------------------------------------------------

---[FILE: variantsFields.ts]---
Location: payload-main/packages/plugin-ecommerce/src/fields/variantsFields.ts

```typescript
import type { Field } from 'payload'

type Props = {
  /**
   * Slug of the variants collection, defaults to 'variants'.
   */
  variantsSlug?: string
  /**
   * Slug of the variant types collection, defaults to 'variantTypes'.
   */
  variantTypesSlug?: string
}

export const variantsFields: (props: Props) => Field[] = ({
  variantsSlug = 'variants',
  variantTypesSlug = 'variantTypes',
}) => {
  const fields: Field[] = [
    {
      name: 'enableVariants',
      type: 'checkbox',
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:enableVariants'),
    },
    {
      name: 'variantTypes',
      type: 'relationship',
      admin: {
        condition: ({ enableVariants }) => Boolean(enableVariants),
      },
      hasMany: true,
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:variantTypes'),
      relationTo: variantTypesSlug,
    },
    {
      name: 'variants',
      type: 'join',
      admin: {
        condition: ({ enableVariants, variantTypes }) => {
          const enabledVariants = Boolean(enableVariants)
          const hasManyVariantTypes = Array.isArray(variantTypes) && variantTypes.length > 0

          return enabledVariants && hasManyVariantTypes
        },
        defaultColumns: ['title', 'options', 'inventory', 'prices', '_status'],
        disableListColumn: true,
      },
      collection: variantsSlug,
      label: ({ t }) =>
        // @ts-expect-error - translations are not typed in plugins yet
        t('plugin-ecommerce:availableVariants'),
      maxDepth: 2,
      on: 'product',
    },
  ]

  return fields
}
```

--------------------------------------------------------------------------------

---[FILE: confirmOrder.ts]---
Location: payload-main/packages/plugin-ecommerce/src/payments/adapters/stripe/confirmOrder.ts

```typescript
import Stripe from 'stripe'

import type { PaymentAdapter } from '../../../types/index.js'
import type { StripeAdapterArgs } from './index.js'

type Props = {
  apiVersion?: Stripe.StripeConfig['apiVersion']
  appInfo?: Stripe.StripeConfig['appInfo']
  secretKey: StripeAdapterArgs['secretKey']
}

export const confirmOrder: (props: Props) => NonNullable<PaymentAdapter>['confirmOrder'] =
  (props) =>
  async ({ data, ordersSlug = 'orders', req, transactionsSlug = 'transactions' }) => {
    const payload = req.payload
    const { apiVersion, appInfo, secretKey } = props || {}

    const customerEmail = data.customerEmail

    const paymentIntentID = data.paymentIntentID as string

    if (!secretKey) {
      throw new Error('Stripe secret key is required')
    }

    if (!paymentIntentID) {
      throw new Error('PaymentIntent ID is required')
    }

    const stripe = new Stripe(secretKey, {
      // API version can only be the latest, stripe recommends ts ignoring it
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - ignoring since possible versions are not type safe, only the latest version is recognised
      apiVersion: apiVersion || '2025-03-31.basil',
      appInfo: appInfo || {
        name: 'Stripe Payload Plugin',
        url: 'https://payloadcms.com',
      },
    })

    try {
      let customer = (
        await stripe.customers.list({
          email: customerEmail,
        })
      ).data[0]

      if (!customer?.id) {
        customer = await stripe.customers.create({
          email: customerEmail,
        })
      }

      // Find our existing transaction by the payment intent ID
      const transactionsResults = await payload.find({
        collection: transactionsSlug,
        where: {
          'stripe.paymentIntentID': {
            equals: paymentIntentID,
          },
        },
      })

      const transaction = transactionsResults.docs[0]

      if (!transactionsResults.totalDocs || !transaction) {
        throw new Error('No transaction found for the provided PaymentIntent ID')
      }

      // Verify the payment intent exists and retrieve it
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentID)

      const cartID = paymentIntent.metadata.cartID
      const cartItemsSnapshot = paymentIntent.metadata.cartItemsSnapshot
        ? JSON.parse(paymentIntent.metadata.cartItemsSnapshot)
        : undefined

      const shippingAddress = paymentIntent.metadata.shippingAddress
        ? JSON.parse(paymentIntent.metadata.shippingAddress)
        : undefined

      if (!cartID) {
        throw new Error('Cart ID not found in the PaymentIntent metadata')
      }

      if (!cartItemsSnapshot || !Array.isArray(cartItemsSnapshot)) {
        throw new Error('Cart items snapshot not found or invalid in the PaymentIntent metadata')
      }

      const order = await payload.create({
        collection: ordersSlug,
        data: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency.toUpperCase(),
          ...(req.user ? { customer: req.user.id } : { customerEmail }),
          items: cartItemsSnapshot,
          shippingAddress,
          status: 'processing',
          transactions: [transaction.id],
        },
      })

      const timestamp = new Date().toISOString()

      await payload.update({
        id: cartID,
        collection: 'carts',
        data: {
          purchasedAt: timestamp,
        },
      })

      await payload.update({
        id: transaction.id,
        collection: transactionsSlug,
        data: {
          order: order.id,
          status: 'succeeded',
        },
      })

      return {
        message: 'Payment initiated successfully',
        orderID: order.id,
        transactionID: transaction.id,
      }
    } catch (error) {
      payload.logger.error(error, 'Error initiating payment with Stripe')

      throw new Error(error instanceof Error ? error.message : 'Unknown error initiating payment')
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-ecommerce/src/payments/adapters/stripe/index.ts

```typescript
import type { Field, GroupField, PayloadRequest } from 'payload'
import type { Stripe } from 'stripe'

import type {
  PaymentAdapter,
  PaymentAdapterArgs,
  PaymentAdapterClient,
  PaymentAdapterClientArgs,
} from '../../../types/index.js'

import { confirmOrder } from './confirmOrder.js'
import { webhooksEndpoint } from './endpoints/webhooks.js'
import { initiatePayment } from './initiatePayment.js'

type StripeWebhookHandler = (args: {
  event: Stripe.Event
  req: PayloadRequest
  stripe: Stripe
}) => Promise<void> | void

type StripeWebhookHandlers = {
  /**
   * Description of the event (e.g., invoice.created or charge.refunded).
   */
  [webhookName: string]: StripeWebhookHandler
}

export type StripeAdapterArgs = {
  /**
   * This library's types only reflect the latest API version.
   *
   * We recommend upgrading your account's API Version to the latest version
   * if you wish to use TypeScript with this library.
   *
   * If you wish to remain on your account's default API version,
   * you may pass `null` or another version instead of the latest version,
   * and add a `@ts-ignore` comment here and anywhere the types differ between API versions.
   *
   * @docs https://stripe.com/docs/api/versioning
   */
  apiVersion?: Stripe.StripeConfig['apiVersion']
  appInfo?: Stripe.StripeConfig['appInfo']
  publishableKey: string
  secretKey: string
  webhooks?: StripeWebhookHandlers
  webhookSecret?: string
} & PaymentAdapterArgs

export const stripeAdapter: (props: StripeAdapterArgs) => PaymentAdapter = (props) => {
  const { apiVersion, appInfo, groupOverrides, secretKey, webhooks, webhookSecret } = props
  const label = props?.label || 'Stripe'

  const baseFields: Field[] = [
    {
      name: 'customerID',
      type: 'text',
      label: 'Stripe Customer ID',
    },
    {
      name: 'paymentIntentID',
      type: 'text',
      label: 'Stripe PaymentIntent ID',
    },
  ]

  const groupField: GroupField = {
    name: 'stripe',
    type: 'group',
    ...groupOverrides,
    admin: {
      condition: (data) => {
        const path = 'paymentMethod'

        return data?.[path] === 'stripe'
      },
      ...groupOverrides?.admin,
    },
    fields:
      groupOverrides?.fields && typeof groupOverrides?.fields === 'function'
        ? groupOverrides.fields({ defaultFields: baseFields })
        : baseFields,
  }

  return {
    name: 'stripe',
    confirmOrder: confirmOrder({
      apiVersion,
      appInfo,
      secretKey,
    }),
    endpoints: [webhooksEndpoint({ apiVersion, appInfo, secretKey, webhooks, webhookSecret })],
    group: groupField,
    initiatePayment: initiatePayment({
      apiVersion,
      appInfo,
      secretKey,
    }),
    label,
  }
}

export type StripeAdapterClientArgs = {
  /**
   * This library's types only reflect the latest API version.
   *
   * We recommend upgrading your account's API Version to the latest version
   * if you wish to use TypeScript with this library.
   *
   * If you wish to remain on your account's default API version,
   * you may pass `null` or another version instead of the latest version,
   * and add a `@ts-ignore` comment here and anywhere the types differ between API versions.
   *
   * @docs https://stripe.com/docs/api/versioning
   */
  apiVersion?: Stripe.StripeConfig['apiVersion']
  appInfo?: Stripe.StripeConfig['appInfo']
  publishableKey: string
} & PaymentAdapterClientArgs

export const stripeAdapterClient: (props: StripeAdapterClientArgs) => PaymentAdapterClient = (
  props,
) => {
  return {
    name: 'stripe',
    confirmOrder: true,
    initiatePayment: true,
    label: 'Card',
  }
}

export type InitiatePaymentReturnType = {
  clientSecret: string
  message: string
  paymentIntentID: string
}
```

--------------------------------------------------------------------------------

````
