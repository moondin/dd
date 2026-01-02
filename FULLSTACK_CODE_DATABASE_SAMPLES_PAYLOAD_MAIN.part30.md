---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 30
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 30 of 695)

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

---[FILE: overview.mdx]---
Location: payload-main/docs/ecommerce/overview.mdx

```text
---
title: Ecommerce Overview
label: Overview
order: 10
desc: Add ecommerce functionality to your Payload CMS application with this plugin.
keywords: plugins, ecommerce, stripe, plugin, payload, cms, shop, payments
---

![https://www.npmjs.com/package/@payloadcms/plugin-ecommerce](https://img.shields.io/npm/v/@payloadcms/plugin-ecommerce)

<Banner type="warning">
  This plugin is currently in Beta and may have breaking changes in future
  releases.
</Banner>

Payload provides an Ecommerce Plugin that allows you to add ecommerce functionality to your app. It comes with a set of utilities and collections to manage products, orders, and payments. It also integrates with popular payment gateways like Stripe to handle transactions.

<Banner type="info">
  This plugin is completely open-source and the [source code can be found
  here](https://github.com/payloadcms/payload/tree/main/packages/plugin-ecommerce).
  If you need help, check out our [Community
  Help](https://payloadcms.com/community-help). If you think you've found a bug,
  please [open a new
  issue](https://github.com/payloadcms/payload/issues/new?assignees=&labels=plugin%3A%redirects&template=bug_report.md&title=plugin-ecommerce%3A)
  with as much detail as possible.
</Banner>

## Core features

The plugin ships with a wide range of features to help you get started with ecommerce:

- Products with Variants are supported by default
- Carts are tracked in Payload
- Orders and Transactions
- Addresses linked to your Customers
- Payments adapter pattern to create your own integrations (Stripe currently supported)
- Multiple currencies are supported
- React UI utilities to help you manage your frontend logic

_Currently_ the plugin does not handle shipping, taxes or subscriptions natively, but you can implement these features yourself using the provided collections and hooks.

## Installation

Install the plugin using any JavaScript package manager like [pnpm](https://pnpm.io), [npm](https://npmjs.com), or [Yarn](https://yarnpkg.com):

```bash
  pnpm add @payloadcms/plugin-ecommerce
```

## Basic Usage

In the `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with:

```ts
import { buildConfig } from 'payload'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

const config = buildConfig({
  collections: [
    {
      slug: 'pages',
      fields: [],
    },
  ],
  plugins: [
    ecommercePlugin({
      // You must add your access control functions here
      access: {
        adminOnlyFieldAccess,
        adminOrPublishedStatus,
        customerOnlyFieldAccess,
        isAdmin,
        isAuthenticated,
        isDocumentOwner,
      },
      customers: { slug: 'users' },
    }),
  ],
})

export default config
```

## Concepts

It's important to understand overall how the plugin works and the relationships between the different collections.

**Customers**

Can be any collection of users in your application. You can then limit access control only to customers depending on individual fields such
as roles on the customer collection or by collection slug if you've opted to keep them separate. Customers are linked to Carts and Orders.

**Products and Variants**

Products are the items you are selling and they will contain a price and optionally variants via a join field as well as allowed Variant Types.

Each Variant Type can contain a set of Variant Options. For example, a T-Shirt product can have a Variant Type of Size with options Small, Medium, and Large and each Variant can therefore have those options assigned to it.

**Carts**

Carts are linked to Customers or they're left entirely public for guest users and can contain multiple Products and Variants. Carts are stored in the database and can be retrieved at any time. Carts are automatically created for Customers when they add a product to their cart for the first time.

**Transactions and Orders**

Transactions are created when a payment is initiated. They contain the payment status and are linked to a Cart and Customer. Orders are created when a Transaction is successful and contain the final details of the purchase including the items, total, and customer information.

**Addresses**

Addresses are linked to Customers and can be used for billing and shipping information. They can be reused across multiple Orders.

**Payments**

The plugin uses an adapter pattern to allow for different payment gateways. The default adapter is for Stripe, but you can create your own by implementing the `PaymentAdapter` interface.

**Currencies**

The plugin supports using multiple currencies at the configuration level. Each currency will create a separate price field on the Product and Variants collections.

The package can also be used piece-meal if you only want to re-use certain parts of it, such as just the creation of Products and Variants. See [Advanced uses and examples](./advanced) for more details.

## TypeScript

The plugin will inherit the types from your generated Payload types where possible. We also export the following types:

- `Cart` - The cart type as stored in the React state and local storage and on the client side.
- `CollectionOverride` - Type for overriding collections.
- `CurrenciesConfig` - Type for the currencies configuration.
- `EcommercePluginConfig` - The configuration object for the ecommerce plugin.
- `FieldsOverride` - Type for overriding fields in collections.

All types can be directly imported:

```ts
import { EcommercePluginConfig } from '@payloadcms/plugin-ecommerce/types'
```

## Template

The [Templates Directory](https://github.com/payloadcms/payload/tree/main/templates) also contains an official [E-commerce Template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce), which uses this plugin.
```

--------------------------------------------------------------------------------

---[FILE: payments.mdx]---
Location: payload-main/docs/ecommerce/payments.mdx

```text
---
title: Payment Adapters
label: Payment Adapters
order: 40
desc: Add ecommerce functionality to your Payload CMS application with this plugin.
keywords: plugins, ecommerce, stripe, plugin, payload, cms, shop, payments
---

A deeper look into the payment adapter pattern used by the Ecommerce Plugin, and how to create your own.

The current list of supported payment adapters are:

- [Stripe](#stripe)

## REST API

The plugin will create REST API endpoints for each payment adapter you add to your configuration. The endpoints will be available at `/api/payments/{provider_name}/{action}` where `provider_name` is the name of the payment adapter and `action` is one of the following:

| Action          | Method | Description                                                                                         |
| --------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `initiate`      | POST   | Initiate a payment for an order. See [initiatePayment](#initiatePayment) for more details.          |
| `confirm-order` | POST   | Confirm an order after a payment has been made. See [confirmOrder](#confirmOrder) for more details. |

## Stripe

Out of the box we integrate with Stripe to handle one-off purchases. To use Stripe, you will need to install the Stripe package:

```bash
  pnpm add stripe
```

We recommend at least `18.5.0` to ensure compatibility with the plugin.

Then, in your `plugins` array of your [Payload Config](https://payloadcms.com/docs/configuration/overview), call the plugin with:

```ts
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { buildConfig } from 'payload'

export default buildConfig({
  // Payload config...
  plugins: [
    ecommercePlugin({
      // rest of config...
      payments: {
        paymentMethods: [
          stripeAdapter({
            secretKey: process.env.STRIPE_SECRET_KEY,
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            // Optional - only required if you want to use webhooks
            webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
          }),
        ],
      },
    }),
  ],
})
```

### Configuration

The Stripe payment adapter takes the following configuration options:

| Option         | Type     | Description                                                                                                                                                                                 |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| secretKey      | `string` | Your Stripe Secret Key, found in the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).                                                                                              |
| publishableKey | `string` | Your Stripe Publishable Key, found in the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).                                                                                         |
| webhookSecret  | `string` | (Optional) Your Stripe Webhooks Signing Secret, found in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks). Required if you want to use webhooks.                               |
| appInfo        | `object` | (Optional) An object containing `name` and `version` properties to identify your application to Stripe.                                                                                     |
| webhooks       | `object` | (Optional) An object where the keys are Stripe event types and the values are functions that will be called when that event is received. See [Webhooks](#stripe-webhooks) for more details. |
| groupOverrides | `object` | (Optional) An object to override the default fields of the payment group. See [Payment Fields](./advanced#payment-fields) for more details.                                                 |

### Stripe Webhooks

You can also add your own webhooks to handle [events from Stripe](https://docs.stripe.com/api/events). This is optional and the plugin internally does not use webhooks for any core functionality. It receives the following arguments:

| Argument | Type             | Description                     |
| -------- | ---------------- | ------------------------------- |
| event    | `Stripe.Event`   | The Stripe event object         |
| req      | `PayloadRequest` | The Payload request object      |
| stripe   | `Stripe`         | The initialized Stripe instance |

You can add a webhook like so:

```ts
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'
import { buildConfig } from 'payload'

export default buildConfig({
  // Payload config...
  plugins: [
    ecommercePlugin({
      // rest of config...
      payments: {
        paymentMethods: [
          stripeAdapter({
            secretKey: process.env.STRIPE_SECRET_KEY,
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            // Required
            webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
            webhooks: {
              'payment_intent.succeeded': ({ event, req }) => {
                console.log({ event, data: event.data.object })
                req.payload.logger.info('Payment succeeded')
              },
            },
          }),
        ],
      },
    }),
  ],
})
```

To use webhooks you also need to have them configured in your Stripe Dashboard.

You can use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks to your local development environment.

### Frontend usage

The most straightforward way to use Stripe on the frontend is with the `EcommerceProvider` component and the `stripeAdapterClient` function. Wrap your application in the provider and pass in the Stripe adapter with your publishable key:

```ts
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'

<EcommerceProvider
  paymentMethods={[
    stripeAdapterClient({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    }),
  ]}
>
  {children}
</EcommerceProvider>
```

Then you can use the `usePayments` hook to access the `initiatePayment` and `confirmOrder` functions, see the [Frontend docs](./frontend#usePayments) for more details.

## Making your own Payment Adapter

You can make your own payment adapter by implementing the `PaymentAdapter` interface. This interface requires you to implement the following methods:

| Property          | Type                                                            | Description                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | `string`                                                        | The name of the payment method. This will be used to identify the payment method in the API and on the frontend.                                                                               |
| `label`           | `string`                                                        | (Optional) A human-readable label for the payment method. This will be used in the admin panel and on the frontend.                                                                            |
| `initiatePayment` | `(args: InitiatePaymentArgs) => Promise<InitiatePaymentResult>` | The function that is called via the `/api/payments/{provider_name}/initiate` endpoint to initiate a payment for an order. [More](#initiatePayment)                                             |
| `confirmOrder`    | `(args: ConfirmOrderArgs) => Promise<void>`                     | The function that is called via the `/api/payments/{provider_name}/confirm-order` endpoint to confirm an order after a payment has been made. [More](#confirmOrder)                            |
| `endpoints`       | `Endpoint[]`                                                    | (Optional) An array of endpoints to be bootstrapped to Payload's API in order to support the payment method. All API paths are relative to `/api/payments/{provider_name}`                     |
| `group`           | `GroupField`                                                    | A group field config to be used in transactions to track the necessary data for the payment processor, eg. PaymentIntentID for Stripe. See [Payment Fields](#payment-fields) for more details. |

The arguments can be extended but should always include the `PaymentAdapterArgs` type which has the following types:

| Property         | Type             | Description                                                                                                                  |
| ---------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `string`         | (Optional) Allow overriding the default UI label for this adapter.                                                           |
| `groupOverrides` | `FieldsOverride` | (Optional) Allow overriding the default fields of the payment group. See [Payment Fields](#payment-fields) for more details. |

#### initiatePayment

The `initiatePayment` function is called when a payment is initiated. At this step the transaction is created with a status "Processing", an abandoned purchase will leave this transaction in this state. It receives an object with the following properties:

| Property           | Type             | Description                                   |
| ------------------ | ---------------- | --------------------------------------------- |
| `transactionsSlug` | `Transaction`    | The transaction being processed.              |
| `data`             | `object`         | The cart associated with the transaction.     |
| `customersSlug`    | `string`         | The customer associated with the transaction. |
| `req`              | `PayloadRequest` | The Payload request object.                   |

The data object will contain the following properties:

| Property          | Type      | Description                                                                                                       |
| ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| `billingAddress`  | `Address` | The billing address associated with the transaction.                                                              |
| `shippingAddress` | `Address` | (Optional) The shipping address associated with the transaction. If this is missing then use the billing address. |
| `cart`            | `Cart`    | The cart collection item.                                                                                         |
| `customerEmail`   | `string`  | In the case that `req.user` is missing, `customerEmail` should be required in order to process guest checkouts.   |
| `currency`        | `string`  | The currency for the cart associated with the transaction.                                                        |

The return type then only needs to contain the following properties though the type supports any additional data returned as needed for the frontend:

| Property  | Type     | Description                                     |
| --------- | -------- | ----------------------------------------------- |
| `message` | `string` | A success message to be returned to the client. |

At any point in the function you can throw an error to return a 4xx or 5xx response to the client.

A heavily simplified example of implementing `initiatePayment` could look like:

```ts
import {
  PaymentAdapter,
  PaymentAdapterArgs,
} from '@payloadcms/plugin-ecommerce'
import Stripe from 'stripe'

export const initiatePayment: NonNullable<PaymentAdapter>['initiatePayment'] =
  async ({ data, req, transactionsSlug }) => {
    const payload = req.payload

    // Check for any required data
    const currency = data.currency
    const cart = data.cart

    if (!currency) {
      throw new Error('Currency is required.')
    }

    const stripe = new Stripe(secretKey)

    try {
      let customer = (
        await stripe.customers.list({
          email: customerEmail,
        })
      ).data[0]

      // Ensure stripe has a customer for this email
      if (!customer?.id) {
        customer = await stripe.customers.create({
          email: customerEmail,
        })
      }

      const shippingAddressAsString = JSON.stringify(shippingAddressFromData)

      const paymentIntent = await stripe.paymentIntents.create()

      // Create a transaction for the payment intent in the database
      const transaction = await payload.create({
        collection: transactionsSlug,
        data: {},
      })

      // Return the client_secret so that the client can complete the payment
      const returnData: InitiatePaymentReturnType = {
        clientSecret: paymentIntent.client_secret || '',
        message: 'Payment initiated successfully',
        paymentIntentID: paymentIntent.id,
      }

      return returnData
    } catch (error) {
      payload.logger.error(error, 'Error initiating payment with Stripe')

      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error initiating payment',
      )
    }
  }
```

#### confirmOrder

The `confirmOrder` function is called after a payment is completed on the frontend and at this step the order is created in Payload. It receives the following properties:

| Property           | Type             | Description                               |
| ------------------ | ---------------- | ----------------------------------------- |
| `ordersSlug`       | `string`         | The orders collection slug.               |
| `transactionsSlug` | `string`         | The transactions collection slug.         |
| `cartsSlug`        | `string`         | The carts collection slug.                |
| `customersSlug`    | `string`         | The customers collection slug.            |
| `data`             | `object`         | The cart associated with the transaction. |
| `req`              | `PayloadRequest` | The Payload request object.               |

The data object will contain any data the frontend chooses to send through and at a minimum the following:

| Property        | Type     | Description                                                                                                     |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `customerEmail` | `string` | In the case that `req.user` is missing, `customerEmail` should be required in order to process guest checkouts. |

The return type can also contain any additional data with a minimum of the following:

| Property        | Type     | Description                                     |
| --------------- | -------- | ----------------------------------------------- |
| `message`       | `string` | A success message to be returned to the client. |
| `orderID`       | `string` | The ID of the created order.                    |
| `transactionID` | `string` | The ID of the associated transaction.           |

A heavily simplified example of implementing `confirmOrder` could look like:

```ts
import {
  PaymentAdapter,
  PaymentAdapterArgs,
} from '@payloadcms/plugin-ecommerce'
import Stripe from 'stripe'

export const confirmOrder: NonNullable<PaymentAdapter>['confirmOrder'] =
  async ({
    data,
    ordersSlug = 'orders',
    req,
    transactionsSlug = 'transactions',
  }) => {
    const payload = req.payload

    const customerEmail = data.customerEmail
    const paymentIntentID = data.paymentIntentID as string

    const stripe = new Stripe(secretKey)

    try {
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

      // Verify the payment intent exists and retrieve it
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentID)

      // Create the order in the database
      const order = await payload.create({
        collection: ordersSlug,
        data: {},
      })

      const timestamp = new Date().toISOString()

      // Update the cart to mark it as purchased, this will prevent further updates to the cart
      await payload.update({
        id: cartID,
        collection: 'carts',
        data: {
          purchasedAt: timestamp,
        },
      })

      // Update the transaction with the order ID and mark as succeeded
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
    }
  }
```

#### Payment Fields

Payment fields are used primarily on the transactions collection to store information about the payment method used. Each payment adapter must provide a `group` field which will be used to store this information.

For example, the Stripe adapter provides the following group field:

```ts
const groupField: GroupField = {
  name: 'stripe',
  type: 'group',
  admin: {
    condition: (data) => {
      const path = 'paymentMethod'

      return data?.[path] === 'stripe'
    },
  },
  fields: [
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
  ],
}
```

### Client side Payment Adapter

The client side adapter should implement the `PaymentAdapterClient` interface:

| Property          | Type      | Description                                                                                                                                                                                   |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | `string`  | The name of the payment method. This will be used to identify the payment method in the API and on the frontend.                                                                              |
| `label`           | `string`  | (Optional) A human-readable label for the payment method. This can be used as a human readable format.                                                                                        |
| `initiatePayment` | `boolean` | Flag to toggle on the EcommerceProvider's ability to call the `/api/payments/{provider_name}/initiate` endpoint. If your payment method does not require this step, set this to `false`.      |
| `confirmOrder`    | `boolean` | Flag to toggle on the EcommerceProvider's ability to call the `/api/payments/{provider_name}/confirm-order` endpoint. If your payment method does not require this step, set this to `false`. |

And for the args use the `PaymentAdapterClientArgs` type:

| Property | Type     | Description                                                       |
| -------- | -------- | ----------------------------------------------------------------- |
| `label`  | `string` | (Optional) Allow overriding the default UI label for this adapter. |

## Best Practices

Always handle sensitive operations like creating payment intents and confirming payments on the server side. Use webhooks to listen for events from Stripe and update your orders accordingly. Never expose your secret key on the frontend. By default Nextjs will only expose environment variables prefixed with `NEXT_PUBLIC_` to the client.

While we validate the products and prices on the server side when creating a payment intent, you should override the validation function to add any additional checks you may need for your specific use case.

You are safe to pass the ID of a transaction to the frontend however you shouldn't pass any sensitive information or the transaction object itself.

When passing price information to your payment provider it should always come from the server and it should be verified against the products in your database. Never trust price information coming from the client.

When using webhooks, ensure that you verify the webhook signatures to confirm that the requests are genuinely from Stripe. This helps prevent unauthorized access and potential security vulnerabilities.
```

--------------------------------------------------------------------------------

````
