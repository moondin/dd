---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 82
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 82 of 695)

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
Location: payload-main/examples/draft-preview/src/collections/Pages/index.ts

```typescript
import type { CollectionConfig, CollectionSlug } from 'payload'

import richText from '../../fields/richText'
import { loggedIn } from './access/loggedIn'
import { publishedOrLoggedIn } from './access/publishedOrLoggedIn'
import { formatSlug } from './hooks/formatSlug'
import { revalidatePage } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: loggedIn,
    delete: loggedIn,
    read: publishedOrLoggedIn,
    update: loggedIn,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: ({ slug, collection }: { slug: string; collection: CollectionSlug }) => {
      const encodedParams = new URLSearchParams({
        slug,
        collection,
        path: `/${slug}`,
        previewSecret: process.env.PREVIEW_SECRET || '',
      })

      return `${process.env.NEXT_PUBLIC_SERVER_URL}/preview?${encodedParams.toString()}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
      index: true,
      label: 'Slug',
    },
    richText(),
  ],
  hooks: {
    afterChange: [revalidatePage],
  },
  versions: {
    drafts: true,
  },
}
```

--------------------------------------------------------------------------------

---[FILE: loggedIn.ts]---
Location: payload-main/examples/draft-preview/src/collections/Pages/access/loggedIn.ts

```typescript
import type { Access } from 'payload'

export const loggedIn: Access = ({ req: { user } }) => {
  return Boolean(user)
}
```

--------------------------------------------------------------------------------

---[FILE: publishedOrLoggedIn.ts]---
Location: payload-main/examples/draft-preview/src/collections/Pages/access/publishedOrLoggedIn.ts

```typescript
import type { Access } from 'payload'

export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    or: [
      {
        _status: {
          equals: 'published',
        },
      },
    ],
  }
}
```

--------------------------------------------------------------------------------

---[FILE: formatSlug.ts]---
Location: payload-main/examples/draft-preview/src/collections/Pages/hooks/formatSlug.ts

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
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }
```

--------------------------------------------------------------------------------

---[FILE: revalidatePage.ts]---
Location: payload-main/examples/draft-preview/src/collections/Pages/hooks/revalidatePage.ts
Signals: Next.js

```typescript
import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Page } from '@payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({ doc, previousDoc, req }) => {
  if (req.context.skipRevalidate) {
    return doc
  }

  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    req.payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }

  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
    req.payload.logger.info(`Revalidating old page at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/components/AdminBar/index.module.scss

```text
.adminBar {
  z-index: 10;
  width: 100%;
  background-color: rgba(var(--foreground-rgb), 0.075);
  padding: calc(var(--base) * 0.5) 0;
  display: none;
  visibility: hidden;
  opacity: 0;
  transition: opacity 150ms linear;
}

.payloadAdminBar {
  color: rgb(var(--foreground-rgb)) !important;
}

.show {
  display: block;
  visibility: visible;
  opacity: 1;
}

.controls {
  & > *:not(:last-child) {
    margin-right: calc(var(--base) * 0.5) !important;
  }
}

.user {
  margin-right: calc(var(--base) * 0.5) !important;
}

.logo {
  margin-right: calc(var(--base) * 0.5) !important;
}

.innerLogo {
  width: 100%;
}

.container {
  position: relative;
}

.hr {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rbg(var(--background-rgb));
  height: 2px;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/AdminBar/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { PayloadAdminBarProps } from '@payloadcms/admin-bar'

import { useRouter } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'

import { Gutter } from '../Gutter'
import classes from './index.module.scss'

const collectionLabels = {
  pages: {
    plural: 'Pages',
    singular: 'Page',
  },
}

const Title: React.FC = () => <span>Dashboard</span>

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
}> = (props) => {
  const { adminBarProps } = props || {}
  const [show, setShow] = useState(false)
  const collection = 'pages'
  const router = useRouter()

  const onAuthChange = React.useCallback((user) => {
    setShow(user?.id)
  }, [])

  return (
    <div className={[classes.adminBar, show && classes.show].filter(Boolean).join(' ')}>
      <Gutter className={classes.container}>
        <PayloadAdminBar
          {...adminBarProps}
          className={classes.payloadAdminBar}
          classNames={{
            controls: classes.controls,
            logo: classes.logo,
            user: classes.user,
          }}
          cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || 'Pages',
            singular: collectionLabels[collection]?.singular || 'Page',
          }}
          logo={<Title />}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            fetch('/next/exit-preview')
              .then(() => {
                router.push('/')
                router.refresh()
              })
              .catch((error) => {
                console.error('Error exiting preview:', error)
              })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </Gutter>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/components/Button/index.module.scss

```text
.button {
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  background-color: transparent;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-around;

  svg {
    margin-right: calc(var(--base) / 2);
    width: var(--base);
    height: var(--base);
  }
}

.label {
  text-align: center;
  display: flex;
  align-items: center;
}

.button {
  text-decoration: none;
  display: inline-flex;
  padding: 12px 24px;
}

.primary--white {
  background-color: black;
  color: white;
}

.primary--black {
  background-color: white;
  color: black;
}

.secondary--white {
  background-color: white;
  box-shadow: inset 0 0 0 1px black;
}

.secondary--black {
  background-color: black;
  box-shadow: inset 0 0 0 1px white;
}

.appearance--default {
  padding: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/Button/index.tsx
Signals: React, Next.js

```typescript
import type { ElementType } from 'react'

import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  el?: 'a' | 'button' | 'link'
  href?: string
  label?: string
  newTab?: boolean | null
  onClick?: () => void
  type?: 'button' | 'submit'
}

export const Button: React.FC<Props> = ({
  type = 'button',
  appearance,
  className: classNameFromProps,
  disabled,
  el: elFromProps = 'link',
  href,
  label,
  newTab,
  onClick,
}) => {
  let el = elFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const className = [
    classes.button,
    classNameFromProps,
    classes[`appearance--${appearance}`],
    classes.button,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={classes.content}>
      {/* <Chevron /> */}
      <span className={classes.label}>{label}</span>
    </div>
  )

  if (onClick || type === 'submit') {
    el = 'button'
  }

  if (el === 'link') {
    return (
      <Link className={className} href={href || ''} {...newTabProps} onClick={onClick}>
        {content}
      </Link>
    )
  }

  const Element: ElementType = el

  return (
    <Element
      className={className}
      href={href}
      type={type}
      {...newTabProps}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </Element>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/CMSLink/index.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

import type { Page } from '@payload-types'

import { Button } from '../Button'

export type CMSLinkType = {
  appearance?: 'default' | 'primary' | 'secondary'
  children?: React.ReactNode
  className?: string
  label?: string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: number | Page | string
  } | null
  type?: 'custom' | 'reference' | null
  url?: null | string
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance,
  children,
  className,
  label,
  newTab,
  reference,
  url,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) {
    return null
  }

  if (!appearance) {
    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (type === 'custom') {
      return (
        <a href={url || ''} {...newTabProps} className={className}>
          {label && label}
          {children ? <>{children}</> : null}
        </a>
      )
    }

    if (href) {
      return (
        <Link href={href} {...newTabProps} className={className} prefetch={false}>
          {label && label}
          {children ? <>{children}</> : null}
        </Link>
      )
    }
  }

  const buttonProps = {
    appearance,
    href,
    label,
    newTab,
  }

  return <Button className={className} {...buttonProps} el="link" />
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/components/Gutter/index.module.scss

```text
.gutter {
  max-width: var(--max-width);
  width: 100%;
  margin: auto;
}

.gutterLeft {
  padding-left: var(--gutter-h);
}

.gutterRight {
  padding-right: var(--gutter-h);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/Gutter/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  left?: boolean
  ref?: React.Ref<HTMLDivElement>
  right?: boolean
}

export const Gutter: React.FC<Props & { ref?: React.Ref<HTMLDivElement> }> = (props) => {
  const { children, className, left = true, right = true, ref } = props

  return (
    <div
      className={[
        classes.gutter,
        left && classes.gutterLeft,
        right && classes.gutterRight,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/components/Header/index.module.scss

```text
.header {
  padding: var(--base) 0;
}

.wrap {
  display: flex;
  justify-content: space-between;
  gap: calc(var(--base) / 2);
  flex-wrap: wrap;
}

.logo {
  flex-shrink: 0;
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--base);
  white-space: nowrap;
  overflow: hidden;
  flex-wrap: wrap;

  a {
    display: block;
    text-decoration: none;
  }

  @media (max-width: 1000px) {
    gap: 0 calc(var(--base) / 2);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/Header/index.tsx
Signals: React, Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { MainMenu } from '@payload-types'

import { CMSLink } from '../CMSLink'
import { Gutter } from '../Gutter'
import classes from './index.module.scss'

export async function Header() {
  const payload = await getPayload({ config: configPromise })

  const header: MainMenu = await payload.findGlobal({
    slug: 'main-menu',
    depth: 1,
  })

  const navItems = header?.navItems || []

  return (
    <header className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link className={classes.logo} href="/">
          <picture>
            <source
              media="(prefers-color-scheme: dark)"
              srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
            />
            <Image
              alt="Payload Logo"
              height={30}
              src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg"
              width={150}
            />
          </picture>
        </Link>
        <nav className={classes.nav}>
          {navItems.map(({ link }, i) => {
            const sanitizedLink = {
              ...link,
              type: link.type ?? undefined,
              newTab: link.newTab ?? false,
              url: link.url ?? undefined,
            }

            return <CMSLink key={i} {...sanitizedLink} />
          })}
        </nav>
      </Gutter>
    </header>
  )
}

export default Header
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/draft-preview/src/components/RichText/index.module.scss

```text
.richText {
  :first-child {
    margin-top: 0;
  }

  a {
    text-decoration: underline;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/draft-preview/src/components/RichText/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'
import serialize from './serialize'

const RichText: React.FC<{ className?: string; content: any }> = ({ className, content }) => {
  if (!content) {
    return null
  }

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {serialize(content)}
    </div>
  )
}

export default RichText
```

--------------------------------------------------------------------------------

---[FILE: serialize.tsx]---
Location: payload-main/examples/draft-preview/src/components/RichText/serialize.tsx
Signals: React

```typescript
import escapeHTML from 'escape-html'
import React, { Fragment } from 'react'
import { Text } from 'slate'

type Children = Leaf[]

type Leaf = {
  [key: string]: unknown
  children: Children
  type: string
  url?: string
  value?: {
    alt: string
    url: string
  }
}

const serialize = (children: Children): React.ReactNode[] =>
  children.map((node, i) => {
    if (Text.isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }

      if (node.code) {
        text = <code key={i}>{text}</code>
      }

      if (node.italic) {
        text = <em key={i}>{text}</em>
      }

      if (node.underline) {
        text = (
          <span key={i} style={{ textDecoration: 'underline' }}>
            {text}
          </span>
        )
      }

      if (node.strikethrough) {
        text = (
          <span key={i} style={{ textDecoration: 'line-through' }}>
            {text}
          </span>
        )
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    switch (node.type) {
      case 'blockquote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
      case 'h1':
        return <h1 key={i}>{serialize(node.children)}</h1>
      case 'h2':
        return <h2 key={i}>{serialize(node.children)}</h2>
      case 'h3':
        return <h3 key={i}>{serialize(node.children)}</h3>
      case 'h4':
        return <h4 key={i}>{serialize(node.children)}</h4>
      case 'h5':
        return <h5 key={i}>{serialize(node.children)}</h5>
      case 'h6':
        return <h6 key={i}>{serialize(node.children)}</h6>
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>
      case 'link':
        return (
          <a href={escapeHTML(node.url)} key={i}>
            {serialize(node.children)}
          </a>
        )
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>

      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })

export default serialize
```

--------------------------------------------------------------------------------

---[FILE: link.ts]---
Location: payload-main/examples/draft-preview/src/fields/link.ts

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
    if (linkTypes[0].admin) {
      linkTypes[0].admin.width = '50%'
    }
    if (linkTypes[1].admin) {
      linkTypes[1].admin.width = '50%'
    }

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

---[FILE: elements.ts]---
Location: payload-main/examples/draft-preview/src/fields/richText/elements.ts

```typescript
import type { RichTextElement } from '@payloadcms/richtext-slate'

const elements: RichTextElement[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'link']

export default elements
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/draft-preview/src/fields/richText/index.ts

```typescript
import type { RichTextElement, RichTextLeaf } from '@payloadcms/richtext-slate'
import type { RichTextField } from 'payload'

import { slateEditor } from '@payloadcms/richtext-slate'

import deepMerge from '../../utilities/deepMerge'
import link from '../link'
import elements from './elements'
import leaves from './leaves'

type RichText = (
  overrides?: Partial<RichTextField>,
  additions?: {
    elements?: RichTextElement[]
    leaves?: RichTextLeaf[]
  },
) => RichTextField

const richText: RichText = (
  overrides = {},
  additions = {
    elements: [],
    leaves: [],
  },
) =>
  deepMerge<RichTextField, Partial<RichTextField>>(
    {
      name: 'richText',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [...elements, ...(additions.elements || [])],
          leaves: [...leaves, ...(additions.leaves || [])],
          upload: {
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'richText',
                    editor: slateEditor({
                      admin: {
                        elements: [...elements],
                        leaves: [...leaves],
                      },
                    }),
                    label: 'Caption',
                  },
                  {
                    name: 'alignment',
                    type: 'radio',
                    label: 'Alignment',
                    options: [
                      {
                        label: 'Left',
                        value: 'left',
                      },
                      {
                        label: 'Center',
                        value: 'center',
                      },
                      {
                        label: 'Right',
                        value: 'right',
                      },
                    ],
                  },
                  {
                    name: 'enableLink',
                    type: 'checkbox',
                    label: 'Enable Link',
                  },
                  link({
                    appearances: false,
                    disableLabel: true,
                    overrides: {
                      admin: {
                        condition: (_: any, data: { enableLink: any }) => Boolean(data?.enableLink),
                      },
                    },
                  }),
                ],
              },
            },
          },
        },
      }),
      required: true,
    },
    overrides,
  )

export default richText
```

--------------------------------------------------------------------------------

---[FILE: leaves.ts]---
Location: payload-main/examples/draft-preview/src/fields/richText/leaves.ts

```typescript
import type { RichTextLeaf } from '@payloadcms/richtext-slate'

const defaultLeaves: RichTextLeaf[] = ['bold', 'italic', 'underline']

export default defaultLeaves
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/examples/draft-preview/src/globals/MainMenu/index.ts

```typescript
import type { GlobalConfig } from 'payload'

import link from '../../fields/link'
import { revalidateMainMenu } from './hooks/revalidateMainMenu'

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
  hooks: {
    afterChange: [revalidateMainMenu],
  },
}
```

--------------------------------------------------------------------------------

---[FILE: revalidateMainMenu.ts]---
Location: payload-main/examples/draft-preview/src/globals/MainMenu/hooks/revalidateMainMenu.ts
Signals: Next.js

```typescript
import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateMainMenu: GlobalAfterChangeHook = ({ doc, req, req: { payload } }) => {
  payload.logger.info(`Revalidating main menu`)

  if (req.context.skipRevalidate) {
    return doc
  }

  revalidateTag('global_main-menu')

  return doc
}
```

--------------------------------------------------------------------------------

---[FILE: seed.ts]---
Location: payload-main/examples/draft-preview/src/migrations/seed.ts

```typescript
import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

import { home } from '../seed/home'
import { examplePage } from '../seed/page'
import { examplePageDraft } from '../seed/pageDraft'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
    },
  })

  const { id: examplePageID } = await payload.create({
    collection: 'pages',
    context: {
      skipRevalidate: true,
    },
    data: examplePage as any, // eslint-disable-line
  })

  await payload.update({
    id: examplePageID,
    collection: 'pages',
    context: {
      skipRevalidate: true,
    },
    data: examplePageDraft as any, // eslint-disable-line
    draft: true,
  })

  const homepageJSON = JSON.parse(JSON.stringify(home).replace('{{DRAFT_PAGE_ID}}', examplePageID))

  const { id: homePageID } = await payload.create({
    collection: 'pages',
    context: {
      skipRevalidate: true,
    },
    data: homepageJSON,
  })

  await payload.updateGlobal({
    slug: 'main-menu',
    context: {
      skipRevalidate: true,
    },
    data: {
      navItems: [
        {
          link: {
            type: 'reference',
            label: 'Home',
            reference: {
              relationTo: 'pages',
              value: homePageID,
            },
            url: '',
          },
        },
        {
          link: {
            type: 'reference',
            label: 'Example Page',
            reference: {
              relationTo: 'pages',
              value: examplePageID,
            },
            url: '',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'Dashboard',
            reference: undefined,
            url: 'http://localhost:3000/admin',
          },
        },
      ],
    },
  })
}
```

--------------------------------------------------------------------------------

---[FILE: home.ts]---
Location: payload-main/examples/draft-preview/src/seed/home.ts

```typescript
import type { Page } from '@payload-types'

// Used for pre-seeded content so that the homepage is not empty
// @ts-expect-error: Page type is not fully compatible with the provided object structure
export const home: Page = {
  slug: 'home',
  _status: 'published',
  richText: [
    {
      children: [
        { text: 'This is a ' },
        { type: 'link', children: [{ text: '' }], newTab: true, url: 'https://nextjs.org/' },
        { text: '' },
        {
          type: 'link',
          children: [{ text: 'Next.js' }],
          linkType: 'custom',
          newTab: true,
          url: 'https://nextjs.org/',
        },
        { text: " app made explicitly for Payload's " },
        {
          type: 'link',
          children: [{ text: 'Draft Preview Example' }],
          linkType: 'custom',
          newTab: true,
          url: 'https://github.com/payloadcms/payload/tree/main/examples/draft-preview/payload',
        },
        { text: '. This example demonstrates how to implement draft preview into Payload using ' },
        {
          type: 'link',
          children: [{ text: 'Drafts' }],
          newTab: true,
          url: 'https://payloadcms.com/docs/versions/drafts#drafts',
        },
        { text: '.' },
      ],
    },
    { children: [{ text: '' }] },
    {
      children: [
        {
          type: 'link',
          children: [{ text: 'Log in to the admin panel' }],
          linkType: 'custom',
          newTab: true,
          url: 'http://localhost:3000/admin',
        },
        { text: ' and refresh this page to see the ' },
        {
          type: 'link',
          children: [{ text: 'Payload Admin Bar' }],
          linkType: 'custom',
          newTab: true,
          url: 'https://github.com/payloadcms/payload/tree/main/packages/admin-bar',
        },
        {
          text: ' appear at the top of this site. This will allow you to seamlessly navigate between the two apps. Then, navigate to the ',
        },
        {
          type: 'link',
          children: [{ text: 'example page' }],
          linkType: 'custom',
          url: 'http://localhost:3000/example-page',
        },
        { text: ' to see how we control access to draft content. ' },
      ],
    },
  ],
  title: 'Home Page',
}
```

--------------------------------------------------------------------------------

---[FILE: page.ts]---
Location: payload-main/examples/draft-preview/src/seed/page.ts

```typescript
import type { Page } from '@payload-types'

export const examplePage: Partial<Page> = {
  slug: 'example-page',
  _status: 'published',
  richText: [
    {
      children: [
        {
          text: 'This is an example page with two versions, draft and published. You are currently seeing ',
        },
        {
          bold: true,
          text: 'published',
        },
        {
          text: ' content because you are not in preview mode. ',
        },
        {
          type: 'link',
          children: [{ text: 'Log in to the admin panel' }],
          linkType: 'custom',
          newTab: true,
          url: 'http://localhost:3000/admin',
        },
        {
          text: ' and click "preview" to return to this page and view the latest draft content in Next.js preview mode. To make additional changes to the draft, click "save draft" before returning to the preview.',
        },
      ],
    },
  ],
  title: 'Example Page (Published)',
}
```

--------------------------------------------------------------------------------

---[FILE: pageDraft.ts]---
Location: payload-main/examples/draft-preview/src/seed/pageDraft.ts

```typescript
import type { Page } from '@payload-types'

export const examplePageDraft: Partial<Page> = {
  richText: [
    {
      children: [
        {
          text: 'This page is an example page with two versions, draft and published. You are currently seeing ',
        },
        {
          bold: true,
          text: 'draft',
        },
        {
          text: ' content because you in preview mode. ',
        },
        {
          type: 'link',
          children: [{ text: 'Log out' }],
          linkType: 'custom',
          newTab: true,
          url: 'http://localhost:3000/admin/logout',
        },
        {
          text: ' or click "exit preview mode" from the Payload Admin Bar to see the latest published content. To make additional changes to the draft, click "save draft" before returning to the preview.',
        },
      ],
    },
  ],
  title: 'Example Page (Draft)',
}
```

--------------------------------------------------------------------------------

---[FILE: deepMerge.ts]---
Location: payload-main/examples/draft-preview/src/utilities/deepMerge.ts

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

---[FILE: .env.example]---
Location: payload-main/examples/email/.env.example

```text
DATABASE_URI=mongodb://127.0.0.1/payload-example-email
NODE_ENV=development
PAYLOAD_SECRET=PAYLOAD_EMAIL_EXAMPLE_SECRET_KEY
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

--------------------------------------------------------------------------------

---[FILE: .eslintrc.cjs]---
Location: payload-main/examples/email/.eslintrc.cjs

```text
module.exports = {
  root: true,
  extends: ['@payloadcms'],
}
```

--------------------------------------------------------------------------------

---[FILE: .gitignore]---
Location: payload-main/examples/email/.gitignore

```text
build
dist
node_modules
package-lock.json
.env
```

--------------------------------------------------------------------------------

---[FILE: .swcrc]---
Location: payload-main/examples/email/.swcrc

```text
{
  "$schema": "https://json.schemastore.org/swcrc",
  "sourceMaps": true,
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

---[FILE: next-env.d.ts]---
Location: payload-main/examples/email/next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.
```

--------------------------------------------------------------------------------

---[FILE: next.config.mjs]---
Location: payload-main/examples/email/next.config.mjs

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
Location: payload-main/examples/email/package.json
Signals: React, Next.js

```json
{
  "name": "payload-example-email",
  "version": "1.0.0",
  "description": "Payload Email integration example.",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "_dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env PAYLOAD_SEED=true PAYLOAD_DROP_DATABASE=true NODE_OPTIONS=--no-deprecation next dev",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:schema": "payload-graphql generate:schema",
    "generate:types": "payload generate:types",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/email-nodemailer": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "@payloadcms/ui": "latest",
    "cross-env": "^7.0.3",
    "dotenv": "^8.2.0",
    "ejs": "3.1.10",
    "graphql": "^16.9.0",
    "juice": "11.0.0",
    "next": "^15.4.10",
    "payload": "latest",
    "react": "^19.2.1",
    "react-dom": "^19.2.1"
  },
  "devDependencies": {
    "@payloadcms/graphql": "latest",
    "@swc/core": "^1.6.13",
    "@types/ejs": "^3.1.5",
    "@types/react": "19.2.1",
    "@types/react-dom": "19.2.1",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "tsx": "^4.16.2",
    "typescript": "5.5.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

--------------------------------------------------------------------------------

````
