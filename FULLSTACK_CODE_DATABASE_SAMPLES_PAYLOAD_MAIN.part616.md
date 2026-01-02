---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 616
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 616 of 695)

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

---[FILE: importMap.js]---
Location: payload-main/test/live-preview/prod/app/(payload)/admin/importMap.js

```javascript
import { RscEntrySlateCell as RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { RscEntrySlateField as RscEntrySlateField_0e78253914a550fdacd75626f1dabe17 } from '@payloadcms/richtext-slate/rsc'
import { BoldLeafButton as BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BoldLeaf as BoldLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeafButton as CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { CodeLeaf as CodeLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeafButton as ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ItalicLeaf as ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeafButton as StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeaf as StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeafButton as UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnderlineLeaf as UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElementButton as BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { BlockquoteElement as BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H1ElementButton as H1ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading1Element as Heading1Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H2ElementButton as H2ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading2Element as Heading2Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H3ElementButton as H3ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading3Element as Heading3Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H4ElementButton as H4ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading4Element as Heading4Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H5ElementButton as H5ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading5Element as Heading5Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { H6ElementButton as H6ElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { Heading6Element as Heading6Element_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentButton as IndentButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { IndentElement as IndentElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ListItemElement as ListItemElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkButton as LinkButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { LinkElement as LinkElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithLinks as WithLinks_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OLElementButton as OLElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { OrderedListElement as OrderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipButton as RelationshipButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RelationshipElement as RelationshipElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithRelationship as WithRelationship_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { TextAlignElementButton as TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { ULElementButton as ULElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UnorderedListElement as UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElementButton as UploadElementButton_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { UploadElement as UploadElement_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { WithUpload as WithUpload_0b388c087d9de8c4f011dd323a130cfb } from '@payloadcms/richtext-slate/client'
import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BlocksFeatureClient as BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { TreeViewFeatureClient as TreeViewFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { CollectionLivePreviewButton as CollectionLivePreviewButton_cdf8c2f401206aec7d2609afbb1e2f40 } from '/../components/CollectionLivePreviewButton/index.js'
import { GlobalLivePreviewButton as GlobalLivePreviewButton_cef560d649f896ba95825fe38ff5f91f } from '/../components/GlobalLivePreviewButton/index.js'

export const importMap = {
  "@payloadcms/richtext-slate/rsc#RscEntrySlateCell": RscEntrySlateCell_0e78253914a550fdacd75626f1dabe17,
  "@payloadcms/richtext-slate/rsc#RscEntrySlateField": RscEntrySlateField_0e78253914a550fdacd75626f1dabe17,
  "@payloadcms/richtext-slate/client#BoldLeafButton": BoldLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#BoldLeaf": BoldLeaf_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#CodeLeafButton": CodeLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#CodeLeaf": CodeLeaf_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#ItalicLeafButton": ItalicLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#ItalicLeaf": ItalicLeaf_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#StrikethroughLeafButton": StrikethroughLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#StrikethroughLeaf": StrikethroughLeaf_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#UnderlineLeafButton": UnderlineLeafButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#UnderlineLeaf": UnderlineLeaf_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#BlockquoteElementButton": BlockquoteElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#BlockquoteElement": BlockquoteElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H1ElementButton": H1ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading1Element": Heading1Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H2ElementButton": H2ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading2Element": Heading2Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H3ElementButton": H3ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading3Element": Heading3Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H4ElementButton": H4ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading4Element": Heading4Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H5ElementButton": H5ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading5Element": Heading5Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#H6ElementButton": H6ElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#Heading6Element": Heading6Element_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#IndentButton": IndentButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#IndentElement": IndentElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#ListItemElement": ListItemElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#LinkButton": LinkButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#LinkElement": LinkElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#WithLinks": WithLinks_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#OLElementButton": OLElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#OrderedListElement": OrderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#RelationshipButton": RelationshipButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#RelationshipElement": RelationshipElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#WithRelationship": WithRelationship_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#TextAlignElementButton": TextAlignElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#ULElementButton": ULElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#UnorderedListElement": UnorderedListElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#UploadElementButton": UploadElementButton_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#UploadElement": UploadElement_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-slate/client#WithUpload": WithUpload_0b388c087d9de8c4f011dd323a130cfb,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#TreeViewFeatureClient": TreeViewFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "/components/CollectionLivePreviewButton/index.js#CollectionLivePreviewButton": CollectionLivePreviewButton_cdf8c2f401206aec7d2609afbb1e2f40,
  "/components/GlobalLivePreviewButton/index.js#GlobalLivePreviewButton": GlobalLivePreviewButton_cef560d649f896ba95825fe38ff5f91f
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/live-preview/prod/app/(payload)/admin/[[...segments]]/not-found.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/(payload)/admin/[[...segments]]/page.tsx
Signals: Next.js

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'

import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/prod/app/(payload)/api/graphql/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/prod/app/(payload)/api/graphql-playground/route.ts

```typescript
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes/index.js'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
```

--------------------------------------------------------------------------------

---[FILE: route.ts]---
Location: payload-main/test/live-preview/prod/app/(payload)/api/[...slug]/route.ts

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

---[FILE: cssVariables.js]---
Location: payload-main/test/live-preview/prod/app/live-preview/cssVariables.js

```javascript
// Keep these in sync with the CSS variables in the `_css` directory
export default {
  breakpoints: {
    s: 768,
    m: 1024,
    l: 1440,
  },
  colors: {
    base0: 'rgb(255, 255, 255)',
    base100: 'rgb(235, 235, 235)',
    base500: 'rgb(128, 128, 128)',
    base850: 'rgb(34, 34, 34)',
    base1000: 'rgb(0, 0, 0)',
    error500: 'rgb(255, 111, 118)',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: layout.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/layout.tsx
Signals: React, Next.js

```typescript
import type { Metadata } from 'next'

import React from 'react'

import { Footer } from './_components/Footer/index.js'
import { Header } from './_components/Header/index.js'
import './_css/app.scss'

export const metadata: Metadata = {
  description: 'Payload Live Preview',
  title: 'Payload Live Preview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: not-found.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/not-found.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { Gutter } from './_components/Gutter/index.js'
import { VerticalPadding } from './_components/VerticalPadding/index.js'

export default function NotFound() {
  return (
    <main>
      <VerticalPadding bottom="medium" top="none">
        <Gutter>
          <h1>404</h1>
          <p>This page could not be found.</p>
        </Gutter>
      </VerticalPadding>
    </main>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/page.tsx

```typescript
import PageTemplate from './(pages)/[slug]/page.js'

export default PageTemplate
```

--------------------------------------------------------------------------------

---[FILE: page.client.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/posts/[slug]/page.client.tsx
Signals: React

```typescript
'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { Gutter } from '@payloadcms/ui'
import React from 'react'

import type { Post as PostType } from '../../../../../../payload-types.js'

import { postsSlug, renderedPageTitleID } from '../../../../../../shared.js'
import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { PostHero } from '../../../_heros/PostHero/index.js'

export const PostClient: React.FC<{
  post: PostType
}> = ({ post: initialPost }) => {
  const { data } = useLivePreview<PostType>({
    depth: 2,
    initialData: initialPost,
    serverURL: PAYLOAD_SERVER_URL,
  })

  console.log(data)

  return (
    <React.Fragment>
      <PostHero post={data} />
      <Blocks blocks={data?.layout} />
      <Blocks
        blocks={[
          {
            blockName: 'Related Posts',
            blockType: 'relatedPosts',
            docs: data?.relatedPosts,
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related posts',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The posts displayed here are individually selected for this page. Admins can select any number of related posts to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate posts by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                    url: `/admin/collections/posts/${data?.id}`,
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            relationTo: postsSlug,
          },
        ]}
        disableTopPadding
      />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/posts/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { notFound } from 'next/navigation.js'
import React from 'react'

import type { Post } from '../../../../../../payload-types.js'

import { postsSlug } from '../../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { PostClient } from './page.client.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  let post: null | Post = null

  try {
    post = await getDoc<Post>({
      slug,
      collection: postsSlug,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!post) {
    notFound()
  }

  return <PostClient post={post} />
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPosts = await getDocs<Post>(postsSlug)
    return ssrPosts?.map((page) => {
      return { slug: page.slug }
    })
  } catch (error) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/ssr/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { Gutter } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import type { Page } from '../../../../../../payload-types.js'

import { renderedPageTitleID, ssrPagesSlug } from '../../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { Hero } from '../../../_components/Hero/index.js'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SSRPage({ params: paramsPromise }: Args) {
  const { slug = ' ' } = await paramsPromise
  const data = await getDoc<Page>({
    slug,
    collection: ssrPagesSlug,
    draft: true,
  })

  if (!data) {
    notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <Hero {...data?.hero} />
      <Blocks blocks={data?.layout} />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </Fragment>
  )
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPages = await getDocs<Page>(ssrPagesSlug)
    return ssrPages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/ssr/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={PAYLOAD_SERVER_URL} />
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/ssr-autosave/[slug]/page.tsx
Signals: React, Next.js

```typescript
import { Gutter } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import type { Page } from '../../../../../../payload-types.js'

import { renderedPageTitleID, ssrAutosavePagesSlug } from '../../../../../../shared.js'
import { getDoc } from '../../../_api/getDoc.js'
import { getDocs } from '../../../_api/getDocs.js'
import { Blocks } from '../../../_components/Blocks/index.js'
import { Hero } from '../../../_components/Hero/index.js'
import { RefreshRouteOnSave } from './RefreshRouteOnSave.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function SSRAutosavePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const data = await getDoc<Page>({
    slug,
    collection: ssrAutosavePagesSlug,
    draft: true,
  })

  if (!data) {
    notFound()
  }

  return (
    <Fragment>
      <RefreshRouteOnSave />
      <Hero {...data?.hero} />
      <Blocks blocks={data?.layout} />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </Fragment>
  )
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'
  try {
    const ssrPages = await getDocs<Page>(ssrAutosavePagesSlug)
    return ssrPages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: RefreshRouteOnSave.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/ssr-autosave/[slug]/RefreshRouteOnSave.tsx
Signals: React, Next.js

```typescript
'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation.js'
import React from 'react'

import { PAYLOAD_SERVER_URL } from '../../../_api/serverURL.js'

export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={() => router.refresh()} serverURL={PAYLOAD_SERVER_URL} />
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/static/page.tsx
Signals: React

```typescript
import { Gutter } from '@payloadcms/ui'

import React, { Fragment } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function TestPage(args: Args) {
  return (
    <Fragment>
      <Gutter>
        <p>This is a static page for testing.</p>
      </Gutter>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.client.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/[slug]/page.client.tsx
Signals: React

```typescript
'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React from 'react'

import type { Page as PageType } from '../../../../../payload-types.js'

import { renderedPageTitleID } from '../../../../../shared.js'
import { PAYLOAD_SERVER_URL } from '../../_api/serverURL.js'
import { Blocks } from '../../_components/Blocks/index.js'
import { Gutter } from '../../_components/Gutter/index.js'
import { Hero } from '../../_components/Hero/index.js'

export const PageClient: React.FC<{
  page: PageType
}> = ({ page: initialPage }) => {
  const { data } = useLivePreview<PageType>({
    depth: 2,
    initialData: initialPage,
    serverURL: PAYLOAD_SERVER_URL,
  })

  return (
    <React.Fragment>
      <Hero {...data?.hero} />
      <Blocks
        blocks={[
          ...(data?.layout ?? []),
          {
            blockName: 'Relationships',
            blockType: 'relationships',
            data,
          },
        ]}
        disableTopPadding={
          !data?.hero || data?.hero?.type === 'none' || data?.hero?.type === 'lowImpact'
        }
      />
      <Gutter>
        <div id={renderedPageTitleID}>{`For Testing: ${data.title}`}</div>
      </Gutter>
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/(pages)/[slug]/page.tsx
Signals: React, Next.js

```typescript
/* eslint-disable no-restricted-exports */
import { notFound } from 'next/navigation.js'
import React from 'react'

import type { Page } from '../../../../../payload-types.js'

import { getDoc } from '../../_api/getDoc.js'
import { getDocs } from '../../_api/getDocs.js'
import { PageClient } from './page.client.js'

type Args = {
  params: Promise<{ slug?: string }>
}
export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  let page: null | Page = null

  try {
    page = await getDoc<Page>({
      slug,
      collection: 'pages',
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!page) {
    return notFound()
  }

  return <PageClient page={page} />
}

export async function generateStaticParams() {
  process.env.PAYLOAD_DROP_DATABASE = 'false'

  try {
    const pages = await getDocs<Page>('pages')
    return pages?.map((page) => {
      return { slug: page.slug }
    })
  } catch (_err) {
    return []
  }
}
```

--------------------------------------------------------------------------------

---[FILE: getDoc.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_api/getDoc.ts

```typescript
import type { CollectionSlug, Where } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'

export const getDoc = async <T>(args: {
  collection: CollectionSlug
  depth?: number
  draft?: boolean
  slug?: string
}): Promise<T> => {
  const payload = await getPayload({ config })
  const { slug, collection, depth = 2, draft } = args || {}

  const where: Where = {}

  if (slug) {
    where.slug = {
      equals: slug,
    }
  }

  try {
    const { docs } = await payload.find({
      collection,
      depth,
      where,
      draft,
      trash: true, // Include trashed documents
    })

    if (docs[0]) {
      return docs[0] as T
    }
  } catch (err: Error | any) {
    throw new Error(`Error getting doc: ${err.message}`)
  }

  throw new Error('No doc found')
}
```

--------------------------------------------------------------------------------

---[FILE: getDocs.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_api/getDocs.ts

```typescript
import config from '@payload-config'
import { type CollectionSlug, getPayload } from 'payload'

export const getDocs = async <T>(collection: CollectionSlug): Promise<T[]> => {
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection,
      depth: 0,
      limit: 100,
    })

    if (docs) {
      return docs as T[]
    }
  } catch (err) {
    throw new Error(`Error getting docs: ${err.message}`)
  }

  throw new Error('No docs found')
}
```

--------------------------------------------------------------------------------

---[FILE: getFooter.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_api/getFooter.ts

```typescript
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Footer } from '../../../../payload-types.js'

export async function getFooter(): Promise<Footer> {
  const payload = await getPayload({ config })

  try {
    const footer = await payload.findGlobal({
      slug: 'footer',
    })

    return footer
  } catch (err) {
    console.error(err)
  }

  throw new Error('Error getting footer.')
}
```

--------------------------------------------------------------------------------

---[FILE: getHeader.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_api/getHeader.ts

```typescript
import config from '@payload-config'
import { getPayload } from 'payload'

import type { Header } from '../../../../payload-types.js'

export async function getHeader(): Promise<Header> {
  const payload = await getPayload({ config })

  try {
    const header = await payload.findGlobal({
      slug: 'header',
    })

    return header
  } catch (err) {
    console.error(err)
  }

  throw new Error('Error getting header.')
}
```

--------------------------------------------------------------------------------

---[FILE: serverURL.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_api/serverURL.ts

```typescript
export const PAYLOAD_SERVER_URL = 'http://localhost:3000'
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/ArchiveBlock/index.module.scss

```text
@import '../../_css/common';

.archiveBlock {
  position: relative;
}

.introContent {
  margin-bottom: calc(var(--base) * 2);

  @include mid-break {
    margin-bottom: calc(var(--base) * 2);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/ArchiveBlock/index.tsx
Signals: React

```typescript
import React from 'react'

import type { ArchiveBlockProps } from './types.js'

import { CollectionArchive } from '../../_components/CollectionArchive/index.js'
import { Gutter } from '../../_components/Gutter/index.js'
import RichText from '../../_components/RichText/index.js'
import classes from './index.module.scss'

export const ArchiveBlock: React.FC<
  {
    id?: string
  } & ArchiveBlockProps
> = (props) => {
  const {
    id,
    categories,
    introContent,
    limit,
    populateBy,
    populatedDocs,
    populatedDocsTotal,
    relationTo,
    selectedDocs,
  } = props

  return (
    <div className={classes.archiveBlock} id={`block-${id}`}>
      {introContent && (
        <Gutter className={classes.introContent}>
          <RichText content={introContent} />
        </Gutter>
      )}
      <CollectionArchive
        categories={categories}
        limit={limit}
        populateBy={populateBy}
        populatedDocs={populatedDocs}
        populatedDocsTotal={populatedDocsTotal}
        relationTo={relationTo}
        selectedDocs={selectedDocs}
        sort="-publishedDate"
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/ArchiveBlock/types.ts

```typescript
import type { Page } from '../../../../payload-types.js'

export type ArchiveBlockProps = Extract<
  Exclude<Page['layout'], undefined>[0],
  { blockType: 'archive' }
>
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/test/live-preview/prod/app/live-preview/_blocks/CallToAction/index.module.scss

```text
@use '../../_css/queries.scss' as *;

$spacer-h: calc(var(--block-padding) / 2);

.callToAction {
  padding-left: $spacer-h;
  padding-right: $spacer-h;
  position: relative;
  background-color: var(--color-base-100);
  color: var(--color-base-1000);
}

.invert {
  background-color: var(--color-base-1000);
  color: var(--color-base-0);
}

.wrap {
  display: flex;
  gap: $spacer-h;
  align-items: center;

  @include mid-break {
    flex-direction: column;
    align-items: flex-start;
  }
}

.content {
  flex-grow: 1;
}

.linkGroup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  flex-shrink: 0;

  > * {
    margin-bottom: calc(var(--base) / 2);

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

````
