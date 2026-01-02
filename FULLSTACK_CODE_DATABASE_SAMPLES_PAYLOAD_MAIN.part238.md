---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 238
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 238 of 695)

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

---[FILE: defaultProductsValidation.spec.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/defaultProductsValidation.spec.ts

```typescript
import type { CurrenciesConfig } from '../types/index.js'

import { EUR, USD } from '../currencies/index.js'
import { defaultProductsValidation } from './defaultProductsValidation'
import { MissingPrice, OutOfStock } from './errorCodes'

describe('defaultProductsValidation', () => {
  const currenciesConfig: CurrenciesConfig = {
    defaultCurrency: 'USD',
    supportedCurrencies: [USD, EUR],
  }

  describe('currency validation', () => {
    it('should throw error when currency is not provided', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: '',
          product: product as any,
          quantity: 1,
        })
      }).toThrow('Currency must be provided for product validation.')
    })

    it('should throw error when currency is undefined', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: undefined as any,
          product: product as any,
          quantity: 1,
        })
      }).toThrow('Currency must be provided for product validation.')
    })
  })

  describe('variant validation', () => {
    it('should validate variant price exists', () => {
      const variant = {
        id: 'variant-1',
        priceInEUR: 900,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 1,
          variant: variant as any,
        })
      }).toThrow('Variant with ID variant-1 does not have a price in usd.')
    })

    it('should pass when variant has price in requested currency', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 1,
          variant: variant as any,
        })
      }).not.toThrow()
    })

    it('should handle case-insensitive currency codes', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'USD',
          product: {} as any,
          quantity: 1,
          variant: variant as any,
        })
      }).not.toThrow()
    })

    it('should throw error when variant inventory is 0', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 0,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 1,
          variant: variant as any,
        })
      }).toThrow('Variant with ID variant-1 is out of stock or does not have enough inventory.')
    })

    it('should throw error when variant inventory is less than quantity', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 5,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 10,
          variant: variant as any,
        })
      }).toThrow('Variant with ID variant-1 is out of stock or does not have enough inventory.')
    })

    it('should pass when variant inventory equals quantity', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 5,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 5,
          variant: variant as any,
        })
      }).not.toThrow()
    })

    it('should pass when variant inventory is greater than quantity', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 5,
          variant: variant as any,
        })
      }).not.toThrow()
    })

    it('should pass when variant has no inventory field (unlimited stock)', () => {
      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: {} as any,
          quantity: 100,
          variant: variant as any,
        })
      }).not.toThrow()
    })
  })

  describe('product validation', () => {
    it('should validate product price exists', () => {
      const product = {
        id: 'product-1',
        priceInEUR: 900,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
        })
      }).toThrow('Product does not have a price in.')
    })

    it('should include error cause with MissingPrice code', () => {
      const product = {
        id: 'product-1',
        priceInEUR: 900,
        inventory: 10,
      }

      try {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
        })
      } catch (error: any) {
        expect(error.cause).toEqual({
          code: MissingPrice,
          codes: ['product-1', 'usd'],
        })
      }
    })

    it('should pass when product has price in requested currency', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
        })
      }).not.toThrow()
    })

    it('should throw error when product inventory is 0', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 0,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
        })
      }).toThrow('Product is out of stock or does not have enough inventory.')
    })

    it('should include error cause with OutOfStock code', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 0,
      }

      try {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
        })
      } catch (error: any) {
        expect(error.cause).toEqual({
          code: OutOfStock,
          codes: ['product-1'],
        })
      }
    })

    it('should throw error when product inventory is less than quantity', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 5,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 10,
        })
      }).toThrow('Product is out of stock or does not have enough inventory.')
    })

    it('should pass when product inventory equals quantity', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 5,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 5,
        })
      }).not.toThrow()
    })

    it('should pass when product inventory is greater than quantity', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 5,
        })
      }).not.toThrow()
    })

    it('should pass when product has no inventory field (unlimited stock)', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 100,
        })
      }).not.toThrow()
    })

    it('should default quantity to 1 when not provided', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 1,
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
        })
      }).not.toThrow()
    })
  })

  describe('variant priority over product', () => {
    it('should only validate variant when both product and variant are provided', () => {
      const product = {
        id: 'product-1',
        priceInEUR: 900, // Missing USD price
        inventory: 0, // Out of stock
      }

      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 10,
      }

      // Should not throw because variant validation takes priority
      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
          variant: variant as any,
        })
      }).not.toThrow()
    })

    it('should not validate product inventory when variant is provided', () => {
      const product = {
        id: 'product-1',
        priceInUSD: 1000,
        inventory: 0, // Product out of stock
      }

      const variant = {
        id: 'variant-1',
        priceInUSD: 1000,
        inventory: 10, // But variant has stock
      }

      expect(() => {
        defaultProductsValidation({
          currenciesConfig,
          currency: 'usd',
          product: product as any,
          quantity: 1,
          variant: variant as any,
        })
      }).not.toThrow()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: defaultProductsValidation.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/defaultProductsValidation.ts

```typescript
import type { ProductsValidation } from '../types/index.js'

import { MissingPrice, OutOfStock } from './errorCodes.js'

export const defaultProductsValidation: ProductsValidation = ({
  currenciesConfig,
  currency,
  product,
  quantity = 1,
  variant,
}) => {
  if (!currency) {
    throw new Error('Currency must be provided for product validation.')
  }

  const priceField = `priceIn${currency.toUpperCase()}`

  if (variant) {
    if (!variant[priceField]) {
      throw new Error(`Variant with ID ${variant.id} does not have a price in ${currency}.`)
    }

    if (variant.inventory === 0 || (variant.inventory && variant.inventory < quantity)) {
      throw new Error(
        `Variant with ID ${variant.id} is out of stock or does not have enough inventory.`,
      )
    }
  } else if (product) {
    // Validate the product's details only if the variant is not provided as it can have its own inventory and price
    if (!product[priceField]) {
      throw new Error(`Product does not have a price in.`, {
        cause: { code: MissingPrice, codes: [product.id, currency] },
      })
    }

    if (product.inventory === 0 || (product.inventory && product.inventory < quantity)) {
      throw new Error(`Product is out of stock or does not have enough inventory.`, {
        cause: { code: OutOfStock, codes: [product.id] },
      })
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: errorCodes.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/errorCodes.ts

```typescript
export const MissingPrice = 'MissingPrice'
export const OutOfStock = 'OutOfStock'
```

--------------------------------------------------------------------------------

---[FILE: getCollectionSlugMap.spec.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/getCollectionSlugMap.spec.ts

```typescript
import type { SanitizedEcommercePluginConfig } from '../types/index.js'

import { USD } from '../currencies/index.js'
import { getCollectionSlugMap } from './getCollectionSlugMap'

describe('getCollectionSlugMap', () => {
  const mockAccessConfig = {
    adminOnlyFieldAccess: jest.fn(),
    adminOrPublishedStatus: jest.fn(),
    customerOnlyFieldAccess: jest.fn(),
    isAdmin: jest.fn(),
    isAuthenticated: jest.fn(),
    isDocumentOwner: jest.fn(),
    publicAccess: jest.fn(),
  }

  const baseConfig: SanitizedEcommercePluginConfig = {
    access: mockAccessConfig,
    addresses: {
      addressFields: [],
    },
    carts: true,
    currencies: {
      defaultCurrency: 'USD',
      supportedCurrencies: [USD],
    },
    customers: {
      slug: 'users',
    },
    orders: true,
    payments: {
      paymentMethods: [],
    },
    products: true,
    transactions: true,
  }

  it('should return default slug map when no overrides are provided', () => {
    const result = getCollectionSlugMap({ sanitizedPluginConfig: baseConfig })

    expect(result).toEqual({
      addresses: 'addresses',
      carts: 'carts',
      customers: 'users',
      orders: 'orders',
      products: 'products',
      transactions: 'transactions',
      variantOptions: 'variantOptions',
      variants: 'variants',
      variantTypes: 'variantTypes',
    })
  })

  it('should use custom customers slug when provided', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      customers: {
        slug: 'custom-users',
      },
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result.customers).toBe('custom-users')
  })

  it('should apply slugMap overrides', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      slugMap: {
        products: 'custom-products',
        variants: 'custom-variants',
        orders: 'custom-orders',
      },
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result.products).toBe('custom-products')
    expect(result.variants).toBe('custom-variants')
    expect(result.orders).toBe('custom-orders')
    // Other slugs should remain default
    expect(result.addresses).toBe('addresses')
    expect(result.carts).toBe('carts')
  })

  it('should prioritize slugMap overrides over customers slug', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      customers: {
        slug: 'my-users',
      },
      slugMap: {
        customers: 'overridden-users',
      },
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result.customers).toBe('overridden-users')
  })

  it('should handle partial slugMap overrides', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      slugMap: {
        products: 'items',
      },
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result.products).toBe('items')
    expect(result.addresses).toBe('addresses')
    expect(result.carts).toBe('carts')
    expect(result.customers).toBe('users')
    expect(result.orders).toBe('orders')
    expect(result.transactions).toBe('transactions')
    expect(result.variants).toBe('variants')
    expect(result.variantOptions).toBe('variantOptions')
    expect(result.variantTypes).toBe('variantTypes')
  })

  it('should handle empty slugMap', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      slugMap: {},
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result).toEqual({
      addresses: 'addresses',
      carts: 'carts',
      customers: 'users',
      orders: 'orders',
      products: 'products',
      transactions: 'transactions',
      variantOptions: 'variantOptions',
      variants: 'variants',
      variantTypes: 'variantTypes',
    })
  })

  it('should handle undefined slugMap', () => {
    const config: SanitizedEcommercePluginConfig = {
      ...baseConfig,
      slugMap: undefined,
    }

    const result = getCollectionSlugMap({ sanitizedPluginConfig: config })

    expect(result).toEqual({
      addresses: 'addresses',
      carts: 'carts',
      customers: 'users',
      orders: 'orders',
      products: 'products',
      transactions: 'transactions',
      variantOptions: 'variantOptions',
      variants: 'variants',
      variantTypes: 'variantTypes',
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getCollectionSlugMap.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/getCollectionSlugMap.ts

```typescript
import type { CollectionSlugMap, SanitizedEcommercePluginConfig } from '../types/index.js'

type Props = {
  sanitizedPluginConfig: SanitizedEcommercePluginConfig
}

/**
 * Generates a map of collection slugs based on the sanitized plugin configuration.
 * Takes into consideration any collection overrides provided in the plugin.
 */
export const getCollectionSlugMap = ({ sanitizedPluginConfig }: Props): CollectionSlugMap => {
  const defaultSlugMap: CollectionSlugMap = {
    addresses: 'addresses',
    carts: 'carts',
    customers: 'users',
    orders: 'orders',
    products: 'products',
    transactions: 'transactions',
    variantOptions: 'variantOptions',
    variants: 'variants',
    variantTypes: 'variantTypes',
  }

  const collectionSlugsMap: CollectionSlugMap = defaultSlugMap

  if (typeof sanitizedPluginConfig.customers === 'object' && sanitizedPluginConfig.customers.slug) {
    collectionSlugsMap.customers = sanitizedPluginConfig.customers.slug
  }

  return { ...collectionSlugsMap, ...(sanitizedPluginConfig.slugMap || {}) }
}
```

--------------------------------------------------------------------------------

---[FILE: pushTypeScriptProperties.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/pushTypeScriptProperties.ts

```typescript
import type { I18n } from '@payloadcms/translations'
import type { JSONSchema4 } from 'json-schema'
import type { SanitizedConfig } from 'payload'

import type { CollectionSlugMap, SanitizedEcommercePluginConfig } from '../types/index.js'

export const pushTypeScriptProperties = ({
  collectionSlugMap,
  jsonSchema,
}: {
  collectionSlugMap: CollectionSlugMap
  config: SanitizedConfig
  jsonSchema: JSONSchema4
  sanitizedPluginConfig: SanitizedEcommercePluginConfig
}): JSONSchema4 => {
  if (!jsonSchema.properties) {
    jsonSchema.properties = {}
  }

  if (Array.isArray(jsonSchema.required)) {
    jsonSchema.required.push('ecommerce')
  }

  const requiredCollectionProperties: string[] = []
  const propertiesMap = new Map<string, { $ref: string }>()

  Object.entries(collectionSlugMap).forEach(([key, slug]) => {
    propertiesMap.set(key, { $ref: `#/definitions/${slug}` })

    requiredCollectionProperties.push(slug)
  })

  jsonSchema.properties.ecommerce = {
    type: 'object',
    additionalProperties: false,
    description: 'Generated by the Payload Ecommerce plugin',
    properties: {
      collections: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ...Object.fromEntries(propertiesMap),
        },
        required: requiredCollectionProperties,
      },
    },
    required: ['collections'],
  }

  return jsonSchema
}
```

--------------------------------------------------------------------------------

---[FILE: sanitizePluginConfig.spec.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/sanitizePluginConfig.spec.ts

```typescript
import type { EcommercePluginConfig } from '../types/index.js'

import { EUR, USD } from '../currencies/index.js'
import { sanitizePluginConfig } from './sanitizePluginConfig'

describe('sanitizePluginConfig', () => {
  const mockAccessConfig = {
    adminOnlyFieldAccess: jest.fn(),
    adminOrPublishedStatus: jest.fn(),
    customerOnlyFieldAccess: jest.fn(),
    isAdmin: jest.fn(),
    isAuthenticated: jest.fn(),
    isDocumentOwner: jest.fn(),
  }

  const minimalConfig: EcommercePluginConfig = {
    access: mockAccessConfig,
    customers: {
      slug: 'users',
    },
  }

  describe('customers', () => {
    it('should default customers slug to "users" when undefined', () => {
      const config: EcommercePluginConfig = {
        access: mockAccessConfig,
        customers: undefined as any,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.customers).toEqual({
        slug: 'users',
      })
    })

    it('should preserve custom customers slug', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        customers: {
          slug: 'custom-users',
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.customers.slug).toBe('custom-users')
    })
  })

  describe('addresses', () => {
    it('should create default addresses config when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.addresses).toBeDefined()
      expect(result.addresses.addressFields).toBeDefined()
      expect(Array.isArray(result.addresses.addressFields)).toBe(true)
      expect(result.addresses.addressFields.length).toBeGreaterThan(0)
    })

    it('should create default addresses config when set to true', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        addresses: true,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.addresses).toBeDefined()
      expect(result.addresses.addressFields).toBeDefined()
      expect(Array.isArray(result.addresses.addressFields)).toBe(true)
    })

    it('should use custom addressFields function', () => {
      const customField = {
        name: 'customField',
        type: 'text' as const,
      }

      const config: EcommercePluginConfig = {
        ...minimalConfig,
        addresses: {
          addressFields: ({ defaultFields }) => [...defaultFields, customField],
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.addresses.addressFields).toBeDefined()
      const lastField = result.addresses.addressFields[result.addresses.addressFields.length - 1]
      expect(lastField).toEqual(customField)
    })

    it('should preserve other address config properties', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        addresses: {
          addressFields: ({ defaultFields }) => defaultFields,
          supportedCountries: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
          ],
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.addresses.supportedCountries).toEqual([
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
      ])
    })
  })

  describe('currencies', () => {
    it('should default to USD when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.currencies).toEqual({
        defaultCurrency: 'USD',
        supportedCurrencies: [USD],
      })
    })

    it('should preserve custom currencies config', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        currencies: {
          defaultCurrency: 'EUR',
          supportedCurrencies: [USD, EUR],
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.currencies).toEqual({
        defaultCurrency: 'EUR',
        supportedCurrencies: [USD, EUR],
      })
    })
  })

  describe('inventory', () => {
    it('should default inventory config when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.inventory).toEqual({
        fieldName: 'inventory',
      })
    })

    it('should default inventory config when set to true', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        inventory: true,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.inventory).toEqual({
        fieldName: 'inventory',
      })
    })

    it('should preserve custom inventory config', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        inventory: {
          fieldName: 'stock',
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.inventory).toEqual({
        fieldName: 'stock',
      })
    })

    it('should allow disabling inventory with false', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        inventory: false,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.inventory).toBe(false)
    })
  })

  describe('carts', () => {
    it('should default carts to object with allowGuestCarts true when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.carts).toEqual({
        allowGuestCarts: true,
      })
    })

    it('should convert carts true to object with allowGuestCarts true', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        carts: true,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.carts).toEqual({
        allowGuestCarts: true,
      })
    })

    it('should preserve carts false', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        carts: false,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.carts).toBe(false)
    })

    it('should default allowGuestCarts to true when carts is object without it', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        carts: {} as any,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.carts).toEqual({
        allowGuestCarts: true,
      })
    })

    it('should preserve explicit allowGuestCarts false', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        carts: {
          allowGuestCarts: false,
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.carts).toEqual({
        allowGuestCarts: false,
      })
    })

    it('should preserve other carts config properties', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        carts: {
          allowGuestCarts: false,
          cartsCollectionOverride: jest.fn() as any,
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.carts).toHaveProperty('allowGuestCarts', false)
      expect(result.carts).toHaveProperty('cartsCollectionOverride')
    })
  })

  describe('orders', () => {
    it('should default orders to true when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.orders).toBe(true)
    })

    it('should preserve orders config', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        orders: false,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.orders).toBe(false)
    })
  })

  describe('transactions', () => {
    it('should default transactions to true when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.transactions).toBe(true)
    })

    it('should preserve transactions config', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        transactions: false,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.transactions).toBe(false)
    })
  })

  describe('payments', () => {
    it('should default payments to empty array when undefined', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.payments).toEqual({
        paymentMethods: [],
      })
    })

    it('should default paymentMethods to empty array when not provided', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        payments: {} as any,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.payments.paymentMethods).toEqual([])
    })

    it('should preserve payment methods', () => {
      const mockAdapter = {
        name: 'stripe',
        label: 'Stripe',
      } as any

      const config: EcommercePluginConfig = {
        ...minimalConfig,
        payments: {
          paymentMethods: [mockAdapter],
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.payments.paymentMethods).toEqual([mockAdapter])
    })
  })

  describe('products', () => {
    it('should default variants to true when products is object and variants is undefined', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        products: {},
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.products).toEqual({
        variants: true,
      })
    })

    it('should preserve variants config when provided', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        products: {
          variants: false,
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.products).toEqual({
        variants: false,
      })
    })

    it('should not modify products when set to true', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        products: true,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.products).toBe(true)
    })

    it('should not modify products when set to false', () => {
      const config: EcommercePluginConfig = {
        ...minimalConfig,
        products: false,
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.products).toBe(false)
    })
  })

  describe('access', () => {
    it('should provide default isAuthenticated function', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.access.isAuthenticated).toBeDefined()
      expect(typeof result.access.isAuthenticated).toBe('function')
    })

    it('should provide default publicAccess function', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.access.publicAccess).toBeDefined()
      expect(typeof result.access.publicAccess).toBe('function')
    })

    it('should allow user-provided access functions to override defaults', () => {
      const customIsAuthenticated = jest.fn()
      const customPublicAccess = jest.fn()

      const config: EcommercePluginConfig = {
        ...minimalConfig,
        access: {
          ...mockAccessConfig,
          isAuthenticated: customIsAuthenticated,
          publicAccess: customPublicAccess,
        },
      }

      const result = sanitizePluginConfig({ pluginConfig: config })

      expect(result.access.isAuthenticated).toBe(customIsAuthenticated)
      expect(result.access.publicAccess).toBe(customPublicAccess)
    })

    it('should preserve all user-provided access functions', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.access.adminOnlyFieldAccess).toBe(mockAccessConfig.adminOnlyFieldAccess)
      expect(result.access.adminOrPublishedStatus).toBe(mockAccessConfig.adminOrPublishedStatus)
      expect(result.access.customerOnlyFieldAccess).toBe(mockAccessConfig.customerOnlyFieldAccess)
      expect(result.access.isAdmin).toBe(mockAccessConfig.isAdmin)
      expect(result.access.isDocumentOwner).toBe(mockAccessConfig.isDocumentOwner)
    })

    it('default publicAccess should always return true', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      // @ts-expect-error - ignoring for test
      expect(result.access.publicAccess()).toBe(true)
    })

    it('default isAuthenticated should be provided', () => {
      const result = sanitizePluginConfig({ pluginConfig: minimalConfig })

      expect(result.access.isAuthenticated).toBeDefined()
      expect(typeof result.access.isAuthenticated).toBe('function')
    })
  })

  describe('complete config', () => {
    it('should handle a fully configured plugin', () => {
      const fullConfig: EcommercePluginConfig = {
        access: mockAccessConfig,
        addresses: {
          addressFields: ({ defaultFields }) => defaultFields,
          supportedCountries: [{ label: 'US', value: 'US' }],
        },
        carts: {
          allowGuestCarts: true,
        },
        currencies: {
          defaultCurrency: 'EUR',
          supportedCurrencies: [USD, EUR],
        },
        customers: {
          slug: 'customers',
        },
        inventory: {
          fieldName: 'stock',
        },
        orders: true,
        payments: {
          paymentMethods: [],
        },
        products: {
          variants: true,
        },
        slugMap: {
          products: 'items',
        },
        transactions: true,
      }

      const result = sanitizePluginConfig({ pluginConfig: fullConfig })

      expect(result.customers.slug).toBe('customers')
      expect(result.currencies.defaultCurrency).toBe('EUR')
      expect(result.inventory).toEqual({ fieldName: 'stock' })
      expect(result.carts).toHaveProperty('allowGuestCarts', true)
      expect(result.orders).toBe(true)
      expect(result.transactions).toBe(true)
      expect(result.products).toEqual({ variants: true })
      expect(result.slugMap).toEqual({ products: 'items' })
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: sanitizePluginConfig.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/sanitizePluginConfig.ts

```typescript
import type { EcommercePluginConfig, SanitizedEcommercePluginConfig } from '../types/index.js'

import { defaultAddressFields } from '../collections/addresses/defaultAddressFields.js'
import { USD } from '../currencies/index.js'

type Props = {
  pluginConfig: EcommercePluginConfig
}

export const sanitizePluginConfig = ({ pluginConfig }: Props): SanitizedEcommercePluginConfig => {
  const config = {
    ...pluginConfig,
  } as Partial<SanitizedEcommercePluginConfig>

  if (typeof config.customers === 'undefined') {
    config.customers = {
      slug: 'users',
    }
  }

  if (
    typeof config.addresses === 'undefined' ||
    (typeof config.addresses === 'boolean' && config.addresses === true)
  ) {
    config.addresses = {
      addressFields: defaultAddressFields(),
    }
  } else {
    const addressFields =
      (typeof pluginConfig.addresses === 'object' &&
        typeof pluginConfig.addresses.addressFields === 'function' &&
        pluginConfig.addresses.addressFields({
          defaultFields: defaultAddressFields(),
        })) ||
      defaultAddressFields()

    config.addresses = {
      ...config.addresses,
      addressFields,
    }
  }

  if (!config.currencies) {
    config.currencies = {
      defaultCurrency: 'USD',
      supportedCurrencies: [USD],
    }
  }

  if (
    typeof config.inventory === 'undefined' ||
    (typeof config.inventory === 'boolean' && config.inventory === true)
  ) {
    config.inventory = {
      fieldName: 'inventory',
    }
  }

  if (typeof config.carts === 'undefined') {
    config.carts = {
      allowGuestCarts: true,
    }
  } else if (config.carts === true) {
    config.carts = {
      allowGuestCarts: true,
    }
  } else if (
    typeof config.carts === 'object' &&
    typeof config.carts.allowGuestCarts === 'undefined'
  ) {
    config.carts.allowGuestCarts = true
  }

  if (typeof config.orders === 'undefined') {
    config.orders = true
  }

  if (typeof config.transactions === 'undefined') {
    config.transactions = true
  }

  if (typeof config.payments === 'undefined') {
    config.payments = {
      paymentMethods: [],
    }
  } else if (!config.payments.paymentMethods) {
    config.payments.paymentMethods = []
  }

  if (config.products) {
    if (typeof config.products === 'object' && typeof config.products.variants === 'undefined') {
      config.products.variants = true
    }
  }

  config.access = {
    isAuthenticated: ({ req }) => Boolean(req?.user),
    publicAccess: () => true,
    ...pluginConfig.access,
  }

  return config as SanitizedEcommercePluginConfig
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/packages/plugin-form-builder/.gitignore

```text
node_modules
.env
dist
build
.DS_Store
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: .prettierignore]---
Location: payload-main/packages/plugin-form-builder/.prettierignore

```text
.tmp
**/.git
**/.hg
**/.pnp.*
**/.svn
**/.yarn/**
**/build
**/dist/**
**/node_modules
**/temp
**/docs/**
tsconfig.json
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/packages/plugin-form-builder/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
  "exclude": ["/**/mocks"],
  "jsc": {
    "target": "esnext",
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "dts": true
    },
    "transform": {
      "react": {
        "runtime": "automatic",
        "pragmaFrag": "React.Fragment",
        "throwIfNamespace": true,
        "development": false,
        "useBuiltins": true
      }
    }
  },
  "module": {
    "type": "es6"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: LICENSE.md]---
Location: payload-main/packages/plugin-form-builder/LICENSE.md

```text
MIT License

Copyright (c) 2018-2025 Payload CMS, Inc. <info@payloadcms.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

--------------------------------------------------------------------------------

````
