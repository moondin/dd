---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 254
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 254 of 695)

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
Location: payload-main/packages/plugin-multi-tenant/src/providers/TenantSelectionProvider/index.tsx
Signals: Next.js

```typescript
import type { Payload, TypedUser } from 'payload'

import { cookies as getCookies } from 'next/headers.js'

import type { MultiTenantPluginConfig } from '../../types.js'

import { getTenantOptions } from '../../utilities/getTenantOptions.js'
import { TenantSelectionProviderClient } from './index.client.js'

type Args<ConfigType> = {
  children: React.ReactNode
  payload: Payload
  tenantsArrayFieldName: string
  tenantsArrayTenantFieldName: string
  tenantsCollectionSlug: string
  useAsTitle: string
  user: TypedUser
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}

export const TenantSelectionProvider = async ({
  children,
  payload,
  tenantsArrayFieldName,
  tenantsArrayTenantFieldName,
  tenantsCollectionSlug,
  useAsTitle,
  user,
  userHasAccessToAllTenants,
}: Args<any>) => {
  const tenantOptions = await getTenantOptions({
    payload,
    tenantsArrayFieldName,
    tenantsArrayTenantFieldName,
    tenantsCollectionSlug,
    useAsTitle,
    user,
    userHasAccessToAllTenants,
  })

  const cookies = await getCookies()
  const tenantCookie = cookies.get('payload-tenant')?.value
  let initialValue = undefined

  /**
   * Ensure the cookie is a valid tenant
   */
  if (tenantCookie) {
    const matchingOption = tenantOptions.find((option) => String(option.value) === tenantCookie)
    if (matchingOption) {
      initialValue = matchingOption.value
    }
  }

  /**
   * If the there was no cookie or the cookie was an invalid tenantID set intialValue
   */
  if (!initialValue) {
    initialValue = tenantOptions.length > 1 ? undefined : tenantOptions[0]?.value
  }

  return (
    <TenantSelectionProviderClient
      initialTenantOptions={tenantOptions}
      initialValue={initialValue}
      tenantsCollectionSlug={tenantsCollectionSlug}
    >
      {children}
    </TenantSelectionProviderClient>
  )
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/index.ts

```typescript
import type {
  GenericTranslationsObject,
  NestedKeysStripped,
  SupportedLanguages,
} from '@payloadcms/translations'

import type { PluginDefaultTranslationsObject } from './types.js'

import { ar } from './languages/ar.js'
import { az } from './languages/az.js'
import { bg } from './languages/bg.js'
import { ca } from './languages/ca.js'
import { cs } from './languages/cs.js'
import { da } from './languages/da.js'
import { de } from './languages/de.js'
import { en } from './languages/en.js'
import { es } from './languages/es.js'
import { et } from './languages/et.js'
import { fa } from './languages/fa.js'
import { fr } from './languages/fr.js'
import { he } from './languages/he.js'
import { hr } from './languages/hr.js'
import { hu } from './languages/hu.js'
import { hy } from './languages/hy.js'
import { is } from './languages/is.js'
import { it } from './languages/it.js'
import { ja } from './languages/ja.js'
import { ko } from './languages/ko.js'
import { lt } from './languages/lt.js'
import { my } from './languages/my.js'
import { nb } from './languages/nb.js'
import { nl } from './languages/nl.js'
import { pl } from './languages/pl.js'
import { pt } from './languages/pt.js'
import { ro } from './languages/ro.js'
import { rs } from './languages/rs.js'
import { rsLatin } from './languages/rsLatin.js'
import { ru } from './languages/ru.js'
import { sk } from './languages/sk.js'
import { sl } from './languages/sl.js'
import { sv } from './languages/sv.js'
import { ta } from './languages/ta.js'
import { th } from './languages/th.js'
import { tr } from './languages/tr.js'
import { uk } from './languages/uk.js'
import { vi } from './languages/vi.js'
import { zh } from './languages/zh.js'
import { zhTw } from './languages/zhTw.js'

export const translations = {
  ar,
  az,
  bg,
  ca,
  cs,
  da,
  de,
  en,
  es,
  et,
  fa,
  fr,
  he,
  hr,
  hu,
  hy,
  is,
  it,
  ja,
  ko,
  lt,
  my,
  nb,
  nl,
  pl,
  pt,
  ro,
  rs,
  'rs-latin': rsLatin,
  ru,
  sk,
  sl,
  sv,
  ta,
  th,
  tr,
  uk,
  vi,
  zh,
  'zh-TW': zhTw,
} as SupportedLanguages<PluginDefaultTranslationsObject>

export type PluginMultiTenantTranslations = GenericTranslationsObject

export type PluginMultiTenantTranslationKeys = NestedKeysStripped<PluginMultiTenantTranslations>
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/types.ts

```typescript
import type { Language } from '@payloadcms/translations'

import type { enTranslations } from './languages/en.js'

export type PluginLanguage = Language<{
  'plugin-multi-tenant': {
    'assign-tenant-button-label': string
    'assign-tenant-modal-title': string
    'field-assignedTenant-label': string
    'nav-tenantSelector-label': string
  }
}>

export type PluginDefaultTranslationsObject = typeof enTranslations
```

--------------------------------------------------------------------------------

---[FILE: ar.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ar.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const arTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'تعيين المستأجر',
    'assign-tenant-modal-title': 'قم بتعيين "{{title}}"',
    'field-assignedTenant-label': 'المستأجر المعين',
    'nav-tenantSelector-label': 'المستأجر',
  },
}

export const ar: PluginLanguage = {
  dateFNSKey: 'ar',
  translations: arTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: az.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/az.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const azTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Kirayəçiyə təyin et',
    'assign-tenant-modal-title': '"{{title}}" təyin edin',
    'field-assignedTenant-label': 'Təyin edilmiş İcarəçi',
    'nav-tenantSelector-label': 'Kirayəçi',
  },
}

export const az: PluginLanguage = {
  dateFNSKey: 'az',
  translations: azTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: bg.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/bg.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const bgTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Назначаване на Tenant',
    'assign-tenant-modal-title': 'Назначете "{{title}}"',
    'field-assignedTenant-label': 'Назначен наемател',
    'nav-tenantSelector-label': 'Потребител',
  },
}

export const bg: PluginLanguage = {
  dateFNSKey: 'bg',
  translations: bgTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: bnBd.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/bnBd.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const bnBdTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'টেনেন্ট নির্ধারণ করুন',
    'assign-tenant-modal-title': '"{{title}}" নিয়োগ করুন',
    'field-assignedTenant-label': 'নিযুক্ত টেনেন্ট',
    'nav-tenantSelector-label': 'টেনেন্ট অনুসারে ফিল্টার করুন',
  },
}

export const bnBd: PluginLanguage = {
  dateFNSKey: 'bn-BD',
  translations: bnBdTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: bnIn.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/bnIn.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const bnInTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'টেনেন্ট নিয়োগ করুন',
    'assign-tenant-modal-title': '"{{title}}" এর দায়িত্ব দিন',
    'field-assignedTenant-label': 'নির্ধারিত টেনেন্ট',
    'nav-tenantSelector-label': 'টেনেন্ট অনুসারে ফিল্টার করুন',
  },
}

export const bnIn: PluginLanguage = {
  dateFNSKey: 'bn-IN',
  translations: bnInTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ca.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ca.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const caTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Assignar Tenant',
    'assign-tenant-modal-title': 'Assigna "{{title}}"',
    'field-assignedTenant-label': 'Llogater Assignat',
    'nav-tenantSelector-label': 'Inquilí',
  },
}

export const ca: PluginLanguage = {
  dateFNSKey: 'ca',
  translations: caTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: cs.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/cs.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const csTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Přiřadit nájemce',
    'assign-tenant-modal-title': 'Přiřadit "{{title}}"',
    'field-assignedTenant-label': 'Přiřazený nájemce',
    'nav-tenantSelector-label': 'Nájemce',
  },
}

export const cs: PluginLanguage = {
  dateFNSKey: 'cs',
  translations: csTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: da.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/da.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const daTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Tildel Tenant',
    'assign-tenant-modal-title': 'Tildel "{{title}}"',
    'field-assignedTenant-label': 'Tildelt Lejer',
    'nav-tenantSelector-label': 'Lejer',
  },
}

export const da: PluginLanguage = {
  dateFNSKey: 'da',
  translations: daTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: de.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/de.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const deTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Mieter zuweisen',
    'assign-tenant-modal-title': 'Weisen Sie "{{title}}" zu',
    'field-assignedTenant-label': 'Zugewiesener Mandant',
    'nav-tenantSelector-label': 'Mieter',
  },
}

export const de: PluginLanguage = {
  dateFNSKey: 'de',
  translations: deTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: en.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/en.ts

```typescript
import type { PluginLanguage } from '../types.js'

export const enTranslations = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Assign Tenant',
    'assign-tenant-modal-title': 'Assign "{{title}}"',
    'field-assignedTenant-label': 'Assigned Tenant',
    'nav-tenantSelector-label': 'Filter by Tenant',
  },
}

export const en: PluginLanguage = {
  dateFNSKey: 'en-US',
  translations: enTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: es.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/es.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const esTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Asignar Inquilino',
    'assign-tenant-modal-title': 'Asignar "{{title}}"',
    'field-assignedTenant-label': 'Inquilino Asignado',
    'nav-tenantSelector-label': 'Inquilino',
  },
}

export const es: PluginLanguage = {
  dateFNSKey: 'es',
  translations: esTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: et.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/et.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const etTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Määra Tenant',
    'assign-tenant-modal-title': 'Määra "{{title}}"',
    'field-assignedTenant-label': 'Määratud üürnik',
    'nav-tenantSelector-label': 'Üürnik',
  },
}

export const et: PluginLanguage = {
  dateFNSKey: 'et',
  translations: etTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: fa.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/fa.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const faTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'اختصاص Tenant',
    'assign-tenant-modal-title': 'اختصاص "{{title}}"',
    'field-assignedTenant-label': 'مستاجر اختصاص یافته',
    'nav-tenantSelector-label': 'مستاجر',
  },
}

export const fa: PluginLanguage = {
  dateFNSKey: 'fa-IR',
  translations: faTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: fr.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/fr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const frTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Attribuer un Locataire',
    'assign-tenant-modal-title': 'Attribuer "{{title}}"',
    'field-assignedTenant-label': 'Locataire Attribué',
    'nav-tenantSelector-label': 'Locataire',
  },
}

export const fr: PluginLanguage = {
  dateFNSKey: 'fr',
  translations: frTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: he.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/he.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const heTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'הקצה Tenant',
    'assign-tenant-modal-title': 'הקצה "{{title}}"',
    'field-assignedTenant-label': 'דייר מוקצה',
    'nav-tenantSelector-label': 'דייר',
  },
}

export const he: PluginLanguage = {
  dateFNSKey: 'he',
  translations: heTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hr.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/hr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const hrTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Dodijeli Najmoprimca',
    'assign-tenant-modal-title': 'Dodijeli "{{title}}"',
    'field-assignedTenant-label': 'Dodijeljeni stanar',
    'nav-tenantSelector-label': 'Podstanar',
  },
}

export const hr: PluginLanguage = {
  dateFNSKey: 'hr',
  translations: hrTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hu.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/hu.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const huTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Hozzárendelési bérlő',
    'assign-tenant-modal-title': 'Rendelje hozzá a "{{title}}"',
    'field-assignedTenant-label': 'Kijelölt Bérlő',
    'nav-tenantSelector-label': 'Bérlő',
  },
}

export const hu: PluginLanguage = {
  dateFNSKey: 'hu',
  translations: huTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: hy.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/hy.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const hyTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Տեղադրել Tenant',
    'assign-tenant-modal-title': 'Հանձնել "{{title}}"',
    'field-assignedTenant-label': 'Հանձնարարված վարձակալ',
    'nav-tenantSelector-label': 'Տենանտ',
  },
}

export const hy: PluginLanguage = {
  dateFNSKey: 'hy-AM',
  translations: hyTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: id.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/id.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const idTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Tetapkan Tenant',
    'assign-tenant-modal-title': 'Tetapkan "{{title}}"',
    'field-assignedTenant-label': 'Penyewa yang Ditugaskan',
    'nav-tenantSelector-label': 'Filter berdasarkan Tenant',
  },
}

export const id: PluginLanguage = {
  dateFNSKey: 'id',
  translations: idTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: is.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/is.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const isTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Úthluta sviði',
    'assign-tenant-modal-title': 'Úthluta "{{title}}"',
    'field-assignedTenant-label': 'Úthlutað svið',
    'nav-tenantSelector-label': 'Sía eftir sviði',
  },
}

export const is: PluginLanguage = {
  dateFNSKey: 'is',
  translations: isTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: it.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/it.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const itTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Assegna Tenant',
    'assign-tenant-modal-title': 'Assegna "{{title}}"',
    'field-assignedTenant-label': 'Inquilino Assegnato',
    'nav-tenantSelector-label': 'Inquilino',
  },
}

export const it: PluginLanguage = {
  dateFNSKey: 'it',
  translations: itTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ja.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ja.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const jaTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'テナントを割り当てる',
    'assign-tenant-modal-title': '"{{title}}"を割り当てる',
    'field-assignedTenant-label': '割り当てられたテナント',
    'nav-tenantSelector-label': 'テナント',
  },
}

export const ja: PluginLanguage = {
  dateFNSKey: 'ja',
  translations: jaTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ko.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ko.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const koTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': '테넌트 지정',
    'assign-tenant-modal-title': '"{{title}}"를 지정하십시오.',
    'field-assignedTenant-label': '지정된 세입자',
    'nav-tenantSelector-label': '세입자',
  },
}

export const ko: PluginLanguage = {
  dateFNSKey: 'ko',
  translations: koTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: lt.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/lt.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ltTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Priskirkite nuomininką',
    'assign-tenant-modal-title': 'Paskirkite "{{title}}"',
    'field-assignedTenant-label': 'Paskirtas nuomininkas',
    'nav-tenantSelector-label': 'Nuomininkas',
  },
}

export const lt: PluginLanguage = {
  dateFNSKey: 'lt',
  translations: ltTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: lv.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/lv.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const lvTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Piešķirt Tenant',
    'assign-tenant-modal-title': 'Piešķirt "{{title}}"',
    'field-assignedTenant-label': 'Piešķirtais tenants',
    'nav-tenantSelector-label': 'Filtrēt pēc Nomnieka',
  },
}

export const lv: PluginLanguage = {
  dateFNSKey: 'lv',
  translations: lvTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: my.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/my.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const myTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'အသစ်ထည့်သည့် Tenant',
    'assign-tenant-modal-title': 'Tetapkan "{{title}}"',
    'field-assignedTenant-label': 'ခွဲစိုက်ထားသော အငှားယူသူ',
    'nav-tenantSelector-label': 'Penyewa',
  },
}

export const my: PluginLanguage = {
  dateFNSKey: 'en-US',
  translations: myTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: nb.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/nb.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const nbTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Tildel organisasjon',
    'assign-tenant-modal-title': 'Tildel "{{title}}"',
    'field-assignedTenant-label': 'Tildelt organisasjon',
    'nav-tenantSelector-label': 'Filtrer etter organisasjon',
  },
}

export const nb: PluginLanguage = {
  dateFNSKey: 'nb',
  translations: nbTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: nl.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/nl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const nlTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Toewijzen Tenant',
    'assign-tenant-modal-title': 'Wijs "{{title}}" toe',
    'field-assignedTenant-label': 'Toegewezen Huurder',
    'nav-tenantSelector-label': 'Huurder',
  },
}

export const nl: PluginLanguage = {
  dateFNSKey: 'nl',
  translations: nlTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: pl.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/pl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const plTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Przypisz Najemcę',
    'assign-tenant-modal-title': 'Przypisz "{{title}}"',
    'field-assignedTenant-label': 'Przypisany Najemca',
    'nav-tenantSelector-label': 'Najemca',
  },
}

export const pl: PluginLanguage = {
  dateFNSKey: 'pl',
  translations: plTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: pt.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/pt.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ptTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Atribuir Inquilino',
    'assign-tenant-modal-title': 'Atribuir "{{title}}"',
    'field-assignedTenant-label': 'Inquilino Atribuído',
    'nav-tenantSelector-label': 'Inquilino',
  },
}

export const pt: PluginLanguage = {
  dateFNSKey: 'pt',
  translations: ptTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rn.sh]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/rn.sh

```bash
for file in *.js; do
    mv -- "$file" "${file%.js}.ts"
done
```

--------------------------------------------------------------------------------

---[FILE: ro.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ro.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const roTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Alocați Tenant',
    'assign-tenant-modal-title': 'Atribuiți "{{title}}"',
    'field-assignedTenant-label': 'Locatar Atribuit',
    'nav-tenantSelector-label': 'Locatar',
  },
}

export const ro: PluginLanguage = {
  dateFNSKey: 'ro',
  translations: roTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rs.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/rs.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const rsTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Dodeli Tenant',
    'assign-tenant-modal-title': 'Dodelite "{{title}}"',
    'field-assignedTenant-label': 'Dodeljen stanar',
    'nav-tenantSelector-label': 'Podstanar',
  },
}

export const rs: PluginLanguage = {
  dateFNSKey: 'rs',
  translations: rsTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rsLatin.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/rsLatin.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const rsLatinTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Dodeli Tenant',
    'assign-tenant-modal-title': 'Dodeli "{{title}}"',
    'field-assignedTenant-label': 'Dodeljen stanar',
    'nav-tenantSelector-label': 'Podstanar',
  },
}

export const rsLatin: PluginLanguage = {
  dateFNSKey: 'rs-Latin',
  translations: rsLatinTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ru.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ru.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ruTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Назначить Арендатора',
    'assign-tenant-modal-title': 'Назначить "{{title}}"',
    'field-assignedTenant-label': 'Назначенный Арендатор',
    'nav-tenantSelector-label': 'Арендатор',
  },
}

export const ru: PluginLanguage = {
  dateFNSKey: 'ru',
  translations: ruTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sk.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/sk.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const skTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Priradiť nájomcu',
    'assign-tenant-modal-title': 'Priradiť "{{title}}"',
    'field-assignedTenant-label': 'Pridelený nájomca',
    'nav-tenantSelector-label': 'Nájomca',
  },
}

export const sk: PluginLanguage = {
  dateFNSKey: 'sk',
  translations: skTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sl.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/sl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const slTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Dodeli najemnika',
    'assign-tenant-modal-title': 'Dodeli "{{title}}"',
    'field-assignedTenant-label': 'Dodeljen najemnik',
    'nav-tenantSelector-label': 'Najemnik',
  },
}

export const sl: PluginLanguage = {
  dateFNSKey: 'sl-SI',
  translations: slTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sv.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/sv.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const svTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Tilldela Hyresgäst',
    'assign-tenant-modal-title': 'Tilldela "{{title}}"',
    'field-assignedTenant-label': 'Tilldelad hyresgäst',
    'nav-tenantSelector-label': 'Hyresgäst',
  },
}

export const sv: PluginLanguage = {
  dateFNSKey: 'sv',
  translations: svTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ta.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/ta.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const taTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'டெனன்டை ஒதுக்குக',
    'assign-tenant-modal-title': '"{{title}}"ஐ ஒதுக்கி வைக்கவும்.',
    'field-assignedTenant-label': 'ஒதுக்கப்பட்ட Tenant',
    'nav-tenantSelector-label': 'Tenant',
  },
}

export const ta: PluginLanguage = {
  dateFNSKey: 'ta',
  translations: taTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: th.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/th.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const thTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'กำหนดผู้เช่า',
    'assign-tenant-modal-title': 'มอบหมาย "{{title}}"',
    'field-assignedTenant-label': 'ผู้เช่าที่ได้รับการกำหนด',
    'nav-tenantSelector-label': 'ผู้เช่า',
  },
}

export const th: PluginLanguage = {
  dateFNSKey: 'th',
  translations: thTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: tr.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/tr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const trTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Kiracı Ata',
    'assign-tenant-modal-title': '"{{title}}" atayın.',
    'field-assignedTenant-label': 'Atanan Kiracı',
    'nav-tenantSelector-label': 'Kiracı',
  },
}

export const tr: PluginLanguage = {
  dateFNSKey: 'tr',
  translations: trTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: uk.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/uk.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ukTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Призначити орендаря',
    'assign-tenant-modal-title': 'Призначте "{{title}}"',
    'field-assignedTenant-label': 'Призначений орендар',
    'nav-tenantSelector-label': 'Орендар',
  },
}

export const uk: PluginLanguage = {
  dateFNSKey: 'uk',
  translations: ukTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: vi.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/vi.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const viTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': 'Giao Tenant',
    'assign-tenant-modal-title': 'Gán "{{title}}"',
    'field-assignedTenant-label': 'Người thuê đã được chỉ định',
    'nav-tenantSelector-label': 'Người thuê',
  },
}

export const vi: PluginLanguage = {
  dateFNSKey: 'vi',
  translations: viTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: zh.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/zh.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const zhTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': '分配租户',
    'assign-tenant-modal-title': '分配"{{title}}"',
    'field-assignedTenant-label': '指定租户',
    'nav-tenantSelector-label': '租户',
  },
}

export const zh: PluginLanguage = {
  dateFNSKey: 'zh-CN',
  translations: zhTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: zhTw.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/translations/languages/zhTw.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const zhTwTranslations: PluginDefaultTranslationsObject = {
  'plugin-multi-tenant': {
    'assign-tenant-button-label': '指派租戶',
    'assign-tenant-modal-title': '將 "{{title}}"',
    'field-assignedTenant-label': '指派的租用戶',
    'nav-tenantSelector-label': '租戶',
  },
}

export const zhTw: PluginLanguage = {
  dateFNSKey: 'zh-TW',
  translations: zhTwTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: addCollectionAccess.ts]---
Location: payload-main/packages/plugin-multi-tenant/src/utilities/addCollectionAccess.ts

```typescript
import type { CollectionConfig } from 'payload'

import type { AllAccessKeys, MultiTenantPluginConfig } from '../types.js'

import { withTenantAccess } from './withTenantAccess.js'

export const collectionAccessKeys: AllAccessKeys = [
  'create',
  'read',
  'update',
  'delete',
  'readVersions',
  'unlock',
] as const

type Args<ConfigType> = {
  accessResultCallback?: MultiTenantPluginConfig<ConfigType>['usersAccessResultOverride']
  adminUsersSlug: string
  collection: CollectionConfig
  fieldName: string
  tenantsArrayFieldName?: string
  tenantsArrayTenantFieldName?: string
  userHasAccessToAllTenants: Required<
    MultiTenantPluginConfig<ConfigType>
  >['userHasAccessToAllTenants']
}

/**
 * Adds tenant access constraint to collection
 * - constrains access a users assigned tenants
 */
export const addCollectionAccess = <ConfigType>({
  accessResultCallback,
  adminUsersSlug,
  collection,
  fieldName,
  tenantsArrayFieldName,
  tenantsArrayTenantFieldName,
  userHasAccessToAllTenants,
}: Args<ConfigType>): void => {
  collectionAccessKeys.forEach((key) => {
    if (!collection.access) {
      collection.access = {}
    }
    collection.access[key] = withTenantAccess<ConfigType>({
      accessFunction: collection.access?.[key],
      accessKey: key,
      accessResultCallback,
      adminUsersSlug,
      collection,
      fieldName: key === 'readVersions' ? `version.${fieldName}` : fieldName,
      tenantsArrayFieldName,
      tenantsArrayTenantFieldName,
      userHasAccessToAllTenants,
    })
  })
}
```

--------------------------------------------------------------------------------

````
