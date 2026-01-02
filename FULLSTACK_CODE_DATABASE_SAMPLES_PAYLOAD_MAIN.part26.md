---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 26
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 26 of 695)

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

---[FILE: overview.mdx]---
Location: payload-main/docs/custom-components/overview.mdx

```text
---
title: Swap in your own React components
label: Overview
order: 10
desc: Fully customize your Admin Panel by swapping in your own React components. Add fields, remove views, update routes and change functions to sculpt your perfect Dashboard.
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

The Payload [Admin Panel](../admin/overview) is designed to be as minimal and straightforward as possible to allow for easy customization and full control over the UI. In order for Payload to support this level of customization, Payload provides a pattern for you to supply your own React components through your [Payload Config](../configuration/overview).

All Custom Components in Payload are [React Server Components](https://react.dev/reference/rsc/server-components) by default. This enables the use of the [Local API](../local-api/overview) directly on the front-end. Custom Components are available for nearly every part of the Admin Panel for extreme granularity and control.

<Banner type="success">
  **Note:** Client Components continue to be fully supported. To use Client
  Components in your app, simply include the `'use client'` directive. Payload
  will automatically detect and remove all
  [non-serializable](https://react.dev/reference/rsc/use-client#serializable-types)
  default props before rendering your component. [More
  details](#client-components).
</Banner>

There are four main types of Custom Components in Payload:

- [Root Components](./root-components)
- [Collection Components](../configuration/collections#custom-components)
- [Global Components](../configuration/globals#custom-components)
- [Field Components](../fields/overview#custom-components)

To swap in your own Custom Component, first determine the scope that corresponds to what you are trying to accomplish, consult the list of available components, then [author your React component(s)](#building-custom-components) accordingly.

## Defining Custom Components

As Payload compiles the Admin Panel, it checks your config for Custom Components. When detected, Payload either replaces its own default component with yours, or if none exists by default, renders yours outright. While there are many places where Custom Components are supported in Payload, each is defined in the same way using [Component Paths](#component-paths).

To add a Custom Component, point to its file path in your Payload Config:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        Button: '/src/components/Logout#MyComponent', // highlight-line
      },
    },
  },
})
```

<Banner type="success">
  **Note:** All Custom Components can be either Server Components or Client
  Components, depending on the presence of the `'use client'` directive at the
  top of the file.
</Banner>

### Component Paths

In order to ensure the Payload Config is fully Node.js compatible and as lightweight as possible, components are not directly imported into your config. Instead, they are identified by their file path for the Admin Panel to resolve on its own.

Component Paths, by default, are relative to your project's base directory. This is either your current working directory, or the directory specified in `config.admin.importMap.baseDir`.

Components using named exports are identified either by appending `#` followed by the export name, or using the `exportName` property. If the component is the default export, this can be omitted.

```ts
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'), // highlight-line
    },
    components: {
      logout: {
        Button: '/components/Logout#MyComponent', // highlight-line
      },
    },
  },
})
```

In this example, we set the base directory to the `src` directory, and omit the `/src/` part of our component path string.

### Component Config

While Custom Components are usually defined as a string, you can also pass in an object with additional options:

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    components: {
      logout: {
        // highlight-start
        Button: {
          path: '/src/components/Logout',
          exportName: 'MyComponent',
        },
        // highlight-end
      },
    },
  },
})
```

The following options are available:

| Property      | Description                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `clientProps` | Props to be passed to the Custom Components if it's a Client Component. [More details](#custom-props).                        |
| `exportName`  | Instead of declaring named exports using `#` in the component path, you can also omit them from `path` and pass them in here. |
| `path`        | File path to the Custom Component. Named exports can be appended to the end of the path, separated by a `#`.                  |
| `serverProps` | Props to be passed to the Custom Component if it's a Server Component. [More details](#custom-props).                         |

For details on how to build Custom Components, see [Building Custom Components](#building-custom-components).

### Import Map

In order for Payload to make use of [Component Paths](#component-paths), an "Import Map" is automatically generated at either `src/app/(payload)/admin/importMap.js` or `app/(payload)/admin/importMap.js`. This file contains every Custom Component in your config, keyed to their respective paths. When Payload needs to lookup a component, it uses this file to find the correct import.

The Import Map is automatically regenerated at startup and whenever Hot Module Replacement (HMR) runs, or you can run `payload generate:importmap` to manually regenerate it.

#### Overriding Import Map Location

Using the `config.admin.importMap.importMapFile` property, you can override the location of the import map. This is useful if you want to place the import map in a different location, or if you want to use a custom file name.

```ts
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import path from 'path'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  // ...
  admin: {
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(
        dirname,
        'app',
        '(payload)',
        'custom-import-map.js',
      ), // highlight-line
    },
  },
})
```

#### Custom Imports

If needed, custom items can be appended onto the Import Map. This is mostly only relevant for plugin authors who need to add a custom import that is not referenced in a known location.

To add a custom import to the Import Map, use the `admin.dependencies` property in your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // ...
    dependencies: {
      myTestComponent: {
        // myTestComponent is the key - can be anything
        path: '/components/TestComponent.js#TestComponent',
        type: 'component',
        clientProps: {
          test: 'hello',
        },
      },
    },
  },
})
```

## Building Custom Components

All Custom Components in Payload are [React Server Components](https://react.dev/reference/rsc/server-components) by default. This enables the use of the [Local API](../local-api/overview) directly on the front-end, among other things.

### Default Props

To make building Custom Components as easy as possible, Payload automatically provides common props, such as the [`payload`](../local-api/overview) class and the [`i18n`](../configuration/i18n) object. This means that when building Custom Components within the Admin Panel, you do not have to get these yourself.

Here is an example:

```tsx
import React from 'react'
import type { Payload } from 'payload'

async function MyServerComponent({
  payload, // highlight-line
}: {
  payload: Payload
}) {
  const page = await payload.findByID({
    collection: 'pages',
    id: '123',
  })

  return <p>{page.title}</p>
}
```

Each Custom Component receives the following props by default:

| Prop      | Description                                 |
| --------- | ------------------------------------------- |
| `payload` | The [Payload](../local-api/overview) class. |
| `i18n`    | The [i18n](../configuration/i18n) object.   |

<Banner type="warning">
  **Reminder:** All Custom Components also receive various other props that are
  specific to the component being rendered. See [Root
  Components](#root-components), [Collection
  Components](../configuration/collections#custom-components), [Global
  Components](../configuration/globals#custom-components), or [Field
  Components](../fields/overview#custom-components) for a complete list of all
  default props per component.
</Banner>

### Custom Props

It is also possible to pass custom props to your Custom Components. To do this, you can use either the `clientProps` or `serverProps` properties depending on whether your prop is [serializable](https://react.dev/reference/rsc/use-client#serializable-types), and whether your component is a Server or Client Component.

```ts
import { buildConfig } from 'payload'

const config = buildConfig({
  // ...
  admin: {
    // highlight-line
    components: {
      logout: {
        Button: {
          path: '/src/components/Logout#MyComponent',
          clientProps: {
            myCustomProp: 'Hello, World!', // highlight-line
          },
        },
      },
    },
  },
})
```

Here is how your component might receive this prop:

```tsx
import React from 'react'
import { Link } from '@payloadcms/ui'

export function MyComponent({ myCustomProp }: { myCustomProp: string }) {
  return <Link href="/admin/logout">{myCustomProp}</Link>
}
```

### Client Components

All Custom Components in Payload are [React Server Components](https://react.dev/reference/rsc/server-components) by default, however, it is possible to use [Client Components](https://react.dev/reference/rsc/use-client) by simply adding the `'use client'` directive at the top of your file. Payload will automatically detect and remove all [non-serializable](https://react.dev/reference/rsc/use-client#serializable-types) default props before rendering your component.

```tsx
// highlight-start
'use client'
// highlight-end
import React, { useState } from 'react'

export function MyClientComponent() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  )
}
```

<Banner type="warning">
  **Reminder:** Client Components cannot be passed [non-serializable
  props](https://react.dev/reference/rsc/use-client#serializable-types). If you
  are rendering your Client Component _from within_ a Server Component, ensure
  that its props are serializable.
</Banner>

### Accessing the Payload Config

From any Server Component, the [Payload Config](../configuration/overview) can be accessed directly from the `payload` prop:

```tsx
import React from 'react'

export default async function MyServerComponent({
  payload: {
    config, // highlight-line
  },
}) {
  return <Link href={config.serverURL}>Go Home</Link>
}
```

But, the Payload Config is [non-serializable](https://react.dev/reference/rsc/use-client#serializable-types) by design. It is full of custom validation functions and more. This means that the Payload Config, in its entirety, cannot be passed directly to Client Components.

For this reason, Payload creates a Client Config and passes it into the Config Provider. This is a serializable version of the Payload Config that can be accessed from any Client Component via the [`useConfig`](../admin/react-hooks#useconfig) hook:

```tsx
'use client'
import React from 'react'
import { useConfig } from '@payloadcms/ui'

export function MyClientComponent() {
  // highlight-start
  const {
    config: { serverURL },
  } = useConfig()
  // highlight-end

  return <Link href={serverURL}>Go Home</Link>
}
```

<Banner type="success">
  See [Using Hooks](#using-hooks) for more details.
</Banner>

Similarly, all [Field Components](../fields/overview#custom-components) automatically receive their respective Field Config through props.

Within Server Components, this prop is named `field`:

```tsx
import React from 'react'
import type { TextFieldServerComponent } from 'payload'

export const MyClientFieldComponent: TextFieldServerComponent = ({
  field: { name },
}) => {
  return <p>{`This field's name is ${name}`}</p>
}
```

Within Client Components, this prop is named `clientField` because its non-serializable props have been removed:

```tsx
'use client'
import React from 'react'
import type { TextFieldClientComponent } from 'payload'

export const MyClientFieldComponent: TextFieldClientComponent = ({
  clientField: { name },
}) => {
  return <p>{`This field's name is ${name}`}</p>
}
```

### Getting the Current Language

All Custom Components can support language translations to be consistent with Payload's [I18n](../configuration/i18n). This will allow your Custom Components to display the correct language based on the user's preferences.

To do this, first add your translation resources to the [I18n Config](../configuration/i18n). Then from any Server Component, you can translate resources using the `getTranslation` function from `@payloadcms/translations`.

All Server Components automatically receive the `i18n` object as a prop by default:

```tsx
import React from 'react'
import { getTranslation } from '@payloadcms/translations'

export default async function MyServerComponent({ i18n }) {
  const translatedTitle = getTranslation(myTranslation, i18n) // highlight-line

  return <p>{translatedTitle}</p>
}
```

The best way to do this within a Client Component is to import the `useTranslation` hook from `@payloadcms/ui`:

```tsx
'use client'
import React from 'react'
import { useTranslation } from '@payloadcms/ui'

export function MyClientComponent() {
  const { t, i18n } = useTranslation() // highlight-line

  return (
    <ul>
      <li>{t('namespace1:key', { variable: 'value' })}</li>
      <li>{t('namespace2:key', { variable: 'value' })}</li>
      <li>{i18n.language}</li>
    </ul>
  )
}
```

<Banner type="success">
  See the [Hooks](../admin/react-hooks) documentation for a full list of
  available hooks.
</Banner>

### Getting the Current Locale

All [Custom Views](./custom-views) can support multiple locales to be consistent with Payload's [Localization](../configuration/localization) feature. This can be used to scope API requests, etc.

All Server Components automatically receive the `locale` object as a prop by default:

```tsx
import React from 'react'

export default async function MyServerComponent({ payload, locale }) {
  const localizedPage = await payload.findByID({
    collection: 'pages',
    id: '123',
    locale,
  })

  return <p>{localizedPage.title}</p>
}
```

The best way to do this within a Client Component is to import the `useLocale` hook from `@payloadcms/ui`:

```tsx
'use client'
import React from 'react'
import { useLocale } from '@payloadcms/ui'

function Greeting() {
  const locale = useLocale() // highlight-line

  const trans = {
    en: 'Hello',
    es: 'Hola',
  }

  return <span>{trans[locale.code]}</span>
}
```

<Banner type="success">
  See the [Hooks](../admin/react-hooks) documentation for a full list of
  available hooks.
</Banner>

### Using Hooks

To make it easier to [build your Custom Components](#building-custom-components), you can use [Payload's built-in React Hooks](../admin/react-hooks) in any Client Component. For example, you might want to interact with one of Payload's many React Contexts. To do this, you can use one of the many hooks available depending on your needs.

```tsx
'use client'
import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export function MyClientComponent() {
  const { slug } = useDocumentInfo() // highlight-line

  return <p>{`Entity slug: ${slug}`}</p>
}
```

<Banner type="success">
  See the [Hooks](../admin/react-hooks) documentation for a full list of
  available hooks.
</Banner>

### Adding Styles

Payload has a robust [CSS Library](../admin/customizing-css) that you can use to style your Custom Components to match to Payload's built-in styling. This will ensure that your Custom Components integrate well into the existing design system. This will make it so they automatically adapt to any theme changes that might occur.

To apply custom styles, simply import your own `.css` or `.scss` file into your Custom Component:

```tsx
import './index.scss'

export function MyComponent() {
  return <div className="my-component">My Custom Component</div>
}
```

Then to colorize your Custom Component's background, for example, you can use the following CSS:

```scss
.my-component {
  background-color: var(--theme-elevation-500);
}
```

Payload also exports its [SCSS](https://sass-lang.com) library for reuse which includes mixins, etc. To use this, simply import it as follows into your `.scss` file:

```scss
@import '~@payloadcms/ui/scss';

.my-component {
  @include mid-break {
    background-color: var(--theme-elevation-900);
  }
}
```

<Banner type="success">
  **Note:** You can also drill into Payload's own component styles, or easily
  apply global, app-wide CSS. More on that [here](../admin/customizing-css).
</Banner>

## Performance

An often overlooked aspect of Custom Components is performance. If unchecked, Custom Components can lead to slow load times of the Admin Panel and ultimately a poor user experience.

This is different from front-end performance of your public-facing site.

<Banner type="success">
  For more performance tips, see the [Performance
  documentation](../performance/overview).
</Banner>

### Follow React and Next.js best practices

All Custom Components are built using [React](https://react.dev). For this reason, it is important to follow React best practices. This includes using memoization, streaming, caching, optimizing renders, using hooks appropriately, and more.

To learn more, see the [React documentation](https://react.dev/learn).

The Admin Panel itself is a [Next.js](https://nextjs.org) application. For this reason, it is _also_ important to follow Next.js best practices. This includes bundling, when to use layouts vs pages, where to place the server/client boundary, and more.

To learn more, see the [Next.js documentation](https://nextjs.org/docs).

### Reducing initial HTML size

With Server Components, be aware of what is being sent to through the server/client boundary. All props are serialized and sent through the network. This can lead to large HTML sizes and slow initial load times if too much data is being sent to the client.

To minimize this, you must be explicit about what props are sent to the client. Prefer server components and only send the necessary props to the client. This will also offset some of the JS execution to the server.

<Banner type="success">
  **Tip:** Use [React Suspense](https://react.dev/reference/react/Suspense) to
  progressively load components and improve perceived performance.
</Banner>

### Prevent unnecessary re-renders

If subscribing your component to form state, it may be re-rendering more often than necessary.

To do this, use the [`useFormFields`](../admin/react-hooks) hook instead of `useFields` when you only need to access specific fields.

```ts
'use client'
import { useFormFields } from '@payloadcms/ui'

const MyComponent: TextFieldClientComponent = ({ path }) => {
  const value = useFormFields(([fields, dispatch]) => fields[path])
  // ...
}
```

### Imports best practices

When building Custom Components it's important to be mindful of your bundle sizes sent to the client which are primarily affected by your imports. Generally speaking you can import third party packages as needed though it's best to avoid large packages that bloat your bundle size.

The most common issue is importing from our `@payloadcms/ui` package in the wrong context. So here are the simple rules to follow:

- In the **admin panel UI** you always want to import everything from `@payloadcms/ui` to ensure there's no package mismatch issues.
- In the **frontend application** you must always import components and utilities from `@payloadcms/ui/path/to` for example `import { Button } from '@payloadcms/ui/elements/Button'` to ensure tree shaking is effective and your bundle sizes are minimized otherwise it will include the entire library with your frontend code and greatly bloat your bundle size.

<Banner type="success">
  See the [Performance](../performance/overview) documentation for more tips and
  best practices.
</Banner>

### Troubleshooting

#### 'Assignment cannot be destructured' or 'value ... of useConfig is undefined'

There's a few variations of this error that hint at the same problem, sometimes it will error on `useConfig` hook or any other Payload UI hook like `useAuth`, `useLocale` with the error message that the value being destructured is `undefined`.

See [Troubleshooting Common Issues in Payload](../troubleshooting/troubleshooting#dependency-mismatches) for more details on resolving dependency mismatches.

<Banner type="info">
  Generally we recommend pinning Payload packages to the exact same version in
  order to ensure that your package manager installs the same versions across
  all Payload packages.
</Banner>
```

--------------------------------------------------------------------------------

---[FILE: root-components.mdx]---
Location: payload-main/docs/custom-components/root-components.mdx

```text
---
title: Root Components
label: Root Components
order: 20
desc:
keywords: admin, components, custom, documentation, Content Management System, cms, headless, javascript, node, react, nextjs
---

Root Components are those that affect the [Admin Panel](../admin/overview) at a high-level, such as the logo or the main nav. You can swap out these components with your own [Custom Components](./overview) to create a completely custom look and feel.

When combined with [Custom CSS](../admin/customizing-css), you can create a truly unique experience for your users, such as white-labeling the Admin Panel to match your brand.

To override Root Components, use the `admin.components` property at the root of your [Payload Config](../configuration/overview):

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      // ...
    },
    // highlight-end
  },
})
```

## Config Options

The following options are available:

| Path              | Description                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `actions`         | An array of Custom Components to be rendered _within_ the header of the Admin Panel, providing additional interactivity and functionality. [More details](#actions).     |
| `afterDashboard`  | An array of Custom Components to inject into the built-in Dashboard, _after_ the default dashboard contents. [More details](#afterdashboard).                            |
| `afterLogin`      | An array of Custom Components to inject into the built-in Login, _after_ the default login form. [More details](#afterlogin).                                            |
| `afterNavLinks`   | An array of Custom Components to inject into the built-in Nav, _after_ the links. [More details](#afternavlinks).                                                        |
| `beforeDashboard` | An array of Custom Components to inject into the built-in Dashboard, _before_ the default dashboard contents. [More details](#beforedashboard).                          |
| `beforeLogin`     | An array of Custom Components to inject into the built-in Login, _before_ the default login form. [More details](#beforelogin).                                          |
| `beforeNavLinks`  | An array of Custom Components to inject into the built-in Nav, _before_ the links themselves. [More details](#beforenavlinks).                                           |
| `graphics.Icon`   | The simplified logo used in contexts like the `Nav` component. [More details](#graphicsicon).                                                                            |
| `graphics.Logo`   | The full logo used in contexts like the `Login` view. [More details](#graphicslogo).                                                                                     |
| `header`          | An array of Custom Components to be injected above the Payload header. [More details](#header).                                                                          |
| `logout.Button`   | The button displayed in the sidebar that logs the user out. [More details](#logoutbutton).                                                                               |
| `Nav`             | Contains the sidebar / mobile menu in its entirety. [More details](#nav).                                                                                                |
| `settingsMenu`    | An array of Custom Components to inject into a popup menu accessible via a gear icon above the logout button. [More details](#settingsMenu).                             |
| `providers`       | Custom [React Context](https://react.dev/learn/scaling-up-with-reducer-and-context) providers that will wrap the entire Admin Panel. [More details](./custom-providers). |
| `views`           | Override or create new views within the Admin Panel. [More details](./custom-views).                                                                                     |

_For details on how to build Custom Components, see [Building Custom Components](./overview#building-custom-components)._

<Banner type="success">
  **Note:** You can also set [Collection
  Components](../configuration/collections#custom-components) and [Global
  Components](../configuration/globals#custom-components) in their respective
  configs.
</Banner>

## Components

### actions

Actions are rendered within the header of the Admin Panel. Actions are typically used to display buttons that add additional interactivity and functionality, although they can be anything you'd like.

To add an action, use the `actions` property in your `admin.components` config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      actions: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple Action component:

```tsx
export default function MyCustomAction() {
  return (
    <button onClick={() => alert('Hello, world!')}>
      This is a custom action component
    </button>
  )
}
```

<Banner type="success">
  **Note:** You can also use add Actions to the [Edit View](./edit-view) and
  [List View](./list-view) in their respective configs.
</Banner>

### beforeDashboard

The `beforeDashboard` property allows you to inject Custom Components into the built-in Dashboard, before the default dashboard contents.

To add `beforeDashboard` components, use the `admin.components.beforeDashboard` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      beforeDashboard: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `beforeDashboard` component:

```tsx
export default function MyBeforeDashboardComponent() {
  return <div>This is a custom component injected before the Dashboard.</div>
}
```

### afterDashboard

Similar to `beforeDashboard`, the `afterDashboard` property allows you to inject Custom Components into the built-in Dashboard, _after_ the default dashboard contents.

To add `afterDashboard` components, use the `admin.components.afterDashboard` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      afterDashboard: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `afterDashboard` component:

```tsx
export default function MyAfterDashboardComponent() {
  return <div>This is a custom component injected after the Dashboard.</div>
}
```

### beforeLogin

The `beforeLogin` property allows you to inject Custom Components into the built-in Login view, _before_ the default login form.

To add `beforeLogin` components, use the `admin.components.beforeLogin` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      beforeLogin: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `beforeLogin` component:

```tsx
export default function MyBeforeLoginComponent() {
  return <div>This is a custom component injected before the Login form.</div>
}
```

### afterLogin

Similar to `beforeLogin`, the `afterLogin` property allows you to inject Custom Components into the built-in Login view, _after_ the default login form.

To add `afterLogin` components, use the `admin.components.afterLogin` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      afterLogin: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `afterLogin` component:

```tsx
export default function MyAfterLoginComponent() {
  return <div>This is a custom component injected after the Login form.</div>
}
```

### beforeNavLinks

The `beforeNavLinks` property allows you to inject Custom Components into the built-in [Nav Component](#nav), _before_ the nav links themselves.

To add `beforeNavLinks` components, use the `admin.components.beforeNavLinks` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      beforeNavLinks: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `beforeNavLinks` component:

```tsx
export default function MyBeforeNavLinksComponent() {
  return <div>This is a custom component injected before the Nav links.</div>
}
```

### afterNavLinks

Similar to `beforeNavLinks`, the `afterNavLinks` property allows you to inject Custom Components into the built-in Nav, _after_ the nav links.

To add `afterNavLinks` components, use the `admin.components.afterNavLinks` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      afterNavLinks: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `afterNavLinks` component:

```tsx
export default function MyAfterNavLinksComponent() {
  return <p>This is a custom component injected after the Nav links.</p>
}
```

### settingsMenu

The `settingsMenu` property allows you to inject Custom Components into a popup menu accessible via a gear icon in the navigation controls, positioned above the logout button. This is ideal for adding custom actions, utilities, or settings that are relevant at the admin level.

To add `settingsMenu` components, use the `admin.components.settingsMenu` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      settingsMenu: ['/path/to/your/component#ComponentName'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `settingsMenu` component:

```tsx
'use client'
import { PopupList } from '@payloadcms/ui'

export function MySettingsMenu() {
  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={() => console.log('Action triggered')}>
        Custom Action
      </PopupList.Button>
      <PopupList.Button onClick={() => window.open('/admin/custom-page')}>
        Custom Page
      </PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

You can pass multiple components to create organized groups of menu items:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    components: {
      settingsMenu: [
        '/components/SystemActions#SystemActions',
        '/components/DataManagement#DataManagement',
      ],
    },
  },
})
```

### Nav

The `Nav` property contains the sidebar / mobile menu in its entirety. Use this property to completely replace the built-in Nav with your own custom navigation.

To add a custom nav, use the `admin.components.Nav` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      Nav: '/path/to/your/component',
    },
    // highlight-end
  },
})
```

Here is an example of a simple `Nav` component:

```tsx
import { Link } from '@payloadcms/ui'

export default function MyCustomNav() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  )
}
```

### graphics.Icon

The `Icon` property is the simplified logo used in contexts like the `Nav` component. This is typically a small, square icon that represents your brand.

To add a custom icon, use the `admin.components.graphics.Icon` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      graphics: {
        Icon: '/path/to/your/component',
      },
    },
    // highlight-end
  },
})
```

Here is an example of a simple `Icon` component:

```tsx
export default function MyCustomIcon() {
  return <img src="/path/to/your/icon.png" alt="My Custom Icon" />
}
```

### graphics.Logo

The `Logo` property is the full logo used in contexts like the `Login` view. This is typically a larger, more detailed representation of your brand.

To add a custom logo, use the `admin.components.graphics.Logo` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      graphics: {
        Logo: '/path/to/your/component',
      },
    },
    // highlight-end
  },
})
```

Here is an example of a simple `Logo` component:

```tsx
export default function MyCustomLogo() {
  return <img src="/path/to/your/logo.png" alt="My Custom Logo" />
}
```

### header

The `header` property allows you to inject Custom Components above the Payload header.

Examples of a custom header components might include an announcements banner, a notifications bar, or anything else you'd like to display at the top of the Admin Panel in a prominent location.

To add `header` components, use the `admin.components.header` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      header: ['/path/to/your/component'],
    },
    // highlight-end
  },
})
```

Here is an example of a simple `header` component:

```tsx
export default function MyCustomHeader() {
  return (
    <header>
      <h1>My Custom Header</h1>
    </header>
  )
}
```

### logout.Button

The `logout.Button` property is the button displayed in the sidebar that should log the user out when clicked.

To add a custom logout button, use the `admin.components.logout.Button` property in your Payload Config:

```ts
import { buildConfig } from 'payload'

export default buildConfig({
  // ...
  admin: {
    // highlight-start
    components: {
      logout: {
        Button: '/path/to/your/component',
      },
    },
    // highlight-end
  },
})
```

Here is an example of a simple `logout.Button` component:

```tsx
export default function MyCustomLogoutButton() {
  return <button onClick={() => alert('Logging out!')}>Log Out</button>
}
```
```

--------------------------------------------------------------------------------

---[FILE: indexes.mdx]---
Location: payload-main/docs/database/indexes.mdx

```text
---
title: Indexes
label: Indexes
order: 40
keywords: database, indexes
desc: Index fields to produce faster queries.
---

Database indexes are a way to optimize the performance of your database by allowing it to quickly locate and retrieve data. If you have a field that you frequently query or sort by, adding an index to that field can significantly improve the speed of those operations.

When your query runs, the database will not scan the entire document to find that one field, but will instead use the index to quickly locate the data.

To index a field, set the `index` option to `true` in your field's config:

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
    {
      name: 'title',
      type: 'text',
      // highlight-start
      index: true,
      // highlight-end
    },
  ],
}
```

<Banner type="info">
  **Note:** The `id`, `createdAt`, and `updatedAt` fields are indexed by
  default.
</Banner>

<Banner type="success">
  **Tip:** If you're using MongoDB, you can use [MongoDB
  Compass](https://www.mongodb.com/products/compass) to visualize and manage
  your indexes.
</Banner>

## Compound Indexes

In addition to indexing single fields, you can also create compound indexes that index multiple fields together. This can be useful for optimizing queries that filter or sort by multiple fields.

To create a compound index, use the `indexes` option in your [Collection Config](../configuration/collections):

```ts
import type { CollectionConfig } from 'payload'

export const MyCollection: CollectionConfig = {
  // ...
  fields: [
    // ...
  ],
  indexes: [
    {
      fields: ['title', 'createdAt'],
      unique: true, // Optional, if you want the combination of fields to be unique
    },
  ],
}
```

## Localized fields and MongoDB indexes

When you set `index: true` or `unique: true` on a localized field, MongoDB creates one index **per locale path** (e.g., `slug.en`, `slug.da-dk`, etc.). With many locales and indexed fields, this can quickly approach MongoDB's per-collection index limit.

If you know you'll query specifically by a locale, you can insert a custom MongoDB index for the locale path manually or with a migration script.
```

--------------------------------------------------------------------------------

````
