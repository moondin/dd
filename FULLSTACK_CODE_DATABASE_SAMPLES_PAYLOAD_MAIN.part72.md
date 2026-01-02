---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 72
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 72 of 695)

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

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/reset-password/index.module.scss

```text
.resetPassword {
  margin-bottom: var(--block-padding);
}
```

--------------------------------------------------------------------------------

---[FILE: page.tsx]---
Location: payload-main/examples/auth/src/app/(app)/reset-password/page.tsx
Signals: React, Next.js

```typescript
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '../../../payload.config'
import { Gutter } from '../_components/Gutter'
import classes from './index.module.scss'
import { ResetPasswordForm } from './ResetPasswordForm'

export default async function ResetPassword() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?message=${encodeURIComponent('Cannot reset password while logged in.')}`)
  }

  return (
    <Gutter className={classes.resetPassword}>
      <h1>Reset Password</h1>
      <p>Please enter a new password below.</p>
      <ResetPasswordForm />
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/reset-password/ResetPasswordForm/index.module.scss

```text
@import '../../_css/common';

.form {
  width: 66.66%;

  @include mid-break {
    width: 100%;
  }
}

.submit {
  margin-top: var(--base);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/reset-password/ResetPasswordForm/index.tsx
Signals: React, Next.js

```typescript
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../_components/Button'
import { Input } from '../../_components/Input'
import { Message } from '../../_components/Message'
import { useAuth } from '../../_providers/Auth'
import classes from './index.module.scss'

type FormData = {
  password: string
  token: string
}

export const ResetPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
        {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      )

      if (response.ok) {
        const json = await response.json()

        // Automatically log the user in after they successfully reset password
        await login({ email: json.user.email, password: data.password })

        // Redirect them to `/account` with success message in URL
        router.push('/account?success=Password reset successfully.')
      } else {
        setError('There was a problem while resetting your password. Please try again later.')
      }
    },
    [router, login],
  )

  // when Next.js populates token within router,
  // reset form with new token value
  useEffect(() => {
    reset({ token: token || undefined })
  }, [reset, token])

  return (
    <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
      <Message className={classes.message} error={error} />
      <Input
        error={errors.password}
        label="New Password"
        name="password"
        register={register}
        required
        type="password"
      />
      <input type="hidden" {...register('token')} />
      <Button
        appearance="primary"
        className={classes.submit}
        label="Reset Password"
        type="submit"
      />
    </form>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/_components/Button/index.module.scss

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
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.label {
  @extend %label;
  text-align: center;
  display: flex;
  align-items: center;
}

.appearance--primary {
  background-color: var(--theme-elevation-1000);
  color: var(--theme-elevation-0);
}

.appearance--secondary {
  background-color: transparent;
  box-shadow: inset 0 0 0 1px var(--theme-elevation-1000);
}

.appearance--default {
  padding: 0;
  color: var(--theme-text);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/Button/index.tsx
Signals: React, Next.js

```typescript
'use client'

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

  if (onClick || type === 'submit') {el = 'button'}

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
Location: payload-main/examples/auth/src/app/(app)/_components/Gutter/index.module.scss

```text
.gutter {
  max-width: 1920px;
  margin-left: auto;
  margin-right: auto;
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
Location: payload-main/examples/auth/src/app/(app)/_components/Gutter/index.tsx
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
Location: payload-main/examples/auth/src/app/(app)/_components/Header/index.module.scss

```text
@use '../../_css/queries.scss' as *;

.header {
  padding: var(--base) 0;
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

:global([data-theme='light']) {
  .logo {
    filter: invert(1);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/Header/index.tsx
Signals: React, Next.js

```typescript
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Gutter } from '../Gutter'
import { HeaderNav } from './Nav'
import classes from './index.module.scss'

export const Header = () => {
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
        <HeaderNav />
      </Gutter>
    </header>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/_components/Header/Nav/index.module.scss

```text
@use '../../../_css/queries.scss' as *;

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

.hide {
  opacity: 0;
  visibility: hidden;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/Header/Nav/index.tsx
Signals: React, Next.js

```typescript
'use client'

import Link from 'next/link'
import React from 'react'

import { useAuth } from '../../../_providers/Auth'
import classes from './index.module.scss'

export const HeaderNav: React.FC = () => {
  const { user } = useAuth()

  return (
    <nav
      className={[
        classes.nav,
        // fade the nav in on user load to avoid flash of content and layout shift
        // Vercel also does this in their own website header, see https://vercel.com
        user === undefined && classes.hide,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {user && (
        <React.Fragment>
          <Link href="/account">Account</Link>
          <Link href="/logout">Logout</Link>
        </React.Fragment>
      )}
      {!user && (
        <React.Fragment>
          <Link href="/login">Login</Link>
          <Link href="/create-account">Create Account</Link>
        </React.Fragment>
      )}
    </nav>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/HydrateClientUser/index.tsx
Signals: React

```typescript
'use client'

import type { Permissions } from 'payload/auth'
import type { PayloadRequest } from 'payload/types'

import { useEffect } from 'react'

import { useAuth } from '../../_providers/Auth'

export const HydrateClientUser: React.FC<{
  permissions: Permissions
  user: PayloadRequest['user']
}> = ({ permissions, user }) => {
  const { setPermissions, setUser } = useAuth()

  useEffect(() => {
    setUser(user)
    setPermissions(permissions)
  }, [user, permissions, setUser, setPermissions])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/_components/Input/index.module.scss

```text
@import '../../_css/common';

.inputWrap {
  width: 100%;
}

.input {
  width: 100%;
  font-family: system-ui;
  border-radius: 0;
  box-shadow: none;
  border: none;
  background: none;
  background-color: var(--theme-elevation-100);
  color: var(--theme-elevation-1000);
  height: calc(var(--base) * 2);
  line-height: calc(var(--base) * 2);
  padding: 0 calc(var(--base) / 2);

  &:focus {
    border: none;
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--theme-text);
    -webkit-box-shadow: 0 0 0px 1000px var(--theme-elevation-150) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
}

@media (prefers-color-scheme: dark) {
  .input {
    background-color: var(--theme-elevation-150);
  }
}

.error {
  background-color: var(--theme-error-150);
}

.label {
  margin-bottom: 0;
  display: block;
  line-height: 1;
  margin-bottom: calc(var(--base) / 2);
}

.errorMessage {
  font-size: small;
  line-height: 1.25;
  margin-top: 4px;
  color: red;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/Input/index.tsx
Signals: React

```typescript
import type { FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import classes from './index.module.scss'

type Props = {
  error: any
  label: string
  name: string
  register: UseFormRegister<any & FieldValues> // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
  required?: boolean
  type?: 'email' | 'number' | 'password' | 'text'
  validate?: (value: string) => boolean | string
}

export const Input: React.FC<Props> = ({
  name,
  type = 'text',
  error,
  label,
  register,
  required,
  validate,
}) => {
  return (
    <div className={classes.inputWrap}>
      <label className={classes.label} htmlFor="name">
        {`${label} ${required ? '*' : ''}`}
      </label>
      <input
        className={[classes.input, error && classes.error].filter(Boolean).join(' ')}
        {...{ type }}
        {...register(name, {
          required,
          validate,
          ...(type === 'email'
            ? {
                pattern: {
                  message: 'Please enter a valid email',
                  value: /\S[^\s@]*@\S+\.\S+/,
                },
              }
            : {}),
        })}
      />
      {error && (
        <div className={classes.errorMessage}>
          {!error?.message && error?.type === 'required'
            ? 'This field is required'
            : error?.message}
        </div>
      )}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/_components/Message/index.module.scss

```text
@import '../../_css/common';

.message {
  padding: calc(var(--base) / 2) calc(var(--base) / 2);
  line-height: 1.25;
  width: 100%;
}

.default {
  background-color: var(--theme-elevation-100);
  color: var(--theme-elevation-1000);
}

.warning {
  background-color: var(--theme-warning-500);
  color: var(--theme-warning-900);
}

.error {
  background-color: var(--theme-error-500);
  color: var(--theme-error-900);
}

.success {
  background-color: var(--theme-success-500);
  color: var(--theme-success-900);
}

@media (prefers-color-scheme: dark) {
  .default {
    background-color: var(--theme-elevation-900);
    color: var(--theme-elevation-100);
  }

  .warning {
    color: var(--theme-warning-100);
  }

  .error {
    color: var(--theme-error-100);
  }

  .success {
    color: var(--theme-success-100);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/Message/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

export const Message: React.FC<{
  className?: string
  error?: React.ReactNode
  message?: React.ReactNode
  success?: React.ReactNode
  warning?: React.ReactNode
}> = ({ className, error, message, success, warning }) => {
  const messageToRender = message || error || success || warning

  if (messageToRender) {
    return (
      <div
        className={[
          classes.message,
          className,
          error && classes.error,
          success && classes.success,
          warning && classes.warning,
          !error && !success && !warning && classes.default,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {messageToRender}
      </div>
    )
  }
  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/auth/src/app/(app)/_components/RenderParams/index.tsx
Signals: React, Next.js

```typescript
'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { Message } from '../Message'

export const RenderParams: React.FC<{
  className?: string
  message?: string
  params?: string[]
}> = ({ className, message, params = ['error', 'message', 'success'] }) => {
  const searchParams = useSearchParams()
  const paramValues = params.map((param) => searchParams.get(param)).filter(Boolean)

  if (paramValues.length) {
    return (
      <div className={className}>
        {paramValues.map((paramValue) => (
          <Message
            key={paramValue}
            message={(message || 'PARAM')?.replace('PARAM', paramValue || '')}
          />
        ))}
      </div>
    )
  }

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/auth/src/app/(app)/_components/RichText/index.module.scss

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
Location: payload-main/examples/auth/src/app/(app)/_components/RichText/index.tsx
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
Location: payload-main/examples/auth/src/app/(app)/_components/RichText/serialize.tsx
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
      case 'blockquote':
        return <blockquote key={i}>{serialize(node.children)}</blockquote>
      case 'ul':
        return <ul key={i}>{serialize(node.children)}</ul>
      case 'ol':
        return <ol key={i}>{serialize(node.children)}</ol>
      case 'li':
        return <li key={i}>{serialize(node.children)}</li>
      case 'link':
        return (
          <a href={escapeHTML(node.url)} key={i}>
            {serialize(node.children)}
          </a>
        )

      default:
        return <p key={i}>{serialize(node.children)}</p>
    }
  })

export default serialize
```

--------------------------------------------------------------------------------

---[FILE: app.scss]---
Location: payload-main/examples/auth/src/app/(app)/_css/app.scss

```text
@use './queries.scss' as *;
@use './colors.scss' as *;
@use './type.scss' as *;
@import './theme.scss';

:root {
  --base: 24px;
  --font-body: system-ui;
  --font-mono: 'Roboto Mono', monospace;

  --gutter-h: 180px;
  --block-padding: 120px;

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
  background: var(--theme-bg);
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
  background: var(--theme-success-500);
  color: var(--color-base-800);
}

::-moz-selection {
  background: var(--theme-success-500);
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
Location: payload-main/examples/auth/src/app/(app)/_css/colors.scss

```text
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
Location: payload-main/examples/auth/src/app/(app)/_css/common.scss

```text
@forward './queries.scss';
```

--------------------------------------------------------------------------------

---[FILE: queries.scss]---
Location: payload-main/examples/auth/src/app/(app)/_css/queries.scss

```text
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

---[FILE: theme.scss]---
Location: payload-main/examples/auth/src/app/(app)/_css/theme.scss

```text
@media (prefers-color-scheme: light) {
  :root {
    --theme-success-50: var(--color-success-50);
    --theme-success-100: var(--color-success-100);
    --theme-success-150: var(--color-success-150);
    --theme-success-200: var(--color-success-200);
    --theme-success-250: var(--color-success-250);
    --theme-success-300: var(--color-success-300);
    --theme-success-350: var(--color-success-350);
    --theme-success-400: var(--color-success-400);
    --theme-success-450: var(--color-success-450);
    --theme-success-500: var(--color-success-500);
    --theme-success-550: var(--color-success-550);
    --theme-success-600: var(--color-success-600);
    --theme-success-650: var(--color-success-650);
    --theme-success-700: var(--color-success-700);
    --theme-success-750: var(--color-success-750);
    --theme-success-800: var(--color-success-800);
    --theme-success-850: var(--color-success-850);
    --theme-success-900: var(--color-success-900);
    --theme-success-950: var(--color-success-950);

    --theme-warning-50: var(--color-warning-50);
    --theme-warning-100: var(--color-warning-100);
    --theme-warning-150: var(--color-warning-150);
    --theme-warning-200: var(--color-warning-200);
    --theme-warning-250: var(--color-warning-250);
    --theme-warning-300: var(--color-warning-300);
    --theme-warning-350: var(--color-warning-350);
    --theme-warning-400: var(--color-warning-400);
    --theme-warning-450: var(--color-warning-450);
    --theme-warning-500: var(--color-warning-500);
    --theme-warning-550: var(--color-warning-550);
    --theme-warning-600: var(--color-warning-600);
    --theme-warning-650: var(--color-warning-650);
    --theme-warning-700: var(--color-warning-700);
    --theme-warning-750: var(--color-warning-750);
    --theme-warning-800: var(--color-warning-800);
    --theme-warning-850: var(--color-warning-850);
    --theme-warning-900: var(--color-warning-900);
    --theme-warning-950: var(--color-warning-950);

    --theme-error-50: var(--color-error-50);
    --theme-error-100: var(--color-error-100);
    --theme-error-150: var(--color-error-150);
    --theme-error-200: var(--color-error-200);
    --theme-error-250: var(--color-error-250);
    --theme-error-300: var(--color-error-300);
    --theme-error-350: var(--color-error-350);
    --theme-error-400: var(--color-error-400);
    --theme-error-450: var(--color-error-450);
    --theme-error-500: var(--color-error-500);
    --theme-error-550: var(--color-error-550);
    --theme-error-600: var(--color-error-600);
    --theme-error-650: var(--color-error-650);
    --theme-error-700: var(--color-error-700);
    --theme-error-750: var(--color-error-750);
    --theme-error-800: var(--color-error-800);
    --theme-error-850: var(--color-error-850);
    --theme-error-900: var(--color-error-900);
    --theme-error-950: var(--color-error-950);

    --theme-elevation-0: var(--color-base-0);
    --theme-elevation-50: var(--color-base-50);
    --theme-elevation-100: var(--color-base-100);
    --theme-elevation-150: var(--color-base-150);
    --theme-elevation-200: var(--color-base-200);
    --theme-elevation-250: var(--color-base-250);
    --theme-elevation-300: var(--color-base-300);
    --theme-elevation-350: var(--color-base-350);
    --theme-elevation-400: var(--color-base-400);
    --theme-elevation-450: var(--color-base-450);
    --theme-elevation-500: var(--color-base-500);
    --theme-elevation-550: var(--color-base-550);
    --theme-elevation-600: var(--color-base-600);
    --theme-elevation-650: var(--color-base-650);
    --theme-elevation-700: var(--color-base-700);
    --theme-elevation-750: var(--color-base-750);
    --theme-elevation-800: var(--color-base-800);
    --theme-elevation-850: var(--color-base-850);
    --theme-elevation-900: var(--color-base-900);
    --theme-elevation-950: var(--color-base-950);
    --theme-elevation-1000: var(--color-base-1000);

    --theme-bg: var(--theme-elevation-0);
    --theme-input-bg: var(--theme-elevation-50);
    --theme-text: var(--theme-elevation-750);
    --theme-border-color: var(--theme-elevation-150);

    color-scheme: light;
    color: var(--theme-text);

    --highlight-default-bg-color: var(--theme-success-400);
    --highlight-default-text-color: var(--theme-text);

    --highlight-danger-bg-color: var(--theme-error-150);
    --highlight-danger-text-color: var(--theme-text);
  }

  h1 a,
  h2 a,
  h3 a,
  h4 a,
  h5 a,
  h6 a {
    color: var(--theme-elevation-750);

    &:hover {
      color: var(--theme-elevation-800);
    }

    &:visited {
      color: var(--theme-elevation-750);

      &:hover {
        color: var(--theme-elevation-800);
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --theme-elevation-0: var(--color-base-1000);
    --theme-elevation-50: var(--color-base-950);
    --theme-elevation-100: var(--color-base-900);
    --theme-elevation-150: var(--color-base-850);
    --theme-elevation-200: var(--color-base-800);
    --theme-elevation-250: var(--color-base-750);
    --theme-elevation-300: var(--color-base-700);
    --theme-elevation-350: var(--color-base-650);
    --theme-elevation-400: var(--color-base-600);
    --theme-elevation-450: var(--color-base-550);
    --theme-elevation-500: var(--color-base-500);
    --theme-elevation-550: var(--color-base-450);
    --theme-elevation-600: var(--color-base-400);
    --theme-elevation-650: var(--color-base-350);
    --theme-elevation-700: var(--color-base-300);
    --theme-elevation-750: var(--color-base-250);
    --theme-elevation-800: var(--color-base-200);
    --theme-elevation-850: var(--color-base-150);
    --theme-elevation-900: var(--color-base-100);
    --theme-elevation-950: var(--color-base-50);
    --theme-elevation-1000: var(--color-base-0);

    --theme-success-50: var(--color-success-950);
    --theme-success-100: var(--color-success-900);
    --theme-success-150: var(--color-success-850);
    --theme-success-200: var(--color-success-800);
    --theme-success-250: var(--color-success-750);
    --theme-success-300: var(--color-success-700);
    --theme-success-350: var(--color-success-650);
    --theme-success-400: var(--color-success-600);
    --theme-success-450: var(--color-success-550);
    --theme-success-500: var(--color-success-500);
    --theme-success-550: var(--color-success-450);
    --theme-success-600: var(--color-success-400);
    --theme-success-650: var(--color-success-350);
    --theme-success-700: var(--color-success-300);
    --theme-success-750: var(--color-success-250);
    --theme-success-800: var(--color-success-200);
    --theme-success-850: var(--color-success-150);
    --theme-success-900: var(--color-success-100);
    --theme-success-950: var(--color-success-50);

    --theme-warning-50: var(--color-warning-950);
    --theme-warning-100: var(--color-warning-900);
    --theme-warning-150: var(--color-warning-850);
    --theme-warning-200: var(--color-warning-800);
    --theme-warning-250: var(--color-warning-750);
    --theme-warning-300: var(--color-warning-700);
    --theme-warning-350: var(--color-warning-650);
    --theme-warning-400: var(--color-warning-600);
    --theme-warning-450: var(--color-warning-550);
    --theme-warning-500: var(--color-warning-500);
    --theme-warning-550: var(--color-warning-450);
    --theme-warning-600: var(--color-warning-400);
    --theme-warning-650: var(--color-warning-350);
    --theme-warning-700: var(--color-warning-300);
    --theme-warning-750: var(--color-warning-250);
    --theme-warning-800: var(--color-warning-200);
    --theme-warning-850: var(--color-warning-150);
    --theme-warning-900: var(--color-warning-100);
    --theme-warning-950: var(--color-warning-50);

    --theme-error-50: var(--color-error-950);
    --theme-error-100: var(--color-error-900);
    --theme-error-150: var(--color-error-850);
    --theme-error-200: var(--color-error-800);
    --theme-error-250: var(--color-error-750);
    --theme-error-300: var(--color-error-700);
    --theme-error-350: var(--color-error-650);
    --theme-error-400: var(--color-error-600);
    --theme-error-450: var(--color-error-550);
    --theme-error-500: var(--color-error-500);
    --theme-error-550: var(--color-error-450);
    --theme-error-600: var(--color-error-400);
    --theme-error-650: var(--color-error-350);
    --theme-error-700: var(--color-error-300);
    --theme-error-750: var(--color-error-250);
    --theme-error-800: var(--color-error-200);
    --theme-error-850: var(--color-error-150);
    --theme-error-900: var(--color-error-100);
    --theme-error-950: var(--color-error-50);

    --theme-bg: var(--theme-elevation-100);
    --theme-text: var(--theme-elevation-900);
    --theme-input-bg: var(--theme-elevation-150);
    --theme-border-color: var(--theme-elevation-250);

    color-scheme: dark;
    color: var(--theme-text);

    --highlight-default-bg-color: var(--theme-success-100);
    --highlight-default-text-color: var(--theme-success-600);

    --highlight-danger-bg-color: var(--theme-error-100);
    --highlight-danger-text-color: var(--theme-error-550);
  }

  h1 a,
  h2 a,
  h3 a,
  h4 a,
  h5 a,
  h6 a {
    color: var(--theme-success-600);

    &:hover {
      color: var(--theme-success-400);
    }

    &:visited {
      color: var(--theme-success-700);

      &:hover {
        color: var(--theme-success-500);
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: type.scss]---
Location: payload-main/examples/auth/src/app/(app)/_css/type.scss

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

---[FILE: gql.ts]---
Location: payload-main/examples/auth/src/app/(app)/_providers/Auth/gql.ts

```typescript
export const USER = `
  id
  email
  firstName
  lastName
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gql = async (query: string): Promise<any> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
      body: JSON.stringify({
        query,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { data, errors } = await res.json()

    if (errors) {
      throw new Error(errors[0].message)
    }

    if (res.ok && data) {
      return data
    }
  } catch (e: unknown) {
    throw new Error(e as string)
  }
}
```

--------------------------------------------------------------------------------

````
