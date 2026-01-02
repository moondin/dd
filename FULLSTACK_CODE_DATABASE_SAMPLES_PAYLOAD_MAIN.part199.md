---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 199
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 199 of 695)

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

---[FILE: defaultTimezones.ts]---
Location: payload-main/packages/payload/src/fields/baseFields/timezone/defaultTimezones.ts

```typescript
import type { Timezone } from '../../../config/types.js'

/**
 * List of supported timezones
 *
 * label: UTC offset and location
 * value: IANA timezone name
 *
 * @example
 * { label: '(UTC-12:00) International Date Line West', value: 'Dateline Standard Time' }
 */
export const defaultTimezones: Timezone[] = [
  { label: '(UTC-11:00) Midway Island, Samoa', value: 'Pacific/Midway' },
  { label: '(UTC-11:00) Niue', value: 'Pacific/Niue' },
  { label: '(UTC-10:00) Hawaii', value: 'Pacific/Honolulu' },
  { label: '(UTC-10:00) Cook Islands', value: 'Pacific/Rarotonga' },
  { label: '(UTC-09:00) Alaska', value: 'America/Anchorage' },
  { label: '(UTC-09:00) Gambier Islands', value: 'Pacific/Gambier' },
  { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
  { label: '(UTC-08:00) Tijuana, Baja California', value: 'America/Tijuana' },
  { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
  { label: '(UTC-07:00) Arizona (No DST)', value: 'America/Phoenix' },
  { label: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
  { label: '(UTC-06:00) Central America', value: 'America/Guatemala' },
  { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
  { label: '(UTC-05:00) Bogota, Lima, Quito', value: 'America/Bogota' },
  { label: '(UTC-04:00) Caracas', value: 'America/Caracas' },
  { label: '(UTC-04:00) Santiago', value: 'America/Santiago' },
  { label: '(UTC-03:00) Buenos Aires', value: 'America/Buenos_Aires' },
  { label: '(UTC-03:00) Brasilia', value: 'America/Sao_Paulo' },
  { label: '(UTC-02:00) South Georgia', value: 'Atlantic/South_Georgia' },
  { label: '(UTC-01:00) Azores', value: 'Atlantic/Azores' },
  { label: '(UTC-01:00) Cape Verde', value: 'Atlantic/Cape_Verde' },
  { label: '(UTC+00:00) London (GMT)', value: 'Europe/London' },
  { label: '(UTC+01:00) Berlin, Paris', value: 'Europe/Berlin' },
  { label: '(UTC+01:00) Lagos', value: 'Africa/Lagos' },
  { label: '(UTC+02:00) Athens, Bucharest', value: 'Europe/Athens' },
  { label: '(UTC+02:00) Cairo', value: 'Africa/Cairo' },
  { label: '(UTC+03:00) Moscow, St. Petersburg', value: 'Europe/Moscow' },
  { label: '(UTC+03:00) Riyadh', value: 'Asia/Riyadh' },
  { label: '(UTC+04:00) Dubai', value: 'Asia/Dubai' },
  { label: '(UTC+04:00) Baku', value: 'Asia/Baku' },
  { label: '(UTC+05:00) Islamabad, Karachi', value: 'Asia/Karachi' },
  { label: '(UTC+05:00) Tashkent', value: 'Asia/Tashkent' },
  { label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', value: 'Asia/Calcutta' },
  { label: '(UTC+06:00) Dhaka', value: 'Asia/Dhaka' },
  { label: '(UTC+06:00) Almaty', value: 'Asia/Almaty' },
  { label: '(UTC+07:00) Jakarta', value: 'Asia/Jakarta' },
  { label: '(UTC+07:00) Bangkok', value: 'Asia/Bangkok' },
  { label: '(UTC+08:00) Beijing, Shanghai', value: 'Asia/Shanghai' },
  { label: '(UTC+08:00) Singapore', value: 'Asia/Singapore' },
  { label: '(UTC+09:00) Tokyo, Osaka, Sapporo', value: 'Asia/Tokyo' },
  { label: '(UTC+09:00) Seoul', value: 'Asia/Seoul' },
  { label: '(UTC+10:00) Brisbane', value: 'Australia/Brisbane' },
  { label: '(UTC+10:00) Sydney, Melbourne', value: 'Australia/Sydney' },
  { label: '(UTC+10:00) Guam, Port Moresby', value: 'Pacific/Guam' },
  { label: '(UTC+11:00) New Caledonia', value: 'Pacific/Noumea' },
  { label: '(UTC+12:00) Auckland, Wellington', value: 'Pacific/Auckland' },
  { label: '(UTC+12:00) Fiji', value: 'Pacific/Fiji' },
]
```

--------------------------------------------------------------------------------

---[FILE: client.ts]---
Location: payload-main/packages/payload/src/fields/config/client.ts

```typescript
// @ts-strict-ignore
/* eslint-disable perfectionist/sort-switch-case */
// Keep perfectionist/sort-switch-case disabled - it incorrectly messes up the ordering of the switch cases, causing it to break
import type { I18nClient, TFunction } from '@payloadcms/translations'

import type {
  AdminClient,
  ArrayFieldClient,
  Block,
  BlockJSX,
  BlocksFieldClient,
  ClientBlock,
  ClientField,
  Field,
  FieldBase,
  JoinFieldClient,
  LabelsClient,
  RadioFieldClient,
  RowFieldClient,
  SelectFieldClient,
  TabsFieldClient,
} from '../../fields/config/types.js'
import type { Payload } from '../../types/index.js'

import { getFromImportMap } from '../../bin/generateImportMap/utilities/getFromImportMap.js'
import { MissingEditorProp } from '../../errors/MissingEditorProp.js'
import { fieldAffectsData } from '../../fields/config/types.js'
import { flattenTopLevelFields, type ImportMap } from '../../index.js'

// Should not be used - ClientField should be used instead. This is why we don't export ClientField, we don't want people
// to accidentally use it instead of ClientField and get confused

export { ClientField }

export type ServerOnlyFieldProperties =
  | 'dbName' // can be a function
  | 'editor' // This is a `richText` only property
  | 'enumName' // can be a function
  | 'filterOptions' // This is a `relationship`, `upload`, and `select` only property
  | 'graphQL'
  | 'label'
  | 'typescriptSchema'
  | 'validate'
  | keyof Pick<FieldBase, 'access' | 'custom' | 'defaultValue' | 'hooks'>

export type ServerOnlyFieldAdminProperties = keyof Pick<
  FieldBase['admin'],
  // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
  'components' | 'condition'
>

const serverOnlyFieldProperties: Partial<ServerOnlyFieldProperties>[] = [
  'hooks',
  'access',
  'validate',
  'defaultValue',
  'filterOptions', // This is a `relationship`, `upload`, and `select` only property
  'editor', // This is a `richText` only property
  'custom',
  'typescriptSchema',
  'dbName', // can be a function
  'enumName', // can be a function
  'graphQL', // client does not need graphQL
  // the following props are handled separately (see below):
  // `label`
  // `fields`
  // `blocks`
  // `tabs`
  // `admin`
]

const serverOnlyFieldAdminProperties: Partial<ServerOnlyFieldAdminProperties>[] = [
  'condition',
  'components',
]

type FieldWithDescription = {
  admin: AdminClient
} & ClientField

export const createClientBlocks = ({
  blocks,
  defaultIDType,
  i18n,
  importMap,
}: {
  blocks: (Block | string)[]
  defaultIDType: Payload['config']['db']['defaultIDType']
  i18n: I18nClient
  importMap: ImportMap
}): (ClientBlock | string)[] | ClientBlock[] => {
  const clientBlocks: (ClientBlock | string)[] = []
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!

    if (typeof block === 'string') {
      // Do not process blocks that are just strings - they are processed once in the client config
      clientBlocks.push(block)
      continue
    }

    const clientBlock: ClientBlock = {
      slug: block.slug,
      fields: [],
    }
    if (block.imageAltText) {
      clientBlock.imageAltText = block.imageAltText
    }
    if (block.imageURL) {
      clientBlock.imageURL = block.imageURL
    }

    if (block.admin?.custom || block.admin?.group) {
      // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
      clientBlock.admin = {}
      if (block.admin.custom) {
        clientBlock.admin!.custom = block.admin.custom
      }
      if (block.admin.group) {
        clientBlock.admin!.group = block.admin.group
      }
    }

    if (block?.admin?.jsx) {
      const jsxResolved = getFromImportMap<BlockJSX>({
        importMap,
        PayloadComponent: block.admin.jsx,
        schemaPath: '',
      })
      clientBlock.jsx = jsxResolved
    }

    if (block?.admin?.disableBlockName) {
      // Check for existing admin object, this way we don't have to spread it in
      if (clientBlock.admin) {
        clientBlock.admin.disableBlockName = block.admin.disableBlockName
      } else {
        // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
        clientBlock.admin = { disableBlockName: block.admin.disableBlockName }
      }
    }

    if (block.labels) {
      clientBlock.labels = {} as unknown as LabelsClient

      if (block.labels.singular) {
        if (typeof block.labels.singular === 'function') {
          clientBlock.labels.singular = block.labels.singular({ i18n, t: i18n.t as TFunction })
        } else {
          clientBlock.labels.singular = block.labels.singular
        }
        if (typeof block.labels.plural === 'function') {
          clientBlock.labels.plural = block.labels.plural({ i18n, t: i18n.t as TFunction })
        } else {
          clientBlock.labels.plural = block.labels.plural
        }
      }
    }

    clientBlock.fields = createClientFields({
      defaultIDType,
      fields: block.fields,
      i18n,
      importMap,
    })

    clientBlocks.push(clientBlock)
  }

  return clientBlocks
}

export const createClientField = ({
  defaultIDType,
  field: incomingField,
  i18n,
  importMap,
}: {
  defaultIDType: Payload['config']['db']['defaultIDType']
  field: Field
  i18n: I18nClient
  importMap: ImportMap
}): ClientField => {
  const clientField: ClientField = {} as ClientField

  for (const key in incomingField) {
    if (serverOnlyFieldProperties.includes(key as any)) {
      continue
    }

    switch (key) {
      case 'admin':
        if (!incomingField.admin) {
          break
        }

        clientField.admin = {} as AdminClient

        for (const adminKey in incomingField.admin) {
          if (serverOnlyFieldAdminProperties.includes(adminKey as any)) {
            continue
          }

          switch (adminKey) {
            case 'description':
              if ('description' in incomingField.admin) {
                if (typeof incomingField.admin?.description !== 'function') {
                  ;(clientField as FieldWithDescription).admin.description =
                    incomingField.admin.description
                }
              }

              break

            default:
              ;(clientField.admin as any)[adminKey] =
                incomingField.admin[adminKey as keyof typeof incomingField.admin]
          }
        }

        break

      case 'blocks':
      case 'fields':
      case 'tabs':
        // Skip - we handle sub-fields in the switch below
        break

      case 'options':
        // Skip - we handle options in the radio/select switch below to avoid mutating the global config
        break

      case 'label':
        //@ts-expect-error - would need to type narrow
        if (typeof incomingField.label === 'function') {
          //@ts-expect-error - would need to type narrow
          clientField.label = incomingField.label({ i18n, t: i18n.t })
        } else {
          //@ts-expect-error - would need to type narrow
          clientField.label = incomingField.label
        }

        break

      default:
        ;(clientField as any)[key] = incomingField[key as keyof Field]
    }
  }

  switch (incomingField.type) {
    case 'array': {
      if (incomingField.labels) {
        const field = clientField as unknown as ArrayFieldClient

        field.labels = {} as unknown as LabelsClient

        if (incomingField.labels.singular) {
          if (typeof incomingField.labels.singular === 'function') {
            field.labels.singular = incomingField.labels.singular({ i18n, t: i18n.t as TFunction })
          } else {
            field.labels.singular = incomingField.labels.singular
          }
          if (typeof incomingField.labels.plural === 'function') {
            field.labels.plural = incomingField.labels.plural({ i18n, t: i18n.t as TFunction })
          } else {
            field.labels.plural = incomingField.labels.plural
          }
        }
      }
    }
    // falls through
    case 'collapsible':
    case 'group':
    case 'row': {
      const field = clientField as unknown as RowFieldClient

      if (!field.fields) {
        field.fields = []
      }

      field.fields = createClientFields({
        defaultIDType,
        disableAddingID: incomingField.type !== 'array',
        fields: incomingField.fields,
        i18n,
        importMap,
      })

      break
    }

    case 'blocks': {
      const field = clientField as unknown as BlocksFieldClient

      if (incomingField.labels) {
        field.labels = {} as unknown as LabelsClient

        if (incomingField.labels.singular) {
          if (typeof incomingField.labels.singular === 'function') {
            field.labels.singular = incomingField.labels.singular({ i18n, t: i18n.t as TFunction })
          } else {
            field.labels.singular = incomingField.labels.singular
          }
          if (typeof incomingField.labels.plural === 'function') {
            field.labels.plural = incomingField.labels.plural({ i18n, t: i18n.t as TFunction })
          } else {
            field.labels.plural = incomingField.labels.plural
          }
        }
      }

      if (incomingField.blockReferences?.length) {
        field.blockReferences = createClientBlocks({
          blocks: incomingField.blockReferences,
          defaultIDType,
          i18n,
          importMap,
        })
      }

      if (incomingField.blocks?.length) {
        field.blocks = createClientBlocks({
          blocks: incomingField.blocks,
          defaultIDType,
          i18n,
          importMap,
        }) as ClientBlock[]
      }

      break
    }

    case 'join': {
      const field = clientField as JoinFieldClient

      field.targetField = {
        relationTo: field.targetField?.relationTo,
      }

      break
    }

    case 'radio':
    // falls through
    case 'select': {
      const field = clientField as RadioFieldClient | SelectFieldClient

      if (incomingField.options?.length) {
        field.options = [] // Create new array to avoid mutating global config

        for (let i = 0; i < incomingField.options.length; i++) {
          const option = incomingField.options[i]

          if (typeof option === 'object' && typeof option.label === 'function') {
            field.options[i] = {
              label: option.label({ i18n, t: i18n.t as TFunction }),
              value: option.value,
            }
          } else if (typeof option === 'object') {
            field.options[i] = {
              label: option.label,
              value: option.value,
            }
          } else if (typeof option === 'string') {
            field.options[i] = option
          }
        }
      }

      break
    }

    case 'richText': {
      if (!incomingField?.editor) {
        throw new MissingEditorProp(incomingField) // while we allow disabling editor functionality, you should not have any richText fields defined if you do not have an editor
      }

      if (typeof incomingField?.editor === 'function') {
        throw new Error('Attempted to access unsanitized rich text editor.')
      }

      break
    }

    case 'tabs': {
      const field = clientField as unknown as TabsFieldClient

      if (incomingField.tabs?.length) {
        field.tabs = []

        for (let i = 0; i < incomingField.tabs.length; i++) {
          const tab = incomingField.tabs[i]
          const clientTab = {} as unknown as TabsFieldClient['tabs'][0]

          for (const key in tab) {
            if (serverOnlyFieldProperties.includes(key as any)) {
              continue
            }

            const tabProp = tab[key as keyof typeof tab]

            if (key === 'fields') {
              clientTab.fields = createClientFields({
                defaultIDType,
                disableAddingID: true,
                fields: tab.fields,
                i18n,
                importMap,
              })
            } else if (
              (key === 'label' || key === 'description') &&
              typeof tabProp === 'function'
            ) {
              // @ts-expect-error - vestiges of when tsconfig was not strict. Feel free to improve
              clientTab[key] = tabProp({ t: i18n.t })
            } else if (key === 'admin') {
              clientTab.admin = {} as AdminClient

              for (const adminKey in tab.admin) {
                if (serverOnlyFieldAdminProperties.includes(adminKey as any)) {
                  continue
                }

                switch (adminKey) {
                  case 'description':
                    if ('description' in tab.admin) {
                      if (typeof tab.admin?.description === 'function') {
                        clientTab.admin.description = tab.admin.description({
                          i18n,
                          t: i18n.t as TFunction,
                        })
                      } else {
                        clientTab.admin.description = tab.admin.description
                      }
                    }

                    break

                  default:
                    ;(clientTab.admin as any)[adminKey] =
                      tab.admin[adminKey as keyof typeof tab.admin]
                }
              }
            } else {
              ;(clientTab as any)[key] = tabProp
            }
          }
          field.tabs[i] = clientTab
        }
      }

      break
    }

    default:
      break
  }

  return clientField
}

export const createClientFields = ({
  defaultIDType,
  disableAddingID,
  fields,
  i18n,
  importMap,
}: {
  defaultIDType: Payload['config']['db']['defaultIDType']
  disableAddingID?: boolean
  fields: Field[]
  i18n: I18nClient
  importMap: ImportMap
}): ClientField[] => {
  const clientFields: ClientField[] = []

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]!

    const clientField = createClientField({
      defaultIDType,
      field,
      i18n,
      importMap,
    })

    clientFields.push(clientField)
  }

  const hasID = flattenTopLevelFields(fields).some((f) => fieldAffectsData(f) && f.name === 'id')

  if (!disableAddingID && !hasID) {
    clientFields.push({
      name: 'id',
      type: defaultIDType,
      admin: {
        description: 'The unique identifier for this document',
        disableBulkEdit: true,
        disabled: true,
        hidden: true,
      },
      hidden: true,
      label: 'ID',
    } as ClientField)
  }

  return clientFields
}
```

--------------------------------------------------------------------------------

---[FILE: reservedFieldNames.spec.ts]---
Location: payload-main/packages/payload/src/fields/config/reservedFieldNames.spec.ts

```typescript
import type { Config } from '../../config/types.js'
import type { CollectionConfig, Field } from '../../index.js'

import { ReservedFieldName } from '../../errors/index.js'
import { sanitizeCollection } from '../../collections/config/sanitize.js'

describe('reservedFieldNames - collections -', () => {
  const config = {
    collections: [],
    globals: [],
  } as Partial<Config>

  describe('uploads -', () => {
    const collectionWithUploads: CollectionConfig = {
      slug: 'collection-with-uploads',
      fields: [],
      upload: true,
    }

    it('should throw on file', async () => {
      const fields: Field[] = [
        {
          name: 'file',
          type: 'text',
          label: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeCollection(
          // @ts-expect-error
          {
            ...config,
            collections: [
              {
                ...collectionWithUploads,
                fields,
              },
            ],
          },
          {
            ...collectionWithUploads,
            fields,
          },
        )
      }).rejects.toThrow(ReservedFieldName)
    })

    it('should not throw on a custom field', async () => {
      const fields: Field[] = [
        {
          name: 'customField',
          type: 'text',
          label: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeCollection(
          // @ts-expect-error
          {
            ...config,
            collections: [
              {
                ...collectionWithUploads,
                fields,
              },
            ],
          },
          {
            ...collectionWithUploads,
            fields,
          },
        )
      }).not.toThrow()
    })
  })

  describe('auth -', () => {
    const collectionWithAuth: CollectionConfig = {
      slug: 'collection-with-auth',
      auth: {
        loginWithUsername: true,
        useAPIKey: true,
        verify: true,
      },
      fields: [],
    }

    it('should throw on hash', async () => {
      const fields: Field[] = [
        {
          name: 'hash',
          type: 'text',
          label: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeCollection(
          // @ts-expect-error
          {
            ...config,
            collections: [
              {
                ...collectionWithAuth,
                fields,
              },
            ],
          },
          {
            ...collectionWithAuth,
            fields,
          },
        )
      }).rejects.toThrow(ReservedFieldName)
    })

    it('should throw on salt', async () => {
      const fields: Field[] = [
        {
          name: 'salt',
          type: 'text',
          label: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeCollection(
          // @ts-expect-error
          {
            ...config,
            collections: [
              {
                ...collectionWithAuth,
                fields,
              },
            ],
          },
          {
            ...collectionWithAuth,
            fields,
          },
        )
      }).rejects.toThrow(ReservedFieldName)
    })

    it('should not throw on a custom field', async () => {
      const fields: Field[] = [
        {
          name: 'customField',
          type: 'text',
          label: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeCollection(
          // @ts-expect-error
          {
            ...config,
            collections: [
              {
                ...collectionWithAuth,
                fields,
              },
            ],
          },
          {
            ...collectionWithAuth,
            fields,
          },
        )
      }).not.toThrow()
    })
  })
})
```

--------------------------------------------------------------------------------

---[FILE: reservedFieldNames.ts]---
Location: payload-main/packages/payload/src/fields/config/reservedFieldNames.ts

```typescript
/**
 * Reserved field names for collections with auth config enabled
 */
export const reservedBaseAuthFieldNames = [
  /* 'email',
    'resetPasswordToken',
    'resetPasswordExpiration', */
  'salt',
  'hash',
]

/**
 * Reserved field names for auth collections with verify: true
 */
export const reservedVerifyFieldNames = [
  /* '_verified', '_verificationToken' */
]

/**
 * Reserved field names for auth collections with useApiKey: true
 */
export const reservedAPIKeyFieldNames = [
  /* 'enableAPIKey', 'apiKeyIndex', 'apiKey' */
]

/**
 * Reserved field names for collections with upload config enabled
 */
export const reservedBaseUploadFieldNames = [
  'file',
  /* 'mimeType',
    'thumbnailURL',
    'width',
    'height',
    'filesize',
    'filename',
    'url',
    'focalX',
    'focalY',
    'sizes', */
]

/**
 * Reserved field names for collections with versions enabled
 */
export const reservedVersionsFieldNames = [
  /* '__v', '_status' */
]
```

--------------------------------------------------------------------------------

---[FILE: sanitize.spec.ts]---
Location: payload-main/packages/payload/src/fields/config/sanitize.spec.ts

```typescript
import type { Config } from '../../config/types.js'
import type {
  ArrayField,
  Block,
  BlocksField,
  CheckboxField,
  Field,
  NumberField,
  TextField,
} from './types.js'

import {
  DuplicateFieldName,
  InvalidFieldName,
  InvalidFieldRelationship,
  MissingFieldType,
} from '../../errors/index.js'
import { sanitizeFields } from './sanitize.js'
import { CollectionConfig } from '../../index.js'

describe('sanitizeFields', () => {
  const config = {} as Config
  const collectionConfig = {} as CollectionConfig

  it('should throw on missing type field', async () => {
    const fields: Field[] = [
      // @ts-expect-error
      {
        name: 'Some Collection',
        label: 'some-collection',
      },
    ]

    await expect(async () => {
      await sanitizeFields({
        config,
        collectionConfig,
        fields,
        validRelationships: [],
      })
    }).rejects.toThrow(MissingFieldType)
  })

  it('should throw on invalid field name', async () => {
    const fields: Field[] = [
      {
        name: 'some.collection',
        type: 'text',
        label: 'some.collection',
      },
    ]

    await expect(async () => {
      await sanitizeFields({
        config,
        collectionConfig,
        fields,
        validRelationships: [],
      })
    }).rejects.toThrow(InvalidFieldName)
  })

  it('should throw on duplicate field name', async () => {
    const fields: Field[] = [
      {
        name: 'someField',
        type: 'text',
        label: 'someField',
      },
      {
        name: 'someField',
        type: 'text',
        label: 'someField',
      },
    ]

    await expect(async () => {
      await sanitizeFields({
        config,
        collectionConfig,
        fields,
        validRelationships: [],
      })
    }).rejects.toThrow(DuplicateFieldName)
  })

  it('should throw on duplicate block slug', async () => {
    const fields: Field[] = [
      {
        name: 'blocks',
        type: 'blocks',
        blocks: [
          {
            slug: 'block',
            fields: [
              {
                name: 'blockField',
                type: 'text',
              },
            ],
          },
          {
            slug: 'block',
            fields: [
              {
                name: 'blockField',
                type: 'text',
              },
            ],
          },
        ],
      },
    ]

    await expect(async () => {
      await sanitizeFields({
        config,
        collectionConfig,
        fields,
        validRelationships: [],
      })
    }).rejects.toThrow(DuplicateFieldName)
  })

  describe('auto-labeling', () => {
    it('should populate label if missing', async () => {
      const fields: Field[] = [
        {
          name: 'someField',
          type: 'text',
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as TextField

      expect(sanitizedField.name).toStrictEqual('someField')
      expect(sanitizedField.label).toStrictEqual('Some Field')
      expect(sanitizedField.type).toStrictEqual('text')
    })

    it('should allow auto-label override', async () => {
      const fields: Field[] = [
        {
          name: 'someField',
          type: 'text',
          label: 'Do not label',
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as TextField

      expect(sanitizedField.name).toStrictEqual('someField')
      expect(sanitizedField.label).toStrictEqual('Do not label')
      expect(sanitizedField.type).toStrictEqual('text')
    })

    describe('opt-out', () => {
      it('should allow label opt-out', async () => {
        const fields: Field[] = [
          {
            name: 'someField',
            type: 'text',
            label: false,
          },
        ]

        const sanitizedField = (
          await sanitizeFields({
            config,
            collectionConfig,
            fields,
            validRelationships: [],
          })
        )[0] as TextField

        expect(sanitizedField.name).toStrictEqual('someField')
        expect(sanitizedField.label).toStrictEqual(false)
        expect(sanitizedField.type).toStrictEqual('text')
      })

      it('should allow label opt-out for arrays', async () => {
        const arrayField: ArrayField = {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'itemName',
              type: 'text',
            },
          ],
          label: false,
        }

        const sanitizedField = (
          await sanitizeFields({
            config,
            collectionConfig,
            fields: [arrayField],
            validRelationships: [],
          })
        )[0] as ArrayField

        expect(sanitizedField.name).toStrictEqual('items')
        expect(sanitizedField.label).toStrictEqual(false)
        expect(sanitizedField.type).toStrictEqual('array')
        expect(sanitizedField.labels).toBeUndefined()
      })

      it('should allow label opt-out for blocks', async () => {
        const fields: Field[] = [
          {
            name: 'noLabelBlock',
            type: 'blocks',
            blocks: [
              {
                slug: 'number',
                fields: [
                  {
                    name: 'testNumber',
                    type: 'number',
                  },
                ],
              },
            ],
            label: false,
          },
        ]

        const sanitizedField = (
          await sanitizeFields({
            config,
            collectionConfig,
            fields,
            validRelationships: [],
          })
        )[0] as BlocksField

        expect(sanitizedField.name).toStrictEqual('noLabelBlock')
        expect(sanitizedField.label).toStrictEqual(false)
        expect(sanitizedField.type).toStrictEqual('blocks')
        expect(sanitizedField.labels).toBeUndefined()
      })
    })

    it('should label arrays with plural and singular', async () => {
      const fields: Field[] = [
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              name: 'itemName',
              type: 'text',
            },
          ],
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as ArrayField

      expect(sanitizedField.name).toStrictEqual('items')
      expect(sanitizedField.label).toStrictEqual('Items')
      expect(sanitizedField.type).toStrictEqual('array')
      expect(sanitizedField.labels).toMatchObject({ plural: 'Items', singular: 'Item' })
    })

    it('should label blocks with plural and singular', async () => {
      const fields: Field[] = [
        {
          name: 'specialBlock',
          type: 'blocks',
          blocks: [
            {
              slug: 'number',
              fields: [{ name: 'testNumber', type: 'number' }],
            },
          ],
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as BlocksField

      expect(sanitizedField.name).toStrictEqual('specialBlock')
      expect(sanitizedField.label).toStrictEqual('Special Block')
      expect(sanitizedField.type).toStrictEqual('blocks')
      expect(sanitizedField.labels).toMatchObject({
        plural: 'Special Blocks',
        singular: 'Special Block',
      })

      expect((sanitizedField.blocks[0].fields[0] as NumberField).label).toStrictEqual('Test Number')
    })
  })

  describe('relationships', () => {
    it('should not throw on valid relationship', async () => {
      const validRelationships = ['some-collection']
      const fields: Field[] = [
        {
          name: 'My Relationship',
          type: 'relationship',
          label: 'my-relationship',
          relationTo: 'some-collection',
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).not.toThrow()
    })

    it('should not throw on valid relationship - multiple', async () => {
      const validRelationships = ['some-collection', 'another-collection']
      const fields: Field[] = [
        {
          name: 'My Relationship',
          type: 'relationship',
          label: 'my-relationship',
          relationTo: ['some-collection', 'another-collection'],
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).not.toThrow()
    })

    it('should not throw on valid relationship inside blocks', async () => {
      const validRelationships = ['some-collection']
      const relationshipBlock: Block = {
        slug: 'relationshipBlock',
        fields: [
          {
            name: 'My Relationship',
            type: 'relationship',
            label: 'my-relationship',
            relationTo: 'some-collection',
          },
        ],
      }

      const fields: Field[] = [
        {
          name: 'layout',
          type: 'blocks',
          blocks: [relationshipBlock],
          label: 'Layout Blocks',
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).not.toThrow()
    })

    it('should throw on invalid relationship', async () => {
      const validRelationships = ['some-collection']
      const fields: Field[] = [
        {
          name: 'My Relationship',
          type: 'relationship',
          label: 'my-relationship',
          relationTo: 'not-valid',
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).rejects.toThrow(InvalidFieldRelationship)
    })

    it('should throw on invalid relationship - multiple', async () => {
      const validRelationships = ['some-collection', 'another-collection']
      const fields: Field[] = [
        {
          name: 'My Relationship',
          type: 'relationship',
          label: 'my-relationship',
          relationTo: ['some-collection', 'not-valid'],
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).rejects.toThrow(InvalidFieldRelationship)
    })

    it('should throw on invalid relationship inside blocks', async () => {
      const validRelationships = ['some-collection']
      const relationshipBlock: Block = {
        slug: 'relationshipBlock',
        fields: [
          {
            name: 'My Relationship',
            type: 'relationship',
            label: 'my-relationship',
            relationTo: 'not-valid',
          },
        ],
      }

      const fields: Field[] = [
        {
          name: 'layout',
          type: 'blocks',
          blocks: [relationshipBlock],
          label: 'Layout Blocks',
        },
      ]

      await expect(async () => {
        await sanitizeFields({ config, collectionConfig, fields, validRelationships })
      }).rejects.toThrow(InvalidFieldRelationship)
    })

    it('should defaultValue of checkbox to false if required and undefined', async () => {
      const fields: Field[] = [
        {
          name: 'My Checkbox',
          type: 'checkbox',
          required: true,
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as CheckboxField

      expect(sanitizedField.defaultValue).toStrictEqual(false)
    })

    it('should return empty field array if no fields', async () => {
      const sanitizedFields = await sanitizeFields({
        config,
        collectionConfig,
        fields: [],
        validRelationships: [],
      })

      expect(sanitizedFields).toStrictEqual([])
    })
  })
  describe('blocks', () => {
    it('should maintain admin.blockName true after sanitization', async () => {
      const fields: Field[] = [
        {
          name: 'noLabelBlock',
          type: 'blocks',
          blocks: [
            {
              slug: 'number',
              admin: {
                disableBlockName: true,
              },
              fields: [
                {
                  name: 'testNumber',
                  type: 'number',
                },
              ],
            },
          ],
          label: false,
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as BlocksField

      const sanitizedBlock = sanitizedField.blocks[0]

      expect(sanitizedBlock.admin?.disableBlockName).toStrictEqual(true)
    })
    it('should default admin.disableBlockName to true after sanitization', async () => {
      const fields: Field[] = [
        {
          name: 'noLabelBlock',
          type: 'blocks',
          blocks: [
            {
              slug: 'number',
              fields: [
                {
                  name: 'testNumber',
                  type: 'number',
                },
              ],
            },
          ],
          label: false,
        },
      ]

      const sanitizedField = (
        await sanitizeFields({
          config,
          collectionConfig,
          fields,
          validRelationships: [],
        })
      )[0] as BlocksField

      const sanitizedBlock = sanitizedField.blocks[0]

      expect(sanitizedBlock.admin?.disableBlockName).toStrictEqual(undefined)
    })
  })
})
```

--------------------------------------------------------------------------------

````
