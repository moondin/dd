---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 76
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 76 of 695)

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

---[FILE: route.ts]---
Location: payload-main/examples/custom-components/src/app/(payload)/api/[...slug]/route.ts

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

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/index.ts

```typescript
import type { CollectionConfig, Field } from 'payload'

import { arrayFields } from './array'
import { blocksFields } from './blocks'
import { checkboxFields } from './checkbox'
import { codeFields } from './code'
import { dateFields } from './date'
import { emailFields } from './email'
import { jsonFields } from './json'
import { numberFields } from './number'
import { pointFields } from './point'
import { radioFields } from './radio'
import { relationshipFields } from './relationship'
import { selectFields } from './select'
import { textFields } from './text'
import { textareaFields } from './textarea'

export const CustomFields: CollectionConfig = {
  slug: 'custom-fields',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    ...([] as Field[]).concat(
      arrayFields,
      blocksFields,
      checkboxFields,
      codeFields,
      dateFields,
      emailFields,
      jsonFields,
      numberFields,
      pointFields,
      radioFields,
      relationshipFields,
      selectFields,
      textFields,
      textareaFields,
    ),
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/array/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const arrayFields: CollectionConfig['fields'] = [
  {
    name: 'arrayFieldServerComponent',
    type: 'array',
    admin: {
      components: {
        Field: '@/collections/Fields/array/components/server/Field#CustomArrayFieldServer',
        Label: '@/collections/Fields/array/components/server/Label#CustomArrayFieldLabelServer',
      },
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
      },
    ],
  },
  {
    name: 'arrayFieldClientComponent',
    type: 'array',
    admin: {
      components: {
        Field: '@/collections/Fields/array/components/client/Field#CustomArrayFieldClient',
        Label: '@/collections/Fields/array/components/client/Label#CustomArrayFieldLabelClient',
      },
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: 'Title',
      },
    ],
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/array/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { ArrayFieldClientComponent } from 'payload'

import { ArrayField } from '@payloadcms/ui'
import React from 'react'

export const CustomArrayFieldClient: ArrayFieldClientComponent = (props) => {
  return <ArrayField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/array/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { ArrayFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomArrayFieldLabelClient: ArrayFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/array/components/server/Field.tsx
Signals: React

```typescript
import type { ArrayFieldServerComponent } from 'payload'
import type React from 'react'

import { ArrayField } from '@payloadcms/ui'

export const CustomArrayFieldServer: ArrayFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <ArrayField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/array/components/server/Label.tsx
Signals: React

```typescript
import type { ArrayFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomArrayFieldLabelServer: ArrayFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      required={clientField?.required}
      path={path}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/blocks/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const blocksFields: CollectionConfig['fields'] = [
  {
    name: 'blocksFieldServerComponent',
    type: 'blocks',
    admin: {
      components: {
        Field: '@/collections/Fields/blocks/components/server/Field#CustomBlocksFieldServer',
      },
    },
    blocks: [
      {
        slug: 'text',
        fields: [
          {
            name: 'content',
            type: 'textarea',
            label: 'Content',
          },
        ],
        labels: {
          plural: 'Text Blocks',
          singular: 'Text Block',
        },
      },
    ],
  },
  {
    name: 'blocksFieldClientComponent',
    type: 'blocks',
    admin: {
      components: {
        Field: '@/collections/Fields/blocks/components/client/Field#CustomBlocksFieldClient',
      },
    },
    blocks: [
      {
        slug: 'text',
        fields: [
          {
            name: 'content',
            type: 'textarea',
            label: 'Content',
          },
        ],
        labels: {
          plural: 'Text Blocks',
          singular: 'Text Block',
        },
      },
    ],
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/blocks/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { BlocksFieldClientComponent } from 'payload'

import { BlocksField } from '@payloadcms/ui'
import React from 'react'

export const CustomBlocksFieldClient: BlocksFieldClientComponent = (props) => {
  return <BlocksField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/blocks/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { BlocksFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomBlocksFieldLabelClient: BlocksFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/blocks/components/server/Field.tsx
Signals: React

```typescript
import type { BlocksFieldServerComponent } from 'payload'
import type React from 'react'

import { BlocksField } from '@payloadcms/ui'

export const CustomBlocksFieldServer: BlocksFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <BlocksField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/blocks/components/server/Label.tsx
Signals: React

```typescript
import type { BlocksFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomBlocksFieldLabelServer: BlocksFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/checkbox/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const checkboxFields: CollectionConfig['fields'] = [
  {
    name: 'checkboxFieldServerComponent',
    type: 'checkbox',
    admin: {
      components: {
        Field: '@/collections/Fields/checkbox/components/server/Field#CustomCheckboxFieldServer',
        Label:
          '@/collections/Fields/checkbox/components/server/Label#CustomCheckboxFieldLabelServer',
      },
    },
  },
  {
    name: 'checkboxFieldClientComponent',
    type: 'checkbox',
    admin: {
      components: {
        Field: '@/collections/Fields/checkbox/components/client/Field#CustomCheckboxFieldClient',
        Label:
          '@/collections/Fields/checkbox/components/client/Label#CustomCheckboxFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/checkbox/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { CheckboxFieldClientComponent } from 'payload'

import { CheckboxField } from '@payloadcms/ui'
import React from 'react'

export const CustomCheckboxFieldClient: CheckboxFieldClientComponent = (props) => {
  return <CheckboxField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/checkbox/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { CheckboxFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomCheckboxFieldLabelClient: CheckboxFieldLabelClientComponent = ({
  field,
  path,
}) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/checkbox/components/server/Field.tsx
Signals: React

```typescript
import type { CheckboxFieldServerComponent } from 'payload'
import type React from 'react'

import { CheckboxField } from '@payloadcms/ui'

export const CustomCheckboxFieldServer: CheckboxFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <CheckboxField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/checkbox/components/server/Label.tsx
Signals: React

```typescript
import type { CheckboxFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomCheckboxFieldLabelServer: CheckboxFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/code/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const codeFields: CollectionConfig['fields'] = [
  {
    name: 'codeFieldServerComponent',
    type: 'code',
    admin: {
      components: {
        Field: '@/collections/Fields/code/components/server/Field#CustomCodeFieldServer',
        Label: '@/collections/Fields/code/components/server/Label#CustomCodeFieldLabelServer',
      },
    },
  },
  {
    name: 'codeFieldClientComponent',
    type: 'code',
    admin: {
      components: {
        Field: '@/collections/Fields/code/components/client/Field#CustomCodeFieldClient',
        Label: '@/collections/Fields/code/components/client/Label#CustomCodeFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/code/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { CodeFieldClientComponent } from 'payload'

import { CodeField } from '@payloadcms/ui'
import React from 'react'

export const CustomCodeFieldClient: CodeFieldClientComponent = (props) => {
  return <CodeField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/code/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { CodeFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomCodeFieldLabelClient: CodeFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/code/components/server/Field.tsx
Signals: React

```typescript
import type { CodeFieldServerComponent } from 'payload'
import type React from 'react'

import { CodeField } from '@payloadcms/ui'

export const CustomCodeFieldServer: CodeFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <CodeField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/code/components/server/Label.tsx
Signals: React

```typescript
import type { CodeFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomCodeFieldLabelServer: CodeFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/date/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const dateFields: CollectionConfig['fields'] = [
  {
    name: 'dateFieldServerComponent',
    type: 'date',
    admin: {
      components: {
        Field: '@/collections/Fields/date/components/server/Field#CustomDateFieldServer',
        Label: '@/collections/Fields/date/components/server/Label#CustomDateFieldLabelServer',
      },
    },
  },
  {
    name: 'dateFieldClientComponent',
    type: 'date',
    admin: {
      components: {
        Field: '@/collections/Fields/date/components/client/Field#CustomDateFieldClient',
        Label: '@/collections/Fields/date/components/client/Label#CustomDateFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/date/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { DateFieldClientComponent } from 'payload'

import { DateTimeField } from '@payloadcms/ui'
import React from 'react'

export const CustomDateFieldClient: DateFieldClientComponent = (props) => {
  return <DateTimeField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/date/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { DateFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomDateFieldLabelClient: DateFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/date/components/server/Field.tsx
Signals: React

```typescript
import type { DateFieldServerComponent } from 'payload'
import type React from 'react'

import { DateTimeField } from '@payloadcms/ui'

export const CustomDateFieldServer: DateFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <DateTimeField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/date/components/server/Label.tsx
Signals: React

```typescript
import type { DateFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomDateFieldLabelServer: DateFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/email/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const emailFields: CollectionConfig['fields'] = [
  {
    name: 'emailFieldServerComponent',
    type: 'email',
    admin: {
      components: {
        Field: '@/collections/Fields/email/components/server/Field#CustomEmailFieldServer',
        Label: '@/collections/Fields/email/components/server/Label#CustomEmailFieldLabelServer',
      },
    },
  },
  {
    name: 'emailFieldClientComponent',
    type: 'email',
    admin: {
      components: {
        Field: '@/collections/Fields/email/components/client/Field#CustomEmailFieldClient',
        Label: '@/collections/Fields/email/components/client/Label#CustomEmailFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/email/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { EmailFieldClientComponent } from 'payload'

import { EmailField } from '@payloadcms/ui'
import React from 'react'

export const CustomEmailFieldClient: EmailFieldClientComponent = (props) => {
  return <EmailField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/email/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { EmailFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomEmailFieldLabelClient: EmailFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/email/components/server/Field.tsx
Signals: React

```typescript
import type { EmailFieldServerComponent } from 'payload'
import type React from 'react'

import { EmailField } from '@payloadcms/ui'

export const CustomEmailFieldServer: EmailFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <EmailField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/email/components/server/Label.tsx
Signals: React

```typescript
import type { EmailFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomEmailFieldLabelServer: EmailFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/json/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const jsonFields: CollectionConfig['fields'] = [
  {
    name: 'jsonFieldServerComponent',
    type: 'json',
    admin: {
      components: {
        Field: '@/collections/Fields/json/components/server/Field#CustomJSONFieldServer',
        Label: '@/collections/Fields/json/components/server/Label#CustomJSONFieldLabelServer',
      },
    },
  },
  {
    name: 'jsonFieldClientComponent',
    type: 'json',
    admin: {
      components: {
        Field: '@/collections/Fields/json/components/client/Field#CustomJSONFieldClient',
        Label: '@/collections/Fields/json/components/client/Label#CustomJSONFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/json/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { JSONFieldClientComponent } from 'payload'

import { JSONField } from '@payloadcms/ui'
import React from 'react'

export const CustomJSONFieldClient: JSONFieldClientComponent = (props) => {
  return <JSONField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/json/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { JSONFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomJSONFieldLabelClient: JSONFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/json/components/server/Field.tsx
Signals: React

```typescript
import type { JSONFieldServerComponent } from 'payload'
import type React from 'react'

import { JSONField } from '@payloadcms/ui'

export const CustomJSONFieldServer: JSONFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <JSONField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/json/components/server/Label.tsx
Signals: React

```typescript
import type { JSONFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomJSONFieldLabelServer: JSONFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/number/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const numberFields: CollectionConfig['fields'] = [
  {
    name: 'numberFieldServerComponent',
    type: 'number',
    admin: {
      components: {
        Field: '@/collections/Fields/number/components/server/Field#CustomNumberFieldServer',
        Label: '@/collections/Fields/number/components/server/Label#CustomNumberFieldLabelServer',
      },
    },
  },
  {
    name: 'numberFieldClientComponent',
    type: 'number',
    admin: {
      components: {
        Field: '@/collections/Fields/number/components/client/Field#CustomNumberFieldClient',
        Label: '@/collections/Fields/number/components/client/Label#CustomNumberFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/number/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { NumberFieldClientComponent } from 'payload'

import { NumberField } from '@payloadcms/ui'
import React from 'react'

export const CustomNumberFieldClient: NumberFieldClientComponent = (props) => {
  return <NumberField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/number/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { NumberFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomNumberFieldLabelClient: NumberFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/number/components/server/Field.tsx
Signals: React

```typescript
import type { NumberFieldServerComponent } from 'payload'
import type React from 'react'

import { NumberField } from '@payloadcms/ui'

export const CustomNumberFieldServer: NumberFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <NumberField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/number/components/server/Label.tsx
Signals: React

```typescript
import type { NumberFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomNumberFieldLabelServer: NumberFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/point/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const pointFields: CollectionConfig['fields'] = [
  {
    name: 'pointFieldServerComponent',
    type: 'point',
    admin: {
      components: {
        Field: '@/collections/Fields/point/components/server/Field#CustomPointFieldServer',
        Label: '@/collections/Fields/point/components/server/Label#CustomPointFieldLabelServer',
      },
    },
  },
  {
    name: 'pointFieldClientComponent',
    type: 'point',
    admin: {
      components: {
        Field: '@/collections/Fields/point/components/client/Field#CustomPointFieldClient',
        Label: '@/collections/Fields/point/components/client/Label#CustomPointFieldLabelClient',
      },
    },
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/point/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { PointFieldClientComponent } from 'payload'

import { PointField } from '@payloadcms/ui'
import React from 'react'

export const CustomPointFieldClient: PointFieldClientComponent = (props) => {
  return <PointField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/point/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { PointFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomPointFieldLabelClient: PointFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/point/components/server/Field.tsx
Signals: React

```typescript
import type { PointFieldServerComponent } from 'payload'
import type React from 'react'

import { PointField } from '@payloadcms/ui'

export const CustomPointFieldServer: PointFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <PointField field={clientField} path={path} schemaPath={schemaPath} permissions={permissions} />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/point/components/server/Label.tsx
Signals: React

```typescript
import type { PointFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomPointFieldLabelServer: PointFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/radio/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const radioFields: CollectionConfig['fields'] = [
  {
    name: 'radioFieldServerComponent',
    type: 'radio',
    admin: {
      components: {
        Field: '@/collections/Fields/radio/components/server/Field#CustomRadioFieldServer',
        Label: '@/collections/Fields/radio/components/server/Label#CustomRadioFieldLabelServer',
      },
    },
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'Option 2',
        value: 'option-2',
      },
    ],
  },
  {
    name: 'radioFieldClientComponent',
    type: 'radio',
    admin: {
      components: {
        Field: '@/collections/Fields/radio/components/client/Field#CustomRadioFieldClient',
        Label: '@/collections/Fields/radio/components/client/Label#CustomRadioFieldLabelClient',
      },
    },
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'Option 2',
        value: 'option-2',
      },
    ],
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/radio/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { RadioFieldClientComponent } from 'payload'

import { RadioGroupField } from '@payloadcms/ui'
import React from 'react'

export const CustomRadioFieldClient: RadioFieldClientComponent = (props) => {
  return <RadioGroupField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/radio/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { RadioFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomRadioFieldLabelClient: RadioFieldLabelClientComponent = ({ field, path }) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/radio/components/server/Field.tsx
Signals: React

```typescript
import type { RadioFieldServerComponent } from 'payload'
import type React from 'react'

import { RadioGroupField } from '@payloadcms/ui'

export const CustomRadioFieldServer: RadioFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <RadioGroupField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/radio/components/server/Label.tsx
Signals: React

```typescript
import type { RadioFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomRadioFieldLabelServer: RadioFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/custom-components/src/collections/Fields/relationship/index.ts

```typescript
import type { CollectionConfig } from 'payload'

export const relationshipFields: CollectionConfig['fields'] = [
  {
    name: 'relationshipFieldServerComponent',
    type: 'relationship',
    admin: {
      components: {
        Field:
          '@/collections/Fields/relationship/components/server/Field#CustomRelationshipFieldServer',
        Label:
          '@/collections/Fields/relationship/components/server/Label#CustomRelationshipFieldLabelServer',
      },
    },
    relationTo: 'custom-fields',
  },
  {
    name: 'relationshipFieldClientComponent',
    type: 'relationship',
    admin: {
      components: {
        Field:
          '@/collections/Fields/relationship/components/client/Field#CustomRelationshipFieldClient',
        Label:
          '@/collections/Fields/relationship/components/client/Label#CustomRelationshipFieldLabelClient',
      },
    },
    relationTo: 'custom-fields',
  },
]
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/relationship/components/client/Field.tsx
Signals: React

```typescript
'use client'
import type { RelationshipFieldClientComponent } from 'payload'

import { RelationshipField } from '@payloadcms/ui'
import React from 'react'

export const CustomRelationshipFieldClient: RelationshipFieldClientComponent = (props) => {
  return <RelationshipField {...props} />
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/relationship/components/client/Label.tsx
Signals: React

```typescript
'use client'
import type { RelationshipFieldLabelClientComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomRelationshipFieldLabelClient: RelationshipFieldLabelClientComponent = ({
  field,
  path,
}) => {
  return <FieldLabel label={field?.label || field?.name} path={path} required={field?.required} />
}
```

--------------------------------------------------------------------------------

---[FILE: Field.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/relationship/components/server/Field.tsx
Signals: React

```typescript
import type { RelationshipFieldServerComponent } from 'payload'
import type React from 'react'

import { RelationshipField } from '@payloadcms/ui'

export const CustomRelationshipFieldServer: RelationshipFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <RelationshipField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Label.tsx]---
Location: payload-main/examples/custom-components/src/collections/Fields/relationship/components/server/Label.tsx
Signals: React

```typescript
import type { RelationshipFieldLabelServerComponent } from 'payload'

import { FieldLabel } from '@payloadcms/ui'
import React from 'react'

export const CustomRelationshipFieldLabelServer: RelationshipFieldLabelServerComponent = ({
  clientField,
  path,
}) => {
  return (
    <FieldLabel
      label={clientField?.label || clientField?.name}
      path={path}
      required={clientField?.required}
    />
  )
}
```

--------------------------------------------------------------------------------

````
