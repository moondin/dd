---
source_txt: fullstack_samples/payload-main
converted_utc: 2025-12-18T13:05:12Z
part: 244
parts_total: 695
---

# FULLSTACK CODE DATABASE SAMPLES payload-main

## Verbatim Content (Part 244 of 695)

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

---[FILE: ko.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ko.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const koTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: '모든 지역 설정',
    exportDocumentLabel: '{{label}} 내보내기',
    exportOptions: '수출 옵션',
    'field-depth-label': '깊이',
    'field-drafts-label': '초안을 포함하십시오.',
    'field-fields-label': '필드',
    'field-format-label': '수출 형식',
    'field-limit-label': '한계',
    'field-locale-label': '지역',
    'field-name-label': '파일 이름',
    'field-page-label': '페이지',
    'field-selectionToUse-label': '사용할 선택',
    'field-sort-label': '정렬 방식',
    'field-sort-order-label': '정렬 순서',
    'selectionToUse-allDocuments': '모든 문서를 사용하십시오.',
    'selectionToUse-currentFilters': '현재 필터를 사용하십시오.',
    'selectionToUse-currentSelection': '현재 선택 항목을 사용하십시오.',
    totalDocumentsCount: '{{count}}개의 총 문서',
  },
}

export const ko: PluginLanguage = {
  dateFNSKey: 'ko',
  translations: koTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: lt.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/lt.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ltTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Visos vietovės',
    exportDocumentLabel: 'Eksportuoti {{label}}',
    exportOptions: 'Eksporto parinktys',
    'field-depth-label': 'Gylis',
    'field-drafts-label': 'Įtraukite juodraščius',
    'field-fields-label': 'Laukai',
    'field-format-label': 'Eksporto formatas',
    'field-limit-label': 'Ribos',
    'field-locale-label': 'Lokalė',
    'field-name-label': 'Failo pavadinimas',
    'field-page-label': 'Puslapis',
    'field-selectionToUse-label': 'Naudojimo pasirinkimas',
    'field-sort-label': 'Rūšiuoti pagal',
    'field-sort-order-label': 'Rūšiavimo tvarka',
    'selectionToUse-allDocuments': 'Naudokite visus dokumentus.',
    'selectionToUse-currentFilters': 'Naudoti esamus filtrus',
    'selectionToUse-currentSelection': 'Naudoti dabartinį pasirinkimą',
    totalDocumentsCount: '{{count}} viso dokumentų',
  },
}

export const lt: PluginLanguage = {
  dateFNSKey: 'lt',
  translations: ltTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: lv.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/lv.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const lvTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Visas lokalitātes',
    exportDocumentLabel: 'Eksportēt {{label}}',
    exportOptions: 'Eksportēšanas opcijas',
    'field-depth-label': 'Dziļums',
    'field-drafts-label': 'Iekļaut melnrakstus',
    'field-fields-label': 'Lauki',
    'field-format-label': 'Eksporta formāts',
    'field-limit-label': 'Limits',
    'field-locale-label': 'Lokalizācija',
    'field-name-label': 'Faila nosaukums',
    'field-page-label': 'Lapa',
    'field-selectionToUse-label': 'Izvēles lietošana',
    'field-sort-label': 'Kārtot pēc',
    'field-sort-order-label': 'Kārtot pēc secības',
    'selectionToUse-allDocuments': 'Izmantojiet visus dokumentus',
    'selectionToUse-currentFilters': 'Izmantot pašreizējos filtrus',
    'selectionToUse-currentSelection': 'Izmantot pašreizējo izvēli',
    totalDocumentsCount: '{{count}} kopā dokumenti',
  },
}

export const lv: PluginLanguage = {
  dateFNSKey: 'lv',
  translations: lvTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: my.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/my.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const myTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'အားလုံးနေရာတွင်',
    exportDocumentLabel: 'Eksport {{label}}',
    exportOptions: 'Pilihan Eksport',
    'field-depth-label': 'အန္တိုင်း',
    'field-drafts-label': 'မူကြမ်းများပါဝင်ပါ',
    'field-fields-label': 'ကွင်းပျိုးရန်ကွက်များ',
    'field-format-label': 'တင်ပို့နည်းအစီအစဉ်',
    'field-limit-label': 'ကန့်သတ်ချက်',
    'field-locale-label': 'Tempatan',
    'field-name-label': 'ဖိုင်နာမည်',
    'field-page-label': 'စာမျက်နှာ',
    'field-selectionToUse-label': 'Pilihan untuk digunakan',
    'field-sort-label': 'စီမံအလိုက်',
    'field-sort-order-label': 'Sorteringsrækkefølge',
    'selectionToUse-allDocuments': 'Gunakan semua dokumen',
    'selectionToUse-currentFilters': 'Gunakan penapis semasa',
    'selectionToUse-currentSelection': 'Gunakan pilihan semasa',
    totalDocumentsCount: '{{count}} keseluruhan dokumen',
  },
}

export const my: PluginLanguage = {
  dateFNSKey: 'en-US',
  translations: myTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: nb.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/nb.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const nbTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Alle steder',
    exportDocumentLabel: 'Eksporter {{label}}',
    exportOptions: 'Eksportalternativer',
    'field-depth-label': 'Dybde',
    'field-drafts-label': 'Inkluder utkast',
    'field-fields-label': 'Felt',
    'field-format-label': 'Eksportformat',
    'field-limit-label': 'Begrensning',
    'field-locale-label': 'Lokal',
    'field-name-label': 'Filnavn',
    'field-page-label': 'Side',
    'field-selectionToUse-label': 'Valg til bruk',
    'field-sort-label': 'Sorter etter',
    'field-sort-order-label': 'Sorteringsrekkefølge',
    'selectionToUse-allDocuments': 'Bruk alle dokumentene',
    'selectionToUse-currentFilters': 'Bruk gjeldende filtre',
    'selectionToUse-currentSelection': 'Bruk gjeldende utvalg',
    totalDocumentsCount: '{{count}} totalt dokumenter',
  },
}

export const nb: PluginLanguage = {
  dateFNSKey: 'nb',
  translations: nbTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: nl.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/nl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const nlTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Alle locaties',
    exportDocumentLabel: 'Exporteer {{label}}',
    exportOptions: 'Exportmogelijkheden',
    'field-depth-label': 'Diepte',
    'field-drafts-label': 'Voeg ontwerpen toe',
    'field-fields-label': 'Velden',
    'field-format-label': 'Exportformaat',
    'field-limit-label': 'Limiet',
    'field-locale-label': 'Lokale',
    'field-name-label': 'Bestandsnaam',
    'field-page-label': 'Pagina',
    'field-selectionToUse-label': 'Selectie om te gebruiken',
    'field-sort-label': 'Sorteer op',
    'field-sort-order-label': 'Sorteer volgorde',
    'selectionToUse-allDocuments': 'Gebruik alle documenten',
    'selectionToUse-currentFilters': 'Gebruik huidige filters',
    'selectionToUse-currentSelection': 'Gebruik huidige selectie',
    totalDocumentsCount: '{{count}} totaal aantal documenten',
  },
}

export const nl: PluginLanguage = {
  dateFNSKey: 'nl',
  translations: nlTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: pl.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/pl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const plTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Wszystkie lokalizacje',
    exportDocumentLabel: 'Eksportuj {{label}}',
    exportOptions: 'Opcje eksportu',
    'field-depth-label': 'Głębokość',
    'field-drafts-label': 'Dołącz szkice',
    'field-fields-label': 'Pola',
    'field-format-label': 'Format eksportu',
    'field-limit-label': 'Limit',
    'field-locale-label': 'Lokalizacja',
    'field-name-label': 'Nazwa pliku',
    'field-page-label': 'Strona',
    'field-selectionToUse-label': 'Wybór do użycia',
    'field-sort-label': 'Sortuj według',
    'field-sort-order-label': 'Sortowanie według',
    'selectionToUse-allDocuments': 'Użyj wszystkich dokumentów.',
    'selectionToUse-currentFilters': 'Użyj aktualnych filtrów',
    'selectionToUse-currentSelection': 'Użyj aktualnego wyboru',
    totalDocumentsCount: '{{count}} łączna liczba dokumentów',
  },
}

export const pl: PluginLanguage = {
  dateFNSKey: 'pl',
  translations: plTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: pt.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/pt.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ptTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Todos os locais',
    exportDocumentLabel: 'Exportar {{label}}',
    exportOptions: 'Opções de Exportação',
    'field-depth-label': 'Profundidade',
    'field-drafts-label': 'Incluir rascunhos',
    'field-fields-label': 'Campos',
    'field-format-label': 'Formato de Exportação',
    'field-limit-label': 'Limite',
    'field-locale-label': 'Localização',
    'field-name-label': 'Nome do arquivo',
    'field-page-label': 'Página',
    'field-selectionToUse-label': 'Seleção para usar',
    'field-sort-label': 'Ordenar por',
    'field-sort-order-label': 'Ordem de classificação',
    'selectionToUse-allDocuments': 'Use todos os documentos',
    'selectionToUse-currentFilters': 'Use os filtros atuais',
    'selectionToUse-currentSelection': 'Use a seleção atual',
    totalDocumentsCount: '{{count}} documentos totais',
  },
}

export const pt: PluginLanguage = {
  dateFNSKey: 'pt',
  translations: ptTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rn.sh]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/rn.sh

```bash
for file in *.js; do
    mv -- "$file" "${file%.js}.ts"
done
```

--------------------------------------------------------------------------------

---[FILE: ro.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ro.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const roTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Toate locațiile',
    exportDocumentLabel: 'Export {{label}}',
    exportOptions: 'Opțiuni de export',
    'field-depth-label': 'Adâncime',
    'field-drafts-label': 'Includează schițe',
    'field-fields-label': 'Campuri',
    'field-format-label': 'Format de export',
    'field-limit-label': 'Limită',
    'field-locale-label': 'Localizare',
    'field-name-label': 'Numele fișierului',
    'field-page-label': 'Pagina',
    'field-selectionToUse-label': 'Selectarea pentru utilizare',
    'field-sort-label': 'Sortează după',
    'field-sort-order-label': 'Ordine de sortare',
    'selectionToUse-allDocuments': 'Utilizați toate documentele.',
    'selectionToUse-currentFilters': 'Utilizați filtrele curente',
    'selectionToUse-currentSelection': 'Utilizați selecția curentă',
    totalDocumentsCount: '{{count}} documente totale',
  },
}

export const ro: PluginLanguage = {
  dateFNSKey: 'ro',
  translations: roTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rs.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/rs.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const rsTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Sve lokacije',
    exportDocumentLabel: 'Извоз {{label}}',
    exportOptions: 'Опције извоза',
    'field-depth-label': 'Dubina',
    'field-drafts-label': 'Uključite nacrte',
    'field-fields-label': 'Polja',
    'field-format-label': 'Format izvoza',
    'field-limit-label': 'Ograničenje',
    'field-locale-label': 'Локалитет',
    'field-name-label': 'Ime datoteke',
    'field-page-label': 'Strana',
    'field-selectionToUse-label': 'Izbor za upotrebu',
    'field-sort-label': 'Sortiraj po',
    'field-sort-order-label': 'Redoslijed sortiranja',
    'selectionToUse-allDocuments': 'Koristite sve dokumente',
    'selectionToUse-currentFilters': 'Koristite trenutne filtere',
    'selectionToUse-currentSelection': 'Koristite trenutni izbor',
    totalDocumentsCount: '{{count}} ukupno dokumenata',
  },
}

export const rs: PluginLanguage = {
  dateFNSKey: 'rs',
  translations: rsTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: rsLatin.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/rsLatin.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const rsLatinTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Sve lokalne postavke',
    exportDocumentLabel: 'Izvoz {{label}}',
    exportOptions: 'Opcije izvoza',
    'field-depth-label': 'Dubina',
    'field-drafts-label': 'Uključite nacrte',
    'field-fields-label': 'Polja',
    'field-format-label': 'Format izvoza',
    'field-limit-label': 'Ograničenje',
    'field-locale-label': 'Lokalitet',
    'field-name-label': 'Ime datoteke',
    'field-page-label': 'Strana',
    'field-selectionToUse-label': 'Izbor za upotrebu',
    'field-sort-label': 'Sortiraj po',
    'field-sort-order-label': 'Redoslijed sortiranja',
    'selectionToUse-allDocuments': 'Koristite sve dokumente',
    'selectionToUse-currentFilters': 'Koristite trenutne filtere',
    'selectionToUse-currentSelection': 'Koristi trenutni izbor',
    totalDocumentsCount: '{{count}} ukupno dokumenata',
  },
}

export const rsLatin: PluginLanguage = {
  dateFNSKey: 'rs-Latin',
  translations: rsLatinTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ru.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ru.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ruTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Все локали',
    exportDocumentLabel: 'Экспорт {{label}}',
    exportOptions: 'Опции экспорта',
    'field-depth-label': 'Глубина',
    'field-drafts-label': 'Включить черновики',
    'field-fields-label': 'Поля',
    'field-format-label': 'Формат экспорта',
    'field-limit-label': 'Лимит',
    'field-locale-label': 'Локаль',
    'field-name-label': 'Имя файла',
    'field-page-label': 'Страница',
    'field-selectionToUse-label': 'Выбор использования',
    'field-sort-label': 'Сортировать по',
    'field-sort-order-label': 'Порядок сортировки',
    'selectionToUse-allDocuments': 'Используйте все документы',
    'selectionToUse-currentFilters': 'Использовать текущие фильтры',
    'selectionToUse-currentSelection': 'Использовать текущий выбор',
    totalDocumentsCount: '{{count}} общее количество документов',
  },
}

export const ru: PluginLanguage = {
  dateFNSKey: 'ru',
  translations: ruTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sk.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/sk.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const skTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Všetky miestne nastavenia',
    exportDocumentLabel: 'Export {{label}}',
    exportOptions: 'Možnosti exportu',
    'field-depth-label': 'Hĺbka',
    'field-drafts-label': 'Zahrnúť návrhy',
    'field-fields-label': 'Polia',
    'field-format-label': 'Formát exportu',
    'field-limit-label': 'Limit',
    'field-locale-label': 'Lokalita',
    'field-name-label': 'Názov súboru',
    'field-page-label': 'Stránka',
    'field-selectionToUse-label': 'Výber na použitie',
    'field-sort-label': 'Triediť podľa',
    'field-sort-order-label': 'Poradie triedenia',
    'selectionToUse-allDocuments': 'Použite všetky dokumenty',
    'selectionToUse-currentFilters': 'Použiť aktuálne filtre',
    'selectionToUse-currentSelection': 'Použiť aktuálny výber',
    totalDocumentsCount: '{{count}} celkový počet dokumentov',
  },
}

export const sk: PluginLanguage = {
  dateFNSKey: 'sk',
  translations: skTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sl.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/sl.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const slTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Vse lokacije',
    exportDocumentLabel: 'Izvozi {{label}}',
    exportOptions: 'Možnosti izvoza',
    'field-depth-label': 'Globina',
    'field-drafts-label': 'Vključi osnutke',
    'field-fields-label': 'Polja',
    'field-format-label': 'Format izvoza',
    'field-limit-label': 'Omejitev',
    'field-locale-label': 'Lokalno',
    'field-name-label': 'Ime datoteke',
    'field-page-label': 'Stran',
    'field-selectionToUse-label': 'Izbor za uporabo',
    'field-sort-label': 'Razvrsti po',
    'field-sort-order-label': 'Razvrsti po vrstnem redu',
    'selectionToUse-allDocuments': 'Uporabite vse dokumente',
    'selectionToUse-currentFilters': 'Uporabite trenutne filtre.',
    'selectionToUse-currentSelection': 'Uporabi trenutno izbiro',
    totalDocumentsCount: '{{count}} skupno dokumentov',
  },
}

export const sl: PluginLanguage = {
  dateFNSKey: 'sl-SI',
  translations: slTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: sv.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/sv.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const svTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Alla platser',
    exportDocumentLabel: 'Exportera {{label}}',
    exportOptions: 'Exportalternativ',
    'field-depth-label': 'Djup',
    'field-drafts-label': 'Inkludera utkast',
    'field-fields-label': 'Fält',
    'field-format-label': 'Exportformat',
    'field-limit-label': 'Begränsning',
    'field-locale-label': 'Lokal',
    'field-name-label': 'Filnamn',
    'field-page-label': 'Sida',
    'field-selectionToUse-label': 'Val att använda',
    'field-sort-label': 'Sortera efter',
    'field-sort-order-label': 'Sortera i ordning',
    'selectionToUse-allDocuments': 'Använd alla dokument',
    'selectionToUse-currentFilters': 'Använd aktuella filter',
    'selectionToUse-currentSelection': 'Använd nuvarande urval',
    totalDocumentsCount: '{{count}} totala dokument',
  },
}

export const sv: PluginLanguage = {
  dateFNSKey: 'sv',
  translations: svTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: ta.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/ta.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const taTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'அனைத்து மொழிகள்',
    exportDocumentLabel: '{{label}} ஏற்றுமதி',
    exportOptions: 'ஏற்றுமதி விருப்பங்கள்',
    'field-depth-label': 'ஆழம்',
    'field-drafts-label': 'வரைவுகளைச் சேர்க்கவும்',
    'field-fields-label': 'புலங்கள்',
    'field-format-label': 'ஏற்றுமதி வடிவம்',
    'field-limit-label': 'வரம்பு',
    'field-locale-label': 'மொழி',
    'field-name-label': 'கோப்பு பெயர்',
    'field-page-label': 'பக்கம்',
    'field-selectionToUse-label': 'பயன்படுத்தத் தேர்வு',
    'field-sort-label': 'இதன்படி வரிசைப்படுத்து',
    'field-sort-order-label': 'வரிசைப்படுத்தும் ஒழுங்கு',
    'selectionToUse-allDocuments': 'அனைத்து ஆவணங்களையும் பயன்படுத்தவும்',
    'selectionToUse-currentFilters': 'தற்போதைய வடிப்பான்களை பயன்படுத்தவும்',
    'selectionToUse-currentSelection': 'தற்போதைய தேர்வைப் பயன்படுத்தவும்',
    totalDocumentsCount: 'மொத்தம் {{count}} ஆவணங்கள்',
  },
}

export const ta: PluginLanguage = {
  dateFNSKey: 'ta',
  translations: taTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: th.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/th.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const thTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'ทุกสถานที่',
    exportDocumentLabel: 'ส่งออก {{label}}',
    exportOptions: 'ตัวเลือกการส่งออก',
    'field-depth-label': 'ความลึก',
    'field-drafts-label': 'รวมฉบับร่าง',
    'field-fields-label': 'สนาม',
    'field-format-label': 'รูปแบบการส่งออก',
    'field-limit-label': 'จำกัด',
    'field-locale-label': 'ที่ตั้ง',
    'field-name-label': 'ชื่อไฟล์',
    'field-page-label': 'หน้า',
    'field-selectionToUse-label': 'การเลือกใช้',
    'field-sort-label': 'เรียงตาม',
    'field-sort-order-label': 'เรียงลำดับตาม',
    'selectionToUse-allDocuments': 'ใช้เอกสารทั้งหมด',
    'selectionToUse-currentFilters': 'ใช้ตัวกรองปัจจุบัน',
    'selectionToUse-currentSelection': 'ใช้การเลือกปัจจุบัน',
    totalDocumentsCount: '{{count}} เอกสารทั้งหมด',
  },
}

export const th: PluginLanguage = {
  dateFNSKey: 'th',
  translations: thTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: tr.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/tr.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const trTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Tüm yerler',
    exportDocumentLabel: '{{label}} dışa aktar',
    exportOptions: 'İhracat Seçenekleri',
    'field-depth-label': 'Derinlik',
    'field-drafts-label': 'Taslakları dahil et',
    'field-fields-label': 'Alanlar',
    'field-format-label': 'İhracat Formatı',
    'field-limit-label': 'Sınır',
    'field-locale-label': 'Yerel',
    'field-name-label': 'Dosya adı',
    'field-page-label': 'Sayfa',
    'field-selectionToUse-label': 'Kullanılacak seçim',
    'field-sort-label': 'Sırala',
    'field-sort-order-label': 'Sıralama düzeni',
    'selectionToUse-allDocuments': 'Tüm belgeleri kullanın',
    'selectionToUse-currentFilters': 'Mevcut filtreleri kullanın',
    'selectionToUse-currentSelection': 'Mevcut seçimi kullanın',
    totalDocumentsCount: '{{count}} toplam belge',
  },
}

export const tr: PluginLanguage = {
  dateFNSKey: 'tr',
  translations: trTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: translation-schema.json]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/translation-schema.json

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "properties": {
    "$schema": {
      "type": "string"
    },
    "plugin-import-export": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "export": {
          "type": "string"
        },
        "import": {
          "type": "string"
        },
        "allLocales": {
          "type": "string"
        },
        "download": {
          "type": "string"
        },
        "exportDocumentLabel": {
          "type": "string"
        },
        "exportOptions": {
          "type": "string"
        },
        "field-depth-label": {
          "type": "string"
        },
        "field-drafts-label": {
          "type": "string"
        },
        "field-fields-label": {
          "type": "string"
        },
        "field-format-label": {
          "type": "string"
        },
        "field-limit-label": {
          "type": "string"
        },
        "field-locale-label": {
          "type": "string"
        },
        "field-name-label": {
          "type": "string"
        },
        "field-page-label": {
          "type": "string"
        },
        "field-selectionToUse-label": {
          "type": "string"
        },
        "field-sort-label": {
          "type": "string"
        },
        "field-sort-order-label": {
          "type": "string"
        },
        "no": {
          "type": "string"
        },
        "preview": {
          "type": "string"
        },
        "selectionToUse-allDocuments": {
          "type": "string"
        },
        "selectionToUse-currentFilters": {
          "type": "string"
        },
        "selectionToUse-currentSelection": {
          "type": "string"
        },
        "totalDocumentsCount": {
          "type": "string"
        },
        "yes": {
          "type": "string"
        }
      },
      "required": [
        "export",
        "import",
        "allLocales",
        "download",
        "exportDocumentLabel",
        "exportOptions",
        "field-depth-label",
        "field-drafts-label",
        "field-fields-label",
        "field-format-label",
        "field-limit-label",
        "field-locale-label",
        "field-name-label",
        "field-selectionToUse-label",
        "field-sort-label",
        "field-sort-order-label",
        "no",
        "preview",
        "selectionToUse-allDocuments",
        "selectionToUse-currentFilters",
        "selectionToUse-currentSelection",
        "totalDocumentsCount",
        "yes"
      ]
    }
  },
  "required": ["plugin-import-export"]
}
```

--------------------------------------------------------------------------------

---[FILE: uk.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/uk.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const ukTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Всі локалі',
    exportDocumentLabel: 'Експорт {{label}}',
    exportOptions: 'Опції експорту',
    'field-depth-label': 'Глибина',
    'field-drafts-label': 'Включити чернетки',
    'field-fields-label': 'Поля',
    'field-format-label': 'Формат експорту',
    'field-limit-label': 'Обмеження',
    'field-locale-label': 'Локалізація',
    'field-name-label': 'Назва файлу',
    'field-page-label': 'Сторінка',
    'field-selectionToUse-label': 'Вибір для використання',
    'field-sort-label': 'Сортувати за',
    'field-sort-order-label': 'Сортувати за порядком',
    'selectionToUse-allDocuments': 'Використовуйте всі документи',
    'selectionToUse-currentFilters': 'Використовувати поточні фільтри',
    'selectionToUse-currentSelection': 'Використовуйте поточний вибір',
    totalDocumentsCount: '{{count}} всього документів',
  },
}

export const uk: PluginLanguage = {
  dateFNSKey: 'uk',
  translations: ukTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: vi.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/vi.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const viTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: 'Tất cả ngôn ngữ',
    exportDocumentLabel: 'Xuất {{label}}',
    exportOptions: 'Tùy chọn xuất',
    'field-depth-label': 'Độ sâu',
    'field-drafts-label': 'Bao gồm bản thảo',
    'field-fields-label': 'Trường',
    'field-format-label': 'Định dạng xuất',
    'field-limit-label': 'Giới hạn',
    'field-locale-label': 'Ngôn ngữ',
    'field-name-label': 'Tên tệp',
    'field-page-label': 'Trang',
    'field-selectionToUse-label': 'Chọn để sử dụng',
    'field-sort-label': 'Sắp xếp theo',
    'field-sort-order-label': 'Sắp xếp theo thứ tự',
    'selectionToUse-allDocuments': 'Dùng tất cả',
    'selectionToUse-currentFilters': 'Dùng bộ lọc hiện tại',
    'selectionToUse-currentSelection': 'Dùng đang chọn',
    totalDocumentsCount: 'Tổng cộng {{count}} tài liệu',
  },
}

export const vi: PluginLanguage = {
  dateFNSKey: 'vi',
  translations: viTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: zh.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/zh.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const zhTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: '所有语言环境',
    exportDocumentLabel: '导出{{label}}',
    exportOptions: '导出选项',
    'field-depth-label': '深度',
    'field-drafts-label': '包括草稿',
    'field-fields-label': '字段',
    'field-format-label': '导出格式',
    'field-limit-label': '限制',
    'field-locale-label': '语言环境',
    'field-name-label': '文件名',
    'field-page-label': '页面',
    'field-selectionToUse-label': '选择范围',
    'field-sort-label': '排序方式',
    'field-sort-order-label': '排序顺序',
    'selectionToUse-allDocuments': '使用所有文档',
    'selectionToUse-currentFilters': '使用当前过滤条件',
    'selectionToUse-currentSelection': '使用当前选择',
    totalDocumentsCount: '总共{{count}}份文件',
  },
}

export const zh: PluginLanguage = {
  dateFNSKey: 'zh-CN',
  translations: zhTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: zhTw.ts]---
Location: payload-main/packages/plugin-import-export/src/translations/languages/zhTw.ts

```typescript
import type { PluginDefaultTranslationsObject, PluginLanguage } from '../types.js'

export const zhTwTranslations: PluginDefaultTranslationsObject = {
  'plugin-import-export': {
    allLocales: '所有語言地區',
    exportDocumentLabel: '匯出 {{label}}',
    exportOptions: '匯出選項',
    'field-depth-label': '層級深度',
    'field-drafts-label': '包含草稿',
    'field-fields-label': '欄位',
    'field-format-label': '匯出格式',
    'field-limit-label': '筆數上限',
    'field-locale-label': '語言地區',
    'field-name-label': '檔案名稱',
    'field-page-label': '頁面',
    'field-selectionToUse-label': '使用的選取範圍',
    'field-sort-label': '排序方式',
    'field-sort-order-label': '排序順序',
    'selectionToUse-allDocuments': '使用所有文件',
    'selectionToUse-currentFilters': '使用目前篩選條件',
    'selectionToUse-currentSelection': '使用目前選取內容',
    totalDocumentsCount: '共 {{count}} 筆文件',
  },
}

export const zhTw: PluginLanguage = {
  dateFNSKey: 'zh-TW',
  translations: zhTwTranslations,
}
```

--------------------------------------------------------------------------------

---[FILE: buildDisabledFieldRegex.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/buildDisabledFieldRegex.ts

```typescript
/**
 * Builds a RegExp that matches flattened field keys from a given dot-notated path.
 */
export const buildDisabledFieldRegex = (path: string): RegExp => {
  const parts = path.split('.')

  const patternParts = parts.map((part) => {
    return `${part}(?:_\\d+)?(?:_[^_]+)?`
  })

  const pattern = `^${patternParts.join('_')}(?:_.*)?$`
  return new RegExp(pattern)
}
```

--------------------------------------------------------------------------------

---[FILE: collectDisabledFieldPaths.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/collectDisabledFieldPaths.ts

```typescript
import type { Field } from 'payload'

import { traverseFields } from 'payload'
import { fieldAffectsData } from 'payload/shared'

/**
 * Recursively traverses a Payload field schema to collect all field paths
 * that are explicitly disabled for the import/export plugin via:
 *   field.custom['plugin-import-export'].disabled
 *
 * Handles nested fields including named tabs, groups, arrays, blocks, etc.
 * Tracks each field’s path by storing it in `ref.path` and manually propagating
 * it through named tab layers via a temporary `__manualRef` marker.
 *
 * @param fields - The top-level array of Payload field definitions
 * @returns An array of dot-notated field paths that are marked as disabled
 */
export const collectDisabledFieldPaths = (fields: Field[]): string[] => {
  const disabledPaths: string[] = []

  traverseFields({
    callback: ({ field, next, parentRef, ref }) => {
      // Handle named tabs
      if (field.type === 'tabs' && Array.isArray(field.tabs)) {
        for (const tab of field.tabs) {
          if ('name' in tab && typeof tab.name === 'string') {
            // Build the path prefix for this tab
            const parentPath =
              parentRef && typeof (parentRef as { path?: unknown }).path === 'string'
                ? (parentRef as { path: string }).path
                : ''
            const tabPath = parentPath ? `${parentPath}.${tab.name}` : tab.name

            // Prepare a ref for this named tab's children to inherit the path
            const refObj = ref as Record<string, any>
            const tabRef = refObj[tab.name] ?? {}
            tabRef.path = tabPath
            tabRef.__manualRef = true // flag this as a manually constructed parentRef
            refObj[tab.name] = tabRef
          }
        }

        // Skip further processing of the tab container itself
        return
      }

      // Skip unnamed fields (e.g. rows/collapsibles)
      if (!('name' in field) || typeof field.name !== 'string') {
        return
      }

      // Determine the path to the current field
      let parentPath: string | undefined

      if (
        parentRef &&
        typeof parentRef === 'object' &&
        'path' in parentRef &&
        typeof (parentRef as { path?: unknown }).path === 'string'
      ) {
        parentPath = (parentRef as { path: string }).path
      } else if ((ref as any)?.__manualRef && typeof (ref as any)?.path === 'string') {
        // Fallback: if current ref is a manual tabRef, use its path
        parentPath = (ref as any).path
      }

      const fullPath = parentPath ? `${parentPath}.${field.name}` : field.name

      // Store current path for any nested children to use
      ;(ref as any).path = fullPath

      // If field is a data-affecting field and disabled via plugin config, collect its path
      if (fieldAffectsData(field) && field.custom?.['plugin-import-export']?.disabled) {
        disabledPaths.push(fullPath)
        return next?.()
      }
    },
    fields,
  })

  return disabledPaths
}
```

--------------------------------------------------------------------------------

---[FILE: getFlattenedFieldKeys.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/getFlattenedFieldKeys.ts

```typescript
import { type FlattenedField } from 'payload'

type FieldWithPresentational =
  | {
      fields?: FlattenedField[]
      name?: string
      tabs?: {
        fields: FlattenedField[]
        name?: string
      }[]
      type: 'collapsible' | 'row' | 'tabs'
    }
  | FlattenedField

export const getFlattenedFieldKeys = (fields: FieldWithPresentational[], prefix = ''): string[] => {
  const keys: string[] = []

  fields.forEach((field) => {
    const fieldHasToCSVFunction =
      'custom' in field &&
      typeof field.custom === 'object' &&
      'plugin-import-export' in field.custom &&
      field.custom['plugin-import-export']?.toCSV

    const name = 'name' in field && typeof field.name === 'string' ? field.name : undefined
    const fullKey = name && prefix ? `${prefix}_${name}` : (name ?? prefix)

    switch (field.type) {
      case 'array': {
        const subKeys = getFlattenedFieldKeys(field.fields as FlattenedField[], `${fullKey}_0`)
        keys.push(...subKeys)
        break
      }
      case 'blocks': {
        field.blocks.forEach((block) => {
          const blockPrefix = `${fullKey}_0_${block.slug}`
          keys.push(`${blockPrefix}_blockType`)
          keys.push(`${blockPrefix}_id`)
          keys.push(...getFlattenedFieldKeys(block.fields as FlattenedField[], blockPrefix))
        })
        break
      }
      case 'collapsible':
      case 'group':
      case 'row':
        keys.push(...getFlattenedFieldKeys(field.fields as FlattenedField[], fullKey))
        break
      case 'relationship':
        if (field.hasMany) {
          if (Array.isArray(field.relationTo)) {
            // hasMany polymorphic
            keys.push(`${fullKey}_0_relationTo`, `${fullKey}_0_id`)
          } else {
            // hasMany monomorphic
            keys.push(`${fullKey}_0_id`)
          }
        } else {
          if (Array.isArray(field.relationTo)) {
            // hasOne polymorphic
            keys.push(`${fullKey}_relationTo`, `${fullKey}_id`)
          } else {
            // hasOne monomorphic
            keys.push(fullKey)
          }
        }
        break
      case 'tabs':
        field.tabs?.forEach((tab) => {
          const tabPrefix = tab.name ? `${fullKey}_${tab.name}` : fullKey
          keys.push(...getFlattenedFieldKeys(tab.fields || [], tabPrefix))
        })
        break
      default:
        if (!name || fieldHasToCSVFunction) {
          break
        }
        if ('hasMany' in field && field.hasMany) {
          // Push placeholder for first index
          keys.push(`${fullKey}_0`)
        } else {
          keys.push(fullKey)
        }
        break
    }
  })

  return keys
}
```

--------------------------------------------------------------------------------

---[FILE: getvalueAtPath.ts]---
Location: payload-main/packages/plugin-import-export/src/utilities/getvalueAtPath.ts

```typescript
/**
 * Safely retrieves a deeply nested value from an object using a dot-notation path.
 *
 * Supports:
 * - Indexed array access (e.g., "array.0.field1")
 * - Polymorphic blocks or keyed unions (e.g., "blocks.0.hero.title"), where the block key
 *   (e.g., "hero") maps to a nested object inside the block item.
 *
 *
 * @param obj - The input object to traverse.
 * @param path - A dot-separated string representing the path to retrieve.
 * @returns The value at the specified path, or undefined if not found.
 */
export const getValueAtPath = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== 'object') {
    return undefined
  }

  const parts = path.split('.')
  let current: any = obj

  for (const part of parts) {
    if (current == null) {
      return undefined
    }

    // If the path part is a number, treat it as an array index
    if (!isNaN(Number(part))) {
      current = current[Number(part)]
      continue
    }

    // Special case: if current is an array of blocks like [{ hero: { title: '...' } }]
    // and the path is "blocks.0.hero.title", then `part` would be "hero"
    if (Array.isArray(current)) {
      const idx = Number(parts[parts.indexOf(part) - 1])
      const blockItem = current[idx]

      if (typeof blockItem === 'object') {
        const keys = Object.keys(blockItem)

        // Find the key (e.g., "hero") that maps to an object
        const matchingBlock = keys.find(
          (key) => blockItem[key] && typeof blockItem[key] === 'object',
        )

        if (matchingBlock && part === matchingBlock) {
          current = blockItem[matchingBlock]
          continue
        }
      }
    }

    // Fallback to plain object key access
    current = current[part]
  }

  return current
}
```

--------------------------------------------------------------------------------

````
