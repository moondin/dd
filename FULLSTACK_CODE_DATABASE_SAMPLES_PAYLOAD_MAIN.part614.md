---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 614
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 614 of 695)

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

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/Link/index.tsx
Signals: React, Next.js

```typescript
import NextLinkImport from 'next/link.js'
import React from 'react'

import type { Page, Post } from '../../../../payload-types.js'
import type { Props as ButtonProps } from '../Button/index.js'

import { Button } from '../Button/index.js'

const NextLink = 'default' in NextLinkImport ? NextLinkImport.default : NextLinkImport

type CMSLinkType = {
  appearance?: ButtonProps['appearance']
  children?: React.ReactNode
  className?: string
  invert?: ButtonProps['invert']
  label?: string
  newTab?: boolean
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string
  }
  type?: 'custom' | 'reference'
  url?: string
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance,
  children,
  className,
  invert,
  label,
  newTab,
  reference,
  url,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/live-preview${reference.relationTo === 'posts' ? '/posts' : ''}/${reference.value.slug}`
      : url

  if (!href) {
    return null
  }

  if (!appearance) {
    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (href || url) {
      return (
        <NextLink {...newTabProps} className={className} href={href || url || ''}>
          {label && label}
          {children || null}
        </NextLink>
      )
    }
  }

  return (
    <Button
      appearance={appearance}
      className={className}
      href={href}
      invert={invert}
      label={label}
      newTab={newTab}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/index.tsx
Signals: React

```typescript
import type { ElementType } from 'react'

import React, { Fragment } from 'react'

import type { Props } from './types.js'

import { Image } from './Image/index.js'
import { Video } from './Video/index.js'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
  const Tag = htmlElement || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/types.ts
Signals: React, Next.js

```typescript
import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '../../../payload-types.js'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/Image/index.module.scss

```text
.placeholder-color-light {
  background-color: rgba(0, 0, 0, 0.05);
}

.placeholder {
  background-color: var(--color-base-50);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/Image/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { StaticImageData } from 'next/image.js'

import NextImageWithDefault from 'next/image.js'
import React from 'react'

import type { Props as MediaProps } from '../types.js'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'
import cssVariables from '../../../cssVariables.js'
import classes from './index.module.scss'

const { breakpoints } = cssVariables

const NextImage =
  'default' in NextImageWithDefault ? NextImageWithDefault.default : NextImageWithDefault

export const Image: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    src: srcFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  if (!src && resource && typeof resource !== 'string') {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      width: fullWidth,
    } = resource

    width = fullWidth || undefined
    height = fullHeight || undefined
    alt = altFromResource

    const filename = fullFilename

    src = `${PAYLOAD_SERVER_URL}/api/media/file/${filename}`
  }

  if (!src) return null

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value}px`)
    .join(', ')

  return (
    <NextImage
      alt={alt || ''}
      className={[isLoading && classes.placeholder, classes.image, imgClassName]
        .filter(Boolean)
        .join(' ')}
      fill={fill}
      height={!fill ? height : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      priority={priority}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/Video/index.module.scss

```text
.video {
  max-width: 100%;
  width: 100%;
  background-color: var(--color-base-50);
}

.cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/Media/Video/index.tsx
Signals: React

```typescript
'use client'

import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types.js'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'
import classes from './index.module.scss'

export const Video: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource !== 'string') {
    const { filename } = resource

    return (
      <video
        autoPlay
        className={[classes.video, videoClassName].filter(Boolean).join(' ')}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={`${PAYLOAD_SERVER_URL}/media/${filename}`} />
      </video>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/PageRange/index.module.scss

```text
@import '../../_css/common';

.pageRange {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.content {
  display: flex;
  align-items: center;
  margin: 0 calc(var(--base) * 0.5);
}

.divider {
  margin: 0 2px;
}

.hyperlink {
  display: flex;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/PageRange/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

const defaultLabels = {
  plural: 'Docs',
  singular: 'Doc',
}

const defaultCollectionLabels = {
  products: {
    plural: 'Products',
    singular: 'Product',
  },
}

export const PageRange: React.FC<{
  className?: string
  collection?: string
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  const indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const { plural, singular } =
    collectionLabelsFromProps || defaultCollectionLabels[collection || ''] || defaultLabels || {}

  return (
    <div className={[className, classes.pageRange].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Search produced no results.'}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `Showing ${indexStart} - ${indexEnd} of ${totalDocs} ${totalDocs > 1 ? plural : singular}`}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/Pagination/index.module.scss

```text
@import '../../_css/type.scss';

.pagination {
  @extend %label;
  display: flex;
  align-items: center;
  gap: calc(var(--base) / 2);
}

.button {
  all: unset;
  cursor: pointer;
  position: relative;
  display: flex;
  padding: calc(var(--base) / 2);
  color: var(--color-base-500);
  border: 1px solid var(--color-base-200);

  &:disabled {
    cursor: not-allowed;
    color: var(--color-base-200);
    border-color: var(--color-base-150);
  }
}

.icon {
  width: calc(var(--base) / 2);
  height: calc(var(--base) / 2);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/Pagination/index.tsx
Signals: React

```typescript
import React from 'react'

import { Chevron } from '../Chevron/index.js'
import classes from './index.module.scss'

export const Pagination: React.FC<{
  className?: string
  onClick: (page: number) => void
  page: number
  totalPages: number
}> = (props) => {
  const { className, onClick, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      <button
        className={classes.button}
        disabled={!hasPrevPage}
        onClick={() => {
          onClick(page - 1)
        }}
        type="button"
      >
        <Chevron className={classes.icon} rotate={90} />
      </button>
      <div className={classes.pageRange}>
        <span className={classes.pageRangeLabel}>
          Page {page} of {totalPages}
        </span>
      </div>
      <button
        className={classes.button}
        disabled={!hasNextPage}
        onClick={() => {
          onClick(page + 1)
        }}
        type="button"
      >
        <Chevron className={classes.icon} rotate={-90} />
      </button>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/RichText/index.module.scss

```text
.richText {
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/RichText/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'
import serializeLexical from './serializeLexical.js'
import serializeSlate from './serializeSlate.js'

const RichText: React.FC<{
  className?: string
  content: any
  renderUploadFilenameOnly?: boolean
}> = ({ className, content, renderUploadFilenameOnly }) => {
  if (!content) {
    return null
  }

  const serializer = Array.isArray(content) ? 'slate' : 'lexical'
  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {serializer === 'slate'
        ? serializeSlate(content, renderUploadFilenameOnly)
        : serializeLexical(content, renderUploadFilenameOnly)}
    </div>
  )
}
export default RichText
```

--------------------------------------------------------------------------------

---[FILE: serializeLexical.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/RichText/serializeLexical.tsx
Signals: React

```typescript
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import React from 'react'

import { CMSLink } from '../Link/index.js'
import { Media } from '../Media/index.js'
import { MediaBlock } from '../../_blocks/MediaBlock/index.js'
const serializer = (
  content?: DefaultTypedEditorState['root']['children'],
  renderUploadFilenameOnly?: boolean,
): React.ReactNode | React.ReactNode[] =>
  content?.map((node, i) => {
    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h1>

      case 'h2':
        return <h2 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h2>

      case 'h3':
        return <h3 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h3>

      case 'h4':
        return <h4 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h4>

      case 'h5':
        return <h5 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h5>

      case 'h6':
        return <h6 key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</h6>

      case 'li':
        return <li key={i}>{serializeLexical(node.children, renderUploadFilenameOnly)}</li>

      case 'link':
        return (
          <CMSLink
            key={i}
            newTab={Boolean(node?.newTab)}
            reference={node.doc}
            type={node.linkType === 'internal' ? 'reference' : 'custom'}
            url={node.url}
          >
            {serializer(node?.children, renderUploadFilenameOnly)}
          </CMSLink>
        )

      case 'ol':
        return <ol key={i}>{serializeLexical(node.children, renderUploadFilenameOnly)}</ol>

      case 'paragraph':
        return <p key={i}>{serializer(node?.children, renderUploadFilenameOnly)}</p>

      case 'quote':
        return (
          <blockquote key={i}>
            {serializeLexical(node?.children, renderUploadFilenameOnly)}
          </blockquote>
        )

      case 'relationship':
        return (
          <span key={i}>
            {node.value && typeof node.value === 'object'
              ? node.value.title || node.value.id
              : node.value}
          </span>
        )

      case 'text':
        return <span key={i}>{node.text}</span>

      case 'ul':
        return <ul key={i}>{serializeLexical(node?.children, renderUploadFilenameOnly)}</ul>

      case 'upload':
        if (renderUploadFilenameOnly) {
          return <span key={i}>{node.value?.filename}</span>
        }

        return <Media key={i} resource={node?.value} />

      case 'block':
        switch (node.fields.blockType) {
          case 'mediaBlock':
            return <MediaBlock key={i} {...node.fields} />
        }
    }
  })

const serializeLexical = (
  content?: DefaultTypedEditorState,
  renderUploadFilenameOnly?: boolean,
): React.ReactNode | React.ReactNode[] => {
  return serializer(content?.root?.children, renderUploadFilenameOnly)
}

export default serializeLexical
```

--------------------------------------------------------------------------------

---[FILE: serializeSlate.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/RichText/serializeSlate.tsx
Signals: React

```typescript
import escapeHTML from 'escape-html'
import React, { Fragment } from 'react'
import { Text } from 'slate'

import { CMSLink } from '../Link/index.js'
import { Media } from '../Media/index.js'

type Children = Leaf[]

type Leaf = {
  [key: string]: unknown
  children?: Children
  type: string
  url?: string
  value?: any
}

const serializeSlate = (
  children?: Children,
  renderUploadFilenameOnly?: boolean,
): React.ReactNode[] =>
  children?.map((node, i) => {
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
      case 'h1':
        return <h1 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h1>

      case 'h2':
        return <h2 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h2>

      case 'h3':
        return <h3 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h3>

      case 'h4':
        return <h4 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h4>

      case 'h5':
        return <h5 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h5>

      case 'h6':
        return <h6 key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</h6>

      case 'quote':
        return (
          <blockquote key={i}>
            {serializeSlate(node?.children, renderUploadFilenameOnly)}
          </blockquote>
        )

      case 'ul':
        return <ul key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</ul>

      case 'ol':
        return <ol key={i}>{serializeSlate(node.children, renderUploadFilenameOnly)}</ol>

      case 'li':
        return <li key={i}>{serializeSlate(node.children, renderUploadFilenameOnly)}</li>

      case 'relationship':
        return (
          <span key={i}>
            {node.value && typeof node.value === 'object'
              ? node.value.title || node.value.id
              : node.value}
          </span>
        )

      case 'link':
        return (
          <CMSLink
            key={i}
            newTab={Boolean(node?.newTab)}
            reference={node.doc as any}
            type={node.linkType === 'internal' ? 'reference' : 'custom'}
            url={node.url}
          >
            {serializeSlate(node?.children, renderUploadFilenameOnly)}
          </CMSLink>
        )

      case 'upload':
        if (renderUploadFilenameOnly) {
          return <span key={i}>{node.value?.filename}</span>
        }

        return <Media key={i} resource={node?.value} />

      default:
        return <p key={i}>{serializeSlate(node?.children, renderUploadFilenameOnly)}</p>
    }
  }) || []

export default serializeSlate
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_components/VerticalPadding/index.module.scss

```text
.top-large {
  padding-top: var(--block-padding);
}

.top-medium {
  padding-top: calc(var(--block-padding) / 2);
}

.bottom-large {
  padding-bottom: var(--block-padding);
}

.bottom-medium {
  padding-bottom: calc(var(--block-padding) / 2);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_components/VerticalPadding/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

export type VerticalPaddingOptions = 'large' | 'medium' | 'none'

type Props = {
  bottom?: VerticalPaddingOptions
  children: React.ReactNode
  className?: string
  top?: VerticalPaddingOptions
}

export const VerticalPadding: React.FC<Props> = ({
  bottom = 'medium',
  children,
  className,
  top = 'medium',
}) => {
  return (
    <div
      className={[className, classes[`top-${top}`], classes[`bottom-${bottom}`]]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: app.scss]---
Location: payload-main/test/live-preview/app/live-preview/_css/app.scss

```text
@use './queries.scss' as *;
@use './colors.scss' as *;
@use './type.scss' as *;

:root {
  --base: 24px;
  --font-body: system-ui;
  --font-mono: 'Roboto Mono', monospace;

  --gutter-h: 180px;
  --block-padding: 120px;

  --theme-text: var(--color-base-750);

  @include large-break {
    --gutter-h: 144px;
    --block-padding: 96px;
  }

  @include mid-break {
    --gutter-h: 24px;
    --block-padding: 60px;
  }
}

* {
  box-sizing: border-box;
}

html {
  @extend %body;
  -webkit-font-smoothing: antialiased;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family: var(--font-body);
  margin: 0;
  color: var(--theme-text);
}

::selection {
  background: var(--color-success-500);
  color: var(--color-base-800);
}

::-moz-selection {
  background: var(--color-success-500);
  color: var(--color-base-800);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

h1 {
  @extend %h1;
}

h2 {
  @extend %h2;
}

h3 {
  @extend %h3;
}

h4 {
  @extend %h4;
}

h5 {
  @extend %h5;
}

h6 {
  @extend %h6;
}

p {
  margin: var(--base) 0;

  @include mid-break {
    margin: calc(var(--base) * 0.75) 0;
  }
}

#page-title {
  @extend %h6;
}

ul,
ol {
  padding-left: var(--base);
  margin: 0 0 var(--base);
}

a {
  color: currentColor;

  &:focus {
    opacity: 0.8;
    outline: none;
  }

  &:active {
    opacity: 0.7;
    outline: none;
  }
}

svg {
  vertical-align: middle;
}
```

--------------------------------------------------------------------------------

---[FILE: colors.scss]---
Location: payload-main/test/live-preview/app/live-preview/_css/colors.scss

```text
// Keep these in sync with the colors exported in '../cssVariables.js'

:root {
  --color-base-0: rgb(255, 255, 255);
  --color-base-50: rgb(245, 245, 245);
  --color-base-100: rgb(235, 235, 235);
  --color-base-150: rgb(221, 221, 221);
  --color-base-200: rgb(208, 208, 208);
  --color-base-250: rgb(195, 195, 195);
  --color-base-300: rgb(181, 181, 181);
  --color-base-350: rgb(168, 168, 168);
  --color-base-400: rgb(154, 154, 154);
  --color-base-450: rgb(141, 141, 141);
  --color-base-500: rgb(128, 128, 128);
  --color-base-550: rgb(114, 114, 114);
  --color-base-600: rgb(101, 101, 101);
  --color-base-650: rgb(87, 87, 87);
  --color-base-700: rgb(74, 74, 74);
  --color-base-750: rgb(60, 60, 60);
  --color-base-800: rgb(47, 47, 47);
  --color-base-850: rgb(34, 34, 34);
  --color-base-900: rgb(20, 20, 20);
  --color-base-950: rgb(7, 7, 7);
  --color-base-1000: rgb(0, 0, 0);

  --color-success-50: rgb(237, 245, 249);
  --color-success-100: rgb(218, 237, 248);
  --color-success-150: rgb(188, 225, 248);
  --color-success-200: rgb(156, 216, 253);
  --color-success-250: rgb(125, 204, 248);
  --color-success-300: rgb(97, 190, 241);
  --color-success-350: rgb(65, 178, 236);
  --color-success-400: rgb(36, 164, 223);
  --color-success-450: rgb(18, 148, 204);
  --color-success-500: rgb(21, 135, 186);
  --color-success-550: rgb(12, 121, 168);
  --color-success-600: rgb(11, 110, 153);
  --color-success-650: rgb(11, 97, 135);
  --color-success-700: rgb(17, 88, 121);
  --color-success-750: rgb(17, 76, 105);
  --color-success-800: rgb(18, 66, 90);
  --color-success-850: rgb(18, 56, 76);
  --color-success-900: rgb(19, 44, 58);
  --color-success-950: rgb(22, 33, 39);

  --color-error-50: rgb(250, 241, 240);
  --color-error-100: rgb(252, 229, 227);
  --color-error-150: rgb(247, 208, 204);
  --color-error-200: rgb(254, 193, 188);
  --color-error-250: rgb(253, 177, 170);
  --color-error-300: rgb(253, 154, 146);
  --color-error-350: rgb(253, 131, 123);
  --color-error-400: rgb(246, 109, 103);
  --color-error-450: rgb(234, 90, 86);
  --color-error-500: rgb(218, 75, 72);
  --color-error-550: rgb(200, 62, 61);
  --color-error-600: rgb(182, 54, 54);
  --color-error-650: rgb(161, 47, 47);
  --color-error-700: rgb(144, 44, 43);
  --color-error-750: rgb(123, 41, 39);
  --color-error-800: rgb(105, 39, 37);
  --color-error-850: rgb(86, 36, 33);
  --color-error-900: rgb(64, 32, 29);
  --color-error-950: rgb(44, 26, 24);

  --color-warning-50: rgb(249, 242, 237);
  --color-warning-100: rgb(248, 232, 219);
  --color-warning-150: rgb(243, 212, 186);
  --color-warning-200: rgb(243, 200, 162);
  --color-warning-250: rgb(240, 185, 136);
  --color-warning-300: rgb(238, 166, 98);
  --color-warning-350: rgb(234, 148, 58);
  --color-warning-400: rgb(223, 132, 17);
  --color-warning-450: rgb(204, 120, 15);
  --color-warning-500: rgb(185, 108, 13);
  --color-warning-550: rgb(167, 97, 10);
  --color-warning-600: rgb(150, 87, 11);
  --color-warning-650: rgb(134, 78, 11);
  --color-warning-700: rgb(120, 70, 13);
  --color-warning-750: rgb(105, 61, 13);
  --color-warning-800: rgb(90, 55, 19);
  --color-warning-850: rgb(73, 47, 21);
  --color-warning-900: rgb(56, 38, 20);
  --color-warning-950: rgb(38, 29, 21);

  --color-blue-50: rgb(237, 245, 249);
  --color-blue-100: rgb(218, 237, 248);
  --color-blue-150: rgb(188, 225, 248);
  --color-blue-200: rgb(156, 216, 253);
  --color-blue-250: rgb(125, 204, 248);
  --color-blue-300: rgb(97, 190, 241);
  --color-blue-350: rgb(65, 178, 236);
  --color-blue-400: rgb(36, 164, 223);
  --color-blue-450: rgb(18, 148, 204);
  --color-blue-500: rgb(21, 135, 186);
  --color-blue-550: rgb(12, 121, 168);
  --color-blue-600: rgb(11, 110, 153);
  --color-blue-650: rgb(11, 97, 135);
  --color-blue-700: rgb(17, 88, 121);
  --color-blue-750: rgb(17, 76, 105);
  --color-blue-800: rgb(18, 66, 90);
  --color-blue-850: rgb(18, 56, 76);
  --color-blue-900: rgb(19, 44, 58);
  --color-blue-950: rgb(22, 33, 39);
}
```

--------------------------------------------------------------------------------

---[FILE: common.scss]---
Location: payload-main/test/live-preview/app/live-preview/_css/common.scss

```text
@forward './queries.scss';
@forward './type.scss';
```

--------------------------------------------------------------------------------

---[FILE: queries.scss]---
Location: payload-main/test/live-preview/app/live-preview/_css/queries.scss

```text
// Keep these in sync with the breakpoints exported in '../cssVariables.js'

$breakpoint-xs-width: 400px;
$breakpoint-s-width: 768px;
$breakpoint-m-width: 1024px;
$breakpoint-l-width: 1440px;

@mixin extra-small-break {
  @media (max-width: #{$breakpoint-xs-width}) {
    @content;
  }
}

@mixin small-break {
  @media (max-width: #{$breakpoint-s-width}) {
    @content;
  }
}

@mixin mid-break {
  @media (max-width: #{$breakpoint-m-width}) {
    @content;
  }
}

@mixin large-break {
  @media (max-width: #{$breakpoint-l-width}) {
    @content;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: type.scss]---
Location: payload-main/test/live-preview/app/live-preview/_css/type.scss

```text
@use 'queries' as *;

%h1,
%h2,
%h3,
%h4,
%h5,
%h6 {
  font-weight: 700;
}

%h1 {
  margin: 40px 0;
  font-size: 64px;
  line-height: 70px;
  font-weight: bold;

  @include mid-break {
    margin: 24px 0;
    font-size: 42px;
    line-height: 42px;
  }
}

%h2 {
  margin: 28px 0;
  font-size: 48px;
  line-height: 54px;
  font-weight: bold;

  @include mid-break {
    margin: 22px 0;
    font-size: 32px;
    line-height: 40px;
  }
}

%h3 {
  margin: 24px 0;
  font-size: 32px;
  line-height: 40px;
  font-weight: bold;

  @include mid-break {
    margin: 20px 0;
    font-size: 26px;
    line-height: 32px;
  }
}

%h4 {
  margin: 20px 0;
  font-size: 26px;
  line-height: 32px;
  font-weight: bold;

  @include mid-break {
    font-size: 22px;
    line-height: 30px;
  }
}

%h5 {
  margin: 20px 0;
  font-size: 22px;
  line-height: 30px;
  font-weight: bold;

  @include mid-break {
    font-size: 18px;
    line-height: 24px;
  }
}

%h6 {
  margin: 20px 0;
  font-size: inherit;
  line-height: inherit;
  font-weight: bold;
}

%body {
  font-size: 18px;
  line-height: 32px;

  @include mid-break {
    font-size: 15px;
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
}

%label {
  font-size: 16px;
  line-height: 24px;
  text-transform: uppercase;

  @include mid-break {
    font-size: 13px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_heros/HighImpact/index.module.scss

```text
@import '../../_css/queries.scss';

.hero {
  padding-top: calc(var(--base) * 2);
  position: relative;
  overflow: hidden;

  @include large-break {
    padding-top: var(--base);
  }
}

.media {
  width: calc(100% + var(--gutter-h));
  left: calc(var(--gutter-h) / -2);
  margin-top: calc(var(--base) * 3);
  position: relative;

  @include mid-break {
    left: 0;
    margin-top: var(--base);
    margin-left: calc(var(--gutter-h) * -1);
    width: calc(100% + var(--gutter-h) * 2);
  }
}

.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  padding-top: var(--base);
  flex-wrap: wrap;
  margin: calc(var(--base) * -0.5);

  & > * {
    margin: calc(var(--base) / 2);
  }
}

.caption {
  margin-top: var(--base);
  color: var(--color-base-500);
  left: calc(var(--gutter-h) / 2);
  width: calc(100% - var(--gutter-h));
  position: relative;

  @include mid-break {
    left: var(--gutter-h);
  }
}

.content {
  position: relative;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_heros/HighImpact/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import type { Page } from '../../../../test/live-preview/payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { Media } from '../../_components/Media/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

export const HighImpactHero: React.FC<Page['hero']> = ({ media, richText }) => {
  return (
    <Gutter className={classes.hero}>
      <div className={classes.content}>
        <RichText content={richText} />
      </div>
      <div className={classes.media}>
        {typeof media === 'object' && media !== null && (
          <Fragment>
            <Media
              // fill
              imgClassName={classes.image}
              priority
              resource={media}
            />
            {media?.caption && <RichText className={classes.caption} content={media.caption} />}
          </Fragment>
        )}
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_heros/LowImpact/index.module.scss

```text
@use '../../_css/type.scss' as *;

.lowImpactHero {
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_heros/LowImpact/index.tsx
Signals: React

```typescript
import React from 'react'

import type { Page } from '../../../../test/live-preview/payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import RichText from '../../_components/RichText/index.js'
import { VerticalPadding } from '../../_components/VerticalPadding/index.js'
import classes from './index.module.scss'

export const LowImpactHero: React.FC<Page['hero']> = ({ richText }) => {
  return (
    <Gutter className={classes.lowImpactHero}>
      <div className={classes.content}>
        <VerticalPadding>
          <RichText className={classes.richText} content={richText} />
        </VerticalPadding>
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/app/live-preview/_heros/PostHero/index.module.scss

```text
@use '../../_css/common.scss' as *;

.postHero {
  display: flex;
  gap: calc(var(--base) * 2);

  @include mid-break {
    flex-direction: column;
    gap: var(--base);
  }
}

.content {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--base);

  @include mid-break {
    width: 100%;
    gap: calc(var(--base) / 2);
  }
}

.warning {
  margin-bottom: calc(var(--base) * 1.5);
}

.meta {
  margin: 0;
}

.description {
  margin: 0;
}

.media {
  width: 50%;

  @include mid-break {
    width: 100%;
  }
}

.mediaWrapper {
  text-decoration: none;
  display: block;
  position: relative;
  aspect-ratio: 5 / 4;
  margin-bottom: calc(var(--base) / 2);
  width: calc(100% + calc(var(--gutter-h) / 2));

  @include mid-break {
    margin-left: calc(var(--gutter-h) * -1);
    width: calc(100% + var(--gutter-h) * 2);
  }
}

.image {
  object-fit: cover;
}

.placeholder {
  background-color: var(--color-base-50);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.caption {
  color: var(--color-base-500);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/app/live-preview/_heros/PostHero/index.tsx
Signals: React, Next.js

```typescript
import LinkWithDefault from 'next/link.js'
import React, { Fragment } from 'react'

import type { Post } from '../../../../payload-types.js'

import { PAYLOAD_SERVER_URL } from '../../_api/serverURL.js'
import { Gutter } from '../../_components/Gutter/index.js'
import { Media } from '../../_components/Media/index.js'
import RichText from '../../_components/RichText/index.js'
import { formatDateTime } from '../../_utilities/formatDateTime.js'
import classes from './index.module.scss'

const Link = 'default' in LinkWithDefault ? LinkWithDefault.default : LinkWithDefault

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { id, createdAt, meta: { description, image: metaImage } = {} } = post

  return (
    <Fragment>
      <Gutter className={classes.postHero}>
        <div className={classes.content}>
          <RichText className={classes.richText} content={post?.hero?.richText} />
          <p className={classes.meta}>
            {createdAt && (
              <Fragment>
                {'Created on '}
                {formatDateTime(createdAt)}
              </Fragment>
            )}
          </p>
          <div>
            <p className={classes.description}>
              {`${description ? `${description} ` : ''}To edit this post, `}
              <Link href={`${PAYLOAD_SERVER_URL}/admin/collections/posts/${id}`}>
                navigate to the admin dashboard
              </Link>
              .
            </p>
          </div>
        </div>
        <div className={classes.media}>
          <div className={classes.mediaWrapper}>
            {!metaImage && <div className={classes.placeholder}>No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media fill imgClassName={classes.image} resource={metaImage} />
            )}
          </div>
          {metaImage && typeof metaImage !== 'string' && metaImage?.caption && (
            <RichText className={classes.caption} content={metaImage.caption} />
          )}
        </div>
      </Gutter>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: formatDateTime.ts]---
Location: payload-main/test/live-preview/app/live-preview/_utilities/formatDateTime.ts

```typescript
export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  // const hours = date.getHours();
  // const minutes = date.getMinutes();
  // const seconds = date.getSeconds();

  const MM = months + 1 < 10 ? `0${months + 1}` : months + 1
  const DD = days < 10 ? `0${days}` : days
  const YYYY = date.getFullYear()
  // const AMPM = hours < 12 ? 'AM' : 'PM';
  // const HH = hours > 12 ? hours - 12 : hours;
  // const MinMin = (minutes < 10) ? `0${minutes}` : minutes;
  // const SS = (seconds < 10) ? `0${seconds}` : seconds;

  return `${MM}/${DD}/${YYYY}`
}
```

--------------------------------------------------------------------------------

---[FILE: toKebabCase.ts]---
Location: payload-main/test/live-preview/app/live-preview/_utilities/toKebabCase.ts

```typescript
export const toKebabCase = (string: string): string =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
```

--------------------------------------------------------------------------------

````
