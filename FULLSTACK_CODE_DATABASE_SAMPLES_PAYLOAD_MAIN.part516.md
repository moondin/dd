---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 516
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 516 of 695)

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

---[FILE: index.ts]---
Location: payload-main/test/admin/collections/CustomFields/index.ts

```typescript
import type { CollectionConfig } from 'payload'

import { customFieldsSlug } from '../../slugs.js'

export const CustomFields: CollectionConfig = {
  slug: customFieldsSlug,
  fields: [
    {
      name: 'customTextServerField',
      type: 'text',
      maxLength: 100,
      admin: {
        placeholder: 'This is a placeholder',
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
          Label: '/collections/CustomFields/fields/Text/LabelServer.js#CustomServerLabel',
          Description:
            '/collections/CustomFields/fields/Text/DescriptionServer.js#CustomServerDescription',
          Error: '/collections/CustomFields/CustomError.js#CustomError',
        },
      },
      minLength: 3,
    },
    {
      name: 'customTextClientField',
      type: 'text',
      maxLength: 100,
      admin: {
        placeholder: 'This is a placeholder',
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
          Label: '/collections/CustomFields/fields/Text/LabelClient.js#CustomClientLabel',
          Field: '/collections/CustomFields/fields/Text/FieldClient.js#CustomClientField',
          Description:
            '/collections/CustomFields/fields/Text/DescriptionClient.js#CustomClientDescription',
          Error: '/collections/CustomFields/CustomError.js#CustomError',
        },
      },
      minLength: 3,
    },
    {
      name: 'descriptionAsString',
      type: 'text',
      admin: {
        description: 'Static field description.',
      },
    },
    {
      name: 'descriptionAsFunction',
      type: 'text',
      admin: {
        description: () => 'Function description',
      },
    },
    {
      name: 'descriptionAsComponent',
      type: 'text',
      admin: {
        components: {
          Description:
            '/collections/CustomFields/FieldDescription/index.js#FieldDescriptionComponent',
        },
      },
    },
    {
      name: 'customSelectField',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/CustomFields/fields/Select/index.js#CustomSelect',
        },
      },
    },
    {
      name: 'customSelectInput',
      type: 'text',
      admin: {
        components: {
          Field: '/collections/CustomFields/fields/Select/CustomInput.js#CustomInput',
        },
      },
    },
    {
      name: 'customMultiSelectField',
      type: 'text',
      hasMany: true,
      admin: {
        components: {
          Field: '/collections/CustomFields/fields/Select/CustomMultiSelect.js#CustomMultiSelect',
        },
      },
    },
    {
      name: 'relationshipFieldWithBeforeAfterInputs',
      type: 'relationship',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
      },
      relationTo: 'posts',
    },
    {
      name: 'arrayFieldWithBeforeAfterInputs',
      type: 'array',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
      },
      fields: [
        {
          name: 'someTextField',
          type: 'text',
        },
      ],
    },
    {
      name: 'blocksFieldWithBeforeAfterInputs',
      type: 'blocks',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
      },
      blocks: [
        {
          slug: 'blockFields',
          fields: [
            {
              name: 'textField',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      label: 'Collapsible Field With Before & After Inputs',
      type: 'collapsible',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
        description: 'This is a collapsible field.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
        },
      ],
    },
    {
      name: 'groupFieldWithBeforeAfterInputs',
      type: 'group',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
      },
      fields: [
        {
          name: 'textOne',
          type: 'text',
        },
        {
          name: 'textTwo',
          type: 'text',
        },
      ],
    },
    {
      name: 'radioFieldWithBeforeAfterInputs',
      label: {
        en: 'Radio en',
        es: 'Radio es',
      },
      type: 'radio',
      admin: {
        components: {
          afterInput: ['/collections/CustomFields/AfterInput.js#AfterInput'],
          beforeInput: ['/collections/CustomFields/BeforeInput.js#BeforeInput'],
        },
      },
      options: [
        {
          label: { en: 'Value One', es: 'Value Uno' },
          value: 'one',
        },
        {
          label: 'Value Two',
          value: 'two',
        },
        {
          label: 'Value Three',
          value: 'three',
        },
      ],
    },
    {
      name: 'allButtons',
      admin: {
        components: {
          Field: '/collections/CustomFields/fields/Buttons/index.js#AllButtons',
        },
      },
      type: 'ui',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/collections/CustomFields/FieldDescription/index.tsx
Signals: React

```typescript
'use client'
import type { FieldDescriptionClientComponent } from 'payload'

import { useFormFields } from '@payloadcms/ui'
import React from 'react'

export const FieldDescriptionComponent: FieldDescriptionClientComponent = ({ path }) => {
  const field = useFormFields(([fields]) => (fields && fields?.[path]) || null)
  const { value } = field || {}

  return (
    <div className={`field-description-${path}`}>
      Component description: {path} - {value as string}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Buttons/index.tsx

```typescript
import { Button } from '@payloadcms/ui'

const sizes = ['small', 'medium', 'large'] as const
const buttonStyles = [
  'error',
  'icon-label',
  'none',
  'pill',
  'primary',
  'secondary',
  'subtle',
  'transparent',
  'tab',
] as const

export const AllButtons = () => {
  return (
    <div>
      {buttonStyles.map((style) => (
        <div key={style}>
          {sizes.map((size) => (
            <Button buttonStyle={style} key={`${style}-${size}`} size={size}>
              {style} - {size}
            </Button>
          ))}
          <hr />
        </div>
      ))}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomInput.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Select/CustomInput.tsx
Signals: React

```typescript
'use client'

import type { OptionObject, UIField } from 'payload'

import { SelectInput, useField } from '@payloadcms/ui'
import { useEffect, useMemo } from 'react'

interface Props {
  field: UIField
  path: string
  required?: boolean
}

const selectOptions = [
  {
    label: 'Option 1',
    value: 'option-1',
  },
  {
    label: 'Option 2',
    value: 'option-2',
  },
]
export function CustomInput({ field, path, required = false }: Props) {
  const { setValue, value } = useField<string>({ path })

  const options = useMemo(() => {
    const internal: OptionObject[] = []

    internal.push(...selectOptions)

    return internal
  }, [])

  return (
    <div className="custom-select-input">
      <SelectInput
        label={field.label}
        name={field.name}
        onChange={(option) => {
          const selectedValue = (Array.isArray(option) ? option[0]?.value : option?.value) || ''
          setValue(selectedValue)
        }}
        options={options}
        path={path}
        required={required}
        value={value}
      />
      <button
        className="clear-value"
        onClick={(e) => {
          e.preventDefault()
          setValue('')
        }}
        type="button"
      >
        Click me to reset value
      </button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: CustomMultiSelect.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Select/CustomMultiSelect.tsx
Signals: React

```typescript
'use client'

import type { Option, SelectFieldClientComponent } from 'payload'

import { SelectField, useField } from '@payloadcms/ui'
import React from 'react'

export const CustomMultiSelect: SelectFieldClientComponent = (props) => {
  const { path } = props
  const { setValue, value } = useField<string[]>({ path })
  const [options, setOptions] = React.useState<Option[]>([])

  React.useEffect(() => {
    const fetchOptions = () => {
      const fetched: Option[] = [
        { label: 'Label 1', value: 'value1' },
        { label: 'Label 2', value: 'value2' },
      ]
      setOptions(fetched)
    }
    void fetchOptions()
  }, [])

  const onChange = (val: string | string[]) => {
    setValue(Array.isArray(val) ? val : val ? [val] : [])
  }

  return (
    <SelectField
      {...props}
      field={{
        ...props.field,
        name: path,
        hasMany: true,
        options,
      }}
      onChange={onChange}
      value={value ?? []}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Select/index.tsx
Signals: React

```typescript
'use client'

import type { Option, SelectFieldClientComponent } from 'payload'

import { SelectField, useField } from '@payloadcms/ui'
import React from 'react'

export const CustomSelect: SelectFieldClientComponent = (props) => {
  const { path } = props
  const { setValue, value } = useField<string>({ path })
  const [options, setOptions] = React.useState<Option[]>([])

  React.useEffect(() => {
    const fetchOptions = () => {
      const fetchedOptions: Option[] = [
        { label: 'Label 1', value: 'value1' },
        { label: 'Label 2', value: 'value2' },
      ]
      setOptions(fetchedOptions)
    }
    void fetchOptions()
  }, [])

  const onChange = (val: string | string[]) => {
    setValue(Array.isArray(val) ? (val[0] ?? '') : val)
  }

  return (
    <div>
      <SelectField
        {...props}
        field={{
          ...props.field,
          options,
        }}
        onChange={onChange}
        value={value ?? ''}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DescriptionClient.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Text/DescriptionClient.tsx
Signals: React

```typescript
'use client'
import type { TextFieldDescriptionClientComponent } from 'payload'

import React from 'react'

export const CustomClientDescription: TextFieldDescriptionClientComponent = (props) => {
  return (
    <div id="custom-client-field-description">{`Description: the max length of this field is: ${props?.field?.maxLength}`}</div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: DescriptionServer.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Text/DescriptionServer.tsx
Signals: React

```typescript
import type { TextFieldDescriptionServerComponent } from 'payload'

import React from 'react'

export const CustomServerDescription: TextFieldDescriptionServerComponent = (props) => {
  return (
    <div id="custom-server-field-description">{`Description: the max length of this field is: ${props?.field?.maxLength}`}</div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: FieldClient.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Text/FieldClient.tsx
Signals: React

```typescript
'use client'
import type { TextFieldClientComponent } from 'payload'

import { TextField } from '@payloadcms/ui'
import React from 'react'

export const CustomClientField: TextFieldClientComponent = (props) => {
  return <TextField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: LabelClient.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Text/LabelClient.tsx
Signals: React

```typescript
'use client'
import type { TextFieldLabelClientComponent } from 'payload'

import React from 'react'

export const CustomClientLabel: TextFieldLabelClientComponent = (props) => {
  return (
    <div id="custom-client-field-label">{`Label: the max length of this field is: ${props?.field?.maxLength}`}</div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: LabelServer.tsx]---
Location: payload-main/test/admin/collections/CustomFields/fields/Text/LabelServer.tsx
Signals: React

```typescript
import type { TextFieldLabelServerComponent } from 'payload'

import React from 'react'

export const CustomServerLabel: TextFieldLabelServerComponent = (props) => {
  return (
    <div id="custom-server-field-label">{`Label: the max length of this field is: ${props?.field?.maxLength}`}</div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Component.tsx]---
Location: payload-main/test/admin/collections/CustomListDrawer/Component.tsx
Signals: React

```typescript
'use client'
import { toast, useListDrawer, useListDrawerContext, useTranslation } from '@payloadcms/ui'
import React, { useCallback } from 'react'

export const CustomListDrawer = () => {
  const [isCreating, setIsCreating] = React.useState(false)

  // this is the _outer_ drawer context (if any), not the one for the list drawer below
  const { refresh } = useListDrawerContext()
  const { t } = useTranslation()

  const [ListDrawer, ListDrawerToggler] = useListDrawer({
    collectionSlugs: ['custom-list-drawer'],
  })

  const createDoc = useCallback(async () => {
    if (isCreating) {
      return
    }

    setIsCreating(true)

    try {
      await fetch('/api/custom-list-drawer', {
        body: JSON.stringify({}),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      setIsCreating(false)

      toast.success(
        t('general:successfullyCreated', {
          label: 'Custom List Drawer',
        }),
      )

      // In the root document view, there is no outer drawer context, so this will be `undefined`
      if (typeof refresh === 'function') {
        await refresh()
      }
    } catch (_err) {
      console.error('Error creating document:', _err) // eslint-disable-line no-console
      setIsCreating(false)
    }
  }, [isCreating, refresh, t])

  return (
    <div>
      <button id="create-custom-list-drawer-doc" onClick={createDoc} type="button">
        {isCreating ? 'Creating...' : 'Create Document'}
      </button>
      <ListDrawer />
      <ListDrawerToggler id="open-custom-list-drawer">Open list drawer</ListDrawerToggler>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin/collections/CustomListDrawer/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const CustomListDrawer: CollectionConfig = {
  slug: 'custom-list-drawer',
  fields: [
    {
      name: 'customListDrawer',
      type: 'ui',
      admin: {
        components: {
          Field: '/collections/CustomListDrawer/Component.js#CustomListDrawer',
        },
      },
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin/collections/FormatDocURL/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const FormatDocURL: CollectionConfig = {
  slug: 'format-doc-url',
  admin: {
    // Custom formatDocURL function to control linking behavior
    formatDocURL: ({ doc, defaultURL, req, collectionSlug, viewType }) => {
      // Disable linking for documents with title 'no-link'
      if (doc.title === 'no-link') {
        return null
      }

      // Custom link for documents with title 'custom-link'
      if (doc.title === 'custom-link') {
        return '/custom-destination'
      }

      // Example: Add query params based on user email (fallback for normal cases)
      if (
        req.user?.email === 'dev@payloadcms.com' &&
        viewType !== 'trash' &&
        doc._status === 'draft'
      ) {
        return defaultURL + '?admin=true'
      }

      // Example: Different behavior in trash view (check this before user-specific logic)
      if (viewType === 'trash') {
        return defaultURL + '?from=trash'
      }

      // Example: Collection-specific behavior for published docs
      if (collectionSlug === 'format-doc-url' && doc._status === 'published') {
        return defaultURL + '?published=true'
      }

      // For all other documents, just return the default URL
      return defaultURL
    },
  },
  trash: true,
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/test/admin/collections/ListViewSelectAPI/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const listViewSelectAPISlug = 'list-view-select-api'

export const ListViewSelectAPI: CollectionConfig = {
  slug: listViewSelectAPISlug,
  admin: {
    enableListViewSelectAPI: true,
    components: {
      beforeListTable: [
        './collections/ListViewSelectAPI/BeforeListTable/index.tsx#BeforeListTable',
      ],
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'groupNameField',
          type: 'text',
        },
      ],
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/collections/ListViewSelectAPI/BeforeListTable/index.tsx

```typescript
'use client'

import { useListQuery } from '@payloadcms/ui'

export const BeforeListTable = () => {
  const { data } = useListQuery()

  return <p id="table-state">{JSON.stringify(data?.docs || [])}</p>
}
```

--------------------------------------------------------------------------------

---[FILE: TestComponent.tsx]---
Location: payload-main/test/admin/components/TestComponent.tsx
Signals: React

```typescript
'use client'
import React from 'react'

export const TestComponent: React.FC = () => {
  return (
    <div>
      Test Component from the global <code>admin.dependencies</code>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/AdminButton/index.tsx
Signals: React

```typescript
import type { PayloadServerReactComponent, SanitizedConfig } from 'payload'

import React from 'react'

const baseClass = 'admin-button'

export const AdminButton: PayloadServerReactComponent<
  SanitizedConfig['admin']['components']['actions'][0]
> = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Admin Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/CollectionAPIButton/index.tsx
Signals: React

```typescript
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import React from 'react'

const baseClass = 'collection-api-button'

export const CollectionAPIButton: PayloadServerReactComponent<CustomComponent> = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Collection API Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/CollectionEditButton/index.tsx
Signals: React

```typescript
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import React from 'react'

const baseClass = 'collection-edit-button'

export const CollectionEditButton: PayloadServerReactComponent<CustomComponent> = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Collection Edit Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/CollectionListButton/index.tsx
Signals: React

```typescript
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import React from 'react'

const baseClass = 'collection-list-button'

export const CollectionListButton: PayloadServerReactComponent<CustomComponent> = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Collection List Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/GlobalAPIButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'global-api-button'

export const GlobalAPIButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Global API Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/actions/GlobalEditButton/index.tsx
Signals: React

```typescript
import React from 'react'

const baseClass = 'global-edit-button'

export const GlobalEditButton: React.FC = () => {
  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Global Edit Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/admin/components/AfterDashboard/index.scss

```text
.after-dashboard {
  border-top: 1px solid var(--theme-elevation-100);
  padding-top: var(--base);

  & > * {
    margin: 0;

    &:not(:last-child) {
      margin-bottom: calc(var(--base) / 2);
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/AfterDashboard/index.tsx
Signals: React

```typescript
import type { PayloadServerReactComponent, SanitizedConfig } from 'payload'

import React from 'react'

import './index.scss'

const baseClass = 'after-dashboard'

export const AfterDashboard: PayloadServerReactComponent<
  SanitizedConfig['admin']['components']['afterDashboard'][0]
> = () => {
  return (
    <div className={baseClass}>
      <h4>Test Config</h4>
      <p>
        The /test directory is used for create custom configurations and data seeding for developing
        features, writing e2e and integration testing.
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/AfterDashboardClient/index.tsx
Signals: React

```typescript
import type { CustomComponent, PayloadServerReactComponent } from 'payload'

import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import React from 'react'

import { Banner } from '../Banner/index.js'

export const AfterDashboardClient: PayloadServerReactComponent<CustomComponent> = ({ payload }) => {
  return (
    <Banner>
      <p>Admin Dependency test component:</p>
      {RenderServerComponent({
        Component: payload.config.admin.dependencies?.myTestComponent,
        importMap: payload.importMap,
      })}
    </Banner>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/AfterNavLinks/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { PayloadClientReactComponent, SanitizedConfig } from 'payload'

import LinkImport from 'next/link.js'
const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

import { useConfig } from '@payloadcms/ui'
import React from 'react'

const baseClass = 'after-nav-links'

export const AfterNavLinks: PayloadClientReactComponent<
  SanitizedConfig['admin']['components']['afterNavLinks'][0]
> = () => {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <div
      className={baseClass}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <h4 className="nav__label" style={{ color: 'var(--theme-elevation-400)', margin: 0 }}>
        Custom Routes
      </h4>
      <h4 className="nav__link" style={{ margin: 0 }}>
        <Link href={`${adminRoute}/custom-default-view`} style={{ textDecoration: 'none' }}>
          Default Template
        </Link>
      </h4>
      <h4 className="nav__link" style={{ margin: 0 }}>
        <Link href={`${adminRoute}/custom-minimal-view`} style={{ textDecoration: 'none' }}>
          Minimal Template
        </Link>
      </h4>
      <div id="custom-css" />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/Banner/index.tsx

```typescript
import { Banner as PayloadBanner } from '@payloadcms/ui'

export function Banner(props: {
  children?: React.ReactNode
  className?: string
  description?: string
  message?: string
}) {
  const { children, className, description, message } = props
  return (
    <PayloadBanner className={className} type="success">
      {children || message || description || 'A custom banner component'}
    </PayloadBanner>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/BeforeDocumentControls/CustomDraftButton/index.tsx
Signals: React

```typescript
import type { BeforeDocumentControlsServerProps } from 'payload'

import React from 'react'

const baseClass = 'custom-draft-button'

export function CustomDraftButton(props: BeforeDocumentControlsServerProps) {
  return (
    <div
      className={baseClass}
      id="custom-draft-button"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Custom Draft Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/BeforeDocumentControls/CustomSaveButton/index.tsx
Signals: React

```typescript
import type { BeforeDocumentControlsServerProps } from 'payload'

import React from 'react'

const baseClass = 'custom-save-button'

export function CustomSaveButton(props: BeforeDocumentControlsServerProps) {
  return (
    <div
      className={baseClass}
      id="custom-save-button"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'calc(var(--base) / 4)',
      }}
    >
      <p className="nav__label" style={{ color: 'var(--theme-text)', margin: 0 }}>
        Custom Save Button
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/BeforeList/index.tsx
Signals: React

```typescript
// src/components/SelectPostsButton.tsx
'use client'
import { Button, type UseListDrawer, useListDrawer } from '@payloadcms/ui'
import { useMemo } from 'react'

type UseListDrawerArgs = Parameters<UseListDrawer>[0]

export const SelectPostsButton = () => {
  const listDrawerArgs = useMemo<UseListDrawerArgs>(
    () => ({
      collectionSlugs: ['with-list-drawer'],
    }),
    [],
  )
  const [ListDrawer, _, { toggleDrawer }] = useListDrawer(listDrawerArgs)

  return (
    <>
      <Button onClick={() => toggleDrawer()}>Select posts</Button>
      <ListDrawer allowCreate={false} enableRowSelections={false} />
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/BeforeLogin/index.tsx
Signals: React

```typescript
'use client'

import type { PayloadClientReactComponent, SanitizedConfig } from 'payload'

import { useTranslation } from '@payloadcms/ui'
import React from 'react'

export const BeforeLogin: PayloadClientReactComponent<
  SanitizedConfig['admin']['components']['beforeLogin'][0]
> = () => {
  const translation = useTranslation()

  return (
    <div>
      <h3>{translation.t('general:welcome')}</h3>
      <p>
        This demo is a set up to configure Payload for the develop and testing of features. To see a
        product demo of a Payload project please visit:{' '}
        <a href="https://demo.payloadcms.com" rel="noreferrer" target="_blank">
          demo.payloadcms.com
        </a>
        .
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomCell/index.tsx
Signals: React

```typescript
'use client'

import type { DefaultCellComponentProps } from 'payload'

import React from 'react'

export const CustomCell: React.FC<DefaultCellComponentProps> = (props) => {
  return <div>{`Custom cell: ${props?.rowData?.customCell || 'No data'}`}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomGroupCell/index.tsx
Signals: React

```typescript
'use client'

import type { DefaultCellComponentProps } from 'payload'

import React from 'react'

export const CustomGroupCell: React.FC<DefaultCellComponentProps> = (props) => {
  return <div>{`Custom group cell: ${props?.rowData?.title || 'No data'}`}</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomHeader/index.tsx
Signals: React

```typescript
import type { PayloadServerReactComponent, SanitizedConfig } from 'payload'

import React from 'react'

const baseClass = 'custom-header'

export const CustomHeader: PayloadServerReactComponent<
  SanitizedConfig['admin']['components']['header'][0]
> = () => {
  return (
    <div
      className={baseClass}
      style={{
        alignItems: 'center',
        backgroundColor: 'var(--theme-success-100)',
        display: 'flex',
        minHeight: 'var(--app-header-height)',
        padding: '0 var(--gutter-h)',
        // position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 'var(--z-modal)',
      }}
    >
      <p style={{ color: 'var(--theme-success-750)', margin: 0 }}>
        Here is a custom header inserted with admin.components.header
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomProvider/index.tsx
Signals: React

```typescript
'use client'

import React, { createContext, use, useState } from 'react'

type CustomContext = {
  getCustom
  setCustom
}

const Context = createContext({} as CustomContext)

export const CustomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [getCustom, setCustom] = useState({})

  const value = {
    getCustom,
    setCustom,
  }

  return (
    <Context value={value}>
      <div className="custom-provider" style={{ display: 'none' }}>
        This is a custom provider.
      </div>
      {children}
    </Context>
  )
}

export const useCustom = () => use(Context)
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomProviderServer/index.tsx
Signals: React

```typescript
import type { ServerProps } from 'payload'

import React, { Fragment } from 'react'

export const CustomProviderServer: React.FC<{ children: React.ReactNode } & ServerProps> = ({
  children,
  payload,
}) => {
  return (
    <Fragment>
      <div className="custom-provider-server" style={{ display: 'none' }}>
        {`This is a custom provider with payload: ${Boolean(payload)}`}
      </div>
      {children}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: client.tsx]---
Location: payload-main/test/admin/components/CustomTabComponent/client.tsx
Signals: React, Next.js

```typescript
'use client'

import type { DocumentTabClientProps } from 'payload'

import { useConfig } from '@payloadcms/ui'
import LinkImport from 'next/link.js'
import { useParams } from 'next/navigation.js'
import React from 'react'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

type CustomTabComponentClientProps = {
  label: string
} & DocumentTabClientProps

export function CustomTabComponentClient({ label, path }: CustomTabComponentClientProps) {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const params = useParams()

  const baseRoute = (params.segments?.slice(0, 3) as string[]).join('/')

  return <Link href={`${adminRoute}/${baseRoute}${path}`}>{label}</Link>
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/admin/components/CustomTabComponent/index.scss

```text
.custom-doc-tab {
  a {
    text-decoration: none;
    background-color: var(--theme-elevation-200);
    padding: 2px 6px;
    border-radius: 2px;
    white-space: nowrap;

    &:hover {
      background-color: var(--theme-elevation-300);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/CustomTabComponent/index.tsx
Signals: React

```typescript
import type { DocumentTabServerProps } from 'payload'

import React from 'react'

import { CustomTabComponentClient } from './client.js'
import './index.scss'

type CustomTabComponentProps = {
  label: string
} & DocumentTabServerProps

export function CustomTabComponent(props: CustomTabComponentProps) {
  const { label, path } = props

  return (
    <li className="custom-doc-tab">
      <CustomTabComponentClient label={label} path={path} />
    </li>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Cell.tsx]---
Location: payload-main/test/admin/components/DemoUIField/Cell.tsx
Signals: React

```typescript
import React from 'react'

export const DemoUIFieldCell: React.FC = () => <p>Demo UI Field Cell</p>
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/test/admin/components/DemoUIField/Field.tsx
Signals: React

```typescript
import React from 'react'

export const DemoUIField: React.FC = () => <p className="field-type">Demo UI Field</p>
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/EditMenuItems/index.tsx

```typescript
'use client'

import { PopupList } from '@payloadcms/ui'

import { Banner } from '../Banner/index.js'

export const EditMenuItems = () => {
  return (
    <>
      <PopupList.ButtonGroup>
        <PopupList.Button>Custom Edit Menu Item</PopupList.Button>
        <Banner message="Another using a banner" />
        <div>Another in a plain div</div>
      </PopupList.ButtonGroup>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/EditMenuItemsServer/index.tsx
Signals: React

```typescript
import type { EditMenuItemsServerProps } from 'payload'

import React from 'react'

export const EditMenuItemsServer = (props: EditMenuItemsServerProps) => {
  const href = `/custom-action?id=${props.id}`

  return (
    <div>
      <a href={href}>Custom Edit Menu Item (Server)</a>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Icon.tsx]---
Location: payload-main/test/admin/components/graphics/Icon.tsx

```typescript
export function Icon() {
  return (
    <div
      style={{
        backgroundColor: 'var(--theme-warning-400)',
        borderRadius: '100%',
        height: '18px',
        width: '18px',
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Logo.tsx]---
Location: payload-main/test/admin/components/graphics/Logo.tsx

```typescript
export function Logo() {
  return (
    <div
      style={{
        backgroundColor: 'var(--theme-warning-400)',
        borderRadius: '100%',
        height: '18px',
        width: '18px',
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

````
