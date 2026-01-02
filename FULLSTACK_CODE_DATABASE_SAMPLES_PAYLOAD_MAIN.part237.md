---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 237
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 237 of 695)

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

---[FILE: index.css]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceInput/index.css

```text
.formattedPrice {
  .formattedPriceLabel {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
  }

  .formattedPriceContainer {
    display: flex;
    position: relative;
  }

  .formattedPriceCurrencySymbol {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(calc(-50%));
    color: var(--theme-elevation-500);
    user-select: none;
    pointer-events: none;
  }

  .formattedPriceInput {
    padding: 0.5rem 0.5rem 0.5rem 1.75rem;
    min-width: 2rem;
    width: fit-content;
    max-width: 10rem;
  }

  .formattedPriceDescription {
    max-width: 46rem;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceInput/index.tsx

```typescript
import type { NumberFieldServerProps } from 'payload'

import './index.css'

import type { CurrenciesConfig, Currency } from '../../types/index.js'

import { FormattedInput } from './FormattedInput.js'

type Props = {
  currenciesConfig: CurrenciesConfig
  currency?: Currency
  path: string
} & NumberFieldServerProps

export const PriceInput: React.FC<Props> = (args) => {
  const {
    clientField: { label },
    currenciesConfig,
    currency: currencyFromProps,
    field,
    i18n: { t },
    i18n,
    path,
    readOnly,
  } = args

  const description = field.admin?.description
    ? typeof field.admin.description === 'function'
      ? // @ts-expect-error - weird type issue on 't' here
        field.admin.description({ i18n, t })
      : field.admin.description
    : undefined

  return (
    <FormattedInput
      currency={currencyFromProps}
      description={description}
      label={label}
      path={path}
      readOnly={readOnly}
      supportedCurrencies={currenciesConfig?.supportedCurrencies}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.css]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceRowLabel/index.css

```text
@layer payload-default {
  .priceRowLabel {
    display: flex;
    align-items: center;
    gap: calc(var(--base) * 1);
  }

  .priceValue {
    display: flex;
    align-items: center;
    gap: calc(var(--base) * 0.25);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/PriceRowLabel/index.tsx
Signals: React

```typescript
'use client'

import { useRowLabel } from '@payloadcms/ui'
import { useMemo } from 'react'

import type { CurrenciesConfig } from '../../types/index.js'

import './index.css'
import { convertFromBaseValue } from '../utilities.js'

type Props = {
  currenciesConfig: CurrenciesConfig
}

export const PriceRowLabel: React.FC<Props> = (props) => {
  const { currenciesConfig } = props
  const { defaultCurrency, supportedCurrencies } = currenciesConfig

  const { data } = useRowLabel<{ amount: number; currency: string }>()

  const currency = useMemo(() => {
    if (data.currency) {
      return supportedCurrencies.find((c) => c.code === data.currency) ?? supportedCurrencies[0]
    }

    const fallbackCurrency = supportedCurrencies.find((c) => c.code === defaultCurrency)

    if (fallbackCurrency) {
      return fallbackCurrency
    }

    return supportedCurrencies[0]
  }, [data.currency, supportedCurrencies, defaultCurrency])

  const amount = useMemo(() => {
    if (data.amount) {
      return convertFromBaseValue({ baseValue: data.amount, currency: currency! })
    }

    return '0'
  }, [currency, data.amount])

  return (
    <div className="priceRowLabel">
      <div className="priceLabel">Price:</div>

      <div className="priceValue">
        <span>
          {currency?.symbol}
          {amount}
        </span>
        <span>({data.currency})</span>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: ErrorBox.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/VariantOptionsSelector/ErrorBox.tsx

```typescript
'use client'

import { FieldError, useField, useTranslation } from '@payloadcms/ui'

type Props = {
  children?: React.ReactNode
  existingOptions: string[]
  path: string
}

export const ErrorBox: React.FC<Props> = (props) => {
  const { children, path } = props
  const { errorMessage, showError } = useField<(number | string)[]>({ path })

  return (
    <div className="variantOptionsSelectorError">
      <FieldError message={errorMessage} path={path} showError={showError} />
      <div
        className={['variantOptionsSelectorErrorWrapper', showError && 'showError']
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.css]---
Location: payload-main/packages/plugin-ecommerce/src/ui/VariantOptionsSelector/index.css

```text
@layer payload-default {
  .variantOptionsSelector {
    margin-top: calc(var(--spacing-field) * 2);
    margin-bottom: calc(var(--spacing-field) * 2);
  }

  .variantOptionsSelectorHeading {
    font-size: calc(var(--base) * 1);
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: calc(var(--base) * 0.5);
  }

  .variantOptionsSelectorItem {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .variantOptionsSelectorList {
    display: flex;
    flex-direction: column;
    gap: calc(var(--base) * 0.75);
  }

  .variantOptionsSelectorError {
    position: relative;
  }

  .variantOptionsSelectorErrorWrapper {
    &.showError {
      border-radius: 2px;
      outline: 1px solid var(--theme-error-400);
      outline-offset: 2px;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/VariantOptionsSelector/index.tsx

```typescript
import type { SelectFieldServerProps } from 'payload'

import { FieldLabel } from '@payloadcms/ui'

import { ErrorBox } from './ErrorBox.js'
import './index.css'
import { OptionsSelect } from './OptionsSelect.js'
type Props = {} & SelectFieldServerProps

export const VariantOptionsSelector: React.FC<Props> = async (props) => {
  const { clientField, data, path, req, user } = props
  const { label } = clientField

  const product = await req.payload.findByID({
    id: data.product,
    collection: 'products',
    depth: 0,
    draft: true,
    select: {
      variants: true,
      variantTypes: true,
    },
    user,
  })

  // @ts-expect-error - TODO: Fix types
  const existingVariantOptions = product.variants?.docs?.map((variant) => variant.options) ?? []

  const variantTypeIDs = product.variantTypes

  const variantTypes = []

  // Need to get the variant types separately so that the options are populated
  // @ts-expect-error - TODO: Fix types
  if (variantTypeIDs?.length && variantTypeIDs.length > 0) {
    // @ts-expect-error - TODO: Fix types
    for (const variantTypeID of variantTypeIDs) {
      const variantType = await req.payload.findByID({
        id: variantTypeID,
        collection: 'variantTypes',
        depth: 1,
        joins: {
          options: {
            sort: 'value',
          },
        },
      })

      if (variantType) {
        variantTypes.push(variantType)
      }
    }
  }

  return (
    <div className="variantOptionsSelector">
      <div className="variantOptionsSelectorHeading">
        <FieldLabel as="span" label={label} />
      </div>

      <ErrorBox existingOptions={existingVariantOptions} path={path}>
        <div className="variantOptionsSelectorList">
          {variantTypes.map((type) => {
            // @ts-expect-error - TODO: Fix types
            const options = type.options.docs.map((option) => ({
              label: option.label,
              value: option.id,
            }))

            return (
              <OptionsSelect
                field={clientField}
                key={type.name}
                label={type.label || type.name}
                options={options}
                path={path}
              />
            )
          })}
        </div>
      </ErrorBox>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: OptionsSelect.tsx]---
Location: payload-main/packages/plugin-ecommerce/src/ui/VariantOptionsSelector/OptionsSelect.tsx
Signals: React

```typescript
'use client'

import type { SelectFieldClient } from 'payload'

import { FieldLabel, ReactSelect, useField, useForm } from '@payloadcms/ui'
import { useCallback, useId, useMemo } from 'react'

type Props = {
  field: Omit<SelectFieldClient, 'type'>
  label: string
  options: { label: string; value: number | string }[]
  path: string
}

export const OptionsSelect: React.FC<Props> = (props) => {
  const {
    field: { required },
    label,
    options: optionsFromProps,
    path,
  } = props

  const { setValue, value } = useField<(number | string)[]>({ path })
  const id = useId()

  const selectedValue = useMemo(() => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return undefined
    }
    const foundOption = optionsFromProps.find((option) => {
      return value.find((item) => item === option.value)
    })

    return foundOption
  }, [optionsFromProps, value])

  const handleChange = useCallback(
    // @ts-expect-error - TODO: Fix types
    (option) => {
      if (selectedValue) {
        let selectedValueIndex = -1

        const valuesWithoutSelected = [...value].filter((o, index) => {
          if (o === selectedValue.value) {
            selectedValueIndex = index
            return false
          }

          return true
        })

        const newValues = [...valuesWithoutSelected]

        newValues.splice(selectedValueIndex, 0, option.value)

        setValue(newValues)
      } else {
        const values = [...(value || []), option.value]

        setValue(values)
      }
    },
    [selectedValue, setValue, value],
  )

  return (
    <div className="variantOptionsSelectorItem">
      <FieldLabel htmlFor={id} label={label} required={required} />

      <ReactSelect
        inputId={id}
        onChange={handleChange}
        options={optionsFromProps}
        value={selectedValue}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: accessComposition.spec.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/accessComposition.spec.ts

```typescript
import type { Access, AccessArgs, Where } from 'payload'

import { accessAND, conditional, accessOR } from './accessComposition'

// Mock access args for testing
const mockArgs: AccessArgs = {
  req: {
    user: null,
    headers: new Headers(),
    payload: {} as any,
    context: {},
  } as any,
}

const mockArgsWithUser: AccessArgs = {
  req: {
    user: { id: '123', email: 'test@example.com' },
    headers: new Headers(),
    payload: {} as any,
    context: {},
  } as any,
}

describe('Access Composition Utilities', () => {
  describe('or', () => {
    it('should return true when first checker returns true', async () => {
      const checker1: Access = async () => true
      const checker2: Access = async () => false

      const result = await accessOR(checker1, checker2)(mockArgs)

      expect(result).toBe(true)
    })

    it('should return true when any checker returns true', async () => {
      const checker1: Access = async () => false
      const checker2: Access = async () => true
      const checker3: Access = async () => false

      const result = await accessOR(checker1, checker2, checker3)(mockArgs)

      expect(result).toBe(true)
    })

    it('should return false when all checkers return false', async () => {
      const checker1: Access = async () => false
      const checker2: Access = async () => false
      const checker3: Access = async () => false

      const result = await accessOR(checker1, checker2, checker3)(mockArgs)

      expect(result).toBe(false)
    })

    it('should combine Where queries with OR logic', async () => {
      const checker1: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker2: Access = async () => ({
        status: { equals: 'published' },
      })

      const result = await accessOR(checker1, checker2)(mockArgs)

      expect(result).toEqual({
        or: [{ customer: { equals: '123' } }, { status: { equals: 'published' } }],
      })
    })

    it('should return true when one checker returns true and others return Where queries', async () => {
      const checker1: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker2: Access = async () => true

      const result = await accessOR(checker1, checker2)(mockArgs)

      expect(result).toBe(true)
    })

    it('should ignore false values when combining Where queries', async () => {
      const checker1: Access = async () => false
      const checker2: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker3: Access = async () => false
      const checker4: Access = async () => ({
        status: { equals: 'published' },
      })

      const result = await accessOR(checker1, checker2, checker3, checker4)(mockArgs)

      expect(result).toEqual({
        or: [{ customer: { equals: '123' } }, { status: { equals: 'published' } }],
      })
    })

    it('should return a single Where query when only one checker returns a Where query', async () => {
      const checker1: Access = async () => false
      const checker2: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker3: Access = async () => false

      const result = await accessOR(checker1, checker2, checker3)(mockArgs)

      expect(result).toEqual({
        or: [{ customer: { equals: '123' } }],
      })
    })

    it('should short-circuit on first true result for performance', async () => {
      let secondCheckerCalled = false

      const checker1: Access = async () => true
      const checker2: Access = async () => {
        secondCheckerCalled = true
        return false
      }

      await accessOR(checker1, checker2)(mockArgs)

      expect(secondCheckerCalled).toBe(false)
    })

    it('should handle empty checkers array', async () => {
      const result = await accessOR()(mockArgs)

      expect(result).toBe(false)
    })

    it('should handle complex nested Where queries', async () => {
      const checker1: Access = async () =>
        ({
          and: [{ customer: { equals: '123' } }, { status: { equals: 'active' } }],
        }) as Where
      const checker2: Access = async () => ({
        role: { equals: 'admin' },
      })

      const result = await accessOR(checker1, checker2)(mockArgs)

      expect(result).toEqual({
        or: [
          { and: [{ customer: { equals: '123' } }, { status: { equals: 'active' } }] },
          { role: { equals: 'admin' } },
        ],
      })
    })
  })

  describe('and', () => {
    it('should return false when any checker returns false', async () => {
      const checker1: Access = async () => true
      const checker2: Access = async () => false

      const result = await accessAND(checker1, checker2)(mockArgs)

      expect(result).toBe(false)
    })

    it('should return true when all checkers return true', async () => {
      const checker1: Access = async () => true
      const checker2: Access = async () => true
      const checker3: Access = async () => true

      const result = await accessAND(checker1, checker2, checker3)(mockArgs)

      expect(result).toBe(true)
    })

    it('should combine Where queries with AND logic', async () => {
      const checker1: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker2: Access = async () => ({
        status: { equals: 'published' },
      })

      const result = await accessAND(checker1, checker2)(mockArgs)

      expect(result).toEqual({
        and: [{ customer: { equals: '123' } }, { status: { equals: 'published' } }],
      })
    })

    it('should return false when one checker returns false and others return Where queries', async () => {
      const checker1: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker2: Access = async () => false

      const result = await accessAND(checker1, checker2)(mockArgs)

      expect(result).toBe(false)
    })

    it('should return Where query when all checkers return Where queries except one returns true', async () => {
      const checker1: Access = async () => true
      const checker2: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker3: Access = async () => ({
        status: { equals: 'published' },
      })

      const result = await accessAND(checker1, checker2, checker3)(mockArgs)

      expect(result).toEqual({
        and: [{ customer: { equals: '123' } }, { status: { equals: 'published' } }],
      })
    })

    it('should short-circuit on first false result for performance', async () => {
      let secondCheckerCalled = false

      const checker1: Access = async () => false
      const checker2: Access = async () => {
        secondCheckerCalled = true
        return true
      }

      await accessAND(checker1, checker2)(mockArgs)

      expect(secondCheckerCalled).toBe(false)
    })

    it('should handle empty checkers array', async () => {
      const result = await accessAND()(mockArgs)

      expect(result).toBe(true)
    })

    it('should return a single Where query when only one checker returns a Where query', async () => {
      const checker1: Access = async () => true
      const checker2: Access = async () => ({
        customer: { equals: '123' },
      })
      const checker3: Access = async () => true

      const result = await accessAND(checker1, checker2, checker3)(mockArgs)

      expect(result).toEqual({
        and: [{ customer: { equals: '123' } }],
      })
    })

    it('should handle complex nested Where queries', async () => {
      const checker1: Access = async () => ({
        or: [{ customer: { equals: '123' } }, { customer: { equals: '456' } }],
      })
      const checker2: Access = async () => ({
        status: { equals: 'active' },
      })

      const result = await accessAND(checker1, checker2)(mockArgs)

      expect(result).toEqual({
        and: [
          { or: [{ customer: { equals: '123' } }, { customer: { equals: '456' } }] },
          { status: { equals: 'active' } },
        ],
      })
    })

    it('should return false immediately when first checker returns false', async () => {
      const checker1: Access = async () => false
      const checker2: Access = async () => {
        throw new Error('Should not be called')
      }

      const result = await accessAND(checker1, checker2)(mockArgs)

      expect(result).toBe(false)
    })
  })

  describe('conditional', () => {
    it('should apply checker when condition is true', async () => {
      const checker: Access = async () => true

      const result = await conditional(true, checker)(mockArgs)

      expect(result).toBe(true)
    })

    it('should return false when condition is false', async () => {
      const checker: Access = async () => true

      const result = await conditional(false, checker)(mockArgs)

      expect(result).toBe(false)
    })

    it('should apply checker when condition function returns true', async () => {
      const condition = ({ req }: AccessArgs) => !!req.user
      const checker: Access = async () => true

      const result = await conditional(condition, checker)(mockArgsWithUser)

      expect(result).toBe(true)
    })

    it('should return false when condition function returns false', async () => {
      const condition = ({ req }: AccessArgs) => !!req.user
      const checker: Access = async () => true

      const result = await conditional(condition, checker)(mockArgs)

      expect(result).toBe(false)
    })

    it('should pass Where query through when condition is true', async () => {
      const checker: Access = async () => ({
        customer: { equals: '123' },
      })

      const result = await conditional(true, checker)(mockArgs)

      expect(result).toEqual({
        customer: { equals: '123' },
      })
    })

    it('should not call checker when condition is false', async () => {
      let checkerCalled = false

      const checker: Access = async () => {
        checkerCalled = true
        return true
      }

      await conditional(false, checker)(mockArgs)

      expect(checkerCalled).toBe(false)
    })

    it('should evaluate condition function each time', async () => {
      const condition = ({ req }: AccessArgs) => !!req.user
      const checker: Access = async () => true

      // First call without user
      const result1 = await conditional(condition, checker)(mockArgs)
      expect(result1).toBe(false)

      // Second call with user
      const result2 = await conditional(condition, checker)(mockArgsWithUser)
      expect(result2).toBe(true)
    })

    it('should work with false checker result when condition is true', async () => {
      const checker: Access = async () => false

      const result = await conditional(true, checker)(mockArgs)

      expect(result).toBe(false)
    })
  })

  describe('combined composition', () => {
    it('should compose or, and, and conditional together', async () => {
      const isAdmin: Access = async ({ req }) => req.user?.role === 'admin'
      const isOwner: Access = async ({ req }) => ({
        customer: { equals: req.user?.id },
      })
      const isGuest: Access = async ({ req }) => !req.user

      const allowGuestCarts = true

      const access = accessOR(isAdmin, accessAND(isOwner), conditional(allowGuestCarts, isGuest))

      // Guest user (no user)
      const guestResult = await access(mockArgs)
      expect(guestResult).toBe(true)

      // Admin user
      const adminResult = await access({
        req: {
          user: { id: '123', role: 'admin' },
          headers: new Headers(),
          payload: {} as any,
          context: {},
        } as any,
      })
      expect(adminResult).toBe(true)

      // Regular user (owner)
      const ownerResult = await access({
        req: {
          user: { id: '123', role: 'customer' },
          headers: new Headers(),
          payload: {} as any,
          context: {},
        } as any,
      })
      expect(ownerResult).toEqual({
        or: [{ and: [{ customer: { equals: '123' } }] }],
      })
    })

    it('should handle complex nested compositions', async () => {
      const checker1: Access = async () => ({
        status: { equals: 'published' },
      })
      const checker2: Access = async () => ({
        visibility: { equals: 'public' },
      })
      const checker3: Access = async ({ req }) => !!req.user
      const checker4: Access = async () => ({
        customer: { equals: '123' },
      })

      // ((published AND public) OR (authenticated AND customer=123))
      const access = accessOR(accessAND(checker1, checker2), accessAND(checker3, checker4))

      // Without user
      const result1 = await access(mockArgs)
      expect(result1).toEqual({
        or: [
          {
            and: [{ status: { equals: 'published' } }, { visibility: { equals: 'public' } }],
          },
        ],
      })

      // With user
      const result2 = await access(mockArgsWithUser)
      expect(result2).toEqual({
        or: [
          {
            and: [{ status: { equals: 'published' } }, { visibility: { equals: 'public' } }],
          },
          {
            and: [{ customer: { equals: '123' } }],
          },
        ],
      })
    })

    it('should handle conditional inside or composition', async () => {
      const isAdmin: Access = async () => false
      const isGuest: Access = async () => true
      const allowGuestAccess = true

      const access = accessOR(isAdmin, conditional(allowGuestAccess, isGuest))

      const result = await access(mockArgs)
      expect(result).toBe(true)
    })

    it('should handle conditional inside and composition', async () => {
      const hasPermission: Access = async () => ({
        permissions: { contains: 'read' },
      })
      const isActiveUser: Access = async () => true
      const featureFlagEnabled = true

      const access = accessAND(hasPermission, conditional(featureFlagEnabled, isActiveUser))

      const result = await access(mockArgs)
      expect(result).toEqual({
        and: [{ permissions: { contains: 'read' } }],
      })
    })

    it('should correctly handle multiple levels of nesting', async () => {
      const a: Access = async () => true
      const b: Access = async () => false
      const c: Access = async () => ({ field1: { equals: 'value1' } })
      const d: Access = async () => ({ field2: { equals: 'value2' } })

      // (a AND (b OR (c AND d)))
      const access = accessAND(a, accessOR(b, accessAND(c, d)))

      const result = await access(mockArgs)
      expect(result).toEqual({
        and: [
          { or: [{ and: [{ field1: { equals: 'value1' } }, { field2: { equals: 'value2' } }] }] },
        ],
      })
    })
  })

  describe('edge cases and failure scenarios', () => {
    it('should handle checker that throws an error', async () => {
      const checker1: Access = async () => {
        throw new Error('Access check failed')
      }
      const checker2: Access = async () => true

      await expect(accessOR(checker1, checker2)(mockArgs)).rejects.toThrow('Access check failed')
    })

    it('should handle null or undefined returns gracefully', async () => {
      const checker1: Access = async () => null as any
      const checker2: Access = async () => undefined as any
      const checker3: Access = async () => true

      const result = await accessOR(checker1, checker2, checker3)(mockArgs)
      expect(result).toBe(true)
    })

    it('should handle deeply nested Where queries', async () => {
      const checker: Access = async () =>
        ({
          and: [
            {
              or: [
                { field1: { equals: 'value1' } },
                {
                  and: [{ field2: { equals: 'value2' } }, { field3: { equals: 'value3' } }],
                },
              ],
            },
            { field4: { not_equals: 'value4' } },
          ],
        }) as Where

      const result = await accessOR(checker)(mockArgs)

      expect(result).toEqual({
        or: [
          {
            and: [
              {
                or: [
                  { field1: { equals: 'value1' } },
                  {
                    and: [{ field2: { equals: 'value2' } }, { field3: { equals: 'value3' } }],
                  },
                ],
              },
              { field4: { not_equals: 'value4' } },
            ],
          },
        ],
      })
    })

    it('should handle async checker that takes time', async () => {
      const checker1: Access = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return false
      }
      const checker2: Access = async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        return true
      }

      const start = Date.now()
      const result = await accessOR(checker1, checker2)(mockArgs)
      const duration = Date.now() - start

      expect(result).toBe(true)
      expect(duration).toBeGreaterThanOrEqual(20)
    })

    it('should handle all checkers returning null/undefined', async () => {
      const checker1: Access = async () => null as any
      const checker2: Access = async () => undefined as any

      const result = await accessOR(checker1, checker2)(mockArgs)

      // null and undefined should be treated as false
      expect(result).toBe(false)
    })

    it('should handle Where query with empty object', async () => {
      const checker: Access = async () => ({}) as Where

      const result = await accessOR(checker)(mockArgs)

      expect(result).toEqual({})
    })

    it('should handle conditional with complex condition function', async () => {
      const condition = ({ req }: AccessArgs): boolean => {
        return !!(req.user && req.user.email && req.user.email.endsWith('@admin.com'))
      }

      const checker: Access = async () => true

      // Non-admin email
      const result1 = await conditional(
        condition,
        checker,
      )({
        req: {
          user: { id: '123', email: 'user@example.com' },
          headers: new Headers(),
          payload: {} as any,
          context: {},
        } as any,
      })
      expect(result1).toBe(false)

      // Admin email
      const result2 = await conditional(
        condition,
        checker,
      )({
        req: {
          user: { id: '123', email: 'admin@admin.com' },
          headers: new Headers(),
          payload: {} as any,
          context: {},
        } as any,
      })
      expect(result2).toBe(true)
    })

    it('should handle very large number of checkers in or', async () => {
      const checkers: Access[] = Array.from({ length: 100 }, (_, i) => async () => ({
        field: { equals: `value${i}` },
      }))

      const result = await accessOR(...checkers)(mockArgs)

      expect(result).toHaveProperty('or')
      expect((result as any).or).toHaveLength(100)
    })

    it('should handle very large number of checkers in and', async () => {
      const checkers: Access[] = Array.from({ length: 100 }, (_, i) => async () => ({
        field: { equals: `value${i}` },
      }))

      const result = await accessAND(...checkers)(mockArgs)

      expect(result).toHaveProperty('and')
      expect((result as any).and).toHaveLength(100)
    })

    it('should handle alternating true/false in or correctly', async () => {
      const checkers: Access[] = [
        async () => false,
        async () => false,
        async () => false,
        async () => true, // This should cause short-circuit
        async () => {
          throw new Error('Should not be called')
        },
      ]

      const result = await accessOR(...checkers)(mockArgs)

      expect(result).toBe(true)
    })

    it('should handle alternating true/false in and correctly', async () => {
      const checkers: Access[] = [
        async () => true,
        async () => true,
        async () => false, // This should cause short-circuit
        async () => {
          throw new Error('Should not be called')
        },
      ]

      const result = await accessAND(...checkers)(mockArgs)

      expect(result).toBe(false)
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: accessComposition.ts]---
Location: payload-main/packages/plugin-ecommerce/src/utilities/accessComposition.ts

```typescript
import type { Access, Where } from 'payload'

import { combineWhereConstraints } from 'payload/shared'

/**
 * Combines multiple access functions with OR logic.
 *
 * Logic:
 * - If ANY function returns `true` → return `true` (full access, short-circuit)
 * - If ALL functions return `false` → return `false` (no access)
 * - If any functions return `Where` queries → combine them with OR logic
 *
 * @example
 * ```ts
 * const canCreate = or(
 *   isAdmin,
 *   isAuthenticated,
 *   conditional(allowGuestAccess, isGuest)
 * )
 * ```
 */
export const accessOR = (...accessFunctions: Access[]): Access => {
  return async (args) => {
    const whereQueries: Where[] = []

    for (const access of accessFunctions) {
      const result = await access(args)

      // Short-circuit on true - full access granted
      if (result === true) {
        return true
      }

      // Collect Where queries for combination (must be an object, not null/undefined/false)
      if (result && typeof result === 'object') {
        whereQueries.push(result)
      }
    }

    // If we have Where queries, combine them with OR
    if (whereQueries.length > 0) {
      return combineWhereConstraints(whereQueries, 'or')
    }

    // All checkers returned false - no access
    return false
  }
}

/**
 * Combines multiple access functions with AND logic.
 *
 * Logic:
 * - If ANY function returns `false` → return `false` (no access, short-circuit)
 * - If ALL functions return `true` → return `true` (full access)
 * - If any functions return `Where` queries → combine them with AND logic
 *
 * @example
 * ```ts
 * const canUpdate = and(
 *   isAuthenticated,
 *   isDocumentOwner
 * )
 * ```
 */
export const accessAND = (...accessFunctions: Access[]): Access => {
  return async (args) => {
    const whereQueries: Where[] = []

    for (const access of accessFunctions) {
      const result = await access(args)

      // Short-circuit on false - no access
      if (result === false) {
        return false
      }

      // Collect Where queries for combination (must be an object, not null/undefined/true)
      if (result !== true && result && typeof result === 'object') {
        whereQueries.push(result)
      }
    }

    // If we have Where queries, combine them with AND
    if (whereQueries.length > 0) {
      return combineWhereConstraints(whereQueries, 'and')
    }

    // All checkers returned true - full access
    return true
  }
}

/**
 * Conditionally applies an access function based on a boolean condition or function.
 *
 * Useful for feature flags and plugin configuration.
 *
 * @param condition - Boolean or function to determine which function to use
 * @param checker - Access function to use if condition is true
 * @param fallback - Access function to use if condition is false (defaults to denying access)
 *
 * @example
 * ```ts
 * const canCreate = or(
 *   isAdmin,
 *   conditional(allowGuestCarts, isGuest)
 * )
 * ```
 */
export const conditional = (
  condition: ((args: any) => boolean) | boolean,
  accessFunction: Access,
  fallback: Access = () => false,
): Access => {
  return async (args) => {
    const shouldApply = typeof condition === 'function' ? condition(args) : condition
    if (shouldApply) {
      return accessFunction(args)
    }
    return fallback(args)
  }
}
```

--------------------------------------------------------------------------------

````
