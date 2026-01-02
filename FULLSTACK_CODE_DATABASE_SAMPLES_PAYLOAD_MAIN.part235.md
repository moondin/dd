---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 235
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 235 of 695)

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

---[FILE: initiatePayment.ts]---
Location: payload-main/packages/plugin-ecommerce/src/payments/adapters/stripe/initiatePayment.ts

```typescript
import Stripe from 'stripe'

import type { PaymentAdapter } from '../../../types/index.js'
import type { InitiatePaymentReturnType, StripeAdapterArgs } from './index.js'

type Props = {
  apiVersion?: Stripe.StripeConfig['apiVersion']
  appInfo?: Stripe.StripeConfig['appInfo']
  secretKey: StripeAdapterArgs['secretKey']
}

export const initiatePayment: (props: Props) => NonNullable<PaymentAdapter>['initiatePayment'] =
  (props) =>
  async ({ data, req, transactionsSlug }) => {
    const payload = req.payload
    const { apiVersion, appInfo, secretKey } = props || {}

    const customerEmail = data.customerEmail
    const currency = data.currency
    const cart = data.cart
    const amount = cart.subtotal
    const billingAddressFromData = data.billingAddress
    const shippingAddressFromData = data.shippingAddress

    if (!secretKey) {
      throw new Error('Stripe secret key is required.')
    }

    if (!currency) {
      throw new Error('Currency is required.')
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty or not provided.')
    }

    if (!customerEmail || typeof customerEmail !== 'string') {
      throw new Error('A valid customer email is required to make a purchase.')
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      throw new Error('A valid amount is required to initiate a payment.')
    }

    const stripe = new Stripe(secretKey, {
      // API version can only be the latest, stripe recommends ts ignoring it
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - ignoring since possible versions are not type safe, only the latest version is recognised
      apiVersion: apiVersion || '2025-06-30.preview',
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

      const flattenedCart = cart.items.map((item) => {
        const productID = typeof item.product === 'object' ? item.product.id : item.product
        const variantID = item.variant
          ? typeof item.variant === 'object'
            ? item.variant.id
            : item.variant
          : undefined

        return {
          product: productID,
          quantity: item.quantity,
          variant: variantID,
        }
      })

      const shippingAddressAsString = JSON.stringify(shippingAddressFromData)

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        automatic_payment_methods: {
          enabled: true,
        },
        currency,
        customer: customer.id,
        metadata: {
          cartID: cart.id,
          cartItemsSnapshot: JSON.stringify(flattenedCart),
          shippingAddress: shippingAddressAsString,
        },
      })

      // Create a transaction for the payment intent in the database
      const transaction = await payload.create({
        collection: transactionsSlug,
        data: {
          ...(req.user ? { customer: req.user.id } : { customerEmail }),
          amount: paymentIntent.amount,
          billingAddress: billingAddressFromData,
          cart: cart.id,
          currency: paymentIntent.currency.toUpperCase(),
          items: flattenedCart,
          paymentMethod: 'stripe',
          status: 'pending',
          stripe: {
            customerID: customer.id,
            paymentIntentID: paymentIntent.id,
          },
        },
      })

      const returnData: InitiatePaymentReturnType = {
        clientSecret: paymentIntent.client_secret || '',
        message: 'Payment initiated successfully',
        paymentIntentID: paymentIntent.id,
      }

      return returnData
    } catch (error) {
      payload.logger.error(error, 'Error initiating payment with Stripe')

      throw new Error(error instanceof Error ? error.message : 'Unknown error initiating payment')
    }
  }
```

--------------------------------------------------------------------------------

---[FILE: webhooks.ts]---
Location: payload-main/packages/plugin-ecommerce/src/payments/adapters/stripe/endpoints/webhooks.ts

```typescript
import type { Endpoint } from 'payload'

import Stripe from 'stripe'

import type { StripeAdapterArgs } from '../index.js'

type Props = {
  apiVersion?: Stripe.StripeConfig['apiVersion']
  appInfo?: Stripe.StripeConfig['appInfo']
  secretKey: StripeAdapterArgs['secretKey']
  webhooks?: StripeAdapterArgs['webhooks']
  webhookSecret: StripeAdapterArgs['webhookSecret']
}

export const webhooksEndpoint: (props: Props) => Endpoint = (props) => {
  const { apiVersion, appInfo, secretKey, webhooks, webhookSecret } = props || {}

  const handler: Endpoint['handler'] = async (req) => {
    let returnStatus = 200

    if (webhookSecret && secretKey && req.text) {
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

      const body = await req.text()
      const stripeSignature = req.headers.get('stripe-signature')

      if (stripeSignature) {
        let event: Stripe.Event | undefined

        try {
          event = stripe.webhooks.constructEvent(body, stripeSignature, webhookSecret)
        } catch (err: unknown) {
          const msg: string = err instanceof Error ? err.message : JSON.stringify(err)
          req.payload.logger.error(`Error constructing Stripe event: ${msg}`)
          returnStatus = 400
        }

        if (typeof webhooks === 'object' && event) {
          const webhookEventHandler = webhooks[event.type]

          if (typeof webhookEventHandler === 'function') {
            await webhookEventHandler({
              event,
              req,
              stripe,
            })
          }
        }
      }
    }

    return Response.json({ received: true }, { status: returnStatus })
  }

  return {
    handler,
    method: 'post',
    path: '/webhooks',
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/react/provider/index.tsx
Signals: React

```typescript
'use client'
import type { DefaultDocumentIDType, TypedUser } from 'payload'

import { deepMergeSimple } from 'payload/shared'
import * as qs from 'qs-esm'
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'

import type {
  AddressesCollection,
  CartItem,
  CartsCollection,
  ContextProps,
  Currency,
  EcommerceContextType,
} from '../../types/index.js'

const defaultContext: EcommerceContextType = {
  addItem: async () => {},
  clearCart: async () => {},
  confirmOrder: async () => {},
  createAddress: async () => {},
  currenciesConfig: {
    defaultCurrency: 'USD',
    supportedCurrencies: [
      {
        code: 'USD',
        decimals: 2,
        label: 'US Dollar',
        symbol: '$',
      },
    ],
  },
  currency: {
    code: 'USD',
    decimals: 2,
    label: 'US Dollar',
    symbol: '$',
  },
  decrementItem: async () => {},
  incrementItem: async () => {},
  initiatePayment: async () => {},
  isLoading: false,
  paymentMethods: [],
  removeItem: async () => {},
  setCurrency: () => {},
  updateAddress: async () => {},
}

const EcommerceContext = createContext<EcommerceContextType>(defaultContext)

const defaultLocalStorage = {
  key: 'cart',
}

export const EcommerceProvider: React.FC<ContextProps> = ({
  addressesSlug = 'addresses',
  api,
  cartsSlug = 'carts',
  children,
  currenciesConfig = {
    defaultCurrency: 'USD',
    supportedCurrencies: [
      {
        code: 'USD',
        decimals: 2,
        label: 'US Dollar',
        symbol: '$',
      },
    ],
  },
  customersSlug = 'users',
  debug = false,
  paymentMethods = [],
  syncLocalStorage = true,
}) => {
  const localStorageConfig =
    syncLocalStorage && typeof syncLocalStorage === 'object'
      ? {
          ...defaultLocalStorage,
          ...syncLocalStorage,
        }
      : defaultLocalStorage

  const { apiRoute = '/api', cartsFetchQuery = {}, serverURL = '' } = api || {}
  const baseAPIURL = `${serverURL}${apiRoute}`

  const [isLoading, startTransition] = useTransition()

  const [user, setUser] = useState<null | TypedUser>(null)

  const [addresses, setAddresses] = useState<AddressesCollection[]>()

  const hasRendered = useRef(false)

  /**
   * The ID of the cart associated with the current session.
   * This is used to identify the cart in the database or local storage.
   * It can be null if no cart has been created yet.
   */
  const [cartID, setCartID] = useState<DefaultDocumentIDType>()
  /**
   * The secret for accessing guest carts without authentication.
   * This is generated when a guest user creates a cart.
   */
  const [cartSecret, setCartSecret] = useState<string | undefined>(undefined)
  const [cart, setCart] = useState<CartsCollection>()

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    () =>
      currenciesConfig.supportedCurrencies.find(
        (c) => c.code === currenciesConfig.defaultCurrency,
      )!,
  )

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<null | string>(null)

  const cartQuery = useMemo(() => {
    const priceField = `priceIn${selectedCurrency.code}`

    const baseQuery = {
      depth: 0,
      populate: {
        products: {
          [priceField]: true,
        },
        variants: {
          options: true,
          [priceField]: true,
        },
      },
      select: {
        items: true,
        subtotal: true,
      },
    }

    return deepMergeSimple(baseQuery, cartsFetchQuery)
  }, [selectedCurrency.code, cartsFetchQuery])

  const createCart = useCallback(
    async (initialData: Record<string, unknown>) => {
      const query = qs.stringify(cartQuery)

      const response = await fetch(`${baseAPIURL}/${cartsSlug}?${query}`, {
        body: JSON.stringify({
          ...initialData,
          currency: selectedCurrency.code,
          customer: user?.id,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create cart: ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Cart creation error: ${data.error}`)
      }

      // Store the secret for guest cart access
      if (!user && data.doc?.secret) {
        setCartSecret(data.doc.secret)
      }

      return data.doc as CartsCollection
    },
    [baseAPIURL, cartQuery, cartsSlug, selectedCurrency.code, user],
  )

  const getCart = useCallback(
    async (cartID: DefaultDocumentIDType, options?: { secret?: string }) => {
      const secret = options?.secret

      // Build query params with secret if provided
      const queryParams = {
        ...cartQuery,
        ...(secret ? { secret } : {}),
      }
      const query = qs.stringify(queryParams)

      const response = await fetch(`${baseAPIURL}/${cartsSlug}/${cartID}?${query}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch cart: ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Cart fetch error: ${data.error}`)
      }

      return data as CartsCollection
    },
    [baseAPIURL, cartQuery, cartsSlug],
  )

  const updateCart = useCallback(
    async (cartID: DefaultDocumentIDType, data: Partial<CartsCollection>) => {
      // Build query params with secret if provided
      const queryParams = {
        ...cartQuery,
        ...(cartSecret ? { secret: cartSecret } : {}),
      }
      const query = qs.stringify(queryParams)

      const response = await fetch(`${baseAPIURL}/${cartsSlug}/${cartID}?${query}`, {
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update cart: ${errorText}`)
      }

      const updatedCart = await response.json()

      setCart(updatedCart.doc as CartsCollection)
    },
    [baseAPIURL, cartQuery, cartsSlug, cartSecret],
  )

  const deleteCart = useCallback(
    async (cartID: DefaultDocumentIDType) => {
      // Build query params with secret if provided
      const queryParams = cartSecret ? { secret: cartSecret } : {}
      const query = qs.stringify(queryParams)
      const url = `${baseAPIURL}/${cartsSlug}/${cartID}${query ? `?${query}` : ''}`

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete cart: ${errorText}`)
      }

      setCart(undefined)
      setCartID(undefined)
      setCartSecret(undefined)
    },
    [baseAPIURL, cartsSlug, cartSecret],
  )

  // Persist cart ID and secret to localStorage
  useEffect(() => {
    if (hasRendered.current) {
      if (syncLocalStorage) {
        if (cartID) {
          localStorage.setItem(localStorageConfig.key, cartID as string)
        } else {
          localStorage.removeItem(localStorageConfig.key)
        }

        if (cartSecret) {
          localStorage.setItem(`${localStorageConfig.key}_secret`, cartSecret)
        } else {
          localStorage.removeItem(`${localStorageConfig.key}_secret`)
        }
      }
    }
  }, [cartID, cartSecret, localStorageConfig.key, syncLocalStorage])

  const addItem: EcommerceContextType['addItem'] = useCallback(
    async (item, quantity = 1) => {
      return new Promise<void>((resolve) => {
        startTransition(async () => {
          if (cartID) {
            const existingCart = await getCart(cartID, { secret: cartSecret })

            if (!existingCart) {
              // console.error(`Cart with ID "${cartID}" not found`)

              setCartID(undefined)
              setCart(undefined)
              return
            }

            // Check if the item already exists in the cart
            const existingItemIndex =
              existingCart.items?.findIndex((cartItem: CartItem) => {
                const productID =
                  typeof cartItem.product === 'object' ? cartItem.product.id : item.product
                const variantID =
                  cartItem.variant && typeof cartItem.variant === 'object'
                    ? cartItem.variant.id
                    : item.variant

                return (
                  productID === item.product &&
                  (item.variant && variantID ? variantID === item.variant : true)
                )
              }) ?? -1

            let updatedItems = existingCart.items ? [...existingCart.items] : []

            if (existingItemIndex !== -1) {
              // If the item exists, update its quantity
              updatedItems[existingItemIndex].quantity =
                updatedItems[existingItemIndex].quantity + quantity

              // Update the cart with the new items
              await updateCart(cartID, {
                items: updatedItems,
              })
            } else {
              // If the item does not exist, add it to the cart
              updatedItems = [...(existingCart.items ?? []), { ...item, quantity }]
            }

            // Update the cart with the new items
            await updateCart(cartID, {
              items: updatedItems,
            })
          } else {
            // If no cartID exists, create a new cart
            const newCart = await createCart({ items: [{ ...item, quantity }] })

            setCartID(newCart.id)
            setCart(newCart)
          }
          resolve()
        })
      })
    },
    [cartID, cartSecret, createCart, getCart, startTransition, updateCart],
  )

  const removeItem: EcommerceContextType['removeItem'] = useCallback(
    async (targetID) => {
      return new Promise<void>((resolve) => {
        startTransition(async () => {
          if (!cartID) {
            resolve()
            return
          }

          const existingCart = await getCart(cartID, { secret: cartSecret })

          if (!existingCart) {
            // console.error(`Cart with ID "${cartID}" not found`)
            setCartID(undefined)
            setCart(undefined)
            resolve()
            return
          }

          // Check if the item already exists in the cart
          const existingItemIndex =
            existingCart.items?.findIndex((cartItem: CartItem) => cartItem.id === targetID) ?? -1

          if (existingItemIndex !== -1) {
            // If the item exists, remove it from the cart
            const updatedItems = existingCart.items ? [...existingCart.items] : []
            updatedItems.splice(existingItemIndex, 1)

            // Update the cart with the new items
            await updateCart(cartID, {
              items: updatedItems,
            })
          }
          resolve()
        })
      })
    },
    [cartID, cartSecret, getCart, startTransition, updateCart],
  )

  const incrementItem: EcommerceContextType['incrementItem'] = useCallback(
    async (targetID) => {
      return new Promise<void>((resolve) => {
        startTransition(async () => {
          if (!cartID) {
            resolve()
            return
          }

          const existingCart = await getCart(cartID, { secret: cartSecret })

          if (!existingCart) {
            // console.error(`Cart with ID "${cartID}" not found`)
            setCartID(undefined)
            setCart(undefined)
            resolve()
            return
          }

          // Check if the item already exists in the cart
          const existingItemIndex =
            existingCart.items?.findIndex((cartItem: CartItem) => cartItem.id === targetID) ?? -1

          let updatedItems = existingCart.items ? [...existingCart.items] : []

          if (existingItemIndex !== -1) {
            // If the item exists, increment its quantity
            updatedItems[existingItemIndex].quantity = updatedItems[existingItemIndex].quantity + 1 // Increment by 1
            // Update the cart with the new items
            await updateCart(cartID, {
              items: updatedItems,
            })
          } else {
            // If the item does not exist, add it to the cart with quantity 1
            updatedItems = [...(existingCart.items ?? []), { product: targetID, quantity: 1 }]
            // Update the cart with the new items
            await updateCart(cartID, {
              items: updatedItems,
            })
          }
          resolve()
        })
      })
    },
    [cartID, cartSecret, getCart, startTransition, updateCart],
  )

  const decrementItem: EcommerceContextType['decrementItem'] = useCallback(
    async (targetID) => {
      return new Promise<void>((resolve) => {
        startTransition(async () => {
          if (!cartID) {
            resolve()
            return
          }

          const existingCart = await getCart(cartID, { secret: cartSecret })

          if (!existingCart) {
            // console.error(`Cart with ID "${cartID}" not found`)
            setCartID(undefined)
            setCart(undefined)
            resolve()
            return
          }

          // Check if the item already exists in the cart
          const existingItemIndex =
            existingCart.items?.findIndex((cartItem: CartItem) => cartItem.id === targetID) ?? -1

          const updatedItems = existingCart.items ? [...existingCart.items] : []

          if (existingItemIndex !== -1) {
            // If the item exists, decrement its quantity
            updatedItems[existingItemIndex].quantity = updatedItems[existingItemIndex].quantity - 1 // Decrement by 1

            // If the quantity reaches 0, remove the item from the cart
            if (updatedItems[existingItemIndex].quantity <= 0) {
              updatedItems.splice(existingItemIndex, 1)
            }

            // Update the cart with the new items
            await updateCart(cartID, {
              items: updatedItems,
            })
          }
          resolve()
        })
      })
    },
    [cartID, cartSecret, getCart, startTransition, updateCart],
  )

  const clearCart: EcommerceContextType['clearCart'] = useCallback(async () => {
    return new Promise<void>((resolve) => {
      startTransition(async () => {
        if (cartID) {
          await deleteCart(cartID)
        }
        resolve()
      })
    })
  }, [cartID, deleteCart, startTransition])

  const setCurrency: EcommerceContextType['setCurrency'] = useCallback(
    (currency) => {
      if (selectedCurrency.code === currency) {
        return
      }

      const foundCurrency = currenciesConfig.supportedCurrencies.find((c) => c.code === currency)
      if (!foundCurrency) {
        throw new Error(`Currency with code "${currency}" not found in config`)
      }

      setSelectedCurrency(foundCurrency)
    },
    [currenciesConfig.supportedCurrencies, selectedCurrency.code],
  )

  const initiatePayment = useCallback<EcommerceContextType['initiatePayment']>(
    async (paymentMethodID, options) => {
      const paymentMethod = paymentMethods.find((method) => method.name === paymentMethodID)

      if (!paymentMethod) {
        throw new Error(`Payment method with ID "${paymentMethodID}" not found`)
      }

      if (!cartID) {
        throw new Error(`No cart is provided.`)
      }

      setSelectedPaymentMethod(paymentMethodID)

      if (paymentMethod.initiatePayment) {
        const fetchURL = `${baseAPIURL}/payments/${paymentMethodID}/initiate`

        const data = {
          cartID,
          currency: selectedCurrency.code,
        }

        try {
          const response = await fetch(fetchURL, {
            body: JSON.stringify({
              ...data,
              ...(options?.additionalData || {}),
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          if (!response.ok) {
            const responseError = await response.text()
            throw new Error(responseError)
          }

          const responseData = await response.json()

          if (responseData.error) {
            throw new Error(responseData.error)
          }

          return responseData
        } catch (error) {
          if (debug) {
            // eslint-disable-next-line no-console
            console.error('Error initiating payment:', error)
          }
          throw new Error(error instanceof Error ? error.message : 'Failed to initiate payment')
        }
      } else {
        throw new Error(`Payment method "${paymentMethodID}" does not support payment initiation`)
      }
    },
    [baseAPIURL, cartID, debug, paymentMethods, selectedCurrency.code],
  )

  const confirmOrder = useCallback<EcommerceContextType['initiatePayment']>(
    async (paymentMethodID, options) => {
      if (!cartID) {
        throw new Error(`Cart is empty.`)
      }

      const paymentMethod = paymentMethods.find((pm) => pm.name === paymentMethodID)

      if (!paymentMethod) {
        throw new Error(`Payment method with ID "${paymentMethodID}" not found`)
      }

      if (paymentMethod.confirmOrder) {
        const fetchURL = `${baseAPIURL}/payments/${paymentMethodID}/confirm-order`

        const data = {
          cartID,
          currency: selectedCurrency.code,
        }

        const response = await fetch(fetchURL, {
          body: JSON.stringify({
            ...data,
            ...(options?.additionalData || {}),
          }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        if (!response.ok) {
          const responseError = await response.text()
          throw new Error(responseError)
        }

        const responseData = await response.json()

        if (responseData.error) {
          throw new Error(responseData.error)
        }

        return responseData
      } else {
        throw new Error(`Payment method "${paymentMethodID}" does not support order confirmation`)
      }
    },
    [baseAPIURL, cartID, paymentMethods, selectedCurrency.code],
  )

  const getUser = useCallback(async () => {
    try {
      const query = qs.stringify({
        depth: 0,
        select: {
          id: true,
          carts: true,
        },
      })

      const response = await fetch(`${baseAPIURL}/${customersSlug}/me?${query}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch user: ${errorText}`)
      }

      const userData = await response.json()

      if (userData.error) {
        throw new Error(`User fetch error: ${userData.error}`)
      }

      if (userData.user) {
        setUser(userData.user as TypedUser)
        return userData.user as TypedUser
      }
    } catch (error) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user:', error)
      }
      setUser(null)
      throw new Error(
        `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }, [baseAPIURL, customersSlug, debug])

  const getAddresses = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const query = qs.stringify({
        depth: 0,
        limit: 0,
        pagination: false,
      })

      const response = await fetch(`${baseAPIURL}/${addressesSlug}?${query}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })

      if (!response.ok) {
        const errorText = await response.text()

        throw new Error(errorText)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(`Address fetch error: ${data.error}`)
      }

      if (data.docs && data.docs.length > 0) {
        setAddresses(data.docs)
      }
    } catch (error) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.error('Error fetching addresses:', error)
      }
      setAddresses(undefined)
      throw new Error(
        `Failed to fetch addresses: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }, [user, baseAPIURL, addressesSlug, debug])

  const updateAddress = useCallback<EcommerceContextType['updateAddress']>(
    async (addressID, address) => {
      if (!user) {
        throw new Error('User must be logged in to update or create an address')
      }

      try {
        const response = await fetch(`${baseAPIURL}/${addressesSlug}/${addressID}`, {
          body: JSON.stringify(address),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update or create address: ${errorText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(`Address update/create error: ${data.error}`)
        }

        // Refresh addresses after updating or creating
        await getAddresses()
      } catch (error) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.error('Error updating or creating address:', error)
        }

        throw new Error(
          `Failed to update or create address: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    },
    [user, baseAPIURL, addressesSlug, getAddresses, debug],
  )

  const createAddress = useCallback<EcommerceContextType['createAddress']>(
    async (address) => {
      if (!user) {
        throw new Error('User must be logged in to update or create an address')
      }

      try {
        const response = await fetch(`${baseAPIURL}/${addressesSlug}`, {
          body: JSON.stringify(address),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update or create address: ${errorText}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(`Address update/create error: ${data.error}`)
        }

        // Refresh addresses after updating or creating
        await getAddresses()
      } catch (error) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.error('Error updating or creating address:', error)
        }

        throw new Error(
          `Failed to update or create address: ${error instanceof Error ? error.message : 'Unknown error'}`,
        )
      }
    },
    [user, baseAPIURL, addressesSlug, getAddresses, debug],
  )

  // If localStorage is enabled, restore cart from storage
  useEffect(() => {
    if (!hasRendered.current) {
      if (syncLocalStorage) {
        const storedCartID = localStorage.getItem(localStorageConfig.key)
        const storedSecret = localStorage.getItem(`${localStorageConfig.key}_secret`)

        if (storedCartID) {
          getCart(storedCartID, { secret: storedSecret || undefined })
            .then((fetchedCart) => {
              setCart(fetchedCart)
              setCartID(storedCartID as DefaultDocumentIDType)
              if (storedSecret) {
                setCartSecret(storedSecret)
              }
            })
            .catch((_) => {
              // console.error('Error fetching cart from localStorage:', error)
              // If there's an error fetching the cart, clear it from localStorage
              localStorage.removeItem(localStorageConfig.key)
              localStorage.removeItem(`${localStorageConfig.key}_secret`)
              setCartID(undefined)
              setCart(undefined)
              setCartSecret(undefined)
            })
        }
      }

      hasRendered.current = true

      void getUser().then((user) => {
        if (user && user.cart?.docs && user.cart.docs.length > 0) {
          // If the user has carts, we can set the cartID to the first cart
          const cartID =
            typeof user.cart.docs[0] === 'object' ? user.cart.docs[0].id : user.cart.docs[0]

          if (cartID) {
            getCart(cartID)
              .then((fetchedCart) => {
                setCart(fetchedCart)
                setCartID(cartID)
              })
              .catch((error) => {
                if (debug) {
                  // eslint-disable-next-line no-console
                  console.error('Error fetching user cart:', error)
                }

                setCart(undefined)
                setCartID(undefined)

                throw new Error(`Failed to fetch user cart: ${error.message}`)
              })
          }
        }
      })
    }
  }, [debug, getAddresses, getCart, getUser, localStorageConfig.key, syncLocalStorage])

  useEffect(() => {
    if (user) {
      // If the user is logged in, fetch their addresses
      void getAddresses()
    } else {
      // If no user is logged in, clear addresses
      setAddresses(undefined)
    }
  }, [getAddresses, user])

  return (
    <EcommerceContext
      value={{
        addItem,
        addresses,
        cart,
        clearCart,
        confirmOrder,
        createAddress,
        currenciesConfig,
        currency: selectedCurrency,
        decrementItem,
        incrementItem,
        initiatePayment,
        isLoading,
        paymentMethods,
        removeItem,
        selectedPaymentMethod,
        setCurrency,
        updateAddress,
      }}
    >
      {children}
    </EcommerceContext>
  )
}

export const useEcommerce = () => {
  const context = use(EcommerceContext)

  if (!context) {
    throw new Error('useEcommerce must be used within an EcommerceProvider')
  }

  return context
}

export const useCurrency = () => {
  const { currenciesConfig, currency, setCurrency } = useEcommerce()

  const formatCurrency = useCallback(
    (value?: null | number, options?: { currency?: Currency }): string => {
      if (value === undefined || value === null) {
        return ''
      }

      const currencyToUse = options?.currency || currency

      if (!currencyToUse) {
        return value.toString()
      }

      if (value === 0) {
        return `${currencyToUse.symbol}0.${'0'.repeat(currencyToUse.decimals)}`
      }

      // Convert from base value (e.g., cents) to decimal value (e.g., dollars)
      const decimalValue = value / Math.pow(10, currencyToUse.decimals)

      // Format with the correct number of decimal places
      return `${currencyToUse.symbol}${decimalValue.toFixed(currencyToUse.decimals)}`
    },
    [currency],
  )

  if (!currency) {
    throw new Error('useCurrency must be used within an EcommerceProvider')
  }

  return {
    currency,
    formatCurrency,
    setCurrency,
    supportedCurrencies: currenciesConfig.supportedCurrencies,
  }
}

export function useCart<T extends CartsCollection>() {
  const { addItem, cart, clearCart, decrementItem, incrementItem, isLoading, removeItem } =
    useEcommerce()

  if (!addItem) {
    throw new Error('useCart must be used within an EcommerceProvider')
  }

  return {
    addItem,
    cart: cart as T,
    clearCart,
    decrementItem,
    incrementItem,
    isLoading,
    removeItem,
  }
}

export const usePayments = () => {
  const { confirmOrder, initiatePayment, isLoading, paymentMethods, selectedPaymentMethod } =
    useEcommerce()

  if (!initiatePayment) {
    throw new Error('usePayments must be used within an EcommerceProvider')
  }

  return { confirmOrder, initiatePayment, isLoading, paymentMethods, selectedPaymentMethod }
}

export function useAddresses<T extends AddressesCollection>() {
  const { addresses, createAddress, isLoading, updateAddress } = useEcommerce()

  if (!createAddress) {
    throw new Error('usePayments must be used within an EcommerceProvider')
  }

  return { addresses: addresses as T[], createAddress, isLoading, updateAddress }
}
```

--------------------------------------------------------------------------------

---[FILE: utilities.ts]---
Location: payload-main/packages/plugin-ecommerce/src/react/provider/utilities.ts

```typescript
import type { Currency } from '../../types/index.js'

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

````
