---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 617
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 617 of 695)

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
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/CallToAction/index.tsx
Signals: React

```typescript
import React from 'react'

import type { Page } from '../../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { CMSLink } from '../../_components/Link/index.js'
import RichText from '../../_components/RichText/index.js'
import { VerticalPadding } from '../../_components/VerticalPadding/index.js'
import classes from './index.module.scss'

type Props = Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  {
    id?: string
  } & Props
> = ({ invertBackground, links, richText }) => {
  return (
    <Gutter>
      <VerticalPadding
        className={[classes.callToAction, invertBackground && classes.invert]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.wrap}>
          <div className={classes.content}>
            <RichText className={classes.richText} content={richText} />
          </div>
          <div className={classes.linkGroup}>
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} {...link} invert={invertBackground} />
            })}
          </div>
        </div>
      </VerticalPadding>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/Content/index.module.scss

```text
@import '../../_css/common';

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--base) calc(var(--base) * 2);

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--base) var(--base);
  }
}

.column--oneThird {
  grid-column-end: span 4;
}

.column--half {
  grid-column-end: span 6;
}

.column--twoThirds {
  grid-column-end: span 8;
}

.column--full {
  grid-column-end: span 12;
}

.column {
  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.link {
  margin-top: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/Content/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { CMSLink } from '../../_components/Link/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

type Props = Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  {
    id?: string
  } & Props
> = (props) => {
  const { columns } = props

  return (
    <Gutter className={classes.content}>
      <div className={classes.grid}>
        {columns && columns.length > 0 ? (
          <Fragment>
            {columns.map((col, index) => {
              const { enableLink, link, richText, size } = col

              return (
                <div className={[classes.column, classes[`column--${size}`]].join(' ')} key={index}>
                  <RichText content={richText} />
                  {enableLink && <CMSLink className={classes.link} {...link} />}
                </div>
              )
            })}
          </Fragment>
        ) : null}
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/MediaBlock/index.module.scss

```text
.mediaBlock {
  position: relative;
}

.caption {
  color: var(--color-base-500);
  margin-top: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/MediaBlock/index.tsx
Signals: React, Next.js

```typescript
import type { StaticImageData } from 'next/image.js'

import React from 'react'

import type { Page } from '../../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import { Media } from '../../_components/Media/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

type Props = {
  id?: string
  staticImage?: StaticImageData
} & Extract<Exclude<Page['layout'], undefined>[0], { blockType: 'mediaBlock' }>

export const MediaBlock: React.FC<Props> = (props) => {
  const { media, position = 'default', staticImage } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div className={classes.mediaBlock}>
      {position === 'fullscreen' && (
        <div className={classes.fullscreen}>
          <Media resource={media} src={staticImage} />
        </div>
      )}
      {position === 'default' && (
        <Gutter>
          <Media resource={media} src={staticImage} />
        </Gutter>
      )}
      {caption && (
        <Gutter className={classes.caption}>
          <RichText content={caption} />
        </Gutter>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/RelatedPosts/index.module.scss

```text
@import '../../_css/common';

.introContent {
  position: relative;
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: var(--base);
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  gap: var(--base) 40px;

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: calc(var(--base) / 2) var(--base);
  }
}

.column {
  grid-column-end: span 12;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.cols-half {
  grid-column-end: span 6;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.cols-thirds {
  grid-column-end: span 3;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/RelatedPosts/index.tsx
Signals: React

```typescript
import React from 'react'

import type { Post } from '../../../../../payload-types.js'

import { Card } from '../../_components/Card/index.js'
import { Gutter } from '../../_components/Gutter/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

export type RelatedPostsProps = {
  blockName: string
  blockType: 'relatedPosts'
  docs?: (Post | string)[] | null
  introContent?: any
  relationTo: 'posts'
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { docs, introContent, relationTo } = props

  return (
    <div className={classes.relatedPosts}>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <Gutter>
        <div className={classes.grid}>
          {docs?.map((doc, index) => {
            if (typeof doc === 'string') return null

            return (
              <div
                className={[
                  classes.column,
                  docs.length === 2 && classes['cols-half'],
                  docs.length >= 3 && classes['cols-thirds'],
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={index}
              >
                <Card doc={doc} relationTo={relationTo} showCategories />
              </div>
            )
          })}
        </div>
      </Gutter>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/Relationships/index.module.scss

```text
@import '../../_css/common';

.relationshipsBlock {
}

.array {
  border: 1px solid var(--color-base-100);
  padding: var(--base);

  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/Relationships/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'

import { Gutter } from '../../_components/Gutter/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

export type RelationshipsBlockProps = {
  blockName: string
  blockType: 'relationships'
  data: Page
}

export const RelationshipsBlock: React.FC<RelationshipsBlockProps> = (props) => {
  const { data } = props

  return (
    <div className={classes.relationshipsBlock}>
      <Gutter>
        <p>
          This block is for testing purposes only. It renders every possible type of relationship.
        </p>
        <p>
          <b>Rich Text — Slate:</b>
        </p>
        {data?.richTextSlate && <RichText content={data.richTextSlate} renderUploadFilenameOnly />}
        <p>
          <b>Rich Text — Lexical:</b>
        </p>
        {data?.richTextLexical && (
          <RichText content={data.richTextLexical} renderUploadFilenameOnly />
        )}
        <p>
          <b>Upload:</b>
        </p>
        {data?.relationshipAsUpload ? (
          <div>
            {typeof data?.relationshipAsUpload === 'string'
              ? data?.relationshipAsUpload
              : data?.relationshipAsUpload.filename}
          </div>
        ) : (
          <div>None</div>
        )}
        <p>
          <b>Monomorphic Has One:</b>
        </p>
        {data?.relationshipMonoHasOne ? (
          <div>
            {typeof data?.relationshipMonoHasOne === 'string'
              ? data?.relationshipMonoHasOne
              : data?.relationshipMonoHasOne.title}
          </div>
        ) : (
          <div>None</div>
        )}
        <p>
          <b>Monomorphic Has Many:</b>
        </p>
        {data?.relationshipMonoHasMany ? (
          <Fragment>
            {data?.relationshipMonoHasMany.length
              ? data?.relationshipMonoHasMany?.map((item, index) =>
                  item ? (
                    <div key={index}>{typeof item === 'string' ? item : item.title}</div>
                  ) : (
                    'null'
                  ),
                )
              : 'None'}
          </Fragment>
        ) : (
          <div>None</div>
        )}
        <p>
          <b>Polymorphic Has One:</b>
        </p>
        {data?.relationshipPolyHasOne ? (
          <div>
            {typeof data?.relationshipPolyHasOne.value === 'string'
              ? data?.relationshipPolyHasOne.value
              : data?.relationshipPolyHasOne.value.title}
          </div>
        ) : (
          <div>None</div>
        )}
        <p>
          <b>Polymorphic Has Many:</b>
        </p>
        {data?.relationshipPolyHasMany ? (
          <Fragment>
            {data?.relationshipPolyHasMany.length
              ? data?.relationshipPolyHasMany?.map((item, index) =>
                  item.value ? (
                    <div key={index}>
                      {typeof item.value === 'string' ? item.value : item.value.title}
                    </div>
                  ) : (
                    'null'
                  ),
                )
              : 'None'}
          </Fragment>
        ) : (
          <div>None</div>
        )}
        <p>
          <b>Array of Relationships:</b>
        </p>
        {data?.arrayOfRelationships?.map((item, index) => (
          <div className={classes.array} key={index}>
            <p>
              <b>Rich Text:</b>
            </p>
            {item?.richTextInArray && <RichText content={item.richTextInArray} />}
            <p>
              <b>Upload:</b>
            </p>
            {item?.uploadInArray ? (
              <div>
                {typeof item?.uploadInArray === 'string'
                  ? item?.uploadInArray
                  : item?.uploadInArray.filename}
              </div>
            ) : (
              <div>None</div>
            )}
            <p>
              <b>Monomorphic Has One:</b>
            </p>
            {item?.relationshipInArrayMonoHasOne ? (
              <div>
                {typeof item?.relationshipInArrayMonoHasOne === 'string'
                  ? item?.relationshipInArrayMonoHasOne
                  : item?.relationshipInArrayMonoHasOne.title}
              </div>
            ) : (
              <div>None</div>
            )}
            <p>
              <b>Monomorphic Has Many:</b>
            </p>
            {item?.relationshipInArrayMonoHasMany ? (
              <Fragment>
                {item?.relationshipInArrayMonoHasMany.length
                  ? item?.relationshipInArrayMonoHasMany?.map((rel, relIndex) =>
                      rel ? (
                        <div key={relIndex}>{typeof rel === 'string' ? rel : rel.title}</div>
                      ) : (
                        'null'
                      ),
                    )
                  : 'None'}
              </Fragment>
            ) : (
              <div>None</div>
            )}
            <p>
              <b>Polymorphic Has One:</b>
            </p>
            {item?.relationshipInArrayPolyHasOne ? (
              <div>
                {typeof item?.relationshipInArrayPolyHasOne.value === 'string'
                  ? item?.relationshipInArrayPolyHasOne.value
                  : item?.relationshipInArrayPolyHasOne.value.title}
              </div>
            ) : (
              <div>None</div>
            )}
            <p>
              <b>Polymorphic Has Many:</b>
            </p>
            {item?.relationshipInArrayPolyHasMany ? (
              <Fragment>
                {item?.relationshipInArrayPolyHasMany.length
                  ? item?.relationshipInArrayPolyHasMany?.map((rel, relIndex) =>
                      rel.value ? (
                        <div key={relIndex}>
                          {typeof rel.value === 'string' ? rel.value : rel.value.title}
                        </div>
                      ) : (
                        'null'
                      ),
                    )
                  : 'None'}
              </Fragment>
            ) : (
              <div>None</div>
            )}
          </div>
        ))}
      </Gutter>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/BackgroundColor/index.module.scss

```text
.invert {
  background-color: var(--color-base-750);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/BackgroundColor/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

type Props = {
  children?: React.ReactNode
  className?: string
  id?: string
  invert?: boolean | null
}

export const BackgroundColor: React.FC<Props> = (props) => {
  const { id, children, className, invert } = props

  return (
    <div className={[invert && classes.invert, className].filter(Boolean).join(' ')} id={id}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Blocks/index.tsx
Signals: React

```typescript
import React, { Fragment } from 'react'

import type { Page } from '../../../../../payload-types.js'
import type { RelationshipsBlockProps } from '../../_blocks/Relationships/index.js'
import type { VerticalPaddingOptions } from '../VerticalPadding/index.js'

import { ArchiveBlock } from '../../_blocks/ArchiveBlock/index.js'
import { CallToActionBlock } from '../../_blocks/CallToAction/index.js'
import { ContentBlock } from '../../_blocks/Content/index.js'
import { MediaBlock } from '../../_blocks/MediaBlock/index.js'
import { RelatedPosts, type RelatedPostsProps } from '../../_blocks/RelatedPosts/index.js'
import { RelationshipsBlock } from '../../_blocks/Relationships/index.js'
import { toKebabCase } from '../../_utilities/toKebabCase.js'
import { BackgroundColor } from '../BackgroundColor/index.js'
import { VerticalPadding } from '../VerticalPadding/index.js'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
  relatedPosts: RelatedPosts,
  relationships: RelationshipsBlock,
}

type Block = NonNullable<Page['layout']>[number]

export const Blocks: React.FC<{
  blocks?: (Block | RelatedPostsProps | RelationshipsBlockProps)[] | null
  disableTopPadding?: boolean
}> = (props) => {
  const { blocks, disableTopPadding } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            // the cta block is containerized, so we don't consider it to be inverted at the block-level
            const blockIsInverted =
              'invertBackground' in block && blockType !== 'cta' ? block.invertBackground : false
            const prevBlock = blocks[index - 1]

            const prevBlockInverted =
              prevBlock && 'invertBackground' in prevBlock && prevBlock?.invertBackground

            const isPrevSame = Boolean(blockIsInverted) === Boolean(prevBlockInverted)

            let paddingTop: VerticalPaddingOptions = 'large'
            let paddingBottom: VerticalPaddingOptions = 'large'

            if (prevBlock && isPrevSame) {
              paddingTop = 'none'
            }

            if (index === blocks.length - 1) {
              paddingBottom = 'large'
            }

            if (disableTopPadding && index === 0) {
              paddingTop = 'none'
            }

            if (Block) {
              return (
                <BackgroundColor invert={blockIsInverted} key={index}>
                  <VerticalPadding bottom={paddingBottom} top={paddingTop}>
                    {/* @ts-expect-error */}
                    <Block id={toKebabCase(blockName)} {...block} />
                  </VerticalPadding>
                </BackgroundColor>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Button/index.module.scss

```text
@import '../../_css/type.scss';

.button {
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  background-color: transparent;
  text-decoration: none;
  display: inline-flex;
  padding: 12px 24px;
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
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
  @extend %label;
  text-align: center;
  display: flex;
  align-items: center;
}

.appearance--primary {
  background-color: var(--color-base-1000);
  color: var(--color-base-0);
}

.appearance--secondary {
  background-color: transparent;
  box-shadow: inset 0 0 0 1px var(--color-base-1000);
}

.primary--invert {
  background-color: var(--color-base-0);
  color: var(--color-base-1000);
}

.secondary--invert {
  background-color: var(--color-base-1000);
  box-shadow: inset 0 0 0 1px var(--color-base-0);
}

.appearance--default {
  padding: 0;
  color: var(--theme-text);
}

.appearance--none {
  padding: 0;
  color: var(--theme-text);

  .label {
    text-transform: none;
    line-height: inherit;
    font-size: inherit;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Button/index.tsx
Signals: React, Next.js

```typescript
'use client'

import type { ElementType } from 'react'

import LinkWithDefault from 'next/link.js'
import React from 'react'

import classes from './index.module.scss'

const Link = 'default' in LinkWithDefault ? LinkWithDefault.default : LinkWithDefault

export type Props = {
  appearance?: 'default' | 'none' | 'primary' | 'secondary'
  className?: string
  disabled?: boolean
  el?: 'a' | 'button' | 'link'
  href?: string
  invert?: boolean
  label?: string
  newTab?: boolean
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
  invert,
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
    invert && classes[`${appearance}--invert`],
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={classes.content}>
      <span className={classes.label}>{label}</span>
    </div>
  )

  if (onClick || type === 'submit') el = 'button'

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

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Card/index.module.scss

```text
@import '../../_css/common';

.card {
  border: 1px var(--color-base-200) solid;
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.vertical {
  flex-direction: column;
}

.horizontal {
  flex-direction: row;

  .mediaWrapper {
    width: 150px;

    @include mid-break {
      width: 100%;
    }
  }

  @include mid-break {
    flex-direction: column;
  }
}

.content {
  padding: var(--base);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: calc(var(--base) / 2);

  @include small-break {
    padding: calc(var(--base) / 2);
    gap: calc(var(--base) / 4);
  }
}

.title {
  margin: 0;
}

.titleLink {
  text-decoration: none;
}

.centerAlign {
  align-items: center;
}

.body {
  flex-grow: 1;
}

.leader {
  @extend %label;
  display: flex;
  gap: var(--base);
}

.description {
  margin: 0;
}

.hideImageOnMobile {
  @include mid-break {
    display: none;
  }
}

.mediaWrapper {
  text-decoration: none;
  display: block;
  position: relative;
  aspect-ratio: 16 / 9;
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

.actions {
  display: flex;
  align-items: center;

  @include mid-break {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Card/index.tsx
Signals: React, Next.js

```typescript
import LinkWithDefault from 'next/link.js'
import React, { Fragment } from 'react'

import type { Post } from '../../../../../payload-types.js'

import { Media } from '../Media/index.js'
import classes from './index.module.scss'

const Link = 'default' in LinkWithDefault ? LinkWithDefault.default : LinkWithDefault

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Post
  hideImagesOnMobile?: boolean
  orientation?: 'horizontal' | 'vertical'
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const {
    className,
    doc,
    orientation = 'vertical',
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/live-preview/${relationTo}/${slug}`

  return (
    <div
      className={[classes.card, className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      <Link className={classes.mediaWrapper} href={href}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill imgClassName={classes.image} resource={metaImage} />
        )}
      </Link>
      <div className={classes.content}>
        {showCategories && hasCategories && (
          <div className={classes.leader}>
            {showCategories && hasCategories && (
              <div>
                {categories?.map((category, index) => {
                  const titleFromCategory = typeof category === 'string' ? category : category.title

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <h4 className={classes.title}>
            <Link className={classes.titleLink} href={href}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Chevron/index.tsx
Signals: React

```typescript
import React from 'react'

export const Chevron: React.FC<{
  className?: string
  rotate?: number
}> = ({ className, rotate }) => {
  return (
    <svg
      className={className}
      height="100%"
      style={{
        transform: typeof rotate === 'number' ? `rotate(${rotate || 0}deg)` : undefined,
      }}
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
        fill="none"
        stroke="currentColor"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/CollectionArchive/index.tsx
Signals: React

```typescript
import React from 'react'

import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types.js'

import { CollectionArchiveByCollection } from './PopulateByCollection/index.js'
import { CollectionArchiveBySelection } from './PopulateBySelection/index.js'

export type Props = {
  className?: string
  sort?: string
} & Omit<ArchiveBlockProps, 'blockType'>

export const CollectionArchive: React.FC<Props> = (props) => {
  const { className, populateBy, selectedDocs } = props

  if (populateBy === 'selection') {
    return <CollectionArchiveBySelection className={className} selectedDocs={selectedDocs} />
  }

  if (populateBy === 'collection') {
    return <CollectionArchiveByCollection {...props} className={className} />
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/CollectionArchive/PopulateByCollection/index.module.scss

```text
@import '../../../_css/common';

// this is to make up for the space taken by the fixed header, since the scroll method does not accept an offset parameter
.scrollRef {
  position: absolute;
  left: 0;
  top: calc(var(--base) * -5);
  @include mid-break {
    top: calc(var(--base) * -2);
  }
}

.introContent {
  position: relative;
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: var(--base);
  }
}

.resultCountWrapper {
  display: flex;
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: var(--base);
  }
}

.pageRange {
  margin-bottom: var(--base);

  @include mid-break {
    margin-bottom: var(--base);
  }
}

.list {
  position: relative;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  gap: var(--base) 40px;

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: calc(var(--base) / 2) var(--base);
  }
}

.column {
  grid-column-end: span 4;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}

.pagination {
  margin-top: calc(var(--base) * 2);

  @include mid-break {
    margin-top: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/CollectionArchive/PopulateByCollection/index.tsx
Signals: React

```typescript
'use client'

import * as qs from 'qs-esm'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import type { Post } from '../../../../../../payload-types.js'
import type { ArchiveBlockProps } from '../../../_blocks/ArchiveBlock/types.js'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'
import { Card } from '../../Card/index.js'
import { Gutter } from '../../Gutter/index.js'
import { PageRange } from '../../PageRange/index.js'
import { Pagination } from '../../Pagination/index.js'
import classes from './index.module.scss'

type Result = {
  docs: (Post | string)[]
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  page: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export type Props = {
  className?: string
  onResultChange?: (result: Result) => void
  showPageRange?: boolean
  sort?: string
} & Omit<ArchiveBlockProps, 'blockType'>

export const CollectionArchiveByCollection: React.FC<Props> = (props) => {
  const {
    categories: catsFromProps,
    className,
    limit = 10,
    onResultChange,
    populatedDocs,
    populatedDocsTotal,
    relationTo,
    showPageRange,
    sort = '-createdAt',
  } = props

  const [results, setResults] = useState<Result>({
    docs: populatedDocs?.map((doc) => doc.value) || [],
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const [page, setPage] = useState(1)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      // current.scrollIntoView({
      //   behavior: 'smooth',
      // })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    // hydrate the block with fresh content after first render
    // don't show loader unless the request takes longer than x ms
    // and don't show it during initial hydration
    const timer = setTimeout(() => {
      if (hasHydrated) {
        setIsLoading(true)
      }
    }, 500)

    const searchQuery = qs.stringify(
      {
        depth: 1,
        limit,
        page,
        sort,
        where: {
          ...(catsFromProps && catsFromProps?.length > 0
            ? {
                categories: {
                  in:
                    typeof catsFromProps === 'string'
                      ? [catsFromProps]
                      : catsFromProps
                          .map((cat) => (typeof cat === 'object' && cat !== null ? cat.id : cat))
                          .join(','),
                },
              }
            : {}),
        },
      },
      { encode: false },
    )

    const makeRequest = async () => {
      try {
        const req = await fetch(`${PAYLOAD_SERVER_URL}/api/${relationTo}?${searchQuery}`)
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        const { docs } = json as { docs: Post[] }

        if (docs && Array.isArray(docs)) {
          setResults(json)
          setIsLoading(false)
          if (typeof onResultChange === 'function') {
            onResultChange(json)
          }
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        setError(`Unable to load "${relationTo} archive" data at this time.`)
      }
    }

    void makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [page, catsFromProps, relationTo, onResultChange, sort, limit])

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div className={classes.scrollRef} ref={scrollRef} />
      {!isLoading && error && <Gutter>{error}</Gutter>}
      <Fragment>
        {showPageRange !== false && (
          <Gutter>
            <div className={classes.pageRange}>
              <PageRange
                collection={relationTo}
                currentPage={results.page}
                limit={limit}
                totalDocs={results.totalDocs}
              />
            </div>
          </Gutter>
        )}
        <Gutter>
          <div className={classes.grid}>
            {results.docs?.map((result, index) => {
              if (typeof result === 'string') {
                return null
              }

              return (
                <div className={classes.column} key={index}>
                  <Card doc={result} relationTo="posts" showCategories />
                </div>
              )
            })}
          </div>
          {results.totalPages > 1 && (
            <Pagination
              className={classes.pagination}
              onClick={setPage}
              page={results.page}
              totalPages={results.totalPages}
            />
          )}
        </Gutter>
      </Fragment>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/CollectionArchive/PopulateBySelection/index.module.scss

```text
@import '../../../_css/common';

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  gap: var(--base) 40px;

  @include mid-break {
    grid-template-columns: repeat(6, 1fr);
    gap: calc(var(--base) / 2) var(--base);
  }
}

.column {
  grid-column-end: span 4;

  @include mid-break {
    grid-column-end: span 6;
  }

  @include small-break {
    grid-column-end: span 6;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/CollectionArchive/PopulateBySelection/index.tsx
Signals: React

```typescript
'use client'

import React, { Fragment } from 'react'

import type { ArchiveBlockProps } from '../../../_blocks/ArchiveBlock/types.js'

import { Card } from '../../Card/index.js'
import { Gutter } from '../../Gutter/index.js'
import classes from './index.module.scss'

export type Props = {
  className?: string
  selectedDocs?: ArchiveBlockProps['selectedDocs']
}

export const CollectionArchiveBySelection: React.FC<Props> = (props) => {
  const { className, selectedDocs } = props

  const result = selectedDocs?.map((doc) => doc.value)

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <Fragment>
        <Gutter>
          <div className={classes.grid}>
            {result?.map((result, index) => {
              if (typeof result === 'string') {
                return null
              }

              return (
                <div className={classes.column} key={index}>
                  <Card doc={result} relationTo="posts" showCategories />
                </div>
              )
            })}
          </div>
        </Gutter>
      </Fragment>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_components/Footer/index.module.scss

```text
@use '../../_css/queries.scss' as *;

.footer {
  padding: calc(var(--base) * 4) 0;
  background-color: var(--color-base-1000);
  color: var(--color-base-0);

  @include small-break {
    padding: calc(var(--base) * 2) 0;
  }
}

.wrap {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: calc(var(--base) / 2) var(--base);
}

.logo {
  width: 150px;
}

.nav {
  display: flex;
  gap: calc(var(--base) / 4) var(--base);
  align-items: center;
  flex-wrap: wrap;
  opacity: 1;
  transition: opacity 100ms linear;
  visibility: visible;

  > * {
    text-decoration: none;
  }
}
```

--------------------------------------------------------------------------------

````
