---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 368
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 368 of 695)

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
Location: payload-main/packages/ui/src/elements/EditMany/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import React, { useState } from 'react'

import type { FieldOption } from '../FieldSelect/reduceFieldOptions.js'

import { useAuth } from '../../providers/Auth/index.js'
import { EditDepthProvider } from '../../providers/EditDepth/index.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Drawer } from '../Drawer/index.js'
import { ListSelectionButton } from '../ListSelection/index.js'
import { EditManyDrawerContent } from './DrawerContent.js'
import './index.scss'

export const baseClass = 'edit-many'

export type EditManyProps = {
  readonly collection: ClientCollectionConfig
}

export const EditMany: React.FC<EditManyProps> = (props) => {
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()

  return (
    <EditMany_v4
      {...props}
      count={count}
      ids={selectedIDs}
      onSuccess={() => toggleAll()}
      selectAll={selectAll === SelectAllStatus.AllAvailable}
    />
  )
}

export const EditMany_v4: React.FC<
  {
    count: number
    ids: (number | string)[]
    /**
     * When multiple EditMany components are rendered on the page, this will differentiate them.
     */
    modalPrefix?: string
    onSuccess?: () => void
    selectAll: boolean
    where?: Where
  } & Omit<EditManyProps, 'ids'>
> = ({ collection, count, ids, modalPrefix, onSuccess, selectAll, where }) => {
  const { permissions } = useAuth()
  const { openModal } = useModal()

  const { t } = useTranslation()

  const [selectedFields, setSelectedFields] = useState<FieldOption[]>([])

  const collectionPermissions = permissions?.collections?.[collection.slug]

  const drawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}edit-${collection.slug}`

  if (count === 0 || !collectionPermissions?.update) {
    return null
  }

  return (
    <div className={[baseClass, `${baseClass}__toggle`].filter(Boolean).join(' ')}>
      <ListSelectionButton
        aria-label={t('general:edit')}
        onClick={() => {
          openModal(drawerSlug)
          setSelectedFields([])
        }}
      >
        {t('general:edit')}
      </ListSelectionButton>
      <EditDepthProvider>
        <Drawer Header={null} slug={drawerSlug}>
          <EditManyDrawerContent
            collection={collection}
            count={count}
            drawerSlug={drawerSlug}
            ids={ids}
            onSuccess={onSuccess}
            selectAll={selectAll}
            selectedFields={selectedFields}
            setSelectedFields={setSelectedFields}
            where={where}
          />
        </Drawer>
      </EditDepthProvider>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/EditUpload/index.scss

```text
@import '../../scss/styles.scss';

$header-height: base(5);

@layer payload-default {
  .edit-upload {
    --edit-upload-cell-spacing: calc(var(--base) * 1.5);
    --edit-upload-sidebar-width: calc(350px + var(--gutter-h));
    height: 100%;
    margin-right: calc(var(--gutter-h) * -1);
    margin-left: calc(var(--gutter-h) * -1);

    &__header {
      height: $header-height;
      border-bottom: 1px solid var(--theme-elevation-150);
      padding: 0 var(--gutter-h);
      display: flex;
      justify-content: space-between;
      align-items: center;

      & h2 {
        margin: 0;
        text-wrap: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    [dir='rtl'] &__actions {
      margin-right: auto;
      margin-left: unset;
    }

    &__actions {
      min-width: 350px;
      margin-left: auto;
      padding: base(0.5) 0 base(0.5) base(1.5);
      justify-content: flex-end;
      display: flex;
      gap: base(1);
      text-wrap: nowrap;
    }

    &__toolWrap {
      display: flex;
      justify-content: flex-end;
      height: (calc(100% - #{$header-height}));
    }

    .ReactCrop__selection-addon,
    &__crop-window {
      height: 100%;
      width: 100%;
    }

    &__focal-wrapper {
      position: relative;
      display: inline-flex;
      max-height: 100%;
    }

    &__draggable-container {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      pointer-events: none;

      &--dragging {
        pointer-events: all;

        .edit-upload__focalPoint {
          cursor: grabbing;
        }
      }
    }

    &__draggable {
      @include btn-reset;
      position: absolute;
    }

    &__focalPoint {
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      width: 50px;
      height: 50px;
      transform: translate3d(-50%, -50%, 0);
      pointer-events: all;

      svg {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 100%;
        width: base(2);
        height: base(2);
        color: white;
      }
    }

    &__crop,
    &__focalOnly {
      padding: base(1.5) base(1.5) base(1.5) 0;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    &__crop {
      padding: var(--edit-upload-cell-spacing);
      padding-left: var(--gutter-h);
      display: flex;
      align-items: flex-start;
      height: 100%;
    }

    &__imageWrap {
      position: relative;
    }

    &__point {
      cursor: move;
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 100%;

      & svg {
        width: base(2);
        height: base(2);
      }
    }

    &__sidebar {
      border-left: 1px solid var(--theme-elevation-150);
      padding-top: var(--edit-upload-cell-spacing);
      min-width: var(--edit-upload-sidebar-width);

      & > div:first-child {
        margin-bottom: base(1);
      }
    }

    &__groupWrap {
      display: flex;
      flex-direction: column;
      gap: base(0.5);
      padding-right: var(--gutter-h);
      padding-left: var(--edit-upload-cell-spacing);
      width: 100%;

      + .edit-upload__groupWrap {
        padding-top: var(--edit-upload-cell-spacing);
        margin-top: var(--edit-upload-cell-spacing);
        border-top: 1px solid var(--theme-elevation-150);
      }
    }

    &__inputsWrap,
    &__titleWrap {
      display: flex;
      gap: base(1);
    }

    &__titleWrap {
      justify-content: space-between;
      align-items: center;

      & h3 {
        margin: 0;
      }
    }

    &__reset {
      height: fit-content;
      border-radius: var(--style-radius-s);
      background-color: var(--theme-elevation-150);
      padding: 0 base(0.4);
    }

    &__input {
      flex: 1;
      & input {
        @include formInput;
      }
    }

    @include mid-break {
      --edit-upload-cell-spacing: var(--gutter-h);
      &__sidebar {
        padding-left: 0;
        border-left: 0;
        width: 100%;
      }
      &__toolWrap {
        flex-direction: column-reverse;
      }
    }

    @include small-break {
      flex-direction: column;

      &__focalPoint {
        border-right: none;
        padding: base(1) 0;
      }

      &__inputsWrap {
        flex-direction: column;
        gap: base(1);
      }

      &__sidebar {
        min-width: 0;
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/EditUpload/index.tsx
Signals: React

```typescript
'use client'

import type { UploadEdits } from 'payload'

import { useModal } from '@faceless-ui/modal'
import React, { useRef, useState } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { editDrawerSlug } from '../../elements/Upload/index.js'
import { PlusIcon } from '../../icons/Plus/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { Button } from '../Button/index.js'
import './index.scss'

const baseClass = 'edit-upload'

type Props = {
  name: string
  onChange: (value: string) => void
  ref?: React.RefObject<HTMLInputElement>
  value: string
}

const Input: React.FC<Props> = (props) => {
  const { name, onChange, ref, value } = props

  return (
    <div className={`${baseClass}__input`}>
      {name}
      <input
        name={name}
        onChange={(e) => onChange(e.target.value)}
        ref={ref}
        type="number"
        value={value}
      />
    </div>
  )
}

type FocalPosition = {
  x: number
  y: number
}

export type EditUploadProps = {
  fileName: string
  fileSrc: string
  imageCacheTag?: string
  initialCrop?: UploadEdits['crop']
  initialFocalPoint?: FocalPosition
  onSave?: (uploadEdits: UploadEdits) => void
  showCrop?: boolean
  showFocalPoint?: boolean
}

const defaultCrop: UploadEdits['crop'] = {
  height: 100,
  unit: '%',
  width: 100,
  x: 0,
  y: 0,
}

export const EditUpload: React.FC<EditUploadProps> = ({
  fileName,
  fileSrc,
  imageCacheTag,
  initialCrop,
  initialFocalPoint,
  onSave,
  showCrop,
  showFocalPoint,
}) => {
  const { closeModal } = useModal()
  const { t } = useTranslation()

  const [crop, setCrop] = useState<UploadEdits['crop']>(() => ({
    ...defaultCrop,
    ...(initialCrop || {}),
  }))

  const defaultFocalPosition: FocalPosition = {
    x: 50,
    y: 50,
  }

  const [focalPosition, setFocalPosition] = useState<FocalPosition>(() => ({
    ...defaultFocalPosition,
    ...initialFocalPoint,
  }))

  const [checkBounds, setCheckBounds] = useState<boolean>(false)
  const [uncroppedPixelHeight, setUncroppedPixelHeight] = useState<number>(0)
  const [uncroppedPixelWidth, setUncroppedPixelWidth] = useState<number>(0)

  const focalWrapRef = useRef<HTMLDivElement | undefined>(undefined)
  const imageRef = useRef<HTMLImageElement | undefined>(undefined)
  const cropRef = useRef<HTMLDivElement | undefined>(undefined)

  const heightInputRef = useRef<HTMLInputElement | null>(null)
  const widthInputRef = useRef<HTMLInputElement | null>(null)

  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  const onImageLoad = (e) => {
    // set the default image height/width on load
    setUncroppedPixelHeight(e.currentTarget.naturalHeight)
    setUncroppedPixelWidth(e.currentTarget.naturalWidth)
    setImageLoaded(true)
  }

  const fineTuneCrop = ({ dimension, value }: { dimension: 'height' | 'width'; value: string }) => {
    const intValue = parseInt(value)
    if (dimension === 'width' && intValue >= uncroppedPixelWidth) {
      return null
    }
    if (dimension === 'height' && intValue >= uncroppedPixelHeight) {
      return null
    }

    const percentage =
      100 * (intValue / (dimension === 'width' ? uncroppedPixelWidth : uncroppedPixelHeight))

    if (percentage === 100 || percentage === 0) {
      return null
    }

    setCrop({
      ...crop,
      [dimension]: percentage,
    })
  }

  const fineTuneFocalPosition = ({
    coordinate,
    value,
  }: {
    coordinate: 'x' | 'y'
    value: string
  }) => {
    const intValue = parseInt(value)
    if (intValue >= 0 && intValue <= 100) {
      setFocalPosition((prevPosition) => ({ ...prevPosition, [coordinate]: intValue }))
    }
  }

  const saveEdits = () => {
    if (typeof onSave === 'function') {
      onSave({
        crop: crop ? crop : undefined,
        focalPoint: focalPosition,
        heightInPixels: Number(heightInputRef?.current?.value ?? uncroppedPixelHeight),
        widthInPixels: Number(widthInputRef?.current?.value ?? uncroppedPixelWidth),
      })
    }
    closeModal(editDrawerSlug)
  }

  const onDragEnd = React.useCallback(({ x, y }) => {
    setFocalPosition({ x, y })
    setCheckBounds(false)
  }, [])

  const centerFocalPoint = () => {
    const containerRect = focalWrapRef.current.getBoundingClientRect()
    const boundsRect = showCrop
      ? cropRef.current.getBoundingClientRect()
      : imageRef.current.getBoundingClientRect()
    const xCenter =
      ((boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width) * 100
    const yCenter =
      ((boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height) * 100
    setFocalPosition({ x: xCenter, y: yCenter })
  }

  const fileSrcToUse = imageCacheTag ? `${fileSrc}?${encodeURIComponent(imageCacheTag)}` : fileSrc

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h2 title={`${t('general:editing')} ${fileName}`}>
          {t('general:editing')} {fileName}
        </h2>
        <div className={`${baseClass}__actions`}>
          <Button
            aria-label={t('general:cancel')}
            buttonStyle="secondary"
            className={`${baseClass}__cancel`}
            onClick={() => closeModal(editDrawerSlug)}
          >
            {t('general:cancel')}
          </Button>
          <Button
            aria-label={t('general:applyChanges')}
            buttonStyle="primary"
            className={`${baseClass}__save`}
            disabled={!imageLoaded}
            onClick={saveEdits}
          >
            {t('general:applyChanges')}
          </Button>
        </div>
      </div>
      <div className={`${baseClass}__toolWrap`}>
        <div className={`${baseClass}__crop`}>
          <div
            className={`${baseClass}__focal-wrapper`}
            ref={focalWrapRef}
            style={{
              aspectRatio: `${uncroppedPixelWidth / uncroppedPixelHeight}`,
            }}
          >
            {showCrop ? (
              <ReactCrop
                className={`${baseClass}__reactCrop`}
                crop={crop}
                onChange={(_, c) => setCrop(c)}
                onComplete={() => setCheckBounds(true)}
                renderSelectionAddon={() => {
                  return <div className={`${baseClass}__crop-window`} ref={cropRef} />
                }}
              >
                <img
                  alt={t('upload:setCropArea')}
                  onLoad={onImageLoad}
                  ref={imageRef}
                  src={fileSrcToUse}
                />
              </ReactCrop>
            ) : (
              <img
                alt={t('upload:setFocalPoint')}
                onLoad={onImageLoad}
                ref={imageRef}
                src={fileSrcToUse}
              />
            )}
            {showFocalPoint && (
              <DraggableElement
                boundsRef={showCrop ? cropRef : imageRef}
                checkBounds={showCrop ? checkBounds : false}
                className={`${baseClass}__focalPoint`}
                containerRef={focalWrapRef}
                initialPosition={focalPosition}
                onDragEnd={onDragEnd}
                setCheckBounds={showCrop ? setCheckBounds : false}
              >
                <PlusIcon />
              </DraggableElement>
            )}
          </div>
        </div>
        {(showCrop || showFocalPoint) && (
          <div className={`${baseClass}__sidebar`}>
            {showCrop && (
              <div className={`${baseClass}__groupWrap`}>
                <div>
                  <div className={`${baseClass}__titleWrap`}>
                    <h3>{t('upload:crop')}</h3>
                    <Button
                      buttonStyle="none"
                      className={`${baseClass}__reset`}
                      onClick={() =>
                        setCrop({
                          height: 100,
                          unit: '%',
                          width: 100,
                          x: 0,
                          y: 0,
                        })
                      }
                    >
                      {t('general:reset')}
                    </Button>
                  </div>
                </div>
                <span className={`${baseClass}__description`}>
                  {t('upload:cropToolDescription')}
                </span>
                <div className={`${baseClass}__inputsWrap`}>
                  <Input
                    name={`${t('upload:width')} (px)`}
                    onChange={(value) => fineTuneCrop({ dimension: 'width', value })}
                    ref={widthInputRef}
                    value={((crop.width / 100) * uncroppedPixelWidth).toFixed(0)}
                  />
                  <Input
                    name={`${t('upload:height')} (px)`}
                    onChange={(value) => fineTuneCrop({ dimension: 'height', value })}
                    ref={heightInputRef}
                    value={((crop.height / 100) * uncroppedPixelHeight).toFixed(0)}
                  />
                </div>
              </div>
            )}

            {showFocalPoint && (
              <div className={`${baseClass}__groupWrap`}>
                <div>
                  <div className={`${baseClass}__titleWrap`}>
                    <h3>{t('upload:focalPoint')}</h3>
                    <Button
                      buttonStyle="none"
                      className={`${baseClass}__reset`}
                      onClick={centerFocalPoint}
                    >
                      {t('general:reset')}
                    </Button>
                  </div>
                </div>
                <span className={`${baseClass}__description`}>
                  {t('upload:focalPointDescription')}
                </span>
                <div className={`${baseClass}__inputsWrap`}>
                  <Input
                    name="X %"
                    onChange={(value) => fineTuneFocalPosition({ coordinate: 'x', value })}
                    value={focalPosition.x.toFixed(0)}
                  />
                  <Input
                    name="Y %"
                    onChange={(value) => fineTuneFocalPosition({ coordinate: 'y', value })}
                    value={focalPosition.y.toFixed(0)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const DraggableElement = ({
  boundsRef,
  checkBounds,
  children,
  className,
  containerRef,
  initialPosition = { x: 50, y: 50 },
  onDragEnd,
  setCheckBounds,
}) => {
  const [position, setPosition] = useState({ x: initialPosition.x, y: initialPosition.y })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLButtonElement | undefined>(undefined)

  const getCoordinates = React.useCallback(
    (mouseXArg?: number, mouseYArg?: number, recenter?: boolean) => {
      const containerRect = containerRef.current.getBoundingClientRect()
      const boundsRect = boundsRef.current.getBoundingClientRect()
      const mouseX = mouseXArg ?? boundsRect.left
      const mouseY = mouseYArg ?? boundsRect.top

      const xOutOfBounds = mouseX < boundsRect.left || mouseX > boundsRect.right
      const yOutOfBounds = mouseY < boundsRect.top || mouseY > boundsRect.bottom

      let x = ((mouseX - containerRect.left) / containerRect.width) * 100
      let y = ((mouseY - containerRect.top) / containerRect.height) * 100
      const xCenter =
        ((boundsRect.left - containerRect.left + boundsRect.width / 2) / containerRect.width) * 100
      const yCenter =
        ((boundsRect.top - containerRect.top + boundsRect.height / 2) / containerRect.height) * 100
      if (xOutOfBounds || yOutOfBounds) {
        setIsDragging(false)
        if (mouseX < boundsRect.left) {
          x = ((boundsRect.left - containerRect.left) / containerRect.width) * 100
        } else if (mouseX > boundsRect.right) {
          x =
            ((containerRect.width - (containerRect.right - boundsRect.right)) /
              containerRect.width) *
            100
        }

        if (mouseY < boundsRect.top) {
          y = ((boundsRect.top - containerRect.top) / containerRect.height) * 100
        } else if (mouseY > boundsRect.bottom) {
          y =
            ((containerRect.height - (containerRect.bottom - boundsRect.bottom)) /
              containerRect.height) *
            100
        }

        if (recenter) {
          x = xOutOfBounds ? xCenter : x
          y = yOutOfBounds ? yCenter : y
        }
      }

      return { x, y }
    },
    [boundsRef, containerRef],
  )

  const handleMouseDown = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    if (!isDragging) {
      return null
    }
    const { x, y } = getCoordinates(event.clientX, event.clientY)

    setPosition({ x, y })
  }

  const onDrop = () => {
    setIsDragging(false)
    onDragEnd(position)
  }

  React.useEffect(() => {
    if (isDragging || !dragRef.current) {
      return
    }
    if (checkBounds) {
      const { height, left, top, width } = dragRef.current.getBoundingClientRect()
      const { x, y } = getCoordinates(left + width / 2, top + height / 2, true)
      onDragEnd({ x, y })
      setPosition({ x, y })
      setCheckBounds(false)
      return
    }
  }, [getCoordinates, isDragging, checkBounds, setCheckBounds, position.x, position.y, onDragEnd])

  React.useEffect(() => {
    setPosition({ x: initialPosition.x, y: initialPosition.y })
  }, [initialPosition.x, initialPosition.y])

  return (
    <div
      className={[
        `${baseClass}__draggable-container`,
        isDragging && `${baseClass}__draggable-container--dragging`,
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseMove={handleMouseMove}
    >
      <button
        className={[`${baseClass}__draggable`, className].filter(Boolean).join(' ')}
        onMouseDown={handleMouseDown}
        onMouseUp={onDrop}
        ref={dragRef}
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        type="button"
      >
        {children}
      </button>
      <div />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/EmailAndUsername/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .login-fields {
    display: flex;
    flex-direction: column;
    gap: var(--base);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/EmailAndUsername/index.tsx
Signals: React

```typescript
'use client'

import type { TFunction } from '@payloadcms/translations'
import type { LoginWithUsernameOptions, SanitizedFieldPermissions } from 'payload'

import { email, getFieldPermissions, username } from 'payload/shared'
import React from 'react'

import { EmailField } from '../../fields/Email/index.js'
import { TextField } from '../../fields/Text/index.js'
import './index.scss'
import { FieldPathContext } from '../../forms/RenderFields/context.js'

const baseClass = 'login-fields'
type RenderEmailAndUsernameFieldsProps = {
  className?: string
  loginWithUsername?: false | LoginWithUsernameOptions
  operation?: 'create' | 'update'
  permissions?:
    | {
        [fieldName: string]: SanitizedFieldPermissions
      }
    | true
  readOnly: boolean
  t: TFunction
}

export function EmailAndUsernameFields(props: RenderEmailAndUsernameFieldsProps) {
  const {
    className,
    loginWithUsername,
    operation: operationFromProps,
    permissions,
    readOnly,
    t,
  } = props

  function getAuthFieldPermission(fieldName: string, operation: 'read' | 'update') {
    const permissionsResult = getFieldPermissions({
      field: { name: fieldName, type: 'text' },
      operation: operationFromProps === 'create' ? 'create' : operation,
      parentName: '',
      permissions,
    })
    return permissionsResult.operation
  }

  const hasEmailFieldOverride =
    typeof permissions === 'object' && 'email' in permissions && permissions.email
  const hasUsernameFieldOverride =
    typeof permissions === 'object' && 'username' in permissions && permissions.username

  const emailPermissions = hasEmailFieldOverride
    ? {
        read: getAuthFieldPermission('email', 'read'),
        update: getAuthFieldPermission('email', 'update'),
      }
    : {
        read: true,
        update: true,
      }

  const usernamePermissions = hasUsernameFieldOverride
    ? {
        read: getAuthFieldPermission('username', 'read'),
        update: getAuthFieldPermission('username', 'update'),
      }
    : {
        read: true,
        update: true,
      }

  const showEmailField =
    (!loginWithUsername || loginWithUsername?.requireEmail || loginWithUsername?.allowEmailLogin) &&
    emailPermissions.read

  const showUsernameField = Boolean(loginWithUsername) && usernamePermissions.read

  if (showEmailField || showUsernameField) {
    return (
      <div className={[baseClass, className && className].filter(Boolean).join(' ')}>
        {showEmailField ? (
          <FieldPathContext value="email">
            <EmailField
              field={{
                name: 'email',
                admin: {
                  autoComplete: 'off',
                },
                label: t('general:email'),
                required:
                  !loginWithUsername || (loginWithUsername && loginWithUsername.requireEmail),
              }}
              path="email"
              readOnly={readOnly || !emailPermissions.update}
              schemaPath="email"
              validate={email}
            />
          </FieldPathContext>
        ) : null}
        {showUsernameField && (
          <FieldPathContext value="username">
            <TextField
              field={{
                name: 'username',
                admin: {
                  autoComplete: 'off',
                },
                label: t('authentication:username'),
                required: loginWithUsername && loginWithUsername.requireUsername,
              }}
              path="username"
              readOnly={readOnly || !usernamePermissions.update}
              schemaPath="username"
              validate={username}
            />
          </FieldPathContext>
        )}
      </div>
    )
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/ErrorPill/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .error-pill {
    align-self: center;
    align-items: center;
    border: 0;
    padding: 0 base(0.25);
    flex-shrink: 0;
    border-radius: var(--style-radius-l);
    line-height: 18px;
    font-size: 11px;
    text-align: center;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-error-300);
    color: var(--theme-error-950);

    &--fixed-width {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      position: relative;
    }

    &__count {
      letter-spacing: 0.5px;
      margin-left: 0.5px;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/ErrorPill/index.tsx
Signals: React

```typescript
'use client'
import type { I18nClient } from '@payloadcms/translations'

import React from 'react'

import './index.scss'

const baseClass = 'error-pill'

export type ErrorPillProps = {
  className?: string
  count: number
  i18n: I18nClient
  withMessage?: boolean
}

export const ErrorPill: React.FC<ErrorPillProps> = (props) => {
  const { className, count, i18n, withMessage } = props
  const lessThan3Chars = !withMessage && count < 99

  const classes = [baseClass, lessThan3Chars && `${baseClass}--fixed-width`, className && className]
    .filter(Boolean)
    .join(' ')

  if (count === 0) {
    return null
  }

  return (
    <div className={classes}>
      <div className={`${baseClass}__content`}>
        <span className={`${baseClass}__count`}>{count}</span>
        {withMessage && ` ${count > 1 ? i18n.t('general:errors') : i18n.t('general:error')}`}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FieldDiffContainer/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-diff {
    &__locale-label {
      background: var(--theme-elevation-100);
      border-radius: var(--style-radius-s);
      padding: calc(var(--base) * 0.2);
      // border-radius: $style-radius-m;
      [dir='ltr'] & {
        margin-right: calc(var(--base) * 0.25);
      }
      [dir='rtl'] & {
        margin-left: calc(var(--base) * 0.25);
      }
    }

    &-container {
      position: relative;

      // Vertical separator line - not needed anymore, as the parent version view container adds a vertical line that spans the entire height of the container.
      /*
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--left-offset);
      width: 1px;
      background-color: var(--theme-elevation-100);
      transform: translateX(-50%); // Center the line
    }*/
    }

    &-content {
      display: grid;
      // Need to use 50% 50% so that we can apply overflow-x without the column shrinking to the content width.
      // Need -base(0.5) to enure the gap is center aligned - this is required when using 50% over 1fr.
      grid-template-columns: calc(50% - base(0.5)) calc(50% - base(0.5));
      gap: base(1);
      background: var(--theme-elevation-50);
      padding: base(0.5);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FieldDiffContainer/index.tsx

```typescript
import type { LabelFunction, StaticLabel } from 'payload'

import './index.scss'

import { getTranslation, type I18nClient } from '@payloadcms/translations'

import { FieldDiffLabel } from '../FieldDiffLabel/index.js'

const baseClass = 'field-diff'

export const FieldDiffContainer: React.FC<{
  className?: string
  From: React.ReactNode
  i18n: I18nClient
  label: {
    label?: false | LabelFunction | StaticLabel
    locale?: string
  }
  nestingLevel?: number
  To: React.ReactNode
}> = (args) => {
  const {
    className,
    From,
    i18n,
    label: { label, locale },
    nestingLevel = 0,
    To,
  } = args

  return (
    <div
      className={`${baseClass}-container${className ? ` ${className}` : ''} nested-level-${nestingLevel}`}
      style={
        nestingLevel
          ? ({
              // Need to use % instead of fr, as calc() doesn't work with fr when this is used in gridTemplateColumns
              '--left-offset': `calc(50%  - (${nestingLevel} * calc( calc(var(--base)* 0.5) - 2.5px  )))`,
            } as React.CSSProperties)
          : ({
              '--left-offset': '50%',
            } as React.CSSProperties)
      }
    >
      <FieldDiffLabel>
        {locale && <span className={`${baseClass}__locale-label`}>{locale}</span>}
        {typeof label !== 'function' && getTranslation(label || '', i18n)}
      </FieldDiffLabel>
      <div
        className={`${baseClass}-content`}
        style={
          nestingLevel
            ? {
                gridTemplateColumns: `calc(var(--left-offset) - calc(var(--base)*0.5) )     calc(50% - calc(var(--base)*0.5) + calc(50% - var(--left-offset)))`,
              }
            : undefined
        }
      >
        {From}
        {To}
      </div>
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FieldDiffLabel/index.scss

```text
@layer payload-default {
  .field-diff-label {
    margin-bottom: calc(var(--base) * 0.35);
    font-weight: 600;
    display: flex;
    flex-direction: row;
    height: 100%;
    align-items: center;
    line-height: normal;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FieldDiffLabel/index.tsx
Signals: React

```typescript
import React from 'react'

import './index.scss'

const baseClass = 'field-diff-label'

export const FieldDiffLabel: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className={baseClass}>{children}</div>
)
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/FieldSelect/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  .field-select {
    margin-bottom: base(1);
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/FieldSelect/index.tsx
Signals: React

```typescript
'use client'
import type { ClientField, FormState, SanitizedFieldPermissions } from 'payload'

import React, { useState } from 'react'

import type { FieldAction } from '../../forms/Form/types.js'
import type { FieldOption } from './reduceFieldOptions.js'

import { FieldLabel } from '../../fields/FieldLabel/index.js'
import { useForm } from '../../forms/Form/context.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { filterOutUploadFields } from '../../utilities/filterOutUploadFields.js'
import { ReactSelect } from '../ReactSelect/index.js'
import { reduceFieldOptions } from './reduceFieldOptions.js'
import './index.scss'

const baseClass = 'field-select'

export type OnFieldSelect = ({
  dispatchFields,
  formState,
  selected,
}: {
  dispatchFields: React.Dispatch<FieldAction>
  formState: FormState
  selected: FieldOption[]
}) => void

export type FieldSelectProps = {
  readonly fields: ClientField[]
  readonly onChange: OnFieldSelect
  readonly permissions:
    | {
        [fieldName: string]: SanitizedFieldPermissions
      }
    | SanitizedFieldPermissions
}

export const FieldSelect: React.FC<FieldSelectProps> = ({ fields, onChange, permissions }) => {
  const { t } = useTranslation()
  const { dispatchFields, getFields } = useForm()

  const [options] = useState<FieldOption[]>(() =>
    reduceFieldOptions({
      fields: filterOutUploadFields(fields),
      formState: getFields(),
      permissions,
    }),
  )

  return (
    <div className={baseClass}>
      <FieldLabel label={t('fields:selectFieldsToEdit')} />
      <ReactSelect
        getOptionValue={(option) => {
          if (typeof option.value === 'object' && 'path' in option.value) {
            return String(option.value.path)
          }
          return String(option.value)
        }}
        isMulti
        onChange={(selected: FieldOption[]) =>
          onChange({ dispatchFields, formState: getFields(), selected })
        }
        options={options}
      />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: reduceFieldOptions.ts]---
Location: payload-main/packages/ui/src/elements/FieldSelect/reduceFieldOptions.ts

```typescript
import type { ClientField, FormState, SanitizedFieldPermissions } from 'payload'

import {
  fieldAffectsData,
  fieldHasSubFields,
  fieldIsHiddenOrDisabled,
  getFieldPermissions,
} from 'payload/shared'

import { createNestedClientFieldPath } from '../../forms/Form/createNestedClientFieldPath.js'
import { combineFieldLabel } from '../../utilities/combineFieldLabel.js'

export type SelectedField = {
  field: ClientField
  fieldPermissions: SanitizedFieldPermissions
  path: string
}

export type FieldOption = {
  label: React.ReactNode
  value: SelectedField
}

export const ignoreFromBulkEdit = (field: ClientField): boolean =>
  Boolean(
    (fieldAffectsData(field) || field.type === 'ui') &&
      (field.admin.disableBulkEdit ||
        field.unique ||
        fieldIsHiddenOrDisabled(field) ||
        ('readOnly' in field && field.readOnly)),
  )

export const reduceFieldOptions = ({
  fields,
  formState,
  labelPrefix = null,
  parentPath = '',
  path = '',
  permissions,
}: {
  readonly fields: ClientField[]
  readonly formState?: FormState
  readonly labelPrefix?: React.ReactNode
  readonly parentPath?: string
  readonly path?: string
  readonly permissions:
    | {
        [fieldName: string]: SanitizedFieldPermissions
      }
    | SanitizedFieldPermissions
}): FieldOption[] => {
  if (!fields) {
    return []
  }

  const CustomLabel = formState?.[path]?.customComponents?.Label

  return fields?.reduce((fieldsToUse, field) => {
    const {
      operation: hasOperationPermission,
      permissions: fieldPermissions,
      read: hasReadPermission,
    } = getFieldPermissions({
      field,
      operation: 'update',
      parentName: parentPath?.includes('.')
        ? parentPath.split('.')[parentPath.split('.').length - 1]
        : parentPath,
      permissions,
    })

    // escape for a variety of reasons, include ui fields as they have `name`.
    if (
      (fieldAffectsData(field) || field.type === 'ui') &&
      (field.admin?.disableBulkEdit ||
        field.unique ||
        fieldIsHiddenOrDisabled(field) ||
        ('readOnly' in field && field.readOnly) ||
        !hasOperationPermission ||
        !hasReadPermission)
    ) {
      return fieldsToUse
    }

    if (!(field.type === 'array' || field.type === 'blocks') && fieldHasSubFields(field)) {
      return [
        ...fieldsToUse,
        ...reduceFieldOptions({
          fields: field.fields,
          labelPrefix: combineFieldLabel({ CustomLabel, field, prefix: labelPrefix }),
          parentPath: path,
          path: createNestedClientFieldPath(path, field),
          permissions: fieldPermissions,
        }),
      ]
    }

    if (field.type === 'tabs' && 'tabs' in field) {
      return [
        ...fieldsToUse,
        ...field.tabs.reduce((tabFields, tab) => {
          if ('fields' in tab) {
            const isNamedTab = 'name' in tab && tab.name
            return [
              ...tabFields,
              ...reduceFieldOptions({
                fields: tab.fields,
                labelPrefix,
                parentPath: path,
                path: isNamedTab ? createNestedClientFieldPath(path, field) : path,
                permissions: fieldPermissions,
              }),
            ]
          }
        }, []),
      ]
    }

    const formattedField: FieldOption = {
      label: combineFieldLabel({ CustomLabel, field, prefix: labelPrefix }),
      value: {
        field,
        fieldPermissions: fieldPermissions as SanitizedFieldPermissions,
        path: createNestedClientFieldPath(path, field),
      },
    }

    return [...fieldsToUse, formattedField]
  }, [])
}
```

--------------------------------------------------------------------------------

````
