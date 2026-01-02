---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 169
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 169 of 695)

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

---[FILE: countChangedFields.spec.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/countChangedFields.spec.ts

```typescript
import { countChangedFields, countChangedFieldsInRows } from './countChangedFields.js'
import type { ClientField } from 'payload'

describe('countChangedFields', () => {
  // locales can be undefined when not configured in payload.config.js
  const locales = undefined
  it('should return 0 when no fields have changed', () => {
    const fields: ClientField[] = [
      { name: 'a', type: 'text' },
      { name: 'b', type: 'number' },
    ]
    const valueFrom = { a: 'original', b: 123 }
    const valueTo = { a: 'original', b: 123 }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(0)
  })

  it('should count simple changed fields', () => {
    const fields: ClientField[] = [
      { name: 'a', type: 'text' },
      { name: 'b', type: 'number' },
    ]
    const valueFrom = { a: 'original', b: 123 }
    const valueTo = { a: 'changed', b: 123 }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(1)
  })

  it('should count previously undefined fields', () => {
    const fields: ClientField[] = [
      { name: 'a', type: 'text' },
      { name: 'b', type: 'number' },
    ]
    const valueFrom = {}
    const valueTo = { a: 'new', b: 123 }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should not count the id field because it is not displayed in the version view', () => {
    const fields: ClientField[] = [
      { name: 'id', type: 'text' },
      { name: 'a', type: 'text' },
    ]
    const valueFrom = { id: 'original', a: 'original' }
    const valueTo = { id: 'changed', a: 'original' }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(0)
  })

  it('should count changed fields inside collapsible fields', () => {
    const fields: ClientField[] = [
      {
        type: 'collapsible',
        label: 'A collapsible field',
        fields: [
          { name: 'a', type: 'text' },
          { name: 'b', type: 'text' },
          { name: 'c', type: 'text' },
        ],
      },
    ]
    const valueFrom = { a: 'original', b: 'original', c: 'original' }
    const valueTo = { a: 'changed', b: 'changed', c: 'original' }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should count changed fields inside row fields', () => {
    const fields: ClientField[] = [
      {
        type: 'row',
        fields: [
          { name: 'a', type: 'text' },
          { name: 'b', type: 'text' },
          { name: 'c', type: 'text' },
        ],
      },
    ]
    const valueFrom = { a: 'original', b: 'original', c: 'original' }
    const valueTo = { a: 'changed', b: 'changed', c: 'original' }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should count changed fields inside group fields', () => {
    const fields: ClientField[] = [
      {
        type: 'group',
        name: 'group',
        fields: [
          { name: 'a', type: 'text' },
          { name: 'b', type: 'text' },
          { name: 'c', type: 'text' },
        ],
      },
    ]
    const valueFrom = { group: { a: 'original', b: 'original', c: 'original' } }
    const valueTo = { group: { a: 'changed', b: 'changed', c: 'original' } }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should count changed fields inside unnamed tabs ', () => {
    const fields: ClientField[] = [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Unnamed tab',
            fields: [
              { name: 'a', type: 'text' },
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
            ],
          },
        ],
      },
    ]
    const valueFrom = { a: 'original', b: 'original', c: 'original' }
    const valueTo = { a: 'changed', b: 'changed', c: 'original' }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should count changed fields inside named tabs ', () => {
    const fields: ClientField[] = [
      {
        type: 'tabs',
        tabs: [
          {
            name: 'namedTab',
            fields: [
              { name: 'a', type: 'text' },
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
            ],
          },
        ],
      },
    ]
    const valueFrom = { namedTab: { a: 'original', b: 'original', c: 'original' } }
    const valueTo = { namedTab: { a: 'changed', b: 'changed', c: 'original' } }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should ignore UI fields', () => {
    const fields: ClientField[] = [
      { name: 'a', type: 'text' },
      {
        name: 'b',
        type: 'ui',
        admin: {},
      },
    ]
    const valueFrom = { a: 'original', b: 'original' }
    const valueTo = { a: 'original', b: 'changed' }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(0)
  })

  it('should count changed fields inside array fields', () => {
    const fields: ClientField[] = [
      {
        name: 'arrayField',
        type: 'array',
        fields: [
          {
            name: 'a',
            type: 'text',
          },
          {
            name: 'b',
            type: 'text',
          },
          {
            name: 'c',
            type: 'text',
          },
        ],
      },
    ]
    const valueFrom = {
      arrayField: [
        { a: 'original', b: 'original', c: 'original' },
        { a: 'original', b: 'original' },
      ],
    }
    const valueTo = {
      arrayField: [
        { a: 'changed', b: 'changed', c: 'original' },
        { a: 'changed', b: 'changed', c: 'changed' },
      ],
    }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(5)
  })

  it('should count changed fields inside arrays nested inside of collapsibles', () => {
    const fields: ClientField[] = [
      {
        type: 'collapsible',
        label: 'A collapsible field',
        fields: [
          {
            name: 'arrayField',
            type: 'array',
            fields: [
              {
                name: 'a',
                type: 'text',
              },
              {
                name: 'b',
                type: 'text',
              },
              {
                name: 'c',
                type: 'text',
              },
            ],
          },
        ],
      },
    ]
    const valueFrom = { arrayField: [{ a: 'original', b: 'original', c: 'original' }] }
    const valueTo = { arrayField: [{ a: 'changed', b: 'changed', c: 'original' }] }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(2)
  })

  it('should count changed fields inside blocks fields', () => {
    const fields: ClientField[] = [
      {
        name: 'blocks',
        type: 'blocks',
        blocks: [
          {
            slug: 'blockA',
            fields: [
              { name: 'a', type: 'text' },
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
            ],
          },
        ],
      },
    ]
    const valueFrom = {
      blocks: [
        { blockType: 'blockA', a: 'original', b: 'original', c: 'original' },
        { blockType: 'blockA', a: 'original', b: 'original' },
      ],
    }
    const valueTo = {
      blocks: [
        { blockType: 'blockA', a: 'changed', b: 'changed', c: 'original' },
        { blockType: 'blockA', a: 'changed', b: 'changed', c: 'changed' },
      ],
    }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(5)
  })

  it('should count changed fields between blocks with different slugs', () => {
    const fields: ClientField[] = [
      {
        name: 'blocks',
        type: 'blocks',
        blocks: [
          {
            slug: 'blockA',
            fields: [
              { name: 'a', type: 'text' },
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
            ],
          },
          {
            slug: 'blockB',
            fields: [
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
              { name: 'd', type: 'text' },
            ],
          },
        ],
      },
    ]
    const valueFrom = {
      blocks: [{ blockType: 'blockA', a: 'removed', b: 'original', c: 'original' }],
    }
    const valueTo = {
      blocks: [{ blockType: 'blockB', b: 'original', c: 'changed', d: 'new' }],
    }

    const result = countChangedFields({ valueFrom, fields, valueTo, locales })
    expect(result).toBe(3)
  })

  describe('localized fields', () => {
    const locales = ['en', 'de']
    it('should count simple localized fields', () => {
      const fields: ClientField[] = [
        { name: 'a', type: 'text', localized: true },
        { name: 'b', type: 'text', localized: true },
      ]
      const valueFrom = {
        a: { en: 'original', de: 'original' },
        b: { en: 'original', de: 'original' },
      }
      const valueTo = {
        a: { en: 'changed', de: 'original' },
        b: { en: 'original', de: 'original' },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(1)
    })

    it('should count multiple locales of the same localized field', () => {
      const locales = ['en', 'de']
      const fields: ClientField[] = [
        { name: 'a', type: 'text', localized: true },
        { name: 'b', type: 'text', localized: true },
      ]
      const valueFrom = {
        a: { en: 'original', de: 'original' },
        b: { en: 'original', de: 'original' },
      }
      const valueTo = {
        a: { en: 'changed', de: 'changed' },
        b: { en: 'original', de: 'original' },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(2)
    })

    it('should count changed fields inside localized groups fields', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          name: 'group',
          localized: true,
          fields: [
            { name: 'a', type: 'text' },
            { name: 'b', type: 'text' },
            { name: 'c', type: 'text' },
          ],
        },
      ]
      const valueFrom = {
        group: {
          en: { a: 'original', b: 'original', c: 'original' },
          de: { a: 'original', b: 'original', c: 'original' },
        },
      }
      const valueTo = {
        group: {
          en: { a: 'changed', b: 'changed', c: 'original' },
          de: { a: 'original', b: 'changed', c: 'original' },
        },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(3)
    })
    it('should count changed fields inside localized tabs', () => {
      const fields: ClientField[] = [
        {
          type: 'tabs',
          tabs: [
            {
              name: 'tab',
              localized: true,
              fields: [
                { name: 'a', type: 'text' },
                { name: 'b', type: 'text' },
                { name: 'c', type: 'text' },
              ],
            },
          ],
        },
      ]
      const valueFrom = {
        tab: {
          en: { a: 'original', b: 'original', c: 'original' },
          de: { a: 'original', b: 'original', c: 'original' },
        },
      }
      const valueTo = {
        tab: {
          en: { a: 'changed', b: 'changed', c: 'original' },
          de: { a: 'original', b: 'changed', c: 'original' },
        },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(3)
    })

    it('should count changed fields inside localized array fields', () => {
      const fields: ClientField[] = [
        {
          name: 'arrayField',
          type: 'array',
          localized: true,
          fields: [
            {
              name: 'a',
              type: 'text',
            },
            {
              name: 'b',
              type: 'text',
            },
            {
              name: 'c',
              type: 'text',
            },
          ],
        },
      ]
      const valueFrom = {
        arrayField: {
          en: [{ a: 'original', b: 'original', c: 'original' }],
          de: [{ a: 'original', b: 'original', c: 'original' }],
        },
      }
      const valueTo = {
        arrayField: {
          en: [{ a: 'changed', b: 'changed', c: 'original' }],
          de: [{ a: 'original', b: 'changed', c: 'original' }],
        },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(3)
    })

    it('should count changed fields inside localized blocks fields', () => {
      const fields: ClientField[] = [
        {
          name: 'blocks',
          type: 'blocks',
          localized: true,
          blocks: [
            {
              slug: 'blockA',
              fields: [
                { name: 'a', type: 'text' },
                { name: 'b', type: 'text' },
                { name: 'c', type: 'text' },
              ],
            },
          ],
        },
      ]
      const valueFrom = {
        blocks: {
          en: [{ blockType: 'blockA', a: 'original', b: 'original', c: 'original' }],
          de: [{ blockType: 'blockA', a: 'original', b: 'original', c: 'original' }],
        },
      }
      const valueTo = {
        blocks: {
          en: [{ blockType: 'blockA', a: 'changed', b: 'changed', c: 'original' }],
          de: [{ blockType: 'blockA', a: 'original', b: 'changed', c: 'original' }],
        },
      }
      const result = countChangedFields({ valueFrom, fields, valueTo, locales })
      expect(result).toBe(3)
    })
  })
})

describe('countChangedFieldsInRows', () => {
  it('should count fields in array rows', () => {
    const field: ClientField = {
      name: 'myArray',
      type: 'array',
      fields: [
        { name: 'a', type: 'text' },
        { name: 'b', type: 'text' },
        { name: 'c', type: 'text' },
      ],
    }

    const valueFromRows = [{ a: 'original', b: 'original', c: 'original' }]
    const valueToRows = [{ a: 'changed', b: 'changed', c: 'original' }]

    const result = countChangedFieldsInRows({
      valueFromRows,
      field,
      locales: undefined,
      valueToRows: valueToRows,
    })
    expect(result).toBe(2)
  })

  it('should count fields in blocks', () => {
    const field: ClientField = {
      name: 'myBlocks',
      type: 'blocks',
      blocks: [
        {
          slug: 'blockA',
          fields: [
            { name: 'a', type: 'text' },
            { name: 'b', type: 'text' },
            { name: 'c', type: 'text' },
          ],
        },
      ],
    }

    const valueFromRows = [{ blockType: 'blockA', a: 'original', b: 'original', c: 'original' }]
    const valueToRows = [{ blockType: 'blockA', a: 'changed', b: 'changed', c: 'original' }]

    const result = countChangedFieldsInRows({
      valueFromRows,
      field,
      locales: undefined,
      valueToRows,
    })
    expect(result).toBe(2)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: countChangedFields.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/countChangedFields.ts

```typescript
import type { ArrayFieldClient, BlocksFieldClient, ClientConfig, ClientField } from 'payload'

import { fieldShouldBeLocalized, groupHasName } from 'payload/shared'

import { fieldHasChanges } from './fieldHasChanges.js'
import { getFieldsForRowComparison } from './getFieldsForRowComparison.js'

type Args = {
  config: ClientConfig
  fields: ClientField[]
  locales: string[] | undefined
  parentIsLocalized: boolean
  valueFrom: unknown
  valueTo: unknown
}

/**
 * Recursively counts the number of changed fields between comparison and
 * version data for a given set of fields.
 */
export function countChangedFields({
  config,
  fields,
  locales,
  parentIsLocalized,
  valueFrom,
  valueTo,
}: Args) {
  let count = 0

  fields.forEach((field) => {
    // Don't count the id field since it is not displayed in the UI
    if ('name' in field && field.name === 'id') {
      return
    }
    const fieldType = field.type
    switch (fieldType) {
      // Iterable fields are arrays and blocks fields. We iterate over each row and
      // count the number of changed fields in each.
      case 'array':
      case 'blocks': {
        if (locales && fieldShouldBeLocalized({ field, parentIsLocalized })) {
          locales.forEach((locale) => {
            const valueFromRows = valueFrom?.[field.name]?.[locale] ?? []
            const valueToRows = valueTo?.[field.name]?.[locale] ?? []
            count += countChangedFieldsInRows({
              config,
              field,
              locales,
              parentIsLocalized: parentIsLocalized || field.localized,
              valueFromRows,
              valueToRows,
            })
          })
        } else {
          const valueFromRows = valueFrom?.[field.name] ?? []
          const valueToRows = valueTo?.[field.name] ?? []
          count += countChangedFieldsInRows({
            config,
            field,
            locales,
            parentIsLocalized: parentIsLocalized || field.localized,
            valueFromRows,
            valueToRows,
          })
        }
        break
      }

      // Regular fields without nested fields.
      case 'checkbox':
      case 'code':
      case 'date':
      case 'email':
      case 'join':
      case 'json':
      case 'number':
      case 'point':
      case 'radio':
      case 'relationship':
      case 'richText':
      case 'select':
      case 'text':
      case 'textarea':
      case 'upload': {
        // Fields that have a name and contain data. We can just check if the data has changed.
        if (locales && fieldShouldBeLocalized({ field, parentIsLocalized })) {
          locales.forEach((locale) => {
            if (
              fieldHasChanges(valueTo?.[field.name]?.[locale], valueFrom?.[field.name]?.[locale])
            ) {
              count++
            }
          })
        } else if (fieldHasChanges(valueTo?.[field.name], valueFrom?.[field.name])) {
          count++
        }
        break
      }
      // Fields that have nested fields, but don't nest their fields' data.
      case 'collapsible':
      case 'row': {
        count += countChangedFields({
          config,
          fields: field.fields,
          locales,
          parentIsLocalized: parentIsLocalized || field.localized,
          valueFrom,
          valueTo,
        })

        break
      }

      // Fields that have nested fields and nest their fields' data.
      case 'group': {
        if (groupHasName(field)) {
          if (locales && fieldShouldBeLocalized({ field, parentIsLocalized })) {
            locales.forEach((locale) => {
              count += countChangedFields({
                config,
                fields: field.fields,
                locales,
                parentIsLocalized: parentIsLocalized || field.localized,
                valueFrom: valueFrom?.[field.name]?.[locale],
                valueTo: valueTo?.[field.name]?.[locale],
              })
            })
          } else {
            count += countChangedFields({
              config,
              fields: field.fields,
              locales,
              parentIsLocalized: parentIsLocalized || field.localized,
              valueFrom: valueFrom?.[field.name],
              valueTo: valueTo?.[field.name],
            })
          }
        } else {
          // Unnamed group field: data is NOT nested under `field.name`
          count += countChangedFields({
            config,
            fields: field.fields,
            locales,
            parentIsLocalized: parentIsLocalized || field.localized,
            valueFrom,
            valueTo,
          })
        }
        break
      }

      // Each tab in a tabs field has nested fields. The fields data may be
      // nested or not depending on the existence of a name property.
      case 'tabs': {
        field.tabs.forEach((tab) => {
          if ('name' in tab && locales && tab.localized) {
            // Named localized tab
            locales.forEach((locale) => {
              count += countChangedFields({
                config,
                fields: tab.fields,
                locales,
                parentIsLocalized: parentIsLocalized || tab.localized,
                valueFrom: valueFrom?.[tab.name]?.[locale],
                valueTo: valueTo?.[tab.name]?.[locale],
              })
            })
          } else if ('name' in tab) {
            // Named tab
            count += countChangedFields({
              config,
              fields: tab.fields,
              locales,
              parentIsLocalized: parentIsLocalized || tab.localized,
              valueFrom: valueFrom?.[tab.name],
              valueTo: valueTo?.[tab.name],
            })
          } else {
            // Unnamed tab
            count += countChangedFields({
              config,
              fields: tab.fields,
              locales,
              parentIsLocalized: parentIsLocalized || tab.localized,
              valueFrom,
              valueTo,
            })
          }
        })
        break
      }

      // UI fields don't have data and are not displayed in the version view
      // so we can ignore them.
      case 'ui': {
        break
      }

      default: {
        const _exhaustiveCheck: never = fieldType
        throw new Error(`Unexpected field.type in countChangedFields : ${String(fieldType)}`)
      }
    }
  })

  return count
}

type countChangedFieldsInRowsArgs = {
  config: ClientConfig
  field: ArrayFieldClient | BlocksFieldClient
  locales: string[] | undefined
  parentIsLocalized: boolean
  valueFromRows: unknown[]
  valueToRows: unknown[]
}

export function countChangedFieldsInRows({
  config,
  field,
  locales,
  parentIsLocalized,
  valueFromRows = [],
  valueToRows = [],
}: countChangedFieldsInRowsArgs) {
  let count = 0
  let i = 0

  while (valueFromRows[i] || valueToRows[i]) {
    const valueFromRow = valueFromRows?.[i] || {}
    const valueToRow = valueToRows?.[i] || {}

    const { fields: rowFields } = getFieldsForRowComparison({
      baseVersionField: { type: 'text', fields: [], path: '', schemaPath: '' }, // Doesn't matter, as we don't need the versionFields output here
      config,
      field,
      row: i,
      valueFromRow,
      valueToRow,
    })

    count += countChangedFields({
      config,
      fields: rowFields,
      locales,
      parentIsLocalized: parentIsLocalized || field.localized,
      valueFrom: valueFromRow,
      valueTo: valueToRow,
    })

    i++
  }
  return count
}
```

--------------------------------------------------------------------------------

---[FILE: fieldHasChanges.spec.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/fieldHasChanges.spec.ts

```typescript
import { fieldHasChanges } from './fieldHasChanges.js'

describe('hasChanges', () => {
  it('should return false for identical values', () => {
    const a = 'value'
    const b = 'value'
    expect(fieldHasChanges(a, b)).toBe(false)
  })
  it('should return true for different values', () => {
    const a = 1
    const b = 2
    expect(fieldHasChanges(a, b)).toBe(true)
  })

  it('should return false for identical objects', () => {
    const a = { key: 'value' }
    const b = { key: 'value' }
    expect(fieldHasChanges(a, b)).toBe(false)
  })

  it('should return true for different objects', () => {
    const a = { key: 'value' }
    const b = { key: 'differentValue' }
    expect(fieldHasChanges(a, b)).toBe(true)
  })

  it('should handle undefined values', () => {
    const a = { key: 'value' }
    const b = undefined
    expect(fieldHasChanges(a, b)).toBe(true)
  })

  it('should handle null values', () => {
    const a = { key: 'value' }
    const b = null
    expect(fieldHasChanges(a, b)).toBe(true)
  })
})
```

--------------------------------------------------------------------------------

---[FILE: fieldHasChanges.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/fieldHasChanges.ts

```typescript
export function fieldHasChanges(a: unknown, b: unknown) {
  return JSON.stringify(a) !== JSON.stringify(b)
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldPathsModified.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/getFieldPathsModified.ts

```typescript
import type { ClientField, Field, Tab, TabAsFieldClient } from 'payload'

type Args = {
  field: ClientField | Field | Tab | TabAsFieldClient
  index: number
  parentIndexPath: string
  parentPath: string
  parentSchemaPath: string
}

type FieldPaths = {
  /**
   * A string of '-' separated indexes representing where
   * to find this field in a given field schema array.
   * It will always be complete and accurate.
   */
  indexPath: string
  /**
   * Path for this field relative to its position in the data.
   */
  path: string
  /**
   * Path for this field relative to its position in the schema.
   */
  schemaPath: string
}

export function getFieldPathsModified({
  field,
  index,
  parentIndexPath,
  parentPath,
  parentSchemaPath,
}: Args): FieldPaths {
  const parentPathSegments = parentPath.split('.')

  const parentIsUnnamed = parentPathSegments[parentPathSegments.length - 1].startsWith('_index-')

  const parentWithoutIndex = parentIsUnnamed
    ? parentPathSegments.slice(0, -1).join('.')
    : parentPath

  const parentPathToUse = parentIsUnnamed ? parentWithoutIndex : parentPath

  if ('name' in field) {
    return {
      indexPath: '',
      path: `${parentPathToUse ? parentPathToUse + '.' : ''}${field.name}`,
      schemaPath: `${parentSchemaPath ? parentSchemaPath + '.' : ''}${field.name}`,
    }
  }

  const indexSuffix = `_index-${`${parentIndexPath ? parentIndexPath + '-' : ''}${index}`}`

  return {
    indexPath: `${parentIndexPath ? parentIndexPath + '-' : ''}${index}`,
    path: `${parentPathToUse ? parentPathToUse + '.' : ''}${indexSuffix}`,
    schemaPath: `${!parentIsUnnamed && parentSchemaPath ? parentSchemaPath + '.' : ''}${indexSuffix}`,
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getFieldsForRowComparison.spec.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/getFieldsForRowComparison.spec.ts

```typescript
import { getFieldsForRowComparison } from './getFieldsForRowComparison'
import type { ArrayFieldClient, BlocksFieldClient, ClientField } from 'payload'

describe('getFieldsForRowComparison', () => {
  describe('array fields', () => {
    it('should return fields from array field', () => {
      const arrayFields: ClientField[] = [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ]

      const field: ArrayFieldClient = {
        type: 'array',
        name: 'items',
        fields: arrayFields,
      }

      const { fields } = getFieldsForRowComparison({
        field,
        valueToRow: {},
        valueFromRow: {},
        row: 0,
        baseVersionField: { fields: [], path: 'items', schemaPath: 'items', type: 'array' },
        config: {} as any,
      })

      expect(fields).toEqual(arrayFields)
    })
  })

  describe('blocks fields', () => {
    it('should return combined fields when block types match', () => {
      const blockAFields: ClientField[] = [
        { name: 'a', type: 'text' },
        { name: 'b', type: 'text' },
      ]

      const field: BlocksFieldClient = {
        type: 'blocks',
        name: 'myBlocks',
        blocks: [
          {
            slug: 'blockA',
            fields: blockAFields,
          },
        ],
      }

      const valueToRow = { blockType: 'blockA' }
      const valueFromRow = { blockType: 'blockA' }

      const { fields } = getFieldsForRowComparison({
        field,
        valueToRow,
        valueFromRow,
        row: 0,
        baseVersionField: { fields: [], path: 'myBlocks', schemaPath: 'myBlocks', type: 'blocks' },
        config: {} as any,
      })

      expect(fields).toEqual(blockAFields)
    })

    it('should return unique combined fields when block types differ', () => {
      const field: BlocksFieldClient = {
        type: 'blocks',
        name: 'myBlocks',
        blocks: [
          {
            slug: 'blockA',
            fields: [
              { name: 'a', type: 'text' },
              { name: 'b', type: 'text' },
            ],
          },
          {
            slug: 'blockB',
            fields: [
              { name: 'b', type: 'text' },
              { name: 'c', type: 'text' },
            ],
          },
        ],
      }

      const valueToRow = { blockType: 'blockA' }
      const valueFromRow = { blockType: 'blockB' }

      const { fields } = getFieldsForRowComparison({
        field,
        valueToRow,
        valueFromRow,
        row: 0,
        baseVersionField: { fields: [], path: 'myBlocks', schemaPath: 'myBlocks', type: 'blocks' },
        config: {} as any,
      })

      // Should contain all unique fields from both blocks
      expect(fields).toEqual([
        { name: 'a', type: 'text' },
        { name: 'b', type: 'text' },
        { name: 'c', type: 'text' },
      ])
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: getFieldsForRowComparison.ts]---
Location: payload-main/packages/next/src/views/Version/RenderFieldsToDiff/utilities/getFieldsForRowComparison.ts

```typescript
import type {
  ArrayFieldClient,
  BaseVersionField,
  BlocksFieldClient,
  ClientBlock,
  ClientConfig,
  ClientField,
  VersionField,
} from 'payload'

import { getUniqueListBy } from 'payload/shared'

/**
 * Get the fields for a row in an iterable field for comparison.
 * - Array fields: the fields of the array field, because the fields are the same for each row.
 * - Blocks fields: the union of fields from the comparison and version row,
 *   because the fields from the version and comparison rows may differ.
 */
export function getFieldsForRowComparison({
  baseVersionField,
  config,
  field,
  row,
  valueFromRow,
  valueToRow,
}: {
  baseVersionField: BaseVersionField
  config: ClientConfig
  field: ArrayFieldClient | BlocksFieldClient
  row: number
  valueFromRow: any
  valueToRow: any
}): { fields: ClientField[]; versionFields: VersionField[] } {
  let fields: ClientField[] = []
  let versionFields: VersionField[] = []

  if (field.type === 'array' && 'fields' in field) {
    fields = field.fields
    versionFields = baseVersionField.rows?.length
      ? baseVersionField.rows[row]
      : baseVersionField.fields
  } else if (field.type === 'blocks') {
    if (valueToRow?.blockType === valueFromRow?.blockType) {
      const matchedBlock: ClientBlock =
        config?.blocksMap?.[valueToRow?.blockType] ??
        (((('blocks' in field || 'blockReferences' in field) &&
          (field.blockReferences ?? field.blocks)?.find(
            (block) => typeof block !== 'string' && block.slug === valueToRow?.blockType,
          )) || {
          fields: [],
        }) as ClientBlock)

      fields = matchedBlock.fields
      versionFields = baseVersionField.rows?.length
        ? baseVersionField.rows[row]
        : baseVersionField.fields
    } else {
      const matchedVersionBlock =
        config?.blocksMap?.[valueToRow?.blockType] ??
        (((('blocks' in field || 'blockReferences' in field) &&
          (field.blockReferences ?? field.blocks)?.find(
            (block) => typeof block !== 'string' && block.slug === valueToRow?.blockType,
          )) || {
          fields: [],
        }) as ClientBlock)

      const matchedComparisonBlock =
        config?.blocksMap?.[valueFromRow?.blockType] ??
        (((('blocks' in field || 'blockReferences' in field) &&
          (field.blockReferences ?? field.blocks)?.find(
            (block) => typeof block !== 'string' && block.slug === valueFromRow?.blockType,
          )) || {
          fields: [],
        }) as ClientBlock)

      fields = getUniqueListBy<ClientField>(
        [...matchedVersionBlock.fields, ...matchedComparisonBlock.fields],
        'name',
      )

      // buildVersionFields already merged the fields of the version and comparison rows together
      versionFields = baseVersionField.rows?.length
        ? baseVersionField.rows[row]
        : baseVersionField.fields
    }
  }

  return { fields, versionFields }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/Restore/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .restore-version {
    cursor: pointer;
    display: flex;
    min-width: max-content;

    .popup-button {
      display: flex;
    }

    &__chevron {
      background-color: var(--theme-elevation-150);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      cursor: pointer;

      .stroke {
        stroke-width: 1px;
      }

      &:hover {
        background: var(--theme-elevation-100);
      }
    }

    .btn {
      margin-block: 0;
    }

    &__restore-as-draft-button {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      margin-right: 2px;

      &:focus {
        border-radius: 0;
        outline-offset: 0;
      }
    }

    &__modal {
      @include blur-bg;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      &__toggle {
        @extend %btn-reset;
      }
    }

    &__wrapper {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: base(0.8);
      padding: base(2);
      max-width: base(36);
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: base(0.4);

      > * {
        margin: 0;
      }
    }

    &__controls {
      display: flex;
      gap: base(0.4);

      .btn {
        margin: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/next/src/views/Version/Restore/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { ClientCollectionConfig, ClientGlobalConfig, SanitizedCollectionConfig } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  Button,
  ConfirmationModal,
  PopupList,
  toast,
  useConfig,
  useModal,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui'
import { requests } from '@payloadcms/ui/shared'
import { useRouter } from 'next/navigation.js'
import { formatAdminURL } from 'payload/shared'

import './index.scss'

import React, { Fragment, useCallback, useState } from 'react'

const baseClass = 'restore-version'
const modalSlug = 'restore-version'

type Props = {
  className?: string
  collectionConfig?: ClientCollectionConfig
  globalConfig?: ClientGlobalConfig
  label: SanitizedCollectionConfig['labels']['singular']
  originalDocID: number | string
  status?: string
  versionDateFormatted: string
  versionID: string
}

export const Restore: React.FC<Props> = ({
  className,
  collectionConfig,
  globalConfig,
  label,
  originalDocID,
  status,
  versionDateFormatted,
  versionID,
}) => {
  const {
    config: {
      routes: { admin: adminRoute, api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const { toggleModal } = useModal()
  const router = useRouter()
  const { i18n, t } = useTranslation()
  const [draft, setDraft] = useState(false)
  const { startRouteTransition } = useRouteTransition()

  const restoreMessage = t('version:aboutToRestoreGlobal', {
    label: getTranslation(label, i18n),
    versionDate: versionDateFormatted,
  })

  const canRestoreAsDraft = status !== 'draft' && collectionConfig?.versions?.drafts

  const handleRestore = useCallback(async () => {
    let fetchURL = `${serverURL}${apiRoute}`
    let redirectURL: string

    if (collectionConfig) {
      fetchURL = `${fetchURL}/${collectionConfig.slug}/versions/${versionID}?draft=${draft}`
      redirectURL = formatAdminURL({
        adminRoute,
        path: `/collections/${collectionConfig.slug}/${originalDocID}`,
        serverURL,
      })
    }

    if (globalConfig) {
      fetchURL = `${fetchURL}/globals/${globalConfig.slug}/versions/${versionID}?draft=${draft}`
      redirectURL = formatAdminURL({
        adminRoute,
        path: `/globals/${globalConfig.slug}`,
        serverURL,
      })
    }

    const res = await requests.post(fetchURL, {
      headers: {
        'Accept-Language': i18n.language,
      },
    })

    if (res.status === 200) {
      const json = await res.json()
      toast.success(json.message)
      return startRouteTransition(() => router.push(redirectURL))
    } else {
      toast.error(t('version:problemRestoringVersion'))
    }
  }, [
    serverURL,
    apiRoute,
    collectionConfig,
    globalConfig,
    i18n.language,
    versionID,
    draft,
    adminRoute,
    originalDocID,
    startRouteTransition,
    router,
    t,
  ])

  return (
    <Fragment>
      <div className={[baseClass, className].filter(Boolean).join(' ')}>
        <Button
          buttonStyle="primary"
          className={[canRestoreAsDraft && `${baseClass}__restore-as-draft-button`]
            .filter(Boolean)
            .join(' ')}
          onClick={() => toggleModal(modalSlug)}
          size="xsmall"
          SubMenuPopupContent={
            canRestoreAsDraft
              ? () => (
                  <PopupList.ButtonGroup>
                    <PopupList.Button onClick={() => [setDraft(true), toggleModal(modalSlug)]}>
                      {t('version:restoreAsDraft')}
                    </PopupList.Button>
                  </PopupList.ButtonGroup>
                )
              : null
          }
        >
          {t('version:restoreThisVersion')}
        </Button>
      </div>
      <ConfirmationModal
        body={restoreMessage}
        confirmingLabel={t('version:restoring')}
        heading={t('version:confirmVersionRestoration')}
        modalSlug={modalSlug}
        onConfirm={handleRestore}
      />
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/next/src/views/Version/SelectComparison/index.scss

```text
@import '~@payloadcms/ui/scss';

@layer payload-default {
  .compare-version {
    &-moreVersions {
      color: var(--theme-elevation-500);
    }
  }
}
```

--------------------------------------------------------------------------------

````
