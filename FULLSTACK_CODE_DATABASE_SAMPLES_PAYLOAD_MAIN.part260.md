---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 260
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 260 of 695)

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

---[FILE: en.ts]---
Location: payload-main/packages/plugin-seo/src/translations/en.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const en: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Almost there',
    autoGenerate: 'Auto-generate',
    bestPractices: 'best practices',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} chars, ',
    charactersLeftOver: '{{characters}} left over',
    charactersToGo: '{{characters}} to go',
    charactersTooMany: '{{characters}} too many',
    checksPassing: '{{current}}/{{max}} checks are passing',
    good: 'Good',
    imageAutoGenerationTip: 'Auto-generation will retrieve the selected hero image.',
    lengthTipDescription:
      'This should be between {{minLength}} and {{maxLength}} characters. For help in writing quality meta descriptions, see ',
    lengthTipTitle:
      'This should be between {{minLength}} and {{maxLength}} characters. For help in writing quality meta titles, see ',
    missing: 'Missing',
    noImage: 'No image',
    preview: 'Preview',
    previewDescription: 'Exact result listings may vary based on content and search relevancy.',
    tooLong: 'Too long',
    tooShort: 'Too short',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: es.ts]---
Location: payload-main/packages/plugin-seo/src/translations/es.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const es: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Ya casi está',
    autoGenerate: 'Generar automáticamente',
    bestPractices: 'Mejores prácticas',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caracteres, ',
    charactersLeftOver: '{{characters}} restantes',
    charactersToGo: '{{characters}} por completar',
    charactersTooMany: '{{characters}} de más',
    checksPassing: '{{current}}/{{max}} comprobaciones correctas',
    good: 'Bien',
    imageAutoGenerationTip: 'La generación automática recuperará la imagen de héroe seleccionada',
    lengthTipDescription:
      'Debe tener entre {{minLength}} y {{maxLength}} caracteres. Para obtener ayuda sobre cómo escribir meta descripciones de calidad, consulte ',
    lengthTipTitle:
      'Debe tener entre {{minLength}} y {{maxLength}} caracteres. Para obtener ayuda sobre cómo escribir meta títulos de calidad, consulte ',
    missing: 'Faltante',
    noImage: 'Sin imagen',
    preview: 'Vista previa',
    previewDescription:
      'Las resultados exactos pueden variar en función del contenido y la relevancia de la búsqueda.',
    tooLong: 'Demasiado largo',
    tooShort: 'Demasiado corto',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: et.ts]---
Location: payload-main/packages/plugin-seo/src/translations/et.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const et: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Peaaegu kohal',
    autoGenerate: 'Automaatne genereerimine',
    bestPractices: 'parimad tavad',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} tähemärki, ',
    charactersLeftOver: '{{characters}} alles',
    charactersToGo: '{{characters}} kirjutada',
    charactersTooMany: '{{characters}} liiga palju',
    checksPassing: '{{current}}/{{max}} kontrolli on läbitud',
    good: 'Hea',
    imageAutoGenerationTip: 'Automaatne genereerimine toob valitud kangelaspildi.',
    lengthTipDescription:
      'See peaks olema vahemikus {{minLength}} ja {{maxLength}} tähemärki. Kvaliteetsete meta-kirjelduste kirjutamiseks vaata ',
    lengthTipTitle:
      'See peaks olema vahemikus {{minLength}} ja {{maxLength}} tähemärki. Kvaliteetsete meta-pealkirjade kirjutamiseks vaata ',
    missing: 'Puudub',
    noImage: 'Pilt puudub',
    preview: 'Eelvaade',
    previewDescription:
      'Täpsed tulemused võivad varieeruda sõltuvalt sisust ja otsingu asjakohasusest.',
    tooLong: 'Liiga pikk',
    tooShort: 'Liiga lühike',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: fa.ts]---
Location: payload-main/packages/plugin-seo/src/translations/fa.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const fa: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'چیزیی باقی نمونده',
    autoGenerate: 'تولید خودکار',
    bestPractices: 'آموزش بیشتر',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} کلمه، ',
    charactersLeftOver: '{{characters}} باقی مانده',
    charactersToGo: '{{characters}} باقی مانده',
    charactersTooMany: '{{characters}} بیش از حد',
    checksPassing: '{{current}}/{{max}} بررسی‌ها با موفقیت انجام شده است',
    good: 'خوب',
    imageAutoGenerationTip:
      'این قابلیت، تصویر فعلی بارگذاری شده در مجموعه محتوای شما را بازیابی می‌کند',
    lengthTipDescription:
      'این باید بین {{minLength}} و {{maxLength}} کلمه باشد. برای کمک در نوشتن توضیحات متا با کیفیت، مراجعه کنید به ',
    lengthTipTitle:
      'این باید بین {{minLength}} و {{maxLength}} کلمه باشد. برای کمک در نوشتن عناوین متا با کیفیت، مراجعه کنید به ',
    missing: 'ناقص',
    noImage: 'بدون تصویر',
    preview: 'پیش‌نمایش',
    previewDescription: 'فهرست نتایج ممکن است بر اساس محتوا و متناسب با کلمه کلیدی جستجو شده باشند',
    tooLong: 'خیلی طولانی',
    tooShort: 'خیلی کوتاه',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: fr.ts]---
Location: payload-main/packages/plugin-seo/src/translations/fr.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const fr: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'On y est presque',
    autoGenerate: 'Auto-générer',
    bestPractices: 'bonnes pratiques',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caractères, ',
    charactersLeftOver: '{{characters}} restants',
    charactersToGo: '{{characters}} à ajouter',
    charactersTooMany: '{{characters}} en trop',
    checksPassing: '{{current}}/{{max}} vérifications réussies',
    good: 'Bien',
    imageAutoGenerationTip: "L'auto-génération récupérera l'image principale sélectionnée.",
    lengthTipDescription:
      "Ceci devrait contenir entre {{minLength}} et {{maxLength}} caractères. Pour obtenir de l'aide pour rédiger des descriptions meta de qualité, consultez les ",
    lengthTipTitle:
      "Ceci devrait contenir entre {{minLength}} et {{maxLength}} caractères. Pour obtenir de l'aide pour rédiger des titres meta de qualité, consultez les ",
    missing: 'Manquant',
    noImage: "Pas d'image",
    preview: 'Aperçu',
    previewDescription:
      'Les résultats exacts peuvent varier en fonction du contenu et de la pertinence de la recherche.',
    tooLong: 'Trop long',
    tooShort: 'Trop court',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: he.ts]---
Location: payload-main/packages/plugin-seo/src/translations/he.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const he: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'כמעט שם',
    autoGenerate: 'הפקה אוטומטית',
    bestPractices: 'הצעות טובות',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} תו, ',
    charactersLeftOver: '{{characters}} נותרו',
    charactersToGo: '{{characters}} להקליד',
    charactersTooMany: '{{characters}} יותר מידי',
    checksPassing: '{{current}}/{{max}} בדיקות עברו בהצלחה',
    good: 'טוב',
    imageAutoGenerationTip: 'ההפקה האוטומטית תמשוך את התמונה הראשית שנבחרה.',
    lengthTipDescription:
      'זה צריך להיות בין {{minLength}} ו{{maxLength}} תו. לעזרה בכתיבת תיאורי מטא איכותיים, עיין ב-',
    lengthTipTitle:
      'זה צריך להיות בין {{minLength}} ו{{maxLength}} תו. לעזרה בכתיבת כותרות מטא איכותיות, עיין ב-',
    missing: 'חסר',
    noImage: 'אין תמונה',
    preview: 'תצוגה מקדימה',
    previewDescription: 'תוצאות מדויקות עשויות להשתנות בהתאם לתוכן ולרלוונטיות של החיפוש.',
    tooLong: 'ארוך מידי',
    tooShort: 'קצר מידי',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: hr.ts]---
Location: payload-main/packages/plugin-seo/src/translations/hr.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const hr: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Gotovi smo skoro',
    autoGenerate: 'Automatsko generiranje',
    bestPractices: 'najbolje prakse',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} znakova, ',
    charactersLeftOver: '{{characters}} preostalo',
    charactersToGo: '{{characters}} preostalo za unijeti',
    charactersTooMany: '{{characters}} previše',
    checksPassing: '{{current}}/{{max}} provjera prošlo',
    good: 'Dobro',
    imageAutoGenerationTip: 'Automatsko generiranje će preuzeti odabranu sliku heroja.',
    lengthTipDescription:
      'Ovo bi trebalo biti između {{minLength}} i {{maxLength}} znakova. Za pomoć u pisanju kvalitetnih meta opisa, pogledajte ',
    lengthTipTitle:
      'Ovo bi trebalo biti između {{minLength}} i {{maxLength}} znakova. Za pomoć u pisanju kvalitetnih meta naslova, pogledajte ',
    missing: 'Nedostaje',
    noImage: 'Nema slike',
    preview: 'Pregled',
    previewDescription: 'Točni rezultati mogu varirati ovisno o sadržaju i relevantnosti pretrage.',
    tooLong: 'Predugačko',
    tooShort: 'Prekratko',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: hu.ts]---
Location: payload-main/packages/plugin-seo/src/translations/hu.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const hu: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Majdnem kész',
    autoGenerate: 'Automatikus generálás',
    bestPractices: 'legjobb gyakorlatok',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} karakter, ',
    charactersLeftOver: '{{characters}} hátra van',
    charactersToGo: '{{characters}} hátra van a beíráshoz',
    charactersTooMany: '{{characters}} túl sok',
    checksPassing: '{{current}}/{{max}} ellenőrzés sikeres',
    good: 'Jó',
    imageAutoGenerationTip: 'Az automatikus generálás a kiválasztott hős képet fogja lekérni.',
    lengthTipDescription:
      'Ez legyen {{minLength}} és {{maxLength}} karakter között. Segítség a minőségi meta leírások írásához, nézd meg ',
    lengthTipTitle:
      'Ez legyen {{minLength}} és {{maxLength}} karakter között. Segítség a minőségi meta címek írásához, nézd meg ',
    missing: 'Hiányzik',
    noImage: 'Nincs kép',
    preview: 'Előnézet',
    previewDescription:
      'A pontos eredmények változhatnak a tartalom és a keresési relevancia alapján.',
    tooLong: 'Túl hosszú',
    tooShort: 'Túl rövid',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: index.ts]---
Location: payload-main/packages/plugin-seo/src/translations/index.ts

```typescript
import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations'

import { ar } from './ar.js'
import { az } from './az.js'
import { bg } from './bg.js'
import { ca } from './ca.js'
import { cs } from './cs.js'
import { da } from './da.js'
import { de } from './de.js'
import { en } from './en.js'
import { es } from './es.js'
import { et } from './et.js'
import { fa } from './fa.js'
import { fr } from './fr.js'
import { he } from './he.js'
import { hr } from './hr.js'
import { hu } from './hu.js'
import { is } from './is.js'
import { it } from './it.js'
import { ja } from './ja.js'
import { ko } from './ko.js'
import { lt } from './lt.js'
import { my } from './my.js'
import { nb } from './nb.js'
import { nl } from './nl.js'
import { pl } from './pl.js'
import { pt } from './pt.js'
import { ro } from './ro.js'
import { rs } from './rs.js'
import { rsLatin } from './rsLatin.js'
import { ru } from './ru.js'
import { sk } from './sk.js'
import { sl } from './sl.js'
import { sv } from './sv.js'
import { ta } from './ta.js'
import { th } from './th.js'
import { tr } from './tr.js'
import { uk } from './uk.js'
import { vi } from './vi.js'
import { zh } from './zh.js'
import { zhTw } from './zhTw.js'

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
}

export type PluginSEOTranslations = GenericTranslationsObject

export type PluginSEOTranslationKeys = NestedKeysStripped<PluginSEOTranslations>
```

--------------------------------------------------------------------------------

---[FILE: is.ts]---
Location: payload-main/packages/plugin-seo/src/translations/is.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const is: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Næstum komið',
    autoGenerate: 'Mynda sjálfkrafa',
    bestPractices: 'bestu venjur',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} stafir, ',
    charactersLeftOver: '{{characters}} eftir',
    charactersToGo: '{{characters}} eftir',
    charactersTooMany: '{{characters}} of mikið',
    checksPassing: '{{current}}/{{max}} athuganir standast',
    good: 'Gott',
    imageAutoGenerationTip: 'Sjálfvirk myndun mun sækja valda hetjumynd.',
    lengthTipDescription:
      'Þetta ætti að vera á milli {{minLength}} og {{maxLength}} stafir. Fyrir hjálp með að skrifa góða lýsingu, sjáðu ',
    lengthTipTitle:
      'Þetta ætti að vera á milli {{minLength}} og {{maxLength}} stafir. Fyrir hjálp með að skrifa góðan titil, sjáðu ',
    missing: 'Vantar',
    noImage: 'Engin mynd',
    preview: 'Forskoðun',
    previewDescription:
      'Nákvæmar niðurstöður geta verið mismunandi eftir efni og viðeigandi leitar.',
    tooLong: 'Of langt',
    tooShort: 'Of stutt',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: it.ts]---
Location: payload-main/packages/plugin-seo/src/translations/it.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const it: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Ci siamo quasi',
    autoGenerate: 'Generazione automatica',
    bestPractices: 'migliori pratiche',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caratteri, ',
    charactersLeftOver: '{{characters}} rimasti',
    charactersToGo: '{{characters}} mancanti',
    charactersTooMany: '{{characters}} in più',
    checksPassing: '{{current}}/{{max}} controlli superati',
    good: 'Bene',
    imageAutoGenerationTip:
      "La generazione automatica recupererà l'immagine selezionata per l'hero",
    lengthTipDescription:
      'Dovrebbe essere compreso tra {{minLength}} e {{maxLength}} caratteri. Per assistenza nella scrittura di meta descrizioni di qualità, vedere ',
    lengthTipTitle:
      'Dovrebbe essere compreso tra {{minLength}} e {{maxLength}} caratteri. Per assistenza nella scrittura di meta titoli di qualità, vedere ',
    missing: 'Mancante',
    noImage: 'Nessuna Immagine',
    preview: 'Anteprima',
    previewDescription:
      'I risultati esatti possono variare in base al contenuto e alla pertinenza della ricerca.',
    tooLong: 'Troppo lungo',
    tooShort: 'Troppo corto',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ja.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ja.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ja: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'もう少しで完了',
    autoGenerate: '自動生成',
    bestPractices: 'ベストプラクティス',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} 文字, ',
    charactersLeftOver: '{{characters}} 文字残り',
    charactersToGo: '{{characters}} 文字入力する必要があります',
    charactersTooMany: '{{characters}} 文字多すぎ',
    checksPassing: '{{current}}/{{max}} のチェックが合格しています',
    good: '良い',
    imageAutoGenerationTip: '自動生成は、選択されたヒーロー画像を取得します。',
    lengthTipDescription:
      'これは {{minLength}} と {{maxLength}} 文字の間である必要があります。質の高いメタディスクリプションを書くためのヘルプについては、こちらを参照してください ',
    lengthTipTitle:
      'これは {{minLength}} と {{maxLength}} 文字の間である必要があります。質の高いメタタイトルを書くためのヘルプについては、こちらを参照してください ',
    missing: '不足',
    noImage: '画像なし',
    preview: 'プレビュー',
    previewDescription:
      '正確な結果は、コンテンツおよび検索の関連性に基づいて異なる場合があります。',
    tooLong: '長すぎる',
    tooShort: '短すぎる',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ko.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ko.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ko: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: '거의 완료',
    autoGenerate: '자동 생성',
    bestPractices: '모범 사례',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} 자, ',
    charactersLeftOver: '{{characters}} 자 초과',
    charactersToGo: '{{characters}} 자 남음',
    charactersTooMany: '{{characters}} 자 초과',
    checksPassing: '{{current}}/{{max}}개의 검사를 통과했습니다',
    good: '좋음',
    imageAutoGenerationTip: '자동 생성은 선택한 대표 이미지를 가져옵니다.',
    lengthTipDescription:
      '이 값은 {{minLength}}자에서 {{maxLength}}자 사이여야 합니다. 품질 높은 메타 설명 작성에 대한 도움말은 ',
    lengthTipTitle:
      '이 값은 {{minLength}}자에서 {{maxLength}}자 사이여야 합니다. 품질 높은 메타 제목 작성에 대한 도움말은 ',
    missing: '누락됨',
    noImage: '이미지 없음',
    preview: '미리 보기',
    previewDescription: '정확한 검색 결과 목록은 콘텐츠 및 검색 적합성에 따라 달라질 수 있습니다.',
    tooLong: '너무 김',
    tooShort: '너무 짧음',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: lt.ts]---
Location: payload-main/packages/plugin-seo/src/translations/lt.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const lt: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Beveik baigta',
    autoGenerate: 'Automatinis generavimas',
    bestPractices: 'geriausios praktikos',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} simbolių, ',
    charactersLeftOver: '{{characters}} likusių simbolių',
    charactersToGo: '{{characters}} simbolių liko',
    charactersTooMany: '{{characters}} per daug simbolių',
    checksPassing: '{{current}}/{{max}} tikrinimų sėkmingi',
    good: 'Gerai',
    imageAutoGenerationTip: 'Automatinis generavimas paims pasirinktą pagrindinį vaizdą.',
    lengthTipDescription:
      'Šis tekstas turi būti tarp {{minLength}} ir {{maxLength}} simbolių. Norėdami gauti pagalbos rašant kokybiškus meta aprašus, žiūrėkite ',
    lengthTipTitle:
      'Šis tekstas turi būti tarp {{minLength}} ir {{maxLength}} simbolių. Norėdami gauti pagalbos rašant kokybiškus meta pavadinimus, žiūrėkite ',
    missing: 'Trūksta',
    noImage: 'Nėra vaizdo',
    preview: 'Peržiūra',
    previewDescription:
      'Tikrųjų paieškos rezultatų gali skirtis priklausomai nuo turinio ir paieškos svarbos.',
    tooLong: 'Per ilgas',
    tooShort: 'Per trumpas',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: my.ts]---
Location: payload-main/packages/plugin-seo/src/translations/my.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const my: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'နည်းနည်းပဲကျန်သေးသည်',
    autoGenerate: 'အလိုအလျောက်ထုတ်လုပ်မည်',
    bestPractices: 'အကောင်းဆုံးအကဲဖြတ်မှုများ',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} လုံး, ',
    charactersLeftOver: '{{characters}} လုံးကျော်နေသည်',
    charactersToGo: '{{characters}} လုံးလိုသေးသည်',
    charactersTooMany: '{{characters}} လုံးများသွားသည်',
    checksPassing: '{{current}}/{{max}} စစ်ဆေးမှုအောင်မြင်ခဲ့သည်',
    good: 'ကောင်းမွန်သည်',
    imageAutoGenerationTip: 'အလိုအလျောက်ထုတ်လုပ်မှုသည် ရွေးချယ်ထားသော ဟီးရိုးပုံကိုယူမည်။',
    lengthTipDescription:
      'ဤအကြောင်းအရာသည် {{minLength}} နှင့် {{maxLength}} အကြားရှိသင့်သည်။ အရည်အသွေးမြင့် meta ဖော်ပြချက်ရေးသားရန်အတွက်အကြံဉာဏ်များကို ကြည့်ရန် ',
    lengthTipTitle:
      'ဤအကြောင်းအရာသည် {{minLength}} နှင့် {{maxLength}} အကြားရှိသင့်သည်။ အရည်အသွေးမြင့် meta ခေါင်းစဉ်ရေးသားရန်အတွက်အကြံဉာဏ်များကို ကြည့်ရန် ',
    missing: 'ပျောက်နေသည်',
    noImage: 'ပုံမရှိပါ',
    preview: 'မကြိုတင်ကြည့်ရှုနိုင်ပါ',
    previewDescription:
      'တိကျသော ရှာဖွေမှုရလဒ်များသည် အကြောင်းအရာနှင့် ရှာဖွေရေးအသင့်တော်မှုပေါ်မူတည်၍ မတူကွဲပြားနိုင်သည်။',
    tooLong: 'တော်တော်ကြာသည်',
    tooShort: 'တော်တော်တိုသည်',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: nb.ts]---
Location: payload-main/packages/plugin-seo/src/translations/nb.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const nb: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Nesten der',
    autoGenerate: 'Auto-generer',
    bestPractices: 'beste praksis',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} tegn, ',
    charactersLeftOver: '{{characters}} til overs',
    charactersToGo: '{{characters}} igjen',
    charactersTooMany: '{{characters}} for mange',
    checksPassing: '{{current}}/{{max}} sjekker bestått',
    good: 'Bra',
    imageAutoGenerationTip: 'Auto-generering vil hente det valgte hero-bildet.',
    lengthTipDescription:
      'Dette bør være mellom {{minLength}} og {{maxLength}} tegn. For hjelp til å skrive beskrivelser av god kvalitet, se ',
    lengthTipTitle:
      'Dette bør være mellom {{minLength}} og {{maxLength}} tegn. For hjelp til å skrive metatitler av god kvalitet, se ',
    missing: 'Mangler',
    noImage: 'Bilde mangler',
    preview: 'Forhåndsvisning',
    previewDescription:
      'Eksakte resultatoppføringer kan variere basert på innhold og søke relevans.',
    tooLong: 'For lang',
    tooShort: 'For kort',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: nl.ts]---
Location: payload-main/packages/plugin-seo/src/translations/nl.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const nl: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Bijna klaar',
    autoGenerate: 'Automatisch genereren',
    bestPractices: 'best practices',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} tekens, ',
    charactersLeftOver: '{{characters}} tekens over',
    charactersToGo: '{{characters}} tekens te gaan',
    charactersTooMany: '{{characters}} tekens te veel',
    checksPassing: '{{current}}/{{max}} controles geslaagd',
    good: 'Goed',
    imageAutoGenerationTip: 'Automatische generatie haalt de geselecteerde hero-afbeelding op.',
    lengthTipDescription:
      'Dit moet tussen {{minLength}} en {{maxLength}} tekens lang zijn. Voor hulp bij het schrijven van kwalitatieve metabeschrijvingen, zie ',
    lengthTipTitle:
      'Dit moet tussen {{minLength}} en {{maxLength}} tekens lang zijn. Voor hulp bij het schrijven van kwalitatieve metatitels, zie ',
    missing: 'Ontbreekt',
    noImage: 'Geen afbeelding',
    preview: 'Voorbeeld',
    previewDescription:
      'Exacte zoekresultaten kunnen variëren op basis van inhoud en zoekrelevantie.',
    tooLong: 'Te lang',
    tooShort: 'Te kort',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pl.ts]---
Location: payload-main/packages/plugin-seo/src/translations/pl.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const pl: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Prawie gotowe',
    autoGenerate: 'Wygeneruj automatycznie',
    bestPractices: 'najlepsze praktyki',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} znaków, ',
    charactersLeftOver: 'zostało {{characters}} znaków',
    charactersToGo: 'pozostało {{characters}} znaków',
    charactersTooMany: '{{characters}} znaków za dużo',
    checksPassing: '{{current}}/{{max}} testów zakończonych pomyślnie',
    good: 'Dobrze',
    imageAutoGenerationTip: 'Automatyczne generowanie pobierze wybrany główny obraz.',
    lengthTipDescription:
      'Długość powinna wynosić od {{minLength}} do {{maxLength}} znaków. Po porady dotyczące pisania wysokiej jakości meta opisów zobacz ',
    lengthTipTitle:
      'Długość powinna wynosić od {{minLength}} do {{maxLength}} znaków. Po porady dotyczące pisania wysokiej jakości meta tytułów zobacz ',
    missing: 'Brakuje',
    noImage: 'Brak obrazu',
    preview: 'Podgląd',
    previewDescription:
      'Dokładne wyniki listowania mogą się różnić w zależności od treści i zgodności z kryteriami wyszukiwania.',
    tooLong: 'Zbyt długie',
    tooShort: 'Zbyt krótkie',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: pt.ts]---
Location: payload-main/packages/plugin-seo/src/translations/pt.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const pt: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Quase lá',
    autoGenerate: 'Gerar automaticamente',
    bestPractices: 'melhores práticas',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caracteres, ',
    charactersLeftOver: '{{characters}} caracteres a mais',
    charactersToGo: '{{characters}} caracteres restantes',
    charactersTooMany: '{{characters}} caracteres em excesso',
    checksPassing: '{{current}}/{{max}} verificações aprovadas',
    good: 'Bom',
    imageAutoGenerationTip: 'A geração automática buscará a imagem destacada selecionada.',
    lengthTipDescription:
      'Isso deve ter entre {{minLength}} e {{maxLength}} caracteres. Para obter ajuda na escrita de descrições meta de qualidade, veja ',
    lengthTipTitle:
      'Isso deve ter entre {{minLength}} e {{maxLength}} caracteres. Para obter ajuda na escrita de títulos meta de qualidade, veja ',
    missing: 'Ausente',
    noImage: 'Nenhuma imagem',
    preview: 'Pré-visualização',
    previewDescription:
      'Os resultados exatos podem variar com base no conteúdo e na relevância da pesquisa.',
    tooLong: 'Muito longo',
    tooShort: 'Muito curto',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ro.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ro.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ro: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Aproape gata',
    autoGenerate: 'Generare automată',
    bestPractices: 'bune practici',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} caractere, ',
    charactersLeftOver: '{{characters}} caractere în plus',
    charactersToGo: '{{characters}} caractere rămase',
    charactersTooMany: '{{characters}} caractere prea multe',
    checksPassing: '{{current}}/{{max}} verificări trecute',
    good: 'Bun',
    imageAutoGenerationTip: 'Generarea automată va prelua imaginea reprezentativă selectată.',
    lengthTipDescription:
      'Aceasta ar trebui să aibă între {{minLength}} și {{maxLength}} caractere. Pentru ajutor în redactarea descrierilor meta de calitate, vezi ',
    lengthTipTitle:
      'Aceasta ar trebui să aibă între {{minLength}} și {{maxLength}} caractere. Pentru ajutor în redactarea titlurilor meta de calitate, vezi ',
    missing: 'Lipsește',
    noImage: 'Nicio imagine',
    preview: 'Previzualizare',
    previewDescription:
      'Rezultatele exacte pot varia în funcție de conținut și relevanța căutării.',
    tooLong: 'Prea lung',
    tooShort: 'Prea scurt',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rs.ts]---
Location: payload-main/packages/plugin-seo/src/translations/rs.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const rs: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Скоро готово',
    autoGenerate: 'Аутоматски генериши',
    bestPractices: 'најбоље праксе',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} карактера, ',
    charactersLeftOver: '{{characters}} карактера вишка',
    charactersToGo: '{{characters}} карактера преостало',
    charactersTooMany: '{{characters}} карактера превише',
    checksPassing: '{{current}}/{{max}} провера успешно прошло',
    good: 'Добро',
    imageAutoGenerationTip: 'Аутоматско генерисање ће преузети изабрану херо слику.',
    lengthTipDescription:
      'Ово треба да има између {{minLength}} и {{maxLength}} карактера. За помоћ у писању квалитетних мета описа, погледајте ',
    lengthTipTitle:
      'Ово треба да има између {{minLength}} и {{maxLength}} карактера. За помоћ у писању квалитетних мета наслова, погледајте ',
    missing: 'Недостаје',
    noImage: 'Нема слике',
    preview: 'Преглед',
    previewDescription:
      'Тачни резултати претраге могу варирати у зависности од садржаја и релевантности претраге.',
    tooLong: 'Предугачко',
    tooShort: 'Прекратко',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: rsLatin.ts]---
Location: payload-main/packages/plugin-seo/src/translations/rsLatin.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const rsLatin: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Skoro gotovo',
    autoGenerate: 'Automatski generiši',
    bestPractices: 'najbolje prakse',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} karaktera, ',
    charactersLeftOver: '{{characters}} karaktera viška',
    charactersToGo: '{{characters}} karaktera preostalo',
    charactersTooMany: '{{characters}} karaktera previše',
    checksPassing: '{{current}}/{{max}} provera uspešno prošlo',
    good: 'Dobro',
    imageAutoGenerationTip: 'Automatsko generisanje će preuzeti izabranu hero sliku.',
    lengthTipDescription:
      'Ovo treba da ima između {{minLength}} i {{maxLength}} karaktera. Za pomoć u pisanju kvalitetnih meta opisa, pogledajte ',
    lengthTipTitle:
      'Ovo treba da ima između {{minLength}} i {{maxLength}} karaktera. Za pomoć u pisanju kvalitetnih meta naslova, pogledajte ',
    missing: 'Nedostaje',
    noImage: 'Nema slike',
    preview: 'Pregled',
    previewDescription:
      'Tačni rezultati pretrage mogu varirati u zavisnosti od sadržaja i relevantnosti pretrage.',
    tooLong: 'Predugačko',
    tooShort: 'Prekratko',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ru.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ru.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ru: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Почти готово',
    autoGenerate: 'Сгенерировать автоматически',
    bestPractices: 'лучшие практики',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} символов, ',
    charactersLeftOver: 'осталось {{characters}} символов',
    charactersToGo: 'на {{characters}} символов меньше',
    charactersTooMany: 'на {{characters}} символов больше',
    checksPassing: '{{current}}/{{max}} проверок пройдено',
    good: 'Хорошо',
    imageAutoGenerationTip: 'Автогенерация использует выбранное главное изображение.',
    lengthTipDescription:
      'Должно быть от {{minLength}} до {{maxLength}} символов. Для помощи в написании качественных метаописаний см.',
    lengthTipTitle:
      'Должно быть от {{minLength}} до {{maxLength}} символов. Для помощи в написании качественных метазаголовков см.',
    missing: 'Отсутствует',
    noImage: 'Нет изображения',
    preview: 'Предварительный просмотр',
    previewDescription:
      'Фактические результаты могут отличаться в зависимости от контента и релевантности поиска.',
    tooLong: 'Слишком длинно',
    tooShort: 'Слишком коротко',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sk.ts]---
Location: payload-main/packages/plugin-seo/src/translations/sk.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const sk: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Takmer hotovo',
    autoGenerate: 'Automaticky generovať',
    bestPractices: 'najlepšie postupy',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} znakov, ',
    charactersLeftOver: '{{characters}} znakov navyše',
    charactersToGo: 'Ešte {{characters}} znakov',
    charactersTooMany: '{{characters}} znakov navyše',
    checksPassing: '{{current}}/{{max}} kontrol prešlo',
    good: 'Dobre',
    imageAutoGenerationTip: 'Automatické generovanie načíta vybraný hlavný obrázok.',
    lengthTipDescription:
      'Tento text by mal mať medzi {{minLength}} a {{maxLength}} znakmi. Ak potrebujete pomoc s písaním kvalitných meta popisov, pozrite si ',
    lengthTipTitle:
      'Tento text by mal mať medzi {{minLength}} a {{maxLength}} znakmi. Ak potrebujete pomoc s písaním kvalitných meta nadpisov, pozrite si ',
    missing: 'Chýba',
    noImage: 'Žiadny obrázok',
    preview: 'Náhľad',
    previewDescription:
      'Presné výsledky vyhľadávania sa môžu líšiť v závislosti od obsahu a relevantnosti vyhľadávania.',
    tooLong: 'Príliš dlhé',
    tooShort: 'Príliš krátke',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sl.ts]---
Location: payload-main/packages/plugin-seo/src/translations/sl.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const sl: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Skoraj končano',
    autoGenerate: 'Samodejno generiranje',
    bestPractices: 'najboljše prakse',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} znakov, ',
    charactersLeftOver: '{{characters}} znakov preveč',
    charactersToGo: '{{characters}} znakov preostalo',
    charactersTooMany: '{{characters}} znakov preveč',
    checksPassing: '{{current}}/{{max}} preverjanj je uspelo',
    good: 'Dobro',
    imageAutoGenerationTip: 'Samodejno generiranje bo preneslo izbrano glavno sliko.',
    lengthTipDescription:
      'To naj bo dolgo med {{minLength}} in {{maxLength}} znakov. Za pomoč pri pisanju kakovostnih meta opisov si oglejte ',
    lengthTipTitle:
      'To naj bo dolgo med {{minLength}} in {{maxLength}} znakov. Za pomoč pri pisanju kakovostnih meta naslovov si oglejte ',
    missing: 'Manjkajoče',
    noImage: 'Brez slike',
    preview: 'Predogled',
    previewDescription:
      'Natančni rezultati iskanja se lahko razlikujejo glede na vsebino in relevantnost iskanja.',
    tooLong: 'Presega dovoljeno dolžino',
    tooShort: 'Prekratka dolžina',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: sv.ts]---
Location: payload-main/packages/plugin-seo/src/translations/sv.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const sv: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'Nästan klar',
    autoGenerate: 'Skapa automatiskt',
    bestPractices: 'bästa praxis',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} tecken, ',
    charactersLeftOver: '{{characters}} tecken blir över',
    charactersToGo: '{{characters}} tecken kvar',
    charactersTooMany: '{{characters}} tecken för mycket',
    checksPassing: '{{current}}/{{max}} kontroller är godkända',
    good: 'Bra',
    imageAutoGenerationTip: 'Den automatiska processen kommer att välja en hero-bild.',
    lengthTipDescription:
      'Bör vara mellan {{minLength}} och {{maxLength}} tecken. För hjälp med att skriva bra metabeskrivningar, se ',
    lengthTipTitle:
      'Bör vara mellan {{minLength}} och {{maxLength}} tecken. För hjälp med att skriva bra metatitlar, se ',
    missing: 'Saknas',
    noImage: 'Ingen bild',
    preview: 'Förhandsgranska',
    previewDescription:
      'Exakta resultatlistningar kan variera baserat på innehåll och sökrelevans.',
    tooLong: 'För lång',
    tooShort: 'För kort',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: ta.ts]---
Location: payload-main/packages/plugin-seo/src/translations/ta.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const ta: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'கிட்டத்தட்ட முடிந்துவிட்டது',
    autoGenerate: 'தானாக உருவாக்கு',
    bestPractices: 'சிறந்த நடைமுறைகள்',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} எழுத்துகள், ',
    charactersLeftOver: '{{characters}} மீதம் உள்ளது',
    charactersToGo: '{{characters}} எழுத வேண்டும்',
    charactersTooMany: '{{characters}} அதிகமாக உள்ளது',
    checksPassing: '{{current}}/{{max}} சோதனைகள் வெற்றி',
    good: 'நன்று',
    imageAutoGenerationTip: 'தானியங்கு உருவாக்கம் தேர்ந்தெடுக்கப்பட்ட முக்கியப் படத்தை எடுக்கும்.',
    lengthTipDescription:
      'இது {{minLength}} மற்றும் {{maxLength}} எழுத்துகளுக்கு இடையில் இருக்க வேண்டும். தரமான மெட்டா விளக்கங்களை எழுத உதவிக்கு பார்க்கவும் ',
    lengthTipTitle:
      'இது {{minLength}} மற்றும் {{maxLength}} எழுத்துகளுக்கு இடையில் இருக்க வேண்டும். தரமான மெட்டா தலைப்புகளை எழுத உதவிக்கு பார்க்கவும் ',
    missing: 'இல்லை',
    noImage: 'படம் இல்லை',
    preview: 'முன்னோட்டம்',
    previewDescription:
      'சரியான முடிவு பட்டியல்கள் உள்ளடக்கம் மற்றும் தேடல் தொடர்புக்கு ஏற்ப மாறலாம்.',
    tooLong: 'மிக நீளம்',
    tooShort: 'மிகக் குறைவு',
  },
}
```

--------------------------------------------------------------------------------

---[FILE: th.ts]---
Location: payload-main/packages/plugin-seo/src/translations/th.ts

```typescript
import type { GenericTranslationsObject } from '@payloadcms/translations'

export const th: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'plugin-seo': {
    almostThere: 'เกือบเสร็จแล้ว',
    autoGenerate: 'สร้างอัตโนมัติ',
    bestPractices: 'แนวปฏิบัติที่ดีที่สุด',
    characterCount: '{{current}}/{{minLength}}-{{maxLength}} ตัวอักษร, ',
    charactersLeftOver: '{{characters}} ตัวอักษรที่เหลือ',
    charactersToGo: '{{characters}} ตัวอักษรที่ต้องการ',
    charactersTooMany: '{{characters}} ตัวอักษรเกินไป',
    checksPassing: '{{current}}/{{max}} การตรวจสอบสำเร็จ',
    good: 'ดี',
    imageAutoGenerationTip: 'การสร้างอัตโนมัติจะดึงภาพหลักที่เลือก',
    lengthTipDescription:
      'ข้อความนี้ควรมีระหว่าง {{minLength}} และ {{maxLength}} ตัวอักษร สำหรับคำแนะนำในการเขียนคำอธิบายเมตาคุณภาพสูง โปรดดูที่ ',
    lengthTipTitle:
      'ข้อความนี้ควรมีระหว่าง {{minLength}} และ {{maxLength}} ตัวอักษร สำหรับคำแนะนำในการเขียนหัวข้อเมตาคุณภาพสูง โปรดดูที่ ',
    missing: 'ขาดหายไป',
    noImage: 'ไม่มีภาพ',
    preview: 'ตัวอย่าง',
    previewDescription:
      'ผลลัพธ์การค้นหาที่แท้จริงอาจแตกต่างกันไปตามเนื้อหาและความเกี่ยวข้องของการค้นหา',
    tooLong: 'ยาวเกินไป',
    tooShort: 'สั้นเกินไป',
  },
}
```

--------------------------------------------------------------------------------

````
