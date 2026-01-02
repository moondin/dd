---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:13Z
part: 378
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 378 of 695)

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
Location: payload-main/packages/ui/src/elements/PublishButton/index.tsx
Signals: React

```typescript
'use client'

import type { PublishButtonClientProps } from 'payload'

import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { hasAutosaveEnabled, hasScheduledPublishEnabled } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback, useEffect, useState } from 'react'

import { useForm, useFormModified } from '../../forms/Form/context.js'
import { FormSubmit } from '../../forms/Submit/index.js'
import { useHotkey } from '../../hooks/useHotkey.js'
import { useConfig } from '../../providers/Config/index.js'
import { useDocumentInfo } from '../../providers/DocumentInfo/index.js'
import { useEditDepth } from '../../providers/EditDepth/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useOperation } from '../../providers/Operation/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { traverseForLocalizedFields } from '../../utilities/traverseForLocalizedFields.js'
import { PopupList } from '../Popup/index.js'
import { ScheduleDrawer } from './ScheduleDrawer/index.js'

export function PublishButton({ label: labelProp }: PublishButtonClientProps) {
  const {
    id,
    collectionSlug,
    globalSlug,
    hasPublishedDoc,
    hasPublishPermission,
    setHasPublishedDoc,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
    unpublishedVersionCount,
    uploadStatus,
  } = useDocumentInfo()

  const { config, getEntityConfig } = useConfig()
  const { submit } = useForm()
  const modified = useFormModified()
  const editDepth = useEditDepth()
  const { code: localeCode } = useLocale()
  const { isModalOpen, toggleModal } = useModal()

  const drawerSlug = `schedule-publish-${id}`

  const {
    localization,
    routes: { api },
    serverURL,
  } = config

  const { i18n, t } = useTranslation()
  const label = labelProp || t('version:publishChanges')

  const entityConfig = React.useMemo(() => {
    if (collectionSlug) {
      return getEntityConfig({ collectionSlug })
    }

    if (globalSlug) {
      return getEntityConfig({ globalSlug })
    }
  }, [collectionSlug, globalSlug, getEntityConfig])

  const hasNewerVersions = unpublishedVersionCount > 0

  const canPublish =
    hasPublishPermission &&
    (modified || hasNewerVersions || !hasPublishedDoc) &&
    uploadStatus !== 'uploading'

  const scheduledPublishEnabled = hasScheduledPublishEnabled(entityConfig)

  // If autosave is enabled the modified will always be true so only conditionally check on modified state
  const hasAutosave = hasAutosaveEnabled(entityConfig)

  const canSchedulePublish = Boolean(
    scheduledPublishEnabled &&
      hasPublishPermission &&
      (globalSlug || (collectionSlug && id)) &&
      (hasAutosave || !modified),
  )

  const [hasLocalizedFields, setHasLocalizedFields] = useState(false)

  useEffect(() => {
    const hasLocalizedField = traverseForLocalizedFields(entityConfig?.fields)
    setHasLocalizedFields(hasLocalizedField)
  }, [entityConfig?.fields])

  const isSpecificLocalePublishEnabled = localization && hasLocalizedFields && hasPublishPermission

  const operation = useOperation()

  const disabled = operation === 'update' && !modified

  const saveDraft = useCallback(async () => {
    if (disabled) {
      return
    }

    const search = `?locale=${localeCode}&depth=0&fallback-locale=null&draft=true`
    let action
    let method = 'POST'

    if (collectionSlug) {
      action = `${serverURL}${api}/${collectionSlug}${id ? `/${id}` : ''}${search}`
      if (id) {
        method = 'PATCH'
      }
    }

    if (globalSlug) {
      action = `${serverURL}${api}/globals/${globalSlug}${search}`
    }

    await submit({
      action,
      method,
      overrides: {
        _status: 'draft',
      },
      skipValidation: true,
    })
  }, [submit, collectionSlug, globalSlug, serverURL, api, localeCode, id, disabled])

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (saveDraft && hasAutosave) {
      void saveDraft()
    }
  })

  const publish = useCallback(async () => {
    if (uploadStatus === 'uploading') {
      return
    }

    const result = await submit({
      overrides: {
        _status: 'published',
      },
    })

    if (result) {
      setUnpublishedVersionCount(0)
      setMostRecentVersionIsAutosaved(false)
      setHasPublishedDoc(true)
    }
  }, [
    setHasPublishedDoc,
    submit,
    setUnpublishedVersionCount,
    uploadStatus,
    setMostRecentVersionIsAutosaved,
  ])

  const publishSpecificLocale = useCallback(
    async (locale) => {
      if (uploadStatus === 'uploading') {
        return
      }

      const params = qs.stringify({
        depth: 0,
        publishSpecificLocale: locale,
      })

      const action = `${serverURL}${api}${
        globalSlug ? `/globals/${globalSlug}` : `/${collectionSlug}${id ? `/${id}` : ''}`
      }${params ? '?' + params : ''}`

      const result = await submit({
        action,
        overrides: {
          _status: 'published',
        },
      })

      if (result) {
        setHasPublishedDoc(true)
      }
    },
    [api, collectionSlug, globalSlug, id, serverURL, setHasPublishedDoc, submit, uploadStatus],
  )

  // Publish to all locales unless there are localized fields AND defaultLocalePublishOption is 'active'
  const isDefaultPublishAll =
    !isSpecificLocalePublishEnabled ||
    (localization && localization?.defaultLocalePublishOption !== 'active')

  const activeLocale =
    localization &&
    localization?.locales.find((locale) =>
      typeof locale === 'string' ? locale === localeCode : locale.code === localeCode,
    )

  const activeLocaleLabel = activeLocale && getTranslation(activeLocale.label, i18n)

  if (!hasPublishPermission) {
    return null
  }

  return (
    <React.Fragment>
      <FormSubmit
        buttonId="action-save"
        disabled={!canPublish}
        enableSubMenu={canSchedulePublish}
        onClick={isDefaultPublishAll ? publish : () => publishSpecificLocale(activeLocale.code)}
        size="medium"
        SubMenuPopupContent={
          isSpecificLocalePublishEnabled || canSchedulePublish
            ? ({ close }) => {
                return (
                  <React.Fragment>
                    {canSchedulePublish && (
                      <PopupList.ButtonGroup key="schedule-publish">
                        <PopupList.Button
                          id="schedule-publish"
                          onClick={() => [toggleModal(drawerSlug), close()]}
                        >
                          {t('version:schedulePublish')}
                        </PopupList.Button>
                      </PopupList.ButtonGroup>
                    )}
                    {isSpecificLocalePublishEnabled && (
                      <PopupList.ButtonGroup>
                        <PopupList.Button
                          id="publish-locale"
                          onClick={
                            isDefaultPublishAll
                              ? () => publishSpecificLocale(activeLocale.code)
                              : publish
                          }
                        >
                          {isDefaultPublishAll
                            ? t('version:publishIn', { locale: activeLocaleLabel })
                            : t('version:publishAllLocales')}
                        </PopupList.Button>
                      </PopupList.ButtonGroup>
                    )}
                  </React.Fragment>
                )
              }
            : undefined
        }
        type="button"
      >
        {!isDefaultPublishAll ? t('version:publishIn', { locale: activeLocaleLabel }) : label}
      </FormSubmit>
      {canSchedulePublish && isModalOpen(drawerSlug) && (
        <ScheduleDrawer
          defaultType={!hasNewerVersions ? 'unpublish' : 'publish'}
          schedulePublishConfig={
            scheduledPublishEnabled &&
            typeof entityConfig.versions.drafts.schedulePublish === 'object'
              ? entityConfig.versions.drafts.schedulePublish
              : undefined
          }
          slug={drawerSlug}
        />
      )}
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: buildUpcomingColumns.tsx]---
Location: payload-main/packages/ui/src/elements/PublishButton/ScheduleDrawer/buildUpcomingColumns.tsx
Signals: React

```typescript
import type { ClientConfig, Column } from 'payload'

import { getTranslation, type I18nClient, type TFunction } from '@payloadcms/translations'
import React from 'react'

import type { UpcomingEvent } from './types.js'

import { formatDate } from '../../../utilities/formatDocTitle/formatDateTitle.js'
import { Button } from '../../Button/index.js'
import { Pill } from '../../Pill/index.js'

type Args = {
  dateFormat: string
  deleteHandler: (id: number | string) => void
  docs: UpcomingEvent[]
  i18n: I18nClient
  localization: ClientConfig['localization']
  supportedTimezones: ClientConfig['admin']['timezones']['supportedTimezones']
  t: TFunction
}

export const buildUpcomingColumns = ({
  dateFormat,
  deleteHandler,
  docs,
  i18n,
  localization,
  supportedTimezones,
  t,
}: Args): Column[] => {
  const columns: Column[] = [
    {
      accessor: 'input.type',
      active: true,
      field: {
        name: '',
        type: 'text',
      },
      Heading: <span>{t('version:type')}</span>,
      renderedCells: docs.map((doc) => {
        const type = doc.input?.type

        return (
          <Pill key={doc.id} pillStyle={type === 'publish' ? 'success' : 'warning'} size="small">
            {type === 'publish' && t('version:publish')}
            {type === 'unpublish' && t('version:unpublish')}
          </Pill>
        )
      }),
    },
    {
      accessor: 'waitUntil',
      active: true,
      field: {
        name: '',
        type: 'date',
      },
      Heading: <span>{t('general:time')}</span>,
      renderedCells: docs.map((doc) => (
        <span key={doc.id}>
          {formatDate({
            date: doc.waitUntil,
            i18n,
            pattern: dateFormat,
            timezone: doc.input.timezone,
          })}
        </span>
      )),
    },
    {
      accessor: 'input.timezone',
      active: true,
      field: {
        name: '',
        type: 'text',
      },
      Heading: <span>{t('general:timezone')}</span>,
      renderedCells: docs.map((doc) => {
        const matchedTimezone = supportedTimezones.find(
          (timezone) => timezone.value === doc.input.timezone,
        )

        const timezone = matchedTimezone?.label || doc.input.timezone

        return <span key={doc.id}>{timezone || t('general:noValue')}</span>
      }),
    },
  ]

  if (localization) {
    columns.push({
      accessor: 'input.locale',
      active: true,
      field: {
        name: '',
        type: 'text',
      },
      Heading: <span>{t('general:locale')}</span>,
      renderedCells: docs.map((doc) => {
        if (doc.input.locale) {
          const matchedLocale = localization.locales.find(
            (locale) => locale.code === doc.input.locale,
          )
          if (matchedLocale) {
            return <span key={doc.id}>{getTranslation(matchedLocale.label, i18n)}</span>
          }
        }

        return <span key={doc.id}>{t('general:all')}</span>
      }),
    })
  }

  columns.push({
    accessor: 'delete',
    active: true,
    field: {
      name: 'delete',
      type: 'text',
    },
    Heading: <span>{t('general:delete')}</span>,
    renderedCells: docs.map((doc) => (
      <Button
        buttonStyle="icon-label"
        className="schedule-publish__delete"
        icon="x"
        key={doc.id}
        onClick={(e) => {
          e.preventDefault()
          deleteHandler(doc.id)
        }}
        tooltip={t('general:delete')}
      />
    )),
  })

  return columns
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/PublishButton/ScheduleDrawer/index.scss

```text
@layer payload-default {
  .schedule-publish {
    &__drawer-header {
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

    &__scheduler {
      padding-top: calc(var(--base) * 2);
      padding-bottom: calc(var(--base) * 2);
      border-bottom: 1px solid var(--theme-border-color);
    }

    &__type {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;

      li {
        margin-right: calc(var(--base) * 2);
      }
    }

    &__actions {
      button {
        margin-right: var(--base);
      }
    }

    &__upcoming {
      padding-top: calc(var(--base) * 2);
      padding-bottom: calc(var(--base) * 2);

      h4 {
        margin-bottom: var(--base);
      }
    }

    &__delete {
      margin: 0;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PublishButton/ScheduleDrawer/index.tsx
Signals: React

```typescript
/* eslint-disable no-console */
'use client'

import type { Column, SchedulePublish, Where } from 'payload'

import { TZDateMini as TZDate } from '@date-fns/tz/date/mini'
import { useModal } from '@faceless-ui/modal'
import { getTranslation } from '@payloadcms/translations'
import { endOfToday, isToday, startOfDay } from 'date-fns'
import { transpose } from 'date-fns/transpose'
import * as qs from 'qs-esm'
import React, { useCallback, useMemo } from 'react'
import { toast } from 'sonner'

import type { PublishType, UpcomingEvent } from './types.js'

import { FieldLabel } from '../../../fields/FieldLabel/index.js'
import { Radio } from '../../../fields/RadioGroup/Radio/index.js'
import { useConfig } from '../../../providers/Config/index.js'
import { useDocumentInfo } from '../../../providers/DocumentInfo/index.js'
import { useDocumentTitle } from '../../../providers/DocumentTitle/index.js'
import { useServerFunctions } from '../../../providers/ServerFunctions/index.js'
import { useTranslation } from '../../../providers/Translation/index.js'
import { requests } from '../../../utilities/api.js'
import { Banner } from '../../Banner/index.js'
import { DrawerCloseButton } from '../../BulkUpload/DrawerCloseButton/index.js'
import { Button } from '../../Button/index.js'
import { DatePickerField } from '../../DatePicker/index.js'
import { Drawer } from '../../Drawer/index.js'
import { Gutter } from '../../Gutter/index.js'
import { ReactSelect } from '../../ReactSelect/index.js'
import './index.scss'
import { ShimmerEffect } from '../../ShimmerEffect/index.js'
import { Table } from '../../Table/index.js'
import { TimezonePicker } from '../../TimezonePicker/index.js'
import { buildUpcomingColumns } from './buildUpcomingColumns.js'

const baseClass = 'schedule-publish'

type Props = {
  defaultType?: PublishType
  schedulePublishConfig?: SchedulePublish
  slug: string
}

const defaultLocaleOption = {
  label: 'All',
  value: 'all',
}

export const ScheduleDrawer: React.FC<Props> = ({ slug, defaultType, schedulePublishConfig }) => {
  const { toggleModal } = useModal()
  const {
    config: {
      admin: {
        dateFormat,
        timezones: { defaultTimezone, supportedTimezones },
      },
      localization,
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const { id, collectionSlug, globalSlug } = useDocumentInfo()
  const { title } = useDocumentTitle()
  const { i18n, t } = useTranslation()
  const { schedulePublish } = useServerFunctions()
  const [type, setType] = React.useState<PublishType>(defaultType || 'publish')
  const [date, setDate] = React.useState<Date>()
  const [timezone, setTimezone] = React.useState<string>(defaultTimezone)
  const [locale, setLocale] = React.useState<{ label: string; value: string }>(defaultLocaleOption)
  const [processing, setProcessing] = React.useState(false)
  const modalTitle = t('general:schedulePublishFor', { title })
  const [upcoming, setUpcoming] = React.useState<UpcomingEvent[]>()
  const [upcomingColumns, setUpcomingColumns] = React.useState<Column[]>()
  const deleteHandlerRef = React.useRef<((id: number | string) => Promise<void>) | null>(() => null)

  // Get the user timezone so we can adjust the displayed value against it
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const localeOptions = React.useMemo(() => {
    if (localization) {
      const options = localization.locales.map(({ code, label }) => ({
        label: getTranslation(label, i18n),
        value: code,
      }))

      options.unshift(defaultLocaleOption)

      return options
    }

    return []
  }, [localization, i18n])

  const fetchUpcoming = React.useCallback(async () => {
    const query: { sort: string; where: Where } = {
      sort: 'waitUntil',
      where: {
        and: [
          {
            taskSlug: {
              equals: 'schedulePublish',
            },
          },
          {
            waitUntil: {
              greater_than: new Date(),
            },
          },
        ],
      },
    }

    if (collectionSlug) {
      query.where.and.push({
        'input.doc.value': {
          equals: String(id),
        },
      })
      query.where.and.push({
        'input.doc.relationTo': {
          equals: collectionSlug,
        },
      })
    }

    if (globalSlug) {
      query.where.and.push({
        'input.global': {
          equals: globalSlug,
        },
      })
    }

    const { docs } = await requests
      .post(`${serverURL}${api}/payload-jobs`, {
        body: qs.stringify(query),
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Payload-HTTP-Method-Override': 'GET',
        },
      })
      .then((res) => res.json())

    setUpcomingColumns(
      buildUpcomingColumns({
        dateFormat,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        deleteHandler: deleteHandlerRef.current,
        docs,
        i18n,
        localization,
        supportedTimezones,
        t,
      }),
    )
    setUpcoming(docs)
  }, [
    collectionSlug,
    globalSlug,
    serverURL,
    api,
    i18n,
    dateFormat,
    localization,
    supportedTimezones,
    t,
    id,
  ])

  const deleteHandler = React.useCallback(
    async (id: number | string) => {
      try {
        await schedulePublish({
          deleteID: id,
        })
        await fetchUpcoming()
        toast.success(t('general:deletedSuccessfully'))
      } catch (err) {
        console.error(err)
        toast.error(err.message)
      }
    },
    [fetchUpcoming, schedulePublish, t],
  )

  React.useEffect(() => {
    deleteHandlerRef.current = deleteHandler
  }, [deleteHandler])

  const handleSave = React.useCallback(async () => {
    if (!date) {
      return toast.error(t('general:noDateSelected'))
    }

    setProcessing(true)

    let publishSpecificLocale: string

    if (typeof locale === 'object' && locale.value !== 'all' && type === 'publish') {
      publishSpecificLocale = locale.value
    }

    try {
      await schedulePublish({
        type,
        date,
        doc: collectionSlug
          ? {
              relationTo: collectionSlug,
              value: String(id),
            }
          : undefined,
        global: globalSlug || undefined,
        locale: publishSpecificLocale,
        timezone,
      })

      setDate(undefined)
      toast.success(t('version:scheduledSuccessfully'))
      void fetchUpcoming()
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }

    setProcessing(false)
  }, [
    date,
    locale,
    type,
    t,
    schedulePublish,
    collectionSlug,
    id,
    globalSlug,
    timezone,
    fetchUpcoming,
  ])

  const displayedValue = useMemo(() => {
    if (timezone && userTimezone && date) {
      // Create TZDate instances for the selected timezone and the user's timezone
      // These instances allow us to transpose the date between timezones while keeping the same time value
      const DateWithOriginalTz = TZDate.tz(timezone)
      const DateWithUserTz = TZDate.tz(userTimezone)

      const modifiedDate = new TZDate(date).withTimeZone(timezone)

      // Transpose the date to the selected timezone
      const dateWithTimezone = transpose(modifiedDate, DateWithOriginalTz)

      // Transpose the date to the user's timezone - this is necessary because the react-datepicker component insists on displaying the date in the user's timezone
      const dateWithUserTimezone = transpose(dateWithTimezone, DateWithUserTz)

      return dateWithUserTimezone.toISOString()
    }

    return date
  }, [timezone, date, userTimezone])

  const onChangeDate = useCallback(
    (incomingDate: Date) => {
      if (timezone && incomingDate) {
        // Create TZDate instances for the selected timezone
        const tzDateWithUTC = TZDate.tz(timezone)

        // Creates a TZDate instance for the user's timezone  — this is default behaviour of TZDate as it wraps the Date constructor
        const dateToUserTz = new TZDate(incomingDate)

        // Transpose the date to the selected timezone
        const dateWithTimezone = transpose(dateToUserTz, tzDateWithUTC)

        setDate(dateWithTimezone || null)
      } else {
        setDate(incomingDate || null)
      }
    },
    [setDate, timezone],
  )

  React.useEffect(() => {
    if (!upcoming) {
      const fetchInitialUpcoming = async () => {
        await fetchUpcoming()
      }

      void fetchInitialUpcoming()
    }
  }, [upcoming, fetchUpcoming])

  const minTime = useMemo(() => {
    if (date && isToday(date)) {
      return new Date()
    }

    return startOfDay(new Date())
  }, [date])

  return (
    <Drawer
      className={baseClass}
      gutter={false}
      Header={
        <div className={`${baseClass}__drawer-header`}>
          <h2 title={modalTitle}>{modalTitle}</h2>
          <DrawerCloseButton onClick={() => toggleModal(slug)} />
        </div>
      }
      slug={slug}
    >
      <Gutter className={`${baseClass}__scheduler`}>
        <FieldLabel label={t('version:type')} required />
        <ul className={`${baseClass}__type`}>
          <li>
            <Radio
              id={`${slug}-type`}
              isSelected={type === 'publish'}
              onChange={() => setType('publish')}
              option={{ label: t('version:publish'), value: 'publish' }}
              path={`${slug}-type`}
              readOnly={processing}
            />
          </li>
          <li>
            <Radio
              id={`${slug}-type`}
              isSelected={type === 'unpublish'}
              onChange={() => setType('unpublish')}
              option={{ label: t('version:unpublish'), value: 'unpublish' }}
              path={`${slug}-type`}
              readOnly={processing}
            />
          </li>
        </ul>
        <br />
        <FieldLabel label={t('general:time')} path={'time'} required />
        <DatePickerField
          id="time"
          maxTime={endOfToday()}
          minDate={new Date()}
          minTime={minTime}
          onChange={(e) => onChangeDate(e)}
          pickerAppearance="dayAndTime"
          readOnly={processing}
          timeFormat={schedulePublishConfig?.timeFormat}
          timeIntervals={schedulePublishConfig?.timeIntervals ?? 5}
          value={displayedValue}
        />
        {supportedTimezones.length > 0 && (
          <TimezonePicker
            id={`timezone-picker`}
            onChange={setTimezone}
            options={supportedTimezones}
            selectedTimezone={timezone}
          />
        )}
        <br />
        {localeOptions.length > 0 && type === 'publish' && (
          <React.Fragment>
            <FieldLabel label={t('localization:localeToPublish')} />
            <ReactSelect
              onChange={(e) => setLocale(e as { label: string; value: string })}
              options={localeOptions}
              value={locale}
            />
            <br />
          </React.Fragment>
        )}
        <div className={`${baseClass}__actions`}>
          <Button
            buttonStyle="primary"
            disabled={processing}
            id="scheduled-publish-save"
            onClick={handleSave}
            type="button"
          >
            {t('general:save')}
          </Button>
          {processing ? <span>{t('general:saving')}</span> : null}
        </div>
      </Gutter>
      <Gutter className={`${baseClass}__upcoming`}>
        <h4>{t('general:upcomingEvents')}</h4>
        {!upcoming && <ShimmerEffect />}
        {upcoming?.length === 0 && (
          <Banner type="info">{t('general:noUpcomingEventsScheduled')}</Banner>
        )}
        {upcoming?.length > 0 && (
          <Table appearance="condensed" columns={upcomingColumns} data={upcoming} />
        )}
      </Gutter>
    </Drawer>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/ui/src/elements/PublishButton/ScheduleDrawer/types.ts

```typescript
export type PublishType = 'publish' | 'unpublish'

export type UpcomingEvent = {
  id: number | string
  input: {
    locale?: string
    timezone?: string
    type: PublishType
  }
  waitUntil: Date
}
```

--------------------------------------------------------------------------------

---[FILE: DrawerContent.tsx]---
Location: payload-main/packages/ui/src/elements/PublishMany/DrawerContent.tsx
Signals: React, Next.js

```typescript
import type { Where } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { useRouter, useSearchParams } from 'next/navigation.js'
import { combineWhereConstraints, mergeListSearchAndWhere } from 'payload/shared'
import * as qs from 'qs-esm'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import type { PublishManyProps } from './index.js'

import { useConfig } from '../../providers/Config/index.js'
import { useLocale } from '../../providers/Locale/index.js'
import { useRouteCache } from '../../providers/RouteCache/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { requests } from '../../utilities/api.js'
import { parseSearchParams } from '../../utilities/parseSearchParams.js'
import { ConfirmationModal } from '../ConfirmationModal/index.js'

type PublishManyDrawerContentProps = {
  drawerSlug: string
  ids: (number | string)[]
  onSuccess?: () => void
  selectAll: boolean
  where?: Where
} & PublishManyProps

export function PublishManyDrawerContent(props: PublishManyDrawerContentProps) {
  const {
    collection,
    collection: { slug, labels: { plural, singular } } = {},
    drawerSlug,
    ids,
    onSuccess,
    selectAll,
    where,
  } = props

  const { clearRouteCache } = useRouteCache()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const { code: locale } = useLocale()

  const router = useRouter()
  const searchParams = useSearchParams()
  const { i18n, t } = useTranslation()

  const addDefaultError = useCallback(() => {
    toast.error(t('error:unknown'))
  }, [t])

  const queryString = React.useMemo((): string => {
    const whereConstraints: Where[] = [
      {
        _status: {
          not_equals: 'published',
        },
      },
    ]

    if (where) {
      whereConstraints.push(where)
    }

    const queryWithSearch = mergeListSearchAndWhere({
      collectionConfig: collection,
      search: searchParams.get('search'),
    })

    if (queryWithSearch) {
      whereConstraints.push(queryWithSearch)
    }

    if (selectAll) {
      // Match the current filter/search, or default to all docs
      whereConstraints.push(
        (parseSearchParams(searchParams)?.where as Where) || {
          id: {
            not_equals: '',
          },
        },
      )
    } else {
      // If we're not selecting all, we need to select specific docs
      whereConstraints.push({
        id: {
          in: ids || [],
        },
      })
    }

    return qs.stringify(
      {
        locale,
        select: {},
        where: combineWhereConstraints(whereConstraints),
      },
      { addQueryPrefix: true },
    )
  }, [collection, searchParams, selectAll, ids, locale, where])

  const handlePublish = useCallback(async () => {
    await requests
      .patch(`${serverURL}${api}/${slug}${queryString}&draft=true`, {
        body: JSON.stringify({
          _status: 'published',
        }),
        headers: {
          'Accept-Language': i18n.language,
          'Content-Type': 'application/json',
        },
      })
      .then(async (res) => {
        try {
          const json = await res.json()

          const deletedDocs = json?.docs.length || 0
          const successLabel = deletedDocs > 1 ? plural : singular

          if (res.status < 400 || deletedDocs > 0) {
            toast.success(
              t('general:updatedCountSuccessfully', {
                count: deletedDocs,
                label: getTranslation(successLabel, i18n),
              }),
            )

            if (json?.errors.length > 0) {
              toast.error(json.message, {
                description: json.errors.map((error) => error.message).join('\n'),
              })
            }

            router.replace(
              qs.stringify(
                {
                  ...parseSearchParams(searchParams),
                  page: selectAll ? '1' : undefined,
                },
                { addQueryPrefix: true },
              ),
            )

            clearRouteCache()

            if (typeof onSuccess === 'function') {
              onSuccess()
            }

            return null
          }

          if (json.errors) {
            json.errors.forEach((error) => toast.error(error.message))
          } else {
            addDefaultError()
          }
          return false
        } catch (_err) {
          return addDefaultError()
        }
      })
  }, [
    serverURL,
    api,
    slug,
    queryString,
    i18n,
    plural,
    singular,
    t,
    router,
    searchParams,
    selectAll,
    clearRouteCache,
    addDefaultError,
    onSuccess,
  ])

  return (
    <ConfirmationModal
      body={t('version:aboutToPublishSelection', { label: getTranslation(plural, i18n) })}
      cancelLabel={t('general:cancel')}
      confirmingLabel={t('version:publishing')}
      confirmLabel={t('general:confirm')}
      heading={t('version:confirmPublish')}
      modalSlug={drawerSlug}
      onConfirm={handlePublish}
    />
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/PublishMany/index.tsx
Signals: React

```typescript
'use client'
import type { ClientCollectionConfig, Where } from 'payload'

import { useModal } from '@faceless-ui/modal'
import React from 'react'

import { useAuth } from '../../providers/Auth/index.js'
import { SelectAllStatus, useSelection } from '../../providers/Selection/index.js'
import { useTranslation } from '../../providers/Translation/index.js'
import { ListSelectionButton } from '../ListSelection/index.js'
import { PublishManyDrawerContent } from './DrawerContent.js'

export type PublishManyProps = {
  collection: ClientCollectionConfig
}

export const PublishMany: React.FC<PublishManyProps> = (props) => {
  const { count, selectAll, selectedIDs, toggleAll } = useSelection()

  return (
    <PublishMany_v4
      {...props}
      count={count}
      ids={selectedIDs}
      onSuccess={() => toggleAll()}
      selectAll={selectAll === SelectAllStatus.AllAvailable}
    />
  )
}

type PublishMany_v4Props = {
  count: number
  ids: (number | string)[]
  /**
   * When multiple PublishMany components are rendered on the page, this will differentiate them.
   */
  modalPrefix?: string
  onSuccess?: () => void
  selectAll: boolean
  where?: Where
} & PublishManyProps

export const PublishMany_v4: React.FC<PublishMany_v4Props> = (props) => {
  const {
    collection,
    collection: { slug, versions } = {},
    count,
    ids,
    modalPrefix,
    onSuccess,
    selectAll,
    where,
  } = props

  const { permissions } = useAuth()
  const { t } = useTranslation()

  const { openModal } = useModal()

  const collectionPermissions = permissions?.collections?.[slug]
  const hasPermission = collectionPermissions?.update

  const drawerSlug = `${modalPrefix ? `${modalPrefix}-` : ''}publish-${slug}`

  if (!versions?.drafts || count === 0 || !hasPermission) {
    return null
  }

  return (
    <React.Fragment>
      <ListSelectionButton
        aria-label={t('version:publish')}
        onClick={() => {
          openModal(drawerSlug)
        }}
      >
        {t('version:publish')}
      </ListSelectionButton>
      <PublishManyDrawerContent
        collection={collection}
        drawerSlug={drawerSlug}
        ids={ids}
        onSuccess={onSuccess}
        selectAll={selectAll}
        where={where}
      />
    </React.Fragment>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/cells/AccessCell/index.tsx
Signals: React

```typescript
import type { DefaultCellComponentProps } from 'payload'
import type { JSX } from 'react'

import { toWords } from 'payload/shared'
import React, { Fragment } from 'react'

export const QueryPresetsAccessCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  // first sort the operations in the order they should be displayed
  const operations = ['read', 'update', 'delete']

  return (
    <p>
      {operations.reduce((acc, operation, index) => {
        const operationData = (cellData as JSON)?.[operation]

        if (operationData && operationData.constraint) {
          acc.push(
            <Fragment key={operation}>
              <span>
                <strong>{toWords(operation)}</strong>: {toWords(operationData.constraint)}
              </span>
              {index !== operations.length - 1 && ', '}
            </Fragment>,
          )
        }
        return acc
      }, [] as JSX.Element[])}
    </p>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.scss]---
Location: payload-main/packages/ui/src/elements/QueryPresets/cells/ColumnsCell/index.scss

```text
@import '../../../../scss/styles';

@layer payload-default {
  .query-preset-columns-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/cells/ColumnsCell/index.tsx
Signals: React

```typescript
import type { ColumnPreference, DefaultCellComponentProps } from 'payload'

import { toWords, transformColumnsToSearchParams } from 'payload/shared'
import React from 'react'

import { Pill } from '../../../Pill/index.js'
import './index.scss'

const baseClass = 'query-preset-columns-cell'

export const QueryPresetsColumnsCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  return (
    <div className={baseClass}>
      {cellData
        ? transformColumnsToSearchParams(cellData as ColumnPreference[]).map((column, i) => {
            const isColumnActive = !column.startsWith('-')

            // to void very lengthy cells, only display the active columns
            if (!isColumnActive) {
              return null
            }

            return (
              <Pill key={i} pillStyle={isColumnActive ? 'always-white' : 'light'} size="small">
                {toWords(column)}
              </Pill>
            )
          })
        : 'No columns selected'}
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/cells/GroupByCell/index.tsx
Signals: React

```typescript
import type { DefaultCellComponentProps } from 'payload'

import { toWords } from 'payload/shared'
import React, { useMemo } from 'react'

import { useAuth } from '../../../../providers/Auth/index.js'
import { useConfig } from '../../../../providers/Config/index.js'
import { useTranslation } from '../../../../providers/Translation/index.js'
import { reduceFieldsToOptions } from '../../../../utilities/reduceFieldsToOptions.js'

export const QueryPresetsGroupByCell: React.FC<DefaultCellComponentProps> = ({
  cellData,
  rowData,
}) => {
  const { i18n } = useTranslation()
  const { permissions } = useAuth()
  const { config } = useConfig()

  // Get the related collection from the row data
  const relatedCollection = rowData?.relatedCollection as string

  // Get the collection config for the related collection
  const collectionConfig = useMemo(() => {
    if (!relatedCollection) {
      return null
    }

    return config.collections?.find((col) => col.slug === relatedCollection)
  }, [relatedCollection, config.collections])

  // Reduce fields to options to get proper labels
  const reducedFields = useMemo(() => {
    if (!collectionConfig) {
      return []
    }

    const fieldPermissions = permissions?.collections?.[relatedCollection]?.fields

    return reduceFieldsToOptions({
      fieldPermissions,
      fields: collectionConfig.fields,
      i18n,
    })
  }, [collectionConfig, permissions, relatedCollection, i18n])

  if (!cellData || typeof cellData !== 'string') {
    return <div>No group by selected</div>
  }

  const isDescending = cellData.startsWith('-')
  const fieldName = isDescending ? cellData.slice(1) : cellData
  const direction = isDescending ? 'descending' : 'ascending'

  // Find the field option to get the proper label
  const fieldOption = reducedFields.find((field) => field.value === fieldName)
  const displayLabel = fieldOption?.label || toWords(fieldName)

  return (
    <div>
      {displayLabel} ({direction})
    </div>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/packages/ui/src/elements/QueryPresets/cells/WhereCell/index.tsx
Signals: React

```typescript
import type { DefaultCellComponentProps, Where } from 'payload'

import { toWords } from 'payload/shared'
import React from 'react'

/** @todo: improve this */
const transformWhereToNaturalLanguage = (where: Where): string => {
  if (where.or && where.or.length > 0 && where.or[0].and && where.or[0].and.length > 0) {
    const orQuery = where.or[0]
    const andQuery = orQuery?.and?.[0]

    if (!andQuery || typeof andQuery !== 'object') {
      return 'No where query'
    }

    const key = Object.keys(andQuery)[0]

    if (!key || !andQuery[key] || typeof andQuery[key] !== 'object') {
      return 'No where query'
    }

    const operator = Object.keys(andQuery[key])[0]
    const value = andQuery[key][operator]

    if (typeof value === 'string') {
      return `${toWords(key)} ${operator} ${toWords(value)}`
    } else if (Array.isArray(value)) {
      return `${toWords(key)} ${operator} ${value.map((val) => toWords(val)).join(' or ')}`
    }
  }

  return ''
}

export const QueryPresetsWhereCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  return <div>{cellData ? transformWhereToNaturalLanguage(cellData) : 'No where query'}</div>
}
```

--------------------------------------------------------------------------------

````
