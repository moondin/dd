---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 89
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 89 of 695)

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

---[FILE: type.scss]---
Location: payload-main/examples/form-builder/src/css/type.scss

```text
@use 'queries' as *;

/////////////////////////////
// HEADINGS
/////////////////////////////

%h1,
%h2,
%h3,
%h4,
%h5,
%h6 {
  font-weight: 700;
}

%h1 {
  margin: 50px 0;
  font-size: 84px;
  line-height: 1;

  @include mid-break {
    font-size: 70px;
  }

  @include small-break {
    margin: 24px 0;
    font-size: 36px;
    line-height: 42px;
  }
}

%h2 {
  margin: 32px 0;
  font-size: 56px;
  line-height: 1;

  @include mid-break {
    margin: 36px 0;
    font-size: 48px;
  }

  @include small-break {
    margin: 24px 0;
    font-size: 28px;
    line-height: 32px;
  }
}

%h3 {
  margin: 28px 0;
  font-size: 48px;
  line-height: 56px;

  @include mid-break {
    font-size: 40px;
    line-height: 48px;
  }

  @include small-break {
    margin: 24px 0;
    font-size: 24px;
    line-height: 30px;
  }
}

%h4 {
  margin: 24px 0;
  font-size: 40px;
  line-height: 48px;

  @include mid-break {
    font-size: 33px;
    line-height: 36px;
  }

  @include small-break {
    margin: 20px 0;
    font-size: 20px;
    line-height: 24px;
  }
}

%h5 {
  margin: 20px 0;
  font-size: 32px;
  line-height: 42px;

  @include mid-break {
    font-size: 26px;
    line-height: 32px;
  }

  @include small-break {
    margin: 16px 0;
    font-size: 18px;
    line-height: 24px;
  }
}

%h6 {
  margin: 20px 0;
  font-size: 24px;
  line-height: 28px;

  @include mid-break {
    font-size: 20px;
    line-height: 30px;
  }

  @include small-break {
    margin: 16px 0;
    font-size: 16px;
    line-height: 22px;
  }
}

/////////////////////////////
// TYPE STYLES
/////////////////////////////

%body {
  font-size: 18px;
  line-height: 32px;

  @include mid-break {
    font-size: 15px;
    line-height: 24px;
  }

  @include small-break {
    font-size: 13px;
    line-height: 24px;
  }
}

%large-body {
  font-size: 25px;
  line-height: 32px;

  @include mid-break {
    font-size: 22px;
    line-height: 30px;
  }

  @include small-break {
    font-size: 17px;
    line-height: 24px;
  }
}

%label {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 3px;
  text-transform: uppercase;

  @include mid-break {
    font-size: 13px;
    letter-spacing: 2.75px;
  }

  @include small-break {
    font-size: 12px;
    line-height: 18px;
    letter-spacing: 2.625px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/examples/form-builder/src/fields/link.ts

```typescript
import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'

export const appearanceOptions = {
  default: {
    label: 'Default',
    value: 'default',
  },
  primary: {
    label: 'Primary Button',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary Button',
    value: 'secondary',
  },
}

export type LinkAppearances = 'default' | 'primary' | 'secondary'

type LinkType = (options?: {
  appearances?: false | LinkAppearances[]
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 1,
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkTypes[0].admin!.width = '50%'
    linkTypes[1].admin!.width = '50%'

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.primary,
      appearanceOptions.secondary,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}

export default link
```

--------------------------------------------------------------------------------

---[FILE: slug.ts]---
Location: payload-main/examples/form-builder/src/fields/slug.ts

```typescript
import type { Field } from 'payload'

import deepMerge from '../utilities/deepMerge'
import { formatSlug } from '../utilities/formatSlug'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
      index: true,
      label: 'Slug',
    },
    overrides,
  )
```

--------------------------------------------------------------------------------

---[FILE: MainMenu.ts]---
Location: payload-main/examples/form-builder/src/globals/MainMenu.ts

```typescript
import type { GlobalConfig } from 'payload'

import link from '../fields/link'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/examples/form-builder/src/migrations/seed.ts

```typescript
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

import { home } from '../seed/home'

import { advanced } from '../seed/advanced'
import { advancedForm } from '../seed/advancedForm'
import { basicForm } from '../seed/basicForm'
import { contact } from '../seed/contact'
import { contactForm } from '../seed/contactForm'
import { signUp } from '../seed/signUp'
import { signUpForm } from '../seed/signUpForm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
    },
  })

  const basicFormJSON = JSON.parse(JSON.stringify(basicForm))

  const { id: basicFormID } = await payload.create({
    collection: 'forms',
    data: basicFormJSON,
  })

  const contactFormJSON = JSON.parse(JSON.stringify(contactForm))

  const { id: contactFormID } = await payload.create({
    collection: 'forms',
    data: contactFormJSON,
  })

  const advancedFormJSON = JSON.parse(JSON.stringify(advancedForm))

  const { id: advancedFormID } = await payload.create({
    collection: 'forms',
    data: advancedFormJSON,
  })

  const signUpFormJSON = JSON.parse(JSON.stringify(signUpForm))

  const { id: signUpFormID } = await payload.create({
    collection: 'forms',
    data: signUpFormJSON,
  })

  const homePageJSON = JSON.parse(
    JSON.stringify(home).replace(/\{\{BASIC_FORM_ID\}\}/g, basicFormID.toString()),
  )

  const contactPageJSON = JSON.parse(
    JSON.stringify(contact).replace(/\{\{CONTACT_FORM_ID\}\}/g, contactFormID.toString()),
  )

  const advancedPageJSON = JSON.parse(
    JSON.stringify(advanced).replace(/\{\{ADVANCED_FORM_ID\}\}/g, advancedFormID.toString()),
  )

  const signupPageJSON = JSON.parse(
    JSON.stringify(signUp).replace(/\{\{SIGNUP_FORM_ID\}\}/g, signUpFormID.toString()),
  )

  await payload.create({
    collection: 'pages',
    data: homePageJSON,
  })

  const { id: contactPageID } = await payload.create({
    collection: 'pages',
    data: contactPageJSON,
  })

  const { id: advancedPageID } = await payload.create({
    collection: 'pages',
    data: advancedPageJSON,
  })

  const { id: signupPageID } = await payload.create({
    collection: 'pages',
    data: signupPageJSON,
  })

  await payload.updateGlobal({
    slug: 'main-menu',
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            label: 'Contact Form',
            reference: {
              relationTo: 'pages',
              value: contactPageID,
            },
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Advanced Form',
            reference: {
              relationTo: 'pages',
              value: advancedPageID,
            },
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Signup Form',
            reference: {
              relationTo: 'pages',
              value: signupPageID,
            },
          },
        },
      ],
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: advanced.ts]---
Location: payload-main/examples/form-builder/src/seed/advanced.ts

```typescript
export const advanced = {
  slug: 'advanced',
  _status: 'published',
  layout: [
    {
      id: '63adc92568224b995af9df14',
      blockType: 'formBlock',
      enableIntro: true,
      form: '{{ADVANCED_FORM_ID}}',
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Example advanced form:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: 'Advanced',
}
```

--------------------------------------------------------------------------------

---[FILE: advancedForm.ts]---
Location: payload-main/examples/form-builder/src/seed/advancedForm.ts

```typescript
export const advancedForm = {
  id: '63c0835134d40cef85cc11a2',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Your shipping information submission was successful.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  createdAt: '2023-01-12T22:01:53.023Z',
  emails: [
    {
      id: '6644edb9cffd2c6c48a44730',
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Your example shipping information form submission was received successfully.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: "You've received a new message.",
    },
  ],
  fields: [
    {
      id: '63c081b169853127a8895312',
      name: 'first-name',
      blockName: 'first-name',
      blockType: 'text',
      label: 'First Name',
      required: true,
      width: 50,
    },
    {
      id: '63c081c669853127a8895313',
      name: 'last-name',
      blockName: 'last-name',
      blockType: 'text',
      label: 'Last Name',
      required: true,
      width: 50,
    },
    {
      id: '63c081e869853127a8895314',
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      id: '63c081fe69853127a8895315',
      name: 'street-address',
      blockName: 'street-address',
      blockType: 'text',
      label: 'Street Address',
      required: true,
      width: 100,
    },
    {
      id: '63c0823169853127a8895316',
      name: 'street-address-two',
      blockName: 'street-address-two',
      blockType: 'text',
      label: 'Street Address Line 2',
      width: 100,
    },
    {
      id: '63c0825a69853127a8895317',
      name: 'city',
      blockName: 'city',
      blockType: 'text',
      label: 'City',
      required: true,
      width: 50,
    },
    {
      id: '63c0826569853127a8895318',
      name: 'state',
      blockName: 'state',
      blockType: 'state',
      label: 'State',
      required: true,
      width: 50,
    },
    {
      id: '63c082bb69853127a889531a',
      name: 'zip-code',
      blockName: 'zip-code',
      blockType: 'number',
      label: 'Postal / Zip Code',
      required: true,
      width: 50,
    },
    {
      id: '63c0829269853127a8895319',
      name: 'country',
      blockName: 'country',
      blockType: 'country',
      label: 'Country',
      required: true,
      width: 50,
    },
  ],
  redirect: {},
  submitButtonLabel: 'Submit',
  title: 'Advanced Form',
  updatedAt: '2023-01-12T22:01:53.023Z',
}
```

--------------------------------------------------------------------------------

---[FILE: basicForm.ts]---
Location: payload-main/examples/form-builder/src/seed/basicForm.ts

```typescript
export const basicForm = {
  id: '63c0651b132c8e2783f8dcae',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'The basic form has been submitted successfully.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  createdAt: '2022-12-28T20:48:53.181Z',
  emails: [
    {
      id: '6644edb9cffd2c6c48a44730',
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Your basic form submission was successfully received.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: "You've received a new message.",
    },
  ],
  fields: [
    {
      id: '63adaaba5236fe69ca8973f8',
      name: 'first-name',
      blockName: 'first-name',
      blockType: 'text',
      label: 'First name',
      required: true,
      width: 50,
    },
    {
      id: '63bf4b1fd69cef4f34272f9a',
      name: 'last-name',
      blockName: 'last-name',
      blockType: 'text',
      label: 'Last name',
      required: true,
      width: 50,
    },
    {
      id: '63c0953adc1cd2c2f6c2d30b',
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      id: '63adab96b65c28c168442316',
      name: 'coolest-project',
      blockName: 'coolest-project',
      blockType: 'textarea',
      label: "What's the coolest project you've built with Payload so far?",
      required: false,
      width: 100,
    },
    {
      id: '63adb90db65c28c168442322',
      blockName: 'farewell',
      blockType: 'message',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Have a great rest of your day!',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Sincerely, \n\nPayload Team.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  redirect: {},
  submitButtonLabel: 'Submit',
  title: 'Basic Form',
  updatedAt: '2023-01-12T21:25:41.113Z',
}
```

--------------------------------------------------------------------------------

---[FILE: contact.ts]---
Location: payload-main/examples/form-builder/src/seed/contact.ts

```typescript
export const contact = {
  slug: 'contact',
  _status: 'published',
  layout: [
    {
      id: '63adc92568224b995af9df13',
      blockType: 'formBlock',
      enableIntro: true,
      form: '{{CONTACT_FORM_ID}}',
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Example contact form:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: 'Contact',
}
```

--------------------------------------------------------------------------------

---[FILE: contactForm.ts]---
Location: payload-main/examples/form-builder/src/seed/contactForm.ts

```typescript
export const contactForm = {
  id: '63c07ffd4cb6b574b4977573',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'The contact form has been submitted successfully.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  createdAt: '2023-01-12T21:47:41.374Z',
  emails: [
    {
      id: '6644edb9cffd2c6c48a44730',
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Your contact form submission was successfully received.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: "You've received a new message.",
    },
  ],
  fields: [
    {
      id: '63c07f4e69853127a889530c',
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Full Name',
      required: true,
      width: 100,
    },
    {
      id: '63c07f7069853127a889530d',
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 50,
    },
    {
      id: '63c07f8169853127a889530e',
      name: 'phone',
      blockName: 'phone',
      blockType: 'number',
      label: 'Phone',
      required: false,
      width: 50,
    },
    {
      id: '63c07f9d69853127a8895310',
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: 'Message',
      required: true,
      width: 100,
    },
  ],
  redirect: {},
  submitButtonLabel: 'Submit',
  title: 'Contact Form',
  updatedAt: '2023-01-12T21:47:41.374Z',
}
```

--------------------------------------------------------------------------------

---[FILE: home.ts]---
Location: payload-main/examples/form-builder/src/seed/home.ts

```typescript
export const home = {
  slug: 'home',
  _status: 'published',
  layout: [
    {
      id: '63adc92568224b995af9df12',
      blockType: 'formBlock',
      enableIntro: true,
      form: '{{BASIC_FORM_ID}}',
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Example basic form:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: 'Home',
}
```

--------------------------------------------------------------------------------

---[FILE: signUp.ts]---
Location: payload-main/examples/form-builder/src/seed/signUp.ts

```typescript
export const signUp = {
  slug: 'sign-up',
  _status: 'published',
  layout: [
    {
      id: '63adc92568224b995af9df15',
      blockType: 'formBlock',
      enableIntro: true,
      form: '{{SIGNUP_FORM_ID}}',
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Example sign-up form:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h3',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: 'Sign Up',
}
```

--------------------------------------------------------------------------------

---[FILE: signUpForm.ts]---
Location: payload-main/examples/form-builder/src/seed/signUpForm.ts

```typescript
export const signUpForm = {
  id: '63c086c36955e39c4208aa8f',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Your sign up submission was successful.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message',
  createdAt: '2023-01-12T22:16:35.480Z',
  emails: [
    {
      id: '6644edb9cffd2c6c48a44730',
      emailFrom: '"Payload" \u003Cdemo@payloadcms.com\u003E',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Your sign up submission was received successfully.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: "You've received a new message.",
    },
    {
      id: '6644edb9cffd2c6c48a4472f',
      subject: "You've received a new message.",
    },
  ],
  fields: [
    {
      id: '63c085ae69853127a889531e',
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Full Name',
      required: true,
      width: 100,
    },
    {
      id: '63c085df69853127a889531f',
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      id: '63c0861869853127a8895321',
      name: 'password',
      blockName: 'password',
      blockType: 'text',
      label: 'Password',
      required: true,
      width: 100,
    },
    {
      id: '63c0865769853127a8895324',
      blockType: 'message',
      message: [
        {
          children: [
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
          ],
        },
      ],
    },
    {
      id: '63c086a469853127a8895325',
      name: 'terms-and-conditions',
      blockName: 'terms-and-conditions',
      blockType: 'checkbox',
      label: 'I agree to the terms and conditions',
      required: true,
    },
  ],
  redirect: {},
  submitButtonLabel: 'Create Account',
  title: 'Sign Up Form',
  updatedAt: '2023-01-12T22:16:35.480Z',
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/examples/form-builder/src/utilities/deepMerge.ts

```typescript
// @ts-nocheck

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
// eslint-disable-next-line no-restricted-exports
export default function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}
```

--------------------------------------------------------------------------------

---[FILE: formatSlug.ts]---
Location: payload-main/examples/form-builder/src/utilities/formatSlug.ts

```typescript
import type { FieldHook } from 'payload'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = (data && data[fallback]) || (originalDoc && originalDoc[fallback])

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }
```

--------------------------------------------------------------------------------

---[FILE: getGlobals.ts]---
Location: payload-main/examples/form-builder/src/utilities/getGlobals.ts
Signals: Next.js

```typescript
import type { Config } from 'src/payload-types'

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import configPromise from '../payload.config'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
  unstable_cache(async () => getGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
```

--------------------------------------------------------------------------------

---[FILE: toKebabCase.ts]---
Location: payload-main/examples/form-builder/src/utilities/toKebabCase.ts

```typescript
export const toKebabCase = (string) =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
```

--------------------------------------------------------------------------------

---[FILE: .env.example]---
Location: payload-main/examples/live-preview/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-example-live-preview
PAYLOAD_SECRET=ENTER-STRING-HERE
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: payload-main/examples/live-preview/.eslintrc.cjs

```text
module.exports = {
  extends: 'next',
  root: true,
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/live-preview/.gitignore

```text
build
dist
node_modules
package-lock.json
.env
```

--------------------------------------------------------------------------------

---[FILE: next-env.d.ts]---
Location: payload-main/examples/live-preview/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/examples/live-preview/next.config.mjs

```text
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig)
```

--------------------------------------------------------------------------------

---[FILE: package.json]---
Location: payload-main/examples/live-preview/package.json
Signals: React, Next.js

```json
{
  "name": "payload-example-live-preview",
  "version": "1.0.0",
  "description": "Payload Live Preview example.",
  "license": "MIT",
  "type": "module",
  "main": "dist/server.js",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation && pnpm seed && next dev",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:schema": "payload-graphql generate:schema",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "lint": "cross-env NODE_OPTIONS=--no-deprecation next lint",
    "lint:fix": "eslint --fix --ext .ts,.tsx src",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "seed": "npm run payload migrate:fresh",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/live-preview-react": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/richtext-slate": "latest",
    "@payloadcms/ui": "latest",
    "cross-env": "^7.0.3",
    "dotenv": "^8.2.0",
    "escape-html": "^1.0.3",
    "graphql": "^16.9.0",
    "next": "^15.4.10",
    "payload": "latest",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "react-hook-form": "^7.51.3"
  },
  "devDependencies": {
    "@payloadcms/graphql": "latest",
    "@swc/core": "^1.4.14",
    "@swc/types": "^0.1.6",
    "@types/escape-html": "^1.0.2",
    "@types/node": "^20.11.25",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "dotenv": "^16.4.5",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "slate": "^0.82.0",
    "tsx": "^4.7.1",
    "typescript": "5.5.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
