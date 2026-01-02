---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 632
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 632 of 695)

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

---[FILE: tsconfig.json]---
Location: payload-main/test/plugin-ecommerce/tsconfig.json
Signals: Next.js

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@payload-config": ["./config.ts"],
      "@payload-types": ["./payload-types.ts"],
      "@/components/*": ["./app/components/*"],
      "@payloadcms/plugin-ecommerce": ["../../packages/plugin-ecommerce/exports/index.ts"],
      "@payloadcms/plugin-ecommerce/*": ["../../packages/plugin-ecommerce/exports/*"],
      "@payloadcms/ui/assets": ["../../packages/ui/src/assets/index.ts"],
      "@payloadcms/ui/elements/*": ["../../packages/ui/src/elements/*/index.tsx"],
      "@payloadcms/ui/fields/*": ["../../packages/ui/src/fields/*/index.tsx"],
      "@payloadcms/ui/forms/*": ["../../packages/ui/src/forms/*/index.tsx"],
      "@payloadcms/ui/graphics/*": ["../../packages/ui/src/graphics/*/index.tsx"],
      "@payloadcms/ui/hooks/*": ["../../packages/ui/src/hooks/*.ts"],
      "@payloadcms/ui/icons/*": ["../../packages/ui/src/icons/*/index.tsx"],
      "@payloadcms/ui/providers/*": ["../../packages/ui/src/providers/*/index.tsx"],
      "@payloadcms/ui/templates/*": ["../../packages/ui/src/templates/*/index.tsx"],
      "@payloadcms/ui/utilities/*": ["../../packages/ui/src/utilities/*.ts"],
      "@payloadcms/ui/scss": ["../../packages/ui/src/scss.scss"],
      "@payloadcms/ui/scss/app.scss": ["../../packages/ui/src/scss/app.scss"],
      "payload/types": ["../../packages/payload/src/exports/types.ts"],
      "@payloadcms/next/*": ["../../packages/next/src/*"],
      "@payloadcms/next": ["../../packages/next/src/exports/*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

--------------------------------------------------------------------------------

---[FILE: custom.scss]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/custom.scss

```text
#custom-css {
  font-family: monospace;
}

#custom-css::after {
  content: 'custom-css';
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/layout.tsx
Signals: React

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes/index.js'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/plugin-ecommerce/app/(payload)/api/[...slug]/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(shop)/shop/layout.tsx

```typescript
import { currenciesConfig } from '@payload-config'
import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/react'
import { stripeAdapterClient } from '@payloadcms/plugin-ecommerce/payments/stripe'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EcommerceProvider
          currenciesConfig={currenciesConfig}
          paymentMethods={[
            stripeAdapterClient({
              publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
            }),
          ]}
        >
          {children}
        </EcommerceProvider>
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(shop)/shop/page.tsx
Signals: React

```typescript
import configPromise, { currenciesConfig } from '@payload-config'
import { Cart } from '@/components/Cart.js'
import { getPayload } from 'payload'
import React from 'react'
import { Product } from '@/components/Product.js'
import { CurrencySelector } from '@/components/CurrencySelector.js'
import { Payments } from '@/components/Payments.js'

export const Page = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const products = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 10,
  })

  return (
    <div>
      <h1>Shop Page - {payload?.config?.collections?.length} collections</h1>

      {products?.docs?.length > 0 ? (
        <ul>
          {products.docs.map((product) => (
            <li key={product.id}>
              <Product product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}

      <Cart />

      <CurrencySelector currenciesConfig={currenciesConfig} />

      <Payments currenciesConfig={currenciesConfig} />
    </div>
  )
}

export default Page
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(shop)/shop/confirm-order/page.tsx

```typescript
import { ConfirmOrder } from '@/components/ConfirmOrder.js'

export const ConfirmOrderPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  return (
    <div>
      <ConfirmOrder />
    </div>
  )
}

export default ConfirmOrderPage
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/plugin-ecommerce/app/(shop)/shop/order/[id]/page.tsx

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const Page = async ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const searchParams = await paramsPromise

  const orderID = searchParams.id

  const order = await payload.findByID({
    collection: 'orders',
    id: orderID,
    depth: 2,
  })

  return (
    <div>
      Order id: {searchParams.id}
      <div>
        <h1>Shop Page - {payload?.config?.collections?.length} collections</h1>

        {order ? (
          <div>
            <h2>Order Details</h2>
            <pre>{JSON.stringify(order, null, 2)}</pre>
          </div>
        ) : (
          <p>No order found with ID {orderID}.</p>
        )}
      </div>
    </div>
  )
}

export default Page
```

--------------------------------------------------------------------------------

---[FILE: Cart.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/Cart.tsx

```typescript
'use client'

import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/react'

export const Cart = () => {
  const { cart, incrementItem, decrementItem, removeItem, subTotal, clearCart } = useCart()
  const { formatCurrency } = useCurrency()

  return (
    <div>
      <h1>Cart Component</h1>
      <p>This is a placeholder for the Cart component.</p>

      <p>subTotal: {formatCurrency(subTotal)}</p>

      {cart && cart.size > 0 ? (
        <ul>
          {Array.from(cart.values()).map((item, index) => {
            const id = item.variantID || item.productID

            const options =
              item.variant?.options && item.variant.options.length > 0
                ? item.variant.options
                    .filter((option) => typeof option !== 'string')
                    .map((option) => {
                      return option.label
                    })
                : []

            return (
              <li key={id}>
                <h2>
                  {item.product.name} {options.length > 0 ? `(${options.join(' – ')})` : ''}
                </h2>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => incrementItem(id)}>+</button>
                <button onClick={() => decrementItem(id)}>-</button>
                <button onClick={() => removeItem(id)}>Remove</button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}

      <button
        onClick={() => {
          clearCart()
        }}
      >
        Clear all
      </button>

      {/* <pre>{JSON.stringify(Array.from(cart.entries()), null, 2)}</pre> */}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CheckoutStripe.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/CheckoutStripe.tsx

```typescript
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export const CheckoutStripe = () => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/shop/confirm-order',
      },
    })

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message)
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
    </form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ConfirmOrder.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/ConfirmOrder.tsx
Signals: React, Next.js

```typescript
'use client'

import { useCart, usePayments } from '@payloadcms/plugin-ecommerce/react'
import React, { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation.js'

export const ConfirmOrder: React.FC = () => {
  const { confirmOrder } = usePayments()
  const { cart } = useCart()
  const confirmedOrder = useRef(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (!cart || cart.size === 0) {
      return
    }

    const paymentIntentID = searchParams.get('payment_intent')

    if (paymentIntentID) {
      confirmOrder('stripe', {
        additionalData: {
          paymentIntentID,
        },
      }).then((result) => {
        if (result && typeof result === 'object' && 'orderID' in result && result.orderID) {
          // Redirect to order confirmation page
          confirmedOrder.current = true
          router.push(`/shop/order/${result.orderID}`)
        }
      })
    }
  }, [cart, searchParams])

  return (
    <div>
      <h2>Confirm Order</h2>
      <div>
        <strong>Order Summary:</strong>
        LOADING
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CurrencySelector.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/CurrencySelector.tsx
Signals: React

```typescript
'use client'
import { useCurrency } from '@payloadcms/plugin-ecommerce/react'
import React from 'react'
import { CurrenciesConfig } from '@payloadcms/plugin-ecommerce/types'

type Props = {
  currenciesConfig: CurrenciesConfig
}

export const CurrencySelector: React.FC<Props> = ({ currenciesConfig }) => {
  const { currency, setCurrency } = useCurrency()

  return (
    <div>
      selected: {currency.label} ({currency.code})<br />
      <select
        value={currency.code}
        onChange={(e) => {
          const selectedCurrency = currenciesConfig.supportedCurrencies.find(
            (c) => c.code === e.target.value,
          )
          if (selectedCurrency) {
            setCurrency(selectedCurrency.code)
          }
        }}
      >
        {currenciesConfig.supportedCurrencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label} ({c.code})
          </option>
        ))}
      </select>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Payments.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/Payments.tsx
Signals: React

```typescript
'use client'
import { usePayments } from '@payloadcms/plugin-ecommerce/react'
import React from 'react'
import { CurrenciesConfig } from '@payloadcms/plugin-ecommerce/types'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutStripe } from '@/components/CheckoutStripe.js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Props = {
  currenciesConfig: CurrenciesConfig
}

export const Payments: React.FC<Props> = ({ currenciesConfig }) => {
  const { selectedPaymentMethod, initiatePayment, confirmOrder, paymentData } = usePayments()

  return (
    <div>
      selected: {selectedPaymentMethod}
      <br />
      <button
        onClick={async () => {
          await initiatePayment('stripe')
        }}
      >
        Pay with Stripe
      </button>
      {selectedPaymentMethod === 'stripe' &&
        paymentData &&
        'clientSecret' in paymentData &&
        typeof paymentData.clientSecret === 'string' && (
          <div>
            <Elements stripe={stripePromise} options={{ clientSecret: paymentData.clientSecret }}>
              <CheckoutStripe />
            </Elements>
          </div>
        )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Product.tsx]---
Location: payload-main/test/plugin-ecommerce/app/components/Product.tsx
Signals: React

```typescript
'use client'
import { Product as ProductType } from '@payload-types'
import { useCart, useCurrency } from '@payloadcms/plugin-ecommerce/react'
import React from 'react'

type Props = {
  product: ProductType
}

export const Product: React.FC<Props> = ({ product }) => {
  const { addItem, removeItem } = useCart()
  const { formatCurrency, currency } = useCurrency()

  const pricePath = `priceIn${currency.code.toUpperCase()}`
  // @ts-expect-error
  const productPrice = pricePath in product ? product[pricePath] : undefined

  const hasVariants =
    product.enableVariants && product.variants?.docs?.length && product.variants?.docs?.length > 0

  return (
    <div>
      <h2>{product.name}</h2>

      <div>Price: {formatCurrency(productPrice)}</div>

      {!hasVariants && (
        <div>
          <button
            onClick={() => {
              addItem({
                productID: product.id,
                quantity: 1,
                product: product,
              })
            }}
          >
            Add to cart
          </button>
        </div>
      )}

      {hasVariants &&
        product.variants!.docs!.map((variant) => {
          if (typeof variant === 'string') {
            return null
          }

          return (
            <div key={variant.id}>
              <div>{variant.title}</div>
              <div>Price: {formatCurrency(variant.priceInUSD)}</div>

              <button
                onClick={() => {
                  addItem({
                    productID: product.id,
                    variantID: variant.id,
                    quantity: 1,
                    variant: variant,
                    product: product,
                  })
                }}
              >
                Add to cart
              </button>
            </div>
          )
        })}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Media.ts]---
Location: payload-main/test/plugin-ecommerce/collections/Media.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: () => true,
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: Users.ts]---
Location: payload-main/test/plugin-ecommerce/collections/Users.ts

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
  },
  fields: [],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/plugin-ecommerce/seed/index.ts

```typescript
import type { Payload, PayloadRequest } from 'payload'

const sizeVariantOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'X Large', value: 'xlarge' },
]

const colorVariantOptions = [
  { label: 'Black', value: 'black' },
  { label: 'White', value: 'white' },
]

export const seed = async (payload: Payload): Promise<boolean> => {
  payload.logger.info('Seeding data for ecommerce...')
  const req = {} as PayloadRequest

  try {
    const customer = await payload.create({
      collection: 'users',
      data: {
        email: 'customer@payloadcms.com',
        password: 'customer',
      },
      req,
    })

    const sizeVariantType = await payload.create({
      collection: 'variantTypes',
      data: {
        name: 'size',
        label: 'Size',
      },
    })

    const [small, medium, large, xlarge] = await Promise.all(
      sizeVariantOptions.map((option) => {
        return payload.create({
          collection: 'variantOptions',
          data: {
            ...option,
            variantType: sizeVariantType.id,
          },
        })
      }),
    )

    const colorVariantType = await payload.create({
      collection: 'variantTypes',
      data: {
        name: 'color',
        label: 'Color',
      },
    })

    const [black, white] = await Promise.all(
      colorVariantOptions.map((option) => {
        return payload.create({
          collection: 'variantOptions',
          data: {
            ...option,
            variantType: colorVariantType.id,
          },
        })
      }),
    )

    const hoodieProduct = await payload.create({
      collection: 'products',
      data: {
        name: 'Hoodie',
        variantTypes: [sizeVariantType.id, colorVariantType.id],
        enableVariants: true,
      },
    })

    const hoodieSmallWhite = await payload.create({
      collection: 'variants',
      data: {
        product: hoodieProduct.id,
        options: [small!.id, white!.id],
        inventory: 10,
        priceInUSDEnabled: true,
        priceInUSD: 1999,
      },
    })

    const hoodieMediumWhite = await payload.create({
      collection: 'variants',
      data: {
        product: hoodieProduct.id,
        options: [white!.id, medium!.id],
        inventory: 492,
        priceInUSDEnabled: true,
        priceInUSD: 1999,
      },
    })

    const hatProduct = await payload.create({
      collection: 'products',
      data: {
        name: 'Hat',
        priceInUSDEnabled: true,
        priceInUSD: 1999,
        priceInEUREnabled: true,
        priceInEUR: 2599,
      },
    })

    const pendingPaymentRecord = await payload.create({
      collection: 'transactions',
      data: {
        currency: 'USD',
        customer: customer.id,
        paymentMethod: 'stripe',
        stripe: {
          customerID: 'cus_123',
          paymentIntentID: 'pi_123',
        },
        status: 'pending',
      },
    })

    const succeededPaymentRecord = await payload.create({
      collection: 'transactions',
      data: {
        currency: 'USD',
        customer: customer.id,
        paymentMethod: 'stripe',
        stripe: {
          customerID: 'cus_123',
          paymentIntentID: 'pi_123',
        },
        status: 'succeeded',
      },
    })

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}
```

--------------------------------------------------------------------------------

---[FILE: config.ts]---
Location: payload-main/test/plugin-form-builder/config.ts

```typescript
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
import type { BeforeEmail } from '@payloadcms/plugin-form-builder/types'
import type { Block, Field } from 'payload'

//import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { formBuilderPlugin, fields as formFields } from '@payloadcms/plugin-form-builder'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import type { FormSubmission } from './payload-types.js'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { Pages } from './collections/Pages.js'
import { Users } from './collections/Users.js'
import { seed } from './seed/index.js'

const colorField: Block = {
  slug: 'color',
  fields: [
    {
      name: 'value',
      type: 'text',
    },
  ],
  labels: {
    plural: 'Colors',
    singular: 'Color',
  },
}

const beforeEmail: BeforeEmail<FormSubmission> = (emails, { req: { payload }, originalDoc }) => {
  return emails
}

export default buildConfigWithDefaults({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Users],
  editor: lexicalEditor({}),
  localization: {
    defaultLocale: 'en',
    fallback: true,
    locales: ['en', 'es', 'de'],
  },
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
        roles: ['admin'],
      },
    })

    await seed(payload)
  },
  // email: nodemailerAdapter(),
  plugins: [
    formBuilderPlugin({
      // handlePayment: handleFormPayments,
      // defaultToEmail: 'devs@payloadcms.com',
      fields: {
        colorField,
        payment: true,
        text: {
          ...formFields.text,
          labels: {
            plural: 'Custom Text Fields',
            singular: 'Custom Text Field',
          },
        },
        date: {
          ...formFields.date,
          fields: [
            ...(formFields.date && 'fields' in formFields.date
              ? formFields.date.fields.map((field) => {
                  if ('name' in field && field.name === 'defaultValue') {
                    return {
                      ...field,
                      timezone: true,
                      admin: {
                        ...field.admin,
                        description: 'This is a date field',
                      },
                    } as Field
                  }
                  return field
                })
              : []),
          ],
        },
        // payment: {
        //     paymentProcessor: {
        //       options: [
        //         {
        //           label: 'Stripe',
        //           value: 'stripe'
        //         },
        //       ],
        //       defaultValue: 'stripe',
        //     },
        // },
      },
      beforeEmail,
      formOverrides: {
        // labels: {
        //   singular: 'Contact Form',
        //   plural: 'Contact Forms'
        // },
        fields: ({ defaultFields }) => {
          return [
            ...defaultFields,
            {
              name: 'custom',
              type: 'text',
            },
          ]
        },
      },
      formSubmissionOverrides: {
        access: {
          update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
        },
        fields: ({ defaultFields }) => {
          const modifiedFields: Field[] = defaultFields.map((field) => {
            if ('name' in field && field.type === 'group' && field.name === 'payment') {
              return {
                ...field,
                fields: [
                  ...field.fields, // comment this out to override payments group entirely
                  {
                    name: 'stripeCheckoutSession',
                    type: 'text',
                  },
                ],
              }
            }

            return field
          })

          return [
            ...modifiedFields,
            {
              name: 'custom',
              type: 'text',
            },
          ]
        },
      },
      redirectRelationships: ['pages'],
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

--------------------------------------------------------------------------------

---[FILE: e2e.spec.ts]---
Location: payload-main/test/plugin-form-builder/e2e.spec.ts

```typescript
import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import * as path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config } from './payload-types.js'

import { ensureCompilationIsDone, initPageConsoleErrorCatch, saveDocAndAssert } from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

test.describe('Form Builder Plugin', () => {
  let page: Page
  let formsUrl: AdminUrlUtil
  let submissionsUrl: AdminUrlUtil
  let payload: PayloadTestSDK<Config>

  test.beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    const { payload: payloadFromInit, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
    })
    formsUrl = new AdminUrlUtil(serverURL, 'forms')
    submissionsUrl = new AdminUrlUtil(serverURL, 'form-submissions')

    payload = payloadFromInit

    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })

  test.describe('Forms collection', () => {
    test('has contact form', async () => {
      await page.goto(formsUrl.list)

      const titleCell = page.locator('.row-2 .cell-title a')
      await expect(titleCell).toHaveText('Contact Form')
      const href = await titleCell.getAttribute('href')

      await titleCell.click()
      await expect(() => expect(page.url()).toContain(href)).toPass({
        timeout: POLL_TOPASS_TIMEOUT,
      })

      const nameField = page.locator('#field-fields__0__name')
      await expect(nameField).toHaveValue('name')

      const addFieldsButton = page.locator('.blocks-field__drawer-toggler')

      await addFieldsButton.click()

      await expect(() => expect(page.locator('.drawer__header__title')).toBeVisible()).toPass({
        timeout: POLL_TOPASS_TIMEOUT,
      })

      await page
        .locator('button.thumbnail-card', {
          hasText: 'Text Area',
        })
        .click()

      await expect(() =>
        expect(
          page.locator('.pill__label', {
            hasText: 'Text Area',
          }),
        ).toBeVisible(),
      ).toPass({
        timeout: POLL_TOPASS_TIMEOUT,
      })
    })
  })

  test.describe('Form submissions collection', () => {
    test('has form submissions', async () => {
      await page.goto(submissionsUrl.list)

      const firstSubmissionCell = page.locator('.table .cell-id a').last()
      const href = await firstSubmissionCell.getAttribute('href')

      await firstSubmissionCell.click()
      await expect(() => expect(page.url()).toContain(href)).toPass({
        timeout: POLL_TOPASS_TIMEOUT,
      })

      await expect(page.locator('#field-submissionData__0__value')).toHaveValue('Test Submission')
      await expect(page.locator('#field-submissionData__1__value')).toHaveValue(
        'tester@example.com',
      )
    })

    test('can create form submission', async () => {
      const { docs } = await payload.find({
        collection: 'forms',
        where: {
          title: {
            contains: 'Contact',
          },
        },
      })

      const createdSubmission = await payload.create({
        collection: 'form-submissions',
        data: {
          form: docs[0].id,
          submissionData: [
            {
              field: 'name',
              value: 'New tester',
            },
            {
              field: 'email',
              value: 'new@example.com',
            },
          ],
        },
      })

      await page.goto(submissionsUrl.edit(createdSubmission.id))

      await expect(page.locator('#field-submissionData__0__value')).toHaveValue('New tester')
      await expect(page.locator('#field-submissionData__1__value')).toHaveValue('new@example.com')
    })

    test('can create form submission from the admin panel', async () => {
      await page.goto(submissionsUrl.create)
      await page.locator('#field-form').click({ delay: 100 })
      const options = page.locator('.rs__option')
      await options.locator('text=Contact Form').click()

      await expect(page.locator('#field-form').locator('.rs__value-container')).toContainText(
        'Contact Form',
      )

      await page.locator('#field-submissionData button.array-field__add-row').click()
      await page.locator('#field-submissionData__0__field').fill('name')
      await page.locator('#field-submissionData__0__value').fill('Test Submission')
      await saveDocAndAssert(page)

      // Check that the fields are still editable, as this user is an admin
      await expect(page.locator('#field-submissionData__0__field')).toBeEditable()
      await expect(page.locator('#field-submissionData__0__value')).toBeEditable()
    })

    test('can create form submission - with date field', async () => {
      const { docs } = await payload.find({
        collection: 'forms',
        where: {
          title: {
            contains: 'Booking',
          },
        },
      })

      const createdSubmission = await payload.create({
        collection: 'form-submissions',
        data: {
          form: docs[0].id,
          submissionData: [
            {
              field: 'name',
              value: 'New tester',
            },
            {
              field: 'email',
              value: 'new@example.com',
            },
            {
              field: 'date',
              value: '2025-10-01T00:00:00.000Z',
            },
          ],
        },
      })

      await page.goto(submissionsUrl.edit(createdSubmission.id))

      await expect(page.locator('#field-submissionData__0__value')).toHaveValue('New tester')
      await expect(page.locator('#field-submissionData__1__value')).toHaveValue('new@example.com')
      await expect(page.locator('#field-submissionData__2__value')).toHaveValue(
        '2025-10-01T00:00:00.000Z',
      )
    })
  })
})
```

--------------------------------------------------------------------------------

````
