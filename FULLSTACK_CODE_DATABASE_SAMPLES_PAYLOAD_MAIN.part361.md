---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 361
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 361 of 695)

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
Location: payload-main/packages/ui/src/elements/BulkUpload/FormsManager/index.tsx
Signals: React

```typescript
'use client'

import type {
  CollectionSlug,
  Data,
  DocumentSlots,
  FormState,
  JsonObject,
  SanitizedDocumentPermissions,
  UploadEdits,
} from 'payload'

import { useModal } from '@faceless-ui/modal'
import * as qs from 'qs-esm'
import React from 'react'
import { toast } from 'sonner'

import type { State } from './reducer.js'

import { fieldReducer } from '../../../forms/Form/fieldReducer.js'
import { useEffectEvent } from '../../../hooks/useEffectEvent.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useLocale } from '../../../providers/Locale/index.js'
import { useServerFunctions } from '../../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { useUploadHandlers } from '../../../providers/UploadHandlers/index.js'
import { hasSavePermission as getHasSavePermission } from '../../../utilities/hasSavePermission.js'
import { LoadingOverlay } from '../../Loading/index.js'
import { useLoadingOverlay } from '../../LoadingOverlay/index.js'
import { useBulkUpload } from '../index.js'
import { createFormData } from './createFormData.js'
import { formsManagementReducer } from './reducer.js'

type FormsManagerContext = {
  readonly activeIndex: State['activeIndex']
  readonly addFiles: (filelist: FileList) => Promise<void>
  readonly bulkUpdateForm: (
    updatedFields: Record<string, unknown>,
    afterStateUpdate?: () => void,
  ) => Promise<void>
  readonly collectionSlug: string
  readonly docPermissions?: SanitizedDocumentPermissions
  readonly documentSlots: DocumentSlots
  readonly forms: State['forms']
  getFormDataRef: React.RefObject<() => Data>
  readonly hasPublishPermission: boolean
  readonly hasSavePermission: boolean
  readonly hasSubmitted: boolean
  readonly isInitializing: boolean
  readonly removeFile: (index: number) => void
  readonly resetUploadEdits?: () => void
  readonly saveAllDocs: ({ overrides }?: { overrides?: Record<string, unknown> }) => Promise<void>
  readonly setActiveIndex: (index: number) => void
  readonly setFormTotalErrorCount: ({
    errorCount,
    index,
  }: {
    errorCount: number
    index: number
  }) => void
  readonly totalErrorCount?: number
  readonly updateUploadEdits: (args: UploadEdits) => void
}

const Context = React.createContext<FormsManagerContext>({
  activeIndex: 0,
  addFiles: () => Promise.resolve(),
  bulkUpdateForm: () => null,
  collectionSlug: '',
  docPermissions: undefined,
  documentSlots: {},
  forms: [],
  getFormDataRef: { current: () => ({}) },
  hasPublishPermission: false,
  hasSavePermission: false,
  hasSubmitted: false,
  isInitializing: false,
  removeFile: () => {},
  saveAllDocs: () => Promise.resolve(),
  setActiveIndex: () => 0,
  setFormTotalErrorCount: () => {},
  totalErrorCount: 0,
  updateUploadEdits: () => {},
})

const initialState: State = {
  activeIndex: 0,
  forms: [],
  totalErrorCount: 0,
}

export type InitialForms = Array<{
  file: File
  formID?: string
  initialState?: FormState | null
}>

type FormsManagerProps = {
  readonly children: React.ReactNode
}

export function FormsManagerProvider({ children }: FormsManagerProps) {
  const { config } = useConfig()
  const {
    routes: { api },
    serverURL,
  } = config
  const { code } = useLocale()
  const { i18n, t } = useTranslation()

  const { getDocumentSlots, getFormState } = useServerFunctions()
  const { getUploadHandler } = useUploadHandlers()

  const [documentSlots, setDocumentSlots] = React.useState<DocumentSlots>({})
  const [hasSubmitted, setHasSubmitted] = React.useState(false)
  const [docPermissions, setDocPermissions] = React.useState<SanitizedDocumentPermissions>()
  const [hasSavePermission, setHasSavePermission] = React.useState(false)
  const [hasPublishPermission, setHasPublishPermission] = React.useState(false)
  const [hasInitializedState, setHasInitializedState] = React.useState(false)
  const [hasInitializedDocPermissions, setHasInitializedDocPermissions] = React.useState(false)
  const [isInitializing, setIsInitializing] = React.useState(false)
  const [state, dispatch] = React.useReducer(formsManagementReducer, initialState)
  const { activeIndex, forms, totalErrorCount } = state

  const formsRef = React.useRef(forms)
  formsRef.current = forms

  const { toggleLoadingOverlay } = useLoadingOverlay()
  const { closeModal } = useModal()
  const {
    collectionSlug,
    drawerSlug,
    initialFiles,
    initialForms,
    onSuccess,
    setInitialFiles,
    setInitialForms,
    setSuccessfullyUploaded,
  } = useBulkUpload()

  const [isUploading, setIsUploading] = React.useState(false)
  const [loadingText, setLoadingText] = React.useState('')

  const hasInitializedWithFiles = React.useRef(false)
  const initialStateRef = React.useRef<FormState>(null)
  const getFormDataRef = React.useRef<() => Data>(() => ({}))

  const actionURL = `${serverURL}${api}/${collectionSlug}`

  const initializeSharedDocPermissions = React.useCallback(async () => {
    const params = {
      locale: code || undefined,
    }

    const docAccessURL = `/${collectionSlug}/access`
    const res = await fetch(`${serverURL}${api}${docAccessURL}?${qs.stringify(params)}`, {
      credentials: 'include',
      headers: {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/json',
      },
      method: 'post',
    })

    const json: SanitizedDocumentPermissions = await res.json()
    const publishedAccessJSON = await fetch(
      `${serverURL}${api}${docAccessURL}?${qs.stringify(params)}`,
      {
        body: JSON.stringify({
          _status: 'published',
        }),
        credentials: 'include',
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    ).then((res) => res.json())

    setDocPermissions(json)

    setHasSavePermission(
      getHasSavePermission({
        collectionSlug,
        docPermissions: json,
        isEditing: false,
      }),
    )

    setHasPublishPermission(publishedAccessJSON?.update)
    setHasInitializedDocPermissions(true)
  }, [api, code, collectionSlug, i18n.language, serverURL])

  const initializeSharedFormState = React.useCallback(
    async (abortController?: AbortController) => {
      if (abortController?.signal) {
        abortController.abort('aborting previous fetch for initial form state without files')
      }

      // FETCH AND SET THE DOCUMENT SLOTS HERE!
      const documentSlots = await getDocumentSlots({ collectionSlug })
      setDocumentSlots(documentSlots)

      try {
        const { state: formStateWithoutFiles } = await getFormState({
          collectionSlug,
          docPermissions,
          docPreferences: { fields: {} },
          locale: code,
          operation: 'create',
          renderAllFields: true,
          schemaPath: collectionSlug,
          skipValidation: true,
        })
        initialStateRef.current = formStateWithoutFiles
        setHasInitializedState(true)
      } catch (_err) {
        // swallow error
      }
    },
    [getDocumentSlots, collectionSlug, getFormState, docPermissions, code],
  )

  const setActiveIndex: FormsManagerContext['setActiveIndex'] = React.useCallback(
    (index: number) => {
      const currentFormsData = getFormDataRef.current()
      dispatch({
        type: 'REPLACE',
        state: {
          activeIndex: index,
          forms: forms.map((form, i) => {
            if (i === activeIndex) {
              return {
                errorCount: form.errorCount,
                formID: form.formID,
                formState: currentFormsData,
                uploadEdits: form.uploadEdits,
              }
            }
            return form
          }),
        },
      })
    },
    [forms, activeIndex],
  )

  const addFiles = React.useCallback(
    async (files: FileList) => {
      if (forms.length) {
        // save the state of the current form before adding new files
        dispatch({
          type: 'UPDATE_FORM',
          errorCount: forms[activeIndex].errorCount,
          formState: getFormDataRef.current(),
          index: activeIndex,
        })
      }

      toggleLoadingOverlay({ isLoading: true, key: 'addingDocs' })
      if (!hasInitializedState) {
        await initializeSharedFormState()
      }
      dispatch({
        type: 'ADD_FORMS',
        forms: Array.from(files).map((file) => ({
          file,
          initialState: initialStateRef.current,
        })),
      })
      toggleLoadingOverlay({ isLoading: false, key: 'addingDocs' })
    },
    [initializeSharedFormState, hasInitializedState, toggleLoadingOverlay, activeIndex, forms],
  )

  const addFilesEffectEvent = useEffectEvent(addFiles)

  const addInitialForms = useEffectEvent(async (initialForms: InitialForms) => {
    toggleLoadingOverlay({ isLoading: true, key: 'addingDocs' })

    if (!hasInitializedState) {
      await initializeSharedFormState()
    }

    dispatch({
      type: 'ADD_FORMS',
      forms: initialForms.map((form) => ({
        ...form,
        initialState: form?.initialState || initialStateRef.current,
      })),
    })

    toggleLoadingOverlay({ isLoading: false, key: 'addingDocs' })
  })

  const removeFile: FormsManagerContext['removeFile'] = React.useCallback((index) => {
    dispatch({ type: 'REMOVE_FORM', index })
  }, [])

  const setFormTotalErrorCount: FormsManagerContext['setFormTotalErrorCount'] = React.useCallback(
    ({ errorCount, index }) => {
      dispatch({
        type: 'UPDATE_ERROR_COUNT',
        count: errorCount,
        index,
      })
    },
    [],
  )

  const saveAllDocs: FormsManagerContext['saveAllDocs'] = React.useCallback(
    async ({ overrides } = {}) => {
      const currentFormsData = getFormDataRef.current()
      const currentForms = [...forms]
      currentForms[activeIndex] = {
        errorCount: currentForms[activeIndex].errorCount,
        formID: currentForms[activeIndex].formID,
        formState: currentFormsData,
        uploadEdits: currentForms[activeIndex].uploadEdits,
      }
      const newDocs: Array<{
        collectionSlug: CollectionSlug
        doc: JsonObject
        /**
         * ID of the form that created this document
         */
        formID: string
      }> = []

      setIsUploading(true)

      for (let i = 0; i < currentForms.length; i++) {
        try {
          const form = currentForms[i]
          const fileValue = form.formState?.file?.value

          // Skip upload if file is missing a filename
          if (
            fileValue &&
            typeof fileValue === 'object' &&
            'name' in fileValue &&
            (!fileValue.name || fileValue.name === '')
          ) {
            currentForms[i] = {
              ...currentForms[i],
              errorCount: 1,
            }
            continue
          }

          setLoadingText(t('general:uploadingBulk', { current: i + 1, total: currentForms.length }))

          const actionURLWithParams = `${actionURL}${qs.stringify(
            {
              locale: code,
              uploadEdits: form?.uploadEdits || undefined,
            },
            {
              addQueryPrefix: true,
            },
          )}`

          const req = await fetch(actionURLWithParams, {
            body: await createFormData(
              form.formState,
              overrides,
              collectionSlug,
              getUploadHandler({ collectionSlug }),
            ),
            credentials: 'include',
            method: 'POST',
          })

          const json = await req.json()

          if (req.status === 201 && json?.doc) {
            newDocs.push({
              collectionSlug,
              doc: json.doc,
              formID: form.formID,
            })
          }

          // should expose some sort of helper for this
          const [fieldErrors, nonFieldErrors] = (json?.errors || []).reduce(
            ([fieldErrs, nonFieldErrs], err) => {
              const newFieldErrs: any[] = []
              const newNonFieldErrs: any[] = []

              if (err?.message) {
                newNonFieldErrs.push(err)
              }

              if (Array.isArray(err?.data?.errors)) {
                err.data?.errors.forEach((dataError) => {
                  if (dataError?.path) {
                    newFieldErrs.push(dataError)
                  } else {
                    newNonFieldErrs.push(dataError)
                  }
                })
              }

              return [
                [...fieldErrs, ...newFieldErrs],
                [...nonFieldErrs, ...newNonFieldErrs],
              ]
            },
            [[], []],
          )

          currentForms[i] = {
            errorCount: fieldErrors.length,
            formID: currentForms[i].formID,
            formState: fieldReducer(currentForms[i].formState, {
              type: 'ADD_SERVER_ERRORS',
              errors: fieldErrors,
            }),
          }

          if (req.status === 413 || req.status === 400) {
            // file too large
            currentForms[i] = {
              ...currentForms[i],
              errorCount: currentForms[i].errorCount + 1,
            }

            toast.error(nonFieldErrors[0]?.message)
          }
        } catch (_) {
          // swallow
        }
      }

      setHasSubmitted(true)
      setLoadingText('')
      setIsUploading(false)

      const remainingForms = []

      currentForms.forEach(({ errorCount }, i) => {
        if (errorCount) {
          remainingForms.push(currentForms[i])
        }
      })

      const successCount = Math.max(0, currentForms.length - remainingForms.length)
      const errorCount = currentForms.length - successCount

      if (successCount) {
        toast.success(`Successfully saved ${successCount} files`)
        setSuccessfullyUploaded(true)

        if (typeof onSuccess === 'function') {
          onSuccess(newDocs, errorCount)
        }
      }

      if (errorCount) {
        toast.error(`Failed to save ${errorCount} files`)
      } else {
        closeModal(drawerSlug)
      }

      dispatch({
        type: 'REPLACE',
        state: {
          activeIndex: 0,
          forms: remainingForms,
          totalErrorCount: remainingForms.reduce((acc, { errorCount }) => acc + errorCount, 0),
        },
      })

      if (remainingForms.length === 0) {
        setInitialFiles(undefined)
        setInitialForms(undefined)
      }
    },
    [
      forms,
      activeIndex,
      t,
      actionURL,
      code,
      collectionSlug,
      getUploadHandler,
      onSuccess,
      closeModal,
      setSuccessfullyUploaded,
      drawerSlug,
      setInitialFiles,
      setInitialForms,
    ],
  )

  const bulkUpdateForm = React.useCallback(
    async (updatedFields: Record<string, unknown>, afterStateUpdate?: () => void) => {
      for (let i = 0; i < forms.length; i++) {
        Object.entries(updatedFields).forEach(([path, value]) => {
          if (forms[i].formState[path]) {
            forms[i].formState[path].value = value

            dispatch({
              type: 'UPDATE_FORM',
              errorCount: forms[i].errorCount,
              formState: forms[i].formState,
              index: i,
            })
          }
        })

        if (typeof afterStateUpdate === 'function') {
          afterStateUpdate()
        }

        if (hasSubmitted) {
          const { state } = await getFormState({
            collectionSlug,
            docPermissions,
            docPreferences: null,
            formState: forms[i].formState,
            operation: 'create',
            schemaPath: collectionSlug,
          })

          const newFormErrorCount = Object.values(state).reduce(
            (acc, value) => (value?.valid === false ? acc + 1 : acc),
            0,
          )

          dispatch({
            type: 'UPDATE_FORM',
            errorCount: newFormErrorCount,
            formState: state,
            index: i,
          })
        }
      }
    },
    [collectionSlug, docPermissions, forms, getFormState, hasSubmitted],
  )

  const updateUploadEdits = React.useCallback<FormsManagerContext['updateUploadEdits']>(
    (uploadEdits) => {
      dispatch({
        type: 'UPDATE_FORM',
        errorCount: forms[activeIndex].errorCount,
        formState: forms[activeIndex].formState,
        index: activeIndex,
        uploadEdits,
      })
    },
    [activeIndex, forms],
  )

  const resetUploadEdits = React.useCallback<FormsManagerContext['resetUploadEdits']>(() => {
    dispatch({
      type: 'REPLACE',
      state: {
        forms: forms.map((form) => ({
          ...form,
          uploadEdits: {},
        })),
      },
    })
  }, [forms])

  React.useEffect(() => {
    if (!collectionSlug) {
      return
    }
    if (!hasInitializedState) {
      void initializeSharedFormState()
    }

    if (!hasInitializedDocPermissions) {
      void initializeSharedDocPermissions()
    }

    if (initialFiles || initialForms) {
      if (!hasInitializedState || !hasInitializedDocPermissions) {
        setIsInitializing(true)
      } else {
        setIsInitializing(false)
      }
    }

    if (
      hasInitializedState &&
      (initialForms?.length || initialFiles?.length) &&
      !hasInitializedWithFiles.current
    ) {
      if (initialForms?.length) {
        void addInitialForms(initialForms)
      }
      if (initialFiles?.length) {
        void addFilesEffectEvent(initialFiles)
      }
      hasInitializedWithFiles.current = true
    }
    return
  }, [
    initialFiles,
    initializeSharedFormState,
    initializeSharedDocPermissions,
    collectionSlug,
    hasInitializedState,
    hasInitializedDocPermissions,
    initialForms,
  ])

  return (
    <Context
      value={{
        activeIndex: state.activeIndex,
        addFiles,
        bulkUpdateForm,
        collectionSlug,
        docPermissions,
        documentSlots,
        forms,
        getFormDataRef,
        hasPublishPermission,
        hasSavePermission,
        hasSubmitted,
        isInitializing,
        removeFile,
        resetUploadEdits,
        saveAllDocs,
        setActiveIndex,
        setFormTotalErrorCount,
        totalErrorCount,
        updateUploadEdits,
      }}
    >
      {isUploading && (
        <LoadingOverlay
          animationDuration="250ms"
          loadingText={loadingText}
          overlayType="fullscreen"
          show
        />
      )}
      {children}
    </Context>
  )
}

export function useFormsManager() {
  return React.use(Context)
}
```

--------------------------------------------------------------------------------

---[FILE: reducer.ts]---
Location: payload-main/packages/ui/src/elements/BulkUpload/FormsManager/reducer.ts

```typescript
import type { FormState, UploadEdits } from 'payload'

import { v4 as uuidv4 } from 'uuid'

import type { InitialForms } from './index.js'

export type State = {
  activeIndex: number
  forms: {
    errorCount: number
    formID: string
    formState: FormState
    uploadEdits?: UploadEdits
  }[]
  totalErrorCount: number
}

type Action =
  | {
      count: number
      index: number
      type: 'UPDATE_ERROR_COUNT'
    }
  | {
      errorCount: number
      formState: FormState
      index: number
      type: 'UPDATE_FORM'
      updatedFields?: Record<string, unknown>
      uploadEdits?: UploadEdits
    }
  | {
      forms: InitialForms
      type: 'ADD_FORMS'
    }
  | {
      index: number
      type: 'REMOVE_FORM'
    }
  | {
      index: number
      type: 'SET_ACTIVE_INDEX'
    }
  | {
      state: Partial<State>
      type: 'REPLACE'
    }

export function formsManagementReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_FORMS': {
      const newForms: State['forms'] = []
      for (let i = 0; i < action.forms.length; i++) {
        newForms[i] = {
          errorCount: 0,
          formID: action.forms[i].formID ?? (crypto.randomUUID ? crypto.randomUUID() : uuidv4()),
          formState: {
            ...(action.forms[i].initialState || {}),
            file: {
              initialValue: action.forms[i].file,
              valid: true,
              value: action.forms[i].file,
            },
          },
          uploadEdits: {},
        }
      }

      return {
        ...state,
        activeIndex: 0,
        forms: [...newForms, ...state.forms],
      }
    }
    case 'REMOVE_FORM': {
      const remainingFormStates = [...state.forms]
      const [removedForm] = remainingFormStates.splice(action.index, 1)

      const affectedByShift = state.activeIndex >= action.index
      const nextIndex =
        state.activeIndex === action.index
          ? action.index
          : affectedByShift
            ? state.activeIndex - 1
            : state.activeIndex
      const boundedActiveIndex = Math.min(remainingFormStates.length - 1, nextIndex)

      return {
        ...state,
        activeIndex: affectedByShift ? boundedActiveIndex : state.activeIndex,
        forms: remainingFormStates,
        totalErrorCount: state.totalErrorCount - removedForm.errorCount,
      }
    }
    case 'REPLACE': {
      return {
        ...state,
        ...action.state,
      }
    }
    case 'SET_ACTIVE_INDEX': {
      return {
        ...state,
        activeIndex: action.index,
      }
    }
    case 'UPDATE_ERROR_COUNT': {
      const forms = [...state.forms]
      forms[action.index].errorCount = action.count

      return {
        ...state,
        forms,
        totalErrorCount: state.forms.reduce((acc, form) => acc + form.errorCount, 0),
      }
    }
    case 'UPDATE_FORM': {
      const updatedForms = [...state.forms]
      updatedForms[action.index].errorCount = action.errorCount

      // Merge the existing formState with the new formState
      updatedForms[action.index] = {
        ...updatedForms[action.index],
        formState: {
          ...updatedForms[action.index].formState,
          ...action.formState,
        },
        uploadEdits: {
          ...updatedForms[action.index].uploadEdits,
          ...action.uploadEdits,
        },
      }

      return {
        ...state,
        forms: updatedForms,
        totalErrorCount: state.forms.reduce((acc, form) => acc + form.errorCount, 0),
      }
    }
    default: {
      return state
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/BulkUpload/Header/index.scss

```text
@import '../../../scss/styles.scss';

@layer payload-default {
  .bulk-upload--drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--base) * 2.5) var(--gutter-h);
    height: 48px;
    border-bottom: 1px solid var(--theme-border-color);

    h2 {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/BulkUpload/Header/index.tsx
Signals: React

```typescript
'use client'

import React from 'react'

import { DrawerCloseButton } from '../DrawerCloseButton/index.js'
import './index.scss'

const baseClass = 'bulk-upload--drawer-header'

type Props = {
  readonly onClose: () => void
  readonly title: string
}
export function DrawerHeader({ onClose, title }: Props) {
  return (
    <div className={baseClass}>
      <h2 title={title}>{title}</h2>
      <DrawerCloseButton onClick={onClose} />
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/Button/index.scss

```text
@import '../../scss/styles.scss';

@layer payload-default {
  a.btn {
    display: inline-block;
  }

  .btn--withPopup {
    margin-block: 4px;
    .btn {
      margin: 0;
    }
  }

  .btn {
    --btn-font-weight: normal;
    * {
      pointer-events: none;
    }

    // button aesthetic styles
    &--style-primary {
      --color: var(--theme-elevation-0);
      --bg-color: var(--theme-elevation-800);
      --box-shadow: none;
      --hover-bg: var(--theme-elevation-600);
      --hover-color: var(--color);

      &.btn--disabled {
        --bg-color: var(--theme-elevation-200);
        --color: var(--theme-elevation-800);
        --hover-bg: var(--bg-color);
        --hover-color: var(--color);
      }
    }

    &--style-secondary {
      --color: var(--theme-text);
      --bg-color: transparent;
      --box-shadow: inset 0 0 0 1px var(--theme-elevation-800);
      --hover-color: var(--theme-elevation-600);
      --hover-box-shadow: inset 0 0 0 1px var(--theme-elevation-400);

      &.btn--disabled {
        --color: var(--theme-elevation-200);
        --box-shadow: inset 0 0 0 1px var(--theme-elevation-200);
        --hover-box-shadow: inset 0 0 0 1px var(--theme-elevation-200);
        --hover-color: var(--color);
      }
    }

    &--style-pill {
      --bg-color: var(--theme-elevation-150);
      --color: var(--theme-elevation-800);
      --hover-color: var(--theme-elevation-800);
      --hover-bg: var(--theme-elevation-100);

      &.btn--disabled {
        --color: var(--theme-elevation-600);
        --hover-bg: var(--bg-color);
        --hover-color: var(--color);
      }
    }

    // colors and padding are mixed on this class
    &--style-icon-label,
    &--style-icon-label.btn--icon-position-left,
    &--style-icon-label.btn--icon-position-right {
      padding: 0;
      font-weight: 600;
      --color: var(--theme-text);
      --bg-color: transparent;
      --hover-color: var(--theme-elevation-600);

      &.btn--disabled {
        --color: var(--theme-elevation-200);
        --hover-color: var(--color);
      }

      .btn__content {
        --btn-icon-content-gap: calc(var(--base) * 0.4);
      }
    }

    &--style-subtle {
      --color: var(--theme-text);
      --bg-color: var(--theme-elevation-100);
      --hover-bg: var(--theme-elevation-150);
      --box-shadow: inset 0 0 0 1px var(--theme-elevation-200);
      --hover-box-shadow: inset 0 0 0 1px var(--theme-elevation-250);

      &.btn--disabled {
        --color: var(--theme-elevation-450);
        --hover-box-shadow: var(--box-shadow);
        --hover-bg: var(--bg-color);
        --hover-color: var(--color);
      }
    }

    &--style-tab {
      --bg-color: transparent;
      --hover-bg: var(--theme-elevation-50);
      --color: var(--theme-text);
      --btn-font-weight: 500;

      &.btn--disabled {
        --btn-font-weight: 600;
        --hover-box-shadow: var(--box-shadow);
        --bg-color: var(--theme-elevation-100);
        --hover-bg: var(--bg-color);
        --hover-color: var(--color);
      }
    }
  }

  .popup--active .btn {
    background-color: var(--hover-bg);
  }

  .btn--withPopup {
    .popup-button {
      color: var(--color, inherit);
      background-color: var(--bg-color);
      box-shadow: var(--box-shadow);
      border-radius: $style-radius-m;
      align-items: center;

      html:not([dir='RTL']) & {
        border-left: 1px solid var(--theme-bg);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      html[dir='RTL'] & {
        border-right: 1px solid var(--theme-bg);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:hover,
      &:focus-visible,
      &:focus,
      &:active {
        background-color: var(--hover-bg);
        color: var(--hover-color);
        box-shadow: var(--hover-box-shadow);
      }
    }
  }

  .btn,
  .btn--withPopup .btn {
    &:hover,
    &:focus-visible,
    &:focus,
    &:active {
      color: var(--hover-color);
      box-shadow: var(--hover-box-shadow);
      background-color: var(--hover-bg);
    }
  }

  .btn--disabled,
  .btn--disabled .btn {
    cursor: not-allowed;
  }

  .btn {
    --btn-padding-block-start: 0;
    --btn-padding-inline-end: 0;
    --btn-padding-block-end: 0;
    --btn-padding-inline-start: 0;

    --btn-icon-size: calc(var(--base) * 1.2);
    --btn-icon-border-color: currentColor;
    --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
    --btn-icon-content-gap: calc(var(--base) * 0.4);
    --margin-block: calc(var(--base) * 1.2);
    --btn-line-height: calc(var(--base) * 1.2);

    border-radius: var(--style-radius-s);
    font-size: var(--base-body-size);
    font-family: var(--font-body);
    font-weight: var(--btn-font-weight, normal);
    margin-block: var(--margin-block);
    line-height: var(--btn-line-height);
    border: 0;
    cursor: pointer;
    text-decoration: none;
    transition-property: border, color, box-shadow, background;
    transition-duration: 100ms;
    transition-timing-function: cubic-bezier(0, 0.2, 0.2, 1);
    padding: var(--btn-padding-block-start) var(--btn-padding-inline-end)
      var(--btn-padding-block-end) var(--btn-padding-inline-start);
    color: var(--color, inherit);
    background-color: var(--bg-color, transparent);
    box-shadow: var(--box-shadow, none);

    &__icon {
      width: 100%;
      height: 100%;

      .stroke {
        stroke: var(--color, currentColor);
        fill: none;
      }

      .fill {
        fill: var(--color, currentColor);
      }
    }

    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__icon {
      width: var(--btn-icon-size);
      height: var(--btn-icon-size);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--btn-icon-border-color);
      border-radius: 100%;
      padding: var(--btn-icon-padding);
      color: inherit;

      svg {
        width: 100%;
        height: 100%;
      }

      &.btn--size-small {
        padding: calc(var(--base) * (0.2));
      }
    }

    &--withPopup {
      display: flex;
    }

    &--has-tooltip {
      position: relative;
    }

    &--icon {
      .btn__content {
        gap: var(--btn-icon-content-gap);
      }
    }

    &--icon-style-without-border,
    &--icon-style-none {
      --btn-icon-border-color: transparent;
    }

    &--icon-position-left {
      .btn__content {
        flex-direction: row-reverse;
      }
    }

    &--size-small {
      --btn-icon-size: calc(var(--base) * 0.9);
      // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      --btn-icon-content-gap: calc(var(--base) * 0.2);
      --btn-padding-block-start: 0;
      --btn-padding-inline-end: calc(var(--base) * 0.4);
      --btn-padding-inline-start: calc(var(--base) * 0.4);
      --btn-padding-block-end: 0;

      &.btn--icon-position-left {
        --btn-padding-inline-start: calc(var(--base) * 0.3);
      }

      &.btn--icon-position-right {
        --btn-padding-inline-end: calc(var(--base) * 0.3);
      }

      &.btn--icon-style-with-border {
        // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      }
    }

    &--size-xsmall {
      --btn-icon-size: calc(var(--base) * 0.8);
      // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      --btn-icon-content-gap: calc(var(--base) * 0.2);
      --btn-padding-block-start: 0;
      --btn-padding-inline-end: calc(var(--base) * 0.3);
      --btn-padding-inline-start: calc(var(--base) * 0.3);
      --btn-padding-block-end: 0;
      &.btn--icon-position-left {
        --btn-padding-inline-start: calc(var(--base) * 0.2);
      }
      &.btn--icon-position-right {
        --btn-padding-inline-end: calc(var(--base) * 0.2);
      }
      &.btn--icon-style-with-border {
        // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      }
    }

    &--size-medium {
      // --btn-icon-padding: 0px;
      --btn-icon-size: calc(var(--base) * 1.2);
      --btn-icon-content-gap: calc(var(--base) * 0.2);
      --btn-padding-block-start: calc(var(--base) * 0.2);
      --btn-padding-inline-end: calc(var(--base) * 0.6);
      --btn-padding-block-end: calc(var(--base) * 0.2);
      --btn-padding-inline-start: calc(var(--base) * 0.6);

      &.btn--icon-position-left {
        --btn-padding-inline-start: calc(var(--base) * 0.4);
      }

      &.btn--icon-position-right {
        --btn-padding-inline-end: calc(var(--base) * 0.4);
      }

      &.btn--icon-style-with-border {
        // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      }
    }

    &--size-large {
      // --btn-icon-padding: 0px;
      --btn-icon-size: calc(var(--base) * 1.2);
      --btn-icon-content-gap: calc(var(--base) * 0.4);
      --btn-padding-block-start: calc(var(--base) * 0.4);
      --btn-padding-inline-end: calc(var(--base) * 0.8);
      --btn-padding-inline-start: calc(var(--base) * 0.8);
      --btn-padding-block-end: calc(var(--base) * 0.4);

      &.btn--icon-position-left {
        --btn-padding-inline-start: calc(var(--base) * 0.6);
      }

      &.btn--icon-position-right {
        --btn-padding-inline-end: calc(var(--base) * 0.6);
      }

      &.btn--icon-style-with-border {
        // --btn-icon-padding: 0px; // This will be needed when we make icons go edge to edge instead of having built in padding in the svg code
      }
    }

    &--withPopup .btn {
      html:not([dir='RTL']) & {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      html[dir='RTL'] & {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    &:focus-visible {
      outline: var(--accessibility-outline);
      outline-offset: var(--accessibility-outline-offset);
    }

    &.btn--disabled {
      cursor: not-allowed;
    }

    &--style-none {
      padding: 0;
    }

    &--no-margin {
      --margin-block: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/Button/index.tsx
Signals: React

```typescript
'use client'
import React, { Fragment, isValidElement } from 'react'

import type { Props } from './types.js'

import { ChevronIcon } from '../../icons/Chevron/index.js'
import { EditIcon } from '../../icons/Edit/index.js'
import { LinkIcon } from '../../icons/Link/index.js'
import { PlusIcon } from '../../icons/Plus/index.js'
import { SwapIcon } from '../../icons/Swap/index.js'
import { XIcon } from '../../icons/X/index.js'
import { Link } from '../Link/index.js'
import { Popup } from '../Popup/index.js'
import './index.scss'
import { Tooltip } from '../Tooltip/index.js'

const icons = {
  chevron: ChevronIcon,
  edit: EditIcon,
  link: LinkIcon,
  plus: PlusIcon,
  swap: SwapIcon,
  x: XIcon,
}

const baseClass = 'btn'

export const ButtonContents = ({ children, icon, showTooltip, tooltip }) => {
  const BuiltInIcon = icons[icon]

  return (
    <Fragment>
      {tooltip && (
        <Tooltip className={`${baseClass}__tooltip`} show={showTooltip}>
          {tooltip}
        </Tooltip>
      )}
      <span className={`${baseClass}__content`}>
        {children && <span className={`${baseClass}__label`}>{children}</span>}
        {icon && (
          <span className={`${baseClass}__icon`}>
            {isValidElement(icon) && icon}
            {BuiltInIcon && <BuiltInIcon />}
          </span>
        )}
      </span>
    </Fragment>
  )
}

export const Button: React.FC<Props> = (props) => {
  const {
    id,
    type = 'button',
    'aria-label': ariaLabel,
    buttonStyle = 'primary',
    children,
    className,
    disabled,
    el = 'button',
    enableSubMenu,
    extraButtonProps = {},
    icon,
    iconPosition = 'right',
    iconStyle = 'without-border',
    margin = true,
    newTab,
    onClick,
    onMouseDown,
    ref,
    round,
    size = 'medium',
    SubMenuPopupContent,
    to,
    tooltip,
    url,
  } = props

  const [showTooltip, setShowTooltip] = React.useState(false)

  const classes = [
    baseClass,
    className && className,
    icon && `${baseClass}--icon`,
    iconStyle && `${baseClass}--icon-style-${iconStyle}`,
    icon && !children && `${baseClass}--icon-only`,
    size && `${baseClass}--size-${size}`,
    icon && iconPosition && `${baseClass}--icon-position-${iconPosition}`,
    tooltip && `${baseClass}--has-tooltip`,
    !SubMenuPopupContent && `${baseClass}--withoutPopup`,
    !margin && `${baseClass}--no-margin`,
  ]
    .filter(Boolean)
    .join(' ')

  function handleClick(event) {
    setShowTooltip(false)
    if (type !== 'submit' && onClick) {
      event.preventDefault()
    }
    if (onClick) {
      onClick(event)
    }
  }

  const styleClasses = [
    buttonStyle && `${baseClass}--style-${buttonStyle}`,
    disabled && `${baseClass}--disabled`,
    round && `${baseClass}--round`,
    SubMenuPopupContent ? `${baseClass}--withPopup` : `${baseClass}--withoutPopup`,
  ]
    .filter(Boolean)
    .join(' ')

  const buttonProps = {
    id,
    type,
    'aria-disabled': disabled,
    'aria-label': ariaLabel,
    className: !SubMenuPopupContent ? [classes, styleClasses].join(' ') : classes,
    disabled,
    onClick: !disabled ? handleClick : undefined,
    onMouseDown: !disabled ? onMouseDown : undefined,
    onPointerEnter: tooltip ? () => setShowTooltip(true) : undefined,
    onPointerLeave: tooltip ? () => setShowTooltip(false) : undefined,
    rel: newTab ? 'noopener noreferrer' : undefined,
    target: newTab ? '_blank' : undefined,
    title: ariaLabel,
    ...extraButtonProps,
  }

  let buttonElement

  switch (el) {
    case 'anchor':
      buttonElement = (
        <a
          {...buttonProps}
          href={!disabled ? url : undefined}
          ref={ref as React.RefObject<HTMLAnchorElement>}
        >
          <ButtonContents icon={icon} showTooltip={showTooltip} tooltip={tooltip}>
            {children}
          </ButtonContents>
        </a>
      )
      break

    case 'link':
      if (disabled) {
        buttonElement = (
          <div {...buttonProps}>
            <ButtonContents icon={icon} showTooltip={showTooltip} tooltip={tooltip}>
              {children}
            </ButtonContents>
          </div>
        )
      }

      buttonElement = (
        <Link {...buttonProps} href={to || url} prefetch={false}>
          <ButtonContents icon={icon} showTooltip={showTooltip} tooltip={tooltip}>
            {children}
          </ButtonContents>
        </Link>
      )

      break

    default:
      const Tag = el // eslint-disable-line no-case-declarations

      buttonElement = (
        <Tag ref={ref} {...buttonProps}>
          <ButtonContents icon={icon} showTooltip={showTooltip} tooltip={tooltip}>
            {children}
          </ButtonContents>
        </Tag>
      )
      break
  }
  if (SubMenuPopupContent) {
    return (
      <div className={styleClasses}>
        {buttonElement}
        <Popup
          button={<ChevronIcon />}
          buttonSize={size}
          className={disabled && !enableSubMenu ? `${baseClass}--popup-disabled` : ''}
          disabled={disabled && !enableSubMenu}
          horizontalAlign="right"
          id={`${id}-popup`}
          noBackground
          render={({ close }) => SubMenuPopupContent({ close: () => close() })}
          size="large"
          verticalAlign="bottom"
        />
      </div>
    )
  }

  return buttonElement
}
```

--------------------------------------------------------------------------------

````
