---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 87
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 87 of 695)

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
Location: payload-main/examples/form-builder/src/components/Blocks/Form/index.tsx
Signals: React, Next.js

```typescript
'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '../../Button'
import { Gutter } from '../../Gutter'
import RichText from '../../RichText'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import classes from './index.module.scss'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[] | Value
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: string
  }
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  return (
    <Gutter>
      <div
        className={[classes.form, hasSubmitted && classes.hasSubmitted].filter(Boolean).join(' ')}
      >
        {enableIntro && introContent && !hasSubmitted && (
          <RichText className={classes.intro} content={introContent} />
        )}
        {!isLoading && hasSubmitted && confirmationType === 'message' && (
          <RichText className={classes.confirmationMessage} content={confirmationMessage} />
        )}
        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <form id={formID} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.fieldWrap}>
              {formFromProps &&
                formFromProps.fields &&
                formFromProps.fields.map((field, index) => {
                  const Field: React.FC<any> = fields?.[field.blockType]
                  if (Field) {
                    return (
                      <React.Fragment key={index}>
                        <Field
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </React.Fragment>
                    )
                  }
                  return null
                })}
            </div>
            <Button appearance="primary" el="button" form={formID} label={submitButtonLabel} />
          </form>
        )}
      </div>
    </Gutter>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: shared.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/shared.scss

```text
@use '../../../css/common.scss' as *;

@mixin formInput() {
  all: unset;
  -webkit-appearance: none;
  box-sizing: border-box;
  font-family: var(--font-body);
  width: 100%;
  border: 1px solid var(--color-black);
  background: var(--color-white);
  color: var(--color-black);
  font-size: 1rem;
  height: calc(var(--base) * 2.5);
  line-height: var(--base);
  padding: calc(var(--base) * 0.75);

  &::-moz-placeholder,
  &::-webkit-input-placeholder {
    color: var(--color-mid-gray);
    font-weight: normal;
    font-size: 1rem;
  }

  &:hover {
    border-color: var(--color-mid-gray);
  }

  &:focus,
  &:active {
    border-color: var(--color-gray);
    outline: 0;
  }

  &:disabled {
    background: var(--color-light-gray);
    color: var(--color-gray);

    &:hover {
      border-color: var(--color-light-gray);
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Checkbox/index.module.scss

```text
@use '../shared.scss';

.checkbox {
  position: relative;
  margin-bottom: var(--base);

  :global {
    button {
      border: 0;
      background: none;
      box-shadow: none;
      border-radius: 0;
      padding: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 1rem;

      &:focus,
      &:active {
        outline: none;
      }

      &:hover {
        svg {
          opacity: 0.2;
        }
      }
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }
}

.container {
  display: flex;
}

.input {
  @include shared.formInput;
  padding: 0;
  line-height: 0;
  position: relative;
  width: var(--base);
  height: var(--base);
  margin-right: calc(var(--base) * 0.5);
  margin-bottom: 0;

  svg {
    opacity: 0;
  }
}

.checked {
  :global {
    svg {
      opacity: 1 !important;
    }
  }
}

.label {
  display: block;
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Checkbox/index.tsx
Signals: React

```typescript
import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React, { useState } from 'react'

import { Check } from '../../../icons/Check'
import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Checkbox: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    getValues: any
    register: UseFormRegister<any & FieldValues>
    setValue: any
  } & CheckboxField
> = ({
  name,
  errors,
  getValues,
  label,
  register,
  required: requiredFromProps,
  setValue,
  width,
}) => {
  const [checked, setChecked] = useState(false)

  const isCheckboxChecked = getValues(name)

  return (
    <Width width={width}>
      <div className={[classes.checkbox, checked && classes.checked].filter(Boolean).join(' ')}>
        <div className={classes.container}>
          <input
            type="checkbox"
            {...register(name, { required: requiredFromProps })}
            checked={isCheckboxChecked}
          />
          <button
            onClick={() => {
              setValue(name, !checked)
              setChecked(!checked)
            }}
            type="button"
          >
            <span className={classes.input}>
              <Check />
            </span>
          </button>
          <span className={classes.label}>{label}</span>
        </div>
        {requiredFromProps && errors[name] && checked === false && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Country/index.module.scss

```text
@use '../shared.scss';

.select {
  position: relative;
  margin-bottom: var(--base);
}

.label {
  margin-bottom: 10px;
  display: block;
}

.reactSelect {
  display: flex;

  :global {
    div.rs__control {
      @include shared.formInput;
      height: auto;
    }

    .rs__input-container {
      color: var(--color-black);
    }

    .rs__value-container {
      padding: 0;
      > * {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    .rs__single-value {
      color: var(--color-black);
    }

    .rs__indicators {
      position: absolute;
      top: calc(var(--base) * 0.9);
      right: calc(var(--base) * 0.9);
      .arrow {
        transform: rotate(90deg);
      }
    }

    .rs__indicator {
      padding: 0px 4px;
      cursor: pointer;

      svg path {
        fill: var(--color-dark-gray);
      }

      &:hover {
        svg path {
          fill: var(--color-dark-gray);
        }
      }
    }

    .rs__indicator-separator {
      display: none;
    }

    .rs__menu {
      color: var(--color-black);
      background-color: var(--color-white);
      z-index: 2;
      border-radius: 0;
      box-shadow: 0 4px 11px hsl(0deg 0% 0% / 10%);
    }

    .rs__menu-list {
      padding: calc(var(--base) / 4) 0;
    }

    .rs__group-heading {
      margin-bottom: calc(var(--base) / 2);
    }

    .rs__option {
      font-size: 1rem;
      padding: calc(var(--base) / 2) var(--base);

      &--is-focused {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }

      &--is-selected {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }
    }

    .rs__multi-value {
      padding: 0;
      background: var(--color-light-gray);
    }

    .rs__multi-value__label {
      max-width: 150px;
      color: var(--color-black);
      padding: calc(var(--base) / 8) calc(var(--base) / 4);
    }

    .rs__multi-value__remove {
      cursor: pointer;

      &:hover {
        color: var(--color-black);
        background: var(--color-light-gray);
      }
    }

    .rs__clear-indicator {
      cursor: pointer;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Country/index.tsx
Signals: React

```typescript
import type { CountryField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'
import { countryOptions } from './options'

export const Country: React.FC<
  {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  } & CountryField
> = ({ name, control, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <div className={classes.select}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <Controller
          control={control}
          defaultValue=""
          name={name}
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              className={classes.reactSelect}
              classNamePrefix="rs"
              inputId={name}
              instanceId={name}
              onChange={(val) => onChange(val ? val.value : '')}
              options={countryOptions}
              value={countryOptions.find((c) => c.value === value)}
            />
          )}
          rules={{ required }}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: options.ts]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Country/options.ts

```typescript
export const countryOptions = [
  {
    label: 'Afghanistan',
    value: 'AF',
  },
  {
    label: 'Åland Islands',
    value: 'AX',
  },
  {
    label: 'Albania',
    value: 'AL',
  },
  {
    label: 'Algeria',
    value: 'DZ',
  },
  {
    label: 'American Samoa',
    value: 'AS',
  },
  {
    label: 'Andorra',
    value: 'AD',
  },
  {
    label: 'Angola',
    value: 'AO',
  },
  {
    label: 'Anguilla',
    value: 'AI',
  },
  {
    label: 'Antarctica',
    value: 'AQ',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'AG',
  },
  {
    label: 'Argentina',
    value: 'AR',
  },
  {
    label: 'Armenia',
    value: 'AM',
  },
  {
    label: 'Aruba',
    value: 'AW',
  },
  {
    label: 'Australia',
    value: 'AU',
  },
  {
    label: 'Austria',
    value: 'AT',
  },
  {
    label: 'Azerbaijan',
    value: 'AZ',
  },
  {
    label: 'Bahamas',
    value: 'BS',
  },
  {
    label: 'Bahrain',
    value: 'BH',
  },
  {
    label: 'Bangladesh',
    value: 'BD',
  },
  {
    label: 'Barbados',
    value: 'BB',
  },
  {
    label: 'Belarus',
    value: 'BY',
  },
  {
    label: 'Belgium',
    value: 'BE',
  },
  {
    label: 'Belize',
    value: 'BZ',
  },
  {
    label: 'Benin',
    value: 'BJ',
  },
  {
    label: 'Bermuda',
    value: 'BM',
  },
  {
    label: 'Bhutan',
    value: 'BT',
  },
  {
    label: 'Bolivia',
    value: 'BO',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BA',
  },
  {
    label: 'Botswana',
    value: 'BW',
  },
  {
    label: 'Bouvet Island',
    value: 'BV',
  },
  {
    label: 'Brazil',
    value: 'BR',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'IO',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BN',
  },
  {
    label: 'Bulgaria',
    value: 'BG',
  },
  {
    label: 'Burkina Faso',
    value: 'BF',
  },
  {
    label: 'Burundi',
    value: 'BI',
  },
  {
    label: 'Cambodia',
    value: 'KH',
  },
  {
    label: 'Cameroon',
    value: 'CM',
  },
  {
    label: 'Canada',
    value: 'CA',
  },
  {
    label: 'Cape Verde',
    value: 'CV',
  },
  {
    label: 'Cayman Islands',
    value: 'KY',
  },
  {
    label: 'Central African Republic',
    value: 'CF',
  },
  {
    label: 'Chad',
    value: 'TD',
  },
  {
    label: 'Chile',
    value: 'CL',
  },
  {
    label: 'China',
    value: 'CN',
  },
  {
    label: 'Christmas Island',
    value: 'CX',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CC',
  },
  {
    label: 'Colombia',
    value: 'CO',
  },
  {
    label: 'Comoros',
    value: 'KM',
  },
  {
    label: 'Congo',
    value: 'CG',
  },
  {
    label: 'Congo, The Democratic Republic of the',
    value: 'CD',
  },
  {
    label: 'Cook Islands',
    value: 'CK',
  },
  {
    label: 'Costa Rica',
    value: 'CR',
  },
  {
    label: "Cote D'Ivoire",
    value: 'CI',
  },
  {
    label: 'Croatia',
    value: 'HR',
  },
  {
    label: 'Cuba',
    value: 'CU',
  },
  {
    label: 'Cyprus',
    value: 'CY',
  },
  {
    label: 'Czech Republic',
    value: 'CZ',
  },
  {
    label: 'Denmark',
    value: 'DK',
  },
  {
    label: 'Djibouti',
    value: 'DJ',
  },
  {
    label: 'Dominica',
    value: 'DM',
  },
  {
    label: 'Dominican Republic',
    value: 'DO',
  },
  {
    label: 'Ecuador',
    value: 'EC',
  },
  {
    label: 'Egypt',
    value: 'EG',
  },
  {
    label: 'El Salvador',
    value: 'SV',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GQ',
  },
  {
    label: 'Eritrea',
    value: 'ER',
  },
  {
    label: 'Estonia',
    value: 'EE',
  },
  {
    label: 'Ethiopia',
    value: 'ET',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    value: 'FK',
  },
  {
    label: 'Faroe Islands',
    value: 'FO',
  },
  {
    label: 'Fiji',
    value: 'FJ',
  },
  {
    label: 'Finland',
    value: 'FI',
  },
  {
    label: 'France',
    value: 'FR',
  },
  {
    label: 'French Guiana',
    value: 'GF',
  },
  {
    label: 'French Polynesia',
    value: 'PF',
  },
  {
    label: 'French Southern Territories',
    value: 'TF',
  },
  {
    label: 'Gabon',
    value: 'GA',
  },
  {
    label: 'Gambia',
    value: 'GM',
  },
  {
    label: 'Georgia',
    value: 'GE',
  },
  {
    label: 'Germany',
    value: 'DE',
  },
  {
    label: 'Ghana',
    value: 'GH',
  },
  {
    label: 'Gibraltar',
    value: 'GI',
  },
  {
    label: 'Greece',
    value: 'GR',
  },
  {
    label: 'Greenland',
    value: 'GL',
  },
  {
    label: 'Grenada',
    value: 'GD',
  },
  {
    label: 'Guadeloupe',
    value: 'GP',
  },
  {
    label: 'Guam',
    value: 'GU',
  },
  {
    label: 'Guatemala',
    value: 'GT',
  },
  {
    label: 'Guernsey',
    value: 'GG',
  },
  {
    label: 'Guinea',
    value: 'GN',
  },
  {
    label: 'Guinea-Bissau',
    value: 'GW',
  },
  {
    label: 'Guyana',
    value: 'GY',
  },
  {
    label: 'Haiti',
    value: 'HT',
  },
  {
    label: 'Heard Island and Mcdonald Islands',
    value: 'HM',
  },
  {
    label: 'Holy See (Vatican City State)',
    value: 'VA',
  },
  {
    label: 'Honduras',
    value: 'HN',
  },
  {
    label: 'Hong Kong',
    value: 'HK',
  },
  {
    label: 'Hungary',
    value: 'HU',
  },
  {
    label: 'Iceland',
    value: 'IS',
  },
  {
    label: 'India',
    value: 'IN',
  },
  {
    label: 'Indonesia',
    value: 'ID',
  },
  {
    label: 'Iran, Islamic Republic Of',
    value: 'IR',
  },
  {
    label: 'Iraq',
    value: 'IQ',
  },
  {
    label: 'Ireland',
    value: 'IE',
  },
  {
    label: 'Isle of Man',
    value: 'IM',
  },
  {
    label: 'Israel',
    value: 'IL',
  },
  {
    label: 'Italy',
    value: 'IT',
  },
  {
    label: 'Jamaica',
    value: 'JM',
  },
  {
    label: 'Japan',
    value: 'JP',
  },
  {
    label: 'Jersey',
    value: 'JE',
  },
  {
    label: 'Jordan',
    value: 'JO',
  },
  {
    label: 'Kazakhstan',
    value: 'KZ',
  },
  {
    label: 'Kenya',
    value: 'KE',
  },
  {
    label: 'Kiribati',
    value: 'KI',
  },
  {
    label: "Democratic People's Republic of Korea",
    value: 'KP',
  },
  {
    label: 'Korea, Republic of',
    value: 'KR',
  },
  {
    label: 'Kosovo',
    value: 'XK',
  },
  {
    label: 'Kuwait',
    value: 'KW',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KG',
  },
  {
    label: "Lao People's Democratic Republic",
    value: 'LA',
  },
  {
    label: 'Latvia',
    value: 'LV',
  },
  {
    label: 'Lebanon',
    value: 'LB',
  },
  {
    label: 'Lesotho',
    value: 'LS',
  },
  {
    label: 'Liberia',
    value: 'LR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    value: 'LY',
  },
  {
    label: 'Liechtenstein',
    value: 'LI',
  },
  {
    label: 'Lithuania',
    value: 'LT',
  },
  {
    label: 'Luxembourg',
    value: 'LU',
  },
  {
    label: 'Macao',
    value: 'MO',
  },
  {
    label: 'Macedonia, The Former Yugoslav Republic of',
    value: 'MK',
  },
  {
    label: 'Madagascar',
    value: 'MG',
  },
  {
    label: 'Malawi',
    value: 'MW',
  },
  {
    label: 'Malaysia',
    value: 'MY',
  },
  {
    label: 'Maldives',
    value: 'MV',
  },
  {
    label: 'Mali',
    value: 'ML',
  },
  {
    label: 'Malta',
    value: 'MT',
  },
  {
    label: 'Marshall Islands',
    value: 'MH',
  },
  {
    label: 'Martinique',
    value: 'MQ',
  },
  {
    label: 'Mauritania',
    value: 'MR',
  },
  {
    label: 'Mauritius',
    value: 'MU',
  },
  {
    label: 'Mayotte',
    value: 'YT',
  },
  {
    label: 'Mexico',
    value: 'MX',
  },
  {
    label: 'Micronesia, Federated States of',
    value: 'FM',
  },
  {
    label: 'Moldova, Republic of',
    value: 'MD',
  },
  {
    label: 'Monaco',
    value: 'MC',
  },
  {
    label: 'Mongolia',
    value: 'MN',
  },
  {
    label: 'Montenegro',
    value: 'ME',
  },
  {
    label: 'Montserrat',
    value: 'MS',
  },
  {
    label: 'Morocco',
    value: 'MA',
  },
  {
    label: 'Mozambique',
    value: 'MZ',
  },
  {
    label: 'Myanmar',
    value: 'MM',
  },
  {
    label: 'Namibia',
    value: 'NA',
  },
  {
    label: 'Nauru',
    value: 'NR',
  },
  {
    label: 'Nepal',
    value: 'NP',
  },
  {
    label: 'Netherlands',
    value: 'NL',
  },
  {
    label: 'Netherlands Antilles',
    value: 'AN',
  },
  {
    label: 'New Caledonia',
    value: 'NC',
  },
  {
    label: 'New Zealand',
    value: 'NZ',
  },
  {
    label: 'Nicaragua',
    value: 'NI',
  },
  {
    label: 'Niger',
    value: 'NE',
  },
  {
    label: 'Nigeria',
    value: 'NG',
  },
  {
    label: 'Niue',
    value: 'NU',
  },
  {
    label: 'Norfolk Island',
    value: 'NF',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
  },
  {
    label: 'Norway',
    value: 'NO',
  },
  {
    label: 'Oman',
    value: 'OM',
  },
  {
    label: 'Pakistan',
    value: 'PK',
  },
  {
    label: 'Palau',
    value: 'PW',
  },
  {
    label: 'Palestinian Territory, Occupied',
    value: 'PS',
  },
  {
    label: 'Panama',
    value: 'PA',
  },
  {
    label: 'Papua New Guinea',
    value: 'PG',
  },
  {
    label: 'Paraguay',
    value: 'PY',
  },
  {
    label: 'Peru',
    value: 'PE',
  },
  {
    label: 'Philippines',
    value: 'PH',
  },
  {
    label: 'Pitcairn',
    value: 'PN',
  },
  {
    label: 'Poland',
    value: 'PL',
  },
  {
    label: 'Portugal',
    value: 'PT',
  },
  {
    label: 'Puerto Rico',
    value: 'PR',
  },
  {
    label: 'Qatar',
    value: 'QA',
  },
  {
    label: 'Reunion',
    value: 'RE',
  },
  {
    label: 'Romania',
    value: 'RO',
  },
  {
    label: 'Russian Federation',
    value: 'RU',
  },
  {
    label: 'Rwanda',
    value: 'RW',
  },
  {
    label: 'Saint Helena',
    value: 'SH',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KN',
  },
  {
    label: 'Saint Lucia',
    value: 'LC',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'PM',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'VC',
  },
  {
    label: 'Samoa',
    value: 'WS',
  },
  {
    label: 'San Marino',
    value: 'SM',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'ST',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
  },
  {
    label: 'Senegal',
    value: 'SN',
  },
  {
    label: 'Serbia',
    value: 'RS',
  },
  {
    label: 'Seychelles',
    value: 'SC',
  },
  {
    label: 'Sierra Leone',
    value: 'SL',
  },
  {
    label: 'Singapore',
    value: 'SG',
  },
  {
    label: 'Slovakia',
    value: 'SK',
  },
  {
    label: 'Slovenia',
    value: 'SI',
  },
  {
    label: 'Solomon Islands',
    value: 'SB',
  },
  {
    label: 'Somalia',
    value: 'SO',
  },
  {
    label: 'South Africa',
    value: 'ZA',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'GS',
  },
  {
    label: 'Spain',
    value: 'ES',
  },
  {
    label: 'Sri Lanka',
    value: 'LK',
  },
  {
    label: 'Sudan',
    value: 'SD',
  },
  {
    label: 'Suriname',
    value: 'SR',
  },
  {
    label: 'Svalbard and Jan Mayen',
    value: 'SJ',
  },
  {
    label: 'Swaziland',
    value: 'SZ',
  },
  {
    label: 'Sweden',
    value: 'SE',
  },
  {
    label: 'Switzerland',
    value: 'CH',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SY',
  },
  {
    label: 'Taiwan',
    value: 'TW',
  },
  {
    label: 'Tajikistan',
    value: 'TJ',
  },
  {
    label: 'Tanzania, United Republic of',
    value: 'TZ',
  },
  {
    label: 'Thailand',
    value: 'TH',
  },
  {
    label: 'Timor-Leste',
    value: 'TL',
  },
  {
    label: 'Togo',
    value: 'TG',
  },
  {
    label: 'Tokelau',
    value: 'TK',
  },
  {
    label: 'Tonga',
    value: 'TO',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'TT',
  },
  {
    label: 'Tunisia',
    value: 'TN',
  },
  {
    label: 'Turkey',
    value: 'TR',
  },
  {
    label: 'Turkmenistan',
    value: 'TM',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'TC',
  },
  {
    label: 'Tuvalu',
    value: 'TV',
  },
  {
    label: 'Uganda',
    value: 'UG',
  },
  {
    label: 'Ukraine',
    value: 'UA',
  },
  {
    label: 'United Arab Emirates',
    value: 'AE',
  },
  {
    label: 'United Kingdom',
    value: 'GB',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'United States Minor Outlying Islands',
    value: 'UM',
  },
  {
    label: 'Uruguay',
    value: 'UY',
  },
  {
    label: 'Uzbekistan',
    value: 'UZ',
  },
  {
    label: 'Vanuatu',
    value: 'VU',
  },
  {
    label: 'Venezuela',
    value: 'VE',
  },
  {
    label: 'Viet Nam',
    value: 'VN',
  },
  {
    label: 'Virgin Islands, British',
    value: 'VG',
  },
  {
    label: 'Virgin Islands, U.S.',
    value: 'VI',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WF',
  },
  {
    label: 'Western Sahara',
    value: 'EH',
  },
  {
    label: 'Yemen',
    value: 'YE',
  },
  {
    label: 'Zambia',
    value: 'ZM',
  },
  {
    label: 'Zimbabwe',
    value: 'ZW',
  },
]
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Email/index.module.scss

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
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Email/index.tsx
Signals: React

```typescript
import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Email: React.FC<
  {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<any & FieldValues>
  } & EmailField
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
          placeholder="Email"
          type="text"
          {...register(name, { pattern: /^\S[^\s@]*@\S+$/, required: requiredFromProps })}
        />
        {requiredFromProps && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Error/index.module.scss

```text
.error {
  margin-top: 5px;
  color: var(--color-red);
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Error/index.tsx
Signals: React

```typescript
import * as React from 'react'

import classes from './index.module.scss'

export const Error: React.FC = () => {
  return <div className={classes.error}>This field is required</div>
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Message/index.module.scss

```text
@use '../.../../../../../css/queries.scss' as *;

.message {
  margin: var(--base) 0 var(--base) 0;

  @include mid-break {
    margin: calc(var(--base) * 0.5) 0 calc(var(--base) * 0.5) 0;
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Message/index.tsx
Signals: React

```typescript
import type { MessageField } from '@payloadcms/plugin-form-builder/types'

import React from 'react'

import RichText from '../../../RichText'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Message: React.FC<MessageField> = ({ message }) => {
  return (
    <Width width={100}>
      <RichText className={classes.message} content={message} />
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Number/index.module.scss

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
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Number/index.tsx
Signals: React

```typescript
import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Number: React.FC<
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
          type="number"
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
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Select/index.module.scss

```text
@use '../shared.scss';

.select {
  position: relative;
  margin-bottom: var(--base);
}

.label {
  margin-bottom: 10px;
  display: block;
}

.reactSelect {
  display: flex;

  :global {
    div.rs__control {
      @include shared.formInput;
      height: auto;
    }

    .rs__input-container {
      color: var(--color-black);
    }

    .rs__value-container {
      padding: 0;
      > * {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    .rs__single-value {
      color: var(--color-black);
    }

    .rs__indicators {
      position: absolute;
      top: calc(var(--base) * 0.9);
      right: calc(var(--base) * 0.9);
      .arrow {
        transform: rotate(90deg);
      }
    }

    .rs__indicator {
      padding: 0px 4px;
      cursor: pointer;

      svg path {
        fill: var(--color-dark-gray);
      }

      &:hover {
        svg path {
          fill: var(--color-dark-gray);
        }
      }
    }

    .rs__indicator-separator {
      display: none;
    }

    .rs__menu {
      color: var(--color-black);
      background-color: var(--color-white);
      z-index: 2;
      border-radius: 0;
      box-shadow: 0 4px 11px hsl(0deg 0% 0% / 10%);
    }

    .rs__menu-list {
      padding: calc(var(--base) / 4) 0;
    }

    .rs__group-heading {
      margin-bottom: calc(var(--base) / 2);
    }

    .rs__option {
      font-size: 1rem;
      padding: calc(var(--base) / 2) var(--base);

      &--is-focused {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }

      &--is-selected {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }
    }

    .rs__multi-value {
      padding: 0;
      background: var(--color-light-gray);
    }

    .rs__multi-value__label {
      max-width: 150px;
      color: var(--color-black);
      padding: calc(var(--base) / 8) calc(var(--base) / 4);
    }

    .rs__multi-value__remove {
      cursor: pointer;

      &:hover {
        color: var(--color-black);
        background: var(--color-light-gray);
      }
    }

    .rs__clear-indicator {
      cursor: pointer;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/Select/index.tsx
Signals: React

```typescript
import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'

export const Select: React.FC<
  {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  } & SelectField
> = ({ name, control, errors, label, options, required, width }) => {
  return (
    <Width width={width}>
      <div className={classes.select}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <Controller
          control={control}
          defaultValue=""
          name={name}
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              className={classes.reactSelect}
              classNamePrefix="rs"
              inputId={name}
              instanceId={name}
              onChange={(val) => onChange(val ? val.value : '')}
              options={options}
              value={options.find((s) => s.value === value)}
            />
          )}
          rules={{ required }}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.module.scss]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/State/index.module.scss

```text
@use '../shared.scss';

.select {
  position: relative;
  margin-bottom: var(--base);
}

.label {
  margin-bottom: 10px;
  display: block;
}

.reactSelect {
  display: flex;

  :global {
    div.rs__control {
      @include shared.formInput;
      height: auto;
    }

    .rs__input-container {
      color: var(--color-black);
    }

    .rs__value-container {
      padding: 0;
      > * {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
    }

    .rs__single-value {
      color: var(--color-black);
    }

    .rs__indicators {
      position: absolute;
      top: calc(var(--base) * 0.9);
      right: calc(var(--base) * 0.9);
      .arrow {
        transform: rotate(90deg);
      }
    }

    .rs__indicator {
      padding: 0px 4px;
      cursor: pointer;

      svg path {
        fill: var(--color-dark-gray);
      }

      &:hover {
        svg path {
          fill: var(--color-dark-gray);
        }
      }
    }

    .rs__indicator-separator {
      display: none;
    }

    .rs__menu {
      color: var(--color-black);
      background-color: var(--color-white);
      z-index: 2;
      border-radius: 0;
      box-shadow: 0 4px 11px hsl(0deg 0% 0% / 10%);
    }

    .rs__menu-list {
      padding: calc(var(--base) / 4) 0;
    }

    .rs__group-heading {
      margin-bottom: calc(var(--base) / 2);
    }

    .rs__option {
      font-size: 1rem;
      padding: calc(var(--base) / 2) var(--base);

      &--is-focused {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }

      &--is-selected {
        background-color: var(--color-light-gray);
        color: var(--color-black);
      }
    }

    .rs__multi-value {
      padding: 0;
      background: var(--color-light-gray);
    }

    .rs__multi-value__label {
      max-width: 150px;
      color: var(--color-black);
      padding: calc(var(--base) / 8) calc(var(--base) / 4);
    }

    .rs__multi-value__remove {
      cursor: pointer;

      &:hover {
        color: var(--color-black);
        background: var(--color-light-gray);
      }
    }

    .rs__clear-indicator {
      cursor: pointer;
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: index.tsx]---
Location: payload-main/examples/form-builder/src/components/Blocks/Form/State/index.tsx
Signals: React

```typescript
import type { StateField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import React from 'react'
import { Controller } from 'react-hook-form'
import ReactSelect from 'react-select'

import { Error } from '../Error'
import { Width } from '../Width'
import classes from './index.module.scss'
import { stateOptions } from './options'

export const State: React.FC<
  {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  } & StateField
> = ({ name, control, errors, label, required, width }) => {
  return (
    <Width width={width}>
      <div className={classes.select}>
        <label className={classes.label} htmlFor={name}>
          {label}
        </label>
        <Controller
          control={control}
          defaultValue=""
          name={name}
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              className={classes.reactSelect}
              classNamePrefix="rs"
              id={name}
              instanceId={name}
              onChange={(val) => onChange(val ? val.value : '')}
              options={stateOptions}
              value={stateOptions.find((t) => t.value === value)}
            />
          )}
          rules={{ required }}
        />
        {required && errors[name] && <Error />}
      </div>
    </Width>
  )
}
```

--------------------------------------------------------------------------------

````
