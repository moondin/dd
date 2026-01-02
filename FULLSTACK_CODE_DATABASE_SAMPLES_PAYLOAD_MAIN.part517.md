---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 517
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 517 of 695)

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
Location: payload-main/test/admin/components/ListMenuItems/index.tsx

```typescript
'use client'

import { PopupList } from '@payloadcms/ui'

import { Banner } from '../Banner/index.js'

export const ListMenuItemsExample = () => {
  return (
    <>
      <PopupList.ButtonGroup>
        <Banner message="listMenuItems" />
        <Banner message="Many of them" />
        <Banner message="Ok last one" />
      </PopupList.ButtonGroup>
    </>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/Logout/index.tsx
Signals: React

```typescript
'use client'

import { LogOutIcon, useConfig } from '@payloadcms/ui'
import React from 'react'

export const Logout: React.FC = () => {
  const {
    config: {
      admin: {
        routes: { logout: logoutRoute },
      },
      routes: { admin },
    },
  } = useConfig()

  return (
    <a href={`${admin}${logoutRoute}#custom`}>
      <LogOutIcon />
    </a>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/ResetColumns/index.tsx

```typescript
'use client'

import { Pill, useTableColumns } from '@payloadcms/ui'

function ResetDefaultColumnsButton() {
  const { resetColumnsState } = useTableColumns()

  return (
    <Pill id="reset-columns-button" onClick={resetColumnsState}>
      Reset to default columns
    </Pill>
  )
}

export { ResetDefaultColumnsButton }
```

--------------------------------------------------------------------------------

---[FILE: Item1.tsx]---
Location: payload-main/test/admin/components/SettingsMenuItems/Item1.tsx
Signals: React

```typescript
'use client'

import { PopupList } from '@payloadcms/ui'
import React from 'react'

export const SettingsMenuItem1 = () => {
  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={() => alert('System Settings')}>System Settings</PopupList.Button>
      <PopupList.Button onClick={() => alert('View Logs')}>View Logs</PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: Item2.tsx]---
Location: payload-main/test/admin/components/SettingsMenuItems/Item2.tsx
Signals: React

```typescript
'use client'

import { PopupList } from '@payloadcms/ui'
import React from 'react'

export const SettingsMenuItem2 = () => {
  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={() => alert('Manage Users')}>Manage Users</PopupList.Button>
      <PopupList.Button onClick={() => alert('View Activity')}>View Activity</PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/admin/components/ViewDescription/index.scss

```text
.view-description {
  margin-bottom: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/ViewDescription/index.tsx
Signals: React

```typescript
'use client'

import type { ViewDescriptionClientProps } from 'payload'

import { ViewDescription as DefaultViewDescription } from '@payloadcms/ui'
import React from 'react'

import { Banner } from '../Banner/index.js'
import './index.scss'

const baseClass = 'view-description'

export function ViewDescription({
  description = 'This is a custom view description component.',
}: ViewDescriptionClientProps) {
  return (
    <Banner className={baseClass}>
      <DefaultViewDescription description={description} />
    </Banner>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomAccount/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import React, { Fragment } from 'react'

export function CustomAccountView(props: AdminViewServerProps) {
  return (
    <Fragment>
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Account View</h1>
        <p>This custom view was added through the Payload config:</p>
        <ul>
          <li>
            <code>components.views.Account</code>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomDashboard/index.tsx
Signals: React

```typescript
import type { AdminViewServerProps } from 'payload'

import React, { Fragment } from 'react'

export function CustomDashboardView(props: AdminViewServerProps) {
  return (
    <Fragment>
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Dashboard View</h1>
        <p>This custom view was added through the Payload config:</p>
        <ul>
          <li>
            <code>components.views.Dashboard</code>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/admin/components/views/CustomDefault/index.scss

```text
@import '~@payloadcms/ui/scss';

.custom-default-view {
  &__login-btn {
    margin-right: base(0.5);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: base(1);
    color: var(--color-success-350);

    & > * {
      margin: 0;
    }
  }

  &__controls {
    display: flex;
    gap: calc(var(--base) / 2);

    & > * {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomDefault/index.tsx
Signals: React, Next.js

```typescript
import { DefaultTemplate } from '@payloadcms/next/templates'
import LinkImport from 'next/link.js'
import { redirect } from 'next/navigation.js'
import React from 'react'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

import type { AdminViewServerProps } from 'payload'

import { Button, SetStepNav } from '@payloadcms/ui'

import { customViewPath } from '../../../shared.js'
import './index.scss'

const baseClass = 'custom-default-view'

export function CustomDefaultView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const {
    permissions,
    req: {
      payload,
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
      user,
    },
    visibleEntities,
  } = initPageResult

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !permissions?.canAccessAdmin)) {
    return redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      <SetStepNav
        nav={[
          {
            label: 'Custom Admin View with Default Template',
          },
        ]}
      />
      <div
        className={`${baseClass}__content`}
        style={{
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Admin View</h1>
        <p>
          Here is a custom admin view that was added in the Payload config. It uses the Default
          Template, so the sidebar is rendered.
        </p>
        <div className="custom-view__controls">
          <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
            Go to Dashboard
          </Button>
          &nbsp; &nbsp; &nbsp;
          <Button
            buttonStyle="secondary"
            el="link"
            Link={Link}
            to={`${adminRoute}/${customViewPath}`}
          >
            Go to Custom View
          </Button>
        </div>
      </div>
    </DefaultTemplate>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomEdit/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound, redirect } from 'next/navigation.js'
import React, { Fragment } from 'react'

export function CustomEditView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  const {
    permissions: { canAccessAdmin },
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
      user,
    },
  } = initPageResult

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    return redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Edit View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Edit View</h1>
        <p>This custom edit view was added through the following Payload config:</p>
        <code>components.views.edit</code>
        <p>
          {'This takes precedence over the default edit view, '}
          <b>as well as all nested views like versions.</b>
          {' The document header will be completely overridden.'}
        </p>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomEditDefault/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound, redirect } from 'next/navigation.js'
import React, { Fragment } from 'react'

export function CustomDefaultEditView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  const {
    permissions: { canAccessAdmin },
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
      user,
    },
  } = initPageResult

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    return redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Default View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Default View</h1>
        <p>This custom Default view was added through one of the following Payload configs:</p>
        <ul>
          <li>
            <code>components.views.edit.default</code>
            <p>
              {'This allows you to override only the default edit view specifically, but '}
              <b>
                <em>not</em>
              </b>
              {
                ' any nested views like versions, etc. The document header will render above this component.'
              }
            </p>
          </li>
          <li>
            <code>components.views.edit.default.Component</code>
            <p>
              This is the most granular override, allowing you to override only the Default
              component, or any of its other properties like path and label.
            </p>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/test/admin/components/views/CustomMinimal/index.scss

```text
@import '~@payloadcms/ui/scss';

.custom-minimal-view {
  &__login-btn {
    margin-right: base(0.5);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: base(1);

    & > * {
      margin: 0;
    }
  }

  &__controls {
    display: flex;
    gap: calc(var(--base) / 2);

    & > * {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomMinimal/index.tsx
Signals: React, Next.js

```typescript
import LinkImport from 'next/link.js'
import React from 'react'

// As this is the demo project, we import our dependencies from the `src` directory.

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

// In your projects, you can import as follows:
// import { MinimalTemplate } from 'payload/components/templates';
// import { Button } from 'payload/components/elements';
// import { useConfig } from 'payload/components/utilities';

import type { AdminViewServerProps } from 'payload'

import { MinimalTemplate } from '@payloadcms/next/templates'
import { Button } from '@payloadcms/ui'

import { customViewPath } from '../../../shared.js'
import './index.scss'

const baseClass = 'custom-minimal-view'

export function CustomMinimalView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return (
    <MinimalTemplate className={baseClass}>
      <div className={`${baseClass}__content`}>
        <h1>Custom Admin View</h1>
        <p>Here is a custom admin view that was added in the Payload config.</p>
        <div className={`${baseClass}__controls`}>
          <div className="custom-view__controls">
            <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
              Go to Dashboard
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              buttonStyle="secondary"
              el="link"
              Link={Link}
              to={`${adminRoute}/${customViewPath}`}
            >
              Go to Custom View
            </Button>
          </div>
        </div>
      </div>
    </MinimalTemplate>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomProtectedView/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps } from 'payload'

import { Button } from '@payloadcms/ui'
import LinkImport from 'next/link.js'
import { notFound, redirect } from 'next/navigation.js'
import React from 'react'

import { customNestedViewTitle, customViewPath } from '../../../shared.js'
import { settingsGlobalSlug } from '../../../slugs.js'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

export async function CustomProtectedView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
      user,
    },
    req,
  } = initPageResult

  const settings = await req.payload.findGlobal({
    slug: settingsGlobalSlug,
  })

  if (!settings?.canAccessProtected) {
    if (user) {
      redirect(`${adminRoute}/unauthorized`)
    } else {
      notFound()
    }
  }

  return (
    <div
      style={{
        marginTop: 'calc(var(--base) * 2)',
        paddingLeft: 'var(--gutter-h)',
        paddingRight: 'var(--gutter-h)',
      }}
    >
      <h1 id="custom-view-title">{customNestedViewTitle}</h1>
      <p>This custom view was added through the Payload config:</p>
      <ul>
        <li>
          <code>components.views[key].Component</code>
        </li>
      </ul>
      <div className="custom-view__controls">
        <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
          Go to Dashboard
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button
          buttonStyle="secondary"
          el="link"
          Link={Link}
          to={`${adminRoute}/${customViewPath}`}
        >
          Go to Custom View
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomTabComponent/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import { customTabViewComponentTitle } from '../../../shared.js'

export function CustomTabComponentView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Tab View 2',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1 id="custom-view-title">{customTabViewComponentTitle}</h1>
        <p>This custom view was added through the Payload config:</p>
        <ul>
          <li>
            <code>components.views[key].Component</code>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomTabLabel/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import { customTabLabelViewTitle } from '../../../shared.js'

export function CustomTabLabelView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Tab View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1 id="custom-view-title">{customTabLabelViewTitle}</h1>
        <p>This custom view was added through the Payload config:</p>
        <ul>
          <li>
            <code>components.views[key].Component</code>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomTabNested/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound } from 'next/navigation.js'
import React, { Fragment } from 'react'

import { customNestedTabViewTitle } from '../../../shared.js'

export function CustomNestedTabView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Nested View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1 id="custom-view-title">{customNestedTabViewTitle}</h1>
        <p>This custom view was added through the Payload config:</p>
        <ul>
          <li>
            <code>components.views[key].Component</code>
          </li>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomTabWithParam/index.tsx
Signals: React

```typescript
import type { DocumentViewServerProps } from 'payload'

import React from 'react'

import { customParamViewTitle } from '../../../shared.js'

export function CustomTabWithParamView({ params }: DocumentViewServerProps) {
  const paramValue = params?.segments?.[4]

  return (
    <div
      style={{
        marginTop: 'calc(var(--base) * 2)',
        paddingLeft: 'var(--gutter-h)',
        paddingRight: 'var(--gutter-h)',
      }}
    >
      <h1 id="custom-view-title">{customParamViewTitle}</h1>
      <p>
        This custom collection view is using a dynamic URL parameter `slug: {paramValue || 'None'}`
      </p>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomVersions/index.tsx
Signals: React, Next.js

```typescript
import type { DocumentViewServerProps } from 'payload'

import { SetStepNav } from '@payloadcms/ui'
import { notFound, redirect } from 'next/navigation.js'
import React, { Fragment } from 'react'

export function CustomVersionsView({ initPageResult }: DocumentViewServerProps) {
  if (!initPageResult) {
    notFound()
  }

  const {
    permissions: { canAccessAdmin },
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
      user,
    },
  } = initPageResult

  // If an unauthorized user tries to navigate straight to this page,
  // Boot 'em out
  if (!user || (user && !canAccessAdmin)) {
    return redirect(`${adminRoute}/unauthorized`)
  }

  return (
    <Fragment>
      <SetStepNav
        nav={[
          {
            label: 'Custom Versions View',
          },
        ]}
      />
      <div
        style={{
          marginTop: 'calc(var(--base) * 2)',
          paddingLeft: 'var(--gutter-h)',
          paddingRight: 'var(--gutter-h)',
        }}
      >
        <h1>Custom Versions View</h1>
        <p>This custom Versions view was added through one of the following Payload configs:</p>
        <ul>
          <li>
            <code>components.views.edit.Versions</code>
            <p>
              {'This allows you to override only the Versions edit view specifically, but '}
              <b>
                <em>not</em>
              </b>
              {' any other views. The document header will render above this component.'}
            </p>
          </li>
          <li>
            <code>components.views.edit.versions.Component</code>
          </li>
          <p>
            This is the most granular override, allowing you to override only the Versions
            component, or any of its other properties like path and label.
          </p>
        </ul>
      </div>
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.client.tsx]---
Location: payload-main/test/admin/components/views/CustomView/index.client.tsx
Signals: React

```typescript
'use client'

import {
  ConfirmPasswordField,
  Form,
  FormSubmit,
  PasswordField,
  useFormFields,
} from '@payloadcms/ui'
import React from 'react'

export const ClientForm: React.FC = () => {
  return (
    <Form
      initialState={{
        'confirm-password': {
          initialValue: '',
          valid: false,
          value: '',
        },
        password: {
          initialValue: '',
          valid: false,
          value: '',
        },
      }}
    >
      <CustomPassword />
      <ConfirmPasswordField />
      <FormSubmit>Submit</FormSubmit>
    </Form>
  )
}

const CustomPassword: React.FC = () => {
  const confirmPassword = useFormFields(
    ([fields]) => (fields && fields?.['confirm-password']) || null,
  )

  const confirmValue = confirmPassword.value

  return (
    <PasswordField
      autoComplete="off"
      field={{
        name: 'password',
        label: 'Password',
        required: true,
      }}
      path="password"
      validate={(value) => {
        if (value && confirmValue) {
          return confirmValue === value ? true : 'Passwords must match!!!!'
        }

        return 'Field is required'
      }}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomView/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps } from 'payload'

import LinkImport from 'next/link.js'
import React from 'react'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

import { Button } from '@payloadcms/ui'

import { customNestedViewPath, customViewTitle } from '../../../shared.js'
import { ClientForm } from './index.client.js'

export function CustomView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return (
    <div
      style={{
        marginTop: 'calc(var(--base) * 2)',
        paddingLeft: 'var(--gutter-h)',
        paddingRight: 'var(--gutter-h)',
      }}
    >
      <h1 id="custom-view-title">{customViewTitle}</h1>
      <p>This custom view was added through the Payload config:</p>
      <ul>
        <li>
          <code>components.views[key].Component</code>
        </li>
      </ul>
      <div className="custom-view__controls">
        <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
          Go to Dashboard
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button
          buttonStyle="secondary"
          el="link"
          Link={Link}
          to={`${adminRoute}/${customNestedViewPath}`}
        >
          Go to Nested View
        </Button>
        <ClientForm />
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomViewNested/index.tsx
Signals: React, Next.js

```typescript
import type { AdminViewServerProps } from 'payload'

import { Button } from '@payloadcms/ui'
import LinkImport from 'next/link.js'
import React from 'react'

import { customNestedViewTitle, customViewPath } from '../../../shared.js'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

export function CustomNestedView({ initPageResult }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  return (
    <div
      style={{
        marginTop: 'calc(var(--base) * 2)',
        paddingLeft: 'var(--gutter-h)',
        paddingRight: 'var(--gutter-h)',
      }}
    >
      <h1 id="custom-view-title">{customNestedViewTitle}</h1>
      <p>This custom view was added through the Payload config:</p>
      <ul>
        <li>
          <code>components.views[key].Component</code>
        </li>
      </ul>
      <div className="custom-view__controls">
        <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
          Go to Dashboard
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button
          buttonStyle="secondary"
          el="link"
          Link={Link}
          to={`${adminRoute}/${customViewPath}`}
        >
          Go to Custom View
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/test/admin/components/views/CustomViewWithParam/index.tsx
Signals: React, Next.js

```typescript
import { Button } from '@payloadcms/ui'
import LinkImport from 'next/link.js'
import React from 'react'

const Link = 'default' in LinkImport ? LinkImport.default : LinkImport

import type { AdminViewServerProps } from 'payload'

import {
  customParamViewPath,
  customParamViewPathBase,
  customParamViewTitle,
} from '../../../shared.js'

export function CustomViewWithParam({ initPageResult, params }: AdminViewServerProps) {
  const {
    req: {
      payload: {
        config: {
          routes: { admin: adminRoute },
        },
      },
    },
  } = initPageResult

  const paramValue = params?.segments?.[1]

  return (
    <div
      style={{
        marginTop: 'calc(var(--base) * 2)',
        paddingLeft: 'var(--gutter-h)',
        paddingRight: 'var(--gutter-h)',
      }}
    >
      <h1 id="custom-view-title">{customParamViewTitle}</h1>
      <p>This custom view is using a dynamic URL parameter `ID: {paramValue || 'None'}`</p>
      <p>
        This custom view is not `exact` true, so it matches on `{customParamViewPathBase}` we well
        as `{customParamViewPath}`
      </p>
      <div className="custom-view__controls">
        <Button buttonStyle="secondary" el="link" Link={Link} to={`${adminRoute}`}>
          Go to Dashboard
        </Button>
        &nbsp; &nbsp; &nbsp;
        <Button
          buttonStyle="secondary"
          el="link"
          Link={Link}
          to={`${adminRoute}/${customParamViewPathBase}${!paramValue ? '/123' : ''}`}
        >
          {`Go To ${paramValue ? 'Child' : 'Parent'} Param View`}
        </Button>
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

````
