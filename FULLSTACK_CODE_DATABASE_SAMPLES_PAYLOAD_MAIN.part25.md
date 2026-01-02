---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 25
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 25 of 695)

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

---[FILE: document-views.mdx]---
Location: payload-main/docs/custom-components/document-views.mdx

```text
---
title: Document Views
label: Document Views
order: 50
desc:
keywords:
---

Document Views consist of multiple, individual views that together represent any single [Collection](../configuration/collections) or [Global](../configuration/globals) Document. All Document Views are scoped under the `/collections/:collectionSlug/:id` or the `/globals/:globalSlug` route, respectively.

There are a number of default Document Views, such as the [Edit View](./edit-view) and API View, but you can also create [entirely new views](./custom-views#adding-new-views) as needed. All Document Views share a layout and can be given their own tab-based navigation, if desired.

To customize Document Views, use the `admin.components.views.edit[key]` property in your [Collection Config](../configuration/collections) or [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollectionOrGlobalConfig: CollectionConfig = {
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        edit: {
          default: {
            Component: '/path/to/MyCustomEditView',
          },
          // Other options include:
          // - root
          // - api
          // - versions
          // - version
          // - [key: string]
          // See below for more details
        },
        // highlight-end
      },
    },
  },
}
```

## Config Options

The following options are available:

| Property      | Description                                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`        | The Root View overrides all other nested views and routes. No document controls or tabs are rendered when this key is set. [More details](#document-root).      |
| `default`     | The Default View is the primary view in which your document is edited. It is rendered within the "Edit" tab. [More details](./edit-view).                       |
| `versions`    | The Versions View is used to navigate the version history of a single document. It is rendered within the "Versions" tab. [More details](../versions/overview). |
| `version`     | The Version View is used to edit a single version of a document. It is rendered within the "Version" tab. [More details](../versions/overview).                 |
| `api`         | The API View is used to display the REST API JSON response for a given document. It is rendered within the "API" tab.                                           |
| `livePreview` | The LivePreview view is used to display the Live Preview interface. It is rendered within the "Live Preview" tab. [More details](../live-preview/overview).     |
| `[key]`       | Any other key can be used to add a completely new Document View.                                                                                                |

_For details on how to build Custom Views, including all available props, see [Building Custom Views](./custom-views#building-custom-views)._

### Document Root

The Document Root is mounted on the top-level route for a Document. Setting this property will completely take over the entire Document View layout, including the title, [Document Tabs](#document-tabs), _and all other nested Document Views_ including the [Edit View](./edit-view), API View, etc.

When setting a Document Root, you are responsible for rendering all necessary components and controls, as no document controls or tabs would be rendered. To replace only the Edit View precisely, use the `edit.default` key instead.

To override the Document Root, use the `views.edit.root` property in your [Collection Config](../configuration/collections) or [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    components: {
      views: {
        edit: {
          // highlight-start
          root: {
            Component: '/path/to/MyCustomRootComponent', // highlight-line
          },
          // highlight-end
        },
      },
    },
  },
}
```

### Edit View

The Edit View is where users interact with individual Collection and Global Documents. This is where they can view, edit, and save their content. The Edit View is keyed under the `default` property in the `views.edit` object.

For more information on customizing the Edit View, see the [Edit View](./edit-view) documentation.

## Document Tabs

Each Document View can be given a tab for navigation, if desired. Tabs are highly configurable, from as simple as changing the label to swapping out the entire component, they can be modified in any way.

To add or customize tabs in the Document View, use the `views.edit.[key].tab` property in your [Collection Config](../configuration/collections) or [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  slug: 'my-collection',
  admin: {
    components: {
      views: {
        edit: {
          myCustomView: {
            Component: '/path/to/MyCustomView',
            path: '/my-custom-tab',
            // highlight-start
            tab: {
              Component: '/path/to/MyCustomTabComponent',
            },
            // highlight-end
          },
          anotherCustomView: {
            Component: '/path/to/AnotherCustomView',
            path: '/another-custom-view',
            // highlight-start
            tab: {
              label: 'Another Custom View',
              href: '/another-custom-view',
              order: '100',
            },
            // highlight-end
          },
        },
      },
    },
  },
}
```

<Banner type="warning">
  **Note:** This applies to _both_ Collections _and_ Globals.
</Banner>

The following options are available for tabs:

| Property    | Description                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| `label`     | The label to display in the tab.                                                                              |
| `href`      | The URL to navigate to when the tab is clicked. This is optional and defaults to the tab's `path`.            |
| `order`     | The order in which the tab appears in the navigation. Can be set on default and custom tabs.                  |
| `Component` | The component to render in the tab. This can be a Server or Client component. [More details](#tab-components) |

### Tab Components

If changing the label or href is not enough, you can also replace the entire tab component with your own custom component. This can be done by setting the `tab.Component` property to the path of your custom component.

Here is an example of how to scaffold a custom Document Tab:

#### Server Component

```tsx
import React from 'react'
import type { DocumentTabServerProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function MyCustomTabComponent(props: DocumentTabServerProps) {
  return (
    <Link href="/my-custom-tab">This is a custom Document Tab (Server)</Link>
  )
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { DocumentTabClientProps } from 'payload'
import { Link } from '@payloadcms/ui'

export function MyCustomTabComponent(props: DocumentTabClientProps) {
  return (
    <Link href="/my-custom-tab">This is a custom Document Tab (Client)</Link>
  )
}
```
```

--------------------------------------------------------------------------------

---[FILE: edit-view.mdx]---
Location: payload-main/docs/custom-components/edit-view.mdx

```text
---
title: Edit View
label: Edit View
order: 60
desc:
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Edit View is where users interact with individual [Collection](../configuration/collections) and [Global](../configuration/globals) Documents within the [Admin Panel](../admin/overview). The Edit View contains the actual form that submits the data to the server. This is where they can view, edit, and save their content. It contains controls for saving, publishing, and previewing the document, all of which can be customized to a high degree.

The Edit View can be swapped out in its entirety for a Custom View, or it can be injected with a number of Custom Components to add additional functionality or presentational elements without replacing the entire view.

<Banner type="warning">
  **Note:** The Edit View is one of many [Document Views](./document-views) in
  the Payload Admin Panel. Each Document View is responsible for a different
  aspect of interacting with a single Document.
</Banner>

## Custom Edit View

To swap out the entire Edit View with a [Custom View](./custom-views), use the `views.edit.default` property in your [Collection Config](../configuration/collections) or [Global Config](../configuration/globals):

```tsx
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        edit: {
          // highlight-start
          default: {
            Component: '/path/to/MyCustomEditViewComponent',
          },
          // highlight-end
        },
      },
    },
  },
})
```

Here is an example of a custom Edit View:

#### Server Component

```tsx
import React from 'react'
import type { DocumentViewServerProps } from 'payload'

export function MyCustomServerEditView(props: DocumentViewServerProps) {
  return <div>This is a custom Edit View (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { DocumentViewClientProps } from 'payload'

export function MyCustomClientEditView(props: DocumentViewClientProps) {
  return <div>This is a custom Edit View (Client)</div>
}
```

_For details on how to build Custom Views, including all available props, see [Building Custom Views](./custom-views#building-custom-views)._

## Custom Components

In addition to swapping out the entire Edit View with a [Custom View](./custom-views), you can also override individual components. This allows you to customize specific parts of the Edit View without swapping out the entire view.

<Banner type="warning">
  **Important:** Collection and Globals are keyed to a different property in the
  `admin.components` object and have slightly different options. Be sure to use the
  correct key for the entity you are working with.
</Banner>

#### Collections

To override Edit View components for a Collection, use the `admin.components.edit` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      edit: {
        // ...
      },
      // highlight-end
    },
  },
}
```

The following options are available:

| Path                     | Description                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `beforeDocumentControls` | Inject custom components before the Save / Publish buttons. [More details](#beforedocumentcontrols).                         |
| `editMenuItems`          | Inject custom components within the 3-dot menu dropdown located in the document control bar. [More details](#editmenuitems). |
| `SaveButton`             | A button that saves the current document. [More details](#savebutton).                                                       |
| `SaveDraftButton`        | A button that saves the current document as a draft. [More details](#savedraftbutton).                                       |
| `PublishButton`          | A button that publishes the current document. [More details](#publishbutton).                                                |
| `PreviewButton`          | A button that previews the current document. [More details](#previewbutton).                                                 |
| `Description`            | A description of the Collection. [More details](#description).                                                               |
| `Upload`                 | A file upload component. [More details](#upload).                                                                            |

#### Globals

To override Edit View components for Globals, use the `admin.components.elements` property in your [Global Config](../configuration/globals):

```ts
import type { GlobalConfig } from 'payload'

export const MyGlobal: GlobalConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      elements: {
        // ...
      },
      // highlight-end
    },
  },
}
```

The following options are available:

| Path                     | Description                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `beforeDocumentControls` | Inject custom components before the Save / Publish buttons. [More details](#beforedocumentcontrols).                         |
| `editMenuItems`          | Inject custom components within the 3-dot menu dropdown located in the document control bar. [More details](#editmenuitems). |
| `SaveButton`             | A button that saves the current document. [More details](#savebutton).                                                       |
| `SaveDraftButton`        | A button that saves the current document as a draft. [More details](#savedraftbutton).                                       |
| `PublishButton`          | A button that publishes the current document. [More details](#publishbutton).                                                |
| `PreviewButton`          | A button that previews the current document. [More details](#previewbutton).                                                 |
| `Description`            | A description of the Global. [More details](#description).                                                                   |

### SaveButton

The `SaveButton` property allows you to render a custom Save Button in the Edit View.

To add a `SaveButton` component, use the `components.edit.SaveButton` property in your [Collection Config](../configuration/collections) or `components.elements.SaveButton` in your [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // highlight-start
        SaveButton: '/path/to/MySaveButton',
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `SaveButton` component:

#### Server Component

```tsx
import React from 'react'
import { SaveButton } from '@payloadcms/ui'
import type { SaveButtonServerProps } from 'payload'

export function MySaveButton(props: SaveButtonServerProps) {
  return <SaveButton label="Save" />
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { SaveButton } from '@payloadcms/ui'
import type { SaveButtonClientProps } from 'payload'

export function MySaveButton(props: SaveButtonClientProps) {
  return <SaveButton label="Save" />
}
```

### beforeDocumentControls

The `beforeDocumentControls` property allows you to render custom components just before the default document action buttons (like Save, Publish, or Preview). This is useful for injecting custom buttons, status indicators, or any other UI elements before the built-in controls.

To add `beforeDocumentControls` components, use the `components.edit.beforeDocumentControls` property in your [Collection Config](../configuration/collections) or `components.elements.beforeDocumentControls` in your [Global Config](../configuration/globals):

#### Collections

```
export const MyCollection: CollectionConfig = {
  admin: {
    components: {
      edit: {
        // highlight-start
        beforeDocumentControls: ['/path/to/CustomComponent'],
        // highlight-end
      },
    },
  },
}
```

#### Globals

```
export const MyGlobal: GlobalConfig = {
  admin: {
    components: {
      elements: {
        // highlight-start
        beforeDocumentControls: ['/path/to/CustomComponent'],
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `beforeDocumentControls` component:

#### Server Component

```tsx
import React from 'react'
import type { BeforeDocumentControlsServerProps } from 'payload'

export function MyCustomDocumentControlButton(
  props: BeforeDocumentControlsServerProps,
) {
  return <div>This is a custom beforeDocumentControl button (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { BeforeDocumentControlsClientProps } from 'payload'

export function MyCustomDocumentControlButton(
  props: BeforeDocumentControlsClientProps,
) {
  return <div>This is a custom beforeDocumentControl button (Client)</div>
}
```

### editMenuItems

The `editMenuItems` property allows you to inject custom components into the 3-dot menu dropdown located in the document controls bar. This dropdown contains default options including `Create New`, `Duplicate`, `Delete`, and other options when additional features are enabled. Any custom components you add will appear below these default items.

To add `editMenuItems`, use the `components.edit.editMenuItems` property in your [Collection Config](../configuration/collections):

#### Config Example

```ts
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    components: {
      edit: {
        // highlight-start
        editMenuItems: ['/path/to/CustomEditMenuItem'],
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `editMenuItems` component:

#### Server Component

```tsx
import React from 'react'

import type { EditMenuItemsServerProps } from 'payload'

export const EditMenuItems = async (props: EditMenuItemsServerProps) => {
  const href = `/custom-action?id=${props.id}`

  return (
    <>
      <a href={href}>Custom Edit Menu Item</a>
      <a href={href}>
        Another Custom Edit Menu Item - add as many as you need!
      </a>
    </>
  )
}
```

#### Client Component

```tsx
'use client'

import React from 'react'
import { PopupList } from '@payloadcms/ui'

import type { EditViewMenuItemClientProps } from 'payload'

export const EditMenuItems = (props: EditViewMenuItemClientProps) => {
  const handleClick = () => {
    console.log('Custom button clicked!')
  }

  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={handleClick}>
        Custom Edit Menu Item
      </PopupList.Button>
      <PopupList.Button onClick={handleClick}>
        Another Custom Edit Menu Item - add as many as you need!
      </PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

<Banner type="info">
  **Styling:** Use Payload's built-in `PopupList.Button` to ensure your menu
  items automatically match the default dropdown styles. If you want a different
  look, you can customize the appearance by passing your own `className` to
  `PopupList.Button`, or use a completely custom button built with a standard
  HTML `button` element or any other component that fits your design
  preferences.
</Banner>

### SaveDraftButton

The `SaveDraftButton` property allows you to render a custom Save Draft Button in the Edit View.

To add a `SaveDraftButton` component, use the `components.edit.SaveDraftButton` property in your [Collection Config](../configuration/collections) or `components.elements.SaveDraftButton` in your [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // highlight-start
        SaveDraftButton: '/path/to/MySaveDraftButton',
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `SaveDraftButton` component:

#### Server Component

```tsx
import React from 'react'
import { SaveDraftButton } from '@payloadcms/ui'
import type { SaveDraftButtonServerProps } from 'payload'

export function MySaveDraftButton(props: SaveDraftButtonServerProps) {
  return <SaveDraftButton />
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { SaveDraftButton } from '@payloadcms/ui'
import type { SaveDraftButtonClientProps } from 'payload'

export function MySaveDraftButton(props: SaveDraftButtonClientProps) {
  return <SaveDraftButton />
}
```

### PublishButton

The `PublishButton` property allows you to render a custom Publish Button in the Edit View.

To add a `PublishButton` component, use the `components.edit.PublishButton` property in your [Collection Config](../configuration/collections) or `components.elements.PublishButton` in your [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // highlight-start
        PublishButton: '/path/to/MyPublishButton',
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `PublishButton` component:

#### Server Component

```tsx
import React from 'react'
import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export function MyPublishButton(props: PublishButtonServerProps) {
  return <PublishButton label="Publish" />
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { PublishButton } from '@payloadcms/ui'
import type { PublishButtonClientProps } from 'payload'

export function MyPublishButton(props: PublishButtonClientProps) {
  return <PublishButton label="Publish" />
}
```

### PreviewButton

The `PreviewButton` property allows you to render a custom Preview Button in the Edit View.

To add a `PreviewButton` component, use the `components.edit.PreviewButton` property in your [Collection Config](../configuration/collections) or `components.elements.PreviewButton` in your [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // highlight-start
        PreviewButton: '/path/to/MyPreviewButton',
        // highlight-end
      },
    },
  },
}
```

Here's an example of a custom `PreviewButton` component:

#### Server Component

```tsx
import React from 'react'
import { PreviewButton } from '@payloadcms/ui'
import type { PreviewButtonServerProps } from 'payload'

export function MyPreviewButton(props: PreviewButtonServerProps) {
  return <PreviewButton />
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import { PreviewButton } from '@payloadcms/ui'
import type { PreviewButtonClientProps } from 'payload'

export function MyPreviewButton(props: PreviewButtonClientProps) {
  return <PreviewButton />
}
```

### Description

The `Description` property allows you to render a custom description of the Collection or Global in the Edit View.

To add a `Description` component, use the `components.edit.Description` property in your [Collection Config](../configuration/collections) or `components.elements.Description` in your [Global Config](../configuration/globals):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      Description: '/path/to/MyDescriptionComponent',
      // highlight-end
    },
  },
}
```

<Banner type="warning">
  **Note:** The `Description` component is shared between the Edit View and the
  [List View](./list-view).
</Banner>

Here's an example of a custom `Description` component:

#### Server Component

```tsx
import React from 'react'
import type { ViewDescriptionServerProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionServerProps) {
  return <div>This is a custom description component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { ViewDescriptionClientProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionClientProps) {
  return <div>This is a custom description component (Client)</div>
}
```

### Upload

The `Upload` property allows you to render a custom file upload component in the Edit View.

To add an `Upload` component, use the `components.edit.Upload` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      edit: {
        // highlight-start
        Upload: '/path/to/MyUploadComponent',
        // highlight-end
      },
    },
  },
}
```

<Banner type="warning">
  **Note:** The Upload component is only available for Collections.
</Banner>

Here's an example of a custom `Upload` component:

```tsx
import React from 'react'

export function MyUploadComponent() {
  return <input type="file" />
}
```
```

--------------------------------------------------------------------------------

---[FILE: list-view.mdx]---
Location: payload-main/docs/custom-components/list-view.mdx

```text
---
title: List View
label: List View
order: 70
desc:
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The List View is where users interact with a list of [Collection](../configuration/collections) Documents within the [Admin Panel](../admin/overview). This is where they can view, sort, filter, and paginate their documents to find exactly what they're looking for. This is also where users can perform bulk operations on multiple documents at once, such as deleting, editing, or publishing many.

The List View can be swapped out in its entirety for a Custom View, or it can be injected with a number of Custom Components to add additional functionality or presentational elements without replacing the entire view.

<Banner type="info">
  **Note:** Only [Collections](../configuration/collections) have a List View.
  [Globals](../configuration/globals) do not have a List View as they are single
  documents.
</Banner>

## Custom List View

To swap out the entire List View with a [Custom View](./custom-views), use the `admin.components.views.list` property in your [Payload Config](../configuration/overview):

```tsx
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      views: {
        // highlight-start
        list: '/path/to/MyCustomListView',
        // highlight-end
      },
    },
  },
})
```

Here is an example of a custom List View:

#### Server Component

```tsx
import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'

export function MyCustomServerListView(props: ListViewServerProps) {
  return <div>This is a custom List View (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { ListViewClientProps } from 'payload'

export function MyCustomClientListView(props: ListViewClientProps) {
  return <div>This is a custom List View (Client)</div>
}
```

_For details on how to build Custom Views, including all available props, see [Building Custom Views](./custom-views#building-custom-views)._

## Custom Components

In addition to swapping out the entire List View with a [Custom View](./custom-views), you can also override individual components. This allows you to customize specific parts of the List View without swapping out the entire view for your own.

To override List View components for a Collection, use the `admin.components` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    // highlight-start
    components: {
      // ...
    },
    // highlight-end
  },
}
```

The following options are available:

| Path              | Description                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `beforeList`      | An array of custom components to inject before the list of documents in the List View. [More details](#beforelist).       |
| `beforeListTable` | An array of custom components to inject before the table of documents in the List View. [More details](#beforelisttable). |
| `afterList`       | An array of custom components to inject after the list of documents in the List View. [More details](#afterlist).         |
| `afterListTable`  | An array of custom components to inject after the table of documents in the List View. [More details](#afterlisttable).   |
| `listMenuItems`   | An array of components to render within a menu next to the List Controls (after the Columns and Filters options)          |
| `Description`     | A component to render a description of the Collection. [More details](#description).                                      |

### beforeList

The `beforeList` property allows you to inject custom components before the list of documents in the List View.

To add `beforeList` components, use the `components.beforeList` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      beforeList: ['/path/to/MyBeforeListComponent'],
      // highlight-end
    },
  },
}
```

Here's an example of a custom `beforeList` component:

#### Server Component

```tsx
import React from 'react'
import type { BeforeListServerProps } from 'payload'

export function MyBeforeListComponent(props: BeforeListServerProps) {
  return <div>This is a custom beforeList component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { BeforeListClientProps } from 'payload'

export function MyBeforeListComponent(props: BeforeListClientProps) {
  return <div>This is a custom beforeList component (Client)</div>
}
```

### beforeListTable

The `beforeListTable` property allows you to inject custom components before the table of documents in the List View.

To add `beforeListTable` components, use the `components.beforeListTable` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      beforeListTable: ['/path/to/MyBeforeListTableComponent'],
      // highlight-end
    },
  },
}
```

Here's an example of a custom `beforeListTable` component:

#### Server Component

```tsx
import React from 'react'
import type { BeforeListTableServerProps } from 'payload'

export function MyBeforeListTableComponent(props: BeforeListTableServerProps) {
  return <div>This is a custom beforeListTable component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { BeforeListTableClientProps } from 'payload'

export function MyBeforeListTableComponent(props: BeforeListTableClientProps) {
  return <div>This is a custom beforeListTable component (Client)</div>
}
```

### afterList

The `afterList` property allows you to inject custom components after the list of documents in the List View.

To add `afterList` components, use the `components.afterList` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      afterList: ['/path/to/MyAfterListComponent'],
      // highlight-end
    },
  },
}
```

Here's an example of a custom `afterList` component:

#### Server Component

```tsx
import React from 'react'
import type { AfterListServerProps } from 'payload'

export function MyAfterListComponent(props: AfterListServerProps) {
  return <div>This is a custom afterList component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { AfterListClientProps } from 'payload'

export function MyAfterListComponent(props: AfterListClientProps) {
  return <div>This is a custom afterList component (Client)</div>
}
```

### afterListTable

The `afterListTable` property allows you to inject custom components after the table of documents in the List View.

To add `afterListTable` components, use the `components.afterListTable` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      afterListTable: ['/path/to/MyAfterListTableComponent'],
      // highlight-end
    },
  },
}
```

Here's an example of a custom `afterListTable` component:

#### Server Component

```tsx
import React from 'react'
import type { AfterListTableServerProps } from 'payload'

export function MyAfterListTableComponent(props: AfterListTableServerProps) {
  return <div>This is a custom afterListTable component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { AfterListTableClientProps } from 'payload'

export function MyAfterListTableComponent(props: AfterListTableClientProps) {
  return <div>This is a custom afterListTable component (Client)</div>
}
```

### Description

The `Description` property allows you to render a custom description of the Collection in the List View.

To add a `Description` component, use the `components.Description` property in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  admin: {
    components: {
      // highlight-start
      Description: '/path/to/MyDescriptionComponent',
      // highlight-end
    },
  },
}
```

<Banner type="warning">
  **Note:** The `Description` component is shared between the List View and the
  [Edit View](./edit-view).
</Banner>

Here's an example of a custom `Description` component:

#### Server Component

```tsx
import React from 'react'
import type { ViewDescriptionServerProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionServerProps) {
  return <div>This is a custom Collection description component (Server)</div>
}
```

#### Client Component

```tsx
'use client'
import React from 'react'
import type { ViewDescriptionClientProps } from 'payload'

export function MyDescriptionComponent(props: ViewDescriptionClientProps) {
  return <div>This is a custom Collection description component (Client)</div>
}
```
```

--------------------------------------------------------------------------------

````
