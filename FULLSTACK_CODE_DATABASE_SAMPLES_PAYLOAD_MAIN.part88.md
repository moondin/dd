---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 88
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 88 of 695)

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

---[FILE: options.ts]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/State/options.ts

```typescript
export const stateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
]
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Text/index.module.scss

```text
@use '../shared.scss';

.wrap {
  position: relative;
  margin-bottom: var(--base);
}

.input {
  @include shared.formInput;
}

.label {
  margin-bottom: 10px;
  display: block;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Text/index.tsx
Signals: React

```typescript
import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Text: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<any & FieldValues>
  } & TextField
> = ({ name, errors, label, register, required: requiredFromProps, width }) => {
  return (
    <Width width={width}>
      <div className={classes.wrap}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <input
          className={classes.input}
          id={name}
          type="text"
          {...register(name, { required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Textarea/index.module.scss

```text
@use '../shared.scss';

.wrap {
  position: relative;
  margin-bottom: var(--base);
}

.textarea {
  @include shared.formInput;
  height: unset;
}

.label {
  margin-bottom: 10px;
  display: block;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Textarea/index.tsx
Signals: React

```typescript
import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Textarea: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<any & FieldValues>
    rows?: number
  } & TextField
> = ({ name, errors, label, register, required: requiredFromProps, rows = 3, width }) => {
  return (
    <Width width={width}>
      <div className={classes.wrap}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <textarea
          className={classes.textarea}
          id={name}
          rows={rows}
          {...register(name, { required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Width/index.module.scss

```text
@use '../../../../css/queries.scss' as *;

.width {
  padding-left: calc(var(--base) * 0.5);
  padding-right: calc(var(--base) * 0.5);

  @include mid-break {
    width: 100% !important;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Width/index.tsx
Signals: React

```typescript
import * as React from 'react'

import classes from './index.module.scss'

export const Width: React.FC<{
  children: React.ReactNode
  width?: number
}> = ({ children, width }) => {
  return (
    <div className={classes.width} style={{ width: width ? `${width}%` : undefined }}>
      {children}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Button/index.module.scss

```text
@import '../../css/type.scss';

.content {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    margin-right: calc(var(--base) / 2);
    width: var(--base);
    height: var(--base);
  }
}

.label {
  @extend %label;
  display: flex;
  align-items: center;
}

.button {
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: inline-flex;
  position: relative;
  text-decoration: none;
  padding: 12px 18px;
  margin-bottom: var(--base);
  align-items: center;
  justify-content: center;
}

.appearance--primary {
  background-color: var(--color-black);
  color: var(--color-white);

  &:hover,
  &:focus {
    background-color: var(--color-white);
    color: var(--color-black);
    box-shadow: inset 0 0 0 1px var(--color-black);
  }
}

.appearance--secondary {
  background-color: var(--color-white);
  box-shadow: inset 0 0 0 1px var(--color-black);

  &:hover,
  &:focus {
    background-color: var(--color-black);
    color: var(--color-white);
    box-shadow: inset 0 0 0 1px var(--color-black);
  }
}

.appearance--default {
  padding: 0;
  margin-left: -8px;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Button/index.tsx
Signals: React, Next.js

```typescript
import type { ElementType } from 'react'

import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  appearance?: 'default' | 'primary' | 'secondary'
  className?: string
  el?: 'a' | 'button' | 'link'
  form?: string
  href?: string
  label?: string
  newTab?: boolean | null
  onClick?: () => void
}

const elements = {
  a: 'a',
  button: 'button',
  link: Link,
}

export const Button: React.FC<Props> = ({
  appearance,
  className: classNameFromProps,
  el = 'button',
  form,
  href,
  label,
  newTab,
}) => {
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const Element: ElementType = el
  const className = [classNameFromProps, classes[`appearance--${appearance}`], classes.button]
    .filter(Boolean)
    .join(' ')

  const elementProps = {
    ...newTabProps,
    className,
    form,
    href,
  }

  const content = (
    <div className={classes.content}>
      <span className={classes.label}>{label}</span>
    </div>
  )

  return (
    <Element {...elementProps}>
      <React.Fragment>
        {el === 'link' && (
          <Link {...newTabProps} className={elementProps.className} href={href || ''}>
            {content}
          </Link>
        )}
        {el !== 'link' && <React.Fragment>{content}</React.Fragment>}
      </React.Fragment>
    </Element>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/CloseModalOnRouteChange/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type React from 'react'

import { useModal } from '@faceless-ui/modal'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export const CloseModalOnRouteChange: React.FC = () => {
  const { closeAllModals } = useModal()
  const pathname = usePathname()

  useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  return null
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Gutter/index.module.scss

```text
.gutterLeft {
  padding-left: var(--gutter-h);
}

.gutterRight {
  padding-right: var(--gutter-h);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Gutter/index.tsx
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
      className={[left && classes.gutterLeft, right && classes.gutterRight, className]
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
Location: payload-main/examples/form-builder/src/components/Header/index.module.scss

```text
@use '../../css/queries.scss' as *;

.header {
  padding: var(--base) 0;
  z-index: var(--header-z-index);
}

.wrap {
  display: flex;
  justify-content: space-between;
}

.nav {
  a {
    text-decoration: none;
    margin-left: var(--base);
  }

  @include mid-break {
    display: none;
  }
}

.mobileMenuToggler {
  all: unset;
  cursor: pointer;
  display: none;

  &[aria-expanded='true'] {
    transform: rotate(-25deg);
  }

  @include mid-break {
    display: block;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Header/index.tsx
Signals: React, Next.js

```typescript
import { ModalToggler } from '@faceless-ui/modal'
import Link from 'next/link'
import React from 'react'

import type { MainMenu } from '../../payload-types'

import { getCachedGlobal } from '../../utilities/getGlobals'
import { Gutter } from '../Gutter'
import { MenuIcon } from '../icons/Menu'
import { CMSLink } from '../Link'
import { Logo } from '../Logo'
import classes from './index.module.scss'
import { slug as menuModalSlug, MobileMenuModal } from './MobileMenuModal'

type HeaderBarProps = {
  children?: React.ReactNode
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ children }) => {
  return (
    <header className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link href="/">
          <Logo />
        </Link>

        {children}

        <ModalToggler className={classes.mobileMenuToggler} slug={menuModalSlug}>
          <MenuIcon />
        </ModalToggler>
      </Gutter>
    </header>
  )
}

export async function Header() {
  const header: MainMenu = await getCachedGlobal('main-menu', 1)()

  const navItems = header?.navItems || []

  return (
    <React.Fragment>
      <HeaderBar>
        <nav className={classes.nav}>
          {navItems.map(({ link }, i) => {
            return <CMSLink key={i} {...link} />
          })}
        </nav>
      </HeaderBar>

      <MobileMenuModal navItems={navItems} />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: mobileMenuModal.module.scss]---
Location: payload-main/examples/form-builder/src/components/Header/mobileMenuModal.module.scss

```text
@use '../../css/common.scss' as *;

.mobileMenuModal {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  padding: 0;
  opacity: 1;
  display: none;

  @include mid-break {
    display: block;
  }
}

.contentContainer {
  padding: 20px;
}

.mobileMenuItems {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-top: 30px;
}

.menuItem {
  @extend %h4;
  margin-top: 0;
}
```

--------------------------------------------------------------------------------

---[FILE: MobileMenuModal.tsx]---
Location: payload-main/examples/form-builder/src/components/Header/MobileMenuModal.tsx
Signals: React

```typescript
import { Modal } from '@faceless-ui/modal'
import React from 'react'

import type { MainMenu } from '../../payload-types'

import { HeaderBar } from '.'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'
import classes from './mobileMenuModal.module.scss'

type Props = {
  navItems: MainMenu['navItems']
}

export const slug = 'menu-modal'

export const MobileMenuModal: React.FC<Props> = ({ navItems }) => {
  return (
    <Modal className={classes.mobileMenuModal} slug={slug}>
      <HeaderBar />

      <Gutter>
        <div className={classes.mobileMenuItems}>
          {navItems &&
            navItems.map(({ link }, i) => {
              return <CMSLink className={classes.menuItem} key={i} {...link} />
            })}
        </div>
      </Gutter>
    </Modal>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/icons/Check/index.module.scss

```text
.checkBox {
  height: var(--base);
  width: var(--base);

  .stroke {
    stroke-width: 2px;
    fill: none;
    stroke: currentColor;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/icons/Check/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

export const Check: React.FC = () => {
  return (
    <svg className={classes.checkBox} height="100%" viewBox="0 0 25 25" width="100%">
      <path
        className={classes.stroke}
        d="M10.6092 16.0192L17.6477 8.98076"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
      <path
        className={classes.stroke}
        d="M7.35229 12.7623L10.6092 16.0192"
        strokeLinecap="square"
        strokeLinejoin="bevel"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/icons/Menu/index.tsx
Signals: React

```typescript
import React from 'react'

export const MenuIcon: React.FC = () => {
  return (
    <svg fill="none" height="25" viewBox="0 0 25 25" width="25" xmlns="http://www.w3.org/2000/svg">
      <rect fill="currentColor" height="2" width="18" x="3.5" y="4.5" />
      <rect fill="currentColor" height="2" width="18" x="3.5" y="11.5" />
      <rect fill="currentColor" height="2" width="18" x="3.5" y="18.5" />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Link/index.tsx
Signals: React, Next.js

```typescript
import Link from 'next/link'
import React from 'react'

import type { Page } from '../../payload-types'

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

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Logo/index.tsx
Signals: React

```typescript
import React from 'react'

export const Logo: React.FC = () => {
  return (
    <svg
      fill="none"
      height="29"
      viewBox="0 0 123 29"
      width="123"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.7441 22.9997H37.2741V16.3297H41.5981C44.7031 16.3297 46.9801 14.9037 46.9801 11.4537C46.9801 8.00369 44.7031 6.55469 41.5981 6.55469H34.7441V22.9997ZM37.2741 14.1447V8.73969H41.4831C43.3921 8.73969 44.3581 9.59069 44.3581 11.4537C44.3581 13.2937 43.3921 14.1447 41.4831 14.1447H37.2741Z"
        fill="black"
      />
      <path
        d="M51.3652 23.3217C53.2742 23.3217 54.6082 22.5627 55.3672 21.3437H55.4132C55.5512 22.6777 56.1492 23.1147 57.2762 23.1147C57.6442 23.1147 58.0352 23.0687 58.4262 22.9767V21.5967C58.2882 21.6197 58.2192 21.6197 58.1502 21.6197C57.7132 21.6197 57.5982 21.1827 57.5982 20.3317V14.9497C57.5982 11.9137 55.6662 10.9017 53.2512 10.9017C49.6632 10.9017 48.1912 12.6727 48.0762 14.9267H50.3762C50.4912 13.3627 51.1122 12.7187 53.1592 12.7187C54.8842 12.7187 55.3902 13.4317 55.3902 14.2827C55.3902 15.4327 54.2632 15.6627 52.4232 16.0077C49.5022 16.5597 47.5242 17.3417 47.5242 19.9637C47.5242 21.9647 49.0192 23.3217 51.3652 23.3217ZM49.8702 19.8027C49.8702 18.5837 50.7442 18.0087 52.8142 17.5947C54.0102 17.3417 55.0222 17.0887 55.3902 16.7437V18.4227C55.3902 20.4697 53.8952 21.5047 51.8712 21.5047C50.4682 21.5047 49.8702 20.9067 49.8702 19.8027Z"
        fill="black"
      />
      <path
        d="M61.4996 27.1167C63.3166 27.1167 64.4436 26.1737 65.5706 23.2757L70.2166 11.2697H67.8476L64.6276 20.2397H64.5816L61.1546 11.2697H58.6936L63.4316 22.8847C62.9716 24.7247 61.9136 25.1847 61.0166 25.1847C60.6486 25.1847 60.4416 25.1617 60.0506 25.1157V26.9557C60.6486 27.0707 60.9936 27.1167 61.4996 27.1167Z"
        fill="black"
      />
      <path d="M71.5939 22.9997H73.8479V6.55469H71.5939V22.9997Z" fill="black" />
      <path
        d="M81.6221 23.3447C85.2791 23.3447 87.4871 20.7917 87.4871 17.1117C87.4871 13.4547 85.2791 10.9017 81.6451 10.9017C77.9651 10.9017 75.7571 13.4777 75.7571 17.1347C75.7571 20.8147 77.9651 23.3447 81.6221 23.3447ZM78.1031 17.1347C78.1031 14.6737 79.2071 12.7877 81.6451 12.7877C84.0371 12.7877 85.1411 14.6737 85.1411 17.1347C85.1411 19.5727 84.0371 21.4817 81.6451 21.4817C79.2071 21.4817 78.1031 19.5727 78.1031 17.1347Z"
        fill="black"
      />
      <path
        d="M92.6484 23.3217C94.5574 23.3217 95.8914 22.5627 96.6504 21.3437H96.6964C96.8344 22.6777 97.4324 23.1147 98.5594 23.1147C98.9274 23.1147 99.3184 23.0687 99.7094 22.9767V21.5967C99.5714 21.6197 99.5024 21.6197 99.4334 21.6197C98.9964 21.6197 98.8814 21.1827 98.8814 20.3317V14.9497C98.8814 11.9137 96.9494 10.9017 94.5344 10.9017C90.9464 10.9017 89.4744 12.6727 89.3594 14.9267H91.6594C91.7744 13.3627 92.3954 12.7187 94.4424 12.7187C96.1674 12.7187 96.6734 13.4317 96.6734 14.2827C96.6734 15.4327 95.5464 15.6627 93.7064 16.0077C90.7854 16.5597 88.8074 17.3417 88.8074 19.9637C88.8074 21.9647 90.3024 23.3217 92.6484 23.3217ZM91.1534 19.8027C91.1534 18.5837 92.0274 18.0087 94.0974 17.5947C95.2934 17.3417 96.3054 17.0887 96.6734 16.7437V18.4227C96.6734 20.4697 95.1784 21.5047 93.1544 21.5047C91.7514 21.5047 91.1534 20.9067 91.1534 19.8027Z"
        fill="black"
      />
      <path
        d="M106.181 23.3217C108.021 23.3217 109.148 22.4477 109.792 21.6197H109.838V22.9997H112.092V6.55469H109.838V12.6957H109.792C109.148 11.7757 108.021 10.9247 106.181 10.9247C103.191 10.9247 100.914 13.2707 100.914 17.1347C100.914 20.9987 103.191 23.3217 106.181 23.3217ZM103.26 17.1347C103.26 14.8347 104.341 12.8107 106.549 12.8107C108.573 12.8107 109.815 14.4667 109.815 17.1347C109.815 19.7797 108.573 21.4587 106.549 21.4587C104.341 21.4587 103.26 19.4347 103.26 17.1347Z"
        fill="black"
      />
      <path
        d="M12.2464 2.33838L22.2871 8.83812V21.1752L14.7265 25.8854V13.5484L4.67383 7.05725L12.2464 2.33838Z"
        fill="black"
      />
      <path d="M11.477 25.2017V15.5747L3.90039 20.2936L11.477 25.2017Z" fill="black" />
      <path
        d="M120.442 6.30273C119.086 6.30273 117.998 7.29978 117.998 8.75952C117.998 10.2062 119.086 11.1968 120.442 11.1968C121.791 11.1968 122.879 10.2062 122.879 8.75952C122.879 7.29978 121.791 6.30273 120.442 6.30273ZM120.442 10.7601C119.34 10.7601 118.48 9.95207 118.48 8.75952C118.48 7.54742 119.34 6.73935 120.442 6.73935C121.563 6.73935 122.397 7.54742 122.397 8.75952C122.397 9.95207 121.563 10.7601 120.442 10.7601ZM120.52 8.97457L121.048 9.9651H121.641L121.041 8.86378C121.367 8.72042 121.511 8.45975 121.511 8.17302C121.511 7.49528 121.054 7.36495 120.285 7.36495H119.49V9.9651H120.025V8.97457H120.52ZM120.37 7.78853C120.729 7.78853 120.976 7.86673 120.976 8.17953C120.976 8.43368 120.807 8.56402 120.403 8.56402H120.025V7.78853H120.37Z"
        fill="black"
      />
    </svg>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/RichText/index.tsx
Signals: React

```typescript
import React from 'react'

import { serializeLexical } from './serialize'

const RichText: React.FC<{ className?: string; content: any; enableGutter?: boolean }> = ({
  className,
  content,
}) => {
  if (!content) {
    return null
  }

  return (
    <div className={[className].filter(Boolean).join(' ')}>
      {content &&
        !Array.isArray(content) &&
        typeof content === 'object' &&
        'root' in content &&
        serializeLexical({ nodes: content?.root?.children })}
    </div>
  )
}

export default RichText
```

--------------------------------------------------------------------------------

---[FILE: nodeFormat.tsx]---
Location: payload-main/examples/form-builder/src/components/RichText/nodeFormat.tsx

```typescript
// @ts-nocheck
//This copy-and-pasted from lexical here here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts

import type { ElementFormatType, TextFormatType } from '@payloadcms/richtext-lexical/lexical'
import type { TextDetailType, TextModeType } from 'lexical/nodes/LexicalTextNode'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// DOM
export const DOM_ELEMENT_TYPE = 1
export const DOM_TEXT_TYPE = 3

// Reconciling
export const NO_DIRTY_NODES = 0
export const HAS_DIRTY_NODES = 1
export const FULL_RECONCILE = 2

// Text node modes
export const IS_NORMAL = 0
export const IS_TOKEN = 1
export const IS_SEGMENTED = 2
// IS_INERT = 3

// Text node formatting
export const IS_BOLD = 1
export const IS_ITALIC = 1 << 1
export const IS_STRIKETHROUGH = 1 << 2
export const IS_UNDERLINE = 1 << 3
export const IS_CODE = 1 << 4
export const IS_SUBSCRIPT = 1 << 5
export const IS_SUPERSCRIPT = 1 << 6
export const IS_HIGHLIGHT = 1 << 7

export const IS_ALL_FORMATTING =
  IS_BOLD |
  IS_ITALIC |
  IS_STRIKETHROUGH |
  IS_UNDERLINE |
  IS_CODE |
  IS_SUBSCRIPT |
  IS_SUPERSCRIPT |
  IS_HIGHLIGHT

// Text node details
export const IS_DIRECTIONLESS = 1
export const IS_UNMERGEABLE = 1 << 1

// Element node formatting
export const IS_ALIGN_LEFT = 1
export const IS_ALIGN_CENTER = 2
export const IS_ALIGN_RIGHT = 3
export const IS_ALIGN_JUSTIFY = 4
export const IS_ALIGN_START = 5
export const IS_ALIGN_END = 6

// Reconciliation
export const NON_BREAKING_SPACE = '\u00A0'
const ZERO_WIDTH_SPACE = '\u200b'

export const DOUBLE_LINE_BREAK = '\n\n'

// For FF, we need to use a non-breaking space, or it gets composition
// in a stuck state.

const RTL = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
const LTR =
  'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
  '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
  '\uFE00-\uFE6F\uFEFD-\uFFFF'

// eslint-disable-next-line
export const RTL_REGEX = new RegExp('^[^' + LTR + ']*[' + RTL + ']')
// eslint-disable-next-line
export const LTR_REGEX = new RegExp('^[^' + RTL + ']*[' + LTR + ']')

export const TEXT_TYPE_TO_FORMAT: Record<string | TextFormatType, number> = {
  bold: IS_BOLD,
  code: IS_CODE,
  highlight: IS_HIGHLIGHT,
  italic: IS_ITALIC,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
  underline: IS_UNDERLINE,
}

export const DETAIL_TYPE_TO_DETAIL: Record<string | TextDetailType, number> = {
  directionless: IS_DIRECTIONLESS,
  unmergeable: IS_UNMERGEABLE,
}

export const ELEMENT_TYPE_TO_FORMAT: Record<Exclude<ElementFormatType, ''>, number> = {
  center: IS_ALIGN_CENTER,
  end: IS_ALIGN_END,
  justify: IS_ALIGN_JUSTIFY,
  left: IS_ALIGN_LEFT,
  right: IS_ALIGN_RIGHT,
  start: IS_ALIGN_START,
}

export const ELEMENT_FORMAT_TO_TYPE: Record<number, ElementFormatType> = {
  [IS_ALIGN_CENTER]: 'center',
  [IS_ALIGN_END]: 'end',
  [IS_ALIGN_JUSTIFY]: 'justify',
  [IS_ALIGN_LEFT]: 'left',
  [IS_ALIGN_RIGHT]: 'right',
  [IS_ALIGN_START]: 'start',
}

export const TEXT_MODE_TO_TYPE: Record<TextModeType, 0 | 1 | 2> = {
  normal: IS_NORMAL,
  segmented: IS_SEGMENTED,
  token: IS_TOKEN,
}

export const TEXT_TYPE_TO_MODE: Record<number, TextModeType> = {
  [IS_NORMAL]: 'normal',
  [IS_SEGMENTED]: 'segmented',
  [IS_TOKEN]: 'token',
}
```

--------------------------------------------------------------------------------

---[FILE: serialize.tsx]---
Location: payload-main/examples/form-builder/src/components/RichText/serialize.tsx
Signals: React

```typescript
import type { LinkFields, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import type {
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical/lexical'
import type {
  SerializedListItemNode,
  SerializedListNode,
} from '@payloadcms/richtext-lexical/lexical/list'
import type { SerializedHeadingNode } from '@payloadcms/richtext-lexical/lexical/rich-text'
import type { JSX } from 'react'

import React, { Fragment } from 'react'

import { CMSLink } from '../Link'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'

interface Props {
  nodes: SerializedLexicalNode[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((_node, index): JSX.Element | null => {
        if (_node.type === 'text') {
          const node = _node as SerializedTextNode
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          if (node.format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (node.format & IS_CODE) {
            text = <code key={index}>{node.text}</code>
          }
          if (node.format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (node.format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        if (_node == null) {
          return null
        }

        // NOTE: Hacky fix for
        // https://github.com/facebook/lexical/blob/d10c4e6e55261b2fdd7d1845aed46151d0f06a8c/packages/lexical-list/src/LexicalListItemNode.ts#L133
        // which does not return checked: false (only true - i.e. there is no prop for false)
        const serializedChildrenFn = (node: SerializedElementNode): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            if (node?.type === 'list' && (node as SerializedListNode)?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
              return serializeLexical({ nodes: node.children })
            } else {
              return serializeLexical({ nodes: node.children })
            }
          }
        }

        const serializedChildren =
          'children' in _node ? serializedChildrenFn(_node as SerializedElementNode) : ''

        switch (_node.type) {
          case 'heading': {
            const node = _node as SerializedHeadingNode

            type Heading = Extract<keyof JSX.IntrinsicElements, 'h1' | 'h2' | 'h3' | 'h4' | 'h5'>
            const Tag = node?.tag as Heading
            return <Tag key={index}>{serializedChildren}</Tag>
          }
          case 'linebreak': {
            return <br key={index} />
          }
          case 'link': {
            const node = _node as SerializedLinkNode

            const fields: LinkFields = node.fields

            return (
              <CMSLink
                key={index}
                newTab={Boolean(fields?.newTab)}
                reference={fields.doc as any}
                type={fields.linkType === 'internal' ? 'reference' : 'custom'}
                url={fields.url}
              >
                {serializedChildren}
              </CMSLink>
            )
          }
          case 'list': {
            const node = _node as SerializedListNode

            type List = Extract<keyof JSX.IntrinsicElements, 'ol' | 'ul'>
            const Tag = node?.tag as List
            return (
              <Tag className="list" key={index}>
                {serializedChildren}
              </Tag>
            )
          }
          case 'listitem': {
            const node = _node as SerializedListItemNode

            if (node?.checked != null) {
              return (
                <li
                  aria-checked={node.checked ? 'true' : 'false'}
                  className={` ${node.checked ? '' : ''}`}
                  key={index}
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                  role="checkbox"
                  tabIndex={-1}
                  value={node?.value}
                >
                  {serializedChildren}
                </li>
              )
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              )
            }
          }
          case 'paragraph': {
            return <p key={index}>{serializedChildren}</p>
          }
          case 'quote': {
            return <blockquote key={index}>{serializedChildren}</blockquote>
          }

          default:
            return null
        }
      })}
    </Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/VerticalPadding/index.module.scss

```text
.top-large {
  padding-top: var(--block-padding);
}

.top-medium {
  padding-top: calc(var(--block-padding) / 2);
}

.top-small {
  padding-top: calc(var(--block-padding) / 3);
}

.bottom-large {
  padding-bottom: var(--block-padding);
}

.bottom-medium {
  padding-bottom: calc(var(--block-padding) / 2);
}

.bottom-small {
  padding-bottom: calc(var(--block-padding) / 3);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/VerticalPadding/index.tsx
Signals: React

```typescript
import React from 'react'

import classes from './index.module.scss'

export type VerticalPaddingOptions = 'large' | 'medium' | 'none' | 'small'

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
Location: payload-main/examples/form-builder/src/css/app.scss

```text
@use './queries.scss' as *;
@use './colors.scss' as *;
@use './type.scss' as *;

:root {
  --breakpoint-xs-width: #{$breakpoint-xs-width};
  --breakpoint-s-width: #{$breakpoint-s-width};
  --breakpoint-m-width: #{$breakpoint-m-width};
  --breakpoint-l-width: #{$breakpoint-l-width};
  --scrollbar-width: 17px;

  --base: 24px;
  --font-body: system-ui;
  --font-mono: 'Roboto Mono', monospace;

  --gutter-h: 180px;
  --block-padding: 120px;

  --header-z-index: 100;
  --modal-z-index: 90;

  @include large-break {
    --gutter-h: 144px;
    --block-padding: 96px;
  }

  @include mid-break {
    --gutter-h: 24px;
    --block-padding: 60px;
  }
}

/////////////////////////////
// GLOBAL STYLES
/////////////////////////////

* {
  box-sizing: border-box;
}

html {
  @extend %body;
  background: var(--color-white);
  -webkit-font-smoothing: antialiased;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family: var(--font-body);
  color: var(--color-black);
  margin: 0;
}

::selection {
  background: var(--color-green);
  color: var(--color-black);
}

::-moz-selection {
  background: var(--color-green);
  color: var(--color-black);
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
Location: payload-main/examples/form-builder/src/css/colors.scss

```text
:root {
  --color-red: rgb(255, 0, 0);
  --color-green: rgb(178, 255, 214);
  --color-white: rgb(255, 255, 255);
  --color-dark-gray: rgb(51, 52, 52);
  --color-mid-gray: rgb(196, 196, 196);
  --color-gray: rgb(212, 212, 212);
  --color-light-gray: rgb(244, 244, 244);
  --color-black: rgb(0, 0, 0);
}
```

--------------------------------------------------------------------------------

---[FILE: common.scss]---
Location: payload-main/examples/form-builder/src/css/common.scss

```text
@forward './queries.scss';
@forward './type.scss';
```

--------------------------------------------------------------------------------

---[FILE: queries.scss]---
Location: payload-main/examples/form-builder/src/css/queries.scss

```text
$breakpoint-xs-width: 400px;
$breakpoint-s-width: 768px;
$breakpoint-m-width: 1024px;
$breakpoint-l-width: 1440px;

////////////////////////////
// MEDIA QUERIES
/////////////////////////////

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

````
