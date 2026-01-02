---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 221
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 221 of 695)

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

---[FILE: flattenTopLevelFields.spec.ts]---
Location: payload-main/packages/payload/src/utilities/flattenTopLevelFields.spec.ts

```typescript
import { I18nClient } from '@payloadcms/translations'
import { ClientField } from '../fields/config/client.js'
import { flattenTopLevelFields } from './flattenTopLevelFields.js'

describe('flattenFields', () => {
  const i18n: I18nClient = {
    t: (value: string) => value,
    language: 'en',
    dateFNS: {} as any,
    dateFNSKey: 'en-US',
    fallbackLanguage: 'en',
    translations: {},
  }

  const baseField: ClientField = {
    type: 'text',
    name: 'title',
    label: 'Title',
  }

  describe('basic flattening', () => {
    it('should return flat list for top-level fields', () => {
      const fields = [baseField]
      const result = flattenTopLevelFields(fields)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('title')
    })
  })

  describe('group flattening', () => {
    it('should flatten fields inside group with accessor and labelWithPrefix with moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          name: 'meta',
          label: 'Meta Info',
          fields: [
            {
              type: 'text',
              name: 'slug',
              label: 'Slug',
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(result).toHaveLength(2)
      expect(result[1].name).toBe('slug')
      expect(result[1].accessor).toBe('meta.slug')
      expect(result[1].labelWithPrefix).toBe('Meta Info > Slug')
    })

    it('should NOT flatten fields inside group without moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          name: 'meta',
          label: 'Meta Info',
          fields: [
            {
              type: 'text',
              name: 'slug',
              label: 'Slug',
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields)

      // Should return the group as a top-level item, not the inner field
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('meta')
      expect('fields' in result[0]).toBe(true)
      expect('accessor' in result[0]).toBe(false)
      expect('labelWithPrefix' in result[0]).toBe(false)
    })

    it('should correctly handle deeply nested group fields with and without moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          name: 'outer',
          label: 'Outer',
          fields: [
            {
              type: 'group',
              name: 'inner',
              label: 'Inner',
              fields: [
                {
                  type: 'text',
                  name: 'deep',
                  label: 'Deep Field',
                },
              ],
            },
          ],
        },
      ]

      const hoisted = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(hoisted).toHaveLength(3)
      expect(hoisted[2].name).toBe('deep')
      expect(hoisted[2].accessor).toBe('outer.inner.deep')
      expect(hoisted[2].labelWithPrefix).toBe('Outer > Inner > Deep Field')

      const nonHoisted = flattenTopLevelFields(fields)

      expect(nonHoisted).toHaveLength(1)
      expect(nonHoisted[0].name).toBe('outer')
      expect('fields' in nonHoisted[0]).toBe(true)
      expect('accessor' in nonHoisted[0]).toBe(false)
      expect('labelWithPrefix' in nonHoisted[0]).toBe(false)
    })

    it('should hoist fields from unnamed group if moveSubFieldsToTop is true', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          label: 'Unnamed group',
          fields: [
            {
              type: 'text',
              name: 'insideUnnamedGroup',
            },
          ],
        },
      ]

      const withExtract = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      // Should include top level group and its nested field as a top-level field
      expect(withExtract).toHaveLength(2)
      expect(withExtract[1].type).toBe('text')
      expect(withExtract[1].accessor).toBeUndefined()
      expect(withExtract[1].labelWithPrefix).toBeUndefined()

      const withoutExtract = flattenTopLevelFields(fields)

      // Should return the group as a top-level item, not the inner field
      expect(withoutExtract).toHaveLength(1)
      expect(withoutExtract[0].type).toBe('text')
      expect(withoutExtract[0].accessor).toBeUndefined()
      expect(withoutExtract[0].labelWithPrefix).toBeUndefined()
    })

    it('should hoist using deepest named group only if parents are unnamed', () => {
      const fields: ClientField[] = [
        {
          type: 'group',
          label: 'Outer',
          fields: [
            {
              type: 'group',
              label: 'Middle',
              fields: [
                {
                  type: 'group',
                  name: 'namedGroup',
                  label: 'Named Group',
                  fields: [
                    {
                      type: 'group',
                      label: 'Inner',
                      fields: [
                        {
                          type: 'text',
                          name: 'nestedField',
                          label: 'Nested Field',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const hoistedResult = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(hoistedResult).toHaveLength(5)
      expect(hoistedResult[4].name).toBe('nestedField')
      expect(hoistedResult[4].accessor).toBe('namedGroup.nestedField')
      expect(hoistedResult[4].labelWithPrefix).toBe('Named Group > Nested Field')

      const nonHoistedResult = flattenTopLevelFields(fields)

      expect(nonHoistedResult).toHaveLength(1)
      expect(nonHoistedResult[0].type).toBe('group')
      expect('fields' in nonHoistedResult[0]).toBe(true)
      expect('accessor' in nonHoistedResult[0]).toBe(false)
      expect('labelWithPrefix' in nonHoistedResult[0]).toBe(false)
    })
  })

  describe('array and block edge cases', () => {
    it('should NOT flatten fields in arrays or blocks with moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'array',
          name: 'items',
          label: 'Items',
          fields: [
            {
              type: 'text',
              name: 'label',
              label: 'Label',
            },
          ],
        },
        {
          type: 'blocks',
          name: 'layout',
          blocks: [
            {
              slug: 'block',
              fields: [
                {
                  type: 'text',
                  name: 'content',
                  label: 'Content',
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, { moveSubFieldsToTop: true })
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('items')
      expect(result[1].name).toBe('layout')
    })

    it('should NOT flatten fields in arrays or blocks without moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'array',
          name: 'things',
          label: 'Things',
          fields: [
            {
              type: 'text',
              name: 'thingLabel',
              label: 'Thing Label',
            },
          ],
        },
        {
          type: 'blocks',
          name: 'contentBlocks',
          blocks: [
            {
              slug: 'content',
              fields: [
                {
                  type: 'text',
                  name: 'body',
                  label: 'Body',
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields)
      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('things')
      expect(result[1].name).toBe('contentBlocks')
    })

    it('should not hoist group fields nested inside arrays', () => {
      const fields: ClientField[] = [
        {
          type: 'array',
          name: 'arrayField',
          label: 'Array Field',
          fields: [
            {
              type: 'group',
              name: 'groupInArray',
              label: 'Group In Array',
              fields: [
                {
                  type: 'text',
                  name: 'nestedInArrayGroup',
                  label: 'Nested In Array Group',
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, { moveSubFieldsToTop: true })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('arrayField')
    })

    it('should not hoist group fields nested inside blocks', () => {
      const fields: ClientField[] = [
        {
          type: 'blocks',
          name: 'blockField',
          blocks: [
            {
              slug: 'exampleBlock',
              fields: [
                {
                  type: 'group',
                  name: 'groupInBlock',
                  label: 'Group In Block',
                  fields: [
                    {
                      type: 'text',
                      name: 'nestedInBlockGroup',
                      label: 'Nested In Block Group',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, { moveSubFieldsToTop: true })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('blockField')
    })
  })

  describe('row and collapsible behavior', () => {
    it('should recursively flatten collapsible fields regardless of moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'collapsible',
          label: 'Collapsible',
          fields: [
            {
              type: 'text',
              name: 'nickname',
              label: 'Nickname',
            },
          ],
        },
      ]

      const defaultResult = flattenTopLevelFields(fields)
      const hoistedResult = flattenTopLevelFields(fields, { moveSubFieldsToTop: true })

      for (const result of [defaultResult, hoistedResult]) {
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('nickname')
        expect('accessor' in result[0]).toBe(false)
        expect('labelWithPrefix' in result[0]).toBe(false)
      }
    })

    it('should recursively flatten row fields regardless of moveSubFieldsToTop', () => {
      const fields: ClientField[] = [
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              name: 'firstName',
              label: 'First Name',
            },
            {
              type: 'text',
              name: 'lastName',
              label: 'Last Name',
            },
          ],
        },
      ]

      const defaultResult = flattenTopLevelFields(fields)
      const hoistedResult = flattenTopLevelFields(fields, { moveSubFieldsToTop: true })

      for (const result of [defaultResult, hoistedResult]) {
        expect(result).toHaveLength(2)
        expect(result[0].name).toBe('firstName')
        expect(result[1].name).toBe('lastName')
        expect('accessor' in result[0]).toBe(false)
        expect('labelWithPrefix' in result[0]).toBe(false)
      }
    })

    it('should hoist named group fields inside rows', () => {
      const fields: ClientField[] = [
        {
          type: 'row',
          fields: [
            {
              type: 'group',
              name: 'groupInRow',
              label: 'Group In Row',
              fields: [
                {
                  type: 'text',
                  name: 'nestedInRowGroup',
                  label: 'Nested In Row Group',
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(result).toHaveLength(2)
      expect(result[1].accessor).toBe('groupInRow.nestedInRowGroup')
      expect(result[1].labelWithPrefix).toBe('Group In Row > Nested In Row Group')
    })

    it('should hoist named group fields inside collapsibles', () => {
      const fields: ClientField[] = [
        {
          type: 'collapsible',
          label: 'Collapsible',
          fields: [
            {
              type: 'group',
              name: 'groupInCollapsible',
              label: 'Group In Collapsible',
              fields: [
                {
                  type: 'text',
                  name: 'nestedInCollapsibleGroup',
                  label: 'Nested In Collapsible Group',
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(fields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(result).toHaveLength(2)
      expect(result[1].accessor).toBe('groupInCollapsible.nestedInCollapsibleGroup')
      expect(result[1].labelWithPrefix).toBe('Group In Collapsible > Nested In Collapsible Group')
    })
  })

  describe('tab integration', () => {
    const namedTabFields: ClientField[] = [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Tab One',
            name: 'tabOne',
            fields: [
              {
                type: 'array',
                name: 'array',
                fields: [
                  {
                    type: 'text',
                    name: 'text',
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'arrayInRow',
                    type: 'array',
                    fields: [
                      {
                        name: 'textInArrayInRow',
                        type: 'text',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'text',
                name: 'textInTab',
                label: 'Text In Tab',
              },
              {
                type: 'group',
                name: 'groupInTab',
                label: 'Group In Tab',
                fields: [
                  {
                    type: 'text',
                    name: 'nestedTextInTabGroup',
                    label: 'Nested Text In Tab Group',
                  },
                ],
              },
            ],
          },
        ],
      },
    ]

    const unnamedTabFields: ClientField[] = [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Tab One',
            fields: [
              {
                type: 'array',
                name: 'array',
                fields: [
                  {
                    type: 'text',
                    name: 'text',
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'arrayInRow',
                    type: 'array',
                    fields: [
                      {
                        name: 'textInArrayInRow',
                        type: 'text',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'text',
                name: 'textInTab',
                label: 'Text In Tab',
              },
            ],
          },
        ],
      },
    ]

    it('should hoist named group fields inside unamed tabs when moveSubFieldsToTop is true', () => {
      const unnamedTabWithNamedGroup: ClientField[] = [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Tab One',
              fields: [
                {
                  type: 'group',
                  name: 'groupInTab',
                  label: 'Group In Tab',
                  fields: [
                    {
                      type: 'text',
                      name: 'nestedInTabGroup',
                      label: 'Nested In Tab Group',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const result = flattenTopLevelFields(unnamedTabWithNamedGroup, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(result).toHaveLength(2)
      expect(result[1].accessor).toBe('groupInTab.nestedInTabGroup')
      expect(result[1].labelWithPrefix).toBe('Group In Tab > Nested In Tab Group')
    })

    it('should hoist fields inside unnamed groups inside unnamed tabs when moveSubFieldsToTop is true', () => {
      const unnamedTabWithUnnamedGroup: ClientField[] = [
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Tab One',
              fields: [
                {
                  type: 'group',
                  label: 'Unnamed Group In Tab',
                  fields: [
                    {
                      type: 'text',
                      name: 'nestedInUnnamedGroup',
                      label: 'Nested In Unnamed Group',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const defaultResult = flattenTopLevelFields(unnamedTabWithUnnamedGroup)

      expect(defaultResult).toHaveLength(1)
      expect(defaultResult[0].type).toBe('text')
      expect(defaultResult[0].label).toBe('Nested In Unnamed Group')
      expect('accessor' in defaultResult[0]).toBe(false)
      expect('labelWithPrefix' in defaultResult[0]).toBe(false)

      const hoistedResult = flattenTopLevelFields(unnamedTabWithUnnamedGroup, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(hoistedResult).toHaveLength(2)
      const hoistedField = hoistedResult[1]
      expect(hoistedField.name).toBe('nestedInUnnamedGroup')
      expect(hoistedField.accessor).toBeUndefined()
      expect(hoistedField.labelWithPrefix).toBeUndefined()
    })

    it('should properly hoist fields inside named tabs when moveSubFieldsToTop is true', () => {
      const result = flattenTopLevelFields(namedTabFields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(result).toHaveLength(5)
      expect(result[0].accessor).toBe('tabOne.array')
      expect(result[0].labelWithPrefix).toBe('Tab One > array')
      expect(result[1].accessor).toBe('tabOne.arrayInRow')
      expect(result[1].labelWithPrefix).toBe('Tab One > arrayInRow')
      expect(result[2].accessor).toBe('tabOne.textInTab')
      expect(result[2].labelWithPrefix).toBe('Tab One > Text In Tab')
      expect(result[4].accessor).toBe('tabOne.groupInTab.nestedTextInTabGroup')
      expect(result[4].labelWithPrefix).toBe('Tab One > Group In Tab > Nested Text In Tab Group')
    })

    it('should NOT hoist fields inside named tabs when moveSubFieldsToTop is false', () => {
      const result = flattenTopLevelFields(namedTabFields)

      // We expect one top-level field: the tabs container itself is *not* hoisted
      expect(result).toHaveLength(1)

      const tabField = result[0]
      expect(tabField.type).toBe('tab')

      // Confirm nested fields are NOT hoisted: no accessors or labelWithPrefix at the top level
      expect('accessor' in tabField).toBe(false)
      expect('labelWithPrefix' in tabField).toBe(false)
    })

    it('should hoist fields inside unnamed tabs regardless of moveSubFieldsToTop', () => {
      const resultDefault = flattenTopLevelFields(unnamedTabFields)
      const resultHoisted = flattenTopLevelFields(unnamedTabFields, {
        moveSubFieldsToTop: true,
        i18n,
      })

      expect(resultDefault).toHaveLength(3)
      expect(resultHoisted).toHaveLength(3)
      expect(resultDefault).toEqual(resultHoisted)

      for (const field of resultDefault) {
        expect(field.accessor).toBeUndefined()
        expect(field.labelWithPrefix).toBeUndefined()
      }
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: flattenTopLevelFields.ts]---
Location: payload-main/packages/payload/src/utilities/flattenTopLevelFields.ts

```typescript
import type { I18nClient } from '@payloadcms/translations'

import { getTranslation } from '@payloadcms/translations'

import type { ClientTab } from '../admin/fields/Tabs.js'
import type { ClientField } from '../fields/config/client.js'
import type {
  Field,
  FieldAffectingData,
  FieldAffectingDataClient,
  FieldPresentationalOnly,
  FieldPresentationalOnlyClient,
  Tab,
} from '../fields/config/types.js'

import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsPresentationalOnly,
  tabHasName,
} from '../fields/config/types.js'

type FlattenedField<TField> = TField extends ClientField
  ? { accessor?: string; labelWithPrefix?: string } & (
      | FieldAffectingDataClient
      | FieldPresentationalOnlyClient
    )
  : { accessor?: string; labelWithPrefix?: string } & (FieldAffectingData | FieldPresentationalOnly)

type TabType<TField> = TField extends ClientField ? ClientTab : Tab

/**
 * Options to control how fields are flattened.
 */
type FlattenFieldsOptions = {
  /**
   * i18n context used for translating `label` values via `getTranslation`.
   */
  i18n?: I18nClient
  /**
   * If true, presentational-only fields (like UI fields) will be included
   * in the output. Otherwise, they will be skipped.
   * Default: false.
   */
  keepPresentationalFields?: boolean
  /**
   * A label prefix to prepend to translated labels when building `labelWithPrefix`.
   * Used recursively when flattening nested fields.
   */
  labelPrefix?: string
  /**
   * If true, nested fields inside `group` & `tabs` fields will be lifted to the top level
   * and given contextual `accessor` and `labelWithPrefix` values.
   * Default: false.
   */
  moveSubFieldsToTop?: boolean
  /**
   * A path prefix to prepend to field names when building the `accessor`.
   * Used recursively when flattening nested fields.
   */
  pathPrefix?: string
}

/**
 * Flattens a collection's fields into a single array of fields, optionally
 * extracting nested fields in group fields.
 *
 * @param fields - Array of fields to flatten
 * @param options - Options to control the flattening behavior
 */
export function flattenTopLevelFields<TField extends ClientField | Field>(
  fields: TField[] = [],
  options?: boolean | FlattenFieldsOptions,
): FlattenedField<TField>[] {
  const normalizedOptions: FlattenFieldsOptions =
    typeof options === 'boolean' ? { keepPresentationalFields: options } : (options ?? {})

  const {
    i18n,
    keepPresentationalFields,
    labelPrefix,
    moveSubFieldsToTop = false,
    pathPrefix,
  } = normalizedOptions

  return fields.reduce<FlattenedField<TField>[]>((acc, field) => {
    // If a group field has subfields and has a name, otherwise we catch it below along with collapsible and row fields
    if (field.type === 'group' && 'fields' in field) {
      if (moveSubFieldsToTop) {
        const isNamedGroup = 'name' in field && typeof field.name === 'string' && !!field.name
        const groupName = 'name' in field ? field.name : undefined

        const translatedLabel =
          'label' in field && field.label && i18n
            ? getTranslation(field.label as string, i18n)
            : undefined

        const labelWithPrefix = labelPrefix
          ? `${labelPrefix} > ${translatedLabel ?? groupName}`
          : (translatedLabel ?? groupName)

        const nameWithPrefix =
          'name' in field && field.name
            ? pathPrefix
              ? `${pathPrefix}.${field.name}`
              : field.name
            : pathPrefix

        acc.push(
          // Need to include the top-level group field when hoisting its subfields,
          // so that `buildColumnState` can detect and render a column if the group
          // has a custom admin Cell component defined in its configuration.
          // See: packages/ui/src/providers/TableColumns/buildColumnState/index.tsx
          field as FlattenedField<TField>,
          ...flattenTopLevelFields(field.fields as TField[], {
            i18n,
            keepPresentationalFields,
            labelPrefix: isNamedGroup ? labelWithPrefix : labelPrefix,
            moveSubFieldsToTop,
            pathPrefix: isNamedGroup ? nameWithPrefix : pathPrefix,
          }),
        )
      } else {
        if (fieldAffectsData(field)) {
          // Hoisting diabled - keep as top level field
          acc.push(field as FlattenedField<TField>)
        } else {
          acc.push(...flattenTopLevelFields(field.fields as TField[], options))
        }
      }
    } else if (field.type === 'tabs' && 'tabs' in field) {
      return [
        ...acc,
        ...field.tabs.reduce<FlattenedField<TField>[]>((tabFields, tab) => {
          if (tabHasName(tab)) {
            if (moveSubFieldsToTop) {
              const translatedLabel =
                'label' in tab && tab.label && i18n ? getTranslation(tab.label, i18n) : undefined

              const labelWithPrefixForTab = labelPrefix
                ? `${labelPrefix} > ${translatedLabel ?? tab.name}`
                : (translatedLabel ?? tab.name)

              const pathPrefixForTab = tab.name
                ? pathPrefix
                  ? `${pathPrefix}.${tab.name}`
                  : tab.name
                : pathPrefix

              return [
                ...tabFields,
                ...flattenTopLevelFields(tab.fields as TField[], {
                  i18n,
                  keepPresentationalFields,
                  labelPrefix: labelWithPrefixForTab,
                  moveSubFieldsToTop,
                  pathPrefix: pathPrefixForTab,
                }),
              ]
            } else {
              // Named tab, hoisting disabled: keep as top-level field
              return [
                ...tabFields,
                {
                  ...tab,
                  type: 'tab',
                } as unknown as FlattenedField<TField>,
              ]
            }
          } else {
            // Unnamed tab: always hoist its fields
            return [...tabFields, ...flattenTopLevelFields<TField>(tab.fields as TField[], options)]
          }
        }, []),
      ]
    } else if (fieldHasSubFields(field) && ['collapsible', 'row'].includes(field.type)) {
      // Recurse into row and collapsible
      acc.push(...flattenTopLevelFields(field.fields as TField[], options))
    } else if (
      fieldAffectsData(field) ||
      (keepPresentationalFields && fieldIsPresentationalOnly(field))
    ) {
      // Ignore nested `id` fields when inside nested structure
      if (field.name === 'id' && labelPrefix !== undefined) {
        return acc
      }

      const translatedLabel =
        'label' in field && field.label && i18n ? getTranslation(field.label, i18n) : undefined

      const name = 'name' in field ? field.name : undefined

      const isHoistingFromGroup = pathPrefix !== undefined || labelPrefix !== undefined

      acc.push({
        ...(field as FlattenedField<TField>),
        ...(moveSubFieldsToTop &&
          isHoistingFromGroup && {
            accessor: pathPrefix && name ? `${pathPrefix}.${name}` : (name ?? ''),
            labelWithPrefix: labelPrefix
              ? `${labelPrefix} > ${translatedLabel ?? name}`
              : (translatedLabel ?? name),
          }),
      })
    }

    return acc
  }, [])
}
```

--------------------------------------------------------------------------------

---[FILE: formatAdminURL.spec.ts]---
Location: payload-main/packages/payload/src/utilities/formatAdminURL.spec.ts

```typescript
import { formatAdminURL } from './formatAdminURL.js'

describe('formatAdminURL', () => {
  const serverURL = 'https://example.com'

  const defaultAdminRoute = '/admin'
  const rootAdminRoute = '/'

  const dummyPath = '/collections/posts'

  describe('relative URLs', () => {
    it('should ignore `serverURL` when relative=true', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: dummyPath,
        serverURL,
        relative: true,
      })

      expect(result).toBe(`${defaultAdminRoute}${dummyPath}`)
    })

    it('should force relative URL when `serverURL` is omitted', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: dummyPath,
        relative: false,
      })

      expect(result).toBe(`${defaultAdminRoute}${dummyPath}`)
    })
  })

  describe('absolute URLs', () => {
    it('should return absolute URL with serverURL', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: dummyPath,
        serverURL,
      })

      expect(result).toBe(`${serverURL}${defaultAdminRoute}${dummyPath}`)
    })

    it('should handle serverURL with trailing slash', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: '/collections/posts',
        serverURL: 'https://example.com/',
      })

      expect(result).toBe('https://example.com/admin/collections/posts')
    })

    it('should handle serverURL with subdirectory', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: '/collections/posts',
        serverURL: 'https://example.com/api/v1',
      })

      expect(result).toBe('https://example.com/admin/collections/posts')
    })
  })

  describe('admin route handling', () => {
    it('should return relative URL for adminRoute="/", no path, no `serverURL`', () => {
      const result = formatAdminURL({
        adminRoute: rootAdminRoute,
        relative: true,
      })

      expect(result).toBe('/')
    })

    it('should handle relative URL for adminRoute="/", with path, no `serverURL`', () => {
      const result = formatAdminURL({
        adminRoute: rootAdminRoute,
        path: dummyPath,
        relative: true,
      })

      expect(result).toBe(dummyPath)
    })

    it('should return absolute URL for adminRoute="/", no path, with `serverURL`', () => {
      const result = formatAdminURL({
        adminRoute: rootAdminRoute,
        serverURL,
      })

      expect(result).toBe('https://example.com/')
    })

    it('should handle absolute URL for adminRoute="/", with path and `serverURL`', () => {
      const result = formatAdminURL({
        adminRoute: rootAdminRoute,
        serverURL,
        path: dummyPath,
      })

      expect(result).toBe(`${serverURL}${dummyPath}`)
    })
  })

  describe('base path handling', () => {
    it('should include basePath in URL', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        basePath: '/v1',
        path: dummyPath,
        serverURL,
      })

      expect(result).toBe(`${serverURL}/v1${defaultAdminRoute}${dummyPath}`)
    })

    it('should handle basePath with adminRoute="/"', () => {
      const result = formatAdminURL({
        adminRoute: rootAdminRoute,
        basePath: '/v1',
        serverURL,
      })

      expect(result).toBe(`${serverURL}/v1`)
    })

    it('should handle basePath with no adminRoute', () => {
      const result = formatAdminURL({
        adminRoute: undefined,
        basePath: '/v1',
        path: dummyPath,
        serverURL,
      })

      expect(result).toBe(`${serverURL}/v1${dummyPath}`)
    })

    it('should handle empty basePath', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        basePath: '',
        path: dummyPath,
        serverURL,
      })

      expect(result).toBe(`${serverURL}${defaultAdminRoute}${dummyPath}`)
    })
  })

  describe('path handling', () => {
    it('should handle empty string path', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: '',
        serverURL,
      })

      expect(result).toBe(`${serverURL}${defaultAdminRoute}`)
    })

    it('should handle null path', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: null,
        serverURL,
      })
      expect(result).toBe(`${serverURL}${defaultAdminRoute}`)
    })

    it('should handle undefined path', () => {
      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path: undefined,
        serverURL,
      })

      expect(result).toBe(`${serverURL}${defaultAdminRoute}`)
    })

    it('should handle path with query parameters', () => {
      const path = `${dummyPath}?page=2`

      const result = formatAdminURL({
        adminRoute: defaultAdminRoute,
        path,
        serverURL,
      })

      expect(result).toBe(`${serverURL}${defaultAdminRoute}${path}`)
    })
  })

  describe('edge cases', () => {
    it('should return "/" when given minimal args', () => {
      const result = formatAdminURL({
        adminRoute: undefined,
        basePath: '',
        path: '',
        relative: true,
      })

      expect(result).toBe('/')
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: formatAdminURL.ts]---
Location: payload-main/packages/payload/src/utilities/formatAdminURL.ts

```typescript
import type { Config } from '../config/types.js'

/**
 * This function builds correct URLs for admin panel routing.
 * Its primary responsibilities are:
 * 1. Read from your `routes.admin` config and appropriately handle `"/"` admin paths
 * 2. Prepend the `basePath` from your Next.js config, if specified
 * 3. Return relative or absolute URLs, as needed
 */
export const formatAdminURL = (
  args: {
    adminRoute: NonNullable<Config['routes']>['admin']
    /**
     * The subpath of your application, if specified.
     * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
     * @example '/docs'
     */
    basePath?: string
    path?: '' | `/${string}` | null
    /**
     * Return a relative URL, e.g. ignore `serverURL`.
     * Useful for route-matching, etc.
     */
    relative?: boolean
  } & Pick<Config, 'serverURL'>,
): string => {
  const { adminRoute, basePath = '', path = '', relative = false, serverURL } = args

  const pathSegments = [basePath]

  if (adminRoute && adminRoute !== '/') {
    pathSegments.push(adminRoute)
  }

  if (path && !(adminRoute === '/' && !path)) {
    pathSegments.push(path)
  }

  const pathname = pathSegments.join('') || '/'

  if (relative || !serverURL) {
    return pathname
  }

  return new URL(pathname, serverURL).toString()
}
```

--------------------------------------------------------------------------------

---[FILE: formatApiURL.ts]---
Location: payload-main/packages/payload/src/utilities/formatApiURL.ts

```typescript
import type { Config } from '../config/types.js'

import { formatAdminURL } from './formatAdminURL.js'

/** Will read the `routes.api` config and appropriately handle `"/"` api paths */
export const formatApiURL = (args: {
  apiRoute: NonNullable<Config['routes']>['api']
  basePath?: string
  path: '' | `/${string}` | null | undefined
  serverURL: Config['serverURL']
}): string => {
  return formatAdminURL({
    adminRoute: args.apiRoute,
    basePath: args.basePath,
    path: args.path,
    serverURL: args.serverURL,
  })
}
```

--------------------------------------------------------------------------------

---[FILE: formatErrors.ts]---
Location: payload-main/packages/payload/src/utilities/formatErrors.ts

```typescript
import type { ErrorResult } from '../config/types.js'
import type { APIError } from '../errors/APIError.js'

import { APIErrorName } from '../errors/APIError.js'
import { ValidationErrorName } from '../errors/ValidationError.js'

export const formatErrors = (incoming: { [key: string]: unknown } | APIError): ErrorResult => {
  if (incoming) {
    // Cannot use `instanceof` to check error type: https://github.com/microsoft/TypeScript/issues/13965
    // Instead, get the prototype of the incoming error and check its constructor name
    const proto = Object.getPrototypeOf(incoming)

    // Payload 'ValidationError' and 'APIError'
    if (
      (proto.constructor.name === ValidationErrorName || proto.constructor.name === APIErrorName) &&
      incoming.data
    ) {
      return {
        errors: [
          {
            name: incoming.name,
            data: incoming.data,
            message: incoming.message,
          },
        ],
      }
    }

    // Mongoose 'ValidationError': https://mongoosejs.com/docs/api/error.html#Error.ValidationError
    if (proto.constructor.name === ValidationErrorName && 'errors' in incoming && incoming.errors) {
      return {
        errors: Object.keys(incoming.errors).reduce(
          (acc, key) => {
            acc.push({
              field: (incoming.errors as any)[key].path,
              message: (incoming.errors as any)[key].message,
            })
            return acc
          },
          [] as { field: string; message: string }[],
        ),
      }
    }

    if (Array.isArray(incoming.message)) {
      return {
        errors: incoming.message,
      }
    }

    if (incoming.name) {
      return {
        errors: [
          {
            message: incoming.message,
          },
        ],
      }
    }
  }

  return {
    errors: [
      {
        message: 'An unknown error occurred.',
      },
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: formatLabels.spec.ts]---
Location: payload-main/packages/payload/src/utilities/formatLabels.spec.ts

```typescript
import { formatLabels, toWords } from './formatLabels'

describe('formatLabels', () => {
  it('should format singular slug', () => {
    expect(formatLabels('word')).toMatchObject({
      plural: 'Words',
      singular: 'Word',
    })
  })

  it('should format plural slug', () => {
    expect(formatLabels('words')).toMatchObject({
      plural: 'Words',
      singular: 'Word',
    })
  })

  it('should format kebab case', () => {
    expect(formatLabels('my-slugs')).toMatchObject({
      plural: 'My Slugs',
      singular: 'My Slug',
    })
  })

  it('should format camelCase', () => {
    expect(formatLabels('camelCaseItems')).toMatchObject({
      plural: 'Camel Case Items',
      singular: 'Camel Case Item',
    })
  })

  describe('toWords', () => {
    it('should convert camel to capitalized words', () => {
      expect(toWords('camelCaseItems')).toBe('Camel Case Items')
    })

    it('should allow no separator (used for building GraphQL label from name)', () => {
      expect(toWords('myGraphField', true)).toBe('MyGraphField')
    })
  })
})
```

--------------------------------------------------------------------------------

````
