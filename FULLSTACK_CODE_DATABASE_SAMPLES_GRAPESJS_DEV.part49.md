---
source_txt: fullstack_samples/grapesjs-dev
converted_utc: 2025-12-18T13:04:40Z
part: 49
parts_total: 97
---

# FULLSTACK CODE DATABASE SAMPLES grapesjs-dev

## Verbatim Content (Part 49 of 97)

````text
================================================================================
FULLSTACK SAMPLES CODE DATABASE (VERBATIM) - grapesjs-dev
================================================================================
Generated: December 18, 2025
Source: fullstack_samples/grapesjs-dev
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: index.ts]---
Location: grapesjs-dev/packages/core/src/i18n/index.ts

```typescript
/**
 * You can customize the initial state of the module from the editor initialization, by passing the following [Configuration Object](https://github.com/GrapesJS/grapesjs/blob/master/src/i18n/config.ts)
 * ```js
 * const editor = grapesjs.init({
 *  i18n: {
 *    locale: 'en',
 *    localeFallback: 'en',
 *    messages: {
 *      it: { hello: 'Ciao', ... },
 *      ...
 *    }
 *  }
 * })
 * ```
 *
 * Once the editor is instantiated you can use its API. Before using these methods you should get the module from the instance
 *
 * ```js
 * const i18n = editor.I18n;
 * ```
 *
 * {REPLACE_EVENTS}
 *
 * @module I18n
 */
import { isUndefined, isString } from 'underscore';
import { Module } from '../abstract';
import EditorModel from '../editor/model/Editor';
import { hasWin, deepMerge } from '../utils/mixins';
import defConfig, { I18nConfig } from './config';
import I18nEvents, { Messages } from './types';

export default class I18nModule extends Module<I18nConfig & { stylePrefix?: string }> {
  events = I18nEvents;

  /**
   * Initialize module
   * @param {Object} config Configurations
   * @private
   */
  constructor(em: EditorModel) {
    super(em, 'I18n', defConfig());
    const add = this.config.messagesAdd;
    add && this.addMessages(add);

    if (this.config.detectLocale) {
      this.config.locale = this._localLang();
    }
  }

  /**
   * Get configuration object
   * @name getConfig
   * @function
   * @return {Object}
   */

  /**
   * Update current locale
   * @param {String} locale Locale value
   * @returns {this}
   * @example
   * i18n.setLocale('it');
   */
  setLocale(locale: string) {
    const { em, config, events } = this;
    em.trigger(events.locale, { value: locale, valuePrev: config.locale });
    config.locale = locale;
    return this;
  }

  /**
   * Get current locale
   * @returns {String} Current locale value
   */
  getLocale() {
    return this.config.locale!;
  }

  /**
   * Get all messages
   * @param {String} [lang] Specify the language of messages to return
   * @param {Object} [opts] Options
   * @param {Boolean} [opts.debug] Show warnings in case of missing language
   * @returns {Object}
   * @example
   * i18n.getMessages();
   * // -> { en: { hello: '...' }, ... }
   * i18n.getMessages('en');
   * // -> { hello: '...' }
   */
  getMessages(lang?: string, opts = {}) {
    const messages = this.config.messages!;
    lang && !messages[lang] && this._debug(`'${lang}' i18n lang not found`, opts);
    return lang ? messages[lang] : messages;
  }

  /**
   * Set new set of messages
   * @param {Object} msg Set of messages
   * @returns {this}
   * @example
   * i18n.getMessages();
   * // -> { en: { msg1: 'Msg 1', msg2: 'Msg 2', } }
   * i18n.setMessages({ en: { msg2: 'Msg 2 up', msg3: 'Msg 3', } });
   * // Set replaced
   * i18n.getMessages();
   * // -> { en: { msg2: 'Msg 2 up', msg3: 'Msg 3', } }
   */
  setMessages(msg: Messages) {
    const { em, config, events } = this;
    config.messages = msg;
    em.trigger(events.update, msg);
    return this;
  }

  /**
   * Update messages
   * @param {Object} msg Set of messages to add
   * @returns {this}
   * @example
   * i18n.getMessages();
   * // -> { en: { msg1: 'Msg 1', msg2: 'Msg 2', } }
   * i18n.addMessages({ en: { msg2: 'Msg 2 up', msg3: 'Msg 3', } });
   * // Set updated
   * i18n.getMessages();
   * // -> { en: { msg1: 'Msg 1', msg2: 'Msg 2 up', msg3: 'Msg 3', } }
   */
  addMessages(msg: Messages) {
    const { em, events, config } = this;
    const { messages } = config;
    em.trigger(events.add, msg);
    this.setMessages(deepMerge(messages!, msg));

    return this;
  }

  /**
   * Translate the locale message
   * @param {String} key Label to translate
   * @param {Object} [opts] Options for the translation
   * @param {Object} [opts.params] Params for the translation
   * @param {Boolean} [opts.debug] Show warnings in case of missing resources
   * @returns {String}
   * @example
   * obj.setMessages({
   *  en: { msg: 'Msg', msg2: 'Msg {test}'},
   *  it: { msg2: 'Msg {test} it'},
   * });
   * obj.t('msg');
   * // -> outputs `Msg`
   * obj.t('msg2', { params: { test: 'hello' } });  // use params
   * // -> outputs `Msg hello`
   * obj.t('msg2', { l: 'it', params: { test: 'hello' } });  // custom local
   * // -> outputs `Msg hello it`
   */
  t(key: string, opts: Record<string, any> = {}) {
    const { config } = this;
    const param = opts.params || {};
    const locale = opts.l || this.getLocale();
    const localeFlb = opts.lFlb || config.localeFallback;
    let result = this._getMsg(key, locale, opts);

    // Try with fallback
    if (!result) result = this._getMsg(key, localeFlb, opts);

    !result && this._debug(`'${key}' i18n key not found in '${locale}' lang`, opts);
    result = result && isString(result) ? this._addParams(result, param) : result;

    return result;
  }

  _localLang() {
    const nav = (hasWin() && window.navigator) || {};
    // @ts-ignore
    const lang = nav.language || nav.userLanguage;
    return lang ? lang.split('-')[0] : 'en';
  }

  _addParams(str: string, params: Record<string, any>) {
    const reg = new RegExp('{([\\w\\d-]*)}', 'g');
    return str.replace(reg, (m, val) => params[val] || '').trim();
  }

  _getMsg(key: string, locale: string, opts = {}) {
    const msgSet = this.getMessages(locale, opts);

    // Lang set is missing
    if (!msgSet) return;

    let result = msgSet[key];

    // Check for nested getter
    if (!result && key.indexOf('.') > 0) {
      result = key.split('.').reduce((lang, key) => {
        if (isUndefined(lang)) return;
        return lang[key];
      }, msgSet);
    }

    return result;
  }

  _debug(str: string, opts: { debug?: boolean } = {}) {
    const { em, config } = this;
    (opts.debug || config.debug) && em && em.logWarning(str);
  }

  destroy() {}
}
```

--------------------------------------------------------------------------------

---[FILE: types.ts]---
Location: grapesjs-dev/packages/core/src/i18n/types.ts

```typescript
import { I18nConfig } from './config';

export type Messages = Required<I18nConfig>['messages'];

/**{START_EVENTS}*/
export enum I18nEvents {
  /**
   * @event `i18n:add` New set of messages is added.
   * @example
   * editor.on('i18n:add', (messages) => { ... });
   */
  add = 'i18n:add',

  /**
   * @event `i18n:update` The set of messages is updated.
   * @example
   * editor.on('i18n:update', (messages) => { ... });
   */
  update = 'i18n:update',

  /**
   * @event `i18n:locale` Locale changed.
   * @example
   * editor.on('i18n:locale', ({ value, valuePrev }) => { ... });
   */
  locale = 'i18n:locale',
}
/**{END_EVENTS}*/

// need this to avoid the TS documentation generator to break
export default I18nEvents;
```

--------------------------------------------------------------------------------

---[FILE: ar.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/ar.js

```javascript
const traitInputAttr = { placeholder: 'مثال. نص هنا' };

export default {
  assetManager: {
    addButton: 'إضافة',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'اختر الصورة',
    uploadTitle: 'قم بإسقاط الملفات هنا أو انقر للرفع',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'علبة',
      wrapper: 'غلاف',
      text: 'نص',
      comment: 'تعليق',
      image: 'صورة',
      video: 'فيديو',
      label: 'عنوان',
      link: 'رابط',
      map: 'خريطة',
      tfoot: 'تذييل الجدول',
      tbody: 'محتوى الجدول',
      thead: 'رأس الجدول',
      table: 'جدول',
      row: 'صف',
      cell: 'سلول جدول',
    },
  },
  deviceManager: {
    device: 'جهاز',
    devices: {
      desktop: 'مكتبي',
      tablet: 'لوحي',
      mobileLandscape: 'جوال أفقي',
      mobilePortrait: 'جوال رأسي',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'عرض',
        fullscreen: 'شاشة كاملة',
        'sw-visibility': 'إظهار الحواف',
        'export-template': 'تصدير',
        'open-sm': 'فتح إعدادات النمط',
        'open-tm': 'فتح إعدادات السمات',
        'open-layers': 'فتح إعدادات الطبقات',
        'open-blocks': 'فتح إعدادات العناصر',
      },
    },
  },
  selectorManager: {
    label: 'الفئات',
    selected: 'محدد',
    emptyState: '- الحالة -',
    states: {
      hover: 'حائم',
      active: 'مفعل',
      'nth-of-type(2n)': 'زوجي/فردي',
    },
  },
  styleManager: {
    empty: 'حدد عنصرًا قبل استخدام مدير النمط',
    layer: 'طبقة',
    fileButton: 'الصور',
    sectors: {
      general: 'عام',
      layout: 'تخطيط',
      typography: 'الكتابة',
      decorations: 'التزيين',
      extra: 'إضافي',
      flex: 'فلکس',
      dimension: 'الأبعاد',
    },
    // The core library generates the name by their `property` name
    properties: {
      // float: 'Float',
    },
  },
  traitManager: {
    empty: 'حدد عنصرًا قبل استخدام مدير السمات',
    label: 'إعدادات السمات',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'مثال: https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'نفس الصفحة',
          _blank: 'صفحة أخرى',
        },
      },
    },
  },
  storageManager: {
    recover: 'هل تريد استرداد التغييرات غير المحفوظة؟',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: bs.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/bs.js

```javascript
const traitInputAttr = { placeholder: 'Ovdje ide tekst' };

export default {
  assetManager: {
    addButton: 'Dodaj sliku',
    inputPlh: 'http://putanja/url/do/slike.jpg',
    modalTitle: 'Odaberi sliku',
    uploadTitle: 'Ubaci datoteke ovdje ili klikni za Upload',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Boks',
      wrapper: 'Struktura',
      text: 'Tekst',
      comment: 'Komentar',
      image: 'Slika',
      video: 'Video',
      label: 'Oznaka',
      link: 'Link',
      map: 'Mapa',
      tfoot: 'Podnožje tabele',
      tbody: 'Struktura tabele',
      thead: 'Zaglavlje tabele',
      table: 'Tabela',
      row: 'Red tabele',
      cell: 'Ćelija tabele',
    },
  },
  deviceManager: {
    device: 'Uređaj',
    devices: {
      desktop: 'Računar',
      tablet: 'Tablet',
      mobileLandscape: 'Mobitel vodoravno',
      mobilePortrait: 'Mobitel uspravno',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Pregled',
        fullscreen: 'Čitav ekran',
        'sw-visibility': 'Vidi komponente',
        'export-template': 'Vidi kod',
        'open-sm': 'Otvori postavke izgleda',
        'open-tm': 'Postavke',
        'open-layers': 'Otvori postavke slojeva',
        'open-blocks': 'Otvori blokove',
      },
    },
  },
  selectorManager: {
    label: 'Klase',
    selected: 'Odabrano',
    emptyState: '- Stanje -',
    states: {
      hover: 'Miš preko',
      active: 'Kliknuto',
      'nth-of-type(2n)': 'Parno/Neparno',
    },
  },
  styleManager: {
    empty: 'Odaberi element prije korištenja Postavki Izgleda',
    layer: 'Sloj',
    fileButton: 'Slike',
    sectors: {
      general: 'Općenito',
      layout: 'Raspored',
      typography: 'Izgled teksta',
      decorations: 'Dekoracije',
      extra: 'Dodatno',
      flex: 'Flex',
      dimension: 'Dimenzije',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Plutanje',
      display: 'Prikaz',
      position: 'Pozicija',
      top: 'Vrh',
      right: 'Desno',
      left: 'Lijevo',
      bottom: 'Dno',
      width: 'Širina',
      height: 'Visina',
      'max-width': 'Maksimalna širina',
      'max-height': 'Maksimalna visina',
      margin: 'Margina',
      'margin-top': 'Margina od vrha',
      'margin-right': 'Margina od desno',
      'margin-left': 'Margina od lijevo',
      'margin-bottom': 'Margina od dna',
      padding: 'Unutrašnji razmak',
      'padding-top': 'Unutrašnji razmak od vrha',
      'padding-left': 'Unutrašnji razmak od lijevo',
      'padding-right': 'Unutrašnji razmak od desno',
      'padding-bottom': 'Unutrašnji razmak od dna',
      'font-family': 'Font',
      'font-size': 'Veličina fonta',
      'font-weight': 'Debljina fonta',
      'letter-spacing': 'Razmak između slova',
      color: 'Boja',
      'line-height': 'Visina lnije',
      'text-align': 'Ravnanje teksta',
      'text-shadow': 'Sjena teksta',
      'text-shadow-h': 'Sjena teksta: horizontalno',
      'text-shadow-v': 'Sjena teksta: vertikalno',
      'text-shadow-blur': 'Sjena teksta: zamagljenost',
      'text-shadow-color': 'Sjena teksta: boja',
      'border-top-left': 'Granica gore lijevo',
      'border-top-right': 'Granica gore desno',
      'border-bottom-left': 'Granica dole lijevo',
      'border-bottom-right': 'Granica dole desno',
      'border-radius-top-left': 'Zaobljenost granice gore lijevo',
      'border-radius-top-right': 'Zaobljenost granice gore desno',
      'border-radius-bottom-left': 'Zaobljenost granice dole lijevo',
      'border-radius-bottom-right': 'Zaobljenost granice dole desno',
      'border-radius': 'Zaobljenost granice',
      border: 'Granica',
      'border-width': 'Debljina granice',
      'border-style': 'Izgled granice',
      'border-color': 'Boja granice',
      'box-shadow': 'Sjena',
      'box-shadow-h': 'Sjena: horizontalno',
      'box-shadow-v': 'Sjena: vertikalno',
      'box-shadow-blur': 'Sjena: zamagljenost',
      'box-shadow-spread': 'Sjena: širenje',
      'box-shadow-color': 'Sjena: boja',
      'box-shadow-type': 'Sjena: tip',
      background: 'Pozadina',
      'background-image': 'Pozadinska slika',
      'background-repeat': 'Ponavljanje pozadine',
      'background-position': 'Pozicija pozadine',
      'background-attachment': 'Vezanost pozadine',
      'background-size': 'Veličina pozadine',
      'background-color': 'Boja pozadine',
      transition: 'Tranzicija',
      'transition-property': 'Tip tranzicije',
      'transition-duration': 'Trajanje tranzicije',
      'transition-timing-function': 'Vremenska funkcija tranzicije',
      perspective: 'Perspektiva',
      transform: 'Transformacija',
      'transform-rotate-x': 'Transformacija: Rotacija x',
      'transform-rotate-y': 'Transformacija: Rotacija y',
      'transform-rotate-z': 'Transformacija: Rotacija z',
      'transform-scale-x': 'Transformacija: Skala x',
      'transform-scale-y': 'Transformacija: Skala y',
      'transform-scale-z': 'Transformacija: Skala z',
      'flex-direction': 'Smjer Flex-a',
      'flex-wrap': 'Flex wrap',
      'justify-content': 'Rasporedi sadržaj',
      'align-items': 'Poravnaj stavke',
      'align-content': 'Poravnaj sadržaj',
      order: 'Red',
      'flex-basis': 'Flex Basis',
      'flex-grow': 'Flex Rast',
      'flex-shrink': 'Flex Smanjenje',
      'align-self': 'Poravnaj sebe',
    },
  },
  traitManager: {
    empty: 'Odaberi element prije korištenja Postavki Osobina',
    label: 'Postavke komponente',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Opis',
        // title: 'Naslov',
        // href: 'Link',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'npr. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Ovaj prozor',
          _blank: 'Novi prozor',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: ca.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/ca.js

```javascript
const traitInputAttr = { placeholder: 'ex. Text aquí' };

export default {
  assetManager: {
    addButton: 'Afegir imatge',
    inputPlh: 'http://ruta/a/la/imatge.jpg',
    modalTitle: 'Escollir imatge',
    uploadTitle: 'Arrossega els fitxers aquí o fes clic per a pujar-ne',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Capsa',
      wrapper: 'Cos',
      text: 'Text',
      comment: 'Comentari',
      image: 'Imatge',
      video: 'Vídeo',
      label: 'Etiqueta',
      link: 'Enllaç',
      map: 'Mapa',
      tfoot: 'Peu de la taula',
      tbody: 'Cos de la taula',
      thead: 'Capçalera de la taula',
      table: 'Taula',
      row: 'Fila de la taula',
      cell: 'Cel·la de la taula',
    },
  },
  deviceManager: {
    device: 'Dispositius',
    devices: {
      desktop: 'Escriptori',
      tablet: 'Tauleta',
      mobileLandscape: 'Mòbil en horitzontal',
      mobilePortrait: 'Mòbil en vertical',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Vista prèvia',
        fullscreen: 'Pantalla sencera',
        'sw-visibility': 'Veure components',
        'export-template': 'Veure codi',
        'open-sm': "Obrir Administrador d'estils",
        'open-tm': 'Configuració',
        'open-layers': 'Obrir Aministrador de capes',
        'open-blocks': 'Obrir Blocs',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Seleccionat',
    emptyState: '- Estat -',
    states: {
      hover: 'A sobre',
      active: 'Clic',
      'nth-of-type(2n)': 'Parell/Senar',
    },
  },
  styleManager: {
    empty: "Escull un element abans d'utilitzar l'Administrador d'estils",
    layer: 'Capa',
    fileButton: 'Imatges',
    sectors: {
      general: 'General',
      layout: 'Disseny',
      typography: 'Tipografia',
      decorations: 'Decoracions',
      extra: 'Extres',
      flex: 'Flex',
      dimension: 'Tamany',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Flotant',
      display: 'Vista',
      position: 'Posició',
      top: 'Superior',
      right: 'Dreta',
      left: 'Esquerra',
      bottom: 'Inferior',
      width: 'Ample',
      height: 'Alt',
      'max-width': 'Ample màx.',
      'max-height': 'Alt màx.',
      margin: 'Marge',
      'margin-top': 'Marge superior',
      'margin-right': 'Marge dret',
      'margin-left': 'Marge esquerra',
      'margin-bottom': 'Marge inferior',
      padding: 'Padding',
      'padding-top': 'Padding superior',
      'padding-left': 'Padding esquerra',
      'padding-right': 'Padding dret',
      'padding-bottom': 'Padding inferior',
      'font-family': 'Tipus de lletra',
      'font-size': 'Tamany de la font',
      'font-weight': 'Pes',
      'letter-spacing': 'Espai entre lletres',
      color: 'Color',
      'line-height': 'Interlineat',
      'text-align': 'Alineació del text',
      'text-shadow': 'Ombra del text',
      'text-shadow-h': 'Ombra del text: horizontal',
      'text-shadow-v': 'Ombra del text: vertical',
      'text-shadow-blur': "Desenfocament de l'ombra del text",
      'text-shadow-color': "Color de l'ombra del text",
      'border-top-left': 'Marc superior esquerra',
      'border-top-right': 'Marc superior dret',
      'border-bottom-left': 'Marc inferior esquerra',
      'border-bottom-right': 'Marc inferior dret',
      'border-radius-top-left': 'Radi del marc superior esquerra',
      'border-radius-top-right': 'Radi del marc superior dret',
      'border-radius-bottom-left': 'Radi del marc inferior esquerra',
      'border-radius-bottom-right': 'Radi del marc inferior dret',
      'border-radius': 'Radi del marc',
      border: 'Marc',
      'border-width': 'Ample del marc',
      'border-style': 'Estil del marc',
      'border-color': 'Color del marc',
      'box-shadow': 'Ombra de la capsa',
      'box-shadow-h': 'Ombra de la capsa: horizontal',
      'box-shadow-v': 'Ombra de la capsa: vertical',
      'box-shadow-blur': "Desenfocament de l'ombra de la capsa",
      'box-shadow-spread': "Propagació de l'ombra de la capsa",
      'box-shadow-color': "Color de l'ombra de la capsa",
      'box-shadow-type': "Tipus de l'ombra de la capsa",
      background: 'Fons',
      'background-image': 'Imatge de fons',
      'background-repeat': 'Repetir fons',
      'background-position': 'Posició del fons',
      'background-attachment': 'Desplaçament del fons',
      'background-size': 'Tamany del fons',
      transition: 'Transició',
      'transition-property': 'Tipus de transició',
      'transition-duration': 'Temps de transició',
      'transition-timing-function': 'Funció de temps de la transición',
      perspective: 'Perspectiva',
      transform: 'Transformació',
      'transform-rotate-x': 'Rotació horitzontal',
      'transform-rotate-y': 'Rotació vertical',
      'transform-rotate-z': 'Rotació profunditat',
      'transform-scale-x': 'Escalar horitzontalment',
      'transform-scale-y': 'Escalar verticalment',
      'transform-scale-z': 'Escalar profunditat',
      'flex-direction': 'Direcció flex',
      'flex-wrap': 'Distribució flex',
      'justify-content': 'Justificar contingut',
      'align-items': 'Alinear elements',
      'align-content': 'Alinear contingut',
      order: 'Ordre',
      'flex-basis': 'Base flex',
      'flex-grow': 'Creixement flex',
      'flex-shrink': 'Contracció flex',
      'align-self': 'Alineació pròpia',
      'background-color': 'Color de fons',
    },
  },
  traitManager: {
    empty: "Escull un element abans d'usar l'Administrador de característiques",
    label: 'Configuració de components',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'Identificador',
        alt: 'Títol alternatiu',
        title: 'Títol',
        href: 'Enllaç',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'ex. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Mateixa pestanya/finestra',
          _blank: 'Nova pestanya/finestra',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: de.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/de.js

```javascript
const traitInputAttr = { placeholder: 'z.B. Text hier' };

export default {
  assetManager: {
    addButton: 'Bild hinzufügen',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Bild auswählen',
    uploadTitle: 'Dateien hier ablegen oder zum Hochladen anklicken',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Kategorie Label',
    },
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: 'Text',
      comment: 'Kommentar',
      image: 'Bild',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Karte',
      tfoot: 'Tabellenfuß',
      tbody: 'Tabellenkörper',
      thead: 'Tabellenkopf',
      table: 'Tabelle',
      row: 'Tabellenzeile',
      cell: 'Tabellenzelle',
    },
  },
  deviceManager: {
    device: 'Gerät',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Mobil Landschaft',
      mobilePortrait: 'Mobil Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Vorschau',
        fullscreen: 'Vollbild',
        'sw-visibility': 'Komponenten anzeigen',
        'export-template': 'Code anzeigen',
        'open-sm': 'Style Manager öffnen',
        'open-tm': 'Einstellungen',
        'open-layers': 'Ebenen öffnen',
        'open-blocks': 'Blöcke öffnen',
      },
    },
  },
  selectorManager: {
    label: 'Klassen',
    selected: 'Ausgewählt',
    emptyState: '- Status -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Even/Odd',
    },
  },
  styleManager: {
    empty: 'Wählen Sie ein Element aus, bevor Sie den Style Manager verwenden',
    layer: 'Ebenen',
    fileButton: 'Bilder',
    sectors: {
      general: 'Allgemein',
      layout: 'Layout',
      typography: 'Typographie',
      decorations: 'Dekorationen',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Größen',
    },
    // The core library generates the name by their `property` name
    properties: {
      float: 'Ausrichtung',
      display: 'Anzeige',
      position: 'Position',
      top: 'Oben',
      right: 'Rechts',
      left: 'Links',
      bottom: 'Unten',
      width: 'Breite',
      height: 'Höhe',
      'max-width': 'Breite max.',
      'max-height': 'Höhe max.',
      margin: 'Äußerer Abstand',
      'margin-top': 'Äußerer Abstand oben',
      'margin-right': 'Äußerer Abstand rechts',
      'margin-left': 'Äußerer Abstand links',
      'margin-bottom': 'Äußerer Abstand unten',
      'margin-top-sub': 'Oben',
      'margin-right-sub': 'Rechts',
      'margin-bottom-sub': 'Unten',
      'margin-left-sub': 'Links',
      'padding-top-sub': 'Oben',
      'padding-right-sub': 'Rechts',
      'padding-bottom-sub': 'Unten',
      'padding-left-sub': 'Links',
      'border-width-sub': 'Breite',
      'border-style-sub': 'Stil',
      'border-color-sub': 'Farbe',
      'border-top-left-radius-sub': 'Oben links',
      'border-top-right-radius-sub': 'Oben rechts',
      'border-bottom-right-radius-sub': 'Unten rechts',
      'border-bottom-left-radius-sub': 'Unten links',
      padding: 'Innerer Abstand',
      'padding-top': 'Innerer Abstand oben',
      'padding-left': 'Innerer Abstand links',
      'padding-right': 'Innerer Abstand rechts',
      'padding-bottom': 'Innerer Abstand unten',
      'font-family': 'Schriftart',
      'font-size': 'Schriftgröße',
      'font-weight': 'Schriftstärke',
      'letter-spacing': 'Zeichenabstand',
      color: 'Schriftfarbe',
      'line-height': 'Zeilenhöhe',
      'text-align': 'Textausrichtung',
      'text-shadow': 'Textschatten',
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Unschärfe',
      'text-shadow-color': 'Farbe',
      'border-top-left': 'Rand oben links',
      'border-top-right': 'Rand oben rechts',
      'border-bottom-left': 'Rand unten links',
      'border-bottom-right': 'Rand unten rechts',
      'border-radius-top-left': 'Rand Radius oben links',
      'border-radius-top-right': 'Rand Radius oben rechts',
      'border-radius-bottom-left': 'Rand Radius unten links',
      'border-radius-bottom-right': 'Rand Radius unten rechts',
      'border-radius': 'Rand Radius',
      border: 'Rand',
      'border-width': 'Randbreite',
      'border-style': 'Randstil',
      'border-color': 'Randfarbe',
      'box-shadow': 'Boxschatten',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Unschärfe',
      'box-shadow-spread': 'Verteilung',
      'box-shadow-color': 'Farbe',
      'box-shadow-type': 'Typ',
      background: 'Hintergrund',
      'background-image': 'Hintergrundbild',
      'background-repeat': 'Hintergrund wiederholen',
      'background-position': 'Hintergrundposition',
      'background-attachment': 'Hintergrundanhang',
      'background-size': 'Hintergrundgröße',
      'background-color': 'Hintergrundfarbe',
      'background-image-sub': 'Bild',
      'background-repeat-sub': 'Wiederholung',
      'background-position-sub': 'Position',
      'background-attachment-sub': 'Anhang',
      'background-size-sub': 'Größe',
      transition: 'Übergang',
      'transition-property': 'Übergang: Typ',
      'transition-duration': 'Übergang: Dauer',
      'transition-timing-function': 'Übergang: Zeitfunktion',
      'transition-property-sub': 'Eigenschaft',
      'transition-duration-sub': 'Dauer',
      'transition-timing-function-sub': 'Zeit',
      perspective: 'Perspektive',
      transform: 'Transformation',
      'transform-rotate-x': 'Rotation X',
      'transform-rotate-y': 'Rotation Y',
      'transform-rotate-z': 'Rotation Z',
      'transform-scale-x': 'Skalierung X',
      'transform-scale-y': 'Skalierung Y',
      'transform-scale-z': 'Skalierung Z',
      'flex-direction': 'Flex Ausrichtung',
      'flex-wrap': 'Flex Wrap',
      'justify-content': 'Vertikale Ausrichtung',
      'align-items': 'Senkrechte Ausrichtung',
      'align-content': 'Achsenausrichtung',
      order: 'Reihenfolge',
      'flex-basis': 'Flex Basis',
      'flex-grow': 'Flex Wachsen',
      'flex-shrink': 'Flex Schrumpfen',
      'align-self': 'Eigene Ausrichtung',
    },
  },
  traitManager: {
    empty: 'Wählen Sie ein Element aus, bevor Sie den Eigenschaftsmanager verwenden',
    label: 'Komponenten Eigenschaften',
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        id: 'ID',
        alt: 'Alternativtext',
        title: 'Titel',
        href: 'Link',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'z.B. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'Dieses Fenster',
          _blank: 'Neues Fenster',
        },
      },
    },
  },
  storageManager: {
    recover: 'Möchten Sie ungespeicherte Änderungen wiederherstellen?',
  },
};
```

--------------------------------------------------------------------------------

---[FILE: el.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/el.js

```javascript
const traitInputAttr = { placeholder: 'eg. Text here' };

export default {
  assetManager: {
    addButton: 'Προσθήκη Εικόνας',
    inputPlh: 'http://διαδρομή/μέχρι/την/εικόνα.jpg',
    modalTitle: 'Επιλογή Εικόνας',
    uploadTitle: 'Αφήστε τα αρχεία εδώ ή κάντε κλικ για ανέβασμα',
  },
  // Εδώ υπάρχει απλά αναφορά, ο πυρήνας του GrapesJS δεν διαθέτει κανένα πλαίσιο,
  // οπότε αυτό θα πρέπει να αγνοηθεί από τα υπόλοιπα αρχεία μετάφρασης
  blockManager: {
    labels: {
      // 'block-id': 'Ετικέτα Πλαισίου',
    },
    categories: {
      // 'category-id': 'Ετικέτα Κατηγορίας',
    },
  },
  domComponents: {
    names: {
      '': 'Κουτί',
      wrapper: 'Κορμός',
      text: 'Κείμενο',
      comment: 'Σχόλιο',
      image: 'Εικόνα',
      video: 'Βίντεο',
      label: 'Ετικέτα',
      link: 'Σύνδεσμος',
      map: 'Χάρτης',
      tfoot: 'Υποσέλιδο πίνακα',
      tbody: 'Κορμός πίνακα',
      thead: 'Κεφαλίδα πίνακα',
      table: 'Πίνακας',
      row: 'Γραμμή πίνακα',
      cell: 'Κελί πίνακα',
    },
  },
  deviceManager: {
    device: 'Συσκευή',
    devices: {
      desktop: 'Σθαθερός Υπολογιστής',
      tablet: 'Τάμπλετ',
      mobileLandscape: 'Κινητό Οριζόντια',
      mobilePortrait: 'Κινητό Κάθετα',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Προεπισκόπηση',
        fullscreen: 'Πλήρη Οθόνη',
        'sw-visibility': 'Προβολή συστατικών',
        'export-template': 'Προβολή κώδικα',
        'open-sm': 'Άνοιγμα Του Διαχειριστή Μορφοποίησης',
        'open-tm': 'Ρυθμίσεις',
        'open-layers': 'Άνοιγμα Του Διαχειριστή Επιπέδων',
        'open-blocks': 'Άνοιγμα Πλαισίων',
      },
    },
  },
  selectorManager: {
    label: 'Κλάσεις',
    selected: 'Επιλεγμένο',
    emptyState: '- Κατάσταση -',
    states: {
      hover: 'Αιώρηση',
      active: 'Κλικ',
      'nth-of-type(2n)': 'Μονές/Ζυγές',
    },
  },
  styleManager: {
    empty: 'Επιλέξτε ένα στοιχεία πριν χρησιμοποιήσετε τον διαχειριστή μορφοποίησης',
    layer: 'Επίπεδο',
    fileButton: 'Εικόνες',
    sectors: {
      general: 'Γενικά',
      layout: 'Δομή',
      typography: 'Τυπογραφία',
      decorations: 'Μορφοποίηση',
      extra: 'Επιπρόσθετα',
      flex: 'Φλεξ',
      dimension: 'Διάσταση',
    },
    // Η βασική βιβλιοθήκη παράγει το όνομα από την δικού του `ιδιότητα` name
    properties: {
      // float: 'Float',
    },
  },
  traitManager: {
    empty: 'Επιλέξτε ένα στοιχεία πριν χρησιμοποιήσετε τον Διαχειριστή Χαρακτηριστικών',
    label: 'Ρυθμίσεις Συστατικού',
    traits: {
      // Η βασική βιβλιοθήκη παράγει το όνομα από την δικού του `ιδιότητα` name
      labels: {
        // id: 'Id',
        // alt: 'Εναλλακτικό Κείμενο',
        // title: 'Τίτλος',
        // href: 'Href',
      },
      // Σε ένα απλό χαρακτηριστικό, όπως ένα πεδίο κείμενο, χρησιμοποιούνται στις ιδιότητες του πεδίου εισαγωγής
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'πχ. https://google.gr' },
      },
      // Σε χαρακτηριστικό όπως το select, αυτά χρησιμοποιούνται για την μετάφραση των ονομάτων των επιλογών
      options: {
        target: {
          false: 'Στο ίδιο παράθυρο',
          _blank: 'Σε νέο παράθυρο',
        },
      },
    },
  },
};
```

--------------------------------------------------------------------------------

---[FILE: en.js]---
Location: grapesjs-dev/packages/core/src/i18n/locale/en.js

```javascript
const traitInputAttr = { placeholder: 'eg. Text here' };

export default {
  assetManager: {
    addButton: 'Add image',
    inputPlh: 'http://path/to/the/image.jpg',
    modalTitle: 'Select Image',
    uploadTitle: 'Drop files here or click to upload',
  },
  // Here just as a reference, GrapesJS core doesn't contain any block,
  // so this should be omitted from other local files
  blockManager: {
    labels: {
      // 'block-id': 'Block Label',
    },
    categories: {
      // 'category-id': 'Category Label',
    },
  },
  domComponents: {
    names: {
      '': 'Box',
      wrapper: 'Body',
      text: 'Text',
      comment: 'Comment',
      image: 'Image',
      video: 'Video',
      label: 'Label',
      link: 'Link',
      map: 'Map',
      tfoot: 'Table foot',
      tbody: 'Table body',
      thead: 'Table head',
      table: 'Table',
      row: 'Table row',
      cell: 'Table cell',
    },
  },
  deviceManager: {
    device: 'Device',
    devices: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobileLandscape: 'Mobile Landscape',
      mobilePortrait: 'Mobile Portrait',
    },
  },
  panels: {
    buttons: {
      titles: {
        preview: 'Preview',
        fullscreen: 'Fullscreen',
        'sw-visibility': 'View components',
        'export-template': 'View code',
        'open-sm': 'Open Style Manager',
        'open-tm': 'Settings',
        'open-layers': 'Open Layer Manager',
        'open-blocks': 'Open Blocks',
      },
    },
  },
  selectorManager: {
    label: 'Classes',
    selected: 'Selected',
    emptyState: '- State -',
    states: {
      hover: 'Hover',
      active: 'Click',
      'nth-of-type(2n)': 'Even/Odd',
    },
  },
  styleManager: {
    empty: 'Select an element before using Style Manager',
    layer: 'Layer',
    fileButton: 'Images',
    sectors: {
      general: 'General',
      layout: 'Layout',
      typography: 'Typography',
      decorations: 'Decorations',
      extra: 'Extra',
      flex: 'Flex',
      dimension: 'Dimension',
    },
    // Default names for sub properties in Composite and Stack types.
    // Other labels are generated directly from their property names (eg. 'font-size' will be 'Font size').
    properties: {
      'text-shadow-h': 'X',
      'text-shadow-v': 'Y',
      'text-shadow-blur': 'Blur',
      'text-shadow-color': 'Color',
      'box-shadow-h': 'X',
      'box-shadow-v': 'Y',
      'box-shadow-blur': 'Blur',
      'box-shadow-spread': 'Spread',
      'box-shadow-color': 'Color',
      'box-shadow-type': 'Type',
      'margin-top-sub': 'Top',
      'margin-right-sub': 'Right',
      'margin-bottom-sub': 'Bottom',
      'margin-left-sub': 'Left',
      'padding-top-sub': 'Top',
      'padding-right-sub': 'Right',
      'padding-bottom-sub': 'Bottom',
      'padding-left-sub': 'Left',
      'border-width-sub': 'Width',
      'border-style-sub': 'Style',
      'border-color-sub': 'Color',
      'border-top-left-radius-sub': 'Top Left',
      'border-top-right-radius-sub': 'Top Right',
      'border-bottom-right-radius-sub': 'Bottom Right',
      'border-bottom-left-radius-sub': 'Bottom Left',
      'transform-rotate-x': 'Rotate X',
      'transform-rotate-y': 'Rotate Y',
      'transform-rotate-z': 'Rotate Z',
      'transform-scale-x': 'Scale X',
      'transform-scale-y': 'Scale Y',
      'transform-scale-z': 'Scale Z',
      'transition-property-sub': 'Property',
      'transition-duration-sub': 'Duration',
      'transition-timing-function-sub': 'Timing',
      'background-image-sub': 'Image',
      'background-repeat-sub': 'Repeat',
      'background-position-sub': 'Position',
      'background-attachment-sub': 'Attachment',
      'background-size-sub': 'Size',
    },
    // Translate options in style properties
    // options: {
    //   float: { // Id of the property
    //     ...
    //     left: 'Left', // {option id}: {Option label}
    //   }
    // }
  },
  traitManager: {
    empty: 'Select an element before using Trait Manager',
    label: 'Component settings',
    categories: {
      // categoryId: 'Category label',
    },
    traits: {
      // The core library generates the name by their `name` property
      labels: {
        // id: 'Id',
        // alt: 'Alt',
        // title: 'Title',
        // href: 'Href',
      },
      // In a simple trait, like text input, these are used on input attributes
      attributes: {
        id: traitInputAttr,
        alt: traitInputAttr,
        title: traitInputAttr,
        href: { placeholder: 'eg. https://google.com' },
      },
      // In a trait like select, these are used to translate option names
      options: {
        target: {
          false: 'This window',
          _blank: 'New window',
        },
      },
    },
  },
  storageManager: {
    recover: 'Do you want to recover unsaved changes?',
  },
};
```

--------------------------------------------------------------------------------

````
